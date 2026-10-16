import { apiData, queryString } from './http'

export interface BookingItem {
  id: string
  idNum?: number
  bookingCode: string
  facility: string
  facilityName: string
  facilityBuildingId?: number
  facilityId?: number
  facilityCode?: string
  location: string
  date: string
  dateIso?: string
  rawDate?: string
  time: string
  startTime?: string
  endTime?: string
  rawStartTime?: string
  rawEndTime?: string
  status: 'CONFIRMED' | 'COMPLETED' | 'PENDING' | 'CANCELLED' | string
  participants?: number
  purpose?: string
  createdAt?: string
  citizenName?: string
  citizenEmail?: string
  citizenPublicId?: string
}

export interface BookableFacility {
  id: number
  code: string
  name: string
  address: string
  capacity?: number
  openingTime?: string
  closingTime?: string
  description?: string
}

export interface BookedSlot {
  id: number
  bookingCode: string
  startTime: string
  endTime: string
  startTimeFormatted: string
  endTimeFormatted: string
  timeFormatted: string
  status: string
  purpose?: string
}

export interface AvailabilityResponse {
  date: string
  facilityId: number
  bookedSlots: BookedSlot[]
}

export interface CreateBookingInput {
  facilityBuildingId?: number
  facilityCode?: string
  date: string
  startTime: string
  endTime: string
  participants: number
  purpose?: string
}

export interface BookingListFilters {
  facilityId?: number
  facilityCode?: string
  status?: string
  startDate?: string
  endDate?: string
}

export const bookingsService = {
  list: (filters: BookingListFilters = {}) =>
    apiData<BookingItem[]>(`/bookings${queryString(filters as Record<string, unknown>)}`),

  facilities: () => apiData<BookableFacility[]>('/bookings/facilities'),

  availability: (facilityIdOrCode: string | number, date: string) => {
    const params = typeof facilityIdOrCode === 'number'
      ? { facilityId: facilityIdOrCode, date }
      : { facilityCode: facilityIdOrCode, date }
    return apiData<AvailabilityResponse>(`/bookings/availability${queryString(params)}`)
  },

  create: (input: CreateBookingInput) =>
    apiData<{ bookingCode: string; status: string; message?: string }>('/bookings', {
      method: 'POST',
      json: input,
    }),

  cancel: (id: string | number) =>
    apiData<{ cancelled: boolean; status: string }>(`/bookings/${encodeURIComponent(String(id))}/cancel`, {
      method: 'POST',
    }),

  updateStatus: (id: string | number, status: string, note?: string) =>
    apiData<{ updated: boolean; status: string }>(`/bookings/${encodeURIComponent(String(id))}/status`, {
      method: 'PATCH',
      json: { status, note },
    }),
}
