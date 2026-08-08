import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  CreditCard, 
  BookOpen, 
  Settings, 
  LogOut,
  ShieldCheck,
  Star
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'overview', name: 'Tổng quan', icon: LayoutDashboard },
    { id: 'tenants', name: 'Quản lý Doanh nghiệp', icon: Building2 },
    { id: 'billing', name: 'Quản lý Gói & Tài chính', icon: CreditCard },
    { id: 'reviews', name: 'Thống kê & Đánh giá UX', icon: Star },
    { id: 'templates', name: 'Kho Thư viện Mẫu', icon: BookOpen },
    { id: 'settings', name: 'Cấu hình hệ thống', icon: Settings },
  ];

  return (
    <aside className="w-72 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 shrink-0 h-screen sticky top-0">
      {/* Header / Logo */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/20 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            SkillForge
          </h1>
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            System Admin
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
              }`} />
              <span>{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-glow" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 p-2 rounded-lg mb-2">
          <div className="w-10 h-10 rounded-full bg-blue-900 border border-blue-700 flex items-center justify-center font-bold text-blue-200 shadow-inner">
            SA
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold truncate text-slate-200">Supreme Admin</h4>
            <p className="text-xs text-slate-500 truncate">admin@skillforge.vn</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-50/55 transition-colors duration-205"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};
