import L from 'leaflet'
import { useEffect } from 'react'

import type {
  ServiceRequest,
} from '../../../types'
import {
  requestColors,
} from '../config'
import type {
  CivicMapRefs,
} from './useMapRefs'

/* =========================================================
   HELPERS
========================================================= */

function formatLabel(
  value: string,
) {
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    )
}

/* =========================================================
   REQUEST POPUP
========================================================= */

function createRequestPopup(
  request: ServiceRequest,
  color: string,
) {
  const container =
    document.createElement('div')

  container.className =
    'civic-request-popup'

  /* -------------------------------------------------------
     TOP ROW
  ------------------------------------------------------- */

  const top =
    document.createElement('div')

  top.className =
    'civic-request-popup__top'

  const type =
    document.createElement('span')

  type.className =
    'civic-request-popup__type'

  type.textContent =
    formatLabel(
      request.type,
    )

  const status =
    document.createElement('span')

  status.className =
    'civic-request-popup__status'

  const statusDot =
    document.createElement('span')

  statusDot.className =
    'civic-request-popup__status-dot'

  statusDot.style.backgroundColor =
    color

  const statusText =
    document.createElement('span')

  statusText.textContent =
    formatLabel(
      request.status,
    )

  status.append(
    statusDot,
    statusText,
  )

  top.append(
    type,
    status,
  )

  /* -------------------------------------------------------
     REQUEST ID
  ------------------------------------------------------- */

  const requestId =
    document.createElement('div')

  requestId.className =
    'civic-request-popup__id'

  requestId.textContent =
    request.id

  /* -------------------------------------------------------
     TITLE
  ------------------------------------------------------- */

  const title =
    document.createElement('div')

  title.className =
    'civic-request-popup__title'

  title.textContent =
    request.title ||
    'Municipal request'

  /* -------------------------------------------------------
     LOCATION
  ------------------------------------------------------- */

  const location =
    document.createElement('div')

  location.className =
    'civic-request-popup__location'

  const locationIcon =
    document.createElement('span')

  locationIcon.className =
    'civic-request-popup__location-icon'

  locationIcon.innerHTML = `
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path
        d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"
      />
      <circle
        cx="12"
        cy="10"
        r="3"
      />
    </svg>
  `

  const locationText =
    document.createElement('span')

  locationText.className =
    'civic-request-popup__location-text'

  locationText.textContent =
    request.locationLabel ||
    'Pinned map location'

  location.append(
    locationIcon,
    locationText,
  )

  /* -------------------------------------------------------
     FOOTER
  ------------------------------------------------------- */

  const footer =
    document.createElement('div')

  footer.className =
    'civic-request-popup__footer'

  const helper =
    document.createElement('span')

  helper.className =
    'civic-request-popup__helper'

  helper.textContent =
    'Municipal request'

  /* -------------------------------------------------------
     VIEW REQUEST BUTTON
  ------------------------------------------------------- */

  const viewButton =
    document.createElement('button')

  viewButton.type = 'button'

  viewButton.className =
    'civic-request-popup__button'

  const buttonText =
    document.createElement('span')

  buttonText.textContent =
    'View request'

  const buttonIcon =
    document.createElement('span')

  buttonIcon.className =
    'civic-request-popup__button-icon'

  buttonIcon.innerHTML = `
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  `

  viewButton.append(
    buttonText,
    buttonIcon,
  )

  viewButton.addEventListener(
    'click',
    (event) => {
      event.preventDefault()
      event.stopPropagation()

      /*
       * Example:
       *
       * LGS-2026-000003
       *
       * becomes:
       *
       * /app/requests/LGS-2026-000003
       */
      window.location.assign(
        `/app/requests/${encodeURIComponent(
          request.id,
        )}`,
      )
    },
  )

  footer.append(
    helper,
    viewButton,
  )

  /* -------------------------------------------------------
     BUILD POPUP
  ------------------------------------------------------- */

  container.append(
    top,
    requestId,
    title,
    location,
    footer,
  )

  return container
}

/* =========================================================
   REQUEST MARKERS
========================================================= */

export function useRequestMarkers({
  mapReady,
  refs,
  visibleRequests,
}: {
  mapReady: boolean
  refs: CivicMapRefs
  visibleRequests: ServiceRequest[]
}) {
  useEffect(() => {
    const group =
      refs.requestLayerRef.current

    if (
      !mapReady ||
      !group
    ) {
      return
    }

    /*
     * Remove old request markers before
     * drawing the current visible requests.
     */
    group.clearLayers()

    visibleRequests.forEach(
      (request) => {
        /*
         * Ignore requests that do not have
         * a valid map position.
         */
        if (
          typeof request.latitude !==
            'number' ||
          typeof request.longitude !==
            'number'
        ) {
          return
        }

        const color =
          requestColors[
            request.type
          ] ?? '#0f766e'

        /* -------------------------------------------------
           MARKER
        ------------------------------------------------- */

        const marker =
          L.circleMarker(
            [
              request.latitude,
              request.longitude,
            ],
            {
              radius: 7,

              color: '#ffffff',

              weight: 3,

              fillColor: color,

              fillOpacity: 1,

              opacity: 1,

              bubblingMouseEvents:
                false,
            },
          )

        /* -------------------------------------------------
           POPUP
        ------------------------------------------------- */

        marker.bindPopup(
          createRequestPopup(
            request,
            color,
          ),
          {
            /*
             * Only a small vertical offset.
             *
             * Leaflet itself controls the geographic
             * position of the popup.
             */
            offset: L.point(
              0,
              -7,
            ),

            autoClose: true,

            closeOnClick: true,

            closeButton: true,

            className:
              'civic-request-leaflet-popup',

            minWidth: 275,

            maxWidth: 300,

            autoPan: true,

            autoPanPadding:
              L.point(
                30,
                30,
              ),
          },
        )

        marker.addTo(group)
      },
    )

    /*
     * Remove markers when the map/request
     * layer is rebuilt.
     */
    return () => {
      group.clearLayers()
    }
  }, [
    mapReady,
    refs,
    visibleRequests,
  ])
}