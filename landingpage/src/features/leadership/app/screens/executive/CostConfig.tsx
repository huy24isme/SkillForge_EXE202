import { useState, useMemo } from 'react';
import {
    Calculator,
    TrendingUp,
    Briefcase,
    HelpCircle,
    Target,
    Sparkles,
    DollarSign,
    Users,
    Layers,
    ShieldAlert,
    ChevronDown,
    ArrowLeft
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function CostConfig() {
    const navigate = useNavigate();
    
    // Core Investment (CapEx)
    const [capEx, setCapEx] = useState(500);

    // Labor Breakdown
    const [seniorCount, setSeniorCount] = useState(2);
    const [midCount, setMidCount] = useState(3);
    const [juniorCount, setJuniorCount] = useState(1);
    const seniorRate = 45; // M VND
    const midRate = 25;
    const juniorRate = 12;

    const totalLabor = seniorCount * seniorRate + midCount * midRate + juniorCount * juniorRate;

    // Overhead Breakdown
    const [officeCost, setOfficeCost] = useState(30);
    const [softwareCost, setSoftwareCost] = useState(20);
    const [adminCost, setAdminCost] = useState(10);
    const totalOverhead = officeCost + softwareCost + adminCost;

    // Risk Buffer
    const [riskBufferPercent, setRiskBufferPercent] = useState(15);
    const riskBufferAmount = (totalLabor + totalOverhead) * (riskBufferPercent / 100);

    const monthlyOpEx = totalLabor + totalOverhead + riskBufferAmount;

    // Strategic Goals
    const [multiplier, setMultiplier] = useState<2 | 3>(2);
    const [breakEvenMonths, setBreakEvenMonths] = useState(12);
    const [clients, setClients] = useState(10);

    const totalCostProject = capEx + monthlyOpEx * breakEvenMonths;
    const targetRevenue = totalCostProject * multiplier;
    const requiredMonthlyRevenue = targetRevenue / breakEvenMonths;
    const recommendedPrice = requiredMonthlyRevenue / clients;

    const costBreakdownData = [
      { name: 'Nhân sự', value: totalLabor, color: '#3AE7E1' },
      { name: 'Vận hành', value: totalOverhead, color: '#8B5CF6' },
      { name: 'Dự phòng rủi ro', value: riskBufferAmount, color: '#F59E0B' },
    ];

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500 space-y-6 pb-12">
            {/* Navigation & Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-[#0B1C2D]">Cấu hình Chi phí Dự án chuyên sâu</h1>
                        <p className="text-slate-500 text-sm italic">Mô hình phân rã chi phí Labor, Overhead và Resource Buffer.</p>
                    </div>
                </div>
                <div className="flex bg-[#0B1C2D] text-white p-1 rounded-xl shadow-lg border border-white/10">
                    <div className="px-4 py-2 flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-[#3AE7E1]" />
                        <span className="text-sm font-bold">OpEx: {monthlyOpEx.toFixed(1)}M/th</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. Labor Configuration */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                    <h3 className="font-bold text-[#0B1C2D] flex items-center gap-2 border-b border-slate-50 pb-4">
                        <Users className="w-5 h-5 text-[#3AE7E1]" />
                        Cơ cấu Nhân sự (Labor)
                    </h3>
                    
                    {[
                        { label: 'Senior Developers', count: seniorCount, setter: setSeniorCount, rate: seniorRate },
                        { label: 'Middle Developers', count: midCount, setter: setMidCount, rate: midRate },
                        { label: 'Junior Developers', count: juniorCount, setter: setJuniorCount, rate: juniorRate },
                    ].map((role) => (
                        <div key={role.label} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-bold text-slate-700">{role.label}</span>
                                <span className="text-xs text-slate-400 font-medium">${role.rate}M / người</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <input 
                                    type="range" min="0" max="10" step="1" 
                                    value={role.count} 
                                    onChange={(e) => role.setter(Number(e.target.value))}
                                    className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#3AE7E1]"
                                />
                                <span className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg font-bold text-[#0B1C2D]">
                                    {role.count}
                                </span>
                            </div>
                        </div>
                    ))}
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex justify-between">
                        <span className="text-sm font-bold text-emerald-800 uppercase tracking-wider">Tổng quỹ lương</span>
                        <span className="font-black text-emerald-600">{totalLabor}M VND</span>
                    </div>
                </div>

                {/* 2. Overhead & Buffer */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                    <h3 className="font-bold text-[#0B1C2D] flex items-center gap-2 border-b border-slate-50 pb-4">
                        <Layers className="w-5 h-5 text-purple-600" />
                        Chi phí Vận hành & Buffer
                    </h3>

                    <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Chi phí cố định (Overhead)</label>
                        {[
                          { label: 'Văn phòng / Điện nước', val: officeCost, set: setOfficeCost },
                          { label: 'Software / API / Licenses', val: softwareCost, set: setSoftwareCost },
                          { label: 'Hành chính / Khác', val: adminCost, set: setAdminCost },
                        ].map(item => (
                            <div key={item.label} className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">{item.label}</span>
                                <input 
                                    type="number" 
                                    value={item.val} 
                                    onChange={(e) => item.set(Number(e.target.value))}
                                    className="w-20 p-2 bg-slate-50 border border-slate-100 rounded-xl text-right font-bold text-sm focus:ring-2 focus:ring-[#3AE7E1]"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 border-t border-slate-100 space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-[#0B1C2D] flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4 text-orange-500" />
                                Resource Buffer (%)
                            </label>
                            <span className="text-orange-600 font-bold">{riskBufferPercent}%</span>
                        </div>
                        <input 
                            type="range" min="0" max="40" step="5" 
                            value={riskBufferPercent} 
                            onChange={(e) => setRiskBufferPercent(Number(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                        <div className="text-[11px] text-slate-400">
                            Dự phòng cho rủi ro nhân sự, biến động hạ tầng và trễ dự án.
                        </div>
                    </div>
                </div>

                {/* 3. Results Summary */}
                <div className="space-y-6">
                    <div className="bg-[#0B1C2D] p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                        <h3 className="font-bold text-[#3AE7E1] mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Mô hình Định giá
                        </h3>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-end border-b border-white/10 pb-2">
                                <span className="text-slate-400 text-xs uppercase">CapEx ban đầu</span>
                                <span className="font-bold">{capEx}M</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-white/10 pb-2">
                                <span className="text-slate-400 text-xs uppercase">OpEx Hàng tháng</span>
                                <span className="font-bold">{monthlyOpEx.toFixed(1)}M</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-white/10 pb-2">
                                <span className="text-slate-400 text-xs uppercase">Doanh thu cần/Tháng</span>
                                <span className="font-bold">{requiredMonthlyRevenue.toFixed(1)}M</span>
                            </div>
                        </div>

                        <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                            <label className="text-[10px] text-[#3AE7E1] font-bold uppercase tracking-widest block mb-1">Giá đề xuất / KH</label>
                            <div className="text-4xl font-black text-[#3AE7E1]">
                                {recommendedPrice.toFixed(1)}M
                                <span className="text-base font-normal text-slate-400 ml-2">VND</span>
                            </div>
                            <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-500">
                                <Users className="w-3 h-3" /> Chia cho {clients} khách hàng
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100">
                        <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest mb-4">Cơ cấu OpEx tháng</h4>
                        <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={costBreakdownData}
                                        innerRadius={30}
                                        outerRadius={50}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {costBreakdownData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-2 mt-4">
                            {costBreakdownData.map(item => (
                                <div key={item.name} className="flex items-center justify-between text-[11px]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-slate-500">{item.name}</span>
                                    </div>
                                    <span className="font-bold text-slate-700">{Math.round(item.value)}M</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Advisor Context */}
            <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex items-start gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <Sparkles className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                    <h4 className="font-bold text-blue-900 text-sm mb-1">Chiến lược tối ưu Chi phí</h4>
                    <p className="text-xs text-blue-800/70 leading-relaxed">
                        Với đội ngũ hiện tại ({seniorCount} Senior, {midCount} Mid, {juniorCount} Jr), tỷ lệ quỹ lương chiếm <b>{Math.round((totalLabor / monthlyOpEx) * 100)}%</b> tổng OpEx. 
                        Để tối ưu hơn, SkillForge gợi ý chuyển 1 Middle sang Junior nếu phase Onboarding được tự động hóa, giúp tiết kiệm ~{midRate - juniorRate}M VND mỗi tháng.
                    </p>
                </div>
            </div>
        </div>
    );
}
