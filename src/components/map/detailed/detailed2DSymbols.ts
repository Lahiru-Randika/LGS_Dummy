import L from 'leaflet'

import type {
  CmcLayerKey,
} from '../../../lib/cmcLayers'
import {
  DETAILED_2D_PANES,
} from './detailed2DPanes'

type SymbolSpec = {
  color: string
  svg: string
  size?: number
  transparent?: boolean
}

const TREE = `
  <path d="M12 3.2c-2.1 0-3.8 1.7-3.8 3.8 0 .35.05.68.14 1A4.1 4.1 0 0 0 6 11.7c0 2.15 1.72 3.9 3.86 3.95V21h4.28v-5.35A3.96 3.96 0 0 0 18 11.7 4.1 4.1 0 0 0 15.66 8c.09-.32.14-.65.14-1 0-2.1-1.7-3.8-3.8-3.8Z" fill="currentColor"/>
`

const POLE = `
  <path d="M11 3h2v18h-2zM6 7h12v2H6zM8 4.5h8v1.8H8z" fill="currentColor"/>
`

const LIGHT_POLE = `
  <path d="M10.7 4h2v17h-2zM12 5c3.7 0 5.5 1 6.6 3.1l-1.7.9c-.7-1.3-1.8-2-4.9-2V5Z" fill="currentColor"/><circle cx="18.2" cy="9" r="2.1" fill="currentColor"/>
`

const TRAFFIC_LIGHT = `
  <rect x="7" y="3" width="10" height="18" rx="2.4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="7.3" r="1.7" fill="currentColor"/><circle cx="12" cy="12" r="1.7" fill="currentColor"/><circle cx="12" cy="16.7" r="1.7" fill="currentColor"/>
`

const SIGN = `
  <path d="M12 3 20 16H4L12 3Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M11 16h2v5h-2z" fill="currentColor"/>
`

const SIGNPOST = `
  <path d="M11 4h2v17h-2z" fill="currentColor"/><path d="M4 5h13l3 3-3 3H4V5Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
`

const BUS = `
  <rect x="4" y="5" width="16" height="13" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 8h10v5H7z" fill="currentColor" opacity=".28"/><circle cx="8" cy="18.5" r="1.7" fill="currentColor"/><circle cx="16" cy="18.5" r="1.7" fill="currentColor"/>
`

const MANHOLE = `
  <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6.5 9h11M6 12h12M6.5 15h11" stroke="currentColor" stroke-width="1.5"/>
`

const DRAIN = `
  <rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 8v8M10.5 8v8M14 8v8M17 8v8" stroke="currentColor" stroke-width="1.3"/>
`

const HYDRANT = `
  <path d="M9 6h6v4h2.5v3H15v7H9v-7H6.5v-3H9V6Zm1.5-3h3v3h-3V3Z" fill="currentColor"/>
`

const BOX = `
  <rect x="6" y="4" width="12" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="14.5" cy="12" r="1" fill="currentColor"/><path d="M9 7h6" stroke="currentColor" stroke-width="1.5"/>
`

const SEWER = `
  <path d="M5 8h14v5a7 7 0 0 1-14 0V8Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 4v4M12 3v5M16 4v4" stroke="currentColor" stroke-width="1.5"/>
`

const VALVE = `
  <circle cx="12" cy="12" r="5.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 4v16M4 12h16M7 7l10 10M17 7 7 17" stroke="currentColor" stroke-width="1.2"/>
`

const FENCE = `
  <path d="M5 4v16M19 4v16M8 6l8 12M16 6 8 18M5 9h14M5 15h14" stroke="currentColor" stroke-width="1.7" fill="none"/>
`

const BRIDGE = `
  <path d="M4 17h16M5 16V8h14v8M7 16c0-4 2-6 5-6s5 2 5 6" fill="none" stroke="currentColor" stroke-width="2"/>
`

const BENCH = `
  <path d="M5 10h14v5H5zM7 7h10v3H7zM7 15v4M17 15v4" fill="none" stroke="currentColor" stroke-width="2"/>
`

const STRUCTURE = `
  <path d="M6 20h12M8 20V9h8v11M6 9h12L12 3 6 9Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
`

const SHIELD_HUT = `
  <path d="M5 11 12 5l7 6v9H5v-9Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 20v-6h6v6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7.5 15 9v2.7c0 2-1.25 3.75-3 4.5-1.75-.75-3-2.5-3-4.5V9l3-1.5Z" fill="currentColor" opacity=".28"/>
`

const BILLBOARD = `
  <rect x="4" y="5" width="16" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 15v5M15 15v5M7 20h10" stroke="currentColor" stroke-width="2"/>
`

