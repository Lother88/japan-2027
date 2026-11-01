/**
 * css() — convierte un objeto de estilos (claves camelCase, como en React) en el texto de un
 * atributo `style` de Astro.
 *
 * Astro ya acepta objetos en `style`, pero escribe los números tal cual (`gap: 14` → `gap:14`,
 * que el navegador descarta). Este helper replica la regla de React: añade `px` a los números
 * salvo en las propiedades sin unidad (lineHeight, fontWeight, opacity, zIndex, flex…) y en las
 * custom properties (`--x`). Los valores vacíos (undefined, null, false, '') se omiten.
 */

export type StyleValue = string | number | undefined | null | false
export type StyleObject = Record<string, StyleValue>

/** Propiedades que React deja sin unidad (react-dom, CSSProperty.js). */
const UNITLESS = new Set([
  'animationIterationCount',
  'aspectRatio',
  'borderImageOutset',
  'borderImageSlice',
  'borderImageWidth',
  'boxFlex',
  'boxFlexGroup',
  'boxOrdinalGroup',
  'columnCount',
  'columns',
  'flex',
  'flexGrow',
  'flexPositive',
  'flexShrink',
  'flexNegative',
  'flexOrder',
  'gridArea',
  'gridRow',
  'gridRowEnd',
  'gridRowSpan',
  'gridRowStart',
  'gridColumn',
  'gridColumnEnd',
  'gridColumnSpan',
  'gridColumnStart',
  'fontWeight',
  'lineClamp',
  'lineHeight',
  'opacity',
  'order',
  'orphans',
  'scale',
  'tabSize',
  'widows',
  'zIndex',
  'zoom',
  'fillOpacity',
  'floodOpacity',
  'stopOpacity',
  'strokeDasharray',
  'strokeDashoffset',
  'strokeMiterlimit',
  'strokeOpacity',
  'strokeWidth',
])

function kebab(key: string): string {
  return key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`).replace(/^ms-/, '-ms-')
}

/** Une uno o varios objetos de estilo (los posteriores pisan a los anteriores) en texto CSS. */
export function css(...styles: Array<StyleObject | undefined>): string {
  const merged: StyleObject = Object.assign({}, ...styles.filter(Boolean))
  const out: string[] = []
  for (const [key, value] of Object.entries(merged)) {
    if (value === undefined || value === null || value === false || value === '') continue
    const custom = key.startsWith('--')
    const prop = custom ? key : kebab(key)
    const text = typeof value === 'number' && value !== 0 && !custom && !UNITLESS.has(key) ? `${value}px` : String(value)
    out.push(`${prop}:${text}`)
  }
  return out.join(';')
}
