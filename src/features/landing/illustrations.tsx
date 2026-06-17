/**
 * Ilustraciones decorativas por día — SVG copiados del diseño.
 *
 * Tres motivos reutilizables: pagoda + farol (templo), skyline urbano y
 * montañas con onsen y vapor. Se eligen por ciudad. Son decorativas
 * (aria-hidden) y llevan parallax suave.
 */
import type { CSSProperties } from 'react'
import type { IllustrationKind } from '@/features/landing/illustrationKind'

interface DayIllustrationProps {
  kind: IllustrationKind
  side: 'left' | 'right'
}

export function DayIllustration({ kind, side }: DayIllustrationProps) {
  const sidePos: CSSProperties = side === 'left' ? { left: '3%' } : { right: '4%' }
  const base: CSSProperties = { position: 'absolute', bottom: '7%', zIndex: 0, pointerEvents: 'none', ...sidePos }

  if (kind === 'skyline') {
    return (
      <svg
        data-illus
        data-parallax="0.09"
        aria-hidden="true"
        viewBox="0 0 260 200"
        style={{ ...base, bottom: '6%', width: 'min(22vw,250px)', opacity: 0.85 }}
      >
        <g fill="none" stroke="#1b2a4a" strokeWidth={2}>
          <rect x="14" y="120" width="26" height="74" fill="#eef0f6" />
          <rect x="48" y="90" width="22" height="104" fill="#fdf3e7" />
          <path d="M150 194 V70 L162 54 L174 70 V194" fill="#fbe3ea" />
          <path d="M156 70 h12 M150 96 h24 M150 120 h24" strokeWidth={1.4} />
          <rect x="80" y="104" width="30" height="90" fill="#eef0f6" />
          <path d="M80 116h30M80 130h30M80 144h30" strokeWidth={1.2} />
          <rect x="118" y="132" width="22" height="62" fill="#fdf3e7" />
          <rect x="186" y="78" width="24" height="116" fill="#eef0f6" />
          <path d="M186 96h24M186 116h24M186 136h24" strokeWidth={1.2} />
          <rect x="218" y="116" width="26" height="78" fill="#fbe3ea" />
        </g>
        <circle cx="206" cy="40" r="13" fill="#f6c2d2" opacity="0.8" />
      </svg>
    )
  }

  if (kind === 'onsen') {
    return (
      <div data-illus data-parallax="0.07" aria-hidden="true" style={{ ...base, width: 'min(24vw,270px)', opacity: 0.9 }}>
        <svg viewBox="0 0 280 220" style={{ width: '100%', display: 'block' }}>
          <path d="M0 150 L70 60 L120 120 L180 40 L240 120 L280 90 V220 H0 Z" fill="#dfe9e3" stroke="#3f6f5f" strokeWidth={2} />
          <path d="M70 60 L92 88 L48 88 Z M180 40 L202 70 L158 70 Z" fill="#fffefb" />
          <path d="M0 176 Q70 160 140 176 T280 176 V220 H0 Z" fill="#cfe0d8" stroke="#3f6f5f" strokeWidth={1.6} />
          <ellipse cx="150" cy="196" rx="62" ry="15" fill="#bcd3c9" stroke="#3f6f5f" strokeWidth={1.6} />
        </svg>
        <svg viewBox="0 0 60 90" style={{ position: 'absolute', bottom: '56px', right: '70px', width: '50px', opacity: 0.5 }}>
          <path d="M12 88 C2 70 22 64 12 46 C4 30 24 24 16 8" fill="none" stroke="#9fb8ad" strokeWidth={4} strokeLinecap="round" style={{ animation: 'ignSteam 4.5s ease-in-out infinite' }} />
          <path d="M34 88 C24 68 44 62 34 44 C26 28 46 22 38 6" fill="none" stroke="#9fb8ad" strokeWidth={4} strokeLinecap="round" style={{ animation: 'ignSteam 5.2s ease-in-out infinite .8s' }} />
        </svg>
      </div>
    )
  }

  // pagoda (templo + farol)
  return (
    <svg
      data-illus
      data-parallax="0.08"
      aria-hidden="true"
      viewBox="0 0 200 280"
      style={{ ...base, bottom: '8%', width: 'min(20vw,210px)', opacity: 0.9 }}
    >
      <g stroke="#1b2a4a" strokeWidth={2} fill="#fdf3e7">
        <rect x="86" y="250" width="28" height="26" />
        <path d="M70 250 H130 L120 232 H80 Z" fill="#c24a5a" stroke="#1b2a4a" />
        <rect x="84" y="208" width="32" height="24" />
        <path d="M64 208 H136 L124 188 H76 Z" fill="#c24a5a" />
        <rect x="82" y="166" width="36" height="22" />
        <path d="M58 166 H142 L128 146 H72 Z" fill="#c24a5a" />
        <rect x="80" y="126" width="40" height="20" />
        <path d="M52 126 H148 L132 106 H68 Z" fill="#c24a5a" />
        <rect x="88" y="92" width="24" height="14" />
        <path d="M70 92 H130 L118 76 H82 Z" fill="#c24a5a" />
        <path d="M100 76 V58" strokeWidth={3} />
        <circle cx="100" cy="54" r="5" fill="#e8a33f" />
      </g>
    </svg>
  )
}
