import { Handle, Position } from 'reactflow'
import { useKPIStore } from '../../store/kpiStore.js'
import { useUIStore } from '../../store/uiStore.js'
import { calcCompletion, getRating } from '../../constants/kpiRating.js'

export function ObjectiveNode({ data, selected }) {
  const { kpis, results } = useKPIStore()
  const { activePeriod } = useUIStore()
  const { perspective, kpiIds = [] } = data

  // Compute avg completion for linked KPIs
  let avgPct = null
  const linked = kpiIds.map(id => {
    const kpi = kpis.find(k => k.id === id)
    if (!kpi) return null
    const result = results.find(r => r.kpiId === id && r.period === activePeriod)
    const target = kpi.targetValues?.[activePeriod]
    if (!result || !target) return null
    return calcCompletion(result.actualValue, target)
  }).filter(Boolean)
  if (linked.length > 0) avgPct = linked.reduce((a, b) => a + b, 0) / linked.length

  const rating = avgPct != null ? getRating(avgPct) : null

  return (
    <div
      className="rounded-xl border-2 shadow-sm bg-white min-w-[180px] max-w-[200px] cursor-pointer transition-all"
      style={{
        borderColor: selected ? perspective.color : `${perspective.color}40`,
        boxShadow: selected ? `0 0 0 3px ${perspective.color}30` : undefined,
      }}
    >
      <div className="px-3 py-1.5 rounded-t-lg text-xs font-semibold text-white" style={{ backgroundColor: perspective.color }}>
        {perspective.icon} {perspective.label}
      </div>
      <div className="px-3 py-2">
        <p className="font-semibold text-slate-800 text-sm leading-tight mb-2">{data.title}</p>
        {avgPct != null ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${Math.min(avgPct, 100)}%`, backgroundColor: rating?.color }} />
            </div>
            <span className="text-xs font-semibold" style={{ color: rating?.color }}>{avgPct.toFixed(0)}%</span>
          </div>
        ) : (
          <span className="text-xs text-slate-300">Chưa có dữ liệu</span>
        )}
        {kpiIds.length > 0 && (
          <div className="text-xs text-slate-400 mt-1">{kpiIds.length} KPI liên kết</div>
        )}
      </div>
      <Handle type="target" position={Position.Bottom} style={{ background: perspective.color, width: 8, height: 8 }} />
      <Handle type="source" position={Position.Top} style={{ background: perspective.color, width: 8, height: 8 }} />
    </div>
  )
}
