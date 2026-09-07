import L from 'leaflet'

export type CmcLayerKey =
  | 'roadSurface'
  | 'roadBoundary'
  | 'roadMarkings'
  | 'laneLines'
  | 'stopLines'
  | 'crosswalks'
  | 'trees'
  | 'busStops'
  | 'signBoards'
  | 'lightPoles'
  | 'manholes'
  | 'stormwaterDrains'
  | 'fireHydrants'
  | 'utilityBoxes'
  | 'sewage'

export type CmcLayerConfig = {
  key: CmcLayerKey
  label: string
  singularLabel: string
  access:
    | 'PUBLIC'
    | 'INTERNAL'
  swatch: string
  style: L.PathOptions
  pointStyle?: L.CircleMarkerOptions
}

export type CmcFeatureSelection = {
  layerKey: CmcLayerKey
  layerLabel: string
  singularLabel: string

  access:
    | 'PUBLIC'
    | 'INTERNAL'

  featureId?: string

  title: string

  subtitle?: string

  latitude: number

  longitude: number

  properties:
    Record<
      string,
      unknown
    >
}

/*
  Extra CMC master-folder layers.

  IMPORTANT:
  Every extra layer starts OFF in CivicMap.
  This keeps the existing initial map appearance unchanged.
*/
export const CMC_EXTRA_LAYERS:
  CmcLayerConfig[] = [
    {
      key:
        'roadSurface',

      label:
        'Road surface',

      singularLabel:
        'Road surface',

      access:
        'PUBLIC',

      swatch:
        '#64748b',

      style: {
        color:
          '#64748b',

        weight:
          1.5,

        opacity:
          0.9,

        fillColor:
          '#94a3b8',

        fillOpacity:
          0.14,
      },
    },

    {
      key:
        'roadBoundary',

      label:
        'Road boundaries',

      singularLabel:
        'Road boundary',

      access:
        'PUBLIC',

      swatch:
        '#475569',

      style: {
        color:
          '#475569',

        weight:
          2,

        opacity:
          0.85,
      },
    },

    {
      key:
        'roadMarkings',

      label:
        'Road markings',

      singularLabel:
        'Road marking',

      access:
        'PUBLIC',

      swatch:
        '#f59e0b',

      style: {
        color:
          '#f59e0b',

        weight:
          1.5,

        opacity:
          0.9,

        fillColor:
          '#fbbf24',

        fillOpacity:
          0.22,
      },
    },

    {
      key:
        'laneLines',

      label:
        'Lane lines',

      singularLabel:
        'Lane line',

      access:
        'PUBLIC',

      swatch:
        '#eab308',

      style: {
        color:
          '#eab308',

        weight:
          2,

        opacity:
          0.9,
      },
    },

    {
      key:
        'stopLines',

      label:
        'Stop lines',

      singularLabel:
        'Stop line',

      access:
        'PUBLIC',

      swatch:
        '#dc2626',

      style: {
        color:
          '#dc2626',

        weight:
          2.5,

        opacity:
          0.9,
      },
    },

    {
      key:
        'crosswalks',

      label:
        'Crosswalks',

      singularLabel:
        'Crosswalk',

      access:
        'PUBLIC',

      swatch:
        '#f97316',

      style: {
        color:
          '#f97316',

        weight:
          1.5,

        opacity:
          0.9,

        fillColor:
          '#fb923c',

        fillOpacity:
          0.22,
      },
    },

    {
      key:
        'trees',

      label:
        'Trees',

      singularLabel:
        'Tree',

      access:
        'PUBLIC',

      swatch:
        '#16a34a',

      style: {
        color:
          '#166534',

        weight:
          1.5,

        fillColor:
          '#22c55e',

        fillOpacity:
          0.85,
      },

      pointStyle: {
        radius:
          5,
      },
    },

    {
      key:
        'busStops',

      label:
        'Bus stops',

      singularLabel:
        'Bus stop',

      access:
        'PUBLIC',

      swatch:
        '#7c3aed',

      style: {
        color:
          '#6d28d9',

        weight:
          1.5,

        fillColor:
          '#8b5cf6',

        fillOpacity:
          0.9,
      },

      pointStyle: {
        radius:
          5,
      },
    },

    {
      key:
        'signBoards',

      label:
        'Sign boards',

      singularLabel:
        'Sign board',

      access:
        'PUBLIC',

      swatch:
        '#2563eb',

      style: {
        color:
          '#1d4ed8',

        weight:
          1.5,

        fillColor:
          '#3b82f6',

        fillOpacity:
          0.9,
      },

      pointStyle: {
        radius:
          4.5,
      },
    },

    /*
      INTERNAL MUNICIPAL INFRASTRUCTURE
    */

    {
      key:
        'lightPoles',

      label:
        'Light poles',

      singularLabel:
        'Light pole',

      access:
        'INTERNAL',

      swatch:
        '#facc15',

      style: {
        color:
          '#a16207',

        weight:
          1.5,

        fillColor:
          '#facc15',

        fillOpacity:
          0.9,
      },

      pointStyle: {
        radius:
          4.5,
      },
    },

    {
      key:
        'manholes',

      label:
        'Manholes',

      singularLabel:
        'Manhole',

      access:
        'INTERNAL',

      swatch:
        '#475569',

      style: {
        color:
          '#1e293b',

        weight:
          1.5,

        fillColor:
          '#64748b',

        fillOpacity:
          0.9,
      },

      pointStyle: {
        radius:
          4.5,
      },
    },

    {
      key:
        'stormwaterDrains',

      label:
        'Stormwater drains',

      singularLabel:
        'Stormwater drain',

      access:
        'INTERNAL',

      swatch:
        '#0891b2',

      style: {
        color:
          '#0e7490',

        weight:
          1.5,

        fillColor:
          '#06b6d4',

        fillOpacity:
          0.9,
      },

      pointStyle: {
        radius:
          4.5,
      },
    },

    {
      key:
        'fireHydrants',

      label:
        'Fire hydrants',

      singularLabel:
        'Fire hydrant',

      access:
        'INTERNAL',

      swatch:
        '#ef4444',

      style: {
        color:
          '#b91c1c',

        weight:
          1.5,

        fillColor:
          '#ef4444',

        fillOpacity:
          0.95,
      },

      pointStyle: {
        radius:
          5,
      },
    },

    {
      key:
        'utilityBoxes',

      label:
        'Utility boxes',

      singularLabel:
        'Utility box',

      access:
        'INTERNAL',

      swatch:
        '#9333ea',

      style: {
        color:
          '#7e22ce',

        weight:
          1.5,

        fillColor:
          '#a855f7',

        fillOpacity:
          0.9,
      },

      pointStyle: {
        radius:
          4.5,
      },
    },

    {
      key:
        'sewage',

      label:
        'Sewage assets',

      singularLabel:
        'Sewage asset',

      access:
        'INTERNAL',

      swatch:
        '#0f766e',

      style: {
        color:
          '#115e59',

        weight:
          1.5,

        fillColor:
          '#14b8a6',

        fillOpacity:
          0.88,
      },

      pointStyle: {
        radius:
          4,
      },
    },
  ]

