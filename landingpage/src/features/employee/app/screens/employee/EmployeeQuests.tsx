import { useState } from 'react';
import { Trophy, Star, Zap, Target, Gift, CheckCircle, } from 'lucide-react';

const quests = {
  daily: [
    { id: 1, name: 'Nộp báo cáo hằng ngày', progress: 1, total: 1, xp: 50, badge: null, status: 'claimable', icon: Star },
    { id: 2, name: 'Review 2 Pull Requests', progress: 1, total: 2, xp: 75, badge: null, status: 'in-progress', icon: Target },
    { id: 3, name: 'Complete 3 Code Reviews', progress: 0, total: 3, xp: 100, badge: 'Code Guardian', status: 'available', icon: Zap },
  ],
  weekly: [
    { id: 4, name: 'Hoàn thành 5 báo cáo hằng ngày', progress: 3, total: 5, xp: 250, badge: 'Consistent Contributor', status: 'in-progress', icon: Trophy },
    { id: 5, name: 'Finish Project Milestone', progress: 2, total: 3, xp: 500, badge: 'Milestone Master', status: 'in-progress', icon: Target },
    { id: 6, name: 'Help 3 Team Members', progress: 1, total: 3, xp: 200, badge: 'Team Player', status: 'in-progress', icon: Star },
  ],
  project: [
    { id: 7, name: 'Complete E-Commerce Platform Sprint', progress: 65, total: 100, xp: 1000, badge: 'Sprint Champion', status: 'in-progress', icon: Trophy },
    { id: 8, name: 'Zero Bugs in Production', progress: 5, total: 7, xp: 750, badge: 'Bug Hunter', status: 'in-progress', icon: Target },
  ],
  featured: [
    { id: 9, name: '🔥 Weekend Code Sprint', progress: 0, total: 1, xp: 500, badge: 'Weekend Warrior', status: 'featured', icon: Zap },
  ],
};

