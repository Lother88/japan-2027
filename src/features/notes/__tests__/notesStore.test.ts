/**
 * Tests for notesStore (Zustand v5 + persist)
 * Tests run first (TDD) — Satisfies NOTE-01, NOTE-02, NOTE-03, NOTE-04
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useNotesStore } from '../notesStore'

// jsdom provides localStorage; reset store state between tests
function resetStore() {
  localStorage.clear()
  // Reset the zustand store by calling importJSON with an empty notes object
  useNotesStore.setState({ notes: {} })
}

describe('notesStore', () => {
  beforeEach(() => {
    resetStore()
  })

  describe('setNote / clearNote (NOTE-01, NOTE-02)', () => {
    it('sets a note for a day section', () => {
      useNotesStore.getState().setNote('day:9', 'Nota del día 9')
      expect(useNotesStore.getState().notes['day:9']).toBe('Nota del día 9')
    })

    it('sets a note for a zone section', () => {
      useNotesStore.getState().setNote('zone:asakusa', 'Llegar temprano')
      expect(useNotesStore.getState().notes['zone:asakusa']).toBe('Llegar temprano')
    })

    it('overwrites an existing note', () => {
      useNotesStore.getState().setNote('day:9', 'primera')
      useNotesStore.getState().setNote('day:9', 'actualizada')
      expect(useNotesStore.getState().notes['day:9']).toBe('actualizada')
    })

    it('clearNote removes the entry', () => {
      useNotesStore.getState().setNote('day:9', 'texto')
      useNotesStore.getState().clearNote('day:9')
      expect(useNotesStore.getState().notes['day:9']).toBeUndefined()
    })

    it('clearNote on non-existent key does not throw', () => {
      expect(() => useNotesStore.getState().clearNote('day:999')).not.toThrow()
    })

    it('multiple keys coexist', () => {
      useNotesStore.getState().setNote('day:9', 'día 9')
      useNotesStore.getState().setNote('zone:shibuya', 'zona shibuya')
      const state = useNotesStore.getState()
      expect(state.notes['day:9']).toBe('día 9')
      expect(state.notes['zone:shibuya']).toBe('zona shibuya')
    })
  })

  describe('exportJSON (NOTE-03)', () => {
    it('exports valid JSON string with version and notes', () => {
      useNotesStore.getState().setNote('day:9', 'texto exportado')
      const json = useNotesStore.getState().exportJSON()
      const parsed = JSON.parse(json) as { version: number; notes: Record<string, string> }
      expect(parsed.version).toBe(1)
      expect(parsed.notes['day:9']).toBe('texto exportado')
    })

    it('exports empty notes as empty object', () => {
      const json = useNotesStore.getState().exportJSON()
      const parsed = JSON.parse(json) as { version: number; notes: Record<string, string> }
      expect(parsed.notes).toEqual({})
    })
  })

  describe('importJSON (NOTE-03, NOTE-04)', () => {
    it('merges imported notes with existing ones', () => {
      useNotesStore.getState().setNote('day:9', 'existente')
      const result = useNotesStore.getState().importJSON(
        JSON.stringify({ version: 1, notes: { 'zone:asakusa': 'importada' } })
      )
      expect(result.ok).toBe(true)
      expect(useNotesStore.getState().notes['day:9']).toBe('existente')
      expect(useNotesStore.getState().notes['zone:asakusa']).toBe('importada')
    })

    it('imported key wins on conflict', () => {
      useNotesStore.getState().setNote('day:9', 'original')
      useNotesStore.getState().importJSON(
        JSON.stringify({ version: 1, notes: { 'day:9': 'importada-gana' } })
      )
      expect(useNotesStore.getState().notes['day:9']).toBe('importada-gana')
    })

    it('returns error on invalid JSON without overwriting', () => {
      useNotesStore.getState().setNote('day:9', 'segura')
      const result = useNotesStore.getState().importJSON('not-valid-json')
      expect(result.ok).toBe(false)
      expect(result.error).toBeDefined()
      expect(useNotesStore.getState().notes['day:9']).toBe('segura')
    })

    it('returns error on wrong version without overwriting', () => {
      useNotesStore.getState().setNote('day:9', 'segura')
      const result = useNotesStore.getState().importJSON(
        JSON.stringify({ version: 99, notes: {} })
      )
      expect(result.ok).toBe(false)
      expect(result.error).toContain('versión')
      expect(useNotesStore.getState().notes['day:9']).toBe('segura')
    })

    it('returns error if notes field is not an object', () => {
      const result = useNotesStore.getState().importJSON(
        JSON.stringify({ version: 1, notes: 'invalid' })
      )
      expect(result.ok).toBe(false)
    })
  })
})
