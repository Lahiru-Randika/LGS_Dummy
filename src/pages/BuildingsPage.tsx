import {
  Building2,
  LoaderCircle,
  MapPin,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react'

import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  Link,
} from 'react-router-dom'

import {
  PageHeader,
} from '../components/PageHeader'

import {
  useAuth,
} from '../context/AuthContext'

import {
  buildingsService,
} from '../services/buildings.service'

import {
  taxService,
} from '../services/tax.service'

import {
  searchPlaces,
} from '../services/osmGeocoding'

import type {
  Building,
} from '../types'

/* =========================================================
   COORDINATE SEARCH

   Supported examples:

   6.910250, 79.861400
   6.910250 79.861400
========================================================= */

function parseCoordinates(
  value:
    string,
):
  {
    latitude:
      number

    longitude:
      number
  } |
  null {
  const match =
    value
      .trim()
      .match(
        /^(-?\d+(?:\.\d+)?)\s*[,\s]\s*(-?\d+(?:\.\d+)?)$/,
      )

  if (
    !match
  ) {
    return null
  }

  const latitude =
    Number(
      match[1],
    )

  const longitude =
    Number(
      match[2],
    )

  if (
    !Number.isFinite(
      latitude,
    ) ||
    !Number.isFinite(
      longitude,
    ) ||
    latitude <
      -90 ||
    latitude >
      90 ||
    longitude <
      -180 ||
    longitude >
      180
  ) {
    return null
  }

  return {
    latitude,
    longitude,
  }
}

/* =========================================================
   COMPONENT
========================================================= */

