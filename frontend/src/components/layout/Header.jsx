import { useState, useRef, useEffect, useMemo } from 'react'
import {
  Bell, User, CheckCircle2, AlertTriangle, Clock, X,
  ChevronRight, LogOut, Shield, Search, Settings,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, ROLES } from '../../store/authStore.js'
import { useBscContextStore } from '../../store/bscContextStore.js'
import { PeriodSelector } from '../shared/PeriodSelector.jsx'
import { useBSCWorkflowStore } from '../../store/bscWorkflowStore.js'
import { useActionPlanStore } from '../../store/actionPlanStore.js'
import { useFishboneStore } from '../../store/fishboneStore.js'
import { useWeightStore } from '../../store/weightStore.js'
import { useStrategyMapStore } from '../../store/strategyMapStore.js'
import { useSWOTStore } from '../../store/swotStore.js'
import clsx from 'clsx'

const STEP_ROUTES = {
  B1: '/assessment', B2: '/strategy-build/swot', B3: '/strategy-results/selection',
  B4: '/strategy-map/perspectives', B5: '/fishbone', B6: '/weight-allocation',
  B7: '/kpi-setup', B8: '/action-plan',
}

function useNotifications() {
  const { steps } = useBSCWorkflowStore()
  const { tasks, actionPlans, kpiReports } = useActionPlanStore()
  const fishboneStore = useFishboneStore()
  const { perspectiveWeights } = useWeightStore()
  const strategyMapStore = useStrategyMapStore()
  const { b3Selected } = useSWOTStore()

  // Stabilize objectives/kpis so they don't recreate on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const objectives = useMemo(() => strategyMapStore.getEffectiveFinalObjectives(b3Selected), [strategyMapStore, b3Selected])
  const allKpis = useMemo(() => fishboneStore.getAllKPIs(objectives), [fishboneStore, objectives])

  return useMemo(() => {
    const notes = []
    const activeStep = Object.entries(steps).find(([, s]) => s.status === 'active')
    if (activeStep) {
      notes.push({
        id: `active-${activeStep[0]}`, type: 'info', icon: Clock,
        title: `${activeStep[0]} đang thực hiện`,
        body: `Bước "${activeStep[1].label}" chưa hoàn thành`,
        to: STEP_ROUTES[activeStep[0]],
      })
    }
    const blocked = tasks.filter((t) => t.status === 'BLOCKED')
    blocked.slice(0, 3).forEach((t) => {
      const ap = actionPlans.find((a) => a.id === t.actionPlanId)
      notes.push({
        id: `blocked-${t.id}`, type: 'error', icon: AlertTriangle,
        title: 'Task bị chặn (BLOCKED)',
        body: `"${t.name}"${ap ? ` — ${ap.name}` : ''}`,
        to: '/action-plan',
      })
    })
    if (steps.B6?.status !== 'completed') {
      const total = Object.values(perspectiveWeights).reduce((a, b) => a + b, 0)
      if (total !== 100 && total > 0) {
        notes.push({
          id: 'weight-invalid', type: 'warning', icon: AlertTriangle,
          title: 'Tỉ trọng B6 chưa hợp lệ',
          body: `Tổng đang = ${total}% (cần = 100%)`,
          to: '/weight-allocation',
        })
      }
    }
    const latestReports = [...kpiReports]
      .sort((a, b) => b.reportedAt.localeCompare(a.reportedAt)).slice(0, 2)
    latestReports.forEach((r) => {
      const kpi = allKpis.find((k) => k.id === r.kpiId)
      notes.push({
        id: `report-${r.id}`, type: 'success', icon: CheckCircle2,
        title: 'Báo cáo KPI mới',
        body: `${kpi?.name ?? 'KPI'}: ${r.actualValue} (${r.reportedAt})`,
        to: '/action-plan',
      })
    })
    const recentDone = Object.entries(steps)
      .filter(([, s]) => s.status === 'completed' && s.completedAt)
      .sort((a, b) => (b[1].completedAt ?? '').localeCompare(a[1].completedAt ?? ''))
      .slice(0, 2)
    recentDone.forEach(([id, s]) => {
      notes.push({
        id: `done-${id}`, type: 'success', icon: CheckCircle2,
        title: `${id} hoàn thành`,
        body: `"${s.label}" — ${s.completedAt}`,
        to: STEP_ROUTES[id],
      })
    })
    return notes
  }, [steps, tasks, actionPlans, kpiReports, perspectiveWeights, b3Selected, allKpis])
}

const TYPE_STYLE = {
  info:    { dot: 'bg-blue-500',    iconCls: 'text-blue-500',    bg: 'bg-blue-50' },
  success: { dot: 'bg-emerald-500', iconCls: 'text-emerald-500', bg: 'bg-emerald-50' },
  warning: { dot: 'bg-amber-500',   iconCls: 'text-amber-500',   bg: 'bg-amber-50' },
  error:   { dot: 'bg-red-500',     iconCls: 'text-red-500',     bg: 'bg-red-50' },
}

