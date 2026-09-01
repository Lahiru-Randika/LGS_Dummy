import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import {
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
import { requests } from '../data/mock'

import {
  reverseGeocode,
  searchPlaces,
  type PlaceSearchResult,
} from '../services/osmGeocoding'

import type { RequestType } from '../types'

/* =========================================================
   CMC CONFIG
========================================================= */

const CMC_CENTER: L.LatLngExpression = [
  6.90734,
  79.86237,
]

const CMC_FALLBACK_ZOOM = 16

const VISIGEO_ROOT =
  'https://cmc.visigeo.com'

const VISIGEO_PROXY_ROOT =
  '/cmc'

type VectorKey = 'buildings'

type LayerKey =
  | 'rgb'
  | VectorKey
  | 'requests'

type VectorConfig = {
  key: VectorKey
  label: string
  url: string
  style: L.PathOptions
}

type SelectedFeature = {
  layerKey: VectorKey
  layerLabel: string

  featureId?: string

  latitude: number
  longitude: number

  properties: Record<
    string,
    unknown
  >

  nativeName?: string

  resolvedName?: string
  resolvedAddress?: string
  resolvedType?: string

  isResolving: boolean
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

/* =========================================================
   VECTOR LAYERS
========================================================= */

const VECTOR_LAYERS: VectorConfig[] = [
  {
    key: 'buildings',

    label: 'Buildings',

    url:
      `${VISIGEO_PROXY_ROOT}/vector/buildings.geojson`,

    style: {
      color: '#3388ff',

      weight: 2,

      opacity: 0.95,

      fillColor: '#3388ff',

      fillOpacity: 0.16,
    },
  },
]

const requestColors: Record<
  RequestType,
  string
> = {
  COMPLAINT: '#d92d20',

  INQUIRY: '#1677d2',

  BOOKING: '#7a5af8',

  SUGGESTION: '#099250',
}

/* =========================================================
   HELPERS
========================================================= */

function getFeatureId(
  feature: any,
  properties: Record<
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

  for (const key of keys) {
    const value =
      properties[key]

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim()
    ) {
      return String(value)
    }
  }

  if (
    feature?.id !== undefined &&
    feature?.id !== null
  ) {
    return String(feature.id)
  }

  return undefined
}

function getNativeFeatureName(
  properties: Record<
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

  for (const key of keys) {
    const value =
      properties[key]

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim()
    ) {
      return String(value).trim()
    }
  }

  return undefined
}

function getFeatureSubtitle(
  properties: Record<
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

  const values: string[] = []

  for (const key of keys) {
    const value =
      properties[key]

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim()
    ) {
      const text =
        String(value).trim()

      if (
        !values.includes(text)
      ) {
        values.push(text)
      }
    }
  }

  return values
    .slice(0, 2)
    .join(' · ')
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
    '205px'

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

  heading.style.color =
    '#0b1323'

  const sub =
    document.createElement(
      'div',
    )

  sub.textContent =
    subtitle

  sub.style.marginTop =
    '5px'

  sub.style.fontSize =
    '10px'

  sub.style.lineHeight =
    '1.45'

  sub.style.color =
    '#66778a'

  root.append(
    heading,
    sub,
  )

  return root
}

function readablePropertyEntries(
  properties: Record<
    string,
    unknown
  >,
) {
  return Object.entries(
    properties,
  )
    .filter(
      ([, value]) =>
        value !== null &&
        value !== undefined &&
        String(value).trim() !== '',
    )
    .slice(0, 14)
}

/* =========================================================
   COMPONENT
========================================================= */

