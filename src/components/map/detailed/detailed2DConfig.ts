import {
  CMC_EXTRA_LAYERS,
  type CmcLayerKey,
} from '../../../lib/cmcLayers'
import type {
  LayerKey,
} from '../types'

export const DETAILED_2D_PUBLIC_LAYERS:
  CmcLayerKey[] = [
    'landParcels',
    'roadSurface',
    'roadFeatures',
    'roadBoundary',
    'roadSideLines',
    'roadMarkings',
    'laneLines',
    'stopLines',
    'crosswalks',
    'forbidLines',
    'planarFacilities',
    'trafficSigns',
    'signalLightPosts',
    'busStops',
    'busStopAreas',
    'roadNameBoards',
    'signBoards',
    'trees',
    'fences',
  ]

export const DETAILED_2D_INTERNAL_LAYERS:
  CmcLayerKey[] = [
    'poles',
    'lightPoles',
    'telephoneElectricPosts',
    'manholes',
    'stormwaterDrains',
    'fireHydrants',
    'utilityBoxes',
    'sewage',
    'waterValves',
  ]

export const DETAILED_2D_MIN_ZOOM:
  Partial<
    Record<CmcLayerKey, number>
  > = {
    landParcels: 13,
    roadSurface: 13,
    roadFeatures: 14,
    roadBoundary: 13,
    roadSideLines: 14,
    roadMarkings: 15,
    laneLines: 15,
    stopLines: 15,
    crosswalks: 15,
    forbidLines: 15,
    planarFacilities: 14,
    trees: 14.5,
    trafficSigns: 15,
    signalLightPosts: 15,
    busStops: 14,
    busStopAreas: 14,
    roadNameBoards: 15,
    signBoards: 15,
    fences: 14.5,
    poles: 15,
    lightPoles: 15,
    telephoneElectricPosts: 15,
    manholes: 15.5,
    stormwaterDrains: 15.5,
    fireHydrants: 15,
    utilityBoxes: 15,
    sewage: 15.5,
    waterValves: 15.5,
  }

export function buildDetailed2DLayerState(
  current: Record<LayerKey, boolean>,
  canSeeInternalCmc: boolean,
) {
  const next = {
    ...current,
    rgb: false,
    buildings: true,
  }

  CMC_EXTRA_LAYERS.forEach(
    (config) => {
      next[config.key] = false
    },
  )

  DETAILED_2D_PUBLIC_LAYERS.forEach(
    (key) => {
      next[key] = true
    },
  )

  if (canSeeInternalCmc) {
    DETAILED_2D_INTERNAL_LAYERS.forEach(
      (key) => {
        next[key] = true
      },
    )
  }

  return next
}

export function isDetailed2DLayerVisibleAtZoom(
  key: CmcLayerKey,
  zoom: number,
) {
  return (
    zoom >=
    (DETAILED_2D_MIN_ZOOM[key] ??
      13)
  )
}
