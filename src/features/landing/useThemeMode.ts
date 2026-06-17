/**
 * useThemeMode — contexto y hook del tema claro/oscuro.
 *
 * El contexto y el hook viven aquí (sin JSX) para cumplir
 * `react-refresh/only-export-components`; el proveedor que los rellena está en
 * `ThemeModeProvider.tsx`. Componentes que necesitan reaccionar al tema (mapa,
 * toggle) consumen `useThemeMode()`.
 */
import { createContext, useContext } from 'react'

export type ThemeMode = 'light' | 'dark'

export interface ThemeModeContextValue {
  readonly mode: ThemeMode
  readonly toggle: () => void
}

/** Clave de persistencia en localStorage (coincide con el anti-FOUC de index.html). */
export const THEME_STORAGE_KEY = 'jp-theme'

/** Valor por defecto: tema claro y toggle inerte (seguro fuera del proveedor, p. ej. en tests). */
export const ThemeModeContext = createContext<ThemeModeContextValue>({
  mode: 'light',
  toggle: () => {},
})

/** Lee el tema inicial del atributo data-theme que fija el anti-FOUC de index.html. */
export function readInitialMode(): ThemeMode {
  if (typeof document !== 'undefined') {
    const attr = document.documentElement.getAttribute('data-theme')
    if (attr === 'light' || attr === 'dark') return attr
  }
  return 'light'
}

export function useThemeMode(): ThemeModeContextValue {
  return useContext(ThemeModeContext)
}
