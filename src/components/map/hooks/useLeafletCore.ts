import L from 'leaflet'
import {
  useEffect,
  useState,
} from 'react'
import type {
  Dispatch,
  RefObject,
  SetStateAction,
} from 'react'

import {
  CMC_CENTER,
  CMC_FALLBACK_ZOOM,
  VISIGEO_ROOT,
} from '../config'
import {
  ensureDetailed2DPanes,
} from '../detailed'
import {
  popupNode,
} from '../helpers'
import type {
  LayerKey,
  RequestMapLocation,
  SelectedFeature,
} from '../types'
import type {
  CmcFeatureSelection,
} from '../../../lib/cmcLayers'
import type {
  CivicMapRefs,
} from './useMapRefs'

export function useLeafletCore({
  mode,
  refs,
  layersRef,
  setRgbLoaded,
  setZoom,
  setSelectedFeature,
  setSelectedCmcFeature,
  setLayerPanel,
  setSearch,
  setPendingRequestLocation,
}: {
  mode: 'full' | 'preview'
  refs: CivicMapRefs
  layersRef: RefObject<
    Record<LayerKey, boolean>
  >
  setRgbLoaded:
    Dispatch<SetStateAction<boolean>>
  setZoom:
    Dispatch<SetStateAction<number>>
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
  const [
    mapReady,
    setMapReady,
  ] = useState(false)

  useEffect(() => {
    if (
      !refs.hostRef.current ||
      refs.mapRef.current
    ) {
      return
    }

    const initialFocus =
      refs.mapFocusRef.current

    const map =
      L.map(
        refs.hostRef.current,
        {
          zoomControl: false,
          attributionControl: true,
          preferCanvas: true,
          minZoom: 12,
          maxZoom: 22,
          zoomSnap: 0.5,
          doubleClickZoom: true,
          closePopupOnClick: true,
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
          : mode === 'preview'
            ? 15
            : CMC_FALLBACK_ZOOM,
      )

    refs.mapRef.current = map

    ensureDetailed2DPanes(map)

    refs.baseMapRef.current =
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

    refs.baseMapRef.current.addTo(
      map,
    )

    refs.imageryRef.current =
      L.tileLayer(
        `${VISIGEO_ROOT}/rgb/{z}/{x}/{y}.png`,
        {
          minZoom: 14,
          maxZoom: 22,
          opacity: 1,
          zIndex: 100,
          keepBuffer: 5,
          updateWhenIdle: false,
          updateWhenZooming: false,
          className:
            'cmc-visigeo-rgb',
          attribution:
            'CMC imagery · Visigeo',
        },
      )

    refs.imageryRef.current.on(
      'tileload',
      () => {
        setRgbLoaded(true)
      },
    )

    if (
      layersRef.current?.rgb
    ) {
      refs.imageryRef.current.addTo(
        map,
      )
    }

    if (initialFocus) {
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

      focusMarker.addTo(map)
      refs.mapFocusMarkerRef.current =
        focusMarker

      map.whenReady(() => {
        if (
          refs.mapRef.current !== map ||
          !map.getContainer()
            ?.isConnected
        ) {
          return
        }

        focusMarker.openPopup()
      })
    }

    refs.requestLayerRef.current =
      L.layerGroup()

    if (
      layersRef.current?.requests
    ) {
      refs.requestLayerRef.current.addTo(
        map,
      )
    }

    const handleMapClick =
      (event: L.LeafletMouseEvent) => {
        refs.selectionSequenceRef.current +=
          1

        refs.buildingLookupAbortRef.current?.abort()
        refs.buildingLookupAbortRef.current =
          null

        setSelectedFeature(null)
        setSelectedCmcFeature(null)
        setLayerPanel(false)
        setSearch('')

        const latitude = Number(
          event.latlng.lat.toFixed(7),
        )
        const longitude = Number(
          event.latlng.lng.toFixed(7),
        )

        setPendingRequestLocation({
          kind: 'POINT',
          latitude,
          longitude,
          label: 'Pinned map location',
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
            [latitude, longitude],
            {
              radius: 8,
              color: '#ffffff',
              weight: 3,
              fillColor: '#0f766e',
              fillOpacity: 1,
            },
          ).addTo(map)

        refs.requestPinRef.current
          .bindTooltip(
            'Request location',
            {
              direction: 'top',
              offset: [0, -8],
              opacity: 0.92,
            },
          )
          .openTooltip()

        map.closePopup()
      }

    map.on(
      'click',
      handleMapClick,
    )

    const handleZoom = () => {
      setZoom(map.getZoom())
    }

    map.on(
      'zoomend',
      handleZoom,
    )

    const observer =
      new ResizeObserver(() => {
        map.invalidateSize({
          animate: false,
        })
      })

    observer.observe(
      refs.hostRef.current,
    )

    setMapReady(true)

    return () => {
      setMapReady(false)

      refs.buildingLookupAbortRef.current?.abort()
      refs.buildingLookupAbortRef.current =
        null

      observer.disconnect()

      map.off(
        'click',
        handleMapClick,
      )
      map.off(
        'zoomend',
        handleZoom,
      )

      map.remove()

      refs.mapRef.current = null
      refs.baseMapRef.current = null
      refs.imageryRef.current = null
      refs.vectorRefs.current = {}
      refs.cmcVectorRefs.current = {}
      refs.requestLayerRef.current =
        null
      refs.searchMarkerRef.current =
        null
      refs.requestPinRef.current = null
      refs.mapFocusMarkerRef.current =
        null
      refs.initialFitDoneRef.current =
        false
    }
  }, [mode])

  return mapReady
}
