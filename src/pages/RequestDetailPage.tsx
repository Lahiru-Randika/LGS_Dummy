import {
  ArrowLeft,
  Camera,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  LoaderCircle,
  MapPin,
  MessageSquarePlus,
  Navigation,
  Search,
  Send,
  UserRound,
  UsersRound,
  X,
  XCircle,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { StatusBadge, TypeBadge } from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'
import { approvalsService } from '../services/approvals.service'
import { buildingsService } from '../services/buildings.service'
import { ApiError } from '../services/http'
import { inspectionsService } from '../services/inspections.service'
import { requestsService } from '../services/requests.service'
import { usersService } from '../services/users.service'
import type { Building, ServiceRequest } from '../types'

type WorkerOption = Awaited<ReturnType<typeof usersService.workers>>[number]

function browserPosition() {
  return new Promise<{
    latitude: number
    longitude: number
  }>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(
        new Error(
          'Location services are not available in this browser.',
        ),
      )
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),

      () =>
        reject(
          new Error(
            'Allow location access to check in at the site.',
          ),
        ),

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000,
      },
    )
  })
}

function workerInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function shortId(id: string) {
  return id.length > 18 ? `${id.slice(0, 8)}…${id.slice(-6)}` : id
}

export function RequestDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, can } = useAuth()

  const [request, setRequest] = useState<ServiceRequest | null>(null)
  const [building, setBuilding] = useState<Building | undefined>()
  const [loading, setLoading] = useState(true)

  const [assignOpen, setAssignOpen] = useState(false)
  const [workers, setWorkers] = useState<WorkerOption[]>([])
  const [workersLoading, setWorkersLoading] = useState(false)
  const [workerSearch, setWorkerSearch] = useState('')
  const [selectedWorkerId, setSelectedWorkerId] = useState('')
  const [assigning, setAssigning] = useState(false)
  const [assignError, setAssignError] = useState('')

  const evidenceInput = useRef<HTMLInputElement>(null)
  const workerSearchInput = useRef<HTMLInputElement>(null)

  async function load() {
    if (!id) return

    setLoading(true)

    try {
      const item = await requestsService.get(id)
      setRequest(item)

      if (item.buildingId) {
        try {
          const b = can('building.sensitive.read')
            ? await buildingsService.get(item.buildingId)
            : await buildingsService.publicGet(item.buildingId)

          setBuilding(b)
        } catch {
          setBuilding(undefined)
        }
      } else {
        setBuilding(undefined)
      }
    } catch (error) {
      console.error('Unable to load request', error)
      setRequest(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [id])

  useEffect(() => {
    if (!assignOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !assigning) {
        setAssignOpen(false)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    window.setTimeout(() => workerSearchInput.current?.focus(), 50)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [assignOpen, assigning])

  function explain(error: unknown) {
    window.alert(
      error instanceof ApiError
        ? error.message
        : error instanceof Error
          ? error.message
          : 'The operation could not be completed.',
    )
  }

  async function startInspection() {
    if (!request) return

    try {
      let inspectionId =
        request.inspection?.id

      /*
        Create a new inspection when:
        - one does not exist
        - previous inspection was completed
        - previous inspection was cancelled
      */
      if (
        !inspectionId ||
        request.inspection?.status === 'COMPLETED' ||
        request.inspection?.status === 'CANCELLED'
      ) {
        inspectionId = (
          await inspectionsService.create(
            request.id,
          )
        ).id
      }

      /*
        Starting an inspection does NOT request GPS.
      */
      if (
        request.inspection?.status !== 'IN_PROGRESS'
      ) {
        await inspectionsService.update(
          inspectionId,
          {
            status: 'IN_PROGRESS',
          },
        )
      }

      await load()
    } catch (error) {
      explain(error)
    }
  }

  async function checkInAtSite() {
    if (!request) return

    try {
      /*
        GPS permission is requested only here.
      */
      const position =
        await browserPosition()

      let inspectionId =
        request.inspection?.id

      /*
        If the officer has not started an inspection yet,
        checking in can create one automatically.
      */
      if (
        !inspectionId ||
        request.inspection?.status === 'COMPLETED' ||
        request.inspection?.status === 'CANCELLED'
      ) {
        inspectionId = (
          await inspectionsService.create(
            request.id,
          )
        ).id
      }

      /*
        Save officer's actual current location.

        Also move inspection to IN_PROGRESS if needed.
      */
      await inspectionsService.update(
        inspectionId,
        {
          status: 'IN_PROGRESS',
          latitude:
            position.latitude,
          longitude:
            position.longitude,
        },
      )

      await load()
    } catch (error) {
      explain(error)
    }
  }

  async function addInspectionNote() {
    if (!request) return

    const note = window.prompt('Inspection note')?.trim()
    if (!note) return

    try {
      await requestsService.addNote(request.id, note, 'INTERNAL')
      await load()
    } catch (error) {
      explain(error)
    }
  }

  async function openAssignModal() {
    if (!request) return

    setAssignOpen(true)
    setWorkerSearch('')
    setSelectedWorkerId('')
    setAssignError('')
    setWorkersLoading(true)

    try {
      /*
        This endpoint already returns active GOV_WORKER accounts,
        so the popup does not expose citizens/admins/approvers.
      */
      const result = await usersService.workers()
      setWorkers(result)

      if (!result.length) {
        setAssignError('No active government workers are available.')
      }
    } catch (error) {
      setWorkers([])
      setAssignError(
        error instanceof ApiError
          ? error.message
          : 'Unable to load available workers.',
      )
    } finally {
      setWorkersLoading(false)
    }
  }

  async function confirmAssignment() {
    if (!request || !selectedWorkerId) return

    const worker = workers.find((item) => item.id === selectedWorkerId)

    if (!worker) {
      setAssignError('Please select a valid worker.')
      return
    }

    setAssignError('')
    setAssigning(true)

    try {
      await requestsService.assign(request.id, {
        assignedToUserId: worker.id,
        departmentId: worker.departmentId ?? null,
        version: request.version,
      })

      setAssignOpen(false)
      await load()
    } catch (error) {
      setAssignError(
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Unable to assign this request.',
      )
    } finally {
      setAssigning(false)
    }
  }

  async function submitApproval() {
    if (!request) return

    const justification = window
      .prompt('Why does this request require approval?')
      ?.trim()

    if (!justification) return

    try {
      await approvalsService.submit(request.id, {
        approvalType: request.type === 'BOOKING' ? 'BOOKING' : 'REQUEST_ACTION',
        requestedAction: `Approve municipal action for ${request.id}`,
        justification,
      })

      await load()
    } catch (error) {
      explain(error)
    }
  }

  async function decide(decision: 'APPROVE' | 'REJECT' | 'REQUEST_INFO') {
    if (!request?.approval?.id) {
      window.alert('No active approval record is attached to this request.')
      return
    }

    const rationale = window
      .prompt(`${decision.replaceAll('_', ' ')} rationale`)
      ?.trim()

    if (!rationale) return

    try {
      await approvalsService.decide(request.approval.id, decision, rationale)
      await load()
    } catch (error) {
      explain(error)
    }
  }

  async function uploadEvidence(files: FileList | null) {
    if (!request || !files?.length) return

    try {
      await requestsService.addAttachments(
        request.id,
        Array.from(files).slice(0, 5),
        'EVIDENCE',
        user?.role === 'CITIZEN' ? 'CITIZEN_VISIBLE' : 'INTERNAL',
      )

      await load()
    } catch (error) {
      explain(error)
    }
  }

  const filteredWorkers = useMemo(() => {
    const query = workerSearch.trim().toLowerCase()

    const matches = !query
      ? workers
      : workers.filter((worker) =>
          `${worker.name} ${worker.id} ${worker.departmentId ?? ''}`
            .toLowerCase()
            .includes(query),
        )

    /*
      If the current assigned officer is returned by the worker endpoint,
      keep them near the top of the list.
    */
    return [...matches].sort((a, b) => {
      const aCurrent = request?.assignedToName === a.name ? 1 : 0
      const bCurrent = request?.assignedToName === b.name ? 1 : 0
      return bCurrent - aCurrent || a.name.localeCompare(b.name)
    })
  }, [workers, workerSearch, request?.assignedToName])

  if (loading) {
    return <div className="page" />
  }

  if (!request || !user) {
    return (
      <div className="page">
        <div className="not-found-card">
          <h2>Request not found</h2>
          <button
            className="secondary-btn"
            onClick={() => navigate('/app/requests')}
          >
            Back to requests
          </button>
        </div>
      </div>
    )
  }

  const canOperate =
    user.role === 'GOV_WORKER' ||
    user.role === 'GOV_ADMIN'

  const canApprove =
    user.role === 'APPROVER' ||
    user.role === 'SUPERIOR'

  const selectedWorker = workers.find(
    (worker) => worker.id === selectedWorkerId,
  )

  return (
    <>
      <div className="page">
        <button
          className="back-link"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <div className="request-detail-head">
          <div>
            <div className="badge-row">
              <TypeBadge type={request.type} />
              <StatusBadge status={request.status} />
            </div>

            <span className="request-detail-id">
              {request.id}
            </span>

            <h1>{request.title}</h1>
            <p>{request.description}</p>
          </div>

          <div className="request-priority-card">
            <small>Priority</small>
            <strong>{request.priority}</strong>
            <span>
              Last updated
              <br />
              {new Date(request.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="request-detail-layout">
          <main className="request-main">
            <section className="panel">
              <div className="panel-head">
                <div>
                  <span className="eyebrow">
                    Status history
                  </span>

                  <h2>Request timeline</h2>
                </div>
              </div>

              <div className="timeline">
                {request.history.map((event, index) => (
                  <div
                    className="timeline-item"
                    key={`${event.status}-${index}`}
                  >
                    <span className="timeline-mark">
                      <Check size={13} />
                    </span>

                    <div>
                      <StatusBadge status={event.status} />
                      <strong>{event.label}</strong>
                      <p>{event.note}</p>
                      <small>
                        {event.at} · {event.by}
                      </small>
                    </div>

                    {index < request.history.length - 1 && <i />}
                  </div>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="panel-head">
                <div>
                  <span className="eyebrow">
                    Evidence
                  </span>

                  <h2>Photos & documents</h2>
                </div>
              </div>

              <div className="evidence-grid">
                {request.photos.length ? (
                  request.photos.map((photo, index) => (
                    <div
                      className="evidence-card"
                      key={`${photo}-${index}`}
                    >
                      <Camera size={22} />

                      <span>
                        <strong>{photo}</strong>
                        <small>
                          Evidence file {index + 1}
                        </small>
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="empty-evidence">
                    <FileText size={22} />
                    <span>No evidence files attached</span>
                  </div>
                )}
              </div>
            </section>
          </main>

          <aside className="request-side">
            <section className="panel detail-summary">
              <span className="eyebrow">Location</span>
              <h3>{request.locationLabel}</h3>

              <p>
                <MapPin size={15} />
                {request.ward}
              </p>

              {building && (
                <div className="location-card">
                  <strong>{building.name}</strong>
                  <small>{building.address}</small>
                  <span>{building.id}</span>
                </div>
              )}

              {(() => {
                /*
                  Request coordinates should normally be available because
                  service_requests stores latitude + longitude.

                  For older building-based requests, use the building centre
                  as a fallback.
                */
                const latitude =
                  Number(
                    request.latitude ??
                    building?.center?.[1],
                  )

                const longitude =
                  Number(
                    request.longitude ??
                    building?.center?.[0],
                  )

                const hasLocation =
                  Number.isFinite(latitude) &&
                  Number.isFinite(longitude) &&
                  latitude !== 0 &&
                  longitude !== 0

                if (!hasLocation) {
                  return (
                    <button
                      type="button"
                      className="secondary-btn full"
                      disabled
                      title="This request does not have map coordinates."
                    >
                      <Navigation size={15} />

                      Location unavailable
                    </button>
                  )
                }

                const params =
                  new URLSearchParams({
                    lat:
                      String(latitude),

                    lng:
                      String(longitude),

                    request:
                      request.id,

                    label:
                      request.title ||
                      request.locationLabel ||
                      'Request location',
                  })

                return (
                  <Link
                    className="secondary-btn full"
                    to={`/app/map?${params.toString()}`}
                  >
                    <Navigation size={15} />

                    Open on map
                  </Link>
                )
              })()}
            </section>

            <section className="panel detail-summary">
              <span className="eyebrow">
                Ownership
              </span>

              <div className="owner-row">
                <UserRound size={17} />

                <span>
                  <small>Department</small>
                  <strong>{request.department}</strong>
                </span>
              </div>

              <div className="owner-row">
                <ClipboardCheck size={17} />

                <span>
                  <small>Assigned officer</small>
                  <strong>
                    {request.assignedToName || 'Not assigned'}
                  </strong>
                </span>
              </div>

              <div className="owner-row">
                <Clock3 size={17} />

                <span>
                  <small>Created</small>
                  <strong>
                    {new Date(request.createdAt).toLocaleDateString()}
                  </strong>
                </span>
              </div>
            </section>

            {canOperate && (
              <section className="panel action-panel">
                <span className="eyebrow">
                  Workflow actions
                </span>

                <h3>
                  Move this case forward
                </h3>

                {/* ===============================================
                    FIELD OFFICER ACTIONS
                ================================================ */}

                {user.role === 'GOV_WORKER' && (
                  <>
                    {/* START / CONTINUE INSPECTION */}

                    <button
                      type="button"
                      className="primary-btn full"
                      onClick={() =>
                        void startInspection()
                      }
                    >
                      <CheckCircle2
                        size={16}
                      />

                      {request.inspection?.status ===
                      'IN_PROGRESS'
                        ? 'Continue inspection'
                        : 'Start inspection'}
                    </button>

                    {/* CHECK IN AT SITE */}

                    <button
                      type="button"
                      className="secondary-btn full"
                      onClick={() =>
                        void checkInAtSite()
                      }
                    >
                      <MapPin
                        size={16}
                      />

                      Check in at site
                    </button>

                    {/* EVIDENCE INPUT */}

                    <input
                      ref={evidenceInput}
                      type="file"
                      multiple
                      accept="image/png,image/jpeg,application/pdf"
                      hidden
                      onChange={(event) =>
                        void uploadEvidence(
                          event.target.files,
                        )
                      }
                    />

                    {/* UPLOAD EVIDENCE */}

                    <button
                      type="button"
                      className="secondary-btn full"
                      onClick={() =>
                        evidenceInput.current?.click()
                      }
                    >
                      <Camera
                        size={16}
                      />

                      Upload evidence
                    </button>

                    {/* INSPECTION NOTE */}

                    <button
                      type="button"
                      className="secondary-btn full"
                      onClick={() =>
                        void addInspectionNote()
                      }
                    >
                      <MessageSquarePlus
                        size={16}
                      />

                      Add inspection note
                    </button>
                  </>
                )}

                {/* ===============================================
                    GOVERNMENT ADMIN ACTIONS
                ================================================ */}

                {user.role === 'GOV_ADMIN' && (
                  <>
                    <button
                      type="button"
                      className="primary-btn full"
                      onClick={() =>
                        void openAssignModal()
                      }
                    >
                      <UserRound
                        size={16}
                      />

                      Assign / reassign officer
                    </button>

                    <button
                      type="button"
                      className="secondary-btn full"
                      onClick={() =>
                        void submitApproval()
                      }
                    >
                      <ClipboardCheck
                        size={16}
                      />

                      Escalate for approval
                    </button>
                  </>
                )}
              </section>
            )}

            {canApprove &&
              (request.status.includes('APPROVAL') ||
                request.status === 'NEEDS_APPROVAL') && (
                <section className="panel action-panel">
                  <span className="eyebrow">
                    Approval decision
                  </span>

                  <h3>Review the requested action</h3>

                  <button
                    className="primary-btn full"
                    onClick={() => void decide('APPROVE')}
                  >
                    <CheckCircle2 size={16} />
                    Approve request
                  </button>

                  <button
                    className="secondary-btn full"
                    onClick={() => void decide('REQUEST_INFO')}
                  >
                    <MessageSquarePlus size={16} />
                    Request information
                  </button>

                  <button
                    className="danger-btn full"
                    onClick={() => void decide('REJECT')}
                  >
                    <XCircle size={16} />
                    Reject request
                  </button>
                </section>
              )}
          </aside>
        </div>
      </div>

      {/* =====================================================
          ASSIGN / REASSIGN OFFICER MODAL
      ====================================================== */}

      {assignOpen && (
        <div
          className="
            fixed
            inset-0
            z-[9999]

            flex
            items-center
            justify-center

            bg-slate-950/55

            p-4

            backdrop-blur-[5px]
          "
          onMouseDown={(event) => {
            if (
              event.currentTarget === event.target &&
              !assigning
            ) {
              setAssignOpen(false)
            }
          }}
        >
          <div
            className="
              w-full
              max-w-[620px]

              overflow-hidden

              rounded-[26px]

              border
              border-slate-200/80

              bg-white

              shadow-[0_32px_100px_rgba(15,23,42,.28)]

              animate-[assignModalIn_.22s_cubic-bezier(.22,1,.36,1)]
            "
          >
            {/* HEADER */}

            <div
              className="
                flex
                items-start
                justify-between
                gap-5

                border-b
                border-slate-100

                px-6
                py-5
              "
            >
              <div className="min-w-0">
                <div
                  className="
                    mb-2
                    flex
                    items-center
                    gap-2

                    text-[9px]
                    font-extrabold
                    uppercase
                    tracking-[.16em]

                    text-teal-700
                  "
                >
                  <UsersRound size={14} />
                  Officer assignment
                </div>

                <h2
                  className="
                    font-['Manrope']
                    text-[22px]
                    font-extrabold
                    tracking-[-.035em]

                    text-slate-950
                  "
                >
                  Assign this request
                </h2>

                <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
                  Select an active field worker. Only government worker
                  accounts are shown.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close assignment"
                disabled={assigning}
                onClick={() => setAssignOpen(false)}
                className="
                  grid
                  h-10
                  w-10
                  shrink-0
                  cursor-pointer
                  place-items-center

                  rounded-xl

                  border
                  border-slate-200

                  bg-white

                  text-slate-500

                  transition

                  hover:bg-slate-50
                  hover:text-slate-950

                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <X size={17} />
              </button>
            </div>

            {/* CURRENT ASSIGNMENT */}

            <div className="px-6 pt-5">
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4

                  rounded-[15px]

                  border
                  border-slate-200

                  bg-slate-50

                  px-4
                  py-3
                "
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="
                      grid
                      h-9
                      w-9
                      shrink-0
                      place-items-center

                      rounded-xl

                      bg-white

                      text-slate-500

                      shadow-sm
                    "
                  >
                    <ClipboardCheck size={16} />
                  </span>

                  <div className="min-w-0">
                    <small
                      className="
                        block
                        text-[8px]
                        font-extrabold
                        uppercase
                        tracking-[.1em]

                        text-slate-400
                      "
                    >
                      Current officer
                    </small>

                    <strong
                      className="
                        mt-0.5
                        block
                        truncate

                        text-[11px]
                        font-bold

                        text-slate-900
                      "
                    >
                      {request.assignedToName || 'Not assigned'}
                    </strong>
                  </div>
                </div>

                <span
                  className="
                    shrink-0

                    rounded-full

                    bg-white

                    px-2.5
                    py-1.5

                    text-[8px]
                    font-extrabold
                    uppercase
                    tracking-[.08em]

                    text-slate-500

                    shadow-sm
                  "
                >
                  {request.assignedToName ? 'Assigned' : 'Open'}
                </span>
              </div>
            </div>

            {/* SEARCH */}

            <div className="px-6 pt-4">
              <div
                className="
                  flex
                  h-[48px]
                  items-center
                  gap-3

                  rounded-[14px]

                  border
                  border-slate-200

                  bg-white

                  px-4

                  transition

                  focus-within:border-teal-500
                  focus-within:ring-4
                  focus-within:ring-teal-500/10
                "
              >
                <Search
                  size={17}
                  className="shrink-0 text-slate-400"
                />

                <input
                  ref={workerSearchInput}
                  value={workerSearch}
                  onChange={(event) =>
                    setWorkerSearch(event.target.value)
                  }
                  placeholder="Search worker by name or ID..."
                  className="
                    !m-0
                    !h-auto
                    min-w-0
                    flex-1

                    !border-0
                    !bg-transparent
                    !p-0

                    text-[12px]
                    font-medium
                    text-slate-900

                    !shadow-none
                    !outline-none
                    !ring-0

                    placeholder:text-slate-400

                    focus:!border-0
                    focus:!shadow-none
                    focus:!outline-none
                    focus:!ring-0
                  "
                />

                {workerSearch && (
                  <button
                    type="button"
                    aria-label="Clear worker search"
                    onClick={() => setWorkerSearch('')}
                    className="
                      grid
                      h-7
                      w-7
                      shrink-0
                      place-items-center

                      rounded-lg

                      border-0
                      bg-transparent

                      text-slate-400

                      transition

                      hover:bg-slate-100
                      hover:text-slate-700
                    "
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* WORKER LIST */}

            <div
              className="
                mx-6
                my-4

                max-h-[330px]
                min-h-[210px]

                overflow-y-auto

                rounded-[16px]

                border
                border-slate-200

                bg-slate-50/70

                p-2
              "
            >
              {workersLoading ? (
                <div
                  className="
                    flex
                    min-h-[190px]
                    flex-col
                    items-center
                    justify-center
                    gap-3

                    text-center
                  "
                >
                  <LoaderCircle
                    size={22}
                    className="animate-spin text-teal-700"
                  />

                  <span className="text-[10px] font-semibold text-slate-500">
                    Loading available workers…
                  </span>
                </div>
              ) : filteredWorkers.length ? (
                <div className="space-y-1.5">
                  {filteredWorkers.map((worker) => {
                    const selected = selectedWorkerId === worker.id
                    const current = request.assignedToName === worker.name

                    return (
                      <button
                        type="button"
                        key={worker.id}
                        onClick={() => setSelectedWorkerId(worker.id)}
                        className={`
                          group
                          flex
                          w-full
                          cursor-pointer
                          items-center
                          gap-3.5

                          rounded-[13px]

                          border

                          px-3.5
                          py-3

                          text-left

                          transition
                          duration-200

                          ${
                            selected
                              ? `
                                border-teal-400
                                bg-teal-50
                                shadow-[0_6px_18px_rgba(13,148,136,.08)]
                              `
                              : `
                                border-transparent
                                bg-white
                                hover:border-slate-200
                                hover:bg-white
                                hover:shadow-sm
                              `
                          }
                        `}
                      >
                        <span
                          className={`
                            grid
                            h-10
                            w-10
                            shrink-0
                            place-items-center

                            rounded-xl

                            text-[10px]
                            font-extrabold

                            ${
                              selected
                                ? 'bg-teal-700 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }
                          `}
                        >
                          {workerInitials(worker.name) || 'GW'}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex min-w-0 items-center gap-2">
                            <strong
                              className="
                                truncate
                                text-[11px]
                                font-bold
                                text-slate-900
                              "
                            >
                              {worker.name}
                            </strong>

                            {current && (
                              <span
                                className="
                                  shrink-0
                                  rounded-full
                                  bg-blue-50
                                  px-2
                                  py-1
                                  text-[7px]
                                  font-extrabold
                                  uppercase
                                  tracking-[.06em]
                                  text-blue-700
                                "
                              >
                                Current
                              </span>
                            )}
                          </div>

                          <div
                            className="
                              mt-1
                              flex
                              flex-wrap
                              items-center
                              gap-x-3
                              gap-y-1

                              text-[8px]
                              font-medium
                              text-slate-400
                            "
                          >
                            <span>Government worker</span>

                            {worker.departmentId && (
                              <span>
                                Dept. {worker.departmentId}
                              </span>
                            )}

                            <span title={worker.id}>
                              ID {shortId(worker.id)}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`
                            grid
                            h-6
                            w-6
                            shrink-0
                            place-items-center

                            rounded-full

                            border-2

                            transition

                            ${
                              selected
                                ? 'border-teal-600 bg-teal-600 text-white'
                                : 'border-slate-200 bg-white text-transparent group-hover:border-slate-300'
                            }
                          `}
                        >
                          <Check size={12} strokeWidth={3} />
                        </span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div
                  className="
                    flex
                    min-h-[190px]
                    flex-col
                    items-center
                    justify-center

                    px-6

                    text-center
                  "
                >
                  <span
                    className="
                      grid
                      h-11
                      w-11
                      place-items-center

                      rounded-2xl

                      bg-white

                      text-slate-400

                      shadow-sm
                    "
                  >
                    <UsersRound size={19} />
                  </span>

                  <strong className="mt-3 text-[11px] font-bold text-slate-700">
                    No matching workers
                  </strong>

                  <small className="mt-1 text-[9px] leading-4 text-slate-400">
                    Try another worker name or ID.
                  </small>
                </div>
              )}
            </div>

            {/* ERROR */}

            {assignError && (
              <div
                className="
                  mx-6
                  mb-4

                  rounded-xl

                  border
                  border-red-200

                  bg-red-50

                  px-3.5
                  py-3

                  text-[9px]
                  font-semibold
                  leading-4

                  text-red-700
                "
              >
                {assignError}
              </div>
            )}

            {/* FOOTER */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-4

                border-t
                border-slate-100

                bg-white

                px-6
                py-4
              "
            >
              <div className="min-w-0">
                {selectedWorker ? (
                  <>
                    <small
                      className="
                        block
                        text-[8px]
                        font-extrabold
                        uppercase
                        tracking-[.08em]

                        text-slate-400
                      "
                    >
                      Assigning to
                    </small>

                    <strong
                      className="
                        mt-0.5
                        block
                        truncate

                        text-[10px]
                        font-bold

                        text-slate-900
                      "
                    >
                      {selectedWorker.name}
                    </strong>
                  </>
                ) : (
                  <small className="text-[9px] font-medium text-slate-400">
                    Select a worker to continue.
                  </small>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-2.5">
                <button
                  type="button"
                  disabled={assigning}
                  onClick={() => setAssignOpen(false)}
                  className="
                    h-10
                    cursor-pointer

                    rounded-xl

                    border
                    border-slate-200

                    bg-white

                    px-4

                    text-[9px]
                    font-bold

                    text-slate-600

                    transition

                    hover:bg-slate-50
                    hover:text-slate-950

                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!selectedWorker || assigning}
                  onClick={() => void confirmAssignment()}
                  className="
                    flex
                    h-10
                    min-w-[132px]
                    cursor-pointer
                    items-center
                    justify-center
                    gap-2

                    rounded-xl

                    border-0

                    bg-slate-950

                    px-4

                    text-[9px]
                    font-extrabold
                    uppercase
                    tracking-[.06em]

                    text-white

                    shadow-[0_8px_22px_rgba(15,23,42,.18)]

                    transition

                    hover:-translate-y-0.5
                    hover:bg-slate-800

                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    disabled:hover:translate-y-0
                  "
                >
                  {assigning ? (
                    <>
                      <LoaderCircle
                        size={14}
                        className="animate-spin"
                      />
                      Assigning
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Assign officer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes assignModalIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          [class*="animate-[assignModalIn"] {
            animation: none !important;
          }
        }
      `}</style>
    </>
  )
}
