import type {
  FeatureUsagePoint,
  KpiSummary,
  MonthlyFinancePoint,
  MonthlyUsersPoint,
  PaymentRow,
  PlanRevenuePoint,
  SubscriptionRow,
  SystemLogRow,
  TopCustomerRow,
} from '@/features/admin/app/types/analytics';

export const kpiSummary: KpiSummary = {
  totalUsers: 18240,
  activeUsers: 12410,
  payingUsers: 4380,
  mrr: 248500,
  totalRevenue: 1920000,
  totalProfit: 714000,
};

export const monthlyFinance: MonthlyFinancePoint[] = [
  { month: 'Jan', revenue: 140000, profit: 48000 },
  { month: 'Feb', revenue: 156000, profit: 53000 },
  { month: 'Mar', revenue: 163000, profit: 57000 },
  { month: 'Apr', revenue: 177000, profit: 62000 },
  { month: 'May', revenue: 189000, profit: 69000 },
  { month: 'Jun', revenue: 201000, profit: 74000 },
  { month: 'Jul', revenue: 211000, profit: 79000 },
  { month: 'Aug', revenue: 224000, profit: 85000 },
  { month: 'Sep', revenue: 236000, profit: 90000 },
  { month: 'Oct', revenue: 247000, profit: 94000 },
  { month: 'Nov', revenue: 261000, profit: 99000 },
  { month: 'Dec', revenue: 276000, profit: 105000 },
];

export const planRevenue: PlanRevenuePoint[] = [
  { plan: 'Starter', revenue: 62000 },
  { plan: 'Pro', revenue: 132000 },
  { plan: 'Enterprise', revenue: 210000 },
  { plan: 'Free Upsell', revenue: 18000 },
];

export const monthlyUsers: MonthlyUsersPoint[] = [
  { month: 'Jan', newUsers: 900, dailyActiveUsers: 6100, conversionRate: 9.8 },
  { month: 'Feb', newUsers: 980, dailyActiveUsers: 6550, conversionRate: 10.4 },
  { month: 'Mar', newUsers: 1040, dailyActiveUsers: 7000, conversionRate: 10.9 },
  { month: 'Apr', newUsers: 1160, dailyActiveUsers: 7600, conversionRate: 11.2 },
  { month: 'May', newUsers: 1230, dailyActiveUsers: 8120, conversionRate: 11.8 },
  { month: 'Jun', newUsers: 1340, dailyActiveUsers: 8750, conversionRate: 12.1 },
  { month: 'Jul', newUsers: 1410, dailyActiveUsers: 9300, conversionRate: 12.6 },
  { month: 'Aug', newUsers: 1490, dailyActiveUsers: 9860, conversionRate: 13.1 },
  { month: 'Sep', newUsers: 1580, dailyActiveUsers: 10420, conversionRate: 13.4 },
  { month: 'Oct', newUsers: 1660, dailyActiveUsers: 11000, conversionRate: 13.9 },
  { month: 'Nov', newUsers: 1730, dailyActiveUsers: 11680, conversionRate: 14.2 },
  { month: 'Dec', newUsers: 1820, dailyActiveUsers: 12410, conversionRate: 14.9 },
];

export const featureUsage: FeatureUsagePoint[] = [
  { feature: 'Create Project', usage: 10420 },
  { feature: 'Create Task', usage: 45210 },
  { feature: 'Invite Member', usage: 8190 },
  { feature: 'Comment', usage: 28630 },
];

export const subscriptions: SubscriptionRow[] = [
  { id: 'SUB-001', user: 'Acme Labs', plan: 'Enterprise', price: 2500, startDate: '2026-01-14', status: 'Active' },
  { id: 'SUB-002', user: 'Nova Team', plan: 'Pro', price: 590, startDate: '2026-02-08', status: 'Active' },
  { id: 'SUB-003', user: 'Pixel Studio', plan: 'Starter', price: 190, startDate: '2026-03-01', status: 'Trial' },
  { id: 'SUB-004', user: 'BlueOcean Co', plan: 'Pro', price: 590, startDate: '2025-10-10', status: 'Past Due' },
  { id: 'SUB-005', user: 'Mira Group', plan: 'Starter', price: 190, startDate: '2025-09-20', status: 'Cancelled' },
  { id: 'SUB-006', user: 'Kite Ventures', plan: 'Enterprise', price: 2500, startDate: '2025-12-17', status: 'Active' },
];

export const payments: PaymentRow[] = [
  { id: 'PAY-001', user: 'Acme Labs', amount: 2500, paymentDate: '2026-03-12', status: 'Completed' },
  { id: 'PAY-002', user: 'Nova Team', amount: 590, paymentDate: '2026-03-11', status: 'Completed' },
  { id: 'PAY-003', user: 'BlueOcean Co', amount: 590, paymentDate: '2026-03-09', status: 'Pending' },
  { id: 'PAY-004', user: 'Mira Group', amount: 190, paymentDate: '2026-03-07', status: 'Failed' },
  { id: 'PAY-005', user: 'Kite Ventures', amount: 2500, paymentDate: '2026-03-05', status: 'Completed' },
  { id: 'PAY-006', user: 'Pixel Studio', amount: 190, paymentDate: '2026-03-03', status: 'Completed' },
];

export const topCustomers: TopCustomerRow[] = [
  { id: 'CUST-001', customer: 'Acme Labs', plan: 'Enterprise', revenue: 81200, projects: 42 },
  { id: 'CUST-002', customer: 'Kite Ventures', plan: 'Enterprise', revenue: 70100, projects: 37 },
  { id: 'CUST-003', customer: 'Nova Team', plan: 'Pro', revenue: 31200, projects: 24 },
  { id: 'CUST-004', customer: 'BlueOcean Co', plan: 'Pro', revenue: 22800, projects: 19 },
  { id: 'CUST-005', customer: 'Pixel Studio', plan: 'Starter', revenue: 9700, projects: 13 },
];

export const systemLogs: SystemLogRow[] = [
  { id: 'LOG-001', event: 'New user registered', actor: 'hello@novateam.io', timestamp: '2026-03-15 08:20' },
  { id: 'LOG-002', event: 'Subscription upgraded', actor: 'Acme Labs', timestamp: '2026-03-15 07:48' },
  { id: 'LOG-003', event: 'Payment completed', actor: 'Kite Ventures', timestamp: '2026-03-15 07:10' },
  { id: 'LOG-004', event: 'Subscription cancelled', actor: 'Mira Group', timestamp: '2026-03-14 17:36' },
  { id: 'LOG-005', event: 'Payment completed', actor: 'Nova Team', timestamp: '2026-03-14 14:02' },
  { id: 'LOG-006', event: 'New user registered', actor: 'admin@pixelstudio.com', timestamp: '2026-03-14 11:49' },
];
