import {
  Camera,
  CheckCircle2,
  ChevronDown,
  FileText,
  MapPin,
  Paperclip,
  Send,
  X,
} from 'lucide-react'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useLocation } from 'react-router-dom'
import { buildingsService } from '../services/buildings.service'
import { ApiError } from '../services/http'
import { requestsService } from '../services/requests.service'
import type {
  Building,
  RequestPriority,
  RequestType,
} from '../types'

type MapRequestLocation = {
  kind: 'POINT'
  latitude: number
  longitude: number
  label?: string
}

type RequestRouteState = {
  requestLocation?: MapRequestLocation
}

export function RequestFormModal({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: () => void
}) {
  const routeLocation = useLocation()

  const routeState =
    (routeLocation.state as RequestRouteState | null) ?? null

  const incomingMapLocation =
    routeState?.requestLocation?.kind === 'POINT'
      ? routeState.requestLocation
      : null

  const [type, setType] =
    useState<RequestType>('COMPLAINT')

  const [step, setStep] =
    useState<'form' | 'success'>('form')

  const [buildings, setBuildings] =
    useState<Building[]>([])

  const [buildingId, setBuildingId] =
    useState('')

  const [mapLocation, setMapLocation] =
    useState<MapRequestLocation | null>(
      incomingMapLocation,
    )

  const [title, setTitle] =
    useState('')

  const [description, setDescription] =
    useState('')

  const [bookingDate, setBookingDate] =
    useState('')

  const [participants, setParticipants] =
    useState('')

  /*
    Citizens do not choose operational priority.
    The request is created as NORMAL and can later be
    re-prioritized by the municipal workflow/backend.
  */
  const citizenPriority: RequestPriority =
    'NORMAL'

  const [
    contactPreference,
    setContactPreference,
  ] = useState<'PORTAL' | 'EMAIL'>('PORTAL')

  const [files, setFiles] =
    useState<File[]>([])

  const [requestCode, setRequestCode] =
    useState('')

  const [error, setError] =
    useState('')

  const [submitting, setSubmitting] =
    useState(false)

  const fileInput =
    useRef<HTMLInputElement>(null)

  /* =========================================================
     LOAD PUBLIC BUILDINGS
  ========================================================= */

  useEffect(() => {
    let cancelled = false

    buildingsService
      .publicList({ limit: 100 })
      .then((items) => {
        if (cancelled) return

        setBuildings(items)

        /*
          Do not auto-select the first building.
          If the modal was opened from the map, the map point
          is already the chosen location.
        */
        setBuildingId('')
      })
      .catch((cause) => {
        console.error(
          'Unable to load public buildings',
          cause,
        )

        if (!cancelled) {
          setError(
            'Mapped buildings are not available yet. Ask an administrator to sync the building layer.',
          )
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  /*
    If navigation state changes while this modal is mounted,
    use the new map point.
  */
  useEffect(() => {
    if (!incomingMapLocation) return

    setMapLocation(incomingMapLocation)
    setBuildingId('')
  }, [
    incomingMapLocation?.latitude,
    incomingMapLocation?.longitude,
    incomingMapLocation?.label,
  ])

  const selected =
    buildings.find(
      (building) =>
        building.id === buildingId,
    )

  const hasLocation =
    Boolean(mapLocation || selected)

  const canBook =
    type !== 'BOOKING' ||
    Boolean(selected?.publicFacility)

  /* =========================================================
     FILE PREVIEWS
  ========================================================= */

  const previews = useMemo(
    () =>
      files.map((file, index) => ({
        file,
        index,
        url: file.type.startsWith('image/')
          ? URL.createObjectURL(file)
          : null,
      })),
    [files],
  )

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        if (preview.url) {
          URL.revokeObjectURL(preview.url)
        }
      })
    }
  }, [previews])

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return

    const accepted = Array.from(fileList)
      .filter((file) =>
        [
          'image/png',
          'image/jpeg',
          'application/pdf',
        ].includes(file.type),
      )
      .slice(0, 5)

    setFiles(accepted)

    if (fileInput.current) {
      fileInput.current.value = ''
    }
  }

  function removeFile(index: number) {
    setFiles((current) =>
      current.filter(
        (_, fileIndex) => fileIndex !== index,
      ),
    )
  }

  function changeRequestType(item: RequestType) {
    setType(item)
    setError('')

    /*
      A booking must be attached to a real public facility,
      not just an arbitrary map point.
    */
    if (item === 'BOOKING') {
      setMapLocation(null)
    }
  }

  /* =========================================================
     SUBMIT
  ========================================================= */

  async function submit() {
    if (!mapLocation && !selected) {
      setError(
        'Please select or pin a mapped location.',
      )
      return
    }

    if (title.trim().length < 5) {
      setError(
        'Subject must contain at least 5 characters.',
      )
      return
    }

    if (description.trim().length < 10) {
      setError(
        'Description must contain at least 10 characters.',
      )
      return
    }

    if (
      type === 'BOOKING' &&
      (!bookingDate || Number(participants) < 1)
    ) {
      setError(
        'Booking date and participant count are required.',
      )
      return
    }

    if (
      type === 'BOOKING' &&
      !selected?.publicFacility
    ) {
      setError(
        'Please select an eligible public facility for this booking.',
      )
      return
    }

    const requestLocation = mapLocation
      ? {
          kind: 'POINT' as const,
          latitude: mapLocation.latitude,
          longitude: mapLocation.longitude,
          label:
            mapLocation.label ||
            'Pinned map location',
        }
      : selected
        ? {
            kind: 'BUILDING' as const,
            buildingCode: selected.id,
          }
        : null

    if (!requestLocation) {
      setError(
        'Please select or pin a mapped location.',
      )
      return
    }

    setError('')
    setSubmitting(true)

    try {
      const result =
        await requestsService.create(
          {
            clientRequestId:
              crypto.randomUUID(),
            type,
            title: title.trim(),
            description: description.trim(),
            priority: citizenPriority,
            contactPreference,
            location: requestLocation,
            ...(type === 'BOOKING'
              ? {
                  booking: {
                    date: bookingDate,
                    participants:
                      Number(participants),
                    purpose:
                      description.trim(),
                  },
                }
              : {}),
          },
          files,
        )

      setRequestCode(result.requestCode)
      setStep('success')
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause.message
          : 'Unable to submit the request.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  /* =========================================================
     SUCCESS
  ========================================================= */

  if (step === 'success') {
    const locationText = mapLocation
      ? mapLocation.label || 'Pinned map location'
      : selected?.name || 'Mapped location'

    return (
      <div className="modal-backdrop">
        <div className="request-modal request-modal--success">
          <span className="success-orb">
            <CheckCircle2 size={34} />
          </span>

          <span className="eyebrow">
            Request received
          </span>

          <h2>{requestCode}</h2>

          <p>
            Your request has been created and added to
            your request timeline.
          </p>

          <div className="success-summary">
            <span>
              <MapPin size={16} />
              {locationText}
            </span>

            <span>
              <FileText size={16} />
              {type}
            </span>
          </div>

          <button
            className="primary-btn full"
            onClick={onCreated}
          >
            View my requests
          </button>

          <button
            className="text-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  /* =========================================================
     FORM
  ========================================================= */

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          onClose()
        }
      }}
    >
      <div className="request-modal">
        {/* HEADER */}
        <div className="request-modal__head">
          <div>
            <span className="eyebrow">
              New municipal request
            </span>

            <h2>Tell us what’s happening.</h2>

            <p>
              Pin the issue to a location so the right
              team starts with clear context.
            </p>
          </div>

          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close request form"
          >
            <X size={18} />
          </button>
        </div>

        {/* REQUEST TYPE */}
        <div className="request-type-grid">
          {(
            [
              'COMPLAINT',
              'SUGGESTION',
              'INQUIRY',
              'BOOKING',
            ] as RequestType[]
          ).map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => changeRequestType(item)}
              className={
                type === item ? 'is-selected' : ''
              }
            >
              <strong>
                {item[0] +
                  item.slice(1).toLowerCase()}
              </strong>

              <small>
                {item === 'COMPLAINT'
                  ? 'Report a local problem'
                  : item === 'SUGGESTION'
                    ? 'Propose an improvement'
                    : item === 'INQUIRY'
                      ? 'Ask for information'
                      : 'Reserve a public place'}
              </small>
            </button>
          ))}
        </div>

        <div className="form-grid">
          {/* LOCATION */}
          <label className="form-field form-field--full">
            <span>Mapped location</span>

            {mapLocation && type !== 'BOOKING' ? (
              <div className="flex min-h-[62px] items-center gap-3 rounded-[14px] border border-teal-300 bg-teal-50/60 px-4 py-2.5 shadow-[0_0_0_3px_rgba(20,184,166,.05)]">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-100 text-teal-700">
                  <MapPin size={18} />
                </span>

                <div className="min-w-0 flex-1">
                  <strong className="block truncate text-[11px] font-bold text-slate-900">
                    {mapLocation.label ||
                      'Pinned map location'}
                  </strong>

                  <small className="mt-1 block text-[9px] text-slate-500">
                    {mapLocation.latitude.toFixed(6)}
                    {' , '}
                    {mapLocation.longitude.toFixed(6)}
                  </small>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[7px] font-extrabold uppercase tracking-[.08em] text-emerald-700">
                    Pinned
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setMapLocation(null)
                    }
                    className="border-0 bg-transparent p-0 text-[8px] font-bold text-slate-500 shadow-none outline-none transition hover:text-teal-700"
                  >
                    Choose building
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={buildingId}
                  onChange={(event) => {
                    setBuildingId(event.target.value)
                    setMapLocation(null)
                    setError('')
                  }}
                  className="!m-0 !h-[50px] !w-full !appearance-none !rounded-[13px] !border !border-solid !border-slate-200 !bg-white !px-4 !pr-11 !text-[12px] !font-medium !text-slate-800 !shadow-none !outline-none transition focus:!border-teal-500 focus:!ring-4 focus:!ring-teal-500/10"
                  style={{
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    backgroundImage: 'none',
                  }}
                >
                  <option value="">
                    {type === 'BOOKING'
                      ? 'Select a public facility'
                      : 'Select a mapped location'}
                  </option>

                  {buildings.map((building) => (
                    <option
                      value={building.id}
                      key={building.id}
                      disabled={
                        type === 'BOOKING' &&
                        !building.publicFacility
                      }
                    >
                      {building.name}
                      {building.address
                        ? ` — ${building.address}`
                        : ''}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={17}
                  strokeWidth={1.8}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
              </div>
            )}

            {type === 'BOOKING' &&
              selected &&
              !selected.publicFacility && (
                <small className="field-warning">
                  Bookings are only available for eligible
                  public facilities.
                </small>
              )}
          </label>

          {/* SUBJECT */}
          <label className="form-field form-field--full">
            <span>Subject</span>
            <input
              placeholder="Short, clear summary"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
            />
          </label>

          {/* DESCRIPTION */}
          <label className="form-field form-field--full">
            <span>Description</span>
            <textarea
              rows={4}
              placeholder="Describe what you observed and any useful details…"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
            />
          </label>

          {/* BOOKING */}
          {type === 'BOOKING' && (
            <>
              <label className="form-field">
                <span>Booking date</span>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(event) =>
                    setBookingDate(event.target.value)
                  }
                />
              </label>

              <label className="form-field">
                <span>Participants</span>
                <input
                  type="number"
                  placeholder="45"
                  min="1"
                  value={participants}
                  onChange={(event) =>
                    setParticipants(event.target.value)
                  }
                />
              </label>
            </>
          )}

          {/* CONTACT PREFERENCE */}
          <label className="form-field form-field--full">
            <span>Contact preference</span>

            <div className="relative">
              <select
                value={contactPreference}
                onChange={(event) =>
                  setContactPreference(
                    event.target.value as
                      | 'PORTAL'
                      | 'EMAIL',
                  )
                }
                className="!m-0 !h-[50px] !w-full !appearance-none !rounded-[13px] !border !border-solid !border-slate-200 !bg-white !px-4 !pr-11 !text-[12px] !font-medium !text-slate-800 !shadow-none !outline-none transition focus:!border-teal-500 focus:!ring-4 focus:!ring-teal-500/10"
                style={{
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  backgroundImage: 'none',
                }}
              >
                <option value="PORTAL">
                  Portal notifications
                </option>
                <option value="EMAIL">
                  Email
                </option>
              </select>

              <ChevronDown
                size={17}
                strokeWidth={1.8}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </div>
          </label>
        </div>

        {/* UPLOAD */}
        <div className="mt-4">
          <div className="flex min-h-[82px] items-center justify-between gap-4 rounded-[16px] border border-dashed border-slate-300 bg-slate-50/60 px-5 py-4 transition hover:border-teal-400 hover:bg-teal-50/30">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700">
                <Camera size={20} />
              </span>

              <span className="min-w-0">
                <strong className="block text-[11px] font-bold text-slate-900">
                  Add photos or evidence
                </strong>

                <small className="mt-1 block text-[9px] text-slate-400">
                  {files.length
                    ? `${files.length} of 5 files selected`
                    : 'PNG, JPG or PDF · up to 5 files'}
                </small>
              </span>
            </div>

            <input
              ref={fileInput}
              hidden
              type="file"
              accept="image/png,image/jpeg,application/pdf"
              multiple
              onChange={(event) =>
                handleFiles(event.target.files)
              }
            />

            <button
              type="button"
              onClick={() =>
                fileInput.current?.click()
              }
              className="flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[10px] font-bold text-slate-800 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800"
            >
              <Paperclip size={15} />
              Choose files
            </button>
          </div>

          {/* PREVIEWS */}
          {previews.length > 0 && (
            <div className="mt-3 grid grid-cols-5 gap-2.5 max-md:grid-cols-4 max-sm:grid-cols-3">
              {previews.map((preview) => (
                <div
                  key={`${preview.file.name}-${preview.index}`}
                  className="group relative aspect-square min-w-0 overflow-hidden rounded-[13px] border border-slate-200 bg-slate-100"
                >
                  {preview.url ? (
                    <img
                      src={preview.url}
                      alt={preview.file.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-slate-50 p-2 text-center">
                      <FileText
                        size={23}
                        className="text-red-500"
                      />
                      <span className="max-w-full truncate text-[8px] font-semibold text-slate-500">
                        {preview.file.name}
                      </span>
                    </div>
                  )}

                  {preview.url && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-2 pb-2 pt-5">
                      <span className="block truncate text-[7px] font-semibold text-white">
                        {preview.file.name}
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    aria-label={`Remove ${preview.file.name}`}
                    onClick={() =>
                      removeFile(preview.index)
                    }
                    className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full border border-white/30 bg-slate-950/75 text-white opacity-0 shadow-lg backdrop-blur-md transition hover:bg-red-500 group-hover:opacity-100 max-sm:opacity-100"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <small className="field-warning mt-3 block">
            {error}
          </small>
        )}

        {/* FOOTER */}
        <div className="request-modal__footer">
          <span>
            <MapPin size={15} />
            {mapLocation
              ? `Pinned at ${mapLocation.latitude.toFixed(5)}, ${mapLocation.longitude.toFixed(5)}`
              : selected
                ? `Pinned to ${selected.name}`
                : 'Select or pin a mapped location'}
          </span>

          <button
            type="button"
            className="primary-btn"
            disabled={
              !canBook ||
              !hasLocation ||
              submitting
            }
            onClick={submit}
          >
            <Send size={16} />
            {submitting
              ? 'Submitting…'
              : 'Submit request'}
          </button>
        </div>
      </div>
    </div>
  )
}