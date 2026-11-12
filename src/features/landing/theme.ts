/**
 * Tokens de diseño — "Itinerario Japón tres semanas" (handoff Claude Design)
 *
 * Paleta washi cálido + identidades por ciudad. Los colores son referencias a variables CSS
 * (`var(--token)`) definidas en `index.css` (`:root` claro + `[data-theme="dark"]` oscuro), de
 * modo que todos los componentes que consumen estos tokens se adaptan al tema automáticamente.
 * Solo permanece en hex el acento decorativo fijo (sakura).
 */

// ── Paleta base (referencias a variables CSS de index.css) ─────────────────────
export const palette = {
  bg: 'var(--paper)',
  ink: 'var(--ink)',
  inkDeep: 'var(--primary-press)',
  paper: 'var(--surface)',
  paperSoft: 'var(--surface-warm)',
  border: 'var(--border)',
  text: 'var(--ink)',
  body: 'var(--body)',
  muted: 'var(--slate)',
  subtle: 'var(--muted2)',
  gold: 'var(--amber)',
  goldLine: 'var(--amber-deep)',
  red: 'var(--coral)',
  redBright: 'var(--coral2)',
  sakura: '#f6c2d2',
  green: 'var(--green)',
  greenDeep: '#234a40',
} as const

// ── Identidad por ciudad ──────────────────────────────────────────────────────
export interface CityMeta {
  /** Kanji de la ciudad (cabecera del día, rail y panel de la ruta) */
  readonly kanji: string
  /**
   * Color de acento de la ciudad en «La ruta» (píldoras del panel). Es una variable CSS para
   * que cambie con el tema; usa `color-mix()` si necesitas derivar una versión con alpha.
   */
  readonly dot: string
}

/**
 * Tono de la ciudad en el itinerario día a día (tira de fechas, rail, cabecera, línea de
 * tiempo y hoja de cada paso): `--city-<slug>` de index.css, un color distinto por base con
 * contraste AA como texto y como relleno (con `--on-c` encima) en los dos temas. Los destinos
 * de excursión no son base de ningún día; si apareciera uno sin token, cae al dorado.
 */
export function cityTone(slug: string): string {
  return `var(--city-${slug}, var(--gold))`
}

/** Kanji estándar de cada ciudad/destino (nombres propios, no spoilers). */
export const cityMeta: Record<string, CityMeta> = {
  tokio: { kanji: '東京', dot: 'var(--ink)' },
  takaragawa: { kanji: '宝川', dot: 'var(--green)' },
  kanazawa: { kanji: '金沢', dot: 'var(--gold)' },
  takayama: { kanji: '高山', dot: 'var(--brown)' },
  shirakawago: { kanji: '白川郷', dot: 'var(--green)' },
  kioto: { kanji: '京都', dot: 'var(--coral)' },
  osaka: { kanji: '大阪', dot: 'var(--coral2)' },
  nara: { kanji: '奈良', dot: 'var(--gold)' },
  hiroshima: { kanji: '広島', dot: 'var(--coral)' },
  katsuoji: { kanji: '勝尾寺', dot: 'var(--coral2)' },
}

/** Fallback si una ciudad no estuviera mapeada. */
export const fallbackCityMeta: CityMeta = { kanji: '日本', dot: 'var(--ink)' }

export function getCityMeta(slug: string): CityMeta {
  return cityMeta[slug] ?? fallbackCityMeta
}

// ── Tipografía ────────────────────────────────────────────────────────────────
export const fontSerif = 'var(--font-serif)'
export const fontSans = 'var(--font-sans)'

// ── Fechas (es-ES, parseo determinista en UTC) ────────────────────────────────
const WEEKDAYS_LONG = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
const WEEKDAYS_SHORT = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']
const MONTHS_LONG = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

interface ParsedDate {
  readonly weekday: number
  readonly day: number
  readonly month: number // 0-based
}

function parseISO(iso: string): ParsedDate {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1))
  return { weekday: dt.getUTCDay(), day: d ?? 1, month: (m ?? 1) - 1 }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** 'Domingo 9 de mayo' (nombres accesibles de los chips de la tira de fechas) */
export function formatLongDate(iso: string): string {
  const p = parseISO(iso)
  return `${capitalize(WEEKDAYS_LONG[p.weekday])} ${p.day} de ${MONTHS_LONG[p.month]}`
}

/** Partes de la fecha para la tira de fechas y la cabecera del día ('jue', 20, 'may', 4). */
export function dateParts(iso: string): { weekday: string; weekdayIndex: number; day: number; month: string } {
  const p = parseISO(iso)
  return { weekday: WEEKDAYS_SHORT[p.weekday], weekdayIndex: p.weekday, day: p.day, month: MONTHS_SHORT[p.month] }
}

/** 'dom · 9 may' (para el rail) */
export function formatShortDate(iso: string): string {
  const p = parseISO(iso)
  return `${WEEKDAYS_SHORT[p.weekday]} · ${p.day} ${MONTHS_SHORT[p.month]}`
}

/** Número de día calendario con dos dígitos: 9 → '09' */
export function pad2(n: number): string {
  return String(n).padStart(2, '0')
}
