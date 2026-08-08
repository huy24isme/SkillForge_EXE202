import { useState } from 'react';
import {
    GraduationCap,
    TrendingUp,
    Users,
    Award,
    Brain,
    Sparkles,
    BookOpen,
    Target,
    ChevronUp,
    ChevronDown
} from 'lucide-react';
import {
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend
} from 'recharts';

// --- Dữ liệu nhân viên ---
const EMPLOYEES = [
    { id: 1, name: 'Nguyễn Văn A', team: 'Frontend', projectOutput: 8, timeSpent: 1.8, projectsDelivered: 5, skillGap: 'Cloud Security' },
    { id: 2, name: 'Lê Thị B', team: 'Backend', projectOutput: 5, timeSpent: 2.2, projectsDelivered: 3, skillGap: 'DevOps / CI-CD' },
    { id: 3, name: 'Trần Minh C', team: 'Mobile', projectOutput: 9, timeSpent: 2.0, projectsDelivered: 6, skillGap: null },
    { id: 4, name: 'Phạm Thu D', team: 'Design', projectOutput: 4, timeSpent: 2.5, projectsDelivered: 2, skillGap: 'Motion Design' },
    { id: 5, name: 'Hoàng Đức E', team: 'QA', projectOutput: 6, timeSpent: 2.0, projectsDelivered: 4, skillGap: 'Performance Testing' },
    { id: 6, name: 'Vũ Quang F', team: 'Backend', projectOutput: 3, timeSpent: 2.8, projectsDelivered: 2, skillGap: 'DevOps / CI-CD' },
];

// Productivity formula: project_output / time_spent
const calcProductivity = (output: number, time: number) =>
    Math.round((output / time) * 100) / 100;

const TEAM_RADAR = [
    { subject: 'Năng suất', Frontend: 90, Backend: 65, Mobile: 95, Design: 70, QA: 80 },
    { subject: 'Kỹ năng', Frontend: 85, Backend: 78, Mobile: 92, Design: 80, QA: 75 },
    { subject: 'Hài lòng', Frontend: 92, Backend: 85, Mobile: 88, Design: 95, QA: 90 },
    { subject: 'Đúng hạn', Frontend: 88, Backend: 72, Mobile: 90, Design: 82, QA: 85 },
    { subject: 'Chất lượng', Frontend: 87, Backend: 80, Mobile: 93, Design: 88, QA: 92 },
];

const TRAINING_PROGRAMS = [
    { name: 'Advanced React Patterns', enrolled: 12, progress: 75 },
    { name: 'DevOps & Kubernetes', enrolled: 8, progress: 45 },
    { name: 'AI Engineering Fundamentals', enrolled: 15, progress: 30 },
    { name: 'Cloud Security', enrolled: 6, progress: 60 },
];

