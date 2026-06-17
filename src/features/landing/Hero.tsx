/**
 * Hero — sección principal (header) de la landing.
 * Contiene HeroDecor, el texto con stats derivadas de datos,
 * el mapa HeroMap y los controles de scroll.
 */
import { lazy, Suspense } from 'react'
import HeroDecor from '@/features/landing/HeroDecor'
import { scrollToJourney } from '@/features/landing/scroll'
import { itinerary, excursions } from '@/data'

// HeroMap arrastra MapLibre (~1 MB): se separa en su propio chunk con lazy
// para no inflar el bundle inicial.
const HeroMap = lazy(() => import('@/features/map/HeroMap'))

// Stats derivadas de datos (no hardcodeadas)
const dias = itinerary.length
const bases = new Set(itinerary.map((d) => d.citySlug)).size
const excursionesCount = excursions.length
const viajeros = 8

const chips: Array<{ valor: number; etiqueta: string }> = [
  { valor: dias, etiqueta: 'días' },
  { valor: bases, etiqueta: 'bases' },
  { valor: excursionesCount, etiqueta: 'excursiones' },
  { valor: viajeros, etiqueta: 'viajeros' },
]

export default function Hero() {
  return (
    <header
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(180deg,#fdf8f1 0%,#fbf6f0 60%,#f6efe4 100%)',
      }}
    >
      <HeroDecor />

      <div
        data-hero-grid
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1340px',
          margin: '0 auto',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(24px,4vw,64px)',
          padding: '120px clamp(20px,4vw,48px) 90px',
        }}
      >
        {/* Eyebrow absoluto arriba-derecha */}
        <div
          data-eyebrow
          style={{
            position: 'absolute',
            top: '74px',
            right: 'clamp(20px,4vw,48px)',
            zIndex: 4,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ width: '34px', height: '1.5px', background: '#c79a44' }} />
          <span
            style={{
              fontSize: '12px',
              letterSpacing: '.26em',
              textTransform: 'uppercase',
              color: '#b48a35',
              fontWeight: 700,
            }}
          >
            8 → 29 mayo 2027
          </span>
        </div>

        {/* Columna de texto */}
        <div
          data-hero-text
          style={{
            flex: '1 1 42%',
            maxWidth: '560px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <h1
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontWeight: 800,
              fontSize: 'clamp(64px,11vw,148px)',
              lineHeight: 0.92,
              letterSpacing: '-.02em',
              color: '#1b2a4a',
              margin: 0,
            }}
          >
            Japón
          </h1>

          <p
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontWeight: 500,
              fontSize: 'clamp(20px,2.6vw,32px)',
              color: '#c24a5a',
              margin: '14px 0 0',
              lineHeight: 1.25,
            }}
          >
            Tres semanas, una vuelta&nbsp;completa.
          </p>

          <p
            style={{
              fontSize: 'clamp(15px,1.6vw,17px)',
              lineHeight: 1.65,
              color: '#5a5e6b',
              margin: '22px 0 0',
              maxWidth: '430px',
            }}
          >
            Ruta redonda por Narita atravesando ciudades, Alpes japoneses, onsen de
            montaña y la antigua capital. Un viaje con el eje puesto en la{' '}
            <strong style={{ color: '#1b2a4a', fontWeight: 700 }}>cultura</strong>.
          </p>

          {/* Stat chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '30px' }}>
            {chips.map(({ valor, etiqueta }) => (
              <div
                key={etiqueta}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '11px 18px',
                  background: '#fffdf9',
                  border: '1px solid #ece2d2',
                  borderRadius: '12px',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Shippori Mincho', serif",
                    fontWeight: 700,
                    fontSize: '22px',
                    color: '#1b2a4a',
                  }}
                >
                  {valor}
                </span>
                <span style={{ fontSize: '11px', color: '#8a8170', letterSpacing: '.06em' }}>
                  {etiqueta}
                </span>
              </div>
            ))}
          </div>

          {/* Botón CTA */}
          <button
            onClick={scrollToJourney}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#14203a'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1b2a4a'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            style={{
              marginTop: '32px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '11px',
              background: '#1b2a4a',
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
            Explora el itinerario
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

        {/* Columna del mapa */}
        <div
          data-hero-map
          style={{
            flex: '1 1 56%',
            height: 'min(66vh,640px)',
            position: 'relative',
            borderRadius: '18px',
            border: '1px solid #e2d8c7',
            boxShadow: '0 22px 50px -24px rgba(27,42,74,.4)',
            overflow: 'hidden',
            background: '#eef0ee',
          }}
        >
          <Suspense fallback={null}>
            <HeroMap />
          </Suspense>

          {/* Leyenda */}
          <div
            style={{
              position: 'absolute',
              top: '14px',
              left: '14px',
              zIndex: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                background: 'rgba(255,253,249,.94)',
                border: '1px solid #e7ddcc',
                borderRadius: '9px',
                padding: '9px 13px',
                boxShadow: '0 4px 14px -6px rgba(0,0,0,.25)',
              }}
            >
              <div
                style={{
                  fontFamily: "'Shippori Mincho', serif",
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#1b2a4a',
                  marginBottom: '7px',
                }}
              >
                La ruta
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  fontSize: '11.5px',
                  color: '#5a5e6b',
                  marginBottom: '4px',
                }}
              >
                <span
                  style={{ width: '18px', height: '3px', borderRadius: '2px', background: '#1b2a4a' }}
                />
                Recorrido principal
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  fontSize: '11.5px',
                  color: '#5a5e6b',
                }}
              >
                <span
                  style={{
                    width: '18px',
                    height: 0,
                    borderTop: '2px dashed #c79a44',
                    display: 'inline-block',
                  }}
                />
                Excursión de día
              </div>
            </div>
          </div>

          {/* Watermark */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '14px',
              left: '14px',
              zIndex: 5,
              fontFamily: "'Shippori Mincho', serif",
              fontSize: '30px',
              color: 'rgba(27,42,74,.16)',
              fontWeight: 800,
              pointerEvents: 'none',
            }}
          >
            日本一周
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div
        onClick={scrollToJourney}
        style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            fontSize: '10.5px',
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            color: '#8a8170',
          }}
        >
          Desplázate
        </span>
        <svg
          aria-hidden="true"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#c24a5a"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ animation: 'ignBounce 2s ease-in-out infinite' }}
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </header>
  )
}
