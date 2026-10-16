import { useEffect, useState } from 'react'
import {
  AlertCircle,
  Building2,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  Lock,
  MapPin,
  Plus,
  RefreshCw,
  ShieldAlert,
  Users,
  X,
} from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { useLanguage } from '../context/LanguageContext'
import {
  type BookableFacility,
  type BookedSlot,
  type BookingItem,
  bookingsService,
} from '../services/bookings.service'

function formatLocalDate(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function MyBookingsPage() {
  const { t } = useLanguage()

  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [facilities, setFacilities] = useState<BookableFacility[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // New Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selectedFacilityCode, setSelectedFacilityCode] = useState('')
  const [bookingDate, setBookingDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('12:00')
  const [participants, setParticipants] = useState(25)
  const [purpose, setPurpose] = useState('')

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
      setBookings(bookingsList)
      setFacilities(facilitiesList)
      if (facilitiesList.length > 0 && !selectedFacilityCode) {
        setSelectedFacilityCode(facilitiesList[0].code)
      }
    } catch (err: any) {
      console.error('Failed to load bookings:', err)
      setError(err?.message || 'Unable to load bookings from municipal server.')
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

    const todayStr = formatLocalDate(new Date(2026, 9, 14))

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
    if (!window.confirm(`Are you sure you want to cancel booking ${booking.bookingCode || booking.id}?`)) {
      return
    }

    try {
      await bookingsService.cancel(booking.bookingCode || booking.id)
      setActionMessage({
        type: 'success',
        text: `Booking ${booking.bookingCode || booking.id} has been cancelled.`,
      })
      await loadData()
    } catch (err: any) {
      console.error('Cancel booking failed:', err)
      setActionMessage({
        type: 'error',
        text: err?.message || 'Failed to cancel booking.',
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase()
    if (s === 'CONFIRMED' || s === 'APPROVED') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {t('Confirmed')}
        </span>
      )
    }
    if (s === 'COMPLETED') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200/80 bg-teal-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-teal-700 shadow-sm">
          <CheckCircle2 size={11} className="text-teal-600" />
          {t('Completed')}
        </span>
      )
    }
    if (s === 'PENDING') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-700 shadow-sm">
          <Clock3 size={11} className="text-amber-600" />
          {t('Pending')}
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
        {t(status || 'Scheduled')}
      </span>
    )
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow={t('Citizen services')}
        title={t('My bookings')}
        actions={
          <div className="flex items-center gap-2">
            <button
              className="secondary-btn"
              type="button"
              onClick={loadData}
              disabled={loading}
              title={t('Refresh')}
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">{t('Refresh')}</span>
            </button>
            <button
              className="primary-btn"
              type="button"
              onClick={handleOpenModal}
            >
              <Plus size={16} />
              {t('New booking')}
            </button>
          </div>
        }
      />

      {/* Action Notification Banner */}
      {actionMessage && (
        <div
          className={`mb-4 flex items-center justify-between rounded-xl border p-4 text-sm transition-all ${
            actionMessage.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-rose-200 bg-rose-50 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {actionMessage.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-rose-600 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionMessage(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && bookings.length === 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="panel p-5 animate-pulse">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-3 w-24 rounded bg-slate-200" />
                  <div className="h-5 w-48 rounded bg-slate-200" />
                </div>
                <div className="h-6 w-20 rounded-full bg-slate-200" />
              </div>
              <div className="mt-5 space-y-3">
                <div className="h-3 w-36 rounded bg-slate-200" />
                <div className="h-3 w-44 rounded bg-slate-200" />
                <div className="h-3 w-40 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && bookings.length === 0 && (
        <div className="panel p-8 text-center">
          <AlertCircle size={36} className="mx-auto text-rose-500 mb-3" />
          <h3 className="text-base font-bold text-slate-800">{t('Unable to load bookings')}</h3>
          <p className="mt-1 text-sm text-slate-500">{error}</p>
          <button onClick={loadData} className="primary-btn mt-4 inline-flex">
            <RefreshCw size={14} />
            {t('Try again')}
          </button>
        </div>
      )}

      {/* Bookings Grid */}
      {!loading && bookings.length === 0 && !error && (
        <div className="panel p-10 text-center">
          <Building2 size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">{t('No bookings found')}</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            {t('You currently have no municipal facility bookings. Click below to book a community hall or sports facility.')}
          </p>
          <button onClick={handleOpenModal} className="primary-btn mt-5 inline-flex">
            <Plus size={16} />
            {t('New booking')}
          </button>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {bookings.map((booking) => (
            <article
              key={booking.id || booking.bookingCode}
              className="panel p-5 transition-shadow hover:shadow-md border border-slate-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="eyebrow tracking-wider text-[11px] font-bold text-teal-700">
                      {booking.bookingCode || booking.id}
                    </span>
                    <h2 className="mt-1.5 text-lg font-extrabold text-slate-900 tracking-tight">
                      {t(booking.facility || booking.facilityName)}
                    </h2>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>

                <div className="mt-5 grid gap-2.5 text-xs text-slate-600">
                  <span className="flex items-center gap-2.5">
                    <CalendarDays size={15} className="text-teal-600 shrink-0" />
                    <span className="font-medium text-slate-800">{booking.date}</span>
                  </span>
                  <span className="flex items-center gap-2.5">
                    <Clock3 size={15} className="text-teal-600 shrink-0" />
                    <span>{booking.time}</span>
                  </span>
                  <span className="flex items-center gap-2.5">
                    <MapPin size={15} className="text-teal-600 shrink-0" />
                    <span>{t(booking.location || 'Colombo Municipal Council')}</span>
                  </span>
                  {booking.participants ? (
                    <span className="flex items-center gap-2.5 text-slate-500">
                      <Users size={14} className="text-slate-400 shrink-0" />
                      <span>{booking.participants} {t('participants')}</span>
                    </span>
                  ) : null}
                  {booking.purpose ? (
                    <p className="mt-1 text-[11px] text-slate-500 italic bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                      &ldquo;{booking.purpose}&rdquo;
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Actions Footer */}
              {booking.status?.toUpperCase() === 'CONFIRMED' && (
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><CheckCircle2 size={13} className="text-emerald-600" />{t('Confirmed')}</span>
                  <button
                    type="button"
                    onClick={() => handleCancelBooking(booking)}
                    className="text-rose-600 hover:text-rose-700 hover:underline text-xs font-semibold"
                  >
                    {t('Cancel booking')}
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {/* =========================================================
          NEW BOOKING MODAL (WITH LIVE COLLISION DETECTION)
      ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4 sm:p-6 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-150">
          <div className="relative w-full max-w-md sm:max-w-lg my-auto rounded-2xl bg-white shadow-2xl border border-slate-200 p-5 sm:p-6 max-h-[85vh] flex flex-col">
            <div className="shrink-0 flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div>
                <span className="eyebrow text-teal-700">{t('Citizen services')}</span>
                <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">{t('New facility booking')}</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="flex-1 overflow-y-auto pr-1 space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t('Select municipal facility')} *
                </label>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  value={selectedFacilityCode}
                  onChange={(e) => setSelectedFacilityCode(e.target.value)}
                  required
                >
                  {facilities.map((fac) => (
                    <option key={fac.code} value={fac.code}>
                      {fac.name} {fac.capacity ? `(Cap: ${fac.capacity})` : ''}
                    </option>
                  ))}
                  {facilities.length === 0 && (
                    <>
                      <option value="LGS-FAC-000001">Municipal Community Hall (Cap: 350)</option>
                      <option value="LGS-FAC-000002">Public Sports Ground (Cap: 500)</option>
                      <option value="LGS-FAC-000003">Town Hall Auditorium (Cap: 450)</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t('Booking date')} *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    value={bookingDate}
                    min={formatLocalDate(new Date())}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Locked slots notice */}
              {loadingAvailability && (
                <div className="flex items-center gap-2 text-xs text-slate-400 py-1">
                  <Loader2 size={13} className="animate-spin" />
                  <span>{t('Checking locked time slots...')}</span>
                </div>
              )}

              {!loadingAvailability && lockedSlots.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900">
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
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-start gap-2">
                  <ShieldAlert size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">{t('Time Collision Warning')}</strong>
                    <span>{collisionWarning}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {t('Start time')} *
                  </label>
                  <input
                    type="time"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {t('End time')} *
                  </label>
                  <input
                    type="time"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t('Estimated participants')} *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  value={participants}
                  onChange={(e) => setParticipants(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t('Purpose / Description')}
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  placeholder={t('e.g. Community council workshop or sports tournament')}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </div>

              <div className="shrink-0 flex items-center justify-end gap-3 pt-3 mt-3 border-t border-slate-100">
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
                      <Loader2 size={16} className="animate-spin" />
                      {t('Submitting...')}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      {t('Confirm booking')}
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
