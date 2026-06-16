/**
 * ZonePractical — displays practical zone info (access, hours, logistics).
 * Only renders sections that have data (no empty labels).
 * Satisfies ZONE-02.
 */

import type { ZonePractical as ZonePracticalType } from '@/data/types'

interface ZonePracticalProps {
  practical: ZonePracticalType
}

export default function ZonePractical({ practical }: ZonePracticalProps) {
  const hasContent = practical.access ?? practical.hours ?? practical.logistics?.length

  if (!hasContent) return null

  return (
    <section aria-label="Información práctica">
      <h2 className="font-display text-xl text-sumi-900 mb-4">Información práctica</h2>
      <div className="space-y-4">
        {practical.access && (
          <div>
            <h3 className="font-sans text-xs font-medium text-sumi-500 uppercase tracking-wide mb-1">
              Cómo llegar
            </h3>
            <p className="font-sans text-sm text-sumi-900">{practical.access}</p>
          </div>
        )}
        {practical.hours && (
          <div>
            <h3 className="font-sans text-xs font-medium text-sumi-500 uppercase tracking-wide mb-1">
              Horario
            </h3>
            <p className="font-sans text-sm text-sumi-900">{practical.hours}</p>
          </div>
        )}
        {practical.logistics && practical.logistics.length > 0 && (
          <div>
            <h3 className="font-sans text-xs font-medium text-sumi-500 uppercase tracking-wide mb-1">
              Notas logísticas
            </h3>
            <ul className="space-y-1">
              {practical.logistics.map((tip, i) => (
                <li key={i} className="font-sans text-sm text-sumi-900 flex gap-2">
                  <span className="text-urushi-600 mt-0.5 flex-shrink-0">·</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
