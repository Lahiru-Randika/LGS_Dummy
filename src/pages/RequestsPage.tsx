import { Filter, Plus, Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { RequestCard } from '../components/RequestCard'
import { RequestFormModal } from '../components/RequestFormModal'
import { useAuth } from '../context/AuthContext'
import { requests } from '../data/mock'

export function RequestsPage() {
  const { user } = useAuth()
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('ALL')
  const [type, setType] = useState('ALL')
  const [showNew, setShowNew] = useState(params.get('new') === '1')
  if (!user) return null

  const base = user.role === 'CITIZEN' ? requests.filter(r=>r.createdBy===user.id) : user.role === 'GOV_WORKER' ? requests.filter(r=>r.assignedTo===user.id) : requests
  const filtered = useMemo(()=>base.filter(r=>(status==='ALL'||r.status===status)&&(type==='ALL'||r.type===type)&&`${r.id} ${r.title} ${r.locationLabel} ${r.department}`.toLowerCase().includes(search.toLowerCase())),[base,search,status,type])
  const title = user.role==='CITIZEN'?'My requests':user.role==='GOV_WORKER'?'Assigned requests':'Municipal request queue'
  const description = user.role==='CITIZEN'?'Track everything you have reported, suggested, asked or booked.':user.role==='GOV_WORKER'?'Your active service work and inspection queue.':'Filter, review and move service requests through the right workflow.'
  function closeModal(){setShowNew(false);params.delete('new');setParams(params,{replace:true})}

  return <div className="mx-auto w-full max-w-[1500px]"><PageHeader eyebrow="Service workflow" title={title} description={description} actions={user.role==='CITIZEN'?<button className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-[11px] font-extrabold text-white hover:bg-slate-800" onClick={()=>setShowNew(true)}><Plus size={16}/>Create request</button>:undefined}/>
    <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3"><div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5"><Search size={17} className="text-slate-400"/><input className="min-w-0 flex-1 bg-transparent text-[11px] outline-none" placeholder="Search ID, issue, place or department…" value={search} onChange={e=>setSearch(e.target.value)}/></div><div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2"><Filter size={15} className="text-slate-400"/><select className="bg-transparent text-[10px] font-bold outline-none" value={type} onChange={e=>setType(e.target.value)}><option value="ALL">All types</option><option>COMPLAINT</option><option>SUGGESTION</option><option>INQUIRY</option><option>BOOKING</option></select></div><div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2"><SlidersHorizontal size={15} className="text-slate-400"/><select className="bg-transparent text-[10px] font-bold outline-none" value={status} onChange={e=>setStatus(e.target.value)}><option value="ALL">All statuses</option><option>CREATED</option><option>UNDER_REVIEW</option><option>ASSIGNED</option><option>INSPECTING</option><option>AWAITING_APPROVAL</option><option>RESOLVED</option></select></div><span className="ml-auto text-[9px] font-extrabold uppercase tracking-[.1em] text-slate-400">{filtered.length} results</span></div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map(r=><RequestCard key={r.id} request={r}/>)}</div>
    {showNew&&<RequestFormModal onClose={closeModal} onCreated={()=>{closeModal()}}/>}
  </div>
}
