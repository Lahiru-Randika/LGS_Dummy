import {
  CheckCircle2,
  ClipboardCheck,
  Eye,
  Filter,
  LayoutGrid,
  Plus,
  Search,
  SlidersHorizontal,
  UserCheck,
  Wrench,
} from 'lucide-react'
import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useSearchParams } from 'react-router-dom'

import { PageHeader } from '../components/PageHeader'
import { RequestCard } from '../components/RequestCard'
import { RequestFormModal } from '../components/RequestFormModal'
import { useAuth } from '../context/AuthContext'
import { requestsService } from '../services/requests.service'
import type { ServiceRequest } from '../types'

/* =========================================================
   TYPES
========================================================= */

type StageKey =
  | 'ALL'
  | 'CREATED'
  | 'UNDER_REVIEW'
  | 'ASSIGNED'
  | 'INSPECTING'
  | 'AWAITING_APPROVAL'
  | 'RESOLVED'

type StageDefinition = {
  key: StageKey
  label: string
  description: string
  icon: typeof LayoutGrid
}

/* =========================================================
   WORKFLOW
========================================================= */

const stages: StageDefinition[] = [
  {
    key: 'ALL',
    label: 'All',
    description: 'All requests',
    icon: LayoutGrid,
  },
  {
    key: 'CREATED',
    label: 'New',
    description: 'Recently submitted',
    icon: ClipboardCheck,
  },
  {
    key: 'UNDER_REVIEW',
    label: 'Review',
    description: 'Being reviewed',
    icon: Eye,
  },
  {
    key: 'ASSIGNED',
    label: 'Assigned',
    description: 'Officer assigned',
    icon: UserCheck,
  },
  {
    key: 'INSPECTING',
    label: 'Inspecting',
    description: 'Field work',
    icon: Wrench,
  },
  {
    key: 'AWAITING_APPROVAL',
    label: 'For approval',
    description: 'Waiting for approval',
    icon: SlidersHorizontal,
  },
  {
    key: 'RESOLVED',
    label: 'Resolved',
    description: 'Completed cases',
    icon: CheckCircle2,
  },
]

/* =========================================================
   COMPONENT
========================================================= */

