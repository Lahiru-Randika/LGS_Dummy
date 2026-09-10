import {
  LocateFixed,
} from 'lucide-react'
import type {
  RefObject,
} from 'react'

type MapPreviewProps = {
  hostRef: RefObject<HTMLDivElement | null>
}

export function MapPreview({
  hostRef,
}: MapPreviewProps) {
  return (
    <div className="relative h-full min-h-[300px] w-full overflow-hidden rounded-2xl bg-slate-200">
      <div
        ref={hostRef}
        className="absolute inset-0"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-950/[.02] to-slate-950/10" />

      <div className="absolute bottom-4 left-4 flex max-w-[calc(100%-32px)] flex-col items-start rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-xl">
        <span className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[.08em] text-teal-700">
          <LocateFixed size={14} />
          CMC
        </span>

        <strong className="mt-1.5 text-[13px] text-slate-950">
          Live municipal spatial view
        </strong>

        <small className="mt-1 text-[9px] text-slate-500">
          CMC RGB imagery · mapped
          buildings
        </small>
      </div>
    </div>
  )
}
