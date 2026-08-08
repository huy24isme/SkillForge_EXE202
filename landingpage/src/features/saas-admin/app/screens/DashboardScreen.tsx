import { useMemo, useState } from 'react';
import { Users, UserCheck, CreditCard, TrendingUp, DollarSign, BarChart2 } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { kpiSummary, monthlyFinance, monthlyUsers, payments, planRevenue, subscriptions, systemLogs, topCustomers, featureUsage } from '@/features/saas-admin/app/data/mockAnalytics';
import { ChartPanel } from '@/features/saas-admin/app/components/analytics/ChartPanel';
import { DataTableCard } from '@/features/saas-admin/app/components/analytics/DataTableCard';
import { KpiCard } from '@/features/saas-admin/app/components/analytics/KpiCard';
import { LineMetricChart } from '@/features/saas-admin/app/components/analytics/LineMetricChart';
import { PieMetricChart } from '@/features/saas-admin/app/components/analytics/PieMetricChart';
import { BarMetricChart } from '@/features/saas-admin/app/components/analytics/BarMetricChart';
import { TimeRangeFilter } from '@/features/saas-admin/app/components/analytics/TimeRangeFilter';
import type { PaymentRow, SubscriptionRow, SystemLogRow, TimeRange, TopCustomerRow } from '@/features/saas-admin/app/types/analytics';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export function DashboardScreen() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [planFilter, setPlanFilter] = useState<'All' | SubscriptionRow['plan']>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | SubscriptionRow['status']>('All');

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((row) => (planFilter === 'All' || row.plan === planFilter) && (statusFilter === 'All' || row.status === statusFilter));
  }, [planFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Overview"
        description="Executive analytics dashboard for revenue, profit, user growth, subscription activity, and platform health."
        className="from-cyan-50 via-sky-50 to-indigo-50"
        action={<TimeRangeFilter value={timeRange} onChange={setTimeRange} />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <KpiCard label="Total Users" value={kpiSummary.totalUsers.toLocaleString()} delta="+8.2% vs previous period"
          icon={<Users className="w-6 h-6 text-blue-600" />}
          gradient="from-blue-50 to-cyan-50 border-blue-200"
        />
        <KpiCard label="Active Users" value={kpiSummary.activeUsers.toLocaleString()} delta="+5.4% engagement"
          icon={<UserCheck className="w-6 h-6 text-emerald-600" />}
          gradient="from-emerald-50 to-teal-50 border-emerald-200"
        />
        <KpiCard label="Paying Users" value={kpiSummary.payingUsers.toLocaleString()} delta="+6.9% subscriptions"
          icon={<CreditCard className="w-6 h-6 text-violet-600" />}
          gradient="from-violet-50 to-indigo-50 border-violet-200"
        />
        <KpiCard label="MRR" value={money.format(kpiSummary.mrr)} delta="+7.1% month-over-month"
          icon={<TrendingUp className="w-6 h-6 text-amber-600" />}
          gradient="from-amber-50 to-orange-50 border-amber-200"
        />
        <KpiCard label="Total Revenue" value={money.format(kpiSummary.totalRevenue)} delta="+14.3% annual growth"
          icon={<DollarSign className="w-6 h-6 text-sky-600" />}
          gradient="from-sky-50 to-blue-50 border-sky-200"
        />
        <KpiCard label="Total Profit" value={money.format(kpiSummary.totalProfit)} delta="+11.8% operating margin"
          icon={<BarChart2 className="w-6 h-6 text-green-600" />}
          gradient="from-green-50 to-emerald-50 border-green-200"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartPanel
          title="Revenue by Month"
          subtitle="Recurring + add-on revenue trend"
          notes={[
            'Mục tiêu tăng trưởng lành mạnh: ≥ 10% MoM — cảnh báo nếu tăng trưởng dưới 5% liên tục 2 tháng.',
            'Tăng đột biến vào T11–T12 thường do chuyển đổi gói năm cuối kỳ.',
          ]}
        >
          <LineMetricChart data={monthlyFinance} xKey="month" dataKey="revenue" stroke="#0284c7" />
        </ChartPanel>
        <ChartPanel
          title="Profit by Month"
          subtitle="Net operational profit trend"
          notes={[
            'Biên lợi nhuận > 20% là tốt. Dưới 10% cho thấy chi phí vận hành cần tối ưu.',
            'Biên lợi nhuận thấp trong tháng tăng trưởng cao là bình thường — thường phục hồi vào Q4.',
          ]}
        >
          <LineMetricChart data={monthlyFinance} xKey="month" dataKey="profit" stroke="#16a34a" />
        </ChartPanel>
        <ChartPanel
          title="Revenue by Subscription Plan"
          subtitle="Plan contribution share"
          notes={[
            'Gói Enterprise nên chiếm > 40% tổng doanh thu để đảm bảo ARR ổn định.',
            'Tỷ lệ Free-tier cao là cơ hội cải thiện phễu chuyển đổi lên gói trả phí.',
          ]}
        >
          <PieMetricChart data={planRevenue} nameKey="plan" valueKey="revenue" />
        </ChartPanel>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartPanel
          title="New Users per Month"
          subtitle="Acquisition volume by month"
          notes={[
            'Mục tiêu thu hút: ≥ 8% MoM để duy trì tăng trưởng kép.',
            'Sụt giảm người dùng mới cần kiểm tra ngay chiến dịch marketing và phễu đăng ký.',
          ]}
        >
          <BarMetricChart data={monthlyUsers} xKey="month" barKey="newUsers" fill="#0891b2" />
        </ChartPanel>
        <ChartPanel
          title="Daily Active Users"
          subtitle="Monthly DAU trend"
          notes={[
            'Tỷ lệ DAU/MAU > 40% là dấu hiệu sản phẩm có độ gắn kết cao.',
            'DAU giảm trong khi người dùng mới tăng → vấn đề onboarding hoặc giữ chân người dùng.',
          ]}
        >
          <LineMetricChart data={monthlyUsers} xKey="month" dataKey="dailyActiveUsers" stroke="#4f46e5" />
        </ChartPanel>
        <ChartPanel
          title="Conversion Rate (Trial → Paying)"
          subtitle="% of trial users converting to paid plans"
          notes={[
            'Chuẩn ngành: 15–25% chuyển đổi trial sang trả phí.',
            'Tỷ lệ dưới 10% cho thấy rào cản trong luồng nâng cấp hoặc giá trị trial chưa đủ thuyết phục.',
          ]}
        >
          <LineMetricChart data={monthlyUsers} xKey="month" dataKey="conversionRate" stroke="#f59e0b" />
        </ChartPanel>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
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
              },
            },
          ]}
          rows={filteredSubscriptions}
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Filters</h3>
          <p className="text-sm text-slate-500 mt-1">Filter subscriptions by plan and status</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
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

          <div className="mt-5 border-t border-slate-200 pt-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Top Customers</h4>
            <div className="space-y-2">
              {topCustomers.slice(0, 4).map((customer) => (
                <div key={customer.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">{customer.customer}</span>
                  <span className="font-medium text-slate-900">{money.format(customer.revenue)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <DataTableCard<PaymentRow>
          title="Payment History"
          subtitle="User | Amount | Payment Date | Status"
          columns={[
            { key: 'user', header: 'User', render: (row) => <span className="font-medium text-slate-900">{row.user}</span> },
            { key: 'amount', header: 'Amount', render: (row) => money.format(row.amount) },
            { key: 'paymentDate', header: 'Payment Date', render: (row) => row.paymentDate },
            { key: 'status', header: 'Status', render: (row) => {
                const colors: Record<PaymentRow['status'], string> = {
                  Completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
                  Failed: 'bg-rose-100 text-rose-700 border-rose-200',
                };
                return <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${colors[row.status]}`}>{row.status}</span>;
              },
            },
          ]}
          rows={payments}
        />

        <DataTableCard<TopCustomerRow>
          title="Top Customers"
          subtitle="Highest revenue generating customers"
          columns={[
            { key: 'customer', header: 'Customer', render: (row) => <span className="font-medium text-slate-900">{row.customer}</span> },
            { key: 'plan', header: 'Plan', render: (row) => row.plan },
            { key: 'projects', header: 'Projects', render: (row) => row.projects },
            { key: 'revenue', header: 'Revenue', render: (row) => money.format(row.revenue) },
          ]}
          rows={topCustomers}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartPanel
          title="Feature Usage Analytics"
          subtitle="Most-used product actions"
          notes={[
            'Top 2 tính năng chiếm > 70% lượt dùng — đây là vùng ưu tiên cải thiện UX.',
            'Tính năng ít dùng cần đánh giá lại UX hoặc cân nhắc loại bỏ để giảm tải hệ thống.',
          ]}
        >
          <BarMetricChart data={featureUsage} xKey="feature" barKey="usage" fill="#6366f1" />
        </ChartPanel>

        <DataTableCard<SystemLogRow>
          title="System Activity Logs"
          subtitle="Recent events across the platform"
          columns={[
            { key: 'event', header: 'Event', render: (row) => row.event },
            { key: 'actor', header: 'Actor', render: (row) => row.actor },
            { key: 'timestamp', header: 'Timestamp', render: (row) => row.timestamp },
          ]}
          rows={systemLogs}
        />
      </div>
    </div>
  );
}
