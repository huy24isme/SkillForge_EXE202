import { useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';

type SettingsSection = {
  id: string;
  label: string;
  description: string;
  fields: Array<{ id: string; label: string; type: 'text' | 'email' | 'toggle'; defaultValue: string | boolean }>;
};

const sections: SettingsSection[] = [
  {
    id: 'platform',
    label: 'Platform Settings',
    description: 'General configuration for the SaaS platform',
    fields: [
      { id: 'platformName', label: 'Platform Name', type: 'text', defaultValue: 'SkillForge SaaS' },
      { id: 'supportEmail', label: 'Support Email', type: 'email', defaultValue: 'support@skillforge.io' },
      { id: 'maintenanceMode', label: 'Maintenance Mode', type: 'toggle', defaultValue: false },
    ],
  },
  {
    id: 'billing',
    label: 'Billing & Payments',
    description: 'Payment processing and billing configuration',
    fields: [
      { id: 'currency', label: 'Default Currency', type: 'text', defaultValue: 'USD' },
      { id: 'billingEmail', label: 'Billing Contact Email', type: 'email', defaultValue: 'billing@skillforge.io' },
      { id: 'autoRenewal', label: 'Auto-renewal Enabled', type: 'toggle', defaultValue: true },
    ],
  },
  {
    id: 'security',
    label: 'Security',
    description: 'Access control and authentication policies',
    fields: [
      { id: 'mfa', label: 'Require MFA for Admins', type: 'toggle', defaultValue: true },
      { id: 'sessionTimeout', label: 'Session Timeout (minutes)', type: 'text', defaultValue: '60' },
      { id: 'auditLogs', label: 'Enable Audit Logging', type: 'toggle', defaultValue: true },
    ],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'System alerts and notification preferences',
    fields: [
      { id: 'paymentAlerts', label: 'Payment Failure Alerts', type: 'toggle', defaultValue: true },
      { id: 'churnAlerts', label: 'Churn Risk Alerts', type: 'toggle', defaultValue: true },
      { id: 'alertEmail', label: 'Alert Recipient Email', type: 'email', defaultValue: 'alerts@skillforge.io' },
    ],
  },
];

export function SettingsScreen() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const defaults: Record<string, boolean> = {};
    sections.forEach((s) =>
      s.fields.forEach((f) => {
        if (f.type === 'toggle') defaults[f.id] = f.defaultValue as boolean;
      })
    );
    return defaults;
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Configure platform, billing, security, and notification preferences." />
      <div className="space-y-5">
        {sections.map((section) => (
          <div key={section.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50/60">
              <h3 className="text-base font-semibold text-slate-900">{section.label}</h3>
              <p className="text-sm text-slate-500 mt-0.5">{section.description}</p>
            </div>
            <div className="divide-y divide-slate-100">
              {section.fields.map((field) => (
                <div key={field.id} className="flex items-center justify-between px-5 py-4">
                  <label htmlFor={field.id} className="text-sm font-medium text-slate-700">{field.label}</label>
                  {field.type === 'toggle' ? (
                    <button
                      id={field.id}
                      role="switch"
                      aria-checked={toggles[field.id]}
                      onClick={() => setToggles((prev) => ({ ...prev, [field.id]: !prev[field.id] }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#3AE7E1] focus:ring-offset-2 ${
                        toggles[field.id] ? 'bg-[#3AE7E1]' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          toggles[field.id] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  ) : (
                    <input
                      id={field.id}
                      type={field.type}
                      defaultValue={field.defaultValue as string}
                      className="w-64 px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#3AE7E1] focus:border-transparent"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3AE7E1] to-[#4CC9F0] text-[#0B1C2D] text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity">
          Save Changes
        </button>
      </div>
    </div>
  );
}
