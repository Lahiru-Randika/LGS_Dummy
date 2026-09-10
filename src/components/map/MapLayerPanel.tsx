import {
  Search,
  X,
} from 'lucide-react'
import type {
  RefObject,
} from 'react'

type MapLayerPanelProps<K extends string> = {
  panelRef: RefObject<HTMLDivElement | null>
  rows: Array<[K, string]>
  layers: Record<K, boolean>
  layerSearch: string
  statusText: string
  zoom: number
  failedCount: number
  getSwatch: (key: K) => string
  onSearchChange: (value: string) => void
  onToggle: (key: K) => void
  onClose: () => void
}

export function MapLayerPanel<K extends string>({
  panelRef,
  rows,
  layers,
  layerSearch,
  statusText,
  zoom,
  failedCount,
  getSwatch,
  onSearchChange,
  onToggle,
  onClose,
}: MapLayerPanelProps<K>) {
  return (
    <div
      ref={panelRef}
      className="civic-enter-up absolute left-3.5 top-[156px] z-[1800] flex max-h-[365px] w-[min(285px,calc(100%-28px))] flex-col overflow-hidden rounded-[16px] border border-slate-200/90 bg-white/98 shadow-[0_18px_50px_rgba(11,19,35,.18)] backdrop-blur-xl max-sm:left-2.5 max-sm:top-[152px] max-sm:max-h-[365px] max-sm:w-[calc(100%-20px)]"
    >
      {/* Header */}
      <div className="flex shrink-0 items-start justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <span className="text-[8px] font-extrabold uppercase tracking-[.15em] text-teal-700">
            CMC GIS
          </span>

          <h3 className="mt-0.5 font-['Manrope'] text-[13px] font-extrabold text-slate-950">
            Map layers
          </h3>

          <p className="mt-0.5 text-[8px] text-slate-400">
            Choose what appears on the map.
          </p>
        </div>

        <button
          type="button"
          aria-label="Close layer panel"
          className="civic-map-control grid h-8 w-8 cursor-pointer place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          onClick={onClose}
        >
          <X size={14} />
        </button>
      </div>

      {/* Search */}
      <div className="shrink-0 border-b border-slate-100 px-3 py-2">
        <div className="flex h-8 items-center rounded-xl border border-slate-200 bg-slate-50/80 px-2.5 transition focus-within:border-teal-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-100">
          <Search
            size={13}
            className="mr-2 shrink-0 text-slate-400"
          />

          <input
            value={layerSearch}
            onChange={(event) =>
              onSearchChange(
                event.target.value,
              )
            }
            placeholder="Search layers..."
            aria-label="Search map layers"
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[10px] font-medium text-slate-700 shadow-none outline-none placeholder:font-normal placeholder:text-slate-400 focus:border-0 focus:outline-none focus:ring-0"
          />

          {layerSearch && (
            <button
              type="button"
              aria-label="Clear layer search"
              onClick={() =>
                onSearchChange('')
              }
              className="civic-map-control ml-1 grid h-6 w-6 shrink-0 place-items-center rounded-lg border-0 bg-transparent text-slate-400 shadow-none outline-none hover:bg-slate-200/70 hover:text-slate-700"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div className="mt-1 flex items-center justify-between px-0.5 text-[7px] font-semibold text-slate-400">
          <span>
            Enabled layers stay on top
          </span>

          <span>
            {rows.length} shown
          </span>
        </div>
      </div>

      {/* Only this area scrolls */}
      <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
        {rows.length ? (
          rows.map(
            ([key, label]) => (
              <label
                key={key}
                className={`group flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-[9px] font-semibold transition ${
                  layers[key]
                    ? 'bg-teal-50/80 text-slate-800'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <i
                    className="h-2.5 w-2.5 shrink-0 rounded-sm border border-black/10 shadow-sm"
                    style={{
                      background:
                        getSwatch(key),
                    }}
                  />

                  <span className="truncate">
                    {label}
                  </span>

                  {layers[key] && (
                    <small className="shrink-0 rounded-full bg-teal-100 px-1.5 py-0.5 text-[6px] font-extrabold uppercase tracking-[.08em] text-teal-700">
                      On
                    </small>
                  )}
                </span>

                <span
                  className={`relative h-5 w-9 shrink-0 rounded-full transition ${
                    layers[key]
                      ? 'bg-teal-600'
                      : 'bg-slate-200'
                  }`}
                >
                  <input
                    className="absolute inset-0 z-10 cursor-pointer opacity-0"
                    type="checkbox"
                    checked={layers[key]}
                    onChange={() =>
                      onToggle(key)
                    }
                  />

                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                      layers[key]
                        ? 'translate-x-[18px]'
                        : 'translate-x-0.5'
                    }`}
                  />
                </span>
              </label>
            ),
          )
        ) : (
          <div className="px-3 py-6 text-center">
            <p className="text-[9px] font-semibold text-slate-600">
              No matching layers
            </p>

            <p className="mt-1 text-[7px] leading-4 text-slate-400">
              Try another layer name.
            </p>
          </div>
        )}
      </div>

      {/* Fixed footer */}
      <div className="flex shrink-0 items-center gap-2 border-t border-slate-100 bg-slate-50/80 px-3 py-1.5 text-[7px] font-semibold text-slate-500">
        <span
          className={`civic-live-dot h-2 w-2 shrink-0 rounded-full ${
            failedCount
              ? 'bg-amber-500'
              : 'bg-emerald-500'
          }`}
        />

        <span className="min-w-0 truncate">
          {statusText} · zoom{' '}
          {zoom.toFixed(1)}
          {failedCount
            ? ` · ${failedCount} failed`
            : ''}
        </span>
      </div>
    </div>
  )
}
