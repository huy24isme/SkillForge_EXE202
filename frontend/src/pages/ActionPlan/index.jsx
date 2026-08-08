import { useState, useEffect, useMemo } from 'react'
import {
  Plus, Trash2, X, Calendar, User, Save, ChevronDown, ChevronRight,
  Flag, Pencil,
} from 'lucide-react'
import clsx from 'clsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import {
  useActionPlanStore, STATUS_META, TASK_STATUSES, PRIORITY_META, PRIORITIES,
} from '../../store/actionPlanStore.js'
import { useSWOTStore } from '../../store/swotStore.js'
import { useStrategyMapStore } from '../../store/strategyMapStore.js'
import { useFishboneStore } from '../../store/fishboneStore.js'
import { useBscContextStore } from '../../store/bscContextStore.js'

const PERSPECTIVES = {
  FINANCIAL:           { label: 'Tài chính',            color: '#16a34a' },
  CUSTOMER:            { label: 'Khách hàng',           color: '#2563eb' },
  INTERNAL_PROCESS:    { label: 'Quy trình nội bộ',     color: '#9333ea' },
  LEARNING_AND_GROWTH: { label: 'Học hỏi & Phát triển', color: '#d97706' },
}

// Mock users linked to fishboneStore departments
const MOCK_USERS = [
  { id: 'usr-hr-1',    name: 'Nguyễn Văn An',   deptId: 'dept-hr' },
  { id: 'usr-hr-2',    name: 'Phạm Thị Bình',   deptId: 'dept-hr' },
  { id: 'usr-sales-1', name: 'Trần Văn Cường',   deptId: 'dept-sales' },
  { id: 'usr-sales-2', name: 'Lê Thị Dung',      deptId: 'dept-sales' },
  { id: 'usr-mkt-1',   name: 'Hoàng Văn Em',     deptId: 'dept-mkt' },
  { id: 'usr-prod-1',  name: 'Vũ Thị Phương',    deptId: 'dept-product' },
  { id: 'usr-ops-1',   name: 'Đặng Văn Giang',   deptId: 'dept-ops' },
  { id: 'usr-it-1',    name: 'Ngô Thị Hạnh',     deptId: 'dept-it' },
]

// ─── Small reusable pieces ───────────────────────────────────────────────────

function StatusChip({ status, size = 'sm' }) {
  const m = STATUS_META[status] ?? STATUS_META.TODO
  const cls = size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'
  return (
    <span
      className={`${cls} font-semibold rounded-full`}
      style={{ background: m.bg, color: m.color }}
    >
      {m.label}
    </span>
  )
}

function PriorityDot({ priority }) {
  const m = PRIORITY_META[priority] ?? PRIORITY_META.MEDIUM
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium" style={{ color: m.color }}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: m.color }} />
      {m.label}
    </span>
  )
}

