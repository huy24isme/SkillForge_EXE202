import { useState } from 'react';
import { 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  ChevronRight, 
  MoreHorizontal,
  Code,
  Megaphone,
  DollarSign,
  X,
  FileText
} from 'lucide-react';

const PROJECTS = [
  {
    id: 1,
    name: 'Rebranding Campaign 2026',
    progress: 45,
    risk: 'medium', // low, medium, high
    priority: 'high',
    teams: ['marketing', 'design'],
    deadline: '15/04/2026',
    description: 'Chiến dịch thay đổi nhận diện thương hiệu toàn cầu, bao gồm logo mới, website và ấn phẩm truyền thông.',
    aiSummary: 'Tiến độ chậm 3 ngày do chờ duyệt mockup từ Design. Team Marketing đã chuẩn bị xong content plan.',
    dailyReport: 'Design hoàn thành 3/5 key visual. Marketing chốt danh sách KOLs. Chưa có rủi ro lớn phát sinh hôm nay.',
    teamStructure: [
      { role: 'Marketing Lead', count: 1 },
      { role: 'Content Creator', count: 2 },
      { role: 'Art Director', count: 1 },
      { role: 'Designer', count: 3 },
    ]
  },
  {
    id: 2,
    name: 'E-commerce Platform Migration',
    progress: 78,
    risk: 'low',
    priority: 'critical',
    teams: ['it', 'design'],
    deadline: '30/03/2026',
    description: 'Chuyển đổi hệ thống bán hàng cũ sang nền tảng Microservices mới.',
    aiSummary: 'Tiến độ rất tốt, vượt kế hoạch 5%. Đã hoàn thành module thanh toán và đang test tích hợp.',
    dailyReport: 'Backend fix xong bug Payment Gateway. Frontend đang hoàn thiện UI Checkout. QA bắt đầu test UAT.',
    teamStructure: [
      { role: 'Tech Lead', count: 1 },
      { role: 'Backend Dev', count: 4 },
      { role: 'Frontend Dev', count: 3 },
      { role: 'QA/QC', count: 2 },
    ]
  },
  {
    id: 3,
    name: 'Q2 Sales Expansion',
    progress: 12,
    risk: 'high',
    priority: 'high',
    teams: ['sales', 'marketing'],
    deadline: '30/06/2026',
    description: 'Mở rộng thị trường sang khu vực Đông Nam Bộ.',
    aiSummary: 'Cảnh báo rủi ro cao do thiếu nhân sự Sales Lead khu vực. Cần tuyển dụng gấp.',
    dailyReport: 'Mới tuyển được 2 Sales member. Chưa tìm được Regional Manager. Lead chưa đủ pipeline khách hàng.',
    teamStructure: [
      { role: 'Sales Director', count: 1 },
      { role: 'Sales Manager', count: 2 },
      { role: 'Sales Executive', count: 10 },
    ]
  }
];

const TEAM_ICONS: Record<string, any> = {
  it: Code,
  marketing: Megaphone,
  sales: DollarSign,
  design: Code // Reuse Code for now or use another
};

