/**
 * Layout — root shell with header nav and Outlet
 *
 * Satisfies UX-04: persistent nav with links to / and /itinerario
 * Full-width layout (no restrictive max-width on the shell itself).
 */

import { Outlet, Link } from 'react-router'
import { Nav } from './Nav'

export default function Layout() {
  return (
    <div className="min-h-svh flex flex-col bg-washi-50 text-sumi-900">
      {/* ── Site header ── */}
      <header className="sticky top-0 z-30 w-full bg-washi-50/95 backdrop-blur-sm border-b border-washi-200">
        <div className="w-full px-4 md:px-8 h-14 flex items-center justify-between">
          {/* Logo / wordmark */}
          <Link
            to="/"
            className="font-display text-xl text-sumi-900 hover:text-urushi-600 transition-colors"
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
      <footer className="w-full border-t border-washi-200 py-4 px-4 md:px-8">
        <p className="font-sans text-xs text-sumi-500 text-center">
          Japón 2027 · Planificación del viaje · 8–29 mayo 2027
        </p>
      </footer>
    </div>
  )
}
