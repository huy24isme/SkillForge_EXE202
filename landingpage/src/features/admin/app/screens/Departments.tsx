import { useMemo, useState } from 'react';
import { Plus, Building2, UsersRound } from 'lucide-react';
import { DataTable } from '@/components/dashboard/DataTable';
import { Modal } from '@/components/dashboard/Modal';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';

type Department = { id: string; name: string; lead: string };

export function Departments() {
  const [items, setItems] = useState<Department[]>([
    { id: 'DEP-01', name: 'Engineering', lead: 'Le Hong Duc' },
    { id: 'DEP-02', name: 'Product', lead: 'Nguyen Van A' },
  ]);
  const [editing, setEditing] = useState<Department | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', lead: '' });
  const withLead = useMemo(() => items.filter((item) => item.lead.trim().length > 0).length, [items]);

  const onCreate = () => {
    setEditing(null);
    setForm({ name: '', lead: '' });
    setOpen(true);
  };

  const onEdit = (item: Department) => {
    setEditing(item);
    setForm({ name: item.name, lead: item.lead });
    setOpen(true);
  };

  const onSave = () => {
    if (!form.name.trim()) return;
    if (editing) {
      setItems((prev) => prev.map((item) => (item.id === editing.id ? { ...item, ...form } : item)));
    } else {
      setItems((prev) => [...prev, { id: `DEP-${String(prev.length + 1).padStart(2, '0')}`, ...form }]);
    }
    setOpen(false);
  };

  const onDelete = (id: string) => setItems((prev) => prev.filter((item) => item.id !== id));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teams / Departments"
        description="Manage organizational structure used for workforce planning, permissions, and reporting ownership."
        className="from-cyan-50 via-sky-50 to-blue-50"
        action={<button onClick={onCreate} className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg inline-flex items-center gap-2 shadow-lg shadow-cyan-900/20"><Plus className="w-4 h-4" /> New Department</button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Departments" value={items.length} hint="Organization structure nodes" className="from-blue-50 to-cyan-100/60 border-cyan-200" />
        <StatCard label="Assigned Department Leads" value={withLead} hint="Leadership ownership assigned" className="from-cyan-50 to-emerald-100/60 border-emerald-200" />
        <StatCard label="Coverage" value={`${items.length === 0 ? 0 : Math.round((withLead / items.length) * 100)}%`} hint="Lead assignment rate" className="from-indigo-50 to-sky-100/60 border-indigo-200" />
      </div>

      <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/30 to-sky-50/30 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-cyan-100 bg-gradient-to-r from-cyan-50/80 to-blue-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <Building2 className="w-4 h-4 text-cyan-600" />
            Department Registry
          </div>
          <div className="text-xs text-slate-500 inline-flex items-center gap-1">
            <UsersRound className="w-3.5 h-3.5" />
            {items.length} records
          </div>
        </div>

        <DataTable headers={['Department ID', 'Name', 'Lead', 'Actions']}>
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-4 py-3 text-gray-700">{item.id}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
              <td className="px-4 py-3 text-gray-700">{item.lead || 'Unassigned'}</td>
              <td className="px-4 py-3 space-x-3">
                <button onClick={() => onEdit(item)} className="text-cyan-700 hover:underline">Edit</button>
                <button onClick={() => onDelete(item.id)} className="text-rose-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </DataTable>
      </div>

      <Modal open={open} title={editing ? 'Edit Department' : 'Create Department'} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department lead</label>
            <input value={form.lead} onChange={(e) => setForm({ ...form, lead: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="px-4 py-2.5 border border-gray-300 rounded-lg">Cancel</button>
            <button onClick={onSave} className="px-4 py-2.5 bg-cyan-500 text-white rounded-lg">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
