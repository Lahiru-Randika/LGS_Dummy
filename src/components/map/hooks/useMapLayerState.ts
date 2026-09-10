import {
  useRef,
  useState,
} from 'react'

import {
  CMC_EXTRA_LAYERS,
  DEFAULT_CMC_LAYER_VISIBILITY,
} from '../../../lib/cmcLayers'
import {
  CMC_FALLBACK_ZOOM,
  VECTOR_LAYERS,
} from '../config'
import type {
  LayerKey,
} from '../types'

type MapUser = {
  role: string
} | null | undefined

export function useMapLayerState({
  user,
  canSeeInternalCmc,
}: {
  user: MapUser
  canSeeInternalCmc: boolean
}) {
  const [
    layerPanel,
    setLayerPanel,
  ] = useState(false)

  const [
    layerSearch,
    setLayerSearch,
  ] = useState('')

  const [
    zoom,
    setZoom,
  ] = useState(
    CMC_FALLBACK_ZOOM,
  )

  const [
    rgbLoaded,
    setRgbLoaded,
  ] = useState(false)

  const [
    loadedVectors,
    setLoadedVectors,
  ] = useState<Set<string>>(
    new Set(),
  )

  const [
    vectorErrors,
    setVectorErrors,
  ] = useState<Set<string>>(
    new Set(),
  )

  const [
    layers,
    setLayers,
  ] = useState<
    Record<LayerKey, boolean>
  >({
    rgb: true,
    buildings: false,
    ...DEFAULT_CMC_LAYER_VISIBILITY,
    requests: Boolean(
      user &&
        user.role !== 'CITIZEN',
    ),
  })

  const layersRef =
    useRef(layers)

  layersRef.current = layers

  const availableCmcLayers =
    CMC_EXTRA_LAYERS.filter(
      (config) =>
        config.access === 'PUBLIC' ||
        canSeeInternalCmc,
    )

  const layerRows =
    (
      [
        [
          'rgb',
          'CMC RGB imagery',
        ] as [LayerKey, string],
        [
          'buildings',
          'Buildings',
        ] as [LayerKey, string],
        ...(
          user &&
          user.role !== 'CITIZEN'
            ? [
                [
                  'requests',
                  'Government requests',
                ] as [
                  LayerKey,
                  string,
                ],
              ]
            : []
        ),
        ...availableCmcLayers.map(
          (config) =>
            [
              config.key,
              config.label,
            ] as [
              LayerKey,
              string,
            ],
        ),
      ] as Array<
        [LayerKey, string]
      >
    )
      .map((row, index) => ({
        row,
        index,
      }))
      .filter(({ row }) =>
        row[1]
          .toLowerCase()
          .includes(
            layerSearch
              .trim()
              .toLowerCase(),
          ),
      )
      .sort((a, b) => {
        const aOn =
          layers[a.row[0]]
            ? 1
            : 0
        const bOn =
          layers[b.row[0]]
            ? 1
            : 0

        return (
          bOn - aOn ||
          a.index - b.index
        )
      })
      .map(({ row }) => row)

  const statusText =
    `${rgbLoaded ? 'RGB ready' : 'Loading RGB'} · ${loadedVectors.size}/${VECTOR_LAYERS.length} vector source${VECTOR_LAYERS.length === 1 ? '' : 's'} ready`

  function swatch(
    key: LayerKey,
  ) {
    if (key === 'rgb') {
      return '#6f8c4c'
    }

    if (key === 'requests') {
      return '#ef4444'
    }

    const cmcConfig =
      CMC_EXTRA_LAYERS.find(
        (config) =>
          config.key === key,
      )

    return cmcConfig?.swatch ||
      '#3388ff'
  }

  function toggleLayer(
    key: LayerKey,
  ) {
    setLayers((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  return {
    layerPanel,
    setLayerPanel,
    layerSearch,
    setLayerSearch,
    zoom,
    setZoom,
    rgbLoaded,
    setRgbLoaded,
    loadedVectors,
    setLoadedVectors,
    vectorErrors,
    setVectorErrors,
    layers,
    setLayers,
    layersRef,
    availableCmcLayers,
    layerRows,
    statusText,
    swatch,
    toggleLayer,
  }
}

export type MapLayerState =
  ReturnType<typeof useMapLayerState>
