/**
 * Tests for ImportExport component (TDD first)
 * Satisfies NOTE-03, NOTE-04
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useNotesStore } from '../notesStore'
import ImportExport from '../ImportExport'

// Mock URL.createObjectURL / revokeObjectURL (jsdom doesn't implement them)
window.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
window.URL.revokeObjectURL = vi.fn()

beforeEach(() => {
  localStorage.clear()
  useNotesStore.setState({ notes: {} })
  vi.clearAllMocks()
})

describe('ImportExport', () => {
  it('renders export and import controls', () => {
    render(<ImportExport />)
    expect(screen.getByRole('button', { name: /exportar/i })).toBeInTheDocument()
    // Import is a label+input (file picker), find the hidden input
    expect(screen.getByTestId('import-file-input')).toBeInTheDocument()
  })

  it('export button triggers Blob creation', async () => {
    const user = userEvent.setup()
    useNotesStore.setState({ notes: { 'day:9': 'test' } })
    render(<ImportExport />)
    await user.click(screen.getByRole('button', { name: /exportar/i }))
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  it('import with a valid JSON file merges notes', async () => {
    const user = userEvent.setup()
    useNotesStore.setState({ notes: { 'day:9': 'existente' } })
    render(<ImportExport />)

    const validJSON = JSON.stringify({ version: 1, notes: { 'zone:asakusa': 'importada' } })
    const file = new File([validJSON], 'notas.json', { type: 'application/json' })
    const input = screen.getByTestId('import-file-input')
    await user.upload(input, file)

    expect(useNotesStore.getState().notes['day:9']).toBe('existente')
    expect(useNotesStore.getState().notes['zone:asakusa']).toBe('importada')
  })

  it('import with invalid JSON shows error without overwriting', async () => {
    const user = userEvent.setup()
    useNotesStore.setState({ notes: { 'day:9': 'segura' } })
    render(<ImportExport />)

    const file = new File(['not-json'], 'bad.json', { type: 'application/json' })
    const input = screen.getByTestId('import-file-input')
    await user.upload(input, file)

    expect(useNotesStore.getState().notes['day:9']).toBe('segura')
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
