# 🤝 Handoff — Contenido del itinerario para el nuevo diseño de la web

> **Para:** el Claude Code que implementa el nuevo diseño de la web del itinerario Japón 2027.
> **Qué encontrarás aquí:** dónde vive cada dato, cómo se relacionan, el itinerario actual día a día, y dónde está el contenido de contexto cultural para colocarlo donde corresponda.
> **Regla nº 1 (no negociable):** lee la sección **"⛔ Regla anti-spoiler"** antes de tocar nada.

---

## 0. Stack y comandos

- **Vite + React 19 + TypeScript 6 + pnpm.** React Compiler activo. Tailwind v4. Estado con Zustand. Mapas: MapLibre GL + `@vis.gl/react-maplibre` (recorrido global) y enlaces a Google Maps (sitios puntuales).
- **Validar siempre antes de dar por bueno un cambio de datos:**
  ```bash
  pnpm test --run      # 176 tests (incluye integridad de datos)
  pnpm exec tsc -b     # typecheck (o: pnpm typecheck)
  ```
- Tests de datos clave en `src/data/__tests__/integrity.test.ts` (anti-spoiler + referencias + coords).

---

## 1. ⛔ Regla anti-spoiler (NOSPOIL) — LEER

La web es de **doble uso**: presentación de escritorio al grupo + consulta móvil. Por diseño **NO se hacen spoilers de la experiencia**:

- **NOSPOIL-01:** el tipo `Zone` **NO tiene campo `description`** — y el test lo verifica. Cualquier intento de añadir narrativa ahí rompe el build.
- **NOSPOIL-04:** `TimeSlot.summary` (en `itinerary.ts`) describe **categoría / contexto** ("qué es / qué tipo de sitio"), **nunca** "lo que verás" ni "lo que no te puedes perder".
- La logística va en `Zone.practical` (acceso, horarios, tips), **sin spoilers**.

### Implicación para ti (importante)
El **contexto cultural** (historia, datos, dato curioso) que el usuario quiere mostrar **es contenido nuevo** y **NO debe meterse en `Zone` ni en `summary`** (rompería NOSPOIL). Vive aparte, en el **dossier** (ver §5). Para integrarlo:
- **Recomendado:** crear una estructura de datos NUEVA (p. ej. `src/data/context.ts`) que mapee `zoneId → ContextEntry[]` (cada POI con `{ nombre, queEs, historia, significado, datoCurioso, fuentes[] }`), tomando el contenido del dossier markdown. Así el contexto se muestra en una sección propia (p. ej. "Contexto / Historia", colapsable) **separada del `summary` anti-spoiler**.
- El usuario decidirá el tratamiento visual; tú decides la forma de los datos. **No** modifiques `types.ts` `Zone` para añadir `description`.

---

## 2. Arquitectura de datos — `src/data/`

| Archivo | Qué exporta | Para qué |
|---|---|---|
| `types.ts` | Tipos: `City`, `Day`, `Zone`, `ZoneRef`, `TimeSlot`, `ZonePractical`, `Transfer`, `TransferMode`, `Excursion`, `LngLat`, `SlotKey` | Modelo de dominio. **`LngLat` es SIEMPRE `[lng, lat]`** (GeoJSON). Sin `enum` (usar uniones `as const`). |
| `cities.ts` | `cities: City[]` | Ciudades + `center` `[lng,lat]` para encuadre del mapa. |
| `route.ts` | `routeOrder: string[]` | Orden de la ruta redonda (slugs). Cerrada: empieza y acaba en `tokio`. Cambiar el array re-traza el mapa sin tocar componentes. |
| `excursions.ts` | `excursions: Excursion[]` | Day-trips fuera de la ruta (Shirakawa-go, Hiroshima) → marcador + línea discontinua en el mapa global. |
| `zones.ts` | `zones: Zone[]` | Unidad de contenido: barrio/sitio. `id`, `name`, `citySlug`, `coordinates`, `tags[]`, `practical`. **Sin `description`.** |
| `itinerary.ts` | `itinerary: Day[]` | Los 21 días (9–29 may). Cada `Day` → `transfers[]` (opcional) + `slots[]` (morning/afternoon), y cada slot referencia zonas por `zoneId`. |
| `index.ts` | Helpers | Ver abajo. |

