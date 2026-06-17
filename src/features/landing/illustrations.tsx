/**
 * Ilustraciones decorativas por día — SVG copiados del nuevo diseño (Claude Design).
 *
 * Tres motivos reutilizables, uno por día construido del prototipo:
 *   - pagoda ← Día 9  (Asakusa): templo + torii + pagoda.
 *   - skyline ← Día 10 (Tokio):  skyline urbano + Tokyo Tower.
 *   - onsen ← Día 13  (Takaragawa): montañas + onsen + vapor (animation:ignSteam).
 *
 * Se eligen por ciudad (ver illustrationKind.ts). Son decorativas (aria-hidden) y
 * llevan parallax suave (data-parallax). Las figuras del nuevo diseño se anclan
 * a bottom:0 y a un lado fijo; respetamos el contrato `side` para alternar lado.
 *
 * Color: tintas estructurales usan variables CSS (#1b2a4a, #c24a5a,
 * #d8453f, #e8a33f, #3f6f5f) para adaptarse al tema. Los
 * rellenos pastel/crema decorativos se dejan fijos: bajo el atenuado de modo
 * oscuro ([data-illus]{opacity:.5}) quedan suaves, ni invisibles ni estridentes.
 */
import type { CSSProperties, ReactElement } from 'react'
import type { IllustrationKind } from '@/features/landing/illustrationKind'

interface DayIllustrationProps {
  kind: IllustrationKind
  side: 'left' | 'right'
}

/** Posición lateral fija (el lado se decide en DaySection y alterna por día). */
function sideStyle(side: 'left' | 'right'): CSSProperties {
  return side === 'left' ? { left: '3%' } : { right: '3%' }
}

/**
 * Genera una rejilla de ventanas para un edificio del skyline.
 * `lit` recibe (col,row) y devuelve true si la ventana va en ámbar (luz encendida).
 */
function windows(
  cols: number[],
  rows: number[],
  lit: (col: number, row: number) => boolean,
): ReactElement[] {
  const cells: ReactElement[] = []
  rows.forEach((y, r) =>
    cols.forEach((x, c) => {
      cells.push(
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="4.4"
          height="5.4"
          fill={lit(c, r) ? '#ffcf7a' : '#9fb0d0'}
          stroke="none"
        />,
      )
    }),
  )
  return cells
}

