import {
  useEffect,
  useRef,
  useState,
} from 'react'
import type {
  Dispatch,
  SetStateAction,
} from 'react'

import {
  buildDetailed2DLayerState,
  ensureDetailed2DPanes,
} from '../detailed'
import type {
  LayerKey,
  MapViewMode,
} from '../types'
import type {
  CivicMapRefs,
} from './useMapRefs'

export function useDetailed2DMode({
  mapReady,
  refs,
  layers,
  setLayers,
  canSeeInternalCmc,
}: {
  mapReady: boolean
  refs: CivicMapRefs
  layers: Record<LayerKey, boolean>
  setLayers: Dispatch<
    SetStateAction<
      Record<LayerKey, boolean>
    >
  >
  canSeeInternalCmc: boolean
}) {
  const [
    mapViewMode,
    setMapViewModeState,
  ] = useState<MapViewMode>(
    layers.rgb ? 'rgb' : 'standard',
  )

  const previousLayersRef =
    useRef<
      Record<LayerKey, boolean> | null
    >(null)

  useEffect(() => {
    if (
      !mapReady ||
      !refs.mapRef.current
    ) {
      return
    }

    ensureDetailed2DPanes(
      refs.mapRef.current,
    )

    refs.baseMapRef.current?.setOpacity(
      mapViewMode === 'detailed'
        ? 0.88
        : 1,
    )
  }, [
    mapReady,
    mapViewMode,
  ])

  useEffect(() => {
    if (
      mapViewMode === 'detailed'
    ) {
      if (layers.rgb) {
        setLayers((current) => ({
          ...current,
          rgb: false,
        }))
      }

      return
    }

    const nextMode: MapViewMode =
      layers.rgb
        ? 'rgb'
        : 'standard'

    if (
      nextMode !== mapViewMode
    ) {
      setMapViewModeState(
        nextMode,
      )
    }
  }, [
    layers.rgb,
    mapViewMode,
    setLayers,
  ])

  function setMapViewMode(
    nextMode: MapViewMode,
  ) {
    if (
      nextMode === mapViewMode
    ) {
      return
    }

    if (
      nextMode === 'detailed'
    ) {
      previousLayersRef.current = {
        ...layers,
      }

      setMapViewModeState(
        'detailed',
      )

      setLayers(
        buildDetailed2DLayerState(
          layers,
          canSeeInternalCmc,
        ),
      )

      return
    }

    if (
      mapViewMode === 'detailed'
    ) {
      const restored =
        previousLayersRef.current
          ? {
              ...previousLayersRef.current,
            }
          : {
              ...layers,
            }

      restored.rgb =
        nextMode === 'rgb'

      previousLayersRef.current =
        null

      setLayers(restored)
      setMapViewModeState(
        nextMode,
      )

      return
    }

    setLayers((current) => ({
      ...current,
      rgb: nextMode === 'rgb',
    }))

    setMapViewModeState(
      nextMode,
    )
  }

  return {
    mapViewMode,
    setMapViewMode,
    detailed2D:
      mapViewMode === 'detailed',
  }
}

export type Detailed2DModeState =
  ReturnType<
    typeof useDetailed2DMode
  >
