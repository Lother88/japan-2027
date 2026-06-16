/**
 * Route definition — ordered city slugs for the round trip
 *
 * NOTE: Kanazawa ↔ Takayama order is provisional (Open Question 5 from design.md).
 * Changing this array re-traces the route on the map without touching any component.
 *
 * The route is closed: last slug === first slug (Tokio → ... → Tokio).
 */

export const routeOrder: readonly string[] = [
  'tokio',
  'takaragawa',
  'kanazawa',       // provisional order — may swap with takayama
  'takayama',
  'kioto',
  'osaka',
  'tokio',          // closed round trip — Narita exit
] as const
