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
      className="
        civic-enter-up
        group
        absolute
        bottom-4
        left-4
        z-[1250]

        w-[46px]
        overflow-hidden

        rounded-[15px]
        border
        border-white/85
        bg-white/95

        p-1.5

        shadow-[0_8px_24px_rgba(15,23,42,.12)]
        backdrop-blur-xl

        transition-[width]
        duration-300
        ease-out

        hover:w-[142px]

        max-sm:bottom-3
        max-sm:left-3
      "
      aria-label="Map view"
    >
      {/* Small heading */}
      <div
        className="
          flex
          h-[20px]
          items-center

          overflow-hidden

          px-2

          text-[7px]
          font-extrabold
          uppercase
          tracking-[.13em]
          text-slate-400
        "
      >
        <span
          className="
            max-w-0
            whitespace-nowrap
            opacity-0

            transition-all
            duration-300
            ease-out

            group-hover:max-w-[100px]
            group-hover:opacity-100
          "
        >
          Map view
        </span>
      </div>

      <div className="flex flex-col gap-1">
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
                title={label}
                onClick={() =>
                  onChange(key)
                }
                aria-pressed={active}
                className={`
                  civic-map-control

                  flex
                  h-[34px]
                  w-full

                  cursor-pointer

                  items-center
                  justify-start

                  overflow-hidden

                  rounded-[10px]
                  border

                  px-[9px]

                  text-left
                  text-[8px]
                  font-extrabold

                  transition-colors
                  duration-200

                  ${
                    active
                      ? key ===
                        'detailed'
                        ? 'border-teal-700 bg-teal-700 text-white shadow-sm'
                        : 'border-slate-900 bg-slate-950 text-white shadow-sm'
                      : 'border-transparent bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  }
                `}
              >
                <Icon
                  size={14}
                  strokeWidth={1.9}
                  className="
                    shrink-0
                  "
                />

                <span
                  className="
                    ml-0
                    max-w-0

                    translate-x-[-4px]

                    overflow-hidden
                    whitespace-nowrap

                    opacity-0

                    transition-all
                    duration-300
                    ease-out

                    group-hover:ml-2
                    group-hover:max-w-[90px]
                    group-hover:translate-x-0
                    group-hover:opacity-100
                  "
                >
                  {label}
                </span>
              </button>
            )
          },
        )}
      </div>
    </div>
  )
}