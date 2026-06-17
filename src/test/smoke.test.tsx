/**
 * Smoke test de la landing — valida que la app monta sin romperse.
 * Mockea maplibre-gl (no hay WebGL en jsdom).
 */
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import App from '@/App'

vi.mock('maplibre-gl', () => {
  class FakeMap {
    on() { return this }
    addControl() { return this }
    addSource() {}
    addLayer() {}
    fitBounds() {}
    remove() {}
  }
  class FakeMarker {
    setLngLat() { return this }
    addTo() { return this }
  }
  class FakeNavigationControl {}
  class FakeLngLatBounds {
    extend() { return this }
  }
  return {
    default: {
      Map: FakeMap,
      Marker: FakeMarker,
      NavigationControl: FakeNavigationControl,
      LngLatBounds: FakeLngLatBounds,
    },
  }
})

describe('Landing — smoke test', () => {
  it('renderiza el hero con el título Japón', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Japón')
  })

  it('renderiza el contenido principal del journey', () => {
    render(<App />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
