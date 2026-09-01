import { Inbox } from 'lucide-react'

export function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"><div><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-500"><Inbox size={24} /></span><h3 className="mt-4 font-['Manrope'] text-lg font-extrabold text-slate-950">{title}</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{body}</p></div></div>
}
