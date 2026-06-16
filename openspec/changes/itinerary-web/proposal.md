# Proposal — itinerary-web

> Change: `itinerary-web` · Project: japan-2027 · Phase: PROPOSE · Date: 2026-06-16
> Status: proposed · Artifact store: openspec

## Why

El grupo (8 adultos) hace un viaje de 3 semanas por Japón en mayo 2027 (8 → 29 may, ruta redonda por Narita). Toda la planificación vive hoy como ~50 ficheros markdown en `docs/` (itinerario de 21 días + ~39 fichas de barrios/zonas de Tokio, Kioto, Osaka y otras ciudades). Ese formato sirve para planificar, pero no para:

1. **Presentar el viaje al grupo** de forma vistosa e interactiva en una pantalla grande (escritorio).
2. **Consultarlo sobre la marcha** durante el viaje desde el móvil (qué toca hoy, dónde está cada zona, info práctica).

No existe una superficie común, navegable y bonita que reúna el recorrido. El objetivo es una **web del itinerario** con doble uso (presentación de escritorio + consulta móvil) que muestre el mapa global del recorrido, el día a día, una página por zona y notas propias del usuario — todo con una **identidad visual japonesa propia**, no una plantilla genérica.

**Restricción de producto innegociable — SIN SPOILERS:** la UI nombra el lugar (barrio, templo, mercado) y da info práctica, pero **no describe qué se ve dentro** ni lo destripa. La sorpresa se vive in situ. Esto condiciona el modelo de datos: el tipo de zona **no tendrá campo `description`**.

**Éxito** = el grupo puede recorrer la web en una reunión y entender el viaje de un vistazo (mapa + días), y cada persona puede abrirla en el móvil durante el viaje, ver qué toca hoy, localizar la zona en el mapa, leer la info práctica y dejarse notas — sin que la web revele sorpresas.

## What Changes

Se construye una **SPA** (Vite + React) que sirve el itinerario desde datos TS tipados (hand-authored a partir de `docs/`, sin parsear markdown en runtime). Alcance funcional de **este** cambio (MVP sólido y vistoso):

1. **Mapa global del recorrido** — ciudades como marcadores + línea de ruta entre ellas (Tokio → Onsen → Alpes → Kioto → Osaka → Tokio). Interactivo en escritorio, usable en móvil.
2. **Vista del itinerario por día** — los 21 días con bloques **mañana / tarde**, cada bloque listando las zonas que se visitan con una explicación **breve y sin spoilers** (qué es el sitio, no qué se ve dentro).
3. **Página/leyenda por zona** — una página por barrio/templo/mercado con su nombre, ciudad e **info práctica** (cómo llegar, horario orientativo, notas logísticas), sin spoilers. Ubicación en mini-mapa.
4. **Notas del usuario por sección** — comentarios libres asociados a un día o a una zona, **persistidos sin BD** (localStorage vía Zustand persist) + **export/import JSON** para respaldo y para compartir entre dispositivos del grupo.
5. **Identidad visual japonesa propia** — paleta y tipografía con carácter (washi/sumi/sakura), animaciones sutiles de entrada/scroll, totalmente **responsive** y de **ancho completo**.

Antes de las features se monta la **infraestructura**: testing (Vitest + RTL + jsdom, requisito de Strict TDD), Tailwind v4, routing, store, alias `@/` y la capa de datos tipados.

Este cambio es **solo planificación** en esta fase PROPOSE — aquí no se escribe código ni specs. El proposal fija el alcance y las decisiones técnicas que las fases `spec`, `design` y `tasks` desarrollarán.

## Approach

### Stack y decisiones técnicas clave

Sobre el scaffold existente (Vite 8 + React 19 con **React Compiler activo** + TypeScript 6 estricto + pnpm + ESLint 10):

