import { ArrowRight } from 'lucide-react'
import { PublicFooter } from '../components/PublicFooter'
import { PublicHeader } from '../components/PublicHeader'
import { PublicInnerHero } from '../components/PublicInnerHero'
import { ScrollReveal } from '../components/ScrollReveal'

const stories = [
  ['Municipal services', 'Mapped service requests create a clearer field-work picture', '/lgs-media/map-west.jpg'],
  ['Public access', 'A location-first way to discover buildings and facilities', '/lgs-media/map-center.jpg'],
  ['Operations', 'Why assignment works better when geography and workload are visible together', '/lgs-media/map-east.jpg'],
  ['Platform', 'Keeping public-safe and sensitive municipal information separate', '/lgs-media/map-south.jpg'],
]

export function NewsPage(){return <div className="min-h-screen bg-white pt-[88px] font-['DM_Sans'] text-slate-950 max-[860px]:pt-[70px]"><PublicHeader/><main><PublicInnerHero image="/lgs-media/map-west.jpg" kicker="News & notices" title={<>What is happening<br/>across the municipality.</>} body="Public notices, service updates and stories from the LGS platform."/><section className="py-24 sm:py-28"><div className="mx-auto grid w-[min(1500px,calc(100%-80px))] gap-x-8 gap-y-14 max-[1100px]:w-[calc(100%-48px)] max-[780px]:w-[calc(100%-32px)] lg:grid-cols-2">{stories.map(([storyKicker,title,image],i)=><ScrollReveal key={title} delay={i*90}><article className="group"><div className="h-[330px] overflow-hidden rounded-2xl"><img className="h-full w-full object-cover transition duration-700 group-hover:scale-105" src={image} alt=""/></div><div className="px-2 pt-6"><small className="text-[9px] font-extrabold uppercase tracking-[.15em] text-slate-400">{storyKicker}</small><h2 className="mt-3 font-['Manrope'] text-3xl font-extrabold leading-[1.02] tracking-[-.035em]">{title}</h2><p className="mt-4 text-[12px] leading-6 text-slate-500">Location-aware services help the municipality connect public reports, field action and local information in one spatial workflow.</p><button className="mt-6 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.08em] text-teal-700">Read story <ArrowRight size={14}/></button></div></article></ScrollReveal>)}</div></section></main><PublicFooter/></div>}
