import React, { useState } from 'react';
import {
  Search,
  Filter,
  Lock,
  Unlock,
  Plus,
  Eye,
  Phone,
  Mail,
  Building2,
  Trash2,
  Clock,
  CheckCircle2,
  Sparkles,
  Users,
  MessageSquare
} from 'lucide-react';
import { Tenant, CustomLead } from '../types';

interface TenantManagementProps {
  tenants: Tenant[];
  onUpdateTenantStatus: (id: string, status: 'active' | 'locked') => void;
  onAddTenant: (tenant: Omit<Tenant, 'id' | 'registeredAt'>) => void;
  customLeads?: CustomLead[];
  onUpdateCustomLeadStatus?: (id: string, status: string, dealAmount?: number) => void;
  onDeleteCustomLead?: (id: string) => void;
}

export const TenantManagement: React.FC<TenantManagementProps> = ({
  tenants,
  onUpdateTenantStatus,
  onAddTenant,
  customLeads = [],
  onUpdateCustomLeadStatus,
  onDeleteCustomLead,
}) => {
  const [activeTab, setActiveTab] = useState<'tenants' | 'custom-leads'>('tenants');

  // Search & Filter state for Tenants
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<Tenant | null>(null);
  const [actionConfirmTenant, setActionConfirmTenant] = useState<{ tenant: Tenant; action: 'lock' | 'unlock' } | null>(null);

  // Search & Filter state for Custom Leads
  const [leadSearchTerm, setLeadSearchTerm] = useState('');
  const [leadSelectedStatus, setLeadSelectedStatus] = useState<string>('All');
  const [showLeadDetailModal, setShowLeadDetailModal] = useState<CustomLead | null>(null);
  const [closeContractLead, setCloseContractLead] = useState<CustomLead | null>(null);
  const [dealAmountInput, setDealAmountInput] = useState<string>('50000000');

  // New tenant form state
  const [newTenant, setNewTenant] = useState({
    name: '',
    packageType: 'Basic' as Tenant['packageType'],
    size: '10-50',
    employeeCount: 10,
    adminName: '',
    adminEmail: '',
    status: 'active' as Tenant['status'],
  });

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenant.name || !newTenant.adminEmail) {
      alert('Vui lòng nhập tên công ty và email admin!');
      return;
    }
    onAddTenant(newTenant);
    setShowAddModal(false);
    setNewTenant({
      name: '',
      packageType: 'Basic',
      size: '10-50',
      employeeCount: 10,
      adminName: '',
      adminEmail: '',
      status: 'active',
    });
  };

  // Filter Tenants
  const filteredTenants = tenants.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.adminEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPackage = selectedPackage === 'All' || t.packageType === selectedPackage;
    const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;
    return matchesSearch && matchesPackage && matchesStatus;
  });

  // Filter Custom Leads
  const filteredCustomLeads = customLeads.filter(lead => {
    const matchesSearch = lead.companyName.toLowerCase().includes(leadSearchTerm.toLowerCase()) ||
                          lead.contactName.toLowerCase().includes(leadSearchTerm.toLowerCase()) ||
                          lead.contactEmail.toLowerCase().includes(leadSearchTerm.toLowerCase()) ||
                          lead.contactPhone.includes(leadSearchTerm);
    const matchesStatus = leadSelectedStatus === 'All' || lead.status === leadSelectedStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingLeadsCount = customLeads.filter(l => l.status === 'PENDING').length;
  const contactedLeadsCount = customLeads.filter(l => l.status === 'CONTACTED').length;
  const completedLeadsCount = customLeads.filter(l => l.status === 'COMPLETED').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('tenants')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'tenants'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Doanh nghiệp SaaS ({tenants.length})
        </button>

        <button
          onClick={() => setActiveTab('custom-leads')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all relative ${
            activeTab === 'custom-leads'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          Đăng ký Gói Tùy Chỉnh ({customLeads.length})
          {pendingLeadsCount > 0 && (
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 animate-pulse">
              {pendingLeadsCount} mới
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: TENANTS MANAGEMENT */}
      {activeTab === 'tenants' && (
        <div className="space-y-6">
          {/* Filtering Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo tên công ty hoặc email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full text-xs bg-slate-50 text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-100 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
                />
              </div>

              {/* Package filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
                <select
                  value={selectedPackage}
                  onChange={e => setSelectedPackage(e.target.value)}
                  className="w-full sm:w-auto text-xs bg-slate-50 text-slate-700 py-2.5 px-3 rounded-xl border border-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="All">Tất cả gói dịch vụ</option>
                  <option value="Basic">Gói Cơ Bản (1.000.000đ)</option>
                  <option value="Custom">Gói Tùy Chỉnh</option>
                </select>
              </div>

              {/* Status filter */}
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full sm:w-auto text-xs bg-slate-50 text-slate-700 py-2.5 px-3 rounded-xl border border-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="All">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="locked">Đang bị khóa</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs shadow-md shadow-blue-500/10 transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              Khai sinh Doanh nghiệp
            </button>
          </div>

          {/* Main Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="px-6 py-4">Tên Doanh nghiệp</th>
                    <th className="px-6 py-4">Ngày đăng ký</th>
                    <th className="px-6 py-4">Gói đang dùng</th>
                    <th className="px-6 py-4 text-center">Quy mô Nhân sự</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTenants.length > 0 ? (
                    filteredTenants.map(tenant => (
                      <tr key={tenant.id} className="hover:bg-slate-50/40 transition-colors group">
                        <td className="px-6 py-4.5 font-bold text-slate-950">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 font-black flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                              {tenant.name.charAt(0)}
                            </div>
                            <div>
                              <p>{tenant.name}</p>
                              <p className="text-[10px] text-slate-400 font-normal mt-0.5">{tenant.adminEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4.5 text-slate-500">
                          {new Date(tenant.registeredAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4.5">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            tenant.packageType === 'Custom' || tenant.packageType === 'Enterprise' || tenant.packageType === 'Growth'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-[#3AE7E1]/10 text-teal-800 border border-teal-200'
                          }`}>
                            {tenant.packageType === 'Custom' || tenant.packageType === 'Enterprise' || tenant.packageType === 'Growth' ? 'Gói Tùy Chỉnh' : 'Gói Cơ Bản'}
                          </span>
                        </td>
                        <td className="px-6 py-4.5 text-center font-semibold text-slate-700">
                          {tenant.size ? (tenant.size.includes('nhân sự') ? tenant.size : `${tenant.size} nhân sự`) : `${tenant.employeeCount} nhân sự`}
                        </td>
                        <td className="px-6 py-4.5">
                          <select
                            value={tenant.status}
                            onChange={(e) => {
                              const newStatus = e.target.value as 'active' | 'locked';
                              if (newStatus === 'locked') {
                                setActionConfirmTenant({ tenant, action: 'lock' });
                              } else {
                                setActionConfirmTenant({ tenant, action: 'unlock' });
                              }
                            }}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border focus:outline-none cursor-pointer ${
                              tenant.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            <option value="active">🟢 Đang hoạt động</option>
                            <option value="locked">🔒 Đang bị khóa</option>
                          </select>
                        </td>
                        <td className="px-6 py-4.5 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setShowDetailModal(tenant)}
                              className="p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {tenant.status === 'active' ? (
                              <button
                                onClick={() => setActionConfirmTenant({ tenant, action: 'lock' })}
                                className="p-1.5 rounded-lg border border-rose-100 bg-rose-50/30 hover:bg-rose-50 text-rose-600 transition-colors"
                                title="Khóa tài khoản"
                              >
                                <Lock className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => setActionConfirmTenant({ tenant, action: 'unlock' })}
                                className="p-1.5 rounded-lg border border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50 text-emerald-600 transition-colors"
                                title="Mở khóa tài khoản"
                              >
                                <Unlock className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        Không tìm thấy doanh nghiệp nào phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOM PLAN LEADS MANAGEMENT */}
      {activeTab === 'custom-leads' && (
        <div className="space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Chờ tư vấn</p>
                <p className="text-xl font-black text-slate-900">{pendingLeadsCount}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Đã tư vấn</p>
                <p className="text-xl font-black text-slate-900">{contactedLeadsCount}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Đã chốt hợp đồng</p>
                <p className="text-xl font-black text-slate-900">{completedLeadsCount}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Tổng đăng ký</p>
                <p className="text-xl font-black text-slate-900">{customLeads.length}</p>
              </div>
            </div>
          </div>

          {/* Filtering Header for Custom Leads */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo tên công ty, họ tên, email hoặc SĐT..."
                  value={leadSearchTerm}
                  onChange={e => setLeadSearchTerm(e.target.value)}
                  className="w-full text-xs bg-slate-50 text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-100 focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
                <select
                  value={leadSelectedStatus}
                  onChange={e => setLeadSelectedStatus(e.target.value)}
                  className="w-full sm:w-auto text-xs bg-slate-50 text-slate-700 py-2.5 px-3 rounded-xl border border-slate-100 focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="All">Tất cả trạng thái tư vấn</option>
                  <option value="PENDING">⏳ Chờ liên hệ (Pending)</option>
                  <option value="CONTACTED">📞 Đã tư vấn (Contacted)</option>
                  <option value="COMPLETED">✅ Đã chốt HĐ (Completed)</option>
                  <option value="CANCELLED">❌ Đã hủy (Cancelled)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table of Custom Leads */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="px-6 py-4">Doanh nghiệp & Quy mô</th>
                    <th className="px-6 py-4">Người liên hệ & SĐT</th>
                    <th className="px-6 py-4">Yêu cầu tùy chỉnh</th>
                    <th className="px-6 py-4">Ngày đăng ký</th>
                    <th className="px-6 py-4">Trạng thái tư vấn</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCustomLeads.length > 0 ? (
                    filteredCustomLeads.map(lead => (
                      <tr key={lead.id} className="hover:bg-slate-50/40 transition-colors group">
                        <td className="px-6 py-4.5 font-bold text-slate-950">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 font-black flex items-center justify-center">
                              {lead.companyName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{lead.companyName}</p>
                              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                                {lead.companySize || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4.5">
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-900">{lead.contactName}</p>
                            <p className="text-slate-500 text-[11px] flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <a href={`mailto:${lead.contactEmail}`} className="hover:underline hover:text-purple-600">
                                {lead.contactEmail}
                              </a>
                            </p>
                            <p className="text-purple-700 font-bold text-[11px] flex items-center gap-1">
                              <Phone className="w-3 h-3 text-purple-500" />
                              <a href={`tel:${lead.contactPhone}`} className="hover:underline">
                                {lead.contactPhone}
                              </a>
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4.5 max-w-xs">
                          <p className="text-slate-600 line-clamp-2 italic">
                            {lead.customRequirements || 'Chưa nhập ghi chú'}
                          </p>
                        </td>

                        <td className="px-6 py-4.5 text-slate-500">
                          {new Date(lead.createdAt).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>

                        <td className="px-6 py-4.5">
                          <select
                            value={lead.status}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              if (newStatus === 'COMPLETED') {
                                setCloseContractLead(lead);
                                setDealAmountInput(lead.dealAmount ? lead.dealAmount.toString() : '50000000');
                              } else if (onUpdateCustomLeadStatus) {
                                onUpdateCustomLeadStatus(lead.id, newStatus);
                              }
                            }}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border focus:outline-none cursor-pointer ${
                              lead.status === 'PENDING'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : lead.status === 'CONTACTED'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : lead.status === 'COMPLETED'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            <option value="PENDING">⏳ Chờ liên hệ</option>
                            <option value="CONTACTED">📞 Đã tư vấn</option>
                            <option value="COMPLETED">✅ Đã chốt HĐ</option>
                            <option value="CANCELLED">❌ Đã hủy</option>
                          </select>
                        </td>

                        <td className="px-6 py-4.5 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setShowLeadDetailModal(lead)}
                              className="p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors"
                              title="Xem thông tin chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {onDeleteCustomLead && (
                              <button
                                onClick={() => onDeleteCustomLead(lead.id)}
                                className="p-1.5 rounded-lg border border-rose-100 bg-rose-50/30 hover:bg-rose-50 text-rose-600 transition-colors"
                                title="Xóa yêu cầu"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        Chưa có yêu cầu tư vấn Gói Tùy Chỉnh nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: View Custom Lead Details */}
      {showLeadDetailModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Chi tiết Yêu cầu Tư vấn Gói Tùy Chỉnh</h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                showLeadDetailModal.status === 'PENDING'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : showLeadDetailModal.status === 'CONTACTED'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : showLeadDetailModal.status === 'COMPLETED'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {showLeadDetailModal.status === 'PENDING' ? '⏳ Chờ liên hệ' :
                 showLeadDetailModal.status === 'CONTACTED' ? '📞 Đã tư vấn' :
                 showLeadDetailModal.status === 'COMPLETED' ? '✅ Đã chốt HĐ' : '❌ Đã hủy'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Doanh nghiệp:</span>
                  <span className="font-bold text-slate-900">{showLeadDetailModal.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Quy mô nhân sự:</span>
                  <span className="font-bold text-purple-700">{showLeadDetailModal.companySize || 'Chưa rõ'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ngày gửi đăng ký:</span>
                  <span className="font-medium text-slate-700">
                    {new Date(showLeadDetailModal.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>

              <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-xl space-y-2">
                <p className="font-bold text-purple-900 text-xs flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-purple-600" />
                  Thông tin Người Đại diện Liên hệ:
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1 text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Họ và tên:</span>
                    <span className="font-bold">{showLeadDetailModal.contactName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Số điện thoại:</span>
                    <a href={`tel:${showLeadDetailModal.contactPhone}`} className="font-bold text-purple-700 hover:underline">
                      {showLeadDetailModal.contactPhone}
                    </a>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px]">Email công việc:</span>
                    <a href={`mailto:${showLeadDetailModal.contactEmail}`} className="font-bold text-blue-600 hover:underline">
                      {showLeadDetailModal.contactEmail}
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                  Ghi chú & Yêu cầu Tùy chỉnh riêng:
                </label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 leading-relaxed min-h-[80px]">
                  {showLeadDetailModal.customRequirements || 'Doanh nghiệp chưa nhập ghi chú tùy chỉnh.'}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              {showLeadDetailModal.status !== 'COMPLETED' ? (
                <button
                  onClick={() => {
                    setCloseContractLead(showLeadDetailModal);
                    setDealAmountInput(showLeadDetailModal.dealAmount ? showLeadDetailModal.dealAmount.toString() : '50000000');
                    setShowLeadDetailModal(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Chốt Hợp đồng & Điền Doanh thu
                </button>
              ) : (
                <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                  Doanh thu đã chốt: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(showLeadDetailModal.dealAmount || 0)}
                </div>
              )}
              <button
                onClick={() => setShowLeadDetailModal(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-50 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Enter Closed Contract Revenue */}
      {closeContractLead && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-[70] animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Sparkles className="w-6 h-6 text-emerald-500 animate-bounce" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Xác nhận Chốt Hợp đồng Gói Tùy Chỉnh</h3>
                <p className="text-xs text-slate-500">Nhập doanh thu thực tế để tính vào Doanh thu tổng & Gói tùy chỉnh</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Doanh nghiệp:</span>
                <span className="font-bold text-slate-900">{closeContractLead.companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Người đại diện:</span>
                <span className="font-semibold text-slate-700">{closeContractLead.contactName} ({closeContractLead.contactPhone})</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Giá trị Hợp đồng đã chốt (VNĐ) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="0"
                  step="1000000"
                  value={dealAmountInput}
                  onChange={(e) => setDealAmountInput(e.target.value)}
                  placeholder="Ví dụ: 50000000"
                  className="w-full text-sm font-black text-emerald-700 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              {/* Formatted Preview */}
              <div className="flex items-center justify-between text-xs px-1">
                <span className="text-slate-400">Xem trước số tiền:</span>
                <span className="font-extrabold text-emerald-600 text-sm">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(dealAmountInput) || 0)}
                </span>
              </div>

              {/* Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['20000000', '50000000', '100000000', '200000000'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDealAmountInput(preset)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    {(parseInt(preset) / 1000000)} triệu
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCloseContractLead(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  const amount = parseFloat(dealAmountInput) || 0;
                  if (onUpdateCustomLeadStatus) {
                    onUpdateCustomLeadStatus(closeContractLead.id, 'COMPLETED', amount);
                  }
                  setCloseContractLead(null);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Xác nhận Chốt HĐ & Tính Doanh Thu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: View Details for Tenant */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Chi tiết Doanh nghiệp</h3>
            
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
                <div>
                  <p className="text-slate-400 mb-1">Tên Doanh nghiệp</p>
                  <p className="font-bold text-slate-900 text-sm">{showDetailModal.name}</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Trạng thái</p>
                  <span className={`inline-flex px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    showDetailModal.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {showDetailModal.status === 'active' ? 'Đang hoạt động' : 'Đang bị khóa'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-400">Người đại diện (Admin)</span>
                  <span className="font-semibold text-slate-900">{showDetailModal.adminName || showDetailModal.name + ' Admin'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-400">Email quản trị</span>
                  <span className="font-semibold text-slate-900">{showDetailModal.adminEmail}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-400">Ngày đăng ký hệ thống</span>
                  <span className="font-semibold text-slate-900">
                    {new Date(showDetailModal.registeredAt).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-400">Gói sản phẩm hiện tại</span>
                  <span className="font-bold text-blue-600">{showDetailModal.packageType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-400">Quy mô nhân sự</span>
                  <span className="font-semibold text-slate-900">
                    {showDetailModal.size ? (showDetailModal.size.includes('nhân sự') ? showDetailModal.size : `${showDetailModal.size} nhân sự`) : `${showDetailModal.employeeCount} nhân sự`}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDetailModal(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-50 transition-colors"
              >
                Đóng
              </button>
              {showDetailModal.status === 'active' ? (
                <button
                  onClick={() => {
                    setActionConfirmTenant({ tenant: showDetailModal, action: 'lock' });
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-rose-500/10 transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Khóa doanh nghiệp
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActionConfirmTenant({ tenant: showDetailModal, action: 'unlock' });
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-emerald-500/10 transition-colors flex items-center gap-1.5"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  Mở khóa kích hoạt
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Lock / Unlock Confirmation */}
      {actionConfirmTenant && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-[60] animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md p-6 text-center space-y-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
              actionConfirmTenant.action === 'lock' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
            }`}>
              {actionConfirmTenant.action === 'lock' ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {actionConfirmTenant.action === 'lock' ? 'Xác nhận Khóa Doanh Nghiệp?' : 'Xác nhận Mở Khóa Doanh Nghiệp?'}
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {actionConfirmTenant.action === 'lock' ? (
                  <>
                    Bạn đang thực hiện khóa doanh nghiệp <span className="font-bold text-slate-900">{actionConfirmTenant.tenant.name}</span>. Khi bị khóa, toàn bộ tài khoản nhân sự và quản trị thuộc doanh nghiệp này sẽ lập tức bị đình chỉ truy cập hệ thống SkillForge.
                  </>
                ) : (
                  <>
                    Bạn có chắc chắn muốn mở khóa doanh nghiệp <span className="font-bold text-slate-900">{actionConfirmTenant.tenant.name}</span>? Khi mở khóa, tất cả tài khoản quản trị và nhân sự thuộc doanh nghiệp này sẽ được khôi phục quyền truy cập vào hệ thống SkillForge.
                  </>
                )}
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setActionConfirmTenant(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  const targetStatus = actionConfirmTenant.action === 'lock' ? 'locked' : 'active';
                  onUpdateTenantStatus(actionConfirmTenant.tenant.id, targetStatus);
                  if (showDetailModal?.id === actionConfirmTenant.tenant.id) {
                    setShowDetailModal(null);
                  }
                  setActionConfirmTenant(null);
                }}
                className={`px-5 py-2 font-bold rounded-xl text-xs shadow-lg transition-all flex items-center gap-1.5 text-white ${
                  actionConfirmTenant.action === 'lock'
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                }`}
              >
                {actionConfirmTenant.action === 'lock' ? (
                  <>
                    <Lock className="w-3.5 h-3.5" /> Xác nhận Khóa Ngay
                  </>
                ) : (
                  <>
                    <Unlock className="w-3.5 h-3.5" /> Xác nhận Mở Khóa Ngay
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Tenant */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Khởi tạo Doanh nghiệp mới (Tenant)</h3>
            
            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Tên Doanh nghiệp *</label>
                <input
                  type="text"
                  required
                  placeholder="Công ty CP Tech..."
                  value={newTenant.name}
                  onChange={e => setNewTenant({ ...newTenant, name: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Gói Dịch vụ</label>
                  <select
                    value={newTenant.packageType}
                    onChange={e => setNewTenant({ ...newTenant, packageType: e.target.value as Tenant['packageType'] })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Basic">Gói Cơ Bản (1.000.000đ)</option>
                    <option value="Custom">Gói Tùy Chỉnh</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Quy mô nhân sự</label>
                  <select
                    value={newTenant.size}
                    onChange={e => setNewTenant({ ...newTenant, size: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="1-10">1 - 10 nhân sự</option>
                    <option value="10-50">10 - 50 nhân sự</option>
                    <option value="50-100">50 - 100 nhân sự</option>
                    <option value="100-500">100 - 500 nhân sự</option>
                    <option value="500+">Trên 500 nhân sự</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Tên Quản trị viên (Admin)</label>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={newTenant.adminName}
                  onChange={e => setNewTenant({ ...newTenant, adminName: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Email Quản trị viên *</label>
                <input
                  type="email"
                  required
                  placeholder="admin@company.com"
                  value={newTenant.adminEmail}
                  onChange={e => setNewTenant({ ...newTenant, adminEmail: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-blue-500/10 transition-colors"
                >
                  Khởi tạo Doanh nghiệp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
