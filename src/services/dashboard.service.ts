import { apiData } from './http'
export const dashboardService = { get: () => apiData<any>('/dashboard') }
