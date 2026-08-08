import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useKPIStore } from '../../store/kpiStore.js'
import { calcCompletion, getRating } from '../../constants/kpiRating.js'
import { PERSPECTIVES, PERSPECTIVE_MAP } from '../../constants/bsc.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { RatingBadge } from '../../components/ui/RatingBadge.jsx'
import { ProgressBar } from '../../components/ui/ProgressBar.jsx'
import { formatNumber } from '../../utils/formatters.js'
import clsx from 'clsx'

function ScorecardRow({ kpi, period, results, depth = 0 }) {
  const [open, setOpen] = useState(depth === 0)
  const result = results.find(r => r.kpiId === kpi.id && r.period === period)
  const target = kpi.targetValues?.[period]
  const actual = result?.actualValue
  const pct = actual != null && target ? calcCompletion(actual, target) : null

  const hasChildren = kpi.children?.length > 0
  const indentClass = depth === 0 ? 'pl-3' : depth === 1 ? 'pl-7' : 'pl-11'

  return (
    <>
      <tr className={clsx('border-b border-slate-100 hover:bg-slate-50 transition-colors', pct != null && getRating(pct).id === 'below' && 'bg-red-50/30')}>
        <td className={clsx('py-2.5 pr-3 text-sm', indentClass)}>
          <div className="flex items-center gap-1.5">
            {hasChildren && (
              <button onClick={() => setOpen(o => !o)} className="text-slate-400 hover:text-slate-600 cursor-pointer flex-shrink-0">
                {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            )}
            <span className={clsx('font-medium', depth === 0 ? 'text-slate-800' : 'text-slate-600')}>{kpi.name}</span>
          </div>
        </td>
        <td className="py-2.5 px-3 text-sm text-slate-500 text-center">{kpi.unit}</td>
        <td className="py-2.5 px-3 text-sm text-slate-600 text-right">{target != null ? formatNumber(target) : '—'}</td>
        <td className="py-2.5 px-3 text-sm font-medium text-slate-800 text-right">{actual != null ? formatNumber(actual) : '—'}</td>
        <td className="py-2.5 px-3 text-right">
          {pct != null ? (
            <div className="flex items-center gap-2 justify-end">
              <ProgressBar value={pct} className="w-16" size="sm" />
              <span className="text-sm font-semibold text-slate-700 w-12 text-right">{pct.toFixed(1)}%</span>
            </div>
          ) : <span className="text-slate-300 text-sm">—</span>}
        </td>
        <td className="py-2.5 px-3 text-center"><RatingBadge pct={pct} /></td>
      </tr>
      {open && kpi._children?.map(child => (
        <ScorecardRow key={child.id} kpi={child} period={period} results={results} depth={depth + 1} />
      ))}
    </>
  )
}

export function BSCScorecard({ period }) {
  const { kpis, results } = useKPIStore()
  const [expanded, setExpanded] = useState(new Set(PERSPECTIVES.map(p => p.id)))
  const tree = buildTree(kpis)

  function buildTree(kpis) {
    const map = Object.fromEntries(kpis.map(k => [k.id, { ...k, _children: [] }]))
    kpis.forEach(k => { if (k.parentId && map[k.parentId]) map[k.parentId]._children.push(map[k.id]) })
    return Object.values(map).filter(k => !k.parentId)
  }

  return (
    <Card padding={false}>
      <CardHeader title="Bảng điểm BSC tổng hợp" subtitle={`Kỳ: ${period}`} className="px-5 pt-5" />
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide pl-4">Chỉ số KPI</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide text-center">Đơn vị</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide text-right">Mục tiêu</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide text-right">Thực tế</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide text-right">Hoàn thành</th>
              <th className="px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide text-center">Đánh giá</th>
            </tr>
          </thead>
          <tbody>
            {PERSPECTIVES.map(perspective => {
              const perspKPIs = tree.filter(k => k.perspectiveId === perspective.id)
              const isOpen = expanded.has(perspective.id)
              return (
                <>
                  <tr
                    key={perspective.id}
                    className="cursor-pointer"
                    style={{ backgroundColor: perspective.bgColor }}
                    onClick={() => setExpanded(s => { const n = new Set(s); n.has(perspective.id) ? n.delete(perspective.id) : n.add(perspective.id); return n })}
                  >
                    <td colSpan={6} className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        {isOpen ? <ChevronDown size={14} style={{ color: perspective.color }} /> : <ChevronRight size={14} style={{ color: perspective.color }} />}
                        <span className="text-sm font-bold" style={{ color: perspective.color }}>{perspective.icon} {perspective.label}</span>
                      </div>
                    </td>
                  </tr>
                  {isOpen && perspKPIs.map(kpi => (
                    <ScorecardRow key={kpi.id} kpi={kpi} period={period} results={results} />
                  ))}
                </>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
