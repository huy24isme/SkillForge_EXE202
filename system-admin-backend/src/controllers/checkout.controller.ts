import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { payosService } from '../services/payos.service';
import { writeAuditLog } from '../services/auditLog.service';

/**
 * 1. POST /api/v1/public/checkout
 * Public checkout endpoint invoked by Landing Page
 */
export async function createCheckout(req: Request, res: Response) {
  const client = await pool.connect();
  try {
    const {
      companyName,
      taxCode,
      industry,
      size,
      adminName,
      adminEmail,
      adminPassword,
      phone,
      planCode = 'STARTER',
      cycle = 'MONTHLY',
    } = req.body;

    if (!companyName || !adminEmail) {
      return sendError(res, 'Tên công ty và email quản trị là bắt buộc', 400);
    }

    const cleanEmail = adminEmail.trim().toLowerCase();

    // Check if email already registered
    const dupCheck = await client.query(
      `SELECT id FROM user_accounts WHERE LOWER(email) = $1 LIMIT 1`,
      [cleanEmail]
    );
    if (dupCheck.rows.length > 0) {
      return sendError(res, 'Email quản trị này đã được đăng ký trên hệ thống', 400);
    }

    // Get Plan (Default to STARTER / 1.000.000 VNĐ)
    const targetPlanCode = (planCode || 'STARTER').toUpperCase();
    let planRes = await client.query(`SELECT * FROM system_plans WHERE code = $1 LIMIT 1`, [targetPlanCode]);
    if (planRes.rows.length === 0) {
      planRes = await client.query(`SELECT * FROM system_plans LIMIT 1`);
    }
    const plan = planRes.rows[0];
    const amount = 1000000; // Fixed 1.000.000 VNĐ for Basic plan as requested

    // Generate unique positive numeric orderCode for PayOS (max 9007199254740991)
    const orderCode = Math.floor(100000 + Math.random() * 900000); // 6-digit number

    // Generate Invoice Code: SKF-2026-XXXX
    const countRes = await client.query(`SELECT COUNT(*)::int as count FROM system_invoices`);
    const count = (countRes.rows[0].count || 0) + 1;
    const year = new Date().getFullYear();
    const invoiceCode = `SKF-${year}-${String(count).padStart(4, '0')}`;

    await client.query('BEGIN');

    // 1. Create company (status PENDING until payment)
    const compRes = await client.query(
      `INSERT INTO companies (id, name, tax_code, industry, size, status, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, 'PENDING', NOW(), NOW())
       RETURNING *`,
      [companyName.trim(), taxCode || '', industry || 'Công nghệ', size || '10-50']
    );
    const company = compRes.rows[0];

    // 2. Create department
    const deptRes = await client.query(
      `INSERT INTO departments (id, company_id, name, code, status, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, 'Ban Giám đốc', 'BGD', 'ACTIVE', NOW(), NOW())
       RETURNING id`,
      [company.id]
    );
    const deptId = deptRes.rows[0].id;

    // 3. Create admin employee
    const empRes = await client.query(
      `INSERT INTO employees (id, company_id, department_id, full_name, email, position_title, status, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, 'Quản trị viên Công ty', 'ACTIVE', NOW(), NOW())
       RETURNING id`,
      [company.id, deptId, (adminName || companyName + ' Admin').trim(), cleanEmail]
    );
    const empId = empRes.rows[0].id;

    // 4. Create user account
    const rawPassword = adminPassword || 'Admin@123456';
    const passwordHash = await bcrypt.hash(rawPassword, 10);
    await client.query(
      `INSERT INTO user_accounts (id, employee_id, email, password_hash, role, status, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, 'COMPANY_ADMIN', 'ACTIVE', NOW(), NOW())`,
      [empId, cleanEmail, passwordHash]
    );

    // 5. Generate Pending Invoice with ORDER_CODE in note
    const description = `SKF ${invoiceCode}`;
    await client.query(
      `INSERT INTO system_invoices (id, invoice_code, company_id, plan_id, cycle, amount, payment_method, status, note, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, 'MONTHLY', $4, 'payos_vietqr', 'PENDING', $5, NOW(), NOW())`,
      [invoiceCode, company.id, plan ? plan.id : company.id, amount, `ORDER_CODE:${orderCode}|PHONE:${phone || ''}`]
    );

    await client.query('COMMIT');

    // 6. Generate VietQR / PayOS link
    const payResult = await payosService.createPaymentLink({
      orderCode,
      amount,
      description,
    });

    return sendSuccess(res, {
      orderCode,
      invoiceCode,
      amount,
      companyName: company.name,
      adminEmail: cleanEmail,
      checkoutUrl: payResult.checkoutUrl,
      qrCodeUrl: payResult.qrCodeUrl,
      accountNo: payResult.accountNo,
      accountName: payResult.accountName,
      bankName: payResult.bankName,
      description: payResult.description,
    });
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('Create checkout error:', err);
    return sendError(res, err.message || 'Server error', 500);
  } finally {
    client.release();
  }
}

