/**
 * DaySection — sección completa de un día del itinerario.
 *
 * Renderiza el header (número de día, eyebrow, subtítulo), watermark kanji,
 * ilustración decorativa, transfers y slots del día con animaciones Reveal.
 */
import type { CSSProperties } from 'react'
import type { Day } from '@/data/types'
import { cities } from '@/data'
import {
  getCityMeta,
  tokensForCity,
  formatLongDate,
  pad2,
  fontSerif,
} from '@/features/landing/theme'
import Reveal from '@/features/landing/Reveal'
import { DayIllustration } from '@/features/landing/illustrations'
import { pickIllustration } from '@/features/landing/illustrationKind'
import TransferCard from '@/features/landing/TransferCard'
import SlotBlock from '@/features/landing/SlotBlock'

interface DaySectionProps {
  day: Day
  index: number
}

export default function DaySection({ day, index }: DaySectionProps) {
  const tokens = tokensForCity(day.citySlug)
  const meta = getCityMeta(day.citySlug)

  // index par → ilustración/kanji a la derecha; impar → izquierda
  const side: 'left' | 'right' = index % 2 === 0 ? 'right' : 'left'

  // Subtítulo: parte tras el último '—'; si no hay, title completo
  const dashIdx = day.title.lastIndexOf('—')
  const subtitle = dashIdx >= 0 ? day.title.slice(dashIdx + 1).trim() : day.title

  // Eyebrow: fecha larga + nombre de ciudad (sin paréntesis)
  const rawCityName = cities.find(c => c.slug === day.citySlug)?.name ?? day.citySlug
  const cityName = rawCityName.replace(/\s*\(.*\)/, '')
  const eyebrow = `${formatLongDate(day.date)} · ${cityName}`

  // Posición del kanji watermark
  const kanjiStyle: CSSProperties =
    side === 'right'
      ? { right: '-2%', left: 'auto' }
      : { left: '-2%', right: 'auto' }

  // Tinte de fondo muy suave del color de la ciudad
  // Convierte hex a rgb para poder usar opacidad
  const dot = meta.dot
  const r = parseInt(dot.slice(1, 3), 16)
  const g = parseInt(dot.slice(3, 5), 16)
  const b = parseInt(dot.slice(5, 7), 16)
  const tint = `rgba(${r},${g},${b},0.05)`

  const transfers = day.transfers ?? []
  const slots = day.slots

  return (
    <section
      data-day={day.id}
      data-screen-label={`Día ${pad2(day.id)} · ${cityName}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(180deg, ${tint} 0%, transparent 40%)`,
      }}
    >
      {/* Watermark kanji */}
      <div
        data-kanji
        data-parallax="0.14"
        style={{
          position: 'absolute',
          top: '6%',
          fontFamily: fontSerif,
          fontWeight: 800,
          fontSize: 'clamp(140px,18vw,260px)',
          color: 'rgba(27,42,74,.05)',
          writingMode: 'vertical-rl',
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
          ...kanjiStyle,
        }}
      >
        {meta.kanji}
      </div>

      {/* Ilustración decorativa */}
      <DayIllustration kind={pickIllustration(day.citySlug, day.id)} side={side} />

      {/* Contenido principal */}
      <div
        data-day-inner
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '760px',
          margin: '0 auto',
          padding: 'clamp(70px,11vh,140px) clamp(24px,5vw,56px)',
        }}
      >
        {/* Header */}
        <Reveal delay={0}>
          <div style={{ marginBottom: '30px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '14px',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontFamily: fontSerif,
                  fontWeight: 800,
                  fontSize: 'clamp(40px,6vw,64px)',
                  color: '#1b2a4a',
                  lineHeight: 1,
                }}
              >
                Día {pad2(day.id)}
              </span>
              <span
                style={{
                  fontSize: '13px',
                  letterSpacing: '.16em',
                  textTransform: 'uppercase',
                  color: tokens.eyebrow,
                  fontWeight: 700,
                }}
              >
                {eyebrow}
              </span>
            </div>
            <h2
              style={{
                fontFamily: fontSerif,
                fontWeight: 600,
                fontSize: 'clamp(24px,3.4vw,38px)',
                color: tokens.heading,
                margin: '10px 0 0',
              }}
            >
              {subtitle}
            </h2>
          </div>
        </Reveal>

        {/* Transfers */}
        {transfers.map((t, i) => (
          <Reveal key={i} delay={80}>
            <div style={{ marginBottom: '26px' }}>
              <TransferCard transfer={t} tokens={tokens} />
            </div>
          </Reveal>
        ))}

        {/* Slots */}
        {slots.map((s, i) => (
          <Reveal
            key={s.key}
            delay={120 + 40 * i}
            style={{ marginBottom: i < slots.length - 1 ? '24px' : 0 }}
          >
            <SlotBlock slot={s} tokens={tokens} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
