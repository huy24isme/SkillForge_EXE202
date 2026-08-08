import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, ClipboardList, Lightbulb, Target, Map,
  GitBranch, ListChecks, Scale, Rocket, ChevronDown,
  CheckCircle2, Circle, Loader2, Settings,
  PanelLeftClose, PanelLeftOpen,
  Building2, Users, LayoutGrid, Kanban, Flag,
  BarChart3, UserCog,
} from 'lucide-react'
import clsx from 'clsx'
import { useUIStore } from '../../store/uiStore.js'
import { useBSCWorkflowStore } from '../../store/bscWorkflowStore.js'
import { useAuthStore, ROLES } from '../../store/authStore.js'

// ── Nav definitions per role ──────────────────────────────────────────────────

const CEO_STEPS = [
  { step: 'B1', to: '/assessment',           icon: ClipboardList, label: 'Đánh giá hiện trạng' },
  {
    step: 'B2', to: '/strategy-build',        icon: Lightbulb,     label: 'Xây dựng Chiến lược',
    children: [
      { to: '/strategy-build/swot',      label: 'Phân tích SWOT' },
      { to: '/strategy-build/formulate', label: 'Chiến lược SO/ST/WO/WT' },
    ],
  },
  {
    step: 'B3', to: '/strategy-results',      icon: Target,        label: 'Kết quả chiến lược',
    children: [
      { to: '/strategy-results/selection', label: 'Chọn chiến lược' },
      { to: '/strategy-results/outcomes',  label: 'Tóm tắt đã chọn' },
    ],
  },
  {
    step: 'B4', to: '/strategy-map',          icon: Map,           label: 'Bản đồ Chiến lược',
    children: [
      { to: '/strategy-map/perspectives', label: 'Tạo mục tiêu & bản đồ' },
    ],
  },
  { step: 'B5', to: '/fishbone',             icon: GitBranch,     label: 'Mô hình Xương cá' },
  { step: 'B6', to: '/weight-allocation',    icon: Scale,         label: 'Phân bổ Tỉ trọng' },
  { step: 'B7', to: '/kpi-setup',            icon: ListChecks,    label: 'Đo lường & Chỉ tiêu' },
  { step: 'B8', to: '/action-plan',          icon: Rocket,        label: 'Thực thi & Giám sát' },
]

const DEPT_HEAD_NAV = [
  { to: '/dashboard',      icon: LayoutDashboard, label: 'Tổng quan' },
  { to: '/department-head', icon: BarChart3,       label: 'Phòng ban của tôi' },
  { to: '/fishbone',       icon: GitBranch,        label: 'B5 · Xương cá (Fishbone)' },
  { to: '/action-plan',    icon: Rocket,           label: 'B8 · Action Plan' },
  { to: '/kanban',         icon: Kanban,           label: 'Kanban Board' },
  { to: '/reports',        icon: Flag,             label: 'Báo cáo' },
]

const EMPLOYEE_NAV = [
  { to: '/kanban', icon: Kanban, label: 'Kanban Board' },
]

const COMPANY_ADMIN_NAV = [
  { to: '/company-admin', icon: Building2,  label: 'Thông tin Công ty' },
]

const TOOL_LINKS = [
  { to: '/settings', icon: Settings, label: 'Cài đặt tài khoản' },
]

// ── Step status badge ─────────────────────────────────────────────────────────
function StepStatus({ status }) {
  if (status === 'completed')
    return <CheckCircle2 size={13} className="text-[#3C50E0] shrink-0" />
  if (status === 'active')
    return <Loader2 size={13} className="text-[#3C50E0] animate-spin shrink-0" />
  return <Circle size={13} className="text-[#4B5563] shrink-0" />
}

// ── Generic nav link ──────────────────────────────────────────────────────────
function NavItem({ to, icon: Icon, label, collapsed }) {
  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      className={({ isActive }) => clsx(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
        collapsed && 'justify-center',
        isActive
          ? 'bg-[#3C50E0] text-white'
          : 'text-[#DEE4EE] hover:bg-white/6 hover:text-white'
      )}
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  )
}

