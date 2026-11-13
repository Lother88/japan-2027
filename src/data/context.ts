/**
 * Contexto cultural por zona, condensado del dossier docs/contexto-itinerario/v2/.
 *
 * Contenido NARRATIVO (qué es · historia · significado · curiosidades), escrito para leerse
 * de un vistazo en el móvil. Las fuentes que respaldan cada dato están en el dossier, no aquí.
 * Separado del modelo anti-spoiler: `Zone` NO tiene `description` (NOSPOIL-01) y los pasos
 * del día solo dan lugar + acción u hora (NOSPOIL-04). Esto vive aparte y se muestra en la
 * sección colapsable "El lugar" de cada zona.
 *
 * key = Zone.id (ver src/data/zones.ts). Cada zona puede tener varios POIs.
 */

export interface ContextEntry {
  /** Nombre del punto de interés (POI) */
  readonly nombre: string
  /** Qué es (definición breve) */
  readonly queEs: string
  /** Historia / datos clave */
  readonly historia: string
  /** Significado / por qué importa (alguna subentrada no lo tiene) */
  readonly significado?: string
  /** Curiosidades (normalmente 2–4) */
  readonly curiosidades: readonly string[]
}

export const context: Record<string, readonly ContextEntry[]> = {
  kanda: [
    {
      nombre: 'Kanda Myōjin (神田明神) y el Kanda Matsuri (神田祭)',
      queEs: 'Santuario sintoísta que fue el «guardián general de Edo» y hoy protege 108 barrios del centro de Tokio, Akihabara incluido. Venera a Daikoku, a Ebisu y al guerrero Taira no Masakado.',
      historia: 'Se fundó en 730 cerca del actual Ōtemachi. Masakado se rebeló contra la corte, se proclamó «Nuevo Emperador» en 939 y murió en combate en 940; los desastres atribuidos a su espíritu llevaron a venerarlo aquí desde 1309. En 1616 el santuario se trasladó a su sitio actual, al nordeste del castillo de Edo, la dirección nefasta que debía proteger. En 1874 Masakado fue apartado por rebelde y no volvió a la sala principal hasta 1984. La sala actual, de 1934, es de hormigón lacado en bermellón y por eso resistió los bombardeos de 1945.',
      significado: 'Su Kanda Matsuri es uno de los tres grandes festivales de Edo. Lo llamaban «festival bajo el cielo» porque sus carrozas entraban en el castillo y el shōgun presenciaba el desfile. Desde 1681 se alterna con otro festival, así que el grande solo toca en años impares: 2027 lo es.',
      curiosidades: [
        'Fechas del festival. El rito principal es siempre el 15 de mayo y el gran desfile cae en un fin de semana cercano.',
        'Komainu que te miran. Los perros-león de la sala, colocados tras el terremoto de 1923, miran de frente al visitante y no hacia el centro del camino, algo muy raro.',
        'Un detective con monumento. Busca la estela de Zenigata Heiji, el policía de novela que vivía «bajo Kanda Myōjin». Tiene forma de la moneda que el personaje lanzaba como arma. Cerca está la estatua de piedra de Daikoku más grande de Japón.',
        'La cabeza vengativa. Según la leyenda, la cabeza de Masakado, expuesta en Kioto, no cerraba los ojos y rechinaba los dientes pidiendo venganza; hoy se venera en un montículo de Ōtemachi. El santuario vende amuletos contra desgracias y, muy propio de Akihabara, uno para las tecnologías de la información.',
      ],
    },
  ],
  'palacio-imperial': [
    {
      nombre: 'Palacio Imperial — Jardín Este (皇居東御苑)',
      queEs: 'Jardín de unas 21 ha sobre los recintos interiores del antiguo castillo de Edo, sede de los shōgun Tokugawa. Abrió al público en 1968.',
      historia: 'La última gran torre del castillo, de 1638, medía unos 60 m con su base de piedra: la más alta de todos los castillos de Japón. Ardió en el Gran Incendio de Meireki (1657). La base se rehízo, pero la torre nunca, porque el regente Hoshina Masayuki sentenció que «en tiempos de paz no hace falta una torre». El jardín se construyó entre 1961 y 1968.',
      significado: 'Aquí estuvo el centro político de Japón durante los dos siglos y medio de paz Tokugawa.',
      curiosidades: [
        'La torre, en maqueta. Sube a la base de piedra para hacerte una idea de la escala del castillo. Al lado, una maqueta muestra la torre de 1638.',
        'El escenario de los 47 rōnin. Un letrero marca el «gran pasillo de los pinos», donde en 1701 el señor de Akō atacó a Kira Yoshinaka. Lo condenaron al seppuku ese mismo día, y la venganza de sus vasallos se convirtió en el Chūshingura.',
        'Los guardias ninja. El Hyakunin-bansho, de 45 m de largo, alojaba compañías de arcabuceros, entre ellas las de Kōga e Iga, que vigilaban día y noche.',
        'Un árbol por prefectura. Cada prefectura tiene aquí su árbol, plantado en 1968; el de Okinawa llegó en 1972, cuando Estados Unidos devolvió la isla.',
      ],
    },
  ],
  ginza: [
    {
      nombre: 'Kabuki-za (歌舞伎座)',
      queEs: 'El principal teatro de kabuki de Japón. El edificio actual es la quinta versión del teatro y esconde una torre de oficinas tras la fachada tradicional.',
      historia: 'Lo promovió el periodista Fukuchi Ōchi para modernizar el teatro, y abrió en 1889 con fachada occidental e interior japonés. Ardió en 1921, el terremoto de 1923 frenó su reconstrucción y los bombardeos de 1945 lo dejaron casi destruido. Renació en 1924 y en 1951, y el edificio actual, del estudio de Kengo Kuma entre otros, abrió en 2013.',
      significado: 'El kabuki es Patrimonio Inmaterial de la UNESCO desde 2008, y el Kabuki-za es su escenario de referencia.',
      curiosidades: [
        'Cifras del escenario. Tiene 1.808 butacas, un escenario giratorio de 18,18 m de diámetro y una pasarela hanamichi de 18,18 m de largo. Hay además 96 localidades para ver un solo acto.',
        'Sin entrada también se sube. Desde la torre se llega a una galería sobre la historia del kabuki y a un jardín en la azotea.',
      ],
    },
    {
      nombre: 'Edificio Wakō y reloj Seiko (和光 / SEIKO HOUSE GINZA)',
      queEs: 'Edificio de esquina curva con torre de reloj en el cruce central de Ginza. Fue la sede de la relojería Hattori, hoy Seiko, y desde 2022 se llama SEIKO HOUSE GINZA.',
      historia: 'Hattori Kintarō abrió su relojería en Ginza en 1881 y en 1894 coronó esta esquina con un reloj. El edificio actual, de 1932, es obra de Watanabe Jin y se considera el gran símbolo de Ginza. Sobrevivió a los bombardeos de 1945, pero las tropas de ocupación lo requisaron como economato y la tienda Wakō no pudo instalarse hasta 1952.',
      significado: 'Es el punto de encuentro clásico de Ginza y una imagen del Japón moderno de entreguerras.',
      curiosidades: [
        'Escucha las campanadas. El reloj da las horas con un carillón tipo Westminster que empieza unos segundos antes de la hora en punto.',
        'Destruido por Godzilla. En la película original de 1954, Godzilla destroza esta torre del reloj, una de las escenas más célebres del cine japonés.',
      ],
    },
    {
      nombre: 'Paraíso peatonal de Ginza (銀座歩行者天国, «Hokoten»)',
      queEs: 'Los días en que la avenida principal de Ginza, Chūō-dōri, se cierra al tráfico y se pasea por la calzada.',
      historia: 'Lo impulsó el gobernador Minobe Ryōkichi contra los atascos y la contaminación, y se estrenó el 2 de agosto de 1970 a la vez en Ginza, Shinjuku, Ikebukuro y Asakusa. Aquel primer día acudieron unas 800.000 personas. En 1973 se cerró un tramo de 5,5 km de Ginza a Ueno, entonces el paraíso peatonal más largo del mundo.',
      significado: 'Simboliza el giro de los setenta: devolver la calle a las personas. Muchos otros desaparecieron; el de Ginza sigue siendo el más emblemático.',
      curiosidades: [
        'Fachadas de frente. Desde el centro de la calzada se ven de cara Wakō, Mitsukoshi y las grandes marcas, algo imposible el resto de la semana.',
        'Normas. No se permiten actuaciones, venta ambulante ni manifestaciones, y las bicis se llevan a mano.',
      ],
    },
  ],
  'harajuku-meiji': [
    {
      nombre: 'Meiji Jingū (明治神宮)',
      queEs: 'Santuario sintoísta dedicado al emperador Meiji y a la emperatriz Shōken. Lo rodea un bosque de unas 70 ha plantado a mano.',
      historia: 'Tras la muerte del emperador en 1912, una petición popular impulsó el santuario, que se fundó en 1920 en Yoyogi. Se plantaron unos 100.000 árboles donados desde todo Japón, con la ayuda de unos 110.000 jóvenes voluntarios. Los bombardeos de 1945 quemaron casi todos los edificios, pero el bosque apenas sufrió daños. La sala principal se reconstruyó en 1958.',
      significado: 'Es un bosque pensado para crecer durante un siglo y el lugar favorito de Tokio para el primer rezo del año (hatsumōde).',
      curiosidades: [
        'El bosque que el primer ministro no quería. Ōkuma Shigenobu pedía una majestuosa avenida de cedros y se quejó de que no quería «un matorral». Los ingenieros forestales le convencieron de que el cedro no prosperaría aquí y plantaron árboles de hoja perenne y ancha. Acertaron: hoy hay menos árboles pero mucho más grandes, y quizá frenaron el fuego en 1945.',
        'El gran torii. Es el mayor torii de madera de su estilo en Japón, con 12 m de alto. El original era de un ciprés taiwanés de unos 1.200 años; un rayo lo destruyó en 1966 y el actual (1975) salió de otro ciprés de Taiwán de unos 1.500 años.',
        'Barriles de sake… y de vino. Los barriles de sake que ofrecen las bodegas están vacíos. Enfrente hay barriles de vino de Borgoña, en recuerdo de la afición del emperador por la cocina y el vino occidentales.',
        'El pozo de Kiyomasa. En el jardín interior hay un manantial que, según la tradición, excavó el general Katō Kiyomasa.',
      ],
    },
    {
      nombre: 'Takeshita-dōri (竹下通り)',
      queEs: 'Calle peatonal frente a la estación de Harajuku, escaparate de la moda juvenil y de la cultura kawaii.',
      historia: 'Se volvió comercial a mediados de los setenta. En 1979 llegaron los Takenoko-zoku, grupos que bailaban con trajes llamativos en la calle cortada al tráfico, y Harajuku se convirtió en el foco de la cultura juvenil.',
      curiosidades: [
        'Bolardos retráctiles. Mientras la calle es peatonal, unos bolardos cortan el paso a los coches.',
        'Nadie te parará. Está prohibido captar clientes por la calle.',
        'La estación que ya no verás. La estación de Harajuku de 1924, de estilo inglés y la más antigua de madera de Tokio, se sustituyó en 2020 por no cumplir la normativa contra incendios.',
      ],
    },
    {
      nombre: 'Omotesandō (表参道)',
      queEs: 'Avenida de unos 36 m de ancho, flanqueada de zelkovas, que lleva al Meiji Jingū. Hoy es la calle de las tiendas de arquitectura de autor.',
      historia: 'Su nombre significa «camino principal de acceso» al santuario. Se trazó en 1919 y al año siguiente se plantaron las zelkovas. En el bombardeo de mayo de 1945 ardió por completo, y junto al cruce de Aoyama-dōri murieron muchas personas atrapadas por el fuego. En la posguerra, una base estadounidense cercana americanizó sus comercios.',
      significado: 'Nació como camino sagrado y se convirtió en el bulevar comercial más elegante de Tokio.',
      curiosidades: [
        'Los faroles marcados. En el cruce con Aoyama-dōri hay dos grandes faroles de piedra, recuerdo del camino sagrado. Sus bases desportilladas son marcas del bombardeo, y se dice que las manchas negras proceden de los cuerpos quemados aquel día.',
        'Un trozo de los años veinte. Omotesando Hills (2006) ocupa el solar de unos apartamentos levantados tras el terremoto de 1923. En un extremo, el Dōjunkan reproduce parte del bloque original.',
      ],
    },
  ],
  shibuya: [
    {
      nombre: 'Cruce de Shibuya (渋谷スクランブル交差点)',
      queEs: 'Cruce frente a la estación de Shibuya donde todos los semáforos de coches se ponen en rojo a la vez y los peatones cruzan en todas direcciones.',
      historia: 'Funciona así desde 1973, el mismo año en que abrió Shibuya PARCO, en plena expansión de los grandes almacenes del barrio.',
      significado: 'Es la imagen de la Tokio actual en el cine y la publicidad: una multitud que se cruza sin chocar.',
      curiosidades: [
        'Solo hay una diagonal. Aunque se imagina como una gran «X», tiene un único paso en diagonal, el que sale de la plaza de Hachikō. El cercano cruce frente a Shibuya 109 sí tiene la X completa.',
      ],
    },
    {
      nombre: 'Hachikō (忠犬ハチ公)',
      queEs: 'Estatua del perro akita Hachikō junto a la salida que lleva su nombre. Es el punto de encuentro más famoso de Japón.',
      historia: 'Hachikō nació en 1923 y era el perro de Ueno Hidesaburō, profesor de la Universidad Imperial de Tokio, que murió de repente en 1925. El perro se escapaba de las casas donde lo dejaron para volver a Shibuya, y acudió a la estación durante unos nueve años, hasta su muerte en 1935. La primera estatua se hizo en 1934, con Hachikō aún vivo. Se fundió durante la guerra, y la actual, obra del hijo del escultor, es de la posguerra.',
      significado: 'Encarna la lealtad y se convirtió en un símbolo amable de la ciudad.',
      curiosidades: [
        'El mito de los pinchos de yakitori. En la autopsia aparecieron cuatro brochetas de bambú en su estómago, pero no causaron su muerte. Murió de una filariosis grave, y en 2011 un nuevo examen halló además un cáncer extendido en pulmón y corazón.',
        'Sus órganos se pueden ver. El corazón, los pulmones, el hígado y el bazo se conservan en la Universidad de Tokio y se exponen en el museo de la Facultad de Agronomía.',
        'Reencuentro en bronce. En 2015, a los 80 años de su muerte, la facultad inauguró una estatua de Hachikō saltando de alegría hacia el profesor.',
      ],
    },
    {
      nombre: 'SHIBUYA SKY (渋谷スクランブルスクエア屋上展望施設)',
      queEs: 'Mirador en lo alto de la torre Shibuya Scramble Square, con una terraza al aire libre a unos 229 m de altura.',
      historia: 'Abrió el 1 de noviembre de 2019 junto con el rascacielos, de 47 plantas. Lo diseñaron tres estudios: Nikken Sekkei, Kengo Kuma y SANAA.',
      significado: 'Es el punto más alto de Shibuya y el símbolo de la gran remodelación de la estación, que lleva más de una década en obras.',
      curiosidades: [
        'SKY EDGE. La terraza está rodeada de vidrio, salvo en una esquina con el muro más bajo que mira directo al cruce. Es la foto que busca casi todo el mundo.',
        'Una brújula del mundo. En el punto más alto, la GEO COMPASS indica la dirección de lugares de todo el planeta. En el césped hay hamacas.',
        'No es el más alto de Tokio. La azotea de la torre Mori, en Roppongi, queda más alta sobre el nivel del mar.',
      ],
    },
  ],
  shinjuku: [
    {
      nombre: 'Omoide Yokochō (思い出横丁)',
      queEs: 'Callejón de pequeños bares de brochetas y casquería junto a la salida oeste de la estación de Shinjuku.',
      historia: 'Nació hacia 1946 como mercado negro sobre las ruinas de la guerra, y muchos de sus primeros tenderos eran soldados desmovilizados. Hacia 1953 los comerciantes se unieron y compraron el terreno, lo que evitó el derribo. En 1999 un incendio destruyó casi un tercio del callejón.',
      significado: 'Es uno de los pocos restos vivos de la Tokio de los mercados negros, en pleno Shinjuku de los rascacielos.',
      curiosidades: [
        'Por qué tanta casquería. La carne estaba racionada, pero las vísceras no. Hacia 1947 un tendero con contactos en un matadero empezó a vender brochetas de casquería de cerdo como «yakitori», y los demás le imitaron.',
        'Fíjate en los pilares. Tras el incendio, los locales del pasillo central no podían reconstruirse desde cero, así que se rehicieron conservando sus pilares.',
        'Un futuro incierto. Los edificios de madera envejecen y la propiedad está muy repartida. En 2020, el 70% de los propietarios decía que no seguiría si el callejón se convirtiera en un edificio.',
      ],
    },
    {
      nombre: 'Golden Gai (新宿ゴールデン街)',
      queEs: 'Unos 280 bares diminutos, de 10 a 15 m², en siete callejuelas de casas de posguerra junto a Kabukichō.',
      historia: 'Tras 1945, las fuerzas de ocupación trasladaron aquí un mercado negro de la salida este de Shinjuku. La zona fue un barrio de prostitución no autorizada hasta 1958, cuando entró en vigor la ley que la prohibía y los locales se convirtieron en bares. Hacia 1970 reunía a escritores, poetas, gente del teatro y periodistas. Decayó con la especulación de los ochenta, y una nueva generación de dueños lo ha revitalizado.',
      significado: 'Conserva casi intacto el trazado de posguerra y la memoria de la bohemia literaria y teatral de Shinjuku.',
      curiosidades: [
        'Mira los pisos de arriba. Cuando era barrio de prostitución, las mujeres trabajaban en la segunda y la tercera planta. Hoy muchos bares ocupan esas plantas, a las que se sube por escaleras muy empinadas.',
        'Una cita de época. El escritor Tanaka Komimasa, asiduo, escribió en 1978 que era «un lugar especial incluso en Shinjuku, donde no viene a beber el asalariado corriente».',
        'Una frontera invisible. Dos asociaciones distintas se reparten el norte y el sur, y los nombres de las calles del sur (Hanazono 1-ban-gai, 3-ban-gai…) lo delatan.',
      ],
    },
    {
      nombre: 'Kabukichō (歌舞伎町)',
      queEs: 'El gran barrio de ocio nocturno al norte de la estación de Shinjuku: cines, karaoke, bares y host clubs.',
      historia: 'La zona quedó arrasada en los bombardeos. El 19 de agosto de 1945, cuatro días después de la rendición, el presidente vecinal Suzuki Kihei empezó a planear su reconstrucción alrededor de un gran teatro de kabuki. El barrio adoptó el nombre de Kabukichō en 1948, pero las restricciones de posguerra hicieron fracasar el teatro y solo se llegó a construir un cine.',
      significado: 'Es una reconstrucción impulsada por los vecinos y no por el Estado, y su identidad nocturna nació de un proyecto cultural frustrado.',
      curiosidades: [
        'El barrio del kabuki, sin kabuki. Su nombre recuerda un teatro que jamás se construyó.',
        'Mira hacia arriba: Godzilla. En la terraza de la octava planta del Shinjuku Tōhō Building (2015) asoma una cabeza de Godzilla de unos 12 m, a unos 52 m del suelo. Se ve desde la avenida central del barrio.',
      ],
    },
  ],
  tsukiji: [
    {
      nombre: 'Mercado exterior de Tsukiji (築地場外市場)',
      queEs: 'Barrio de cientos de tiendas y restaurantes de pescado, algas, utensilios y cuchillos que creció junto al antiguo mercado mayorista. Sigue activo aunque el mercado interior se fue a Toyosu en 2018.',
      historia: 'Tsukiji significa «tierra construida»: tras el Gran Incendio de Meireki (1657), la desembocadura del Sumida se rellenó para levantar residencias de samuráis. El mercado central abrió en 1935, cuando el de pescado de Nihonbashi se trasladó aquí tras el terremoto de 1923. Durante buena parte del siglo XX fue el mayor centro de distribución de pescado del mundo.',
      significado: 'Es la despensa de los restaurantes de Tokio y el lugar donde se ve la cultura profesional del pescado y del cuchillo.',
      curiosidades: [
        'Un mercado sobre un cementerio. Tras el terremoto de 1923, muchas tumbas del cementerio del Hongwanji se trasladaron y en esos solares se instalaron comerciantes de pescado. Así nació el mercado exterior, y se decía que comerciar sobre un antiguo cementerio traía prosperidad.',
        'El santuario de las olas. Cuenta la tradición que las obras de relleno sufrían el embate del mar hasta que se rescató del agua una imagen sagrada y se le dio culto; entonces el mar se calmó. Es el Namiyoke Inari (1659), protector del barrio.',
      ],
    },
    {
      nombre: 'Tsukiji Hongwanji (築地本願寺)',
      queEs: 'Templo budista de la escuela Jōdo Shinshū, filial del Nishi Hongwanji de Kioto, con un exterior que evoca la arquitectura de la antigua India.',
      historia: 'Se fundó en 1617 cerca de Nihonbashi, ardió en el Gran Incendio de Meireki (1657) y se reconstruyó aquí, sobre terreno ganado al mar. El terremoto de 1923 destruyó el edificio anterior. El actual (1934), de hormigón para resistir terremotos e incendios, es obra del arquitecto Itō Chūta, por encargo de un abad que había enviado expediciones a la Ruta de la Seda.',
      significado: 'Reivindica los orígenes indios del budismo y fue un templo muy moderno para su época, con bancos, vidrieras, lámparas de araña y calefacción.',
      curiosidades: [
        'Caza de animales. Hay 13 especies de animales esculpidas y escondidas por el recinto: leones alados, elefante, pavo real, mono… Itō Chūta adoraba las criaturas.',
        'Un órgano en un templo budista. La sala principal tiene un órgano de tubos que suena en ceremonias, bodas y en conciertos a la hora de comer el último viernes de cada mes.',
        'Aquí no hay goshuin. Por su doctrina, el templo no ofrece omikuji, goshuin ni amuletos. Su café es famoso por el «desayuno de 18 platillos».',
      ],
    },
  ],
  ueno: [
    {
      nombre: 'Museo Nacional de Tokio (東京国立博物館)',
      queEs: 'El museo más antiguo de Japón, con unos 120.000 objetos y 89 Tesoros Nacionales, más que ningún otro museo del país.',
      historia: 'Nació en 1872 con una exposición en el templo confuciano Yushima Seidō y se trasladó al parque de Ueno en 1882. Su primer edificio allí quedó inservible tras el terremoto de 1923. El edificio principal actual, de Watanabe Jin, se terminó en 1937 con un «estilo oriental de base japonesa».',
      significado: 'Nació para proteger el patrimonio frente a la modernización Meiji y hoy es el mejor resumen del arte japonés bajo un mismo techo.',
      curiosidades: [
        'Un arquitecto, dos iconos. Watanabe Jin diseñó también la torre del reloj de Wakō, en Ginza, que también está en la ruta del viaje.',
        'El museo dentro del museo. El Hyōkeikan (1909) se levantó para celebrar la boda del futuro emperador Taishō, y el propio edificio es Bien Cultural Importante.',
        'Tesoros que rotan. Los Tesoros Nacionales se exponen poco tiempo para protegerlos: merece la pena mirar qué piezas habrá en mayo de 2027.',
      ],
    },
    {
      nombre: 'Parque de Ueno (上野恩賜公園)',
      queEs: 'Parque en la colina de Ueno, antiguo recinto del templo Kan\'ei-ji, con museos, zoo, templos y unos 800 cerezos.',
      historia: 'El monje Tenkai fundó el Kan\'ei-ji en 1625 al nordeste del castillo de Edo, la dirección nefasta, para proteger al shogunato. En la batalla de Ueno de 1868 ardió casi todo. El Gobierno quería poner allí un hospital, pero el médico holandés Bauduin propuso un parque, y en 1873 Ueno fue uno de los primeros parques públicos de Japón. En 1924 la Casa Imperial lo cedió a Tokio; de ahí su nombre oficial, «regalo imperial».',
      significado: 'Pasó de ser el templo protector de los Tokugawa a convertirse en el gran parque cultural del Japón moderno.',
      curiosidades: [
        'La viuda decepcionada. La estatua de Saigō Takamori con su perro se inauguró en 1898. Se cuenta que su viuda, al verla, exclamó: «¡Mi marido no era así!».',
        'Un Kioto en miniatura. Tenkai copió en Edo la geografía sagrada de Kioto: el Kiyomizu Kannon-dō imita al Kiyomizu-dera. Delante está el «pino de la luna», con una rama en círculo que pintó Hiroshige; asómate y verás el Benten-dō enmarcado.',
        'Sin flor en mayo. Cuenta la tradición que Tenkai trajo cerezos de Yoshino. Hoy hay unos 800, pero a principios de mayo ya no tienen flor.',
      ],
    },
    {
      nombre: 'Estanque Shinobazu y Benten-dō (不忍池・弁天堂)',
      queEs: 'Gran estanque al pie de la colina de Ueno, con una isla donde se alza el Benten-dō, dedicado a la diosa Benzaiten.',
      historia: 'Tenkai vio en el estanque un pequeño lago Biwa y levantó en él una isla a imagen de la de Chikubu, con su salón para Benzaiten. El edificio actual es de 1958, porque el anterior se perdió en los bombardeos. En Meiji hubo dos intentos de desecar el estanque para hacer arrozales, y los dos fracasaron.',
      significado: 'Completa el «Kioto de Edo» de Tenkai. Benzaiten, la única diosa entre los Siete Dioses de la Fortuna, protege la música, la elocuencia y la riqueza.',
      curiosidades: [
        'La diosa de ocho brazos. La imagen principal es una Benzaiten de ocho brazos que solo se muestra un día al año, en el festival de septiembre.',
        'En mayo, lotos sin flor. Los lotos del estanque florecen en pleno verano; en mayo solo se verán las hojas.',
      ],
    },
  ],
  yanaka: [
    {
      nombre: 'Yanaka Ginza (谷中銀座)',
      queEs: 'Calle comercial de barrio de unos 170 m con unas 60 tiendas, casi todas pequeños negocios familiares.',
      historia: 'La calle surgió de forma espontánea hacia 1945. En las últimas décadas, la zona de Yanaka, Nezu y Sendagi («Yanesen») se puso de moda para pasear por el Tokio popular. Los comerciantes han ido renovando la calle con fachadas cuidadas, toldos uniformes y, desde 2008, gatos de madera tallada.',
      significado: 'Es un shōtengai de los de antes, con carnicería, pescadería y verdulería, y sus comerciantes lo defienden como una cultura que hay que conservar.',
      curiosidades: [
        'Busca los gatos. Hay gatos de madera tallada sobre las tiendas: Yanaka es barrio de gatos.',
        'El atardecer. La escalera Yūyake Dandan («escalones del atardecer»), en la entrada desde Nippori, es famosa por sus puestas de sol sobre la calle.',
        'Más gente que nunca. En 2018 pasaban unas 10.000 personas un día laborable y unas 14.000 en fin de semana, frente a unas 8.000 en 1991.',
      ],
    },
    {
      nombre: 'Cementerio de Yanaka (谷中霊園)',
      queEs: 'Cementerio de unas 10 ha entre los templos de Yanaka, con una avenida central de cerezos.',
      historia: 'Abrió en 1874 como cementerio público, sobre terrenos confiscados al templo Tennō-ji tras la separación oficial entre sintoísmo y budismo. Forma un solo espacio con los cementerios de los templos vecinos.',
      significado: 'Es un panteón de la era Meiji: aquí descansan el último shōgun, Tokugawa Yoshinobu, y Shibusawa Eiichi, «padre del capitalismo japonés» y cara del billete de 10.000 yenes desde 2024.',
      curiosidades: [
        'La pagoda que ya no está. En la avenida central quedan los cimientos de la pagoda de cinco pisos que inspiró la novela Gojū-no-tō de Kōda Rohan. Ardió en 1957 en un incendio provocado ligado a un doble suicidio.',
        'Floristerías que son casas de té. Cuenta la tradición local que la avenida central era el camino del templo, lleno de casas de té cuando sus loterías atraían multitudes. Por eso las floristerías de la entrada aún se llaman «o-chaya».',
      ],
    },
    {
      nombre: 'Tennō-ji (天王寺)',
      queEs: 'Templo budista de la escuela Tendai junto al cementerio de Yanaka, con un gran Buda de bronce al aire libre.',
      historia: 'Su origen se remonta a 1274, cuando un discípulo de Nichiren abrió el templo, entonces llamado Kannō-ji. Pertenecía a una corriente de la escuela Nichiren perseguida por el shogunato, y en 1698–1699 fue convertido a la fuerza al budismo Tendai. Recibió su nombre actual en 1833.',
      significado: 'Su historia resume cómo el poder Tokugawa controlaba las escuelas budistas. Sus loterías lo convirtieron además en uno de los grandes centros de ocio de Edo.',
      curiosidades: [
        'Una de las «tres loterías de Edo». Desde 1700 el templo celebró loterías autorizadas por el shogunato, que junto a las de Meguro y Yushima Tenjin eran las más famosas de la ciudad. Se prohibieron en 1842.',
        'Uno de los Siete Dioses. En el circuito de los Siete Dioses de la Fortuna de Yanaka, este templo representa a Bishamonten.',
      ],
    },
    {
      nombre: 'Nezu Jinja (根津神社)',
      queEs: 'Santuario sintoísta de Bunkyō, uno de los «Diez Santuarios de Tokio». Sus siete edificios de 1706 se conservan completos y son Bienes Culturales Importantes.',
      historia: 'Según la leyenda, lo fundó hace más de 1.900 años el héroe Yamato Takeru. Su sitio actual era la residencia donde nació el sexto shōgun, Ienobu. Cuando el shōgun Tsunayoshi lo adoptó como heredero, donó el terreno al santuario y mandó levantar el conjunto actual, terminado en 1706. Su festival llegó a considerarse un «festival bajo el cielo», como el de Kanda.',
      significado: 'Es uno de los conjuntos de Edo más completos de Tokio: sobrevivió a terremotos e incendios, y los daños de la guerra se repararon.',
      curiosidades: [
        'Esvásticas que sobrevivieron a Meiji. Fíjate en el 卍 (manji) de los edificios, emblema del santuario cuando budismo y sintoísmo convivían. Tras su separación en Meiji se quitaron los símbolos budistas, pero aquí se respetaron por el valor de los edificios.',
        'La piedra de los escritores. Busca la piedra donde se sentaban a descansar Natsume Sōseki y Mori Ōgai, vecinos del barrio.',
        'Una cerca con cimientos de 8 m. La cerca calada mide 200 m y no se ha deformado en 300 años: un estudio reciente descubrió que sus cimientos llegan a 8 m de profundidad.',
      ],
    },
  ],
  'takaragawa-onsen': [
    {
      nombre: 'Takaragawa Onsen, Ōsenkaku (宝川温泉 汪泉閣)',
      queEs: 'Ryokan aislado en Minakami (Gunma), el único alojamiento del manantial, con cuatro grandes baños al aire libre a ambas orillas del río Takaragawa. Tres de ellos son mixtos.',
      historia: 'Nadie sabe cuándo empezó a usarse el manantial, aunque en los alrededores han aparecido restos jōmon. El ryokan se fundó en 1923, cuando solo se llegaba a pie o en las vagonetas madereras. Las obras de presas de los años cincuenta trajeron carreteras y electricidad, y en 1955 se terminó el edificio principal actual. Los baños se alimentan de cuatro pozos propios, sin recircular ni añadir agua.',
      significado: 'Es uno de los «manantiales escondidos» (hitō) más conocidos de Kantō y un buen ejemplo del baño mixto al aire libre, una tradición hoy en retroceso.',
      curiosidades: [
        'El baño del halcón blanco. Cuenta la leyenda que el príncipe Yamato Takeru, enfermo durante su campaña hacia el este, vio alzar el vuelo a un halcón blanco desde el valle. Al bajar encontró el agua caliente, se bañó y sanó.',
        'Un río con tesoro. Takaragawa significa «río del tesoro»: en sus orillas se extrajo cobre hasta la primera mitad del siglo XX.',
        'El santuario sobre el baño. Encima del Kodakara-no-yu, el baño mixto más grande (unos 200 tatami), hay un pequeño santuario ligado a la leyenda. Este baño salió en la película Thermae Romae II (2014).',
      ],
    },
  ],
  'higashi-chaya': [
    {
      nombre: 'Higashi Chaya-gai (ひがし茶屋街) y el pan de oro de Kanazawa (金沢箔)',
      queEs: 'Barrio de casas de té (ochaya) de geiko en la orilla este del río Asano. Es también el escaparate del pan de oro de Kanazawa.',
      historia: 'En 1820 el dominio de Kaga reunió las casas de té dispersas por la ciudad en dos barrios oficiales: el del este (higashi) y el del oeste (nishi). En 2001 el Estado lo declaró distrito de preservación. Junto con Gion, en Kioto, es el lugar donde mejor se conserva la arquitectura de casas de té de finales del Edo y principios de Meiji.',
      significado: 'Las ochaya eran locales de banquete con espectáculo de geiko, no cafeterías. Se reconocen por la celosía saliente de la planta baja y una planta alta dedicada por entero a los salones.',
      curiosidades: [
        'Shima, una ochaya de 1820. Se puede visitar y es Bien Cultural Importante. Fíjate en que la planta alta no tiene armarios ni tabiques fijos: era solo para banquetes, nunca para vivir.',
        'Kaikarō, la mayor casa de té de Kanazawa. De día se visita. De noche sigue funcionando con dos reglas: nada de clientes sin presentación y un solo grupo a la vez.',
        'Un oficio que sobrevivió a escondidas. Prácticamente todo el pan de oro de Japón se hace en Kanazawa. A finales del s. XVII el shogunato reservó su fabricación a Edo, pero los artesanos de aquí siguieron con el pan de latón y «re-batiendo» láminas compradas fuera. Con Meiji cayeron los controles y Kanazawa se quedó con el mercado.',
        'Una diezmilésima de milímetro. El pan de oro tradicional se bate sobre papel japonés hasta ese grosor. La técnica es Patrimonio Inmaterial de la UNESCO desde 2020 y se usa para restaurar Tesoros Nacionales.',
      ],
    },
  ],
  kenrokuen: [
    {
      nombre: 'Kenroku-en (兼六園)',
      queEs: 'Jardín de paseo de los señores Maeda, junto al castillo, creado a lo largo de unos dos siglos. Es uno de los tres grandes jardines de Japón.',
      historia: 'Empezó en 1676 como el jardín de una villa del 5.º señor, Maeda Tsunanori. En 1822 el 12.º señor construyó allí su palacio de retiro y el jardín recibió el nombre de Kenroku-en. Su hijo derribó el palacio y amplió el jardín hasta darle la forma actual. Se abrió por completo al público en 1874.',
      significado: 'El nombre sale de un clásico chino según el cual ningún jardín puede reunir seis excelencias, porque se excluyen por parejas: amplitud y recogimiento, artificio y pátina antigua, agua abundante y vistas lejanas. Kenroku-en significa «el jardín que reúne los seis».',
      curiosidades: [
        'Una linterna con forma de instrumento. La Kotoji-tōrō, símbolo del jardín, tiene dos patas abiertas como los puentecillos que sostienen las cuerdas del koto. Una pata es más corta y descansa sobre una piedra.',
        'La fuente más antigua de Japón, sin bombas. Es de principios de la década de 1860 y funciona solo por la diferencia de nivel con el estanque que la alimenta. El chorro alcanza unos 3,5 m.',
        'El pino de las 800 cuerdas. En invierno, el pino Karasaki se protege de la nieve con cinco mástiles y unas 800 cuerdas (yukitsuri). En mayo no las verás, pero el pino, plantado con semillas traídas del lago Biwa, sigue siendo el de ramaje más espectacular.',
        'Lirios en mayo. Los lirios y las azaleas junto al arroyo sinuoso, vistos desde el puente Hanami-bashi, son de las mejores vistas del jardín.',
      ],
    },
  ],
  'kanazawa-castillo': [
    {
      nombre: 'Castillo de Kanazawa (金沢城)',
      queEs: 'Antigua sede de los Maeda, señores de Kaga, durante 14 generaciones. Hoy es un parque con la puerta Ishikawa-mon original y torres reconstruidas en madera con técnicas tradicionales.',
      historia: 'Antes de ser castillo fue un templo-fortaleza budista fundado en 1546. Maeda Toshiie se instaló en él en 1583. La torre principal ardió por un rayo en 1602 y nunca se reconstruyó, y varios grandes incendios destruyeron después palacios y torres. Tras servir de cuartel y de campus universitario, en 2001 se terminaron varias torres y almacenes nuevos: el mayor conjunto de arquitectura castral de madera levantado en Japón desde Meiji.',
      significado: 'Fue el centro de poder del dominio más rico del Japón Edo, sin contar el propio shogunato.',
      curiosidades: [
        'Tejados que parecen nevados. Las tejas son de madera forrada con planchas de plomo de 2 a 3 mm. Con la lluvia, el plomo se vuelve blanco plateado y, de lejos, los tejados parecen cubiertos de nieve.',
        'Muros como cohombros de mar. El zócalo de los muros namako lleva tejas planas con juntas de cal en relieve, que recuerdan el lomo de un cohombro de mar (namako).',
        'Ishikawa-mon, la puerta trasera que sobrevivió. Es de 1788 y encierra un patio cuadrado donde el enemigo quedaba expuesto por tres lados. El mirador con frontón curvo es en realidad una abertura para lanzar piedras.',
      ],
    },
  ],
  nagamachi: [
    {
      nombre: 'Nagamachi (長町武家屋敷跡) y Casa Nomura (野村家)',
      queEs: 'Antiguo barrio de samuráis de rango medio, con muros de barro y canales. La Casa Nomura es la residencia del barrio abierta al público.',
      historia: 'Los Nomura llegaron a Kanazawa en 1583 como vasallos de Maeda Toshiie. Durante once generaciones ocuparon cargos de mando, hasta la abolición de los dominios en 1871. Con el fin de los samuráis la finca se redujo. Hoy combina partes de la residencia original, como el muro y el jardín, con salones traídos de la casa de un rico armador.',
      significado: 'Muestra cómo vivía la clase media samurái de Kaga y cómo la riqueza pasó después a los comerciantes: los salones más lujosos de esta casa samurái los pagó un mercader.',
      curiosidades: [
        'El salón del señor. El jōdan-no-ma, donde se recibía al señor, es todo de ciprés hinoki con artesonado y marquetería de palisandro y ébano. Los clavos se esconden tras cubrejuntas calados.',
        'Madera de mil años. El salón de té del piso superior tiene en el techo una tabla de «cedro de la era de los dioses», madera que ha pasado siglos enterrada. La antesala tiene un suelo de una sola tabla de arce de unos mil años.',
        'Agua de un canal de 400 años. El jardín se alimenta del canal Ōnoshō, el más antiguo de Kanazawa.',
      ],
    },
  ],
  omicho: [
    {
      nombre: 'Mercado Ōmichō (近江町市場)',
      queEs: 'Mercado cubierto de alimentación en el centro de Kanazawa, con unas 170 tiendas en callejones estrechos. Los vecinos lo llaman cariñosamente «Omichō».',
      historia: 'En 1721 el dominio de Kaga reunió aquí, cerca del castillo, los mercados que se montaban a orillas de los ríos. Durante el Edo abasteció al dominio, y en 2021 celebró sus 300 años.',
      significado: 'Sigue siendo el mercado de los vecinos, además de un atractivo turístico, y la puerta de entrada en la ciudad del pescado y el marisco del mar de Japón.',
      curiosidades: [
        'El barrio es anterior al mercado. Ōmichō ya aparece en planos de Kanazawa de hacia 1670 como uno de los barrios más antiguos de la ciudad castillo. El mercado tomó el nombre del barrio, no al revés.',
      ],
    },
  ],
  'nishi-chaya': [
    {
      nombre: 'Nishi Chaya-gai (にし茶屋街) y Teramachi (寺町寺院群)',
      queEs: 'Pequeño barrio de casas de té en la orilla oeste del río Sai y, al lado, la colina de Teramachi, llena de templos. Un paseo tranquilo.',
      historia: 'Nishi («oeste») nació en 1820, el mismo año que Higashi. Teramachi se formó en el s. XVII, al reagrupar los templos de la ciudad tras varios grandes incendios. En 2012 se protegió como distrito de preservación, con 52 templos a lo largo de antiguos caminos.',
      significado: 'Con esa declaración, Ishikawa superó a Kioto como la prefectura con más distritos de preservación.',
      curiosidades: [
        'El escritor que creció en una casa de té. El pequeño museo de Nishi Chaya ocupa el solar donde pasó su infancia el novelista Shimada Seijirō, autor de un superventas de 1919 que murió a los 31 años.',
        'Myōryū-ji, el «templo ninja». Fundado en 1643, por fuera parece de dos plantas, pero dentro tiene cuatro pisos y siete niveles, con 29 escaleras, algunas ocultas, y trampillas. No tiene nada que ver con ninjas reales: el apodo es moderno.',
        'Muros en línea recta. Fíjate en los muros de barro de los templos del antiguo camino de Noda, que lleva al cementerio de los Maeda.',
      ],
    },
  ],
  'sanmachi-suji': [
    {
      nombre: 'Sanmachi Suji (三町筋)',
      queEs: 'Las tres calles paralelas de comerciantes del casco antiguo de Takayama, con casas de madera de aleros bajos y destilerías de sake en activo.',
      historia: 'Desde finales del s. XVII Hida fue territorio directo del shogunato. Las tres calles nacieron como primera, segunda y tercera calle del barrio de mercaderes. Un gran incendio las arrasó en 1832 y se reconstruyeron con el estilo tradicional: lo que ves no es intacto, como a veces se dice. Son distrito de preservación desde 1979.',
      significado: 'La conservación la impulsaron los propios vecinos, organizados en torno a los grupos de carroza del festival.',
      curiosidades: [
        'Una bola de cedro que marca la edad del sake. El sugidama de las destilerías se cuelga verde cuando sale el sake nuevo, en invierno, y va pardeando a medida que el sake madura. En mayo la verás ya algo descolorida.',
        'Aleros con blanco de concha. Las ménsulas que sostienen los aleros están pintadas con gofun, un blanco de concha molida.',
      ],
    },
  ],
  'miyagawa-asaichi': [
    {
      nombre: 'Mercado matutino de Miyagawa (宮川朝市)',
      queEs: 'Mercado diario de mañana a orillas del río Miyagawa, con verduras, encurtidos, flores y artesanía local.',
      historia: 'Su origen es un mercado de hojas de morera para los gusanos de seda que hacia 1819 se celebraba frente a un templo de Takayama. A finales del s. XIX pasó a vender verduras de cosecha propia. La guerra lo paralizó, y el 1 de mayo de 1960 se instaló junto al río, en un terreno sin pavimentar donde los propios comerciantes levantaron sus puestos.',
      significado: 'Junto con el mercado frente a la Jinya, se cuenta entre los mercados matutinos más importantes de Japón.',
      curiosidades: [
        'Nació de los gusanos de seda. Hasta Meiji aquí se vendía sobre todo hoja de morera para la sericultura, la gran industria de Hida. Las verduras eran secundarias.',
        'Aniversario en mayo. El mercado se estrenó junto al río un 1 de mayo: en mayo de 2027 cumple 67 años en ese lugar.',
      ],
    },
  ],
  'takayama-jinya': [
    {
      nombre: 'Takayama Jinya (高山陣屋)',
      queEs: 'Antigua oficina del gobierno directo del shogunato en Hida. Es el único lugar de Japón donde se conservan los edificios principales de una de estas oficinas.',
      historia: 'En 1692 el shogunato trasladó a los señores locales y tomó Hida bajo su control directo, por sus bosques y minas. En 176 años se sucedieron aquí 25 gobernadores. Tras Meiji siguió siendo oficina pública hasta 1969, casi tres siglos de uso. En 1996, tras unos 26 años de obras, recuperó su aspecto Edo. De las más de 60 oficinas como esta que había, solo aquí se conservan los edificios.',
      significado: 'Es la mejor ventana a la administración local del Edo: ventanilla de peticiones, tribunal y almacén de impuestos en arroz.',
      curiosidades: [
        'El granero vino del castillo. El almacén de arroz se trasladó aquí en 1695 desde el castillo de Takayama y es uno de los graneros Edo más antiguos y grandes. Su tejado de tablas sin clavos se sujeta con piedras, y cada cinco años se les da la vuelta para alargar su vida.',
        'Busca los conejos. Los cubreclavos de los dinteles tienen forma de conejo visto de frente. Nadie sabe por qué se eligió el conejo.',
        'Dos patios de grava. Uno era la ventanilla donde los pueblos presentaban peticiones y quejas; el otro, el tribunal.',
      ],
    },
  ],
  'takayama-yatai': [
    {
      nombre: 'Sala de Exposición de Carrozas del Festival de Takayama (高山祭屋台会館) y Sakurayama Hachimangū (櫻山八幡宮)',
      queEs: 'Sakurayama Hachimangū es el santuario del festival de otoño de Takayama. En su recinto, la Sala de Exposición muestra carrozas auténticas del festival.',
      historia: 'El Festival de Takayama tiene dos ediciones: la de primavera (14–15 de abril) y la de otoño (9–10 de octubre). Ya se celebraba a mediados del s. XVII, y las carrozas aparecen documentadas desde 1718. En 2016 entró en el Patrimonio Inmaterial de la UNESCO junto con otros 32 festivales de carrozas de Japón.',
      significado: 'Las carrozas son obra de la tradición de los carpinteros de Hida (Hida no takumi). En la Antigüedad, Hida no pagaba ciertos tributos: a cambio, enviaba cada año unos 100 carpinteros a la capital, que trabajaron en templos como Tōdai-ji.',
      curiosidades: [
        'Carrozas de verdad. Se exponen cuatro de las 11 carrozas de otoño, que rotan tres veces al año. Son las originales, no réplicas.',
        'Marionetas acróbatas. Solo 4 de las 23 carrozas tienen marionetas mecánicas (karakuri). En la de Hotei, dos niños-marioneta cruzan unas barras dando volteretas y aterrizan sobre los hombros del dios. Desde dentro los mueven equipos que tiran de decenas de cuerdas.',
      ],
    },
  ],
  'shirakawago-ogimachi': [
    {
      nombre: 'Shirakawa-gō, aldea de Ogimachi (白川郷 荻町)',
      queEs: 'Aldea de montaña en el valle del río Shō con el mayor conjunto de casas de tejado de paja gasshō-zukuri. Es Patrimonio Mundial desde 1995.',
      historia: 'Las casas gasshō se desarrollaron desde mediados del Edo, con el auge de la seda y del salitre. Hacia 1971 quedaba la mitad, y los vecinos crearon por unanimidad una asociación con tres principios: no vender, no alquilar, no derribar. En 1976 la aldea se declaró distrito de preservación y en 1995 entró en el Patrimonio Mundial.',
      significado: 'Los tejados, de unos 60° de pendiente, hacen resbalar la nieve, y los desvanes de varios pisos servían para criar gusanos de seda.',
      curiosidades: [
        'Pólvora bajo el suelo. Junto al hogar se excavaba un foso donde fermentaban durante unos cinco años paja, tierra, artemisa y excrementos de gusano de seda. De esa tierra salía el salitre para la pólvora, y el gran comprador era el dominio de Kaga. La industria murió en Meiji con la llegada del nitrato de Chile; la casa Wada, que prosperó con este comercio, lo explica.',
        'Ayuda mutua con contabilidad. El yui no era caridad: lo que cada familia aportaba en un retechado se anotaba en un libro para devolverlo con exactitud. En una casa grande trabajan a la vez de 100 a 200 personas sobre el tejado, en un solo día.',
        'Hoy el yui es la excepción. En 2023 los vecinos hicieron un retechado comunitario por primera vez en cinco años.',
      ],
    },
  ],
  'hida-no-sato': [
    {
      nombre: 'Hida no Sato (飛騨の里)',
      queEs: 'Museo al aire libre de Takayama con unas treinta casas rurales de la región de Hida, trasladadas y reconstruidas alrededor de un estanque.',
      historia: 'Reúne casas de labradores de los periodos Edo y Meiji con tejado de paja, casas gasshō y graneros de tablones. Cuatro son Bien Cultural Importante, como la casa Wakayama, que no procede de Shirakawa-gō sino de la antigua aldea de Shōkawa.',
      significado: 'Complementa Shirakawa-gō: allí se ve el paisaje vivo, con casas habitadas; aquí se recorren los interiores completos y se comparan los tipos de casa de Hida.',
      curiosidades: [
        'Compara los tejados. Junto a los de paja hay tejados de tablas sujetas con piedras, la misma técnica del granero de la Takayama Jinya. Era el tejado de las zonas con mucha madera.',
      ],
    },
  ],
  'kiyomizu-dera': [
    {
      nombre: 'Kiyomizu-dera (清水寺)',
      queEs: 'Templo budista en la ladera del monte Otowa, dedicado a Kannon de once cabezas y mil brazos. Su sala principal se asoma al vacío con el famoso «escenario» de madera.',
      historia: 'Cuenta la tradición que en 778 el monje Kenshin encontró aquí una cascada de agua pura. Dos años después, el general Sakanoue no Tamuramaro, que había venido a cazar ciervos, le ayudó a levantar el templo y lo llamó Kiyomizu, «agua pura». Ha ardido más de diez veces: casi todo lo que se ve es de los años 1630, y la sala principal y su escenario son de 1633. Entre 2008 y 2020 se renovaron la cubierta y el suelo del escenario.',
      significado: 'Es uno de los grandes centros de peregrinación a Kannon, abierto al pueblo llano desde la época Heian, y su escenario se convirtió en sinónimo de «lugar alto» en todo Japón.',
      curiosidades: [
        'Sin un solo clavo. El escenario, de unos 13 m de altura (como un edificio de cuatro plantas), se apoya en 18 pilares de olmo japonés de más de 400 años, unidos con ensambles de carpintería. Fíjate en la retícula de madera desde el camino de bajada a la cascada.',
        'Saltar desde el escenario. El refrán «saltar desde el escenario de Kiyomizu» significa lanzarse a una decisión arriesgada. Nació de una práctica real: en el Edo había quien saltaba convencido de que, si salía ileso, Kannon le concedería su deseo. En 1834 un joven cayó unos 12 m sin un rasguño.',
        'No es un mirador. El escenario es una plataforma para ofrecer música y danza a Kannon: el sitio «correcto» es de espaldas a la vista, mirando al santuario.',
        'Los tres caños de Otowa. Que cada caño dé una cosa distinta (longevidad, amor, estudios) es una creencia popular: el agua se bebe para purificarse y pedir deseos. Y desde 2000 el templo cultiva olmos para poder cambiar los pilares dentro de unos siglos.',
      ],
    },
  ],
  'higashiyama-sannenzaka': [
    {
      nombre: 'Sannenzaka y Ninenzaka (産寧坂・二寧坂)',
      queEs: 'Dos cuestas empedradas y escalonadas que bajan de Kiyomizu-dera hacia Yasaka, con casas de madera de finales del Edo a principios del s. XX. Es el Kioto de postal a pie de calle.',
      historia: 'El caserío creció a mediados del s. XVII en el camino de los peregrinos que subían a Kiyomizu. En 1976 fue una de las primeras zonas de Japón declaradas distrito de preservación, el mismo día que Gion Shinbashi y Shirakawa-gō.',
      curiosidades: [
        'Un nombre misterioso ya en 1762. Una guía de entonces daba dos explicaciones: que la cuesta se abrió en el año 808 («la cuesta del año tres») o que llevaba a una pagoda de los partos felices («la cuesta del parto sereno»). Y añadía que ninguna tenía fundamento.',
        'Ninenzaka, la de antes. Su nombre significa simplemente «la cuesta de antes de Sannenzaka».',
        'La maldición y su antídoto. Se dice que quien se cae en Sannenzaka muere en tres años. Al pie de la cuesta, la tienda Hyōtan-ya, de 1837, vende calabazas que, según la tradición, vuelven a encerrar el alma que se escapa con la caída.',
        'Adoquines del tranvía. Las losas de Ichinenzaka y Ninenzaka son adoquines reutilizados del antiguo tranvía de Kioto.',
      ],
    },
    {
      nombre: 'Kōdai-ji (高台寺)',
      queEs: 'Templo zen fundado por Nene, la viuda de Toyotomi Hideyoshi, para rezar por él. Está entre Ninenzaka y Maruyama, sobre la calle que lleva su nombre.',
      historia: 'Hideyoshi murió en 1598 y Nene fundó el templo en 1606. Tokugawa Ieyasu lo financió con generosidad, por cálculo político, y el conjunto llegó a ser espléndido. Nene murió en 1624, a los 76 años.',
      significado: 'Es el gran memorial de los Toyotomi en Kioto, y su laca dorada dio nombre a un estilo propio: el «maki-e de Kōdai-ji».',
      curiosidades: [
        'Nene, bajo su propia estatua. En el mausoleo se veneran figuras de Hideyoshi y de Nene, y la tumba de ella está justo debajo de su imagen. Fíjate en la laca negra con oro espolvoreado del altar.',
        'Un Kannon androide. Desde 2019 el templo tiene a Mindar, un androide de Kannon de 1,95 m creado con la Universidad de Osaka que predica el Sutra del Corazón. Costó unos 100 millones de yenes y no faltaron críticas por considerarlo irrespetuoso.',
        'Pabellones del castillo. Según la tradición, los pabellones de té Kasa-tei y Shigure-tei vienen del castillo de Fushimi de Hideyoshi.',
      ],
    },
  ],
  gion: [
    {
      nombre: 'Yasaka Jinja y Parque Maruyama (八坂神社・円山公園)',
      queEs: 'El santuario «Gion-san», al final de la calle Shijō, organizador del Gion Matsuri. Detrás está Maruyama, el parque público más antiguo de Kioto.',
      historia: 'Hay dos tradiciones sobre su fundación: una la sitúa en 656 y otra en 876. Su fama empezó en 877, cuando las plegarias aquí detuvieron una epidemia. El Gion Matsuri nace de un rito de 869 contra otra epidemia, con 66 alabardas, una por provincia. El santuario actual es de 1654 y es Tesoro Nacional desde 2020. El parque Maruyama se abrió en 1886.',
      significado: 'Es el santuario de barrio de Gion, y su festival de julio es el más famoso de Japón. En mayo no hay Gion Matsuri, pero su huella se ve todo el año.',
      curiosidades: [
        'Un dragón bajo el altar. Según la tradición, el santuario se alza sobre un estanque donde vive el Dragón Azul, guardián del este de Kioto. En 1070 intentaron sondearlo y no tocaron fondo a unos 150 m. Hoy está sellado.',
        'La puerta que se movió. La puerta oeste, de 1497, es el edificio más antiguo del santuario. En 1913, al ensanchar la calle Shijō, la desplazaron unos 6 m al este y 3 m al norte.',
        'Una piedra para buscar perdidos. Dentro del recinto, una piedra hacía de tablón de anuncios en Edo y Meiji para encontrar a niños y personas perdidas: en una cara se pegaba «busco» y en otra «sé dónde está».',
        'Descendientes de Somin Shōrai. Cuenta la leyenda que Susanoo prometió librar de la peste a quien descendiera de Somin Shōrai, que le dio cobijo. Por eso los amuletos dicen «descendiente de Somin Shōrai».',
      ],
    },
    {
      nombre: 'Gion y Hanami-kōji (祇園・花見小路)',
      queEs: 'El barrio de geishas más grande de Kioto, nacido como calle de casas de té ante Yasaka Jinja. Hanami-kōji es su eje, con ochaya a ambos lados.',
      historia: 'Desde el s. XVII prosperó como barrio de casas de té a las puertas del santuario, y en el XVIII se convirtió en el centro del ocio de Kioto. En 1872, para atraer visitantes a una ciudad hundida por la marcha de la corte a Tokio, se creó el espectáculo Miyako Odori. En 1881 el barrio se dividió en dos: Gion Kōbu y Gion Higashi.',
      significado: 'En Kioto se dice geiko, no geisha, y las aprendices son maiko. Tras 5 o 6 años, la maiko pasa a geiko y se especializa en danza o en música.',
      curiosidades: [
        'Solo con presentación. Las ochaya siguen la regla del ichigen-san okotowari: no atienden a quien viene por primera vez sin que lo presente un cliente de confianza.',
        'Farolillos con dango. Los farolillos de las ochaya de Gion Kōbu llevan el emblema del barrio: ocho bolitas de dango encadenadas.',
        'La casa de los 47 rōnin. En la esquina de Shijō con Hanami-kōji, la ochaya de muro rojo Ichiriki sale en el drama de los 47 rōnin: allí su líder finge llevar una vida disipada.',
        'Danza en mayo. Ese mes, el espectáculo de danza es el Kamogawa Odori de Ponto-chō.',
      ],
    },
  ],
  'higashiyama-norte': [
    {
      nombre: 'Nanzen-ji (南禅寺) y el acueducto Suirokaku (水路閣)',
      queEs: 'Gran templo zen al pie de las colinas orientales, con una enorme puerta Sanmon y, dentro del recinto, un acueducto de ladrillo de 1888 que todavía lleva agua del lago Biwa.',
      historia: 'En 1264 el emperador Kameyama se construyó aquí una villa, que en 1291 convirtió en templo zen. En 1386 el shōgun Ashikaga Yoshimitsu lo situó por encima de los Cinco Grandes Templos zen: el rango más alto del zen japonés. La Sanmon actual, de unos 22 m, es de 1628. Siglos después, Kioto excavó el canal del lago Biwa (1885–1890) para reactivarse tras la marcha de la corte a Tokio; lo dirigió un joven ingeniero, Tanabe Sakurō, sin técnicos extranjeros.',
      significado: 'El templo es la cumbre del zen medieval; el canal, el símbolo del Kioto moderno: trajo agua, transporte y la primera central hidroeléctrica de Japón (1891). Desde 2025 el Suirokaku es Tesoro Nacional.',
      curiosidades: [
        '«¡Qué vista, qué vista!». En una obra de kabuki, el ladrón Ishikawa Goemon contempla Kioto desde lo alto de esta puerta y suelta esa frase. Es pura ficción: Goemon fue ejecutado décadas antes de que se levantara la puerta actual.',
        'Un templo nacido de fantasmas. Cuenta una crónica que la villa de Kameyama estaba encantada y que nada funcionó hasta que llegó el maestro zen Mukan Fumon. El emperador se hizo su discípulo y convirtió la villa en templo.',
        'Un farol gigante. A la derecha de la Sanmon hay un farol de piedra de más de 6 m, de 1628, al que llaman «el mayor de Oriente».',
        'El acueducto sigue funcionando. Sube por la ladera junto al Suirokaku y verás correr el agua del canal por encima de los 14 arcos.',
      ],
    },
    {
      nombre: 'Camino del Filósofo (哲学の道)',
      queEs: 'Paseo peatonal junto a un ramal del canal del lago Biwa, entre el santuario Kumano Nyakuōji y Ginkaku-ji.',
      historia: 'Nació como sendero de servicio del canal. Al estar cerca de la Universidad Imperial de Kioto, desde Meiji la zona se llenó de académicos. Tuvo varios apodos hasta que en 1969, durante una campaña vecinal para conservar el canal, se fijó el de «Camino del Filósofo».',
      significado: 'Recuerda a la Escuela de Kioto: el filósofo Nishida Kitarō y sus discípulos paseaban por aquí mientras pensaban.',
      curiosidades: [
        'Los cerezos de un pintor. El pintor Hashimoto Kansetsu y su esposa, que vivían cerca, plantaron los primeros árboles hacia 1922. En mayo no habrá flor, pero sí un túnel verde sobre el agua.',
        'La misma agua que el Suirokaku. Este ramal se separa del canal principal en Keage: es el agua que cruza el acueducto de Nanzen-ji.',
        'Fiestas de un shōgun. En el extremo sur, el santuario Kumano Nyakuōji (1160) acogió las fiestas para ver los cerezos de Ashikaga Yoshimasa, el de Ginkaku-ji.',
      ],
    },
    {
      nombre: 'Ginkaku-ji / Jishō-ji (銀閣寺・慈照寺)',
      queEs: 'Antigua villa del shōgun Ashikaga Yoshimasa convertida en templo zen. Su pabellón de dos pisos es el famoso «Pabellón de Plata».',
      historia: 'Tras la devastadora guerra de Ōnin (1467–1477), Yoshimasa empezó en 1482 su villa de retiro sobre las ruinas de un templo. Se hizo monje en 1485 y murió en 1490 sin ver terminado el pabellón. Por su testamento, la villa se convirtió en templo zen. En 1550 la guerra lo destruyó todo salvo el pabellón y la capilla Tōgu-dō, hoy Tesoros Nacionales.',
      significado: 'Es el emblema de la «cultura Higashiyama», la estética sobria de la que salen la ceremonia del té, el arreglo floral y la arquitectura de la casa japonesa tradicional.',
      curiosidades: [
        '¿Por qué no es de plata? Nunca lo fue: el nombre se popularizó en Edo, por contraste con el Pabellón de Oro de su abuelo Yoshimitsu. En la restauración de 2007 no apareció ni rastro de plata. Junto a la tienda hay una maqueta con su aspecto lacado original.',
        'Los conos de arena son de Edo. El «mar de arena plateada» y el cono truncado Kōgetsudai se añadieron mucho después de Yoshimasa. Que sirvieran para reflejar la luz de la luna es solo una leyenda.',
        'La sala de cuatro tatamis y medio más famosa de Japón. En el Tōgu-dō, la sala Dōjinsai tiene el escritorio empotrado y los estantes escalonados más antiguos que se conservan: el origen del estilo shoin.',
        'El Daimonji. Cuenta la tradición del templo que, al morir su hijo en 1489, Yoshimasa mandó marcar el gran carácter 大 en el monte de detrás para despedir su alma: sería el origen del fuego Daimonji del 16 de agosto.',
      ],
    },
  ],
  arashiyama: [
    {
      nombre: 'Bosque de bambú de Sagano (嵯峨野竹林)',
      queEs: 'El sendero entre bambús que va del santuario Nonomiya, junto a la puerta norte de Tenryū-ji, hacia la villa Ōkōchi Sansō. Tiene unos 400 m.',
      historia: 'Sagano fue zona de villas y retiros de la corte desde Heian. Al final del sendero, el santuario Nonomiya ocupa uno de los lugares donde se purificaban las saiō, princesas imperiales elegidas para servir en el santuario de Ise en nombre del emperador. La institución desapareció en el siglo XIV con las guerras de la época.',
      significado: 'Aquí transcurre el capítulo «Sakaki» del Genji monogatari, cuando Genji visita a la dama Rokujō. Por eso Sagano es, en la literatura japonesa, tierra de despedidas y melancolía.',
      curiosidades: [
        'El torii más antiguo. El torii negro de Nonomiya está hecho con troncos de roble sin descortezar: es la forma más antigua de torii.',
        'El mito de Edison. Se suele decir que el filamento de las bombillas de Edison era bambú de Arashiyama. En realidad venía de los bosques de Yawata, al sur de Kioto.',
      ],
    },
    {
      nombre: 'Tenryū-ji (天龍寺)',
      queEs: 'Gran templo zen de Arashiyama. Su jardín con estanque, el Sōgen-chi, conserva el trazado del maestro Musō Soseki.',
      historia: 'Aquí estuvo la villa de los emperadores retirados Go-Saga y Kameyama. En 1339 el shōgun Ashikaga Takauji fundó el templo para rezar por el alma del emperador Go-Daigo, su antiguo aliado y luego enemigo. Sufrió ocho grandes incendios, el último en 1864, cuando el ejército de Chōshū acampó aquí. Casi todos los edificios actuales son de 1899–1935.',
      significado: 'Su jardín, que usa como fondo el paisaje de Arashiyama (shakkei, «paisaje prestado»), influyó en todo el jardín japonés posterior.',
      curiosidades: [
        'Un templo pagado con barcos. Las donaciones no bastaban, así que se reanudó el comercio con China y los beneficios se destinaron a la obra: fueron los «barcos de Tenryū-ji».',
        'La carpa que se vuelve dragón. Frente al estanque, dos piedras verticales forman la cascada del Dragón, inspirada en la leyenda china de la carpa que remonta la cascada y se convierte en dragón. La piedra-carpa no está al pie, como es habitual, sino a un lado del chorro, en plena transformación.',
        'Un dragón que te sigue con la mirada. En el techo del Hattō, Kayama Matazō pintó en 1997 un dragón de unos 9 m que parece mirarte desde cualquier punto.',
        'Una vista de 1346. El puente Togetsukyō ya era una de las «diez vistas» que Musō eligió para el templo.',
      ],
    },
    {
      nombre: 'Puente Togetsukyō (渡月橋)',
      queEs: 'El puente que cruza el río a los pies del monte Arashiyama, símbolo del barrio.',
      historia: 'Antes de Meiji las riadas se lo llevaban a menudo. Hacia 1887 se hizo uno de madera, y el actual es de 1934: de hormigón armado, pero con barandillas de madera para no romper el paisaje. El río era también la vía de los troncos que bajaban de Tanba: cientos de miles al año.',
      significado: 'Es la postal de Arashiyama desde que la corte Heian venía aquí a ver la luna, los cerezos y los arces.',
      curiosidades: [
        'Un nombre poético. Cuenta la tradición que un emperador retirado, al ver la luna sobre el puente, dijo que parecía «la luna que cruza». De ahí Togetsu.',
        'No mires atrás. Los niños de 13 años que van a recibir sabiduría al templo Hōrin-ji, en la orilla sur, no deben volverse a mirarlo hasta terminar de cruzar el puente, o la sabiduría «se devuelve».',
        'Madera solo por fuera. Las barandillas son lo único de madera; todo lo que las sostiene es hormigón de 1934.',
      ],
    },
  ],
  sanjusangendo: [
    {
      nombre: 'Sanjūsangen-dō / Rengeō-in (三十三間堂・蓮華王院)',
      queEs: 'Templo cuya sala principal, de unos 120 m de largo, alberga 1.001 estatuas de Kannon de mil brazos, todas Tesoro Nacional.',
      historia: 'El emperador retirado Go-Shirakawa lo construyó en 1164, con la financiación de Taira no Kiyomori. Ardió en 1249 y la sala actual es de 1266. La gran Kannon sentada del centro es obra del escultor Tankei. En 2018, al declararse Tesoro Nacional, volvieron las estatuas prestadas a museos y se reunieron por primera vez las 1.001.',
      significado: 'Es un monumento a la época de los emperadores retirados, que se presentaban como «reyes budistas». Su nombre oficial, Rengeō-in («templo del Rey Loto»), viene del Sutra del Loto.',
      curiosidades: [
        'Cuenta los vanos: salen 35, no 33. «Sanjūsangen» significa «33 espacios entre pilares», por las 33 formas que adopta Kannon para salvar a los seres. Por fuera se cuentan 35, porque la cifra oficial deja fuera el corredor exterior.',
        'El récord de tiro con arco de 1686. En Edo se disparaba a lo largo de la galería oeste, de unos 120 m, sin tocar el alero. En una prueba de 24 horas, el samurái Wasa Daihachirō acertó 8.133 flechas de 13.053, un récord nunca superado. Hoy pervive en un torneo de enero.',
        'Busca una cara. Detrás de las estatuas hay una pantalla táctil para encontrar el nombre y la cara de cada una de las 1.001.',
        'Un suelo pensado para durar. Las excavaciones de 2016–2017 revelaron un refuerzo del terreno con crestas de tierra para que el peso del tejado no hundiera el suelo. Mira también las tejas: algunas llevan el emblema de los Toyotomi.',
      ],
    },
  ],
  nijo: [
    {
      nombre: 'Castillo Nijō (二条城)',
      queEs: 'Castillo-palacio de los shōgun Tokugawa en Kioto. Su Palacio Ninomaru, Tesoro Nacional, es el mejor palacio samurái que se conserva.',
      historia: 'Ieyasu lo terminó en 1603 para proteger el Palacio Imperial y alojarse en Kioto. En 1626 se amplió a su tamaño actual para recibir al emperador Go-Mizunoo. Un rayo destruyó el torreón en 1750. En octubre de 1867, el último shōgun, Tokugawa Yoshinobu, reunió aquí a los consejeros de 40 dominios y al día siguiente devolvió el poder al emperador.',
      significado: 'Aquí empezó y terminó el poder Tokugawa en Kioto. El orden de las salas, del vestíbulo de espera a las estancias privadas, es un mapa de la jerarquía feudal.',
      curiosidades: [
        'El «suelo de ruiseñor». El canto sale del roce entre los clavos y las grapas metálicas que sujetan las tablas por debajo. Que se diseñara como alarma contra intrusos es una explicación posterior, sin base en la época.',
        'Las pinturas son copias. El Ninomaru tiene unos 3.600 paneles pintados; desde 1972 se sustituyen por copias y los originales se guardan en el museo del castillo.',
        'Del oro a la tinta. Fíjate en los cubreclavos dorados de las vigas y en cómo la decoración se vuelve más sobria al avanzar: fondos de oro en las salas oficiales y paisajes en tinta en las privadas del shōgun.',
      ],
    },
  ],
  'fushimi-inari': [
    {
      nombre: 'Fushimi Inari Taisha (伏見稲荷大社)',
      queEs: 'Santuario principal de los unos 30.000 santuarios de Inari de Japón. Ocupa casi todo el monte Inari (233 m), cubierto de túneles de torii bermellones.',
      historia: 'La tradición sitúa la llegada de Inari al monte en 711, y su nombre vendría de ine ga nari, «donde brotó el arroz». En 942 recibió el rango divino máximo. En la guerra de Ōnin ardió todo, y el santuario principal se reconstruyó en 1499. La gran puerta Rōmon se atribuía a Hideyoshi, en agradecimiento por la curación de su madre, y en 1973 apareció una inscripción de 1589 que confirmó la tradición.',
      significado: 'Inari empezó como dios del arroz y acabó siendo patrón del comercio y la prosperidad. Por eso comerciantes y empresas donan torii para pedir o agradecer.',
      curiosidades: [
        '¿Cuántos torii? Unos 10.000 por todo el monte. Se donan para que el deseo «pase», o porque ya «pasó». Y los Senbon torii («mil torii») no son mil: es un nombre poético.',
        'Los zorros no son Inari. Son sus mensajeros, y además invisibles: se veneran como «zorros blancos». Fíjate en lo que llevan en la boca las estatuas.',
        'El bermellón protege. El color aleja las fuerzas malignas, y el pigmento tradicional, a base de mercurio, también protegía la madera.',
        'El estanque del eco. En el cruce de Yotsutsuji, a media subida, está el mirador clásico. Más arriba, en el estanque Shin-ike, para encontrar a un desaparecido se da una palmada y se busca hacia donde vuelve el eco.',
      ],
    },
  ],
  kinkakuji: [
    {
      nombre: 'Kinkaku-ji / Rokuon-ji (金閣寺・鹿苑寺)',
      queEs: 'Antigua villa del shōgun Ashikaga Yoshimitsu, hoy templo zen. Su pabellón cubierto de oro se refleja en el estanque Kyōko-chi.',
      historia: 'En 1397 Yoshimitsu, ya retirado, convirtió una villa noble en su residencia, donde recibió a enviados de la China Ming y al emperador. Tras su muerte, en 1408, pasó a ser templo zen. El 2 de julio de 1950 un joven aprendiz del templo le prendió fuego y el pabellón, que había sobrevivido a siglos de guerras, desapareció. Se reconstruyó con exactitud en 1955 gracias a los planos de una restauración de 1904.',
      significado: 'Cada piso tiene un estilo: palacio cortesano el primero, casa samurái el segundo y sala zen al modo chino el tercero. Juntos suman la cultura de la corte, la de los guerreros y la budista.',
      curiosidades: [
        'El primer piso no es dorado. Solo el segundo y el tercero llevan oro sobre laca; fíjate en la madera natural de la planta baja.',
        'La novela del incendio. Yukio Mishima convirtió el incendio de 1950 en El pabellón de oro (1956), la historia de un aprendiz obsesionado con la belleza del edificio.',
        'El fénix del tejado. En lo alto brilla un fénix, ave de buen augurio.',
        'Una campana en «la». La campana, que se dice heredada de los antiguos dueños de la villa, está afinada en la nota la.',
      ],
    },
    {
      nombre: 'Ryōan-ji (龍安寺)',
      queEs: 'Templo zen famoso por su jardín seco: 15 piedras en cinco grupos sobre unos 250 m² de grava blanca rastrillada.',
      historia: 'Lo fundó en 1450 el gran señor Hosokawa Katsumoto. Ardió en la guerra de Ōnin y lo reconstruyó su hijo; la tradición sitúa el jardín hacia 1499, aunque su fecha se discute. Un incendio destruyó la sala principal en 1797, y la actual se trajo de otro templo.',
      significado: 'Es el jardín zen abstracto llevado al extremo: nada de plantas, solo piedra, grava y musgo. Nadie sabe qué quiso decir su autor.',
      curiosidades: [
        'Trampas de perspectiva. El muro de la derecha baja de altura hacia el fondo para que el jardín parezca más profundo, y el suelo se inclina hacia una esquina para desaguar. El muro es de barro amasado con aceite de colza, que resiste mejor y evita el reflejo de la grava.',
        'La única «firma». En la parte trasera de una piedra hay dos nombres grabados, Kotarō y otro medio ilegible. Podrían ser los jardineros, pero es pura conjetura.',
        'Solo sé lo que me basta. Junto a la sala principal hay un aguamanil de piedra con un hueco cuadrado en el centro que sirve de 口 a cuatro caracteres. Juntos se leen ware tada taru wo shiru, «solo sé lo que me basta».',
      ],
    },
  ],
  nishiki: [
    {
      nombre: 'Mercado Nishiki (錦市場)',
      queEs: 'Calle comercial cubierta de unos 390 m con unas 130 tiendas de comida. Es «la cocina de Kioto».',
      historia: 'Su origen no está documentado, pero ya en época Heian pudo haber aquí un mercado, atraído por el agua subterránea. En 1615 el shogunato reconoció a Nishiki como uno de los tres mayoristas de pescado de Kioto: el inicio formal del mercado. En Meiji, al perder sus privilegios, quedó reducido a siete grandes tiendas hacia 1883.',
      significado: 'Abastece la cocina de Kioto, la de los restaurantes y la casera: verduras locales, pescado del lago Biwa, yuba, nama-fu…',
      curiosidades: [
        'De «calle de la porquería» a «calle del brocado». En Heian se llamaba Gusoku-kōji, «calle de las armaduras», y acabó deformada en «Kuso-kōji», «calle de la porquería». En 1054 se cambió por Nishiki-kōji, «calle del brocado».',
        'Agua como nevera. El agua subterránea, a 15–18 °C todo el año, llenaba pozos en cada tienda que servían de nevera. Al final de la calle, el santuario Nishiki Tenmangū sigue sacando agua de unos 30 m de profundidad.',
        'El salvador fue un pintor. Itō Jakuchū, genial pintor de gallos y verduras, era hijo de mayoristas de Nishiki. Entre 1771 y 1774 dejó de pintar para luchar contra el cierre del mercado. Busca sus pinturas en las persianas de las tiendas.',
      ],
    },
  ],
  toji: [
    {
      nombre: 'Tō-ji / Kyōōgokoku-ji (東寺・教王護国寺) y el mercado Kōbō-ichi (弘法市)',
      queEs: 'Templo principal del budismo Shingon, al sur de la estación de Kioto. Su pagoda de cinco pisos, de unos 55 m, es el edificio de madera más alto de Japón.',
      historia: 'Se fundó en 796 como uno de los dos únicos templos permitidos dentro de la nueva capital, a ambos lados de la puerta Rashōmon. En 823 el emperador lo confió a Kūkai, que lo convirtió en el centro del Shingon. La pagoda ardió cuatro veces; la actual, la quinta, es de 1644.',
      significado: 'Es lo único de la Heian-kyō original que sigue en pie: su gemelo del oeste y la Rashōmon desaparecieron. En su sala de lectura, 21 estatuas forman un mandala en tres dimensiones.',
      curiosidades: [
        '¿Por qué el día 21? Kūkai entró en meditación eterna un día 21 de 835. Para atender a los peregrinos que venían en su memoria surgieron puestos de té de «un cuenco, una moneda»; hoy hay cerca de 1.000 puestos.',
        'Demonios cargando la pagoda. En las esquinas del primer tejado, pequeñas figuras de demonios parecen sostener el alero. Dentro, el pilar central se venera como el Buda Dainichi.',
        'Un archivo de mil años. Sus unos 27.000 documentos, del siglo VIII al XVIII, son Memoria del Mundo de la UNESCO desde 2015.',
        'Un espadachín pintor. En el subtemplo Kanchi-in hay un águila y un bosque de bambú pintados por Miyamoto Musashi, el samurái de las dos espadas.',
      ],
    },
  ],
  'nara-todaiji': [
    {
      nombre: 'Kōfuku-ji y su pagoda de cinco pisos (興福寺・五重塔)',
      queEs: 'Templo familiar del clan Fujiwara. Su pagoda de cinco pisos es el símbolo clásico de Nara.',
      historia: 'Nació en 669 y en 710, con la nueva capital, se instaló aquí con el nombre de Kōfuku-ji. La primera pagoda es de 730; la actual, de hacia 1426, mide unos 50 m. En Meiji, la separación forzosa entre budismo y sintoísmo dejó el templo casi abandonado, y la pagoda estuvo a punto de venderse. Hoy vive su primera gran restauración en unos 120 años.',
      significado: 'Fue el templo del linaje que dominó la corte en Nara y Heian. En la Edad Media llegó a gobernar de hecho la provincia, con sus propios monjes guerreros.',
      curiosidades: [
        'La obra, en cifras. La cubierta de obra mide unos 60 m y está desde 2025. El remate se desmontó en 2026 y no volverá hasta 2031.',
        'Un edificio de 2018. El gran pabellón rojo del centro, el Chūkondō, ardió en 1717 y no se reconstruyó hasta 2018, unos 300 años después.',
        'La Ashura. La estatua de Ashura, con tres caras y seis brazos, una de las más queridas de Japón, está en el museo del propio templo.',
      ],
    },
    {
      nombre: 'Parque de Nara y los ciervos sika (奈良公園・鹿)',
      queEs: 'El gran parque que une Kōfuku-ji, Tōdai-ji y Kasuga Taisha, donde viven en libertad los ciervos de Nara, protegidos como Monumento Natural.',
      historia: 'Según la leyenda, en 768 un dios llegó al monte Mikasa a lomos de un ciervo blanco; desde entonces los ciervos se consideran mensajeros divinos. Su protección no siempre fue continua: en 1873 quedaban solo 38, y tras la guerra unos 80. En 1957 fueron declarados Monumento Natural. En 2026 se contaron 1.687.',
      significado: 'Es un caso único de fauna salvaje protegida por motivos religiosos durante más de mil años. Un estudio genético de 2023 concluyó que su linaje lleva más de 1.000 años separado de las poblaciones vecinas gracias a esa protección.',
      curiosidades: [
        'La reverencia es real. Los ciervos se inclinan cuando hay comida de por medio. Un estudio de 2023 contó unas 10 reverencias por ciervo antes de la pandemia y unas 6 durante la COVID, con menos turistas y menos galletas.',
        'Galletas con marca registrada. Las shika senbei son la única comida que se tolera dar a los ciervos, y parte de lo recaudado financia su cuidado.',
        'Astas de terciopelo. En mayo las astas de los machos están creciendo y cubiertas de «terciopelo». El corte ritual, instaurado en 1672, es en otoño.',
      ],
    },
    {
      nombre: 'Tōdai-ji y el Gran Buda (東大寺・大仏)',
      queEs: 'El gran templo estatal del periodo Nara. Dentro del Daibutsuden se sienta un Buda de bronce colosal.',
      historia: 'En 743 el emperador Shōmu ordenó crear un Buda colosal. El cuerpo se fundió en ocho coladas hasta 749, y la ceremonia de «apertura de los ojos» fue en 752, oficiada por un monje indio. El templo ardió en 1180 y en 1567; tras el segundo incendio, el Buda pasó casi un siglo a la intemperie. La cabeza se refundió y el pabellón actual se inauguró en 1709.',
      significado: 'Con él, Shōmu quiso unir espiritualmente el país bajo el budismo. El Buda mide casi 15 m sentado; solo sus ojos miden más de un metro.',
      curiosidades: [
        'Más estrecho que el original. El pabellón antiguo tenía 11 vanos de fachada; por falta de dinero, el de 1709 se redujo a 7, pero mantiene la altura y el fondo. Aun así, es uno de los mayores edificios de madera del mundo.',
        'La linterna superviviente. La linterna octogonal de bronce delante del pabellón es de la época fundacional y sobrevivió a los dos incendios. Busca en sus paneles los bodhisattvas músicos.',
        'Los guardianes de la puerta. Los dos Niō de la Gran Puerta Sur, de unos 8,4 m, los tallaron en 1203, en solo 69 días, Unkei, Kaikei y su taller. Están cara a cara y en posición inversa a la habitual: el de la boca abierta queda a la izquierda al entrar.',
      ],
    },
  ],
  dotonbori: [
    {
      nombre: 'Dōtonbori y el cartel de Glico (道頓堀・グリコサイン)',
      queEs: 'Canal y calle de ocio de Minami (Namba), famosa por sus carteles gigantes. El corredor de Glico, junto al puente Ebisubashi, es la imagen más fotografiada de Osaka.',
      historia: 'En 1612 Yasui Dōton empezó a excavar el canal con su propio dinero. Murió luchando por los Toyotomi en el asedio de Osaka, y sus parientes lo terminaron en 1615. El primer cartel de Glico, de 1935, era una torre de neón de 33 m que se desmontó en 1943 para dar su acero a la guerra. El sexto, de 2014, fue el primero de LED.',
      significado: 'Es la vitrina del kuidaore, «comer hasta arruinarse», y del espíritu comercial y teatral de Osaka.',
      curiosidades: [
        'Un relevo en marcha. El sexto cartel se apaga a finales de noviembre de 2026; en el séptimo, la silueta del corredor se mantiene.',
        'Un canal con nombre de perdedor. Dōton murió luchando contra los Tokugawa, y aun así un señor Tokugawa le dedicó el canal. Además, su apellido real era Nariyasu, no Yasui.',
        'Cada Glico, una sorpresa. El segundo tenía un gran cocodrilo; el tercero lanzaba 12 toneladas de agua en chorros iluminados; el quinto, cuatro símbolos de Osaka a su espalda.',
      ],
    },
    {
      nombre: 'Hōzen-ji y su Mizukake Fudō cubierto de musgo (法善寺・水掛不動)',
      queEs: 'Pequeño templo escondido a pocos pasos de Dōtonbori, con una estatua de Fudō Myōō verde de musgo y el callejón empedrado de Hōzenji Yokochō.',
      historia: 'En 1637 el templo se trasladó a Namba, junto a un gran cementerio y un lugar de ejecuciones. Su monje rezó mil días seguidos por los muertos, y de ahí viene el nombre del barrio, Sennichimae, «delante de los mil días». En el bombardeo de 1945 ardió todo el recinto y solo se salvó el Mizukake Fudō. El pabellón principal nunca se reconstruyó.',
      significado: 'Es un santuario popular de la Osaka comerciante, muy visitado por la gente del espectáculo y de la noche. El musgo es, literalmente, devoción acumulada.',
      curiosidades: [
        'Agua en lugar de ofrenda. Cuenta la tradición que la costumbre de echar agua al Fudō empezó con un fiel que no tenía nada que ofrecer. Hoy apenas se le distinguen los rasgos bajo el musgo.',
        'Un callejón salvado por firmas. Tras los incendios de 2002 y 2003, la ley obligaba a ensanchar la calle. Se reunieron unas 300.000 firmas y se logró conservar su ancho original de unos 2,7 m.',
        'Sopa dulce con novela. En la esquina junto a la puerta oeste está Meoto Zenzai, la casa de sopa de judías rojas que da título a una novela de Oda Sakunosuke.',
      ],
    },
  ],
  'katsuo-ji': [
    {
      nombre: 'Katsuo-ji, el templo de los daruma (勝尾寺)',
      queEs: 'Templo budista en los montes de Minoh, al norte de Osaka. Es famoso como «templo de la suerte para ganar» y por sus miles de daruma.',
      historia: 'Cuenta la tradición que en 727 dos monjes gemelos levantaron aquí una ermita, y en 775 el príncipe Kaisei, hijo del emperador Kōnin, fundó el templo. En época Heian, el abad Gyōjun rezó por la curación del emperador Seiwa, que le dio el nombre de «templo que venció al rey». Por respeto, el carácter de «rey» se cambió por el de «cola», que se pronuncia igual: así nació Katsuo-ji. Ardió en la guerra Genpei (1184) y se atribuye a Minamoto no Yoritomo su reconstrucción en 1188.',
      significado: 'El «vencer» del nombre pasó de la victoria de los guerreros a la de exámenes, enfermedades, elecciones, deporte o negocios.',
      curiosidades: [
        '¿Por qué hay daruma por todas partes? Cada uno lo devolvió alguien al templo tras cumplir su deseo. A finales de diciembre se recogen y el día 28 se queman en una ceremonia.',
        'Mojones de piedra. Marcan las distancias del antiguo camino de subida. Se colocaron en 1247 y son los más antiguos que se conocen en Japón.',
        'Los límites del templo original. Ocho «almacenes de piedra» de hacia 1230 marcaban la linde del recinto, cada uno con una figura de bronce mirando al pabellón principal. Junto con los mojones, son Sitio Histórico nacional.',
      ],
    },
  ],
  'osaka-castillo': [
    {
      nombre: 'Castillo de Osaka, visto desde fuera (大阪城)',
      queEs: 'Parque con los muros y fosos que los Tokugawa levantaron en el siglo XVII y una torre del homenaje de 1931.',
      historia: 'Hideyoshi empezó el castillo en 1583. Tras su caída en 1615, los Tokugawa enterraron el castillo de los Toyotomi bajo varios metros de tierra y construyeron otro encima, en una obra repartida entre 64 casas feudales. Su torre ardió por un rayo en 1665 y no se reconstruyó. La actual, de hormigón, se terminó en 1931 y se pagó con donativos de los ciudadanos. En octubre de 2026 se recomendó declararla Bien Cultural Importante.',
      significado: 'Es un castillo enterrado bajo otro: el paso del Japón de Hideyoshi al de los Tokugawa.',
      curiosidades: [
        'Nada de lo que veis es de Hideyoshi. Todos los muros y fosos son Tokugawa. Los de Hideyoshi solo se ven bajo tierra, en el Museo de los Muros Toyotomi (abierto en 2025), con marcas del incendio de 1615.',
        'Tako-ishi, la piedra más grande. Está junto a la puerta Sakuramon, mide 5,5 × 11,7 m y pesa unas 108 toneladas. Llegó en 1624 desde Okayama, a más de 100 km, y debe su nombre («piedra pulpo») a una mancha con forma de pulpo.',
        'Busca los kokuin. Son marcas grabadas en las piedras que identificaban a la casa feudal responsable de cada bloque. Hay muchas pasado el puente Gokuraku-bashi.',
        'Una herida de guerra. En el lado noreste del basamento de la torre hay piedras desplazadas por una bomba de una tonelada que cayó probablemente el 14 de agosto de 1945, la víspera de la rendición.',
      ],
    },
  ],
  kuromon: [
    {
      nombre: 'Mercado Kuromon (黒門市場)',
      queEs: 'Mercado cubierto de Nipponbashi, conocido como «la cocina de Osaka», especializado en pescado, marisco y productos frescos.',
      historia: 'Hacia 1822 los pescaderos empezaron a vender delante del templo Enmyō-ji, que tenía la puerta principal lacada en negro. En 1902 se reconoció como mercado público. En 1912 un gran incendio quemó el templo y su puerta, pero el recuerdo quedó en el nombre: Kuromon, «puerta negra». Hoy, a final de año, recibe más de 150.000 personas al día.',
      significado: 'Abastecía las cocinas y los restaurantes de la ciudad del kuidaore; hoy convive con un público muy turístico.',
      curiosidades: [
        'Un nombre nacido de las cenizas. Mientras la puerta existió, el mercado se llamaba como el templo. Solo al quemarse pasó la puerta a dar nombre al mercado.',
        'El templo sigue existiendo. El Enmyō-ji se trasladó a Higashi-Sumiyoshi, donde sigue hoy. El mercado es lo único que conserva el recuerdo de su puerta.',
      ],
    },
  ],
  shinsekai: [
    {
      nombre: 'Shinsekai y la torre Tsūtenkaku (新世界・通天閣)',
      queEs: 'Barrio de ocio popular al sur de Namba, levantado en 1912 alrededor de la torre Tsūtenkaku.',
      historia: 'Shinsekai («Nuevo Mundo») se inauguró en 1912: la mitad norte imitaba París y la mitad sur, Coney Island, con un parque de atracciones, Luna Park, unido a la torre por un teleférico. La primera Tsūtenkaku combinaba un arco del triunfo y la parte alta de una torre Eiffel. En 1943 un incendio la dañó y se desmontó para aprovechar el acero en la guerra. La actual, de 103 m, es de 1956: la pagaron los vecinos y la diseñó Naitō Tachū, que poco después proyectaría la Tokyo Tower.',
      significado: 'Después fue el corazón de la Osaka obrera, y aquí nació el kushikatsu como comida barata para trabajadores.',
      curiosidades: [
        'Billiken no es japonés. Lo creó en 1908 una artista estadounidense, Florence Pretz. La estatua actual es la tercera; frotarle las plantas de los pies da suerte.',
        'Mira hacia arriba. Bajo la torre, el fresco del techo es una restauración del original de 1912.',
      ],
    },
  ],
  umeda: [
    {
      nombre: 'Umeda Sky Building y el observatorio Kūchū Teien (梅田スカイビル・空中庭園)',
      queEs: 'Rascacielos doble de 173 m cuyas dos torres se unen en la cima con un anillo-mirador: el Kūchū Teien, «jardín flotante».',
      historia: 'Lo proyectó Hiroshi Hara y se terminó en 1993 como el primer rascacielos «conectado» del mundo. La pieza de arriba no se construyó en lo alto: se montó en el suelo y el 18 de mayo de 1992 se izó entera hasta la cima. Subió a 35 cm por minuto, bajo la lluvia, en siete horas de izado.',
      significado: 'Hara lo concibió como un ensayo de la ciudad aérea del futuro, la utopía del «edificio-ciudad» de finales de la burbuja.',
      curiosidades: [
        'Babilonia y Swift. El «jardín aéreo» alude a los Jardines Colgantes de Babilonia y a Laputa, la isla flotante de Los viajes de Gulliver.',
        'Ni dos lámparas iguales. Las 442 lámparas del techo del mirador se basan en planos de naves espaciales, y Hara dibujaba tres cada noche. En algún rincón del mirador hay escondida la imagen de una nave.',
        'En la lista de The Times. El diario británico lo incluyó entre los «20 edificios que representan el mundo».',
      ],
    },
  ],
  'den-den-town': [
    {
      nombre: 'Den Den Town (でんでんタウン / 日本橋)',
      queEs: 'El barrio de electrónica y cultura otaku de Nipponbashi, el Akihabara de Osaka, con la calle Otaroad como eje del anime y el manga.',
      historia: 'En el periodo Edo era la entrada al camino de Kishū, con posadas a ambos lados. A principios del siglo XX se llenó de librerías de lance y, hacia 1940, de tiendas de radios. El bombardeo de 1945 lo arrasó, y renació con radios y piezas, muchas de excedentes militares, y luego con electrodomésticos. El apodo «Den Den Town» llegó en 1978, y desde finales de los 90 es barrio de anime, videojuegos y figuras.',
      curiosidades: [
        'Nipponbashi, no Nihonbashi. El puente que da nombre al barrio se lee distinto que el de Tokio. En Edo era uno de los 12 puentes de Osaka mantenidos directamente por el shogunato.',
        '¿Por qué «den den»? Viene de 電 (den), de denki, «electricidad»: el barrio del den-den.',
        'El primer edificio alto de Osaka. En 1888 se levantó aquí el Chōbōkaku, una torre de 5 plantas y 31 m que funcionaba casi como unos grandes almacenes.',
      ],
    },
  ],
  'hiroshima-paz': [
    {
      nombre: 'Parque Memorial de la Paz (平和記念公園)',
      queEs: 'Parque conmemorativo levantado en los años 50 junto al hipocentro de la bomba del 6 de agosto de 1945. Reúne el Museo, el Cenotafio, la Llama de la Paz y el Monumento a los Niños.',
      historia: 'En 1949 la ciudad convocó un concurso al que se presentaron 145 propuestas; ganó el equipo de Kenzō Tange. Su plan traza un eje que une la explanada, el Cenotafio y, al fondo, la Cúpula. El Cenotafio se inauguró en 1952 y guarda el registro de víctimas: 353.639 nombres en 2026. La Llama de la Paz se encendió en 1964.',
      significado: 'Japón convirtió el hipocentro en un espacio de duelo y de llamamiento contra las armas nucleares, con un diseño que une «mirar» y «rezar» en un mismo eje.',
      curiosidades: [
        'Ponte detrás del Cenotafio. Mirando al norte verás en línea la Llama y, al fondo, la Cúpula: es el eje de Tange. Antes, aquí estaba Nakajima, uno de los barrios comerciales más animados de la ciudad.',
        'Sadako y las grullas. Sadako Sasaki tenía 2 años cuando cayó la bomba y murió de leucemia en 1955, a los 12. En menos de un mes superó las 1.000 grullas de papel, al contrario de lo que se cuenta fuera de Japón. Su monumento, pagado con donaciones de niños de todo el país, recibe unos 10 millones de grullas al año.',
        'Una grulla como badajo. Dentro del Monumento a los Niños cuelga una campana con caligrafía del Nobel Hideki Yukawa, y su badajo es una grulla dorada.',
        'La llama que espera. Arderá «hasta el día en que las armas nucleares desaparezcan de la Tierra». La encendieron siete jóvenes nacidas el 6 de agosto de 1945.',
      ],
    },
    {
      nombre: 'Museo Memorial de la Paz de Hiroshima (広島平和記念資料館)',
      queEs: 'El museo que documenta el bombardeo atómico y sus consecuencias humanas, con un edificio principal de Kenzō Tange.',
      historia: 'Nació del concurso de 1949 y abrió el 24 de agosto de 1955. En 2006 fue el primer edificio de posguerra declarado Bien Cultural Importante, y se considera el punto de partida de Tange. Reabrió renovado en 2019 y bate récords: más de 2,2 millones de visitas al año y más de 80 millones en total.',
      significado: 'Pone rostros y objetos concretos a la cifra de víctimas.',
      curiosidades: [
        'Un edificio sobre pilares. La planta baja está casi vacía para dejar ver la Cúpula entre las columnas y expresar la fuerza del ser humano que se levanta de entre las ruinas.',
        'La piedra de la sombra humana. Son los escalones de un banco a 260 m del hipocentro. Alguien que esperaba sentado a que abriera murió en el acto, y el calor blanqueó la piedra a su alrededor dejando una mancha oscura donde estaba.',
      ],
    },
    {
      nombre: 'Cúpula de la Bomba Atómica (原爆ドーム)',
      queEs: 'La ruina del antiguo Pabellón de Promoción Industrial de Hiroshima, conservada tal como quedó tras la explosión. Es Patrimonio Mundial desde 1996.',
      historia: 'La proyectó el arquitecto checo Jan Letzel y se inauguró en 1915 como pabellón de exposición de productos de la prefectura. El 6 de agosto de 1945, a las 8:15, la bomba estalló a unos 600 m de altura y a unos 160 m del edificio; todos los que trabajaban dentro murieron en el acto. Parte de la ciudad quería demolerla, pero el diario de Hiroko Kajiyama, expuesta a la radiación con un año y muerta de leucemia quince años después, impulsó su conservación, aprobada en 1966. En 1996 llegó a Patrimonio Mundial gracias a 1,65 millones de firmas que vencieron las reticencias del Estado.',
      significado: 'Es el testimonio más reconocible del primer bombardeo atómico, conservado a propósito como advertencia y nunca reconstruido.',
      curiosidades: [
        'Por qué quedó en pie. La onda expansiva llegó casi en vertical: hundió el tejado y la cúpula, pero los gruesos muros laterales aguantaron. De la cúpula solo quedó el armazón metálico, y de ahí el apodo.',
        'El hipocentro está a 160 m. Una placa lo señala sobre el antiguo Hospital Shima. Se dice que el objetivo era el puente Aioi, por su rara forma de T, pero la bomba estalló a unos 300 m de él.',
        'No fue lo único en pie. Otros edificios cercanos resistieron, como la actual Rest House del parque, a solo 170 m del hipocentro.',
      ],
    },
  ],
  asakusa: [
    {
      nombre: 'Sensō-ji (浅草寺)',
      queEs: 'El templo budista más antiguo de Tokio, dedicado a Kannon, bodhisattva de la compasión.',
      historia: 'Cuenta la leyenda que en 628 dos hermanos pescadores sacaron con la red una imagen de Kannon del río Sumida. La devolvieron al agua varias veces, pero siempre volvía a la red, y un notable del lugar convirtió su casa en templo. La arqueología confirma que a mediados del siglo VIII ya había aquí un templo muy concurrido. La sala principal ardió en el bombardeo de 1945 y se reconstruyó en hormigón con donaciones de los fieles en 1958; a lo largo de su historia se ha rehecho unas 20 veces.',
      significado: 'Es el centro espiritual del shitamachi, el Edo popular. En el periodo Edo, su entorno fue el gran barrio de ocio de la ciudad.',
      curiosidades: [
        'La imagen que nadie ve. La Kannon principal está oculta desde 645 y nunca se expone. La tradición dice que mide apenas unos 5,5 cm.',
        'Enterrada para salvarla. Durante el bombardeo de 1945 la imagen se enterró unos 3 m bajo la sala principal, dentro de una pila de bronce, y así se salvó.',
        'Mira el techo y el tejado. En el techo de la sala hay un gran dragón pintado de unos 6,4 × 4,9 m. Desde 2010 las tejas son de titanio, más ligeras ante los terremotos.',
        'Sandalias para asustar al mal. En la puerta Hōzōmon cuelgan unas sandalias de paja de 4,5 m y unos 500 kg: el mal debe creer que el guardián que las calza es enorme y huir. La puerta este, Nitenmon (1649), es el edificio más antiguo y sobrevivió a 1945.',
      ],
    },
    {
      nombre: 'Kaminarimon (雷門) y Nakamise-dōri (仲見世通り)',
      queEs: 'Kaminarimon es la puerta exterior de Sensō-ji, custodiada por los dioses del viento y del trueno. Nakamise es la calle comercial de unos 250 m que va desde ella hasta la puerta Hōzōmon.',
      historia: 'La tradición sitúa su origen en 942. Ardió varias veces, la última en 1865, y durante 95 años solo hubo puertas provisionales. La actual es de 1960 y la pagó Matsushita Kōnosuke, fundador de Panasonic. Nakamise nació hacia 1685, cuando el templo dejó a los vecinos montar puestos a cambio de limpiar el recinto.',
      significado: 'Es la imagen-símbolo de Asakusa. Fūjin y Raijin, que miran hacia fuera, protegen el templo del viento y de las inundaciones.',
      curiosidades: [
        'Una puerta en agradecimiento. Matsushita sufría dolores articulares y se curó después de que el abad rezara por él ante la imagen principal. En agradecimiento, donó la puerta.',
        'El farol gigante. Mide 3,9 m de alto y pesa unos 700 kg. Durante el Sanja Matsuri se pliega para que pasen los mikoshi.',
        'Mira la parte de atrás. Por el lado interior hay otras dos estatuas, dioses budistas con cola de dragón de casi 3 m, tallados en 1978.',
        'Persianas pintadas. Cuando las tiendas de Nakamise cierran, sus persianas bajadas forman un mural continuo de las fiestas de Asakusa, pintado en 1989.',
      ],
    },
    {
      nombre: 'Asakusa Jinja (浅草神社) y el Sanja Matsuri (三社祭)',
      queEs: 'Santuario sintoísta pegado a Sensō-ji que venera como dioses a los tres fundadores del templo budista. De ahí su nombre popular, «Sanja-sama» (los tres santuarios).',
      historia: 'No se sabe cuándo se fundó. El edificio actual lo donó el shōgun Tokugawa Iemitsu en 1649, en el mismo estilo que el Tōshō-gū de Nikkō, y ha sobrevivido a incendios, al terremoto de 1923 y a la guerra. Con la separación entre budismo y sintoísmo, en 1873 pasó a llamarse Asakusa Jinja.',
      significado: 'Es un caso clarísimo de mezcla de budismo y sintoísmo: los fundadores humanos de un templo budista acabaron venerados como kami justo al lado.',
      curiosidades: [
        'Un festival multitudinario. El Sanja Matsuri, uno de los tres grandes festivales de Edo, reúne a unos 1,8 millones de personas.',
        'Mikoshi zarandeados a propósito. Se sacuden con violencia para avivar el poder de la deidad. En Edo la fiesta era fluvial: los mikoshi recorrían el Sumida en barca.',
        'Leones de la suerte en el amor. La pareja de komainu de principios de Edo es un «matrimonio» y se asocia con la buena suerte en el amor. Hay además una estela dedicada a Ryōtsu Kankichi, protagonista del manga Kochikame, ambientado en este barrio.',
      ],
    },
  ],
  'tokyo-skytree': [
    {
      nombre: 'Tokyo Skytree (東京スカイツリー)',
      queEs: 'Torre de radiodifusión y mirador de 634 m en Oshiage, la estructura más alta de Japón, con dos miradores a 350 y 450 m.',
      historia: 'Se construyó porque los rascacielos ya bloqueaban la señal de la Torre de Tokio. Iba a medir unos 610 m, pero en 2009 se amplió a 634 m para ser la torre más alta del mundo. El pararrayos que completó la altura se colocó una semana después del gran terremoto de 2011, que no la dañó. Abrió el 22 de mayo de 2012, así que el 22 de mayo de 2027 cumplirá 15 años.',
      significado: 'Está en el shitamachi, junto al río Sumida y no en un distrito de negocios, y su diseño juega con la estética tradicional japonesa.',
      curiosidades: [
        '634 = Mu-sa-shi. Los números 6-3-4 se leen «mu-sa-shi», como la antigua provincia de Musashi, que abarcaba Tokio.',
        '¿Una pagoda de alta tecnología? En el centro hay un cilindro de hormigón de 375 m, el shinbashira, que oscila a otro ritmo que la torre y reduce la sacudida sísmica hasta un 50 %. No copiaron las pagodas: el sistema moderno acabó pareciéndose al pilar central de las pagodas de cinco pisos, y por eso le pusieron ese nombre.',
        'Cambia según desde dónde la mires. La planta es un triángulo en la base y un círculo arriba, porque el solar era una antigua playa de vías muy estrecha. Sus curvas combinan formas cóncavas, como la de una katana, y convexas.',
        'Luces con nombre propio. La iluminación Iki, azul claro, evoca el Sumida y la elegancia de Edo; la Miyabi, violeta, el refinamiento.',
      ],
    },
  ],
  akihabara: [
    {
      nombre: 'Akihabara (秋葉原)',
      queEs: 'Barrio en torno a la estación de Akihabara que fue el mayor mercado de electrónica de Japón y hoy es un centro mundial del anime, el manga, los videojuegos y las figuras. Todo el mundo lo llama «Akiba».',
      historia: 'Tras un gran incendio en 1869, el gobierno dejó aquí un cortafuegos y levantó un santuario contra el fuego. La gente lo confundió con el famoso dios contra incendios Akiha y llamó al descampado «Akiba-ga-hara». La estación abrió en 1890 para mercancías. Tras la guerra, estudiantes de ingeniería eléctrica montaban y vendían radios en puestos callejeros, y cuando la ocupación los prohibió, los comerciantes se agruparon junto a la estación y bajo las vías. Después llegaron los electrodomésticos, los ordenadores y, desde los 90, el anime y las figuras.',
      significado: 'Resume el Japón moderno en un solo barrio: el mercado negro de posguerra, el milagro industrial y la cultura pop.',
      curiosidades: [
        'Un nombre que es un malentendido. Aquí nunca se veneró oficialmente a ningún dios «Akiba»: el nombre viene de confundir el santuario con Akiha. La lectura osciló hasta fijarse como Akihabara en 1911, así que «Akiba» no es una abreviatura moderna, sino la pronunciación antigua.',
        'El santuario existe todavía. Es el Akiba Jinja, a 3 km, en Taitō, y cada 6 de noviembre celebra una ceremonia de caminar sobre el fuego.',
        'Mira bajo las vías. El laberinto de puestos de componentes del Radio Center es el heredero directo de los puestos de radio de 1949.',
      ],
    },
    {
      nombre: 'Radio Kaikan (ラジオ会館)',
      queEs: 'Edificio comercial frente a la salida eléctrica de la estación, lleno de tiendas de figuras, cartas y coleccionismo.',
      historia: 'Abrió en 1950 como un edificio de madera de dos plantas, y en 1962 se levantó uno de ocho, el primer edificio alto del barrio. En 1976 NEC abrió en la 7.ª planta el Bit-INN, un centro de apoyo para su kit de microordenador que desató la fiebre de la informática. En 1998 llegaron las tiendas de figuras. El edificio actual, de 10 plantas, es de 2014.',
      curiosidades: [
        'De la caligrafía a las figuras. La empresa desciende de una editorial de 1893 especializada en caligrafía.',
        'Cuna del ordenador personal. Una placa de 2001 en la 7.ª planta recuerda que el ordenador personal japonés nació en el Bit-INN de NEC y desde aquí se extendió por todo el país.',
      ],
    },
  ],
  nakano: [
    {
      nombre: 'Nakano Broadway (中野ブロードウェイ)',
      queEs: 'Complejo de tiendas y viviendas junto a la estación de Nakano, con unos 300 locales en las plantas bajas. Es la meca del coleccionismo otaku de segunda mano.',
      historia: 'Se terminó en 1966 como uno de los primeros complejos de tiendas y viviendas de Japón, con apartamentos de lujo y boutiques. Cuando abrieron centros comerciales en Shinjuku y Kichijōji, muchas tiendas cerraron. En 1980 Furukawa Masuzō abrió en la 2.ª planta Mandarake, una tienda de manga de segunda mano de unos 6,6 m². Los alquileres baratos atrajeron otras tiendas de nicho, y en los 90 el edificio ya era lugar sagrado de la subcultura.',
      significado: 'Un edificio de prestigio que se reinventó desde abajo, gracias a pequeños comerciantes especializados y no a un plan urbanístico.',
      curiosidades: [
        'Del lujo al manga. Se anunció como «el mejor edificio de Oriente», y hoy se compararía con Roppongi Hills.',
        'Vecinos famosos. Aquí vivieron el cantante Sawada Kenji («Julie») y Aoshima Yukio, que llegó a ser gobernador de Tokio. Los residentes tienen jardín en la azotea.',
      ],
    },
  ],
  'kiyosumi-fukagawa': [
    {
      nombre: 'Kiyosumi Teien (清澄庭園)',
      queEs: 'Jardín de paseo alrededor de un gran estanque con tres islas, famoso por sus piedras traídas de todo Japón.',
      historia: 'Su forma básica viene del siglo XVIII, cuando era la residencia secundaria de un señor feudal. En 1878 lo compró Iwasaki Yatarō, fundador de Mitsubishi, para el recreo de sus empleados y para recibir a invitados ilustres. Tras el terremoto de 1923 la familia donó la mitad este a la ciudad, y se abrió como parque público en 1932.',
      curiosidades: [
        'Piedras en barco propio. Los Iwasaki trajeron más de 50 piedras notables de todo el país en sus propios vapores. Fíjate en el camino de piedras sueltas por el borde del agua.',
        'El refugio de 1923. El estanque y los árboles frenaron el fuego y salvaron a miles de personas que se refugiaron aquí. Por eso la familia lo donó a la ciudad, y en 1945 volvió a servir de refugio.',
        'Un pabellón para Kitchener. El Ryōtei, que avanza sobre el estanque, se construyó en 1909 para recibir al mariscal británico Kitchener y fue el único edificio que sobrevivió al terremoto.',
        'Azaleas y Bashō. El montículo «Fuji-san» está plantado de azaleas, y a finales de mayo quizá queden flores. Busca también la estela con el famoso haiku de Bashō sobre la rana que salta al viejo estanque.',
      ],
    },
    {
      nombre: 'Fukagawa Edo Museum (深川江戸資料館)',
      queEs: 'Museo que reconstruye a tamaño real un trozo del barrio de Fukagawa a finales de la época Edo. Se puede entrar en las casas.',
      historia: 'Abrió en noviembre de 1986, así que en 2026 cumple 40 años. Para la reconstrucción se usó un plano catastral de 1760. En 2014 se añadió una sala dedicada al yokozuna Taihō.',
      significado: 'Muestra la vida de la gente corriente: un almacén de abonos, una frutería, posadas de barqueros y un nagaya, la casa de vecinos, con pozo, retrete y santuario compartidos.',
      curiosidades: [
        'Un día entero. Luces y sonido simulan un día completo, de la mañana a la noche.',
        'Familias inventadas, pero coherentes. Cada casa tiene asignada una familia, con sus oficios y edades, y los objetos están elegidos en consecuencia. Busca el puesto de soba y la torre de vigilancia de incendios sobre el canal.',
        'Un yokozuna vecino. La sala de Taihō, uno de los grandes campeones de la posguerra, expone su moño, sus delantales ceremoniales y réplicas de sus 32 copas.',
      ],
    },
    {
      nombre: 'Naritasan Fukagawa Fudō-dō (成田山深川不動堂)',
      queEs: 'Sede en Tokio del gran templo Shingon de Naritasan (Chiba), dedicada a Fudō Myōō.',
      historia: 'Naritasan se fundó en 940. En 1703 la imagen de Fudō de Narita se expuso por primera vez en Edo, aquí en Fukagawa, y de esa exposición nace el templo. El terremoto de 1923 y el bombardeo de 1945 destruyeron los edificios, pero la imagen principal se salvó las dos veces; en 1945 los monjes la evacuaron a Narita. El nuevo hondō se terminó en 2012.',
      significado: 'Aquí el ritual se vive de cerca: el goma, ritual del fuego con tambores y mantras, se celebra varias veces al día.',
      curiosidades: [
        'El kabuki y Fudō. El primer Ichikawa Danjūrō rezó a Fudō de Narita para tener un hijo. Cuando nació, la familia adoptó el nombre de «Naritaya», el mismo que el público grita aún hoy en los teatros.',
        'Un edificio llegado de Chiba. Tras la guerra no había madera para construir, así que se desmontó y trasladó aquí una sala del siglo XIX de un templo de Chiba.',
        'Fíjate en la fachada. El nuevo hondō está cubierto de caracteres sánscritos con el mantra de Fudō, y dentro hay unas 10.000 pequeñas pagodas de cristal.',
      ],
    },
    {
      nombre: 'Tomioka Hachimangū (富岡八幡宮)',
      queEs: 'El gran santuario de Hachiman de Fukagawa, considerado la cuna de los torneos de sumo de Edo de los que desciende el sumo profesional actual.',
      historia: 'Se fundó en 1627 en una isla de bancos de arena que se rellenaron para crear el recinto y el barrio. Según la leyenda, el sacerdote fundador encontró el lugar siguiendo una flecha de plumas blancas que había visto en un sueño. En 1684 el shogunato autorizó aquí dos torneos de sumo al año, y durante un siglo se consolidaron los torneos periódicos y la clasificación de luchadores. Después el sumo se trasladó a Ryōgoku.',
      significado: 'Cuando un luchador asciende a yokozuna, se graba su nombre en la estela del santuario y él realiza aquí su ceremonia de entrada al ring.',
      curiosidades: [
        'La Estela de los Yokozuna. Es de 1900, mide 3,5 m, pesa 20 toneladas y lleva los nombres de todos los yokozuna desde el primero. Al lado hay huellas de manos y pies de luchadores gigantes: compara tu mano.',
        'El mayor mikoshi de Japón. El «gran mikoshi de oro» de 1991 pesa unas 4,5 toneladas y lleva 24 kg de oro puro, ojos de diamante y 2.010 rubíes. Es tan pesado que no se puede llevar a hombros cada año, así que en 1997 se hizo un segundo.',
        'Aquí empezó el mapa de Japón. Inō Tadataka vivía al lado y rezaba aquí antes de cada viaje de medición; el primero salió en 1800. Su estatua está junto al gran torii.',
        '400 años en 2027. El santuario está en obras por su aniversario y su museo está cerrado.',
      ],
    },
  ],
}

/** Devuelve las fichas de contexto de una zona, o undefined si no hay. */
export function getContext(zoneId: string): readonly ContextEntry[] | undefined {
  return context[zoneId]
}
