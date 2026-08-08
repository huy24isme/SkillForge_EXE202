import clsx from 'clsx'

const variants = {
  primary:   'bg-[#3C50E0] text-white hover:bg-[#3142C4] border-transparent shadow-sm',
  secondary: 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200',
  danger:    'bg-red-600 text-white hover:bg-red-700 border-transparent',
  ghost:     'bg-transparent text-slate-600 hover:bg-slate-100 border-transparent',
  success:   'bg-emerald-600 text-white hover:bg-emerald-700 border-transparent',
  outline:   'bg-white text-[#3C50E0] hover:bg-[#3C50E0]/5 border-[#3C50E0]/40',
}

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3.5 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({ variant = 'primary', size = 'md', className, disabled, children, icon, ...props }) {
  return (
    <button
      className={clsx(
        'inline-flex items-center gap-2 font-semibold rounded-lg border transition-all cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant], sizes[size], className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
      {children}
    </button>
  )
}
