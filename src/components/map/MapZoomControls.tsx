import {
  ZoomIn,
  ZoomOut,
} from 'lucide-react'

type MapZoomControlsProps = {
  onZoomIn: () => void
  onZoomOut: () => void
}

export function MapZoomControls({
  onZoomIn,
  onZoomOut,
}: MapZoomControlsProps) {
  return (
    <div className="civic-enter-scale absolute right-3.5 top-3.5 z-[1200] overflow-hidden rounded-xl border border-white/80 bg-white/95 shadow-[0_8px_22px_rgba(15,23,42,.11)] backdrop-blur-xl max-sm:right-2.5 max-sm:top-2.5">
      <button
        type="button"
        className="civic-map-control grid h-9 w-9 cursor-pointer place-items-center border-0 border-b border-slate-100 bg-transparent text-slate-600 hover:bg-slate-50 hover:text-teal-700 max-sm:h-8 max-sm:w-8"
        onClick={onZoomIn}
        aria-label="Zoom in"
      >
        <ZoomIn size={15} />
      </button>

      <button
        type="button"
        className="civic-map-control grid h-9 w-9 cursor-pointer place-items-center border-0 bg-transparent text-slate-600 hover:bg-slate-50 hover:text-teal-700 max-sm:h-8 max-sm:w-8"
        onClick={onZoomOut}
        aria-label="Zoom out"
      >
        <ZoomOut size={15} />
      </button>
    </div>
  )
}
