import type { RequestStatus, RequestType } from '../types'

const labels: Record<RequestStatus, string> = {
  CREATED: 'Created', UNDER_REVIEW: 'Under review', ASSIGNED: 'Assigned', INSPECTION_SCHEDULED: 'Inspection scheduled',
  INSPECTING: 'Inspecting', ACTION_REQUIRED: 'Action required', IN_PROGRESS: 'In progress', RESOLVED: 'Resolved', CLOSED: 'Closed',
  REJECTED: 'Rejected', CANCELLED: 'Cancelled', DUPLICATE: 'Duplicate', NEEDS_APPROVAL: 'Needs approval', AWAITING_APPROVAL: 'Awaiting approval',
}

export function StatusBadge({ status }: { status: RequestStatus }) {
  const tone = status === 'RESOLVED' || status === 'CLOSED'
    ? 'success'
    : status.includes('APPROVAL') || status === 'NEEDS_APPROVAL'
      ? 'purple'
      : status === 'INSPECTING' || status === 'ACTION_REQUIRED'
        ? 'warning'
        : status === 'REJECTED' || status === 'CANCELLED'
          ? 'danger'
          : status === 'CREATED' || status === 'UNDER_REVIEW'
            ? 'neutral'
            : 'info'
  return <span className={`status-badge status-badge--${tone}`}><i />{labels[status]}</span>
}

export function TypeBadge({ type }: { type: RequestType }) {
  return <span className={`type-badge type-badge--${type.toLowerCase()}`}>{type[0] + type.slice(1).toLowerCase()}</span>
}
