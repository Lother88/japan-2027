/**
 * routeStops — paradas del panel de itinerario de «La ruta» (RouteSection.astro), derivadas
 * solo de src/data (nada escrito a mano sobre el viaje).
 *
 * Regla de días: cada día del itinerario cuenta para su `citySlug` (la base donde se duerme o
 * desde la que se sale ese día). Los días seguidos en la misma base forman una estancia; Tokio
 * sale dos veces (llegada y vuelta). El último día cuenta en su estancia aunque sea el del
 * vuelo, así que la suma de todas las estancias es el total de días del viaje (`itinerary.length`).
 *
 * Excursiones: cada una cuelga de una estancia de su base (`fromSlug`); su día es el primero del
 * itinerario con alguna zona de la ciudad de destino. Si ese día no cae en una estancia de la
 * base, se cuelga de la primera estancia de esa base.
 */
import { cities, excursions, itinerary, zonesForDay } from '@/data'
import { getCityMeta } from '@/features/landing/theme'

export interface StopExcursion {
  readonly slug: string
  readonly name: string
  readonly kanji: string
  /** Día del itinerario en que se hace (undefined si ninguna zona lo indica). */
  readonly dayId: number | undefined
}

export interface RouteStop {
  readonly slug: string
  readonly name: string
  readonly kanji: string
  /** Color de acento de la ciudad (variable CSS de theme.ts). */
  readonly accent: string
  readonly firstDayId: number
  readonly days: number
  readonly fromIso: string
  readonly toIso: string
  readonly excursions: readonly StopExcursion[]
}

const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

/** Nombre corto: sin el paréntesis («Takaragawa (Minakami)» → «Takaragawa»). */
function shortName(slug: string): string {
  const name = cities.find((c) => c.slug === slug)?.name ?? slug
  return name.replace(/\s*\(.*\)/, '')
}

function dayAndMonth(iso: string): { day: number; month: number } {
  const [, m, d] = iso.split('-').map(Number)
  return { day: d ?? 1, month: (m ?? 1) - 1 }
}

/** «9–12 may», «13 may» o, si cambia el mes, «30 abr – 2 may». */
export function formatStayRange(fromIso: string, toIso: string): string {
  const a = dayAndMonth(fromIso)
  const b = dayAndMonth(toIso)
  if (fromIso === toIso) return `${a.day} ${MONTHS_SHORT[a.month]}`
  if (a.month === b.month) return `${a.day}–${b.day} ${MONTHS_SHORT[b.month]}`
  return `${a.day} ${MONTHS_SHORT[a.month]} – ${b.day} ${MONTHS_SHORT[b.month]}`
}

/** «1 día» / «4 días». */
export function daysLabel(n: number): string {
  return n === 1 ? 'día' : 'días'
}

/** Primer día del itinerario con alguna zona en la ciudad `slug`. */
function firstDayIn(slug: string): number | undefined {
  return itinerary.find((d) => zonesForDay(d.id).some((z) => z.citySlug === slug))?.id
}

export function routeStops(): RouteStop[] {
  const stops: { slug: string; dayIds: number[]; fromIso: string; toIso: string }[] = []
  for (const day of itinerary) {
    const last = stops[stops.length - 1]
    if (last && last.slug === day.citySlug) {
      last.dayIds.push(day.id)
      last.toIso = day.date
    } else {
      stops.push({ slug: day.citySlug, dayIds: [day.id], fromIso: day.date, toIso: day.date })
    }
  }

  const excursionsByStop = new Map<number, StopExcursion[]>()
  for (const ex of excursions) {
    const dayId = firstDayIn(ex.toSlug)
    const bases = stops.map((s, i) => ({ s, i })).filter(({ s }) => s.slug === ex.fromSlug)
    if (!bases.length) continue
    const host = bases.find(({ s }) => dayId !== undefined && s.dayIds.includes(dayId)) ?? bases[0]
    const list = excursionsByStop.get(host.i) ?? []
    list.push({ slug: ex.toSlug, name: shortName(ex.toSlug), kanji: getCityMeta(ex.toSlug).kanji, dayId })
    excursionsByStop.set(host.i, list)
  }

  return stops.map((s, i) => ({
    slug: s.slug,
    name: shortName(s.slug),
    kanji: getCityMeta(s.slug).kanji,
    accent: getCityMeta(s.slug).dot,
    firstDayId: s.dayIds[0],
    days: s.dayIds.length,
    fromIso: s.fromIso,
    toIso: s.toIso,
    // Excursiones en orden de día dentro de su estancia
    excursions: (excursionsByStop.get(i) ?? []).sort((a, b) => (a.dayId ?? 0) - (b.dayId ?? 0)),
  }))
}
