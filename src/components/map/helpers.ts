import type {
  SupportedBuildingGeometry,
} from '../../services/osmGeocoding'

import type {
  MapFocusTarget,
} from './types'

export function readMapFocusTarget():
  MapFocusTarget |
  null {
  const params =
    new URLSearchParams(
      window.location.search,
    )

  const latitudeParam =
    params.get(
      'lat',
    )

  const longitudeParam =
    params.get(
      'lng',
    )

  if (
    latitudeParam ===
      null ||
    longitudeParam ===
      null ||
    latitudeParam.trim() ===
      '' ||
    longitudeParam.trim() ===
      ''
  ) {
    return null
  }

  const latitude =
    Number(
      latitudeParam,
    )

  const longitude =
    Number(
      longitudeParam,
    )

  if (
    !Number.isFinite(
      latitude,
    ) ||
    !Number.isFinite(
      longitude,
    ) ||
    latitude <
      -90 ||
    latitude >
      90 ||
    longitude <
      -180 ||
    longitude >
      180
  ) {
    return null
  }

  return {
    latitude,
    longitude,

    requestId:
      params.get(
        'request',
      ) ||
      undefined,

    label:
      params.get(
        'label',
      ) ||
      undefined,
  }
}

export function getFeatureId(
  feature: any,
  properties: Record<string, unknown>,
) {
  const keys = [
    'id',
    'ID',
    'Id',
    'fid',
    'FID',
    'OBJECTID',
    'ObjectID',
    'objectid',
    'building_id',
    'buildingid',
  ]

  for (const key of keys) {
    const value =
      properties[key]

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim()
    ) {
      return String(value)
    }
  }

  if (
    feature?.id !== undefined &&
    feature?.id !== null
  ) {
    return String(feature.id)
  }

  return undefined
}

export function getNativeFeatureName(
  properties: Record<string, unknown>,
) {
  const keys = [
    'name',
    'Name',
    'NAME',
    'building_name',
    'building',
    'Building',
    'premises',
    'Premises',
    'facility_name',
    'facility',
  ]

  for (const key of keys) {
    const value =
      properties[key]

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

export function getFeatureSubtitle(
  properties: Record<string, unknown>,
) {
  const keys = [
    'address',
    'Address',
    'ADDRESS',
    'street',
    'Street',
    'road',
    'Road',
    'ward',
    'Ward',
    'division',
    'Division',
  ]

  const values:
    string[] = []

  for (const key of keys) {
    const value =
      properties[key]

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim()
    ) {
      const text =
        String(value).trim()

      if (
        !values.includes(text)
      ) {
        values.push(text)
      }
    }
  }

  return values
    .slice(0, 2)
    .join(' · ')
}

export function popupNode(
  title: string,
  subtitle: string,
) {
  const root =
    document.createElement(
      'div',
    )

  root.style.minWidth =
    '225px'

  root.style.fontFamily =
    'DM Sans, Inter, ui-sans-serif, system-ui, sans-serif'

  const heading =
    document.createElement(
      'div',
    )

  heading.textContent =
    title

  heading.style.fontWeight =
    '800'

  heading.style.fontSize =
    '13px'

  heading.style.lineHeight =
    '1.3'

  heading.style.color =
    '#0b1323'

  const sub =
    document.createElement(
      'div',
    )

  sub.textContent =
    subtitle

  sub.style.marginTop =
    '6px'

  sub.style.fontSize =
    '10px'

  sub.style.lineHeight =
    '1.5'

  sub.style.color =
    '#66778a'

  root.append(
    heading,
    sub,
  )

  return root
}

export function supportedGeometry(
  feature: any,
):
  | SupportedBuildingGeometry
  | undefined {
  const geometry =
    feature?.geometry

  if (
    geometry?.type ===
      'Polygon' &&
    Array.isArray(
      geometry.coordinates,
    )
  ) {
    return geometry as
      SupportedBuildingGeometry
  }

  if (
    geometry?.type ===
      'MultiPolygon' &&
    Array.isArray(
      geometry.coordinates,
    )
  ) {
    return geometry as
      SupportedBuildingGeometry
  }

  return undefined
}
