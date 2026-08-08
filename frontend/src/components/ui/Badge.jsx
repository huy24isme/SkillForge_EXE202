import clsx from 'clsx'

export function Badge({ children, color = 'slate', size = 'sm', className }) {
  const colors = {
    slate:  'bg-slate-100 text-slate-700',
    blue:   'bg-blue-100 text-blue-800',
    green:  'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red:    'bg-red-100 text-red-800',
    purple: 'bg-purple-100 text-purple-800',
    orange: 'bg-orange-100 text-orange-800',
  }
  return (
    <span className={clsx('inline-flex items-center font-medium rounded-full', size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm', colors[color], className)}>
      {children}
    </span>
  )
}
