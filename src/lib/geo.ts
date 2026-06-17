/**
 * Geo helpers — GeoJSON utilities
 *
 * buildRouteLineString: produces a GeoJSON Feature<LineString> from cities + routeOrder.
 * Coordinates always in [lng, lat] order (GeoJSON convention).
 */

import type { City, Excursion, LngLat } from '@/data/types'

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

/**
 * Build one GeoJSON LineString Feature per excursion (base city → destination).
 * Each feature carries { kind: 'excursion', id, label } in properties so the
 * map can style it (dashed line, distinct color) apart from the main route.
 * Excursions whose cities are missing are skipped.
 */
export function buildExcursionLineStrings(
  cities: readonly City[],
  excursions: readonly Excursion[],
): LineStringFeature[] {
  const cityMap = new Map(cities.map(c => [c.slug, c]))

  return excursions
    .map(ex => {
      const from = cityMap.get(ex.fromSlug)?.center
      const to = cityMap.get(ex.toSlug)?.center
      if (!from || !to) return undefined
      const coordinates: [number, number][] = [
        [from[0], from[1]],
        [to[0], to[1]],
      ]
      const feature: LineStringFeature = {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates },
        properties: { kind: 'excursion', id: ex.id, label: ex.label },
      }
      return feature
    })
    .filter((f): f is LineStringFeature => f !== undefined)
}
