import { useState } from 'react';
import { Building2, Plus } from 'lucide-react';
import { DataTable } from '@/components/dashboard/DataTable';
import { Modal } from '@/components/dashboard/Modal';
import { PageHeader } from '@/components/dashboard/PageHeader';

type Customer = {
  id: string;
  name: string;
  contactEmail: string;
  company: string;
  notes: string;
};

const initialCustomers: Customer[] = [
  { id: 'CUS-01', name: 'SME Group', contactEmail: 'contact@smegroup.com', company: 'SME Group JSC', notes: 'Priority account in retail segment.' },
  { id: 'CUS-02', name: 'Prime Bank', contactEmail: 'ops@primebank.com', company: 'Prime Bank', notes: 'High compliance requirements.' },
];

const defaultForm: Omit<Customer, 'id'> = {
  name: '',
  contactEmail: '',
  company: '',
  notes: '',
};

export function Customers() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [form, setForm] = useState(defaultForm);

  const addCustomer = () => {
    setEditing(null);
    setForm(defaultForm);
    setOpen(true);
  };

  const openEdit = (customer: Customer) => {
    setEditing(customer);
    setForm({
      name: customer.name,
      contactEmail: customer.contactEmail,
      company: customer.company,
      notes: customer.notes,
    });
    setOpen(true);
  };

  const openView = (customer: Customer) => {
    setSelected(customer);
    setViewOpen(true);
  };

  const save = () => {
    if (!form.name.trim()) return;

    if (editing) {
      setCustomers((prev) => prev.map((customer) => (customer.id === editing.id ? { ...customer, ...form } : customer)));
    } else {
      setCustomers((prev) => [...prev, { id: `CUS-${String(prev.length + 1).padStart(2, '0')}`, ...form }]);
    }

    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Create, edit, and view customer data used in Manager execution and BSC customer perspective."
        action={
          <button
            onClick={addCustomer}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#3AE7E1] text-white rounded-lg hover:bg-[#3AE7E1]/90"
          >
            <Plus className="w-4 h-4" /> Add customer
          </button>
        }
      />

      <DataTable headers={['Customer', 'Contact email', 'Company', 'Actions']}>
        {customers.map((customer) => (
          <tr key={customer.id}>
            <td className="px-4 py-3 font-medium text-gray-900 inline-flex items-center gap-2"><Building2 className="w-4 h-4 text-[#3AE7E1]" />{customer.name}</td>
            <td className="px-4 py-3 text-gray-700">{customer.contactEmail}</td>
            <td className="px-4 py-3 text-gray-700">{customer.company}</td>
            <td className="px-4 py-3 space-x-3">
              <button onClick={() => openEdit(customer)} className="text-[#0B1C2D] hover:underline">Edit</button>
              <button onClick={() => openView(customer)} className="text-[#3AE7E1] hover:underline">View</button>
            </td>
          </tr>
        ))}
      </DataTable>

      <Modal open={open} title={editing ? 'Edit customer' : 'Create customer'} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Customer name" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
          <input value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} placeholder="Contact email" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
          <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Notes" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg" />
          <div className="flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="px-4 py-2.5 border border-gray-300 rounded-lg">Cancel</button>
            <button onClick={save} className="px-4 py-2.5 bg-[#3AE7E1] text-white rounded-lg">Save</button>
          </div>
        </div>
      </Modal>

      <Modal open={viewOpen} title="Customer details" onClose={() => setViewOpen(false)}>
        {selected ? (
          <div className="space-y-3 text-sm">
            <p><span className="font-semibold text-gray-900">Customer:</span> {selected.name}</p>
            <p><span className="font-semibold text-gray-900">Contact:</span> {selected.contactEmail}</p>
            <p><span className="font-semibold text-gray-900">Company:</span> {selected.company}</p>
            <p><span className="font-semibold text-gray-900">Notes:</span> {selected.notes || '-'}</p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
