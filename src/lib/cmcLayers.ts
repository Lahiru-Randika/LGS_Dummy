import L from 'leaflet'

export type CmcLayerKey =
  | 'landParcels'
  | 'roadSurface'
  | 'roadFeatures'
  | 'roadBoundary'
  | 'roadSideLines'
  | 'roadMarkings'
  | 'laneLines'
  | 'stopLines'
  | 'crosswalks'
  | 'forbidLines'
  | 'planarFacilities'
  | 'trafficSigns'
  | 'signalLightPosts'
  | 'busStops'
  | 'busStopAreas'
  | 'roadNameBoards'
  | 'signBoards'
  | 'billboards'
  | 'bridges'
  | 'benches'
  | 'structures'
  | 'trees'
  | 'extractedTrees'
  | 'fences'
  | 'poles'
  | 'lightPoles'
  | 'telephoneElectricPosts'
  | 'fenceSurveyPoints'
  | 'manholes'
  | 'stormwaterDrains'
  | 'fireHydrants'
  | 'utilityBoxes'
  | 'sewage'
  | 'pits'
  | 'waterMeters'
  | 'waterOutlets'
  | 'waterValves'
  | 'policeSecurityHuts'

export type CmcLayerConfig = {
  key: CmcLayerKey
  label: string
  singularLabel: string
  access: 'PUBLIC' | 'INTERNAL'
  swatch: string
  style: L.PathOptions
  pointStyle?: L.CircleMarkerOptions
}

export type CmcFeatureSelection = {
  layerKey: CmcLayerKey
  layerLabel: string
  singularLabel: string
  access: 'PUBLIC' | 'INTERNAL'
  featureId?: string
  title: string
  subtitle?: string
  latitude: number
  longitude: number
  properties: Record<string, unknown>
}

export type CmcLayerRenderOptions = {
  style?: (
    feature: any,
    config: CmcLayerConfig,
  ) => L.PathOptions | undefined

  pointToLayer?: (
    feature: any,
    latlng: L.LatLng,
    config: CmcLayerConfig,
  ) => L.Layer | undefined
}

