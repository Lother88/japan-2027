/**
 * Domain types for itinerary-web
 *
 * Constraints (TS6):
 * - NO enum (erasableSyntaxOnly) → use `as const` unions
 * - `import type` mandatory for type-only imports
 * - Zone deliberately has NO `description` field (anti-spoiler — NOSPOIL-01)
 * - LngLat order: ALWAYS [longitude, latitude] (GeoJSON convention)
 */

// ── Primitives ──────────────────────────────────────────────────────────────

/** GeoJSON coordinate tuple — ALWAYS [longitude, latitude] */
export type LngLat = readonly [number, number]

// ── City ────────────────────────────────────────────────────────────────────

export interface City {
  readonly slug: string       // 'tokio', 'kioto', 'osaka', 'kanazawa'...
  readonly name: string       // 'Tokio'
  readonly center: LngLat     // map center for encuadre [lng, lat]
}

// ── Transfers (trayectos entre ciudades / localizaciones) ────────────────────

/** Transport mode for a transfer leg — union literal (NOT enum) */
export type TransferMode =
  | 'shinkansen'
  | 'tren'
  | 'bus'
  | 'avion'
  | 'ferry'
  | 'pie'
  | 'coche'

/**
 * A transfer leg between two locations (inter-city move or day-trip round trip).
 * Pure logistics — NO spoilers. Rendered at the top of a Day, before the steps.
 * A day can have 0..n legs (e.g. Kioto → Nara → Osaka has two).
 */
export interface Transfer {
  readonly from: string                  // 'Tokio' | 'Takayama'
  readonly to: string                    // 'Takaragawa Onsen' | 'Kioto'
  readonly mode: TransferMode
  readonly line?: string                 // 'Hokuriku Shinkansen + JR Hida (vía Toyama)'
  readonly duration?: string             // '~2h30 + transbordo en Toyama'
  readonly roundTrip?: boolean           // true para day-trips (ida y vuelta en el día)
  readonly notes?: readonly string[]     // transbordos, equipaje, reservas, avisos
}

/**
 * A day-trip excursion OFF the main round route (e.g. Shirakawa-go, Hiroshima).
 * Rendered on the global map as a separate marker + dashed line from its base
 * city, so the closed round-trip route (routeOrder) stays undistorted.
 */
export interface Excursion {
  readonly id: string          // 'shirakawago' | 'nara' | 'hiroshima' | 'katsuoji'
  readonly fromSlug: string    // base city slug (→ City.slug)
  readonly toSlug: string      // destination slug (→ City.slug)
  readonly label: string       // 'Excursión a Shirakawa-go'
}

// ── Itinerary ────────────────────────────────────────────────────────────────

/** Practical logistics info — no narrative, no spoilers */
export interface ZonePractical {
  readonly access?: string                  // 'JR Yamanote — salida Hachiko'
  readonly hours?: string                   // 'Tiendas 10:00–21:00 (orientativo)'
  readonly logistics?: readonly string[]    // ['Combina con Harajuku a 15 min a pie']
}

// ── Steps (hour-by-hour plan of a day) ──────────────────────────────────────

/** Kind of step — union literal (NOT enum) */
export type StepType = 'visita' | 'comida' | 'traslado' | 'compras' | 'descanso' | 'noche'

/**
 * One step of the day plan (orientative time + logistic label).
 * ANTI-SPOILER (NOSPOIL-04): `label` is place name + action or time, never what
 * you will see or experience inside.
 */
export interface Step {
  readonly time: string          // '09:30' | 'mañana' | 'tarde' | 'noche'
  readonly label: string         // 'Museo Nacional de Tokio (apertura)'
  readonly type: StepType
  readonly zoneId?: string       // → Zone.id
  readonly maps?: string         // Google Maps search text
  readonly optional?: boolean    // optional step (e.g. depends on a festival)
  readonly reserve?: boolean     // needs a booking in advance
}

/**
 * Why a day is planned on that weekday / at that time — union literal (NOT enum).
 * - cierre: closing day or fixed date (market, festival)
 * - laborable: weekday, less local tourism
 * - oleada: "first wave" — arrive before the crowds
 * - finde: weekend gives something (pedestrian street, more buses)
 */
export type DayRule = 'cierre' | 'laborable' | 'oleada' | 'finde'

/** Single day in the itinerary */
export interface Day {
  readonly id: number             // 8..28 = day of month (stable; anchor #dia-NN)
  readonly date: string           // ISO 'YYYY-MM-DD' (2027-05-08 ... 2027-05-28)
  readonly citySlug: string       // → City.slug (city where you sleep that night / base city)
  readonly title: string          // 'Tokio · bloque 1 — Llegada a Tokio' (UI takes the text after the last '—')
  readonly transfers?: readonly Transfer[]   // inter-city / day-trip legs (optional, ordered)
  readonly steps: readonly Step[]            // hour-by-hour plan (source of truth for the day)
  readonly notes?: readonly string[]         // logistic notes (closures, tickets, cash...)
  readonly rules?: readonly DayRule[]        // planning criteria applied to this day
  readonly laundry?: boolean                 // laundry day (coin laundry at the hotel)
  readonly hotelId?: string                  // → Hotel.id (where you sleep that night)
}

// ── Hotels & reservations ───────────────────────────────────────────────────

/** Hotel stay (zone / area chosen; the actual hotel is booked separately) */
export interface Hotel {
  readonly id: string                    // 'tokio1' | 'kanazawa' ...
  readonly citySlug: string              // → City.slug
  readonly area: string                  // 'Ueno' | 'Shichijō (línea Keihan)'
  readonly checkIn: string               // ISO date
  readonly checkOut: string              // ISO date
  readonly nights: number
  readonly maps: string                  // Google Maps search text
  readonly laundry: boolean              // coin laundry required at the hotel
  readonly reasons?: readonly string[]   // why this area (logistics only)
}

/** Something that must be booked in advance */
export interface Reservation {
  readonly what: string                  // 'Shibuya Sky (franja del atardecer)'
  readonly how: string                   // 'Online, ~2 semanas antes'
  readonly date: string                  // ISO date of the day it is used
  readonly dayId: number                 // → Day.id
}

/**
 * Zone (neighbourhood / site) — the core content unit.
 *
 * IMPORTANT: NO `description` field by design.
 * The TypeScript type itself enforces the no-spoilers rule (NOSPOIL-01):
 * any consumer trying to add/read `description` will get a compile error.
 */
export interface Zone {
  readonly id: string             // 'shibuya', 'asakusa', 'gion-centro'...
  readonly name: string           // 'Shibuya'
  readonly citySlug: string       // → City.slug
  readonly coordinates: LngLat    // [lng, lat] — optional mini-map (ZONE-03)
  readonly tags: readonly string[]        // ['comercial', 'otaku', 'iconico']
  readonly practical: ZonePractical       // logistics, NO spoilers
}
