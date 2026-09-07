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
import { useEffect, useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Link } from 'react-router-dom'
import { MetricCard } from '../components/MetricCard'
import { RequestCard } from '../components/RequestCard'
import { roleLabel, useAuth } from '../context/AuthContext'
import { analyticsService } from '../services/analytics.service'
import { approvalsService } from '../services/approvals.service'
import { dashboardService } from '../services/dashboard.service'
import { requestsService } from '../services/requests.service'
import { usersService } from '../services/users.service'
import type { ServiceRequest, User } from '../types'
import {
  DashboardMiniMap,
} from '../components/DashboardMiniMap'

type TrendPoint={day:string;opened:number;resolved:number}
type DepartmentPoint={name:string;score:number;open:number}

function CitizenDashboard({user,requests,dashboard}:{user:User;requests:ServiceRequest[];dashboard:any}) {
  const mine = requests
  const counts=dashboard?.requestCounts||{}
  return <>
    <div className="welcome-band"><div><span className="eyebrow">Citizen workspace</span><h1>Good afternoon, {user.shortName}.</h1><p>Your local services, requests and places—kept in one clear view.</p></div><Link className="primary-btn" to="/app/map"><MapPin size={16}/>Open civic map</Link></div>
    <div className="metrics-grid metrics-grid--4"><MetricCard icon={ClipboardCheck} label="My requests" value={Number(counts.total??mine.length)} note="Across all service types"/><MetricCard icon={Clock3} label="Open" value={Number(counts.openCount??mine.filter(r => !['RESOLVED','CLOSED'].includes(r.status)).length)} note="Currently being handled"/><MetricCard icon={CheckCircle2} label="Resolved" value={Number(counts.resolvedCount??mine.filter(r => r.status === 'RESOLVED').length)} note="Completed by the council"/><MetricCard icon={CalendarClock} label="Bookings" value={Number(counts.bookings??mine.filter(r => r.type === 'BOOKING').length)} note="Public facilities" tone="mint"/></div>
    <div className="dashboard-grid dashboard-grid--citizen"><section className="panel"><div className="panel-head"><div><span className="eyebrow">Recent activity</span><h2>Your requests</h2></div><Link className="text-button" to="/app/requests">View all <ArrowRight size={14}/></Link></div><div className="request-list compact-list">{mine.slice(0,3).map(r => <RequestCard key={r.id} request={r} compact/>)}</div></section><section className="panel place-pulse"><span className="eyebrow">Around you</span><h2>{user.wardId?`Ward ${user.wardId} pulse`:'Municipal pulse'}</h2><p>What the municipality is currently seeing around your area.</p><div className="pulse-row"><span><i className="pulse-dot pulse-dot--orange"/>Environmental</span><strong>—</strong></div><div className="pulse-row"><span><i className="pulse-dot pulse-dot--blue"/>Utilities</span><strong>—</strong></div><div className="pulse-row"><span><i className="pulse-dot pulse-dot--purple"/>Planning</span><strong>—</strong></div><Link to="/app/map" className="secondary-btn full"><Route size={16}/>Explore requests on map</Link></section></div>
  </>
}

function WorkerDashboard({requests,dashboard}:{requests:ServiceRequest[];dashboard:any}) {
  const assigned = requests
  return <>
    <div className="welcome-band"><div><span className="eyebrow">Field operations</span><h1>Today’s field workload.</h1><p>Prioritized around what needs your attention on the ground.</p></div><Link className="primary-btn" to="/app/map"><Route size={16}/>Open assigned map</Link></div>
    <div className="metrics-grid metrics-grid--4"><MetricCard icon={ClipboardCheck} label="Assigned" value={Number(dashboard?.assigned??assigned.length)} note="Active cases in your queue"/><MetricCard icon={Target} label="Inspecting" value={assigned.filter(r => r.status === 'INSPECTING').length} note="Field inspection underway" tone="mint"/><MetricCard icon={AlertTriangle} label="Priority" value={Number(dashboard?.highPriority??assigned.filter(r => ['HIGH','URGENT'].includes(r.priority)).length)} note="High attention required"/><MetricCard icon={Clock3} label="Overdue" value="—" note="No overdue endpoint configured" tone="dark"/></div>
    <div className="dashboard-grid dashboard-grid--worker"><section className="panel"><div className="panel-head"><div><span className="eyebrow">Work queue</span><h2>Assigned to you</h2></div><Link className="text-button" to="/app/requests">Full queue <ArrowRight size={14}/></Link></div><div className="request-list compact-list">{assigned.map(r => <RequestCard key={r.id} request={r} compact/>)}</div></section><section className="panel field-brief"><div className="field-brief__icon"><Sparkles size={22}/></div><span className="eyebrow">Field brief</span><h2>{assigned[0]?.locationLabel||'Assigned route'}</h2><p>Your queue is ordered by server-side priority and the most recently updated municipal work.</p><div className="field-route"><div><span>1</span><strong>{assigned[0]?.id||'—'}</strong><small>{assigned[0]?.title||'No active assignment'}</small></div><i/><div><span>2</span><strong>{assigned[1]?.id||'—'}</strong><small>{assigned[1]?.title||'No second assignment'}</small></div></div><Link className="secondary-btn full" to="/app/map"><MapPin size={16}/>View route context</Link></section></div>
  </>
}

