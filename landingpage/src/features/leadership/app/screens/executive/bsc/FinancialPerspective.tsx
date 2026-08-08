import { useState } from 'react';
import { 
    TrendingUp, 
    TrendingDown, 
    DollarSign, 
    PieChart as PieChartIcon, 
    ArrowUpRight, 
    ArrowDownRight,
    Activity,
    Target,
    Zap,
    Briefcase,
    ShieldCheck,
    AlertCircle,
    Flame,
    Navigation,
    Calculator,
    BarChart3,
    ChevronDown,
    ChevronUp,
    Info,
    LayoutDashboard,
    Sparkles,
    Banknote,
    Wallet2
} from 'lucide-react';
import { 
    LineChart, 
    Line, 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    ComposedChart,
    Legend
} from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
  { month: 'Feb', revenue: 52000, expenses: 34000, profit: 18000 },
  { month: 'Mar', revenue: 48000, expenses: 35000, profit: 13000 },
  { month: 'Apr', revenue: 61000, expenses: 38000, profit: 23000 },
  { month: 'May', revenue: 55000, expenses: 40000, profit: 15000 },
  { month: 'Jun', revenue: 67000, expenses: 42000, profit: 25000 },
];

const burnRateData = [
  { month: 'Jan', burn: 32000 },
  { month: 'Feb', burn: 31000 },
  { month: 'Mar', burn: 35000 },
  { month: 'Apr', burn: 34000 },
  { month: 'May', burn: 38000 },
  { month: 'Jun', burn: 36000 },
];

const PORTFOLIO_PROJECTS = [
    { name: 'E-commerce Platform Migration', revenue: 1200000, cost: 450000, roi: 166, share: 45, color: '#10B981', client: 'Retail Global' },
    { name: 'Cloud Infrastructure Upgrade', revenue: 550000, cost: 280000, roi: 96, share: 20, color: '#3B82F6', client: 'TechFlow' },
    { name: 'AI Voice Assistant Integration', revenue: 420000, cost: 180000, roi: 133, share: 15, color: '#8B5CF6', client: 'HomeSmart' },
    { name: 'Legacy Data Cleanup', revenue: 150000, cost: 80000, roi: 87, share: 6, color: '#94A3B8', client: 'Internal' },
    { name: 'Mobile App Polish', revenue: 120000, cost: 50000, roi: 140, share: 5, color: '#94A3B8', client: 'FitTrack' },
    { name: 'API Security Audit', revenue: 110000, cost: 90000, roi: 22, share: 4, color: '#94A3B8', client: 'CyberShield' },
    { name: 'Marketing Tooling', revenue: 100000, cost: 30000, roi: 233, share: 5, color: '#94A3B8', client: 'Internal' },
];

const totalRevenue = PORTFOLIO_PROJECTS.reduce((sum, p) => sum + p.revenue, 0);
const totalCost = PORTFOLIO_PROJECTS.reduce((sum, p) => sum + p.cost, 0);
const portfolioRoi = ((totalRevenue - totalCost) / totalCost) * 100;

const top3 = PORTFOLIO_PROJECTS.slice(0, 3);
const others = PORTFOLIO_PROJECTS.slice(3);
const othersRevenue = others.reduce((sum, p) => sum + p.revenue, 0);
const othersShare = (othersRevenue / totalRevenue) * 100;

// Portfolio Advanced KPIs
const totalProfit = totalRevenue - totalCost;
const avgRoi = portfolioRoi;
const maxRoiProject = [...PORTFOLIO_PROJECTS].sort((a, b) => b.roi - a.roi)[0];
const minRoiProject = [...PORTFOLIO_PROJECTS].sort((a, b) => a.roi - b.roi)[0];

