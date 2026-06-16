/**
 * Map style configuration for GlobalMap and ZoneMiniMap.
 *
 * Uses OpenFreeMap Liberty style as base (no API key, no billing).
 * Style URL confirmed: https://openfreemap.org/quick_start/
 *   → https://tiles.openfreemap.org/styles/liberty
 *
 * Satisfies MAP-04 (free tiles, no key).
 * ADR-001: tiles confined to features/map, data stays agnostic.
 */

/** Base map style URL — OpenFreeMap Liberty (vector tiles, free, no API key) */
export const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'

/** Initial view state centered on Japan to show the full route */
export const JAPAN_VIEW_STATE = {
  longitude: 137.5,
  latitude: 36.5,
  zoom: 5.2,
} as const
