import { useState } from 'react'

import {
  useAuth,
} from '../../../context/AuthContext'
import type {
  LocalSearchFeature,
} from '../types'
import {
  useBuildingLayer,
} from './useBuildingLayer'
import {
  useCmcLazyLayers,
} from './useCmcLazyLayers'
import {
  useDetailed2DMode,
} from './useDetailed2DMode'
import {
  useGovernmentMapRequests,
} from './useGovernmentMapRequests'
import {
  useLayerPanelDismiss,
} from './useLayerPanelDismiss'
import {
  useLayerVisibility,
} from './useLayerVisibility'
import {
  useLeafletCore,
} from './useLeafletCore'
import {
  useMapActions,
} from './useMapActions'
import {
  useMapLayerState,
} from './useMapLayerState'
import {
  useMapRefs,
} from './useMapRefs'
import {
  useMapSearch,
} from './useMapSearch'
import {
  useMapSelectionState,
} from './useMapSelectionState'
import {
  useRequestMarkers,
} from './useRequestMarkers'

export function useCivicMapController(
  mode: 'full' | 'preview',
) {
  const {
    user,
    can,
  } = useAuth()

  const canSeeInternalCmc =
    can('map.internal')

  const canCacheBuildingResolution =
    can('building.sensitive.read')

  const refs = useMapRefs(mode)

  const selection =
    useMapSelectionState()

  const layerState =
    useMapLayerState({
      user,
      canSeeInternalCmc,
    })

  const [
    localSearchFeatures,
    setLocalSearchFeatures,
  ] = useState<
    LocalSearchFeature[]
  >([])

  const searchState =
    useMapSearch(
      localSearchFeatures,
    )

  const {
    visibleRequests,
  } =
    useGovernmentMapRequests(
      user,
    )

  const mapReady =
    useLeafletCore({
      mode,
      refs,
      layersRef:
        layerState.layersRef,
      setRgbLoaded:
        layerState.setRgbLoaded,
      setZoom:
        layerState.setZoom,
      setSelectedFeature:
        selection.setSelectedFeature,
      setSelectedCmcFeature:
        selection.setSelectedCmcFeature,
      setLayerPanel:
        layerState.setLayerPanel,
      setSearch:
        searchState.setSearch,
      setPendingRequestLocation:
        selection.setPendingRequestLocation,
    })

  const mapViewState =
    useDetailed2DMode({
      mapReady,
      refs,
      layers:
        layerState.layers,
      setLayers:
        layerState.setLayers,
      canSeeInternalCmc,
    })

  useBuildingLayer({
    mapReady,
    refs,
    layersRef:
      layerState.layersRef,
    canCacheBuildingResolution,
    mapViewMode:
      mapViewState.mapViewMode,
    setSelectedFeature:
      selection.setSelectedFeature,
    setSelectedCmcFeature:
      selection.setSelectedCmcFeature,
    setPendingRequestLocation:
      selection.setPendingRequestLocation,
    setLayerPanel:
      layerState.setLayerPanel,
    setSearch:
      searchState.setSearch,
    setLoadedVectors:
      layerState.setLoadedVectors,
    setVectorErrors:
      layerState.setVectorErrors,
    setLocalSearchFeatures,
  })

  useCmcLazyLayers({
    mapReady,
    refs,
    layers:
      layerState.layers,
    layersRef:
      layerState.layersRef,
    canSeeInternalCmc,
    mapViewMode:
      mapViewState.mapViewMode,
    setSelectedFeature:
      selection.setSelectedFeature,
    setSelectedCmcFeature:
      selection.setSelectedCmcFeature,
    setLayerPanel:
      layerState.setLayerPanel,
    setSearch:
      searchState.setSearch,
    setPendingRequestLocation:
      selection.setPendingRequestLocation,
  })

  useLayerVisibility({
    mapReady,
    refs,
    layers:
      layerState.layers,
    canSeeInternalCmc,
    mapViewMode:
      mapViewState.mapViewMode,
    zoom:
      layerState.zoom,
  })

  useRequestMarkers({
    mapReady,
    refs,
    visibleRequests,
  })

  const actions =
    useMapActions({
      refs,
      pendingRequestLocation:
        selection.pendingRequestLocation,
      setSelectedFeature:
        selection.setSelectedFeature,
      setSelectedCmcFeature:
        selection.setSelectedCmcFeature,
      setLayerPanel:
        layerState.setLayerPanel,
      setLayerSearch:
        layerState.setLayerSearch,
      setSearch:
        searchState.setSearch,
      setOsmSearchResults:
        searchState.setOsmSearchResults,
      setPendingRequestLocation:
        selection.setPendingRequestLocation,
    })

  useLayerPanelDismiss({
    open:
      layerState.layerPanel,
    refs,
    onClose: () =>
      layerState.setLayerPanel(
        false,
      ),
  })

  return {
    user,
    refs,
    selection,
    layerState,
    mapViewState,
    searchState,
    actions,
  }
}
