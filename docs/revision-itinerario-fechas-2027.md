# Revisión del itinerario con las fechas definitivas (vuelos comprados)

> **Fecha de la revisión:** 12 nov 2026. Datos contrastados con fuentes web actuales (2025-2026); ver §5.
> **Estado:** PROPUESTA. Todavía no está aplicada a `src/data/itinerary.ts`.

## 1. Vuelos reales (reserva 9A732G, Lufthansa, 902,57 € en total)

| Tramo | Salida | Llegada |
|---|---|---|
| Ida LH1125 + LH710 | **Vie 7 may** 10:15 BCN (escala en FRA) | **Sáb 8 may 09:30 NRT** |
| Vuelta LH711 + LH1138 | **Vie 28 may 11:20 NRT** (escala en FRA) | **Vie 28 may 23:05 BCN** |

**Diferencias con lo que daban por hecho el itinerario y la memoria:**
- Llegamos a Narita a las **09:30**, no a las 12:45. Se gana la tarde del día 8 entera.
- Salimos de Narita a las **11:20**, no a las 18:00. El día 28 no da para nada: check-out sobre las 7:15 y en la T1 hacia las 8:45.
- Aterrizamos en Barcelona el **viernes 28 a las 23:05**, no el sábado 29 por la mañana. Quedan **sábado 29 y domingo 30 libres** para descansar.
- En Japón hay **20 noches** (del 8 al 27), igual que antes. Basta con correr todo el viaje un día hacia atrás y quitar la "mañana libre" del último día.

## 2. Qué se rompe si solo restamos un día a cada fecha

Al restar un día, **todas las visitas caen un día de la semana antes**. Estas son las que dejan de funcionar:

| Nueva fecha | Plan heredado | Problema |
|---|---|---|
| Dom 9 | Shibuya + Harajuku + Shinjuku | En domingo Harajuku está "intransitable" y Meiji/Yoyogi se llenan |
| **Lun 10** | Ueno + Yanaka | **El Museo Nacional de Tokio cierra los lunes**, y en Yanaka cierran muchas tiendas |
| **Dom 16** | **Shirakawa-go** | El peor día posible: el domingo se colapsa y además hay menos buses |
| Lun 17 | Llegada a Kioto + Tō-ji | El mercado de Tō-ji es el **día 21**, no el 17 (el itinerario actual tenía este error) |
| Vie 28 | — | Día perdido por el vuelo de la mañana |

## 3. Itinerario propuesto (día de la semana elegido a propósito)

**Idea general:**
- En mayo, "entre semana" **no siempre** significa menos gente. Mayo es el mes punta de los **viajes escolares** de secundaria, que se concentran en **Kioto (24 %), Nara (19 %) e Hiroshima**, más o menos de 10:00 a 15:00.
- Por eso:
  - En **Kioto y Nara** se va entre semana, pero **a primera o a última hora**.
  - **Hiroshima** va en **domingo**.
  - Los sitios donde el problema es el turismo local de fin de semana (onsen, Shirakawa-go, Harajuku) van **entre semana**.

