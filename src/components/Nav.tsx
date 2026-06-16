/**
 * Nav — responsive navigation
 *
 * Desktop (md+): horizontal bar with links
 * Mobile (<md): hamburger toggle → full-screen drawer
 *
 * Satisfies UX-04: nav contains links to / and /itinerario
 * Satisfies UX-05: aria-label on interactive elements
 * Satisfies UX-03: touch targets ≥ 44px
 */

import { useState } from 'react'
import { NavLink } from 'react-router'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const navLinks = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/itinerario', label: 'Itinerario', end: false },
  { to: '/mapa', label: 'Mapa', end: false },
]

function NavLinkItem({
  to,
  label,
  end,
  onClick,
}: {
  to: string
  label: string
  end: boolean
  onClick?: () => void
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        [
          'font-sans text-sm font-medium',
          'px-3 py-2 rounded-[var(--radius-card)]',
          'transition-colors min-h-[44px] flex items-center',
          isActive
            ? 'text-urushi-600 bg-washi-100'
            : 'text-sumi-700 hover:text-sumi-900 hover:bg-washi-100',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  )
}

export function Nav() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [drawerOpen, setDrawerOpen] = useState(false)

  if (isDesktop) {
    return (
      <nav aria-label="Navegación principal" className="flex items-center gap-1">
        {navLinks.map(link => (
          <NavLinkItem key={link.to} {...link} />
        ))}
      </nav>
    )
  }

  return (
    <>
      <button
        aria-label={drawerOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={drawerOpen}
        onClick={() => setDrawerOpen(v => !v)}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-sumi-700 hover:text-sumi-900 rounded-[var(--radius-card)] transition-colors"
      >
        {/* Hamburger / close icon */}
        {drawerOpen ? (
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
          </svg>
        ) : (
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-sumi-900/30 backdrop-blur-sm"
          aria-hidden="true"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer panel */}
      <nav
        aria-label="Navegación principal (móvil)"
        className={[
          'fixed top-0 right-0 z-50 h-full w-72 max-w-[85vw]',
          'bg-washi-50 border-l border-washi-200 shadow-xl',
          'flex flex-col pt-20 px-6 gap-2',
          'transition-transform duration-200',
          drawerOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {navLinks.map(link => (
          <NavLinkItem key={link.to} {...link} onClick={() => setDrawerOpen(false)} />
        ))}
      </nav>
    </>
  )
}
