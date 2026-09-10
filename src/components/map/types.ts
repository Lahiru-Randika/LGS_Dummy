import type {
  PathOptions,
} from 'leaflet'

import type {
  CmcLayerKey,
} from '../../lib/cmcLayers'

export type VectorKey =
  'buildings'

export type MapViewMode =
  | 'standard'
  | 'rgb'
  | 'detailed'

export type LayerKey =
  | 'rgb'
  | VectorKey
  | CmcLayerKey
  | 'requests'

export type VectorConfig = {
  key: VectorKey
  label: string
  url: string
  style: PathOptions
}

export type SelectedFeature = {
  layerKey: VectorKey
  layerLabel: string
  featureId?: string
  latitude: number
  longitude: number
  properties: Record<string, unknown>
  nativeName?: string
  resolvedName?: string
  resolvedAddress?: string
  resolvedType?: string
  isResolving: boolean
  polygonMatched: boolean
}

export type LocalSearchFeature = {
  id: string
  title: string
  subtitle: string
  latitude: number
  longitude: number
  source: 'cmc'
}

export type MapSearchResult =
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

export type RequestMapLocation = {
  kind: 'POINT'
  latitude: number
  longitude: number
  label?: string
}

export type MapFocusTarget = {
  latitude: number
  longitude: number
  requestId?: string
  label?: string
}
