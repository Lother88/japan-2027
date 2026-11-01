# Plan de migración a Astro — Japón 2027

Plan autocontenido para ejecutarlo en una sesión nueva. Recoge el punto de partida medido, las decisiones
tomadas, el destino, las fases con su criterio de salida y los arreglos de PageSpeed que la migración **no**
resuelve por sí sola.

- Repo: `C:\Users\Usuario\WebstormProjects\japan-2027` (pnpm). Rama base: `main` (desplegada en Render).
- Despliegue: Render **Static Site** «Viaje Japón 2027» (`srv-d8pralb6sc1c73d29ra0`), rama `main`,
  https://viaje-japon-2027.onrender.com. El auto-deploy está **desactivado** en la práctica: tras el merge
  hay que pulsar *Manual Deploy → Deploy latest commit*.
- Pendiente aparte (no mezclar): reajustar el itinerario a las nuevas fechas (salida 7 may, vuelo de vuelta
  28 may; `TRIP_DATES` en `src/data/trip.ts`; los días aún van del 9 al 29). Solo toca `src/data/**`, que
  la migración no cambia, así que puede hacerse antes o después sin conflictos.

---

## 1. Por qué y punto de partida

Medición de PageSpeed Insights (móvil, 1 nov 2026), web publicada con el diseño actual:

| Métrica | Valor | Causa principal |
|---|---|---|
| Rendimiento | **62** | — |
| FCP / LCP | 2,9 s / 2,9 s (LCP = kanji 日本 del hero) | Página vacía hasta que llega y corre el JS; CSS de Google Fonts bloqueante |
| TBT | **1.250 ms** | ~870 ms del mapa (se monta al cargar) + ~840 ms de React pintando la página |
| Speed Index | 5,2 s | Lo anterior |
| CLS | 0 | — |
| Accesibilidad | 96 | Contraste |
| Prácticas recomendadas | 100 (aviso de *source maps*) | — |
| SEO | 90 | Falta `meta description` |

Detalle (del informe guardado y trazas propias):

- **CSS de Google Fonts**: 802 KB sin comprimir / 204 KiB transferidos, **851 `@font-face`** (Shippori Mincho
  500–800 + Zen Kaku Gothic New 400–700 troceadas por rangos CJK). Bloquea el render **2,45 s**; ~648 KiB de
  fuentes en total. Es también el «CSS sin usar 203 KiB» y el «CSS sin minificar 21 KiB».
- **Mapa**: `RouteSection` lo monta con `useNearViewport` (margen 600 px), pero `[data-route-map]` está a
  ~1.369 px en un móvil de 823 px (y ~1.100 px en escritorio): se descarga **siempre** al cargar
  (`HeroMap` 273 KiB, 154 KiB sin usar) y genera tareas largas de 531 + 257 + 81 ms.
- **React**: `index.js` 126 KiB gzip con todo el texto del viaje; tareas largas de ~840 ms al renderizar.
- **DOM**: 8.060 elementos (mucho SVG del arte isométrico).
- **Contraste** (fallan): «MAYO» pequeño de la cabecera de las hojas del calendario, subtítulo coral
  «Tres semanas, / una vuelta completa.», «Tokio» coral del rail y la etiqueta del día activo del rail.

**Objetivo**: rendimiento móvil ≥ 90 (LCP < 2 s, TBT < 200 ms, CLS 0), accesibilidad 100, SEO 100,
prácticas recomendadas 100, sin perder nada del diseño ni del comportamiento actual.

---

## 2. Decisiones

1. **Astro, salida estática** (`output: 'static'`), una sola página `src/pages/index.astro`. Astro 7 usa
   Vite 8 + Rolldown, como ahora. **Exige Node ≥ 22.23.4** (`engines` de astro). Versiones: las más
   recientes de todo (ver §2.1).
