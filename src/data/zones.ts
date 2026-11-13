/**
 * Zone data — todas las zonas del itinerario (días 8–28 de mayo de 2027)
 *
 * ANTI-SPOILER RULE (NOSPOIL-01, NOSPOIL-04):
 * - NO `description` field in any Zone object
 * - `practical` contains logistics only: access, hours, logistics tips
 * - Solo lo propio del lugar: una zona puede usarse en varios días, así que nada del plan de
 *   un día (horas de los pasos, «por eso tal día», reservas, trayectos). Ver itinerary.ts.
 * - Tags describe category/type, not what you'll see
 * - El contexto cultural vive aparte en context.ts (mismo id de zona)
 *
 * Coordinates: [lng, lat] GeoJSON order.
 * Sources: OpenStreetMap, Wikipedia, Google Maps public data (approximate centers).
 * Horarios: docs/revision-itinerario-fechas-2027.md (§3–§4) y docs/contexto-itinerario/v2/.
 * Son orientativos: comprobar los de 2027 antes del viaje.
 */

import type { Zone } from './types'

export const zones: readonly Zone[] = [
  // ── Tokio · bloque 1 (días 8–11) ─────────────────────────────────────────

  // ── Días 8 y 9 — Kanda Myōjin (Kanda Matsuri, si se confirma) ────────────
  {
    id: 'kanda',
    name: 'Kanda Myōjin',
    citySlug: 'tokio',
    coordinates: [139.7679, 35.702],
    tags: ['santuario', 'historico', 'tradicional'],
    practical: {
      access: 'JR Chūō/Sōbu o Metro Marunouchi — Ochanomizu (~5 min a pie). Desde Akihabara, ~7 min a pie',
      hours: 'Recinto: acceso libre',
      logistics: [
        'Kanda Matsuri 2027: fechas por confirmar; posible desfile el sáb 8 y entrada de mikoshi el dom 9 (alternativa: 15–16)',
        'El santuario publica el programa en primavera (kandamatsuri.com)',
      ],
    },
  },

  // ── Día 9 — Palacio Imperial ────────────────────────────────────────────
  {
    id: 'palacio-imperial',
    name: 'Palacio Imperial',
    citySlug: 'tokio',
    coordinates: [139.7528, 35.6842],
    tags: ['historico', 'jardines', 'iconico', 'imperial'],
    practical: {
      access: 'Metro Marunouchi o Chiyoda — Estación Otemachi o Nijubashimae',
      hours: 'Jardín Este: 9:00–18:00 del 15 de abril al 31 de agosto (última entrada 17:30). Cierra lunes y viernes',
      logistics: [
        'Jardín Este: gratuito y sin reserva; entrada por la puerta Ōtemon',
        'Si el lunes es festivo, abre ese día y cierra el martes',
        'Interior del palacio no accesible sin reserva especial',
        'Marunouchi y Ginza a pie (~15 min)',
      ],
    },
  },

  // ── Día 9 — Ginza ──────────────────────────────────────────────────────
  {
    id: 'ginza',
    name: 'Ginza',
    citySlug: 'tokio',
    coordinates: [139.7647, 35.6717],
    tags: ['lujo', 'compras', 'arte', 'gastronomia'],
    practical: {
      access: 'Metro Ginza (líneas Ginza, Marunouchi, Hibiya) — Estación Ginza. JR Yamanote — Estación Yurakucho (5 min a pie)',
      hours: 'Chūō-dōri peatonal: sábados, domingos y festivos 12:00–18:00 (abril–septiembre). Tiendas: 10:00–20:00',
      logistics: [
        'El paso peatonal depende de la policía y del tiempo',
        'Kabuki-za (makumi-seki): comprobar antes del viaje cómo se venden',
        'Itoya (papelería) y Uniqlo Ginza: tax-free con pasaporte',
      ],
    },
  },

  // ── Día 10 — Harajuku / Meiji Jingū ────────────────────────────────────
  {
    id: 'harajuku-meiji',
    name: 'Harajuku / Meiji Jingū',
    citySlug: 'tokio',
    coordinates: [139.6993, 35.6762],
    tags: ['santuario', 'moda-alternativa', 'parque', 'cultura-pop'],
    practical: {
      access: 'JR Yamanote — Estación Harajuku (salida Takeshita u Omotesandō)',
      hours: 'Meiji Jingū: del amanecer al anochecer. Takeshita-dōri: peatonal de 11:00 a 18:00',
      logistics: [
        'Meiji Jingū: recinto gratuito; jardín interior (Gyoen) 500 ¥',
        'En fin de semana se satura',
        'Ropa vintage en Cat Street / Ura-Harajuku',
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
      access: 'JR Yamanote o Metro Ginza — Estación Shibuya, salida Hachikō',
      hours: 'Shibuya Parco: ~10:00–21:00',
      logistics: ['SHIBUYA SKY está en la torre este de Shibuya Scramble Square'],
    },
  },

  // ── Día 10 — Shinjuku de noche ─────────────────────────────────────────
  {
    id: 'shinjuku',
    name: 'Shinjuku',
    citySlug: 'tokio',
    coordinates: [139.6993, 35.6896],
    tags: ['ocio-nocturno', 'gastronomia', 'iconico', 'entretenimiento'],
    practical: {
      access: 'JR Yamanote — Estación Shinjuku: salida oeste para Omoide Yokochō; salida este para Kabukichō y Golden Gai',
      hours: 'Omoide Yokochō: mejor de 18:00 a 21:00. Golden Gai: bares por la noche',
      logistics: [
        'De Omoide Yokochō (oeste) a Kabukichō y Golden Gai (este): ~10 min a pie',
        'Bares diminutos: muchos cobran entrada (cover charge)',
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
      access: 'JR Yamanote o Keihin-Tōhoku — Estación Ueno (salida Park para el parque)',
      hours: 'Museo Nacional de Tokio: 9:30–17:00 (vie/sáb hasta 20:00), cerrado lunes',
      logistics: ['Ameyoko Market: efectivo en los puestos'],
    },
  },

  // ── Día 11 — Tsukiji ───────────────────────────────────────────────────
  {
    id: 'tsukiji',
    name: 'Tsukiji (Mercado Exterior)',
    citySlug: 'tokio',
    coordinates: [139.7706, 35.6654],
    tags: ['gastronomia', 'mercado', 'historico', 'marisco'],
    practical: {
      access: 'Metro Hibiya — Estación Tsukiji (salida 1) o Metro Ōedo — Tsukijishijo',
      hours: 'La asociación del mercado pide a los turistas ir de 9:00 a 14:00 (antes compran los profesionales). Cierra domingos, festivos y algunos miércoles',
      logistics: [
        'No se regatea: precios de criterio profesional',
        'Efectivo en la mayoría de puestos',
        'Tsukiji Hongwanji a 2 min a pie',
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
      hours: 'Yanaka Ginza: tiendas desde 10:00; muchas cierran a las 17:00–18:00 y bastantes los lunes',
      logistics: [
        'Efectivo en la mayoría de tiendas de Yanaka Ginza',
        'Bajar por las escaleras Yūyake Dandan desde Nippori',
        'Nezu Jinja: recinto gratuito; el jardín de 3.000 azaleas solo abre en abril; el túnel de torii hasta el Otome Inari, todo el año',
        'Combinación natural con Ueno (20 min a pie hacia el sur)',
      ],
    },
  },

  // ── Tokio · bloque 2 (días 25–27) ────────────────────────────────────────

  // ── Días 8 y 26 — Asakusa ─────────────────────────────────────────────
  {
    id: 'asakusa',
    name: 'Asakusa',
    citySlug: 'tokio',
    coordinates: [139.7966, 35.7148],
    tags: ['tradicional', 'templos', 'historico', 'shitamachi'],
    practical: {
      access: 'Metro Ginza (G19) o Toei Asakusa (A18) — Estación Asakusa',
      hours: 'Sensō-ji: recinto 24 h (iluminado hasta las 23:00); sala principal 6:00–17:00. Nakamise: desde ~9:00',
      logistics: [
        'Efectivo en muchos puestos de Nakamise',
        'Sanja Matsuri: 14–16 de mayo de 2027; no coincide con ninguna visita',
      ],
    },
  },

  // ── Día 26 — Tokyo Skytree ─────────────────────────────────────────────
  {
    id: 'tokyo-skytree',
    name: 'Tokyo Skytree',
    citySlug: 'tokio',
    coordinates: [139.8107, 35.7101],
    tags: ['mirador', 'iconico', 'moderno', 'shitamachi'],
    practical: {
      access:
        'Tobu Skytree Line / Metro Hanzōmon — Estación Oshiage o Tokyo Skytree. A 20 min a pie o 3 min en metro desde Asakusa',
      hours: 'Tembo Deck y Tembo Galleria: ~9:00–22:00 (última entrada 21:00)',
      logistics: [
        'Entre semana, la entrada es más barata',
        'A los pies está Tokyo Solamachi (centro comercial)',
      ],
    },
  },

  // ── Día 25 — Akihabara ─────────────────────────────────────────────────
  {
    id: 'akihabara',
    name: 'Akihabara',
    citySlug: 'tokio',
    coordinates: [139.7732, 35.7022],
    tags: ['electronica', 'cultura-pop', 'otaku', 'compras'],
    practical: {
      access: 'JR Yamanote / Keihin-Tōhoku — Estación Akihabara (salida Electric Town). Metro Hibiya — Akihabara',
      hours: 'Tiendas: 10:00–20:00 en general (orientativo)',
      logistics: [
        'Tiendas retro: comprobar en 2027 que siguen abiertas',
        'Tax-free con pasaporte en muchas tiendas',
      ],
    },
  },

  // ── Día 27 — Kiyosumi-Shirakawa / Fukagawa ─────────────────────────────
  {
    id: 'kiyosumi-fukagawa',
    name: 'Kiyosumi-Shirakawa y Fukagawa',
    citySlug: 'tokio',
    coordinates: [139.798, 35.6818],
    tags: ['jardin', 'museo', 'historico', 'shitamachi', 'gastronomia'],
    practical: {
      access:
        'Metro Tōzai u Ōedo — Monzen-Nakachō; Ōedo o Hanzōmon — Kiyosumi-Shirakawa (1 parada entre sí, ~15 min a pie)',
      hours:
        'Jardín Kiyosumi: 9:00–17:00 (última entrada 16:30), 150 ¥. Fukagawa Edo Museum: ~9:30–17:00 (verificar 2027). Fudō-dō: goma (ritual del fuego) a las 9, 11, 13, 15 y 17 h. Tonkatsu Marushichi: 11:30–17:00',
      logistics: ['Tonkatsu Marushichi (yaki-katsudon; sin reservas): confirmar días de cierre en sus redes'],
    },
  },

  // ── Día 27 — Nakano Broadway ───────────────────────────────────────────
  {
    id: 'nakano',
    name: 'Nakano Broadway',
    citySlug: 'tokio',
    coordinates: [139.6656, 35.7087],
    tags: ['otaku', 'cultura-pop', 'segunda-mano', 'compras'],
    practical: {
      access: 'JR Chūō/Sōbu o Metro Tōzai — Estación Nakano (salida norte), ~5 min a pie por la galería Sun Mall',
      hours: 'Tiendas: sobre todo 12:00–20:00; algunas cierran los miércoles',
      logistics: ['Mandarake: unos 35 locales repartidos por las plantas 1–4'],
    },
  },

  // ── Takaragawa (día 12) ──────────────────────────────────────────────────

  {
    id: 'takaragawa-onsen',
    name: 'Takaragawa Onsen (Ōsenkaku)',
    citySlug: 'takaragawa',
    coordinates: [138.9206, 36.8367],
    tags: ['onsen', 'ryokan', 'naturaleza', 'rural'],
    practical: {
      hours: 'Baños para visitantes de día: 10:00–16:30. Huéspedes: horario ampliado',
      logistics: [
        'Entre semana hay menos bañistas de día y la noche es más barata que en sábado',
        'Baño mixto con prenda de baño (yuami-gi) del propio ryokan; no se admiten las traídas de fuera',
        'Preguntar directamente por la política de tatuajes',
        'Efectivo recomendado (zona rural)',
        'Cena incluida normalmente',
      ],
    },
  },

  // ── Kanazawa (días 13–14) ────────────────────────────────────────────────

  {
    id: 'higashi-chaya',
    name: 'Higashi Chaya',
    citySlug: 'kanazawa',
    coordinates: [136.6612, 36.572],
    tags: ['historico', 'tradicional', 'artesania', 'chaya'],
    practical: {
      access: 'Autobús urbano Loop Bus (parada Hashiba-chō) desde la estación de Kanazawa (~15 min)',
      hours: 'Calles: acceso libre. Casas de té visitables: 9:00–18:00 aprox.',
      logistics: [
        'Al atardecer: menos gente que a mediodía',
        'Efectivo en la mayoría de tiendas de artesanía y dulces',
        'Calle principal: a pie en 30–40 min',
      ],
    },
  },

  {
    id: 'kenrokuen',
    name: 'Kenroku-en',
    citySlug: 'kanazawa',
    coordinates: [136.662, 36.5618],
    tags: ['jardin', 'historico', 'patrimonio', 'naturaleza'],
    practical: {
      access: 'Loop Bus — parada Kenrokuen-shita. O 15 min a pie desde la estación de Kanazawa',
      hours: 'Mar–oct: 7:00–18:00, 320 ¥. Gratis de 4:00 a 6:45 por las puertas Hasuike y Zuijinzaka',
      logistics: ['El Museo del Siglo XXI, al lado, está cerrado de mayo de 2027 a marzo de 2028'],
    },
  },

  {
    id: 'kanazawa-castillo',
    name: 'Castillo de Kanazawa',
    citySlug: 'kanazawa',
    coordinates: [136.6577, 36.5627],
    tags: ['castillo', 'historico', 'parque', 'patrimonio'],
    practical: {
      access: 'Adyacente a Kenroku-en (puerta Ishikawa-mon). Loop Bus — parada Kenrokuen-shita',
      hours: 'Parque: 7:00–18:00 (entrada gratuita). Pabellones interiores: 9:00–16:30, 320 ¥',
      logistics: ['Terreno llano: accesible para todo el grupo'],
    },
  },

  {
    id: 'nagamachi',
    name: 'Nagamachi (barrio samurái)',
    citySlug: 'kanazawa',
    coordinates: [136.6515, 36.5598],
    tags: ['historico', 'samurai', 'tradicional', 'museo'],
    practical: {
      access: 'Loop Bus — parada Kōrinbō. O 20 min a pie desde la estación de Kanazawa',
      hours: 'Calles: acceso libre. Casa Nomura (Nomura-ke): 8:30–17:30, ~550 ¥',
      logistics: [
        'Paseo de 30–45 min',
        'Ōmichō a ~10 min a pie, camino de la estación',
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
      access: 'Loop Bus — parada Musashigatsuji/Ōmichō Ichiba. 10 min a pie desde la estación',
      hours: '9:00–17:00 aprox. Algunos puestos desde 7:00. Cierran algunos domingos y festivos',
      logistics: [
        'Efectivo en la mayoría de puestos',
        'Restaurantes de sushi y kaisen-don dentro del mercado',
      ],
    },
  },

  // ── Día 14 — Nishi Chaya y Teramachi (paseo opcional) ──────────────────
  {
    id: 'nishi-chaya',
    name: 'Nishi Chaya y Teramachi',
    citySlug: 'kanazawa',
    coordinates: [136.6488, 36.5552],
    tags: ['chaya', 'templos', 'historico', 'tranquilo'],
    practical: {
      access: 'Orilla oeste del río Sai: autobús desde la estación hasta Hirokōji (~15 min) o ~10 min a pie desde Nagamachi',
      hours: 'Calles y recintos de templos: acceso libre. Nishi Chaya Shiryōkan: gratuito',
      logistics: ['Myōryū-ji («templo ninja»): solo con reserva previa y visita guiada; descartado en el plan'],
    },
  },

  // ── Takayama (días 15–16) ────────────────────────────────────────────────

  // ── Día 15 — Yatai Kaikan + Sakurayama Hachimangū ──────────────────────
  {
    id: 'takayama-yatai',
    name: 'Yatai Kaikan y Sakurayama Hachimangū',
    citySlug: 'takayama',
    coordinates: [137.258, 36.1515],
    tags: ['santuario', 'museo', 'historico', 'tradicional'],
    practical: {
      access: '~20 min a pie desde la estación de Takayama, al norte de Sanmachi',
      hours: 'Horario y precio por confirmar: ~8:30/9:00–17:00, ~840 ¥',
      logistics: ['Visita libre de 30–45 min'],
    },
  },

  {
    id: 'sanmachi-suji',
    name: 'Sanmachi Suji',
    citySlug: 'takayama',
    coordinates: [137.2529, 36.1462],
    tags: ['historico', 'tradicional', 'sake', 'casco-antiguo'],
    practical: {
      access: '10 min a pie desde la estación de Takayama hacia el este, cruzando el río Miyagawa',
      hours: 'Calles: acceso libre. Bodegas de sake y tiendas: ~9:00–17:00 (muchas cierran hacia las 17:00)',
      logistics: [
        'Antes de las 10:00 o desde las 16:00: menos excursionistas de día',
        'Bodegas de sake con degustación gratuita o de pago',
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
      access: 'Autobús desde la estación de Takayama (~10 min, línea Sarubobo). O 30 min a pie',
      hours: '8:30–17:00 (última entrada 16:30). Abierto todos los días. ~700 ¥',
      logistics: [
        'Calcular 1,5–2 h para recorrerlo con calma',
        'Llevar calzado cómodo',
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
      hours: '8:45–17:00 (agosto: hasta 18:00). ~450 ¥',
      logistics: [
        'Visita de 45–60 min',
        'Justo al lado del mercado matinal Jinya-mae',
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
      access: 'Orilla del río Miyagawa, frente a Sanmachi Suji. 10 min a pie desde la estación',
      hours: '7:00–12:00',
      logistics: [
        'Efectivo en todos los puestos',
        'Recorrido corto: 30–45 min',
      ],
    },
  },

  // ── Shirakawa-go (día 17) ────────────────────────────────────────────────

  {
    id: 'shirakawago-ogimachi',
    name: 'Shirakawa-go (Ogimachi)',
    citySlug: 'shirakawago',
    coordinates: [136.9052, 36.257],
    tags: ['patrimonio-unesco', 'arquitectura', 'rural', 'aldea'],
    practical: {
      hours: 'Aldea: acceso libre. Casa Wada: 9:00–17:00. Mirador Shiroyama: acceso libre',
      logistics: ['Efectivo para entradas de casas visitables y restaurantes'],
    },
  },

  // ── Kioto (días 17–21) ───────────────────────────────────────────────────

  {
    id: 'kiyomizu-dera',
    name: 'Kiyomizu-dera',
    citySlug: 'kioto',
    coordinates: [135.785, 34.9948],
    tags: ['templo', 'historico', 'patrimonio-unesco', 'montaña'],
    practical: {
      access: 'A pie desde Shichijō (~20 min). Bus urbano 100 o 206 — parada Gojō-zaka o Kiyomizu-michi',
      hours: '6:00–18:00. ~500 ¥',
      logistics: ['Cuesta empinada desde la parada de bus: 15 min subiendo'],
    },
  },

  {
    id: 'higashiyama-sannenzaka',
    name: 'Higashiyama (Sannenzaka / Ninenzaka / Kōdai-ji)',
    citySlug: 'kioto',
    coordinates: [135.7806, 34.999],
    tags: ['historico', 'tradicional', 'paseo', 'artesania'],
    practical: {
      access: 'Desde Kiyomizu-dera bajando a pie (~5 min). Bus urbano 100/206 — parada Kiyomizu-michi',
      hours: 'Calles: acceso libre. Tiendas: ~9:00–17:00/18:00. Kōdai-ji: ~9:00–17:30 (de pago)',
      logistics: ['Calles empedradas en pendiente: calzado cómodo'],
    },
  },

  {
    id: 'gion',
    name: 'Gion',
    citySlug: 'kioto',
    coordinates: [135.7751, 35.0038],
    tags: ['historico', 'geishas', 'tradicional', 'nocturno'],
    practical: {
      access: 'Keihan — Gion-Shijō. Bus urbano 100/206 — parada Gion',
      hours: 'Calles: acceso libre. Yasaka Jinja y parque Maruyama: 24 h. Hanami-kōji: mejor de 17:30 a 19:00',
      logistics: [
        'No detener, tocar, seguir ni fotografiar sin permiso a geiko y maiko',
        'Prohibido entrar en los callejones privados (puede haber multa)',
      ],
    },
  },

  // ── Día 18 — Norte de Higashiyama ──────────────────────────────────────
  {
    id: 'higashiyama-norte',
    name: 'Nanzen-ji, Camino del Filósofo y Ginkaku-ji',
    citySlug: 'kioto',
    coordinates: [135.795, 35.019],
    tags: ['templo', 'paseo', 'jardines', 'historico'],
    practical: {
      access: 'Metro Tōzai — Keage (~10 min a pie a Nanzen-ji). A pie desde Yasaka Jinja (~30 min). Vuelta desde Ginkaku-ji en bus o taxi',
      hours: 'Nanzen-ji: recinto y acueducto libres; Sanmon y Hōjō de pago (~8:40–17:00). Camino del Filósofo: libre. Ginkaku-ji: hasta ~17:00 (por confirmar); la sala Tōgu-dō solo abre en visitas especiales de primavera y otoño',
      logistics: [
        'Camino del Filósofo: ~1,5–2 km a pie de Nanzen-ji a Ginkaku-ji',
        'Ginkaku-ji: llegar antes de las 16:30',
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
      access: 'JR San-in — Saga-Arashiyama. O Randen (Keifuku) — Arashiyama. O Hankyū — Arashiyama',
      hours: 'Bosque de bambú: acceso libre 24 h. Tenryū-ji: 8:30–17:00 (de pago); el Hattō abre fines de semana y festivos, y a diario en temporadas especiales. Togetsukyō: libre',
    },
  },

  // ── Día 19 — Sanjūsangen-dō ────────────────────────────────────────────
  {
    id: 'sanjusangendo',
    name: 'Sanjūsangen-dō',
    citySlug: 'kioto',
    coordinates: [135.7718, 34.9879],
    tags: ['templo', 'historico', 'patrimonio'],
    practical: {
      access: 'Keihan — Shichijō (~5 min a pie). Bus urbano 100/206 — parada Hakubutsukan Sanjūsangendō-mae',
      hours: '8:30–17:00 (abril–mediados de noviembre). 600 ¥',
      logistics: [
        'Visita de 45–60 min',
        'Hay que descalzarse; no se permiten fotos en el interior',
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
      access: 'Metro Tōzai — Nijōjō-mae. O bus urbano 9/50 — parada Nijōjō-mae',
      hours: '8:45–17:00 (última entrada 16:00). De pago (comprobar precio de 2027)',
      logistics: [
        'El palacio Honmaru cierra el 17 y el 18 de mayo; el 19 abre',
        'Calcular 1,5–2 h para palacio y jardines',
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
      access: 'Keihan — Fushimi-Inari (3 paradas desde Shichijō). O JR Nara — Inari (2 min a pie)',
      hours: 'Recinto exterior: 24 h. Entrada gratuita',
      logistics: [
        'Subida hasta el mirador de Yotsutsuji: ~1h30 ida y vuelta',
        'Calzado deportivo para el ascenso',
      ],
    },
  },

  {
    id: 'kinkakuji',
    name: 'Kinkaku-ji y Ryōan-ji',
    citySlug: 'kioto',
    coordinates: [135.7292, 35.0394],
    tags: ['templo', 'jardines', 'patrimonio-unesco', 'iconico'],
    practical: {
      access: 'Bus urbano 101 o 205 — parada Kinkakuji-michi',
      hours: 'Kinkaku-ji: 9:00–17:00, ~500 ¥, abierto todos los días. Ryōan-ji: de pago',
      logistics: [
        'Visita de 45–60 min (circuito exterior único)',
        'Ryōan-ji a ~20 min a pie',
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
      access: 'Metro Karasuma — Shijō. Hankyū — Karasuma o Kawaramachi. A pie desde Gion (10 min)',
      hours: '~10:00–18:00. Algunos puestos desde 9:00. Parte de los puestos cierra los miércoles',
      logistics: [
        'Efectivo en la mayoría de puestos',
        'No comer caminando: se come junto al puesto',
      ],
    },
  },

  // ── Día 21 — Tō-ji (mercadillo Kōbō-ichi) ──────────────────────────────
  {
    id: 'toji',
    name: 'Tō-ji',
    citySlug: 'kioto',
    coordinates: [135.7475, 34.9804],
    tags: ['templo', 'historico', 'mercadillo', 'pagoda'],
    practical: {
      access: 'Kintetsu — Tōji (5 min a pie). O 15 min a pie desde la estación de Kioto',
      hours: 'Recinto: 5:00–17:00 (gratuito). Kondō/Kōdō: 8:00–17:00, de pago. Subtemplo Kanchi-in: solo en temporadas especiales. Mercadillo Kōbō-ichi: el día 21 de cada mes, todo el día',
      logistics: ['Efectivo en el mercadillo'],
    },
  },

  // ── Nara (día 21, por la tarde) ──────────────────────────────────────────

  {
    id: 'nara-todaiji',
    name: 'Tōdai-ji, Kōfuku-ji y parque de Nara',
    citySlug: 'nara',
    coordinates: [135.8399, 34.6895],
    tags: ['templo', 'patrimonio-unesco', 'parque', 'historico'],
    practical: {
      access: 'Estación Kintetsu-Nara: Kōfuku-ji a ~5 min a pie; Tōdai-ji a ~20 min, pasando por Kōfuku-ji',
      hours: 'Gran Buda (Daibutsuden): 7:30–17:30 (abr–oct). 800 ¥, solo efectivo. Parque: libre 24 h',
      logistics: [
        'Kōfuku-ji: la pagoda de cinco pisos está cubierta por la obra hasta ~2034',
        'Ciervos sueltos: galletas shika senbei en los puestos; cuidado con bolsos y mapas',
      ],
    },
  },

  // ── Osaka (días 21–24) ───────────────────────────────────────────────────

  // ── Día 22 — Katsuo-ji (excursión de media jornada) ────────────────────
  {
    id: 'katsuo-ji',
    name: 'Katsuo-ji',
    citySlug: 'katsuoji',
    coordinates: [135.4889, 34.8569],
    tags: ['templo', 'daruma', 'montana', 'historico'],
    practical: {
      hours: '8:00–17:00 (sáb hasta 18:00); último acceso 30 min antes. Entrada de pago (confirmar precio)',
    },
  },

  {
    id: 'dotonbori',
    name: 'Dōtonbori y Minami',
    citySlug: 'osaka',
    coordinates: [135.5021, 34.6687],
    tags: ['gastronomia', 'ocio-nocturno', 'iconico', 'entretenimiento'],
    practical: {
      access: 'Metro Midōsuji o Sennichimae — Estación Namba (salida 14). Kintetsu — Osaka-Namba',
      hours: 'Canal y zona: libre 24 h. Tiendas y restaurantes: ~11:00–23:00',
      logistics: [
        'Cartel de Glico: en sustitución; el nuevo está previsto para la primavera de 2027 (puede haber andamios)',
        'Hōzen-ji y su callejón a 2 min a pie',
        'Shinsaibashi (galería cubierta) a continuación hacia el norte',
        'Efectivo en muchos puestos de comida callejera',
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
      access: 'Metro Tanimachi 4-chōme u Osaka Business Park. JR Ōsakajō-Kōen',
      hours: 'Parque, fosos y murallas: libre. Torre (museo): 9:00–17:00 (última entrada 16:30), 1.200 ¥',
      logistics: [
        'Recinto amplio: calcular ~1,5 h de paseo',
        'Kuromon a ~20 min en metro',
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
      access: 'Metro Sakaisuji o Sennichimae — Nipponbashi (salida 10)',
      hours: '~8:00–18:00. Algunos puestos desde 7:00. Cierran algunos domingos y festivos',
      logistics: [
        'Efectivo en la mayoría de puestos; algunos aceptan tarjeta',
        'Dōtonbori a 10 min a pie',
      ],
    },
  },

  // ── Día 24 — Den Den Town (opcional) ───────────────────────────────────
  {
    id: 'den-den-town',
    name: 'Den Den Town (Nipponbashi)',
    citySlug: 'osaka',
    coordinates: [135.5059, 34.661],
    tags: ['otaku', 'electronica', 'cultura-pop', 'compras'],
    practical: {
      access: 'Metro Sakaisuji — Ebisuchō o Nipponbashi. A pie desde Kuromon y Namba (~10 min)',
      hours: 'Tiendas: ~10:00/11:00–20:00 (orientativo)',
    },
  },

  {
    id: 'shinsekai',
    name: 'Shinsekai / Tsūtenkaku',
    citySlug: 'osaka',
    coordinates: [135.5063, 34.652],
    tags: ['retro', 'gastronomia', 'iconico', 'barrio'],
    practical: {
      access: 'Metro Sakaisuji — Ebisuchō. O Metro Midōsuji — Dōbutsuen-mae',
      hours: 'Calles: libre. Torre Tsūtenkaku: ~10:00–20:00 (de pago). Restaurantes: ~11:00–22:00',
      logistics: [
        'Kushikatsu: no se moja dos veces en la salsa común',
        'Efectivo recomendado en los restaurantes tradicionales',
      ],
    },
  },

  // ── Día 24 — Umeda Sky Building ────────────────────────────────────────
  {
    id: 'umeda',
    name: 'Umeda Sky Building',
    citySlug: 'osaka',
    coordinates: [135.4906, 34.7053],
    tags: ['mirador', 'moderno', 'iconico'],
    practical: {
      access: 'JR — Osaka o Metro Midōsuji — Umeda (~10 min a pie hacia el noroeste). Desde Namba, Midōsuji directa',
      hours: 'Mirador Kūchū Teien: 9:30–22:30. 2.000 ¥',
    },
  },

  // ── Hiroshima (día 23) ───────────────────────────────────────────────────

  {
    id: 'hiroshima-paz',
    name: 'Parque Memorial de la Paz',
    citySlug: 'hiroshima',
    coordinates: [132.4533, 34.3955],
    tags: ['memorial', 'historico', 'museo', 'patrimonio'],
    practical: {
      access: 'Tranvía línea 2 o 6 desde la estación de Hiroshima — parada Genbaku-Dome-Mae (~15 min)',
      hours: 'Parque: libre 24 h. Museo: 7:30–19:00 de marzo a julio (reserva online obligatoria para 7:30–8:30 y 17:30–18:30). ~200 ¥',
      logistics: ['Museo: 2–3 h; Cúpula de la Bomba Atómica por fuera, desde el parque'],
    },
  },
] as const
