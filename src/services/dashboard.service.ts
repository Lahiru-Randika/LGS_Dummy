import { apiDataCached } from './http'

export const dashboardService = {
  get: () => apiDataCached<any>('/dashboard', 10_000),
}
