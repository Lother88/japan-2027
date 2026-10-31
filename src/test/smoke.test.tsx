/**
 * Smoke test de la landing — valida que la app monta sin romperse y que tiene los
 * landmarks básicos (main, skip-link). Mockea maplibre-gl (no hay WebGL en jsdom).
 */
import { render, screen, within } from '@testing-library/react'
import { vi } from 'vitest'
import App from '@/App'

vi.mock('maplibre-gl', () => {
  class FakeMap {
    cooperativeGestures = { enable() {}, disable() {} }
    on() { return this }
    once() { return this }
    addControl() { return this }
    fitBounds() {}
    resize() {}
    setStyle() { return this }
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

// El mapa pide su estilo base por red: en tests se responde con un estilo vacío.
beforeEach(() => {
  vi.stubGlobal('fetch', async () => ({ ok: true, json: async () => ({ version: 8, sources: {}, layers: [] }) }))
})
afterEach(() => vi.unstubAllGlobals())

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

describe('Landing — landmarks y skip-link', () => {
  it('un único <main> envuelve el hero y el itinerario', () => {
    render(<App />)
    const main = screen.getByRole('main')
    expect(within(main).getByRole('heading', { level: 1 })).toHaveTextContent('Japón')
    expect(main.querySelector('[data-journey]')).not.toBeNull()
  })

  it('el skip-link es el primer elemento enfocable y apunta al itinerario dentro de <main>', () => {
    const { container } = render(<App />)
    const skip = screen.getByRole('link', { name: /saltar al itinerario/i })
    expect(container.querySelector('a[href], button')).toBe(skip)
    const id = skip.getAttribute('href')?.slice(1) ?? ''
    const target = document.getElementById(id)
    expect(target).not.toBeNull()
    expect(screen.getByRole('main')).toContainElement(target)
  })

  it('el aviso «Desplázate» es un botón', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /desplázate/i })).toBeInTheDocument()
  })
})

describe('Landing — portada isométrica (fase 2)', () => {
  it('sin el canvas de pétalos ni las decoraciones día/noche de HeroDecor', () => {
    const { container } = render(<App />)
    expect(container.querySelector('canvas')).toBeNull()
    expect(container.querySelector('[data-day-decor], [data-night-decor]')).toBeNull()
  })

  it('la banda «La ruta» va dentro de <main>, entre el hero y el itinerario', () => {
    render(<App />)
    const main = screen.getByRole('main')
    const route = within(main).getByRole('region', { name: 'La ruta' })
    const journey = main.querySelector('[data-journey]') as Element
    const hero = within(main).getByRole('heading', { level: 1 })
    expect(hero.compareDocumentPosition(route) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(route.compareDocumentPosition(journey) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
