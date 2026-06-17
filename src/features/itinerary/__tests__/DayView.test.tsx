/**
 * Tests for DayView (TDD)
 * Satisfies DAY-02, DAY-03, DAY-04, DAY-05, NOSPOIL-02, NOSPOIL-03
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import { useNotesStore } from '@/features/notes/notesStore'
import DayView from '../DayView'

beforeEach(() => {
  localStorage.clear()
  useNotesStore.setState({ notes: {} })
})

function renderDayView(dayId: string) {
  return render(
    <MemoryRouter initialEntries={[`/dia/${dayId}`]}>
      <Routes>
        <Route path="/dia/:dayId" element={<DayView />} />
        <Route path="/dia/:dayId" element={<DayView />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('DayView', () => {
  it('renders morning and afternoon sections (DAY-02)', () => {
    renderDayView('9')
    expect(screen.getByText(/mañana/i)).toBeInTheDocument()
    expect(screen.getByText(/tarde/i)).toBeInTheDocument()
  })

  it('renders zone names as links (DAY-03)', () => {
    renderDayView('10')
    // Day 10 has shibuya and harajuku-meiji in morning, shinjuku in afternoon
    const links = screen.getAllByRole('link').filter(
      l => l.getAttribute('href')?.startsWith('/zona/'),
    )
    expect(links.length).toBeGreaterThan(0)
  })

  it('shows "En tránsito" for an empty slot (DAY-04)', () => {
    // Day 9 morning slot has no zones
    renderDayView('9')
    expect(screen.getByText(/en tránsito/i)).toBeInTheDocument()
  })

  it('zone links navigate to /zona/:city/:slug (DAY-03)', () => {
    renderDayView('10')
    const zoneLinks = screen.getAllByRole('link').filter(
      l => l.getAttribute('href')?.startsWith('/zona/'),
    )
    expect(zoneLinks[0].getAttribute('href')).toMatch(/^\/zona\/tokio\//)
  })

  it('does NOT render a description field (DAY-05, NOSPOIL-02)', () => {
    renderDayView('10')
    // No element with text "description" or an attribute "description"
    expect(screen.queryByText(/^description$/i)).not.toBeInTheDocument()
  })

  it('renders prev/next navigation (DAY-04)', () => {
    renderDayView('10')
    const prevLink = screen.getByRole('link', { name: /día anterior/i })
    const nextLink = screen.getByRole('link', { name: /día siguiente/i })
    expect(prevLink).toBeInTheDocument()
    expect(nextLink).toBeInTheDocument()
  })

  it('no prev button on first day', () => {
    renderDayView('9')
    const prevBtn = screen.queryByRole('link', { name: /día anterior/i })
    expect(prevBtn).not.toBeInTheDocument()
  })

  it('no next button on last day', () => {
    renderDayView('29')
    // Day 29 is the last day in the itinerary (Regreso)
    const nextBtn = screen.queryByRole('link', { name: /día siguiente/i })
    expect(nextBtn).not.toBeInTheDocument()
  })

  it('shows 404 message for non-existent day', () => {
    renderDayView('999')
    expect(screen.getByText(/día no encontrado/i)).toBeInTheDocument()
  })

  it('renders a notes panel (NOTE-05)', () => {
    renderDayView('9')
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  // ── Transfer block tests ─────────────────────────────────────────────────

  it('shows TransferBlock when day has transfers (day 13)', () => {
    // Day 13 has transfers: Tokio → Takaragawa Onsen
    renderDayView('13')
    // The transfer section has aria-label "Trayecto del día"
    expect(screen.getByRole('region', { name: /trayecto del día/i })).toBeInTheDocument()
  })

  it('shows transfer from→to when day has transfers (day 13)', () => {
    renderDayView('13')
    // The leg article has aria-label "Tramo 1: Tokio a Takaragawa Onsen (Minakami) en Shinkansen"
    expect(screen.getByRole('article', { name: /tramo 1.*tokio.*takaragawa/i })).toBeInTheDocument()
  })

  it('does NOT show TransferBlock when day has no transfers (day 10)', () => {
    // Day 10 has no transfers
    renderDayView('10')
    expect(screen.queryByRole('region', { name: /trayecto del día/i })).not.toBeInTheDocument()
  })

  it('shows both legs for multi-leg transfer day (day 22: Kioto→Nara→Osaka)', () => {
    renderDayView('22')
    // Day 22 has 2 transfer legs
    const articles = screen.getAllByRole('article', { name: /tramo/i })
    expect(articles.length).toBeGreaterThanOrEqual(2)
    expect(screen.getByRole('article', { name: /tramo 1.*kioto.*nara/i })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: /tramo 2.*nara.*osaka/i })).toBeInTheDocument()
  })
})
