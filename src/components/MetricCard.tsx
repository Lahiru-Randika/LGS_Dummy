import type { LucideIcon } from 'lucide-react'
import { Card } from './ui/Card'

const toneMap = { plain: 'plain', dark: 'dark', mint: 'mint' } as const

export function MetricCard({ icon: Icon, label, value, note, tone = 'plain' }: { icon: LucideIcon; label: string; value: string | number; note?: string; tone?: 'plain' | 'dark' | 'mint' }) {
  const dark = tone === 'dark'
  return (
    <Card tone={toneMap[tone]} interactive className="min-h-[150px] p-5">
      <div className="flex items-start justify-between gap-4">
        <span className={dark ? 'text-[10px] font-extrabold uppercase tracking-[.1em] text-slate-300' : 'text-[10px] font-extrabold uppercase tracking-[.1em] text-slate-500'}>{label}</span>
        <span className={dark ? 'grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white' : 'grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500'}><Icon size={18} /></span>
      </div>
      <strong className="mt-5 block font-['Manrope'] text-3xl font-extrabold tracking-[-.04em]">{value}</strong>
      {note && <p className={dark ? 'mt-2 text-[11px] text-slate-300' : 'mt-2 text-[11px] text-slate-500'}>{note}</p>}
    </Card>
  )
}
