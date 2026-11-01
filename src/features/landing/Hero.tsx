/**
 * Hero — sección principal (header) de la landing.
 *
 * Fondo --paper liso con la maqueta isométrica (HeroArt) a la derecha y, en la zona segura de
 * la izquierda, el texto: hojas de calendario con la cuenta atrás (HeroDates), 日本 en vertical
 * con el sello del año, H1, subtítulo, párrafo, tira de billete con las cifras derivadas de los
 * datos (HeroSpots) y el CTA, que baja a la banda «La ruta». En móvil el arte pasa encima del
 * título. Debajo, el aviso «Desplázate» con el poste michishirube.
 *
 * El movimiento ambiental del arte se congela (data-art-paused) cuando la portada sale de
 * pantalla. La maquetación responsive vive en index.css (`[data-hero…]`).
 */
import { useRef } from 'react'
import { calendarDay, numberWord, tripSummary } from '@/data/trip'
import HeroArt from '@/features/landing/HeroArt'
import HeroDates from '@/features/landing/HeroDates'
import HeroSpots from '@/features/landing/HeroSpots'
import LazyIso from '@/features/landing/hero-art/LazyIso'
import { heroSpotLoaders, loadHeroChunk } from '@/features/landing/hero-art/registry'
import { usePausedOffscreen } from '@/features/landing/hero-art/useLazyArt'
import { scrollToJourney, scrollToRoute } from '@/features/landing/scroll'

// El arte del hero se pide en cuanto se evalúa este módulo, sin esperar al primer render
// (el index.html de producción además lo precarga con <link rel="modulepreload">).
loadHeroChunk().catch(() => {
  // Sin red: las cajas reservadas quedan vacías; HeroArt lo reintenta al montar.
})

const trip = tripSummary()
/** Año del sello: el de la salida */
const year = calendarDay(trip.departure).year

/** `today` solo para tests: fija el día de la cuenta atrás (por defecto, el reloj del sistema). */
export default function Hero({ today }: { today?: Date } = {}) {
  const ref = useRef<HTMLElement>(null)
  const paused = usePausedOffscreen(ref)

  return (
    <header ref={ref} data-hero data-art-paused={paused ? '' : undefined}>
      <div data-hero-stage>
        <HeroArt />

        {/* Texto en la zona segura del lienzo (x 0–470 de 1200) */}
        <div data-hero-copy>
          <HeroDates today={today} />

          {/* 日本 en vertical (decorativo) junto al sello, el H1 y el subtítulo */}
          <div data-hero-title>
            <span data-hero-kanji lang="ja" aria-hidden="true">
              日本
            </span>
            <div data-hero-title-side>
              <span data-hanko aria-hidden="true">
                {year}
              </span>
              <h1>Japón</h1>
              <p data-hero-sub>
                <span>Tres semanas,</span> <br />
                <span>una vuelta completa.</span>
              </p>
            </div>
          </div>

          <p data-hero-lead>
            Del neón de Tokio a los templos de Kioto, y vuelta: {trip.days} días en tren por {numberWord(trip.bases)} bases,{' '}
            <strong>entre lo más moderno y lo más tradicional</strong>.
          </p>

          <HeroSpots />

          {/* CTA: baja a la banda «La ruta» */}
          {/* Fondo, hover y presión en index.css ([data-cta]) */}
          <button
            type="button"
            data-cta
            onClick={scrollToRoute}
            style={{
              marginTop: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '11px',
              color: '#fdf3e7',
              border: 'none',
              borderRadius: '10px',
              padding: '15px 26px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
            }}
          >
            Explora la ruta
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fdf3e7"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Aviso de scroll: salta al itinerario; el poste indicador oscila (CSS del SVG) */}
      <button type="button" data-scrollcue onClick={scrollToJourney} aria-label="Desplázate hasta el itinerario">
        <span
          style={{
            fontSize: 'var(--text-label)',
            lineHeight: 'var(--text-label--line-height)',
            letterSpacing: 'var(--text-label--letter-spacing)',
            textTransform: 'uppercase',
          }}
        >
          Desplázate
        </span>
        <LazyIso
          load={heroSpotLoaders.michishirube}
          artClass="iso-spot-michishirube"
          slot="scrollcue"
          style={{ width: '48px', height: '64px' }}
        />
      </button>
    </header>
  )
}
