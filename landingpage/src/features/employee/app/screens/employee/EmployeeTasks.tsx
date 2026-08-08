import { useMemo, useState } from 'react';
import { Calendar, FolderKanban } from 'lucide-react';
import { buildExecutionInsights, type DailyReportEntry, type EmployeeTask, type TaskStatus } from '@/features/bsc/domain/execution';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { DataTable } from '@/components/dashboard/DataTable';
import { StatusBadge } from '@/components/dashboard/StatusBadge';

const initialTasks: EmployeeTask[] = [
  { id: 'TASK-101', title: 'Implement checkout form validation', projectName: 'E-Commerce Platform v2.0', assignee: 'Nguyen Van A', deadline: '2026-03-18', estimatedHours: 8, status: 'In Progress' },
  { id: 'TASK-102', title: 'Review API contract for payment gateway', projectName: 'E-Commerce Platform v2.0', assignee: 'Nguyen Van A', deadline: '2026-03-16', estimatedHours: 4, status: 'Review' },
  { id: 'TASK-103', title: 'Fix mobile layout regression', projectName: 'Mobile Banking App', assignee: 'Nguyen Van A', deadline: '2026-03-14', estimatedHours: 6, status: 'Todo' },
  { id: 'TASK-104', title: 'Refactor shared input component', projectName: 'Mobile Banking App', assignee: 'Nguyen Van A', deadline: '2026-03-13', estimatedHours: 5, status: 'Done' },
];

const reportSignals: DailyReportEntry[] = [
  { employee: 'Nguyen Van A', blockers: 'Waiting for final UX copy', submittedAt: '2026-03-10' },
  { employee: 'Tran Thi B', blockers: '', submittedAt: '2026-03-10' },
  { employee: 'Le Hong Duc', blockers: 'Need API response schema confirmation', submittedAt: '2026-03-10' },
];

const statusOptions: TaskStatus[] = ['Todo', 'In Progress', 'Review', 'Done'];

export function EmployeeTasks() {
  const [tasks, setTasks] = useState(initialTasks);

  const insights = useMemo(() => buildExecutionInsights(tasks, reportSignals), [tasks]);

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status } : task)));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="My Tasks" description="Track assigned tasks and update status to feed project and team analytics." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Project Progress Feed" value={`${insights.projectProgress}%`} hint="Auto-calculated from your task updates" />
        <StatCard label="Delivery Efficiency" value={`${insights.deliveryEfficiency}%`} hint="Internal Process perspective" />
        <StatCard label="Operational Risks" value={insights.blockedReportsCount} hint="Detected from report blockers" />
      </div>

      <DataTable headers={['Task', 'Project', 'Deadline', 'Est. Hours', 'Status']}>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td className="px-4 py-3">
              <p className="font-medium text-gray-900">{task.title}</p>
              <p className="text-xs text-gray-500">{task.id}</p>
            </td>
            <td className="px-4 py-3 text-gray-700 inline-flex items-center gap-1"><FolderKanban className="w-4 h-4" />{task.projectName}</td>
            <td className="px-4 py-3 text-gray-700 inline-flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(task.deadline).toLocaleDateString()}</td>
            <td className="px-4 py-3 text-gray-700">{task.estimatedHours}h</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <select
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <StatusBadge
                  label={task.status}
                  tone={task.status === 'Done' ? 'success' : task.status === 'Review' ? 'warning' : task.status === 'In Progress' ? 'info' : 'neutral'}
                />
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
