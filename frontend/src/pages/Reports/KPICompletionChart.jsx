import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell, LabelList } from 'recharts'
import { useKPIStore } from '../../store/kpiStore.js'
import { calcCompletion, getRating } from '../../constants/kpiRating.js'
import { PERSPECTIVE_MAP } from '../../constants/bsc.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'

export function KPICompletionChart({ period }) {
  const { kpis, results } = useKPIStore()

  const data = useMemo(() => kpis
    .filter(k => k.level === 'company' && k.targetValues?.[period] != null)
    .map(kpi => {
      const result = results.find(r => r.kpiId === kpi.id && r.period === period)
      const target = kpi.targetValues[period]
      const pct = result ? calcCompletion(result.actualValue, target) : null
      const rating = pct != null ? getRating(pct) : null
      const perspective = PERSPECTIVE_MAP[kpi.perspectiveId]
      return { name: kpi.name.length > 25 ? kpi.name.slice(0, 23) + '…' : kpi.name, fullName: kpi.name, pct, rating, perspective }
    })
    .filter(d => d.pct != null)
    .sort((a, b) => (b.pct ?? 0) - (a.pct ?? 0)),
    [kpis, results, period]
  )

  return (
    <Card>
      <CardHeader title="Hoàn thành KPI theo chỉ số" subtitle={`Kỳ: ${period} — ${data.length} KPI có dữ liệu`} />
      <ResponsiveContainer width="100%" height={Math.max(300, data.length * 36)}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 60, left: 200, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis type="number" domain={[0, 140]} tickFormatter={v => `${v}%`} tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="name" width={190} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(v, _, p) => [`${v.toFixed(1)}%`, 'Hoàn thành']}
            labelFormatter={(l, p) => p[0]?.payload?.fullName ?? l}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <ReferenceLine x={100} stroke="#94a3b8" strokeDasharray="4 4" />
          <ReferenceLine x={90}  stroke="#dbeafe" strokeDasharray="3 3" />
          <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
            <LabelList dataKey="pct" position="right" formatter={v => `${v.toFixed(0)}%`} style={{ fontSize: 11, fill: '#64748b' }} />
            {data.map(d => <Cell key={d.name} fill={d.rating?.color ?? '#94a3b8'} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
