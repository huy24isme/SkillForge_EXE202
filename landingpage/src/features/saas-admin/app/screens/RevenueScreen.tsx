import { useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { TimeRangeFilter } from '@/features/saas-admin/app/components/analytics/TimeRangeFilter';
import { ChartPanel } from '@/features/saas-admin/app/components/analytics/ChartPanel';
import { LineMetricChart } from '@/features/saas-admin/app/components/analytics/LineMetricChart';
import { PieMetricChart } from '@/features/saas-admin/app/components/analytics/PieMetricChart';
import { monthlyFinance, planRevenue, topCustomers } from '@/features/saas-admin/app/data/mockAnalytics';
import { DataTableCard } from '@/features/saas-admin/app/components/analytics/DataTableCard';
import type { TimeRange, TopCustomerRow } from '@/features/saas-admin/app/types/analytics';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export function RevenueScreen() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue"
        description="Monitor recurring revenue, profitability, and plan contribution."
        action={<TimeRangeFilter value={timeRange} onChange={setTimeRange} />}
      />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartPanel
          title="Revenue by Month"
          notes={[
            'Mục tiêu: tăng trưởng đều ≥ 10% MoM — cảnh báo nếu dưới 5% liên tục 2 tháng.',
            'Tăng đột biến T11–T12 thường do chuyển đổi gói năm và Black Friday.',
          ]}
        >
          <LineMetricChart data={monthlyFinance} xKey="month" dataKey="revenue" stroke="#0ea5e9" />
        </ChartPanel>
        <ChartPanel
          title="Profit by Month"
          notes={[
            'Biên lợi nhuận > 20% là tốt. Dưới 10% biểu hiện chi phí vận hành cao bất thường.',
            'So sánh biên lợi nhuận với cùng kỳ năm trước để đánh giá hiệu quả thực sự.',
          ]}
        >
          <LineMetricChart data={monthlyFinance} xKey="month" dataKey="profit" stroke="#16a34a" />
        </ChartPanel>
        <ChartPanel
          title="Revenue by Plan"
          notes={[
            'Gói Enterprise nên đóng góp > 40% để đảm bảo ARR vững chắc.',
            'Tỷ lệ Free-tier cao là tín hiệu cần tối ưu phễu chuyển đổi lên gói trả phí.',
          ]}
        >
          <PieMetricChart data={planRevenue} nameKey="plan" valueKey="revenue" />
        </ChartPanel>
      </div>
      <DataTableCard<TopCustomerRow>
        title="Top Customers"
        subtitle="Highest revenue accounts"
        columns={[
          { key: 'customer', header: 'Customer', render: (row) => row.customer },
          { key: 'plan', header: 'Plan', render: (row) => row.plan },
          { key: 'projects', header: 'Projects', render: (row) => row.projects },
          { key: 'revenue', header: 'Revenue', render: (row) => money.format(row.revenue) },
        ]}
        rows={topCustomers}
      />
    </div>
  );
}
