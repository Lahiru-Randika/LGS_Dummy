import type {
  MapViewMode,
} from './types'

type MapLegendProps = {
  mapViewMode: MapViewMode
  showBuildings: boolean
  showLandParcels: boolean
  showRequests: boolean
}

export function MapLegend({
  mapViewMode,
  showBuildings,
  showLandParcels,
  showRequests,
}: MapLegendProps) {
  return (
    <div className="civic-enter-up absolute bottom-3 left-3 z-[1100] flex flex-wrap items-center gap-2.5 rounded-xl border border-white/75 bg-white/95 px-2.5 py-2 text-[7px] font-semibold text-slate-500 shadow-[0_6px_18px_rgba(15,23,42,.09)] backdrop-blur-xl max-sm:hidden">
      <span className="flex items-center gap-1.5">
        <i
          className="h-2.5 w-2.5 rounded-sm border border-black/10"
          style={{
            background:
              mapViewMode === 'rgb'
                ? '#6f8c4c'
                : mapViewMode === 'detailed'
                  ? '#f1e6ca'
                  : '#dbe8ef',
          }}
        />

        {mapViewMode === 'rgb'
          ? 'RGB'
          : mapViewMode === 'detailed'
            ? 'Detailed 2D'
            : 'Standard'}
      </span>

      {showBuildings && (
        <span className="flex items-center gap-1.5">
          <i
            className={`h-2.5 w-2.5 rounded-sm border ${
              mapViewMode === 'detailed'
                ? 'border-slate-500 bg-amber-100'
                : 'border-2 border-blue-500 bg-blue-100'
            }`}
          />
          Buildings
        </span>
      )}

      {showLandParcels && (
        <span className="flex items-center gap-1.5">
          <i
            className="h-2.5 w-2.5 rounded-sm"
            style={{
              border:
                mapViewMode === 'detailed'
                  ? '1px solid #8a8175'
                  : '1px solid #1f2937',
              background:
                mapViewMode === 'detailed'
                  ? 'rgba(244, 237, 218, .5)'
                  : 'rgba(251, 191, 36, .28)',
            }}
          />
          Land parcels
        </span>
      )}

      {showRequests && (
        <span className="flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-red-500" />
          Requests
        </span>
      )}
    </div>
  )
}
