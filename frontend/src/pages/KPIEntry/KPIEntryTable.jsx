import { useState, useMemo } from 'react'
import { useKPIStore } from '../../store/kpiStore.js'
import { calcCompletion, getRating } from '../../constants/kpiRating.js'
import { PERSPECTIVE_MAP, PERSPECTIVES } from '../../constants/bsc.js'
import { Card } from '../../components/ui/Card.jsx'
import { RatingBadge } from '../../components/ui/RatingBadge.jsx'
import { ProgressBar } from '../../components/ui/ProgressBar.jsx'
import { KPIEntryRow } from './KPIEntryRow.jsx'
import { ChevronDown, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

export function KPIEntryTable({ period }) {
  const { kpis, results } = useKPIStore()
  const [expandedPersp, setExpandedPersp] = useState(new Set(PERSPECTIVES.map(p => p.id)))

  // Only show company-level KPIs with targets for this period
  const companyKPIs = useMemo(() =>
    kpis.filter(k => k.level === 'company' && k.targetValues?.[period] != null),
    [kpis, period]
  )

  function togglePersp(id) {
    setExpandedPersp(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  return (
    <Card padding={false}>
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 rounded-t-xl">
        <div className="grid grid-cols-12 text-xs font-semibold text-slate-500 uppercase tracking-wide gap-2">
          <div className="col-span-4">Chỉ số KPI</div>
          <div className="col-span-1 text-center">Đơn vị</div>
          <div className="col-span-1 text-right">Mục tiêu</div>
          <div className="col-span-2 text-center">Thực tế</div>
          <div className="col-span-2 text-center">Hoàn thành</div>
          <div className="col-span-1 text-center">Đánh giá</div>
          <div className="col-span-1 text-center">Ghi chú</div>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {PERSPECTIVES.map(perspective => {
          const kpisInPersp = companyKPIs.filter(k => k.perspectiveId === perspective.id)
          if (kpisInPersp.length === 0) return null
          const isOpen = expandedPersp.has(perspective.id)
          return (
            <div key={perspective.id}>
              <div
                className="px-5 py-2 cursor-pointer flex items-center gap-2"
                style={{ backgroundColor: perspective.bgColor }}
                onClick={() => togglePersp(perspective.id)}
              >
                {isOpen ? <ChevronDown size={14} style={{ color: perspective.color }} /> : <ChevronRight size={14} style={{ color: perspective.color }} />}
                <span className="text-sm font-bold" style={{ color: perspective.color }}>{perspective.icon} {perspective.label}</span>
                <span className="text-xs text-slate-400 ml-1">({kpisInPersp.length} KPI)</span>
              </div>
              {isOpen && kpisInPersp.map(kpi => (
                <KPIEntryRow key={kpi.id} kpi={kpi} period={period} />
              ))}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