export function DayIllustration({ kind, side }: DayIllustrationProps) {
  const base: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    zIndex: 0,
    pointerEvents: 'none',
    ...sideStyle(side),
  }

  if (kind === 'skyline') {
    // Día 10 — skyline urbano + Tokyo Tower.
    return (
      <svg
        data-illus
        data-parallax="0.09"
        aria-hidden="true"
        viewBox="0 0 340 230"
        preserveAspectRatio="xMidYMax meet"
        style={{ ...base, width: 'min(36vw,440px)', opacity: 0.6 }}
      >
        <g stroke="#1b2a4a" strokeWidth={2} strokeLinejoin="round">
          {/* Edificio A */}
          <rect x="14" y="150" width="34" height="80" fill="#eef0f6" />
          {windows([20, 27, 34, 41], [158, 167, 176, 185, 194, 203, 212], () => false)}
          {/* Edificio B */}
          <rect x="54" y="110" width="30" height="120" fill="#f7efe2" />
          {windows([59, 66, 73], [118, 127, 136, 145, 154, 163, 172, 181, 190, 199, 208], (c, r) => (c + r) % 3 === 0)}
          {/* Edificio C */}
          <rect x="120" y="128" width="34" height="102" fill="#eef0f6" />
          {windows([126, 133, 140, 147], [136, 145, 154, 163, 172, 181, 190, 199, 208], () => false)}
          {/* Edificio D */}
          <rect x="160" y="92" width="30" height="138" fill="#f3e7ef" />
          {windows([165, 172, 179], [100, 109, 118, 127, 136, 145, 154, 163, 172, 181, 190, 199, 208], (c, r) => (c + r) % 3 === 0)}
          {/* Edificio puntiagudo (chapitel) */}
          <path d="M236 230 V96 L250 78 L264 96 V230" fill="#eef0f6" />
          <path d="M242 96h16M236 122h28M236 150h28M236 178h28" strokeWidth={1.3} />
          {/* Edificio E */}
          <rect x="276" y="120" width="32" height="110" fill="#f7efe2" />
          {windows([282, 289, 296, 303], [128, 137, 146, 155, 164, 173, 182, 191, 200, 209], (c, r) => (c + r) % 3 === 0)}
          {/* Tokyo Tower */}
          <g stroke="#d8453f" fill="none" strokeWidth={2}>
            <path d="M206 150 L201 186 L211 186 Z M199 196 L213 196 L218 230 L194 230 Z" />
            <path d="M200 188 L212 188 M196 214 L216 214" strokeWidth={1.3} />
            <path d="M206 150 V126" strokeWidth={2.4} />
            <circle cx="206" cy="123" r="3.4" fill="#e8a33f" stroke="#d8453f" />
          </g>
          {/* Suelo */}
          <path d="M0 230 H340" strokeWidth={2.4} />
        </g>
      </svg>
    )
  }

  if (kind === 'onsen') {
    // Día 13 — montañas + onsen + vapor.
    return (
      <svg
        data-illus
        data-parallax="0.07"
        aria-hidden="true"
        viewBox="0 0 340 240"
        preserveAspectRatio="xMidYMax meet"
        style={{ ...base, width: 'min(38vw,460px)', opacity: 0.62 }}
      >
        {/* Montañas de fondo */}
        <path d="M0 150 L60 70 L104 120 L150 56 L210 124 L262 80 L340 140 V240 H0 Z" fill="#dbe7e0" stroke="#3f6f5f" strokeWidth={2} />
        <path d="M60 70 L80 98 L40 98 Z M150 56 L172 88 L128 88 Z" fill="#fbfdfb" />
        {/* Loma intermedia */}
        <path d="M0 178 L70 138 L150 170 L240 134 L340 172 V240 H0 Z" fill="#c2d8cc" stroke="#3f6f5f" strokeWidth={1.6} />
        {/* Estanque (onsen) */}
        <ellipse cx="180" cy="208" rx="120" ry="26" fill="#bcd6e2" stroke="#3f6f5f" strokeWidth={2} />
        <ellipse cx="180" cy="205" rx="120" ry="24" fill="#d6ebf2" />
        {/* Rocas del borde */}
        <g fill="#8aa39a" stroke="#3f6f5f" strokeWidth={1.6}>
          <path d="M70 200 q-14 -16 6 -22 q20 -3 18 14 q-2 12 -24 8 Z" />
          <path d="M286 198 q18 -16 -2 -24 q-22 -3 -20 14 q2 14 22 10 Z" />
          <ellipse cx="120" cy="222" rx="16" ry="7" />
          <ellipse cx="240" cy="224" rx="18" ry="7" />
        </g>
        {/* Casita de baño */}
        <g fill="#9aa39c" stroke="#3f6f5f" strokeWidth={1.6}>
          <rect x="40" y="176" width="16" height="10" />
          <path d="M36 176 h24 l-5 -10 h-14 z" fill="#7e8a82" />
          <rect x="44" y="186" width="8" height="20" />
        </g>
        {/* Abeto */}
        <g fill="#3f6f5f">
          <path d="M300 150 l14 28 h-28 z" />
          <path d="M300 138 l11 22 h-22 z" />
          <rect x="298" y="176" width="4" height="10" />
        </g>
        {/* Vapor (animación ignSteam) */}
        <g fill="none" stroke="#acc7bd" strokeWidth={3.4} strokeLinecap="round" opacity={0.75}>
          <path d="M150 196 C140 176 160 168 150 148 C142 132 162 124 154 108" style={{ animation: 'ignSteam 5s ease-in-out infinite' }} />
          <path d="M210 198 C200 178 220 170 210 150 C202 134 222 126 214 110" style={{ animation: 'ignSteam 5.6s ease-in-out infinite .7s' }} />
        </g>
      </svg>
    )
  }

  // pagoda — Día 9 (Asakusa): templo + torii + pagoda.
  return (
    <svg
      data-illus
      data-parallax="0.08"
      aria-hidden="true"
      viewBox="0 0 320 250"
      preserveAspectRatio="xMidYMax meet"
      style={{ ...base, width: 'min(34vw,420px)', opacity: 0.62 }}
    >
      <g stroke="#1b2a4a" strokeWidth={2} strokeLinejoin="round">
        {/* Pagoda de cinco pisos (derecha) */}
        <g fill="#f7efe2">
          <rect x="244" y="206" width="30" height="40" />
          <path d="M236 206 q23 -14 46 0 z" fill="#c24a5a" />
          <rect x="246" y="176" width="26" height="30" />
          <path d="M234 176 q25 -16 52 0 z" fill="#c24a5a" />
          <rect x="248" y="148" width="22" height="28" />
          <path d="M236 148 q23 -15 46 0 z" fill="#c24a5a" />
          <rect x="250" y="122" width="18" height="26" />
          <path d="M240 122 q19 -13 38 0 z" fill="#c24a5a" />
          <path d="M259 122 V104" strokeWidth={2.5} />
          <circle cx="259" cy="100" r="4" fill="#e8a33f" />
        </g>
        {/* Hondo / sala del templo (centro) */}
        <g fill="#fbf4ea">
          <rect x="96" y="214" width="120" height="32" />
          <rect x="104" y="170" width="104" height="44" />
          <path d="M104 182 h104 M120 170 v44 M156 170 v44 M192 170 v44" strokeWidth={1.3} />
          <path d="M156 120 L92 168 Q80 176 92 176 L220 176 Q232 176 220 168 Z" fill="#c24a5a" />
          <path d="M92 176 Q86 184 78 188 L96 184 Z M220 176 Q226 184 234 188 L216 184 Z" fill="#c24a5a" />
          <path d="M156 120 L132 150 H180 Z" fill="#e8a33f" opacity={0.9} />
        </g>
        {/* Torii (izquierda) */}
        <g fill="#d8453f">
          <path d="M20 246 V150 M64 246 V150" strokeWidth={6} />
          <path d="M6 150 Q42 138 78 150 L74 160 Q42 150 10 160 Z" />
          <rect x="14" y="168" width="56" height="9" />
          <rect x="38" y="150" width="8" height="22" />
        </g>
        {/* Suelo */}
        <path d="M0 246 H320" strokeWidth={2.4} />
      </g>
    </svg>
  )
}
