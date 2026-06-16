/**
 * City data — geocoded centers [lng, lat] (GeoJSON order)
 *
 * Coordinates are approximate public centers, sufficient for map encuadre.
 * Sources: Wikipedia, OpenStreetMap, Google Maps public data.
 *
 * Note: Kanazawa ↔ Takayama order in routeOrder is provisional (Open Question 5).
 */

import type { City } from './types'

export const cities: readonly City[] = [
  {
    slug: 'tokio',
    name: 'Tokio',
    center: [139.6917, 35.6895], // Tokyo Station area
  },
  {
    slug: 'takaragawa',
    name: 'Takaragawa (Minakami)',
    center: [138.9950, 36.6830], // Minakami / Takaragawa Onsen area
  },
  {
    slug: 'kanazawa',
    name: 'Kanazawa',
    center: [136.6256, 36.5613], // Kanazawa city center
  },
  {
    slug: 'takayama',
    name: 'Takayama',
    center: [137.2521, 36.1461], // Takayama city center
  },
  {
    slug: 'shirakawago',
    name: 'Shirakawa-go',
    center: [136.9059, 36.2574], // Ogimachi village
  },
  {
    slug: 'kioto',
    name: 'Kioto',
    center: [135.7681, 35.0116], // Kyoto Station area
  },
  {
    slug: 'osaka',
    name: 'Osaka',
    center: [135.5023, 34.6937], // Osaka city center / Namba area
  },
] as const
