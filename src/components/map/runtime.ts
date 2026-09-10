import L from 'leaflet'
import type { RefObject } from 'react'

import {
  CMC_CENTER,
  CMC_FALLBACK_ZOOM,
} from './config'
import type {
  VectorKey,
} from './types'

export function fitWholeArea(
  mapRef: RefObject<L.Map | null>,
  vectorRefs: RefObject<
    Partial<Record<VectorKey, L.GeoJSON>>
  >,
  animate = true,
) {
  const map = mapRef.current

  if (!map) {
    return
  }

  map.closePopup()

  const buildings =
    vectorRefs.current?.buildings

  if (buildings) {
    const bounds =
      buildings.getBounds()

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        paddingTopLeft: [70, 90],
        paddingBottomRight: [70, 80],
        animate,
        duration: animate
          ? 0.8
          : undefined,
        maxZoom: 17,
      })

      return
    }
  }

  map.setView(
    CMC_CENTER,
    CMC_FALLBACK_ZOOM,
    { animate },
  )
}
