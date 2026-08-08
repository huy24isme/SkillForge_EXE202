import { StatusBadge } from '@/features/employee/app/components/StatusBadge';
import { Users, Calendar, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';

const project = {
  name: 'E-Commerce Platform v2.0',
  status: 'at-risk' as const,
  progress: 50,
  deadline: '2026-03-15',
  team: [
    { id: 1, name: 'Nguyen Van A', role: 'Frontend Lead', level: 'Senior', avatar: 'NA' },
    { id: 2, name: 'Le Hong Duc', role: 'Backend Developer', level: 'Mid-level', avatar: 'LD' },
    { id: 3, name: 'Tran Thi B', role: 'UI/UX Designer', level: 'Senior', avatar: 'TB' },
    { id: 4, name: 'Pham Van C', role: 'QA Engineer', level: 'Junior', avatar: 'PC' },
  ],
  milestones: [
    { id: 1, name: 'Requirements Gathering', status: 'completed', date: '2026-01-15' },
    { id: 2, name: 'Design Phase', status: 'completed', date: '2026-02-01' },
    { id: 3, name: 'Development Sprint 1', status: 'in-progress', date: '2026-02-20' },
    { id: 4, name: 'Testing Phase', status: 'pending', date: '2026-03-05' },
    { id: 5, name: 'Launch', status: 'pending', date: '2026-03-15' },
  ],
};

export function ProjectOverview() {
  return (
    <div className="space-y-6">
      {/* Tiêu đề dự án */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{project.name}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Hạn: {new Date(project.deadline).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {project.team.length} thành viên
              </span>
            </div>
          </div>
          <StatusBadge status={project.status}>Có rủi ro</StatusBadge>
        </div>

        {/* Tiến độ Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Tiến độ tổng thể</span>
            <span className="font-medium text-gray-900">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-[#F5A623] transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Summary Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-[#3AE7E1]/10 to-[#0B1C2D]/5 rounded-xl p-6 border border-[#3AE7E1]/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#3AE7E1]/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-[#3AE7E1]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tóm tắt dự án bằng AI</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-5 h-5 text-[#2ECC71] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">
                      Dự án đã <strong>hoàn thành 50%</strong>, còn 6 tuần nữa
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-[#E74C3C] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">
                      <strong>Tác vụ backend bị chậm</strong> do vấn đề chuyển đổi cơ sở dữ liệu. Cân nhắc bổ sung nguồn lực.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Users className="w-5 h-5 text-[#F5A623] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">
                      Team velocity is <strong>15% below target</strong>. Recommended: Daily sync meetings.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mốc tiến độ */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mốc tiến độ</h3>
            <div className="space-y-4">
              {project.milestones.map((milestone, idx) => (
                <div key={milestone.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      milestone.status === 'completed' ? 'bg-[#2ECC71]/20' :
                      milestone.status === 'in-progress' ? 'bg-[#3AE7E1]/20' :
                      'bg-gray-100'
                    }`}>
                      {milestone.status === 'completed' && (
                        <div className="w-4 h-4 rounded-full bg-[#2ECC71]" />
                      )}
                      {milestone.status === 'in-progress' && (
                        <div className="w-4 h-4 rounded-full bg-[#3AE7E1] animate-pulse" />
                      )}
                      {milestone.status === 'pending' && (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    {idx < project.milestones.length - 1 && (
                      <div className={`w-0.5 h-12 mt-1 ${
                        milestone.status === 'completed' ? 'bg-[#2ECC71]' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <h4 className="font-medium text-gray-900">{milestone.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(milestone.date).toLocaleDateString()} • {
                        milestone.status === 'completed' ? 'Hoàn thành' :
                        milestone.status === 'in-progress' ? 'Đang thực hiện' :
                        'Chờ xử lý'
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Thành viên nhóm */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Thành viên nhóm</h3>
            <button className="text-sm text-[#3AE7E1] hover:text-[#3AE7E1]/80">
              Điều chỉnh đội
            </button>
          </div>
          <div className="space-y-4">
            {project.team.map((member) => (
              <div key={member.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#3AE7E1]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-[#3AE7E1]">{member.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{member.name}</h4>
                  <p className="text-sm text-gray-600">{member.role}</p>
                  <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded mt-1">
                    {member.level}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#3AE7E1] hover:text-[#3AE7E1] transition-colors">
            + Thêm thành viên
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="px-6 py-2.5 bg-[#3AE7E1] text-white rounded-lg hover:bg-[#3AE7E1]/90 transition-colors">
          Xem báo cáo
        </button>
        <button className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Xuất dữ liệu
        </button>
      </div>
    </div>
  );
}
