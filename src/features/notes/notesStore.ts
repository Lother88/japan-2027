/**
 * Notes store — Zustand v5 + persist middleware
 *
 * State: notes keyed by sectionId (convention: "day:{id}" | "zone:{id}")
 * Satisfies NOTE-01, NOTE-02, NOTE-03, NOTE-04
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const SCHEMA_VERSION = 1

interface NotesState {
  notes: Record<string, string>
  setNote: (sectionId: string, text: string) => void
  clearNote: (sectionId: string) => void
  exportJSON: () => string
  importJSON: (raw: string) => { ok: boolean; error?: string }
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: {},

      setNote: (sectionId, text) =>
        set(state => ({
          notes: { ...state.notes, [sectionId]: text },
        })),

      clearNote: (sectionId) =>
        set(state => {
          const next = { ...state.notes }
          delete next[sectionId]
          return { notes: next }
        }),

      exportJSON: () => {
        return JSON.stringify({ version: SCHEMA_VERSION, notes: get().notes })
      },

      importJSON: (raw) => {
        let parsed: unknown
        try {
          parsed = JSON.parse(raw)
        } catch {
          return { ok: false, error: 'JSON malformado — no se importaron los datos.' }
        }

        if (
          typeof parsed !== 'object' ||
          parsed === null ||
          !('version' in parsed) ||
          !('notes' in parsed)
        ) {
          return { ok: false, error: 'Formato inválido — falta version o notes.' }
        }

        const { version, notes } = parsed as { version: unknown; notes: unknown }

        if (version !== SCHEMA_VERSION) {
          return {
            ok: false,
            error: `versión incompatible (esperado ${SCHEMA_VERSION}, recibido ${String(version)}).`,
          }
        }

        if (typeof notes !== 'object' || notes === null || Array.isArray(notes)) {
          return { ok: false, error: 'El campo notes debe ser un objeto.' }
        }

        // Merge: imported keys win on conflict
        set(state => ({
          notes: { ...state.notes, ...(notes as Record<string, string>) },
        }))

        return { ok: true }
      },
    }),
    {
      name: 'japan2027-notes',
      version: SCHEMA_VERSION,
      migrate: () => {
        // Future migrations: transform or discard incompatible persisted state
        return { notes: {} }
      },
    },
  ),
)
