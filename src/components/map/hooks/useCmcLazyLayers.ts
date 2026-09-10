import L from 'leaflet'
import {
  useEffect,
  useRef,
} from 'react'
import type {
  Dispatch,
  RefObject,
  SetStateAction,
} from 'react'

import {
  CMC_EXTRA_LAYERS,
  createCmcLeafletLayer,
  type CmcFeatureSelection,
} from '../../../lib/cmcLayers'
import {
  mapService,
} from '../../../services/map.service'
import {
  createDetailed2DPointLayer,
  ensureDetailed2DPanes,
  getDetailedCmcPathStyle,
  isDetailed2DLayerVisibleAtZoom,
} from '../detailed'
import type {
  LayerKey,
  MapViewMode,
  RequestMapLocation,
  SelectedFeature,
} from '../types'
import type {
  CivicMapRefs,
} from './useMapRefs'

export function useCmcLazyLayers({
  mapReady,
  refs,
  layers,
  layersRef,
  canSeeInternalCmc,
  mapViewMode,
  setSelectedFeature,
  setSelectedCmcFeature,
  setLayerPanel,
  setSearch,
  setPendingRequestLocation,
}: {
  mapReady: boolean
  refs: CivicMapRefs
  layers: Record<LayerKey, boolean>
  layersRef: RefObject<
    Record<LayerKey, boolean>
  >
  canSeeInternalCmc: boolean
  mapViewMode: MapViewMode
  setSelectedFeature:
    Dispatch<
      SetStateAction<
        SelectedFeature | null
      >
    >
  setSelectedCmcFeature:
    Dispatch<
      SetStateAction<
        CmcFeatureSelection | null
      >
    >
  setLayerPanel:
    Dispatch<SetStateAction<boolean>>
  setSearch:
    Dispatch<SetStateAction<string>>
  setPendingRequestLocation:
    Dispatch<
      SetStateAction<
        RequestMapLocation | null
      >
    >
}) {
  const renderedModeRef =
    useRef<MapViewMode | null>(
      null,
    )

  useEffect(() => {
    const map = refs.mapRef.current

    if (!mapReady || !map) {
      return
    }

    ensureDetailed2DPanes(map)

    /*
      Point layers use CircleMarkers in normal/RGB mode and SVG symbols
      in Detailed 2D mode. Therefore the cached CMC GeoJSON layers need
      to be rebuilt when the rendering mode changes.
    */
    if (
      renderedModeRef.current !==
      mapViewMode
    ) {
      Object.values(
        refs.cmcVectorRefs.current,
      ).forEach((layer) => {
        if (
          layer &&
          map.hasLayer(layer)
        ) {
          map.removeLayer(layer)
        }
      })

      refs.cmcVectorRefs.current =
        {}

      renderedModeRef.current =
        mapViewMode
    }

    const abort =
      new AbortController()

    CMC_EXTRA_LAYERS.forEach(
      (config) => {
        if (!layers[config.key]) {
          return
        }

        if (
          config.access ===
            'INTERNAL' &&
          !canSeeInternalCmc
        ) {
          return
        }

        if (
          refs.cmcVectorRefs.current[
            config.key
          ]
        ) {
          return
        }

        void (async () => {
          try {
            const data =
              await mapService.fetchGeoJson<any>(
                mapService.cmcLayerUrl(
                  config.key,
                ),
                abort.signal,
              )

            if (
              abort.signal.aborted
            ) {
              return
            }

            const detailed =
              mapViewMode ===
              'detailed'

            const geoLayer =
              createCmcLeafletLayer(
                data,
                config,
                (feature) => {
                  refs.selectionSequenceRef.current +=
                    1

                  refs.buildingLookupAbortRef.current?.abort()
                  refs.buildingLookupAbortRef.current =
                    null

                  setSelectedFeature(
                    null,
                  )
                  setSelectedCmcFeature(
                    feature,
                  )
                  setLayerPanel(false)
                  setSearch('')

                  setPendingRequestLocation({
                    kind: 'POINT',
                    latitude:
                      feature.latitude,
                    longitude:
                      feature.longitude,
                    label:
                      feature.title,
                  })

                  if (
                    refs.requestPinRef.current &&
                    map.hasLayer(
                      refs.requestPinRef.current,
                    )
                  ) {
                    map.removeLayer(
                      refs.requestPinRef.current,
                    )
                  }

                  refs.requestPinRef.current =
                    L.circleMarker(
                      [
                        feature.latitude,
                        feature.longitude,
                      ],
                      {
                        radius: 7,
                        color: '#ffffff',
                        weight: 3,
                        fillColor:
                          '#0f766e',
                        fillOpacity: 1,
                      },
                    ).addTo(map)

                  refs.requestPinRef.current
                    .bindTooltip(
                      'Request location',
                      {
                        direction: 'top',
                        offset: [0, -7],
                        opacity: 0.92,
                      },
                    )
                    .openTooltip()
                },
                detailed
                  ? {
                      style: (
                        _feature,
                        layerConfig,
                      ) =>
                        getDetailedCmcPathStyle(
                          layerConfig.key,
                        ),

                      pointToLayer: (
                        _feature,
                        latlng,
                        layerConfig,
                      ) =>
                        createDetailed2DPointLayer(
                          layerConfig.key,
                          latlng,
                        ),
                    }
                  : undefined,
              )

            refs.cmcVectorRefs.current[
              config.key
            ] = geoLayer

            const active =
              Boolean(
                layersRef.current?.[
                  config.key
                ],
              )

            const zoomVisible =
              !detailed ||
              isDetailed2DLayerVisibleAtZoom(
                config.key,
                map.getZoom(),
              )

            if (
              active &&
              zoomVisible
            ) {
              geoLayer.addTo(map)
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
              `Unable to load CMC GIS layer: ${config.label}`,
              error,
            )
          }
        })()
      },
    )

    return () => {
      abort.abort()
    }
  }, [
    mapReady,
    layers,
    canSeeInternalCmc,
    mapViewMode,
  ])
}
