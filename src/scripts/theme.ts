/**
 * theme — interruptor flotante de tema claro/oscuro ([data-ttoggle]).
 *
 * Al pulsar, intercambia el tema con una View Transition cuyo círculo nace en el propio botón
 * (theme-transition.ts). El atributo `data-theme` de <html> se cambia dentro del callback de
 * la transición (de forma síncrona), se persiste en localStorage['jp-theme'] y se actualiza el
 * nombre accesible, que describe la acción: «Activar tema oscuro/claro».
 * Mientras dura una transición, los clics se ignoran (guard anti doble clic).
 * Quien deba reaccionar al tema (el mapa) observa `data-theme` en <html>.
 */
import { originOf, swapTheme } from '@/scripts/theme-transition'
import { THEME_STORAGE_KEY, currentTheme, type ThemeMode } from '@/lib/themeMode'

const button = document.querySelector<HTMLButtonElement>('[data-ttoggle]')

/** Nombre accesible y tooltip según el tema vigente (el HTML sale con el del tema claro). */
function syncLabel(mode: ThemeMode) {
  if (!button) return
  const label = mode === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro'
  button.setAttribute('aria-label', label)
  button.title = label
}

/** Aplica el tema al documento, lo persiste y actualiza el botón (idempotente). */
function applyTheme(mode: ThemeMode) {
  document.documentElement.setAttribute('data-theme', mode)
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode)
  } catch {
    // localStorage no disponible: el tema sigue funcionando en memoria
  }
  syncLabel(mode)
}

let busy = false

function toggle(origin: Element) {
  if (busy) return
  busy = true
  const next: ThemeMode = currentTheme() === 'dark' ? 'light' : 'dark'
  swapTheme({
    origin: originOf(origin),
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    commit: () => applyTheme(next),
  }).finally(() => {
    busy = false
  })
}

syncLabel(currentTheme())
button?.addEventListener('click', () => toggle(button))
