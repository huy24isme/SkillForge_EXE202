import { AlertTriangle, BarChart3, Users } from 'lucide-react';
import { buildExecutionInsights, type DailyReportEntry, type EmployeeTask } from '@/features/bsc/domain/execution';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { DataTable } from '@/components/dashboard/DataTable';
import { StatusBadge } from '@/components/dashboard/StatusBadge';

const taskData: EmployeeTask[] = [
  { id: 'TASK-101', title: 'Checkout validation', projectName: 'E-Commerce Platform v2.0', assignee: 'Nguyen Van A', deadline: '2026-03-18', estimatedHours: 8, status: 'In Progress' },
  { id: 'TASK-102', title: 'Payment API review', projectName: 'E-Commerce Platform v2.0', assignee: 'Le Hong Duc', deadline: '2026-03-17', estimatedHours: 6, status: 'Review' },
  { id: 'TASK-103', title: 'Mobile regression fix', projectName: 'Mobile Banking App', assignee: 'Tran Thi B', deadline: '2026-03-15', estimatedHours: 7, status: 'Todo' },
  { id: 'TASK-104', title: 'Token refresh hardening', projectName: 'Mobile Banking App', assignee: 'Pham Van C', deadline: '2026-03-14', estimatedHours: 5, status: 'Done' },
  { id: 'TASK-105', title: 'Customer portal release notes', projectName: 'SME Portal', assignee: 'Nguyen Van A', deadline: '2026-03-16', estimatedHours: 3, status: 'Done' },
];

const reportData: DailyReportEntry[] = [
  { employee: 'Nguyen Van A', blockers: 'Waiting UX copy approval', submittedAt: '2026-03-10' },
  { employee: 'Le Hong Duc', blockers: '', submittedAt: '2026-03-10' },
  { employee: 'Tran Thi B', blockers: 'Need customer test data', submittedAt: '2026-03-10' },
  { employee: 'Pham Van C', blockers: '', submittedAt: '2026-03-10' },
];

const projectHealth = [
  { name: 'E-Commerce Platform v2.0', progress: 68, risk: 'Low' },
  { name: 'Mobile Banking App', progress: 45, risk: 'High' },
  { name: 'SME Portal', progress: 73, risk: 'Medium' },
];

export function ManagerDashboard() {
  const insights = buildExecutionInsights(taskData, reportData);

  return (
    <div className="space-y-6">
      <PageHeader title="PM Dashboard" description="Real-time execution snapshot aggregated from project tasks and employee reports." />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Active Projects" value={3} hint="Projects currently in delivery" />
        <StatCard label="Task Completion" value={`${insights.projectProgress}%`} hint="From employee status updates" />
        <StatCard label="Delivery Efficiency" value={`${insights.deliveryEfficiency}%`} hint="Internal Process perspective" />
        <StatCard label="Reports with Blockers" value={insights.blockedReportsCount} hint="Needs PM follow-up" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 inline-flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-500" /> Team workload
          </h3>
          <div className="space-y-3">
            {insights.teamWorkloads.map((item) => (
              <div key={item.employee} className="rounded-xl border border-gray-100 p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.employee}</p>
                  <p className="text-xs text-gray-500">Assigned: {item.assignedTasks} | In progress/review: {item.inProgressTasks}</p>
                </div>
                <StatusBadge label={`Load ${item.workloadScore}`} tone={item.workloadScore > 3 ? 'warning' : 'success'} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 inline-flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-500" /> Report summary
          </h3>
          <div className="space-y-3 text-sm">
            <div className="rounded-xl border border-gray-100 p-4">4 daily reports submitted today</div>
            <div className="rounded-xl border border-gray-100 p-4 inline-flex items-center gap-2 w-full">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              2 blockers need manager action
            </div>
          </div>
        </div>
      </div>

      <DataTable headers={['Project', 'Progress', 'Risk']}>
        {projectHealth.map((project) => (
          <tr key={project.name}>
            <td className="px-4 py-3 font-medium text-gray-900">{project.name}</td>
            <td className="px-4 py-3 text-gray-700">{project.progress}%</td>
            <td className="px-4 py-3">
              <StatusBadge
                label={project.risk}
                tone={project.risk === 'High' ? 'danger' : project.risk === 'Medium' ? 'warning' : 'success'}
              />
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
