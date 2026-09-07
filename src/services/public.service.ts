import { apiData } from './http'

export const publicService = {
  news: () => apiData<any[]>('/public/news'),
  contact: (input: { name: string; email: string; subject: string; message: string }) => apiData<{ id: string; received: boolean }>('/public/contact', { method: 'POST', json: input }),
}
