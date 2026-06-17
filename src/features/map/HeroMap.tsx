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
const EXCURSION_CITY_SLUGS = ['shirakawago', 'hiroshima', 'nara', 'kamakura']

function citiesBySlugs(slugs: string[]) {
  return slugs
    .map((slug) => cities.find((c) => c.slug === slug))
    .filter((c): c is (typeof cities)[number] => c !== undefined)
}

const routeFeature = buildRouteLineString()
const excursionFeatures = buildExcursionLines()
const routeCities = citiesBySlugs(ROUTE_CITY_SLUGS)
const excursionCitiesList = citiesBySlugs(EXCURSION_CITY_SLUGS)

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

export default function HeroMap() {
  const containerRef = useRef<HTMLDivElement>(null)
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
    m.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')

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
      const bounds = new maplibregl.LngLatBounds()
      routeFeature.geometry.coordinates.forEach((c) => bounds.extend(c as [number, number]))
      excursionCitiesList.forEach((c) => bounds.extend([c.center[0], c.center[1]]))
      m.fitBounds(bounds, { padding: { top: 54, bottom: 54, left: 54, right: 54 }, duration: 0 })
    })

    return () => {
      try {
        m.remove()
      } catch {
        /* noop */
      }
    }
  }, [mode])

  return <div ref={containerRef} aria-label="Mapa de la ruta por Japón" style={{ position: 'absolute', inset: 0 }} />
}
