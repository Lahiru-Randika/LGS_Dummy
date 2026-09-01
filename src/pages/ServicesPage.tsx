import { ArrowRight, CalendarCheck2, CircleHelp, MapPin, MessageSquareWarning, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PublicFooter } from '../components/PublicFooter'
import { PublicHeader } from '../components/PublicHeader'
import { PublicInnerHero } from '../components/PublicInnerHero'
import { ScrollReveal } from '../components/ScrollReveal'

const items = [
  [MessageSquareWarning, 'Complaints', 'Report a local issue at the exact place it occurs. Add photos, select a building or point, and keep the request traceable.'],
  [Sparkles, 'Suggestions', 'Propose improvements for streets, facilities and neighborhoods with the geographic context municipal teams need.'],
  [CircleHelp, 'Inquiries', 'Ask a location-aware question and keep the reply connected to the place, service and department involved.'],
  [CalendarCheck2, 'Public-place bookings', 'Find an eligible public facility on the map and begin a booking request without searching through separate systems.'],
]

export function ServicesPage() {
  return <div className="min-h-screen bg-white pt-[88px] font-['DM_Sans'] text-slate-950 max-[860px]:pt-[70px]"><PublicHeader/><main>
    <PublicInnerHero image="/lgs-media/map-east.jpg" kicker="Services" title={<>Local services,<br/>organized around place.</>} body="Use the municipal map to find where a service belongs, then begin the right interaction from one consistent public experience."/>
    <section className="py-24 sm:py-28"><div className="mx-auto grid w-[min(1500px,calc(100%-80px))] gap-px border border-slate-200 bg-slate-200 max-[1100px]:w-[calc(100%-48px)] max-[780px]:w-[calc(100%-32px)] lg:grid-cols-2">{items.map(([Icon,title,body],index)=>{const C=Icon as typeof MapPin;return <ScrollReveal key={String(title)} delay={index*100}><article className="flex min-h-[350px] gap-7 bg-white p-9 transition hover:bg-teal-50/40 sm:p-11"><span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-700"><C/></span><div><small className="text-[9px] font-extrabold uppercase tracking-[.15em] text-slate-400">Public service</small><h2 className="mt-3 font-['Manrope'] text-3xl font-extrabold uppercase tracking-[-.03em] sm:text-4xl">{String(title)}</h2><p className="mt-4 text-[12px] leading-6 text-slate-500">{String(body)}</p><Link className="mt-7 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.08em] text-teal-700" to="/map">Start from the map <ArrowRight size={15}/></Link></div></article></ScrollReveal>})}</div></section>
    <section className="relative min-h-[590px] overflow-hidden"><img className="absolute inset-0 h-full w-full object-cover" src="/lgs-media/map-full.jpg" alt=""/><div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-slate-950/20"/><div className="relative z-10 mx-auto flex min-h-[590px] w-[min(1500px,calc(100%-80px))] items-center text-white max-[1100px]:w-[calc(100%-48px)] max-[780px]:w-[calc(100%-32px)]"><ScrollReveal><span className="text-[10px] font-extrabold uppercase tracking-[.17em] text-teal-200">One geographic foundation</span><h2 className="mt-5 font-['Manrope'] text-[clamp(48px,5.5vw,82px)] font-extrabold leading-[.92] tracking-[-.05em]">Find the place first.<br/>Then choose the service.</h2><p className="mt-6 max-w-xl text-sm leading-7 text-slate-300">This keeps complaints, suggestions, inquiries and bookings tied to real municipal geography.</p><Link to="/map" className="mt-8 inline-flex min-h-[52px] items-center gap-2 rounded-md bg-white px-6 text-[11px] font-extrabold uppercase tracking-[.05em] text-slate-950">Explore the map <ArrowRight size={16}/></Link></ScrollReveal></div></section>
  </main><PublicFooter/></div>
}
