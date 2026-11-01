/**
 * Mapa base del HeroMap: estilos vectoriales de OpenFreeMap (sin API key) adaptados a
 * la paleta del sitio, con la ruta y las excursiones como capas propias del estilo.
 *
 * Al ir la ruta DENTRO del estilo, cambiar de tema es un único `map.setStyle(estilo)`
 * sobre la misma instancia: MapLibre calcula el diff (mismas fuentes, otros colores) y
 * el lienzo nunca se queda vacío. Los estilos del proveedor se descargan una vez y se
 * cachean por tema.
 *
 * Atribución: OpenFreeMap © OpenMapTiles, datos de © OpenStreetMap. La declara el
 * TileJSON de la fuente `openmaptiles` y MapLibre la muestra en su AttributionControl.
 */
import type { LayerSpecification, StyleSpecification } from 'maplibre-gl'
import { buildRouteLineString, buildExcursionLines } from '@/data'
import type { ThemeMode } from '@/lib/themeMode'

/** Estilos sin clave de OpenFreeMap: «positron» (claro) y «dark» (oscuro). */
export const BASEMAP_URLS: Readonly<Record<ThemeMode, string>> = {
  light: 'https://tiles.openfreemap.org/styles/positron',
  dark: 'https://tiles.openfreemap.org/styles/dark',
}

/** Color de la ruta principal (mismos valores que --map-line en index.css). */
export const ROUTE_COLORS: Readonly<Record<ThemeMode, string>> = {
  light: '#1b2a4a',
  dark: '#ff8a5c',
}

/** Excursiones: discontinua dorada (--amber-deep claro), igual en ambos temas. */
const EXCURSION_COLOR = '#c79a44'

/**
 * Paleta del mapa base por tema: tierra y agua cálidas en claro (washi, como --paper /
 * --surface-sun) y azul noche en oscuro (como --paper / --surface oscuros).
 */
const BASEMAP_PALETTE: Readonly<Record<ThemeMode, Readonly<Record<string, string>>>> = {
  light: {
    background: '#f4ede2',
    water: '#cfdcd9',
    park: '#e6e9da',
    landuse_park: '#e6e9da',
    landcover_wood: '#e2e6d4',
    landuse_residential: '#efe6d8',
    building: '#ebe1d2',
  },
  dark: {
    background: '#252a3a',
    water: '#11131a',
    park: '#262e35',
    landuse_park: '#262e35',
    landcover_wood: '#262e35',
    landuse_residential: '#2a2f40',
    building: '#282d3d',
  },
}

/**
 * Etiquetas de población del proveedor (positron usa `label_*`, dark usa `place_*`):
 * se ocultan porque nuestros marcadores ya rotulan las ciudades de la ruta y se pisarían.
 * También el rótulo «JAPAN 日本», que cae encima de la ruta. Se conservan prefecturas y mares.
 */
const HIDDEN_LABEL = /^(label|place)_(city|city_capital|city_large|town|village|other|suburb|country_[a-z0-9_]+)$/

const routeFeature = buildRouteLineString()
const excursionFeatures = buildExcursionLines()

function recolor(layer: LayerSpecification, palette: Readonly<Record<string, string>>): LayerSpecification {
  const color = palette[layer.id]
  if (!color) return layer
  if (layer.type === 'background') return { ...layer, paint: { ...layer.paint, 'background-color': color } }
  if (layer.type === 'fill') return { ...layer, paint: { ...layer.paint, 'fill-color': color } }
  return layer
}

function hideCityLabels(layer: LayerSpecification): LayerSpecification {
  if (layer.type !== 'symbol' || !HIDDEN_LABEL.test(layer.id)) return layer
  return { ...layer, layout: { ...layer.layout, visibility: 'none' } }
}

/**
 * Estilo final del mapa para un tema: mapa base recoloreado + ruta y excursiones encima.
 * Pura: no muta `base` (el estilo del proveedor se cachea y se reutiliza).
 */
export function buildMapStyle(base: StyleSpecification, mode: ThemeMode): StyleSpecification {
  const palette = BASEMAP_PALETTE[mode]
  const excursionSources = Object.fromEntries(
    excursionFeatures.map((feat, i) => [`exc${i}`, { type: 'geojson' as const, data: feat }]),
  )
  const excursionLayers: LayerSpecification[] = excursionFeatures.map((_, i) => ({
    id: `exc${i}`,
    type: 'line',
    source: `exc${i}`,
    paint: { 'line-color': EXCURSION_COLOR, 'line-width': 2, 'line-dasharray': [1.5, 1.5], 'line-opacity': 0.9 },
  }))

  return {
    ...base,
    sources: {
      ...base.sources,
      ...excursionSources,
      route: { type: 'geojson', data: routeFeature },
    },
    layers: [
      ...base.layers.map((l) => hideCityLabels(recolor(l, palette))),
      ...excursionLayers,
      {
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': ROUTE_COLORS[mode], 'line-width': 3, 'line-opacity': 0.85 },
      },
    ],
  }
}

const cache = new Map<ThemeMode, Promise<StyleSpecification>>()

/** Descarga (una vez por tema) el estilo del proveedor. Un fallo no queda cacheado. */
export function loadBasemap(mode: ThemeMode): Promise<StyleSpecification> {
  let pending = cache.get(mode)
  if (!pending) {
    pending = fetch(BASEMAP_URLS[mode]).then((res) => {
      if (!res.ok) throw new Error(`Estilo del mapa base no disponible (${res.status})`)
      return res.json() as Promise<StyleSpecification>
    })
    pending.catch(() => cache.delete(mode))
    cache.set(mode, pending)
  }
  return pending
}
