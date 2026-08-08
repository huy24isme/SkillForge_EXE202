import clsx from 'clsx'
import { getRating } from '../../constants/kpiRating.js'

export function RatingBadge({ pct, size = 'sm' }) {
  if (pct == null) return <span className="text-slate-400 text-xs">—</span>
  const { label, tailwind } = getRating(pct)
  return (
    <span className={clsx(
      'inline-flex items-center font-semibold rounded-full',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
      tailwind
    )}>
      {label}
    </span>
  )
}
