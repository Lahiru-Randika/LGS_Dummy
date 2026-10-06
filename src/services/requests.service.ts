import type {
  ApprovalSummary,
  BookingDetails,
  Inspection,
  PageMeta,
  RequestAttachment,
  RequestNote,
  RequestPriority,
  RequestStatus,
  RequestType,
  ServiceRequest,
  StatusEvent,
} from '../types'
import { apiData, apiDataCached, apiRequestCached, apiUrl, invalidateApiCache, queryString } from './http'

function numberValue(value: unknown, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function formatEventTime(value: unknown) {
  if (!value) return ''
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function mapHistory(raw: any[] | undefined): StatusEvent[] {
  return (raw || []).map((event) => ({
    status: event.toStatus as RequestStatus,
    label: String(event.label || String(event.toStatus || '').replaceAll('_', ' ')),
    at: formatEventTime(event.createdAt),
    by: String(event.changedBy || 'LGS'),
    note: event.note == null ? undefined : String(event.note),
  }))
}

function mapAttachments(raw: any[] | undefined): RequestAttachment[] {
  return (raw || []).map((item) => ({
    id: String(item.id),
    category: String(item.category || 'DOCUMENT'),
    filename: String(item.filename || 'Attachment'),
    mimeType: String(item.mimeType || ''),
    fileSize: numberValue(item.fileSize),
    visibility: String(item.visibility || ''),
    createdAt: String(item.createdAt || ''),
  }))
}

function mapNotes(raw: any[] | undefined): RequestNote[] {
  return (raw || []).map((item) => ({
    id: item.id,
    body: String(item.body || ''),
    visibility: item.visibility,
    author: String(item.author || 'LGS'),
    createdAt: String(item.createdAt || ''),
  }))
}

export function mapBackendRequest(raw: any): ServiceRequest {
  const attachments = mapAttachments(raw?.attachments)
  const requestCode = String(raw?.requestCode || raw?.id || '')
  return {
    id: requestCode,
    type: raw?.type as RequestType,
    title: String(raw?.title || ''),
    description: String(raw?.description || ''),
    status: raw?.status as RequestStatus,
    priority: (raw?.priority || 'NORMAL') as RequestPriority,
    ward: String(raw?.wardName || raw?.ward || 'Unassigned ward'),
    department: String(raw?.departmentName || raw?.department || 'Unassigned'),
    buildingId: raw?.buildingCode ? String(raw.buildingCode) : undefined,
    locationLabel: String(raw?.locationLabel || raw?.buildingName || 'Mapped location'),
    latitude: numberValue(raw?.latitude),
    longitude: numberValue(raw?.longitude),
    createdAt: String(raw?.createdAt || ''),
    updatedAt: String(raw?.updatedAt || raw?.createdAt || ''),
    createdBy: String(raw?.createdById || ''),
    createdByName: raw?.createdByName ? String(raw.createdByName) : undefined,
    assignedTo: raw?.assignedToId ? String(raw.assignedToId) : undefined,
    assignedToName: raw?.assignedToName ? String(raw.assignedToName) : undefined,
    photos: attachments.map((item) => item.filename),
    history: mapHistory(raw?.history),
    version: numberValue(raw?.version, 1),
    contactPreference: raw?.contactPreference,
    attachments,
    notes: mapNotes(raw?.notes),
    inspection: (raw?.inspection ?? null) as Inspection | null,
    approval: (raw?.approval ?? null) as ApprovalSummary | null,
    booking: (raw?.booking ?? null) as BookingDetails | null,
  }
}

export type RequestListQuery = {
  search?: string
  status?: RequestStatus | ''
  type?: RequestType | ''
  priority?: RequestPriority | ''
  departmentId?: number
  wardId?: number
  assignedTo?: string
  buildingCode?: string
  page?: number
  limit?: number
}

export type RequestCreateInput = {
  clientRequestId: string
  type: RequestType
  title: string
  description: string
  priority: RequestPriority
  contactPreference: 'PORTAL' | 'EMAIL'
  location:
    | { kind: 'BUILDING'; buildingCode: string }
    | { kind: 'POINT' | 'ROAD' | 'OTHER'; latitude: number; longitude: number; label: string }
  booking?: {
    date: string
    startTime?: string | null
    endTime?: string | null
    participants: number
    purpose?: string | null
  }
}

export const requestsService = {
  async list(query: RequestListQuery = {}) {
    const response = await apiRequestCached<any[]>(`/requests${queryString(query as Record<string, unknown>)}`, 8_000)
    return {
      items: response.data.map(mapBackendRequest),
      meta: response.meta as PageMeta | undefined,
    }
  },

  async get(code: string) {
    return mapBackendRequest(await apiDataCached<any>(`/requests/${encodeURIComponent(code)}`, 5_000))
  },

  async create(input: RequestCreateInput, files: File[] = []) {
    const form = new FormData()
    form.append('payload', JSON.stringify(input))
    files.forEach((file) => form.append('files', file))
    const result = await apiData<{ requestCode: string; status: RequestStatus; version?: number; duplicateSubmission?: boolean }>('/requests', {
      method: 'POST',
      body: form,
    })
    invalidateApiCache('/requests')
    return result
  },

  async update(code: string, input: { title?: string; description?: string; priority?: RequestPriority; contactPreference?: 'PORTAL' | 'EMAIL'; version: number }) {
    const result = await apiData<{ updated: boolean; version: number }>(`/requests/${encodeURIComponent(code)}`, { method: 'PATCH', json: input })
    invalidateApiCache('/requests')
    return result
  },

  async assign(code: string, input: { assignedToUserId: string; departmentId?: number | null; note?: string; version: number }) {
    const result = await apiData<{ assigned: boolean; version: number }>(`/requests/${encodeURIComponent(code)}/assignment`, { method: 'PATCH', json: input })
    invalidateApiCache('/requests')
    return result
  },

  async transition(code: string, input: { toStatus: RequestStatus; note?: string; version: number }) {
    const result = await apiData<{ status: RequestStatus; version: number }>(`/requests/${encodeURIComponent(code)}/status-transitions`, { method: 'POST', json: input })
    invalidateApiCache('/requests')
    return result
  },

  async cancel(code: string, version: number, note?: string) {
    const result = await apiData<{ cancelled: boolean; version: number }>(`/requests/${encodeURIComponent(code)}/cancel`, { method: 'POST', json: { version, note } })
    invalidateApiCache('/requests')
    return result
  },

  async addNote(code: string, body: string, visibility: 'PUBLIC' | 'CITIZEN_VISIBLE' | 'INTERNAL' = 'INTERNAL') {
    const result = await apiData<{ id: number }>(`/requests/${encodeURIComponent(code)}/notes`, { method: 'POST', json: { body, visibility } })
    invalidateApiCache('/requests')
    return result
  },

  async addAttachments(code: string, files: File[], category = 'DOCUMENT', visibility = 'CITIZEN_VISIBLE') {
    const form = new FormData()
    form.append('category', category)
    form.append('visibility', visibility)
    files.forEach((file) => form.append('files', file))
    const result = await apiData<{ attachmentIds: string[] }>(`/requests/${encodeURIComponent(code)}/attachments`, { method: 'POST', body: form })
    invalidateApiCache('/requests')
    return result
  },

    async downloadAttachment(
    code: string,
    attachmentId: string,
    filename: string,
  ) {
    const response = await fetch(
      apiUrl(
        `/requests/${encodeURIComponent(code)}/attachments/${encodeURIComponent(
          attachmentId,
        )}/download`,
      ),
      {
        credentials: 'include',
      },
    )

    if (!response.ok) {
      throw new ApiError(
        response.status,
        'ATTACHMENT_DOWNLOAD_FAILED',
        'Unable to open this attachment.',
      )
    }

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)

    return {
      url,
      filename,
      mimeType: blob.type,
    }
  },

  async completeFieldWork(
    code: string,
    input: {
      summary: string
      actionTaken?: string
      recommendation?: string
    },
    files: File[] = [],
  ) {
    const form = new FormData()

    form.append('summary', input.summary)

    if (input.actionTaken) {
      form.append('actionTaken', input.actionTaken)
    }

    if (input.recommendation) {
      form.append('recommendation', input.recommendation)
    }

    files.forEach((file) => {
      form.append('files', file)
    })

    const result = await apiData<{
      completed: boolean
      status: RequestStatus
    }>(
      `/requests/${encodeURIComponent(code)}/field-completion`,
      {
        method: 'POST',
        body: form,
      },
    )
    invalidateApiCache('/requests')
    return result
  },

  async resolveCase(
    code: string,
    input: {
      report: string
    },
  ) {
    const result = await apiData<{
      resolved: boolean
      status: RequestStatus
    }>(
      `/requests/${encodeURIComponent(code)}/resolve`,
      {
        method: 'POST',
        json: input,
      },
    )
    invalidateApiCache('/requests')
    return result
  },
}
