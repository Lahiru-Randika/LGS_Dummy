import { apiData, queryString } from './http'

export interface CitizenTaxSummary {
  outstanding: number
  paidThisYear: number
  totalAccounts?: number
  primaryTaxCode?: string
  propertyName?: string
}

export interface TaxReceiptItem {
  id: number
  receipt: string
  description: string
  date: string
  rawDate?: string
  amount: number
  amountFormatted: string
  status: string
  paymentMethod?: string
  taxCode?: string
  propertyCode?: string
  councilName?: string
}

export interface PayTaxInput {
  amount: number
  description?: string
  paymentMethod?: string
}

export const taxService = {
  summary: (year = new Date().getFullYear()) => apiData<any>(`/tax/summary${queryString({ year })}`),
  monthly: (year = new Date().getFullYear()) => apiData<any[]>(`/tax/monthly${queryString({ year })}`),
  byWard: (year = new Date().getFullYear()) => apiData<any[]>(`/tax/by-ward${queryString({ year })}`),
  property: (buildingCode: string) => apiData<any>(`/tax/properties/${encodeURIComponent(buildingCode)}`),
  // Citizen tax endpoints
  mySummary: () => apiData<CitizenTaxSummary>('/tax/my-summary'),
  myPayments: () => apiData<TaxReceiptItem[]>('/tax/my-payments'),
  pay: (input: PayTaxInput) =>
    apiData<{ receipt: string; paymentReference: string; amount: number; status: string; message?: string }>('/tax/pay', {
      method: 'POST',
      json: input,
    }),
}
