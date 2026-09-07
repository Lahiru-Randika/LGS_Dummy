/*
  ============================================================
  OPENSTREETMAP HELPERS FOR LGS / CMC

  Main jobs:

  1. Search OSM by place/building/address name.
  2. Resolve the NAME of a clicked CMC building.
  3. Match named OSM objects INSIDE the selected CMC polygon.
  4. Use reverse geocoding only for address information.
  5. Cache successful lookups.

  IMPORTANT:
  We do NOT trust nearest-place reverse geocoding for building
  names, because that can return a neighboring building.
  ============================================================
*/

export type SupportedBuildingGeometry =
  | {
      type: 'Polygon'
      coordinates: number[][][]
    }
  | {
      type: 'MultiPolygon'
      coordinates: number[][][][]
    }

export type ResolvedPlace = {
  name?: string
  shortAddress: string
  displayName: string
  category: string
  type: string
  latitude: number
  longitude: number

  osmType?: string
  osmId?: number

  /*
    polygon-match:
      Named OSM feature was actually found inside the
      clicked CMC polygon.

    address-only:
      We only obtained address information.
  */
  confidence:
    | 'polygon-match'
    | 'address-only'
}

export type PlaceSearchResult = {
  id: string

  name: string
  shortAddress: string
  displayName: string

  category: string
  type: string

  latitude: number
  longitude: number
}

type NominatimAddress =
  Record<
    string,
    string | undefined
  >

type NominatimResult = {
  place_id?: number

  osm_id?: number
  osm_type?: string

  lat?: string
  lon?: string

  name?: string
  display_name?: string

  category?: string
  type?: string

  address?: NominatimAddress

  namedetails?: Record<
    string,
    string | undefined
  >

  extratags?: Record<
    string,
    string | undefined
  >
}

type OverpassElement = {
  type:
    | 'node'
    | 'way'
    | 'relation'

  id: number

  lat?: number
  lon?: number

  center?: {
    lat: number
    lon: number
  }

  tags?: Record<
    string,
    string | undefined
  >
}

type OverpassResponse = {
  elements?: OverpassElement[]
}

type Candidate = {
  element: OverpassElement

  name: string

  latitude: number
  longitude: number

  distanceMeters: number
  score: number
}

/* =========================================================
   ENDPOINTS
========================================================= */

const NOMINATIM_ROOT =
  'https://nominatim.openstreetmap.org'

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
]

/*
  Colombo search bias.

  Nominatim format:
  left,top,right,bottom
*/
const CMC_VIEWBOX =
  '79.80,6.97,79.94,6.80'

/* =========================================================
   CACHE
========================================================= */

const reverseCache =
  new Map<
    string,
    ResolvedPlace
  >()

const buildingCache =
  new Map<
    string,
    ResolvedPlace
  >()

const searchCache =
  new Map<
    string,
    PlaceSearchResult[]
  >()

/*
  Keep Nominatim requests spaced out.
*/
let nextNominatimRequestAt =
  0

/* =========================================================
   GENERIC HELPERS
========================================================= */

function cleanText(
  value:
    | string
    | undefined
    | null,
) {
  return (
    value?.trim() || ''
  )
}

function firstUseful(
  values: Array<
    string | undefined
  >,
) {
  for (
    const value of values
  ) {
    const text =
      cleanText(value)

    if (text) {
      return text
    }
  }

  return ''
}

function humanize(
  value: string,
) {
  if (!value) {
    return ''
  }

  return value
    .replace(
      /_/g,
      ' ',
    )
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    )
}

function sleep(
  milliseconds: number,
  signal?: AbortSignal,
) {
  return new Promise<void>(
    (
      resolve,
      reject,
    ) => {
      if (
        signal?.aborted
      ) {
        reject(
          new DOMException(
            'Aborted',
            'AbortError',
          ),
        )

        return
      }

      const abort =
        () => {
          window.clearTimeout(
            timeout,
          )

          reject(
            new DOMException(
              'Aborted',
              'AbortError',
            ),
          )
        }

      const timeout =
        window.setTimeout(
          () => {
            signal?.removeEventListener(
              'abort',
              abort,
            )

            resolve()
          },

          milliseconds,
        )

      signal?.addEventListener(
        'abort',
        abort,
        {
          once: true,
        },
      )
    },
  )
}

