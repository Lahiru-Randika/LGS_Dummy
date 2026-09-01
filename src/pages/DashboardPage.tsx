import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  MapPin,
  Route,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Link } from 'react-router-dom'
import { MetricCard } from '../components/MetricCard'
import { RequestCard } from '../components/RequestCard'
import { useAuth, roleLabel } from '../context/AuthContext'
import { departmentData, requests, trendData } from '../data/mock'
import { Panel, PanelHead } from '../components/ui/Panel'

const mapButton = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-[12px] font-extrabold text-white shadow-[0_8px_22px_rgba(11,19,35,.15)] transition hover:-translate-y-0.5 hover:bg-slate-800'
const textLink = 'inline-flex items-center gap-1.5 text-[11px] font-extrabold text-teal-700 transition hover:text-teal-900'

function Welcome({ eyebrow, title, body, action, executive = false }: { eyebrow: string; title: string; body: string; action?: React.ReactNode; executive?: boolean }) {
  return <div className={`mb-7 flex flex-col justify-between gap-5 rounded-[22px] border p-6 sm:p-7 lg:flex-row lg:items-center ${executive ? 'border-slate-800 bg-slate-950 text-white' : 'border-slate-200 bg-white'}`}><div><span className={`text-[10px] font-extrabold uppercase tracking-[.15em] ${executive ? 'text-teal-300' : 'text-teal-700'}`}>{eyebrow}</span><h1 className="mt-3 font-['Manrope'] text-3xl font-extrabold tracking-[-.045em] sm:text-4xl lg:text-[46px] lg:leading-[1.02]">{title}</h1><p className={`mt-3 max-w-3xl text-sm leading-7 ${executive ? 'text-slate-300' : 'text-slate-500'}`}>{body}</p></div>{action}</div>
}

function Metrics({ children, cols = 4 }: { children: React.ReactNode; cols?: 3|4|6 }) {
  const classes = cols === 6 ? 'xl:grid-cols-6 md:grid-cols-3 sm:grid-cols-2' : cols === 3 ? 'lg:grid-cols-3 sm:grid-cols-2' : 'xl:grid-cols-4 md:grid-cols-2'
  return <div className={`mb-6 grid grid-cols-1 gap-4 ${classes}`}>{children}</div>
}

function CitizenDashboard() {
  const mine = requests.filter((r) => r.createdBy === 'u-citizen')
  return <>
    <Welcome eyebrow="Citizen workspace" title="Good afternoon, Nadeesha." body="Your local services, requests and places—kept in one clear view." action={<Link className={mapButton} to="/app/map"><MapPin size={16}/>Open civic map</Link>} />
    <Metrics><MetricCard icon={ClipboardCheck} label="My requests" value={mine.length} note="Across all service types"/><MetricCard icon={Clock3} label="Open" value={mine.filter(r => !['RESOLVED','CLOSED'].includes(r.status)).length} note="Currently being handled"/><MetricCard icon={CheckCircle2} label="Resolved" value={mine.filter(r => r.status === 'RESOLVED').length} note="Completed by the council"/><MetricCard icon={CalendarClock} label="Bookings" value={mine.filter(r => r.type === 'BOOKING').length} note="Public facilities" tone="mint"/></Metrics>
    <div className="grid gap-5 xl:grid-cols-[1.6fr_.8fr]">
      <Panel><PanelHead eyebrow="Recent activity" title="Your requests" right={<Link className={textLink} to="/app/requests">View all <ArrowRight size={14}/></Link>}/><div className="grid gap-3">{mine.slice(0,3).map(r => <RequestCard key={r.id} request={r} compact/>)}</div></Panel>
      <Panel className="self-start"><span className="text-[9px] font-extrabold uppercase tracking-[.15em] text-teal-700">Around you</span><h2 className="mt-2 font-['Manrope'] text-2xl font-extrabold">Ward 04 pulse</h2><p className="mt-2 text-[12px] leading-6 text-slate-500">What the municipality is currently seeing around your area.</p><div className="mt-5 grid gap-1">{[['bg-amber-500','Environmental','12 active'],['bg-blue-500','Utilities','7 active'],['bg-violet-500','Planning','3 active']].map(([dot,n,v]) => <div className="flex items-center justify-between border-t border-slate-100 py-3 text-[11px]" key={n}><span className="flex items-center gap-2 text-slate-600"><i className={`h-2 w-2 rounded-full ${dot}`}/>{n}</span><strong>{v}</strong></div>)}</div><Link to="/app/map" className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-[11px] font-extrabold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50"><Route size={16}/>Explore requests on map</Link></Panel>
    </div>
  </>
}

