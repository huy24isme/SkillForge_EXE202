import { PageHeader } from '@/components/dashboard/PageHeader';
import { DataTableCard } from '@/features/admin/app/components/analytics/DataTableCard';
import { systemLogs } from '@/features/admin/app/data/mockAnalytics';
import type { SystemLogRow } from '@/features/admin/app/types/analytics';

export function SystemLogsScreen() {
  return (
    <div className="space-y-6">
      <PageHeader title="System Logs" description="Recent platform activities for audit and incident tracing." />
      <DataTableCard<SystemLogRow>
        title="Recent Events"
        subtitle="New user registered, subscription updated, payment completed"
        columns={[
          { key: 'event', header: 'Event', render: (row) => row.event },
          { key: 'actor', header: 'Actor', render: (row) => row.actor },
          { key: 'timestamp', header: 'Timestamp', render: (row) => row.timestamp },
        ]}
        rows={systemLogs}
      />
    </div>
  );
}
