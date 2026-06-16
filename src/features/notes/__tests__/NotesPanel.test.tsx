/**
 * Tests for NotesPanel component (TDD first)
 * Satisfies NOTE-01, NOTE-05
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useNotesStore } from '../notesStore'
import NotesPanel from '../NotesPanel'

beforeEach(() => {
  localStorage.clear()
  useNotesStore.setState({ notes: {} })
})

describe('NotesPanel', () => {
  it('renders a textarea', () => {
    render(<NotesPanel sectionId="day:9" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('shows existing note text in the textarea', () => {
    useNotesStore.setState({ notes: { 'day:9': 'nota preexistente' } })
    render(<NotesPanel sectionId="day:9" />)
    expect(screen.getByRole('textbox')).toHaveValue('nota preexistente')
  })

  it('shows empty textarea when no note exists', () => {
    render(<NotesPanel sectionId="day:9" />)
    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('updates the store when typing in the textarea', async () => {
    const user = userEvent.setup()
    render(<NotesPanel sectionId="day:10" />)
    await user.type(screen.getByRole('textbox'), 'nueva nota')
    expect(useNotesStore.getState().notes['day:10']).toBe('nueva nota')
  })

  it('clears the note when clear button is clicked', async () => {
    const user = userEvent.setup()
    useNotesStore.setState({ notes: { 'zone:asakusa': 'texto a borrar' } })
    render(<NotesPanel sectionId="zone:asakusa" />)
    const clearBtn = screen.getByRole('button', { name: /borrar|eliminar|limpiar/i })
    await user.click(clearBtn)
    expect(useNotesStore.getState().notes['zone:asakusa']).toBeUndefined()
  })
})
