/**
 * Helpers de scroll: suaves salvo con prefers-reduced-motion (un `behavior: 'smooth'` explícito
 * en JS ignora la regla CSS `scroll-behavior: auto`).
 */
import { vi } from 'vitest'
import { ROUTE_ANCHOR, scrollToDay, scrollToJourney, scrollToRoute, scrollTop, dayAnchor } from '@/features/landing/scroll'

function stubReducedMotion(reduce: boolean) {
  vi.stubGlobal(
    'matchMedia',
    (query: string) =>
      ({
        matches: reduce && query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as unknown as MediaQueryList,
  )
}

let scrollToSpy: ReturnType<typeof vi.fn>
let intoViewSpy: ReturnType<typeof vi.fn>

beforeEach(() => {
  scrollToSpy = vi.fn()
  intoViewSpy = vi.fn()
  vi.stubGlobal('scrollTo', scrollToSpy)
  Element.prototype.scrollIntoView = intoViewSpy as unknown as Element['scrollIntoView']
  document.body.innerHTML = `
    <div id="${ROUTE_ANCHOR}"></div>
    <section data-journey></section>
    <section id="${dayAnchor(3)}"></section>`
})
afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

describe.each([
  [false, 'smooth'],
  [true, 'auto'],
])('con reduce-motion = %s → behavior %s', (reduce, behavior) => {
  beforeEach(() => stubReducedMotion(reduce))

  it('scrollTop', () => {
    scrollTop()
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior })
  })

  it('scrollToJourney', () => {
    scrollToJourney()
    expect(scrollToSpy).toHaveBeenCalledWith(expect.objectContaining({ behavior }))
  })

  it('scrollToRoute', () => {
    scrollToRoute()
    expect(intoViewSpy).toHaveBeenCalledWith({ behavior, block: 'start' })
  })

  it('scrollToDay', () => {
    scrollToDay(3)
    expect(intoViewSpy).toHaveBeenCalledWith({ behavior, block: 'start' })
  })
})
