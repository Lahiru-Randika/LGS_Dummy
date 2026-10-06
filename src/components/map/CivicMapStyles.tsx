export function CivicMapStyles() {
  return (
    <style>{`
      /* =====================================================
         ANIMATIONS
      ===================================================== */

      @keyframes civicDropIn {
        from {
          opacity: 0;
          transform:
            translateY(-12px)
            scale(.985);
        }

        to {
          opacity: 1;
          transform:
            translateY(0)
            scale(1);
        }
      }

      @keyframes civicFadeUp {
        from {
          opacity: 0;
          transform:
            translateY(12px);
        }

        to {
          opacity: 1;
          transform:
            translateY(0);
        }
      }

      @keyframes civicSlideInRight {
        from {
          opacity: 0;
          transform:
            translateX(24px)
            scale(.985);
        }

        to {
          opacity: 1;
          transform:
            translateX(0)
            scale(1);
        }
      }

      @keyframes civicScaleIn {
        from {
          opacity: 0;
          transform:
            scale(.96);
        }

        to {
          opacity: 1;
          transform:
            scale(1);
        }
      }

      @keyframes civicSoftPulse {
        0%,
        100% {
          box-shadow:
            0 0 0 0
            rgba(13,148,136,.15);
        }

        50% {
          box-shadow:
            0 0 0 8px
            rgba(13,148,136,0);
        }
      }

      /* =====================================================
         GENERAL MAP ANIMATIONS
      ===================================================== */

      .civic-enter-top {
        animation:
          civicDropIn
          .28s
          cubic-bezier(.2,.8,.2,1)
          both;
      }

      .civic-enter-up {
        animation:
          civicFadeUp
          .28s
          cubic-bezier(.2,.8,.2,1)
          both;
      }

      .civic-enter-right {
        animation:
          civicSlideInRight
          .32s
          cubic-bezier(.2,.8,.2,1)
          both;
      }

      .civic-enter-scale {
        animation:
          civicScaleIn
          .22s
          cubic-bezier(.2,.8,.2,1)
          both;
      }

      .civic-live-dot {
        animation:
          civicSoftPulse
          2.2s
          ease-in-out
          infinite;
      }

      /* =====================================================
         MAP CONTROLS
      ===================================================== */

      .civic-map-control {
        transition:
          transform .2s ease,
          box-shadow .2s ease,
          background-color .2s ease,
          color .2s ease,
          border-color .2s ease;
      }

      .civic-map-control:hover {
        transform:
          translateY(-2px);
      }

      .civic-map-control:active {
        transform:
          translateY(0)
          scale(.97);
      }

      /* =====================================================
         SEARCH RESULTS
      ===================================================== */

      .civic-search-result {
        transition:
          background-color .16s ease,
          transform .16s ease;
      }

      .civic-search-result:hover {
        transform:
          translateX(3px);
      }

      /* =====================================================
         DEFAULT LEAFLET POPUPS
      ===================================================== */

      .civic-map-shell
      .leaflet-popup-content-wrapper {
        border:
          1px solid
          rgba(226,232,240,.95);

        border-radius:
          16px;

        overflow:
          hidden;

        box-shadow:
          0 18px 50px
          rgba(15,23,42,.18);
      }

      .civic-map-shell
      .leaflet-popup-content {
        margin:
          16px 18px;
      }

      .civic-map-shell
      .leaflet-popup-tip {
        box-shadow:
          3px 3px 12px
          rgba(15,23,42,.08);
      }

      /*
       * IMPORTANT:
       *
       * Do NOT put transform animations on:
       *
       * .leaflet-popup
       *
       * Leaflet uses the popup element's transform/
       * positioning internally to place it over the
       * geographic coordinate.
       */

      /* =====================================================
         REQUEST POPUP
      ===================================================== */

      .civic-map-shell
      .civic-request-leaflet-popup
      .leaflet-popup-content-wrapper {
        padding: 0;

        overflow: hidden;

        border:
          1px solid
          rgba(226,232,240,.95);

        border-radius:
          16px;

        background:
          rgba(255,255,255,.985);

        box-shadow:
          0 18px 45px
            rgba(15,23,42,.16),
          0 3px 10px
            rgba(15,23,42,.05);
      }

      .civic-map-shell
      .civic-request-leaflet-popup
      .leaflet-popup-content {
        width:
          auto !important;

        margin:
          0 !important;
      }

      .civic-map-shell
      .civic-request-leaflet-popup
      .leaflet-popup-tip {
        background:
          #ffffff;

        box-shadow:
          3px 3px 8px
          rgba(15,23,42,.08);
      }

      /* =====================================================
         POPUP CLOSE BUTTON
      ===================================================== */

      .civic-map-shell
      .civic-request-leaflet-popup
      .leaflet-popup-close-button {
        top:
          9px !important;

        right:
          9px !important;

        display:
          grid !important;

        place-items:
          center;

        width:
          25px !important;

        height:
          25px !important;

        padding:
          0 !important;

        border:
          0 !important;

        border-radius:
          8px;

        outline:
          0 !important;

        background:
          transparent;

        color:
          #94a3b8 !important;

        font-size:
          19px !important;

        font-weight:
          400 !important;

        line-height:
          1 !important;

        transition:
          background-color .15s ease,
          color .15s ease;
      }

      .civic-map-shell
      .civic-request-leaflet-popup
      .leaflet-popup-close-button:hover {
        background:
          #f1f5f9;

        color:
          #334155 !important;
      }

      /* =====================================================
         REQUEST POPUP CONTENT
      ===================================================== */

      .civic-request-popup {
        box-sizing:
          border-box;

        width:
          275px;

        padding:
          15px 16px 14px;

        font-family:
          inherit;

        color:
          #0f172a;
      }

      /* -----------------------------------------------------
         TOP ROW
      ----------------------------------------------------- */

      .civic-request-popup__top {
        display:
          flex;

        align-items:
          center;

        flex-wrap:
          wrap;

        gap:
          7px;

        min-height:
          22px;

        padding-right:
          28px;
      }

      /* -----------------------------------------------------
         REQUEST TYPE
      ----------------------------------------------------- */

      .civic-request-popup__type {
        display:
          inline-flex;

        align-items:
          center;

        min-height:
          20px;

        padding:
          0 7px;

        border-radius:
          6px;

        background:
          #ecfdf5;

        color:
          #0f766e;

        font-size:
          8px;

        font-weight:
          800;

        line-height:
          1;

        letter-spacing:
          .075em;

        text-transform:
          uppercase;
      }

      /* -----------------------------------------------------
         STATUS
      ----------------------------------------------------- */

      .civic-request-popup__status {
        display:
          inline-flex;

        align-items:
          center;

        gap:
          5px;

        min-height:
          20px;

        padding:
          0 7px;

        border-radius:
          999px;

        background:
          #f1f5f9;

        color:
          #64748b;

        font-size:
          8px;

        font-weight:
          700;

        line-height:
          1;
      }

      .civic-request-popup__status-dot {
        display:
          block;

        width:
          6px;

        height:
          6px;

        flex:
          0 0 auto;

        border-radius:
          50%;
      }

      /* -----------------------------------------------------
         REQUEST ID
      ----------------------------------------------------- */

      .civic-request-popup__id {
        margin-top:
          10px;

        color:
          #94a3b8;

        font-size:
          9px;

        font-weight:
          700;

        line-height:
          1.3;

        letter-spacing:
          .025em;
      }

      /* -----------------------------------------------------
         TITLE
      ----------------------------------------------------- */

      .civic-request-popup__title {
        margin-top:
          4px;

        color:
          #0f172a;

        font-size:
          14px;

        font-weight:
          800;

        line-height:
          1.35;
      }

      /* -----------------------------------------------------
         LOCATION
      ----------------------------------------------------- */

      .civic-request-popup__location {
        display:
          flex;

        align-items:
          flex-start;

        gap:
          6px;

        margin-top:
          8px;

        color:
          #64748b;

        font-size:
          9px;

        font-weight:
          500;

        line-height:
          1.45;
      }

      .civic-request-popup__location-icon {
        display:
          inline-flex;

        align-items:
          center;

        justify-content:
          center;

        flex:
          0 0 auto;

        margin-top:
          1px;

        color:
          #0f766e;
      }

      .civic-request-popup__location-text {
        min-width:
          0;

        overflow-wrap:
          anywhere;
      }

      /* =====================================================
         FOOTER
      ===================================================== */

      .civic-request-popup__footer {
        display:
          flex;

        align-items:
          center;

        justify-content:
          space-between;

        gap:
          12px;

        margin-top:
          13px;

        padding-top:
          11px;

        border-top:
          1px solid
          #f1f5f9;
      }

      .civic-request-popup__helper {
        min-width:
          0;

        color:
          #94a3b8;

        font-size:
          8px;

        font-weight:
          600;

        line-height:
          1.3;
      }

      /* =====================================================
         VIEW REQUEST BUTTON
      ===================================================== */

      .civic-request-popup__button {
        display:
          inline-flex;

        align-items:
          center;

        justify-content:
          center;

        gap:
          6px;

        flex:
          0 0 auto;

        min-height:
          31px;

        padding:
          0 11px;

        border:
          0 !important;

        border-radius:
          8px;

        outline:
          0 !important;

        background:
          #0f766e;

        color:
          #ffffff;

        cursor:
          pointer;

        font-family:
          inherit;

        font-size:
          8px;

        font-weight:
          800;

        line-height:
          1;

        box-shadow:
          0 4px 10px
          rgba(15,118,110,.16);

        transition:
          background-color .15s ease,
          transform .15s ease,
          box-shadow .15s ease;
      }

      .civic-request-popup__button:hover {
        background:
          #115e59;

        transform:
          translateY(-1px);

        box-shadow:
          0 6px 14px
          rgba(15,118,110,.20);
      }

      .civic-request-popup__button:active {
        transform:
          translateY(0);
      }

      .civic-request-popup__button:focus,
      .civic-request-popup__button:focus-visible {
        border:
          0 !important;

        outline:
          0 !important;
      }

      .civic-request-popup__button-icon {
        display:
          inline-flex;

        align-items:
          center;

        justify-content:
          center;

        transition:
          transform .15s ease;
      }

      .civic-request-popup__button:hover
      .civic-request-popup__button-icon {
        transform:
          translateX(2px);
      }

      /* =====================================================
         REDUCED MOTION
      ===================================================== */

      @media (
        prefers-reduced-motion:
        reduce
      ) {
        .civic-enter-top,
        .civic-enter-up,
        .civic-enter-right,
        .civic-enter-scale,
        .civic-live-dot {
          animation:
            none !important;
        }

        .civic-map-control,
        .civic-search-result,
        .civic-request-popup__button,
        .civic-request-popup__button-icon {
          transition:
            none !important;
        }
      }
    `}</style>
  )
}