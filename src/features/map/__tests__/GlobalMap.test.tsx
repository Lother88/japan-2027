/**
 * Tests for GlobalMap (TDD)
 * Satisfies MAP-01, MAP-02, MAP-03, MAP-05, NOSPOIL-02
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

  it('renders one marker per city in routeOrder (MAP-01, MAP-02)', () => {
    renderGlobalMap()
    // routeOrder includes 'tokio' twice (start + end) — unique cities
    const uniqueCities = [...new Set(routeOrder)]
    const markers = screen.getAllByTestId('mock-marker')
    expect(markers).toHaveLength(uniqueCities.length)
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

  it('renders a GeoJSON Source with LineString data (MAP-03)', () => {
    renderGlobalMap()
    const source = screen.getByTestId('mock-source')
    expect(source).toBeInTheDocument()
    const dataStr = source.getAttribute('data-source-data')
    expect(dataStr).toBeTruthy()
    const data = JSON.parse(dataStr!) as { geometry?: { type?: string } }
    expect(data.geometry?.type).toBe('LineString')
  })

  it('renders a Layer for the route line (MAP-03)', () => {
    renderGlobalMap()
    expect(screen.getByTestId('mock-layer')).toBeInTheDocument()
  })

  it('does NOT render content that reveals trip narrative (NOSPOIL-02)', () => {
    renderGlobalMap()
    // No description text in the map component
    expect(screen.queryByText(/descripción/i)).not.toBeInTheDocument()
  })
})
