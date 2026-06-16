/**
 * Data barrel — exports all domain data and lookup helpers
 *
 * Helpers are pure functions: no side effects, easily testable.
 * They operate on the static data arrays imported here.
 */

export { cities } from './cities'
export { itinerary } from './itinerary'
export { zones } from './zones'
export { routeOrder } from './route'
export type { City, Day, Zone, ZoneRef, TimeSlot, ZonePractical, LngLat, SlotKey } from './types'

import { cities } from './cities'
import { itinerary } from './itinerary'
import { zones } from './zones'
import { routeOrder } from './route'
import { buildRouteLineStringFromCities } from '@/lib/geo'
import type { City, Day, Zone } from './types'

// ── Lookup helpers ───────────────────────────────────────────────────────────

/** Get a Day by its numeric id (1..21). Returns undefined if not found. */
export function getDay(id: number): Day | undefined {
  return itinerary.find(d => d.id === id)
}

/** Get a Zone by its string id. Returns undefined if not found. */
export function getZone(id: string): Zone | undefined {
  return zones.find(z => z.id === id)
}

/** Get a City by its slug. Returns undefined if not found. */
export function getCity(slug: string): City | undefined {
  return cities.find(c => c.slug === slug)
}

/** Get all zones belonging to a city. Returns [] if city not found. */
export function zonesByCity(citySlug: string): Zone[] {
  return zones.filter(z => z.citySlug === citySlug)
}

/**
 * Get all zones referenced in a given day (across all time slots).
 * Returns [] if day not found.
 */
export function zonesForDay(dayId: number): Zone[] {
  const day = getDay(dayId)
  if (!day) return []

  const zoneIds = day.slots.flatMap(slot => slot.zones.map(zr => zr.zoneId))
  return zoneIds
    .map(id => getZone(id))
    .filter((z): z is Zone => z !== undefined)
}

/**
 * Build the GeoJSON LineString for the full route.
 * Uses routeOrder from route.ts and cities.ts centers.
 */
export function buildRouteLineString() {
  return buildRouteLineStringFromCities(cities, routeOrder)
}
