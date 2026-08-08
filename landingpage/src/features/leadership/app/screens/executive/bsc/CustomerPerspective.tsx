import { useState } from 'react';
import {
    Users2,
    Smile,
    Frown,
    AlertTriangle,
    CheckCircle2,
    TrendingUp,
    Clock,
    Sparkles,
    ArrowUpRight,
    Search,
    ShieldCheck,
    Calendar,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend
} from 'recharts';

// --- Dữ liệu mẫu ---
const CUSTOMERS = [
    {
        id: 1,
        name: 'TechCorp Solutions',
        project: 'AI Support Platform',
        status: 'Khỏe mạnh',
        nps: 9,
        projects: 3,
        delay: 0,
        communication: 95,
        adherence: 92,
        issues: 1,
        deliveryStatus: 'Đúng hạn'
    },
    {
        id: 2,
        name: 'Global Retail Inc',
        project: 'E-commerce App v2',
        status: 'Có rủi ro',
        nps: 6,
        projects: 2,
        delay: 5,
        communication: 60,
        adherence: 55,
        issues: 4,
        deliveryStatus: 'Trễ 5 ngày'
    },
    {
        id: 3,
        name: 'Financier Bank',
        project: 'Fintech Web Portal',
        status: 'Khỏe mạnh',
        nps: 8,
        projects: 5,
        delay: 1,
        communication: 88,
        adherence: 85,
        issues: 2,
        deliveryStatus: 'Đúng hạn'
    },
    {
        id: 4,
        name: 'EcoPower Ltd',
        project: 'Marketing Site',
        status: 'Khỏe mạnh',
        nps: 9,
        projects: 1,
        delay: 0,
        communication: 96,
        adherence: 94,
        issues: 0,
        deliveryStatus: 'Đúng hạn'
    },
    {
        id: 5,
        name: 'Logistics Pro',
        project: 'Logistics Portal',
        status: 'Cảnh báo',
        nps: 7,
        projects: 2,
        delay: 3,
        communication: 72,
        adherence: 70,
        issues: 3,
        deliveryStatus: 'Trễ 3 ngày'
    },
];

// Health Score formula: (communication * 0.4) + (adherence * 0.4) - (issues * 5)
const calcHealthScore = (c: typeof CUSTOMERS[0]) =>
    Math.max(0, Math.min(100, c.communication * 0.4 + c.adherence * 0.4 - c.issues * 5));

const HEALTH_COLORS: Record<string, string> = {
    'Khỏe mạnh': '#10B981',
    'Cảnh báo': '#F59E0B',
    'Có rủi ro': '#EF4444',
};

const HEALTH_PIE_COLORS = ['#10B981', '#F59E0B', '#EF4444'];