/*
  Extra CMC master-folder layers.

  IMPORTANT:
  Every extra layer starts OFF in CivicMap.
  This keeps the existing initial map appearance unchanged.
*/
export const CMC_EXTRA_LAYERS: CmcLayerConfig[] = [
  {
    key: 'landParcels',
    label: 'Land parcels',
    singularLabel: 'Land parcel',
    access: 'PUBLIC',
    swatch: '#1f2937',
    style: {
      color: '#1f2937',
      weight: 1.8,
      opacity: 1,
      fillColor: '#fbbf24',
      fillOpacity: 0.45,
    },
  },
  {
    key: 'roadSurface',
    label: 'Road surface',
    singularLabel: 'Road surface',
    access: 'PUBLIC',
    swatch: '#64748b',
    style: {
      color: '#64748b',
      weight: 1.5,
      opacity: 0.9,
      fillColor: '#94a3b8',
      fillOpacity: 0.14,
    },
  },
  {
    key: 'roadFeatures',
    label: 'Road features',
    singularLabel: 'Road feature',
    access: 'PUBLIC',
    swatch: '#0ea5e9',
    style: {
      color: '#0284c7',
      weight: 1.5,
      opacity: 0.95,
      fillColor: '#38bdf8',
      fillOpacity: 0.16,
    },
  },
  {
    key: 'roadSideLines',
    label: 'Road side lines',
    singularLabel: 'Road side line',
    access: 'PUBLIC',
    swatch: '#06b6d4',
    style: {
      color: '#0891b2',
      weight: 2,
      opacity: 0.9,
    },
  },
  {
    key: 'forbidLines',
    label: 'Forbidden lines',
    singularLabel: 'Forbidden line',
    access: 'PUBLIC',
    swatch: '#ef4444',
    style: {
      color: '#dc2626',
      weight: 2,
      opacity: 0.9,
      dashArray: '6 4',
    },
  },
  {
    key: 'fences',
    label: 'Fences',
    singularLabel: 'Fence',
    access: 'PUBLIC',
    swatch: '#92400e',
    style: {
      color: '#92400e',
      weight: 2,
      opacity: 0.85,
      dashArray: '4 3',
    },
  },
  {
    key: 'planarFacilities',
    label: 'Planar facilities',
    singularLabel: 'Planar facility',
    access: 'PUBLIC',
    swatch: '#8b5cf6',
    style: {
      color: '#7c3aed',
      weight: 1.5,
      opacity: 0.9,
      fillColor: '#a78bfa',
      fillOpacity: 0.14,
    },
  },
  {
    key: 'trafficSigns',
    label: 'Traffic signs',
    singularLabel: 'Traffic sign',
    access: 'PUBLIC',
    swatch: '#2563eb',
    style: {
      color: '#1d4ed8',
      weight: 1.5,
      fillColor: '#3b82f6',
      fillOpacity: 0.95,
    },
    pointStyle: {
      radius: 4.5,
    },
  },
  {
    key: 'signalLightPosts',
    label: 'Signal light posts',
    singularLabel: 'Signal light post',
    access: 'PUBLIC',
    swatch: '#ef4444',
    style: {
      color: '#b91c1c',
      weight: 1.5,
      fillColor: '#ef4444',
      fillOpacity: 0.95,
    },
    pointStyle: {
      radius: 4.5,
    },
  },
  {
    key: 'roadBoundary',
    label: 'Road boundaries',
    singularLabel: 'Road boundary',
    access: 'PUBLIC',
    swatch: '#475569',
    style: {
      color: '#475569',
      weight: 2,
      opacity: 0.85,
    },
  },
  {
    key: 'roadMarkings',
    label: 'Road markings',
    singularLabel: 'Road marking',
    access: 'PUBLIC',
    swatch: '#f59e0b',
    style: {
      color: '#f59e0b',
      weight: 1.5,
      opacity: 0.9,
      fillColor: '#fbbf24',
      fillOpacity: 0.22,
    },
  },
  {
    key: 'laneLines',
    label: 'Lane lines',
    singularLabel: 'Lane line',
    access: 'PUBLIC',
    swatch: '#eab308',
    style: {
      color: '#eab308',
      weight: 2,
      opacity: 0.9,
    },
  },
  {
    key: 'stopLines',
    label: 'Stop lines',
    singularLabel: 'Stop line',
    access: 'PUBLIC',
    swatch: '#dc2626',
    style: {
      color: '#dc2626',
      weight: 2.5,
      opacity: 0.9,
    },
  },
  {
    key: 'crosswalks',
    label: 'Crosswalks',
    singularLabel: 'Crosswalk',
    access: 'PUBLIC',
    swatch: '#f97316',
    style: {
      color: '#f97316',
      weight: 1.5,
      opacity: 0.9,
      fillColor: '#fb923c',
      fillOpacity: 0.22,
    },
  },
  {
    key: 'trees',
    label: 'Trees',
    singularLabel: 'Tree',
    access: 'PUBLIC',
    swatch: '#16a34a',
    style: {
      color: '#166534',
      weight: 1.5,
      fillColor: '#22c55e',
      fillOpacity: 0.85,
    },
    pointStyle: {
      radius: 5,
    },
  },
  {
    key: 'extractedTrees',
    label: 'Extracted trees',
    singularLabel: 'Extracted tree',
    access: 'PUBLIC',
    swatch: '#65a30d',
    style: {
      color: '#4d7c0f',
      weight: 1.3,
      fillColor: '#84cc16',
      fillOpacity: 0.82,
    },
    pointStyle: {
      radius: 4,
    },
  },
  {
    key: 'busStops',
    label: 'Bus stops',
    singularLabel: 'Bus stop',
    access: 'PUBLIC',
    swatch: '#7c3aed',
    style: {
      color: '#6d28d9',
      weight: 1.5,
      fillColor: '#8b5cf6',
      fillOpacity: 0.9,
    },
    pointStyle: {
      radius: 5,
    },
  },
  {
    key: 'busStopAreas',
    label: 'Bus stop areas',
    singularLabel: 'Bus stop area',
    access: 'PUBLIC',
    swatch: '#8b5cf6',
    style: {
      color: '#7c3aed',
      weight: 1.5,
      opacity: 0.9,
      fillColor: '#a78bfa',
      fillOpacity: 0.18,
    },
  },
  {
    key: 'signBoards',
    label: 'Sign boards',
    singularLabel: 'Sign board',
    access: 'PUBLIC',
    swatch: '#2563eb',
    style: {
      color: '#1d4ed8',
      weight: 1.5,
      fillColor: '#3b82f6',
      fillOpacity: 0.9,
    },
    pointStyle: {
      radius: 4.5,
    },
  },

  /*
    Internal municipal infrastructure.

    CivicMap only exposes these rows to users with map.internal.
    The backend must continue enforcing the same permission.
  */
  {
    key: 'roadNameBoards',
    label: 'Road name boards',
    singularLabel: 'Road name board',
    access: 'PUBLIC',
    swatch: '#4f46e5',
    style: {
      color: '#4338ca',
      weight: 1.5,
      fillColor: '#6366f1',
      fillOpacity: 0.95,
    },
    pointStyle: {
      radius: 4.5,
    },
  },
  {
    key: 'billboards',
    label: 'Billboards / digital screens',
    singularLabel: 'Billboard / digital screen',
    access: 'PUBLIC',
    swatch: '#db2777',
    style: {
      color: '#be185d',
      weight: 1.5,
      fillColor: '#ec4899',
      fillOpacity: 0.95,
    },
    pointStyle: {
      radius: 4.5,
    },
  },
  {
    key: 'bridges',
    label: 'Bridges',
    singularLabel: 'Bridge',
    access: 'PUBLIC',
    swatch: '#a16207',
    style: {
      color: '#854d0e',
      weight: 1.5,
      fillColor: '#ca8a04',
      fillOpacity: 0.95,
    },
    pointStyle: {
      radius: 5,
    },
  },
  {
    key: 'benches',
    label: 'Benches',
    singularLabel: 'Bench',
    access: 'PUBLIC',
    swatch: '#059669',
    style: {
      color: '#047857',
      weight: 1.5,
      fillColor: '#10b981',
      fillOpacity: 0.95,
    },
    pointStyle: {
      radius: 4.5,
    },
  },
  {
    key: 'structures',
    label: 'Statues / structures',
    singularLabel: 'Statue / structure',
    access: 'PUBLIC',
    swatch: '#ea580c',
    style: {
      color: '#c2410c',
      weight: 1.5,
      fillColor: '#f97316',
      fillOpacity: 0.95,
    },
    pointStyle: {
      radius: 5,
    },
  },
  {
    key: 'poles',
    label: 'Poles',
    singularLabel: 'Pole',
    access: 'INTERNAL',
    swatch: '#78716c',
    style: {
      color: '#57534e',
      weight: 1.5,
      fillColor: '#a8a29e',
      fillOpacity: 0.9,
    },
    pointStyle: {
      radius: 4,
    },
  },
  {
    key: 'lightPoles',
    label: 'Light poles',
    singularLabel: 'Light pole',
    access: 'INTERNAL',
    swatch: '#facc15',
    style: {
      color: '#a16207',
      weight: 1.5,
      fillColor: '#facc15',
      fillOpacity: 0.9,
    },
    pointStyle: {
      radius: 4.5,
    },
  },
  {
    key: 'telephoneElectricPosts',
    label: 'Telephone / electric posts',
    singularLabel: 'Telephone / electric post',
    access: 'INTERNAL',
    swatch: '#737373',
    style: {
      color: '#525252',
      weight: 1.5,
      fillColor: '#a3a3a3',
      fillOpacity: 0.92,
    },
    pointStyle: {
      radius: 4.5,
    },
  },
  {
    key: 'fenceSurveyPoints',
    label: 'Fence survey points',
    singularLabel: 'Fence survey point',
    access: 'INTERNAL',
    swatch: '#78350f',
    style: {
      color: '#78350f',
      weight: 1.5,
      fillColor: '#a16207',
      fillOpacity: 0.92,
    },
    pointStyle: {
      radius: 4,
    },
  },
  {
    key: 'manholes',
    label: 'Manholes',
    singularLabel: 'Manhole',
    access: 'INTERNAL',
    swatch: '#475569',
    style: {
      color: '#1e293b',
      weight: 1.5,
      fillColor: '#64748b',
      fillOpacity: 0.9,
    },
    pointStyle: {
      radius: 4.5,
    },
  },
  {
    key: 'stormwaterDrains',
    label: 'Stormwater drains',
    singularLabel: 'Stormwater drain',
    access: 'INTERNAL',
    swatch: '#0891b2',
    style: {
      color: '#0e7490',
      weight: 1.5,
      fillColor: '#06b6d4',
      fillOpacity: 0.9,
    },
    pointStyle: {
      radius: 4.5,
    },
  },
  {
    key: 'fireHydrants',
    label: 'Fire hydrants',
    singularLabel: 'Fire hydrant',
    access: 'INTERNAL',
    swatch: '#ef4444',
    style: {
      color: '#b91c1c',
      weight: 1.5,
      fillColor: '#ef4444',
      fillOpacity: 0.95,
    },
    pointStyle: {
      radius: 5,
    },
  },
  {
    key: 'utilityBoxes',
    label: 'Utility boxes',
    singularLabel: 'Utility box',
    access: 'INTERNAL',
    swatch: '#9333ea',
    style: {
      color: '#7e22ce',
      weight: 1.5,
      fillColor: '#a855f7',
      fillOpacity: 0.9,
    },
    pointStyle: {
      radius: 4.5,
    },
  },
  {
    key: 'sewage',
    label: 'Sewage assets',
    singularLabel: 'Sewage asset',
    access: 'INTERNAL',
    swatch: '#0f766e',
    style: {
      color: '#115e59',
      weight: 1.5,
      fillColor: '#14b8a6',
      fillOpacity: 0.88,
    },
    pointStyle: {
      radius: 4,
    },
  },  {
    key: 'pits',
    label: 'Pits',
    singularLabel: 'Pit',
    access: 'INTERNAL',
    swatch: '#64748b',
    style: {
      color: '#475569',
      weight: 1.5,
      fillColor: '#94a3b8',
      fillOpacity: 0.92,
    },
    pointStyle: {
      radius: 4.5,
    },
  },
  {
    key: 'waterMeters',
    label: 'Water meters',
    singularLabel: 'Water meter',
    access: 'INTERNAL',
    swatch: '#0284c7',
    style: {
      color: '#0369a1',
      weight: 1.5,
      fillColor: '#0ea5e9',
      fillOpacity: 0.95,
    },
    pointStyle: {
      radius: 4.5,
    },
  },
  {
    key: 'waterOutlets',
    label: 'Water outlets',
    singularLabel: 'Water outlet',
    access: 'INTERNAL',
    swatch: '#06b6d4',
    style: {
      color: '#0e7490',
      weight: 1.5,
      fillColor: '#22d3ee',
      fillOpacity: 0.95,
    },
    pointStyle: {
      radius: 4.5,
    },
  },
  {
    key: 'waterValves',
    label: 'Water valves',
    singularLabel: 'Water valve',
    access: 'INTERNAL',
    swatch: '#2563eb',
    style: {
      color: '#1d4ed8',
      weight: 1.5,
      fillColor: '#3b82f6',
      fillOpacity: 0.95,
    },
    pointStyle: {
      radius: 4.5,
    },
  },
  {
    key: 'policeSecurityHuts',
    label: 'Police / security huts',
    singularLabel: 'Police / security hut',
    access: 'INTERNAL',
    swatch: '#991b1b',
    style: {
      color: '#7f1d1d',
      weight: 1.5,
      fillColor: '#dc2626',
      fillOpacity: 0.95,
    },
    pointStyle: {
      radius: 5,
    },
  },

]

