/**
 * Excursions — day-trips OFF the main round route.
 *
 * These are NOT part of routeOrder (the closed Tokio→…→Tokio loop): they are
 * marked separately on the global map (own marker + dashed line from the base
 * city) so the main route stays undistorted.
 *
 * - Shirakawa-go: excursión sin maletas desde Takayama (día 17).
 * - Hiroshima: excursión de día desde Osaka (día 24).
 * - Nara: excursión de día desde Osaka.
 */

import type { Excursion } from './types'

export const excursions: readonly Excursion[] = [
  {
    id: 'shirakawago',
    fromSlug: 'takayama',
    toSlug: 'shirakawago',
    label: 'Excursión a Shirakawa-go',
  },
  {
    id: 'hiroshima',
    fromSlug: 'osaka',
    toSlug: 'hiroshima',
    label: 'Excursión a Hiroshima',
  },
  {
    id: 'nara',
    fromSlug: 'osaka',
    toSlug: 'nara',
    label: 'Excursión a Nara',
  },
] as const
