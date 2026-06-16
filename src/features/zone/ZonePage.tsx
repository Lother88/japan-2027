/**
 * ZonePage — /zona/:citySlug/:slug route
 *
 * Shows zone name, tags, practical info, mini-map, Google Maps embed, notes.
 * NO description field (anti-spoiler).
 *
 * Satisfies ZONE-01 to ZONE-04, NOSPOIL-02, NOSPOIL-03, NOTE-05
 */

import { useParams, Link, useNavigate } from 'react-router'
import { lazy, Suspense } from 'react'
import { getZone, getCity } from '@/data'
import { PageHeader } from '@/components/PageHeader'
import { Tag } from '@/components/Tag'
import ZonePractical from './ZonePractical'
import NotesPanel from '@/features/notes/NotesPanel'
import GoogleMapsEmbed from './GoogleMapsEmbed'

// Lazy-load the mini-map to avoid loading MapLibre unless needed
const ZoneMiniMap = lazy(() => import('@/features/map/ZoneMiniMap'))

// Google Maps direct link (no API key, public search URL)
function GoogleMapsLink({ name, coordinates }: { name: string; coordinates?: readonly [number, number] }) {
  const url = coordinates
    ? `https://www.google.com/maps/search/?api=1&query=${coordinates[1]},${coordinates[0]}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' Japan')}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        'inline-flex items-center gap-2',
        'font-sans text-sm font-medium',
        'px-4 py-2 rounded-[var(--radius-card)]',
        'border border-ai-700 text-ai-700',
        'hover:bg-washi-100 transition-colors',
        'min-h-[44px]',
      ].join(' ')}
      aria-label={`Ver ${name} en Google Maps`}
    >
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      Ver en Google Maps
    </a>
  )
}

export default function ZonePage() {
  const { citySlug, slug } = useParams<{ citySlug: string; slug: string }>()
  const navigate = useNavigate()
  const zone = getZone(slug ?? '')
  const city = getCity(citySlug ?? '')

  // 404 if zone not found
  if (!zone || zone.citySlug !== citySlug) {
    return (
      <div className="w-full px-4 md:px-8 py-16 text-center">
        <h1 className="font-display text-2xl text-sumi-900 mb-4">Zona no encontrada</h1>
        <p className="font-sans text-sumi-700 mb-6">
          No existe la zona <code className="font-mono">{slug}</code>.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="font-sans text-urushi-600 underline mr-4"
        >
          ← Volver
        </button>
        <Link to="/itinerario" className="font-sans text-urushi-600 underline">
          Ver itinerario
        </Link>
      </div>
    )
  }

  const { name, tags, practical, coordinates } = zone

  return (
    <article className="w-full">
      <PageHeader
        title={name}
        subtitle={city?.name}
        meta="Zona"
      />

      <div className="px-4 md:px-8 py-8 space-y-8 max-w-3xl">

        {/* Tags */}
        {tags.length > 0 && (
          <section aria-label="Categorías">
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Tag key={tag} label={tag} />
              ))}
            </div>
          </section>
        )}

        {/* Practical info */}
        <ZonePractical practical={practical} />

        {/* Mini-map (lazy, only if zone has coordinates) */}
        {coordinates && (
          <section aria-label="Ubicación en mapa">
            <Suspense fallback={
              <div className="w-full h-48 bg-washi-100 rounded-[var(--radius-card)] border border-washi-200 flex items-center justify-center">
                <p className="font-sans text-xs text-sumi-500">Cargando mapa…</p>
              </div>
            }>
              <ZoneMiniMap coordinates={coordinates} name={name} />
            </Suspense>
          </section>
        )}

        {/* Google Maps section */}
        <section aria-label="Google Maps">
          <div className="space-y-3">
            <GoogleMapsLink name={name} coordinates={coordinates} />
            {coordinates && (
              <GoogleMapsEmbed name={name} coordinates={coordinates} />
            )}
          </div>
        </section>

        {/* Notes panel */}
        <NotesPanel sectionId={`zone:${zone.id}`} label="Notas de la zona" />

        {/* Back link */}
        <div className="pt-4 border-t border-washi-200">
          <button
            onClick={() => navigate(-1)}
            className="font-sans text-sm text-urushi-600 hover:underline min-h-[44px] flex items-center"
          >
            ← Volver
          </button>
        </div>
      </div>
    </article>
  )
}