async function waitForNominatim(
  signal?: AbortSignal,
) {
  const now =
    Date.now()

  const delay =
    Math.max(
      0,
      nextNominatimRequestAt -
        now,
    )

  if (delay > 0) {
    await sleep(
      delay,
      signal,
    )
  }

  nextNominatimRequestAt =
    Date.now() + 1100
}

/* =========================================================
   GEO HELPERS
========================================================= */

function distanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const earthRadius =
    6371000

  const toRadians =
    (value: number) =>
      (value * Math.PI) /
      180

  const dLat =
    toRadians(
      lat2 - lat1,
    )

  const dLon =
    toRadians(
      lon2 - lon1,
    )

  const a =
    Math.sin(
      dLat / 2,
    ) ** 2 +
    Math.cos(
      toRadians(lat1),
    ) *
      Math.cos(
        toRadians(lat2),
      ) *
      Math.sin(
        dLon / 2,
      ) ** 2

  return (
    earthRadius *
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a),
    )
  )
}

/*
  GeoJSON coordinate:

  [longitude, latitude]
*/
function pointInRing(
  longitude: number,
  latitude: number,
  ring: number[][],
) {
  let inside = false

  for (
    let i = 0,
      j =
        ring.length - 1;
    i < ring.length;
    j = i++
  ) {
    const xi =
      ring[i][0]

    const yi =
      ring[i][1]

    const xj =
      ring[j][0]

    const yj =
      ring[j][1]

    const intersects =
      yi > latitude !==
        yj > latitude &&
      longitude <
        ((xj - xi) *
          (latitude - yi)) /
          (yj -
            yi +
            Number.EPSILON) +
          xi

    if (intersects) {
      inside = !inside
    }
  }

  return inside
}

function pointInPolygon(
  longitude: number,
  latitude: number,
  polygon: number[][][],
) {
  if (
    !polygon.length
  ) {
    return false
  }

  /*
    Must be inside outer ring.
  */
  if (
    !pointInRing(
      longitude,
      latitude,
      polygon[0],
    )
  ) {
    return false
  }

  /*
    Must NOT be inside a hole.
  */
  for (
    let i = 1;
    i < polygon.length;
    i++
  ) {
    if (
      pointInRing(
        longitude,
        latitude,
        polygon[i],
      )
    ) {
      return false
    }
  }

  return true
}

function pointInsideGeometry(
  longitude: number,
  latitude: number,
  geometry:
    SupportedBuildingGeometry,
) {
  if (
    geometry.type ===
    'Polygon'
  ) {
    return pointInPolygon(
      longitude,
      latitude,
      geometry.coordinates,
    )
  }

  return geometry.coordinates.some(
    (polygon) =>
      pointInPolygon(
        longitude,
        latitude,
        polygon,
      ),
  )
}

function allCoordinates(
  geometry:
    SupportedBuildingGeometry,
) {
  const result:
    Array<[
      number,
      number,
    ]> = []

  if (
    geometry.type ===
    'Polygon'
  ) {
    geometry.coordinates.forEach(
      (ring) => {
        ring.forEach(
          (coordinate) => {
            result.push([
              coordinate[0],
              coordinate[1],
            ])
          },
        )
      },
    )

    return result
  }

  geometry.coordinates.forEach(
    (polygon) => {
      polygon.forEach(
        (ring) => {
          ring.forEach(
            (coordinate) => {
              result.push([
                coordinate[0],
                coordinate[1],
              ])
            },
          )
        },
      )
    },
  )

  return result
}

