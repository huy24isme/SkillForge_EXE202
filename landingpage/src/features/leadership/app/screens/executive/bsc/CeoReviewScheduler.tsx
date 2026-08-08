import { useState } from 'react';
import { 
    Calendar, 
    Clock, 
    User, 
    FileText, 
    AlertTriangle, 
    CheckCircle2, 
    ChevronRight,
    MessageSquare,
    Users,
    ArrowLeft,
    Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CeoReviewScheduler() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const riskProjects = [
        { id: 1, name: 'Global Retail Inc', project: 'E-commerce App v2', risk: 'Cao', status: 'Trễ 5 ngày' },
        { id: 2, name: 'Logistics Pro', project: 'Logistics Portal', risk: 'Trung bình', status: 'Cần cải thiện' }
    ];

    const timeSlots = ['09:00', '10:30', '14:00', '15:30', '16:45'];

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-[#0B1C2D] mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Quay lại
            </button>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                {/* Header */}
                <div className="bg-[#0B1C2D] p-8 text-white relative">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-[#3AE7E1]/20 rounded-xl">
                                <Calendar className="w-6 h-6 text-[#3AE7E1]" />
                            </div>
                            <h1 className="text-2xl font-bold">Đặt lịch Review với CEO</h1>
                        </div>
                        <p className="text-slate-400 text-sm">Điều hành chiến lược: Giải quyết rủi ro và tối ưu hóa hiệu suất dự án.</p>
                    </div>
                    <Sparkles className="absolute top-8 right-8 w-24 h-24 text-[#3AE7E1]/10" />
                </div>

                <div className="p-8">
                    {/* Progress Steps */}
                    <div className="flex items-center justify-between mb-12 px-4">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all
                                    ${step === s ? 'bg-[#3AE7E1] text-[#0B1C2D] scale-110 shadow-lg' : 
                                      step > s ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                                </div>
                                <span className={`text-sm font-medium ${step === s ? 'text-[#0B1C2D]' : 'text-slate-400'}`}>
                                    {s === 1 ? 'Chọn dự án' : s === 2 ? 'Chọn thời gian' : 'Xác nhận nội dung'}
                                </span>
                                {s < 3 && <div className="w-12 h-px bg-slate-200 mx-2" />}
                            </div>
                        ))}
                    </div>

                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-[#0B1C2D] mb-4">Dự án cần Review ưu tiên</h2>
                            <div className="grid gap-4">
                                {riskProjects.map((p) => (
                                    <button 
                                        key={p.id}
                                        onClick={() => setStep(2)}
                                        className="group p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:border-[#3AE7E1] hover:bg-white hover:shadow-lg transition-all text-left"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-xl ${p.risk === 'Cao' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                                                    <AlertTriangle className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-[#0B1C2D]">{p.name}</h3>
                                                    <p className="text-sm text-slate-500">{p.project} • {p.status}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400 group-hover:text-[#3AE7E1]">
                                                <span className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">CHỌN DỰ ÁN</span>
                                                <ChevronRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-bold text-[#0B1C2D] mb-4 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-[#3AE7E1]" /> Chọn ngày
                                    </h3>
                                    <input 
                                        type="date" 
                                        className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3AE7E1] focus:border-transparent transition-all"
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#0B1C2D] mb-4 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-[#3AE7E1]" /> Chọn giờ
                                    </h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        {timeSlots.map(t => (
                                            <button 
                                                key={t}
                                                onClick={() => setSelectedTime(t)}
                                                className={`p-3 rounded-lg text-sm font-medium transition-all
                                                    ${selectedTime === t ? 'bg-[#3AE7E1] text-[#0B1C2D] shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between pt-6 border-t border-slate-100">
                                <button onClick={() => setStep(1)} className="px-6 py-2 text-slate-500 font-medium hover:text-[#0B1C2D]">Quay lại</button>
                                <button 
                                    onClick={() => setStep(3)}
                                    disabled={!selectedDate || !selectedTime}
                                    className="px-8 py-3 bg-[#0B1C2D] text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Tiếp theo
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <h3 className="font-bold text-[#0B1C2D] text-lg mb-4">Chi tiết nội dung buổi Review</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" /> Chương trình nghị sự (Agenda)
                                    </label>
                                    <textarea 
                                        className="w-full p-4 rounded-xl border border-slate-200 h-32 focus:outline-none focus:ring-2 focus:ring-[#3AE7E1]"
                                        placeholder="VD: Phân tích nguyên nhân trễ hạn, đề xuất giải pháp xử lý và nhu cầu hỗ trợ nguồn lực..."
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                        <Users className="w-4 h-4" /> Thành phần tham dự
                                    </label>
                                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-wrap gap-2">
                                        {['CEO - Nguyễn Văn A', 'Project Manager', 'Technical Lead'].map(u => (
                                            <span key={u} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600">
                                                {u}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between pt-8 border-t border-slate-100">
                                <button onClick={() => setStep(2)} className="px-6 py-2 text-slate-500 font-medium hover:text-[#0B1C2D]">Quay lại</button>
                                <button 
                                    onClick={() => {
                                        alert('Lịch review đã được gửi tới CEO và đội ngũ dự án!');
                                        navigate('/leadership/executive/customer');
                                    }}
                                    className="px-10 py-4 bg-[#3AE7E1] text-[#0B1C2D] rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
                                >
                                    XÁC NHẬN ĐẶT LỊCH
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                <div className="flex gap-3">
                    <FileText className="w-5 h-5 text-blue-500 shrink-0" />
                    <div>
                        <h4 className="text-sm font-bold text-blue-900 mb-1">Gợi ý từ AI Advisor</h4>
                        <p className="text-xs text-blue-800/80 leading-relaxed">
                            Đối với dự án **Global Retail Inc**, CEO nên tập trung vào việc giải trình trễ hạn 5 ngày của phase "Rebranding". 
                            Chuẩn bị sẵn báo cáo về hiệu suất nhân sự và các điểm nghẽn kỹ thuật để có buổi Review hiệu quả nhất.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
