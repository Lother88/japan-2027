# Tasks: itinerary-web

> Change: `itinerary-web` · Project: japan-2027 · Phase: TASKS · Date: 2026-06-16
> Artifact store: openspec · Strict TDD: active

---

## Phase 1 — Infraestructura

<!-- COMPLETED 2026-06-16 by sdd-apply -->
<!-- [CONFIRM-apply] resueltos:
  1.1: React Router v7 usa paquete `react-router` (no react-router-dom). Fuente: reactrouter.com/start/modes
  1.1: Vitest con Vite 8 → usar triple-slash `/// <reference types="vitest/config" />` + `defineConfig` de 'vite'. Fuente: v3.vitest.dev/config
  1.4: @tailwindcss/vite va DESPUÉS de react() y babel() en plugins[]. Fuente: tailwindcss.com
  1.5: types = ["vite/client", "vitest/globals", "@testing-library/jest-dom"]. Sin baseUrl (TS6 lo depreca). Fuente: github.com/microsoft/TypeScript/issues/62207
  1.7: exports de @vis.gl/react-maplibre 8.x: Map, Marker, Source, Layer, Popup, NavigationControl, useMap. Fuente: visgl.github.io/react-maplibre/docs/api-reference/marker
  1.8: @import "tailwindcss" + @theme { --color-*, --font-*, --radius-* }. Fuente: tailwindcss.com/docs/theme
-->

- [x] 1.1 **[CONFIRM-apply]** Verificar nombre exacto del paquete React Router v7 (`react-router-dom` vs `react-router`) y confirmar bloque `test` en Vite 8 (`defineConfig` de `vitest/config` o triple-slash ref). Documentar resultado en comentario.
- [x] 1.2 Instalar deps runtime: `pnpm add react-router zustand motion maplibre-gl @vis.gl/react-maplibre` — instalado: react-router@7.17.0, zustand@5.0.14, motion@12.40.0, maplibre-gl@5.24.0, @vis.gl/react-maplibre@8.1.1
- [x] 1.3 Instalar deps dev: `pnpm add -D tailwindcss @tailwindcss/vite vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom` — instalado: tailwindcss@4.3.1, @tailwindcss/vite@4.3.1, vitest@4.1.9, @testing-library/react@16.3.2, @testing-library/jest-dom@6.9.1, @testing-library/user-event@14.6.1, jsdom@29.1.1
- [x] 1.4 **[CONFIRM-apply]** Confirmar que `@tailwindcss/vite` va en `plugins[]` y orden correcto junto a `babel`/React Compiler. Actualizar `vite.config.ts`: añadir plugin Tailwind, alias `@/→src/`, bloque `test` (env jsdom, globals, setupFiles). — DONE: triple-slash ref + tailwindcss() después de react()/babel(); alias `@` con node:url
- [x] 1.5 **[CONFIRM-apply]** Confirmar nombres exactos de `types` en tsconfig (`vitest/globals`, `@testing-library/jest-dom`). Actualizar `tsconfig.app.json`: paths `@/*` sin baseUrl (TS6 lo depreca). No tocado `verbatimModuleSyntax` ni `erasableSyntaxOnly`.
- [x] 1.6 Crear `src/test/setup.ts`: `import '@testing-library/jest-dom'` + stub de `HTMLCanvasElement.prototype.getContext` para jsdom.
- [x] 1.7 Crear `src/test/maplibre-mock.ts`: stubs con `data-testid` para Map, Marker, Source, Layer, Popup, NavigationControl, useMap de `@vis.gl/react-maplibre`. Confirmados en API docs v8.x.
- [x] 1.8 **[CONFIRM-apply]** Verificar sintaxis `@import "tailwindcss"` + `@theme { --font-* }` en Tailwind v4. Crear `src/index.css`: fuentes Zen (Google Fonts) + `@import "tailwindcss"` + `@theme` con paleta sumi/washi/sakura/matcha/urushi/ai + tipografía + `--radius-paper`.
- [x] 1.9 Limpiado `App.tsx` (scaffold demo eliminado, placeholder mínimo `<main><h1>Japón 2027</h1></main>`). RouterProvider se conecta en Phase 2.
- [x] 1.10 Smoke test `src/test/smoke.test.tsx`: 2 tests pasan en verde. `pnpm test:run` ✓

---

## Phase 2 — Cimientos

> Depends on: Phase 1 complete.

