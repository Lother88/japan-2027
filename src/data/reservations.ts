/**
 * Reservas que hay que hacer con antelación.
 *
 * Fuente: docs/propuestas-diseno/itinerario-data.js (`reservations`).
 * `dayId` = Day.id (día del mes) del día en que se usa la reserva.
 */

import type { Reservation } from './types'

export const reservations: readonly Reservation[] = [
  {
    what: 'Ryokan Ōsenkaku + lanzadera de ida y vuelta',
    how: 'Ryokan por Booking; lanzadera por teléfono',
    date: '2027-05-12',
    dayId: 12,
  },
  {
    what: 'Bus Nōhi Kanazawa → Takayama',
    how: 'Reserva online',
    date: '2027-05-15',
    dayId: 15,
  },
  {
    what: 'Shibuya Sky (franja del atardecer)',
    how: 'Online, ~2 semanas antes',
    date: '2027-05-10',
    dayId: 10,
  },
  {
    what: 'Museo de la Paz de Hiroshima (franja 7:30–8:30, opcional)',
    how: 'Online',
    date: '2027-05-23',
    dayId: 23,
  },
  {
    what: 'Tokyo Skytree (franja del atardecer)',
    how: 'Online',
    date: '2027-05-26',
    dayId: 26,
  },
] as const