function geometryBoundingBox(
  geometry:
    SupportedBuildingGeometry,
) {
  const coordinates =
    allCoordinates(geometry)

  if (
    !coordinates.length
  ) {
    return null
  }

  let south =
    Infinity

  let west =
    Infinity

  let north =
    -Infinity

  let east =
    -Infinity

  coordinates.forEach(
    ([
      longitude,
      latitude,
    ]) => {
      south =
        Math.min(
          south,
          latitude,
        )

      west =
        Math.min(
          west,
          longitude,
        )

      north =
        Math.max(
          north,
          latitude,
        )

      east =
        Math.max(
          east,
          longitude,
        )
    },
  )

  return {
    south,
    west,
    north,
    east,
  }
}

/*
  Slight expansion means OSM objects whose centre lies just
  around the polygon edge can still be returned by Overpass.

  We STILL only accept candidate points INSIDE the actual
  selected polygon.
*/
function expandedBoundingBox(
  geometry:
    SupportedBuildingGeometry,
) {
  const box =
    geometryBoundingBox(
      geometry,
    )

  if (!box) {
    return null
  }

  const latitudePadding =
    Math.max(
      0.00006,
      (box.north -
        box.south) *
        0.25,
    )

  const longitudePadding =
    Math.max(
      0.00006,
      (box.east -
        box.west) *
        0.25,
    )

  return {
    south:
      box.south -
      latitudePadding,

    west:
      box.west -
      longitudePadding,

    north:
      box.north +
      latitudePadding,

    east:
      box.east +
      longitudePadding,
  }
}

/* =========================================================
   ADDRESS HELPERS
========================================================= */

function extractShortAddress(
  result:
    NominatimResult,
) {
  const address =
    result.address || {}

  const lineOne = [
    address.house_number,
    address.road,
  ]
    .filter(Boolean)
    .join(' ')

  const area =
    firstUseful([
      address.neighbourhood,
      address.quarter,
      address.suburb,
      address.city_district,
    ])

  const city =
    firstUseful([
      address.city,
      address.town,
      address.municipality,
      address.county,
    ])

  const parts = [
    lineOne,
    area,
    city,
  ]
    .filter(Boolean)
    .filter(
      (
        value,
        index,
        array,
      ) =>
        array.indexOf(
          value,
        ) === index,
    )

  if (
    parts.length
  ) {
    return parts.join(
      ', ',
    )
  }

  return (
    result.display_name ||
    ''
  )
}

function extractAddressFromTags(
  tags: Record<
    string,
    string | undefined
  >,
) {
  const lineOne = [
    tags['addr:housenumber'],
    tags['addr:street'],
  ]
    .filter(Boolean)
    .join(' ')

  const area =
    firstUseful([
      tags['addr:suburb'],
      tags['addr:district'],
    ])

  const city =
    firstUseful([
      tags['addr:city'],
      tags['addr:town'],
    ])

  return [
    lineOne,
    area,
    city,
  ]
    .filter(Boolean)
    .join(', ')
}

/* =========================================================
   TYPE HELPERS
========================================================= */

function candidateType(
  tags: Record<
    string,
    string | undefined
  >,
) {
  if (
    tags.amenity
  ) {
    return humanize(
      tags.amenity,
    )
  }

  if (
    tags.office
  ) {
    return humanize(
      tags.office,
    )
  }

  if (
    tags.tourism
  ) {
    return humanize(
      tags.tourism,
    )
  }

  if (
    tags.leisure
  ) {
    return humanize(
      tags.leisure,
    )
  }

  if (
    tags.shop
  ) {
    return humanize(
      tags.shop,
    )
  }

  if (
    tags.healthcare
  ) {
    return humanize(
      tags.healthcare,
    )
  }

  if (
    tags.building &&
    tags.building !== 'yes'
  ) {
    return humanize(
      tags.building,
    )
  }

  if (
    tags.historic
  ) {
    return humanize(
      tags.historic,
    )
  }

  if (
    tags.man_made
  ) {
    return humanize(
      tags.man_made,
    )
  }

  return 'Mapped place'
}

