/**
 * HeroDecor — decoraciones del hero (SVG copiados del diseño):
 * sol, pájaros lejanos, monte Fuji, olas seigaiha y rama de sakura animada.
 * Todo decorativo (aria-hidden).
 */

const PETAL = 'M0 0C-6.5-7-8.5-17-4.2-25.5-2.4-29-.7-25.5 0-22.4 .7-25.5 2.4-29 4.2-25.5 8.5-17 6.5-7 0 0Z'

function Blossom({ transform }: { transform: string }) {
  return (
    <g transform={transform}>
      <g fill="#f7c4d5" stroke="#e08fac" strokeWidth={0.5}>
        <path d={PETAL} />
        <path d={PETAL} transform="rotate(72)" />
        <path d={PETAL} transform="rotate(144)" />
        <path d={PETAL} transform="rotate(216)" />
        <path d={PETAL} transform="rotate(288)" />
      </g>
      <g fill="#f4a83a">
        <circle cx="0" cy="-8.5" r="1" />
        <circle cx="6.5" cy="-5.5" r="1" />
        <circle cx="-6.5" cy="-5.5" r="1" />
        <circle cx="8" cy="-1" r="1" />
        <circle cx="-8" cy="-1" r="1" />
      </g>
      <circle r="2" fill="#df7f3a" />
    </g>
  )
}

function Bud({ transform }: { transform: string }) {
  return (
    <g transform={transform}>
      <path d="M0 12 L0 19" stroke="#6f7d3c" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <ellipse cx="0" cy="4" rx="4.4" ry="7" fill="#f3b6c9" stroke="#e08fac" strokeWidth={0.5} />
    </g>
  )
}

export default function HeroDecor() {
  return (
    <>
      {/* sol */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-90px',
          right: '-70px',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle,#f6c2d2 0%,#ef9bb4 52%,rgba(239,155,180,0) 72%)',
          zIndex: 0,
          animation: 'ignPulse 9s ease-in-out infinite',
        }}
      />

      {/* pájaros lejanos */}
      <svg
        aria-hidden="true"
        viewBox="0 0 120 50"
        style={{ position: 'absolute', top: '120px', right: '13vw', width: '96px', zIndex: 1, animation: 'ignFloat 8s ease-in-out infinite' }}
      >
        <path d="M6 26 Q22 8 38 24 Q54 8 70 26" fill="none" stroke="#1b2a4a" strokeWidth={2.4} strokeLinecap="round" opacity=".55" />
        <path d="M58 38 Q70 26 82 37 Q94 26 106 38" fill="none" stroke="#1b2a4a" strokeWidth={2} strokeLinecap="round" opacity=".4" />
      </svg>

      {/* monte Fuji */}
      <svg
        aria-hidden="true"
        viewBox="0 0 600 200"
        preserveAspectRatio="none"
        style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 'min(1000px,96vw)', height: '200px', opacity: 0.55, zIndex: 0 }}
      >
        <path d="M0 200 L222 56 Q300 6 378 56 L600 200 Z" fill="#e0e6f0" />
        <path d="M222 56 Q300 6 378 56 L352 76 Q332 60 300 66 Q272 60 248 78 Z" fill="#fffefb" />
      </svg>

      {/* olas seigaiha */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '62px', zIndex: 1, opacity: 0.5 }}
      >
        <defs>
          <pattern id="sg" width="60" height="30" patternUnits="userSpaceOnUse">
            <path d="M0 30 A30 30 0 0 1 60 30" fill="none" stroke="#1b2a4a" strokeWidth={1.4} strokeOpacity=".5" />
            <path d="M0 30 A18 18 0 0 1 60 30" fill="none" stroke="#1b2a4a" strokeWidth={1.2} strokeOpacity=".4" />
            <path d="M-30 30 A30 30 0 0 1 30 30" fill="none" stroke="#1b2a4a" strokeWidth={1.4} strokeOpacity=".5" />
            <path d="M30 30 A30 30 0 0 1 90 30" fill="none" stroke="#1b2a4a" strokeWidth={1.4} strokeOpacity=".5" />
          </pattern>
        </defs>
        <rect width="1200" height="60" fill="url(#sg)" />
      </svg>

      {/* rama de sakura */}
      <svg
        data-sakura-branch
        aria-hidden="true"
        viewBox="0 0 360 240"
        style={{
          position: 'absolute',
          top: '-10px',
          left: '-20px',
          width: 'min(36vw,400px)',
          zIndex: 1,
          transformOrigin: 'top left',
          animation: 'ignSway 11s ease-in-out infinite',
          filter: 'drop-shadow(0 6px 10px rgba(112,73,47,.12))',
        }}
      >
        <defs>
          <radialGradient id="ignPg" cx="50%" cy="64%" r="62%">
            <stop offset="0%" stopColor="#fff5f9" />
            <stop offset="52%" stopColor="#f8c7d7" />
            <stop offset="100%" stopColor="#ec9bb8" />
          </radialGradient>
          <linearGradient id="ignBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#553521" />
            <stop offset="1" stopColor="#82573a" />
          </linearGradient>
        </defs>
        {/* ramas */}
        <path d="M4 8 C58 26 96 32 134 58 C168 82 190 116 206 158" fill="none" stroke="url(#ignBg)" strokeWidth={8.5} strokeLinecap="round" />
        <path d="M206 158 C216 188 230 214 248 236" fill="none" stroke="url(#ignBg)" strokeWidth={4.6} strokeLinecap="round" />
        <path d="M120 52 C140 40 156 44 176 24" fill="none" stroke="url(#ignBg)" strokeWidth={3.6} strokeLinecap="round" />
        <path d="M170 96 C190 92 208 100 234 82" fill="none" stroke="url(#ignBg)" strokeWidth={3} strokeLinecap="round" />
        <path d="M92 36 C100 22 116 16 126 4" fill="none" stroke="url(#ignBg)" strokeWidth={2.6} strokeLinecap="round" />
        <path d="M150 70 C160 78 168 92 168 108" fill="none" stroke="url(#ignBg)" strokeWidth={2.4} strokeLinecap="round" />
        <path d="M14 12 C60 28 94 34 130 58" fill="none" stroke="#9a6f4d" strokeWidth={1.6} strokeLinecap="round" opacity=".7" />
        {/* capullos */}
        <Bud transform="translate(176,18) scale(.85) rotate(18)" />
        <Bud transform="translate(232,74) scale(.78) rotate(-14)" />
        <Bud transform="translate(166,112) scale(.82) rotate(34)" />
        {/* flores */}
        <Blossom transform="translate(126,4) scale(.62) rotate(22)" />
        <Blossom transform="translate(176,24) scale(.74) rotate(-14)" />
        <Blossom transform="translate(236,80) scale(.6) rotate(34)" />
        <Blossom transform="translate(94,34) scale(.82) rotate(-26)" />
        <Blossom transform="translate(150,68) scale(.68) rotate(6)" />
        <Blossom transform="translate(204,152) scale(.74) rotate(-18)" />
      </svg>
    </>
  )
}
