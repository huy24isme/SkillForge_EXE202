import { KPICard } from '@/features/leadership/app/components/KPICard';
import { StatusBadge } from '@/features/leadership/app/components/StatusBadge';
import { 
  FolderKanban, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Sparkles,
  Clock
} from 'lucide-react';

const projects = [
  { id: 1, name: 'E-Commerce Platform v2.0', status: 'healthy' as const, progress: 75, team: 5, deadline: '2026-02-15' },
  { id: 2, name: 'Mobile Banking App', status: 'at-risk' as const, progress: 45, team: 4, deadline: '2026-02-01' },
  { id: 3, name: 'AI Analytics Dashboard', status: 'critical' as const, progress: 30, team: 6, deadline: '2026-01-28' },
  { id: 4, name: 'CRM System Upgrade', status: 'healthy' as const, progress: 90, team: 3, deadline: '2026-02-28' },
];

const activities = [
  { id: 1, user: 'Nguyen Van A', action: 'completed task "API Integration"', project: 'E-Commerce Platform', time: '5 min ago' },
  { id: 2, user: 'Le Hong Duc', action: 'reported blocker on "Database Migration"', project: 'Mobile Banking App', time: '23 min ago' },
  { id: 3, user: 'AI System', action: 'suggested team rebalancing', project: 'AI Analytics Dashboard', time: '1 hour ago' },
  { id: 4, user: 'Tran Thi B', action: 'submitted daily report', project: 'CRM System Upgrade', time: '2 hours ago' },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Dự án đang hoạt động"
          value={12}
          change="+3 this month"
          icon={FolderKanban}
          trend="up"
          color="#3AE7E1"
        />
        <KPICard
          title="Mức sử dụng nhân sự"
          value="87%"
          change="+5% from last week"
          icon={Users}
          trend="up"
          color="#2ECC71"
        />
        <KPICard
          title="Dự án rủi ro"
          value={3}
          change="2 require attention"
          icon={AlertTriangle}
          trend="down"
          color="#F5A623"
        />
        <KPICard
          title="Intern Retention Rate"
          value="94%"
          change="+2% this quarter"
          icon={TrendingUp}
          trend="up"
          color="#3AE7E1"
        />
      </div>

      {/* Phân tích AI Panel */}
      <div className="bg-gradient-to-br from-[#3AE7E1]/10 to-[#0B1C2D]/5 rounded-xl p-6 border border-[#3AE7E1]/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#3AE7E1]/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-[#3AE7E1]" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Phân tích AI</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-[#E74C3C] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">
                  <strong>2 projects</strong> may miss deadline. Consider resource reallocation for "AI Analytics Dashboard" and "Mobile Banking App".
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Users className="w-5 h-5 text-[#F5A623] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">
                  <strong>1 team is overloaded.</strong> Backend team working at 115% capacity. Recommend hiring or task redistribution.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="w-5 h-5 text-[#2ECC71] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">
                  Team velocity improved by <strong>23%</strong> after implementing AI-based task matching.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trạng thái dự án List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Trạng thái dự án</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{project.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {project.team} members
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Due {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={project.status}>
                      {project.status === 'healthy' && 'Ổn định'}
                      {project.status === 'at-risk' && 'Có rủi ro'}
                      {project.status === 'critical' && 'Nghiêm trọng'}
                    </StatusBadge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all"
                        style={{ 
                          width: `${project.progress}%`,
                          backgroundColor: 
                            project.status === 'healthy' ? '#2ECC71' : 
                            project.status === 'at-risk' ? '#F5A623' : 
                            '#E74C3C'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#3AE7E1]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-[#3AE7E1]">
                      {activity.user.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span>{' '}
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.project} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
