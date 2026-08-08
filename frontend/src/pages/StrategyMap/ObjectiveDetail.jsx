import { X } from 'lucide-react'
import { useStrategyStore } from '../../store/strategyStore.js'
import { useKPIStore } from '../../store/kpiStore.js'
import { useUIStore } from '../../store/uiStore.js'
import { PERSPECTIVE_MAP } from '../../constants/bsc.js'
import { calcCompletion, getRating } from '../../constants/kpiRating.js'
import { RatingBadge } from '../../components/ui/RatingBadge.jsx'
import { ProgressBar } from '../../components/ui/ProgressBar.jsx'
import { formatNumber } from '../../utils/formatters.js'

export function ObjectiveDetail({ objectiveId, onClose }) {
  const { strategySets, activeStrategyId } = useStrategyStore()
  const { kpis, results } = useKPIStore()
  const { activePeriod } = useUIStore()

  const activeStrategy = strategySets.find(s => s.id === activeStrategyId) ?? strategySets[0]
  const obj = activeStrategy?.objectives.find(o => o.id === objectiveId)
  if (!obj) return null

  const perspective = PERSPECTIVE_MAP[obj.perspective]
  const linkedKPIs = (obj.kpiIds ?? []).map(id => {
    const kpi = kpis.find(k => k.id === id)
    if (!kpi) return null
    const result = results.find(r => r.kpiId === id && r.period === activePeriod)
    const target = kpi.targetValues?.[activePeriod]
    const pct = result && target ? calcCompletion(result.actualValue, target) : null
    return { kpi, actual: result?.actualValue, target, pct, rating: pct != null ? getRating(pct) : null }
  }).filter(Boolean)

  return (
    <div className="absolute top-4 right-4 z-20 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: perspective.bgColor, borderBottom: `2px solid ${perspective.color}` }}>
        <div>
          <div className="text-xs font-semibold" style={{ color: perspective.color }}>{perspective.icon} {perspective.label}</div>
          <h3 className="font-bold text-slate-800 text-sm mt-0.5">{obj.title}</h3>
        </div>
        <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white/60 rounded-lg cursor-pointer transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="p-4">
        {obj.description && <p className="text-sm text-slate-600 mb-4">{obj.description}</p>}

        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">KPI Liên kết ({linkedKPIs.length})</div>
        <div className="space-y-3">
          {linkedKPIs.map(({ kpi, actual, target, pct, rating }) => (
            <div key={kpi.id} className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-sm font-medium text-slate-700 leading-tight">{kpi.name}</span>
                <RatingBadge pct={pct} />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>MT: {target != null ? formatNumber(target) : '—'} {kpi.unit}</span>
                <span>TT: {actual != null ? formatNumber(actual) : '—'} {kpi.unit}</span>
              </div>
              {pct != null && <ProgressBar value={pct} size="sm" />}
            </div>
          ))}
          {linkedKPIs.length === 0 && <p className="text-xs text-slate-400">Chưa liên kết KPI nào</p>}
        </div>
      </div>
    </div>
  )
}
