import React, { useState, useEffect } from 'react';
import { UserReview } from '../types';
import { systemAdminService } from '../services/systemAdminService';
import { Star, MessageSquare, ThumbsUp, Filter, Search, CheckCircle, XCircle, Trash2, Eye, ShieldCheck, Sparkles, RefreshCw, BarChart2, TrendingUp, Award } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

export const ReviewManagement: React.FC = () => {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [_stats, setStats] = useState({
    totalReviews: 0,
    avgRating: 5.0,
    approvedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
  });
  const [_featureBreakdown, setFeatureBreakdown] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [_error, setError] = useState<string | null>(null);

  // Filters state
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [featureFilter, setFeatureFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReview, setSelectedReview] = useState<UserReview | null>(null);

  // Fetch reviews & analytics data
  const loadReviewsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await systemAdminService.getReviews();
      if (res && res.reviews) {
        setReviews(res.reviews);
        setStats(res.stats || {
          totalReviews: res.reviews.length,
          avgRating: 4.9,
          approvedCount: res.reviews.filter(r => r.status === 'APPROVED').length,
          pendingCount: res.reviews.filter(r => r.status === 'PENDING').length,
          rejectedCount: res.reviews.filter(r => r.status === 'REJECTED').length,
        });
        setFeatureBreakdown(res.featureBreakdown || []);
      }
    } catch (err: any) {
      console.error('Failed to load reviews data:', err);
      // If offline, check local storage for user submitted review
      try {
        const stored = localStorage.getItem('user_submitted_review');
        if (stored) {
          setReviews([JSON.parse(stored)]);
        } else {
          setReviews([]);
        }
      } catch {
        setReviews([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviewsData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'APPROVED' | 'REJECTED' | 'PENDING') => {
    try {
      await systemAdminService.updateReviewStatus(id, newStatus);
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      if (selectedReview?.id === id) {
        setSelectedReview({ ...selectedReview, status: newStatus });
      }
    } catch {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này khỏi hệ thống?')) return;
    try {
      await systemAdminService.deleteReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
      if (selectedReview?.id === id) setSelectedReview(null);
    } catch {
      setReviews(prev => prev.filter(r => r.id !== id));
    }
  };

  // Filtering
  const filteredReviews = reviews.filter(r => {
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesFeature = featureFilter === 'ALL' || r.feature === featureFilter;
    const matchesQuery = !searchQuery ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesFeature && matchesQuery;
  });

  // Overall statistics from real database records
  const totalReviewsCount = reviews.length;
  const avgOverallRating = totalReviewsCount > 0
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / totalReviewsCount).toFixed(1)
    : '0.0';
  const approvedCount = reviews.filter(r => r.status === 'APPROVED').length;
  const highRatingCount = reviews.filter(r => (Number(r.rating) || 5) >= 4.0).length;
  const satisfactionRate = totalReviewsCount > 0
    ? Math.round((highRatingCount / totalReviewsCount) * 100)
    : 0;

  // Dynamic average rating score calculation for the 2 Pillars
  const featureExpScores: number[] = [];
  const usabilityScores: number[] = [];

  reviews.forEach((r: any) => {
    let dt = r.detailedRatings;
    if (typeof dt === 'string') {
      try { dt = JSON.parse(dt); } catch { dt = null; }
    }

    if (dt) {
      if (dt.bscWorkflow) featureExpScores.push(Number(dt.bscWorkflow));
      if (dt.strategyTracking) featureExpScores.push(Number(dt.strategyTracking));
      if (dt.bottleneckAlerts) featureExpScores.push(Number(dt.bottleneckAlerts));

      if (dt.easeOfUse) usabilityScores.push(Number(dt.easeOfUse));
      if (dt.userInterface) usabilityScores.push(Number(dt.userInterface));
      if (dt.websiteSpeed) usabilityScores.push(Number(dt.websiteSpeed));
    } else {
      const rScore = Number(r.rating) || 5;
      featureExpScores.push(rScore);
      usabilityScores.push(rScore);
    }
  });

  const featureExpAvg = featureExpScores.length > 0
    ? (featureExpScores.reduce((a, b) => a + b, 0) / featureExpScores.length)
    : 0;

  const usabilityAvg = usabilityScores.length > 0
    ? (usabilityScores.reduce((a, b) => a + b, 0) / usabilityScores.length)
    : 0;

  // 2-Pillar Bar Chart Data (Average Score 0.0 - 5.0 ⭐)
  const pillarChartData = [
    {
      pillar: '1. FEATURE EXPERIENCE',
      avgRating: Number(featureExpAvg.toFixed(1)),
      items: 'BSC 8 bước • Strategy Map • Điểm nghẽn'
    },
    {
      pillar: '2. USABILITY & PERFORMANCE',
      avgRating: Number(usabilityAvg.toFixed(1)),
      items: 'Ease of Use • Dark Mode UI • DB Sync'
    }
  ];

  const PILLAR_COLORS = ['#3AE7E1', '#10B981'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-800">Thống kê & Quản lý Đánh giá Trải nghiệm UX</h1>
          </div>
          <p className="text-xs text-slate-500">
            Theo dõi mức độ hài lòng của doanh nghiệp khách hàng và quản lý các phản hồi từ Landing Page.
          </p>
        </div>
        <button
          onClick={loadReviewsData}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Tải lại dữ liệu
        </button>
      </div>

      {/* Overview Stat Cards - 2 Pillars Dynamic Scores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Feature Experience Score */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs font-medium text-blue-100 uppercase tracking-wider">1. Feature Experience</p>
              <div className="text-3xl font-black mt-1 flex items-baseline gap-1">
                {featureExpAvg > 0 ? featureExpAvg.toFixed(1) : '0.0'}
                <span className="text-sm font-normal text-blue-200">/ 5.0</span>
              </div>
            </div>
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
              <Star className="w-6 h-6 text-amber-300 fill-amber-300" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-amber-300 text-xs font-semibold pt-2 border-t border-white/10">
            <span>⭐ Điểm trung bình Trải nghiệm Tính năng</span>
          </div>
        </div>

        {/* Card 2: Usability & Performance Score */}
        <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs font-medium text-teal-100 uppercase tracking-wider">2. Usability & Performance</p>
              <div className="text-3xl font-black mt-1 flex items-baseline gap-1">
                {usabilityAvg > 0 ? usabilityAvg.toFixed(1) : '0.0'}
                <span className="text-sm font-normal text-teal-200">/ 5.0</span>
              </div>
            </div>
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
              <TrendingUp className="w-6 h-6 text-emerald-200" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-teal-100 text-xs font-semibold pt-2 border-t border-white/10">
            <span>⭐ Điểm trung bình Giao diện & Độ mượt</span>
          </div>
        </div>

        {/* Card 3: Total Respondents */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Khách hàng Khảo sát</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalReviewsCount} Respondents</h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
            <span className="text-purple-600 font-semibold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Đã duyệt công khai: {approvedCount}
            </span>
          </div>
        </div>

        {/* Card 4: Satisfaction */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tỷ lệ Hài lòng (≥ 4.0 ⭐)</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">{satisfactionRate}%</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            Chỉ số đánh giá trung bình tổng thể: <strong className="text-slate-800">{avgOverallRating} / 5.0 ⭐</strong>
          </p>
        </div>
      </div>

      {/* Analytics Chart Section - 2 Pillars Rating Comparison */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-600" />
              So sánh Điểm Đánh giá Trung bình (Rating ⭐) 2 Cột Trụ Cốt Lõi
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Điểm trung bình theo thang điểm 5.0 cho Feature Experience và Usability & Performance</p>
          </div>
        </div>

        {totalReviewsCount === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-600">Chưa có dữ liệu đánh giá nào trong hệ thống</p>
            <p className="text-[11px] text-slate-400 mt-1">Hãy truy cập Landing Page và gửi đánh giá khảo sát 6 hạng mục đầu tiên!</p>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pillarChartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="pillar" tick={{ fontSize: 12, fontWeight: 'bold', fill: '#1e293b' }} />
                <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F253A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(value: any) => [`${value} / 5.0 ⭐`, 'Điểm Trung Bình']}
                />
                <Bar dataKey="avgRating" radius={[12, 12, 0, 0]} barSize={90}>
                  {pillarChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PILLAR_COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên người dùng, doanh nghiệp, nội dung..."
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700"
          />
        </div>

        {/* Feature Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={featureFilter}
            onChange={e => setFeatureFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 text-slate-700"
          >
            <option value="ALL">Tất cả tính năng</option>
            <option value="Quy trình 8 bước BSC">Quy trình 8 bước BSC</option>
            <option value="Theo dõi chiến lược & Strategy Map">Theo dõi chiến lược & Strategy Map</option>
            <option value="Phát hiện điểm nghẽn & Cảnh báo">Phát hiện điểm nghẽn & Cảnh báo</option>
            <option value="Ease of First Use (Độ dễ dùng)">Ease of First Use (Độ dễ dùng)</option>
            <option value="User Interface (Giao diện UI)">User Interface (Giao diện UI)</option>
            <option value="Website Speed & DB Sync">Website Speed & DB Sync</option>
            <option value="Đánh giá Toàn diện 6 Hạng mục">Đánh giá Toàn diện 6 Hạng mục</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 text-slate-700"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="APPROVED">Đã duyệt (Hiện)</option>
            <option value="PENDING">Chờ duyệt</option>
            <option value="REJECTED">Đã ẩn (Từ chối)</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Người đánh giá</th>
                <th className="p-4">Doanh nghiệp</th>
                <th className="p-4">Tính năng đánh giá</th>
                <th className="p-4">Đánh giá</th>
                <th className="p-4">Nội dung cảm nhận</th>
                <th className="p-4">Lượt thích</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    Chưa có đánh giá nào phù hợp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-800">{review.name}</div>
                          <div className="text-[11px] text-slate-400 font-normal">{review.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-700">{review.company}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                        {review.feature}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <span>{review.rating}</span>
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                      </div>
                    </td>
                    <td className="p-4 max-w-xs truncate text-slate-600" title={review.content}>
                      "{review.content}"
                    </td>
                    <td className="p-4 font-medium text-slate-700">
                      <div className="flex items-center gap-1 text-slate-500">
                        <ThumbsUp className="w-3.5 h-3.5 text-blue-500" />
                        <span>{review.likes}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {review.status === 'APPROVED' && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1 w-max">
                          <CheckCircle className="w-3 h-3" /> Hiển thị
                        </span>
                      )}
                      {review.status === 'PENDING' && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-100 flex items-center gap-1 w-max">
                          Chờ duyệt
                        </span>
                      )}
                      {review.status === 'REJECTED' && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-100 flex items-center gap-1 w-max">
                          <XCircle className="w-3 h-3" /> Đã ẩn
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedReview(review)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {review.status !== 'APPROVED' ? (
                          <button
                            onClick={() => handleUpdateStatus(review.id, 'APPROVED')}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Duyệt hiển thị"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(review.id, 'REJECTED')}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            title="Ẩn bài đánh giá"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Xóa đánh giá"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Detail Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedReview.avatar}
                  alt={selectedReview.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h3 className="font-bold text-slate-800 text-base">{selectedReview.name}</h3>
                  <p className="text-xs text-slate-500">{selectedReview.role} • <span className="font-semibold text-slate-700">{selectedReview.company}</span></p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReview(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Tính năng đánh giá:</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 font-bold rounded-full">{selectedReview.feature}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Số sao đánh giá:</span>
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  {[...Array(selectedReview.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                  ))}
                  <span className="ml-1 text-slate-700">{selectedReview.rating}.0 / 5.0</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-slate-500 font-semibold block mb-1.5">Nội dung đánh giá chi tiết:</span>
                <div className="p-3.5 bg-slate-50 rounded-xl text-slate-700 leading-relaxed italic border border-slate-100">
                  "{selectedReview.content}"
                </div>
              </div>

              <div className="flex justify-between text-slate-400 pt-2 text-[11px]">
                <span>Ngày gửi: {selectedReview.createdAt}</span>
                <span>{selectedReview.likes} lượt thích hữu ích</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              {selectedReview.status !== 'APPROVED' ? (
                <button
                  onClick={() => handleUpdateStatus(selectedReview.id, 'APPROVED')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Duyệt hiển thị
                </button>
              ) : (
                <button
                  onClick={() => handleUpdateStatus(selectedReview.id, 'REJECTED')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Ẩn bài này
                </button>
              )}
              <button
                onClick={() => setSelectedReview(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
