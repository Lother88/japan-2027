/**
 * 2.3 — Helpers test (TDD — test first)
 *
 * Tests: getDay, getZone, zonesByCity, buildRouteLineString
 * Satisfies: DAY-01 (getDay), ZONE-01 (getZone), MAP-01/MAP-02 (buildRouteLineString)
 */

import { getDay, getZone, getCity, zonesByCity, zonesForDay, buildRouteLineString } from '../index'

describe('getDay', () => {
  it('returns correct day for a valid id (day 9)', () => {
    const day = getDay(9)
    expect(day).toBeDefined()
    expect(day?.id).toBe(9)
    expect(day?.citySlug).toBe('tokio')
    expect(day?.date).toBe('2027-05-09')
  })

  it('returns correct day for day 12', () => {
    const day = getDay(12)
    expect(day).toBeDefined()
    expect(day?.id).toBe(12)
    expect(day?.citySlug).toBe('tokio')
  })

  it('returns undefined for an unknown id (99)', () => {
    expect(getDay(99)).toBeUndefined()
  })

  it('returns undefined for id 0', () => {
    expect(getDay(0)).toBeUndefined()
  })

  it('returned day has no description field', () => {
    const day = getDay(9)
    expect(day).toBeDefined()
    expect('description' in day!).toBe(false)
  })
})

describe('getZone', () => {
  it('returns correct zone for shibuya', () => {
    const zone = getZone('shibuya')
    expect(zone).toBeDefined()
    expect(zone?.id).toBe('shibuya')
    expect(zone?.citySlug).toBe('tokio')
    expect(zone?.name).toBe('Shibuya')
  })

  it('returns correct zone for asakusa', () => {
    const zone = getZone('asakusa')
    expect(zone).toBeDefined()
    expect(zone?.id).toBe('asakusa')
  })

  it('returns undefined for unknown zone', () => {
    expect(getZone('non-existent-zone-xyz')).toBeUndefined()
  })

  it('returned zone has no description field (anti-spoiler)', () => {
    const zone = getZone('shibuya')
    expect(zone).toBeDefined()
    expect('description' in zone!).toBe(false)
  })

  it('returned zone has coordinates as [lng, lat] tuple', () => {
    const zone = getZone('shibuya')
    expect(zone?.coordinates).toHaveLength(2)
    // Shibuya: lng ~139.7, lat ~35.6 — verify LngLat order
    expect(zone?.coordinates[0]).toBeGreaterThan(130) // longitude (Japan: ~130-145)
    expect(zone?.coordinates[1]).toBeGreaterThan(30)  // latitude (Japan: ~30-46)
    expect(zone?.coordinates[1]).toBeLessThan(50)
  })
})

describe('getCity', () => {
  it('returns tokio city', () => {
    const city = getCity('tokio')
    expect(city).toBeDefined()
    expect(city?.slug).toBe('tokio')
    expect(city?.name).toBe('Tokio')
  })

  it('returns undefined for unknown city', () => {
    expect(getCity('atlantis')).toBeUndefined()
  })

  it('city center has LngLat order [lng, lat]', () => {
    const city = getCity('tokio')
    // Tokyo: lng ~139.69, lat ~35.69
    expect(city?.center[0]).toBeCloseTo(139.69, 0)
    expect(city?.center[1]).toBeCloseTo(35.69, 0)
  })
})

describe('zonesByCity', () => {
  it('returns array of zones for tokio', () => {
    const zones = zonesByCity('tokio')
    expect(Array.isArray(zones)).toBe(true)
    expect(zones.length).toBeGreaterThan(0)
  })

  it('all returned zones belong to tokio', () => {
    const zones = zonesByCity('tokio')
    zones.forEach(z => expect(z.citySlug).toBe('tokio'))
  })

  it('returns empty array for unknown city', () => {
    const zones = zonesByCity('atlantis')
    expect(zones).toEqual([])
  })

  it('no zone in result has a description field (anti-spoiler)', () => {
    const zones = zonesByCity('tokio')
    zones.forEach(z => expect('description' in z).toBe(false))
  })
})

describe('zonesForDay', () => {
  it('returns zones for day 9', () => {
    const zones = zonesForDay(9)
    expect(Array.isArray(zones)).toBe(true)
    expect(zones.length).toBeGreaterThan(0)
  })

  it('returns empty array for unknown day', () => {
    expect(zonesForDay(99)).toEqual([])
  })
})

describe('buildRouteLineString', () => {
  it('produces a valid GeoJSON Feature<LineString>', () => {
    const feature = buildRouteLineString()
    expect(feature.type).toBe('Feature')
    expect(feature.geometry.type).toBe('LineString')
    expect(Array.isArray(feature.geometry.coordinates)).toBe(true)
  })

  it('has at least as many coordinates as route stops', () => {
    const feature = buildRouteLineString()
    // routeOrder has 7 entries (tokio → ... → tokio, closed loop)
    expect(feature.geometry.coordinates.length).toBeGreaterThanOrEqual(7)
  })

  it('each coordinate is [lng, lat] order (lng > 100 for Japan)', () => {
    const feature = buildRouteLineString()
    feature.geometry.coordinates.forEach(coord => {
      expect(coord).toHaveLength(2)
      expect(coord[0]).toBeGreaterThan(100) // longitude Japan
      expect(coord[1]).toBeGreaterThan(30)  // latitude Japan
      expect(coord[1]).toBeLessThan(50)
    })
  })

  it('is a closed route (last coordinate = first)', () => {
    const feature = buildRouteLineString()
    const coords = feature.geometry.coordinates
    const first = coords[0]
    const last = coords[coords.length - 1]
    expect(first[0]).toBeCloseTo(last[0], 3)
    expect(first[1]).toBeCloseTo(last[1], 3)
  })
})
