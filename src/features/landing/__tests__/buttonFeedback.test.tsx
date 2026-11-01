/**
 * Feedback de los botones en CSS (index.css), no con onMouseEnter/onMouseLeave: el hover queda
 * gateado por (hover: hover) y reduce-motion, y todos los pulsables se hunden al presionar.
 * Los estilos inline ganan a la hoja, así que lo que controla el CSS no puede ir inline.
 */
/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fireEvent, render, screen } from '@testing-library/react'
import Hero from '@/features/landing/Hero'
import ThemeToggle from '@/features/landing/ThemeToggle'
import ToTop from '@/features/landing/ToTop'
import { ThemeModeContext } from '@/features/landing/useThemeMode'

const css = readFileSync(join(process.cwd(), 'src/index.css'), 'utf8').replace(/\r\n/g, '\n')

/** Contenido de cada bloque `@media <cond> { … }` (un nivel de anidamiento). */
function mediaBlocks(cond: string): string[] {
  const out: string[] = []
  let at = css.indexOf(`@media ${cond} {`)
  while (at >= 0) {
    let i = css.indexOf('{', at) + 1
    let depth = 1
    const start = i
    while (depth > 0 && i < css.length) {
      if (css[i] === '{') depth++
      else if (css[i] === '}') depth--
      i++
    }
    out.push(css.slice(start, i - 1))
    at = css.indexOf(`@media ${cond} {`, i)
  }
  return out
}

describe('CTA «Explora la ruta»', () => {
  it('no cambia su estilo inline al pasar el ratón (el hover es CSS)', () => {
    render(<Hero />)
    const cta = screen.getByRole('button', { name: /explora la ruta/i })
    expect(cta).toHaveAttribute('data-cta')
    fireEvent.mouseEnter(cta)
    expect(cta.style.transform).toBe('')
    expect(cta.style.background).toBe('')
    expect(cta.style.transition).toBe('')
  })
})

describe('ToTop', () => {
  it('fondo en CSS, sin handlers de hover y con entrada de 200 ms en ease-out fuerte', () => {
    render(<ToTop />)
    const btn = screen.getByRole('button', { name: 'Volver arriba', hidden: true })
    fireEvent.mouseEnter(btn)
    expect(btn.style.background).toBe('')
    expect(btn.style.transition).toContain('opacity 200ms var(--ease-out)')
    expect(btn.style.transition).toContain('transform 200ms var(--ease-out)')
    expect(btn.style.transition).toContain('scale 160ms var(--ease-out)')
  })
})

describe('ThemeToggle', () => {
  it('no lleva transición inline (la de presión vive en el CSS)', () => {
    render(
      <ThemeModeContext.Provider value={{ mode: 'light', toggle: () => {} }}>
        <ThemeToggle />
      </ThemeModeContext.Provider>,
    )
    expect(screen.getByRole('button', { name: 'Activar tema oscuro' }).style.transition).toBe('')
  })
})

describe('index.css — hover gateado y presión', () => {
  it('el hover de color solo con puntero fino', () => {
    const blocks = mediaBlocks('(hover: hover) and (pointer: fine)').join('\n')
    expect(blocks).toMatch(/\[data-cta\]:hover\s*\{[^}]*background:\s*var\(--primary-press\)/)
    expect(blocks).toMatch(/\[data-totop\]:hover\s*\{[^}]*background:\s*var\(--primary-press\)/)
  })

  it('el desplazamiento de hover además exige no reduce-motion', () => {
    const blocks = mediaBlocks('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').join('\n')
    expect(blocks).toMatch(/\[data-cta\]:hover,\s*\[data-map-expand\]:hover\s*\{\s*transform:\s*translateY\(-1px\)/)
  })

  it('los pulsables se hunden a 0.97 al presionar; ToTop con la propiedad scale', () => {
    for (const sel of ['[data-cta]:active', '[data-map-expand]:active', '[data-ttoggle]:active', '[data-scrollcue]:active', 'a[data-day-nav]:active']) {
      expect(css).toContain(sel)
    }
    expect(css).toMatch(/a\[data-day-nav\]:active\s*\{\s*transform:\s*scale\(0\.97\)/)
    expect(css).toMatch(/\[data-totop\]:active\s*\{\s*scale:\s*0\.97/)
  })
})
