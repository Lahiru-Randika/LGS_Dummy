import {
  MapPin,
  Plus,
  X,
} from 'lucide-react'

import type {
  CmcFeatureSelection,
} from '../lib/cmcLayers'

function readablePropertyEntries(
  properties:
    Record<
      string,
      unknown
    >,
) {
  return Object.entries(
    properties,
  ).filter(
    ([, value]) =>
      value !== null &&
      value !== undefined &&
      String(
        value,
      ).trim() !== '',
  )
}

export function CmcFeatureDrawer({
  feature,
  canCreateRequest,
  onClose,
  onCreateRequest,
}: {
  feature:
    CmcFeatureSelection

  canCreateRequest:
    boolean

  onClose:
    () => void

  onCreateRequest:
    (
      feature:
        CmcFeatureSelection,
    ) => void
}) {
  const properties =
    readablePropertyEntries(
      feature.properties,
    )

  return (
    <aside
      className="
        civic-enter-right
        absolute
        right-3
        top-3
        z-[1800]

        h-[min(620px,calc(100vh-130px))]
        w-[min(360px,calc(100%-24px))]

        overflow-hidden

        rounded-[20px]
        border
        border-slate-200/90
        bg-white/98

        shadow-[0_24px_65px_rgba(11,19,35,.24)]
        backdrop-blur-xl

        max-sm:left-3
        max-sm:right-3
        max-sm:h-[calc(100vh-110px)]
        max-sm:w-auto
      "
      aria-label={`${feature.layerLabel} details`}
    >
      <div
        className="
          flex
          h-full
          min-h-0
          flex-col
        "
      >
        {/* =================================================
            FIXED HEADER
        ================================================== */}

        <div
          className="
            shrink-0
            border-b
            border-slate-100
            px-4
            pb-3.5
            pt-4
          "
        >
          <div
            className="
              flex
              items-start
              justify-between
              gap-3
            "
          >
            <div
              className="min-w-0"
            >
              <span
                className="
                  text-[7px]
                  font-extrabold
                  uppercase
                  tracking-[.14em]
                  text-teal-700
                "
              >
                CMC municipal asset
              </span>

              <h2
                className="
                  mt-1.5
                  break-words
                  font-['Manrope']
                  text-[18px]
                  font-extrabold
                  leading-[1.15]
                  tracking-[-.025em]
                  text-slate-950
                "
              >
                {
                  feature.title
                }
              </h2>

              {feature.subtitle && (
                <p
                  className="
                    mt-1.5
                    text-[9px]
                    leading-4
                    text-slate-500
                  "
                >
                  {
                    feature.subtitle
                  }
                </p>
              )}

              <div
                className="
                  mt-2.5
                  flex
                  items-start
                  gap-1.5
                  text-[9px]
                  leading-4
                  text-slate-500
                "
              >
                <MapPin
                  size={
                    12
                  }
                  className="
                    mt-0.5
                    shrink-0
                    text-teal-700
                  "
                />

                <span>
                  {
                    feature.latitude
                  }
                  ,{' '}
                  {
                    feature.longitude
                  }
                </span>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close CMC feature details"
              onClick={
                onClose
              }
              className="
                civic-map-control
                grid
                h-8
                w-8
                shrink-0
                cursor-pointer
                place-items-center

                rounded-xl
                border
                border-slate-200
                bg-white

                text-slate-500

                hover:bg-slate-50
                hover:text-slate-800
              "
            >
              <X
                size={
                  14
                }
              />
            </button>
          </div>
        </div>

        {/* =================================================
            SCROLLABLE CONTENT

            This is the ONLY vertical scroll area.
        ================================================== */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
            px-4
            py-3

            [scrollbar-width:thin]
          "
        >
          {/* =============================================
              SUMMARY CARDS
          ============================================== */}

          <div
            className="
              grid
              grid-cols-2
              gap-2
            "
          >
            <div
              className="
                rounded-xl
                border
                border-slate-100
                bg-slate-50/80
                p-3
              "
            >
              <small
                className="
                  text-[7px]
                  font-extrabold
                  uppercase
                  tracking-[.09em]
                  text-slate-400
                "
              >
                Layer
              </small>

              <strong
                className="
                  mt-1
                  block
                  break-words
                  text-[10px]
                  text-slate-800
                "
              >
                {
                  feature.layerLabel
                }
              </strong>
            </div>

            <div
              className="
                rounded-xl
                border
                border-slate-100
                bg-slate-50/80
                p-3
              "
            >
              <small
                className="
                  text-[7px]
                  font-extrabold
                  uppercase
                  tracking-[.09em]
                  text-slate-400
                "
              >
                CMC ID
              </small>

              <strong
                className="
                  mt-1
                  block
                  break-all
                  text-[10px]
                  text-slate-800
                "
              >
                {
                  feature.featureId ||
                  '—'
                }
              </strong>
            </div>
          </div>

          {/* =============================================
              CMC PROPERTIES

              No nested scrollbar here.
          ============================================== */}

          <div
            className="
              mt-3
              overflow-hidden
              rounded-xl
              border
              border-slate-200/90
            "
          >
            <span
              className="
                block
                bg-slate-50
                px-3.5
                py-2

                text-[7px]
                font-extrabold
                uppercase
                tracking-[.11em]
                text-slate-500
              "
            >
              CMC feature properties
            </span>

            {properties.length ? (
              properties.map(
                (
                  [
                    key,
                    value,
                  ],
                ) => (
                  <div
                    key={
                      key
                    }
                    className="
                      flex
                      justify-between
                      gap-4

                      border-t
                      border-slate-100

                      px-3.5
                      py-2.5

                      text-[9px]
                    "
                  >
                    <span
                      className="
                        min-w-0
                        break-words
                        text-slate-500
                      "
                    >
                      {
                        key
                      }
                    </span>

                    <strong
                      className="
                        max-w-[62%]
                        break-words
                        text-right
                        font-semibold
                        text-slate-800
                      "
                    >
                      {
                        String(
                          value,
                        )
                      }
                    </strong>
                  </div>
                ),
              )
            ) : (
              <p
                className="
                  p-3.5
                  text-[9px]
                  leading-4
                  text-slate-500
                "
              >
                No additional attributes are stored for this feature.
              </p>
            )}
          </div>
        </div>

        {/* =================================================
            FIXED BOTTOM ACTION
        ================================================== */}

        {canCreateRequest && (
          <div
            className="
              shrink-0
              border-t
              border-slate-100
              bg-white/95
              p-3
            "
          >
            <button
              type="button"
              onClick={() =>
                onCreateRequest(
                  feature,
                )
              }
              className="
                civic-map-control
                flex
                min-h-[40px]
                w-full
                cursor-pointer
                items-center
                justify-center
                gap-2

                rounded-xl
                bg-slate-950
                px-3.5

                text-[10px]
                font-extrabold
                text-white

                shadow-[0_8px_18px_rgba(15,23,42,.14)]

                hover:bg-slate-800
              "
            >
              <Plus
                size={
                  15
                }
              />

              Create request here
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}