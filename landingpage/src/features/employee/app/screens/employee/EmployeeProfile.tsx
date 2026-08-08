import { useState } from 'react';
import { 
  Mail, 
  MapPin, 
  Calendar, 
  Trophy, 
  Star, 
  Zap,
  Edit,
  Award,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

const user = {
  name: 'Nguyen Van A',
  email: 'nguyen.vana@skillforge.ai',
  role: 'Senior Frontend Developer',
  level: 'Senior',
  location: 'Ho Chi Minh City, Vietnam',
  joinedDate: '2024-06-15',
  avatar: 'NA',
  currentLevel: 12,
  totalXP: 24580,
  badges: 15,
  projectsCompleted: 28,
};

const skills = [
  { name: 'React', level: 'Confident', progress: 92, evidence: 'Code Review' },
  { name: 'TypeScript', level: 'Confident', progress: 88, evidence: 'Certified' },
  { name: 'Node.js', level: 'Comfortable', progress: 75, evidence: 'Project Work' },
  { name: 'GraphQL', level: 'Comfortable', progress: 68, evidence: 'Self-study' },
  { name: 'Docker', level: 'Beginner', progress: 45, evidence: 'Learning' },
  { name: 'AWS', level: 'Beginner', progress: 50, evidence: 'Training' },
];

const projectHistory = [
  { id: 1, name: 'E-Commerce Platform v2.0', role: 'Frontend Lead', status: 'Đang thực hiện', period: '2026-01 - Present' },
  { id: 2, name: 'Mobile Banking App', role: 'Senior Developer', status: 'Hoàn thành', period: '2025-09 - 2025-12' },
  { id: 3, name: 'CRM System Upgrade', role: 'Frontend Developer', status: 'Hoàn thành', period: '2025-06 - 2025-08' },
  { id: 4, name: 'Analytics Tổng quan', role: 'Lead Developer', status: 'Hoàn thành', period: '2025-03 - 2025-05' },
];

const badges = [
  { id: 1, name: 'Code Master', icon: Star, color: '#F5A623', earned: '2026-01-15' },
  { id: 2, name: 'Team Player', icon: Trophy, color: '#2ECC71', earned: '2026-01-10' },
  { id: 3, name: 'Quick Learner', icon: Zap, color: '#3AE7E1', earned: '2025-12-20' },
  { id: 4, name: 'Sprint Champion', icon: Award, color: '#E74C3C', earned: '2025-12-15' },
  { id: 5, name: 'Innovation Award', icon: Star, color: '#F5A623', earned: '2025-11-30' },
  { id: 6, name: 'Consistent Contributor', icon: CheckCircle, color: '#2ECC71', earned: '2025-11-20' },
];

export function EmployeeProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSkills, setEditedSkills] = useState(skills);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Confident':
        return 'bg-[#2ECC71]/10 text-[#2ECC71]';
      case 'Comfortable':
        return 'bg-[#3AE7E1]/10 text-[#3AE7E1]';
      case 'Beginner':
        return 'bg-[#F5A623]/10 text-[#F5A623]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hồ sơ Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[#0B1C2D] via-[#3AE7E1] to-[#2ECC71]"></div>
        <div className="px-8 pb-6">
          <div className="flex items-start gap-6 -mt-16">
            <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-[#3AE7E1] to-[#2ECC71] border-4 border-white shadow-lg flex items-center justify-center">
              <span className="text-5xl font-bold text-white">{user.avatar}</span>
            </div>
            <div className="flex-1 mt-16">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-1">{user.name}</h2>
                  <p className="text-gray-600 mb-3">{user.role}</p>
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
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-6 py-2.5 bg-[#3AE7E1] text-white rounded-lg hover:bg-[#3AE7E1]/90 transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  {isEditing ? 'Save Changes' : 'Chỉnh sửa hồ sơ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#3AE7E1] to-[#3AE7E1]/80 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-90">Current Level</p>
              <p className="text-3xl font-bold">{user.currentLevel}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-8 h-8 text-[#F5A623]" />
            <div>
              <p className="text-sm text-gray-600">Total XP</p>
              <p className="text-2xl font-bold text-gray-900">{user.totalXP.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-[#2ECC71]" />
            <div>
              <p className="text-sm text-gray-600">Badges Earned</p>
              <p className="text-2xl font-bold text-gray-900">{user.badges}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-8 h-8 text-[#3AE7E1]" />
            <div>
              <p className="text-sm text-gray-600">Projects Done</p>
              <p className="text-2xl font-bold text-gray-900">{user.projectsCompleted}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skills & Tech Stack */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Skills & Tech Stack</h3>
              {isEditing && (
                <button className="text-sm text-[#3AE7E1] hover:text-[#3AE7E1]/80">
                  + Add Skill
                </button>
              )}
            </div>
            <div className="space-y-4">
              {editedSkills.map((skill, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{skill.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${getLevelColor(skill.level)}`}>
                          {skill.level}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                          <CheckCircle className="w-3 h-3" />
                          {skill.evidence}
                        </span>
                      </div>
                    </div>
                    {isEditing ? (
                      <select 
                        value={skill.level}
                        onChange={(e) => {
                          const newSkills = [...editedSkills];
                          newSkills[idx].level = e.target.value;
                          setEditedSkills(newSkills);
                        }}
                        className="px-3 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Comfortable">Comfortable</option>
                        <option value="Confident">Confident</option>
                      </select>
                    ) : (
                      <div className="text-right">
                        <p className="text-2xl font-semibold text-gray-900">{skill.progress}%</p>
                      </div>
                    )}
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        skill.level === 'Confident' ? 'bg-gradient-to-r from-[#2ECC71] to-[#2ECC71]/80' :
                        skill.level === 'Comfortable' ? 'bg-gradient-to-r from-[#3AE7E1] to-[#3AE7E1]/80' :
                        'bg-gradient-to-r from-[#F5A623] to-[#F5A623]/80'
                      }`}
                      style={{ width: `${skill.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lịch sử dự án */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Lịch sử dự án</h3>
            <div className="space-y-4">
              {projectHistory.map((project, idx) => (
                <div key={project.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      project.status === 'Đang thực hiện' ? 'bg-[#3AE7E1]/20' : 'bg-[#2ECC71]/20'
                    }`}>
                      <div className={`w-5 h-5 rounded-full ${
                        project.status === 'Đang thực hiện' ? 'bg-[#3AE7E1]' : 'bg-[#2ECC71]'
                      }`} />
                    </div>
                    {idx < projectHistory.length - 1 && (
                      <div className="w-0.5 h-12 mt-2 bg-gray-200" />
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
                    <p className="text-xs text-gray-500 mt-1">{project.period}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Badge Showcase */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Badge Showcase</h3>
            <div className="grid grid-cols-3 gap-3">
              {badges.map((badge) => {
                const BadgeIcon = badge.icon;
                return (
                  <div 
                    key={badge.id}
                    className="aspect-square rounded-lg flex flex-col items-center justify-center p-2 border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
                    style={{ backgroundColor: `${badge.color}10` }}
                  >
                    <BadgeIcon className="w-8 h-8 mb-1" style={{ color: badge.color }} />
                    <p className="text-[10px] text-center text-gray-700 group-hover:text-gray-900">{badge.name}</p>
                  </div>
                );
              })}
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
              View All {user.badges} Badges
            </button>
          </div>

          {/* Progress Stats */}
          <div className="bg-gradient-to-br from-[#0B1C2D] to-[#0B1C2D]/95 rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-4">Career Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Success Rate</span>
                <span className="text-xl font-bold text-[#2ECC71]">96%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Avg. Team Rating</span>
                <span className="text-xl font-bold text-[#F5A623]">4.8/5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">On-Time Delivery</span>
                <span className="text-xl font-bold text-[#3AE7E1]">94%</span>
              </div>
            </div>
          </div>

          {/* AI Growth Insights */}
          <div className="bg-gradient-to-br from-[#3AE7E1]/10 to-[#2ECC71]/10 rounded-xl p-6 border border-[#3AE7E1]/20">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-[#3AE7E1]" />
              <h3 className="font-semibold text-gray-900">AI Growth Insights</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[#3AE7E1]">•</span>
                <span>Your skill progression is 23% faster than average</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#3AE7E1]">•</span>
                <span>Consider learning backend to become full-stack</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#3AE7E1]">•</span>
                <span>You're ready for tech lead opportunities</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
