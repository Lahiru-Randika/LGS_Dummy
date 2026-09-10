import { useState } from 'react'

import type {
  CmcFeatureSelection,
} from '../../../lib/cmcLayers'
import type {
  RequestMapLocation,
  SelectedFeature,
} from '../types'

export function useMapSelectionState() {
  const [
    selectedFeature,
    setSelectedFeature,
  ] = useState<
    SelectedFeature | null
  >(null)

  const [
    selectedCmcFeature,
    setSelectedCmcFeature,
  ] = useState<
    CmcFeatureSelection | null
  >(null)

  const [
    pendingRequestLocation,
    setPendingRequestLocation,
  ] = useState<
    RequestMapLocation | null
  >(null)

  return {
    selectedFeature,
    setSelectedFeature,
    selectedCmcFeature,
    setSelectedCmcFeature,
    pendingRequestLocation,
    setPendingRequestLocation,
  }
}

export type MapSelectionState =
  ReturnType<typeof useMapSelectionState>
