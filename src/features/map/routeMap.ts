/**
 * routeMap — mapa de la ruta (MapLibre GL, imperativo y sin framework).
 *
 * Mapa base vectorial de OpenFreeMap (sin API key) recoloreado con la paleta del sitio
 * (ver `basemap.ts`), ruta principal (navy en claro / coral en oscuro), excursiones
 * (línea discontinua dorada), markers de ciudad (círculo rojo + etiqueta) y de
 * excursión/day-trip (rombo dorado + etiqueta), encuadre con fitBounds y gestos
 * cooperativos. ADR-001: MapLibre confinado a features/map.
 *
 * Cada marker se ancla por el centro de su punto (la ruta pasa por él) y la etiqueta va a
 * un lado fijo por ciudad (`labels.ts`) para que ninguna se pise en el encuadre inicial.
 *
 * Adaptativo al tema SIN recrear el mapa: hay una sola instancia y, al cambiar `data-theme` en
 * <html> (MutationObserver), se aplica el estilo del nuevo tema con `setStyle` (la ruta va
 * dentro del estilo). Los markers son DOM pintado con variables CSS: cambian solos.
 *
 * Pantalla completa: el envoltorio pasa a `position: fixed` (z-index 1000) sin portal; ningún
 * ancestro crea contexto de apilamiento (ver RouteSection.astro). Mientras dura, la rueda hace
 * zoom directo, el scroll del body se bloquea y Esc cierra. Embebido, gestos cooperativos: la
 * rueda desplaza la página y el zoom pide Ctrl/⌘ + rueda.
 *
 * MapLibre 6 es solo ESM (exports con nombre) y calcula la URL de su worker con
 * `import.meta.url`, que al empaquetar apunta al chunk: se le da la URL emitida por Vite.
 * Su CSS se enlaza desde aquí (`?url` + <link>) y no con un import de CSS: Astro sube los CSS
 * importados por los scripts de la página a <link> bloqueantes en el <head>, también los de
 * chunks diferidos como este.
 */
import mapCssUrl from 'maplibre-gl/dist/maplibre-gl.css?url'
import {
  LngLatBounds,
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  setWorkerUrl,
} from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import { buildRouteLineString } from '@/data'
import { currentTheme, type ThemeMode } from '@/lib/themeMode'
import { buildMapStyle, loadBasemap } from '@/features/map/basemap'
import {
  LABEL_HEIGHT,
  LABEL_PAD_X,
  LABEL_PLACEMENT,
  MAP_LABEL_CITIES,
  dotSize,
  labelOffset,
  markerLabel,
  type MapLabelCity,
} from '@/features/map/labels'

setWorkerUrl(workerUrl)

const routeFeature = buildRouteLineString()
const excursionCitiesList = MAP_LABEL_CITIES.filter((c) => c.kind === 'exc')

/** Superficie translúcida de etiquetas y botón (sigue a --surface en ambos temas). */
const GLASS = 'color-mix(in srgb, var(--surface) 92%, transparent)'

const ICON_EXPAND = 'M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3m13 5h3a2 2 0 0 0 2-2v-3'
const ICON_CLOSE = 'M18 6 6 18M6 6l12 12'

/** Encuadra el mapa sobre toda la ruta + extremos de excursión (instantáneo). */
function fitToRoute(m: MapLibreMap) {
  const bounds = new LngLatBounds()
  routeFeature.geometry.coordinates.forEach((c) => bounds.extend(c as [number, number]))
  excursionCitiesList.forEach((c) => bounds.extend([c.center[0], c.center[1]]))
  m.fitBounds(bounds, { padding: { top: 54, bottom: 54, left: 54, right: 54 }, duration: 0 })
}

/**
 * Marker DOM pintado con tokens CSS (se adapta al tema sin recrearse): el elemento es el
 * punto, centrado en la ciudad, y la etiqueta cuelga de él en posición absoluta.
 */
function makeMarkerEl(city: MapLabelCity): HTMLDivElement {
  const isExc = city.kind === 'exc'
  const size = dotSize(city.kind)
  const placement = LABEL_PLACEMENT[city.slug] ?? 'bottom'
  // Caja del marker (MapLibre la posiciona con su propio transform): solo da el tamaño.
  const el = document.createElement('div')
  el.style.cssText = 'cursor:default;width:' + size + 'px;height:' + size + 'px'
  // Punto: círculo (ciudad) o rombo girado (excursión), con borde del color de la superficie.
  const dot = document.createElement('div')
  dot.style.cssText =
    'position:absolute;inset:0;' +
    'border-radius:' + (isExc ? '2px' : '50%') + ';' +
    'background:' + (isExc ? 'var(--amber-deep)' : 'var(--coral2)') + ';' +
    'border:2px solid var(--surface);box-shadow:0 1px 3px rgba(0,0,0,.35)' +
    (isExc ? ';transform:rotate(45deg)' : '')
  // Etiqueta: su ancla se mide desde el centro del punto (misma geometría que labelRect).
  const o = labelOffset(placement, size)
  const tag = document.createElement('div')
  tag.dataset.mapLabel = ''
  tag.dataset.placement = placement
  tag.textContent = markerLabel(city.name)
  tag.style.cssText =
    'position:absolute;left:calc(50% + ' + o.x + 'px);top:calc(50% + ' + o.y + 'px);' +
    'transform:translate(' + o.fx * 100 + '%,' + o.fy * 100 + '%);' +
    'box-sizing:border-box;height:' + LABEL_HEIGHT + 'px;padding:2px ' + LABEL_PAD_X + 'px;' +
    'font:600 11px/1 var(--font-sans);color:var(--ink);' +
    'background:' + GLASS + ';border-radius:4px;white-space:nowrap;' +
    'box-shadow:0 1px 2px rgba(0,0,0,.14)'
  el.append(dot, tag)
  return el
}

