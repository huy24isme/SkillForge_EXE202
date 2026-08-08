import {
    Settings2,
    AlertCircle,
    CheckCircle2,
    Zap,
    Clock,
    TrendingUp,
    Sparkles,
    Activity,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Legend
} from 'recharts';

// --- Dữ liệu quy trình ---
const PROCESSES = [
    { id: 1, name: 'Onboarding KH', avgDuration: 12, benchmark: 5, unit: 'ngày', impact: 'Tài chính' },
    { id: 2, name: 'Phát triển Sprint', avgDuration: 18, benchmark: 14, unit: 'ngày', impact: 'Năng suất' },
    { id: 3, name: 'Chuyển đổi Sales', avgDuration: 40, benchmark: 30, unit: 'ngày', impact: 'Doanh thu' },
    { id: 4, name: 'Sửa lỗi QA', avgDuration: 4, benchmark: 3, unit: 'ngày', impact: 'Chất lượng' },
    { id: 5, name: 'Triển khai DevOps', avgDuration: 8, benchmark: 3, unit: 'ngày', impact: 'Vận hành' },
    { id: 6, name: 'Review Code', avgDuration: 2, benchmark: 2, unit: 'ngày', impact: 'Chất lượng' },
];

// Bottleneck logic: avg > benchmark * 1.5 → bottleneck
const getStatus = (avg: number, benchmark: number) => {
    const ratio = avg / benchmark;
    if (ratio > 1.5) return 'Nghẽn cổ chai';
    if (ratio > 1.1) return 'Chậm';
    return 'Hiệu quả';
};

const STATUS_COLORS: Record<string, string> = {
    'Nghẽn cổ chai': '#EF4444',
    'Chậm': '#F59E0B',
    'Hiệu quả': '#10B981',
};

const STATUS_BG: Record<string, string> = {
    'Nghẽn cổ chai': '#FEF2F2',
    'Chậm': '#FFFBEB',
    'Hiệu quả': '#ECFDF5',
};