function WorkerDashboard() {
  const assigned = requests.filter((r) => r.assignedTo === 'u-worker')
  return <>
    <Welcome eyebrow="Field operations" title="Today’s field workload." body="Prioritized around what needs your attention on the ground." action={<Link className={mapButton} to="/app/map"><Route size={16}/>Open assigned map</Link>} />
    <Metrics><MetricCard icon={ClipboardCheck} label="Assigned" value={assigned.length} note="Active cases in your queue"/><MetricCard icon={Target} label="Inspecting" value={assigned.filter(r => r.status === 'INSPECTING').length} note="Field inspection underway" tone="mint"/><MetricCard icon={AlertTriangle} label="Priority" value={assigned.filter(r => ['HIGH','URGENT'].includes(r.priority)).length} note="High attention required"/><MetricCard icon={Clock3} label="Overdue" value={2} note="Needs an update today" tone="dark"/></Metrics>
    <div className="grid gap-5 xl:grid-cols-[1.6fr_.8fr]"><Panel><PanelHead eyebrow="Work queue" title="Assigned to you" right={<Link className={textLink} to="/app/requests">Full queue <ArrowRight size={14}/></Link>}/><div className="grid gap-3">{assigned.map(r => <RequestCard key={r.id} request={r} compact/>)}</div></Panel><Panel className="self-start"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 text-teal-700"><Sparkles size={22}/></span><span className="mt-5 block text-[9px] font-extrabold uppercase tracking-[.15em] text-teal-700">Field brief</span><h2 className="mt-2 font-['Manrope'] text-2xl font-extrabold">Temple Road cluster</h2><p className="mt-2 text-[12px] leading-6 text-slate-500">Two assigned issues are within a short walk of each other. Clear the waste inspection before moving to the streetlight case.</p><div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3"><div className="rounded-2xl bg-slate-50 p-4"><span className="grid h-6 w-6 place-items-center rounded-full bg-slate-950 text-[9px] font-extrabold text-white">1</span><strong className="mt-3 block text-[11px]">#000182</strong><small className="mt-1 block text-[9px] text-slate-500">Waste inspection · 120m</small></div><i className="h-px w-8 bg-slate-300"/><div className="rounded-2xl bg-slate-50 p-4"><span className="grid h-6 w-6 place-items-center rounded-full bg-slate-950 text-[9px] font-extrabold text-white">2</span><strong className="mt-3 block text-[11px]">#000197</strong><small className="mt-1 block text-[9px] text-slate-500">Streetlight · 310m</small></div></div><Link className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 text-[11px] font-extrabold transition hover:bg-slate-50" to="/app/map"><MapPin size={16}/>View route context</Link></Panel></div>
  </>
}

