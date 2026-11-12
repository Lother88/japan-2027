/**
 * Excursions — day-trips OFF the main round route.
 *
 * These are NOT part of routeOrder (the closed Tokio→…→Tokio loop): they are
 * marked separately on the global map (own marker + dashed line from the base
 * city) so the main route stays undistorted.
 *
 * - Shirakawa-go: excursión sin maletas desde Takayama (lun 17, antes del tren a Kioto).
 * - Nara: tarde del vie 21, ida y vuelta desde Namba (Osaka) tras dejar las maletas.
 * - Katsuo-ji: mañana del sáb 22, desde Osaka.
 * - Hiroshima: excursión de día desde Osaka (dom 23).
 *
 * Orden = orden de los días. routeStops.ts cuelga cada una de su estancia base según el
 * primer día con una zona de la ciudad destino (Zone.citySlug === toSlug).
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
    id: 'nara',
    fromSlug: 'osaka',
    toSlug: 'nara',
    label: 'Excursión a Nara',
  },
  {
    id: 'katsuoji',
    fromSlug: 'osaka',
    toSlug: 'katsuoji',
    label: 'Excursión a Katsuo-ji',
  },
  {
    id: 'hiroshima',
    fromSlug: 'osaka',
    toSlug: 'hiroshima',
    label: 'Excursión a Hiroshima',
  },
] as const
