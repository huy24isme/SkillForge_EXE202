import { useMemo, useState } from 'react';
import { Plus, BriefcaseBusiness, Building2 } from 'lucide-react';
import { DataTable } from '@/components/dashboard/DataTable';
import { Modal } from '@/components/dashboard/Modal';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';

type Customer = {
  id: string;
  customerName: string;
  contactEmail: string;
  company: string;
  notes: string;
};

export function Customers() {
  const [rows, setRows] = useState<Customer[]>([
    { id: 'CUS-01', customerName: 'SME Group', contactEmail: 'contact@sme.vn', company: 'SME Group', notes: 'High-growth segment' },
    { id: 'CUS-02', customerName: 'Prime Bank', contactEmail: 'ops@primebank.vn', company: 'Prime Bank', notes: 'Risk-sensitive account' },
  ]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState({ customerName: '', contactEmail: '', company: '', notes: '' });
  const uniqueCompanies = useMemo(() => new Set(rows.map((row) => row.company)).size, [rows]);
  const withNotes = useMemo(() => rows.filter((row) => row.notes.trim().length > 0).length, [rows]);

  const save = () => {
    if (editing) {
      setRows((prev) => prev.map((row) => (row.id === editing.id ? { ...row, ...form } : row)));
    } else {
      setRows((prev) => [...prev, { id: `CUS-${String(prev.length + 1).padStart(2, '0')}`, ...form }]);
    }
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Maintain customer master records used by PM, reporting, and executive performance views."
        className="from-blue-50 via-cyan-50 to-emerald-50"
        action={<button onClick={() => { setEditing(null); setForm({ customerName: '', contactEmail: '', company: '', notes: '' }); setOpen(true); }} className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg inline-flex items-center gap-2 shadow-lg shadow-cyan-900/20"><Plus className="w-4 h-4" /> Add Customer</button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Customer Records" value={rows.length} hint="Total master entries" className="from-sky-50 to-cyan-100/60 border-cyan-200" />
        <StatCard label="Unique Companies" value={uniqueCompanies} hint="Distinct organizations" className="from-blue-50 to-indigo-100/60 border-indigo-200" />
        <StatCard label="Documented Notes" value={withNotes} hint="Records with contextual metadata" className="from-emerald-50 to-teal-100/60 border-emerald-200" />
      </div>

      <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50/25 to-emerald-50/25 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-cyan-100 bg-gradient-to-r from-cyan-50/70 to-emerald-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <BriefcaseBusiness className="w-4 h-4 text-cyan-600" />
            Customer Registry
          </div>
          <div className="text-xs text-slate-500 inline-flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" />
            {uniqueCompanies} companies
          </div>
        </div>

        <DataTable headers={['ID', 'Customer name', 'Contact email', 'Company', 'Notes', 'Actions']}>
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-4 py-3 text-gray-700">{row.id}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{row.customerName}</td>
              <td className="px-4 py-3 text-gray-700">{row.contactEmail}</td>
              <td className="px-4 py-3 text-gray-700">{row.company}</td>
              <td className="px-4 py-3 text-gray-700">{row.notes || '-'}</td>
              <td className="px-4 py-3 space-x-3">
                <button onClick={() => { setEditing(row); setForm({ customerName: row.customerName, contactEmail: row.contactEmail, company: row.company, notes: row.notes }); setOpen(true); }} className="text-cyan-700 hover:underline">Edit</button>
                <button onClick={() => setRows((prev) => prev.filter((x) => x.id !== row.id))} className="text-rose-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </DataTable>
      </div>

      <Modal open={open} title={editing ? 'Edit Customer' : 'Add Customer'} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="Customer name" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
          <input value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} placeholder="Contact email" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
          <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" rows={3} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
          <div className="flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="px-4 py-2.5 border border-gray-300 rounded-lg">Cancel</button>
            <button onClick={save} className="px-4 py-2.5 bg-cyan-500 text-white rounded-lg">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