function candidateScore(
  element:
    OverpassElement,
  tags:
    Record<
      string,
      string | undefined
    >,
  distance:
    number,
) {
  let score = 0

  /*
    Specific POI nodes are normally more precise than
    huge relations.
  */
  if (
    element.type ===
    'node'
  ) {
    score += 40
  }

  if (
    element.type ===
    'way'
  ) {
    score += 25
  }

  if (
    element.type ===
    'relation'
  ) {
    score += 5
  }

  /*
    Prefer meaningful facility/place objects.
  */
  if (
    tags.amenity
  ) {
    score += 30
  }

  if (
    tags.office
  ) {
    score += 28
  }

  if (
    tags.tourism
  ) {
    score += 25
  }

  if (
    tags.leisure
  ) {
    score += 24
  }

  if (
    tags.shop
  ) {
    score += 22
  }

  if (
    tags.healthcare
  ) {
    score += 28
  }

  if (
    tags.building
  ) {
    score += 15
  }

  /*
    University departments are common in this CMC area.
  */
  const name =
    cleanText(
      tags.name,
    ).toLowerCase()

  if (
    name.includes(
      'department',
    )
  ) {
    score += 28
  }

  if (
    name.includes(
      'faculty',
    )
  ) {
    score += 20
  }

  if (
    name.includes(
      'school',
    )
  ) {
    score += 14
  }

  if (
    name.includes(
      'theatre',
    )
  ) {
    score += 18
  }

  /*
    Penalise broad map objects.
  */
  if (
    tags.boundary
  ) {
    score -= 70
  }

  if (
    tags.place
  ) {
    score -= 30
  }

  if (
    tags.route
  ) {
    score -= 60
  }

  /*
    Closer to selected polygon centre is preferred.
  */
  score -=
    Math.min(
      distance / 2,
      40,
    )

  return score
}

/* =========================================================
   NOMINATIM REVERSE LOOKUP

   IMPORTANT:
   Used primarily for ADDRESS.

   We deliberately do NOT use the nearest returned feature
   name as the building name unless no polygon lookup exists.
========================================================= */

async function reverseAddressLookup(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
) {
  const key =
    `${latitude.toFixed(
      5,
    )}:${longitude.toFixed(
      5,
    )}`

  const cached =
    reverseCache.get(key)

  if (cached) {
    return cached
  }

  try {
    await waitForNominatim(
      signal,
    )

    const params =
      new URLSearchParams({
        format:
          'jsonv2',

        lat:
          String(
            latitude,
          ),

        lon:
          String(
            longitude,
          ),

        zoom:
          '18',

        addressdetails:
          '1',

        namedetails:
          '1',

        'accept-language':
          'en',
      })

    const response =
      await fetch(
        `${NOMINATIM_ROOT}/reverse?${params.toString()}`,
        {
          signal,

          headers: {
            Accept:
              'application/json',
          },
        },
      )

    if (
      !response.ok
    ) {
      throw new Error(
        `Reverse geocoding failed: ${response.status}`,
      )
    }

    const data =
      (await response.json()) as
        NominatimResult

    if (
      !data
    ) {
      return null
    }

    const result:
      ResolvedPlace = {
      shortAddress:
        extractShortAddress(
          data,
        ),

      displayName:
        data.display_name ||
        '',

      category:
        humanize(
          data.category ||
            '',
        ),

      type:
        humanize(
          data.type || '',
        ),

      latitude,
      longitude,

      osmType:
        data.osm_type,

      osmId:
        data.osm_id,

      confidence:
        'address-only',
    }

    reverseCache.set(
      key,
      result,
    )

    return result
  } catch (error) {
    if (
      error instanceof
        DOMException &&
      error.name ===
        'AbortError'
    ) {
      throw error
    }

    console.warn(
      'OSM reverse address lookup failed.',
      error,
    )

    return null
  }
}

