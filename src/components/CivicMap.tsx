import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import {
  CheckCircle2,
  Crosshair,
  Layers3,
  LoaderCircle,
  LocateFixed,
  MapPin,
  Plus,
  Search,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/*
  ==========================================================
  BACKEND-ALIGNED SERVICES

  IMPORTANT:
  No mock request import is used anymore.

  All request API access is now through requestsService.
  GeoJSON loading is through mapService.
  OSM-related network work remains inside osmGeocoding.
  ==========================================================
*/
import { mapService } from '../services/map.service'
import {
  CMC_EXTRA_LAYERS,
  DEFAULT_CMC_LAYER_VISIBILITY,
  createCmcLeafletLayer,
  type CmcFeatureSelection,
  type CmcLayerKey,
} from '../lib/cmcLayers'

import {
  CmcFeatureDrawer,
} from './CmcFeatureDrawer'
import { requestsService } from '../services/requests.service'

import {
  resolveBuildingPlace,
  searchPlaces,
  type PlaceSearchResult,
  type SupportedBuildingGeometry,
} from '../services/osmGeocoding'

import type {
  RequestType,
  ServiceRequest,
} from '../types'

import { buildingsService } from '../services/buildings.service'

/* =========================================================
   CMC CONFIGURATION
========================================================= */

const CMC_CENTER:
  L.LatLngExpression = [
    6.90734,
    79.86237,
  ]

const CMC_FALLBACK_ZOOM =
  16

const VISIGEO_ROOT =
  'https://cmc.visigeo.com'

const VISIGEO_PROXY_ROOT =
  '/cmc'

type VectorKey =
  'buildings'

type LayerKey =
  | 'rgb'
  | VectorKey
  | CmcLayerKey
  | 'requests'

type VectorConfig = {
  key: VectorKey
  label: string
  url: string
  style: L.PathOptions
}

type SelectedFeature = {
  layerKey:
    VectorKey

  layerLabel:
    string

  featureId?:
    string

  latitude:
    number

  longitude:
    number

  properties:
    Record<
      string,
      unknown
    >

  nativeName?:
    string

  resolvedName?:
    string

  resolvedAddress?:
    string

  resolvedType?:
    string

  isResolving:
    boolean

  /*
    True only when the displayed name is considered
    reliably associated with the selected polygon.
  */
  polygonMatched:
    boolean
}

type LocalSearchFeature = {
  id: string

  title: string

  subtitle: string

  latitude: number

  longitude: number

  source: 'cmc'
}

type MapSearchResult =
  | LocalSearchFeature
  | {
      id: string

      title: string

      subtitle: string

      latitude: number

      longitude: number

      source: 'osm'

      category?: string

      type?: string
    }

type RequestMapLocation = {
  kind: 'POINT'
  latitude: number
  longitude: number
  label?: string
}

type MapFocusTarget = {
  latitude:
    number

  longitude:
    number

  requestId?:
    string

  label?:
    string
}

function readMapFocusTarget():
  MapFocusTarget |
  null {
  const params =
    new URLSearchParams(
      window.location.search,
    )

  /*
    URLSearchParams.get() returns null when a parameter
    does not exist.

    Number(null) === 0, so the previous implementation
    accidentally treated a normal /app/map URL as 0,0.

    Only create a focus target when BOTH coordinates
    actually exist in the URL.
  */
  const latitudeParam =
    params.get(
      'lat',
    )

  const longitudeParam =
    params.get(
      'lng',
    )

  if (
    latitudeParam ===
      null ||
    longitudeParam ===
      null ||
    latitudeParam.trim() ===
      '' ||
    longitudeParam.trim() ===
      ''
  ) {
    return null
  }

  const latitude =
    Number(
      latitudeParam,
    )

  const longitude =
    Number(
      longitudeParam,
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

    requestId:
      params.get(
        'request',
      ) ||
      undefined,

    label:
      params.get(
        'label',
      ) ||
      undefined,
  }
}

/* =========================================================
   LAYERS
========================================================= */

const VECTOR_LAYERS:
  VectorConfig[] = [
    {
      key:
        'buildings',

      label:
        'Buildings',

      url:
        `${VISIGEO_PROXY_ROOT}/vector/buildings.geojson`,

      style: {
        color:
          '#3388ff',

        weight:
          2,

        opacity:
          0.95,

        fillColor:
          '#3388ff',

        fillOpacity:
          0.16,

        /*
          Prevent polygon clicks from immediately
          continuing to the background map click.
        */
        bubblingMouseEvents:
          false,
      },
    },
  ]

const requestColors:
  Record<
    RequestType,
    string
  > = {
    COMPLAINT:
      '#d92d20',

    INQUIRY:
      '#1677d2',

    BOOKING:
      '#7a5af8',

    SUGGESTION:
      '#099250',
  }

/* =========================================================
   HELPERS
========================================================= */

function getFeatureId(
  feature: any,

  properties:
    Record<
      string,
      unknown
    >,
) {
  const keys = [
    'id',
    'ID',
    'Id',

    'fid',
    'FID',

    'OBJECTID',
    'ObjectID',
    'objectid',

    'building_id',
    'buildingid',
  ]

  for (
    const key of keys
  ) {
    const value =
      properties[key]

    if (
      value !== undefined &&
      value !== null &&
      String(
        value,
      ).trim()
    ) {
      return String(
        value,
      )
    }
  }

  if (
    feature?.id !==
      undefined &&
    feature?.id !==
      null
  ) {
    return String(
      feature.id,
    )
  }

  return undefined
}

function getNativeFeatureName(
  properties:
    Record<
      string,
      unknown
    >,
) {
  const keys = [
    'name',
    'Name',
    'NAME',

    'building_name',

    'building',
    'Building',

    'premises',
    'Premises',

    'facility_name',
    'facility',
  ]

  for (
    const key of keys
  ) {
    const value =
      properties[key]

    if (
      value !== undefined &&
      value !== null &&
      String(
        value,
      ).trim()
    ) {
      return String(
        value,
      ).trim()
    }
  }

  return undefined
}

function getFeatureSubtitle(
  properties:
    Record<
      string,
      unknown
    >,
) {
  const keys = [
    'address',
    'Address',
    'ADDRESS',

    'street',
    'Street',

    'road',
    'Road',

    'ward',
    'Ward',

    'division',
    'Division',
  ]

  const values:
    string[] = []

  for (
    const key of keys
  ) {
    const value =
      properties[key]

    if (
      value !== undefined &&
      value !== null &&
      String(
        value,
      ).trim()
    ) {
      const text =
        String(
          value,
        ).trim()

      if (
        !values.includes(
          text,
        )
      ) {
        values.push(
          text,
        )
      }
    }
  }

  return values
    .slice(
      0,
      2,
    )
    .join(
      ' · ',
    )
}

function popupNode(
  title: string,
  subtitle: string,
) {
  const root =
    document.createElement(
      'div',
    )

  root.style.minWidth =
    '225px'

  root.style.fontFamily =
    'DM Sans, Inter, ui-sans-serif, system-ui, sans-serif'

  const heading =
    document.createElement(
      'div',
    )

  heading.textContent =
    title

  heading.style.fontWeight =
    '800'

  heading.style.fontSize =
    '13px'

  heading.style.lineHeight =
    '1.3'

  heading.style.color =
    '#0b1323'

  const sub =
    document.createElement(
      'div',
    )

  sub.textContent =
    subtitle

  sub.style.marginTop =
    '6px'

  sub.style.fontSize =
    '10px'

  sub.style.lineHeight =
    '1.5'

  sub.style.color =
    '#66778a'

  root.append(
    heading,
    sub,
  )

  return root
}

function readablePropertyEntries(
  properties:
    Record<
      string,
      unknown
    >,
) {
  return Object.entries(
    properties,
  )
    .filter(
      ([, value]) =>
        value !==
          null &&
        value !==
          undefined &&
        String(
          value,
        ).trim() !== '',
    )
    .slice(
      0,
      14,
    )
}

function supportedGeometry(
  feature:
    any,
):
  | SupportedBuildingGeometry
  | undefined {
  const geometry =
    feature?.geometry

  if (
    geometry?.type ===
      'Polygon' &&
    Array.isArray(
      geometry.coordinates,
    )
  ) {
    return geometry as
      SupportedBuildingGeometry
  }

  if (
    geometry?.type ===
      'MultiPolygon' &&
    Array.isArray(
      geometry.coordinates,
    )
  ) {
    return geometry as
      SupportedBuildingGeometry
  }

  return undefined
}

/* =========================================================
   COMPONENT
========================================================= */

export function CivicMap({
  mode = 'full',
}: {
  mode?:
    | 'full'
    | 'preview'
}) {
  const hostRef =
    useRef<
      HTMLDivElement | null
    >(null)

  const mapRef =
    useRef<
      L.Map | null
    >(null)

  /*
    The URL focus is read once when this map instance opens.

    Example:
    /app/map?lat=6.91&lng=79.86&request=LGS-2026-000002
  */
  const mapFocusRef =
    useRef<
      MapFocusTarget |
      null
    >(
      mode ===
        'full'
        ? readMapFocusTarget()
        : null,
    )

  const mapFocusMarkerRef =
    useRef<
      L.CircleMarker |
      null
    >(
      null,
    )

  const baseMapRef =
    useRef<
      L.TileLayer | null
    >(null)

  const imageryRef =
    useRef<
      L.TileLayer | null
    >(null)

  const vectorRefs =
    useRef<
      Partial<
        Record<
          VectorKey,
          L.GeoJSON
        >
      >
    >({})

  const cmcVectorRefs =
    useRef<
      Partial<
        Record<
          CmcLayerKey,
          L.GeoJSON
        >
      >
    >({})

  const requestLayerRef =
    useRef<
      L.LayerGroup | null
    >(null)

  const searchMarkerRef =
    useRef<
      L.CircleMarker | null
    >(null)

  const requestPinRef =
    useRef<
      L.CircleMarker | null
    >(null)

  const initialFitDoneRef =
    useRef(
      false,
    )

  const layerPanelRef =
    useRef<
      HTMLDivElement | null
    >(null)

  const layerButtonRef =
    useRef<
      HTMLButtonElement | null
    >(null)

  const featureDrawerRef =
    useRef<
      HTMLElement | null
    >(null)

  const searchWrapRef =
    useRef<
      HTMLDivElement | null
    >(null)

  /*
    Old async building lookups must never overwrite
    the latest selected building.
  */
  const selectionSequenceRef =
    useRef(
      0,
    )

  const buildingLookupAbortRef =
    useRef<
      AbortController | null
    >(null)

  const {
    user,
    can,
  } =
    useAuth()

  const navigate =
    useNavigate()

  const canSeeInternalCmc =
    can(
      'map.internal',
    )

  const availableCmcLayers =
    CMC_EXTRA_LAYERS.filter(
      (
        config,
      ) =>
        config.access ===
          'PUBLIC' ||
        canSeeInternalCmc,
    )

  /* =======================================================
     BACKEND REQUEST DATA

     REPLACES:
       import { requests } from '../data/mock'

     Requests now come from the Express backend through
     src/services/requests.service.ts.
  ======================================================= */

  const [
    requests,
    setRequests,
  ] =
    useState<
      ServiceRequest[]
    >([])

  useEffect(() => {
    let cancelled =
      false

    const loadRequests =
      async () => {
        /*
          Citizens do not need the government request layer.
        */
        if (
          !user ||
          user.role ===
            'CITIZEN'
        ) {
          if (
            !cancelled
          ) {
            setRequests(
              [],
            )
          }

          return
        }

        try {
          /*
            Backend RBAC remains authoritative.

            For GOV_WORKER, the backend should only return
            records they are permitted to read.
          */
          const result =
            await requestsService.list(
              {
                limit:
                  100,
              },
            )

          if (
            !cancelled
          ) {
            setRequests(
              result.items,
            )
          }
        } catch (
          error
        ) {
          console.error(
            'Unable to load map requests.',
            error,
          )

          if (
            !cancelled
          ) {
            setRequests(
              [],
            )
          }
        }
      }

    void loadRequests()

    return () => {
      cancelled =
        true
    }
  }, [
    user?.id,
    user?.role,
  ])

  /* =======================================================
     FEATURE / SEARCH STATE
  ======================================================= */

  const [
    selectedFeature,
    setSelectedFeature,
  ] =
    useState<
      SelectedFeature | null
    >(null)

  /*
    Selected feature from the additional CMC master-folder layers.

    Buildings continue using selectedFeature above because they have
    the existing polygon-aware OSM matching workflow.
  */
  const [
    selectedCmcFeature,
    setSelectedCmcFeature,
  ] =
    useState<
      CmcFeatureSelection | null
    >(null)

  const [
    pendingRequestLocation,
    setPendingRequestLocation,
  ] =
    useState<
      RequestMapLocation | null
    >(null)

  const [
    localSearchFeatures,
    setLocalSearchFeatures,
  ] =
    useState<
      LocalSearchFeature[]
    >([])

  const [
    osmSearchResults,
    setOsmSearchResults,
  ] =
    useState<
      PlaceSearchResult[]
    >([])

  const [
    search,
    setSearch,
  ] =
    useState(
      '',
    )

  const [
    searchLoading,
    setSearchLoading,
  ] =
    useState(
      false,
    )

  const [
    layerPanel,
    setLayerPanel,
  ] =
    useState(
      false,
    )

  const [
    zoom,
    setZoom,
  ] =
    useState(
      CMC_FALLBACK_ZOOM,
    )

  const [
    rgbLoaded,
    setRgbLoaded,
  ] =
    useState(
      false,
    )

  const [
    loadedVectors,
    setLoadedVectors,
  ] =
    useState<
      Set<string>
    >(
      new Set(),
    )

  const [
    vectorErrors,
    setVectorErrors,
  ] =
    useState<
      Set<string>
    >(
      new Set(),
    )

  const [
    layers,
    setLayers,
  ] =
    useState<
      Record<
        LayerKey,
        boolean
      >
    >({
      /*
        Existing defaults.
      */
      rgb:
        true,

      buildings:
        true,

      /*
        New CMC layers start OFF.

        Therefore the map initially looks exactly the same.
      */
      ...DEFAULT_CMC_LAYER_VISIBILITY,

      requests:
        Boolean(
          user &&
            user.role !==
              'CITIZEN',
        ),
    })

  const layersRef =
    useRef(
      layers,
    )

  layersRef.current =
    layers

  /* =======================================================
     CMC LOCAL SEARCH
  ======================================================= */

  const localFiltered =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase()

      if (
        !query
      ) {
        return []
      }

      return localSearchFeatures
        .filter(
          (
            feature,
          ) =>
            `${feature.title} ${feature.subtitle} ${feature.id}`
              .toLowerCase()
              .includes(
                query,
              ),
        )
        .slice(
          0,
          4,
        )
    }, [
      search,
      localSearchFeatures,
    ])

  /* =======================================================
     OSM NAME / ADDRESS SEARCH
  ======================================================= */

  useEffect(() => {
    const query =
      search.trim()

    if (
      query.length <
      3
    ) {
      setOsmSearchResults(
        [],
      )

      setSearchLoading(
        false,
      )

      return
    }

    const abort =
      new AbortController()

    const timeout =
      window.setTimeout(
        async () => {
          try {
            setSearchLoading(
              true,
            )

            /*
              API/network logic remains inside:
              src/services/osmGeocoding.ts
            */
            const results =
              await searchPlaces(
                query,
                abort.signal,
              )

            if (
              abort.signal
                .aborted
            ) {
              return
            }

            setOsmSearchResults(
              results,
            )
          } catch (
            error
          ) {
            if (
              error instanceof
                DOMException &&
              error.name ===
                'AbortError'
            ) {
              return
            }

            console.warn(
              'Map search failed.',
              error,
            )
          } finally {
            if (
              !abort.signal
                .aborted
            ) {
              setSearchLoading(
                false,
              )
            }
          }
        },

        500,
      )

    return () => {
      window.clearTimeout(
        timeout,
      )

      abort.abort()
    }
  }, [
    search,
  ])

  /* =======================================================
     COMBINED SEARCH
  ======================================================= */

  const searchResults:
    MapSearchResult[] =
    useMemo(() => {
      const remote =
        osmSearchResults.map(
          (
            result,
          ) => ({
            id:
              result.id,

            title:
              result.name,

            subtitle:
              result.shortAddress ||
              result.displayName,

            latitude:
              result.latitude,

            longitude:
              result.longitude,

            source:
              'osm' as const,

            category:
              result.category,

            type:
              result.type,
          }),
        )

      /*
        Named OSM places first.
        CMC building IDs remain searchable afterwards.
      */
      return [
        ...remote,
        ...localFiltered,
      ].slice(
        0,
        9,
      )
    }, [
      osmSearchResults,
      localFiltered,
    ])

  /* =======================================================
     REQUEST VISIBILITY

     Data now comes from requestsService instead of mock data.
  ======================================================= */

  const visibleRequests =
    useMemo(() => {
      if (
        !user ||
        user.role ===
          'CITIZEN'
      ) {
        return []
      }

      if (
        user.role ===
        'GOV_WORKER'
      ) {
        return requests.filter(
          (
            request,
          ) =>
            request.assignedTo ===
            user.id,
        )
      }

      return requests
    }, [
      user,
      requests,
    ])

  /* =======================================================
     SHOW ALL
  ======================================================= */

  function showWholeArea(
    animate =
      true,
  ) {
    const map =
      mapRef.current

    if (
      !map
    ) {
      return
    }

    map.closePopup()

    const buildings =
      vectorRefs.current
        .buildings

    if (
      buildings
    ) {
      const bounds =
        buildings.getBounds()

      if (
        bounds.isValid()
      ) {
        map.fitBounds(
          bounds,
          {
            paddingTopLeft:
              [
                70,
                90,
              ],

            paddingBottomRight:
              [
                70,
                80,
              ],

            animate,

            duration:
              animate
                ? 0.8
                : undefined,

            maxZoom:
              17,
          },
        )

        return
      }
    }

    map.setView(
      CMC_CENTER,
      CMC_FALLBACK_ZOOM,
      {
        animate,
      },
    )
  }

  /* =======================================================
     CLOSE BUILDING
  ======================================================= */

  function closeSelectedFeature() {
    selectionSequenceRef.current +=
      1

    buildingLookupAbortRef.current?.abort()

    buildingLookupAbortRef.current =
      null

    setSelectedFeature(
      null,
    )

    setSelectedCmcFeature(
      null,
    )

    mapRef.current?.closePopup()
  }

  /* =======================================================
     LAYER PANEL
  ======================================================= */

  function toggleLayerPanel() {
    /*
      Building drawer and Layers drawer should
      never overlap.
    */
    closeSelectedFeature()

    setLayerPanel(
      (
        current,
      ) =>
        !current,
    )
  }

  function openRequestForm(
    location:
      RequestMapLocation | null =
        pendingRequestLocation,
  ) {
    navigate(
      '/app/requests?new=1',
      {
        state:
          location
            ? {
                requestLocation:
                  location,
              }
            : undefined,
      },
    )
  }

  /* =======================================================
     CLICK OUTSIDE LAYER PANEL
  ======================================================= */

  useEffect(() => {
    const handlePointerDown =
      (
        event:
          PointerEvent,
      ) => {
        const target =
          event.target as
            Node | null

        if (
          !target
        ) {
          return
        }

        if (
          layerPanel &&
          !layerPanelRef.current?.contains(
            target,
          ) &&
          !layerButtonRef.current?.contains(
            target,
          )
        ) {
          setLayerPanel(
            false,
          )
        }
      }

    document.addEventListener(
      'pointerdown',
      handlePointerDown,
    )

    return () => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDown,
      )
    }
  }, [
    layerPanel,
  ])

  /* =======================================================
     MAP INITIALIZATION
  ======================================================= */

  useEffect(() => {
    if (
      !hostRef.current ||
      mapRef.current
    ) {
      return
    }

    const initialFocus =
      mapFocusRef.current

    const map =
      L.map(
        hostRef.current,
        {
          zoomControl:
            false,

          attributionControl:
            true,

          preferCanvas:
            true,

          minZoom:
            12,

          maxZoom:
            22,

          zoomSnap:
            0.5,

          doubleClickZoom:
            true,

          closePopupOnClick:
            true,
        },
      ).setView(
        initialFocus
          ? [
              initialFocus.latitude,
              initialFocus.longitude,
            ]
          : CMC_CENTER,

        initialFocus
          ? 19
          : mode ===
              'preview'
            ? 15
            : CMC_FALLBACK_ZOOM,
      )

    mapRef.current =
      map

    /* =====================================================
       OSM BASE
    ====================================================== */

    baseMapRef.current =
      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          minZoom:
            1,

          maxZoom:
            22,

          zIndex:
            1,

          attribution:
            '&copy; OpenStreetMap contributors',
        },
      )

    baseMapRef.current.addTo(
      map,
    )

    /* =====================================================
       CMC RGB
    ====================================================== */

    imageryRef.current =
      L.tileLayer(
        `${VISIGEO_ROOT}/rgb/{z}/{x}/{y}.png`,
        {
          minZoom:
            14,

          maxZoom:
            22,

          opacity:
            1,

          zIndex:
            100,

          keepBuffer:
            5,

          updateWhenIdle:
            false,

          updateWhenZooming:
            false,

          className:
            'cmc-visigeo-rgb',

          attribution:
            'CMC imagery · Visigeo',
        },
      )

    imageryRef.current.on(
      'tileload',
      () => {
        setRgbLoaded(
          true,
        )
      },
    )

    if (
      layersRef.current
        .rgb
    ) {
      imageryRef.current.addTo(
        map,
      )
    }

    /* =====================================================
      DIRECT REQUEST FOCUS

      Used when entering the map from:
      Request Detail → Open on map
    ===================================================== */

    /* =====================================================
      DIRECT REQUEST FOCUS

      Request Detail → Open on map

      IMPORTANT:
      Do NOT use a delayed flyTo() here.

      React StrictMode may destroy the first Leaflet instance
      before a setTimeout executes, which causes:

      Cannot read properties of undefined
      (reading '_leaflet_pos')
    ===================================================== */

    if (
      initialFocus
    ) {
      const focusMarker =
        L.circleMarker(
          [
            initialFocus.latitude,
            initialFocus.longitude,
          ],
          {
            radius: 11,

            color: '#ffffff',

            weight: 4,

            fillColor: '#dc2626',

            fillOpacity: 1,
          },
        )

      focusMarker.bindPopup(
        popupNode(
          initialFocus.requestId
            ? `Request ${initialFocus.requestId}`
            : 'Request location',

          initialFocus.label ||
            'Reported issue location',
        ),
        {
          autoClose: false,

          closeOnClick: false,

          closeButton: true,
        },
      )

      focusMarker.addTo(
        map,
      )

      mapFocusMarkerRef.current =
        focusMarker

      /*
        setView() during map creation has ALREADY positioned
        the map at this request.

        We only open the popup once Leaflet reports the map
        as ready.
      */
      map.whenReady(
        () => {
          /*
            Guard against React StrictMode having already
            destroyed/replaced this Leaflet instance.
          */
          if (
            mapRef.current !==
              map ||
            !map.getContainer()
              ?.isConnected
          ) {
            return
          }

          focusMarker.openPopup()
        },
      )
    }

    /* =====================================================
       REQUEST LAYER
    ====================================================== */

    requestLayerRef.current =
      L.layerGroup()

    if (
      layersRef.current
        .requests
    ) {
      requestLayerRef.current.addTo(
        map,
      )
    }

    /* =====================================================
       OUTSIDE MAP CLICK
    ====================================================== */

    const handleMapClick =
      (
        event:
          L.LeafletMouseEvent,
      ) => {
        selectionSequenceRef.current +=
          1

        buildingLookupAbortRef.current?.abort()

        buildingLookupAbortRef.current =
          null

        setSelectedFeature(
          null,
        )

        setSelectedCmcFeature(
          null,
        )

        setLayerPanel(
          false,
        )

        setSearch(
          '',
        )

        const latitude =
          Number(
            event.latlng.lat.toFixed(
              7,
            ),
          )

        const longitude =
          Number(
            event.latlng.lng.toFixed(
              7,
            ),
          )

        setPendingRequestLocation(
          {
            kind:
              'POINT',

            latitude,

            longitude,

            label:
              'Pinned map location',
          },
        )

        if (
          requestPinRef.current &&
          map.hasLayer(
            requestPinRef.current,
          )
        ) {
          map.removeLayer(
            requestPinRef.current,
          )
        }

        requestPinRef.current =
          L.circleMarker(
            [
              latitude,
              longitude,
            ],
            {
              radius:
                8,

              color:
                '#ffffff',

              weight:
                3,

              fillColor:
                '#0f766e',

              fillOpacity:
                1,
            },
          ).addTo(
            map,
          )

        requestPinRef.current
          .bindTooltip(
            'Request location',
            {
              direction:
                'top',

              offset:
                [
                  0,
                  -8,
                ],

              opacity:
                0.92,
            },
          )
          .openTooltip()

        map.closePopup()
      }

    map.on(
      'click',
      handleMapClick,
    )

    /* =====================================================
       LOAD CMC BUILDINGS

       IMPORTANT CHANGE:
       Direct fetch() was removed.

       The request now goes through:
       src/services/map.service.ts
    ====================================================== */

    const abort =
      new AbortController()

    VECTOR_LAYERS.forEach(
      async (
        config,
      ) => {
        try {
          /*
            BEFORE:

            const response = await fetch(...)
            const data = await response.json()

            NOW:

            All direct HTTP logic is in mapService.
          */
          const data =
            await mapService.fetchGeoJson<any>(
              config.url,
              abort.signal,
            )

          const localResults:
            LocalSearchFeature[] =
            []

          const geoLayer =
            L.geoJSON(
              data as any,
              {
                style:
                  () =>
                    config.style,

                onEachFeature:
                  (
                    feature:
                      any,

                    layer,
                  ) => {
                    const properties =
                      (
                        feature?.properties ||
                        {}
                      ) as
                        Record<
                          string,
                          unknown
                        >

                    const featureId =
                      getFeatureId(
                        feature,
                        properties,
                      )

                    const nativeName =
                      getNativeFeatureName(
                        properties,
                      )

                    const nativeSubtitle =
                      getFeatureSubtitle(
                        properties,
                      )

                    const geometry =
                      supportedGeometry(
                        feature,
                      )

                    let center:
                      | L.LatLng
                      | undefined

                    if (
                      layer instanceof
                      L.Polygon
                    ) {
                      const bounds =
                        layer.getBounds()

                      if (
                        bounds.isValid()
                      ) {
                        center =
                          bounds.getCenter()
                      }
                    }

                    if (
                      center
                    ) {
                      localResults.push(
                        {
                          id:
                            featureId ||
                            `${center.lat}-${center.lng}`,

                          title:
                            nativeName ||
                            (
                              featureId
                                ? `Building ${featureId}`
                                : 'Mapped building'
                            ),

                          subtitle:
                            nativeSubtitle ||
                            'CMC mapped building',

                          latitude:
                            center.lat,

                          longitude:
                            center.lng,

                          source:
                            'cmc',
                        },
                      )
                    }

                    /* =====================================
                       HOVER
                    ====================================== */

                    if (
                      layer instanceof
                      L.Path
                    ) {
                      layer.on(
                        'mouseover',
                        () => {
                          layer.setStyle(
                            {
                              ...config.style,

                              weight:
                                (
                                  config
                                    .style
                                    .weight ||
                                  2
                                ) +
                                1,

                              fillOpacity:
                                Math.min(
                                  (
                                    config
                                      .style
                                      .fillOpacity ||
                                    0
                                  ) +
                                    0.12,

                                  0.38,
                                ),
                            },
                          )
                        },
                      )

                      layer.on(
                        'mouseout',
                        () => {
                          layer.setStyle(
                            config.style,
                          )
                        },
                      )
                    }

                    /* =====================================
                       BUILDING CLICK
                    ====================================== */

                    layer.on(
                      'click',
                      async (
                        event:
                          L.LeafletMouseEvent,
                      ) => {
                        /*
                          Stop this event before it reaches
                          the background map click handler.
                        */
                        if (
                          event.originalEvent
                        ) {
                          L.DomEvent.stopPropagation(
                            event.originalEvent,
                          )
                        }

                        setLayerPanel(
                          false,
                        )

                        setSelectedCmcFeature(
                          null,
                        )

                        setSearch(
                          '',
                        )

                        setPendingRequestLocation(
                          null,
                        )

                        if (
                          requestPinRef.current &&
                          map.hasLayer(
                            requestPinRef.current,
                          )
                        ) {
                          map.removeLayer(
                            requestPinRef.current,
                          )
                        }

                        requestPinRef.current =
                          null

                        /*
                          Abort previous building lookup.
                        */
                        buildingLookupAbortRef.current?.abort()

                        const lookupAbort =
                          new AbortController()

                        buildingLookupAbortRef.current =
                          lookupAbort

                        /*
                          Use polygon centre where possible.
                        */
                        let point =
                          event.latlng

                        if (
                          layer instanceof
                          L.Polygon
                        ) {
                          const bounds =
                            layer.getBounds()

                          if (
                            bounds.isValid()
                          ) {
                            point =
                              bounds.getCenter()
                          }
                        }

                        const latitude =
                          Number(
                            point.lat.toFixed(
                              7,
                            ),
                          )

                        const longitude =
                          Number(
                            point.lng.toFixed(
                              7,
                            ),
                          )

                        const fallbackTitle =
                          nativeName ||
                          (
                            featureId
                              ? `Building ${featureId}`
                              : 'Mapped building'
                          )

                        const sequence =
                          ++selectionSequenceRef.current

                        /*
                          Show drawer immediately.
                        */
                        setSelectedFeature(
                          {
                            layerKey:
                              config.key,

                            layerLabel:
                              config.label,

                            featureId,

                            latitude,

                            longitude,

                            properties,

                            nativeName,

                            resolvedName:
                              nativeName,

                            resolvedAddress:
                              nativeSubtitle,

                            resolvedType:
                              undefined,

                            isResolving:
                              !nativeName,

                            polygonMatched:
                              Boolean(
                                nativeName,
                              ),
                          },
                        )

                        /*
                          Highlight clicked building.
                        */
                        if (
                          layer instanceof
                          L.Path
                        ) {
                          layer.bringToFront()

                          layer.setStyle(
                            {
                              ...config.style,

                              color:
                                '#0f766e',

                              weight:
                                4,

                              fillColor:
                                '#14b8a6',

                              fillOpacity:
                                0.25,
                            },
                          )

                          window.setTimeout(
                            () => {
                              layer.setStyle(
                                config.style,
                              )
                            },

                            1200,
                          )
                        }

                        /*
                          Popup appears immediately while the
                          service checks the building name.
                        */
                        const popup =
                          L.popup({
                            closeButton:
                              true,

                            autoClose:
                              true,

                            closeOnClick:
                              false,

                            maxWidth:
                              340,
                          })
                            .setLatLng(
                              point,
                            )
                            .setContent(
                              popupNode(
                                fallbackTitle,

                                nativeName
                                  ? nativeSubtitle ||
                                      'CMC mapped building'
                                  : 'Checking named places inside this building…',
                              ),
                            )

                        map.openPopup(
                          popup,
                        )

                        /* =================================
                           POLYGON-AWARE OSM MATCH

                           This remains in osmGeocoding
                           service as in your long version.
                        ================================== */

                        try {
                          const resolved =
                            await resolveBuildingPlace(
                              {
                                latitude,

                                longitude,

                                geometry,

                                signal:
                                  lookupAbort.signal,
                              },
                            )

                          if (
                            selectionSequenceRef.current !==
                              sequence ||
                            lookupAbort
                              .signal
                              .aborted
                          ) {
                            return
                          }

                          /*
                            NAME PRIORITY:

                            1. Native CMC name.
                            2. OSM name physically inside
                               clicked polygon.
                            3. Building-ID fallback.

                            A nearby reverse-geocoder name is
                            never blindly used as the building.
                          */
                          const safelyMatchedName =
                            resolved?.confidence ===
                              'polygon-match'
                              ? resolved.name
                              : undefined

                          const finalName =
                            nativeName ||
                            safelyMatchedName ||
                            fallbackTitle

                          const finalAddress =
                            nativeSubtitle ||
                            resolved?.shortAddress ||
                            resolved?.displayName ||
                            ''

                          const finalType =
                            resolved?.confidence ===
                              'polygon-match'
                              ? [
                                  resolved.type,
                                  resolved.category,
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
                              : ''

                              /* =======================================================
                                CACHE VERIFIED OSM NAME IN BACKEND

                                Only internal users with building access write the cache.
                              ======================================================= */

                              if (
                                safelyMatchedName &&
                                resolved?.confidence ===
                                  'polygon-match' &&
                                can(
                                  'building.sensitive.read',
                                )
                              ) {
                                void buildingsService
                                  .cacheResolution(
                                    {
                                      /*
                                        CMC raw feature ID.
                                        For Nelum screenshot this is currently "1".
                                      */
                                      rawFeatureId:
                                        featureId ??
                                        null,

                                      /*
                                        Backend uses geometry hash to identify
                                        the correct "1-xxxxxxxxxxxx" DB record.
                                      */
                                      geometry,

                                      latitude,
                                      longitude,

                                      name:
                                        safelyMatchedName,

                                      address:
                                        finalAddress ||
                                        null,

                                      buildingType:
                                        finalType ||
                                        null,
                                    },
                                  )
                                  .catch(
                                    (
                                      error,
                                    ) => {
                                      /*
                                        Do NOT break map operation if caching fails.
                                      */
                                      console.warn(
                                        'Unable to cache resolved building.',
                                        error,
                                      )
                                    },
                                  )
                              }
                          
                          
                          const polygonMatched =
                            Boolean(
                              nativeName ||
                                safelyMatchedName,
                            )

                          setSelectedFeature(
                            (
                              current,
                            ) => {
                              if (
                                !current
                              ) {
                                return current
                              }

                              return {
                                ...current,

                                resolvedName:
                                  finalName,

                                resolvedAddress:
                                  finalAddress,

                                resolvedType:
                                  finalType,

                                isResolving:
                                  false,

                                polygonMatched,
                              }
                            },
                          )

                          if (
                            map.hasLayer(
                              popup,
                            )
                          ) {
                            popup.setContent(
                              popupNode(
                                finalName,

                                finalAddress ||
                                  (
                                    polygonMatched
                                      ? 'Matched inside selected building'
                                      : 'No reliable building name available'
                                  ),
                              ),
                            )
                          }
                        } catch (
                          error
                        ) {
                          if (
                            error instanceof
                              DOMException &&
                            error.name ===
                              'AbortError'
                          ) {
                            return
                          }

                          console.warn(
                            'Building-place lookup failed.',
                            error,
                          )

                          if (
                            selectionSequenceRef.current ===
                            sequence
                          ) {
                            setSelectedFeature(
                              (
                                current,
                              ) =>
                                current
                                  ? {
                                      ...current,

                                      isResolving:
                                        false,

                                      polygonMatched:
                                        Boolean(
                                          nativeName,
                                        ),
                                    }
                                  : current,
                            )
                          }
                        }
                      },
                    )
                  },
              },
            )

          vectorRefs.current[
            config.key
          ] =
            geoLayer

          if (
            layersRef.current[
              config.key
            ]
          ) {
            geoLayer.addTo(
              map,
            )
          }

          setLoadedVectors(
            (
              current,
            ) => {
              const next =
                new Set(
                  current,
                )

              next.add(
                config.key,
              )

              return next
            },
          )

          if (
            config.key ===
            'buildings'
          ) {
            setLocalSearchFeatures(
              localResults,
            )
          }

          if (
            config.key ===
              'buildings' &&
            !initialFitDoneRef.current
          ) {
            initialFitDoneRef.current =
              true

            /*
              Normal map opening:
                fit the whole CMC area.

              Request Detail → Open on map:
                KEEP the request zoom.
            */
            if (
              !mapFocusRef.current
            ) {
              window.setTimeout(
                () => {
                  showWholeArea(
                    false,
                  )
                },

                120,
              )
            }
          }
        } catch (
          error
        ) {
          if (
            error instanceof
              DOMException &&
            error.name ===
              'AbortError'
          ) {
            return
          }

          console.error(
            `Failed to load CMC Visigeo layer: ${config.label}`,
            error,
          )

          setVectorErrors(
            (
              current,
            ) => {
              const next =
                new Set(
                  current,
                )

              next.add(
                config.key,
              )

              return next
            },
          )
        }
      },
    )

    /* =====================================================
       ZOOM
    ====================================================== */

    map.on(
      'zoomend',
      () => {
        setZoom(
          map.getZoom(),
        )
      },
    )

    /* =====================================================
       RESIZE
    ====================================================== */

    const observer =
      new ResizeObserver(
        () => {
          map.invalidateSize({
            animate:
              false,
          })
        },
      )

    observer.observe(
      hostRef.current,
    )

    /* =====================================================
       CLEANUP
    ====================================================== */

    return () => {
      buildingLookupAbortRef.current?.abort()

      buildingLookupAbortRef.current =
        null

      abort.abort()

      observer.disconnect()

      map.off(
        'click',
        handleMapClick,
      )

      map.remove()

      mapRef.current =
        null

      baseMapRef.current =
        null

      imageryRef.current =
        null

      vectorRefs.current =
        {}
      
      cmcVectorRefs.current =
        {}

      requestLayerRef.current =
        null

      searchMarkerRef.current =
        null

      requestPinRef.current =
        null

      initialFitDoneRef.current =
        false
    }
  }, [
    mode,
  ])

  /* =======================================================
      CMC MASTER GIS — LAZY LOADING

      Important:

      These extra files are NOT downloaded when the map opens.

      A layer is requested from Express only when the user
      switches that particular layer ON.
    ======================================================= */

    useEffect(() => {
      const map =
        mapRef.current

      if (!map) {
        return
      }

      const abort =
        new AbortController()

      CMC_EXTRA_LAYERS.forEach(
        (
          config,
        ) => {
          /*
            Layer not requested by user.
          */
          if (
            !layers[
              config.key
            ]
          ) {
            return
          }

          /*
            Never request protected infrastructure data when
            the current account lacks map.internal.
          */
          if (
            config.access ===
              'INTERNAL' &&
            !canSeeInternalCmc
          ) {
            return
          }

          /*
            Already downloaded.
          */
          if (
            cmcVectorRefs.current[
              config.key
            ]
          ) {
            return
          }

          void (
            async () => {
              try {
                const data =
                  await mapService.fetchGeoJson<any>(
                    mapService.cmcLayerUrl(
                      config.key,
                    ),

                    abort.signal,
                  )

                if (
                  abort.signal
                    .aborted
                ) {
                  return
                }

                const geoLayer =
                  createCmcLeafletLayer(
                    data,
                    config,

                    (
                      feature,
                    ) => {
                      /*
                        Extra CMC features now open their own details
                        drawer instead of only showing a tiny popup.

                        The same clicked location also becomes the
                        citizen's pending request location.
                      */
                      selectionSequenceRef.current +=
                        1

                      buildingLookupAbortRef.current?.abort()

                      buildingLookupAbortRef.current =
                        null

                      setSelectedFeature(
                        null,
                      )

                      setSelectedCmcFeature(
                        feature,
                      )

                      setLayerPanel(
                        false,
                      )

                      setSearch(
                        '',
                      )

                      setPendingRequestLocation(
                        {
                          kind:
                            'POINT',

                          latitude:
                            feature.latitude,

                          longitude:
                            feature.longitude,

                          label:
                            feature.title,
                        },
                      )

                      if (
                        requestPinRef.current &&
                        map.hasLayer(
                          requestPinRef.current,
                        )
                      ) {
                        map.removeLayer(
                          requestPinRef.current,
                        )
                      }

                      requestPinRef.current =
                        L.circleMarker(
                          [
                            feature.latitude,
                            feature.longitude,
                          ],
                          {
                            radius:
                              7,

                            color:
                              '#ffffff',

                            weight:
                              3,

                            fillColor:
                              '#0f766e',

                            fillOpacity:
                              1,
                          },
                        ).addTo(
                          map,
                        )

                      requestPinRef.current
                        .bindTooltip(
                          'Request location',
                          {
                            direction:
                              'top',

                            offset:
                              [
                                0,
                                -7,
                              ],

                            opacity:
                              0.92,
                          },
                        )
                        .openTooltip()
                    },
                  )

                cmcVectorRefs.current[
                  config.key
                ] =
                  geoLayer

                /*
                  The user may have switched it OFF while the
                  network request was still running.
                */
                if (
                  layersRef.current[
                    config.key
                  ]
                ) {
                  geoLayer.addTo(
                    map,
                  )
                }
              } catch (
                error
              ) {
                if (
                  error instanceof
                    DOMException &&
                  error.name ===
                    'AbortError'
                ) {
                  return
                }

                console.error(
                  `Unable to load CMC GIS layer: ${config.label}`,
                  error,
                )
              }
            }
          )()
        },
      )

      return () => {
        abort.abort()
      }
    }, [
      layers,
      canSeeInternalCmc,
    ])

  /* =======================================================
     LAYER VISIBILITY
  ======================================================= */

  useEffect(() => {
    const map =
      mapRef.current

    if (
      !map
    ) {
      return
    }

    const toggle =
      (
        layer:
          | L.Layer
          | null
          | undefined,

        visible:
          boolean,
      ) => {
        if (
          !layer
        ) {
          return
        }

        if (
          visible &&
          !map.hasLayer(
            layer,
          )
        ) {
          layer.addTo(
            map,
          )
        }

        if (
          !visible &&
          map.hasLayer(
            layer,
          )
        ) {
          map.removeLayer(
            layer,
          )
        }
      }

    toggle(
      imageryRef.current,
      layers.rgb,
    )

    toggle(
      requestLayerRef.current,
      layers.requests,
    )

    VECTOR_LAYERS.forEach(
      (
        config,
      ) => {
        toggle(
          vectorRefs.current[
            config.key
          ],

          layers[
            config.key
          ],
        )
      },
    )

    CMC_EXTRA_LAYERS.forEach(
      (
        config,
      ) => {
        const permitted =
          config.access ===
            'PUBLIC' ||
          canSeeInternalCmc

        toggle(
          cmcVectorRefs.current[
            config.key
          ],

          permitted &&
            layers[
              config.key
            ],
        )
      },
    )

  }, [
    layers,
    canSeeInternalCmc,
  ])

  /* =======================================================
     REQUEST MARKERS

     Uses real backend request records.
  ======================================================= */

  useEffect(() => {
    const group =
      requestLayerRef.current

    if (
      !group
    ) {
      return
    }

    group.clearLayers()

    visibleRequests.forEach(
      (
        request,
      ) => {
        /*
          Ignore malformed records without usable location.
          Normally the backend should enforce this already.
        */
        if (
          typeof request.latitude !==
            'number' ||
          typeof request.longitude !==
            'number'
        ) {
          return
        }

        const color =
          requestColors[
            request.type
          ]

        const marker =
          L.circleMarker(
            [
              request.latitude,
              request.longitude,
            ],
            {
              radius:
                7,

              color:
                '#ffffff',

              weight:
                3,

              fillColor:
                color,

              fillOpacity:
                1,
            },
          )

        marker.bindPopup(
          popupNode(
            `${request.type} · ${request.id}`,

            `${request.title} · ${request.locationLabel}`,
          ),
          {
            autoClose:
              true,

            closeOnClick:
              true,
          },
        )

        marker.addTo(
          group,
        )
      },
    )
  }, [
    visibleRequests,
  ])

  /* =======================================================
     TOGGLE LAYER
  ======================================================= */

  function toggleLayer(
    key:
      LayerKey,
  ) {
    setLayers(
      (
        current,
      ) => ({
        ...current,

        [key]:
          !current[
            key
          ],
      }),
    )
  }

  /* =======================================================
     RESET
  ======================================================= */

  function reset() {
    selectionSequenceRef.current +=
      1

    buildingLookupAbortRef.current?.abort()

    buildingLookupAbortRef.current =
      null

    setSelectedFeature(
      null,
    )

    setSelectedCmcFeature(
      null,
    )

    setLayerPanel(
      false,
    )

    setSearch(
      '',
    )

    setOsmSearchResults(
      [],
    )

    setPendingRequestLocation(
      null,
    )

    if (
      requestPinRef.current &&
      mapRef.current?.hasLayer(
        requestPinRef.current,
      )
    ) {
      mapRef.current.removeLayer(
        requestPinRef.current,
      )
    }

    requestPinRef.current =
      null

    if (
      searchMarkerRef.current &&
      mapRef.current?.hasLayer(
        searchMarkerRef.current,
      )
    ) {
      mapRef.current.removeLayer(
        searchMarkerRef.current,
      )
    }

    searchMarkerRef.current =
      null

    mapRef.current?.closePopup()

    window.setTimeout(
      () => {
        mapRef.current?.invalidateSize(
          {
            animate:
              false,
          },
        )

        showWholeArea(
          true,
        )
      },

      80,
    )
  }

  /* =======================================================
     SEARCH RESULT
  ======================================================= */

  function focusSearchResult(
    result:
      MapSearchResult,
  ) {
    const map =
      mapRef.current

    if (
      !map
    ) {
      return
    }

    closeSelectedFeature()

    setLayerPanel(
      false,
    )

    if (
      searchMarkerRef.current &&
      map.hasLayer(
        searchMarkerRef.current,
      )
    ) {
      map.removeLayer(
        searchMarkerRef.current,
      )
    }

    const marker =
      L.circleMarker(
        [
          result.latitude,
          result.longitude,
        ],
        {
          radius:
            9,

          color:
            '#ffffff',

          weight:
            4,

          fillColor:
            result.source ===
              'osm'
              ? '#0f766e'
              : '#3388ff',

          fillOpacity:
            1,
        },
      ).addTo(
        map,
      )

    marker.bindPopup(
      popupNode(
        result.title,

        result.subtitle ||
          (
            result.source ===
              'osm'
              ? 'OpenStreetMap place'
              : 'CMC building'
          ),
      ),
      {
        autoClose:
          true,

        closeOnClick:
          true,
      },
    )

    marker.openPopup()

    searchMarkerRef.current =
      marker

    map.flyTo(
      [
        result.latitude,
        result.longitude,
      ],

      18.5,

      {
        animate:
          true,

        duration:
          0.85,
      },
    )

    setPendingRequestLocation(
      {
        kind:
          'POINT',

        latitude:
          result.latitude,

        longitude:
          result.longitude,

        label:
          result.title,
      },
    )

    setSearch(
      '',
    )
  }

  /* =======================================================
     PREVIEW
  ======================================================= */

  if (
    mode ===
    'preview'
  ) {
    return (
      <div className="relative h-full min-h-[300px] w-full overflow-hidden rounded-2xl bg-slate-200">
        <div
          ref={
            hostRef
          }
          className="absolute inset-0"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-950/[.02] to-slate-950/10" />

        <div className="absolute bottom-4 left-4 flex max-w-[calc(100%-32px)] flex-col items-start rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-xl">
          <span className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[.08em] text-teal-700">
            <LocateFixed
              size={
                14
              }
            />

            CMC
          </span>

          <strong className="mt-1.5 text-[13px] text-slate-950">
            Live municipal
            spatial view
          </strong>

          <small className="mt-1 text-[9px] text-slate-500">
            CMC RGB imagery ·
            mapped buildings
          </small>
        </div>
      </div>
    )
  }

  /* =======================================================
     STATUS
  ======================================================= */

  const statusText =
    `${rgbLoaded ? 'RGB ready' : 'Loading RGB'} · ${loadedVectors.size}/${VECTOR_LAYERS.length} vector source${VECTOR_LAYERS.length === 1 ? '' : 's'} ready`

  const swatch =
    (
      key:
        LayerKey,
    ) => {
      if (
        key ===
        'rgb'
      ) {
        return '#6f8c4c'
      }

      if (
        key ===
        'requests'
      ) {
        return '#ef4444'
      }

      const cmcConfig =
        CMC_EXTRA_LAYERS.find(
          (
            config,
          ) =>
            config.key ===
            key,
        )

      if (
        cmcConfig
      ) {
        return cmcConfig.swatch
      }

      return '#3388ff'
    }

  /* =======================================================
     FULL MAP
  ======================================================= */

  return (
    <div className="civic-map-shell relative h-full min-h-[620px] w-full min-w-0 overflow-hidden bg-[#dbe7ef]">
      <style>{`
        @keyframes civicDropIn {
          from { opacity: 0; transform: translateY(-12px) scale(.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes civicFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes civicSlideInRight {
          from { opacity: 0; transform: translateX(24px) scale(.985); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes civicScaleIn {
          from { opacity: 0; transform: scale(.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes civicSoftPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(13,148,136,.15); }
          50% { box-shadow: 0 0 0 8px rgba(13,148,136,0); }
        }
        .civic-enter-top { animation: civicDropIn .28s cubic-bezier(.2,.8,.2,1) both; }
        .civic-enter-up { animation: civicFadeUp .28s cubic-bezier(.2,.8,.2,1) both; }
        .civic-enter-right { animation: civicSlideInRight .32s cubic-bezier(.2,.8,.2,1) both; }
        .civic-enter-scale { animation: civicScaleIn .22s cubic-bezier(.2,.8,.2,1) both; }
        .civic-map-control { transition: transform .2s ease, box-shadow .2s ease, background-color .2s ease, color .2s ease, border-color .2s ease; }
        .civic-map-control:hover { transform: translateY(-2px); }
        .civic-map-control:active { transform: translateY(0) scale(.97); }
        .civic-search-result { transition: background-color .16s ease, transform .16s ease; }
        .civic-search-result:hover { transform: translateX(3px); }
        .civic-live-dot { animation: civicSoftPulse 2.2s ease-in-out infinite; }

        .civic-map-shell .leaflet-popup-content-wrapper {
          border-radius: 16px;
          box-shadow: 0 18px 50px rgba(15, 23, 42, .18);
          border: 1px solid rgba(226, 232, 240, .95);
          overflow: hidden;
        }
        .civic-map-shell .leaflet-popup-content { margin: 16px 18px; }
        .civic-map-shell .leaflet-popup-tip { box-shadow: 3px 3px 12px rgba(15,23,42,.08); }
        .civic-map-shell .leaflet-popup { animation: civicScaleIn .18s ease-out both; }

        @media (prefers-reduced-motion: reduce) {
          .civic-enter-top,
          .civic-enter-up,
          .civic-enter-right,
          .civic-enter-scale,
          .civic-live-dot,
          .civic-map-shell .leaflet-popup {
            animation: none !important;
          }
          .civic-map-control,
          .civic-search-result { transition: none !important; }
        }
      `}</style>

      {/* MAP */}
      <div
        ref={hostRef}
        className="absolute inset-0 z-0"
        aria-label="Interactive CMC Visigeo map"
      />

      {/* subtle depth wash so floating UI remains readable on bright imagery */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] h-36 bg-gradient-to-b from-slate-950/10 via-slate-950/[.025] to-transparent" />

      {/* ===================================================
          SEARCH
      ==================================================== */}
      <div
        ref={searchWrapRef}
        className="civic-enter-top absolute left-3.5 top-3.5 z-[1600] flex h-[44px] w-[min(520px,calc(100%-112px))] items-center rounded-[14px] border border-white/80 bg-white/95 px-3.5 shadow-[0_8px_24px_rgba(15,23,42,.11)] backdrop-blur-xl max-lg:w-[min(480px,calc(100%-100px))] max-sm:left-2.5 max-sm:top-2.5 max-sm:h-[42px] max-sm:w-[calc(100%-64px)] max-sm:px-3"
      >
        <Search
          size={17}
          strokeWidth={1.9}
          className="mr-2.5 shrink-0 text-slate-500 max-sm:mr-2"
        />

        <input
          value={search}
          onFocus={() => {
            closeSelectedFeature()
            setLayerPanel(false)
          }}
          onChange={(event) => {
            setSearch(event.target.value)
          }}
          placeholder="Search a place, building, address or CMC ID..."
          className="!m-0 !h-auto min-w-0 flex-1 !border-0 !border-none !bg-transparent !p-0 text-[12px] font-medium leading-none text-slate-800 !shadow-none !outline-none !ring-0 placeholder:font-normal placeholder:text-slate-400 focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-none max-sm:text-[10px]"
          style={{
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            background: 'transparent',
            WebkitAppearance: 'none',
            appearance: 'none',
          }}
        />

        {searchLoading && (
          <LoaderCircle
            size={18}
            className="ml-3 shrink-0 animate-spin text-teal-700"
          />
        )}

        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch('')
              setOsmSearchResults([])
            }}
            aria-label="Clear search"
            className="civic-map-control ml-1.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border-0 bg-slate-100/70 text-slate-400 shadow-none outline-none hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={13} />
          </button>
        )}

        {search && (
          <div className="civic-enter-top absolute left-0 right-0 top-[calc(100%+6px)] z-[1650] max-h-[290px] overflow-y-auto rounded-[14px] border border-slate-200/90 bg-white/98 py-1 shadow-[0_18px_45px_rgba(11,19,35,.16)] backdrop-blur-xl">
            {searchResults.length ? (
              searchResults.map((result) => (
                <button
                  type="button"
                  key={`${result.source}-${result.id}`}
                  onClick={() => focusSearchResult(result)}
                  className="civic-search-result group flex w-full cursor-pointer items-center justify-between gap-2.5 border-0 border-b border-slate-100 bg-white px-3 py-2.5 text-left shadow-none outline-none last:border-b-0 hover:bg-teal-50/60"
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition ${
                        result.source === 'osm'
                          ? 'bg-teal-50 text-teal-700 group-hover:bg-teal-100'
                          : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                      }`}
                    >
                      <MapPin size={14} />
                    </span>

                    <span className="min-w-0">
                      <strong className="block truncate text-[10px] font-bold text-slate-900">
                        {result.title}
                      </strong>
                      <small className="mt-0.5 block truncate text-[8px] leading-3.5 text-slate-500">
                        {result.subtitle ||
                          (result.source === 'osm'
                            ? 'OpenStreetMap place'
                            : 'CMC building')}
                      </small>
                    </span>
                  </span>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[7px] font-extrabold uppercase tracking-[.08em] ${
                      result.source === 'osm'
                        ? 'bg-teal-50 text-teal-700'
                        : 'bg-blue-50 text-blue-600'
                    }`}
                  >
                    {result.source === 'osm' ? 'Place' : 'CMC'}
                  </span>
                </button>
              ))
            ) : searchLoading ? (
              <div className="flex items-center gap-3 px-4 py-4 text-[11px] text-slate-500">
                <LoaderCircle size={17} className="animate-spin text-teal-700" />
                Searching places and addresses...
              </div>
            ) : (
              <div className="px-4 py-4">
                <p className="text-[11px] font-semibold text-slate-700">
                  No matching result found.
                </p>
                <p className="mt-1 text-[9px] leading-4 text-slate-400">
                  Try a landmark, street, address or CMC building ID.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===================================================
          LEFT CONTROLS
      ==================================================== */}
      <div className="civic-enter-up absolute left-3.5 top-[66px] z-[1200] flex items-center gap-2 max-sm:left-2.5 max-sm:top-[62px]">
        <button
          ref={layerButtonRef}
          type="button"
          onClick={toggleLayerPanel}
          className={`civic-map-control flex h-[40px] cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 text-[10px] font-bold shadow-[0_6px_18px_rgba(15,23,42,.10)] backdrop-blur-xl outline-none max-sm:h-[38px] max-sm:px-2.5 max-sm:text-[9px] ${
            layerPanel
              ? 'border-teal-200 bg-teal-700 text-white'
              : 'border-white/80 bg-white/95 text-slate-600 hover:bg-white hover:text-teal-700'
          }`}
        >
          <Layers3 size={16} strokeWidth={1.9} className="shrink-0" />
          <span>Layers</span>
        </button>

        <button
          type="button"
          onClick={reset}
          className="civic-map-control flex h-[40px] cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-white/80 bg-white/95 px-3 text-[10px] font-bold text-slate-600 shadow-[0_6px_18px_rgba(15,23,42,.10)] backdrop-blur-xl outline-none hover:bg-white hover:text-teal-700 max-sm:h-[38px] max-sm:px-2.5 max-sm:text-[9px]"
        >
          <Crosshair size={16} strokeWidth={1.9} className="shrink-0" />
          <span>Show all</span>
        </button>

        {user?.role === 'CITIZEN' && (
          <button
            type="button"
            onClick={() =>
              openRequestForm()
            }
            className="civic-map-control flex h-[40px] cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-900 bg-slate-950 px-3 text-[10px] font-extrabold text-white shadow-[0_7px_20px_rgba(15,23,42,.18)] outline-none hover:bg-slate-800 max-sm:h-[38px] max-sm:px-2.5 max-sm:text-[9px]"
          >
            <Plus
              size={15}
              className="shrink-0"
            />

            <span>
              {pendingRequestLocation
                ? 'Report here'
                : 'Report'}
            </span>
          </button>
        )}
      </div>

      {/* ===================================================
          ZOOM
      ==================================================== */}
      <div className="civic-enter-scale absolute right-3.5 top-3.5 z-[1200] overflow-hidden rounded-xl border border-white/80 bg-white/95 shadow-[0_8px_22px_rgba(15,23,42,.11)] backdrop-blur-xl max-sm:right-2.5 max-sm:top-2.5">
        <button
          type="button"
          className="civic-map-control grid h-9 w-9 cursor-pointer place-items-center border-0 border-b border-slate-100 bg-transparent text-slate-600 hover:bg-slate-50 hover:text-teal-700 max-sm:h-8 max-sm:w-8"
          onClick={() => mapRef.current?.zoomIn()}
          aria-label="Zoom in"
        >
          <ZoomIn size={15} />
        </button>
        <button
          type="button"
          className="civic-map-control grid h-9 w-9 cursor-pointer place-items-center border-0 bg-transparent text-slate-600 hover:bg-slate-50 hover:text-teal-700 max-sm:h-8 max-sm:w-8"
          onClick={() => mapRef.current?.zoomOut()}
          aria-label="Zoom out"
        >
          <ZoomOut size={15} />
        </button>
      </div>

      {/* ===================================================
          LAYER PANEL
      ==================================================== */}
      {layerPanel && (
        <div
          ref={layerPanelRef}
          className="civic-enter-up absolute left-3.5 top-[112px] z-[1800] w-[min(285px,calc(100%-28px))] overflow-hidden rounded-[16px] border border-slate-200/90 bg-white/98 shadow-[0_18px_50px_rgba(11,19,35,.18)] backdrop-blur-xl max-sm:left-2.5 max-sm:top-[106px] max-sm:w-[calc(100%-20px)]"
        >
          <div className="flex items-start justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <span className="text-[8px] font-extrabold uppercase tracking-[.15em] text-teal-700">
                CMC GIS
              </span>
              <h3 className="mt-0.5 font-['Manrope'] text-[13px] font-extrabold text-slate-950">
                Map layers
              </h3>
              <p className="mt-0.5 text-[8px] text-slate-400">
                Choose what appears on the map.
              </p>
            </div>

            <button
              type="button"
              aria-label="Close layer panel"
              className="civic-map-control grid h-8 w-8 cursor-pointer place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              onClick={() => setLayerPanel(false)}
            >
              <X size={14} />
            </button>
          </div>

          <div className="max-h-[210px] overflow-y-auto p-1.5">
              {([
                /*
                  Existing layers.
                */
                ['rgb', 'CMC RGB imagery'],
                ['buildings', 'Buildings'],

                ...(user && user.role !== 'CITIZEN'
                  ? [
                      [
                        'requests',
                        'Government requests',
                      ],
                    ]
                  : []),

                /*
                  NEW CMC master-folder layers.

                  Public accounts get PUBLIC rows.
                  Authorized government users also get INTERNAL rows.
                */
                ...availableCmcLayers.map(
                  (
                    config,
                  ) =>
                    [
                      config.key,
                      config.label,
                    ] as [
                      LayerKey,
                      string,
                    ],
                ),
              ] as Array<
                [
                  LayerKey,
                  string,
                ]
              >).map(([key, label]) => (
              <label
                key={key}
                className="group flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-[9px] font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <i
                    className="h-2.5 w-2.5 shrink-0 rounded-sm border border-black/10 shadow-sm"
                    style={{ background: swatch(key) }}
                  />
                  <span className="truncate">{label}</span>
                </span>

                <span className={`relative h-5 w-9 shrink-0 rounded-full transition ${layers[key] ? 'bg-teal-600' : 'bg-slate-200'}`}>
                  <input
                    className="absolute inset-0 z-10 cursor-pointer opacity-0"
                    type="checkbox"
                    checked={layers[key]}
                    onChange={() => toggleLayer(key)}
                  />
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${layers[key] ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                </span>
              </label>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50/80 px-3 py-2 text-[7px] font-semibold text-slate-500">
            <span
              className={`civic-live-dot h-2 w-2 shrink-0 rounded-full ${
                vectorErrors.size ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            />
            <span className="min-w-0 truncate">
              {statusText} · zoom {zoom.toFixed(1)}
              {vectorErrors.size ? ` · ${vectorErrors.size} failed` : ''}
            </span>
          </div>
        </div>
      )}

      {/* ===================================================
          LEGEND
      ==================================================== */}
      <div className="civic-enter-up absolute bottom-3 left-3 z-[1100] flex flex-wrap items-center gap-2.5 rounded-xl border border-white/75 bg-white/95 px-2.5 py-2 text-[7px] font-semibold text-slate-500 shadow-[0_6px_18px_rgba(15,23,42,.09)] backdrop-blur-xl max-sm:hidden">
        <span className="flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-sm" style={{ background: '#6f8c4c' }} />
          RGB
        </span>
        <span className="flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-sm border-2 border-blue-500 bg-blue-100" />
          Buildings
        </span>
        {user && user.role !== 'CITIZEN' && (
          <span className="flex items-center gap-1.5">
            <i className="h-2.5 w-2.5 rounded-full bg-red-500" />
            Requests
          </span>
        )}
      </div>

      {/* ===================================================
          CMC ASSET / ROAD / FEATURE DRAWER
      ==================================================== */}
      {selectedCmcFeature && (
        <CmcFeatureDrawer
          feature={
            selectedCmcFeature
          }
          canCreateRequest={
            user?.role ===
            'CITIZEN'
          }
          onClose={() => {
            setSelectedCmcFeature(
              null,
            )

            mapRef.current?.closePopup()
          }}
          onCreateRequest={(
            feature,
          ) =>
            openRequestForm(
              {
                kind:
                  'POINT',

                latitude:
                  feature.latitude,

                longitude:
                  feature.longitude,

                label:
                  feature.title,
              },
            )
          }
        />
      )}

      {/* ===================================================
          BUILDING DRAWER
      ==================================================== */}
      {selectedFeature && (
        <aside
          ref={featureDrawerRef}
          className="civic-enter-right absolute bottom-3 right-3 top-3 z-[1800] w-[min(360px,calc(100%-24px))] overflow-hidden rounded-[20px] border border-slate-200/90 bg-white/98 shadow-[0_24px_65px_rgba(11,19,35,.24)] backdrop-blur-xl max-sm:left-3 max-sm:w-auto"
        >
          <div className="flex h-full flex-col">
            <div className="shrink-0 border-b border-slate-100 px-5 pb-4 pt-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <span className="text-[8px] font-extrabold uppercase tracking-[.15em] text-teal-700">
                    CMC GIS feature
                  </span>

                  {selectedFeature.isResolving ? (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-teal-50">
                        <LoaderCircle size={19} className="animate-spin text-teal-700" />
                      </div>
                      <div>
                        <h2 className="font-['Manrope'] text-[17px] font-extrabold tracking-[-.025em] text-slate-950">
                          Matching this building…
                        </h2>
                        <p className="mt-0.5 text-[9px] leading-4 text-slate-400">
                          Checking named OSM features inside the polygon.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="mt-1.5 break-words font-['Manrope'] text-[21px] font-extrabold leading-[1.15] tracking-[-.03em] text-slate-950">
                        {selectedFeature.resolvedName ||
                          selectedFeature.nativeName ||
                          (selectedFeature.featureId
                            ? `Building ${selectedFeature.featureId}`
                            : 'Mapped building')}
                      </h2>

                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {selectedFeature.resolvedType && (
                          <span className="inline-flex rounded-full bg-teal-50 px-2.5 py-1 text-[7px] font-extrabold uppercase tracking-[.08em] text-teal-700">
                            {selectedFeature.resolvedType}
                          </span>
                        )}

                        {selectedFeature.polygonMatched ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[7px] font-extrabold uppercase tracking-[.06em] text-emerald-700">
                            <CheckCircle2 size={11} />
                            Polygon verified
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[7px] font-extrabold uppercase tracking-[.06em] text-amber-700">
                            Name not verified
                          </span>
                        )}
                      </div>
                    </>
                  )}

                  {selectedFeature.resolvedAddress && (
                    <div className="mt-3 flex max-w-sm items-start gap-2 text-[10px] leading-4 text-slate-500">
                      <MapPin size={13} className="mt-0.5 shrink-0 text-teal-700" />
                      <span>{selectedFeature.resolvedAddress}</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  aria-label="Close building details"
                  className="civic-map-control grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  onClick={closeSelectedFeature}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5">
                  <small className="text-[7px] font-extrabold uppercase tracking-[.1em] text-slate-400">
                    CMC Building ID
                  </small>
                  <strong className="mt-1 block break-all text-[11px] text-slate-800">
                    {selectedFeature.featureId || '—'}
                  </strong>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5">
                  <small className="text-[7px] font-extrabold uppercase tracking-[.1em] text-slate-400">
                    Name match
                  </small>
                  <strong
                    className={`mt-1 block text-[11px] ${
                      selectedFeature.polygonMatched
                        ? 'text-emerald-700'
                        : 'text-amber-700'
                    }`}
                  >
                    {selectedFeature.polygonMatched ? 'Polygon verified' : 'Not verified'}
                  </strong>
                </div>
              </div>

              <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5">
                  <small className="text-[7px] font-extrabold uppercase tracking-[.1em] text-slate-400">
                    Latitude
                  </small>
                  <strong className="mt-1 block text-[11px] text-slate-800">
                    {selectedFeature.latitude}
                  </strong>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5">
                  <small className="text-[7px] font-extrabold uppercase tracking-[.1em] text-slate-400">
                    Longitude
                  </small>
                  <strong className="mt-1 block text-[11px] text-slate-800">
                    {selectedFeature.longitude}
                  </strong>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/90">
                <span className="block bg-slate-50 px-4 py-2.5 text-[8px] font-extrabold uppercase tracking-[.12em] text-slate-500">
                  CMC feature properties
                </span>

                {readablePropertyEntries(selectedFeature.properties).length ? (
                  readablePropertyEntries(selectedFeature.properties).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between gap-4 border-t border-slate-100 px-4 py-2.5 text-[9px]"
                    >
                      <span className="text-slate-500">{key}</span>
                      <strong className="max-w-[62%] break-words text-right font-semibold text-slate-800">
                        {String(value)}
                      </strong>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-[10px] leading-5 text-slate-500">
                    No additional attributes are stored in the CMC building GeoJSON.
                  </p>
                )}
              </div>
            </div>

            {user?.role === 'CITIZEN' && (
              <div className="shrink-0 border-t border-slate-100 bg-white/95 p-4">
                <button
                  type="button"
                  className="civic-map-control flex min-h-[40px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-950 px-3.5 text-[10px] font-extrabold text-white shadow-[0_8px_18px_rgba(15,23,42,.14)] hover:bg-slate-800"
                  onClick={() =>
                    openRequestForm(
                      {
                        kind:
                          'POINT',

                        latitude:
                          selectedFeature.latitude,

                        longitude:
                          selectedFeature.longitude,

                        label:
                          selectedFeature.resolvedName ||
                          selectedFeature.nativeName ||
                          selectedFeature.resolvedAddress ||
                          (
                            selectedFeature.featureId
                              ? `Building ${selectedFeature.featureId}`
                              : 'Selected building'
                          ),
                      },
                    )
                  }
                >
                  <Plus size={16} />
                  Create request here
                </button>
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  )
}
