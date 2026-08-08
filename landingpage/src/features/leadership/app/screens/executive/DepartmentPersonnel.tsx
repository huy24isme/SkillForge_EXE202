import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  Search,
  Filter,
  Download,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  Award,
  Clock,
  Briefcase,
  Target,
  MoreVertical,
  UserCheck,
  UserX,
  Activity,
  ArrowLeft
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

// Mock data
const DEPARTMENTS = [
  { 
    id: 'it', 
    name: 'IT', 
    totalStaff: 45, 
    activeProjects: 8, 
    utilization: 92, 
    trend: 'up',
    color: '#3AE7E1',
    manager: 'Nguyễn Văn Minh'
  },
  { 
    id: 'marketing', 
    name: 'Marketing', 
    totalStaff: 28, 
    activeProjects: 5, 
    utilization: 75, 
    trend: 'up',
    color: '#8B5CF6',
    manager: 'Trần Thị Hương'
  },
  { 
    id: 'sales', 
    name: 'Sales', 
    totalStaff: 35, 
    activeProjects: 12, 
    utilization: 45, 
    trend: 'down',
    color: '#10B981',
    manager: 'Lê Quang Dũng'
  },
  { 
    id: 'design', 
    name: 'Design', 
    totalStaff: 18, 
    activeProjects: 6, 
    utilization: 88, 
    trend: 'up',
    color: '#F59E0B',
    manager: 'Phạm Thị Lan'
  },
  { 
    id: 'hr', 
    name: 'HR', 
    totalStaff: 12, 
    activeProjects: 3, 
    utilization: 30, 
    trend: 'stable',
    color: '#EC4899',
    manager: 'Hoàng Minh Tuấn'
  },
];

const STAFF_DATA = {
  it: [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      role: 'Senior Backend Developer',
      email: 'nguyenvana@company.com',
      phone: '0912345678',
      avatar: 'https://i.pravatar.cc/150?img=1',
      utilization: 95,
      currentProjects: 3,
      skills: ['Node.js', 'Python', 'AWS', 'Docker'],
      experience: '5 năm',
      performance: 4.8,
      availability: 'Quá tải'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      role: 'Frontend Developer',
      email: 'tranthib@company.com',
      phone: '0987654321',
      avatar: 'https://i.pravatar.cc/150?img=2',
      utilization: 85,
      currentProjects: 2,
      skills: ['React', 'TypeScript', 'Tailwind CSS'],
      experience: '3 năm',
      performance: 4.5,
      availability: 'Bận'
    },
    {
      id: 3,
      name: 'Lê Văn C',
      role: 'DevOps Engineer',
      email: 'levanc@company.com',
      phone: '0909123456',
      avatar: 'https://i.pravatar.cc/150?img=3',
      utilization: 60,
      currentProjects: 1,
      skills: ['Kubernetes', 'Jenkins', 'Terraform'],
      experience: '4 năm',
      performance: 4.6,
      availability: 'Sẵn sàng'
    },
    {
      id: 4,
      name: 'Phạm Thị D',
      role: 'QA Engineer',
      email: 'phamthid@company.com',
      phone: '0912987654',
      avatar: 'https://i.pravatar.cc/150?img=4',
      utilization: 70,
      currentProjects: 2,
      skills: ['Selenium', 'Jest', 'Cypress'],
      experience: '2 năm',
      performance: 4.3,
      availability: 'Sẵn sàng'
    },
    {
      id: 5,
      name: 'Hoàng Văn E',
      role: 'Full Stack Developer',
      email: 'hoangvane@company.com',
      phone: '0923456789',
      avatar: 'https://i.pravatar.cc/150?img=5',
      utilization: 100,
      currentProjects: 4,
      skills: ['React', 'Node.js', 'PostgreSQL'],
      experience: '6 năm',
      performance: 4.9,
      availability: 'Quá tải'
    },
  ],
  marketing: [
    {
      id: 6,
      name: 'Vũ Thị F',
      role: 'Content Manager',
      email: 'vuthif@company.com',
      phone: '0934567890',
      avatar: 'https://i.pravatar.cc/150?img=6',
      utilization: 80,
      currentProjects: 3,
      skills: ['Content Strategy', 'SEO', 'Copywriting'],
      experience: '4 năm',
      performance: 4.7,
      availability: 'Bận'
    },
    {
      id: 7,
      name: 'Đỗ Văn G',
      role: 'Digital Marketing Specialist',
      email: 'dovang@company.com',
      phone: '0945678901',
      avatar: 'https://i.pravatar.cc/150?img=7',
      utilization: 75,
      currentProjects: 2,
      skills: ['Google Ads', 'Facebook Ads', 'Analytics'],
      experience: '3 năm',
      performance: 4.4,
      availability: 'Bận'
    },
  ],
  sales: [
    {
      id: 8,
      name: 'Bùi Thị H',
      role: 'Senior Sales Executive',
      email: 'buithih@company.com',
      phone: '0956789012',
      avatar: 'https://i.pravatar.cc/150?img=8',
      utilization: 50,
      currentProjects: 1,
      skills: ['B2B Sales', 'Negotiation', 'CRM'],
      experience: '7 năm',
      performance: 4.8,
      availability: 'Sẵn sàng'
    },
  ],
  design: [
    {
      id: 9,
      name: 'Ngô Văn I',
      role: 'UI/UX Designer',
      email: 'ngovani@company.com',
      phone: '0967890123',
      avatar: 'https://i.pravatar.cc/150?img=9',
      utilization: 90,
      currentProjects: 4,
      skills: ['Figma', 'Adobe XD', 'User Research'],
      experience: '4 năm',
      performance: 4.6,
      availability: 'Quá tải'
    },
  ],
  hr: [
    {
      id: 10,
      name: 'Đinh Thị K',
      role: 'HR Manager',
      email: 'dinhthik@company.com',
      phone: '0978901234',
      avatar: 'https://i.pravatar.cc/150?img=10',
      utilization: 40,
      currentProjects: 2,
      skills: ['Recruitment', 'Employee Relations', 'Training'],
      experience: '6 năm',
      performance: 4.5,
      availability: 'Sẵn sàng'
    },
  ],
};

