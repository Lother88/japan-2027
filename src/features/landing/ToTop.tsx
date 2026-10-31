/**
 * ToTop — botón flotante "volver arriba".
 * El estilo inicial es invisible (opacity:0, fuera de interacción).
 * El hook global de scroll (o useScrollJourney) controla opacity/transform/pointerEvents
 * leyendo [data-totop] directamente; aquí sólo declaramos el estado inicial.
 * Mientras está oculto es `inert` (fuera del orden de Tab); useScrollJourney lo alterna.
 */
import { scrollTop } from '@/features/landing/scroll'

export default function ToTop() {
  return (
    <button
      type="button"
      data-totop
      inert
      onClick={scrollTop}
      aria-label="Volver arriba"
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--primary-press)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--primary-fill)'
      }}
      style={{
        position: 'fixed',
        bottom: '26px',
        right: '26px',
        zIndex: 85,
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--primary-fill)',
        color: '#fdf3e7',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 8px 22px -8px rgba(27,42,74,.6)',
        opacity: 0,
        transform: 'translateY(14px) scale(.9)',
        pointerEvents: 'none',
        transition: 'opacity .3s ease,transform .3s ease',
      }}
    >
      <svg
        aria-hidden="true"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  )
}
