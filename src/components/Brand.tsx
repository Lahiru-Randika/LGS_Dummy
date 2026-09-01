import { Landmark } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../lib/cn'

export function Brand({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <Link to="/" className={cn('inline-flex items-center gap-2.5', light ? 'text-white' : 'text-slate-950')} aria-label="LGS home">
      <span className={cn('grid h-10 w-10 place-items-center rounded-xl shadow-[0_8px_20px_rgba(11,19,35,.16)]', light ? 'bg-white text-slate-950' : 'bg-slate-950 text-white')}>
        <Landmark size={19} strokeWidth={2.2} />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <strong className="font-['Manrope'] text-[19px] font-extrabold tracking-[-.05em]">LGS</strong>
          <small className={cn('mt-1 text-[9px] tracking-[.04em]', light ? 'text-slate-400' : 'text-slate-500')}>Local Government Systems</small>
        </span>
      )}
    </Link>
  )
}
