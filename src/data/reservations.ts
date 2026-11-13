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
    how: 'Ryokan por Booking; lanzadera por teléfono o formulario web',
    date: '2027-05-12',
    dayId: 12,
  },
  {
    what: 'Bus Nōhi Kanazawa → Takayama',
    how: 'Online, desde un mes antes (asiento asignado)',
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
    what: 'Bus Nōhi Takayama ⇄ Shirakawa-go (7:20 ida, 11:10 vuelta)',
    how: 'Online, desde un mes antes',
    date: '2027-05-17',
    dayId: 17,
  },
  {
    what: 'Castillo Nijō: palacio Honmaru (franja con hora, opcional)',
    how: 'Web oficial, desde 30 días antes; 1.000 ¥ aparte',
    date: '2027-05-19',
    dayId: 19,
  },
  {
    what: 'Tokyo Skytree (franja del atardecer)',
    how: 'Online',
    date: '2027-05-26',
    dayId: 26,
  },
] as const
