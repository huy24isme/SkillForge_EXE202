import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, ChevronDown, CheckCircle, AlertTriangle, Info, User, LogOut } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  desc: string;
  type: 'info' | 'success' | 'warning';
  time: string;
  read: boolean;
}

interface TopbarProps {
  activeTabName: string;
  onLogout: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ activeTabName, onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Doanh nghiệp đăng ký mới',
      desc: 'Coolmate vừa hoàn tất biểu mẫu đăng ký dịch vụ.',
      type: 'info',
      time: '10 phút trước',
      read: false,
    },
    {
      id: '2',
      title: 'Hóa đơn quá hạn',
      desc: 'Hóa đơn của Hòa Phát Group (SKF-2026-010) chưa được thanh toán.',
      type: 'warning',
      time: '2 giờ trước',
      read: false,
    },
    {
      id: '3',
      title: 'Giao dịch thành công',
      desc: 'FPT Software đã thanh toán hóa đơn năm SKF-2026-001.',
      type: 'success',
      time: '5 giờ trước',
      read: true,
    },
    {
      id: '4',
      title: 'Tài khoản bị khóa',
      desc: 'Hệ thống tự động tạm khóa Vinamilk do hết hạn gói.',
      type: 'warning',
      time: '1 ngày trước',
      read: true,
    },
  ]);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getBg = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50';
      case 'warning':
        return 'bg-amber-50';
      default:
        return 'bg-blue-50';
    }
  };

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm shadow-slate-100/40">
      {/* Title / Breadcrumb */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <span>SkillForge SaaS Platform</span>
          <span>/</span>
          <span className="text-slate-500">Hệ thống tối cao</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mt-0.5">{activeTabName}</h2>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative w-64 hidden md:block">
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm nhanh hệ thống..."
            className="w-full text-sm bg-slate-50 text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2 rounded-xl border border-slate-100 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl border border-slate-100 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors duration-200 relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-500 border-2 border-white text-[10px] font-bold text-white flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-96 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="font-bold text-slate-900">Thông báo hệ thống</h4>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>
              <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-50">
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`p-4 hover:bg-slate-50 transition-colors duration-150 flex gap-3 ${
                        !notif.read ? 'bg-blue-50/20' : ''
                      }`}
                    >
                      <div className={`p-2 rounded-lg shrink-0 h-fit ${getBg(notif.type)}`}>
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold text-slate-800 ${!notif.read ? 'font-bold' : ''}`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.desc}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{notif.time}</span>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0 self-center" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs">Không có thông báo mới</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-extrabold flex items-center justify-center shadow-md shadow-blue-500/20">
              S
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-800 leading-none">Supreme Admin</p>
              <p className="text-[10px] font-medium text-slate-400 mt-0.5">Quản trị tối cao</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              showProfileMenu ? 'rotate-180' : ''
            }`} />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2.5 w-52 bg-white rounded-xl border border-slate-100 shadow-xl overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs text-slate-400">Đăng nhập với tư cách</p>
                <p className="text-xs font-bold text-slate-800 truncate">admin@skillforge.vn</p>
              </div>
              <button
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                onClick={() => alert('Chức năng cài đặt tài khoản admin')}
              >
                <User className="w-4 h-4 text-slate-400" />
                Thông tin cá nhân
              </button>
              <button
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50/50 transition-colors border-t border-slate-100"
                onClick={onLogout}
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
