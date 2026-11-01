/**
 * Portada isométrica (fase 2): maqueta del hero en su propio chunk, tira de billete con spots,
 * banda «La ruta» con el mapa, tōrō del botón de tema y omamori del pie.
 */
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { vi } from 'vitest'
import HeroArt from '@/features/landing/HeroArt'
import HeroSpots from '@/features/landing/HeroSpots'
import Hero from '@/features/landing/Hero'
import RouteSection from '@/features/landing/RouteSection'
import ThemeToggle from '@/features/landing/ThemeToggle'
import SiteFooter from '@/features/landing/SiteFooter'
import { ThemeModeContext } from '@/features/landing/useThemeMode'
import { tripSummary } from '@/data/trip'

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
  class FakeLngLatBounds {
    extend() { return this }
  }
  return {
    default: { Map: FakeMap, Marker: FakeMarker, NavigationControl: class {}, LngLatBounds: FakeLngLatBounds },
  }
})

/** IntersectionObserver controlable desde el test (jsdom no lo implementa). */
class FakeIO {
  static instances: FakeIO[] = []
  readonly callback: IntersectionObserverCallback
  readonly options: IntersectionObserverInit
  readonly targets: Element[] = []

  constructor(cb: IntersectionObserverCallback, options: IntersectionObserverInit = {}) {
    this.callback = cb
    this.options = options
    FakeIO.instances.push(this)
  }
  observe(el: Element) {
    this.targets.push(el)
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
  fire(isIntersecting: boolean) {
    const entries = this.targets.map((target) => ({ isIntersecting, target }))
    this.callback(entries as unknown as IntersectionObserverEntry[], this as unknown as IntersectionObserver)
  }
}

/** matchMedia que responde `matches` a las consultas que contienen `fragment`. */
function stubMatchMedia(fragment: string) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes(fragment),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }))
}

beforeEach(() => {
  FakeIO.instances = []
  // El mapa pide su estilo base por red: en tests se responde con un estilo vacío.
  vi.stubGlobal('fetch', async () => ({ ok: true, json: async () => ({ version: 8, sources: {}, layers: [] }) }))
})
afterEach(() => vi.unstubAllGlobals())

describe('HeroArt — maqueta en su propio chunk', () => {
  /** Nombres de las capas, de atrás adelante (el orden del pintor no se puede tocar). */
  const LAYERS = [
    'base',
    'carp-1',
    'carp-2',
    'carp-3',
    'train',
    'glow-toro',
    'front',
    'glow-chochin-2',
    'front-canopy-beam',
    'glow-chochin-1',
    'petal',
    'front-canopy-roof',
  ]

  it('reserva la caja antes de que llegue el arte y luego apila las capas en un div.iso-hero', async () => {
    const { container } = render(<HeroArt />)
    const box = container.querySelector<HTMLElement>('[data-hero-art]')
    expect(box).not.toBeNull()
    expect(box).toHaveAttribute('aria-hidden', 'true')
    expect(box?.style.aspectRatio).toBe('1200 / 640')
    expect(box?.querySelector('svg')).toBeNull()

    await waitFor(() => expect(box?.querySelector('.iso-hero > svg.hero-layer')).not.toBeNull())
    const root = box?.querySelector<HTMLElement>('.iso-hero')
    expect(root?.tagName).toBe('DIV')
    expect(root).not.toHaveAttribute('data-crop')
    // Un único <style> compartido por todas las capas.
    expect(root?.querySelectorAll(':scope > style')).toHaveLength(1)

    const layers = [...(root?.querySelectorAll<SVGSVGElement>(':scope > svg.hero-layer') ?? [])]
    expect(layers.map((l) => [...l.classList].find((c) => c !== 'hero-layer')?.replace('hero-layer-', ''))).toEqual(
      LAYERS,
    )
    for (const layer of layers) {
      expect(layer).toHaveAttribute('viewBox', '0 0 1200 640')
      expect(layer).toHaveAttribute('preserveAspectRatio', 'xMidYMid meet')
      expect(layer).toHaveAttribute('aria-hidden', 'true')
      expect(layer).toHaveAttribute('focusable', 'false')
    }
  })

  it('en móvil (≤ 760 px) usa el viewBox recortado en todas las capas, marca data-crop y reserva su proporción', async () => {
    stubMatchMedia('760px')
    const { container } = render(<HeroArt />)
    const box = container.querySelector<HTMLElement>('[data-hero-art]')
    expect(box?.style.aspectRatio).toBe('676 / 478')
    await waitFor(() => expect(box?.querySelector('.iso-hero > svg.hero-layer')).not.toBeNull())
    expect(box?.querySelector('.iso-hero')).toHaveAttribute('data-crop', 'mobile')
    const layers = box?.querySelectorAll('.iso-hero > svg.hero-layer') ?? []
    expect(layers).toHaveLength(LAYERS.length)
    for (const layer of layers) expect(layer).toHaveAttribute('viewBox', '496 79 676 478')
  })
})

