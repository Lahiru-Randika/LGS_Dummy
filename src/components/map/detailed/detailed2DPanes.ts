import L from 'leaflet'

export const DETAILED_2D_PANES = {
  land: 'cmc-detailed-land',
  roadSurface: 'cmc-detailed-road-surface',
  roadArea: 'cmc-detailed-road-area',
  buildings: 'cmc-detailed-buildings',
  roadLines: 'cmc-detailed-road-lines',
  roadMarkings: 'cmc-detailed-road-markings',
  linearAssets: 'cmc-detailed-linear-assets',
  symbols: 'cmc-detailed-symbols',
} as const

const PANE_Z_INDEX: Array<
  [string, number]
> = [
  [DETAILED_2D_PANES.land, 310],
  [DETAILED_2D_PANES.roadSurface, 320],
  [DETAILED_2D_PANES.roadArea, 330],
  [DETAILED_2D_PANES.buildings, 340],
  [DETAILED_2D_PANES.roadLines, 360],
  [DETAILED_2D_PANES.roadMarkings, 380],
  [DETAILED_2D_PANES.linearAssets, 400],
  [DETAILED_2D_PANES.symbols, 450],
]

export function ensureDetailed2DPanes(
  map: L.Map,
) {
  PANE_Z_INDEX.forEach(
    ([name, zIndex]) => {
      const pane =
        map.getPane(name) ||
        map.createPane(name)

      pane.style.zIndex =
        String(zIndex)

      if (
        name ===
        DETAILED_2D_PANES.symbols
      ) {
        pane.style.pointerEvents =
          'auto'
      }
    },
  )
}
