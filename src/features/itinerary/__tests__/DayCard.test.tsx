/**
 * Tests for DayCard (TDD)
 * Covers: transfer indicator present/absent, aria-label updates
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { useNotesStore } from '@/features/notes/notesStore'
import DayCard from '../DayCard'
import type { Day } from '@/data/types'

beforeEach(() => {
  localStorage.clear()
  useNotesStore.setState({ notes: {} })
})

const dayWithTransfers: Day = {
  id: 13,
  date: '2027-05-13',
  citySlug: 'takaragawa',
  title: 'Takaragawa Onsen — Ryokan junto al río',
  transfers: [
    {
      from: 'Tokio',
      to: 'Takaragawa Onsen (Minakami)',
      mode: 'shinkansen',
      duration: '~1h15',
    },
  ],
  slots: [
    { key: 'morning', label: 'Mañana', summary: 'Traslado', zones: [] },
    { key: 'afternoon', label: 'Tarde', summary: 'Ryokan', zones: [] },
  ],
}

const dayWithoutTransfers: Day = {
  id: 10,
  date: '2027-05-10',
  citySlug: 'tokio',
  title: 'Tokio — Shibuya',
  slots: [
    { key: 'morning', label: 'Mañana', summary: 'Comercial', zones: [] },
    { key: 'afternoon', label: 'Tarde', summary: 'Shinjuku', zones: [] },
  ],
}

function renderCard(day: Day) {
  return render(
    <MemoryRouter>
      <DayCard day={day} />
    </MemoryRouter>,
  )
}

describe('DayCard — transfer indicator', () => {
  it('shows a transfer indicator when the day has transfers', () => {
    renderCard(dayWithTransfers)
    // Look for an element with aria-label or title that mentions "trayecto"
    const indicator = screen.getByTitle(/trayecto/i)
    expect(indicator).toBeInTheDocument()
  })

  it('does NOT show a transfer indicator when the day has no transfers', () => {
    renderCard(dayWithoutTransfers)
    expect(screen.queryByTitle(/trayecto/i)).not.toBeInTheDocument()
  })

  it('includes transfer info in aria-label when transfers present', () => {
    renderCard(dayWithTransfers)
    const link = screen.getByRole('link', { name: /trayecto/i })
    expect(link).toBeInTheDocument()
  })

  it('does NOT include transfer info in aria-label when no transfers', () => {
    renderCard(dayWithoutTransfers)
    const link = screen.getByRole('link', { name: /día 10/i })
    expect(link.getAttribute('aria-label')).not.toMatch(/trayecto/i)
  })
})