function AdminDashboard({requests,dashboard,trendData}:{requests:ServiceRequest[];dashboard:any;trendData:TrendPoint[]}) {
  const newCount=requests.filter(r=>r.status==='CREATED').length
  const inProgress=requests.filter(r=>['ASSIGNED','INSPECTION_SCHEDULED','INSPECTING','ACTION_REQUIRED','IN_PROGRESS'].includes(r.status)).length
  const unassigned=requests.filter(r=>!r.assignedTo&&!['RESOLVED','CLOSED','REJECTED','CANCELLED','DUPLICATE'].includes(r.status))
  return <>
    <div className="welcome-band"><div><span className="eyebrow">Municipal operations</span><h1>Keep the service flow moving.</h1><p>See new demand, ownership gaps and the work most likely to stall.</p></div><Link className="primary-btn" to="/app/requests"><UserCheck size={16}/>Open request queue</Link></div>
    <div className="metrics-grid metrics-grid--6"><MetricCard icon={ClipboardCheck} label="New" value={newCount}/><MetricCard icon={Users} label="Unassigned" value={Number(dashboard?.unassigned??unassigned.length)}/><MetricCard icon={Clock3} label="In progress" value={inProgress}/><MetricCard icon={FileCheck2} label="Approval" value={Number(dashboard?.awaitingApproval??0)}/><MetricCard icon={CheckCircle2} label="Resolved" value={Number(dashboard?.resolvedRequests??0)}/><MetricCard icon={AlertTriangle} label="Overdue" value="—" tone="dark"/></div>
    <div className="dashboard-grid dashboard-grid--admin"><section className="panel"><div className="panel-head"><div><span className="eyebrow">Request velocity</span><h2>Opened vs resolved</h2></div><span className="trend-positive"><TrendingUp size={15}/>Live data</span></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trendData} margin={{top:10,right:10,left:-24,bottom:0}}><defs><linearGradient id="opened" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2563eb" stopOpacity="0.28"/><stop offset="1" stopColor="#2563eb" stopOpacity="0"/></linearGradient></defs><CartesianGrid vertical={false} stroke="#e7ecf2"/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize:11,fill:'#718096'}}/><YAxis axisLine={false} tickLine={false} tick={{fontSize:11,fill:'#94a3b8'}}/><Tooltip/><Area type="monotone" dataKey="opened" stroke="#2563eb" strokeWidth={2.4} fill="url(#opened)"/><Area type="monotone" dataKey="resolved" stroke="#0f766e" strokeWidth={2.4} fillOpacity={0}/></AreaChart></ResponsiveContainer></div></section><section className="panel"><div className="panel-head"><div><span className="eyebrow">Attention queue</span><h2>Needs ownership</h2></div><span className="queue-count">{unassigned.length}</span></div><div className="attention-list">{unassigned.slice(0,4).map(r => <Link key={r.id} to={`/app/requests/${r.id}`}><span className={`attention-dot attention-dot--${r.priority.toLowerCase()}`}/><div><strong>{r.title}</strong><small>{r.department} · {r.ward}</small></div><ArrowRight size={15}/></Link>)}</div></section></div>
  </>
}

