import React, { useState, useRef, useEffect } from 'react';
import {
    Send,
    Bot,
    User,
    Sparkles,
    Wallet,
    Users2,
    Settings2,
    GraduationCap,
    RotateCcw
} from 'lucide-react';

interface Message {
    id: number;
    type: 'bot' | 'user';
    text: string;
    chips?: string[];
    perspective?: string;
}

// BSC Knowledge Base
const BSC_RESPONSES: { keywords: string[]; perspective: string; response: string }[] = [
    {
        keywords: ['roi', 'lợi nhuận', 'sinh lời', 'hiệu quả tài chính'],
        perspective: 'Tài chính',
        response: '💰 **Phân tích ROI Danh mục:**\n\n• **E-commerce App** dẫn đầu với ROI **150%** — doanh thu 1.2B, chi phí 480M.\n• **AI Support Platform** có ROI 136%, tăng trưởng đều đặn.\n• **Internal ERP** đang ROI âm (-36%) — đây là dự án đầu tư nội bộ dài hạn.\n\n🎯 Khuyến nghị CEO: Ưu tiên mở rộng E-commerce App và xem xét lại ERP timeline.',
    },
    {
        keywords: ['doanh thu', 'revenue', 'tài chính', 'tiền', 'chi phí'],
        perspective: 'Tài chính',
        response: '📊 **Tổng quan Tài chính (Tháng 7):**\n\n• Doanh thu: **3.2B VND** (+15% vs tháng trước)\n• Chi phí vận hành: **1.4B VND** (+8%)\n• Biên lợi nhuận: **56%**\n• Cash Runway: **8.5 tháng** với tốc độ đốt vốn hiện tại\n\n🚨 Cảnh báo: Logistics Pro đang ROI 50% — thấp hơn benchmark 100% đề ra.',
    },
    {
        keywords: ['khách hàng', 'rủi ro', 'at risk', 'customer', 'churn'],
        perspective: 'Khách hàng',
        response: '👥 **Phân tích rủi ro Khách hàng:**\n\n🔴 **Global Retail Inc** — Có rủi ro cao\n• NPS giảm từ 8 → 6 trong 2 tháng\n• Dự án trễ 5 ngày, communication giảm 32%\n\n🟡 **Logistics Pro** — Cảnh báo\n• NPS: 7/10, trễ 3 ngày\n• Tần suất tương tác giảm 28%\n\n✅ **Hành động khuyến nghị:** Đặt lịch CEO Review với Global Retail Inc trong tuần này.',
    },
    {
        keywords: ['nps', 'hài lòng', 'satisfaction', 'đúng hạn', 'delivery'],
        perspective: 'Khách hàng',
        response: '⭐ **Chỉ số hài lòng Khách hàng:**\n\n• NPS trung bình: **7.8/10**\n• Tỷ lệ giao hàng đúng hạn: **60%** (Mục tiêu: 90%)\n• Khách hàng khỏe mạnh: **3/5** (60%)\n\n💡 Top khách hàng: EcoPower Ltd — NPS 9/10, điểm sức khỏe 95, tiềm năng upsell cao.',
    },
    {
        keywords: ['quy trình', 'bottleneck', 'nghẽn', 'chậm', 'process', 'onboarding'],
        perspective: 'Quy trình',
        response: '⚙️ **Phân tích Quy trình Vận hành:**\n\n🔴 **Nghẽn cổ chai phát hiện:**\n• **Onboarding KH** — 12 ngày (Benchmark: 5 ngày, vượt 140%)\n• **Chuyển đổi Sales** — 40 ngày (Benchmark: 30 ngày, vượt 33%)\n• **Triển khai DevOps** — 8 ngày (Benchmark: 3 ngày, vượt 167%)\n\n📉 Onboarding chậm gây trễ dòng tiền trung bình **~18 ngày** mỗi hợp đồng mới.',
    },
    {
        keywords: ['hiệu quả', 'efficiency', 'cycle time', 'chu kỳ'],
        perspective: 'Quy trình',
        response: '📈 **Hiệu quả Quy trình:**\n\n• Điểm hiệu quả tổng thể: **33%** (2/6 quy trình đạt chuẩn)\n• Thời gian chu kỳ TB: **14 ngày**\n• Cải thiện YoY: +4.2%\n\n✅ **Quy trình tốt:** Review Code (đúng benchmark), Sửa lỗi QA (=benchmark)\n🔧 **Cần cải thiện ngay:** DevOps Pipeline — đề xuất triển khai CI/CD tự động.',
    },
    {
        keywords: ['nhân sự', 'năng suất', 'productivity', 'nhân viên', 'team', 'performance'],
        perspective: 'Học hỏi',
        response: '🎓 **Phân tích Năng suất Nhân sự:**\n\n🏆 **Top Performer: Trần Minh C** (Mobile Team)\n• Năng suất: **4.5x** trung bình (Chỉ số: output/time)\n• 6 dự án hoàn thành, 0 kỹ năng thiếu\n\n📊 Năng suất TB toàn team: **2.5x**\n\n❗ **Team Backend** — Năng suất 1.68x (thấp nhất)\n• Lý do: Thiếu kỹ năng DevOps & CI-CD\n• Đề xuất: Đăng ký Kubernetes training ngay (8 nhân viên)',
    },
    {
        keywords: ['kỹ năng', 'skill', 'đào tạo', 'training', 'gap', 'thiếu'],
        perspective: 'Học hỏi',
        response: '📚 **Phân tích Kỹ năng & Đào tạo:**\n\n🔴 **Khoảng trống chiến lược:**\n• DevOps/CI-CD — 2 nhân viên Backend bị ảnh hưởng\n• Cloud Security — cần cho dự án Fintech\n• AI Engineering — cần 4 senior roles cho Q4 roadmap\n\n📈 **Chương trình đang chạy:**\n• AI Engineering Fundamentals: 15 học viên (30%)\n• Advanced React Patterns: 12 học viên (75%)\n• DevOps & Kubernetes: 8 học viên (45%)',
    },
    {
        keywords: ['chiến lược', 'strategy', 'bsc', 'balanced scorecard', 'tổng quan'],
        perspective: 'BSC',
        response: '🗺️ **Tổng quan BSC Chiến lược (Tháng 3/2026):**\n\n**Tài chính:** ✅ Tốt — ROI 143%, doanh thu tăng 15%\n**Khách hàng:** ⚠️ Cảnh báo — 2/5 KH có rủi ro, đúng hạn 60%\n**Quy trình:** 🔴 Yếu — 3/6 quy trình vượt benchmark\n**Học hỏi:** ⚠️ Cảnh báo — Thiếu 3 nhóm kỹ năng chiến lược\n\n🎯 **Ưu tiên hành động tháng này:**\n1. Gặp CEO Review với Global Retail Inc\n2. Tối ưu pipeline DevOps\n3. Tuyển dụng AI Engineers',
    },
];

