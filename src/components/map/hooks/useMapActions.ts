import L from 'leaflet'
import { useNavigate } from 'react-router-dom'
import type {
  Dispatch,
  SetStateAction,
} from 'react'

import {
  popupNode,
} from '../helpers'
import {
  fitWholeArea,
} from '../runtime'
import type {
  MapSearchResult,
  RequestMapLocation,
  SelectedFeature,
} from '../types'
import type {
  CmcFeatureSelection,
} from '../../../lib/cmcLayers'
import type {
  PlaceSearchResult,
} from '../../../services/osmGeocoding'
import type {
  CivicMapRefs,
} from './useMapRefs'

export function useMapActions({
  refs,
  pendingRequestLocation,
  setSelectedFeature,
  setSelectedCmcFeature,
  setLayerPanel,
  setLayerSearch,
  setSearch,
  setOsmSearchResults,
  setPendingRequestLocation,
}: {
  refs: CivicMapRefs
  pendingRequestLocation:
    RequestMapLocation | null
  setSelectedFeature:
    Dispatch<
      SetStateAction<
        SelectedFeature | null
      >
    >
  setSelectedCmcFeature:
    Dispatch<
      SetStateAction<
        CmcFeatureSelection | null
      >
    >
  setLayerPanel:
    Dispatch<SetStateAction<boolean>>
  setLayerSearch:
    Dispatch<SetStateAction<string>>
  setSearch:
    Dispatch<SetStateAction<string>>
  setOsmSearchResults:
    Dispatch<
      SetStateAction<
        PlaceSearchResult[]
      >
    >
  setPendingRequestLocation:
    Dispatch<
      SetStateAction<
        RequestMapLocation | null
      >
    >
}) {
  const navigate = useNavigate()

  function closeSelectedFeature() {
    refs.selectionSequenceRef.current +=
      1

    refs.buildingLookupAbortRef.current?.abort()
    refs.buildingLookupAbortRef.current =
      null

    setSelectedFeature(null)
    setSelectedCmcFeature(null)
    refs.mapRef.current?.closePopup()
  }

  function toggleLayerPanel() {
    closeSelectedFeature()
    setLayerPanel(
      (current) => !current,
    )
  }

  function openRequestForm(
    location:
      RequestMapLocation | null =
      pendingRequestLocation,
  ) {
    navigate(
      '/app/requests?new=1',
      {
        state: location
          ? {
              requestLocation:
                location,
            }
          : undefined,
      },
    )
  }

  function reset() {
    refs.selectionSequenceRef.current +=
      1

    refs.buildingLookupAbortRef.current?.abort()
    refs.buildingLookupAbortRef.current =
      null

    setSelectedFeature(null)
    setSelectedCmcFeature(null)
    setLayerPanel(false)
    setLayerSearch('')
    setSearch('')
    setOsmSearchResults([])
    setPendingRequestLocation(null)

    if (
      refs.requestPinRef.current &&
      refs.mapRef.current?.hasLayer(
        refs.requestPinRef.current,
      )
    ) {
      refs.mapRef.current.removeLayer(
        refs.requestPinRef.current,
      )
    }

    refs.requestPinRef.current = null

    if (
      refs.searchMarkerRef.current &&
      refs.mapRef.current?.hasLayer(
        refs.searchMarkerRef.current,
      )
    ) {
      refs.mapRef.current.removeLayer(
        refs.searchMarkerRef.current,
      )
    }

    refs.searchMarkerRef.current =
      null

    refs.mapRef.current?.closePopup()

    window.setTimeout(() => {
      refs.mapRef.current?.invalidateSize({
        animate: false,
      })

      fitWholeArea(
        refs.mapRef,
        refs.vectorRefs,
        true,
      )
    }, 80)
  }

  function focusSearchResult(
    result: MapSearchResult,
  ) {
    const map = refs.mapRef.current

    if (!map) {
      return
    }

    closeSelectedFeature()
    setLayerPanel(false)

    if (
      refs.searchMarkerRef.current &&
      map.hasLayer(
        refs.searchMarkerRef.current,
      )
    ) {
      map.removeLayer(
        refs.searchMarkerRef.current,
      )
    }

    const marker =
      L.circleMarker(
        [
          result.latitude,
          result.longitude,
        ],
        {
          radius: 9,
          color: '#ffffff',
          weight: 4,
          fillColor:
            result.source === 'osm'
              ? '#0f766e'
              : '#3388ff',
          fillOpacity: 1,
        },
      ).addTo(map)

    marker.bindPopup(
      popupNode(
        result.title,
        result.subtitle ||
          (result.source === 'osm'
            ? 'OpenStreetMap place'
            : 'CMC building'),
      ),
      {
        autoClose: true,
        closeOnClick: true,
      },
    )

    marker.openPopup()
    refs.searchMarkerRef.current =
      marker

    map.flyTo(
      [
        result.latitude,
        result.longitude,
      ],
      18.5,
      {
        animate: true,
        duration: 0.85,
      },
    )

    setPendingRequestLocation({
      kind: 'POINT',
      latitude: result.latitude,
      longitude: result.longitude,
      label: result.title,
    })

    setSearch('')
  }

  return {
    closeSelectedFeature,
    toggleLayerPanel,
    openRequestForm,
    reset,
    focusSearchResult,
  }
}
