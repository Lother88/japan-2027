/**
 * Resumen del viaje derivado de los datos (sin cifras escritas a mano en la UI).
 *
 * - Días: los del itinerario (llegada a Narita → vuelo de regreso).
 * - Noches en Japón: días − 1 (el último día se vuela de vuelta).
 * - Salida: la víspera del primer día (vuelo de ida nocturno desde España).
 * - Bases: ciudades distintas con pernocta o día en el itinerario.
 * - Regreso: el último día del itinerario.
 *
 * Además, ayudas puras de fechas para el hero: hojas de calendario (mes en kanji, día de la
 * semana), el rango en palabras y la cuenta atrás. Las fechas ISO se tratan como días de
 * calendario (UTC), sin depender de la zona horaria; «hoy» se toma del calendario local.
 */
import { itinerary } from './itinerary'
import { excursions } from './excursions'

/** Viajeros del grupo (dato del viaje, no derivable del itinerario). */
export const TRAVELERS = 4

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
/** Numerales kanji de los meses (五月 = mayo) */
const MONTH_NUMERALS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
/** Días de la semana desde el domingo (getUTCDay) */
const WEEKDAY_KANJI = ['日', '月', '火', '水', '木', '金', '土']
const WEEKDAY_SHORT = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']
const DAY_MS = 86_400_000

function parts(iso: string): { y: number; m: number; d: number } {
  const [y, m, d] = iso.split('-').map(Number)
  return { y, m: m - 1, d }
}

/** Fecha ISO del día anterior (UTC, sin depender de la zona horaria local). */
function dayBefore(iso: string): string {
  const { y, m, d } = parts(iso)
  return new Date(Date.UTC(y, m, d - 1)).toISOString().slice(0, 10)
}

/** Días de calendario entre dos fechas ISO (negativo si `toIso` es anterior). */
function daysBetween(fromIso: string, toIso: string): number {
  const a = parts(fromIso)
  const b = parts(toIso)
  return Math.round((Date.UTC(b.y, b.m, b.d) - Date.UTC(a.y, a.m, a.d)) / DAY_MS)
}

/** Fecha ISO del día de calendario LOCAL de `date` (no la de UTC: a las 00:30 en España sigue siendo hoy). */
export function localIsoDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** Hoja de calendario (himekuri) de un día. */
export interface CalendarDay {
  readonly iso: string
  readonly year: number
  readonly day: number
  /** '五月' */
  readonly monthKanji: string
  /** 'mayo' */
  readonly monthName: string
  /** '土' */
  readonly weekdayKanji: string
  /** 'sáb' */
  readonly weekdayShort: string
}

export function calendarDay(iso: string): CalendarDay {
  const { y, m, d } = parts(iso)
  const weekday = new Date(Date.UTC(y, m, d)).getUTCDay()
  return {
    iso,
    year: y,
    day: d,
    monthKanji: `${MONTH_NUMERALS[m]}月`,
    monthName: MONTHS[m],
    weekdayKanji: WEEKDAY_KANJI[weekday],
    weekdayShort: WEEKDAY_SHORT[weekday],
  }
}

/** 'Del 8 al 29 de mayo de 2027' (mismo mes), 'Del 30 de abril al 2 de mayo de 2027'… */
export function formatDateSpan(fromIso: string, toIso: string): string {
  const a = parts(fromIso)
  const b = parts(toIso)
  const sameYear = a.y === b.y
  const from = a.m === b.m && sameYear ? `${a.d}` : `${a.d} de ${MONTHS[a.m]}${sameYear ? '' : ` de ${a.y}`}`
  return `Del ${from} al ${b.d} de ${MONTHS[b.m]} de ${b.y}`
}

/** Estado de la cuenta atrás del viaje según el día de hoy. */
export type Countdown =
  | { readonly kind: 'before'; readonly days: number }
  | { readonly kind: 'departure' }
  | { readonly kind: 'during'; readonly day: number; readonly total: number }
  | { readonly kind: 'after' }

/**
 * Cuenta atrás: antes de la salida, días que faltan; el día de la salida, «hoy»; durante el
 * viaje, día X de N (el día 1 es el siguiente a la salida, como en el itinerario); después, fin.
 */
export function tripCountdown(departureIso: string, returnIso: string, todayIso: string): Countdown {
  const elapsed = daysBetween(departureIso, todayIso)
  const total = daysBetween(departureIso, returnIso)
  if (elapsed < 0) return { kind: 'before', days: -elapsed }
  if (elapsed === 0) return { kind: 'departure' }
  if (elapsed <= total) return { kind: 'during', day: elapsed, total }
  return { kind: 'after' }
}

/** Texto de la cuenta atrás: cifra o palabra destacada y etiqueta en una o dos líneas. */
export function countdownText(c: Countdown): { value: string; label: string[] } {
  switch (c.kind) {
    case 'before':
      return { value: String(c.days), label: [c.days === 1 ? 'día para' : 'días para', 'despegar'] }
    case 'departure':
      return { value: 'Hoy', label: ['despegamos'] }
    case 'during':
      return { value: `Día ${c.day}`, label: [`de ${c.total}`] }
    case 'after':
      return { value: 'Viaje', label: ['completado'] }
  }
}

const NUMBER_WORDS = ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez']

/** Cifra pequeña en letra para el texto corrido ('seis bases'); de 11 en adelante, en cifras. */
export function numberWord(n: number): string {
  return NUMBER_WORDS[n] ?? String(n)
}

/** '8 → 29 mayo 2027' (mismo mes) o '30 abril → 2 mayo 2027'. */
export function formatDateRange(fromIso: string, toIso: string): string {
  const a = parts(fromIso)
  const b = parts(toIso)
  const from = a.m === b.m && a.y === b.y ? `${a.d}` : `${a.d} ${MONTHS[a.m]}${a.y === b.y ? '' : ` ${a.y}`}`
  return `${from} → ${b.d} ${MONTHS[b.m]} ${b.y}`
}

export interface TripSummary {
  readonly days: number
  readonly nights: number
  readonly bases: number
  readonly excursions: number
  readonly travelers: number
  /** Rango de fechas del viaje completo, salida incluida ('8 → 29 mayo 2027'). */
  readonly dateRange: string
  /** Salida desde España, ISO: víspera del primer día del itinerario. */
  readonly departure: string
  /** Regreso, ISO: último día del itinerario. */
  readonly returnDate: string
}

export function tripSummary(): TripSummary {
  const first = itinerary[0].date
  const last = itinerary[itinerary.length - 1].date
  const departure = dayBefore(first)
  return {
    days: itinerary.length,
    nights: itinerary.length - 1,
    bases: new Set(itinerary.map((d) => d.citySlug)).size,
    excursions: excursions.length,
    travelers: TRAVELERS,
    dateRange: formatDateRange(departure, last),
    departure,
    returnDate: last,
  }
}
