/**
 * SiteFooter — pie de página de la landing.
 * Fondo navy oscuro (#14203a), resumen del viaje y decisiones de scope.
 */
import type { CSSProperties } from 'react'

const chipStyle: CSSProperties = {
  fontSize: '12px',
  color: '#cdd6e7',
  background: 'rgba(255,255,255,.06)',
  border: '1px solid rgba(255,255,255,.1)',
  padding: '5px 12px',
  borderRadius: '20px',
}

export default function SiteFooter() {
  return (
    <footer
      style={{
        position: 'relative',
        background: '#14203a',
        color: '#b9c4db',
        padding: 'clamp(44px,7vh,80px) clamp(24px,5vw,56px) 56px',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '32px',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          {/* Bloque izquierdo — identidad */}
          <div style={{ maxWidth: '340px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '11px',
                marginBottom: '14px',
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: '#f6c2d2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1b2a4a',
                  fontFamily: "'Shippori Mincho', serif",
                  fontSize: '18px',
                  fontWeight: 700,
                }}
              >
                桜
              </div>
              <span
                style={{
                  fontFamily: "'Shippori Mincho', serif",
                  fontSize: '18px',
                  color: '#fdf3e7',
                  fontWeight: 700,
                }}
              >
                Japón 2027
              </span>
            </div>
            <p
              style={{
                fontSize: '13.5px',
                lineHeight: 1.6,
                margin: 0,
                color: '#9fb0d0',
              }}
            >
              Ruta redonda por Narita · 8 → 29 mayo 2027 · 20 noches · 4 viajeros · eje cultura.
            </p>
          </div>

          {/* Bloque derecho — decisiones de scope */}
          <div>
            <div
              style={{
                fontSize: '11px',
                letterSpacing: '.16em',
                textTransform: 'uppercase',
                color: '#f6c2d2',
                fontWeight: 700,
                marginBottom: '12px',
              }}
            >
              Decisiones de scope
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxWidth: '420px' }}>
              <span style={chipStyle}>Hiroshima sin pernocta</span>
              <span style={chipStyle}>Shirakawa-go sin maletas</span>
              <span style={chipStyle}>Fuji desde el shinkansen</span>
              <span style={chipStyle}>Miyajima → open-jaw</span>
            </div>
          </div>
        </div>

        {/* Línea inferior */}
        <div
          style={{
            marginTop: '36px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255,255,255,.1)',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            fontSize: '12px',
            color: '#7d8aa6',
          }}
        >
          <span>
            Orden Kanazawa ↔ Takayama por confirmar · logística ferroviaria a re-verificar para 2027
          </span>
          <span>桜 · 日本一周</span>
        </div>
      </div>
    </footer>
  )
}
