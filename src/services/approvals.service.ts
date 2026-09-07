import type { ApprovalItem, PageMeta } from '../types'
import { apiData, apiRequest, queryString } from './http'

export const approvalsService = {
  async list(query: { status?: string; page?: number; limit?: number } = {}) {
    const response = await apiRequest<ApprovalItem[]>(`/approvals${queryString(query)}`)
    return { items: response.data, meta: response.meta as PageMeta | undefined }
  },

  submit(code: string, input: { approvalType: 'REQUEST_ACTION' | 'BOOKING' | 'EXPENDITURE' | 'OTHER'; requestedAction: string; justification: string; assignedToUserId?: string | null; dueAt?: string | null }) {
    return apiData<{ id: string; status: 'PENDING' }>(`/requests/${encodeURIComponent(code)}/approvals`, { method: 'POST', json: input })
  },

  decide(id: string, decision: 'APPROVE' | 'REJECT' | 'REQUEST_INFO', rationale: string) {
    return apiData<any>(`/approvals/${encodeURIComponent(id)}/decisions`, { method: 'POST', json: { decision, rationale } })
  },
}
