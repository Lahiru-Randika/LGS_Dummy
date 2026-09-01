import type { RequestStatus, RequestType } from '../types'

const labels: Record<RequestStatus, string> = {
  CREATED: 'Created', UNDER_REVIEW: 'Under review', ASSIGNED: 'Assigned', INSPECTION_SCHEDULED: 'Inspection scheduled',
  INSPECTING: 'Inspecting', ACTION_REQUIRED: 'Action required', IN_PROGRESS: 'In progress', RESOLVED: 'Resolved', CLOSED: 'Closed',
  REJECTED: 'Rejected', CANCELLED: 'Cancelled', DUPLICATE: 'Duplicate', NEEDS_APPROVAL: 'Needs approval', AWAITING_APPROVAL: 'Awaiting approval',
}

const statusTone: Record<'success'|'purple'|'warning'|'danger'|'neutral'|'info', string> = {
  success: 'border-emerald-100 bg-emerald-50 text-emerald-700 before:bg-emerald-500',
  purple: 'border-violet-100 bg-violet-50 text-violet-700 before:bg-violet-500',
  warning: 'border-amber-100 bg-amber-50 text-amber-700 before:bg-amber-500',
  danger: 'border-rose-100 bg-rose-50 text-rose-700 before:bg-rose-500',
  neutral: 'border-slate-200 bg-slate-100 text-slate-600 before:bg-slate-400',
  info: 'border-blue-100 bg-blue-50 text-blue-700 before:bg-blue-500',
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
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-extrabold before:h-1.5 before:w-1.5 before:rounded-full ${statusTone[tone]}`}>{labels[status]}</span>
}

const typeTone: Record<RequestType, string> = {
  COMPLAINT: 'border-rose-100 bg-rose-50 text-rose-700',
  SUGGESTION: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  INQUIRY: 'border-blue-100 bg-blue-50 text-blue-700',
  BOOKING: 'border-violet-100 bg-violet-50 text-violet-700',
}

export function TypeBadge({ type }: { type: RequestType }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-extrabold ${typeTone[type]}`}>{type[0] + type.slice(1).toLowerCase()}</span>
}
