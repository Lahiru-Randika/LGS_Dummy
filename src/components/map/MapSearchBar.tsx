import {
  LoaderCircle,
  MapPin,
  Search,
  X,
} from 'lucide-react'
import type {
  RefObject,
} from 'react'

type BaseSearchResult = {
  id: string
  title: string
  subtitle: string
  latitude: number
  longitude: number
  source: 'osm' | 'cmc'
}

type MapSearchBarProps<T extends BaseSearchResult> = {
  wrapRef: RefObject<HTMLDivElement | null>
  search: string
  loading: boolean
  results: T[]
  onFocus: () => void
  onSearchChange: (value: string) => void
  onClear: () => void
  onSelect: (result: T) => void
}

export function MapSearchBar<T extends BaseSearchResult>({
  wrapRef,
  search,
  loading,
  results,
  onFocus,
  onSearchChange,
  onClear,
  onSelect,
}: MapSearchBarProps<T>) {
  return (
    <div
      ref={wrapRef}
      className="civic-enter-top absolute left-4 top-4 z-[1600] flex h-[44px] w-[min(520px,calc(100%-96px))] items-center rounded-[14px] border border-white/80 bg-white/95 px-3.5 shadow-[0_8px_24px_rgba(15,23,42,.11)] backdrop-blur-xl max-lg:w-[min(480px,calc(100%-92px))] max-sm:left-3 max-sm:top-3 max-sm:h-[42px] max-sm:w-[calc(100%-62px)] max-sm:px-3"
    >
      <Search
        size={17}
        strokeWidth={1.9}
        className="mr-2.5 shrink-0 text-slate-500 max-sm:mr-2"
      />

      <input
        value={search}
        onFocus={onFocus}
        onChange={(event) =>
          onSearchChange(
            event.target.value,
          )
        }
        placeholder="Search a place, building, address or CMC ID..."
        className="!m-0 !h-auto min-w-0 flex-1 !border-0 !border-none !bg-transparent !p-0 text-[12px] font-medium leading-none text-slate-800 !shadow-none !outline-none !ring-0 placeholder:font-normal placeholder:text-slate-400 focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-none max-sm:text-[10px]"
        style={{
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
          background:
            'transparent',
          WebkitAppearance:
            'none',
          appearance:
            'none',
        }}
      />

      {loading && (
        <LoaderCircle
          size={18}
          className="ml-3 shrink-0 animate-spin text-teal-700"
        />
      )}

      {search && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="civic-map-control ml-1.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border-0 bg-slate-100/70 text-slate-400 shadow-none outline-none hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={13} />
        </button>
      )}

      {search && (
        <div className="civic-enter-top absolute left-0 right-0 top-[calc(100%+6px)] z-[1650] max-h-[290px] overflow-y-auto rounded-[14px] border border-slate-200/90 bg-white/98 py-1 shadow-[0_18px_45px_rgba(11,19,35,.16)] backdrop-blur-xl">
          {results.length ? (
            results.map(
              (result) => (
                <button
                  type="button"
                  key={`${result.source}-${result.id}`}
                  onClick={() =>
                    onSelect(
                      result,
                    )
                  }
                  className="civic-search-result group flex w-full cursor-pointer items-center justify-between gap-2.5 border-0 border-b border-slate-100 bg-white px-3 py-2.5 text-left shadow-none outline-none last:border-b-0 hover:bg-teal-50/60"
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition ${
                        result.source ===
                        'osm'
                          ? 'bg-teal-50 text-teal-700 group-hover:bg-teal-100'
                          : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                      }`}
                    >
                      <MapPin
                        size={14}
                      />
                    </span>

                    <span className="min-w-0">
                      <strong className="block truncate text-[10px] font-bold text-slate-900">
                        {
                          result.title
                        }
                      </strong>

                      <small className="mt-0.5 block truncate text-[8px] leading-3.5 text-slate-500">
                        {result.subtitle ||
                          (result.source ===
                          'osm'
                            ? 'OpenStreetMap place'
                            : 'CMC building')}
                      </small>
                    </span>
                  </span>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[7px] font-extrabold uppercase tracking-[.08em] ${
                      result.source ===
                      'osm'
                        ? 'bg-teal-50 text-teal-700'
                        : 'bg-blue-50 text-blue-600'
                    }`}
                  >
                    {result.source ===
                    'osm'
                      ? 'Place'
                      : 'CMC'}
                  </span>
                </button>
              ),
            )
          ) : loading ? (
            <div className="flex items-center gap-3 px-4 py-4 text-[11px] text-slate-500">
              <LoaderCircle
                size={17}
                className="animate-spin text-teal-700"
              />
              Searching places and
              addresses...
            </div>
          ) : (
            <div className="px-4 py-4">
              <p className="text-[11px] font-semibold text-slate-700">
                No matching result
                found.
              </p>

              <p className="mt-1 text-[9px] leading-4 text-slate-400">
                Try a landmark,
                street, address or CMC
                building ID.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