### Helpers (`src/data/index.ts`) — úsalos, no re-implementes
- `getDay(id)` · `getZone(id)` · `getCity(slug)`
- `zonesByCity(citySlug)` · `zonesForDay(dayId)` → resuelve las zonas de un día
- `buildRouteLineString()` · `buildExcursionLines()` · `excursionCities()` · `getExcursion(id)`

### Modelo `Day` / `TimeSlot` (resumen)
```ts
Day   = { id, date, citySlug, title, transfers?: Transfer[], slots: TimeSlot[] }
TimeSlot = { key: 'morning'|'afternoon', label, summary, zones: { zoneId }[] }
Transfer = { from, to, mode, line?, duration?, roundTrip?, notes?[] }   // logística, sin spoilers
Zone  = { id, name, citySlug, coordinates: [lng,lat], tags[], practical: { access?, hours?, logistics?[] } }
```
La relación es: **`itinerary` referencia `zones` por id**; cada zona pertenece a una `city` (`citySlug`). El test REF-01 obliga a que toda `zoneId` referenciada exista en `zones`.

---

## 3. Itinerario ACTUAL — día a día (días 9–29 may 2027)

Ruta REDONDA por Narita, 20 noches, grupo de 8, eje cultura. `(M)`=mañana `(T)`=tarde. Zonas entre `code`.

| Día | Ciudad (noche) | Mañana | Tarde |
|---|---|---|---|
| 9 dom | Tokio b1 n1 | Llegada Narita → hotel | `asakusa` |
| 10 lun | Tokio b1 n2 | `shibuya` `harajuku-meiji` | `shinjuku` |
| 11 mar | Tokio b1 n3 | `ueno` | `yanaka` |
| 12 mié | Tokio b1 n4 | `palacio-imperial` `tsukiji` | `ginza` |
| 13 jue | Takaragawa n1 | Traslado (transfer) | `takaragawa-onsen` |
| 14 vie | Kanazawa n1 | Traslado | `higashi-chaya` |
| 15 sáb | Kanazawa n2 | `kenrokuen` `kanazawa-castillo` | `nagamachi` `omicho` |
| 16 dom | Takayama n1 | Traslado | `sanmachi-suji` |
| 17 lun | Takayama n2 | `shirakawago-ogimachi` (excursión) | `hida-no-sato` |
| 18 mar | Kioto n1 | `miyagawa-asaichi` `takayama-jinya` (+ traslado) | `kioto-estacion` `toji` |
| 19 mié | Kioto n2 | `kiyomizu-dera` `higashiyama-sannenzaka` | `gion` |
| 20 jue | Kioto n3 | `fushimi-inari` | `arashiyama` |
| 21 vie | Kioto n4 | `kinkakuji` `nijo` | `nishiki` |
| 22 sáb | Osaka n1 | `nara-todaiji` `naramachi` (Nara en ruta) | `dotonbori` |
| 23 dom | Osaka n2 | `katsuo-ji` (excursión daruma) | `dotonbori` (Minami) |
| 24 lun | Osaka n3 | `hiroshima-paz` (excursión) | regreso (sin zona) |
| 25 mar | Osaka n4 | `osaka-castillo` `kuromon` | `shinsekai` (+Den Den opcional) |
| 26 mié | Tokio b2 n1 | Traslado Osaka→Tokio | `akihabara` |
| 27 jue | Tokio b2 n2 | `kiyosumi-fukagawa` (+ comida Marushichi) | `odaiba` |
| 28 vie | Tokio b2 n3 | `asakusa` | `tokyo-skytree` (atardecer) |
| 29 sáb | — | Mañana libre | Traslado a Narita → vuelo 18:00 |

**Excursiones (mapa global, líneas discontinuas):** `shirakawago` (desde Takayama, día 17), `hiroshima` (desde Osaka, día 24). Definidas en `excursions.ts`. *(Katsuo-ji NO es excursión de mapa: es local de Osaka, modelada como zona normal.)*

---

## 4. Zonas (`zones.ts`) por ciudad — 46 en total

