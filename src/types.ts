export type UserRole =
  | 'CITIZEN'
  | 'GOV_WORKER'
  | 'GOV_ADMIN'
  | 'APPROVER'
  | 'SUPERIOR'

export type RequestType =
  | 'COMPLAINT'
  | 'SUGGESTION'
  | 'INQUIRY'
  | 'BOOKING'

export type RequestStatus =
  | 'CREATED'
  | 'UNDER_REVIEW'
  | 'ASSIGNED'
  | 'INSPECTION_SCHEDULED'
  | 'INSPECTING'
  | 'ACTION_REQUIRED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'DUPLICATE'
  | 'NEEDS_APPROVAL'
  | 'AWAITING_APPROVAL'

export type RequestPriority =
  | 'LOW'
  | 'NORMAL'
  | 'HIGH'
  | 'URGENT'

export interface User {
  id: string

  name: string

  shortName: string

  email: string

  role: UserRole

  department?: string

  departmentId?:
    number | null

  wardId?:
    number | null

  avatar: string

  status?:
    | 'ACTIVE'
    | 'DISABLED'
    | 'LOCKED'
}

export interface AuthSession {
  user: User

  permissions:
    string[]
}

export interface StatusEvent {
  status:
    RequestStatus

  label:
    string

  at:
    string

  by:
    string

  note?:
    string
}

export interface RequestAttachment {
  id: string

  category:
    string

  filename:
    string

  mimeType:
    string

  fileSize:
    number

  visibility:
    string

  createdAt:
    string
}

export interface RequestNote {
  id:
    | string
    | number

  body:
    string

  visibility:
    | 'PUBLIC'
    | 'CITIZEN_VISIBLE'
    | 'INTERNAL'

  author:
    string

  createdAt:
    string
}

export interface Inspection {
  id: string

  status:
    | 'SCHEDULED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED'

  scheduledFor?:
    string | null

  startedAt?:
    string | null

  completedAt?:
    string | null

  summary?:
    string | null

  officerName?:
    string | null
}

export interface ApprovalSummary {
  id: string

  approvalType:
    | 'REQUEST_ACTION'
    | 'BOOKING'
    | 'EXPENDITURE'
    | 'OTHER'

  requestedAction:
    string

  justification:
    string

  status:
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'
    | 'INFO_REQUESTED'
    | 'CANCELLED'

  dueAt?:
    string | null

  createdAt:
    string

  decidedAt?:
    string | null
}

export interface BookingDetails {
  date: string

  startTime?:
    string | null

  endTime?:
    string | null

  participants:
    number

  purpose?:
    string | null

  status?:
    string
}

/**
 * UI-facing request shape.
 */
export interface ServiceRequest {
  id: string

  type:
    RequestType

  title:
    string

  description:
    string

  status:
    RequestStatus

  priority:
    RequestPriority

  ward:
    string

  department:
    string

  buildingId?:
    string

  locationLabel:
    string

  latitude:
    number

  longitude:
    number

  createdAt:
    string

  updatedAt:
    string

  createdBy:
    string

  createdByName?:
    string

  assignedTo?:
    string

  assignedToName?:
    string

  photos:
    string[]

  history:
    StatusEvent[]

  version:
    number

  contactPreference?:
    | 'PORTAL'
    | 'EMAIL'

  attachments?:
    RequestAttachment[]

  notes?:
    RequestNote[]

  inspection?:
    Inspection | null

  approval?:
    ApprovalSummary | null

  booking?:
    BookingDetails | null
}

/**
 * UI-facing building shape.
 */
export interface Building {
  id: string

  name:
    string

  address:
    string

  type:
    string

  publicFacility:
    boolean

  requestCount:
    number

  propertyId:
    string

  taxId:
    string

  taxStatus:
    | 'Current'
    | 'Outstanding'
    | 'Exempt'
    | 'Restricted'
    | 'Unavailable'

  assessmentValue:
    string

  center:
    [
      number,
      number,
    ]

  ward?:
    string
}

/**
 * Notification displayed in the bell popover
 * and the full notification center.
 *
 * type/entityType/entityId are optional so any older
 * mock notification objects still remain valid.
 */
export interface NotificationItem {
  id: string

  type?:
    string

  title:
    string

  body:
    string

  time:
    string

  createdAt?:
    string

  tone:
    | 'info'
    | 'success'
    | 'warning'

  unread?:
    boolean

  entityType?:
    string | null

  entityId?:
    string | null
}

export interface PageMeta {
  page:
    number

  limit:
    number

  total:
    number
}

export interface ApprovalItem {
  id: string

  status:
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'
    | 'INFO_REQUESTED'
    | 'CANCELLED'

  approvalType:
    | 'REQUEST_ACTION'
    | 'BOOKING'
    | 'EXPENDITURE'
    | 'OTHER'

  requestedAction:
    string

  justification:
    string

  dueAt?:
    string | null

  createdAt:
    string

  decidedAt?:
    string | null

  requestCode:
    string

  requestTitle:
    string

  priority:
    RequestPriority

  submittedBy:
    string

  assignedToId?:
    string | null

  assignedToName?:
    string | null
}

export interface GovernmentUser
  extends User {
  status:
    | 'ACTIVE'
    | 'DISABLED'
    | 'LOCKED'

  createdAt?:
    string

  lastLoginAt?:
    string | null
}

export interface Worker {
  id: string

  name:
    string

  departmentId?:
    number | null

  departmentName?:
    string | null
}