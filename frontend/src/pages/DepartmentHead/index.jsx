import { useEffect, useState, useCallback } from 'react'
import {
  RefreshCw, Loader2, AlertCircle, Target, Rocket,
  BarChart3, TrendingUp, Users, CheckCircle2, Clock,
  Flag, AlertTriangle, Plus, Pencil, Trash2, Save, X,
  ChevronRight, Play, PauseCircle, Eye, Ban, XCircle,
  FileText, ThumbsUp, ThumbsDown, Shield
} from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore } from '../../store/authStore.js'
import { useBscContextStore } from '../../store/bscContextStore.js'
import api from '../../services/api.js'

// ─── Constants ────────────────────────────────────────────────────────────────
const ACHIEVEMENT_META = {
  ON_TRACK:     { label: 'Đúng tiến độ',  color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
  AT_RISK:      { label: 'Có rủi ro',     color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  OFF_TRACK:    { label: 'Chậm tiến độ',  color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  NOT_STARTED:  { label: 'Chưa bắt đầu', color: '#475569', bg: '#f8fafc', border: '#e2e8f0' },
  ACHIEVED:     { label: 'Đạt mục tiêu',  color: '#047857', bg: '#d1fae5', border: '#6ee7b7' },
}
const STATUS_META = {
  TODO:        { label: 'Chờ thực hiện',   color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' },
  IN_PROGRESS: { label: 'Đang thực hiện',  color: '#3C50E0', bg: '#eff4ff', border: '#c7d2fe' },
  REVIEW:      { label: 'Đang kiểm tra',   color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  DONE:        { label: 'Hoàn thành',       color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  BLOCKED:     { label: 'Bị chặn',          color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  CANCELLED:   { label: 'Đã hủy',           color: '#94a3b8', bg: '#f1f5f9', border: '#e2e8f0' },
}
const KPI_REPORT_STATUS = {
  DRAFT:     { label: 'Nháp',      color: '#64748b' },
  SUBMITTED: { label: 'Đã nộp',    color: '#3C50E0' },
  APPROVED:  { label: 'Đã duyệt',  color: '#16a34a' },
  REJECTED:  { label: 'Từ chối',   color: '#dc2626' },
}

// ─── Data Helpers ─────────────────────────────────────────────────────────────
function normalizeKanban(raw) {
  if (!raw || !Array.isArray(raw.columns)) return {}
  const result = {}
  for (const col of raw.columns) {
    result[col.status] = col.tasks ?? []
  }
  return result
}

function extractMeasuredKpis(treeResponse) {
  if (!treeResponse || !Array.isArray(treeResponse.perspectives)) return []
  const kpis = []
  for (const perspective of treeResponse.perspectives) {
    const objectives = perspective.objectives ?? []
    for (const objective of objectives) {
      const deptKpis = objective.departmentKpis ?? []
      for (const kpi of deptKpis) {
        if (kpi.measurementConfigured) kpis.push(kpi)
      }
    }
  }
  return kpis
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────
function Alert({ type, message, onClose }) {
  if (!message) return null
  const ok = type === 'success'
  return (
    <div className={clsx(
      'flex items-start gap-3 px-4 py-3.5 rounded-xl text-sm font-medium border mb-5 shadow-sm animate-in fade-in slide-in-from-top-2',
      ok ? 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
         : 'bg-red-50 text-red-800 border-red-200/60'
    )}>
      {ok ? <CheckCircle2 size={18} className="shrink-0 text-emerald-600 mt-0.5" />
           : <AlertCircle  size={18} className="shrink-0 text-red-600 mt-0.5" />}
      <span className="flex-1 leading-relaxed">{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 hover:bg-slate-200/50 rounded-md">
          <X size={16} />
        </button>
      )}
    </div>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5 custom-scrollbar">{children}</div>
      </div>
    </div>
  )
}

function FormField({ label, required, children, hint }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-slate-700">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

function Input({ id, value, onChange, placeholder, type = 'text', disabled, min, step }) {
  return (
    <input
      id={id} type={type} value={value} onChange={onChange}
      placeholder={placeholder} disabled={disabled} min={min} step={step}
      className={clsx(
        'w-full px-4 py-2.5 text-sm border rounded-xl transition-all outline-none',
        disabled
          ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
          : 'bg-white border-slate-200 hover:border-slate-300 focus:border-[#3C50E0] focus:ring-4 focus:ring-[#3C50E0]/10 text-slate-800 placeholder:text-slate-400'
      )}
    />
  )
}

// ─── Summary Cards ────────────────────────────────────────────────────────────
function SummaryCards({ actionPlans, tasks, kpiReports }) {
  const totalTasks = tasks.length
  const doneTasks = tasks.filter(t => t.status === 'DONE').length
  const blockedTasks = tasks.filter(t => t.status === 'BLOCKED').length
  const totalReports = kpiReports.length
  const pendingReports = kpiReports.filter(r => r.reviewStatus === 'SUBMITTED').length

  const cards = [
    { label: 'Action Plans',    value: actionPlans.length, icon: Rocket, color: '#3C50E0' },
    { label: 'Tổng Task',       value: totalTasks,          icon: Flag,   color: '#8b5cf6' },
    { label: 'Task Hoàn thành', value: doneTasks,            icon: CheckCircle2, color: '#10b981',
      sub: totalTasks > 0 ? `${Math.round(doneTasks/totalTasks*100)}%` : '0%' },
    { label: 'Task Bị chặn',    value: blockedTasks,         icon: AlertTriangle, color: '#ef4444' },
    { label: 'Báo cáo KPI',     value: totalReports,         icon: BarChart3, color: '#f59e0b' },
    { label: 'Chờ phê duyệt',   value: pendingReports,       icon: Clock,  color: '#06b6d4' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map(({ label, value, icon: Icon, color, sub }) => (
        <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Icon size={48} style={{ color }} />
          </div>
          <div className="flex flex-col h-full relative">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-inner" style={{ background: `linear-gradient(135deg, ${color}22 0%, ${color}44 100%)` }}>
              <Icon size={20} style={{ color }} />
            </div>
            <p className="text-3xl font-extrabold text-slate-800 mb-1">{value}</p>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            {sub && <p className="text-xs font-bold mt-1" style={{ color }}>Tiến độ: {sub}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Action Plans section ─────────────────────────────────────────────────────
function ActionPlansSection({ strategyId, departmentId, employees }) {
  const [actionPlans, setActionPlans] = useState([])
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', startDate: '', endDate: '', ownerEmployeeId: '', priority: 'MEDIUM' })
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const [measuredKpis, setMeasuredKpis] = useState([])
  const [selectedKpiId, setSelectedKpiId] = useState('')

  const load = useCallback(async () => {
    if (!strategyId) return
    setLoading(true)
    try {
      const [aps, measTree] = await Promise.all([
        api.get(`/bsc-strategies/${strategyId}/action-plans`, { params: departmentId ? { departmentId } : {} }),
        api.get(`/bsc-strategies/${strategyId}/measurements`),
      ])
      setActionPlans(Array.isArray(aps) ? aps : [])
      setMeasuredKpis(extractMeasuredKpis(measTree))
    } catch (e) {
      setFeedback({ type: 'error', message: e.message })
    } finally { setLoading(false) }
  }, [strategyId, departmentId])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setForm({ name: '', description: '', startDate: '', endDate: '', ownerEmployeeId: employees[0]?.id ?? '', priority: 'MEDIUM' })
    setSelectedKpiId(measuredKpis[0]?.departmentKpiId ?? '')
    setEditTarget(null)
    setModal('create')
  }
  const openEdit = (ap) => {
    setForm({
      name: ap.name ?? '',
      description: ap.description ?? '',
      startDate: ap.startDate?.toString().split('T')[0] ?? '',
      endDate: ap.endDate?.toString().split('T')[0] ?? '',
      ownerEmployeeId: ap.ownerId ?? '',
      priority: ap.priority ?? 'MEDIUM',
      status: ap.status ?? 'ACTIVE',
    })
    setEditTarget(ap)
    setModal('edit')
  }

  const handleSave = async () => {
    if (!form.name.trim()) return setFeedback({ type: 'error', message: 'Tên action plan là bắt buộc' })
    if (!form.startDate) return setFeedback({ type: 'error', message: 'Ngày bắt đầu là bắt buộc' })
    if (!form.endDate) return setFeedback({ type: 'error', message: 'Ngày kết thúc là bắt buộc' })
    if (!form.ownerEmployeeId) return setFeedback({ type: 'error', message: 'Người phụ trách là bắt buộc' })
    setSaving(true); setFeedback(null)
    try {
      if (modal === 'create') {
        if (!selectedKpiId) return setFeedback({ type: 'error', message: 'Chọn KPI liên quan' })
        await api.post('/action-plans', {
          bscStrategyId: strategyId,
          departmentKpiId: selectedKpiId,
          name: form.name,
          description: form.description || null,
          startDate: form.startDate,
          endDate: form.endDate,
          ownerId: form.ownerEmployeeId,
          priority: form.priority || 'MEDIUM',
          status: 'ACTIVE',
        })
        setFeedback({ type: 'success', message: 'Đã tạo Action Plan!' })
      } else {
        await api.put(`/action-plans/${editTarget.id}`, {
          name: form.name,
          description: form.description || null,
          startDate: form.startDate,
          endDate: form.endDate,
          ownerId: form.ownerEmployeeId,
          priority: form.priority || 'MEDIUM',
          status: form.status || 'ACTIVE',
        })
        setFeedback({ type: 'success', message: 'Đã cập nhật Action Plan!' })
      }
      setModal(null)
      await load()
    } catch (e) {
      setFeedback({ type: 'error', message: e.message })
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Rocket size={20} className="text-[#3C50E0]" /> Action Plans
          </h2>
          <p className="text-sm text-slate-500 mt-1">Các kế hoạch hành động triển khai KPI ({actionPlans.length})</p>
        </div>
        <button
          id="dh-add-ap"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3C50E0] text-white text-sm font-semibold rounded-xl hover:bg-[#3142C4] transition-all shadow-sm hover:shadow-md"
        >
          <Plus size={16} /> Thêm kế hoạch
        </button>
      </div>

      <Alert type={feedback?.type} message={feedback?.message} onClose={() => setFeedback(null)} />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Loader2 size={32} className="animate-spin text-[#3C50E0] mb-4" />
          <p className="text-sm font-medium">Đang tải kế hoạch...</p>
        </div>
      ) : actionPlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed text-slate-500 text-center">
          <Rocket size={48} className="mb-4 opacity-20" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">Chưa có Kế hoạch hành động</h3>
          <p className="text-sm max-w-sm mb-6">Tạo các Action Plan liên kết trực tiếp với KPI để đội ngũ có thể bắt đầu thực hiện.</p>
          <button onClick={openCreate} className="inline-flex items-center gap-2 px-5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-all shadow-sm">
            <Plus size={16} /> Thêm kế hoạch đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {actionPlans.map(ap => {
            const apStatus = ap.status ?? 'ACTIVE'
            return (
              <div key={ap.id} className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-[#3C50E0]/30 hover:shadow-lg transition-all flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full" style={{ background: apStatus === 'ACTIVE' ? '#10b981' : '#94a3b8' }}></div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={clsx('text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold border',
                        apStatus === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                      )}>{apStatus}</span>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full truncate max-w-[150px]" title={ap.kpiName}>
                        KPI: {ap.kpiName}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{ap.name}</h3>
                  </div>
                  <button
                    onClick={() => openEdit(ap)}
                    className="p-2 text-slate-400 hover:text-[#3C50E0] bg-slate-50 hover:bg-blue-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  ><Pencil size={16} /></button>
                </div>
                
                <div className="flex-1 mb-4">
                  {ap.description ? (
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{ap.description}</p>
                  ) : (
                    <p className="text-sm text-slate-400 italic">Không có mô tả chi tiết</p>
                  )}
                </div>
                
                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                    <Clock size={14} className="text-slate-400" />
                    <span>{ap.startDate ? new Date(ap.startDate).toLocaleDateString('vi-VN') : '—'}</span>
                    <span className="text-slate-300">→</span>
                    <span>{ap.endDate ? new Date(ap.endDate).toLocaleDateString('vi-VN') : '—'}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'create' ? 'Tạo Kế hoạch Hành động' : 'Cập nhật Kế hoạch'} onClose={() => setModal(null)}>
          <div className="space-y-5">
            {modal === 'create' && (
              <FormField label="KPI liên kết" required hint="Mỗi kế hoạch hành động phải phục vụ cho một KPI cụ thể">
                <select value={selectedKpiId} onChange={e => setSelectedKpiId(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none hover:border-slate-300 focus:border-[#3C50E0] focus:ring-4 focus:ring-[#3C50E0]/10 transition-all text-slate-800">
                  <option value="">-- Chọn KPI --</option>
                  {measuredKpis.map(m => <option key={m.departmentKpiId} value={m.departmentKpiId}>{m.kpiName}</option>)}
                </select>
              </FormField>
            )}
            
            <FormField label="Tên Kế hoạch" required>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: Chiến dịch Marketing Mùa hè" />
            </FormField>
            
            <FormField label="Mô tả chi tiết">
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Mục tiêu, phạm vi thực hiện..."
                className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl outline-none hover:border-slate-300 focus:border-[#3C50E0] focus:ring-4 focus:ring-[#3C50E0]/10 transition-all resize-none text-slate-800" />
            </FormField>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Ngày bắt đầu" required>
                <Input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
              </FormField>
              <FormField label="Ngày hoàn thành" required>
                <Input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
              </FormField>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Người phụ trách" required>
                <select value={form.ownerEmployeeId} onChange={e => setForm(f => ({ ...f, ownerEmployeeId: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none hover:border-slate-300 focus:border-[#3C50E0] focus:ring-4 focus:ring-[#3C50E0]/10 transition-all text-slate-800">
                  <option value="">-- Phân công --</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.fullName}</option>)}
                </select>
              </FormField>
              
              <FormField label="Độ ưu tiên">
                <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none hover:border-slate-300 focus:border-[#3C50E0] focus:ring-4 focus:ring-[#3C50E0]/10 transition-all text-slate-800">
                  <option value="LOW">Thấp</option>
                  <option value="MEDIUM">Trung bình</option>
                  <option value="HIGH">Cao</option>
                  <option value="CRITICAL">Khẩn cấp</option>
                </select>
              </FormField>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
              <button onClick={() => setModal(null)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Hủy bỏ</button>
              <button id="ap-save" onClick={handleSave} disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3C50E0] text-white text-sm font-semibold rounded-xl hover:bg-[#3142C4] disabled:bg-slate-300 transition-all shadow-md">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {saving ? 'Đang lưu...' : 'Lưu kế hoạch'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── KPI Reports section ──────────────────────────────────────────────────────
function KpiReportsSection({ strategyId, departmentId }) {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ departmentKpiId: '', actualValue: '', reportingPeriod: '', notes: '', reviewStatus: 'SUBMITTED' })
  const [measuredKpis, setMeasuredKpis] = useState([])
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    if (!strategyId) return
    setLoading(true)
    try {
      const [reps, measTree] = await Promise.all([
        api.get(`/bsc-strategies/${strategyId}/kpi-reports`, { params: departmentId ? { departmentId } : {} }),
        api.get(`/bsc-strategies/${strategyId}/measurements`),
      ])
      setReports(Array.isArray(reps) ? reps : [])
      setMeasuredKpis(extractMeasuredKpis(measTree))
    } catch (e) {
      setFeedback({ type: 'error', message: e.message })
    } finally { setLoading(false) }
  }, [strategyId, departmentId])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setForm({ departmentKpiId: measuredKpis[0]?.departmentKpiId ?? '', actualValue: '', reportingPeriod: '', notes: '', reviewStatus: 'SUBMITTED' })
    setModal('create')
  }

  const handleSave = async () => {
    if (!form.departmentKpiId || !form.actualValue || !form.reportingPeriod)
      return setFeedback({ type: 'error', message: 'KPI, Giá trị thực tế và Kỳ báo cáo là bắt buộc' })
    const numericValue = parseFloat(form.actualValue)
    if (isNaN(numericValue) || numericValue < 0)
      return setFeedback({ type: 'error', message: 'Giá trị thực tế phải là số không âm' })
    setSaving(true); setFeedback(null)
    try {
      await api.post('/kpi-reports', {
        departmentKpiId: form.departmentKpiId,
        actualValue: numericValue,
        reportingPeriod: form.reportingPeriod,
        note: form.notes || null,
        reviewStatus: form.reviewStatus,
      })
      setFeedback({ type: 'success', message: 'Đã nộp báo cáo KPI!' })
      setModal(null)
      await load()
    } catch (e) {
      setFeedback({ type: 'error', message: e.message })
    } finally { setSaving(false) }
  }

  const handleReview = async (reportId, approved) => {
    try {
      await api.patch(`/kpi-reports/${reportId}/review`, { reviewStatus: approved ? 'APPROVED' : 'REJECTED' })
      setFeedback({ type: 'success', message: approved ? 'Đã phê duyệt báo cáo!' : 'Đã từ chối báo cáo!' })
      await load()
    } catch (e) { setFeedback({ type: 'error', message: e.message }) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 size={20} className="text-[#3C50E0]" /> Báo cáo KPI
          </h2>
          <p className="text-sm text-slate-500 mt-1">Lịch sử đánh giá và kết quả đo lường KPI ({reports.length})</p>
        </div>
        <button id="dh-add-report" onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3C50E0] text-white text-sm font-semibold rounded-xl hover:bg-[#3142C4] transition-all shadow-sm hover:shadow-md">
          <Plus size={16} /> Báo cáo mới
        </button>
      </div>

      <Alert type={feedback?.type} message={feedback?.message} onClose={() => setFeedback(null)} />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Loader2 size={32} className="animate-spin text-[#3C50E0] mb-4" />
          <p className="text-sm font-medium">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600">
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Mục tiêu KPI</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">Kỳ báo cáo</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Kết quả (Thực tế)</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">Đạt được</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Kiểm duyệt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-slate-500">
                      <div className="flex flex-col items-center">
                        <FileText size={40} className="mb-4 opacity-20" />
                        <p className="font-semibold text-slate-700">Chưa có báo cáo nào</p>
                        <p className="text-sm mt-1">Hãy nộp báo cáo kết quả thực hiện KPI đầu tiên.</p>
                      </div>
                    </td>
                  </tr>
                ) : reports.map(r => {
                  const statusMeta = KPI_REPORT_STATUS[r.reviewStatus] ?? KPI_REPORT_STATUS.SUBMITTED
                  const achieveMeta = ACHIEVEMENT_META[r.achievementStatus] ?? ACHIEVEMENT_META.NOT_STARTED
                  return (
                    <tr key={r.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {r.kpiName ?? r.departmentKpiId}
                        {r.note && <p className="text-xs font-normal text-slate-500 mt-1 line-clamp-1 italic">{r.note}</p>}
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium hidden sm:table-cell">{r.reportingPeriod}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-extrabold text-lg text-[#1C2434]">{r.actualValue}</span>
                        {r.completionRate != null && (
                          <div className="flex items-center justify-end gap-2 mt-1">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, Math.max(0, r.completionRate))}%`, background: achieveMeta.color }}></div>
                            </div>
                            <span className="text-xs font-bold" style={{ color: achieveMeta.color }}>{r.completionRate?.toFixed(1)}%</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border" style={{ background: achieveMeta.bg, color: achieveMeta.color, borderColor: achieveMeta.border }}>
                          {achieveMeta.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <span className="w-2 h-2 rounded-full" style={{ background: statusMeta.color }}></span>
                          <span style={{ color: statusMeta.color }}>{statusMeta.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {r.reviewStatus === 'SUBMITTED' ? (
                            <>
                              <button onClick={() => handleReview(r.id, true)} title="Phê duyệt"
                                className="p-2 text-emerald-600 bg-emerald-50 border border-emerald-200 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm">
                                <ThumbsUp size={16} />
                              </button>
                              <button onClick={() => handleReview(r.id, false)} title="Từ chối"
                                className="p-2 text-red-600 bg-red-50 border border-red-200 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm">
                                <ThumbsDown size={16} />
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Đã xử lý</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal === 'create' && (
        <Modal title="Báo cáo kết quả KPI" onClose={() => setModal(null)}>
          <div className="space-y-5">
            <FormField label="KPI cần báo cáo" required>
              <select value={form.departmentKpiId} onChange={e => setForm(f => ({ ...f, departmentKpiId: e.target.value }))}
                className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none hover:border-slate-300 focus:border-[#3C50E0] focus:ring-4 focus:ring-[#3C50E0]/10 transition-all text-slate-800">
                <option value="">-- Lựa chọn KPI --</option>
                {measuredKpis.map(m => <option key={m.departmentKpiId} value={m.departmentKpiId}>{m.kpiName}</option>)}
              </select>
            </FormField>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Giá trị thực tế" required>
                <Input type="number" min="0" step="0.01" value={form.actualValue} onChange={e => setForm(f => ({ ...f, actualValue: e.target.value }))} placeholder="Nhập số liệu..." />
              </FormField>
              <FormField label="Kỳ báo cáo" required>
                <Input value={form.reportingPeriod} onChange={e => setForm(f => ({ ...f, reportingPeriod: e.target.value }))} placeholder="VD: Q1-2026, T07/2026..." />
              </FormField>
            </div>
            
            <FormField label="Trạng thái lưu">
              <select value={form.reviewStatus} onChange={e => setForm(f => ({ ...f, reviewStatus: e.target.value }))}
                className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none hover:border-slate-300 focus:border-[#3C50E0] focus:ring-4 focus:ring-[#3C50E0]/10 transition-all text-slate-800">
                <option value="DRAFT">Lưu Nháp (Chưa gửi)</option>
                <option value="SUBMITTED">Nộp ngay (Gửi duyệt)</option>
              </select>
            </FormField>
            
            <FormField label="Giải trình / Ghi chú">
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} placeholder="Mô tả nguyên nhân đạt/không đạt..."
                className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl outline-none hover:border-slate-300 focus:border-[#3C50E0] focus:ring-4 focus:ring-[#3C50E0]/10 transition-all resize-none text-slate-800" />
            </FormField>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
              <button onClick={() => setModal(null)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Hủy bỏ</button>
              <button id="report-save" onClick={handleSave} disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3C50E0] text-white text-sm font-semibold rounded-xl hover:bg-[#3142C4] disabled:bg-slate-300 transition-all shadow-md">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {saving ? 'Đang xử lý...' : 'Xác nhận nộp'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── Tasks Section ────────────────────────────────────────────────────────────
function TasksSection({ strategyId, departmentId, actionPlans, employees }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ actionPlanId: '', name: '', description: '', assigneeId: '', startDate: '', dueDate: '', priority: 'MEDIUM' })
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const load = useCallback(async () => {
    if (!strategyId) return
    setLoading(true)
    try {
      const raw = await api.get(`/bsc-strategies/${strategyId}/tasks/kanban`, {
        params: departmentId ? { departmentId } : {}
      })
      const normalized = normalizeKanban(raw)
      const all = Object.values(normalized).flat()
      setTasks(all)
    } catch (e) {
      setFeedback({ type: 'error', message: e.message })
    } finally { setLoading(false) }
  }, [strategyId, departmentId])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setForm({ actionPlanId: actionPlans[0]?.id ?? '', name: '', description: '', assigneeId: employees[0]?.id ?? '', startDate: '', dueDate: '', priority: 'MEDIUM' })
    setModal('create')
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.actionPlanId) return setFeedback({ type: 'error', message: 'Tên task và Action Plan là bắt buộc' })
    if (!form.assigneeId) return setFeedback({ type: 'error', message: 'Người được giao là bắt buộc' })
    if (!form.startDate) return setFeedback({ type: 'error', message: 'Ngày bắt đầu là bắt buộc' })
    if (!form.dueDate) return setFeedback({ type: 'error', message: 'Ngày kết thúc là bắt buộc' })
    setSaving(true); setFeedback(null)
    try {
      await api.post('/tasks', {
        actionPlanId: form.actionPlanId,
        name: form.name,
        description: form.description || null,
        assigneeId: form.assigneeId,
        startDate: form.startDate,
        dueDate: form.dueDate,
        priority: form.priority,
      })
      setFeedback({ type: 'success', message: 'Đã tạo task!' })
      setModal(null)
      await load()
    } catch (e) {
      setFeedback({ type: 'error', message: e.message })
    } finally { setSaving(false) }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { newStatus })
      setFeedback({ type: 'success', message: 'Đã cập nhật trạng thái!' })
      await load()
    } catch (e) { setFeedback({ type: 'error', message: e.message }) }
  }

  const statusGroups = STATUS_META
  const grouped = Object.keys(statusGroups).map(s => ({
    status: s,
    meta: statusGroups[s],
    tasks: tasks.filter(t => t.status === s),
  })).filter(g => g.tasks.length > 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Flag size={20} className="text-[#3C50E0]" /> Nhiệm vụ (Tasks)
          </h2>
          <p className="text-sm text-slate-500 mt-1">Giao việc và theo dõi tiến độ chi tiết ({tasks.length} tasks)</p>
        </div>
        <button id="dh-add-task" onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3C50E0] text-white text-sm font-semibold rounded-xl hover:bg-[#3142C4] transition-all shadow-sm hover:shadow-md">
          <Plus size={16} /> Giao task mới
        </button>
      </div>

      <Alert type={feedback?.type} message={feedback?.message} onClose={() => setFeedback(null)} />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Loader2 size={32} className="animate-spin text-[#3C50E0] mb-4" />
          <p className="text-sm font-medium">Đang tải danh sách nhiệm vụ...</p>
        </div>
      ) : grouped.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed text-slate-500 text-center">
          <Flag size={48} className="mb-4 opacity-20" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">Chưa có nhiệm vụ nào</h3>
          <p className="text-sm max-w-sm mb-6">Phân rã Kế hoạch hành động thành các công việc nhỏ hơn và giao cho nhân viên.</p>
          <button onClick={openCreate} className="inline-flex items-center gap-2 px-5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-all shadow-sm">
            <Plus size={16} /> Tạo nhiệm vụ
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ status, meta, tasks: groupTasks }) => (
            <div key={status} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider shadow-sm" style={{ background: meta.bg, color: meta.color, borderColor: meta.border }}>
                  {meta.label}
                </span>
                <span className="text-sm font-medium text-slate-500">{groupTasks.length} nhiệm vụ</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {groupTasks.map(task => (
                  <div key={task.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-[#3C50E0]/30 transition-all flex flex-col">
                    <p className="font-bold text-slate-800 mb-2 leading-tight">{task.name}</p>
                    {task.assigneeName && (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-4 bg-slate-50 px-2 py-1 rounded-lg w-fit">
                        <Users size={12} className="text-[#3C50E0]" /> {task.assigneeName}
                      </div>
                    )}
                    <div className="mt-auto pt-4 border-t border-slate-100">
                      {['TODO', 'IN_PROGRESS', 'REVIEW', 'BLOCKED'].includes(status) && (() => {
                        const NEXT_MAP = { TODO: ['IN_PROGRESS'], IN_PROGRESS: ['REVIEW', 'BLOCKED'], REVIEW: ['DONE', 'IN_PROGRESS'], BLOCKED: ['IN_PROGRESS', 'CANCELLED'] }
                        const nexts = NEXT_MAP[status] ?? []
                        return nexts.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {nexts.map(ns => (
                              <button key={ns} onClick={() => handleStatusChange(task.id, ns)}
                                className="flex-1 flex justify-center items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg border transition-all hover:scale-[1.02] shadow-sm"
                                style={{ borderColor: STATUS_META[ns]?.border, color: STATUS_META[ns]?.color, backgroundColor: STATUS_META[ns]?.bg }}>
                                Chuyển: {STATUS_META[ns]?.label}
                              </button>
                            ))}
                          </div>
                        ) : null
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal === 'create' && (
        <Modal title="Tạo Nhiệm vụ (Task)" onClose={() => setModal(null)}>
          <div className="space-y-5">
            <FormField label="Kế hoạch hành động" required hint="Task này thuộc kế hoạch nào?">
              <select value={form.actionPlanId} onChange={e => setForm(f => ({ ...f, actionPlanId: e.target.value }))}
                className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none hover:border-slate-300 focus:border-[#3C50E0] focus:ring-4 focus:ring-[#3C50E0]/10 transition-all text-slate-800">
                <option value="">-- Lựa chọn Kế hoạch --</option>
                {actionPlans.map(ap => <option key={ap.id} value={ap.id}>{ap.name}</option>)}
              </select>
            </FormField>
            
            <FormField label="Tên Nhiệm vụ" required>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: Thiết kế banner quảng cáo" />
            </FormField>
            
            <FormField label="Giao việc cho" required>
              <select value={form.assigneeId} onChange={e => setForm(f => ({ ...f, assigneeId: e.target.value }))}
                className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none hover:border-slate-300 focus:border-[#3C50E0] focus:ring-4 focus:ring-[#3C50E0]/10 transition-all text-slate-800">
                <option value="">-- Lựa chọn Nhân viên --</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.fullName}</option>)}
              </select>
            </FormField>
            
            <FormField label="Mức độ ưu tiên">
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none hover:border-slate-300 focus:border-[#3C50E0] focus:ring-4 focus:ring-[#3C50E0]/10 transition-all text-slate-800">
                <option value="LOW">Thấp (Cần làm nhưng không gấp)</option>
                <option value="MEDIUM">Trung bình (Bình thường)</option>
                <option value="HIGH">Cao (Cần ưu tiên xử lý)</option>
                <option value="CRITICAL">Khẩn cấp (Xử lý ngay lập tức)</option>
              </select>
            </FormField>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Bắt đầu từ" required>
                <Input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
              </FormField>
              <FormField label="Deadline (Hạn chót)" required>
                <Input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
              </FormField>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
              <button onClick={() => setModal(null)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Hủy bỏ</button>
              <button id="task-save" onClick={handleSave} disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3C50E0] text-white text-sm font-semibold rounded-xl hover:bg-[#3142C4] disabled:bg-slate-300 transition-all shadow-md">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {saving ? 'Đang giao việc...' : 'Xác nhận tạo'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',     label: 'Tổng quan',      icon: BarChart3 },
  { id: 'action-plans', label: 'Action Plans',   icon: Rocket },
  { id: 'tasks',        label: 'Tasks',           icon: Flag },
  { id: 'kpi-reports',  label: 'Báo cáo KPI',    icon: FileText },
]

export default function DepartmentHeadPage() {
  const { user } = useAuthStore()
  const { strategyId } = useBscContextStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [overviewData, setOverviewData] = useState(null)
  const [employees, setEmployees] = useState([])
  const [actionPlans, setActionPlans] = useState([])
  const [error, setError] = useState(null)

  const departmentId = user?.departmentId
  const companyId = user?.companyId

  const loadOverview = useCallback(async () => {
    if (!strategyId) return
    setLoading(true); setError(null)
    try {
      const [ap, kanbanRaw, reports, emps] = await Promise.all([
        api.get(`/bsc-strategies/${strategyId}/action-plans`, { params: departmentId ? { departmentId } : {} }),
        api.get(`/bsc-strategies/${strategyId}/tasks/kanban`, { params: departmentId ? { departmentId } : {} }),
        api.get(`/bsc-strategies/${strategyId}/kpi-reports`, { params: departmentId ? { departmentId } : {} }),
        companyId ? api.get(`/companies/${companyId}/employees`, { params: { departmentId } }).catch(() => []) : Promise.resolve([]),
      ])
      const normalizedKanban = normalizeKanban(kanbanRaw)
      const allTasks = Object.values(normalizedKanban).flat()
      const deptAps = Array.isArray(ap) ? ap : []
      const deptReps = Array.isArray(reports) ? reports : []
      setOverviewData({ actionPlans: deptAps, tasks: allTasks, kpiReports: deptReps })
      setActionPlans(deptAps)
      setEmployees(Array.isArray(emps) ? emps : [])
    } catch (e) {
      setError(e.message)
    } finally { setLoading(false) }
  }, [strategyId, departmentId, companyId])

  useEffect(() => { loadOverview() }, [loadOverview])

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-purple-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full mb-3 border border-indigo-100">
            <Users size={12} /> Department Head
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Trưởng phòng {user?.departmentName}</h1>
          <p className="text-sm text-slate-500 mt-2 max-w-xl leading-relaxed">Xin chào <span className="font-bold text-slate-700">{user?.fullName}</span>! Theo dõi mục tiêu, giao việc và đánh giá KPI của phòng ban tại đây.</p>
        </div>

        <button onClick={loadOverview} disabled={loading}
          className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 shadow-sm text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all group">
          <RefreshCw size={16} className={clsx("text-[#3C50E0] group-hover:rotate-180 transition-transform duration-500", loading ? 'animate-spin' : '')} /> Làm mới dữ liệu
        </button>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {/* Summary cards always visible */}
      {overviewData && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <SummaryCards
            actionPlans={overviewData.actionPlans}
            tasks={overviewData.tasks}
            kpiReports={overviewData.kpiReports}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Modern Pill Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar pb-2">
          <div className="flex p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200 inline-flex min-w-max">
            {TABS.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id
              return (
                <button key={id} id={`dh-tab-${id}`} onClick={() => setActiveTab(id)}
                  className={clsx(
                    'flex items-center gap-2 px-6 py-2.5 text-sm font-semibold transition-all rounded-xl relative',
                    isActive
                      ? 'text-[#3C50E0] bg-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                  )}>
                  <Icon size={16} className={clsx("transition-transform duration-300", isActive ? "scale-110 text-[#3C50E0]" : "opacity-70")} /> 
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab content area */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out p-6 bg-white rounded-3xl border border-slate-200 shadow-sm min-h-[400px]">
          {activeTab === 'overview' && overviewData && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-800">Hoạt động nổi bật</h2>
                <button onClick={() => setActiveTab('action-plans')} className="text-sm font-semibold text-[#3C50E0] hover:text-[#3142C4] flex items-center gap-1">
                  Xem tất cả <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
                  <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><Rocket size={16} /></div>
                    Kế hoạch hành động gần đây
                  </h3>
                  <div className="space-y-3">
                    {overviewData.actionPlans.slice(0, 4).map(ap => (
                      <div key={ap.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-[#3C50E0]/30 transition-colors">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#3C50E0] shrink-0 shadow-sm" />
                        <span className="text-sm font-medium text-slate-700 flex-1 truncate">{ap.name}</span>
                        <ChevronRight size={14} className="text-slate-400" />
                      </div>
                    ))}
                    {overviewData.actionPlans.length === 0 && (
                      <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-white">
                        <p className="text-sm text-slate-400">Chưa có kế hoạch nào</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
                  <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg"><BarChart3 size={16} /></div>
                    Cập nhật KPI mới nhất
                  </h3>
                  <div className="space-y-3">
                    {overviewData.kpiReports.slice(0, 4).map(r => {
                      const sm = KPI_REPORT_STATUS[r.reviewStatus]
                      return (
                        <div key={r.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-amber-500/30 transition-colors">
                          <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{r.kpiName ?? r.departmentKpiId}</span>
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full border" style={{ color: sm?.color, backgroundColor: sm?.color + '15', borderColor: sm?.color + '40' }}>{sm?.label}</span>
                        </div>
                      )
                    })}
                    {overviewData.kpiReports.length === 0 && (
                      <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-white">
                        <p className="text-sm text-slate-400">Chưa có báo cáo nào</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'action-plans' && (
            <ActionPlansSection strategyId={strategyId} departmentId={departmentId} employees={employees} />
          )}
          {activeTab === 'tasks' && (
            <TasksSection strategyId={strategyId} departmentId={departmentId} actionPlans={actionPlans} employees={employees} />
          )}
          {activeTab === 'kpi-reports' && (
            <KpiReportsSection strategyId={strategyId} departmentId={departmentId} />
          )}
        </div>
      </div>
    </div>
  )
}