export function CivicMap({
  mode = 'full',
}: {
  mode?: 'full' | 'preview'
}) {
  const hostRef =
    useRef<HTMLDivElement | null>(
      null,
    )

  const mapRef =
    useRef<L.Map | null>(null)

  const baseMapRef =
    useRef<L.TileLayer | null>(
      null,
    )

  const imageryRef =
    useRef<L.TileLayer | null>(
      null,
    )

  const vectorRefs =
    useRef<
      Partial<
        Record<
          VectorKey,
          L.GeoJSON
        >
      >
    >({})

  const requestLayerRef =
    useRef<L.LayerGroup | null>(
      null,
    )

  const searchMarkerRef =
    useRef<L.CircleMarker | null>(
      null,
    )

  const initialFitDoneRef =
    useRef(false)

  const layerPanelRef =
    useRef<HTMLDivElement | null>(
      null,
    )

  const layerButtonRef =
    useRef<HTMLButtonElement | null>(
      null,
    )

  const featureDrawerRef =
    useRef<HTMLElement | null>(
      null,
    )

  const searchWrapRef =
    useRef<HTMLDivElement | null>(
      null,
    )

  const selectionSequenceRef =
    useRef(0)

  /*
    Important:
    prevents map click from immediately closing
    a building that was just clicked.
  */
  const buildingClickRef =
    useRef(false)

  const { user } = useAuth()

  const navigate =
    useNavigate()

  const [
    selectedFeature,
    setSelectedFeature,
  ] =
    useState<SelectedFeature | null>(
      null,
    )

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
  ] = useState('')

  const [
    searchLoading,
    setSearchLoading,
  ] = useState(false)

  const [
    layerPanel,
    setLayerPanel,
  ] = useState(false)

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
  ] = useState(false)

  const [
    loadedVectors,
    setLoadedVectors,
  ] =
    useState<Set<string>>(
      new Set(),
    )

  const [
    vectorErrors,
    setVectorErrors,
  ] =
    useState<Set<string>>(
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
      rgb: true,

      buildings: true,

      requests: Boolean(
        user &&
          user.role !==
            'CITIZEN',
      ),
    })

  const layersRef =
    useRef(layers)

  layersRef.current = layers

  /* =======================================================
     LOCAL SEARCH
  ======================================================= */

  const localFiltered =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase()

      if (!query) {
        return []
      }

      return localSearchFeatures
        .filter(
          (feature) =>
            `${feature.title} ${feature.subtitle} ${feature.id}`
              .toLowerCase()
              .includes(query),
        )
        .slice(0, 4)
    }, [
      search,
      localSearchFeatures,
    ])

  /* =======================================================
     OSM SEARCH
  ======================================================= */

  useEffect(() => {
    const query =
      search.trim()

    if (
      query.length < 3
    ) {
      setOsmSearchResults([])

      setSearchLoading(false)

      return
    }

    const abort =
      new AbortController()

    const timeout =
      window.setTimeout(
        async () => {
          try {
            setSearchLoading(true)

            const results =
              await searchPlaces(
                query,
                abort.signal,
              )

            if (
              abort.signal.aborted
            ) {
              return
            }

            setOsmSearchResults(
              results,
            )
          } catch (error) {
            if (
              error instanceof
                DOMException &&
              error.name ===
                'AbortError'
            ) {
              return
            }

            console.warn(
              'Search failed',
              error,
            )
          } finally {
            if (
              !abort.signal
                .aborted
            ) {
              setSearchLoading(false)
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
  }, [search])

  /* =======================================================
     COMBINED SEARCH
  ======================================================= */

  const searchResults:
    MapSearchResult[] =
    useMemo(() => {
      const remote =
        osmSearchResults.map(
          (result) => ({
            id: result.id,

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

      return [
        ...remote,
        ...localFiltered,
      ].slice(0, 9)
    }, [
      osmSearchResults,
      localFiltered,
    ])

  /* =======================================================
     REQUESTS
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
          (request) =>
            request.assignedTo ===
            user.id,
        )
      }

      return requests
    }, [user])

  /* =======================================================
     SHOW ALL
  ======================================================= */

  function showWholeArea(
    animate = true,
  ) {
    const map =
      mapRef.current

    if (!map) return

    map.closePopup()

    const buildingsLayer =
      vectorRefs.current
        .buildings

    if (buildingsLayer) {
      const bounds =
        buildingsLayer.getBounds()

      if (
        bounds.isValid()
      ) {
        map.fitBounds(
          bounds,
          {
            paddingTopLeft: [
              70,
              90,
            ],

            paddingBottomRight: [
              70,
              80,
            ],

            animate,

            duration:
              animate
                ? 0.8
                : undefined,

            maxZoom: 17,
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
     CLOSE
  ======================================================= */

  function closeSelectedFeature() {
    selectionSequenceRef.current +=
      1

    setSelectedFeature(null)

    mapRef.current?.closePopup()
  }

  function openLayerPanel() {
    /*
      Prevent panel overlap.

      Opening Layers closes building details.
    */
    closeSelectedFeature()

    setLayerPanel(
      (current) =>
        !current,
    )
  }

  /* =======================================================
     OUTSIDE UI CLICK
  ======================================================= */

  useEffect(() => {
    const handlePointerDown = (
      event: PointerEvent,
    ) => {
      const target =
        event.target as Node | null

      if (!target) return

      /*
        Close layer panel when clicking outside it.
      */
      if (
        layerPanel &&
        !layerPanelRef.current?.contains(
          target,
        ) &&
        !layerButtonRef.current?.contains(
          target,
        )
      ) {
        setLayerPanel(false)
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
  }, [layerPanel])

  /* =======================================================
     CREATE MAP
  ======================================================= */

  useEffect(() => {
    if (
      !hostRef.current ||
      mapRef.current
    ) {
      return
    }

    const map =
      L.map(
        hostRef.current,
        {
          zoomControl: false,

          attributionControl:
            true,

          preferCanvas: true,

          minZoom: 12,

          maxZoom: 22,

          zoomSnap: 0.5,

          doubleClickZoom:
            true,

          closePopupOnClick:
            true,
        },
      ).setView(
        CMC_CENTER,

        mode === 'preview'
          ? 15
          : CMC_FALLBACK_ZOOM,
      )

    mapRef.current = map

    /* =====================================================
       OSM BASE
    ====================================================== */

    baseMapRef.current =
      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          minZoom: 1,

          maxZoom: 22,

          zIndex: 1,

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
          minZoom: 14,

          maxZoom: 22,

          opacity: 1,

          zIndex: 100,

          keepBuffer: 5,

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
        setRgbLoaded(true)
      },
    )

    if (
      layersRef.current.rgb
    ) {
      imageryRef.current.addTo(
        map,
      )
    }

    /* =====================================================
       REQUESTS
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
       BACKGROUND MAP CLICK

       IMPORTANT FIX:
       Building clicks are ignored here.
    ====================================================== */

    const handleMapClick =
      () => {
        if (
          buildingClickRef.current
        ) {
          buildingClickRef.current =
            false

          return
        }

        selectionSequenceRef.current +=
          1

        setSelectedFeature(null)

        setLayerPanel(false)

        setSearch('')

        map.closePopup()
      }

    map.on(
      'click',
      handleMapClick,
    )

    /* =====================================================
       LOAD BUILDINGS
    ====================================================== */

    const abort =
      new AbortController()

    VECTOR_LAYERS.forEach(
      async (config) => {
        try {
          const response =
            await fetch(
              config.url,
              {
                signal:
                  abort.signal,

                headers: {
                  Accept:
                    'application/json, application/geo+json, */*',
                },
              },
            )

          if (!response.ok) {
            throw new Error(
              `${response.status} ${response.statusText} while loading ${config.url}`,
            )
          }

          const data =
            await response.json()

          const localResults:
            LocalSearchFeature[] =
            []

          const geoLayer =
            L.geoJSON(
              data as any,
              {
                /*
                  CRITICAL FIX.

                  Do not allow polygon click events to
                  propagate into map.on('click').
                */
                bubblingMouseEvents:
                  false,

                style:
                  () =>
                    config.style,

                onEachFeature: (
                  feature: any,
                  layer,
                ) => {
                  const properties =
                    (feature?.properties ||
                      {}) as Record<
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

                  /* =======================================
                     HOVER
                  ======================================= */

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
                              (config
                                .style
                                .weight ||
                                2) +
                              1,

                            fillOpacity:
                              Math.min(
                                (config
                                  .style
                                  .fillOpacity ||
                                  0) +
                                  0.13,

                                0.4,
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

                  /* =======================================
                     BUILDING CLICK
                  ======================================= */

                  layer.on(
                    'click',
                    async (
                      event:
                        L.LeafletMouseEvent,
                    ) => {
                      /*
                        EXTRA PROTECTION AGAINST MAP CLICK.
                      */
                      buildingClickRef.current =
                        true

                      if (
                        event.originalEvent
                      ) {
                        L.DomEvent.stop(
                          event.originalEvent,
                        )
                      }

                      /*
                        Never allow Layers drawer and
                        Building drawer at the same time.
                      */
                      setLayerPanel(false)

                      setSearch('')

                      /*
                        Use polygon centre for more reliable
                        OSM reverse lookup.
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
                        Show drawer IMMEDIATELY.

                        OSM lookup will update it afterward.
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
                        },
                      )

                      /*
                        Give visual focus to the selected
                        building.
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

                            weight: 4,

                            fillColor:
                              '#14b8a6',

                            fillOpacity:
                              0.24,
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
                        Show Leaflet popup.
                      */
                      const popup =
                        L.popup({
                          closeButton:
                            true,

                          autoClose:
                            true,

                          closeOnClick:
                            false,

                          maxWidth: 320,
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
                                : 'Finding place information…',
                            ),
                          )

                      map.openPopup(
                        popup,
                      )

                      /* ===================================
                         OSM LOOKUP
                      =================================== */

                      try {
                        const resolved =
                          await reverseGeocode(
                            latitude,
                            longitude,
                          )

                        if (
                          selectionSequenceRef.current !==
                          sequence
                        ) {
                          return
                        }

                        if (
                          !resolved
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
                                  }
                                : current,
                          )

                          return
                        }

                        const finalName =
                          nativeName ||
                          resolved.name ||
                          fallbackTitle

                        const finalAddress =
                          nativeSubtitle ||
                          resolved.shortAddress ||
                          resolved.displayName

                        const finalType =
                          [
                            resolved.type,
                            resolved.category,
                          ]
                            .filter(Boolean)
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
                            .join(' · ')

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
                                finalType ||
                                'CMC mapped building',
                            ),
                          )
                        }
                      } catch (error) {
                        console.warn(
                          'Place lookup failed',
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
                                  }
                                : current,
                          )
                        }
                      }

                      /*
                        Release map-click protection shortly
                        after the building click finishes.
                      */
                      window.setTimeout(
                        () => {
                          buildingClickRef.current =
                            false
                        },

                        100,
                      )
                    },
                  )
                },
              },
            )

          vectorRefs.current[
            config.key
          ] = geoLayer

          if (
            layersRef.current[
              config.key
            ]
          ) {
            geoLayer.addTo(map)
          }

          setLoadedVectors(
            (current) => {
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

          setLocalSearchFeatures(
            localResults,
          )

          if (
            !initialFitDoneRef.current
          ) {
            initialFitDoneRef.current =
              true

            window.setTimeout(
              () => {
                showWholeArea(false)
              },

              120,
            )
          }
        } catch (error) {
          if (
            error instanceof
              DOMException &&
            error.name ===
              'AbortError'
          ) {
            return
          }

          console.error(
            `Failed to load CMC layer ${config.label}`,
            error,
          )

          setVectorErrors(
            (current) => {
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
       MAP EVENTS
    ====================================================== */

    map.on(
      'zoomend',
      () => {
        setZoom(
          map.getZoom(),
        )
      },
    )

    const observer =
      new ResizeObserver(
        () => {
          map.invalidateSize({
            animate: false,
          })
        },
      )

    observer.observe(
      hostRef.current,
    )

    return () => {
      abort.abort()

      observer.disconnect()

      map.off(
        'click',
        handleMapClick,
      )

      map.remove()

      mapRef.current = null

      baseMapRef.current =
        null

      imageryRef.current =
        null

      vectorRefs.current = {}

      requestLayerRef.current =
        null

      searchMarkerRef.current =
        null

      initialFitDoneRef.current =
        false
    }
  }, [mode])

  /* =======================================================
     TOGGLE MAP LAYERS
  ======================================================= */

  useEffect(() => {
    const map =
      mapRef.current

    if (!map) return

    const toggle = (
      layer:
        | L.Layer
        | null
        | undefined,
      visible: boolean,
    ) => {
      if (!layer) return

      if (
        visible &&
        !map.hasLayer(layer)
      ) {
        layer.addTo(map)
      }

      if (
        !visible &&
        map.hasLayer(layer)
      ) {
        map.removeLayer(layer)
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
      (config) => {
        toggle(
          vectorRefs.current[
            config.key
          ],

          layers[config.key],
        )
      },
    )
  }, [layers])

  /* =======================================================
     REQUEST MARKERS
  ======================================================= */

  useEffect(() => {
    const group =
      requestLayerRef.current

    if (!group) return

    group.clearLayers()

    visibleRequests.forEach(
      (request) => {
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
              radius: 7,

              color: '#ffffff',

              weight: 3,

              fillColor: color,

              fillOpacity: 1,
            },
          )

        marker.bindPopup(
          popupNode(
            `${request.type} · ${request.id}`,

            `${request.title} · ${request.locationLabel}`,
          ),
        )

        marker.addTo(group)
      },
    )
  }, [visibleRequests])

  /* =======================================================
     LAYER TOGGLE
  ======================================================= */

  function toggleLayer(
    key: LayerKey,
  ) {
    setLayers(
      (current) => ({
        ...current,

        [key]:
          !current[key],
      }),
    )
  }

  /* =======================================================
     RESET
  ======================================================= */

  function reset() {
    selectionSequenceRef.current +=
      1

    setSelectedFeature(null)

    setLayerPanel(false)

    setSearch('')

    setOsmSearchResults([])

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
            animate: false,
          },
        )

        showWholeArea(true)
      },

      80,
    )
  }

  /* =======================================================
     SEARCH RESULT
  ======================================================= */

  function focusSearchResult(
    result: MapSearchResult,
  ) {
    const map =
      mapRef.current

    if (!map) return

    closeSelectedFeature()

    setLayerPanel(false)

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

    if (
      result.source === 'osm'
    ) {
      const marker =
        L.circleMarker(
          [
            result.latitude,
            result.longitude,
          ],
          {
            radius: 9,

            color: '#ffffff',

            weight: 4,

            fillColor:
              '#0f766e',

            fillOpacity: 1,
          },
        ).addTo(map)

      marker.bindPopup(
        popupNode(
          result.title,
          result.subtitle ||
            'OpenStreetMap place',
        ),
      )

      marker.openPopup()

      searchMarkerRef.current =
        marker
    }

    map.flyTo(
      [
        result.latitude,
        result.longitude,
      ],

      18.5,

      {
        animate: true,

        duration: 0.85,
      },
    )

    setSearch('')
  }

  /* =======================================================
     PREVIEW
  ======================================================= */

  if (
    mode === 'preview'
  ) {
    return (
      <div className="relative h-full min-h-[300px] w-full overflow-hidden rounded-2xl bg-slate-200">

        <div
          ref={hostRef}
          className="absolute inset-0"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-950/[.02] to-slate-950/10" />

        <div className="absolute bottom-4 left-4 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-xl">

          <span className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[.08em] text-teal-700">

            <LocateFixed
              size={14}
            />

            CMC
          </span>

          <strong className="mt-1.5 block text-[13px] text-slate-950">
            Live municipal spatial view
          </strong>
        </div>
      </div>
    )
  }

  const statusText =
    `${rgbLoaded ? 'RGB ready' : 'Loading RGB'} · ${loadedVectors.size}/${VECTOR_LAYERS.length} vector source ready`

  const swatch = (
    key: LayerKey,
  ) => {
    if (key === 'rgb') {
      return '#6f8c4c'
    }

    if (
      key === 'requests'
    ) {
      return '#ef4444'
    }

    return '#3388ff'
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="relative h-full min-h-[620px] w-full min-w-0 overflow-hidden bg-[#dbe7ef]">

      {/* MAP */}
      <div
        ref={hostRef}
        className="absolute inset-0 z-0"
        aria-label="Interactive CMC Visigeo map"
      />

      {/* SEARCH */}
      <div
        ref={searchWrapRef}
        className="absolute left-6 top-6 z-[1600] flex h-[62px] w-[min(680px,calc(100%-120px))] items-center gap-3 rounded-2xl border border-white/60 bg-white/95 px-5 shadow-[0_15px_45px_rgba(11,19,35,.12)] backdrop-blur-xl max-sm:left-4 max-sm:top-4 max-sm:h-14 max-sm:w-[calc(100%-88px)]"
      >
        <Search
          size={19}
          className="shrink-0 text-slate-500"
        />

        <input
          className="min-w-0 flex-1 bg-transparent text-[13px] text-slate-900 outline-none placeholder:text-slate-400"

          value={search}

          onChange={(event) =>
            setSearch(
              event.target.value,
            )
          }

          placeholder="Search a place, building name, address or CMC building ID…"
        />

        {searchLoading && (
          <LoaderCircle
            size={17}
            className="animate-spin text-teal-700"
          />
        )}

        {search && (
          <button
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg hover:bg-slate-100"

            onClick={() => {
              setSearch('')

              setOsmSearchResults([])
            }}
          >
            <X size={16} />
          </button>
        )}

        {search && (
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] max-h-[390px] overflow-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">

            {searchResults.length ? (
              searchResults.map(
                (result) => (
                  <button
                    key={`${result.source}-${result.id}`}

                    className="flex w-full cursor-pointer items-center justify-between gap-4 border-b border-slate-100 px-4 py-3 text-left hover:bg-teal-50"

                    onClick={() =>
                      focusSearchResult(
                        result,
                      )
                    }
                  >
                    <span className="flex min-w-0 items-center gap-3">

                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700">

                        <MapPin
                          size={16}
                        />
                      </span>

                      <span className="min-w-0">

                        <strong className="block truncate text-[12px] text-slate-900">
                          {result.title}
                        </strong>

                        <small className="mt-1 block truncate text-[10px] text-slate-500">
                          {result.subtitle}
                        </small>
                      </span>
                    </span>
                  </button>
                ),
              )
            ) : (
              <div className="p-5 text-[11px] text-slate-500">
                {searchLoading
                  ? 'Searching places…'
                  : 'No matching place found.'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* CONTROLS */}
      <div className="absolute left-6 top-[102px] z-[1200] flex gap-2 max-sm:left-4 max-sm:top-[86px]">

        <button
          ref={layerButtonRef}

          className="flex min-h-12 cursor-pointer items-center gap-2 rounded-2xl border border-white/70 bg-white/95 px-4 text-[11px] font-extrabold text-slate-600 shadow-lg transition hover:-translate-y-0.5 hover:text-teal-700"

          onClick={
            openLayerPanel
          }
        >
          <Layers3 size={18} />

          Layers
        </button>

        <button
          className="flex min-h-12 cursor-pointer items-center gap-2 rounded-2xl border border-white/70 bg-white/95 px-4 text-[11px] font-extrabold text-slate-600 shadow-lg transition hover:-translate-y-0.5 hover:text-teal-700"

          onClick={reset}
        >
          <Crosshair
            size={18}
          />

          Show all
        </button>
      </div>

      {/* ZOOM */}
      <div className="absolute right-5 top-5 z-[1200] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

        <button
          className="grid h-13 w-13 cursor-pointer place-items-center border-b border-slate-100 text-slate-600 hover:bg-slate-50"

          onClick={() =>
            mapRef.current?.zoomIn()
          }
        >
          <ZoomIn size={19} />
        </button>

        <button
          className="grid h-13 w-13 cursor-pointer place-items-center text-slate-600 hover:bg-slate-50"

          onClick={() =>
            mapRef.current?.zoomOut()
          }
        >
          <ZoomOut size={19} />
        </button>
      </div>

      {/* LAYERS */}
      {layerPanel && (
        <div
          ref={layerPanelRef}

          className="absolute right-5 top-24 z-[1800] w-[min(360px,calc(100%-32px))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_70px_rgba(11,19,35,.24)]"
        >
          <div className="flex items-start justify-between border-b border-slate-100 p-5">

            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-[.14em] text-teal-700">
                CMC GIS
              </span>

              <h3 className="mt-1.5 font-['Manrope'] text-lg font-extrabold">
                Visigeo layers
              </h3>
            </div>

            <button
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"

              onClick={() =>
                setLayerPanel(false)
              }
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-2">

            {([
              [
                'rgb',
                'CMC RGB imagery',
              ],

              [
                'buildings',
                'Buildings',
              ],

              ...(
                user &&
                user.role !==
                  'CITIZEN'
                  ? [
                      [
                        'requests',
                        'Government requests',
                      ],
                    ]
                  : []
              ),
            ] as Array<
              [
                LayerKey,
                string,
              ]
            >).map(
              ([key, label]) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-3.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <span className="flex items-center gap-2.5">

                    <i
                      className="h-2.5 w-2.5 rounded-sm"

                      style={{
                        background:
                          swatch(
                            key,
                          ),
                      }}
                    />

                    {label}
                  </span>

                  <input
                    className="h-4 w-4 cursor-pointer accent-teal-700"

                    type="checkbox"

                    checked={
                      layers[key]
                    }

                    onChange={() =>
                      toggleLayer(
                        key,
                      )
                    }
                  />
                </label>
              ),
            )}
          </div>

          <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-[9px] text-slate-500">

            <span className="mr-1 text-emerald-600">
              ●
            </span>

            {statusText}

            {' · '}zoom{' '}

            {zoom.toFixed(1)}

            {vectorErrors.size >
              0 &&
              ` · ${vectorErrors.size} failed`}
          </div>
        </div>
      )}

      {/* LEGEND */}
      <div className="absolute bottom-5 left-5 z-[1100] flex gap-3 rounded-xl bg-white/95 px-3.5 py-2.5 text-[9px] font-semibold text-slate-500 shadow-lg">

        <span>
          🟢 CMC RGB
        </span>

        <span>
          🔵 Buildings
        </span>
      </div>

      {/* CITIZEN BUTTON */}
      {user?.role ===
        'CITIZEN' && (
        <button
          className="absolute bottom-5 right-20 z-[1200] flex min-h-13 cursor-pointer items-center gap-2 rounded-2xl bg-slate-950 px-5 text-[12px] font-extrabold text-white shadow-xl hover:bg-slate-800"

          onClick={() =>
            navigate(
              '/app/requests?new=1',
            )
          }
        >
          <Plus size={19} />

          Report an issue
        </button>
      )}

      {/* ===================================================
          BUILDING DRAWER
      ==================================================== */}

      {selectedFeature && (
        <aside
          ref={featureDrawerRef}

          className="absolute bottom-5 right-5 top-5 z-[1800] w-[min(470px,calc(100%-32px))] overflow-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_30px_90px_rgba(11,19,35,.30)] max-sm:bottom-4 max-sm:left-4 max-sm:right-4 max-sm:top-4 max-sm:w-auto"
        >
          <div className="flex items-start justify-between gap-4">

            <div className="min-w-0">

              <span className="text-[9px] font-extrabold uppercase tracking-[.14em] text-teal-700">
                CMC GIS FEATURE
              </span>

              {selectedFeature.isResolving ? (
                <div className="mt-3 flex items-center gap-3">

                  <LoaderCircle
                    size={22}
                    className="animate-spin text-teal-700"
                  />

                  <div>
                    <h2 className="font-['Manrope'] text-xl font-extrabold">
                      Finding place information…
                    </h2>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Checking OpenStreetMap
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="mt-2 break-words font-['Manrope'] text-2xl font-extrabold leading-tight tracking-[-.03em]">

                    {selectedFeature.resolvedName ||
                      selectedFeature.nativeName ||
                      (
                        selectedFeature.featureId
                          ? `Building ${selectedFeature.featureId}`
                          : 'Mapped building'
                      )}
                  </h2>

                  {selectedFeature.resolvedType && (
                    <span className="mt-2 inline-flex rounded-full bg-teal-50 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[.08em] text-teal-700">

                      {
                        selectedFeature.resolvedType
                      }
                    </span>
                  )}
                </>
              )}

              {selectedFeature.resolvedAddress && (
                <div className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-slate-500">

                  <MapPin
                    size={14}
                    className="mt-0.5 shrink-0 text-teal-700"
                  />

                  <span>
                    {
                      selectedFeature.resolvedAddress
                    }
                  </span>
                </div>
              )}
            </div>

            <button
              className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"

              onClick={
                closeSelectedFeature
              }
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">

            <div className="rounded-2xl bg-slate-50 p-4">

              <small className="text-[9px] font-extrabold uppercase tracking-[.1em] text-slate-400">
                CMC Building ID
              </small>

              <strong className="mt-1 block text-[12px]">
                {
                  selectedFeature.featureId ||
                  '—'
                }
              </strong>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">

              <small className="text-[9px] font-extrabold uppercase tracking-[.1em] text-slate-400">
                Source
              </small>

              <strong className="mt-1 block text-[12px]">
                CMC + OSM
              </strong>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">

            <div className="rounded-2xl bg-slate-50 p-4">

              <small className="text-[9px] font-extrabold uppercase tracking-[.1em] text-slate-400">
                Latitude
              </small>

              <strong className="mt-1 block text-[12px]">
                {
                  selectedFeature.latitude
                }
              </strong>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">

              <small className="text-[9px] font-extrabold uppercase tracking-[.1em] text-slate-400">
                Longitude
              </small>

              <strong className="mt-1 block text-[12px]">
                {
                  selectedFeature.longitude
                }
              </strong>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">

            <span className="block bg-slate-50 px-4 py-3 text-[9px] font-extrabold uppercase tracking-[.12em] text-slate-500">
              CMC feature properties
            </span>

            {readablePropertyEntries(
              selectedFeature.properties,
            ).map(
              ([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between gap-4 border-t border-slate-100 px-4 py-3 text-[10px]"
                >
                  <span className="text-slate-500">
                    {key}
                  </span>

                  <strong className="max-w-[60%] break-words text-right text-slate-800">

                    {String(value)}
                  </strong>
                </div>
              ),
            )}
          </div>

          {user?.role ===
            'CITIZEN' && (
            <button
              className="mt-6 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-950 text-[12px] font-extrabold text-white hover:bg-slate-800"

              onClick={() =>
                navigate(
                  '/app/requests?new=1',
                )
              }
            >
              <Plus size={17} />

              Create request here
            </button>
          )}
        </aside>
      )}
    </div>
  )
}