/* =========================================================
   OVERPASS
========================================================= */

async function queryOverpass(
  query: string,
  signal?: AbortSignal,
): Promise<
  OverpassResponse | null
> {
  let lastError:
    unknown = null

  for (
    const endpoint of
      OVERPASS_ENDPOINTS
  ) {
    try {
      const response =
        await fetch(
          endpoint,
          {
            method:
              'POST',

            signal,

            headers: {
              Accept:
                'application/json',

              'Content-Type':
                'application/x-www-form-urlencoded;charset=UTF-8',
            },

            body:
              new URLSearchParams({
                data:
                  query,
              }),
          },
        )

      if (
        !response.ok
      ) {
        throw new Error(
          `Overpass ${response.status}`,
        )
      }

      return (
        (await response.json()) as
          OverpassResponse
      )
    } catch (error) {
      if (
        error instanceof
          DOMException &&
        error.name ===
          'AbortError'
      ) {
        throw error
      }

      lastError =
        error
    }
  }

  console.warn(
    'All Overpass endpoints failed.',
    lastError,
  )

  return null
}

/* =========================================================
   POLYGON-AWARE BUILDING LOOKUP
========================================================= */

export async function resolveBuildingPlace({
  latitude,
  longitude,
  geometry,
  signal,
}: {
  latitude: number
  longitude: number

  geometry?:
    SupportedBuildingGeometry

  signal?:
    AbortSignal
}): Promise<
  ResolvedPlace | null
> {
  const cacheKey =
    `${latitude.toFixed(
      6,
    )}:${longitude.toFixed(
      6,
    )}`

  const cached =
    buildingCache.get(
      cacheKey,
    )

  if (cached) {
    return cached
  }

  /*
    First obtain an address.

    We may use this even when no safe name match exists.
  */
  const addressPromise =
    reverseAddressLookup(
      latitude,
      longitude,
      signal,
    )

  /*
    If we do not have the actual polygon geometry,
    do NOT guess the building name.
  */
  if (!geometry) {
    return (
      (await addressPromise) ||
      null
    )
  }

  const bbox =
    expandedBoundingBox(
      geometry,
    )

  if (!bbox) {
    return (
      (await addressPromise) ||
      null
    )
  }

  const query = `
[out:json][timeout:12];
(
  node["name"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
  way["name"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
  relation["name"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
);
out center tags;
`

  const overpass =
    await queryOverpass(
      query,
      signal,
    )

  const address =
    await addressPromise

  if (
    !overpass?.elements?.length
  ) {
    return (
      address || null
    )
  }

  const candidates:
    Candidate[] = []

  for (
    const element of
      overpass.elements
  ) {
    const tags =
      element.tags || {}

    const name =
      cleanText(
        tags.name,
      )

    if (!name) {
      continue
    }

    const candidateLatitude =
      element.lat ??
      element.center?.lat

    const candidateLongitude =
      element.lon ??
      element.center?.lon

    if (
      candidateLatitude ===
        undefined ||
      candidateLongitude ===
        undefined
    ) {
      continue
    }

    /*
      THIS is the important safety check.

      Candidate name must physically lie inside the clicked
      CMC building polygon.
    */
    const inside =
      pointInsideGeometry(
        candidateLongitude,
        candidateLatitude,
        geometry,
      )

    if (!inside) {
      continue
    }

    const distance =
      distanceMeters(
        latitude,
        longitude,
        candidateLatitude,
        candidateLongitude,
      )

    candidates.push({
      element,

      name,

      latitude:
        candidateLatitude,

      longitude:
        candidateLongitude,

      distanceMeters:
        distance,

      score:
        candidateScore(
          element,
          tags,
          distance,
        ),
    })
  }

  /*
    No named OSM feature actually lies inside the selected
    building.

    Safer to show "Building 123" than a wrong department.
  */
  if (
    !candidates.length
  ) {
    return (
      address || null
    )
  }

  candidates.sort(
    (a, b) =>
      b.score - a.score,
  )

  const best =
    candidates[0]

  const tags =
    best.element.tags ||
    {}

  const tagAddress =
    extractAddressFromTags(
      tags,
    )

  const finalAddress =
    tagAddress ||
    address?.shortAddress ||
    address?.displayName ||
    ''

  const result:
    ResolvedPlace = {
    name:
      best.name,

    shortAddress:
      finalAddress,

    displayName:
      finalAddress,

    category:
      humanize(
        tags.amenity ||
          tags.office ||
          tags.tourism ||
          tags.leisure ||
          tags.shop ||
          tags.healthcare ||
          '',
      ),

    type:
      candidateType(
        tags,
      ),

    latitude:
      best.latitude,

    longitude:
      best.longitude,

    osmType:
      best.element.type,

    osmId:
      best.element.id,

    confidence:
      'polygon-match',
  }

  buildingCache.set(
    cacheKey,
    result,
  )

  return result
}

