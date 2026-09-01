import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function Panel({ children, className, ...props }: HTMLAttributes<HTMLElement> & { children: ReactNode }) {
  return <section className={cn('rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(11,19,35,.05)] sm:p-6', className)} {...props}>{children}</section>
}

export function PanelHead({ eyebrow, title, right }: { eyebrow?: string; title: string; right?: ReactNode }) {
  return <div className="mb-5 flex items-start justify-between gap-4"><div>{eyebrow && <span className="text-[9px] font-extrabold uppercase tracking-[.15em] text-teal-700">{eyebrow}</span>}<h2 className="mt-1.5 font-['Manrope'] text-xl font-extrabold tracking-[-.025em] text-slate-950 sm:text-[22px]">{title}</h2></div>{right}</div>
}