export const DEFAULT_CMC_LAYER_VISIBILITY = Object.fromEntries(
  CMC_EXTRA_LAYERS.map((config) => [config.key, false]),
) as Record<CmcLayerKey, boolean>

function firstProperty(
  properties: Record<string, unknown>,
  keys: string[],
) {
  for (const key of keys) {
    const value = properties[key]

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim()
    ) {
      return String(value).trim()
    }
  }

  return undefined
}

function getCmcFeatureId(feature: any) {
  const properties = (feature?.properties || {}) as Record<string, unknown>

  return firstProperty(properties, [
    'parcelId',
    'roadSurfaceId',
    'roadFeatureId',
    'roadSideLineId',
    'forbidLineId',
    'fenceId',
    'planarFacilityId',
    'trafficSignId',
    'poleId',
    'signalLightPostId',
    'busStopAreaId',
    'roadNameBoardId',
    'billboardId',
    'bridgeId',
    'benchId',
    'structureId',
    'extractedTreeId',
    'telephoneElectricPostId',
    'fenceSurveyPointId',
    'pitId',
    'waterMeterId',
    'waterOutletId',
    'waterValveId',
    'policeSecurityHutId',
    'ParcelID',
    'parcel_id',
    'ID',
    'id',
    'Id',
    'FID',
    'fid',
    'OBJECTID',
    'ObjectID',
    'objectid',
  ])
}

