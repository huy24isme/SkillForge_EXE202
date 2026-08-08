import { KPICard } from '@/features/pm/app/components/KPICard';
import { StatusBadge } from '@/features/pm/app/components/StatusBadge';
import { Link } from 'react-router-dom';
import { 
  FolderKanban, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Sparkles,
  Clock,
  Bot,
  CalendarDays,
  ListChecks
} from 'lucide-react';

const projects = [
  { id: 1, name: 'E-Commerce Platform v2.0', status: 'healthy' as const, progress: 75, team: 5, deadline: '2026-02-15' },
  { id: 2, name: 'Mobile Banking App', status: 'at-risk' as const, progress: 45, team: 4, deadline: '2026-02-01' },
  { id: 3, name: 'AI Analytics Dashboard', status: 'critical' as const, progress: 30, team: 6, deadline: '2026-01-28' },
  { id: 4, name: 'CRM System Upgrade', status: 'healthy' as const, progress: 90, team: 3, deadline: '2026-02-28' },
];

const currentUser = 'Nguyễn Văn A';

type MyProject = {
  id: number;
  name: string;
  status: 'healthy' | 'at-risk' | 'critical';
  members: number;
  progress: number;
  lastUpdated: string;
  assignedTo: string[];
  aiSummary: string;
  riskSuggestion: string;
  weekPriorities: string[];
};

const myProjects: MyProject[] = [
  {
    id: 1,
    name: 'E-Commerce Platform v2.0',
    status: 'healthy' as const,
    members: 5,
    progress: 75,
    lastUpdated: '2026-03-06',
    assignedTo: ['Nguyễn Văn A', 'Trần Thị B'],
    aiSummary:
      'Luồng thanh toán và tính năng xuất đơn đang ổn định. Các mốc chính của sprint đi đúng kế hoạch, chỉ còn một số việc review nhỏ.',
    riskSuggestion:
      'Rủi ro ngắn hạn thấp. Cần theo dõi phần kiểm tra luật giảm giá ở backend để tránh lỗi tích hợp giai đoạn cuối.',
    weekPriorities: [
      'Hoàn tất kiểm tra cấu hình giảm giá phía admin.',
      'Đóng các lỗi QA liên quan đến tình huống biên của mã giảm giá.',
      'Chuẩn bị checklist phát hành để PM phê duyệt.',
    ],
  },
  {
    id: 2,
    name: 'Mobile Banking App',
    status: 'at-risk' as const,
    members: 4,
    progress: 45,
    lastUpdated: '2026-03-06',
    assignedTo: ['Nguyễn Văn A', 'Lê Hồng Đức'],
    aiSummary:
      'Các bản vá bảo mật và cập nhật đăng nhập sinh trắc học đã hoàn thành, nhưng phần cài đặt thông báo và rà soát tuân thủ đang chậm kế hoạch.',
    riskSuggestion:
      'Tiến độ đang chậm. Có nguy cơ tràn sprint nếu phần tuân thủ và review UI không được chốt trong 48 giờ tới.',
    weekPriorities: [
      'Ưu tiên hoàn thành checklist tuân thủ cùng đội pháp chế.',
      'Xử lý toàn bộ góp ý review cho phần cài đặt thông báo.',
      'Ổn định các chỉ số giám sát luồng làm mới token.',
    ],
  },
  {
    id: 3,
    name: 'CRM System Upgrade',
    status: 'healthy' as const,
    members: 3,
    progress: 90,
    lastUpdated: '2026-03-05',
    assignedTo: ['Nguyễn Văn A'],
    aiSummary:
      'Các đầu việc migration schema và phân quyền truy cập gần hoàn tất. Phần còn lại tập trung vào hoàn thiện UX công cụ import và sẵn sàng phát hành.',
    riskSuggestion:
      'Rủi ro rất thấp. Tiếp tục theo dõi kiểm tra dữ liệu import để tránh lỗi sau phát hành.',
    weekPriorities: [
      'Hoàn tất mapping kiểm tra hợp lệ cho công cụ import.',
      'Chạy hồi quy cuối cùng trước khi bàn giao.',
    ],
  },
].filter((project) => project.assignedTo.includes(currentUser));

