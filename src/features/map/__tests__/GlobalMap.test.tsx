/**
 * Tests for GlobalMap (TDD)
 * Satisfies MAP-01, MAP-02, MAP-03, MAP-05, NOSPOIL-02
 * + excursion markers and dashed lines (Shirakawa-go, Hiroshima)
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { cities, routeOrder } from '@/data'
import GlobalMap from '../GlobalMap'

vi.mock('@vis.gl/react-maplibre', () => import('@/test/maplibre-mock'))

function renderGlobalMap() {
  return render(
    <MemoryRouter>
      <GlobalMap />
    </MemoryRouter>,
  )
}

describe('GlobalMap', () => {
  it('renders a map container (MAP-01)', () => {
    renderGlobalMap()
    expect(screen.getByTestId('mock-map')).toBeInTheDocument()
  })

  it('renders route markers plus excursion markers (MAP-01, MAP-02)', () => {
    renderGlobalMap()
    // routeOrder unique cities + 2 excursion destinations (shirakawago, hiroshima)
    const uniqueRouteCities = [...new Set(routeOrder)]
    const markers = screen.getAllByTestId('mock-marker')
    // At minimum: route cities + excursion cities (2)
    expect(markers.length).toBeGreaterThanOrEqual(uniqueRouteCities.length + 2)
  })

  it('renders one marker per city in routeOrder (MAP-01, MAP-02)', () => {
    renderGlobalMap()
    const uniqueCities = [...new Set(routeOrder)]
    const markers = screen.getAllByTestId('mock-marker')
    // There are at least as many markers as unique route cities
    expect(markers.length).toBeGreaterThanOrEqual(uniqueCities.length)
  })

  it('each marker has correct lng/lat from cities data (MAP-02)', () => {
    renderGlobalMap()
    const uniqueCities = [...new Set(routeOrder)]
    const markers = screen.getAllByTestId('mock-marker')
    uniqueCities.forEach((slug, i) => {
      const city = cities.find(c => c.slug === slug)
      expect(city).toBeDefined()
      expect(markers[i].getAttribute('data-longitude')).toBe(String(city!.center[0]))
      expect(markers[i].getAttribute('data-latitude')).toBe(String(city!.center[1]))
    })
  })

  it('each marker has an aria-label with the city name (MAP-05)', () => {
    renderGlobalMap()
    const markers = screen.getAllByTestId('mock-marker')
    markers.forEach(marker => {
      expect(marker.getAttribute('aria-label')).toBeTruthy()
    })
  })

  it('renders a GeoJSON Source for the route with LineString data (MAP-03)', () => {
    renderGlobalMap()
    const sources = screen.getAllByTestId('mock-source')
    // Find the route source by id
    const routeSource = sources.find(s => s.getAttribute('data-source-id') === 'route')
    expect(routeSource).toBeDefined()
    const dataStr = routeSource!.getAttribute('data-source-data')
    expect(dataStr).toBeTruthy()
    const data = JSON.parse(dataStr!) as { geometry?: { type?: string } }
    expect(data.geometry?.type).toBe('LineString')
  })

  it('renders a Layer for the route line (MAP-03)', () => {
    renderGlobalMap()
    const layers = screen.getAllByTestId('mock-layer')
    const routeLayer = layers.find(l => l.getAttribute('data-layer-id') === 'route-line')
    expect(routeLayer).toBeDefined()
  })

  it('does NOT render content that reveals trip narrative (NOSPOIL-02)', () => {
    renderGlobalMap()
    expect(screen.queryByText(/descripción/i)).not.toBeInTheDocument()
  })

  // ── Excursion markers and lines ──────────────────────────────────────────

  it('renders a marker for Shirakawa-go (excursion destination)', () => {
    renderGlobalMap()
    const markers = screen.getAllByTestId('mock-marker')
    const shirakawa = cities.find(c => c.slug === 'shirakawago')!
    const shirakawaMarker = markers.find(
      m =>
        m.getAttribute('data-longitude') === String(shirakawa.center[0]) &&
        m.getAttribute('data-latitude') === String(shirakawa.center[1]),
    )
    expect(shirakawaMarker).toBeDefined()
  })

  it('renders a marker for Hiroshima (excursion destination)', () => {
    renderGlobalMap()
    const markers = screen.getAllByTestId('mock-marker')
    const hiroshima = cities.find(c => c.slug === 'hiroshima')!
    const hiroshimaMarker = markers.find(
      m =>
        m.getAttribute('data-longitude') === String(hiroshima.center[0]) &&
        m.getAttribute('data-latitude') === String(hiroshima.center[1]),
    )
    expect(hiroshimaMarker).toBeDefined()
  })

  it('renders a GeoJSON Source for excursion lines', () => {
    renderGlobalMap()
    const sources = screen.getAllByTestId('mock-source')
    const excursionSource = sources.find(s => s.getAttribute('data-source-id') === 'excursions')
    expect(excursionSource).toBeDefined()
  })

  it('renders a Layer for excursion dashed lines', () => {
    renderGlobalMap()
    const layers = screen.getAllByTestId('mock-layer')
    const excursionLayer = layers.find(l => l.getAttribute('data-layer-id') === 'excursion-lines')
    expect(excursionLayer).toBeDefined()
  })

  it('excursion markers have accessible aria-label', () => {
    renderGlobalMap()
    const markers = screen.getAllByTestId('mock-marker')
    const shirakawa = cities.find(c => c.slug === 'shirakawago')!
    const hiroshima = cities.find(c => c.slug === 'hiroshima')!
    const shirakawaMarker = markers.find(
      m => m.getAttribute('data-longitude') === String(shirakawa.center[0]),
    )
    const hiroshimaMarker = markers.find(
      m => m.getAttribute('data-longitude') === String(hiroshima.center[0]),
    )
    expect(shirakawaMarker?.getAttribute('aria-label')).toBeTruthy()
    expect(hiroshimaMarker?.getAttribute('aria-label')).toBeTruthy()
  })
})