export default function FinancialPerspective() {
  const [timeframe, setTimeframe] = useState('6M');
  const [showOthers, setShowOthers] = useState(false);

  const metrics = [
    { 
      label: "Doanh thu tháng (MRR)", 
      value: "$67,200", 
      change: "+12.4%", 
      isPositive: true, 
      icon: DollarSign, 
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    { 
      label: "EBITDA Lũy kế", 
      value: "$107,300", 
      change: "+8.1%", 
      isPositive: true, 
      icon: TrendingUp, 
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    { 
      label: "Burn Rate Trung bình", 
      value: "$34,500", 
      change: "-2.3%", 
      isPositive: true, 
      icon: Flame, 
      color: "text-orange-600",
      bg: "bg-orange-50"
    },
    { 
      label: "Runway Dự kiến", 
      value: "14.2 Tháng", 
      change: "+1.5", 
      isPositive: true, 
      icon: Navigation, 
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
  ];

  const advancedMetrics = [
    { label: "LTV (Lifetime Value)", value: "$4,200", icon: Target },
    { label: "CAC (Acquisition Cost)", value: "$850", icon: Zap },
    { label: "LTV/CAC Ratio", value: "4.9x", icon: Activity, status: 'Lý tưởng' },
    { label: "Gross Margin", value: "68%", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-xl ${m.bg}`}>
                <m.icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${m.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                {m.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {m.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-[#0B1C2D] mb-1">{m.value}</div>
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Cash Flow & Profit Analysis - Upgraded to Full Width */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl">
              <Banknote className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-black text-[#0B1C2D] text-2xl tracking-tight">Phân tích Dòng tiền & Lợi nhuận</h3>
              <p className="text-sm text-slate-400 font-medium">Báo cáo so sánh Doanh thu (Gross) và Chi phí vận hành (OpEx)</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {['1M', '3M', '6M', '1Y'].map(t => (
                <button 
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all ${timeframe === t ? 'bg-white shadow-sm text-[#0B1C2D]' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Financial KPI Sub-cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Tổng Doanh thu", value: "$338,200", trend: "+12.2%", icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Chi phí vận hành", value: "$221,000", trend: "-2.4%", icon: Wallet2, color: "text-slate-600", bg: "bg-slate-50" },
            { label: "Lợi nhuận thuần", value: "$117,200", trend: "+18.5%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Biên lợi nhuận", value: "34.6%", trend: "+3.1%", icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
          ].map((card, idx) => (
            <div key={idx} className={`${card.bg} p-6 rounded-3xl border border-slate-100/50`}>
               <div className="flex items-center justify-between mb-3">
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                  <span className="text-[10px] font-black text-emerald-600 bg-white px-2 py-0.5 rounded-full shadow-sm">{card.trend}</span>
               </div>
               <div className="text-xl font-black text-[#0B1C2D]">{card.value}</div>
               <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Combined Visualization */}
        <div className="h-[450px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={revenueData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <defs>
                <linearGradient id="colorRevenueFull" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.4}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 13, fontWeight: 700}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip 
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '15px' }}
                cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              
              {/* Areas for Trends */}
              <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#3B82F6" strokeWidth={4} fill="url(#colorRevenueFull)" />
              <Area type="monotone" dataKey="expenses" name="Chi phí (OpEx)" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" fill="none" />
              
              {/* Bar for Monthly Profit Comparison */}
              <Bar dataKey="profit" name="Lợi nhuận" barSize={40} radius={[8, 8, 0, 0]}>
                {revenueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.profit >= 15000 ? '#10B981' : '#34D399'} fillOpacity={0.8} />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* AI Insight Box for Cash Flow */}
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-start gap-4">
           <div className="p-2 bg-emerald-100 rounded-xl">
              <Sparkles className="w-5 h-5 text-emerald-600" />
           </div>
           <div>
              <h4 className="text-sm font-bold text-[#0B1C2D] mb-1">AI Financial Insight</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Biên lợi nhuận của bạn đã tăng **4.2%** trong 3 tháng qua. Điều này cho thấy việc tối ưu hóa chi phí vận hành (OpEx) đang phát huy tác dụng tốt. 
                Dự báo dòng tiền: Có thể tái đầu tư **$25k** vào Marketing trong tháng tới mà không ảnh hưởng đến Runway.
              </p>
           </div>
        </div>
      </div>

      {/* Expanded Portfolio ROI Intelligence Dashboard - Full Width */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col space-y-10">
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#3AE7E1]/10 rounded-2xl">
                      <LayoutDashboard className="w-8 h-8 text-[#3AE7E1]" />
                  </div>
                  <div>
                      <h3 className="font-black text-[#0B1C2D] text-2xl tracking-tight">Trung tâm Phân tích ROI Danh mục</h3>
                      <p className="text-sm text-slate-400 font-medium">Portfolio Intelligence Intelligence Dashboard • Real-time Data</p>
                  </div>
              </div>
              <div className="flex items-center gap-3">
                  <span className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] uppercase font-black text-slate-500 tracking-widest border border-slate-200">
                    Q1 2026 Strategy
                  </span>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                      <Info className="w-5 h-5 text-slate-400" />
                  </div>
              </div>
          </div>

          {/* KPI Summary Row - Redesigned */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                  { label: "ROI Danh mục", value: `+${portfolioRoi.toFixed(0)}%`, color: "text-emerald-600", bg: "bg-emerald-50", icon: TrendingUp },
                  { label: "Tổng Doanh thu", value: `${(totalRevenue / 1000000).toFixed(2)}B`, color: "text-[#0B1C2D]", bg: "bg-slate-50", icon: DollarSign },
                  { label: "Tổng Chi phí", value: `${(totalCost / 1000000).toFixed(2)}B`, color: "text-slate-500", bg: "bg-slate-50", icon: Activity },
                  { label: "Lợi nhuận gộp", value: `${(totalProfit / 1000000).toFixed(2)}B`, color: "text-blue-600", bg: "bg-blue-50", icon: Calculator },
                  { label: "ROI Cao nhất", value: `${maxRoiProject.roi}%`, sub: maxRoiProject.name, color: "text-emerald-600", bg: "bg-emerald-50/50" },
                  { label: "ROI Thấp nhất", value: `${minRoiProject.roi}%`, sub: minRoiProject.name, color: "text-red-600", bg: "bg-red-50/50" },
              ].map((kpi, idx) => (
                  <div key={idx} className={`${kpi.bg} p-5 rounded-3xl border border-slate-100 transition-all hover:scale-[1.02] cursor-default`}>
                      <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2 flex items-center justify-between">
                          {kpi.label}
                          {kpi.icon && <kpi.icon className="w-3.5 h-3.5 opacity-40 text-slate-900" />}
                      </div>
                      <div className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</div>
                      {kpi.sub && <div className="text-[9px] text-slate-400 truncate mt-1 font-bold">{kpi.sub}</div>}
                  </div>
              ))}
          </div>

          {/* Large Visualization Section */}
          <div className="space-y-6">
              <div className="flex justify-between items-end">
                  <div>
                      <h4 className="font-bold text-[#0B1C2D]">Phân bổ Portfolio 100%</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Tỷ trọng doanh thu đóng góp từ các dự án chiến lược</p>
                  </div>
                  <div className="flex gap-4">
                    {top3.map(p => (
                        <div key={p.name} className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: p.color }} />
                             <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{p.name.split(' ')[0]}...</span>
                        </div>
                    ))}
                    <div className="flex items-center gap-2 text-slate-400">
                         <div className="w-3 h-3 rounded-full bg-slate-300" />
                         <span className="text-[10px] font-bold uppercase tracking-tighter">Dự án khác</span>
                    </div>
                  </div>
              </div>

              <div className="h-20 w-full flex rounded-[1.25rem] overflow-hidden shadow-2xl shadow-slate-100 bg-slate-100 border-4 border-white">
                  {top3.map(p => (
                      <div 
                          key={p.name}
                          className="h-full transition-all hover:brightness-110 cursor-pointer relative group flex items-center justify-center"
                          style={{ width: `${p.share}%`, backgroundColor: p.color }}
                      >
                          <div className="text-white text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">
                              {p.share}%
                          </div>
                      </div>
                  ))}
                  <div 
                      className="h-full bg-slate-300 relative group cursor-pointer flex items-center justify-center transition-all hover:bg-slate-400/50"
                      style={{ width: `${othersShare}%` }}
                  >
                      <div className="text-slate-600 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity bg-white/40 px-2 py-1 rounded-full backdrop-blur-sm">
                          {othersShare.toFixed(0)}%
                      </div>
                  </div>
              </div>
          </div>

          {/* Detailed Data Table */}
          <div className="bg-slate-50/50 rounded-[2rem] border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
                  <h4 className="font-bold text-[#0B1C2D] flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-500" />
                      Chi tiết Hiệu suất Dự án
                  </h4>
                  <button className="text-xs font-bold text-blue-600 hover:underline">Xuất báo cáo PDF</button>
              </div>
              <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                          <th className="px-8 py-4">Tên Dự án</th>
                          <th className="px-4 py-4">Khách hàng</th>
                          <th className="px-4 py-4 text-right">Doanh thu</th>
                          <th className="px-4 py-4 text-right">Chi phí</th>
                          <th className="px-4 py-4 text-center">ROI (%)</th>
                          <th className="px-8 py-4 text-right">Tỷ trọng (%)</th>
                      </tr>
                  </thead>
                  <tbody>
                      {PORTFOLIO_PROJECTS.map((p, idx) => (
                          <tr key={idx} className="group hover:bg-white transition-colors border-b border-slate-50 last:border-0 lowercase">
                              <td className="px-8 py-5">
                                  <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                                      <span className="font-bold text-[#0B1C2D] capitalize">{p.name}</span>
                                  </div>
                              </td>
                              <td className="px-4 py-5 text-slate-500 font-medium capitalize">{p.client}</td>
                              <td className="px-4 py-5 text-right font-bold text-slate-700">${(p.revenue / 1000).toFixed(0)}k</td>
                              <td className="px-4 py-5 text-right text-slate-400 font-medium">${(p.cost / 1000).toFixed(0)}k</td>
                              <td className="px-4 py-5 text-center">
                                  <span className={`px-2 py-1 rounded-full text-[10px] font-black ${p.roi > 50 ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                                      +{p.roi}%
                                  </span>
                              </td>
                              <td className="px-8 py-5 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                      <span className="font-black text-[#0B1C2D]">{p.share}%</span>
                                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                          <div className="h-full rounded-full" style={{ width: `${p.share}%`, backgroundColor: p.color }} />
                                      </div>
                                  </div>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>

          {/* AI Strategic Insights - Moved to Bottom of Module */}
          <div className="bg-[#0B1C2D] rounded-[2rem] p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Sparkles className="w-32 h-32 text-[#3AE7E1]" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-[#3AE7E1]/20 rounded-xl border border-[#3AE7E1]/30">
                            <Sparkles className="w-5 h-5 text-[#3AE7E1]" />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-[#3AE7E1]">Executive Strategic Insights</h4>
                    </div>
                
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <div className="text-xs font-black text-orange-400 uppercase tracking-widest">Rủi ro tập trung</div>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                <b>45% doanh thu</b> đến từ dự án E-commerce. Danh mục hiện đang phụ thuộc lớn vào một khách hàng duy nhất. Cần cân đối tỷ trọng trong Q2.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-xs font-black text-emerald-400 uppercase tracking-widest">Cơ hội mở rộng</div>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                <b>ROI Đột phá (233%):</b> Công cụ Marketing Tool mang lại hiệu quả cực cao mặc dù vốn thấp. Đề xuất tăng ngân sách marketing 15%.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-xs font-black text-red-400 uppercase tracking-widest">Cảnh báo Biên lợi nhuận</div>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                <b>Margin Destroyer:</b> Dự án Security Audit (ROI 22%) chiếm dụng nguồn lực cấp cao nhưng biên lợi nhuận mỏng. Cần review lại nhân sự.
                            </p>
                        </div>
                    </div>
                </div>
          </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {advancedMetrics.map((m, i) => (
          <div key={i} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <m.icon className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{m.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-xl font-bold text-[#0B1C2D]">{m.value}</div>
              {m.status && (
                <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-bold">
                  {m.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* AI Financial Strategy Advisor */}
      <div className="bg-[#0B1C2D] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
          <div className="md:w-1/3 text-center md:text-left">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#3AE7E1]/20 rounded-full mb-4 border border-[#3AE7E1]/30">
               <Calculator className="w-4 h-4 text-[#3AE7E1]" />
               <span className="text-[10px] font-bold text-[#3AE7E1] uppercase tracking-widest">Financial AI Advisor</span>
             </div>
             <h2 className="text-3xl font-bold mb-4">Chiến lược Tài chính Quý 3</h2>
             <p className="text-slate-400 text-sm leading-relaxed mb-6">Dựa trên dòng tiền hiện tại và dự báo MRR, SkillForge đề xuất tối ưu hóa OpEx thông qua tự động hóa quy trình nội bộ.</p>
             <button className="px-6 py-3 bg-[#3AE7E1] text-[#0B1C2D] rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-[#3AE7E1]/20">Xem Báo Cáo Chi Tiết</button>
          </div>
          
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-3 text-[#3AE7E1] font-bold">
                 <BarChart3 className="w-4 h-4" />
                 <span className="text-xs uppercase">Dự báo Điểm Hòa Vốn</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">Theo tốc độ tăng trưởng 12%/tháng, điểm hòa vốn dự kiến sẽ đạt được vào **phần đầu Tháng 10/2026**.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-3 text-[#3AE7E1] font-bold">
                 <Zap className="w-4 h-4" />
                 <span className="text-xs uppercase">Tối ưu Chi phí Acquisition</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">Tăng tỷ lệ Referral từ khách hàng hiện tại có thể giúp giảm CAC thêm **15%** trong 3 tháng tới.</p>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-[#3AE7E1] opacity-5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
