import { useMemo, useState } from 'react';
import { Plus, RotateCcw, UserCog, Shield, UserCheck } from 'lucide-react';
import { DataTable } from '@/components/dashboard/DataTable';
import { Modal } from '@/components/dashboard/Modal';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';

type UserRow = { id: string; username: string; email: string; role: 'admin' | 'pm' | 'employee' };

export function Users() {
  const [rows, setRows] = useState<UserRow[]>([
    { id: 'USR-01', username: 'admin01', email: 'admin@skillforge.ai', role: 'admin' },
    { id: 'USR-02', username: 'pm01', email: 'pm@skillforge.ai', role: 'pm' },
    { id: 'USR-03', username: 'employee01', email: 'employee@skillforge.ai', role: 'employee' },
  ]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', role: 'employee' as UserRow['role'] });
  const adminCount = useMemo(() => rows.filter((row) => row.role === 'admin').length, [rows]);
  const pmCount = useMemo(() => rows.filter((row) => row.role === 'pm').length, [rows]);
  const employeeCount = useMemo(() => rows.filter((row) => row.role === 'employee').length, [rows]);

  const createUser = () => {
    setRows((prev) => [...prev, { id: `USR-${String(prev.length + 1).padStart(2, '0')}`, ...form }]);
    setOpen(false);
    setForm({ username: '', email: '', role: 'employee' });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Control access identities, role assignments, and account security operations for the platform." 
        className="from-indigo-50 via-cyan-50 to-slate-50"
        action={<button onClick={() => setOpen(true)} className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg inline-flex items-center gap-2 shadow-lg shadow-cyan-900/20"><Plus className="w-4 h-4" /> Create User</button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Admin Accounts" value={adminCount} hint="High-privilege controls" className="from-violet-50 to-indigo-100/60 border-indigo-200" />
        <StatCard label="PM Accounts" value={pmCount} hint="Project governance users" className="from-cyan-50 to-sky-100/60 border-cyan-200" />
        <StatCard label="Employee Accounts" value={employeeCount} hint="Execution users" className="from-teal-50 to-emerald-100/60 border-emerald-200" />
      </div>

      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/25 to-cyan-50/25 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-indigo-100 bg-gradient-to-r from-indigo-50/70 to-cyan-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <UserCog className="w-4 h-4 text-cyan-600" />
            Account Directory
          </div>
          <div className="text-xs text-slate-500 inline-flex items-center gap-3">
            <span className="inline-flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-cyan-700" /> RBAC enabled</span>
            <span className="inline-flex items-center gap-1"><UserCheck className="w-3.5 h-3.5 text-emerald-700" /> {rows.length} users</span>
          </div>
        </div>

        <DataTable headers={['User ID', 'Username', 'Email', 'Role', 'Actions']}>
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-4 py-3 text-gray-700">{row.id}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{row.username}</td>
              <td className="px-4 py-3 text-gray-700">{row.email}</td>
              <td className="px-4 py-3">
                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                  {row.role}
                </span>
              </td>
              <td className="px-4 py-3 space-x-3">
                <button className="text-cyan-700 hover:underline">Assign Role</button>
                <button className="text-amber-700 hover:underline inline-flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5" /> Reset Password</button>
              </td>
            </tr>
          ))}
        </DataTable>
      </div>

      <Modal open={open} title="Create User Account" onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRow['role'] })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg">
            <option value="employee">Employee</option>
            <option value="pm">PM</option>
            <option value="admin">Admin</option>
          </select>
          <div className="flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="px-4 py-2.5 border border-gray-300 rounded-lg">Cancel</button>
            <button onClick={createUser} className="px-4 py-2.5 bg-cyan-500 text-white rounded-lg">Create</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