- **Estilos: Tailwind CSS v4** vía `@tailwindcss/vite` (plugin), `@import "tailwindcss"` y paleta japonesa en bloque `@theme` (variables `--color-*`, sin `tailwind.config.js`). Cubre responsive y ancho completo.
- **Routing: React Router v7 (data mode, `createBrowserRouter`)** — SPA pura, params type-safe y code-splitting sin complejidad de SSR. Rutas previstas: `/` (inicio + mapa global), `/dia/:dayId`, `/zona/:citySlug/:zonaSlug`, `/mapa`.
- **Estado y notas: Zustand v5 + middleware `persist`** sobre localStorage. Sin BD. Export/import JSON encima del store.
- **Animación: `motion`** (`import { motion } from "motion/react"`) para entradas y scroll. Compatible con React 19.
- **Contenido: datos TS tipados en `src/data/`**, hand-authored desde `docs/` (sin parser markdown en runtime — la compatibilidad de plugins markdown con Rolldown/Vite 8 es incierta). El tipo de zona **no incluye `description`** (regla anti-spoilers a nivel de tipos).
- **Estructura feature-based**: `src/features/{map,itinerary,zone,notes}`, más `src/data/`, `src/components/` (UI compartida), `src/hooks/`, `src/router.tsx`. Alias `@/` → `src/`.
- **Testing: Vitest 3 + @testing-library/react + jsdom** con mock de canvas para MapLibre. **Strict TDD activo** → la infraestructura de test se instala **antes** de las features.

Restricciones del entorno a respetar (TS6 estricto): **prohibido `enum`** (erasableSyntaxOnly) → usar `as const` / uniones; **`import type` obligatorio** (verbatimModuleSyntax); con React Compiler activo, **no** añadir `useMemo`/`useCallback` manuales y aislar la API imperativa de MapLibre en `useEffect`/refs.

> Vite 8 / TS6 / ESLint 10 / Tailwind v4 / React Router v7 / MapLibre son posteriores al cutoff del modelo → cada versión y API se contrastará con la documentación oficial en las fases `design` y `apply`.

### ADR-001 (resumen) — Librería de mapas: MapLibre GL JS vs Google Maps

- **Contexto:** la funcionalidad 1 (mapa global) y los mini-mapas por zona necesitan un mapa interactivo con marcadores y una línea de ruta, gratis y estilizable a la identidad japonesa, en escritorio y móvil.
- **Decisión:** **MapLibre GL JS + `@vis.gl/react-maplibre` + tiles de OpenFreeMap**. Gratis, sin API key, sin facturación; ruta como capa GeoJSON (`Source` + `Layer`, `LineString`); estilo de mapa personalizable a la paleta del proyecto.
- **Alternativa descartada: Google Maps.** Exige cuenta con **facturación activada** y API key incluso en desarrollo, y costes por llamadas (p. ej. Directions). Motivo del descarte: coste y fricción de cuenta para un proyecto personal de grupo. *Se documenta explícitamente porque, si el usuario insiste en Google Maps, la decisión es reversible cambiando solo la capa de mapa (los datos de zonas/coordenadas son agnósticos del proveedor).*
- **Alternativa considerada: react-leaflet v5.** API más simple pero menos rendimiento en móvil y estilizado vectorial más limitado.
- **Consecuencia:** las coordenadas viven en los datos tipados (`[lng, lat]`) desacopladas del proveedor; cambiar de proveedor afecta solo a `src/features/map/`.

## Affected Areas

