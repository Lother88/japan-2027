/**
 * DayCard — summary card for a day in the itinerary list.
 * Shows day number, date, city, up to 2 zones, and a note indicator.
 * Satisfies DAY-01, NOTE-05
 * Responds to light/dark theme via semantic tokens.
 */

import { Link } from 'react-router'
import type { Day } from '@/data/types'
import { getCity } from '@/data'
import { Card } from '@/components/Card'
import { useNotes } from '@/features/notes/useNotes'

interface DayCardProps {
  day: Day
}

export default function DayCard({ day }: DayCardProps) {
  const city = getCity(day.citySlug)
  const { note } = useNotes(`day:${day.id}`)
  const hasNote = note.length > 0

  return (
    <Link
      to={`/dia/${day.id}`}
      className="block group"
      aria-label={`Día ${day.id} — ${day.title}${hasNote ? ' (con nota)' : ''}`}
    >
      <Card className="h-full p-4 group-hover:shadow-md transition-all">
        <div className="flex items-start justify-between mb-2">
          <span className="font-display text-2xl text-accent leading-none">
            {day.id}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            {hasNote && (
              <span
                aria-label={`Nota guardada para el día ${day.id}`}
                title="Nota guardada"
                className="w-2 h-2 rounded-full bg-matcha-500 flex-shrink-0"
              />
            )}
            <span className="font-sans text-xs text-fg-subtle">
              {day.date}
            </span>
          </div>
        </div>
        <h2 className="font-sans text-sm font-medium text-fg leading-snug mb-1">
          {day.title}
        </h2>
        {city && (
          <p className="font-sans text-xs text-fg-subtle">
            {city.name}
          </p>
        )}
        {/* Preview first 2 zones */}
        <div className="mt-3 flex flex-wrap gap-1">
          {day.slots
            .flatMap(s => s.zones)
            .slice(0, 2)
            .map(zr => (
              <span
                key={zr.zoneId}
                className="text-xs font-sans text-matcha-700 dark:text-matcha-500 bg-surface border border-matcha-500 px-1.5 py-0.5 rounded-[var(--radius-paper)]"
              >
                {zr.zoneId}
              </span>
            ))}
        </div>
      </Card>
    </Link>
  )
}
