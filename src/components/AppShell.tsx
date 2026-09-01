import {
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  ClipboardCheck,
  FileCheck2,
  Home,
  LogOut,
  Map,
  Menu,
  ReceiptText,
  Users,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth, roleLabel } from '../context/AuthContext'
import type { UserRole } from '../types'
import { Brand } from './Brand'
import { NotificationsPopover } from './NotificationsPopover'
import { cn } from '../lib/cn'

type Item = { label: string; to: string; icon: typeof Home; roles?: UserRole[] }

const items: Item[] = [
  { label: 'Overview', to: '/app', icon: Home },
  { label: 'Municipal map', to: '/app/map', icon: Map },
  { label: 'Requests', to: '/app/requests', icon: ClipboardCheck },
  { label: 'Approvals', to: '/app/approvals', icon: FileCheck2, roles: ['APPROVER', 'SUPERIOR'] },
  { label: 'Analytics', to: '/app/analytics', icon: BarChart3, roles: ['SUPERIOR'] },
  { label: 'Tax', to: '/app/tax', icon: ReceiptText, roles: ['SUPERIOR'] },
  { label: 'Buildings', to: '/app/buildings', icon: Building2, roles: ['GOV_ADMIN', 'APPROVER', 'SUPERIOR'] },
  { label: 'Users', to: '/app/users', icon: Users, roles: ['APPROVER', 'SUPERIOR'] },
]

export function AppShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const visibleItems = user ? items.filter((item) => !item.roles || item.roles.includes(user.role)) : []
  if (!user) return null
  const area = user.role === 'CITIZEN' ? 'Citizen portal' : user.role === 'SUPERIOR' ? 'Executive command' : 'Government workspace'

  function doLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#f3f7f8] font-['DM_Sans'] text-slate-900 lg:grid lg:grid-cols-[294px_1fr]">
      <aside className={cn(
        'fixed inset-y-0 left-0 z-[70] flex w-[294px] flex-col bg-[#081628] text-white transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
      )}>
        <div className="flex min-h-24 items-center justify-between border-b border-white/[.06] px-6"><Brand light /><button className="grid h-10 w-10 place-items-center rounded-xl text-slate-300 hover:bg-white/10 lg:hidden" onClick={() => setMobileOpen(false)}><X size={20} /></button></div>
        <div className="mx-6 mt-6 rounded-2xl border border-white/[.08] bg-white/[.035] px-4 py-4"><span className="block text-[10px] font-extrabold uppercase tracking-[.13em] text-teal-300">{area}</span><small className="mt-1.5 block text-[11px] text-slate-400">{roleLabel(user.role)}</small></div>
        <nav className="mt-7 flex flex-col gap-1.5 px-4" aria-label="Application navigation">
          {visibleItems.map((item) => (
            <NavLink key={item.to} end={item.to === '/app'} to={item.to} onClick={() => setMobileOpen(false)} className={({ isActive }) => cn('relative flex min-h-[54px] items-center gap-3 rounded-xl px-4 text-[12px] font-bold text-slate-400 transition hover:bg-white/[.05] hover:text-white', isActive && 'bg-[#162c45] text-white before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-r-full before:bg-teal-300')}>
              <item.icon size={18} strokeWidth={1.9} className="shrink-0"/><span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/[.07] px-6 py-6">
          <div className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_7px_rgba(52,211,153,.08)]"/><div className="flex flex-col"><strong className="text-[11px]">Municipal network</strong><small className="mt-0.5 text-[9px] text-slate-500">All systems operational</small></div></div>
          <button className="mt-6 flex items-center gap-2 text-[11px] font-bold text-slate-400 transition hover:text-white" onClick={doLogout}><LogOut size={17}/>Sign out</button>
        </div>
      </aside>

      {mobileOpen && <button className="fixed inset-0 z-[60] bg-slate-950/50 backdrop-blur-sm lg:hidden" aria-label="Close menu" onClick={() => setMobileOpen(false)} />}

      <main className="min-w-0 bg-[#f3f7f8]">
        <header className="sticky top-0 z-50 flex min-h-24 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur-lg sm:px-7 lg:px-8">
          <div className="flex items-center gap-3">
            <button className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20}/></button>
            <div className="flex flex-col"><span className="text-[9px] font-extrabold uppercase tracking-[.12em] text-slate-400">LGS / {visibleItems.find((item) => item.to === location.pathname)?.label ?? 'Workspace'}</span><strong className="mt-1 text-[12px] text-slate-700">{area}</strong></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button className="relative grid h-12 w-12 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50" onClick={() => setNotificationsOpen((v) => !v)} aria-label="Notifications"><Bell size={19}/><span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-600 px-1 text-[9px] font-extrabold text-white">2</span></button>
              {notificationsOpen && <NotificationsPopover onClose={() => setNotificationsOpen(false)} />}
            </div>
            <div className="relative">
              <button className="flex min-h-14 items-center gap-3 rounded-xl border border-slate-200 bg-white px-2.5 pr-3 text-left transition hover:bg-slate-50" onClick={() => setProfileOpen((v) => !v)}>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-800 text-[11px] font-extrabold text-white">{user.avatar}</span>
                <span className="hidden flex-col sm:flex"><strong className="text-[11px] text-slate-700">{user.shortName}</strong><small className="mt-1 text-[9px] text-slate-400">{roleLabel(user.role)}</small></span><ChevronDown size={15} className="hidden text-slate-500 sm:block"/>
              </button>
              {profileOpen && <div className="absolute right-0 top-[calc(100%+10px)] z-[80] w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl"><strong className="text-[13px]">{user.name}</strong><small className="mt-1 block text-[11px] text-slate-500">{user.email}</small><hr className="my-4 border-slate-100"/><button className="flex items-center gap-2 text-[11px] font-bold text-slate-600 hover:text-slate-950" onClick={doLogout}><LogOut size={15}/>Sign out</button></div>}
            </div>
          </div>
        </header>
        <div className="min-h-[calc(100vh-96px)] p-5 sm:p-7 lg:p-8"><Outlet/></div>
      </main>
    </div>
  )
}
