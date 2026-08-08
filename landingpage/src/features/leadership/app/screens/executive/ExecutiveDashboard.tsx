import {
  TrendingUp,
  AlertTriangle,
  Users,
  Sparkles,
  Wallet,
  Users2,
  Settings2,
  GraduationCap,
  ArrowUpRight,
  Activity,
  BarChart3,
  CheckCircle2,
  MessageSquare,
  Calculator
} from 'lucide-react';
import {
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Link } from 'react-router-dom';

const REVENUE_DATA = [
  { name: 'T1', value: 1200 },
  { name: 'T2', value: 1500 },
  { name: 'T3', value: 1300 },
  { name: 'T4', value: 1800 },
  { name: 'T5', value: 2200 },
  { name: 'T6', value: 2100 },
  { name: 'T7', value: 3200 },
];

const BRIEFING_ITEMS = [
  { icon: TrendingUp, color: '#10B981', bg: '#ECFDF5', text: 'Doanh thu tăng **12.5%** tháng này — vượt mục tiêu đề ra', type: 'positive' },
  { icon: AlertTriangle, color: '#EF4444', bg: '#FEF2F2', text: '**2 dự án** khách hàng có nguy cơ trễ hạn — cần xem xét', type: 'warning' },
  { icon: Users, color: '#F59E0B', bg: '#FFFBEB', text: 'Pipeline Sales giảm **12%** — cần kích hoạt kênh mới', type: 'alert' },
  { icon: Sparkles, color: '#3AE7E1', bg: '#F0FDFC', text: '**Trần Minh C** (Mobile) vượt năng suất gấp **4.5x** trung bình team', type: 'positive' },
];

