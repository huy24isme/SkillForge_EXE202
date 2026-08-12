import api from './api';
import { Tenant, Invoice, KpiTemplate, BscTemplate, AuditLog, CustomLead, UserReview } from '../types';

export interface PlanDto {
  id: string;
  name: string;
  code: string;
  monthlyPrice: number;
  yearlyPrice: number;
  maxEmployees: number;
  description: string;
  active: boolean;
}

export interface TenantDto {
  id: string;
  name: string;
  taxCode: string;
  industry: string;
  size: string;
  status: string; // ACTIVE | INACTIVE
  planCode: string; // STARTER | GROWTH | ENTERPRISE
  planName: string;
  employeeCount: number;
  adminEmail: string;
  createdAt: string;
}

export interface InvoiceDto {
  id: string;
  invoiceCode: string;
  companyId: string;
  companyName: string;
  planCode: string;
  planName: string;
  cycle: string; // MONTHLY | YEARLY
  amount: number;
  paymentMethod: string;
  status: string; // PENDING | SUCCESS | FAILED
  paidAt?: string;
  note?: string;
  createdAt: string;
}

export interface KpiTemplateDto {
  id: string;
  department: string;
  name: string;
  target: string;
  unit: string;
  frequency: string; // MONTHLY | QUARTERLY | YEARLY
  description: string;
  active: boolean;
  createdAt: string;
}

export interface BscTemplateDto {
  id: string;
  industry: string;
  perspective: string; // FINANCIAL | CUSTOMER | INTERNAL_PROCESS | LEARNING_GROWTH
  objective: string;
  description: string;
  active: boolean;
  createdAt: string;
}

export interface AuditLogDto {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  target: string;
  ipAddress: string;
  createdAt: string;
}

export interface SystemSettingDto {
  id: string;
  key: string;
  value: string;
  description: string;
}

export interface DashboardStatsDto {
  totalTenants: number;
  activeTenants: number;
  lockedTenants: number;
  totalInvoices: number;
  pendingInvoices: number;
  totalRevenue: number;
  totalKpiTemplates: number;
  totalBscTemplates: number;
}

// Helper functions to map DTOs to UI types

function mapPlanCodeToPackageType(code: string): 'Basic' | 'Custom' {
  if (code === 'CUSTOM' || code === 'ENTERPRISE' || code === 'GROWTH') return 'Custom';
  return 'Basic';
}

export function mapTenantDto(dto: TenantDto): Tenant {
  return {
    id: dto.id,
    name: dto.name,
    registeredAt: dto.createdAt ? dto.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
    packageType: mapPlanCodeToPackageType(dto.planCode),
    employeeCount: dto.employeeCount,
    status: dto.status === 'ACTIVE' ? 'active' : 'locked',
    adminName: dto.name + ' Admin', // Dummy name or just general
    adminEmail: dto.adminEmail,
  };
}

export function mapInvoiceDto(dto: InvoiceDto): Invoice {
  return {
    id: dto.id,
    invoiceCode: dto.invoiceCode,
    tenantId: dto.companyId,
    tenantName: dto.companyName,
    packageType: mapPlanCodeToPackageType(dto.planCode),
    cycle: dto.cycle.toLowerCase() === 'yearly' ? 'yearly' : 'monthly',
    amount: dto.amount,
    paymentMethod: dto.paymentMethod.toLowerCase() as any,
    status: dto.status.toLowerCase() as any,
    createdAt: dto.createdAt ? dto.createdAt.replace('T', ' ').slice(0, 16) : '',
  };
}

export function mapKpiTemplateDto(dto: KpiTemplateDto): KpiTemplate {
  return {
    id: dto.id,
    department: dto.department,
    name: dto.name,
    target: dto.target,
    unit: dto.unit,
    frequency: dto.frequency.toLowerCase() as any,
    description: dto.description || '',
  };
}

export function mapBscTemplateDto(dto: BscTemplateDto): BscTemplate {
  let perspective: BscTemplate['perspective'] = 'Financial';
  if (dto.perspective === 'CUSTOMER') perspective = 'Customer';
  else if (dto.perspective === 'INTERNAL_PROCESS') perspective = 'Internal Process';
  else if (dto.perspective === 'LEARNING_GROWTH') perspective = 'Learning & Growth';

  return {
    id: dto.id,
    industry: dto.industry,
    perspective,
    objective: dto.objective,
    description: dto.description || '',
  };
}

export function mapAuditLogDto(dto: AuditLogDto): AuditLog {
  return {
    id: dto.id,
    adminName: dto.adminName,
    action: dto.action,
    target: dto.target || '',
    timestamp: dto.createdAt ? dto.createdAt.replace('T', ' ').slice(0, 16) : '',
    ipAddress: dto.ipAddress,
  };
}

