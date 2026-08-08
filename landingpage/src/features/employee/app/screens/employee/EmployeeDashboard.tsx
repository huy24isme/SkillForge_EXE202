import { Link } from 'react-router-dom';
import { 
  FileText, 
  FolderKanban, 
  Gift, 
  User, 
  Trophy,
  Star,
  TrendingUp,
  Target,
  Zap,
  Award,
  Clock
} from 'lucide-react';

const quickStats = {
  level: 12,
  xp: 2450,
  xpToNext: 3000,
  totalBadges: 15,
  points: 1250,
  streak: 7,
};

const currentProject = {
  name: 'E-Commerce Platform v2.0',
  role: 'Frontend Lead',
  progress: 65,
  status: 'healthy' as const,
  deadline: '2026-03-15',
};

const activeQuests = [
  { id: 1, name: 'Complete 5 daily reports', progress: 3, total: 5, xp: 100 },
  { id: 2, name: 'Review 3 pull requests', progress: 1, total: 3, xp: 75 },
  { id: 3, name: 'Finish project milestone', progress: 2, total: 3, xp: 250 },
];

const recentBadges = [
  { id: 1, name: 'Code Master', icon: Star, color: '#F5A623' },
  { id: 2, name: 'Team Player', icon: Trophy, color: '#3AE7E1' },
  { id: 3, name: 'Quick Learner', icon: Zap, color: '#2ECC71' },
];

export function EmployeeDashboard() {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      {/* Greeting Banner */}
      <div className="bg-gradient-to-r from-[#0B1C2D] to-[#0B1C2D]/90 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#3AE7E1]/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#2ECC71]/10 rounded-full -ml-24 -mb-24" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">{greeting}, Nguyen Van A! 👋</h1>
          <p className="text-gray-300">You're doing great! Keep up the momentum.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Level Card */}
        <div className="bg-gradient-to-br from-[#3AE7E1] to-[#3AE7E1]/80 rounded-xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-20">
            <Award className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <p className="text-sm opacity-90 mb-1">Current Level</p>
            <p className="text-4xl font-bold mb-2">{quickStats.level}</p>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>{quickStats.xp} / {quickStats.xpToNext} XP</span>
            </div>
          </div>
        </div>

        {/* Badges Card */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#F5A623]/10 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-[#F5A623]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Badges</p>
              <p className="text-2xl font-bold text-gray-900">{quickStats.totalBadges}</p>
            </div>
          </div>
          <div className="flex -space-x-2">
            {recentBadges.map((badge) => (
              <div 
                key={badge.id}
                className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-white"
                style={{ backgroundColor: `${badge.color}20` }}
              >
                <badge.icon className="w-4 h-4" style={{ color: badge.color }} />
              </div>
            ))}
          </div>
        </div>

        {/* Points Card */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#2ECC71]/10 flex items-center justify-center">
              <Gift className="w-6 h-6 text-[#2ECC71]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Reward Points</p>
              <p className="text-2xl font-bold text-gray-900">{quickStats.points}</p>
            </div>
          </div>
          <Link 
            to="/employee/rewards"
            className="text-sm text-[#3AE7E1] hover:text-[#3AE7E1]/80"
          >
            Browse rewards →
          </Link>
        </div>

        {/* Streak Card */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#F5A623]/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-[#F5A623]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Daily Streak</p>
              <p className="text-2xl font-bold text-gray-900">{quickStats.streak} days</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">🔥 Keep it up! You're on fire!</p>
        </div>
      </div>

      {/* Thao tác nhanh */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/employee/daily-report"
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-[#3AE7E1] transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#3AE7E1]/10 flex items-center justify-center group-hover:bg-[#3AE7E1] transition-colors">
                <FileText className="w-5 h-5 text-[#3AE7E1] group-hover:text-white transition-colors" />
              </div>
              <h4 className="font-semibold text-gray-900">Báo cáo hằng ngày</h4>
            </div>
            <p className="text-sm text-gray-600">Submit today's progress</p>
          </Link>

          <Link 
            to="/employee/projects"
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-[#3AE7E1] transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#2ECC71]/10 flex items-center justify-center group-hover:bg-[#2ECC71] transition-colors">
                <FolderKanban className="w-5 h-5 text-[#2ECC71] group-hover:text-white transition-colors" />
              </div>
              <h4 className="font-semibold text-gray-900">My Projects</h4>
            </div>
            <p className="text-sm text-gray-600">View active projects</p>
          </Link>

          <Link 
            to="/employee/quests"
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-[#3AE7E1] transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#F5A623]/10 flex items-center justify-center group-hover:bg-[#F5A623] transition-colors">
                <Trophy className="w-5 h-5 text-[#F5A623] group-hover:text-white transition-colors" />
              </div>
              <h4 className="font-semibold text-gray-900">Quests</h4>
            </div>
            <p className="text-sm text-gray-600">Complete challenges</p>
          </Link>

          <Link 
            to="/employee/profile"
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-[#3AE7E1] transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#0B1C2D]/10 flex items-center justify-center group-hover:bg-[#0B1C2D] transition-colors">
                <User className="w-5 h-5 text-[#0B1C2D] group-hover:text-white transition-colors" />
              </div>
              <h4 className="font-semibold text-gray-900">Profile</h4>
            </div>
            <p className="text-sm text-gray-600">Update your info</p>
          </Link>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Project */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Project</h3>
          <div className="p-4 bg-gradient-to-r from-[#3AE7E1]/5 to-[#2ECC71]/5 rounded-lg border border-[#3AE7E1]/20">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{currentProject.name}</h4>
                <p className="text-sm text-gray-600">{currentProject.role}</p>
              </div>
              <span className="px-3 py-1 bg-[#2ECC71]/10 text-[#2ECC71] text-xs rounded-full flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2ECC71]" />
                Ổn định
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-900">{currentProject.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="h-2 bg-gradient-to-r from-[#3AE7E1] to-[#2ECC71] rounded-full transition-all"
                  style={{ width: `${currentProject.progress}%` }}
                />
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                Due: {new Date(currentProject.deadline).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Active Quests */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Quests</h3>
            <Link to="/employee/quests" className="text-sm text-[#3AE7E1] hover:text-[#3AE7E1]/80">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {activeQuests.map((quest) => (
              <div key={quest.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900 flex-1">{quest.name}</p>
                  <span className="text-xs font-medium text-[#F5A623] flex items-center gap-1 ml-2">
                    <Star className="w-3 h-3" />
                    {quest.xp} XP
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="h-1.5 bg-gradient-to-r from-[#3AE7E1] to-[#2ECC71] rounded-full"
                      style={{ width: `${(quest.progress / quest.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{quest.progress}/{quest.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="bg-gradient-to-r from-[#0B1C2D] to-[#0B1C2D]/95 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Level Progress</h3>
            <p className="text-sm text-gray-300">Keep grinding to reach Level {quickStats.level + 1}!</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-[#3AE7E1]">{quickStats.level}</p>
            <p className="text-xs text-gray-400">Current Level</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Experience Points</span>
            <span className="font-medium text-white">{quickStats.xp} / {quickStats.xpToNext} XP</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="h-3 bg-gradient-to-r from-[#3AE7E1] to-[#2ECC71] rounded-full transition-all"
              style={{ width: `${(quickStats.xp / quickStats.xpToNext) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">{quickStats.xpToNext - quickStats.xp} XP to next level</p>
        </div>
      </div>
    </div>
  );
}
