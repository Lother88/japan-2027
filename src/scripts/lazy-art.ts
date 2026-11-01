/**
 * lazy-art — arte isométrico diferido y pausa de animaciones fuera de pantalla.
 *
 * Carga diferida (un `import()` por asset, emitido por Vite/Rolldown en su propio chunk):
 *  - Ilustraciones por día (`[data-illus][data-illus-kind]`): al quedar a 800 px del viewport.
 *  - Spots diferidos (`[data-art][data-art-defer]`: banda, ruta, omamori): a 600 px.
 * El SVG se escribe en línea dentro de la caja (no <img>): su <style> sigue [data-theme] en
 * <html>. Las cajas ya tienen su tamaño reservado en el HTML, así que su llegada no mueve nada.
 * Si falla la red, la caja queda vacía (es decorativa).
 *
 * Pausa (un IntersectionObserver sin margen): mientras la caja no se ve,
 *  - `[data-illus]` lleva `data-paused`,
 *  - `[data-art][data-art-pause]` y la portada `[data-hero]` llevan `data-art-paused`,
 * e index.css congela las animaciones de dentro (`animation-play-state: paused`).
 */
import { isoLoaders, type IsoArt } from '@/features/landing/iso/registry'
import type { IllustrationKind } from '@/features/landing/illustrationKind'
import {
  ART_SCOPES,
  deferredArtLoaders,
  spotSvgStyle,
  type DeferredArtName,
  type SpotArt,
} from '@/features/landing/hero-art/registry'

/** Distancia al viewport a la que empieza la descarga de cada tipo de arte. */
const ILLUS_MARGIN = '800px 0px'
const SPOT_MARGIN = '600px 0px'

const escapeAttr = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

function svg(attrs: Record<string, string>, markup: string): string {
  const list = Object.entries(attrs)
    .map(([k, v]) => `${k}="${escapeAttr(v)}"`)
    .join(' ')
  return `<svg ${list}>${markup}</svg>`
}

function renderIllus(box: HTMLElement, kind: string, art: IsoArt) {
  box.innerHTML = svg(
    {
      class: kind,
      viewBox: art.viewBox,
      'aria-hidden': 'true',
      focusable: 'false',
      preserveAspectRatio: 'xMidYMid meet',
      style: 'display:block;width:100%;height:100%;overflow:visible',
    },
    art.markup,
  )
}

function renderSpot(box: HTMLElement, name: DeferredArtName, art: SpotArt) {
  const par = box.dataset.artPar ?? 'xMidYMid meet'
  const common = {
    class: ART_SCOPES[name].root,
    viewBox: art.viewBox,
    'aria-hidden': 'true',
    focusable: 'false',
    preserveAspectRatio: par,
  }
  const base = svg({ ...common, style: spotSvgStyle(par) }, art.markup)
  const layers = (art.layers ?? [])
    .map((l) => svg({ ...common, 'data-art-layer': l.name, style: spotSvgStyle(par, true) }, l.markup))
    .join('')
  box.innerHTML = base + layers
}

function load(box: HTMLElement) {
  const kind = box.dataset.illusKind as IllustrationKind | undefined
  if (kind) {
    const loader = isoLoaders[kind]
    loader?.().then(
      (art) => renderIllus(box, kind, art),
      () => {
        // Sin red o chunk caducado: la caja reservada queda vacía.
      },
    )
    return
  }
  const name = box.dataset.artSrc as DeferredArtName | undefined
  const loader = name ? deferredArtLoaders[name] : undefined
  if (!name || !loader) return
  loader().then(
    (art) => renderSpot(box, name, art),
    () => {
      // Sin red o chunk caducado: la caja reservada queda vacía.
    },
  )
}

function observeNear(boxes: HTMLElement[], rootMargin: string) {
  if (boxes.length === 0) return
  const near = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        near.unobserve(entry.target)
        load(entry.target as HTMLElement)
      }
    },
    { rootMargin },
  )
  for (const box of boxes) near.observe(box)
}

const illus = [...document.querySelectorAll<HTMLElement>('[data-illus][data-illus-kind]')]
const spots = [...document.querySelectorAll<HTMLElement>('[data-art][data-art-defer]')]
observeNear(illus, ILLUS_MARGIN)
observeNear(spots, SPOT_MARGIN)

// Pausa fuera de pantalla: data-paused en las ilustraciones, data-art-paused en el resto.
const visible = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const el = entry.target as HTMLElement
    const attr = el.hasAttribute('data-illus') ? 'data-paused' : 'data-art-paused'
    el.toggleAttribute(attr, !entry.isIntersecting)
  }
})
for (const el of document.querySelectorAll('[data-illus], [data-art][data-art-pause], [data-hero]')) {
  visible.observe(el)
}