/**
 * 2. POST /api/v1/public/webhooks/payos
 * PayOS Webhook receiver
 */
export async function handlePayOSWebhook(req: Request, res: Response) {
  try {
    const body = req.body;
    console.log('Received PayOS Webhook:', JSON.stringify(body));

    // Verify webhook signature
    const isValid = payosService.verifyWebhookSignature(body);
    if (!isValid) {
      return sendError(res, 'Invalid webhook signature', 400);
    }

    const data = body.data || body;
    const orderCode = data.orderCode || data.order_code;

    if (!orderCode) {
      return sendError(res, 'Missing orderCode in webhook', 400);
    }

    // Find invoice by orderCode
    const invRes = await pool.query(
      `SELECT i.*, c.name as company_name 
       FROM system_invoices i
       JOIN companies c ON i.company_id = c.id
       WHERE i.note LIKE $1 LIMIT 1`,
      [`%ORDER_CODE:${orderCode}%`]
    );

    if (invRes.rows.length === 0) {
      return sendError(res, 'Invoice not found for orderCode: ' + orderCode, 404);
    }

    const invoice = invRes.rows[0];

    // Update invoice status to SUCCESS
    await pool.query(
      `UPDATE system_invoices 
       SET status = 'SUCCESS', paid_at = NOW(), updated_at = NOW() 
       WHERE id = $1`,
      [invoice.id]
    );

    // Update company status to ACTIVE
    await pool.query(
      `UPDATE companies SET status = 'ACTIVE', updated_at = NOW() WHERE id = $1`,
      [invoice.company_id]
    );

    // Audit log
    await writeAuditLog(
      null,
      'System Webhook',
      'Thanh toán thành công qua VietQR/PayOS',
      `Đơn hàng ${invoice.invoice_code} (${invoice.company_name}) - ${invoice.amount} VNĐ`,
      req.ip || '127.0.0.1'
    );

    return sendSuccess(res, { success: true, invoiceCode: invoice.invoice_code });
  } catch (err: any) {
    console.error('PayOS Webhook error:', err);
    return sendError(res, err.message || 'Server error', 500);
  }
}

/**
 * 3. GET /api/v1/public/orders/:orderCode/status
 * Public endpoint polled by Landing Page modal to check payment completion
 */
export async function checkOrderStatus(req: Request, res: Response) {
  try {
    const { orderCode } = req.params;

    const invRes = await pool.query(
      `SELECT i.invoice_code, i.status, i.amount, i.paid_at, c.name as company_name
       FROM system_invoices i
       JOIN companies c ON i.company_id = c.id
       WHERE i.note LIKE $1 OR i.invoice_code = $2 LIMIT 1`,
      [`%ORDER_CODE:${orderCode}%`, orderCode]
    );

    if (invRes.rows.length === 0) {
      return sendError(res, 'Không tìm thấy đơn hàng', 404);
    }

    const inv = invRes.rows[0];
    return sendSuccess(res, {
      orderCode,
      invoiceCode: inv.invoice_code,
      status: inv.status, // PENDING | SUCCESS | FAILED
      amount: parseFloat(inv.amount || '0'),
      paidAt: inv.paid_at ? new Date(inv.paid_at).toISOString() : null,
      companyName: inv.company_name,
    });
  } catch (err: any) {
    console.error('Check order status error:', err);
    return sendError(res, err.message || 'Server error', 500);
  }
}

