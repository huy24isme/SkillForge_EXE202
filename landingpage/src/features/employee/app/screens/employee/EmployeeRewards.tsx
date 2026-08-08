import { useState } from 'react';
import { Gift, Star, Zap, Award, ShoppingBag, Sparkles, CheckCircle } from 'lucide-react';

const rewardCategories = {
  swag: [
    { id: 1, name: 'SkillForge T-Shirt', cost: 500, icon: '👕', image: null, stock: 15 },
    { id: 2, name: 'Premium Notebook', cost: 300, icon: '📓', image: null, stock: 25 },
    { id: 3, name: 'Water Bottle', cost: 250, icon: '🥤', image: null, stock: 30 },
    { id: 4, name: 'Laptop Stickers Pack', cost: 150, icon: '🎨', image: null, stock: 50 },
  ],
  badges: [
    { id: 5, name: 'Code Master Badge', cost: 750, icon: Star, color: '#F5A623', description: 'Exclusive gold badge' },
    { id: 6, name: 'Innovation Badge', cost: 1000, icon: Sparkles, color: '#3AE7E1', description: 'For creative solutions' },
    { id: 7, name: 'Team Leader Badge', cost: 850, icon: Award, color: '#2ECC71', description: 'Leadership recognition' },
  ],
  boosts: [
    { id: 8, name: '2x XP Boost (24h)', cost: 400, icon: Zap, duration: '24 hours', multiplier: '2x' },
    { id: 9, name: '1.5x XP Boost (7 days)', cost: 1200, icon: Zap, duration: '7 days', multiplier: '1.5x' },
  ],
  special: [
    { id: 10, name: 'Extra Day Off', cost: 2000, icon: '🏖️', description: 'One additional vacation day' },
    { id: 11, name: 'Team Lunch Voucher', cost: 800, icon: '🍽️', description: 'Lunch for your team' },
    { id: 12, name: 'Learning Budget ($100)', cost: 1500, icon: '📚', description: 'For courses or books' },
  ],
};