2. **Sin React.** La interactividad se reescribe como scripts de TypeScript (`<script>` de Astro, que se
   empaquetan y deduplican). Motivo: casi toda la lógica ya es imperativa sobre el DOM (scroll del rail,
   ToTop, cambio de tema con View Transitions, MapLibre), así que el coste de portarla es bajo y se elimina
   el runtime de React y la hidratación, que es justo el TBT que queda. Se van `react`, `react-dom`,
   React Compiler, `@vitejs/plugin-react`, `@rolldown/plugin-babel`, `@babel/core`.
   *Alternativa descartada*: islas React (`@astrojs/react`, `client:visible`) para mapa/rail/tema. Menos
   reescritura, pero arrastra React (~45 KiB gzip) y su hidratación. Solo reconsiderar si portar el rail se
   complica de verdad.
3. **Sin tests.** Decisión del propietario: web personal para el viaje; QA manual al final (§8). Se eliminan
   todos los tests, su configuración, dependencias y el código que solo existía para ellos.
4. **Puertas automáticas que se mantienen**: `astro check` (tipos) y `astro build`. ESLint solo para `.ts`
   (sin plugins de React); no añadir `eslint-plugin-astro` salvo que haga falta.
5. **Datos intactos**: `src/data/**` se importa tal cual en el frontmatter de los `.astro` (en build).
6. **Arte isométrico**: los `*.markup.ts` siguen siendo generados por `tools/art` (`node tools/art/build-all.mjs`,
   con `--check` para comprobar). **Mantener sus rutas** (`src/features/landing/iso/`, `src/features/landing/hero-art/`)
   para no tocar los generadores, o actualizar `tools/art/import/*` y `tools/art/build-all.mjs` si se mueven.
   Deben seguir siendo **SVG en línea** en el documento (sus `<style>` dependen de `[data-theme]` en `<html>`
   y de las reglas de pausa `[data-art-paused] *` / `[data-illus][data-paused] *`); como `<img>` no funcionan.
7. **Fuentes autoalojadas y recortadas** (no lo arregla Astro, §6): un woff2 por peso con solo los
   caracteres usados, servidos desde `/fonts`, con *preload* de los críticos y las métricas de *fallback*
   que ya existen en `index.css`.
8. **Verificar APIs contra la versión instalada** (`node_modules/astro/…` y su `CHANGELOG`/tipos), no contra
   la web ni la memoria. En particular: objetos en el atributo `style` de `.astro`, `<script>` con
   `is:inline` vs empaquetado, `define:vars`, `Astro.glob`/imports, y si la *Fonts API* de Astro 7 sirve
   para fuentes CJK recortadas (probablemente no: ver Fase 5).

### 2.1 Versiones: siempre las más recientes

Decisión del propietario: **la última versión publicada de cada librería, framework y herramienta**.

- Al empezar la Fase 1, volver a consultar (`npm view <paquete> version`) e instalar con
  `pnpm add <paquete>@latest` (o `-D`); **fijar la versión exacta** en `package.json` (sin `^`) para que el
  build de Render sea reproducible.
- **Excepción, solo si sigue siendo necesaria**: TypeScript. La última es la 7 (compilador nativo), pero a
  1-nov-2026 `@astrojs/check@0.9.12` solo admite `typescript ^5 || ^6` y `typescript-eslint@8.72.1` solo
  `<6.1.0`. Con TS 7, `astro check` (la comprobación de tipos del plan) no funcionaría. Usar **la última 6.x**
  salvo que, al ejecutar, ambos ya admitan la 7; en ese caso, la 7. Comprobarlo con
  `npm view @astrojs/check peerDependencies` y `npm view typescript-eslint peerDependencies`.
