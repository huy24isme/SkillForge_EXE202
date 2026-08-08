import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Shield,
  Zap,
  BarChart3,
  Users,
  Layers,
} from "lucide-react";
import { motion } from "motion/react";
// import logo from 'figma:asset/e5ac96d9a4833c4a4aed8f597c1743c3e98b61b0.png';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B1C2D] text-white font-sans selection:bg-[#3AE7E1] selection:text-[#0B1C2D]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B1C2D]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              // src={logo}
              alt="SkillForge Logo"
              className="w-8 h-8 rounded-lg bg-white/5 object-contain"
            />
            <span className="font-bold text-xl tracking-tight">SkillForge</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a
              href="#problem"
              className="hover:text-[#3AE7E1] transition-colors"
            >
              Vấn đề
            </a>
            <a
              href="#solution"
              className="hover:text-[#3AE7E1] transition-colors"
            >
              Giải pháp
            </a>
            <a
              href="#pricing"
              className="hover:text-[#3AE7E1] transition-colors"
            >
              Bảng giá
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              to="/executive"
              className="hidden md:block text-sm font-medium text-slate-300 hover:text-white"
            >
              Đăng nhập
            </Link>
            <Link
              to="/executive"
              className="px-5 py-2.5 bg-[#3AE7E1] text-[#0B1C2D] text-sm font-bold rounded-lg hover:shadow-[0_0_20px_rgba(58,231,225,0.4)] transition-all"
            >
              Dùng thử ngay
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#3AE7E1]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#3AE7E1] text-xs font-bold uppercase tracking-wider mb-6">
              <Zap className="w-3 h-3" /> PM 4.0 Platform
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Quản trị nhân sự & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3AE7E1] to-[#2563EB]">
                Dự án thông minh
              </span>
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-lg leading-relaxed">
              Hệ thống quản lý Enterprise tích hợp AI giúp lãnh đạo ra quyết
              định chính xác, tối ưu nguồn lực và tạo động lực cho nhân viên qua
              Game hóa.
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/executive"
                className="px-8 py-4 bg-gradient-to-r from-[#3AE7E1] to-[#2563EB] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
              >
                Khám phá Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="px-8 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                Xem Demo
              </button>
            </div>
          </div>

          {/* Dashboard Preview Simulation */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#3AE7E1] to-[#2563EB] rounded-2xl blur-2xl opacity-20" />
            <div className="relative bg-[#0F253A] border border-white/10 rounded-2xl p-6 shadow-2xl">
              {/* Fake Dashboard UI */}
              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="h-2 w-32 bg-white/10 rounded-full" />
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white/5 p-4 rounded-lg border border-white/5"
                  >
                    <div className="h-8 w-8 rounded bg-[#3AE7E1]/20 mb-3" />
                    <div className="h-2 w-16 bg-white/20 rounded mb-2" />
                    <div className="h-4 w-12 bg-white/10 rounded" />
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <div className="w-2/3 bg-white/5 rounded-lg h-32 border border-white/5 p-4">
                  <div className="flex items-end gap-2 h-full">
                    {[40, 60, 35, 70, 50, 80, 65].map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h}%` }}
                        className="flex-1 bg-gradient-to-t from-[#3AE7E1]/50 to-[#3AE7E1] rounded-t-sm"
                      />
                    ))}
                  </div>
                </div>
                <div className="w-1/3 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-white/5 p-2 rounded border border-white/5"
                    >
                      <div className="w-6 h-6 rounded-full bg-slate-600" />
                      <div className="h-2 w-full bg-white/10 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/5 bg-[#0F253A]/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Doanh nghiệp tin dùng", value: "500+" },
            { label: "Dự án quản lý", value: "12k" },
            { label: "Nhân sự Active", value: "85k" },
            { label: "Tỷ lệ hài lòng", value: "98%" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-[#3AE7E1] uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Giải pháp toàn diện
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Không chỉ là công cụ quản lý, SkillForge là hệ điều hành cho doanh
              nghiệp số.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Data-Driven Decision",
                desc: "Dashboard trực quan giúp lãnh đạo nắm bắt tình hình tức thì.",
              },
              {
                icon: Users,
                title: "AI Resource Planning",
                desc: "Tự động phân bổ nhân sự dựa trên kỹ năng và tải công việc.",
              },
              {
                icon: Layers,
                title: "Gamification",
                desc: "Biến công việc thành trải nghiệm thú vị với hệ thống Level/XP.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-[#3AE7E1]/50 transition-colors group"
              >
                <div className="w-14 h-14 rounded-xl bg-[#0B1C2D] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-7 h-7 text-[#3AE7E1]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-[#0F253A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bảng giá linh hoạt
            </h2>
            <p className="text-slate-400">
              Chọn gói phù hợp với quy mô doanh nghiệp của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$49",
                features: [
                  "Up to 20 users",
                  "Basic Analytics",
                  "Project Management",
                ],
              },
              {
                name: "Professional",
                price: "$199",
                features: [
                  "Up to 100 users",
                  "Phân tích AI",
                  "Advanced Reporting",
                  "Priority Support",
                ],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                features: [
                  "Unlimited users",
                  "Custom AI Models",
                  "Dedicated Server",
                  "24/7 SLA",
                ],
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`relative p-8 rounded-2xl border flex flex-col ${
                  plan.popular
                    ? "bg-[#0B1C2D] border-[#3AE7E1] shadow-[0_0_30px_rgba(58,231,225,0.15)] scale-105 z-10"
                    : "bg-white/5 border-white/10"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#3AE7E1] text-[#0B1C2D] text-xs font-bold px-3 py-1 rounded-full uppercase">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-[#3AE7E1] mb-6">
                  {plan.price}
                  <span className="text-sm text-slate-400 font-normal">
                    /mo
                  </span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feat, fIdx) => (
                    <li
                      key={fIdx}
                      className="flex items-center gap-3 text-slate-300 text-sm"
                    >
                      <CheckCircle className="w-4 h-4 text-[#3AE7E1]" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-bold transition-all ${
                    plan.popular
                      ? "bg-[#3AE7E1] text-[#0B1C2D] hover:bg-[#34d3cd]"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  Chọn gói này
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-slate-500 text-sm">
        <p>&copy; 2026 SkillForge. All rights reserved.</p>
      </footer>
    </div>
  );
}
