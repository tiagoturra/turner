import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'ghost'
}

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-[var(--accent)] text-[var(--on-accent)] shadow-[0_2px_8px_rgba(28,48,34,.1)] hover:bg-[var(--accent-strong)] hover:shadow-[0_2px_8px_rgba(28,48,34,.17)]',
    ghost: 'border-[var(--line)] bg-transparent text-[var(--ink)] hover:bg-[var(--soft)]',
  }

  return <button className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-[3px] border border-transparent px-4 py-3 font-semibold transition-[transform,box-shadow,background-color] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)] active:translate-y-px ${variants[variant]} ${className}`} {...props}>{children}</button>
}