<!-- COMPLETED 2026-06-16 by sdd-apply -->
<!-- [CONFIRM-apply] resueltos:
  2.8: createBrowserRouter/RouterProvider importados de 'react-router' (paquete unificado v7). Confirmado.
  2.10: useMediaQuery con lazy init en useState. matchMedia mock añadido a setup.ts para jsdom.
  2.12: Layout test verificado con MemoryRouter. matchMedia stub necesario en setup.ts.
  Gotcha: react-hooks/set-state-in-effect no permite setMatches en el body del effect — solo en listener.
  Gotcha: react-refresh/only-export-components — MapPage lazy separado a MapPageLazy.tsx.
-->

- [x] 2.1 **TEST PRIMERO** — Crear `src/data/__tests__/types.test.ts`: afirmar que `Zone` no tiene propiedad `description` (TypeScript estructural — fixture sin campo prohibido pasa, fixture con campo falla en tsc). Satisface NOSPOIL-01, DAY-05, ZONE-01.
- [x] 2.2 Crear `src/data/types.ts`: interfaces `LngLat`, `SlotKey`, `City`, `ZoneRef`, `TimeSlot`, `Day`, `Zone`, `ZonePractical` — sin `description` en `Zone`. Hacer pasar test 2.1.
- [x] 2.3 **TEST PRIMERO** — Crear `src/data/__tests__/helpers.test.ts`: `getDay(9)` devuelve día correcto, `getDay(99)` → undefined, `getZone('shibuya')` → zona, `zonesByCity('tokio')` → array, `buildRouteLineString` produce LineString con coordinates en orden `[lng, lat]` y ruta cerrada (último = primero).
- [x] 2.4 Crear `src/data/cities.ts`: `City[]` con Tokio, Takaragawa, Kanazawa, Takayama, Shirakawa-go, Kioto, Osaka — centros `[lng, lat]` geocodificados a mano. Nota: tramo Kanazawa↔Takayama provisional (MAP-01).
- [x] 2.5 Crear `src/data/route.ts`: `routeOrder` + `src/lib/geo.ts`: `buildRouteLineString(cities, routeOrder)` retorna `GeoJSON.Feature<LineString>`. Hacer pasar test 2.3.
- [x] 2.6 Transcribir datos piloto — **Tokio bloque 1 (días 9–12, ~6-8 zonas)**: crear `src/data/itinerary.ts` (Day[] parcial) + `src/data/zones.ts` (Zone[] sin description) destilar de `docs/` omitiendo contenido narrativo (NOSPOIL-04). Coordenadas de zona opcionales (ZONE-03). — 9 zonas creadas con coordenadas.
- [x] 2.7 Crear `src/data/index.ts`: barrel + helpers `getDay`, `getZone`, `getCity`, `zonesByCity`, `zonesForDay`. Completar tests 2.3.
- [x] 2.8 **[CONFIRM-apply]** Confirmar `createBrowserRouter`/`RouterProvider` en paquete RR v7 instalado. Crear `src/router.tsx`: rutas `/`, `/itinerario`, `/dia/:dayId`, `/zona/:citySlug/:slug`, `/mapa` bajo layout raíz. Features MapLibre como `lazy`. Satisface DAY-01 (acceso directo por URL).
- [x] 2.9 Crear `src/main.tsx`: `createRoot` + `<RouterProvider router={router}>`.
- [x] 2.10 Crear `src/components/Layout.tsx` + `src/components/Nav.tsx` + `src/hooks/useMediaQuery.ts`: shell con `<Outlet/>`, nav desktop-bar / mobile-drawer (toggle via `useMediaQuery`). Satisface UX-04.
- [x] 2.11 Crear componentes UI base: `src/components/Card.tsx`, `Button.tsx`, `Tag.tsx`, `PageHeader.tsx` con tokens de paleta japonesa y `aria-label` en interactivos. Satisface UX-05.
- [x] 2.12 **TEST** — `src/components/__tests__/Layout.test.tsx`: renderiza `<Outlet>`, Nav visible, nav contiene enlaces a `/` e `/itinerario`. Satisface UX-04. — 7 tests pasan.

---

## Phase 3 — Features con TDD

> Depends on: Phase 2 complete. Tasks 3.A (notas), 3.B (itinerario), 3.C (zona) pueden avanzar en paralelo. 3.D (mapa) depende de 2.4+2.5.