function AdminDashboard() {
  return <>
    <Welcome eyebrow="Municipal operations" title="Keep the service flow moving." body="See new demand, ownership gaps and the work most likely to stall." action={<Link className={mapButton} to="/app/requests"><UserCheck size={16}/>Open request queue</Link>} />
    <Metrics cols={6}><MetricCard icon={ClipboardCheck} label="New" value={42}/><MetricCard icon={Users} label="Unassigned" value={11}/><MetricCard icon={Clock3} label="In progress" value={28}/><MetricCard icon={FileCheck2} label="Approval" value={7}/><MetricCard icon={CheckCircle2} label="Resolved" value={84}/><MetricCard icon={AlertTriangle} label="Overdue" value={5} tone="dark"/></Metrics>
    <div className="grid gap-5 xl:grid-cols-[1.4fr_.8fr]"><Panel><PanelHead eyebrow="Request velocity" title="Opened vs resolved" right={<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-extrabold text-emerald-700"><TrendingUp size={15}/>+8.2%</span>}/><div className="h-[320px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trendData} margin={{top:10,right:10,left:-24,bottom:0}}><defs><linearGradient id="opened" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2563eb" stopOpacity="0.28"/><stop offset="1" stopColor="#2563eb" stopOpacity="0"/></linearGradient></defs><CartesianGrid vertical={false} stroke="#e7ecf2"/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize:11,fill:'#718096'}}/><YAxis axisLine={false} tickLine={false} tick={{fontSize:11,fill:'#94a3b8'}}/><Tooltip/><Area type="monotone" dataKey="opened" stroke="#2563eb" strokeWidth={2.4} fill="url(#opened)"/><Area type="monotone" dataKey="resolved" stroke="#0f766e" strokeWidth={2.4} fillOpacity={0}/></AreaChart></ResponsiveContainer></div></Panel><Panel><PanelHead eyebrow="Attention queue" title="Needs ownership" right={<span className="grid h-8 min-w-8 place-items-center rounded-full bg-rose-50 px-2 text-[10px] font-extrabold text-rose-700">11</span>}/><div className="grid gap-1">{requests.filter(r => !r.assignedTo).slice(0,4).map(r => <Link className="flex items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-slate-50" key={r.id} to={`/app/requests/${r.id}`}><span className={`h-2.5 w-2.5 shrink-0 rounded-full ${r.priority==='URGENT'?'bg-rose-600':r.priority==='HIGH'?'bg-orange-500':'bg-blue-500'}`}/><div className="min-w-0 flex-1"><strong className="block truncate text-[11px]">{r.title}</strong><small className="mt-1 block text-[9px] text-slate-500">{r.department} · {r.ward}</small></div><ArrowRight size={15} className="text-slate-400"/></Link>)}</div></Panel></div>
  </>
}

function ApproverDashboard() {
  const pending = requests.filter(r => r.status.includes('APPROVAL') || r.status === 'NEEDS_APPROVAL')
  return <>
    <Welcome eyebrow="Approval center" title="Decisions with context." body="Review the case, place, supporting history and operational impact before acting." action={<Link className={mapButton} to="/app/approvals"><FileCheck2 size={16}/>Review approvals</Link>} />
    <Metrics><MetricCard icon={FileCheck2} label="Awaiting decision" value={pending.length} note="Across active workflows"/><MetricCard icon={Clock3} label="Oldest waiting" value="18h" note="Within current SLA"/><MetricCard icon={CheckCircle2} label="Approved this week" value={17} note="89% decision rate" tone="mint"/><MetricCard icon={Users} label="Authorized users" value={34} note="Government accounts"/></Metrics>
    <div className="grid gap-5 xl:grid-cols-[1.6fr_.8fr]"><Panel><PanelHead eyebrow="Priority decisions" title="Awaiting your review" right={<Link className={textLink} to="/app/approvals">View all <ArrowRight size={14}/></Link>}/><div className="grid gap-3">{pending.map(r => <RequestCard key={r.id} request={r} compact/>)}</div></Panel><Panel className="self-start"><span className="text-[9px] font-extrabold uppercase tracking-[.15em] text-teal-700">Decision quality</span><h2 className="mt-2 font-['Manrope'] text-2xl font-extrabold">Approval standards</h2><p className="mt-2 text-[12px] leading-6 text-slate-500">Every decision should retain its rationale, supporting documents and who approved it.</p><div className="mt-5 grid gap-2">{['Context verified','Impact assessed','Supporting evidence present','Decision rationale recorded'].map(item => <div className="flex items-center gap-2 rounded-xl bg-emerald-50/70 p-3 text-[11px] font-bold text-emerald-800" key={item}><CheckCircle2 size={17}/>{item}</div>)}</div></Panel></div>
  </>
}

function SuperiorDashboard() {
  return <>
    <Welcome executive eyebrow="Municipal overview" title="Good afternoon, Director." body="What is happening across the municipality, and where leadership attention can have the most impact." action={<div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-[10px] font-extrabold uppercase tracking-[.12em] text-slate-300">28 AUG 2026</div>} />
    <Metrics><MetricCard icon={ClipboardCheck} label="Total requests" value="2,481" note="+12.3% vs previous period"/><MetricCard icon={CheckCircle2} label="Resolution rate" value="86.4%" note="+4.2 percentage points" tone="mint"/><MetricCard icon={Clock3} label="Open requests" value="342" note="38 high-priority cases"/><MetricCard icon={BarChart3} label="Avg. resolution" value="2.8d" note="0.6d faster this quarter" tone="dark"/></Metrics>
    <div className="grid gap-5 xl:grid-cols-[1.4fr_.8fr]"><Panel><PanelHead eyebrow="Municipal demand" title="Requests & resolutions" right={<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-extrabold text-emerald-700"><TrendingUp size={15}/>Improving</span>}/><div className="h-[360px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trendData} margin={{top:10,right:10,left:-24,bottom:0}}><defs><linearGradient id="exec" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0f766e" stopOpacity="0.25"/><stop offset="1" stopColor="#0f766e" stopOpacity="0"/></linearGradient></defs><CartesianGrid vertical={false} stroke="#e7ecf2"/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize:11,fill:'#718096'}}/><YAxis axisLine={false} tickLine={false} tick={{fontSize:11,fill:'#94a3b8'}}/><Tooltip/><Area type="monotone" dataKey="resolved" stroke="#0f766e" strokeWidth={2.6} fill="url(#exec)"/></AreaChart></ResponsiveContainer></div></Panel><Panel><PanelHead eyebrow="Service health" title="Department performance" right={<Link className={textLink} to="/app/analytics">Analytics <ArrowRight size={14}/></Link>}/><div className="grid gap-5">{departmentData.map(d => <div key={d.name}><div className="flex justify-between text-[11px]"><strong>{d.name}</strong><span className="font-extrabold text-teal-700">{d.score}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><i className="block h-full rounded-full bg-teal-700" style={{width:`${d.score}%`}}/></div><small className="mt-1.5 block text-[9px] text-slate-400">{d.open} open requests</small></div>)}</div></Panel><Panel className="xl:col-span-2"><PanelHead eyebrow="Geographic attention" title="Most reported locations"/><div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">{[['Main Street','182'],['Market Area','153'],['Central Park','117'],['Station Road','94']].map(([name,count],i)=><Link className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50" to="/app/map" key={name}><span className="text-[10px] font-extrabold text-slate-400">0{i+1}</span><strong className="flex-1 text-[12px]">{name}</strong><em className="not-italic text-[10px] text-slate-500">{count} reports</em><ArrowRight size={14}/></Link>)}</div></Panel></div>
  </>
}

export function DashboardPage() {
  const { user } = useAuth()
  if (!user) return null
  return <div className="mx-auto w-full max-w-[1540px]"><div className="mb-4"><span className="text-[9px] font-extrabold uppercase tracking-[.14em] text-slate-400">{roleLabel(user.role)}</span></div>{user.role === 'CITIZEN' ? <CitizenDashboard/> : user.role === 'GOV_WORKER' ? <WorkerDashboard/> : user.role === 'GOV_ADMIN' ? <AdminDashboard/> : user.role === 'APPROVER' ? <ApproverDashboard/> : <SuperiorDashboard/>}</div>
}
