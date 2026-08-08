import { useState, useRef } from 'react'
import { Check, X, MessageSquare } from 'lucide-react'
import { useKPIStore } from '../../store/kpiStore.js'
import { calcCompletion, getRating } from '../../constants/kpiRating.js'
import { RatingBadge } from '../../components/ui/RatingBadge.jsx'
import { ProgressBar } from '../../components/ui/ProgressBar.jsx'
import { formatNumber } from '../../utils/formatters.js'
import clsx from 'clsx'

export function KPIEntryRow({ kpi, period }) {
  const { getResult, setActualValue } = useKPIStore()
  const result = getResult(kpi.id, period)
  const target = kpi.targetValues?.[period]

  const [editing, setEditing] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const [noteOpen, setNoteOpen] = useState(false)
  const [noteVal, setNoteVal] = useState(result?.note ?? '')
  const inputRef = useRef(null)

  const actual = result?.actualValue
  const pct = actual != null && target ? calcCompletion(actual, target) : null

  function startEdit() {
    setInputVal(actual ?? '')
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function save() {
    const v = parseFloat(inputVal)
    if (!isNaN(v)) setActualValue(kpi.id, period, v, noteVal)
    setEditing(false)
  }

  function cancel() { setEditing(false) }

  return (
    <div className="border-b border-slate-50 last:border-0">
      <div className="px-5 py-2.5 grid grid-cols-12 items-center gap-2 hover:bg-slate-50/50 transition-colors group">
        {/* Name */}
        <div className="col-span-4">
          <div className="text-sm font-medium text-slate-800">{kpi.name}</div>
          <div className="text-xs text-slate-400">{kpi.deptId}</div>
        </div>

        {/* Unit */}
        <div className="col-span-1 text-center text-sm text-slate-500">{kpi.unit}</div>

        {/* Target */}
        <div className="col-span-1 text-right text-sm text-slate-600 font-medium">
          {target != null ? formatNumber(target) : '—'}
        </div>

        {/* Actual (editable) */}
        <div className="col-span-2 flex items-center justify-center gap-1">
          {editing ? (
            <div className="flex items-center gap-1">
              <input
                ref={inputRef}
                type="number"
                step="0.01"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel() }}
                className="w-24 px-2 py-1 text-sm text-center border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={save} className="p-1 text-green-600 hover:bg-green-50 rounded cursor-pointer"><Check size={13} /></button>
              <button onClick={cancel} className="p-1 text-slate-400 hover:bg-slate-100 rounded cursor-pointer"><X size={13} /></button>
            </div>
          ) : (
            <button
              onClick={startEdit}
              className={clsx(
                'px-3 py-1 rounded-lg text-sm font-medium cursor-pointer transition-colors min-w-[70px] text-center',
                actual != null ? 'bg-slate-100 hover:bg-blue-50 text-slate-700' : 'bg-dashed border-2 border-dashed border-slate-200 text-slate-300 hover:border-blue-300 hover:text-blue-400'
              )}
            >
              {actual != null ? formatNumber(actual) : '+ Nhập'}
            </button>
          )}
        </div>

        {/* Completion */}
        <div className="col-span-2">
          {pct != null ? (
            <div className="flex items-center gap-2">
              <ProgressBar value={pct} size="sm" className="flex-1" />
              <span className="text-xs font-semibold text-slate-600 w-10 text-right">{pct.toFixed(1)}%</span>
            </div>
          ) : <span className="text-slate-300 text-sm text-center block">—</span>}
        </div>

        {/* Rating */}
        <div className="col-span-1 text-center"><RatingBadge pct={pct} /></div>

        {/* Note */}
        <div className="col-span-1 text-center">
          <button
            onClick={() => setNoteOpen(o => !o)}
            className={clsx('p-1 rounded cursor-pointer transition-colors', result?.note ? 'text-blue-500' : 'text-slate-300 group-hover:text-slate-400 hover:text-slate-600')}
          >
            <MessageSquare size={14} />
          </button>
        </div>
      </div>

      {/* Note panel */}
      {noteOpen && (
        <div className="px-5 pb-3 bg-slate-50/50">
          <textarea
            value={noteVal}
            onChange={e => setNoteVal(e.target.value)}
            placeholder="Ghi chú về kết quả..."
            rows={2}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <div className="flex justify-end gap-2 mt-1.5">
            <button onClick={() => setNoteOpen(false)} className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer px-2 py-1">Đóng</button>
            <button
              onClick={() => { if (actual != null) setActualValue(kpi.id, period, actual, noteVal); setNoteOpen(false) }}
              className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Lưu ghi chú
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
