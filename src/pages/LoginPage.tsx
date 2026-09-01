import { ArrowLeft, ArrowRight, Building2, Check, KeyRound, MapPinned, ShieldCheck, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { useAuth, roleLabel } from '../context/AuthContext'
import { demoUsers } from '../data/mock'

const roleIcons = { CITIZEN: UserRound, GOV_WORKER: MapPinned, GOV_ADMIN: Building2, APPROVER: ShieldCheck, SUPERIOR: KeyRound }

export function LoginPage() {
  const [selected, setSelected] = useState(demoUsers[0].id)
  const { loginAs } = useAuth()
  const navigate = useNavigate()
  const user = demoUsers.find((u) => u.id === selected)!
  function login() { loginAs(selected); navigate('/app') }

  return (
    <div className="grid min-h-screen bg-slate-950 font-['DM_Sans'] lg:grid-cols-[1.05fr_.95fr]">
      <div className="relative hidden overflow-hidden bg-[url('/lgs-media/map-full.jpg')] bg-cover bg-center p-10 text-white lg:flex lg:flex-col lg:justify-between before:absolute before:inset-0 before:bg-gradient-to-br before:from-slate-950/95 before:via-slate-950/72 before:to-teal-950/60">
        <div className="relative z-10"><Brand light/></div>
        <div className="relative z-10 max-w-2xl"><span className="text-[10px] font-extrabold uppercase tracking-[.16em] text-teal-200">Secure municipal access</span><h1 className="mt-5 font-['Manrope'] text-[clamp(52px,5.4vw,82px)] font-extrabold leading-[.9] tracking-[-.05em]">One platform.<br/><em className="not-italic text-teal-300">The right view for every role.</em></h1><p className="mt-6 max-w-xl text-sm leading-7 text-slate-300">For this frontend prototype, choose a fixed demo identity. In production, the backend—not the browser—must determine roles and permissions.</p><div className="mt-8 flex max-w-lg gap-4 rounded-2xl border border-white/15 bg-white/[.06] p-4 backdrop-blur-sm"><ShieldCheck className="shrink-0 text-teal-200"/><span><strong className="block text-[12px]">Role boundary</strong><small className="mt-1 block text-[10px] leading-5 text-slate-400">Citizens never receive private tax, owner or internal request data.</small></span></div></div>
        <Link className="relative z-10 inline-flex items-center gap-2 text-[11px] font-bold text-slate-300 hover:text-white" to="/"><ArrowLeft size={16}/>Back to LGS</Link>
      </div>
      <div className="flex items-center justify-center bg-white p-5 sm:p-8 lg:p-12">
        <div className="w-full max-w-xl">
          <div className="mb-8 flex items-center justify-between lg:hidden"><Brand/><Link className="inline-flex items-center gap-2 text-[11px] font-bold text-slate-500" to="/"><ArrowLeft size={15}/>Back</Link></div>
          <span className="text-[10px] font-extrabold uppercase tracking-[.15em] text-teal-700">Interactive prototype</span><h2 className="mt-3 font-['Manrope'] text-4xl font-extrabold tracking-[-.045em]">Choose a demo identity</h2><p className="mt-3 text-sm leading-6 text-slate-500">Each account opens a different operational experience.</p>
          <div className="mt-7 grid gap-2">{demoUsers.map((item)=>{const Icon=roleIcons[item.role];return <button key={item.id} className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${selected===item.id?'border-teal-300 bg-teal-50 shadow-[0_12px_35px_rgba(15,118,110,.08)]':'border-slate-200 bg-white hover:bg-slate-50'}`} onClick={()=>setSelected(item.id)}><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700"><Icon size={18}/></span><span className="min-w-0 flex-1"><strong className="block text-[12px]">{roleLabel(item.role)}</strong><small className="mt-1 block truncate text-[10px] text-slate-500">{item.name}{item.department?` · ${item.department}`:''}</small></span>{selected===item.id&&<i className="grid h-7 w-7 place-items-center rounded-full bg-teal-700 text-white"><Check size={14}/></i>}</button>})}</div>
          <button className="mt-7 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-[12px] font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-slate-800" onClick={login}>Continue as {roleLabel(user.role)} <ArrowRight size={17}/></button>
          <div className="mt-5 flex gap-3 rounded-xl bg-slate-50 p-4 text-[10px] leading-5 text-slate-500"><KeyRound size={15} className="mt-0.5 shrink-0 text-slate-600"/><span><strong className="text-slate-700">Prototype note</strong> Demo identities are intentionally fixed. No role-editing control is exposed to the signed-in user.</span></div>
          <small className="mt-6 block text-center text-[11px] text-slate-500">New resident? <Link className="font-extrabold text-teal-700" to="/register">Create a citizen account</Link></small>
        </div>
      </div>
    </div>
  )
}
