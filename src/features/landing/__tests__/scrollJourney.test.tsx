/**
 * useScrollJourney sin trabajo de React por frame: el progreso se escribe directamente en las
 * barras del rail (transform), React solo re-renderiza al cambiar el día activo y el botón
 * ToTop solo se toca cuando cambia su visibilidad.
 */
import { act, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { useScrollJourney } from '@/features/landing/useScrollJourney'

/** Posición de scroll simulada: el journey empieza en 0 y mide 1000 px más que el viewport. */
let scroll = 0
const EXTRA = 1000
const DAY_GAP = 2000

function rect(top: number, height: number): DOMRect {
  return { top, height, bottom: top + height, left: 0, right: 0, width: 0, x: 0, y: top, toJSON: () => ({}) }
}

let renders = 0
function Probe() {
  const { activeIndex } = useScrollJourney()
  renders++
  return (
    <div data-journey>
      <section data-day data-i="0" />
      <section data-day data-i="1" />
      <div data-rail-progress="v" />
      <div data-rail-progress="h" />
      <button type="button" data-totop />
      <output data-testid="active">{activeIndex}</output>
    </div>
  )
}

async function scrollTo(y: number) {
  scroll = y
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true })
  await act(async () => {
    window.dispatchEvent(new Event('scroll'))
    await new Promise((r) => setTimeout(r, 40))
  })
}

beforeEach(() => {
  renders = 0
  scroll = 0
  Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    if (this.hasAttribute('data-journey')) return rect(-scroll, window.innerHeight + EXTRA)
    if (this.hasAttribute('data-day')) return rect(Number(this.getAttribute('data-i')) * DAY_GAP - scroll, DAY_GAP)
    return rect(0, 0)
  })
})
afterEach(() => vi.restoreAllMocks())

describe('useScrollJourney', () => {
  it('escribe el progreso directamente en las barras del rail', async () => {
    render(<Probe />)
    await scrollTo(250)
    const v = document.querySelector<HTMLElement>('[data-rail-progress="v"]')!
    const h = document.querySelector<HTMLElement>('[data-rail-progress="h"]')!
    expect(v.style.transform).toBe('scaleY(0.25)')
    expect(h.style.transform).toBe('scaleX(0.25)')
  })

  it('no re-renderiza si solo cambia el progreso; sí al cambiar de día', async () => {
    render(<Probe />)
    await scrollTo(100)
    const base = renders
    await scrollTo(300)
    await scrollTo(500)
    await scrollTo(700)
    expect(renders).toBe(base)
    await scrollTo(DAY_GAP - 100)
    expect(screen.getByTestId('active')).toHaveTextContent('1')
    expect(renders).toBeGreaterThan(base)
  })

  it('ToTop solo se toca cuando cambia su visibilidad', async () => {
    render(<Probe />)
    await scrollTo(10)
    const top = document.querySelector<HTMLElement>('[data-totop]')!
    expect(top.style.opacity).toBe('0')
    expect(top).toHaveAttribute('inert')
    // Marca: si el hook reescribe sin cambio de visibilidad, la pisa.
    top.style.opacity = '0.5'
    await scrollTo(60)
    expect(top.style.opacity).toBe('0.5')
    await scrollTo(window.innerHeight)
    expect(top.style.opacity).toBe('1')
    expect(top).not.toHaveAttribute('inert')
  })
})
