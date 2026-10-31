/**
 * HeroMap — mapa de la ruta para el hero (MapLibre GL imperativo).
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
 * Adaptativo al tema SIN recrear el mapa: hay una sola instancia y al cambiar de tema
 * se aplica el estilo del nuevo tema con `setStyle` (la ruta va dentro del estilo).
 * Los markers son DOM pintado con variables CSS, así que cambian solos con el tema.
 *
 * Defensivo: si no hay contexto WebGL (jsdom/tests) la inicialización se ignora
 * sin romper el render.
 */
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useEffectEvent, useRef, type RefObject } from 'react'
import maplibregl from 'maplibre-gl'
import { buildRouteLineString } from '@/data'
import { useThemeMode, type ThemeMode } from '@/features/landing/useThemeMode'
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

const routeFeature = buildRouteLineString()
const excursionCitiesList = MAP_LABEL_CITIES.filter((c) => c.kind === 'exc')

/** Superficie translúcida de etiquetas y botón (sigue a --surface en ambos temas). */
const GLASS = 'color-mix(in srgb, var(--surface) 92%, transparent)'

/** Encuadra el mapa sobre toda la ruta + extremos de excursión (instantáneo). */
function fitToRoute(m: maplibregl.Map) {
  const bounds = new maplibregl.LngLatBounds()
  routeFeature.geometry.coordinates.forEach((c) => bounds.extend(c as [number, number]))
  excursionCitiesList.forEach((c) => bounds.extend([c.center[0], c.center[1]]))
  m.fitBounds(bounds, { padding: { top: 54, bottom: 54, left: 54, right: 54 }, duration: 0 })
}

/**
 * Gestos según el modo. Maximizado → rueda con zoom directo (movilidad plena).
 * Minimizado → gestos cooperativos (la rueda hace scroll de la página; el zoom
 * pide Ctrl/⌘ + rueda), para no secuestrar el scroll cuando el mapa está embebido.
 */
function applyGestureMode(m: maplibregl.Map, expanded: boolean) {
  if (expanded) m.cooperativeGestures?.disable()
  else m.cooperativeGestures?.enable()
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

/**
 * Pide el estilo del tema y lo aplica a la instancia si sigue siendo la vigente y nadie
 * ha pedido otro tema mientras tanto (los cambios rápidos no dejan un estilo antiguo).
 */
function requestStyle(
  m: maplibregl.Map,
  next: ThemeMode,
  mapRef: RefObject<maplibregl.Map | null>,
  styleModeRef: RefObject<ThemeMode | null>,
) {
  styleModeRef.current = next
  loadBasemap(next)
    .then((base) => {
      if (mapRef.current !== m || styleModeRef.current !== next) return
      m.setStyle(buildMapStyle(base, next))
    })
    .catch(() => {
      // Sin red: el mapa conserva el último estilo aplicado (o queda vacío la 1.ª vez).
    })
}

interface HeroMapProps {
  /** Si el mapa ocupa toda la pantalla (controlado por el contenedor). */
  expanded: boolean
  /** Alterna el modo pantalla completa. */
  onToggleExpand: () => void
}

export default function HeroMap({ expanded, onToggleExpand }: HeroMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  /** Tema del último estilo pedido: descarta respuestas de un tema ya superado. */
  const styleModeRef = useRef<ThemeMode | null>(null)
  const { mode } = useThemeMode()

  // Valores vivos para el efecto de creación (que corre una sola vez).
  const initialState = useEffectEvent(() => ({ mode, expanded }))

  // Creación: una única instancia de MapLibre durante toda la vida del componente.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const { mode: initialMode, expanded: initialExpanded } = initialState()

    let map: maplibregl.Map | undefined
    try {
      map = new maplibregl.Map({
        container,
        center: [137.2, 36.4],
        zoom: 4.6,
        attributionControl: { compact: true },
        cooperativeGestures: true,
      })
    } catch {
      // Sin WebGL (tests/SSR): se omite la inicialización.
      return
    }

    const m = map
    mapRef.current = m
    requestStyle(m, initialMode, mapRef, styleModeRef)
    applyGestureMode(m, initialExpanded)
    // Zoom abajo-derecha: deja libre la esquina superior derecha para el botón de maximizar.
    m.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')

    // Markers: DOM fuera del estilo, sobreviven a setStyle. Anclados por el centro del punto.
    MAP_LABEL_CITIES.forEach((c) => {
      new maplibregl.Marker({ element: makeMarkerEl(c), anchor: 'center' })
        .setLngLat([c.center[0], c.center[1]])
        .addTo(m)
    })
    fitToRoute(m)

    // Precarga el estilo del otro tema para que el cambio sea inmediato.
    const other: ThemeMode = initialMode === 'dark' ? 'light' : 'dark'
    const idle = window.setTimeout(() => void loadBasemap(other).catch(() => {}), 1500)

    return () => {
      window.clearTimeout(idle)
      try {
        m.remove()
      } catch {
        /* noop */
      }
      mapRef.current = null
      styleModeRef.current = null
    }
  }, [])

  // Cambio de tema: misma instancia, nuevo estilo (MapLibre aplica el diff).
  useEffect(() => {
    const m = mapRef.current
    if (!m || styleModeRef.current === mode) return
    requestStyle(m, mode, mapRef, styleModeRef)
  }, [mode])

  // Al alternar maximizado: ajusta los gestos (rueda directa solo en pantalla
  // completa), avisa a MapLibre del cambio de tamaño (resize) y reencuadra la ruta.
  useEffect(() => {
    const m = mapRef.current
    if (!m) return
    applyGestureMode(m, expanded)
    const raf = requestAnimationFrame(() => {
      m.resize()
      fitToRoute(m)
    })
    return () => cancelAnimationFrame(raf)
  }, [expanded])

  // Mientras está a pantalla completa: bloquea el scroll del body y Esc cierra.
  useEffect(() => {
    if (!expanded) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onToggleExpand()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [expanded, onToggleExpand])

  return (
    <div
      style={
        expanded
          ? { position: 'fixed', inset: 0, zIndex: 1000, background: 'var(--surface)' }
          : { position: 'absolute', inset: 0 }
      }
    >
      <div ref={containerRef} aria-label="Mapa de la ruta por Japón" style={{ position: 'absolute', inset: 0 }} />

      <button
        type="button"
        onClick={onToggleExpand}
        aria-label={expanded ? 'Cerrar pantalla completa del mapa' : 'Ver el mapa a pantalla completa'}
        title={expanded ? 'Cerrar (Esc)' : 'Pantalla completa'}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          zIndex: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          padding: 0,
          background: GLASS,
          color: 'var(--ink)',
          border: '1px solid color-mix(in srgb, var(--ink) 16%, transparent)',
          borderRadius: '9px',
          cursor: 'pointer',
          boxShadow: '0 4px 14px -6px rgba(0,0,0,.35)',
          backdropFilter: 'blur(6px)',
          transition: 'transform .15s ease',
        }}
      >
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {expanded ? (
            <path d="M18 6 6 18M6 6l12 12" />
          ) : (
            <path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3m13 5h3a2 2 0 0 0 2-2v-3" />
          )}
        </svg>
      </button>
    </div>
  )
}
