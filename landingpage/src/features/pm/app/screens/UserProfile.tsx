import { Mail, MapPin, Calendar, Award, Briefcase, CheckCircle } from 'lucide-react';

const user = {
  name: 'Nguyen Van A',
  email: 'nguyen.vana@skillforge.ai',
  role: 'Senior Frontend Developer',
  location: 'Ho Chi Minh City, Vietnam',
  joinedDate: '2024-06-15',
  avatar: 'NA',
};

const skills = [
  { 
    name: 'React', 
    level: 'Confident', 
    selfDeclared: 'Confident', 
    evidence: 'Code Review', 
    progress: 92,
    projects: 12
  },
  { 
    name: 'TypeScript', 
    level: 'Confident', 
    selfDeclared: 'Confident', 
    evidence: 'Certified', 
    progress: 88,
    projects: 10
  },
  { 
    name: 'Node.js', 
    level: 'Comfortable', 
    selfDeclared: 'Comfortable', 
    evidence: 'Project Work', 
    progress: 75,
    projects: 8
  },
  { 
    name: 'GraphQL', 
    level: 'Comfortable', 
    selfDeclared: 'Comfortable', 
    evidence: 'Self-study', 
    progress: 68,
    projects: 5
  },
  { 
    name: 'Docker', 
    level: 'Beginner', 
    selfDeclared: 'Beginner', 
    evidence: 'Learning', 
    progress: 45,
    projects: 3
  },
];

const projectHistory = [
  { id: 1, name: 'E-Commerce Platform v2.0', role: 'Frontend Lead', status: 'Đang thực hiện', date: '2026-01 - Present' },
  { id: 2, name: 'Mobile Banking App', role: 'Senior Developer', status: 'Hoàn thành', date: '2025-09 - 2025-12' },
  { id: 3, name: 'CRM System Upgrade', role: 'Frontend Developer', status: 'Hoàn thành', date: '2025-06 - 2025-08' },
  { id: 4, name: 'Analytics Tổng quan', role: 'Lead Developer', status: 'Hoàn thành', date: '2025-03 - 2025-05' },
];

const recommendations = [
  'Focus on backend skills to become full-stack',
  'Consider mentoring junior developers to boost leadership skills',
  'Explore system design and architecture courses',
];

export function UserProfile() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hồ sơ Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[#0B1C2D] to-[#3AE7E1]"></div>
        <div className="px-8 pb-6">
          <div className="flex items-start gap-6 -mt-16">
            <div className="w-32 h-32 rounded-xl bg-white border-4 border-white shadow-lg flex items-center justify-center">
              <span className="text-4xl font-bold text-[#3AE7E1]">{user.avatar}</span>
            </div>
            <div className="flex-1 mt-16">
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">{user.name}</h2>
              <p className="text-gray-600 mb-4">{user.role}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {user.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(user.joinedDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button className="mt-16 px-6 py-2.5 bg-[#3AE7E1] text-white rounded-lg hover:bg-[#3AE7E1]/90 transition-colors">
              Chỉnh sửa hồ sơ
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skills */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Skills & Expertise</h3>
              <button className="text-sm text-[#3AE7E1] hover:text-[#3AE7E1]/80">
                + Add Skill
              </button>
            </div>
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{skill.name}</h4>
                      <div className="flex items-center gap-3 text-sm">
                        <span className={`px-2 py-1 rounded ${
                          skill.level === 'Confident' ? 'bg-[#2ECC71]/10 text-[#2ECC71]' :
                          skill.level === 'Comfortable' ? 'bg-[#3AE7E1]/10 text-[#3AE7E1]' :
                          'bg-[#F5A623]/10 text-[#F5A623]'
                        }`}>
                          {skill.level}
                        </span>
                        <span className="flex items-center gap-1 text-gray-600">
                          <CheckCircle className="w-4 h-4" />
                          {skill.evidence}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold text-gray-900">{skill.progress}%</p>
                      <p className="text-xs text-gray-500">{skill.projects} dự án</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          skill.level === 'Confident' ? 'bg-[#2ECC71]' :
                          skill.level === 'Comfortable' ? 'bg-[#3AE7E1]' :
                          'bg-[#F5A623]'
                        }`}
                        style={{ width: `${skill.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lịch sử dự án */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Lịch sử dự án</h3>
            <div className="space-y-4">
              {projectHistory.map((project, idx) => (
                <div key={project.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      project.status === 'Đang thực hiện' ? 'bg-[#3AE7E1]/20' : 'bg-[#2ECC71]/20'
                    }`}>
                      <div className={`w-4 h-4 rounded-full ${
                        project.status === 'Đang thực hiện' ? 'bg-[#3AE7E1]' : 'bg-[#2ECC71]'
                      }`} />
                    </div>
                    {idx < projectHistory.length - 1 && (
                      <div className="w-0.5 h-12 mt-1 bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        project.status === 'Đang thực hiện' 
                          ? 'bg-[#3AE7E1]/10 text-[#3AE7E1]' 
                          : 'bg-[#2ECC71]/10 text-[#2ECC71]'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{project.role}</p>
                    <p className="text-xs text-gray-500 mt-1">{project.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-6">
          {/* Growth Recommendations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#F5A623]/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-[#F5A623]" />
              </div>
              <h3 className="font-semibold text-gray-900">Growth Recommendations</h3>
            </div>
            <ul className="space-y-3">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-[#3AE7E1]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-[#3AE7E1]">{idx + 1}</span>
                  </span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Thống kê</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Dự án đã hoàn thành</span>
                <span className="text-lg font-semibold text-gray-900">28</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="text-lg font-semibold text-[#2ECC71]">96%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg. Team Rating</span>
                <span className="text-lg font-semibold text-[#3AE7E1]">4.8/5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total XP</span>
                <span className="text-lg font-semibold text-[#F5A623]">24,580</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