const UTILIZATION_HISTORY = [
  { month: 'T1', it: 85, marketing: 70, sales: 50, design: 82, hr: 25 },
  { month: 'T2', it: 88, marketing: 72, sales: 48, design: 85, hr: 28 },
  { month: 'T3', it: 90, marketing: 73, sales: 46, design: 86, hr: 29 },
  { month: 'T4', it: 92, marketing: 75, sales: 45, design: 88, hr: 30 },
];

const SKILL_DISTRIBUTION = [
  { skill: 'Technical', value: 85, fullMark: 100 },
  { skill: 'Communication', value: 75, fullMark: 100 },
  { skill: 'Leadership', value: 65, fullMark: 100 },
  { skill: 'Problem Solving', value: 80, fullMark: 100 },
  { skill: 'Teamwork', value: 90, fullMark: 100 },
];

export function DepartmentPersonnel() {
  const { deptId } = useParams<{ deptId: string }>();
  const navigate = useNavigate();
  
  // Find the department from URL param, default to first department
  const initialDept = DEPARTMENTS.find(d => d.id === deptId) || DEPARTMENTS[0];
  const [selectedDept, setSelectedDept] = useState(initialDept);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Update selected department when URL changes
  useEffect(() => {
    const dept = DEPARTMENTS.find(d => d.id === deptId);
    if (dept) {
      setSelectedDept(dept);
    }
  }, [deptId]);

  const currentStaff = STAFF_DATA[selectedDept.id as keyof typeof STAFF_DATA] || [];

  const filteredStaff = currentStaff.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'overload' && staff.utilization > 90) ||
                         (filterStatus === 'available' && staff.utilization < 70) ||
                         (filterStatus === 'busy' && staff.utilization >= 70 && staff.utilization <= 90);
    return matchesSearch && matchesFilter;
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Quá tải': return 'text-red-600 bg-red-50 border-red-200';
      case 'Bận': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Sẵn sàng': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate('/leadership/executive/personnel')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Quay lại tổng quan"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h1 className="text-3xl font-bold text-[#0B1C2D]">Quản lý nhân sự</h1>
          </div>
          <p className="text-slate-500 ml-14">Theo dõi chi tiết nhân sự theo từng phòng ban</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0B1C2D] text-white rounded-lg hover:bg-[#1E3A5F] transition-colors">
          <Download className="w-4 h-4" />
          <span>Xuất báo cáo</span>
        </button>
      </div>

      {/* Department Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {DEPARTMENTS.map((dept) => (
          <div
            key={dept.id}
            onClick={() => {
              setSelectedDept(dept);
              navigate(`/leadership/executive/personnel/${dept.id}`);
            }}
            className={`bg-white p-5 rounded-xl shadow-sm border-2 cursor-pointer transition-all hover:shadow-md ${
              selectedDept.id === dept.id 
                ? 'border-[#3AE7E1] ring-2 ring-[#3AE7E1]/20' 
                : 'border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${dept.color}20` }}>
                <Users className="w-5 h-5" style={{ color: dept.color }} />
              </div>
              {dept.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
              {dept.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
              {dept.trend === 'stable' && <Activity className="w-4 h-4 text-slate-400" />}
            </div>
            <h3 className="font-bold text-[#0B1C2D] text-lg mb-1">{dept.name}</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Nhân sự:</span>
                <span className="font-semibold">{dept.totalStaff}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tải:</span>
                <span className={`font-semibold ${
                  dept.utilization > 90 ? 'text-red-500' : 
                  dept.utilization > 70 ? 'text-orange-500' : 
                  'text-green-500'
                }`}>{dept.utilization}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Department Details Header */}
      <div className="bg-gradient-to-r from-[#0B1C2D] to-[#1E3A5F] rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Phòng {selectedDept.name}</h2>
            <p className="text-slate-300">Quản lý: {selectedDept.manager}</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center bg-white/10 px-6 py-3 rounded-lg backdrop-blur-sm">
              <div className="text-3xl font-bold text-[#3AE7E1]">{selectedDept.totalStaff}</div>
              <div className="text-sm text-slate-300 mt-1">Tổng nhân sự</div>
            </div>
            <div className="text-center bg-white/10 px-6 py-3 rounded-lg backdrop-blur-sm">
              <div className="text-3xl font-bold text-[#3AE7E1]">{selectedDept.activeProjects}</div>
              <div className="text-sm text-slate-300 mt-1">Dự án đang chạy</div>
            </div>
            <div className="text-center bg-white/10 px-6 py-3 rounded-lg backdrop-blur-sm">
              <div className="text-3xl font-bold text-[#3AE7E1]">{selectedDept.utilization}%</div>
              <div className="text-sm text-slate-300 mt-1">Mức sử dụng</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-[#0B1C2D] mb-4">Xu hướng tải công việc (4 tháng)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={UTILIZATION_HISTORY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fill: '#64748B' }} />
                <YAxis tick={{ fill: '#64748B' }} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey={selectedDept.id} 
                  name={selectedDept.name}
                  stroke={selectedDept.color} 
                  strokeWidth={3}
                  dot={{ fill: selectedDept.color, r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-[#0B1C2D] mb-4">Phân bổ kỹ năng trung bình</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={SKILL_DISTRIBUTION}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#64748B', fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748B' }} />
                <Radar 
                  name="Kỹ năng" 
                  dataKey="value" 
                  stroke={selectedDept.color} 
                  fill={selectedDept.color} 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm nhân viên theo tên hoặc vị trí..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3AE7E1]/50 focus:border-[#3AE7E1]"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'all' 
                  ? 'bg-[#0B1C2D] text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterStatus('available')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'available' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Sẵn sàng
            </button>
            <button
              onClick={() => setFilterStatus('busy')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'busy' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Bận
            </button>
            <button
              onClick={() => setFilterStatus('overload')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'overload' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Quá tải
            </button>
          </div>
        </div>
      </div>

      {/* Staff List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredStaff.map((staff) => (
          <div 
            key={staff.id} 
            className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4 flex-1">
                <img 
                  src={staff.avatar} 
                  alt={staff.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-100"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-[#0B1C2D]">{staff.name}</h3>
                      <p className="text-slate-600">{staff.role}</p>
                    </div>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="w-4 h-4" />
                      <span>{staff.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4" />
                      <span>{staff.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Briefcase className="w-4 h-4" />
                      <span>{staff.experience}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold">{staff.performance}/5.0</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 mb-4">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Mức tải hiện tại</div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              staff.utilization > 90 ? 'bg-red-500' :
                              staff.utilization > 70 ? 'bg-orange-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${staff.utilization}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-[#0B1C2D]">{staff.utilization}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Dự án đang làm</div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4 text-[#3AE7E1]" />
                        <span className="text-sm font-bold text-[#0B1C2D]">{staff.currentProjects} dự án</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Trạng thái</div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getAvailabilityColor(staff.availability)}`}>
                        {staff.availability}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500 mb-2">Kỹ năng chính</div>
                    <div className="flex flex-wrap gap-2">
                      {staff.skills.map((skill, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full hover:bg-slate-200 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">Không tìm thấy nhân viên</h3>
          <p className="text-slate-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}
    </div>
  );
}
