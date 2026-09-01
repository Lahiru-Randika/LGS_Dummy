/**
 * Keep imagery/GIS source definitions centralized as LGS expands to more areas.
 * A future backend can return the same shape for every municipality/estate.
 */
export type RasterAreaSource = {
  id: string
  label: string
  tileUrl: string
  minZoom?: number
  maxZoom?: number
  bounds?: [number, number, number, number]
}

export const configuredRasterAreas: RasterAreaSource[] = import.meta.env.VITE_DRONE_TILE_URL
  ? [{
      id: 'primary-drone-area',
      label: 'Primary drone imagery',
      tileUrl: import.meta.env.VITE_DRONE_TILE_URL,
      minZoom: 14,
      maxZoom: 22,
    }]
  : []
