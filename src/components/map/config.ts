import type {
  LatLngExpression,
} from 'leaflet'

import type {
  RequestType,
} from '../../types'

import type {
  VectorConfig,
} from './types'

export const CMC_CENTER:
  LatLngExpression = [
    6.90734,
    79.86237,
  ]

export const CMC_FALLBACK_ZOOM =
  16

export const VISIGEO_ROOT =
  'https://cmc.visigeo.com'

export const VISIGEO_PROXY_ROOT =
  '/cmc'

export const VECTOR_LAYERS:
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

        bubblingMouseEvents:
          false,
      },
    },
  ]

export const requestColors:
  Record<RequestType, string> = {
    COMPLAINT:
      '#d92d20',

    INQUIRY:
      '#1677d2',

    BOOKING:
      '#7a5af8',

    SUGGESTION:
      '#099250',
  }
