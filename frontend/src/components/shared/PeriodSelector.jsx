import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { MONTHS, QUARTERS, YEARLY } from '../../constants/periods.js'
import { useUIStore } from '../../store/uiStore.js'
import clsx from 'clsx'

const TABS = [
  { id: 'monthly', label: 'Tháng', periods: MONTHS },
  { id: 'quarterly', label: 'Quý', periods: QUARTERS },
  { id: 'yearly', label: 'Năm', periods: YEARLY },
]

export function PeriodSelector() {
  const { activePeriod, activePeriodType, setActivePeriod } = useUIStore()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState(activePeriodType)

  const currentTab = TABS.find(t => t.id === tab) || TABS[0]
  const selected = currentTab.periods.find(p => p.id === activePeriod) || currentTab.periods[0]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
      >
        <Calendar size={15} className="text-slate-400" />
        <span>{selected?.label ?? activePeriod}</span>
        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 z-30 bg-white rounded-xl border border-slate-200 shadow-xl w-64">
            <div className="flex border-b border-slate-100">
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={clsx('flex-1 py-2 text-sm font-medium cursor-pointer transition-colors', tab === t.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700')}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="p-2 max-h-56 overflow-y-auto">
              {currentTab.periods.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setActivePeriod(p.id, currentTab.id); setOpen(false) }}
                  className={clsx('w-full text-left px-3 py-1.5 text-sm rounded-lg cursor-pointer transition-colors', activePeriod === p.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-50')}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
