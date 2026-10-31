/**
 * Cargadores del arte isométrico de la portada (hero, banda «Muro» y spots).
 *
 * Los ficheros *.markup.ts de esta carpeta son marcado GENERADO (no editar a mano) por los
 * scripts build.mjs de la skill anatomy-asset en el scratchpad de la sesión
 * (hero/hero-maqueta, hero/banda-muro y hero-spots/spot-*). Sus rampas de tono se derivan de
 * los hex de --paper, --surface, --gold, --brown, --green, --ink, --coral, --coral2 y --amber
 * de src/index.css, y spot-omamori del azul fijo del pie (#14203a): si cambia alguno de esos
 * valores, hay que regenerarlos. Ids, clases y keyframes van prefijados por asset (`hero-…`,
 * `banda-…`, `spot-<nombre>-…`) y cada <style> va acotado a la clase raíz (`.iso-hero`,
 * `.iso-banda`, `.iso-spot-<nombre>`), así que conviven con las ilustraciones por día.
 *
 * Reparto en chunks (ver propuesta-rediseno.md §4, «Rendimiento»):
 *  - heroChunk: la maqueta y los 6 spots que se ven sobre el pliegue (4 de la tira de billete,
 *    el poste del aviso de scroll y el tōrō del botón de tema). Un único `import()` que Hero
 *    lanza al evaluarse; el H1 sigue siendo el LCP y las cajas tienen el tamaño reservado.
 *  - banda «Muro», spot-ruta y spot-omamori: un `import()` cada uno, diferido hasta que su caja
 *    se acerca al viewport.
 */

export interface SpotArt {
  viewBox: string
  markup: string
}

export interface HeroSceneArt extends SpotArt {
  /** viewBox recortado al área del arte (móvil: el arte va encima del título). */
  viewBoxMobile: string
}

/** Spots que viajan en el chunk del hero. */
export type HeroSpotName = 'koyomi' | 'machiya' | 'kippu' | 'maletas' | 'michishirube' | 'toro-toggle'

type HeroChunk = typeof import('./heroChunk')

let heroChunk: Promise<HeroChunk> | undefined

/** Pide (una sola vez) el chunk del hero; si falla, se puede volver a intentar. */
export function loadHeroChunk(): Promise<HeroChunk> {
  heroChunk ??= import('./heroChunk').catch((err: unknown) => {
    heroChunk = undefined
    throw err
  })
  return heroChunk
}

export const loadHeroScene = (): Promise<HeroSceneArt> => loadHeroChunk().then((m) => m.HERO_SCENE)

/** Un cargador estable por spot del hero (todos comparten el mismo chunk). */
export const heroSpotLoaders: Record<HeroSpotName, () => Promise<SpotArt>> = {
  koyomi: () => loadHeroChunk().then((m) => m.HERO_SPOTS.koyomi),
  machiya: () => loadHeroChunk().then((m) => m.HERO_SPOTS.machiya),
  kippu: () => loadHeroChunk().then((m) => m.HERO_SPOTS.kippu),
  maletas: () => loadHeroChunk().then((m) => m.HERO_SPOTS.maletas),
  michishirube: () => loadHeroChunk().then((m) => m.HERO_SPOTS.michishirube),
  'toro-toggle': () => loadHeroChunk().then((m) => m.HERO_SPOTS['toro-toggle']),
}

/** Arte diferido (debajo del pliegue): un chunk por asset. */
export const deferredArtLoaders = {
  banda: (): Promise<SpotArt> =>
    import('./bandaMuro.markup').then((m) => ({ viewBox: m.BANDA_MURO_VIEWBOX, markup: m.BANDA_MURO_MARKUP })),
  ruta: (): Promise<SpotArt> =>
    import('./spotRuta.markup').then((m) => ({ viewBox: m.SPOT_RUTA_VIEWBOX, markup: m.SPOT_RUTA_MARKUP })),
  omamori: (): Promise<SpotArt> =>
    import('./spotOmamori.markup').then((m) => ({ viewBox: m.SPOT_OMAMORI_VIEWBOX, markup: m.SPOT_OMAMORI_MARKUP })),
}

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
