import React, { useState } from 'react';
import { Search, Filter, CreditCard, Wallet, ArrowUpRight, TrendingUp, Trash2 } from 'lucide-react';
import { Invoice } from '../types';

interface BillingRevenueProps {
  invoices: Invoice[];
  onUpdateInvoiceStatus?: (id: string, status: 'success' | 'pending' | 'failed') => void;
  onDeleteInvoice?: (id: string) => void;
}

const formatVND = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export const BillingRevenue: React.FC<BillingRevenueProps> = ({ invoices, onUpdateInvoiceStatus, onDeleteInvoice }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [methodFilter, setMethodFilter] = useState<string>('All');

  // Compute metrics dynamically from current state
  const totalPaid = invoices
    .filter(inv => inv.status === 'success')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalPending = invoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalFailed = invoices
    .filter(inv => inv.status === 'failed')
    .reduce((sum, inv) => sum + inv.amount, 0);

  // Filter logic
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.invoiceCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    const matchesMethod = methodFilter === 'All' || inv.paymentMethod === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getMethodLabel = (method: Invoice['paymentMethod']) => {
    switch (method) {
      case 'momo':
        return 'Cổng MoMo';
      case 'vnpay':
        return 'Cổng VNPAY';
      case 'payos_vietqr':
        return 'VietQR / PayOS';
      case 'bank_transfer':
        return 'Chuyển khoản Ngân hàng';
      default:
        return method;
    }
  };

  const getMethodBadgeClass = (method: Invoice['paymentMethod']) => {
    switch (method) {
      case 'momo':
        return 'bg-pink-50 text-pink-700 border-pink-100';
      case 'vnpay':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'payos_vietqr':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold';
      case 'bank_transfer':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Revenue summary widget cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl text-white shadow-md border border-slate-800 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Doanh thu thực thu</p>
              <h3 className="text-xl font-black mt-2 tracking-tight">{formatVND(totalPaid)}</h3>
            </div>
            <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-4 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-emerald-400" />
            Doanh thu đã xử lý hoàn tất trên cổng thanh toán
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Đang chờ xử lý</p>
              <h3 className="text-xl font-bold text-slate-900 mt-2 tracking-tight">{formatVND(totalPending)}</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-4">
            Đang chờ doanh nghiệp hoàn thành thủ tục thanh toán
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Thanh toán thất bại</p>
              <h3 className="text-xl font-bold text-slate-900 mt-2 tracking-tight">{formatVND(totalFailed)}</h3>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-rose-500 font-semibold mt-4">
            Cần đối soát hoặc liên hệ hỗ trợ nâng cấp gói
          </p>
        </div>
      </div>

      {/* Invoice Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo Mã hóa đơn hoặc Doanh nghiệp..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-slate-50 text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-100 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto text-xs bg-slate-50 text-slate-700 py-2.5 px-3 rounded-xl border border-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="success">Thành công</option>
              <option value="pending">Đang xử lý</option>
              <option value="failed">Thất bại</option>
            </select>
          </div>

          {/* Payment Method filter */}
          <select
            value={methodFilter}
            onChange={e => setMethodFilter(e.target.value)}
            className="w-full sm:w-auto text-xs bg-slate-50 text-slate-700 py-2.5 px-3 rounded-xl border border-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="All">Tất cả phương thức</option>
            <option value="momo">Cổng MoMo</option>
            <option value="vnpay">Cổng VNPAY</option>
            <option value="bank_transfer">Chuyển khoản</option>
          </select>
        </div>

        <div className="text-xs text-slate-400 font-semibold shrink-0">
          Hiển thị <span className="text-slate-700">{filteredInvoices.length}</span> hóa đơn
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Mã hóa đơn</th>
                <th className="px-6 py-4">Tên Doanh nghiệp</th>
                <th className="px-6 py-4">Gói dịch vụ</th>
                <th className="px-6 py-4">Số tiền</th>
                <th className="px-6 py-4">Phương thức</th>
                <th className="px-6 py-4">Ngày giao dịch</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 tracking-wider">
                      {inv.invoiceCode}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {inv.tenantName}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.packageType === 'Custom' || inv.packageType === 'Enterprise' || inv.packageType === 'Growth'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-[#3AE7E1]/10 text-teal-800 border border-teal-200'
                      }`}>
                        {inv.packageType === 'Custom' || inv.packageType === 'Enterprise' || inv.packageType === 'Growth' ? 'Gói Tùy Chỉnh' : 'Gói Cơ Bản'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900">
                      {formatVND(inv.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded border text-[10px] font-medium ${getMethodBadgeClass(inv.paymentMethod)}`}>
                        {getMethodLabel(inv.paymentMethod)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {inv.createdAt}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {onUpdateInvoiceStatus ? (
                        <select
                          value={inv.status}
                          onChange={(e) => onUpdateInvoiceStatus(inv.id, e.target.value as any)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border focus:outline-none cursor-pointer ${
                            inv.status === 'success'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : inv.status === 'pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          <option value="pending">⏳ Đang xử lý</option>
                          <option value="success">✅ Thành công</option>
                          <option value="failed">❌ Thất bại / Hủy</option>
                        </select>
                      ) : (
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'success'
                            ? 'bg-emerald-50 text-emerald-700'
                            : inv.status === 'pending'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-rose-50 text-rose-700'
                        }`}>
                          {inv.status === 'success' ? 'Thành công' : inv.status === 'pending' ? 'Đang xử lý' : 'Thất bại'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {onDeleteInvoice && (
                        <button
                          onClick={() => onDeleteInvoice(inv.id)}
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                          title="Xóa giao dịch này"
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    Không tìm thấy hóa đơn lịch sử thanh toán nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
