import { ArrowRight, LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { CivicMap } from '../components/CivicMap'

export function ExplorePage() {
  return <div className="grid h-screen grid-rows-[76px_1fr] overflow-hidden bg-slate-100 font-['DM_Sans']"><header className="z-20 flex items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-7"><Brand/><div className="flex items-center gap-2"><span className="hidden text-[10px] font-extrabold uppercase tracking-[.12em] text-slate-400 md:inline">Public map</span><Link className="hidden min-h-10 items-center rounded-xl px-3 text-[11px] font-bold text-slate-600 hover:bg-slate-100 sm:inline-flex" to="/">About LGS</Link><Link className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-[11px] font-extrabold text-white hover:bg-slate-800" to="/login"><LogIn size={16}/>Sign in</Link></div></header><div className="relative min-h-0"><CivicMap/><div className="absolute bottom-5 left-1/2 z-[1600] flex -translate-x-1/2 flex-col items-center gap-1 rounded-2xl border border-white/70 bg-white/95 px-5 py-3 text-center shadow-xl backdrop-blur-xl sm:flex-row sm:gap-3"><span className="text-[10px] text-slate-500">Want to report an issue here?</span><Link className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-teal-700" to="/login">Sign in to create a request <ArrowRight size={15}/></Link></div></div></div>
}
