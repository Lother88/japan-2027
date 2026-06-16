/**
 * Geo helpers — GeoJSON utilities
 *
 * buildRouteLineString: produces a GeoJSON Feature<LineString> from cities + routeOrder.
 * Coordinates always in [lng, lat] order (GeoJSON convention).
 */

import type { City, LngLat } from '@/data/types'

export interface LineStringFeature {
  type: 'Feature'
  geometry: {
    type: 'LineString'
    coordinates: [number, number][]
  }
  properties: Record<string, unknown>
}

/**
 * Build a GeoJSON LineString Feature from ordered city slugs.
 *
 * @param cities - full list of cities
 * @param routeOrder - slugs in travel order (closed: last === first for round trip)
 * @returns GeoJSON Feature<LineString> with [lng, lat] coordinates
 */
export function buildRouteLineStringFromCities(
  cities: readonly City[],
  routeOrder: readonly string[],
): LineStringFeature {
  const cityMap = new Map(cities.map(c => [c.slug, c]))

  const coordinates: [number, number][] = routeOrder
    .map(slug => cityMap.get(slug)?.center)
    .filter((c): c is LngLat => c !== undefined)
    .map(([lng, lat]) => [lng, lat])

  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates,
    },
    properties: {},
  }
}
