import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { DataTable } from '@/components/dashboard/DataTable';
import { StatusBadge } from '@/components/dashboard/StatusBadge';

type ReportTab = 'daily' | 'weekly' | 'ai-summary';

type ReportRow = {
  id: string;
  employee: string;
  project: string;
  date: string;
  todaysWork: string;
  issues: string;
  tomorrowPlan: string;
};

const seedReports: ReportRow[] = [
  {
    id: 'RPT-01',
    employee: 'Nguyen Van A',
    project: 'SME Portal Expansion',
    date: '2026-03-10',
    todaysWork: 'Completed onboarding UI validations.',
    issues: 'Waiting for copy review from product team.',
    tomorrowPlan: 'Start account settings integration.',
  },
  {
    id: 'RPT-02',
    employee: 'Le Hong Duc',
    project: 'Mobile Banking App',
    date: '2026-03-10',
    todaysWork: 'Improved transaction retry logic.',
    issues: '',
    tomorrowPlan: 'Add monitoring for failed transactions.',
  },
  {
    id: 'RPT-03',
    employee: 'Tran Thi B',
    project: 'SME Portal Expansion',
    date: '2026-03-09',
    todaysWork: 'Executed smoke tests for signup flow.',
    issues: 'Customer test data is incomplete.',
    tomorrowPlan: 'Validate regression scenarios.',
  },
];

export function Reports() {
  const [activeTab, setActiveTab] = useState<ReportTab>('daily');
  const [projectFilter, setProjectFilter] = useState('All');
  const [employeeFilter, setEmployeeFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  const projects = useMemo(() => ['All', ...Array.from(new Set(seedReports.map((report) => report.project)))], []);
  const employees = useMemo(() => ['All', ...Array.from(new Set(seedReports.map((report) => report.employee)))], []);

  const filtered = useMemo(() => {
    return seedReports.filter((report) => {
      const matchProject = projectFilter === 'All' || report.project === projectFilter;
      const matchEmployee = employeeFilter === 'All' || report.employee === employeeFilter;
      const matchDate = !dateFilter || report.date === dateFilter;
      return matchProject && matchEmployee && matchDate;
    });
  }, [projectFilter, employeeFilter, dateFilter]);

  const weeklySummary = useMemo(() => {
    const byWeek = new Map<string, { total: number; blockers: number }>();

    seedReports.forEach((report) => {
      const date = new Date(report.date);
      const weekKey = `${date.getFullYear()}-W${Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7)}`;
      const existing = byWeek.get(weekKey) ?? { total: 0, blockers: 0 };
      existing.total += 1;
      if (report.issues.trim()) {
        existing.blockers += 1;
      }
      byWeek.set(weekKey, existing);
    });

    return Array.from(byWeek.entries()).map(([week, value]) => ({
      week,
      submitted: value.total,
      blockerRate: Math.round((value.blockers / value.total) * 100),
    }));
  }, []);

  const aiSummary = useMemo(() => {
    const blockerReports = filtered.filter((report) => report.issues.trim().length > 0);
    const topProject = filtered.reduce<Record<string, number>>((acc, report) => {
      acc[report.project] = (acc[report.project] ?? 0) + 1;
      return acc;
    }, {});
    const sortedProjects = Object.entries(topProject).sort((a, b) => b[1] - a[1]);

    return {
      blockerCount: blockerReports.length,
      topProject: sortedProjects[0]?.[0] ?? 'N/A',
      recommendation: blockerReports.length > 0
        ? 'Prioritize blocker triage with assignees and rebalance workload in at-risk projects.'
        : 'Current delivery stream is stable. Maintain report discipline and monitor task throughput.',
    };
  }, [filtered]);

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="View daily reports, weekly reports, and AI summary with execution filters." />

      <div className="bg-white border border-gray-200 rounded-2xl p-2 inline-flex gap-2">
        <button onClick={() => setActiveTab('daily')} className={`px-4 py-2 rounded-lg text-sm ${activeTab === 'daily' ? 'bg-[#3AE7E1] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>Daily report</button>
        <button onClick={() => setActiveTab('weekly')} className={`px-4 py-2 rounded-lg text-sm ${activeTab === 'weekly' ? 'bg-[#3AE7E1] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>Weekly report</button>
        <button onClick={() => setActiveTab('ai-summary')} className={`px-4 py-2 rounded-lg text-sm ${activeTab === 'ai-summary' ? 'bg-[#3AE7E1] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>AI summary</button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="px-3 py-2.5 border border-gray-300 rounded-lg">
          {projects.map((project) => <option key={project} value={project}>{project}</option>)}
        </select>
        <select value={employeeFilter} onChange={(e) => setEmployeeFilter(e.target.value)} className="px-3 py-2.5 border border-gray-300 rounded-lg">
          {employees.map((employee) => <option key={employee} value={employee}>{employee}</option>)}
        </select>
        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="px-3 py-2.5 border border-gray-300 rounded-lg" />
      </div>

      {activeTab === 'daily' ? (
        <DataTable headers={['Report ID', 'Employee', 'Project', 'Date', 'Today', 'Issues', 'Tomorrow', 'Signal']}>
          {filtered.map((report) => (
            <tr key={report.id}>
              <td className="px-4 py-3 text-gray-700">{report.id}</td>
              <td className="px-4 py-3 text-gray-700">{report.employee}</td>
              <td className="px-4 py-3 text-gray-700">{report.project}</td>
              <td className="px-4 py-3 text-gray-700">{report.date}</td>
              <td className="px-4 py-3 text-gray-700">{report.todaysWork}</td>
              <td className="px-4 py-3 text-gray-700">{report.issues || '-'}</td>
              <td className="px-4 py-3 text-gray-700">{report.tomorrowPlan}</td>
              <td className="px-4 py-3">
                <StatusBadge label={report.issues ? 'Has blocker' : 'No blocker'} tone={report.issues ? 'warning' : 'success'} />
              </td>
            </tr>
          ))}
        </DataTable>
      ) : null}

      {activeTab === 'weekly' ? (
        <DataTable headers={['Week', 'Submitted reports', 'Blocker rate', 'Signal']}>
          {weeklySummary.map((week) => (
            <tr key={week.week}>
              <td className="px-4 py-3 text-gray-700">{week.week}</td>
              <td className="px-4 py-3 text-gray-700">{week.submitted}</td>
              <td className="px-4 py-3 text-gray-700">{week.blockerRate}%</td>
              <td className="px-4 py-3">
                <StatusBadge label={week.blockerRate > 40 ? 'High risk' : week.blockerRate > 20 ? 'Monitor' : 'Stable'} tone={week.blockerRate > 40 ? 'danger' : week.blockerRate > 20 ? 'warning' : 'success'} />
              </td>
            </tr>
          ))}
        </DataTable>
      ) : null}

      {activeTab === 'ai-summary' ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">AI summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="text-sm text-gray-600">Reports with blockers</p>
              <p className="text-3xl font-semibold text-gray-900">{aiSummary.blockerCount}</p>
            </div>
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="text-sm text-gray-600">Project most mentioned</p>
              <p className="text-xl font-semibold text-gray-900">{aiSummary.topProject}</p>
            </div>
          </div>
          <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-4 text-sm text-gray-700">
            <p className="font-medium text-cyan-900 mb-1">Recommendation</p>
            <p>{aiSummary.recommendation}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
