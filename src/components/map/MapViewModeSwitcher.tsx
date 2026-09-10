import {
  Image,
  Layers3,
  Map as MapIcon,
} from 'lucide-react'

import type {
  MapViewMode,
} from './types'

type MapViewModeSwitcherProps = {
  value: MapViewMode
  onChange: (value: MapViewMode) => void
}

const OPTIONS: Array<{
  key: MapViewMode
  label: string
  icon: typeof MapIcon
}> = [
  {
    key: 'standard',
    label: 'Standard',
    icon: MapIcon,
  },
  {
    key: 'rgb',
    label: 'RGB',
    icon: Image,
  },
  {
    key: 'detailed',
    label: 'Detailed 2D',
    icon: Layers3,
  },
]

export function MapViewModeSwitcher({
  value,
  onChange,
}: MapViewModeSwitcherProps) {
  return (
    <div
      className="civic-enter-up absolute left-3.5 top-[66px] z-[1250] flex h-[38px] items-center gap-1 rounded-xl border border-white/85 bg-white/95 p-1 shadow-[0_6px_18px_rgba(15,23,42,.10)] backdrop-blur-xl max-sm:left-2.5 max-sm:right-2.5 max-sm:w-[calc(100%-20px)]"
      aria-label="Map view"
    >
      <span className="shrink-0 px-2 text-[7px] font-extrabold uppercase tracking-[.12em] text-slate-400 max-sm:hidden">
        Map view
      </span>

      <div className="flex min-w-0 flex-1 items-center gap-1 max-sm:overflow-x-auto">
        {OPTIONS.map(
          ({
            key,
            label,
            icon: Icon,
          }) => {
            const active =
              value === key

            return (
              <button
                key={key}
                type="button"
                onClick={() =>
                  onChange(key)
                }
                aria-pressed={active}
                className={`civic-map-control flex h-[28px] shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-2.5 text-[8px] font-extrabold transition max-sm:flex-1 max-sm:px-2 ${
                  active
                    ? key === 'detailed'
                      ? 'border-teal-700 bg-teal-700 text-white shadow-sm'
                      : 'border-slate-900 bg-slate-950 text-white shadow-sm'
                    : 'border-transparent bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <Icon
                  size={13}
                  strokeWidth={1.9}
                  className="shrink-0"
                />

                <span>{label}</span>
              </button>
            )
          },
        )}
      </div>
    </div>
  )
}
