import L from 'leaflet'
import { useEffect } from 'react'

import {
  CMC_EXTRA_LAYERS,
} from '../../../lib/cmcLayers'
import {
  VECTOR_LAYERS,
} from '../config'
import {
  isDetailed2DLayerVisibleAtZoom,
} from '../detailed'
import type {
  LayerKey,
  MapViewMode,
} from '../types'
import type {
  CivicMapRefs,
} from './useMapRefs'

export function useLayerVisibility({
  mapReady,
  refs,
  layers,
  canSeeInternalCmc,
  mapViewMode,
  zoom,
}: {
  mapReady: boolean
  refs: CivicMapRefs
  layers: Record<LayerKey, boolean>
  canSeeInternalCmc: boolean
  mapViewMode: MapViewMode
  zoom: number
}) {
  useEffect(() => {
    const map = refs.mapRef.current

    if (!mapReady || !map) {
      return
    }

    const toggle = (
      layer:
        | L.Layer
        | null
        | undefined,
      visible: boolean,
    ) => {
      if (!layer) {
        return
      }

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
      refs.imageryRef.current,
      layers.rgb &&
        mapViewMode !==
          'detailed',
    )

    toggle(
      refs.requestLayerRef.current,
      layers.requests,
    )

    VECTOR_LAYERS.forEach(
      (config) => {
        toggle(
          refs.vectorRefs.current[
            config.key
          ],
          layers[config.key],
        )
      },
    )

    CMC_EXTRA_LAYERS.forEach(
      (config) => {
        const permitted =
          config.access === 'PUBLIC' ||
          canSeeInternalCmc

        const zoomVisible =
          mapViewMode !==
            'detailed' ||
          isDetailed2DLayerVisibleAtZoom(
            config.key,
            zoom,
          )

        toggle(
          refs.cmcVectorRefs.current[
            config.key
          ],
          permitted &&
            layers[config.key] &&
            zoomVisible,
        )
      },
    )
  }, [
    mapReady,
    layers,
    canSeeInternalCmc,
    mapViewMode,
    zoom,
  ])
}
