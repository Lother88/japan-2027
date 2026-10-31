/**
 * Chunk del hero: la maqueta y los 6 spots que se ven sobre el pliegue. Solo se importa con
 * `import()` desde registry.ts, así que Vite/Rolldown lo emite fuera del bundle principal.
 */
import type { HeroSceneArt, HeroSpotName, SpotArt } from './registry'
import { HERO_MAQUETA_MARKUP, HERO_MAQUETA_VIEWBOX, HERO_MAQUETA_VIEWBOX_MOBILE } from './heroMaqueta.markup'
import { SPOT_KOYOMI_MARKUP, SPOT_KOYOMI_VIEWBOX } from './spotKoyomi.markup'
import { SPOT_MACHIYA_MARKUP, SPOT_MACHIYA_VIEWBOX } from './spotMachiya.markup'
import { SPOT_KIPPU_MARKUP, SPOT_KIPPU_VIEWBOX } from './spotKippu.markup'
import { SPOT_MALETAS_MARKUP, SPOT_MALETAS_VIEWBOX } from './spotMaletas.markup'
import { SPOT_MICHISHIRUBE_MARKUP, SPOT_MICHISHIRUBE_VIEWBOX } from './spotMichishirube.markup'
import { SPOT_TORO_TOGGLE_MARKUP, SPOT_TORO_TOGGLE_VIEWBOX } from './spotToroToggle.markup'

export const HERO_SCENE: HeroSceneArt = {
  viewBox: HERO_MAQUETA_VIEWBOX,
  viewBoxMobile: HERO_MAQUETA_VIEWBOX_MOBILE,
  markup: HERO_MAQUETA_MARKUP,
}

export const HERO_SPOTS: Record<HeroSpotName, SpotArt> = {
  koyomi: { viewBox: SPOT_KOYOMI_VIEWBOX, markup: SPOT_KOYOMI_MARKUP },
  machiya: { viewBox: SPOT_MACHIYA_VIEWBOX, markup: SPOT_MACHIYA_MARKUP },
  kippu: { viewBox: SPOT_KIPPU_VIEWBOX, markup: SPOT_KIPPU_MARKUP },
  maletas: { viewBox: SPOT_MALETAS_VIEWBOX, markup: SPOT_MALETAS_MARKUP },
  michishirube: { viewBox: SPOT_MICHISHIRUBE_VIEWBOX, markup: SPOT_MICHISHIRUBE_MARKUP },
  'toro-toggle': { viewBox: SPOT_TORO_TOGGLE_VIEWBOX, markup: SPOT_TORO_TOGGLE_MARKUP },
}
