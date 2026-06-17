/**
 * Helpers de scroll suave para la navegación interna del journey.
 * Portados de scrollTop / scrollToJourney / scrollToDay del diseño.
 */

/** Sube al inicio de la página. */
export function scrollTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/** Baja al inicio del journey (primer día). */
export function scrollToJourney(): void {
  const el = document.querySelector<HTMLElement>('[data-journey]')
  if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
}

/** Desplaza a la sección de un día concreto (compensa la altura del nav). */
export function scrollToDay(id: number): void {
  const el = document.querySelector(`[data-day="${id}"]`)
  if (el) {
    window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 56, behavior: 'smooth' })
  }
}
