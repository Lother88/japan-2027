/**
 * Contexto cultural por zona — volcado del dossier docs/contexto-itinerario/.
 *
 * Contenido NARRATIVO (qué es · historia · significado · dato curioso · fuentes),
 * separado del modelo anti-spoiler: `Zone` NO tiene `description` (NOSPOIL-01) y
 * `TimeSlot.summary` solo describe categoría (NOSPOIL-04). Esto vive aparte y se
 * muestra en la sección colapsable "El lugar" de cada zona.
 *
 * key = Zone.id (ver src/data/zones.ts). Cada zona puede tener varios POIs.
 * Fuente única: docs/contexto-itinerario/*.md (sin inventar).
 *
 * Nota: `hiroshima-paz` no tiene ficha en el dossier todavía → sin contexto.
 */

export interface ContextSource {
  readonly label: string
  readonly url: string
}

export interface ContextEntry {
  /** Nombre del punto de interés (POI) */
  readonly nombre: string
  /** Qué es (definición breve) */
  readonly queEs: string
  /** Historia / datos clave */
  readonly historia: string
  /** Significado / por qué importa */
  readonly significado: string
  /** Dato curioso (opcional) */
  readonly datoCurioso?: string
  /** Fuentes con URL */
  readonly fuentes: readonly ContextSource[]
}

