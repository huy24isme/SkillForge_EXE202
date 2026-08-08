import { useState } from 'react';
import { Building2, ShieldCheck, BadgeCheck } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';

export function CompanySettings() {
  const [form, setForm] = useState({
    companyName: 'SkillForge Inc.',
    supportEmail: 'support@skillforge.ai',
    phone: '+84 999 123 456',
    address: 'Ho Chi Minh City, Vietnam',
    logoUrl: '',
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Settings"
        description="Centralized organization profile, compliance metadata, and branding controls for executive-level governance."
        className="from-cyan-50 via-blue-50/80 to-indigo-50/70"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="System Environment" value="Production" hint="Stable release channel" className="from-cyan-50 to-cyan-100/60 border-cyan-200" />
        <StatCard label="Compliance Status" value="Aligned" hint="Policy and audit profile active" className="from-emerald-50 to-emerald-100/60 border-emerald-200" />
        <StatCard label="Last Updated" value="Today" hint="Settings synchronized successfully" className="from-violet-50 to-indigo-100/60 border-indigo-200" />
      </div>

      <div className="bg-gradient-to-br from-white via-slate-50/70 to-cyan-50/40 border border-slate-200 rounded-2xl p-6 lg:p-7 shadow-sm grid grid-cols-1 xl:grid-cols-3 gap-7">
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <Building2 className="w-5 h-5 text-cyan-600" />
            Organization Profile
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
              <input
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-200"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-cyan-200 p-4 bg-gradient-to-br from-cyan-50/70 to-white">
              <div className="flex items-center gap-2 mb-2 text-slate-800 font-medium">
                <ShieldCheck className="w-4 h-4 text-cyan-600" />
                Security Policy
              </div>
              <p className="text-sm text-slate-600">SSO enforced and multi-factor authentication required for admin roles.</p>
            </div>
            <div className="rounded-xl border border-indigo-200 p-4 bg-gradient-to-br from-indigo-50/70 to-white">
              <div className="flex items-center gap-2 mb-2 text-slate-800 font-medium">
                <BadgeCheck className="w-4 h-4 text-cyan-600" />
                Governance Profile
              </div>
              <p className="text-sm text-slate-600">Data ownership and operational policy metadata are synchronized.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-cyan-200 p-5 bg-gradient-to-br from-cyan-50/60 via-white to-blue-50/40">
          <label className="block text-sm font-semibold text-slate-800">Brand Asset</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setForm({ ...form, logoUrl: URL.createObjectURL(file) });
            }}
            className="w-full text-sm file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-cyan-50 file:text-cyan-700"
          />
          <div className="h-44 border border-dashed border-slate-300 rounded-xl bg-white flex items-center justify-center overflow-hidden">
            {form.logoUrl ? <img src={form.logoUrl} alt="Company logo" className="max-h-full" /> : <span className="text-sm text-gray-500">Logo preview</span>}
          </div>
          <button className="w-full px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:opacity-95 shadow-lg shadow-cyan-900/15">Save Settings</button>
        </div>
      </div>
    </div>
  );
}
