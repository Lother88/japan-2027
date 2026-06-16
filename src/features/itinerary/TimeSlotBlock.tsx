/**
 * TimeSlotBlock — morning or afternoon block for DayView.
 * Shows slot label, summary (no spoilers), and zone links or "En tránsito".
 * Satisfies DAY-02, DAY-03, DAY-04, DAY-05, NOSPOIL-02, NOSPOIL-03
 */

import { Link } from 'react-router'
import type { TimeSlot } from '@/data/types'
import { getZone } from '@/data'

interface TimeSlotBlockProps {
  slot: TimeSlot
}

export default function TimeSlotBlock({ slot }: TimeSlotBlockProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-xl text-sumi-900">{slot.label}</h2>
        <span className="flex-1 h-px bg-washi-200" />
      </div>

      <p className="font-sans text-sm text-sumi-700 leading-relaxed">
        {slot.summary}
      </p>

      {slot.zones.length === 0 ? (
        <p className="font-sans text-sm text-sumi-500 italic">En tránsito</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {slot.zones.map(zr => {
            const zone = getZone(zr.zoneId)
            if (!zone) return null
            return (
              <Link
                key={zr.zoneId}
                to={`/zona/${zone.citySlug}/${zone.id}`}
                className={[
                  'font-sans text-sm font-medium',
                  'px-3 py-2 rounded-[var(--radius-card)]',
                  'bg-washi-100 border border-washi-200',
                  'text-sumi-900 hover:border-urushi-600 hover:text-urushi-600',
                  'transition-colors min-h-[44px] flex items-center',
                ].join(' ')}
                aria-label={`Ver zona: ${zone.name}`}
              >
                {zone.name}
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
