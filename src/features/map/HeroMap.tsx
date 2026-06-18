/**
 * HeroMap — mapa de la ruta para el hero (MapLibre GL imperativo).
 *
 * Reproduce el mapa del diseño: base raster CARTO (claro/oscuro según tema),
 * ruta principal (navy en claro / coral en oscuro), excursiones (línea
 * discontinua dorada), markers de ciudad (círculo rojo + etiqueta) y de
 * excursión/day-trip (rombo dorado + etiqueta), encuadre con fitBounds y gestos
 * cooperativos. ADR-001: MapLibre confinado a features/map.
 *
 * Adaptativo al tema: al cambiar de tema el mapa se recrea por completo
 * (cleanup + nueva instancia) para refrescar tiles, colores de ruta y markers.
 *
 * Defensivo: si no hay contexto WebGL (jsdom/tests) la inicialización se ignora
 * sin romper el render.
 */
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import { cities, buildRouteLineString, buildExcursionLines } from '@/data'
import { useThemeMode, type ThemeMode } from '@/features/landing/useThemeMode'

/** Ciudades de pernocta en orden de ruta (dedup: Tokio aparece 2 veces). */
const ROUTE_CITY_SLUGS = ['tokio', 'takaragawa', 'kanazawa', 'takayama', 'kioto', 'osaka']
/** Destinos de excursión / day-trip (sin pernocta). */
const EXCURSION_CITY_SLUGS = ['shirakawago', 'hiroshima', 'nara']

function citiesBySlugs(slugs: string[]) {
  return slugs
    .map((slug) => cities.find((c) => c.slug === slug))
    .filter((c): c is (typeof cities)[number] => c !== undefined)
}

const routeFeature = buildRouteLineString()
const excursionFeatures = buildExcursionLines()
const routeCities = citiesBySlugs(ROUTE_CITY_SLUGS)
const excursionCitiesList = citiesBySlugs(EXCURSION_CITY_SLUGS)

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

/** Estilo raster CARTO según tema: `dark_all` en oscuro, `light_all` en claro. */
function buildCartoStyle(mode: ThemeMode) {
  const base = mode === 'dark' ? 'dark_all' : 'light_all'
  return {
    version: 8,
    sources: {
      carto: {
        type: 'raster',
        tiles: [
          `https://a.basemaps.cartocdn.com/${base}/{z}/{x}/{y}@2x.png`,
          `https://b.basemaps.cartocdn.com/${base}/{z}/{x}/{y}@2x.png`,
          `https://c.basemaps.cartocdn.com/${base}/{z}/{x}/{y}@2x.png`,
          `https://d.basemaps.cartocdn.com/${base}/{z}/{x}/{y}@2x.png`,
        ],
        tileSize: 256,
        maxzoom: 19,
        attribution: '© OpenStreetMap, © CARTO',
      },
    },
    layers: [{ id: 'carto', type: 'raster', source: 'carto' }],
  } as const
}

function makeMarkerEl(label: string, kind: 'city' | 'exc', mode: ThemeMode): HTMLDivElement {
  const dark = mode === 'dark'
  // Colores de etiqueta y superficie según tema (valores de --surface por tema).
  const tagText = dark ? '#f1ece1' : '#1b2a4a'
  const tagBg = dark ? 'rgba(29,32,48,.92)' : 'rgba(255,253,249,.92)'
  const surface = dark ? '#1d2030' : '#fffdf9'

  const el = document.createElement('div')
  el.style.cssText = 'display:flex;flex-direction:column;align-items:center;cursor:default'
  const dot = document.createElement('div')
  const isExc = kind === 'exc'
  dot.style.cssText =
    'width:' + (isExc ? 9 : 13) + 'px;height:' + (isExc ? 9 : 13) + 'px;' +
    'border-radius:' + (isExc ? '2px' : '50%') + ';' +
    'background:' + (isExc ? '#c79a44' : '#e0564b') + ';' +
    'border:2px solid ' + surface + ';box-shadow:0 1px 3px rgba(0,0,0,.35);' +
    (isExc ? 'transform:rotate(45deg)' : '')
  const tag = document.createElement('div')
  tag.textContent = label
  tag.style.cssText =
    "margin-top:5px;font:600 11px/1 'Zen Kaku Gothic New',sans-serif;color:" + tagText + ';' +
    'background:' + tagBg + ';padding:2px 6px;border-radius:4px;white-space:nowrap;' +
    'box-shadow:0 1px 2px rgba(0,0,0,.14)'
  el.appendChild(dot)
  el.appendChild(tag)
  return el
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
  // Valor vivo de `expanded` para el efecto de creación (deps [mode]): al recrear
  // el mapa por cambio de tema, aplica los gestos correctos sin recrearse al maximizar.
  const expandedRef = useRef(expanded)
  expandedRef.current = expanded
  const { mode } = useThemeMode()

  // El efecto depende de `mode`: al cambiar de tema se limpia el mapa anterior
  // (cleanup → map.remove()) y se recrea con tiles y colores del nuevo tema.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Color de la ruta principal según tema (valores de --map-line).
    const routeColor = mode === 'dark' ? '#ff8a5c' : '#1b2a4a'

    let map: maplibregl.Map | undefined
    try {
      map = new maplibregl.Map({
        container,
        // El objeto de estilo raster cumple StyleSpecification en runtime.
        style: buildCartoStyle(mode) as unknown as maplibregl.StyleSpecification,
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
    // Si se recrea estando maximizado (cambio de tema), conserva la rueda directa.
    applyGestureMode(m, expandedRef.current)
    // Zoom abajo-derecha: deja libre la esquina superior derecha para el botón
    // de maximizar.
    m.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')

    m.on('load', () => {
      // Ruta principal
      m.addSource('route', { type: 'geojson', data: routeFeature })
      m.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': routeColor, 'line-width': 3, 'line-opacity': 0.85 },
      })

      // Excursiones (línea discontinua dorada — igual en ambos temas)
      excursionFeatures.forEach((feat, i) => {
        const id = 'exc' + i
        m.addSource(id, { type: 'geojson', data: feat })
        m.addLayer({
          id,
          type: 'line',
          source: id,
          paint: { 'line-color': '#c79a44', 'line-width': 2, 'line-dasharray': [1.5, 1.5], 'line-opacity': 0.9 },
        })
      })

      // Markers
      routeCities.forEach((c) => {
        new maplibregl.Marker({ element: makeMarkerEl(c.name.replace(/\s*\(.*\)/, ''), 'city', mode), anchor: 'bottom' })
          .setLngLat([c.center[0], c.center[1]])
          .addTo(m)
      })
      excursionCitiesList.forEach((c) => {
        new maplibregl.Marker({ element: makeMarkerEl(c.name, 'exc', mode), anchor: 'bottom' })
          .setLngLat([c.center[0], c.center[1]])
          .addTo(m)
      })

      // Encuadre incluyendo extremos de excursión
      fitToRoute(m)
    })

    return () => {
      try {
        m.remove()
      } catch {
        /* noop */
      }
      mapRef.current = null
    }
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

  // Colores del botón según tema (mismos valores que los markers).
  const dark = mode === 'dark'
  const btnBg = dark ? 'rgba(29,32,48,.92)' : 'rgba(255,253,249,.92)'
  const btnFg = dark ? '#f1ece1' : '#1b2a4a'
  const btnBorder = dark ? 'rgba(241,236,225,.18)' : 'rgba(27,42,74,.16)'

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
          background: btnBg,
          color: btnFg,
          border: '1px solid ' + btnBorder,
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