export const DEFAULT_CMC_LAYER_VISIBILITY =
  Object.fromEntries(
    CMC_EXTRA_LAYERS.map(
      (
        config,
      ) => [
        config.key,
        false,
      ],
    ),
  ) as Record<
    CmcLayerKey,
    boolean
  >

function firstProperty(
  properties:
    Record<
      string,
      unknown
    >,

  keys:
    string[],
) {
  for (
    const key of keys
  ) {
    const value =
      properties[
        key
      ]

    if (
      value !==
        undefined &&
      value !==
        null &&
      String(
        value,
      ).trim()
    ) {
      return String(
        value,
      ).trim()
    }
  }

  return undefined
}

function getCmcFeatureId(
  feature:
    any,
) {
  const properties =
    (
      feature?.properties ||
      {}
    ) as Record<
      string,
      unknown
    >

  return firstProperty(
    properties,
    [
      'ID',
      'id',
      'Id',
      'FID',
      'fid',
      'OBJECTID',
      'ObjectID',
      'objectid',
    ],
  )
}

function getFeatureTitle(
  config:
    CmcLayerConfig,

  feature:
    any,
) {
  const properties =
    (
      feature?.properties ||
      {}
    ) as Record<
      string,
      unknown
    >

  const id =
    getCmcFeatureId(
      feature,
    )

  const explicitName =
    firstProperty(
      properties,
      [
        'Name',
        'name',
        'NAME',
        'Location',
        'location',
      ],
    )

  if (
    explicitName
  ) {
    return explicitName
  }

  return id
    ? `${config.singularLabel} ${id}`
    : config.singularLabel
}

