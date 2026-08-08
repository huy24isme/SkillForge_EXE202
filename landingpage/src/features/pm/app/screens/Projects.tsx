import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DataTable } from '@/components/dashboard/DataTable';
import { Modal } from '@/components/dashboard/Modal';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatusBadge } from '@/components/dashboard/StatusBadge';

type ProjectStatus = 'Planned' | 'Active' | 'At Risk' | 'Completed';

type ProjectItem = {
  id: string;
  project: string;
  customer: string;
  team: string;
  revenue: string;
  timeline: string;
  status: ProjectStatus;
  description: string;
};

const defaultForm: Omit<ProjectItem, 'id'> = {
  project: '',
  customer: '',
  team: '',
  revenue: '',
  timeline: '',
  status: 'Planned',
  description: '',
};

export function Projects() {
  const [items, setItems] = useState<ProjectItem[]>([
    {
      id: 'PRJ-01',
      project: 'SME Portal Expansion',
      customer: 'SME Group',
      team: 'Nguyen Van A, Le Hong Duc, Tran Thi B',
      revenue: '125000',
      timeline: '2026-03-01 to 2026-05-30',
      status: 'Active',
      description: 'Expand onboarding and self-service workflows for SME customers.',
    },
    {
      id: 'PRJ-02',
      project: 'Mobile Banking App',
      customer: 'Prime Bank',
      team: 'Pham Van C, Le Hong Duc',
      revenue: '98000',
      timeline: '2026-02-15 to 2026-06-15',
      status: 'At Risk',
      description: 'Improve transaction reliability and customer security controls.',
    },
  ]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectItem | null>(null);
  const [form, setForm] = useState(defaultForm);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setOpen(true);
  };

  const openEdit = (item: ProjectItem) => {
    setEditing(item);
    setForm({
      project: item.project,
      customer: item.customer,
      team: item.team,
      revenue: item.revenue,
      timeline: item.timeline,
      status: item.status,
      description: item.description,
    });
    setOpen(true);
  };

  const save = () => {
    if (!form.project.trim()) return;
    if (editing) {
      setItems((prev) => prev.map((item) => (item.id === editing.id ? { ...item, ...form } : item)));
    } else {
      setItems((prev) => [...prev, { id: `PRJ-${String(prev.length + 1).padStart(2, '0')}`, ...form }]);
    }
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Create, edit, delete projects, and manually assign team members based on project needs."
        action={
          <div className="flex items-center gap-2">
            <Link to="/pm/customers" className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Manage customers</Link>
            <button onClick={openCreate} className="px-4 py-2.5 bg-cyan-500 text-white rounded-lg inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create project
            </button>
          </div>
        }
      />

      <DataTable headers={['Project', 'Customer', 'Team', 'Revenue', 'Timeline', 'Status', 'Actions']}>
        {items.map((item) => (
          <tr key={item.id}>
            <td className="px-4 py-3">
              <p className="font-medium text-gray-900">{item.project}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
            </td>
            <td className="px-4 py-3 text-gray-700">{item.customer}</td>
            <td className="px-4 py-3 text-gray-700">{item.team}</td>
            <td className="px-4 py-3 text-gray-700">${Number(item.revenue || 0).toLocaleString()}</td>
            <td className="px-4 py-3 text-gray-700">{item.timeline}</td>
            <td className="px-4 py-3">
              <StatusBadge label={item.status} tone={item.status === 'At Risk' ? 'danger' : item.status === 'Active' ? 'info' : item.status === 'Completed' ? 'success' : 'neutral'} />
            </td>
            <td className="px-4 py-3 space-x-3">
              <button onClick={() => openEdit(item)} className="text-cyan-700 hover:underline">Edit</button>
              <button onClick={() => setItems((prev) => prev.filter((x) => x.id !== item.id))} className="text-rose-600 hover:underline">Delete</button>
            </td>
          </tr>
        ))}
      </DataTable>

      <Modal open={open} title={editing ? 'Edit project' : 'Create project'} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <input placeholder="Project" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
          <input placeholder="Customer" value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
          <input placeholder="Team (comma separated)" value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
          <input placeholder="Revenue" value={form.revenue} onChange={(e) => setForm({ ...form, revenue: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
          <input placeholder="Timeline (e.g. 2026-03-01 to 2026-05-30)" value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg">
            <option value="Planned">Planned</option>
            <option value="Active">Active</option>
            <option value="At Risk">At Risk</option>
            <option value="Completed">Completed</option>
          </select>
          <div className="flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="px-4 py-2.5 border border-gray-300 rounded-lg">Cancel</button>
            <button onClick={save} className="px-4 py-2.5 bg-cyan-500 text-white rounded-lg">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