function ApproverDashboard({requests,dashboard,userCount}:{requests:ServiceRequest[];dashboard:any;userCount:number}) {
  const pending = requests.filter(r => r.status.includes('APPROVAL') || r.status === 'NEEDS_APPROVAL')
  return <>
    <div className="welcome-band"><div><span className="eyebrow">Approval center</span><h1>Decisions with context.</h1><p>Review the case, place, supporting history and operational impact before acting.</p></div><Link className="primary-btn" to="/app/approvals"><FileCheck2 size={16}/>Review approvals</Link></div>
    <div className="metrics-grid metrics-grid--4"><MetricCard icon={FileCheck2} label="Awaiting decision" value={Number(dashboard?.awaitingDecision??pending.length)} note="Across active workflows"/><MetricCard icon={Clock3} label="Oldest waiting" value={`${Number(dashboard?.oldestWaitingHours??0)}h`} note="Within current SLA"/><MetricCard icon={CheckCircle2} label="Approved this week" value={Number(dashboard?.approvedThisWeek??0)} note="Recorded by backend" tone="mint"/><MetricCard icon={Users} label="Authorized users" value={userCount} note="Government accounts"/></div>
    <div className="dashboard-grid dashboard-grid--citizen"><section className="panel"><div className="panel-head"><div><span className="eyebrow">Priority decisions</span><h2>Awaiting your review</h2></div><Link className="text-button" to="/app/approvals">View all <ArrowRight size={14}/></Link></div><div className="request-list compact-list">{pending.map(r => <RequestCard key={r.id} request={r} compact/>)}</div></section><section className="panel decision-standards"><span className="eyebrow">Decision quality</span><h2>Approval standards</h2><p>Every decision should retain its rationale, supporting documents and who approved it.</p>{['Context verified','Impact assessed','Supporting evidence present','Decision rationale recorded'].map(item => <div className="standard-row" key={item}><CheckCircle2 size={17}/>{item}</div>)}</section></div>
  </>
}