function getFeatureSubtitle(
  config:
    CmcLayerConfig,

  feature:
    any,
) {
  const properties =
    (
      feature?.properties ||
      {}
    ) as Record<
      string,
      unknown
    >

  const pieces =
    [
      firstProperty(
        properties,
        [
          'Type',
          'type',
        ],
      ),

      firstProperty(
        properties,
        [
          'Condition',
          'condition',
        ],
      ),

      firstProperty(
        properties,
        [
          'Material',
          'material',
        ],
      ),

      firstProperty(
        properties,
        [
          'Authority',
          'authority',
        ],
      ),

      firstProperty(
        properties,
        [
          'Scientific',
          'Scientific_',
          'scientific',
        ],
      ),

      firstProperty(
        properties,
        [
          'Health',
          'health',
        ],
      ),
    ].filter(
      Boolean,
    ) as string[]

  const unique =
    pieces.filter(
      (
        value,
        index,
        array,
      ) =>
        array.indexOf(
          value,
        ) ===
        index,
    )

  return (
    unique
      .slice(
        0,
        3,
      )
      .join(
        ' · ',
      ) ||
    config.label
  )
}

function featurePoint(
  layer:
    L.Layer,

  event:
    L.LeafletMouseEvent,
) {
  /*
    Point objects use their own exact feature location.

    For lines and polygons we use the exact location clicked
    by the citizen, which is better for reporting a problem
    on a particular section of a road/crosswalk/etc.
  */
  if (
    layer instanceof
      L.CircleMarker ||
    layer instanceof
      L.Marker
  ) {
    return layer.getLatLng()
  }

  return event.latlng
}

function hoverablePath(
  layer:
    L.Layer,

  config:
    CmcLayerConfig,
) {
  if (
    !(
      layer instanceof
      L.Path
    )
  ) {
    return
  }

  layer.on(
    'mouseover',
    () => {
      layer.setStyle(
        {
          ...config.style,

          weight:
            Number(
              config
                .style
                .weight ||
                1.5,
            ) +
            1,

          fillOpacity:
            Math.min(
              Number(
                config
                  .style
                  .fillOpacity ||
                  0,
              ) +
                0.12,

              0.42,
            ),
        },
      )
    },
  )

  layer.on(
    'mouseout',
    () => {
      layer.setStyle(
        config.style,
      )
    },
  )
}

/*
  Creates one Leaflet layer for an additional CMC dataset.

  Important:

  1. CMC feature clicks do not fall through to the normal
     background-map click.

  2. The COMPLETE sanitized properties object is returned
     to CivicMap.

  3. CivicMap can show a proper details drawer.

  4. The feature/click location can be used directly when
     creating a citizen request.
*/
export function createCmcLeafletLayer(
  data:
    any,

  config:
    CmcLayerConfig,

  onFeatureClick?:
    (
      selection:
        CmcFeatureSelection,
    ) => void,
) {
  return L.geoJSON(
    data,
    {
      style:
        () => ({
          ...config.style,

          /*
            Very important.

            Prevents a CMC feature click from also firing
            CivicMap's normal background-map click.
          */
          bubblingMouseEvents:
            false,
        }),

      pointToLayer:
        (
          _feature,
          latlng,
        ) =>
          L.circleMarker(
            latlng,
            {
              radius:
                5,

              ...config.style,

              ...(
                config.pointStyle ||
                {}
              ),

              bubblingMouseEvents:
                false,
            },
          ),

      onEachFeature:
        (
          feature,
          layer,
        ) => {
          hoverablePath(
            layer,
            config,
          )

          /*
            Small hover label.

            Full information is shown in the right-side drawer
            after clicking.
          */
          layer.bindTooltip(
            getFeatureTitle(
              config,
              feature,
            ),
            {
              direction:
                'top',

              sticky:
                true,

              opacity:
                0.92,
            },
          )

          layer.on(
            'click',
            (
              event:
                L.LeafletMouseEvent,
            ) => {
              if (
                event.originalEvent
              ) {
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
                (
                  feature?.properties ||
                  {}
                ) as Record<
                  string,
                  unknown
                >

              onFeatureClick?.(
                {
                  layerKey:
                    config.key,

                  layerLabel:
                    config.label,

                  singularLabel:
                    config.singularLabel,

                  access:
                    config.access,

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

                  /*
                    This is what makes ID, Elevation, Type,
                    Condition, Material, Authority, etc. visible
                    in CmcFeatureDrawer.
                  */
                  properties,
                },
              )
            },
          )
        },
    },
  )
}