describe('HeroSpots — tira de billete', () => {
  const trip = tripSummary()

  it('cuatro casillas con cifras derivadas de los datos y su spot isométrico', async () => {
    const { container } = render(<HeroSpots />)
    const strip = screen.getByRole('list', { name: /el viaje en cifras/i })
    const cells = within(strip).getAllByRole('listitem')
    expect(cells).toHaveLength(4)
    expect(cells[0]).toHaveTextContent(`${trip.days}días`)
    expect(cells[1]).toHaveTextContent(`${trip.bases}bases`)
    expect(cells[2]).toHaveTextContent(`${trip.excursions}excursiones`)
    expect(cells[3]).toHaveTextContent(`${trip.travelers}viajeros`)

    for (const name of ['koyomi', 'machiya', 'kippu', 'maletas']) {
      await waitFor(() => expect(container.querySelector(`svg.iso-spot-${name}`), name).not.toBeNull())
      expect(container.querySelector(`svg.iso-spot-${name}`)).toHaveAttribute('aria-hidden', 'true')
    }
  })

  it('la cifra de «días» usa el ámbar de texto con AA, no --amber', () => {
    render(<HeroSpots />)
    const num = screen.getByText(String(trip.days), { selector: '[data-ticket-num]' })
    expect(num.style.color).toBe('var(--amber-text)')
  })
})

describe('Hero — portada isométrica', () => {
  it('conserva el texto real y ya no pinta las decoraciones planas ni el mapa', () => {
    const { container } = render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Japón')
    expect(screen.getByText(/Tres semanas, una vuelta/)).toBeInTheDocument()
    expect(screen.getByText('lo moderno y lo tradicional')).toBeInTheDocument()
    expect(container.querySelector('[data-day-decor], [data-night-decor], canvas')).toBeNull()
    expect(screen.queryByLabelText('Mapa de la ruta por Japón')).toBeNull()
  })

  it('el aviso «Desplázate» sigue siendo un botón y lleva el poste michishirube', async () => {
    render(<Hero />)
    const cue = screen.getByRole('button', { name: /desplázate/i })
    await waitFor(() => expect(cue.querySelector('svg.iso-spot-michishirube')).not.toBeNull())
  })

  it('el cartel del poste va en su propio <svg> apilado encima del dibujo base', async () => {
    render(<Hero />)
    const cue = screen.getByRole('button', { name: /desplázate/i })
    await waitFor(() => expect(cue.querySelector('svg[data-art-layer="board"]')).not.toBeNull())
    const svgs = [...cue.querySelectorAll('svg.iso-spot-michishirube')]
    expect(svgs).toHaveLength(2)
    const [base, board] = svgs as SVGSVGElement[]
    expect(base.getAttribute('data-art-layer')).toBeNull()
    expect(board.getAttribute('data-art-layer')).toBe('board')
    expect(board.getAttribute('viewBox')).toBe(base.getAttribute('viewBox'))
    expect(board.style.position).toBe('absolute')
    expect((board.parentElement as HTMLElement).style.position).toBe('relative')
  })

  it('el CTA lleva a la banda «La ruta»', () => {
    const scrollIntoView = vi.fn()
    render(
      <>
        <Hero />
        <section id="ruta" />
      </>,
    )
    const target = document.getElementById('ruta') as HTMLElement
    target.scrollIntoView = scrollIntoView
    fireEvent.click(screen.getByRole('button', { name: /explora la ruta/i }))
    expect(scrollIntoView).toHaveBeenCalled()
  })
})

describe('RouteSection — banda «La ruta»', () => {
  it('tiene su título, el spot de la vía y el mapa con pantalla completa', async () => {
    const { container } = render(<RouteSection />)
    const section = screen.getByRole('region', { name: 'La ruta' })
    expect(section).toHaveAttribute('id', 'ruta')
    expect(await screen.findByLabelText('Mapa de la ruta por Japón')).toBeInTheDocument()
    await waitFor(() => expect(container.querySelector('svg.iso-spot-ruta')).not.toBeNull())

    fireEvent.click(screen.getByRole('button', { name: 'Ver el mapa a pantalla completa' }))
    expect(screen.getByRole('button', { name: 'Cerrar pantalla completa del mapa' })).toBeInTheDocument()
  })

  it('la banda «Muro» solo se descarga al acercarse al viewport', async () => {
    vi.stubGlobal('IntersectionObserver', FakeIO)
    const { container } = render(<RouteSection />)
    const box = container.querySelector('[data-art="banda"]')
    expect(box).not.toBeNull()
    await act(async () => {})
    expect(box?.querySelector('svg')).toBeNull()

    const near = FakeIO.instances.find((io) => io.targets.includes(box as Element) && io.options.rootMargin)
    expect(near?.options.rootMargin).toContain('600px')
    act(() => near?.fire(true))
    await waitFor(() => expect(box?.querySelector('svg.iso-banda')).not.toBeNull())
    expect(box?.querySelector('svg.iso-banda')).toHaveAttribute('preserveAspectRatio', 'xMidYMax slice')
  })
})

describe('ThemeToggle — tōrō', () => {
  it('pinta el spot del tōrō, sin los iconos sol/luna, y conserva su nombre accesible', async () => {
    render(
      <ThemeModeContext.Provider value={{ mode: 'light', toggle: () => {} }}>
        <ThemeToggle />
      </ThemeModeContext.Provider>,
    )
    const btn = screen.getByRole('button', { name: 'Activar tema oscuro' })
    expect(btn).toHaveAttribute('title', 'Activar tema oscuro')
    expect(btn.querySelector('[data-ic-moon], [data-ic-sun]')).toBeNull()
    await waitFor(() => expect(btn.querySelector('svg.iso-spot-toro-toggle')).not.toBeNull())
  })
})

describe('SiteFooter — omamori', () => {
  it('sustituye el círculo 桜 por el spot del omamori', async () => {
    const { container } = render(<SiteFooter />)
    expect(screen.queryByText('桜', { exact: true })).toBeNull()
    await waitFor(() => expect(container.querySelector('svg.iso-spot-omamori')).not.toBeNull())
  })
})
