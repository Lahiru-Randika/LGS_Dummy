import type {
  Building,
  PageMeta,
} from '../types'

import {
  apiData,
  apiRequest,
  queryString,
} from './http'

function toBoolean(
  value:
    unknown,
) {
  return (
    value ===
      true ||
    value ===
      1 ||
    value ===
      '1'
  )
}

export type BuildingSearchQuery = {
  search?:
    string

  wardId?:
    number

  publicFacility?:
    boolean

  latitude?:
    number

  longitude?:
    number

  radiusMeters?:
    number

  page?:
    number

  limit?:
    number
}

export function mapBackendBuilding(
  raw:
    any,
):
  Building {
  const longitude =
    Number(
      raw?.longitude,
    )

  const latitude =
    Number(
      raw?.latitude,
    )

  return {
    id:
      String(
        raw?.buildingCode ||
        raw?.building_code ||
        raw?.id ||
        '',
      ),

    name:
      String(
        raw?.resolvedName ||
        raw?.resolved_name ||
        raw?.name ||
        raw?.buildingCode ||
        raw?.building_code ||
        'Unnamed building',
      ),

    address:
      String(
        raw?.address ||
        'Address not available',
      ),

    type:
      String(
        raw?.buildingType ||
        raw?.building_type ||
        'Building',
      ),

    publicFacility:
      toBoolean(
        raw?.publicFacility ??
        raw?.public_facility,
      ),

    requestCount:
      Number(
        raw?.requestCount ||
        0,
      ),

    propertyId:
      String(
        raw?.propertyCode ||
        'Restricted',
      ),

    taxId:
      String(
        raw?.taxCode ||
        'Restricted',
      ),

    taxStatus:
      raw?.taxStatus
        ? String(
            raw.taxStatus,
          ) as Building['taxStatus']
        : 'Restricted',

    assessmentValue:
      raw?.assessmentValue ==
      null
        ? 'Restricted'
        : `Rs. ${Number(
            raw.assessmentValue,
          ).toLocaleString()}`,

    /*
      Existing Building type uses:
      [longitude, latitude]
    */
    center: [
      Number.isFinite(
        longitude,
      )
        ? longitude
        : 0,

      Number.isFinite(
        latitude,
      )
        ? latitude
        : 0,
    ],

    ward:
      raw?.wardName
        ? String(
            raw.wardName,
          )
        : undefined,
  }
}

export const buildingsService =
  {
    async publicList(
      query: {
        search?:
          string

        page?:
          number

        limit?:
          number
      } = {},
    ) {
      const data =
        await apiData<
          any[]
        >(
          `/public/buildings${queryString(
            query,
          )}`,
        )

      return data.map(
        mapBackendBuilding,
      )
    },

    async list(
      query:
        BuildingSearchQuery = {},
    ) {
      const response =
        await apiRequest<
          any[]
        >(
          `/buildings${queryString(
            {
              ...query,

              publicFacility:
                query.publicFacility ===
                undefined
                  ? undefined
                  : String(
                      query.publicFacility,
                    ),
            },
          )}`,
        )

      return {
        items:
          response.data.map(
            mapBackendBuilding,
          ),

        meta:
          response.meta as
            | PageMeta
            | undefined,
      }
    },

    async get(
      code:
        string,
    ) {
      return mapBackendBuilding(
        await apiData<any>(
          `/buildings/${encodeURIComponent(
            code,
          )}`,
        ),
      )
    },

    async publicGet(
      code:
        string,
    ) {
      return mapBackendBuilding(
        await apiData<any>(
          `/public/buildings/${encodeURIComponent(
            code,
          )}`,
        ),
      )
    },

    async cacheResolution(
      input: {
        rawFeatureId?:
          string | null

        geometry:
          unknown

        latitude:
          number

        longitude:
          number

        name:
          string

        address?:
          string | null

        buildingType?:
          string | null
      },
    ) {
      const result =
        await apiData<{
          matched:
            boolean

          building?:
            any
        }>(
          '/map/buildings/cache-resolution',
          {
            method:
              'POST',

            json:
              input,
          },
        )

      return {
        matched:
          result.matched,

        building:
          result.building
            ? mapBackendBuilding(
                result.building,
              )
            : null,
      }
    },

    async matchOsmPlace(
      input: {
        latitude:
          number

        longitude:
          number

        name:
          string

        address?:
          string | null

        buildingType?:
          string | null
      },
    ) {
      const result =
        await apiData<{
          matched:
            boolean

          building?:
            any
        }>(
          '/map/buildings/match-place',
          {
            method:
              'POST',

            json:
              input,
          },
        )

      return result.matched &&
        result.building
        ? mapBackendBuilding(
            result.building,
          )
        : null
    },

    update(
      code:
        string,

      input: {
        name?:
          string | null

        resolvedName?:
          string | null

        address?:
          string | null

        buildingType?:
          string | null

        publicFacility?:
          boolean

        wardId?:
          number | null

        active?:
          boolean
      },
    ) {
      return apiData<{
        updated:
          boolean
      }>(
        `/buildings/${encodeURIComponent(
          code,
        )}`,
        {
          method:
            'PATCH',

          json:
            input,
        },
      )
    },
  }