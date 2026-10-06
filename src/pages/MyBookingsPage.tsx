import { CalendarDays, Clock3, MapPin, Plus } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'

const bookings = [
  { id: 'BK-2026-0018', facility: 'Municipal Community Hall', date: '18 Oct 2026', time: '09:00 AM – 12:00 PM', status: 'Confirmed' },
  { id: 'BK-2026-0012', facility: 'Public Sports Ground', date: '02 Oct 2026', time: '04:00 PM – 06:00 PM', status: 'Completed' },
]

export function MyBookingsPage() {
  return (
    <div className="page">
      <PageHeader eyebrow="Citizen services" title="My bookings" description="View and manage your municipal facility and service bookings." actions={<button className="primary-btn" type="button"><Plus size={16}/>New booking</button>} />
      <div className="grid gap-4 md:grid-cols-2">
        {bookings.map((booking) => (
          <article key={booking.id} className="panel p-5">
            <div className="flex items-start justify-between gap-4">
              <div><span className="eyebrow">{booking.id}</span><h2 className="mt-2 text-lg font-extrabold text-slate-900">{booking.facility}</h2></div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">{booking.status}</span>
            </div>
            <div className="mt-5 grid gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-2"><CalendarDays size={15}/>{booking.date}</span>
              <span className="flex items-center gap-2"><Clock3 size={15}/>{booking.time}</span>
              <span className="flex items-center gap-2"><MapPin size={15}/>Colombo Municipal Council</span>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-slate-400">Demo page — booking API integration will be connected later.</p>
    </div>
  )
}
