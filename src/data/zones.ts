/**
 * Zone data — Tokio bloque 1 pilot (días 9–12)
 *
 * ANTI-SPOILER RULE (NOSPOIL-01, NOSPOIL-04):
 * - NO `description` field in any Zone object
 * - `practical` contains logistics only: access, hours, logistics tips
 * - Tags describe category/type, not what you'll see
 * - `TimeSlot.summary` in itinerary.ts may describe category context, never the experience
 *
 * Coordinates: [lng, lat] GeoJSON order.
 * Sources: OpenStreetMap, Wikipedia, Google Maps public data (approximate centers).
 */

import type { Zone } from './types'

export const zones: readonly Zone[] = [
  // ── Día 9 — Asakusa ────────────────────────────────────────────────────
  {
    id: 'asakusa',
    name: 'Asakusa',
    citySlug: 'tokio',
    coordinates: [139.7966, 35.7148],
    tags: ['tradicional', 'templos', 'historico', 'shitamachi'],
    practical: {
      access: 'Metro Ginza (G19) o Toei Asakusa (A18) — Estación Asakusa',
      hours: 'Templo Sensoji: acceso libre 24h; sala principal 6:00–17:00. Nakamise: desde 9:00',
      logistics: [
        'Llegar antes de las 8:00 para evitar grupos organizados',
        'Efectivo imprescindible en muchos puestos de Nakamise',
        'JR Pass NO cubre el metro de Tokio — usar Suica/Pasmo',
      ],
    },
  },

  // ── Día 10 — Shibuya ───────────────────────────────────────────────────
  {
    id: 'shibuya',
    name: 'Shibuya',
    citySlug: 'tokio',
    coordinates: [139.7016, 35.6585],
    tags: ['comercial', 'juvenil', 'iconico', 'entretenimiento'],
    practical: {
      access: 'JR Yamanote Line o Metro Ginza — Estación Shibuya, salida Hachiko',
      hours: 'Tiendas: 10:00–21:00. Shibuya SKY (mirador): reserva online recomendada',
      logistics: [
        'Pokémon Center y Nintendo Tokyo en Shibuya PARCO planta 6: 10:00–21:00',
        'Mejor mañana para el cruce peatonal (menos concurrido)',
        'Reservar Shibuya SKY con 2 semanas de antelación',
      ],
    },
  },

  // ── Día 10 — Harajuku / Meiji Jingu ────────────────────────────────────
  {
    id: 'harajuku-meiji',
    name: 'Harajuku / Meiji Jingū',
    citySlug: 'tokio',
    coordinates: [139.6993, 35.6762],
    tags: ['santuario', 'moda-alternativa', 'parque', 'cultura-pop'],
    practical: {
      access: 'JR Yamanote — Estación Harajuku (salida Takeshita o Omotesando)',
      hours: 'Meiji Jingū: amanecer–anochecer. Takeshita Street: tiendas desde 11:00',
      logistics: [
        'Meiji Jingū: recinto gratuito; tesoro interior ~500¥',
        'Takeshita Street: entre semana es más manejable que fines de semana',
        'Ropa vintage de calidad en Cat Street / Ura-Harajuku',
      ],
    },
  },

  // ── Día 10 — Shinjuku ──────────────────────────────────────────────────
  {
    id: 'shinjuku',
    name: 'Shinjuku',
    citySlug: 'tokio',
    coordinates: [139.6993, 35.6896],
    tags: ['compras', 'gastronomia', 'ocio-nocturno', 'segunda-mano'],
    practical: {
      access: 'JR Yamanote — Estación Shinjuku (salida Oeste para Book Off y Gobierno Metropolitano)',
      hours: 'Book Off PLUS: 10:00–23:00. Mirador Gobierno Metropolitano: 9:30–22:30 (cierra algunos martes)',
      logistics: [
        'Mirador gratuito del Gobierno Metropolitano — sin reserva, planta 45',
        'Book Off PLUS: Nishishinjuku 1-chome, plantas 3F–6F',
        'Omoide Yokocho: mejor entre 18:00 y 21:00',
      ],
    },
  },

  // ── Día 11 — Ueno ──────────────────────────────────────────────────────
  {
    id: 'ueno',
    name: 'Ueno',
    citySlug: 'tokio',
    coordinates: [139.7744, 35.7141],
    tags: ['museos', 'parque', 'historico', 'shitamachi'],
    practical: {
      access: 'JR Yamanote o Keihin-Tohoku — Estación Ueno (salida Park para el parque; Shinobazu para Ameyoko)',
      hours: 'Museo Nacional de Tokio: 9:30–17:00 (vie/sáb hasta 20:00), cerrado lunes. Zoo: 9:30–17:00, cerrado lunes',
      logistics: [
        'Elegir un museo principal — el TNM solo puede ocupar 3–4 horas',
        'Ameyoko Market: mejor 11:00–15:00',
        'Efectivo imprescindible en puestos de Ameyoko',
        'Combina perfectamente con Akihabara a 15 min a pie',
      ],
    },
  },

  // ── Día 11 — Yanaka ────────────────────────────────────────────────────
  {
    id: 'yanaka',
    name: 'Yanaka',
    citySlug: 'tokio',
    coordinates: [139.7694, 35.7275],
    tags: ['shitamachi', 'historico', 'artesania', 'tranquilo'],
    practical: {
      access: 'JR Yamanote o Keisei — Estación Nippori, salida norte. Metro Chiyoda — Nezu o Sendagi',
      hours: 'Yanaka Ginza: tiendas desde 10:00, muchas cierran a las 17:00–18:00. Cerrado lunes muchas tiendas',
      logistics: [
        'Efectivo en la mayoría de tiendas de Yanaka Ginza',
        'Bajar por las escaleras Yūyake Dandan desde Nippori',
        'Combinación natural con Ueno (20 min a pie hacia el sur)',
        'Nezu Jinja: recinto gratuito, horario aprox. 5:30–18:00 en mayo',
      ],
    },
  },

  // ── Día 12 — Palacio Imperial ───────────────────────────────────────────
  {
    id: 'palacio-imperial',
    name: 'Palacio Imperial',
    citySlug: 'tokio',
    coordinates: [139.7528, 35.6842],
    tags: ['historico', 'jardines', 'iconico', 'imperial'],
    practical: {
      access: 'Metro Marunouchi o Chiyoda — Estación Otemachi o Nijubashimae',
      hours: 'Jardín Este: 9:00–16:30 (última entrada 16:00), cerrado lunes y viernes',
      logistics: [
        'Jardín Este: gratuito, acceso por puerta Otemon',
        'Interior del palacio no accesible sin reserva especial',
        'Combina fácilmente con Ginza (15 min a pie) y Tsukiji (20 min)',
      ],
    },
  },

  // ── Día 12 — Ginza ─────────────────────────────────────────────────────
  {
    id: 'ginza',
    name: 'Ginza',
    citySlug: 'tokio',
    coordinates: [139.7647, 35.6717],
    tags: ['lujo', 'compras', 'arte', 'gastronomia'],
    practical: {
      access: 'Metro Ginza (líneas Ginza, Marunouchi, Hibiya) — Estación Ginza. JR Yamanote — Estación Yurakucho (5 min a pie)',
      hours: 'Tiendas: 10:00–20:00. Kabuki-za: sesiones según programa. Chuo-dori peatonal: sáb/dom/festivos 12:00–18:00',
      logistics: [
        'Itoya (papelería): 12 plantas, entrada gratuita, 10:00–20:00',
        'Uniqlo Ginza Flagship: 12 plantas, tax-free con pasaporte',
        'Kabuki-za: entrada de acto único (hitomakumi) desde ¥500, solo efectivo',
        'Galerías Shiseido y Ginza Graphic: gratuitas',
      ],
    },
  },

  // ── Día 12 — Tsukiji ───────────────────────────────────────────────────
  {
    id: 'tsukiji',
    name: 'Tsukiji (Mercado Exterior)',
    citySlug: 'tokio',
    coordinates: [139.7706, 35.6654],
    tags: ['gastronomia', 'mercado', 'historico', 'marisco'],
    practical: {
      access: 'Metro Hibiya — Estación Tsukiji (salida 1) o Metro Oedo — Tsukijishijo',
      hours: 'Mercado exterior: 7:00–14:00 aprox. Cerrado domingos y algunos miércoles',
      logistics: [
        'Llegar entre 7:00 y 9:00 para la mayor variedad',
        'Efectivo en la mayoría de puestos',
        'Tsukiji Honganji (templo) a 2 min: acceso libre 6:00–16:00',
        'Combina perfectamente con Ginza (15 min a pie hacia el norte)',
      ],
    },
  },
] as const
