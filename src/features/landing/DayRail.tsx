/**
 * DayRail — barra lateral sticky con progreso del journey.
 *
 * Muestra el día activo, kanji, barra de ticks por día (desktop) y
 * barra horizontal + botones prev/next (mobile via display:none CSS).
 * Es puro (solo lee props; no tiene estado local).
 */
import type { CSSProperties } from 'react'
import type { Day } from '@/data/types'
import { cities } from '@/data'
import {
  getCityMeta,
  formatShortDate,
  pad2,
  fontSerif,
} from '@/features/landing/theme'
import { scrollToDay } from '@/features/landing/scroll'

interface DayRailProps {
  days: readonly Day[]
  activeIndex: number
  progress: number
}

export default function DayRail({ days, activeIndex, progress }: DayRailProps) {
  const active = days[activeIndex] ?? days[0]

  const activeNum = pad2(active.id)
  const seq = pad2(activeIndex + 1)
  const total = days.length
  const activeKanji = getCityMeta(active.citySlug).kanji

  const rawCityName = cities.find(c => c.slug === active.citySlug)?.name ?? active.citySlug
  const activeCityName = rawCityName.replace(/\s*\(.*\)/, '')
  const activeDate = formatShortDate(active.date)

  const progressPct = `${(progress * 100).toFixed(1)}%`

  const hasPrev = activeIndex > 0
  const hasNext = activeIndex < days.length - 1

  const prevDisabledStyle: CSSProperties = hasPrev
    ? {}
    : { opacity: 0.4, pointerEvents: 'none' }

  const nextDisabledStyle: CSSProperties = hasNext
    ? {}
    : { opacity: 0.4, pointerEvents: 'none' }

  return (
    <aside
      data-rail
      style={{
        position: 'sticky',
        top: 0,
        width: '196px',
        height: '100vh',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '22px',
        padding: '30px 20px 40px',
        borderRight: '1px solid var(--border)',
        background: 'var(--surface-warm)',
        zIndex: 5,
      }}
    >
      {/* Botón anterior (solo mobile via CSS externo) */}
      <button
        data-day-nav
        onClick={() => hasPrev && scrollToDay(days[activeIndex - 1].id)}
        aria-label="Día anterior"
        style={{
          display: 'none',
          flexShrink: 0,
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--surface)',
          border: '1px solid var(--border-cream)',
          color: 'var(--ink)',
          cursor: 'pointer',
          ...prevDisabledStyle,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Bloque de info del día activo */}
      <div
        data-rail-block
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          position: 'relative',
        }}
      >
        <span
          data-rail-kanji
          style={{
            fontFamily: fontSerif,
            fontSize: '40px',
            lineHeight: 1,
            color: 'color-mix(in srgb, var(--ink) 13%, transparent)',
            fontWeight: 800,
            marginBottom: '6px',
          }}
        >
          {activeKanji}
        </span>
        <span
          style={{
            fontSize: '11px',
            letterSpacing: '.2em',
            textTransform: 'uppercase',
            color: 'var(--amber)',
            fontWeight: 700,
          }}
        >
          Día {seq} / {total}
        </span>
        <span
          data-rail-num
          style={{
            fontFamily: fontSerif,
            fontWeight: 800,
            fontSize: '74px',
            lineHeight: 0.9,
            color: 'var(--ink)',
          }}
        >
          {activeNum}
        </span>
        <span
          style={{
            fontFamily: fontSerif,
            fontSize: '22px',
            color: 'var(--coral)',
            fontWeight: 600,
          }}
        >
          {activeCityName}
        </span>
        <span
          style={{
            fontSize: '13px',
            color: 'var(--muted2)',
            letterSpacing: '.04em',
          }}
        >
          {activeDate}
        </span>
      </div>

      {/* Barra de progreso vertical + ticks (desktop) */}
      <div
        data-prog-vertical
        style={{
          display: 'flex',
          gap: '14px',
          alignItems: 'stretch',
        }}
      >
        {/* Línea de progreso */}
        <div
          style={{
            position: 'relative',
            width: '3px',
            background: 'var(--chip-cream)',
            borderRadius: '2px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              background: 'linear-gradient(180deg,var(--coral),var(--coral2))',
              borderRadius: '2px',
              height: progressPct,
              transition: 'height .15s linear',
            }}
          />
        </div>

        {/* Ticks por día */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
          }}
        >
          {days.map((d, i) => {
            const col = getCityMeta(d.citySlug).dot
            const passed = i <= activeIndex
            const isActive = i === activeIndex
            const size = isActive ? 13 : 9

            const dotStyle: CSSProperties = {
              flexShrink: 0,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: '50%',
              background: passed ? col : 'var(--tick-idle)',
              transition: 'all .25s ease',
              ...(isActive
                ? {
                    border: '2px solid var(--paper)',
                    boxShadow: `0 0 0 2px ${col}`,
                  }
                : {}),
            }

            return (
              <div
                key={d.id}
                onClick={() => scrollToDay(d.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  padding: '1px 0',
                }}
                role="button"
                tabIndex={0}
                aria-label={`Ir al día ${d.id}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') scrollToDay(d.id)
                }}
              >
                <span style={dotStyle} />
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? col : 'var(--tick-idle-label)',
                    transition: 'color .25s ease',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {d.id}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Barra de progreso horizontal (solo mobile via CSS externo) */}
      <div
        data-prog-horizontal
        style={{
          display: 'none',
          flex: 1,
          flexDirection: 'column',
          gap: '7px',
          minWidth: 0,
        }}
      >
        <div
          style={{
            position: 'relative',
            height: '4px',
            background: 'var(--chip-cream)',
            borderRadius: '2px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              background: 'linear-gradient(90deg,var(--coral),var(--coral2))',
              borderRadius: '2px',
              width: progressPct,
              transition: 'width .15s linear',
            }}
          />
        </div>
        <span style={{ fontSize: '11px', color: 'var(--muted2)' }}>
          {activeCityName} · {activeDate}
        </span>
      </div>

      {/* Botón siguiente (solo mobile via CSS externo) */}
      <button
        data-day-nav
        onClick={() => hasNext && scrollToDay(days[activeIndex + 1].id)}
        aria-label="Día siguiente"
        style={{
          display: 'none',
          flexShrink: 0,
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1b2a4a',
          border: '1px solid #1b2a4a',
          color: '#fdf3e7',
          cursor: 'pointer',
          ...nextDisabledStyle,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </aside>
  )
}
