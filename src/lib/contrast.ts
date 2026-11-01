/**
 * Contraste de color según WCAG 2.x (luminancia relativa en sRGB).
 * Solo acepta hex de 6 dígitos (`#rrggbb`), que es como están escritos los tokens.
 */

function parseHex(hex: string): [number, number, number] {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) throw new Error(`Color no soportado: ${hex}`)
  const n = parseInt(m[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function channel(c: number): number {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

/** Luminancia relativa (0 = negro, 1 = blanco). */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = parseHex(hex)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

/** Ratio de contraste entre dos colores (1…21). AA texto normal ≥ 4,5; texto grande y UI ≥ 3. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/** Mezcla `top` sobre `base` con peso `t` (0…1) en sRGB, como `color-mix(in srgb, top t, base)`. */
export function mixHex(top: string, base: string, t: number): string {
  const a = parseHex(top)
  const b = parseHex(base)
  return '#' + a.map((v, i) => Math.round(v * t + b[i] * (1 - t)).toString(16).padStart(2, '0')).join('')
}
