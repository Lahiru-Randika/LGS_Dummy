import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Loader2,
  Lock,
  MapPin,
  Plus,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Upload,
  User,
  X,
} from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import {
  type BookableFacility,
  type BookingItem,
  bookingsService,
  resolveFacilityImageUrl,
} from '../services/bookings.service'

function formatDateKey(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime() + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}

function getWeekOfYear(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

const FULL_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function FacilityBookingsCalendarPage() {
  const { t } = useLanguage()
  const { user } = useAuth()

  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [facilities, setFacilities] = useState<BookableFacility[]>([])
  const [allFacilities, setAllFacilities] = useState<BookableFacility[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Navigation: Calendar vs Venue Management
  const [activeMainTab, setActiveMainTab] = useState<'CALENDAR' | 'VENUES'>('CALENDAR')

  // Venue Management State
  const [isAddVenueOpen, setIsAddVenueOpen] = useState(false)
  const [venueName, setVenueName] = useState('')
  const [venueCode, setVenueCode] = useState('')
  const [venueAddress, setVenueAddress] = useState('Colombo Municipal Council')
  const [venueCapacity, setVenueCapacity] = useState(100)
  const [venueOpeningTime, setVenueOpeningTime] = useState('08:00')
  const [venueClosingTime, setVenueClosingTime] = useState('20:00')
  const [venueDescription, setVenueDescription] = useState('')
  const [venueImageFile, setVenueImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [submittingVenue, setSubmittingVenue] = useState(false)
  const [togglingFacilityId, setTogglingFacilityId] = useState<number | null>(null)

  // Calendar State: currentDate tracks month/year viewed, selectedDate tracks active day
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 14)) // Oct 14, 2026
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 9, 14))
  const [startDayOfWeek, setStartDayOfWeek] = useState<'MON' | 'SUN'>('MON')

  // Filter States: Premise Dropdown & Date Range Filter
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | 'ALL'>('ALL')
  const [dateRangeStart, setDateRangeStart] = useState<string>('')
  const [dateRangeEnd, setDateRangeEnd] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  // Booking Detail Modal
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null)
  const [statusUpdating, setStatusUpdating] = useState(false)

  // New Booking Modal (Admin/Officer creation)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newFacilityCode, setNewFacilityCode] = useState('')
  const [newDate, setNewDate] = useState('2026-10-18')
  const [newStartTime, setNewStartTime] = useState('14:00')
  const [newEndTime, setNewEndTime] = useState('17:00')
  const [newParticipants, setNewParticipants] = useState(50)
  const [newPurpose, setNewPurpose] = useState('')
  const [submittingBooking, setSubmittingBooking] = useState(false)
  const [lockedSlotsForSelectedDate, setLockedSlotsForSelectedDate] = useState<any[]>([])
  const [loadingAvailability, setLoadingAvailability] = useState(false)
  const [collisionWarning, setCollisionWarning] = useState<string | null>(null)

  // Today reference in local format
  const todayRef = useMemo(() => new Date(2026, 9, 14), [])
  const todayStr = useMemo(() => formatDateKey(todayRef), [todayRef])

  // Current time reference
  const getCurrentTimeFormatted = () => {
    const now = new Date()
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  // Load bookings and facilities
  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [bookingsList, facilitiesList, allFacList] = await Promise.all([
        bookingsService.list(),
        bookingsService.facilities(false),
        bookingsService.facilities(true).catch(() => []),
      ])
      setBookings(bookingsList || [])
      setFacilities(facilitiesList || [])
      setAllFacilities(allFacList && allFacList.length > 0 ? allFacList : (facilitiesList || []))
      if (facilitiesList && facilitiesList.length > 0 && !newFacilityCode) {
        setNewFacilityCode(facilitiesList[0].code)
      }
    } catch (err: any) {
      console.error('Failed to load calendar bookings:', err)
      setError(err?.message || 'Unable to load facility bookings from server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filtered Bookings based on Premise Dropdown, Date Range, & Status
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // 1. Premise / Facility Filter
      if (selectedFacilityId !== 'ALL') {
        const facId = b.facilityBuildingId || b.facilityId
        if (facId !== selectedFacilityId) return false
      }

      // 2. Status Filter
      if (statusFilter !== 'ALL') {
        if (b.status?.toUpperCase() !== statusFilter) return false
      }

      // 3. Date Range Filter
      const bDate = b.dateIso || b.rawDate?.slice(0, 10) || ''
      if (dateRangeStart && bDate < dateRangeStart) return false
      if (dateRangeEnd && bDate > dateRangeEnd) return false

      return true
    })
  }, [bookings, selectedFacilityId, statusFilter, dateRangeStart, dateRangeEnd])

  // Bookings specifically for the currently selected date
  const selectedDateBookings = useMemo(() => {
    const sDateStr = formatDateKey(selectedDate)
    return filteredBookings.filter((b) => {
      const bDate = b.dateIso || b.rawDate?.slice(0, 10) || ''
      return bDate === sDateStr
    })
  }, [filteredBookings, selectedDate])

  // Month navigation
  const handlePrevMonth = () => {
    const next = new Date(currentDate)
    next.setMonth(next.getMonth() - 1)
    setCurrentDate(next)
  }

  const handleNextMonth = () => {
    const next = new Date(currentDate)
    next.setMonth(next.getMonth() + 1)
    setCurrentDate(next)
  }

  const handleToday = () => {
    const today = new Date(2026, 9, 14)
    setCurrentDate(today)
    setSelectedDate(today)
  }

  // Quick Preset Date Ranges
  const handleSetPresetRange = (preset: 'all' | 'this_month' | 'next_7' | 'next_30') => {
    if (preset === 'all') {
      setDateRangeStart('')
      setDateRangeEnd('')
      return
    }

    const base = new Date(2026, 9, 14)
    if (preset === 'this_month') {
      const start = new Date(base.getFullYear(), base.getMonth(), 1)
      const end = new Date(base.getFullYear(), base.getMonth() + 1, 0)
      setDateRangeStart(formatDateKey(start))
      setDateRangeEnd(formatDateKey(end))
      setCurrentDate(new Date(base.getFullYear(), base.getMonth(), 1))
    } else if (preset === 'next_7') {
      const start = new Date(base)
      const end = new Date(base)
      end.setDate(end.getDate() + 7)
      setDateRangeStart(formatDateKey(start))
      setDateRangeEnd(formatDateKey(end))
    } else if (preset === 'next_30') {
      const start = new Date(base)
      const end = new Date(base)
      end.setDate(end.getDate() + 30)
      setDateRangeStart(formatDateKey(start))
      setDateRangeEnd(formatDateKey(end))
    }
  }

  // Month grid generator matching Image 1
  const monthData = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const rawFirstDayIndex = firstDay.getDay()
    const firstDayIndex = startDayOfWeek === 'MON'
      ? (rawFirstDayIndex === 0 ? 6 : rawFirstDayIndex - 1)
      : rawFirstDayIndex

    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    const calendarCells: {
      date: Date
      isCurrentMonth: boolean
      dateStr: string
      isPast: boolean
      isToday: boolean
      isSelected: boolean
      isInDateRange: boolean
    }[] = []

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, daysInPrevMonth - i)
      const dStr = formatDateKey(d)
      const inRange = (!dateRangeStart || dStr >= dateRangeStart) && (!dateRangeEnd || dStr <= dateRangeEnd)
      calendarCells.push({
        date: d,
        isCurrentMonth: false,
        dateStr: dStr,
        isPast: dStr < todayStr,
        isToday: dStr === todayStr,
        isSelected: dStr === formatDateKey(selectedDate),
        isInDateRange: inRange,
      })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i)
      const dStr = formatDateKey(d)
      const inRange = (!dateRangeStart || dStr >= dateRangeStart) && (!dateRangeEnd || dStr <= dateRangeEnd)
      calendarCells.push({
        date: d,
        isCurrentMonth: true,
        dateStr: dStr,
        isPast: dStr < todayStr,
        isToday: dStr === todayStr,
        isSelected: dStr === formatDateKey(selectedDate),
        isInDateRange: inRange,
      })
    }

    // Next month filler days to complete rows (35 or 42 cells)
    const totalCellsNeeded = calendarCells.length > 35 ? 42 : 35
    const remaining = totalCellsNeeded - calendarCells.length
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i)
      const dStr = formatDateKey(d)
      const inRange = (!dateRangeStart || dStr >= dateRangeStart) && (!dateRangeEnd || dStr <= dateRangeEnd)
      calendarCells.push({
        date: d,
        isCurrentMonth: false,
        dateStr: dStr,
        isPast: dStr < todayStr,
        isToday: dStr === todayStr,
        isSelected: dStr === formatDateKey(selectedDate),
        isInDateRange: inRange,
      })
    }

    return calendarCells
  }, [currentDate, selectedDate, startDayOfWeek, todayStr, dateRangeStart, dateRangeEnd])

  // Pre-indexed map of dateStr -> bookings for instant O(1) cell lookup
  const bookingsByDate = useMemo(() => {
    const map: Record<string, BookingItem[]> = {}
    for (const b of filteredBookings) {
      const bDate = b.dateIso || b.rawDate?.slice(0, 10) || ''
      if (!bDate) continue
      if (!map[bDate]) map[bDate] = []
      map[bDate].push(b)
    }
    return map
  }, [filteredBookings])

  // Check availability when date or facility changes in booking modal
  useEffect(() => {
    if (!isModalOpen || !newFacilityCode || !newDate) return
    let active = true

    setLoadingAvailability(true)
    bookingsService
      .availability(newFacilityCode, newDate)
      .then((res) => {
        if (!active) return
        setLockedSlotsForSelectedDate(res.bookedSlots || [])
      })
      .catch((err) => {
        console.error('Availability check failed:', err)
      })
      .finally(() => {
        if (active) setLoadingAvailability(false)
      })

    return () => {
      active = false
    }
  }, [isModalOpen, newFacilityCode, newDate])

  // Validate past dates, past times, and collisions live
  useEffect(() => {
    if (!newDate) {
      setCollisionWarning(null)
      return
    }

    // 1. Check if date is in the past
    if (newDate < todayStr) {
      setCollisionWarning('Cannot book a facility for a past date. Please select today or a future date.')
      return
    }

    if (!newStartTime || !newEndTime) {
      setCollisionWarning(null)
      return
    }

    const sTime = newStartTime.length === 5 ? `${newStartTime}:00` : newStartTime
    const eTime = newEndTime.length === 5 ? `${newEndTime}:00` : newEndTime

    // 2. Check if end time is after start time
    if (sTime >= eTime) {
      setCollisionWarning('Booking end time must be after the start time.')
      return
    }

    // 3. Check if time is in the past on current date
    if (newDate === todayStr) {
      const now = new Date()
      const currentHour = String(now.getHours()).padStart(2, '0')
      const currentMin = String(now.getMinutes()).padStart(2, '0')
      const currentTimeStr = `${currentHour}:${currentMin}:00`

      if (sTime < currentTimeStr) {
        setCollisionWarning(
          `Cannot book a time slot in the past. Current time is ${getCurrentTimeFormatted()}. Please choose an upcoming time slot.`,
        )
        return
      }
    }

    // 4. Check for collision with locked slots
    if (lockedSlotsForSelectedDate.length > 0) {
      const colliding = lockedSlotsForSelectedDate.find((slot) => {
        const slotStart = slot.startTime.length === 5 ? `${slot.startTime}:00` : slot.startTime
        const slotEnd = slot.endTime.length === 5 ? `${slot.endTime}:00` : slot.endTime
        return sTime < slotEnd && eTime > slotStart
      })

      if (colliding) {
        setCollisionWarning(
          `This premises is already booked during ${colliding.startTimeFormatted} – ${colliding.endTimeFormatted} (${colliding.bookingCode}). Please choose another time slot.`,
        )
        return
      }
    }

    setCollisionWarning(null)
  }, [newDate, newStartTime, newEndTime, lockedSlotsForSelectedDate, todayStr])

  // Admin creates booking
  const handleAdminCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFacilityCode || !newDate || !newStartTime || !newEndTime) {
      setActionNotice({ type: 'error', text: 'Please fill in all required fields.' })
      return
    }

    if (collisionWarning) {
      setActionNotice({ type: 'error', text: collisionWarning })
      return
    }

    setSubmittingBooking(true)
    try {
      const res = await bookingsService.create({
        facilityCode: newFacilityCode,
        date: newDate,
        startTime: newStartTime,
        endTime: newEndTime,
        participants: Number(newParticipants) || 1,
        purpose: newPurpose.trim() || undefined,
      })

      setIsModalOpen(false)
      setActionNotice({
        type: 'success',
        text: `Facility booking ${res.bookingCode} locked and confirmed successfully!`,
      })
      await loadData()
    } catch (err: any) {
      console.error('Failed to create booking:', err)
      setActionNotice({
        type: 'error',
        text: err?.message || 'Failed to lock premises. Please verify the time slot.',
      })
    } finally {
      setSubmittingBooking(false)
    }
  }

  // Update booking status (Confirm, Complete, Cancel)
  const handleUpdateStatus = async (bookingId: string | number, newStatus: string) => {
    setStatusUpdating(true)
    try {
      await bookingsService.updateStatus(bookingId, newStatus)
      setActionNotice({
        type: 'success',
        text: `Booking status updated to ${newStatus}.`,
      })
      if (selectedBooking) {
        setSelectedBooking({ ...selectedBooking, status: newStatus })
      }
      await loadData()
    } catch (err: any) {
      console.error('Failed to update status:', err)
      setActionNotice({
        type: 'error',
        text: err?.message || 'Failed to update booking status.',
      })
    } finally {
      setStatusUpdating(false)
    }
  }

  // Toggle venue availability or remove from booking list
  const handleToggleVenue = async (fac: BookableFacility) => {
    const isCurrentlyActive = fac.isAvailable !== false && fac.buildingActive !== false && fac.profileActive !== false
    const actionWord = isCurrentlyActive ? 'remove from the booking list' : 'reactivate for citizen bookings'
    if (!window.confirm(`Are you sure you want to ${actionWord} "${fac.name}"?`)) {
      return
    }

    setTogglingFacilityId(fac.id)
    try {
      await bookingsService.toggleFacility(fac.id)
      setActionNotice({
        type: 'success',
        text: `Venue "${fac.name}" ${isCurrentlyActive ? 'deactivated and removed from booking list' : 'reactivated successfully'}!`,
      })
      await loadData()
    } catch (err: any) {
      console.error('Failed to toggle venue:', err)
      setActionNotice({
        type: 'error',
        text: err?.message || 'Failed to update venue status.',
      })
    } finally {
      setTogglingFacilityId(null)
    }
  }

  // Image file selection handler with preview
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVenueImageFile(file)
      const url = URL.createObjectURL(file)
      setImagePreviewUrl(url)
    }
  }

  // Create new venue with image upload
  const handleCreateVenue = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!venueName.trim()) {
      setActionNotice({ type: 'error', text: 'Please provide a venue name.' })
      return
    }

    setSubmittingVenue(true)
    try {
      const formData = new FormData()
      formData.append('name', venueName.trim())
      if (venueCode.trim()) formData.append('code', venueCode.trim())
      if (venueAddress.trim()) formData.append('address', venueAddress.trim())
      formData.append('capacity', String(venueCapacity || 100))
      formData.append('openingTime', venueOpeningTime)
      formData.append('closingTime', venueClosingTime)
      if (venueDescription.trim()) formData.append('description', venueDescription.trim())
      if (venueImageFile) formData.append('image', venueImageFile)

      const res = await bookingsService.createFacility(formData)
      setIsAddVenueOpen(false)
      // Reset form
      setVenueName('')
      setVenueCode('')
      setVenueDescription('')
      setVenueImageFile(null)
      setImagePreviewUrl(null)

      setActionNotice({
        type: 'success',
        text: res.message || `New venue "${venueName}" created and added to the booking list!`,
      })
      await loadData()
    } catch (err: any) {
      console.error('Failed to create venue:', err)
      setActionNotice({
        type: 'error',
        text: err?.message || 'Failed to create venue.',
      })
    } finally {
      setSubmittingVenue(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase()
    if (s === 'CONFIRMED') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {t('Confirmed')}
        </span>
      )
    }
    if (s === 'COMPLETED') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[11px] font-semibold text-teal-700">
          <CheckCircle2 size={12} className="text-teal-600" />
          {t('Completed')}
        </span>
      )
    }
    if (s === 'PENDING') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">
          <Clock size={12} className="text-amber-600" />
          {t('Pending')}
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
        {t(status || 'Scheduled')}
      </span>
    )
  }

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = filteredBookings.length
    const confirmed = filteredBookings.filter((b) => b.status?.toUpperCase() === 'CONFIRMED').length
    const pending = filteredBookings.filter((b) => b.status?.toUpperCase() === 'PENDING').length
    const completed = filteredBookings.filter((b) => b.status?.toUpperCase() === 'COMPLETED').length
    return { total, confirmed, pending, completed }
  }, [filteredBookings])

  const dayHeaders = startDayOfWeek === 'MON'
    ? ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
    : ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const isSelectedDatePast = formatDateKey(selectedDate) < todayStr

  const selectedFacilityName = useMemo(() => {
    if (selectedFacilityId === 'ALL') return t('All premises & facilities')
    const fac = facilities.find((f) => f.id === selectedFacilityId)
    return fac ? fac.name : t('Selected premise')
  }, [selectedFacilityId, facilities, t])

  const isFilterActive = selectedFacilityId !== 'ALL' || !!dateRangeStart || !!dateRangeEnd

  return (
    <div className="page space-y-6">
      <PageHeader
        eyebrow={t('Municipal operations')}
        title={t('Facility bookings calendar')}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="secondary-btn"
              onClick={loadData}
              disabled={loading}
              title={t('Refresh')}
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">{t('Refresh')}</span>
            </button>
            <button
              type="button"
              className="primary-btn inline-flex items-center gap-2"
              onClick={() => {
                const sStr = formatDateKey(selectedDate)
                setNewDate(sStr >= todayStr ? sStr : todayStr)
                setActionNotice(null)
                setIsModalOpen(true)
              }}
            >
              <Plus size={16} />
              {t('New booking')}
            </button>
          </div>
        }
      />

      {/* Action Notification Banner */}
      {actionNotice && (
        <div
          className={`flex items-center justify-between rounded-xl border p-4 text-sm transition-all ${
            actionNotice.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-rose-200 bg-rose-50 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {actionNotice.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-rose-600 shrink-0" />
            )}
            <span>{actionNotice.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* View Switcher: Calendar vs Venues Management */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveMainTab('CALENDAR')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all ${
              activeMainTab === 'CALENDAR'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CalendarDays size={16} />
            <span>{t('Bookings calendar')}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMainTab('VENUES')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all ${
              activeMainTab === 'VENUES'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 size={16} />
            <span>{t('Manage venues & premises')}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeMainTab === 'VENUES' ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {allFacilities.length}
            </span>
          </button>
        </div>

        {activeMainTab === 'VENUES' && (
          <button
            type="button"
            onClick={() => {
              setActionNotice(null)
              setIsAddVenueOpen(true)
            }}
            className="primary-btn inline-flex items-center gap-2"
          >
            <Plus size={16} />
            <span>{t('Add New Venue')}</span>
          </button>
        )}
      </div>

      {activeMainTab === 'CALENDAR' && (
        <>
          {/* Summary Metrics */}
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          { label: t('Total Bookings'), value: metrics.total, icon: CalendarDays, color: 'text-slate-700', bg: 'bg-slate-100' },
          { label: t('Locked & Confirmed'), value: metrics.confirmed, icon: Lock, color: 'text-teal-700', bg: 'bg-teal-50' },
          { label: t('Pending Approval'), value: metrics.pending, icon: Clock, color: 'text-amber-700', bg: 'bg-amber-50' },
          { label: t('Completed'), value: metrics.completed, icon: CheckCircle2, color: 'text-blue-700', bg: 'bg-blue-50' },
        ].map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.label} className="rounded-2xl border border-slate-200/80 bg-white px-4 py-4 shadow-sm sm:px-5">
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-semibold leading-relaxed text-slate-500">{metric.label}</span>
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${metric.bg} ${metric.color}`}>
                  <Icon size={17} strokeWidth={1.8} />
                </span>
              </div>
              <div className="mt-2 text-[28px] font-bold leading-none tracking-tight text-slate-900">{metric.value}</div>
            </div>
          )
        })}
      </div>

      {/* =========================================================
          CALENDAR CONTAINER (EXACT DESIGN MATCHING IMAGE 1)
      ========================================================= */}
      <div className="rounded-[22px] border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Top Header Card: Date Badge & Filters Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 p-5 sm:p-6 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-4">
            {/* Rounded Weekday + Day Badge */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50/90 px-4 py-2.5 min-w-[76px] shadow-2xs">
              <span className="text-xs font-bold text-slate-500 tracking-tight">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'short' })}.
              </span>
              <span className="text-3xl font-black text-slate-900 leading-none mt-1">
                {selectedDate.getDate()}
              </span>
            </div>

            {/* Title & Date Statistics */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {FULL_MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Day {getDayOfYear(selectedDate)}, Week {getWeekOfYear(selectedDate)}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs font-bold ${formatDateKey(selectedDate) === todayStr ? 'text-teal-700' : isSelectedDatePast ? 'text-slate-400' : 'text-slate-700'}`}>
                  {formatDateKey(selectedDate) === todayStr
                    ? t('Today')
                    : isSelectedDatePast
                    ? t('Past date (closed)')
                    : t('Selected date')}
                </span>
                {selectedDateBookings.length > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-extrabold text-teal-800">
                    <Lock size={10} />
                    {selectedDateBookings.length} {t('booked')}
                  </span>
                )}
                {isFilterActive && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-extrabold text-sky-800">
                    <Filter size={9} />
                    {t('Filter active')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* =========================================================
              FILTERS SECTION: PREMISE DROPDOWN & DATE RANGE FILTER
          ========================================================= */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            {/* 1. Premise / Facility Dropdown */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Building2 size={15} />
              </div>
              <select
                id="premise-filter-dropdown"
                value={selectedFacilityId}
                onChange={(e) => setSelectedFacilityId(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                className="appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-9 py-2 text-xs font-semibold text-slate-800 shadow-2xs hover:border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer min-w-[210px] max-w-[280px]"
                title={t('Select premise to filter')}
              >
                <option value="ALL">{t('All premises & facilities')}</option>
                {facilities.map((fac) => (
                  <option key={fac.id} value={fac.id}>
                    {fac.name} {fac.capacity ? `(Cap: ${fac.capacity})` : ''}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400">
                <ChevronDown size={14} />
              </div>
            </div>

            {/* 2. Date Range Filter */}
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
              <div className="flex items-center gap-1 pl-2 text-xs text-slate-600">
                <CalendarDays size={14} className="text-teal-700 shrink-0" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{t('From')}</span>
                <input
                  type="date"
                  value={dateRangeStart}
                  onChange={(e) => {
                    setDateRangeStart(e.target.value)
                    if (e.target.value) {
                      const d = new Date(e.target.value)
                      if (!isNaN(d.getTime())) {
                        setCurrentDate(new Date(d.getFullYear(), d.getMonth(), 1))
                        setSelectedDate(d)
                      }
                    }
                  }}
                  className="rounded-lg border-0 bg-transparent px-1.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500/30"
                  title={t('Start date')}
                />
              </div>

              <span className="text-slate-300 font-bold text-xs">—</span>

              <div className="flex items-center gap-1 text-xs text-slate-600 pr-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{t('To')}</span>
                <input
                  type="date"
                  value={dateRangeEnd}
                  min={dateRangeStart || undefined}
                  onChange={(e) => setDateRangeEnd(e.target.value)}
                  className="rounded-lg border-0 bg-transparent px-1.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500/30"
                  title={t('End date')}
                />
              </div>

              {/* Reset filter button if any filter is set */}
              {isFilterActive && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFacilityId('ALL')
                    setDateRangeStart('')
                    setDateRangeEnd('')
                  }}
                  className="rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors flex items-center gap-1"
                  title={t('Clear filters')}
                >
                  <RotateCcw size={12} />
                  <span className="hidden sm:inline">{t('Reset')}</span>
                </button>
              )}
            </div>

            {/* Quick Presets Menu */}
            <div className="relative">
              <select
                onChange={(e) => {
                  handleSetPresetRange(e.target.value as any)
                  e.target.value = ''
                }}
                defaultValue=""
                className="appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-7 py-2 text-xs font-semibold text-slate-600 shadow-2xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
                title={t('Quick date range presets')}
              >
                <option value="" disabled>{t('Presets')}</option>
                <option value="this_month">{t('This month')}</option>
                <option value="next_7">{t('Next 7 days')}</option>
                <option value="next_30">{t('Next 30 days')}</option>
                <option value="all">{t('All dates (clear)')}</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400">
                <ChevronDown size={13} />
              </div>
            </div>
          </div>
        </div>

        {/* Controls Bar like Image 1 */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-3.5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex flex-wrap items-center gap-2">
            {/* Year Selector */}
            <div className="relative">
              <select
                value={currentDate.getFullYear()}
                onChange={(e) => {
                  const next = new Date(currentDate)
                  next.setFullYear(Number(e.target.value))
                  setCurrentDate(next)
                }}
                className="appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-7 py-1.5 text-xs font-bold text-slate-800 shadow-2xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                {[2025, 2026, 2027, 2028, 2029].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-2.5 text-slate-400" />
            </div>

            {/* Previous Month Arrow */}
            <button
              type="button"
              onClick={handlePrevMonth}
              className="rounded-xl border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs"
              title={t('Previous month')}
            >
              <ChevronLeft size={15} />
            </button>

            {/* Month Selector */}
            <div className="relative">
              <select
                value={currentDate.getMonth()}
                onChange={(e) => {
                  const next = new Date(currentDate)
                  next.setMonth(Number(e.target.value))
                  setCurrentDate(next)
                }}
                className="appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-7 py-1.5 text-xs font-bold text-slate-800 shadow-2xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={m} value={idx}>{m}</option>
                ))}
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-2.5 text-slate-400" />
            </div>

            {/* Next Month Arrow */}
            <button
              type="button"
              onClick={handleNextMonth}
              className="rounded-xl border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs"
              title={t('Next month')}
            >
              <ChevronRight size={15} />
            </button>

            {/* Start Day Selector */}
            <div className="relative">
              <select
                value={startDayOfWeek}
                onChange={(e) => setStartDayOfWeek(e.target.value as 'MON' | 'SUN')}
                className="appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-7 py-1.5 text-xs font-bold text-slate-800 shadow-2xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="MON">Start Day: Mon</option>
                <option value="SUN">Start Day: Sun</option>
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-2.5 text-slate-400" />
            </div>
          </div>

          {/* Today Button */}
          <button
            type="button"
            onClick={handleToday}
            className="rounded-xl border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100 hover:border-slate-300 transition-all shadow-2xs"
          >
            {t('Today')}
          </button>
        </div>

        {/* Days of Week Header matching Image 1 */}
        <div className="grid grid-cols-7 border-b border-slate-100 bg-white text-center py-3 text-xs font-extrabold uppercase tracking-wider text-slate-800">
          {dayHeaders.map((dh) => (
            <span key={dh}>{dh}</span>
          ))}
        </div>

        {/* 7-column Calendar Grid matching Image 1 */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 p-3 sm:p-5 bg-white">
          {monthData.map((cell, idx) => {
            const dayBookings = bookingsByDate[cell.dateStr] || []

            // Days outside current month
            if (!cell.isCurrentMonth) {
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedDate(cell.date)
                  }}
                  className={`min-h-[56px] sm:min-h-[66px] p-1.5 flex flex-col items-center justify-center cursor-pointer rounded-xl hover:bg-slate-50 transition-colors ${
                    !cell.isInDateRange ? 'opacity-30' : ''
                  }`}
                >
                  <span className="text-base sm:text-lg font-bold text-slate-300 select-none">
                    {cell.date.getDate()}
                  </span>
                </div>
              )
            }

            // Cell inside current month
            return (
              <div
                key={idx}
                onClick={() => setSelectedDate(cell.date)}
                className={`min-h-[58px] sm:min-h-[68px] p-1.5 rounded-xl flex flex-col justify-between cursor-pointer transition-all ${
                  cell.isToday
                    ? 'border-2 border-sky-600 bg-sky-50/20 shadow-2xs'
                    : cell.isSelected
                    ? 'border-2 border-teal-600 bg-teal-50/40 shadow-2xs'
                    : cell.isPast
                    ? 'hover:bg-slate-50 opacity-60'
                    : 'hover:bg-slate-50'
                } ${!cell.isInDateRange ? 'opacity-35 grayscale' : ''}`}
                title={cell.isPast ? t('Past date — bookings closed') : `${cell.dateStr}: ${dayBookings.length} booking(s)`}
              >
                {/* Top indicator: T on today (from Image 1), or lock indicator */}
                <div className="flex items-center justify-between leading-none w-full">
                  {cell.isToday ? (
                    <span className="text-[10px] font-black text-sky-600 leading-none pl-0.5">T</span>
                  ) : cell.isPast ? (
                    <span className="text-[10px] font-semibold text-slate-400">·</span>
                  ) : (
                    <span />
                  )}

                  {dayBookings.length > 0 && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-teal-100 px-1 py-0.5 text-[9px] font-bold text-teal-800">
                      <Lock size={7} />
                      {dayBookings.length}
                    </span>
                  )}
                </div>

                {/* Day number (large bold center matching Image 1) */}
                <div className="text-center my-auto">
                  <span
                    className={`text-base sm:text-lg select-none ${
                      cell.isToday
                        ? 'font-black text-slate-900'
                        : cell.isSelected
                        ? 'font-black text-teal-900'
                        : cell.isPast
                        ? 'font-bold text-slate-400'
                        : 'font-bold text-slate-900'
                    }`}
                  >
                    {cell.date.getDate()}
                  </span>
                </div>

                {/* Bottom slot preview or free indicator */}
                <div className="w-full text-center">
                  {dayBookings.length > 0 ? (
                    <span className="block truncate text-[10px] font-semibold text-teal-700">
                      {dayBookings[0].facility?.split(' ')[0] || 'Booked'}
                    </span>
                  ) : cell.isPast ? (
                    <span className="text-[10px] font-medium text-slate-400">past</span>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>

        {/* =========================================================
            DAY SCHEDULE & PREMISES LOCK INSPECTOR (BELOW CALENDAR)
        ========================================================= */}
        <div className="border-t border-slate-100 bg-slate-50/70 p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="eyebrow text-teal-700">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                {t('Bookings for selected day')}
              </h3>
              {isFilterActive && (
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <span className="font-semibold text-teal-800">
                    {selectedFacilityName}
                  </span>
                  {(dateRangeStart || dateRangeEnd) && (
                    <span className="font-mono text-[11px] bg-slate-200/70 px-2 py-0.5 rounded">
                      {dateRangeStart || 'Any'} → {dateRangeEnd || 'Any'}
                    </span>
                  )}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isSelectedDatePast ? (
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-500">
                  <Lock size={13} className="text-slate-400" />
                  {t('Past date — booking closed')}
                </span>
              ) : (
                <button
                  type="button"
                  className="primary-btn inline-flex items-center gap-1.5 text-xs"
                  onClick={() => {
                    setNewDate(formatDateKey(selectedDate))
                    setActionNotice(null)
                    setIsModalOpen(true)
                  }}
                >
                  <Plus size={14} />
                  {t('Book this date')}
                </button>
              )}
            </div>
          </div>

          {/* List of bookings on the selected date */}
          {selectedDateBookings.length > 0 ? (
            <div className="space-y-2.5">
              {selectedDateBookings.map((b) => (
                <div
                  key={b.id || b.bookingCode}
                  onClick={() => setSelectedBooking(b)}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-teal-500 hover:shadow-sm transition-all cursor-pointer flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-700 shrink-0 mt-0.5">
                      <Lock size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="eyebrow text-teal-800">{b.bookingCode || b.id}</span>
                        {getStatusBadge(b.status)}
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                        {b.facility || b.facilityName}
                      </h4>
                      <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-semibold text-slate-800">
                          <Clock size={13} className="text-teal-700" />
                          {b.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={13} className="text-slate-400" />
                          {b.location}
                        </span>
                        {b.citizenName && (
                          <span className="flex items-center gap-1 text-slate-700 font-medium">
                            <User size={13} className="text-slate-400" />
                            {b.citizenName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-800 border border-teal-200/60">
                      {t('Premises locked')}
                    </span>
                    <button
                      type="button"
                      className="secondary-btn text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedBooking(b)
                      }}
                    >
                      {t('Manage')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center">
              <Building2 size={28} className="mx-auto text-slate-300 mb-1.5" />
              <p className="text-xs font-semibold text-slate-600">
                {isSelectedDatePast
                  ? t('No municipal bookings on this date.')
                  : isFilterActive
                  ? t('No facility reservations match the current filter.')
                  : t('No premises booked for this date.')}
              </p>
            </div>
          )}
        </div>
      </div>
        </>
      )}

      {/* =========================================================
          VIEW 2: VENUES & PREMISES MANAGEMENT
      ========================================================= */}
      {activeMainTab === 'VENUES' && (
        <div className="space-y-5">
          {/* Top Banner info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <span className="eyebrow text-teal-700">{t('Municipal Facility Master')}</span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                {t('Bookable Premises & Public Facilities')}
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                {t('Manage municipal facilities open for citizen bookings (community halls, sports grounds, auditoriums, meeting rooms). You can add newly built facilities with images or remove premises from the citizen booking list.')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActionNotice(null)
                setIsAddVenueOpen(true)
              }}
              className="primary-btn shrink-0 inline-flex items-center gap-2"
            >
              <Plus size={16} />
              <span>{t('Add New Venue')}</span>
            </button>
          </div>

          {/* Venues Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5">
            {allFacilities.map((fac) => {
              const isAvailable = fac.isAvailable !== false && fac.buildingActive !== false && fac.profileActive !== false
              const venueImg = resolveFacilityImageUrl(fac.imageUrl, fac.name, fac.code)

              return (
                <div
                  key={fac.id || fac.code}
                  className={`group flex flex-col rounded-2xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${
                    isAvailable ? 'border-slate-200/90' : 'border-rose-200/80 bg-slate-50/50 opacity-80'
                  }`}
                >
                  {/* Venue Image */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={venueImg}
                      alt={fac.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent pointer-events-none" />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-md bg-black/55 backdrop-blur-md px-2 py-1 text-[10px] font-bold text-white tracking-wider">
                        {fac.code}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      {isAvailable ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/95 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                          <CheckCircle2 size={11} />
                          {t('Active')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-600/95 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                          <X size={11} />
                          {t('Removed / Inactive')}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-2.5 left-3 right-3">
                      <h3 className="font-extrabold text-white text-base leading-tight drop-shadow-sm">
                        {fac.name}
                      </h3>
                    </div>
                  </div>

                  {/* Venue Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-xs">
                    <div className="space-y-2 text-slate-600">
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-teal-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-relaxed text-slate-700">{fac.address || 'Colombo Municipal Council'}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                        <span className="flex items-center gap-1.5 text-slate-500 font-semibold">
                          <User size={13} className="text-teal-600" />
                          {t('Capacity')}:
                        </span>
                        <span className="font-bold text-slate-900">{fac.capacity || 'N/A'} {t('people')}</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1.5 text-slate-500 font-semibold">
                          <Clock size={13} className="text-teal-600" />
                          {t('Operating Hours')}:
                        </span>
                        <span className="font-bold text-slate-900">
                          {fac.openingTime || '08:00 AM'} – {fac.closingTime || '08:00 PM'}
                        </span>
                      </div>

                      {fac.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 pt-1 italic">
                          {fac.description}
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      {isAvailable ? (
                        <button
                          type="button"
                          onClick={() => handleToggleVenue(fac)}
                          disabled={togglingFacilityId === fac.id}
                          className="w-full text-center rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 px-3 py-2 text-xs font-bold text-rose-700 transition-colors inline-flex items-center justify-center gap-1.5"
                        >
                          {togglingFacilityId === fac.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Trash2 size={13} />
                          )}
                          <span>{t('Remove from booking list')}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleVenue(fac)}
                          disabled={togglingFacilityId === fac.id}
                          className="w-full text-center rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-700 transition-colors inline-flex items-center justify-center gap-1.5"
                        >
                          {togglingFacilityId === fac.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={13} />
                          )}
                          <span>{t('Reactivate Venue')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {allFacilities.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center my-6">
              <Building2 size={40} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-800">
                {t('No Municipal Venues Registered')}
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                {t('Add your first venue to allow citizens and municipal departments to book premises.')}
              </p>
              <button
                type="button"
                onClick={() => setIsAddVenueOpen(true)}
                className="primary-btn mt-4 inline-flex items-center gap-2"
              >
                <Plus size={16} />
                <span>{t('Add New Venue')}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          BOOKING DETAILS POPUP MODAL (FIXED SIZE & NEVER CUT OFF)
      ========================================================= */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4 sm:p-6 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-150">
          <div className="relative w-full max-w-md sm:max-w-lg my-auto rounded-2xl bg-white shadow-2xl border border-slate-200 p-5 sm:p-6 max-h-[85vh] flex flex-col">
            {/* Modal Image */}
            <div className="shrink-0 relative h-36 w-full rounded-xl overflow-hidden bg-slate-100 mb-3">
              <img
                src={resolveFacilityImageUrl(
                  selectedBooking.imageUrl,
                  selectedBooking.facility || selectedBooking.facilityName,
                  selectedBooking.facilityCode,
                )}
                alt={selectedBooking.facility || selectedBooking.facilityName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2.5 left-3 right-3 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 drop-shadow-sm">
                  {selectedBooking.facilityCode || 'Municipal Venue'}
                </span>
                <h4 className="text-base font-extrabold text-white drop-shadow-sm">
                  {selectedBooking.facility || selectedBooking.facilityName}
                </h4>
              </div>
            </div>

            {/* Modal Header */}
            <div className="shrink-0 flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
              <div>
                <span className="eyebrow text-teal-700">{selectedBooking.bookingCode || selectedBooking.id}</span>
                <h3 className="text-sm font-bold text-slate-700 mt-0.5">
                  {t('Booking Details & Status')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: Scrollable */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3 text-xs text-slate-700">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-500">{t('Status')}:</span>
                {getStatusBadge(selectedBooking.status)}
              </div>

              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-500">{t('Date & Time')}:</span>
                <span className="font-extrabold text-slate-900">
                  {selectedBooking.date} · {selectedBooking.time}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-500">{t('Location')}:</span>
                <span className="font-medium text-slate-800">{selectedBooking.location}</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-500">{t('Citizen / Requester')}:</span>
                <div className="text-right">
                  <strong className="block text-slate-900">{selectedBooking.citizenName || 'Lahiru Randika'}</strong>
                  <small className="text-[10px] text-slate-500">{selectedBooking.citizenEmail || 'citizen@lgs.gov.lk'}</small>
                </div>
              </div>

              {selectedBooking.participants ? (
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-500">{t('Expected Participants')}:</span>
                  <span className="font-bold text-slate-900">{selectedBooking.participants} people</span>
                </div>
              ) : null}

              {selectedBooking.purpose ? (
                <div className="border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-500 block mb-1">{t('Purpose')}:</span>
                  <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-700 italic">
                    &ldquo;{selectedBooking.purpose}&rdquo;
                  </p>
                </div>
              ) : null}

              {/* Premises Lock Status */}
              <div className="rounded-xl border border-teal-200 bg-teal-50/70 px-3.5 py-2.5 flex items-center gap-2 text-xs font-semibold text-teal-800">
                <Lock size={14} className="text-teal-700 shrink-0" />
                <span>{t('Premises locked for this slot')}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="shrink-0 flex flex-wrap items-center justify-end gap-2.5 pt-3 mt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="secondary-btn text-xs"
                disabled={statusUpdating}
              >
                {t('Close')}
              </button>

              {selectedBooking.status?.toUpperCase() === 'PENDING' && (
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'CONFIRMED')}
                  className="primary-btn text-xs inline-flex items-center gap-1.5"
                  disabled={statusUpdating}
                >
                  <Check size={14} />
                  {t('Confirm booking')}
                </button>
              )}

              {selectedBooking.status?.toUpperCase() === 'CONFIRMED' && (
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'COMPLETED')}
                  className="primary-btn text-xs inline-flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900"
                  disabled={statusUpdating}
                >
                  <CheckCircle2 size={14} />
                  {t('Mark completed')}
                </button>
              )}

              {selectedBooking.status?.toUpperCase() !== 'CANCELLED' && (
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'CANCELLED')}
                  className="text-rose-600 hover:text-rose-700 hover:underline text-xs font-semibold px-2"
                  disabled={statusUpdating}
                >
                  {t('Cancel booking')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          ADMIN / OFFICER CREATE BOOKING MODAL (MATCHING REQUEST MODAL DESIGN)
      ========================================================= */}
      {isModalOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.currentTarget === e.target) {
              setIsModalOpen(false)
            }
          }}
        >
          <div className="request-modal">
            {/* Header */}
            <div className="request-modal__head">
              <div>
                <span className="eyebrow">{t('Municipal administrator')}</span>
                <h2>{t('Lock facility reservation.')}</h2>
                <p>
                  {t('Directly reserve and lock a municipal facility slot with atomic conflict check.')}
                </p>
              </div>

              <button
                type="button"
                className="icon-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close booking form"
              >
                <X size={18} />
              </button>
            </div>

            {/* Venue Selector Cards */}
            <div className="facility-type-grid">
              {facilities.map((fac) => {
                const isSelected = newFacilityCode === fac.code
                const imgUrl = resolveFacilityImageUrl(fac.imageUrl, fac.name, fac.code)
                return (
                  <button
                    type="button"
                    key={fac.code}
                    onClick={() => setNewFacilityCode(fac.code)}
                    className={isSelected ? 'is-selected' : ''}
                  >
                    <div className="w-full h-16 rounded-lg overflow-hidden bg-slate-100 mb-2 relative border border-slate-200/60">
                      <img
                        src={imgUrl}
                        alt={fac.name}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <span className="absolute top-1.5 right-1.5 bg-teal-600 text-white rounded-full p-0.5 shadow-sm">
                          <Check size={11} strokeWidth={3} />
                        </span>
                      )}
                    </div>
                    <strong>{fac.name}</strong>
                    <small>
                      {fac.capacity ? `${t('Cap')}: ${fac.capacity}` : ''}
                      {fac.openingHours
                        ? ` • ${fac.openingHours}`
                        : fac.openingTime && fac.closingTime
                          ? ` • ${fac.openingTime} - ${fac.closingTime}`
                          : ''}
                    </small>
                  </button>
                )
              })}
            </div>

            <form onSubmit={handleAdminCreateBooking}>
              <div className="form-grid">
                {/* Municipal Facility Dropdown */}
                <label className="form-field form-field--full">
                  <span>{t('Municipal facility')} *</span>
                  <div className="relative">
                    <select
                      value={newFacilityCode}
                      onChange={(e) => setNewFacilityCode(e.target.value)}
                      required
                    >
                      {facilities.map((fac) => (
                        <option key={fac.code} value={fac.code}>
                          {fac.name} (Cap: {fac.capacity || 'N/A'}) {fac.address ? `— ${fac.address}` : ''}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={17}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                  </div>
                </label>

                {/* Booking Date */}
                <label className="form-field">
                  <span>{t('Booking date')} *</span>
                  <input
                    type="date"
                    value={newDate}
                    min={todayStr}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                  />
                </label>

                {/* Expected Participants */}
                <label className="form-field">
                  <span>{t('Expected participants')}</span>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={newParticipants}
                    onChange={(e) => setNewParticipants(Number(e.target.value))}
                  />
                </label>

                {/* Start Time */}
                <label className="form-field">
                  <span>{t('Start time')} *</span>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    required
                  />
                </label>

                {/* End Time */}
                <label className="form-field">
                  <span>{t('End time')} *</span>
                  <input
                    type="time"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    required
                  />
                </label>

                {/* Purpose / Description */}
                <label className="form-field form-field--full">
                  <span>{t('Purpose / Description')}</span>
                  <textarea
                    rows={3}
                    value={newPurpose}
                    onChange={(e) => setNewPurpose(e.target.value)}
                    placeholder={t('Official municipal event, council meeting, or maintenance window...')}
                  />
                </label>
              </div>

              {/* Real-time Locked Slots Preview */}
              {loadingAvailability && (
                <div className="flex items-center gap-2 text-xs text-slate-400 py-1.5 mb-2">
                  <Loader2 size={13} className="animate-spin text-teal-600" />
                  <span>{t('Checking locked intervals...')}</span>
                </div>
              )}

              {lockedSlotsForSelectedDate.length > 0 && (
                <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-3 text-xs text-teal-900 mb-3">
                  <span className="font-bold flex items-center gap-1.5 mb-1 text-teal-800">
                    <Lock size={13} />
                    {t('Locked slots on this date')}:
                  </span>
                  <div className="space-y-1">
                    {lockedSlotsForSelectedDate.map((s, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px] font-medium">
                        <span>
                          {s.startTimeFormatted} – {s.endTimeFormatted}
                        </span>
                        <span className="font-bold uppercase tracking-wider">{s.bookingCode}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Collision / Past Time Warning Banner */}
              {collisionWarning && (
                <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 flex items-start gap-2.5 mb-3 animate-in fade-in duration-150">
                  <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold mb-0.5">{t('Invalid Time Slot')}</strong>
                    <span>{collisionWarning}</span>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="request-modal__footer">
                <span>
                  <ShieldCheck size={14} className="text-teal-600" />
                  {t('Instant conflict check & atomic lock')}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="secondary-btn"
                    disabled={submittingBooking}
                  >
                    {t('Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="primary-btn inline-flex items-center gap-2"
                    disabled={submittingBooking || !!collisionWarning}
                  >
                    {submittingBooking ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        {t('Locking slot...')}
                      </>
                    ) : (
                      <>
                        <Lock size={14} />
                        {t('Lock & Confirm booking')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          ADD NEW VENUE MODAL (WITH IMAGE UPLOAD TO BACKEND)
      ========================================================= */}
      {isAddVenueOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4 sm:p-6 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg my-auto rounded-2xl bg-white shadow-2xl border border-slate-200 p-5 sm:p-6 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div>
                <span className="eyebrow text-teal-700">{t('Municipal Facility Master')}</span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">{t('Add New Premise / Venue')}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddVenueOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateVenue} className="flex-1 overflow-y-auto pr-1 space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  {t('Venue / Premise Name')} *
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  placeholder="e.g. New Seminar Room 3 or CMC Auditorium"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    {t('Facility Code')} ({t('Optional')})
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 uppercase"
                    placeholder="e.g. LGS-FAC-000005"
                    value={venueCode}
                    onChange={(e) => setVenueCode(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    {t('Capacity (Persons)')} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    value={venueCapacity}
                    onChange={(e) => setVenueCapacity(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  {t('Location / Address')} *
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  placeholder="e.g. Colombo Municipal Council, Level 2, Town Hall"
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    {t('Opening Time')}
                  </label>
                  <input
                    type="time"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    value={venueOpeningTime}
                    onChange={(e) => setVenueOpeningTime(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    {t('Closing Time')}
                  </label>
                  <input
                    type="time"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    value={venueClosingTime}
                    onChange={(e) => setVenueClosingTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Venue Image Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  {t('Premise / Venue Image')}
                </label>
                <div className="mt-1 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-4 hover:border-teal-400 transition-colors bg-slate-50/50">
                  {imagePreviewUrl ? (
                    <div className="relative w-full h-36 rounded-lg overflow-hidden mb-2">
                      <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setVenueImageFile(null)
                          setImagePreviewUrl(null)
                        }}
                        className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <Upload size={28} className="mx-auto text-slate-400 mb-2" />
                      <p className="text-xs font-semibold text-slate-700">
                        {t('Upload an image for this facility')}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        PNG, JPG, or WEBP. Uploads to municipal backend storage.
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleImageFileChange}
                    className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  {t('Description / Facilities')}
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  value={venueDescription}
                  onChange={(e) => setVenueDescription(e.target.value)}
                  placeholder="e.g. Equipped with sound system, projector, air-conditioning, and 120 seats..."
                />
              </div>

              {/* Modal Footer */}
              <div className="shrink-0 flex items-center justify-end gap-3 pt-3 mt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddVenueOpen(false)}
                  className="secondary-btn text-xs"
                  disabled={submittingVenue}
                >
                  {t('Cancel')}
                </button>
                <button
                  type="submit"
                  className="primary-btn inline-flex items-center gap-2 text-xs"
                  disabled={submittingVenue}
                >
                  {submittingVenue ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      {t('Saving venue...')}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} />
                      {t('Create & Publish Venue')}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
