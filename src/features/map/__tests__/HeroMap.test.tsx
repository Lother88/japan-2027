/**
 * HeroMap — una sola instancia de MapLibre: al cambiar de tema cambia el estilo
 * (setStyle) en vez de destruir y recrear el mapa (que dejaba el lienzo vacío dentro
 * de la View Transition del tema).
 */
import { render, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import type { StyleSpecification } from 'maplibre-gl'
import HeroMap from '@/features/map/HeroMap'
import { ThemeModeContext, type ThemeMode } from '@/features/landing/useThemeMode'
import { ROUTE_COLORS } from '@/features/map/basemap'

const h = vi.hoisted(() => ({
  maps: [] as Array<{ styles: unknown[]; removed: number; options: Record<string, unknown> }>,
  markers: 0,
}))

vi.mock('maplibre-gl', () => {
  class FakeMap {
    styles: unknown[] = []
    removed = 0
    options: Record<string, unknown>
    cooperativeGestures = { enable() {}, disable() {} }
    constructor(options: Record<string, unknown>) {
      this.options = options
      if (options.style) this.styles.push(options.style)
      h.maps.push(this)
    }
    on() { return this }
    once() { return this }
    addControl() { return this }
    fitBounds() {}
    resize() {}
    setStyle(style: unknown) {
      this.styles.push(style)
      return this
    }
    remove() {
      this.removed++
    }
  }
  class FakeMarker {
    constructor() {
      h.markers++
    }
    setLngLat() { return this }
    addTo() { return this }
  }
  class FakeLngLatBounds {
    extend() { return this }
  }
  return {
    default: { Map: FakeMap, Marker: FakeMarker, NavigationControl: class {}, LngLatBounds: FakeLngLatBounds },
  }
})

/** Estilo del proveedor simulado: el fondo delata qué URL se pidió. */
function fakeProviderStyle(url: string): StyleSpecification {
  return {
    version: 8,
    sources: {},
    layers: [{ id: 'background', type: 'background', paint: { 'background-color': url } }],
  }
}

const fetchMock = vi.fn(async (url: string) => ({ ok: true, json: async () => fakeProviderStyle(url) }))

beforeEach(() => {
  h.maps.length = 0
  h.markers = 0
  fetchMock.mockClear()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function ui(mode: ThemeMode) {
  return (
    <ThemeModeContext.Provider value={{ mode, toggle: () => {} }}>
      <HeroMap expanded={false} onToggleExpand={() => {}} />
    </ThemeModeContext.Provider>
  )
}

/** Color de la ruta en el último estilo aplicado al mapa. */
function lastRouteColor(): unknown {
  const style = h.maps[0]?.styles.at(-1) as StyleSpecification | undefined
  const route = style?.layers.find((l) => l.id === 'route-line')
  return route?.type === 'line' ? route.paint?.['line-color'] : undefined
}

describe('HeroMap — cambio de tema sin recrear el mapa', () => {
  it('crea un único mapa y aplica el estilo del tema claro', async () => {
    render(ui('light'))
    await waitFor(() => expect(lastRouteColor()).toBe(ROUTE_COLORS.light))
    expect(h.maps).toHaveLength(1)
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain('openfreemap.org/styles/positron')
  })

  it('al pasar a oscuro cambia el estilo de la misma instancia (sin remove ni markers nuevos)', async () => {
    const { rerender } = render(ui('light'))
    await waitFor(() => expect(lastRouteColor()).toBe(ROUTE_COLORS.light))
    const markersBefore = h.markers

    rerender(ui('dark'))
    await waitFor(() => expect(lastRouteColor()).toBe(ROUTE_COLORS.dark))

    expect(h.maps).toHaveLength(1)
    expect(h.maps[0].removed).toBe(0)
    expect(h.markers).toBe(markersBefore)
  })

  it('un cambio de tema rápido no deja aplicado un estilo antiguo', async () => {
    const { rerender } = render(ui('light'))
    rerender(ui('dark'))
    await waitFor(() => expect(lastRouteColor()).toBe(ROUTE_COLORS.dark))
    // Deja resolver cualquier promesa pendiente del tema claro.
    await new Promise((r) => setTimeout(r, 0))
    expect(lastRouteColor()).toBe(ROUTE_COLORS.dark)
  })

  it('desmontar elimina el mapa una vez', async () => {
    const { unmount } = render(ui('light'))
    await waitFor(() => expect(h.maps).toHaveLength(1))
    unmount()
    expect(h.maps[0].removed).toBe(1)
  })
})