// ── CEO step nav (with status icons and sub-menus) ───────────────────────────
function CeoStepNav({ steps, collapsed, location }) {
  const getInitialExpanded = () => {
    const set = new Set()
    CEO_STEPS.forEach(({ step, children }) => {
      if (children?.some((c) => location.pathname.startsWith(c.to))) set.add(step)
    })
    return set
  }
  const [expandedSteps, setExpandedSteps] = useState(getInitialExpanded)

  const toggleExpand = (step) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev)
      next.has(step) ? next.delete(step) : next.add(step)
      return next
    })
  }

  const completedCount = Object.values(steps).filter(s => s?.status === 'completed').length
  const progressPct = Math.round((completedCount / 8) * 100)

  return (
    <>
      {/* Progress */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-white/6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-[#8D98A7] font-medium">Tiến độ triển khai</span>
            <span className="text-[11px] text-[#3C50E0] font-bold">{completedCount}/8</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#3C50E0] rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Dashboard link */}
      {!collapsed && (
        <p className="text-[10px] text-[#8D98A7] font-semibold uppercase tracking-[0.12em] px-3 pb-2">Menu</p>
      )}
      <NavItem to="/dashboard" icon={LayoutDashboard} label="Tổng quan" collapsed={collapsed} />

      {!collapsed && (
        <p className="text-[10px] text-[#8D98A7] font-semibold uppercase tracking-[0.12em] px-3 pt-4 pb-2">Triển khai BSC</p>
      )}
      {collapsed && <div className="my-2 border-t border-white/6" />}

      {CEO_STEPS.map(({ step, to, icon: Icon, label, children }) => {
        const status = steps[step]?.status ?? 'pending'
        const hasChildren = !!children
        const isExpanded = expandedSteps.has(step)
        const isParentActive = hasChildren
          ? children.some((c) => location.pathname.startsWith(c.to))
          : location.pathname === to || location.pathname.startsWith(to + '/')

        if (collapsed) {
          return (
            <NavLink
              key={step}
              to={hasChildren ? children[0].to : to}
              title={`${step} · ${label}`}
              className={clsx(
                'flex items-center justify-center py-2.5 rounded-lg transition-all',
                isParentActive
                  ? 'bg-[#3C50E0] text-white'
                  : 'text-[#DEE4EE] hover:bg-white/6 hover:text-white'
              )}
            >
              <Icon size={18} className="shrink-0" />
            </NavLink>
          )
        }

        return (
          <div key={step}>
            {hasChildren ? (
              <button
                onClick={() => toggleExpand(step)}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left',
                  isParentActive
                    ? 'bg-white/8 text-white'
                    : 'text-[#DEE4EE] hover:bg-white/6 hover:text-white'
                )}
              >
                <Icon size={18} className="shrink-0" />
                <span className="flex-1 truncate">{label}</span>
                <div className="flex items-center gap-1.5">
                  <StepStatus status={status} />
                  <ChevronDown
                    size={14}
                    className={clsx('text-[#8D98A7] transition-transform duration-200', isExpanded && 'rotate-180')}
                  />
                </div>
              </button>
            ) : (
              <NavLink
                to={to}
                className={({ isActive }) => clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-[#3C50E0] text-white'
                    : 'text-[#DEE4EE] hover:bg-white/6 hover:text-white'
                )}
              >
                <Icon size={18} className="shrink-0" />
                <span className="flex-1 truncate">{label}</span>
                <StepStatus status={status} />
              </NavLink>
            )}

            {hasChildren && (
              <div className={clsx(
                'overflow-hidden transition-all duration-200',
                isExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
              )}>
                <div className="ml-4 mt-1 mb-1 border-l border-white/10 pl-3 space-y-0.5">
                  {children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      className={({ isActive }) => clsx(
                        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-all',
                        isActive
                          ? 'text-[#3C50E0] bg-[#3C50E0]/10'
                          : 'text-[#8D98A7] hover:text-white hover:bg-white/6'
                      )}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}

// ── Main Sidebar ──────────────────────────────────────────────────────────────
export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { steps } = useBSCWorkflowStore()
  const { user } = useAuthStore()
  const location = useLocation()
  const collapsed = sidebarCollapsed
  const role = user?.role

  const roleLabel = ROLES[role]?.label ?? role ?? ''

  // Role-specific nav items
  const getNavItems = () => {
    if (role === 'COMPANY_ADMIN') return COMPANY_ADMIN_NAV
    if (role === 'EMPLOYEE')      return EMPLOYEE_NAV
    if (role === 'DEPARTMENT_HEAD') return DEPT_HEAD_NAV
    return null // CEO handled separately
  }
  const navItems = getNavItems()

  return (
    <aside className={clsx(
      'flex flex-col bg-[#1C2434] transition-all duration-300 shrink-0 relative h-full overflow-hidden',
      collapsed ? 'w-17.5' : 'w-65'
    )}>

      {/* Logo */}
      <div className={clsx(
        'flex items-center h-17.5 border-b border-white/6 shrink-0 px-4',
        collapsed ? 'justify-center' : 'gap-3'
      )}>
        <div className="w-10 h-10 shrink-0 flex items-center justify-center">
          <img src="/logoSkill.png" alt="SkillForge" className="w-full h-full object-contain" />
        </div>
        {!collapsed && (
          <div>
            <span className="text-white font-bold text-lg leading-none tracking-tight">SkillForge</span>
            <p className="text-[#8D98A7] text-[10px] mt-0.5">BSC Management</p>
          </div>
        )}
      </div>

      {/* Role badge */}
      {!collapsed && role && (
        <div className="px-4 py-2.5 border-b border-white/6">
          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
            style={{ background: ROLES[role]?.color ?? '#64748b' }}
          >
            <UserCog size={9} /> {roleLabel}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 scrollbar-thin scrollbar-thumb-white/10">

        {/* CEO: full BSC workflow nav */}
        {role === 'CEO' && (
          <CeoStepNav steps={steps} collapsed={collapsed} location={location} />
        )}

        {/* Other roles: simple nav */}
        {navItems && (
          <>
            {!collapsed && (
              <p className="text-[10px] text-[#8D98A7] font-semibold uppercase tracking-[0.12em] px-3 pb-2">Menu</p>
            )}
            {navItems.map(({ to, icon, label }) => (
              <NavItem key={to} to={to} icon={icon} label={label} collapsed={collapsed} />
            ))}
          </>
        )}

        {/* Settings — all roles */}
        {!collapsed && <p className="text-[10px] text-[#8D98A7] font-semibold uppercase tracking-[0.12em] px-3 pt-4 pb-2">Tài khoản</p>}
        {collapsed && <div className="my-2 border-t border-white/6" />}
        {TOOL_LINKS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
              collapsed && 'justify-center',
              isActive
                ? 'bg-[#3C50E0] text-white'
                : 'text-[#DEE4EE] hover:bg-white/6 hover:text-white'
            )}
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 py-3 border-t border-white/6 shrink-0">
        <button
          onClick={toggleSidebar}
          className={clsx(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[#8D98A7] hover:text-white hover:bg-white/6 transition-all text-sm',
            collapsed && 'justify-center'
          )}
        >
          {collapsed
            ? <PanelLeftOpen size={18} />
            : <><PanelLeftClose size={18} /><span className="font-medium">Thu gọn</span></>
          }
        </button>
      </div>
    </aside>
  )
}
