import { useState, useEffect } from 'react'

let uid = 0
const listeners = []

function emit(t) {
  listeners.forEach((fn) => fn(t))
}

export const toast = {
  success: (message, duration = 3000) => emit({ id: ++uid, type: 'success', message, duration }),
  error:   (message, duration = 4000) => emit({ id: ++uid, type: 'error',   message, duration }),
  info:    (message, duration = 3000) => emit({ id: ++uid, type: 'info',    message, duration }),
  warning: (message, duration = 3500) => emit({ id: ++uid, type: 'warning', message, duration }),
}

const STYLES = {
  success: 'bg-emerald-600 text-white',
  error:   'bg-red-600 text-white',
  info:    'bg-blue-600 text-white',
  warning: 'bg-amber-500 text-white',
}

const ICONS = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
  warning: '⚠',
}

export function Toaster() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const handler = (t) => {
      setToasts((prev) => [...prev, t])
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id))
      }, t.duration)
    }
    listeners.push(handler)
    return () => {
      const i = listeners.indexOf(handler)
      if (i >= 0) listeners.splice(i, 1)
    }
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium max-w-xs pointer-events-auto ${STYLES[t.type]}`}
        >
          <span className="shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
            {ICONS[t.type]}
          </span>
          <span className="leading-snug">{t.message}</span>
        </div>
      ))}
    </div>
  )
}
