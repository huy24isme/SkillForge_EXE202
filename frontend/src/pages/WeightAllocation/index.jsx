import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, RotateCcw, Save, AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import clsx from 'clsx'
import { useWeightStore } from '../../store/weightStore.js'
import { useStrategyMapStore } from '../../store/strategyMapStore.js'
import { useFishboneStore } from '../../store/fishboneStore.js'
import { useSWOTStore } from '../../store/swotStore.js'
import { useBSCWorkflowStore } from '../../store/bscWorkflowStore.js'
import { useBscContextStore } from '../../store/bscContextStore.js'

const PERSPECTIVES = [
  { id: 'FINANCIAL',          label: 'Tài chính',            color: '#16a34a', light: '#dcfce7', icon: '💰' },
  { id: 'CUSTOMER',           label: 'Khách hàng',           color: '#2563eb', light: '#dbeafe', icon: '👥' },
  { id: 'INTERNAL_PROCESS',   label: 'Quy trình nội bộ',     color: '#9333ea', light: '#f3e8ff', icon: '⚙️' },
  { id: 'LEARNING_AND_GROWTH',label: 'Học hỏi & Phát triển', color: '#d97706', light: '#fef3c7', icon: '🌱' },
]

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-slate-800 text-white rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold">{d.name}</p>
      <p className="text-blue-300">{d.value}%</p>
    </div>
  )
}

function WeightInput({ value, onChange, max, color }) {
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <input
        type="number"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Math.max(0, Math.min(max, Number(e.target.value) || 0)))}
        className="w-14 text-center text-sm font-bold border border-slate-200 rounded-lg px-1 py-1 outline-none focus:border-blue-500"
      />
      <span className="text-xs text-slate-400">%</span>
    </div>
  )
}

