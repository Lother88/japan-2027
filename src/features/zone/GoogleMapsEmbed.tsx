/**
 * GoogleMapsEmbed — lazy/collapsible Google Maps iframe for a zone.
 *
 * Embed method confirmed: legacy public endpoint (no API key, no billing).
 * URL format: https://www.google.com/maps?q=<lat>,<lng>&output=embed
 * Source: dev.to/hardiquedasore/how-to-embed-google-map-without-api-key-1ii7
 *         observablehq.com/@mariodelgadosr/embedding-google-maps-in-an-iframe-without-an-api-key
 *
 * Satisfies design.md ADR-001 hybrid: Google Maps for individual sites.
 * NO API key required.
 */

import { useState } from 'react'
import type { LngLat } from '@/data/types'

interface GoogleMapsEmbedProps {
  name: string
  coordinates?: LngLat
}

export default function GoogleMapsEmbed({ name, coordinates }: GoogleMapsEmbedProps) {
  const [expanded, setExpanded] = useState(false)

  const query = coordinates
    ? `${coordinates[1]},${coordinates[0]}`
    : encodeURIComponent(name)

  const embedUrl = `https://www.google.com/maps?q=${query}&output=embed`

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className={[
          'font-sans text-sm font-medium text-sumi-700',
          'flex items-center gap-2',
          'hover:text-sumi-900 transition-colors',
          'min-h-[44px]',
        ].join(' ')}
        aria-expanded={expanded}
        aria-controls="google-maps-embed"
      >
        <svg
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform ${expanded ? 'rotate-90' : ''}`}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        {expanded ? 'Ocultar mapa de Google' : 'Ver en mapa de Google'}
      </button>

      {expanded && (
        <div
          id="google-maps-embed"
          className="w-full h-64 rounded-[var(--radius-card)] overflow-hidden border border-washi-200"
        >
          <iframe
            title={`Google Maps — ${name}`}
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            aria-label={`Mapa de Google para ${name}`}
          />
        </div>
      )}
    </div>
  )
}
