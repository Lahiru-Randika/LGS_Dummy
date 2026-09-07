import { apiData, queryString } from './http'

export const analyticsService = {
  summary: (query: { from?: string; to?: string } = {}) => apiData<any>(`/analytics/requests/summary${queryString(query)}`),
  trend: (query: { from?: string; to?: string; bucket?: 'day' | 'month' } = {}) => apiData<any[]>(`/analytics/requests/trend${queryString(query)}`),
  byType: (query: { from?: string; to?: string } = {}) => apiData<any[]>(`/analytics/requests/by-type${queryString(query)}`),
  departments: () => apiData<any[]>('/analytics/departments'),
  wards: () => apiData<any[]>('/analytics/wards'),
  hotspots: () => apiData<any[]>('/analytics/hotspots'),
}
