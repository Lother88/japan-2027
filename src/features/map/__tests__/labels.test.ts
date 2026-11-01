/**
 * Etiquetas del mapa de la ruta: cada ciudad tiene una colocación explícita (arriba, abajo,
 * izquierda, derecha…) respecto a su punto, elegida para que ninguna etiqueta se pise con
 * otra, con otro punto ni con los adornos del mapa (leyenda, marca de agua, botones) en el
 * encuadre inicial (fitBounds) de escritorio, tableta y móvil.
 */
import { cities, buildRouteLineString } from '@/data'
import {
  LABEL_PLACEMENT,
  MAP_LABEL_CITIES,
  dotSize,
  labelRect,
  markerLabel,
  type Rect,
} from '@/features/map/labels'

const FIT_PADDING = 54 // igual que fitToRoute en HeroMap

/** Proyección Web Mercator normalizada (0…1), como la de MapLibre antes de escalar. */
function mercator([lng, lat]: readonly number[]): { x: number; y: number } {
  const x = (lng + 180) / 360
  const s = Math.sin((lat * Math.PI) / 180)
  const y = 0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)
  return { x, y }
}

/** Encuadre de fitBounds: escala que cabe en el contenedor menos el padding, centrado. */
function project(width: number, height: number) {
  const pts = [
    ...buildRouteLineString().geometry.coordinates,
    ...MAP_LABEL_CITIES.filter((c) => c.kind === 'exc').map((c) => cityCenter(c.slug)),
  ].map(mercator)
  const minX = Math.min(...pts.map((p) => p.x))
  const maxX = Math.max(...pts.map((p) => p.x))
  const minY = Math.min(...pts.map((p) => p.y))
  const maxY = Math.max(...pts.map((p) => p.y))
  const scale = Math.min((width - 2 * FIT_PADDING) / (maxX - minX), (height - 2 * FIT_PADDING) / (maxY - minY))
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2
  return (lngLat: readonly number[]) => {
    const m = mercator(lngLat)
    return { x: width / 2 + (m.x - cx) * scale, y: height / 2 + (m.y - cy) * scale }
  }
}

function cityCenter(slug: string): readonly number[] {
  const c = cities.find((x) => x.slug === slug)
  if (!c) throw new Error(`falta la ciudad ${slug}`)
  return c.center
}

const overlaps = (a: Rect, b: Rect) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom

/** Adornos fijos sobre el mapa (RouteSection + HeroMap + control de zoom de MapLibre). */
function chrome(width: number, height: number): Array<[string, Rect]> {
  return [
    ['leyenda', { left: 14, top: 14, right: 14 + 168, bottom: 14 + 54 }],
    ['marca de agua', { left: 14, top: height - 14 - 40, right: 14 + 130, bottom: height - 14 }],
    ['botón ampliar', { left: width - 14 - 36, top: 14, right: width - 14, bottom: 14 + 36 }],
    ['zoom', { left: width - 10 - 29, top: height - 10 - 59, right: width - 10, bottom: height - 10 }],
  ]
}

// Contenedor [data-route-map] en cada ancho de referencia (ancho × alto).
const viewports: Array<[string, number, number]> = [
  ['escritorio 1440×900', 1244, 558],
  ['escritorio 1024×768', 942, 476],
  ['tableta 900×1000', 828, 620],
  ['móvil 390×844', 350, 523],
  ['móvil bajo (min-height)', 350, 340],
]

describe('colocación de las etiquetas del mapa', () => {
  it('hay una colocación para cada ciudad rotulada', () => {
    for (const c of MAP_LABEL_CITIES) expect(LABEL_PLACEMENT[c.slug], c.slug).toBeDefined()
  })

  it('Osaka/Nara y Shirakawa-go/Takayama quedan a lados opuestos', () => {
    const side = (slug: string) => LABEL_PLACEMENT[slug]
    expect(side('osaka')).toMatch(/left/)
    expect(side('nara')).toMatch(/right/)
    expect(side('shirakawago')).toMatch(/left/)
    expect(side('takayama')).toMatch(/right/)
  })

  it.each(viewports)('%s: ninguna etiqueta se solapa con otra, con un punto ni con los adornos', (_, w, h) => {
    const at = project(w, h)
    const placed = MAP_LABEL_CITIES.map((c) => {
      const p = at(cityCenter(c.slug))
      const size = dotSize(c.kind)
      return {
        slug: c.slug,
        label: labelRect(p, size, markerLabel(c.name), LABEL_PLACEMENT[c.slug]),
        dot: { left: p.x - size / 2, top: p.y - size / 2, right: p.x + size / 2, bottom: p.y + size / 2 },
      }
    })
    for (const a of placed) {
      expect(a.label.left, `${a.slug} se sale por la izquierda`).toBeGreaterThanOrEqual(0)
      expect(a.label.right, `${a.slug} se sale por la derecha`).toBeLessThanOrEqual(w)
      for (const b of placed) {
        if (a === b) continue
        expect(overlaps(a.label, b.label), `${a.slug} pisa la etiqueta de ${b.slug}`).toBe(false)
        expect(overlaps(a.label, b.dot), `${a.slug} pisa el punto de ${b.slug}`).toBe(false)
      }
      for (const [name, r] of chrome(w, h)) expect(overlaps(a.label, r), `${a.slug} pisa ${name}`).toBe(false)
    }
  })
})

describe('labelRect', () => {
  const p = { x: 100, y: 100 }
  it('a la derecha: empieza tras el punto, centrada en vertical', () => {
    const r = labelRect(p, 13, 'Nara', 'right')
    expect(r.left).toBeGreaterThan(106.5)
    expect((r.top + r.bottom) / 2).toBeCloseTo(100)
  })
  it('arriba: centrada en horizontal y por encima del punto', () => {
    const r = labelRect(p, 13, 'Kioto', 'top')
    expect((r.left + r.right) / 2).toBeCloseTo(100)
    expect(r.bottom).toBeLessThan(93.5)
  })
  it('las etiquetas largas son más anchas', () => {
    const a = labelRect(p, 13, 'Nara', 'right')
    const b = labelRect(p, 13, 'Shirakawa-go', 'right')
    expect(b.right - b.left).toBeGreaterThan(a.right - a.left)
  })
})
