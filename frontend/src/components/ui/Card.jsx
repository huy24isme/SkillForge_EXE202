import clsx from 'clsx'

export function Card({ className, children, padding = true, ...props }) {
  return (
    <div
      className={clsx('bg-white rounded-xl border border-slate-200 shadow-sm', padding && 'p-6', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action, className }) {
  return (
    <div className={clsx('flex items-start justify-between mb-5', className)}>
      <div>
        <h3 className="text-base font-bold text-[#1C2434]">{title}</h3>
        {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 ml-4">{action}</div>}
    </div>
  )
}
