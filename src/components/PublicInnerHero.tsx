import type { ReactNode } from 'react'
import { ScrollReveal } from './ScrollReveal'

export function PublicInnerHero({ image, kicker, title, body, children }: { image: string; kicker: string; title: ReactNode; body: string; children?: ReactNode }) {
  return (
    <section className="relative flex min-h-[520px] items-center overflow-hidden bg-slate-950 text-white max-sm:min-h-[430px]">
      <img className="absolute inset-0 h-full w-full object-cover saturate-75" src={image} alt="" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/60 to-slate-950/25" />
      <div className="relative z-10 mx-auto w-[min(1500px,calc(100%-80px))] max-[1100px]:w-[calc(100%-48px)] max-[780px]:w-[calc(100%-32px)]">
        <ScrollReveal>
          <div className="max-w-4xl"><span className="text-[10px] font-extrabold uppercase tracking-[.17em] text-teal-200">{kicker}</span><h1 className="mt-5 font-['Manrope'] text-[clamp(50px,6vw,96px)] font-extrabold leading-[.9] tracking-[-.05em]">{title}</h1><p className="mt-6 max-w-2xl text-sm leading-7 text-slate-300">{body}</p>{children}</div>
        </ScrollReveal>
      </div>
    </section>
  )
}