- **Saltos de versión mayor que exigen leer el CHANGELOG instalado antes de portar**:
  - **MapLibre GL 5 → 6** (`node_modules/maplibre-gl/CHANGELOG.md`, apartado 6.0.0). El mapa usa: opciones de
    `Map` (`cooperativeGestures`, `attributionControl: { compact }`, `center`, `zoom`), `setStyle`, `Marker`
    con `element` y `anchor`, `NavigationControl({ showCompass })`, `LngLatBounds`, `fitBounds(…, { duration: 0 })`,
    `resize`, `cooperativeGestures.enable/disable` y su CSS (`maplibre-gl/dist/maplibre-gl.css`).
  - **Node**: usar la **última LTS** en `.node-version` (hoy 26.13.0 «Lithium»; cumple `>= 22.23.4`). Comprobar
    en el log del primer despliegue que Render la instala; si no la ofrece, la LTS más alta que ofrezca.
  - **pnpm**: fijarlo con el campo `packageManager` (hoy `pnpm@12.16.1`) para que local y Render coincidan.

Referencia a 1-nov-2026 (volver a consultar al empezar):

| Paquete | Hoy en el repo | Última |
|---|---|---|
| astro | — | 7.4.4 |
| @astrojs/check | — | 0.9.12 |
| typescript | ~6.0.2 | 7.0.2 (usar 6.0.3 por la excepción) |
| tailwindcss / @tailwindcss/vite | ^4.3.1 | 4.3.3 |
| maplibre-gl | ^5.24.0 | **6.16.0** (mayor) |
| eslint / @eslint/js | ^10.3.0 / ^10.0.1 | 10.14.0 / 10.0.1 |
| typescript-eslint | ^8.59.2 | 8.72.1 |
| globals | ^17.6.0 | 17.14.0 |
| subset-font (nuevo, fuentes) | — | 2.9.0 |
| pnpm | — | 12.16.1 |
| Node | — | 26.13.0 LTS |

---

## 3. Estructura de destino

```
astro.config.mjs            # output static, vite: { plugins: [tailwindcss()], resolve.alias @ → src, build.sourcemap }
public/fonts/*.woff2        # fuentes recortadas (generadas por tools/fonts)
public/favicon.svg
src/
  pages/index.astro         # compone la página (mismo orden que App.tsx)
  layouts/Base.astro        # <head>: meta, preload de fuentes, script anti-FOUC del tema, CSS global
  styles/index.css          # el index.css actual (tokens, @theme static, reglas por data-attributes)
  components/               # .astro estáticos (ver §4)
  scripts/                  # comportamiento en TS (ver §4)
  data/                     # sin cambios
  features/landing/iso/*.markup.ts        # arte por día (generado; ruta conservada)
  features/landing/hero-art/*.markup.ts   # arte del hero y spots (generado; ruta conservada)
tools/art/                  # generadores del arte (sin cambios salvo rutas si se mueven)
tools/fonts/                # recorte de fuentes (nuevo, Fase 5)
```

Tailwind v4 se mantiene vía `@tailwindcss/vite` en `astro.config`. **Ojo**: hoy el plugin solo compila
`index.css` porque usa `--theme()` (truco documentado en el propio CSS); comprobar que en Astro se sigue
compilando y que los tokens de `@theme static` existen en el CSS servido.

---

## 4. Mapa de componentes: de React a Astro

