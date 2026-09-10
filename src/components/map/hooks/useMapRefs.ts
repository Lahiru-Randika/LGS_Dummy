import L from 'leaflet'
import { useRef } from 'react'

import {
  readMapFocusTarget,
} from '../helpers'
import type {
  MapFocusTarget,
  VectorKey,
} from '../types'
import type {
  CmcLayerKey,
} from '../../../lib/cmcLayers'

export function useMapRefs(
  mode: 'full' | 'preview',
) {
  const hostRef =
    useRef<HTMLDivElement | null>(
      null,
    )

  const mapRef =
    useRef<L.Map | null>(
      null,
    )

  const mapFocusRef =
    useRef<MapFocusTarget | null>(
      mode === 'full'
        ? readMapFocusTarget()
        : null,
    )

  const mapFocusMarkerRef =
    useRef<L.CircleMarker | null>(
      null,
    )

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
    useRef<L.LayerGroup | null>(
      null,
    )

  const searchMarkerRef =
    useRef<L.CircleMarker | null>(
      null,
    )

  const requestPinRef =
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

  const buildingLookupAbortRef =
    useRef<AbortController | null>(
      null,
    )

  return {
    hostRef,
    mapRef,
    mapFocusRef,
    mapFocusMarkerRef,
    baseMapRef,
    imageryRef,
    vectorRefs,
    cmcVectorRefs,
    requestLayerRef,
    searchMarkerRef,
    requestPinRef,
    initialFitDoneRef,
    layerPanelRef,
    layerButtonRef,
    featureDrawerRef,
    searchWrapRef,
    selectionSequenceRef,
    buildingLookupAbortRef,
  }
}

export type CivicMapRefs =
  ReturnType<typeof useMapRefs>
