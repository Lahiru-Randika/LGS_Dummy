import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Tone = 'plain' | 'mint' | 'blue' | 'amber' | 'violet' | 'dark'

const tones: Record<Tone, string> = {
  plain: 'border-slate-200 bg-white',
  mint: 'border-emerald-100 bg-emerald-50/60',
  blue: 'border-blue-100 bg-blue-50/60',
  amber: 'border-amber-100 bg-amber-50/60',
  violet: 'border-violet-100 bg-violet-50/60',
  dark: 'border-slate-800 bg-slate-950 text-white',
}

export function Card({ children, className, tone = 'plain', interactive = false, ...props }: HTMLAttributes<HTMLElement> & { children: ReactNode; tone?: Tone; interactive?: boolean }) {
  return (
    <article
      className={cn(
        'rounded-[18px] border shadow-[0_18px_50px_rgba(11,19,35,.06)]',
        tones[tone],
        interactive && 'transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:bg-teal-50/40 hover:shadow-[0_22px_55px_rgba(15,118,110,.12)]',
        className,
      )}
      {...props}
    >
      {children}
    </article>
  )
}
