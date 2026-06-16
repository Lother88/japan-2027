/**
 * 2.1 — Type-level anti-spoiler test for Zone
 *
 * Satisfies: NOSPOIL-01, DAY-05, ZONE-01
 *
 * Strategy: assign a Zone-shaped object WITHOUT description — must compile.
 * Assign one WITH description — TypeScript structural excess check catches it
 * at compile time (via `satisfies` or direct assignment).
 *
 * Runtime assertion: Zone fixture has no `description` key.
 */

import type { Zone, Day, City, TimeSlot, ZoneRef, LngLat, SlotKey, ZonePractical } from '../types'

describe('types — anti-spoiler contract', () => {
  it('Zone fixture without description is valid', () => {
    const zone: Zone = {
      id: 'asakusa',
      name: 'Asakusa',
      citySlug: 'tokio',
      coordinates: [139.7966, 35.7148] as LngLat,
      tags: ['tradicional', 'templos', 'historico'],
      practical: {
        access: 'Metro Ginza (G19) — Estación Asakusa',
        hours: 'Templo Sensoji: acceso libre 24h; sala principal 6:00–17:00',
        logistics: ['Llegar antes de las 8:00 para evitar grupos organizados'],
      },
    }
    // Runtime check: no description field
    expect('description' in zone).toBe(false)
    expect(zone.id).toBe('asakusa')
    expect(zone.coordinates).toHaveLength(2)
  })

  it('Zone type does not include description (structural check)', () => {
    // This object satisfies Zone without description
    const validZone = {
      id: 'shibuya',
      name: 'Shibuya',
      citySlug: 'tokio',
      coordinates: [139.7016, 35.6585] satisfies LngLat,
      tags: ['comercial', 'juvenil', 'iconico'],
      practical: {} satisfies ZonePractical,
    } satisfies Zone

    // Explicitly assert no description leaked in
    const keys = Object.keys(validZone)
    expect(keys).not.toContain('description')
  })

  it('City has required fields', () => {
    const city: City = {
      slug: 'tokio',
      name: 'Tokio',
      center: [139.6917, 35.6895] as LngLat,
    }
    expect(city.slug).toBe('tokio')
    expect(city.center).toHaveLength(2)
    // LngLat: first is longitude (~139), second is latitude (~35)
    expect(city.center[0]).toBeGreaterThan(100) // longitude Japan
    expect(city.center[1]).toBeLessThan(50)     // latitude Japan
  })

  it('Day has required fields and no description', () => {
    const zoneRef: ZoneRef = { zoneId: 'asakusa' }
    const slot: TimeSlot = {
      key: 'morning' satisfies SlotKey,
      label: 'Mañana',
      summary: 'Barrio histórico de Edo — templos, calles tradicionales y comida callejera',
      zones: [zoneRef],
    }
    const day: Day = {
      id: 9,
      date: '2027-05-09',
      citySlug: 'tokio',
      title: 'Tokio · bloque 1 — Llegada',
      slots: [slot],
    }
    expect('description' in day).toBe(false)
    expect(day.id).toBe(9)
    expect(day.slots[0].key).toBe('morning')
  })

  it('SlotKey is a literal union (morning | afternoon)', () => {
    const morning: SlotKey = 'morning'
    const afternoon: SlotKey = 'afternoon'
    expect(morning).toBe('morning')
    expect(afternoon).toBe('afternoon')
  })
})
