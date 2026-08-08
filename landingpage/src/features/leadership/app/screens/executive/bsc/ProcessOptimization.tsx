import { useState, useMemo } from 'react';
import { 
    Zap, 
    ArrowRight, 
    CheckCircle2, 
    Play, 
    Settings2, 
    Users, 
    Bot, 
    TrendingUp,
    ShieldCheck,
    AlertCircle,
    ArrowLeft,
    Sparkles,
    BarChart3
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
    Cell
} from 'recharts';

export default function ProcessOptimization() {
    const navigate = useNavigate();
    const [optimizationRunning, setOptimizationRunning] = useState(false);
    const [selectedStep, setSelectedStep] = useState(0);

    const bottleneckData = [
        { name: 'Khảo sát', current: 12, target: 5, color: '#F43F5E' },
        { name: 'Thiết kế', current: 18, target: 14, color: '#F43F5E' },
        { name: 'Phát triển', current: 40, target: 30, color: '#FB923C' },
        { name: 'Testing', current: 8, target: 3, color: '#F43F5E' },
    ];

    const optimizationPlans = [
        {
            title: 'Tự động hóa Workflow',
            icon: Bot,
            description: 'Áp dụng AI để tự động hóa khâu Khảo sát và Kiểm thử (Testing).',
            impact: 'Giảm 60% thời gian xử lý',
            status: 'Khả thi cao'
        },
        {
            title: 'Tối ưu nguồn lực',
            icon: Users,
            description: 'Chuyển 2 Senior Dev từ dự án Marketing sang hỗ trợ phase Phát triển.',
            impact: 'Tăng 25% tốc độ thực thi',
            status: 'Cần phê duyệt'
        },
        {
            title: 'Lean Process Redesign',
            icon: Settings2,
            description: 'Loại bỏ 2 bước review trung gian trong quy trình Thiết kế.',
            impact: 'Giảm 4 ngày chu kỳ',
            status: 'Giải pháp gốc'
        }
    ];

    const steps = [
        'Thu thập dữ liệu thực tế',
        'Xác định nguyên nhân gốc rễ',
        'Mô phỏng kịch bản tối ưu',
        'Phê duyệt và triển khai'
    ];

    const handleRunOptimization = () => {
        setOptimizationRunning(true);
        let currentStep = 0;
        const interval = setInterval(() => {
            currentStep++;
            setSelectedStep(currentStep);
            if (currentStep >= steps.length - 1) {
                clearInterval(interval);
                setTimeout(() => {
                    setOptimizationRunning(false);
                    alert('Quy trình tối ưu hóa đã được khởi động và gửi thông báo tới các bộ phận liên quan!');
                }, 1000);
            }
        }, 800);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-[#0B1C2D] mb-4 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Quay lại Quy trình
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel: Simulation & Actions */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-[#0B1C2D] flex items-center gap-3">
                                    <div className="p-2 bg-[#3AE7E1]/20 rounded-xl text-[#3AE7E1]">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    Khởi động tối ưu hóa Quy trình
                                </h1>
                                <p className="text-slate-500 mt-2">Mô phỏng và kích hoạt giải pháp tối ưu cho nút thắt cổ chai đã phát hiện.</p>
                            </div>
                            <button 
                                onClick={handleRunOptimization}
                                disabled={optimizationRunning}
                                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg
                                    ${optimizationRunning ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-[#0B1C2D] text-white hover:bg-slate-800 hover:scale-105'}`}
                            >
                                {optimizationRunning ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                                        ĐANG XỬ LÝ...
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4 fill-current" />
                                        KHỞI ĐỘNG NGAY
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Chart Comparison */}
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h3 className="text-sm font-bold text-[#0B1C2D] mb-6 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-[#3AE7E1]" />
                                Dự báo cải thiện thời gian (Ngày)
                            </h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={bottleneckData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" tick={{ fill: '#64748B', fontSize: 12 }} width={80} axisLine={false} tickLine={false} />
                                        <Tooltip 
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                        />
                                        <Bar dataKey="current" name="Hiện tại" radius={[0, 4, 4, 0]} barSize={20}>
                                            {bottleneckData.map((entry, index) => (
                                                <Cell key={index} fill={entry.color} fillOpacity={0.3} stroke={entry.color} strokeWidth={1} />
                                            ))}
                                        </Bar>
                                        <Bar dataKey="target" name="Sau tối ưu" fill="#10B981" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center gap-6 mt-4">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <div className="w-3 h-3 bg-red-100 border border-red-500 rounded" /> Hiện tại (Nghẽn)
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <div className="w-3 h-3 bg-emerald-500 rounded" /> Sau tối ưu (AI dự báo)
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step Visualization */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
                        <h3 className="font-bold text-[#0B1C2D] mb-8">Lộ trình tối ưu hóa 04 bước</h3>
                        <div className="flex items-center justify-between relative px-4">
                            <div className="absolute top-4 left-0 w-full h-px bg-slate-100 -z-0" />
                            {steps.map((text, i) => (
                                <div key={i} className="flex flex-col items-center gap-3 relative z-10 w-1/4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500
                                        ${selectedStep === i ? 'bg-[#3AE7E1] text-[#0B1C2D] scale-125 shadow-lg' : 
                                          selectedStep > i ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-200 text-slate-300'}`}>
                                        {selectedStep > i ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                                    </div>
                                    <span className={`text-[11px] font-bold text-center uppercase tracking-tighter w-full
                                        ${selectedStep === i ? 'text-[#3AE7E1]' : 'text-slate-400'}`}>
                                        {text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Plans & Insights */}
                <div className="space-y-6">
                    <div className="bg-[#0B1C2D] p-6 rounded-3xl text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-[#3AE7E1]" />
                                Giải pháp từ AI Advisor
                            </h3>
                            <div className="space-y-4">
                                {optimizationPlans.map((plan, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-[#3AE7E1]/20 rounded-lg text-[#3AE7E1]">
                                                <plan.icon className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold">{plan.title}</h4>
                                                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{plan.description}</p>
                                                <div className="flex items-center justify-between mt-3">
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">{plan.impact}</span>
                                                    <span className="text-[10px] text-white/40">{plan.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Sparkles className="absolute -bottom-8 -right-8 w-32 h-32 opacity-10" />
                    </div>

                    <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                        <div className="flex items-center gap-2 text-emerald-700 font-bold mb-3">
                            <ShieldCheck className="w-5 h-5" />
                            Cam kết hiệu quả
                        </div>
                        <ul className="space-y-3">
                            {[
                                'Tiết kiệm ~240 giờ làm việc/tháng',
                                'Giảm 18% chi phí vận hành phase Onboarding',
                                'Tăng chỉ số CSAT dự kiến lên +12 điểm'
                            ].map((text, i) => (
                                <li key={i} className="flex gap-2 text-xs text-emerald-800 leading-relaxed">
                                    <ArrowRight className="w-3 h-3 mt-0.5 shrink-0" /> {text}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
