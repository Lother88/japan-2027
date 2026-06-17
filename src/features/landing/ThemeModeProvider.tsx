/**
 * ThemeModeProvider — proveedor del tema claro/oscuro.
 *
 * Aplica `data-theme` en <html> (las variables CSS de index.css resuelven la
 * paleta), persiste la elección en localStorage['jp-theme'] y expone `toggle`,
 * que dispara la animación de abanico (themeFan) e intercambia el tema a mitad
 * del barrido. Si el usuario prefiere movimiento reducido, hace el cambio directo.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { buildFan, playFanSwap, type FanHandles } from '@/features/landing/themeFan'
import {
  ThemeModeContext,
  THEME_STORAGE_KEY,
  readInitialMode,
  type ThemeMode,
} from '@/features/landing/useThemeMode'

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(readInitialMode)
  const modeRef = useRef(mode)
  const fanRootRef = useRef<HTMLDivElement | null>(null)
  const fanRef = useRef<FanHandles | null>(null)
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

  // Construye el abanico una sola vez
  useEffect(() => {
    if (fanRootRef.current && !fanRef.current) {
      fanRef.current = buildFan(fanRootRef.current)
    }
  }, [])

  const toggle = useCallback(() => {
    if (busyRef.current) return
    const next: ThemeMode = modeRef.current === 'dark' ? 'light' : 'dark'
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fan = fanRef.current
    if (!fan || reduced) {
      setMode(next)
      return
    }
    // Anima el abanico y aplica el swap a mitad del barrido.
    busyRef.current = true
    playFanSwap(fan, () => setMode(next)).finally(() => {
      busyRef.current = false
    })
  }, [])

  return (
    <ThemeModeContext.Provider value={{ mode, toggle }}>
      {children}
      <div ref={fanRootRef} aria-hidden="true" />
    </ThemeModeContext.Provider>
  )
}
