/**
 * Contraste AA de los tokens de TEXTO de index.css (tema claro y oscuro), medido sobre
 * los fondos reales donde se pintan. Además congela los tokens base de los que derivan
 * las rampas de las ilustraciones isométricas (cambiarlos obliga a regenerar los 21 SVG).
 */
/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { contrastRatio, mixHex } from '@/lib/contrast'

// Se lee del disco: en Vitest los imports de CSS (incluso `?raw`) llegan vacíos.
// index.css usa CRLF: se normaliza para que las expresiones de bloque no dependan del EOL.
const css = readFileSync(`${process.cwd()}/src/index.css`, 'utf8').replace(/\r\n/g, '\n')

/** Lee las variables `--x:valor` del primer bloque `selector { … }` de index.css. */
function readTokens(selector: RegExp): Record<string, string> {
  const match = css.match(selector)
  if (!match) throw new Error(`No se encuentra el bloque ${selector}`)
  const out: Record<string, string> = {}
  for (const [, name, value] of match[1].matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) out[name] = value.trim()
  return out
}

const themes = {
  claro: readTokens(/(?:^|\n):root\s*\{([^}]*)\}/),
  oscuro: readTokens(/\n\[data-theme="dark"\]\s*\{([^}]*)\}/),
}

/** Tintes del fondo de cada sección de día: 6 % del color de la ciudad sobre --paper. */
function dayTints(t: Record<string, string>): string[] {
  return ['ink', 'green', 'gold', 'brown', 'coral', 'coral2'].map((k) => mixHex(t[k], t.paper, 0.06))
}

/** Token de texto → fondos sobre los que se pinta. */
const textPairs: Array<{ fg: string; bgs: (t: Record<string, string>) => string[]; uso: string }> = [
  {
    fg: 'amber-text',
    uso: 'eyebrows, «Día» del rail, acentos de «El lugar»',
    bgs: (t) => [t.paper, t.surface, t['surface-warm'], t['surface-sun'], t['wash-amber-soft'], ...dayTints(t)],
  },
  { fg: 'tick-idle-label', uso: 'números del rail', bgs: (t) => [t['surface-warm']] },
  {
    fg: 'muted2',
    uso: 'fecha del rail, etiquetas de la tira de billete del hero',
    bgs: (t) => [t.paper, t.surface, t['surface-warm']],
  },
  { fg: 'muted-amber', uso: '«Dato curioso»', bgs: (t) => [t.surface, t['wash-amber-soft']] },
  { fg: 'muted', uso: 'etiquetas de zona', bgs: (t) => [t['wash-amber'], t.surface, t.paper] },
]

describe.each(Object.entries(themes))('contraste AA de los tokens de texto — tema %s', (_, t) => {
  it.each(textPairs)('--$fg ≥ 4,5:1 ($uso)', ({ fg, bgs }) => {
    expect(t[fg], `falta --${fg}`).toBeDefined()
    for (const bg of bgs(t)) expect(contrastRatio(t[fg], bg), `--${fg} sobre ${bg}`).toBeGreaterThanOrEqual(4.5)
  })

  it('el anillo de foco contrasta ≥ 3:1 con los fondos de la página', () => {
    for (const bg of [t.paper, t.surface, t['surface-warm']]) {
      expect(contrastRatio(t['focus-ring'], bg), `--focus-ring sobre ${bg}`).toBeGreaterThanOrEqual(3)
    }
  })
})

describe('cifras de la tira de billete del hero', () => {
  // Se exige AA de texto normal (≥ 4,5:1) aunque sean 30 px en negrita: así ninguna cifra
  // depende de la excepción de texto grande. Los acentos se leen del propio HeroSpots y se
  // miden sobre --surface, el fondo de la tira ([data-ticket] en index.css).
  const heroSpots = readFileSync(`${process.cwd()}/src/features/landing/HeroSpots.tsx`, 'utf8')
  const numerals = [...heroSpots.matchAll(/accent:\s*'var\(--([\w-]+)\)'/g)].map((m) => m[1])

  it('HeroSpots declara un acento por cifra', () => {
    expect(numerals).toHaveLength(4)
  })

  it.each(Object.entries(themes))('tema %s: cada cifra ≥ 4,5:1 sobre --surface', (_, t) => {
    for (const fg of numerals) {
      expect(t[fg], `falta --${fg}`).toBeDefined()
      expect(contrastRatio(t[fg], t.surface), `--${fg} sobre --surface`).toBeGreaterThanOrEqual(4.5)
    }
  })
})

describe('tokens base de las ilustraciones (congelados)', () => {
  // Las rampas de los SVG isométricos se generaron a partir de estos hex (iso/registry.ts y
  // hero-art/registry.ts; los spots de la tira y del botón de tema parten de --surface).
  const frozen = {
    claro: { paper: '#fbf6f0', surface: '#fffdf9', ink: '#1b2a4a', coral: '#c24a5a', coral2: '#e0564b', amber: '#b48a35', green: '#3f6f5f', brown: '#8a5a3b', gold: '#b08534' },
    oscuro: { paper: '#12141b', surface: '#1b1f2c', ink: '#f1ece1', coral: '#ff7a6f', coral2: '#ff6f62', amber: '#e2a743', green: '#76b89a', brown: '#c89a6a', gold: '#d9a948' },
  }
  it.each(Object.entries(frozen))('tema %s: sin cambios', (theme, values) => {
    const t = themes[theme as keyof typeof themes]
    for (const [k, v] of Object.entries(values)) expect(t[k], `--${k}`).toBe(v)
  })
})

describe('foco visible', () => {
  it('index.css define un anillo :focus-visible con --focus-ring', () => {
    expect(css).toMatch(/:focus-visible\s*\{[^}]*outline:[^}]*var\(--focus-ring\)/)
  })
})

describe('contrastRatio', () => {
  it('calcula los extremos y es simétrico', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5)
    expect(contrastRatio('#777777', '#ffffff')).toBeCloseTo(contrastRatio('#ffffff', '#777777'), 10)
    expect(contrastRatio('#fbf6f0', '#fbf6f0')).toBe(1)
  })
  it('mixHex mezcla en sRGB', () => {
    expect(mixHex('#000000', '#ffffff', 0.5)).toBe('#808080')
  })
})
