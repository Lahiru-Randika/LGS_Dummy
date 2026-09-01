import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Brand } from './Brand'

export function PublicFooter() {
  const link = 'text-[12px] font-semibold text-slate-400 transition hover:text-white'
  return (
    <footer className="bg-[#071522] text-white">
      <div className="mx-auto grid w-[min(1500px,calc(100%-80px))] grid-cols-[1.6fr_.75fr_.75fr_1.15fr] gap-14 py-16 max-[1100px]:grid-cols-[1.5fr_1fr_1fr] max-[780px]:w-[calc(100%-32px)] max-[780px]:grid-cols-2 max-[480px]:grid-cols-1">
        <div className="max-[780px]:col-span-2 max-[480px]:col-span-1"><Brand light /><p className="mt-6 max-w-md text-[13px] leading-7 text-slate-400">A location-aware civic platform connecting residents, services, field teams and local government through one shared municipal map.</p></div>
        <div className="flex flex-col gap-3"><strong className="mb-1 text-[10px] uppercase tracking-[.15em]">Explore</strong><Link className={link} to="/map">Municipal map</Link><Link className={link} to="/services">Services</Link><Link className={link} to="/news">Notices & news</Link></div>
        <div className="flex flex-col gap-3"><strong className="mb-1 text-[10px] uppercase tracking-[.15em]">LGS</strong><Link className={link} to="/about">About</Link><Link className={link} to="/contact">Contact</Link><Link className={link} to="/login">Government portal</Link></div>
        <div className="flex flex-col gap-3 max-[1100px]:col-start-2 max-[1100px]:col-end-4 max-[780px]:col-span-2 max-[480px]:col-span-1"><strong className="mb-1 text-[10px] uppercase tracking-[.15em]">Connect</strong><span className="flex items-center gap-2 text-[12px] text-slate-400"><MapPin size={15}/> Weddemulla, Sri Lanka</span><span className="flex items-center gap-2 text-[12px] text-slate-400"><Phone size={15}/> +94 11 000 0000</span><span className="flex items-center gap-2 text-[12px] text-slate-400"><Mail size={15}/> hello@lgs.example</span></div>
      </div>
      <div className="border-t border-white/10"><div className="mx-auto flex min-h-20 w-[min(1500px,calc(100%-80px))] items-center justify-between gap-5 text-[10px] font-bold uppercase tracking-[.1em] text-slate-500 max-[780px]:w-[calc(100%-32px)] max-[780px]:flex-col max-[780px]:items-start max-[780px]:justify-center"><span>© 2026 LGS — Local Government Systems</span><Link className="flex items-center gap-2 text-slate-300 hover:text-white" to="/map">Open civic map <ArrowUpRight size={14}/></Link></div></div>
    </footer>
  )
}
