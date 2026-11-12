/**
 * Route definition — ordered city slugs for the round trip
 *
 * Kanazawa → Takayama order is decided (Kanazawa first; see docs/revision-itinerario-fechas-2027.md).
 * Changing this array re-traces the route on the map without touching any component.
 * Day-trips (Shirakawa-go, Nara, Katsuo-ji, Hiroshima) live in excursions.ts, not here.
 *
 * The route is closed: last slug === first slug (Tokio → ... → Tokio).
 */

export const routeOrder: readonly string[] = [
  'tokio',
  'takaragawa',
  'kanazawa',
  'takayama',
  'kioto',
  'osaka',
  'tokio',          // closed round trip — Narita exit
] as const