| Fecha | Base | Plan | Por qué ese día y esa hora |
|---|---|---|---|
| **Sáb 8** | Tokio | NRT 9:30 → Skyliner (~41 min a Ueno) → hotel. Tarde suave. **Si se confirma el Kanda Matsuri** (el desfile Shinkōsai, probablemente este día), verlo por Kanda/Akihabara. Si no, Asakusa al anochecer | Sensō-ji está iluminado hasta las 23:00 y de noche está tranquilo, aunque sea sábado |
| **Dom 9** | Tokio | Jardines del Este del Palacio Imperial (9:00) → Marunouchi → **Ginza peatonal 12:00–18:00** (Kabuki-za). Opcional: entrada de los mikoshi en Kanda Myōjin | Ginza solo es peatonal en fin de semana. Los jardines cierran lunes y viernes. Tsukiji cierra el domingo, así que sale de este día |
| **Lun 10** | Tokio | **Meiji Jingū a primera hora** (abre al amanecer) → Harajuku (Takeshita) → Omotesandō → comida → Shibuya y su cruce → **Shibuya Parco, planta 6** (Nintendo Tokyo, Pokémon Center, Capcom Store, Jump Shop; ~10:00–21:00) → **Shibuya Sky al atardecer** (puesta de sol ~18:40; **entrada con hora, comprar con antelación**) → **Shinjuku de noche**: Omoide Yokocho, Golden Gai, Kabukichō. Se quita el mirador del Gobierno Metropolitano: las vistas ya las dan Shibuya Sky y Skytree | Un lunes Harajuku está tranquilo, y en lunes no se pierde ningún museo |
| **Mar 11** | Tokio | **Museo Nacional** a las 9:30 (apertura) → línea Hibiya directa de Ueno a Tsukiji → **comida en el mercado exterior de Tsukiji** (~12:00) → vuelta en la línea Hibiya → **Yanaka** por la tarde (Nezu Jinja: el jardín de azaleas solo abre en abril) | El museo y Tsukiji están abiertos el martes. La asociación del mercado pide a los turistas ir **de 9:00 a 14:00**, porque a primera hora compran los profesionales *(decidido)* |
| **Mié 12** | Takaragawa | Mañana tranquila → Jōetsu Shinkansen (~1h15) → lanzadera de las **13:00 o 15:00** desde Jōmō-Kōgen (**reserva por teléfono**, ~45 min) | Entre semana hay menos bañistas de día (10:00–16:30) y el sábado es la noche más cara |
| **Jue 13** | Kanazawa | Lanzadera de las **9:30** (es la única) → Jōmō-Kōgen → Takasaki → Kanazawa ~14:00. Ōmichō antes de las 17:00 o Higashi Chaya al atardecer | Kanazawa primero es lo único sensato: ir a Takayama desde el onsen son 6,5–9 h |
| **Vie 14** | Kanazawa | **Kenroku-en a las 7:00** (o gratis de 4:00 a 6:45 por las puertas Hasuike/Zuijinzaka) → castillo → Nagamachi/casa Nomura → comida en Ōmichō → tarde libre (opcional: paseo por Nishi Chaya y Teramachi; Higashi Chaya si quedó pendiente) | Laborable, y en el jardín antes de que lleguen los grupos |
| **Sáb 15** | Takayama | Kanazawa → Takayama (bus Nōhi con reserva, ~2h15, o tren por Toyama: solo 4 trenes Hida al día) → dejar maletas y comer → **Yatai Kaikan + santuario Sakurayama Hachimangū** (~14:00; visita libre de 30–45 min; horario y precio por confirmar, ~8:30/9:00–17:00, ~¥840) → **Sanmachi desde las 16:00** (muchas tiendas y bodegas de sake cierran hacia las 17:00) | A esa hora ya se han ido los excursionistas de día |
| **Dom 16** | Takayama | Mercado matinal de Miyagawa (7:00) → Jinya (8:45) → Sanmachi antes de las 10 → **Hida no Sato** por la tarde | En domingo, mejor Takayama que Shirakawa-go: es una ciudad y absorbe a la gente |
| **Lun 17** | → Kioto | **Bus de las 7:20 → Shirakawa-go a las 8:10**, antes de los autocares. Excursión de ida y vuelta: regreso a Takayama → tren Hida + shinkansen por Nagoya → Kioto ~17:00 *(decidido)* | Shirakawa-go un laborable antes de las 9 es la mejor franja posible |
| **Mar 18** | Kioto | Higashiyama completo de sur a norte: **Kiyomizu-dera a las 6:00–8:00** → Sannenzaka/Ninenzaka antes de que abran las tiendas → Kōdai-ji → Maruyama → **Nanzen-ji** → **Camino del Filósofo** → **Ginkaku-ji** (antes del cierre, ~17:00, por confirmar) → taxi o autobús a **Gion** al anochecer (Hanamikoji 17:30–19:00). Día largo, ~8–10 km a pie *(decidido)* | Se adelanta a los grupos escolares. El Honmaru de Nijō cierra el 17 y el 18 |
| **Mié 19** | Kioto | **Bambú de Arashiyama a las 7:00** → Tenryū-ji (8:30) → comida en Arashiyama → JR a Kioto → **Sanjūsangen-dō hacia las 13:30** (8:30–17:00, ¥600, unos 45–60 min) → **castillo Nijō hacia las 15:00** (8:45–17:00, última entrada 16:00; los grupos ya se van) | Nishiki cierra parte de sus puestos los miércoles, así que no va este día. El palacio Honmaru de Nijō solo cierra lun 17 y mar 18 |
| **Jue 20** | Kioto | **Fushimi Inari con el primer tren** (~6:00 en la puerta; subir hasta el mirador de Yotsutsuji, ~1h30 ida y vuelta) → **taxi a Kinkaku-ji para la apertura de las 9:00** (~35–40 min; caben los 4) → Ryōan-ji → comida → mercado Nishiki → tarde libre | Criterio de la primera oleada. Fushimi al amanecer es indispensable para una buena experiencia (experiencia previa del grupo), y Kinkaku-ji a su apertura, antes de la oleada escolar |
| **Vie 21** | → Osaka | **Kōbō-ichi de Tō-ji a las 8:00** (las maletas se quedan en el hotel de Kioto, en Shichijō) → vuelta al hotel a recogerlas → JR a Osaka (~30 min) + taxi al hotel de Namba: **dejar las maletas hacia las 12:30** → comida → tren Kintetsu directo Namba → Nara (~40 min) → **Tōdai-ji de 15:00 a 17:30** → vuelta a Namba a cenar *(decidido)* | El 21 es el único día del mercadillo. Nara a última hora evita a los escolares. Así nunca se va con maletas por Nara ni se depende de consignas |
| **Sáb 22** | Osaka | **Katsuo-ji** por la mañana (en fin de semana hay más buses; el bus ya no acepta efectivo, se paga con IC; en taxi son ~3.400 ¥ para los 4) → Minami por la tarde | Fin de semana porque hay buses frecuentes |
| **Dom 23** | Osaka | **Hiroshima** de ida y vuelta. Reservar online la franja de 7:30–8:30 del museo o llegar hacia las 9:00 | En domingo no hay grupos escolares, y mayo es el mes n.º 1 o 2 del museo en visitas escolares |
| **Lun 24** | Osaka | **Día tranquilo en Osaka**: sin despertador → parque del castillo de Osaka (por fuera: fosos y murallas) → comida en Kuromon → Shinsekai → descanso en el hotel → **Umeda Sky Building al atardecer** (puesta de sol ~19:00; abre 9:30–22:30, ¥2.000) + cena en Umeda | Corta la racha de 8 días seguidos con mucho ritmo (17–24). Se descarta Himeji (ver decisiones) |
| **Mar 25** | Tokio | Shin-Osaka → Tokio (**asiento E** para el Fuji) → **Akihabara por la tarde, en modo friki**: figuras (Radio Kaikan, Mandarake Complex, Surugaya), juegos retro (Super Potato y similares; comprobar en 2027 que siguen abiertas), gachapon | La tarde entera se dedica a tiendas friki: el resto del viaje es sobre todo cultura y templos |
| **Mié 26** | Tokio | **Asakusa a las 7:30** → Skytree al atardecer (**entrada con hora, comprar con antelación**) | Entre semana Asakusa está tranquilo temprano, y la entrada al Skytree es más barata |
| **Jue 27** | Tokio | Kiyosumi/Fukagawa por la mañana (el museo Edo abre el jueves) → línea Tōzai directa desde Monzen-Nakachō (~35 min) → **Nakano Broadway por la tarde** (Mandarake: figuras vintage, manga, retro; tiendas sobre todo 12:00–20:00, algunas cierran los miércoles) → maletas | Sustituye a Odaiba: tiendas friki en Tokio para compensar un viaje muy de templos |
| **Vie 28** | — | Check-out en Asakusa hacia las 7:15 → taxi a Ueno (~10 min) → Skyliner → NRT T1 ~8:45 → LH711 a las 11:20 | El hotel del bloque 2 va en **Asakusa**, a 10 min de Ueno en taxi. También hay trenes directos a Narita desde la estación de Asakusa: comprobar el horario de 2027 |