const activities = [
  { id: 1, user: 'Nguyễn Văn A', action: 'đã hoàn thành tác vụ "Tích hợp API"', project: 'E-Commerce Platform', time: '5 phút trước' },
  { id: 2, user: 'Lê Hồng Đức', action: 'đã báo vướng mắc ở "Di trú cơ sở dữ liệu"', project: 'Mobile Banking App', time: '23 phút trước' },
  { id: 3, user: 'Hệ thống AI', action: 'đề xuất cân bằng lại nhân sự nhóm', project: 'AI Analytics Dashboard', time: '1 giờ trước' },
  { id: 4, user: 'Trần Thị B', action: 'đã nộp báo cáo hằng ngày', project: 'CRM System Upgrade', time: '2 giờ trước' },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          title="Dự án đang hoạt động"
          value={12}
          change="+3 trong tháng này"
          icon={FolderKanban}
          trend="up"
          color="#3AE7E1"
        />
        <KPICard
          title="Mức sử dụng nhân sự"
          value="87%"
          change="+5% so với tuần trước"
          icon={Users}
          trend="up"
          color="#2ECC71"
        />
        <KPICard
          title="Dự án rủi ro"
          value={3}
          change="2 dự án cần chú ý"
          icon={AlertTriangle}
          trend="down"
          color="#F5A623"
        />
      </div>

      {/* Strategic insights panel */}
      <div className="bg-gradient-to-br from-[#3AE7E1]/10 to-[#0B1C2D]/5 rounded-xl p-6 border border-[#3AE7E1]/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#3AE7E1]/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-[#3AE7E1]" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Phân tích chiến lược</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-[#E74C3C] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">
                  <strong>2 dự án</strong> có nguy cơ trễ hạn. Cân nhắc điều phối lại nguồn lực cho "AI Analytics Dashboard" và "Mobile Banking App".
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Users className="w-5 h-5 text-[#F5A623] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">
                  <strong>1 đội đang quá tải.</strong> Đội backend đang vận hành ở mức 115% công suất. Khuyến nghị bổ sung nhân sự hoặc phân bổ lại tác vụ.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="w-5 h-5 text-[#2ECC71] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">
                  Tốc độ xử lý công việc của đội đã tăng <strong>23%</strong> sau khi chuẩn hóa quy trình vận hành theo BSC.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* My Projects */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Dự án của tôi</h3>
            <p className="text-sm text-gray-600">Các dự án được giao cho {currentUser}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {myProjects.map((project) => (
            <article key={project.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h4 className="font-semibold text-gray-900">{project.name}</h4>
                <StatusBadge status={project.status}>
                  {project.status === 'healthy' && 'Ổn định'}
                  {project.status === 'at-risk' && 'Có rủi ro'}
                  {project.status === 'critical' && 'Nghiêm trọng'}
                </StatusBadge>
              </div>

              <div className="space-y-2 text-sm text-gray-700 mb-4">
                <p className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-500" /> Số thành viên: {project.members}</p>
                <p className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-gray-500" /> Tiến độ hoàn thành: {project.progress}%</p>
                <p className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-gray-500" /> Cập nhật gần nhất: {new Date(project.lastUpdated).toLocaleDateString()}</p>
              </div>

              <div className="space-y-3 mb-4">
                <div className="bg-[#3AE7E1]/5 border border-[#3AE7E1]/20 rounded-lg p-3">
                  <p className="text-xs uppercase tracking-wide text-[#0B1C2D] font-medium mb-1 flex items-center gap-1">
                    <Bot className="w-3.5 h-3.5" /> Tóm tắt tiến độ bằng AI
                  </p>
                  <p className="text-sm text-gray-700">{project.aiSummary}</p>
                </div>

                <div className={`rounded-lg p-3 border ${project.progress < 50 ? 'bg-[#E74C3C]/5 border-[#E74C3C]/25' : 'bg-[#F5A623]/5 border-[#F5A623]/25'}`}>
                  <p className="text-xs uppercase tracking-wide text-gray-800 font-medium mb-1">Rủi ro tiềm ẩn</p>
                  <p className="text-sm text-gray-700">{project.riskSuggestion}</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-800 font-medium mb-2 flex items-center gap-1">
                    <ListChecks className="w-3.5 h-3.5" /> Ưu tiên tác vụ trong tuần
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {project.weekPriorities.map((priority) => (
                      <li key={priority}>{priority}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link
                to="/pm/project-details"
                className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-[#0B1C2D] text-white text-sm font-medium hover:bg-[#0B1C2D]/90 transition-colors"
              >
                Xem chi tiết
              </Link>
            </article>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trạng thái dự án List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Trạng thái dự án</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{project.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {project.team} thành viên
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Hạn {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={project.status}>
                      {project.status === 'healthy' && 'Ổn định'}
                      {project.status === 'at-risk' && 'Có rủi ro'}
                      {project.status === 'critical' && 'Nghiêm trọng'}
                    </StatusBadge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tiến độ</span>
                      <span className="font-medium text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all"
                        style={{ 
                          width: `${project.progress}%`,
                          backgroundColor: 
                            project.status === 'healthy' ? '#2ECC71' : 
                            project.status === 'at-risk' ? '#F5A623' : 
                            '#E74C3C'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#3AE7E1]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-[#3AE7E1]">
                      {activity.user.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span>{' '}
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.project} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
