import { CheckCircle2, Clock3, FileCheck2, MessageSquareMore, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MetricCard } from '../components/MetricCard'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge, TypeBadge } from '../components/StatusBadge'
import { approvalsService } from '../services/approvals.service'
import { ApiError } from '../services/http'
import { requestsService } from '../services/requests.service'
import type { ApprovalItem, ServiceRequest } from '../types'

type Row = { approval: ApprovalItem; request: ServiceRequest }

export function ApprovalsPage() {
  const [rows,setRows]=useState<Row[]>([])

  async function load(){
    try{
      const result=await approvalsService.list({status:'PENDING',limit:100})
      const detailed=await Promise.all(result.items.map(async approval=>({approval,request:await requestsService.get(approval.requestCode)})))
      setRows(detailed)
    }catch(error){console.error('Unable to load approvals',error);setRows([])}
  }

  useEffect(()=>{void load()},[])

  async function decide(id:string,decision:'APPROVE'|'REJECT'|'REQUEST_INFO'){
    const rationale=window.prompt(`${decision.replaceAll('_',' ')} rationale`)?.trim()
    if(!rationale)return
    try{await approvalsService.decide(id,decision,rationale);await load()}catch(error){window.alert(error instanceof ApiError?error.message:'Unable to record the decision.')}
  }

  const pending=rows
  return <div className="page"><PageHeader eyebrow="Governance" title="Approval center" description="Review decisions with the request context, location and audit trail still attached."/><div className="metrics-grid metrics-grid--3"><MetricCard icon={FileCheck2} label="Awaiting decision" value={pending.length}/><MetricCard icon={Clock3} label="Oldest request" value={pending.length?`${Math.max(0,Math.floor((Date.now()-new Date(pending[pending.length-1].approval.createdAt).getTime())/3600000))}h`:'0h'} note="Current approval SLA: 24h"/><MetricCard icon={CheckCircle2} label="Approved this week" value="—" tone="mint"/></div><div className="approval-list">{pending.map(({approval,request:r})=><article key={approval.id} className="approval-card"><div className="approval-card__meta"><TypeBadge type={r.type}/><StatusBadge status={r.status}/></div><div className="approval-card__body"><small>{r.id} · {r.department}</small><h3>{r.title}</h3><p>{r.description}</p><div><span>{r.locationLabel}</span><span>{r.ward}</span></div></div><div className="approval-card__actions"><Link className="secondary-btn" to={`/app/requests/${r.id}`}>Review case</Link><button className="approve-icon" title="Approve" onClick={()=>void decide(approval.id,'APPROVE')}><CheckCircle2 size={18}/></button><button className="info-icon" title="Request more info" onClick={()=>void decide(approval.id,'REQUEST_INFO')}><MessageSquareMore size={18}/></button><button className="reject-icon" title="Reject" onClick={()=>void decide(approval.id,'REJECT')}><XCircle size={18}/></button></div></article>)}</div></div>
}
