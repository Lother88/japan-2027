/**
 * Datos compartidos por las propuestas de diseño (prototipos). Itinerario vigente
 * a 12 nov 2026 — fuente: docs/revision-itinerario-fechas-2027.md.
 * Horas orientativas. `maps` = texto para buscar en Google Maps.
 * type: visita | comida | traslado | compras | descanso | noche
 */
window.TRIP = {
  title: 'Japón 2027',
  start: '2027-05-08',
  end: '2027-05-28',
  flights: {
    out: { label: 'Ida', from: 'BCN', to: 'NRT', dep: 'vie 7 · 10:15', arr: 'sáb 8 · 09:30', code: 'LH1125 + LH710', via: 'FRA' },
    back: { label: 'Vuelta', from: 'NRT', to: 'BCN', dep: 'vie 28 · 11:20', arr: 'vie 28 · 23:05', code: 'LH711 + LH1138', via: 'FRA' },
  },
  cities: {
    tokio: { name: 'Tokio', kanji: '東京', color: '#c8403a', night: '#e8665f' },
    takaragawa: { name: 'Takaragawa', kanji: '宝川', color: '#2a8c82', night: '#4fbfb3' },
    kanazawa: { name: 'Kanazawa', kanji: '金沢', color: '#b8860b', night: '#d9a93a' },
    takayama: { name: 'Takayama', kanji: '高山', color: '#8a5a2b', night: '#c08850' },
    kioto: { name: 'Kioto', kanji: '京都', color: '#7b4fa3', night: '#a77fd0' },
    osaka: { name: 'Osaka', kanji: '大阪', color: '#2f6db3', night: '#5b9be0' },
  },
  hotels: {
    tokio1: { city: 'tokio', zone: 'Ueno', nights: '8 → 12', maps: 'Ueno Station Tokyo' },
    takaragawa: { city: 'takaragawa', zone: 'Ryokan Ōsenkaku', nights: '12 → 13', maps: 'Takaragawa Onsen Osenkaku' },
    kanazawa: { city: 'kanazawa', zone: 'Estación (salida este) / Ōmichō', nights: '13 → 15', maps: 'Kanazawa Station', laundry: true },
    takayama: { city: 'takayama', zone: 'Junto a la estación JR', nights: '15 → 17', maps: 'Takayama Station' },
    kioto: { city: 'kioto', zone: 'Shichijō (línea Keihan)', nights: '17 → 21', maps: 'Shichijo Station Keihan Kyoto', laundry: true },
    osaka: { city: 'osaka', zone: 'Namba / Shinsaibashi', nights: '21 → 25', maps: 'Namba Station Osaka', laundry: true },
    tokio2: { city: 'tokio', zone: 'Asakusa', nights: '25 → 28', maps: 'Asakusa Station Tokyo' },
  },
  rules: {
    cierre: { label: 'Cierre / fecha fija', short: 'Fecha fija' },
    laborable: { label: 'Laborable: menos turismo local', short: 'Laborable' },
    oleada: { label: 'Primera oleada: llegar antes que las masas', short: 'Primera oleada' },
    finde: { label: 'Fin de semana: se gana algo', short: 'Finde' },
  },
  reservations: [
    { what: 'Ryokan Ōsenkaku + lanzadera (13:00 o 15:00 ida · 9:30 vuelta)', when: 'Reservar por Booking + teléfono', day: '2027-05-12' },
    { what: 'Bus Nōhi Kanazawa → Takayama', when: 'Reserva online', day: '2027-05-15' },
    { what: 'Shibuya Sky (franja del atardecer)', when: 'Online, ~2 semanas antes', day: '2027-05-10' },
    { what: 'Museo de la Paz de Hiroshima (franja 7:30–8:30, opcional)', when: 'Online', day: '2027-05-23' },
    { what: 'Tokyo Skytree (franja del atardecer)', when: 'Online', day: '2027-05-26' },
  ],
  days: [
    {
      date: '2027-05-07', city: null, title: 'Salida desde Barcelona', kind: 'viaje',
      steps: [
        { time: '10:15', label: 'Vuelo BCN → Fráncfort', type: 'traslado' },
        { time: 'tarde', label: 'Vuelo nocturno Fráncfort → Narita', type: 'traslado' },
      ],
    },
    {
      date: '2027-05-08', city: 'tokio', hotel: 'tokio1', title: 'Llegada a Tokio', kind: 'traslado', rules: [],
      transfer: { from: 'Narita T1', to: 'Ueno', how: 'Skyliner (~41 min) + taxi', arrive: '~11:30' },
      steps: [
        { time: '09:30', label: 'Aterrizaje en Narita T1', type: 'traslado', maps: 'Narita Airport Terminal 1' },
        { time: '10:15', label: 'Skyliner a Ueno', type: 'traslado', maps: 'Keisei Ueno Station' },
        { time: '11:30', label: 'Hotel en Ueno · dejar maletas', type: 'descanso', maps: 'Ueno Station Tokyo' },
        { time: '16:00', label: 'Kanda Matsuri: el desfile al paso (si se confirma)', type: 'visita', maps: 'Kanda Myojin', place: 'kanda', optional: true },
        { time: '19:00', label: 'Si no hay festival: Asakusa de noche, Sensō-ji iluminado', type: 'noche', maps: 'Senso-ji', place: 'senso-ji', optional: true },
      ],
      notes: ['Tarde suave: jet lag.'],
    },
    {
      date: '2027-05-09', city: 'tokio', hotel: 'tokio1', title: 'Palacio Imperial y Ginza', kind: 'visita', rules: ['cierre', 'finde'],
      steps: [
        { time: '09:00', label: 'Kanda Myōjin: entrada de los mikoshi (un rato)', type: 'visita', maps: 'Kanda Myojin', place: 'kanda', optional: true },
        { time: '10:30', label: 'Jardines del Este del Palacio Imperial', type: 'visita', maps: 'East Gardens of the Imperial Palace', place: 'palacio' },
        { time: '12:30', label: 'Comida en Marunouchi', type: 'comida', maps: 'Marunouchi Tokyo' },
        { time: '13:30', label: 'Ginza peatonal (12:00–18:00)', type: 'compras', maps: 'Ginza Chuo-dori' },
        { time: '16:00', label: 'Kabuki-za: un acto (hitomakumi, efectivo)', type: 'visita', maps: 'Kabukiza Theatre', place: 'kabukiza', optional: true },
      ],
      notes: ['Jardines del Este: cierran lunes y viernes.', 'Ginza solo es peatonal en fin de semana.'],
    },
    {
      date: '2027-05-10', city: 'tokio', hotel: 'tokio1', title: 'Meiji, Harajuku, Shibuya y Shinjuku', kind: 'visita', rules: ['laborable'],
      steps: [
        { time: '08:00', label: 'Meiji Jingū', type: 'visita', maps: 'Meiji Jingu', place: 'meiji' },
        { time: '10:00', label: 'Takeshita-dōri (Harajuku)', type: 'compras', maps: 'Takeshita Street' },
        { time: '11:30', label: 'Omotesandō', type: 'compras', maps: 'Omotesando' },
        { time: '13:00', label: 'Comida', type: 'comida' },
        { time: '14:30', label: 'Cruce de Shibuya y Hachikō', type: 'visita', maps: 'Shibuya Scramble Crossing', place: 'shibuya' },
        { time: '15:30', label: 'Shibuya Parco 6F: Nintendo · Pokémon · Capcom · Jump', type: 'compras', maps: 'Shibuya PARCO' },
        { time: '18:00', label: 'Shibuya Sky al atardecer (~18:40)', type: 'visita', maps: 'Shibuya Sky', reserve: true },
        { time: '20:00', label: 'Shinjuku de noche: Omoide Yokocho · Golden Gai · Kabukichō', type: 'noche', maps: 'Omoide Yokocho', place: 'shinjuku' },
      ],
      notes: ['Harajuku es intransitable en fin de semana: por eso lunes.'],
    },
    {
      date: '2027-05-11', city: 'tokio', hotel: 'tokio1', title: 'Ueno, Tsukiji y Yanaka', kind: 'visita', rules: ['cierre'],
      steps: [
        { time: '09:30', label: 'Museo Nacional de Tokio (apertura)', type: 'visita', maps: 'Tokyo National Museum', place: 'tnm' },
        { time: '11:30', label: 'Línea Hibiya directa de Ueno a Tsukiji', type: 'traslado' },
        { time: '12:00', label: 'Comida en el mercado exterior de Tsukiji', type: 'comida', maps: 'Tsukiji Outer Market', place: 'tsukiji' },
        { time: '13:30', label: 'Tsukiji Hongwanji', type: 'visita', maps: 'Tsukiji Hongwanji' },
        { time: '14:30', label: 'Línea Hibiya de vuelta hacia Ueno', type: 'traslado' },
        { time: '15:00', label: 'Yanaka: Yanaka Ginza, cementerio, Tennō-ji', type: 'visita', maps: 'Yanaka Ginza', place: 'yanaka' },
        { time: '17:00', label: 'Nezu Jinja', type: 'visita', maps: 'Nezu Shrine' },
      ],
      notes: ['El museo cierra los lunes y Tsukiji los domingos.', 'Tsukiji: la asociación del mercado pide a los turistas ir de 9:00 a 14:00.', 'Nezu Jinja: el jardín de azaleas solo abre en abril.'],
    },
    {
      date: '2027-05-12', city: 'takaragawa', hotel: 'takaragawa', title: 'Onsen en Takaragawa', kind: 'traslado', rules: ['laborable'],
      transfer: { from: 'Ueno', to: 'Takaragawa', how: 'Jōetsu Shinkansen (~1h15) + lanzadera del ryokan', arrive: '13:45 o 15:45' },
      steps: [
        { time: 'mañana', label: 'Mañana tranquila y check-out', type: 'descanso' },
        { time: '11:00', label: 'Jōetsu Shinkansen desde Ueno a Jōmō-Kōgen', type: 'traslado', maps: 'Jomo-Kogen Station' },
        { time: '13:00', label: 'Lanzadera del ryokan (o la de las 15:00)', type: 'traslado', reserve: true },
        { time: 'tarde', label: 'Baños al aire libre junto al río', type: 'visita', maps: 'Takaragawa Onsen Osenkaku', place: 'takaragawa' },
        { time: 'noche', label: 'Cena en el ryokan', type: 'comida' },
      ],
      notes: ['Lanzadera: reserva por teléfono. Solo hay una de vuelta, a las 9:30.'],
    },
    {
      date: '2027-05-13', city: 'kanazawa', hotel: 'kanazawa', title: 'Llegada a Kanazawa', kind: 'traslado', rules: [],
      transfer: { from: 'Takaragawa', to: 'Kanazawa', how: 'Lanzadera 9:30 → Jōmō-Kōgen → Takasaki → Hokuriku Shinkansen', arrive: '~14:00' },
      steps: [
        { time: '09:30', label: 'Lanzadera a Jōmō-Kōgen (la única)', type: 'traslado' },
        { time: '14:00', label: 'Llegada a Kanazawa · hotel', type: 'traslado', maps: 'Kanazawa Station' },
        { time: '15:30', label: 'Mercado Ōmichō (antes de las 17:00)', type: 'comida', maps: 'Omicho Market', place: 'omicho' },
        { time: '17:30', label: 'Higashi Chaya al atardecer', type: 'visita', maps: 'Higashi Chaya District', place: 'higashi-chaya' },
      ],
    },
    {
      date: '2027-05-14', city: 'kanazawa', hotel: 'kanazawa', title: 'Kenroku-en y el castillo', kind: 'visita', rules: ['oleada'], laundry: true,
      steps: [
        { time: '07:00', label: 'Kenroku-en', type: 'visita', maps: 'Kenrokuen', place: 'kenrokuen' },
        { time: '08:30', label: 'Parque del castillo de Kanazawa', type: 'visita', maps: 'Kanazawa Castle Park', place: 'kanazawa-castillo' },
        { time: '10:00', label: 'Nagamachi y casa Nomura', type: 'visita', maps: 'Nomura Samurai House', place: 'nagamachi' },
        { time: '12:00', label: 'Comida en Ōmichō', type: 'comida', maps: 'Omicho Market' },
        { time: 'tarde', label: 'Tarde libre · 🧺 colada 1', type: 'descanso' },
        { time: 'tarde', label: 'Paseo por Nishi Chaya y Teramachi', type: 'visita', maps: 'Nishi Chaya District', optional: true },
      ],
      notes: ['Kenroku-en: gratis de 4:00 a 6:45 por las puertas Hasuike y Zuijinzaka.'],
    },
    {
      date: '2027-05-15', city: 'takayama', hotel: 'takayama', title: 'Llegada a Takayama', kind: 'traslado', rules: ['finde'],
      transfer: { from: 'Kanazawa', to: 'Takayama', how: 'Bus Nōhi con reserva (~2h15)', arrive: 'mediodía' },
      steps: [
        { time: '09:00', label: 'Bus Nōhi a Takayama', type: 'traslado', maps: 'Kanazawa Station East Exit Bus Terminal', reserve: true },
        { time: '11:30', label: 'Hotel · dejar maletas', type: 'descanso', maps: 'Takayama Station' },
        { time: '12:30', label: 'Comida: ternera de Hida', type: 'comida' },
        { time: '14:00', label: 'Yatai Kaikan + santuario Sakurayama Hachimangū', type: 'visita', maps: 'Takayama Festival Floats Exhibition Hall', place: 'yatai' },
        { time: '16:00', label: 'Sanmachi (tiendas y bodegas de sake hasta ~17:00)', type: 'visita', maps: 'Sanmachi Suji', place: 'sanmachi' },
      ],
    },
    {
      date: '2027-05-16', city: 'takayama', hotel: 'takayama', title: 'Takayama a fondo', kind: 'visita', rules: ['finde', 'oleada'],
      steps: [
        { time: '07:00', label: 'Mercado matinal de Miyagawa', type: 'comida', maps: 'Miyagawa Morning Market', place: 'miyagawa' },
        { time: '08:45', label: 'Takayama Jinya', type: 'visita', maps: 'Takayama Jinya', place: 'jinya' },
        { time: '10:00', label: 'Sanmachi tranquilo', type: 'visita', maps: 'Sanmachi Suji' },
        { time: '13:00', label: 'Hida no Sato', type: 'visita', maps: 'Hida Folk Village', place: 'hida-no-sato' },
      ],
    },
    {
      date: '2027-05-17', city: 'kioto', hotel: 'kioto', title: 'Shirakawa-go y tren a Kioto', kind: 'traslado', rules: ['laborable', 'oleada'],
      transfer: { from: 'Takayama', to: 'Kioto', how: 'Tren Hida a Nagoya + Shinkansen', arrive: '~17:00' },
      steps: [
        { time: '07:20', label: 'Bus Nōhi a Shirakawa-go', type: 'traslado', maps: 'Takayama Nohi Bus Center' },
        { time: '08:10', label: 'Aldea de Ogimachi y mirador Shiroyama', type: 'visita', maps: 'Shirakawa-go Ogimachi', place: 'shirakawago' },
        { time: '11:00', label: 'Bus de vuelta a Takayama · recoger maletas', type: 'traslado' },
        { time: '13:00', label: 'Tren Hida a Nagoya + Shinkansen a Kioto', type: 'traslado', maps: 'Kyoto Station' },
        { time: '17:00', label: 'Hotel en Shichijō', type: 'descanso', maps: 'Shichijo Station Keihan Kyoto' },
      ],
    },
    {
      date: '2027-05-18', city: 'kioto', hotel: 'kioto', title: 'Higashiyama de sur a norte', kind: 'visita', rules: ['oleada'],
      steps: [
        { time: '06:00', label: 'Kiyomizu-dera', type: 'visita', maps: 'Kiyomizu-dera', place: 'kiyomizu' },
        { time: '07:30', label: 'Sannenzaka y Ninenzaka, antes de que abran las tiendas', type: 'visita', maps: 'Sannenzaka' },
        { time: '09:00', label: 'Kōdai-ji', type: 'visita', maps: 'Kodai-ji' },
        { time: '10:00', label: 'Parque Maruyama y Yasaka Jinja', type: 'visita', maps: 'Yasaka Shrine' },
        { time: '11:00', label: 'Nanzen-ji y el acueducto Suirokaku', type: 'visita', maps: 'Nanzen-ji' },
        { time: '12:30', label: 'Comida', type: 'comida' },
        { time: '14:00', label: 'Camino del Filósofo', type: 'visita', maps: "Philosopher's Path" },
        { time: '15:30', label: 'Ginkaku-ji (cierra ~17:00)', type: 'visita', maps: 'Ginkaku-ji' },
        { time: '17:30', label: 'Gion y Hanami-kōji al anochecer', type: 'noche', maps: 'Hanamikoji Street', place: 'gion' },
      ],
      notes: ['Día largo: unos 8–10 km a pie. Si vais cansados, se puede saltar Ginkaku-ji.'],
    },
    {
      date: '2027-05-19', city: 'kioto', hotel: 'kioto', title: 'Arashiyama, Sanjūsangen-dō y Nijō', kind: 'visita', rules: ['oleada', 'cierre'],
      steps: [
        { time: '07:00', label: 'Bosque de bambú de Sagano', type: 'visita', maps: 'Arashiyama Bamboo Grove', place: 'arashiyama' },
        { time: '08:30', label: 'Tenryū-ji', type: 'visita', maps: 'Tenryu-ji' },
        { time: '10:00', label: 'Puente Togetsukyō', type: 'visita', maps: 'Togetsukyo Bridge' },
        { time: '12:00', label: 'Comida en Arashiyama · JR a Kioto', type: 'comida' },
        { time: '13:30', label: 'Sanjūsangen-dō', type: 'visita', maps: 'Sanjusangendo' },
        { time: '15:00', label: 'Castillo Nijō (última entrada 16:00)', type: 'visita', maps: 'Nijo Castle', place: 'nijo' },
      ],
      notes: ['Nishiki cierra parte de sus puestos los miércoles; el palacio Honmaru de Nijō cierra el 17 y el 18.'],
    },
    {
      date: '2027-05-20', city: 'kioto', hotel: 'kioto', title: 'Fushimi Inari al amanecer y Kinkaku-ji', kind: 'visita', rules: ['oleada'], laundry: true,
      steps: [
        { time: '05:30', label: 'Primer tren Keihan desde Shichijō', type: 'traslado', maps: 'Shichijo Station Keihan Kyoto' },
        { time: '06:00', label: 'Fushimi Inari: subida al mirador de Yotsutsuji', type: 'visita', maps: 'Fushimi Inari Taisha', place: 'fushimi' },
        { time: '08:00', label: 'Taxi a Kinkaku-ji (~35–40 min)', type: 'traslado' },
        { time: '09:00', label: 'Kinkaku-ji, a la hora de apertura', type: 'visita', maps: 'Kinkaku-ji', place: 'kinkakuji' },
        { time: '10:15', label: 'Ryōan-ji', type: 'visita', maps: 'Ryoan-ji' },
        { time: '12:30', label: 'Comida en el mercado Nishiki', type: 'comida', maps: 'Nishiki Market', place: 'nishiki' },
        { time: 'tarde', label: 'Tarde libre · 🧺 colada 2', type: 'descanso' },
      ],
      notes: ['Fushimi con el primer tren: imprescindible para una buena experiencia.'],
    },
    {
      date: '2027-05-21', city: 'osaka', hotel: 'osaka', title: 'Tō-ji, Osaka y Nara por la tarde', kind: 'traslado', rules: ['cierre', 'oleada'],
      transfer: { from: 'Kioto', to: 'Osaka', how: 'JR a Osaka (~30 min) + taxi a Namba', arrive: '~12:30' },
      steps: [
        { time: '08:00', label: 'Mercadillo Kōbō-ichi en Tō-ji (solo el día 21)', type: 'visita', maps: 'To-ji', place: 'toji' },
        { time: '10:30', label: 'Recoger las maletas en el hotel', type: 'traslado' },
        { time: '11:00', label: 'JR a Osaka + taxi al hotel de Namba', type: 'traslado', maps: 'Namba Station Osaka' },
        { time: '12:30', label: 'Dejar las maletas · comida', type: 'comida' },
        { time: '14:00', label: 'Kintetsu de Namba a Nara (~40 min)', type: 'traslado', maps: 'Kintetsu Nara Station' },
        { time: '14:45', label: 'Kōfuku-ji y el parque de los ciervos', type: 'visita', maps: 'Kofuku-ji' },
        { time: '15:30', label: 'Tōdai-ji y el Gran Buda (hasta 17:30)', type: 'visita', maps: 'Todai-ji', place: 'todaiji' },
        { time: '19:00', label: 'Cena en Dōtonbori', type: 'noche', maps: 'Dotonbori', place: 'dotonbori' },
      ],
      notes: ['Tōdai-ji: 800 ¥, solo efectivo.'],
    },
    {
      date: '2027-05-22', city: 'osaka', hotel: 'osaka', title: 'Katsuo-ji y Minami', kind: 'visita', rules: ['finde'],
      steps: [
        { time: '08:30', label: 'Midōsuji a Senri-Chūō + autobús (solo tarjeta IC)', type: 'traslado' },
        { time: '09:30', label: 'Katsuo-ji, el templo de los daruma', type: 'visita', maps: 'Katsuo-ji', place: 'katsuoji' },
        { time: '12:30', label: 'Vuelta a Namba', type: 'traslado' },
        { time: '14:00', label: 'Minami: Hōzen-ji, Shinsaibashi y Dōtonbori', type: 'compras', maps: 'Hozenji Yokocho' },
      ],
      notes: ['En taxi desde Senri-Chūō: unos 3.400 ¥ para los cuatro.'],
    },
    {
      date: '2027-05-23', city: 'osaka', hotel: 'osaka', title: 'Excursión a Hiroshima', kind: 'visita', rules: ['finde'],
      steps: [
        { time: '07:00', label: 'Shinkansen de Shin-Osaka a Hiroshima (~1h25)', type: 'traslado', maps: 'Shin-Osaka Station' },
        { time: '09:00', label: 'Museo Memorial de la Paz', type: 'visita', maps: 'Hiroshima Peace Memorial Museum', place: 'hiroshima-museo', reserve: true },
        { time: '11:00', label: 'Parque de la Paz y Monumento a los Niños', type: 'visita', maps: 'Hiroshima Peace Memorial Park' },
        { time: '12:00', label: 'Cúpula de la Bomba Atómica', type: 'visita', maps: 'Atomic Bomb Dome', place: 'cupula' },
        { time: '13:00', label: 'Okonomiyaki estilo Hiroshima', type: 'comida', maps: 'Okonomimura Hiroshima' },
        { time: 'tarde', label: 'Vuelta a Osaka', type: 'traslado' },
      ],
      notes: ['En domingo no hay grupos escolares.'],
    },
    {
      date: '2027-05-24', city: 'osaka', hotel: 'osaka', title: 'Día tranquilo en Osaka', kind: 'visita', rules: [], laundry: true,
      steps: [
        { time: 'mañana', label: 'Sin despertador · 🧺 colada 3', type: 'descanso' },
        { time: '11:00', label: 'Parque del castillo de Osaka (por fuera)', type: 'visita', maps: 'Osaka Castle Park', place: 'osaka-castillo' },
        { time: '13:00', label: 'Comida en el mercado Kuromon', type: 'comida', maps: 'Kuromon Market', place: 'kuromon' },
        { time: '14:30', label: 'Den Den Town', type: 'compras', maps: 'Den Den Town', optional: true },
        { time: '15:30', label: 'Shinsekai y Tsūtenkaku', type: 'visita', maps: 'Tsutenkaku', place: 'shinsekai' },
        { time: '17:00', label: 'Descanso en el hotel', type: 'descanso' },
        { time: '18:30', label: 'Umeda Sky al atardecer (~19:00) + cena en Umeda', type: 'noche', maps: 'Umeda Sky Building' },
      ],
    },
    {
      date: '2027-05-25', city: 'tokio', hotel: 'tokio2', title: 'Vuelta a Tokio · Akihabara friki', kind: 'traslado', rules: [],
      transfer: { from: 'Osaka', to: 'Tokio', how: 'Tōkaidō Shinkansen (asiento E: lado del Fuji)', arrive: '~13:30' },
      steps: [
        { time: '10:00', label: 'Check-out · Shinkansen desde Shin-Osaka (asiento E)', type: 'traslado', maps: 'Shin-Osaka Station' },
        { time: '13:30', label: 'Hotel en Asakusa · dejar maletas', type: 'descanso', maps: 'Asakusa Station Tokyo' },
        { time: '15:00', label: 'Akihabara: Radio Kaikan · Mandarake · Surugaya', type: 'compras', maps: 'Akihabara Radio Kaikan', place: 'akihabara' },
        { time: '17:00', label: 'Retro: Super Potato y gachapon', type: 'compras', maps: 'Super Potato Akihabara' },
      ],
    },
    {
      date: '2027-05-26', city: 'tokio', hotel: 'tokio2', title: 'Asakusa y Skytree', kind: 'visita', rules: ['laborable', 'oleada'],
      steps: [
        { time: '07:30', label: 'Sensō-ji y Kaminarimon sin gente', type: 'visita', maps: 'Senso-ji', place: 'senso-ji' },
        { time: '09:30', label: 'Nakamise y Asakusa Jinja', type: 'visita', maps: 'Nakamise Shopping Street' },
        { time: 'tarde', label: 'Libre', type: 'descanso' },
        { time: '17:30', label: 'Tokyo Skytree al atardecer', type: 'visita', maps: 'Tokyo Skytree', place: 'skytree', reserve: true },
      ],
      notes: ['El Sanja Matsuri ya pasó (14–16 de mayo).'],
    },
    {
      date: '2027-05-27', city: 'tokio', hotel: 'tokio2', title: 'Fukagawa y Nakano Broadway', kind: 'visita', rules: ['laborable'],
      steps: [
        { time: '09:00', label: 'Jardín Kiyosumi', type: 'visita', maps: 'Kiyosumi Teien', place: 'kiyosumi' },
        { time: '10:00', label: 'Museo Edo de Fukagawa', type: 'visita', maps: 'Fukagawa Edo Museum' },
        { time: '11:30', label: 'Fudō-dō y Tomioka Hachimangū · comer fukagawa-meshi', type: 'visita', maps: 'Tomioka Hachimangu' },
        { time: '13:00', label: 'Línea Tōzai directa a Nakano (~35 min)', type: 'traslado' },
        { time: '13:45', label: 'Nakano Broadway: Mandarake, figuras vintage, retro', type: 'compras', maps: 'Nakano Broadway', place: 'nakano' },
        { time: 'noche', label: 'Hacer maletas', type: 'descanso' },
      ],
    },
    {
      date: '2027-05-28', city: null, title: 'Regreso', kind: 'viaje',
      transfer: { from: 'Asakusa', to: 'Narita T1', how: 'Taxi a Ueno + Skyliner', arrive: '~8:45' },
      steps: [
        { time: '07:15', label: 'Check-out · taxi a Ueno', type: 'traslado' },
        { time: '07:40', label: 'Skyliner a Narita', type: 'traslado', maps: 'Keisei Ueno Station' },
        { time: '08:45', label: 'Narita T1 · facturación', type: 'traslado', maps: 'Narita Airport Terminal 1' },
        { time: '11:20', label: 'LH711 → Fráncfort → Barcelona (23:05)', type: 'traslado' },
      ],
    },
  ],
  /**
   * Muestras de "El lugar" (historia y curiosidades) para enseñar el patrón en los prototipos.
   * La versión definitiva saldrá de docs/contexto-itinerario/v2/ (investigación en curso).
   * Va siempre tras un toque (regla anti-spoiler de la web): nunca visible de entrada.
   */
  places: {
    'senso-ji': {
      name: 'Sensō-ji', kanji: '浅草寺',
      what: 'El templo budista más antiguo de Tokio, dedicado a Kannon.',
      story: 'Según la tradición, en el año 628 dos hermanos pescadores sacaron del río Sumida una pequeña imagen de Kannon que volvía a sus redes una y otra vez.',
      curiosities: ['La imagen original es hibutsu: un "buda oculto" que no se muestra al público.', 'Fíjate en la base del gran farol de Kaminarimon: tiene un dragón tallado.'],
    },
    fushimi: {
      name: 'Fushimi Inari Taisha', kanji: '伏見稲荷大社',
      what: 'Santuario principal de los miles de santuarios Inari de Japón, con sus túneles de torii.',
      story: 'Inari es el kami del arroz y la prosperidad. Cada torii es una donación de una persona o empresa, con su nombre y la fecha grabados en la parte trasera.',
      curiosities: ['Los zorros (kitsune) son los mensajeros de Inari: fíjate en lo que llevan en la boca.', 'Lee la parte de atrás de los torii al bajar: verás nombres de empresas.'],
    },
  },
}