**Comparado con el plan actual:**
- Se mantienen las mismas ciudades y el mismo reparto de noches: Tokio 4, Takaragawa 1, Kanazawa 2, Takayama 2, Kioto 4, Osaka 4, Tokio 3.
- Cambia el orden dentro de cada bloque.
- Cambios de contenido, detallados en las decisiones de abajo:
  - Se añaden Sanjūsangen-dō, Yatai Kaikan, Umeda Sky, Shibuya Parco y Nakano.
  - Se quitan Himeji, Odaiba y el mirador del Gobierno Metropolitano.

### Decisiones tomadas en la revisión (12 nov 2026)

- **Lunes 17:** Shirakawa-go como excursión de ida y vuelta desde Takayama. Se descartan la ruta por Kanazawa con takkyubin y llevar las maletas en el autobús.
- **Kanda Matsuri:** si se confirma para el 8 y 9 de mayo, se incluye en **formato ligero**:
  - Sábado por la tarde: el desfile al paso, por Kanda o Akihabara.
  - Domingo por la mañana: un rato en Kanda Myōjin para ver entrar los mikoshi, y luego el plan del domingo.
- **Kamogawa Odori:** no se incluye.
- **Viernes 21, maletas resueltas:** Tō-ji, después Osaka para dejar las maletas en el hotel, y Nara por la tarde en ida y vuelta desde Namba. Se descartan las consignas de Nara.
- **Equipaje:** las maletas grandes viajan con el grupo durante todo el viaje, sin mensajería. En cada cambio de hotel: **taxi del hotel a la estación**, y de la estación **al hotel siguiente o a una consigna** si aún no se puede dejar el equipaje. Para 4 personas y 4 maletas de 23 kg hacen falta **2 taxis o un taxi grande tipo furgoneta**: pedirlo en recepción o por aplicación.
- **Lunes 24:** ~~el castillo de Himeji sustituye al de Osaka~~ → **se descarta Himeji**. El lunes 24 queda como día tranquilo en Osaka, con el castillo de Osaka visto por fuera. Motivos:
  - Himeji solo compensa si se entra en el torreón original, y no se iba a entrar.
  - Del lun 17 al lun 24 había 8 días seguidos con mucho ritmo.
  - **Katsuo-ji se mantiene** (sáb 22) por los daruma: es distinto a los templos de Kioto.
