import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  searchPlaces,
  type PlaceSearchResult,
} from '../../../services/osmGeocoding'
import type {
  LocalSearchFeature,
  MapSearchResult,
} from '../types'

export function useMapSearch(
  localSearchFeatures:
    LocalSearchFeature[],
) {
  const [
    osmSearchResults,
    setOsmSearchResults,
  ] = useState<
    PlaceSearchResult[]
  >([])

  const [
    search,
    setSearch,
  ] = useState('')

  const [
    searchLoading,
    setSearchLoading,
  ] = useState(false)

  const localFiltered =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase()

      if (!query) {
        return []
      }

      return localSearchFeatures
        .filter((feature) =>
          `${feature.title} ${feature.subtitle} ${feature.id}`
            .toLowerCase()
            .includes(query),
        )
        .slice(0, 4)
    }, [
      search,
      localSearchFeatures,
    ])

  useEffect(() => {
    const query =
      search.trim()

    if (query.length < 3) {
      setOsmSearchResults([])
      setSearchLoading(false)
      return
    }

    const abort =
      new AbortController()

    const timeout =
      window.setTimeout(
        async () => {
          try {
            setSearchLoading(true)

            const results =
              await searchPlaces(
                query,
                abort.signal,
              )

            if (
              abort.signal.aborted
            ) {
              return
            }

            setOsmSearchResults(
              results,
            )
          } catch (error) {
            if (
              error instanceof
                DOMException &&
              error.name ===
                'AbortError'
            ) {
              return
            }

            console.warn(
              'Map search failed.',
              error,
            )
          } finally {
            if (
              !abort.signal.aborted
            ) {
              setSearchLoading(false)
            }
          }
        },
        500,
      )

    return () => {
      window.clearTimeout(
        timeout,
      )
      abort.abort()
    }
  }, [search])

  const searchResults:
    MapSearchResult[] =
    useMemo(() => {
      const remote =
        osmSearchResults.map(
          (result) => ({
            id: result.id,
            title: result.name,
            subtitle:
              result.shortAddress ||
              result.displayName,
            latitude:
              result.latitude,
            longitude:
              result.longitude,
            source:
              'osm' as const,
            category:
              result.category,
            type:
              result.type,
          }),
        )

      return [
        ...remote,
        ...localFiltered,
      ].slice(0, 9)
    }, [
      osmSearchResults,
      localFiltered,
    ])

  return {
    osmSearchResults,
    setOsmSearchResults,
    search,
    setSearch,
    searchLoading,
    searchResults,
  }
}
