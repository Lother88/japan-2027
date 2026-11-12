/**
 * Marcadores del mapa de la ruta: qué ciudades se rotulan, el tamaño de su punto y dónde va
 * cada etiqueta respecto a él.
 *
 * Las etiquetas son DOM (tipografía del sitio y colores por variables CSS, así que siguen al
 * tema y sobreviven a `setStyle`), pero sin detección de colisiones: en su lugar cada ciudad
 * tiene una colocación explícita, elegida para que ninguna se pise en el encuadre inicial de
 * escritorio y móvil.
 * Es más predecible que una capa `symbol` con colisiones, que en móvil OCULTARÍA Osaka o
 * Nara en vez de apartarlas.
 *
 * `labelOffset` es la única fuente de la geometría de la etiqueta (la usa routeMap.ts).
 */
import { cities } from '@/data'

export type MarkerKind = 'city' | 'exc'

export type LabelPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

/** Ciudades de pernocta en orden de ruta (sin repetir Tokio). */
const ROUTE_CITY_SLUGS = ['tokio', 'takaragawa', 'kanazawa', 'takayama', 'kioto', 'osaka']
/** Destinos de excursión / day-trip (sin pernocta). */
const EXCURSION_CITY_SLUGS = ['shirakawago', 'hiroshima', 'nara', 'katsuoji']

export interface MapLabelCity {
  readonly slug: string
  readonly name: string
  readonly center: readonly [number, number]
  readonly kind: MarkerKind
}

function pick(slugs: readonly string[], kind: MarkerKind): MapLabelCity[] {
  return slugs.flatMap((slug) => {
    const c = cities.find((x) => x.slug === slug)
    return c ? [{ slug, name: c.name, center: [c.center[0], c.center[1]] as const, kind }] : []
  })
}

/** Ciudades rotuladas: primero las de pernocta, después las excursiones. */
export const MAP_LABEL_CITIES: readonly MapLabelCity[] = [
  ...pick(ROUTE_CITY_SLUGS, 'city'),
  ...pick(EXCURSION_CITY_SLUGS, 'exc'),
]

/**
 * Dónde va cada etiqueta. Los pares que se pisaban con la etiqueta centrada bajo el punto
 * (Osaka/Nara, Shirakawa-go/Takayama) se separan a lados opuestos; Kioto, encima de ambos,
 * va arriba; Shirakawa-go baja a la izquierda para no tocar el punto de Kanazawa en móvil, y
 * Hiroshima va arriba para no caer sobre la marca de agua 日本一周 (abajo a la izquierda).
 */
export const LABEL_PLACEMENT: Readonly<Record<string, LabelPlacement>> = {
  tokio: 'bottom',
  takaragawa: 'top',
  kanazawa: 'top-left',
  takayama: 'right',
  kioto: 'top',
  osaka: 'left',
  shirakawago: 'bottom-left',
  hiroshima: 'top',
  nara: 'right',
  katsuoji: 'top-left',
}

/** Lado del punto de cada tipo (px): círculo de 13 px / rombo de 9 px. */
export function dotSize(kind: MarkerKind): number {
  return kind === 'city' ? 13 : 9
}

/** Separación entre el borde del punto y la etiqueta (px). */
const LABEL_GAP = 5
/** Alto de la etiqueta: 11 px de letra con interlineado 1 + 2 px de padding arriba y abajo. */
export const LABEL_HEIGHT = 15
/** Padding horizontal de la etiqueta (px por lado). */
export const LABEL_PAD_X = 6

/** Nombre corto de la etiqueta: sin el paréntesis («Tokio (…)» → «Tokio»). */
export function markerLabel(name: string): string {
  return name.replace(/\s*\(.*\)/, '')
}

/**
 * Posición de la etiqueta relativa al CENTRO del punto: el punto (x, y) en px donde va su
 * ancla, y qué fracción del propio tamaño hay que desplazarla (0 = alineada por la izquierda
 * o arriba, -0,5 = centrada, -1 = alineada por la derecha o abajo).
 */
export function labelOffset(
  placement: LabelPlacement,
  size: number,
): { x: number; y: number; fx: 0 | -0.5 | -1; fy: 0 | -0.5 | -1 } {
  const off = size / 2 + LABEL_GAP
  const d = Math.round(off * 0.75)
  switch (placement) {
    case 'right':
      return { x: off, y: 0, fx: 0, fy: -0.5 }
    case 'left':
      return { x: -off, y: 0, fx: -1, fy: -0.5 }
    case 'top':
      return { x: 0, y: -off, fx: -0.5, fy: -1 }
    case 'bottom':
      return { x: 0, y: off, fx: -0.5, fy: 0 }
    case 'top-right':
      return { x: d, y: -d, fx: 0, fy: -1 }
    case 'top-left':
      return { x: -d, y: -d, fx: -1, fy: -1 }
    case 'bottom-right':
      return { x: d, y: d, fx: 0, fy: 0 }
    case 'bottom-left':
      return { x: -d, y: d, fx: -1, fy: 0 }
  }
}
