import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-md border px-3 py-2 outline-none focus:ring-2 ${className}`.trim()}
      {...props}
    />
  )
}