- **tokio (14):** `asakusa`, `tokyo-skytree`, `shibuya`, `harajuku-meiji`, `shinjuku`, `ueno`, `yanaka`, `palacio-imperial`, `ginza`, `tsukiji`, `akihabara`, `daikanyama`, `odaiba`, `kiyosumi-fukagawa`
- **takaragawa (1):** `takaragawa-onsen`
- **kanazawa (5):** `higashi-chaya`, `kenrokuen`, `kanazawa-castillo`, `nagamachi`, `omicho`
- **takayama (3):** `sanmachi-suji`, `hida-no-sato`, `takayama-jinya`, `miyagawa-asaichi` *(4, takayama)*
- **shirakawago (1):** `shirakawago-ogimachi`
- **kioto (10):** `kioto-estacion`, `kiyomizu-dera`, `higashiyama-sannenzaka`, `gion`, `fushimi-inari`, `arashiyama`, `kinkakuji`, `nijo`, `nishiki`, `toji`
- **nara (2):** `nara-todaiji`, `naramachi`
- **osaka (5):** `katsuo-ji`, `dotonbori`, `osaka-castillo`, `kuromon`, `shinsekai`
- **hiroshima (1):** `hiroshima-paz`
- **kamakura (3) — NO usadas:** `kamakura-daibutsu`, `hase-dera`, `kamakura-komachi` (Kamakura se descartó; quedan por si se reintroduce; sin ficha en el dossier).

⚠️ **Zona huérfana:** `daikanyama` ya no se referencia en el itinerario (era relleno del antiguo día 28). El test lo permite (solo valida referencias existentes, no zonas sin usar). Decide si la muestras o la ocultas.

---

## 5. Dossier de contexto cultural — `docs/contexto-itinerario/`

Contenido rico por sitio (qué es · historia/datos clave · significado · dato curioso · **fuentes con URL**). Verificado de fuentes oficiales; lo no confirmable va marcado con ⚠️. **Esta es la fuente para el contenido cultural de la web.**

| Archivo | Cubre |
|---|---|
| `00-indice.md` | Índice |
| `tokio.md` | Todo Tokio (bloque 1 + bloque 2) |
| `takaragawa-kanazawa.md` | Takaragawa Onsen + Kanazawa |
| `takayama-shirakawago.md` | Takayama + Shirakawa-go |
| `kioto.md` | Kioto |
| `nara-osaka.md` | Nara + Osaka |
| `hiroshima.md` | Hiroshima |

### Mapeo zona (web) → fichas del dossier (contenido)
Para colocar cada cosa donde corresponde, esta tabla conecta cada `zoneId` con sus fichas en el dossier:

