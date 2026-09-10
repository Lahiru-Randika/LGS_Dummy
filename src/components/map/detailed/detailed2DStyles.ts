import type {
  PathOptions,
} from 'leaflet'

import type {
  CmcLayerKey,
} from '../../../lib/cmcLayers'
import type {
  MapViewMode,
} from '../types'
import {
  DETAILED_2D_PANES,
} from './detailed2DPanes'

export function getBuildingMapStyle(
  mode: MapViewMode,
  normalStyle: PathOptions,
): PathOptions {
  if (mode !== 'detailed') {
    return normalStyle
  }

  return {
    color: '#6b7280',
    weight: 1,
    opacity: 0.9,
    fillColor: '#f4e4bf',
    fillOpacity: 0.9,
  }
}

export function getDetailedCmcPathStyle(
  key: CmcLayerKey,
): PathOptions | undefined {
  switch (key) {
    case 'landParcels':
      return {
        pane: DETAILED_2D_PANES.land,
        color: '#8a8175',
        weight: 0.9,
        opacity: 0.72,
        fillColor: '#f4edda',
        fillOpacity: 0.9,
      }

    case 'roadSurface':
      return {
        pane:
          DETAILED_2D_PANES.roadSurface,
        color: '#b8aa91',
        weight: 1,
        opacity: 0.92,
        fillColor: '#fff7dc',
        fillOpacity: 0.9,
      }

    case 'roadFeatures':
      return {
        pane: DETAILED_2D_PANES.roadArea,
        color: '#c87a89',
        weight: 1,
        opacity: 0.9,
        fillColor: '#efb5c1',
        fillOpacity: 0.9,
      }

    case 'planarFacilities':
      return {
        pane: DETAILED_2D_PANES.roadArea,
        color: '#b7838e',
        weight: 1,
        opacity: 0.85,
        fillColor: '#efd1d8',
        fillOpacity: 0.9,
      }

    case 'roadBoundary':
      return {
        pane: DETAILED_2D_PANES.roadLines,
        color: '#4b5563',
        weight: 1.7,
        opacity: 0.92,
      }

    case 'roadSideLines':
      return {
        pane: DETAILED_2D_PANES.roadLines,
        color: '#8f5965',
        weight: 1.5,
        opacity: 0.9,
      }

    case 'laneLines':
      return {
        pane: DETAILED_2D_PANES.roadMarkings,
        color: '#374151',
        weight: 1.25,
        opacity: 0.9,
        dashArray: '6 6',
      }

    case 'stopLines':
      return {
        pane: DETAILED_2D_PANES.roadMarkings,
        color: '#111827',
        weight: 2.7,
        opacity: 0.95,
      }

    case 'roadMarkings':
      return {
        pane: DETAILED_2D_PANES.roadMarkings,
        color: '#5f5b53',
        weight: 1,
        opacity: 0.92,
        fillColor: '#f7f1df',
        fillOpacity: 0.9,
      }

    case 'crosswalks':
      return {
        pane: DETAILED_2D_PANES.roadMarkings,
        color: '#4b5563',
        weight: 1.2,
        opacity: 0.95,
        fillColor: '#ffffff',
        fillOpacity: 0.9,
        dashArray: '3 2',
      }

    case 'forbidLines':
      return {
        pane: DETAILED_2D_PANES.roadMarkings,
        color: '#c2413b',
        weight: 1.8,
        opacity: 0.92,
        dashArray: '7 4',
      }

    case 'fences':
      return {
        pane: DETAILED_2D_PANES.linearAssets,
        color: '#735a42',
        weight: 1.4,
        opacity: 0.9,
        dashArray: '2 3',
      }

    case 'busStopAreas':
      return {
        pane: DETAILED_2D_PANES.roadArea,
        color: '#765a9d',
        weight: 1,
        opacity: 0.9,
        fillColor: '#d9c9ef',
        fillOpacity: 0.9,
      }

    default:
      return undefined
  }
}