/* =========================================================
   SEARCH
========================================================= */

function searchResultName(
  result:
    NominatimResult,
) {
  const address =
    result.address || {}

  const namedetails =
    result.namedetails || {}

  return (
    firstUseful([
      result.name,

      namedetails.name,

      namedetails[
        'name:en'
      ],

      address.amenity,

      address.office,

      address.tourism,

      address.leisure,

      address.shop,

      address.building,

      result.display_name
        ?.split(',')[0]
        ?.trim(),

      address.road,
    ]) ||
    'Mapped location'
  )
}

export async function searchPlaces(
  query: string,
  signal?: AbortSignal,
): Promise<
  PlaceSearchResult[]
> {
  const normalized =
    query
      .trim()
      .toLowerCase()

  if (
    normalized.length < 3
  ) {
    return []
  }

  const cached =
    searchCache.get(
      normalized,
    )

  if (cached) {
    return cached
  }

  try {
    await waitForNominatim(
      signal,
    )

    const params =
      new URLSearchParams({
        format:
          'jsonv2',

        q:
          query.trim(),

        limit:
          '8',

        addressdetails:
          '1',

        namedetails:
          '1',

        extratags:
          '1',

        countrycodes:
          'lk',

        viewbox:
          CMC_VIEWBOX,

        bounded:
          '0',

        'accept-language':
          'en',
      })

    const response =
      await fetch(
        `${NOMINATIM_ROOT}/search?${params.toString()}`,
        {
          signal,

          headers: {
            Accept:
              'application/json',
          },
        },
      )

    if (
      !response.ok
    ) {
      throw new Error(
        `OSM search failed: ${response.status}`,
      )
    }

    const data =
      (await response.json()) as
        NominatimResult[]

    const results =
      data
        .filter(
          (item) =>
            Number.isFinite(
              Number(
                item.lat,
              ),
            ) &&
            Number.isFinite(
              Number(
                item.lon,
              ),
            ),
        )
        .map(
          (
            item,
            index,
          ) => {
            const latitude =
              Number(
                item.lat,
              )

            const longitude =
              Number(
                item.lon,
              )

            return {
              id:
                item.place_id
                  ? `osm-${item.place_id}`
                  : `osm-${latitude}-${longitude}-${index}`,

              name:
                searchResultName(
                  item,
                ),

              shortAddress:
                extractShortAddress(
                  item,
                ),

              displayName:
                item.display_name ||
                '',

              category:
                humanize(
                  item.category ||
                    '',
                ),

              type:
                humanize(
                  item.type ||
                    '',
                ),

              latitude,
              longitude,
            }
          },
        )

    searchCache.set(
      normalized,
      results,
    )

    return results
  } catch (error) {
    if (
      error instanceof
        DOMException &&
      error.name ===
        'AbortError'
    ) {
      throw error
    }

    console.warn(
      'OSM place search failed.',
      error,
    )

    return []
  }
}