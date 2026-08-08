import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import {
  LayoutDashboard,
  Target,
  Building2,
  Users,
  FileText,
  ListChecks,
  Users2,
  User,
  Bell,
  LogOut
} from 'lucide-react';
import logo1 from '@/assets/logo1.png';

const navigation = [
  { name: 'Dashboard', href: '/pm', icon: LayoutDashboard },
  { name: 'Goal Contribution', href: '/pm/goal-contribution', icon: Target },
  { name: 'Customers', href: '/pm/customers', icon: Building2 },
  { name: 'Projects', href: '/pm/projects', icon: Users },
  { name: 'Tasks', href: '/pm/tasks', icon: ListChecks },
  { name: 'Team', href: '/pm/team', icon: Users2 },
  { name: 'Reports', href: '/pm/reports', icon: FileText },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-[#0B1C2D] text-white">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <img
                src={logo1}
                alt="SkillForge Logo"
                className="text-xl font-semibold"
              />

          </div>
          <p className="text-xs text-[#3AE7E1] mt-1 text-center">PM 4.0</p>
        </div>

        <nav className="px-3 mt-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                  isActive
                    ? 'bg-[#3AE7E1]/20 text-[#3AE7E1]'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
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
            <div className="w-10 h-10 rounded-full bg-[#3AE7E1]/20 flex items-center justify-center">
              <User className="w-5 h-5 text-[#3AE7E1]" />
            </div>
            <div>
              <p className="text-sm font-medium">PM User</p>
              <p className="text-xs text-gray-400">pm@skillforge.ai</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {navigation.find((item) => item.href === location.pathname)?.name || 'Dashboard'}
              </h2>
              <p className="text-sm text-gray-500">Strategic portfolio execution aligned to BSC</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#E74C3C] rounded-full"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-[#0B1C2D] text-white flex items-center justify-center text-sm">
                A
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