function getFeatureTitle(
  config: CmcLayerConfig,
  feature: any,
) {
  const properties = (feature?.properties || {}) as Record<string, unknown>
  const id = getCmcFeatureId(feature)

  const explicitName = firstProperty(properties, [
    'Name',
    'name',
    'NAME',
    'Location',
    'location',
  ])

  if (explicitName) {
    return explicitName
  }

  return id
    ? `${config.singularLabel} ${id}`
    : config.singularLabel
}

function getFeatureSubtitle(
  config: CmcLayerConfig,
  feature: any,
) {
  const properties = (feature?.properties || {}) as Record<string, unknown>

  if (config.key === 'landParcels') {
    const landType = firstProperty(properties, [
      'landType',
      'Land Type',
      'land_type',
    ])

    const landUse = firstProperty(properties, [
      'landUse',
      'Land use',
      'land_use',
    ])

    const area = firstProperty(properties, [
      'areaSqM',
      'Area',
      'area',
    ])

    const parcelPieces = [
      landType,
      landUse,
      area ? `${Number(area).toLocaleString(undefined, { maximumFractionDigits: 2 })} m²` : undefined,
    ].filter(Boolean) as string[]

    return parcelPieces.join(' · ') || config.label
  }

  const pieces = [
    firstProperty(properties, ['Type', 'type']),
    firstProperty(properties, ['Condition', 'condition']),
    firstProperty(properties, ['Material', 'material']),
    firstProperty(properties, ['Authority', 'authority']),
    firstProperty(properties, ['Scientific', 'Scientific_', 'scientific']),
    firstProperty(properties, ['Health', 'health']),
  ].filter(Boolean) as string[]

  const unique = pieces.filter(
    (value, index, array) =>
      array.indexOf(value) === index,
  )

  return unique.slice(0, 3).join(' · ') || config.label
}

