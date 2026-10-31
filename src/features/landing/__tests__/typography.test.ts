/**
 * Tipografía: fuentes de Google cargadas desde index.html (no con @import en el CSS) con
 * solo los pesos usados, fallbacks con métricas ajustadas (sin salto al cambiar de fuente) y
 * escala tipográfica como tokens `@theme` en index.css, sin `clamp()` sueltos en los
 * componentes.
 */
/// <reference types="node" />
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
// index.css usa CRLF: se normaliza para que las expresiones no dependan del EOL.
const read = (p: string) => readFileSync(join(root, p), 'utf8').replace(/\r\n/g, '\n')
const css = read('src/index.css')
const html = read('index.html')

/** Bloque `@theme … { … }` de index.css. */
function themeBlock(): string {
  const m = css.match(/@theme(?:\s+static)?\s*\{([^}]*)\}/)
  if (!m) throw new Error('index.css no define un bloque @theme')
  return m[1]
}

function token(name: string): string | undefined {
  return themeBlock().match(new RegExp(`--${name}\\s*:\\s*([^;]+);`))?.[1].trim()
}

describe('fuentes', () => {
  it('index.css ya no importa Google Fonts (cadena bloqueante CSS → CSS)', () => {
    expect(css).not.toMatch(/@import\s+url\([^)]*fonts\.googleapis/)
  })

  it('index.html hace preconnect a los dos orígenes de Google Fonts', () => {
    expect(html).toMatch(/<link\s+rel="preconnect"\s+href="https:\/\/fonts\.googleapis\.com"\s*\/?>/)
    expect(html).toMatch(/<link\s+rel="preconnect"\s+href="https:\/\/fonts\.gstatic\.com"\s+crossorigin\s*\/?>/)
  })

  it('index.html enlaza la hoja con solo los pesos usados y display=swap', () => {
    const href = html.match(/<link\s+rel="stylesheet"\s+href="(https:\/\/fonts\.googleapis\.com\/css2\?[^"]+)"/)?.[1]
    expect(href, 'falta <link rel="stylesheet"> de Google Fonts').toBeDefined()
    const url = new URL(href!.replace(/&amp;/g, '&'))
    // Zen Kaku Gothic New no tiene 600: los 600 de sans se resuelven a 700. Nadie usa 900.
    expect(url.searchParams.getAll('family')).toEqual([
      'Shippori Mincho:wght@500;600;700;800',
      'Zen Kaku Gothic New:wght@400;500;700',
    ])
    expect(url.searchParams.get('display')).toBe('swap')
  })

  it.each([
    ['Shippori Mincho Fallback', /Times New Roman/],
    ['Zen Kaku Gothic New Fallback', /Arial/],
  ])('define un fallback «%s» con métricas ajustadas', (family, local) => {
    const face = [...css.matchAll(/@font-face\s*\{([^}]*)\}/g)].map((m) => m[1]).find((b) => b.includes(`'${family}'`))
    expect(face, `falta @font-face de ${family}`).toBeDefined()
    expect(face).toMatch(local)
    for (const d of ['size-adjust', 'ascent-override', 'descent-override', 'line-gap-override']) {
      expect(face).toMatch(new RegExp(`${d}\\s*:\\s*[\\d.]+%`))
    }
  })

  it('las familias del sitio son tokens con su fallback métrico', () => {
    expect(token('font-serif')).toMatch(/^'Shippori Mincho', 'Shippori Mincho Fallback', serif$/)
    expect(token('font-sans')).toMatch(/^'Zen Kaku Gothic New', 'Zen Kaku Gothic New Fallback', sans-serif$/)
  })
})

describe('escala tipográfica (@theme)', () => {
  const steps = ['display', 'h2', 'day-num', 'day-title', 'subtitle', 'lead', 'body', 'numeral', 'eyebrow', 'label', 'caption']

  it.each(steps)('define --text-%s con su interlineado', (s) => {
    expect(token(`text-${s}`), `--text-${s}`).toBeDefined()
    expect(token(`text-${s}--line-height`), `--text-${s}--line-height`).toBeDefined()
  })

  it('las etiquetas en mayúsculas llevan su tracking', () => {
    for (const s of ['eyebrow', 'label', 'caption']) expect(token(`text-${s}--letter-spacing`)).toMatch(/em$/)
  })

  it('el subtítulo del día no pasa de 32 px (cabe en ≤ 2 líneas junto a la ilustración)', () => {
    const max = Number(token('text-day-title')?.match(/,\s*([\d.]+)px\)$/)?.[1])
    expect(max).toBeLessThanOrEqual(32)
  })
})

describe('componentes sin tamaños de letra fluidos sueltos', () => {
  const dir = join(root, 'src/features')
  const files = readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((f) => /\.tsx?$/.test(f) && !/__tests__|\.markup\.ts$/.test(f))

  it.each(files)('%s no usa clamp() en fontSize', (f) => {
    const src = read(join('src/features', f))
    expect(src).not.toMatch(/fontSize:\s*['"`]clamp\(/)
  })

  it.each(files)('%s no repite el nombre de las familias (usa los tokens)', (f) => {
    const src = read(join('src/features', f))
    expect(src).not.toMatch(/'Shippori Mincho'|'Zen Kaku Gothic New'/)
  })
})