export const context: Record<string, readonly ContextEntry[]> = {
  // ───────────────────────────── TOKIO ─────────────────────────────
  asakusa: [
    {
      nombre: 'Sensō-ji (浅草寺)',
      queEs: 'Templo budista dedicado a Kannon (bodhisattva de la misericordia), el más antiguo de Tokio y el más visitado de Japón.',
      historia: `Fundado en 628 d.C., cuando —según la tradición— dos hermanos pescadores hallaron una estatuilla de Kannon en el río Sumida que siempre volvía a ellos; el jefe del clan reconoció su carácter sagrado y se completó el templo en 645. Reconstruido muchas veces; la Sala Principal actual es de 1958 (tras los bombardeos de 1945, con donaciones de todo Japón).`,
      significado: `Continuidad espiritual de Tokio a través de catástrofes y reconstrucciones. La imagen de Kannon es hibutsu (estatua oculta) y nunca se exhibe.`,
      datoCurioso: `La estatua fundacional de Kannon mide apenas 5,5 cm y desde el año 628 nunca se ha mostrado públicamente — ni el propio clero la ve.`,
      fuentes: [
        { label: 'JNTO', url: 'https://www.japan.travel/en/spot/1691/' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3001.html' },
        { label: 'GO TOKYO', url: 'https://www.gotokyo.org/en/spot/15/index.html' },
      ],
    },
    {
      nombre: 'Kaminarimon y Nakamise-dōri',
      queEs: 'Kaminarimon es la gran puerta exterior de Sensō-ji, símbolo de Asakusa. Nakamise-dōri es el paseo comercial de 250 m que la une con la puerta interior Hōzōmon.',
      historia: `Puerta construida originalmente en 942 d.C.; la versión actual es de 1960, donada por Konosuke Matsushita (fundador de Panasonic) tras curarse de una enfermedad. El farol rojo central mide 3,9 m y pesa ~700 kg (artesanos de Kioto). Nakamise tiene ~89 puestos; los primeros se establecieron en el Edo, cuando el templo autorizó a vender en el recinto.`,
      significado: `Entrada ritual a uno de los recintos sagrados de Tokio. Las estatuas que flanquean el farol son Fūjin (viento) y Raijin (trueno), guardianes. Muchas tiendas de Nakamise llevan generaciones en la misma familia.`,
      datoCurioso: `En la base del gran farol, visibles solo desde dentro de la puerta, hay tallas de dragones dorados (Tenryū y Kinryū).`,
      fuentes: [
        { label: 'GO TOKYO — Kaminarimon', url: 'https://www.gotokyo.org/en/spot/14/index.html' },
        { label: 'JNTO — Nakamise', url: 'https://www.japan.travel/en/spot/1696/' },
      ],
    },
    {
      nombre: 'Asakusa Jinja ("Sanja-sama")',
      queEs: 'Santuario sintoísta dentro del recinto de Sensō-ji, dedicado a los tres hombres que fundaron el templo budista vecino.',
      historia: `Construido en 1649 por orden del shōgun Tokugawa Iemitsu. Consagrado a los dos hermanos pescadores y al señor del clan que promovió el templo. Sobrevivió a los bombardeos de 1945; Bien Cultural Importante desde 1951.`,
      significado: `Ejemplo excepcional de shinbutsu-shūgō (convivencia budismo-sintoísmo): un santuario sintoísta honrando a los fundadores de un templo budista en el mismo recinto. Sede del Sanja Matsuri, uno de los tres grandes festivales de Tokio (mayo).`,
      datoCurioso: `El Sanja Matsuri convoca a más de 1,5 millones de personas en tres días, con tres mikoshi recorriendo Asakusa.`,
      fuentes: [
        { label: 'GO TOKYO', url: 'https://www.gotokyo.org/en/spot/383/index.html' },
        { label: 'JNTO — Sanja Festival', url: 'https://www.japan.travel/en/spot/1705/' },
      ],
    },
  ],
  'tokyo-skytree': [
    {
      nombre: 'Tokyo Skytree (東京スカイツリー)',
      queEs: 'Torre de radiodifusión y observación de 634 m en Oshiage (Sumida), la estructura más alta de Japón.',
      historia: `Diseño estructural de Nikken Sekkei, construida por Obayashi. Completada el 29 feb 2012; abierta el 22 may 2012. Guinness la certificó como torre autoportante de radiodifusión más alta del mundo (17 nov 2011). Dos miradores: Tembo Deck (350 m) y Tembo Galleria (445-450 m). Sustituyó a la Torre de Tokio en la emisión digital.`,
      significado: `Se ubica en el shitamachi (la "ciudad baja" histórica de Edo), no en los centros de negocios modernos — anclaje deliberado en la geografía cultural más antigua de Tokio. Su iluminación alterna Iki (azul, "chic" del Edo) y Miyabi (violeta, "refinamiento").`,
      datoCurioso: `La altura 634 m se eligió porque 6-3-4 se lee mu-sa-shi, evocando la histórica Provincia de Musashi. El restaurante de la cima se llama Sky Restaurant 634 (Musashi). La altura original planeada (610 m) se cambió a 634.`,
      fuentes: [
        { label: 'Web oficial', url: 'https://en.tokyo-skytree.jp/about/spec/' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3064.html' },
      ],
    },
  ],
  shibuya: [
    {
      nombre: 'Cruce de Shibuya (Scramble Crossing)',
      queEs: 'La intersección peatonal más transitada del mundo: todos los semáforos se ponen en rojo a la vez y los peatones cruzan en todas las direcciones.',
      historia: `La estación de Shibuya abrió en 1885; el cruce adoptó el sistema "scramble" al consolidarse Shibuya como nodo de transporte en el s. XX. En hora punta cruzan más de 1.000 personas por ciclo; algunas estimaciones hablan de hasta 500.000/día.`,
      significado: `Símbolo visual de la Tokio moderna (cine, series, publicidad). Encarna el "orden en la multitud": miles de personas en direcciones opuestas sin colisionar.`,
      datoCurioso: `Pese al volumen, las colisiones son rarísimas; se ha estudiado como ejemplo de auto-organización humana espontánea.`,
      fuentes: [
        { label: 'GO TOKYO', url: 'https://www.gotokyo.org/en/spot/78/index.html' },
        { label: 'JNTO', url: 'https://www.japan.travel/en/spot/2177/' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3007.html' },
      ],
    },
    {
      nombre: 'Estatua de Hachikō (ハチ公像)',
      queEs: 'Escultura de bronce de un perro Akita frente a la salida Hachikō de Shibuya, que conmemora a un perro real famoso por su lealtad.',
      historia: `Hachikō (nacido en 1923) acompañaba cada día a su dueño, el profesor Hidesaburō Ueno, a la estación. El profesor murió en mayo de 1925; Hachikō volvió a la estación cada tarde durante nueve años, once meses y quince días, hasta su muerte el 8 mar 1935. La primera estatua (1934, con Hachikō presente) se fundió en la guerra; la actual es de 1948.`,
      significado: `Encarna chūgi (lealtad) y giri (deber moral), virtudes clave en la cultura japonesa. Hoy es uno de los puntos de encuentro más usados de Tokio.`,
      datoCurioso: `El Asahi Shimbun publicó en 1932 un artículo que lo hizo famoso en vida; la gente iba a la estación expresamente a verlo.`,
      fuentes: [
        { label: 'GO TOKYO', url: 'https://www.gotokyo.org/en/spot/86/index.html' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3007.html' },
        { label: 'Tokyo Weekender', url: 'https://www.tokyoweekender.com/art_and_culture/spotlight-hidesaburo-ueno-hachikos-master/' },
      ],
    },
  ],
  'harajuku-meiji': [
    {
      nombre: 'Meiji Jingū (明治神宮)',
      queEs: 'Gran santuario sintoísta en el corazón de Tokio, dedicado a los espíritus deificados del emperador Meiji (1852-1912) y la emperatriz Shōken.',
      historia: `Tras la muerte del emperador Meiji (artífice de la modernización de Japón), el pueblo pidió un santuario en su honor; completado el 1 nov 1920. El bosque circundante (~70 ha) se diseñó como bosque autosuficiente con visión a 100 años: 100.000 árboles donados de todo Japón, plantados por voluntarios. Destruido en 1945 y restaurado en 1958 con donaciones.`,
      significado: `Síntesis de modernidad y tradición. Es el santuario más visitado de Japón en Año Nuevo (~3 millones de personas en hatsumode).`,
      datoCurioso: `El bosque no es natural: se planificó en 1915 para evolucionar en 100 años hacia un bosque perenne auto-sostenible. Un siglo después, el plan funciona según lo previsto.`,
      fuentes: [
        { label: 'Web oficial', url: 'https://www.meijijingu.or.jp/en/about/establishment/' },
        { label: 'GO TOKYO', url: 'https://www.gotokyo.org/en/spot/76/index.html' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3002.html' },
      ],
    },
    {
      nombre: 'Yoyogi Park (代々木公園)',
      queEs: 'Uno de los parques urbanos más grandes de Tokio (~54 ha), junto a Meiji Jingū, con praderas amplias y una historia estratificada del s. XX.',
      historia: `En 1910, escenario del primer vuelo a motor de Japón. Tras 1945, las fuerzas de ocupación de EE. UU. construyeron aquí "Washington Heights". Fue Villa Olímpica en los JJ. OO. de 1964; parque público desde 1967. El Yoyogi National Gymnasium (de Kenzō Tange) es Bien Cultural Importante desde 2021.`,
      significado: `Condensado físico de la historia japonesa del s. XX: era imperial, ocupación americana, recuperación (JJ. OO. 1964) y espacio público democrático.`,
      datoCurioso: `En los 80-90, los domingos congregaba a bailarines "rockabilly" (Elvis, Stray Cats) que atrajeron a periodistas de todo el mundo; aún se ven ocasionalmente.`,
      fuentes: [
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3034_002.html' },
        { label: 'JNTO', url: 'https://www.japan.travel/en/spot/1654/' },
        { label: 'GO TOKYO', url: 'https://www.gotokyo.org/en/spot/21/index.html' },
      ],
    },
    {
      nombre: 'Takeshita-dōri (竹下通り)',
      queEs: 'Calle peatonal de ~350 m en Harajuku, epicentro mundial de la moda callejera juvenil japonesa y cuna del kawaii.',
      historia: `Harajuku desarrolló su identidad juvenil desde los años 1970, cuando los jóvenes se reunían los domingos. Takeshita concentró ropa vintage, diseñadores emergentes, crepes y purikura. Origen de tendencias luego globales: lolita, visual kei, gyaru, decora.`,
      significado: `Demostración física de cómo Japón convirtió la cultura juvenil de masas en fenómeno de influencia global.`,
      datoCurioso: `Su densidad de estímulos visuales ("caos deliberado") se estudia en diseño urbano y psicología del consumidor — lo opuesto al minimalismo japonés.`,
      fuentes: [
        { label: 'GO TOKYO', url: 'https://www.gotokyo.org/en/spot/48/index.html' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3006.html' },
        { label: 'JNTO', url: 'https://www.japan.travel/en/story/shopping-in-harajuku/' },
      ],
    },
  ],
  shinjuku: [
    {
      nombre: 'Tokyo Metropolitan Government Building — Mirador',
      queEs: 'Sede del gobierno metropolitano de Tokio, con dos miradores gratuitos a 202 m en la Torre nº 1.',
      historia: `Construido entre abril de 1988 y marzo de 1991, diseño de Kenzō Tange. La torre principal (243 m, 48 plantas) se divide en dos torreones desde el piso 33. Fue el edificio más alto de Tokio hasta 2007.`,
      significado: `El diseño de Tange fusiona la catedral gótica (torreones dobles) con motivos de circuitos integrados. Es una de las mejores vistas panorámicas de Tokio sin coste, con el Fuji en días claros.`,
      datoCurioso: `En días despejados se ve el Fuji a más de 90 km. Los miradores cierran en días alternos (norte los martes, sur los miércoles) para que siempre haya uno abierto.`,
      fuentes: [
        { label: 'GO TOKYO', url: 'https://www.gotokyo.org/en/spot/74/index.html' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3011_tocho.html' },
        { label: 'metro.tokyo.lg.jp', url: 'https://www.english.metro.tokyo.lg.jp/w/000-101-000542' },
      ],
    },
    {
      nombre: 'Shinjuku Gyoen (新宿御苑)',
      queEs: 'Jardín nacional de 58 ha que combina tres estilos —japonés, francés e inglés—, uno de los espacios verdes más célebres de Tokio.',
      historia: `Terreno cedido en 1590 por Tokugawa Ieyasu al clan Naito. En 1872 pasó al gobierno (estación experimental agrícola) y luego a la Casa Imperial. El paisajista francés Henri Martinet rediseñó los jardines (1902-1906); inaugurado como jardín imperial en 1906. Destruido en 1945 y abierto al público el 21 may 1949 bajo el Ministerio de Medio Ambiente.`,
      significado: `Reúne el Japón feudal, la modernización imperial, la influencia occidental y la democratización de posguerra. Uno de los mejores lugares de hanami de Tokio (más de 1.000 cerezos de 65 variedades).`,
      datoCurioso: `Su invernadero (reconstrucción de 1958) fue el más grande de Asia; el actual (2012) es también laboratorio de investigación ecológica del Ministerio.`,
      fuentes: [
        { label: 'Ministerio de Medio Ambiente', url: 'https://policies.env.go.jp/national-garden/shinjukugyoen/english/intro/history/' },
        { label: 'GO TOKYO', url: 'https://www.gotokyo.org/en/spot/75/index.html' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3034_001.html' },
      ],
    },
    {
      nombre: 'Omoide Yokocho (思い出横丁)',
      queEs: 'Red de callejuelas estrechas al noroeste de la estación de Shinjuku, con bares y puestos de yakitori que evocan la Tokio de los años 50.',
      historia: `Nació en la posguerra (finales de los 40), cuando los mercados negros junto a las estaciones se regularon como puestos de comida. Apodado también "Piss Alley". Hoy alberga más de 50 establecimientos diminutos (5-6 personas) de yakitori y cerveza.`,
      significado: `Uno de los pocos espacios donde se conserva la escala urbana de la posguerra dentro del Shinjuku hiperconstruido.`,
      datoCurioso: `Es tan estrecho que la normativa de emergencia lo ha puesto en peligro de clausura varias veces; la presión vecinal lo ha mantenido — caso de estudio de preservación de patrimonio urbano informal.`,
      fuentes: [
        { label: 'GO TOKYO', url: 'https://www.gotokyo.org/en/spot/63/index.html' },
        { label: 'JNTO', url: 'https://www.japan.travel/en/us/blog/4-tokyo-yokocho-where-you-can-experience-the-1950s/' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3011.html' },
      ],
    },
    {
      nombre: 'Golden Gai (ゴールデン街)',
      queEs: 'Seis callejuelas en Shinjuku con casi 300 bares diminutos (5-6 personas), herederos de la subcultura intelectual y artística de la posguerra.',
      historia: `Surge en los años 40-50 (raíces en los mercados negros tras 1945). En los 60-70 fue punto de encuentro de escritores, cineastas y periodistas de la contracultura (frecuentado por Yukio Mishima, Ryūichi Sakamoto). En los 80 resistió los intentos de demolición inmobiliaria.`,
      significado: `Preservación física de la bohemia y la contracultura del Japón de posguerra. Cada bar tiene su personalidad y temática (cine, jazz, manga, poesía).`,
      datoCurioso: `Algunos bares cobran cover charge (500-1.000 ¥) no por codicia, sino como filtro cultural: con solo seis plazas, el dueño elige a su público.`,
      fuentes: [
        { label: 'GO TOKYO', url: 'https://www.gotokyo.org/en/spot/62/index.html' },
        { label: 'Tokyo Updates (TMG)', url: 'https://www.tokyoupdates.metro.tokyo.lg.jp/en/post-1426/' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3011.html' },
      ],
    },
    {
      nombre: 'Kabukichō (歌舞伎町)',
      queEs: 'El mayor barrio de entretenimiento nocturno de Japón, al norte de Shinjuku (~36 ha): host/hostess bars, pachinko, karaoke, cines y vida nocturna.',
      historia: `La zona (antes Tsunohazu) fue arrasada en el bombardeo del 13 abr 1945. En 1947 el líder vecinal Suzuki Kihei ideó un distrito cultural estilo Broadway centrado en un gran teatro kabuki; el nombre Kabukichō se adoptó el 1 abr 1948. El teatro nunca se construyó (colapso de la financiación). Derivó hacia el ocio nocturno, con presencia histórica de la yakuza. En abr 2023 abrió la Tokyu Kabukicho Tower (225 m).`,
      significado: `Históricamente, espacio para los marginados del Japón dominante (comunidad LGBTQ+ en el contiguo Shinjuku Ni-chōme, artistas, residentes extranjeros). Es la base real de la ciudad ficticia Kamurochō de la saga Yakuza / Like a Dragon.`,
      datoCurioso: `"La ciudad del kabuki" nunca tuvo un teatro de kabuki — el nombre conmemora un proyecto de 1947 que jamás se materializó. En 2002 se estimó que ~70% del suelo pertenecía a residentes de origen extranjero y descendientes (sobre todo comunidades coreana y taiwanesa que reconstruyeron la zona).`,
      fuentes: [
        { label: 'GO TOKYO', url: 'https://www.gotokyo.org/en/spot/1855/index.html' },
        { label: 'Nippon.com', url: 'https://www.nippon.com/en/japan-topics/g00800/becoming-a-tokyo-center-a-history-of-shinjuku.html' },
        { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Kabukich%C5%8D' },
      ],
    },
  ],
  ueno: [
    {
      nombre: 'Museo Nacional de Tokio (東京国立博物館)',
      queEs: 'El museo más antiguo y grande de Japón, en el Parque de Ueno, con la mayor colección de arte y arqueología japonesa y asiática del país.',
      historia: `Fundado en 1872 (Meiji). El edificio principal (Honkan) actual es de 1938, estilo "Imperial Crown", tras dañarse el original de Josiah Conder en el terremoto de 1923. Otros pabellones: Hyōkeikan (1909), Tōyōkan (1968), Galería de Tesoros del Hōryū-ji (1999).`,
      significado: `~120.000 objetos, con 89 Tesoros Nacionales y 648 Propiedades Culturales Importantes — el conjunto patrimonial más significativo de Japón. Nació como pieza central de la modernización cultural Meiji.`,
      datoCurioso: `El pabellón Hyōkeikan (1909, para la boda del futuro emperador Taishō) es él mismo Propiedad Cultural Importante: parte del museo es una pieza de museo protegida.`,
      fuentes: [
        { label: 'Web oficial (tnm.jp)', url: 'https://www.tnm.jp/150th/en/about.html' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3054_tokyo.html' },
      ],
    },
    {
      nombre: 'Parque de Ueno (上野恩賜公園)',
      queEs: 'El gran parque cultural de Tokio, uno de los primeros parques públicos del país, con seis museos, un zoo y cientos de cerezos.',
      historia: `Abierto al público en 1873. El terreno era del Templo Kan'ei-ji (fundado en 1625 como protección espiritual del Castillo de Edo), destruido en la Batalla de Ueno de 1868 (Guerra Boshin). En 1924 el emperador Taishō cedió su administración a la ciudad (de ahí "Onshi", "regalo imperial").`,
      significado: `Principal núcleo museístico del país y hogar del zoo más antiguo de Japón (1882). Suelo cargado de historia Tokugawa.`,
      datoCurioso: `Las primeras cerezas las plantó el shogun Tokugawa Iemitsu; hoy hay ~800 árboles. Alberga la famosa estatua de bronce de Saigō Takamori, "el último samurái".`,
      fuentes: [
        { label: 'GO TOKYO', url: 'https://www.gotokyo.org/en/spot/482/index.html' },
        { label: 'JNTO', url: 'https://www.japan.travel/en/spot/1673/' },
      ],
    },
    {
      nombre: 'Estanque Shinobazu y Benten-dō (不忍池・弁天堂)',
      queEs: 'Gran estanque natural en Ueno con una isleta donde se asienta el Benten-dō, templo octogonal dedicado a la diosa Benzaiten.',
      historia: `Erigido hacia 1634 por el monje Tenkai, máximo sacerdote del Kan'ei-ji, que diseñó el conjunto imitando la geografía sagrada de Kioto (Shinobazu = lago Biwa; la isleta = isla Chikubu). Destruido en 1945; el hall actual es de 1958.`,
      significado: `Dedicado a Benzaiten, única mujer entre los Siete Dioses de la Fortuna, diosa de todo lo que "fluye" (música, sabiduría, riqueza). Vestigio de la grandeza del Kan'ei-ji.`,
      datoCurioso: `En verano el estanque se cubre de flores de loto, que solo abren entre las 7:00 y las 9:00. La planta octogonal es la forma asociada a Benzaiten.`,
      fuentes: [
        { label: 'GO TOKYO', url: 'https://www.gotokyo.org/en/spot/400/index.html' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3019.html' },
      ],
    },
  ],
  yanaka: [
    {
      nombre: 'Yanaka Ginza (谷中銀座)',
      queEs: 'Calle comercial (shotengai) de ~170-200 m con unas 60 tiendas, icono del Tokio popular de mediados del s. XX.',
      historia: `Surgió hacia 1945 (posguerra). Yanaka es uno de los pocos rincones de Tokio que sobrevivió intacto al terremoto de 1923 y a los bombardeos de 1945 — "museo vivo" del Tokio premoderno. El sufijo "-Ginza" lo adoptaron muchas calles de barrio para evocar prosperidad.`,
      significado: `Encarna el ambiente shitamachi del período Shōwa: tiendas independientes de comida, dulces wagashi, artesanía. Famoso barrio "de gatos" (neko-machi).`,
      datoCurioso: `Las escaleras Yūyake Dandan ("escaleras del atardecer") al inicio de la calle son uno de los puntos fotográficos más queridos de Tokio. Aún se venden dulces por menos de 50 ¥.`,
      fuentes: [
        { label: 'GO TOKYO', url: 'https://www.gotokyo.org/en/spot/170/index.html' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3068.html' },
      ],
    },
    {
      nombre: 'Cementerio de Yanaka (谷中霊園)',
      queEs: 'Uno de los cementerios históricos más grandes y bellos de Tokio (~7.000 tumbas) con una avenida central de cerezos.',
      historia: `Establecido en 1872 sobre terrenos confiscados al templo Tennō-ji, como parte de la política de separación budismo-sintoísmo (shinbutsu bunri). Más de 100.000 m².`,
      significado: `Panteón de la historia moderna de Japón: aquí reposan Tokugawa Yoshinobu (último shogun), Shibusawa Eiichi ("padre del capitalismo japonés", hoy en el billete de 10.000 ¥) y la novelista Higuchi Ichiyō (primera mujer en un billete japonés).`,
      datoCurioso: `Guarda los restos de una pagoda de cinco pisos del Tennō-ji que ardió en 1957 en el célebre "doble suicidio con incendio de la pagoda de Yanaka"; esa pagoda inspiró la novela Gojū-no-tō (1891) de Kōda Rohan.`,
      fuentes: [
        { label: 'GO TOKYO', url: 'https://www.gotokyo.org/en/spot/677/index.html' },
        { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Yanaka_Cemetery' },
      ],
    },
    {
      nombre: 'Nezu Jinja (根津神社)',
      queEs: 'Uno de los santuarios sintoístas más antiguos y bellos de Tokio, célebre por su túnel de torii bermellones y su jardín de azaleas.',
      historia: `De fundación legendaria muy antigua, fue reconstruido en su emplazamiento actual en 1705-1706 por el quinto shogun Tokugawa Tsunayoshi. Sus edificios (1706, estilo Ishi-no-ma-zukuri inspirado en el Tōshō-gū de Nikkō) llevan en pie más de 320 años y son Bienes Culturales Importantes.`,
      significado: `Uno de los "Diez Grandes Santuarios de Tokio". Conserva intacta su arquitectura Edo original, algo muy raro en Tokio.`,
      datoCurioso: `Su pasaje de torii rojos en miniatura (al santuario Otome Inari) recuerda a Fushimi Inari pero sin masas. Su jardín reúne más de 3.000 azaleas; el Tsutsuji Matsuri (abril-mayo) coincide con las fechas del viaje.`,
      fuentes: [
        { label: 'GO TOKYO', url: 'https://www.gotokyo.org/en/spot/70/index.html' },
        { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Nezu_Shrine' },
      ],
    },
    {
      nombre: 'Tennō-ji (天王寺)',
      queEs: 'Templo budista histórico en el corazón de Yanaka (hoy secta Tendai), con una gran estatua de Buda de bronce.',
      historia: `Orígenes en 1274 (Kamakura tardío), de la mano del monje Nichiren. En 1699 el shogunato lo reabrió como rama del Kan'ei-ji, cambiando de secta Nichiren a Tendai. Su Buda de bronce (1690) sobrevivió a la guerra civil de 1868.`,
      significado: `Sede del culto a Bishamonten (dios del valor) y único de los siete templos del Peregrinaje de los Siete Dioses de la Fortuna de Yanaka dentro del propio barrio.`,
      datoCurioso: `Entre 1728 y 1842 fue el único templo de Tokio autorizado a celebrar loterías benéficas (tomitsuki), lo que lo hizo muy popular.`,
      fuentes: [
        { label: 'Japan Experience', url: 'https://www.japan-experience.com/all-about-japan/tokyo/temples-shrines/tennoji' },
        { label: 'Tokyo Cheapo', url: 'https://tokyocheapo.com/place/tennoji-temple/' },
      ],
    },
  ],
  'palacio-imperial': [
    {
      nombre: 'Palacio Imperial — Jardín Este (皇居東御苑)',
      queEs: 'El jardín público sobre el solar del antiguo Castillo de Edo, centro de poder del shogunato Tokugawa.',
      historia: `Ocupa el honmaru y ninomaru del Castillo de Edo (sede Tokugawa desde 1603). La torre principal —la más alta jamás construida en Japón— se completó en 1638 y ardió en el Gran Incendio de Meireki de 1657, sin volver a levantarse. Tras Meiji pasó a la Casa Imperial; el jardín este abrió al público el 1 oct 1968 (21 ha).`,
      significado: `El lugar donde residió el poder de Japón durante 265 años. Gestionado por la Agencia de la Casa Imperial, conserva vestigios del castillo en pleno centro.`,
      datoCurioso: `Se puede subir a la base de piedra de la torre (tenshudai) y pisar el punto donde se alzaba la torre más alta de la historia de Japón. La sección Ninomaru tiene árboles de todas las prefecturas, símbolo de unidad nacional.`,
      fuentes: [
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3018.html' },
        { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Imperial_Palace_East_Garden' },
      ],
    },
  ],
  tsukiji: [
    {
      nombre: 'Tsukiji Outer Market (築地場外市場)',
      queEs: 'El laberinto de ~500 tiendas y puestos que rodeaba al antiguo mercado de pescado de Tsukiji, todavía vivo y bullicioso.',
      historia: `El gran mercado de pescado de Tokio estaba en Nihonbashi hasta el terremoto de 1923. El mercado de Tsukiji abrió en 1935 y llegó a ser el mayor del mundo. El mercado interior (subastas de atún) cerró el 6 oct 2018 y se trasladó a Toyosu; el mercado exterior nunca cerró.`,
      significado: `Epicentro de la cultura gastronómica del marisco en Tokio: pescado fresco y seco, algas, utensilios y los famosos cuchillos profesionales.`,
      datoCurioso: `Tsukiji (築地) significa "tierra construida/ganada al mar": todo el barrio se levantó sobre terreno ganado a la bahía. Lo mejor es ir entre las 6:00 y las 9:00.`,
      fuentes: [
        { label: 'GO TOKYO', url: 'https://www.gotokyo.org/en/spot/65/index.html' },
        { label: 'JNTO', url: 'https://www.japan.travel/en/spot/1707/' },
      ],
    },
    {
      nombre: 'Tsukiji Honganji (築地本願寺)',
      queEs: 'Templo budista Jōdo Shinshū de aspecto exótico —más parecido a un templo indio que japonés— a pocos pasos del mercado.',
      historia: `Fundado en 1617 cerca de Asakusa; reconstruido en Tsukiji en 1679 (sus fieles ganaron el terreno al mar). Tras arder en el terremoto de 1923, el edificio actual (1934) es obra del arquitecto Itō Chūta. Bien Cultural Importante desde 2014.`,
      significado: `Itō Chūta lo diseñó inspirándose en la arquitectura budista de la India y Asia continental, buscando los orígenes geográficos del budismo (tejado en forma de hoja de Bodhi, relieves de loto, arcos de aire indio).`,
      datoCurioso: `Itō llenó el templo de tallas de leones alados, elefantes y fénix; en su interior hay vidrieras, un órgano de ~2.000 tubos (1970) y un café — insólito en un templo budista.`,
      fuentes: [
        { label: 'GO TOKYO', url: 'https://www.gotokyo.org/en/spot/12/index.html' },
        { label: 'Web oficial del templo', url: 'https://tsukijihongwanji.jp/global/guide/' },
      ],
    },
  ],
  ginza: [
    {
      nombre: 'Teatro Kabuki-za (歌舞伎座)',
      queEs: 'El principal teatro de kabuki de Japón: fachada tradicional barroca japonesa con un rascacielos moderno detrás.',
      historia: `Inaugurado el 21 nov 1889 (primer teatro de kabuki con luz eléctrica del país). Reconstruido cuatro veces (1911, 1924, 1950, 2013); la última, obra de Kengo Kuma. Aforo actual: 1.964 butacas, operado por Shōchiku desde 1914.`,
      significado: `El kabuki (s. XVII, teatro popular de Edo) es Patrimonio Cultural Inmaterial de la Humanidad (UNESCO, 2008). Rasgos: maquillaje kumadori, pasarela hanamichi y onnagata (hombres en papeles femeninos).`,
      datoCurioso: `No hace falta ver la función entera: se venden entradas para un solo acto (hitomaku-mi, desde ~1.500 ¥) en taquilla, ideal para una primera toma de contacto.`,
      fuentes: [
        { label: 'GO TOKYO — Kabuki', url: 'https://www.gotokyo.org/en/story/guide/exploring-kabuki-theater/index.html' },
        { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Kabuki-za' },
      ],
    },
    {
      nombre: 'Edificio Wako / reloj Seiko',
      queEs: 'El edificio neoclásico de fachada curva coronado por una torre de reloj que preside el cruce de Ginza 4-chome, el más icónico de Tokio.',
      historia: `Origen en Kintarō Hattori, fundador en 1881 de la relojería K. Hattori (hoy Grupo Seiko). El edificio actual (1932) es de Jin Watanabe, neoclásico con toques Art Déco. Sobrevivió intacto a los bombardeos de la 2ª Guerra Mundial. Renombrado Seiko House Ginza en 2022.`,
      significado: `El gran símbolo de Ginza y de la modernidad japonesa; punto de encuentro y postal del distrito. Su reloj toca las campanadas de Westminster.`,
      datoCurioso: `La torre del reloj fue destruida por Godzilla en la película original de 1954, una de las escenas más célebres del cine japonés.`,
      fuentes: [
        { label: 'GO TOKYO', url: 'https://www.gotokyo.org/en/spot/658/index.html' },
        { label: 'Wikipedia — Kintarō Hattori', url: 'https://en.wikipedia.org/wiki/Kintar%C5%8D_Hattori' },
      ],
    },
  ],
  akihabara: [
    {
      nombre: 'Akihabara ("Electric Town")',
      queEs: 'Barrio del centro de Tokio, primero el mayor hub de electrónica de Japón y hoy capital global de la cultura otaku (anime, manga, videojuegos retro, figuras, maid cafés). Los locales lo llaman "Akiba".',
      historia: `En 1869 un incendio arrasó la zona; los vecinos erigieron un santuario a una deidad del fuego llamada "Akiba". La estación abrió en 1890. Tras la 2ª Guerra Mundial surgió un mercado negro de componentes eléctricos (semilla del "Electric Town"); en los 50 se legalizó y vendió electrodomésticos; en los 80 se centró en ordenadores (primeros otaku); en los 90-2000 cedió espacio al anime/manga/videojuegos.`,
      significado: `Resume la trayectoria del Japón moderno: de la escasez posbélica al milagro económico y al poder cultural blando global del anime. El grupo idol AKB48 toma su nombre del barrio.`,
      datoCurioso: `El nombre "Akihabara" es un error burocrático fosilizado: el lugar se llamaba Akiba; al registrar la estación en 1890 lo transcribieron mal como "Akihabara". Los locales siguen diciendo "Akiba".`,
      fuentes: [
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3003.html' },
        { label: 'GO TOKYO', url: 'https://www.gotokyo.org/en/destinations/central-tokyo/akihabara/index.html' },
        { label: 'JNTO', url: 'https://www.japan.travel/en/spot/2178/' },
      ],
    },
  ],
  daikanyama: [
    {
      nombre: 'Daikanyama / Nakameguro y el río Meguro',
      queEs: 'Dos barrios adyacentes del suroeste de Tokio, epicentro de la cultura urbana cool, el diseño independiente y la gastronomía de autor. Daikanyama: lifestyle de lujo tranquilo; Nakameguro: orilla artística y bohemia del río Meguro.',
      historia: `Daikanyama significa "colina del inspector fiscal del shogunato" (la familia Asakura recaudaba impuestos Tokugawa allí); fue residencia samurái de élite (Kyu Asakura House, 1919, Bien Cultural Importante). En los 80, diseñadores y modelos lo poblaron. Nakameguro fue zona de fábricas textiles (los tintoreros lavaban sedas en el río Meguro); con el cierre de fábricas en los 90-2000, artistas lo colonizaron. Hitos: Daikanyama T-Site (Tsutaya, 2011, "una biblioteca en el bosque"); Starbucks Reserve Roastery de Kengo Kuma (2019, uno de solo 6 en el mundo). El río Meguro está flanqueado por ~800 cerezos Somei Yoshino plantados por voluntarios del barrio en 1927; uno de los lugares de hanami más fotografiados de Japón.`,
      significado: `Caso de gentrificación creativa muy estudiado: a diferencia de Shibuya o Harajuku, mantuvieron su escala humana y comercio independiente con proyección internacional.`,
      datoCurioso: `Los cerezos del río no los plantó el Gobierno, sino vecinos voluntarios en 1927. El mismo río donde se lavaban sedas industriales es hoy un escenario de primavera icónico — la transformación se produjo en una sola generación.`,
      fuentes: [
        { label: 'GO TOKYO — Nakameguro', url: 'https://www.gotokyo.org/en/destinations/southern-tokyo/nakameguro/index.html' },
        { label: 'GO TOKYO — Daikanyama', url: 'https://www.gotokyo.org/en/destinations/western-tokyo/daikanyama/index.html' },
        { label: 'JNTO — Meguro River', url: 'https://www.japan.travel/en/spot/377/' },
      ],
    },
  ],
  'kiyosumi-fukagawa': [
    {
      nombre: 'Jardín Kiyosumi (清澄庭園)',
      queEs: 'Jardín tradicional de estilo kaiyushiki ("paisaje de paseo") de ~81.000 m² en Koto, célebre por su gran estanque, tres islas y su colección de rocas traídas de todo Japón.',
      historia: `Terrenos del período Edo (⚠️ se cree que fueron del mercader Kinokuniya Bunzaemon, por tradición oral). Entre 1716-1736 un señor feudal formó el jardín básico. En 1878, Iwasaki Yatarō (fundador de Mitsubishi) lo adquirió y trajo 55 rocas enormes en los barcos de vapor de Mitsubishi desde todo el archipiélago. En 1923 sirvió de refugio en el Gran Terremoto de Kanto. La familia Iwasaki lo donó a Tokio en 1932 (abierto al público el 24 jul 1932).`,
      significado: `Exhibición del poder y el gusto de la era Meiji: Iwasaki usó la red logística de Mitsubishi para importar rocas únicas de toda la nación. Su rol como refugio en 1923 le dio un lugar en la memoria cívica de Tokio.`,
      datoCurioso: `Albergó una residencia de ladrillo estilo Tudor del arquitecto inglés Josiah Conder (el mismo del Rokumeikan), destruida en 1923. Su sendero de iso-watari (piedras al borde del agua) es de los mejores ejemplos en Tokio.`,
      fuentes: [
        { label: 'tokyo-park.or.jp', url: 'https://www.tokyo-park.or.jp/teien/en/kiyosumi/outline.html' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3034_006.html' },
      ],
    },
    {
      nombre: 'Fukagawa Edo Museum (深川江戸資料館)',
      queEs: 'Museo de historia local en Koto que reconstruye a escala real un barrio popular del Edo de hacia 1840; se pasea por calles, casas, una posada, una barcaza y una atalaya contra incendios.',
      historia: `Inaugurado en 1986. Alberga 11 edificios reconstruidos con técnicas de la época, a escala 1:1. El período representado (~1840) es el del Fukagawa histórico: braceros, barqueros, artesanos y comerciantes de madera — el corazón shitamachi del Edo popular.`,
      significado: `Complementa el gran Museo Edo-Tokio con un enfoque hiperlocal e inmersivo en la vida cotidiana de las clases trabajadoras, casi ausentes de los registros históricos de élite.`,
      datoCurioso: `La iluminación simula dinámicamente el paso del día (amanecer, mediodía, atardecer, noche): el mismo vecindario se ve a veces dorado y otras en penumbra nocturna.`,
      fuentes: [
        { label: 'GO TOKYO', url: 'https://www.gotokyo.org/en/spot/631/index.html' },
        { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Fukagawa_Edo_Museum' },
      ],
    },
    {
      nombre: 'Naritasan Fukagawa Fudō-dō (成田山深川不動堂)',
      queEs: 'Templo budista Shingon esotérico, betsuin (sucursal) del gran Naritasan Shinshō-ji de Narita, dedicado a Fudō Myō-ō (Acala), el Rey de la Sabiduría del Fuego.',
      historia: `El templo matriz de Narita se fundó en 940. La presencia en Fukagawa data de 1703, cuando la imagen sagrada de Naritasan se trasladó a Edo para una exposición especial; el entusiasmo popular creó una presencia permanente. El solar actual se cedió en 1878; el salón principal se completó en 1881. En 2011 se inauguró un nuevo salón con las paredes exteriores cubiertas de letras sánscritas metálicas del mantra de Fudō Myō-ō.`,
      significado: `Uno de los templos litúrgicamente más activos de Tokio: las ceremonias de fuego goma se celebran cinco veces al día (9, 11, 13, 15 y 17 h), convirtiéndolo en experiencia ritual viva.`,
      datoCurioso: `El corredor de oraciones alberga ~10.000 pequeños gorintō (pagodas de cinco anillos) de cristal. El salón custodia el Onegai Fudōson, una de las mayores estatuas de madera de Fudō Myō-ō de Japón.`,
      fuentes: [
        { label: 'Kanpai Japan', url: 'https://www.kanpai-japan.com/tokyo/naritasan-fukagawa-fudo-do' },
        { label: 'Wikipedia — Narita-san', url: 'https://en.wikipedia.org/wiki/Narita-san' },
      ],
    },
    {
      nombre: 'Tomioka Hachimangū (富岡八幡宮)',
      queEs: 'El mayor santuario dedicado a Hachiman (deidad de las artes marciales) de Tokio, en Fukagawa (Koto). Cuna del sumo profesional.',
      historia: `Fundado en 1627 sobre terreno ganado al mar, con patrocinio directo del shogunato Tokugawa. En 1684, el shogunato autorizó torneos anuales de kanjin-zumō (sumo benéfico) en sus terrenos, a cargo del exsamurái Ikazuchi Gondayu, que codificó las reglas, el dohyō y el sistema de ranking (banzuke) vigentes hoy. Se celebraron aquí ~100 años, hasta el traslado a Ryōgoku.`,
      significado: `Reconocido como el lugar de nacimiento del sumo profesional organizado (ōzumō) en Edo. Cuando un luchador es promovido a yokozuna, realiza su ritual de entrada al ring (dohyō-iri) en este santuario.`,
      datoCurioso: `En 1900 erigió una Piedra de los Yokozuna (3,5 m, 20 toneladas) con los nombres de cada gran campeón. Posee además un mikoshi valorado en más de 1.000 millones de yenes, decorado con oro, diamantes y rubíes.`,
      fuentes: [
        { label: 'Ficha histórica oficial (PDF)', url: 'http://www.tomiokahachimangu.or.jp/pdf/A%20Long%20and%20Illustrious%20History.pdf' },
        { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Tomioka_Hachiman_Shrine' },
      ],
    },
  ],
  odaiba: [
    {
      nombre: 'Estatua de la Libertad + Rainbow Bridge',
      queEs: 'Réplica permanente de la Estatua de la Libertad (escala 1:7) frente al Rainbow Bridge, uno de los encuadres fotográficos más icónicos de Tokio.',
      historia: `En 1998, por el "Año de Francia en Japón", Francia prestó la estatua original de la Île des Cygnes de París (única vez que salió de Francia), expuesta en Odaiba hasta enero de 1999. Por su éxito, Tokio encargó una réplica permanente, inaugurada el 22 dic 2000. El Rainbow Bridge se inauguró el 26 ago 1993 (798 m, torres de 126 m), transportando autopista, carretera, el monorraíl Yurikamome y peatones en dos niveles.`,
      significado: `El Rainbow Bridge hizo posible Odaiba como destino público: convirtió un islote industrial en distrito de ocio y medios. Sin él, no existirían el Fuji TV, la Estatua ni el Odaiba actual.`,
      datoCurioso: `El nombre "Rainbow Bridge" se eligió por concurso público de sugerencias ciudadanas — el nombre oficial japonés ("Puente de conexión del puerto de Tokio") no lo usa nadie.`,
      fuentes: [
        { label: 'GO TOKYO', url: 'https://www.gotokyo.org/en/spot/363/index.html' },
        { label: 'Wikipedia — Île aux Cygnes', url: 'https://en.wikipedia.org/wiki/%C3%8Ele_aux_Cygnes' },
        { label: 'Shutoko — Rainbow Bridge', url: 'https://www.shutoko.co.jp/en/index/driving/explore/rainbowbridge/overview/' },
      ],
    },
    {
      nombre: 'Fuji TV Building (フジテレビ本社ビル)',
      queEs: 'Sede de la cadena Fuji TV, reconocible por la gran esfera de titanio suspendida entre sus dos torres.',
      historia: `Arquitecto: Kenzō Tange (uno de sus últimos grandes proyectos antes de morir en 2005). Construido entre mayo de 1993 y junio de 1996; Fuji TV se trasladó aquí el 10 mar 1997. 25 plantas, 123,45 m. La esfera Hachitama (32 m de diámetro, titanio, 1.350 toneladas) está suspendida a 100 m entre las dos torres; alberga un observatorio.`,
      significado: `Fuji TV es una de las cinco cadenas nacionales y emisora histórica de anime global (One Piece, Dragon Ball Z). El edificio catalizó la transformación de Odaiba de zona industrial a distrito mediático.`,
      datoCurioso: `Izar y fijar la esfera (1.350 t a 100 m entre dos torres asimétricas) fue un desafío de ingeniería que se convirtió en caso de estudio, con cálculos propios de ingeniería aeroespacial.`,
      fuentes: [
        { label: 'Web oficial', url: 'https://www.fujitv.com/about/about-our-building/' },
        { label: 'Britannica', url: 'https://www.britannica.com/topic/Fuji-TV-Headquarters-Building' },
        { label: 'architecture-tokyo.com', url: 'https://architecture-tokyo.com/2017/05/21/1996-fuji-television-kenzo-tange/' },
      ],
    },
  ],
  // ──────────────────── TAKARAGAWA + KANAZAWA ────────────────────
  'takaragawa-onsen': [
    {
      nombre: 'Takaragawa Onsen — Ryokan Ōsenkaku (宝川温泉)',
      queEs: 'Ryokan tradicional (ikkengyokan, único establecimiento en su manantial) en un valle cerrado de Gunma, con cuatro enormes piscinas al aire libre (rotenburo) sobre las orillas del río Takaragawa. También funciona como balneario de día (higaeri).',
      historia: `Fundación del ryokan Ōsenkaku en 1923 (Taisho 12). ⚠️ Algunas guías en inglés citan "1940" por error: ese año es la construcción del primer gran rotenburo (Maka-no-Yu), no la fundación. En 1955, el edificio principal actual; en 1970, la apertura del Maya-no-Yu (único baño exclusivo para mujeres). El río Takaragawa ("río del tesoro") debe su nombre a la minería de cobre en sus orillas desde el período Edo. Los cuatro baños suman ~470 tatami (~850-900 m²); caudal natural de 1.800 litros/min de cuatro manantiales propios.`,
      significado: `Ejemplo paradigmático de tres categorías culturales: hikyō onsen ("manantial secreto remoto"), ikkengyokan (una sola familia custodia el manantial) y konyoku (baño mixto tradicional, muy reducido tras las reformas Meiji de 1868). El JTB lo describe como "pionero del boom de los onsen secretos de Japón".`,
      datoCurioso: `Hacia 2005, pilotos y azafatas en escala en Narita lo descubrieron y lo difundieron por sus redes profesionales internacionales, antes de cualquier cobertura editorial en inglés. En 2014, el baño Kodakara-no-Yu fue escenario de rodaje de Thermae Romae II.`,
      fuentes: [
        { label: 'Web oficial', url: 'https://www.takaragawa.com/e_onsen.html' },
        { label: 'JNTO Japan Bucket List', url: 'https://www.japan.travel/en/de/japanbucketlist/takaragawa-onsen/' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e7463.html' },
        { label: 'Visit Gunma', url: 'https://www.visit-gunma.jp/en/spots/takaragawa-onsen-osenkaku/' },
      ],
    },
  ],
  'higashi-chaya': [
    {
      nombre: 'Higashi Chaya (東茶屋街)',
      queEs: 'El mayor de los tres distritos históricos de casas de té (chayamachi) de Kanazawa, al este del río Asano. Un ochaya no es una cafetería: es un local exclusivo donde geiko (geishas de Kanazawa) entretienen con danza, canto y shamisen.',
      historia: `En 1820 (Bunsei 3), el daimio Maeda Narinaga otorga autorización oficial y consolida aquí las casas de geiko de la ciudad. El 14 nov 2001 fue designado Distrito de Preservación de Grupos de Edificios Tradicionales de Importancia (máxima categoría nacional), el primero de este tipo en Ishikawa. Conserva su trazado de 1820: ~140 edificios en 1,8 ha. La Ochaya Shima (~1830) es Bien Cultural Importante Nacional y hoy museo.`,
      significado: `Uno de los tres únicos distritos de casas de té de Japón con designación patrimonial nacional (con Gion en Kioto y Kazuemachi en la propia Kanazawa). Inseparable de la riqueza del Dominio de Kaga, el feudo más rico de Japón fuera del shogunato. Los ochaya activos aplican ichigensan okotowari (no se admite a nuevos clientes sin presentación de un habitual).`,
      datoCurioso: `La celosía de madera de las fachadas (kimusuko, "jaula de insectos") tiene listones trapezoidales que crean visión unidireccional: desde dentro se ve la calle; desde la calle, el interior queda oculto. En el Edo, solo las casas de geiko podían tener dos plantas en Kanazawa.`,
      fuentes: [
        { label: 'Ayuntamiento de Kanazawa', url: 'https://www4.city.kanazawa.lg.jp/soshikikarasagasu/bunkazaihogoka/gyomuannai/3/1/1/siteibunkazai/7/5808.html' },
        { label: 'JNTO', url: 'https://www.japan.travel/en/spot/1405/' },
        { label: 'Visit Kanazawa', url: 'https://visitkanazawa.jp/en/attractions/detail_10212.html' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e4206.html' },
      ],
    },
  ],
  kenrokuen: [
    {
      nombre: 'Kenroku-en (兼六園)',
      queEs: 'Jardín histórico del período Edo de 11,4 ha, jardín exterior del Castillo de Kanazawa, desarrollado por los daimios Maeda durante más de dos siglos. Uno de los "Tres Grandes Jardines de Japón".',
      historia: `En 1676, el quinto daimio Maeda Tsunanori construye la casa Renchiochin con su jardín (núcleo inicial); en 1759 un gran incendio lo destruye casi por completo y en 1774 empieza la restauración. En 1822, el duodécimo daimio Maeda Narinaga lo amplía; el nombre lo inspira el clásico chino "Crónicas de los Famosos Jardines de Luoyang": Ken-roku-en = jardín que "posee juntos los seis" atributos (amplitud, recogimiento, artificiosidad, antigüedad, agua y vistas panorámicas), agrupados en tres pares de contrarios. Apertura pública oficial el 7 may 1874. Contiene ~8.750 árboles de 183 especies.`,
      significado: `Su hazaña teórica es reunir los seis atributos a la vez, cuando los tres pares se excluyen mutuamente. Es también un monumento de ingeniería hidráulica: su canal de alimentación (s. XVII) recorre más de 10 km desde el río Saigawa y sigue funcionando.`,
      datoCurioso: `Su fuente (1861) es la más antigua de Japón que funciona por presión natural: opera mediante sifón inverso (el estanque Kasumigaike está más alto que la salida), sin mecanismo alguno; brota a ~3,5 m. Se diseñó para probar el abastecimiento de agua al castillo.`,
      fuentes: [
        { label: 'Web oficial Prefectura de Ishikawa', url: 'https://www.pref.ishikawa.jp/siro-niwa/kenrokuen/e/' },
        { label: 'Visit Kanazawa', url: 'https://visitkanazawa.jp/en/attractions/detail_10106.html' },
        { label: 'JNTO', url: 'https://www.japan.travel/en/japans-local-treasures/kenrokuen-garden/' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e4200.html' },
      ],
    },
  ],
  'kanazawa-castillo': [
    {
      nombre: 'Castillo de Kanazawa (金沢城)',
      queEs: 'Castillo construido por el clan Maeda en 1583 sobre el solar de un templo budista, sede del dominio feudal más rico de Japón fuera del shogunato durante casi 300 años. Hoy parque público con edificios reconstruidos con técnicas tradicionales.',
      historia: `En 1583, Maeda Toshiie establece el castillo como sede del Dominio de Kaga (1.000.000 de koku declarados, el feudo más rico tras el shogunato). En 1602 un rayo destruye la torre de seis plantas y los Maeda deciden no reconstruirla (decisión política para no provocar al shogunato Tokugawa): no volvió a tener torre principal en toda la era Edo. Tras sucesivos incendios (1631, 1759, 1808, 1881) sobreviven la Puerta Ishikawa-mon (1788, Bien Cultural Importante) y dos almacenes. Entre 1949 y 1996 el solar albergó la Universidad de Kanazawa; desde 2001 se reconstruyen torres, almacenes y puertas con técnicas tradicionales.`,
      significado: `Símbolo del poder que financió toda la cultura de Kanazawa (Noh, cerámica Kutani, textiles Kaga Yuzen, Kenroku-en, las geiko). Sus tejados llevan tejas de plomo (namari-gawara): la oxidación les da con el tiempo un color blanco plateado característico.`,
      datoCurioso: `A diferencia de Himeji o Matsumoto, Kanazawa nunca tuvo torre principal visible durante el Edo: la Ley de Un Castillo por Dominio (1615) y la vigilancia sobre el clan más rico hacían que una gran torre se interpretara como amenaza militar.`,
      fuentes: [
        { label: 'Parque del Castillo (Prefectura de Ishikawa)', url: 'https://shiro-niwa.pref.ishikawa.lg.jp/kanazawa-castle/en/' },
        { label: 'Historia oficial', url: 'https://shiro-niwa.pref.ishikawa.lg.jp/kanazawa-castle/en/about/history.php' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e4202.html' },
        { label: 'Visit Kanazawa', url: 'https://visitkanazawa.jp/en/attractions/detail_10060.html' },
      ],
    },
  ],
  nagamachi: [
    {
      nombre: 'Nagamachi y Casa Nomura (長町・野村家)',
      queEs: 'Nagamachi es el barrio donde residían los samuráis de rango medio-alto del clan Maeda. La Casa Nomura es la única residencia samurái visitable del barrio, con jardín, sala de té y arquitectura shoin-zukuri de la era Edo.',
      historia: `Kanazawa fue en el s. XVIII la ciudad más grande de Japón fuera de Edo, Kioto y Osaka (más de 100.000 hab.). Nagamachi conserva muros de barro (dobei), el canal histórico Ōnosho (más de 400 años) y calles laberínticas defensivas; en invierno los muros se cubren con esteras de paja (komokake). La familia Nomura sirvió a los Maeda doce generaciones; tras la Restauración Meiji (1868) y la abolición del sistema samurái tuvo que vender la propiedad. ⚠️ El edificio actual no está en su ubicación original y su célebre artesonado de ciprés se incorporó desde otra residencia Edo en la restauración Meiji (composición auténtica de elementos de época). En 2003 el Journal of Japanese Gardening clasifica su jardín entre los tres mejores de Japón; en 2009 obtiene 2 estrellas Michelin (Green Guide).`,
      significado: `Permite leer la estratificación social del Edo en el espacio urbano (contraste con las viviendas austeras de los ashigaru, en el Museo Ashigaru del barrio). La Casa Nomura ilustra la fragilidad del poder samurái tras Meiji.`,
      datoCurioso: `El canal Ōnosho (más de 400 años) discurre literalmente bajo la terraza de la casa y sigue en uso activo como drenaje y suministro del barrio.`,
      fuentes: [
        { label: 'Web oficial Casa Nomura', url: 'https://nomurake.com' },
        { label: 'Visit Kanazawa — Nagamachi', url: 'https://visitkanazawa.jp/en/attractions/detail_10195.html' },
        { label: 'Visit Kanazawa — Casa Nomura', url: 'https://visitkanazawa.jp/en/attractions/detail_50073.html' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e4204.html' },
      ],
    },
  ],
  omicho: [
    {
      nombre: 'Mercado Ōmichō (近江町市場)',
      queEs: 'Red de calles cubiertas con ~170 tiendas en 2,8 ha, el mayor mercado de alimentación fresca de Kanazawa y principal proveedor de pescado del Mar del Japón de la prefectura.',
      historia: `Fundación oficial en 1721 (Kyōhō 6) al consolidarse mercados dispersos en la ubicación actual (el 300 aniversario se celebró en 2021); como antecedente, un incendio de 1690 fusiona y reubica dos mercados de pescado. Durante el Edo fue proveedor oficial (gozensho) del castillo y el Dominio de Kaga. En 1904 se registra oficialmente el nombre "Ōmichō Ichiba" (por los mercaderes de la provincia de Ōmi que se asentaron). En 2009 se añade un edificio moderno anexo (73 tiendas más).`,
      significado: `Su apodo oficial es "la cocina de los ciudadanos de Kanazawa". Por la mañana abastece a los hogares; al mediodía se llena de visitantes que comen kaisendon. Producto estrella de invierno: la centolla de nieve Kanou Kani y el Nodoguro (mero de garganta negra).`,
      datoCurioso: `La kobako gani (hembra de la centolla de nieve de Ishikawa) tiene temporada legal de exactamente 54 días al año (6 nov – 29 dic), fijada por ordenanza coincidiendo con el inicio tradicional del invierno (Rittō). Fuera de esa ventana, no existe legalmente en el comercio.`,
      fuentes: [
        { label: 'Web oficial del mercado', url: 'https://ohmicho-ichiba.com/' },
        { label: 'JNTO', url: 'https://www.japan.travel/en/spot/1398/' },
        { label: 'Visit Kanazawa', url: 'https://visitkanazawa.jp/en/spot/detail_10030.html' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e4207.html' },
      ],
    },
  ],
  // ──────────────────── TAKAYAMA + SHIRAKAWA-GO ────────────────────
  'sanmachi-suji': [
    {
      nombre: 'Sanmachi Suji (三町筋)',
      queEs: 'Conjunto de calles históricas en el corazón de Takayama que conserva la atmósfera de la ciudad mercantil de la era Edo, con casas de madera, destilerías de sake centenarias y tiendas artesanales en activo.',
      historia: `Se desarrolló durante el período Edo (1603–1868) como centro comercial y artesanal de Hida. Takayama prosperó por sus reservas de ciprés hinoki y pino, maderas muy demandadas en Edo. El barrio tiene la designación nacional de Distrito de Preservación de Grupos de Edificios Tradicionales (la figura más alta de protección urbana de Japón). ⚠️ Ninguna fuente precisa una fecha puntual de fundación del barrio mercantil; solo el rango s. XVII-XIX.`,
      significado: `Uno de los pocos centros urbanos de época Edo que sobrevivió sin incendios ni modernización, y sin museificarse: las destilerías de sake siguen en funcionamiento. Para JNTO es "lo más parecido al período Edo fuera de una serie histórica de televisión".`,
      datoCurioso: `El sugidama (bola de ramas de cedro) colgado en cada destilería indica el estado del sake: verde = recién elaborado; marrón = añejo. Los viajeros del Edo usaban este código visual para elegir qué comprar.`,
      fuentes: [
        { label: 'JNTO — Sanmachi', url: 'https://www.japan.travel/en/spot/152/' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e5903.html' },
      ],
    },
  ],
  'miyagawa-asaichi': [
    {
      nombre: 'Mercados matutinos — Miyagawa Asaichi (宮川朝市)',
      queEs: 'Mercado matutino diario de ~350 m a orillas del río Miyagawa (entre los puentes Kajibashi y Yayoibashi); uno de los mercados de mañana más grandes de Japón, en activo desde principios del s. XIX.',
      historia: `Nació a comienzos del s. XIX como mercado de morera (para la sericultura), dentro del recinto del templo Takayama Betsuin; se asentó en su ubicación actual hacia 1960. El otro mercado de Takayama —Jinya-mae Asaichi, frente a la Jinya— tiene origen aún más antiguo (más de 300 años).`,
      significado: `Tradición de comercio agrícola que ha sobrevivido a supermercados y turismo. Sus principios: chisan chishō ("producido y consumido localmente") y seguridad alimentaria. ~60 puestos con verduras de temporada, encurtidos caseros y artesanía como las muñecas sarubobo y las tallas ichii ittō-bori.`,
      datoCurioso: `En el mercado Jinya-mae rige una regla no escrita: solo los propios agricultores pueden vender, garantizando contacto directo productor-comprador, algo casi inexistente hoy en Japón.`,
      fuentes: [
        { label: 'Hida Takayama Tourism (oficial)', url: 'https://www.hida.jp/english/touristattractions/takayamacity/historyandculture/4000162.html' },
        { label: 'Asaichi.net (oficial)', url: 'https://www.asaichi.net/language/english.html' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e5907.html' },
      ],
    },
  ],
  'takayama-jinya': [
    {
      nombre: 'Takayama Jinya (高山陣屋)',
      queEs: 'Residencia administrativa y sede de gobierno de la era Edo; el único edificio principal de su tipo (de ~60 que existieron en Japón) que se conserva intacto. Hoy museo.',
      historia: `Origen en 1615 (residencia del clan Kanamori, señores de Hida). En 1692 el shogunato Tokugawa toma el control directo de Hida, expulsa a los Kanamori y establece la jinya como sede del gobernador. Durante 176 años (1692–1868), 25 generaciones de gobernadores administraron justicia, fiscalidad y gestión forestal. En uso oficial hasta 1969; monumento histórico nacional en 1929; restaurado a su aspecto Edo en 1996.`,
      significado: `El shogunato tomó Hida por sus enormes bosques de hinoki y pino, indispensables para construir en Edo — demasiado valiosos para un señor local. La Jinya es el símbolo del poder central sobre los recursos naturales en el Japón feudal. Su granero de arroz (s. XVII) es el mayor granero tradicional de arroz de Japón.`,
      datoCurioso: `Conserva una sala de interrogatorios (gōmon-ba) con instrumental y disposición originales — recordatorio de que la justicia Edo era expeditiva y las confesiones (a menudo bajo presión) eran prueba definitiva.`,
      fuentes: [
        { label: 'Web oficial (Prefectura de Gifu)', url: 'https://jinya.gifu.jp/en/about/' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e5902.html' },
      ],
    },
  ],
  'shirakawago-ogimachi': [
    {
      nombre: 'Shirakawa-go — aldea de Ogimachi (白川郷・荻町)',
      queEs: 'Aldea en un valle alpino del río Shō (Gifu) con la mayor concentración del mundo de casas gasshō-zukuri, inscrita en la Lista del Patrimonio Mundial UNESCO en 1995 junto con Gokayama (Toyama).',
      historia: `Ogimachi agrupa unas 59 casas gasshō-zukuri en activo. Distrito de Preservación desde 1976; inscripción UNESCO el 9 dic 1995 (criterios C(iv) y C(v): arquitectura vernácula sobresaliente y asentamiento humano excepcional adaptado a su entorno). Las casas más antiguas superan los 250 años; algunas (Wada, Nagase) son visitables.`,
      significado: `El gasshō-zukuri es una respuesta al entorno: tejados a dos aguas con pendiente de 60° para que la nieve (hasta 4 m) resbale; los desvanes amplios servían para criar gusanos de seda con el calor del hogar. Gasshō ("manos en oración") describe el tejado como palmas juntas. La comunidad se rige por tres principios voluntarios: "No vender, no alquilar, no destruir". El retechado colectivo (yui) es testimonio vivo de solidaridad comunitaria.`,
      datoCurioso: `Retechar una sola casa requiere 200–300 personas y puede llevar un día entero; los vecinos se turnan sin cobro (yui), transmitiendo además el conocimiento técnico a los jóvenes.`,
      fuentes: [
        { label: 'Asociación de Turismo (oficial)', url: 'https://shirakawa-go.gr.jp/en/highlights/' },
        { label: 'JNTO — Shirakawa-go y Gokayama', url: 'https://www.japan.travel/en/world-heritage/the-historic-villages-of-shirakawa-go-and-gokayama/' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e5950.html' },
      ],
    },
  ],
  'hida-no-sato': [
    {
      nombre: 'Hida no Sato — Hida Folk Village (飛騨の里)',
      queEs: 'Museo al aire libre (1971) que reúne más de 30 edificios tradicionales de la región de Hida, trasladados desde sus emplazamientos originales a un entorno de 54.000 m² a las afueras de Takayama.',
      historia: `Todos los edificios son del período Edo (1603–1868), con 100–500 años de antigüedad. Se concibió como respuesta a la pérdida de patrimonio rural en la modernización de los años 60; varias casas gasshō-zukuri proceden de Shirakawa-go, trasladadas antes de su protección oficial. Incluye residencia del jefe de aldea, cabañas de madereros, graneros y casas con interiores originales (telares, utensilios, herramientas de sericultura).`,
      significado: `A diferencia de Shirakawa-go (casas habitadas), aquí se accede al interior completo de los edificios y sus contenidos, explicando la vida cotidiana alpina preindustrial. Es el complemento pedagógico ideal: allá el conjunto vivo en su paisaje, aquí cada tipo de construcción en detalle.`,
      datoCurioso: `Cada mañana se encienden los hogares interiores (irori): el humo no es teatro, es el sistema de preservación de vigas y paja del tejado, igual que en las casas reales. El museo es literalmente "vivo": sin ese humo, las estructuras se deteriorarían.`,
      fuentes: [
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e5901.html' },
        { label: 'Wikipedia — Hida Minzoku Mura', url: 'https://en.wikipedia.org/wiki/Hida_Minzoku_Mura_Folk_Village' },
      ],
    },
  ],
  // ───────────────────────────── KIOTO ─────────────────────────────
  toji: [
    {
      nombre: 'Tō-ji (東寺) · UNESCO',
      queEs: 'Templo budista Shingon (esotérico) fundado en el límite sur de la antigua capital; el único de los grandes templos originales de Heiankyo que sigue en pie. Su pagoda de cinco pisos es la más alta de Japón en madera.',
      historia: `Fundado en 796, dos años tras convertirse Heiankyo (Kioto) en capital. En 823 el Emperador Saga lo donó al monje Kūkai (Kōbō Daishi), fundador del Shingon, que inició la pagoda en 826. La pagoda ardió cuatro veces; la actual es de 1644 (Edo). El complejo original ocupaba cuatro veces la superficie actual.`,
      significado: `Centro vivo del budismo Shingon con continuidad desde el s. IX. Su Salón Kōdō alberga 21 estatuas dispuestas como un mandala tridimensional (representación física del cosmos budista). Custodia más de 20.000 tesoros nacionales y propiedades culturales.`,
      datoCurioso: `El día 21 de cada mes se celebra el mercadillo Kōbō-san, que conmemora la muerte de Kōbō Daishi, de forma ininterrumpida desde hace más de 700 años — uno de los mercados tradicionales más antiguos del mundo.`,
      fuentes: [
        { label: 'Web oficial Tō-ji', url: 'https://toji.or.jp/en/' },
        { label: 'UNESCO 688', url: 'https://whc.unesco.org/en/list/688/' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3919.html' },
        { label: 'JNTO', url: 'https://www.japan.travel/en/world-heritage/historic-monuments-of-ancient-kyoto/' },
      ],
    },
  ],
  'kioto-estacion': [
    {
      nombre: 'Higashi Honganji (東本願寺)',
      queEs: 'Templo cabecera de la rama Shinshu Otani-ha del budismo Jōdo Shinshū (Tierra Pura). Su Salón Goei-dō es una de las estructuras de madera más grandes del planeta.',
      historia: `Linaje desde 1272 (capilla funeraria de Shinran). El templo actual fue creado en 1602 por Tokugawa Ieyasu, que dividió la influyente secta Jōdo Shinshū en dos ramas rivales para reducir su poder. Destruido por incendios cuatro veces; edificio actual completado en 1895 (Meiji). El Goei-dō mide 76 × 58 × 38 m.`,
      significado: `Uno de los ejemplos más impresionantes de arquitectura religiosa de madera del mundo. Su escisión ordenada por Ieyasu refleja cómo el poder político manipuló la religión. No es UNESCO (sí su "gemelo" Nishi Honganji, a 700 m).`,
      datoCurioso: `En la reconstrucción de 1895 no había cuerdas comerciales lo bastante resistentes para izar los maderos: miles de devotas donaron su cabello y se fabricaron 53 cuerdas de cabello humano. Una de 69 m y 375 kg se conserva en una vitrina del recinto.`,
      fuentes: [
        { label: 'Web oficial', url: 'https://english.higashihonganji.or.jp/history/' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3920.html' },
        { label: 'Atlas Obscura', url: 'https://www.atlasobscura.com/places/hair-rope-of-higashi-honganji-temple' },
      ],
    },
    {
      nombre: 'Nishi Honganji (西本願寺) · UNESCO',
      queEs: 'Templo cabecera de la rama Honganji-ha del Jōdo Shinshū, la secta budista con más seguidores de Japón.',
      historia: `Linaje desde 1272. El abad Rennyo expandió el movimiento; Oda Nobunaga asedió su fortaleza-templo de Ishiyama once años (1569–1580). La ubicación actual se fijó en 1591 (terreno donado por Toyotomi Hideyoshi). Estructuras del Azuchi-Momoyama y Edo temprano, con siete Tesoros Nacionales.`,
      significado: `Cumbre de la arquitectura religiosa Momoyama. UNESCO (componente n.º 14), inscrito 1994. Alberga el Karamon (puerta del Castillo de Fushimi, trasladada en 1632) y el pabellón Hiunkaku.`,
      datoCurioso: `Una réplica a 4/5 de escala del Karamon, hecha para la Exposición Japón-Gran Bretaña de Londres de 1910, se conserva hoy en los Jardines de Kew (Londres).`,
      fuentes: [
        { label: 'Web oficial', url: 'https://www.hongwanji.kyoto/en/' },
        { label: 'UNESCO 688', url: 'https://whc.unesco.org/en/list/688/' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3920.html' },
      ],
    },
    {
      nombre: 'Kyoto Tower (京都タワー)',
      queEs: 'Torre mirador modernista de 131 m frente a la Estación de Kioto (1964), el edificio más alto de la ciudad.',
      historia: `Proyectada por Mamoru Yamada, inaugurada el 28 dic 1964 (año de los JJOO de Tokio), sobre el solar de la antigua Oficina Central de Correos. Mirador a 100 m. Estructura de anillos de acero apilados; resiste vientos de hasta 324 km/h.`,
      significado: `Encarna la tensión de Kioto entre pasado y modernidad. Su inauguración fue polémica (oposición ciudadana por intrusión en el paisaje histórico); con el tiempo pasó de controversia a icono.`,
      datoCurioso: `Su forma evoca una vela japonesa (faro de bienvenida para los viajeros del tren). El japonólogo Alex Kerr la llamó "una estaca clavada en el corazón" de la antigua capital.`,
      fuentes: [
        { label: 'Web oficial', url: 'https://www.kyoto-tower.com/about' },
        { label: 'Kyoto Station Guide', url: 'https://www.kyotostation.com/kyoto-tower/' },
      ],
    },
  ],
  'kiyomizu-dera': [
    {
      nombre: 'Kiyomizu-dera (清水寺) · UNESCO',
      queEs: 'Templo budista del s. VIII en la ladera del monte Otowa, célebre por su plataforma de madera sobre el vacío, construida sin un solo clavo metálico.',
      historia: `Fundado en 778 por el monje Kenshin; primer pabellón formal en 798. El edificio actual fue reconstruido en 1631-1633 por orden del shogun Tokugawa Iemitsu; el pabellón principal es Tesoro Nacional. El manantial Otowa se divide en tres canales (longevidad, amor, estudios). UNESCO (componente n.º 4), 1994.`,
      significado: `La plataforma (butai) se alza ~13 m sobre el bosque, sostenida por 18 pilares de zelkova de más de 400 años ensamblados con la técnica kakezukuri sin clavos. Ejemplo supremo de arquitectura sagrada integrada en el paisaje.`,
      datoCurioso: `En el Edo se creía que sobrevivir al salto desde la plataforma concedía un deseo. Se documentan 234 saltos (supervivencia ~85% gracias a los árboles). Se prohibió en 1872. De ahí el dicho "saltar desde el escenario de Kiyomizu" (tomar una gran decisión).`,
      fuentes: [
        { label: 'Web oficial', url: 'http://www.kiyomizudera.or.jp/en/learn/' },
        { label: 'UNESCO 688', url: 'https://whc.unesco.org/en/list/688/' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3901.html' },
      ],
    },
  ],
  'higashiyama-sannenzaka': [
    {
      nombre: 'Sannenzaka (産寧坂) y Ninenzaka (二年坂)',
      queEs: 'Dos calles adoquinadas en pendiente de Higashiyama, parte de la ruta de peregrinaje a Kiyomizu-dera; el tramo de arquitectura tradicional de madera mejor conservado de Kioto (machiya del Edo).',
      historia: `Ninenzaka se sitúa en 807 y Sannenzaka en 808, con el establecimiento de la ruta devocional a Kannon. El 4 sep 1976 fueron declaradas el primer Distrito de Preservación Importante de Grupos de Edificios Tradicionales de Japón (modelo replicado en 129 distritos). Prohíbe vehículos y cableado aéreo.`,
      significado: `El nombre real de Sannenzaka es Sanneizaka ("colina del parto sereno"), por las embarazadas que subían a rezar a Kannon. No son UNESCO, pero tienen protección patrimonial propia.`,
      datoCurioso: `Existe la leyenda de que quien tropieza en estas calles "morirá en tres años" (Sannenzaka) o "en dos" (Ninenzaka). En Ninenzaka, un Starbucks ocupa una casa de té (sukiya) de más de 100 años, con tatami y vigas vistas.`,
      fuentes: [
        { label: 'Japan-guide.com — Higashiyama', url: 'https://www.japan-guide.com/e/e3959.html' },
        { label: 'JNTO', url: 'https://www.japan.travel/en/destinations/kansai/kyoto/gion-and-higashiyama/' },
        { label: 'Kyoto.travel', url: 'https://kyoto.travel/en/areas/gion-kiyomizu/' },
      ],
    },
  ],
  gion: [
    {
      nombre: 'Gion (祇園) y Hanami-kōji (花見小路)',
      queEs: 'El barrio histórico de Kioto por excelencia, nacido como ciudad-puerta del santuario Yasaka y transformado en el Edo en el distrito de entretenimiento más refinado del país. Hanami-kōji es su calle vertebral, con las ochaya más exclusivas.',
      historia: `Nace frente al Santuario Yasaka (más de 1.000 años). En 1872, para reactivar Kioto tras el traslado de la capital a Tokio, nace el Miyako Odori (danzas públicas de las geiko, cada abril desde entonces). En 1881 se divide en Gion Kōbu y Gion Higashi. Kioto tiene cinco hanamachi (Gokagai); hoy hay ~70 geiko y 30 maiko solo en Gion Kōbu. No es UNESCO.`,
      significado: `En Kioto las artistas consumadas se llaman geiko (no geisha) y las aprendices maiko. Las maiko se distinguen por kimono de manga larga (furisode), obi darari hasta el suelo, zuecos altos (okobo) y, el primer año, solo el labio inferior pintado. Las ochaya siguen el sistema ichigensan okotowari.`,
      datoCurioso: `Desde 2019, ciertos callejones privados de Gion están cerrados al público (primera restricción así en Kioto) por la saturación turística; fotografiar geiko/maiko sin permiso está prohibido. Una velada con geiko ronda los 50.000 yenes por artista más cubierto.`,
      fuentes: [
        { label: 'Japan-guide — Gion', url: 'https://www.japan-guide.com/e/e3902.html' },
        { label: 'Japan-guide — Geiko y Maiko', url: 'https://www.japan-guide.com/e/e2102.html' },
        { label: 'Kyoto.travel — Gion Manner', url: 'https://kyoto.travel/en/responsible-travel/gion-manner-message-from-southern-gionmachi/' },
      ],
    },
  ],
  'fushimi-inari': [
    {
      nombre: 'Fushimi Inari Taisha (伏見稲荷大社)',
      queEs: 'Gran santuario sintoísta dedicado al dios Inari, cabeza de los más de 30.000 santuarios Inari de Japón. Célebre por los miles de torii bermellones que forman túneles por el monte Inari.',
      historia: `Fundado en 711 (anterior a Kioto como capital, 794). En 927 ya figuraba en el Engishiki como santuario de alto rango. La puerta principal (Rōmon) es de 1589 (donación de Toyotomi Hideyoshi). La práctica de donar torii se consolidó en el Edo, especialmente para pedir prosperidad en los negocios.`,
      significado: `Inari es la deidad del arroz, la fertilidad y el comercio. Los ~10.000 torii del monte (233 m) son ofrendas votivas acumuladas durante siglos; cada uno lleva grabado el nombre del donante y la fecha. Los zorros (kitsune) son los mensajeros divinos de Inari.`,
      datoCurioso: `El tsujiura senbei (galleta con mensaje) que se vende allí se considera uno de los posibles antecedentes del fortune cookie occidental.`,
      fuentes: [
        { label: 'Historia oficial', url: 'https://inari.jp/en/history/' },
        { label: 'Senbon Torii (oficial)', url: 'https://inari.jp/en/map/spot_07/' },
        { label: 'JNTO', url: 'https://www.japan.travel/en/spot/1128/' },
      ],
    },
  ],
  arashiyama: [
    {
      nombre: 'Bosque de Bambú de Sagano (嵯峨野竹林)',
      queEs: 'Sendero de ~400 m que atraviesa un denso bambusal en Sagano (oeste de Kioto), una de las imágenes más reconocibles de Japón.',
      historia: `Arashiyama es lugar de retiro aristocrático desde el período Heian (794–1185). El sendero discurre tras el templo Tenryū-ji y está declarado Lugar de Belleza Escénica. El patrón regular del bambú indica cultivo deliberado; los artesanos locales lo trabajan desde hace siglos.`,
      significado: `Toda la zona Arashiyama-Sagano concentra templos y villas imperiales. El sonido del viento entre las cañas figura en la lista de los 100 Paisajes Sonoros de Japón del Ministerio de Medio Ambiente. ⚠️ La inclusión exacta del bambusal de Sagano en esa lista no se confirmó en fuente oficial directa.`,
      datoCurioso: `Pese a sus ~400 m, la sensación de inmersión total lo ha hecho uno de los escenarios más fotografiados de Asia.`,
      fuentes: [
        { label: 'JNTO', url: 'https://www.japan.travel/en/spot/1141/' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3912.html' },
        { label: 'Kyoto.travel', url: 'https://kyoto.travel/en/areas/saga-arashiyama/' },
      ],
    },
    {
      nombre: 'Tenryū-ji (天龍寺) · UNESCO',
      queEs: 'El templo zen más importante de Arashiyama, cabeza de los Cinco Grandes Templos de Kioto (Kyoto Gozan) y sede principal de la escuela Rinzai. Su jardín de estanque es de los más célebres de Japón.',
      historia: `Fundado en 1339 por el shōgun Ashikaga Takauji en memoria del Emperador Go-Daigo, con Musō Soseki como abad fundador (consagrado 1345). Sufrió ocho grandes incendios; la mayoría de estructuras actuales son Meiji. UNESCO desde 1994.`,
      significado: `Culminación de la arquitectura y jardinería zen del Muromachi. Su jardín usa shakkei (paisaje prestado), integrando las montañas de Arashiyama como parte de la composición — principio muy influyente.`,
      datoCurioso: `Para financiar su construcción se organizaron expediciones comerciales a China, los Tenryūji-bune ("barcos de Tenryū-ji"): un templo budista patrocinando directamente el comercio internacional, caso único.`,
      fuentes: [
        { label: 'Web oficial', url: 'https://www.tenryuji.com/en/about/' },
        { label: 'UNESCO 688', url: 'https://whc.unesco.org/en/list/688/' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3913.html' },
      ],
    },
    {
      nombre: 'Puente Togetsukyō (渡月橋)',
      queEs: 'Puente de 155 m sobre el río Katsura en Arashiyama, símbolo del barrio.',
      historia: `Primer puente aquí en 836 (Heian). El nombre Togetsu ("cruce de la luna") viene de una exclamación poética del Emperador Kameyama (s. XIII). La estructura actual es de 1934: pese a su apariencia de madera, sus pilares y vigas son de hormigón armado; solo las barandillas son de ciprés.`,
      significado: `Eje visual y funcional de Arashiyama, con una de las panorámicas más célebres de Kioto. En agosto, el ritual Mantō Nagashi llena el río de linternas flotantes.`,
      datoCurioso: `Pocos visitantes saben que el puente "tradicional" es de hormigón desde 1934.`,
      fuentes: [
        { label: 'JNTO', url: 'https://www.japan.travel/en/spot/72/' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3912.html' },
        { label: 'Kyoto.travel', url: 'https://kyoto.travel/en/destinations/togetsukyo-bridge/' },
      ],
    },
  ],
  kinkakuji: [
    {
      nombre: 'Kinkaku-ji — Pabellón Dorado (金閣寺) · UNESCO',
      queEs: 'Templo zen Rinzai cuyo pabellón, recubierto de pan de oro, se refleja en el estanque Kyōko-chi. Nombre oficial: Rokuon-ji.',
      historia: `El shōgun Ashikaga Yoshimitsu lo construyó como villa de retiro desde 1397; tras su muerte se convirtió en templo zen. Combina tres estilos por piso (aristocrático shinden, samurái bukke y sala zen china). En julio de 1950 un monje de 21 años lo incendió por completo (suceso ficcionalizado por Yukio Mishima en El pabellón de oro, 1956). Reconstruido en 1955. UNESCO desde 1994.`,
      significado: `Encarna la "Cultura Kitayama" del Muromachi: fusión de lo cortesano, lo samurái y lo zen. Los tres estilos por piso son una declaración de que todas las tradiciones confluyen.`,
      datoCurioso: `Es probablemente la imagen de Japón más fotografiada del mundo. La destrucción de 1950 y la reconstrucción de 1955 son parte inseparable de su historia y del significado de la novela de Mishima.`,
      fuentes: [
        { label: 'Web oficial (Shokoku-ji)', url: 'https://www.shokoku-ji.jp/en/kinkakuji/about/' },
        { label: 'UNESCO 688', url: 'https://whc.unesco.org/en/list/688/' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3908.html' },
      ],
    },
    {
      nombre: 'Ryōan-ji — Jardín Zen de Piedras (龍安寺) · UNESCO',
      queEs: 'Templo zen (Myōshin-ji/Rinzai) famoso por su jardín kare-sansui: 15 piedras sobre gravilla blanca rastrillada, sin una sola planta. El jardín zen más célebre del mundo.',
      historia: `Villa aristocrática Heian convertida en templo zen en 1450. La fecha exacta y el autor del jardín son desconocidos. El muro de barro ocre (siglos de aceite de colza absorbido) forma parte de la composición. UNESCO desde 1994.`,
      significado: `En apenas 25 × 10 m, ha influido en el diseño y el pensamiento estético mundial. Las 15 piedras se agrupan de modo que desde cualquier punto al menos una queda oculta; según la tradición zen, solo quien alcanza la iluminación las ve todas.`,
      datoCurioso: `La Reina Isabel II lo visitó en 1975 y, impresionada, pidió una réplica en Buckingham. La puerta este (reservada a enviados imperiales) se abrió especialmente para ella.`,
      fuentes: [
        { label: 'Web oficial', url: 'http://www.ryoanji.jp/smph/eng/garden/index.html' },
        { label: 'UNESCO 688', url: 'https://whc.unesco.org/en/list/688/' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3909.html' },
      ],
    },
  ],
  nijo: [
    {
      nombre: 'Castillo Nijō (二条城) · UNESCO',
      queEs: 'Castillo-palacio en el centro de Kioto, residencia oficial del shogunato Tokugawa en la ciudad imperial. Sus palacios son los mejores ejemplos conservados de arquitectura palacial feudal japonesa.',
      historia: `Mandado construir en 1603 por Tokugawa Ieyasu; ampliado por Iemitsu (1624–1626) para la visita del Emperador Go-Mizuno-o. El 13 oct 1867, el último shōgun Yoshinobu anunció aquí la devolución del poder al Emperador — fin del período Edo (264 años). UNESCO desde 1994.`,
      significado: `Único castillo donde se proclamó tanto el inicio (1603) como el fin (1867) de todo un período histórico. Sus salas de tatami y puertas pintadas son paradigma del arte Momoyama y primer Edo.`,
      datoCurioso: `El Palacio Ninomaru tiene "suelos ruiseñor" (uguisubari): tablones diseñados para crujir al pisarlos, como medida de seguridad contra intrusos. Es imposible caminar en silencio.`,
      fuentes: [
        { label: 'Web oficial', url: 'https://nijo-jocastle.city.kyoto.lg.jp/introduction/highlights/history/?lang=en' },
        { label: 'UNESCO 688', url: 'https://whc.unesco.org/en/list/688/' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3918.html' },
      ],
    },
  ],
  nishiki: [
    {
      nombre: 'Mercado Nishiki (錦市場)',
      queEs: 'Pasaje comercial cubierto de ~390 m (3-5 m de ancho) con más de cien tiendas de gastronomía de Kioto. Conocido como Kyoto no daidokoro ("la cocina de Kioto").',
      historia: `Existía ya en el Heian; el nombre Nishikichō está documentado desde 1054. En 1615 el shogunato reconoció oficialmente a tres mayoristas de pescado, marcando su inicio formal. Pervivió gracias al "agua de Nishiki": agua subterránea a 15-18 °C constante todo el año que permitía conservar pescado sin refrigeración (cada tienda tenía pozos propios).`,
      significado: `Memoria gastronómica viva de la cocina kyo-ryori: verduras kyō-yasai, pescado del lago Biwa, hamo, yuba, fu, encurtidos y dulces tradicionales. Restaurantes de alta cocina y vecinos del barrio compran aquí desde hace siglos.`,
      datoCurioso: `La calle se llamaba Gusoku-koji antes de ~1054. El apodo "cocina de Kioto" no tiene autor ni fecha: ya circulaba durante el auge del Edo.`,
      fuentes: [
        { label: 'Historia oficial', url: 'https://www.kyoto-nishiki.or.jp/en/about/' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e3931.html' },
        { label: 'JNTO', url: 'https://www.japan.travel/en/spot/1174/' },
      ],
    },
  ],
  // ──────────────────────── NARA + OSAKA ────────────────────────
  'nara-todaiji': [
    {
      nombre: 'Tōdai-ji y el Gran Buda (東大寺・大仏) · UNESCO',
      queEs: 'Templo budista del s. VIII y sede del Gran Buda de bronce sedente más grande de Japón, alojado en el Daibutsu-den, uno de los mayores edificios de madera del mundo.',
      historia: `Orígenes en Kinshō-ji (728). En 743 el emperador Shōmu ordenó la imagen colosal del Buda Vairocana; la estatua se completó en 749 y el Gran Pabellón en 751 (consagración en 752). El monje Gyōki organizó donaciones populares (~2,6 millones de personas). El Daibutsu-den actual es del Edo (finales s. XVII): 57 × 50,5 × 48,7 m, pero solo dos tercios del tamaño original. El Gran Buda mide ~14,98 m sentado (orejas de 2,54 m). UNESCO desde 1998 ("Monumentos Históricos de la Antigua Nara").`,
      significado: `Concebido como cabeza de todos los templos provinciales de Japón, encarna la unificación espiritual del país bajo el budismo en la era Nara (710-784). La capital se trasladó en 784 en parte para reducir su enorme influencia política.`,
      datoCurioso: `El Daibutsu-den actual ya es solo el 67% del edificio original del s. VIII — el original era una estructura de madera de dimensiones casi inimaginables para la época.`,
      fuentes: [
        { label: 'Web oficial Tōdai-ji', url: 'https://www.todaiji.or.jp/en/history/narajidai/' },
        { label: 'Daibutsu-den (oficial)', url: 'https://www.todaiji.or.jp/en/information/daibutsuden/' },
        { label: 'JNTO', url: 'https://www.japan.travel/en/spot/1009/' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e4100.html' },
      ],
    },
    {
      nombre: 'Parque de Nara y los ciervos sika (奈良公園・鹿)',
      queEs: 'Gran parque público (~660 ha) donde deambulan libres ~1.400 ciervos sika protegidos como Monumentos Naturales del Estado.',
      historia: `La veneración del ciervo se remonta al s. VIII (fundación de Kasuga Taisha, 768): según la tradición, un dios llegó a Nara montado en un ciervo blanco. Matar un ciervo fue durante siglos delito castigado con la muerte. La población lleva más de 1.400 años separada genéticamente de sus ancestros salvajes.`,
      significado: `Los ciervos son mensajeros de los kami en la cosmovisión sintoísta local. Su convivencia con turistas y ciudad es un caso único de coexistencia entre lo sagrado, lo natural y lo cotidiano.`,
      datoCurioso: `Los ciervos aprendieron a hacer una reverencia (inclinar la cabeza) para pedir las galletas shika senbei — comportamiento transmitido culturalmente entre generaciones.`,
      fuentes: [
        { label: 'Visitnara.jp — ciervos sagrados', url: 'https://www.visitnara.jp/venues/S01487/' },
        { label: 'Visitnara.jp — conservación', url: 'https://www.visitnara.jp/lists-and-stories/story/deer-conservation-protecting-naras-sacred-messengers/' },
        { label: 'JNTO', url: 'https://www.japan.travel/en/destinations/kansai/nara/nara-park-and-around/' },
      ],
    },
    {
      nombre: 'Kōfuku-ji y su pagoda de cinco pisos (興福寺・五重塔)',
      queEs: 'Templo budista del clan Fujiwara (s. VII), que llegó a tener más de 150 edificios. Su pagoda de cinco pisos es el segundo edificio de madera más alto de Japón.',
      historia: `Orígenes en 669; se reubicó en Nara en 710 bajo Fujiwara no Fuhito. La pagoda (original de 730) ha ardido cinco veces; la actual es de 1426, 50,1 m. UNESCO (Monumentos de Nara, 1998). ⚠️ Nota: la pagoda está en restauración integral de julio 2023 a marzo 2034.`,
      significado: `Templo familiar del clan Fujiwara, la casa aristocrática dominante en los períodos Nara y Heian. Su Museo de Tesoros Nacionales alberga la célebre estatua de Ashura (tres rostros, seis brazos).`,
      datoCurioso: `La pagoda ha ardido y se ha reconstruido exactamente cinco veces; la actual (1426) ha sobrevivido seis siglos, más que ninguna anterior.`,
      fuentes: [
        { label: 'Web oficial Kōfuku-ji', url: 'https://www.kohfukuji.com/english/e006/' },
        { label: 'JNTO', url: 'https://www.japan.travel/en/spot/1012/' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e4101.html' },
        { label: 'UNESCO 870', url: 'https://whc.unesco.org/en/list/870' },
      ],
    },
    {
      nombre: 'Kasuga Taisha (春日大社)',
      queEs: 'Gran santuario sintoísta (768), tutelar del clan Fujiwara, famoso por sus más de 3.000 linternas de piedra y bronce.',
      historia: `Fundado en 768 por la emperatriz Shōtoku, con la capital de Nara. Santuario protector de los Fujiwara. Más de 2.000 linternas de piedra y más de 1.000 de bronce, muchas donadas por fieles (incluidos samuráis del período de los Estados Combatientes). Se encienden solo dos veces al año (festival Mantōrō, febrero y agosto, celebrado más de 800 años). UNESCO desde 1998 (con el bosque primigenio de Kasugayama).`,
      significado: `Vínculo entre el poder imperial-aristocrático y el sintoísmo. El bosque sagrado de Kasugayama lleva más de 1.000 años como zona prohibida, uno de los bosques primigenios mejor conservados de Japón.`,
      datoCurioso: `Tiene 62 santuarios auxiliares en sus terrenos y ~3.000 santuarios dependientes por todo Japón.`,
      fuentes: [
        { label: 'Web oficial', url: 'https://www.kasugataisha.or.jp/en/about_en/' },
        { label: 'JNTO', url: 'https://www.japan.travel/en/spot/1013/' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e4102.html' },
      ],
    },
  ],
  naramachi: [
    {
      nombre: 'Naramachi (ならまち)',
      queEs: 'Barrio histórico al sur del templo Gangō-ji que conserva el tejido urbano y las casas-tienda (machiya) de los mercaderes de Nara (Edo y Meiji).',
      historia: `Floreció como distrito comercial desde el s. XV. Las machiya son estrechas de fachada y profundas porque los impuestos se calculaban por el ancho de fachada. Incluye el templo Gangō-ji (orígenes en el Asukadera, el templo budista más antiguo de Japón, trasladado a Nara en 718; también UNESCO).`,
      significado: `Frente al Nara imperial y religioso, Naramachi muestra el Nara cotidiano de los s. XVIII-XIX: artesanos, comerciantes y fabricantes de sake. Es uno de los pocos tejidos urbanos premodernos casi intactos de Japón.`,
      datoCurioso: `En las fachadas cuelgan figuras de tela rojas, sarubobo (monos amuleto / "migawari-zaru"), que según la tradición atraen hacia sí las desgracias que afectarían a la familia.`,
      fuentes: [
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e4108.html' },
        { label: 'JNTO', url: 'https://www.japan.travel/en/spot/2001/' },
        { label: 'Visitnara.jp', url: 'https://www.visitnara.jp/destinations/area/naramachi/' },
      ],
    },
  ],
  dotonbori: [
    {
      nombre: 'Dōtonbori y el Glico Man (道頓堀・グリコサイン)',
      queEs: 'Canal y calle comercial de Namba, corazón del ocio y la gastronomía de Osaka. El Glico Man es el gran cartel luminoso de Ezaki Glico, el símbolo fotográfico de la ciudad.',
      historia: `El canal se excavó en 1612 por Doton Yasui (de quien toma el nombre). Desde el s. XVII, la orilla sur fue el principal distrito de teatros (kabuki, bunraku). El primer cartel del Glico Man se instaló en 1935; la generación actual (la 6ª) es de 2014 con tecnología LED.`,
      significado: `Encarna el kuidaore ("arruinarse comiendo"). Escaparate de la identidad gastronómica y lúdica de Osaka (takoyaki, okonomiyaki, fugu, ramen). Los carteles 3D gigantes (el cangrejo del Kani Doraku, el pulpo, el Glico Man) son su lenguaje visual.`,
      datoCurioso: `Lanzarse al canal desde el puente Ebisubashi para celebrar victorias deportivas (sobre todo de los Hanshin Tigers) tiene nombre propio: tobikomi. Está prohibido, sin mucho éxito.`,
      fuentes: [
        { label: 'OSAKA-INFO', url: 'https://osaka-info.jp/en/spot/dotonbori/' },
        { label: 'JNTO', url: 'https://www.japan.travel/en/spot/2207/' },
        { label: 'Glico (historia corporativa)', url: 'https://www.glico.com/global/100th_history_contents/highlight/company/1933-1945.html' },
      ],
    },
    {
      nombre: 'Hōzen-ji y Hōzenji Yokocho (法善寺・法善寺横丁)',
      queEs: 'Pequeño templo budista de 1637 y el estrecho callejón empedrado que lo rodea, lleno de restaurantes y bares tradicionales, a metros de Dōtonbori.',
      historia: `Templo construido en 1637 (secta jōdo); venera a Fudō Myōō. Acogió rakugo y kabuki. El callejón se formó orgánicamente con puestos para peregrinos. Templo y callejón fueron destruidos en los bombardeos de la 2ª Guerra Mundial y reconstruidos; un incendio en 2002 dañó el callejón, reconstruido tras una petición de 300.000 firmas. Bien Cultural Tangible de Registro Nacional desde 1997.`,
      significado: `Reducto de la Osaka antigua rodeado de modernidad. La estatua de Fudō Myōō está cubierta de musgo porque generaciones de fieles la riegan al rezar (mizukake): el musgo es la sedimentación física de la devoción popular.`,
      datoCurioso: `La estatua no se ve: está completamente oculta bajo el musgo acumulado en casi cuatro siglos (varios centímetros de espesor).`,
      fuentes: [
        { label: 'JNTO — Hōzen-ji', url: 'https://www.japan.travel/en/spot/1109/' },
        { label: 'JNTO — Hōzenji Yokocho', url: 'https://www.japan.travel/en/spot/1108/' },
        { label: 'OSAKA-INFO', url: 'https://osaka-info.jp/en/spot/hozenji-yokocho/' },
      ],
    },
  ],
  'katsuo-ji': [
    {
      nombre: 'Katsuo-ji (勝尾寺) — templo de los daruma',
      queEs: 'Templo budista del s. VIII en las laderas de Minoh (norte de Osaka), famoso como el "templo de los daruma de la victoria". Estación nº 23 de la peregrinación Saigoku (los 33 templos Kannon más antiguos de Japón, ~1.000 km por Kansai).',
      historia: `Según las crónicas del templo, hacia 727 (Nara) los hermanos Zenchū y Zensan construyeron una ermita; la fundación formal se sitúa hacia 775, cuando el príncipe Kaisei (hijo del emperador Kōnin) consagró la sala Miroku-ji. En 880 el abad Gyōjun rezó por la curación del emperador Seiwa; sanado, el emperador quiso llamarlo Katsuō-ji ("templo que vence al rey"), pero el abad lo juzgó presuntuoso y cambió el carácter de "rey" por el de "cola", preservando la pronunciación. Destruido en la guerra Genpei (1184) y reconstruido en 1188. Sitio Histórico Nacional desde 1966. Recinto de ~260.000 m² en el Parque Cuasi-Nacional Meiji no Mori Minoo.`,
      significado: `Gira en torno al kanji katsu ("vencer"): no derrotar al otro, sino superar los propios miedos y debilidades (matiz budista). Los miles de Kachi-daruma ("daruma de la victoria") por todo el recinto son el símbolo: se compra un daruma, se escribe un propósito y se pinta un ojo como voto; al cumplirlo, se pinta el otro ojo y se devuelve al templo. El daruma representa a Bodhidharma, fundador del Zen.`,
      datoCurioso: `Ofrece el único omikuji (oráculo) con forma de daruma y los 64 hexagramas del I Ching del mundo: en vez de "buena/mala suerte", da una orientación filosófica.`,
      fuentes: [
        { label: 'OSAKA-INFO', url: 'https://osaka-info.jp/en/spot/katsuoji/' },
        { label: 'Good Luck Trip', url: 'https://www.gltjp.com/en/article/item/21264/' },
        { label: 'Web oficial del templo', url: 'https://katsuo-ji-temple.or.jp' },
        { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Katsu%C5%8D-ji' },
      ],
    },
  ],
  'osaka-castillo': [
    {
      nombre: 'Castillo de Osaka (大阪城)',
      queEs: 'Fortaleza del s. XVI construida por Toyotomi Hideyoshi como centro del Japón reunificado. El símbolo histórico de Osaka.',
      historia: `Construcción desde 1583 por Hideyoshi sobre el solar del Ishiyama Hongan-ji. En 1615 los Tokugawa lo atacaron y destruyeron, extinguiendo el linaje Toyotomi. Reconstruido por los Tokugawa en los años 1620; la torre fue alcanzada por un rayo en 1665 y no se reconstruyó en el período feudal. La torre actual es de hormigón armado (1931). En 2025 abrió el Museo de los Muros de Piedra Toyotomi (muros originales del s. XVI). Los fosos y muros de piedra son en gran parte originales del Edo.`,
      significado: `Condensa la transición decisiva de Japón: fin de las guerras civiles, unificación por Hideyoshi y victoria Tokugawa (250 años de paz Edo). Monumento a la ambición, la guerra civil y el poder.`,
      datoCurioso: `La torre actual tiene ascensor y museo, pero los muros y fosos son del s. XVII. En excavaciones bajo el patio se hallaron los muros de la fortaleza original de Hideyoshi, enterrados por los propios Tokugawa al reconstruir.`,
      fuentes: [
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e4000.html' },
        { label: 'OSAKA-INFO', url: 'https://osaka-info.jp/en/discover-kansai/osaka-castle/' },
        { label: 'JNTO', url: 'https://www.japan.travel/en/spot/1087/' },
      ],
    },
  ],
  kuromon: [
    {
      nombre: 'Mercado Kuromon (黒門市場)',
      queEs: 'Mercado cubierto de ~580 m con ~150 puestos, "la cocina de Osaka", abastecedor histórico de restaurantes y cocinas de la ciudad.',
      historia: `Orígenes hacia 1822-1823, cuando comerciantes se congregaron junto a las puertas negras (kuromon) del templo Enmyō-ji en Nipponbashi para vender pescado. El templo y el mercado fueron destruidos en el Gran Incendio de Namba (1912), pero el mercado se reconstruyó. Hoy recibe ~18.000 visitantes en día laborable (hasta 150.000 en fin de año).`,
      significado: `Tradición gastronómica de una ciudad definida por su comida (kuidaore). A diferencia de mercados turistificados, sigue siendo proveedor activo de restaurantes reales de Osaka.`,
      datoCurioso: `El nombre no viene de un producto, sino literalmente de la puerta negra del templo budista Enmyō-ji que se alzaba allí; el templo desapareció pero la puerta dio nombre al barrio.`,
      fuentes: [
        { label: 'Web oficial del mercado', url: 'https://kuromon.com/en/history-en/' },
        { label: 'OSAKA-INFO', url: 'https://osaka-info.jp/en/spot/kuromon-market/' },
        { label: 'JNTO', url: 'https://www.japan.travel/en/spot/1103/' },
      ],
    },
  ],
  shinsekai: [
    {
      nombre: 'Shinsekai y la torre Tsūtenkaku (新世界・通天閣)',
      queEs: 'Barrio retro-urbano nacido en 1903 como parque de atracciones inspirado en París y Coney Island, con la torre Tsūtenkaku (103 m) como hito central. Imagen de la Osaka popular y trabajadora.',
      historia: `Desarrollado en 1903 con la 5ª Exposición Industrial Nacional. El diseño dividía el barrio en dos: norte estilo París, sur estilo Coney Island (con el parque Luna Park). La primera Tsūtenkaku (1912, 64 m) fusionaba la Torre Eiffel sobre el Arco de Triunfo; fue la estructura más alta del Oriente. Desmantelada en la 2ª Guerra Mundial (metales donados al esfuerzo bélico) y reconstruida en 1956 (103 m). En la torre vive el Billiken, estatua de la suerte llegada también en 1912.`,
      significado: `Reverso popular de la Osaka del Castillo y Dōtonbori. Primer barrio de atracciones planificado del Japón moderno; tras décadas de decadencia, hoy renace como destino retro. Sus restaurantes de kushikatsu (¡sin mojar dos veces en la salsa!) son patrimonio gastronómico.`,
      datoCurioso: `La primera Tsūtenkaku (1912) —Torre Eiffel sobre Arco de Triunfo— fue tan literal que causó perplejidad en la prensa internacional; su barrio imitaba París al norte y Coney Island al sur (la fascinación del Japón Meiji por "inventar Occidente").`,
      fuentes: [
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e4012.html' },
        { label: 'OSAKA-INFO — Shinsekai', url: 'https://osaka-info.jp/en/spot/shinsekai/' },
        { label: 'JNTO — Tsūtenkaku', url: 'https://www.japan.travel/en/spot/1100/' },
      ],
    },
    {
      nombre: 'Shitennō-ji (四天王寺)',
      queEs: 'Templo budista fundado en 593 por el Príncipe Shōtoku; considerado el primer templo budista construido y patrocinado oficialmente por el Estado japonés.',
      historia: `Fundado en 593 por el Príncipe Shōtoku, figura central en la introducción oficial del budismo. Anterior en más de un siglo a los grandes templos de Nara. Su planta (pagoda, Kondō y Kōdō alineados en eje sur-norte, rodeados de un corredor) es el prototipo shitennōji-shiki garan, el layout de templo más antiguo de Japón. Ha sido reconstruido fielmente tras incendios y guerras durante 14 siglos (edificios actuales de la era Shōwa). El nombre alude a los Cuatro Reyes Celestiales (Shitennō).`,
      significado: `Punto cero del budismo como institución de Estado en Japón. Su fundación precede a la Constitución de los Diecisiete Artículos del propio Shōtoku (604) y a la capital de Nara (710).`,
      datoCurioso: `Pese a ser el templo budista estatal más antiguo, durante más de 1.300 años no estuvo adscrito a ninguna secta: convivían y se estudiaban las ocho principales escuelas del budismo, algo sin equivalente en la historia religiosa de Japón.`,
      fuentes: [
        { label: 'OSAKA-INFO', url: 'https://osaka-info.jp/en/spot/shitennoji/' },
        { label: 'Japan-guide.com', url: 'https://www.japan-guide.com/e/e4011.html' },
        { label: 'JNTO', url: 'https://www.japan.travel/en/spot/1087/' },
      ],
    },
  ],
  // ──────────────────────────── HIROSHIMA ────────────────────────────
  // NOTA: el dossier docs/contexto-itinerario/ aún no incluye hiroshima.md.
  // Estas fichas se han volcado del doc verificado docs/barrios-otras-ciudades/
  // hiroshima.md; sustitúyanse cuando exista la ficha oficial del dossier.
  'hiroshima-paz': [
    {
      nombre: 'Parque Memorial de la Paz (平和記念公園)',
      queEs: 'Gran explanada conmemorativa en el antiguo centro de Hiroshima, dedicada a la memoria de las víctimas de la bomba atómica del 6 de agosto de 1945 y al llamamiento por la paz.',
      historia: `Trazado sobre la zona arrasada por la bomba. Reúne el Cenotafio —un arco bajo el que descansa el registro con más de 220.000 nombres de víctimas—, la Llama de la Paz y el Monumento a los Niños de la Paz, inspirado en Sadako Sasaki y sus grullas de papel. Entrada gratuita; abierto siempre.`,
      significado: `El eje visual entre el Cenotafio y la Cúpula de la Bomba Atómica es la imagen icónica de la ciudad y uno de los espacios de memoria más impactantes del mundo.`,
      datoCurioso: `El Monumento a los Niños de la Paz nace de la historia de Sadako Sasaki, que plegó grullas de papel mientras enfermaba de leucemia por la radiación; hoy llegan grullas de todo el mundo.`,
      fuentes: [
        { label: 'Japan Guide — Peace Memorial Park & Museum', url: 'https://www.japan-guide.com/e/e3400.html' },
        { label: 'Peace Tourism Hiroshima (oficial)', url: 'https://peace-tourism.com/en/spot/entry-40.html' },
      ],
    },
    {
      nombre: 'Museo de la Paz de Hiroshima (広島平和記念資料館)',
      queEs: 'Museo dedicado a documentar el bombardeo atómico, sus consecuencias humanitarias y el contexto histórico; uno de los museos más impactantes del mundo.',
      historia: `Compuesto por el Edificio Este y el Edificio Principal. Combina el relato del contexto histórico con historias personales de supervivientes y objetos de las víctimas. ⚠️ Horarios y precios de 2026: verificar para 2027 en hpmmuseum.jp.`,
      significado: `Su recorrido convierte la tragedia en un alegato universal contra las armas nucleares; visita imprescindible para entender la memoria del siglo XX en Japón.`,
      datoCurioso: `Conviene reservar online la primera hora del día (o los últimos 90 min) para recorrerlo sin multitudes.`,
      fuentes: [
        { label: 'Japan Guide — Peace Memorial Park & Museum', url: 'https://www.japan-guide.com/e/e3400.html' },
        { label: 'Peace Tourism Hiroshima (oficial)', url: 'https://peace-tourism.com/en/spot/entry-40.html' },
      ],
    },
    {
      nombre: 'Cúpula de la Bomba Atómica (原爆ドーム) · UNESCO',
      queEs: 'Ruinas del antiguo Pabellón de Promoción Industrial de la Prefectura de Hiroshima, la única estructura que quedó en pie cerca del epicentro de la explosión. Patrimonio Mundial UNESCO.',
      historia: `La bomba detonó casi sobre el edificio el 6 de agosto de 1945; su esqueleto y la cúpula resistieron en vertical mientras todo el entorno quedaba arrasado. Se conservó deliberadamente como recordatorio. Acceso libre por el exterior, 24 h.`,
      significado: `Símbolo mundial de la devastación nuclear y de la voluntad de paz; su silueta es inseparable de la identidad de Hiroshima.`,
      datoCurioso: `Es uno de los pocos vestigios que se decidió NO reconstruir, precisamente para preservar la memoria de lo ocurrido.`,
      fuentes: [
        { label: 'Japan Guide — Peace Memorial Park & Museum', url: 'https://www.japan-guide.com/e/e3400.html' },
        { label: 'Peace Tourism Hiroshima (oficial)', url: 'https://peace-tourism.com/en/spot/entry-40.html' },
      ],
    },
  ],
}

/** Devuelve las fichas de contexto de una zona, o undefined si no hay. */
export function getContext(zoneId: string): readonly ContextEntry[] | undefined {
  return context[zoneId]
}
