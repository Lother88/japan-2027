/**
 * TransferBlock — trayectos del día (inter-ciudad o day-trip).
 * Renders one card per Transfer leg, ordered as defined in data.
 * Coherent with TimeSlotBlock visual language; uses semantic tokens.
 * Accessible: each leg is an <article> with aria-label describing the route.
 * Satisfies: TRANSFER-01..04 (legibility, roundTrip, notes, multi-leg)
 */

import type { Transfer, TransferMode } from '@/data/types'

// ── Mode metadata ────────────────────────────────────────────────────────────

const MODE_META: Record<TransferMode, { label: string; emoji: string }> = {
  shinkansen: { label: 'Shinkansen', emoji: '🚄' },
  tren:       { label: 'Tren',       emoji: '🚆' },
  bus:        { label: 'Bus',        emoji: '🚌' },
  avion:      { label: 'Avión',      emoji: '✈️' },
  ferry:      { label: 'Ferry',      emoji: '⛴️' },
  pie:        { label: 'A pie',      emoji: '🚶' },
  coche:      { label: 'Coche',      emoji: '🚗' },
}

// ── Sub-components ───────────────────────────────────────────────────────────

interface TransferLegProps {
  transfer: Transfer
  index: number
}

function TransferLeg({ transfer, index }: TransferLegProps) {
  const meta = MODE_META[transfer.mode]
  const ariaLabel = `Tramo ${index + 1}: ${transfer.from} a ${transfer.to} en ${meta.label}${transfer.roundTrip ? ', ida y vuelta' : ''}`

  return (
    <article
      aria-label={ariaLabel}
      className={[
        'rounded-[var(--radius-card)] border border-border',
        'bg-surface px-4 py-3 space-y-2',
      ].join(' ')}
    >
      {/* From → To + mode */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-display text-base text-fg font-semibold">
          {transfer.from}
        </span>
        <span className="font-sans text-fg-subtle text-sm" aria-hidden="true">→</span>
        <span className="font-display text-base text-fg font-semibold">
          {transfer.to}
        </span>

        {/* Mode chip */}
        <span className="inline-flex items-center gap-1 font-sans text-xs text-fg-muted bg-surface border border-border px-2 py-0.5 rounded-full">
          <span aria-hidden="true">{meta.emoji}</span>
          {meta.label}
        </span>

        {/* Round-trip badge */}
        {transfer.roundTrip && (
          <span className="font-sans text-xs font-medium text-accent border border-accent px-2 py-0.5 rounded-full">
            ida y vuelta
          </span>
        )}
      </div>

      {/* Line & duration row */}
      {(transfer.line ?? transfer.duration) && (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {transfer.line && (
            <span className="font-sans text-xs text-fg-muted">
              {transfer.line}
            </span>
          )}
          {transfer.duration && (
            <span className="font-sans text-xs text-fg-muted font-medium">
              {transfer.duration}
            </span>
          )}
        </div>
      )}

      {/* Notes */}
      {transfer.notes && transfer.notes.length > 0 && (
        <ul className="space-y-0.5 pl-3 list-disc list-outside">
          {transfer.notes.map((note, ni) => (
            <li key={ni} className="font-sans text-xs text-fg-subtle leading-snug">
              {note}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

interface TransferBlockProps {
  transfers: readonly Transfer[]
}

export default function TransferBlock({ transfers }: TransferBlockProps) {
  const heading = transfers.length === 1 ? 'Trayecto del día' : 'Trayectos del día'

  return (
    <section aria-label={heading} className="space-y-3">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-xl text-fg">Trayecto</h2>
        <span className="flex-1 h-px bg-border" />
      </div>

      <div className="space-y-2">
        {transfers.map((transfer, i) => (
          <TransferLeg key={i} transfer={transfer} index={i} />
        ))}
      </div>
    </section>
  )
}