- **Miércoles 19:** se añade **Sanjūsangen-dō** al mediodía, después de Arashiyama.
- **Criterio de la primera oleada (decisión del usuario):** en los sitios donde la masificación arruina la experiencia, se llega con el primer tren o a la hora de apertura, nunca a media mañana.
  - **Fushimi Inari** pasa de última hora de la tarde a **primer tren del jue 20**.
  - Nijō pasa al mié 19 por la tarde, para equilibrar los dos días.
  - Al elegir el hotel de Kioto, conviene que esté **cerca de una estación con trenes muy tempranos**. Por ejemplo, la línea Keihan (Gion-Shijō/Shichijō), que va directa a Fushimi-Inari y desde la que se llega a Kiyomizu andando.
  - Dónde se aplica ya: Kiyomizu 6:00, Arashiyama 7:00, Fushimi con el primer tren, Kinkaku-ji 9:00, Kenroku-en 7:00, Shirakawa-go 8:10, mercado de Miyagawa 7:00, Museo Nacional 9:30, Meiji Jingū a primera hora, Asakusa 7:30, museo de Hiroshima en la franja de 7:30.
  - La única excepción es Tōdai-ji (Nara), que va a **última hora**: es la estrategia inversa, porque el vie 21 por la mañana manda el mercadillo de Tō-ji.
