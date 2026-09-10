import {
  CheckCircle2,
  LoaderCircle,
  MapPin,
  Plus,
  X,
} from 'lucide-react'
import type {
  RefObject,
} from 'react'

type BuildingFeature = {
  featureId?: string
  latitude: number
  longitude: number
  properties: Record<string, unknown>
  nativeName?: string
  resolvedName?: string
  resolvedAddress?: string
  resolvedType?: string
  isResolving: boolean
  polygonMatched: boolean
}

type RequestLocation = {
  kind: 'POINT'
  latitude: number
  longitude: number
  label?: string
}

type BuildingFeatureDrawerProps = {
  drawerRef: RefObject<HTMLElement | null>
  feature: BuildingFeature
  canCreateRequest: boolean
  onClose: () => void
  onCreateRequest: (
    location: RequestLocation,
  ) => void
}

function readablePropertyEntries(
  properties: Record<string, unknown>,
) {
  return Object.entries(properties)
    .filter(
      ([, value]) =>
        value !== null &&
        value !== undefined &&
        String(value).trim() !== '',
    )
    .slice(0, 14)
}

export function BuildingFeatureDrawer({
  drawerRef,
  feature,
  canCreateRequest,
  onClose,
  onCreateRequest,
}: BuildingFeatureDrawerProps) {
  const propertyEntries =
    readablePropertyEntries(
      feature.properties,
    )

  return (
    <aside
      ref={drawerRef}
      className="
        civic-enter-right
        absolute
        right-3
        top-3
        z-[1800]

        flex
        h-[calc(100dvh-118px)]
        max-h-[calc(100%-24px)]
        w-[min(360px,calc(100%-24px))]
        flex-col

        overflow-hidden

        rounded-[20px]
        border
        border-slate-200/90
        bg-white/98

        shadow-[0_24px_65px_rgba(11,19,35,.24)]
        backdrop-blur-xl

        max-sm:left-3
        max-sm:right-3
        max-sm:top-3
        max-sm:h-[calc(100dvh-90px)]
        max-sm:max-h-[calc(100%-24px)]
        max-sm:w-auto
      "
      aria-label="Building details"
    >
      <div className="flex h-full min-h-0 flex-col">
        {/* =================================================
            FIXED HEADER
        ================================================== */}
        <div className="shrink-0 border-b border-slate-100 px-5 pb-3.5 pt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <span className="text-[8px] font-extrabold uppercase tracking-[.15em] text-teal-700">
                CMC GIS feature
              </span>

              {feature.isResolving ? (
                <div className="mt-3 flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-teal-50">
                    <LoaderCircle
                      size={19}
                      className="animate-spin text-teal-700"
                    />
                  </div>

                  <div>
                    <h2 className="font-['Manrope'] text-[17px] font-extrabold tracking-[-.025em] text-slate-950">
                      Matching this building…
                    </h2>

                    <p className="mt-0.5 text-[9px] leading-4 text-slate-400">
                      Checking named OSM features inside the polygon.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="mt-1.5 break-words font-['Manrope'] text-[21px] font-extrabold leading-[1.15] tracking-[-.03em] text-slate-950">
                    {feature.resolvedName ||
                      feature.nativeName ||
                      (feature.featureId
                        ? `Building ${feature.featureId}`
                        : 'Mapped building')}
                  </h2>

                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {feature.resolvedType && (
                      <span className="inline-flex rounded-full bg-teal-50 px-2.5 py-1 text-[7px] font-extrabold uppercase tracking-[.08em] text-teal-700">
                        {feature.resolvedType}
                      </span>
                    )}

                    {feature.polygonMatched ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[7px] font-extrabold uppercase tracking-[.06em] text-emerald-700">
                        <CheckCircle2 size={11} />
                        Polygon verified
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[7px] font-extrabold uppercase tracking-[.06em] text-amber-700">
                        Name not verified
                      </span>
                    )}
                  </div>
                </>
              )}

              {feature.resolvedAddress && (
                <div className="mt-3 flex max-w-sm items-start gap-2 text-[10px] leading-4 text-slate-500">
                  <MapPin
                    size={13}
                    className="mt-0.5 shrink-0 text-teal-700"
                  />
                  <span>
                    {feature.resolvedAddress}
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              aria-label="Close building details"
              className="civic-map-control grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              onClick={onClose}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* =================================================
            SCROLLABLE CONTENT

            ONLY THIS MIDDLE SECTION SCROLLS.
        ================================================== */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-3 [scrollbar-width:thin]">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5">
              <small className="text-[7px] font-extrabold uppercase tracking-[.1em] text-slate-400">
                CMC Building ID
              </small>
              <strong className="mt-1 block break-all text-[11px] text-slate-800">
                {feature.featureId || '—'}
              </strong>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5">
              <small className="text-[7px] font-extrabold uppercase tracking-[.1em] text-slate-400">
                Name match
              </small>

              <strong
                className={`mt-1 block text-[11px] ${
                  feature.polygonMatched
                    ? 'text-emerald-700'
                    : 'text-amber-700'
                }`}
              >
                {feature.polygonMatched
                  ? 'Polygon verified'
                  : 'Not verified'}
              </strong>
            </div>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5">
              <small className="text-[7px] font-extrabold uppercase tracking-[.1em] text-slate-400">
                Latitude
              </small>
              <strong className="mt-1 block text-[11px] text-slate-800">
                {feature.latitude}
              </strong>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5">
              <small className="text-[7px] font-extrabold uppercase tracking-[.1em] text-slate-400">
                Longitude
              </small>
              <strong className="mt-1 block text-[11px] text-slate-800">
                {feature.longitude}
              </strong>
            </div>
          </div>

          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200/90">
            <span className="block bg-slate-50 px-4 py-2 text-[8px] font-extrabold uppercase tracking-[.12em] text-slate-500">
              CMC feature properties
            </span>

            {propertyEntries.length ? (
              propertyEntries.map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between gap-4 border-t border-slate-100 px-4 py-2 text-[9px]"
                  >
                    <span className="min-w-0 break-words text-slate-500">
                      {key}
                    </span>
                    <strong className="max-w-[62%] break-words text-right font-semibold text-slate-800">
                      {String(value)}
                    </strong>
                  </div>
                ),
              )
            ) : (
              <p className="p-4 text-[10px] leading-5 text-slate-500">
                No additional attributes are stored in the CMC building GeoJSON.
              </p>
            )}
          </div>
        </div>

        {/* =================================================
            FIXED BOTTOM ACTION

            ALWAYS VISIBLE FOR CITIZENS.
        ================================================== */}
        {canCreateRequest && (
          <div className="shrink-0 border-t border-slate-100 bg-white p-3">
            <button
              type="button"
              className="civic-map-control flex min-h-[40px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-950 px-3.5 text-[10px] font-extrabold text-white shadow-[0_8px_18px_rgba(15,23,42,.14)] hover:bg-slate-800"
              onClick={() =>
                onCreateRequest({
                  kind: 'POINT',
                  latitude:
                    feature.latitude,
                  longitude:
                    feature.longitude,
                  label:
                    feature.resolvedName ||
                    feature.nativeName ||
                    feature.resolvedAddress ||
                    (feature.featureId
                      ? `Building ${feature.featureId}`
                      : 'Selected building'),
                })
              }
            >
              <Plus size={16} />
              Create request here
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
