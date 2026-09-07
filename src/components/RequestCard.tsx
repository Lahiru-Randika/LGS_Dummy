import { ArrowUpRight, Clock3, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ServiceRequest } from '../types'
import { StatusBadge, TypeBadge } from './StatusBadge'

export function RequestCard({ request, compact = false }: { request: ServiceRequest; compact?: boolean }) {
  return (
    <article className={`request-card ${compact ? 'request-card--compact' : ''}`}>
      <div className="request-card__head">
        <div className="badge-row"><TypeBadge type={request.type} /><StatusBadge status={request.status} /></div>
        <span className={`priority priority--${request.priority.toLowerCase()}`}>{request.priority}</span>
      </div>
      <div className="request-card__body">
        <span className="request-card__id">{request.id}</span>
        <h3>{request.title}</h3>
        {!compact && <p>{request.description}</p>}
      </div>
      <div className="request-card__meta">
        <span><MapPin size={14} />{request.locationLabel}</span>
        <span><Clock3 size={14} />{request.updatedAt.slice(5, 10).replace('-', '/')}</span>
      </div>
      <Link className="request-card__open" to={`/app/requests/${request.id}`} aria-label={`Open ${request.id}`}>
        Open request <ArrowUpRight size={15} />
      </Link>
    </article>
  )
}
