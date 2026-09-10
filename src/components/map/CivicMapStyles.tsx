export function CivicMapStyles() {
  return (
    <style>{`
      @keyframes civicDropIn {
        from { opacity: 0; transform: translateY(-12px) scale(.985); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes civicFadeUp {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes civicSlideInRight {
        from { opacity: 0; transform: translateX(24px) scale(.985); }
        to { opacity: 1; transform: translateX(0) scale(1); }
      }
      @keyframes civicScaleIn {
        from { opacity: 0; transform: scale(.96); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes civicSoftPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(13,148,136,.15); }
        50% { box-shadow: 0 0 0 8px rgba(13,148,136,0); }
      }

      .civic-enter-top { animation: civicDropIn .28s cubic-bezier(.2,.8,.2,1) both; }
      .civic-enter-up { animation: civicFadeUp .28s cubic-bezier(.2,.8,.2,1) both; }
      .civic-enter-right { animation: civicSlideInRight .32s cubic-bezier(.2,.8,.2,1) both; }
      .civic-enter-scale { animation: civicScaleIn .22s cubic-bezier(.2,.8,.2,1) both; }
      .civic-map-control { transition: transform .2s ease, box-shadow .2s ease, background-color .2s ease, color .2s ease, border-color .2s ease; }
      .civic-map-control:hover { transform: translateY(-2px); }
      .civic-map-control:active { transform: translateY(0) scale(.97); }
      .civic-search-result { transition: background-color .16s ease, transform .16s ease; }
      .civic-search-result:hover { transform: translateX(3px); }
      .civic-live-dot { animation: civicSoftPulse 2.2s ease-in-out infinite; }

      .civic-map-shell .leaflet-popup-content-wrapper {
        border-radius: 16px;
        box-shadow: 0 18px 50px rgba(15, 23, 42, .18);
        border: 1px solid rgba(226, 232, 240, .95);
        overflow: hidden;
      }
      .civic-map-shell .leaflet-popup-content { margin: 16px 18px; }
      .civic-map-shell .leaflet-popup-tip { box-shadow: 3px 3px 12px rgba(15,23,42,.08); }
      .civic-map-shell .leaflet-popup { animation: civicScaleIn .18s ease-out both; }

      @media (prefers-reduced-motion: reduce) {
        .civic-enter-top,
        .civic-enter-up,
        .civic-enter-right,
        .civic-enter-scale,
        .civic-live-dot,
        .civic-map-shell .leaflet-popup {
          animation: none !important;
        }

        .civic-map-control,
        .civic-search-result {
          transition: none !important;
        }
      }
    `}</style>
  )
}
