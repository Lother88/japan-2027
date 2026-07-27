/**
 * Itinerary data — Japón 2027, ruta REDONDA por Narita (días 9–29)
 *
 * ANTI-SPOILER RULE (NOSPOIL-04):
 * - TimeSlot.summary describes category/encaje ("qué es"), NOT the experience ("qué verás")
 * - No narrative, no spoilers, no "lo que no te puedes perder"
 * - Zone references are IDs only — Zone.practical has the logistics
 *
 * Transfers (trayectos): cada Day puede llevar `transfers` con los tramos
 * inter-ciudad o de day-trip. Solo logística, sin spoilers.
 *
 * NOTA (provisional): orden Kanazawa → Takayama por confirmar (Open Question 5).
 * Shirakawa-go es excursión SIN maletas desde Takayama.
 *
 * Data source: itinerario-ruta-redonda-v1.md
 */

import type { Day } from './types'

export const itinerary: readonly Day[] = [
  // ── Día 9 — Domingo 9 mayo 2027 ─────────────────────────────────────────
  {
    id: 9,
    date: '2027-05-09',
    citySlug: 'tokio',
    title: 'Tokio · bloque 1 — Llegada',
    transfers: [
      {
        from: 'Aeropuerto de Narita (NRT)',
        to: 'Tokio (hotel)',
        mode: 'tren',
        line: 'Narita Express (N’EX) o Keisei Skyliner',
        duration: '~1h',
        notes: [
          'Llegada del vuelo ~12:45',
          'Comprar/activar Suica o Pasmo en el aeropuerto',
          'Grupo de 4: prever tiempo en migración y equipajes',
        ],
      },
    ],
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

  // ── Día 13 — Jueves 13 mayo 2027 — Takaragawa Onsen (1 noche) ────────────
  {
    id: 13,
    date: '2027-05-13',
    citySlug: 'takaragawa',
    title: 'Takaragawa Onsen — Ryokan junto al río',
    transfers: [
      {
        from: 'Tokio',
        to: 'Takaragawa Onsen (Minakami)',
        mode: 'shinkansen',
        line: 'Jōetsu Shinkansen (Tokio → Jōmō-Kōgen) + lanzadera/bus del ryokan',
        duration: '~1h15 tren + ~30 min bus',
        notes: [
          'Check-out del hotel de Tokio por la mañana',
          'Tramo con transbordo: valorar takkyubin para el equipaje grande',
          'Reservar la lanzadera del ryokan con antelación',
        ],
      },
    ],
    slots: [
      {
        key: 'morning',
        label: 'Mañana / Traslado',
        summary: 'Check-out en Tokio y trayecto en shinkansen hacia la montaña de Minakami. Mañana de tránsito.',
        zones: [],
      },
      {
        key: 'afternoon',
        label: 'Tarde / Ryokan',
        summary: 'Llegada al ryokan de montaña: baños termales junto al río y experiencia de alojamiento tradicional con cena kaiseki.',
        zones: [{ zoneId: 'takaragawa-onsen' }],
      },
    ],
  },

  // ── Día 14 — Viernes 14 mayo 2027 — Kanazawa (noche 1) ───────────────────
  {
    id: 14,
    date: '2027-05-14',
    citySlug: 'kanazawa',
    title: 'Kanazawa — Llegada y barrio de chaya',
    transfers: [
      {
        from: 'Takaragawa Onsen (Minakami)',
        to: 'Kanazawa',
        mode: 'tren',
        line: 'Bus a Jōmō-Kōgen → Jōetsu Shinkansen a Takasaki → Hokuriku Shinkansen a Kanazawa',
        duration: '~3h (con transbordos)',
        notes: [
          'Ruta con transbordos: confirmar conexiones para 2027',
          'Reservar asiento por el espacio de equipaje',
        ],
      },
    ],
    slots: [
      {
        key: 'morning',
        label: 'Mañana / Traslado',
        summary: 'Salida de la montaña y trayecto en tren hacia la costa del Mar de Japón. Mañana de tránsito.',
        zones: [],
      },
      {
        key: 'afternoon',
        label: 'Tarde',
        summary: 'Antiguo distrito de casas de té de madera, con artesanía local y ambiente histórico preservado.',
        zones: [{ zoneId: 'higashi-chaya' }],
      },
    ],
  },

  // ── Día 15 — Sábado 15 mayo 2027 — Kanazawa (noche 2) ────────────────────
  {
    id: 15,
    date: '2027-05-15',
    citySlug: 'kanazawa',
    title: 'Kanazawa — Kenroku-en, castillo y Nagamachi',
    slots: [
      {
        key: 'morning',
        label: 'Mañana',
        summary: 'Uno de los grandes jardines paisajísticos de Japón, junto al recinto del castillo de la ciudad.',
        zones: [
          { zoneId: 'kenrokuen' },
          { zoneId: 'kanazawa-castillo' },
        ],
      },
      {
        key: 'afternoon',
        label: 'Tarde',
        summary: 'Barrio samurái de muros de tierra y casa-jardín histórica, más mercado cubierto de marisco y producto local.',
        zones: [
          { zoneId: 'nagamachi' },
          { zoneId: 'omicho' },
        ],
      },
    ],
  },

  // ── Día 16 — Domingo 16 mayo 2027 — Takayama (noche 1) ───────────────────
  {
    id: 16,
    date: '2027-05-16',
    citySlug: 'takayama',
    title: 'Takayama — Llegada y casco antiguo',
    transfers: [
      {
        from: 'Kanazawa',
        to: 'Takayama',
        mode: 'tren',
        line: 'Hokuriku Shinkansen a Toyama + JR Hida (limited express) a Takayama',
        duration: '~2h30–3h (transbordo en Toyama)',
        notes: [
          'Transbordo en Toyama',
          'Tramo Toyama–Takayama con histórico de interrupciones: confirmar para 2027',
          'Reservar asiento (espacio de equipaje)',
        ],
      },
    ],
    slots: [
      {
        key: 'morning',
        label: 'Mañana / Traslado',
        summary: 'Trayecto en tren hacia los Alpes japoneses, remontando el valle del Hida. Mañana de tránsito.',
        zones: [],
      },
      {
        key: 'afternoon',
        label: 'Tarde',
        summary: 'Casco antiguo de casas de madera de la era Edo al atardecer, con destilerías de sake y gastronomía local.',
        zones: [{ zoneId: 'sanmachi-suji' }],
      },
    ],
  },

  // ── Día 17 — Lunes 17 mayo 2027 — Takayama (noche 2) ─────────────────────
  {
    id: 17,
    date: '2027-05-17',
    citySlug: 'takayama',
    title: 'Takayama — Excursión a Shirakawa-go y Hida no Sato',
    transfers: [
      {
        from: 'Takayama',
        to: 'Shirakawa-go',
        mode: 'bus',
        line: 'Bus Nohi (Takayama ↔ Shirakawa-go)',
        duration: '~50 min cada sentido',
        roundTrip: true,
        notes: [
          'Primer bus ~7:30 para evitar multitudes (domingo/festivos se masifica)',
          'Reservar el bus con antelación (se llena)',
          'Excursión SIN maletas: se vuelve a dormir a Takayama',
        ],
      },
    ],
    slots: [
      {
        key: 'morning',
        label: 'Mañana / Excursión',
        summary: 'Aldea de montaña Patrimonio de la Humanidad con casas de tejado de paja, en su valle. Llegar temprano para verla tranquila.',
        zones: [{ zoneId: 'shirakawago-ogimachi' }],
      },
      {
        key: 'afternoon',
        label: 'Tarde',
        summary: 'Museo al aire libre con casas tradicionales de la región del Hida, visitables por dentro.',
        zones: [{ zoneId: 'hida-no-sato' }],
      },
    ],
  },

  // ── Día 18 — Martes 18 mayo 2027 — Kioto (noche 1) ───────────────────────
  {
    id: 18,
    date: '2027-05-18',
    citySlug: 'kioto',
    title: 'Takayama → Kioto — Llegada y Tō-ji',
    transfers: [
      {
        from: 'Takayama',
        to: 'Kioto',
        mode: 'tren',
        line: 'JR Hida (limited express) a Nagoya + Tōkaidō Shinkansen a Kioto',
        duration: '~3h (transbordo en Nagoya)',
        notes: [
          'Transbordo en Nagoya',
          'Salida de Takayama hacia mediodía tras los mercados matutinos',
        ],
      },
    ],
    slots: [
      {
        key: 'morning',
        label: 'Mañana',
        summary: 'Mercado matutino junto al río y residencia administrativa de la era Edo antes de tomar el tren a Kioto.',
        zones: [
          { zoneId: 'miyagawa-asaichi' },
          { zoneId: 'takayama-jinya' },
        ],
      },
      {
        key: 'afternoon',
        label: 'Tarde suave',
        summary: 'Llegada a Kioto y deshacer maletas. Tarde tranquila por la zona de la estación, con un templo histórico de pagoda a 15 min a pie.',
        zones: [{ zoneId: 'kioto-estacion' }, { zoneId: 'toji' }],
      },
    ],
  },

  // ── Día 19 — Miércoles 19 mayo 2027 — Kioto (noche 2) ────────────────────
  {
    id: 19,
    date: '2027-05-19',
    citySlug: 'kioto',
    title: 'Kioto — Higashiyama y Gion',
    slots: [
      {
        key: 'morning',
        label: 'Mañana',
        summary: 'Ladera histórica de templos con calles empedradas en pendiente, núcleo del Kioto tradicional.',
        zones: [
          { zoneId: 'kiyomizu-dera' },
          { zoneId: 'higashiyama-sannenzaka' },
        ],
      },
      {
        key: 'afternoon',
        label: 'Tarde',
        summary: 'Barrio histórico de geishas, con casas de té de madera y ambiente al caer la tarde.',
        zones: [{ zoneId: 'gion' }],
      },
    ],
  },

  // ── Día 20 — Jueves 20 mayo 2027 — Kioto (noche 3) ───────────────────────
  {
    id: 20,
    date: '2027-05-20',
    citySlug: 'kioto',
    title: 'Kioto — Fushimi Inari y Arashiyama',
    transfers: [
      {
        from: 'Centro de Kioto',
        to: 'Fushimi Inari / Arashiyama',
        mode: 'tren',
        line: 'JR Nara Line (Fushimi Inari) + JR San-in / Randen (Arashiyama)',
        duration: '~5–20 min por tramo',
        notes: [
          'Fushimi Inari muy temprano para evitar gentío',
          'Los dos puntos están en extremos opuestos de la ciudad: planificar el cruce',
        ],
      },
    ],
    slots: [
      {
        key: 'morning',
        label: 'Mañana',
        summary: 'Santuario de los miles de toriis bermellones en la ladera de la montaña. Ir al amanecer para verlo despejado.',
        zones: [{ zoneId: 'fushimi-inari' }],
      },
      {
        key: 'afternoon',
        label: 'Tarde',
        summary: 'Distrito de las afueras con bosque de bambú y templo zen junto al río y los montes del oeste.',
        zones: [{ zoneId: 'arashiyama' }],
      },
    ],
  },

  // ── Día 21 — Viernes 21 mayo 2027 — Kioto (noche 4) ──────────────────────
  {
    id: 21,
    date: '2027-05-21',
    citySlug: 'kioto',
    title: 'Kioto — Kinkaku-ji, Nijō y Nishiki',
    slots: [
      {
        key: 'morning',
        label: 'Mañana',
        summary: 'Pabellón dorado sobre su estanque, jardín zen de piedras célebre y castillo de la era Edo en el noroeste de la ciudad.',
        zones: [
          { zoneId: 'kinkakuji' },
          { zoneId: 'nijo' },
        ],
      },
      {
        key: 'afternoon',
        label: 'Tarde',
        summary: 'Mercado cubierto de comida en el centro de la ciudad para cerrar el bloque de Kioto.',
        zones: [{ zoneId: 'nishiki' }],
      },
    ],
  },

  // ── Día 22 — Sábado 22 mayo 2027 — Osaka (noche 1), Nara en ruta ─────────
  {
    id: 22,
    date: '2027-05-22',
    citySlug: 'osaka',
    title: 'Nara en ruta y llegada a Osaka',
    transfers: [
      {
        from: 'Kioto',
        to: 'Nara',
        mode: 'tren',
        line: 'Kintetsu Limited Express o JR Nara Line',
        duration: '~45 min',
        notes: [
          'Parada de día en Nara con equipaje: valorar consigna en estación',
        ],
      },
      {
        from: 'Nara',
        to: 'Osaka',
        mode: 'tren',
        line: 'Kintetsu Nara Line → Osaka-Namba',
        duration: '~40 min',
        notes: [
          'Llegada a Osaka por la tarde/noche',
          'Alojamiento por la zona de Dōtonbori/Namba',
        ],
      },
    ],
    slots: [
      {
        key: 'morning',
        label: 'Mañana / En ruta',
        summary: 'Parada en la antigua capital: gran templo con Buda monumental, parque con ciervos en libertad y barrio histórico.',
        zones: [
          { zoneId: 'nara-todaiji' },
          { zoneId: 'naramachi' },
        ],
      },
      {
        key: 'afternoon',
        label: 'Tarde / Llegada a Osaka',
        summary: 'Traslado a Osaka y primera toma de contacto con el corazón gastronómico y de ocio nocturno de la ciudad.',
        zones: [{ zoneId: 'dotonbori' }],
      },
    ],
  },

  // ── Día 23 — Domingo 23 mayo 2027 — Osaka (noche 2), Katsuo-ji ───────────
  {
    id: 23,
    date: '2027-05-23',
    citySlug: 'osaka',
    title: 'Katsuo-ji (templo de los daruma) y Minami',
    transfers: [
      {
        from: 'Osaka',
        to: 'Katsuo-ji (Minoh)',
        mode: 'tren',
        line: 'Metro Midosuji → Minoh-Kayano + bus Hankyu',
        duration: '~50–55 min cada sentido',
        roundTrip: true,
        notes: [
          'Domingo: buses frecuentes (entre semana hay 1 cada 1–2 h)',
          'Último bus de bajada ~16:48 los domingos: no apurar la tarde allí',
        ],
      },
    ],
    slots: [
      {
        key: 'morning',
        label: 'Mañana / Excursión',
        summary: 'Templo de montaña al norte de Osaka, sembrado de miles de muñecos daruma. Ir por la mañana y volver a mediodía.',
        zones: [{ zoneId: 'katsuo-ji' }],
      },
      {
        key: 'afternoon',
        label: 'Tarde',
        summary: 'Corazón gastronómico y comercial del sur de Osaka: canales y neones, galerías cubiertas y barrio de moda de segunda mano.',
        zones: [{ zoneId: 'dotonbori' }],
      },
    ],
  },

  // ── Día 24 — Lunes 24 mayo 2027 — Osaka (noche 3), Hiroshima day-trip ────
  {
    id: 24,
    date: '2027-05-24',
    citySlug: 'osaka',
    title: 'Excursión a Hiroshima — Parque de la Paz',
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
          'Miyajima queda fuera de la ruta redonda (reservado para la open-jaw)',
          'Salir temprano para aprovechar el día',
        ],
      },
    ],
    slots: [
      {
        key: 'morning',
        label: 'Mañana',
        summary: 'Parque memorial y museo dedicados a la memoria histórica de la ciudad.',
        zones: [{ zoneId: 'hiroshima-paz' }],
      },
      {
        key: 'afternoon',
        label: 'Tarde / Regreso',
        summary: 'Especialidad gastronómica local antes de tomar el shinkansen de vuelta a Osaka.',
        zones: [],
      },
    ],
  },

  // ── Día 25 — Martes 25 mayo 2027 — Osaka (noche 4) ───────────────────────
  {
    id: 25,
    date: '2027-05-25',
    citySlug: 'osaka',
    title: 'Osaka — Castillo, Kuromon y Shinsekai',
    slots: [
      {
        key: 'morning',
        label: 'Mañana',
        summary: 'Castillo histórico en su parque y mercado cubierto de comida callejera y producto fresco.',
        zones: [
          { zoneId: 'osaka-castillo' },
          { zoneId: 'kuromon' },
        ],
      },
      {
        key: 'afternoon',
        label: 'Tarde',
        summary: 'Barrio retro con su torre-mirador y, opcionalmente, el distrito otaku de Den Den Town a un paseo.',
        zones: [{ zoneId: 'shinsekai' }],
      },
    ],
  },

  // ── Día 26 — Miércoles 26 mayo 2027 — Tokio · bloque 2 (noche 1) ─────────
  {
    id: 26,
    date: '2027-05-26',
    citySlug: 'tokio',
    title: 'Osaka → Tokio — Vuelta y Akihabara',
    transfers: [
      {
        from: 'Osaka',
        to: 'Tokio',
        mode: 'shinkansen',
        line: 'Tōkaidō Shinkansen (Shin-Osaka → Tokio)',
        duration: '~2h30–3h',
        notes: [
          'Monte Fuji desde la ventanilla (lado derecho sentido Tokio) si despeja',
          'Reservar asiento lado Fuji (columna E)',
        ],
      },
    ],
    slots: [
      {
        key: 'morning',
        label: 'Mañana / Traslado',
        summary: 'Trayecto en shinkansen de vuelta a Tokio, con el Fuji desde la ventanilla si el cielo acompaña. Mañana de tránsito.',
        zones: [],
      },
      {
        key: 'afternoon',
        label: 'Tarde',
        summary: 'Distrito de electrónica y cultura otaku, con tiendas especializadas, multiplantas y cadenas de segunda mano (libros, manga, videojuegos).',
        zones: [{ zoneId: 'akihabara' }],
      },
    ],
  },

  // ── Día 27 — Jueves 27 mayo 2027 — Tokio · bloque 2 (noche 3) ────────────
  {
    id: 27,
    date: '2027-05-27',
    citySlug: 'tokio',
    title: 'Comodín — Fukagawa/Kiyosumi y Odaiba',
    slots: [
      {
        key: 'morning',
        label: 'Mañana',
        summary: 'Shitamachi del este: jardín japonés de paseo y museo que recrea un barrio de la era Edo, con parada gastronómica local (yaki-katsudon) antes de cruzar a la bahía.',
        zones: [{ zoneId: 'kiyosumi-fukagawa' }],
      },
      {
        key: 'afternoon',
        label: 'Tarde',
        summary: 'Frente marítimo de la bahía: réplica de la Estatua de la Libertad, playa urbana y vistas al Rainbow Bridge, más el centro comercial DiverCity con la tienda Gundam Base.',
        zones: [{ zoneId: 'odaiba' }],
      },
    ],
  },

  // ── Día 28 — Viernes 28 mayo 2027 — Tokio · bloque 2 (noche 3) ───────────
  {
    id: 28,
    date: '2027-05-28',
    citySlug: 'tokio',
    title: 'Tokio · bloque 2 — Asakusa, Skytree y compras finales',
    slots: [
      {
        key: 'morning',
        label: 'Mañana',
        summary: 'Lo que quedó pendiente del este de Tokio (barrio histórico de Edo) y compras finales.',
        zones: [{ zoneId: 'asakusa' }],
      },
      {
        key: 'afternoon',
        label: 'Tarde / atardecer',
        summary: 'Mirador más alto de la ciudad al atardecer y preparación del equipaje para el regreso.',
        zones: [{ zoneId: 'tokyo-skytree' }],
      },
    ],
  },

  // ── Día 29 — Sábado 29 mayo 2027 — Regreso ───────────────────────────────
  {
    id: 29,
    date: '2027-05-29',
    citySlug: 'tokio',
    title: 'Tokio → Narita — Vuelo de regreso',
    transfers: [
      {
        from: 'Tokio',
        to: 'Aeropuerto de Narita (NRT)',
        mode: 'tren',
        line: 'Narita Express (N’EX) o Keisei Skyliner',
        duration: '~1h',
        notes: [
          'Vuelo a las 18:00 — estar en el aeropuerto ~15:00',
          'Grupo de 4: prever facturación y devolución de Suica/equipaje',
        ],
      },
    ],
    slots: [
      {
        key: 'morning',
        label: 'Mañana libre',
        summary: 'Mañana libre en Tokio para últimas compras o un paseo tranquilo antes de cerrar el viaje.',
        zones: [],
      },
      {
        key: 'afternoon',
        label: 'Tarde / Salida',
        summary: 'Traslado al aeropuerto de Narita y vuelo de regreso (18:00). Tarde de tránsito.',
        zones: [],
      },
    ],
  },
] as const
