import L from 'leaflet'
import {
  useEffect,
  useRef,
} from 'react'
import type { Dispatch, RefObject, SetStateAction } from 'react'

import { buildingsService } from '../../../services/buildings.service'
import { mapService } from '../../../services/map.service'
import { resolveBuildingPlace } from '../../../services/osmGeocoding'
import { VECTOR_LAYERS } from '../config'
import {
  DETAILED_2D_PANES,
  getBuildingMapStyle,
} from '../detailed'
import {
  getFeatureId,
  getFeatureSubtitle,
  getNativeFeatureName,
  popupNode,
  supportedGeometry,
} from '../helpers'
import { fitWholeArea } from '../runtime'
import type {
  LayerKey,
  LocalSearchFeature,
  MapViewMode,
  RequestMapLocation,
  SelectedFeature,
} from '../types'
import type { CmcFeatureSelection } from '../../../lib/cmcLayers'
import type { CivicMapRefs } from './useMapRefs'

export function useBuildingLayer({
  mapReady,
  refs,
  layersRef,
  canCacheBuildingResolution,
  mapViewMode,
  setSelectedFeature,
  setSelectedCmcFeature,
  setPendingRequestLocation,
  setLayerPanel,
  setSearch,
  setLoadedVectors,
  setVectorErrors,
  setLocalSearchFeatures,
}: {
  mapReady: boolean
  refs: CivicMapRefs
  layersRef: RefObject<Record<LayerKey, boolean>>
  canCacheBuildingResolution: boolean
  mapViewMode: MapViewMode
  setSelectedFeature: Dispatch<SetStateAction<SelectedFeature | null>>
  setSelectedCmcFeature: Dispatch<SetStateAction<CmcFeatureSelection | null>>
  setPendingRequestLocation: Dispatch<SetStateAction<RequestMapLocation | null>>
  setLayerPanel: Dispatch<SetStateAction<boolean>>
  setSearch: Dispatch<SetStateAction<string>>
  setLoadedVectors: Dispatch<SetStateAction<Set<string>>>
  setVectorErrors: Dispatch<SetStateAction<Set<string>>>
  setLocalSearchFeatures: Dispatch<SetStateAction<LocalSearchFeature[]>>
}) {
  const mapViewModeRef =
    useRef(mapViewMode)

  mapViewModeRef.current =
    mapViewMode

  useEffect(() => {
    const map = refs.mapRef.current

    if (!mapReady || !map) {
      return
    }

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
                pane:
                  DETAILED_2D_PANES.buildings,

                style:
                  () =>
                    getBuildingMapStyle(
                      mapViewModeRef.current,
                      config.style,
                    ),

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
                          const currentStyle =
                            getBuildingMapStyle(
                              mapViewModeRef.current,
                              config.style,
                            )

                          layer.setStyle(
                            {
                              ...currentStyle,

                              weight:
                                (
                                  currentStyle.weight ||
                                  2
                                ) + 1,

                              fillOpacity:
                                Math.min(
                                  (
                                    currentStyle.fillOpacity ||
                                    0
                                  ) + 0.12,
                                  0.82,
                                ),
                            },
                          )
                        },
                      )

                      layer.on(
                        'mouseout',
                        () => {
                          layer.setStyle(
                            getBuildingMapStyle(
                              mapViewModeRef.current,
                              config.style,
                            ),
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
                          null

                        /*
                          Abort previous building lookup.
                        */
                        refs.buildingLookupAbortRef.current?.abort()

                        const lookupAbort =
                          new AbortController()

                        refs.buildingLookupAbortRef.current =
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
                          ++refs.selectionSequenceRef.current

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
                              ...getBuildingMapStyle(
                                mapViewModeRef.current,
                                config.style,
                              ),

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
                                getBuildingMapStyle(
                                  mapViewModeRef.current,
                                  config.style,
                                ),
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
                            refs.selectionSequenceRef.current !==
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
                                canCacheBuildingResolution
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
                            refs.selectionSequenceRef.current ===
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

          refs.vectorRefs.current[
            config.key
          ] =
            geoLayer

          if (
            layersRef.current?.[
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
            !refs.initialFitDoneRef.current
          ) {
            refs.initialFitDoneRef.current =
              true

            /*
              Normal map opening:
                fit the whole CMC area.

              Request Detail → Open on map:
                KEEP the request zoom.
            */
            if (
              !refs.mapFocusRef.current
            ) {
              window.setTimeout(
                () => {
                  fitWholeArea(
                    refs.mapRef,
                    refs.vectorRefs,
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

    return () => {
      abort.abort()
    }
  }, [mapReady])

  useEffect(() => {
    if (!mapReady) {
      return
    }

    const buildingLayer =
      refs.vectorRefs.current.buildings

    const config =
      VECTOR_LAYERS.find(
        (item) =>
          item.key === 'buildings',
      )

    if (
      !buildingLayer ||
      !config
    ) {
      return
    }

    buildingLayer.setStyle(
      getBuildingMapStyle(
        mapViewMode,
        config.style,
      ),
    )
  }, [
    mapReady,
    mapViewMode,
  ])
}
