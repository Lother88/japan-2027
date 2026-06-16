/**
 * NotesPanel — textarea with autosave for a given sectionId.
 * Satisfies NOTE-01, NOTE-05
 */

import { useNotes } from './useNotes'

interface NotesPanelProps {
  sectionId: string
  label?: string
}

export default function NotesPanel({ sectionId, label = 'Notas personales' }: NotesPanelProps) {
  const { note, setNote, clearNote } = useNotes(sectionId)

  return (
    <section
      aria-label={label}
      className="bg-washi-100 rounded-[var(--radius-card)] p-4 border border-washi-200 space-y-3"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-sm font-medium text-sumi-700">{label}</h2>
        {note && (
          <button
            type="button"
            onClick={clearNote}
            aria-label="Borrar nota"
            className="font-sans text-xs text-urushi-600 hover:underline min-h-[44px] px-2"
          >
            Borrar
          </button>
        )}
      </div>
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Añade notas sobre este lugar…"
        rows={4}
        className={[
          'w-full font-sans text-sm text-sumi-900',
          'bg-washi-50 border border-washi-200 rounded-[var(--radius-paper)]',
          'px-3 py-2 resize-y',
          'placeholder:text-sumi-500',
          'focus:outline-none focus:border-matcha-500',
          'transition-colors',
        ].join(' ')}
      />
      {note && (
        <p className="font-sans text-xs text-sumi-500 text-right">
          {note.length} caracteres · guardado automáticamente
        </p>
      )}
    </section>
  )
}