function ProgressBar({ value, color }) {
  return (
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${value ?? 0}%`, background: color ?? '#3b82f6' }} />
    </div>
  )
}

// ─── Modals ───────────────────────────────────────────────────────────────────

function ModalShell({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">{title}</h3>
          <button onClick={onClose}><X size={18} className="text-slate-400 hover:text-slate-600" /></button>
        </div>
        {children}
        <style>{`
          .lbl{display:block;font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px}
          .inp{width:100%;border:1px solid #e2e8f0;border-radius:10px;padding:8px 12px;font-size:13px;outline:none;background:white}
          .inp:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.1)}
        `}</style>
      </div>
    </div>
  )
}

function ActionPlanModal({ open, onClose, onSave, kpiId, kpiName, departments, edit }) {
  const [form, setForm] = useState(() => edit ?? {
    name: '', description: '', ownerId: '', ownerName: '',
    startDate: '', endDate: '', priority: 'MEDIUM',
  })
  if (!open) return null
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    const dept = departments.find((d) => d.id === form.ownerId)
    onSave({ ...form, kpiId, ownerName: dept?.name ?? form.ownerName })
    onClose()
  }
  return (
    <ModalShell title={edit ? 'Sửa kế hoạch hành động' : 'Tạo kế hoạch hành động'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-6 space-y-3">
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-2 text-xs text-indigo-700 font-medium">
          KPI: {kpiName}
        </div>
        <div>
          <label className="lbl">Tên kế hoạch *</label>
          <input className="inp" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Nhập tên kế hoạch hành động..." required />
        </div>
        <div>
          <label className="lbl">Mô tả</label>
          <textarea className="inp resize-none" rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Chi tiết..." />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="lbl">Phòng ban phụ trách</label>
            <select className="inp" value={form.ownerId} onChange={(e) => set('ownerId', e.target.value)}>
              <option value="">— Chọn phòng ban —</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="lbl">Ưu tiên</label>
            <select className="inp" value={form.priority} onChange={(e) => set('priority', e.target.value)}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_META[p].label}</option>)}
            </select>
          </div>
          <div>
            <label className="lbl">Ngày bắt đầu</label>
            <input type="date" className="inp" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} />
          </div>
          <div>
            <label className="lbl">Ngày kết thúc</label>
            <input type="date" className="inp" value={form.endDate} onChange={(e) => set('endDate', e.target.value)} />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium">Hủy</button>
          <button type="submit" className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl">
            {edit ? 'Cập nhật' : 'Tạo kế hoạch'}
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

function TaskModal({ open, onClose, onSave, actionPlanId, actionPlanName, edit }) {
  const [form, setForm] = useState(() => edit ?? {
    name: '', description: '', assigneeId: '', assigneeName: '',
    startDate: '', dueDate: '', priority: 'MEDIUM', progress: 0,
  })
  if (!open) return null
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const user = MOCK_USERS.find((u) => u.id === form.assigneeId)
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    onSave({ ...form, actionPlanId, assigneeName: user?.name ?? form.assigneeName })
    onClose()
  }
  return (
    <ModalShell title={edit ? 'Sửa task' : 'Thêm task'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-6 space-y-3">
        <div className="bg-violet-50 border border-violet-200 rounded-xl px-3 py-2 text-xs text-violet-700 font-medium">
          Kế hoạch: {actionPlanName}
        </div>
        <div>
          <label className="lbl">Tên task *</label>
          <input className="inp" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Tên công việc cụ thể..." required />
        </div>
        <div>
          <label className="lbl">Mô tả</label>
          <textarea className="inp resize-none" rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="lbl">Người thực hiện</label>
            <select className="inp" value={form.assigneeId} onChange={(e) => set('assigneeId', e.target.value)}>
              <option value="">— Chọn —</option>
              {MOCK_USERS.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div>
            <label className="lbl">Ưu tiên</label>
            <select className="inp" value={form.priority} onChange={(e) => set('priority', e.target.value)}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_META[p].label}</option>)}
            </select>
          </div>
          <div>
            <label className="lbl">Ngày bắt đầu</label>
            <input type="date" className="inp" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} />
          </div>
          <div>
            <label className="lbl">Hạn hoàn thành</label>
            <input type="date" className="inp" value={form.dueDate} onChange={(e) => set('dueDate', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="lbl">Tiến độ ({form.progress}%)</label>
            <input type="range" min={0} max={100} value={form.progress} onChange={(e) => set('progress', +e.target.value)} className="w-full accent-blue-600" />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium">Hủy</button>
          <button type="submit" className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl">
            {edit ? 'Cập nhật' : 'Thêm task'}
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

function BlockedModal({ open, onClose, onConfirm }) {
  const [reason, setReason] = useState('')
  if (!open) return null
  return (
    <ModalShell title="Lý do bị chặn (BLOCKED)" onClose={onClose}>
      <div className="p-6 space-y-4">
        <p className="text-sm text-slate-500">Mô tả rõ lý do task bị chặn để trưởng phòng có thể hỗ trợ giải quyết.</p>
        <textarea
          className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-red-400 resize-none"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Ví dụ: Chờ phê duyệt ngân sách từ Ban giám đốc..."
          autoFocus
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium">Hủy</button>
          <button
            onClick={() => { if (reason.trim()) { onConfirm(reason.trim()); onClose() } }}
            disabled={!reason.trim()}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-40"
          >
            Xác nhận BLOCKED
          </button>
        </div>
      </div>
    </ModalShell>
  )
}

function KpiReportModal({ open, onClose, onSave, kpi }) {
  const [form, setForm] = useState({ actualValue: '', reportedAt: new Date().toISOString().slice(0, 10), note: '' })
  if (!open || !kpi) return null
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.actualValue === '') return
    onSave({ kpiId: kpi.id, actualValue: Number(form.actualValue), reportedAt: form.reportedAt, note: form.note })
    setForm({ actualValue: '', reportedAt: new Date().toISOString().slice(0, 10), note: '' })
    onClose()
  }
  return (
    <ModalShell title="Báo cáo giá trị thực tế KPI" onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-6 space-y-3">
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-xs text-blue-700 font-medium">
          KPI: {kpi.name}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="lbl">Giá trị thực tế *</label>
            <input type="number" step="any" className="inp" value={form.actualValue} onChange={(e) => set('actualValue', e.target.value)} placeholder="0" required />
          </div>
          <div>
            <label className="lbl">Ngày báo cáo</label>
            <input type="date" className="inp" value={form.reportedAt} onChange={(e) => set('reportedAt', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="lbl">Ghi chú</label>
          <textarea className="inp resize-none" rows={2} value={form.note} onChange={(e) => set('note', e.target.value)} placeholder="Giải thích kết quả..." />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium">Hủy</button>
          <button type="submit" className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl">Lưu báo cáo</button>
        </div>
        <style>{`
          .lbl{display:block;font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px}
          .inp{width:100%;border:1px solid #e2e8f0;border-radius:10px;padding:8px 12px;font-size:13px;outline:none;background:white}
          .inp:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.1)}
        `}</style>
      </form>
    </ModalShell>
  )
}

// ─── List View ────────────────────────────────────────────────────────────────

function TaskRow({ task, onEdit, onDelete, onStatusChange }) {
  const m = STATUS_META[task.status] ?? STATUS_META.TODO
  return (
    <div className="flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50/60 transition-colors group border-b border-slate-50 last:border-0">
      <div className="w-px self-stretch bg-slate-200 shrink-0 ml-3" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-slate-700">{task.name}</span>
          <StatusChip status={task.status} size="xs" />
          <PriorityDot priority={task.priority} />
        </div>
        {task.status === 'BLOCKED' && task.blockReason && (
          <p className="text-[10px] text-red-600 bg-red-50 rounded-md px-2 py-0.5 mt-1 inline-block">
            🚫 {task.blockReason}
          </p>
        )}
        <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400 flex-wrap">
          {task.assigneeName && <span className="flex items-center gap-0.5"><User size={9} /> {task.assigneeName}</span>}
          {task.dueDate && <span className="flex items-center gap-0.5"><Calendar size={9} /> {task.dueDate}</span>}
          <span>{task.progress}%</span>
        </div>
        <div className="mt-1.5 w-40">
          <ProgressBar value={task.progress} color={m.color} />
        </div>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          className="text-[10px] border border-slate-200 rounded-lg px-1.5 py-1 outline-none bg-white"
        >
          {TASK_STATUSES.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
        </select>
        <button onClick={() => onEdit(task)} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Sửa</button>
        <button onClick={() => onDelete(task.id)} className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-lg">Xóa</button>
      </div>
    </div>
  )
}

function ActionPlanRow({ ap, tasks, onAddTask, onEditAP, onDeleteAP, onEditTask, onDeleteTask, onStatusChange }) {
  const [open, setOpen] = useState(true)
  const doneTasks = tasks.filter((t) => t.status === 'DONE').length
  return (
    <div className="ml-4 border-l-2 border-slate-200 mb-2">
      <div className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => setOpen((v) => !v)}>
        {open ? <ChevronDown size={14} className="text-slate-400 shrink-0" /> : <ChevronRight size={14} className="text-slate-400 shrink-0" />}
        <span className="text-sm font-semibold text-slate-700 flex-1">{ap.name}</span>
        <StatusChip status={ap.status} size="xs" />
        <PriorityDot priority={ap.priority} />
        <span className="text-[10px] text-slate-400 shrink-0">{doneTasks}/{tasks.length} tasks</span>
        {ap.endDate && <span className="text-[10px] text-slate-400 flex items-center gap-0.5 shrink-0"><Calendar size={9} />{ap.endDate}</span>}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => onEditAP(ap)} className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded hover:bg-blue-100"><Pencil size={9} /></button>
          <button onClick={() => onAddTask(ap)} className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded hover:bg-emerald-100"><Plus size={9} /></button>
          <button onClick={() => onDeleteAP(ap.id)} className="text-[10px] text-red-500 bg-red-50 px-2 py-0.5 rounded hover:bg-red-100"><Trash2 size={9} /></button>
        </div>
      </div>
      {open && (
        <div>
          {tasks.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onStatusChange={onStatusChange}
            />
          ))}
          {tasks.length === 0 && (
            <p className="text-[11px] text-slate-400 px-10 py-2">Chưa có task. <button className="text-blue-500 hover:underline" onClick={(e) => { e.stopPropagation(); onAddTask(ap) }}>+ Thêm task</button></p>
          )}
        </div>
      )}
    </div>
  )
}

function ListView({ allKPIs, actionPlans, tasks, onAddAP, onEditAP, onDeleteAP, onAddTask, onEditTask, onDeleteTask, onStatusChange }) {
  const [expandedKpis, setExpandedKpis] = useState({})
  const toggle = (id) => setExpandedKpis((s) => ({ ...s, [id]: !s[id] }))

  return (
    <div className="divide-y divide-slate-100">
      {allKPIs.length === 0 ? (
        <div className="py-16 text-center text-slate-400">
          <Flag size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Chưa có KPI nào. Hãy hoàn thành B5 trước.</p>
        </div>
      ) : allKPIs.map((kpi) => {
        const kpiAPs = actionPlans.filter((ap) => ap.kpiId === kpi.id)
        const isOpen = expandedKpis[kpi.id] !== false
        const p = PERSPECTIVES[kpi.perspective] ?? {}
        return (
          <div key={kpi.id}>
            <div
              className="flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-slate-50/50 transition-colors group"
              onClick={() => toggle(kpi.id)}
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color ?? '#64748b' }} />
              {isOpen ? <ChevronDown size={14} className="text-slate-400 shrink-0" /> : <ChevronRight size={14} className="text-slate-400 shrink-0" />}
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-slate-800">{kpi.name}</span>
                <span className="ml-2 text-[10px] text-slate-400">{kpi.deptName} · {p.label}</span>
              </div>
              <span className="text-[11px] text-slate-400 shrink-0">{kpiAPs.length} kế hoạch</span>
              <button
                onClick={(e) => { e.stopPropagation(); onAddAP(kpi) }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0"
              >
                <Plus size={11} /> Thêm kế hoạch
              </button>
            </div>
            {isOpen && (
              <div className="px-5 pb-2">
                {kpiAPs.map((ap) => (
                  <ActionPlanRow
                    key={ap.id}
                    ap={ap}
                    tasks={tasks.filter((t) => t.actionPlanId === ap.id)}
                    onAddTask={onAddTask}
                    onEditAP={onEditAP}
                    onDeleteAP={onDeleteAP}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                    onStatusChange={onStatusChange}
                  />
                ))}
                {kpiAPs.length === 0 && (
                  <p className="text-xs text-slate-400 pl-8 pb-2">
                    Chưa có kế hoạch hành động.{' '}
                    <button className="text-blue-500 hover:underline" onClick={() => onAddAP(kpi)}>+ Tạo ngay</button>
                  </p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Kanban View ──────────────────────────────────────────────────────────────

const KANBAN_COLUMNS = [
  { status: 'TODO' },
  { status: 'IN_PROGRESS' },
  { status: 'REVIEW' },
  { status: 'DONE' },
  { status: 'BLOCKED' },
  { status: 'CANCELLED' },
]

function KanbanCard({ task, ap, kpi, onEdit, onDelete, dragging }) {
  const m = STATUS_META[task.status] ?? STATUS_META.TODO
  const p = PERSPECTIVES[kpi?.perspective] ?? {}
  return (
    <div className={clsx(
      'bg-white rounded-xl border shadow-sm overflow-hidden group hover:shadow-md transition-all',
      dragging ? 'opacity-50 rotate-1' : '',
      task.status === 'BLOCKED' ? 'border-red-200' : 'border-slate-200'
    )}>
      <div className="h-0.5 w-full" style={{ background: p.color ?? '#64748b' }} />
      <div className="p-3">
        <div className="flex items-start justify-between gap-1 mb-1.5">
          <p className="text-xs font-semibold text-slate-800 leading-snug flex-1 line-clamp-2">{task.name}</p>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button onClick={() => onEdit(task)} className="w-5 h-5 flex items-center justify-center hover:bg-slate-100 rounded"><Pencil size={10} className="text-slate-400" /></button>
            <button onClick={() => onDelete(task.id)} className="w-5 h-5 flex items-center justify-center hover:bg-red-50 rounded"><Trash2 size={10} className="text-red-400" /></button>
          </div>
        </div>
        {ap && <p className="text-[10px] text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded mb-1.5 truncate">↳ {ap.name}</p>}
        {kpi && <p className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded mb-1.5 truncate">📌 {kpi.name}</p>}
        {task.status === 'BLOCKED' && task.blockReason && (
          <p className="text-[10px] text-red-600 bg-red-50 rounded px-1.5 py-0.5 mb-1.5">🚫 {task.blockReason}</p>
        )}
        <div className="mb-1.5">
          <ProgressBar value={task.progress} color={m.color} />
          <span className="text-[10px] text-slate-400">{task.progress}%</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          {task.assigneeName ? <span className="flex items-center gap-0.5"><User size={9} />{task.assigneeName.split(' ').slice(-1)}</span> : <span />}
          {task.dueDate && <span className="flex items-center gap-0.5"><Calendar size={9} />{task.dueDate}</span>}
        </div>
      </div>
    </div>
  )
}

function KanbanView({ tasks, actionPlans, allKPIs, onEditTask, onDeleteTask, onDrop, dragId, onDragStart }) {
  return (
    <div className="p-4 overflow-x-auto">
      <div className="flex gap-3 min-w-max">
        {KANBAN_COLUMNS.map(({ status }) => {
          const m = STATUS_META[status]
          const colTasks = tasks.filter((t) => t.status === status)
          return (
            <div
              key={status}
              className="w-52 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden flex flex-col"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); onDrop(status) }}
            >
              <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-200 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: m.color }} />
                <span className="text-xs font-semibold text-slate-700 flex-1">{m.label}</span>
                <span className="text-xs font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded-full border border-slate-200">{colTasks.length}</span>
              </div>
              <div className="p-2 space-y-2 flex-1 min-h-24">
                {colTasks.map((task) => {
                  const ap = actionPlans.find((a) => a.id === task.actionPlanId)
                  const kpi = allKPIs.find((k) => k.id === ap?.kpiId)
                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => onDragStart(task.id)}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <KanbanCard
                        task={task}
                        ap={ap}
                        kpi={kpi}
                        onEdit={onEditTask}
                        onDelete={onDeleteTask}
                        dragging={dragId === task.id}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Gantt View ───────────────────────────────────────────────────────────────

function GanttView({ tasks, actionPlans, allKPIs }) {
  const chartData = tasks
    .filter((t) => t.startDate && t.dueDate)
    .slice(0, 12)
    .map((t) => {
      const ap = actionPlans.find((a) => a.id === t.actionPlanId)
      const kpi = allKPIs.find((k) => k.id === ap?.kpiId)
      const p = PERSPECTIVES[kpi?.perspective] ?? {}
      return {
        name: (t.name.length > 22 ? t.name.slice(0, 22) + '…' : t.name),
        start: new Date(t.startDate).getMonth() + 1,
        duration: Math.max(0.5, (new Date(t.dueDate) - new Date(t.startDate)) / (1000 * 60 * 60 * 24 * 30)),
        color: p.color ?? '#64748b',
        status: t.status,
      }
    })
  return (
    <div className="p-5">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h2 className="font-semibold text-slate-800 text-sm mb-4 flex items-center gap-2">
          <Calendar size={15} className="text-blue-600" /> Timeline Tasks (theo tháng)
        </h2>
        {chartData.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-10">Chưa có task nào có ngày bắt đầu / kết thúc.</p>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={chartData} margin={{ top: 0, right: 30, bottom: 0, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" domain={[1, 12]} tickCount={12} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip formatter={(v, n) => [n === 'start' ? `Tháng ${v}` : `${+v.toFixed(1)} tháng`, n === 'start' ? 'Bắt đầu' : 'Thời gian']} />
                <Bar dataKey="start" fill="transparent" stackId="a" />
                <Bar dataKey="duration" radius={[0, 4, 4, 0]} stackId="a">
                  {chartData.map((d, i) => <Cell key={i} fill={d.color} opacity={d.status === 'DONE' ? 1 : 0.7} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── KPI Report View ──────────────────────────────────────────────────────────

function KpiReportView({ allKPIs, kpiReports, onAddReport, onDeleteReport }) {
  return (
    <div className="p-5 space-y-4">
      {allKPIs.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-10">Chưa có KPI nào. Hoàn thành B5 trước.</p>
      )}
      {allKPIs.map((kpi) => {
        const reports = kpiReports.filter((r) => r.kpiId === kpi.id).sort((a, b) => b.reportedAt.localeCompare(a.reportedAt))
        const p = PERSPECTIVES[kpi.perspective] ?? {}
        return (
          <div key={kpi.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color ?? '#64748b' }} />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-slate-800">{kpi.name}</span>
                <span className="ml-2 text-[10px] text-slate-400">{kpi.deptName} · {p.label}</span>
              </div>
              <button
                onClick={() => onAddReport(kpi)}
                className="text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium"
              >
                <Plus size={12} /> Báo cáo
              </button>
            </div>
            {reports.length === 0 ? (
              <p className="text-xs text-slate-400 px-5 py-3">Chưa có báo cáo giá trị thực tế.</p>
            ) : (
              <div className="divide-y divide-slate-50">
                {reports.map((r) => (
                  <div key={r.id} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50/50 group">
                    <div className="text-xs text-slate-400 shrink-0 w-24">{r.reportedAt}</div>
                    <div className="text-sm font-bold text-slate-800 shrink-0 w-20">{r.actualValue}</div>
                    <div className="text-xs text-slate-500 flex-1 truncate">{r.note || '—'}</div>
                    <button
                      onClick={() => onDeleteReport(r.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ActionPlanPage() {
  const {
    actionPlans, tasks, kpiReports,
    addActionPlan, updateActionPlan, deleteActionPlan,
    addTask, updateTask, deleteTask, setTaskStatus,
    addKpiReport, deleteKpiReport, completeB8, fetchActionPlans, fetchTasks,
  } = useActionPlanStore()
  const { strategyId } = useBscContextStore()
  const { b3Selected } = useSWOTStore()
  const mapStore = useStrategyMapStore()
  const fishboneStore = useFishboneStore()

  const objectives = useMemo(
    () => mapStore.getEffectiveFinalObjectives(b3Selected),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mapStore, b3Selected]
  )
  const allKPIs = fishboneStore.getAllKPIs(objectives)
  const departments = fishboneStore.departments

  // Load action plans and tasks from backend on mount
  useEffect(() => {
    if (strategyId) {
      fetchActionPlans(strategyId)
      fetchTasks(strategyId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategyId])

  const [tab, setTab] = useState('list')
  const [dragId, setDragId] = useState(null)
  const [blockedPending, setBlockedPending] = useState(null) // { taskId, targetStatus }

  // Modal states
  const [apModal, setApModal] = useState({ open: false, kpi: null, edit: null })
  const [taskModal, setTaskModal] = useState({ open: false, ap: null, edit: null })
  const [reportModal, setReportModal] = useState({ open: false, kpi: null })
  const [blockedModal, setBlockedModal] = useState(false)

  const handleStatusChange = (taskId, newStatus) => {
    if (newStatus === 'BLOCKED') {
      setBlockedPending({ taskId, targetStatus: newStatus })
      setBlockedModal(true)
    } else {
      setTaskStatus(taskId, newStatus)
    }
  }

  const handleBlockedConfirm = (reason) => {
    if (blockedPending) {
      setTaskStatus(blockedPending.taskId, 'BLOCKED', { blockReason: reason })
      setBlockedPending(null)
    }
  }

  const handleDrop = (status) => {
    if (!dragId) return
    handleStatusChange(dragId, status)
    setDragId(null)
  }

  const stats = {
    totalAPs: actionPlans.length,
    totalTasks: tasks.length,
    done: tasks.filter((t) => t.status === 'DONE').length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    blocked: tasks.filter((t) => t.status === 'BLOCKED').length,
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">B8. Action Plan</h1>
          <p className="text-sm text-slate-500 mt-1">Trưởng phòng tạo kế hoạch hành động → Thêm task → Phân công nhân viên thực hiện</p>
        </div>
        <button
          onClick={async () => {
            try {
              await completeB8(strategyId)
            } catch (e) {
              alert(e.message)
            }
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          <Save size={15} /> Hoàn thành B8
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Kế hoạch',      value: stats.totalAPs,   color: 'text-slate-800' },
          { label: 'Tổng tasks',    value: stats.totalTasks, color: 'text-slate-700' },
          { label: 'Hoàn thành',   value: stats.done,        color: 'text-emerald-600' },
          { label: 'Đang làm',     value: stats.inProgress,  color: 'text-blue-600' },
          { label: 'Bị chặn',      value: stats.blocked,     color: 'text-red-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100">
          {[
            ['list',   '☰ Danh sách'],
            ['kanban', '⬜ Kanban'],
            ['gantt',  '📅 Gantt'],
            ['report', '📊 Báo cáo KPI'],
          ].map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                'px-4 py-3.5 text-sm font-semibold transition-colors border-b-2',
                tab === t ? 'border-blue-500 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'list' && (
          <ListView
            allKPIs={allKPIs}
            actionPlans={actionPlans}
            tasks={tasks}
            onAddAP={(kpi) => setApModal({ open: true, kpi, edit: null })}
            onEditAP={(ap) => {
              const kpi = allKPIs.find((k) => k.id === ap.kpiId)
              setApModal({ open: true, kpi, edit: ap })
            }}
            onDeleteAP={deleteActionPlan}
            onAddTask={(ap) => setTaskModal({ open: true, ap, edit: null })}
            onEditTask={(task) => {
              const ap = actionPlans.find((a) => a.id === task.actionPlanId)
              setTaskModal({ open: true, ap, edit: task })
            }}
            onDeleteTask={deleteTask}
            onStatusChange={handleStatusChange}
          />
        )}

        {tab === 'kanban' && (
          <KanbanView
            tasks={tasks}
            actionPlans={actionPlans}
            allKPIs={allKPIs}
            onEditTask={(task) => {
              const ap = actionPlans.find((a) => a.id === task.actionPlanId)
              setTaskModal({ open: true, ap, edit: task })
            }}
            onDeleteTask={deleteTask}
            onDrop={handleDrop}
            dragId={dragId}
            onDragStart={setDragId}
          />
        )}

        {tab === 'gantt' && (
          <GanttView tasks={tasks} actionPlans={actionPlans} allKPIs={allKPIs} />
        )}

        {tab === 'report' && (
          <KpiReportView
            allKPIs={allKPIs}
            kpiReports={kpiReports}
            onAddReport={(kpi) => setReportModal({ open: true, kpi })}
            onDeleteReport={deleteKpiReport}
          />
        )}
      </div>

      {/* Modals */}
      <ActionPlanModal
        open={apModal.open}
        onClose={() => setApModal({ open: false, kpi: null, edit: null })}
        onSave={async (data) => {
          try {
            if (apModal.edit) await updateActionPlan(apModal.edit.id, data)
            else await addActionPlan(strategyId, data)
          } catch (e) { alert(e.message) }
        }}
        kpiId={apModal.kpi?.id}
        kpiName={apModal.kpi?.name}
        departments={departments}
        edit={apModal.edit}
      />

      <TaskModal
        open={taskModal.open}
        onClose={() => setTaskModal({ open: false, ap: null, edit: null })}
        onSave={async (data) => {
          try {
            if (taskModal.edit) await updateTask(taskModal.edit.id, data)
            else await addTask(data)
          } catch (e) { alert(e.message) }
        }}
        actionPlanId={taskModal.ap?.id}
        actionPlanName={taskModal.ap?.name}
        edit={taskModal.edit}
      />

      <BlockedModal
        open={blockedModal}
        onClose={() => { setBlockedModal(false); setBlockedPending(null) }}
        onConfirm={handleBlockedConfirm}
      />

      <KpiReportModal
        open={reportModal.open}
        onClose={() => setReportModal({ open: false, kpi: null })}
        onSave={addKpiReport}
        kpi={reportModal.kpi}
      />
    </div>
  )
}
