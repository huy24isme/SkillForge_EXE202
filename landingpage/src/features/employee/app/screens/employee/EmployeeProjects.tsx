import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, Users, TrendingUp, AlertCircle, CheckCircle, Info } from 'lucide-react';

type ProjectLifecycle = 'active' | 'completed';

const projects = [
  {
    id: 1,
    name: 'E-Commerce Platform v2.0',
    role: 'Frontend Lead',
    status: 'healthy' as const,
    progress: 65,
    deadline: '2026-03-15',
    team: 5,
    priority: 'High',
    tasks: { completed: 12, total: 18 },
    description: 'Building next-generation e-commerce platform with modern tech stack',
    lifecycle: 'active' as ProjectLifecycle,
  },
  {
    id: 2,
    name: 'Mobile Banking App',
    role: 'Senior Frontend Developer',
    status: 'at-risk' as const,
    progress: 45,
    deadline: '2026-02-20',
    team: 4,
    priority: 'Critical',
    tasks: { completed: 8, total: 20 },
    description: 'Secure mobile banking application for iOS and Android',
    lifecycle: 'active' as ProjectLifecycle,
  },
  {
    id: 3,
    name: 'Analytics Dashboard',
    role: 'Frontend Developer',
    status: 'healthy' as const,
    progress: 100,
    deadline: '2026-02-10',
    team: 3,
    priority: 'Medium',
    tasks: { completed: 17, total: 17 },
    description: 'Real-time analytics dashboard for business intelligence',
    lifecycle: 'completed' as ProjectLifecycle,
  },
];

