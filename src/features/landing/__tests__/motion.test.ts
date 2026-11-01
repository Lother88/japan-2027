/**
 * Movimiento: tokens de easing compartidos y reglas de transición de index.css
 * (lo que no tiene superficie en el DOM de jsdom se comprueba sobre el texto del CSS).
 */
/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// index.css usa CRLF: se normaliza para que las expresiones no dependan del EOL.
const css = readFileSync(join(process.cwd(), 'src/index.css'), 'utf8').replace(/\r\n/g, '\n')

/** Primer bloque `:root { … }` (el de los tokens del tema claro). */
function rootBlock(): string {
  const m = css.match(/\n:root\s*\{([^}]*)\}/)
  if (!m) throw new Error('index.css no define un bloque :root')
  return m[1]
}

/** Bloque final `@media (prefers-reduced-motion: reduce) { … }` (el global del fichero). */
function reduceBlock(): string {
  const at = css.lastIndexOf('@media (prefers-reduced-motion: reduce)')
  if (at < 0) throw new Error('index.css no tiene bloque de reduce-motion')
  return css.slice(at)
}

describe('reduce-motion: menos movimiento, se conservan los fundidos', () => {
  it('ToTop solo funde (anula el transform que escribe el JS)', () => {
    expect(reduceBlock()).toMatch(/\[data-totop\]\s*\{\s*transform:\s*none\s*!important;\s*\}/)
  })

  it('el spoiler no anima la altura: solo funde la opacidad', () => {
    const rule = reduceBlock().match(/details\[data-spoiler\](?:\[open\])?::details-content\s*\{([^}]*)\}/)?.[1]
    expect(rule, 'falta la regla del spoiler con reduce').toBeDefined()
    expect(rule).toMatch(/transition:\s*opacity\s+150ms/)
    expect(rule).not.toMatch(/height/)
  })

  it('el chevron del spoiler gira sin transición', () => {
    expect(reduceBlock()).toMatch(/details\[data-spoiler\]\s*\[data-spoiler-chev\]\s*\{\s*transition:\s*none;\s*\}/)
  })
})

/** Declaraciones de la primera regla cuyo selector es exactamente `selector` (fuera de reduce). */
function ruleOf(selector: string): string {
  const head = css.slice(0, css.lastIndexOf('@media (prefers-reduced-motion: reduce)'))
  const esc = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const m = head.match(new RegExp(`(?:^|\\n)${esc}\\s*\\{([^}]*)\\}`))
  if (!m) throw new Error(`index.css no tiene la regla ${selector}`)
  return m[1]
}

describe('spoiler «El lugar»: asimétrico y corto', () => {
  it('abre en 300 ms: la altura primero y el texto 60 ms después', () => {
    const open = ruleOf('details[data-spoiler][open]::details-content')
    expect(open).toMatch(/height 300ms var\(--ease-out\)/)
    expect(open).toMatch(/opacity 200ms var\(--ease-out\) 60ms/)
    expect(open).toMatch(/content-visibility 300ms allow-discrete/)
  })

  it('cierra en 200 ms, sin retraso en la opacidad', () => {
    const close = ruleOf('details[data-spoiler]::details-content')
    expect(close).toMatch(/height 200ms var\(--ease-out\)/)
    expect(close).toMatch(/opacity 120ms ease-out(?!\s+\d)/)
    // content-visibility dura lo mismo que la altura: si no, el contenido desaparece antes
    expect(close).toMatch(/content-visibility 200ms allow-discrete/)
  })

  it('el chevron gira con --ease-out', () => {
    expect(ruleOf('details[data-spoiler] [data-spoiler-chev]')).toMatch(/transition:\s*transform 200ms var\(--ease-out\)/)
  })

  it('con reduce, la regla del fundido también cubre la apertura ([open] tiene más especificidad)', () => {
    expect(reduceBlock()).toMatch(
      /details\[data-spoiler\]::details-content,\s*details\[data-spoiler\]\[open\]::details-content\s*\{/,
    )
  })
})

describe('tokens de easing', () => {
  it.each([
    ['--ease-out', 'cubic-bezier(0.23, 1, 0.32, 1)'],
    ['--ease-in-out', 'cubic-bezier(0.77, 0, 0.175, 1)'],
  ])(':root define %s', (name, value) => {
    const m = rootBlock().match(new RegExp(`${name}\\s*:\\s*([^;]+);`))
    expect(m?.[1].trim()).toBe(value)
  })

  it('no dependen del tema (no se redefinen en [data-theme="dark"])', () => {
    const dark = css.match(/\[data-theme="dark"\]\s*\{([^}]*)\}/)?.[1] ?? ''
    expect(dark).not.toMatch(/--ease-/)
  })
})

