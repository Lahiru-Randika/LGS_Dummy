import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import {
  useEffect,
  useRef,
} from 'react'

/* =========================================================
   SULECO OFFICE

   Publicly listed approximate coordinates.

   Replace these with surveyed/GNSS coordinates later
   if you have a more precise office position.
========================================================= */

const OFFICE_LATITUDE =
  6.8863087

const OFFICE_LONGITUDE =
  79.9097432

const INITIAL_ZOOM =
  16

const MIN_ZOOM =
  15

const MAX_ZOOM =
  18

export function ContactLocationMap() {
  const hostRef =
    useRef<HTMLDivElement | null>(
      null,
    )

  const mapRef =
    useRef<L.Map | null>(
      null,
    )

  useEffect(
    () => {
      if (
        !hostRef.current ||
        mapRef.current
      ) {
        return
      }

      const host =
        hostRef.current

      /* =====================================================
         MAP
      ===================================================== */

      const map =
        L.map(
          host,
          {
            zoomControl:
              true,

            attributionControl:
              true,

            /*
              Important:

              Leaflet's default mouse-wheel zoom is OFF.

              We handle the wheel manually so that when the
              map reaches its min/max zoom, scrolling returns
              naturally to the page.
            */
            scrollWheelZoom:
              false,

            doubleClickZoom:
              true,

            dragging:
              true,

            minZoom:
              MIN_ZOOM,

            maxZoom:
              MAX_ZOOM,

            preferCanvas:
              true,
          },
        )

      mapRef.current =
        map

      map.setView(
        [
          OFFICE_LATITUDE,
          OFFICE_LONGITUDE,
        ],
        INITIAL_ZOOM,
      )

      /* =====================================================
         BASE MAP
      ===================================================== */

      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          minZoom:
            1,

          maxZoom:
            20,

          attribution:
            '&copy; OpenStreetMap contributors',
        },
      ).addTo(
        map,
      )

      /* =====================================================
         OFFICE PIN
      ===================================================== */

      const officeMarker =
        L.circleMarker(
          [
            OFFICE_LATITUDE,
            OFFICE_LONGITUDE,
          ],
          {
            radius:
              11,

            color:
              '#ffffff',

            weight:
              4,

            fillColor:
              '#0f766e',

            fillOpacity:
              1,
          },
        )

      officeMarker
        .bindPopup(
          `
            <div
              style="
                min-width:220px;
                font-family:DM Sans,Inter,Arial,sans-serif;
              "
            >
              <strong
                style="
                  display:block;
                  font-size:13px;
                  color:#0f172a;
                  margin-bottom:5px;
                "
              >
                SULECO (Pvt) Ltd
              </strong>

              <span
                style="
                  display:block;
                  font-size:11px;
                  line-height:1.5;
                  color:#64748b;
                "
              >
                No. 44, Beddagana South Road,<br/>
                Pitakotte, Sri Lanka
              </span>
            </div>
          `,
          {
            closeButton:
              true,

            autoClose:
              false,

            closeOnClick:
              false,
          },
        )
        .addTo(
          map,
        )

      officeMarker.openPopup()

      /* =====================================================
         CUSTOM WHEEL BEHAVIOUR

         Wheel up:
           zoom IN until MAX_ZOOM.
           At MAX_ZOOM → page scroll is allowed.

         Wheel down:
           zoom OUT until MIN_ZOOM.
           At MIN_ZOOM → page scroll is allowed.

         This prevents the user getting "stuck" inside
         the contact map while scrolling the page.
      ===================================================== */

      let wheelLocked =
        false

      const handleWheel =
        (
          event:
            WheelEvent,
        ) => {
          if (
            wheelLocked
          ) {
            return
          }

          const currentZoom =
            map.getZoom()

          /*
            deltaY < 0:
            wheel moves upward → zoom IN
          */
          if (
            event.deltaY <
              0
          ) {
            if (
              currentZoom <
              MAX_ZOOM
            ) {
              event.preventDefault()
              event.stopPropagation()

              wheelLocked =
                true

              map.setZoom(
                Math.min(
                  MAX_ZOOM,
                  currentZoom +
                    1,
                ),
              )

              window.setTimeout(
                () => {
                  wheelLocked =
                    false
                },
                180,
              )
            }

            /*
              Already at MAX_ZOOM:

              Do nothing.

              Because preventDefault() is NOT called,
              the browser scrolls the page upward.
            */

            return
          }

          /*
            deltaY > 0:
            wheel moves downward → zoom OUT
          */
          if (
            event.deltaY >
              0
          ) {
            if (
              currentZoom >
              MIN_ZOOM
            ) {
              event.preventDefault()
              event.stopPropagation()

              wheelLocked =
                true

              map.setZoom(
                Math.max(
                  MIN_ZOOM,
                  currentZoom -
                    1,
                ),
              )

              window.setTimeout(
                () => {
                  wheelLocked =
                    false
                },
                180,
              )
            }

            /*
              Already at MIN_ZOOM:

              Don't prevent the wheel event.

              Page continues scrolling downward.
            */
          }
        }

      host.addEventListener(
        'wheel',
        handleWheel,
        {
          passive:
            false,
        },
      )

      /* =====================================================
         RESIZE
      ===================================================== */

      const observer =
        new ResizeObserver(
          () => {
            if (
              mapRef.current ===
              map
            ) {
              map.invalidateSize(
                {
                  animate:
                    false,
                },
              )
            }
          },
        )

      observer.observe(
        host,
      )

      /* =====================================================
         CLEANUP
      ===================================================== */

      return () => {
        host.removeEventListener(
          'wheel',
          handleWheel,
        )

        observer.disconnect()

        map.remove()

        mapRef.current =
          null
      }
    },
    [],
  )

  return (
    <div
      ref={
        hostRef
      }
      className="h-full min-h-[420px] w-full"
      aria-label="SULECO office location map"
    />
  )
}