<!-- COMPLETED 2026-06-16 by sdd-apply -->
<!-- [CONFIRM-apply] resueltos:
  3.2: zustand/middleware import path confirmed ✓
  3.16: @vis.gl/react-maplibre v8 props confirmed: Map(mapStyle, initialViewState), Marker(longitude, latitude), Source(id, type, data), Layer(id, type, paint). Source: visgl.github.io/react-maplibre
  3.16: OpenFreeMap style URL confirmed: https://tiles.openfreemap.org/styles/liberty. Source: openfreemap.org/quick_start
  3.16: MapLibre CSS path confirmed: maplibre-gl/dist/maplibre-gl.css (imported once in GlobalMap.tsx)
  3.16: Google Maps embed (no API key): legacy endpoint https://www.google.com/maps?q=<lat>,<lng>&output=embed confirmed. Source: dev.to/hardiquedasore
  Gotcha: maplibre-mock must use React.createElement (not plain object) for React 19 compatibility
  Gotcha: motion v12 ease property requires 'as const' to satisfy Easing type
  Gotcha: lazy() + Suspense in ZonePage requires waitFor() in RTL tests
  Gotcha: global.URL not in TS6 jsdom scope — use window.URL instead
-->

### 3.A — Store de notas (NOTES)

- [x] 3.1 **TEST PRIMERO** — `src/features/notes/__tests__/notesStore.test.ts`: `setNote`/`clearNote`/`exportJSON`/`importJSON` (merge, versión inválida, json malformado). localStorage mockeado por jsdom. Satisface NOTE-01, NOTE-02, NOTE-03, NOTE-04.
- [x] 3.2 Crear `src/features/notes/notesStore.ts`: Zustand v5 + `persist` (localStorage, `name:'japan2027-notes'`, `version:1`, `migrate`). **[CONFIRM-apply]** import path `zustand/middleware`. Hacer pasar tests 3.1.
- [x] 3.3 Crear `src/features/notes/useNotes.ts`: hook `useNotes(sectionId)` → `{note, setNote, clearNote}`. Convención de `sectionId`: `day:{id}` / `zone:{id}`.
- [x] 3.4 **TEST PRIMERO** — `src/features/notes/__tests__/NotesPanel.test.tsx`: renderiza textarea con nota existente, onChange actualiza, clearNote vacía. Satisface NOTE-05.
- [x] 3.5 Crear `src/features/notes/NotesPanel.tsx`: textarea + autosave + botón eliminar. Consume `useNotes`. Satisface NOTE-01, NOTE-05.
- [x] 3.6 **TEST PRIMERO** — `src/features/notes/__tests__/ImportExport.test.tsx`: botón export dispara descarga Blob, import con fichero válido fusiona notas, import con JSON inválido muestra error sin sobrescribir. Satisface NOTE-03, NOTE-04.
- [x] 3.7 Crear `src/features/notes/ImportExport.tsx`: export via `Blob`+`<a download>` con fecha en nombre de fichero; import con validación de versión y forma. Satisface NOTE-03, NOTE-04.

### 3.B — Itinerario por día (DAY)

- [x] 3.8 **TEST PRIMERO** — `src/features/itinerary/__tests__/ItineraryView.test.tsx`: renderiza exactamente N entradas (datos piloto), cada entrada tiene enlace a `/dia/:id`, indicador de nota si el día tiene nota. Satisface DAY-01, NOTE-05.
- [x] 3.9 Crear `src/features/itinerary/DayCard.tsx` + `src/features/itinerary/ItineraryView.tsx`: lista de días con `DayCard`; DayCard muestra número, fecha, ciudad, ≤2 zonas. Hace pasar test 3.8. Satisface DAY-01.
- [x] 3.10 **TEST PRIMERO** — `src/features/itinerary/__tests__/DayView.test.tsx`: renderiza 2 bloques mañana/tarde, zonas con nombre y summary SIN `description`, bloque vacío muestra "En tránsito", botones prev/next habilitados/deshabilitados en límites, enlace de zona va a `/zona/:city/:slug`. Satisface DAY-02, DAY-03, DAY-04, DAY-05, NOSPOIL-02, NOSPOIL-03.
- [x] 3.11 Crear `src/features/itinerary/TimeSlotBlock.tsx` + `src/features/itinerary/DayView.tsx`: bloques mañana/tarde, navegación prev/next, chips de zona con enlace, `NotesPanel` (sectionId `day:{id}`). Hace pasar test 3.10. Satisface DAY-02 a DAY-05.

### 3.C — Página de zona (ZONE)

