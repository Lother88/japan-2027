/**
 * RouteSection — banda «La ruta», entre el hero y el itinerario.
 *
 * Abre con la banda «Muro» (muro de piedra con tejadillo, pinos y tōrō) que hace de transición
 * desde el hero; después, la cabecera con el spot de la vía y el mapa MapLibre de la ruta.
 *
 * - La banda y el spot se descargan al acercarse al viewport (cada uno en su chunk).
 * - HeroMap arrastra MapLibre (~1 MB): va en su propio chunk (lazy) y no se monta hasta que la
 *   banda está a menos de 600 px del viewport.
 * - Pantalla completa: HeroMap pasa a `position: fixed` (z-index 1000). Ningún ancestro crea
 *   contexto de apilamiento ni bloque contenedor (sin z-index, transform, filter ni contain),
 *   así que el modal cubre también el rail y los botones flotantes sin portal, y la instancia
 *   de MapLibre no se recrea al maximizar.
 */
import { lazy, Suspense, useCallback, useRef, useState } from 'react'
import { tripSummary } from '@/data/trip'
import LazyIso from '@/features/landing/hero-art/LazyIso'
import { deferredArtLoaders } from '@/features/landing/hero-art/registry'
import { useNearViewport } from '@/features/landing/hero-art/useLazyArt'
import { ROUTE_ANCHOR } from '@/features/landing/scroll'

const HeroMap = lazy(() => import('@/features/map/HeroMap'))

const trip = tripSummary()

export default function RouteSection() {
  const [mapExpanded, setMapExpanded] = useState(false)
  const toggleMap = useCallback(() => setMapExpanded((v) => !v), [])
  const mapBoxRef = useRef<HTMLDivElement>(null)
  const mapNear = useNearViewport(mapBoxRef)

  return (
    <section id={ROUTE_ANCHOR} aria-labelledby="ruta-titulo" data-route>
      <LazyIso
        load={deferredArtLoaders.banda}
        artClass="iso-banda"
        slot="banda"
        defer
        pauseOffscreen
        preserveAspectRatio="xMidYMax slice"
      />

      <div data-route-inner>
        <div data-route-head>
          <LazyIso
            load={deferredArtLoaders.ruta}
            artClass="iso-spot-ruta"
            slot="ruta"
            defer
            pauseOffscreen
            style={{ width: '120px', height: '72px' }}
          />
          <div>
            <h2
              id="ruta-titulo"
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 800,
                fontSize: 'var(--text-h2)',
                lineHeight: 'var(--text-h2--line-height)',
                color: 'var(--ink)',
                margin: 0,
              }}
            >
              La ruta
            </h2>
            <p style={{ margin: '6px 0 0', fontSize: '14px', color: 'var(--slate)' }}>
              {trip.days} días · {trip.bases} bases · {trip.excursions} excursiones
            </p>
          </div>
        </div>

        <div ref={mapBoxRef} data-route-map>
          {mapNear && (
            <Suspense fallback={null}>
              <HeroMap expanded={mapExpanded} onToggleExpand={toggleMap} />
            </Suspense>
          )}

          {/* Leyenda */}
          <div
            data-legend
            style={{
              position: 'absolute',
              top: '14px',
              left: '14px',
              zIndex: 5,
              pointerEvents: 'none',
              border: '1px solid var(--border-2)',
              borderRadius: '9px',
              padding: '9px 13px',
              boxShadow: '0 4px 14px -6px rgba(0,0,0,.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              fontSize: '11.5px',
              color: 'var(--slate)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span style={{ width: '18px', height: '3px', borderRadius: '2px', background: 'var(--map-line)' }} />
              Recorrido principal
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span
                style={{ width: '18px', height: 0, borderTop: '2px dashed var(--amber-deep)', display: 'inline-block' }}
              />
              Excursión de día
            </span>
          </div>

          {/* Marca de agua */}
          <div
            data-watermark
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '14px',
              left: '14px',
              zIndex: 5,
              fontFamily: 'var(--font-serif)',
              fontSize: '30px',
              fontWeight: 800,
              pointerEvents: 'none',
            }}
          >
            日本一周
          </div>
        </div>
      </div>
    </section>
  )
}
