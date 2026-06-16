/**
 * useNotes — hook to read/write a note for a specific section.
 *
 * sectionId convention:
 *   "day:{dayId}"        — note for a day
 *   "zone:{zoneId}"      — note for a zone
 *
 * Satisfies NOTE-01, NOTE-05
 */

import { useNotesStore } from './notesStore'

export interface UseNotesResult {
  note: string
  setNote: (text: string) => void
  clearNote: () => void
}

export function useNotes(sectionId: string): UseNotesResult {
  const note = useNotesStore(state => state.notes[sectionId] ?? '')
  const storeSetNote = useNotesStore(state => state.setNote)
  const storeClearNote = useNotesStore(state => state.clearNote)

  return {
    note,
    setNote: (text: string) => storeSetNote(sectionId, text),
    clearNote: () => storeClearNote(sectionId),
  }
}
