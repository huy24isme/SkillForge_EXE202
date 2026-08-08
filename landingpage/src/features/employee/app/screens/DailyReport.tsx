import { useState } from 'react';
import { Trophy, Star, TrendingUp, Award, Zap } from 'lucide-react';

export function DailyReport() {
  const [report, setReport] = useState({
    workDone: '',
    blockers: '',
    selfAssessment: '3',
  });

  const skills = [
    { name: 'React', level: 85, trend: '+5%', color: '#3AE7E1' },
    { name: 'TypeScript', level: 78, trend: '+8%', color: '#3AE7E1' },
    { name: 'Node.js', level: 65, trend: '+3%', color: '#F5A623' },
    { name: 'PostgreSQL', level: 70, trend: '+7%', color: '#3AE7E1' },
  ];

  const achievements = [
    { id: 1, name: 'First Pull Request', icon: Star, color: '#F5A623', date: '2026-01-10' },
    { id: 2, name: 'Week Streak', icon: Zap, color: '#3AE7E1', date: '2026-01-20' },
    { id: 3, name: 'Team Player', icon: Trophy, color: '#2ECC71', date: '2026-01-22' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Báo cáo hằng ngày Form */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">Báo cáo hằng ngày</h2>
            <p className="text-sm text-gray-600">Share your progress and earn XP!</p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What did you do today? *
              </label>
              <textarea
                value={report.workDone}
                onChange={(e) => setReport({ ...report, workDone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AE7E1] focus:border-transparent resize-none"
                rows={5}
                placeholder="Mô tả thành tựu, công việc đã hoàn thành và tiến độ đạt được..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Any blockers or challenges?
              </label>
              <textarea
                value={report.blockers}
                onChange={(e) => setReport({ ...report, blockers: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AE7E1] focus:border-transparent resize-none"
                rows={3}
                placeholder="What's blocking your progress? How can the team help?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How productive were you today?
              </label>
              <div className="flex items-center gap-4">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setReport({ ...report, selfAssessment: rating.toString() })}
                    className={`w-12 h-12 rounded-full border-2 transition-all ${
                      parseInt(report.selfAssessment) >= rating
                        ? 'border-[#3AE7E1] bg-[#3AE7E1] text-white'
                        : 'border-gray-300 text-gray-400 hover:border-[#3AE7E1]/50'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">1 = Low productivity, 5 = Very productive</p>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#3AE7E1] text-white rounded-lg hover:bg-[#3AE7E1]/90 transition-colors flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              Gửi báo cáo và nhận 50 XP
            </button>
          </form>
        </div>

        {/* XP & Progress */}
        <div className="space-y-6">
          {/* Level Card */}
          <div className="bg-gradient-to-br from-[#3AE7E1] to-[#0B1C2D] rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm opacity-90 mb-1">Your Level</p>
                <p className="text-4xl font-bold">12</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-90">XP Progress</span>
                <span className="font-medium">2,450 / 3,000</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-white"
                  style={{ width: '82%' }}
                />
              </div>
              <p className="text-xs opacity-75">550 XP to next level</p>
            </div>
          </div>

          {/* Reward Points */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#F5A623]/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-[#F5A623]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Reward Points</p>
                <p className="text-2xl font-semibold text-gray-900">1,250</p>
              </div>
            </div>
            <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
              Redeem Rewards
            </button>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${achievement.color}20` }}
                  >
                    <achievement.icon className="w-5 h-5" style={{ color: achievement.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{achievement.name}</p>
                    <p className="text-xs text-gray-500">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Skill Progression */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Skill Progression</h3>
          <span className="text-sm text-gray-600">Last 30 days</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill) => (
            <div key={skill.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{skill.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#2ECC71]">{skill.trend}</span>
                  <span className="text-sm font-medium text-gray-900">{skill.level}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all"
                  style={{ 
                    width: `${skill.level}%`,
                    backgroundColor: skill.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
