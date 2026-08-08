import React, { useState } from 'react';
import { Save, Mail, ShieldAlert, Key, HardDrive, List } from 'lucide-react';
import { AuditLog } from '../types';

interface SettingsPageProps {
  auditLogs: AuditLog[];
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ auditLogs }) => {
  const [plans, setPlans] = useState([
    { id: 'basic', name: 'Gói Cơ Bản (Basic)', price: 1000000, usersLimit: '50 tài khoản', isCustom: false },
    { id: 'custom', name: 'Gói Tùy Chỉnh (Custom)', price: 0, usersLimit: 'Không giới hạn (Theo HĐ)', isCustom: true },
  ]);

  const [smtp, setSmtp] = useState({
    host: 'smtp.sendgrid.net',
    port: '587',
    sender: 'no-reply@skillforge.vn',
    authEnabled: true,
  });

  const [backup] = useState({
    autoBackup: true,
    frequency: 'daily',
    retentionDays: 30,
    storage: 'Google Cloud Storage',
  });

  const handlePlanPriceChange = (id: string, newPrice: number) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, price: newPrice } : p));
  };

  const handleSaveSettings = () => {
    alert('Đã lưu toàn bộ cấu hình hệ thống thành công!');
  };

  const handleTriggerBackup = () => {
    alert('Bắt đầu quá trình sao lưu nóng cơ sở dữ liệu... Hoàn tất: SkillForge_Backup_Manual_Active.sql (184MB)');
  };

  const handleTestSmtp = () => {
    alert('Gửi thử nghiệm email thành công tới admin@skillforge.vn qua cổng SendGrid.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Pricing Plans & Server SMTP */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Subscriptions Plan Setup */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2 pb-3 border-b border-slate-50">
              <Key className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Cấu hình Đơn giá & Hạn mức Gói dịch vụ</h3>
                <p className="text-[10px] text-slate-400">Thay đổi đơn giá sẽ tự động áp dụng vào kỳ lập hóa đơn tiếp theo</p>
              </div>
            </div>

            <div className="space-y-4">
              {plans.map(plan => (
                <div key={plan.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-slate-50 p-4 rounded-xl">
                  <div className="font-bold text-slate-800 text-xs">
                    {plan.name}
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold block mb-1">Đơn giá (VNĐ / Tháng)</label>
                    {plan.isCustom ? (
                      <input
                        type="text"
                        disabled
                        value="Thỏa thuận theo HĐ"
                        className="w-full text-xs font-bold px-3 py-2 bg-purple-50/50 border border-purple-100 rounded-lg text-purple-700 cursor-not-allowed"
                      />
                    ) : (
                      <input
                        type="number"
                        value={plan.price}
                        onChange={e => handlePlanPriceChange(plan.id, parseInt(e.target.value) || 0)}
                        className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold block mb-1">Hạn mức Nhân sự</label>
                    <input
                      type="text"
                      disabled
                      value={plan.usersLimit}
                      className="w-full text-xs px-3 py-2 bg-white/60 border border-slate-100 rounded-lg text-slate-500 font-medium cursor-not-allowed"
                    />
                  </div>
                  <div className="flex justify-end">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      plan.isCustom ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      Đang phân phối
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Email Server SMTP */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2 pb-3 border-b border-slate-50">
              <Mail className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Cổng gửi Email hệ thống (SMTP)</h3>
                <p className="text-[10px] text-slate-400">Dùng cho mục đích xác nhận hóa đơn, cấp tài khoản và khôi phục mật khẩu</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-semibold uppercase">SMTP Host</label>
                <input
                  type="text"
                  value={smtp.host}
                  onChange={e => setSmtp(prev => ({ ...prev, host: e.target.value }))}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-semibold uppercase">Port</label>
                <input
                  type="text"
                  value={smtp.port}
                  onChange={e => setSmtp(prev => ({ ...prev, port: e.target.value }))}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-semibold uppercase">Sender Address</label>
                <input
                  type="email"
                  value={smtp.sender}
                  onChange={e => setSmtp(prev => ({ ...prev, sender: e.target.value }))}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
              <div className="flex items-end pb-1.5">
                <button
                  type="button"
                  onClick={handleTestSmtp}
                  className="w-full text-xs font-semibold py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Gửi email test thử
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Database Backups */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2 pb-3 border-b border-slate-50">
              <HardDrive className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Sao lưu cơ sở dữ liệu</h3>
                <p className="text-[10px] text-slate-400">Sao lưu định kỳ dữ liệu đa doanh nghiệp</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Tự động sao lưu:</span>
                <span className="font-semibold text-slate-800">
                  {backup.autoBackup ? 'Đang bật' : 'Đang tắt'} ({backup.frequency})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Lưu giữ bản sao lưu:</span>
                <span className="font-semibold text-slate-800">Trong vòng {backup.retentionDays} ngày</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Nơi lưu trữ:</span>
                <span className="font-semibold text-slate-800">{backup.storage}</span>
              </div>
              
              <button
                type="button"
                onClick={handleTriggerBackup}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-colors mt-2"
              >
                <HardDrive className="w-4 h-4" />
                Khởi chạy Sao lưu nóng ngay
              </button>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-500 space-y-2">
            <p className="font-bold text-slate-700 flex items-center gap-1">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
              Khuyến nghị Bảo mật tối cao
            </p>
            <p className="leading-relaxed">
              Vui lòng không cung cấp API keys, SMTP passwords hay các khóa khôi phục cơ sở dữ liệu cho bất cứ ai ngoài Quản trị viên tối cao. Hệ thống tự động ghi nhật ký IP truy cập đáng ngờ.
            </p>
          </div>
        </div>
      </div>

      {/* Row: Platform Security Audit Trail Logs */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-2 pb-3 border-b border-slate-50">
          <List className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Nhật ký Hoạt động Quản trị (Security Audit Logs)</h3>
            <p className="text-[10px] text-slate-400">Các thao tác làm thay đổi hệ thống hoặc gói dịch vụ khách hàng</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-500">
            <thead>
              <tr className="border-b border-slate-100 pb-2 text-slate-400 font-semibold">
                <th className="py-2.5">Quản trị viên</th>
                <th className="py-2.5">Hành động thực hiện</th>
                <th className="py-2.5">Tác nhân chịu ảnh hưởng</th>
                <th className="py-2.5">Thời gian thực hiện</th>
                <th className="py-2.5 text-right">Địa chỉ IP truy cập</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 font-semibold text-slate-800">{log.adminName}</td>
                  <td className="py-3 text-slate-600">{log.action}</td>
                  <td className="py-3 font-medium text-slate-700">{log.target}</td>
                  <td className="py-3 text-slate-400">{log.timestamp}</td>
                  <td className="py-3 text-right font-mono text-[10px] text-slate-500">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Form Footer Save */}
      <div className="flex justify-end p-4 bg-slate-50 border border-slate-100 rounded-xl">
        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/10 transition-colors"
        >
          <Save className="w-4 h-4" />
          Lưu toàn bộ thay đổi cấu hình
        </button>
      </div>
    </div>
  );
};
