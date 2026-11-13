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
 * `Transfer` en el paso donde se hace (`Step.transfer`; en la ida, si es de ida y vuelta). La
 * etiqueta del paso dice acción + destino; el `Transfer`, el detalle (línea, duración, avisos).
 * Solo logística, sin spoilers. Las maletas viajan siempre con el grupo (sin mensajería): taxi
 * del hotel a la estación y de la estación al hotel siguiente.
 *
 * UN DATO, UN SITIO (sin repetir nada entre paneles del día):
 * - Day.notes: lo global del día (ritmo/cansancio, qué saltarse, orden, por qué a esa hora,
 *   plan B, maletas del día). Nada que ya digan un paso, una zona, un trayecto o una reserva.
 * - Zone.practical: lo propio del lugar (acceso, horario, cierres, precio, normas, duración).
 *   Una zona puede usarse en varios días: nada del plan de un día concreto.
 * - Transfer: el trayecto entre ciudades o de una excursión (línea, transbordos, equipaje,
 *   asientos), en su paso. Nada que ya diga la etiqueta del paso. Reservas con antelación: solo reservations.ts (el paso lleva `reserve`).
 * - context.ts: solo narrativa (sin horarios, entradas ni consejos prácticos).
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
    steps: [
      { time: '09:30', label: 'Aterrizaje en Narita T1', type: 'traslado', maps: 'Narita Airport Terminal 1' },
      {
        time: '10:40',
        label: 'Tren a Ueno',
        type: 'traslado',
        maps: 'Keisei Ueno Station',
        transfer: {
          from: 'Aeropuerto de Narita (NRT T1)',
          to: 'Ueno (hotel)',
          mode: 'tren',
          line: 'Keisei Skyliner (Narita T1 → Keisei Ueno) + taxi al hotel',
          duration: '~45 min',
          notes: [
            'Vuelo de llegada: LH710',
            'Comprar o activar la tarjeta IC (Suica/PASMO) en el aeropuerto',
            'Skyliner cada ~20 min (10:18, 10:38, 10:59): no hace falta correr tras inmigración',
          ],
        },
      },
      { time: '12:00', label: 'Hotel en Ueno · dejar maletas', type: 'descanso', maps: 'Ueno Station Tokyo' },
      { time: '16:00', label: 'Kanda Matsuri: el desfile al paso (si se confirma)', type: 'visita', zoneId: 'kanda', maps: 'Kanda Myojin', optional: true },
      { time: '19:00', label: 'Si no hay festival: Asakusa de noche (Sensō-ji)', type: 'noche', zoneId: 'asakusa', maps: 'Senso-ji', optional: true },
    ],
    notes: [
      'Tarde suave: jet lag.',
      'De noche, Sensō-ji está tranquilo.',
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
      { time: '09:00', label: 'Kanda Myōjin: entrada de los mikoshi (un rato, si se confirma)', type: 'visita', zoneId: 'kanda', maps: 'Kanda Myojin', optional: true },
      { time: '10:30', label: 'Jardines del Este del Palacio Imperial', type: 'visita', zoneId: 'palacio-imperial', maps: 'East Gardens of the Imperial Palace' },
      { time: '12:30', label: 'Comida en Marunouchi', type: 'comida', maps: 'Marunouchi Tokyo' },
      { time: '13:30', label: 'Ginza peatonal (12:00–18:00)', type: 'compras', zoneId: 'ginza', maps: 'Ginza Chuo-dori' },
      { time: '16:00', label: 'Kabuki-za: un acto suelto (hitomakumi)', type: 'visita', zoneId: 'ginza', maps: 'Kabukiza Theatre', optional: true },
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
      { time: '10:30', label: 'Takeshita-dōri (Harajuku)', type: 'compras', zoneId: 'harajuku-meiji', maps: 'Takeshita Street' },
      { time: '11:30', label: 'Omotesandō', type: 'compras', zoneId: 'harajuku-meiji', maps: 'Omotesando', optional: true },
      { time: '13:00', label: 'Comida', type: 'comida' },
      { time: '14:30', label: 'Cruce de Shibuya y Hachikō', type: 'visita', zoneId: 'shibuya', maps: 'Shibuya Scramble Crossing' },
      { time: '15:30', label: 'Shibuya Parco 6F: Nintendo · Pokémon · Capcom · Jump', type: 'compras', zoneId: 'shibuya', maps: 'Shibuya PARCO' },
      { time: '18:00', label: 'Shibuya Sky al atardecer (~18:35)', type: 'visita', zoneId: 'shibuya', maps: 'Shibuya Sky', reserve: true },
      { time: '20:00', label: 'Shinjuku de noche: Omoide Yokochō · Golden Gai · Kabukichō', type: 'noche', zoneId: 'shinjuku', maps: 'Omoide Yokocho', optional: true },
    ],
    notes: [
      'Día largo para el tercero, aún con jet lag. Si pesa, soltad por este orden: 1) Shinjuku de noche (cabe la noche del martes 25, tras Akihabara), 2) Omotesandō.',
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
      { time: '14:30', label: 'Línea Hibiya a Ueno y JR a Nippori', type: 'traslado' },
      { time: '15:15', label: 'Yanaka: Yanaka Ginza, cementerio, Tennō-ji', type: 'visita', zoneId: 'yanaka', maps: 'Yanaka Ginza' },
      { time: '17:00', label: 'Nezu Jinja', type: 'visita', zoneId: 'yanaka', maps: 'Nezu Shrine' },
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
    steps: [
      { time: 'mañana', label: 'Mañana tranquila y check-out', type: 'descanso' },
      {
        time: '11:46',
        label: 'Shinkansen a Jōmō-Kōgen',
        type: 'traslado',
        maps: 'Jomo-Kogen Station',
        transfer: {
          from: 'Tokio (Ueno)',
          to: 'Takaragawa Onsen (Minakami)',
          mode: 'shinkansen',
          line: 'Jōetsu Shinkansen desde Ueno + lanzadera del ryokan',
          duration: '~1h + ~45 min de lanzadera',
          notes: [
            'El Toki 319 (Ueno 11:46 → 12:43) enlaza con la lanzadera de las 13:00; el Toki 323 (13:46), con la de las 15:00',
            'Horario de 2026: revisar tras el cambio de marzo de 2027',
            'Equipaje: taxi del hotel a la estación (2 taxis o uno grande para 4 maletas)',
          ],
        },
      },
      { time: '13:00', label: 'Lanzadera del ryokan (o la de las 15:00)', type: 'traslado', reserve: true },
      { time: 'tarde', label: 'Ryokan Ōsenkaku: baños', type: 'visita', zoneId: 'takaragawa-onsen', maps: 'Takaragawa Onsen Osenkaku' },
      { time: 'noche', label: 'Cena en el ryokan', type: 'comida', zoneId: 'takaragawa-onsen' },
    ],
  },

  // ── Día 13 — Jueves 13 mayo 2027 — Kanazawa (noche 1) ────────────────────
  {
    id: 13,
    date: '2027-05-13',
    citySlug: 'kanazawa',
    title: 'Takaragawa → Kanazawa — Llegada a Kanazawa',
    hotelId: 'kanazawa',
    steps: [
      {
        time: '09:30',
        label: 'Lanzadera y trenes a Kanazawa',
        type: 'traslado',
        transfer: {
          from: 'Takaragawa Onsen (Minakami)',
          to: 'Kanazawa',
          mode: 'shinkansen',
          line: 'Lanzadera del ryokan a Jōmō-Kōgen + Jōetsu Shinkansen a Takasaki + Hokuriku Shinkansen',
          duration: '~4h–4h45',
          notes: [
            'La lanzadera de las 9:30 es la única; llega a Jōmō-Kōgen hacia las 10:30',
            'Enlace justo con el tren de las 10:46 (Kanazawa 13:36); si se pierde, el de las 11:46 llega a las 14:17',
            'Maletas: portaequipajes del extremo del vagón, sin reserva y por orden de llegada',
          ],
        },
      },
      { time: '14:00', label: 'Llegada a Kanazawa · hotel', type: 'traslado', maps: 'Kanazawa Station' },
      { time: '14:45', label: 'Mercado Ōmichō (antes de las 17:00)', type: 'comida', zoneId: 'omicho', maps: 'Omicho Market' },
      { time: '16:00', label: 'Higashi Chaya: casas de té (hasta las 17:00) y calles', type: 'visita', zoneId: 'higashi-chaya', maps: 'Higashi Chaya District' },
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
    notes: ['Higashi Chaya, si quedó pendiente el jueves.'],
  },

  // ── Día 15 — Sábado 15 mayo 2027 — Takayama (noche 1) ────────────────────
  {
    id: 15,
    date: '2027-05-15',
    citySlug: 'takayama',
    title: 'Kanazawa → Takayama — Llegada a Takayama',
    hotelId: 'takayama',
    rules: ['finde'],
    steps: [
      {
        time: '08:10',
        label: 'Autobús a Takayama',
        type: 'traslado',
        maps: 'Kanazawa Station West Exit Bus Terminal',
        reserve: true,
        transfer: {
          from: 'Kanazawa',
          to: 'Takayama',
          mode: 'bus',
          line: 'Bus Nōhi / Hokutetsu directo desde la salida oeste de la estación de Kanazawa',
          duration: '~2h15',
          notes: [
            'Directo de las 8:10 (llega 10:25); el siguiente directo sale a las 11:10',
            'Los de 8:40, 9:10 y 9:40 terminan en Shirakawa-go',
            'Alternativa en tren por Toyama: solo 4 trenes Hida al día',
            'Horario de 2026: comprobar el de 2027 y el andén al reservar',
          ],
        },
      },
      { time: '10:45', label: 'Hotel · dejar maletas', type: 'descanso', maps: 'Takayama Station' },
      { time: '12:00', label: 'Comida: ternera de Hida', type: 'comida' },
      { time: '14:00', label: 'Yatai Kaikan + santuario Sakurayama Hachimangū', type: 'visita', zoneId: 'takayama-yatai', maps: 'Takayama Festival Floats Exhibition Hall' },
      { time: '16:00', label: 'Sanmachi (tiendas y bodegas de sake hasta ~17:00)', type: 'visita', zoneId: 'sanmachi-suji', maps: 'Sanmachi Suji' },
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
      { time: '10:00', label: 'Sanmachi sin prisa', type: 'visita', zoneId: 'sanmachi-suji', maps: 'Sanmachi Suji' },
      { time: '13:00', label: 'Hida no Sato', type: 'visita', zoneId: 'hida-no-sato', maps: 'Hida Folk Village' },
    ],
    notes: ['En domingo, mejor Takayama que Shirakawa-go: la ciudad absorbe a la gente.'],
  },

  // ── Día 17 — Lunes 17 mayo 2027 — Shirakawa-go y Kioto (noche 1) ─────────
  {
    id: 17,
    date: '2027-05-17',
    citySlug: 'kioto',
    title: 'Takayama → Kioto — Shirakawa-go y tren a Kioto',
    hotelId: 'kioto',
    rules: ['laborable', 'oleada'],
    steps: [
      {
        time: '07:20',
        label: 'Autobús a Shirakawa-go',
        type: 'traslado',
        maps: 'Takayama Nohi Bus Center',
        reserve: true,
        transfer: {
          from: 'Takayama',
          to: 'Shirakawa-go',
          mode: 'bus',
          line: 'Bus Nōhi desde el centro de autobuses de Takayama',
          duration: '~50 min cada sentido',
          roundTrip: true,
          notes: [
            'Sin maletas: se quedan en el hotel de Takayama',
            'Vuelta a las 11:10 (llega 12:00); sin reserva hay otro a las 10:55',
          ],
        },
      },
      { time: '08:10', label: 'Aldea de Ogimachi y mirador Shiroyama', type: 'visita', zoneId: 'shirakawago-ogimachi', maps: 'Shirakawa-go Ogimachi' },
      { time: '11:10', label: 'Bus de vuelta a Takayama · recoger maletas', type: 'traslado' },
      {
        time: '13:35',
        label: 'Tren a Kioto',
        type: 'traslado',
        maps: 'Kyoto Station',
        transfer: {
          from: 'Takayama',
          to: 'Kioto',
          mode: 'tren',
          line: 'JR Hida (limited express) a Nagoya + Tōkaidō Shinkansen a Kioto',
          duration: '~3h30',
          notes: [
            'Hida 12 de las 13:35 (Nagoya 16:09, Kioto ~17:00); el anterior sale a las 12:35 y el siguiente a las 14:46',
            'Taxi de la estación de Kioto al hotel de Shichijō',
            'Horario de 2026: revisar tras el cambio de marzo de 2027',
          ],
        },
      },
      { time: '17:30', label: 'Hotel en Shichijō', type: 'descanso', maps: 'Shichijo Station Keihan Kyoto' },
    ],
    notes: ['Shirakawa-go, mejor un laborable y antes de las 9:00, antes que los autocares: en fin de semana hay menos buses y más gente.'],
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
      { time: '09:00', label: 'Kōdai-ji', type: 'visita', zoneId: 'higashiyama-sannenzaka', maps: 'Kodai-ji', optional: true },
      { time: '10:00', label: 'Parque Maruyama y Yasaka Jinja', type: 'visita', zoneId: 'gion', maps: 'Yasaka Shrine' },
      { time: '11:00', label: 'Nanzen-ji y el acueducto Suirokaku', type: 'visita', zoneId: 'higashiyama-norte', maps: 'Nanzen-ji' },
      { time: '12:30', label: 'Comida', type: 'comida' },
      { time: '14:00', label: 'Camino del Filósofo', type: 'visita', zoneId: 'higashiyama-norte', maps: "Philosopher's Path", optional: true },
      { time: '15:30', label: 'Ginkaku-ji (cierra a las 17:00)', type: 'visita', zoneId: 'higashiyama-norte', maps: 'Ginkaku-ji', optional: true },
      { time: '17:30', label: 'Gion y Hanami-kōji al anochecer', type: 'noche', zoneId: 'gion', maps: 'Hanamikoji Street' },
    ],
    notes: [
      'Día largo: unos 8–10 km a pie. Si vais cansados, soltad por este orden: 1) Kōdai-ji, 2) Camino del Filósofo y Ginkaku-ji juntos (queda la tarde libre hasta Gion).',
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
      { time: '15:00', label: 'Castillo Nijō (última entrada 16:00)', type: 'visita', zoneId: 'nijo', maps: 'Nijo Castle', reserve: true, optional: true },
    ],
    notes: [
      'Nijō hacia las 15:00: los grupos escolares ya se van.',
      'Si vais cansados, lo que se suelta es Nijō: es el único desvío del día y mañana se madruga más que ningún otro.',
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
      { time: '05:29', label: 'Tren Keihan local desde Shichijō (hay otro a las 5:09)', type: 'traslado', maps: 'Shichijo Station Keihan Kyoto' },
      { time: '06:00', label: 'Fushimi Inari: subida al mirador de Yotsutsuji', type: 'visita', zoneId: 'fushimi-inari', maps: 'Fushimi Inari Taisha' },
      { time: '08:00', label: 'Taxi a Kinkaku-ji (~35–40 min)', type: 'traslado' },
      { time: '09:00', label: 'Kinkaku-ji, a la hora de apertura', type: 'visita', zoneId: 'kinkakuji', maps: 'Kinkaku-ji' },
      { time: '10:15', label: 'Ryōan-ji', type: 'visita', zoneId: 'kinkakuji', maps: 'Ryoan-ji', optional: true },
      { time: '12:30', label: 'Comida en el mercado Nishiki', type: 'comida', zoneId: 'nishiki', maps: 'Nishiki Market' },
      { time: 'tarde', label: 'Tarde libre · colada 2', type: 'descanso' },
    ],
    notes: [
      'Fushimi antes de las 6:00: imprescindible para una buena experiencia.',
      'Taxi a Kinkaku-ji: caben los cuatro.',
      'Si vais cansados, se suelta Ryōan-ji y se adelanta la comida: la tarde libre empieza antes.',
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
    steps: [
      { time: '08:00', label: 'Mercadillo Kōbō-ichi en Tō-ji (solo el día 21)', type: 'visita', zoneId: 'toji', maps: 'To-ji' },
      { time: '10:30', label: 'Recoger las maletas en el hotel', type: 'traslado' },
      {
        time: '11:00',
        label: 'Tren a Osaka (Namba)',
        type: 'traslado',
        maps: 'Namba Station Osaka',
        transfer: {
          from: 'Kioto',
          to: 'Osaka (Namba)',
          mode: 'tren',
          line: 'JR Kioto → Osaka + taxi al hotel',
          duration: '~30 min + taxi',
        },
      },
      { time: '12:30', label: 'Dejar las maletas · comida', type: 'comida' },
      {
        time: '14:00',
        label: 'Tren a Nara',
        type: 'traslado',
        maps: 'Kintetsu Nara Station',
        transfer: {
          from: 'Osaka (Namba)',
          to: 'Nara',
          mode: 'tren',
          line: 'Kintetsu (Osaka-Namba → Kintetsu-Nara)',
          duration: '~40 min cada sentido',
          roundTrip: true,
          notes: ['Sin maletas: nunca se va con equipaje por Nara'],
        },
      },
      { time: '14:45', label: 'Kōfuku-ji', type: 'visita', zoneId: 'nara-todaiji', maps: 'Kofuku-ji', optional: true },
      { time: '15:30', label: 'Parque de Nara, Tōdai-ji y el Gran Buda (hasta 17:30)', type: 'visita', zoneId: 'nara-todaiji', maps: 'Todai-ji' },
      { time: '19:00', label: 'Cena en Dōtonbori', type: 'noche', zoneId: 'dotonbori', maps: 'Dotonbori' },
    ],
    notes: [
      'Nara a última hora: se evitan los grupos escolares.',
      'Lo esencial del día es Tōdai-ji. Si se va con retraso, se acorta el mercadillo, no Nara; Kōfuku-ji es lo primero que se suelta.',
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
    steps: [
      {
        time: '08:15',
        label: 'Metro y autobús a Katsuo-ji',
        type: 'traslado',
        transfer: {
          from: 'Osaka (Namba)',
          to: 'Katsuo-ji (Minoh)',
          mode: 'bus',
          line: 'Metro Midōsuji directo a Minoh-Kayano (final de línea) + autobús Hankyu 30 (o taxi)',
          duration: '~1h15 cada sentido',
          roundTrip: true,
          notes: [
            'Primer autobús a las 9:00; los sábados, cada 20 min hasta las 12:40',
            'El autobús no admite efectivo: tarjeta IC cargada o billete especial (800 ¥ por trayecto)',
            'En taxi desde Minoh-Kayano: unos 3.000–3.400 ¥, casi como cuatro billetes',
            'Bajada: según las guías, desde las 13:00 y el último hacia las 17:05; confirmar el horario allí',
          ],
        },
      },
      { time: '09:30', label: 'Katsuo-ji', type: 'visita', zoneId: 'katsuo-ji', maps: 'Katsuo-ji', optional: true },
      { time: '13:00', label: 'Vuelta a Namba', type: 'traslado' },
      { time: '14:30', label: 'Minami: Hōzen-ji, Shinsaibashi y Dōtonbori', type: 'compras', zoneId: 'dotonbori', maps: 'Hozenji Yokocho' },
    ],
    notes: [
      'Sábado a propósito: en fin de semana hay más autobuses a Katsuo-ji.',
      'Es la mañana que más descanso da si se suelta: sin Katsuo-ji, mañana libre antes de Minami, y el domingo se madruga para Hiroshima.',
    ],
  },

  // ── Día 23 — Domingo 23 mayo 2027 — Osaka (noche 3), Hiroshima ───────────
  {
    id: 23,
    date: '2027-05-23',
    citySlug: 'osaka',
    title: 'Osaka — Excursión a Hiroshima',
    hotelId: 'osaka',
    rules: ['finde'],
    steps: [
      {
        time: '07:10',
        label: 'Shinkansen a Hiroshima',
        type: 'traslado',
        maps: 'Shin-Osaka Station',
        transfer: {
          from: 'Osaka',
          to: 'Hiroshima',
          mode: 'shinkansen',
          line: 'Sanyō Shinkansen desde Shin-Osaka',
          duration: '~1h25 cada sentido',
          roundTrip: true,
          notes: [
            'Nozomi de las 7:11 (llega 8:36); antes, Sakura a las 6:50 (llega 8:18)',
            'Horario de 2026: revisar tras el cambio de marzo de 2027',
          ],
        },
      },
      { time: '09:15', label: 'Museo Memorial de la Paz', type: 'visita', zoneId: 'hiroshima-paz', maps: 'Hiroshima Peace Memorial Museum' },
      { time: '11:00', label: 'Parque de la Paz y Monumento a los Niños', type: 'visita', zoneId: 'hiroshima-paz', maps: 'Hiroshima Peace Memorial Park' },
      { time: '12:00', label: 'Cúpula de la Bomba Atómica', type: 'visita', zoneId: 'hiroshima-paz', maps: 'Atomic Bomb Dome' },
      { time: '13:00', label: 'Okonomiyaki estilo Hiroshima', type: 'comida', maps: 'Okonomimura Hiroshima' },
      { time: 'tarde', label: 'Vuelta a Osaka', type: 'traslado' },
    ],
    notes: ['En domingo no hay grupos escolares.'],
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
      'Día de respiro tras siete días seguidos con mucho ritmo (17–23).',
      'Si se vuelve de Hiroshima con energía, Umeda Sky se puede adelantar al domingo 23: Umeda está a una parada de Shin-Osaka en JR.',
    ],
  },

  // ── Día 25 — Martes 25 mayo 2027 — Tokio · bloque 2 (noche 1) ────────────
  {
    id: 25,
    date: '2027-05-25',
    citySlug: 'tokio',
    title: 'Osaka → Tokio — Vuelta a Tokio y Akihabara',
    hotelId: 'tokio2',
    steps: [
      {
        time: '10:00',
        label: 'Check-out · Shinkansen a Tokio',
        type: 'traslado',
        maps: 'Shin-Osaka Station',
        transfer: {
          from: 'Osaka',
          to: 'Tokio',
          mode: 'shinkansen',
          line: 'Tōkaidō Shinkansen desde Shin-Osaka',
          duration: '~2h30–3h',
          notes: [
            'Asiento E: lado del Fuji',
            'Taxi del hotel de Namba a Shin-Osaka; en Tokio, al hotel de Asakusa',
          ],
        },
      },
      { time: '13:30', label: 'Hotel en Asakusa · dejar maletas', type: 'descanso', maps: 'Asakusa Station Tokyo' },
      { time: '15:00', label: 'Akihabara: Radio Kaikan · Mandarake · Surugaya', type: 'compras', zoneId: 'akihabara', maps: 'Akihabara Radio Kaikan' },
      { time: '17:00', label: 'Retro: Super Potato y gachapon', type: 'compras', zoneId: 'akihabara', maps: 'Super Potato Akihabara' },
    ],
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
      { time: '18:00', label: 'Tokyo Skytree al atardecer (~18:45)', type: 'visita', zoneId: 'tokyo-skytree', maps: 'Tokyo Skytree', reserve: true },
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
      { time: '11:30', label: 'Comer fukagawa-meshi · Tomioka Hachimangū', type: 'comida', zoneId: 'kiyosumi-fukagawa', maps: 'Tomioka Hachimangu' },
      { time: '13:00', label: 'Fudō-dō (goma de las 13:00)', type: 'visita', zoneId: 'kiyosumi-fukagawa', maps: 'Fukagawa Fudodo' },
      { time: '13:45', label: 'Línea Tōzai directa a Nakano (~35 min)', type: 'traslado' },
      { time: '14:30', label: 'Nakano Broadway (Mandarake)', type: 'compras', zoneId: 'nakano', maps: 'Nakano Broadway' },
      { time: 'noche', label: 'Hacer maletas', type: 'descanso' },
    ],
  },

  // ── Día 28 — Viernes 28 mayo 2027 — Regreso ──────────────────────────────
  {
    id: 28,
    date: '2027-05-28',
    citySlug: 'tokio',
    title: 'Tokio → Narita — Vuelo de regreso',
    steps: [
      { time: '07:15', label: 'Check-out · taxi a Ueno (~10 min)', type: 'traslado' },
      {
        time: '07:40',
        label: 'Tren a Narita',
        type: 'traslado',
        maps: 'Keisei Ueno Station',
        transfer: {
          from: 'Ueno',
          to: 'Aeropuerto de Narita (NRT T1)',
          mode: 'tren',
          line: 'Keisei Skyliner (Keisei Ueno → Narita T1)',
          duration: '~47 min',
          notes: ['Alternativa: trenes directos a Narita desde la estación de Asakusa (comprobar el horario de 2027)'],
        },
      },
      { time: '08:45', label: 'Narita T1 · facturación', type: 'traslado', maps: 'Narita Airport Terminal 1' },
      { time: '11:20', label: 'LH711 → Fráncfort → Barcelona (23:05)', type: 'traslado' },
    ],
    notes: ['Lufthansa anuncia el LH711 como vuelo de temporada de verano 2027: revisar la reserva cerca de la fecha.'],
  },
]