export default function InternalProcessPerspective() {
    const navigate = useNavigate();
    const enriched = PROCESSES.map(p => ({
        ...p,
        status: getStatus(p.avgDuration, p.benchmark),
        overrun: ((p.avgDuration - p.benchmark) / p.benchmark) * 100,
    }));

    const bottlenecks = enriched.filter(p => p.status === 'Nghẽn cổ chai').length;
    const slow = enriched.filter(p => p.status === 'Chậm').length;
    const avgCycleTime = Math.round(
        enriched.reduce((sum, p) => sum + p.avgDuration, 0) / enriched.length
    );
    const efficiencyScore = Math.round(
        enriched.filter(p => p.status === 'Hiệu quả').length / enriched.length * 100
    );

    const chartData = enriched.map(p => ({
        name: p.name.slice(0, 10) + (p.name.length > 10 ? '...' : ''),
        'Thực tế (ngày)': p.avgDuration,
        'Benchmark (ngày)': p.benchmark,
    }));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Thời gian chu kỳ TB</span>
                        <div className="p-1.5 bg-purple-50 rounded-lg"><Clock className="w-4 h-4 text-purple-600" /></div>
                    </div>
                    <div className="text-3xl font-bold text-[#0B1C2D]">{avgCycleTime}</div>
                    <div className="text-xs text-slate-400 mt-1">ngày / quy trình</div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Quy trình nghẽn</span>
                        <div className="p-1.5 bg-red-50 rounded-lg"><AlertCircle className="w-4 h-4 text-red-500 animate-pulse" /></div>
                    </div>
                    <div className="text-3xl font-bold text-red-600">{bottlenecks}</div>
                    <div className="text-xs text-red-400 mt-1">{slow} quy trình chậm</div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Điểm hiệu quả</span>
                        <div className="p-1.5 bg-green-50 rounded-lg"><TrendingUp className="w-4 h-4 text-green-600" /></div>
                    </div>
                    <div className="text-3xl font-bold text-green-600">{efficiencyScore}%</div>
                    <div className="text-xs text-green-500 mt-1">+4.2% so với năm ngoái</div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Quy trình hoạt động</span>
                        <div className="p-1.5 bg-blue-50 rounded-lg"><Activity className="w-4 h-4 text-blue-600" /></div>
                    </div>
                    <div className="text-3xl font-bold text-[#0B1C2D]">{PROCESSES.length}</div>
                    <div className="text-xs text-slate-400 mt-1">Đang theo dõi</div>
                </div>
            </div>

            {/* Chart: Thực tế vs Benchmark */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-[#0B1C2D] mb-4 flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-purple-600" />
                    So sánh thời gian thực tế vs Benchmark
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis
                                tick={{ fill: '#64748B', fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={v => `${v}n`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                formatter={(v: number | string) => `${v} ngày`}
                            />
                            <Legend />
                            <Bar dataKey="Thực tế (ngày)" fill="#EF4444" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="Benchmark (ngày)" fill="#3AE7E1" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Process Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-[#0B1C2D] flex items-center gap-2">
                            <Zap className="w-5 h-5 text-purple-600" />
                            Bảng phân tích quy trình vận hành
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase font-bold tracking-wider">
                                    <th className="text-left px-5 py-3">Quy trình</th>
                                    <th className="text-center px-5 py-3">Thời gian TB</th>
                                    <th className="text-center px-5 py-3">Benchmark</th>
                                    <th className="text-center px-5 py-3">Chênh lệch</th>
                                    <th className="text-center px-5 py-3">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enriched.map(proc => (
                                    <tr key={proc.id} className="border-b last:border-b-0 border-slate-50 hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="font-bold text-[#0B1C2D]">{proc.name}</div>
                                            <div className="text-xs text-slate-400">Tác động: {proc.impact}</div>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className="font-bold text-[#0B1C2D]">{proc.avgDuration}</span>
                                            <span className="text-xs text-slate-400 ml-1">{proc.unit}</span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className="font-medium text-slate-600">{proc.benchmark}</span>
                                            <span className="text-xs text-slate-400 ml-1">{proc.unit}</span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className={`font-bold text-sm ${proc.overrun > 0 ? 'text-red-500' : 'text-green-600'}`}>
                                                {proc.overrun > 0 ? '+' : ''}{Math.round(proc.overrun)}%
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span
                                                className="text-xs px-2.5 py-1 rounded-full font-bold"
                                                style={{
                                                    backgroundColor: STATUS_BG[proc.status],
                                                    color: STATUS_COLORS[proc.status]
                                                }}
                                            >
                                                {proc.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* AI Recommendations */}
                <div className="space-y-4">
                    <div className="bg-gradient-to-br from-[#0B1C2D] to-[#1E3A5F] p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <Sparkles className="w-24 h-24" />
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-[#3AE7E1]/20 rounded-lg border border-[#3AE7E1]/30">
                                <Sparkles className="w-4 h-4 text-[#3AE7E1]" />
                            </div>
                            <div className="text-xs font-bold uppercase tracking-wider text-[#3AE7E1]">AI Phát hiện nghẽn cổ chai</div>
                        </div>
                        <div className="space-y-4">
                            {enriched.filter(p => p.status !== 'Hiệu quả').slice(0, 3).map(p => (
                                <div key={p.id} className="p-3 bg-white/5 rounded-xl border border-white/10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: STATUS_COLORS[p.status] }}
                                        />
                                        <span className="font-bold text-sm">{p.name}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Mất <b className="text-white">{p.avgDuration} ngày</b> — vượt benchmark <b className="text-red-400">{Math.round(p.overrun)}%</b>.
                                        {p.impact === 'Tài chính' && ' Tác động trực tiếp đến dòng tiền.'}
                                        {p.impact === 'Doanh thu' && ' Làm chậm chuyển đổi khách hàng mới.'}
                                        {p.impact === 'Vận hành' && ' Gây trễ triển khai sản phẩm.'}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={() => navigate('/leadership/executive/optimize')}
                            className="w-full mt-4 py-2.5 bg-[#3AE7E1] text-[#0B1C2D] rounded-xl font-bold text-sm hover:shadow-[0_0_20px_rgba(58,231,225,0.3)] transition-all"
                        >
                            Khởi động tối ưu hóa
                        </button>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chỉ số hiệu quả</span>
                            <span className="text-purple-600 font-bold">{efficiencyScore}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-purple-500 rounded-full transition-all duration-1000"
                                style={{ width: `${efficiencyScore}%` }}
                            />
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <div className="font-bold text-green-600">{enriched.filter(p => p.status === 'Hiệu quả').length}</div>
                                <div className="text-slate-500">Hiệu quả</div>
                            </div>
                            <div className="p-2 bg-orange-50 rounded-lg">
                                <div className="font-bold text-orange-600">{slow}</div>
                                <div className="text-slate-500">Chậm</div>
                            </div>
                            <div className="p-2 bg-red-50 rounded-lg">
                                <div className="font-bold text-red-600">{bottlenecks}</div>
                                <div className="text-slate-500">Nghẽn</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
