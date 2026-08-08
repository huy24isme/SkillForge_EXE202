import clsx from 'clsx'

export function ProgressBar({ value, max = 100, className, showLabel = false, size = 'md' }) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100)
  const color = value >= 110 ? '#16a34a' : value >= 90 ? '#2563eb' : value >= 70 ? '#d97706' : '#dc2626'
  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2'
  return (
    <div className={clsx('w-full', className)}>
      <div className={clsx('w-full bg-slate-100 rounded-full overflow-hidden', height)}>
        <div
          className={clsx('h-full rounded-full transition-all duration-500')}
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {showLabel && <span className="text-xs text-slate-500 mt-0.5">{value?.toFixed(1)}%</span>}
    </div>
  )
}
