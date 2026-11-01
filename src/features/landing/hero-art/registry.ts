/**
 * Arte isométrico de la portada (hero, banda «Muro» y spots): tipos, cargadores diferidos y
 * clases raíz.
 *
 * Los ficheros *.markup.ts de esta carpeta son marcado GENERADO (no editar a mano) por los
 * scripts de tools/art (hero-layers, hero/banda-muro y hero-spots/spot-*; ver su README:
 * `node tools/art/build-all.mjs`). Sus rampas de tono se derivan de
 * los hex de --paper, --surface, --gold, --brown, --green, --ink, --coral, --coral2 y --amber
 * de src/styles/index.css, y spot-omamori del azul fijo del pie (#14203a): si cambia alguno de
 * esos valores, hay que regenerarlos. Ids, clases y keyframes van prefijados por asset (`hero-…`,
 * `banda-…`, `spot-<nombre>-…`) y cada <style> va acotado a la clase raíz (`.iso-hero`,
 * `.iso-banda`, `.iso-spot-<nombre>`), así que conviven con las ilustraciones por día.
 *
 * Reparto:
 *  - En línea en el HTML (heroInline.ts, solo en el build): la maqueta y los 6 spots que se ven
 *    sobre el pliegue (4 de la tira de billete, el poste del aviso de scroll y el tōrō del botón
 *    de tema).
 *  - Diferidos (este módulo, seguro para el cliente: sin marcado estático): banda «Muro»,
 *    spot-ruta y spot-omamori, un `import()` cada uno que scripts/lazy-art.ts lanza cuando su
 *    caja se acerca al viewport.
 */

import type { HeroMaquetaLayer } from './heroMaqueta.markup'

/** Capa de un spot: un <svg> apilado encima del base, con el mismo viewBox y la misma clase raíz. */
export interface SpotLayer {
  /** Va en `data-art-layer`; el <style> del marcado base anima la capa por ese atributo. */
  name: string
  markup: string
}

export interface SpotArt {
  viewBox: string
  /** Marcado base (lleva el <style> del asset). */
  markup: string
  /** Partes que se mueven, cada una en su <svg> para animar el elemento sin repintar el dibujo. */
  layers?: readonly SpotLayer[]
}

/**
 * La maqueta del hero va por capas (heroMaqueta.markup.ts): cada parte que se mueve vive en su
 * propio <svg> apilado, para que el navegador la componga sin repintar el dibujo entero.
 */
export interface HeroSceneArt {
  viewBox: string
  /** viewBox recortado al área del arte (móvil: el arte va encima del título). */
  viewBoxMobile: string
  /** CSS común a todas las capas (sin la etiqueta <style>); se emite una vez dentro de .iso-hero. */
  style: string
  /** Capas <svg> apiladas, de atrás adelante. */
  layers: readonly HeroMaquetaLayer[]
}

/** Spots que van en línea en el HTML (sobre el pliegue). */
export type HeroSpotName = 'koyomi' | 'machiya' | 'kippu' | 'maletas' | 'michishirube' | 'toro-toggle'

/** Arte diferido (debajo del pliegue): un chunk por asset. */
export const deferredArtLoaders = {
  banda: (): Promise<SpotArt> =>
    import('./bandaMuro.markup').then((m) => ({ viewBox: m.BANDA_MURO_VIEWBOX, markup: m.BANDA_MURO_MARKUP })),
  ruta: (): Promise<SpotArt> =>
    import('./spotRuta.markup').then((m) => ({ viewBox: m.SPOT_RUTA_VIEWBOX, markup: m.SPOT_RUTA_MARKUP })),
  omamori: (): Promise<SpotArt> =>
    import('./spotOmamori.markup').then((m) => ({ viewBox: m.SPOT_OMAMORI_VIEWBOX, markup: m.SPOT_OMAMORI_MARKUP })),
}

export type DeferredArtName = keyof typeof deferredArtLoaders

/** Clase raíz de cada asset (la que acota su <style>) y prefijo de sus ids/keyframes. */
export const ART_SCOPES = {
  hero: { root: 'iso-hero', prefix: 'hero-' },
  banda: { root: 'iso-banda', prefix: 'banda-' },
  ruta: { root: 'iso-spot-ruta', prefix: 'spot-ruta-' },
  omamori: { root: 'iso-spot-omamori', prefix: 'spot-omamori-' },
  koyomi: { root: 'iso-spot-koyomi', prefix: 'spot-koyomi-' },
  machiya: { root: 'iso-spot-machiya', prefix: 'spot-machiya-' },
  kippu: { root: 'iso-spot-kippu', prefix: 'spot-kippu-' },
  maletas: { root: 'iso-spot-maletas', prefix: 'spot-maletas-' },
  michishirube: { root: 'iso-spot-michishirube', prefix: 'spot-michishirube-' },
  'toro-toggle': { root: 'iso-spot-toro-toggle', prefix: 'spot-toro-toggle-' },
} as const

export type ArtName = keyof typeof ART_SCOPES

/**
 * Atributo `style` del <svg> de un spot. `slice` recorta a propósito (la banda sangra por los
 * lados); el resto deja ver el halo del zócalo, que sobresale unos px del viewBox. Las capas van
 * apiladas en absoluto encima del base.
 */
export function spotSvgStyle(preserveAspectRatio: string, layer = false): string {
  const overflow = preserveAspectRatio.includes('slice') ? 'hidden' : 'visible'
  return `display:block;width:100%;height:100%;overflow:${overflow}${layer ? ';position:absolute;inset:0' : ''}`
}
