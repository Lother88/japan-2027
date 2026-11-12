/**
 * Itinerary data — Japón 2027, ruta REDONDA por Narita (días 8–28 de mayo)
 *
 * Vuelos: llegada a Narita (NRT T1) el sáb 8 a las 09:30 · regreso desde NRT T1 el vie 28 a
 * las 11:20. La salida desde Barcelona (vie 7) NO es un Day: vive en trip.ts (TRIP_DATES).
 * Day.id = día del mes (8..28), estable: ancla #dia-NN.
 *
 * ANTI-SPOILER RULE (NOSPOIL-04):
 * - Step.label es logístico: lugar + acción u hora. Nunca lo que se ve o se vive dentro.
 * - Zone references are IDs only — Zone.practical has the logistics; el contexto cultural
 *   vive aparte en context.ts (plegado en la UI).
 *
 * `steps` es la fuente del plan de cada día (la UI lo pinta como línea de tiempo).
 *
 * Transfers (trayectos): cada cambio de hotel y cada excursión de ida y vuelta lleva su
 * `Transfer`. Solo logística, sin spoilers. Las maletas viajan siempre con el grupo (sin
 * mensajería): taxi del hotel a la estación y de la estación al hotel siguiente.
 *
 * Data source: docs/revision-itinerario-fechas-2027.md (§3, decisiones) y
 * docs/propuestas-diseno/itinerario-data.js (pasos y horas).
 */

import type { Day } from './types'

// ── Días ─────────────────────────────────────────────────────────────────────

