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

  // ── Día 26 — Tokyo Skytree (Oshiage, combina con Asakusa) ───────────────
  {
    id: 'tokyo-skytree',
    name: 'Tokyo Skytree',
    citySlug: 'tokio',
    coordinates: [139.8107, 35.7101],
    tags: ['mirador', 'iconico', 'moderno', 'shitamachi'],
    practical: {
      access:
        'Tobu Skytree Line / Metro Hanzomon — Estación Oshiage o Tokyo Skytree. A 20 min a pie o 3 min en metro desde Asakusa',
      hours: 'Tembo Deck (350 m) y Tembo Galleria (450 m): ~9:00–22:00 (última entrada 21:00)',
      logistics: [
        'Subir al atardecer (17:00–19:00 en mayo): vistas con luz y luego iluminado',
        'Comprar entrada online con antelación (ticket rápido para extranjeros) — grupo de 8',
        'A los pies está Tokyo Solamachi (centro comercial)',
        'Se ve gratis e iluminado desde el puente Azuma-bashi (Asakusa)',
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

  // ── Tokio · bloque 2 ──────────────────────────────────────────────────

  {
    id: 'akihabara',
    name: 'Akihabara',
    citySlug: 'tokio',
    coordinates: [139.7732, 35.7022],
    tags: ['electronica', 'cultura-pop', 'otaku', 'compras'],
    practical: {
      access: 'JR Yamanote / Keihin-Tohoku — Estación Akihabara (salida Electric Town). Metro Hibiya — Akihabara',
      hours: 'Tiendas: 10:00–20:00 en general. Yodobashi-Akiba: 9:30–22:00',
      logistics: [
        'Yodobashi-Akiba: tax-free con pasaporte en mostradores designados',
        'Book Off y Mandarake: segunda mano de manga, videojuegos y figures',
        'Combina a pie con Ueno (~15 min) y Yanaka',
        'Días de semana menos masificado que el fin de semana',
      ],
    },
  },

  {
    id: 'daikanyama',
    name: 'Daikanyama',
    citySlug: 'tokio',
    coordinates: [139.7028, 35.6490],
    tags: ['barrio-residencial', 'moda', 'lifestyle', 'cafes'],
    practical: {
      access: 'Tokyu Toyoko Line — Estación Daikanyama (1 parada desde Shibuya)',
      hours: 'Tiendas: 11:00–20:00 aprox. Tsutaya Books: 7:00–26:00',
      logistics: [
        'Tsutaya Books T-Site: librería-concept store abierta hasta las 2:00',
        'Barrio compacto: todo a pie en 20–30 min',
        'Combina con Nakameguro (10 min a pie siguiendo el canal)',
        'Mejor entre semana para pasear tranquilo',
      ],
    },
  },

  // ── Takaragawa ────────────────────────────────────────────────────────

  {
    id: 'takaragawa-onsen',
    name: 'Takaragawa Onsen (Osenkaku)',
    citySlug: 'takaragawa',
    coordinates: [138.9206, 36.8367],
    tags: ['onsen', 'ryokan', 'naturaleza', 'rural'],
    practical: {
      access: 'Tren Jōetsu Shinkansen hasta Jōmō-Kōgen + lanzadera del ryokan (~30 min). Reservar lanzadera con la estancia',
      hours: 'Baños exteriores: 9:00–16:00 para visitantes externos (reserva recomendada). Huéspedes: acceso ampliado',
      logistics: [
        'Reservar la lanzadera del ryokan con antelación al hacer la reserva de la estancia',
        'Valorar takkyubin para el equipaje grande desde Tokio',
        'Efectivo imprescindible (ryokan y zona rural)',
        'Check-in ~15:00; cena kaiseki incluida normalmente',
      ],
    },
  },

  // ── Kanazawa ──────────────────────────────────────────────────────────

  {
    id: 'higashi-chaya',
    name: 'Higashi Chaya',
    citySlug: 'kanazawa',
    coordinates: [136.6612, 36.5720],
    tags: ['historico', 'tradicional', 'artesania', 'chaya'],
    practical: {
      access: 'Autobús urbano Loop Bus (Higashi Chaya parada) desde Kanazawa Estación (~15 min)',
      hours: 'Calles: acceso libre. Casas de té visitables: 9:00–18:00 aprox.',
      logistics: [
        'Efectivo en la mayoría de tiendas de artesanía y dulces',
        'Mejor llegar a primera hora de la mañana para verlo tranquilo',
        'Calle principal Higashiyama: libre a pie en 30–40 min',
        'Combina con Kenroku-en (~20 min a pie)',
      ],
    },
  },

  {
    id: 'kenrokuen',
    name: 'Kenroku-en',
    citySlug: 'kanazawa',
    coordinates: [136.6620, 36.5618],
    tags: ['jardin', 'historico', 'patrimonio', 'naturaleza'],
    practical: {
      access: 'Loop Bus — parada Kenrokuen-shita. O 15 min a pie desde Kanazawa Estación',
      hours: 'Mar–oct: 7:00–18:00. Nov–feb: 8:00–17:00. ¥320 adultos (gratuito antes de las 8:00 en temporada)',
      logistics: [
        'Entrada gratuita antes del horario oficial en temporada (verificar en 2027)',
        'Jardin compacto (~11 ha): 1–2 h suficientes',
        'Acceso directo al recinto del Castillo de Kanazawa',
        'Mejor por la mañana temprano para la luz y sin grupos',
      ],
    },
  },

  {
    id: 'kanazawa-castillo',
    name: 'Castillo de Kanazawa',
    citySlug: 'kanazawa',
    coordinates: [136.6577, 36.5627],
    tags: ['castillo', 'historico', 'parque', 'patrimonio'],
    practical: {
      access: 'Adyacente a Kenroku-en. Loop Bus — parada Kenrokuen-shita',
      hours: 'Parque: 7:00–18:00 (entrada gratuita). Pabellones interiores: 9:00–16:30, ¥320',
      logistics: [
        'Combinar con Kenroku-en en la misma visita (entrada directa entre ambos)',
        'Pabellones de madera restaurados con técnicas tradicionales',
        'Terreno llano: accesible para todo el grupo',
      ],
    },
  },

  {
    id: 'nagamachi',
    name: 'Nagamachi (barrio samurái)',
    citySlug: 'kanazawa',
    coordinates: [136.6515, 36.5598],
    tags: ['historico', 'samurai', 'tradicional', 'museo'],
    practical: {
      access: 'Loop Bus — parada Korinbo. O 20 min a pie desde Kanazawa Estación',
      hours: 'Calles: acceso libre. Nomura-ke (casa samurái): 8:30–17:30, ¥550',
      logistics: [
        'Nomura-ke: casa samurái histórica con jardín interior, entrada ~¥550',
        'Calles de muros de adobe: paseo de 30–45 min',
        'Combina con Ōmichō (~10 min a pie caminando hacia la estación)',
        'Efectivo recomendado para entradas y tiendas pequeñas',
      ],
    },
  },

  {
    id: 'omicho',
    name: 'Mercado Ōmichō',
    citySlug: 'kanazawa',
    coordinates: [136.6554, 36.5663],
    tags: ['mercado', 'gastronomia', 'marisco', 'local'],
    practical: {
      access: 'Loop Bus — parada Musashigatsuji/Ōmichō Ichiba. O 10 min a pie desde Kenroku-en',
      hours: '9:00–17:00 aprox. Algunos puestos desde 7:00. Cerrado algunos domingos y festivos',
      logistics: [
        'Marisco del Mar de Japón: cangrejo, calamares y peces locales',
        'Efectivo imprescindible en la mayoría de puestos',
        'Mejor 9:00–11:00 para mayor variedad y puestos abiertos',
        'Pequeños restaurantes de sushi en el interior del mercado',
      ],
    },
  },

  // ── Takayama ──────────────────────────────────────────────────────────

  {
    id: 'sanmachi-suji',
    name: 'Sanmachi Suji',
    citySlug: 'takayama',
    coordinates: [137.2529, 36.1462],
    tags: ['historico', 'tradicional', 'sake', 'casco-antiguo'],
    practical: {
      access: '10 min a pie desde Takayama Estación hacia el este cruzando el río Miyagawa',
      hours: 'Calles: acceso libre. Destilerías de sake: 9:00–17:00 aprox. Tiendas de artesanía: 9:00–17:00',
      logistics: [
        'Tres calles paralelas históricas de la era Edo: Kami-Sannomachi, Naka-Sannomachi, Shimo-Sannomachi',
        'Destilerías de sake con degustación gratuita o pequeña tarifa',
        'Llegar temprano (antes de las 9:00) o al atardecer para menos gentío',
        'Efectivo recomendado para tiendas pequeñas y artesanía',
      ],
    },
  },

  {
    id: 'hida-no-sato',
    name: 'Hida no Sato',
    citySlug: 'takayama',
    coordinates: [137.2337, 36.1519],
    tags: ['museo', 'arquitectura', 'al-aire-libre', 'tradicional'],
    practical: {
      access: 'Autobús desde Takayama Estación (~10 min, línea Sarubobo-go). O 30 min a pie',
      hours: '8:30–17:00 (última entrada 16:30). Abierto todos los días. ¥700 adultos',
      logistics: [
        'Museo de 30+ casas históricas gassho-zukuri desmontadas y reubicadas',
        'Entrada ¥700; tarjeta aceptada en taquilla, efectivo en interior',
        'Combina con Shirakawa-go si se quiere ver casas similares in situ',
        'Calcular 1,5–2 h para recorrer el recinto cómodamente',
      ],
    },
  },

  {
    id: 'takayama-jinya',
    name: 'Takayama Jinya',
    citySlug: 'takayama',
    coordinates: [137.2499, 36.1432],
    tags: ['historico', 'patrimonio', 'gobierno-edo', 'museo'],
    practical: {
      access: '5 min a pie desde Sanmachi Suji, al sur del barrio histórico',
      hours: '8:45–17:00 (ago: hasta 18:00). Cerrado 29 dic–3 ene. ¥450 adultos',
      logistics: [
        'Único edificio de gobierno provincial de la era Edo que sobrevive en Japón',
        'Entrada ¥450; audio-guía disponible en español (verificar disponibilidad 2027)',
        'Visita de 45–60 min suficiente',
        'Salida de Takayama hacia Kioto idealmente tras visitar este y el mercado de Miyagawa',
      ],
    },
  },

  {
    id: 'miyagawa-asaichi',
    name: 'Mercado matutino de Miyagawa',
    citySlug: 'takayama',
    coordinates: [137.2555, 36.1452],
    tags: ['mercado', 'gastronomia', 'local', 'matutino'],
    practical: {
      access: 'Orilla derecha del río Miyagawa, frente a Sanmachi Suji. 10 min a pie desde la estación',
      hours: '6:00–12:00 (abr–oct). 7:00–12:00 (nov–mar). Cerrado el día 31 de cada mes',
      logistics: [
        'Llegar entre 7:00 y 8:30 para la mayor variedad de producto',
        'Verduras locales, conservas, artesanía y comida callejera',
        'Efectivo imprescindible en todos los puestos',
        'Breve (200 m de mercado): 30–45 min suficientes antes de coger el tren',
      ],
    },
  },

  // ── Shirakawa-go ──────────────────────────────────────────────────────

  {
    id: 'shirakawago-ogimachi',
    name: 'Shirakawa-go (Ogimachi)',
    citySlug: 'shirakawago',
    coordinates: [136.9052, 36.2570],
    tags: ['patrimonio-unesco', 'arquitectura', 'rural', 'aldea'],
    practical: {
      access: 'Bus Nohi desde Takayama Estación (~50 min). Reservar con antelación — se llena',
      hours: 'Aldea: libre. Museo Wada-ke: 9:00–17:00. Mirador Shiroyama: acceso libre todo el día',
      logistics: [
        'MASIFICACIÓN: tomar el primer bus (~7:30) o llegar antes de las 9:00; domingos y festivos se colapsa',
        'Reservar el bus de ida y vuelta con antelación — los turnos de regreso se agotan',
        'Efectivo para entradas de casas visitables (~¥300–600) y restaurantes',
        'Mirador Shiroyama: 10 min a pie desde el aparcamiento, vistas panorámicas de la aldea',
      ],
    },
  },

  // ── Kioto ─────────────────────────────────────────────────────────────

  {
    id: 'kioto-estacion',
    name: 'Estación de Kioto y centro',
    citySlug: 'kioto',
    coordinates: [135.7588, 34.9858],
    tags: ['transporte', 'compras', 'gastronomia', 'referencia'],
    practical: {
      access: 'Shinkansen Tōkaidō/Sanyō — Kioto Estación. JR, bus urbano y metro accesibles desde aquí',
      hours: 'Estación: 5:30–24:00 aprox. Centro comercial Porta: 10:00–20:30. Isetan: 10:00–20:00',
      logistics: [
        'Recoger IC card (ICOCA) en los tornos de JR Kioto si no se trae de Tokio',
        'Congelar el equipaje en consignas de la estación (coin lockers o servicio de consigna pagado)',
        'Isetan y Porta en la propia estación para compras de último momento',
        'Punto de referencia central: todos los buses urbanos y metro salen desde aquí',
      ],
    },
  },

  {
    id: 'kiyomizu-dera',
    name: 'Kiyomizu-dera',
    citySlug: 'kioto',
    coordinates: [135.7850, 34.9948],
    tags: ['templo', 'historico', 'patrimonio-unesco', 'montaña'],
    practical: {
      access: 'Bus urbano línea 100 o 206 desde Kioto Estación — parada Gojo-zaka o Kiyomizu-michi (~20 min)',
      hours: '6:00–18:00 (ago: hasta 21:30 para illuminación nocturna). ¥500 adultos',
      logistics: [
        'Llegar antes de las 8:00 para evitar grupos; por la tarde 16:30+ también hay menos gentío',
        'Cuesta empinada desde la parada de bus: 15 min a pie subiendo',
        'Templo en restauración parcial posible (verificar estado obras en 2027)',
        'Combina a pie con Higashiyama/Sannenzaka bajando desde el templo',
      ],
    },
  },

  {
    id: 'higashiyama-sannenzaka',
    name: 'Higashiyama (Sannenzaka / Ninenzaka)',
    citySlug: 'kioto',
    coordinates: [135.7806, 34.9990],
    tags: ['historico', 'tradicional', 'paseo', 'artesania'],
    practical: {
      access: 'Desde Kiyomizu-dera bajando a pie (~5 min). Bus urbano 100/206 — parada Kiyomizu-michi',
      hours: 'Calles: acceso libre. Tiendas: 9:00–17:00/18:00 aprox.',
      logistics: [
        'Calles adoquinadas en pendiente: calzado cómodo imprescindible',
        'Efectivo en tiendas de artesanía y puestos de comida',
        'Mejor horario: mañana temprana (antes de 9:30) o tarde (16:30+)',
        'Enlaza con el barrio de Gion hacia el norte a 15–20 min a pie',
      ],
    },
  },

  {
    id: 'gion',
    name: 'Gion',
    citySlug: 'kioto',
    coordinates: [135.7751, 35.0038],
    tags: ['historico', 'geishas', 'tradicional', 'nocturno'],
    practical: {
      access: 'Bus urbano 100/206 — parada Gion. Metro Keihan — Gion-Shijo',
      hours: 'Calles: acceso libre. Hanamikoji: mejor al atardecer. Yasaka Jinja: 24h (recinto exterior)',
      logistics: [
        'Hanamikoji-dori: calle principal de machiyas; respetar la privacidad (no fotografiar geishas sin permiso)',
        'Mejor hora: 17:00–19:00 para la luz y la actividad de las okiya',
        'Yasaka Jinja: acceso libre, iluminado por la noche',
        'No grabar ni fotografiar a gente de frente sin su consentimiento',
      ],
    },
  },

  {
    id: 'fushimi-inari',
    name: 'Fushimi Inari Taisha',
    citySlug: 'kioto',
    coordinates: [135.7727, 34.9671],
    tags: ['santuario', 'torii', 'senderismo', 'patrimonio'],
    practical: {
      access: 'JR Nara Line — Estación Inari (2 min a pie). O Keihan — Fushimi-Inari',
      hours: 'Recinto exterior: 24h. Oficinas: 8:30–16:30. Entrada gratuita',
      logistics: [
        'Ir al amanecer (5:30–7:00) para los primeros tramos sin nadie',
        'Subida completa hasta la cima: ~2–3 h ida y vuelta; subida parcial (Yotsutsuji): ~45 min',
        'Calzado deportivo recomendado para el ascenso',
        'Efectivo para los puestos de comida de la base',
      ],
    },
  },

  {
    id: 'arashiyama',
    name: 'Arashiyama',
    citySlug: 'kioto',
    coordinates: [135.6726, 35.0094],
    tags: ['naturaleza', 'bambu', 'templo', 'rio'],
    practical: {
      access: 'JR San-in Line — Saga-Arashiyama. O Randen (Keifuku) — Arashiyama. O Hankyu — Arashiyama',
      hours: 'Bosque de bambú: acceso libre 24h. Tenryu-ji: 8:30–17:00, ¥500. Togetsukyo: libre',
      logistics: [
        'Bosque de bambú: mejor al amanecer o después de las 17:00 (fuera de horario de buses turísticos)',
        'Tenryu-ji: jardín Patrimonio de la UNESCO; ¥500 jardín / ¥800 con sala Sogenchi',
        'Rickshaw disponible en la zona (precio orientativo ¥2.000–5.000 por tramo)',
        'Combina con Kinkaku-ji en la misma jornada si se gestiona bien el tiempo',
      ],
    },
  },

  {
    id: 'kinkakuji',
    name: 'Kinkaku-ji',
    citySlug: 'kioto',
    coordinates: [135.7292, 35.0394],
    tags: ['templo', 'jardines', 'patrimonio-unesco', 'iconico'],
    practical: {
      access: 'Bus urbano 101 o 204 desde Kioto Estación — parada Kinkakuji-michi (~40 min)',
      hours: '9:00–17:00. ¥500 adultos. Abierto todos los días',
      logistics: [
        'Llegar a las 9:00 en punto para la primera entrada; se llena rapidísimo',
        'Visita de 45–60 min suficiente (circuito exterior único)',
        'Entrada incluye talismán de papel como ticket',
        'Combina con Ryōan-ji (jardín zen, ~10 min a pie) para completar la mañana',
      ],
    },
  },

  {
    id: 'nijo',
    name: 'Castillo Nijō',
    citySlug: 'kioto',
    coordinates: [135.7481, 35.0142],
    tags: ['castillo', 'historico', 'patrimonio-unesco', 'shogunato'],
    practical: {
      access: 'Metro Tōzai — Nijōjō-mae. O Bus urbano 9/50 — parada Nijojo-mae',
      hours: '8:45–17:00 (última entrada 16:00). Cerrado martes en ene y jul. ¥1.030 adultos',
      logistics: [
        'Reservar entrada online si se viaja en temporada alta (mayo ya es alta)',
        'Suelos "ruiseñor" (uguisubari): crujen al caminar como medida de seguridad histórica',
        'Jardín Ninomaru: incluido en la entrada; floración de ciruelos o azaleas según temporada',
        'Calcular 1,5–2 h para palacio y jardines',
      ],
    },
  },

  {
    id: 'nishiki',
    name: 'Mercado Nishiki',
    citySlug: 'kioto',
    coordinates: [135.7654, 35.0046],
    tags: ['mercado', 'gastronomia', 'local', 'tradicional'],
    practical: {
      access: 'Metro Karasuma — Shijo. O bus urbano — parada Shijo-Karasuma. A pie desde Gion (10 min)',
      hours: '10:00–18:00 aprox. Algunos puestos desde 9:00. Cerrado miércoles varios locales',
      logistics: [
        'Pasaje cubierto de ~400 m con ~100 puestos de comida y producto local',
        'Efectivo recomendado en la mayoría de puestos',
        'Mejor antes de las 11:00 o después de las 15:00 para evitar el pico',
        'Combina con el barrio de Gion o con el Castillo Nijō (metro directo)',
      ],
    },
  },

  {
    id: 'toji',
    name: 'Tō-ji',
    citySlug: 'kioto',
    coordinates: [135.7475, 34.9804],
    tags: ['templo', 'historico', 'mercadillo', 'pagoda'],
    practical: {
      access: 'JR Kintetsu Kyoto Line — Tōji Estación (5 min a pie). O 15 min a pie desde Kioto Estación',
      hours: 'Recinto: 5:00–17:00 (gratuito). Kodo/Mido: 8:00–17:00, ¥500. Mercadillo del 21: todo el día',
      logistics: [
        'Mercadillo mensual el día 21 (kobo-ichi): antigüedades, artesanía y comida — gratis',
        'La visita del día 21 de mayo 2027 es perfecta para el mercadillo mensual',
        'Pagoda de cinco plantas: monumento nacional más alto de Japón (~55 m)',
        'Efectivo imprescindible en el mercadillo',
      ],
    },
  },

  // ── Nara ──────────────────────────────────────────────────────────────

  {
    id: 'nara-todaiji',
    name: 'Tōdai-ji y parque de Nara',
    citySlug: 'nara',
    coordinates: [135.8399, 34.6895],
    tags: ['templo', 'patrimonio-unesco', 'parque', 'historico'],
    practical: {
      access: 'Desde Nara Estación (JR o Kintetsu): bus urbano ~10 min o 30 min a pie',
      hours: 'Gran Buda (Daibutsu-den): 7:30–17:30 (nov–feb: 8:00–17:00). ¥600 adultos. Parque: libre 24h',
      logistics: [
        'Ciervos sueltos por el parque: se acercan por comida (sembei de ciervos ~¥200 en puestos)',
        'Cuidado con los ciervos y los bolsos — son curiosos y a veces muerden',
        'Combina con Naramachi (~20 min a pie hacia el sur)',
        'Llegar antes de las 9:00 para el Daibutsu sin aglomeración',
      ],
    },
  },

  {
    id: 'naramachi',
    name: 'Naramachi',
    citySlug: 'nara',
    coordinates: [135.8331, 34.6842],
    tags: ['historico', 'barrio', 'artesania', 'tradicional'],
    practical: {
      access: '20 min a pie hacia el sur desde el parque de Nara y Tōdai-ji',
      hours: 'Calles: acceso libre. Museos y casas históricas: 9:00–17:00 aprox. Cerrado lunes algunos locales',
      logistics: [
        'Barrio histórico de casas machiya mercantiles (era Edo–Meiji) convertidas en tiendas y cafés',
        'Naramachi Koshi-no-ie: casa mercader restaurada, entrada gratuita (9:00–17:00)',
        'Efectivo en la mayoría de tiendas de artesanía',
        'Combina con Tōdai-ji en la misma mañana antes de tomar el tren a Osaka',
      ],
    },
  },

  // ── Osaka ─────────────────────────────────────────────────────────────

  {
    id: 'katsuo-ji',
    name: 'Katsuo-ji',
    citySlug: 'osaka',
    coordinates: [135.4889, 34.8569],
    tags: ['templo', 'daruma', 'montana', 'historico'],
    practical: {
      access:
        'Metro Midosuji hasta Minoh-Kayano (~35 min) + bus Hankyu (~15–20 min, ~¥400). Domingos/festivos con buses frecuentes',
      hours: '8:00–17:00 (sáb hasta 18:00); último acceso 30 min antes. Entrada ~¥500 (confirmar)',
      logistics: [
        'Templo de montaña famoso por los miles de muñecos daruma (templo de la victoria / buena suerte)',
        '⚠️ Buses escasos entre semana (1/hora o cada 2h); frecuentes en findes/festivos. Último bus de bajada ~16:48 (dom/festivos), ~16:18 (laborables)',
        'En mayo no hay hojas de otoño (su pico visual), pero está verde y tranquilo',
        'Excursión de media jornada desde el norte de Osaka',
      ],
    },
  },

  {
    id: 'dotonbori',
    name: 'Dōtonbori',
    citySlug: 'osaka',
    coordinates: [135.5021, 34.6687],
    tags: ['gastronomia', 'ocio-nocturno', 'iconico', 'entretenimiento'],
    practical: {
      access: 'Metro Midosuji o Sennichimae — Namba Estación (salida 14). O Keihan — Namba',
      hours: 'Canal y zona: libre 24h. Tiendas y restaurantes: 11:00–23:00/24:00 aprox.',
      logistics: [
        'Takoyaki, okonomiyaki y kushikatsu: especialidades locales a pie de calle',
        'Zona más animada entre 18:00 y 22:00',
        'Glico man (hombre corriendo): icono fotográfico junto al puente Ebisu',
        'Efectivo en muchos puestos de comida callejera; tarjeta en restaurantes medianos',
      ],
    },
  },

  {
    id: 'osaka-castillo',
    name: 'Castillo de Osaka',
    citySlug: 'osaka',
    coordinates: [135.5259, 34.6873],
    tags: ['castillo', 'historico', 'parque', 'museo'],
    practical: {
      access: 'Metro Tanimachi 4-chome o Osaka Business Park. JR Ōsakajō-Kōen',
      hours: 'Parque: libre. Torre del castillo (museo): 9:00–17:00 (última entrada 16:30). ¥600 adultos',
      logistics: [
        'Parque exterior gratuito: acceso libre desde primera hora',
        'Museo en la torre: 8 plantas, ascensor disponible',
        'Área del castillo es amplia: calcular 1,5–2 h para parque y museo',
        'Combina con Kuromon (~20 min en metro o autobús)',
      ],
    },
  },

  {
    id: 'kuromon',
    name: 'Mercado Kuromon',
    citySlug: 'osaka',
    coordinates: [135.5065, 34.6686],
    tags: ['mercado', 'gastronomia', 'marisco', 'local'],
    practical: {
      access: 'Metro Sakaisuji — Nipponbashi (salida 10). O Metro Sennichimae — Nipponbashi',
      hours: '8:00–18:00 aprox. Algunos puestos desde 7:00. Cerrado algunos domingos y festivos',
      logistics: [
        'Mercado cubierto de ~600 puestos: fruta, marisco fresco y comida callejera',
        'Efectivo en la mayoría de puestos; algunos aceptan tarjeta',
        'Mejor 9:00–11:00 para marisco fresco y sin aglomeración turística',
        'Próximo a Dōtonbori (10 min a pie): combinar en la misma tarde',
      ],
    },
  },

  {
    id: 'shinsekai',
    name: 'Shinsekai / Tsūtenkaku',
    citySlug: 'osaka',
    coordinates: [135.5063, 34.6520],
    tags: ['retro', 'gastronomia', 'iconico', 'barrio'],
    practical: {
      access: 'Metro Sakaisuji — Ebisucho. O Metro Midosuji — Dobutsuen-mae',
      hours: 'Calles: libre. Torre Tsūtenkaku: 10:00–20:00, ¥900 adultos. Restaurantes: 11:00–22:00',
      logistics: [
        'Torre Tsūtenkaku: mirador retro (imitación de la Torre Eiffel de 1912), ¥900',
        'Kushikatsu: especialidad del barrio; regla local: no mojar dos veces en la salsa',
        'Barrio con ambiente auténtico de Osaka obachan-culture',
        'Efectivo recomendado en los restaurantes tradicionales de kushikatsu',
      ],
    },
  },

  // ── Hiroshima ─────────────────────────────────────────────────────────

  {
    id: 'hiroshima-paz',
    name: 'Parque Memorial de la Paz',
    citySlug: 'hiroshima',
    coordinates: [132.4533, 34.3955],
    tags: ['memorial', 'historico', 'museo', 'patrimonio'],
    practical: {
      access: 'Tranvía línea 2 o 6 desde Hiroshima Estación — parada Genbaku-Dome-Mae (~15 min)',
      hours: 'Parque: libre 24h. Museo: 8:30–18:00 (ago: hasta 19:00). ¥200 adultos',
      logistics: [
        'Reservar entrada al museo online si se viaja en temporada alta',
        'Museo: 2–3 h para recorrerlo con atención; muy intenso emocionalmente',
        'Cúpula Genbaku (Patrimonio UNESCO): acceso exterior libre desde el parque',
        'Okonomiyaki estilo Hiroshima para comer antes del shinkansen de vuelta',
      ],
    },
  },

  // ── Día 27 — Odaiba (bahía de Tokio, comodín bloque 2) ──────────────────
  {
    id: 'odaiba',
    name: 'Odaiba',
    citySlug: 'tokio',
    coordinates: [139.7745, 35.6271],
    tags: ['bahia', 'ocio', 'moderno', 'compras', 'vistas'],
    practical: {
      access:
        'Yurikamome desde Shimbashi (~15 min, vistas de la bahía) o Rinkai Line hasta Tokyo Teleport',
      hours:
        'Centros comerciales: tiendas 11:00–21:00. The Gundam Base (DiverCity, planta 7): ~10:00–21:00',
      logistics: [
        '⚠️ La estatua gigante del Unicorn Gundam fue retirada (ago-2026): la plaza de DiverCity estará vacía en may-2027',
        'Sí sigue The Gundam Base Tokyo (mayor tienda de Gunpla de Japón, DiverCity planta 7)',
        'Réplica de la Estatua de la Libertad y playa de Odaiba (Seaside Park) con el Rainbow Bridge de fondo: gratis',
        'Atracciones en radio andable: DiverCity ↔ Aqua City ↔ Decks ↔ Fuji TV (15–20 min a pie)',
        'Combinable por la tarde con teamLab Planets en Toyosu (Yurikamome ~15 min; reserva online obligatoria)',
      ],
    },
  },

  // ── Día 27 — Kiyosumi-Shirakawa / Fukagawa (mañana, antes de Odaiba) ────
  {
    id: 'kiyosumi-fukagawa',
    name: 'Kiyosumi-Shirakawa y Fukagawa',
    citySlug: 'tokio',
    coordinates: [139.798, 35.6818],
    tags: ['jardin', 'museo', 'historico', 'shitamachi', 'gastronomia'],
    practical: {
      access:
        'Metro Tozai u Ōedo — Monzen-Nakachō; Ōedo o Hanzōmon — Kiyosumi-Shirakawa (1 parada entre sí, ~15 min a pie)',
      hours:
        'Jardín Kiyosumi: 9:00–17:00 (última entrada 16:30), ¥150. Fukagawa Edo Museum: ~9:30–17:00 (verificar 2027). Tonkatsu Marushichi: 11:30–17:00',
      logistics: [
        'Jardín Kiyosumi: jardín de paseo con gran estanque y piedras para cruzar el agua (isowatari)',
        'Fukagawa Edo Museum: recreación a tamaño real de un barrio del final de la era Edo',
        'Comer en Tonkatsu Marushichi (yaki-katsudon; sin reservas, llegar pronto) — ⚠️ cerrado miércoles',
        'Combina por la tarde con Odaiba (mismo lado este/bahía)',
      ],
    },
  },

  // ── Kamakura (alternativa del día 27, actualmente no asignada) ──────────

  {
    id: 'kamakura-daibutsu',
    name: 'Gran Buda de Kamakura (Kōtoku-in)',
    citySlug: 'kamakura',
    coordinates: [139.5354, 35.3167],
    tags: ['templo', 'historico', 'buda', 'iconico'],
    practical: {
      access: 'JR Yokosuka Line — Kamakura Estación + bus Enoden o camino a pie (~30 min). O Enoden — Hase',
      hours: '8:00–17:30 (oct–mar: hasta 17:00). ¥300 adultos. Interior del Buda: ¥20 adicionales',
      logistics: [
        'Gran Buda de bronce al aire libre (13,35 m): se puede entrar al interior por ¥20',
        'Combina a pie con Hase-dera (~8 min andando)',
        'Regresar en Enoden (tren eléctrico costero) para ver la costa',
        'Llegar a primera hora (8:00–9:00) antes de los grupos de buses',
      ],
    },
  },

  {
    id: 'hase-dera',
    name: 'Hase-dera',
    citySlug: 'kamakura',
    coordinates: [139.5331, 35.3173],
    tags: ['templo', 'jardines', 'vistas', 'tradicional'],
    practical: {
      access: 'Enoden — Hase (salida norte, 5 min a pie). O 8 min a pie desde Kōtoku-in',
      hours: '8:00–17:30 (oct–feb: hasta 17:00). ¥400 adultos',
      logistics: [
        'Mirador sobre la bahía de Sagami: vistas panorámicas desde la terraza del templo',
        'Jardín con hortensias en junio; en mayo habrá plantas tempranas de temporada',
        'Gruta del Buda Amida iluminada en el interior de la roca (incluida en entrada)',
        'Combina directamente con Kōtoku-in (8 min a pie)',
      ],
    },
  },

  {
    id: 'kamakura-komachi',
    name: 'Komachi-dōri',
    citySlug: 'kamakura',
    coordinates: [139.5521, 35.3225],
    tags: ['compras', 'gastronomia', 'artesania', 'paseo'],
    practical: {
      access: 'Directamente a la salida este de Kamakura Estación (JR Yokosuka Line)',
      hours: 'Tiendas: 10:00–18:00 aprox. Abierto todos los días en temporada',
      logistics: [
        'Calle comercial de 350 m desde la estación hasta el santuario Tsurugaoka Hachimangū',
        'Especialidades locales: monaka, rice crackers y dulces de sésamo negro',
        'Efectivo en la mayoría de puestos de comida',
        'Tsurugaoka Hachimangū al final de la calle: recinto gratuito (flores en mayo)',
      ],
    },
  },
] as const
