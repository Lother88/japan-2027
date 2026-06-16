/**
 * Tests for ItineraryView (TDD)
 * Satisfies DAY-01, NOTE-05
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { useNotesStore } from '@/features/notes/notesStore'
import ItineraryView from '../ItineraryView'
import { itinerary } from '@/data'

beforeEach(() => {
  localStorage.clear()
  useNotesStore.setState({ notes: {} })
})

describe('ItineraryView', () => {
  it('renders a card for each day in the itinerary', () => {
    render(
      <MemoryRouter>
        <ItineraryView />
      </MemoryRouter>,
    )
    // Each DayCard has an aria-label with the day number
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThanOrEqual(itinerary.length)
  })

  it('each day has a link to /dia/:id', () => {
    render(
      <MemoryRouter>
        <ItineraryView />
      </MemoryRouter>,
    )
    const dayLinks = screen.getAllByRole('link').filter(
      l => l.getAttribute('href')?.startsWith('/dia/'),
    )
    expect(dayLinks.length).toBe(itinerary.length)
  })

  it('shows note indicator if day has a note (NOTE-05)', () => {
    useNotesStore.setState({ notes: { 'day:9': 'Mi nota del día 9' } })
    render(
      <MemoryRouter>
        <ItineraryView />
      </MemoryRouter>,
    )
    // The DayCard link for day 9 should have "(con nota)" in its aria-label
    const dayLink = screen.getByRole('link', { name: /día 9.*con nota/i })
    expect(dayLink).toBeInTheDocument()
  })
})
