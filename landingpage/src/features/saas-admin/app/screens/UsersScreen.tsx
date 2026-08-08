import { useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { TimeRangeFilter } from '@/features/saas-admin/app/components/analytics/TimeRangeFilter';
import { ChartPanel } from '@/features/saas-admin/app/components/analytics/ChartPanel';
import { monthlyUsers } from '@/features/saas-admin/app/data/mockAnalytics';
import { LineMetricChart } from '@/features/saas-admin/app/components/analytics/LineMetricChart';
import { BarMetricChart } from '@/features/saas-admin/app/components/analytics/BarMetricChart';
import type { TimeRange } from '@/features/saas-admin/app/types/analytics';

export function UsersScreen() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Track user growth, engagement, and conversion behavior."
        action={<TimeRangeFilter value={timeRange} onChange={setTimeRange} />}
      />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartPanel
          title="New Users per Month"
          subtitle="Acquisition velocity"
          notes={[
            'Mục tiêu thu hút: ≥ 8% MoM để duy trì tăng trưởng kép.',
            'Sụt giảm liên tiếp 2 tháng → cần kiểm tra chiến dịch và kênh acquisition ngay.',
          ]}
        >
          <BarMetricChart data={monthlyUsers} xKey="month" barKey="newUsers" fill="#0ea5e9" />
        </ChartPanel>
        <ChartPanel
          title="Daily Active Users"
          subtitle="Engagement trend"
          notes={[
            'Tỷ lệ DAU/MAU > 40% là dấu hiệu sản phẩm có độ gắn kết cao (sticky product).',
            'DAU giảm trong khi người dùng mới tăng → vấn đề onboarding hoặc giữ chân.',
          ]}
        >
          <LineMetricChart data={monthlyUsers} xKey="month" dataKey="dailyActiveUsers" stroke="#16a34a" />
        </ChartPanel>
      </div>
      <ChartPanel
        title="Conversion Rate"
        subtitle="Trial users converted to paid users (%)"
        notes={[
          'Chuẩn ngành SaaS: 15–25% chuyển đổi trial sang trả phí là tốt.',
          'Tỷ lệ dưới 10% → xem lại luồng nâng cấp, email nurture, hoặc rút ngắn thời gian trial.',
          'Tỷ lệ tăng đều qua các tháng cho thấy product-market fit đang cải thiện.',
        ]}
      >
        <LineMetricChart data={monthlyUsers} xKey="month" dataKey="conversionRate" stroke="#f59e0b" />
      </ChartPanel>
    </div>
  );
}
