/**
 * Formato de cifras y fechas de la página de hoteles (es-ES), como en el informe original.
 * Todo se calcula en el build: la página sale con el texto ya escrito.
 */
import { dateParts } from '@/features/landing/theme'

const NBSP = '\u00a0'
const isNumber = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n)

/** '1054 €' (redondeado, con espacio duro para que la cifra no se separe del símbolo); '—' sin dato. */
export function euros(amount: number | null | undefined): string {
  return isNumber(amount) ? `${Math.round(amount).toLocaleString('es-ES')}${NBSP}€` : '—'
}

/** Nota con un decimal y coma: 8 → '8,0'; '—' sin dato. */
export function score(value: number | null | undefined): string {
  return isNumber(value) ? value.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : '—'
}

/** Número de opiniones: 4822 → '4822' · 12480 → '12.480' (es-ES agrupa a partir de cinco cifras). */
export function count(value: number): string {
  return value.toLocaleString('es-ES')
}

/** 'sáb 8 may' */
export function shortDate(iso: string): string {
  const { weekday, day, month } = dateParts(iso)
  return `${weekday} ${day} ${month}`
}

/** 'sáb 8 may → mié 12 may' */
export function stayDates(checkIn: string, checkOut: string): string {
  return `${shortDate(checkIn)} → ${shortDate(checkOut)}`
}

/** '4 noches' · '1 noche' */
export function nights(n: number): string {
  return `${n} ${n === 1 ? 'noche' : 'noches'}`
}

/** '13 de noviembre de 2026': el día en España, donde se hizo la búsqueda (no depende del servidor). */
export function longDate(isoDateTime: string): string {
  return new Date(isoDateTime).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  })
}