const METER = `
  <circle cx="12" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="m12 11 3-3M8 19h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
`

const WATER = `
  <path d="M12 3c3.2 4 5.4 6.8 5.4 10a5.4 5.4 0 1 1-10.8 0C6.6 9.8 8.8 7 12 3Z" fill="none" stroke="currentColor" stroke-width="2"/>
`

const PIT = `
  <rect x="5" y="5" width="14" height="14" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 9h14M5 13h14M9 5v14M13 5v14" stroke="currentColor" stroke-width="1.2"/>
`

const symbolSpecs:
  Partial<
    Record<CmcLayerKey, SymbolSpec>
  > = {
    trees: {
      color: '#14833b',
      svg: TREE,
      size: 19,
      transparent: true,
    },
    extractedTrees: {
      color: '#2f9a57',
      svg: TREE,
      size: 17,
      transparent: true,
    },
    poles: {
      color: '#4b5563',
      svg: POLE,
    },
    lightPoles: {
      color: '#a36b00',
      svg: LIGHT_POLE,
    },
    telephoneElectricPosts: {
      color: '#66513f',
      svg: POLE,
    },
    signalLightPosts: {
      color: '#30343b',
      svg: TRAFFIC_LIGHT,
    },
    trafficSigns: {
      color: '#b7332c',
      svg: SIGN,
    },
    signBoards: {
      color: '#2d5c9b',
      svg: SIGNPOST,
    },
    roadNameBoards: {
      color: '#146b63',
      svg: SIGNPOST,
    },
    busStops: {
      color: '#5d4aa8',
      svg: BUS,
    },
    manholes: {
      color: '#4b5563',
      svg: MANHOLE,
    },
    stormwaterDrains: {
      color: '#147d96',
      svg: DRAIN,
    },
    fireHydrants: {
      color: '#c73532',
      svg: HYDRANT,
    },
    utilityBoxes: {
      color: '#7f43a8',
      svg: BOX,
    },
    sewage: {
      color: '#16766e',
      svg: SEWER,
    },
    waterValves: {
      color: '#116ba2',
      svg: VALVE,
    },
    fenceSurveyPoints: {
      color: '#76563e',
      svg: FENCE,
    },
    bridges: {
      color: '#58616c',
      svg: BRIDGE,
    },
    benches: {
      color: '#70513b',
      svg: BENCH,
    },
    structures: {
      color: '#7b5b72',
      svg: STRUCTURE,
    },
    policeSecurityHuts: {
      color: '#304f73',
      svg: SHIELD_HUT,
    },
    billboards: {
      color: '#7650a4',
      svg: BILLBOARD,
    },
    waterMeters: {
      color: '#176e9d',
      svg: METER,
    },
    waterOutlets: {
      color: '#1485b5',
      svg: WATER,
    },
    pits: {
      color: '#5d6470',
      svg: PIT,
    },
  }

function iconHtml(
  spec: SymbolSpec,
) {
  const size = spec.size ?? 18

  const shell = spec.transparent
    ? `width:${size}px;height:${size}px;display:grid;place-items:center;color:${spec.color};filter:drop-shadow(0 1px 1px rgba(255,255,255,.95)) drop-shadow(0 1px 2px rgba(15,23,42,.28));`
    : `width:${size + 4}px;height:${size + 4}px;display:grid;place-items:center;border-radius:5px;background:rgba(255,255,255,.94);border:1px solid ${spec.color}55;color:${spec.color};box-shadow:0 1px 4px rgba(15,23,42,.22);`

  return `
    <div style="${shell}">
      <svg
        viewBox="0 0 24 24"
        width="${size}"
        height="${size}"
        aria-hidden="true"
        style="display:block"
      >
        ${spec.svg}
      </svg>
    </div>
  `
}

export function createDetailed2DPointLayer(
  key: CmcLayerKey,
  latlng: L.LatLng,
) {
  const spec =
    symbolSpecs[key] || {
      color: '#475569',
      svg: '<circle cx="12" cy="12" r="6" fill="currentColor"/>',
    }

  const size = spec.size ?? 18
  const boxSize =
    spec.transparent
      ? size
      : size + 4

  const icon = L.divIcon({
    className:
      'cmc-detailed-symbol',
    html: iconHtml(spec),
    iconSize: [boxSize, boxSize],
    iconAnchor: [
      boxSize / 2,
      boxSize / 2,
    ],
  })

  return L.marker(latlng, {
    icon,
    pane:
      DETAILED_2D_PANES.symbols,
    keyboard: false,
    riseOnHover: true,
    bubblingMouseEvents: false,
  })
}
