/**
 * ImportExport — export/import notes as JSON file.
 * Export: Blob + <a download> with date in filename.
 * Import: file input with version + shape validation.
 * Satisfies NOTE-03, NOTE-04
 */

import { useState } from 'react'
import { useNotesStore } from './notesStore'
import { Button } from '@/components/Button'

export default function ImportExport() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function handleExport() {
    const json = useNotesStore.getState().exportJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const date = new Date().toISOString().slice(0, 10)
    const a = document.createElement('a')
    a.href = url
    a.download = `japan2027-notas-${date}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setSuccess(false)

    const reader = new FileReader()
    reader.onload = (ev) => {
      const raw = ev.target?.result
      if (typeof raw !== 'string') return
      const result = useNotesStore.getState().importJSON(raw)
      if (result.ok) {
        setSuccess(true)
      } else {
        setError(result.error ?? 'Error al importar las notas.')
      }
    }
    reader.readAsText(file)

    // Reset input so same file can be re-uploaded if needed
    e.target.value = ''
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="secondary"
        onClick={handleExport}
        aria-label="Exportar notas como JSON"
      >
        Exportar notas
      </Button>

      <label
        className={[
          'cursor-pointer inline-flex items-center',
          'font-sans text-sm font-medium',
          'px-4 py-2 min-h-[44px] rounded-[var(--radius-card)]',
          'border border-washi-200 text-sumi-900',
          'hover:bg-washi-100 transition-colors',
        ].join(' ')}
        aria-label="Importar notas desde JSON"
      >
        Importar notas
        <input
          type="file"
          accept="application/json,.json"
          className="sr-only"
          data-testid="import-file-input"
          onChange={handleFileChange}
        />
      </label>

      {error && (
        <p role="alert" className="font-sans text-xs text-urushi-600 w-full">
          Error: {error}
        </p>
      )}

      {success && (
        <p className="font-sans text-xs text-matcha-500 w-full">
          Notas importadas correctamente.
        </p>
      )}
    </div>
  )
}