| Hoy (React) | Destino | Notas |
|---|---|---|
| `index.html` + `main.tsx` + `App.tsx` | `layouts/Base.astro` + `pages/index.astro` | Conservar: skip-link a `#itinerario`, un único `<main>` (hero, ruta, itinerario), footer fuera de `<main>`, `lang="es"`, script anti-FOUC del tema **en línea** (`is:inline`) en `<head>` |
| `Hero.tsx` | `Hero.astro` + `scripts/hero.ts` | Botones CTA y aviso de scroll → `data-*` + listeners (`scroll.ts` ya tiene la lógica con reduced-motion). Pausa fuera de pantalla con IO |
| `HeroArt.tsx` | `HeroArt.astro` (SVG en línea en build) + script mínimo | Hoy elige viewBox/proporción por `matchMedia('(max-width:760px)')` y pone `data-crop="mobile"`. En estático: renderizar el viewBox de escritorio y un script **en línea justo después** del SVG que cambie viewBox/`aspect-ratio`/`data-crop` antes del primer pintado y escuche `change` |
| `HeroDates.tsx` | `HeroDates.astro` + `scripts/countdown.ts` | Calcular en build y **recalcular en el cliente al cargar** (si no, la cuenta atrás queda congelada en la fecha del build). Quitar la prop `today` (solo era para tests). Helpers de fecha en `src/data/trip.ts`, sin cambios |
| `HeroSpots.tsx`, `LazyIso.tsx` (spots del hero) | `.astro` con SVG en línea | Los 6 spots sobre el pliegue (koyomi, machiya, kippu, maletas, michishirube con su capa `board`, toro-toggle) en línea en build: desaparece `heroChunk` y el plugin `preloadHeroArt` de `vite.config.ts` |
| `LazyIso` diferidos (banda, ruta, omamori) y `illustrations.tsx` (21 días) | Cajas con `aspect-ratio` reservado + `scripts/lazy-art.ts` | IO (margen ~800 px los días, ~600 px banda/ruta/omamori) → `import()` del `*.markup.ts` → `innerHTML`; segundo IO que pone `data-paused`. Mantener `content-visibility:auto` **solo en la caja de la ilustración**, no en la sección |
| `RouteSection.tsx` + `map/HeroMap.tsx` | `RouteSection.astro` + `scripts/map.ts` | Ver PageSpeed: cargar MapLibre **solo cuando la caja del mapa entra en pantalla** (IO con margen 0–150 px), no a 600 px. Portar HeroMap a una clase/función vanilla: instancia única, `setStyle` al cambiar tema, marcadores DOM, gestos cooperativos embebido / rueda directa en pantalla completa, bloqueo de scroll + Esc en pantalla completa, precarga del estilo del otro tema. El tema se observa con `MutationObserver` sobre `html[data-theme]` (ya no hay contexto React) |
| `Journey.tsx` + `useScrollJourney.ts` + `DayRail.tsx` | `Journey.astro` + `DayRail.astro` + `scripts/journey.ts` | El rail ya enlaza con `<a href="#dia-NN">` (funciona sin JS). El estado activo hoy lo pinta React: en estático, **pre-renderizar los 21 bloques de «día activo»** y mostrar uno (atributo `hidden`/`data-active`), y alternar `aria-current="location"` y estilos de los puntos por atributos. Aprovechar para cerrar el pendiente de la auditoría: día activo con **IntersectionObserver** (sin leer geometría en cada scroll) y barra de progreso con **`animation-timeline: scroll()`** donde haya soporte (fallback: el rAF actual, que escribe `transform`). Mantener el control de ToTop (visibilidad + `inert`) |
| `DaySection.tsx`, `SlotBlock.tsx`, `TransferCard.tsx`, `ZoneCard.tsx` | `.astro` estáticos | Mucho `style={{…}}` dependiente de datos (`tokensForCity`, `color-mix`): pasar a `style` en `.astro` (verificar soporte de objetos) o a CSS custom properties por sección. `ZoneCard` usa `<details>` nativo (sin JS). `DaySection` usa `overflow: clip` (no `hidden`) a propósito: lo necesita el parallax `animation-timeline: view()` |
| `Reveal.tsx` | atributo `data-reveal` + CSS + `scripts/reveal.ts` | No ocultar contenido sin JS: un script en línea en `<head>` pone `html.js`; el CSS solo oculta `[data-reveal]` con `.js` y sin reduced-motion; un IO compartido lo revela con el escalonado por lote actual. Un *deep link* `#dia-NN` no debe parpadear (lo que ya está en pantalla al cargar se revela sin animación) |
| `ToTop.tsx` | `ToTop.astro` + listener | Arranca `inert`; lo gobierna `journey.ts` por selector `[data-totop]` |
| `ThemeToggle.tsx`, `ThemeModeProvider.tsx`, `useThemeMode.ts`, `themeTransition.ts` | `ThemeToggle.astro` + `scripts/theme.ts` | Portar `themeTransition.ts` casi tal cual (View Transition + WAAPI sobre `::view-transition-new(root)` + guarda `data-theme-swapping` + fallback sin API + fundido con reduced-motion). Sin `flushSync`: el atributo se cambia dentro del callback de `startViewTransition`. Actualizar `aria-label` («Activar tema oscuro/claro») y `localStorage['jp-theme']`. Guarda anti-doble-clic |
| `SiteFooter.tsx` | `SiteFooter.astro` | El omamori, diferido con `lazy-art.ts` |
| `parallax` del kanji, `<details>` animado, scroll-margin, scrollbar farolillo | CSS (ya lo es) | Sin cambios |