describe('sin transiciones de tema muertas', () => {
  // swapTheme() pone data-theme-swapping, que anula toda transición: estas nunca corrían.
  it.each(['html', 'body'])('%s no declara transition', (selector) => {
    expect(ruleOf(selector)).not.toMatch(/transition/)
  })
})

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

/** Cuerpo de `@keyframes name { … }` (con sus pasos anidados). */
function keyframes(name: string): string {
  const at = css.indexOf(`@keyframes ${name} {`)
  if (at < 0) throw new Error(`index.css no define @keyframes ${name}`)
  let i = css.indexOf('{', at) + 1
  let depth = 1
  const start = i
  while (depth > 0 && i < css.length) {
    if (css[i] === '{') depth++
    else if (css[i] === '}') depth--
    i++
  }
  return css.slice(start, i - 1)
}

describe('entrada del título del hero', () => {
  const motionOk = mediaBlocks('(prefers-reduced-motion: no-preference)').join('\n')

  it.each([
    ['[data-hero-kanji]', 'hero-brush'],
    ['[data-hanko]', 'hero-stamp'],
    ['[data-cal-page]', 'hero-page-drop'],
  ])('%s anima con %s solo sin reduce-motion, una vez y con --ease-out', (selector, name) => {
    const esc = selector.replace(/[[\]]/g, '\\$&')
    const rule = motionOk.match(new RegExp(`${esc}\\s*\\{([^}]*)\\}`))?.[1]
    expect(rule, `falta la animación de ${selector}`).toBeDefined()
    expect(rule).toMatch(new RegExp(`animation:\\s*${name}\\s+\\d+ms\\s+var\\(--ease-out\\)`))
    expect(rule).not.toMatch(/infinite/)
    // Fuera de no-preference no se anima: con reduce todo queda quieto
    const head = css.slice(0, css.lastIndexOf('@media (prefers-reduced-motion: reduce)'))
    const outside = head.replace(/@media \(prefers-reduced-motion: no-preference\) \{[\s\S]*?\n\}/g, '')
    expect(outside).not.toMatch(new RegExp(`animation:\\s*${name}\\b`))
  })

  it('el pincel del kanji se revela de arriba abajo con clip-path', () => {
    const k = keyframes('hero-brush')
    expect(k).toMatch(/clip-path:\s*inset\(0 0 100% 0\)/)
    expect(k).not.toMatch(/(?:^|[\s;{])(?:width|height|top|left|margin|padding)\s*:/)
  })

  it.each(['hero-brush', 'hero-stamp', 'hero-page-drop'])('%s solo anima propiedades del compositor', (name) => {
    const props = [...keyframes(name).matchAll(/([\w-]+)\s*:/g)].map((m) => m[1])
    expect(props.length).toBeGreaterThan(0)
    for (const p of props) expect(['transform', 'opacity', 'clip-path', 'scale', 'translate', 'rotate']).toContain(p)
  })

  it('el sello se estampa desde una escala mayor', () => {
    expect(keyframes('hero-stamp')).toMatch(/scale:\s*1\.2\d*/)
  })
})
