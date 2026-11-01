/**
 * Reveal: entrada de 600 ms (opacity + 16 px) y stagger por lote: solo se escalonan los
 * elementos que entran en el mismo callback del observer (50 ms por posición, tope 4), en orden
 * de documento. Un elemento que entra solo no espera.
 */
import { act, render } from '@testing-library/react'
import { vi } from 'vitest'
import Reveal from '@/features/landing/Reveal'

let ioCallback: IntersectionObserverCallback | undefined

/** IntersectionObserver que captura el callback para dispararlo a mano. */
class CaptureIO {
  constructor(cb: IntersectionObserverCallback) {
    ioCallback = cb
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

beforeAll(() => vi.stubGlobal('IntersectionObserver', CaptureIO))
afterAll(() => vi.unstubAllGlobals())
afterEach(() => vi.useRealTimers())

function renderReveals(n: number): HTMLElement[] {
  const { container } = render(
    <div>
      {Array.from({ length: n }, (_, i) => (
        <Reveal key={i}>
          <p>bloque {i}</p>
        </Reveal>
      ))}
    </div>,
  )
  return [...container.firstElementChild!.children] as HTMLElement[]
}

function enter(...els: HTMLElement[]) {
  const entries = els.map((target) => ({ isIntersecting: true, target }))
  act(() => ioCallback!(entries as unknown as IntersectionObserverEntry[], {} as IntersectionObserver))
}

describe('Reveal', () => {
  it('oculta antes de entrar: 16 px y 600 ms con --ease-out', () => {
    const [el] = renderReveals(1)
    expect(el.style.opacity).toBe('0')
    expect(el.style.transform).toBe('translateY(16px)')
    expect(el.style.transition).toBe('opacity 600ms var(--ease-out), transform 600ms var(--ease-out)')
  })

  it('escalona 50 ms los que entran en el mismo lote, en orden de documento', () => {
    const els = renderReveals(3)
    vi.useFakeTimers()
    enter(els[2], els[0], els[1])
    act(() => vi.advanceTimersByTime(0))
    expect(els.map((e) => e.style.opacity)).toEqual(['1', '0', '0'])
    act(() => vi.advanceTimersByTime(50))
    expect(els.map((e) => e.style.opacity)).toEqual(['1', '1', '0'])
    act(() => vi.advanceTimersByTime(50))
    expect(els.map((e) => e.style.opacity)).toEqual(['1', '1', '1'])
    expect(els[2].style.transform).toBe('none')
  })

  it('un elemento que entra solo se revela sin espera', () => {
    const els = renderReveals(3)
    vi.useFakeTimers()
    enter(els[2])
    act(() => vi.advanceTimersByTime(0))
    expect(els.map((e) => e.style.opacity)).toEqual(['0', '0', '1'])
  })

  it('el escalonado tiene tope: como mucho 200 ms', () => {
    const els = renderReveals(6)
    vi.useFakeTimers()
    enter(...els)
    act(() => vi.advanceTimersByTime(199))
    expect(els[5].style.opacity).toBe('0')
    act(() => vi.advanceTimersByTime(1))
    expect(els.every((e) => e.style.opacity === '1')).toBe(true)
  })
})
