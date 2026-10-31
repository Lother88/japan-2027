/**
 * Mapa base sin clave (OpenFreeMap) y estilo final del mapa del hero: recoloreado con la
 * paleta del sitio, sin etiquetas de ciudad del proveedor (las ponen nuestros marcadores)
 * y con la ruta y las excursiones como capas propias del estilo (sobreviven a setStyle).
 */
import type { StyleSpecification } from 'maplibre-gl'
import { BASEMAP_URLS, ROUTE_COLORS, buildMapStyle } from '@/features/map/basemap'

/** Estilo mínimo con la forma de los de OpenFreeMap (positron / dark). */
function providerStyle(): StyleSpecification {
  return {
    version: 8,
    glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
    sources: { openmaptiles: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' } },
    layers: [
      { id: 'background', type: 'background', paint: { 'background-color': 'rgb(242,243,240)' } },
      { id: 'water', type: 'fill', source: 'openmaptiles', 'source-layer': 'water', paint: { 'fill-color': 'rgb(194,200,202)' } },
      { id: 'label_city', type: 'symbol', source: 'openmaptiles', 'source-layer': 'place', layout: { 'text-field': '{name}' } },
      { id: 'place_town', type: 'symbol', source: 'openmaptiles', 'source-layer': 'place', layout: { 'text-field': '{name}' } },
      { id: 'label_country_1', type: 'symbol', source: 'openmaptiles', 'source-layer': 'place', layout: { 'text-field': '{name}' } },
    ],
  }
}

describe('BASEMAP_URLS', () => {
  it('usa estilos de OpenFreeMap sin API key', () => {
    expect(BASEMAP_URLS.light).toBe('https://tiles.openfreemap.org/styles/positron')
    expect(BASEMAP_URLS.dark).toBe('https://tiles.openfreemap.org/styles/dark')
    for (const url of Object.values(BASEMAP_URLS)) expect(url).not.toMatch(/key|token|carto/i)
  })
})

describe('buildMapStyle', () => {
  it.each(['light', 'dark'] as const)('tema %s: añade la ruta y las excursiones encima del mapa base', (mode) => {
    const style = buildMapStyle(providerStyle(), mode)
    expect(style.sources.route).toMatchObject({ type: 'geojson' })
    const ids = style.layers.map((l) => l.id)
    expect(ids.slice(-4)).toEqual(['exc0', 'exc1', 'exc2', 'route-line'])
    const route = style.layers.find((l) => l.id === 'route-line')
    expect(route?.type === 'line' && route.paint?.['line-color']).toBe(ROUTE_COLORS[mode])
  })

  it('recolorea el fondo y el agua con la paleta del tema', () => {
    const light = buildMapStyle(providerStyle(), 'light')
    const dark = buildMapStyle(providerStyle(), 'dark')
    const bg = (s: StyleSpecification) => {
      const l = s.layers.find((x) => x.id === 'background')
      return l?.type === 'background' ? l.paint?.['background-color'] : undefined
    }
    expect(bg(light)).not.toBe('rgb(242,243,240)')
    expect(bg(dark)).not.toBe(bg(light))
  })

  it('oculta las etiquetas de ciudad y de país del proveedor (las rotulan nuestros marcadores)', () => {
    const style = buildMapStyle(providerStyle(), 'light')
    const vis = (id: string) => style.layers.find((l) => l.id === id)?.layout
    expect(vis('label_city')).toMatchObject({ visibility: 'none' })
    expect(vis('place_town')).toMatchObject({ visibility: 'none' })
    expect(vis('label_country_1')).toMatchObject({ visibility: 'none' })
  })

  it('no muta el estilo del proveedor (se cachea y se reutiliza)', () => {
    const base = providerStyle()
    const snapshot = JSON.stringify(base)
    buildMapStyle(base, 'dark')
    expect(JSON.stringify(base)).toBe(snapshot)
  })
})
