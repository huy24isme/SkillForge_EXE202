import { useEffect, useState, useCallback } from 'react'
import {
  Kanban, RefreshCw, Loader2, AlertCircle,
  User, Calendar, Flag, ChevronDown, CheckCircle2,
  Clock, Play, Ban, XCircle, Eye,
} from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore } from '../../store/authStore.js'
import { useBscContextStore } from '../../store/bscContextStore.js'
import api from '../../services/api.js'

// ─── Constants ────────────────────────────────────────────────────────────────
const COLUMNS = [
  { id: 'TODO',        label: 'Chờ thực hiện',   color: '#64748b', bg: '#f8fafc', icon: Clock },
  { id: 'IN_PROGRESS', label: 'Đang thực hiện',   color: '#3C50E0', bg: '#eef2ff', icon: Play },
  { id: 'REVIEW',      label: 'Đang kiểm tra',    color: '#d97706', bg: '#fffbeb', icon: Eye },
  { id: 'DONE',        label: 'Hoàn thành',        color: '#16a34a', bg: '#f0fdf4', icon: CheckCircle2 },
  { id: 'BLOCKED',     label: 'Bị chặn',           color: '#dc2626', bg: '#fef2f2', icon: Ban },
  { id: 'CANCELLED',   label: 'Đã hủy',            color: '#94a3b8', bg: '#f1f5f9', icon: XCircle },
]

const PRIORITY_META = {
  LOW:      { label: 'Thấp',       color: '#64748b' },
  MEDIUM:   { label: 'Trung bình', color: '#d97706' },
  HIGH:     { label: 'Cao',        color: '#ef4444' },
  CRITICAL: { label: 'Khẩn cấp',  color: '#7c3aed' },
}

