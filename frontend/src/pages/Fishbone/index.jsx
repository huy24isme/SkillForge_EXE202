import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Plus, X, Edit3, Trash2, AlertCircle, Eye, Users, Check } from 'lucide-react'
import clsx from 'clsx'
import { useSWOTStore } from '../../store/swotStore.js'
import { useStrategyMapStore } from '../../store/strategyMapStore.js'
import { useFishboneStore } from '../../store/fishboneStore.js'
import { useBscContextStore } from '../../store/bscContextStore.js'
import { toast } from '../../components/ui/toast.jsx'

const PERSPECTIVES = [
  { key: 'FINANCIAL',           label: 'Tài chính',             color: '#16a34a', badge: 'bg-emerald-100 text-emerald-700' },
  { key: 'CUSTOMER',            label: 'Khách hàng',            color: '#2563eb', badge: 'bg-blue-100 text-blue-700' },
  { key: 'INTERNAL_PROCESS',    label: 'Quy trình nội bộ',      color: '#9333ea', badge: 'bg-purple-100 text-purple-700' },
  { key: 'LEARNING_AND_GROWTH', label: 'Học hỏi & phát triển', color: '#d97706', badge: 'bg-amber-100 text-amber-700' },
]
const P_MAP = Object.fromEntries(PERSPECTIVES.map((p) => [p.key, p]))

// ── Inline KPI Form ───────────────────────────────────────────
function KPIForm({ deptId, objectiveId, onAdd, onClose }) {
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mt-2">
      <input
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 mb-2 bg-white"
        placeholder="Tên KPI nhỏ... *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />
      <textarea
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 resize-none bg-white mb-2"
        rows={2}
        placeholder="Mô tả KPI (tuỳ chọn)..."
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <div className="flex gap-2">
        <button onClick={onClose} className="flex-1 py-1.5 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Hủy</button>
        <button
          onClick={() => { if (name.trim()) { onAdd(deptId, objectiveId, name, desc); onClose() } }}
          disabled={!name.trim()}
          className="flex-1 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-lg"
        >Thêm KPI</button>
      </div>
    </div>
  )
}

