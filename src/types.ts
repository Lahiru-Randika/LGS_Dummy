export type UserRole = 'CITIZEN' | 'GOV_WORKER' | 'GOV_ADMIN' | 'APPROVER' | 'SUPERIOR'

export type RequestType = 'COMPLAINT' | 'SUGGESTION' | 'INQUIRY' | 'BOOKING'

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

export interface User {
  id: string
  name: string
  shortName: string
  email: string
  role: UserRole
  department?: string
  avatar: string
}

export interface StatusEvent {
  status: RequestStatus
  label: string
  at: string
  by: string
  note?: string
}

export interface ServiceRequest {
  id: string
  type: RequestType
  title: string
  description: string
  status: RequestStatus
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  ward: string
  department: string
  buildingId?: string
  locationLabel: string
  latitude: number
  longitude: number
  createdAt: string
  updatedAt: string
  createdBy: string
  assignedTo?: string
  photos: string[]
  history: StatusEvent[]
}

export interface Building {
  id: string
  name: string
  address: string
  type: string
  publicFacility: boolean
  requestCount: number
  propertyId: string
  taxId: string
  taxStatus: 'Current' | 'Outstanding' | 'Exempt'
  assessmentValue: string
  center: [number, number]
}

export interface NotificationItem {
  id: string
  title: string
  body: string
  time: string
  tone: 'info' | 'success' | 'warning'
  unread?: boolean
}
