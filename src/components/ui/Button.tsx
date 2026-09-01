import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'light' | 'outlineLight'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'border-slate-950 bg-slate-950 text-white shadow-[0_8px_22px_rgba(11,19,35,.15)] hover:-translate-y-0.5 hover:bg-slate-800',
  secondary: 'border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50',
  ghost: 'border-transparent bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950',
  danger: 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100',
  light: 'border-white bg-white text-slate-950 hover:bg-slate-100',
  outlineLight: 'border-white/30 bg-white/5 text-white hover:bg-white/10',
}

const sizes: Record<Size, string> = {
  sm: 'min-h-9 px-3 text-xs',
  md: 'min-h-11 px-4 text-[13px]',
  lg: 'min-h-[50px] px-5 text-[13px]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; children: ReactNode }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl border font-bold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
