/**
 * ThemeModeProvider — proveedor del tema claro/oscuro.
 *
 * Aplica `data-theme` en <html> (las variables CSS de index.css resuelven la
 * paleta), persiste la elección en localStorage['jp-theme'] y expone `toggle`,
 * que dispara la transición ligera (themeTransition: disco "sol naciente") e
 * intercambia el tema bajo la cobertura. Si el usuario prefiere movimiento
 * reducido, hace el cambio directo.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  buildThemeOverlay,
  playThemeSwap,
  type ThemeOverlayHandles,
} from '@/features/landing/themeTransition'
import {
  ThemeModeContext,
  THEME_STORAGE_KEY,
  readInitialMode,
  type ThemeMode,
} from '@/features/landing/useThemeMode'

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(readInitialMode)
  const modeRef = useRef(mode)
  const overlayRootRef = useRef<HTMLDivElement | null>(null)
  const overlayRef = useRef<ThemeOverlayHandles | null>(null)
  const busyRef = useRef(false)

  // Sincroniza el ref, aplica data-theme y persiste cuando cambia el tema
  useEffect(() => {
    modeRef.current = mode
    document.documentElement.setAttribute('data-theme', mode)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode)
    } catch {
      // localStorage no disponible — el tema sigue funcionando en memoria
    }
  }, [mode])

  // Construye el overlay de transición una sola vez
  useEffect(() => {
    if (overlayRootRef.current && !overlayRef.current) {
      overlayRef.current = buildThemeOverlay(overlayRootRef.current)
    }
  }, [])

  const toggle = useCallback(() => {
    if (busyRef.current) return
    const next: ThemeMode = modeRef.current === 'dark' ? 'light' : 'dark'
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const overlay = overlayRef.current
    if (!overlay || reduced) {
      setMode(next)
      return
    }
    // Reproduce la transición y aplica el swap bajo la cobertura.
    busyRef.current = true
    playThemeSwap(overlay, () => setMode(next)).finally(() => {
      busyRef.current = false
    })
  }, [])

  return (
    <ThemeModeContext.Provider value={{ mode, toggle }}>
      {children}
      <div ref={overlayRootRef} aria-hidden="true" />
    </ThemeModeContext.Provider>
  )
}