- **Lunes 10:** se reordena el día para que cada sitio caiga a su mejor hora: Meiji Jingū temprano, Shibuya Sky al atardecer y Shinjuku de noche. **Shibuya Sky y Skytree** van con entrada comprada con antelación (el usuario está de acuerdo).
- **Viernes 14:** se descarta **Myōryū-ji**, el templo ninja, porque solo se visita con guía y reserva, y el grupo prefiere ir a su aire. La tarde queda libre.
- **Sábado 15:** se añade el **Yatai Kaikan**, el museo de las carrozas del Festival de Takayama, con el santuario Sakurayama Hachimangū, antes de Sanmachi.
- **Lunes 24:** se añade el **Umeda Sky Building al atardecer**, con una pausa en el hotel antes. Si volvéis de Hiroshima con energía, se puede adelantar al domingo 23: Umeda está a una parada de Shin-Osaka.
- **Martes 18:** se añade el norte de Higashiyama (Nanzen-ji, Camino del Filósofo, Ginkaku-ji) al paseo de Kiyomizu y Gion.
- **Sumo:** sigue descartado (decisión de junio de 2026). La entrada "pendiente" de `decisiones-confirmadas` está desactualizada.
- **Jueves 27:** Fukagawa + ~~Odaiba~~ **Nakano Broadway**. Odaiba se sustituye en la revisión del 12 nov 2026: el usuario quiere tiendas friki en Tokio (figuras, anime, manga, retro). Kamakura ya se había sustituido en junio de 2026, así que el texto de `itinerario-ruta-redonda-v1.md` está desactualizado.
- **Criterios para elegir hoteles** (el hotel es solo para dormir):
  - **Tokio, bloque 1:** en Ueno.
  - **Tokio, bloque 2:** en Asakusa.
  - **Kioto: en Shichijō** (decidido). Está en la línea Keihan, a 3 paradas de Fushimi Inari, y cerca de la estación de Kioto para los días con maletas. Es más barato que Gion. Detalle en [zonas-hoteles-2027.md](zonas-hoteles-2027.md).
  - **Lavandería de monedas en el propio hotel, obligatoria** en **Kanazawa, Kioto y Osaka**.
  - **Tres coladas, sí o sí:**

    | Colada | Cuándo | Dónde | Día del viaje |
    |---|---|---|---|
    | 1 | Viernes 14 por la tarde (libre) | Kanazawa | día 7 |
    | 2 | Jueves 20 por la tarde (libre) | Kioto | día 13 |
    | 3 | Lunes 24 (día tranquilo) | Osaka | día 17 |

    El tramo más largo sin lavar es de 7 días (del 8 al 14), así que hay que **llevar ropa para unos 7 días**.
- **Tiendas friki en Tokio:** Shibuya Parco el lun 10, Akihabara toda la tarde del mar 25 y Nakano Broadway el jue 27. Extra opcional: Den Den Town (Osaka), junto a Kuromon, el lun 24.
- **Web:** no se toca hasta que esté todo cerrado (itinerario, hoteles, etc.). Será el último paso. En ese momento:
  - Las ilustraciones por día (`illustrationKind.ts`) tendrán que seguir a su contenido.
  - El domingo 16 se queda sin dibujo propio.

## 4. Errores o desfases en los datos actuales del proyecto

| Dato en el repo | Realidad verificada |
|---|---|
| Itinerario del 9 al 29 de mayo, llegada 12:45, vuelta a las 18:00 | Del 8 al 28; llegada 09:30; vuelta a las 11:20 |
| Tō-ji el día de llegada a Kioto | El mercadillo es el **día 21** |
| Jardines del Este: 9:00–16:30 | **9:00–18:00** del 15 de abril al 31 de agosto (cierra lunes y viernes) |
| Lanzadera de Takaragawa: ~30 min | **~45 min**; hacia el ryokan a las 13:00 y 15:00, hacia la estación **solo a las 9:30**; reserva por teléfono |
| Takaragawa, visitantes de día 9:00–16:00 | **10:00–16:30** |
| Museo de la Paz de Hiroshima: 8:30–18:00 | **7:30–19:00** (de marzo a julio); reserva online obligatoria para 7:30–8:30 y 17:30–18:30 |
| Marushichi cierra el miércoles | Una fuente sin fecha dice **lunes y martes**. Confirmar en sus redes |
| Mercado de Miyagawa desde las 6:00 | **7:00–12:00** |
| Kamogawa Odori del 1 al 24 de mayo | En 2026 fue del **5 al 22 de mayo**; las fechas de 2027 aún no se han publicado |
| Sumo "eliminado" en un documento y "pendiente" en otro | Las fechas oficiales son del **9 al 23 de mayo de 2027**; habría que unificar la decisión |
| Tramo Takayama–Toyama "con interrupciones" | Reabierto el 30 de mayo de 2026, pero solo con **4 trenes Hida al día** |

