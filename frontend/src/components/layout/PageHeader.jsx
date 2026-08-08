import clsx from 'clsx'

export function PageHeader({ title, subtitle, action, className }) {
  return (
    <div className={clsx('flex items-start justify-between mb-6', className)}>
      <div>
        <h2 className="text-xl font-bold text-slate-800 m-0">{title}</h2>
        {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0 ml-4">{action}</div>}
    </div>
  )
}
