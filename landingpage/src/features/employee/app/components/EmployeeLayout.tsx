import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { 
  ListChecks,
  FileText,
  FolderKanban,
  Bell,
  LogOut
} from 'lucide-react';
import { useState } from 'react';
import logo1 from '@/assets/logo1.png';

const navigation = [
  { name: 'My Tasks', href: '/employee/employee/tasks', icon: ListChecks },
  { name: 'My Projects', href: '/employee/employee/projects', icon: FolderKanban },
  { name: 'Daily Report', href: '/employee/employee/daily-report', icon: FileText },
];

const notifications = [
  { id: 1, type: 'quest', message: 'New weekly quest available!', time: '5m ago', unread: true },
  { id: 2, type: 'reward', message: 'You earned a new badge: Code Master', time: '1h ago', unread: true },
  { id: 3, type: 'project', message: 'E-Commerce Platform deadline approaching', time: '2h ago', unread: false },
];

export function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-[#3AE7E1]/5">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-[#0B1C2D] to-[#0B1C2D]/95 text-white shadow-xl">
        <div className="p-6">
          <div className="flex items-center gap-2">
            
            <div>
             <img src={logo1} alt="SkillForge Logo" className="text-xl font-semibold" />
              <p className="text-xs text-[#3AE7E1] text-center">Employee Hub</p>
            </div>
          </div>
        </div>

        <nav className="px-3 mt-1">
          {navigation.map((item) => {
            const isRootItem = item.href === '/employee/employee';
            const isActive = isRootItem
              ? location.pathname === item.href
              : location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#3AE7E1] to-[#3AE7E1]/80 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#3AE7E1] to-[#2ECC71] flex items-center justify-center">
              <span className="text-sm font-bold text-white">NA</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Nguyen Van A</p>
              <p className="text-xs text-gray-400">Execution Contributor</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10 backdrop-blur-sm bg-white/95">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {navigation.find((item) => {
                  if (item.href === '/employee/employee') {
                    return location.pathname === item.href;
                  }
                  return location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
                })?.name || 'Tổng quan'}
              </h2>
              <p className="text-sm text-gray-500">Employee execution workspace</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
              {/* Thông báo */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-[#E74C3C] text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                      <h3 className="font-semibold text-gray-900">Thông báo</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                            notif.unread ? 'bg-[#3AE7E1]/5' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notif.unread ? 'bg-[#3AE7E1]' : 'bg-transparent'
                            }`} />
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">{notif.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-gray-50 text-center">
                      <button className="text-sm text-[#3AE7E1] hover:text-[#3AE7E1]/80">
                        Xem tất cả thông báo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#3AE7E1] to-[#2ECC71] flex items-center justify-center">
                <span className="text-xs font-bold text-white">NA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
