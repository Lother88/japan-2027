/**
 * DayRail — navegación sticky del journey (`<nav aria-label="Días del viaje">`).
 *
 * Escritorio: día activo (kanji, número, ciudad, fecha), barra de progreso vertical y
 * una lista de enlaces reales `#dia-NN` (uno por día, zona táctil ≥ 24 px).
 * Móvil (≤ 860 px, reglas en index.css): rail compacto de 56 px con enlaces
 * anterior/siguiente, una línea «Día · ciudad · fecha» y la barra de progreso horizontal.
 *
 * Los enlaces usan la navegación nativa por ancla (scroll suave por CSS y
 * `scroll-margin-top` en las secciones), así que funcionan sin JS y actualizan la URL.
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
import { dayAnchor } from '@/features/landing/scroll'

interface DayRailProps {
  days: readonly Day[]
  activeIndex: number
  progress: number
}

function cityName(slug: string): string {
  const raw = cities.find((c) => c.slug === slug)?.name ?? slug
  return raw.replace(/\s*\(.*\)/, '')
}

/** Botón redondo anterior/siguiente del rail móvil (oculto en escritorio por CSS). */
const dayNavStyle: CSSProperties = {
  display: 'flex',
  flexShrink: 0,
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
}

function Chevron({ dir }: { dir: 'prev' | 'next' }) {
  return (
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
      <path d={dir === 'prev' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
    </svg>
  )
}

export default function DayRail({ days, activeIndex, progress }: DayRailProps) {
  const active = days[activeIndex] ?? days[0]

  const activeNum = pad2(active.id)
  const seq = pad2(activeIndex + 1)
  const total = days.length
  const activeKanji = getCityMeta(active.citySlug).kanji
  const activeCityName = cityName(active.citySlug)
  const activeDate = formatShortDate(active.date)

  const progressPct = `${(progress * 100).toFixed(1)}%`

  const prev = activeIndex > 0 ? days[activeIndex - 1] : undefined
  const next = activeIndex < days.length - 1 ? days[activeIndex + 1] : undefined

  const prevStyle: CSSProperties = {
    ...dayNavStyle,
    background: 'var(--surface)',
    border: '1px solid var(--border-cream)',
    color: 'var(--ink)',
  }
  const nextStyle: CSSProperties = {
    ...dayNavStyle,
    background: 'var(--primary-fill)',
    border: '1px solid var(--primary-fill)',
    color: '#fdf3e7',
  }
  const disabled: CSSProperties = { opacity: 0.4 }

  return (
    <nav
      data-rail
      aria-label="Días del viaje"
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
        // Abajo deja sitio al ThemeToggle flotante (26 + 50 px) para que no tape los últimos días.
        padding: '30px 20px 92px',
        borderRight: '1px solid var(--border)',
        background: 'var(--surface-warm)',
        zIndex: 5,
      }}
    >
      {/* Anterior (solo móvil vía CSS) */}
      {prev ? (
        <a data-day-nav href={`#${dayAnchor(prev.id)}`} aria-label={`Día anterior: día ${prev.id}`} style={prevStyle}>
          <Chevron dir="prev" />
        </a>
      ) : (
        <span data-day-nav aria-hidden="true" style={{ ...prevStyle, ...disabled }}>
          <Chevron dir="prev" />
        </span>
      )}

      {/* Bloque de info del día activo (escritorio) */}
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
          aria-hidden="true"
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
            color: 'var(--amber-text)',
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

      {/* Barra de progreso vertical + enlaces por día (escritorio) */}
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
          aria-hidden="true"
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

        {/* Un enlace por día */}
        <ol
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            listStyle: 'none',
            margin: 0,
            padding: 0,
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
              <li key={d.id} style={{ display: 'flex' }}>
                <a
                  data-rail-tick
                  href={`#${dayAnchor(d.id)}`}
                  aria-current={isActive ? 'location' : undefined}
                  aria-label={`Día ${d.id} · ${cityName(d.citySlug)}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    minHeight: '24px',
                    minWidth: '44px',
                    paddingRight: '8px',
                    borderRadius: '6px',
                  }}
                >
                  <span aria-hidden="true" style={{ display: 'flex', width: '13px', justifyContent: 'center' }}>
                    <span style={dotStyle} />
                  </span>
                  <span
                    data-rail-tick-label
                    aria-hidden="true"
                    style={{
                      fontSize: '11px',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--ink)' : 'var(--tick-idle-label)',
                      transition: 'color .25s ease',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {d.id}
                  </span>
                </a>
              </li>
            )
          })}
        </ol>
      </div>

      {/* Línea compacta + barra de progreso horizontal (solo móvil vía CSS) */}
      <div
        data-prog-horizontal
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          gap: '6px',
          minWidth: 0,
        }}
      >
        <span
          style={{
            fontSize: '12.5px',
            color: 'var(--muted2)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <strong style={{ fontFamily: fontSerif, fontSize: '15px', color: 'var(--ink)', fontWeight: 800 }}>
            Día {activeNum}
          </strong>{' '}
          · <span style={{ color: 'var(--coral)', fontWeight: 600 }}>{activeCityName}</span> · {activeDate}
        </span>
        <div
          aria-hidden="true"
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
      </div>

      {/* Siguiente (solo móvil vía CSS) */}
      {next ? (
        <a data-day-nav href={`#${dayAnchor(next.id)}`} aria-label={`Día siguiente: día ${next.id}`} style={nextStyle}>
          <Chevron dir="next" />
        </a>
      ) : (
        <span data-day-nav aria-hidden="true" style={{ ...nextStyle, ...disabled }}>
          <Chevron dir="next" />
        </span>
      )}
    </nav>
  )
}
