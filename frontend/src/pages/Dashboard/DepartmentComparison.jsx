import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts'
import { useDepartmentComparison } from '../../hooks/useKPICalculations.js'
import { mockDepartments, DEPT_MAP } from '../../data/mockDepartments.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { getRating } from '../../constants/kpiRating.js'

export function DepartmentComparison({ period }) {
  const data = useDepartmentComparison(period)
  const chartData = data
    .filter(d => d.completionPct != null)
    .map(d => ({ name: DEPT_MAP[d.deptId]?.code ?? d.deptId, fullName: DEPT_MAP[d.deptId]?.name, pct: d.completionPct }))
    .sort((a, b) => b.pct - a.pct)

  return (
    <Card>
      <CardHeader title="So sánh phòng ban" subtitle={`Kỳ: ${period}`} />
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 140]} tick={{ fontSize: 12 }} tickFormatter={v => `${v}%`} />
          <Tooltip
            formatter={(v) => [`${v.toFixed(1)}%`, 'Hoàn thành']}
            labelFormatter={(l, p) => p[0]?.payload?.fullName ?? l}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
          />
          <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: '100%', position: 'right', fontSize: 11, fill: '#94a3b8' }} />
          <ReferenceLine y={90} stroke="#dbeafe" strokeDasharray="3 3" />
          <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={getRating(entry.pct).color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-3 mt-2 flex-wrap">
        {[['#16a34a', 'Xuất sắc ≥110%'], ['#2563eb', 'Tốt 90-109%'], ['#d97706', 'TB 70-89%'], ['#dc2626', 'Yếu <70%']].map(([color, label]) => (
          <div key={label} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
            {label}
          </div>
        ))}
      </div>
    </Card>
  )
}
