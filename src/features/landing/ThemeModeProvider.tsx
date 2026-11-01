/**
 * ThemeModeProvider — proveedor del tema claro/oscuro.
 *
 * Aplica `data-theme` en <html> (las variables CSS de index.css resuelven la
 * paleta), persiste la elección en localStorage['jp-theme'] y expone `toggle`,
 * que intercambia el tema con una View Transition (themeTransition). El tema se
 * aplica de forma SÍNCRONA en el punto de intercambio (atributo + flushSync del
 * estado), para que la captura del estado nuevo ya esté resuelta.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { originOf, swapTheme } from '@/features/landing/themeTransition'
import {
  ThemeModeContext,
  THEME_STORAGE_KEY,
  readInitialMode,
  type ThemeMode,
} from '@/features/landing/useThemeMode'

/** Aplica el tema al documento y lo persiste (idempotente). */
function applyTheme(mode: ThemeMode) {
  document.documentElement.setAttribute('data-theme', mode)
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode)
  } catch {
    // localStorage no disponible — el tema sigue funcionando en memoria
  }
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(readInitialMode)
  const modeRef = useRef(mode)
  const busyRef = useRef(false)

  // Sincroniza el ref, aplica data-theme y persiste cuando cambia el tema
  // (cubre el montaje; en el toggle ya se ha aplicado antes, de forma síncrona)
  useEffect(() => {
    modeRef.current = mode
    applyTheme(mode)
  }, [mode])

  const toggle = useCallback(
    (origin?: Element | null) => {
      // Guard: ignora clics mientras dura una transición
      if (busyRef.current) return
      busyRef.current = true

      const next: ThemeMode = modeRef.current === 'dark' ? 'light' : 'dark'
      const commit = () => {
        modeRef.current = next
        applyTheme(next)
        flushSync(() => setMode(next))
      }

      swapTheme({
        origin: originOf(origin),
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        commit,
      }).finally(() => {
        busyRef.current = false
      })
    },
    [],
  )

  return <ThemeModeContext.Provider value={{ mode, toggle }}>{children}</ThemeModeContext.Provider>
}
