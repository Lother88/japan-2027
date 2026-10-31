/**
 * Navegación y accesibilidad: rail de días como <nav> con enlaces reales a `#dia-NN`,
 * anclas en las secciones, botones flotantes con nombre accesible y pie con cifras
 * derivadas de los datos.
 */
import { render, screen, within } from '@testing-library/react'
import { vi } from 'vitest'
import { itinerary, getZone } from '@/data'
import { pad2, tokensForCity } from '@/features/landing/theme'
import DayRail from '@/features/landing/DayRail'
import DaySection from '@/features/landing/DaySection'
import SiteFooter from '@/features/landing/SiteFooter'
import ThemeToggle from '@/features/landing/ThemeToggle'
import ToTop from '@/features/landing/ToTop'
import ZoneCard from '@/features/landing/ZoneCard'
import { ThemeModeContext, type ThemeMode } from '@/features/landing/useThemeMode'

/** IntersectionObserver inerte (jsdom no lo implementa; DayIllustration lo necesita). */
class NoopIO {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

beforeEach(() => vi.stubGlobal('IntersectionObserver', NoopIO))
afterEach(() => vi.unstubAllGlobals())

describe('DayRail — navegación por días', () => {
  it('es un <nav> con un enlace a #dia-NN por cada día', () => {
    render(<DayRail days={itinerary} activeIndex={0} progress={0} />)
    const nav = screen.getByRole('navigation', { name: /días/i })
    const list = within(nav).getByRole('list')
    const links = within(list).getAllByRole('link')
    expect(links).toHaveLength(itinerary.length)
    itinerary.forEach((d, i) => {
      expect(links[i]).toHaveAttribute('href', `#dia-${pad2(d.id)}`)
      expect(links[i]).toHaveAccessibleName(new RegExp(`día ${d.id}\\b`, 'i'))
    })
  })

  it('los ticks son enlaces con zona táctil ≥ 24 px (no div role=button)', () => {
    render(<DayRail days={itinerary} activeIndex={0} progress={0} />)
    const list = screen.getByRole('list')
    for (const link of within(list).getAllByRole('link')) {
      expect(link.tagName).toBe('A')
      expect(parseFloat(link.style.minHeight)).toBeGreaterThanOrEqual(24)
    }
    expect(document.querySelector('[role="button"]')).toBeNull()
  })

  it('marca el día activo con aria-current', () => {
    render(<DayRail days={itinerary} activeIndex={3} progress={0.2} />)
    const links = within(screen.getByRole('list')).getAllByRole('link')
    expect(links[3]).toHaveAttribute('aria-current', 'location')
    expect(links.filter((l) => l.hasAttribute('aria-current'))).toHaveLength(1)
  })

  it('anterior/siguiente (móvil) son enlaces al día adyacente', () => {
    render(<DayRail days={itinerary} activeIndex={1} progress={0} />)
    const nav = screen.getByRole('navigation', { name: /días/i })
    expect(within(nav).getByRole('link', { name: /día anterior/i })).toHaveAttribute('href', `#dia-${pad2(itinerary[0].id)}`)
    expect(within(nav).getByRole('link', { name: /día siguiente/i })).toHaveAttribute('href', `#dia-${pad2(itinerary[2].id)}`)
  })

  it('en el primer día no hay enlace «anterior» activo', () => {
    render(<DayRail days={itinerary} activeIndex={0} progress={0} />)
    expect(screen.queryByRole('link', { name: /día anterior/i })).toBeNull()
  })
})

describe('DaySection — ancla del día', () => {
  it.each([itinerary[0], itinerary[itinerary.length - 1]])('la sección del día $id tiene id="dia-NN"', (day) => {
    const { container } = render(<DaySection day={day} index={0} />)
    const section = container.querySelector('section')
    expect(section).toHaveAttribute('id', `dia-${pad2(day.id)}`)
    expect(section).toHaveAttribute('data-day', String(day.id))
  })
})

describe('ZoneCard — esquema de encabezados y tildes', () => {
  it('el nombre de la zona es un h3 y los tags llevan tilde', () => {
    const zone = getZone('shibuya')
    if (!zone) throw new Error('falta la zona shibuya')
    render(<ZoneCard zone={zone} tokens={tokensForCity(zone.citySlug)} />)
    expect(screen.getByRole('heading', { level: 3, name: 'Shibuya' })).toBeInTheDocument()
    expect(screen.getByText('icónico')).toBeInTheDocument()
    expect(screen.queryByText('iconico')).toBeNull()
  })
})

describe('Botones flotantes', () => {
  const withMode = (mode: ThemeMode) => (
    <ThemeModeContext.Provider value={{ mode, toggle: () => {} }}>
      <ThemeToggle />
    </ThemeModeContext.Provider>
  )

  it('ThemeToggle nombra la acción según el tema', () => {
    const { rerender } = render(withMode('light'))
    expect(screen.getByRole('button', { name: 'Activar tema oscuro' })).toBeInTheDocument()
    rerender(withMode('dark'))
    expect(screen.getByRole('button', { name: 'Activar tema claro' })).toBeInTheDocument()
  })

  it('ToTop es un botón y, mientras está oculto, queda fuera del orden de tabulación', () => {
    render(<ToTop />)
    const btn = screen.getByRole('button', { name: 'Volver arriba', hidden: true })
    expect(btn).toHaveAttribute('type', 'button')
    expect(btn).toHaveAttribute('inert')
  })
})

describe('SiteFooter — cifras derivadas de los datos', () => {
  it('calcula noches, bases y excursiones a partir del itinerario', () => {
    render(<SiteFooter />)
    const footer = screen.getByRole('contentinfo')
    const noches = itinerary.length - 1
    const bases = new Set(itinerary.map((d) => d.citySlug)).size
    expect(footer).toHaveTextContent(`${noches} noches`)
    expect(footer).toHaveTextContent(`${bases} bases`)
    expect(footer).toHaveTextContent('8 → 29 mayo 2027')
  })

  it('sin jerga interna: «Notas del viaje» en vez de «Decisiones de scope» / «open-jaw»', () => {
    render(<SiteFooter />)
    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveTextContent('Notas del viaje')
    expect(footer).not.toHaveTextContent(/scope|open-jaw/i)
  })
})
