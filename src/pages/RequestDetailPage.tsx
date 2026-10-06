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

  const [noteOpen, setNoteOpen] = useState(false)
  const [inspectionNote, setInspectionNote] = useState('')
  const [savingNote, setSavingNote] = useState(false)

  const [finishOpen, setFinishOpen] = useState(false)
  const [finishSummary, setFinishSummary] = useState('')
  const [finishAction, setFinishAction] = useState('')
  const [finishRecommendation, setFinishRecommendation] = useState('')
  const [finishFiles, setFinishFiles] = useState<File[]>([])
  const [finishing, setFinishing] = useState(false)

  const [resolveOpen, setResolveOpen] = useState(false)
  const [resolutionReport, setResolutionReport] = useState('')
  const [resolving, setResolving] = useState(false)

  const [openingAttachment, setOpeningAttachment] =
    useState<string | null>(null)
    
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
        GPS permission is requested only when the officer explicitly
        presses "Check in at site".
      */
      const position = await browserPosition()

      let inspectionId = request.inspection?.id

      /*
        If there is no active inspection, create/schedule one first.
      */
      if (
        !inspectionId ||
        request.inspection?.status === 'COMPLETED' ||
        request.inspection?.status === 'CANCELLED'
      ) {
        inspectionId = (
          await inspectionsService.create(request.id)
        ).id
      }

      /*
        One PATCH can both start the inspection and perform the GPS check-in.

        Backend behavior after the replacement inspections.routes.ts:
        - inspection -> IN_PROGRESS
        - service request -> INSPECTING (when starting)
        - latest GPS coordinates are stored
        - checked_in_at is recorded on the first successful check-in
        - GOV_ADMIN and SUPERIOR receive a notification on first check-in
        - duplicate/repeated check-ins do not spam notifications
      */
      await inspectionsService.update(
        inspectionId,
        {
          status: 'IN_PROGRESS',
          latitude: position.latitude,
          longitude: position.longitude,
        },
      )

      await load()
    } catch (error) {
      explain(error)
    }
  }

  function addInspectionNote() {
    setInspectionNote('')
    setNoteOpen(true)
  }

  async function saveInspectionNote() {
    if (!request) return

    const note = inspectionNote.trim()

    if (!note) return

    setSavingNote(true)

    try {
      await requestsService.addNote(
        request.id,
        note,
        'INTERNAL',
      )

      setNoteOpen(false)
      setInspectionNote('')

      await load()
    } catch (error) {
      explain(error)
    } finally {
      setSavingNote(false)
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
        'INSPECTION_EVIDENCE',
        'INTERNAL',
      )

      await load()
    } catch (error) {
      explain(error)
    }
  }

  async function openAttachment(
    attachmentId: string,
    filename: string,
  ) {
    if (!request) return

    setOpeningAttachment(attachmentId)

    try {
      const result =
        await requestsService.downloadAttachment(
          request.id,
          attachmentId,
          filename,
        )

      const newWindow = window.open(
        result.url,
        '_blank',
        'noopener,noreferrer',
      )

      if (!newWindow) {
        const link = document.createElement('a')

        link.href = result.url
        link.download = filename

        document.body.appendChild(link)

        link.click()
        link.remove()
      }

      window.setTimeout(() => {
        URL.revokeObjectURL(result.url)
      }, 60_000)
    } catch (error) {
      explain(error)
    } finally {
      setOpeningAttachment(null)
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

  // Safe evidence collections. ServiceRequest.attachments is optional.
  const attachments = request.attachments ?? []

  const complaintEvidence = attachments.filter(
    (attachment) => attachment.category === 'INITIAL_EVIDENCE',
  )

  const officerEvidence = attachments.filter(
    (attachment) =>
      attachment.category === 'INSPECTION_EVIDENCE' ||
      attachment.category === 'RESOLUTION_EVIDENCE',
  )

  const inspectionEvidence = officerEvidence.filter(
    (attachment) => attachment.category === 'INSPECTION_EVIDENCE',
  )

  const completionEvidence = officerEvidence.filter(
    (attachment) => attachment.category === 'RESOLUTION_EVIDENCE',
  )

  const canOperate =
    user.role === 'GOV_WORKER' ||
    user.role === 'GOV_ADMIN'

  const canApprove =
    user.role === 'APPROVER' ||
    user.role === 'SUPERIOR'

  const selectedWorker = workers.find(
    (worker) => worker.id === selectedWorkerId,
  )

  function openFinishCase() {
    setFinishSummary('')
    setFinishAction('')
    setFinishRecommendation('')
    setFinishFiles([])
    setFinishOpen(true)
  }

  async function submitFieldCompletion() {
    if (!request) return

    const summary = finishSummary.trim()

    if (!summary) {
      window.alert(
        'Please enter the inspection summary.',
      )
      return
    }

    setFinishing(true)

    try {
      await requestsService.completeFieldWork(
        request.id,
        {
          summary,
          actionTaken: finishAction.trim(),
          recommendation:
            finishRecommendation.trim(),
        },
        finishFiles.slice(0, 5),
      )

      setFinishOpen(false)

      await load()
    } catch (error) {
      explain(error)
    } finally {
      setFinishing(false)
    }
  }


  function openResolveCase() {
    setResolutionReport('')
    setResolveOpen(true)
  }

  async function confirmResolveCase() {
    if (!request) return

    const report = resolutionReport.trim()

    if (!report) {
      window.alert(
        'Please enter the final resolution report.',
      )
      return
    }

    setResolving(true)

    try {
      await requestsService.resolveCase(
        request.id,
        {
          report,
        },
      )

      setResolveOpen(false)

      await load()
    } catch (error) {
      explain(error)
    } finally {
      setResolving(false)
    }
  }

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

              {/* ==========================================
                  COMPLAINT / USER EVIDENCE
              =========================================== */}

              <div>
                <div className="mb-3 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-3">
                  <div>
                    <h3 className="text-[13px] font-extrabold text-slate-800">
                      Complaint evidence
                    </h3>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      Evidence submitted with the original complaint
                    </p>
                  </div>

                  <span
                    className="
                      rounded-full bg-slate-100
                      px-2.5 py-1
                      text-[9px] font-bold text-slate-500
                    "
                  >
                    {
                      complaintEvidence.length
                    }
                  </span>
                </div>

                <div className="evidence-grid">
                  {attachments.filter(
                    (attachment) =>
                      attachment.category === 'INITIAL_EVIDENCE',
                  ).length ? (
                    complaintEvidence.map((attachment, index) => {
                        const isImage =
                          attachment.mimeType.startsWith('image/')

                        const busy =
                          openingAttachment === attachment.id

                        return (
                          <button
                            type="button"
                            className="evidence-card"
                            key={attachment.id}
                            disabled={busy}
                            onClick={() =>
                              void openAttachment(
                                attachment.id,
                                attachment.filename,
                              )
                            }
                            style={{
                              textAlign: 'left',
                              cursor: busy ? 'wait' : 'pointer',
                            }}
                          >
                            {busy ? (
                              <LoaderCircle
                                size={22}
                                className="animate-spin"
                              />
                            ) : isImage ? (
                              <Camera size={22} />
                            ) : (
                              <FileText size={22} />
                            )}

                            <span>
                              <strong>
                                {attachment.filename}
                              </strong>

                              <small>
                                Submitted by complainant
                                {' · '}
                                File {index + 1}
                              </small>
                            </span>
                          </button>
                        )
                      })
                  ) : (
                    <div className="empty-evidence">
                      <FileText size={20} />

                      <span>
                        No complaint evidence attached
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* DIVIDER */}

              <div className="my-5 border-t border-slate-100" />

              {/* ==========================================
                  FIELD OFFICER EVIDENCE
              =========================================== */}

              <div>
                <div className="mb-3 flex items-center justify-between rounded-xl border border-teal-100 bg-teal-50/50 px-3.5 py-3">
                  <div>
                    <h3 className="text-[13px] font-extrabold text-slate-800">
                      Field officer evidence
                    </h3>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      Evidence collected during inspection and field work
                    </p>
                  </div>

                  <span
                    className="
                      rounded-full bg-teal-50
                      px-2.5 py-1
                      text-[9px] font-bold text-teal-700
                    "
                  >
                    {
                      officerEvidence.length
                    }
                  </span>
                </div>

                {officerEvidence.length > 0 && (
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[8px] font-bold text-slate-600">
                      <Camera size={11} /> Inspection {inspectionEvidence.length}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[8px] font-bold text-emerald-700">
                      <CheckCircle2 size={11} /> Completion {completionEvidence.length}
                    </span>
                  </div>
                )}

                <div className="evidence-grid">
                  {officerEvidence.length ? (
                    officerEvidence.map((attachment, index) => {
                        const isImage =
                          attachment.mimeType.startsWith('image/')

                        const busy =
                          openingAttachment === attachment.id

                        const completionEvidence =
                          attachment.category === 'RESOLUTION_EVIDENCE'

                        return (
                          <button
                            type="button"
                            className="evidence-card"
                            key={attachment.id}
                            disabled={busy}
                            onClick={() =>
                              void openAttachment(
                                attachment.id,
                                attachment.filename,
                              )
                            }
                            style={{
                              textAlign: 'left',
                              cursor: busy ? 'wait' : 'pointer',
                            }}
                          >
                            {busy ? (
                              <LoaderCircle
                                size={22}
                                className="animate-spin"
                              />
                            ) : isImage ? (
                              <Camera size={22} />
                            ) : (
                              <FileText size={22} />
                            )}

                            <span>
                              <strong>
                                {attachment.filename}
                              </strong>

                              <small>
                                {completionEvidence
                                  ? 'Field completion evidence'
                                  : 'Inspection evidence'}
                                {' · '}
                                File {index + 1}
                              </small>
                            </span>
                          </button>
                        )
                      })
                  ) : (
                    <div className="empty-evidence">
                      <Camera size={20} />

                      <span>
                        No field officer evidence uploaded yet
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="panel">
              <div className="panel-head">
                <div>
                  <span className="eyebrow">
                    Inspection
                  </span>

                  <h2>Inspection notes</h2>
                </div>

                {request.notes?.length ? (
                  <span
                    className="
                      rounded-full
                      bg-slate-100
                      px-2.5 py-1
                      text-[10px]
                      font-bold
                      text-slate-500
                    "
                  >
                    {request.notes.length}
                  </span>
                ) : null}
              </div>

              {request.notes?.length ? (
                <div className="space-y-3">
                  {request.notes.map((note) => (
                    <div
                      key={note.id}
                      className="
                        rounded-xl
                        border border-slate-200
                        bg-slate-50/70
                        px-4 py-3.5
                      "
                    >
                      <div
                        className="
                          flex items-start
                          gap-3
                        "
                      >
                        <span
                          className="
                            mt-0.5
                            grid h-8 w-8
                            shrink-0
                            place-items-center
                            rounded-lg
                            bg-white
                            text-teal-700
                            shadow-sm
                          "
                        >
                          <MessageSquarePlus size={15} />
                        </span>

                        <div className="min-w-0 flex-1">
                          <div
                            className="
                              flex flex-wrap
                              items-center
                              justify-between
                              gap-2
                            "
                          >
                            <strong
                              className="
                                text-[12px]
                                font-bold
                                text-slate-800
                              "
                            >
                              {note.author || 'Field officer'}
                            </strong>

                            <small
                              className="
                                text-[9px]
                                font-medium
                                text-slate-400
                              "
                            >
                              {new Date(
                                note.createdAt,
                              ).toLocaleString()}
                            </small>
                          </div>

                          <p
                            className="
                              mt-2
                              whitespace-pre-wrap
                              text-[12px]
                              leading-5
                              text-slate-600
                            "
                          >
                            {note.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="
                    flex items-center
                    gap-3
                    rounded-xl
                    border border-dashed
                    border-slate-200
                    px-4 py-4
                    text-slate-400
                  "
                >
                  <MessageSquarePlus size={18} />

                  <span className="text-[11px] font-medium">
                    No inspection notes added yet.
                  </span>
                </div>
              )}
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

                    <button
                      type="button"
                      className="primary-btn full"
                      disabled={
                        request.inspection?.status !==
                        'IN_PROGRESS'
                      }
                      onClick={openFinishCase}
                    >
                      <CheckCircle2 size={16} />

                      Finish field work
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

                    {request.inspection?.status ===
                      'COMPLETED' &&
                      request.status !== 'RESOLVED' &&
                      request.status !== 'CLOSED' && (
                        <button
                          type="button"
                          className="primary-btn full"
                          onClick={openResolveCase}
                        >
                          <CheckCircle2 size={16} />

                          Mark case as finished
                        </button>
                      )}
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

      {noteOpen && (
        <div
          className="
            fixed inset-0 z-[9999]
            flex items-center justify-center
            bg-slate-950/55 p-4
            backdrop-blur-[5px]
          "
        >
          <div
            className="
              w-full max-w-[560px]
              rounded-[24px]
              border border-slate-200
              bg-white
              shadow-[0_32px_100px_rgba(15,23,42,.28)]
            "
          >
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="eyebrow">
                    Inspection
                  </span>

                  <h2 className="mt-1 text-xl font-extrabold text-slate-950">
                    Add inspection note
                  </h2>

                  <p className="mt-2 text-xs text-slate-500">
                    This note is for internal municipal use.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={savingNote}
                  onClick={() => setNoteOpen(false)}
                  className="
                    grid h-10 w-10 place-items-center
                    rounded-xl border border-slate-200
                    bg-white text-slate-500
                  "
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            <div className="px-6 py-5">
              <label className="block text-xs font-bold text-slate-700">
                Inspection note
              </label>

              <textarea
                autoFocus
                rows={6}
                maxLength={5000}
                value={inspectionNote}
                onChange={(event) =>
                  setInspectionNote(
                    event.target.value,
                  )
                }
                placeholder="Enter observations from the inspection..."
                className="
                  mt-2 w-full resize-none
                  rounded-xl border border-slate-200
                  p-4 text-sm
                  outline-none
                  focus:border-teal-500
                  focus:ring-4
                  focus:ring-teal-500/10
                  placeholder:text-[12px]
                  placeholder:font-medium
                  placeholder:text-slate-400
                "
              />

              <div className="mt-2 text-right text-[10px] text-slate-400">
                {inspectionNote.length}/5000
              </div>
            </div>

            <div
              className="
                flex justify-end gap-3
                border-t border-slate-100
                px-6 py-4
              "
            >
              <button
                type="button"
                className="secondary-btn"
                disabled={savingNote}
                onClick={() => setNoteOpen(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="primary-btn"
                disabled={
                  !inspectionNote.trim() ||
                  savingNote
                }
                onClick={() =>
                  void saveInspectionNote()
                }
              >
                {savingNote ? (
                  <LoaderCircle
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <MessageSquarePlus size={15} />
                )}

                Save note
              </button>
            </div>
          </div>
        </div>
      )}

      {finishOpen && (
        <div
          className="
            fixed inset-0 z-[9999]
            flex items-center justify-center
            overflow-y-auto
            bg-slate-950/55 p-4
            backdrop-blur-[5px]
          "
        >
          <div
            className="
              my-3
              flex
              w-full
              max-w-[520px]
              max-h-[calc(100vh-24px)]
              flex-col
              overflow-hidden
              rounded-[22px]
              border border-slate-200
              bg-white
              shadow-[0_32px_100px_rgba(15,23,42,.28)]
            "
          >
            {/* HEADER */}
            <div className="shrink-0 border-b border-slate-100 px-5 py-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="eyebrow">
                    Field completion
                  </span>

                  <h2 className="mt-1 text-lg font-extrabold text-slate-950">
                    Finish field work
                  </h2>

                  <p className="mt-1 text-[11px] leading-4 text-slate-500">
                    Submit your findings to the government administrator
                    for final review.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={finishing}
                  onClick={() => setFinishOpen(false)}
                  className="
                    grid h-9 w-9 shrink-0 place-items-center
                    rounded-xl border border-slate-200
                    bg-white text-slate-500
                    transition hover:bg-slate-50
                  "
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* SCROLLABLE FORM CONTENT */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3">
              <div className="space-y-3">

                {/* INSPECTION SUMMARY */}
                <div>
                  <label className="text-[13px] font-bold text-slate-700">
                    Inspection summary *
                  </label>

                  <textarea
                    rows={2}
                    maxLength={5000}
                    value={finishSummary}
                    onChange={(event) =>
                      setFinishSummary(event.target.value)
                    }
                    placeholder="Describe what you found during the inspection..."
                    className="
                      mt-1.5
                      !h-[68px]
                      !min-h-[68px]
                      w-full
                      resize-none
                      rounded-xl
                      border border-slate-200
                      !px-3
                      !py-2.5
                      text-[12px]
                      leading-5
                      outline-none
                      focus:border-teal-500
                      focus:ring-4
                      focus:ring-teal-500/10
                      placeholder:text-[10px]
                      placeholder:font-medium
                      placeholder:text-slate-400
                    "
                  />
                </div>

                {/* ACTION TAKEN */}
                <div>
                  <label className="text-[13px] font-bold text-slate-700">
                    Action taken
                  </label>

                  <textarea
                    rows={2}
                    maxLength={3000}
                    value={finishAction}
                    onChange={(event) =>
                      setFinishAction(event.target.value)
                    }
                    placeholder="What action was taken at the site?"
                    className="
                      mt-1.5
                      !h-[62px]
                      !min-h-[62px]
                      w-full
                      resize-none
                      rounded-xl
                      border border-slate-200
                      !px-3
                      !py-2.5
                      text-[12px]
                      leading-5
                      outline-none
                      focus:border-teal-500
                      focus:ring-4
                      focus:ring-teal-500/10
                      placeholder:text-[10px]
                      placeholder:font-medium
                      placeholder:text-slate-400
                    "
                  />
                </div>

                {/* RECOMMENDATION */}
                <div>
                  <label className="text-[13px] font-bold text-slate-700">
                    Recommendation
                  </label>

                  <textarea
                    rows={2}
                    maxLength={3000}
                    value={finishRecommendation}
                    onChange={(event) =>
                      setFinishRecommendation(event.target.value)
                    }
                    placeholder="Any recommendation for the administrator?"
                    className="
                      mt-1.5
                      !h-[62px]
                      !min-h-[62px]
                      w-full
                      resize-none
                      rounded-xl
                      border border-slate-200
                      !px-3
                      !py-2.5
                      text-[12px]
                      leading-5
                      outline-none
                      focus:border-teal-500
                      focus:ring-4
                      focus:ring-teal-500/10
                      placeholder:text-[10px]
                      placeholder:font-medium
                      placeholder:text-slate-400  
                    "
                  />
                </div>

                {/* COMPLETION EVIDENCE */}
                <div>
                  <label className="text-[13px] font-bold text-slate-700">
                    Completion evidence
                  </label>

                  <label
                    className="
                      mt-1.5
                      flex cursor-pointer
                      items-center gap-2.5
                      rounded-xl
                      border border-dashed border-slate-300
                      px-3 py-2.5
                      transition
                      hover:border-teal-400
                      hover:bg-teal-50/30
                    "
                  >
                    <Camera
                      size={17}
                      className="shrink-0 text-slate-600"
                    />

                    <span className="text-[13px] font-semibold text-slate-600">
                      Add photos or PDF
                    </span>

                    <input
                      hidden
                      type="file"
                      multiple
                      accept="image/png,image/jpeg,application/pdf"
                      onChange={(event) =>
                        setFinishFiles(
                          Array.from(
                            event.target.files ?? [],
                          ).slice(0, 5),
                        )
                      }
                    />
                  </label>

                  {/* SELECTED FILES */}
                  {finishFiles.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {finishFiles.map((file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className="
                            flex items-center justify-between
                            gap-3
                            rounded-lg
                            bg-slate-50
                            px-3 py-2
                            text-[10px]
                            text-slate-600
                          "
                        >
                          <span className="min-w-0 flex-1 truncate">
                            {file.name}
                          </span>

                          <button
                            type="button"
                            className="
                              grid h-6 w-6 shrink-0
                              place-items-center
                              rounded-md
                              text-slate-400
                              transition
                              hover:bg-slate-200
                              hover:text-slate-700
                            "
                            onClick={() =>
                              setFinishFiles((current) =>
                                current.filter(
                                  (_, i) => i !== index,
                                ),
                              )
                            }
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div
              className="
                flex shrink-0 justify-end gap-2
                border-t border-slate-100
                bg-white
                px-5 py-3
              "
            >
              <button
                type="button"
                className="secondary-btn"
                disabled={finishing}
                onClick={() => setFinishOpen(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="primary-btn"
                disabled={
                  !finishSummary.trim() ||
                  finishing
                }
                onClick={() =>
                  void submitFieldCompletion()
                }
              >
                {finishing ? (
                  <LoaderCircle
                    size={14}
                    className="animate-spin"
                  />
                ) : (
                  <CheckCircle2 size={14} />
                )}

                Submit field report
              </button>
            </div>
          </div>
        </div>
      )}

      {resolveOpen && (
        <div
          className="
            fixed inset-0 z-[9999]
            flex items-center justify-center
            bg-slate-950/55 p-4
            backdrop-blur-[5px]
          "
        >
          <div
            className="
              w-full max-w-[600px]
              rounded-[24px]
              border border-slate-200
              bg-white
              shadow-[0_32px_100px_rgba(15,23,42,.28)]
            "
          >
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="eyebrow">
                    Final review
                  </span>

                  <h2 className="mt-1 text-xl font-extrabold">
                    Finish this case
                  </h2>

                  <p className="mt-2 text-xs text-slate-500">
                    This report will be visible to the
                    citizen who submitted the complaint.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={resolving}
                  onClick={() =>
                    setResolveOpen(false)
                  }
                  className="
                    grid h-10 w-10 place-items-center
                    rounded-xl border border-slate-200
                  "
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            <div className="px-6 py-5">
              <label className="text-xs font-bold text-slate-700">
                Resolution report *
              </label>

              <textarea
                rows={7}
                maxLength={5000}
                value={resolutionReport}
                onChange={(event) =>
                  setResolutionReport(
                    event.target.value,
                  )
                }
                placeholder="Explain how the complaint was resolved..."
                className="
                  mt-2 w-full resize-none
                  rounded-xl border border-slate-200
                  p-4 text-sm outline-none
                  focus:border-teal-500
                  focus:ring-4
                  focus:ring-teal-500/10
                "
              />
            </div>

            <div
              className="
                flex justify-end gap-3
                border-t border-slate-100
                px-6 py-4
              "
            >
              <button
                type="button"
                className="secondary-btn"
                disabled={resolving}
                onClick={() =>
                  setResolveOpen(false)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="primary-btn"
                disabled={
                  !resolutionReport.trim() ||
                  resolving
                }
                onClick={() =>
                  void confirmResolveCase()
                }
              >
                {resolving ? (
                  <LoaderCircle
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <CheckCircle2 size={15} />
                )}

                Mark as finished
              </button>
            </div>
          </div>
        </div>
      )}

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
