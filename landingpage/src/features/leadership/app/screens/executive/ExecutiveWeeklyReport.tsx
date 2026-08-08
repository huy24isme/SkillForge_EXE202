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
  AlertTriangle
} from 'lucide-react';

const PROJECTS_DATA = [
  {
    id: 1,
    name: 'CRM Sales System',
    week: '24/02 - 01/03',
    status: 'good',
    progress: [
      'Hoàn thành module quản lý Lead (100%)',
      'Tích hợp API tổng đài VOIP thành công',
      'Dashboard báo cáo realtime đã deploy staging',
      'Code review và fix 12 bugs',
      'Chưa hoàn thành: Module báo cáo tuần (đang 80%)'
    ],
    members: [
      { name: 'Nguyễn Văn A', contribution: 'Lead implementation cho VOIP integration, mentor junior dev', reports: '5/5', status: 'good' },
      { name: 'Trần Thị B', contribution: 'Xây dựng dashboard UI/UX, responsive design', reports: '5/5', status: 'good' },
      { name: 'Lê Văn C', contribution: 'Backend API cho reporting module, database optimization', reports: '3/5', status: 'warning' },
      { name: 'Phạm Thị D', contribution: 'Testing và QA cho tất cả modules, viết test cases', reports: '5/5', status: 'good' },
    ],
    evaluation: {
      projectStatus: 'good',
      projectReason: 'Tiến độ đúng kế hoạch, team work hiệu quả, chất lượng code tốt',
      goodMembers: ['Nguyễn Văn A', 'Trần Thị B', 'Phạm Thị D'],
      overloadedMembers: [],
      slowReportMembers: ['Lê Văn C'],
      recommendations: [
        'Lê Văn C cần được nhắc nhở về việc báo cáo đều đặn',
        'Cân nhắc thưởng đột xuất cho team do hoàn thành sớm 2 tuần',
        'Chuẩn bị tài nguyên cho module tiếp theo (Payment Gateway)'
      ]
    }
  },
  {
    id: 2,
    name: 'Mobile App Loyalty',
    week: '24/02 - 01/03',
    status: 'warning',
    progress: [
      'UI hoàn thành 90% các màn hình chính',
      'Backend API cho loyalty points hoàn thành',
      'Chưa hoàn thành: Push notification service (delay 3 ngày)',
      'Chưa hoàn thành: QR code scanner (thiếu device test)',
      'Bug critical: App crash trên Android 12 (đang fix)'
    ],
    members: [
      { name: 'Hoàng Văn E', contribution: 'Full-stack development, giải quyết crash bug', reports: '5/5', status: 'overload' },
      { name: 'Vũ Thị F', contribution: 'UI development, animation effects', reports: '4/5', status: 'good' },
      { name: 'Đỗ Văn G', contribution: 'Backend API, database design', reports: '5/5', status: 'good' },
    ],
    evaluation: {
      projectStatus: 'warning',
      projectReason: 'Có delay nhẹ do bug critical không dự kiến. Thiếu device test cho QR scanner.',
      goodMembers: ['Hoàng Văn E', 'Đỗ Văn G'],
      overloadedMembers: ['Hoàng Văn E'],
      slowReportMembers: [],
      recommendations: [
        'Cấp thêm 1 Android device cho testing QR scanner',
        'Hoàng Văn E đang overload (140%), cân nhắc hỗ trợ thêm dev',
        'Họp sync với team Design về animation performance issues'
      ]
    }
  },
  {
    id: 3,
    name: 'Internal HR Tool',
    week: '24/02 - 01/03',
    status: 'risk',
    progress: [
      'Hoàn thành 40% so với kế hoạch (dự kiến 70%)',
      'Module Employee Management còn nhiều bug',
      'Tích hợp SSO gặp vấn đề về security',
      'PM đang nghỉ ốm 2 ngày, ảnh hưởng coordination',
      'Thiếu 1 backend dev do resign đột ngột'
    ],
    members: [
      { name: 'Bùi Thị H', contribution: 'Frontend development, gặp blockers về API', reports: '4/5', status: 'good' },
      { name: 'Ngô Văn I', contribution: 'Backend API nhưng chưa hoàn thành theo deadline', reports: '2/5', status: 'warning' },
    ],
    evaluation: {
      projectStatus: 'risk',
      projectReason: 'Thiếu nhân lực backend, PM nghỉ ốm, tiến độ chậm 30% so với kế hoạch',
      goodMembers: ['Bùi Thị H'],
      overloadedMembers: [],
      slowReportMembers: ['Ngô Văn I'],
      recommendations: [
        'KHẨN CẤP: Bổ sung 1 backend dev từ team khác hoặc hire gấp',
        'Ngô Văn I cần 1-on-1 meeting để hiểu rõ vấn đề',
        'Xem xét điều chỉnh timeline hoặc giảm scope',
        'Assign backup PM trong thời gian PM nghỉ ốm'
      ]
    }
  }
];

export function ExecutiveWeeklyReport() {
  const [selectedProject, setSelectedProject] = useState(PROJECTS_DATA[0]);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1C2D] mb-2">Báo cáo Tuần</h1>
          <p className="text-slate-500">Tổng hợp tiến độ và đánh giá dự án theo tuần</p>
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
          <div className="text-sm text-slate-500">dự án đúng tiến độ</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-orange-600 text-sm font-semibold">Cần theo dõi</span>
          </div>
          <div className="text-3xl font-bold text-[#0B1C2D] mb-1">1</div>
          <div className="text-sm text-slate-500">dự án có delay nhẹ</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-red-600 text-sm font-semibold">Rủi ro</span>
          </div>
          <div className="text-3xl font-bold text-[#0B1C2D] mb-1">1</div>
          <div className="text-sm text-slate-500">dự án cần can thiệp</div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {PROJECTS_DATA.map((project) => {
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
                          <Calendar className="w-4 h-4" />
                          Tuần: {project.week}
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
                        Tóm tắt tiến độ (tuần)
                      </h4>
                      <ul className="space-y-2">
                        {project.progress.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                            <span className="text-[#3AE7E1] mt-1">•</span>
                            <span className={item.includes('Chưa hoàn thành') || item.includes('Bug') ? 'text-orange-600 font-medium' : ''}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Thành viên */}
                    <div>
                      <h4 className="font-bold text-[#0B1C2D] mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#3AE7E1]" />
                        Thành viên (tuần)
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {project.members.map((member, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 hover:border-[#3AE7E1] transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <span className="font-semibold text-[#0B1C2D]">{member.name}</span>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-semibold border ${getMemberStatusColor(member.status)}`}>
                                  {member.status === 'good' && '✓ Tốt'}
                                  {member.status === 'overload' && '⚠ Quá tải'}
                                  {member.status === 'warning' && '! Chú ý'}
                                </span>
                                <span className="text-xs text-slate-500">Báo cáo: {member.reports}</span>
                              </div>
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