// ── Trưởng phòng View ─────────────────────────────────────────
function DeptView({ dept, objectives, store }) {
  if (!dept) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
        <p className="text-sm font-semibold text-amber-700">Chưa có dữ liệu phòng ban</p>
      </div>
    )
  }

  const [addingKPIFor, setAddingKPIFor] = useState(null)
  const [editingKPI, setEditingKPI] = useState(null)
  const { participations, deptKPIs, toggleParticipation, addKPI, updateKPI, removeKPI } = store

  const deptPart = participations[dept.id] ?? {}
  const deptKPIMap = deptKPIs[dept.id] ?? {}

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3" style={{ borderLeft: `4px solid ${dept.color}` }}>
        <div className="w-3 h-3 rounded-full shrink-0" style={{ background: dept.color }} />
        <div>
          <p className="text-sm font-bold text-slate-800">{dept.name}</p>
          <p className="text-[11px] text-slate-500">Chọn mục tiêu tham gia → Tạo KPI nhỏ cho phòng ban</p>
        </div>
      </div>
      <div className="divide-y divide-slate-50">
        {objectives.map((obj) => {
          const participating = !!deptPart[obj.id]
          const kpis = deptKPIMap[obj.id] ?? []
          const p = P_MAP[obj.perspective]
          return (
            <div key={obj.id} className={clsx('p-4 transition-colors', !participating && 'bg-slate-50/30')}>
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleParticipation(dept.id, obj.id)}
                  className={clsx('w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors')}
                  style={participating
                    ? { borderColor: dept.color, background: dept.color, color: '#fff' }
                    : { borderColor: '#cbd5e1', background: '#fff' }
                  }
                  title={participating ? 'Bỏ tham gia' : 'Tham gia mục tiêu này'}
                >
                  {participating && <Check size={11} />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={clsx('text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0', p?.badge)}>{p?.label}</span>
                    <p className={clsx('text-xs font-semibold', participating ? 'text-slate-800' : 'text-slate-400')}>{obj.name}</p>
                  </div>
                  {obj.description && <p className="text-[10px] text-slate-400 mb-2 ml-0">{obj.description}</p>}

                  {participating && (
                    <div className="mt-2 space-y-1.5 ml-0">
                      {kpis.map((kpi) => (
                        <div key={kpi.id} className="group flex items-start gap-2 bg-white border border-slate-100 rounded-lg px-3 py-2">
                          <div className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ background: dept.color }} />
                          {editingKPI?.id === kpi.id ? (
                            <div className="flex-1">
                              <input
                                className="w-full border border-slate-200 rounded px-2 py-1 text-xs mb-1 outline-none focus:border-blue-500"
                                value={editingKPI.name}
                                onChange={(e) => setEditingKPI({ ...editingKPI, name: e.target.value })}
                              />
                              <div className="flex gap-1">
                                <button onClick={() => { updateKPI(dept.id, obj.id, kpi.id, { name: editingKPI.name }); setEditingKPI(null) }} className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded">Lưu</button>
                                <button onClick={() => setEditingKPI(null)} className="text-[10px] text-slate-400 px-2 py-0.5">Hủy</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-700 font-medium">{kpi.name}</p>
                                {kpi.description && <p className="text-[10px] text-slate-400 mt-0.5">{kpi.description}</p>}
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setEditingKPI({ ...kpi })} className="w-5 h-5 rounded flex items-center justify-center hover:bg-slate-100"><Edit3 size={10} className="text-slate-400" /></button>
                                <button onClick={() => removeKPI(dept.id, obj.id, kpi.id)} className="w-5 h-5 rounded flex items-center justify-center hover:bg-red-50"><Trash2 size={10} className="text-red-400" /></button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                      {addingKPIFor === obj.id ? (
                        <KPIForm deptId={dept.id} objectiveId={obj.id} onAdd={addKPI} onClose={() => setAddingKPIFor(null)} />
                      ) : (
                        <button onClick={() => setAddingKPIFor(obj.id)} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1">
                          <Plus size={12} /> Thêm KPI nhỏ
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── CEO View ──────────────────────────────────────────────────
function CEOView({ objectives, store }) {
  const { departments, participations, deptKPIs } = store
  const [filterPersp, setFilterPersp] = useState('all')
  const [filterDept, setFilterDept] = useState('all')

  const filtered = objectives.filter((o) => filterPersp === 'all' || o.perspective === filterPersp)

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 p-3 flex gap-3 flex-wrap items-center">
        <select value={filterPersp} onChange={(e) => setFilterPersp(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 outline-none bg-white">
          <option value="all">Tất cả góc độ</option>
          {PERSPECTIVES.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
        </select>
        <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 outline-none bg-white">
          <option value="all">Tất cả phòng ban</option>
          {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <span className="text-xs text-slate-400 ml-auto">{filtered.length} mục tiêu hiển thị</span>
      </div>

      <div className="space-y-3">
        {filtered.map((obj) => {
          const p = P_MAP[obj.perspective]
          const participatingDepts = departments.filter((d) => {
            if (filterDept !== 'all' && d.id !== filterDept) return false
            return !!(participations[d.id] ?? {})[obj.id]
          })
          const allKPIs = participatingDepts.flatMap((d) =>
            (deptKPIs[d.id]?.[obj.id] ?? []).map((k) => ({ ...k, dept: d }))
          )

          return (
            <div key={obj.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3" style={{ borderLeft: `4px solid ${p?.color}` }}>
                <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded shrink-0', p?.badge)}>{p?.label}</span>
                <p className="text-sm font-bold text-slate-800 flex-1">{obj.name}</p>
                {allKPIs.length === 0 ? (
                  <span className="flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <AlertCircle size={10} /> Chưa có KPI
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">{allKPIs.length} KPI nhỏ</span>
                )}
              </div>
              {allKPIs.length > 0 ? (
                <div className="p-3 flex flex-wrap gap-2">
                  {allKPIs.map((k) => (
                    <div
                      key={k.id}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-white"
                      style={{ background: k.dept.color }}
                      title={`Phòng: ${k.dept.name}`}
                    >
                      <span className="opacity-75">[{k.dept.name.split(' ')[0]}]</span>
                      {k.name}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-300 italic px-4 py-3">Chưa có phòng ban nào tham gia mục tiêu này</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function FishbonePage() {
  const swotStore = useSWOTStore()
  const { b3Selected } = swotStore
  const mapStore = useStrategyMapStore()
  const fishboneStore = useFishboneStore()
  const navigate = useNavigate()
  const { strategyId, companyId } = useBscContextStore()
  const [errors, setErrors] = useState([])
  const [completing, setCompleting] = useState(false)

  const { viewAs, setViewAs, currentDeptId, setCurrentDept, departments, loadDepartments } = fishboneStore
  const objectives = useMemo(
    () => mapStore.getEffectiveFinalObjectives(b3Selected),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mapStore, b3Selected]
  )
  const currentDept = departments.find((d) => d.id === currentDeptId) ?? departments[0]

  const allKPIs = fishboneStore.getAllKPIs(objectives)
  const coveredObjectives = objectives.filter((o) =>
    departments.some((d) => !!(fishboneStore.participations[d.id] ?? {})[o.id])
  )

  useEffect(() => {
    if (!strategyId || !companyId) return
    loadDepartments()
    swotStore.fetch(strategyId).then(() => {
      mapStore.fetchFromBackend(strategyId).then(() => {
        fishboneStore.fetchFromBackend(strategyId)
      })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategyId, companyId])

  const handleComplete = async () => {
    if (objectives.length === 0) {
      const msg = 'Chưa có mục tiêu chiến lược từ B4. Vui lòng hoàn thành B4 trước.'
      setErrors([msg])
      toast.error(msg)
      return
    }
    setCompleting(true)
    const errs = await fishboneStore.complete(objectives)
    setCompleting(false)
    if (errs.length > 0) {
      setErrors(errs)
      toast.error(errs[0])
      return
    }
    setErrors([])
    toast.success('Hoàn thành B5! BSC đã hoàn thiện.')
    navigate('/weight-allocation')
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">B5. Mô hình Xương cá</h1>
          <p className="text-sm text-slate-500 mt-1">
            Trưởng phòng chọn mục tiêu tham gia và tạo KPI nhỏ — CEO xem tổng quan
          </p>
        </div>
        <button
          onClick={handleComplete}
          disabled={completing}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shrink-0"
        >
          {completing ? 'Đang lưu...' : 'Hoàn thành B5'} <ChevronRight size={16} />
        </button>
      </div>

      {/* View switch + dept selector */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex items-center gap-4 flex-wrap">
        <span className="text-xs font-semibold text-slate-500 shrink-0">Xem với tư cách:</span>
        <button
          onClick={() => setViewAs('ceo')}
          className={clsx('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
            viewAs === 'ceo' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          )}
        >
          <Eye size={13} /> CEO (Tổng quan)
        </button>
        <button
          onClick={() => setViewAs('dept')}
          className={clsx('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
            viewAs === 'dept' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          )}
        >
          <Users size={13} /> Trưởng phòng
        </button>
        {viewAs === 'dept' && (
          <div className="flex items-center gap-2 ml-2">
            <span className="text-xs text-slate-400">Phòng ban:</span>
            <select
              value={currentDeptId}
              onChange={(e) => setCurrentDept(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 outline-none bg-white"
            >
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Đầu cá lớn (B4)', value: objectives.length, color: 'text-slate-800' },
          { label: 'Đã có phòng tham gia', value: coveredObjectives.length, color: 'text-emerald-600' },
          { label: 'Phòng ban', value: departments.length, color: 'text-blue-600' },
          { label: 'KPI nhỏ đã tạo', value: allKPIs.length, color: 'text-purple-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Content */}
      {objectives.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <AlertCircle size={32} className="mx-auto mb-3 text-amber-400" />
          <p className="text-sm font-semibold text-amber-700 mb-1">Chưa có mục tiêu chiến lược từ B4</p>
          <p className="text-xs text-amber-600 mb-4">Cần hoàn thành B4 — Bản đồ chiến lược trước khi tạo KPI</p>
          <button onClick={() => navigate('/strategy-map/perspectives')} className="px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-xl">Đến B4 →</button>
        </div>
      ) : viewAs === 'ceo' ? (
        <CEOView objectives={objectives} store={fishboneStore} />
      ) : (
        <DeptView dept={currentDept} objectives={objectives} store={fishboneStore} />
      )}

      {/* Dept color legend */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Màu đại diện phòng ban</p>
        <div className="flex flex-wrap gap-4">
          {departments.map((d) => {
            const count = fishboneStore.getDeptAllKPIs(d.id).length
            return (
              <div key={d.id} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: d.color }} />
                <span className="text-slate-600 font-medium">{d.name}</span>
                <span className="text-slate-400">({count} KPI)</span>
              </div>
            )
          })}
        </div>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-xs font-bold text-red-700 uppercase mb-2 flex items-center gap-2"><AlertCircle size={14} /> Cần bổ sung trước khi hoàn thành B5</p>
          {errors.map((e, i) => <p key={i} className="text-xs text-red-600">• {e}</p>)}
        </div>
      )}
    </div>
  )
}

