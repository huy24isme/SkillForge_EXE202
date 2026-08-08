import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  UserPlus, 
  ArrowRightLeft, 
  Calendar,
  Sparkles
} from 'lucide-react';

const REQUESTS = [
  {
    id: 1,
    type: 'resource_add',
    title: 'Bổ sung 2 Backend Developer',
    project: 'E-commerce Platform Migration',
    requester: 'Trần Hùng (PM)',
    reason: 'Phát sinh module thanh toán phức tạp hơn dự kiến.',
    aiImpact: {
      sentiment: 'positive',
      analysis: 'Việc bổ sung này sẽ giúp dự án kịp deadline 30/03. Quỹ lương dự án tăng 5%, vẫn trong hạn mức cho phép. Có 2 nhân sự Backend từ team Internal Tool vừa rảnh việc.',
      score: 85 // 0-100 approval score
    },
    urgent: true
  },
  {
    id: 2,
    type: 'deadline_extend',
    title: 'Gia hạn Deadline 2 tuần',
    project: 'Mobile App Loyalty',
    requester: 'Lê Lan (PM)',
    reason: 'Khách hàng thay đổi yêu cầu flow đăng ký.',
    aiImpact: {
      sentiment: 'negative',
      analysis: 'Gia hạn sẽ làm chậm kế hoạch Marketing ra mắt vào tháng 5. Tác động dây chuyền đến 2 dự án khác đang chờ Mobile Team.',
      score: 30
    },
    urgent: false
  },
  {
    id: 3,
    type: 'resource_move',
    title: 'Điều chuyển Designer sang Marketing',
    project: 'Rebranding Campaign',
    requester: 'Nguyễn Văn A (CMO)',
    reason: 'Cần người support gấp ấn phẩm sự kiện.',
    aiImpact: {
      sentiment: 'neutral',
      analysis: 'Không ảnh hưởng lớn đến team Design nhưng sẽ làm chậm tiến độ UI/UX của dự án Website nếu không có người thay thế trong 3 ngày tới.',
      score: 55
    },
    urgent: true
  }
];

export function ExecutiveApprovals() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h2 className="text-2xl font-bold text-[#0B1C2D]">Phê duyệt yêu cầu</h2>
           <p className="text-slate-500">3 yêu cầu đang chờ xử lý</p>
        </div>
      </div>

      {REQUESTS.map((req) => (
        <div key={req.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4">
                <div className={`p-3 rounded-lg ${
                  req.type === 'resource_add' ? 'bg-blue-50 text-blue-600' :
                  req.type === 'deadline_extend' ? 'bg-orange-50 text-orange-600' :
                  'bg-purple-50 text-purple-600'
                }`}>
                  {req.type === 'resource_add' && <UserPlus className="w-6 h-6" />}
                  {req.type === 'deadline_extend' && <Clock className="w-6 h-6" />}
                  {req.type === 'resource_move' && <ArrowRightLeft className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0B1C2D] mb-1">{req.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="font-medium text-[#0B1C2D]">{req.project}</span>
                    <span>•</span>
                    <span>Từ: {req.requester}</span>
                  </div>
                </div>
              </div>
              {req.urgent && (
                <div className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold uppercase border border-red-100">
                  <AlertTriangle className="w-3 h-3" />
                  Urgent
                </div>
              )}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              {/* Reason */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Lý do</h4>
                <p className="text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm">
                  "{req.reason}"
                </p>
              </div>

              {/* AI Analysis */}
              <div className="relative">
                <div className="absolute -top-3 left-2 px-2 bg-white text-xs font-bold text-[#3AE7E1] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI Phân tích tác động
                </div>
                <div className={`p-4 rounded-lg border ${
                  req.aiImpact.sentiment === 'positive' ? 'bg-green-50 border-green-100' :
                  req.aiImpact.sentiment === 'negative' ? 'bg-red-50 border-red-100' :
                  'bg-slate-50 border-slate-200'
                }`}>
                  <p className={`text-sm mb-3 ${
                    req.aiImpact.sentiment === 'positive' ? 'text-green-800' :
                    req.aiImpact.sentiment === 'negative' ? 'text-red-800' :
                    'text-slate-700'
                  }`}>
                    {req.aiImpact.analysis}
                  </p>
                  
                  {/* Score Bar */}
                  <div className="flex items-center gap-3">
                    <div className="text-xs font-bold opacity-70">Approval Score:</div>
                    <div className="flex-1 h-2 bg-white/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          req.aiImpact.score >= 80 ? 'bg-green-500' :
                          req.aiImpact.score < 50 ? 'bg-red-500' : 'bg-orange-500'
                        }`} 
                        style={{ width: `${req.aiImpact.score}%` }} 
                      />
                    </div>
                    <div className="text-xs font-bold">{req.aiImpact.score}/100</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Từ chối
              </button>
              <button className="px-6 py-2.5 rounded-lg bg-[#0B1C2D] text-white font-medium hover:bg-[#1E3A5F] transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl">
                <CheckCircle className="w-5 h-5 text-[#3AE7E1]" />
                Phê duyệt
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