function NotificationPanel({ notifications, onClose, navigate }) {
  const [dismissed, setDismissed] = useState(new Set())
  const visible = notifications.filter((n) => !dismissed.has(n.id))

  return (
    <div className="absolute right-0 top-full mt-2 z-50 w-90 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <Bell size={15} className="text-[#3C50E0]" />
          <span className="text-sm font-bold text-slate-800">Thông báo</span>
          {visible.length > 0 && (
            <span className="text-[10px] font-bold bg-[#3C50E0] text-white px-1.5 py-0.5 rounded-full min-w-4.5 text-center">
              {visible.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {visible.length > 0 && (
            <button
              onClick={() => setDismissed(new Set(notifications.map((n) => n.id)))}
              className="text-[11px] text-slate-400 hover:text-[#3C50E0] transition-colors"
            >
              Xóa tất cả
            </button>
          )}
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X size={15} />
          </button>
        </div>
      </div>

      <div className="max-h-105 overflow-y-auto divide-y divide-slate-50">
        {visible.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={22} className="text-emerald-500" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Không có thông báo mới</p>
            <p className="text-xs text-slate-400 mt-1">Mọi thứ đang ổn!</p>
          </div>
        ) : (
          visible.map((n) => {
            const s = TYPE_STYLE[n.type] ?? TYPE_STYLE.info
            const Icon = n.icon
            return (
              <div
                key={n.id}
                className="flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors group cursor-pointer"
                onClick={() => { if (n.to) { navigate(n.to); onClose() } }}
              >
                <div className={clsx('w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5', s.bg)}>
                  <Icon size={14} className={s.iconCls} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 leading-snug">{n.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">{n.body}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0 pt-0.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); setDismissed((prev) => new Set([...prev, n.id])) }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-slate-500"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {visible.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
          <button
            onClick={() => { navigate('/dashboard'); onClose() }}
            className="text-xs text-[#3C50E0] hover:underline font-semibold w-full text-center flex items-center justify-center gap-1"
          >
            Xem tất cả thông báo <ChevronRight size={12} />
          </button>
        </div>
      )}
    </div>
  )
}

function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()
  const role = ROLES[user?.role]
  const [avatarUrl, setAvatarUrl] = useState(() => {
    try { return localStorage.getItem('skillforge-avatar') || null } catch { return null }
  })

  // Sync avatar when localStorage changes (e.g. updated from Settings page)
  useEffect(() => {
    const onStorage = () => {
      try { setAvatarUrl(localStorage.getItem('skillforge-avatar') || null) } catch { /* ignore */ }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    if (!open) return
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  const initials = (user?.fullName ?? user?.name ?? '')
    .split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'U'

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 pl-4 border-l border-slate-200 cursor-pointer"
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white shadow-sm overflow-hidden"
          style={{ background: avatarUrl ? 'transparent' : (role?.color ?? '#3C50E0') }}
        >
          {avatarUrl
            ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            : (user?.avatar ?? initials)
          }
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-semibold text-slate-700 leading-tight">{user?.fullName ?? user?.name ?? 'Người dùng'}</div>
          <div className="text-[11px] text-slate-400 leading-tight">{role?.label ?? ''}</div>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-60 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="px-4 py-4 bg-linear-to-br from-[#3C50E0]/5 to-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow overflow-hidden"
                style={{ background: avatarUrl ? 'transparent' : (role?.color ?? '#3C50E0') }}
              >
                {avatarUrl
                  ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  : (user?.avatar ?? initials)
                }
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-800 truncate">{user?.fullName ?? user?.name}</div>
                <div className="text-[11px] text-slate-500 truncate">{user?.title ?? user?.email}</div>
                {user?.deptName && (
                  <div className="text-[10px] text-slate-400 truncate">{user.deptName}</div>
                )}
              </div>
            </div>
            <div className="mt-3">
              <span
                className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full text-white"
                style={{ background: role?.color ?? '#3C50E0' }}
              >
                <Shield size={9} />
                {role?.label}
              </span>
            </div>
          </div>
          <div className="p-2">
            <button
              onClick={() => { navigate('/settings'); setOpen(false) }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors font-medium"
            >
              <Settings size={15} />
              Cài đặt tài khoản
            </button>
            <button
              onClick={() => { onLogout(); setOpen(false) }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              <LogOut size={15} />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function Header({ title }) {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const notifications = useNotifications()
  const unread = notifications.length

  const handleLogout = () => {
    useBscContextStore.getState().reset()
    logout()
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <header className="h-17.5 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 gap-4">
      {/* Left: Page title */}
      <div className="min-w-0">
        <h1 className="text-base font-bold text-[#1C2434] truncate">{title || 'SkillForge'}</h1>
        <p className="text-[11px] text-slate-400 leading-tight hidden sm:block">
          BSC Management System
        </p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <PeriodSelector />

        {/* Notifications */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className={clsx(
              'relative w-10 h-10 flex items-center justify-center rounded-xl border transition-all',
              open
                ? 'bg-[#3C50E0]/10 border-[#3C50E0]/30 text-[#3C50E0]'
                : 'bg-white border-slate-200 text-slate-500 hover:border-[#3C50E0]/30 hover:text-[#3C50E0] hover:bg-[#3C50E0]/5'
            )}
          >
            <Bell size={17} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-[9px] font-bold text-white leading-none">
                  {unread > 9 ? '9+' : unread}
                </span>
              </span>
            )}
          </button>

          {open && (
            <NotificationPanel
              notifications={notifications}
              onClose={() => setOpen(false)}
              navigate={navigate}
            />
          )}
        </div>

        {/* User menu */}
        <UserMenu user={user} onLogout={handleLogout} />
      </div>
    </header>
  )
}