export function EmployeeProjects() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [view, setView] = useState<'list' | 'detail'>('list');

  const currentTab = useMemo<'all' | 'active' | 'completed'>(() => {
    if (location.pathname.endsWith('/active')) {
      return 'active';
    }
    if (location.pathname.endsWith('/completed')) {
      return 'completed';
    }
    return 'all';
  }, [location.pathname]);

  const filteredProjects = useMemo(() => {
    if (currentTab === 'all') {
      return projects;
    }
    return projects.filter((project) => project.lifecycle === currentTab);
  }, [currentTab]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'healthy':
        return { bg: 'bg-[#2ECC71]/10', text: 'text-[#2ECC71]', dot: 'bg-[#2ECC71]', label: 'Ổn định', icon: CheckCircle };
      case 'at-risk':
        return { bg: 'bg-[#F5A623]/10', text: 'text-[#F5A623]', dot: 'bg-[#F5A623]', label: 'Có rủi ro', icon: AlertCircle };
      case 'critical':
        return { bg: 'bg-[#E74C3C]/10', text: 'text-[#E74C3C]', dot: 'bg-[#E74C3C]', label: 'Nghiêm trọng', icon: AlertCircle };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400', label: 'Không xác định', icon: Info };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'text-[#E74C3C] border-[#E74C3C]';
      case 'High':
        return 'text-[#F5A623] border-[#F5A623]';
      case 'Medium':
        return 'text-[#3AE7E1] border-[#3AE7E1]';
      default:
        return 'text-gray-500 border-gray-300';
    }
  };

  if (view === 'detail') {
    const statusConfig = getStatusConfig(selectedProject.status);
    const StatusIcon = statusConfig.icon;

    return (
      <div className="space-y-6">
        <button
          onClick={() => setView('list')}
          className="text-[#3AE7E1] hover:text-[#3AE7E1]/80 flex items-center gap-2"
        >
          ← Quay lại dự án
        </button>

        {/* Project Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">{selectedProject.name}</h2>
              <p className="text-gray-600 mb-3">{selectedProject.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-gray-600">
                  <Users className="w-4 h-4" />
                  {selectedProject.team} thành viên
                </span>
                <span className="flex items-center gap-1 text-gray-600">
                  <Clock className="w-4 h-4" />
                  Hạn: {new Date(selectedProject.deadline).toLocaleDateString()}
                </span>
                <span className={`px-2 py-1 border rounded ${getPriorityColor(selectedProject.priority)}`}>
                  {selectedProject.priority} ưu tiên
                </span>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-lg ${statusConfig.bg} ${statusConfig.text} flex items-center gap-2`}>
              <StatusIcon className="w-4 h-4" />
              {statusConfig.label}
            </span>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Tiến độ tổng thể</span>
              <span className="font-semibold text-gray-900">{selectedProject.progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all ${
                  selectedProject.status === 'healthy' ? 'bg-gradient-to-r from-[#3AE7E1] to-[#2ECC71]' :
                  selectedProject.status === 'at-risk' ? 'bg-[#F5A623]' :
                  'bg-[#E74C3C]'
                }`}
                style={{ width: `${selectedProject.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-[#3AE7E1]/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#3AE7E1]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Vai trò của bạn</p>
                <p className="font-semibold text-gray-900">{selectedProject.role}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-[#2ECC71]/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#2ECC71]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Nhiệm vụ đã hoàn thành</p>
                <p className="font-semibold text-gray-900">{selectedProject.tasks.completed} / {selectedProject.tasks.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-[#F5A623]/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#F5A623]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Thời gian còn lại</p>
                <p className="font-semibold text-gray-900">
                  {selectedProject.lifecycle === 'completed'
                    ? 'Đã hoàn thành'
                    : `${Math.ceil((new Date(selectedProject.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} ngày`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Task Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nhiệm vụ gần đây của bạn</h3>
          <div className="space-y-3">
            {[
              { task: 'Triển khai luồng xác thực người dùng', status: 'completed', date: '2026-01-30' },
              { task: 'Tích hợp design system', status: 'completed', date: '2026-01-29' },
              { task: 'Thiết lập cổng thanh toán', status: 'in-progress', date: '2026-01-31' },
              { task: 'Tối ưu hiển thị di động', status: 'pending', date: '-' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  item.status === 'completed' ? 'bg-[#2ECC71]/10' :
                  item.status === 'in-progress' ? 'bg-[#3AE7E1]/10' :
                  'bg-gray-100'
                }`}>
                  {item.status === 'completed' && <CheckCircle className="w-4 h-4 text-[#2ECC71]" />}
                  {item.status === 'in-progress' && <div className="w-3 h-3 rounded-full bg-[#3AE7E1] animate-pulse" />}
                  {item.status === 'pending' && <div className="w-3 h-3 rounded-full border-2 border-gray-300" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.task}</p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  item.status === 'completed' ? 'bg-[#2ECC71]/10 text-[#2ECC71]' :
                  item.status === 'in-progress' ? 'bg-[#3AE7E1]/10 text-[#3AE7E1]' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {item.status === 'completed' ? 'Xong' : item.status === 'in-progress' ? 'Đang thực hiện' : 'Cần làm'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Dự án của tôi</h2>
          <p className="text-sm text-gray-600">Hiển thị {filteredProjects.length} dự án trong mục {currentTab === 'all' ? 'Tất cả' : currentTab === 'active' ? 'Đang hoạt động' : 'Hoàn thành'}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/employee/employee/projects')}
            className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
              currentTab === 'all'
                ? 'bg-[#3AE7E1] text-white border-[#3AE7E1]'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => navigate('/employee/employee/projects/active')}
            className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
              currentTab === 'active'
                ? 'bg-[#3AE7E1] text-white border-[#3AE7E1]'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Đang hoạt động
          </button>
          <button
            onClick={() => navigate('/employee/employee/projects/completed')}
            className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
              currentTab === 'completed'
                ? 'bg-[#3AE7E1] text-white border-[#3AE7E1]'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Hoàn thành
          </button>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          Chưa có dự án trong mục này.
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const statusConfig = getStatusConfig(project.status);

          return (
            <div 
              key={project.id}
              onClick={() => {
                setSelectedProject(project);
                setView('detail');
              }}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-[#3AE7E1] transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{project.role}</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusConfig.bg} ${statusConfig.text} flex items-center gap-1`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                      {statusConfig.label}
                    </span>
                    <span className={`px-2 py-1 border rounded text-xs ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Tiến độ</span>
                    <span className="font-medium text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        project.status === 'healthy' ? 'bg-gradient-to-r from-[#3AE7E1] to-[#2ECC71]' :
                        project.status === 'at-risk' ? 'bg-[#F5A623]' :
                        'bg-[#E74C3C]'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {project.team} thành viên
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {project.lifecycle === 'completed'
                      ? 'Đã hoàn thành'
                      : `Hạn ${new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                  <span>Nhiệm vụ: {project.tasks.completed}/{project.tasks.total}</span>
                  <span className="text-[#3AE7E1] hover:underline">Xem chi tiết →</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