export function ExecutiveDashboard() {
  return (
    <div className="space-y-6">
      {/* CEO Daily AI Briefing */}
      <div className="bg-gradient-to-br from-[#0B1C2D] via-[#1E3A5F] to-[#0B1C2D] rounded-2xl p-7 shadow-2xl text-white relative overflow-hidden border border-[#3AE7E1]/20"
        style={{ boxShadow: '0 0 40px rgba(58,231,225,0.08), 0 25px 50px -12px rgba(0,0,0,0.4)' }}
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Sparkles className="w-48 h-48" />
        </div>
        <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(58,231,225,0.03) 0%, transparent 60%)' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 bg-[#3AE7E1]/20 rounded-xl backdrop-blur-md border border-[#3AE7E1]/30 shadow-[0_0_15px_rgba(58,231,225,0.2)]">
              <Sparkles className="w-5 h-5 text-[#3AE7E1]" />
            </div>
            <div>
              <span className="font-bold uppercase tracking-[0.2em] text-xs text-[#3AE7E1] block">Tóm tắt điều hành AI</span>
              <h1 className="text-xl font-bold">Chào buổi sáng, CEO 👋</h1>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#3AE7E1] animate-ping opacity-75" />
              <span className="text-[10px] text-[#3AE7E1] font-bold uppercase tracking-wider">Trực tiếp</span>
            </div>
          </div>

          {/* Briefing items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {BRIEFING_ITEMS.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                <div className="p-1.5 rounded-lg shrink-0" style={{ backgroundColor: item.color + '25' }}>
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {item.text.split('**').map((part, idx) =>
                    idx % 2 === 1 ? <b key={idx} className="text-white">{part}</b> : part
                  )}
                </p>
              </div>
            ))}
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            {[
              { label: 'Doanh thu (MTD)', value: '3.2B VND', delta: '+12.5%', color: '#10B981' },
              { label: 'KH có rủi ro', value: '2 Tài khoản', delta: 'Xác suất rời cao', color: '#EF4444', pulse: true },
              { label: 'Hiệu quả QT', value: '84%', delta: '-2% tuần trước', color: '#3AE7E1' },
              { label: 'Năng lực nhân sự', value: '92%', delta: 'Gần tối đa', color: '#3B82F6' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-xs">{stat.label}</span>
                  {stat.pulse && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />}
                </div>
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs mt-1" style={{ color: stat.color }}>{stat.delta}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#3AE7E1] animate-ping shrink-0" />
              <p className="text-sm text-slate-300">
                <span className="text-white font-medium">Phân tích chiến lược:</span> Dự án "Skyline" đang làm trễ quy trình onboarding KH 4 ngày, ảnh hưởng dự báo dòng tiền Q3.
              </p>
            </div>
            <Link
              to="/leadership/executive/strategy-map"
              className="px-5 py-3 bg-[#3AE7E1] text-[#0B1C2D] font-bold rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(58,231,225,0.4)] transition-all flex items-center gap-2 text-sm shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              Xem Bản đồ CL
            </Link>
          </div>
        </div>
      </div>

      {/* BSC Perspectives Grid */}
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-[#3AE7E1]" />
        <h2 className="text-xl font-bold text-[#0B1C2D]">4 Góc nhìn Balanced Scorecard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Tài chính */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Wallet className="w-16 h-16 text-blue-600" />
          </div>
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Wallet className="w-5 h-5" /></div>
            <div>
              <h3 className="font-bold text-[#0B1C2D] text-sm">Tài chính</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Financial Perspective</p>
            </div>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRevDash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip formatter={(v: number | string) => `${v}M VND`} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                <Area type="monotone" dataKey="value" stroke="#2563EB" fillOpacity={1} fill="url(#colorRevDash)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="text-slate-500">ROI Danh mục: <span className="text-[#0B1C2D] font-bold text-green-600">+143%</span></div>
            <Link to="/leadership/executive/financial" className="text-blue-600 font-medium hover:underline flex items-center gap-1 text-xs">
              Chi tiết <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 2. Khách hàng */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Users2 className="w-16 h-16 text-[#3AE7E1]" />
          </div>
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 bg-[#3AE7E1]/10 rounded-lg text-[#3AE7E1]"><Users2 className="w-5 h-5" /></div>
            <div>
              <h3 className="font-bold text-[#0B1C2D] text-sm">Khách hàng</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Customer Perspective</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { label: 'NPS trung bình', value: '7.8/10', pct: 78, color: '#3AE7E1' },
              { label: 'Tỷ lệ đúng hạn', value: '60%', pct: 60, color: '#F59E0B' },
              { label: 'KH Khỏe mạnh', value: '3/5 (60%)', pct: 60, color: '#10B981' },
            ].map((m, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">{m.label}</span>
                  <span className="font-bold text-[#0B1C2D]">{m.value}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${m.pct}%`, backgroundColor: m.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between text-sm">
            <div className="text-slate-500">KH mới: <span className="text-[#0B1C2D] font-bold">+1</span></div>
            <Link to="/leadership/executive/customer" className="text-[#3AE7E1] font-medium hover:underline flex items-center gap-1 text-xs">
              Chi tiết <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 3. Quy trình nội bộ */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Settings2 className="w-16 h-16 text-purple-600" />
          </div>
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Settings2 className="w-5 h-5" /></div>
            <div>
              <h3 className="font-bold text-[#0B1C2D] text-sm">Quy trình nội bộ</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Internal Process</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Onboarding KH', value: '12 ngày', sub: '↑ Nghẽn cổ chai', color: 'text-red-500' },
              { label: 'Sprint Dev', value: '18 ngày', sub: '↑ Chậm', color: 'text-orange-500' },
              { label: 'QA Fix', value: '4 ngày', sub: '↓ Hiệu quả', color: 'text-green-500' },
            ].map((m, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <div className="text-[10px] text-slate-500 mb-1 leading-tight">{m.label}</div>
                <div className={`text-base font-bold ${m.color}`}>{m.value}</div>
                <div className={`text-[9px] mt-0.5 ${m.color}`}>{m.sub}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between text-sm">
            <div className="text-slate-500">Hiệu quả chung: <span className="text-purple-600 font-bold">33%</span></div>
            <Link to="/leadership/executive/process" className="text-purple-600 font-medium hover:underline flex items-center gap-1 text-xs">
              Chi tiết <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 4. Học hỏi & Phát triển */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <GraduationCap className="w-16 h-16 text-orange-600" />
          </div>
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><GraduationCap className="w-5 h-5" /></div>
            <div>
              <h3 className="font-bold text-[#0B1C2D] text-sm">Học hỏi & Phát triển</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Learning & Growth</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Năng suất trung bình', value: '2.5x', color: '#F97316' },
              { label: 'Sẵn sàng kỹ năng', value: '82%', color: '#3B82F6' },
              { label: 'Tỷ lệ giữ chân', value: '94.5%', color: '#10B981' },
            ].map((m, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{m.label}</span>
                <span className="font-bold text-sm" style={{ color: m.color }}>{m.value}</span>
              </div>
            ))}
          </div>
          <div className="flex items-end gap-1 h-14 my-4">
            {[40, 60, 45, 80, 65, 90, 75].map((h, i) => (
              <div key={i} className="flex-1 bg-orange-50 rounded-t-md relative">
                <div className="absolute bottom-0 left-0 right-0 bg-orange-400 rounded-t-md" style={{ height: `${h}%` }} />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="text-slate-500">Top: <span className="text-[#0B1C2D] font-bold">Trần Minh C</span></div>
            <Link to="/leadership/executive/learning" className="text-orange-600 font-medium hover:underline flex items-center gap-1 text-xs">
              Chi tiết <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* AI Tools & Fast Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-7 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-[#0B1C2D] mb-5 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#3AE7E1]" />
            Công cụ AI Chiến lược
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/leadership/executive/chatbot" className="p-5 bg-slate-50 rounded-xl border border-slate-100 hover:border-[#3AE7E1]/40 transition-all hover:bg-slate-100/50 group">
              <div className="p-2.5 bg-white w-fit rounded-lg shadow-sm mb-3">
                <MessageSquare className="w-5 h-5 text-[#3AE7E1]" />
              </div>
              <div className="font-bold text-[#0B1C2D] mb-1 text-sm">BSC AI Advisor</div>
              <p className="text-xs text-slate-500">Đặt câu hỏi chiến lược về hiệu suất doanh nghiệp qua 4 góc nhìn BSC.</p>
            </Link>
            <Link to="/leadership/executive/cost-config" className="p-5 bg-slate-50 rounded-xl border border-slate-100 hover:border-[#3AE7E1]/40 transition-all hover:bg-slate-100/50 group">
              <div className="p-2.5 bg-white w-fit rounded-lg shadow-sm mb-3">
                <Calculator className="w-5 h-5 text-blue-600" />
              </div>
              <div className="font-bold text-[#0B1C2D] mb-1 text-sm">Máy tính Định giá</div>
              <p className="text-xs text-slate-500">Cấu hình CapEx/OpEx và tìm mức giá tối ưu theo hệ số nhân chiến lược.</p>
            </Link>
          </div>
        </div>

        <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-[#0B1C2D]">Hành động nhanh</h3>
            <span className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-bold rounded-full uppercase tracking-wider">3 Chờ duyệt</span>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Review ROI Dự án', sub: 'Portfolio đang dưới benchmark', urgent: true },
              { label: 'Phân bổ nhân sự', sub: 'Team Backend quá tải 110%', urgent: false },
              { label: 'Giữ chân Khách hàng', sub: 'Đặt lịch gặp Global Retail Inc', urgent: true },
            ].map((action, i) => (
              <button key={i} className="w-full text-left p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 group">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#0B1C2D] text-sm group-hover:text-[#3AE7E1] transition-colors">{action.label}</div>
                  {action.urgent && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                </div>
                <div className="text-xs text-slate-500 mt-1">{action.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
