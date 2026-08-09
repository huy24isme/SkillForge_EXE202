import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Copy, Loader2, ShieldCheck, QrCode, ArrowRight, Sparkles, Building2, User, Mail, Phone, FileText } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName?: string;
  planPrice?: string;
}

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

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, planName = 'Gói Cơ Bản (Basic)', planPrice = '1.000.000 VNĐ' }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [taxCode, setTaxCode] = useState('');

  // Order State
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [simulating, setSimulating] = useState<boolean>(false);

  // OTP Verification States
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpDemoMessage, setOtpDemoMessage] = useState<string | null>(null);

  // Reset modal state on open/close
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setOrderData(null);
      setError(null);
      setLoading(false);
      setOtpCode('');
      setOtpSent(false);
      setOtpVerified(false);
      setOtpDemoMessage(null);
    }
  }, [isOpen]);

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
          // ignore network errors during polling
        }
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, orderData]);

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
      setError(err?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
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

  if (!mounted) return null;

  const portalTarget = document.getElementById('portal-root') || document.body;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 overflow-y-auto min-h-screen"
          style={{ zIndex: 999999 }}
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-[#06121E]/95 backdrop-blur-2xl"
            style={{ zIndex: 999999 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="relative w-full max-w-2xl bg-[#0F253A] border border-[#3AE7E1]/40 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden text-white my-auto"
            style={{ zIndex: 1000000 }}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0B1C2D]/60">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#3AE7E1]/10 rounded-xl text-[#3AE7E1] border border-[#3AE7E1]/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Thanh toán Đăng ký SkillForge</h3>
                <p className="text-xs text-slate-400">Gói chọn: <span className="text-[#3AE7E1] font-semibold">{planName}</span> ({planPrice})</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8">
            {/* Step 1: Input Registration Info */}
            {step === 1 && (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {error && (
                  <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2 animate-shake">
                    <span className="text-base">⛔</span>
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
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
                        className="w-full text-xs pl-10 pr-3 py-3 bg-[#0B1C2D] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#3AE7E1]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Mã số thuế (nếu có)
                    </label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={taxCode}
                        onChange={(e) => setTaxCode(e.target.value)}
                        placeholder="0101234567"
                        className="w-full text-xs pl-10 pr-3 py-3 bg-[#0B1C2D] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#3AE7E1]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
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
                        className="w-full text-xs pl-10 pr-3 py-3 bg-[#0B1C2D] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#3AE7E1]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
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
                        className="w-full text-xs pl-10 pr-3 py-3 bg-[#0B1C2D] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#3AE7E1]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
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
                      className="w-full text-xs pl-10 pr-3 py-3 bg-[#0B1C2D] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#3AE7E1]"
                    />
                  </div>
                </div>

                {/* Price summary box */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center my-4">
                  <div>
                    <div className="text-xs text-slate-400">Tổng tiền thanh toán</div>
                    <div className="text-xl font-bold text-[#3AE7E1]">1.000.000 VNĐ <span className="text-xs text-slate-400 font-normal">/tháng</span></div>
                  </div>
                  <div className="text-right text-[11px] text-slate-400">
                    Tự động khởi tạo Doanh nghiệp &<br />Cấp tài khoản Admin ngay
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-[#3AE7E1] to-[#2563EB] text-white font-bold rounded-xl shadow-lg hover:shadow-[#3AE7E1]/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang tạo mã VietQR...
                    </>
                  ) : (
                    <>
                      Tiến hành Thanh toán VietQR
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: VietQR Dynamic Payment */}
            {step === 2 && orderData && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3AE7E1]/10 text-[#3AE7E1] text-xs font-bold mb-2 border border-[#3AE7E1]/20">
                    <QrCode className="w-3.5 h-3.5" /> Quét mã VietQR chuyển khoản tự động
                  </div>
                  <p className="text-xs text-slate-400">Sử dụng App Ngân hàng bất kỳ để quét mã bên dưới</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center bg-[#0B1C2D]/80 p-5 rounded-2xl border border-white/10">
                  {/* QR Image */}
                  <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-xl">
                    <img
                      src={orderData.qrCodeUrl}
                      alt="VietQR Payment Code"
                      className="w-48 h-48 object-contain"
                    />
                    <div className="text-[10px] text-slate-700 font-bold mt-1 tracking-wider uppercase">
                      VietQR • Auto-Detect Payment
                    </div>
                  </div>

                  {/* Transfer Details */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="text-slate-400 text-[11px]">Ngân hàng nhận</div>
                      <div className="font-bold text-white flex items-center gap-2">
                        {orderData.bankName} Bank
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400 text-[11px]">Số tài khoản</div>
                      <div className="flex items-center justify-between bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 mt-1">
                        <span className="font-mono font-bold text-[#3AE7E1]">{orderData.accountNo}</span>
                        <button
                          onClick={() => handleCopy(orderData.accountNo, 'acc')}
                          className="text-slate-400 hover:text-white"
                        >
                          {copied === 'acc' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400 text-[11px]">Chủ tài khoản</div>
                      <div className="font-semibold text-white uppercase">{orderData.accountName}</div>
                    </div>

                    <div>
                      <div className="text-slate-400 text-[11px]">Số tiền</div>
                      <div className="font-bold text-lg text-[#3AE7E1]">
                        {orderData.amount.toLocaleString('vi-VN')} VNĐ
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400 text-[11px]">Nội dung chuyển khoản chuẩn *</div>
                      <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg mt-1">
                        <span className="font-mono font-bold text-emerald-400">{orderData.description}</span>
                        <button
                          onClick={() => handleCopy(orderData.description, 'desc')}
                          className="text-emerald-400 hover:text-white"
                        >
                          {copied === 'desc' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-[#3AE7E1]" />
                  <span className="text-slate-300">Đang chờ hệ thống ngân hàng ghi nhận chuyển khoản...</span>
                </div>

                {/* Error / Warning Alert in Step 2 */}
                {error && (
                  <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-2">
                    <span className="text-sm">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* Real Status Check & Dev Simulation Buttons */}
                <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-mono">Mã đơn: {orderData.invoiceCode}</span>
                    <button
                      type="button"
                      onClick={handleSimulatePaymentDev}
                      className="text-[10px] text-slate-500 hover:text-amber-400 underline"
                      title="Bấm để kích hoạt nhanh phục vụ Demo/Test"
                    >
                      (Demo Test)
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleCheckPayment}
                    disabled={simulating}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    {simulating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                    Tôi đã chuyển khoản (Kiểm tra giao dịch)
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Success Screen */}
            {step === 3 && (
              <div className="text-center py-6 space-y-6">
                <div className="flex justify-center">
                  <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/40 animate-bounce">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Thanh toán Thành công!</h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    Hệ thống đã nhận đủ thanh toán cho đơn hàng <span className="font-bold text-[#3AE7E1]">{orderData?.invoiceCode}</span>.
                    Doanh nghiệp và tài khoản quản trị tối cao của bạn đã được khởi tạo tự động.
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-left text-xs space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">Doanh nghiệp:</span>
                    <span className="font-bold text-white">{orderData?.companyName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">Email quản trị:</span>
                    <span className="font-bold text-[#3AE7E1]">{orderData?.adminEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Trạng thái Hóa đơn:</span>
                    <span className="font-bold text-emerald-400 uppercase">Đã thanh toán (SUCCESS)</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={onClose}
                    className="px-8 py-3 bg-[#3AE7E1] text-[#0B1C2D] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(58,231,225,0.4)] transition-all text-xs"
                  >
                    Hoàn tất & Đóng
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>,
    portalTarget
  );
};
