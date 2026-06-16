/**
 * 2.12 — Layout test
 *
 * Satisfies UX-04: Layout renders Nav, Nav contains links to / and /itinerario
 */

import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import Layout from '../Layout'

// Wrap Layout in a minimal router (Layout uses <Outlet /> from react-router)
function renderLayout() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route
          path="/"
          element={<Layout />}
        >
          <Route index element={<div data-testid="outlet-content">Contenido de prueba</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('Layout', () => {
  it('renders without crashing', () => {
    renderLayout()
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('renders Outlet content', () => {
    renderLayout()
    expect(screen.getByTestId('outlet-content')).toBeInTheDocument()
  })

  it('renders a main landmark', () => {
    renderLayout()
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('renders navigation', () => {
    renderLayout()
    // There should be at least one nav element
    const navElements = screen.getAllByRole('navigation')
    expect(navElements.length).toBeGreaterThanOrEqual(1)
  })

  it('nav contains link to / (Inicio)', () => {
    renderLayout()
    const inicioLinks = screen.getAllByRole('link', { name: /inicio/i })
    expect(inicioLinks.length).toBeGreaterThanOrEqual(1)
  })

  it('nav contains link to /itinerario', () => {
    renderLayout()
    const itinerarioLinks = screen.getAllByRole('link', { name: /itinerario/i })
    expect(itinerarioLinks.length).toBeGreaterThanOrEqual(1)
    // Check that at least one points to /itinerario
    const hrefs = itinerarioLinks.map(l => l.getAttribute('href'))
    expect(hrefs.some(h => h?.includes('/itinerario'))).toBe(true)
  })

  it('renders site wordmark/logo link', () => {
    renderLayout()
    const logoLink = screen.getByRole('link', { name: /japón 2027/i })
    expect(logoLink).toBeInTheDocument()
  })
})