export function BuildingsPage() {
  const {
    can,
  } =
    useAuth()

  const [
    buildings,
    setBuildings,
  ] =
    useState<
      Building[]
    >([])

  const [
    search,
    setSearch,
  ] =
    useState(
      '',
    )

  const [
    loading,
    setLoading,
  ] =
    useState(
      false,
    )

  const [
    taxLoading,
    setTaxLoading,
  ] =
    useState(
      false,
    )

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null)

  const [
    total,
    setTotal,
  ] =
    useState(
      0,
    )

  /*
    Every new search receives a new sequence number.

    If an old API call finishes later than a newer one,
    its result is ignored.
  */
  const searchSequenceRef =
    useRef(
      0,
    )

  /* =======================================================
     SEARCH

     IMPORTANT:

     - No search on initial page load.
     - Search starts only when user enters >= 1 character.
     - 450ms debounce.
     - Maximum 20 results.
  ======================================================= */

  useEffect(
    () => {
      const query =
        search.trim()

      /*
        EMPTY SEARCH

        Do not call the backend.
      */
      if (
        query.length ===
        0
      ) {
        searchSequenceRef.current +=
          1

        setBuildings(
          [],
        )

        setTotal(
          0,
        )

        setLoading(
          false,
        )

        setTaxLoading(
          false,
        )

        setError(
          null,
        )

        return
      }

      /*
        Give this search its own sequence.
      */
      const sequence =
        ++searchSequenceRef.current

      const timeout =
        window.setTimeout(
          async () => {
            try {
              setLoading(
                true,
              )

              setError(
                null,
              )

              const coordinates =
                parseCoordinates(
                  query,
                )

              /* =========================================
                 MAIN BUILDING SEARCH

                 Only ONE API request here.
              ========================================== */

              const result =
                await buildingsService.list(
                  coordinates
                    ? {
                        latitude:
                          coordinates.latitude,

                        longitude:
                          coordinates.longitude,

                        radiusMeters:
                          250,

                        page:
                          1,

                        limit:
                          20,
                      }
                    : {
                        search:
                          query,

                        page:
                          1,

                        limit:
                          20,
                      },
                )

              /*
                Start with whatever Aiven already knows.
              */
              let items =
                result.items

              /* =====================================================
                OSM FALLBACK

                Only call OSM when:

                - DB returned nothing
                - this is a text search
                - user typed at least 3 characters

                Example:

                "nelum"
                    ↓
                DB search
                    ↓
                if 0 → OSM search
                    ↓
                match OSM point to CMC polygon
                    ↓
                cache result in DB
              ===================================================== */

              if (
                items.length ===
                  0 &&
                !coordinates &&
                query.length >=
                  3
              ) {
                try {
                  const osmResults =
                    await searchPlaces(
                      query,
                    )

                  const matchedBuildings:
                    Building[] = []

                  /*
                    Don't process too many OSM results.

                    Usually the correct landmark will be near
                    the top of the search results.
                  */
                  for (
                    const place of osmResults.slice(
                      0,
                      5,
                    )
                  ) {
                    const buildingType =
                      [
                        place.type,
                        place.category,
                      ]
                        .filter(
                          Boolean,
                        )
                        .filter(
                          (
                            value,
                            index,
                            array,
                          ) =>
                            array.indexOf(
                              value,
                            ) ===
                            index,
                        )
                        .join(
                          ' · ',
                        )

                    const matched =
                      await buildingsService.matchOsmPlace(
                        {
                          latitude:
                            place.latitude,

                          longitude:
                            place.longitude,

                          name:
                            place.name,

                          address:
                            place.shortAddress ||
                            place.displayName ||
                            null,

                          buildingType:
                            buildingType ||
                            null,
                        },
                      )

                    if (
                      matched &&
                      !matchedBuildings.some(
                        (
                          existing,
                        ) =>
                          existing.id ===
                          matched.id,
                      )
                    ) {
                      matchedBuildings.push(
                        matched,
                      )
                    }
                  }

                  /*
                    If OSM successfully matched one or more
                    CMC building polygons, use those results.
                  */
                  if (
                    matchedBuildings.length >
                    0
                  ) {
                    items =
                      matchedBuildings
                  }
                } catch (
                  osmError
                ) {
                  /*
                    Don't break normal building search
                    just because OSM failed.
                  */
                  console.warn(
                    'OSM building fallback failed.',
                    osmError,
                  )
                }
              }

              /*
                The user may have already typed something else
                while OSM was working.
              */
              if (
                sequence !==
                searchSequenceRef.current
              ) {
                return
              }

              /*
                Show building results immediately.
              */
              setBuildings(
                items,
              )

              setTotal(
                items.length !==
                  result.items.length
                  ? items.length
                  : Number(
                      result.meta?.total ??
                        items.length,
                    ),
              )

              setLoading(
                false,
              )

              /* =========================================
                 TAX ENRICHMENT

                 This runs AFTER building results are
                 already visible.

                 It does not keep the main search spinner
                 running.
              ========================================== */

              if (
                !can(
                  'tax.read',
                ) ||
                items.length ===
                  0
              ) {
                return
              }

              setTaxLoading(
                true,
              )

              const enriched =
                await Promise.all(
                  items.map(
                    async (
                      building,
                    ) => {
                      try {
                        const property =
                          await taxService.property(
                            building.id,
                          )

                        const status =
                          String(
                            property.taxStatus ||
                              '',
                          ).toUpperCase()

                        return {
                          ...building,

                          propertyId:
                            String(
                              property.propertyCode ||
                                'Unavailable',
                            ),

                          taxId:
                            String(
                              property.taxCode ||
                                'Unavailable',
                            ),

                          taxStatus:
                            (
                              status ===
                              'EXEMPT'
                                ? 'Exempt'
                                : Number(
                                      property.currentBalance,
                                    ) >
                                    0
                                  ? 'Outstanding'
                                  : 'Current'
                            ) as Building['taxStatus'],

                          assessmentValue:
                            property.assessmentValue ==
                            null
                              ? 'Unavailable'
                              : `Rs. ${Number(
                                  property.assessmentValue,
                                ).toLocaleString()}`,
                        }
                      } catch {
                        /*
                          Building search still works even
                          if tax data is unavailable.
                        */
                        return {
                          ...building,

                          propertyId:
                            'Unavailable',

                          taxId:
                            'Unavailable',

                          taxStatus:
                            'Unavailable' as const,

                          assessmentValue:
                            'Unavailable',
                        }
                      }
                    },
                  ),
                )

              /*
                User might have started another search while
                tax requests were running.
              */
              if (
                sequence !==
                searchSequenceRef.current
              ) {
                return
              }

              setBuildings(
                enriched,
              )
            } catch (
              searchError
            ) {
              if (
                sequence !==
                searchSequenceRef.current
              ) {
                return
              }

              console.error(
                'Unable to search buildings',
                searchError,
              )

              setBuildings(
                [],
              )

              setTotal(
                0,
              )

              setError(
                'Unable to search building information.',
              )
            } finally {
              if (
                sequence ===
                searchSequenceRef.current
              ) {
                setLoading(
                  false,
                )

                setTaxLoading(
                  false,
                )
              }
            }
          },

          /*
            User must stop typing for 450 ms
            before the request is made.
          */
          450,
        )

      return () => {
        window.clearTimeout(
          timeout,
        )
      }
    },
    [
      search,
      can,
    ],
  )

  const query =
    search.trim()

  const coordinates =
    parseCoordinates(
      query,
    )

  /* =======================================================
     CLEAR SEARCH
  ======================================================= */

  function clearSearch() {
    searchSequenceRef.current +=
      1

    setSearch(
      '',
    )

    setBuildings(
      [],
    )

    setTotal(
      0,
    )

    setLoading(
      false,
    )

    setTaxLoading(
      false,
    )

    setError(
      null,
    )
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div
      className="page"
    >
      {/* ===================================================
          HEADER
      ==================================================== */}

      <PageHeader
        eyebrow="Municipal assets"
        title="Buildings & properties"
        description="Mapped public and authorized administrative information connected to municipal service history."
        actions={
          <Link
            to="/app/map"
            className="secondary-btn"
          >
            <MapPin
              size={
                16
              }
            />

            View on map
          </Link>
        }
      />

      {/* ===================================================
          SECURITY
      ==================================================== */}

      <div
        className="security-banner security-banner--soft"
      >
        <ShieldCheck
          size={
            20
          }
        />

        <div>
          <strong>
            Authorized data view
          </strong>

          <p>
            This screen includes property and tax metadata and should only be populated by secure backend responses for permitted roles.
          </p>
        </div>
      </div>

      {/* ===================================================
          SEARCH
      ==================================================== */}

      <div
        className="filter-bar"
      >
        <div
          className="search-field"
        >
          {loading ? (
            <LoaderCircle
              size={
                17
              }
              className="animate-spin text-teal-700"
            />
          ) : (
            <Search
              size={
                17
              }
            />
          )}

          <input
            type="text"
            placeholder="Search name, building ID, address or latitude, longitude…"
            value={
              search
            }
            onChange={(
              event,
            ) => {
              setSearch(
                event.target.value,
              )
            }}
            autoComplete="off"
          />

          {search && (
            <button
              type="button"
              aria-label="Clear building search"
              onClick={
                clearSearch
              }
              className="
                grid
                h-7
                w-7
                shrink-0
                cursor-pointer
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
              <X
                size={
                  14
                }
              />
            </button>
          )}
        </div>

        {/* ===============================================
            SEARCH STATUS
        ================================================ */}

        <div
          className="
            mt-2
            flex
            min-h-[20px]
            flex-wrap
            items-center
            justify-between
            gap-2
            px-1
            text-[9px]
            text-slate-400
          "
        >
          {!query ? (
            <span>
              Start typing to search by building name, ID, address or coordinates
            </span>
          ) : loading ? (
            <span>
              Searching for &quot;{query}&quot;...
            </span>
          ) : coordinates ? (
            <span>
              Buildings within 250 m of{' '}
              {coordinates.latitude},{' '}
              {coordinates.longitude}
            </span>
          ) : (
            <span>
              Results for &quot;{query}&quot;
            </span>
          )}

          {query &&
            !loading && (
              <div
                className="flex items-center gap-2"
              >
                {taxLoading && (
                  <span
                    className="flex items-center gap-1 text-slate-400"
                  >
                    <LoaderCircle
                      size={
                        10
                      }
                      className="animate-spin"
                    />

                    Loading tax data
                  </span>
                )}

                <strong
                  className="text-slate-500"
                >
                  {total}{' '}
                  {total ===
                  1
                    ? 'building'
                    : 'buildings'}
                </strong>
              </div>
            )}
        </div>
      </div>

      {/* ===================================================
          INITIAL STATE

          This replaces the pointless loading state that
          appeared when the page first opened.
      ==================================================== */}

      {!query && (
        <div
          className="
            mt-5
            flex
            min-h-[220px]
            flex-col
            items-center
            justify-center
            px-5
            text-center
          "
        >
          <span
            className="
              grid
              h-12
              w-12
              place-items-center
              rounded-2xl
              bg-white
              text-slate-400
              shadow-sm
            "
          >
            <Search
              size={
                21
              }
            />
          </span>

          <strong
            className="mt-3 text-[12px] text-slate-700"
          >
            Search municipal buildings
          </strong>

          <p
            className="
              mt-1
              max-w-md
              text-[10px]
              leading-5
              text-slate-400
            "
          >
            Enter a building name, LGS building ID, CMC ID, address or latitude and longitude.
          </p>
        </div>
      )}

      {/* ===================================================
          SEARCH LOADING

          Only displayed AFTER user has typed.
      ==================================================== */}

      {query &&
        loading &&
        !buildings.length && (
          <div
            className="
              flex
              min-h-[220px]
              items-center
              justify-center
              gap-2
              text-[11px]
              text-slate-500
            "
          >
            <LoaderCircle
              size={
                18
              }
              className="animate-spin text-teal-700"
            />

            Searching buildings...
          </div>
        )}

      {/* ===================================================
          ERROR
      ==================================================== */}

      {query &&
        error && (
          <div
            className="
              mt-4
              rounded-xl
              border
              border-red-100
              bg-red-50
              px-4
              py-3
              text-[10px]
              font-semibold
              text-red-700
            "
          >
            {error}
          </div>
        )}

      {/* ===================================================
          EMPTY SEARCH RESULT
      ==================================================== */}

      {query &&
        !loading &&
        !error &&
        buildings.length ===
          0 && (
          <div
            className="
              mt-5
              flex
              min-h-[260px]
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-dashed
              border-slate-200
              bg-white
              px-5
              text-center
            "
          >
            <span
              className="
                grid
                h-12
                w-12
                place-items-center
                rounded-xl
                bg-slate-50
                text-slate-400
              "
            >
              <Building2
                size={
                  21
                }
              />
            </span>

            <strong
              className="mt-3 text-[12px] text-slate-800"
            >
              No buildings found
            </strong>

            <p
              className="
                mt-1
                max-w-sm
                text-[10px]
                leading-5
                text-slate-400
              "
            >
              Try a building name, CMC/LGS building ID, address or coordinates such as 6.910250, 79.861400.
            </p>
          </div>
        )}

      {/* ===================================================
          RESULTS
      ==================================================== */}

      {query &&
        buildings.length >
          0 && (
          <div
            className="building-grid"
          >
            {buildings.map(
              (
                building,
              ) => {
                const longitude =
                  building
                    .center?.[
                    0
                  ] ??
                  0

                const latitude =
                  building
                    .center?.[
                    1
                  ] ??
                  0

                return (
                  <article
                    className="building-card"
                    key={
                      building.id
                    }
                  >
                    <div
                      className="building-card__top"
                    >
                      <span
                        className="building-icon"
                      >
                        <Building2
                          size={
                            20
                          }
                        />
                      </span>

                      {building.taxStatus && (
                        <span
                          className={`tax-state tax-state--${String(
                            building.taxStatus,
                          )
                            .toLowerCase()
                            .replace(
                              /\s+/g,
                              '-',
                            )}`}
                        >
                          {
                            building.taxStatus
                          }
                        </span>
                      )}
                    </div>

                    <small>
                      {
                        building.id
                      }
                    </small>

                    <h3>
                      {
                        building.name
                      }
                    </h3>

                    <p>
                      {
                        building.address
                      }
                    </p>

                    {latitude !==
                      0 &&
                      longitude !==
                        0 && (
                        <div
                          className="
                            mt-2
                            flex
                            items-center
                            gap-1.5
                            text-[9px]
                            text-slate-400
                          "
                        >
                          <MapPin
                            size={
                              12
                            }
                          />

                          <span>
                            {Number(
                              latitude,
                            ).toFixed(
                              6,
                            )}
                            ,{' '}
                            {Number(
                              longitude,
                            ).toFixed(
                              6,
                            )}
                          </span>
                        </div>
                      )}

                    <div
                      className="building-card__stats"
                    >
                      <div>
                        <small>
                          Property
                        </small>

                        <strong>
                          {
                            building.propertyId
                          }
                        </strong>
                      </div>

                      <div>
                        <small>
                          Tax ID
                        </small>

                        <strong>
                          {
                            building.taxId
                          }
                        </strong>
                      </div>

                      <div>
                        <small>
                          Requests
                        </small>

                        <strong>
                          {
                            building.requestCount
                          }
                        </strong>
                      </div>

                      <div>
                        <small>
                          Assessment
                        </small>

                        <strong>
                          {
                            building.assessmentValue
                          }
                        </strong>
                      </div>
                    </div>

                    <Link
                      to="/app/map"
                      className="text-button"
                    >
                      Open spatial context
                    </Link>
                  </article>
                )
              },
            )}
          </div>
        )}
    </div>
  )
}