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

/** Time slot keys — union literal (NOT enum) */
export type SlotKey = 'morning' | 'afternoon'

// ── City ────────────────────────────────────────────────────────────────────

export interface City {
  readonly slug: string       // 'tokio', 'kioto', 'osaka', 'kanazawa'...
  readonly name: string       // 'Tokio'
  readonly center: LngLat     // map center for encuadre [lng, lat]
}

// ── Zone references ─────────────────────────────────────────────────────────

/** Lightweight reference to a Zone from within the itinerary (avoids duplication) */
export interface ZoneRef {
  readonly zoneId: string     // → Zone.id
}

// ── Itinerary ────────────────────────────────────────────────────────────────

/** Practical logistics info — no narrative, no spoilers */
export interface ZonePractical {
  readonly access?: string                  // 'JR Yamanote — salida Hachiko'
  readonly hours?: string                   // 'Tiendas 10:00–21:00 (orientativo)'
  readonly logistics?: readonly string[]    // ['Combina con Harajuku a 15 min a pie']
}

/**
 * Morning or afternoon block within a Day.
 * `summary` describes category/context — NOT what you'll see (anti-spoiler).
 */
export interface TimeSlot {
  readonly key: SlotKey
  readonly label: string        // 'Mañana' | 'Tarde'
  readonly summary: string      // category/context brief, no spoilers
  readonly zones: readonly ZoneRef[]
}

/** Single day in the itinerary */
export interface Day {
  readonly id: number             // 1..21 (stable; route /dia/:dayId)
  readonly date: string           // ISO 'YYYY-MM-DD' (2027-05-09 ...)
  readonly citySlug: string       // → City.slug
  readonly title: string          // 'Tokio · bloque 1 — Llegada'
  readonly slots: readonly TimeSlot[]   // normally [morning, afternoon]
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
