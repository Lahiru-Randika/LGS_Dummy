import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Brand } from './Brand'
import { cn } from '../lib/cn'

export function PublicHeader({ overlay = false }: { overlay?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const dark = overlay && !scrolled
  const linkClass = ({ isActive }: { isActive: boolean }) => cn(
    'relative inline-flex h-full items-center px-0.5 text-[12px] font-extrabold transition after:absolute after:bottom-0 after:left-1/2 after:h-[3px] after:-translate-x-1/2 after:bg-teal-400 after:transition-all',
    dark || scrolled ? 'text-white' : 'text-slate-600',
    isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full',
  )

  return (
    <header className={cn(
      'fixed inset-x-0 top-0 z-[5000] h-[88px] border-b transition-all duration-300',
      dark ? 'border-white/15 bg-transparent' : scrolled ? 'h-[74px] border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-xl' : 'border-slate-200 bg-white/95 backdrop-blur-lg',
    )}>
      <div className="mx-auto grid h-full w-[min(1500px,calc(100%-80px))] grid-cols-[minmax(220px,1fr)_auto_minmax(260px,1fr)] items-center gap-10 max-[1180px]:w-[calc(100%-40px)] max-[1180px]:grid-cols-[auto_1fr_auto] max-[860px]:flex max-[860px]:w-[calc(100%-28px)] max-[860px]:gap-3">
        <Brand light={dark || scrolled} />
        <nav className={cn(
          'flex h-full items-center justify-center gap-[clamp(26px,3vw,52px)] max-[1180px]:gap-5',
          'max-[860px]:fixed max-[860px]:left-3.5 max-[860px]:right-3.5 max-[860px]:top-[70px] max-[860px]:z-[5100] max-[860px]:h-auto max-[860px]:flex-col max-[860px]:items-stretch max-[860px]:gap-0 max-[860px]:rounded-2xl max-[860px]:border max-[860px]:border-white/10 max-[860px]:bg-slate-950/98 max-[860px]:p-2.5 max-[860px]:shadow-2xl max-[860px]:backdrop-blur-xl',
          open ? 'max-[860px]:flex' : 'max-[860px]:hidden',
        )} aria-label="Public navigation">
          {[
            ['/', 'Home'], ['/about', 'About'], ['/services', 'Services'], ['/news', 'News'], ['/contact', 'Contact'],
          ].map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)} className={linkClass}>{label}</NavLink>)}
        </nav>
        <div className="flex items-center justify-end gap-3 max-[860px]:ml-auto">
          <Link to="/map" className={cn('inline-flex h-11 items-center justify-center rounded-md border px-5 text-[11px] font-extrabold uppercase tracking-[.04em] transition max-[1180px]:hidden', dark || scrolled ? 'border-white/40 text-white hover:bg-white/10' : 'border-slate-300 text-slate-700 hover:bg-slate-50')}>Explore map</Link>
          <Link to="/login" className="inline-flex h-11 items-center justify-center rounded-md border border-teal-300 bg-teal-300 px-5 text-[11px] font-extrabold uppercase tracking-[.04em] text-slate-950 transition hover:-translate-y-0.5 hover:bg-white max-[480px]:hidden">Sign in</Link>
          <button className={cn('hidden h-11 w-11 items-center justify-center rounded-xl max-[860px]:inline-flex', dark || scrolled ? 'text-white' : 'text-slate-700')} onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  )
}
