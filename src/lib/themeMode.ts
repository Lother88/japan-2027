/**
 * Tema claro/oscuro: tipo, clave de persistencia y lectura del tema vigente.
 *
 * La fuente de verdad es el atributo `data-theme` de <html>: lo fija antes del primer pintado
 * el script anti-FOUC de layouts/Base.astro y lo cambia scripts/theme.ts. Quien necesite
 * reaccionar al tema (el mapa) observa ese atributo.
 */
export type ThemeMode = 'light' | 'dark'

/** Clave en localStorage (la misma que lee el anti-FOUC de Base.astro). */
export const THEME_STORAGE_KEY = 'jp-theme'

/** Tema vigente según `data-theme` en <html> (claro si falta). */
export function currentTheme(): ThemeMode {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
}
