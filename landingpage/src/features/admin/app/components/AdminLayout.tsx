import { useEffect, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  UsersRound,
  Building2,
  UserCog,
  ShoppingBag,
  Settings,
  Bell,
  LogOut,
  Search,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/auth/AuthContext';
import logo1 from '@/assets/logo1.png';

const navigation = [
  { name: 'Employees', href: '/admin/employees', icon: UsersRound },
  { name: 'Departments', href: '/admin/departments', icon: Building2 },
  { name: 'Users', href: '/admin/users', icon: UserCog },
  { name: 'Customers', href: '/admin/customers', icon: ShoppingBag },
  { name: 'Company Settings', href: '/admin/settings', icon: Settings },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { logout } = useAuth();
  const currentPage =
    navigation.find((item) => location.pathname === item.href || location.pathname.startsWith(`${item.href}/`))?.name ||
    'Employees';

  useEffect(() => {
    const hasOpenModal = Boolean(
      document.querySelector(
        '[data-slot="dialog-content"][data-state="open"], [data-slot="alert-dialog-content"][data-state="open"], [data-slot="sheet-content"][data-state="open"], [data-slot="drawer-content"][data-state="open"]'
      )
    );

    if (hasOpenModal) {
      return;
    }

    const staleOverlays = document.querySelectorAll(
      '[data-slot="dialog-overlay"], [data-slot="alert-dialog-overlay"], [data-slot="sheet-overlay"], [data-slot="drawer-overlay"]'
    );

    staleOverlays.forEach((overlay) => {
      const state = overlay.getAttribute('data-state');
      if (state !== 'open') {
        overlay.remove();
      }
    });

    document.body.style.pointerEvents = 'auto';
    document.body.style.overflow = '';
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50/30 to-slate-100 overflow-x-hidden">
      <motion.aside
        initial={{ x: -20, opacity: 0.92 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="fixed inset-y-0 left-0 z-40 bg-[#0B1C2D] text-white border-r border-cyan-300/10 shadow-2xl shadow-[#0B1C2D]/40 flex flex-col"
        style={{ width: '18rem' }}
      >
        <div className="p-6 border-b border-white/10">
          <img src={logo1} alt="SkillForge" className="h-12 w-auto" />
          <p className="text-xs text-[#3AE7E1] mt-3 tracking-[0.18em] uppercase">System Control</p>
        </div>

        <div className="px-6 pt-6 pb-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Administration</p>
        </div>

        <nav className="px-3 mt-1 space-y-1 overflow-y-auto">
          {navigation.map((item, index) => {
            const isRootEmployees = (location.pathname === '/admin' || location.pathname === '/admin/') && item.href === '/admin/employees';
            const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`) || isRootEmployees;

            return (
              <motion.div
                key={item.name}
                initial={{ x: -12, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.25, delay: 0.06 * index, ease: 'easeOut' }}
              >
                <NavLink
                  to={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-gradient-to-r from-[#3AE7E1] to-[#4CC9F0] text-[#0B1C2D] shadow-[0_12px_22px_rgba(58,231,225,0.28)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-[#0B1C2D]' : ''}`} />
                  {item.name}
                  {isActive ? <ChevronRight className="w-4 h-4 ml-auto text-[#0B1C2D]" /> : null}
                </NavLink>
              </motion.div>
            );
          })}        
        </nav>

        <div className="mt-auto p-5 border-t border-white/10 bg-gradient-to-t from-[#06111d] to-transparent">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3AE7E1] to-[#2563EB] flex items-center justify-center text-[#0B1C2D] font-bold text-xs">
              ADM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">Admin (admin01)</p>
              <p className="text-slate-400 text-xs truncate">CEO Console Owner</p>
            </div>
          </div>
        </div>
      </motion.aside>

      <div className="fixed inset-y-0 right-0 flex flex-col" style={{ left: '18rem' }}>
        <motion.header
          initial={{ y: -14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="z-30 px-8 pt-6 pb-4 backdrop-blur bg-slate-100/90 border-b border-slate-200/70 flex-shrink-0"
        >
          <div className="flex items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                <span>Admin Console</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-slate-700 font-medium">{currentPage}</span>
              </div>
              <h1 className="text-2xl font-bold text-[#0B1C2D]">{currentPage}</h1>
              <p className="text-slate-500 text-sm mt-1">
              {new Date().toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 bg-white min-w-[260px]">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  placeholder="Search settings, users, teams..."
                  className="w-full text-sm bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400"
                />
              </div>
              <button className="p-2.5 rounded-xl border border-slate-300 bg-white text-slate-500 hover:text-[#0B1C2D] hover:border-slate-400 transition-colors relative" title="Notifications">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
              </button>
              <button
                onClick={logout}
                className="p-2.5 rounded-xl border border-slate-300 bg-white text-slate-500 hover:text-[#0B1C2D] hover:border-slate-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.header>

        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="p-8 overflow-y-auto flex-1"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