**Comportamientos que hay que conservar** (checklist para la migración):

- [ ] Anclas: `#ruta`, `#itinerario`, `#dia-09` … `#dia-29`; `scroll-margin-top` (0 en escritorio, 64 px ≤ 860 px).
- [ ] Rail: `<nav aria-label="Días del viaje">`, sticky 196 px × 100vh en escritorio; barra compacta de 56 px ≤ 860 px;
  objetivos táctiles ≥ 24 px; rail y lista de días hermanos dentro de `[data-journey]`.
- [ ] Mapa a pantalla completa con `position: fixed; z-index: 1000` **sin portal**: ningún ancestro (`<main>`,
  `[data-route]`, `[data-route-map]` ni envoltorios nuevos) puede tener `z-index`, `transform`, `filter` ni `contain`.
- [ ] Cambio de tema sin estados a medias (guarda `data-theme-swapping`), y el mapa cambia de estilo sin recrearse.
- [ ] Reduced motion: CSS + `scroll.ts` + Reveal + fundido del tema + reglas dentro de cada SVG.
- [ ] Arte: cajas con tamaño reservado (CLS 0), animaciones pausadas fuera de pantalla, capas compuestas del hero
  y del poste (`data-art-layer`), recorte móvil del hero.
- [ ] Calendario `role="img"` con `aria-label` del rango y `<time dateTime>`; cuenta atrás viva.
- [ ] Un solo `<h1>` («Japón»); 日本 y sello `aria-hidden`; `lang="ja"` en kanji.

---

## 5. Limpieza (tests y restos)

Eliminar:

- Tests: `src/data/__tests__/`, `src/features/landing/__tests__/`, `src/features/map/__tests__/`, `src/test/`.
- Configuración: bloque `test` de `vite.config.ts` (el fichero entero desaparece), `types` de tsconfig
  `vitest/globals` y `@testing-library/jest-dom`, scripts `test` y `test:run`.
- Paquetes de test: `vitest`, `@vitest/coverage-v8`, `jsdom`, `@testing-library/react`,
  `@testing-library/jest-dom`, `@testing-library/user-event`.
- Código solo para tests: prop `today` de Hero/HeroDates, `src/lib/contrast.ts`, ramas «sin
  IntersectionObserver / sin rAF / sin WebGL» que solo existían para jsdom (valorar caso a caso).
- Dependencias sin uso hoy: `react-router`, `zustand`, `motion`, `@vis.gl/react-maplibre`.
- Restos: `src/hooks/useMediaQuery.ts`, `src/assets/{hero.png,react.svg,vite.svg}`, `public/icons.svg`
  (comprobar referencias antes de borrar).