export function RequestsPage() {
  const { user } = useAuth()

  const [params, setParams] =
    useSearchParams()

  const [search, setSearch] =
    useState('')

  const [type, setType] =
    useState('ALL')

  const [activeStage, setActiveStage] =
    useState<StageKey>('ALL')

  const [showNew, setShowNew] =
    useState(
      params.get('new') === '1',
    )

  const [requests, setRequests] =
    useState<ServiceRequest[]>([])

  const [loading, setLoading] =
    useState(true)

  if (!user) return null

  /* =========================================================
     LOAD
  ========================================================= */

  async function loadRequests() {
    try {
      setLoading(true)

      const result =
        await requestsService.list({
          limit: 100,
        })

      setRequests(result.items)
    } catch (error) {
      console.error(
        'Unable to load requests',
        error,
      )

      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadRequests()
  }, [user.id])

  /* =========================================================
     SEARCH / TYPE FILTER
  ========================================================= */

  const searchableRequests =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLowerCase()

      return requests.filter(
        (request) => {
          const matchesType =
            type === 'ALL' ||
            request.type === type

          const searchableText = [
            request.id,
            request.title,
            request.locationLabel,
            request.department,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()

          const matchesSearch =
            !searchValue ||
            searchableText.includes(
              searchValue,
            )

          return (
            matchesType &&
            matchesSearch
          )
        },
      )
    }, [
      requests,
      search,
      type,
    ])

  /* =========================================================
     STAGE COUNT
  ========================================================= */

  function getStageCount(
    stage: StageDefinition,
  ) {
    if (stage.key === 'ALL') {
      return searchableRequests.length
    }

    return searchableRequests.filter(
      (request) =>
        request.status === stage.key,
    ).length
  }

  /* =========================================================
     VISIBLE REQUESTS
  ========================================================= */

  const visibleRequests =
    useMemo(() => {
      if (activeStage === 'ALL') {
        return searchableRequests
      }

      return searchableRequests.filter(
        (request) =>
          request.status ===
          activeStage,
      )
    }, [
      searchableRequests,
      activeStage,
    ])

  const activeStageInfo =
    stages.find(
      (stage) =>
        stage.key === activeStage,
    ) ?? stages[0]

  /* =========================================================
     PAGE DETAILS
  ========================================================= */

  const isCitizen =
    user.role === 'CITIZEN'

  const title =
    isCitizen
      ? 'My requests'
      : user.role === 'GOV_WORKER'
        ? 'Assigned requests'
        : 'Municipal request queue'

  const description =
    isCitizen
      ? 'Track everything you have reported, suggested, asked or booked.'
      : user.role === 'GOV_WORKER'
        ? 'Your active service work and inspection queue.'
        : 'Review and manage municipal requests through each stage of the workflow.'

  /* =========================================================
     MODAL
  ========================================================= */

  function closeModal() {
    setShowNew(false)

    params.delete('new')

    setParams(
      params,
      {
        replace: true,
      },
    )
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="page">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <PageHeader
        eyebrow="Service workflow"
        title={title}
        description={description}
        actions={
          isCitizen ? (
            <button
              type="button"
              className="primary-btn"
              onClick={() =>
                setShowNew(true)
              }
            >
              <Plus size={16} />

              Create request
            </button>
          ) : undefined
        }
      />

      {/* =====================================================
          FILTERS
      ====================================================== */}

      <section
        className="
          mt-5
          rounded-[18px]
          border border-slate-200
          bg-white
          p-2
          shadow-[0_6px_24px_rgba(15,23,42,0.035)]
        "
      >
        <div
          className="
            flex
            flex-col
            gap-2
            lg:flex-row
            lg:items-center
          "
        >
          {/* Search */}
          <div
            className="
              group
              flex h-[40px]
              min-w-0
              flex-1
              items-center
              gap-2.5
              rounded-[12px]
              border border-slate-200
              bg-slate-50/70
              px-3.5
              transition-all

              focus-within:border-teal-200
              focus-within:bg-white
              focus-within:shadow-[0_0_0_3px_rgba(20,184,166,.06)]
            "
          >
            <Search
              size={16}
              className="
                shrink-0
                text-slate-400
                transition
                group-focus-within:text-teal-600
              "
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search ID, issue, place or department..."
              className="
                h-full
                min-w-0
                flex-1
                border-0
                bg-transparent
                text-[11px]
                font-medium
                text-slate-700
                outline-none
                placeholder:text-slate-400
              "
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="
                  border-0
                  bg-transparent
                  px-2
                  text-[9px]
                  font-bold
                  text-slate-400
                  outline-none
                  hover:text-slate-600
                "
              >
                Clear
              </button>
            )}
          </div>

          {/* Type */}
          <div
            className="
              flex h-[40px]
              min-w-[160px]
              items-center
              gap-2
              rounded-[12px]
              border border-slate-200
              bg-white
              px-3
            "
          >
            <Filter
              size={15}
              className="shrink-0 text-slate-400"
            />

            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value)
              }
              className="
                h-full
                flex-1
                cursor-pointer
                border-0
                bg-transparent
                text-[10px]
                font-bold
                text-slate-600
                outline-none
              "
            >
              <option value="ALL">All types</option>
              <option value="COMPLAINT">Complaints</option>
              <option value="SUGGESTION">Suggestions</option>
              <option value="INQUIRY">Inquiries</option>
              <option value="BOOKING">Bookings</option>
            </select>
          </div>

          {/* Count */}
          <span
            className="
              whitespace-nowrap
              px-3
              text-[9px]
              font-bold
              text-slate-400
            "
          >
            {searchableRequests.length}{' '}
            {searchableRequests.length === 1
              ? 'request'
              : 'requests'}
          </span>
        </div>
      </section>

      {/* =====================================================
          WORKFLOW NAVIGATION
      ====================================================== */}

      <section
        className="
          mt-5
          overflow-hidden
          rounded-[24px]
          border border-slate-200/80
          bg-white
          shadow-[0_16px_45px_rgba(15,23,42,.055)]
        "
      >
        {/* Header */}

        <div
          className="
            flex
            flex-wrap
            items-center
            justify-between
            gap-4
            border-b
            border-slate-100
            px-6 py-4
          "
        >
          <div>
            <span
              className="
                text-[9px]
                font-extrabold
                uppercase
                tracking-[.16em]
                text-teal-600
              "
            >
              Request workflow
            </span>

            <p
              className="
                mt-1
                text-[10px]
                font-semibold
                text-slate-400
              "
            >
              Select a stage to view
              its requests
            </p>
          </div>

          <span
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-slate-50
              px-4 py-2
              text-[9px]
              font-bold
              text-slate-500
            "
          >
            <span
              className="
                h-1.5 w-1.5
                rounded-full
                bg-teal-500
              "
            />

            {requests.length} total{' '}

            {requests.length === 1
              ? 'request'
              : 'requests'}
          </span>
        </div>

        {/* =================================================
            CLEAN WORKFLOW STAGE BAR
        ================================================== */}

        <div className="overflow-x-auto">
          <div
            className="
              flex
              min-w-[850px]
              items-stretch
              px-4
            "
          >
            {stages.map((stage) => {
              const Icon = stage.icon
              const count = getStageCount(stage)
              const active = activeStage === stage.key

              return (
                <button
                  key={stage.key}
                  type="button"
                  onClick={() => setActiveStage(stage.key)}
                  className={`
                    group
                    relative
                    flex
                    min-w-[118px]
                    flex-1
                    flex-col
                    items-center
                    justify-center
                    border-0
                    outline-none
                    px-3
                    pb-4
                    pt-5
                    text-center
                    transition-all
                    duration-200

                    focus:outline-none
                    focus-visible:outline-none
                    focus-visible:ring-0

                    ${
                      active
                        ? 'bg-teal-50/60'
                        : 'bg-transparent hover:bg-slate-50/70'
                    }
                  `}
                >
                  {/* ICON + COUNT */}

                  <span className="relative inline-flex">
                    <span
                      className={`
                        grid
                        h-11 w-11
                        place-items-center
                        rounded-[13px]
                        border
                        transition-all
                        duration-200

                        ${
                          active
                            ? `
                                border-teal-500
                                bg-teal-500
                                text-white
                                shadow-[0_8px_20px_rgba(13,148,136,.20)]
                              `
                            : `
                                border-slate-200
                                bg-white
                                text-slate-500
                                shadow-[0_3px_10px_rgba(15,23,42,.06)]

                                group-hover:border-slate-300
                                group-hover:text-slate-700
                                group-hover:shadow-[0_5px_14px_rgba(15,23,42,.08)]
                              `
                        }
                      `}
                    >
                      <Icon
                        size={17}
                        strokeWidth={1.8}
                      />
                    </span>

                    {/* COUNT BADGE */}

                    <span
                      className={`
                        absolute
                        -right-3
                        -top-2

                        flex
                        min-w-[23px]
                        items-center
                        justify-center

                        rounded-full
                        border-2
                        border-white

                        px-1.5
                        py-[3px]

                        text-[8px]
                        font-extrabold

                        shadow-sm

                        ${
                          active
                            ? `
                                bg-teal-600
                                text-white
                              `
                            : `
                                bg-slate-100
                                text-slate-500
                              `
                        }
                      `}
                    >
                      {count}
                    </span>
                  </span>

                  {/* LABEL */}

                  <strong
                    className={`
                      mt-3
                      block
                      whitespace-nowrap

                      text-[10px]
                      font-extrabold

                      transition-colors

                      ${
                        active
                          ? 'text-teal-800'
                          : 'text-slate-700'
                      }
                    `}
                  >
                    {stage.label}
                  </strong>

                  {/* ACTIVE INDICATOR */}

                  <span
                    className={`
                      absolute
                      bottom-0
                      left-1/2

                      h-[3px]
                      -translate-x-1/2
                      rounded-t-full

                      transition-all
                      duration-200

                      ${
                        active
                          ? 'w-[44px] bg-teal-500 opacity-100'
                          : 'w-0 bg-transparent opacity-0'
                      }
                    `}
                  />
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          SELECTED STAGE / RESULT HEADER
      ====================================================== */}

      <section
        className="
          mt-6
          flex
          flex-wrap
          items-end
          justify-between
          gap-4
        "
      >
        <div>
          <div
            className="
              flex
              items-center
              gap-2
              text-[8px]
              font-extrabold
              uppercase
              tracking-[.14em]
              text-teal-600
            "
          >
            <span
              className="
                h-1.5 w-1.5
                rounded-full
                bg-teal-500
              "
            />

            {activeStage === 'ALL'
              ? 'Request overview'
              : 'Selected workflow stage'}
          </div>

          <div
            className="
              mt-1.5
              flex
              flex-wrap
              items-baseline
              gap-x-3
              gap-y-1
            "
          >
            <h2
              className="
                text-[20px]
                font-extrabold
                tracking-[-.025em]
                text-slate-900
              "
            >
              {activeStageInfo.label}
            </h2>

            <span
              className="
                text-[10px]
                font-medium
                text-slate-400
              "
            >
              {
                activeStageInfo.description
              }
            </span>
          </div>
        </div>

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          {activeStage !== 'ALL' && (
            <button
              type="button"
              onClick={() =>
                setActiveStage(
                  'ALL',
                )
              }
              className="
                rounded-full
                px-3 py-1.5
                text-[9px]
                font-bold
                text-slate-500
                transition
                hover:bg-white
                hover:text-slate-700
              "
            >
              View all
            </button>
          )}

          <span
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-slate-200
              bg-white
              px-3 py-1.5
              text-[9px]
              font-extrabold
              text-slate-600
              shadow-sm
            "
          >
            <span
              className="
                h-1.5 w-1.5
                rounded-full
                bg-teal-500
              "
            />

            {visibleRequests.length}

            {visibleRequests.length ===
            1
              ? ' request'
              : ' requests'}
          </span>
        </div>
      </section>

      <div
        className="
          mb-4
          mt-3
          h-px
          bg-slate-200/80
        "
      />

      {/* =====================================================
          LOADING
      ====================================================== */}

      {loading ? (
        <div className="request-grid">
          {[1, 2, 3].map(
            (item) => (
              <div
                key={item}
                className="
                  min-h-[190px]
                  animate-pulse
                  rounded-[20px]
                  border
                  border-slate-200
                  bg-white
                  p-5
                "
              >
                <div
                  className="
                    h-5 w-24
                    rounded-full
                    bg-slate-100
                  "
                />

                <div
                  className="
                    mt-8
                    h-3 w-28
                    rounded
                    bg-slate-100
                  "
                />

                <div
                  className="
                    mt-3
                    h-6 w-3/5
                    rounded
                    bg-slate-100
                  "
                />

                <div
                  className="
                    mt-8
                    h-3 w-2/5
                    rounded
                    bg-slate-100
                  "
                />
              </div>
            ),
          )}
        </div>
      ) : visibleRequests.length >
        0 ? (
        /* =================================================
           REQUESTS
        ================================================== */

        <div className="request-grid">
          {visibleRequests.map(
            (request) => (
              <RequestCard
                key={request.id}
                request={request}
              />
            ),
          )}
        </div>
      ) : (
        /* =================================================
           EMPTY
        ================================================== */

        <div
          className="
            flex
            min-h-[210px]
            items-center
            justify-center
            rounded-[22px]
            border
            border-dashed
            border-slate-200
            bg-white/70
            px-6
          "
        >
          <div className="text-center">
            <span
              className="
                mx-auto
                grid h-12 w-12
                place-items-center
                rounded-[15px]
                border
                border-slate-100
                bg-white
                text-slate-300
                shadow-sm
              "
            >
              <Search size={20} />
            </span>

            <strong
              className="
                mt-3
                block
                text-[12px]
                font-extrabold
                text-slate-700
              "
            >
              No requests found
            </strong>

            <p
              className="
                mx-auto
                mt-1
                max-w-[300px]
                text-[10px]
                leading-5
                text-slate-400
              "
            >
              {search ||
              type !== 'ALL'
                ? 'No requests match the current search and filters.'
                : `There are currently no requests in the ${activeStageInfo.label.toLowerCase()} stage.`}
            </p>

            {(search ||
              type !== 'ALL' ||
              activeStage !==
                'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setType('ALL')
                  setActiveStage(
                    'ALL',
                  )
                }}
                className="
                  mt-4
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4 py-2
                  text-[9px]
                  font-extrabold
                  text-slate-600
                  shadow-sm
                  transition
                  hover:border-slate-300
                  hover:bg-slate-50
                "
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          NEW REQUEST MODAL
      ====================================================== */}

      {showNew && (
        <RequestFormModal
          onClose={closeModal}
          onCreated={() => {
            closeModal()
            void loadRequests()
          }}
        />
      )}
    </div>
  )
}