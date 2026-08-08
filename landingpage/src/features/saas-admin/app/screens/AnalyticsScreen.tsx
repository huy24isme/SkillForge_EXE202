import { useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { TimeRangeFilter } from '@/features/saas-admin/app/components/analytics/TimeRangeFilter';
import { featureUsage, monthlyUsers } from '@/features/saas-admin/app/data/mockAnalytics';
import type { TimeRange } from '@/features/saas-admin/app/types/analytics';
import { ChartPanel } from '@/features/saas-admin/app/components/analytics/ChartPanel';
import { BarMetricChart } from '@/features/saas-admin/app/components/analytics/BarMetricChart';
import { LineMetricChart } from '@/features/saas-admin/app/components/analytics/LineMetricChart';

export function AnalyticsScreen() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Product usage analytics and behavioral trends across the platform."
        action={<TimeRangeFilter value={timeRange} onChange={setTimeRange} />}
      />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartPanel
          title="Feature Usage"
          subtitle="Most used features"
          notes={[
            'Top 2 tính năng chiếm > 70% lượt dùng — ưu tiên cải thiện tốc độ và UX ở đây.',
            'Tính năng ít dùng (<5%) cần đánh giá lại: nâng cao discoverability hoặc loại bỏ.',
            'Theo dõi sự thay đổi ranking hàng tháng để phát hiện xu hướng hành vi người dùng.',
          ]}
        >
          <BarMetricChart data={featureUsage} xKey="feature" barKey="usage" fill="#6366f1" />
        </ChartPanel>
        <ChartPanel
          title="Conversion Rate"
          subtitle="Trial to paid conversion (%)"
          notes={[
            'Chuẩn ngành SaaS B2B: 15–25% là mức tốt, trên 30% là xuất sắc.',
            'Tỷ lệ dưới 10% → kiểm tra email onboarding, in-app nudges và giá trị trial.',
            'Tỷ lệ tăng đều là chỉ báo tốt về product-market fit đang cải thiện.',
          ]}
        >
          <LineMetricChart data={monthlyUsers} xKey="month" dataKey="conversionRate" stroke="#f59e0b" />
        </ChartPanel>
      </div>
    </div>
  );
}
