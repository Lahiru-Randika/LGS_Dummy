import { Camera, CheckCircle2, FileText, MapPin, Paperclip, Send, X } from 'lucide-react'
import { useState } from 'react'
import { buildings } from '../data/mock'
import type { RequestType } from '../types'
import { Button } from './ui/Button'
import { FieldLabel, Input, Select, Textarea } from './ui/Field'

export function RequestFormModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [type, setType] = useState<RequestType>('COMPLAINT')
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [buildingId, setBuildingId] = useState(buildings[0].id)
  const selected = buildings.find((b) => b.id === buildingId)!
  const canBook = type !== 'BOOKING' || selected.publicFacility

  if (step === 'success') return (
    <div className="fixed inset-0 z-[7000] grid place-items-center bg-slate-950/55 p-5 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-[0_30px_90px_rgba(11,19,35,.28)]">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 size={34}/></span>
        <span className="mt-5 inline-flex text-[10px] font-extrabold uppercase tracking-[.15em] text-teal-700">Request received</span>
        <h2 className="mt-3 font-['Manrope'] text-3xl font-extrabold tracking-[-.04em]">LGS-2026-000214</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">Your request has been created and added to your request timeline.</p>
        <div className="mt-6 grid gap-2 rounded-2xl bg-slate-50 p-4 text-left text-[12px] text-slate-600"><span className="flex items-center gap-2"><MapPin size={16}/>{selected.name}</span><span className="flex items-center gap-2"><FileText size={16}/>{type}</span></div>
        <Button className="mt-6 w-full" onClick={onCreated}>View my requests</Button>
        <button className="mt-4 text-[11px] font-extrabold text-teal-700 hover:text-teal-900" onClick={onClose}>Close</button>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-[7000] grid place-items-center overflow-y-auto bg-slate-950/55 p-5 backdrop-blur-sm" onMouseDown={(e) => { if (e.currentTarget === e.target) onClose() }}>
      <div className="my-auto w-full max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-[0_30px_90px_rgba(11,19,35,.28)]">
        <div className="flex items-start justify-between gap-6 border-b border-slate-100 p-6 sm:p-7">
          <div><span className="text-[10px] font-extrabold uppercase tracking-[.15em] text-teal-700">New municipal request</span><h2 className="mt-2 font-['Manrope'] text-2xl font-extrabold tracking-[-.035em] sm:text-3xl">Tell us what’s happening.</h2><p className="mt-2 max-w-2xl text-[12px] leading-6 text-slate-500">Attach the issue to a place so the right team starts with clear context.</p></div>
          <button className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50" onClick={onClose}><X size={18}/></button>
        </div>

        <div className="p-6 sm:p-7">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {(['COMPLAINT','SUGGESTION','INQUIRY','BOOKING'] as RequestType[]).map((item) => (
              <button key={item} onClick={() => setType(item)} className={`rounded-2xl border p-4 text-left transition ${type === item ? 'border-teal-300 bg-teal-50 shadow-[0_10px_30px_rgba(15,118,110,.08)]' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}>
                <strong className="block text-[12px] text-slate-950">{item[0] + item.slice(1).toLowerCase()}</strong>
                <small className="mt-1.5 block text-[10px] leading-5 text-slate-500">{item === 'COMPLAINT' ? 'Report a local problem' : item === 'SUGGESTION' ? 'Propose an improvement' : item === 'INQUIRY' ? 'Ask for information' : 'Reserve a public place'}</small>
              </button>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldLabel label="Mapped location" className="sm:col-span-2"><Select value={buildingId} onChange={(e) => setBuildingId(e.target.value)}>{buildings.map((b) => <option value={b.id} key={b.id}>{b.name} — {b.address}</option>)}</Select>{type === 'BOOKING' && !selected.publicFacility && <small className="text-[10px] font-bold text-amber-700">Bookings are only available for eligible public facilities.</small>}</FieldLabel>
            <FieldLabel label="Subject" className="sm:col-span-2"><Input placeholder="Short, clear summary"/></FieldLabel>
            <FieldLabel label="Description" className="sm:col-span-2"><Textarea rows={4} placeholder="Describe what you observed and any useful details…"/></FieldLabel>
            {type === 'BOOKING' && <><FieldLabel label="Booking date"><Input type="date"/></FieldLabel><FieldLabel label="Participants"><Input type="number" placeholder="45"/></FieldLabel></>}
            <FieldLabel label="Priority"><Select><option>Normal</option><option>High</option><option>Urgent</option></Select></FieldLabel>
            <FieldLabel label="Contact preference"><Select><option>Portal notifications</option><option>Email</option></Select></FieldLabel>
          </div>

          <div className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-teal-700 shadow-sm"><Camera size={21}/></span><span className="flex flex-col"><strong className="text-[12px]">Add photos or evidence</strong><small className="mt-1 text-[10px] text-slate-500">PNG, JPG or PDF · up to 5 files</small></span></div>
            <Button variant="secondary"><Paperclip size={15}/>Choose files</Button>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 border-t border-slate-100 p-6 sm:flex-row sm:items-center sm:px-7">
          <span className="flex items-center gap-2 text-[11px] font-semibold text-slate-500"><MapPin size={15}/>Pinned to {selected.id}</span>
          <Button disabled={!canBook} onClick={() => setStep('success')}><Send size={16}/>Submit request</Button>
        </div>
      </div>
    </div>
  )
}
