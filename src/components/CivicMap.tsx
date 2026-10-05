import 'leaflet/dist/leaflet.css'

import {
  CmcFeatureDrawer,
} from './CmcFeatureDrawer'
import {
  BuildingFeatureDrawer,
  CivicMapStyles,
  MapLayerPanel,
  MapLegend,
  MapPreview,
  MapSearchBar,
  MapTopControls,
  MapViewModeSwitcher,
  MapZoomControls,
} from './map'
import {
  useCivicMapController,
} from './map/hooks'

export function CivicMap({
  mode = 'full',
}: {
  mode?: 'full' | 'preview'
}) {
  const {
    user,
    refs,
    selection,
    layerState,
    mapViewState,
    searchState,
    actions,
  } = useCivicMapController(
    mode,
  )

  if (mode === 'preview') {
    return (
      <MapPreview
        hostRef={refs.hostRef}
      />
    )
  }

  return (
    <div className="civic-map-shell relative h-full min-h-0 w-full min-w-0 overflow-hidden bg-[#dbe7ef]">
      <CivicMapStyles />

      <div
        ref={refs.hostRef}
        className="absolute inset-0 z-0"
        aria-label="Interactive CMC Visigeo map"
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] h-36 bg-gradient-to-b from-slate-950/10 via-slate-950/[.025] to-transparent" />

      <MapSearchBar
        wrapRef={
          refs.searchWrapRef
        }
        search={
          searchState.search
        }
        loading={
          searchState.searchLoading
        }
        results={
          searchState.searchResults
        }
        onFocus={() => {
          actions.closeSelectedFeature()
          layerState.setLayerPanel(
            false,
          )
        }}
        onSearchChange={
          searchState.setSearch
        }
        onClear={() => {
          searchState.setSearch('')
          searchState.setOsmSearchResults(
            [],
          )
        }}
        onSelect={
          actions.focusSearchResult
        }
      />

      <MapViewModeSwitcher
        value={
          mapViewState.mapViewMode
        }
        onChange={(nextMode) => {
          actions.closeSelectedFeature()
          layerState.setLayerPanel(
            false,
          )
          layerState.setLayerSearch(
            '',
          )
          mapViewState.setMapViewMode(
            nextMode,
          )
        }}
      />

      <MapTopControls
        layerButtonRef={
          refs.layerButtonRef
        }
        layerPanelOpen={
          layerState.layerPanel
        }
        isCitizen={
          user?.role ===
          'CITIZEN'
        }
        hasPendingRequestLocation={
          Boolean(
            selection.pendingRequestLocation,
          )
        }
        onToggleLayers={
          actions.toggleLayerPanel
        }
        onShowAll={
          actions.reset
        }
        onReport={() =>
          actions.openRequestForm()
        }
      />

      <MapZoomControls
        onZoomIn={() =>
          refs.mapRef.current?.zoomIn()
        }
        onZoomOut={() =>
          refs.mapRef.current?.zoomOut()
        }
      />

      {layerState.layerPanel && (
        <MapLayerPanel
          panelRef={
            refs.layerPanelRef
          }
          rows={
            layerState.layerRows
          }
          layers={
            layerState.layers
          }
          layerSearch={
            layerState.layerSearch
          }
          statusText={
            layerState.statusText
          }
          zoom={
            layerState.zoom
          }
          failedCount={
            layerState.vectorErrors.size
          }
          getSwatch={
            layerState.swatch
          }
          onSearchChange={
            layerState.setLayerSearch
          }
          onToggle={
            layerState.toggleLayer
          }
          onClose={() => {
            layerState.setLayerPanel(
              false,
            )
            layerState.setLayerSearch(
              '',
            )
          }}
        />
      )}

      <MapLegend
        mapViewMode={
          mapViewState.mapViewMode
        }
        showBuildings={
          layerState.layers.buildings
        }
        showLandParcels={
          layerState.layers.landParcels
        }
        showRequests={
          Boolean(
            user &&
              user.role !==
                'CITIZEN',
          )
        }
      />

      {selection.selectedCmcFeature && (
        <CmcFeatureDrawer
          feature={
            selection.selectedCmcFeature
          }
          canCreateRequest={
            user?.role ===
            'CITIZEN'
          }
          onClose={() => {
            selection.setSelectedCmcFeature(
              null,
            )
            refs.mapRef.current?.closePopup()
          }}
          onCreateRequest={(
            feature,
          ) =>
            actions.openRequestForm({
              kind: 'POINT',
              latitude:
                feature.latitude,
              longitude:
                feature.longitude,
              label:
                feature.title,
            })
          }
        />
      )}

      {selection.selectedFeature && (
        <BuildingFeatureDrawer
          drawerRef={
            refs.featureDrawerRef
          }
          feature={
            selection.selectedFeature
          }
          canCreateRequest={
            user?.role ===
            'CITIZEN'
          }
          onClose={
            actions.closeSelectedFeature
          }
          onCreateRequest={
            actions.openRequestForm
          }
        />
      )}
    </div>
  )
}
