import { useState } from 'react';
import { 
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Users,
  Target,
  ChevronDown,
  ChevronUp,
  Filter,
  Download,
  Sparkles,
  Clock,
  Award,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const DAILY_PROJECTS_DATA = [
  {
    id: 1,
    name: 'CRM Sales System',
    date: '06/03/2026',
    status: 'good',
    progress: [
      'Hoàn thành API endpoint cho Lead filtering',
      'Deploy staging server thành công',
      'Code review 3 PRs và merge',
      'Fix 2 bugs UI trên dashboard',
      'Chưa hoàn thành: Unit test cho module báo cáo (sẽ làm ngày mai)'
    ],
    members: [
      { name: 'Nguyễn Văn A', contribution: 'Lead implementation cho filtering API, review và merge PRs' },
      { name: 'Trần Thị B', contribution: 'Fix responsive issues trên dashboard, optimize loading time' },
      { name: 'Lê Văn C', contribution: 'Viết documentation cho API endpoints mới' },
      { name: 'Phạm Thị D', contribution: 'Testing và QA cho tất cả thay đổi hôm nay' },
    ],
    evaluation: {
      projectStatus: 'good',
      projectReason: 'Hoàn thành tốt các task trong ngày, không có blocker nghiêm trọng',
      goodMembers: ['Nguyễn Văn A', 'Trần Thị B', 'Phạm Thị D'],
      overloadedMembers: [],
      slowReportMembers: [],
      recommendations: [
        'Tiếp tục maintain tốc độ như hiện tại',
        'Chuẩn bị cho sprint review vào thứ 6',
      ]
    }
  },
  {
    id: 2,
    name: 'Mobile App Loyalty',
    date: '06/03/2026',
    status: 'warning',
    progress: [
      'Hoàn thành chỉnh sửa UI cho màn hình rewards',
      'Fix được 50% bug crash trên Android 12',
      'Chưa hoàn thành: Push notification vẫn chưa test được (thiếu device)',
      'Delay: QR scanner cần thêm 1 ngày để hoàn thiện',
    ],
    members: [
      { name: 'Hoàng Văn E', contribution: 'Full focus vào việc fix crash bug, đã có progress tốt' },
      { name: 'Vũ Thị F', contribution: 'Hoàn thành UI rewards screen với animation mượt mà' },
      { name: 'Đỗ Văn G', contribution: 'Support debug crash issue, optimize database queries' },
    ],
    evaluation: {
      projectStatus: 'warning',
      projectReason: 'Vẫn còn bug critical chưa resolve hoàn toàn, thiếu device test',
      goodMembers: ['Vũ Thị F', 'Đỗ Văn G'],
      overloadedMembers: ['Hoàng Văn E'],
      slowReportMembers: [],
      recommendations: [
        'Ưu tiên mua Android device cho testing ngày mai',
        'Hoàng Văn E đang làm OT nhiều, cân nhắc giảm tải',
        'Set up meeting với team Android để troubleshoot crash issue'
      ]
    }
  },
  {
    id: 3,
    name: 'Internal HR Tool',
    date: '06/03/2026',
    status: 'risk',
    progress: [
      'Chỉ hoàn thành 20% công việc dự kiến trong ngày',
      'SSO integration vẫn fail test',
      'Module Employee Management có thêm 3 bugs mới',
      'Họp với Security team nhưng chưa có giải pháp',
      'PM vẫn nghỉ ốm, team thiếu direction'
    ],
    members: [
      { name: 'Bùi Thị H', contribution: 'Cố gắng debug SSO nhưng vẫn blockers từ backend' },
      { name: 'Ngô Văn I', contribution: 'Chưa code được nhiều do blockers, chưa submit báo cáo hôm nay' },
    ],
    evaluation: {
      projectStatus: 'risk',
      projectReason: 'Tiến độ rất chậm, nhiều blockers chưa giải quyết, thiếu nhân lực và leadership',
      goodMembers: ['Bùi Thị H'],
      overloadedMembers: [],
      slowReportMembers: ['Ngô Văn I'],
      recommendations: [
        'KHẨN CẤP: Assign acting PM ngay hôm nay',
        'Escalate SSO issue lên CTO để có expert support',
        'Meeting 1-on-1 với Ngô Văn I để understand blockers',
        'Xem xét tạm dừng project để review lại scope và resources'
      ]
    }
  }
];

export function ExecutiveDailyReport() {
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 2, 6)); // March 6, 2026
  const [expandedProject, setExpandedProject] = useState<number | null>(1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', icon: CheckCircle2 };
      case 'warning': return { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', icon: AlertCircle };
      case 'risk': return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', icon: AlertTriangle };
      default: return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', icon: AlertCircle };
    }
  };

  const getMemberStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'overload': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1C2D] mb-2">Báo cáo Ngày</h1>
          <p className="text-slate-500">Tổng hợp tiến độ và đánh giá dự án theo ngày</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
            <Filter className="w-4 h-4" />
            <span>Lọc dự án</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0B1C2D] text-white rounded-lg hover:bg-[#1E3A5F] transition-colors text-sm font-medium">
            <Download className="w-4 h-4" />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-gradient-to-r from-[#0B1C2D] to-[#1E3A5F] rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => changeDate(-1)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <div className="text-sm text-slate-300 mb-1">Ngày được chọn</div>
            <div className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[#3AE7E1]" />
              {formatDate(selectedDate)}
            </div>
          </div>
          <button 
            onClick={() => changeDate(1)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm font-semibold">Tốt</span>
          </div>
          <div className="text-3xl font-bold text-[#0B1C2D] mb-1">1</div>
          <div className="text-sm text-slate-500">dự án hoàn thành tốt</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-orange-600 text-sm font-semibold">Cần theo dõi</span>
          </div>
          <div className="text-3xl font-bold text-[#0B1C2D] mb-1">1</div>
          <div className="text-sm text-slate-500">dự án có vấn đề nhỏ</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-red-600 text-sm font-semibold">Rủi ro</span>
          </div>
          <div className="text-3xl font-bold text-[#0B1C2D] mb-1">1</div>
          <div className="text-sm text-slate-500">dự án cần can thiệp ngay</div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {DAILY_PROJECTS_DATA.map((project) => {
          const statusStyle = getStatusColor(project.status);
          const StatusIcon = statusStyle.icon;
          const isExpanded = expandedProject === project.id;

          return (
            <div key={project.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Project Header */}
              <div 
                onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${statusStyle.bg}`}>
                      <StatusIcon className={`w-6 h-6 ${statusStyle.text}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#0B1C2D] mb-1">{project.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Ngày: {project.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {project.members.length} thành viên
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                      {project.status === 'good' && 'Tốt'}
                      {project.status === 'warning' && 'Cần theo dõi'}
                      {project.status === 'risk' && 'Rủi ro'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/50">
                  <div className="p-6 space-y-6">
                    {/* Tóm tắt tiến độ */}
                    <div>
                      <h4 className="font-bold text-[#0B1C2D] mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-[#3AE7E1]" />
                        Tóm tắt tiến độ (ngày)
                      </h4>
                      <ul className="space-y-2">
                        {project.progress.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                            <span className="text-[#3AE7E1] mt-1">•</span>
                            <span className={item.includes('Chưa hoàn thành') || item.includes('Delay') || item.includes('Bug') ? 'text-orange-600 font-medium' : ''}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Thành viên */}
                    <div>
                      <h4 className="font-bold text-[#0B1C2D] mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#3AE7E1]" />
                        Thành viên (ngày)
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {project.members.map((member, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 hover:border-[#3AE7E1] transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <span className="font-semibold text-[#0B1C2D]">{member.name}</span>
                            </div>
                            <p className="text-sm text-slate-600">{member.contribution}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Đánh giá dự án */}
                    <div className="bg-gradient-to-r from-[#0B1C2D] to-[#1E3A5F] rounded-xl p-6 text-white">
                      <h4 className="font-bold mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#3AE7E1]" />
                        AI Đánh giá dự án
                      </h4>
                      <p className="text-sm text-slate-300 mb-4">
                        <span className="font-semibold text-white">Lý do: </span>
                        {project.evaluation.projectReason}
                      </p>

                      {/* Đánh giá thành viên */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        {project.evaluation.goodMembers.length > 0 && (
                          <div>
                            <div className="text-xs text-[#3AE7E1] font-semibold mb-2 flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              Làm tốt
                            </div>
                            <div className="text-sm">
                              {project.evaluation.goodMembers.join(', ')}
                            </div>
                          </div>
                        )}
                        {project.evaluation.overloadedMembers.length > 0 && (
                          <div>
                            <div className="text-xs text-orange-400 font-semibold mb-2 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Quá tải
                            </div>
                            <div className="text-sm text-orange-200">
                              {project.evaluation.overloadedMembers.join(', ')}
                            </div>
                          </div>
                        )}
                        {project.evaluation.slowReportMembers.length > 0 && (
                          <div>
                            <div className="text-xs text-red-400 font-semibold mb-2 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Chậm báo cáo
                            </div>
                            <div className="text-sm text-red-200">
                              {project.evaluation.slowReportMembers.join(', ')}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Khuyến nghị */}
                      <div>
                        <div className="text-xs text-[#3AE7E1] font-semibold mb-2">Khuyến nghị:</div>
                        <ul className="space-y-1.5">
                          {project.evaluation.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                              <span className="text-[#3AE7E1] mt-1">►</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
