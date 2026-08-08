import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, Zap, BarChart3, Users, Layers, Globe, Award, TrendingUp, Star, Target, Sparkles, ThumbsUp, Filter, Plus, Quote, X, Send } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import logo from '../assets/logo1.png';
import { FloatingContactButtons } from '../components/FloatingContactButtons';
import { API_PUBLIC_BASE } from '../config/api';


export function LandingPage() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Filter state for reviews
  const [selectedFeatureFilter, setSelectedFeatureFilter] = useState('Tất cả');

  // Write Review Modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    role: '',
    company: '',
    feature: 'Đánh giá Toàn diện 6 Hạng mục',
    rating: 5,
    comment: '',
  });
  const [itemRatings, setItemRatings] = useState({
    bscWorkflow: 5,
    strategyTracking: 5,
    bottleneckAlerts: 5,
    easeOfUse: 5,
    userInterface: 5,
    websiteSpeed: 5,
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Reviews dataset based on actual frontend BSC features
  const [reviewsList, setReviewsList] = useState<any[]>([
    {
      id: '1',
      name: 'Trịnh Hoàng Nam',
      role: 'CEO & Founder',
      company: 'Logistics Sài Gòn',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      feature: 'Bản đồ Chiến lược B4',
      date: '02/08/2026',
      content: 'Giao diện Bản đồ chiến lược Strategy Map 4 viễn cảnh cực kỳ trực quan và sinh động! Trước đây chúng tôi mất cả tuần để phổ biến mục tiêu chiến lược cho các phòng ban. Bây giờ chỉ cần mở SkillForge, cả đội ngũ đều thấy rõ mối liên hệ giữa Tài chính, Khách hàng, Quy trình và Học tập phát triển.',
      verified: true,
      likes: 38
    },
    {
      id: '2',
      name: 'Phạm Thu Thảo',
      role: 'Giám đốc Tài chính (CFO)',
      company: 'Tập đoàn Bán lẻ Vinamart',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      feature: 'Cây KPI & Cảnh báo B7',
      date: '28/07/2026',
      content: 'Tính năng tự động tính toán % hoàn thành và cảnh báo theo mã màu (Xanh / Vàng / Đỏ) ở bước B7 giúp tôi phát hiện ngay lập tức các chỉ số tài chính đang rủi ro mà không cần mở hàng chục sheet Excel phức tạp. Thao tác siêu mượt!',
      verified: true,
      likes: 29
    },
    {
      id: '3',
      name: 'Lê Minh Tuấn',
      role: 'Trưởng phòng Sản xuất',
      company: 'TechCorp Việt Nam',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      feature: 'Biểu đồ Xương cá B5',
      date: '25/07/2026',
      content: 'Mô hình Xương cá (Fishbone Diagram) ở bước B5 phân tích nguyên nhân - kết quả theo 6M cho Trưởng phòng rất chuyên nghiệp. Việc liên kết trực tiếp từ nguyên nhân sang Kế hoạch hành động B8 và đẩy qua Bảng Kanban nhân viên giúp phòng ban tôi nâng cao 40% hiệu suất làm việc.',
      verified: true,
      likes: 44
    },
    {
      id: '4',
      name: 'Nguyễn Khánh Linh',
      role: 'Giám đốc Vận hành & HR',
      company: 'Innova Software Solutions',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      feature: 'Phân tích SWOT & 7S B2',
      date: '18/07/2026',
      content: 'Trải nghiệm làm chiến lược B2 với các tab McKinsey 7S, 5 Áp lực cạnh tranh và PESTEL tự động sync sang ma trận SWOT vô cùng thông minh. Thao tác tick chọn mượt mà, lưu ngay vào DB mà không sợ mất dữ liệu khi F5.',
      verified: true,
      likes: 31
    },
    {
      id: '5',
      name: 'Đỗ Hoàng Long',
      role: 'Giám đốc Chiến lược',
      company: 'EcoFarm Group',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      feature: 'Trợ lý AI Phân tích',
      date: '12/07/2026',
      content: 'Trợ lý AI tự động phát hiện điểm nghẽn và đưa ra khuyến nghị hành động khắc phục rất thông minh. Tone màu tối (Dark Mode) hiện đại chuẩn SaaS quốc tế, font chữ sắc nét và độ phản hồi cực nhanh làm tôi ấn tượng ngay từ lần trải nghiệm đầu tiên.',
      verified: true,
      likes: 52
    },
    {
      id: '6',
      name: 'Trần Quốc Bảo',
      role: 'Chủ tịch HĐQT',
      company: 'Chuỗi F&B Gourmet',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      feature: 'Bảng Kanban B8',
      date: '05/07/2026',
      content: 'Chức năng giao việc và kéo thả công việc trên bảng Kanban B8 cho nhân viên vô cùng dễ dùng. Nhân viên không cần đào tạo cũng sử dụng thành thạo ngay trong ngày đầu tiên. Đội ngũ tư vấn SkillForge hỗ trợ rất nhiệt tình!',
      verified: true,
      likes: 26
    }
  ]);

  // Helper to load local reviews from localStorage
  const getLocalUserReviews = () => {
    try {
      const raw = localStorage.getItem('skillforge_user_reviews');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveLocalUserReview = (newReview: any) => {
    try {
      const current = getLocalUserReviews();
      const updated = [newReview, ...current.filter((r: any) => String(r.id) !== String(newReview.id))];
      localStorage.setItem('skillforge_user_reviews', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Fetch live reviews from Backend DB on mount (DB is single source of truth for approved reviews)
  useEffect(() => {
    fetch(`${API_PUBLIC_BASE}/reviews`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setReviewsList(data.data.map((r: any) => ({ ...r, verified: true })));
        }
      })
      .catch(() => {
        // Fallback to local storage if API offline
        const localUserRevs = getLocalUserReviews();
        if (localUserRevs.length > 0) {
          setReviewsList(prev => {
            const existingIds = new Set(prev.map((r: any) => String(r.id)));
            const uniqueLocal = localUserRevs.filter((r: any) => !existingIds.has(String(r.id)));
            return [...uniqueLocal, ...prev];
          });
        }
      });
  }, []);

  const scrollToPricing = () => {
    const pricingElement = document.getElementById('pricing');
    if (pricingElement) {
      pricingElement.scrollIntoView({ behavior: 'smooth' });
    }
  };



  return (
    <>
      <div className="min-h-screen bg-[#0B1C2D] text-white font-sans selection:bg-[#3AE7E1] selection:text-[#0B1C2D] overflow-x-hidden">
        {/* Animated Background Particles */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#3AE7E1] rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0.2
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: 'linear',
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Header */}
        <motion.header
          className="fixed top-0 left-0 right-0 z-50 bg-[#0B1C2D]/80 backdrop-blur-md border-b border-white/10"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <motion.img
                src={logo}
                alt="SkillForge Logo"
                className="h-12 w-auto object-contain mix-blend-screen"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              />
            </Link>
            <motion.nav
              className="hidden md:flex items-center gap-8 text-sm font-medium text-shadow-slate-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <a href="#problem" className="hover:text-[#3AE7E1] transition-colors">Vấn đề</a>
              <a href="#solution" className="hover:text-[#3AE7E1] transition-colors">Giải pháp</a>
              <a href="#reviews" className="hover:text-[#3AE7E1] transition-colors">Đánh giá UX</a>
              <a href="#pricing" className="hover:text-[#3AE7E1] transition-colors">Bảng giá</a>
            </motion.nav>
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <a href="#solution" className="hidden md:block text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Khám phá
              </a>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button
                  type="button"
                  onClick={scrollToPricing}
                  className="px-5 py-2.5 bg-[#3AE7E1] text-[#0B1C2D] text-sm font-bold rounded-lg hover:shadow-[0_0_20px_rgba(58,231,225,0.4)] transition-all inline-block cursor-pointer"
                >
                  Bắt đầu ngay
                </button>
              </motion.div>
            </motion.div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 relative overflow-hidden">
          {/* Animated Gradient Background */}
          <motion.div
            className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#3AE7E1]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#2563EB]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.05, 0.12, 0.05],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />


          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#3AE7E1] text-xs font-bold uppercase tracking-wider mb-6"
                whileHover={{ scale: 1.05, borderColor: 'rgba(58, 231, 225, 0.5)' }}
              >
                <Zap className="w-3 h-3" /> PM 4.0 Platform
              </motion.div>
              <motion.h1
                className="text-5xl lg:text-7xl font-bold leading-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Thực thi hóa <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3AE7E1] to-[#2563EB]">
                  Triết lý BSC
                </span>
              </motion.h1>
              <motion.p
                className="text-lg text-slate-400 mb-8 max-w-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Nền tảng quản trị chiến lược Top-down duy nhất tại Việt Nam biến triết lý Balanced Scorecard thành số liệu thực tế, giúp CEO SME kiểm soát toàn diện doanh nghiệp.
              </motion.p>
              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a
                    href="#solution"
                    className="px-8 py-4 bg-gradient-to-r from-[#3AE7E1] to-[#2563EB] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                  >
                    Khám phá Tính năng
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </motion.div>
                <motion.div
                  className="px-8 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                  whileHover={{ scale: 1.05, borderColor: 'rgba(58, 231, 225, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a href="#pricing" className="flex items-center gap-2">
                    Xem Bảng giá
                  </a>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Dashboard Preview Simulation with Animation */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-[#3AE7E1] to-[#2563EB] rounded-2xl blur-2xl opacity-20"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="relative bg-[#0F253A] border border-white/10 rounded-2xl p-6 shadow-2xl"
                whileHover={{ scale: 1.02, borderColor: 'rgba(58, 231, 225, 0.3)' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {/* Fake Dashboard UI */}
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                  <div className="flex gap-2">
                    <motion.div
                      className="w-3 h-3 rounded-full bg-red-500"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                      className="w-3 h-3 rounded-full bg-yellow-500"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                    />
                    <motion.div
                      className="w-3 h-3 rounded-full bg-green-500"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    />
                  </div>
                  <motion.div
                    className="h-2 w-32 bg-white/10 rounded-full overflow-hidden"
                  >
                    <motion.div
                      className="h-full bg-[#3AE7E1] rounded-full"
                      animate={{ x: ['-100%', '300%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                  </motion.div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      className="bg-white/5 p-4 rounded-lg border border-white/5"
                      whileHover={{ scale: 1.05, borderColor: 'rgba(58, 231, 225, 0.2)' }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <motion.div
                        className="h-8 w-8 rounded bg-[#3AE7E1]/20 mb-3"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                      />
                      <div className="h-2 w-16 bg-white/20 rounded mb-2" />
                      <div className="h-4 w-12 bg-white/10 rounded" />
                    </motion.div>
                  ))}
                </div>
                <div className="flex gap-4">
                  <div className="w-2/3 bg-white/5 rounded-lg h-32 border border-white/5 p-4">
                    <div className="flex items-end gap-2 h-full">
                      {[40, 60, 35, 70, 50, 80, 65].map((h, i) => (
                        <motion.div
                          key={i}
                          style={{ height: `${h}%` }}
                          className="flex-1 bg-gradient-to-t from-[#3AE7E1]/50 to-[#3AE7E1] rounded-t-sm"
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 1, delay: 1 + i * 0.1, ease: 'easeOut' }}
                          whileHover={{ scale: 1.1 }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="w-1/3 space-y-3">
                    {[1, 2, 3].map(i => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-3 bg-white/5 p-2 rounded border border-white/5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.5 + i * 0.1 }}
                        whileHover={{ scale: 1.05, borderColor: 'rgba(58, 231, 225, 0.2)' }}
                      >
                        <motion.div
                          className="w-6 h-6 rounded-full bg-slate-600"
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: i * 0.5 }}
                        />
                        <div className="h-2 w-full bg-white/10 rounded" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Animated World Map Section */}
          <motion.div
            className="max-w-7xl mx-auto mt-24 relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12">
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#3AE7E1] text-xs font-bold uppercase tracking-wider mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <Globe className="w-3 h-3" /> Global Presence
              </motion.div>
              <h3 className="text-2xl md:text-3xl font-bold">Được tin dùng trên toàn cầu</h3>
            </div>

            <div className="relative h-[400px] bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
              {/* World Map Grid */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 1000 400">
                  {/* Grid lines */}
                  {[...Array(10)].map((_, i) => (
                    <motion.line
                      key={`h-${i}`}
                      x1="0"
                      y1={i * 40}
                      x2="1000"
                      y2={i * 40}
                      stroke="rgba(58, 231, 225, 0.2)"
                      strokeWidth="0.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: i * 0.1 }}
                    />
                  ))}
                  {[...Array(20)].map((_, i) => (
                    <motion.line
                      key={`v-${i}`}
                      x1={i * 50}
                      y1="0"
                      x2={i * 50}
                      y2="400"
                      stroke="rgba(58, 231, 225, 0.2)"
                      strokeWidth="0.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: i * 0.05 }}
                    />
                  ))}
                </svg>
              </div>

              {/* Animated Connection Lines */}
              <svg className="absolute inset-0 w-full h-full">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3AE7E1" stopOpacity="0" />
                    <stop offset="50%" stopColor="#3AE7E1" stopOpacity="1" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {[
                  { x1: 150, y1: 200, x2: 400, y2: 150 },
                  { x1: 400, y1: 150, x2: 650, y2: 180 },
                  { x1: 650, y1: 180, x2: 850, y2: 220 },
                  { x1: 200, y1: 280, x2: 500, y2: 260 },
                  { x1: 500, y1: 260, x2: 750, y2: 300 },
                ].map((line, idx) => (
                  <motion.line
                    key={idx}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      duration: 2,
                      delay: 2 + idx * 0.3,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  />
                ))}
              </svg>

              {/* Animated Location Markers */}
              {[
                { x: '15%', y: '50%', label: 'Americas', delay: 0 },
                { x: '40%', y: '37%', label: 'Europe', delay: 0.2 },
                { x: '65%', y: '45%', label: 'Asia', delay: 0.4 },
                { x: '85%', y: '55%', label: 'Pacific', delay: 0.6 },
              ].map((location, idx) => (
                <motion.div
                  key={idx}
                  className="absolute"
                  style={{ left: location.x, top: location.y }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 2.5 + location.delay,
                    type: 'spring',
                    stiffness: 200,
                  }}
                >
                  <div className="relative">
                    {/* Pulse effect */}
                    <motion.div
                      className="absolute inset-0 -m-3 bg-[#3AE7E1] rounded-full"
                      animate={{
                        scale: [1, 2, 2],
                        opacity: [0.5, 0, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: location.delay,
                      }}
                    />
                    {/* Main marker */}
                    <motion.div
                      className="w-4 h-4 bg-[#3AE7E1] rounded-full shadow-lg shadow-[#3AE7E1]/50 relative z-10"
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: location.delay,
                      }}
                    />
                    {/* Label */}
                    <motion.div
                      className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0B1C2D]/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold border border-[#3AE7E1]/30"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 3 + location.delay }}
                    >
                      {location.label}
                    </motion.div>
                  </div>
                </motion.div>
              ))}

              {/* Floating data particles */}
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-[#3AE7E1]/50 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                  animate={{
                    x: [0, Math.random() * 100 - 50],
                    y: [0, Math.random() * 100 - 50],
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <motion.section
          className="py-12 border-y border-white/5 bg-[#0F253A]/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Doanh nghiệp tin dùng', value: '500+' },
              { label: 'Dự án quản lý', value: '12k' },
              { label: 'Nhân sự Active', value: '85k' },
              { label: 'Tỷ lệ hài lòng', value: '98%' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <motion.div
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 + 0.3, type: 'spring', stiffness: 200 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-[#3AE7E1] uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Logo Marquee - Trusted Partners */}
        <section className="mt-8 py-16 bg-[#0B1C2D] relative overflow-hidden">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 mb-3">
              <motion.span
                className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#3AE7E1]/10 border border-[#3AE7E1]/30 text-[#3AE7E1] text-sm font-bold"
                animate={{ boxShadow: ['0 0 8px rgba(58,231,225,0.2)', '0 0 16px rgba(58,231,225,0.4)', '0 0 8px rgba(58,231,225,0.2)'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                500+
              </motion.span>
              <span className="text-slate-300 text-sm md:text-base font-medium">
                doanh nghiệp đã tin dùng <span className="text-[#3AE7E1] font-bold">SkillForge</span>
              </span>
            </div>
          </motion.div>

          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-[#0B1C2D] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-[#0B1C2D] to-transparent" />

          {/* Row 1 - scroll left */}
          <div className="mb-6 overflow-hidden">
            <motion.div
              className="flex items-center gap-16 w-max"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              {[...Array(2)].flatMap((_, dupeIdx) =>
                [
                  'ACB', 'VietjetAir', '247Express', 'Nippon Express', 'WinCommerce',
                  'VTVcab', 'PetroVietnam', 'FPT Software', 'Viettel', 'Masan Group',
                ].map((name, i) => (
                  <div
                    key={`r1-${dupeIdx}-${i}`}
                    className="flex-shrink-0 flex items-center justify-center h-14 px-8 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300 select-none"
                  >
                    <span className="text-[15px] font-bold tracking-wide text-slate-400 hover:text-white transition-colors whitespace-nowrap">
                      {name}
                    </span>
                  </div>
                ))
              )}
            </motion.div>
          </div>

          {/* Row 2 - scroll right */}
          <div className="overflow-hidden">
            <motion.div
              className="flex items-center gap-16 w-max"
              animate={{ x: ['-50%', '0%'] }}
              transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
            >
              {[...Array(2)].flatMap((_, dupeIdx) =>
                [
                  'Jollibee', 'Thaihabooks', 'Vingroup', 'Techcombank', 'CỘNG Cà Phê',
                  'ITviec', 'Stella', 'MoMo', 'VNPay', 'Shopee Vietnam',
                ].map((name, i) => (
                  <div
                    key={`r2-${dupeIdx}-${i}`}
                    className="flex-shrink-0 flex items-center justify-center h-14 px-8 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300 select-none"
                  >
                    <span className="text-[15px] font-bold tracking-wide text-slate-400 hover:text-white transition-colors whitespace-nowrap">
                      {name}
                    </span>
                  </div>
                ))
              )}
            </motion.div>
          </div>
        </section>

        {/* Solution Section */}
        <section id="solution" className="py-24 px-6 relative overflow-hidden">
          {/* Background decoration */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3AE7E1]/5 rounded-full blur-[100px] pointer-events-none"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Giải pháp Quản trị Chiến lược Cốt lõi
              </motion.h2>
              <motion.p
                className="text-slate-400 max-w-3xl mx-auto text-base leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Biến triết lý BSC thành hành động cụ thể, quy tụ dữ liệu rời rạc và cung cấp cho sếp góc nhìn toàn cảnh để ra quyết định tức thì.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Target,
                  title: 'Thẻ điểm cân bằng (BSC 4 Góc độ)',
                  tag: 'Tài chính • Khách hàng • Quy trình • Con người',
                  desc: 'Nếu chỉ nhìn doanh thu, bạn mới thấy 1/4 sức khỏe công ty. SkillForge nối liền chuỗi: Chiến lược ➔ Mục tiêu ➔ Chỉ số ➔ Tiến độ ➔ Hành động cụ thể giúp đánh giá toàn diện doanh nghiệp.',
                  gradient: 'from-[#3AE7E1]/20 to-[#2563EB]/20',
                },
                {
                  icon: Layers,
                  title: 'Góc nhìn Dữ liệu Toàn cảnh',
                  tag: 'Xoá bỏ 20 file Excel rời rạc',
                  desc: 'Thay vì dữ liệu nằm tan tác ở Kế toán, Sales, Marketing làm sếp phải tự "chắp vá", SkillForge đưa mọi dòng dữ liệu về một màn hình duy nhất. Không còn đoán mò hay chờ đợi báo cáo.',
                  gradient: 'from-[#2563EB]/20 to-[#9333EA]/20',
                },
                {
                  icon: Zap,
                  title: 'Dashboard Ra quyết định 3 Giây',
                  tag: 'Bắt trọn điểm nghẽn từ sớm',
                  desc: 'Báo cáo xịn là phải thấy ngay việc nào đang tắc, team nào sắp quá tải, khoản chi nào vượt mồi lửa. SkillForge giúp sếp nhìn ra vấn đề sớm hơn để chốt quyết định nhanh và chính xác.',
                  gradient: 'from-[#9333EA]/20 to-[#3AE7E1]/20',
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className={`bg-gradient-to-br ${item.gradient} backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-[#3AE7E1]/50 transition-all group relative overflow-hidden flex flex-col justify-between`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: idx * 0.15, duration: 0.6 }}
                  whileHover={{
                    scale: 1.03,
                    y: -8,
                    boxShadow: '0 20px 40px rgba(58, 231, 225, 0.2)',
                  }}
                >
                  {/* Animated background overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-[#3AE7E1]/0 to-[#2563EB]/0 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                    whileHover={{
                      background: 'linear-gradient(to bottom right, rgba(58, 231, 225, 0.1), rgba(37, 99, 235, 0.1))'
                    }}
                  />

                  <div>
                    <motion.div
                      className="w-14 h-14 rounded-xl bg-[#0B1C2D] border border-white/10 flex items-center justify-center mb-6 relative z-10"
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
                    >
                      <item.icon className="w-7 h-7 text-[#3AE7E1]" />
                    </motion.div>

                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#3AE7E1] bg-[#3AE7E1]/10 px-3 py-1 rounded-full mb-3 relative z-10">
                      {item.tag}
                    </span>

                    <h3 className="text-xl font-bold text-white mb-3 relative z-10">{item.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed relative z-10">{item.desc}</p>
                  </div>

                  {/* Animated corner accent */}
                  <motion.div
                    className="absolute top-0 right-0 w-20 h-20 bg-[#3AE7E1]/10 rounded-bl-full pointer-events-none"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials & UX Rating Section */}
        <section id="reviews" className="py-24 px-6 bg-[#0B1C2D] relative overflow-hidden border-t border-white/5">
          {/* Ambient background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3AE7E1]/5 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Section Header */}
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3AE7E1]/10 border border-[#3AE7E1]/30 text-[#3AE7E1] text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Đánh giá từ Doanh nghiệp
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-white">
                Trải Nghiệm Sử Dụng Nền Tảng <span className="bg-gradient-to-r from-[#3AE7E1] via-cyan-300 to-blue-500 bg-clip-text text-transparent">SkillForge</span>
              </h2>
              <p className="text-slate-400 text-base leading-relaxed">
                Khám phá đánh giá thực tế từ các CEO, Giám đốc Chiến lược và Trưởng phòng về giao diện, tính năng và hiệu quả vận hành của SkillForge.
              </p>
            </motion.div>

            {/* Overall Rating Stats Card */}
            <motion.div
              className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 mb-12 shadow-2xl backdrop-blur-xl relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-white/10">
                {/* Score */}
                <div className="flex flex-col items-center justify-center p-4">
                  <div className="text-5xl font-black bg-gradient-to-r from-[#3AE7E1] to-blue-400 bg-clip-text text-transparent mb-1">
                    4.9<span className="text-2xl font-normal text-slate-400">/5.0</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400 stroke-amber-400" style={{ fill: '#FBBF24', color: '#FBBF24' }} />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Dựa trên 120+ đánh giá doanh nghiệp</span>
                </div>

                {/* Metric 1 */}
                <div className="p-4 md:pl-8 flex flex-col justify-center">
                  <div className="text-3xl font-bold text-white mb-1">99.4%</div>
                  <div className="text-xs font-semibold text-[#3AE7E1] uppercase tracking-wider mb-1">Đánh giá Hài lòng UI/UX</div>
                  <div className="text-xs text-slate-400">Giao diện trực quan, dễ thao tác ngay lần đầu</div>
                </div>

                {/* Metric 2 */}
                <div className="p-4 md:pl-8 flex flex-col justify-center">
                  <div className="text-3xl font-bold text-white mb-1">100%</div>
                  <div className="text-xs font-semibold text-[#3AE7E1] uppercase tracking-wider mb-1">Đồng bộ dữ liệu Realtime</div>
                  <div className="text-xs text-slate-400">Lưu cơ sở dữ liệu tức thì, không mất tin khi F5</div>
                </div>

                {/* Metric 3: Write review button */}
                <div className="p-4 md:pl-8 flex flex-col justify-center items-center">
                  <motion.button
                    type="button"
                    onClick={() => setIsReviewModalOpen(true)}
                    className="px-6 py-3 bg-[#3AE7E1] text-[#0B1C2D] font-bold text-xs rounded-xl shadow-[0_0_25px_rgba(58,231,225,0.3)] hover:shadow-[0_0_35px_rgba(58,231,225,0.5)] transition-all flex items-center gap-2 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-4 h-4" />
                    Viết Đánh Giá Trải Nghiệm
                  </motion.button>
                  <span className="text-[11px] text-slate-400 mt-2">Chia sẻ cảm nhận của doanh nghiệp bạn</span>
                </div>
              </div>
            </motion.div>

            {/* Feature Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#3AE7E1]" /> Lọc theo tính năng:
              </span>
              {[
                'Tất cả',
                'Quy trình 8 bước BSC',
                'Theo dõi chiến lược & Strategy Map',
                'Phát hiện điểm nghẽn & Cảnh báo',
                'Ease of First Use (Độ dễ dùng)',
                'User Interface (Giao diện UI)',
                'Website Speed & DB Sync'
              ].map((feat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedFeatureFilter(feat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${selectedFeatureFilter === feat
                    ? 'bg-[#3AE7E1] text-[#0B1C2D] border-[#3AE7E1] shadow-[0_0_15px_rgba(58,231,225,0.4)]'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/30 hover:bg-white/10'
                    }`}
                >
                  {feat}
                </button>
              ))}
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviewsList
                .filter(r => selectedFeatureFilter === 'Tất cả' || r.feature === selectedFeatureFilter)
                .map((review, idx) => (
                  <motion.div
                    key={review.id}
                    className="bg-[#0F253A]/95 border border-slate-700/60 hover:border-[#3AE7E1] rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 backdrop-blur-xl relative overflow-hidden group shadow-xl"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: idx * 0.08, duration: 0.5 }}
                    whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(58, 231, 225, 0.15)' }}
                  >
                    <div>
                      {/* Top Header: Feature badge & Date */}
                      <div className="flex justify-between items-center mb-4 gap-2">
                        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#3AE7E1]/15 border border-[#3AE7E1]/30 text-[#3AE7E1] shadow-sm">
                          {review.feature}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 shrink-0">{review.date}</span>
                      </div>

                      {/* Stars Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(Math.min(5, Math.max(1, Math.round(Number(review.rating) || 5))))].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400 stroke-amber-400" style={{ fill: '#FBBF24', color: '#FBBF24' }} />
                        ))}
                        <span className="text-xs font-bold text-amber-400 ml-1">{(Number(review.rating) || 5.0).toFixed(1)}</span>
                      </div>

                      {/* Content */}
                      <p className="text-slate-200 text-xs leading-relaxed mb-6 font-normal">
                        "{review.content}"
                      </p>
                    </div>

                    {/* Author Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-[#3AE7E1]/40 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-white truncate">{review.name}</h4>
                            {review.verified && (
                              <CheckCircle className="w-3.5 h-3.5 text-[#3AE7E1] shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">{review.role} • <span className="text-slate-300 font-medium">{review.company}</span></p>
                        </div>
                      </div>

                      {/* Like button */}
                      <button
                        onClick={async () => {
                          setReviewsList(prev => prev.map(item => item.id === review.id ? { ...item, likes: item.likes + 1 } : item));
                          try {
                            await fetch(`${API_PUBLIC_BASE}/reviews/${review.id}/like`, { method: 'POST' });
                          } catch {
                            // ignore
                          }
                        }}
                        className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 hover:text-[#3AE7E1] bg-white/5 hover:bg-[#3AE7E1]/20 border border-white/10 hover:border-[#3AE7E1]/40 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ml-2"
                        title="Hữu ích"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{review.likes}</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </section>

        {/* Write Review Modal */}
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-lg">
            <motion.div
              className="bg-[#0B1C2D] border border-[#3AE7E1]/40 rounded-3xl p-5 md:p-6 max-w-lg w-full max-h-[82vh] flex flex-col min-h-0 shadow-[0_0_60px_rgba(58,231,225,0.2)] relative overflow-hidden text-white backdrop-blur-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* Top Decorative Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#3AE7E1]/15 rounded-full blur-3xl pointer-events-none" />

              {/* Modal Header */}
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-700/60 relative z-10 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-gradient-to-br from-[#3AE7E1]/20 to-blue-500/20 text-[#3AE7E1] rounded-xl border border-[#3AE7E1]/30 shadow-md">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white tracking-tight">Đánh Giá Trải Nghiệm SkillForge</h3>
                    <p className="text-[11px] text-slate-400 font-medium">Khảo sát 6 hạng mục tính năng & giao diện hệ thống</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsReviewModalOpen(false);
                    setReviewSubmitted(false);
                  }}
                  className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {reviewSubmitted ? (
                <div className="text-center py-10 space-y-4 flex-1 flex flex-col justify-center items-center min-h-0">
                  <div className="w-16 h-16 bg-[#3AE7E1]/20 text-[#3AE7E1] rounded-full flex items-center justify-center mx-auto border-2 border-[#3AE7E1]/50 shadow-[0_0_30px_rgba(58,231,225,0.3)] animate-bounce">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h4 className="text-lg font-extrabold text-white">Cảm ơn đánh giá toàn diện của bạn!</h4>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                    Ý kiến đóng góp của bạn giúp SkillForge ngày càng hoàn thiện trải nghiệm quản trị chiến lược cho cộng đồng doanh nghiệp Việt Nam.
                  </p>
                  <button
                    onClick={() => {
                      setIsReviewModalOpen(false);
                      setReviewSubmitted(false);
                    }}
                    className="px-8 py-2.5 bg-gradient-to-r from-[#3AE7E1] to-cyan-400 text-[#0B1C2D] font-extrabold text-xs rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(58,231,225,0.4)] transition-all cursor-pointer"
                  >
                    Đóng cửa sổ
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!reviewForm.name || !reviewForm.comment) return;

                    // Calculate average score across all 6 rated items
                    const avgScore = Math.round(
                      (itemRatings.bscWorkflow +
                        itemRatings.strategyTracking +
                        itemRatings.bottleneckAlerts +
                        itemRatings.easeOfUse +
                        itemRatings.userInterface +
                        itemRatings.websiteSpeed) / 6 * 10
                    ) / 10;

                    const payload = {
                      ...reviewForm,
                      rating: avgScore,
                      feature: 'Đánh giá Toàn diện 6 Hạng mục',
                      detailedRatings: itemRatings
                    };
                    
                    let createdRev: any = null;
                    try {
                      const res = await fetch(`${API_PUBLIC_BASE}/reviews`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                      });
                      const data = await res.json();
                      if (data.success && data.data) {
                        createdRev = { ...data.data, verified: true };
                      }
                    } catch {
                      // offline fallback
                    }

                    if (!createdRev) {
                      createdRev = {
                        id: String(Date.now()),
                        name: reviewForm.name,
                        role: reviewForm.role || 'Quản lý',
                        company: reviewForm.company || 'Doanh nghiệp SME',
                        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
                        rating: avgScore,
                        feature: 'Theo dõi chiến lược & Strategy Map',
                        date: new Date().toLocaleDateString('vi-VN'),
                        content: reviewForm.comment,
                        verified: true,
                        likes: 1
                      };
                    }

                    saveLocalUserReview(createdRev);
                    setReviewsList(prev => [createdRev, ...prev.filter(r => String(r.id) !== String(createdRev.id))]);
                    setReviewSubmitted(true);
                  }}
                  className="space-y-3.5 text-xs overflow-y-auto min-h-0 flex-1 pr-1.5"
                >
                  {/* User Profile Inputs (Vertical Stack & 2-Col subrow) */}
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1 text-[11px]">Họ và Tên *</label>
                      <input
                        type="text"
                        required
                        value={reviewForm.name}
                        onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })}
                        placeholder="Nguyễn Văn A"
                        className="w-full px-3 py-2 bg-[#0F253A] border border-slate-700/80 focus:border-[#3AE7E1] rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1 text-[11px]">Chức danh / Vai trò</label>
                        <input
                          type="text"
                          value={reviewForm.role}
                          onChange={e => setReviewForm({ ...reviewForm, role: e.target.value })}
                          placeholder="CEO / Trưởng phòng"
                          className="w-full px-3 py-2 bg-[#0F253A] border border-slate-700/80 focus:border-[#3AE7E1] rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1 text-[11px]">Tên Doanh nghiệp</label>
                        <input
                          type="text"
                          value={reviewForm.company}
                          onChange={e => setReviewForm({ ...reviewForm, company: e.target.value })}
                          placeholder="Công ty ABC"
                          className="w-full px-3 py-2 bg-[#0F253A] border border-slate-700/80 focus:border-[#3AE7E1] rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PILLAR 1: FEATURE EXPERIENCE (Vertical Stack) */}
                  <div className="bg-[#0F253A]/80 p-3 rounded-2xl border border-slate-700/60 space-y-2 shadow-md">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#3AE7E1]/10 border border-[#3AE7E1]/30 text-[#3AE7E1] text-[10px] font-extrabold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      1. FEATURE EXPERIENCE (Tính năng)
                    </div>

                    {/* Item 1 */}
                    <div className="flex items-center justify-between gap-2 bg-[#091624] border border-slate-800 hover:border-[#3AE7E1]/40 px-3 py-1.5 rounded-xl transition-all">
                      <span className="text-slate-200 font-semibold text-[11px] truncate">1. Quy trình 8 bước BSC</span>
                      <div className="flex items-center gap-1 shrink-0">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setItemRatings(prev => ({ ...prev, bscWorkflow: star }))}
                            className="p-0.5 cursor-pointer transition-transform hover:scale-125"
                          >
                            <Star className={`w-4 h-4 ${star <= itemRatings.bscWorkflow ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} style={{ fill: star <= itemRatings.bscWorkflow ? '#FBBF24' : 'transparent', color: star <= itemRatings.bscWorkflow ? '#FBBF24' : '#475569' }} />
                          </button>
                        ))}
                        <span className="text-[10px] font-bold text-amber-300 ml-1 w-6 text-right">{itemRatings.bscWorkflow}.0</span>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-center justify-between gap-2 bg-[#091624] border border-slate-800 hover:border-[#3AE7E1]/40 px-3 py-1.5 rounded-xl transition-all">
                      <span className="text-slate-200 font-semibold text-[11px] truncate">2. Theo dõi chiến lược & Strategy Map</span>
                      <div className="flex items-center gap-1 shrink-0">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setItemRatings(prev => ({ ...prev, strategyTracking: star }))}
                            className="p-0.5 cursor-pointer transition-transform hover:scale-125"
                          >
                            <Star className={`w-4 h-4 ${star <= itemRatings.strategyTracking ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} style={{ fill: star <= itemRatings.strategyTracking ? '#FBBF24' : 'transparent', color: star <= itemRatings.strategyTracking ? '#FBBF24' : '#475569' }} />
                          </button>
                        ))}
                        <span className="text-[10px] font-bold text-amber-300 ml-1 w-6 text-right">{itemRatings.strategyTracking}.0</span>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-center justify-between gap-2 bg-[#091624] border border-slate-800 hover:border-[#3AE7E1]/40 px-3 py-1.5 rounded-xl transition-all">
                      <span className="text-slate-200 font-semibold text-[11px] truncate">3. Phát hiện điểm nghẽn & Cảnh báo</span>
                      <div className="flex items-center gap-1 shrink-0">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setItemRatings(prev => ({ ...prev, bottleneckAlerts: star }))}
                            className="p-0.5 cursor-pointer transition-transform hover:scale-125"
                          >
                            <Star className={`w-4 h-4 ${star <= itemRatings.bottleneckAlerts ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} style={{ fill: star <= itemRatings.bottleneckAlerts ? '#FBBF24' : 'transparent', color: star <= itemRatings.bottleneckAlerts ? '#FBBF24' : '#475569' }} />
                          </button>
                        ))}
                        <span className="text-[10px] font-bold text-amber-300 ml-1 w-6 text-right">{itemRatings.bottleneckAlerts}.0</span>
                      </div>
                    </div>
                  </div>

                  {/* PILLAR 2: USABILITY & PERFORMANCE (Vertical Stack) */}
                  <div className="bg-[#0F253A]/80 p-3 rounded-2xl border border-slate-700/60 space-y-2 shadow-md">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-[10px] font-extrabold uppercase tracking-wider">
                      <Zap className="w-3 h-3" />
                      2. USABILITY & PERFORMANCE (Giao diện & Tốc độ)
                    </div>

                    {/* Item 4 */}
                    <div className="flex items-center justify-between gap-2 bg-[#091624] border border-slate-800 hover:border-[#3AE7E1]/40 px-3 py-1.5 rounded-xl transition-all">
                      <span className="text-slate-200 font-semibold text-[11px] truncate">4. Ease of First Use (Độ dễ dùng)</span>
                      <div className="flex items-center gap-1 shrink-0">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setItemRatings(prev => ({ ...prev, easeOfUse: star }))}
                            className="p-0.5 cursor-pointer transition-transform hover:scale-125"
                          >
                            <Star className={`w-4 h-4 ${star <= itemRatings.easeOfUse ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} style={{ fill: star <= itemRatings.easeOfUse ? '#FBBF24' : 'transparent', color: star <= itemRatings.easeOfUse ? '#FBBF24' : '#475569' }} />
                          </button>
                        ))}
                        <span className="text-[10px] font-bold text-amber-300 ml-1 w-6 text-right">{itemRatings.easeOfUse}.0</span>
                      </div>
                    </div>

                    {/* Item 5 */}
                    <div className="flex items-center justify-between gap-2 bg-[#091624] border border-slate-800 hover:border-[#3AE7E1]/40 px-3 py-1.5 rounded-xl transition-all">
                      <span className="text-slate-200 font-semibold text-[11px] truncate">5. User Interface (Giao diện UI)</span>
                      <div className="flex items-center gap-1 shrink-0">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setItemRatings(prev => ({ ...prev, userInterface: star }))}
                            className="p-0.5 cursor-pointer transition-transform hover:scale-125"
                          >
                            <Star className={`w-4 h-4 ${star <= itemRatings.userInterface ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} style={{ fill: star <= itemRatings.userInterface ? '#FBBF24' : 'transparent', color: star <= itemRatings.userInterface ? '#FBBF24' : '#475569' }} />
                          </button>
                        ))}
                        <span className="text-[10px] font-bold text-amber-300 ml-1 w-6 text-right">{itemRatings.userInterface}.0</span>
                      </div>
                    </div>

                    {/* Item 6 */}
                    <div className="flex items-center justify-between gap-2 bg-[#091624] border border-slate-800 hover:border-[#3AE7E1]/40 px-3 py-1.5 rounded-xl transition-all">
                      <span className="text-slate-200 font-semibold text-[11px] truncate">6. Website Speed & DB Sync</span>
                      <div className="flex items-center gap-1 shrink-0">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setItemRatings(prev => ({ ...prev, websiteSpeed: star }))}
                            className="p-0.5 cursor-pointer transition-transform hover:scale-125"
                          >
                            <Star className={`w-4 h-4 ${star <= itemRatings.websiteSpeed ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} style={{ fill: star <= itemRatings.websiteSpeed ? '#FBBF24' : 'transparent', color: star <= itemRatings.websiteSpeed ? '#FBBF24' : '#475569' }} />
                          </button>
                        ))}
                        <span className="text-[10px] font-bold text-amber-300 ml-1 w-6 text-right">{itemRatings.websiteSpeed}.0</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Score Banner */}
                  <div className="bg-gradient-to-r from-[#0F253A] via-[#091A2B] to-[#0F253A] border border-[#3AE7E1]/40 rounded-xl px-3.5 py-2 flex items-center justify-between shadow-sm my-1">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#3AE7E1]" />
                      <span className="text-slate-100 font-bold text-[11px]">Điểm Đánh Giá Trung Bình:</span>
                    </div>
                    <div className="flex items-center gap-1 bg-[#3AE7E1]/15 px-2.5 py-1 rounded-lg border border-[#3AE7E1]/30">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" style={{ fill: '#FBBF24', color: '#FBBF24' }} />
                      <span className="text-sm font-black text-amber-300">
                        {(
                          (itemRatings.bscWorkflow +
                            itemRatings.strategyTracking +
                            itemRatings.bottleneckAlerts +
                            itemRatings.easeOfUse +
                            itemRatings.userInterface +
                            itemRatings.websiteSpeed) / 6
                        ).toFixed(1)} / 5.0
                      </span>
                    </div>
                  </div>

                  {/* Qualitative Comments */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1 text-[11px]">Nội dung đóng góp & Cảm nhận *</label>
                    <textarea
                      required
                      rows={2}
                      value={reviewForm.comment}
                      onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      placeholder="Hãy nêu cảm nhận của bạn về sự tiện lợi, tính năng ấn tượng nhất hoặc các điểm cần cải thiện của SkillForge..."
                      className="w-full px-3 py-2 bg-[#0F253A] border border-slate-700/80 focus:border-[#3AE7E1] rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-[#3AE7E1] via-cyan-300 to-blue-500 text-[#0B1C2D] font-black text-xs rounded-xl shadow-[0_0_20px_rgba(58,231,225,0.3)] hover:shadow-[0_0_30px_rgba(58,231,225,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                  >
                    <Send className="w-4 h-4" />
                    Gửi Đánh Giá Của Bạn
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-6 bg-[#0F253A] relative overflow-hidden">
          {/* Animated background */}
          <motion.div
            className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#2563EB]/5 rounded-full blur-[100px] pointer-events-none"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#3AE7E1]/5 rounded-full blur-[100px] pointer-events-none"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Bảng giá linh hoạt
              </motion.h2>
              <motion.p
                className="text-slate-400"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Chọn gói phù hợp với quy mô doanh nghiệp của bạn.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  name: 'Gói Cơ Bản (Basic)',
                  price: '1.000.000 VNĐ',
                  unit: '/tháng',
                  features: [
                    'Đầy đủ 4 khía cạnh Thẻ điểm cân bằng (BSC)',
                    'Dashboard báo cáo quản trị tổng quan',
                    'Công cụ theo dõi & Đánh giá KPI tự động',
                    'Trợ lý AI hỗ trợ phân tích hiệu suất',
                    'Hỗ trợ kỹ thuật tiêu chuẩn (Standard Support)',
                  ],
                  popular: true,
                  ctaText: 'Đăng ký ngay',
                },
                {
                  name: 'Gói Tùy Chỉnh (Custom)',
                  price: 'Tùy chỉnh',
                  unit: '',
                  features: [
                    'Không giới hạn số lượng mục tiêu & KPI chiến lược',
                    'Tích hợp tùy biến CSDL & Hệ thống ERP/CRM của doanh nghiệp',
                    'Chuyên gia tư vấn tái cấu trúc BSC đồng hành riêng',
                    'Tính năng bảo mật nâng cao & Hạ tầng Cloud riêng',
                    'Hỗ trợ ưu tiên 24/7 cam kết SLA',
                  ],
                  popular: false,
                  ctaText: 'Liên hệ tư vấn',
                },
              ].map((plan, idx) => (
                <motion.div
                  key={idx}
                  className={`relative p-8 rounded-2xl border flex flex-col justify-between ${plan.popular
                    ? 'bg-[#0B1C2D] border-[#3AE7E1] shadow-[0_0_30px_rgba(58,231,225,0.15)] scale-105 z-10'
                    : 'bg-white/5 border-white/10'
                    }`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: idx * 0.15, duration: 0.6 }}
                  whileHover={{
                    y: -10,
                    scale: plan.popular ? 1.08 : 1.05,
                    boxShadow: plan.popular
                      ? '0 30px 60px rgba(58, 231, 225, 0.3)'
                      : '0 20px 40px rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {plan.popular && (
                    <motion.div
                      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#3AE7E1] text-[#0B1C2D] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      animate={{
                        boxShadow: [
                          '0 0 10px rgba(58, 231, 225, 0.5)',
                          '0 0 20px rgba(58, 231, 225, 0.8)',
                          '0 0 10px rgba(58, 231, 225, 0.5)',
                        ]
                      }}
                      transition={{
                        opacity: { delay: 0.5, duration: 0.6 },
                        y: { delay: 0.5, duration: 0.6 },
                        boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                      }}
                    >
                      Phổ biến nhất
                    </motion.div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <motion.div
                      className="text-3xl lg:text-4xl font-bold text-[#3AE7E1] mb-6 flex items-baseline gap-1"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + idx * 0.15, type: 'spring', stiffness: 200 }}
                    >
                      {plan.price}
                      {plan.unit && <span className="text-sm text-slate-400 font-normal">{plan.unit}</span>}
                    </motion.div>
                    <ul className="space-y-4 mb-8 flex-1">
                      {plan.features.map((feat, fIdx) => (
                        <motion.li
                          key={fIdx}
                          className="flex items-center gap-3 text-slate-300 text-sm"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + idx * 0.15 + fIdx * 0.1 }}
                        >
                          <CheckCircle className="w-4 h-4 text-[#3AE7E1] shrink-0" />
                          {feat}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  <motion.button
                    type="button"
                    onClick={() => {
                      if (plan.popular) {
                        navigate('/checkout?plan=basic');
                      } else {
                        navigate('/custom-plan');
                      }
                    }}
                    className={`w-full py-3.5 rounded-xl font-bold transition-all ${plan.popular
                      ? 'bg-[#3AE7E1] text-[#0B1C2D] hover:bg-[#34d3cd]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {plan.ctaText}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <motion.footer
          className="py-12 border-t border-white/10 text-center text-slate-500 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            &copy; 2026 SkillForge. All rights reserved.
          </motion.p>
        </motion.footer>
      </div>
      <FloatingContactButtons />
    </>
  );
}
