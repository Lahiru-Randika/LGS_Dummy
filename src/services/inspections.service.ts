import type { Inspection } from '../types'
import { apiData } from './http'

export const inspectionsService = {
  create(code: string, scheduledFor?: string | null) {
    return apiData<{ id: string; status: 'SCHEDULED' }>(`/requests/${encodeURIComponent(code)}/inspections`, { method: 'POST', json: { scheduledFor: scheduledFor || null } })
  },

  list(code: string) {
    return apiData<Inspection[]>(`/requests/${encodeURIComponent(code)}/inspections`)
  },

  update(id: string, input: { status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'; latitude?: number | null; longitude?: number | null; summary?: string | null }) {
    return apiData<{ updated: boolean; status: string }>(`/inspections/${encodeURIComponent(id)}`, { method: 'PATCH', json: input })
  },
}
