/**
 * Tokens de diseño — "Itinerario Japón tres semanas" (handoff Claude Design)
 *
 * Paleta washi cálido + identidades por ciudad y dos temas de día (warm / onsen).
 * Todos los valores reproducen el diseño original (.dc.html).
 */

// ── Paleta base ───────────────────────────────────────────────────────────────
export const palette = {
  bg: '#fbf6f0',
  ink: '#1b2a4a',
  inkDeep: '#14203a',
  paper: '#fffdf9',
  paperSoft: '#fdf8f1',
  border: '#ece2d2',
  text: '#20242e',
  body: '#42475a',
  muted: '#5a5e6b',
  subtle: '#8a8170',
  gold: '#b48a35',
  goldLine: '#c79a44',
  red: '#c24a5a',
  redBright: '#e0564b',
  sakura: '#f6c2d2',
  green: '#3f6f5f',
  greenDeep: '#234a40',
} as const

// ── Identidad por ciudad ──────────────────────────────────────────────────────
export interface CityMeta {
  /** Kanji para el watermark de fondo y el rail */
  readonly kanji: string
  /** Color del punto en la barra de progreso (variedad visual por ciudad) */
  readonly dot: string
}

/** Kanji estándar de cada ciudad/destino (nombres propios, no spoilers). */
export const cityMeta: Record<string, CityMeta> = {
  tokio: { kanji: '東京', dot: '#1b2a4a' },
  takaragawa: { kanji: '宝川', dot: '#3f6f5f' },
  kanazawa: { kanji: '金沢', dot: '#b08534' },
  takayama: { kanji: '高山', dot: '#8a5a3b' },
  shirakawago: { kanji: '白川郷', dot: '#6f8f5f' },
  kioto: { kanji: '京都', dot: '#c24a5a' },
  osaka: { kanji: '大阪', dot: '#e0564b' },
  nara: { kanji: '奈良', dot: '#b08534' },
  hiroshima: { kanji: '広島', dot: '#c24a5a' },
  kamakura: { kanji: '鎌倉', dot: '#3f6f5f' },
}

/** Fallback si una ciudad no estuviera mapeada. */
export const fallbackCityMeta: CityMeta = { kanji: '日本', dot: '#1b2a4a' }

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
    eyebrow: '#b48a35',
    heading: '#c24a5a',
    morningDot: '#b48a35',
    afternoonDot: '#c24a5a',
    tagBg: '#f3ead8',
    tagText: '#7a6a4e',
    badgeBg: '#fbe3ea',
    badgeText: '#c24a5a',
    spoilerBg: '#fbf3e6',
    spoilerBorder: '#f0e4cf',
    spoilerAccent: '#b48a35',
    factBorder: '#efe4cf',
    factLabel: '#a99066',
    noteDot: '#e0564b',
    divider: '#f1e8d8',
    transferBg: '#1b2a4a',
    transferText: '#eaf0fb',
    transferEyebrow: '#9fb0d0',
    transferMuted: '#c7d2e6',
    transferIconBg: 'rgba(246,194,210,.18)',
    transferIconStroke: '#f6c2d2',
  },
  onsen: {
    eyebrow: '#3f6f5f',
    heading: '#3f6f5f',
    morningDot: '#3f6f5f',
    afternoonDot: '#3f6f5f',
    tagBg: '#e4efe9',
    tagText: '#3f6f5f',
    badgeBg: '#dfeee7',
    badgeText: '#3f6f5f',
    spoilerBg: '#e9f1ec',
    spoilerBorder: '#d7e6de',
    spoilerAccent: '#3f6f5f',
    factBorder: '#d7e6de',
    factLabel: '#6f9286',
    noteDot: '#3f6f5f',
    divider: '#f1e8d8',
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
export const fontSerif = "'Shippori Mincho', serif"
export const fontSans = "'Zen Kaku Gothic New', sans-serif"

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
