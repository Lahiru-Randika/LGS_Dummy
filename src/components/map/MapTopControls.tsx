import {
  Crosshair,
  Layers3,
  Plus,
} from 'lucide-react'
import type {
  RefObject,
} from 'react'

type MapTopControlsProps = {
  layerButtonRef: RefObject<HTMLButtonElement | null>
  layerPanelOpen: boolean
  isCitizen: boolean
  hasPendingRequestLocation: boolean
  onToggleLayers: () => void
  onShowAll: () => void
  onReport: () => void
}

export function MapTopControls({
  layerButtonRef,
  layerPanelOpen,
  isCitizen,
  hasPendingRequestLocation,
  onToggleLayers,
  onShowAll,
  onReport,
}: MapTopControlsProps) {
  return (
    <div className="civic-enter-up absolute bottom-4 right-4 z-[1400] flex flex-col items-stretch gap-2 max-sm:bottom-3 max-sm:right-3">
      <button
        ref={layerButtonRef}
        type="button"
        onClick={onToggleLayers}
        className={`civic-map-control flex h-[40px] min-w-[116px] cursor-pointer items-center justify-start gap-2 rounded-xl border px-3 text-[10px] font-bold shadow-[0_7px_20px_rgba(15,23,42,.12)] backdrop-blur-xl outline-none max-sm:h-[38px] max-sm:min-w-[108px] max-sm:px-2.5 max-sm:text-[9px] ${
          layerPanelOpen
            ? 'border-teal-200 bg-teal-700 text-white'
            : 'border-white/80 bg-white/95 text-slate-600 hover:bg-white hover:text-teal-700'
        }`}
      >
        <Layers3
          size={16}
          strokeWidth={1.9}
          className="shrink-0"
        />
        <span>Layers</span>
      </button>

      <button
        type="button"
        onClick={onShowAll}
        className="civic-map-control flex h-[40px] min-w-[116px] cursor-pointer items-center justify-start gap-2 rounded-xl border border-white/80 bg-white/95 px-3 text-[10px] font-bold text-slate-600 shadow-[0_7px_20px_rgba(15,23,42,.12)] backdrop-blur-xl outline-none hover:bg-white hover:text-teal-700 max-sm:h-[38px] max-sm:min-w-[108px] max-sm:px-2.5 max-sm:text-[9px]"
      >
        <Crosshair
          size={16}
          strokeWidth={1.9}
          className="shrink-0"
        />
        <span>Show all</span>
      </button>

      {isCitizen && (
        <button
          type="button"
          onClick={onReport}
          className="civic-map-control flex h-[40px] min-w-[116px] cursor-pointer items-center justify-start gap-2 rounded-xl border border-slate-900 bg-slate-950 px-3 text-[10px] font-extrabold text-white shadow-[0_8px_22px_rgba(15,23,42,.20)] outline-none hover:bg-slate-800 max-sm:h-[38px] max-sm:min-w-[108px] max-sm:px-2.5 max-sm:text-[9px]"
        >
          <Plus
            size={15}
            className="shrink-0"
          />

          <span>
            {hasPendingRequestLocation
              ? 'Report here'
              : 'Report'}
          </span>
        </button>
      )}
    </div>
  )
}