export function ExecutiveProjects() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const activeProject = PROJECTS.find(p => p.id === selectedProject);

  return (
    <div className="flex gap-6 h-[calc(100vh-140px)]">
      {/* Project List */}
      <div className={`${selectedProject ? 'w-1/3 hidden lg:block' : 'w-full'} space-y-4 overflow-y-auto`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#0B1C2D]">Danh sách dự án</h2>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 cursor-pointer hover:border-[#3AE7E1]">Tất cả</span>
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 cursor-pointer hover:border-[#3AE7E1]">Nghiêm trọng</span>
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 cursor-pointer hover:border-[#3AE7E1]">Rủi ro</span>
          </div>
        </div>

        {PROJECTS.map((project) => (
          <div 
            key={project.id}
            onClick={() => setSelectedProject(project.id)}
            className={`bg-white p-5 rounded-xl shadow-sm border cursor-pointer transition-all hover:shadow-md group ${
              selectedProject === project.id ? 'border-[#3AE7E1] ring-1 ring-[#3AE7E1]' : 'border-slate-200 hover:border-[#3AE7E1]/50'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-2 mb-2">
                {project.teams.map(t => {
                  const Icon = TEAM_ICONS[t] || Briefcase;
                  return (
                    <div key={t} className="p-1.5 bg-slate-100 rounded text-slate-500">
                      <Icon className="w-3 h-3" />
                    </div>
                  );
                })}
              </div>
              <MoreHorizontal className="w-5 h-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <h3 className="font-bold text-[#0B1C2D] mb-2">{project.name}</h3>
            
            <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {project.deadline}
              </span>
              <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                project.priority === 'critical' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {project.priority}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Tiến độ</span>
                <span className="font-bold text-[#0B1C2D]">{project.progress}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    project.risk === 'high' ? 'bg-red-500' : 
                    project.risk === 'medium' ? 'bg-orange-400' : 'bg-green-500'
                  }`} 
                  style={{ width: `${project.progress}%` }} 
                />
              </div>
              {project.risk !== 'low' && (
                <div className="flex items-center gap-1 text-xs text-red-500 mt-2">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Rủi ro cao</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Project Detail View */}
      {selectedProject && activeProject && (
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="p-6 border-b border-slate-100 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-[#0B1C2D]">{activeProject.name}</h2>
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  activeProject.risk === 'high' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  {activeProject.risk === 'high' ? 'Risk' : 'On Track'}
                </span>
              </div>
              <p className="text-slate-500 text-sm">{activeProject.description}</p>
            </div>
            <button 
              onClick={() => setSelectedProject(null)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 lg:hidden"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* AI Executive Summary */}
            <div className="bg-[#0B1C2D] rounded-xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#3AE7E1]/5 rounded-full blur-[60px] pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-[#3AE7E1] font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> AI Executive Summary
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Tình trạng hiện tại</div>
                    <p className="text-lg font-medium leading-relaxed">{activeProject.aiSummary}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <div className="text-xs text-slate-400 mb-2 flex items-center gap-2">
                      <FileText className="w-3 h-3" />
                      Báo cáo tổng hợp hôm nay
                    </div>
                    <p className="text-slate-300 text-sm italic">"{activeProject.dailyReport}"</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Structure */}
            <div>
              <h3 className="font-bold text-[#0B1C2D] mb-4">Cấu trúc nhân sự dự án</h3>
              <div className="grid grid-cols-2 gap-4">
                {activeProject.teamStructure.map((role, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex justify-between items-center">
                    <span className="font-medium text-[#0B1C2D]">{role.role}</span>
                    <span className="bg-white px-3 py-1 rounded border border-slate-200 text-sm font-bold text-slate-600">
                      x{role.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div>
               <h3 className="font-bold text-[#0B1C2D] mb-4">Chỉ số sức khỏe</h3>
               <div className="grid grid-cols-3 gap-4">
                 <div className="p-4 rounded-lg border border-slate-200 text-center">
                   <div className="text-2xl font-bold text-[#0B1C2D] mb-1">{activeProject.progress}%</div>
                   <div className="text-xs text-slate-500">Hoàn thành</div>
                 </div>
                 <div className="p-4 rounded-lg border border-slate-200 text-center">
                   <div className="text-2xl font-bold text-red-500 mb-1">2</div>
                   <div className="text-xs text-slate-500">Blockers</div>
                 </div>
                 <div className="p-4 rounded-lg border border-slate-200 text-center">
                   <div className="text-2xl font-bold text-green-500 mb-1">98%</div>
                   <div className="text-xs text-slate-500">Team Morale</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {!selectedProject && (
        <div className="flex-1 hidden lg:flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400">
          <div className="text-center">
            <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Chọn một dự án để xem chi tiết</p>
          </div>
        </div>
      )}
    </div>
  );
}