const INITIAL_MESSAGES: Message[] = [
    {
        id: 1,
        type: 'bot',
        text: 'Chào CEO! 👋 Tôi là **BSC Strategic Advisor** — đã phân tích toàn bộ dữ liệu doanh nghiệp qua 4 góc nhìn BSC.\n\nBạn muốn tôi phân tích gì hôm nay?',
        chips: [
            'Dự án nào có ROI cao nhất?',
            'Khách hàng nào đang có rủi ro?',
            'Quy trình nào đang là nghẽn cổ chai?',
            'Nhân viên nào năng suất vượt trội?',
            'Tổng quan BSC toàn công ty'
        ]
    }
];

const PERSPECTIVES_META = [
    { icon: Wallet, label: 'Tài chính', color: '#2563EB' },
    { icon: Users2, label: 'Khách hàng', color: '#3AE7E1' },
    { icon: Settings2, label: 'Quy trình', color: '#7C3AED' },
    { icon: GraduationCap, label: 'Học hỏi', color: '#F97316' },
];

export default function BSCChatbot() {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, isTyping]);

    const getBotResponse = (text: string): { response: string; perspective: string } => {
        const lower = text.toLowerCase();
        for (const item of BSC_RESPONSES) {
            if (item.keywords.some(kw => lower.includes(kw))) {
                return { response: item.response, perspective: item.perspective };
            }
        }
        return {
            response: '🤔 Câu hỏi thú vị! Tôi cần thêm thông tin cụ thể để phân tích.\n\nBạn đang muốn tìm hiểu về:\n• **Tài chính** — ROI, doanh thu, chi phí\n• **Khách hàng** — Rủi ro, NPS, đúng hạn\n• **Quy trình** — Nghẽn cổ chai, hiệu quả\n• **Nhân sự** — Năng suất, kỹ năng, đào tạo',
            perspective: 'BSC',
        };
    };

    const handleSend = (text: string) => {
        if (!text.trim() || isTyping) return;

        const userMsg: Message = { id: Date.now(), type: 'user', text };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        setTimeout(() => {
            const { response, perspective } = getBotResponse(text);
            const botMsg: Message = {
                id: Date.now() + 1,
                type: 'bot',
                text: response,
                perspective,
                chips: ['Phân tích thêm', 'Khuyến nghị hành động', 'Xem báo cáo đầy đủ']
            };
            setIsTyping(false);
            setMessages(prev => [...prev, botMsg]);
        }, 1200 + Math.random() * 600);
    };

    const handleReset = () => {
        setMessages(INITIAL_MESSAGES);
        setInputValue('');
        setIsTyping(false);
    };

    // Simple markdown-like rendering
    const renderText = (text: string) => {
        return text.split('\n').map((line, i) => {
            const boldLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            return (
                <span key={i}>
                    <span dangerouslySetInnerHTML={{ __html: boldLine }} />
                    {i < text.split('\n').length - 1 && <br />}
                </span>
            );
        });
    };

    const PERSPECTIVE_COLOR: Record<string, string> = {
        'Tài chính': '#2563EB',
        'Khách hàng': '#3AE7E1',
        'Quy trình': '#7C3AED',
        'Học hỏi': '#F97316',
        'BSC': '#10B981',
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-10rem)] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-500">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-[#0B1C2D] to-[#1E3A5F] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#3AE7E1]/20 rounded-lg border border-[#3AE7E1]/30">
                        <Bot className="w-5 h-5 text-[#3AE7E1]" />
                    </div>
                    <div>
                        <div className="font-bold text-white text-sm flex items-center gap-2">
                            BSC Strategic Advisor
                            <span className="flex h-1.5 w-1.5 rounded-full bg-[#3AE7E1] animate-pulse" />
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">AI Phân tích Balanced Scorecard</div>
                    </div>
                </div>
                <button
                    onClick={handleReset}
                    className="p-2 text-slate-400 hover:text-[#3AE7E1] transition-colors"
                    title="Bắt đầu lại"
                >
                    <RotateCcw className="w-4 h-4" />
                </button>
            </div>

            {/* BSC Pillars */}
            <div className="flex border-b border-slate-100 bg-slate-50">
                {PERSPECTIVES_META.map(({ icon: Icon, label, color }) => (
                    <button
                        key={label}
                        onClick={() => handleSend(`Phân tích góc độ ${label.toLowerCase()} của công ty`)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-bold text-slate-500 hover:text-white hover:bg-[#0B1C2D] transition-all group"
                    >
                        <Icon className="w-3.5 h-3.5" style={{ color }} />
                        <span className="group-hover:text-white">{label}</span>
                    </button>
                ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/30">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.type === 'user' ? 'bg-[#3AE7E1] text-[#0B1C2D]' : 'bg-[#0B1C2D] text-white'}`}>
                                {msg.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div className="space-y-3 flex-1">
                                {msg.perspective && msg.type === 'bot' && (
                                    <span
                                        className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block"
                                        style={{
                                            backgroundColor: (PERSPECTIVE_COLOR[msg.perspective] || '#3AE7E1') + '20',
                                            color: PERSPECTIVE_COLOR[msg.perspective] || '#3AE7E1'
                                        }}
                                    >
                                        {msg.perspective}
                                    </span>
                                )}
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.type === 'user'
                                    ? 'bg-[#0B1C2D] text-white rounded-tr-none shadow-md'
                                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm'
                                }`}>
                                    {renderText(msg.text)}
                                </div>
                                {msg.chips && (
                                    <div className="flex flex-wrap gap-2">
                                        {msg.chips.map((chip, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSend(chip)}
                                                className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 hover:border-[#3AE7E1] hover:text-[#3AE7E1] transition-all shadow-sm"
                                            >
                                                {chip}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#0B1C2D] flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm">
                                <div className="flex gap-1 items-center">
                                    {[0, 1, 2].map(i => (
                                        <span
                                            key={i}
                                            className="w-2 h-2 rounded-full bg-[#3AE7E1] animate-bounce"
                                            style={{ animationDelay: `${i * 0.15}s` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-100 bg-white">
                <form
                    onSubmit={e => { e.preventDefault(); handleSend(inputValue); }}
                    className="relative"
                >
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            disabled={isTyping}
                            placeholder="Hỏi AI về tài chính, khách hàng, quy trình hoặc nhân sự..."
                            className="flex-1 pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#3AE7E1] focus:border-transparent outline-none transition-all text-sm disabled:opacity-60"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            className="p-3 bg-[#0B1C2D] text-[#3AE7E1] rounded-xl disabled:opacity-30 hover:bg-[#1E3A5F] transition-all shadow-sm disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
                <div className="mt-2 flex items-center gap-1 px-1">
                    <Sparkles className="w-3 h-3 text-slate-300" />
                    <span className="text-[10px] text-slate-400">Được hỗ trợ bởi BSC Intelligence Engine — phân tích 4 góc nhìn chiến lược</span>
                </div>
            </div>
        </div>
    );
}
