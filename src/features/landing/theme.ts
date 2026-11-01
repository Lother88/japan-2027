/**
 * Tokens de diseño — "Itinerario Japón tres semanas" (handoff Claude Design)
 *
 * Paleta washi cálido + identidades por ciudad y dos temas de día (warm / onsen).
 * Los colores son referencias a variables CSS (`var(--token)`) definidas en
 * `index.css` (`:root` claro + `[data-theme="dark"]` oscuro), de modo que todos
 * los componentes que consumen estos tokens se adaptan al tema automáticamente.
 * Solo permanecen hex literales los acentos decorativos fijos (sakura) y las
 * tarjetas de trayecto, que son oscuras en ambos temas.
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
  /** Kanji para el watermark de fondo y el rail */
  readonly kanji: string
  /**
   * Color de acento de la ciudad (punto de progreso, ticks del rail). Es una
   * variable CSS para que cambie con el tema; usa `color-mix()` si necesitas
   * derivar una versión con alpha (p. ej. tintes de fondo).
   */
  readonly dot: string
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
}

/** Fallback si una ciudad no estuviera mapeada. */
export const fallbackCityMeta: CityMeta = { kanji: '日本', dot: 'var(--ink)' }

export function getCityMeta(slug: string): CityMeta {
  return cityMeta[slug] ?? fallbackCityMeta
}

// ── Temas de día ──────────────────────────────────────────────────────────────
export type DayTheme = 'warm' | 'onsen'

/** Días de montaña/onsen usan la familia verde; el resto, la cálida. */
export function themeForCity(slug: string): DayTheme {
  return slug === 'takaragawa' ? 'onsen' : 'warm'
}

export interface ThemeTokens {
  readonly eyebrow: string
  readonly heading: string
  readonly morningDot: string
  readonly afternoonDot: string
  readonly tagBg: string
  readonly tagText: string
  readonly badgeBg: string
  readonly badgeText: string
  readonly spoilerBg: string
  readonly spoilerBorder: string
  readonly spoilerAccent: string
  readonly factBorder: string
  readonly factLabel: string
  readonly noteDot: string
  readonly divider: string
  readonly transferBg: string
  readonly transferText: string
  readonly transferEyebrow: string
  readonly transferMuted: string
  readonly transferIconBg: string
  readonly transferIconStroke: string
}

export const themes: Record<DayTheme, ThemeTokens> = {
  warm: {
    eyebrow: 'var(--amber-text)',
    heading: 'var(--coral-text)',
    morningDot: 'var(--amber)',
    afternoonDot: 'var(--coral)',
    tagBg: 'var(--wash-amber)',
    tagText: 'var(--muted)',
    badgeBg: 'var(--wash-pink)',
    badgeText: 'var(--coral-text)',
    spoilerBg: 'var(--wash-amber-soft)',
    spoilerBorder: 'var(--border-amber2)',
    spoilerAccent: 'var(--amber-text)',
    factBorder: 'var(--border-amber2)',
    factLabel: 'var(--muted-amber)',
    noteDot: 'var(--coral2)',
    divider: 'var(--border-amber)',
    transferBg: '#1b2a4a',
    transferText: '#eaf0fb',
    transferEyebrow: '#9fb0d0',
    transferMuted: '#c7d2e6',
    transferIconBg: 'rgba(246,194,210,.18)',
    transferIconStroke: '#f6c2d2',
  },
  onsen: {
    eyebrow: 'var(--green)',
    heading: 'var(--green)',
    morningDot: 'var(--green)',
    afternoonDot: 'var(--green)',
    tagBg: 'var(--wash-green)',
    tagText: 'var(--green)',
    badgeBg: 'var(--wash-green)',
    badgeText: 'var(--green)',
    spoilerBg: 'var(--wash-green2)',
    spoilerBorder: 'var(--border-green)',
    spoilerAccent: 'var(--green)',
    factBorder: 'var(--border-green)',
    factLabel: 'var(--green)',
    noteDot: 'var(--green)',
    divider: 'var(--border-amber)',
    transferBg: '#234a40',
    transferText: '#e8f1ec',
    transferEyebrow: '#9ec7b7',
    transferMuted: '#c7e0d4',
    transferIconBg: 'rgba(180,224,205,.16)',
    transferIconStroke: '#b9e0cd',
  },
}

export function tokensForCity(slug: string): ThemeTokens {
  return themes[themeForCity(slug)]
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

/** 'Domingo 9 mayo' (para el eyebrow de la sección de día) */
export function formatLongDate(iso: string): string {
  const p = parseISO(iso)
  return `${capitalize(WEEKDAYS_LONG[p.weekday])} ${p.day} ${MONTHS_LONG[p.month]}`
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
