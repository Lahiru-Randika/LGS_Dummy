import {
  ExternalLink,
} from 'lucide-react'

import {
  Link,
} from 'react-router-dom'

import {
  CivicMap,
} from './CivicMap'

export function DashboardMiniMap() {
  return (
    <div
      className="
        relative
        h-[390px]
        w-full
        overflow-hidden
        rounded-[18px]
        border
        border-slate-200
        bg-slate-100
      "
    >
      {/* ===================================================
          USE THE REAL CMC MAP

          This automatically includes:

          - CMC RGB drone imagery
          - OSM fallback underneath
          - CMC buildings
          - request layer
          - correct CMC center / zoom
      ==================================================== */}

      <CivicMap
        mode="preview"
      />

      {/* ===================================================
          FULL MAP BUTTON
      ==================================================== */}

      <Link
        to="/app/map"
        className="
          absolute
          right-4
          top-4
          z-[1500]

          flex
          items-center
          gap-1.5

          rounded-xl
          border
          border-white/90

          bg-white/95

          px-3
          py-2

          text-[9px]
          font-extrabold
          text-slate-700

          shadow-md
          backdrop-blur-xl

          transition

          hover:bg-teal-50
          hover:text-teal-700
        "
      >
        Full map

        <ExternalLink
          size={
            12
          }
        />
      </Link>
    </div>
  )
}