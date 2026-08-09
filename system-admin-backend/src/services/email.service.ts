import nodemailer from 'nodemailer';

interface SendOtpEmailParams {
  to: string;
  code: string;
}

export async function sendOtpEmail({ to, code }: SendOtpEmailParams): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const brevoApiKey = process.env.BREVO_API_KEY;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const fromEmail = process.env.SMTP_FROM || `"SkillForge Security" <${smtpUser || 'no-reply@skillforge.vn'}>`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 560px; margin: 0 auto; background-color: #0B1C2D; color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid rgba(58, 231, 225, 0.3);">
      <div style="padding: 24px 32px; background: linear-gradient(135deg, #0F253A 0%, #0B1C2D 100%); border-bottom: 1px solid rgba(255, 255, 255, 0.1); text-align: center;">
        <h2 style="color: #3AE7E1; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">SkillForge Platform</h2>
        <p style="color: #94A3B8; margin: 4px 0 0 0; font-size: 12px; font-weight: 600;">HỆ THỐNG QUẢN TRỊ BSC/KPI THỰC THI CHIẾN LƯỢC</p>
      </div>
      <div style="padding: 32px;">
        <h3 style="color: #ffffff; margin-top: 0; font-size: 18px; font-weight: 700;">Xác Thực Địa Chỉ Email Đăng Ký</h3>
        <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">Xin chào,</p>
        <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">Bạn đang thực hiện thanh toán và khởi tạo Doanh nghiệp trên nền tảng SkillForge. Mã xác thực OTP 6 chữ số của bạn là:</p>
        
        <div style="margin: 28px 0; text-align: center;">
          <div style="display: inline-block; padding: 14px 28px; background-color: rgba(58, 231, 225, 0.1); border: 1px solid #3AE7E1; border-radius: 12px; font-size: 32px; font-weight: 900; color: #3AE7E1; letter-spacing: 8px; font-family: monospace;">
            ${code}
          </div>
        </div>
        
        <p style="color: #94A3B8; font-size: 13px; line-height: 1.5;">⚠️ Mã OTP có hiệu lực trong vòng <strong>5 phút</strong>. Vui lòng không chia sẻ mã này cho bất kỳ ai để đảm bảo an toàn bảo mật.</p>
        
        <hr style="border: none; border-top: 1px solid rgba(255, 255, 255, 0.1); margin: 24px 0;" />
        
        <p style="color: #64748B; font-size: 12px; text-align: center; margin: 0;">
          Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.<br />
          &copy; 2026 SkillForge Execution Platform. All rights reserved.
        </p>
      </div>
    </div>
  `;

  // 1. Try Resend HTTPS API (Best for Cloud Hosting like Render)
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'SkillForge <onboarding@resend.dev>',
          to: [to],
          subject: `[SkillForge] Mã OTP xác thực Email đăng ký của bạn là: ${code}`,
          html: htmlContent,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`[EMAIL SERVICE SUCCESS via Resend HTTPS API] Real email sent to ${to} with OTP: ${code}`);
        return true;
      }
      console.error('[RESEND API ERROR]', data);
    } catch (e: any) {
      console.error('[RESEND FETCH ERROR]', e.message || e);
    }
  }

  // 2. Try Brevo HTTPS API
  if (brevoApiKey) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoApiKey.trim(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'SkillForge Security', email: smtpUser || 'no-reply@skillforge.vn' },
          to: [{ email: to }],
          subject: `[SkillForge] Mã OTP xác thực Email đăng ký của bạn là: ${code}`,
          htmlContent,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`[EMAIL SERVICE SUCCESS via Brevo HTTPS API] Real email sent to ${to} with OTP: ${code}`);
        return true;
      }
      console.error('[BREVO API ERROR]', data);
    } catch (e: any) {
      console.error('[BREVO FETCH ERROR]', e.message || e);
    }
  }

  // 3. Fallback to Nodemailer SMTP
  if (!smtpUser || !smtpPass) {
    console.log(`[EMAIL SERVICE WARNING] SMTP_USER or SMTP_PASS not set in environment variables.`);
    console.log(`[EMAIL SERVICE REAL OTP CODE] Sent to ${to} -> OTP Code: ${code}`);
    return false;
  }

  const cleanPass = smtpPass.replace(/\s+/g, '');
  const isPort465 = smtpPort === 465;

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: isPort465,
      auth: {
        user: smtpUser,
        pass: cleanPass,
      },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000,
      tls: {
        rejectUnauthorized: false,
      },
    });

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 560px; margin: 0 auto; background-color: #0B1C2D; color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid rgba(58, 231, 225, 0.3);">
        <div style="padding: 24px 32px; background: linear-gradient(135deg, #0F253A 0%, #0B1C2D 100%); border-bottom: 1px solid rgba(255, 255, 255, 0.1); text-align: center;">
          <h2 style="color: #3AE7E1; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">SkillForge Platform</h2>
          <p style="color: #94A3B8; margin: 4px 0 0 0; font-size: 12px; font-weight: 600;">HỆ THỐNG QUẢN TRỊ BSC/KPI THỰC THI CHIẾN LƯỢC</p>
        </div>
        <div style="padding: 32px;">
          <h3 style="color: #ffffff; margin-top: 0; font-size: 18px; font-weight: 700;">Xác Thực Địa Chỉ Email Đăng Ký</h3>
          <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">Xin chào,</p>
          <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">Bạn đang thực hiện thanh toán và khởi tạo Doanh nghiệp trên nền tảng SkillForge. Mã xác thực OTP 6 chữ số của bạn là:</p>
          
          <div style="margin: 28px 0; text-align: center;">
            <div style="display: inline-block; padding: 14px 28px; background-color: rgba(58, 231, 225, 0.1); border: 1px solid #3AE7E1; border-radius: 12px; font-size: 32px; font-weight: 900; color: #3AE7E1; letter-spacing: 8px; font-family: monospace;">
              ${code}
            </div>
          </div>
          
          <p style="color: #94A3B8; font-size: 13px; line-height: 1.5;">⚠️ Mã OTP có hiệu lực trong vòng <strong>5 phút</strong>. Vui lòng không chia sẻ mã này cho bất kỳ ai để đảm bảo an toàn bảo mật.</p>
          
          <hr style="border: none; border-top: 1px solid rgba(255, 255, 255, 0.1); margin: 24px 0;" />
          
          <p style="color: #64748B; font-size: 12px; text-align: center; margin: 0;">
            Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.<br />
            &copy; 2026 SkillForge Execution Platform. All rights reserved.
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: fromEmail,
      to,
      subject: `[SkillForge] Mã OTP xác thực Email đăng ký của bạn là: ${code}`,
      html: htmlContent,
    });

    console.log(`[EMAIL SERVICE SUCCESS] Real email sent to ${to} with OTP: ${code}`);
    return true;
  } catch (err: any) {
    console.error(`[EMAIL SERVICE ERROR] Failed to send email to ${to}:`, err.message || err);
    return false;
  }
}