- **`package.json` / pnpm** — nuevas dependencias: `tailwindcss`, `@tailwindcss/vite`, `react-router-dom` (v7), `zustand`, `motion`, `maplibre-gl`, `@vis.gl/react-maplibre`; dev: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`.
- **`vite.config.ts`** — añadir plugin `tailwindcss()` (junto a `react()` + babel del compiler), alias `@/` → `src/`, bloque `test` (environment `jsdom`, globals, `setupFiles`).
- **`tsconfig*.json`** — `paths` para el alias `@/` (coherente con el alias de Vite).
- **`src/` (nuevo)** — `main.tsx` (router), `router.tsx`, `features/{map,itinerary,zone,notes}/`, `data/` (itinerario y zonas tipados), `components/` (Layout, Card, Button), `hooks/`, `test/setup.ts`, CSS de Tailwind con `@theme`.
- **`src/App.tsx` / CSS por defecto** — se reemplaza el scaffold por defecto de Vite por el layout real.
- **`docs/`** — solo **fuente de lectura**; no se modifica. El contenido se transcribe a `src/data/` sin reproducir spoilers.

## Out of Scope

- **Backend / base de datos / cuentas de usuario** — la persistencia es localStorage + JSON. Nada de servidor.
- **Edición de contenido desde la UI** (CMS, admin) — el itinerario y las zonas se editan en código (`src/data/`).
- **Parsing de markdown en runtime** — los datos se transcriben a TS a mano; no se carga `docs/` en cliente.
- **Versión open-jaw del itinerario** (entrar Narita / salir Kansai, con Miyajima) — la web modela la **ruta redonda v1**; la variante open-jaw queda para un cambio futuro.
- **Funciones avanzadas:** routing/navegación turn-by-turn, cálculo de transportes en vivo, reservas, presupuesto, multi-idioma (i18n), PWA/offline-first, sincronización en la nube entre dispositivos, autenticación. Posibles cambios futuros.
- **Detalle día-a-día fino** (horarios exactos, restaurantes, reservas) — el itinerario fuente aún tiene decisiones abiertas (orden Kanazawa↔Takayama, logística ferroviaria 2027); la web modela el nivel mañana/tarde + zonas, no la agenda minuto a minuto.

## Rollback Plan

- **Reversible por construcción:** es un cambio aditivo sobre un scaffold casi vacío. El estado previo es el template por defecto de Vite (sin features). Revertir = descartar la rama/commits del cambio; no hay migraciones de datos ni servicios externos que limpiar.
- **Rollback parcial por capas** (gracias a la estructura feature-based): cada feature (`map`, `itinerary`, `zone`, `notes`) es independiente y puede deshabilitarse o quitarse de las rutas sin romper el resto.
- **Proveedor de mapa reversible:** si MapLibre/OpenFreeMap da problemas o el usuario prefiere Google Maps, se cambia solo `src/features/map/` (las coordenadas en `src/data/` son agnósticas).
- **Sin riesgo para los datos del usuario:** las notas viven en localStorage del navegador del usuario; el export JSON permite respaldarlas antes de cualquier cambio mayor de esquema.
- **Persistencia segura ante versiones:** el store con `persist` llevará versión de esquema para migrar/descartar notas si cambia el shape, evitando estados corruptos.

## Open Questions

1. **¿Confirmar MapLibre + OpenFreeMap sobre Google Maps?** Recomendado por coste cero y sin API key; Google Maps exige facturación. ¿Lo confirmamos, o el usuario quiere Google Maps pese al coste/cuenta? (Decisión reversible — afecta solo a la capa de mapa.)
2. **¿Alcance del contenido inicial: todo el itinerario o un bloque piloto?** Transcribir las ~39 fichas + 21 días a `src/data/` es trabajo de contenido considerable. Opciones: (a) **piloto** Tokio bloque 1 (4 días, ~6 zonas) para validar UX/diseño y luego completar; (b) **completo** de una. Recomendado: piloto primero.
3. **¿Idioma de la UI?** El contenido fuente está en español; ¿la web es solo-ES o se contempla bilingüe ES/EN para nombres japoneses? (i18n está fuera de alcance MVP, pero condiciona el modelo de datos si se quiere bilingüe luego.)
4. **¿Coordenadas de las zonas?** Las fichas tienen ubicaciones en texto, no `[lng, lat]` estructuradas. ¿Se geocodifican a mano durante la transcripción, o el mapa global solo marca ciudades en el MVP y las zonas llegan después?
5. **¿Orden de ciudades a representar en el mapa/ruta?** El orden Kanazawa↔Takayama sigue **pendiente** en el itinerario fuente; el mapa debe tolerar que ese tramo aún no esté cerrado.
6. **¿Deploy?** ¿Hosting estático (Vercel/Netlify/GitHub Pages) para compartir el enlace con el grupo, o solo local durante la presentación? (No bloquea el MVP, pero afecta a `base` de Vite si va a GitHub Pages.)
