/**
 * Hero — sección principal (header) de la landing.
 *
 * Fondo --paper liso con la maqueta isométrica (HeroArt) a la derecha y, en la zona segura de
 * la izquierda, el texto: eyebrow con fechas, H1, subtítulo, párrafo, tira de billete con las
 * cifras derivadas de los datos (HeroSpots) y el CTA, que baja a la banda «La ruta». En móvil
 * el arte pasa encima del título. Debajo, el aviso «Desplázate» con el poste michishirube.
 *
 * El movimiento ambiental del arte se congela (data-art-paused) cuando la portada sale de
 * pantalla. La maquetación responsive vive en index.css (`[data-hero…]`).
 */
import { useRef } from 'react'
import { tripSummary } from '@/data/trip'
import HeroArt from '@/features/landing/HeroArt'
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

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const paused = usePausedOffscreen(ref)

  return (
    <header ref={ref} data-hero data-art-paused={paused ? '' : undefined}>
      <div data-hero-stage>
        <HeroArt />

        {/* Texto en la zona segura del lienzo (x 0–470 de 1200) */}
        <div data-hero-copy>
          <div data-eyebrow style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
            <span style={{ width: '34px', height: '1.5px', background: 'var(--amber-deep)' }} />
            <span
              style={{
                fontSize: '12px',
                letterSpacing: '.26em',
                textTransform: 'uppercase',
                color: 'var(--amber-text)',
                fontWeight: 700,
              }}
            >
              {trip.dateRange}
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontWeight: 800,
              fontSize: 'clamp(64px,10vw,148px)',
              lineHeight: 0.92,
              letterSpacing: '-.02em',
              color: 'var(--ink)',
              margin: 0,
            }}
          >
            Japón
          </h1>

          <p
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontWeight: 500,
              fontSize: 'clamp(20px,2.4vw,32px)',
              color: 'var(--coral)',
              margin: '24px 0 0',
              lineHeight: 1.25,
            }}
          >
            Tres semanas, una vuelta&nbsp;completa.
          </p>

          <p
            style={{
              fontSize: 'clamp(15px,1.4vw,17px)',
              lineHeight: 1.65,
              color: 'var(--slate)',
              margin: '18px 0 0',
              maxWidth: '430px',
            }}
          >
            Ruta completa por todos los aspectos de Japón,{' '}
            <strong style={{ color: 'var(--ink)', fontWeight: 700 }}>lo moderno y lo tradicional</strong>,
            recorriendo los lugares que nos ofrece el país del sol naciente.
          </p>

          <HeroSpots />

          {/* CTA: baja a la banda «La ruta» */}
          <button
            type="button"
            onClick={scrollToRoute}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--primary-press)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--primary-fill)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            style={{
              marginTop: '28px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '11px',
              background: 'var(--primary-fill)',
              color: '#fdf3e7',
              border: 'none',
              borderRadius: '10px',
              padding: '15px 26px',
              fontFamily: "'Zen Kaku Gothic New', sans-serif",
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'background .2s ease,transform .2s ease',
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
        <span style={{ fontSize: '10.5px', letterSpacing: '.22em', textTransform: 'uppercase' }}>Desplázate</span>
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