| zoneId | Archivo del dossier | Fichas (POIs) que le corresponden |
|---|---|---|
| `asakusa` | tokio.md | Sensō-ji · Kaminarimon/Nakamise · Asakusa Jinja |
| `tokyo-skytree` | tokio.md | Tokyo Skytree |
| `shibuya` | tokio.md | Cruce de Shibuya · Hachikō |
| `harajuku-meiji` | tokio.md | Meiji Jingū · Yoyogi Park · Takeshita-dōri |
| `shinjuku` | tokio.md | TMG Building (mirador) · Shinjuku Gyoen · Omoide Yokocho · Golden Gai · Kabukichō |
| `ueno` | tokio.md | Museo Nacional de Tokio · Parque de Ueno · Estanque Shinobazu/Benten-dō |
| `yanaka` | tokio.md | Yanaka Ginza · Cementerio de Yanaka · Nezu Jinja · Tennō-ji |
| `palacio-imperial` | tokio.md | Palacio Imperial — Jardín Este |
| `tsukiji` | tokio.md | Tsukiji Outer Market · Tsukiji Honganji |
| `ginza` | tokio.md | Kabuki-za · Edificio Wako/Seiko |
| `akihabara` | tokio.md | Akihabara |
| `daikanyama` | tokio.md | Daikanyama/Nakameguro + río Meguro |
| `kiyosumi-fukagawa` | tokio.md | Jardín Kiyosumi · Fukagawa Edo Museum · Fukagawa Fudō-dō · Tomioka Hachimangū |
| `odaiba` | tokio.md | Estatua de la Libertad + Rainbow Bridge · Fuji TV Building |
| `takaragawa-onsen` | takaragawa-kanazawa.md | Takaragawa Onsen (Ōsenkaku) |
| `higashi-chaya` | takaragawa-kanazawa.md | Higashi Chaya |
| `kenrokuen` | takaragawa-kanazawa.md | Kenroku-en |
| `kanazawa-castillo` | takaragawa-kanazawa.md | Castillo de Kanazawa |
| `nagamachi` | takaragawa-kanazawa.md | Nagamachi · Casa Nomura |
| `omicho` | takaragawa-kanazawa.md | Mercado Ōmichō |
| `sanmachi-suji` | takayama-shirakawago.md | Sanmachi Suji |
| `miyagawa-asaichi` | takayama-shirakawago.md | Mercados matutinos (Miyagawa) |
| `takayama-jinya` | takayama-shirakawago.md | Takayama Jinya |
| `shirakawago-ogimachi` | takayama-shirakawago.md | Shirakawa-go (Ogimachi) |
| `hida-no-sato` | takayama-shirakawago.md | Hida no Sato |
| `toji` | kioto.md | Tō-ji |
| `kioto-estacion` | kioto.md | Higashi Honganji · Nishi Honganji · Kyoto Tower |
| `kiyomizu-dera` | kioto.md | Kiyomizu-dera |
| `higashiyama-sannenzaka` | kioto.md | Sannenzaka / Ninenzaka |
| `gion` | kioto.md | Gion · Hanami-kōji |
| `fushimi-inari` | kioto.md | Fushimi Inari Taisha |
| `arashiyama` | kioto.md | Bosque de bambú de Sagano · Tenryū-ji · Puente Togetsukyō |
| `kinkakuji` | kioto.md | Kinkaku-ji *(+ Ryōan-ji: ficha en kioto.md, sin zona propia — se ve el día 21 mañana)* |
| `nijo` | kioto.md | Castillo Nijō |
| `nishiki` | kioto.md | Mercado Nishiki |
| `nara-todaiji` | nara-osaka.md | Tōdai-ji y Gran Buda · Parque de Nara (ciervos) *(+ Kōfuku-ji, Kasuga Taisha: fichas en nara-osaka.md, sin zona propia)* |
| `naramachi` | nara-osaka.md | Naramachi |
| `dotonbori` | nara-osaka.md | Dōtonbori/Glico · Hōzen-ji |
| `katsuo-ji` | nara-osaka.md | Katsuo-ji (templo de los daruma) |
| `osaka-castillo` | nara-osaka.md | Castillo de Osaka |
| `kuromon` | nara-osaka.md | Mercado Kuromon |
| `shinsekai` | nara-osaka.md | Shinsekai · Tsūtenkaku *(+ Shitennō-ji: ficha en nara-osaka.md)* |
| `hiroshima-paz` | hiroshima.md | Parque Memorial de la Paz · Museo de la Paz · Genbaku Dome |

> Nota: algunas fichas del dossier (Ryōan-ji, Kōfuku-ji, Kasuga Taisha, Shitennō-ji, Higashi/Nishi Honganji) son sitios que se visitan dentro de una zona existente pero no tienen `zoneId` propio. Decide si los agrupas bajo la zona indicada o si creas zonas nuevas.

---

## 6. Estado y pendientes

- ✅ Itinerario y zonas: completos y validados (176 tests + `tsc -b` OK).
- ✅ **Ficha de contexto de `katsuo-ji`**: añadida a `nara-osaka.md`.
- ⚠️ `daikanyama` es zona huérfana (sin uso en itinerario actual).
- ⏳ **Den Den Town** (opcional del día 25): sin ficha de contexto todavía (decidir si se incluye).
- Las zonas de `kamakura` están en `zones.ts` pero no se usan (Kamakura descartado por pacing) y no tienen ficha de contexto.

## 7. Reglas para no romper nada
1. **No** añadas `description` a `Zone` (NOSPOIL-01, rompe test). El contexto cultural va en estructura nueva (§1).
2. **No** metas narrativa/"qué verás" en `TimeSlot.summary` (NOSPOIL-04).
3. `coordinates` y `City.center` son **`[lng, lat]`** (GeoJSON), no al revés.
4. Tras cualquier cambio de datos: `pnpm test --run` + `pnpm exec tsc -b`.
5. El contenido de contexto sale del **dossier** (`docs/contexto-itinerario/`); cítalo, no inventes.