function SumBadge({ current, target, compact }) {
  const ok = current === target
  return (
    <div className={clsx(
      'flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-lg whitespace-nowrap',
      ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
    )}>
      {ok ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
      {compact ? `${current}/${target}%` : `Tổng: ${current}% / ${target}%`}
    </div>
  )
}

export default function WeightAllocationPage() {
  const navigate = useNavigate()
  const [activeLayer, setActiveLayer] = useState(1)
  const [activePerspTab, setActivePerspTab] = useState('FINANCIAL')
  const [activeObjTab, setActiveObjTab] = useState(null)
  const [saved, setSaved] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [completing, setCompleting] = useState(false)

  const {
    perspectiveWeights, objectiveWeights, kpiWeights,
    setPerspectiveWeight, setObjectiveWeight, setKpiWeight,
    initObjectiveWeights, initKpiWeights, resetToDefault,
    fetchWeightTree, saveAll, complete, saving,
  } = useWeightStore()
  const { strategyId } = useBscContextStore()

  const { b3Selected } = useSWOTStore()
  const strategyMapStore = useStrategyMapStore()
  const fishboneStore = useFishboneStore()

  const objectives = useMemo(
    () => strategyMapStore.getEffectiveFinalObjectives(b3Selected),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [strategyMapStore, b3Selected]
  )
  const allKpis = useMemo(
    () => fishboneStore.getAllKPIs(objectives),
    [fishboneStore, objectives]
  )

  // Load weight tree from backend on mount
  useEffect(() => {
    if (strategyId) fetchWeightTree(strategyId)
  }, [strategyId])

  // Auto-initialize weights when objectives/kpis are loaded (only if not fetched yet)
  useEffect(() => {
    if (objectives.length > 0 && Object.keys(objectiveWeights).length === 0) {
      initObjectiveWeights(objectives)
    }
  }, [objectives.length])

  useEffect(() => {
    if (allKpis.length > 0 && Object.keys(kpiWeights).length === 0) {
      initKpiWeights(allKpis)
    }
  }, [allKpis.length])

  // Set default active objective tab to first objective in active persp
  useEffect(() => {
    const objsInPersp = objectives.filter((o) => o.perspective === activePerspTab)
    if (objsInPersp.length > 0 && !objsInPersp.find((o) => o.id === activeObjTab)) {
      setActiveObjTab(objsInPersp[0].id)
    }
  }, [activePerspTab, objectives.length])

  const perspTotal = Object.values(perspectiveWeights).reduce((a, b) => a + b, 0)

  const objTotalForPersp = (perspId) =>
    objectives.filter((o) => o.perspective === perspId).reduce((s, o) => s + (objectiveWeights[o.id] ?? 0), 0)

  const kpiTotalForObj = (objId) =>
    allKpis.filter((k) => k.objectiveId === objId).reduce((s, k) => s + (kpiWeights[k.id] ?? 0), 0)

  const isLayer1Valid = perspTotal === 100
  const isLayer2Valid = PERSPECTIVES.every((p) => {
    const objsInPersp = objectives.filter((o) => o.perspective === p.id)
    return objsInPersp.length === 0 || objTotalForPersp(p.id) === perspectiveWeights[p.id]
  })
  const isLayer3Valid = objectives.every((o) => {
    const kpisInObj = allKpis.filter((k) => k.objectiveId === o.id)
    return kpisInObj.length === 0 || kpiTotalForObj(o.id) === (objectiveWeights[o.id] ?? 0)
  })
  const allValid = isLayer1Valid && isLayer2Valid && isLayer3Valid

  // Save weights to backend (not complete)
  const handleSave = async () => {
    if (!strategyId) return
    setApiError(null)
    try {
      await saveAll(strategyId, { objectives, allKpis })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e) {
      setApiError(e.message)
    }
  }

  // Validate + complete B6
  const handleComplete = async () => {
    if (!allValid) {
      setApiError('Tổng tỉ trọng chưa hợp lệ — kiểm tra lại cả 3 tầng')
      return
    }
    if (!strategyId) return
    setApiError(null)
    setCompleting(true)
    try {
      await complete(strategyId, { objectives, allKpis })
      navigate('/kpi-setup')
    } catch (e) {
      setApiError(e.message)
    } finally {
      setCompleting(false)
    }
  }

  const donutData = PERSPECTIVES.map((p) => ({
    name: p.label,
    value: perspectiveWeights[p.id] ?? 0,
    color: p.color,
  }))

  const layers = [
    { id: 1, label: 'Tầng 1: Góc độ BSC', valid: isLayer1Valid },
    { id: 2, label: 'Tầng 2: Mục tiêu chiến lược', valid: isLayer2Valid },
    { id: 3, label: 'Tầng 3: KPI', valid: isLayer3Valid },
  ]

  const activePerspObj = PERSPECTIVES.find((p) => p.id === activePerspTab)

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">B6. Phân bổ Tỉ trọng</h1>
          <p className="text-sm text-slate-500 mt-1">
            CEO phân bổ tỉ trọng <strong>tuyệt đối</strong> qua 3 tầng: Góc độ BSC → Mục tiêu → KPI. Tổng mỗi tầng phải bằng tầng trên.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={resetToDefault}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-medium rounded-xl transition-colors"
          >
            <RotateCcw size={14} /> Đặt lại
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={clsx(
              'flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors disabled:opacity-60',
              saved ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
            )}
          >
            {saving ? 'Đang lưu...' : saved ? '✓ Đã lưu!' : <><Save size={15} /> Lưu cấu hình</>}
          </button>
          <button
            onClick={handleComplete}
            disabled={completing || saving}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            {completing ? 'Đang xử lý...' : <>Hoàn thành B6 <ChevronRight size={15} /></>}
          </button>
        </div>
      </div>

      {/* Validation status bar */}
      <div className="flex gap-3 flex-wrap">
        {layers.map((l) => (
          <div
            key={l.id}
            className={clsx(
              'flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border',
              l.valid
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-amber-50 border-amber-200 text-amber-700'
            )}
          >
            {l.valid ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
            {l.label}
          </div>
        ))}
      </div>

      {/* API Error banner */}
      {apiError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-4 py-2.5 rounded-xl">
          <AlertCircle size={14} />
          {apiError}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Main panel */}
        <div className="xl:col-span-2 space-y-4">
          {/* Layer selector tabs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-100">
              {layers.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setActiveLayer(l.id)}
                  className={clsx(
                    'flex-1 flex items-center justify-center gap-1.5 py-3 px-2 text-xs font-semibold transition-colors border-b-2',
                    activeLayer === l.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-slate-500 hover:bg-slate-50'
                  )}
                >
                  {l.valid
                    ? <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                    : <AlertCircle size={12} className="text-amber-400 shrink-0" />}
                  <span className="hidden sm:inline">{l.label}</span>
                  <span className="sm:hidden">Tầng {l.id}</span>
                </button>
              ))}
            </div>

            {/* ── Layer 1: Perspective Weights ─────────────────────── */}
            {activeLayer === 1 && (
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-800 text-sm">Tỉ trọng 4 Góc độ BSC</h2>
                  <SumBadge current={perspTotal} target={100} />
                </div>
                <p className="text-xs text-slate-400 mb-4 flex items-center gap-1">
                  <Info size={12} /> Tổng 4 góc độ phải = 100%. Đây là tỉ trọng tuyệt đối.
                </p>
                <div className="space-y-5">
                  {PERSPECTIVES.map((p) => {
                    const val = perspectiveWeights[p.id] ?? 0
                    return (
                      <div key={p.id}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{p.icon}</span>
                            <span className="text-sm font-semibold text-slate-700">{p.label}</span>
                          </div>
                          <WeightInput
                            value={val}
                            max={100}
                            color={p.color}
                            onChange={(v) => setPerspectiveWeight(p.id, v)}
                          />
                        </div>
                        <input
                          type="range"
                          min={0} max={100} step={1}
                          value={val}
                          onChange={(e) => setPerspectiveWeight(p.id, +e.target.value)}
                          className="w-full h-2.5 rounded-full outline-none cursor-pointer appearance-none"
                          style={{ accentColor: p.color }}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── Layer 2: Objective Weights ────────────────────────── */}
            {activeLayer === 2 && (
              <div>
                {/* Perspective sub-tabs */}
                <div className="flex border-b border-slate-100 bg-slate-50">
                  {PERSPECTIVES.map((p) => {
                    const objs = objectives.filter((o) => o.perspective === p.id)
                    const total = objTotalForPersp(p.id)
                    const target = perspectiveWeights[p.id] ?? 0
                    const ok = objs.length === 0 || total === target
                    return (
                      <button
                        key={p.id}
                        onClick={() => setActivePerspTab(p.id)}
                        className={clsx(
                          'flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1 text-xs font-medium transition-colors border-b-2',
                          activePerspTab === p.id
                            ? 'bg-white border-b-2'
                            : 'border-transparent text-slate-500 hover:bg-white/60'
                        )}
                        style={activePerspTab === p.id ? { borderBottomColor: p.color, color: p.color } : {}}
                      >
                        <span>{p.icon}</span>
                        <span className="hidden sm:block text-[10px] leading-tight text-center">{p.label.split(' ')[0]}</span>
                        <span className={clsx('text-[10px] font-bold', ok ? 'text-emerald-600' : 'text-red-500')}>
                          {total}/{target}%
                        </span>
                      </button>
                    )
                  })}
                </div>
                <div className="p-5">
                  {(() => {
                    const p = activePerspObj
                    const objs = objectives.filter((o) => o.perspective === activePerspTab)
                    const total = objTotalForPersp(activePerspTab)
                    const target = perspectiveWeights[activePerspTab] ?? 0
                    if (objs.length === 0) {
                      return (
                        <p className="text-sm text-slate-400 text-center py-6">
                          Chưa có mục tiêu chiến lược nào thuộc góc độ {p?.label}. Hãy hoàn thành B4 trước.
                        </p>
                      )
                    }
                    return (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-slate-700">Mục tiêu — {p?.label}</h3>
                          <SumBadge current={total} target={target} />
                        </div>
                        <p className="text-xs text-slate-400 mb-4 flex items-center gap-1">
                          <Info size={12} />
                          Tổng tỉ trọng mục tiêu phải = tỉ trọng góc độ ({target}%)
                        </p>
                        <div className="space-y-4">
                          {objs.map((obj) => {
                            const val = objectiveWeights[obj.id] ?? 0
                            return (
                              <div key={obj.id}>
                                <div className="flex items-center justify-between mb-1.5 gap-2">
                                  <span className="text-sm text-slate-700 flex-1 min-w-0 truncate">{obj.name}</span>
                                  <WeightInput
                                    value={val}
                                    max={target}
                                    color={p?.color}
                                    onChange={(v) => setObjectiveWeight(obj.id, v)}
                                  />
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{ width: target > 0 ? `${(val / target) * 100}%` : '0%', background: p?.color }}
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>
            )}

            {/* ── Layer 3: KPI Weights ──────────────────────────────── */}
            {activeLayer === 3 && (
              <div>
                {/* Perspective sub-tabs */}
                <div className="flex border-b border-slate-100 bg-slate-50">
                  {PERSPECTIVES.map((p) => {
                    const objs = objectives.filter((o) => o.perspective === p.id)
                    const ok = objs.every((o) => {
                      const kpis = allKpis.filter((k) => k.objectiveId === o.id)
                      return kpis.length === 0 || kpiTotalForObj(o.id) === (objectiveWeights[o.id] ?? 0)
                    })
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setActivePerspTab(p.id)
                          const firstObj = objs[0]
                          if (firstObj) setActiveObjTab(firstObj.id)
                        }}
                        className={clsx(
                          'flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1 text-xs font-medium transition-colors border-b-2',
                          activePerspTab === p.id ? 'bg-white border-b-2' : 'border-transparent text-slate-500 hover:bg-white/60'
                        )}
                        style={activePerspTab === p.id ? { borderBottomColor: p.color, color: p.color } : {}}
                      >
                        <span>{p.icon}</span>
                        <span className="hidden sm:block text-[10px]">{p.label.split(' ')[0]}</span>
                        <span className={clsx('text-[10px] font-bold', ok ? 'text-emerald-600' : 'text-red-500')}>
                          {ok ? '✓' : '!'}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Objective sub-tabs within selected perspective */}
                {(() => {
                  const objsInPersp = objectives.filter((o) => o.perspective === activePerspTab)
                  if (objsInPersp.length === 0) {
                    return (
                      <p className="text-sm text-slate-400 text-center py-6 px-5">
                        Chưa có mục tiêu cho góc độ này.
                      </p>
                    )
                  }
                  return (
                    <>
                      <div className="flex gap-1 flex-wrap p-3 border-b border-slate-100 bg-slate-50/50">
                        {objsInPersp.map((obj) => {
                          const kpis = allKpis.filter((k) => k.objectiveId === obj.id)
                          const total = kpiTotalForObj(obj.id)
                          const target = objectiveWeights[obj.id] ?? 0
                          const ok = kpis.length === 0 || total === target
                          return (
                            <button
                              key={obj.id}
                              onClick={() => setActiveObjTab(obj.id)}
                              className={clsx(
                                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                                activeObjTab === obj.id
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              )}
                            >
                              <span className="truncate max-w-30 inline-block align-bottom">{obj.name}</span>
                              <span className={clsx('ml-1.5 font-bold', ok ? 'text-emerald-400' : 'text-red-400')}>
                                {total}/{target}%
                              </span>
                            </button>
                          )
                        })}
                      </div>

                      <div className="p-5">
                        {(() => {
                          const obj = objectives.find((o) => o.id === activeObjTab)
                          if (!obj) return <p className="text-sm text-slate-400 text-center py-4">Chọn mục tiêu ở trên.</p>
                          const kpis = allKpis.filter((k) => k.objectiveId === obj.id)
                          const total = kpiTotalForObj(obj.id)
                          const target = objectiveWeights[obj.id] ?? 0
                          const p = PERSPECTIVES.find((p) => p.id === obj.perspective)
                          if (kpis.length === 0) {
                            return (
                              <p className="text-sm text-slate-400 text-center py-4">
                                Chưa có KPI nào cho mục tiêu "{obj.name}". Hãy hoàn thành B5 trước.
                              </p>
                            )
                          }
                          return (
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h3 className="text-sm font-semibold text-slate-700">KPI — {obj.name}</h3>
                                  <p className="text-xs text-slate-400 mt-0.5">Tỉ trọng mục tiêu này: {target}%</p>
                                </div>
                                <SumBadge current={total} target={target} />
                              </div>
                              <div className="space-y-4">
                                {kpis.map((kpi) => {
                                  const val = kpiWeights[kpi.id] ?? 0
                                  return (
                                    <div key={kpi.id}>
                                      <div className="flex items-center justify-between mb-1.5 gap-2">
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm text-slate-700 truncate">{kpi.name}</p>
                                          <p className="text-[10px] text-slate-400">{kpi.deptName}</p>
                                        </div>
                                        <WeightInput
                                          value={val}
                                          max={target}
                                          color={p?.color}
                                          onChange={(v) => setKpiWeight(kpi.id, v)}
                                        />
                                      </div>
                                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                          className="h-full rounded-full transition-all duration-300"
                                          style={{
                                            width: target > 0 ? `${(val / target) * 100}%` : '0%',
                                            background: kpi.deptColor ?? p?.color,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    </>
                  )
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Right panel: Chart + summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-semibold text-slate-800 text-sm mb-4">Phân bổ Góc độ BSC</h2>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%" cy="50%"
                    innerRadius={50} outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {donutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-semibold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <Info size={14} className="text-blue-500" />
              Tóm tắt tỉ trọng
            </h2>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {PERSPECTIVES.map((p) => {
                const objs = objectives.filter((o) => o.perspective === p.id)
                return (
                  <div key={p.id}>
                    <div className="flex items-center gap-2 py-1">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
                      <span className="text-xs font-semibold text-slate-700 flex-1">{p.label}</span>
                      <span className="text-xs font-bold text-slate-800">{perspectiveWeights[p.id] ?? 0}%</span>
                    </div>
                    {objs.map((obj) => {
                      const kpis = allKpis.filter((k) => k.objectiveId === obj.id)
                      return (
                        <div key={obj.id}>
                          <div className="flex items-center gap-2 pl-4 py-0.5">
                            <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-slate-300" />
                            <span className="text-[11px] text-slate-500 flex-1 truncate">{obj.name}</span>
                            <span className="text-[11px] font-semibold text-slate-700">{objectiveWeights[obj.id] ?? 0}%</span>
                          </div>
                          {kpis.map((kpi) => (
                            <div key={kpi.id} className="flex items-center gap-2 pl-8 py-0.5">
                              <div className="w-1 h-1 rounded-full shrink-0" style={{ background: kpi.deptColor }} />
                              <span className="text-[10px] text-slate-400 flex-1 truncate">{kpi.name}</span>
                              <span className="text-[10px] font-semibold text-slate-600">{kpiWeights[kpi.id] ?? 0}%</span>
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs font-bold">
              <span className="text-slate-500">Tổng KPI</span>
              <span className={clsx(allKpis.reduce((s, k) => s + (kpiWeights[k.id] ?? 0), 0) === 100 ? 'text-emerald-600' : 'text-red-500')}>
                {allKpis.reduce((s, k) => s + (kpiWeights[k.id] ?? 0), 0)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
