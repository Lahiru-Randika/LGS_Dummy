import { API_BASE_URL, apiData, apiDataCached, invalidateApiCache, queryString } from './http'

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
  imageUrl?: string
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
  rawOpeningTime?: string
  rawClosingTime?: string
  openingHours?: string
  description?: string
  imageUrl?: string
  isAvailable?: boolean
  buildingActive?: boolean
  profileActive?: boolean
  bookable?: boolean
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

export function resolveFacilityImageUrl(imageUrl?: string, facilityName?: string, code?: string): string {
  if (imageUrl && imageUrl.trim()) {
    const trimmed = imageUrl.trim()
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed
    }
    if (trimmed.startsWith('/uploads/')) {
      const backendOrigin = API_BASE_URL.replace(/\/api\/v1\/?$/, '')
      return `${backendOrigin}${trimmed}`
    }
    if (trimmed.startsWith('/facilities/')) {
      return trimmed
    }
  }

  // Fallback to standard venue assets
  const f = (facilityName || '').toLowerCase()
  const c = (code || '').toLowerCase()
  if (f.includes('sport') || f.includes('ground') || f.includes('pitch') || c.includes('fac-000002')) {
    return '/facilities/sports-ground.jpg'
  }
  if (f.includes('auditorium') || f.includes('town hall') || c.includes('fac-000003')) {
    return '/facilities/town-hall-auditorium.jpg'
  }
  if (f.includes('meeting') || f.includes('room') || f.includes('conference') || c.includes('fac-000004')) {
    return '/facilities/meeting-room.jpg'
  }
  return '/facilities/community-hall.jpg'
}

export const bookingsService = {
  list: (filters: BookingListFilters = {}) =>
    apiDataCached<BookingItem[]>(`/bookings${queryString(filters as Record<string, unknown>)}`, 2_000),

  facilities: (includeInactive = false) =>
    apiDataCached<BookableFacility[]>(
      `/bookings/facilities${queryString({ includeInactive: includeInactive ? 'true' : undefined })}`,
      5_000,
    ),

  availability: (facilityIdOrCode: string | number, date: string) => {
    const params = typeof facilityIdOrCode === 'number'
      ? { facilityId: facilityIdOrCode, date }
      : { facilityCode: facilityIdOrCode, date }
    return apiData<AvailabilityResponse>(`/bookings/availability${queryString(params)}`)
  },

  create: async (input: CreateBookingInput) => {
    const result = await apiData<{ bookingCode: string; status: string; message?: string }>('/bookings', {
      method: 'POST',
      json: input,
    })
    invalidateApiCache('/bookings')
    return result
  },

  cancel: async (id: string | number) => {
    const result = await apiData<{ cancelled: boolean; status: string }>(`/bookings/${encodeURIComponent(String(id))}/cancel`, {
      method: 'POST',
    })
    invalidateApiCache('/bookings')
    return result
  },

  updateStatus: async (id: string | number, status: string, note?: string) => {
    const result = await apiData<{ updated: boolean; status: string }>(`/bookings/${encodeURIComponent(String(id))}/status`, {
      method: 'PATCH',
      json: { status, note },
    })
    invalidateApiCache('/bookings')
    return result
  },

  // Government Administrator, Approver, Superior Venue Management APIs
  createFacility: async (formData: FormData) => {
    const result = await apiData<{ success: boolean; facility: BookableFacility; message?: string }>(
      '/bookings/facilities',
      {
        method: 'POST',
        body: formData,
      },
    )
    invalidateApiCache('/bookings/facilities')
    invalidateApiCache('/bookings')
    return result
  },

  deleteFacility: async (id: string | number) => {
    const result = await apiData<{ success: boolean; removed: boolean; message?: string }>(
      `/bookings/facilities/${encodeURIComponent(String(id))}`,
      {
        method: 'DELETE',
      },
    )
    invalidateApiCache('/bookings/facilities')
    invalidateApiCache('/bookings')
    return result
  },

  toggleFacility: async (id: string | number) => {
    const result = await apiData<{ success: boolean; active: boolean; message?: string }>(
      `/bookings/facilities/${encodeURIComponent(String(id))}/toggle`,
      {
        method: 'PATCH',
      },
    )
    invalidateApiCache('/bookings/facilities')
    invalidateApiCache('/bookings')
    return result
  },
}