export function EmployeeRewards() {
  const [activeTab, setActiveTab] = useState<'swag' | 'badges' | 'boosts' | 'special'>('swag');
  const [userPoints] = useState(1250);
  const [redeemedItems, setRedeemedItems] = useState<number[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRedeem = (itemId: number, cost: number) => {
    if (userPoints >= cost && !redeemedItems.includes(itemId)) {
      setRedeemedItems([...redeemedItems, itemId]);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const canAfford = (cost: number) => userPoints >= cost;

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-gradient-to-r from-[#2ECC71] to-[#2ECC71]/90 text-white rounded-xl p-4 flex items-center gap-3 animate-slideDown">
          <CheckCircle className="w-6 h-6" />
          <div>
            <p className="font-semibold">Reward Redeemed Successfully!</p>
            <p className="text-sm opacity-90">Check your email for redemption details.</p>
          </div>
        </div>
      )}

      {/* Header with Points Balance */}
      <div className="bg-gradient-to-r from-[#0B1C2D] to-[#0B1C2D]/95 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Gift className="w-8 h-8 text-[#F5A623]" />
              <h2 className="text-2xl font-semibold">Rewards Exchange</h2>
            </div>
            <p className="text-gray-300">Redeem your hard-earned points for awesome rewards!</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 mb-1">Your Balance</p>
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-[#F5A623]" />
              <p className="text-4xl font-bold text-[#F5A623]">{userPoints}</p>
            </div>
            <p className="text-xs text-gray-400 mt-1">Reward Points</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto">
        {[
          { id: 'swag', label: 'Company Swag', icon: ShoppingBag },
          { id: 'badges', label: 'Digital Badges', icon: Award },
          { id: 'boosts', label: 'XP Boosts', icon: Zap },
          { id: 'special', label: 'Special Rewards', icon: Sparkles },
        ].map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#3AE7E1] text-white shadow-lg'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-[#3AE7E1]'
              }`}
            >
              <TabIcon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Swag Items */}
        {activeTab === 'swag' && rewardCategories.swag.map((item) => {
          const isRedeemed = redeemedItems.includes(item.id);
          const affordable = canAfford(item.cost);

          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl p-6 border-2 transition-all ${
                isRedeemed ? 'border-gray-200' : affordable ? 'border-gray-200 hover:border-[#3AE7E1] hover:shadow-lg' : 'border-gray-100 opacity-60'
              }`}
            >
              <div className="text-6xl mb-4 text-center">{item.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2 text-center">{item.name}</h3>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="w-5 h-5 text-[#F5A623]" />
                <span className="text-2xl font-bold text-gray-900">{item.cost}</span>
              </div>
              <p className="text-sm text-gray-600 text-center mb-4">In stock: {item.stock}</p>
              <button
                onClick={() => handleRedeem(item.id, item.cost)}
                disabled={!affordable || isRedeemed}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${
                  isRedeemed
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : affordable
                    ? 'bg-gradient-to-r from-[#3AE7E1] to-[#2ECC71] text-white hover:shadow-lg'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isRedeemed ? 'Redeemed' : affordable ? 'Redeem' : 'Not Enough Points'}
              </button>
            </div>
          );
        })}

        {/* Digital Badges */}
        {activeTab === 'badges' && rewardCategories.badges.map((item) => {
          const isRedeemed = redeemedItems.includes(item.id);
          const affordable = canAfford(item.cost);
          const BadgeIcon = item.icon;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl p-6 border-2 transition-all ${
                isRedeemed ? 'border-gray-200' : affordable ? 'border-gray-200 hover:border-[#3AE7E1] hover:shadow-lg' : 'border-gray-100 opacity-60'
              }`}
            >
              <div 
                className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <BadgeIcon className="w-12 h-12" style={{ color: item.color }} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-center">{item.name}</h3>
              <p className="text-sm text-gray-600 text-center mb-4">{item.description}</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="w-5 h-5 text-[#F5A623]" />
                <span className="text-2xl font-bold text-gray-900">{item.cost}</span>
              </div>
              <button
                onClick={() => handleRedeem(item.id, item.cost)}
                disabled={!affordable || isRedeemed}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${
                  isRedeemed
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : affordable
                    ? 'bg-gradient-to-r from-[#3AE7E1] to-[#2ECC71] text-white hover:shadow-lg'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isRedeemed ? 'Unlocked' : affordable ? 'Unlock Badge' : 'Not Enough Points'}
              </button>
            </div>
          );
        })}

        {/* XP Boosts */}
        {activeTab === 'boosts' && rewardCategories.boosts.map((item) => {
          const isRedeemed = redeemedItems.includes(item.id);
          const affordable = canAfford(item.cost);
          const BoostIcon = item.icon;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl p-6 border-2 transition-all ${
                isRedeemed ? 'border-gray-200' : affordable ? 'border-gray-200 hover:border-[#3AE7E1] hover:shadow-lg' : 'border-gray-100 opacity-60'
              }`}
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#F5A623] to-[#E74C3C] flex items-center justify-center">
                <BoostIcon className="w-12 h-12 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-center">{item.name}</h3>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl font-bold text-[#F5A623]">{item.multiplier}</span>
              </div>
              <p className="text-sm text-gray-600 text-center mb-4">Duration: {item.duration}</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="w-5 h-5 text-[#F5A623]" />
                <span className="text-2xl font-bold text-gray-900">{item.cost}</span>
              </div>
              <button
                onClick={() => handleRedeem(item.id, item.cost)}
                disabled={!affordable || isRedeemed}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${
                  isRedeemed
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : affordable
                    ? 'bg-gradient-to-r from-[#F5A623] to-[#E74C3C] text-white hover:shadow-lg'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isRedeemed ? 'Active' : affordable ? 'Activate Boost' : 'Not Enough Points'}
              </button>
            </div>
          );
        })}

        {/* Special Rewards */}
        {activeTab === 'special' && rewardCategories.special.map((item) => {
          const isRedeemed = redeemedItems.includes(item.id);
          const affordable = canAfford(item.cost);

          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl p-6 border-2 transition-all ${
                isRedeemed ? 'border-gray-200' : affordable ? 'border-gray-200 hover:border-[#3AE7E1] hover:shadow-lg' : 'border-gray-100 opacity-60'
              }`}
            >
              <div className="text-6xl mb-4 text-center">{item.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2 text-center">{item.name}</h3>
              <p className="text-sm text-gray-600 text-center mb-4">{item.description}</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="w-5 h-5 text-[#F5A623]" />
                <span className="text-2xl font-bold text-gray-900">{item.cost}</span>
              </div>
              <button
                onClick={() => handleRedeem(item.id, item.cost)}
                disabled={!affordable || isRedeemed}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${
                  isRedeemed
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : affordable
                    ? 'bg-gradient-to-r from-[#3AE7E1] to-[#2ECC71] text-white hover:shadow-lg'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isRedeemed ? 'Redeemed' : affordable ? 'Redeem' : 'Not Enough Points'}
              </button>
            </div>
          );
        })}
      </div>

      {/* How to Earn More Points */}
      <div className="bg-gradient-to-r from-[#3AE7E1]/10 to-[#2ECC71]/10 rounded-xl p-6 border border-[#3AE7E1]/20">
        <h3 className="font-semibold text-gray-900 mb-4">💡 How to Earn More Points</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#3AE7E1]/20 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-[#3AE7E1]" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Complete Quests</p>
              <p className="text-sm text-gray-600">Daily, weekly, and project quests</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2ECC71]/20 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5 text-[#2ECC71]" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Earn Achievements</p>
              <p className="text-sm text-gray-600">Special milestone rewards</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#F5A623]/20 flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 text-[#F5A623]" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Level Up</p>
              <p className="text-sm text-gray-600">Bonus points every level</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
