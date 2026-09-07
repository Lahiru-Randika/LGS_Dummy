import { apiData, queryString } from './http'

export const taxService = {
  summary: (year = new Date().getFullYear()) => apiData<any>(`/tax/summary${queryString({ year })}`),
  monthly: (year = new Date().getFullYear()) => apiData<any[]>(`/tax/monthly${queryString({ year })}`),
  byWard: (year = new Date().getFullYear()) => apiData<any[]>(`/tax/by-ward${queryString({ year })}`),
  property: (buildingCode: string) => apiData<any>(`/tax/properties/${encodeURIComponent(buildingCode)}`),
}
