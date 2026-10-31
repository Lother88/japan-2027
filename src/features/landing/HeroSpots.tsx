/**
 * HeroSpots — «tira de billete» del hero: las cifras del viaje (derivadas de los datos), cada
 * una con su spot isométrico (calendario, machiya, billete JR, maletas).
 *
 * Los spots van en el chunk del hero y sus cajas de 56×56 están reservadas desde el primer
 * render. El flotado al pasar el ratón es CSS (index.css, `[data-ticket-cell]`). Las cifras son
 * texto grande (30 px en negrita): cada acento pasa ≥ 3:1 sobre --surface y «días» usa
 * --amber-text (--amber se queda para las rampas de los SVG).
 */
import { tripSummary } from '@/data/trip'
import LazyIso from '@/features/landing/hero-art/LazyIso'
import { heroSpotLoaders, type HeroSpotName } from '@/features/landing/hero-art/registry'

const trip = tripSummary()

const cells: Array<{ valor: number; etiqueta: string; accent: string; spot: HeroSpotName }> = [
  { valor: trip.days, etiqueta: 'días', accent: 'var(--amber-text)', spot: 'koyomi' },
  { valor: trip.bases, etiqueta: 'bases', accent: 'var(--coral)', spot: 'machiya' },
  { valor: trip.excursions, etiqueta: 'excursiones', accent: 'var(--green)', spot: 'kippu' },
  { valor: trip.travelers, etiqueta: 'viajeros', accent: 'var(--coral2)', spot: 'maletas' },
]

export default function HeroSpots() {
  return (
    <ul data-ticket role="list" aria-label="El viaje en cifras">
      {cells.map(({ valor, etiqueta, accent, spot }) => (
        <li key={etiqueta} data-ticket-cell>
          <LazyIso
            load={heroSpotLoaders[spot]}
            artClass={`iso-spot-${spot}`}
            slot="ticket"
            style={{ width: '56px', height: '56px' }}
          />
          <span data-ticket-num style={{ color: accent }}>
            {valor}
          </span>
          <span data-ticket-label>{etiqueta}</span>
        </li>
      ))}
    </ul>
  )
}