- Tras la migración: `react`, `react-dom`, `@types/react*`, `@vitejs/plugin-react`, `@rolldown/plugin-babel`,
  `@babel/core`, `babel-plugin-react-compiler`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`,
  `index.html`, `src/main.tsx`, `src/App.tsx`, `vite.config.ts`, `tsconfig.app.json`/`tsconfig.node.json`
  (sustituidos por el tsconfig de Astro con `paths` `@/*`).

---

## 6. Hallazgos de PageSpeed: qué arregla Astro y qué hay que hacer igualmente

| Hallazgo | ¿Lo arregla la migración? | Acción |
|---|---|---|
| Página en blanco hasta que corre el JS (FCP = LCP) | **Sí** | El HTML sale con el contenido |
| TBT de React renderizando (~840 ms) | **Sí** | Sin React ni hidratación |
| JS sin usar en `index.js` (texto del viaje en el bundle) | **Sí** | El texto va en el HTML |
| **CSS de Google Fonts bloqueante (2,45 s), 204 KiB «CSS sin usar», 21 KiB «sin minificar», ~648 KiB de fuentes** | **No** | Fase 5: fuentes autoalojadas y recortadas, sin CSS de terceros |
| **Mapa cargado al inicio (273 KiB, ~870 ms de tareas largas)** | **No** (el disparador se porta tal cual si no se cambia) | Cargar MapLibre solo cuando la caja del mapa entra en pantalla (margen 0–150 px) |
| **Contraste** («MAYO» del calendario, subtítulo coral, «Tokio» y etiqueta del rail) | **No** | Medir con los colores computados reales en claro y oscuro; usar tokens de texto con AA ≥ 4,5:1 (patrón existente: `--amber-text`, `--coral2-text`); el «MAYO» blanco al 80 % de opacidad a 8–9 px casi seguro falla: quitar la opacidad o subir tamaño/peso |
| **Falta `meta description`** | **No** | En `Base.astro`: `description` + `og:title`, `og:description`, `og:image` (p. ej. la infografía o una captura del hero) y `theme-color` |
| **Sin *source maps*** (prácticas recomendadas) | **No** | `vite.build.sourcemap: true` en `astro.config` (web personal: no hay problema en exponer el código) |
| Redistribución forzada (lecturas de geometría en scroll) | Parcial | En `journey.ts`: IO para el día activo y `animation-timeline: scroll()` para la barra (ver §4) |
| DOM grande (8.060 elementos, SVG) | No | Vigilar: el arte por día sigue diferido. Medir el tamaño del HTML con el hero en línea (~370 KB sin comprimir); si retrasa el LCP, volver a cargar el hero como chunk con `modulepreload` |
| CLS 0, caché, `font-display` | Ya bien | Mantener (métricas de *fallback* de `index.css`, cajas reservadas) |

---

## 7. Fases

Trabajar en la rama **`feat/astro-migration`** desde `main`. `main` sigue desplegable hasta el merge final.
Cada fase termina con `pnpm build` y `pnpm astro check` en verde (desde la Fase 1) y un vistazo en
`pnpm dev`. Commits convencionales por fase, sin atribución a IA.

### Fase 0 — Preparación (sin cambiar la web)
1. `git checkout main && git pull` (la copia local puede seguir en `feat/isometric-redesign`, ya fusionada) y
   crear la rama `feat/astro-migration`. Los documentos sin seguimiento de `docs/` (vuelos, reparto temático,
   este plan) viajan con el árbol de trabajo; no mezclarlos en los commits de la migración salvo este plan.
2. Borrar tests, su config y dependencias (§5) y las dependencias sin uso. `pnpm build` del proyecto actual
   debe seguir funcionando.
3. Guardar la línea base: el informe de PageSpeed está en `C:\Users\Usuario\Nueva carpeta\PageSpeed Insights.html`
   (móvil, 62). Hacer capturas de referencia de escritorio (1440×900) y móvil (390×844) en claro y oscuro,
   de: hero, banda «La ruta» con mapa, un día con ilustración, rail activo, pie. Servirán para el QA visual.

**Sale cuando**: el proyecto React compila sin tests y hay capturas de referencia.

### Fase 1 — Esqueleto Astro
1. Instalar las **últimas versiones** (§2.1), fijadas exactas: `astro`, `@astrojs/check`, `typescript`
   (excepción §2.1), `tailwindcss` + `@tailwindcss/vite`, `maplibre-gl`, y actualizar `eslint`,
   `typescript-eslint` y `globals`. Leer la documentación desde `node_modules/astro`.
2. `astro.config.mjs` (static, alias `@`, Tailwind, `sourcemap`), `tsconfig.json` de Astro con `paths`.
3. `Base.astro` con el `<head>` actual (aún con Google Fonts; se cambian en la Fase 5), script anti-FOUC
   `is:inline`, `index.css` global.
4. `index.astro` vacío con la estructura `skip-link / main / footer`.
5. Scripts de `package.json`: `dev`, `build` (`astro check && astro build`), `preview`, `lint`.
6. `.node-version` con la última LTS de Node (§2.1), `engines.node` en `package.json` y `packageManager`
   con la última versión de pnpm.

**Sale cuando**: `pnpm build` genera `dist/index.html` con el `<head>` y el CSS correctos (tokens de `@theme static` presentes).

### Fase 2 — Contenido estático
Portar a `.astro`, en este orden: `SiteFooter`, `TransferCard`, `SlotBlock`, `ZoneCard`, `DaySection`
(sin ilustración aún), `DayRail` (marcado completo, sin estado), `Journey`, `RouteSection` (sin mapa),
`Hero` + `HeroDates` (valor de build) + `HeroSpots`. Comparar con las capturas de referencia sin JS.

**Sale cuando**: la página completa se ve igual que la React con JavaScript desactivado (salvo arte diferido, mapa y estado activo del rail).

### Fase 3 — Arte
1. Hero (maqueta en capas) y spots del hero en línea en build; script de recorte móvil.
2. `lazy-art.ts`: días, banda, ruta y omamori, con pausa fuera de pantalla.
3. Comprobar con `node tools/art/build-all.mjs --check` que el arte sigue reproduciéndose (si se movieron rutas).

**Sale cuando**: todo el arte aparece, se anima, se pausa fuera de pantalla y no hay saltos de diseño.

### Fase 4 — Comportamiento
`theme.ts` (con mapa aún ausente), `journey.ts` (día activo, barra, ToTop), `reveal.ts`, listeners de
CTA/aviso de scroll/ToTop, `countdown.ts`, y por último `map.ts` con carga solo al entrar en pantalla.

**Sale cuando**: cada comportamiento de la checklist del §4 funciona en escritorio y móvil, en claro y oscuro, y con reduced motion.

### Fase 5 — Arreglos de PageSpeed que no da la migración
1. **Fuentes** (`tools/fonts/`):
   - Descargar una vez las fuentes completas (TTF/OTF con licencia OFL) de Shippori Mincho y Zen Kaku
     Gothic New a `tools/fonts/source/`.
   - Script que reúne los caracteres usados: textos de `src/data/**`, de los `.astro` y un juego latino
     fijo (ASCII, tildes, «¿¡», `·`, `→`, comillas). Recortar con `subset-font` (npm, HarfBuzz WASM) o
     `pyftsubset` a woff2, uno por peso usado. Revisar si se pueden quitar pesos (hoy: serif 500/600/700/800,
     sans 400/500/700).
   - `@font-face` propios en `index.css` (con `font-display: swap`; conservar las métricas de *fallback*),
     `preload` en `Base.astro` del serif 800 (título y kanji) y del sans 400 (texto).
   - Quitar los `preconnect` y el `<link>` de Google Fonts.
   - Comprobar si la *Fonts API* de Astro 7 recorta por caracteres usados; si no, mantener el script.
2. **Mapa**: disparador al entrar en pantalla (ya en la Fase 4); confirmar en la traza que no se descarga al cargar.
3. **Contraste**: corregir los cuatro casos del §1 y revisar en oscuro.
4. **`meta description`** y Open Graph.
5. ***Source maps***.

**Sale cuando**: Lighthouse móvil local (Chrome DevTools, «Mobile», throttling simulado) da ≥ 90 en rendimiento y 100 en accesibilidad, SEO y prácticas recomendadas.

### Fase 6 — Limpieza final
Borrar todo lo React (§5), revisar dependencias con `pnpm why`, `pnpm build` limpio, actualizar
`registry.ts`/README de `tools/art` si cambiaron rutas, y el comentario de cabecera de los ficheros movidos.

### Fase 7 — Despliegue
1. En Render (Settings): **Build Command** `pnpm install --frozen-lockfile && pnpm build`,
   **Publish Directory** `dist`, Node vía `.node-version` (o variable `NODE_VERSION`). Valorar activar
   *Auto-Deploy: On Commit*.
2. PR `feat/astro-migration` → `main`, merge y *Manual Deploy → Deploy latest commit*.
3. PageSpeed Insights móvil y escritorio sobre la URL pública; guardar el informe junto al anterior.

---

## 8. QA manual (propietario, al final)

Escritorio (≥ 1280 px) y móvil (≈ 390 px), en claro y oscuro:

- [ ] Hero: calendario con 7 y 28 de mayo (金 · vie), cuenta atrás con la fecha de hoy, kanji, sello, «Japón»,
  maqueta animada (tren, carpas, farolillos), poste del aviso de scroll, tira de billete, CTA «Explora la ruta».
- [ ] CTA y aviso «Desplázate» llevan a su sitio; botón de volver arriba aparece al bajar y funciona.
- [ ] Botón de tema: el círculo se expande desde el botón; todo cambia de tema (incluido el mapa) sin
  parpadeos; la preferencia se recuerda al recargar.
- [ ] Banda «La ruta» y mapa: el mapa solo carga al llegar; zoom con Ctrl/⌘ + rueda embebido; pantalla
  completa con rueda directa; Esc cierra.
- [ ] Rail: marca el día correcto al hacer scroll, la barra avanza, los enlaces llevan a cada día; versión
  compacta en móvil.
- [ ] Días: ilustraciones aparecen al acercarse, revelado suave, spoilers «El lugar» abren y cierran,
  traslados y zonas completos.
- [ ] Enlace directo a `/#dia-15` abre en ese día sin parpadeos.
- [ ] Con «reducir movimiento» activado en el sistema: nada se anima.
- [ ] Teclado: tabulación visible, skip-link, rail y botones accesibles.
- [ ] PageSpeed móvil ≥ 90 y sin avisos de contraste, `meta description`, fuentes ni *source maps*.

---

## 9. Riesgos

- **Rail y estado activo**: es lo más laborioso de portar; pre-renderizar los 21 bloques evita plantillas en JS.
- **Mapa a pantalla completa**: cualquier envoltorio nuevo con `transform`/`z-index`/`contain` lo rompe.
- **Tamaño del HTML** con el hero en línea: medir; plan B, hero como chunk con `modulepreload`.
- **Tailwind v4 en Astro**: el truco de `--theme()` para forzar la compilación debe seguir funcionando.
- **Node en Render**: sin `.node-version`, Render podría usar una versión < 22.23.4 y el build fallaría.
- **Fuentes recortadas**: si se añade texto nuevo con kanji o caracteres no incluidos, saldrán con la fuente
  de reserva; el script de recorte debe ejecutarse en cada build (o como `prebuild`).

---

## 10. Arranque de la nueva sesión

Prompt sugerido tras el `/clear`:

> Vamos a migrar el proyecto a Astro siguiendo `docs/plan-migracion-astro.md`. Léelo entero antes de nada.
> Sin tests (decisión cerrada). Últimas versiones de todo, con la excepción de TypeScript del §2.1 si sigue
> aplicando. Empieza por la Fase 0 en una rama `feat/astro-migration` y avísame al terminar cada fase con lo
> verificado.

Contexto útil que el plan asume: CodeGraph está indexado (`.codegraph/`); el arte se regenera con
`node tools/art/build-all.mjs` (`--check` para comparar); el modo de revisión con recibos de gentle-ai está
desactivado (`gentle-ai review mode status` → off).
