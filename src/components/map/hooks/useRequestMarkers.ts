import L from 'leaflet'
import { useEffect } from 'react'

import type {
  ServiceRequest,
} from '../../../types'
import {
  requestColors,
} from '../config'
import {
  popupNode,
} from '../helpers'
import type {
  CivicMapRefs,
} from './useMapRefs'

export function useRequestMarkers({
  mapReady,
  refs,
  visibleRequests,
}: {
  mapReady: boolean
  refs: CivicMapRefs
  visibleRequests: ServiceRequest[]
}) {
  useEffect(() => {
    const group =
      refs.requestLayerRef.current

    if (!mapReady || !group) {
      return
    }

    group.clearLayers()

    visibleRequests.forEach(
      (request) => {
        if (
          typeof request.latitude !==
            'number' ||
          typeof request.longitude !==
            'number'
        ) {
          return
        }

        const color =
          requestColors[request.type]

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
          {
            autoClose: true,
            closeOnClick: true,
          },
        )

        marker.addTo(group)
      },
    )
  }, [
    mapReady,
    visibleRequests,
  ])
}
