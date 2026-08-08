import { usePerspectiveSummary } from '../../hooks/useKPICalculations.js'
import { Card } from '../../components/ui/Card.jsx'
import { RatingBadge } from '../../components/ui/RatingBadge.jsx'
import { ProgressBar } from '../../components/ui/ProgressBar.jsx'
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts'

export function PerspectiveCard({ perspectiveId, period }) {
  const { items, avgCompletion, evaluated, total, perspective } = usePerspectiveSummary(perspectiveId, period)

  return (
    <Card className="flex flex-col gap-3" style={{ borderTop: `3px solid ${perspective.color}` }}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{perspective.icon}</span>
        <div>
          <div className="font-semibold text-slate-800 text-sm leading-tight">{perspective.label}</div>
          <div className="text-xs text-slate-400">{evaluated}/{total} KPI có dữ liệu</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <RadialBarChart width={80} height={80} innerRadius={28} outerRadius={38} data={[{ value: Math.min(avgCompletion ?? 0, 150) }]} startAngle={90} endAngle={-270}>
            <PolarAngleAxis type="number" domain={[0, 150]} tick={false} />
            <RadialBar dataKey="value" fill={perspective.color} background={{ fill: '#f1f5f9' }} cornerRadius={4} />
          </RadialBarChart>
        </div>
        <div>
          <div className="text-2xl font-bold" style={{ color: perspective.color }}>
            {avgCompletion != null ? `${avgCompletion.toFixed(0)}%` : '—'}
          </div>
          <RatingBadge pct={avgCompletion} />
        </div>
      </div>

      <div className="space-y-2">
        {items.slice(0, 3).map(({ kpi, completionPct }) => completionPct != null && (
          <div key={kpi.id}>
            <div className="flex justify-between text-xs text-slate-500 mb-0.5">
              <span className="truncate mr-2">{kpi.name}</span>
              <span className="flex-shrink-0">{completionPct.toFixed(0)}%</span>
            </div>
            <ProgressBar value={completionPct} size="sm" />
          </div>
        ))}
      </div>
    </Card>
  )
}
