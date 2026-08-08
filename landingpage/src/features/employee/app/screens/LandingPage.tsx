import { 
  ArrowRight, 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Zap,
  BarChart3,
  CheckCircle,
  Sparkles,
  Award,
  FileText,
  Eye,
  ChevronRight,
  Star
} from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-[#14B8A6]" />
              <span className="text-2xl font-bold text-gray-900">SkillForge</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Tính năng</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Bảng giá</a>
              <button className="px-6 py-2 bg-[#14B8A6] text-white rounded-lg hover:bg-[#14B8A6]/90 transition-colors">
                Bắt đầu ngay
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#14B8A6]/10 text-[#14B8A6] rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Nền tảng quản lý nhân sự thông minh
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Quản lý con người<br />thông minh hơn với<br />
                <span className="text-[#14B8A6]">AI & Game hóa</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                SkillForge là nền tảng quản lý nhân sự – năng lực – dự án, giúp doanh nghiệp 
                giao đúng người – đúng việc và phát triển đội ngũ bền vững.
              </p>
              <div className="flex gap-4">
                <button className="px-8 py-4 bg-[#14B8A6] text-white rounded-xl hover:bg-[#14B8A6]/90 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl font-medium">
                  Bắt đầu ngay
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-900 rounded-xl hover:border-[#14B8A6] transition-all font-medium">
                  Yêu cầu demo
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#14B8A6]/20 to-[#0891b2]/20 rounded-2xl p-8 border border-[#14B8A6]/30">
                {/* Dashboard Mockup */}
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-[#0B1C2D] to-[#0B1C2D]/90 p-4 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-[#14B8A6]" />
                    <span className="text-white font-semibold">SkillForge Dashboard</span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gradient-to-br from-[#14B8A6] to-[#0891b2] p-4 rounded-lg text-white">
                        <div className="text-2xl font-bold">156</div>
                        <div className="text-xs opacity-90">Nhân viên</div>
                      </div>
                      <div className="bg-gradient-to-br from-[#14B8A6]/10 to-[#0891b2]/10 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">24</div>
                        <div className="text-xs text-gray-600">Dự án</div>
                      </div>
                      <div className="bg-gradient-to-br from-[#14B8A6]/10 to-[#0891b2]/10 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">96%</div>
                        <div className="text-xs text-gray-600">Hiệu suất</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">AI phân tích dự án</span>
                        <span className="text-[#14B8A6] font-medium">Hoàn thành</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-to-r from-[#14B8A6] to-[#0891b2]" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="w-4 h-4 text-[#14B8A6]" />
                      <span>Level 12 • 2,450 XP • 15 Badges</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Thách thức của doanh nghiệp hiện đại
            </h2>
            <p className="text-xl text-gray-600">
              Những vấn đề phổ biến trong quản lý nhân sự và dự án
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Eye,
                title: 'Không nắm rõ năng lực nhân viên',
                description: 'Khó khăn trong việc đánh giá chính xác kỹ năng và tiềm năng của từng thành viên',
              },
              {
                icon: Target,
                title: 'Giao dự án theo cảm tính',
                description: 'Thiếu dữ liệu để quyết định ai phù hợp với dự án nào',
              },
              {
                icon: TrendingUp,
                title: 'Nhân viên thiếu động lực',
                description: 'Không có lộ trình phát triển rõ ràng và hệ thống khuyến khích',
              },
              {
                icon: FileText,
                title: 'Báo cáo rời rạc, thủ công',
                description: 'Mất thời gian xử lý báo cáo, khó tổng hợp và phân tích',
              },
            ].map((problem, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#14B8A6] transition-all hover:shadow-lg">
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-4">
                  <problem.icon className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{problem.title}</h3>
                <p className="text-sm text-gray-600">{problem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Giải pháp của SkillForge
            </h2>
            <p className="text-xl text-gray-600">
              Công nghệ AI kết hợp game hóa để quản lý hiệu quả
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Brain,
                title: 'AI phân tích dự án & nhân sự',
                description: 'Tự động phân tích yêu cầu dự án và đề xuất đội ngũ phù hợp',
                color: 'from-[#14B8A6] to-[#0891b2]',
              },
              {
                icon: Users,
                title: 'Gợi ý nhân sự phù hợp',
                description: 'Matching thông minh dựa trên kỹ năng, kinh nghiệm và khả năng',
                color: 'from-[#0891b2] to-[#0e7490]',
              },
              {
                icon: Zap,
                title: 'Game hóa quá trình làm việc',
                description: 'Level, XP, Quest, Streak và Rewards để tăng động lực',
                color: 'from-[#14B8A6] to-[#0891b2]',
              },
              {
                icon: BarChart3,
                title: 'Dashboard quản lý trực quan',
                description: 'Tổng quan năng lực, dự án và hiệu suất theo thời gian thực',
                color: 'from-[#0891b2] to-[#0e7490]',
              },
            ].map((solution, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#14B8A6] transition-all hover:shadow-xl group">
                <div className={`w-14 h-14 bg-gradient-to-br ${solution.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <solution.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">{solution.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{solution.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tính năng cốt lõi
            </h2>
            <p className="text-xl text-gray-600">
              Giải pháp toàn diện cho quản lý nhân sự và dự án
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'AI tóm tắt Báo cáo hằng ngày',
                description: 'Tự động phân tích và tổng hợp báo cáo hàng ngày của đội ngũ, phát hiện xu hướng và vấn đề',
              },
              {
                icon: BarChart3,
                title: 'Dashboard lãnh đạo & quản lý',
                description: 'Tổng quan năng lực tổ chức, hiệu suất dự án và KPI theo thời gian thực',
              },
              {
                icon: Zap,
                title: 'Game hóa (Level – XP – Quest – Streak)',
                description: 'Hệ thống động lực với cấp độ, kinh nghiệm, nhiệm vụ và chuỗi ngày làm việc',
              },
              {
                icon: Users,
                title: 'Hồ sơ nhân viên & dự án',
                description: 'Quản lý chi tiết kỹ năng, kinh nghiệm và lịch sử tham gia dự án',
              },
              {
                icon: TrendingUp,
                title: 'Theo dõi năng lực & hiệu suất',
                description: 'Đánh giá và phát triển kỹ năng liên tục với feedback từ AI',
              },
              {
                icon: Target,
                title: 'Strategic Resource Allocation',
                description: 'Phân bổ nguồn lực theo ưu tiên chiến lược, KPI và năng lực triển khai thực tế',
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-xl p-8 border border-gray-200 hover:border-[#14B8A6] transition-all hover:shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-[#14B8A6]/10 to-[#0891b2]/10 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-[#14B8A6]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 p-6 bg-[#14B8A6]/10 border border-[#14B8A6]/30 rounded-xl">
            <p className="text-center text-[#0B1C2D] font-medium">
              ⚠️ Tất cả các gói đều có đầy đủ tính năng core
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              SkillForge hoạt động như thế nào
            </h2>
            <p className="text-xl text-gray-600">
              Quy trình đơn giản, hiệu quả trong 5 bước
            </p>
          </div>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-[#14B8A6] to-[#0891b2] hidden lg:block" style={{ width: '80%', left: '10%' }} />
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
              {[
                {
                  step: '01',
                  title: 'Tạo dự án',
                  description: 'Nhập thông tin cơ bản về dự án mới',
                },
                {
                  step: '02',
                  title: 'Upload mô tả / tài liệu',
                  description: 'Đính kèm tài liệu yêu cầu và mô tả chi tiết',
                },
                {
                  step: '03',
                  title: 'Đánh giá BSC & ưu tiên nguồn lực',
                  description: 'PM rà soát KPI, năng lực và mục tiêu chiến lược để phân công nhân sự',
                },
                {
                  step: '04',
                  title: 'Giao dự án',
                  description: 'Xác nhận và phân công đội ngũ vào dự án',
                },
                {
                  step: '05',
                  title: 'Theo dõi – phát triển – đánh giá',
                  description: 'Quản lý tiến độ và phát triển năng lực',
                },
              ].map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#14B8A6] to-[#0891b2] rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 shadow-lg relative z-10">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solutions by Role */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Giải pháp theo vai trò
            </h2>
            <p className="text-xl text-gray-600">
              Phù hợp với mọi cấp bậc trong tổ chức
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                role: 'Lãnh đạo',
                title: 'Tổng quan năng lực & ra quyết định',
                features: [
                  'Dashboard tổng quan toàn công ty',
                  'Báo cáo AI về hiệu suất và xu hướng',
                  'Phân tích năng lực tổ chức',
                  'KPI và metrics quan trọng',
                ],
                color: 'from-[#14B8A6] to-[#0891b2]',
              },
              {
                icon: Target,
                role: 'Quản lý',
                title: 'Theo dõi dự án & nhân sự',
                features: [
                  'Quản lý tiến độ dự án',
                  'Phân công công việc thông minh',
                  'Đánh giá hiệu suất đội ngũ',
                  'AI matching cho dự án mới',
                ],
                color: 'from-[#0891b2] to-[#0e7490]',
              },
              {
                icon: TrendingUp,
                role: 'Nhân viên',
                title: 'Lộ trình phát triển rõ ràng',
                features: [
                  'Hệ thống Level và XP động lực',
                  'Quest và Reward hàng ngày',
                  'Tracking kỹ năng cá nhân',
                  'Feedback và hướng dẫn từ AI',
                ],
                color: 'from-[#14B8A6] to-[#0891b2]',
              },
            ].map((solution, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-[#14B8A6] transition-all hover:shadow-2xl">
                <div className={`w-16 h-16 bg-gradient-to-br ${solution.color} rounded-xl flex items-center justify-center mb-6`}>
                  <solution.icon className="w-8 h-8 text-white" />
                </div>
                <div className="mb-2">
                  <span className="text-sm font-semibold text-[#14B8A6] uppercase tracking-wide">{solution.role}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{solution.title}</h3>
                <ul className="space-y-3">
                  {solution.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#14B8A6] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Bảng giá tham khảo
            </h2>
            <p className="text-xl text-gray-600 mb-2">
              Tất cả các gói đều có đầy đủ tính năng core
            </p>
            <p className="text-gray-500">
              Khác nhau ở quy mô & AI usage
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                name: 'Starter',
                price: '1.500.000đ',
                period: '/ tháng',
                users: '≤ 30 người dùng',
                ai: '300 AI request / tháng',
                color: 'border-[#10b981]',
                badge: null,
              },
              {
                name: 'Growth',
                price: '4.000.000đ',
                period: '/ tháng',
                users: '≤ 100 người dùng',
                ai: '1.000 AI request / tháng',
                color: 'border-[#f59e0b]',
                badge: 'Phổ biến',
              },
              {
                name: 'Scale',
                price: '8.000.000đ',
                period: '/ tháng',
                users: '≤ 200 người dùng',
                ai: '3.000 AI request / tháng',
                color: 'border-[#ef4444]',
                badge: null,
              },
              {
                name: 'Enterprise',
                price: '15 – 25 triệu',
                period: '/ tháng',
                users: 'Không giới hạn người dùng',
                ai: '10.000+ AI request',
                color: 'border-[#14B8A6]',
                badge: 'Tùy chỉnh',
                features: ['SLA', 'Custom quota', 'API key riêng'],
              },
            ].map((plan, idx) => (
              <div 
                key={idx} 
                className={`bg-white rounded-2xl p-8 border-2 ${plan.color} hover:shadow-2xl transition-all relative ${plan.badge ? 'shadow-xl' : ''}`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 bg-[#f59e0b] text-white text-sm font-semibold rounded-full shadow-lg">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-600">
                    <Users className="w-5 h-5 text-[#14B8A6]" />
                    {plan.users}
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <Brain className="w-5 h-5 text-[#14B8A6]" />
                    {plan.ai}
                  </li>
                  {plan.features?.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-5 h-5 text-[#14B8A6]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full px-6 py-3 bg-gradient-to-r ${plan.color.replace('border-', 'from-')} to-transparent border-2 ${plan.color} text-gray-900 font-semibold rounded-xl hover:shadow-lg transition-all`}>
                  Chọn gói {plan.name}
                </button>
              </div>
            ))}
          </div>

          {/* Add-ons */}
          <div className="bg-gradient-to-br from-[#14B8A6]/10 to-[#0891b2]/10 rounded-2xl p-8 border border-[#14B8A6]/30">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Mua thêm AI request
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {[
                { amount: '+200 requests', price: '500.000đ' },
                { amount: '+500 requests', price: '1.200.000đ' },
                { amount: '+2.000 requests', price: '4.000.000đ' },
              ].map((addon, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-2">{addon.amount}</div>
                  <div className="text-[#14B8A6] font-semibold">{addon.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#0B1C2D] to-[#0B1C2D]/95 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Biến công việc hằng ngày thành<br />quá trình phát triển dài hạn
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            SkillForge không chỉ là công cụ quản lý công việc,<br />
            mà là nền tảng quản lý con người bằng AI
          </p>
          <button className="px-12 py-5 bg-[#14B8A6] text-white rounded-xl hover:bg-[#14B8A6]/90 transition-all flex items-center gap-3 shadow-2xl hover:shadow-3xl font-semibold text-lg mx-auto">
            Bắt đầu sử dụng SkillForge
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#14B8A6]" />
              <span className="text-xl font-bold text-gray-900">SkillForge</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">Về chúng tôi</a>
              <a href="#" className="hover:text-gray-900">Tính năng</a>
              <a href="#" className="hover:text-gray-900">Bảng giá</a>
              <a href="#" className="hover:text-gray-900">Liên hệ</a>
            </div>
            <div className="text-sm text-gray-500">
              © 2026 SkillForge. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