/**
 * 4. POST /api/v1/public/simulate-payment
 * Dev/Demo helper endpoint to simulate payment completion without real banking app
 */
export async function simulatePayment(req: Request, res: Response) {
  try {
    const { orderCode } = req.body;
    if (!orderCode) {
      return sendError(res, 'OrderCode là bắt buộc', 400);
    }

    const invRes = await pool.query(
      `SELECT i.*, c.name as company_name 
       FROM system_invoices i
       JOIN companies c ON i.company_id = c.id
       WHERE i.note LIKE $1 OR i.invoice_code = $2 LIMIT 1`,
      [`%ORDER_CODE:${orderCode}%`, orderCode]
    );

    if (invRes.rows.length === 0) {
      return sendError(res, 'Không tìm thấy đơn hàng', 404);
    }

    const invoice = invRes.rows[0];

    // Mark SUCCESS
    await pool.query(
      `UPDATE system_invoices 
       SET status = 'SUCCESS', paid_at = NOW(), updated_at = NOW() 
       WHERE id = $1`,
      [invoice.id]
    );

    // Activate company
    await pool.query(
      `UPDATE companies SET status = 'ACTIVE', updated_at = NOW() WHERE id = $1`,
      [invoice.company_id]
    );

    // Audit log
    await writeAuditLog(
      null,
      'System Sandbox',
      'Giả lập thanh toán VietQR thành công',
      `Đơn hàng ${invoice.invoice_code} (${invoice.company_name})`,
      '127.0.0.1'
    );

    return sendSuccess(res, {
      message: 'Giả lập thanh toán thành công!',
      invoiceCode: invoice.invoice_code,
      status: 'SUCCESS',
    });
  } catch (err: any) {
    console.error('Simulate payment error:', err);
    return sendError(res, err.message || 'Server error', 500);
  }
}

/**
 * 5. POST /api/v1/public/orders/cancel
 * Public endpoint to cancel/expire an order when user leaves checkout or cancels
 */
export async function cancelOrder(req: Request, res: Response) {
  try {
    const { orderCode } = req.body;
    if (!orderCode) {
      return sendError(res, 'OrderCode là bắt buộc', 400);
    }

    const invRes = await pool.query(
      `SELECT i.*, c.name as company_name 
       FROM system_invoices i
       JOIN companies c ON i.company_id = c.id
       WHERE i.note LIKE $1 OR i.invoice_code = $2 LIMIT 1`,
      [`%ORDER_CODE:${orderCode}%`, orderCode]
    );

    if (invRes.rows.length === 0) {
      return sendError(res, 'Không tìm thấy đơn hàng', 404);
    }

    const invoice = invRes.rows[0];

    if (invoice.status === 'PENDING') {
      await pool.query(
        `UPDATE system_invoices SET status = 'FAILED', updated_at = NOW() WHERE id = $1`,
        [invoice.id]
      );
      await pool.query(
        `UPDATE companies SET status = 'INACTIVE', updated_at = NOW() WHERE id = $1 AND status = 'PENDING'`,
        [invoice.company_id]
      );
    }

    return sendSuccess(res, {
      message: 'Đơn hàng đã được đánh dấu Thất bại/Hủy bỏ thành công',
      invoiceCode: invoice.invoice_code,
      status: 'FAILED',
    });
  } catch (err: any) {
    console.error('Cancel order error:', err);
    return sendError(res, err.message || 'Server error', 500);
  }
}
