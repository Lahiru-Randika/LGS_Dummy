import { ArrowUpRight, Clock3, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ServiceRequest } from '../types'
import { StatusBadge, TypeBadge } from './StatusBadge'
import { Card } from './ui/Card'

const priorityTone = {
  LOW: 'text-slate-500', NORMAL: 'text-slate-500', HIGH: 'text-orange-600', URGENT: 'text-rose-700',
}

export function RequestCard({ request, compact = false }: { request: ServiceRequest; compact?: boolean }) {
  return (
    <Card interactive className="relative p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2"><TypeBadge type={request.type} /><StatusBadge status={request.status} /></div>
        <span className={`text-[9px] font-extrabold uppercase tracking-[.1em] ${priorityTone[request.priority]}`}>{request.priority}</span>
      </div>
      <div className="mt-5">
        <span className="text-[10px] font-bold text-slate-400">{request.id}</span>
        <h3 className="mt-2 font-['Manrope'] text-[17px] font-extrabold leading-6 tracking-[-.025em] text-slate-950">{request.title}</h3>
        {!compact && <p className="mt-2 line-clamp-2 text-[12px] leading-6 text-slate-500">{request.description}</p>}
      </div>
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 pt-4 text-[10px] font-semibold text-slate-500">
        <span className="flex items-center gap-1.5"><MapPin size={14} />{request.locationLabel}</span>
        <span className="flex items-center gap-1.5"><Clock3 size={14} />{request.updatedAt.slice(5, 10).replace('-', '/')}</span>
      </div>
      <Link className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-extrabold text-teal-700 transition hover:text-teal-900" to={`/app/requests/${request.id}`} aria-label={`Open ${request.id}`}>
        Open request <ArrowUpRight size={15} />
      </Link>
    </Card>
  )
}
