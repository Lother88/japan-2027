/**
 * Contexto cultural por zona — volcado del dossier docs/contexto-itinerario/v2/.
 *
 * Contenido NARRATIVO (qué es · historia · significado · curiosidades · fuentes),
 * separado del modelo anti-spoiler: `Zone` NO tiene `description` (NOSPOIL-01) y
 * los pasos del día solo dan lugar + acción u hora (NOSPOIL-04). Esto vive aparte y se
 * muestra en la sección colapsable "El lugar" de cada zona.
 *
 * key = Zone.id (ver src/data/zones.ts). Cada zona puede tener varios POIs.
 * Fuente única: docs/contexto-itinerario/v2/*.md (sin inventar). Solo contenido
 * verificado: lo marcado con ⚠️ en el dossier se ha omitido. Las fuentes en japonés
 * ([JA]) van primero. No se enlaza hidanosato-tpo.jp (ya no es la web del museo).
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
  /** Significado / por qué importa (alguna subentrada no lo tiene) */
  readonly significado?: string
  /** Curiosidades verificadas (normalmente 2–4) */
  readonly curiosidades: readonly string[]
  /** Fuentes con URL ([JA] primero) */
  readonly fuentes: readonly ContextSource[]
}

export const context: Record<string, readonly ContextEntry[]> = {
  kanda: [
    {
      nombre: 'Kanda Myōjin (神田明神) y el Kanda Matsuri (神田祭)',
      queEs: 'Santuario sintoísta cuyo nombre oficial es Kanda Jinja (神田神社). Fue el «guardián general de Edo» (江戸総鎮守) y es el ujigami (deidad tutelar) de 108 barrios del centro de Tokio: Kanda, Nihonbashi, Ōtemachi-Marunouchi, Akihabara y los mercados de pescado. Sus tres deidades son Daikoku (大己貴命), Ebisu (少彦名命) y el guerrero Taira no Masakado (平将門命).',
      historia: 'Según la tradición del santuario, lo fundó en 730 (Tenpyō 2) un clan de origen Izumo en la aldea de Shibasaki, cerca del actual montículo de Masakado en Ōtemachi. Masakado se rebeló contra la corte y llegó a proclamarse «Nuevo Emperador» (新皇) en 939; murió en combate el 14 del segundo mes de 940. Según el santuario, los desastres que se atribuían a su espíritu llevaron al monje Shinkyō (真教) a apaciguarlo, y en 1309 (Enkyō 2) se le incorporó como deidad. Con la ampliación del castillo de Edo, el santuario se trasladó en 1616 a su emplazamiento actual, en el «kimon» (表鬼門): la dirección nordeste, considerada nefasta, que debía proteger el castillo. En 1874, con motivo de la visita del emperador Meiji, Masakado fue apartado de la sala principal a un santuario anexo, porque se le consideraba un rebelde. No volvió a la sala principal hasta 1984. La sala actual es de 1934. Se hizo con estructura de acero y hormigón armado lacada en bermellón, algo pionero para la época, y por eso resistió los bombardeos de 1945 casi sin daños. La puerta Zuishinmon, de ciprés hinoki, es de mediados de los años setenta: el santuario da 1975 en una página y 1976 en otra.',
      significado: 'El Kanda Matsuri es uno de los tres grandes festivales de Edo (江戸三大祭, según la NDL); el santuario lo presenta incluso como uno de los «tres grandes festivales de Japón». Se le llamaba «festival bajo el cielo» (天下祭, tenka matsuri) porque el shogunato lo reconocía oficialmente. Sus palanquines y carrozas entraban en el castillo de Edo por la puerta Tayasu-mon, y el shōgun y las damas del palacio interior presenciaban el desfile. Por ser tan fastuoso, desde 1681 el shogunato lo alternó con el Sannō Matsuri del santuario Hie, y de ahí viene su ritmo bienal. Los años impares se celebra el gran festival (本祭), con el desfile Shinkōsai (神幸祭) y la entrada en el santuario de los mikoshi de los barrios (神輿宮入). Los años pares hay solo una versión menor (陰祭): el propio santuario confirma que en 2026 no hay desfile ni entrada de mikoshi. 2027 es año de gran festival.',
      curiosidades: [
        'Fechas del festival y el viaje. En 2025 el desfile Shinkōsai (por Kanda, Nihonbashi, Ōtemachi-Marunouchi y Akihabara) fue el sábado 10 de mayo y la entrada de mikoshi, el domingo 11. El rito principal (例大祭) es siempre el 15 de mayo. El 15 de mayo de 2027 cae en sábado, así que el fin de semana grande podría ser el 8–9 de mayo (coincidiría con el viaje) o el 15–16. Hay que consultarlo en kandamatsuri.com cuando se publique. Dato histórico: hasta 1892 el festival se celebraba en septiembre del calendario antiguo. Según la tradición del santuario, Ieyasu ganó en Sekigahara (1600) precisamente el día del festival, el 15 del noveno mes, y por eso los Tokugawa lo consideraron de buen augurio.',
        'Fíjate en los komainu. Los perros-león guardianes que flanquean la sala se colocaron con la reconstrucción posterior al terremoto de 1923. El santuario los describe como «muy raros» porque miran de frente al visitante, y no hacia el centro del camino como es habitual.',
        'Un detective de ficción con monumento. Busca la estela de Zenigata Heiji (銭形平次の碑), el policía protagonista de las novelas de Nomura Kodō, que vivía «en Kanda Myōjin-shita». Tiene forma de moneda Kan\'ei Tsūhō, el arma que el personaje lanzaba. Cerca están la estatua de Daikoku de piedra más grande de Japón, según el santuario, y una Ebisu que cruza el mar escoltada por criaturas marinas.',
        'Masakado, entre la historia y el miedo. La cabeza de Masakado se venera en el montículo Masakado-zuka, en Ōtemachi (将門塚), que es Bien Cultural de Tokio. Según la leyenda, la cabeza expuesta en Kioto no cerraba los ojos y rechinaba los dientes clamando venganza (Taiheiki, según Kotobank). El santuario vende amuletos «para alejar desgracias» bajo su protección y también un amuleto de tecnologías de la información (IT御守), muy propio de un santuario vecino de Akihabara.',
      ],
      fuentes: [
        { label: 'Kanda Myōjin — 神田明神とは (deidades e historia)', url: 'https://www.kandamyoujin.or.jp/profile/' },
        { label: 'Kanda Myōjin — 境内図 (recinto: komainu, Zenigata Heiji, Daikoku)', url: 'https://www.kandamyoujin.or.jp/keidai/' },
        { label: 'Kanda Myōjin — Programa del Kanda Matsuri 2025 y aviso de 陰祭 2026', url: 'https://www.kandamyoujin.or.jp/kandamatsuri/' },
        { label: 'Kanda Myōjin — Festivales anteriores (天下祭, 日本三大祭)', url: 'https://www.kandamyoujin.or.jp/kandasai/' },
        { label: 'NDL — 神田明神 (1616, 江戸三大祭, alternancia desde 1681, ruta por el castillo)', url: 'https://www.ndl.go.jp/landmarks/sights/kandamyojin' },
        { label: 'NDL Image Bank — 神田祭 (天下祭, entrada al castillo, cambio a mayo en 1892)', url: 'https://www.ndl.go.jp/imagebank/column/kandamatsuri' },
        { label: 'Kotobank — 平将門 (fechas de la rebelión y leyenda de la cabeza)', url: 'https://kotobank.jp/word/%E5%B9%B3%E5%B0%86%E9%96%80-92776' },
        { label: 'Gendai Business — 神田祭の祭神不明の過去 (Masakado retirado y restituido en 1984)', url: 'https://gendai.media/articles/-/64550' },
        { label: 'Kanda Myōjin — What\'s KANDAMYOUJIN? (amuletos)', url: 'https://www.kandamyoujin.or.jp/what/' },
      ],
    },
  ],
  'palacio-imperial': [
    {
      nombre: 'Palacio Imperial — Jardín Este (皇居東御苑)',
      queEs: 'Jardín anexo al Palacio Imperial que ocupa parte del honmaru, el ninomaru y el sannomaru, los recintos interiores del antiguo castillo de Edo, sede del shogunato Tokugawa. Se abrió al público el 1 de octubre de 1968 y tiene unos 21 ha.',
      historia: 'El castillo de Edo tuvo tres torres principales (tenshu). La última, de Tokugawa Iemitsu (1638), tenía cinco tejados y unos 58 m sobre el suelo, unos 60 m contando la base de piedra. La Agencia de la Casa Imperial la describe como la torre más alta de todos los castillos de Japón. Ardió en el Gran Incendio de Meireki (1657). La base (tenshudai) se rehízo al año siguiente, pero la torre nunca se reconstruyó. Hoshina Masayuki, tío y regente del cuarto shōgun, defendió que «en tiempos de paz no hace falta una torre». El jardín se creó por acuerdo del Gobierno de 1960 y se construyó entre 1961 y 1968.',
      significado: 'Aquí estuvo el centro político de Japón durante los dos siglos y medio de paz Tokugawa. Además del recuerdo del castillo, el jardín refleja el interés de los emperadores Shōwa y Heisei (hoy emperador emérito) por la naturaleza: plantaron un bosque mixto, un jardín de variedades antiguas de frutales y un bambusal.',
      curiosidades: [
        'La torre más alta, en maqueta. Sube al tenshudai para ver la escala del castillo. Junto a él hay una maqueta de la torre de 1638, que permite imaginar lo que se alzaba sobre esas piedras.',
        'El escenario de los 47 rōnin. Un letrero marca el Matsu no Ōrōka (松の大廊下跡), el «gran pasillo de los pinos». Allí, en 1701, el señor de Akō, Asano Naganori, atacó a Kira Yoshinaka. Fue condenado a hacerse el seppuku ese mismo día, y la venganza de sus vasallos se convirtió en el Chūshingura.',
        'Los guardias ninja. El Hyakunin-bansho (百人番所), de 45 m de largo, era el cuerpo de guardia de cuatro compañías de arcabuceros, entre ellas las de Kōga e Iga, que se turnaban día y noche. En las tejas del Dōshin-bansho conviven el emblema de la malva de los Tokugawa y el crisantemo imperial.',
        'Un árbol por prefectura y otros detalles. En la zona del ninomaru hay un árbol representativo de cada prefectura, plantados en 1968. El pino de Okinawa llegó en 1972, cuando Estados Unidos devolvió la isla. El gran césped del honmaru fue lugar de nacimiento del observatorio meteorológico, y allí se disparó durante 58 años el cañonazo del mediodía (午砲, «don»). La torre Fujimi-yagura (1659) es la única torre de tres tejados del castillo que se conserva. Práctico: cierra los lunes y viernes (si el lunes es festivo, abre ese día y cierra el martes). La entrada es gratuita y no requiere reserva.',
      ],
      fuentes: [
        { label: 'Agencia de la Casa Imperial — 皇居東御苑 (horarios y cierres)', url: 'https://www.kunaicho.go.jp/visit/higashigyoen/index.html' },
        { label: 'Agencia de la Casa Imperial — 園内に残る歴史的建造物 (tenshudai, maqueta, Matsu no Ōrōka, Hyakunin-bansho, árboles de las prefecturas)', url: 'https://www.kunaicho.go.jp/visit/higashigyoen/structures-gardens/index.html' },
        { label: 'Japan-guide — Imperial Palace East Gardens', url: 'https://www.japan-guide.com/e/e3018.html' },
      ],
    },
  ],
  ginza: [
    {
      nombre: 'Kabuki-za (歌舞伎座)',
      queEs: 'El principal teatro de kabuki de Japón, en el antiguo barrio de Kobikichō (木挽町). El edificio actual es el «quinto periodo» del teatro e incorpora una torre de oficinas detrás de la fachada tradicional.',
      historia: 'El periodista Fukuchi Ōchi (福地桜痴, Gen\'ichirō) lo promovió dentro del movimiento de «reforma teatral» de Meiji, con la financiación de Chiba Katsugorō. Abrió en noviembre de 1889: fachada occidental clásica e interior japonés de ciprés hinoki. Las etapas siguientes fueron: 1911: se transforma en un edificio de estilo palaciego japonés; 1921: arde por un cortocircuito; 1923: el terremoto de Kantō interrumpe la reconstrucción; 1924: se termina la tercera etapa, en hormigón; 1945: los bombardeos destruyen la mayor parte del edificio; 1951: reabre la cuarta etapa; 2 de abril de 2013: reabre el edificio actual, proyectado por Mitsubishi Jisho Sekkei y Kengo Kuma & Associates.',
      significado: 'El kabuki está inscrito desde 2008 en la Lista Representativa del Patrimonio Cultural Inmaterial de la UNESCO. El Kabuki-za es su templo: compañías y familias de actores lo consideran el escenario de referencia.',
      curiosidades: [
        'Cifras del escenario. Según el teatro, tiene 1.808 butacas y, aparte, 96 localidades de un solo acto (幕見席, makumi-seki). El escenario giratorio mide 18,18 m de diámetro y la pasarela hanamichi, 18,18 m de largo. Comprueba antes del viaje cómo se venden las entradas de un acto.',
        'Un rincón para subir sin entrada. Desde la torre se accede a la galería del cuarto piso (歌舞伎座ギャラリー回廊) y a un jardín en la azotea (屋上庭園), con divulgación sobre la historia del kabuki. En el sótano 2 está la plaza comercial Kobikichō Hiroba, cuyo nombre recuerda el del antiguo barrio.',
        'Muchas reencarnaciones. El edificio actual reproduce el aire del de 1924 y 1951 (tejados curvos de estilo Momoyama): es la quinta vez que el teatro renace en el mismo solar.',
      ],
      fuentes: [
        { label: 'Kabuki-za — 施設概要 (butacas, escenario, arquitectos)', url: 'https://www.kabuki-za.co.jp/guide/gaiyo.html' },
        { label: 'Kabuki-za — ギャラリー回廊 / 屋上庭園', url: 'https://www.kabuki-za.co.jp/kairou/index.html' },
        { label: 'NDL — 劇場の近代化 (fundación de 1889, Fukuchi Ōchi, fachada occidental)', url: 'https://www.ndl.go.jp/landmarks/column/theatrical' },
        { label: 'nippon.com — Historia del Kabuki-za (etapas 1911, 1921, 1924, 1945, 1951, 2013)', url: 'https://www.nippon.com/ja/views/b03002/' },
        { label: 'UNESCO — Kabuki theatre', url: 'https://ich.unesco.org/en/RL/kabuki-theatre-00163' },
      ],
    },
    {
      nombre: 'Edificio Wakō y reloj Seiko (和光 / SEIKO HOUSE GINZA)',
      queEs: 'Edificio de esquina curva coronado por una torre de reloj en el cruce de Ginza 4-chōme. Es la antigua sede de la relojería Hattori (服部時計店, hoy grupo Seiko) y desde 2022 se llama SEIKO HOUSE GINZA.',
      historia: 'Hattori Kintarō abrió su relojería en Ginza en 1881. Según Seiko, en 1894 compró en esta esquina el edificio de un periódico y lo reformó con un reloj en la azotea. El edificio actual se terminó en 1932. Lo proyectó Watanabe Jin (渡辺仁) y lo construyó Shimizu-gumi, y el distrito de Chūō lo considera «el gran edificio símbolo de Ginza». Sobrevivió a los bombardeos de 1945. Al acabar la guerra fue requisado como economato (PX) de las tropas de ocupación, y la tienda Wakō no pudo instalarse en él hasta 1952.',
      significado: 'Es el punto de encuentro clásico de Ginza y la imagen del Japón moderno de entreguerras. Watanabe Jin también es autor del edificio principal (Honkan) del Museo Nacional de Tokio en Ueno, así que en el viaje se ven dos obras suyas.',
      curiosidades: [
        'Escucha las campanadas. El reloj da las horas con un carillón de tipo Westminster que empieza unos segundos antes de la hora en punto.',
        'Destruido por Godzilla. En la película original de 1954, Godzilla destroza la torre del reloj de Ginza. Es una de las escenas de destrucción más célebres del cine japonés.',
        'Un reloj que viene de antes. La torre actual es la segunda: la primera, de 1894, coronaba el edificio anterior en este mismo solar.',
      ],
      fuentes: [
        { label: 'Seiko — 100 stories / historia (1881, compra de la esquina en 1894)', url: 'https://www.seikowatches.com/jp-ja/special/100stories/history/' },
        { label: 'Distrito de Chūō — 和光（旧服部時計店）(Watanabe Jin, Shimizu-gumi)', url: 'https://www.city.chuo.lg.jp/a0052/bunkakankou/bunka/kyodoshiryokan/kindai_kentikubutu_tyousa/kindai63.html' },
        { label: 'GO TOKYO — 和光 / SEIKO HOUSE (sobrevivió a los bombardeos)', url: 'https://www.gotokyo.org/jp/spot/658/index.html' },
        { label: 'Tabi-mag — 和光 (carillón Westminster)', url: 'https://tabi-mag.jp/tk0364/' },
        { label: 'Time Out Tokyo — Los escenarios de Godzilla', url: 'https://www.timeout.jp/tokyo/ja/film/visit-godzillas-stomping-grounds' },
        { label: 'Wikizilla — Godzilla (1954)', url: 'https://wikizilla.org/wiki/G54' },
      ],
    },
    {
      nombre: 'Paraíso peatonal de Ginza (銀座歩行者天国, «Hokoten»)',
      queEs: 'El corte al tráfico de la avenida Chūō-dōri (Ginza-dōri), entre 1-chōme y 8-chōme, para que los peatones caminen por la calzada. Tiene lugar los sábados, domingos y festivos, de 12:00 a 18:00 entre abril y septiembre.',
      historia: 'Lo propuso el gobernador de Tokio Minobe Ryōkichi y se estrenó el 2 de agosto de 1970, a la vez en Ginza, Shinjuku, Ikebukuro y Asakusa. El objetivo era responder a los atascos y a la contaminación de la era del automóvil. JAF habla de unos 800.000 visitantes en total aquel primer día. El 10 de junio de 1973 se cerró al tráfico un tramo de unos 5,5 km de Ginza a Ueno, entonces descrito como el «paraíso peatonal más largo del mundo». Esa fecha es hoy el «Día del paraíso peatonal» (歩行者天国の日).',
      significado: 'Simboliza el cambio de mentalidad de los setenta: pasar de «primero el coche» a devolver la calle a las personas. Muchos hokoten de Tokio desaparecieron después. El de Ginza sigue siendo el más emblemático.',
      curiosidades: [
        'Coincide con el viaje. El 8 y el 9 de mayo de 2027 son sábado y domingo. Si el tiempo lo permite (la decisión es de la policía), Chūō-dōri estará cerrada al tráfico desde las 12:00.',
        'Normas. Están prohibidas las actuaciones, la venta ambulante y las manifestaciones. Las bicicletas deben llevarse a mano.',
        'Fíjate en el asfalto. Pasear por el centro de la calzada permite ver de frente las fachadas de Wakō, Mitsukoshi y las grandes marcas, algo imposible el resto de la semana.',
      ],
      fuentes: [
        { label: 'GINZA OFFICIAL (全銀座会) — 歩行者天国 (1970, Minobe, horarios y normas)', url: 'https://www.ginza.jp/?p=19921' },
        { label: 'JAF Mate — 歩行者天国の日 (1970, 1973)', url: 'https://jafmate.jp/car/car_anniversary_20250610.html' },
      ],
    },
  ],
  'harajuku-meiji': [
    {
      nombre: 'Meiji Jingū (明治神宮)',
      queEs: 'Santuario sintoísta dedicado al emperador Meiji (†1912) y a la emperatriz Shōken (†1914). Lo rodea un bosque de unos 70 ha (700.000 m²), plantado por el ser humano.',
      historia: 'Tras la muerte del emperador, una petición popular impulsó un santuario en Yoyogi, antigua finca imperial. Se fundó en 1920. Según el santuario, se plantaron unos 100.000 árboles donados desde todo Japón, y unos 110.000 jóvenes trabajaron como voluntarios en la plantación y en los caminos. En abril de 1945 los bombardeos quemaron la mayoría de los edificios, pero el bosque sirvió de refugio y apenas sufrió daños. La sala principal se reconstruyó en 1958.',
      significado: 'Es un experimento forestal a 100 años vista y una de las grandes obras colectivas del Japón de Taishō. El santuario se convirtió en el lugar de referencia del primer rezo del año (hatsumōde) en Tokio.',
      curiosidades: [
        'El bosque que el primer ministro no quería. Los ingenieros forestales Honda Seiroku, Hongō Takanori y Uehara Keiji eligieron especies de hoja perenne y ancha (shii, kashi, alcanforero). Ya entonces la contaminación de Tokio mataba los árboles grandes. El primer ministro Ōkuma Shigenobu quería una majestuosa avenida de cedros, como en Ise o Nikkō, y se quejó de que no quería «un matorral». Los técnicos le convencieron de que el cedro no prosperaría en Yoyogi. Los datos les dieron la razón: de unas 365 especies y ~120.000 árboles iniciales se pasó a 234 especies y ~36.000 árboles, mucho más grandes, en el estudio de los años 2010. El santuario apunta que, al ser árboles de hoja perenne y no coníferas inflamables, quizá frenaron el fuego en 1945.',
        'Fíjate en el gran torii. El segundo torii (大鳥居) es el mayor torii de madera de estilo myōjin de Japón: 12 m de alto, 17 m de dintel y columnas de 1,2 m de diámetro. El original (1920) era de un ciprés de unos 1.200 años de las montañas de Alishan, en Taiwán. Un rayo lo destruyó en 1966. El actual (1975) se hizo con un ciprés de unos 1.500 años del monte Dandai, también en Taiwán, que un maderero de Tokio buscó durante años para cumplir una promesa.',
        'Barriles de sake… y de vino. Los barriles de sake envueltos en paja los ofrecen cada año las bodegas de la asociación nacional de cerveceros devotos del santuario. Están vacíos: el sake se ofrece aparte, embotellado. Enfrente hay barriles de vino de Borgoña, ofrecidos desde 2006 en recuerdo de la afición del emperador Meiji por la cocina y el vino occidentales.',
        'El pozo de Kiyomasa. En el jardín interior (御苑, 500 ¥) está el Kiyomasa-no-ido, un manantial que según la tradición excavó el general Katō Kiyomasa, cuya familia tuvo aquí su residencia. A principios de mayo no hay lirios, que florecen en junio.',
      ],
      fuentes: [
        { label: 'Meiji Jingū — 明治神宮とは', url: 'https://www.meijijingu.or.jp/about/' },
        { label: 'Meiji Jingū — 杜（もり）・みどころ (plantación, Ōkuma, censo de árboles)', url: 'https://www.meijijingu.or.jp/midokoro/' },
        { label: 'Meiji Jingū — 境内地図 (sala principal de 1958, gran torii, Kiyomasa-no-ido)', url: 'https://www.meijijingu.or.jp/guide/' },
        { label: 'MLIT/Agencia de Turismo — 大鳥居(第二鳥居) 解説文', url: 'https://www.mlit.go.jp/tagengo-db/H30-00516.html' },
        { label: 'MLIT/Agencia de Turismo — barriles de sake (PDF)', url: 'https://www.mlit.go.jp/tagengo-db/common/001552042.pdf' },
        { label: 'MLIT/Agencia de Turismo — barriles de vino (PDF)', url: 'https://www.mlit.go.jp/tagengo-db/common/001552041.pdf' },
        { label: 'MLIT/Agencia de Turismo — 明治神宮御苑 (PDF)', url: 'https://www.mlit.go.jp/tagengo-db/common/001552044.pdf' },
      ],
    },
    {
      nombre: 'Takeshita-dōri (竹下通り)',
      queEs: 'Calle peatonal y comercial frente a la salida Takeshita de la estación JR de Harajuku. Es el escaparate de la moda juvenil y la cultura kawaii.',
      historia: 'La calle se volvió comercial a mediados de los setenta. En 1979 aparecieron los Takenoko-zoku, grupos que bailaban con trajes llamativos en el paraíso peatonal de Harajuku y convirtieron la zona en foco de la cultura juvenil.',
      significado: 'Es un barómetro de modas juveniles, de los takenoko-zoku a las tribus urbanas posteriores. Funciona como laboratorio comercial de lo kawaii.',
      curiosidades: [
        'Bolardos que suben a las 11. Entre las 11:00 y las 18:00 la calle es solo peatonal y suben unos bolardos retráctiles para impedir el paso de vehículos. Se instalaron tras largas negociaciones entre los comerciantes, el distrito de Shibuya y la policía, porque es una vía municipal.',
        'No te pararán por la calle. Está prohibido captar clientes o hacer ofertas por la calle en Takeshita-dōri.',
        'La estación que ya no verás. La estación de Harajuku de madera de 1924, en estilo inglés y la más antigua de madera de Tokio, se sustituyó en marzo de 2020 por no cumplir la normativa contra incendios. Estaba previsto reproducir parte de ella en un nuevo edificio comercial.',
      ],
      fuentes: [
        { label: 'nippon.com — 原宿 (Takeshita-chō hasta 1965, 1979, estación)', url: 'https://www.nippon.com/ja/japan-topics/c13309/' },
        { label: 'Asociación de comerciantes de Takeshita-dōri (bolardos, prohibición de captar clientes)', url: 'https://www.takeshita-street.com/' },
        { label: 'JAF Mate — 歩行者天国の日 (Takenoko-zoku en los hokoten de los ochenta)', url: 'https://jafmate.jp/car/car_anniversary_20250610.html' },
      ],
    },
    {
      nombre: 'Omotesandō (表参道)',
      queEs: 'Avenida de unos 36 m de ancho, flanqueada de keyaki (zelkovas), que une Aoyama-dōri con el puente Jingū-bashi, junto a Harajuku. Hoy es la gran calle de tiendas de arquitectura de autor.',
      historia: 'Su nombre significa literalmente «camino de aproximación principal» (表 = delantero o principal; 参道 = camino de peregrinación al santuario). Se trazó en 1919 como acceso de honor al Meiji Jingū, que se fundó en 1920. Al año siguiente se plantaron zelkovas a ambos lados. En el bombardeo del Yamanote de mayo de 1945, la avenida ardió por completo. El monumento del distrito de Minato lo recuerda así: «en Omotesandō ardieron las zelkovas, y junto al cruce de Aoyama-dōri murieron muchas personas atrapadas por el fuego y el viento abrasador». Tras la guerra, la cercana base de ocupación estadounidense Washington Heights (Yoyogi) americanizó los comercios de la avenida.',
      significado: 'Nació como espacio sagrado, como avenida de peregrinación, y se convirtió en el bulevar comercial más elegante de Tokio. Las zelkovas son su seña de identidad: la avenida figura en la selección «新・日本街路樹100景».',
      curiosidades: [
        'Fíjate en los faroles de piedra. En el cruce con Aoyama-dōri hay un par de grandes faroles de piedra (石灯籠), recuerdo de que esto era un camino sagrado. El material del distrito de Minato explica que sus bases desportilladas son marcas del bombardeo. Las manchas negras, «se dice», proceden de los cuerpos quemados aquel día. Es un testimonio silencioso de 1945.',
        'Una réplica de los años veinte. Omotesando Hills (2006) ocupa el solar de los apartamentos Dōjunkai de Aoyama, construidos tras el terremoto de 1923. En su extremo, el Dōjunkan (同潤館) reproduce una parte del bloque original.',
      ],
      fuentes: [
        { label: 'Sumitomo Mitsui Trust — このまちアーカイブス 渋谷 (1919, 36 m)', url: 'https://smtrc.jp/town-archives/city/shibuya/p05.html?id=a01' },
        { label: 'Distrito de Minato — 和をのぞむ (inscripción sobre el bombardeo de 1945)', url: 'https://www.city.minato.tokyo.jp/jinken/wawonozomu.html' },
        { label: 'Distrito de Minato — material de paz sobre el bombardeo del Yamanote (PDF; faroles)', url: 'https://www.city.minato.tokyo.jp/documents/162258/minato_heiwa4_p60-66_part1-2_250509.pdf' },
        { label: 'Sakigake/Kyōdō — ぷらっとTOKYO 表参道 (farol, Dōjunkan)', url: 'https://www.sakigake.jp/news/article/20251222EN0001/' },
      ],
    },
  ],
  shibuya: [
    {
      nombre: 'Cruce de Shibuya (渋谷スクランブル交差点)',
      queEs: 'Cruce «en melé» (scramble) frente a la estación de Shibuya. Todos los semáforos de vehículos se ponen en rojo a la vez y los peatones cruzan en todas las direcciones.',
      historia: 'El cruce frente a la estación se convirtió en scramble en 1973, el mismo año en que abrió Shibuya PARCO, en plena expansión de los grandes almacenes del barrio. El Asahi Shimbun lo fechó en 1973, aunque se ha señalado que el día exacto no consta en la prensa de la época.',
      significado: 'Es la imagen de la Tokio contemporánea en el cine y la publicidad: una masa enorme que se cruza en todas direcciones sin chocar.',
      curiosidades: [
        'Fíjate: solo hay una diagonal. Aunque se imagina como una gran «X», el cruce tiene un único paso en diagonal, que sale de la plaza de Hachikō, y lo tiene así desde el principio. El cercano cruce de Dōgenzaka-shita, frente a Shibuya 109, sí tiene la X completa.',
        'Dónde verlo desde arriba. La esquina SKY EDGE de SHIBUYA SKY está orientada justamente hacia el cruce.',
      ],
      fuentes: [
        { label: 'Norimono News — 渋谷スクランブル交差点に斜め横断歩道が1本しかないワケ', url: 'https://trafficnews.jp/post/122022/2' },
        { label: 'CNN Japan — Shibuya crossing (más de 1.000 personas por fase)', url: 'https://www.cnn.co.jp/travel/35141167.html' },
      ],
    },
    {
      nombre: 'Hachikō (忠犬ハチ公)',
      queEs: 'Estatua de bronce del perro akita Hachikō, junto a la salida que lleva su nombre. Es el punto de encuentro más famoso de Japón.',
      historia: 'Hachikō nació en 1923 en Ōdate (Akita) y fue el perro del profesor de Agronomía de la Universidad Imperial de Tokio Ueno Hidesaburō. El profesor murió de repente en el campus el 21 de mayo de 1925. Según un informe universitario, Hachikō pasó primero por casas de parientes y conocidos en Nihonbashi y Asakusa, de las que se escapaba hacia Shibuya. Después acudió durante años a la estación, y GO TOKYO habla de unos nueve años. Hachikō murió el 8 de marzo de 1935. La primera estatua, del escultor Andō Teru, es de 1934: se hizo en vida del perro. Se fundió en 1944 por la ley de requisa de metales. La actual es obra de su hijo Andō Takeshi, que tomó la primera como modelo; se inauguró en la posguerra.',
      significado: 'Encarna la lealtad (chūgi). En la posguerra se convirtió en un símbolo amable de la ciudad y en el lugar donde quedar en Shibuya.',
      curiosidades: [
        'El mito de los pinchos de yakitori. En la autopsia de 1935 se hallaron cuatro brochetas de bambú en el estómago, pero los veterinarios no las relacionaron con su muerte. La causa oficial fue una filariosis grave. En 2011, la Universidad de Tokio examinó sus órganos con resonancia magnética y halló además un cáncer extendido en pulmón y corazón.',
        'Sus órganos se pueden ver. El corazón, los pulmones, el hígado y el bazo se conservan en formol en la Universidad de Tokio, y desde 2006 se exponen en el museo agrícola junto a la puerta principal de la Facultad de Agronomía (campus de Yayoi).',
        'El reencuentro en bronce. En 2015, al cumplirse 80 años de su muerte, la Facultad de Agronomía inauguró una estatua de Hachikō saltando de alegría hacia el profesor Ueno.',
      ],
      fuentes: [
        { label: 'Universidad de Tokio, Patología Veterinaria — 新たに判明した忠犬ハチ公の死因 (PDF)', url: 'https://www.vm.a.u-tokyo.ac.jp/byouri/HPpict/hachiko.pdf' },
        { label: 'Universidad de Tokio, informe de curso — ハチ公 y el profesor Ueno (muerte el 21 de mayo de 1925; estancias en Nihonbashi y Asakusa) (PDF)', url: 'https://www.iai.ga.a.u-tokyo.ac.jp/mizo/lecture/iae/2015/report/r1/7.pdf' },
        { label: 'Universidad de Tokio, informe de curso — estatua de Hachikō y el profesor Ueno en la Facultad de Agronomía (PDF)', url: 'https://www.iai.ga.a.u-tokyo.ac.jp/mizo/lecture/iae/2015/report/r1/9.pdf' },
        { label: 'Bijutsu Techō — Exposición sobre Andō Teru en el Museo Shōtō (1934, fundición de 1944, obra de su hijo)', url: 'https://bijutsutecho.com/magazine/news/report/30921?page=4' },
        { label: 'GO TOKYO — ハチ公像', url: 'https://www.gotokyo.org/jp/spot/86/index.html' },
      ],
    },
    {
      nombre: 'SHIBUYA SKY (渋谷スクランブルスクエア屋上展望施設)',
      queEs: 'Mirador en la cubierta de la torre este de Shibuya Scramble Square, con una terraza al aire libre (SKY STAGE) a unos 229 m de altura. El rascacielos mide unos 230 m.',
      historia: 'Abrió el 1 de noviembre de 2019 con la primera fase del rascacielos (47 plantas sobre rasante y 7 bajo tierra). El diseño exterior corrió a cargo de tres estudios: Nikken Sekkei (parte alta), Kengo Kuma & Associates (parte baja) y SANAA.',
      significado: 'Es el punto más alto de Shibuya. Simboliza la gran remodelación de la estación, que lleva más de una década en obras.',
      curiosidades: [
        'SKY EDGE. La terraza está rodeada de vidrio, salvo en la esquina noroeste, donde el muro es más bajo y mira directamente sobre el cruce. Es el encuadre que buscan casi todos.',
        'Una brújula de mapas. En el punto más alto, la GEO COMPASS dibuja un mapa en proyección azimutal equidistante que indica la dirección de lugares de todo el mundo. En el césped de la terraza hay hamacas.',
        'No es el más alto de Tokio. Es la cumbre de Shibuya, pero no de la ciudad: por ejemplo, la azotea de la torre Mori, en Roppongi, está más alta sobre el nivel del mar.',
      ],
      fuentes: [
        { label: 'nippon.com — 地上229メートルの展望施設「SHIBUYA SKY」', url: 'https://www.nippon.com/ja/guide-to-japan/gu900265/' },
        { label: 'Shinkenchiku — 渋谷スクランブルスクエア (arquitectos)', url: 'https://data.shinkenchiku.online/articles/SK_2020_01_192-0' },
        { label: 'Shibuya Scramble Square — web oficial', url: 'https://www.shibuya-scramble-square.com/en/index.html' },
      ],
    },
  ],
  shinjuku: [
    {
      nombre: 'Omoide Yokochō (思い出横丁)',
      queEs: 'Callejón de pequeños bares de brochetas y casquería junto a la salida oeste de la estación de Shinjuku. Su nombre oficial es Shinjuku Nishiguchi Shōtengai (新宿西口商店街).',
      historia: 'Nació hacia 1946 en el mercado negro que montaron los vendedores ambulantes (tekiya) sobre las ruinas de la guerra. Su antecedente directo fue el «Yasuda-gumi Market», también llamado «Lucky Street». Muchos de los primeros tenderos eran soldados desmovilizados o repatriados. Hacia 1953, ante los especuladores de suelo, los comerciantes formaron una asociación y compraron el terreno, lo que alejó la amenaza de derribo. En 1999 un incendio destruyó cerca de un tercio del callejón.',
      significado: 'Es uno de los pocos restos de la Tokio de los mercados negros que siguen vivos en pleno Shinjuku de los rascacielos.',
      curiosidades: [
        'Por qué hay tanta casquería. La carne estaba racionada, pero las vísceras no. Hacia 1947, un tendero con contactos en un matadero empezó a vender brochetas de casquería de cerdo como «yakitori», y los demás le imitaron. Ese origen explica la oferta actual de motsu-yaki.',
        'Fíjate en los pilares. Tras el incendio de 1999, los locales del pasillo central no podían reconstruirse desde cero porque no cumplían las normas de acceso a la vía pública. Se reformaron conservando sus pilares, con el compromiso de hacerlos ignífugos más adelante.',
        'Un futuro incierto. Los edificios de madera envejecen y la propiedad está muy fragmentada. Según una encuesta citada en 2020, el 70% de los propietarios no seguiría con su negocio si el callejón se convirtiera en un edificio.',
      ],
      fuentes: [
        { label: 'Gendai Business — 思い出横丁の歴史 (Yasuda-gumi, 1953, casquería, incendio de 1999)', url: 'https://gendai.media/articles/-/77265' },
        { label: 'GetNavi — 思い出横丁 (origen hacia 1946, nombre oficial, ~60 locales)', url: 'https://getnavi.jp/cuisine/958418/' },
      ],
    },
    {
      nombre: 'Golden Gai (新宿ゴールデン街)',
      queEs: 'Unos 280 bares diminutos, de entre 10 y 15 m² cada uno, en siete callejuelas de casas adosadas de posguerra junto a Kabukichō.',
      historia: 'Tras 1945, las fuerzas de ocupación trasladaron aquí, a un descampado del antiguo barrio de Sankō-chō, un mercado negro de la salida este de Shinjuku. La zona se convirtió en un «aosen» (青線), un barrio de prostitución no autorizada, con mujeres trabajando en los pisos de arriba. Lo siguió siendo hasta que la Ley de Prevención de la Prostitución entró plenamente en vigor en 1958. Entonces los locales se reconvirtieron en bares. Hacia 1970 eran punto de reunión de escritores, poetas, gente del teatro y periodistas. En los ochenta la especulación inmobiliaria (jiage) lo hizo decaer, y una nueva generación de dueños lo ha revitalizado.',
      significado: 'Conserva casi intacta la trama de casas adosadas de posguerra y la memoria de la bohemia literaria y teatral de Shinjuku.',
      curiosidades: [
        'Dos asociaciones, una frontera invisible. La zona norte (antiguo Sankō-chō) pertenece a la asociación Shinjuku Sankō Shōtengai, y la sur, conocida como Hanazono-gai, a la Shinjuku Golden Gai Shōgyō Kumiai. Los nombres de las calles lo delatan: Hanazono 1-ban-gai, 3-ban-gai, 5-ban-gai…',
        'Fíjate en los pisos de arriba. En tiempos del aosen, las mujeres trabajaban en la segunda y tercera planta de estas casas adosadas, que siguen en pie. Hoy muchos bares ocupan esas plantas altas, a las que se sube por escaleras muy empinadas.',
        'Una cita de época. El escritor Tanaka Komimasa, asiduo, escribió en 1978 que Golden Gai era «un lugar especial incluso en Shinjuku, donde no viene a beber el asalariado corriente».',
      ],
      fuentes: [
        { label: 'nippon.com — 新宿ゴールデン街 (origen, aosen, 1958, ~280 bares, asociaciones)', url: 'https://www.nippon.com/ja/guide-to-japan/gu900052/' },
        { label: 'Gendai Business — ゴールデン街 (aosen y 1958)', url: 'https://gendai.media/articles/-/139623' },
      ],
    },
    {
      nombre: 'Kabukichō (歌舞伎町)',
      queEs: 'El gran barrio de ocio nocturno al norte de la estación de Shinjuku: cines, karaoke, bares y host clubs.',
      historia: 'La zona, antes llamada Tsunohazu (角筈), quedó arrasada en los bombardeos. El 19 de agosto de 1945, solo cuatro días después de la rendición, el presidente vecinal Suzuki Kihei (鈴木喜兵衛) empezó a planear su reconstrucción. Imaginó un distrito de espectáculos alrededor de un gran teatro de kabuki, el Kiku-za (菊座). El nombre «Kabukichō» se lo puso el jefe de urbanismo de Tokio Ishikawa Hideaki (石川栄耀) y se adoptó en abril de 1948. Las restricciones a la construcción y el bloqueo de los depósitos bancarios hicieron fracasar el teatro. Solo llegó a construirse el cine Chikyū-za, que ya estaba en obras.',
      significado: 'Es un ejemplo de reconstrucción de posguerra impulsada por los vecinos y no por el Estado. Su identidad nocturna, que desconcierta a muchos visitantes, nació de un proyecto cultural frustrado.',
      curiosidades: [
        '«El barrio del kabuki» nunca tuvo kabuki. El nombre recuerda un teatro que jamás se construyó.',
        'Mira hacia arriba: Godzilla. En el solar del antiguo teatro Shinjuku Koma está el Shinjuku Tōhō Building (abril de 2015). En su terraza de la octava planta, la del hotel Gracery, asoma una cabeza de Godzilla de unos 12 m, a unos 52 m del suelo, modelada a partir de Godzilla vs. Mothra (1992). Se ve desde la avenida central de Kabukichō.',
      ],
      fuentes: [
        { label: 'Sumitomo Mitsui Trust — このまちアーカイブス 新宿 (Suzuki Kihei, Ishikawa Hideaki, Kiku-za)', url: 'https://smtrc.jp/town-archives/city/shinjuku/p06.html?id=a01' },
        { label: 'President Online — Hashiguchi Toshio (exdirector del Museo de Historia de Shinjuku): por qué se llama Kabukichō', url: 'https://president.jp/articles/-/68326' },
        { label: 'Ministerio de Hacienda, revista «ファイナンス» — 東京都新宿区', url: 'https://www.mof.go.jp/public_relations/finance/202401/202401m.html' },
        { label: 'GO TOKYO — ゴジラヘッド', url: 'https://www.gotokyo.org/jp/spot/1864/index.html' },
        { label: 'eiga.com — Inauguración de la cabeza de Godzilla (2015)', url: 'https://eiga.com/news/20150409/17/' },
      ],
    },
  ],
  tsukiji: [
    {
      nombre: 'Mercado exterior de Tsukiji (築地場外市場)',
      queEs: 'Barrio de unos cuantos centenares de tiendas y restaurantes de pescado, algas, utensilios y cuchillos que creció junto al antiguo mercado mayorista. Sigue activo aunque el mercado interior se trasladó a Toyosu en 2018.',
      historia: 'Tsukiji (築地) significa literalmente «tierra construida». Tras el Gran Incendio de Meireki (1657), la desembocadura del Sumida se rellenó para levantar residencias de samuráis. Según la tradición, los fieles pescadores de Tsukudajima ganaron al mar el terreno del templo Hongwanji. El mercado central abrió oficialmente en 1935, cuando el mercado de pescado de Nihonbashi se trasladó aquí tras el terremoto de 1923. Durante buena parte del siglo XX fue el mayor centro de distribución de pescado del mundo. En 2018 el mercado mayorista se trasladó a Toyosu, pero el exterior nunca cerró.',
      significado: 'Es la despensa de los restaurantes de Tokio y el lugar donde se ve la cultura profesional del pescado y del cuchillo.',
      curiosidades: [
        'Un mercado sobre un antiguo cementerio. La web oficial cuenta que, tras el terremoto de 1923, muchas tumbas del cementerio del Hongwanji se trasladaron a Wadabori, en el actual distrito de Suginami. En esos solares se instalaron comerciantes de pescado y así nació espontáneamente el mercado exterior. Un dicho popular aseguraba que comerciar sobre un antiguo cementerio traía prosperidad. Llegó a reunir unas 500 tiendas.',
        'Busca el santuario de las olas. El Namiyoke Inari (波除稲荷神社, 1659) cuenta una historia según la tradición: las obras de relleno sufrían el embate de las olas hasta que se rescató del agua una imagen sagrada y se le dio culto. Entonces el mar se calmó. Es la deidad tutelar del barrio.',
        'A qué hora ir. La asociación oficial recomienda a los visitantes ir entre las 9:00 y las 14:00. A primera hora la prioridad es para los profesionales. También pide no regatear: los precios están ajustados al criterio profesional.',
      ],
      fuentes: [
        { label: 'Mercado exterior de Tsukiji (web oficial) — 歴史 (relleno de 1657, Namiyoke Inari, origen sobre el cementerio)', url: 'https://www.tsukiji.or.jp/know/history/' },
        { label: 'Mercado exterior de Tsukiji (web oficial) — 築地活用Q&A (horario recomendado, sin regateo)', url: 'https://www.tsukiji.or.jp/ordinary/faq/' },
        { label: 'nippon.com — 築地本願寺 (origen del nombre Tsukiji)', url: 'https://www.nippon.com/ja/guide-to-japan/gu900191/' },
      ],
    },
    {
      nombre: 'Tsukiji Hongwanji (築地本願寺)',
      queEs: 'Templo de la escuela Jōdo Shinshū Hongwanji-ha, filial del Nishi Hongwanji de Kioto. Su exterior evoca la arquitectura budista de la antigua India.',
      historia: 'Se fundó en 1617 cerca del actual Nihonbashi Yokoyama-chō, como «Edo Gobō». Ardió en el Gran Incendio de Meireki (1657) y se reconstruyó sobre terreno ganado al mar en su ubicación actual. De ahí sus apodos de «Tsukiji Gobō» y «Tsukiji Monzeki». El terremoto de 1923 destruyó el edificio anterior. El actual (1934) es de hormigón para resistir terremotos e incendios. Lo diseñó el arquitecto e historiador Itō Chūta (伊東忠太) por encargo del abad Ōtani Kōzui, que había enviado expediciones a la Ruta de la Seda. La sala principal, el muro de piedra Ōya y las puertas principal, norte y sur son Bienes Culturales Importantes (desde 2014, según fuentes secundarias).',
      significado: 'Es una reivindicación arquitectónica de los orígenes indios y asiáticos del budismo. Fue también un templo «moderno» para su época: bancos, vidrieras, lámparas de araña y calefacción de vapor.',
      curiosidades: [
        'Caza de animales. El templo dice que hay 13 especies de animales esculpidas y escondidas por el recinto: leones alados, vaca, caballo, elefante, pavo real, mono… Itō Chūta era conocido por su afición a las criaturas. Fíjate en los leones alados de la escalera: la pareja de abajo y la de arriba tienen invertidas las bocas abierta y cerrada (a-un), así que el a-un se lee en horizontal y en vertical.',
        'Un órgano en un templo budista. El órgano de tubos de la sala principal es el segundo. El primero se donó en 1970 para difundir la música budista. Suena en ceremonias, bodas y conciertos a la hora de comer (el último viernes de cada mes).',
        'Aquí no hay goshuin. Siguiendo la doctrina Jōdo Shinshū, el templo no ofrece omikuji, goshuin ni amuletos. Lo advierte expresamente. En su café Tsumugi es famoso el «desayuno de 18 platillos».',
      ],
      fuentes: [
        { label: 'Tsukiji Hongwanji — はじめての築地本願寺 (Itō Chūta, 13 animales, órgano, sin goshuin)', url: 'https://tsukijihongwanji.info/first/' },
        { label: 'nippon.com — 築地本願寺 (historia, Bienes Culturales Importantes, leones a-un)', url: 'https://www.nippon.com/ja/guide-to-japan/gu900191/' },
        { label: 'Mercado exterior de Tsukiji — 歴史 (traslado tras Meireki y relleno de Tsukudajima)', url: 'https://www.tsukiji.or.jp/know/history/' },
      ],
    },
  ],
  ueno: [
    {
      nombre: 'Museo Nacional de Tokio (東京国立博物館)',
      queEs: 'El museo más antiguo de Japón. Tiene unos 120.000 objetos y 89 Tesoros Nacionales (dato de 2022), el mayor número para un solo museo del país, cerca de una décima parte de los Tesoros Nacionales de bellas artes.',
      historia: 'El museo data su nacimiento el 10 de marzo de 1872, cuando el Ministerio de Educación celebró su primera exposición en la sala Taiseiden del templo confuciano Yushima Seidō. En 1882 se trasladó al parque de Ueno, a un edificio de Josiah Conder que el terremoto de 1923 dejó inservible. El edificio principal actual (Honkan) es obra de Watanabe Jin, que ganó un concurso con la condición de un «estilo oriental de base japonesa». Se terminó el 6 de noviembre de 1937, abrió en 1938 y es Bien Cultural Importante desde 2001.',
      significado: 'Nació con la política Meiji de proteger el patrimonio frente a la modernización. Hoy reúne el mejor resumen del arte japonés bajo un mismo techo.',
      curiosidades: [
        'Un arquitecto, dos iconos. Watanabe Jin, autor del Honkan, diseñó también la torre del reloj de Wakō, en Ginza. Ambos edificios están en la ruta de este viaje.',
        'El museo dentro del museo. El Hyōkeikan, de Katayama Tōkuma (1909), se levantó para conmemorar la boda del príncipe heredero, el futuro emperador Taishō, en 1900. Es Bien Cultural Importante: parte del museo es en sí misma una pieza protegida.',
        'Pista para la visita. Los Tesoros Nacionales rotan, porque se exponen poco tiempo para protegerlos. Merece la pena mirar en la web del museo qué piezas estarán expuestas en mayo de 2027.',
      ],
      fuentes: [
        { label: 'Museo Nacional de Tokio — 館の歴史 (1872, Yushima Seidō, Ueno en 1882)', url: 'https://www.tnm.jp/modules/r_free_page/index.php?id=143' },
        { label: '文化遺産オンライン (Agencia de Asuntos Culturales) — 旧東京帝室博物館本館 (1937, Bien Cultural Importante en 2001)', url: 'https://online.bunka.go.jp/db/heritages/detail/187846/1' },
        { label: 'Business Insider Japan — Exposición del 150 aniversario: los 89 Tesoros Nacionales', url: 'https://www.businessinsider.jp/article/254467/' },
        { label: 'Museum.or.jp (Internet Museum) — 東京国立博物館 (Watanabe Jin, Hyōkeikan)', url: 'https://www.museum.or.jp/museum/2466' },
      ],
    },
    {
      nombre: 'Parque de Ueno (上野恩賜公園)',
      queEs: 'Parque sobre la colina de Ueno, antiguo recinto del templo Kan\'ei-ji, con museos, zoo, templos y unos 800 cerezos.',
      historia: 'El Kan\'ei-ji se fundó en 1625. Lo creó el monje Tenkai en el nordeste del castillo de Edo, la dirección nefasta (kimon), para proteger al shogunato. Su nombre, Tōeizan, significa «el Monte Hiei del este». En la batalla de Ueno de 1868 (guerra Boshin) ardió casi todo. El Gobierno quería construir allí un hospital universitario, pero el médico militar holandés Bauduin propuso hacer un parque. Por decreto del Dajōkan (enero de 1873), Ueno fue uno de los primeros parques públicos de Japón. En 1890 pasó a ser propiedad imperial. El 26 de enero de 1924 se cedió a la ciudad de Tokio, y de ahí viene «Onshi»: «regalo imperial».',
      significado: 'Pasó de ser el templo protector de los Tokugawa a convertirse en el gran parque cultural del Japón moderno. Concentra museos nacionales, el zoo de 1882 y la memoria de la guerra civil que cerró el periodo Edo.',
      curiosidades: [
        'La estatua de Saigō y la viuda decepcionada. La estatua de Saigō Takamori con su perro se inauguró el 18 de diciembre de 1898. Es obra de Takamura Kōun, salvo el perro, que es de Gotō Sadayuki. Según se cuenta, su viuda Itoko exclamó al verla: «¡Mi marido no era así!».',
        'Un Kioto en miniatura. Tenkai trasladó a Edo la geografía sagrada de Kioto. El Kiyomizu Kannon-dō (1631; en su sitio actual desde 1694; Bien Cultural Importante) imita al Kiyomizu-dera de Kioto. Delante está el pino Tsuki-no-matsu («pino de la luna»), con una rama en círculo que pintó Hiroshige. Se perdió en Meiji y se replantó en 2012. Asómate y verás el Benten-dō enmarcado en el círculo.',
        'Cerezos con historia. Según la tradición, Tenkai trajo cerezos de Yoshino tras fundar el templo. Hoy hay unos 800. A principios de mayo ya no hay flor.',
      ],
      fuentes: [
        { label: 'Gobierno Metropolitano de Tokio, Oficina de Obras — 上野恩賜公園 (1873, cesión de 1924)', url: 'https://www.kensetsu.metro.tokyo.lg.jp/documents/d/kensetsu/000007471' },
        { label: 'Kan\'ei-ji — 寛永寺について (1625, Tenkai, kimon)', url: 'https://www.kaneiji.jp/about' },
        { label: 'MLIT/Agencia de Turismo — 寛永寺清水観音堂', url: 'https://www.mlit.go.jp/tagengo-db/R1-00088.html' },
        { label: 'nippon.com — 上野山内月のまつ (Hiroshige, pino de la luna)', url: 'https://www.nippon.com/ja/guide-to-japan/gu004075/' },
        { label: 'Serai (Shōgakukan) — 西郷隆盛像 (1898, Takamura Kōun, Gotō Sadayuki, Itoko)', url: 'https://serai.jp/hobby/300324' },
        { label: 'Daily Sports — 西郷さんの犬「ツン」の作者', url: 'https://www.daily.co.jp/society/life/2018/11/08/0011801710.shtml' },
        { label: 'Asociación Turística de Ueno — Historia (Bauduin, decreto de 1873)', url: 'https://www.ueno.or.jp/en/rekishi1' },
      ],
    },
    {
      nombre: 'Estanque Shinobazu y Benten-dō (不忍池・弁天堂)',
      queEs: 'Gran estanque al pie de la colina de Ueno con una isla artificial donde se alza el Benten-dō, salón dedicado a la diosa Benzaiten y dependiente del Kan\'ei-ji.',
      historia: 'Tenkai asimiló el estanque al lago Biwa y levantó en él una isla a imagen de la isla de Chikubu. Allí invocó a la Benzaiten de Chikubu y construyó el salón. El edificio se perdió en los bombardeos y el actual es de 1958. En los primeros años de Meiji hubo planes de desecar el estanque para hacer arrozales, que fracasaron en 1870, y de nuevo en 1891, cuando la oposición vecinal los frenó.',
      significado: 'Completa el «Kioto de Edo» de Tenkai: Kan\'ei-ji como el monte Hiei, Kiyomizu Kannon-dō como el Kiyomizu-dera y Shinobazu como el lago Biwa. Benzaiten es la única diosa entre los Siete Dioses de la Fortuna y protege la música, la elocuencia y la riqueza.',
      curiosidades: [
        'La diosa de ocho brazos. La imagen principal es una Benzaiten de ocho brazos (八臂). Es un hibutsu: solo se muestra el día del festival Minari Kanenari, en septiembre.',
        'En mayo, lotos sin flor. El estanque es famoso por sus lotos, pero florecen en pleno verano. En mayo solo se verán las hojas.',
        'Desde la terraza del Kiyomizu Kannon-dō, el círculo del «pino de la luna» enmarca el Benten-dō.',
      ],
      fuentes: [
        { label: 'LIVE JAPAN — 不忍池辯天堂 (Tenkai, Chikubu, 1958, Benzaiten de ocho brazos)', url: 'https://livejapan.com/ja/in-tokyo/in-pref-tokyo/in-ueno/spot-lj0001940/' },
        { label: 'MLIT/Agencia de Turismo — 寛永寺清水観音堂 (Tenkai y la geografía de Kioto)', url: 'https://www.mlit.go.jp/tagengo-db/R1-00088.html' },
        { label: 'Asociación Turística de Ueno — Historia (planes de desecación de 1870 y 1891)', url: 'https://www.ueno.or.jp/en/rekishi1' },
      ],
    },
  ],
  yanaka: [
    {
      nombre: 'Yanaka Ginza (谷中銀座)',
      queEs: 'Calle comercial de barrio (shōtengai) de unos 170 m con unas 60 tiendas, en su mayoría pequeños comercios familiares.',
      historia: 'Según la asociación de comerciantes, la calle surgió de forma espontánea hacia 1945. En la era Heisei la zona de Yanaka, Nezu y Sendagi, conocida como «Yanesen», se puso de moda para pasear por el Tokio popular. Desde entonces la asociación ha ido renovando la calle: 1999: mejora de las fachadas; 2006: toldos y carteles laterales uniformes; 2008: gatos de madera tallada; 2016: la mascota oficial, «Sen-chan».',
      significado: 'Es un shōtengai de los de antes, con carnicería, pescadería, verdulería y bodega. Su asociación lo defiende expresamente como una «cultura que hay que conservar».',
      curiosidades: [
        'Busca los gatos. Desde 2008 hay gatos de madera tallada repartidos por la calle, sobre las tiendas. Yanaka es conocido como barrio de gatos.',
        'El atardecer. La escalera Yūyake Dandan («escalones del atardecer»), en la entrada desde Nippori, es un punto famoso para ver la puesta de sol sobre la calle.',
        'Más gente que nunca. Según la asociación, en 2018 pasaron unas 10.000 personas un día laborable y unas 14.000 en fin de semana, frente a unas 8.000 en 1991.',
      ],
      fuentes: [
        { label: 'Yanaka Ginza (asociación oficial) — 谷中ぎんざについて', url: 'https://www.yanakaginza.com/%E8%B0%B7%E4%B8%AD%E3%81%8E%E3%82%93%E3%81%96%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/' },
        { label: 'GO TOKYO — Yanaka Ginza', url: 'https://www.gotokyo.org/en/spot/170/index.html' },
      ],
    },
    {
      nombre: 'Cementerio de Yanaka (谷中霊園)',
      queEs: 'Cementerio metropolitano de unas 10 ha (102.537 m²) entre los templos de Yanaka, con una avenida central de cerezos («Sakura-dōri»).',
      historia: 'Se abrió el 1 de septiembre de 1874 (Meiji 7) como cementerio público, sobre parte del recinto confiscado al templo Tennō-ji tras la separación oficial entre sintoísmo y budismo. Forma un único espacio con los cementerios del Kan\'ei-ji y del Tennō-ji.',
      significado: 'Es un panteón de la era Meiji. Están enterrados aquí el último shōgun Tokugawa Yoshinobu (en el recinto Tokugawa del Kan\'ei-ji, colindante) y Shibusawa Eiichi, «padre del capitalismo japonés» y rostro del billete de 10.000 yenes desde 2024, además de pintores, escritores, actores y políticos.',
      curiosidades: [
        'La pagoda que ya no está. En la avenida central quedan los cimientos de la pagoda de cinco pisos del Tennō-ji, la que inspiró la novela Gojū-no-tō (1891–1892) de Kōda Rohan. Se construyó en 1644, ardió en 1772 y se reconstruyó en 1791. El templo la donó a la ciudad de Tokio en 1908 y ardió en 1957 en un incendio provocado ligado a un doble suicidio. Hoy el solar es sitio histórico de Tokio.',
        'El paseo de las casas de té. Según la tradición local, la avenida central era el camino de acceso al templo, flanqueado de casas de té cuando sus loterías atraían multitudes. Por eso a las floristerías de la entrada todavía se las llama «o-chaya» (casa de té).',
      ],
      fuentes: [
        { label: 'TOKYO霊園さんぽ (Asociación de Parques de Tokio) — 谷中霊園 (1874, superficie, pagoda)', url: 'https://www.tokyo-park.or.jp/reien/park/index073.html' },
        { label: 'GO TOKYO — 谷中霊園 (Shibusawa Eiichi, Sakura-dōri)', url: 'https://www.gotokyo.org/jp/spot/677/index.html' },
        { label: 'Yanaka Ginza — 谷中ぎんざについて (Tokugawa Yoshinobu, enterrado en Yanaka)', url: 'https://www.yanakaginza.com/%E8%B0%B7%E4%B8%AD%E3%81%8E%E3%82%93%E3%81%96%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/' },
        { label: 'Wikipedia japonesa — 谷中霊園', url: 'https://ja.wikipedia.org/wiki/%E8%B0%B7%E4%B8%AD%E9%9C%8A%E5%9C%92' },
      ],
    },
    {
      nombre: 'Tennō-ji (天王寺)',
      queEs: 'Templo de la escuela Tendai junto al cementerio de Yanaka, con un gran Buda sedente de bronce al aire libre. Representa a Bishamonten en el circuito de los Siete Dioses de la Fortuna de Yanaka.',
      historia: 'Según el relato fundacional del templo (1648), su origen está en 1274. Nichiren se alojó en casa de un notable local, Seki Nagateru (関長耀), que se hizo devoto. Un discípulo de Nichiren, Nichigen, abrió el templo, entonces llamado Kannō-ji (感応寺). En 1641 recibió el apoyo de Tokugawa Iemitsu. Pertenecía a la corriente fujufuse de la escuela Nichiren, perseguida por el shogunato, y en 1698–1699 fue convertido a la fuerza al budismo Tendai. Recibió su nombre actual en 1833.',
      significado: 'Su historia resume la relación del poder Tokugawa con las escuelas budistas. Fue además uno de los grandes centros de ocio popular de Edo gracias a sus loterías.',
      curiosidades: [
        'Una de las «tres loterías de Edo». Desde 1700 el templo celebró tomikuji, loterías autorizadas por el shogunato. Las de Yanaka (Kannō-ji), Meguro (Ryūsen-ji, el Meguro Fudō) y Yushima Tenjin se conocían como «los tres tomi de Edo» (江戸の三富). Las reformas Tenpō las prohibieron en 1842.',
      ],
      fuentes: [
        { label: 'Kotobank — 富くじ (世界大百科事典: «江戸の三富»)', url: 'https://kotobank.jp/word/%E5%AF%8C%E7%AA%81-108043' },
        { label: 'TOKYO霊園さんぽ — 谷中霊園 (sobre suelo del Tennō-ji)', url: 'https://www.tokyo-park.or.jp/reien/park/index073.html' },
        { label: 'Wikipedia japonesa — 天王寺 (台東区)', url: 'https://ja.wikipedia.org/wiki/%E5%A4%A9%E7%8E%8B%E5%AF%BA_(%E5%8F%B0%E6%9D%B1%E5%8C%BA' },
      ],
    },
    {
      nombre: 'Nezu Jinja (根津神社)',
      queEs: 'Santuario sintoísta de Bunkyō, uno de los «Diez Santuarios de Tokio» (東京十社). Sus siete edificios de 1706 se conservan completos y son Bienes Culturales Importantes.',
      historia: 'Según la tradición del santuario, lo fundó hace más de 1.900 años el héroe Yamato Takeru en Sendagi, y Ōta Dōkan levantó un edificio en el siglo XV. El emplazamiento actual era la residencia de Tokugawa Tsunashige, donde nació el futuro sexto shōgun Ienobu. Cuando el quinto shōgun Tsunayoshi adoptó a Ienobu como heredero, donó el terreno al santuario protector de su lugar de nacimiento. Allí ordenó una gran obra que se completó en 1706 (Hōei 3): sala de culto, sala de ofrendas, santuario principal, puerta Karamon, puerta oeste, cerca calada y puerta torre (rōmon), todo en estilo gongen-zukuri. En 1714 Ienobu fijó su festival anual, que llegó a considerarse un «festival bajo el cielo» (tenka matsuri), como el de Kanda y el Sannō.',
      significado: 'Es uno de los conjuntos arquitectónicos de Edo más completos de Tokio. Sobrevivió a terremotos e incendios, y los daños de la guerra se repararon entre 1959 y 1962.',
      curiosidades: [
        'Esvásticas que sobrevivieron a Meiji. Fíjate en el 卍 (manji) en los edificios: era el emblema del santuario cuando budismo y sintoísmo convivían. Tras la separación de Meiji se quitaron los elementos budistas, pero aquí se respetaron por la importancia de los edificios. El emblema actual sigue siendo un manji girado.',
        'La piedra de los escritores. Busca la «piedra de los literatos» (文豪の石), donde según el santuario se sentaban a descansar Natsume Sōseki y Mori Ōgai, ambos feligreses del barrio. Ōgai también dejó un pedestal que soportó un proyectil ruso, botín de la guerra ruso-japonesa. El proyectil se requisó en la Segunda Guerra Mundial.',
        'Una cerca con cimientos de 8 m. La cerca calada (透塀) mide 200 m y no se ha deformado en 300 años. Un estudio reciente descubrió que sus cimientos llegan a 8 m de profundidad. La puerta torre es la única de su tipo que se conserva en un santuario del antiguo Edo. Según se dice, uno de sus guardianes representa a Mito Kōmon (Tokugawa Mitsukuni).',
        'Azaleas: llegaremos tarde. El jardín de 3.000 azaleas de 100 variedades solo abre durante el Festival de las Azaleas de Bunkyō (文京つつじまつり), del 1 al 30 de abril. A principios de mayo estará cerrado, pero el túnel de torii hasta el Otome Inari se puede recorrer todo el año.',
      ],
      fuentes: [
        { label: 'Nezu Jinja — 根津神社について (historia, edificios de 1706, azaleas, festival)', url: 'https://nedujinja.or.jp/about/' },
        { label: 'Nezu Jinja — 境内案内 (manji, piedra de los literatos, cerca, puerta torre)', url: 'https://nedujinja.or.jp/keidaiannai/' },
        { label: 'Nezu Jinja — つつじまつり (del 1 al 30 de abril)', url: 'https://nedujinja.or.jp/category/tsutsujimatsuri/' },
        { label: 'GO TOKYO — Nezu Shrine', url: 'https://www.gotokyo.org/en/spot/70/index.html' },
      ],
    },
  ],
  'takaragawa-onsen': [
    {
      nombre: 'Takaragawa Onsen, Ōsenkaku (宝川温泉 汪泉閣)',
      queEs: 'Ryokan aislado (ikken-yado, único alojamiento del manantial) en Minakami (Gunma), en la cabecera del río Tone, con cuatro grandes baños al aire libre a ambas orillas del río Takaragawa, tres de ellos mixtos.',
      historia: 'Según la web oficial, no hay pruebas documentales ni arqueológicas de cuándo empezó a usarse el manantial, aunque se han hallado restos jōmon en las cercanías. Como balneario de curación (tōjiba) tomó forma en la era Taishō; las guías japonesas fechan la fundación del Ōsenkaku en 1923 (Taishō 12). Entonces solo se llegaba a pie desde Minakami o en las vagonetas madereras; el despegue llegó con las carreteras y la electricidad de las obras de presas iniciadas en la primera mitad de los años 1950, y en 1955 (Shōwa 30) se terminó, tras unos dos años de obras, el edificio principal actual. El gran baño Maka-no-yu data de 1940 (renovado en 2004) y el Maya-no-yu, solo para mujeres, de 1970. Los cuatro baños suman unos 470 tatami y se alimentan, sin recircular ni añadir agua, de cuatro pozos propios; las fuentes comerciales citan unos 1.800 l/min.',
      significado: 'Es uno de los ejemplos más conocidos de hitō (秘湯, «manantial escondido») de Kantō y de la tradición del baño mixto (kon\'yoku) al aire libre, hoy en retroceso. La web oficial insiste en el kakenagashi puro (agua de manantial en flujo continuo, sin calentar, diluir ni clorar).',
      curiosidades: [
        'La leyenda del «baño del halcón blanco». Según la tradición recogida por el propio ryokan, el príncipe legendario Yamato Takeru, enfermo durante su campaña hacia el este tras subir al monte Hotaka (武尊山), vio alzar el vuelo a un halcón blanco desde el valle; al bajar encontró el agua caliente, se bañó y sanó. Por eso el manantial se llamó antiguamente Hakutaka-no-yu (白鷹の湯). Es leyenda, no historia.',
        'El nombre real viene del río, y del cobre. Takaragawa significa «río del tesoro»: según la web oficial, en sus orillas se extrajo cobre hasta principios de la era Shōwa, probablemente desde época Edo (la propia web lo da como suposición).',
        'Fíjate en el pequeño santuario sobre el Kodakara-no-yu. En la cubierta del baño mixto más grande (unos 200 tatami, en la orilla opuesta) está entronizado un santuario Hotaka (武尊神社), en conexión con la leyenda.',
        'Normas actuales del baño mixto. La web oficial indica que la entrada de día incluye un yuami-gi (prenda de baño) exclusivo del establecimiento y que no se admiten los que traiga el cliente. La página en inglés, más antigua, aún habla de entrar con toalla: confirmar las normas vigentes al llegar. Según guías japonesas, el Kodakara-no-yu sirvió de localización para la película Thermae Romae II (2014).',
      ],
      fuentes: [
        { label: 'Web oficial — 伝統と由来', url: 'https://www.takaragawa.com/yurai.html' },
        { label: 'Web oficial — 大露天風呂', url: 'https://www.takaragawa.com/huro01.html' },
        { label: 'Web oficial — 日帰り入浴', url: 'https://www.takaragawa.com/higaeri.html' },
        { label: 'るるぶ (JTB) — 宝川温泉', url: 'https://rurubu.jp/andmore/spot/70001399' },
        { label: 'Kinki Nippon Tourist — 宝川温泉 汪泉閣', url: 'https://yado.knt.co.jp/st/S100009/' },
        { label: 'Good Luck Trip (JTB) — 宝川温泉', url: 'https://www.gltjp.com/ja/directory/item/16372/' },
        { label: 'Web oficial — Hot spa', url: 'https://www.takaragawa.com/e_onsen.html' },
      ],
    },
  ],
  'higashi-chaya': [
    {
      nombre: 'Higashi Chaya-gai (ひがし茶屋街) y el pan de oro de Kanazawa (金沢箔)',
      queEs: 'Barrio de casas de té (ochaya) de geiko en la orilla este del río Asano. Oficialmente es el «Distrito de Preservación de Grupos de Edificios Tradicionales Higashiyama Higashi» (東山ひがし).',
      historia: 'En 1820 (Bunsei 3) el dominio de Kaga autorizó oficialmente dos barrios de casas de té, «higashi» (este) y «nishi» (oeste, en la orilla del Sai), reagrupando los establecimientos dispersos por la ciudad bajo el 12.º señor, Maeda Narinaga (前田斉広). El 14 de noviembre de 2001 el Estado lo seleccionó como Distrito de Preservación de Grupos de Edificios Tradicionales de Importancia (重要伝統的建造物群保存地区), sobre unas 1,8 ha. Según el Ayuntamiento, es, junto con Gion (Kioto), el lugar donde mejor se conserva un conjunto de arquitectura de chaya de finales del Edo e inicios de Meiji.',
      significado: 'Las ochaya eran (y las que siguen activas son) locales de banquete con espectáculo de geiko, no cafeterías. La arquitectura se reconoce por la planta baja con celosía saliente (degōshi) y una segunda planta alta dedicada por entero a los salones. El pan de oro es la otra seña de identidad del barrio: el Ayuntamiento de Kanazawa afirma que más del 99 % del pan de oro de Japón, y el 100 % del de plata y del de latón, se produce en Kanazawa. Otras fuentes oficiales hablan de «más del 98 %», así que la cifra correcta es «prácticamente todo».',
      curiosidades: [
        'Shima (志摩), una ochaya de 1820 que se puede visitar. Bien Cultural Importante del Estado, construida en 1820, el año de la fundación del barrio. Fíjate en que la segunda planta no tiene armarios empotrados ni tabiques fijos: era un espacio pensado solo para el banquete y las artes de entretenimiento, nunca para vivir.',
        'Kaikarō (懐華樓), la mayor casa de té de Kanazawa. Construida hacia 1820, de día se visita y tiene salón de té. De noche sigue funcionando con la regla del ichigensan okotowari (no se admite a clientes sin presentación) y del ikkyaku ittei (一客一亭, un único grupo de clientes a la vez).',
        'El pan de oro nació casi a escondidas. Según la tradición, la industria empezó cuando Maeda Toshiie, fundador del dominio, encargó lanzas con incrustaciones de oro para sus guerreros, y se conserva un documento de 1593 en el que ordena producir pan de oro y plata. A finales del s. XVII el shogunato reservó la fabricación de pan de oro a Edo y la de plata a Kioto. En Kanazawa el oficio sobrevivió fabricando pan de latón, que no estaba prohibido, y «re-batiendo» láminas compradas en Edo y Kioto, hasta que a finales del Edo los artesanos lograron permiso para hacer el pan destinado al propio dominio. Con Meiji desaparecieron los controles, la producción de Edo se extinguió y Kanazawa se quedó con el mercado.',
        'Una técnica que es Patrimonio Inmaterial. El pan de oro engitsuke (縁付金箔), batido sobre papel japonés especialmente tratado hasta una diezmilésima de milímetro, es técnica de conservación seleccionada por el Estado desde 2014. Desde 2020 forma parte de la inscripción de la UNESCO «técnicas tradicionales para la conservación de la arquitectura de madera». Ese pan de oro se usa para restaurar Tesoros Nacionales.',
      ],
      fuentes: [
        { label: 'Ayuntamiento de Kanazawa — 東山ひがし伝統的建造物群保存地区', url: 'https://www4.city.kanazawa.lg.jp/soshikikarasagasu/bunkazaihogoka/gyomuannai/3/1/1/siteibunkazai/7/5808.html' },
        { label: 'Ayuntamiento de Kanazawa — Artesanías tradicionales (PDF)', url: 'https://www4.city.kanazawa.lg.jp/material/files/group/30/100324dentou-jpn.pdf' },
        { label: 'Agencia de Turismo — 石川県の工芸 (PDF)', url: 'https://www.mlit.go.jp/tagengo-db/common/001554458.pdf' },
        { label: 'Kaikarō — web oficial', url: 'https://www.kaikaro.jp/' },
        { label: 'Good Luck Trip (JTB) — 国指定重要文化財 志摩', url: 'https://www.gltjp.com/ja/directory/item/12713/' },
        { label: 'METI Chūbu — 金沢箔 (PDF)', url: 'https://www.chubu.meti.go.jp/b36tokkyo/sesaku/chiiki_dantai_shohyo/pdf/ishikawa/kanazawa_haku.pdf' },
        { label: 'Highlighting Japan (Gobierno de Japón)', url: 'https://www.gov-online.go.jp/eng/publicity/book/hlj/html/202210/202210_06_jp.html' },
        { label: 'Visit Kanazawa — Kanazawa Gold Leaf', url: 'https://visitkanazawa.jp/en/feature/detail_396.html' },
      ],
    },
  ],
  kenrokuen: [
    {
      nombre: 'Kenroku-en (兼六園)',
      queEs: 'Jardín de paseo de los señores Maeda, junto al castillo, desarrollado a lo largo de unos dos siglos. Es «Lugar de Belleza Escénica Especial» (特別名勝) y uno de los «tres grandes jardines de Japón».',
      historia: 'En 1676 (Enpō 4) el 5.º señor, Maeda Tsunanori, levantó una villa en la ladera frente al castillo y creó su jardín (Renchitei), origen del actual. El gran incendio de 1759 lo dañó en parte; en 1774 se crearon la cascada Midori-taki y el pabellón de té Yūgao-tei. En 1822 el 12.º señor, Maeda Narinaga, construyó allí su palacio de retiro, Takezawa, y ese mismo año el jardín recibió el nombre de Kenroku-en. Su hijo, el 13.º señor Nariyasu, derribó el palacio y amplió el jardín hasta darle la forma de paseo actual. Se abrió por completo al público en 1874 (Meiji 7) y en 1985 pasó de «Lugar de Belleza Escénica» a «Especial», la máxima categoría.',
      significado: 'El nombre lo puso Matsudaira Sadanobu, señor de Shirakawa y antiguo consejero jefe del shogunato, a petición de Narinaga. Lo tomó del clásico chino Luoyang mingyuan ji (洛陽名園記, s. XII). Ese texto dice que un jardín no puede reunir a la vez seis excelencias (六勝) porque se excluyen por parejas: amplitud frente a recogimiento (宏大・幽邃), artificio humano frente a pátina antigua (人力・蒼古) y abundancia de agua frente a vistas lejanas (水泉・眺望). Ken-roku-en significa «el jardín que reúne los seis».',
      curiosidades: [
        'La linterna Kotoji-tōrō (徽軫灯籠), con forma de instrumento musical. Es el símbolo del jardín, a orillas del estanque Kasumi-ga-ike. Su nombre alude a los puentecillos (kotoji) que sostienen las cuerdas del koto, porque tiene dos patas abiertas. Fíjate también en el puente Nijibashi, delante, que se supone evoca el cuerpo del koto. Una pata es más corta y descansa sobre una piedra.',
        'Yukitsuri: no las verás en mayo. Las cuerdas que protegen las ramas de la nieve se instalan desde el 1 de noviembre, empezando por el pino Karasaki-no-matsu, y se retiran hacia mediados de marzo. Para el pino Karasaki se levantan cinco mástiles y unas 800 cuerdas; en todo el jardín se gastan unos 4.000 kg de cuerda de paja. En mayo puedes buscar ese pino, el de ramaje más espectacular del jardín: lo plantó el 13.º señor con semillas traídas de Karasaki, a orillas del lago Biwa.',
        'La fuente más antigua de Japón, sin bombas. Está en la pendiente entre los estanques Hisago-ike y Kasumi-ga-ike y data de principios de la década de 1860 (era Bunkyū). Funciona solo por la diferencia de nivel con el estanque Kasumi-ga-ike, que la alimenta. El chorro alcanza unos 3,5 m y su altura varía con el nivel del estanque.',
        'En mayo: la Prefectura destaca que los lirios y las azaleas que florecen junto al arroyo sinuoso, vistos desde el puente Hanami-bashi, son de las mejores vistas del jardín. El arroyo se alimenta del canal Tatsumi (辰巳用水).',
      ],
      fuentes: [
        { label: 'Prefectura de Ishikawa — 兼六園の歴史', url: 'https://shiro-niwa.pref.ishikawa.lg.jp/kenrokuen-garden/history.html' },
        { label: 'Prefectura de Ishikawa — 兼六園とは', url: 'https://shiro-niwa.pref.ishikawa.lg.jp/kenrokuen-garden/about.html' },
        { label: 'Kotobank — 兼六園 (日本大百科全書, 日本歴史地名大系, 世界大百科事典)', url: 'https://kotobank.jp/word/%E5%85%BC%E5%85%AD%E5%9C%92-61186' },
        { label: 'Prefectura de Ishikawa — nota de prensa sobre los yukitsuri, oct. 2025 (PDF)', url: 'https://www.pref.ishikawa.lg.jp/kisya/r7/documents/1027_10_kouennryokuti1.pdf' },
        { label: 'るるぶ (JTB) — 噴水', url: 'https://rurubu.jp/andmore/spot/80016291' },
        { label: 'るるぶ (JTB) — 徽軫灯籠', url: 'https://rurubu.jp/andmore/spot/80016529' },
        { label: 'Prefectura de Ishikawa — folleto oficial Kanazawa Castle Park & Kenrokuen (PDF)', url: 'https://shiro-niwa.pref.ishikawa.lg.jp/kanazawa-castle/_wp/wp-content/uploads/2026/01/1de4849db62a52a462a4eb6e92c82f3a.pdf' },
      ],
    },
  ],
  'kanazawa-castillo': [
    {
      nombre: 'Castillo de Kanazawa (金沢城)',
      queEs: 'Antigua sede de los Maeda, señores del dominio de Kaga, durante 14 generaciones. Hoy es un parque prefectural con la puerta Ishikawa-mon original y torres reconstruidas en madera con técnicas tradicionales.',
      historia: 'El solar empezó siendo el Kanazawa Midō, templo-fortaleza de la secta Honganji (Ikkō) fundado en 1546. Oda Nobunaga ordenó a Sakuma Morimasa construir allí un castillo en 1580, y Maeda Toshiie entró en él en 1583. La torre principal (tenshu) ardió por un rayo en 1602 y nunca se reconstruyó: en su lugar se levantó una torre de vigía de tres plantas. Grandes incendios en 1631, 1759, 1808 y 1881 destruyeron palacios y torres. Tras la abolición de los dominios fue cuartel del Ejército (desde 1872); entre 1949 y la mudanza de 1995 fue campus de la Universidad de Kanazawa, y en 1996 la Prefectura adquirió el terreno. En 2001 se completaron la torre Hishi-yagura, el almacén-muralla Gojikken-nagaya y la torre Hashizume-mon tsuzuki-yagura: según la Prefectura, el mayor conjunto de arquitectura castral de madera construido en Japón desde Meiji. Después vinieron Kahoku-mon (2010) y Nezumita-mon (2020).',
      significado: 'Es el centro de poder del dominio más rico del Japón Edo fuera del shogunato. Arquitectónicamente destaca por una combinación que la Prefectura presenta como singular: tejas de plomo y muros namako.',
      curiosidades: [
        'Tejas de plomo (鉛瓦) sobre madera. No son tejas de plomo macizo: sobre un armazón de madera con forma de teja se clavan con clavos de cobre planchas de plomo de 1,8–3 mm. Un análisis del Instituto Nacional de Investigación de Bienes Culturales de Nara dio una pureza de plomo superior al 97 %. Con la lluvia, el plomo se vuelve de un blanco plateado: fíjate en el tono de los tejados, que de lejos parecen nevados. Solo se conservan tejados originales de este tipo en Ishikawa-mon, Sanjikken-nagaya y el templo Zuiryū-ji de Takaoka.',
        'Muros namako (海鼠壁). El zócalo de los muros está cubierto de tejas planas fijadas con clavos en «L», con juntas de argamasa de cal en relieve, como el lomo de un cohombro de mar (namako). El muro supera los 15 cm de grosor para resistir la lluvia y la nieve. La Prefectura subraya que esta combinación de cal blanca, namako y tejas de plomo «no se ve en otros castillos».',
        'Ishikawa-mon, la puerta trasera que sobrevivió. La puerta que da a Kenroku-en era la karamete-mon (puerta trasera). La actual se reconstruyó en 1788 tras el incendio de 1759 y es Bien Cultural Importante desde 1950. Es de tipo masugata: un patio cuadrado cerrado donde el enemigo quedaba expuesto por tres lados. Fíjate en los muros de piedra del patio: en el lado sur la piedra está solo desbastada a cincel y lleva grandes marcas grabadas (kokuin), mientras que del oeste al norte son sillares tallados que encajan sin huecos. Fíjate también en el mirador con frontón curvo (karahafu): en realidad es un ishi-otoshi, una abertura para lanzar piedras.',
      ],
      fuentes: [
        { label: 'Prefectura de Ishikawa — Historia del castillo', url: 'https://shiro-niwa.pref.ishikawa.lg.jp/kanazawa-castle/about/history.php' },
        { label: 'Prefectura de Ishikawa — 鉛瓦の技', url: 'https://shiro-niwa.pref.ishikawa.lg.jp/kanazawa-castle/explore/tile.php' },
        { label: 'Prefectura de Ishikawa — 漆喰壁・海鼠壁の技', url: 'https://shiro-niwa.pref.ishikawa.lg.jp/kanazawa-castle/explore/wall.php' },
        { label: 'Prefectura de Ishikawa — 石川門', url: 'https://shiro-niwa.pref.ishikawa.lg.jp/kanazawa-castle/explore/ishikawamon.php' },
        { label: 'Prefectura de Ishikawa — 菱櫓・五十間長屋・橋爪門続櫓', url: 'https://shiro-niwa.pref.ishikawa.lg.jp/kanazawa-castle/explore/hiyashigura.php' },
        { label: 'Nabunken — 鉛瓦小稿 金沢城の鉛瓦 (Ozawa y Horiki, 2014)', url: 'https://sitereports.nabunken.go.jp/article/22535' },
        { label: 'Prefectura de Ishikawa — folleto oficial (PDF)', url: 'https://shiro-niwa.pref.ishikawa.lg.jp/kanazawa-castle/_wp/wp-content/uploads/2026/01/1de4849db62a52a462a4eb6e92c82f3a.pdf' },
      ],
    },
  ],
  nagamachi: [
    {
      nombre: 'Nagamachi (長町武家屋敷跡) y Casa Nomura (野村家)',
      queEs: 'Antiguo barrio de samuráis de rango medio, con muros de barro (dobei) y el canal Ōnoshō. La Casa Nomura es la residencia de este barrio abierta al público.',
      historia: 'Según la web oficial, Nomura Denbei Nobusada siguió a Maeda Toshiie como vasallo directo cuando este entró en el castillo de Kanazawa en 1583. Sus estipendios crecieron hasta 1.000 y luego 1.200 koku, y la familia ocupó durante once generaciones cargos de jefe de la guardia montada y de magistrado, en una residencia de más de mil tsubo, hasta la abolición de los dominios en 1871. Con el fin del estamento samurái la finca se redujo. Lo que hoy se visita combina partes de la residencia original (muro de barro, jardín) con salones trasladados desde la casa del armador Kubo Hikobee (久保彦兵衛), comerciante de las rutas kitamaebune del puerto de Hashitate (actual Kaga).',
      significado: 'Permite entender cómo vivía la clase media samurái de Kaga y, a la vez, cómo la riqueza pasó a los armadores-comerciantes en el s. XIX: los salones más lujosos de la «casa samurái» los pagó un mercader.',
      curiosidades: [
        'Fíjate en el salón jōdan-no-ma. Era la sala donde se recibía al señor: toda de ciprés hinoki con artesonado, marquetería de palisandro y ébano y tablas de paulownia de seis shaku (unos 1,8 m). Los clavos se esconden tras cubrejuntas calados en caqui negro (kurogaki).',
        'El salón de té en alto. Se sube por escalones de piedra hasta el pabellón Fubaku-an, en el piso superior. Su techo combina paulownia con una tabla de jindai-sugi («cedro de la era de los dioses», madera que ha pasado siglos enterrada). La antesala tiene un suelo de una sola tabla de arce de unos mil años.',
        'El agua del jardín viene del canal Ōnoshō (大野庄用水). Es el canal más antiguo de Kanazawa, de hace unos 400 años y de unos 10 km. Los jardines de las residencias samuráis del barrio toman de él el agua para sus estanques y arroyos sinuosos.',
      ],
      fuentes: [
        { label: 'Casa Nomura — 野村家の由緒', url: 'https://www.nomurake.com/origin' },
        { label: 'Casa Nomura — 上段の間', url: 'https://www.nomurake.com/upper' },
        { label: 'Casa Nomura — 茶室', url: 'https://www.nomurake.com/tearoom' },
        { label: 'Prefectura de Ishikawa — 大野庄用水を訪ねて (PDF)', url: 'https://www.pref.ishikawa.lg.jp/kenounourin/documents/onosyo-yousui2.pdf' },
        { label: 'Good Luck Trip (JTB) — 武家屋敷跡 野村家', url: 'https://www.gltjp.com/ja/directory/item/13534/' },
        { label: 'tabi-mag — 大野庄用水', url: 'https://tabi-mag.jp/is0023/' },
      ],
    },
  ],
  omicho: [
    {
      nombre: 'Mercado Ōmichō (近江町市場)',
      queEs: 'Mercado cubierto de alimentación del centro de Kanazawa, con unas 170 tiendas en callejones estrechos. Los vecinos lo llaman cariñosamente «Omichō» (おみちょ).',
      historia: 'El propio mercado habla de unos 300 años de historia desde la época del dominio, con su tricentenario celebrado en 2021. Según el gremio comercial del mercado, en 1721 (Kyōhō 6) el dominio de Kaga reunió en este solar, cerca del castillo, los mercados que se instalaban a orillas de los ríos. Durante el Edo fue mercado proveedor del dominio.',
      significado: 'Sigue siendo un mercado de abastecimiento para los vecinos, además de un atractivo turístico. Es el punto de entrada de pescado y marisco del mar de Japón en la ciudad.',
      curiosidades: [
        'El barrio es anterior al mercado. Ōmichō ya figura como nombre de barrio en los planos de Kanazawa del período Kanbun–Enpō (hacia 1667–1681), dentro de los «ocho barrios de Oyama» (尾山八町), los más antiguos de la ciudad castillo. El mercado tomó el nombre del barrio, no al revés.',
      ],
      fuentes: [
        { label: 'Mercado Ōmichō — web oficial', url: 'https://ohmicho-ichiba.com/' },
        { label: 'Highlighting Japan (Gobierno de Japón), entrevista al gremio del mercado', url: 'https://www.gov-online.go.jp/eng/publicity/book/hlj/html/201911/201911_03_jp.html' },
        { label: 'tabi-mag — 近江町市場', url: 'https://tabi-mag.jp/is0296/' },
        { label: 'Nabunken — lectura de los planos de Kanazawa de Kanbun y Enpō', url: 'https://sitereports.nabunken.go.jp/en/article/23939/pdf_page' },
        { label: 'JNTO — Omicho Market', url: 'https://www.japan.travel/en/spot/1398/' },
      ],
    },
  ],
  'nishi-chaya': [
    {
      nombre: 'Nishi Chaya-gai (にし茶屋街) y Teramachi (寺町寺院群)',
      queEs: 'Pequeño barrio de casas de té en la orilla oeste del río Sai y, justo al lado, la colina de Teramachi, con decenas de templos. Es un paseo tranquilo y gratuito para una tarde libre.',
      historia: 'Nishi («oeste») nació en 1820, el mismo año y por la misma autorización que Higashi. Teramachi se formó al reagrupar los templos de la ciudad castillo, sobre todo tras los grandes incendios de la era Kan\'ei (s. XVII). Así surgieron tres «barrios de templos» (al pie del Utatsu-yama, en Kodatsuno y en Teramachi), y Teramachi fue el que reunió más templos. Su trazado estaba formado ya a finales del s. XVII. El 28 de diciembre de 2012 el Estado seleccionó el «Distrito de Preservación Teramachi-dai», de unas 22 ha y con 52 templos alineados a lo largo de los antiguos caminos de Noda y de Tsurugi.',
      significado: 'Con esa selección, Ishikawa pasó a tener 8 distritos nacionales de preservación y superó a Kioto como la prefectura con más distritos. Nishi Chaya, en cambio, no es distrito nacional: los barrios de chaya protegidos de Kanazawa son Higashiyama Higashi y Kazuemachi.',
      curiosidades: [
        'El escritor que creció en una casa de té. El pequeño museo gratuito Nishi Chaya Shiryōkan está en el solar de la chaya Yoshiyonerō (吉米楼), donde pasó su infancia el novelista Shimada Seijirō. Fue autor del superventas Chijō (地上, 1919) y murió a los 31 años.',
        'Myōryū-ji (妙立寺), el «templo ninja». Templo nichiren fundado en 1643 por orden del 3.er señor, Maeda Toshitsune. Por fuera parece de dos plantas, pero dentro tiene cuatro pisos y siete niveles, con unas 23 salas y 29 escaleras, escaleras ocultas y trampillas. No tiene nada que ver con ninjas reales: el apodo es moderno. Solo se visita con reserva previa y no admite niños en edad preescolar.',
        'Fíjate en los muros de barro de los templos del antiguo camino de Noda, alineados en línea recta. Según la Prefectura, es el paisaje característico del distrito. El camino lleva hacia el monte Noda, donde está el cementerio de los Maeda.',
      ],
      fuentes: [
        { label: 'Prefectura de Ishikawa — 寺町台 重要伝統的建造物群保存地区 (PDF)', url: 'https://www.pref.ishikawa.lg.jp/kyoiku/bunkazai/kisya-happyou/documents/jyuden.pdf' },
        { label: 'Ayuntamiento de Kanazawa — 東山ひがし (fecha de 1820 de ambos barrios)', url: 'https://www4.city.kanazawa.lg.jp/soshikikarasagasu/bunkazaihogoka/gyomuannai/3/1/1/siteibunkazai/7/5808.html' },
        { label: 'tabi-mag — 金沢市西茶屋資料館', url: 'https://tabi-mag.jp/is0295/' },
        { label: 'Good Luck Trip (JTB) — 妙立寺', url: 'https://www.gltjp.com/ja/directory/item/12569/' },
        { label: 'tabi-mag — 妙立寺', url: 'https://tabi-mag.jp/is0033/' },
      ],
    },
  ],
  'sanmachi-suji': [
    {
      nombre: 'Sanmachi Suji (三町筋)',
      queEs: 'Las tres calles paralelas de comerciantes (Ichi-no-machi, Ni-no-machi y San-no-machi) del casco antiguo de Takayama, con casas de madera de aleros bajos y destilerías de sake en activo.',
      historia: 'Hida fue el centro de la región y, desde finales del s. XVII, territorio directo del shogunato. Las tres calles nacieron como «primera, segunda y tercera calle» (一番町・二番町・三番町) del barrio de mercaderes de la ciudad castillo. El plan de conservación municipal recuerda que Kami-Ichinomachi, Kami-Ninomachi y Kami-Sannomachi sufrieron el gran incendio de 1832 (Tenpō 3) y se reconstruyeron con el estilo tradicional. El distrito «Takayama Sanmachi» fue seleccionado el 3 de febrero de 1979 (4,4 ha, ampliado en 1997). Desde 2004 hay un segundo distrito al norte, Shimo-Ninomachi–Ōshinmachi.',
      significado: 'Según la Agencia de Asuntos Culturales, las casas tienen un entresuelo (chū-nikai) bajo un tejado de poca pendiente y aleros muy salientes. La conservación del barrio la impulsaron los propios vecinos: la asociación de conservación de Kami-Sannomachi, de 1966, es hoy la del grupo del carro Ebisu-tai. Los vecinos se organizan en torno a los «grupos de carroza» (yatai-gumi) del festival.',
      curiosidades: [
        'Fíjate en los aleros: las ménsulas (udegi) que los sostienen están pintadas con gofun, un blanco de concha molida. Dentro de las casas visitables, las vigas sobre el pasillo de tierra están lacadas en laca cruda (ki-urushi). La Agencia de Asuntos Culturales los cita como lo que «merece verse».',
        'El sugidama indica la edad del sake. La bola de ramas de cedro colgada en las destilerías se cuelga verde cuando sale el sake nuevo (en invierno) y va pardeando hacia el otoño, a medida que el sake madura. En mayo la verás ya algo descolorida. La costumbre procede del santuario Ōmiwa (Nara), cuyo cedro sagrado se asocia al dios del sake.',
        'El barrio no se libró del fuego, como a veces se dice: lo que se ve es fruto de reconstrucciones fieles al estilo tradicional tras el incendio de 1832.',
      ],
      fuentes: [
        { label: 'Agencia de Asuntos Culturales — 高山市三町・下二之町大新町 (PDF)', url: 'https://www.bunka.go.jp/seisaku/bunkazai/shokai/hozonchiku/pdf/94428201_45.pdf' },
        { label: 'Ayuntamiento de Takayama — Plan de conservación de Sanmachi (PDF)', url: 'https://www.city.takayama.lg.jp/_res/projects/default_project/_page_/001/023/241/sanmachi_hozonkeikaku.pdf' },
        { label: '和樂web — 杉玉 (declaraciones de la destilería Imanishi)', url: 'https://intojapanwaraku.com/culture/77206/' },
        { label: 'Discover Japan — 杉玉', url: 'https://discoverjapan-web.com/article/24765' },
        { label: 'JNTO — Sanmachi Suji', url: 'https://www.japan.travel/en/spot/152/' },
      ],
    },
  ],
  'miyagawa-asaichi': [
    {
      nombre: 'Mercado matutino de Miyagawa (宮川朝市)',
      queEs: 'Mercado diario de mañana a orillas del río Miyagawa, entre los puentes Kaji-bashi y Yayoi-bashi. Se venden verduras, encurtidos, flores y artesanía local.',
      historia: 'Según el propio mercado, su antecedente es un mercado de morera (kuwa-ichi, hojas para alimentar gusanos de seda) que hacia 1819 se celebraba frente al templo Takayama Betsuin, con verduras y flores como venta secundaria. Hacia la década de 1890 se convirtió en mercado de verduras de cosecha propia. En 1922 la asociación agraria de Ōno abrió un mercado frente a la oficina comarcal (la Jinya). Durante la guerra, el racionamiento lo paralizó y en la posguerra hubo mercados negros. Tras varios traslados, el 1 de mayo de 1960 se inauguró en el cauce del Miyagawa como «Mercado de Miyagawa»: un terreno sin pavimentar en el que los propios comerciantes levantaron puestos y vallas.',
      significado: 'Junto con el mercado frente a la Jinya (陣屋前朝市), es heredero directo de la economía de la seda y de la venta directa del agricultor. Ambos se citan entre los mercados matutinos más importantes de Japón.',
      curiosidades: [
        'Nació de los gusanos de seda. Hasta Meiji lo que se vendía aquí era sobre todo hoja de morera para la sericultura, la gran industria de Hida. Las verduras eran secundarias.',
        'Aniversario en mayo. El emplazamiento junto al río se estrenó un 1 de mayo (1960). Si vas el 13–17 de mayo de 2027, el mercado cumple 67 años en ese lugar.',
      ],
      fuentes: [
        { label: 'Asociación del mercado Miyagawa — 朝市の歴史', url: 'https://www.asaichi.net/history/index.html' },
        { label: 'Federación de Turismo de Gifu — 宮川朝市', url: 'https://www.kankou-gifu.jp/spot/detail_1241.html' },
        { label: 'tabi-mag — 陣屋前朝市', url: 'https://tabi-mag.jp/gi0082/' },
      ],
    },
  ],
  'takayama-jinya': [
    {
      nombre: 'Takayama Jinya (高山陣屋)',
      queEs: 'Antigua sede del gobierno directo del shogunato en la provincia de Hida (oficina del daikan, después gundai). Es el único lugar de Japón donde se conservan los edificios principales de una de estas oficinas.',
      historia: 'Hida estuvo gobernada por el clan Kanamori (dominio de Takayama) hasta 1692 (Genroku 5), cuando el shogunato los trasladó a Kaminoyama (Dewa) y convirtió Hida en territorio directo. En 176 años, hasta 1868, se sucedieron 25 daikan o gundai. En 1777, bajo el 12.º daikan, Ōhara, el cargo ascendió a gundai por el aumento de la producción registrada tras un nuevo catastro. Tras Meiji siguió siendo centro administrativo de Hida y sirvió como oficina prefectural hasta 1969, unos 277 años de uso. Es Sitio Histórico Nacional desde 1929 y en 1996, tras unos 26 años de obras, recuperó su aspecto Edo. De las más de 60 oficinas de daikan/gundai que había a finales del Edo, solo aquí se conservan los edificios principales.',
      significado: 'Representa el control directo del shogunato sobre un territorio estratégico por sus bosques y minas. Es un caso único para entender la administración local del Edo: ventanilla de peticiones, tribunal, almacén de impuestos en arroz.',
      curiosidades: [
        'El granero vino del castillo. El okura (御蔵, almacén de arroz) se trasladó aquí en 1695 desde el tercer recinto del castillo de Takayama, ya desmantelado. Se cree construido hacia 1600 y la web oficial lo presenta como uno de los graneros Edo más antiguos y grandes que se conservan. Fíjate en su tejado de tablas sin clavos, sujetas con varas y piedras (ishioki-nagakure-buki): cada cinco años se les da la vuelta (arriba-abajo y cara-envés) para alargar su vida.',
        'Dos oshirasu distintas. Hay dos patios de grava: uno era la «ventanilla» donde los pueblos presentaban peticiones y quejas, y el otro el tribunal donde se juzgaba.',
        'Busca los conejos. Los cubreclavos de los dinteles tienen forma de conejo visto de frente (makō-usagi, 真向兎). La web oficial reconoce que no se sabe por qué se eligió el conejo.',
        'Las olas de la entrada son una copia. El motivo de olas seigaiha de la hornacina del vestíbulo es una reproducción; el original se expone dentro del granero.',
      ],
      fuentes: [
        { label: 'Takayama Jinya (Prefectura de Gifu) — 高山陣屋について', url: 'https://jinya.gifu.jp/about/' },
        { label: 'Takayama Jinya — 見どころ', url: 'https://jinya.gifu.jp/highlight/' },
        { label: 'Ayuntamiento de Takayama — Lista de bienes culturales (PDF)', url: 'https://www.city.takayama.lg.jp/_res/projects/default_project/_page_/001/018/881/list00.pdf' },
        { label: 'Takayama Jinya — About', url: 'https://jinya.gifu.jp/en/about/' },
      ],
    },
  ],
  'takayama-yatai': [
    {
      nombre: 'Sala de Exposición de Carrozas del Festival de Takayama (高山祭屋台会館) y Sakurayama Hachimangū (櫻山八幡宮)',
      queEs: 'Sakurayama Hachimangū es el santuario del festival de otoño de Takayama (Hachiman Matsuri, 9–10 de octubre). En su recinto, la Sala de Exposición de Carrozas muestra carrozas auténticas del festival. Al lado, el Sakurayama Nikkōkan expone una maqueta del santuario Tōshōgū de Nikkō.',
      historia: '«Festival de Takayama» es el nombre conjunto del festival de primavera (Sannō Matsuri, 14–15 de abril, santuario Hie) y del de otoño (Hachiman Matsuri). El documento más antiguo que lo menciona es de 1692 y se refiere a un Sannō Matsuri celebrado unos 40 años antes. Las carrozas (yatai) aparecen documentadas por primera vez en el Hachiman Matsuri de 1718. Las 23 carrozas son Bien Cultural Popular Tangible Importante desde 1960, y el festival con sus carrozas es Bien Cultural Popular Intangible Importante desde 1979. En 2016 entró en la lista de Patrimonio Cultural Inmaterial de la UNESCO dentro de la candidatura conjunta «Yama, Hoko, Yatai» (山・鉾・屋台行事), que agrupa 33 festivales de carrozas de 18 prefecturas y fue anunciada por la Agencia de Asuntos Culturales el 1 de diciembre de 2016.',
      significado: 'Las carrozas son la obra colectiva de los barrios de mercaderes y de la tradición de los Hida no takumi (飛騨の匠), los carpinteros de Hida. Según la Agencia de Turismo, en 757 el código Yōrō estableció que Hida, en lugar de pagar impuestos, enviara cada año carpinteros a la capital. El artículo 39 del Fuyakuryō (código de prestaciones) eximía a Hida de los tributos yō y chō a cambio de que cada aldea aportara diez artesanos por turnos de un año, unos 100 al año en total, en grupos de cinco. Trabajaron en Tōdai-ji, Ishiyama-dera y Kasuga Taisha. El sistema desapareció en época Kamakura, pero la fama del oficio no.',
      curiosidades: [
        'Solo cuatro de las 11 carrozas de otoño, rotadas tres veces al año, se exponen a la vez. Son las reales, no réplicas.',
        'Marionetas mecánicas. Hoy solo 4 de las 23 carrozas tienen karakuri: Sanbasō, Sekkyō-tai y Ryūjin-tai en primavera, y Hotei-tai en otoño. En la de Hotei, dos niños-marioneta (karako) cruzan unas barras haciendo volteretas y acaban aterrizando sobre los hombros del dios Hotei; los manipulan desde dentro equipos que tiran de decenas de cuerdas.',
      ],
      fuentes: [
        { label: 'Agencia de Turismo — 高山祭 (PDF)', url: 'https://www.mlit.go.jp/tagengo-db/common/001558907.pdf' },
        { label: 'Agencia de Turismo — からくり人形 (PDF)', url: 'https://www.mlit.go.jp/tagengo-db/common/001558908.pdf' },
        { label: 'Agencia de Turismo — 飛騨の匠 (PDF)', url: 'https://www.mlit.go.jp/tagengo-db/common/001558913.pdf' },
        { label: 'Agencia Tributaria — 賦役令と飛騨の匠丁', url: 'https://www.nta.go.jp/about/organization/ntc/sozei/quiz/1008/index.htm' },
        { label: 'Ayuntamiento de Takayama — Lista de bienes culturales (PDF)', url: 'https://www.city.takayama.lg.jp/_res/projects/default_project/_page_/001/018/881/list00.pdf' },
        { label: 'Federación de Turismo de Gifu — 高山祭屋台会館', url: 'https://www.kankou-gifu.jp/spot/detail_1244.html' },
        { label: 'Federación de Turismo de Gifu — 桜山日光館', url: 'https://www.kankou-gifu.jp/spot/detail_9176.html' },
        { label: 'Ministerio de Asuntos Exteriores — 「山・鉾・屋台行事」登録', url: 'https://www.mofa.go.jp/mofaj/press/release/press4_001865.html' },
        { label: 'Agencia de Turismo — Hida no Takumi', url: 'https://www.mlit.go.jp/tagengo-db/R3-00670.html' },
      ],
    },
  ],
  'shirakawago-ogimachi': [
    {
      nombre: 'Shirakawa-gō, aldea de Ogimachi (白川郷 荻町)',
      queEs: 'Aldea de montaña en el valle del río Shō (Gifu) con el mayor conjunto de casas de tejado de paja gasshō-zukuri. Es Patrimonio Mundial desde 1995 junto con Ainokura y Suganuma (Gokayama, Toyama).',
      historia: 'Según la Agencia de Asuntos Culturales, la casa gasshō se desarrolló porque, desde mediados del Edo, se difundieron la sericultura y la fabricación de salitre (enshō). Hacia 1971 las casas gasshō de Ogimachi se habían reducido a la mitad (presas, emigración), y ese año los vecinos fundaron por unanimidad la asociación para proteger el entorno de la aldea. Su lema son tres principios: no vender, no alquilar, no derribar (売らない・貸さない・壊さない). En 1976 fue seleccionada como distrito de preservación (45,6 ha) y a finales de 1995 entró en la lista del Patrimonio Mundial. La Prefectura de Gifu cuenta 114 edificios gasshō grandes y pequeños; la cifra de «59» que dan algunas guías parece contar solo las viviendas principales.',
      significado: 'Es un modelo de arquitectura vernácula adaptada a la nieve y a la economía de montaña. Los desvanes de varios pisos servían para la cría de gusanos de seda, y los tejados de unos 60° de pendiente hacen resbalar la nieve. También es un ejemplo vivo de organización comunitaria.',
      curiosidades: [
        'Pólvora bajo el suelo. Junto al hogar (irori) de las casas se excavaba un foso de hasta 2 m donde se fermentaban durante unos cinco años capas de paja, tierra, artemisa y excrementos de gusano de seda. El calor del fuego mantenía activa la fermentación, y una vez al año se removía. De esa tierra se extraía el salitre. Los aldeanos vendían el producto bruto a tres refinerías autorizadas de Shirakawa-gō, y el mayor comprador era el dominio de Kaga, que llegó a adquirir más de la mitad. En Gokayama, territorio de Kaga, la producción se ocultaba incluso al shogunato. La industria murió en Meiji, con la llegada del nitrato de Chile. Busca las explicaciones sobre el enshō en la casa Wada (和田家), Bien Cultural Importante, cuya familia prosperó con este comercio.',
        'Yui con contabilidad. El yui (結) era ayuda mutua estricta, no caridad: lo que cada familia aportaba en un retechado (mano de obra, paja, comida) se anotaba en un libro, el yui-chō, para devolverlo con exactitud. El yui-chō más antiguo que se conserva es de 1792. En el retechado de una casa grande trabajan a la vez de 100 a 200 personas sobre el tejado, en un solo día.',
        'Hoy el yui es la excepción. En 2023 los vecinos hicieron un retechado comunitario por primera vez en cinco años, tras la pandemia. Los tejados del museo al aire libre Gasshō-zukuri Minka-en los retechan artesanos profesionales.',
      ],
      fuentes: [
        { label: 'Agencia de Asuntos Culturales — 白川村荻町 (PDF)', url: 'https://www.bunka.go.jp/seisaku/bunkazai/shokai/hozonchiku/pdf/94428201_50.pdf' },
        { label: 'Agencia de Turismo — 白川郷における煙硝の生産 (PDF)', url: 'https://www.mlit.go.jp/tagengo-db/common/001556265.pdf' },
        { label: 'Agencia de Turismo — 五箇山の塩硝づくり (PDF)', url: 'https://www.mlit.go.jp/tagengo-db/common/001553145.pdf' },
        { label: 'Agencia de Turismo — 結 (DOCX)', url: 'https://www.mlit.go.jp/tagengo-db/common/001779667.docx' },
        { label: 'Agencia de Turismo — 民家園 (PDF)', url: 'https://www.mlit.go.jp/tagengo-db/common/001558846.pdf' },
        { label: 'Agencia de Turismo — 白川郷荻町集落の自然環境を守る会', url: 'https://www.mlit.go.jp/tagengo-db/R2-00130.html' },
        { label: 'Federación de Turismo de Gifu — 和田家', url: 'https://www.kankou-gifu.jp/kyouiku/spot/detail_3068.html' },
        { label: 'Asociación de Turismo de Shirakawa-gō', url: 'https://shirakawa-go.gr.jp/en/highlights/' },
        { label: 'UNESCO — Historic Villages of Shirakawa-go and Gokayama', url: 'https://whc.unesco.org/en/list/734/' },
      ],
    },
  ],
  'hida-no-sato': [
    {
      nombre: 'Hida no Sato (飛騨の里)',
      queEs: 'Museo al aire libre de Takayama (también llamado Hida Minzoku-mura) con unas treinta casas y construcciones rurales de la región de Hida, trasladadas y reconstruidas alrededor de un estanque. Cuatro son Bien Cultural Importante.',
      historia: 'Reúne casas de labradores con tejado de paja de época Edo y Meiji, casas gasshō y graneros de tablones (itakura). Entre los Bienes Culturales Importantes están la casa Wakayama (旧若山家住宅), procedente de la antigua aldea de Shōkawa (荘川村) y no de Shirakawa-gō, y la casa Yoshizane (旧吉真家住宅), ambas designadas en 1977.',
      significado: 'Complementa Shirakawa-gō. Allí se ve el paisaje vivo, con casas habitadas que solo en parte se visitan; aquí se recorren los interiores completos y se comparan los tipos constructivos de Hida: gasshō, tejado de tablas con piedras (kure-buki) y casas de labrador.',
      curiosidades: [
        'Compara los tejados. Junto a los de paja hay tejados de tablas sujetas con piedras (kure-buki), la misma técnica que verás en el granero de la Takayama Jinya. Era el tejado de las zonas donde abundaba la madera.',
      ],
      fuentes: [
        { label: 'Federación de Turismo de Gifu — 飛騨の里', url: 'https://www.kankou-gifu.jp/spot/detail_1232.html' },
        { label: 'Ayuntamiento de Takayama — Lista de bienes culturales (PDF)', url: 'https://www.city.takayama.lg.jp/_res/projects/default_project/_page_/001/018/881/list00.pdf' },
        { label: 'Ayuntamiento de Takayama — Plan de reordenación del entorno del Hida Minzoku-mura (PDF)', url: 'https://www.city.takayama.lg.jp/_res/projects/default_project/_page_/001/012/204/hidaminzokumura_saiseibi.pdf' },
        { label: 'Good Luck Trip (JTB) — 飛騨の里', url: 'https://www.gltjp.com/ja/directory/item/11637/' },
      ],
    },
  ],
  'kiyomizu-dera': [
    {
      nombre: 'Kiyomizu-dera (清水寺)',
      queEs: 'Templo budista de la escuela Kita-Hossō en la ladera del monte Otowa, dedicado a Kannon de once cabezas y mil brazos (imagen secreta, hibutsu). Su sala principal (Hondō, Tesoro Nacional) se asoma al vacío con el famoso «escenario» de madera.',
      historia: 'Según la crónica fundacional del templo (『清水寺縁起』), en 778 el monje Kenshin (賢心, después llamado Enchin) encontró una cascada de agua pura en el monte Otowa; dos años más tarde, el general Sakanoue no Tamuramaro, que había venido a cazar ciervos, le ayudó a levantar el templo y lo bautizó «Kiyomizu» («agua pura») por esa cascada. El expediente UNESCO de la Agencia de Asuntos Culturales habla de templo privado en 780 y de templo de petición imperial en 805. Ha ardido más de diez veces; casi todo lo que se ve es la reconstrucción de los años 1630, tras el incendio de 1629. La sala principal y su escenario son de 1633, levantados con el apoyo del shōgun Tokugawa Iemitsu. Entre 2008 y 2020, aproximadamente, se hizo la gran restauración «de Heisei» (cubierta de corteza de ciprés y suelo del escenario).',
      significado: 'Es uno de los grandes centros de peregrinación a Kannon abiertos al pueblo llano desde la época Heian, y el escenario se convirtió en sinónimo de «lugar alto» en todo Japón. Desde 1965 encabeza su propia rama, el budismo Kita-Hossō («Hossō del norte», por oposición a Nara).',
      curiosidades: [
        'Sin clavos, de verdad. Según el propio templo, el escenario (unos 13 m de altura, el equivalente a un edificio de cuatro plantas) se apoya en 18 pilares de keyaki (olmo japonés) de más de 400 años, los mayores de unos 12 m de largo y 2 m de perímetro, atravesados por vigas horizontales (nuki) con ensambles de carpintería (継ぎ手) y sin un solo clavo. Fíjate en la retícula de madera desde el camino de bajada hacia la cascada.',
        'El escenario no está pensado para mirar el paisaje. El templo explica que es una plataforma para ofrecer música y danza a Kannon: el lugar «correcto» es de espaldas a la vista, mirando hacia el santuario interior. Su suelo son 166 tablones de ciprés (hinoki) cambiados en la restauración de Heisei; de ahí la expresión 檜舞台 («subir al escenario de ciprés»), aunque el templo reconoce que no está demostrado que la frase naciera aquí.',
        'El refrán «saltar desde el escenario de Kiyomizu» (清水の舞台から飛び降りる) significa lanzarse a una decisión arriesgada. Nació de una práctica real: en época Edo había quien saltaba encomendándose a Kannon, convencido de que si salía ileso su deseo se cumpliría. El diario oficial del subtemplo Jōju-in (『成就院日記』) registra casos concretos; por ejemplo, un joven que saltó en 1834 y cayó unos 12 m sin un rasguño.',
        'El agua de Otowa no «reparte» especialidades. La web oficial dice que el agua se ha llamado desde antiguo «agua dorada» y «agua de larga vida», y que se bebe para purificar los seis sentidos y pedir que se cumplan los deseos. La idea de que cada uno de los tres caños da una cosa distinta (longevidad, amor, estudios) es una creencia popular que el templo no recoge. Otro detalle: desde 2000 el templo cultiva keyaki en tres montes de la prefectura para poder sustituir los pilares dentro de unos siglos.',
      ],
      fuentes: [
        { label: 'Kiyomizu-dera — 歴史 (fundación, escenario, 18 pilares, sin clavos, refrán)', url: 'https://www.kiyomizudera.or.jp/history.php' },
        { label: 'Kiyomizu-dera — 境内案内 (Hondō 1633, Otowa no taki, Koyasu-tō)', url: 'https://www.kiyomizudera.or.jp/map.php' },
        { label: 'Kiyomizu-dera — これまでの400年、これからの400年 (cultivo de keyaki desde 2000)', url: 'https://www.kiyomizudera.or.jp/read/%E3%81%93%E3%82%8C%E3%81%BE%E3%81%A7%E3%81%AE400%E5%B9%B4%E3%80%81%E3%81%93%E3%82%8C%E3%81%8B%E3%82%89%E3%81%AE400%E5%B9%B4%E3%80%82' },
        { label: 'Agencia de Asuntos Culturales — expediente UNESCO, 清水寺 (780, 805, 1633, kakezukuri)', url: 'https://online.bunka.go.jp/suisensyo/kyoto/MAINTEXT/3b-D-j.html' },
        { label: 'Biblioteca de la Dieta Nacional — 清水寺 (altura, «hinoki butai», Gikeiki)', url: 'https://www.ndl.go.jp/landmarks/column/kiyomizudera' },
        { label: 'Ayuntamiento de Kioto — 清水寺周辺エリア (reconstrucción con ayuda de Iemitsu)', url: 'https://www.city.kyoto.lg.jp/tokei/cmsfiles/contents/0000339/339942/04_kiyomizudera.pdf' },
        { label: 'Bungeishunjū — salto de 1834 en el 成就院日記', url: 'https://bunshun.jp/bungeishunju/articles/h10835' },
        { label: 'Keihan — 清水の舞台から飛び降りる', url: 'https://www.keihan.co.jp/navi/kyoto_tsu/tsu201605.html' },
      ],
    },
  ],
  'higashiyama-sannenzaka': [
    {
      nombre: 'Sannenzaka y Ninenzaka (産寧坂・二寧坂)',
      queEs: 'Las dos cuestas empedradas y escalonadas que bajan de Kiyomizu-dera hacia Yasaka, con casas de madera (machiya) de finales de Edo a la era Taishō. Se escriben también 三年坂 y 二年坂.',
      historia: 'El 4 de septiembre de 1976 el Estado seleccionó el «distrito de Sannenzaka» como Zona Importante de Preservación de Grupos de Edificios Tradicionales, en la primera tanda del sistema, el mismo día que otros seis distritos, entre ellos Gion Shinbashi y Shirakawa-gō (Ogimachi). Hoy hay 130 zonas así en todo Japón (septiembre de 2026). El Ayuntamiento describe el conjunto como escalones y calles empedradas en zigzag con casas de finales de Edo a Taishō, y sitúa el crecimiento del caserío a mediados del siglo XVII.',
      significado: 'Es la imagen del «Kioto de postal» a pie de calle. Las tiendas de recuerdos y las casas de té que la bordean continúan la tradición de los itinerarios de peregrinos de época Edo hacia Kiyomizu.',
      curiosidades: [
        'El nombre ya era un misterio en 1762. La guía 『京町鑑』 (1762) recogía dos explicaciones: que la cuesta se abrió en el año 3 de la era Daidō (808), de ahí «la cuesta del año tres», o que lleva al templo Taisan-ji, de partos, de ahí 産寧坂, «cuesta del parto sereno». Y añadía: «ninguna de las dos tiene fundamento, pero así se cuenta». El templo del parto es el Koyasu-tō, la pagoda de tres pisos de Kiyomizu dedicada a los partos felices (edificio de 1500).',
        'Ninenzaka (二年坂) significa simplemente «la cuesta de antes de Sannenzaka». Así lo explica la revista de JR West; también recoge una tercera etimología popular, 再念坂, «cuesta de renovar el voto».',
        'La maldición y su antídoto. Se dice que quien se cae en Sannenzaka muere en tres años. Al pie de la cuesta, la tienda Hyōtan-ya (fundada en 1837) vende calabazas (hyōtan): según la tradición, la calabaza vuelve a encerrar el alma que «se escapa» con la caída. Busca su fachada al bajar.',
        'Fíjate en el pavimento de Ichinenzaka y Ninenzaka: según JR West, sus losas son adoquines reutilizados del antiguo tranvía de Kioto. En Ninenzaka está también la casa donde vivió el pintor Takehisa Yumeji con su amante Hikono.',
      ],
      fuentes: [
        { label: 'Agencia de Asuntos Culturales — lista de 重要伝統的建造物群保存地区 (Sannenzaka y Gion Shinbashi, 昭51.9.4)', url: 'https://www.bunka.go.jp/seisaku/bunkazai/shokai/hozonchiku/judenken_ichiran.html' },
        { label: 'Agencia de Asuntos Culturales — 伝統的建造物群保存地区 (130 zonas, 4 de septiembre de 2026)', url: 'https://www.bunka.go.jp/seisaku/bunkazai/shokai/hozonchiku/' },
        { label: 'Kotobank — 三年坂 (cita del 『京町鑑』, 1762)', url: 'https://kotobank.jp/word/%E4%B8%89%E5%B9%B4%E5%9D%82-71287' },
        { label: 'JR West, Blue Signal — 三年坂 京都千年の散歩道 (etimologías, Hyōtan-ya 1837, adoquines del tranvía)', url: 'https://www.westjr.co.jp/company/info/issue/bsignal/04_vol_95/feature02.html' },
        { label: 'Ayuntamiento de Kioto — 清水寺周辺エリア', url: 'https://www.city.kyoto.lg.jp/tokei/cmsfiles/contents/0000339/339942/04_kiyomizudera.pdf' },
        { label: 'Kiyomizu-dera — 境内案内 (Koyasu-tō)', url: 'https://www.kiyomizudera.or.jp/map.php' },
      ],
    },
    {
      nombre: 'Kōdai-ji (高台寺)',
      queEs: 'Templo zen (escuela Rinzai, rama Kennin-ji) fundado por Nene, la esposa de Toyotomi Hideyoshi, para rezar por él. Está entre Ninenzaka y Maruyama, sobre la calle que lleva su nombre (ねねの道).',
      historia: 'Tras la muerte de Hideyoshi (1598), su viuda Kita no Mandokoro (Nene, que al tomar los hábitos se llamó Kōdai-in) fundó el templo en 1606. En 1624 se incorporó como fundador el monje Sankō, de Kennin-ji, y adoptó el nombre de Kōdai-ji. Según el templo, Tokugawa Ieyasu lo financió con generosidad «por consideraciones políticas», y el conjunto llegó a ser espléndido. Nene murió el 6 de septiembre de 1624, a los 76 años. Se conservan como Bienes Culturales Importantes el Kaisan-dō, el mausoleo Otamaya, los pabellones de té Kasa-tei y Shigure-tei, la puerta principal y el pabellón para ver la luna (Kangetsudai), entre otros.',
      significado: 'Es el gran memorial de los Toyotomi en Kioto y el escaparate del arte Momoyama aplicado a la arquitectura. Su laca dio nombre a un estilo: el «maki-e de Kōdai-ji».',
      curiosidades: [
        'Nene está enterrada bajo su propia estatua. En el Otamaya se veneran figuras de Hideyoshi y de Nene, y el templo indica que la tumba de ella está debajo de su imagen. Fíjate en el altar y en los relicarios: laca negra con oro espolvoreado (maki-e), el llamado 高台寺蒔絵.',
        'Los pabellones de té Kasa-tei («del paraguas») y Shigure-tei proceden, según la tradición, del castillo de Fushimi de Hideyoshi.',
        'Un Kannon androide. Desde 2019 el templo tiene a «Mindar», un androide de Kannon de 1,95 m desarrollado con la Universidad de Osaka (laboratorio de Hiroshi Ishiguro), que predica el Sutra del Corazón. El proyecto costó unos 100 millones de yenes y también recibió críticas por considerarse una falta de respeto.',
        'El jardín de estanque se atribuye a Kobori Enshū, y el bosquecillo de bambú del recinto está dentro de la zona de pago.',
      ],
      fuentes: [
        { label: 'Kōdai-ji — 歴史 (1606, 1624, Ieyasu, Otamaya, maki-e)', url: 'https://www.kodaiji.com/rekishi.html' },
        { label: 'Kōdai-ji — 拝観 (Mindar, bambú)', url: 'https://www.kodaiji.com/haikan.html' },
        { label: 'CNN Japan — 「アンドロイド観音」が登場、仏教に変革の風 高台寺 (2019)', url: 'https://www.cnn.co.jp/tech/35142333.html' },
        { label: 'Keihan — restos del castillo de Fushimi en Kōdai-ji', url: 'https://www.keihan.co.jp/navi/kyoto_tsu/tsu202207.html' },
        { label: 'JR West, Blue Signal — ねねの道', url: 'https://www.westjr.co.jp/company/info/issue/bsignal/04_vol_95/feature02.html' },
      ],
    },
  ],
  gion: [
    {
      nombre: 'Yasaka Jinja y Parque Maruyama (八坂神社・円山公園)',
      queEs: 'El santuario «Gion-san», al final de la calle Shijō, guardián oriental de la capital y organizador del Gion Matsuri. Detrás está Maruyama, el parque público más antiguo de Kioto.',
      historia: 'El santuario recoge dos tradiciones sobre su fundación: en 656, Iri-shi, llegado de Koguryŏ, instaló aquí a Susanoo, venerado en el monte Gozu de Silla; o en 876, el monje Ennyo, de Nara, construyó un oratorio y ese mismo año el dios de Gion «descendió» al bosque. Su auge empezó en 877, cuando las plegarias en este pequeño santuario detuvieron una epidemia. Hasta Meiji se llamó Gion-sha o Kanshin-in y era un centro mixto de budismo y sintoísmo. El Gion Matsuri nace de un rito de 869: ante una epidemia se alzaron 66 alabardas (hoko), una por cada provincia de la época, y se llevó el palanquín sagrado al jardín imperial Shinsen-en. El santuario actual es de 1654 y fue declarado Tesoro Nacional en diciembre de 2020. El parque Maruyama se abrió en 1886 como el primer parque de la ciudad, pasó al municipio en 1889 y es Lugar de Belleza Escénica nacional desde el 21 de octubre de 1931.',
      significado: 'Yasaka es el santuario de barrio de Gion y de los gremios de Kioto, y su festival, en julio, es el más famoso del país. En mayo no hay Gion Matsuri, pero su huella se ve todo el año.',
      curiosidades: [
        'Un solo tejado para dos edificios. El santuario principal cubre bajo un único gran tejado el santuario (honden) y la sala de oración (haiden), un diseño que el santuario considera único y de origen Heian. Según el propio santuario, la reconstrucción de 1654 fue la última obra religiosa costeada directamente por el shogunato.',
        'Un «pozo del dragón» bajo el altar. Según la tradición, el santuario se alza sobre un estanque donde vive el Dragón Azul, guardián del este de Kioto. Una crónica medieval cuenta que intentaron sondearlo en 1070 y no tocaron fondo a 50 jō (unos 150 m). Hoy está sellado con argamasa, pero un artesano que trabajó en la restauración de 1905 dejó testimonio de haber visto el agua. Fíjate en la base de los perros guardianes tras la puerta oeste: está decorada con los cuatro animales guardianes y el dragón.',
        'La puerta oeste (Nishi-rōmon, 1497) se movió. Es el edificio más antiguo del santuario y en 1913, al ensanchar la calle Shijō, se desplazó unos 6 m al este y 3 m al norte. Dentro, la piedra 月下氷人石 servía en Edo y Meiji de «tablón de anuncios» para buscar a niños y personas perdidas: se pegaban papeles en sus caras «busco» y «sé dónde está».',
        'Busca los amuletos «蘇民将来子孫也» («descendiente de Somin Shōrai»): según la leyenda, Susanoo prometió librar de la peste a quien se declarara descendiente de Somin Shōrai, que le dio cobijo. En julio se reparten amuletos de hoja de bambú (chimaki) que se cuelgan del alero. En el pabellón de danza (Buden) cuelgan los farolillos ofrecidos por las ochaya y los restaurantes de los barrios de geishas.',
      ],
      fuentes: [
        { label: 'Yasaka Jinja — 八坂神社の歴史 (656/876, 869, 66 hoko)', url: 'https://www.yasaka-jinja.or.jp/about/history/' },
        { label: 'Yasaka Jinja — 八坂神社の建造物 (Tesoro Nacional 2020, 1654, pozo del dragón, puerta oeste)', url: 'https://www.yasaka-jinja.or.jp/about/architecture/' },
        { label: 'Yasaka Jinja — 祇園祭 (蘇民将来, chimaki)', url: 'https://www.yasaka-jinja.or.jp/event/gion/' },
        { label: 'Yasaka Jinja — 境内見どころ (月下氷人石, Buden)', url: 'https://www.yasaka-jinja.or.jp/about/sightseeing_spot/' },
        { label: 'Ayuntamiento de Kioto — Plan de conservación del Lugar de Belleza Escénica Maruyama, cap. 1 (1886, 1889, 1931)', url: 'https://www.city.kyoto.lg.jp/kensetu/cmsfiles/contents/0000222/222792/1syo.pdf' },
        { label: 'Ayuntamiento de Kioto — 名勝円山公園 (motivo de la declaración, Ueji)', url: 'https://www.city.kyoto.lg.jp/kensetu/cmsfiles/contents/0000185/185898/iin2-1.pdf' },
      ],
    },
    {
      nombre: 'Gion y Hanami-kōji (祇園・花見小路)',
      queEs: 'El barrio de geishas (hanamachi) más grande de Kioto, nacido como calle de casas de té ante Yasaka Jinja. Hanami-kōji es su eje, con ochaya (casas donde se celebran los banquetes con geiko y maiko) a ambos lados.',
      historia: 'Desde la era Kan\'ei (1624–1644) prosperó como barrio de casas de té a las puertas del santuario, y en el siglo XVIII desplazó al barrio oficial de Shimabara como centro del ocio de Kioto. En 1872, para atraer visitantes a una ciudad hundida por la marcha de la corte a Tokio, Inoue Yachiyo III creó el Miyako Odori, un espectáculo vinculado a la primera Exposición de Kioto. En 1881 el gobernador dividió el barrio en dos: Gion Kōbu y la actual Gion Higashi. Kioto tiene cinco barrios de geishas (Gion Kōbu, Miyagawa-chō, Ponto-chō, Kamishichiken y Gion Higashi). La zona de Shirakawa (Gion Shinbashi) es Zona Importante de Preservación desde el 4 de septiembre de 1976.',
      significado: 'En Kioto se dice geiko (no geisha), y las aprendices son maiko. Hoy solo se puede ser maiko después de terminar la secundaria obligatoria; tras 5 o 6 años, la maiko pasa a geiko y debe establecerse por su cuenta. Las geiko se especializan en danza (tachikata) o en música (jikata); estas últimas escasean cada vez más.',
      curiosidades: [
        'Ichigen-san okotowari (一見さんお断り, «no se atiende a quien viene por primera vez»): las ochaya solo reciben a clientes presentados por otro cliente de confianza. Ichigen es, según el diccionario, «la persona a la que se ve por primera vez».',
        'Fíjate en los farolillos de las ochaya de Gion Kōbu: llevan el emblema del barrio, ocho bolitas de dango encadenadas con el carácter 甲. Gion Higashi usa las ocho bolitas sin carácter, y Kamishichiken, cinco dango en círculo.',
        'En la esquina de Shijō con Hanami-kōji, la ochaya de muro rojo Ichiriki (一力, antes Man-tei) está ligada al drama 『仮名手本忠臣蔵』 (la historia de los 47 rōnin), donde Ōishi Kuranosuke finge una vida disipada en esta casa.',
        'Dato práctico para mayo: el Miyako Odori es en abril, pero el Kamogawa Odori de Ponto-chō se celebra en mayo. Normas de Gion Sur (Ayuntamiento y Asociación de Turismo): no detener, tocar, seguir ni fotografiar sin permiso a geiko y maiko, y no entrar en callejones privados. Molestar en la calle puede acabar en multa según la normativa.',
      ],
      fuentes: [
        { label: 'Fundación Ookini (oficial de los cinco barrios de geishas) — 五花街の紹介 (1881, Miyako Odori 1872, emblemas, Kamogawa Odori en mayo)', url: 'https://www.ookinizaidan.com/kagai/' },
        { label: 'Fundación Ookini — 舞妓について / 芸妓について', url: 'https://www.ookinizaidan.com/kagai/maiko/' },
        { label: 'Kotobank — 祇園 (Shimabara, Ichiriki/Man-tei, 1872, Gion Shinbashi)', url: 'https://kotobank.jp/word/%E7%A5%87%E5%9C%92-239292' },
        { label: 'Kotobank — 一力茶屋 / 一見', url: 'https://kotobank.jp/word/%E4%B8%80%E5%8A%9B%E8%8C%B6%E5%B1%8B-433849' },
        { label: 'Agencia de Asuntos Culturales — lista de 重伝建 (Gion Shinbashi, 1976)', url: 'https://www.bunka.go.jp/seisaku/bunkazai/shokai/hozonchiku/judenken_ichiran.html' },
        { label: 'Kyoto City Tourism Association — Gion manner (Message from Southern Gionmachi)', url: 'https://kyoto.travel/en/responsible-travel/gion-manner-message-from-southern-gionmachi/' },
      ],
    },
  ],
  'higashiyama-norte': [
    {
      nombre: 'Nanzen-ji (南禅寺) y el acueducto Suirokaku (水路閣)',
      queEs: 'Templo cabecera de la rama Nanzen-ji del zen Rinzai, al pie de las colinas orientales, con una enorme puerta Sanmon y, dentro del recinto, un acueducto de ladrillo de época Meiji que todavía lleva agua del lago Biwa.',
      historia: 'En 1264 el emperador Kameyama se construyó aquí una villa (Zenrinji-den). En 1291 la convirtió en templo zen con el monje Mukan Fumon (Daimin Kokushi) como fundador. En 1386 el shōgun Ashikaga Yoshimitsu lo situó por encima de los Cinco Grandes Templos zen de Kioto y Kamakura: el rango más alto del zen japonés. La Sanmon actual (unos 22 m) la reconstruyó en 1628 el señor Tōdō Takatora en memoria de sus soldados muertos en la campaña de verano de Osaka (1615); el Hōjō es Tesoro Nacional. El canal del lago Biwa (第一疏水, 1885–1890) lo impulsó el gobernador Kitagaki Kunimichi para reactivar Kioto tras la marcha de la corte a Tokio, y lo dirigió el joven ingeniero Tanabe Sakurō sin técnicos extranjeros. El Suirokaku, de ladrillo y 14 arcos (unos 93 m), es de 1888.',
      significado: 'Nanzen-ji representa la cúspide institucional del zen medieval. A su lado, el canal es el símbolo de la modernización de Kioto: dio agua, transporte y, según la Agencia de Turismo, la primera central hidroeléctrica de Japón (Keage, en servicio desde 1891). El 27 de agosto de 2025 las instalaciones del canal fueron declaradas Tesoro Nacional; entre las cinco piezas con esa categoría está el propio Suirokaku.',
      curiosidades: [
        '«¡Zekkei kana, zekkei kana!» («¡Qué vista, qué vista!»). En el kabuki 『楼門五三桐』 el ladrón Ishikawa Goemon contempla Kioto desde lo alto de esta puerta y pronuncia esa frase. Es pura ficción teatral: la Sanmon actual es de 1628, mientras que Goemon fue ejecutado décadas antes. Kotobank lo califica de 俗説 (leyenda popular).',
        'El templo nació de unos fantasmas. Según la crónica 『文応皇帝外記』, hacia 1290–1291 la villa de Kameyama estaba encantada; los rezos de un monje de Nara no sirvieron, pero sí la llegada del maestro zen Mukan Fumon. El emperador se hizo su discípulo y convirtió la villa en templo.',
        'Fíjate en el farol de piedra gigante a la derecha de la Sanmon: más de 6 m, ofrecido por Sakuma Katsuyuki en 1628. El templo lo presenta como «el mayor de Oriente».',
        'El acueducto sigue funcionando. Sube por la ladera junto al Suirokaku y verás correr el agua del canal por encima de los arcos. Los tramos de Keage (el plano inclinado o incline) y el túnel de ladrillo «nejiri-manpo», que el templo recomienda como atajo desde la estación de Keage, forman parte del mismo sistema.',
      ],
      fuentes: [
        { label: 'Nanzen-ji — 三門 (1628, Tōdō Takatora, Goemon, farol)', url: 'https://nanzenji.or.jp/equipment/sanmon' },
        { label: 'Nanzen-ji — 疏水', url: 'https://nanzenji.or.jp/equipment/sosui' },
        { label: 'Nanzen-ji — 方丈 (Tesoro Nacional)', url: 'https://nanzenji.or.jp/equipment/houjo' },
        { label: 'Kotobank — 南禅寺 (1264, 1291, 1386, 文応皇帝外記, 俗説 de Goemon)', url: 'https://kotobank.jp/word/%E5%8D%97%E7%A6%85%E5%AF%BA-108851' },
        { label: 'Prefectura de Shiga — Tesoro Nacional del canal del lago Biwa (27-8-2025, cinco elementos, Tanabe)', url: 'https://www.pref.shiga.lg.jp/sd00/press-release/25143.html' },
        { label: 'Junta de Educación de la Prefectura de Kioto — 琵琶湖疏水施設 (Suirokaku, 14 arcos, 1888)', url: 'https://www.kyoto-be.ne.jp/bunkazai/cms/wp-content/uploads/2025/05/%E7%90%B5%E7%90%B6%E6%B9%96%E7%96%8F%E6%B0%B4%E6%96%BD%E8%A8%AD.pdf' },
        { label: 'Agencia de Turismo de Japón — Lake Biwa Canal', url: 'https://www.mlit.go.jp/tagengo-db/R2-01387.html' },
      ],
    },
    {
      nombre: 'Camino del Filósofo (哲学の道)',
      queEs: 'Paseo peatonal junto a un ramal del canal del lago Biwa, entre el santuario Kumano Nyakuōji, al sur, y la entrada de Ginkaku-ji, al norte (Kotobank da unos 1,5 km; otras fuentes, unos 2 km).',
      historia: 'Nació como sendero de servicio del canal. Al estar cerca de la Universidad Imperial de Kioto, desde Meiji vivieron en la zona muchos académicos. Recibió varios nombres («camino de los literatos», «camino de la meditación», «sendero del filósofo») hasta que en 1969, durante la campaña vecinal para conservar el canal, se fijó el nombre de «Camino del Filósofo». Está incluido en la selección de los «100 caminos de Japón».',
      significado: 'Recuerda a la Escuela de Kioto, la filosofía japonesa moderna: Nishida Kitarō y sus discípulos, como Tanabe Hajime, paseaban por aquí mientras pensaban. El propio Ginkaku-ji lo presenta como el lugar donde Nishida meditaba caminando.',
      curiosidades: [
        'Los «cerezos de Kansetsu». La alameda de cerezos se debe al pintor Hashimoto Kansetsu y a su esposa, que vivían cerca y plantaron los primeros árboles hacia 1921–1922 (nippon.com da 1922). En mayo no habrá flor, pero sí un túnel verde sobre el agua.',
        'Fíjate en los puentecillos de piedra que cruzan el canal: dan acceso a las casas y templos de la otra orilla. En el extremo sur, el santuario Kumano Nyakuōji fue fundado en 1160 por el emperador retirado Go-Shirakawa, y allí celebró Ashikaga Yoshimasa (el de Ginkaku-ji) fiestas para ver los cerezos.',
        'El agua que ves es la misma que pasa por el Suirokaku de Nanzen-ji: este ramal (疏水分線) se separa del canal principal en Keage.',
      ],
      fuentes: [
        { label: 'Kotobank — 哲学の道 (≈1,5 km, Nishida)', url: 'https://kotobank.jp/word/%E5%93%B2%E5%AD%A6%E3%81%AE%E9%81%93-675521' },
        { label: 'nippon.com — 「哲学の道」の桜 (nombre fijado en 1969, Kansetsu 1922, Nyakuōji)', url: 'https://www.nippon.com/ja/guide-to-japan/gu003021/' },
        { label: 'Ginkaku-ji (Shōkoku-ji) — 銀閣寺について (Nishida y el camino)', url: 'https://www.shokoku-ji.jp/ginkakuji/about/' },
        { label: 'Agencia de Turismo de Japón — Lake Biwa Canal (ramal)', url: 'https://www.mlit.go.jp/tagengo-db/R2-01387.html' },
      ],
    },
    {
      nombre: 'Ginkaku-ji / Jishō-ji (銀閣寺・慈照寺)',
      queEs: 'Antigua villa del shōgun Ashikaga Yoshimasa convertida en templo zen (subtemplo de Shōkoku-ji). Su nombre oficial es Tōzan Jishō-ji, y su pabellón de dos pisos, el Kannon-den, es el «Pabellón de Plata».',
      historia: 'Tras la guerra de Ōnin (1467–1477), Yoshimasa eligió los restos quemados del templo Jōdo-ji y en 1482 empezó su villa de retiro, Higashiyama-dono. En 1485 se hizo monje y en 1486 terminó su capilla privada, el Tōgu-dō. En marzo de 1489 se alzó la estructura del Kannon-den, pero Yoshimasa cayó enfermo en octubre y murió el 7 de enero de 1490 sin verlo acabado. Por su testamento, la villa se convirtió en templo zen. En 1550 los combates destruyeron todo salvo el Kannon-den y el Tōgu-dō (los dos son Tesoro Nacional); la gran reforma de 1615 dio al jardín buena parte de su aspecto actual.',
      significado: 'Es el emblema de la «cultura Higashiyama»: la estética sobria y austera de la que salen la ceremonia del té, el arreglo floral formal y la arquitectura shoin, base de la casa japonesa tradicional.',
      curiosidades: [
        '¿Por qué no es de plata? El templo explica que el nombre «Ginkaku» se popularizó en Edo, por contraste con el Kinkaku de su abuelo Yoshimitsu. La Agencia de Turismo de Japón recoge otra teoría: el piso superior estaba lacado en negro y, al desgastarse, la laca blanqueó. En las inspecciones de la restauración de 2007 no apareció rastro de plata. Fíjate, junto a la tienda, en la maqueta del aspecto lacado original.',
        'Los conos de arena no son de Yoshimasa. El Ginshadan (銀沙灘, «mar de arena plateada») y el cono truncado Kōgetsudai (向月台, «plataforma frente a la luna») son añadidos de Edo. El templo califica de leyendas (俗説) que sirvieran para reflejar la luz de la luna o para sentarse a esperarla. Según el expediente UNESCO, fueron creciendo poco a poco hasta fijar su tamaño actual hacia 1887–1896.',
        'La habitación de cuatro tatamis y medio más famosa de Japón. En el Tōgu-dō, la sala Dōjinsai tiene el escritorio empotrado (tsukeshoin) y los estantes escalonados (chigaidana) más antiguos que se conservan: el origen del estilo shoin. Solo se abre en las visitas especiales de primavera y otoño. El interior del Kannon-den nunca se abre.',
        'El Daimonji, según el templo. Ginkaku-ji cuenta que, al morir en 1489 su hijo Yoshihisa, Yoshimasa mandó marcar el gran carácter 大 en la ladera del monte que tiene detrás para despedir su alma, y que ese sería el origen del fuego Daimonji del 16 de agosto. Es la tradición del templo; el origen del Daimonji tiene otras versiones. Arriba del Kannon-den, un fénix de bronce mira al este.',
      ],
      fuentes: [
        { label: 'Ginkaku-ji (Shōkoku-ji) — 銀閣寺について (cronología, nombre, Daimonji)', url: 'https://www.shokoku-ji.jp/ginkakuji/about/' },
        { label: 'Ginkaku-ji — 境内案内 (Ginshadan y Kōgetsudai como 俗説 / Edo)', url: 'https://www.shokoku-ji.jp/ginkakuji/guide/' },
        { label: 'Ginkaku-ji — よくある質問 (aperturas especiales)', url: 'https://www.shokoku-ji.jp/ginkakuji/faq/' },
        { label: 'Agencia de Asuntos Culturales — expediente UNESCO, 慈照寺 (1489, Dōjinsai, conos de arena hasta Meiji 20)', url: 'https://online.bunka.go.jp/suisensyo/kyoto/MAINTEXT/3b-N-j.html' },
        { label: 'Agencia de Turismo de Japón — 観音殿 (no es plateado, maqueta lacada, fénix)', url: 'https://www.mlit.go.jp/tagengo-db/R1-00458.html' },
        { label: 'Yomiuri, vía inkl — «Secrets of Kyoto: All that glitters isn’t Ginkaku» (sin plata en las pruebas de 2007)', url: 'https://www.inkl.com/news/secrets-of-kyoto-all-that-glitters-isn-t-ginkaku' },
      ],
    },
  ],
  arashiyama: [
    {
      nombre: 'Bosque de bambú de Sagano (嵯峨野竹林)',
      queEs: 'El sendero entre bambús (竹林の小径) que va del santuario Nonomiya, junto a la puerta norte de Tenryū-ji, hacia la villa Ōkōchi Sansō. Tiene unos 400 m, aunque algunas guías dan unos 200.',
      historia: 'Sagano fue zona de villas y retiros de la corte desde Heian. En el extremo del sendero, el santuario Nonomiya (野宮) ocupa uno de los lugares donde las saiō, princesas imperiales elegidas para servir en el santuario de Ise en nombre del emperador, se purificaban antes de partir. Según el santuario, este emplazamiento se usó por primera vez para la princesa Jinshi, hija del emperador Saga, y la institución desapareció en el siglo XIV con las guerras de la época de Go-Daigo.',
      significado: 'Es el paisaje del capítulo «Sakaki» del Genji monogatari, en el que Genji visita a la dama Rokujō en el Nonomiya. Por eso Sagano es, para la literatura japonesa, tierra de despedidas y melancolía otoñal.',
      curiosidades: [
        'Fíjate en el torii negro de Nonomiya: es un kuroki torii, hecho con troncos de roble kunugi sin descortezar. El santuario lo describe como la forma más antigua de torii. La valla baja de ramitas (小柴垣) es de madera de kuromoji. El santuario recuerda que el recinto del rito de entronización (Daijōsai) se rodea con estos mismos elementos.',
        'Mito de Edison: a menudo se dice que el filamento de las bombillas de Edison era bambú de Arashiyama. Los textos oficiales de la ciudad de Yawata dicen que el bambú usado procedía de los bosques junto a Iwashimizu Hachimangū (Yawata), al sur de Kioto, no de Sagano.',
        'Consejo práctico: el sendero es público y gratuito; temprano por la mañana está mucho más tranquilo.',
      ],
      fuentes: [
        { label: 'Nonomiya Jinja — 野宮神社の由来 (saiō, Genji «Sakaki», Jinshi)', url: 'http://www.nonomiya.com/yurai.html' },
        { label: 'Nonomiya Jinja — portada (kuroki torii, koshibagaki)', url: 'http://www.nonomiya.com/' },
        { label: 'Agencia de Turismo de Japón — 石清水八幡宮 エジソン記念碑', url: 'https://www.mlit.go.jp/tagengo-db/R2-01482.html' },
        { label: 'Ministerio de Medio Ambiente — 残したい“日本の音風景100選”について (1996)', url: 'https://www.env.go.jp/content/900400153.pdf' },
        { label: 'crexgroup — lista reproducida de los 100 paisajes sonoros (no oficial)', url: 'https://crexgroup.com/ja/travel/niche/japan-soundscapes-list/' },
      ],
    },
    {
      nombre: 'Tenryū-ji (天龍寺)',
      queEs: 'Templo cabecera de la rama Tenryū-ji del zen Rinzai, en Arashiyama. Su jardín de estanque Sōgen-chi conserva el trazado del maestro Musō Soseki.',
      historia: 'El terreno fue antes el templo Danrin-ji, de la emperatriz Tachibana no Kachiko, y luego la villa de los emperadores retirados Go-Saga y Kameyama. En 1339 el shōgun Ashikaga Takauji fundó aquí el templo para rezar por el alma del emperador Go-Daigo, su antiguo aliado y después enemigo, con Musō Soseki como primer abad. Se inauguró en 1345 y fue situado en el primer puesto de los Cinco Grandes Templos de Kioto (con Nanzen-ji por encima de todos). Sufrió ocho grandes incendios (1358–1864), el último en la rebelión de las Puertas Hamaguri (1864), cuando el ejército de Chōshū acampó aquí. Con la confiscación de tierras de Meiji quedó reducido a una décima parte. Casi todos los edificios actuales son de 1899–1935.',
      significado: 'Es el primer gran templo zen ligado al poder Ashikaga. Su jardín, con el paisaje de Arashiyama y el monte Kameyama como fondo (shakkei), influyó en todo el jardín japonés posterior; el expediente UNESCO destaca su influencia sobre los jardines secos.',
      curiosidades: [
        'Un templo financiado con un barco. Las donaciones no bastaban, así que Ashikaga Tadayoshi y Musō reanudaron el comercio con la China Yuan, interrumpido desde las invasiones mongolas, y destinaron los beneficios a la obra: fueron los Tenryūji-bune («barcos de Tenryū-ji»).',
        'Fíjate en la «carpa» de la cascada. Frente al estanque, dos grandes piedras verticales forman la cascada del Dragón (龍門の滝, la leyenda china de la carpa que remonta la cascada y se vuelve dragón). Según el templo, la piedra-carpa no está al pie de la cascada, como es habitual, sino a un lado del chorro, en plena transformación en dragón. El estanque se llama Sōgen-chi porque, según la tradición, al dragarlo apareció una lápida con la inscripción 曹源一滴.',
        'El dragón que te mira desde cualquier ángulo. En el techo del Hattō, el pintor Kayama Matazō pintó en 1997 un dragón entre nubes (unos 9 m de diámetro, sobre 159 tablones de cedro) que parece mirarte desde cualquier punto (八方睨み). Solo se abre fines de semana y festivos, o a diario en las temporadas especiales; en 2026 la de primavera fue del 1 de marzo al 31 de mayo.',
        'El puente Togetsukyō ya era una de las «diez vistas» que el propio Musō eligió en 1346 para el templo (天龍寺十境).',
      ],
      fuentes: [
        { label: 'Tenryū-ji — 天龍寺について (1339, Tenryūji-bune, 1345, ocho incendios, Meiji)', url: 'https://www.tenryuji.com/about/' },
        { label: 'Tenryū-ji — 境内・山内案内 (Sōgen-chi, piedra-carpa, 十境)', url: 'https://www.tenryuji.com/precincts/' },
        { label: 'Tenryū-ji — 雲龍図のご案内 (Kayama Matazō, apertura)', url: 'https://www.tenryuji.com/unryuzu/' },
        { label: 'Agencia de Asuntos Culturales — expediente UNESCO, 天龍寺', url: 'https://online.bunka.go.jp/suisensyo/kyoto/MAINTEXT/3b-L-j.html' },
      ],
    },
    {
      nombre: 'Puente Togetsukyō (渡月橋)',
      queEs: 'El puente que cruza el río a los pies del monte Arashiyama; es el símbolo del barrio.',
      historia: 'Antes de Meiji el puente se lo llevaban a menudo las riadas. Hacia 1887 se construyó uno de madera, y el actual es de 1934: una estructura de hormigón armado (con vigas de acero, según algunas fuentes) que, para no romper el paisaje, mantiene las barandillas de madera. El río fue también la vía de los troncos que bajaban de Tanba: los almadieros llegaban a pasar cientos de miles de troncos al año, y el agua bajo el puente se llenaba de madera.',
      significado: 'Es la postal de Arashiyama desde que la corte Heian venía aquí a ver la luna, los cerezos y el arce, y forma parte del paisaje «prestado» de Tenryū-ji.',
      curiosidades: [
        'El nombre. Según la tradición, un emperador retirado (habitualmente Kameyama, s. XIII, que tenía aquí su villa) dijo al ver la luna sobre el puente que parecía «la luna sin sombra que cruza» (くまなき月の渡るに似る). De ahí Togetsu, «la luna que cruza». El Ministerio de Infraestructuras recoge la frase; la atribución a Kameyama procede de la tradición.',
        'No mires atrás. Los niños de 13 años que van al templo Hōrin-ji, en la orilla sur, a recibir sabiduría de Kokūzō Bosatsu (十三まいり) no deben volverse a mirar el templo hasta terminar de cruzar el Togetsukyō, o la sabiduría recibida «se devuelve».',
        'Mira las barandillas: son lo único de madera; todo lo que las sostiene es hormigón de 1934.',
      ],
      fuentes: [
        { label: 'Ministerio de Infraestructuras (MLIT) — 日本の川: 桂川 (nombre, madera hacia 1887, hormigón de 1934, almadías)', url: 'https://www.mlit.go.jp/river/toukei_chousa/kasen/jiten/nihon_kawa/0607_katsura/0607_katsura_01.html' },
        { label: 'Keihan — 十三まいり (no volver la vista en el Togetsukyō)', url: 'https://www.keihan.co.jp/navi/kyoto_tsu/tsu202205.html' },
        { label: 'Agencia de Turismo de Japón — 十三参りと電電宮', url: 'https://www.mlit.go.jp/tagengo-db/common/001542683.docx' },
        { label: 'Tenryū-ji — 天龍寺十境 / villa de Kameyama', url: 'https://www.tenryuji.com/precincts/' },
      ],
    },
  ],
  sanjusangendo: [
    {
      nombre: 'Sanjūsangen-dō / Rengeō-in (三十三間堂・蓮華王院)',
      queEs: 'Templo de la escuela Tendai cuya sala principal, de unos 120 m de largo, alberga 1.001 estatuas de Kannon de mil brazos. Todas son Tesoro Nacional desde 2018.',
      historia: 'El emperador retirado Go-Shirakawa lo construyó en 1164 dentro de su palacio-templo Hōjū-ji, con una enorme financiación de Taira no Kiyomori. El complejo ardió en 1249, pero la sala se reconstruyó enseguida, y el edificio actual es de 1266. La gran Kannon sedente central es obra del escultor Tankei (hijo de Unkei), hacia 1254–1255. Hideyoshi integró la sala en el recinto de su Gran Buda de Hōkō-ji; de esa época son la Puerta Sur y el muro Taikō-bei, ambos Bienes Culturales Importantes. En 2018, con la declaración de las mil estatuas como Tesoro Nacional, volvieron las que estaban depositadas en museos y se reunieron por primera vez las 1.001; ese mismo año se recolocaron los 28 guardianes y los dioses del Viento y del Trueno según grabados de Kamakura.',
      significado: 'Es un monumento a la época de los emperadores retirados (insei), que se presentaban como «reyes budistas». Su nombre oficial, Rengeō-in («templo del Rey Loto»), viene del Sutra del Loto.',
      curiosidades: [
        'Cuenta los vanos: salen 35, no 33. «Sanjūsangen» significa «33 espacios entre pilares», en referencia a las 33 formas que puede adoptar Kannon para salvar a los seres. Por fuera, entre los grandes pilares del lateral se cuentan 35: la cifra oficial cuenta solo el santuario interior (naijin) y deja fuera el corredor perimetral.',
        'El récord de tiro con arco de 1686. En Edo se celebraba aquí el tōshiya: disparar a lo largo de la galería oeste, de unos 120 m, sin tocar el alero. En la prueba de 24 horas (大矢数), el samurái Wasa Daihachirō, del dominio de Kii, metió 8.133 flechas de 13.053 en abril de 1686, un récord nunca superado. Hoy pervive como el Ōmato Taikai de enero, a 60 m.',
        'Busca una cara concreta. Detrás de las estatuas hay una pantalla táctil para buscar el nombre y la cara de cada una de las 1.001.',
        'Cómo aguanta 750 años. La Agencia de Turismo atribuye su resistencia a los terremotos a la flexibilidad de su estructura de madera ensamblada. Las excavaciones de 2016–2017 revelaron además un trabajo de refuerzo del terreno (地業): crestas paralelas de tierra rellenadas con otra tierra, pensado para que el peso del tejado no hundiera el suelo. Mira también las tejas: algunas llevan el emblema de los Toyotomi y otras la fecha de 1650.',
      ],
      fuentes: [
        { label: 'Sanjūsangen-dō — 歴史 (1164, Go-Saga, Hideyoshi)', url: 'https://www.sanjusangendo.jp/history/' },
        { label: 'Sanjūsangen-dō — 仏像 (Tesoro Nacional 2018, 1.001, pantalla táctil)', url: 'https://www.sanjusangendo.jp/statue/' },
        { label: 'Sanjūsangen-dō — 年中行事 (Ōmato Taikai)', url: 'https://www.sanjusangendo.jp/event/' },
        { label: 'Agencia de Turismo de Japón — 三十三間堂 建築 (35 vanos, 1266, flexibilidad, tejas)', url: 'https://www.mlit.go.jp/tagengo-db/R1-01698.html' },
        { label: 'Agencia de Turismo de Japón — 三十三間堂 (Go-Shirakawa y Kiyomori, 1164)', url: 'https://www.mlit.go.jp/tagengo-db/R1-01697.html' },
        { label: 'Agencia de Turismo de Japón — 千手観音 (Tankei, h. 1255)', url: 'https://www.mlit.go.jp/tagengo-db/R1-01699.html' },
        { label: 'Kotobank — 通し矢 (8.133/13.053, 1686)', url: 'https://kotobank.jp/word/%E9%80%9A%E3%81%97%E7%9F%A2-104513' },
        { label: 'Instituto Municipal de Arqueología de Kioto — 三十三間堂の調査 (folleto n.º 347, 2017)', url: 'https://www.kyoto-arc.or.jp/news/leaflet/347.pdf' },
        { label: 'Instituto Municipal de Arqueología de Kioto — 講座 n.º 290 (地業)', url: 'https://www.kyoto-arc.or.jp/News/s-kouza/kouza290.pdf' },
      ],
    },
  ],
  nijo: [
    {
      nombre: 'Castillo Nijō (二条城)',
      queEs: 'Castillo-palacio de los shōgun Tokugawa en Kioto, propiedad municipal. Su Palacio Ninomaru (seis edificios, Tesoro Nacional) es el mejor ejemplo conservado de palacio samurái de estilo shoin.',
      historia: 'Ieyasu lo terminó en 1603 para proteger el Palacio Imperial y alojarse cuando venía a Kioto. En 1611 recibió aquí a Toyotomi Hideyori, y en 1614–1615 se celebraron aquí los consejos de guerra de las campañas de Osaka. En 1624–1626 se amplió a su tamaño actual para la visita del emperador Go-Mizunoo (cinco días en 1626), con pinturas de Kanō Tan\'yū. El torreón de cinco pisos lo destruyó un rayo en 1750, y el palacio del recinto central ardió en 1788. Allí se instaló en 1893–1894 la residencia del príncipe Katsura. El 13 de octubre de 1867 (calendario lunar, era Keiō 3), el shōgun Tokugawa Yoshinobu reunió en el Ōhiroma del Ninomaru a los consejeros de 40 dominios. El 14 presentó a la corte la devolución del poder (大政奉還) y el 15 la corte la aceptó (8–10 de noviembre de 1867 en el calendario gregoriano).',
      significado: 'Es el escenario del principio y del final del poder Tokugawa en Kioto. Yoshinobu recibió aquí también el cargo de shōgun (1866) y desde aquí lo devolvió. El orden de las salas (del vestíbulo de espera a las estancias privadas) es un mapa de la jerarquía feudal.',
      curiosidades: [
        'El «suelo de ruiseñor» (鶯張り). El castillo explica que el canto sale del roce entre los clavos y las grapas metálicas (目かすがい) que sujetan las tablas por debajo. No hay ninguna fuente de época que diga que se diseñara como alarma contra intrusos; esa es una explicación posterior y muy difundida.',
        'Lo que ves en las paredes son copias. El Ninomaru conserva unos 3.600 paneles pintados (1.016 son Bien Cultural Importante). Desde 1972 se reproducen y se sustituyen por copias; los originales se guardan en el museo del castillo.',
        'Fíjate en los cubreclavos dorados (釘隠し) en forma de hana-noshi (lazo de flores) en las vigas, y en cómo la decoración se vuelve más sobria a medida que avanzas: las salas oficiales tienen fondos de oro y las privadas del shōgun (Shiro-shoin), paisajes en tinta y color suave.',
      ],
      fuentes: [
        { label: 'Castillo Nijō (oficial) — 歴史 (Go-Mizunoo, 13/14/15 de octubre de 1867)', url: 'https://nijo-jocastle.city.kyoto.lg.jp/introduction/highlights/history/' },
        { label: 'Castillo Nijō — 二の丸御殿 (鶯張り: 目かすがい y clavos; 3.600 paneles)', url: 'https://nijo-jocastle.city.kyoto.lg.jp/introduction/highlights/ninomaru/' },
        { label: 'Castillo Nijō — 年表 (1603, 1611, 1750, Yoshinobu shōgun)', url: 'https://nijo-jocastle.city.kyoto.lg.jp/introduction/highlights/nenpyo/' },
        { label: 'Castillo Nijō — 概要', url: 'https://nijo-jocastle.city.kyoto.lg.jp/introduction/highlights/overview/' },
        { label: 'Agencia de Asuntos Culturales — expediente UNESCO, 二条城 (1788, 1894, copias desde 1972, cubreclavos)', url: 'https://online.bunka.go.jp/suisensyo/kyoto/MAINTEXT/3b-Q-j.html' },
        { label: 'Wikipedia — Nightingale floor (cartel del castillo; solo como apoyo)', url: 'https://en.wikipedia.org/wiki/Nightingale_floor' },
      ],
    },
  ],
  'fushimi-inari': [
    {
      nombre: 'Fushimi Inari Taisha (伏見稲荷大社)',
      queEs: 'Santuario cabecera de los unos 30.000 santuarios de Inari de Japón. Su recinto (unos 87 ha) ocupa casi todo el monte Inari (233 m), el más meridional de los «36 picos de Higashiyama», cubierto de túneles de torii bermellones.',
      historia: 'Según el santuario, Inari se instaló en el monte el día del primer caballo del segundo mes de 711 (和銅4年2月初午). Un fragmento del Yamashiro no kuni fudoki explica el nombre por ine ga nari, «donde brotó el arroz». En 827 recibió su primer rango divino y en 942 el máximo, shō-ichi-i. En la guerra de Ōnin (1468) ardió todo; el santuario principal se reconstruyó en 1499 (Bien Cultural Importante). La gran puerta Rōmon se atribuía a Hideyoshi en 1589, en agradecimiento por la curación de su madre, y la restauración de 1973 encontró una inscripción en tinta de «Tenshō 17» (1589) que confirmó la tradición.',
      significado: 'Inari empezó como dios del arroz y la cosecha y, con el tiempo, se convirtió en patrón del comercio, la industria y la prosperidad de la casa. De ahí que comerciantes y empresas donen torii para pedir o agradecer.',
      curiosidades: [
        '¿Cuántos torii? El santuario da «unos 10.000» (約1万基) a lo largo de todos los caminos del monte. La costumbre de donarlos, porque el deseo «pasó» (通る / 通った), se extendió a partir de Edo. Los famosos Senbon torii («mil torii») no son mil: es un nombre poético para el doble túnel que sale de la parte de atrás del santuario.',
        'Los zorros no son Inari. El santuario insiste en que los zorros son mensajeros (kenzoku) del dios, y además invisibles: se veneran como «zorros blancos (transparentes)», byakko-san. Fíjate en lo que llevan en la boca las estatuas de zorro.',
        'El bermellón tenía una función. El santuario explica que el color protege contra las fuerzas malignas y representa la fertilidad de Inari, y que el pigmento tradicional (a base de mercurio, 丹) se usaba también como protector de la madera.',
        'Yotsutsuji y la vista «escondida». En el cruce de Yotsutsuji, a media subida, está el mirador clásico hacia el sur y el oeste. El santuario indica que, detrás del santuario de Arakami-mine (Tanaka-sha), «se abre la vista del centro y el norte de Kioto que no se ve desde Yotsutsuji». Más arriba, el estanque Shin-ike tiene su propia tradición: para encontrar a un desaparecido se da una palmada y se busca en la dirección de donde vuelve el eco.',
      ],
      fuentes: [
        { label: 'Fushimi Inari Taisha — よくある質問 (≈10.000 torii, zorros, bermellón, ≈30.000 santuarios, 87 ha, rangos)', url: 'https://inari.jp/about/faq/' },
        { label: 'Fushimi Inari Taisha — 伏見稲荷大社とは (711)', url: 'https://inari.jp/about/' },
        { label: 'Fushimi Inari Taisha — 境内マップ (Rōmon 1589 e inscripción de 1973, Senbon torii, 233 m, Arakami-mine, Shin-ike)', url: 'https://inari.jp/trip/map01/' },
      ],
    },
  ],
  kinkakuji: [
    {
      nombre: 'Kinkaku-ji / Rokuon-ji (金閣寺・鹿苑寺)',
      queEs: 'Antigua villa del shōgun Ashikaga Yoshimitsu, hoy templo zen (subtemplo de Shōkoku-ji). Su pabellón de reliquias, cubierto de oro, se refleja en el estanque Kyōko-chi.',
      historia: 'Hacia 1224 el noble Saionji Kintsune construyó aquí su villa Kitayama-dai. En 1397 Yoshimitsu, ya retirado, la adquirió y la transformó en su residencia Kitayama-dono, donde recibió a los enviados de la China Ming y, en 1408, al emperador Go-Komatsu. Tras su muerte (1408) se convirtió en templo zen con Musō Soseki como fundador honorario, y se llamó Rokuon-ji por el nombre budista de Yoshimitsu. El 2 de julio de 1950 un joven aprendiz del templo lo quemó; el pabellón, que había sobrevivido a la guerra de Ōnin, desapareció. Se reconstruyó en 1955 con exactitud gracias a los planos detallados de la restauración de 1904, y en 1987 se renovaron la laca y el pan de oro. El templo abrió por primera vez a los visitantes en 1894.',
      significado: 'Es el emblema de la «cultura Kitayama». Cada piso tiene un estilo: el primero, de palacio cortesano (shinden, Hōsui-in); el segundo, de casa samurái (buke, Chōon-dō), y el tercero, de sala budista zen al modo chino (Kukyōchō). El expediente UNESCO lo lee como la suma de la cultura cortesana, la guerrera y la budista.',
      curiosidades: [
        'El primer piso no es dorado. Según el templo, solo el segundo y el tercer piso llevan oro sobre laca. Fíjate en el contraste de la madera natural en la planta baja.',
        'La novela y el incendio. Yukio Mishima convirtió el incendio de 1950 en El pabellón de oro (『金閣寺』, 1956), la historia de un aprendiz obsesionado con la belleza del edificio.',
        'El fénix del tejado. Sobre el tejado de corteza de sawara brilla un fénix (hōō), ave de buen augurio.',
        'Más cosas que mirar: la cascada Ryūmon-no-taki tiene una «piedra-carpa» inclinada, como a punto de saltar; el seto bajo de bambú de la escalera (Kinkaku-ji-gaki) está tejido de forma distinta a cada lado; y la campana, que se dice heredada de los Saionji, está afinada en «la», en el tono ōshiki-chō.',
      ],
      fuentes: [
        { label: 'Kinkaku-ji (Shōkoku-ji) — 金閣寺について (Saionji, 1397, 1408, abierto en 1894)', url: 'https://www.shokoku-ji.jp/kinkakuji/about/' },
        { label: 'Kinkaku-ji — 境内案内 (oro en 2.º y 3.er piso, estilos, fénix, 1987, piedra-carpa, campana)', url: 'https://www.shokoku-ji.jp/kinkakuji/guide/' },
        { label: 'Agencia de Asuntos Culturales — expediente UNESCO, 鹿苑寺 (1950, 1955, planos de 1904)', url: 'https://online.bunka.go.jp/suisensyo/kyoto/MAINTEXT/3b-M-j.html' },
        { label: 'Kotobank — 金閣寺 (incendio de 1950, novela de Mishima de 1956)', url: 'https://kotobank.jp/word/%E9%87%91%E9%96%A3%E5%AF%BA-54000' },
      ],
    },
    {
      nombre: 'Ryōan-ji (龍安寺)',
      queEs: 'Templo zen de la rama Myōshin-ji famoso por su jardín seco (karesansui): 15 piedras en cinco grupos (5-2-3-2-3) sobre unos 250 m² de grava blanca rastrillada.',
      historia: 'En 1450 el gran señor Hosokawa Katsumoto adquirió la villa de los Tokudaiji y fundó el templo. Ardió en la guerra de Ōnin y lo reconstruyó su hijo Masamoto; según el templo, el Hōjō se levantó en 1499 y la tradición sitúa el jardín en ese momento. Kotobank recuerda que la datación se discute entre Muromachi y Edo. En 1797 un incendio destruyó el Hōjō, y el actual es el del subtemplo Seigen-in (1606), trasladado aquí. En 1977–1978 se devolvió al muro su tejado de tablilla (kokera), que había sido de teja.',
      significado: 'Es la expresión extrema del jardín abstracto zen: nada de plantas, solo piedra, grava y musgo. Su sentido queda abierto, y el templo dice expresamente que la intención del autor es desconocida.',
      curiosidades: [
        'Un jardín con «trampas» de perspectiva. El templo explica que el muro oeste (a la derecha, mirando desde el Hōjō) baja de altura hacia el fondo para que el jardín parezca más profundo, y que la superficie se inclina hacia la esquina sudeste para desaguar. El muro, de 1,8 m, es de barro amasado con aceite de colza (油土塀): resiste mejor y evita el reflejo de la grava.',
        'La única «firma». En la parte trasera de una piedra hay grabados dos nombres: 小太郎 y □二郎 (el segundo, parcialmente ilegible). Podrían ser los jardineros, pero el templo advierte que «no pasa de conjetura». Kotobank añade otra sorpresa: según un plano del Archivo Nacional, los dos grupos del este se habrían desplazado 1–1,5 m al reconstruir el Hōjō tras 1797.',
        'El tsukubai «吾唯足知». Junto al Hōjō hay un aguamanil de piedra con un orificio cuadrado en el centro que sirve de 口 a cuatro caracteres: 吾 (五+口), 唯 (口+隹), 足 y 知 (矢+口). Juntos se leen ware tada taru wo shiru, «solo sé lo que me basta».',
      ],
      fuentes: [
        { label: 'Ryōan-ji — 歴史 (1450, 1499, 1797)', url: 'http://www.ryoanji.jp/smph/history/index.html' },
        { label: 'Ryōan-ji — 遠近の謎 (muro decreciente, desagüe)', url: 'http://www.ryoanji.jp/smph/garden/perspective.html' },
        { label: 'Ryōan-ji — 土塀の謎 (油土塀, 1,8 m)', url: 'http://www.ryoanji.jp/smph/garden/earthenwall.html' },
        { label: 'Ryōan-ji — 刻印の謎 (小太郎・□二郎)', url: 'http://www.ryoanji.jp/smph/garden/marking.html' },
        { label: 'Ryōan-ji — 作庭の謎 (75 tsubo, intención desconocida)', url: 'http://www.ryoanji.jp/smph/garden/making.html' },
        { label: 'Kotobank — 竜安寺 (5-2-3-2-3, Muromachi o Edo, piedras desplazadas, kokera 1978)', url: 'https://kotobank.jp/word/%E7%AB%9C%E5%AE%89%E5%AF%BA-410241' },
        { label: 'Agencia de Asuntos Culturales — expediente UNESCO, 龍安寺 (250 m², 1606/1797, 1977)', url: 'https://online.bunka.go.jp/suisensyo/kyoto/MAINTEXT/3b-O-j.html' },
      ],
    },
  ],
  nishiki: [
    {
      nombre: 'Mercado Nishiki (錦市場)',
      queEs: 'Calle comercial cubierta de unos 390 m (entre 3,3 y 5 m de ancho), entre Teramachi y Takakura, con unas 130 tiendas de alimentación. Es «la cocina de Kioto» (京の台所).',
      historia: 'El origen del mercado no está documentado. La asociación de comerciantes cree que en época Heian ya había un mercado aquí, atraído por el agua subterránea. El nombre de la calle cambió en 1054 (天喜2年, según el 『掌中歴』). En 1615 el shogunato reconoció tres mayoristas privilegiados de pescado en Kioto, uno de ellos el «Nishiki no tana»: ese es el inicio formal del mercado de pescado. En Meiji, al abolirse los privilegios gremiales, la competencia redujo el mercado a solo siete grandes tiendas hacia 1883.',
      significado: 'Abastece la cocina de Kioto, tanto la de los restaurantes como la casera (obanzai): verduras kyō-yasai, pescado del lago Biwa, hamo, guji, yuba, nama-fu…',
      curiosidades: [
        'De «la calle de las armaduras» a «la calle del brocado». Según la asociación, en Heian se llamaba Gusoku-kōji (具足小路), porque allí se quitaban la armadura quienes iban a palacio, y hubo una época en que se la apodó, deformando el nombre, «Kuso-kōji» («calle de la porquería»). En 1054 se le cambió el nombre a Nishiki-kōji («calle del brocado»), y la asociación atribuye el cambio al emperador Go-Reizei.',
        'El agua que hizo el mercado. El agua subterránea, a 15–18 °C todo el año («agua de Nishiki»), llenaba pozos de cada tienda que servían de nevera. Al final de la calle, el santuario Nishiki Tenmangū sigue sacando su «agua de Nishiki» de unos 30 m de profundidad. Muchos vecinos la recogen por la mañana.',
        'El salvador del mercado fue un pintor. Itō Jakuchū (1716–1800), el genial pintor de gallos y verduras, nació en una familia de mayoristas de verduras de Nishiki. Entre 1771 y 1774, como responsable del barrio, dejó de pintar para luchar contra el cierre del mercado. Según la asociación, es su «segundo fundador». Busca sus pinturas reproducidas en las persianas de las tiendas y el monumento de su casa natal en la entrada oeste.',
        'Nishiki y el Gion Matsuri: desde 1947 la asociación del mercado (錦神輿会) lleva a hombros el palanquín octogonal Nishi-goza de Yasaka Jinja.',
      ],
      fuentes: [
        { label: 'Mercado Nishiki (asociación) — 錦市場の魅力 / historia (1615, Gusoku/Kuso-kōji, agua, Jakuchū, 390 m, Nishi-goza)', url: 'https://www.kyoto-nishiki.or.jp/about/' },
        { label: 'Kotobank — 錦市場 (≈400 m, ≈130 tiendas, 1054, origen incierto)', url: 'https://kotobank.jp/word/%E9%8C%A6%E5%B8%82%E5%A0%B4-858104' },
        { label: 'Nishiki Tenmangū — 由緒 (traslado de 1587 por Hideyoshi)', url: 'https://nishikitenmangu.or.jp/about/' },
        { label: 'Nishiki Tenmangū — 境内 (agua de Nishiki a unos 30 m)', url: 'https://nishikitenmangu.or.jp/grounds/' },
      ],
    },
  ],
  toji: [
    {
      nombre: 'Tō-ji / Kyōōgokoku-ji (東寺・教王護国寺) y el mercado Kōbō-ichi (弘法市)',
      queEs: 'Templo cabecera del budismo esotérico Shingon, al sur de la estación de Kioto. Su pagoda de cinco pisos, de unos 55 m, es el edificio de madera más alto de Japón. Los días 21 de cada mes se llena con el mercado Kōbō-ichi (弘法市, «Kōbō-san»).',
      historia: 'Se fundó en 796, dos años después de trasladar la capital a Heian-kyō, como uno de los dos únicos templos permitidos dentro de la ciudad: Tō-ji («templo del este») y Sai-ji («templo del oeste»), a ambos lados de la puerta Rashōmon. En 823 el emperador Saga lo confió a Kūkai (Kōbō Daishi), que lo convirtió en el centro del Shingon. Kūkai empezó el Kōdō y, en 826, pidió ayuda a la corte para bajar del monte Higashiyama la madera de la pagoda. La pagoda ardió cuatro veces (por rayos, entre otras causas); la actual, la quinta, es de 1644 (era Kan\'ei 21) y se reconstruyó con el apoyo del tercer shōgun, Tokugawa Iemitsu. El Kōdō (1491) y el Kondō (1603) son reconstrucciones posteriores a los incendios de 1486.',
      significado: 'Es el único edificio de Heian-kyō que sigue en pie: Sai-ji y Rashōmon desaparecieron, y la última pagoda de Sai-ji ardió en 1233. Conserva la planta y el trazado originales, que el expediente UNESCO toma como referencia para reconstruir el plano de la capital Heian. En el Kōdō, 21 estatuas forman un mandala en tres dimensiones.',
      curiosidades: [
        '¿Por qué el mercado es el día 21? Kūkai entró en meditación eterna (入定) el día 21 del tercer mes lunar de 835. Desde 910 se celebra en su memoria el rito Mieku, y desde 1240 se hace en el Miei-dō ante su estatua de 1233. Para atender a los peregrinos del día 21 se instalaron puestos de té de «un cuenco, una moneda» (一服一銭); con los siglos llegaron los dulces, la leña y las ollas, y hoy hay cerca de 1.000 puestos. El templo habla de «más de 700 años» de tradición. El viernes 21 de mayo de 2027 coincide con un día de mercado. El rito Mieku empieza a las 10:00 en el Miei-dō.',
        'Fíjate en los demonios (jaki) que sostienen la pagoda: en las esquinas del primer tejado hay pequeñas figuras que parecen cargar con el alero. El pilar central (shinbashira) se venera como el Buda Dainichi, y dentro se guardan reliquias de Buda traídas por Kūkai. El interior se abre solo en ocasiones especiales; sus paredes tienen dragones pintados para proteger la torre del fuego.',
        'El tesoro cuantificado. El templo tiene 25 Tesoros Nacionales (81 piezas) y 52 Bienes Culturales Importantes (23.603 piezas). Su mayor archivo, los 東寺百合文書 (unos 27.000 documentos del siglo VIII al XVIII), es Memoria del Mundo de la UNESCO desde 2015, pero hoy pertenece a la Prefectura de Kioto (archivo 歴彩館), que lo compró en 1967.',
        'Un samurái pintor. En la sala de invitados del subtemplo Kanchi-in hay un «Águila» y un «Bosque de bambú» pintados por Miyamoto Musashi, el espadachín de las dos espadas (apertura solo en temporadas especiales).',
      ],
      fuentes: [
        { label: 'Tō-ji — 五重塔 (≈55 m, 1644, quinta pagoda, cuatro incendios, carta de Kūkai de 826)', url: 'https://toji.or.jp/guide/gojunoto/' },
        { label: 'Tō-ji — 御影供と弘法市 (910, 1233, 1240, 一服一銭, ≈1.000 puestos, «700 años»)', url: 'https://toji.or.jp/mieku/' },
        { label: 'Tō-ji — 東寺の歴史 (Tō-ji y Sai-ji, 823, tesoros: 25/81 y 52/23.603)', url: 'https://toji.or.jp/history/' },
        { label: 'Tō-ji — 講堂 (1491, mandala de 21 estatuas)', url: 'https://toji.or.jp/guide/kodo/' },
        { label: 'Tō-ji — 宮本武蔵筆 (Kanchi-in)', url: 'https://toji.or.jp/musashi/' },
        { label: 'Agencia de Asuntos Culturales — expediente UNESCO, 教王護国寺 (796, planta original; da 57 m y 1643)', url: 'https://online.bunka.go.jp/suisensyo/kyoto/MAINTEXT/3b-C-j.html' },
        { label: 'Agencia de Turismo de Japón — 五重塔 (Iemitsu, jaki, dragones)', url: 'https://www.mlit.go.jp/tagengo-db/common/001553332.pdf' },
        { label: 'Ministerio de Educación (MEXT) — Memoria del Mundo: 東寺百合文書 (2015, propiedad del 歴彩館)', url: 'https://www.mext.go.jp/unesco/006/1354664.htm' },
      ],
    },
  ],
  'nara-todaiji': [
    {
      nombre: 'Kōfuku-ji y su pagoda de cinco pisos (興福寺・五重塔)',
      queEs: 'Templo budista de la escuela Hossō, templo familiar (ujidera) del clan Fujiwara, a cinco minutos a pie de la estación Kintetsu-Nara. Su pagoda de cinco pisos es Tesoro Nacional y el símbolo clásico del perfil de Nara.',
      historia: 'Sus orígenes se remontan al Yamashina-dera, fundado en 669 por Kagami no Ōkimi, esposa de Fujiwara no Kamatari; en 672 se trasladó a Umayasaka y, con el traslado de la capital a Heijō-kyō (710), Fujiwara no Fuhito lo instaló en su emplazamiento actual con el nombre de Kōfuku-ji. La pagoda la mandó construir en 730 la emperatriz Kōmyō (hija de Fuhito); ha sufrido cinco desastres (rayos, guerras e incendios propagados) y la actual es la reconstrucción de hacia 1426. Mide unos 50 m (la Prefectura da 50,937 m) y es la torre más alta de la prefectura de Nara. En la era Meiji, la separación forzosa entre budismo y sintoísmo (廃仏毀釈) dejó el templo prácticamente abandonado: perdió sus tierras y sus subtemplos, y la pagoda llegó a estar en riesgo de venta. Estado en mayo de 2027: la pagoda está en su primera gran restauración en unos 120 años (desde la de Meiji). En julio de 2023 empezó a levantarse una cubierta de obra integral (suyane, 素屋根) de unos 60 m que la envuelve por completo; se terminó en marzo de 2025 y desde entonces la pagoda no se ve desde fuera. El remate metálico (sōrin) se empezó a desmontar a finales de marzo de 2026 y se reinstalará en 2031. La Prefectura de Nara fija el final de las obras en marzo de 2034 (el folleto del templo de 2021 hablaba de marzo de 2031).',
      significado: 'Fue el templo del linaje que dominó la corte durante los periodos Nara y Heian. Durante siglos estuvo unido al santuario Kasuga (también de los Fujiwara) y en la Edad Media llegó a gobernar de hecho la provincia de Yamato, con sus propios monjes guerreros.',
      curiosidades: [
        'En mayo de 2027 veréis un edificio-caja, no una pagoda. La cubierta de obra de unos 60 m tapa los cinco pisos. Es una ocasión rara: la última restauración de este calibre fue en la era Meiji, hace unos 120 años.',
        'Fíjate en el Chūkondō (Pabellón Dorado Central), el gran edificio rojo del centro del recinto: ardió en 1717 y no se reconstruyó hasta 2018, unos 300 años después. Es, de hecho, uno de los edificios «nuevos» más grandes del Nara histórico.',
        'El Nan\'endō (pabellón octogonal del sur) es la parada nº 9 de la peregrinación de los 33 templos de Kannon de Saigoku; el edificio actual es de hacia 1789.',
        'La estatua de Ashura (tres caras, seis brazos), una de las más queridas de Japón, está en el Museo del Tesoro Nacional (国宝館) del propio templo, abierto en 1959 sobre el solar del antiguo refectorio.',
      ],
      fuentes: [
        { label: 'Prefectura de Nara — 国宝 興福寺五重塔 (obras, cubierta, plazos)', url: 'https://www.pref.nara.lg.jp/n037/62140.html' },
        { label: 'Folleto del Kōfuku-ji «興福寺 今昔写真展» (2021), Biblioteca de la Prefectura de Nara', url: 'https://www.library.pref.nara.jp/supporter/naraweb/siyourei/r3-11-1kouhukujikonjaku.pdf' },
        { label: 'Prefectura de Nara — 興福寺 (Chūkondō, Nan\'endō, Tōkondō)', url: 'https://www.pref.nara.lg.jp/ikasu-nara/bunken/kofukuji/index.html' },
        { label: 'Kotobank — 興福寺 (Yamashina-dera 669, Meiji, Kokuhōkan)', url: 'https://kotobank.jp/word/%E8%88%88%E7%A6%8F%E5%AF%BA' },
        { label: 'Kotobank — 興福寺五重塔', url: 'https://kotobank.jp/word/%E8%88%88%E7%A6%8F%E5%AF%BA%E4%BA%94%E9%87%8D%E5%A1%94-1315339' },
        { label: 'Kyodo vía Kumamoto Nichinichi — desmontaje del remate (abril de 2026)', url: 'https://kumanichi.com/articles/1980828' },
      ],
    },
    {
      nombre: 'Parque de Nara y los ciervos sika (奈良公園・鹿)',
      queEs: 'El gran parque que une Kōfuku-ji, Tōdai-ji y Kasuga Taisha, donde viven en libertad los ciervos sika de Nara, protegidos por ley como Monumento Natural nacional (天然記念物「奈良のシカ」).',
      historia: 'Según las crónicas del santuario Kasuga (社伝『古社記』), en 768 una deidad llegó desde el santuario de Kashima (actual Ibaraki) al monte Mikasa a lomos de un ciervo blanco; la web oficial de Kasuga Taisha identifica a esa deidad con Takemikazuchi. Desde entonces los ciervos se consideran mensajeros divinos (shinroku, 神鹿). En 1672 el magistrado de Nara, Mizoguchi Nobukatsu, instauró el corte anual de astas (角きり). La protección no fue continua: en 1871 el gobernador autorizó abatirlos como animales dañinos y en 1873, encerrados en un cercado, la población cayó a solo 38 ejemplares; tras la guerra, la caza furtiva la redujo a unos 80 (1946). Fueron declarados Monumento Natural provisional en 1947 y definitivo el 18 de septiembre de 1957, con una fórmula peculiar: «sin delimitar zona», tomando como hábitat principal el antiguo término de Nara. En el censo del 16 de julio de 2026 se contaron 1.687 ciervos (411 machos, 990 hembras y 286 cervatillos).',
      significado: 'Es un caso singular de fauna salvaje protegida por motivos religiosos durante más de un milenio. Un estudio genético de 2023 (Universidad de Fukushima y otras) concluyó que el linaje de los ciervos de Nara se separó de las poblaciones vecinas hace más de 1.000 años y sobrevivió gracias a esa protección humana.',
      curiosidades: [
        'La reverencia es real y responde a los turistas. Un estudio publicado en PLOS ONE (2023) contó las «reverencias» en tres puntos, entre ellos la Puerta Nandaimon de Tōdai-ji: antes de la pandemia, unas 10 por ciervo; durante la COVID-19, con menos visitantes y menos galletas, bajaron a unas 6,4. Es una conducta ligada a la comida que se ajusta a la presencia de gente.',
        'Las shika senbei son marca registrada. Pertenecen a la Fundación para la Protección del Ciervo de Nara (奈良の鹿愛護会), y parte de lo recaudado financia su cuidado. Son la única comida que se tolera dar a los ciervos.',
        'Fíjate en los machos: en mayo las astas están creciendo y cubiertas de «terciopelo». El corte ritual de astas, instaurado en 1672, se celebra en otoño.',
      ],
      fuentes: [
        { label: '奈良の鹿愛護会 — 保護の歴史 (cronología 768–1957)', url: 'https://naradeer.com/learning/hogonorekishi.html' },
        { label: '奈良の鹿愛護会 — censo de julio de 2026', url: 'https://naradeer.com/learning/number.html' },
        { label: 'Prefectura de Nara — documento sobre la designación de 1957 (地域を定めず指定)', url: 'https://www.pref.nara.jp/secure/157799/01shiryou1.pdf' },
        { label: 'Universidad de Fukushima — nota de prensa sobre el estudio genético (2023)', url: 'https://www.fukushima-u.ac.jp/news/Files/2023/01/230131.pdf' },
        { label: 'Uehara et al., PLOS ONE 2023 — comportamiento de reverencia y COVID-19', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10187922/' },
        { label: 'JST Science Portal — 奈良公園のシカ、独自の遺伝子型', url: 'https://scienceportal.jst.go.jp/newsflash/20230209_n01/' },
        { label: 'Kasuga Taisha (oficial) — origen del santuario (768, Takemikazuchi desde Kashima)', url: 'https://www.kasugataisha.or.jp/en/about_en/' },
        { label: 'このまちアーカイブス (Sumitomo Mitsui Trust) — historia de las shika senbei', url: 'https://smtrc.jp/town-archives/city/nara/p03.html' },
      ],
    },
    {
      nombre: 'Tōdai-ji y el Gran Buda (東大寺・大仏)',
      queEs: 'El gran templo estatal del periodo Nara, cabeza de la red de templos provinciales, que alberga el Buda Vairocana (盧舎那仏) de bronce dentro del Daibutsuden. Patrimonio Mundial («Monumentos Históricos de la Antigua Nara», 1998).',
      historia: 'En 743 el emperador Shōmu promulgó en el palacio de Shigaraki el edicto para crear un Buda colosal. Tras volver la capital a Heijō (745), las obras se reanudaron en el solar del Konshō-ji, antecesor del templo. El cuerpo se fundió en tres años y ocho coladas sucesivas, hasta octubre de 749; el pabellón se terminó unos dos años después, y la ceremonia de «apertura de los ojos» se celebró en abril de 752, oficiada por el monje indio Bodhisena. El monje Gyōki movilizó el apoyo popular a la colecta. La cabeza cayó en un terremoto de 855. El templo ardió en 1180 (ataque de Taira no Shigehira) y en 1567 (combates entre los Miyoshi y Matsunaga Hisahide); tras este segundo incendio, el Buda pasó casi un siglo a la intemperie. El monje Kōkei dirigió la reconstrucción: la cabeza se refundió y la nueva apertura de ojos fue en 1692. El pabellón actual se inauguró en 1709 y mide 57,012 m de ancho, 50,480 m de fondo y 48,742 m de alto. El Buda mide 14,98 m sentado (cara 5,33 m, ojos 1,02 m, orejas 2,54 m).',
      significado: 'Fue el proyecto con el que Shōmu quiso unificar espiritualmente el país bajo el budismo. El templo lo presenta como «fundado por cuatro sabios» (四聖建立): Shōmu, Gyōki, Rōben y Bodhisena.',
      curiosidades: [
        'El Daibutsuden es más estrecho que el original, no más pequeño en todo. El edificio de los siglos VIII y XII tenía 11 vanos de fachada (unos 88 m); por falta de fondos, el de 1709 se redujo a 7, pero conserva la misma altura y el mismo fondo. El templo lo describe como «uno de los mayores edificios de madera del mundo» (世界最大級), no como «el mayor».',
        'Fíjate en la linterna octogonal de bronce (八角燈籠) delante del Daibutsuden: es de la época fundacional y sobrevivió a los dos incendios. Busca en sus paneles los bodhisattvas músicos y los leones.',
        'Nandaimon y sus Niō. La Gran Puerta Sur (25,46 m; se colocó la viga maestra en 1199 y se terminó en 1203) es obra del monje Chōgen en estilo daibutsuyō, de influencia Song; 18 pilares de hasta 19 m suben del suelo al tejado, y la planta baja no tiene techo. Los dos guardianes (金剛力士像, Tesoro Nacional) de unos 8,4 m se tallaron en 1203 en 69 días. Según el templo, son obra de Unkei, Kaikei, Jōkaku y Tankei con su taller; en el vajra del Agyō hay una inscripción que da la fecha de inicio (24 del séptimo mes de 1203) y el nombre de Unkei. Fíjate en dos rarezas: están colocados mirándose de frente dentro de la puerta, y su posición es la inversa de la habitual (el Agyō, con la boca abierta, está a la izquierda según se entra, no a la derecha). La restauración de 1988–1993 halló en su interior sutras y numerosas inscripciones en tinta.',
      ],
      fuentes: [
        { label: 'Tōdai-ji (oficial) — 大仏殿 (medidas, historia, linterna)', url: 'https://www.todaiji.or.jp/information/daibutsuden/' },
        { label: 'Tōdai-ji (oficial) — 南大門 (puerta y Niō)', url: 'https://www.todaiji.or.jp/information/nandaimon/' },
        { label: 'Tōdai-ji (oficial) — historia del periodo Nara', url: 'https://www.todaiji.or.jp/history/narajidai/' },
        { label: '国指定文化財等データベース — 木造金剛力士立像 (inscripciones de 1203)', url: 'https://kunishitei.bunka.go.jp/heritage/detail/201/196' },
        { label: 'Kotobank — 東大寺南大門金剛力士像 (69 días, alturas)', url: 'https://kotobank.jp/word/%E6%9D%B1%E5%A4%A7%E5%AF%BA%E5%8D%97%E5%A4%A7%E9%96%80%E9%87%91%E5%89%9B%E5%8A%9B%E5%A3%AB%E5%83%8F-3132467' },
        { label: 'Nara Shimbun — 東大寺探訪 (2024)', url: 'https://www.nara-np.co.jp/news/20240509154005.html' },
        { label: 'Bunshun — disposición invertida de los Niō', url: 'https://bunshun.jp/articles/-/4011' },
        { label: 'Good Luck Trip — reseñas de visitantes sobre el agujero del pilar', url: 'https://www.gltjp.com/ja/review/item/3837/' },
      ],
    },
  ],
  dotonbori: [
    {
      nombre: 'Dōtonbori y el cartel de Glico (道頓堀・グリコサイン)',
      queEs: 'Canal y calle de ocio de Minami (Namba), famoso por sus carteles gigantes. El corredor de Glico, junto al puente Ebisubashi, es la imagen más fotografiada de Osaka.',
      historia: 'En 1612, Yasui Dōton empezó a excavar el canal con su propio dinero. Al estallar el asedio de verano de Osaka, se unió al bando de los Toyotomi en agradecimiento a Hideyoshi y murió en combate; sus parientes, con Dōboku a la cabeza, terminaron el canal en 1615. Al principio se llamó Minami-horikawa, y fue el primer señor del castillo de Osaka bajo los Tokugawa, Matsudaira Tadaakira, quien lo rebautizó como Dōtonbori en su honor. El cartel de Glico: el primero (1935) era una torre de neón de 33 m; en 1943 se desmontó para entregar el acero al esfuerzo bélico. Hubo carteles en 1955, 1963, 1972 y 1998. El sexto (2014) fue el primero de LED (143.976 diodos, 20 × 10,38 m). Atención: Ezaki Glico anunció el 14 de octubre de 2026 que el sexto cartel se apaga a finales de noviembre de 2026, que las obras empiezan en diciembre y que el séptimo cartel está previsto para la primavera de 2027. La silueta del corredor se mantiene.',
      significado: 'Dōtonbori es la vitrina del kuidaore (食い倒れ, «comer hasta arruinarse») y de la cultura comercial y teatral de Osaka. El corredor de Glico es la «Goal-in mark», marca registrada del atleta que rompe la cinta de llegada.',
      curiosidades: [
        '¿Cartel nuevo en mayo de 2027? Si se cumple el plazo de «primavera de 2027», el grupo verá el estreno del séptimo Glico.',
        'El canal lleva el nombre de un perdedor. Dōton murió luchando contra los Tokugawa, y aun así un señor Tokugawa le dedicó el canal. Hoy se acepta que su apellido real era Nariyasu (成安), no Yasui.',
        'Cada Glico «enseñaba» algo distinto: el segundo tenía un escenario con un gran muñeco de cocodrilo; el tercero lanzaba 12 toneladas de agua en fuentes iluminadas; el quinto llevaba detrás cuatro símbolos de Osaka (castillo, acuario Kaiyūkan, Osaka Dome y Tsūtenkaku).',
      ],
      fuentes: [
        { label: 'Ayuntamiento de Osaka (distrito Chūō) — 道頓堀って？', url: 'https://www.city.osaka.lg.jp/kensetsu/cmsfiles/contents/0000116/116189/012_doutomboritte.pdf' },
        { label: 'Ezaki Glico — nota de prensa del 6.º cartel (2014)', url: 'https://www.glico.com/assets/files/20141023+NR%E3%82%B0%E3%83%AA%E3%82%B3%E3%82%B5%E3%82%A4%E3%83%B3%E7%82%B9%E7%81%AF%E5%BC%8F__1.pdf' },
        { label: 'Impress Watch — renovación y 7.º cartel en primavera de 2027 (14/10/2026)', url: 'https://www.watch.impress.co.jp/docs/news/2148018.html' },
        { label: 'Kyodo vía Kumamoto Nichinichi — 道頓堀グリコ、7代目に', url: 'https://kumanichi.com/articles/2046201' },
        { label: 'Time Out Tokyo — retirada del cartel para su renovación', url: 'https://www.timeout.com/tokyo/news/osakas-iconic-glico-sign-is-being-removed-for-renovations-101926' },
      ],
    },
    {
      nombre: 'Hōzen-ji y su Mizukake Fudō cubierto de musgo (法善寺・水掛不動)',
      queEs: 'Pequeño templo de la escuela Jōdo (nombre oficial: Tenryūzan Hōzen-ji, conocido como «Sennichi-dera»), escondido a pocos pasos de Dōtonbori, con su estatua de Fudō Myōō verde de musgo y el callejón empedrado de Hōzenji Yokochō.',
      historia: 'El templo estaba en Uji (Yamashiro) y en 1637 el monje Chūyo Sen\'nen lo trasladó a Namba, junto al gran cementerio de Sennichi, donde había también un lugar de ejecuciones y un crematorio. Sen\'nen rezó durante mil días seguidos (千日念仏) por los ejecutados y los enterrados, y de ahí viene el nombre del barrio, Sennichimae («delante de los mil días»). Las fuentes no coinciden en las fechas: un diccionario histórico da otra cronología, con reconstrucción en 1639. Ardió dos veces en el periodo Edo, y en el bombardeo de Osaka de 1945 se quemó todo el recinto: solo se salvó el Mizukake Fudō (el «Fudō de cara al oeste», 西向不動明王). El pabellón principal no se ha reconstruido. El callejón, que tuvo teatros de variedades (yose) destruidos en los bombardeos, sufrió incendios en 2002 y 2003.',
      significado: 'Es un santuario popular de la Osaka comerciante, muy frecuentado por gente del espectáculo y de la noche. El musgo es literalmente el resultado acumulado de la devoción diaria.',
      curiosidades: [
        'El musgo no tiene cuatro siglos. La costumbre de echar agua al Fudō nació, según la tradición recogida por el Ayuntamiento, cuando un fiel que no llevaba ofrenda le echó agua. En cualquier caso, la estatua es la que sobrevivió a 1945. Fíjate: apenas se distinguen los rasgos bajo el musgo.',
        'El callejón se salvó gracias a una recogida de firmas. Tras los incendios, la ley obligaba a ensanchar la calle. En poco tiempo se reunieron unas 300.000 firmas y se aplicó una excepción para conservar el ancho original de unos 2,7 m. Desde 2010, el Mizukake Fudō figura como recurso paisajístico urbano de la ciudad.',
        'Busca el Meoto Zenzai, la casa de sopa dulce de judías rojas que da título a la novela de Oda Sakunosuke 『夫婦善哉』, en la esquina junto a la puerta oeste del templo.',
      ],
      fuentes: [
        { label: 'Ayuntamiento de Osaka (Chūō) — 法善寺 (traslado de 1637, Sennichimae, 1945)', url: 'https://www.city.osaka.lg.jp/chuo/page/0000641943.html' },
        { label: 'Ayuntamiento de Osaka — recursos paisajísticos del distrito Chūō (firmas, 2,7 m, 2010)', url: 'https://www.city.osaka.lg.jp/toshikeikaku/page/0000100550.html' },
        { label: 'Kotobank — 法善寺', url: 'https://kotobank.jp/word/%E6%B3%95%E5%96%84%E5%AF%BA-628081' },
        { label: 'Kotobank — 法善寺横丁 (yose, Meoto Zenzai, incendios)', url: 'https://kotobank.jp/word/%E6%B3%95%E5%96%84%E5%AF%BA%E6%A8%AA%E4%B8%81-1591859' },
        { label: 'FUN! JAPAN — origen de posguerra del mizukake', url: 'https://www.fun-japan.jp/jp/articles/14152' },
      ],
    },
  ],
  'katsuo-ji': [
    {
      nombre: 'Katsuo-ji, el templo de los daruma (勝尾寺)',
      queEs: 'Templo de la escuela Kōyasan Shingon en los montes de Minoh, al norte de Osaka, parada nº 23 de la peregrinación de Saigoku. Es famoso como «templo de la suerte para ganar» (勝運の寺) y por sus miles de daruma.',
      historia: 'Según la tradición del templo, en 727 los monjes gemelos Zenchū y Zensan levantaron aquí una ermita. El príncipe Kaisei (開成皇子), hijo del emperador Kōnin y medio hermano de Kanmu, fundó en 775 el Miroku-ji; en 780, un monje llamado Myōkan, tenido por encarnación de Kannon, talló la imagen principal (Kannon de once caras y mil brazos) con 18 ayudantes niños, y de ahí viene la fiesta mensual del día 18. En época Heian, el sexto abad, Gyōjun, rezó por la curación del emperador Seiwa. Según el templo, este le concedió el nombre de 勝王寺 («templo que venció al rey»), y por respeto se cambió 王 (rey) por 尾 (cola), con la misma pronunciación: 勝尾寺. Las fechas varían según la fuente: Kotobank sitúa el cambio de nombre en la era Jōgan (859–877), y los registros recogen una visita del ya emperador retirado Seiwa en 880. El templo ardió en la guerra Genpei (1184), y la tradición atribuye a Minamoto no Yoritomo la reconstrucción (1188). Conserva unos 1.200 documentos medievales.',
      significado: 'El concepto de 勝 («vencer») se fue ampliando: de la victoria de guerreros (devotos Minamoto, Ashikaga y Toyotomi, según el templo) a «ganar» en exámenes, enfermedades, elecciones, deporte o negocios.',
      curiosidades: [
        '¿Por qué hay daruma por todas partes? Cada uno es un kachi-daruma («daruma de la victoria») que alguien devolvió al templo tras cumplir su deseo. Lo que es de época Heian es la fama de dar suerte para ganar, no los daruma. A finales de diciembre se recogen y el 28 de diciembre se queman en una ceremonia.',
        'Fíjate en los mojones de piedra (町石). Marcan las distancias en chō del antiguo camino de subida; el de delante de la puerta principal lleva grabado 下乗 («desmontad aquí»). Se colocaron en 1247 y son los chōishi más antiguos que se conocen en Japón.',
        'Lo que es Sitio Histórico nacional (1966) no es «el templo» en sí, sino los ocho «almacenes de piedra» (八天石蔵) que marcaban los límites del recinto original (hacia 1230), cada uno con una figura de bronce de un Rey Celeste o un Rey de Sabiduría mirando hacia el pabellón principal, y esos mojones. Son unos hitos de linde rarísimos.',
        'La tumba del príncipe Kaisei está en el pico Saishō-ga-mine, al norte del recinto.',
      ],
      fuentes: [
        { label: '西国三十三所 (oficial de la peregrinación) — 第二十三番 勝尾寺', url: 'https://saikoku33.gr.jp/place/23' },
        { label: 'Kotobank — 勝尾寺', url: 'https://kotobank.jp/word/%E5%8B%9D%E5%B0%BE%E5%AF%BA-463899' },
        { label: '文化遺産オンライン — 勝尾寺旧境内牓示八天石蔵および町石', url: 'https://online.bunka.go.jp/heritages/detail/210670' },
        { label: 'OSAKA-INFO — 勝尾寺 (727, 880, 1184, 1188)', url: 'https://osaka-info.jp/experience/ja/osaka/spot/343' },
        { label: 'CNN Japan — 「ダルマ寺」 (inicio de la venta de daruma)', url: 'https://www.cnn.co.jp/travel/35232563.html' },
      ],
    },
  ],
  'osaka-castillo': [
    {
      nombre: 'Castillo de Osaka, visto desde fuera (大阪城)',
      queEs: 'El parque del castillo, con los muros y fosos del castillo que los Tokugawa reconstruyeron en el siglo XVII y una torre del homenaje (天守閣) de 1931.',
      historia: 'Hideyoshi empezó el castillo en 1583. Tras su caída en el asedio de verano (1615), el shogunato Tokugawa lo enterró: en la reconstrucción cubrió el castillo de los Toyotomi con gran cantidad de tierra (unos 6 m en el nivel intermedio del antiguo recinto principal) y construyó encima uno nuevo. Las obras (1620–1628/29, en tres fases) fueron un «encargo nacional» (天下普請) repartido entre 64 casas de señores feudales, sobre todo del oeste de Japón. La torre Tokugawa (1626) ardió por un rayo en 1665 y no se reconstruyó. La actual se terminó en noviembre de 1931 como conmemoración de la entronización del emperador Shōwa, por iniciativa del alcalde Seki Hajime y pagada con donativos de los ciudadanos. Es de hormigón armado con estructura de acero, tiene 5 tejados por fuera y 8 plantas por dentro, y mide 39,4 m sobre el basamento (52,7 m con él). En 1997 se registró como Bien Cultural Tangible, y en 2025 la ciudad la declaró Bien Cultural municipal. El 16 de octubre de 2026 el Consejo de Asuntos Culturales recomendó declararla Bien Cultural Importante del Estado (designación formal pendiente).',
      significado: 'El conjunto encierra el paso del Japón de Hideyoshi al de los Tokugawa: un castillo enterrado bajo otro. La torre de 1931 es, a su vez, un hito de la reconstrucción de castillos en el Japón moderno.',
      curiosidades: [
        'Todos los muros y fosos que veréis son Tokugawa. El folleto oficial lo dice sin rodeos: los de Hideyoshi no se pueden ver en superficie. Solo se ven bajo tierra en el Museo de los Muros Toyotomi (豊臣石垣館, abierto el 1 de abril de 2025), que muestra el muro del antiguo núcleo de Hideyoshi descubierto en 1984. Lleva marcas del fuego de 1615 e incluye piedras reutilizadas de templos antiguos.',
        'Tako-ishi (蛸石), la mayor piedra del castillo. Está en el recinto en ángulo (masugata) de la puerta Sakuramon. Tiene unos 60 m² de superficie vista (5,5 × 11,7 m) y se le estima un peso de unas 108 t. La hizo traer Ikeda Tadao en 1624 desde Bizen (Okayama), a más de 100 km. Su nombre viene de una mancha en la esquina inferior izquierda que recuerda a un pulpo.',
        'Busca los kokuin (刻印): marcas grabadas en las piedras (emblemas, círculos, esvásticas budistas, signos geométricos) que identificaban a la casa feudal responsable de cada bloque. Los estudios creen que su función principal era indicar la «propiedad» de la piedra, aunque muchas siguen sin descifrarse. Hay una explanada con piedras marcadas pasado el puente Gokuraku-bashi, en Yamazato-maru.',
        'En el muro del basamento de la torre, en el lado noreste, hay piedras torcidas y desplazadas por una bomba de una tonelada que cayó probablemente el 14 de agosto de 1945, la víspera de la rendición.',
      ],
      fuentes: [
        { label: 'Osaka Castle (oficial) — folleto del 豊臣石垣館 (todos los muros son Tokugawa; relleno de ~6 m)', url: 'https://osakacastle.net/pdf/leaflet/ishigaki_japanese.pdf' },
        { label: 'Ayuntamiento de Osaka — nota de prensa del 16/10/2026 (recomendación de declaración como BCI, datos de la torre)', url: 'https://www.city.osaka.lg.jp/hodoshiryo/kyoiku/0000689032.html' },
        { label: 'Agencia de Turismo (MLIT) — Air-Raid Damage to Stone Wall', url: 'https://www.mlit.go.jp/tagengo-db/en/R1-01747.html' },
        { label: 'Ayuntamiento de Osaka — documento de 64 casas feudales y fases 1620–1629', url: 'https://www.city.osaka.lg.jp/keizaisenryaku/cmsfiles/contents/0000626/626612/3syou_.pdf' },
        { label: 'Nabunken — informe sobre los kokuin', url: 'https://sitereports.nabunken.go.jp/en/article/265/pdf_page' },
        { label: '文化遺産オンライン — planos originales de la torre de 1931 (Furukawa Shigeharu)', url: 'https://online.bunka.go.jp/db/heritages/detail/291329' },
        { label: 'Ayuntamiento de Osaka — apertura del 豊臣石垣館', url: 'https://www.city.osaka.lg.jp/hodoshiryo/keizaisenryaku/0000677151.html' },
        { label: 'Agencia de Turismo (MLIT) — 蛸石 (texto en japonés)', url: 'https://www.mlit.go.jp/tagengo-db/common/001554786.pdf' },
        { label: 'Agencia de Turismo (MLIT) — Takoishi Stone', url: 'https://www.mlit.go.jp/tagengo-db/en/R1-01757.html' },
        { label: 'Agencia de Turismo (MLIT) — Osaka Castle Main Tower (1931, donativos)', url: 'https://www.mlit.go.jp/tagengo-db/en/R1-01758.html' },
        { label: 'tabi-mag — clasificación de piedras gigantes', url: 'https://tabi-mag.jp/os032/' },
      ],
    },
  ],
  kuromon: [
    {
      nombre: 'Mercado Kuromon (黒門市場)',
      queEs: 'Mercado cubierto de Nipponbashi, conocido como «la cocina de Osaka», especializado en pescado, marisco y productos frescos.',
      historia: 'Durante la era Bunsei (hacia 1822–1823) los pescaderos empezaron a vender delante del templo Enmyō-ji (圓明寺), que estaba al oeste del mercado actual y tenía la puerta principal lacada en negro. En la era Meiji el mercado se llamaba oficialmente «mercado del Enmyō-ji» y en 1902 fue reconocido como mercado público. En el gran incendio de Namba de 1912 ardieron el templo y la puerta, pero el recuerdo de «la puerta negra del Enmyō-ji» quedó en el nombre: Kuromon («puerta negra»). Según la cronología del mercado, el nombre se fue imponiendo entre mediados de la era Taishō y principios de Shōwa. Tras la guerra se consolidó como «el estómago de Osaka»; a final de año llega a recibir más de 150.000 personas al día.',
      significado: 'Es el mercado que abastecía las cocinas y los restaurantes de la ciudad del kuidaore. Hoy convive con un público muy turístico.',
      curiosidades: [
        'El templo de la puerta negra sigue existiendo. No desapareció: el Enmyō-ji se trasladó a Terugaoka-Yata, en el distrito de Higashi-Sumiyoshi, donde sigue hoy. El mercado es el único sitio que conserva el recuerdo de su puerta.',
        'El nombre «Kuromon» es posterior a la propia puerta: mientras la puerta existió, el mercado se llamaba por el nombre del templo. Fue al quemarse cuando la puerta pasó a ser el nombre.',
      ],
      fuentes: [
        { label: 'Kuromon (oficial) — 市場の歴史', url: 'https://kuromon.com/jp/history/' },
        { label: 'Kuromon (oficial) — 黒門市場商店街年表', url: 'https://kuromon.com/jp/nenpyo/' },
        { label: 'Ayuntamiento de Osaka (Higashi-Sumiyoshi) — 圓明寺 (traslado, incendio de 1912)', url: 'https://www.city.osaka.lg.jp/higashisumiyoshi/page/0000032783.html' },
      ],
    },
  ],
  shinsekai: [
    {
      nombre: 'Shinsekai y la torre Tsūtenkaku (新世界・通天閣)',
      queEs: 'Barrio de ocio popular al sur de Namba, levantado en 1912 sobre parte del recinto de la 5.ª Exposición Industrial Nacional (1903), con la torre Tsūtenkaku como eje.',
      historia: 'Shinsekai («Nuevo Mundo») se inauguró en 1912. Según la Oficina de Turismo de Osaka, la mitad norte se inspiró en París y la mitad sur en Coney Island (Nueva York), donde estaba el parque de atracciones Luna Park, unido a la torre por un teleférico rojo. La primera Tsūtenkaku (1912) combinaba un arco del triunfo y la mitad superior de una torre Eiffel. Su altura varía según la fuente: 75 m según el operador de la torre, el Ayuntamiento y la mayoría de enciclopedias; 64 m según otras. El nombre («edificio alto que llega al cielo») se atribuye al erudito confuciano Fujisawa Nangaku. Luna Park cerró en 1923 (algunas fuentes dicen 1925). En 1943 un incendio en el cine de su base dañó la torre y, en lugar de repararla, se desmontó para aprovechar el acero en la guerra. La segunda Tsūtenkaku (1956), de 103 m, la pagaron los vecinos a través de una sociedad creada en 1955 y la diseñó Naitō Tachū, que poco después proyectaría la Tokyo Tower. Está registrada como Bien Cultural Tangible.',
      significado: 'Es el escaparate de la modernidad de importación de finales de Meiji (París y Nueva York en Osaka) y, después, el corazón de la Osaka obrera. Ahí nació el kushikatsu como comida barata para trabajadores.',
      curiosidades: [
        'Billiken no es japonés. Lo creó en 1908 la artista estadounidense Florence Pretz. La primera estatua llegó a Luna Park en 1912 y se perdió al cerrar el parque (1923). Volvió en 1980, y la actual es la tercera (2012, centenario de la primera torre). Frotarle las plantas de los pies da suerte.',
        'Busca el fresco del techo bajo la torre: es una restauración del original de 1912.',
        '«Prohibido mojar dos veces» (二度づけ禁止). La salsa del kushikatsu está en un recipiente común, así que no se vuelve a mojar un pincho ya mordido. El Ministerio de Agricultura sitúa el origen del kushikatsu en Shinsekai entre finales de Taishō y principios de Shōwa (hay varias teorías).',
      ],
      fuentes: [
        { label: 'Tsūtenkaku Kankō (operador oficial) — 資料館 (1912, 75 m, Fujisawa Nangaku, Billiken)', url: 'https://www.tsutenkaku.co.jp/other/shiryo.html' },
        { label: 'Agencia de Turismo (MLIT) / Oficina de Turismo de Osaka — Tsutenkaku', url: 'https://www.mlit.go.jp/tagengo-db/en/R4-00629.html' },
        { label: 'Ministerio de Agricultura (うちの郷土料理) — 串カツ (origen, 2度づけ禁止)', url: 'https://www.maff.go.jp/j/keikaku/syokubunka/k_ryouri/search_menu/menu/39_28_osaka.html' },
        { label: 'Kotobank — 通天閣', url: 'https://kotobank.jp/word/%E9%80%9A%E5%A4%A9%E9%96%A3-570612' },
        { label: 'OSAKA-INFO — ジャンジャン横丁 («ソース二度漬けお断り»)', url: 'https://osaka-info.jp/spot/janjan-yokocho-alley/' },
      ],
    },
  ],
  umeda: [
    {
      nombre: 'Umeda Sky Building y el observatorio Kūchū Teien (梅田スカイビル・空中庭園)',
      queEs: 'Rascacielos doble de 173 m y 40 plantas en Kita (Umeda), cuyas dos torres, separadas unos 50 m, se unen en la cima con un anillo-mirador: el Kūchū Teien («jardín flotante»).',
      historia: 'Lo proyectó Hiroshi Hara (原広司) con Atelier Φ, y lo construyó una agrupación de empresas encabezada por Takenaka. Las obras de Shin-Umeda City duraron del 29 de junio de 1990 al 25 de marzo de 1993; el mirador abrió el 2 de julio de 1993. El Ayuntamiento de Osaka lo describe como el primer rascacielos «conectado» del mundo (世界初の連結超高層). La pieza superior no se construyó arriba: el 18 de mayo de 1992 se izó, montada en el suelo, hasta los 150–173 m de altura. Subió a 35 cm por minuto y tardó 7 horas de izado, bajo la lluvia, dentro de una jornada de 14 horas (de 7:00 a 21:00). En 2014 el Ayuntamiento lo incluyó en su selección «Museo de Arquitectura Viva» (生きた建築ミュージアム).',
      significado: 'Es la utopía del «edificio-ciudad» de finales de la burbuja. Hara lo concibió como un ensayo de ciudad aérea del futuro. Para el Ayuntamiento es uno de los pocos rascacielos japoneses que merecen llamarse «obra de autor».',
      curiosidades: [
        'El nombre mezcla Babilonia y Swift: según el operador, «jardín aéreo» alude a los Jardines Colgantes de Babilonia y a la isla flotante de Laputa de Los viajes de Gulliver.',
        'Fíjate en el techo del mirador: las 442 lámparas se basan en planos de naves espaciales y no hay dos iguales; según el operador, Hara dibujaba tres cada noche. El hueco circular entre las torres representa el despegue de una nave, y en algún lugar del mirador hay escondida una imagen de una.',
        'El diario británico The Times lo incluyó entre los «20 edificios que representan el mundo», según el Ayuntamiento de Osaka.',
        'Las fachadas llevan unos 17.000 paneles de vidrio semiespejo para que el edificio «se funda» con el cielo. En la planta 22 hay un puente de 54 m entre las torres, sin apoyos, que solo se visita con tour guiado.',
      ],
      fuentes: [
        { label: 'Umeda Sky Building (oficial) — 梅田スカイビルディング (izado de 1992, cifras, curiosidades)', url: 'https://www.skybldg.co.jp/study/' },
        { label: 'Takenaka (constructora) — 新梅田シティ・梅田スカイビル', url: 'https://www.takenaka.co.jp/majorworks/40004201993.html' },
        { label: 'Ayuntamiento de Osaka — 生きた建築ミュージアム: 梅田スカイビル', url: 'https://www.city.osaka.lg.jp/toshiseibi/page/0000643953.html' },
        { label: 'Ayuntamiento de Osaka — ficha «英紙タイムズが『世界を代表する20の建造物』に取り上げた»', url: 'https://www.city.osaka.lg.jp/toshiseibi/cmsfiles/contents/0000266/266754/Umeda_Sky_Building.pdf' },
        { label: 'Agencia de Turismo (MLIT) — 梅田スカイビル 空中庭園', url: 'https://www.mlit.go.jp/tagengo-db/common/001653835.pdf' },
      ],
    },
  ],
  'den-den-town': [
    {
      nombre: 'Den Den Town (でんでんタウン / 日本橋)',
      queEs: 'El barrio de electrónica y cultura otaku de Nipponbashi (distritos 2 a 5), el equivalente en Osaka de Akihabara, con la calle Otaroad como eje del anime y el manga.',
      historia: 'En el periodo Edo, la calle de Nipponbashi era la entrada al camino de Kishū (Kishū Kaidō), con posadas a ambos lados; la zona se llamaba Nagamachi. Tras la Exposición Industrial de 1903, se convirtió en un barrio de librerías de lance comparable al de Kanda (Tokio). Hacia 1940 ya había 7 u 8 tiendas de radios y piezas. El bombardeo del 13 de marzo de 1945 arrasó la zona, y desde 1946 renació con tiendas de radios, válvulas y piezas, en buena parte excedentes militares. En los años 50 y 60 se pasó a los electrodomésticos. El apodo «Den Den Town» se adoptó en 1978, según la asociación de comerciantes. Desde finales de los 90 se fue convirtiendo en barrio de anime, videojuegos y figuras.',
      significado: 'Muestra cómo un barrio comercial ha cambiado de piel tres veces (camino de posadas, librerías y electrónica/otaku) siguiendo la tecnología de cada época.',
      curiosidades: [
        'Nipponbashi, no Nihonbashi. El puente sobre el canal de Dōtonbori que da nombre al barrio se lee «Nipponbashi», a diferencia del de Tokio. En el periodo Edo fue uno de los 12 puentes kōgi de Osaka, mantenidos directamente por el shogunato.',
        '¿Por qué «den den»? El origen se explica casi siempre por 電 (den), de 電気 (denki, electricidad): «el barrio del den-den».',
        'En 1888 se levantó aquí el Chōbōkaku, una torre de 5 plantas y 31 m que fue el primer edificio alto de Osaka y funcionaba casi como unos grandes almacenes.',
      ],
      fuentes: [
        { label: '日本橋筋商店街振興組合 (asociación oficial) — 日本橋の歴史', url: 'https://www.nippombashi.jp/history.php' },
        { label: 'Biblioteca Municipal de Osaka (Naniwa) — guía «浪速区を知る―でんでんタウン―»', url: 'https://www.oml.city.osaka.lg.jp/image_page/341_20260328_01.pdf' },
        { label: 'Ayuntamiento de Osaka — puente 日本橋 (にっぽんばし)', url: 'https://www.city.osaka.lg.jp/kensetsu/page/0000023842.html' },
        { label: 'Kotobank — 日本橋筋', url: 'https://kotobank.jp/word/%E6%97%A5%E6%9C%AC%E6%A9%8B%E7%AD%8B-109968' },
      ],
    },
  ],
  'hiroshima-paz': [
    {
      nombre: 'Parque Memorial de la Paz (平和記念公園)',
      queEs: 'Parque conmemorativo levantado entre 1950 y 1955 sobre el barrio de Nakajima, junto al hipocentro de la bomba del 6 de agosto de 1945. Reúne el Museo, el Cenotafio, la Llama de la Paz y el Monumento a los Niños.',
      historia: 'Tras la ley de 1949 para la «Ciudad Memorial de la Paz», el Ayuntamiento convocó un concurso (20 de mayo – 20 de julio de 1949) al que se presentaron 145 propuestas; ganó el equipo de Kenzō Tange (Universidad de Tokio). El plan traza un eje norte-sur perpendicular a la avenida de la Paz (100 m de ancho) que apunta a la Cúpula: explanada, Cenotafio, estanque y, al fondo, la Cúpula, al otro lado del río Motoyasu. El Cenotafio, con forma de casa haniwa, se inauguró el 6 de agosto de 1952 y guarda el registro de víctimas: 353.639 nombres en 132 volúmenes a 6 de agosto de 2026. La Llama de la Paz se encendió el 1 de agosto de 1964. El Monumento a los Niños se completó el 5 de mayo de 1958. El parque fue declarado Lugar de Belleza Escénica (名勝) el 6 de febrero de 2007.',
      significado: 'Es el lugar donde Japón convirtió el hipocentro en un espacio de duelo y de llamamiento contra las armas nucleares. La Agencia de Asuntos Culturales destaca que su diseño une «mirar» y «rezar» en un mismo eje.',
      curiosidades: [
        'Ponte detrás del Cenotafio, mirando al norte: en línea verás la Llama y, al fondo, la Cúpula. Es el eje de Tange. Antes de que existiera el parque, Nakajima era uno de los barrios comerciales más animados de la ciudad, y hubo familias viviendo en barracas en el solar hasta hacia 1959.',
        'Las barandillas de los dos puentes de la avenida de la Paz son de Isamu Noguchi. Una representa el sol (平和大橋, que bautizó «つくる», «construir»; al principio quería «いきる», «vivir», pero coincidía con la película Ikiru, de Kurosawa, estrenada en esas fechas) y la otra la quilla de una barca (西平和大橋, «ゆく», «partir»). Noguchi también diseñó un cenotafio que no llegó a construirse. Su diseño de barandillas fue tan polémico que se elevaron 20 cm respecto al proyecto.',
        'Monumento a los Niños y Sadako Sasaki. Sadako tenía 2 años cuando cayó la bomba. Enfermó de leucemia (diagnóstico en febrero de 1955) y murió el 25 de octubre de 1955, a los 12 años. Según el Museo, en menos de un mes superó las 1.000 grullas, en contra de la versión muy difundida fuera de Japón de que no llegó a terminarlas. El monumento (9 m, del escultor Kikuchi Kazuo) se pagó con donaciones de todo el país promovidas por niños y estudiantes. Fíjate en el interior: una campana con forma de dōtaku, con caligrafía del Nobel Hideki Yukawa, y una grulla dorada colgada que hace de badajo. Cada año llegan unos 10 millones de grullas (unas 10 toneladas).',
        'La Llama de la Paz arderá «hasta el día en que las armas nucleares desaparezcan de la Tierra». Se encendió con «fuego religioso» de templos y santuarios de todo Japón (12 escuelas según el Museo; 35 santuarios, templos e iglesias según el Ayuntamiento) y «fuego industrial» de altos hornos. Según el Museo, la encendieron siete jóvenes de Hiroshima nacidas el 6 de agosto de 1945.',
      ],
      fuentes: [
        { label: 'Ayuntamiento de Hiroshima — Web展示会「平和記念公園ができるまで」', url: 'https://www.city.hiroshima.lg.jp/tourism-culture/history/1003068/1027532/1008364.html' },
        { label: 'Agencia de Asuntos Culturales — 平和記念公園 (名勝, eje)', url: 'https://www.bunka.go.jp/kindai/showa100th/06/index.html' },
        { label: '文化遺産オンライン — 平和記念公園', url: 'https://online.bunka.go.jp/heritages/detail/203646' },
        { label: 'Ayuntamiento de Hiroshima — registro de víctimas (353.639 nombres, 6/8/2026)', url: 'https://www.city.hiroshima.lg.jp/atomicbomb-peace/1037854/1021103/1003092.html' },
        { label: 'Ayuntamiento de Hiroshima — 折り鶴と「原爆の子の像」', url: 'https://www.city.hiroshima.lg.jp/atomicbomb-peace/1036664/1006055/1003093.html' },
        { label: 'Museo de la Paz — ficha 原爆の子の像 (1958, más de 1.000 grullas)', url: 'https://hpmmuseum.jp/modules/xelfinder/index.php/view/2611/16.%20%E5%8E%9F%E7%88%86%E3%81%AE%E5%AD%90%E3%81%AE%E5%83%8F.pdf' },
        { label: 'Prefectura de Hiroshima — 原爆の子の像', url: 'https://www.pref.hiroshima.lg.jp/site/hiroshimaforpeace/childrens-peace-monument.html' },
        { label: 'Museo de la Paz — ficha 平和の灯', url: 'https://hpmmuseum.jp/modules/xelfinder/index.php/view/2613/18.%20%E5%B9%B3%E5%92%8C%E3%81%AE%E7%81%AF.pdf' },
        { label: 'Ayuntamiento de Hiroshima — 原爆関係の慰霊碑等の概要', url: 'https://www.city.hiroshima.lg.jp/atomicbomb-peace/1037854/1021103/1015288.html' },
        { label: 'Ayuntamiento de Hiroshima — barandillas de Noguchi', url: 'https://www.city.hiroshima.lg.jp/living/doro-kotsu-kasen/1021384/1026408/1018897.html' },
        { label: '文化遺産オンライン — Isamu Noguchi «追想» (cenotafio no adoptado)', url: 'https://online.bunka.go.jp/heritages/detail/228991' },
      ],
    },
    {
      nombre: 'Museo Memorial de la Paz de Hiroshima (広島平和記念資料館)',
      queEs: 'El museo que documenta el bombardeo atómico y sus consecuencias humanas, con un edificio principal diseñado por Kenzō Tange y un edificio este.',
      historia: 'Se construyó a partir del proyecto ganador del concurso de 1949: las obras empezaron en febrero de 1951 y abrió el 24 de agosto de 1955. El 5 de julio de 2006 el edificio principal fue declarado Bien Cultural Importante, el primer edificio de posguerra en recibir esa protección según el Ayuntamiento y el propio museo. La Agencia de Asuntos Culturales lo considera la primera arquitectura japonesa de posguerra con gran reconocimiento internacional y el punto de partida de Tange. El edificio principal reabrió renovado en 2019. Bate récords de visitas: 2.264.543 en el ejercicio 2024 y 2.267.662 (provisional) en el 2025. Superó los 80 millones de visitantes acumulados el 16 de marzo de 2025.',
      significado: 'Pone rostros y objetos concretos a la cifra de víctimas. Ha sido decisivo para el mensaje internacional de Hiroshima a favor de la abolición de las armas nucleares.',
      curiosidades: [
        'El edificio se apoya en pilares (pilotis). La planta baja está casi vacía, y según el Ayuntamiento esto conserva la vista hacia la Cúpula a través de las columnas. La Agencia de Asuntos Culturales recoge que ese espacio bajo el edificio quería expresar la fuerza del ser humano que se levanta de entre las ruinas.',
        'La «piedra de la sombra humana» (人影の石). Son los escalones de la entrada de la sucursal del banco Sumitomo, a 260 m del hipocentro. Alguien que esperaba sentado a que abriera el banco murió en el acto, y el calor blanqueó la piedra alrededor dejando una mancha oscura donde estaba. El banco la donó en 1971, al reformar su edificio.',
      ],
      fuentes: [
        { label: '文化遺産オンライン — 広島平和記念資料館 (BCI, pilotis)', url: 'https://online.bunka.go.jp/heritages/detail/149261' },
        { label: 'Museo de la Paz — ficha del edificio (apertura 24/8/1955, BCI 2006)', url: 'https://hpmmuseum.jp/modules/xelfinder/index.php/view/2644/27.%20%E5%BA%83%E5%B3%B6%E5%B9%B3%E5%92%8C%E8%A8%98%E5%BF%B5%E8%B3%87%E6%96%99%E9%A4%A8.pdf' },
        { label: 'Museo de la Paz — 人影の石', url: 'https://hpmmuseum.jp/modules/exhibition/index.php?action=ItemView&item_id=78&lang=jpn' },
        { label: 'Museo de la Paz — traslado de la piedra en 1971 (archivo fotográfico)', url: 'https://hpmmuseum.jp/virtual/VirtualMuseum_j/exhibit/exh0507/exh050702.html' },
        { label: 'Fundación Cultural para la Paz de Hiroshima — nota de visitantes (febrero de 2026)', url: 'https://www.pcf.city.hiroshima.jp/hpcf/oshirase/PressReleases/2026/080207_unei.pdf' },
        { label: 'Ayuntamiento de Hiroshima — FAQ sobre el Museo', url: 'https://www.city.hiroshima.lg.jp/faq/atomicbomb-peace/1001613/1002380.html' },
      ],
    },
    {
      nombre: 'Cúpula de la Bomba Atómica (原爆ドーム)',
      queEs: 'La ruina del antiguo Pabellón de Promoción Industrial de la Prefectura de Hiroshima, conservada tal como quedó tras la explosión. Patrimonio Mundial (1996) y Sitio Histórico Especial (2025).',
      historia: 'La proyectó el arquitecto checo Jan Letzel (ヤン・レツル). Las obras empezaron en 1914 y el edificio se inauguró el 5 de abril de 1915 como Pabellón de Exposición de Productos de la Prefectura (広島県物産陳列館). Era de ladrillo, de tres plantas, con una caja de escalera central de cinco plantas coronada por una cúpula elíptica. Cambió de nombre en 1921 (広島県立商品陳列所) y en 1933 (広島県産業奨励館, Pabellón de Promoción Industrial), y desde 1944 lo ocupaban oficinas públicas. El 6 de agosto de 1945, a las 8:15, la bomba estalló a unos 600 m de altura y a unos 160 m al sureste del edificio; todos los que trabajaban dentro murieron en el acto. Su conservación se discutió durante años, porque parte de la ciudad quería demolerlo. El diario de Hiroko Kajiyama, expuesta a la radiación con un año y muerta de leucemia 15 años después, impulsó el movimiento a favor. En julio de 1966 el pleno municipal aprobó conservarla, y desde 1967 se han hecho cinco campañas de consolidación (la última en 2020–2021). Fue declarada Sitio Histórico en 1995 y Patrimonio Mundial en diciembre de 1996, después de que el Estado, que al principio se resistía, cediera ante unas 1,65 millones de firmas. El 18 de septiembre de 2025 fue declarada Sitio Histórico Especial (特別史跡), la primera de época Meiji o posterior con esa categoría.',
      significado: 'Es el testimonio material más reconocible del primer bombardeo atómico, conservado deliberadamente como advertencia y no reconstruido.',
      curiosidades: [
        'Por qué quedó en pie. La onda expansiva llegó casi en vertical, desde arriba: hundió el tejado y la cúpula (con mucha madera) y los gruesos muros laterales, más resistentes a la presión vertical, aguantaron. Del cupulino solo quedó el armazón metálico, y de ahí el apodo de «cúpula».',
        'El hipocentro no está en la Cúpula. Está a unos 160 m, a pie, sobre el antiguo Hospital Shima (hoy clínica 島内科医院, en Ōtemachi 1-chōme), donde una placa lo señala. Se dice que el objetivo era el puente Aioi, con su rara forma de T (desde 1934), pero la bomba estalló a unos 300 m de él.',
        'No era «lo único que quedó en pie». Otros edificios cercanos también resistieron. Por ejemplo, la antigua Casa del Combustible (hoy Rest House del parque), a solo 170 m del hipocentro.',
        'Un checo en Hiroshima: Letzel diseñó el edificio en estilo europeo, insólito en la ciudad de 1915. Como Pabellón de Productos, en él se celebraban exposiciones y se vendían productos de la prefectura.',
      ],
      fuentes: [
        { label: 'Ayuntamiento de Hiroshima — 原爆ドーム (historia, conservación, UNESCO)', url: 'https://www.city.hiroshima.lg.jp/atomicbomb-peace/1036664/1021115/1015065.html' },
        { label: 'Ayuntamiento de Hiroshima — declaración como Sitio Histórico Especial (2025)', url: 'https://www.city.hiroshima.lg.jp/tourism-culture/history/1021438/1049769/1050342/index.html' },
        { label: '文化遺産オンライン — 原爆ドーム（旧広島県産業奨励館）', url: 'https://online.bunka.go.jp/index.php/heritages/detail/206313' },
        { label: 'Ayuntamiento de Hiroshima — FAQ: por qué no se derrumbó', url: 'https://www.city.hiroshima.lg.jp/faq/atomicbomb-peace/1001613/1028187/1002370.html' },
        { label: 'Ayuntamiento de Hiroshima — FAQ: dónde estalló la bomba', url: 'https://www.city.hiroshima.lg.jp/site/faq/9447.html' },
        { label: 'Museo de la Paz — puente Aioi', url: 'https://hpmmuseum.jp/modules/xelfinder/index.php/view/2601/6.%20%E7%9B%B8%E7%94%9F%E6%A9%8B.pdf' },
        { label: 'Museo de la Paz — placa del hipocentro y Hospital Shima', url: 'https://hpmmuseum.jp/modules/xelfinder/index.php/view/2618/43.%20%E7%88%86%E5%BF%83%E5%9C%B0%E3%83%BB%E5%B3%B6%E7%97%85%E9%99%A2(%E5%8E%9F%E7%88%86%E8%A2%AB%E7%81%BD%E8%AA%AC%E6%98%8E%E6%9D%BF' },
        { label: 'Museo de la Paz — ficha de la Cúpula (inauguración 5/4/1915)', url: 'https://hpmmuseum.jp/modules/xelfinder/index.php/view/2655/38.%20%E5%8E%9F%E7%88%86%E3%83%89%E3%83%BC%E3%83%A0(%E5%BA%83%E5%B3%B6%E5%B9%B3%E5%92%8C%E8%A8%98%E5%BF%B5%E7%A2%91' },
      ],
    },
  ],
  asakusa: [
    {
      nombre: 'Sensō-ji (浅草寺)',
      queEs: 'El templo budista más antiguo de Tokio, dedicado a Shō Kannon (聖観世音菩薩), bodhisattva de la compasión. Desde 1950 es la sede central de la escuela Shō Kannon-shū (聖観音宗); hasta entonces perteneció a la escuela Tendai.',
      historia: 'Según la tradición del templo, la mañana del 18 de marzo de 628 los hermanos pescadores Hinokuma Hamanari y Takenari (檜前浜成・竹成) sacaron con la red una imagen de Kannon del río Sumida (entonces río Miyato). La devolvieron al agua varias veces, pero la imagen volvía a la red una y otra vez. Haji no Nakatomo (土師中知), notable del lugar, la reconoció como Shō Kannon y convirtió su casa en templo. En 645 el monje Shōkai (勝海) levantó la sala de Kannon. En 857 Ennin (円仁) talló la imagen que hoy se muestra en su lugar (omaedachi, 御前立) y se le venera como «refundador». Kotobank recuerda que el relato fundacional contiene elementos legendarios. Por otro lado, los hallazgos arqueológicos indican que ya a mediados del siglo VIII había aquí un templo que congregaba a mucha gente. La sala principal (Hondō) fue Tesoro Nacional desde 1907, ardió en el bombardeo del 10 de marzo de 1945 y se reconstruyó en hormigón armado con donaciones de fieles: obras de 1951 a 1958, inaugurada el 15 de octubre de 1958. Según el templo, a lo largo de su historia la sala se ha reconstruido unas 20 veces.',
      significado: 'Es el centro espiritual del shitamachi, el Edo popular. El templo se reconstruyó tras cada incendio, terremoto y bombardeo. Durante el periodo Edo, su entorno fue el gran barrio de ocio de la ciudad («江戸きっての盛り場», según Kotobank).',
      curiosidades: [
        'La imagen que nadie ve. La imagen principal es un hibutsu (秘仏) absoluto, y el templo afirma que está oculta desde 645. Según el relato del templo, el monje Shōkai recibió en sueños el aviso de que no debía mirarla directamente. La tradición dice que mide «一寸八分», unos 5,5 cm, y en la era Meiji se la anunciaba como «el Kannon de un sun y ocho bu». Ojo: es una medida tradicional, no una medición publicada, porque la imagen nunca se expone.',
        'Enterrada para salvarla. Según el templo, durante el bombardeo de 1945 la imagen se enterró unos 3 m bajo la sala principal, dentro de una pila de bronce, y así se salvó. En la época Edo, cuando había grandes incendios, se sacaba en un palanquín de emergencia.',
        'Fíjate en el techo y en el tejado. En el techo de la sala exterior hay un gran dragón (龍之図, unos 6,4 × 4,9 m) pintado por Kawabata Ryūshi (川端龍子) y figuras celestiales de Dōmoto Inshō (堂本印象). Desde 2010, las tejas son de titanio, más ligeras para reducir el riesgo sísmico (unas 89.000 piezas).',
        'El edificio más antiguo está a un lado. La puerta este, Nitenmon (二天門), es de 1649 y es Bien Cultural Importante del país. Nació como puerta del santuario Tōshō-gū que había dentro del recinto y se rebautizó en 1884 tras la separación entre budismo y sintoísmo. Sobrevivió a 1945. En la puerta Hōzōmon, busca las sandalias de paja gigantes (大わらじ, 4,5 m y unos 500 kg) que ofrecen vecinos de Murayama (Yamagata). Según el templo, sirven para que el mal crea que el guardián que las calza es enorme y huya.',
      ],
      fuentes: [
        { label: 'Sensō-ji — Historia (浅草寺について)', url: 'https://www.senso-ji.jp/about/' },
        { label: 'Sensō-ji — Sala principal (本堂)', url: 'https://www.senso-ji.jp/guide/guide04.html' },
        { label: 'Sensō-ji — Nitenmon (二天門)', url: 'https://www.senso-ji.jp/guide/guide11.html' },
        { label: 'Sensō-ji — Hōzōmon (宝蔵門)', url: 'https://www.senso-ji.jp/guide/guide03.html' },
        { label: 'Kotobank — 浅草寺 (日本大百科全書 y otros)', url: 'https://kotobank.jp/word/%E6%B5%85%E8%8D%89%E5%AF%BA-87403' },
        { label: 'Museo Edo-Tokio — postal «一寸八分の観音様で名高い浅草観世音堂»', url: 'https://www.edohakuarchives.jp/detail-106335.html' },
        { label: 'GO TOKYO — Sensō-ji', url: 'https://www.gotokyo.org/en/spot/15/index.html' },
      ],
    },
    {
      nombre: 'Kaminarimon (雷門) y Nakamise-dōri (仲見世通り)',
      queEs: 'Kaminarimon es la puerta exterior de Sensō-ji. Su nombre oficial es Fūraijinmon (風雷神門), «puerta de los dioses del viento y del trueno». Nakamise es la calle comercial de unos 250 m que va desde ella hasta la puerta Hōzōmon.',
      historia: 'Según la tradición, la puerta la levantó Taira no Kinmasa (平公雅) en 942 (Tengyō 5) al reconstruir el templo, aunque el propio Sensō-ji admite que su origen exacto es incierto. Se trasladó a su emplazamiento actual en 1635, y la versión de 1649 es la primera llamada «Kaminarimon». Ardió en 1642, 1767 y 1865 (Keiō 1). Durante 95 años solo hubo puertas provisionales. La actual, de hormigón, es de 1960 y la pagó Matsushita Kōnosuke, fundador de Matsushita Electric (hoy Panasonic). Nakamise nació hacia 1685: el templo dejó a los vecinos montar puestos bajo los aleros de los subtemplos a cambio de limpiar el recinto. La asociación de comerciantes sitúa su origen de forma más amplia en las eras Genroku–Kyōhō. En 1885 el gobierno de Tokio desalojó los puestos y levantó tiendas de ladrillo de estilo occidental. El terremoto de 1923 las destruyó, en 1925 se rehicieron en hormigón con laca bermellón y, tras arder en 1945, se restauraron conservando la estructura exterior.',
      significado: 'Es el umbral ritual y la imagen-símbolo de Asakusa. Fūjin y Raijin, que miran hacia fuera, protegen el templo del viento y de las inundaciones.',
      curiosidades: [
        'Por qué donó Matsushita. Según el propio Sensō-ji, Matsushita sufría dolores articulares. Se curó después de que el abad Shimizutani Kyōjun (清水谷恭順) rezara por él ante la imagen principal, y en agradecimiento donó la puerta a título personal. La Agencia de Turismo confirma la donación de 1960, pero no menciona el motivo.',
        'Fíjate en la parte de atrás. Por el lado interior hay otras dos estatuas: Tenryū (天龍) y Kinryū (金龍), deidades budistas con cola de dragón, de 2,93 m y 2,74 m, talladas en ciprés de Kiso. Las hicieron Hirakushi Denchū y Sugawara Yasuo en 1978 y las regaló el grupo Matsushita. Mira también el reverso del farol, donde pone 風雷神門, y su base, que lleva un dragón tallado.',
        'El farol se renueva. Mide 3,9 m de alto y 3,3 m de ancho, pesa unos 700 kg y la renovación de abril de 2020 fue la sexta. Durante el Sanja Matsuri se pliega para que pasen los mikoshi. Los Fūjin y Raijin actuales se volvieron a tallar en 1874, porque del incendio de 1865 solo se salvaron las cabezas.',
        'Fíjate en las persianas de Nakamise. Cuando las tiendas cierran, las persianas bajadas forman un mural continuo de las fiestas anuales de Asakusa, el «浅草絵巻». Se pintó en 1989 bajo la dirección del profesor de la Universidad de Bellas Artes de Tokio Hirayama Ikuo. Hay unas 85–90 tiendas; el número exacto varía según la fuente (86, 87 u 88).',
      ],
      fuentes: [
        { label: 'Sensō-ji — Kaminarimon (雷門)', url: 'https://www.senso-ji.jp/guide/guide01.html' },
        { label: 'Sensō-ji — Nakamise (仲見世)', url: 'https://www.senso-ji.jp/guide/guide02.html' },
        { label: 'Asociación de Nakamise — 仲見世について', url: 'https://www.asakusa-nakamise.jp/about/index.html' },
        { label: 'Agencia de Turismo (MLIT), textos multilingües — 雷門 (PDF)', url: 'https://www.mlit.go.jp/tagengo-db/common/001554402.pdf' },
        { label: 'Agencia de Turismo (MLIT) — 仲見世 (PDF)', url: 'https://www.mlit.go.jp/tagengo-db/common/001554404.pdf' },
        { label: 'Kotobank — 浅草寺', url: 'https://kotobank.jp/word/%E6%B5%85%E8%8D%89%E5%AF%BA-87403' },
        { label: 'Agencia de Turismo (MLIT) — Kaminarimon, ficha en inglés', url: 'https://www.mlit.go.jp/tagengo-db/R1-01373.html' },
      ],
    },
    {
      nombre: 'Asakusa Jinja (浅草神社) y el Sanja Matsuri (三社祭)',
      queEs: 'Santuario sintoísta pegado a la sala principal de Sensō-ji. Venera como dioses locales a los tres «fundadores» del templo budista: los hermanos Hinokuma Hamanari y Takenari, y Haji no Nakatomo. De ahí su nombre popular, «Sanja-sama» (los tres santuarios).',
      historia: 'No se sabe cuándo se fundó; el santuario lo sitúa entre finales de Heian y comienzos de Kamakura. El edificio actual lo construyó y donó el tercer shōgun, Tokugawa Iemitsu, en 1649 (Keian 2). Es de estilo gongen-zukuri, el mismo del Tōshō-gū de Nikkō, y se declaró Bien Cultural Importante en 1951. Sobrevivió a incendios, al terremoto de 1923 y a la guerra. Se llamó Sanja Gongen hasta que en 1868, con la separación entre budismo y sintoísmo, pasó a ser «Sanja Myōjin-sha», y en 1873 recibió el nombre de Asakusa Jinja.',
      significado: 'Antes de Meiji, templo y santuario funcionaban como un solo complejo. Es un caso clarísimo de shinbutsu-shūgō: los fundadores humanos de un templo budista acabaron venerados como kami justo al lado. El Sanja Matsuri, que el santuario y Kotobank cuentan entre los «tres grandes festivales de Edo», es su gran fiesta.',
      curiosidades: [
        'No coincidiréis con el festival. El Sanja Matsuri se celebra el viernes, sábado y domingo del fin de semana del tercer sábado de mayo. En 2027 serán previsiblemente los días 14–16 de mayo, nueve días antes de vuestra visita. El santuario calcula unos 1,8 millones de asistentes. El domingo salen al amanecer los tres mikoshi principales (miyadashi) y vuelven al anochecer (miyairi). El sábado desfilan alrededor de un centenar de mikoshi de barrio.',
        'Mikoshi que se zarandean a propósito. Según el santuario, se sacuden con violencia de forma deliberada (tamafuri, 魂振り) para avivar el poder de la deidad. Antes de la guerra había un «cuarto mikoshi» llamado abare-mikoshi («el bravo»), y todos los de preguerra se perdieron en los bombardeos. En la Edad Media y en Edo la fiesta era fluvial: los mikoshi recorrían el Sumida en barca, una tradición que el santuario remonta a 1312.',
        'Fíjate en los komainu. La pareja de leones-perro de principios de Edo es un «matrimonio» (夫婦狛犬) y se asocia con la buena suerte en el amor. El santuario conserva además una estela dedicada a Ryōtsu Kankichi, protagonista del manga Kochikame, ambientado en este barrio.',
      ],
      fuentes: [
        { label: 'Asakusa Jinja — 御由緒', url: 'https://www.asakusajinja.jp/asakusajinja/about/' },
        { label: 'Asakusa Jinja — 三社祭とは', url: 'https://www.asakusajinja.jp/sanjamatsuri/about/' },
        { label: 'Kotobank — 浅草寺 (entrada sobre 三社祭 / 浅草神社)', url: 'https://kotobank.jp/word/%E6%B5%85%E8%8D%89%E5%AF%BA-87403' },
        { label: 'GO TOKYO — Asakusa Shrine', url: 'https://www.gotokyo.org/en/spot/383/index.html' },
      ],
    },
  ],
  'tokyo-skytree': [
    {
      nombre: 'Tokyo Skytree (東京スカイツリー)',
      queEs: 'Torre de radiodifusión y mirador de 634 m en Oshiage (Sumida), la estructura más alta de Japón. Tiene dos miradores: Tembo Deck (pisos 340–350) y Tembo Galleria (445–450).',
      historia: 'La impulsaron NHK y las cadenas comerciales, porque los rascacielos de unos 200 m ya bloqueaban la señal de la Torre de Tokio. La altura inicial prevista era de 610,58 m, apenas por encima del Chicago Spire proyectado (609,6 m). El 16 de octubre de 2009 se anunció la ampliación a 634 m prolongando unos 24 m la base de la antena. Fue justo cuando la torre de televisión de Cantón, de 610 m, ya no podía crecer más. El pararrayos que completó los 634 m se colocó el 18 de marzo de 2011, una semana después del gran terremoto de Tōhoku, que no dañó la estructura. Guinness la certificó como la torre más alta del mundo el 17 de noviembre de 2011. Se abrió el 22 de mayo de 2012 con unos 220.000 visitantes ese día, así que el 22 de mayo de 2027 cumplirá 15 años.',
      significado: 'La torre está en el shitamachi, junto al río Sumida y no en un distrito de negocios, y su diseño juega con códigos de la estética tradicional japonesa.',
      curiosidades: [
        '634 = «Mu-sa-shi». Según la web oficial, 6-3-4 se lee mu-sa-shi y evoca la antigua provincia de Musashi, que abarcaba Tokio y partes de Saitama y Kanagawa. La cifra se eligió también por ser fácil de recordar. El objetivo real del cambio de altura, según la prensa de 2009, era ser la torre más alta del mundo.',
        'El shinbashira: ¿copia de una pagoda? En el hueco central hay un cilindro de hormigón armado de unos 375 m de alto y 8 m de diámetro, el shinbashira (心柱). Está unido a la torre hasta los 125 m, y por encima de esa altura conecta con ella mediante amortiguadores. Como oscila con otro periodo que la estructura, los movimientos se contrarrestan, y según la prensa la sacudida sísmica se reduce hasta en un 50 %. El matiz importante: según Nikken Sekkei, citado por el Gobierno de Japón, no copiaron una pagoda. Estudiaron sistemas modernos de control de vibraciones, el resultado «acabó pareciéndose» al pilar central de las pagodas de cinco pisos y por eso le pusieron ese nombre.',
        'Fíjate en la silueta. La planta es un triángulo en la base y se va convirtiendo en círculo hacia arriba. El terreno era una antigua playa de vías de mercancías muy estrecha, de unos 400 × 100 m, y un triángulo equilátero permitía lados de unos 68 m. Por eso la torre cambia de perfil según desde dónde la mires. Las curvas combinan la sori (反り, curva cóncava, como la de una katana) y la mukuri (起り, curva convexa). El acero está pintado en 藍白 (aijiro), el tono más pálido del índigo tradicional.',
        'Iluminación con nombre propio. Los dos patrones originales son Iki (粋), azul claro que evoca el Sumida y la elegancia de Edo, y Miyabi (雅), violeta, el refinamiento. Se estrenaron el día de la inauguración.',
      ],
      fuentes: [
        { label: 'Tokyo Skytree — Datos y altura (634 m)', url: 'https://www.tokyo-skytree.jp/about/spec/' },
        { label: 'Tokyo Skytree — Diseño (そり・むくり, triángulo → círculo)', url: 'https://www.tokyo-skytree.jp/about/design/' },
        { label: 'nippon.com — 東京スカイツリー (柳澤美帆, 2012)', url: 'https://www.nippon.com/ja/views/b01101/' },
        { label: 'Gobierno de Japón, Highlighting Japan (心柱 y Nikken Sekkei)', url: 'https://www.gov-online.go.jp/eng/publicity/book/hlj/html/201210/201210_04j.html' },
        { label: 'Mynavi News — 610,58 m → 634 m (2009)', url: 'https://news.mynavi.jp/article/chideji-13/' },
        { label: 'Obayashi — Dispositivos de control de vibraciones', url: 'https://www.obayashi.co.jp/solution_technology/detail/skytree05.html' },
      ],
    },
  ],
  akihabara: [
    {
      nombre: 'Akihabara (秋葉原)',
      queEs: 'Barrio en torno a la estación de Akihabara (Chiyoda/Taitō). Fue el mayor mercado de electrónica de Japón y hoy es un centro mundial del anime, el manga, los videojuegos y las figuras. En la calle todo el mundo lo llama «Akiba».',
      historia: 'En diciembre de 1869 un gran incendio arrasó la zona (unas 1.100 casas en Kanda Aioi-chō). El gobierno de Tokio dejó un cortafuegos (hiyokechi) y en 1870, por orden imperial, levantó en él un santuario llamado oficialmente 鎮火社 («santuario para sofocar el fuego»). El pueblo lo confundió con el famoso dios contra incendios Akiha Gongen (秋葉権現) y empezó a llamar al descampado «Akiba-ga-hara» o «Akiba-ppara». En 1888 el santuario se trasladó unos 3 km al norte, a Matsugaya (Taitō), para dejar sitio al ferrocarril. La estación abrió el 1 de noviembre de 1890 como estación de mercancías; en 1921 llegaba por ella el 45 % del arroz que entraba en Tokio por tren. Los pasajeros no llegaron hasta 1925. En 1933 se instalaron los mayoristas eléctricos Hirose Shōkai y Yamagiwa. Tras la guerra, en los puestos callejeros de Ogawamachi y Kanda-Sudachō, estudiantes de la Escuela de Ingeniería Eléctrica (hoy Universidad Tokyo Denki) montaban y vendían radios. Hacia 1950 unos 50 de los ~120 puestos eran de material eléctrico. Una orden de las autoridades de ocupación obligó a retirar los puestos callejeros entre 1950 y 1951, y los comerciantes se agruparon en edificios junto a la estación y bajo las vías: Radio Center (1949), Tokyo Radio Department Store y Radio Garden. Después llegó la fiebre de los «tres tesoros sagrados» de los años 50 (televisor, lavadora y nevera), luego la televisión en color, el vídeo y los microordenadores en los 70. En los 80–90 dominó el PC, y en los 90–2000 el anime, los juegos y las figuras.',
      significado: 'Akihabara resume el Japón moderno en un solo barrio: el mercado negro de posguerra, el milagro industrial y, por último, la cultura pop exportable.',
      curiosidades: [
        'Un nombre que es un malentendido. Ningún dios llamado «Akiba» se veneró aquí de forma oficial. El santuario era un 鎮火社 genérico, y en el mapa topográfico de la época solo pone «鎮火社». El nombre popular viene de identificarlo con Akiha Gongen. Según Kotobank, la estación se leía originalmente Akiba-hara. Según nippon.com, la lectura osciló (Akiha-no-hara, Akibahara, Akibappara) hasta fijarse como Akihabara en 1911. Por eso «Akiba» no es una abreviatura moderna, sino la pronunciación antigua.',
        'El santuario existe todavía. Es el Akiba Jinja (秋葉神社) de Matsugaya, en Taitō, a 3 km, y su ceremonia de caminar sobre el fuego se celebra cada 6 de noviembre.',
        'Fíjate bajo las vías. El laberinto de puestos de componentes del Akihabara Radio Center, bajo el paso elevado de la línea Chūō-Sōbu, es el heredero directo de los puestos de radio de 1949.',
      ],
      fuentes: [
        { label: 'nippon.com — 秋葉原: «火除の神» 秋葉権現が駅名の起源 (小林明, 2024)', url: 'https://www.nippon.com/ja/japan-topics/c13319/' },
        { label: 'Kotobank — 秋葉原', url: 'https://kotobank.jp/word/%E7%A7%8B%E8%91%89%E5%8E%9F-24600' },
        { label: 'Tōyō Keizai — Historia de Akiba (2015)', url: 'https://toyokeizai.net/articles/-/98479' },
        { label: 'Sumitomo Mitsui Trust, «このまちアーカイブス» — Kanda/Akihabara', url: 'https://smtrc.jp/town-archives/city/kanda/p08.html' },
        { label: 'Dempa Shimbun — Asociación de la Electric Town (2020)', url: 'https://dempa-digital.com/?p=116610' },
      ],
    },
    {
      nombre: 'Radio Kaikan (ラジオ会館)',
      queEs: 'Edificio comercial frente a la salida eléctrica de la estación, «世界のラジオ会館». Hoy está lleno de tiendas de figuras, cartas y coleccionismo.',
      historia: 'Abrió en 1950 como un edificio de madera de dos plantas. En 1962 se levantó un edificio de ocho plantas, que la empresa presenta como «el primer edificio alto de la Electric Town». En septiembre de 1976 NEC abrió en la 7.ª planta el Bit-INN Tokyo, centro de apoyo para su kit de microordenador TK-80, que impulsó la fiebre de la microinformática; Hitachi, Toshiba, Fujitsu y Mitsubishi le siguieron con sus propios espacios. En 1998 llegaron K-BOOKS, Kaiyodo y Volks, el comienzo de la era de las figuras. El edificio original cerró el 4 de agosto de 2011 y el nuevo, de 10 plantas, abrió el 20 de julio de 2014.',
      curiosidades: [
        'Un origen inesperado. La empresa desciende de la editorial Saitō Shobō (西東書房), fundada en 1893 y especializada en caligrafía: su diccionario de estilos caligráficos 『五體字類』 sigue reeditándose desde 1916.',
        '«Cuna del ordenador personal». En 2001 se colocó en la 7.ª planta una placa con el texto «日本のパーソナルコンピュータは、NEC Bit-INN東京で誕生し、全国に拡がりました».',
      ],
      fuentes: [
        { label: 'Akihabara Radio Kaikan — Historia (沿革)', url: 'https://akihabara-radiokaikan.co.jp/wp-ark/?page_id=4061' },
        { label: 'PC Watch — Bit-INN y la placa «パソコン発祥の地» (2001)', url: 'https://pc.watch.impress.co.jp/docs/article/20011112/akibah02.htm' },
        { label: 'Sumitomo Mitsui Trust, «このまちアーカイブス» — Kanda/Akihabara', url: 'https://smtrc.jp/town-archives/city/kanda/p08.html' },
        { label: 'Kyodo News PR Wire — Reapertura 20/07/2014', url: 'https://kyodonewsprwire.jp/release/201407152230' },
      ],
    },
  ],
  nakano: [
    {
      nombre: 'Nakano Broadway (中野ブロードウェイ)',
      queEs: 'Complejo de 10 plantas y 3 sótanos al norte de la estación de Nakano. Del sótano 1 a la 4.ª planta hay unos 300 locales comerciales, y de la 5.ª a la 10.ª, viviendas. Es la «meca» del coleccionismo otaku de segunda mano.',
      historia: 'Se terminó en 1966 como uno de los primeros complejos de tiendas y viviendas de Japón, e incluso el primero según TV Tokyo. Se lo anunció como «東洋一のビルディング» y TV Tokyo lo compara con lo que hoy sería Roppongi Hills. Las plantas altas se vendieron como apartamentos de lujo, y la seguridad del edificio atrajo a famosos y directivos. En la planta comercial había boutiques de alto nivel. Su decadencia empezó cuando abrieron centros comerciales en Shinjuku, Ogikubo y Kichijōji, y a comienzos de los 80 muchos locales tenían la persiana bajada. En 1980, Furukawa Masuzō (古川益三, hoy 益蔵), de 30 años, abrió en la 2.ª planta Mandarake, una tienda de manga de segunda mano de unos 2 tsubo (≈ 6,6 m²). La empresa se constituyó en febrero de 1987. La propiedad muy fragmentada abarató los alquileres, y tras Mandarake llegaron otras tiendas de nicho. En los 90 el edificio ya era el «聖地» (lugar sagrado) de la subcultura. Hoy Mandarake ocupa unos 35 locales entre la 1.ª y la 4.ª planta.',
      significado: 'Es el ejemplo de cómo un edificio de prestigio de la era del crecimiento acelerado se reinventó desde abajo, a base de pequeños comerciantes especializados y no de un plan urbanístico.',
      curiosidades: [
        'Vecinos famosos. Aquí vivieron el cantante Sawada Kenji («Julie») y Aoshima Yukio, guionista y actor que llegó a ser gobernador de Tokio. Los residentes tienen además jardín en la azotea.',
      ],
      fuentes: [
        { label: 'nippon.com — 中野ブロードウェイ (長谷川晶一, 2022)', url: 'https://www.nippon.com/ja/japan-topics/b02506/' },
        { label: 'Sumitomo Mitsui Trust, «このまちアーカイブス» — Nakano', url: 'https://smtrc.jp/town-archives/city/koenji/p07.html' },
        { label: 'TV Tokyo, «アド街ック天国» — Nakano Broadway (2003)', url: 'https://www.tv-tokyo.co.jp/adomachi/backnumber/20030816/28860.html' },
        { label: 'Diamond Online — Fundación de Mandarake (extracto de 『中野ブロードウェイ物語』, 2023)', url: 'https://diamond.jp/articles/-/323160' },
        { label: 'Mandarake — Historia según su informe anual de valores (EDINET, Agencia de Servicios Financieros)', url: 'https://edinetdb.jp/company/E03347/history' },
        { label: 'Nikkan Gendai — Sawada Kenji y Aoshima Yukio vivieron aquí', url: 'https://www.nikkan-gendai.com/articles/view/geino/377482' },
      ],
    },
  ],
  'kiyosumi-fukagawa': [
    {
      nombre: 'Kiyosumi Teien (清澄庭園)',
      queEs: 'Jardín de paseo (回遊式林泉庭園) alrededor de un gran estanque con tres islas, famoso por sus piedras traídas de todo Japón. Fue el primer Lugar de Belleza Paisajística de Tokio (東京都名勝第1号, 1979).',
      historia: 'Desde la era Kyōhō (1716–1736) fue la residencia secundaria (下屋敷) de los señores Kuze, del dominio de Sekiyado, y de esa época viene la forma básica del jardín. En 1878 lo compró Iwasaki Yatarō, fundador de Mitsubishi, para el recreo de sus empleados y para recibir a invitados ilustres. Abrió en 1880 como «Fukagawa Shinbokuen» y lo completó su hermano Iwasaki Yanosuke. El terremoto de 1923 quemó todos los edificios salvo el pabellón Ryōtei. En 1924 la familia Iwasaki donó la mitad este, la menos dañada, a la ciudad de Tokio (el distrito de Kōtō da 1925), y se abrió como parque público el 24 de julio de 1932.',
      significado: 'Es el jardín de un magnate Meiji, hecho con la logística de su propia naviera. Además, su papel de refugio en 1923 llevó a la familia Iwasaki a donarlo precisamente por su valor para la protección civil.',
      curiosidades: [
        'Piedras en barco de la casa. Según el Gobierno Metropolitano, los Iwasaki trajeron las piedras de todo el país en sus propios vapores: Izu-iso, Iyo-ao, Ikoma, Shikinejima, Sado-akadama (roja), Manazuru, granitos de Bitchū y Sanuki, piedra de Hozugawa de Kioto y otras. El Gobierno Metropolitano habla de «más de 50» piedras notables. Fíjate en el iso-watari (磯渡り), un camino de piedras sueltas por el borde del agua.',
        'El refugio de 1923. El estanque y los árboles frenaron el fuego, y se salvaron las personas que se refugiaron aquí. El Gobierno Metropolitano habla de unas 10.000; el botánico Fukushima Tsukasa, de 20.000. El jardín volvió a servir de refugio en el bombardeo de marzo de 1945.',
        'El Ryōtei (涼亭) de Lord Kitchener. El pabellón de estilo sukiya que avanza sobre el estanque se construyó en 1909 para recibir al mariscal británico Kitchener. Fue el único edificio que sobrevivió al terremoto de 1923.',
        'El Fuji-san y un haiku famoso. El montículo más alto, el «Fuji-san», está plantado de azaleas tsutsuji y satsuki. Las tsutsuji florecen a principios de mayo y las satsuki algo más tarde, así que a finales de mayo quizá queden flores. Busca también la estela con el haiku de Bashō «古池や蛙飛び込む水の音», traída desde la orilla del Sumida. El Taishō Kinenkan reutiliza materiales del pabellón funerario de la emperatriz Teimei (1953).',
      ],
      fuentes: [
        { label: 'Gobierno Metropolitano de Tokio, Oficina de Construcción — Plan de gestión del jardín Kiyosumi (PDF)', url: 'https://www.kensetsu.metro.tokyo.lg.jp/documents/d/kensetsu/070328kbetsumpkiyosumi' },
        { label: 'Distrito de Kōtō — 清澄庭園 (名勝)', url: 'https://www.city.koto.lg.jp/103020/bunkasports/bunka/bunkazaisiseki/mesho/16148.html' },
        { label: 'Gendai Business — 福嶋司, el refugio de 1923 (2023)', url: 'https://gendai.media/articles/-/110543' },
        { label: 'Tokyo Metropolitan Park Association — Kiyosumi Gardens (outline)', url: 'https://www.tokyo-park.or.jp/teien/en/kiyosumi/outline.html' },
      ],
    },
    {
      nombre: 'Fukagawa Edo Museum (深川江戸資料館)',
      queEs: 'Museo municipal de Kōtō. Su sala permanente reconstruye a tamaño real un trozo del barrio de Fukagawa Saga-chō a finales de Edo, en la era Tenpō (1830–1844). Se puede entrar en las casas.',
      historia: 'Abrió en noviembre de 1986 como equipamiento del distrito, para exponer y conservar materiales de la época Edo y servir de espacio vecinal; en noviembre de 2026 cumple 40 años. Para la reconstrucción se usó como referencia un plano catastral de 1760 (宝暦10年の沽券図). En julio de 2014 se añadió la sala del yokozuna Taihō.',
      significado: 'Muestra la vida de la gente corriente, casi ausente de la historia oficial: un almacén de abonos, posadas de barqueros, una frutería, una tienda de pulir arroz y el nagaya (casa de vecinos) con su pozo, su retrete y su pequeño santuario de Inari compartidos.',
      curiosidades: [
        'Un día simulado. Luces y sonido simulan un día completo, de la mañana a la noche.',
        'Casas con historia inventada pero coherente. Cada vivienda tiene asignados la composición de la familia, los oficios y las edades, y los objetos están elegidos en consecuencia. Fíjate en las herramientas del aserrador de Kiba (大鋸) y en el tocador de su esposa, en el puesto de nihachi soba y en la torre de vigilancia de incendios (火の見櫓) sobre el canal, junto a una barca chokibune.',
        'Un yokozuna vecino. La sala de Taihō, uno de los grandes campeones de la posguerra y primer ciudadano honorario de Kōtō, expone su moño (髷), sus delantales ceremoniales y réplicas de sus 32 copas.',
      ],
      fuentes: [
        { label: 'Fukagawa Edo Museum — 館の紹介', url: 'https://www.kcf.or.jp/fukagawa/outline/' },
        { label: 'Fukagawa Edo Museum — 常設展示', url: 'https://www.kcf.or.jp/fukagawa/josetsu/' },
        { label: 'Fukagawa Edo Museum — 横綱大鵬顕彰コーナー', url: 'https://www.kcf.or.jp/fukagawa/outline/taiho/' },
        { label: 'Distrito de Kōtō — 深川江戸資料館', url: 'https://www.city.koto.lg.jp/103020/shisetsuannai/kokyo/kinenkan/16762.html' },
        { label: 'Tabi-mag — 深川江戸資料館', url: 'https://tabi-mag.jp/tk0139/' },
      ],
    },
    {
      nombre: 'Naritasan Fukagawa Fudō-dō (成田山深川不動堂)',
      queEs: 'Templo de Tokio (東京別院) dependiente del gran templo Shingon de Naritasan Shinshō-ji (Chiba). Venera a Fudō Myōō, cuya imagen es una «división del espíritu» de la de Narita.',
      historia: 'Naritasan se fundó en 940, cuando el monje Kanchō llevó una imagen de Fudō para pacificar la rebelión de Taira no Masakado. En 1703 (Genroku 16) se celebró en Fukagawa la primera exposición itinerante (出開帳) de la imagen de Narita en Edo, en el templo Eitai-ji, que era el templo administrador de Tomioka Hachimangū. Naritasan considera esa exposición el origen del Fudō-dō. En 1881 se completó aquí un edificio con el nombre de «Fukagawa Fudō-dō». El terremoto de 1923 y el bombardeo de 1945 destruyeron los edificios, pero en ambos casos se salvó la imagen principal. En 1945 la evacuaron a Narita los monjes. El naibutsuden se terminó en 2002 y el nuevo hondō en septiembre de 2012, según el templo.',
      significado: 'Aquí el ritual se vive de cerca: el goma (護摩, ritual del fuego con tambores y mantras) se celebra a diario a las 9, 11, 13, 15 y 17 h.',
      curiosidades: [
        'El «Naritaya» del kabuki nació de esta devoción. Según Naritasan, el primer Ichikawa Danjūrō rezó a Fudō de Narita para tener un hijo. Tras nacer el segundo Danjūrō, la familia adoptó el nombre de casa (屋号) «成田屋», el mismo que el público grita aún hoy en los teatros. Durante la exposición de Fukagawa, padre e hijo interpretaron a Fudō en escena.',
        'El «edificio antiguo» viene de Chiba. Después de la guerra, las restricciones a la madera impedían construir. Por eso se desmontó y trasladó la sala de Jizō del templo Ryūfuku-ji (Inba, Chiba), de la era Bunkyū (1861–64), terminada aquí en 1950–51. Se eligió porque se creía obra del mismo maestro carpintero, Yagi Monjirō, que la sala de Narita que hoy es Bien Cultural Importante.',
        'Fíjate en la fachada nueva. El exterior del nuevo hondō está cubierto de caracteres sánscritos (梵字) con el mantra de Fudō. Dentro, el «corredor de oración» guarda unas 10.000 pequeñas pagodas de cristal (五輪塔) con imágenes de Fudō.',
      ],
      fuentes: [
        { label: 'Fukagawa Fudō-dō — 歴史と沿革', url: 'https://fukagawafudou.gr.jp/about/' },
        { label: 'Fukagawa Fudō-dō — 護摩祈祷', url: 'https://fukagawafudou.gr.jp/goma-prayer/' },
        { label: 'Naritasan Shinshō-ji — 略年表', url: 'https://www.naritasan.or.jp/about/history/' },
        { label: 'Naritasan Shinshō-ji — 市川團十郎と成田山', url: 'https://www.naritasan.or.jp/lp/danjurou/' },
        { label: 'Distrito de Kōtō — 深川不動堂旧本堂', url: 'https://www.city.koto.lg.jp/103020/bunkasports/bunka/bunkazaisiseki/kenzobutsu/17348.html' },
        { label: 'Rurubu — 深川不動堂 (真言梵字壁, 祈りの回廊)', url: 'https://rurubu.jp/andmore/article/2517' },
      ],
    },
    {
      nombre: 'Tomioka Hachimangū (富岡八幡宮)',
      queEs: 'El «Hachiman de Fukagawa», que se presenta como «el mayor santuario de Hachiman de Edo». Está considerado el lugar de nacimiento del kanjin-zumō de Edo, los torneos benéficos de los que desciende el sumo profesional actual.',
      historia: 'Se fundó en 1627 (Kan\'ei 4) por revelación divina en la isla de Eitai-jima, cuyos bancos de arena se rellenaron para crear el recinto y el barrio. Según la versión del propio santuario, el sacerdote Chōsei Hōin encontró el lugar señalado por una flecha de plumas blancas que había visto en un sueño. Gozó de la protección de los Tokugawa. En 1684 (Jōkyō 1) el shogunato autorizó aquí dos torneos de kanjin-zumō al año, en primavera y en otoño. Según el santuario, los torneos se celebraron en su recinto durante unos 100 años, y en ese tiempo se consolidaron los torneos periódicos y el sistema de clasificación banzuke. Desde la era Kansei (1789–1801) se celebraban cada vez más en el Ekōin de Ryōgoku, que en 1833 pasó a ser la sede fija.',
      significado: 'Es el vínculo físico entre el sumo de Edo y el actual. Cuando un luchador asciende a yokozuna, se graba su nombre en la estela del santuario en presencia de la Asociación de Sumo y él realiza aquí el dohyō-iri.',
      curiosidades: [
        'Fíjate en la Estela de los Yokozuna (横綱力士碑). La promovió en 1900 el 12.º yokozuna, Jinmaku Kyūgorō. Mide 3,5 m de alto y 3 m de ancho, pesa 20 t y lleva los nombres de todos los yokozuna desde el primero, Akashi Shiganosuke. En los laterales figuran como patrocinadores Itō Hirobumi, Yamagata Aritomo y Ōkuma Shigenobu. Al lado están la estela de los ōzeki y las huellas de manos y pies de luchadores gigantes: compara tu mano.',
        'Un mikoshi de récord. Según la tradición, el comerciante Kinokuniya Bunzaemon donó tres mikoshi recubiertos de oro, que ardieron en 1923. En 1991 se ofreció el «黄金大神輿», el mayor de Japón según el santuario: unos 4,5 t y 4,39 m de alto, con 24 kg de oro puro en el tejado, ojos de diamante en el fénix y 2.010 rubíes en su cresta. Es tan pesado que no se puede llevar a hombros todos los años, por eso en 1997 se hizo un segundo mikoshi.',
        'El punto de partida del mapa de Japón. Inō Tadataka vivía al lado y rezaba aquí antes de cada viaje de medición. El primero salió al alba del 11 de junio de 1800, rumbo a Ezo. Fíjate en su estatua de bronce (2001) junto al gran torii: a su lado hay un vértice geodésico de 3.er orden del Instituto Geográfico, uno de los primeros con el nuevo sistema de coordenadas.',
        '2027 es su año 400. El santuario cumple 400 años en 2027 y está en obras conmemorativas; su museo está cerrado por ellas.',
      ],
      fuentes: [
        { label: 'Tomioka Hachimangū — 御由緒', url: 'http://www.tomiokahachimangu.or.jp/annai/goyuisho/goyuisho.html' },
        { label: 'Tomioka Hachimangū — 相撲と富岡八幡宮', url: 'http://www.tomiokahachimangu.or.jp/annai/keidai/sumou.html' },
        { label: 'Tomioka Hachimangū — 日本一の黄金大神輿', url: 'http://www.tomiokahachimangu.or.jp/annai/maturi/maturih2.html' },
        { label: 'Tomioka Hachimangū — 深川八幡祭り', url: 'http://www.tomiokahachimangu.or.jp/annai/maturi/maturih1.html' },
        { label: 'Tomioka Hachimangū — 伊能忠敬銅像', url: 'http://www.tomiokahachimangu.or.jp/annai/inoTadataka/inoTadatak.html' },
        { label: 'Biblioteca Nacional de la Dieta — 江戸っ子の娯楽・相撲', url: 'https://www.ndl.go.jp/imagebank/column/sumo' },
        { label: 'Tomioka Hachimangū — A Long and Illustrious History (PDF)', url: 'http://www.tomiokahachimangu.or.jp/pdf/A%20Long%20and%20Illustrious%20History.pdf' },
      ],
    },
  ],
}

/** Devuelve las fichas de contexto de una zona, o undefined si no hay. */
export function getContext(zoneId: string): readonly ContextEntry[] | undefined {
  return context[zoneId]
}
