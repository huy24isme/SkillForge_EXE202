import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  CheckCircle,
  Loader2,
  ShieldCheck,
  Building2,
  User,
  Mail,
  Phone,
  MessageSquare,
  Users,
  Sparkles,
  ArrowRight,
  Headphones,
  Cpu,
  Server
} from 'lucide-react';
import logo from '../assets/logo1.png';

import { API_PUBLIC_BASE as API_BASE } from '../config/api';

export function CustomPlanPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [companySize, setCompanySize] = useState('50-200');
  const [customRequirements, setCustomRequirements] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/custom-leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          contactName,
          contactEmail,
          contactPhone,
          companySize,
          customRequirements,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Không thể gửi yêu cầu tư vấn. Vui lòng thử lại.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'Đã có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1C2D] text-white font-sans selection:bg-[#3AE7E1] selection:text-[#0B1C2D] relative overflow-x-hidden flex flex-col">
      {/* Background Animated Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8B5CF6]/10 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#3AE7E1]/10 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2" />
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

      {/* Main Content Container */}
      <main className="flex-1 relative z-10 py-12 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Enterprise Benefits */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/20 text-[#C4B5FD] text-xs font-bold uppercase tracking-wider mb-4 border border-[#8B5CF6]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#C4B5FD]" /> Gói Tùy Chỉnh Chuyên Biệt (Enterprise Custom)
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight text-white mb-3">
              Tư vấn & Thiết kế Giải pháp <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C4B5FD] via-[#8B5CF6] to-[#3AE7E1]">
                BSC Theo Yêu Cầu Doanh Nghiệp
              </span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Dành riêng cho Tập đoàn và Doanh nghiệp quy mô lớn có quy trình quản trị đặc thụ. Đội ngũ chuyên gia SkillForge sẵn sàng tư vấn trực tiếp 1:1.
            </p>
          </div>

          {/* Benefits List Card */}
          <div className="bg-[#0F253A] border border-[#8B5CF6]/30 rounded-3xl p-6 shadow-2xl space-y-5 relative overflow-hidden">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="p-3 bg-[#8B5CF6]/20 rounded-2xl text-[#C4B5FD]">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Đặc quyền Gói Tùy Chỉnh (Custom)</h3>
                <p className="text-xs text-slate-400">Được tinh chỉnh hoàn toàn theo bài toán thực tế</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-[#C4B5FD] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Kiến trúc BSC Tùy biến Không giới hạn:</span>
                  <p className="text-slate-400 mt-0.5">Xây dựng ma trận chỉ số BSC đa tầng cho Tổng công ty, Chi nhánh và Tập đoàn.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-[#C4B5FD] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Tích hợp Hệ thống Doanh nghiệp (ERP/HRM):</span>
                  <p className="text-slate-400 mt-0.5">Kết nối dữ liệu tự động với SAP, Salesforce, Oracle, Bravo và phần mềm nội bộ.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-[#C4B5FD] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Hạ tầng Riêng & Hạ tầng On-Premise:</span>
                  <p className="text-slate-400 mt-0.5">Triển khai Cloud riêng (Private Cloud) hoặc cài đặt trực tiếp trên máy chủ Doanh nghiệp.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-[#C4B5FD] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Chuyên viên Tư vấn & Hỗ trợ 24/7 1:1:</span>
                  <p className="text-slate-400 mt-0.5">Có Account Manager chuyên trách và cam kết chất lượng dịch vụ SLA 99.99%.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 text-xs">
            <Headphones className="w-8 h-8 text-[#3AE7E1] shrink-0" />
            <div>
              <div className="font-bold text-white">Phản hồi siêu tốc trong 15 phút</div>
              <div className="text-slate-400 mt-0.5">Chuyên gia giải pháp sẽ chủ động gọi điện để nắm bắt bài toán của bạn.</div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-[#0F253A] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            {!submitted ? (
              <motion.form
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Đăng ký Tư vấn Gói Tùy Chỉnh</h3>
                  <p className="text-xs text-slate-400">Vui lòng để lại thông tin, đội ngũ chuyên gia SkillForge sẽ tư vấn giải pháp chi tiết cho bạn.</p>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Tên Doanh nghiệp / Tập đoàn *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Ví dụ: Tập đoàn Công nghệ & Thương mại ABC"
                      className="w-full text-xs pl-10 pr-4 py-3 bg-[#0B1C2D] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#8B5CF6]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Họ và tên Người đại diện *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full text-xs pl-10 pr-4 py-3 bg-[#0B1C2D] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#8B5CF6]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Email liên hệ công việc *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="a.nguyen@tapdoanabc.vn"
                        className="w-full text-xs pl-10 pr-4 py-3 bg-[#0B1C2D] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#8B5CF6]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Số điện thoại trực tiếp *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="0912345678"
                        className="w-full text-xs pl-10 pr-4 py-3 bg-[#0B1C2D] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#8B5CF6]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Quy mô nhân sự / Số tài khoản
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <select
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                        className="w-full text-xs pl-10 pr-4 py-3 bg-[#0B1C2D] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8B5CF6]"
                      >
                        <option value="Dưới 50 nhân sự">Dưới 50 nhân sự</option>
                        <option value="50 - 200 nhân sự">50 - 200 nhân sự</option>
                        <option value="200 - 500 nhân sự">200 - 500 nhân sự</option>
                        <option value="Trên 500 nhân sự (Tập đoàn)">Trên 500 nhân sự (Tập đoàn)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Ghi chú & Bài toán / Yêu cầu tùy chỉnh riêng
                  </label>
                  <div className="relative">
                    <MessageSquare className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <textarea
                      rows={4}
                      value={customRequirements}
                      onChange={(e) => setCustomRequirements(e.target.value)}
                      placeholder="Mô tả nhu cầu tùy chỉnh, tích hợp hệ thống hoặc câu hỏi cho chuyên gia..."
                      className="w-full text-xs pl-10 pr-4 py-3 bg-[#0B1C2D] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#8B5CF6]"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 bg-gradient-to-r from-[#8B5CF6] to-[#3AE7E1] text-white font-bold rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang gửi yêu cầu...
                      </>
                    ) : (
                      <>
                        Gửi Đăng ký Tư vấn Gói Tùy Chỉnh
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-6"
              >
                <div className="flex justify-center">
                  <div className="p-5 bg-purple-500/20 text-[#C4B5FD] rounded-full border border-purple-500/40 animate-bounce">
                    <CheckCircle className="w-16 h-16" />
                  </div>
                </div>

                <div>
                  <h3 className="text-3xl font-extrabold text-white mb-2">Gửi Yêu cầu Thành công!</h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    Cảm ơn quý doanh nghiệp <span className="font-bold text-[#3AE7E1]">{companyName}</span> đã đăng ký tư vấn Gói Tùy Chỉnh. Chuyên gia tư vấn giải pháp SkillForge sẽ liên hệ tới hotline <span className="font-bold text-[#C4B5FD]">{contactPhone}</span> trong vòng 15 phút!
                  </p>
                </div>

                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-left text-xs space-y-3 max-w-md mx-auto">
                  <div className="flex justify-between border-b border-white/5 pb-2.5">
                    <span className="text-slate-400">Doanh nghiệp:</span>
                    <span className="font-bold text-white">{companyName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2.5">
                    <span className="text-slate-400">Người đại diện:</span>
                    <span className="font-bold text-white">{contactName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2.5">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-bold text-[#3AE7E1]">{contactEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Quy mô nhân sự:</span>
                    <span className="font-bold text-[#C4B5FD]">{companySize}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    to="/"
                    className="inline-block px-8 py-3.5 bg-gradient-to-r from-[#8B5CF6] to-[#3AE7E1] text-white font-bold rounded-xl shadow-lg hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all text-xs"
                  >
                    Trở về Trang chủ
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-white/10 text-center text-slate-500 text-xs">
        <p>&copy; 2026 SkillForge Enterprise Solutions. All rights reserved.</p>
      </footer>
    </div>
  );
}
