# Design — itinerary-web

> Change: `itinerary-web` · Project: japan-2027 · Phase: DESIGN · Date: 2026-06-16
> Status: designed · Artifact store: openspec
> Reads: `proposal.md`, exploration (Engram `sdd/itinerary-web/explore` #264)

## 0. Verification status (post-cutoff stacks)

Vite 8, TS6, ESLint 10, Tailwind v4, React Router v7 and MapLibre/@vis.gl/react-maplibre are **posteriores al cutoff del modelo**. This design relies on the **verified sources collected during the explore phase** (engram #264, dated June 2026, with official URLs). Each API call below is tagged:

- **[VERIFIED-explore]** — source URL captured during exploration (treat as authoritative for design; re-confirm exact symbol names at apply time).
- **[CONFIRM-apply]** — must be re-checked against official docs via WebSearch/WebFetch during `sdd-apply` before writing the line of code, because the exact symbol/option name is version-sensitive and could not be pinned at design time.

Nothing here invents config. Where I am not certain of the exact identifier, I mark it **[CONFIRM-apply]** rather than asserting it.

---

## 1. Arquitectura general

### Patrón
**SPA cliente-puro, sin SSR**, feature-sliced. Data Mode de React Router v7 (`createBrowserRouter`) como columna de navegación; cada feature es una rebanada vertical autocontenida (UI + lógica + datos de presentación). Los datos del viaje son **constantes TS tipadas** (no I/O en runtime, no fetch, no markdown parsing). El único estado mutable es el de **notas del usuario** (Zustand + persist).

Rationale: el dominio es de lectura casi total (itinerario fijo) con una única superficie de escritura (notas). Eso hace innecesario un store global de datos; los datos viven como módulos importados y el árbol de componentes los consume directamente. Solo las notas necesitan reactividad + persistencia, y eso se aísla en `features/notes`.

### Capas (de fuera hacia dentro)
```
Routing (router.tsx)              ← define rutas, lazy-loads de features
  └─ Layout (components/)         ← shell: header, nav responsive, <Outlet/>
       └─ Feature pages           ← map | itinerary | zone | notes
            └─ Feature components  ← presentacionales
                 └─ data (src/data)← fuente de verdad de lectura (tipada)
                 └─ store (notes)  ← única escritura (zustand persist)
```

### Boundaries (reglas de dependencia)
- `features/*` puede importar de `data/`, `components/`, `hooks/`, `lib/`.
- `features/*` **NO** importa de otra `features/*` salvo a través de tipos en `data/` (acoplamiento solo por datos, no por componentes). Excepción controlada: `features/notes` expone un hook (`useNotes`) que `itinerary` y `zone` consumen — es un servicio transversal, documentado como tal.
- `data/` **no importa de nada** del runtime de la app (hoja del grafo). Solo tipos y constantes.
- `components/` (UI compartida) no conoce features ni datos del viaje — recibe todo por props.
- El proveedor de mapa (MapLibre) queda **confinado a `features/map`**. Ningún otro módulo importa `maplibre-gl` ni `@vis.gl/react-maplibre`. Esto materializa la reversibilidad del ADR-001.

### Estructura de carpetas
```
src/
  main.tsx                 # createRoot + RouterProvider
  router.tsx               # createBrowserRouter([...]) (Data Mode)
  index.css                # @import "tailwindcss" + @theme japonés + fuentes
  data/
    types.ts               # tipos del dominio (Day, Zone, City, TimeSlot, RoutePoint)
    cities.ts              # City[] (slug, nombre, centro [lng,lat])
    itinerary.ts           # Day[] (los 21 días, mañana/tarde)
    zones.ts               # Zone[] (fichas SIN description)
    route.ts               # derivación GeoJSON LineString de la ruta global
    index.ts               # barrel + helpers de lookup (getDay, getZone, zonesByCity)
  features/
    map/
      GlobalMap.tsx        # mapa de ruta (ciudades + LineString)
      ZoneMiniMap.tsx      # mini-mapa de una zona (1 marcador)
      mapStyle.ts          # estilo OpenFreeMap + overrides de paleta
      useMapInstance.ts    # (si hace falta) init imperativo aislado
    itinerary/
      ItineraryView.tsx    # /itinerario : lista de los 21 días
      DayView.tsx          # /dia/:dayId : un día con bloques
      TimeSlotBlock.tsx    # bloque mañana|tarde con sus zonas
      DayCard.tsx          # tarjeta-resumen de un día (en la lista)
    zone/
      ZonePage.tsx         # /zona/:citySlug/:zonaSlug
      ZonePractical.tsx    # info práctica (cómo llegar, horario, notas) sin spoilers
    notes/
      notesStore.ts        # zustand + persist (localStorage)
      useNotes.ts          # hook de lectura/escritura por sectionId
      NotesPanel.tsx       # UI de notas (textarea + autosave)
      ImportExport.tsx     # export/import JSON
  components/
    Layout.tsx             # shell + nav + Outlet
    Nav.tsx                # navegación responsive (desktop bar / mobile drawer)
    Card.tsx  Button.tsx  Tag.tsx  PageHeader.tsx
  hooks/
    useMediaQuery.ts       # responsive sin libs
  lib/
    geo.ts                 # helpers GeoJSON (buildRouteLineString, fitBounds)
  test/
    setup.ts               # import '@testing-library/jest-dom'
    maplibre-mock.ts       # mock de maplibre-gl + canvas para jsdom
```

### Alias `@/`
`@/` → `src/`, declarado **dos veces y en sync**: `resolve.alias` en `vite.config.ts` y `compilerOptions.paths` en `tsconfig.app.json`. Rationale: Vite resuelve en build/dev; TS resuelve para typecheck (`tsc -b`) y para el editor. Si solo se pone en uno, o el build o el typecheck rompe. Alternativa `vite-tsconfig-paths` (mencionada en explore) — **descartada** para evitar una dependencia más; dos entradas declarativas son triviales de mantener.

---

## 2. ADR-001 — Librería de mapas

### Estado
**Aceptada** (formaliza el resumen del proposal). **Reversible.**

### Contexto
La feature de mapa global (ciudades como marcadores + línea de ruta) y los mini-mapas por zona necesitan: mapa interactivo, marcadores, una polilínea de ruta, gratis, sin fricción de cuenta, estilizable a la identidad japonesa, y que funcione en escritorio (presentación) y móvil (consulta en viaje).

### Decisión
**MapLibre GL JS + `@vis.gl/react-maplibre` + tiles de OpenFreeMap.**

- Render vectorial WebGL, sin API key, sin facturación. **[VERIFIED-explore]** OpenFreeMap `https://openfreemap.org` (100% gratis, sin key).
- Wrapper React declarativo. **[VERIFIED-explore]** `https://visgl.github.io/react-maplibre/docs/get-started` — paquete `@vis.gl/react-maplibre`, peer `react >= 16.3` (React 19 OK).
- Ruta como capa **GeoJSON** (`Source` type `geojson` + `Layer` type `line`), geometría `LineString`. **[VERIFIED-explore]**
- Estilo de mapa personalizable hacia la paleta sumi/washi (carreteras tono sakura, fondo washi en modo claro).

#### Integración (a confirmar símbolos exactos en apply)
Paquetes: `maplibre-gl` (motor) + `@vis.gl/react-maplibre` (wrapper). **[VERIFIED-explore]**

- El CSS de MapLibre debe importarse una vez: `import 'maplibre-gl/dist/maplibre-gl.css'`. **[CONFIRM-apply]** (ruta del CSS dentro del paquete).
- Componente raíz `<Map>` de `@vis.gl/react-maplibre`, con `mapStyle` apuntando al JSON de estilo de OpenFreeMap (p. ej. `https://tiles.openfreemap.org/styles/liberty`) o un estilo propio derivado. **[CONFIRM-apply]** (nombre exacto de la prop: `mapStyle` vs `styleUrl`, y URL exacta del estilo).
- Marcadores de ciudad: componente `<Marker longitude lat>` del wrapper. **[CONFIRM-apply]** (nombres de props `longitude`/`latitude`).
- Ruta: `<Source type="geojson" data={routeFeature}>` con `<Layer type="line" paint={{ 'line-color': ..., 'line-width': ... }} />`. **[CONFIRM-apply]** (forma de las props `Source`/`Layer` en la versión instalada).
- Encaje inicial de cámara: `initialViewState` (centro Japón, zoom ~5) y/o `fitBounds` sobre los bounds de las ciudades. **[CONFIRM-apply]**.

> **React Compiler gotcha (crítico):** MapLibre es imperativo. El wrapper `@vis.gl/react-maplibre` lo declarativiza, así que **se prefiere la API declarativa de componentes** (`<Map> <Marker> <Source> <Layer>`), que es pura y compatible con el compilador. Si en algún punto se necesita acceso imperativo al objeto mapa (p. ej. `fitBounds` animado), se hará dentro de `useEffect` con la instancia guardada en un **`ref`**, NUNCA en estado, y NUNCA con `useMemo`/`useCallback` manuales (los prohíbe el compilador). Si el compilador da falsos positivos con el wrapper, escape hatch temporal `'use no memo'` documentado como deuda.

### Integración complementaria CONFIRMADA — Google Maps para sitios puntuales (decisión del usuario, 16-jun-2026)
**Enfoque híbrido.** El **mapa global interactivo del recorrido NO usa Google Maps** (lo cubre MapLibre, arriba — Google Maps como proveedor de ese mapa queda descartado por la facturación obligatoria desde mar-2025). PERO para los **sitios/puntos concretos** del itinerario (zonas, templos, barrios) SÍ se integra Google Maps, por su utilidad práctica durante el viaje (reseñas, navegación, Street View, horarios reales):

- **Enlace "Ver en Google Maps"** por sitio: URL tipo `https://www.google.com/maps/search/?api=1&query=<lat>,<lng>` (o `?query=<nombre+lugar>`). **NO requiere API key ni facturación.** **[CONFIRM-apply]** (formato de URL vigente).
- **Iframe embebido** opcional en la página de zona: `https://www.google.com/maps?q=<query>&output=embed` (sin key) o Maps Embed API (key gratuita, fuera de facturación). **[CONFIRM-apply]** (método sin facturación vigente).
- Encaja con `Zone.coordinates` `[lng,lat]` ya previstas y **NO añade dependencia npm** (iframe/enlace nativos). Componente aislado `features/zone/GoogleMapsLink.tsx` (+ `GoogleMapsEmbed.tsx` opcional).
- Tarea asociada en la fase de página de zona (fase 3).

> **Reversibilidad:** el proveedor del mapa global está confinado a `features/map/`; las coordenadas `[lng, lat]` en `data/` son agnósticas. El uso de Google Maps para sitios es **aditivo y aislado** (componente de enlace/embed), no toca el mapa global.

### Alternativa considerada — react-leaflet v5
API más simple, pero raster por defecto, menor rendimiento en móvil y estilizado vectorial limitado (peor para una identidad visual fuerte). Descartada por la prioridad "vistoso en escritorio".

### Consecuencia
Acoplamiento al proveedor = 1 carpeta. Datos de zonas/ciudades 100% portables.

---

## 3. Modelo de datos tipado (`src/data`)

Restricciones TS6: **prohibido `enum`** (`erasableSyntaxOnly`) → uniones literales / `as const`. **`import type` obligatorio** (`verbatimModuleSyntax`) para todo lo que sea solo tipo. Coordenadas siempre `[lng, lat]` (orden GeoJSON, no `[lat, lng]`) — convención única para evitar el bug clásico de inversión.

### `data/types.ts`
```ts
// Tupla GeoJSON: SIEMPRE [longitud, latitud]
export type LngLat = readonly [number, number]

// Slots de tiempo como unión literal (NO enum)
export type SlotKey = 'morning' | 'afternoon'

// Ciudad
export interface City {
  readonly slug: string        // 'tokio', 'kioto', 'osaka', 'kanazawa'...
  readonly name: string        // 'Tokio'
  readonly center: LngLat      // centro para encuadre del mapa
}

// Referencia ligera a zona desde el itinerario (sin duplicar la ficha)
export interface ZoneRef {
  readonly zoneId: string      // -> Zone.id
}

// Bloque mañana/tarde de un día
export interface TimeSlot {
  readonly key: SlotKey
  readonly label: string       // 'Mañana' | 'Tarde'
  readonly summary: string     // explicación BREVE sin spoilers (qué es, no qué se ve)
  readonly zones: readonly ZoneRef[]
}

// Día del itinerario
export interface Day {
  readonly id: number          // 1..21 (estable; ruta /dia/:dayId)
  readonly date: string        // ISO 'YYYY-MM-DD' (2027-05-09 ...)
  readonly citySlug: string    // -> City.slug
  readonly title: string       // 'Tokio · bloque 1 — Día de llegada'
  readonly slots: readonly TimeSlot[]  // normalmente [morning, afternoon]
}

// Ficha de zona — SIN campo `description` (regla anti-spoilers a nivel de tipos)
export interface Zone {
  readonly id: string          // 'shibuya', 'gion-centro'...
  readonly name: string        // 'Shibuya'
  readonly citySlug: string    // -> City.slug
  readonly coordinates: LngLat // [lng, lat] para el mini-mapa
  readonly tags: readonly string[]   // ['comercial','otaku','iconico']
  readonly practical: ZonePractical  // info logística, NO spoilers
}

// Info práctica sin spoilers: cómo llegar / horario / notas logísticas
export interface ZonePractical {
  readonly access?: string         // 'JR Yamanote / Metro Ginza — salida Hachiko'
  readonly hours?: string          // 'Tiendas 10:00–21:00 (orientativo)'
  readonly logistics?: readonly string[]  // ['Combina con Harajuku a 15 min a pie', ...]
}
```

#### Regla anti-spoilers a nivel de tipos (decisión clave)
`Zone` **no tiene `description`**. El compilador impide que alguien añada un texto que destripe lo que se ve. Lo único "narrativo" permitido es `TimeSlot.summary` ("qué es el sitio") y `ZonePractical` (logística). Convención de redacción documentada para tasks: summary describe **categoría y encaje** ("epicentro comercial juvenil, cruce icónico"), nunca el contenido sorpresa. Esto es la materialización de la restricción de producto innegociable.

> **Nota sobre la fuente `docs/`:** los markdown (p.ej. `shibuya.md`) **sí** contienen descripciones detalladas y spoilers. La transcripción a `data/` debe **destilar solo** nombre + tags + práctica, descartando el contenido narrativo. Esto es trabajo de contenido manual y propenso a fugas de spoiler → debe verificarse en `verify`.

### `data/route.ts` — ruta global como GeoJSON LineString
La ruta del viaje es la secuencia ordenada de centros de ciudad. Se deriva, no se hardcodea la geometría:

```ts
// orden de la ruta redonda (Tokio → Onsen → Alpes → Kioto → Osaka → Tokio)
export const routeOrder: readonly string[] = [
  'tokio', 'takaragawa', 'kanazawa', 'takayama', 'kioto', 'osaka', 'tokio',
] as const
```

`lib/geo.ts` expone `buildRouteLineString(cities, routeOrder): GeoJSON.Feature<GeoJSON.LineString>` que mapea cada slug a su `center` y construye `{ type:'Feature', geometry:{ type:'LineString', coordinates: LngLat[] } }`. Esta `Feature` se pasa directamente a `<Source type="geojson" data={...}>`.

> **Tolerancia al tramo abierto (Open Question 5):** el orden `Kanazawa↔Takayama` sigue **pendiente** en la fuente. `routeOrder` es un array editable; cambiar el orden re-traza la línea sin tocar componentes. La ruta redonda vuelve a `tokio` al final (regla de oro del redondo). Se marca en datos que ese tramo es provisional.

> **Coordenadas de zonas (Open Question 4):** las fichas tienen ubicación en texto, no `[lng,lat]`. Decisión de diseño: el **mapa global** funciona solo con `City.center` (8-ish puntos, geocodificables a mano sin esfuerzo). Las **coordenadas de zona** son opcionales en el piloto: `Zone.coordinates` se rellena durante la transcripción; el `ZoneMiniMap` se renderiza solo si la zona tiene coordenadas. Esto desbloquea el MVP sin geocodificar 39 fichas de golpe.

### Lookups (`data/index.ts`)
Helpers puros: `getDay(id)`, `getZone(id)`, `getCity(slug)`, `zonesByCity(slug)`, `zonesForDay(dayId)`. Sin estado, testeables trivialmente. El routing usa estos para resolver params.

---

## 4. Sistema de diseño japonés

### Tokens en Tailwind v4 `@theme` (en `index.css`)
**[VERIFIED-explore]** Tailwind v4: `@import "tailwindcss"` + bloque `@theme { --color-*: ... }`, sin `tailwind.config.js`. Plugin `@tailwindcss/vite`. Source: `https://tailwindcss.com/docs`.

```css
@import "tailwindcss";

@theme {
  /* Tinta y papel — base sobria, "vacío" (ma) */
  --color-sumi-900: oklch(0.18 0.01 270);  /* tinta casi negra */
  --color-sumi-700: oklch(0.32 0.01 270);
  --color-washi-50: oklch(0.97 0.012 90);  /* papel washi cálido */
  --color-washi-100: oklch(0.94 0.015 85);
  /* Acentos estacionales — usados con MUCHA mesura */
  --color-sakura-400: oklch(0.80 0.07 10);  /* flor de cerezo */
  --color-matcha-500: oklch(0.62 0.10 145); /* verde té */
  --color-urushi-600: oklch(0.45 0.13 25);  /* laca roja/bermellón (torii) */
  --color-indigo-700: oklch(0.40 0.10 255); /* ai / índigo */

  /* Tipografía */
  --font-display: "Zen Old Mincho", "Shippori Mincho", serif; /* mincho con carácter */
  --font-sans: "Zen Kaku Gothic New", system-ui, sans-serif;  /* gótica limpia, legible móvil */

  /* Radios y sombras suaves (papel, no material design) */
  --radius-paper: 2px;
}
```
**[CONFIRM-apply]** nombres exactos de las fuentes en Google Fonts y la sintaxis de `@theme` para fuentes (`--font-*`) en la versión instalada de Tailwind v4. **[CONFIRM-apply]** valores oklch finos tras prueba visual.

Rationale de la paleta: **sumi-e** (tinta) + **washi** (papel) como base neutra de alto contraste y legibilidad (clave en móvil a pleno sol). Los acentos (sakura/matcha/urushi/ai) salen del vocabulario cromático japonés real, **no** del cliché rojo+blanco de bandera. Mesura: acentos solo en estados/CTA/líneas de ruta, nunca como fondos planos — la elegancia viene del vacío (ma), no de saturar.

### Tipografía
- **Display (mincho/serif con remates):** títulos de día/zona, hero. Da carácter editorial japonés.
- **Sans gótica:** cuerpo e info práctica — máxima legibilidad en móvil.
- Fuentes Google Fonts japonesas (Zen family) que incluyen glifos latinos: sirven para el contenido en español sin cambiar de familia.

### Principios visuales
1. **Ma (espacio vacío):** márgenes generosos, una idea por bloque. No densidad de dashboard.
2. **Ancho completo, no centrado estrecho:** secciones full-bleed (mapa, hero) que aprovechan la pantalla grande de la presentación; el contenido textual sí limita su medida de lectura.
3. **Acento estacional sutil:** una línea sakura, un sello urushi como bullet, separadores tipo trazo de pincel — detalles, no decoración pesada.
4. **Animaciones de entrada/scroll con `motion`** (`import { motion } from "motion/react"` **[VERIFIED-explore]** `https://motion.dev/docs/react-installation`, React 19 OK): fades y slides cortos al entrar en viewport. Respetan `prefers-reduced-motion`. Sutiles, nunca distraen del contenido.

### "Vistoso en escritorio" + "usable en móvil" sin plantilla genérica
- **Desktop:** mapa global full-bleed como héroe, navegación horizontal, tipografía display grande, layout en columnas para la lista de días → impacto de presentación.
- **Móvil:** mismo contenido en columna única, nav colapsada en drawer, mapa con altura acotada y gestos táctiles (MapLibre soporta touch nativo), botones grandes para dedos, info práctica primero (es lo que se consulta en viaje).
- **Lo que evita la plantilla:** paleta sumi/washi + tipografía mincho + ma + detalles de sello/trazo. Una "plantilla de viaje" genérica usaría cards uniformes con sombras material y azul corporativo; aquí la jerarquía es editorial y el cromatismo es cultural.

Responsive con utilidades Tailwind (`sm: md: lg:`) + un hook `useMediaQuery` puntual para el toggle desktop-bar / mobile-drawer de la nav (decisión estructural, no solo CSS).

---

## 5. Estado / persistencia (`features/notes`)

### Store Zustand v5 + `persist`
**[VERIFIED-explore]** Zustand v5, middleware `persist` sobre localStorage. **[CONFIRM-apply]** import path exacto del middleware (`zustand/middleware`).

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const SCHEMA_VERSION = 1

interface NotesState {
  notes: Record<string, string>   // sectionId -> texto libre
  setNote: (sectionId: string, text: string) => void
  clearNote: (sectionId: string) => void
  exportJSON: () => string
  importJSON: (raw: string) => { ok: boolean; error?: string }
}
```

- **sectionId convención:** `day:{id}` y `zone:{id}` → una nota por día o por zona. Estable y legible en el JSON exportado.
- `persist` con `name: 'japan2027-notes'`, `version: SCHEMA_VERSION` y `migrate` que descarta/transforma si cambia el shape (rollback plan: "persistencia segura ante versiones").
- **Export/Import JSON** (Open requirement del proposal): `exportJSON()` serializa `{ version, notes }`; descarga vía `Blob` + `<a download>`. `importJSON()` valida `version` y forma antes de fusionar (merge sobre las notas existentes, no overwrite ciego; conflicto = el importado gana, documentado). Sirve para respaldo y para compartir notas entre dispositivos del grupo (sustituye a la sync en la nube, que está fuera de alcance).
- **React Compiler:** Zustand expone hooks puros; sin `useMemo`/`useCallback` manuales. Selectores como funciones inline son OK.

`useNotes(sectionId)` envuelve el selector y el setter con autosave (debounce ligero en el componente, no en el store). `itinerary` y `zone` consumen `useNotes` — único cruce inter-feature permitido (servicio transversal).

---

## 6. Routing (`router.tsx`)

**[VERIFIED-explore]** React Router v7 Data Mode, `createBrowserRouter`. Source: `https://reactrouter.com/start/modes`. **[CONFIRM-apply]** paquete exacto (`react-router-dom` vs `react-router` en v7) y firma de `createBrowserRouter` / `RouterProvider` en la versión instalada — en v7 hubo unificación de paquetes.

| Ruta | Componente | Propósito | Params |
|---|---|---|---|
| `/` | `Home` | Hero + mapa global embebido + entrada a días | — |
| `/itinerario` | `ItineraryView` | Los 21 días (lista/columnas) | — |
| `/dia/:dayId` | `DayView` | Un día: bloques mañana/tarde + zonas + notas | `dayId` → `getDay(Number)` |
| `/zona/:citySlug/:slug` | `ZonePage` | Ficha de zona: práctica + mini-mapa + notas | `citySlug`,`slug` → `getZone` |
| `/mapa` | `MapPage` | Mapa global a pantalla completa | — |

- Todas bajo un **layout raíz** (`Layout` con `<Outlet/>`), nav común.
- **Code splitting:** features pesadas (las que cargan MapLibre: `/mapa`, `/` con mapa, `ZonePage` con mini-mapa) se cargan con `lazy` para no meter el bundle de MapLibre en el arranque. **[CONFIRM-apply]** mecanismo de lazy en v7 Data Mode (`lazy` en la route object).
- **Params type-safe:** se validan en el componente (`Number(dayId)`, lookup que puede devolver `undefined` → 404 propio). Loaders de RR v7 disponibles pero **no imprescindibles** (datos síncronos en memoria) — se usan solo si simplifican el 404. Decisión: empezar sin loaders (datos en módulo), añadir si hace falta.
- `:dayId` numérico estable (1..21) en vez de slug → el proposal preveía `/dia/:dayId`; se respeta. Las rutas del proposal y este diseño coinciden, salvo que aquí se añade `/itinerario` explícito (la lista) además de `/` (home+mapa), porque mezclar home y lista perjudica la presentación.

---

## 7. Estrategia de testing (Strict TDD)

**[VERIFIED-explore]** Vitest 3 + @testing-library/react + jsdom. `vite.config.ts` bloque `test`: `environment:'jsdom'`, `globals:true`, `setupFiles:['./src/test/setup.ts']`. Source: `https://vitest.dev/config/`.

> **Strict TDD activo** (regla del proyecto): test primero, ver fallar, implementar, ver pasar, refactor. La infraestructura de test se instala **antes** de cualquier feature.

### Orden de testing (lo que se testea primero)
1. **`data/` (lo más fácil y de mayor ROI):** tipos + helpers de lookup (`getDay`, `getZone`, `zonesByCity`) y `buildRouteLineString` (geometría correcta, orden `[lng,lat]`, ruta cerrada). Puro, sin DOM. **Test guardián anti-spoiler:** un test que afirma que `Zone` no expone narrativa de spoiler (a nivel de tipo es estructural; a nivel de dato se puede testear que `summary` no contenga marcadores prohibidos si se define convención).
2. **`features/notes`:** store Zustand (set/clear/export/import, migración de versión, merge en import). localStorage mockeado por jsdom. Alto valor: es la única lógica con estado.
3. **`components/` compartidos:** Layout/Nav (render, toggle responsive con `useMediaQuery` mockeado), Card/Button/Tag.
4. **`features/itinerary` y `features/zone`:** render de un día/zona desde datos, presencia de info práctica, **ausencia de campo description** (anti-spoiler), wiring de notas.
5. **`features/map` (lo último y con mock):** que renderiza marcadores y capa de ruta dados unos datos — **sin** render WebGL real.

### Cómo mockear MapLibre (clave en jsdom)
jsdom no tiene WebGL ni canvas real → MapLibre crashea. Estrategia en `test/maplibre-mock.ts` + `setup.ts`:
- **Mock del módulo** `@vis.gl/react-maplibre`: `vi.mock(...)` que reemplaza `<Map>`, `<Marker>`, `<Source>`, `<Layer>` por stubs que renderizan `data-testid` con sus props serializadas. Así los tests verifican **qué se le pide pintar al mapa** (nº de marcadores, coordenadas, geometría de ruta) sin tocar WebGL.
- Mock mínimo de canvas/WebGL en `setup.ts` (`HTMLCanvasElement.prototype.getContext` → stub) por si algún código toca `maplibre-gl` directamente.
- **[CONFIRM-apply]** nombres exactos de los componentes exportados por `@vis.gl/react-maplibre` para mockearlos bien.
- Rationale: probamos **contrato de datos→mapa**, no la librería de terceros (no es nuestro código). Esto mantiene los tests rápidos y deterministas en CI/jsdom.

---

## 8. Plan de instalación y cambios de config

### Comandos pnpm (exactos)
```bash
# Runtime
pnpm add react-router-dom zustand motion maplibre-gl @vis.gl/react-maplibre
# Estilos
pnpm add -D tailwindcss @tailwindcss/vite
# Testing
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```
**[CONFIRM-apply]** nombre del paquete de React Router en v7 (`react-router-dom` confirmado en explore; verificar que no se unificó a `react-router` a secas). Demás nombres **[VERIFIED-explore]**.

### `vite.config.ts` (diff conceptual — preservar react()+babel del compiler)
```ts
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'   // NUEVO
import { fileURLToPath, URL } from 'node:url'  // para alias

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),  // NO TOCAR — compiler activo
    tailwindcss(),                                 // NUEVO
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },  // NUEVO
  },
  test: {                          // NUEVO (Vitest)
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
```
**[CONFIRM-apply]:** (a) que el plugin `@tailwindcss/vite` se llama así y va en `plugins`; (b) que el bloque `test` de Vitest se acepta en `defineConfig` de Vite (puede requerir `/// <reference types="vitest/config" />` o `defineConfig` de `vitest/config`); (c) orden de plugins respecto a babel del compiler. Todo verificable en apply.

### `tsconfig.app.json` (añadir paths + tipos de test)
```jsonc
{
  "compilerOptions": {
    // ...lo existente (NO tocar verbatimModuleSyntax, erasableSyntaxOnly, strict)...
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] },              // sync con alias de Vite
    "types": ["vite/client", "vitest/globals", "@testing-library/jest-dom"]  // CONFIRM-apply
  }
}
```
**[CONFIRM-apply]** nombres exactos de los `types` de Vitest 3 (`vitest/globals`) y jest-dom.

### `index.css` (reemplaza el scaffold)
```css
@import "tailwindcss";
/* @import de fuentes Zen (Google Fonts) */
@theme { /* tokens de §4 */ }
/* base: html/body washi, font-sans, scroll suave */
```
**[VERIFIED-explore]** sintaxis `@import "tailwindcss"` + `@theme`. Se borran `App.css` y el contenido demo de `App.tsx`/assets del scaffold (proposal §Affected Areas).

---

## 9. Plan incremental (orden recomendado)

Objetivo: web **funcional pronto**, validar UX/diseño con poco contenido antes de transcribir las 39 fichas.

1. **Infraestructura (sin features):**
   - Instalar deps. Configurar `vite.config.ts` (tailwind + alias + test), `tsconfig` paths, `test/setup.ts`.
   - `index.css` con `@theme` japonés. Borrar scaffold demo.
   - Smoke test que arranca y pasa (Strict TDD: hay tests desde el minuto cero).
   - **Router mínimo** + `Layout`/`Nav` + Home placeholder. → la app navega.
2. **Datos + piloto Tokio bloque 1 (días 9–12, ~6 zonas):**
   - `data/types.ts` (+ tests de tipos/helpers primero).
   - `data/cities.ts` (centros geocodificados a mano — pocos puntos).
   - Transcribir **solo** Tokio bloque 1: 4 días + zonas (Asakusa, Shibuya, Harajuku, Shinjuku, Ueno, Yanaka, Ginza, Tsukiji…) destilando **sin spoilers**.
   - `features/itinerary` (`ItineraryView`, `DayView`, `TimeSlotBlock`) + `features/zone` (`ZonePage`, `ZonePractical`). → **vertical slice navegable y vistosa** con contenido real, valida diseño japonés.
3. **Notas (transversal):** `features/notes` store + `NotesPanel` en día y zona + Import/Export. → cierra el loop de uso en viaje.
4. **Mapa global:** `features/map` `GlobalMap` con ciudades + `LineString` de `route.ts`; integrar en Home y `/mapa`. Mini-mapa de zona si hay coordenadas. → el "wow" de la presentación.
5. **Resto de contenido:** transcribir el resto de Tokio + Kioto + Osaka + otras ciudades a `data/` (incremental, una ciudad por vez; cada zona con su test anti-spoiler).
6. **Pulido:** animaciones `motion` de entrada/scroll, `prefers-reduced-motion`, afinado responsive, estados vacíos/404, estilo de mapa a la paleta, rendimiento (lazy de MapLibre).

Rationale del orden: infraestructura primero (Strict TDD lo exige); luego una **rebanada vertical con contenido real mínimo** para validar diseño y UX antes de invertir en transcripción masiva (responde a Open Question 2: **piloto primero**); el mapa va tras tener datos de ciudad porque depende de `cities.ts`; el contenido masivo y el pulido al final porque no bloquean la validación.

---

## 10. Árbol de componentes (runtime)

```
RouterProvider (router.tsx)
└─ Layout
   ├─ Nav  (desktop bar | mobile drawer  ← useMediaQuery)
   └─ <Outlet/>
      ├─ Home
      │   ├─ Hero (motion entrance)
      │   └─ GlobalMap ──────────┐ (lazy: MapLibre)
      │        ├─ <Map>           │
      │        ├─ <Marker> × ciudades
      │        └─ <Source/Layer> (LineString ruta)  ← buildRouteLineString
      │
      ├─ ItineraryView
      │   └─ DayCard × 21  ─→ link /dia/:id
      │
      ├─ DayView ( getDay(dayId) )
      │   ├─ PageHeader (title, date, city)
      │   ├─ TimeSlotBlock × {morning, afternoon}
      │   │     ├─ summary (sin spoiler)
      │   │     └─ ZoneRef chips ─→ link /zona/:city/:slug
      │   └─ NotesPanel (sectionId = day:{id})   ← useNotes
      │
      ├─ ZonePage ( getZone(slug) )
      │   ├─ PageHeader (name, city, Tag×)
      │   ├─ ZonePractical (access/hours/logistics)
      │   ├─ ZoneMiniMap (lazy MapLibre, solo si coordinates) 
      │   └─ NotesPanel (sectionId = zone:{id})  ← useNotes
      │
      └─ MapPage
          └─ GlobalMap (full-screen)

(transversal)  ImportExport  ── notesStore (zustand persist localStorage)
```

---

## 11. Riesgos y decisiones abiertas

- **APIs post-cutoff marcadas [CONFIRM-apply]:** props exactas de `@vis.gl/react-maplibre` (`mapStyle`/`Marker`/`Source`/`Layer`), URL del estilo OpenFreeMap, paquete RR v7 (`react-router-dom`), bloque `test` en Vite 8 (Rolldown), nombres de `types` Vitest, sintaxis `@theme` de fuentes Tailwind v4. **Mitigación:** verificar cada una con WebSearch/WebFetch al inicio de su tarea de apply; ninguna es decisión arquitectónica, solo identificadores.
- **React Compiler × MapLibre imperativo:** riesgo de fricción; mitigado usando la API declarativa del wrapper y aislando cualquier acceso imperativo en `useEffect`+`ref`. Escape hatch `'use no memo'` solo como deuda temporal documentada.
- **Fuga de spoilers en transcripción:** los `docs/*.md` están llenos de descripciones; el riesgo de copiar narrativa al `summary`/`practical` es real. Mitigado por: ausencia de `description` en el tipo + convención de redacción + test guardián + revisión en `verify`.
- **Coordenadas de zona (OQ4):** no estructuradas en la fuente. Diseño tolera ausencia (mini-mapa opcional); mapa global solo necesita centros de ciudad.
- **Orden Kanazawa↔Takayama (OQ5):** sin cerrar; `routeOrder` editable absorbe el cambio sin tocar UI.
- **Reversibilidad Google Maps:** asumida y barata por confinamiento en `features/map` + coordenadas agnósticas. Confirmar con el usuario que MapLibre+OpenFreeMap es aceptado (OQ1) antes de invertir en estilo de mapa.
- **Deploy (OQ6):** fuera del MVP; si va a GitHub Pages habrá que fijar `base` en Vite y usar router con basename. No bloquea; se decide en apply/archive.
- **Idioma UI (OQ3):** MVP solo-ES. El modelo de datos usa `string` plano; bilingüe futuro requeriría `{ es, en }` — cambio acotado a `types.ts`, no se prepara ahora (YAGNI).
```
