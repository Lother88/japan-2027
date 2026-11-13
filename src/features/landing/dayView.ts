/**
 * Vista de un día del itinerario: textos y datos derivados que comparten la tira de fechas,
 * la cabecera del día, la línea de tiempo y la hoja de cada paso (todo se calcula al compilar).
 */
import type { Day, DayRule, Step, StepType, Zone } from '@/data/types'
import { cities, itinerary } from '@/data'

/** Nombre corto de la ciudad (sin el paréntesis: «Takaragawa (Minakami)» → «Takaragawa»). */
export function cityName(slug: string): string {
  const raw = cities.find((c) => c.slug === slug)?.name ?? slug
  return raw.replace(/\s*\(.*\)/, '')
}

/** Subtítulo del día: el texto tras el último «—» del título (o el título entero). */
export function daySubtitle(day: Day): string {
  const dash = day.title.lastIndexOf('—')
  return dash >= 0 ? day.title.slice(dash + 1).trim() : day.title
}

/** Posición del día en el viaje (1..21) y total de días. */
export function dayPosition(day: Day): { n: number; total: number } {
  return { n: itinerary.indexOf(day) + 1, total: itinerary.length }
}

/**
 * Día con maletas: el primero (llegada), el último (salida) y cada cambio de hotel. Las
 * excursiones de ida y vuelta llevan trayecto pero no mudanza.
 */
export function isMovingDay(day: Day): boolean {
  const i = itinerary.indexOf(day)
  if (i <= 0) return true
  return day.hotelId !== itinerary[i - 1].hotelId
}

/** Criterios de planificación: etiqueta corta (chip) y explicación (lectores de pantalla). */
export const RULE_LABELS: Record<DayRule, { short: string; long: string }> = {
  cierre: { short: 'Fecha fija', long: 'cierres o fecha fija' },
  laborable: { short: 'Laborable', long: 'entre semana hay menos turismo local' },
  oleada: { short: 'Primera oleada', long: 'llegar antes que las masas' },
  finde: { short: 'Finde', long: 'el fin de semana se gana algo' },
}

export const STEP_TYPE_LABELS: Record<StepType, string> = {
  visita: 'Visita',
  comida: 'Comida',
  traslado: 'Traslado',
  compras: 'Compras',
  descanso: 'Descanso',
  noche: 'Noche',
}

/** Hora exacta «HH:MM» (frente a las vagas «mañana», «tarde» y «noche»). */
export function isExactTime(time: string): boolean {
  return /^\d{1,2}:\d{2}$/.test(time)
}

/** Búsqueda de Google Maps de un sitio. */
export function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

/**
 * Enlace a Maps de un paso: su texto `maps`; si no tiene, la zona + la ciudad; si tampoco hay
 * zona, la etiqueta del paso + la ciudad del día.
 */
export function stepMapsUrl(step: Step, zone: Zone | undefined, day: Day): string {
  if (step.maps) return mapsUrl(step.maps)
  if (zone) return mapsUrl(`${zone.name}, ${cityName(zone.citySlug)}`)
  return mapsUrl(`${step.label}, ${cityName(day.citySlug)}`)
}

/** Clave estable de un paso para «hecho» (localStorage): fecha + posición. */
export function stepKey(day: Day, index: number): string {
  return `${day.date}#${index}`
}

/** Id del botón de un paso (destino de las filas «Ahora / Después»). */
export function stepId(day: Day, index: number): string {
  return `paso-${day.id}-${index}`
}

/** Primer kanji del nombre de un POI («Fushimi Inari Taisha (伏見稲荷大社)» → «伏»). */
export function firstKanji(text: string): string | undefined {
  return text.match(/[㐀-鿿]/)?.[0]
}
