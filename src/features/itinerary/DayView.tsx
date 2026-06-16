/**
 * DayView — /dia/:dayId route
 *
 * Shows a single day with morning/afternoon time slot blocks.
 * Includes NotesPanel for per-day notes.
 * Satisfies DAY-02, DAY-03, DAY-04, DAY-05, NOSPOIL-02, NOSPOIL-03, NOTE-05
 * Responds to light/dark theme via semantic tokens.
 */

import { useParams, Link } from 'react-router'
import { getDay } from '@/data'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import TimeSlotBlock from './TimeSlotBlock'
import NotesPanel from '@/features/notes/NotesPanel'

export default function DayView() {
  const { dayId } = useParams<{ dayId: string }>()
  const id = Number(dayId)
  const day = getDay(id)

  if (!day) {
    return (
      <div className="w-full px-4 md:px-8 py-16 text-center">
        <p className="font-sans text-fg-muted mb-4">Día no encontrado.</p>
        <Link to="/itinerario" className="font-sans text-accent underline">
          ← Volver al itinerario
        </Link>
      </div>
    )
  }

  const prevDay = getDay(id - 1)
  const nextDay = getDay(id + 1)

  return (
    <article className="w-full">
      <PageHeader
        title={day.title}
        subtitle={day.date}
        meta={`Día ${day.id}`}
      />

      <div className="px-4 md:px-8 py-8 space-y-8">
        {/* Time slot blocks */}
        {day.slots.map(slot => (
          <TimeSlotBlock key={slot.key} slot={slot} />
        ))}

        {/* Notes panel */}
        <NotesPanel sectionId={`day:${day.id}`} label="Notas del día" />

        {/* Prev / Next navigation */}
        <nav
          aria-label="Navegación entre días"
          className="flex items-center justify-between pt-8 border-t border-border"
        >
          {prevDay ? (
            <Link to={`/dia/${prevDay.id}`} aria-label={`Día anterior: ${prevDay.title}`}>
              <Button variant="secondary">
                ← Día {prevDay.id}
              </Button>
            </Link>
          ) : (
            <Button variant="ghost" disabled aria-label="No hay día anterior">
              ← Anterior
            </Button>
          )}

          <Link to="/itinerario" className="font-sans text-xs text-fg-subtle hover:text-fg">
            Ver todos
          </Link>

          {nextDay ? (
            <Link to={`/dia/${nextDay.id}`} aria-label={`Día siguiente: ${nextDay.title}`}>
              <Button variant="secondary">
                Día {nextDay.id} →
              </Button>
            </Link>
          ) : (
            <Button variant="ghost" disabled aria-label="No hay día siguiente">
              Siguiente →
            </Button>
          )}
        </nav>
      </div>
    </article>
  )
}
