/**
 * Registro de cargadores de las ilustraciones isométricas por día.
 *
 * Un `import()` por día: Vite/Rolldown emite cada marcado (≈ 75–150 KB sin comprimir) en su
 * propio chunk, fuera del bundle principal, y DayIllustration lo pide solo cuando la sección
 * se acerca al viewport.
 *
 * Los ficheros dayNNIso.markup.ts son marcado GENERADO (no editar a mano) por los scripts
 * build.mjs de la skill anatomy-asset en el scratchpad de la sesión. Sus rampas de tono se
 * derivan de los hex de --paper, --gold, --brown, --green, --ink, --coral, --coral2 y --amber
 * de src/index.css: si cambia alguno de esos tokens, hay que regenerarlos todos. Ids,
 * keyframes y estilos van prefijados por día (`dNN-…`, `.iso-dNN`) para que convivan.
 */
import type { IllustrationKind } from '@/features/landing/illustrationKind'

export interface IsoArt {
  viewBox: string
  markup: string
  /** Qué representa el dibujo (texto en español, solo informativo). */
  subject: string
}

/** Normaliza las exportaciones DAYNN_ISO_{VIEWBOX,MARKUP,SUBJECT} de un módulo. */
function toArt(mod: Record<string, string>): IsoArt {
  const get = (suffix: string) => {
    const key = Object.keys(mod).find((k) => k.endsWith(suffix))
    return key ? mod[key] : ''
  }
  return { viewBox: get('_ISO_VIEWBOX'), markup: get('_ISO_MARKUP'), subject: get('_ISO_SUBJECT') }
}

export const isoLoaders: Record<IllustrationKind, () => Promise<IsoArt>> = {
  'iso-d09': () => import('./day09Iso.markup').then(toArt),
  'iso-d10': () => import('./day10Iso.markup').then(toArt),
  'iso-d11': () => import('./day11Iso.markup').then(toArt),
  'iso-d12': () => import('./day12Iso.markup').then(toArt),
  'iso-d13': () => import('./day13Iso.markup').then(toArt),
  'iso-d14': () => import('./day14Iso.markup').then(toArt),
  'iso-d15': () => import('./day15Iso.markup').then(toArt),
  'iso-d16': () => import('./day16Iso.markup').then(toArt),
  'iso-d17': () => import('./day17Iso.markup').then(toArt),
  'iso-d18': () => import('./day18Iso.markup').then(toArt),
  'iso-d19': () => import('./day19Iso.markup').then(toArt),
  'iso-d20': () => import('./day20Iso.markup').then(toArt),
  'iso-d21': () => import('./day21Iso.markup').then(toArt),
  'iso-d22': () => import('./day22Iso.markup').then(toArt),
  'iso-d23': () => import('./day23Iso.markup').then(toArt),
  'iso-d24': () => import('./day24Iso.markup').then(toArt),
  'iso-d25': () => import('./day25Iso.markup').then(toArt),
  'iso-d26': () => import('./day26Iso.markup').then(toArt),
  'iso-d27': () => import('./day27Iso.markup').then(toArt),
  'iso-d28': () => import('./day28Iso.markup').then(toArt),
  'iso-d29': () => import('./day29Iso.markup').then(toArt),
}
