/**
 * Home — / route
 *
 * Hero section with Japanese visual identity.
 * GlobalMap full-bleed section (lazy-loaded MapLibre).
 * Itinerary preview grid.
 *
 * Satisfies MAP-04 (GlobalMap in home), UX-01 (motion animations),
 *   UX-02 (full-bleed map).
 * Responds to light/dark theme via semantic tokens.
 */

import { lazy, Suspense } from 'react'
import { Link } from 'react-router'
import { motion, useReducedMotion } from 'motion/react'
import { itinerary } from '@/data'
import { getCity } from '@/data'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'

// Lazy-load map to keep initial bundle small
const GlobalMap = lazy(() => import('@/features/map/GlobalMap'))

// Motion variants — respect prefers-reduced-motion
function useFadeIn() {
  const reducedMotion = useReducedMotion()
  return {
    initial: { opacity: 0, y: reducedMotion ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reducedMotion ? 0 : 0.5, ease: 'easeOut' as const },
  }
}

function HeroSection() {
  const fadeIn = useFadeIn()

  return (
    // Hero always uses deep sumi background regardless of theme — it's intentional
    <section className="w-full min-h-[60svh] bg-sumi-900 flex flex-col items-center justify-center text-washi-50 px-4 md:px-8 py-16 md:py-24 relative overflow-hidden">
      {/* Decorative background lines — subtle Japanese aesthetic */}
      <div aria-hidden="true" className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-px h-full bg-washi-50" />
        <div className="absolute top-0 left-1/2 w-px h-full bg-washi-50" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-washi-50" />
      </div>

      {/* Accent line — urushi red */}
      <motion.div
        aria-hidden="true"
        className="w-16 h-px bg-urushi-600 mb-8"
        {...fadeIn}
      />

      <motion.p
        className="font-sans text-xs uppercase tracking-[0.3em] text-washi-100 mb-4"
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.1 }}
      >
        8–29 mayo 2027
      </motion.p>

      <motion.h1
        className="font-display text-4xl md:text-6xl lg:text-7xl text-center leading-tight mb-6 max-w-3xl"
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.2 }}
      >
        Japón 2027
      </motion.h1>

      <motion.p
        className="font-sans text-base md:text-lg text-washi-100 text-center max-w-xl mb-10 leading-relaxed"
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.3 }}
      >
        Ruta redonda por Narita · 20 noches · Tokio · Onsen · Alpes · Kioto · Osaka
      </motion.p>

      <motion.div
        className="flex flex-wrap gap-4 justify-center"
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.4 }}
      >
        <Link to="/itinerario">
          <Button variant="primary">
            Ver itinerario
          </Button>
        </Link>
        <Link to="/mapa">
          <Button variant="ghost" className="text-washi-50 border-washi-200 hover:bg-sumi-700">
            Ver mapa
          </Button>
        </Link>
      </motion.div>

      {/* Bottom accent */}
      <motion.div
        aria-hidden="true"
        className="w-16 h-px bg-urushi-600 mt-12"
        {...fadeIn}
        transition={{ ...fadeIn.transition, delay: 0.5 }}
      />
    </section>
  )
}

function MapSection() {
  return (
    <section className="w-full" style={{ height: '50svh', minHeight: '320px' }}>
      <Suspense fallback={
        <div className="w-full h-full bg-surface border-y border-border flex items-center justify-center">
          <p className="font-sans text-sm text-fg-subtle">Cargando mapa de ruta…</p>
        </div>
      }>
        <GlobalMap style={{ width: '100%', height: '100%' }} />
      </Suspense>
      <div className="flex justify-end px-4 md:px-8 py-3 bg-bg border-b border-border">
        <Link to="/mapa" className="font-sans text-sm text-accent hover:underline">
          Ver mapa completo →
        </Link>
      </div>
    </section>
  )
}

function ItineraryPreview() {
  const previewDays = itinerary.slice(0, 4) // pilot days 9-12
  const fadeIn = useFadeIn()

  return (
    <section className="w-full px-4 md:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl md:text-3xl text-fg">
          Bloque Tokio · piloto
        </h2>
        <Link
          to="/itinerario"
          className="font-sans text-sm text-accent hover:underline"
        >
          Ver todo →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {previewDays.map((day, i) => {
          const city = getCity(day.citySlug)
          return (
            <motion.div
              key={day.id}
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: i * 0.08 }}
            >
              <Link
                to={`/dia/${day.id}`}
                className="block group"
                aria-label={`Ir al día ${day.id}`}
              >
                <Card className="h-full p-5 group-hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-display text-3xl text-accent leading-none">
                      {day.id}
                    </span>
                    <span className="font-sans text-xs text-fg-subtle">
                      {new Date(day.date + 'T00:00:00').toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                  <h3 className="font-sans text-sm font-medium text-fg leading-snug">
                    {day.title.split('—')[1]?.trim() ?? day.title}
                  </h3>
                  {city && (
                    <p className="font-sans text-xs text-fg-subtle mt-1">
                      {city.name}
                    </p>
                  )}
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div className="w-full">
      <HeroSection />
      <MapSection />
      <ItineraryPreview />
    </div>
  )
}