- [x] 3.12 **TEST PRIMERO** — `src/features/zone/__tests__/ZonePage.test.tsx`: renderiza nombre/ciudad/tags/practical, NO renderiza `description`, campos practical opcionales ausentes no renderizan etiqueta vacía, zona inexistente muestra 404, mini-mapa ausente si no hay coordinates, enlace de vuelta presente. Satisface ZONE-01 a ZONE-04, NOSPOIL-02, NOSPOIL-03.
- [x] 3.13 Crear `src/features/zone/ZonePractical.tsx`: muestra `access`, `hours`, `logistics` solo si existen. Satisface ZONE-02.
- [x] 3.14 Crear `src/features/zone/ZonePage.tsx`: `PageHeader` + tags + `ZonePractical` + `ZoneMiniMap` condicional + `NotesPanel` (sectionId `zone:{id}`) + enlace de vuelta con fallback a `/itinerario`. Hace pasar test 3.12. Satisface ZONE-01 a ZONE-04.

### 3.D — Mapa global (MAP)

> Depends on: 2.4 (cities), 2.5 (geo), maplibre-mock (1.7)

- [x] 3.15 **TEST PRIMERO** — `src/features/map/__tests__/GlobalMap.test.tsx`: con maplibre-mock, renderiza N marcadores (uno por ciudad), cada `<Marker>` stub tiene coordenadas `[lng, lat]`, existe `<Source>` con data LineString, click en marcador navega o muestra panel con días y enlace, cada marcador tiene `aria-label` con nombre de ciudad. Satisface MAP-01, MAP-02, MAP-03, MAP-05, NOSPOIL-02.
- [x] 3.16 **[CONFIRM-apply]** Confirmar props `mapStyle`/`longitude`/`latitude` de `@vis.gl/react-maplibre` + URL de estilo OpenFreeMap + ruta CSS `maplibre-gl/dist/maplibre-gl.css`. Crear `src/features/map/mapStyle.ts` + `src/features/map/GlobalMap.tsx`: `<Map>` + `<Marker>` × ciudades con `aria-label` + `<Source/Layer>` LineString + `initialViewState` Japón. Hace pasar test 3.15. Satisface MAP-01, MAP-02, MAP-03, MAP-04, MAP-05.
- [x] 3.17 **TEST PRIMERO** — `src/features/map/__tests__/ZoneMiniMap.test.tsx`: con coordenadas → renderiza `<Map>` stub con 1 marcador; sin coordenadas → no renderiza nada. Satisface ZONE-03.
- [x] 3.18 Crear `src/features/map/ZoneMiniMap.tsx`: mini-mapa condicional a `coordinates`. Hace pasar test 3.17. Satisface ZONE-03.
- [x] 3.19 Crear `src/features/map/MapPage.tsx` (ruta `/mapa`): `GlobalMap` full-screen. Integrar `GlobalMap` en `Home` (hero). Satisface MAP-04, UX-02.

---

## Phase 4 — Contenido completo

> Can parallelize with Phase 3.D (no code dependency). Each city is independent.

- [ ] 4.1 Transcribir días 13-21 + ciudades restantes a `src/data/itinerary.ts`: Onsen (Takaragawa, días 13-14), Alpes/Kanazawa (días 15-17), Takayama + Shirakawa-go (días 17-18), Kioto (días 18-20), Osaka+Hiroshima (días 20-21), Tokio bloque 2 (día 21). Omitir narrativa (NOSPOIL-04).
- [ ] 4.2 Transcribir zonas de cada ciudad a `src/data/zones.ts` (destilar de `docs/`): sin `description`, con `ZonePractical` y `coordinates` cuando disponibles. Añadir test anti-spoiler por ciudad (NOSPOIL-03). Por ciudad: Onsen, Kanazawa, Takayama, Shirakawa-go, Kioto, Osaka, Hiroshima, Tokio bloque 2.
- [ ] 4.3 Actualizar `src/data/route.ts` → `routeOrder` si el orden Kanazawa↔Takayama se cierra definitivamente. Verificar test de geometría 2.3.
- [ ] 4.4 Verificar que `ItineraryView` muestra exactamente 21 días (actualizar test 3.8 si estaba con datos piloto). Satisface DAY-01 escenario "21 entradas".

---

## Phase 5 — Pulido

> Depends on: Phases 3 + 4 complete.

<!-- THEMING COMPLETED 2026-06-16 by sdd-apply -->
<!-- Tailwind v4 dark mode: @custom-variant dark (&:where(.dark, .dark *));
     Confirmed syntax from tailwindcss.com/docs/dark-mode
     Semantic tokens: --sem-bg/surface/border/fg/fg-muted/fg-subtle/accent
     in :root (light) and .dark (dark). Exposed as @theme vars: bg, surface, border, fg, fg-muted, fg-subtle, accent.
     Store: japan2027-theme (Zustand persist). Anti-FOUC inline script in index.html.
     ThemeToggle in Nav (desktop + mobile). 105 tests pass. -->