function SuperiorDashboard({
  dashboard,
  summary,
  trendData,
  departmentData,
  hotspots,
}: {
  dashboard:
    any

  summary:
    any

  trendData:
    TrendPoint[]

  departmentData:
    DepartmentPoint[]

  hotspots:
    any[]

}) {
  const total =
    Number(
      dashboard?.totalRequests ??
      summary?.total ??
      0,
    )

  const resolved =
    Number(
      dashboard?.resolvedRequests ??
      summary?.resolved ??
      0,
    )

  const resolution =
    total
      ? `${(
          resolved /
          total *
          100
        ).toFixed(
          1,
        )}%`
      : '0%'

  const avgDays =
    Number(
      summary?.averageResolutionHours ||
      0,
    ) /
    24

  const date =
    new Date()
      .toLocaleDateString(
        'en-US',
        {
          day:
            '2-digit',

          month:
            'short',

          year:
            'numeric',
        },
      )
      .toUpperCase()

  return (
    <>
      {/* ===================================================
          WELCOME
      ==================================================== */}

      <div
        className="welcome-band welcome-band--executive"
      >
        <div>
          <span
            className="eyebrow"
          >
            Municipal overview
          </span>

          <h1>
            Good afternoon, Director.
          </h1>

          <p>
            What is happening across the municipality, and where leadership attention can have the most impact.
          </p>
        </div>

        <div
          className="executive-date"
        >
          {date}
        </div>
      </div>

      {/* ===================================================
          METRICS
      ==================================================== */}

      <div
        className="metrics-grid metrics-grid--4"
      >
        <MetricCard
          icon={
            ClipboardCheck
          }
          label="Total requests"
          value={
            total.toLocaleString()
          }
          note="All recorded service requests"
        />

        <MetricCard
          icon={
            CheckCircle2
          }
          label="Resolution rate"
          value={
            resolution
          }
          note={`${resolved.toLocaleString()} resolved`}
          tone="mint"
        />

        <MetricCard
          icon={
            Clock3
          }
          label="Open requests"
          value={Number(
            dashboard?.openRequests ??
            summary?.open ??
            0,
          ).toLocaleString()}
          note="Currently active cases"
        />

        <MetricCard
          icon={
            BarChart3
          }
          label="Avg. resolution"
          value={
            avgDays
              ? `${avgDays.toFixed(
                  1,
                )}d`
              : '—'
          }
          note="Based on resolved requests"
          tone="dark"
        />
      </div>

      {/* ===================================================
          TOP ROW

          MAP + DEPARTMENT PERFORMANCE
      ==================================================== */}

      <div
        className="
          mt-5
          grid
          grid-cols-1
          gap-5

          xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]
        "
      >
        {/* MAP */}

        <section
          className="panel overflow-hidden"
        >
          <div
            className="panel-head"
          >
            <div>
              <span
                className="eyebrow"
              >
                Municipal geography
              </span>

              <h2>
                Live request map
              </h2>
            </div>

            <span
              className="trend-positive"
            >
              <MapPin
                size={
                  15
                }
              />

              Live data
            </span>
          </div>

          <div
            className="mt-3"
          >
            <DashboardMiniMap />
          </div>
        </section>

        {/* DEPARTMENT PERFORMANCE */}

        <section
          className="panel"
        >
          <div
            className="panel-head"
          >
            <div>
              <span
                className="eyebrow"
              >
                Service health
              </span>

              <h2>
                Department performance
              </h2>
            </div>

            <Link
              className="text-button"
              to="/app/analytics"
            >
              Analytics

              <ArrowRight
                size={
                  14
                }
              />
            </Link>
          </div>

          <div
            className="department-list"
          >
            {departmentData.map(
              (
                department,
              ) => (
                <div
                  key={
                    department.name
                  }
                >
                  <div>
                    <strong>
                      {
                        department.name
                      }
                    </strong>

                    <span>
                      {
                        department.score
                      }
                      %
                    </span>
                  </div>

                  <div
                    className="progress"
                  >
                    <i
                      style={{
                        width:
                          `${department.score}%`,
                      }}
                    />
                  </div>

                  <small>
                    {
                      department.open
                    }{' '}
                    open requests
                  </small>
                </div>
              ),
            )}
          </div>
        </section>
      </div>

      {/* ===================================================
          BOTTOM ROW

          REQUESTS & RESOLUTIONS
          +
          MOST REPORTED LOCATIONS
      ==================================================== */}

      <div
        className="
          mt-5
          grid
          grid-cols-1
          gap-5

          xl:grid-cols-2
        "
      >
        {/* REQUESTS & RESOLUTIONS */}

        <section
          className="panel"
        >
          <div
            className="panel-head"
          >
            <div>
              <span
                className="eyebrow"
              >
                Municipal demand
              </span>

              <h2>
                Requests & resolutions
              </h2>
            </div>

            <span
              className="trend-positive"
            >
              <TrendingUp
                size={
                  15
                }
              />

              Live data
            </span>
          </div>

          <div
            className="chart-wrap"
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={
                  trendData
                }
                margin={{
                  top:
                    10,

                  right:
                    10,

                  left:
                    -24,

                  bottom:
                    0,
                }}
              >
                <defs>
                  <linearGradient
                    id="exec"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0"
                      stopColor="#0f766e"
                      stopOpacity={
                        0.25
                      }
                    />

                    <stop
                      offset="1"
                      stopColor="#0f766e"
                      stopOpacity={
                        0
                      }
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  vertical={
                    false
                  }
                  stroke="#e7ecf2"
                />

                <XAxis
                  dataKey="day"
                  axisLine={
                    false
                  }
                  tickLine={
                    false
                  }
                  tick={{
                    fontSize:
                      11,

                    fill:
                      '#718096',
                  }}
                />

                <YAxis
                  axisLine={
                    false
                  }
                  tickLine={
                    false
                  }
                  tick={{
                    fontSize:
                      11,

                    fill:
                      '#94a3b8',
                  }}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="resolved"
                  stroke="#0f766e"
                  strokeWidth={
                    2.6
                  }
                  fill="url(#exec)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* MOST REPORTED LOCATIONS */}

        <section className="panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">
                Geographic attention
              </span>

              <h2>
                Most reported locations
              </h2>
            </div>

            <Link
              to="/app/map"
              className="text-button"
            >
              View map
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {hotspots
              .slice(0, 4)
              .map((item, index) => {
                const reports = Number(item.reports || 0)

                return (
                  <Link
                    to="/app/map"
                    key={`${item.location}-${index}`}
                    className="
                      group
                      grid
                      grid-cols-[42px_minmax(0,1fr)_auto]
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-slate-100
                      bg-slate-50/70
                      px-3.5
                      py-3
                      transition
                      hover:border-teal-200
                      hover:bg-teal-50/50
                    "
                  >
                    <span
                      className="
                        grid
                        h-9
                        w-9
                        place-items-center
                        rounded-lg
                        bg-white
                        text-[10px]
                        font-extrabold
                        text-slate-400
                        shadow-sm
                      "
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div className="min-w-0">
                      <strong
                        className="
                          block
                          truncate
                          text-[11px]
                          font-extrabold
                          text-slate-800
                        "
                      >
                        {String(item.location || 'Unknown location')}
                      </strong>

                      <span className="mt-0.5 block text-[9px] text-slate-400">
                        {reports} {reports === 1 ? 'report' : 'reports'}
                      </span>
                    </div>

                    <span
                      className="
                        grid
                        h-8
                        w-8
                        place-items-center
                        rounded-lg
                        text-slate-400
                        transition
                        group-hover:bg-white
                        group-hover:text-teal-700
                      "
                    >
                      <ArrowRight size={14} />
                    </span>
                  </Link>
                )
              })}

            {hotspots.length === 0 && (
              <div
                className="
                  flex
                  min-h-[150px]
                  flex-col
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-dashed
                  border-slate-200
                  text-center
                "
              >
                <MapPin
                  size={20}
                  className="text-slate-300"
                />

                <strong className="mt-2 text-[10px] text-slate-600">
                  No hotspot data yet
                </strong>

                <span className="mt-1 text-[9px] text-slate-400">
                  Reported locations will appear here.
                </span>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export function DashboardPage() {
  const { user } = useAuth()
  const [dashboard,setDashboard]=useState<any>({})
  const [requests,setRequests]=useState<ServiceRequest[]>([])
  const [trendRaw,setTrendRaw]=useState<any[]>([])
  const [departmentRaw,setDepartmentRaw]=useState<any[]>([])
  const [hotspots,setHotspots]=useState<any[]>([])
  const [summary,setSummary]=useState<any>({})
  const [userCount,setUserCount]=useState(0)

  useEffect(()=>{
    if(!user)return
    dashboardService.get().then(setDashboard).catch(error=>console.error('Dashboard API failed',error))
    requestsService.list({limit:100}).then(result=>setRequests(result.items)).catch(error=>console.error('Request list failed',error))
    if(['GOV_ADMIN','SUPERIOR'].includes(user.role)){
      analyticsService.trend({bucket:'day'}).then(setTrendRaw).catch(()=>setTrendRaw([]))
      analyticsService.departments().then(setDepartmentRaw).catch(()=>setDepartmentRaw([]))
      analyticsService.hotspots().then(setHotspots).catch(()=>setHotspots([]))
      analyticsService.summary().then(setSummary).catch(()=>setSummary({}))
    }
    if(user.role==='APPROVER'){
      approvalsService.list({status:'PENDING',limit:100}).catch(()=>({items:[]}))
      usersService.list({limit:1}).then(result=>setUserCount(result.meta?.total??result.items.length)).catch(()=>setUserCount(0))
    }
  },[user?.id,user?.role])

  const trendData=useMemo(()=>trendRaw.map(item=>({day:String(item.period||''),opened:Number(item.created||0),resolved:Number(item.resolved||0)})),[trendRaw])
  const departmentData=useMemo(()=>departmentRaw.slice(0,6).map(item=>({name:String(item.name||'Department'),open:Number(item.open||0),score:Number(item.total||0)>0?Math.round(Number(item.resolved||0)/Number(item.total||1)*100):0})),[departmentRaw])

  if (!user) return null
  return <div className="page dashboard-page"><div className="page-role-strip"><span className="eyebrow">{roleLabel(user.role)}</span></div>{user.role === 'CITIZEN' ? <CitizenDashboard user={user} requests={requests} dashboard={dashboard}/> : user.role === 'GOV_WORKER' ? <WorkerDashboard requests={requests} dashboard={dashboard}/> : user.role === 'GOV_ADMIN' ? <AdminDashboard requests={requests} dashboard={dashboard} trendData={trendData}/> : user.role === 'APPROVER' ? <ApproverDashboard requests={requests} dashboard={dashboard} userCount={userCount}/> : 
  <SuperiorDashboard
    dashboard={
      dashboard
    }
    summary={
      summary
    }
    trendData={
      trendData
    }
    departmentData={
      departmentData
    }
    hotspots={
      hotspots
    }
  />}</div>
}