export const itinerary: readonly Day[] = [
  // ── Día 8 — Sábado 8 mayo 2027 — Llegada ─────────────────────────────────
  {
    id: 8,
    date: '2027-05-08',
    citySlug: 'tokio',
    title: 'Tokio · bloque 1 — Llegada a Tokio',
    hotelId: 'tokio1',
    transfers: [
      {
        from: 'Aeropuerto de Narita (NRT T1)',
        to: 'Ueno (hotel)',
        mode: 'tren',
        line: 'Keisei Skyliner (Narita T1 → Keisei Ueno) + taxi al hotel',
        duration: '~41 min',
        notes: [
          'Aterrizaje a las 09:30 (LH710); hotel hacia las 11:30',
          'Comprar o activar la tarjeta IC (Suica/PASMO) en el aeropuerto',
          'Dejar las maletas en el hotel si aún no se puede hacer el check-in',
        ],
      },
    ],
    steps: [
      { time: '09:30', label: 'Aterrizaje en Narita T1', type: 'traslado', maps: 'Narita Airport Terminal 1' },
      { time: '10:15', label: 'Skyliner a Ueno', type: 'traslado', maps: 'Keisei Ueno Station' },
      { time: '11:30', label: 'Hotel en Ueno · dejar maletas', type: 'descanso', maps: 'Ueno Station Tokyo' },
      { time: '16:00', label: 'Kanda Matsuri: el desfile al paso (si se confirma)', type: 'visita', zoneId: 'kanda', maps: 'Kanda Myojin', optional: true },
      { time: '19:00', label: 'Si no hay festival: Asakusa de noche (Sensō-ji)', type: 'noche', zoneId: 'asakusa', maps: 'Senso-ji', optional: true },
    ],
    notes: [
      'Tarde suave: jet lag.',
      'Kanda Matsuri 2027: fechas por confirmar (posible desfile el sáb 8 y entrada de mikoshi el dom 9; alternativa, 15–16).',
      'Sensō-ji: iluminado hasta las 23:00 y tranquilo de noche.',
    ],
  },

  // ── Día 9 — Domingo 9 mayo 2027 ──────────────────────────────────────────
  {
    id: 9,
    date: '2027-05-09',
    citySlug: 'tokio',
    title: 'Tokio · bloque 1 — Palacio Imperial y Ginza',
    hotelId: 'tokio1',
    rules: ['cierre', 'finde'],
    steps: [
      { time: '09:00', label: 'Kanda Myōjin: entrada de los mikoshi (un rato)', type: 'visita', zoneId: 'kanda', maps: 'Kanda Myojin', optional: true },
      { time: '10:30', label: 'Jardines del Este del Palacio Imperial', type: 'visita', zoneId: 'palacio-imperial', maps: 'East Gardens of the Imperial Palace' },
      { time: '12:30', label: 'Comida en Marunouchi', type: 'comida', maps: 'Marunouchi Tokyo' },
      { time: '13:30', label: 'Ginza peatonal (12:00–18:00)', type: 'compras', zoneId: 'ginza', maps: 'Ginza Chuo-dori' },
      { time: '16:00', label: 'Kabuki-za: un acto (hitomakumi, efectivo)', type: 'visita', zoneId: 'ginza', maps: 'Kabukiza Theatre', optional: true },
    ],
    notes: [
      'Jardines del Este: cierran lunes y viernes.',
      'Ginza solo es peatonal en fin de semana.',
      'Tsukiji cierra el domingo: por eso va el martes.',
    ],
  },

  // ── Día 10 — Lunes 10 mayo 2027 ──────────────────────────────────────────
  {
    id: 10,
    date: '2027-05-10',
    citySlug: 'tokio',
    title: 'Tokio · bloque 1 — Meiji, Harajuku, Shibuya y Shinjuku',
    hotelId: 'tokio1',
    rules: ['laborable'],
    steps: [
      { time: '08:00', label: 'Meiji Jingū', type: 'visita', zoneId: 'harajuku-meiji', maps: 'Meiji Jingu' },
      { time: '10:00', label: 'Takeshita-dōri (Harajuku)', type: 'compras', zoneId: 'harajuku-meiji', maps: 'Takeshita Street' },
      { time: '11:30', label: 'Omotesandō', type: 'compras', zoneId: 'harajuku-meiji', maps: 'Omotesando' },
      { time: '13:00', label: 'Comida', type: 'comida' },
      { time: '14:30', label: 'Cruce de Shibuya y Hachikō', type: 'visita', zoneId: 'shibuya', maps: 'Shibuya Scramble Crossing' },
      { time: '15:30', label: 'Shibuya Parco 6F: Nintendo · Pokémon · Capcom · Jump', type: 'compras', zoneId: 'shibuya', maps: 'Shibuya PARCO' },
      { time: '18:00', label: 'Shibuya Sky al atardecer (~18:40)', type: 'visita', zoneId: 'shibuya', maps: 'Shibuya Sky', reserve: true },
      { time: '20:00', label: 'Shinjuku de noche: Omoide Yokochō · Golden Gai · Kabukichō', type: 'noche', zoneId: 'shinjuku', maps: 'Omoide Yokocho' },
    ],
    notes: [
      'Harajuku es intransitable en fin de semana: por eso lunes.',
      'Shibuya Sky: entrada con hora para la franja del atardecer, comprar con antelación.',
    ],
  },

  // ── Día 11 — Martes 11 mayo 2027 ─────────────────────────────────────────
  {
    id: 11,
    date: '2027-05-11',
    citySlug: 'tokio',
    title: 'Tokio · bloque 1 — Ueno, Tsukiji y Yanaka',
    hotelId: 'tokio1',
    rules: ['cierre'],
    steps: [
      { time: '09:30', label: 'Museo Nacional de Tokio (apertura)', type: 'visita', zoneId: 'ueno', maps: 'Tokyo National Museum' },
      { time: '11:30', label: 'Línea Hibiya directa de Ueno a Tsukiji', type: 'traslado' },
      { time: '12:00', label: 'Comida en el mercado exterior de Tsukiji', type: 'comida', zoneId: 'tsukiji', maps: 'Tsukiji Outer Market' },
      { time: '13:30', label: 'Tsukiji Hongwanji', type: 'visita', zoneId: 'tsukiji', maps: 'Tsukiji Hongwanji' },
      { time: '14:30', label: 'Línea Hibiya de vuelta hacia Ueno', type: 'traslado' },
      { time: '15:00', label: 'Yanaka: Yanaka Ginza, cementerio, Tennō-ji', type: 'visita', zoneId: 'yanaka', maps: 'Yanaka Ginza' },
      { time: '17:00', label: 'Nezu Jinja', type: 'visita', zoneId: 'yanaka', maps: 'Nezu Shrine' },
    ],
    notes: [
      'El museo cierra los lunes y Tsukiji los domingos.',
      'Tsukiji: la asociación del mercado pide a los turistas ir de 9:00 a 14:00.',
      'Nezu Jinja: el jardín de azaleas solo abre en abril.',
    ],
  },

  // ── Día 12 — Miércoles 12 mayo 2027 — Takaragawa Onsen (1 noche) ─────────
  {
    id: 12,
    date: '2027-05-12',
    citySlug: 'takaragawa',
    title: 'Tokio → Takaragawa — Onsen en Takaragawa',
    hotelId: 'takaragawa',
    rules: ['laborable'],
    transfers: [
      {
        from: 'Tokio (Ueno)',
        to: 'Takaragawa Onsen (Minakami)',
        mode: 'shinkansen',
        line: 'Jōetsu Shinkansen (Ueno → Jōmō-Kōgen) + lanzadera del ryokan',
        duration: '~1h15 + ~45 min de lanzadera',
        notes: [
          'Lanzadera hacia el ryokan a las 13:00 o a las 15:00: reserva por teléfono',
          'Llegada al ryokan hacia las 13:45 o las 15:45',
          'Equipaje: taxi del hotel a la estación (2 taxis o uno grande para 4 maletas)',
        ],
      },
    ],
    steps: [
      { time: 'mañana', label: 'Mañana tranquila y check-out', type: 'descanso' },
      { time: '11:00', label: 'Jōetsu Shinkansen desde Ueno a Jōmō-Kōgen', type: 'traslado', maps: 'Jomo-Kogen Station' },
      { time: '13:00', label: 'Lanzadera del ryokan (o la de las 15:00)', type: 'traslado', reserve: true },
      { time: 'tarde', label: 'Ryokan Ōsenkaku: baños', type: 'visita', zoneId: 'takaragawa-onsen', maps: 'Takaragawa Onsen Osenkaku' },
      { time: 'noche', label: 'Cena en el ryokan', type: 'comida', zoneId: 'takaragawa-onsen' },
    ],
    notes: [
      'Lanzadera: reserva por teléfono. Solo hay una de vuelta, a las 9:30.',
      'Entre semana hay menos bañistas de día (10:00–16:30) y la noche es más barata que el sábado.',
    ],
  },

  // ── Día 13 — Jueves 13 mayo 2027 — Kanazawa (noche 1) ────────────────────
  {
    id: 13,
    date: '2027-05-13',
    citySlug: 'kanazawa',
    title: 'Takaragawa → Kanazawa — Llegada a Kanazawa',
    hotelId: 'kanazawa',
    transfers: [
      {
        from: 'Takaragawa Onsen (Minakami)',
        to: 'Kanazawa',
        mode: 'shinkansen',
        line: 'Lanzadera 9:30 → Jōmō-Kōgen + Jōetsu Shinkansen a Takasaki + Hokuriku Shinkansen a Kanazawa',
        duration: '~4h30 (llegada hacia las 14:00)',
        notes: [
          'La lanzadera de las 9:30 es la única hacia la estación',
          'Transbordo en Takasaki',
          'Reservar asientos con espacio para el equipaje',
        ],
      },
    ],
    steps: [
      { time: '09:30', label: 'Lanzadera a Jōmō-Kōgen (la única)', type: 'traslado' },
      { time: '14:00', label: 'Llegada a Kanazawa · hotel', type: 'traslado', maps: 'Kanazawa Station' },
      { time: '15:30', label: 'Mercado Ōmichō (antes de las 17:00)', type: 'comida', zoneId: 'omicho', maps: 'Omicho Market' },
      { time: '17:30', label: 'Higashi Chaya al atardecer', type: 'visita', zoneId: 'higashi-chaya', maps: 'Higashi Chaya District' },
    ],
    notes: ['Kanazawa antes que Takayama: desde el onsen a Takayama serían 6,5–9 h de viaje.'],
  },

  // ── Día 14 — Viernes 14 mayo 2027 — Kanazawa (noche 2) ───────────────────
  {
    id: 14,
    date: '2027-05-14',
    citySlug: 'kanazawa',
    title: 'Kanazawa — Kenroku-en y el castillo',
    hotelId: 'kanazawa',
    rules: ['oleada'],
    laundry: true,
    steps: [
      { time: '07:00', label: 'Kenroku-en', type: 'visita', zoneId: 'kenrokuen', maps: 'Kenrokuen' },
      { time: '08:30', label: 'Parque del castillo de Kanazawa', type: 'visita', zoneId: 'kanazawa-castillo', maps: 'Kanazawa Castle Park' },
      { time: '10:00', label: 'Nagamachi y casa Nomura', type: 'visita', zoneId: 'nagamachi', maps: 'Nomura Samurai House' },
      { time: '12:00', label: 'Comida en Ōmichō', type: 'comida', zoneId: 'omicho', maps: 'Omicho Market' },
      { time: 'tarde', label: 'Tarde libre · colada 1', type: 'descanso' },
      { time: 'tarde', label: 'Paseo por Nishi Chaya y Teramachi', type: 'visita', zoneId: 'nishi-chaya', maps: 'Nishi Chaya District', optional: true },
    ],
    notes: [
      'Kenroku-en: gratis de 4:00 a 6:45 por las puertas Hasuike y Zuijinzaka.',
      'Higashi Chaya, si quedó pendiente el jueves.',
    ],
  },

  // ── Día 15 — Sábado 15 mayo 2027 — Takayama (noche 1) ────────────────────
  {
    id: 15,
    date: '2027-05-15',
    citySlug: 'takayama',
    title: 'Kanazawa → Takayama — Llegada a Takayama',
    hotelId: 'takayama',
    rules: ['finde'],
    transfers: [
      {
        from: 'Kanazawa',
        to: 'Takayama',
        mode: 'bus',
        line: 'Bus Nōhi (Kanazawa → Takayama), con reserva',
        duration: '~2h15',
        notes: [
          'Sale de la terminal de la salida este de la estación de Kanazawa',
          'Alternativa en tren por Toyama: solo 4 trenes Hida al día',
          'Comprobar los horarios de 2027 tras el cambio de marzo',
        ],
      },
    ],
    steps: [
      { time: '09:00', label: 'Bus Nōhi a Takayama', type: 'traslado', maps: 'Kanazawa Station East Exit Bus Terminal', reserve: true },
      { time: '11:30', label: 'Hotel · dejar maletas', type: 'descanso', maps: 'Takayama Station' },
      { time: '12:30', label: 'Comida: ternera de Hida', type: 'comida' },
      { time: '14:00', label: 'Yatai Kaikan + santuario Sakurayama Hachimangū', type: 'visita', zoneId: 'takayama-yatai', maps: 'Takayama Festival Floats Exhibition Hall' },
      { time: '16:00', label: 'Sanmachi (tiendas y bodegas de sake hasta ~17:00)', type: 'visita', zoneId: 'sanmachi-suji', maps: 'Sanmachi Suji' },
    ],
    notes: [
      'Yatai Kaikan: visita libre de 30–45 min; horario y precio por confirmar (~8:30/9:00–17:00, ~840 ¥).',
      'Sanmachi desde las 16:00: ya se han ido los excursionistas de día.',
    ],
  },

  // ── Día 16 — Domingo 16 mayo 2027 — Takayama (noche 2) ───────────────────
  {
    id: 16,
    date: '2027-05-16',
    citySlug: 'takayama',
    title: 'Takayama — Takayama a fondo',
    hotelId: 'takayama',
    rules: ['finde', 'oleada'],
    steps: [
      { time: '07:00', label: 'Mercado matinal de Miyagawa', type: 'comida', zoneId: 'miyagawa-asaichi', maps: 'Miyagawa Morning Market' },
      { time: '08:45', label: 'Takayama Jinya', type: 'visita', zoneId: 'takayama-jinya', maps: 'Takayama Jinya' },
      { time: '10:00', label: 'Sanmachi tranquilo', type: 'visita', zoneId: 'sanmachi-suji', maps: 'Sanmachi Suji' },
      { time: '13:00', label: 'Hida no Sato', type: 'visita', zoneId: 'hida-no-sato', maps: 'Hida Folk Village' },
    ],
    notes: [
      'Mercado de Miyagawa: 7:00–12:00.',
      'En domingo, mejor Takayama que Shirakawa-go: la ciudad absorbe a la gente.',
    ],
  },

  // ── Día 17 — Lunes 17 mayo 2027 — Shirakawa-go y Kioto (noche 1) ─────────
  {
    id: 17,
    date: '2027-05-17',
    citySlug: 'kioto',
    title: 'Takayama → Kioto — Shirakawa-go y tren a Kioto',
    hotelId: 'kioto',
    rules: ['laborable', 'oleada'],
    transfers: [
      {
        from: 'Takayama',
        to: 'Shirakawa-go',
        mode: 'bus',
        line: 'Bus Nōhi (Takayama ↔ Shirakawa-go)',
        duration: '~50 min cada sentido',
        roundTrip: true,
        notes: [
          'Bus de las 7:20, llegada a las 8:10, antes que los autocares',
          'Sin maletas: se quedan en el hotel de Takayama',
        ],
      },
      {
        from: 'Takayama',
        to: 'Kioto',
        mode: 'tren',
        line: 'JR Hida (limited express) a Nagoya + Tōkaidō Shinkansen a Kioto',
        duration: '~3h30 (llegada hacia las 17:00)',
        notes: [
          'Transbordo en Nagoya',
          'Taxi de la estación de Kioto al hotel de Shichijō',
        ],
      },
    ],
    steps: [
      { time: '07:20', label: 'Bus Nōhi a Shirakawa-go', type: 'traslado', maps: 'Takayama Nohi Bus Center' },
      { time: '08:10', label: 'Aldea de Ogimachi y mirador Shiroyama', type: 'visita', zoneId: 'shirakawago-ogimachi', maps: 'Shirakawa-go Ogimachi' },
      { time: '11:00', label: 'Bus de vuelta a Takayama · recoger maletas', type: 'traslado' },
      { time: '13:00', label: 'Tren Hida a Nagoya + Shinkansen a Kioto', type: 'traslado', maps: 'Kyoto Station' },
      { time: '17:00', label: 'Hotel en Shichijō', type: 'descanso', maps: 'Shichijo Station Keihan Kyoto' },
    ],
    notes: ['Shirakawa-go un laborable antes de las 9:00 es la mejor franja: en fin de semana hay menos buses y más gente.'],
  },

  // ── Día 18 — Martes 18 mayo 2027 — Kioto (noche 2) ───────────────────────
  {
    id: 18,
    date: '2027-05-18',
    citySlug: 'kioto',
    title: 'Kioto — Higashiyama de sur a norte',
    hotelId: 'kioto',
    rules: ['oleada'],
    steps: [
      { time: '06:00', label: 'Kiyomizu-dera', type: 'visita', zoneId: 'kiyomizu-dera', maps: 'Kiyomizu-dera' },
      { time: '07:30', label: 'Sannenzaka y Ninenzaka, antes de que abran las tiendas', type: 'visita', zoneId: 'higashiyama-sannenzaka', maps: 'Sannenzaka' },
      { time: '09:00', label: 'Kōdai-ji', type: 'visita', zoneId: 'higashiyama-sannenzaka', maps: 'Kodai-ji' },
      { time: '10:00', label: 'Parque Maruyama y Yasaka Jinja', type: 'visita', zoneId: 'gion', maps: 'Yasaka Shrine' },
      { time: '11:00', label: 'Nanzen-ji y el acueducto Suirokaku', type: 'visita', zoneId: 'higashiyama-norte', maps: 'Nanzen-ji' },
      { time: '12:30', label: 'Comida', type: 'comida' },
      { time: '14:00', label: 'Camino del Filósofo', type: 'visita', zoneId: 'higashiyama-norte', maps: "Philosopher's Path" },
      { time: '15:30', label: 'Ginkaku-ji (cierra ~17:00)', type: 'visita', zoneId: 'higashiyama-norte', maps: 'Ginkaku-ji' },
      { time: '17:30', label: 'Gion y Hanami-kōji al anochecer', type: 'noche', zoneId: 'gion', maps: 'Hanamikoji Street' },
    ],
    notes: [
      'Día largo: unos 8–10 km a pie. Si vais cansados, se puede saltar Ginkaku-ji.',
      'De Ginkaku-ji a Gion: taxi o autobús.',
      'El palacio Honmaru de Nijō cierra el 17 y el 18: por eso Nijō va el miércoles.',
    ],
  },

  // ── Día 19 — Miércoles 19 mayo 2027 — Kioto (noche 3) ────────────────────
  {
    id: 19,
    date: '2027-05-19',
    citySlug: 'kioto',
    title: 'Kioto — Arashiyama, Sanjūsangen-dō y Nijō',
    hotelId: 'kioto',
    rules: ['oleada', 'cierre'],
    steps: [
      { time: '07:00', label: 'Bosque de bambú de Sagano', type: 'visita', zoneId: 'arashiyama', maps: 'Arashiyama Bamboo Grove' },
      { time: '08:30', label: 'Tenryū-ji', type: 'visita', zoneId: 'arashiyama', maps: 'Tenryu-ji' },
      { time: '10:00', label: 'Puente Togetsukyō', type: 'visita', zoneId: 'arashiyama', maps: 'Togetsukyo Bridge' },
      { time: '12:00', label: 'Comida en Arashiyama · JR a Kioto', type: 'comida' },
      { time: '13:30', label: 'Sanjūsangen-dō', type: 'visita', zoneId: 'sanjusangendo', maps: 'Sanjusangendo' },
      { time: '15:00', label: 'Castillo Nijō (última entrada 16:00)', type: 'visita', zoneId: 'nijo', maps: 'Nijo Castle' },
    ],
    notes: [
      'Nishiki cierra parte de sus puestos los miércoles; el palacio Honmaru de Nijō cierra el 17 y el 18.',
      'Sanjūsangen-dō: 8:30–17:00, 600 ¥; unos 45–60 min.',
    ],
  },

  // ── Día 20 — Jueves 20 mayo 2027 — Kioto (noche 4) ───────────────────────
  {
    id: 20,
    date: '2027-05-20',
    citySlug: 'kioto',
    title: 'Kioto — Fushimi Inari al amanecer y Kinkaku-ji',
    hotelId: 'kioto',
    rules: ['oleada'],
    laundry: true,
    steps: [
      { time: '05:30', label: 'Primer tren Keihan desde Shichijō', type: 'traslado', maps: 'Shichijo Station Keihan Kyoto' },
      { time: '06:00', label: 'Fushimi Inari: subida al mirador de Yotsutsuji', type: 'visita', zoneId: 'fushimi-inari', maps: 'Fushimi Inari Taisha' },
      { time: '08:00', label: 'Taxi a Kinkaku-ji (~35–40 min)', type: 'traslado' },
      { time: '09:00', label: 'Kinkaku-ji, a la hora de apertura', type: 'visita', zoneId: 'kinkakuji', maps: 'Kinkaku-ji' },
      { time: '10:15', label: 'Ryōan-ji', type: 'visita', zoneId: 'kinkakuji', maps: 'Ryoan-ji' },
      { time: '12:30', label: 'Comida en el mercado Nishiki', type: 'comida', zoneId: 'nishiki', maps: 'Nishiki Market' },
      { time: 'tarde', label: 'Tarde libre · colada 2', type: 'descanso' },
    ],
    notes: [
      'Fushimi con el primer tren: imprescindible para una buena experiencia.',
      'Taxi a Kinkaku-ji: caben los cuatro.',
    ],
  },

  // ── Día 21 — Viernes 21 mayo 2027 — Tō-ji, Osaka (noche 1) y Nara ────────
  {
    id: 21,
    date: '2027-05-21',
    citySlug: 'osaka',
    title: 'Kioto → Osaka — Tō-ji, Osaka y Nara por la tarde',
    hotelId: 'osaka',
    rules: ['cierre', 'oleada'],
    transfers: [
      {
        from: 'Kioto',
        to: 'Osaka (Namba)',
        mode: 'tren',
        line: 'JR Kioto → Osaka + taxi al hotel de Namba',
        duration: '~30 min + taxi',
        notes: [
          'Antes, Tō-ji con las maletas en el hotel de Shichijō',
          'Dejar las maletas en el hotel de Namba hacia las 12:30',
        ],
      },
      {
        from: 'Osaka (Namba)',
        to: 'Nara',
        mode: 'tren',
        line: 'Kintetsu (Osaka-Namba → Kintetsu-Nara)',
        duration: '~40 min cada sentido',
        roundTrip: true,
        notes: [
          'Sin maletas: nunca se va con equipaje por Nara',
          'Vuelta a Namba para cenar',
        ],
      },
    ],
    steps: [
      { time: '08:00', label: 'Mercadillo Kōbō-ichi en Tō-ji (solo el día 21)', type: 'visita', zoneId: 'toji', maps: 'To-ji' },
      { time: '10:30', label: 'Recoger las maletas en el hotel', type: 'traslado' },
      { time: '11:00', label: 'JR a Osaka + taxi al hotel de Namba', type: 'traslado', maps: 'Namba Station Osaka' },
      { time: '12:30', label: 'Dejar las maletas · comida', type: 'comida' },
      { time: '14:00', label: 'Kintetsu de Namba a Nara (~40 min)', type: 'traslado', maps: 'Kintetsu Nara Station' },
      { time: '14:45', label: 'Kōfuku-ji y el parque de Nara', type: 'visita', zoneId: 'nara-todaiji', maps: 'Kofuku-ji' },
      { time: '15:30', label: 'Tōdai-ji y el Gran Buda (hasta 17:30)', type: 'visita', zoneId: 'nara-todaiji', maps: 'Todai-ji' },
      { time: '19:00', label: 'Cena en Dōtonbori', type: 'noche', zoneId: 'dotonbori', maps: 'Dotonbori' },
    ],
    notes: [
      'Tō-ji: el mercadillo Kōbō-ichi es el día 21 de cada mes, y este viernes es 21.',
      'Kōfuku-ji: la pagoda de cinco pisos está cubierta por la obra hasta ~2034.',
      'Tōdai-ji: 800 ¥, solo efectivo.',
      'Nara a última hora: se evitan los grupos escolares.',
    ],
  },

  // ── Día 22 — Sábado 22 mayo 2027 — Osaka (noche 2), Katsuo-ji ────────────
  {
    id: 22,
    date: '2027-05-22',
    citySlug: 'osaka',
    title: 'Osaka — Katsuo-ji y Minami',
    hotelId: 'osaka',
    rules: ['finde'],
    transfers: [
      {
        from: 'Osaka (Namba)',
        to: 'Katsuo-ji (Minoh)',
        mode: 'bus',
        line: 'Metro Midōsuji a Senri-Chūō + autobús (o taxi)',
        duration: '~1h cada sentido (orientativo)',
        roundTrip: true,
        notes: [
          'El autobús ya no acepta efectivo: solo tarjeta IC',
          'En taxi desde Senri-Chūō: unos 3.400 ¥ para los cuatro',
          'En fin de semana hay más autobuses',
        ],
      },
    ],
    steps: [
      { time: '08:30', label: 'Midōsuji a Senri-Chūō + autobús (solo tarjeta IC)', type: 'traslado' },
      { time: '09:30', label: 'Katsuo-ji', type: 'visita', zoneId: 'katsuo-ji', maps: 'Katsuo-ji' },
      { time: '12:30', label: 'Vuelta a Namba', type: 'traslado' },
      { time: '14:00', label: 'Minami: Hōzen-ji, Shinsaibashi y Dōtonbori', type: 'compras', zoneId: 'dotonbori', maps: 'Hozenji Yokocho' },
    ],
    notes: ['Sábado a propósito: en fin de semana hay más autobuses a Katsuo-ji.'],
  },

  // ── Día 23 — Domingo 23 mayo 2027 — Osaka (noche 3), Hiroshima ───────────
  {
    id: 23,
    date: '2027-05-23',
    citySlug: 'osaka',
    title: 'Osaka — Excursión a Hiroshima',
    hotelId: 'osaka',
    rules: ['finde'],
    transfers: [
      {
        from: 'Osaka',
        to: 'Hiroshima',
        mode: 'shinkansen',
        line: 'Sanyō Shinkansen (Shin-Osaka → Hiroshima)',
        duration: '~1h25 cada sentido',
        roundTrip: true,
        notes: [
          'Ida y vuelta en el día, sin pernocta',
          'Tranvía de la estación de Hiroshima al Parque de la Paz (~15 min)',
        ],
      },
    ],
    steps: [
      { time: '07:00', label: 'Shinkansen de Shin-Osaka a Hiroshima (~1h25)', type: 'traslado', maps: 'Shin-Osaka Station' },
      { time: '09:00', label: 'Museo Memorial de la Paz', type: 'visita', zoneId: 'hiroshima-paz', maps: 'Hiroshima Peace Memorial Museum', reserve: true },
      { time: '11:00', label: 'Parque de la Paz y Monumento a los Niños', type: 'visita', zoneId: 'hiroshima-paz', maps: 'Hiroshima Peace Memorial Park' },
      { time: '12:00', label: 'Cúpula de la Bomba Atómica', type: 'visita', zoneId: 'hiroshima-paz', maps: 'Atomic Bomb Dome' },
      { time: '13:00', label: 'Okonomiyaki estilo Hiroshima', type: 'comida', maps: 'Okonomimura Hiroshima' },
      { time: 'tarde', label: 'Vuelta a Osaka', type: 'traslado' },
    ],
    notes: [
      'En domingo no hay grupos escolares.',
      'Museo: 7:30–19:00 de marzo a julio; la franja de 7:30–8:30 se reserva online. Si no, llegar hacia las 9:00.',
    ],
  },

  // ── Día 24 — Lunes 24 mayo 2027 — Osaka (noche 4) ────────────────────────
  {
    id: 24,
    date: '2027-05-24',
    citySlug: 'osaka',
    title: 'Osaka — Día tranquilo en Osaka',
    hotelId: 'osaka',
    laundry: true,
    steps: [
      { time: 'mañana', label: 'Sin despertador · colada 3', type: 'descanso' },
      { time: '11:00', label: 'Parque del castillo de Osaka (por fuera)', type: 'visita', zoneId: 'osaka-castillo', maps: 'Osaka Castle Park' },
      { time: '13:00', label: 'Comida en el mercado Kuromon', type: 'comida', zoneId: 'kuromon', maps: 'Kuromon Market' },
      { time: '14:30', label: 'Den Den Town', type: 'compras', zoneId: 'den-den-town', maps: 'Den Den Town', optional: true },
      { time: '15:30', label: 'Shinsekai y Tsūtenkaku', type: 'visita', zoneId: 'shinsekai', maps: 'Tsutenkaku' },
      { time: '17:00', label: 'Descanso en el hotel', type: 'descanso' },
      { time: '18:30', label: 'Umeda Sky al atardecer (~19:00) + cena en Umeda', type: 'noche', zoneId: 'umeda', maps: 'Umeda Sky Building' },
    ],
    notes: [
      'Día de respiro tras ocho días seguidos con mucho ritmo (17–24).',
      'Umeda Sky: 9:30–22:30, 2.000 ¥. Si se vuelve de Hiroshima con energía, se puede adelantar al domingo 23.',
    ],
  },

  // ── Día 25 — Martes 25 mayo 2027 — Tokio · bloque 2 (noche 1) ────────────
  {
    id: 25,
    date: '2027-05-25',
    citySlug: 'tokio',
    title: 'Osaka → Tokio — Vuelta a Tokio y Akihabara',
    hotelId: 'tokio2',
    transfers: [
      {
        from: 'Osaka',
        to: 'Tokio',
        mode: 'shinkansen',
        line: 'Tōkaidō Shinkansen (Shin-Osaka → Tokio)',
        duration: '~2h30–3h (llegada al hotel hacia las 13:30)',
        notes: [
          'Asiento E: lado del Fuji',
          'Taxi del hotel de Namba a Shin-Osaka; en Tokio, al hotel de Asakusa',
        ],
      },
    ],
    steps: [
      { time: '10:00', label: 'Check-out · Shinkansen desde Shin-Osaka (asiento E)', type: 'traslado', maps: 'Shin-Osaka Station' },
      { time: '13:30', label: 'Hotel en Asakusa · dejar maletas', type: 'descanso', maps: 'Asakusa Station Tokyo' },
      { time: '15:00', label: 'Akihabara: Radio Kaikan · Mandarake · Surugaya', type: 'compras', zoneId: 'akihabara', maps: 'Akihabara Radio Kaikan' },
      { time: '17:00', label: 'Retro: Super Potato y gachapon', type: 'compras', zoneId: 'akihabara', maps: 'Super Potato Akihabara' },
    ],
    notes: ['Tiendas retro: comprobar en 2027 que siguen abiertas.'],
  },

  // ── Día 26 — Miércoles 26 mayo 2027 — Tokio · bloque 2 (noche 2) ─────────
  {
    id: 26,
    date: '2027-05-26',
    citySlug: 'tokio',
    title: 'Tokio · bloque 2 — Asakusa y Skytree',
    hotelId: 'tokio2',
    rules: ['laborable', 'oleada'],
    steps: [
      { time: '07:30', label: 'Sensō-ji y Kaminarimon a primera hora', type: 'visita', zoneId: 'asakusa', maps: 'Senso-ji' },
      { time: '09:30', label: 'Nakamise y Asakusa Jinja', type: 'visita', zoneId: 'asakusa', maps: 'Nakamise Shopping Street' },
      { time: 'tarde', label: 'Libre', type: 'descanso' },
      { time: '17:30', label: 'Tokyo Skytree al atardecer', type: 'visita', zoneId: 'tokyo-skytree', maps: 'Tokyo Skytree', reserve: true },
    ],
    notes: [
      'El Sanja Matsuri ya pasó (14–16 de mayo).',
      'Skytree: entrada con hora, comprar con antelación (entre semana es más barata).',
    ],
  },

  // ── Día 27 — Jueves 27 mayo 2027 — Tokio · bloque 2 (noche 3) ────────────
  {
    id: 27,
    date: '2027-05-27',
    citySlug: 'tokio',
    title: 'Tokio · bloque 2 — Fukagawa y Nakano Broadway',
    hotelId: 'tokio2',
    rules: ['laborable'],
    steps: [
      { time: '09:00', label: 'Jardín Kiyosumi', type: 'visita', zoneId: 'kiyosumi-fukagawa', maps: 'Kiyosumi Teien' },
      { time: '10:00', label: 'Museo Edo de Fukagawa', type: 'visita', zoneId: 'kiyosumi-fukagawa', maps: 'Fukagawa Edo Museum' },
      { time: '11:30', label: 'Fudō-dō y Tomioka Hachimangū · comer fukagawa-meshi', type: 'visita', zoneId: 'kiyosumi-fukagawa', maps: 'Tomioka Hachimangu' },
      { time: '13:00', label: 'Línea Tōzai directa a Nakano (~35 min)', type: 'traslado' },
      { time: '13:45', label: 'Nakano Broadway (Mandarake)', type: 'compras', zoneId: 'nakano', maps: 'Nakano Broadway' },
      { time: 'noche', label: 'Hacer maletas', type: 'descanso' },
    ],
    notes: [
      'Nakano Broadway: tiendas sobre todo de 12:00 a 20:00; algunas cierran los miércoles.',
      'El vuelo sale mañana a las 11:20: maletas hechas esta noche.',
    ],
  },

  // ── Día 28 — Viernes 28 mayo 2027 — Regreso ──────────────────────────────
  {
    id: 28,
    date: '2027-05-28',
    citySlug: 'tokio',
    title: 'Tokio → Narita — Vuelo de regreso',
    transfers: [
      {
        from: 'Asakusa (hotel)',
        to: 'Aeropuerto de Narita (NRT T1)',
        mode: 'tren',
        line: 'Taxi a Ueno + Keisei Skyliner',
        duration: '~10 min de taxi + ~41 min de tren',
        notes: [
          'Check-out hacia las 7:15; en la T1 hacia las 8:45',
          'Vuelo LH711 a las 11:20 (escala en Fráncfort; llegada a Barcelona a las 23:05)',
          'Alternativa: trenes directos a Narita desde la estación de Asakusa (comprobar el horario de 2027)',
        ],
      },
    ],
    steps: [
      { time: '07:15', label: 'Check-out · taxi a Ueno', type: 'traslado' },
      { time: '07:40', label: 'Skyliner a Narita', type: 'traslado', maps: 'Keisei Ueno Station' },
      { time: '08:45', label: 'Narita T1 · facturación', type: 'traslado', maps: 'Narita Airport Terminal 1' },
      { time: '11:20', label: 'LH711 → Fráncfort → Barcelona (23:05)', type: 'traslado' },
    ],
    notes: ['Lufthansa anuncia el LH711 como vuelo de temporada de verano 2027: revisar la reserva cerca de la fecha.'],
  },
]