export function EmployeeQuests() {
  const [activeTab, setActiveTab] = useState<'all' | 'daily' | 'weekly' | 'project'>('all');
  const [claimedQuests, setClaimedQuests] = useState<number[]>([]);

  const handleClaimReward = (questId: number) => {
    setClaimedQuests([...claimedQuests, questId]);
    // In real app, this would trigger XP addition and badge unlock
  };

  const getQuestsByTab = () => {
    if (activeTab === 'all') {
      return [...quests.featured, ...quests.daily, ...quests.weekly, ...quests.project];
    }
    return quests[activeTab] || [];
  };

  const getStatusConfig = (status: string, isClaimed: boolean) => {
    if (isClaimed) {
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-500',
        border: 'border-gray-200',
        button: 'bg-gray-200 text-gray-500 cursor-not-allowed',
        buttonText: 'Claimed',
      };
    }

    switch (status) {
      case 'claimable':
        return {
          bg: 'bg-[#2ECC71]/5',
          text: 'text-[#2ECC71]',
          border: 'border-[#2ECC71]/30',
          button: 'bg-gradient-to-r from-[#2ECC71] to-[#2ECC71]/80 text-white hover:shadow-lg',
          buttonText: 'Claim Reward',
        };
      case 'featured':
        return {
          bg: 'bg-gradient-to-r from-[#F5A623]/10 to-[#E74C3C]/10',
          text: 'text-[#F5A623]',
          border: 'border-[#F5A623]/50',
          button: 'bg-gradient-to-r from-[#F5A623] to-[#E74C3C] text-white hover:shadow-lg',
          buttonText: 'Start Quest',
        };
      case 'in-progress':
        return {
          bg: 'bg-[#3AE7E1]/5',
          text: 'text-[#3AE7E1]',
          border: 'border-[#3AE7E1]/30',
          button: 'bg-white border-2 border-[#3AE7E1] text-[#3AE7E1] hover:bg-[#3AE7E1]/5',
          buttonText: 'Continue',
        };
      default:
        return {
          bg: 'bg-white',
          text: 'text-gray-600',
          border: 'border-gray-200',
          button: 'bg-[#3AE7E1] text-white hover:bg-[#3AE7E1]/90',
          buttonText: 'Start',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B1C2D] to-[#0B1C2D]/95 rounded-xl p-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Trophy className="w-8 h-8 text-[#F5A623]" />
          <h2 className="text-2xl font-semibold">Quests & Challenges</h2>
        </div>
        <p className="text-gray-300">Complete quests to earn XP and unlock exclusive badges!</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {[
          { id: 'all', label: 'All Quests', count: Object.values(quests).flat().length },
          { id: 'daily', label: 'Daily', count: quests.daily.length },
          { id: 'weekly', label: 'Weekly', count: quests.weekly.length },
          { id: 'project', label: 'Project', count: quests.project.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-[#3AE7E1] text-white shadow-lg'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-[#3AE7E1]'
            }`}
          >
            {tab.label} <span className="text-sm opacity-75">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Quests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {getQuestsByTab().map((quest) => {
          const isClaimed = claimedQuests.includes(quest.id);
          const config = getStatusConfig(quest.status, isClaimed);
          const QuestIcon = quest.icon;
          const progressPercentage = (quest.progress / quest.total) * 100;

          return (
            <div
              key={quest.id}
              className={`rounded-xl p-6 border-2 ${config.border} ${config.bg} transition-all hover:shadow-lg ${
                quest.status === 'featured' ? 'relative overflow-hidden' : ''
              }`}
            >
              {quest.status === 'featured' && (
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-r from-[#F5A623] to-[#E74C3C] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    FEATURED
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4 mb-4">
                <div className={`w-14 h-14 rounded-xl ${
                  isClaimed ? 'bg-gray-200' : 'bg-gradient-to-br from-[#3AE7E1] to-[#2ECC71]'
                } flex items-center justify-center flex-shrink-0`}>
                  <QuestIcon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{quest.name}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1 text-sm font-medium text-[#F5A623]">
                      <Star className="w-4 h-4" />
                      {quest.xp} XP
                    </span>
                    {quest.badge && (
                      <span className="flex items-center gap-1 text-sm text-[#3AE7E1]">
                        <Trophy className="w-4 h-4" />
                        {quest.badge}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">
                    {quest.progress} / {quest.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all ${
                      isClaimed ? 'bg-gray-400' : 'bg-gradient-to-r from-[#3AE7E1] to-[#2ECC71]'
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => quest.status === 'claimable' && !isClaimed && handleClaimReward(quest.id)}
                disabled={isClaimed || (quest.status !== 'claimable' && quest.status !== 'featured')}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${config.button}`}
              >
                {isClaimed ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Claimed
                  </>
                ) : quest.status === 'claimable' ? (
                  <>
                    <Gift className="w-5 h-5" />
                    {config.buttonText}
                  </>
                ) : (
                  <>
                    {quest.status === 'in-progress' ? (
                      <Target className="w-5 h-5" />
                    ) : (
                      <Zap className="w-5 h-5" />
                    )}
                    {config.buttonText}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Quest Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Your Quest Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#3AE7E1] mb-1">
              {Object.values(quests).flat().filter(q => q.status === 'claimable').length}
            </div>
            <p className="text-sm text-gray-600">Ready to Claim</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#F5A623] mb-1">
              {Object.values(quests).flat().filter(q => q.status === 'in-progress').length}
            </div>
            <p className="text-sm text-gray-600">In Progress</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#2ECC71] mb-1">{claimedQuests.length}</div>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {claimedQuests.reduce((sum, id) => {
                const quest = Object.values(quests).flat().find(q => q.id === id);
                return sum + (quest?.xp || 0);
              }, 0)}
            </div>
            <p className="text-sm text-gray-600">XP Earned</p>
          </div>
        </div>
      </div>
    </div>
  );
}