export default function LearningGrowthPerspective() {
    const [sortBy, setSortBy] = useState<'productivity' | 'projects'>('productivity');

    const withProductivity = EMPLOYEES.map(e => ({
        ...e,
        productivity: calcProductivity(e.projectOutput, e.timeSpent),
    }));

    const sorted = [...withProductivity].sort((a, b) =>
        sortBy === 'productivity' ? b.productivity - a.productivity : b.projectsDelivered - a.projectsDelivered
    );

    const avgProductivity = (
        withProductivity.reduce((sum, e) => sum + e.productivity, 0) / withProductivity.length
    ).toFixed(2);

    const topPerformer = [...withProductivity].sort((a, b) => b.productivity - a.productivity)[0];
    const skillGaps = [...new Set(withProductivity.filter(e => e.skillGap).map(e => e.skillGap))];
    const trainingEnrollments = TRAINING_PROGRAMS.reduce((sum, t) => sum + t.enrolled, 0);

    const barData = sorted.map(e => ({
        name: e.name.split(' ').slice(-1)[0],
        'Chỉ số năng suất': e.productivity,
    }));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Năng suất TB</span>
                        <div className="p-1.5 bg-orange-50 rounded-lg"><TrendingUp className="w-4 h-4 text-orange-600" /></div>
                    </div>
                    <div className="text-3xl font-bold text-[#0B1C2D]">{avgProductivity}x</div>
                    <div className="text-xs text-green-500 mt-1 font-medium">+0.12 so với Q1</div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Top Performer</span>
                        <div className="p-1.5 bg-yellow-50 rounded-lg"><Award className="w-4 h-4 text-yellow-600" /></div>
                    </div>
                    <div className="text-base font-bold text-[#0B1C2D] leading-tight">{topPerformer.name}</div>
                    <div className="text-xs text-orange-500 mt-1 font-bold">{topPerformer.productivity}x năng suất</div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Kỹ năng thiếu</span>
                        <div className="p-1.5 bg-red-50 rounded-lg"><Brain className="w-4 h-4 text-red-600" /></div>
                    </div>
                    <div className="text-3xl font-bold text-red-600">{skillGaps.length}</div>
                    <div className="text-xs text-slate-400 mt-1">Cần đào tạo bổ sung</div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Đào tạo</span>
                        <div className="p-1.5 bg-blue-50 rounded-lg"><GraduationCap className="w-4 h-4 text-blue-600" /></div>
                    </div>
                    <div className="text-3xl font-bold text-[#0B1C2D]">{trainingEnrollments}</div>
                    <div className="text-xs text-blue-500 mt-1">nhân viên đang học</div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Productivity Bar Chart */}
                <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-[#0B1C2D] mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-orange-600" />
                        Chỉ số năng suất cá nhân
                    </h3>
                    <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis domain={[0, 5]} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}x`} />
                                <Tooltip
                                    formatter={(v: number | string) => `${v}x`}
                                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="Chỉ số năng suất" fill="#F97316" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Team Radar */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-[#0B1C2D] mb-4 flex items-center gap-2">
                        <Target className="w-4 h-4 text-orange-600" />
                        Hiệu suất team (Top 2)
                    </h3>
                    <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={TEAM_RADAR}>
                                <PolarGrid stroke="#f1f5f9" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 10 }} />
                                <Radar name="Frontend" dataKey="Frontend" stroke="#3AE7E1" fill="#3AE7E1" fillOpacity={0.15} strokeWidth={2} />
                                <Radar name="Mobile" dataKey="Mobile" stroke="#F97316" fill="#F97316" fillOpacity={0.15} strokeWidth={2} />
                                <Tooltip />
                                <Legend />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Employee Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-[#0B1C2D] flex items-center gap-2">
                        <Users className="w-5 h-5 text-orange-600" />
                        Ma trận hiệu suất nhân viên
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSortBy('productivity')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${sortBy === 'productivity' ? 'bg-orange-600 text-white' : 'bg-slate-50 border border-slate-100 text-slate-600'}`}
                        >
                            Năng suất
                        </button>
                        <button
                            onClick={() => setSortBy('projects')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${sortBy === 'projects' ? 'bg-orange-600 text-white' : 'bg-slate-50 border border-slate-100 text-slate-600'}`}
                        >
                            Dự án
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase font-bold tracking-wider">
                                <th className="text-left px-5 py-3">Nhân viên</th>
                                <th className="text-left px-5 py-3">Team</th>
                                <th className="text-center px-5 py-3">
                                    <span className="flex items-center gap-1 justify-center">
                                        Điểm năng suất
                                        {sortBy === 'productivity' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                                    </span>
                                </th>
                                <th className="text-center px-5 py-3">DAs hoàn thành</th>
                                <th className="text-center px-5 py-3">Kỹ năng thiếu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map((emp, idx) => (
                                <tr key={emp.id} className="border-b last:border-b-0 border-slate-50 hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-600'}`}>
                                                {idx === 0 ? '🏆' : emp.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-[#0B1C2D]">{emp.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-slate-600">{emp.team}</td>
                                    <td className="px-5 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-orange-400 rounded-full"
                                                    style={{ width: `${Math.min(100, (emp.productivity / 5) * 100)}%` }}
                                                />
                                            </div>
                                            <span className="font-bold text-[#0B1C2D]">{emp.productivity}x</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span className="font-bold text-[#0B1C2D]">{emp.projectsDelivered}</span>
                                        <span className="text-xs text-slate-400 ml-1">dự án</span>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        {emp.skillGap ? (
                                            <span className="text-xs px-2.5 py-1 bg-red-50 text-red-600 rounded-full font-bold">
                                                {emp.skillGap}
                                            </span>
                                        ) : (
                                            <span className="text-xs px-2.5 py-1 bg-green-50 text-green-600 rounded-full font-bold">Đầy đủ</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Training + AI Insight */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-[#0B1C2D] mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        Chương trình đào tạo hiện tại
                    </h3>
                    <div className="space-y-4">
                        {TRAINING_PROGRAMS.map((t, i) => (
                            <div key={i}>
                                <div className="flex items-center justify-between text-sm mb-1.5">
                                    <span className="font-medium text-[#0B1C2D]">{t.name}</span>
                                    <span className="text-xs text-slate-400">{t.enrolled} học viên</span>
                                </div>
                                <div className="relative w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${t.progress}%` }}
                                    />
                                </div>
                                <div className="text-[10px] text-right text-blue-600 font-bold mt-0.5">{t.progress}%</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#0B1C2D] to-[#1E3A5F] p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-[#3AE7E1]/20 rounded-lg border border-[#3AE7E1]/30">
                            <Sparkles className="w-4 h-4 text-[#3AE7E1]" />
                        </div>
                        <div className="text-xs font-bold uppercase tracking-wider text-[#3AE7E1]">AI Phân tích nhân sự</div>
                    </div>
                    <ul className="space-y-3 text-sm text-slate-300 leading-relaxed">
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                            <span><b className="text-white">Team Backend</b> thiếu kỹ năng DevOps đang gây ra delay triển khai 2 dự án quan trọng — đề xuất mở khóa học Kubernetes ngay.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                            <span><b className="text-white">{topPerformer.name}</b> đang hoạt động ở mức <b className="text-[#3AE7E1]">{topPerformer.productivity}x</b> — gấp {Math.round(topPerformer.productivity / parseFloat(avgProductivity) * 10) / 10} lần trung bình team.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3AE7E1] mt-1.5 shrink-0" />
                            <span>Cần tuyển thêm <b className="text-white">4 AI Engineers</b> cho lộ trình Q4 — kỹ năng AI Engineering đang là khoảng trống chiến lược lớn nhất.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