/** Botón de pantalla completa (hover y presión en index.css, [data-map-expand]). */
function makeExpandButton(): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.dataset.mapExpand = ''
  button.style.cssText =
    'position:absolute;top:14px;right:14px;z-index:6;display:flex;align-items:center;' +
    'justify-content:center;width:36px;height:36px;padding:0;background:' + GLASS + ';' +
    'color:var(--ink);border:1px solid color-mix(in srgb, var(--ink) 16%, transparent);' +
    'border-radius:9px;cursor:pointer;box-shadow:0 4px 14px -6px rgba(0,0,0,.35);' +
    'backdrop-filter:blur(6px)'
  button.innerHTML =
    '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="' + ICON_EXPAND + '"/></svg>'
  return button
}

const EMBEDDED = 'position:absolute;inset:0'
const FULLSCREEN = 'position:fixed;inset:0;z-index:1000;background:var(--surface)'

/** Enlaza la hoja de MapLibre (una vez) y resuelve cuando está aplicada. */
function loadMapCss(): Promise<void> {
  return new Promise((resolve) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = mapCssUrl
    // Si falla, el mapa funciona igual (los controles salen sin estilo): no se bloquea.
    link.onload = link.onerror = () => resolve()
    document.head.append(link)
  })
}

/** Monta el mapa en la caja [data-route-map] (una sola vez). */
export async function mountRouteMap(box: HTMLElement): Promise<void> {
  await loadMapCss()
  const wrapper = document.createElement('div')
  wrapper.style.cssText = EMBEDDED
  const container = document.createElement('div')
  container.setAttribute('aria-label', 'Mapa de la ruta por Japón')
  container.style.cssText = 'position:absolute;inset:0'
  const expandButton = makeExpandButton()
  wrapper.append(container, expandButton)
  // Primer hijo: la leyenda y la marca de agua (z-index 5) quedan encima del lienzo embebido.
  box.prepend(wrapper)

  let map: MapLibreMap
  try {
    map = new MapLibreMap({
      container,
      center: [137.2, 36.4],
      zoom: 4.6,
      attributionControl: { compact: true },
      cooperativeGestures: true,
    })
  } catch {
    // Sin WebGL: sin mapa (la caja conserva la leyenda y la marca de agua).
    wrapper.remove()
    return
  }

  /** Tema del último estilo pedido: descarta respuestas de un tema ya superado. */
  let styleMode: ThemeMode | null = null
  const requestStyle = (mode: ThemeMode) => {
    styleMode = mode
    loadBasemap(mode)
      .then((base) => {
        if (styleMode === mode) map.setStyle(buildMapStyle(base, mode))
      })
      .catch(() => {
        // Sin red: el mapa conserva el último estilo aplicado (o queda vacío la 1.ª vez).
      })
  }

  const initialMode = currentTheme()
  requestStyle(initialMode)
  // Zoom abajo-derecha: deja libre la esquina superior derecha para el botón de maximizar.
  map.addControl(new NavigationControl({ showCompass: false }), 'bottom-right')
  // Markers: DOM fuera del estilo, sobreviven a setStyle. Anclados por el centro del punto.
  MAP_LABEL_CITIES.forEach((c) => {
    new Marker({ element: makeMarkerEl(c), anchor: 'center' }).setLngLat([c.center[0], c.center[1]]).addTo(map)
  })
  fitToRoute(map)

  // Precarga el estilo del otro tema para que el cambio sea inmediato.
  const other: ThemeMode = initialMode === 'dark' ? 'light' : 'dark'
  window.setTimeout(() => void loadBasemap(other).catch(() => {}), 1500)

  // Cambio de tema: misma instancia, nuevo estilo (MapLibre aplica el diff).
  new MutationObserver(() => {
    const mode = currentTheme()
    if (mode !== styleMode) requestStyle(mode)
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  /* ── Pantalla completa ── */
  let expanded = false
  let prevOverflow = ''

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') setExpanded(false)
  }

  function setExpanded(next: boolean) {
    if (next === expanded) return
    expanded = next
    wrapper.style.cssText = next ? FULLSCREEN : EMBEDDED
    const label = next ? 'Cerrar pantalla completa del mapa' : 'Ver el mapa a pantalla completa'
    expandButton.setAttribute('aria-label', label)
    expandButton.title = next ? 'Cerrar (Esc)' : 'Pantalla completa'
    expandButton.querySelector('path')?.setAttribute('d', next ? ICON_CLOSE : ICON_EXPAND)
    // Rueda directa solo a pantalla completa; embebido, gestos cooperativos.
    if (next) map.cooperativeGestures.disable()
    else map.cooperativeGestures.enable()
    if (next) {
      prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKey)
    } else {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
    // Avisa a MapLibre del nuevo tamaño y reencuadra la ruta.
    requestAnimationFrame(() => {
      map.resize()
      fitToRoute(map)
    })
  }

  expandButton.setAttribute('aria-label', 'Ver el mapa a pantalla completa')
  expandButton.title = 'Pantalla completa'
  expandButton.addEventListener('click', () => setExpanded(!expanded))
}
