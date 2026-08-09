import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  CheckCircle,
  Copy,
  Loader2,
  ShieldCheck,
  QrCode,
  ArrowRight,
  Sparkles,
  Building2,
  User,
  Mail,
  Phone,
  FileText,
  Lock,
  Zap,
  Award,
  Clock
} from 'lucide-react';
import logo from '../assets/logo1.png';

interface OrderData {
  orderCode: number;
  invoiceCode: string;
  amount: number;
  companyName: string;
  adminEmail: string;
  checkoutUrl: string;
  qrCodeUrl: string;
  accountNo: string;
  accountName: string;
  bankName: string;
  description: string;
}

import { API_PUBLIC_BASE as API_BASE } from '../config/api';

export function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planParam = searchParams.get('plan') || 'basic';

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [taxCode, setTaxCode] = useState('');

  // OTP Verification States
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpDemoMessage, setOtpDemoMessage] = useState<string | null>(null);

  // Order State
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(600); // 10 minutes

  const handleCancelOrder = async () => {
    if (orderData?.orderCode) {
      try {
        await fetch(`${API_BASE}/orders/cancel`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderCode: orderData.orderCode }),
        });
      } catch {
        // ignore
      }
    }
  };

  // Countdown timer for Step 2
  useEffect(() => {
    let timer: any = null;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            handleCancelOrder();
            setError('Giao dịch đã hết hạn do quá thời gian 10 phút. Vui lòng thực hiện lại.');
            setStep(1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, countdown, orderData]);

  // Polling for Payment Completion on Step 2
  useEffect(() => {
    let interval: any = null;
    if (step === 2 && orderData?.orderCode) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`${API_BASE}/orders/${orderData.orderCode}/status`);
          const json = await res.json();
          if (json.success && json.data?.status === 'SUCCESS') {
            setStep(3); // Success
            clearInterval(interval);
          }
        } catch {
          // ignore network error during polling
        }
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, orderData]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSendOtp = async () => {
    if (!adminEmail) {
      setError('Vui lòng nhập Email trước khi lấy mã OTP xác thực');
      return;
    }
    setSendingOtp(true);
    setError(null);
    setOtpDemoMessage(null);

    try {
      const res = await fetch(`${API_BASE}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.message || 'Không thể gửi mã OTP');
      } else {
        setOtpSent(true);
        if (json.data?.otpDemo) {
          setOtpDemoMessage(`Mã OTP xác thực của bạn là: ${json.data.otpDemo}`);
        }
      }
    } catch (err: any) {
      setError('Lỗi kết nối khi gửi mã OTP');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.trim().length !== 6) {
      setError('Vui lòng nhập đủ 6 chữ số mã OTP');
      return;
    }
    setVerifyingOtp(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, otp: otpCode }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.message || 'Mã OTP không chính xác');
      } else {
        setOtpVerified(true);
        setOtpDemoMessage(null);
      }
    } catch (err: any) {
      setError('Lỗi kết nối khi xác thực mã OTP');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          adminName,
          adminEmail,
          phone,
          taxCode,
          planCode: 'STARTER',
          cycle: 'MONTHLY',
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Không thể khởi tạo đơn hàng thanh toán.');
      }

      setOrderData(json.data);
      setStep(2);
    } catch (err: any) {
      setError(err?.message || 'Đã có lỗi xảy ra. Vui lòng kiểm tra và thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckPayment = async () => {
    if (!orderData) return;
    setSimulating(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/orders/${orderData.orderCode}/status`);
      const json = await res.json();
      if (json.success && json.data?.status === 'SUCCESS') {
        setStep(3);
      } else {
        setError(`⏳ Chưa ghi nhận giao dịch chuyển khoản cho đơn hàng ${orderData.invoiceCode}. Nếu bạn vừa quét mã chuyển khoản, vui lòng chờ trong giây lát (khoảng 30 giây) để ngân hàng đối soát!`);
      }
    } catch {
      setError('Lỗi kết nối khi kiểm tra trạng thái thanh toán.');
    } finally {
      setSimulating(false);
    }
  };

  const handleSimulatePaymentDev = async () => {
    if (!orderData) return;
    setSimulating(true);
    try {
      const res = await fetch(`${API_BASE}/simulate-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderCode: orderData.orderCode }),
      });
      const json = await res.json();
      if (json.success) {
        setStep(3);
      }
    } catch {
      // ignore
    } finally {
      setSimulating(false);
    }
  };

  useEffect(() => {
    if (step !== 2 || !orderData) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/orders/${orderData.orderCode}/status`);
        const json = await res.json();
        if (json.success && json.data?.status === 'SUCCESS') {
          setStep(3);
        }
      } catch {
        // ignore
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [step, orderData]);

  return (
    <div className="min-h-screen bg-[#0B1C2D] text-white font-sans selection:bg-[#3AE7E1] selection:text-[#0B1C2D] relative overflow-x-hidden flex flex-col">
      {/* Background Animated Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3AE7E1]/5 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#2563EB]/5 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Navigation Header */}
      <header className="relative z-10 border-b border-white/10 bg-[#0B1C2D]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="SkillForge Logo" className="h-10 w-auto object-contain mix-blend-screen" />
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-[#3AE7E1] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại Trang chủ
          </Link>
        </div>
      </header>

      {/* Main Checkout Container */}
      <main className="flex-1 relative z-10 py-12 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Order Summary & Value Proposition */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3AE7E1]/10 text-[#3AE7E1] text-xs font-bold uppercase tracking-wider mb-4 border border-[#3AE7E1]/20">
              <ShieldCheck className="w-3.5 h-3.5" /> Thanh toán An toàn & Bảo mật 256-bit
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight text-white mb-3">
              Đăng ký Gói Dịch vụ <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3AE7E1] to-[#2563EB]">
                SkillForge BSC Basic
              </span>
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Giải pháp thực thi chiến lược BSC hàng đầu cho doanh nghiệp SME. Khởi tạo tài khoản tự động ngay sau khi hoàn tất thanh toán.
            </p>
          </div>

          {/* Pricing Summary Card */}
          <div className="bg-[#0F253A] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-start pb-6 border-b border-white/10">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Gói đăng ký</span>
                <h3 className="text-xl font-bold text-white mt-1">Gói Cơ Bản (Basic)</h3>
                <p className="text-xs text-[#3AE7E1] mt-0.5">Chu kỳ: Thanh toán Hàng tháng</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-[#3AE7E1]">1.000.000đ</div>
                <div className="text-[11px] text-slate-400">/ tháng</div>
              </div>
            </div>

            <div className="py-6 space-y-3 border-b border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#3AE7E1] shrink-0" />
                <span>Đầy đủ 4 khía cạnh Thẻ điểm cân bằng (BSC)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#3AE7E1] shrink-0" />
                <span>Dashboard báo cáo quản trị tổng quan thời gian thực</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#3AE7E1] shrink-0" />
                <span>Trợ lý AI hỗ trợ phân tích & phát hiện điểm nghẽn</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#3AE7E1] shrink-0" />
                <span>Hỗ trợ kỹ thuật ưu tiên & Cập nhật tính năng mới</span>
              </div>
            </div>

            {/* Total calculation */}
            <div className="pt-6 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Tạm tính</span>
                <span>1.000.000 VNĐ</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Thuế VAT (0%)</span>
                <span>0 VNĐ</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/5">
                <span>Tổng cộng</span>
                <span className="text-[#3AE7E1]">1.000.000 VNĐ</span>
              </div>
            </div>
          </div>

          {/* Social Proof Badge */}
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="p-3 bg-[#3AE7E1]/10 rounded-xl text-[#3AE7E1]">
              <Award className="w-6 h-6" />
            </div>
            <div className="text-xs">
              <div className="font-bold text-white">Được hơn 500+ doanh nghiệp tin dùng</div>
              <div className="text-slate-400 mt-0.5">Cam kết bảo mật dữ liệu tuyệt đối & Hỗ trợ 24/7</div>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Form & VietQR Flow */}
        <div className="lg:col-span-7">
          <div className="bg-[#0F253A] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            {/* Step Progress Bar */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
              {[
                { s: 1, label: '1. Thông tin' },
                { s: 2, label: '2. Quét VietQR' },
                { s: 3, label: '3. Hoàn tất' },
              ].map((item) => (
                <div key={item.s} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step === item.s
                        ? 'bg-[#3AE7E1] text-[#0B1C2D] shadow-[0_0_15px_rgba(58,231,225,0.5)]'
                        : step > item.s
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {step > item.s ? <CheckCircle className="w-4 h-4" /> : item.s}
                  </div>
                  <span
                    className={`text-xs font-bold hidden sm:inline ${
                      step === item.s ? 'text-[#3AE7E1]' : step > item.s ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Step 1: Input Registration Details */}
            {step === 1 && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleFormSubmit}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Thông tin Doanh nghiệp & Quản trị</h3>
                  <p className="text-xs text-slate-400">Vui lòng điền thông tin để khởi tạo hệ thống quản trị BSC cho doanh nghiệp của bạn.</p>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2 animate-shake">
                    <span className="text-base">⛔</span>
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Tên Doanh nghiệp *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Công ty CP Công nghệ ABC"
                        className="w-full text-xs pl-10 pr-4 py-3 bg-[#0B1C2D] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#3AE7E1]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Mã số thuế (nếu có)
                    </label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={taxCode}
                        onChange={(e) => setTaxCode(e.target.value)}
                        placeholder="0101234567"
                        className="w-full text-xs pl-10 pr-4 py-3 bg-[#0B1C2D] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#3AE7E1]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Họ và tên Người quản trị *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full text-xs pl-10 pr-4 py-3 bg-[#0B1C2D] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#3AE7E1]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Email Đăng ký Quản trị *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="admin@congtyabc.com"
                        className="w-full text-xs pl-10 pr-4 py-3 bg-[#0B1C2D] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#3AE7E1]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Số điện thoại liên hệ *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0988888888"
                      className="w-full text-xs pl-10 pr-4 py-3 bg-[#0B1C2D] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#3AE7E1]"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 bg-gradient-to-r from-[#3AE7E1] to-[#2563EB] text-white font-bold rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(58,231,225,0.4)] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang tạo mã VietQR...
                      </>
                    ) : (
                      <>
                        Tiến hành Thanh toán VietQR (1.000.000 VNĐ)
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}

            {/* Step 2: VietQR Interactive View */}
            {step === 2 && orderData && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Quét mã VietQR Thanh toán</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Sử dụng App Ngân hàng bất kỳ để chuyển khoản tự động</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-xs font-mono font-bold">
                    <Clock className="w-3.5 h-3.5 animate-pulse" />
                    {formatTime(countdown)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center bg-[#0B1C2D]/90 p-6 rounded-2xl border border-white/10">
                  {/* QR Image Box */}
                  <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-2xl relative group">
                    <img
                      src={orderData.qrCodeUrl}
                      alt="VietQR Code"
                      className="w-52 h-52 object-contain"
                    />
                    <div className="text-[11px] text-slate-800 font-bold mt-2 tracking-wider uppercase flex items-center gap-1">
                      <QrCode className="w-3.5 h-3.5 text-[#2563EB]" /> VietQR Auto-Detect
                    </div>
                  </div>

                  {/* Transfer Details Box */}
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <div className="text-slate-400 text-[11px]">Ngân hàng thụ hưởng</div>
                      <div className="font-bold text-white text-sm">{orderData.bankName} Bank</div>
                    </div>

                    <div>
                      <div className="text-slate-400 text-[11px]">Số tài khoản</div>
                      <div className="flex items-center justify-between bg-white/5 px-3.5 py-2 rounded-xl border border-white/10 mt-1">
                        <span className="font-mono font-bold text-[#3AE7E1] text-sm">{orderData.accountNo}</span>
                        <button
                          onClick={() => handleCopy(orderData.accountNo, 'acc')}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          {copied === 'acc' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400 text-[11px]">Tên tài khoản</div>
                      <div className="font-semibold text-white uppercase">{orderData.accountName}</div>
                    </div>

                    <div>
                      <div className="text-slate-400 text-[11px]">Số tiền cần thanh toán</div>
                      <div className="font-black text-xl text-[#3AE7E1]">
                        {orderData.amount.toLocaleString('vi-VN')} VNĐ
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400 text-[11px]">Nội dung chuyển khoản chuẩn *</div>
                      <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 rounded-xl mt-1">
                        <span className="font-mono font-bold text-emerald-400 text-sm">{orderData.description}</span>
                        <button
                          onClick={() => handleCopy(orderData.description, 'desc')}
                          className="text-emerald-400 hover:text-white transition-colors"
                        >
                          {copied === 'desc' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-time Indicator */}
                <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
                  <Loader2 className="w-4.5 h-4.5 animate-spin text-[#3AE7E1]" />
                  <span className="text-slate-300 font-medium">Hệ thống đang tự động lắng nghe giao dịch chuyển khoản...</span>
                </div>

                {/* Test Mode Simulation Trigger */}
                <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <span className="text-[11px] text-slate-500">Mã đơn hàng: {orderData.invoiceCode}</span>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={async () => {
                        await handleCancelOrder();
                        setError('Giao dịch đã được hủy bỏ thành công.');
                        setStep(1);
                      }}
                      className="w-1/2 sm:w-auto px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-xl transition-all"
                    >
                      Hủy đơn giao dịch
                    </button>
                    <button
                      type="button"
                      onClick={handleSimulatePaymentDev}
                      className="text-[10px] text-slate-500 hover:text-amber-400 underline px-2"
                      title="Bấm để kích hoạt nhanh phục vụ Demo/Test"
                    >
                      (Demo Test)
                    </button>
                    <button
                      type="button"
                      onClick={handleCheckPayment}
                      disabled={simulating}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      {simulating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                      Tôi đã chuyển khoản (Kiểm tra giao dịch)
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Success Completion View */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6"
              >
                <div className="flex justify-center">
                  <div className="p-5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/40 animate-bounce">
                    <CheckCircle className="w-16 h-16" />
                  </div>
                </div>

                <div>
                  <h3 className="text-3xl font-extrabold text-white mb-2">Thanh toán Thành công!</h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    Chúc mừng! Đơn hàng <span className="font-bold text-[#3AE7E1]">{orderData?.invoiceCode}</span> đã được ghi nhận thanh toán thành công. Doanh nghiệp của bạn đã được khởi tạo trên hệ thống SkillForge.
                  </p>
                </div>

                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-left text-xs space-y-3 max-w-md mx-auto">
                  <div className="flex justify-between border-b border-white/5 pb-2.5">
                    <span className="text-slate-400">Doanh nghiệp:</span>
                    <span className="font-bold text-white">{orderData?.companyName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2.5">
                    <span className="text-slate-400">Email Quản trị:</span>
                    <span className="font-bold text-[#3AE7E1]">{orderData?.adminEmail}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2.5">
                    <span className="text-slate-400">Số tiền:</span>
                    <span className="font-bold text-white">1.000.000 VNĐ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Trạng thái Hóa đơn:</span>
                    <span className="font-bold text-emerald-400 uppercase">Đã thanh toán (SUCCESS)</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-center">
                  <Link
                    to="/"
                    className="px-8 py-3.5 bg-[#3AE7E1] text-[#0B1C2D] font-bold rounded-xl hover:shadow-[0_0_25px_rgba(58,231,225,0.4)] transition-all text-xs text-center"
                  >
                    Hoàn tất & Về Trang chủ
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-white/10 text-center text-slate-500 text-xs">
        <p>&copy; 2026 SkillForge. All rights reserved.</p>
      </footer>
    </div>
  );
}
