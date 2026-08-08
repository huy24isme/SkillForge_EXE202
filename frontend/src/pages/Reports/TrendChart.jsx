import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { useKPIStore } from '../../store/kpiStore.js'
import { calcCompletion } from '../../constants/kpiRating.js'
import { MONTHS } from '../../constants/periods.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'

const COLORS = ['#2563eb', '#16a34a', '#d97706', '#9333ea', '#dc2626', '#0891b2']

export function TrendChart() {
  const { kpis, results } = useKPIStore()
  const companyKPIs = kpis.filter(k => k.level === 'company' && k.periodType === 'monthly')
  const [selected, setSelected] = useState(companyKPIs.slice(0, 3).map(k => k.id))

  const chartData = useMemo(() => MONTHS.map(period => {
    const row = { period: period.short }
    selected.forEach(kpiId => {
      const kpi = kpis.find(k => k.id === kpiId)
      if (!kpi) return
      const result = results.find(r => r.kpiId === kpiId && r.period === period.id)
      const target = kpi.targetValues?.[period.id]
      row[kpiId] = result && target ? calcCompletion(result.actualValue, target) : null
    })
    return row
  }), [kpis, results, selected])

  function toggleKPI(id) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  return (
    <Card>
      <CardHeader title="Xu hướng hoàn thành KPI theo tháng" />
      <div className="flex flex-wrap gap-2 mb-4">
        {companyKPIs.map((kpi, i) => (
          <button
            key={kpi.id}
            onClick={() => toggleKPI(kpi.id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${selected.includes(kpi.id) ? 'text-white border-transparent' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
            style={selected.includes(kpi.id) ? { backgroundColor: COLORS[i % COLORS.length] } : {}}
          >
            {kpi.name.length > 30 ? kpi.name.slice(0, 28) + '…' : kpi.name}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="period" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 12 }} domain={[0, 140]} />
          <Tooltip formatter={(v) => v != null ? [`${v.toFixed(1)}%`, ''] : ['—', '']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: '100%', position: 'right', fontSize: 11 }} />
          {selected.map((kpiId, i) => {
            const kpi = kpis.find(k => k.id === kpiId)
            return (
              <Line
                key={kpiId}
                type="monotone"
                dataKey={kpiId}
                name={kpi?.name ?? kpiId}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls={false}
              />
            )
          })}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
