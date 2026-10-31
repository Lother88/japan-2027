/**
 * Resumen del viaje derivado de los datos (sin cifras escritas a mano en la UI).
 *
 * - Días: los del itinerario (llegada a Narita → vuelo de regreso).
 * - Noches en Japón: días − 1 (el último día se vuela de vuelta).
 * - Salida: la víspera del primer día (vuelo de ida nocturno desde España).
 * - Bases: ciudades distintas con pernocta o día en el itinerario.
 */
import { itinerary } from './itinerary'
import { excursions } from './excursions'

/** Viajeros del grupo (dato del viaje, no derivable del itinerario). */
export const TRAVELERS = 4

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

function parts(iso: string): { y: number; m: number; d: number } {
  const [y, m, d] = iso.split('-').map(Number)
  return { y, m: m - 1, d }
}

/** Fecha ISO del día anterior (UTC, sin depender de la zona horaria local). */
function dayBefore(iso: string): string {
  const { y, m, d } = parts(iso)
  return new Date(Date.UTC(y, m, d - 1)).toISOString().slice(0, 10)
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
}

export function tripSummary(): TripSummary {
  const first = itinerary[0].date
  const last = itinerary[itinerary.length - 1].date
  return {
    days: itinerary.length,
    nights: itinerary.length - 1,
    bases: new Set(itinerary.map((d) => d.citySlug)).size,
    excursions: excursions.length,
    travelers: TRAVELERS,
    dateRange: formatDateRange(dayBefore(first), last),
  }
}