- [x] 5.0 **Modo claro/oscuro (light/dark) con toggle**: `@custom-variant dark` en CSS, tokens semánticos (bg/surface/border/fg/fg-muted/fg-subtle/accent), store Zustand+persist (`japan2027-theme`), anti-FOUC en `index.html`, `ThemeToggle` accesible en Nav. Todos los componentes refactorizados a tokens semánticos. 105 tests en verde.

- [ ] 5.1 Añadir animaciones `motion` (`import { motion } from "motion/react"`): fade/slide en `DayCard`, `ZonePage`, `PageHeader`. Respetar `prefers-reduced-motion`. Satisface UX-01.
- [ ] 5.2 Ajuste responsive final: verificar grid de `ItineraryView` en 375 px y 1440 px, áreas táctiles ≥ 44×44 px en botones prev/next, scroll vertical no bloqueado por mapa en móvil (`cooperativeGestures` en MapLibre si aplica). **[CONFIRM-apply]** opción cooperative gesture en `@vis.gl/react-maplibre`. Satisface UX-02, UX-03, MAP-04.
- [ ] 5.3 Verificar contraste de paleta: texto sumi-900 sobre washi-50 ≥ 4.5:1. Ajustar valores oklch si necesario. Satisface UX-05.
- [ ] 5.4 Revisar todos los elementos interactivos: `aria-label` en marcadores de mapa, botones sin texto visible, `<Nav>` con `role` apropiado. Satisface UX-05, MAP-05.
- [ ] 5.5 Revisar `@theme` y fuentes: confirmar nombres exactos de Zen Old Mincho y Zen Kaku Gothic New en Google Fonts. Ajustar `@import` de fuentes en `index.css`.
- [ ] 5.6 Añadir páginas 404 y estados vacíos: ruta `*` → `NotFound.tsx`, `DayView` con `dayId` inexistente → mensaje, `ZonePage` con slug inexistente → mensaje. Satisface ZONE-01 escenario "Zona inexistente".
- [ ] 5.7 Verificación final: `pnpm run lint`, `tsc -b` sin errores, `pnpm test` todos en verde, revisión manual anti-spoilers en datos de `src/data/` (checklista NOSPOIL-02, NOSPOIL-04). Satisface NOSPOIL-01 a NOSPOIL-04, DAY-05, ZONE-01.

---

## Dependency Summary

```
Phase 1 (infra)
  └─ Phase 2 (cimientos: tipos + datos piloto + router + layout)
       ├─ Phase 3.A (notas)          ──┐
       ├─ Phase 3.B (itinerario)     ──┤ paralelo entre sí
       ├─ Phase 3.C (zona)           ──┤
       └─ Phase 3.D (mapa) ← 2.4+2.5─┘
            └─ Phase 4 (contenido completo) [paralelo con 3.D]
                 └─ Phase 5 (pulido)
```

## Spec Coverage

| Spec | Tasks |
|------|-------|
| DAY-01 | 2.8, 3.8, 3.9, 4.4 |
| DAY-02 | 3.10, 3.11 |
| DAY-03 | 3.10, 3.11 |
| DAY-04 | 3.10, 3.11 |
| DAY-05 | 2.1, 2.2, 3.10 |
| MAP-01 | 2.4, 3.15, 3.16 |
| MAP-02 | 2.5, 3.15, 3.16 |
| MAP-03 | 3.15, 3.16 |
| MAP-04 | 3.16, 3.19, 5.2 |
| MAP-05 | 3.15, 3.16, 5.4 |
| ZONE-01 | 2.1, 2.2, 3.12, 3.14 |
| ZONE-02 | 3.12, 3.13, 3.14 |
| ZONE-03 | 3.17, 3.18 |
| ZONE-04 | 3.12, 3.14 |
| NOTE-01 | 3.1, 3.2, 3.4, 3.5 |
| NOTE-02 | 3.1, 3.2 |
| NOTE-03 | 3.6, 3.7 |
| NOTE-04 | 3.6, 3.7 |
| NOTE-05 | 3.4, 3.5, 3.8, 3.9 |
| UX-01 | 1.8, 5.1, 5.5 |
| UX-02 | 3.19, 5.2 |
| UX-03 | 2.11, 5.2 |
| UX-04 | 2.10, 2.12 |
| UX-05 | 2.11, 5.3, 5.4 |
| NOSPOIL-01 | 2.1, 2.2 |
| NOSPOIL-02 | 3.10, 3.12, 3.15, 5.7 |
| NOSPOIL-03 | 3.10, 3.12, 4.2 |
| NOSPOIL-04 | 2.6, 4.1, 4.2, 5.7 |
