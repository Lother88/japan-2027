/**
 * SiteNav — barra de navegación absoluta del hero.
 * El CSS global (o el hook useScrollJourney) controla el comportamiento
 * sticky/transparente mutando [data-nav] directamente; aquí sólo definimos
 * el estilo inicial.
 */

export default function SiteNav() {
  return (
    <nav
      data-nav
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '54px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(16px,3vw,34px)',
        zIndex: 80,
        borderBottom: '1px solid transparent',
        transition: 'background .3s ease,border-color .3s ease,box-shadow .3s ease',
      }}
    >
      {/* Logotipo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(251,246,240,.82)',
          padding: '6px 15px 6px 7px',
          borderRadius: '30px',
          boxShadow: '0 2px 14px rgba(27,42,74,.08)',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#1b2a4a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f6c2d2',
            fontFamily: "'Shippori Mincho', serif",
            fontSize: '17px',
            fontWeight: 700,
          }}
        >
          桜
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
          <span
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontWeight: 700,
              fontSize: '15px',
              color: '#1b2a4a',
              letterSpacing: '.01em',
            }}
          >
            Japón 2027
          </span>
          <span
            style={{
              fontSize: '10px',
              color: '#5a6478',
              letterSpacing: '.13em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              fontWeight: 600,
            }}
          >
            Itinerario · 3 semanas
          </span>
        </div>
      </div>

      {/* Metadata */}
      <div
        data-nav-meta
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          fontSize: '12.5px',
          color: '#5a5e6b',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#e0564b' }}
          />
          8 → 29 mayo
        </span>
        <span style={{ width: '1px', height: '14px', background: '#e0d7c6' }} />
        <span>8 viajeros</span>
        <span style={{ width: '1px', height: '14px', background: '#e0d7c6' }} />
        <span>20 noches</span>
      </div>
    </nav>
  )
}
