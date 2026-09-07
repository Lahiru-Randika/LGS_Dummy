import {
  apiData,
  apiUrl,
  fetchJsonResource,
} from './http'

import type {
  CmcLayerKey,
} from '../lib/cmcLayers'

export const mapService = {
  /*
    Existing generic GeoJSON/resource loader.
    This still supports the current Visigeo building source.
  */
  fetchGeoJson<T = any>(
    url: string,
    signal?: AbortSignal,
  ) {
    return fetchJsonResource<T>(
      url,
      signal,
    )
  },

  /*
    Existing map API methods.
  */
  config: () =>
    apiData<any>(
      '/map/config',
    ),

  buildingsGeoJson: () =>
    apiData<any>(
      '/map/buildings.geojson',
    ),

  requestsGeoJson: () =>
    apiData<any>(
      '/map/requests.geojson',
    ),

  /*
    New CMC master-folder layer catalog.

    The backend only returns layers the current user may access.
  */
  cmcLayers: () =>
    apiData<{
      layers: Array<{
        key: string
        label: string
        access:
          | 'PUBLIC'
          | 'INTERNAL'
        geometryType: string
      }>
    }>(
      '/map/cmc/layers',
    ),

  /*
    Returns an authenticated backend URL for a specific
    converted CMC GeoJSON layer.

    fetchJsonResource() automatically sends credentials
    for URLs that begin with API_BASE_URL.
  */
  cmcLayerUrl(
    key: CmcLayerKey,
  ) {
    return apiUrl(
      `/map/cmc/layers/${encodeURIComponent(
        key,
      )}`,
    )
  },
}
