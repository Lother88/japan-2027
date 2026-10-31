/**
 * Parallax del kanji de fondo de cada día: CSS scroll-driven (`animation-timeline: view()`),
 * no JS midiendo el scroll en cada frame. Sin soporte o con reduce-motion, queda quieto.
 */
/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { act, render } from '@testing-library/react'
import { vi } from 'vitest'
import { itinerary } from '@/data'
import DaySection from '@/features/landing/DaySection'
import { useScrollJourney } from '@/features/landing/useScrollJourney'

const css = readFileSync(`${process.cwd()}/src/index.css`, 'utf8').replace(/\r\n/g, '\n')

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

describe('parallax del kanji', () => {
  it('el kanji del día ya no se marca para parallax por JS', () => {
    const { container } = render(<DaySection day={itinerary[0]} index={0} />)
    const kanji = container.querySelector('[data-kanji]')
    expect(kanji).not.toBeNull()
    expect(kanji).not.toHaveAttribute('data-parallax')
  })

  it('la sección recorta con overflow: clip (hidden la haría scroller y congelaría view())', () => {
    const { container } = render(<DaySection day={itinerary[0]} index={0} />)
    expect(container.querySelector('section')?.style.overflow).toBe('clip')
  })

  it('useScrollJourney no mueve elementos al hacer scroll', async () => {
    function Probe() {
      useScrollJourney()
      return <div data-parallax="0.2" data-testid="p" />
    }
    const { getByTestId } = render(<Probe />)
    await act(async () => {
      window.dispatchEvent(new Event('scroll'))
      await new Promise((r) => setTimeout(r, 40))
    })
    expect(getByTestId('p').style.transform).toBe('')
  })

  it('index.css lo anima con animation-timeline: view(), solo con soporte y sin reduce-motion', () => {
    const block = css.match(
      /@supports\s*\(animation-timeline:\s*view\(\)\)\s*\{\s*@media\s*\(prefers-reduced-motion:\s*no-preference\)\s*\{([\s\S]*?)\n\s*\}\s*\n\}/,
    )
    expect(block, 'falta el bloque @supports + @media').not.toBeNull()
    expect(block![1]).toMatch(/\[data-kanji\]\s*\{[^}]*animation-timeline:\s*view\(\)/)
    expect(css).toMatch(/@keyframes\s+kanji-drift/)
  })
})
