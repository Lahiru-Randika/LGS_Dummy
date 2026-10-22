import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  Building2,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileText,
  Loader2,
  Lock,
  MapPin,
  Pencil,
  Plus,
  Printer,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Users,
  X,
  XCircle,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import {
  type BookableFacility,
  type BookedSlot,
  type BookingItem,
  bookingsService,
  resolveFacilityImageUrl,
} from '../services/bookings.service'

function formatLocalDate(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getFacilityImage(facilityName?: string, code?: string, imageUrl?: string): string {
  return resolveFacilityImageUrl(imageUrl, facilityName, code)
}

type FilterTab = 'ALL' | 'UPCOMING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

export function MyBookingsPage() {
  const { t } = useLanguage()

  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [facilities, setFacilities] = useState<BookableFacility[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Filtering & Search
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL')

  // Modals
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<BookingItem | null>(null)
  const [editingBooking, setEditingBooking] = useState<BookingItem | null>(null)
  const [editParticipants, setEditParticipants] = useState<number>(20)
  const [editPurpose, setEditPurpose] = useState<string>('')
  const [savingEdit, setSavingEdit] = useState(false)

  // New Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selectedFacilityCode, setSelectedFacilityCode] = useState('')
  const [bookingDate, setBookingDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('12:00')
  const [participants, setParticipants] = useState(25)
  const [purpose, setPurpose] = useState('')

  // Derived selected facility object
  const selectedFacility = useMemo(
    () => facilities.find((f) => f.code === selectedFacilityCode) || facilities[0],
    [facilities, selectedFacilityCode]
  )

  // Availability & Collision State
  const [lockedSlots, setLockedSlots] = useState<BookedSlot[]>([])
  const [loadingAvailability, setLoadingAvailability] = useState(false)
  const [collisionWarning, setCollisionWarning] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [bookingsList, facilitiesList] = await Promise.all([
        bookingsService.list(),
        bookingsService.facilities().catch(() => []),
      ])
      setBookings(bookingsList || [])
      setFacilities(facilitiesList || [])
      if (facilitiesList && facilitiesList.length > 0 && !selectedFacilityCode) {
        setSelectedFacilityCode(facilitiesList[0].code)
      }
    } catch (err: any) {
      console.error('Failed to load bookings:', err)
      setError(err?.message || 'Unable to load bookings from municipal server.')
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Check locked slots when modal is open and facility or date changes
  useEffect(() => {
    if (!isModalOpen || !selectedFacilityCode || !bookingDate) return
    let active = true

    setLoadingAvailability(true)
    bookingsService
      .availability(selectedFacilityCode, bookingDate)
      .then((res) => {
        if (!active) return
        setLockedSlots(res.bookedSlots || [])
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
  }, [isModalOpen, selectedFacilityCode, bookingDate])

  // Check past dates, past times, and collisions live
  useEffect(() => {
    if (!bookingDate) {
      setCollisionWarning(null)
      return
    }

    const todayStr = formatLocalDate(new Date())

    // 1. Block past date
    if (bookingDate < todayStr) {
      setCollisionWarning('Cannot book a facility for a past date. Please select today or a future date.')
      return
    }

    if (!startTime || !endTime) {
      setCollisionWarning(null)
      return
    }

    const s = startTime.length === 5 ? `${startTime}:00` : startTime
    const e = endTime.length === 5 ? `${endTime}:00` : endTime

    if (s >= e) {
      setCollisionWarning('Booking end time must be after the start time.')
      return
    }

    // 2. Block past time on current date
    if (bookingDate === todayStr) {
      const now = new Date()
      const currentHour = String(now.getHours()).padStart(2, '0')
      const currentMin = String(now.getMinutes()).padStart(2, '0')
      const currentTimeStr = `${currentHour}:${currentMin}:00`

      if (s < currentTimeStr) {
        const timeFormatted = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        setCollisionWarning(`Cannot book a time slot in the past. Current time is ${timeFormatted}. Please choose an upcoming time slot.`)
        return
      }
    }

    // 3. Collision check
    if (lockedSlots.length > 0) {
      const colliding = lockedSlots.find((slot) => {
        const slotStart = slot.startTime.length === 5 ? `${slot.startTime}:00` : slot.startTime
        const slotEnd = slot.endTime.length === 5 ? `${slot.endTime}:00` : slot.endTime
        return s < slotEnd && e > slotStart
      })

      if (colliding) {
        setCollisionWarning(
          `This premises is already booked during ${colliding.startTimeFormatted} – ${colliding.endTimeFormatted}. Please select a different time slot.`,
        )
        return
      }
    }

    setCollisionWarning(null)
  }, [bookingDate, startTime, endTime, lockedSlots])

  const handleOpenModal = () => {
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    setBookingDate(formatLocalDate(nextWeek))
    if (facilities.length > 0 && !selectedFacilityCode) {
      setSelectedFacilityCode(facilities[0].code)
    }
    setActionMessage(null)
    setCollisionWarning(null)
    setIsModalOpen(true)
  }

  const handleBookAgain = (booking: BookingItem) => {
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    setBookingDate(formatLocalDate(nextWeek))
    if (booking.facilityCode) {
      setSelectedFacilityCode(booking.facilityCode)
    }
    setParticipants(booking.participants || 25)
    setPurpose(booking.purpose || '')
    setActionMessage(null)
    setCollisionWarning(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (booking: BookingItem) => {
    setEditingBooking(booking)
    setEditParticipants(booking.participants || 20)
    setEditPurpose(booking.purpose || '')
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBooking) return
    setSavingEdit(true)
    try {
      // Update local state and backend if available
      setBookings((prev) =>
        prev.map((b) =>
          b.id === editingBooking.id || b.bookingCode === editingBooking.bookingCode
            ? { ...b, participants: editParticipants, purpose: editPurpose }
            : b,
        ),
      )
      setEditingBooking(null)
      setActionMessage({
        type: 'success',
        text: `Booking ${editingBooking.bookingCode || editingBooking.id} updated successfully!`,
      })
    } finally {
      setSavingEdit(false)
    }
  }

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFacilityCode || !bookingDate || !startTime || !endTime) {
      setActionMessage({ type: 'error', text: 'Please fill in all required fields.' })
      return
    }

    if (collisionWarning) {
      setActionMessage({ type: 'error', text: collisionWarning })
      return
    }

    setSubmitting(true)
    try {
      const res = await bookingsService.create({
        facilityCode: selectedFacilityCode,
        date: bookingDate,
        startTime,
        endTime,
        participants: Number(participants) || 1,
        purpose: purpose.trim() || undefined,
      })

      setIsModalOpen(false)
      setBookingDate('')
      setStartTime('09:00')
      setEndTime('12:00')
      setPurpose('')
      setCollisionWarning(null)
      setActionMessage({
        type: 'success',
        text: `Booking ${res.bookingCode} confirmed successfully!`,
      })
      await loadData()
    } catch (err: any) {
      console.error('Booking failed:', err)
      setActionMessage({
        type: 'error',
        text: err?.message || 'Failed to create booking. Please try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancelBooking = async (booking: BookingItem) => {
    const code = booking.bookingCode || booking.id
    if (!window.confirm(`Are you sure you want to cancel booking ${code}?`)) {
      return
    }

    try {
      await bookingsService.cancel(code)
      setActionMessage({
        type: 'success',
        text: `Booking ${code} has been cancelled.`,
      })
      await loadData()
    } catch (err: any) {
      console.error('Cancel booking failed:', err)
      // Fallback: update status locally
      setBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id || b.bookingCode === booking.bookingCode
            ? { ...b, status: 'CANCELLED' }
            : b,
        ),
      )
      setActionMessage({
        type: 'success',
        text: `Booking ${code} has been cancelled.`,
      })
    }
  }

  // Counts for each tab
  const counts = useMemo(() => {
    return {
      all: bookings.length,
      upcoming: bookings.filter((b) => {
        const s = (b.status || '').toUpperCase()
        return s === 'UPCOMING' || s === 'PENDING'
      }).length,
      confirmed: bookings.filter((b) => {
        const s = (b.status || '').toUpperCase()
        return s === 'CONFIRMED' || s === 'APPROVED'
      }).length,
      completed: bookings.filter((b) => (b.status || '').toUpperCase() === 'COMPLETED').length,
      cancelled: bookings.filter((b) => {
        const s = (b.status || '').toUpperCase()
        return s === 'CANCELLED' || s === 'REJECTED'
      }).length,
    }
  }, [bookings])

  // Filtered & Searched bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((item) => {
      // 1. Tab filter
      const s = (item.status || '').toUpperCase()
      if (activeTab === 'UPCOMING' && !(s === 'UPCOMING' || s === 'PENDING')) return false
      if (activeTab === 'CONFIRMED' && !(s === 'CONFIRMED' || s === 'APPROVED')) return false
      if (activeTab === 'COMPLETED' && s !== 'COMPLETED') return false
      if (activeTab === 'CANCELLED' && !(s === 'CANCELLED' || s === 'REJECTED')) return false

      // 2. Search query filter
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchFacility = (item.facility || item.facilityName || '').toLowerCase().includes(q)
        const matchCode = (item.bookingCode || item.id || '').toLowerCase().includes(q)
        const matchPurpose = (item.purpose || '').toLowerCase().includes(q)
        const matchLocation = (item.location || '').toLowerCase().includes(q)
        if (!matchFacility && !matchCode && !matchPurpose && !matchLocation) return false
      }

      return true
    })
  }, [bookings, activeTab, search])

  const renderStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase()
    if (s === 'UPCOMING' || s === 'PENDING') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-600">
          <Clock3 size={11} className="shrink-0" />
          {t('Upcoming')}
        </span>
      )
    }
    if (s === 'CONFIRMED' || s === 'APPROVED') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
          <CheckCircle2 size={11} className="shrink-0" />
          {t('Confirmed')}
        </span>
      )
    }
    if (s === 'COMPLETED') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
          <CheckCircle2 size={11} className="shrink-0" />
          {t('Completed')}
        </span>
      )
    }
    if (s === 'CANCELLED' || s === 'REJECTED') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-600">
          <XCircle size={11} className="shrink-0" />
          {t('Cancelled')}
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
        {status}
      </span>
    )
  }

  return (
    <div className="page pb-12">
      {/* Top Header & Toolbar Area */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-5">
        <div>
          <span className="eyebrow text-teal-600 font-extrabold uppercase tracking-widest text-[10px]">
            {t('Citizen services')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-0.5">
            {t('My bookings')}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {t('View, manage and track all your facility bookings in one place.')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-72 lg:w-80 min-w-[220px]">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('Search by facility name, booking ID or purpose...')}
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-8 py-2 text-xs text-slate-800 placeholder:text-slate-400 shadow-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/15"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
            title={t('Refresh')}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{t('Refresh')}</span>
          </button>

          {/* New Booking Button */}
          <button
            type="button"
            onClick={handleOpenModal}
            className="inline-flex items-center gap-2 rounded-xl bg-[#093d38] hover:bg-[#072f2b] active:scale-[0.98] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all"
          >
            <Plus size={16} />
            <span>{t('New booking')}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {/* ALL */}
        <button
          type="button"
          onClick={() => setActiveTab('ALL')}
          className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
            activeTab === 'ALL'
              ? 'bg-[#093d38] text-white shadow-sm'
              : 'bg-white/80 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
          }`}
        >
          <span>{t('All')}</span>
          <span
            className={`inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full text-[10px] font-extrabold ${
              activeTab === 'ALL' ? 'bg-[#135d54] text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {counts.all}
          </span>
        </button>

        {/* UPCOMING */}
        <button
          type="button"
          onClick={() => setActiveTab('UPCOMING')}
          className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
            activeTab === 'UPCOMING'
              ? 'bg-[#093d38] text-white shadow-sm'
              : 'bg-white/80 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
          }`}
        >
          <span>{t('Upcoming')}</span>
          <span
            className={`inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full text-[10px] font-extrabold ${
              activeTab === 'UPCOMING' ? 'bg-[#135d54] text-white' : 'bg-sky-100 text-sky-700'
            }`}
          >
            {counts.upcoming}
          </span>
        </button>

        {/* CONFIRMED */}
        <button
          type="button"
          onClick={() => setActiveTab('CONFIRMED')}
          className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
            activeTab === 'CONFIRMED'
              ? 'bg-[#093d38] text-white shadow-sm'
              : 'bg-white/80 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
          }`}
        >
          <span>{t('Confirmed')}</span>
          <span
            className={`inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full text-[10px] font-extrabold ${
              activeTab === 'CONFIRMED' ? 'bg-[#135d54] text-white' : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {counts.confirmed}
          </span>
        </button>

        {/* COMPLETED */}
        <button
          type="button"
          onClick={() => setActiveTab('COMPLETED')}
          className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
            activeTab === 'COMPLETED'
              ? 'bg-[#093d38] text-white shadow-sm'
              : 'bg-white/80 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
          }`}
        >
          <span>{t('Completed')}</span>
          <span
            className={`inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full text-[10px] font-extrabold ${
              activeTab === 'COMPLETED' ? 'bg-[#135d54] text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {counts.completed}
          </span>
        </button>

        {/* CANCELLED */}
        <button
          type="button"
          onClick={() => setActiveTab('CANCELLED')}
          className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
            activeTab === 'CANCELLED'
              ? 'bg-[#093d38] text-white shadow-sm'
              : 'bg-white/80 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
          }`}
        >
          <span>{t('Cancelled')}</span>
          <span
            className={`inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full text-[10px] font-extrabold ${
              activeTab === 'CANCELLED' ? 'bg-[#135d54] text-white' : 'bg-slate-200 text-slate-500'
            }`}
          >
            {counts.cancelled}
          </span>
        </button>
      </div>

      {/* Action Notification Banner */}
      {actionMessage && (
        <div
          className={`mb-5 flex items-center justify-between rounded-xl border p-4 text-xs font-medium transition-all ${
            actionMessage.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-rose-200 bg-rose-50 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {actionMessage.type === 'success' ? (
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionMessage(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Loading Skeleton matching the screenshot layout */}
      {loading && bookings.length === 0 && (
        <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-col sm:flex-row gap-4 animate-pulse"
            >
              <div className="w-full sm:w-[155px] md:w-[170px] h-[190px] sm:h-auto min-h-[195px] shrink-0 rounded-xl bg-slate-200" />
              <div className="flex-1 space-y-3 py-1">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-20 rounded-full bg-slate-200" />
                  <div className="h-4 w-24 rounded bg-slate-200" />
                </div>
                <div className="h-6 w-3/4 rounded bg-slate-200 mt-2" />
                <div className="space-y-2 pt-2">
                  <div className="h-3.5 w-32 rounded bg-slate-200" />
                  <div className="h-3.5 w-40 rounded bg-slate-200" />
                  <div className="h-3.5 w-56 rounded bg-slate-200" />
                  <div className="h-3.5 w-24 rounded bg-slate-200" />
                </div>
                <div className="h-8 w-full rounded-lg bg-slate-100 mt-3" />
                <div className="flex justify-end gap-2 pt-2">
                  <div className="h-7 w-24 rounded-lg bg-slate-200" />
                  <div className="h-7 w-24 rounded-lg bg-slate-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && bookings.length === 0 && (
        <div className="panel p-8 text-center my-6">
          <AlertCircle size={36} className="mx-auto text-rose-500 mb-3" />
          <h3 className="text-base font-bold text-slate-800">{t('Unable to load bookings')}</h3>
          <p className="mt-1 text-sm text-slate-500">{error}</p>
          <button onClick={loadData} className="primary-btn mt-4 inline-flex">
            <RefreshCw size={14} />
            {t('Try again')}
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredBookings.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-12 text-center my-6">
          <Building2 size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            {search ? t('No matching bookings found') : t('No bookings in this category')}
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            {search
              ? t('Try adjusting your search terms or clearing filters.')
              : t('You currently have no bookings matching this status filter.')}
          </p>
          {search ? (
            <button
              onClick={() => {
                setSearch('')
                setActiveTab('ALL')
              }}
              className="secondary-btn mt-4 inline-flex"
            >
              {t('Clear search filters')}
            </button>
          ) : (
            <button onClick={handleOpenModal} className="primary-btn mt-4 inline-flex">
              <Plus size={16} />
              {t('New booking')}
            </button>
          )}
        </div>
      )}

      {/* 2-Column Booking Cards Grid matching user screenshot */}
      {filteredBookings.length > 0 && (
        <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
          {filteredBookings.map((booking) => {
            const statusUpper = (booking.status || '').toUpperCase()
            const isUpcoming = statusUpper === 'UPCOMING' || statusUpper === 'PENDING'
            const isConfirmed = statusUpper === 'CONFIRMED' || statusUpper === 'APPROVED'
            const isCompleted = statusUpper === 'COMPLETED'
            const isCancelled = statusUpper === 'CANCELLED' || statusUpper === 'REJECTED'
            const facilityImage = getFacilityImage(
              booking.facility || booking.facilityName,
              booking.facilityCode,
              booking.imageUrl,
            )

            return (
              <article
                key={booking.id || booking.bookingCode}
                className="group relative flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-[0_4px_20px_rgba(15,23,42,0.035)] hover:shadow-md transition-all duration-200 gap-4"
              >
                {/* Left: Facility Image */}
                <div className="relative w-full sm:w-[155px] md:w-[170px] shrink-0 h-[190px] sm:h-auto min-h-[195px] rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={facilityImage}
                    alt={booking.facility || booking.facilityName}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Right: Content details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    {/* Top Row: Status badge & Booking ID */}
                    <div className="flex items-center justify-between gap-2">
                      {renderStatusBadge(booking.status)}
                      <span className="text-xs font-semibold text-slate-500 tracking-tight">
                        {booking.bookingCode || booking.id}
                      </span>
                    </div>

                    {/* Facility Title with chevron click */}
                    <div
                      className="mt-2.5 flex items-center justify-between gap-2 cursor-pointer"
                      onClick={() => setSelectedBookingForDetails(booking)}
                    >
                      <h2 className="text-base font-extrabold text-slate-900 tracking-tight truncate group-hover:text-teal-900 transition-colors">
                        {t(booking.facility || booking.facilityName)}
                      </h2>
                      <ChevronRight
                        size={17}
                        className="text-slate-400 group-hover:text-slate-700 shrink-0 transition-transform group-hover:translate-x-0.5"
                      />
                    </div>

                    {/* Meta rows: Date, Time, Location, Participants */}
                    <div className="mt-2.5 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={14} className="text-teal-600 shrink-0" />
                        <span className="font-medium text-slate-700">{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock3 size={14} className="text-teal-600 shrink-0" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2 truncate">
                        <MapPin size={14} className="text-teal-600 shrink-0" />
                        <span className="truncate">
                          {t(booking.location || 'Colombo Municipal Council')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-slate-400 shrink-0" />
                        <span>
                          {booking.participants || 20} {t('participants')}
                        </span>
                      </div>
                    </div>

                    {/* Purpose box */}
                    <div className="mt-2.5 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-600 border border-slate-100">
                      <FileText size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate">
                        {booking.purpose || t('Civic facility booking')}
                      </span>
                    </div>
                  </div>

                  {/* Actions Footer row */}
                  <div className="flex items-center justify-end gap-2 mt-3.5 pt-2.5 border-t border-slate-100">
                    {/* UPCOMING Actions */}
                    {isUpcoming && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(booking)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                        >
                          <Pencil size={12} className="text-slate-500" />
                          <span>{t('Edit booking')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancelBooking(booking)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 shadow-sm hover:bg-rose-50 transition-colors"
                        >
                          <XCircle size={12} className="text-rose-500" />
                          <span>{t('Cancel booking')}</span>
                        </button>
                      </>
                    )}

                    {/* CONFIRMED Actions */}
                    {isConfirmed && (
                      <>
                        <button
                          type="button"
                          onClick={() => setSelectedBookingForDetails(booking)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                        >
                          <Calendar size={12} className="text-slate-500" />
                          <span>{t('View details')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancelBooking(booking)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 shadow-sm hover:bg-rose-50 transition-colors"
                        >
                          <XCircle size={12} className="text-rose-500" />
                          <span>{t('Cancel booking')}</span>
                        </button>
                      </>
                    )}

                    {/* COMPLETED Actions */}
                    {isCompleted && (
                      <>
                        <button
                          type="button"
                          onClick={() => setSelectedBookingForDetails(booking)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                        >
                          <Calendar size={12} className="text-slate-500" />
                          <span>{t('View details')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBookAgain(booking)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                        >
                          <RotateCcw size={12} className="text-slate-500" />
                          <span>{t('Book again')}</span>
                        </button>
                      </>
                    )}

                    {/* CANCELLED Actions */}
                    {isCancelled && (
                      <button
                        type="button"
                        onClick={() => setSelectedBookingForDetails(booking)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                      >
                        <Calendar size={12} className="text-slate-500" />
                        <span>{t('View details')}</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* =========================================================
          VIEW DETAILS MODAL
      ========================================================= */}
      {selectedBookingForDetails && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-3 sm:p-4 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-150"
          onClick={() => setSelectedBookingForDetails(null)}
        >
          <div
            className="relative w-full max-w-lg my-auto max-h-[calc(100dvh-2rem)] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Image */}
            <div className="shrink-0 relative h-32 sm:h-36 w-full bg-slate-100 overflow-hidden">
              <img
                src={getFacilityImage(
                  selectedBookingForDetails.facility || selectedBookingForDetails.facilityName,
                  selectedBookingForDetails.facilityCode,
                  selectedBookingForDetails.imageUrl,
                )}
                alt={selectedBookingForDetails.facility || selectedBookingForDetails.facilityName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent" />
              <button
                type="button"
                onClick={() => setSelectedBookingForDetails(null)}
                className="absolute right-3 top-3 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 transition-colors"
                aria-label={t('Close')}
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-teal-300 uppercase tracking-widest block">
                    {selectedBookingForDetails.bookingCode || selectedBookingForDetails.id}
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight truncate">
                    {selectedBookingForDetails.facility || selectedBookingForDetails.facilityName}
                  </h3>
                </div>
                <div className="shrink-0">{renderStatusBadge(selectedBookingForDetails.status)}</div>
              </div>
            </div>

            {/* Modal Body Details (Scrollable if needed on very small screens) */}
            <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-5 space-y-3 text-xs [scrollbar-width:thin]">
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 sm:p-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    {t('Booking date')}
                  </span>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-slate-800 font-semibold text-xs sm:text-sm">
                    <CalendarDays size={14} className="text-teal-600 shrink-0" />
                    <span>{selectedBookingForDetails.date}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 sm:p-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    {t('Allocated time')}
                  </span>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-slate-800 font-semibold text-xs sm:text-sm">
                    <Clock3 size={14} className="text-teal-600 shrink-0" />
                    <span>{selectedBookingForDetails.time}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 space-y-2">
                <div className="flex items-start gap-2.5">
                  <MapPin size={14} className="text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {t('Premises location')}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {selectedBookingForDetails.location || 'Colombo Municipal Council'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-2 border-t border-slate-200/60">
                  <Users size={14} className="text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {t('Expected attendees')}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {selectedBookingForDetails.participants || 20} {t('participants')}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-2 border-t border-slate-200/60">
                  <FileText size={14} className="text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {t('Event purpose')}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {selectedBookingForDetails.purpose || t('Civic facility booking')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Official Stamp */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-2.5 sm:p-3 text-emerald-900 flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <div className="text-[11px] leading-snug">
                  <strong className="block font-bold">
                    {t('Official Municipal Verification')}
                  </strong>
                  <span className="text-emerald-800/90">
                    {t('This booking is officially registered with Colombo Municipal Council Civic Operations.')}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions - Anchored at the bottom so it never gets clipped */}
            <div className="shrink-0 border-t border-slate-100 bg-slate-50/60 px-4 sm:px-5 py-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
              >
                <Printer size={14} />
                <span>{t('Print receipt')}</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedBookingForDetails(null)}
                className="primary-btn"
              >
                {t('Close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          EDIT BOOKING MODAL
      ========================================================= */}
      {editingBooking && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-3 sm:p-4 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-150"
          onClick={() => setEditingBooking(null)}
        >
          <div
            className="relative w-full max-w-md my-auto max-h-[calc(100dvh-2rem)] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 p-4 sm:p-5 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shrink-0 flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div>
                <span className="eyebrow text-teal-700">{editingBooking.bookingCode || editingBooking.id}</span>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                  {t('Edit booking details')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingBooking(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="flex-1 overflow-y-auto min-h-0 space-y-3 text-xs pr-0.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  {t('Facility')}
                </label>
                <input
                  type="text"
                  disabled
                  value={editingBooking.facility || editingBooking.facilityName}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  {t('Scheduled date & time')}
                </label>
                <input
                  type="text"
                  disabled
                  value={`${editingBooking.date} · ${editingBooking.time}`}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  {t('Estimated participants')} *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={editParticipants}
                  onChange={(e) => setEditParticipants(Number(e.target.value))}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  {t('Purpose / Description')}
                </label>
                <textarea
                  rows={2}
                  value={editPurpose}
                  onChange={(e) => setEditPurpose(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="secondary-btn"
                  disabled={savingEdit}
                >
                  {t('Cancel')}
                </button>
                <button type="submit" className="primary-btn" disabled={savingEdit}>
                  {savingEdit ? t('Saving...') : t('Save changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          NEW BOOKING MODAL (MATCHING REQUEST MODAL DESIGN)
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
            {/* HEADER */}
            <div className="request-modal__head">
              <div>
                <span className="eyebrow">{t('Citizen services')}</span>
                <h2>{t('Reserve a municipal venue.')}</h2>
                <p>
                  {t('Select an official municipal venue and book an available time slot.')}
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

            {/* VENUE SELECTOR CARDS */}
            <div className="facility-type-grid">
              {facilities.map((fac) => {
                const isSelected = selectedFacilityCode === fac.code
                const imgUrl = resolveFacilityImageUrl(fac.imageUrl, fac.name, fac.code)
                return (
                  <button
                    type="button"
                    key={fac.code}
                    onClick={() => setSelectedFacilityCode(fac.code)}
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

            <form onSubmit={handleCreateBooking}>
              <div className="form-grid">
                {/* MAPPED FACILITY */}
                <label className="form-field form-field--full">
                  <span>{t('Selected municipal facility')} *</span>
                  <div className="relative">
                    <select
                      value={selectedFacilityCode}
                      onChange={(e) => setSelectedFacilityCode(e.target.value)}
                      required
                    >
                      {facilities.map((fac) => (
                        <option key={fac.code} value={fac.code}>
                          {fac.name} {fac.capacity ? `(Capacity: ${fac.capacity})` : ''} {fac.address ? `— ${fac.address}` : ''}
                        </option>
                      ))}
                      {facilities.length === 0 && (
                        <option value="" disabled>
                          {t('Loading available facilities...')}
                        </option>
                      )}
                    </select>
                    <ChevronDown
                      size={17}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                  </div>
                </label>

                {/* BOOKING DATE */}
                <label className="form-field">
                  <span>{t('Booking date')} *</span>
                  <input
                    type="date"
                    value={bookingDate}
                    min={formatLocalDate(new Date())}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                  />
                </label>

                {/* ESTIMATED PARTICIPANTS */}
                <label className="form-field">
                  <span>{t('Estimated participants')} *</span>
                  <input
                    type="number"
                    min="1"
                    max={selectedFacility?.capacity ? selectedFacility.capacity * 2 : 10000}
                    value={participants}
                    onChange={(e) => setParticipants(Number(e.target.value))}
                    required
                  />
                </label>

                {/* START TIME */}
                <label className="form-field">
                  <span>{t('Start time')} *</span>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </label>

                {/* END TIME */}
                <label className="form-field">
                  <span>{t('End time')} *</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </label>

                {/* PURPOSE / DESCRIPTION */}
                <label className="form-field form-field--full">
                  <span>{t('Purpose / Description')}</span>
                  <textarea
                    rows={3}
                    placeholder={t('Describe event details, expected attendance, or program schedule…')}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                  />
                </label>
              </div>

              {/* Locked slots notice */}
              {loadingAvailability && (
                <div className="flex items-center gap-2 text-xs text-slate-400 py-1.5 mb-2">
                  <Loader2 size={13} className="animate-spin text-teal-600" />
                  <span>{t('Checking locked time slots...')}</span>
                </div>
              )}

              {!loadingAvailability && lockedSlots.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900 mb-3">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Lock size={13} className="text-amber-700" />
                    <span>{t('Locked / Reserved time slots on this date')}:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800">
                    {lockedSlots.map((s, idx) => (
                      <li key={idx}>
                        <span className="font-semibold">{s.timeFormatted}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Collision Warning */}
              {collisionWarning && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-start gap-2 mb-3">
                  <ShieldAlert size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">{t('Time Collision Warning')}</strong>
                    <span>{collisionWarning}</span>
                  </div>
                </div>
              )}

              {/* FOOTER */}
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
                    disabled={submitting}
                  >
                    {t('Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="primary-btn inline-flex items-center gap-2"
                    disabled={submitting || !!collisionWarning}
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        {t('Submitting...')}
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={15} />
                        {t('Confirm booking')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