export const systemAdminService = {
  // Authentication
  login: async (email: string, password: string): Promise<{ token: string; admin: any }> => {
    const res: any = await api.post('/sa/auth/login', { email, password });
    return {
      token: res.accessToken,
      admin: res.admin,
    };
  },

  // Dashboard Stats
  getDashboardStats: (): Promise<DashboardStatsDto> => api.get('/sa/dashboard'),

  // Plans
  getPlans: (): Promise<PlanDto[]> => api.get('/sa/plans'),

  // Tenants
  getTenants: async (): Promise<Tenant[]> => {
    const dtos: TenantDto[] = await api.get('/sa/tenants');
    return dtos.map(mapTenantDto);
  },

  createTenant: async (data: Omit<Tenant, 'id' | 'registeredAt'> & { planId: string; adminPassword?: string }): Promise<Tenant> => {
    const reqBody = {
      companyName: data.name,
      taxCode: '',
      industry: 'Công nghệ',
      size: '50-100',
      planId: data.planId,
      adminName: data.adminName,
      adminEmail: data.adminEmail,
      adminPassword: data.adminPassword || 'Admin@123456', // default
      cycle: 'monthly',
      paymentMethod: 'bank_transfer',
    };
    const dto: TenantDto = await api.post('/sa/tenants', reqBody);
    return mapTenantDto(dto);
  },

  updateTenantStatus: async (id: string, status: 'active' | 'locked'): Promise<Tenant> => {
    const backendStatus = status === 'active' ? 'ACTIVE' : 'LOCKED';
    const dto: TenantDto = await api.patch(`/sa/tenants/${id}/status`, { status: backendStatus }, {
      params: { status: backendStatus },
    });
    return mapTenantDto(dto);
  },

  // Invoices
  getInvoices: async (): Promise<Invoice[]> => {
    const dtos: InvoiceDto[] = await api.get('/sa/invoices', {
      params: { page: 0, size: 100 },
    });
    return dtos.map(mapInvoiceDto);
  },

  updateInvoiceStatus: async (id: string, status: 'success' | 'pending' | 'failed'): Promise<Invoice> => {
    const backendStatus = status.toUpperCase();
    const dto: InvoiceDto = await api.patch(`/sa/invoices/${id}/status`, { status: backendStatus }, {
      params: { status: backendStatus },
    });
    return mapInvoiceDto(dto);
  },

  deleteInvoice: (id: string): Promise<void> => api.delete(`/sa/invoices/${id}`),

  // KPI Templates
  getKpis: async (): Promise<KpiTemplate[]> => {
    const dtos: KpiTemplateDto[] = await api.get('/sa/templates/kpi');
    return dtos.map(mapKpiTemplateDto);
  },

  addKpi: async (data: Omit<KpiTemplate, 'id'>): Promise<KpiTemplate> => {
    const reqBody = {
      department: data.department,
      name: data.name,
      target: data.target,
      unit: data.unit,
      frequency: data.frequency.toUpperCase(),
      description: data.description,
    };
    const dto: KpiTemplateDto = await api.post('/sa/templates/kpi', reqBody);
    return mapKpiTemplateDto(dto);
  },

  deleteKpi: (id: string): Promise<void> => api.delete(`/sa/templates/kpi/${id}`),

  // BSC Templates
  getBscs: async (): Promise<BscTemplate[]> => {
    const dtos: BscTemplateDto[] = await api.get('/sa/templates/bsc');
    return dtos.map(mapBscTemplateDto);
  },

  addBsc: async (data: Omit<BscTemplate, 'id'>): Promise<BscTemplate> => {
    let perspective = 'FINANCIAL';
    if (data.perspective === 'Customer') perspective = 'CUSTOMER';
    else if (data.perspective === 'Internal Process') perspective = 'INTERNAL_PROCESS';
    else if (data.perspective === 'Learning & Growth') perspective = 'LEARNING_GROWTH';

    const reqBody = {
      industry: data.industry,
      perspective,
      objective: data.objective,
      description: data.description,
    };
    const dto: BscTemplateDto = await api.post('/sa/templates/bsc', reqBody);
    return mapBscTemplateDto(dto);
  },

  deleteBsc: (id: string): Promise<void> => api.delete(`/sa/templates/bsc/${id}`),

  // Audit Logs
  getAuditLogs: async (): Promise<AuditLog[]> => {
    const dtos: AuditLogDto[] = await api.get('/sa/audit-logs', {
      params: { page: 0, size: 50 },
    });
    return dtos.map(mapAuditLogDto);
  },

  // Settings
  getSettings: (): Promise<SystemSettingDto[]> => api.get('/sa/settings'),

  updateSettings: (settings: { key: string; value: string }[]): Promise<SystemSettingDto[]> =>
    api.post('/sa/settings', { settings }),

  // Custom Plan Leads
  getCustomLeads: (): Promise<CustomLead[]> => api.get('/sa/custom-leads'),

  updateCustomLeadStatus: async (id: string, status: string, dealAmount?: number): Promise<CustomLead> => {
    return api.patch(`/sa/custom-leads/${id}/status`, { status, dealAmount: dealAmount || 0 }, { params: { status, dealAmount: dealAmount || 0 } });
  },

  deleteCustomLead: (id: string): Promise<void> => api.delete(`/sa/custom-leads/${id}`),

  // User Reviews & UX Analytics
  getReviews: async (): Promise<{ reviews: UserReview[]; stats: any; featureBreakdown: any[] }> => {
    return api.get('/sa/reviews');
  },

  updateReviewStatus: (id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING'): Promise<UserReview> =>
    api.patch(`/sa/reviews/${id}/status`, { status }),

  deleteReview: (id: string): Promise<void> => api.delete(`/sa/reviews/${id}`),
};
