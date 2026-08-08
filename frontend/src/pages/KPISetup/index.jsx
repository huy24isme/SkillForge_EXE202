import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronDown, AlertCircle, Check, Edit3 } from 'lucide-react'
import clsx from 'clsx'
import { useSWOTStore } from '../../store/swotStore.js'
import { useStrategyMapStore } from '../../store/strategyMapStore.js'
import { useFishboneStore } from '../../store/fishboneStore.js'
import { useBSCWorkflowStore } from '../../store/bscWorkflowStore.js'
import { useKPIMeasureStore } from '../../store/kpiMeasureStore.js'
import { useBscContextStore } from '../../store/bscContextStore.js'

const PERSPECTIVES = [
  { key: 'FINANCIAL',           label: 'Tài chính',             color: '#16a34a', badge: 'bg-emerald-100 text-emerald-700' },
  { key: 'CUSTOMER',            label: 'Khách hàng',            color: '#2563eb', badge: 'bg-blue-100 text-blue-700' },
  { key: 'INTERNAL_PROCESS',    label: 'Quy trình nội bộ',      color: '#9333ea', badge: 'bg-purple-100 text-purple-700' },
  { key: 'LEARNING_AND_GROWTH', label: 'Học hỏi & phát triển', color: '#d97706', badge: 'bg-amber-100 text-amber-700' },
]
const P_MAP = Object.fromEntries(PERSPECTIVES.map((p) => [p.key, p]))

const DIRECTIONS = [
  { value: 'HIGHER_IS_BETTER', label: 'Càng cao càng tốt ↑' },
  { value: 'LOWER_IS_BETTER',  label: 'Càng thấp càng tốt ↓' },
]
const FREQUENCIES = [
  { value: 'DAILY',     label: 'Hàng ngày' },
  { value: 'WEEKLY',    label: 'Hàng tuần' },
  { value: 'MONTHLY',   label: 'Hàng tháng' },
  { value: 'QUARTERLY', label: 'Hàng quý' },
  { value: 'YEARLY',    label: 'Hàng năm' },
]


