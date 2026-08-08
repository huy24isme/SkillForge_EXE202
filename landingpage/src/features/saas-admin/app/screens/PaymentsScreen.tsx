import { useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { TimeRangeFilter } from '@/features/saas-admin/app/components/analytics/TimeRangeFilter';
import { DataTableCard } from '@/features/saas-admin/app/components/analytics/DataTableCard';
import { payments } from '@/features/saas-admin/app/data/mockAnalytics';
import type { PaymentRow, TimeRange } from '@/features/saas-admin/app/types/analytics';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export function PaymentsScreen() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="Track payment transactions and settlement outcomes."
        action={<TimeRangeFilter value={timeRange} onChange={setTimeRange} />}
      />
      <DataTableCard<PaymentRow>
        title="Payment History"
        subtitle="User | Amount | Payment Date | Status"
        columns={[
          { key: 'user', header: 'User', render: (row) => row.user },
          { key: 'amount', header: 'Amount', render: (row) => money.format(row.amount) },
          { key: 'paymentDate', header: 'Payment Date', render: (row) => row.paymentDate },
          { key: 'status', header: 'Status', render: (row) => {
            const colors: Record<PaymentRow['status'], string> = {
              Completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
              Pending: 'bg-amber-100 text-amber-700 border-amber-200',
              Failed: 'bg-rose-100 text-rose-700 border-rose-200',
            };
            return <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${colors[row.status]}`}>{row.status}</span>;
          }},
        ]}
        rows={payments}
      />
    </div>
  );
}
