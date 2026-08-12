import { useState, useEffect, useCallback } from 'react';
import { Tenant, Invoice, KpiTemplate, BscTemplate, AuditLog, CustomLead } from './types';
import { systemAdminService, PlanDto } from './services/systemAdminService';

export const useSystemAdmin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Core system resources
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [kpis, setKpis] = useState<KpiTemplate[]>([]);
  const [bscs, setBscs] = useState<BscTemplate[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [plans, setPlans] = useState<PlanDto[]>([]);
  const [customLeads, setCustomLeads] = useState<CustomLead[]>([]);

  // Check login on mount
  useEffect(() => {
    const raw = localStorage.getItem('system-admin-auth');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.token) {
          setIsLoggedIn(true);
        }
      } catch {
        localStorage.removeItem('system-admin-auth');
      }
    }
  }, []);

  // Fetch all master data from API
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tenantsRes, invoicesRes, kpisRes, bscsRes, auditLogsRes, plansRes, customLeadsRes] = await Promise.all([
        systemAdminService.getTenants(),
        systemAdminService.getInvoices(),
        systemAdminService.getKpis(),
        systemAdminService.getBscs(),
        systemAdminService.getAuditLogs(),
        systemAdminService.getPlans(),
        systemAdminService.getCustomLeads()
      ]);

      setTenants(tenantsRes);
      setInvoices(invoicesRes);
      setKpis(kpisRes);
      setBscs(bscsRes);
      setAuditLogs(auditLogsRes);
      setPlans(plansRes);
      setCustomLeads(customLeadsRes);
    } catch (err: any) {
      console.error('Failed to load system data:', err);
      setError(err?.message || 'Không thể đồng bộ dữ liệu hệ thống.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync data whenever logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchAllData();
    }
  }, [isLoggedIn, fetchAllData]);

  // Auth actions
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await systemAdminService.login(email, password);
      localStorage.setItem('system-admin-auth', JSON.stringify({ token: res.token, email }));
      setIsLoggedIn(true);
      return true;
    } catch (err: any) {
      setError(err?.message || 'Email hoặc mật khẩu không đúng.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('system-admin-auth');
    setIsLoggedIn(false);
    // clear memory state
    setTenants([]);
    setInvoices([]);
    setKpis([]);
    setBscs([]);
    setAuditLogs([]);
  };

  // Mutator actions mapped to system endpoints
  const handleUpdateTenantStatus = async (id: string, status: 'active' | 'locked') => {
    try {
      const updated = await systemAdminService.updateTenantStatus(id, status);
      setTenants(prev => prev.map(t => t.id === id ? updated : t));
      // Refresh audit logs
      const updatedLogs = await systemAdminService.getAuditLogs();
      setAuditLogs(updatedLogs);
    } catch (err: any) {
      alert('Không thể cập nhật trạng thái doanh nghiệp: ' + err.message);
    }
  };

  const handleAddTenant = async (newTenantData: Omit<Tenant, 'id' | 'registeredAt'>) => {
    try {
      // Find Starter plan id as default if plans exist
      const starterPlan = plans.find(p => p.code === mapPackageTypeToPlanCode(newTenantData.packageType)) || plans[0];
      if (!starterPlan) {
        throw new Error('Không tìm thấy gói dịch vụ tương ứng trên hệ thống.');
      }

      const created = await systemAdminService.createTenant({
        ...newTenantData,
        planId: starterPlan.id
      });

      setTenants(prev => [created, ...prev]);

      // Refresh invoices and audit logs
      const [updatedInvoices, updatedLogs] = await Promise.all([
        systemAdminService.getInvoices(),
        systemAdminService.getAuditLogs()
      ]);
      setInvoices(updatedInvoices);
      setAuditLogs(updatedLogs);
    } catch (err: any) {
      alert('Không thể khai sinh doanh nghiệp: ' + err.message);
    }
  };

  const handleAddKpi = async (newKpiData: Omit<KpiTemplate, 'id'>) => {
    try {
      const created = await systemAdminService.addKpi(newKpiData);
      setKpis(prev => [created, ...prev]);
      // Refresh audit logs
      const updatedLogs = await systemAdminService.getAuditLogs();
      setAuditLogs(updatedLogs);
    } catch (err: any) {
      alert('Không thể tạo KPI mẫu: ' + err.message);
    }
  };

  const handleAddBsc = async (newBscData: Omit<BscTemplate, 'id'>) => {
    try {
      const created = await systemAdminService.addBsc(newBscData);
      setBscs(prev => [created, ...prev]);
      // Refresh audit logs
      const updatedLogs = await systemAdminService.getAuditLogs();
      setAuditLogs(updatedLogs);
    } catch (err: any) {
      alert('Không thể tạo BSC mẫu: ' + err.message);
    }
  };

  const handleUpdateInvoiceStatus = async (id: string, status: 'success' | 'pending' | 'failed') => {
    try {
      const updated = await systemAdminService.updateInvoiceStatus(id, status);
      setInvoices(prev => prev.map(inv => inv.id === id ? updated : inv));
      // Refresh audit logs
      const updatedLogs = await systemAdminService.getAuditLogs();
      setAuditLogs(updatedLogs);
    } catch (err: any) {
      alert('Không thể cập nhật hóa đơn: ' + err.message);
    }
  };

  const handleUpdateCustomLeadStatus = async (id: string, status: string, dealAmount?: number) => {
    try {
      const updated = await systemAdminService.updateCustomLeadStatus(id, status, dealAmount);
      setCustomLeads(prev => prev.map(lead => lead.id === id ? updated : lead));
      
      // Also refresh invoices and tenants so Overview & Revenue statistics update automatically
      const [updatedInvoices, updatedTenants, updatedLogs] = await Promise.all([
        systemAdminService.getInvoices(),
        systemAdminService.getTenants(),
        systemAdminService.getAuditLogs()
      ]);
      setInvoices(updatedInvoices);
      setTenants(updatedTenants);
      setAuditLogs(updatedLogs);
    } catch (err: any) {
      alert('Không thể cập nhật trạng thái yêu cầu tư vấn: ' + err.message);
    }
  };

  const handleDeleteCustomLead = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa yêu cầu tư vấn này?')) return;
    try {
      await systemAdminService.deleteCustomLead(id);
      setCustomLeads(prev => prev.filter(lead => lead.id !== id));
      const updatedLogs = await systemAdminService.getAuditLogs();
      setAuditLogs(updatedLogs);
    } catch (err: any) {
      alert('Không thể xóa yêu cầu tư vấn: ' + err.message);
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa lịch sử giao dịch/hóa đơn này khỏi hệ thống? Dữ liệu công ty chờ tương ứng (nếu chưa kích hoạt) cũng sẽ được dọn dẹp.')) return;
    try {
      await systemAdminService.deleteInvoice(id);
      setInvoices(prev => prev.filter(inv => inv.id !== id));
      const [updatedTenants, updatedLogs] = await Promise.all([
        systemAdminService.getTenants(),
        systemAdminService.getAuditLogs()
      ]);
      setTenants(updatedTenants);
      setAuditLogs(updatedLogs);
    } catch (err: any) {
      alert('Không thể xóa hóa đơn giao dịch: ' + err.message);
    }
  };

  return {
    isLoggedIn,
    loading,
    error,
    tenants,
    invoices,
    kpis,
    bscs,
    auditLogs,
    plans,
    customLeads,
    login,
    logout,
    fetchAllData,
    handleUpdateTenantStatus,
    handleAddTenant,
    handleAddKpi,
    handleAddBsc,
    handleUpdateInvoiceStatus,
    handleDeleteInvoice,
    handleUpdateCustomLeadStatus,
    handleDeleteCustomLead
  };
};

function mapPackageTypeToPlanCode(pkg: Tenant['packageType']): string {
  if (pkg === 'Custom' || pkg === 'Enterprise' || pkg === 'Growth') return 'CUSTOM';
  return 'STARTER';
}
