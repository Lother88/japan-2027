/**
 * Data integrity tests — anti-spoiler + itinerary/zone consistency
 *
 * NOSPOIL-01: No zone has a `description` field
 * GEO-01: All zone coordinates are in Japan bounding box [lng, lat]
 * REF-01: Every zoneId referenced in itinerary exists in zones
 */

import { zones } from '../zones'
import { itinerary } from '../itinerary'
import { getZone } from '../index'

// Japan bounding box (loose)
const JAPAN_LNG = { min: 122, max: 154 }
const JAPAN_LAT = { min: 24, max: 46 }

describe('Anti-spoiler: no zone has a description field', () => {
  it('all zones lack a description field', () => {
    zones.forEach(zone => {
      expect('description' in zone).toBe(false)
    })
  })
})

describe('Coordinates: all zones have valid Japan [lng, lat]', () => {
  it('all zone coordinates are in Japan bounding box', () => {
    zones.forEach(zone => {
      const [lng, lat] = zone.coordinates
      expect(lng).toBeGreaterThanOrEqual(JAPAN_LNG.min)
      expect(lng).toBeLessThanOrEqual(JAPAN_LNG.max)
      expect(lat).toBeGreaterThanOrEqual(JAPAN_LAT.min)
      expect(lat).toBeLessThanOrEqual(JAPAN_LAT.max)
    })
  })

  it('all zone coordinates have exactly 2 elements', () => {
    zones.forEach(zone => {
      expect(zone.coordinates).toHaveLength(2)
    })
  })
})

describe('Itinerary integrity: every zoneId referenced exists in zones', () => {
  // Collect every zoneId referenced across all days and slots
  const allReferencedZoneIds: string[] = []

  for (const day of itinerary) {
    for (const slot of day.slots) {
      for (const ref of slot.zones) {
        allReferencedZoneIds.push(ref.zoneId)
      }
    }
  }

  const uniqueIds = [...new Set(allReferencedZoneIds)]

  it('itinerary references at least one zone', () => {
    expect(uniqueIds.length).toBeGreaterThan(0)
  })

  it.each(uniqueIds)('zone "%s" exists in zones array', (zoneId) => {
    const zone = getZone(zoneId)
    expect(zone).toBeDefined()
  })
})
