import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

export function Button({ children, className = '', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`px-4 py-2 rounded-md font-medium transition-opacity hover:opacity-90 ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}
