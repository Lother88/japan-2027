/**
 * ItineraryView — /itinerario route
 *
 * Lists all available days as DayCards.
 * Satisfies DAY-01: each entry has link to /dia/:id
 * Satisfies NOTE-05: note indicator on cards with saved notes
 * Responds to light/dark theme via semantic tokens.
 */

import { itinerary } from '@/data'
import DayCard from './DayCard'

export default function ItineraryView() {
  return (
    <section className="w-full px-4 md:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl text-fg mb-2">
          Itinerario
        </h1>
        <p className="font-sans text-fg-muted">
          {itinerary.length} días · 8–29 mayo 2027
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {itinerary.map(day => (
          <DayCard key={day.id} day={day} />
        ))}
      </div>
    </section>
  )
}
