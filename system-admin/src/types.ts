export interface Tenant {
  id: string;
  name: string;
  taxCode?: string;
  industry?: string;
  size?: string;
  logo?: string;
  registeredAt: string;
  packageType: 'Basic' | 'Custom' | 'Starter' | 'Growth' | 'Enterprise';
  employeeCount: number;
  status: 'active' | 'locked';
  adminName: string;
  adminEmail: string;
}

export interface Invoice {
  id: string;
  invoiceCode: string;
  tenantId: string;
  tenantName: string;
  packageType: 'Basic' | 'Custom' | 'Starter' | 'Growth' | 'Enterprise';
  cycle: 'monthly' | 'yearly';
  amount: number; // in VND
  paymentMethod: 'momo' | 'vnpay' | 'bank_transfer' | 'payos_vietqr' | (string & {});
  status: 'success' | 'pending' | 'failed';
  createdAt: string;
}

export interface KpiTemplate {
  id: string;
  department: string;
  name: string;
  target: string;
  unit: string;
  frequency: 'monthly' | 'quarterly' | 'yearly';
  description: string;
}

export interface BscTemplate {
  id: string;
  industry: string;
  perspective: 'Financial' | 'Customer' | 'Internal Process' | 'Learning & Growth';
  objective: string;
  description: string;
}

export interface AuditLog {
  id: string;
  adminName: string;
  action: string;
  target: string;
  timestamp: string;
  ipAddress: string;
}

export interface CustomLead {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  companySize: string;
  customRequirements: string;
  dealAmount?: number;
  status: 'PENDING' | 'CONTACTED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface UserReview {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  feature: string;
  content: string;
  likes: number;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  createdAt: string;
}

export interface TrafficSourceItem {
  platform: 'facebook' | 'linkedin' | 'tiktok' | 'direct' | 'other';
  name: string;
  count: number;
  percentage: number;
  growth: string;
  color: string;
  bgColor: string;
}

export interface MetricReportRow {
  week: number;
  facebookReach: number;
  websiteVisits: number;
  totalUsers: number;
  conversionRate: string;
}

export interface TrafficAnalytics {
  totalVisits: number;
  facebookReachTotal?: number;
  sources: TrafficSourceItem[];
  metricsTable?: MetricReportRow[];
  weeklyTrend?: { day: string; facebook: number; tiktok: number; linkedin: number; direct: number }[];
}
