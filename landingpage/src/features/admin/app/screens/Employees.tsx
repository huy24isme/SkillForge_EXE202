import { useMemo, useState } from 'react';
import { Plus, UsersRound, UserCheck, UserX } from 'lucide-react';
import { DataTable } from '@/components/dashboard/DataTable';
import { Modal } from '@/components/dashboard/Modal';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { StatCard } from '@/components/dashboard/StatCard';

type Employee = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'Inactive';
};

export function Employees() {
  const [items, setItems] = useState<Employee[]>([
    { id: 'EMP-01', name: 'Nguyen Van A', email: 'nva@skillforge.ai', role: 'Frontend Lead', department: 'Engineering', status: 'Active' },
    { id: 'EMP-02', name: 'Tran Thi B', email: 'ttb@skillforge.ai', role: 'QA Engineer', department: 'Engineering', status: 'Active' },
  ]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState({ name: '', email: '', role: '', department: '', status: 'Active' as Employee['status'] });
  const activeCount = useMemo(() => items.filter((item) => item.status === 'Active').length, [items]);
  const inactiveCount = useMemo(() => items.filter((item) => item.status === 'Inactive').length, [items]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', email: '', role: '', department: '', status: 'Active' });
    setOpen(true);
  };

  const openEdit = (item: Employee) => {
    setEditing(item);
    setForm({ name: item.name, email: item.email, role: item.role, department: item.department, status: item.status });
    setOpen(true);
  };

  const save = () => {
    if (editing) {
      setItems((prev) => prev.map((item) => (item.id === editing.id ? { ...item, ...form } : item)));
    } else {
      setItems((prev) => [...prev, { id: `EMP-${String(prev.length + 1).padStart(2, '0')}`, ...form }]);
    }
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        description="Manage workforce records, role assignments, and operational staffing status across the organization."
        className="from-emerald-50 via-cyan-50 to-sky-50"
        action={<button onClick={openCreate} className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg inline-flex items-center gap-2 shadow-lg shadow-cyan-900/20"><Plus className="w-4 h-4" /> Add Employee</button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Employees" value={items.length} hint="All workforce records" className="from-sky-50 to-cyan-100/60 border-cyan-200" />
        <StatCard label="Active Employees" value={activeCount} hint="Operationally available" className="from-emerald-50 to-emerald-100/70 border-emerald-200" />
        <StatCard label="Inactive Employees" value={inactiveCount} hint="Temporarily offline or archived" className="from-amber-50 to-orange-100/70 border-orange-200" />
      </div>

      <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/30 to-emerald-50/30 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-cyan-100 bg-gradient-to-r from-cyan-50/80 to-emerald-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <UsersRound className="w-4 h-4 text-cyan-600" />
            Workforce Directory
          </div>
          <div className="text-xs text-slate-500 inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-1"><UserCheck className="w-3.5 h-3.5 text-emerald-600" /> {activeCount} active</span>
            <span className="inline-flex items-center gap-1"><UserX className="w-3.5 h-3.5 text-amber-600" /> {inactiveCount} inactive</span>
          </div>
        </div>

        <DataTable headers={['ID', 'Name', 'Email', 'Role', 'Department', 'Status', 'Actions']}>
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-4 py-3 text-gray-700">{item.id}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
              <td className="px-4 py-3 text-gray-700">{item.email}</td>
              <td className="px-4 py-3 text-gray-700">{item.role}</td>
              <td className="px-4 py-3 text-gray-700">{item.department}</td>
              <td className="px-4 py-3"><StatusBadge label={item.status} tone={item.status === 'Active' ? 'success' : 'warning'} /></td>
              <td className="px-4 py-3 space-x-3">
                <button onClick={() => openEdit(item)} className="text-cyan-700 hover:underline">Edit</button>
                <button onClick={() => setItems((prev) => prev.filter((x) => x.id !== item.id))} className="text-rose-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </DataTable>
      </div>

      <Modal open={open} title={editing ? 'Edit Employee' : 'Add Employee'} onClose={() => setOpen(false)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2.5 border border-gray-300 rounded-lg" />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="px-3 py-2.5 border border-gray-300 rounded-lg" />
          <input placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="px-3 py-2.5 border border-gray-300 rounded-lg" />
          <input placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="px-3 py-2.5 border border-gray-300 rounded-lg" />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Employee['status'] })} className="px-3 py-2.5 border border-gray-300 rounded-lg md:col-span-2">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={() => setOpen(false)} className="px-4 py-2.5 border border-gray-300 rounded-lg">Cancel</button>
          <button onClick={save} className="px-4 py-2.5 bg-cyan-500 text-white rounded-lg">Save</button>
        </div>
      </Modal>
    </div>
  );
}
