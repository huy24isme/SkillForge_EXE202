import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { kpiSummary } from '@/features/admin/app/data/mockAnalytics';

const marginRate = ((kpiSummary.totalProfit / kpiSummary.totalRevenue) * 100).toFixed(1);

export function ReportsScreen() {
  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Executive reporting snapshots for board and leadership reviews." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Revenue Report" value="Ready" hint="Monthly business report generated" className="from-cyan-50 to-blue-100/60 border-cyan-200" />
        <StatCard label="Profit Margin" value={`${marginRate}%`} hint="Net profit over total revenue" className="from-emerald-50 to-emerald-100/70 border-emerald-200" />
        <StatCard label="Growth Summary" value="Healthy" hint="User and MRR growth are positive" className="from-violet-50 to-indigo-100/70 border-indigo-200" />
      </div>
    </div>
  );
}
