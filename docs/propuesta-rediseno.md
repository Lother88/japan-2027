# Propuesta de rediseño — Japón 2027

> Auditoría de diseño en solo lectura (31-oct-2026) sobre `main` + cambios locales (día 21 con Kinkaku-ji isométrico).
> Capturas: `%TEMP%\claude\C--Users-Usuario-WebstormProjects-japan-2027\5c1f7a82-0a84-4579-98e7-a98e4631a7bb\scratchpad\audit\` (citadas como `[01]`…`[09]`).

| # | Captura | # | Captura |
|---|---|---|---|
| 01 | `01-desktop-light-hero.png` (1440×900) | 06 | `06-mobile-light-hero.png` (390×844) |
| 02 | `02-desktop-light-day09-top.png` | 07 | `07-mobile-light-day10.png` |
| 03 | `03-desktop-light-day21-kinkakuji.png` | 08 | `08-mobile-dark-hero.png` |
| 04 | `04-desktop-dark-hero.png` | 09 | `09-desktop-light-footer.png` |
| 05 | `05-desktop-dark-day12.png` | | |

## 1. Resumen

- **El mapa está roto**: CARTO devuelve teselas con la marca de agua «API KEY REQUIRED» (ETag `wm-…`), así que la pieza central del hero no muestra el mapa base `[01][04]`.
- La cabecera mezcla dos lenguajes planos (sakura/Fuji/bosque de día; farolillos/luna/izakaya de noche) que chocan con el mapa, el CTA y el título, y no casan con la nueva dirección isométrica.
- La nueva ilustración isométrica queda **tapada por las tarjetas** del día y a un 60 % de opacidad `[03]`, y cada una pesa ~140 KB dentro del bundle principal.
- Accesibilidad mejorable: contrastes por debajo de AA en el tema claro, objetivos táctiles de 13 px en el rail y sin estilos `:focus-visible`.
- Propuesta: cabecera isométrica «Maqueta de tren al pie del Fuji»: todo gráfico de la portada pasa a ser isométrico y animado (1 escena + 1 banda + 6 spots, ≈ 100 KB brotli); sacar el mapa a una banda propia y hacer el rediseño en 4 fases que no tocan los ficheros de la integración en curso.

## 2. Inventario actual de la cabecera

| Elemento | Tema | Dónde | Notas |
|---|---|---|---|
| Fondo degradado `--hero-1→3` | ambos | `Hero.tsx:40` | Incompatible con los rellenos `--paper` de los sólidos isométricos (§4) |
| Sol (disco rosa difuso, `ignPulse 9s`) | claro | `HeroDecor.tsx:46-62` | Ocupa la esquina superior derecha; en móvil cubre la mitad del hero `[06]` |
| Pájaros lejanos (`ignFloat 8s`) | claro | `HeroDecor.tsx:63-73` | Flotan junto a la fecha |
| Monte Fuji | claro | `HeroDecor.tsx:74-85` | Medio tapado por el mapa; el aviso de scroll queda encima `[01]` |
| Bosque low-poly (100 px, ancho completo) | claro | `HeroDecor.tsx:86-93` | Colisiona con el ThemeToggle `[01]` |
| Rama de sakura animada (`ignSway 11s`), flores y capullos | claro | `HeroDecor.tsx:94-141` | En móvil se cruza con la fecha `[06]` |
| Guirnalda de farolillos (祭 酒 福 灯 + 2 lisos) | oscuro | `HeroDecor.tsx:158-164` | Recortada en móvil `[08]` |
| Luna (disco + halo, `ignPulse`) | oscuro | `HeroDecor.tsx:165-170` | Queda **detrás de la fecha y de «Japón»** en móvil `[08]` |
| Calle izakaya (SVG 4400×210, 200 px) | oscuro | `HeroDecor.tsx:171-200` | Se solapa con el CTA, el pie del mapa y «Desplázate» `[04]` |
| Pétalos de sakura (canvas fijo, z 60, 32/15 pétalos) | claro | `SakuraPetals.tsx`, `App.tsx:20` | Pinta **por encima** de todo: texto, mapa y tarjetas `[01][02]` |
| Fecha «8 → 29 mayo 2027» + filete ámbar | ambos | `Hero.tsx:59-84` | En posición absoluta arriba a la derecha y separada del título |
| H1 «Japón», subtítulo coral, párrafo | ambos | `Hero.tsx:97-138` | |
| 4 chips de cifras (21 días · 6 bases · 3 excursiones · 4 viajeros) | ambos | `Hero.tsx:21-26,140-184` | En móvil quedan 3 + 1 huérfano, alineados a la izquierda bajo un texto centrado `[06]` |
| CTA «Explora el itinerario» | ambos | `Hero.tsx:186-228` | Hover con JS en vez de CSS |
| Tarjeta del mapa: leyenda «La ruta», marca de agua 日本一周, pantalla completa, zoom y atribución | ambos | `Hero.tsx:231-336`, `HeroMap.tsx` | Etiquetas solapadas («Osal»/Nara, Shirakawa-go/Takayama) |
| Aviso «Desplázate» (`ignBounce`) | ambos | `Hero.tsx:339-381` | Es un `div` con `onClick`, sin acceso por teclado |
| ThemeToggle (abajo izquierda) / ToTop (abajo derecha) | ambos | `ThemeToggle.tsx`, `ToTop.tsx` | En móvil tapan el mapa y el texto `[06][07]` |
| Scrollbar «farolillo» | ambos | `index.css:65-87` | |

## 3. Hallazgos priorizados

| P | Área | Problema | Evidencia | Propuesta | Esf. |
|---|---|---|---|---|---|
| P1 | Mapa | Las teselas raster de CARTO exigen API key: la rejilla «API KEY REQUIRED» sustituye al mapa base | `HeroMap.tsx:57-77`, `[01][04][06]` | Cambiar a un estilo vectorial sin clave (p. ej. OpenFreeMap) o a MapTiler/Stadia con clave por `.env`; usar estilos claro y oscuro propios con la paleta de `index.css` | S |
| P1 | Ilustraciones | La ilustración del día queda **detrás** de la columna de 760 px (z 2) y con `opacity .6`, así que el Kinkaku-ji apenas se ve | `DaySection.tsx:89-100`, `KinkakujiIso.tsx:30`, `[03]` | Darle un hueco propio en la cabecera del día (a la derecha del título en escritorio y encima en móvil), con opacidad 1 | M |
| P1 | Rendimiento | El marcado isométrico (142 KB) se importa de forma estática en el chunk principal; con 21 días serían unos 3 MB de JS | `illustrations.tsx:28`, `kinkakujiIso.markup.ts` (142 730 B), `dist/…index.js` ya pesa 525 KB | `import()` dinámico por día al acercarse la sección (IntersectionObserver o `React.lazy`) y `content-visibility:auto` en las secciones; objetivo ≤ 100 KB por ilustración | M |
| P1 | Contraste (claro) | Ámbar en eyebrows: **2,95:1**; números del rail: **2,51:1**; `--muted2` en etiquetas de 10,5 px: **3,79:1**; `--muted-amber`: **3,01:1**; etiquetas: 4,39:1 a 11 px | `index.css:12,18`, `DaySection.tsx:126-130`, `DayRail.tsx:254-256`, `Hero.tsx:173-177` | Oscurecer **solo los tokens de texto** (`--amber`→≈#8a6420, `--tick-idle-label`, `--muted2`, `--muted-amber`) hasta ≥ 4,5:1. No tocar `--paper/--gold/--brown/--green/--ink/--coral`, porque las ilustraciones derivan sus rampas de ellos | S |
| P1 | Capas | El canvas de pétalos (fijo, z 60) pinta sobre el texto, el mapa y las tarjetas, y su rAF sigue funcionando en tema oscuro y en toda la página | `SakuraPetals.tsx:69-73,77,113` | Retirarlo (lo sustituye el hero isométrico) o, como mínimo, acotarlo al hero con z por debajo del contenido y parar el rAF fuera de pantalla y en oscuro | S |
| P2 | Hero (composición) | El decorado choca con el contenido: la luna tapa la fecha y el título, la izakaya el CTA, el Fuji queda bajo el mapa y el bosque bajo el ThemeToggle | `[04][06][08]`, `HeroDecor.tsx` | Sustituirlo por el concepto isométrico de §4 con zona segura para el titular | L |
| P2 | Mapa | Las etiquetas son markers DOM sin detección de colisiones (Osaka queda cortado bajo Nara). El mapa se **recrea entero** al cambiar de tema | `HeroMap.tsx:79-105,125-203`, `[01]` | Pasar las etiquetas a una capa `symbol` (con colisiones) y cambiar el tema con `setStyle`/`setPaintProperty` | M |
| P2 | Mapa (fullscreen) | El mapa ampliado (z 1000) vive dentro del contexto de apilamiento `zIndex:2` del grid; los botones flotantes (z 85) y los pétalos (z 60) quedan encima | `Hero.tsx:45-49`, `HeroMap.tsx:241-245` | Montar el modo ampliado con `createPortal` a `body` como `<dialog>` modal con foco atrapado | S |
| P2 | Navegación (rail) | Los ticks son `div role=button` de 13 px de alto (incumplen el tamaño mínimo de 24 px, WCAG 2.5.8); en móvil el rail sticky ocupa 141 px y repite ciudad y fecha; `scrollToDay` compensa 56 px, así que el título queda bajo el rail | `DayRail.tsx:212-264`, `scroll.ts:17-23`, `index.css:145`, `[07]` | Usar `<nav aria-label="Días">` con `<a href="#dia-09">` y zona táctil ≥ 24 px; en móvil, rail compacto de 56 px; usar `scroll-margin-top` en vez del offset fijo | M |
| P2 | A11y | No hay estilos `:focus-visible`, `skip-link` ni `<nav>`; el hero queda fuera de `<main>`; los nombres de zona son `div` (no hay `h3`); el aviso de scroll no es accesible por teclado | `grep focus-visible` = 0, `Journey.tsx:27`, `ZoneCard.tsx:56`, `Hero.tsx:341` | Anillo de foco global en `index.css`, `<main>` envolviendo el hero y el journey, `h3` en `ZoneCard`, `<button>` en el aviso de scroll | S |
| P2 | Tema oscuro | El botón «siguiente» del rail móvil tiene el navy fijo; los marcadores y el botón del mapa usan hex duplicados de los tokens | `DayRail.tsx:319-321`, `HeroMap.tsx:82-84,235-237` | Leer los colores de `var(--primary-fill)` o `getComputedStyle` | S |
| P2 | Móvil | Hero de 1100 px: el mapa queda bajo el pliegue; chips 3+1; los botones flotantes tapan contenido | `[06][07]` | Chips en rejilla 2×2 (o una tira de una línea); dejar los botones flotantes a 16 px y ocultarlos en el hero; el mapa sale del hero (§4) | S |
| P2 | Tipografía | 19 tamaños distintos (9,5 → 74 px) sin escala; doble numeración confusa «DÍA 01 / 21» frente a «Día 09» | `grep fontSize` en `features/`, `DayRail.tsx:136-148` `[02]` | Escala modular de 7 pasos (12/14/16/20/28/40/64) como tokens; en el rail, «9 may · día 1 de 21» | M |
| P2 | Densidad del día | Hay un resumen por franja más tarjetas de zona con 3 bloques; «El lugar» y la logística compiten al mismo peso; el texto del slot repite al de la zona | `SlotBlock.tsx:82-102`, `ZoneCard.tsx:200-321` | Fusionar el resumen en la cabecera de la franja; logística plegable o en dos columnas a ≥ 1024 px | M |
| P3 | Rendimiento | `HeroDecor` (96 KB de paths) renderiza día y noche a la vez; DOM con ~10 255 nodos y 225 SVG | `HeroDecor.tsx`, medición en vivo | Desaparece con §4 | — |
| P3 | Rendimiento | En cada frame de scroll, `getBoundingClientRect` de 21 secciones y de todos los `[data-parallax]`; además hay código muerto de `[data-nav]` con colores claros fijos | `useScrollJourney.ts:36-86` | Usar IntersectionObserver para el día activo; parallax con `animation-timeline: view()` en CSS; borrar el bloque `data-nav` | S |
| P3 | Fuentes | `@import` de Google Fonts dentro del CSS (cadena bloqueante) con 8 pesos | `index.css:3` | `<link rel="preconnect">` + `<link>` en `index.html` y solo los pesos usados | S |
| P3 | Movimiento | `prefers-reduced-motion` se respeta (CSS global, Reveal, pétalos y abanico), pero 4–5 bucles infinitos conviven en el hero | `index.css:185-188`, `HeroDecor.tsx` | Como mucho 3 movimientos lentos y desfasados en el asset nuevo, solo con CSS | — |
| P3 | Código | Tailwind v4 está configurado pero no importado (1 `className` frente a 215 `style={{}}`); hover por JS; `FanEditor` temporal en `main.tsx` | `vite.config.ts:13`, `main.tsx:5-6` | Migración progresiva a utilidades y tokens `@theme`; borrar `FanEditor` | L |
| P3 | Contenido | Pie con jerga interna («Decisiones de scope», «open-jaw») y «20 noches» fijo en el código; etiquetas sin tilde («historico», «iconico») | `SiteFooter.tsx:83-106`, `zones.ts:23,41`, `[09]` | Calcular las cifras a partir de los datos; reescribir como «Notas del viaje»; corregir las tildes | S |

## 4. Concepto de cabecera isométrica

**Contrato compartido con las ilustraciones por día** (no negociable, así hero y días se leen como una sola familia):
cámara con azimut 40° y elevación 30°; el mismo zócalo (losa con bisel y halo suave); rampas generadas desde
`--paper/--ink/--gold/--brown/--green/--coral` de `index.css` para claro y oscuro (como `kinkakujiIso.markup.ts`),
con `<style>` acotado a una clase propia; SVG en línea y `aria-hidden`; grosor de línea **0,8** en el hero (1200 de ancho) frente a 0,7 en los días;
una sola familia de acento por asset; movimiento solo con CSS, que se detiene con `prefers-reduced-motion`.

**Alcance (decisión del dueño)**: **todo** elemento gráfico de la portada pasa a ser una ilustración isométrica **animada** hecha con anatomy-asset.
No cuentan como gráficos el texto/tipografía (H1, subtítulo, párrafo, cifras, eyebrow con su filete) ni el mapa MapLibre en sí.
Los iconos funcionales de 16–20 px (flecha del CTA, pantalla completa, zoom ±) **se mantienen como iconos de línea**, porque un isométrico a 16 px no se lee y no cumple la regla de detalle de la skill.
Sí se rediseñan sus marcos (ver la tabla).

**Tema claro y oscuro** (igual que el Kinkaku-ji del día 21): SVG **en línea** en React, `aria-hidden`, con un `<style>` acotado a la clase del asset.
Las rampas se derivan al generar desde `--paper/--ink/--gold/--brown/--green/--coral`, y la variante oscura vive bajo `[data-theme="dark"] .clase`; `--anatomy-paper: var(--paper)` va en vivo.
Una sola geometría sirve para los dos temas: lo que solo existe de noche (luces encendidas) es un acento `ink` que el CSS oscuro activa y el claro deja apagado (sin duplicar el DOM, al contrario que hoy en `HeroDecor`).
**Requisito**: el fondo del hero pasa a ser `--paper` liso. El degradado actual (`Hero.tsx:40`) haría que los rellenos de los sólidos se vean como parches.
Con reduced-motion, cada asset queda en un fotograma fijo elegido (tren parado ante el torii, koinobori extendido).

### A · Recomendado: «Maqueta de tren al pie del Fuji» (set de 1 escena + 1 banda + 6 spots)

La pieza central es una maqueta ferroviaria sobre un zócalo de madera: un viaducto por el que pasa un shinkansen N700, el Fuji escalonado al fondo, un **torii bermellón** junto a la vía (el *momento*, acento `--coral`), pinos, un tōrō de piedra, un cerezo y un mástil de **koinobori** (las carpas de mayo, el mes del viaje).
Transmite «una vuelta completa en tren» y enlaza con las tarjetas de trayecto. **De noche** se encienden las ventanillas, el tōrō y dos chōchin de la marquesina del andén.

Inventario → sustituto (cada fila es un elemento gráfico del §2):

| Elemento actual | Sustituto isométrico | Nivel · partes | Movimiento solo CSS (reduced → fijo) |
|---|---|---|---|
| Monte Fuji (claro) | Fuji escalonado con nieve (cara `lit`) **dentro de** `hero-maqueta` | (Scene, ver abajo) | — |
| Bosque low-poly (claro) | Pinos sobre el zócalo de `hero-maqueta` + `banda-muro` | — | — |
| Rama de sakura con flores y capullos (claro) | Cerezo sobre el zócalo de `hero-maqueta` (acento rosa `body`) | — | 1 pétalo `amFloat` (solo claro) |
| Pétalos en canvas (global) | **Se elimina** el canvas; queda el pétalo de arriba dentro del SVG | — | (incluido arriba) |
| Pájaros lejanos (claro) | Koinobori en su mástil (3 carpas de tela con aros y cuerda) | — | `amSwing` lento de las carpas |
| Sol (claro) / Luna (oscuro) | **Desaparecen como forma**: el día o la noche se expresa con la luz de la escena (nieve `lit` de día; ventanillas, tōrō y chōchin encendidos de noche) | — | — |
| Guirnalda de farolillos 祭酒福灯 (oscuro) | Marquesina de andén con 2 chōchin en `hero-maqueta` (acento `ink` ámbar, encendidos solo de noche) | — | `amPulse` de la luz (solo oscuro) |
| Calle izakaya (oscuro) / borde inferior | `banda-muro`: muro de piedra con tejadillo, pinos y 3 tōrō, que hace de **transición** hero → «La ruta» | Asset · 60–80 | Luces de los tōrō con `amPulse` desfasado (solo oscuro); de día, estática |
| Chips de cifras (cajas sin icono) | Tira de billete con 4 spots: `spot-koyomi` (bloc de 21 hojas), `spot-machiya` (casa = bases), `spot-kippu` (billete JR con perforado = excursiones), `spot-maletas` (4 maletas = viajeros) | Spot ×4 · 25–35 c/u, grosor 0,5, mostrados a 48–56 px | Estáticos (el hero ya tiene 3 movimientos); hover → `amFloat` de 2 px |
| Aviso «Desplázate» (flecha con `ignBounce`) | `spot-michishirube`: poste indicador de madera con tablilla apuntando hacia abajo | Spot · 25–30 | `amSwing` de la tablilla (±3°) |
| ThemeToggle (iconos sol/luna) | `spot-toro-toggle`: tōrō pequeño, apagado en claro y encendido en oscuro (32 px dentro del botón de 50 px; el botón conserva `aria-label`) | Spot · 25–30 | Llama con `amPulse` (solo oscuro) |
| Marco del mapa: leyenda, marca de agua 日本一周, botón ampliar | El mapa sale a la banda «La ruta»; su cabecera lleva `spot-ruta` (tramo de vía con cartel de estación). La leyenda y la marca de agua son tipografía; el marco queda en CSS. **El mapa en sí no se ilustra**: los marcadores tienen que leerse a 13 px | Spot · 30–40 | Señal del cartel con `amBlink` lento |
| Scrollbar «farolillo» | Se queda como está (es UI del navegador y no admite SVG); es el único eco plano de chōchin | — | — |
| Círculo 桜 del pie | `spot-omamori` (amuleto con cordón y nudo) | Spot · 25–30 | Estático |

**`hero-maqueta`** reúne en una sola escena zócalo, viaducto con 2 pilas, vía con traviesas, 3 postes de catenaria, N700 con ventanillas, Fuji, torii, pinos, tōrō, cerezo, koinobori y marquesina con chōchin.
Es nivel **Scene, unas 130–150 partes**. Según la skill hay que dar estimación y ofrecer una versión Asset: el **núcleo Asset (~100 partes)** quitaría la marquesina y el koinobori, y la noche quedaría solo con ventanillas y tōrō.
Recomiendo la Scene, porque es la pieza que da la primera impresión.
Movimiento, **3 por tema como máximo**: de día, tren + koinobori + pétalo; de noche, tren + koinobori + luz de chōchin/tōrō.
El tren avanza un paso por el tramo frontal sin oclusiones (`amSlide`, 14 s con pausa), así que nunca altera el orden de pintado.

- **Composición**: lienzo de hero con el arte a la derecha (1200×640), arte en `{x:500,y:36,w:668,h:568}` y **zona segura** `{x:0,y:0,w:470,h:640}` para la fecha, el H1, la tira de billete y el CTA. El morro del tren y el torii miran a la izquierda, hacia el titular. En móvil, el mismo build exporta un `viewBox` recortado al área de arte (≈ 340×290 px) que va **encima** del título.
- **Mapa**: banda propia «La ruta» entre el hero y el journey (ancho completo, ~60vh). El CTA pasa a «Ver la ruta ↓».
- **Contrato con los días**: azimut 40°, elevación 30°, el mismo zócalo y los mismos tornillos y biseles, y una sola familia de acento por asset. Grosor 0,8 en el hero, 0,7 en la banda y en los días, y 0,5 en los spots. Todo sale de **un único script** con un módulo de cámara y zócalo compartido con el de las ilustraciones por día.

**Rendimiento** (el hero está sobre el pliegue y no puede ser lazy):

| Pieza | Sin comprimir (objetivo) | Brotli aprox. | Carga |
|---|---|---|---|
| `hero-maqueta` (Scene) | 180–240 KB | 40–55 KB | Crítica, pero **no bloquea el LCP** |
| 4 spots de la tira + `spot-michishirube` + `spot-toro-toggle` | 6 × 12–20 KB ≈ 100 KB | ≈ 25 KB | En el mismo chunk que el hero |
| `banda-muro`, `spot-ruta`, `spot-omamori` | 60–80 + 2 × 15 KB | ≈ 25 KB | Diferida (IntersectionObserver con `rootMargin: 600px`) |
| **Total del set** | **≈ 350–450 KB** (hoy `HeroDecor` son 96 KB más el canvas) | **≈ 90–105 KB** | |

Cómo mantenerlo ligero:
1. El LCP es el H1. El arte va en un chunk propio con `import()` lanzado al evaluar `Hero` (y `modulepreload`), dentro de una caja con `aspect-ratio` reservado, así que no hay CLS ni bloqueo.
2. Una sola geometría para los dos temas (hoy se pintan día y noche a la vez).
3. Una pasada de minificado de paths (como en `examples/feature-spots`, < 70 KB por spot): coordenadas a 1 decimal, sin caras ocultas y facetas 16–20 en cilindros pequeños.
4. Spike opcional: servir la geometría como `.svg` estático cacheado y referenciarlo con `<svg><use href="/art/hero.svg#art"/></svg>`, con las rampas en `index.css`. Así sale del JS, pero **hay que validar** que los tokens y las animaciones atraviesan el shadow tree de `<use>` en Chrome, Safari y Firefox. Si falla, se queda en línea.
5. Las animaciones solo usan `transform` y `opacity` (en el compositor) y se pausan con `animation-play-state` cuando el hero sale del viewport.

### B · Alternativa: «Diorama del archipiélago»

Honshu como losa tallada (Scene, 160 partes o más) con 6 mini-hitos sobre las bases unidos por una vía elevada.
Los mismos spots (tira, poste, toggle, omamori) y la misma banda; el mapa MapLibre solo como modal «Ver mapa interactivo».
Es más espectacular, pero **duplica el mapa**, exige geografía fiel, se adelanta a las 21 ilustraciones de hitos y pesa más (≈ 300 KB solo la escena).

**Por qué A**: una escena legible en 1× y rica en 4×, con zona segura real; habla del *viaje* mientras los días hablan de los *lugares*; resuelve la noche con la misma geometría; y su vocabulario (zócalo, piedra, madera) es el de las ilustraciones por día.

## 5. Plan por fases (sin chocar con la integración de ilustraciones)

Ficheros **bloqueados** mientras otros agentes integran las ilustraciones: `illustrations.tsx`, `illustrationKind.ts`, `DaySection.tsx`
(y en la práctica `KinkakujiIso.tsx`/`*.markup.ts`). Además, no cambiar `--paper/--gold/--brown/--green/--ink/--coral` hasta terminar, porque las
rampas de cada SVG se generan a partir de esos hex.

| Fase | Contenido | Ficheros | Bloqueo |
|---|---|---|---|
| 0 · Arreglos ya | Proveedor de teselas; tokens de texto con AA; anillo `:focus-visible`; tildes en etiquetas; pie con datos derivados | `HeroMap.tsx`, `index.css` (solo `--amber`, `--muted2`, `--muted-amber`, `--tick-idle-label` + foco), `zones.ts`, `SiteFooter.tsx` | Ninguno |
| 1 · Navegación y a11y | Rail como `<nav>` con enlaces y zona táctil de 24 px, rail móvil compacto, `scroll-margin-top`, aviso de scroll como `<button>`, `<main>` y skip-link, `h3` en zona, botones flotantes | `DayRail.tsx`, `scroll.ts`, `useScrollJourney.ts`, `Journey.tsx`, `Hero.tsx` (solo el aviso de scroll), `ZoneCard.tsx`, `ThemeToggle.tsx`, `ToTop.tsx`, `App.tsx` | Ninguno. `data-day` y el ancla los pone `DaySection` → usar `id` existente o esperar a la fase 3 para el `id` |
| 2 · Hero isométrico | Generar con anatomy-asset (un script) `hero-maqueta`, los 4 spots de la tira, `spot-michishirube` y `spot-toro-toggle`; nuevos `HeroArt.tsx` + `heroArt.markup.ts` (chunk propio) y `HeroSpots.tsx`; fondo del hero `--paper` liso; reordenar el hero (eyebrow, H1, tira de billete, CTA); nueva banda `RouteSection.tsx` con el mapa y su modal en portal; borrar `HeroDecor.tsx` y `SakuraPetals.tsx` y las reglas `data-day-decor/night-decor` | `Hero.tsx`, `HeroArt.tsx`★, `heroArt.markup.ts`★, `HeroSpots.tsx`★, `RouteSection.tsx`★, `HeroMap.tsx`, `ThemeToggle.tsx`, `App.tsx`, `index.css`, `src/features/landing/__tests__/` (nuevos) | Ninguno (★ ficheros nuevos) |
| 3 · Día (tras la integración) | Hueco propio para la ilustración en la cabecera del día, opacidad 1, `import()` diferido por día, `content-visibility`, `id="dia-NN"` | `DaySection.tsx`, `illustrations.tsx`, `SlotBlock.tsx`, `ZoneCard.tsx` | **Esperar** a que se fusionen las ilustraciones 9–29 |
| 4 · Pulido | Escala tipográfica como tokens `@theme`, migración a Tailwind por componente, fuentes con `<link>` y pesos mínimos, parallax con CSS scroll-driven, borrar `FanEditor`; `banda-muro`, `spot-ruta` y `spot-omamori` (diferidos) | `index.css`, `index.html`, `main.tsx`, `SiteFooter.tsx`, `RouteSection.tsx`, componentes de uno en uno | Después de la fase 3 |

## 6. Riesgos

- **Regenerar las rampas**: cualquier cambio en los tokens base de color invalida los SVG generados (hero y días). Hay que congelar la paleta base antes de la fase 2 o regenerarlo todo con un solo script.
- **Peso**: 21 ilustraciones más el hero en línea pueden superar 3 MB de JS si no se cargan en diferido (fase 3). Es el mayor riesgo técnico del rumbo isométrico.
- **Coherencia de la familia**: el hero a otra escala o con otro azimut se leería como «otro dibujante». Conviene construirlo con el mismo módulo de cámara y zócalo que los días.
- **Mapa**: un proveedor con clave expone la API key en el cliente (hay que restringirla por dominio). OpenFreeMap evita la clave, pero depende de un servicio comunitario.
- **Mover el mapa fuera del hero** cambia la primera impresión. Si el dueño lo quiere arriba, se puede mantener una miniatura del mapa en el hero y la banda ampliada debajo.
- **Movimiento**: el tren que avanza no debe cruzar piezas más cercanas, porque rompería el orden de pintado. Hay que limitarlo a un tramo sin oclusiones y comprobarlo con `--reduced` y en varios `--times`.
- **Conflictos de merge**: la fase 1 toca `Hero.tsx` y la fase 2 lo reescribe. Conviene hacerlas en ese orden o fusionarlas en un solo PR del hero.