// ── KPI Measure Form ──────────────────────────────────────────
function KPIMeasureForm({ config, onSave, onClose }) {
  const [form, setForm] = useState({
    unit: config?.unit ?? '',
    baselineValue: config?.baselineValue ?? '',
    targetValue: config?.targetValue ?? '',
    direction: config?.direction ?? 'HIGHER_IS_BETTER',
    frequency: config?.frequency ?? 'MONTHLY',
    formulaDescription: config?.formulaDescription ?? '',
    greenThreshold: config?.greenThreshold ?? 90,
    yellowThreshold: config?.yellowThreshold ?? 70,
  })
  const f = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }))
  const fn = (k) => (e) => setForm((s) => ({ ...s, [k]: +e.target.value }))

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Đơn vị đo <span className="text-red-400">*</span></label>
          <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 bg-white" placeholder="VD: %, triệu đồng, điểm..." value={form.unit} onChange={f('unit')} />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Giá trị hiện tại (Baseline)</label>
          <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 bg-white" placeholder="Tuỳ chọn..." value={form.baselineValue} onChange={f('baselineValue')} />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Chỉ tiêu (Target) <span className="text-red-400">*</span></label>
          <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 bg-white" placeholder="Giá trị cần đạt..." value={form.targetValue} onChange={f('targetValue')} />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Chiều đánh giá <span className="text-red-400">*</span></label>
          <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 bg-white" value={form.direction} onChange={f('direction')}>
            {DIRECTIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Kỳ báo cáo <span className="text-red-400">*</span></label>
          <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 bg-white" value={form.frequency} onChange={f('frequency')}>
            {FREQUENCIES.map((fr) => <option key={fr.value} value={fr.value}>{fr.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Công thức (tuỳ chọn)</label>
          <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 bg-white" placeholder="VD: (Actual/Target) x 100..." value={form.formulaDescription} onChange={f('formulaDescription')} />
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-2">Ngưỡng đánh giá (% hoàn thành)</label>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-[11px] text-slate-500">Xanh ≥</span>
            <input type="number" min={0} max={100} className="w-16 border border-slate-200 rounded px-2 py-1 text-xs text-center outline-none focus:border-blue-500 bg-white" value={form.greenThreshold} onChange={fn('greenThreshold')} />
            <span className="text-[11px] text-slate-400">%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
            <span className="text-[11px] text-slate-500">Vàng ≥</span>
            <input type="number" min={0} max={100} className="w-16 border border-slate-200 rounded px-2 py-1 text-xs text-center outline-none focus:border-blue-500 bg-white" value={form.yellowThreshold} onChange={fn('yellowThreshold')} />
            <span className="text-[11px] text-slate-400">%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
            <span className="text-[11px] text-slate-500">Đỏ &lt; {form.yellowThreshold}%</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={onClose} className="flex-1 py-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Hủy</button>
        <button
          onClick={() => { onSave(form); onClose() }}
          disabled={!form.unit.trim() || !form.targetValue.toString().trim()}
          className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-lg"
        >Lưu cấu hình</button>
      </div>
    </div>
  )
}

// ── KPI Row ───────────────────────────────────────────────────
function KPIRow({ kpi, config, dept, onEdit }) {
  const freq = FREQUENCIES.find((f) => f.value === config?.frequency)
  const dir = DIRECTIONS.find((d) => d.value === config?.direction)
  const isComplete = config?.unit && config?.targetValue && config?.direction && config?.frequency

  return (
    <div className="flex items-start gap-3 py-3 px-4 hover:bg-slate-50/50 transition-colors group">
      <div className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: dept?.color ?? '#94a3b8' }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <p className="text-xs font-semibold text-slate-800">{kpi.name}</p>
          {dept && (
            <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold text-white shrink-0" style={{ background: dept.color }}>{dept.name.split(' ')[0]}</span>
          )}
          {isComplete ? (
            <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1"><Check size={9} /> Đã cấu hình</span>
          ) : (
            <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-1"><AlertCircle size={9} /> Chưa cấu hình</span>
          )}
        </div>
        {isComplete && (
          <div className="flex flex-wrap gap-3 text-[10px] text-slate-500">
            <span>📏 {config.unit}</span>
            {config.baselineValue && <span>⬛ Baseline: {config.baselineValue}</span>}
            <span>🎯 Target: {config.targetValue} {config.unit}</span>
            <span>{config.direction === 'HIGHER_IS_BETTER' ? '↑' : '↓'} {dir?.label}</span>
            <span>📅 {freq?.label}</span>
            {config.formulaDescription && <span>🔢 {config.formulaDescription}</span>}
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />≥{config.greenThreshold}%
              <span className="w-2 h-2 rounded-full bg-amber-400 ml-1" />≥{config.yellowThreshold}%
              <span className="w-2 h-2 rounded-full bg-red-500 ml-1" />&lt;{config.yellowThreshold}%
            </span>
          </div>
        )}
      </div>
      <button
        onClick={onEdit}
        className="shrink-0 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
      >
        <Edit3 size={12} />
      </button>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function KPISetupPage() {
  const { b3Selected } = useSWOTStore()
  const mapStore = useStrategyMapStore()
  const fishboneStore = useFishboneStore()
  const { configs, fetchMeasurements, saveMeasurement, complete: completeB7 } = useKPIMeasureStore()
  const { strategyId } = useBscContextStore()
  const navigate = useNavigate()
  const [editingKPI, setEditingKPI] = useState(null)
  const [expandedObjs, setExpandedObjs] = useState({})
  const [errors, setErrors] = useState([])

  const objectives = useMemo(
    () => mapStore.getEffectiveFinalObjectives(b3Selected),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mapStore, b3Selected]
  )
  const allKPIs = fishboneStore.getAllKPIs(objectives)
  const { departments } = fishboneStore

  useEffect(() => {
    if (strategyId) fetchMeasurements(strategyId)
  }, [strategyId])

  const toggleObj = (id) => setExpandedObjs((s) => ({ ...s, [id]: !s[id] }))

  const configured = allKPIs.filter((k) => {
    const cfg = configs[k.id]
    return cfg?.unit && cfg?.targetValue && cfg?.direction && cfg?.frequency
  })

  const handleComplete = async () => {
    const unconfigured = allKPIs.filter((k) => {
      const cfg = configs[k.id]
      return !cfg?.unit || !cfg?.targetValue || !cfg?.direction || !cfg?.frequency
    })
    if (unconfigured.length > 0) {
      setErrors([`${unconfigured.length} KPI chưa được cấu hình đo lường — cần nhập Đơn vị đo, Chỉ tiêu, Chiều đánh giá và Kỳ báo cáo`])
      return
    }
    setErrors([])
    try {
      await completeB7(strategyId, allKPIs.map((k) => k.id))
      navigate('/action-plan')
    } catch (e) {
      setErrors([e.message])
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">B7. Đo lường & Chỉ tiêu</h1>
          <p className="text-sm text-slate-500 mt-1">CEO nhập đơn vị đo, chỉ tiêu, kỳ báo cáo và ngưỡng đánh giá cho từng KPI nhỏ</p>
        </div>
        <button
          onClick={handleComplete}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shrink-0"
        >
          Hoàn thành B7 <ChevronRight size={16} />
        </button>
      </div>

      {/* Progress */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Tổng KPI nhỏ', value: allKPIs.length, color: 'text-slate-800' },
          { label: 'Đã cấu hình', value: configured.length, color: 'text-emerald-600' },
          { label: 'Chưa cấu hình', value: allKPIs.length - configured.length, color: 'text-amber-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {allKPIs.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <AlertCircle size={32} className="mx-auto mb-3 text-amber-400" />
          <p className="text-sm font-semibold text-amber-700 mb-1">Chưa có KPI nhỏ từ B5</p>
          <p className="text-xs text-amber-600 mb-4">Cần hoàn thành B5 — Mô hình Xương cá trước</p>
          <button onClick={() => navigate('/fishbone')} className="px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-xl">Đến B5 →</button>
        </div>
      ) : (
        <div className="space-y-4">
          {objectives.map((obj) => {
            const p = P_MAP[obj.perspective]
            const kpis = allKPIs.filter((k) => k.objectiveId === obj.id)
            if (kpis.length === 0) return null
            const configuredCount = kpis.filter((k) => {
              const cfg = configs[k.id]
              return cfg?.unit && cfg?.targetValue
            }).length
            const isExpanded = expandedObjs[obj.id] !== false

            return (
              <div key={obj.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleObj(obj.id)}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors"
                  style={{ borderLeft: `4px solid ${p?.color}` }}
                >
                  <ChevronDown size={14} className={clsx('text-slate-400 transition-transform shrink-0', !isExpanded && '-rotate-90')} />
                  <span className={clsx('text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0', p?.badge)}>{p?.label}</span>
                  <span className="text-sm font-semibold text-slate-800 flex-1 text-left">{obj.name}</span>
                  <span className={clsx('text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0',
                    configuredCount === kpis.length ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  )}>
                    {configuredCount}/{kpis.length} KPI
                  </span>
                </button>

                {isExpanded && (
                  <div className="divide-y divide-slate-50">
                    {kpis.map((kpi) => {
                      const dept = departments.find((d) => d.id === kpi.deptId)
                      const cfg = configs[kpi.id]
                      const isEditing = editingKPI === kpi.id
                      return (
                        <div key={kpi.id}>
                          <KPIRow
                            kpi={kpi}
                            config={cfg}
                            dept={dept}
                            onEdit={() => setEditingKPI(isEditing ? null : kpi.id)}
                          />
                          {isEditing && (
                            <div className="px-4 pb-3">
                              <KPIMeasureForm
                                config={cfg}
                                onSave={async (form) => {
                                  useKPIMeasureStore.getState().setConfig(kpi.id, form)
                                  setEditingKPI(null)
                                  try {
                                    await saveMeasurement(kpi.id)
                                  } catch {/* silent — will retry on complete */}
                                }}
                                onClose={() => setEditingKPI(null)}
                              />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-xs font-bold text-red-700 mb-2 flex items-center gap-2"><AlertCircle size={14} /> Chưa thể hoàn thành B7</p>
          {errors.map((e, i) => <p key={i} className="text-xs text-red-600">• {e}</p>)}
        </div>
      )}
    </div>
  )
}
