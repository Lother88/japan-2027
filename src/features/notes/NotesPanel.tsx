/**
 * NotesPanel — textarea with autosave for a given sectionId.
 * Satisfies NOTE-01, NOTE-05
 * Responds to light/dark theme via semantic tokens.
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
      className="bg-surface rounded-[var(--radius-card)] p-4 border border-border space-y-3"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-sm font-medium text-fg-muted">{label}</h2>
        {note && (
          <button
            type="button"
            onClick={clearNote}
            aria-label="Borrar nota"
            className="font-sans text-xs text-accent hover:underline min-h-[44px] px-2"
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
          'w-full font-sans text-sm text-fg',
          'bg-bg border border-border rounded-[var(--radius-paper)]',
          'px-3 py-2 resize-y',
          'placeholder:text-fg-subtle',
          'focus:outline-none focus:border-matcha-500',
          'transition-colors',
        ].join(' ')}
      />
      {note && (
        <p className="font-sans text-xs text-fg-subtle text-right">
          {note.length} caracteres · guardado automáticamente
        </p>
      )}
    </section>
  )
}
