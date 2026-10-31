/**
 * DaySection — sección completa de un día del itinerario.
 *
 * Renderiza el header (número de día, eyebrow, subtítulo e ilustración isométrica del
 * día en su propio hueco), watermark kanji, transfers y slots del día con animaciones
 * Reveal. La ilustración va a la derecha del título en escritorio y encima en móvil
 * (reglas [data-day-head]/[data-day-art] en index.css). En escritorio el arte ocupa el 36 %
 * de la columna (máx. 280 px) y el subtítulo se equilibra (text-wrap: balance) para que
 * ninguno pase de dos líneas. El kanji de fondo hace parallax por CSS (index.css).
 */
import type { CSSProperties, ReactNode } from 'react'
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
import TransferCard from '@/features/landing/TransferCard'
import SlotBlock from '@/features/landing/SlotBlock'
import { dayAnchor } from '@/features/landing/scroll'

/**
 * Mantiene enteras las palabras con guion («Shirakawa-go», «Kinkaku-ji»): con text-wrap:
 * balance el navegador prefería cortar tras el guion («Shirakawa-» / «go»).
 */
function keepHyphenated(text: string): ReactNode[] {
  return text.split(/(\S+-\S+)/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ whiteSpace: 'nowrap' }}>
        {part}
      </span>
    ) : (
      part
    ),
  )
}

interface DaySectionProps {
  day: Day
  index: number
}

export default function DaySection({ day, index }: DaySectionProps) {
  const tokens = tokensForCity(day.citySlug)
  const meta = getCityMeta(day.citySlug)

  // index par → kanji a la derecha; impar → izquierda (la ilustración vive en la cabecera)
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
  // meta.dot ahora es var(--token): mezclamos con color-mix en vez de hex→rgb
  const tint = `color-mix(in srgb, ${meta.dot} 6%, transparent)`

  const transfers = day.transfers ?? []
  const slots = day.slots

  return (
    <section
      id={dayAnchor(day.id)}
      data-day={day.id}
      data-screen-label={`Día ${pad2(day.id)} · ${cityName}`}
      style={{
        position: 'relative',
        // clip y no hidden: hidden la convierte en contenedor de scroll y el parallax del kanji
        // (animation-timeline: view()) tomaría la sección como scroller y no avanzaría.
        overflow: 'clip',
        background: `linear-gradient(180deg, ${tint} 0%, transparent 40%)`,
      }}
    >
      {/* Watermark kanji */}
      <div
        data-kanji
        style={{
          position: 'absolute',
          top: '6%',
          fontFamily: fontSerif,
          fontWeight: 800,
          fontSize: 'var(--text-watermark)',
          lineHeight: 'var(--text-watermark--line-height)',
          color: `color-mix(in srgb, ${meta.dot} 7%, transparent)`,
          writingMode: 'vertical-rl',
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
          ...kanjiStyle,
        }}
      >
        {meta.kanji}
      </div>

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
          <div
            data-day-head
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(16px,2.4vw,24px)',
              marginBottom: '30px',
            }}
          >
            <div style={{ flex: '1 1 0', minWidth: 0 }}>
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
                    fontSize: 'var(--text-day-num)',
                    color: 'var(--ink)',
                    lineHeight: 'var(--text-day-num--line-height)',
                  }}
                >
                  Día {pad2(day.id)}
                </span>
                <span
                  style={{
                    fontSize: 'var(--text-eyebrow)',
                    lineHeight: 'var(--text-eyebrow--line-height)',
                    letterSpacing: 'var(--text-eyebrow--letter-spacing)',
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
                  fontSize: 'var(--text-day-title)',
                  lineHeight: 'var(--text-day-title--line-height)',
                  textWrap: 'balance',
                  color: tokens.heading,
                  margin: '10px 0 0',
                }}
              >
                {keepHyphenated(subtitle)}
              </h2>
            </div>

            {/* Ilustración isométrica del día (decorativa, carga diferida; nada si no hay) */}
            <DayIllustration day={day.id} style={{ flex: '0 0 clamp(200px,36%,280px)' }} />
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
