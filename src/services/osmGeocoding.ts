/*
  ============================================================
  OPENSTREETMAP / NOMINATIM HELPERS

  Used only when necessary:
  - Reverse lookup when a CMC building is clicked
  - Forward search when the user searches for a place/address

  Results are cached so repeated clicks/searches do not keep
  sending requests.

  This is suitable for the frontend demo.
  For a production system, put geocoding behind your backend.
  ============================================================
*/

export type ResolvedPlace = {
  name: string
  shortAddress: string
  displayName: string
  category: string
  type: string
  latitude: number
  longitude: number
  osmType?: string
  osmId?: number
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

type NominatimAddress = Record<
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

/*
  Colombo bias.

  This does NOT strictly restrict the search to this rectangle.
  It simply helps Nominatim rank nearby Colombo results higher.
*/
const CMC_VIEWBOX =
  '79.80,6.97,79.94,6.80'

const NOMINATIM_ROOT =
  'https://nominatim.openstreetmap.org'

const reverseCache =
  new Map<string, ResolvedPlace>()

const searchCache =
  new Map<
    string,
    PlaceSearchResult[]
  >()

/*
  Nominatim's public service should not be hammered.

  Keep approximately one request per second.
*/
let nextAllowedRequestAt = 0

function sleep(
  milliseconds: number,
  signal?: AbortSignal,
) {
  return new Promise<void>(
    (resolve, reject) => {
      if (signal?.aborted) {
        reject(
          new DOMException(
            'Aborted',
            'AbortError',
          ),
        )

        return
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

      const abort = () => {
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

async function waitForRateLimit(
  signal?: AbortSignal,
) {
  const now = Date.now()

  const delay =
    Math.max(
      0,
      nextAllowedRequestAt - now,
    )

  if (delay > 0) {
    await sleep(
      delay,
      signal,
    )
  }

  nextAllowedRequestAt =
    Date.now() + 1100
}

function cleanText(
  value:
    | string
    | undefined
    | null,
) {
  return value?.trim() || ''
}

function firstUseful(
  values: Array<
    string | undefined
  >,
) {
  for (const value of values) {
    const clean =
      cleanText(value)

    if (clean) {
      return clean
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
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    )
}

function extractName(
  result: NominatimResult,
) {
  const address =
    result.address || {}

  const namedetails =
    result.namedetails || {}

  const name = firstUseful([
    result.name,

    namedetails.name,
    namedetails['name:en'],

    address.amenity,
    address.tourism,
    address.leisure,
    address.office,
    address.shop,
    address.historic,
    address.attraction,
    address.building,
    address.man_made,

    result.extratags?.official_name,

    result.display_name
      ?.split(',')[0]
      ?.trim(),

    address.road,
  ])

  return (
    name ||
    'Mapped location'
  )
}

function extractShortAddress(
  result: NominatimResult,
) {
  const address =
    result.address || {}

  const lineOne = [
    address.house_number,
    address.road,
  ]
    .filter(Boolean)
    .join(' ')

  const area = firstUseful([
    address.neighbourhood,
    address.quarter,
    address.suburb,
    address.city_district,
  ])

  const city = firstUseful([
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

  if (parts.length) {
    return parts.join(', ')
  }

  return (
    result.display_name || ''
  )
}

function mapResult(
  result: NominatimResult,
): ResolvedPlace {
  const latitude =
    Number(result.lat)

  const longitude =
    Number(result.lon)

  return {
    name:
      extractName(result),

    shortAddress:
      extractShortAddress(
        result,
      ),

    displayName:
      result.display_name || '',

    category:
      humanize(
        result.category || '',
      ),

    type:
      humanize(
        result.type || '',
      ),

    latitude,
    longitude,

    osmType:
      result.osm_type,

    osmId:
      result.osm_id,
  }
}

function reverseCacheKey(
  latitude: number,
  longitude: number,
) {
  /*
    Five decimals is roughly meter-level enough
    for this map while giving good cache reuse.
  */
  return `${latitude.toFixed(
    5,
  )}:${longitude.toFixed(5)}`
}

/* =========================================================
   REVERSE LOOKUP

   Building coordinates -> readable OSM place information
========================================================= */

export async function reverseGeocode(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<ResolvedPlace | null> {
  const key =
    reverseCacheKey(
      latitude,
      longitude,
    )

  const cached =
    reverseCache.get(key)

  if (cached) {
    return cached
  }

  try {
    await waitForRateLimit(
      signal,
    )

    const params =
      new URLSearchParams({
        format: 'jsonv2',

        lat:
          String(latitude),

        lon:
          String(longitude),

        zoom: '18',

        addressdetails: '1',

        namedetails: '1',

        extratags: '1',

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

    if (!response.ok) {
      throw new Error(
        `Reverse geocoding failed: ${response.status}`,
      )
    }

    const data =
      (await response.json()) as NominatimResult

    if (
      !data ||
      !data.lat ||
      !data.lon
    ) {
      return null
    }

    const result =
      mapResult(data)

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
      'OSM reverse geocoding failed.',
      error,
    )

    return null
  }
}

/* =========================================================
   FORWARD SEARCH

   Text -> OSM places / buildings / addresses

   This makes the search bar useful even though the CMC
   buildings GeoJSON currently contains IDs but not names.
========================================================= */

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
    await waitForRateLimit(
      signal,
    )

    const params =
      new URLSearchParams({
        format: 'jsonv2',

        q: query.trim(),

        limit: '7',

        addressdetails: '1',

        namedetails: '1',

        extratags: '1',

        countrycodes: 'lk',

        viewbox:
          CMC_VIEWBOX,

        bounded: '0',

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

    if (!response.ok) {
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
            const mapped =
              mapResult(item)

            return {
              id:
                item.place_id
                  ? `osm-${item.place_id}`
                  : `osm-${mapped.latitude}-${mapped.longitude}-${index}`,

              name:
                mapped.name,

              shortAddress:
                mapped.shortAddress,

              displayName:
                mapped.displayName,

              category:
                mapped.category,

              type:
                mapped.type,

              latitude:
                mapped.latitude,

              longitude:
                mapped.longitude,
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