const LAND_PARCEL_FILL_COLORS = [
  '#fbbf24', // amber
  '#60a5fa', // blue
  '#34d399', // emerald
  '#c084fc', // violet
  '#fb7185', // rose
  '#2dd4bf', // teal
] as const

function stableColorIndex(
  value: string,
  size: number,
) {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash =
      (
        (hash << 5) -
        hash +
        value.charCodeAt(index)
      ) |
      0
  }

  return Math.abs(hash) % size
}

function featureBaseStyle(
  config: CmcLayerConfig,
  feature?: any,
): L.PathOptions {
  if (
    config.key !==
    'landParcels'
  ) {
    return config.style
  }

  const properties =
    (feature?.properties || {}) as Record<
      string,
      unknown
    >

  const parcelId =
    String(
      properties.parcelId ??
        properties.ID ??
        properties.id ??
        '',
    )

  const fillColor =
    LAND_PARCEL_FILL_COLORS[
      stableColorIndex(
        parcelId,
        LAND_PARCEL_FILL_COLORS.length,
      )
    ]

  return {
    ...config.style,

    /*
      Keep every parcel boundary dark, but vary the transparent
      fill by parcel ID so adjacent parcels are easier to distinguish.
    */
    color:
      '#1f2937',

    fillColor,
  }
}

