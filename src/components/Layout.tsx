/**
 * Layout — root shell with header nav and Outlet
 *
 * Satisfies UX-04: persistent nav with links to / and /itinerario
 * Full-width layout (no restrictive max-width on the shell itself).
 *
 * ThemeInit: syncs zustand theme state → document.documentElement.dark class
 * on mount (covers the case where localStorage was already applied by
 * the anti-FOUC script but the store initializer ran with a different value).
 */

import { useEffect } from 'react'
import { Outlet, Link } from 'react-router'
import { Nav } from './Nav'
import { useThemeStore } from '@/features/theme/themeStore'

function ThemeInit() {
  const { theme, applyTheme } = useThemeStore()

  useEffect(() => {
    applyTheme(theme)
  }, [theme, applyTheme])

  return null
}

export default function Layout() {
  return (
    <div className="min-h-svh flex flex-col bg-bg text-fg">
      <ThemeInit />

      {/* ── Site header ── */}
      <header className="sticky top-0 z-30 w-full bg-bg/95 backdrop-blur-sm border-b border-border">
        <div className="w-full px-4 md:px-8 h-14 flex items-center justify-between">
          {/* Logo / wordmark */}
          <Link
            to="/"
            className="font-display text-xl text-fg hover:text-accent transition-colors"
            aria-label="Japón 2027 — Inicio"
          >
            <span aria-hidden="true">🗾 </span>
            Japón 2027
          </Link>

          {/* Responsive navigation */}
          <Nav />
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="w-full border-t border-border py-4 px-4 md:px-8">
        <p className="font-sans text-xs text-fg-subtle text-center">
          Japón 2027 · Planificación del viaje · 8–29 mayo 2027
        </p>
      </footer>
    </div>
  )
}