const ALLOWED_NEXT = {
  EMPLOYEE: {
    TODO:        ['IN_PROGRESS'],
    IN_PROGRESS: ['REVIEW', 'BLOCKED'],
    REVIEW:      ['DONE', 'IN_PROGRESS'],
    DONE:        [],
    BLOCKED:     ['IN_PROGRESS'],
    CANCELLED:   [],
  },
  DEPARTMENT_HEAD: {
    TODO:        ['IN_PROGRESS'],
    IN_PROGRESS: ['REVIEW', 'BLOCKED'],
    REVIEW:      ['DONE', 'IN_PROGRESS'],
    DONE:        [],
    BLOCKED:     ['IN_PROGRESS', 'CANCELLED'],
    CANCELLED:   [],
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
/**
 * Normalise KanbanResponse from backend:
 *   { bscStrategyId, columns: [{ status: "TODO", total: 0, tasks: [] }] }
 * into a plain map:
 *   { TODO: [], IN_PROGRESS: [], ... }
 */
function normalizeKanban(raw) {
  if (!raw || !Array.isArray(raw.columns)) return {}
  const result = {}
  for (const col of raw.columns) {
    result[col.status] = col.tasks ?? []
  }
  return result
}

// ─── Task Card ────────────────────────────────────────────────────────────────
function TaskCard({ task, onStatusChange, currentUserRole }) {
  const [updating, setUpdating] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const allowedMap = ALLOWED_NEXT[currentUserRole] ?? ALLOWED_NEXT.EMPLOYEE
  const nextStatuses = allowedMap[task.status] ?? []
  const priority = PRIORITY_META[task.priority] ?? PRIORITY_META.MEDIUM
  const canUpdate = ['EMPLOYEE', 'DEPARTMENT_HEAD'].includes(currentUserRole)

  // TaskResponse uses dueDate (not endDate)
  const dueDateDisplay = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('vi-VN')
    : null

  const handleNext = async (newStatus) => {
    setShowMenu(false)
    setUpdating(true)
    try {
      // B8.5: PATCH /tasks/{taskId}/status  body: { newStatus }
      await api.patch(`/tasks/${task.id}/status`, { newStatus })
      onStatusChange(task.id, newStatus)
    } catch (e) {
      console.error('Task status update failed:', e.message)
    } finally { setUpdating(false) }
  }

  return (
    <div className={clsx(
      'rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow p-3.5 relative',
      task.status === 'BLOCKED' && 'border-red-200',
      task.status === 'DONE' && 'opacity-75',
      task.overdue && task.status !== 'DONE' && 'border-orange-300',
    )}>
      {/* Priority + overdue badge */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white" style={{ background: priority.color }}>
          {priority.label}
        </span>
        {task.overdue && task.status !== 'DONE' && (
          <span className="text-[10px] text-orange-600 font-semibold">Quá hạn</span>
        )}
      </div>

      {task.status === 'BLOCKED' && task.blockReason && (
        <p className="text-[10px] text-red-600 font-medium mb-1 truncate" title={task.blockReason}>
          🚫 {task.blockReason}
        </p>
      )}

      {/* Task name */}
      <p className="text-sm font-semibold text-[#1C2434] leading-snug mb-2">{task.name}</p>

      {/* Meta */}
      <div className="space-y-1.5">
        {task.assigneeName && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <User size={11} className="shrink-0" />
            <span className="truncate">{task.assigneeName}</span>
          </div>
        )}
        {dueDateDisplay && (
          <div className={clsx('flex items-center gap-1.5 text-xs', task.overdue && task.status !== 'DONE' ? 'text-orange-500 font-medium' : 'text-slate-500')}>
            <Calendar size={11} className="shrink-0" />
            <span>{dueDateDisplay}</span>
          </div>
        )}
        {task.actionPlanName && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 italic">
            <Flag size={11} className="shrink-0" />
            <span className="truncate">{task.actionPlanName}</span>
          </div>
        )}
        {task.progressPercent != null && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#3C50E0] rounded-full" style={{ width: `${task.progressPercent}%` }} />
            </div>
            <span className="text-[10px] text-slate-400 font-medium">{Number(task.progressPercent).toFixed(0)}%</span>
          </div>
        )}
      </div>

      {/* Status update dropdown */}
      {canUpdate && nextStatuses.length > 0 && (
        <div className="relative mt-3 pt-2.5 border-t border-slate-100">
          <button
            onClick={() => setShowMenu(v => !v)}
            disabled={updating}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#3C50E0] hover:underline"
          >
            {updating ? <Loader2 size={11} className="animate-spin" /> : <ChevronDown size={11} />}
            Chuyển trạng thái
          </button>
          {showMenu && (
            <div className="absolute left-0 bottom-full mb-1 z-30 bg-white border border-slate-200 rounded-xl shadow-xl py-1 min-w-[160px]">
              {nextStatuses.map(ns => {
                const nc = COLUMNS.find(c => c.id === ns)
                const Icon = nc?.icon ?? CheckCircle2
                return (
                  <button
                    key={ns}
                    onClick={() => handleNext(ns)}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-slate-50 transition-colors"
                    style={{ color: nc?.color }}
                  >
                    <Icon size={12} /> → {nc?.label ?? ns}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EmployeeKanbanPage() {
  const { user } = useAuthStore()
  const { strategyId } = useBscContextStore()
  // normalizedKanban: { TODO: TaskResponse[], IN_PROGRESS: TaskResponse[], ... }
  const [normalizedKanban, setNormalizedKanban] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!strategyId) return
    setLoading(true); setError(null)
    try {
      // B8.6: GET /bsc-strategies/{strategyId}/tasks/kanban
      // EMPLOYEE role: pass assigneeId so backend filters for own tasks
      const params = {}
      if (user?.role === 'EMPLOYEE' && user?.employeeId) {
        params.assigneeId = user.employeeId
      }
      const raw = await api.get(`/bsc-strategies/${strategyId}/tasks/kanban`, { params })
      // raw = KanbanResponse { bscStrategyId, columns: [{status, total, tasks:[TaskResponse]}] }
      setNormalizedKanban(normalizeKanban(raw))
    } catch (e) {
      setError(e.message)
    } finally { setLoading(false) }
  }, [strategyId, user?.role, user?.employeeId])

  useEffect(() => { load() }, [load])

  // Optimistic local state update after PATCH
  const handleStatusChange = useCallback((taskId, newStatus) => {
    setNormalizedKanban(prev => {
      if (!prev) return prev
      let movedTask = null
      const updated = {}
      for (const [col, tasks] of Object.entries(prev)) {
        updated[col] = tasks.filter(t => {
          if (t.id === taskId) { movedTask = { ...t, status: newStatus }; return false }
          return true
        })
      }
      if (movedTask) {
        updated[newStatus] = [...(updated[newStatus] ?? []), movedTask]
      }
      return updated
    })
  }, [])

  const allTasks = normalizedKanban ? Object.values(normalizedKanban).flat() : []
  const totalTasks = allTasks.length
  const doneTasks = normalizedKanban?.['DONE']?.length ?? 0

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1C2434] flex items-center gap-2">
            <Kanban size={22} className="text-[#3C50E0]" /> Bảng Kanban
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {loading ? 'Đang tải...' : `${doneTasks}/${totalTasks} task hoàn thành`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!loading && totalTasks > 0 && (
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2">
              <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#3C50E0] rounded-full transition-all duration-500"
                  style={{ width: `${totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs font-bold text-[#3C50E0]">
                {totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0}%
              </span>
            </div>
          )}
          <button
            id="kanban-refresh"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !normalizedKanban && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map(col => (
            <div key={col.id} className="w-72 shrink-0 bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-3" />
              <div className="space-y-2">
                {[1, 2].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl" />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Kanban Board */}
      {!loading && normalizedKanban && (
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1">
          {COLUMNS.map(col => {
            const tasks = normalizedKanban[col.id] ?? []
            const Icon = col.icon
            return (
              <div
                key={col.id}
                className="w-72 shrink-0 rounded-xl border border-slate-200 flex flex-col"
                style={{ background: col.bg }}
              >
                <div
                  className="flex items-center gap-2 px-4 py-3 rounded-t-xl"
                  style={{ borderBottom: `2px solid ${col.color}22` }}
                >
                  <Icon size={14} style={{ color: col.color }} />
                  <span className="text-sm font-bold" style={{ color: col.color }}>{col.label}</span>
                  <span
                    className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ background: col.color }}
                  >{tasks.length}</span>
                </div>
                <div className="flex-1 p-3 space-y-3 min-h-[100px]">
                  {tasks.length === 0 ? (
                    <div className="text-center text-xs text-slate-400 py-6">Không có task</div>
                  ) : tasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      currentUserRole={user?.role}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* No strategy */}
      {!strategyId && !loading && (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Kanban size={40} className="mb-3 opacity-40" />
          <p className="text-sm">Chưa có chiến lược BSC. Vui lòng liên hệ CEO.</p>
        </div>
      )}
    </div>
  )
}