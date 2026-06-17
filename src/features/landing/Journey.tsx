/**
 * Journey — contenedor del itinerario completo.
 *
 * Dos columnas: rail sticky (DayRail) + scrollable main (DaySection por día).
 * Conecta useScrollJourney con el rail para sincronizar progreso y día activo.
 */
import { itinerary } from '@/data'
import { useScrollJourney } from '@/features/landing/useScrollJourney'
import DayRail from '@/features/landing/DayRail'
import DaySection from '@/features/landing/DaySection'

export default function Journey() {
  const { activeIndex, progress } = useScrollJourney()

  return (
    <div
      data-journey
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        background: 'var(--paper)',
      }}
    >
      <DayRail days={itinerary} activeIndex={activeIndex} progress={progress} />

      <main style={{ flex: 1, minWidth: 0, position: 'relative' }}>
        {itinerary.map((day, i) => (
          <DaySection key={day.id} day={day} index={i} />
        ))}
      </main>
    </div>
  )
}
