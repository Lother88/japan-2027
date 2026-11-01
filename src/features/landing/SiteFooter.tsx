/**
 * SiteFooter — pie de página de la landing.
 * Fondo navy oscuro (#14203a), resumen del viaje (cifras derivadas de los datos)
 * y notas del viaje. La marca es el spot isométrico de un omamori (amuleto), generado para
 * este azul fijo del pie, así que no cambia con el tema. Se descarga al acercarse al viewport.
 */
import type { CSSProperties } from 'react'
import { tripSummary } from '@/data/trip'
import LazyIso from '@/features/landing/hero-art/LazyIso'
import { deferredArtLoaders } from '@/features/landing/hero-art/registry'

const trip = tripSummary()

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
              <LazyIso
                load={deferredArtLoaders.omamori}
                artClass="iso-spot-omamori"
                slot="omamori"
                defer
                style={{ width: '40px', height: '48px' }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
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
              Ruta redonda por Narita · {trip.dateRange} · {trip.nights} noches · {trip.bases} bases ·{' '}
              {trip.excursions} excursiones · {trip.travelers} viajeros · eje cultura.
            </p>
          </div>

          {/* Bloque derecho — notas del viaje */}
          <div>
            <div
              style={{
                fontSize: 'var(--text-label)',
                letterSpacing: 'var(--text-label--letter-spacing)',
                textTransform: 'uppercase',
                color: '#f6c2d2',
                fontWeight: 700,
                marginBottom: '12px',
              }}
            >
              Notas del viaje
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxWidth: '420px' }}>
              <span style={chipStyle}>Hiroshima sin pernocta</span>
              <span style={chipStyle}>Shirakawa-go sin maletas</span>
              <span style={chipStyle}>Fuji desde el shinkansen</span>
              <span style={chipStyle}>Miyajima, para otro viaje</span>
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