**Otros datos nuevos:**
- El Museo del Siglo XXI de Kanazawa está **cerrado de mayo de 2027 a marzo de 2028**.
- El torreón del castillo de Hiroshima está cerrado desde marzo de 2026.
- Tōdai-ji cuesta **800 ¥ y solo se paga en efectivo**.
- El castillo de Osaka cuesta 1.200 ¥.
- La tasa turística de Kioto subió en marzo de 2026: son 400 ¥ por persona y noche en habitaciones de 6.000 a 20.000 ¥.
- En Shirakawa-go hay menos buses el fin de semana.
- No hay festivos nacionales entre el 6 y el 31 de mayo de 2027.

## 5. Pendiente de confirmar más adelante

- **Kanda Matsuri 2027:** el año es de festival grande. La estimación (no oficial) es el desfile el sábado 8 y los mikoshi el domingo 9. La alternativa sería el 15 y 16. El santuario suele publicar el programa en primavera.
- **Sanja Matsuri:** del 14 al 16 de mayo (oficial). Estaremos en Kanazawa y Takayama, así que no coincide.
- **Horarios de Hida y Nōhi para 2027:** comprobarlos después del cambio de horarios de marzo de 2027.
- **Osenkaku:** preguntar directamente por los tatuajes y por la diferencia de precio en sábado.
- **Tarjeta IC (Suica o ICOCA) para cada viajero:** el autobús a Katsuo-ji ya no acepta efectivo. También sirve para metro, trenes locales y consignas. Se puede llevar en el móvil (Suica en Apple Wallet) o comprar la Welcome Suica física.
- **LH711:** Lufthansa lo anuncia como vuelo de temporada de verano 2027. Revisar la reserva cerca de la fecha por si cambia el horario.

## 6. Fuentes principales

- Museo Nacional de Tokio: https://www.tnm.jp/modules/r_free_page/index.php?id=113&lang=en
- Jardines del Este: https://www.kunaicho.go.jp/event/higashigyoen/higashigyoen.html
- Miradores del Gobierno Metropolitano: https://www.zaimu.metro.tokyo.lg.jp/tochousha/goannai/tenbou
- Ginza peatonal: https://www.ginza.jp/?p=19921
- Sensō-ji: https://www.senso-ji.jp/guide/guide02.html
- Sanja Matsuri 2027: https://www.asakusajinja.jp/sanjamatsuri/schedule/
- Sumo: https://www.sumo.or.jp/Admission/schedule/
- Festivos 2027: https://eco.mtk.nao.ac.jp/koyomi/yoko/2027/rekiyou271.html
- Viajes escolares: https://www.travelvoice.jp/20241115-156636 · https://www.city.hiroshima.lg.jp/uploaded/attachment/16600.pdf
- Lufthansa en Japón: https://www.lufthansa.com/jp/en/local-page/schedule-for-japan-routes
- Skyliner: https://www.keisei.co.jp/keisei/tetudou/skyliner/us/traffic/skyliner_fares.php
- Takaragawa: https://takaragawa.com/kotu.html · https://takaragawa.com/higaeri.html
- Tren Hida: https://jr-group.jp/hida-timetable/ · https://jr-central.co.jp/news/release/_pdf/000045604.pdf
- Bus Nōhi a Shirakawa-go: https://nouhibus.co.jp/route_bus/shirakawago_en/
- Kenroku-en: https://shiro-niwa.pref.ishikawa.lg.jp/kenrokuen-garden/info.html
- Kiyomizu-dera: https://kiyomizudera.or.jp/visit/open.php
- Nijō-jō: https://nijo-jocastle.city.kyoto.lg.jp/guide/annai/?lang=en
- Kamogawa Odori: https://kamogawa-odori.com
- Tōdai-ji: https://todaiji.or.jp/information/haikan/
- Museo de la Paz de Hiroshima: https://hpmmuseum.jp
- Tasa turística de Kioto: https://ja.kyoto.travel/news/format.php?id=532
- Consignas de Kintetsu: https://www.kintetsu.co.jp/foreign/english/coinlocker/
