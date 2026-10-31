/**
 * Ilustraciones isométricas por día (9–29): mapeo día → asset, carga diferida al
 * acercarse la sección y fallback vacío para días sin asset.
 */
import { act, render, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { itinerary } from '@/data'
import { ISO_KINDS, pickIllustration } from '@/features/landing/illustrationKind'
import { isoLoaders } from '@/features/landing/iso/registry'
import { DayIllustration } from '@/features/landing/illustrations'
import DaySection from '@/features/landing/DaySection'

/** IntersectionObserver controlable desde el test (jsdom no lo implementa). */
class FakeIO {
  static instances: FakeIO[] = []
  readonly callback: IntersectionObserverCallback
  readonly options: IntersectionObserverInit
  readonly targets: Element[] = []
  disconnected = false

  constructor(cb: IntersectionObserverCallback, options: IntersectionObserverInit = {}) {
    this.callback = cb
    this.options = options
    FakeIO.instances.push(this)
  }
  observe(el: Element) {
    this.targets.push(el)
  }
  unobserve() {}
  disconnect() {
    this.disconnected = true
  }
  takeRecords() {
    return []
  }
  fire(isIntersecting: boolean) {
    const entries = this.targets.map((target) => ({ isIntersecting, target }))
    this.callback(entries as unknown as IntersectionObserverEntry[], this as unknown as IntersectionObserver)
  }
}

/** Observer de proximidad (carga) frente al de visibilidad (pausa de animaciones). */
const nearObserver = () => FakeIO.instances.find((io) => io.options.rootMargin?.includes('800px'))
const visibleObserver = () => FakeIO.instances.find((io) => !io.options.rootMargin?.includes('800px'))

const pad = (n: number) => String(n).padStart(2, '0')

describe('pickIllustration — un asset isométrico por día', () => {
  it.each(Array.from({ length: 21 }, (_, i) => i + 9))('el día %i usa su propio dibujo', (day) => {
    expect(pickIllustration(day)).toBe(`iso-d${pad(day)}`)
  })

  it('cubre todos los días del itinerario', () => {
    for (const day of itinerary) expect(pickIllustration(day.id)).not.toBeNull()
  })

  it('devuelve null para un día sin asset', () => {
    expect(pickIllustration(8)).toBeNull()
    expect(pickIllustration(30)).toBeNull()
  })
})

describe('registro de cargadores', () => {
  it('tiene un cargador por cada asset mapeado', () => {
    expect(ISO_KINDS).toHaveLength(21)
    for (const kind of ISO_KINDS) expect(typeof isoLoaders[kind]).toBe('function')
  })

  it('el cargador devuelve el viewBox y el marcado acotado a su clase', async () => {
    const art = await isoLoaders['iso-d21']()
    expect(art.viewBox).toBe('0 0 440 330')
    expect(art.markup).toContain('.iso-d21{')
    expect(art.markup).not.toContain('kk-iso')
  })
})

describe('DayIllustration — carga diferida', () => {
  beforeEach(() => {
    FakeIO.instances = []
    vi.stubGlobal('IntersectionObserver', FakeIO)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('reserva la caja 440/330 y no carga nada hasta acercarse', () => {
    const spy = vi.spyOn(isoLoaders, 'iso-d09')
    const { container } = render(<DayIllustration day={9} />)
    const box = container.querySelector<HTMLElement>('[data-illus]')
    expect(box).not.toBeNull()
    expect(box).toHaveAttribute('aria-hidden', 'true')
    expect(box?.style.aspectRatio).toBe('440 / 330')
    expect(container.querySelector('svg')).toBeNull()
    expect(spy).not.toHaveBeenCalled()
    expect(nearObserver()?.targets).toContain(box)
  })

  it('al acercarse carga el día y pinta un svg decorativo con su clase', async () => {
    const { container } = render(<DayIllustration day={9} />)
    act(() => nearObserver()?.fire(true))
    await waitFor(() => expect(container.querySelector('svg')).not.toBeNull(), { timeout: 4000 })
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('iso-d09')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('viewBox', '0 0 440 330')
    expect(svg?.querySelectorAll('.iso-solid').length).toBeGreaterThan(50)
  })

  it('pausa las animaciones cuando la sección sale de pantalla', () => {
    const { container } = render(<DayIllustration day={21} />)
    const box = container.querySelector('[data-illus]')
    act(() => visibleObserver()?.fire(false))
    expect(box).toHaveAttribute('data-paused')
    act(() => visibleObserver()?.fire(true))
    expect(box).not.toHaveAttribute('data-paused')
  })

  it('desconecta los observers al desmontar', () => {
    const { unmount } = render(<DayIllustration day={12} />)
    expect(FakeIO.instances.length).toBeGreaterThanOrEqual(2)
    unmount()
    for (const io of FakeIO.instances) expect(io.disconnected).toBe(true)
  })

  it('no renderiza nada para un día sin asset', () => {
    const { container } = render(<DayIllustration day={99} />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe('DaySection — hueco propio en la cabecera', () => {
  it('coloca la ilustración dentro de la cabecera del día, sin atenuar', () => {
    const { container } = render(<DaySection day={itinerary[0]} index={0} />)
    const art = container.querySelector<HTMLElement>('[data-day-head] [data-illus]')
    expect(art).not.toBeNull()
    expect(art?.style.position).not.toBe('absolute')
    expect(art?.style.opacity === '' || art?.style.opacity === '1').toBe(true)
  })
})
