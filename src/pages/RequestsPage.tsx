import { Filter, Plus, Search, SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { RequestCard } from '../components/RequestCard'
import { RequestFormModal } from '../components/RequestFormModal'
import { useAuth } from '../context/AuthContext'
import { requestsService } from '../services/requests.service'
import type { ServiceRequest } from '../types'

export function RequestsPage() {
  const { user } = useAuth()
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('ALL')
  const [type, setType] = useState('ALL')
  const [showNew, setShowNew] = useState(params.get('new') === '1')
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  if (!user) return null

  async function loadRequests() {
    try {
      const result = await requestsService.list({ limit: 100 })
      setRequests(result.items)
    } catch (error) {
      console.error('Unable to load requests', error)
      setRequests([])
    }
  }

  useEffect(() => { void loadRequests() }, [user.id])

  const filtered = useMemo(()=>requests.filter(r=>(status==='ALL'||r.status===status)&&(type==='ALL'||r.type===type)&&`${r.id} ${r.title} ${r.locationLabel} ${r.department}`.toLowerCase().includes(search.toLowerCase())),[requests,search,status,type])

  const title = user.role==='CITIZEN'?'My requests':user.role==='GOV_WORKER'?'Assigned requests':'Municipal request queue'
  const description = user.role==='CITIZEN'?'Track everything you have reported, suggested, asked or booked.':user.role==='GOV_WORKER'?'Your active service work and inspection queue.':'Filter, review and move service requests through the right workflow.'

  function closeModal(){setShowNew(false);params.delete('new');setParams(params,{replace:true})}

  return <div className="page"><PageHeader eyebrow="Service workflow" title={title} description={description} actions={user.role==='CITIZEN'?<button className="primary-btn" onClick={()=>setShowNew(true)}><Plus size={16}/>Create request</button>:undefined}/>
    <div className="filter-bar"><div className="search-field"><Search size={17}/><input placeholder="Search ID, issue, place or department…" value={search} onChange={e=>setSearch(e.target.value)}/></div><div className="filter-select"><Filter size={15}/><select value={type} onChange={e=>setType(e.target.value)}><option value="ALL">All types</option><option>COMPLAINT</option><option>SUGGESTION</option><option>INQUIRY</option><option>BOOKING</option></select></div><div className="filter-select"><SlidersHorizontal size={15}/><select value={status} onChange={e=>setStatus(e.target.value)}><option value="ALL">All statuses</option><option>CREATED</option><option>UNDER_REVIEW</option><option>ASSIGNED</option><option>INSPECTING</option><option>AWAITING_APPROVAL</option><option>RESOLVED</option></select></div><span className="result-count">{filtered.length} results</span></div>
    <div className="request-grid">{filtered.map(r=><RequestCard key={r.id} request={r}/>)}</div>
    {showNew&&<RequestFormModal onClose={closeModal} onCreated={()=>{closeModal();void loadRequests()}}/>}
  </div>
}
