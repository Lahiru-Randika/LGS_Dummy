import { CheckCircle2, Clock3, FileCheck2, MessageSquareMore, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MetricCard } from '../components/MetricCard'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge, TypeBadge } from '../components/StatusBadge'
import { requests } from '../data/mock'

export function ApprovalsPage() {
  const pending=requests.filter(r=>r.status.includes('APPROVAL')||r.status==='NEEDS_APPROVAL')
  return <div className="mx-auto w-full max-w-[1500px]"><PageHeader eyebrow="Governance" title="Approval center" description="Review decisions with the request context, location and audit trail still attached."/>
    <div className="mb-6 grid gap-4 md:grid-cols-3"><MetricCard icon={FileCheck2} label="Awaiting decision" value={pending.length}/><MetricCard icon={Clock3} label="Oldest request" value="18h" note="Current approval SLA: 24h"/><MetricCard icon={CheckCircle2} label="Approved this week" value="17" tone="mint"/></div>
    <div className="grid gap-4">{pending.map(r=><article key={r.id} className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-violet-200 hover:bg-violet-50/30 lg:grid-cols-[1fr_auto]"><div><div className="flex flex-wrap gap-2"><TypeBadge type={r.type}/><StatusBadge status={r.status}/></div><small className="mt-4 block text-[9px] font-bold text-slate-400">{r.id} · {r.department}</small><h3 className="mt-2 font-['Manrope'] text-xl font-extrabold">{r.title}</h3><p className="mt-2 max-w-4xl text-[12px] leading-6 text-slate-500">{r.description}</p><div className="mt-4 flex flex-wrap gap-3 text-[10px] text-slate-500"><span>{r.locationLabel}</span><span>{r.ward}</span></div></div><div className="flex items-end gap-2 lg:items-center"><Link className="inline-flex min-h-10 items-center rounded-xl border border-slate-200 px-4 text-[11px] font-extrabold hover:bg-white" to={`/app/requests/${r.id}`}>Review case</Link><button className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700" title="Approve"><CheckCircle2 size={18}/></button><button className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700" title="Request more info"><MessageSquareMore size={18}/></button><button className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-700" title="Reject"><XCircle size={18}/></button></div></article>)}</div>
  </div>
}
