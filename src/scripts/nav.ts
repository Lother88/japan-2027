/**
 * nav — botones de navegación interna: CTA del hero ([data-cta], baja a «La ruta»), aviso de
 * scroll ([data-scrollcue], baja al itinerario) y «volver arriba» ([data-totop]).
 * El scroll es suave salvo con reduce-motion (helpers de features/landing/scroll.ts).
 */
import { scrollToJourney, scrollToRoute, scrollTop } from '@/features/landing/scroll'

const on = (selector: string, action: () => void) =>
  document.querySelector(selector)?.addEventListener('click', action)

on('[data-cta]', scrollToRoute)
on('[data-scrollcue]', scrollToJourney)
on('[data-totop]', scrollTop)
