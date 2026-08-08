import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { DataTableCard } from '@/features/saas-admin/app/components/analytics/DataTableCard';
import { subscriptions } from '@/features/saas-admin/app/data/mockAnalytics';
import type { SubscriptionRow } from '@/features/saas-admin/app/types/analytics';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export function SubscriptionsScreen() {
  const [planFilter, setPlanFilter] = useState<'All' | SubscriptionRow['plan']>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | SubscriptionRow['status']>('All');

  const rows = useMemo(
    () => subscriptions.filter((row) => (planFilter === 'All' || row.plan === planFilter) && (statusFilter === 'All' || row.status === statusFilter)),
    [planFilter, statusFilter]
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Subscriptions" description="Manage subscription plans and lifecycle activity." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value as 'All' | SubscriptionRow['plan'])} className="px-3 py-2.5 rounded-lg border border-slate-300 bg-white">
          <option value="All">All plans</option>
          <option value="Free">Free</option>
          <option value="Starter">Starter</option>
          <option value="Pro">Pro</option>
          <option value="Enterprise">Enterprise</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'All' | SubscriptionRow['status'])} className="px-3 py-2.5 rounded-lg border border-slate-300 bg-white">
          <option value="All">All status</option>
          <option value="Active">Active</option>
          <option value="Trial">Trial</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Past Due">Past Due</option>
        </select>
      </div>
      <DataTableCard<SubscriptionRow>
        title="Subscription Management"
        subtitle="User | Plan | Price | Start Date | Status"
        columns={[
          { key: 'user', header: 'User', render: (row) => <span className="font-medium text-slate-900">{row.user}</span> },
          { key: 'plan', header: 'Plan', render: (row) => row.plan },
          { key: 'price', header: 'Price', render: (row) => money.format(row.price) },
          { key: 'startDate', header: 'Start Date', render: (row) => row.startDate },
          { key: 'status', header: 'Status', render: (row) => {
            const colors: Record<SubscriptionRow['status'], string> = {
              Active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
              Trial: 'bg-blue-100 text-blue-700 border-blue-200',
              Cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
              'Past Due': 'bg-amber-100 text-amber-700 border-amber-200',
            };
            return <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${colors[row.status]}`}>{row.status}</span>;
          }},
        ]}
        rows={rows}
      />
    </div>
  );
}
