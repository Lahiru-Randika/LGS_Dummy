import { CheckCircle2, Layers3, ShieldCheck, Users2 } from 'lucide-react'
import { PublicFooter } from '../components/PublicFooter'
import { PublicHeader } from '../components/PublicHeader'
import { PublicInnerHero } from '../components/PublicInnerHero'
import { ScrollReveal } from '../components/ScrollReveal'

export function AboutPage() {
  return <div className="min-h-screen bg-white pt-[88px] font-['DM_Sans'] text-slate-950 max-[860px]:pt-[70px]"><PublicHeader/><main>
    <PublicInnerHero image="/lgs-media/map-center.jpg" kicker="About LGS" title={<>A municipal service platform<br/>built on geography.</>} body="LGS connects residents, field teams, administrators, approvers and leadership without turning the municipality into five separate applications."/>
    <section className="py-24 sm:py-28"><div className="mx-auto grid w-[min(1500px,calc(100%-80px))] gap-12 max-[1100px]:w-[calc(100%-48px)] max-[780px]:w-[calc(100%-32px)] lg:grid-cols-2 lg:items-center lg:gap-20"><ScrollReveal direction="left"><div className="h-[620px] overflow-hidden rounded-2xl max-sm:h-[390px]"><img className="h-full w-full object-cover" src="/lgs-media/map-center.jpg" alt="Mapped municipal landscape"/></div></ScrollReveal><ScrollReveal direction="right"><div><span className="text-[10px] font-extrabold uppercase tracking-[.17em] text-teal-700">Our approach</span><h2 className="mt-5 font-['Manrope'] text-[clamp(42px,5vw,74px)] font-extrabold leading-[.95] tracking-[-.045em]">Location is the common language.</h2><p className="mt-5 text-sm leading-7 text-slate-500">Buildings, roads, public facilities, requests, inspections and operational decisions all happen somewhere. LGS uses that location as the shared context for better public service.</p><ul className="mt-8 grid gap-3">{[[Layers3,'Real GIS and drone imagery'],[ShieldCheck,'Permission-aware public and government views'],[Users2,'Role-specific workflows on one platform'],[CheckCircle2,'Visible request history and accountability']].map(([Icon,text])=>{const C=Icon as typeof Layers3;return <li className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-[12px] font-extrabold" key={String(text)}><C size={18} className="text-teal-700"/>{String(text)}</li>})}</ul></div></ScrollReveal></div></section>
  </main><PublicFooter/></div>
}
