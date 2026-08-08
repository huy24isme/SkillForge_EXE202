import { useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { KPICompletionChart } from './KPICompletionChart.jsx'
import { TrendChart } from './TrendChart.jsx'
import { ExportPanel } from './ExportPanel.jsx'
import { useUIStore } from '../../store/uiStore.js'
import clsx from 'clsx'

const TABS = [
  { id: 'completion', label: 'Hoàn thành KPI' },
  { id: 'trend',      label: 'Xu hướng' },
  { id: 'export',     label: 'Xuất báo cáo' },
]

export default function ReportsPage() {
  const [tab, setTab] = useState('completion')
  const { activePeriod } = useUIStore()

  return (
    <div>
      <PageHeader title="Báo cáo & Phân tích" subtitle={`Kỳ: ${activePeriod}`} />
      <div className="flex gap-1 mb-5 bg-white rounded-xl p-1 border border-slate-200 w-fit">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={clsx('px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors', tab === t.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50')}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'completion' && <KPICompletionChart period={activePeriod} />}
      {tab === 'trend'      && <TrendChart />}
      {tab === 'export'     && <ExportPanel />}
    </div>
  )
}