function featurePoint(
  layer: L.Layer,
  event: L.LeafletMouseEvent,
) {
  /*
    For point features the click location is the feature itself.

    For lines/polygons we intentionally use the exact place the
    citizen clicked. This makes "Create request here" point to the
    actual affected part of a road, crosswalk, surface, etc.
  */
  if (layer instanceof L.CircleMarker || layer instanceof L.Marker) {
    return layer.getLatLng()
  }

  return event.latlng
}

function hoverablePath(
  layer: L.Layer,
  baseStyle: L.PathOptions,
) {
  if (!(layer instanceof L.Path)) {
    return
  }

  layer.on('mouseover', () => {
    layer.setStyle({
      ...baseStyle,

      /*
        A slightly stronger border/fill on hover makes the active
        parcel obvious without hiding the RGB imagery underneath.
      */
      weight:
        Number(
          baseStyle.weight ||
            1.5,
        ) + 1,

      fillOpacity:
        Math.min(
          Number(
            baseStyle.fillOpacity ||
              0,
          ) + 0.14,

          0.42,
        ),
    })

    layer.bringToFront()
  })

  layer.on('mouseout', () => {
    layer.setStyle(
      baseStyle,
    )
  })
}

/*
  Creates one Leaflet layer for an additional CMC dataset.

  Important behaviour:
  - feature clicks DO NOT fall through to the background map click;
  - the complete sanitized property object is returned to CivicMap;
  - CivicMap can therefore show a proper details drawer;
  - the clicked feature location can also be used for a citizen request.
*/
export function createCmcLeafletLayer(
  data: any,
  config: CmcLayerConfig,
  onFeatureClick?: (
    selection: CmcFeatureSelection,
  ) => void,
  renderOptions?: CmcLayerRenderOptions,
) {
  const resolveStyle = (
    feature?: any,
  ) =>
    renderOptions?.style?.(
      feature,
      config,
    ) ??
    featureBaseStyle(
      config,
      feature,
    )

  return L.geoJSON(data, {
    style: (feature) => ({
      ...resolveStyle(feature),
      bubblingMouseEvents: false,
    }),

    pointToLayer: (
      feature,
      latlng,
    ) =>
      renderOptions?.pointToLayer?.(
        feature,
        latlng,
        config,
      ) ??
      L.circleMarker(latlng, {
        radius: 5,
        ...config.style,
        ...(config.pointStyle || {}),
        bubblingMouseEvents: false,
      }),

    onEachFeature: (feature, layer) => {
      const baseStyle =
        resolveStyle(feature)

      hoverablePath(
        layer,
        baseStyle,
      )

      /*
        Keep a small hover label, while the full details are shown
        in CivicMap's right-side drawer after clicking.
      */
      layer.bindTooltip(
        getFeatureTitle(
          config,
          feature,
        ),
        {
          direction: 'top',
          sticky: true,
          opacity: 0.92,
        },
      )

      layer.on(
        'click',
        (
          event: L.LeafletMouseEvent,
        ) => {
          if (event.originalEvent) {
            L.DomEvent.stopPropagation(
              event.originalEvent,
            )
          }

          const point =
            featurePoint(
              layer,
              event,
            )

          const properties =
            (feature?.properties || {}) as Record<
              string,
              unknown
            >

          onFeatureClick?.({
            layerKey: config.key,
            layerLabel: config.label,
            singularLabel: config.singularLabel,
            access: config.access,
            featureId:
              getCmcFeatureId(
                feature,
              ),
            title:
              getFeatureTitle(
                config,
                feature,
              ),
            subtitle:
              getFeatureSubtitle(
                config,
                feature,
              ),
            latitude:
              Number(
                point.lat.toFixed(
                  7,
                ),
              ),
            longitude:
              Number(
                point.lng.toFixed(
                  7,
                ),
              ),
            properties,
          })
        },
      )
    },
  })
}
