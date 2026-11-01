/**
 * Helpers de scroll suave (instantáneo con reduce-motion) para la navegación interna del journey.
 * Portados de scrollTop / scrollToJourney del diseño (y scrollToRoute).
 */
import { pad2 } from '@/features/landing/theme'

/** Smooth salvo con reduce-motion (behavior:'smooth' en JS ignora la regla CSS). */
function scrollBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

/** Id del ancla de la sección de un día (`dia-09`); lo usan DaySection y el rail. */
export function dayAnchor(id: number): string {
  return `dia-${pad2(id)}`
}

/** Sube al inicio de la página. */
export function scrollTop(): void {
  window.scrollTo({ top: 0, behavior: scrollBehavior() })
}

/** Baja al inicio del journey (primer día). */
export function scrollToJourney(): void {
  const el = document.querySelector<HTMLElement>('[data-journey]')
  if (el) window.scrollTo({ top: el.offsetTop, behavior: scrollBehavior() })
}

/** Id del ancla de la banda «La ruta» (mapa), justo debajo del hero. */
export const ROUTE_ANCHOR = 'ruta'

/** Baja a la banda «La ruta» (el CTA del hero). */
export function scrollToRoute(): void {
  document.getElementById(ROUTE_ANCHOR)?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' })
}
