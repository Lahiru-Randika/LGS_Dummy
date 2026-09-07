import { Activity, BarChart3, MapPinned, Timer, TrendingUp } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { MetricCard } from '../components/MetricCard'
import { PageHeader } from '../components/PageHeader'
import { analyticsService } from '../services/analytics.service'

export function AnalyticsPage(){
  const [summary,setSummary]=useState<any>({})
  const [trend,setTrend]=useState<any[]>([])
  const [departments,setDepartments]=useState<any[]>([])
  const [types,setTypes]=useState<any[]>([])
  const [hotspots,setHotspots]=useState<any[]>([])

  useEffect(()=>{
    Promise.all([
      analyticsService.summary(),
      analyticsService.trend({bucket:'day'}),
      analyticsService.departments(),
      analyticsService.byType(),
      analyticsService.hotspots(),
    ]).then(([s,t,d,bt,h])=>{setSummary(s);setTrend(t);setDepartments(d);setTypes(bt);setHotspots(h)}).catch(error=>console.error('Unable to load analytics',error))
  },[])

  const trendData=useMemo(()=>trend.map(item=>({day:String(item.period||''),opened:Number(item.created||0),resolved:Number(item.resolved||0)})),[trend])
  const departmentData=useMemo(()=>departments.slice(0,4).map(item=>({name:String(item.name||'Department'),open:Number(item.open||0),score:Number(item.total||0)>0?Math.round(Number(item.resolved||0)/Number(item.total||1)*100):0})),[departments])
  const totalTypes=types.reduce((sum,item)=>sum+Number(item.count||0),0)
  const distribution=types.map(item=>[String(item.type||''),totalTypes?`${Math.round(Number(item.count||0)/totalTypes*100)}%`:'0%'] as [string,string])
  const resolutionRate=Number(summary.total||0)>0?`${(Number(summary.resolved||0)/Number(summary.total||1)*100).toFixed(1)}%`:'0%'
  const avgDays=Number(summary.averageResolutionHours||0)/24
  const hotspot=hotspots[0]?.location||'No active hotspot'

  return <div className="page"><PageHeader eyebrow="Executive intelligence" title="Municipal analytics" description="High-level service patterns, geographic pressure and operational performance."/><div className="metrics-grid metrics-grid--4"><MetricCard icon={Activity} label="Resolution rate" value={resolutionRate} note={`${Number(summary.resolved||0)} resolved requests`} tone="mint"/><MetricCard icon={Timer} label="Median resolution" value={avgDays?`${avgDays.toFixed(1)}d`:'—'} note="Backend average resolution time"/><MetricCard icon={MapPinned} label="Hotspot wards" value={Math.min(hotspots.length,3)} note={String(hotspot)}/><MetricCard icon={TrendingUp} label="Demand change" value={trendData.length?`${trendData[trendData.length-1]?.opened||0}`:'0'} note="Requests in latest period" tone="dark"/></div><div className="analytics-layout"><section className="panel panel--wide"><div className="panel-head"><div><span className="eyebrow">Weekly throughput</span><h2>Opened and resolved requests</h2></div></div><div className="chart-wrap chart-wrap--xlarge"><ResponsiveContainer width="100%" height="100%"><BarChart data={trendData}><CartesianGrid vertical={false} stroke="#e8edf3"/><XAxis dataKey="day" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false}/><Tooltip/><Bar dataKey="opened" fill="#cbd5e1" radius={[5,5,0,0]}/><Bar dataKey="resolved" fill="#0f766e" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></div></section><section className="panel"><div className="panel-head"><div><span className="eyebrow">Department score</span><h2>Service health</h2></div></div><div className="score-cards">{departmentData.map((d,i)=><div key={d.name}><span>0{i+1}</span><div><strong>{d.name}</strong><small>{d.open} open cases</small></div><em>{d.score}%</em></div>)}</div></section><section className="panel geo-insight"><span className="eyebrow">Geographic pressure</span><h2>{String(hotspot)} is the clearest concentration.</h2><p>{hotspots[0]?`${hotspots[0].reports} reports currently identify this location as the strongest demand cluster.`:'No request hotspot data has been recorded yet.'}</p><div className="heat-art"><span className="heat heat--1"/><span className="heat heat--2"/><span className="heat heat--3"/><i className="heat-road heat-road--1"/><i className="heat-road heat-road--2"/><b>{String(hotspot).toUpperCase()}</b></div></section><section className="panel"><div className="panel-head"><div><span className="eyebrow">Request mix</span><h2>By service type</h2></div><BarChart3 size={20}/></div><div className="distribution-list">{distribution.map(([n,v])=><div key={n}><span>{n[0]+n.slice(1).toLowerCase()}</span><div><i style={{width:v}}/></div><strong>{v}</strong></div>)}</div></section></div></div>
}
