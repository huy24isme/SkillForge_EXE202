import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/dashboard/DataTable';
import { Modal } from '@/components/dashboard/Modal';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { EmployeeWeeklyReport } from '@/features/employee/app/screens/employee/EmployeeWeeklyReport';

type ReportType = 'daily' | 'weekly';

type DailyReport = {
  id: string;
  date: string;
  todaysWork: string;
  issues: string;
  tomorrowPlan: string;
};

const defaultForm: Omit<DailyReport, 'id' | 'date'> = {
  todaysWork: '',
  issues: '',
  tomorrowPlan: '',
};

export function EmployeeDailyReport() {
  const [reportType, setReportType] = useState<ReportType>('daily');
  const [reports, setReports] = useState<DailyReport[]>([
    {
      id: 'DR-01',
      date: '2026-03-10',
      todaysWork: 'Completed onboarding UI validations and fixed responsive bugs.',
      issues: 'Waiting for final copy review.',
      tomorrowPlan: 'Integrate account settings API and run smoke test.',
    },
    {
      id: 'DR-02',
      date: '2026-03-09',
      todaysWork: 'Refactored shared form controls for checkout pages.',
      issues: '',
      tomorrowPlan: 'Start checkout summary improvements.',
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DailyReport | null>(null);
  const [form, setForm] = useState(defaultForm);

  const issuesCount = useMemo(() => reports.filter((report) => report.issues.trim().length > 0).length, [reports]);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setOpen(true);
  };

  const openEdit = (report: DailyReport) => {
    setEditing(report);
    setForm({
      todaysWork: report.todaysWork,
      issues: report.issues,
      tomorrowPlan: report.tomorrowPlan,
    });
    setOpen(true);
  };

  const save = () => {
    if (!form.todaysWork.trim() || !form.tomorrowPlan.trim()) return;
    if (editing) {
      setReports((prev) =>
        prev.map((report) => (report.id === editing.id ? { ...report, ...form } : report))
      );
    } else {
      setReports((prev) => [
        {
          id: `DR-${String(prev.length + 1).padStart(2, '0')}`,
          date: new Date().toISOString().slice(0, 10),
          ...form,
        },
        ...prev,
      ]);
    }
    setOpen(false);
  };

  const remove = (reportId: string) => {
    setReports((prev) => prev.filter((report) => report.id !== reportId));
  };

  if (reportType === 'weekly') {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-2 inline-flex gap-2">
          <button onClick={() => setReportType('daily')} className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">Daily Report</button>
          <button onClick={() => setReportType('weekly')} className="px-4 py-2 rounded-lg text-sm bg-[#0B1C2D] text-white">Weekly Report</button>
        </div>
        <EmployeeWeeklyReport />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-2 inline-flex gap-2">
        <button onClick={() => setReportType('daily')} className="px-4 py-2 rounded-lg text-sm bg-cyan-500 text-white">Daily Report</button>
        <button onClick={() => setReportType('weekly')} className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">Weekly Report</button>
      </div>

      <PageHeader
        title="Daily Report"
        description="Create, edit, and delete your daily execution reports."
        action={<button onClick={openCreate} className="px-4 py-2.5 bg-cyan-500 text-white rounded-lg inline-flex items-center gap-2"><Plus className="w-4 h-4" /> Create report</button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="text-sm text-gray-600">Reports submitted</p>
          <p className="text-3xl font-semibold text-gray-900 mt-2">{reports.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="text-sm text-gray-600">Open issues</p>
          <p className="text-3xl font-semibold text-gray-900 mt-2">{issuesCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="text-sm text-gray-600">Latest report date</p>
          <p className="text-3xl font-semibold text-gray-900 mt-2">{reports[0]?.date ?? '-'}</p>
        </div>
      </div>

      <DataTable headers={['ID', 'Date', "Today's work", 'Issues', 'Tomorrow plan', 'Signal', 'Actions']}>
        {reports.map((report) => (
          <tr key={report.id}>
            <td className="px-4 py-3 text-gray-700">{report.id}</td>
            <td className="px-4 py-3 text-gray-700">{report.date}</td>
            <td className="px-4 py-3 text-gray-700">{report.todaysWork}</td>
            <td className="px-4 py-3 text-gray-700">{report.issues || '-'}</td>
            <td className="px-4 py-3 text-gray-700">{report.tomorrowPlan}</td>
            <td className="px-4 py-3">
              <StatusBadge label={report.issues ? 'Has issues' : 'Clear'} tone={report.issues ? 'warning' : 'success'} />
            </td>
            <td className="px-4 py-3 space-x-3">
              <button onClick={() => openEdit(report)} className="text-cyan-700 hover:underline">Edit</button>
              <button onClick={() => remove(report.id)} className="text-rose-600 hover:underline">Delete</button>
            </td>
          </tr>
        ))}
      </DataTable>

      <Modal open={open} title={editing ? 'Edit Daily Report' : 'Create Daily Report'} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Today's work</label>
            <textarea value={form.todaysWork} onChange={(e) => setForm({ ...form, todaysWork: e.target.value })} rows={3} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issues</label>
            <textarea value={form.issues} onChange={(e) => setForm({ ...form, issues: e.target.value })} rows={3} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tomorrow plan</label>
            <textarea value={form.tomorrowPlan} onChange={(e) => setForm({ ...form, tomorrowPlan: e.target.value })} rows={3} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="px-4 py-2.5 border border-gray-300 rounded-lg">Cancel</button>
            <button onClick={save} className="px-4 py-2.5 bg-cyan-500 text-white rounded-lg">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
