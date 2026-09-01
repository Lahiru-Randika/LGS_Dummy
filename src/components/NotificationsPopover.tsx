import { Bell, CheckCircle2, CircleAlert, Info, X } from 'lucide-react'
import { notifications } from '../data/mock'

const icons = { info: Info, success: CheckCircle2, warning: CircleAlert }
const tones = { info: 'bg-blue-50 text-blue-600', success: 'bg-emerald-50 text-emerald-600', warning: 'bg-amber-50 text-amber-600' }

export function NotificationsPopover({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute right-0 top-[calc(100%+12px)] z-[80] w-[min(380px,calc(100vw-28px))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(11,19,35,.2)]">
      <div className="flex items-start justify-between border-b border-slate-100 p-5">
        <div><span className="text-[9px] font-extrabold uppercase tracking-[.15em] text-teal-700">Updates</span><h3 className="mt-1 font-['Manrope'] text-xl font-extrabold">Notifications</h3></div>
        <button className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900" onClick={onClose} aria-label="Close notifications"><X size={17} /></button>
      </div>
      <div className="max-h-[430px] overflow-auto">
        {notifications.map((item) => {
          const Icon = icons[item.tone]
          return <article key={item.id} className={`flex gap-3 border-b border-slate-100 p-4 last:border-b-0 ${item.unread ? 'bg-teal-50/40' : 'bg-white'}`}>
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tones[item.tone]}`}><Icon size={16} /></span>
            <div className="min-w-0"><strong className="text-[12px] text-slate-900">{item.title}</strong><p className="mt-1 text-[11px] leading-5 text-slate-500">{item.body}</p><small className="mt-1 block text-[9px] font-semibold text-slate-400">{item.time}</small></div>
          </article>
        })}
      </div>
      <button className="flex w-full items-center justify-center gap-2 border-t border-slate-100 px-4 py-3 text-[11px] font-extrabold text-teal-700 hover:bg-slate-50"><Bell size={15} />View notification center</button>
    </div>
  )
}