export default function CustomerPerspective() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('Tất cả');

    const withScore = CUSTOMERS.map(c => ({ ...c, healthScore: Math.round(calcHealthScore(c)) }));

    const healthDist = [
        { name: 'Khỏe mạnh', value: withScore.filter(c => c.status === 'Khỏe mạnh').length },
        { name: 'Cảnh báo', value: withScore.filter(c => c.status === 'Cảnh báo').length },
        { name: 'Có rủi ro', value: withScore.filter(c => c.status === 'Có rủi ro').length },
    ];

    const onTimeDelivery = Math.round(
        (withScore.filter(c => c.delay === 0).length / withScore.length) * 100
    );

    const filtered = withScore.filter(c => {
        const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.project.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'Tất cả' || c.status === filter;
        return matchSearch && matchFilter;
    });

    const barData = withScore.map(c => ({
        name: c.name.split(' ')[0],
        'Điểm sức khỏe': c.healthScore,
        'NPS': c.nps * 10,
    }));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Tổng khách hàng</span>
                        <div className="p-1.5 bg-blue-50 rounded-lg"><Users2 className="w-4 h-4 text-blue-600" /></div>
                    </div>
                    <div className="text-3xl font-bold text-[#0B1C2D]">{CUSTOMERS.length}</div>
                    <div className="text-xs text-green-500 mt-1 font-medium">+1 tháng này</div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">KH hoạt động</span>
                        <div className="p-1.5 bg-[#3AE7E1]/10 rounded-lg"><Smile className="w-4 h-4 text-[#3AE7E1]" /></div>
                    </div>
                    <div className="text-3xl font-bold text-[#0B1C2D]">
                        {withScore.filter(c => c.status === 'Khỏe mạnh').length}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Trên tổng {CUSTOMERS.length} KH</div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">KH có rủi ro</span>
                        <div className="p-1.5 bg-red-50 rounded-lg"><AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" /></div>
                    </div>
                    <div className="text-3xl font-bold text-red-600">
                        {withScore.filter(c => c.status === 'Có rủi ro' || c.status === 'Cảnh báo').length}
                    </div>
                    <div className="text-xs text-red-400 mt-1">Cần chú ý ngay</div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Đúng hạn</span>
                        <div className="p-1.5 bg-green-50 rounded-lg"><Clock className="w-4 h-4 text-green-600" /></div>
                    </div>
                    <div className="text-3xl font-bold text-[#0B1C2D]">{onTimeDelivery}%</div>
                    <div className="text-xs text-orange-400 mt-1">Mục tiêu: 90%</div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Health Distribution Pie */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-[#0B1C2D] mb-4 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#3AE7E1]" />
                        Phân bố sức khỏe KH
                    </h3>
                    <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={healthDist}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}`}
                                    labelLine={false}
                                >
                                    {healthDist.map((_, index) => (
                                        <Cell key={index} fill={HEALTH_PIE_COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-around mt-2">
                        {healthDist.map((item, i) => (
                            <div key={i} className="text-center">
                                <div className="w-2.5 h-2.5 rounded-full mx-auto mb-1" style={{ backgroundColor: HEALTH_PIE_COLORS[i] }} />
                                <div className="text-[10px] text-slate-500 font-medium">{item.name}</div>
                                <div className="text-sm font-bold text-[#0B1C2D]">{item.value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Health Score Bar */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-[#0B1C2D] mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#3AE7E1]" />
                        Điểm sức khỏe & NPS theo khách hàng
                    </h3>
                    <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} barGap={2}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Legend />
                                <Bar dataKey="Điểm sức khỏe" fill="#3AE7E1" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="NPS" fill="#2563EB" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Tìm khách hàng hoặc dự án..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#3AE7E1] outline-none transition-all text-sm"
                    />
                </div>
                <div className="flex gap-2">
                    {['Tất cả', 'Khỏe mạnh', 'Cảnh báo', 'Có rủi ro'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filter === f
                                ? 'bg-[#0B1C2D] text-white'
                                : 'bg-slate-50 border border-slate-100 text-slate-600 hover:border-[#3AE7E1]'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Customer Portfolio Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-[#0B1C2D] flex items-center gap-2">
                        <Users2 className="w-5 h-5 text-[#3AE7E1]" />
                        Danh mục khách hàng
                    </h3>
                    <span className="text-xs text-slate-400">{filtered.length} khách hàng</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                                <th className="text-left px-6 py-3">Khách hàng</th>
                                <th className="text-left px-6 py-3">Dự án</th>
                                <th className="text-center px-6 py-3">Điểm sức khỏe</th>
                                <th className="text-center px-6 py-3">NPS</th>
                                <th className="text-center px-6 py-3">Trạng thái giao hàng</th>
                                <th className="text-center px-6 py-3">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(customer => (
                                <tr
                                    key={customer.id}
                                    className="border-b last:border-b-0 border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm shrink-0"
                                                style={{ backgroundColor: HEALTH_COLORS[customer.status] }}
                                            >
                                                {customer.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-[#0B1C2D]">{customer.name}</div>
                                                <div className="text-xs text-slate-400">{customer.projects} dự án</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">{customer.project}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${customer.healthScore}%`,
                                                        backgroundColor: HEALTH_COLORS[customer.status]
                                                    }}
                                                />
                                            </div>
                                            <span className="font-bold text-[#0B1C2D] text-sm">{customer.healthScore}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`font-bold text-lg ${customer.nps >= 8 ? 'text-green-600' : customer.nps >= 7 ? 'text-orange-500' : 'text-red-500'}`}>
                                            {customer.nps}<span className="text-xs font-normal text-slate-400">/10</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${customer.delay === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {customer.deliveryStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span
                                            className="text-xs px-2.5 py-1 rounded-full font-bold"
                                            style={{
                                                backgroundColor: HEALTH_COLORS[customer.status] + '20',
                                                color: HEALTH_COLORS[customer.status]
                                            }}
                                        >
                                            {customer.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* AI Insight + Critical Action */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-[#0B1C2D] to-[#1E3A5F] p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5">
                        <Sparkles className="w-32 h-32" />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-[#3AE7E1]/20 rounded-lg border border-[#3AE7E1]/30">
                            <Sparkles className="w-4 h-4 text-[#3AE7E1]" />
                        </div>
                        <div className="text-xs font-bold uppercase tracking-wider text-[#3AE7E1]">AI Phân tích khách hàng</div>
                    </div>
                    <ul className="space-y-3 text-sm text-slate-300 leading-relaxed">
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                            <span><b className="text-white">Global Retail Inc</b> có nguy cơ rời bỏ cao — NPS giảm từ 8 xuống 6 trong 2 tháng, trễ hạn 5 ngày.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                            <span><b className="text-white">Logistics Pro</b> cảnh báo giảm tương tác — tần suất giao tiếp giảm 28% so với tháng trước.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3AE7E1] mt-1.5 shrink-0" />
                            <span><b className="text-white">EcoPower Ltd</b> là khách hàng tiềm năng nhất để upsell — điểm sức khỏe 95, NPS 9/10.</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
                    <h3 className="font-bold text-[#0B1C2D] flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        Chỉ số dịch vụ
                    </h3>
                    {[
                        { label: 'Mức độ hài lòng chung', value: 84, color: '#2563EB' },
                        { label: 'Tỷ lệ giao hàng đúng hạn', value: onTimeDelivery, color: '#10B981' },
                        { label: 'Điểm NPS trung bình', value: 78, color: '#3AE7E1' },
                    ].map((item, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-sm mb-1.5">
                                <span className="text-slate-600 font-medium">{item.label}</span>
                                <span className="font-bold" style={{ color: item.color }}>{item.value}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                                />
                            </div>
                        </div>
                    ))}

                    <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Frown className="w-4 h-4 text-red-600" />
                            <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Cần chú ý</span>
                        </div>
                        <p className="text-sm text-red-700">
                            <b>Global Retail Inc</b> đang trễ hạn "Rebranding Phase 2" — 5 ngày. Cần lên lịch review CEO.
                        </p>
                        <button 
                            onClick={() => navigate('/leadership/executive/ceo-review')}
                            className="mt-3 w-full bg-red-600 text-white py-2 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors"
                        >
                            Đặt lịch Review CEO
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
