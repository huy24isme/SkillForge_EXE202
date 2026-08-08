import { Users, TrendingUp, AlertCircle, Cpu, Megaphone, DollarSign, PenTool, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DEPARTMENTS = [
  {
    id: 'it',
    name: 'Công nghệ (IT)',
    icon: Cpu,
    headCount: 45,
    utilization: 92,
    topSkills: ['React', 'NodeJS', 'Python', 'AWS'],
    missingSkills: ['DevOps Senior', 'AI Engineer'],
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    aiSummary: 'Đội ngũ IT đang hoạt động gần tối đa công suất. Cần bổ sung nhân sự DevOps để giảm tải cho team Backend.'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: Megaphone,
    headCount: 20,
    utilization: 75,
    topSkills: ['SEO', 'Content', 'Ads', 'Branding'],
    missingSkills: ['Data Analyst'],
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    aiSummary: 'Hiệu suất ổn định. Chiến dịch Q3 đang cần thêm phân tích dữ liệu để tối ưu chi phí Ads.'
  },
  {
    id: 'sales',
    name: 'Kinh doanh (Sales)',
    icon: DollarSign,
    headCount: 35,
    utilization: 60,
    topSkills: ['B2B Sales', 'Negotiation', 'CRM'],
    missingSkills: [],
    color: 'text-green-500',
    bg: 'bg-green-50',
    aiSummary: 'Đội Sales đang có dư địa lớn (40% capacity chưa dùng). Đề xuất mở rộng thị trường miền Trung.'
  },
  {
    id: 'design',
    name: 'Thiết kế (Design)',
    icon: PenTool,
    headCount: 12,
    utilization: 88,
    topSkills: ['UI/UX', 'Graphic', 'Motion'],
    missingSkills: ['3D Artist'],
    color: 'text-pink-500',
    bg: 'bg-pink-50',
    aiSummary: 'Team Design đang quá tải nhẹ do hỗ trợ nhiều dự án Marketing. Cân nhắc outsource các task đơn giản.'
  }
];

export function ExecutivePersonnel() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="flex gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 flex-1">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0B1C2D]">112</div>
            <div className="text-sm text-slate-500">Tổng nhân sự</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 flex-1">
          <div className="p-3 bg-green-50 rounded-lg text-green-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0B1C2D]">78%</div>
            <div className="text-sm text-slate-500">Hiệu suất trung bình</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 flex-1">
          <div className="p-3 bg-red-50 rounded-lg text-red-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0B1C2D]">3</div>
            <div className="text-sm text-slate-500">Vị trí Nghiêm trọng thiếu</div>
          </div>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#0B1C2D]">Tổng quan các phòng ban</h2>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Tìm kiếm kỹ năng, nhân sự..." 
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#3AE7E1] w-64"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DEPARTMENTS.map((dept) => (
          <div 
            key={dept.id} 
            onClick={() => navigate(`/leadership/executive/personnel/${dept.id}`)}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${dept.bg} ${dept.color}`}>
                    <dept.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0B1C2D]">{dept.name}</h3>
                    <p className="text-sm text-slate-500">{dept.headCount} nhân sự</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${dept.utilization > 90 ? 'text-red-500' : 'text-[#0B1C2D]'}`}>
                    {dept.utilization}%
                  </div>
                  <div className="text-xs text-slate-400">Utilization</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Tải công việc</span>
                  <span className={`font-medium ${dept.utilization > 90 ? 'text-red-500' : 'text-slate-700'}`}>
                    {dept.utilization > 90 ? 'Quá tải' : 'Ổn định'}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${dept.utilization > 90 ? 'bg-red-500' : 'bg-[#3AE7E1]'}`} 
                    style={{ width: `${dept.utilization}%` }} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase">Top Skills</label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {dept.topSkills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-600">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                   <label className="text-xs font-semibold text-slate-400 uppercase">Missing Skills (AI)</label>
                   {dept.missingSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {dept.missingSkills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-red-50 border border-red-100 rounded text-xs font-medium text-red-600">
                            {skill}
                          </span>
                        ))}
                      </div>
                   ) : (
                     <div className="mt-2 text-xs text-green-600 font-medium flex items-center gap-1">
                       <TrendingUp className="w-3 h-3" /> Đầy đủ năng lực
                     </div>
                   )}
                </div>
              </div>

              {/* AI Insight Footer */}
              <div className="bg-[#0B1C2D] rounded-lg p-4 relative overflow-hidden group-hover:bg-[#13283C] transition-colors">
                 <div className="flex gap-3">
                   <div className="shrink-0 mt-0.5">
                     <div className="w-2 h-2 rounded-full bg-[#3AE7E1] animate-pulse" />
                   </div>
                   <div>
                     <p className="text-sm text-slate-300 leading-relaxed italic">"{dept.aiSummary}"</p>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
