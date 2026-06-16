/**
 * Itinerary data — Tokio bloque 1 pilot (días 9–12)
 *
 * ANTI-SPOILER RULE (NOSPOIL-04):
 * - TimeSlot.summary describes category/encaje ("qué es"), NOT the experience ("qué verás")
 * - No narrative, no spoilers, no "lo que no te puedes perder"
 * - Zone references are IDs only — Zone.practical has the logistics
 *
 * Data source: itinerario-ruta-redonda-v1.md (días 9–12)
 */

import type { Day } from './types'

export const itinerary: readonly Day[] = [
  // ── Día 9 — Domingo 9 mayo 2027 ─────────────────────────────────────────
  {
    id: 9,
    date: '2027-05-09',
    citySlug: 'tokio',
    title: 'Tokio · bloque 1 — Llegada',
    slots: [
      {
        key: 'morning',
        label: 'Mañana / Llegada',
        summary: 'Llegada a Narita (~12:45) → traslado al hotel en Tokio. Día tapón para aclimatarse al jet lag.',
        zones: [],
      },
      {
        key: 'afternoon',
        label: 'Tarde suave',
        summary: 'Paseo de aclimatación por el barrio histórico de Edo — templos, comida callejera y ambiente tranquilo.',
        zones: [{ zoneId: 'asakusa' }],
      },
    ],
  },

  // ── Día 10 — Lunes 10 mayo 2027 ─────────────────────────────────────────
  {
    id: 10,
    date: '2027-05-10',
    citySlug: 'tokio',
    title: 'Tokio · bloque 1 — Shibuya, Harajuku y Shinjuku',
    slots: [
      {
        key: 'morning',
        label: 'Mañana',
        summary: 'Epicentro comercial y juvenil con cruce peatonal icónico, seguido de santuario sintoísta en parque urbano y calle de moda alternativa.',
        zones: [
          { zoneId: 'shibuya' },
          { zoneId: 'harajuku-meiji' },
        ],
      },
      {
        key: 'afternoon',
        label: 'Tarde',
        summary: 'Barrio total de Tokio: rascacielos, compras de segunda mano, callejones históricos de izakaya y vida nocturna.',
        zones: [{ zoneId: 'shinjuku' }],
      },
    ],
  },

  // ── Día 11 — Martes 11 mayo 2027 ─────────────────────────────────────────
  {
    id: 11,
    date: '2027-05-11',
    citySlug: 'tokio',
    title: 'Tokio · bloque 1 — Ueno y Yanaka',
    slots: [
      {
        key: 'morning',
        label: 'Mañana',
        summary: 'Gran parque histórico con museos nacionales de arte e historia japonesa y mercado callejero de barrio.',
        zones: [{ zoneId: 'ueno' }],
      },
      {
        key: 'afternoon',
        label: 'Tarde',
        summary: 'Barrio residencial histórico que conserva la atmósfera del Tokio anterior a la guerra — artesanía local, santuarios y calles tranquilas.',
        zones: [{ zoneId: 'yanaka' }],
      },
    ],
  },

  // ── Día 12 — Miércoles 12 mayo 2027 ──────────────────────────────────────
  {
    id: 12,
    date: '2027-05-12',
    citySlug: 'tokio',
    title: 'Tokio · bloque 1 — Palacio Imperial, Ginza y Tsukiji',
    slots: [
      {
        key: 'morning',
        label: 'Mañana',
        summary: 'Jardines históricos del palacio imperial y mercado exterior de marisco con más de un siglo de tradición.',
        zones: [
          { zoneId: 'palacio-imperial' },
          { zoneId: 'tsukiji' },
        ],
      },
      {
        key: 'afternoon',
        label: 'Tarde',
        summary: 'Distrito más exclusivo de Tokio con grandes almacenes históricos, flagships de diseño japonés y teatro de kabuki. Tarde libre / Akihabara (subgrupo).',
        zones: [{ zoneId: 'ginza' }],
      },
    ],
  },
] as const
