export type TimeRange = '7d' | '30d' | '3m' | '1y';

export type KpiSummary = {
  totalUsers: number;
  activeUsers: number;
  payingUsers: number;
  mrr: number;
  totalRevenue: number;
  totalProfit: number;
};

export type MonthlyFinancePoint = {
  month: string;
  revenue: number;
  profit: number;
};

export type MonthlyUsersPoint = {
  month: string;
  newUsers: number;
  dailyActiveUsers: number;
  conversionRate: number;
};

export type PlanRevenuePoint = {
  plan: string;
  revenue: number;
};

export type FeatureUsagePoint = {
  feature: string;
  usage: number;
};

export type SubscriptionRow = {
  id: string;
  user: string;
  plan: 'Free' | 'Starter' | 'Pro' | 'Enterprise';
  price: number;
  startDate: string;
  status: 'Active' | 'Trial' | 'Cancelled' | 'Past Due';
};

export type PaymentRow = {
  id: string;
  user: string;
  amount: number;
  paymentDate: string;
  status: 'Completed' | 'Pending' | 'Failed';
};

export type TopCustomerRow = {
  id: string;
  customer: string;
  plan: string;
  revenue: number;
  projects: number;
};

export type SystemLogRow = {
  id: string;
  event: 'New user registered' | 'Subscription upgraded' | 'Subscription cancelled' | 'Payment completed';
  actor: string;
  timestamp: string;
};
