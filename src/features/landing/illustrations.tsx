/**
 * Ilustraciones decorativas por día — SVG inspirados en el diseño Claude Design.
 *
 * Cada día del itinerario recibe un motivo relacionado con lo que se ve ese día
 * (ver illustrationKind.ts → pickIllustration):
 *   - pagoda   → templo + torii + pagoda de cinco pisos (Asakusa, Tō-ji, Nara).
 *   - skyline  → skyline urbano; varía la disposición de edificios y el landmark
 *                (Tokyo Tower / Skytree / puente de la bahía) según el día.
 *   - onsen    → montañas + onsen + vapor (Takaragawa).
 *   - castle   → torre del homenaje (tenshu) sobre foso (Kanazawa, Osaka).
 *   - machiya  → calle de casas de madera tradicionales (Higashi Chaya, Sanmachi,
 *                Gion, Yanaka); varía nº de casas, color de tejado y faroles.
 *   - gassho   → casas de tejado de paja gasshō-zukuri entre montañas (Shirakawa-go).
 *   - torii    → túnel de toriis bermellones + bambú (Fushimi Inari, Arashiyama).
 *   - pavilion → pabellón dorado reflejado en su estanque (Kinkaku-ji).
 *
 * Son decorativas (aria-hidden) y llevan parallax suave (data-parallax). Se anclan
 * a bottom:0 y a un lado fijo; el lado lo decide DaySection y alterna por día.
 *
 * Color: la tinta estructural y los acentos usan los hex de la paleta del diseño
 * (#1b2a4a, #c24a5a, #d8453f, #e8a33f, #3f6f5f). Los rellenos pastel/crema se
 * dejan fijos: bajo el atenuado de modo oscuro ([data-illus]{opacity:.5}) quedan
 * suaves, ni invisibles ni estridentes.
 */
import type { CSSProperties, ReactElement } from 'react'
import type { IllustrationKind } from '@/features/landing/illustrationKind'

interface DayIllustrationProps {
  kind: IllustrationKind
  side: 'left' | 'right'
  /** Día del itinerario: siembra la variación (disposición de edificios, etc.). */
  seed?: number
}

// ── Paleta estructural (coherente con las demás figuras del diseño) ────────────
const INK = '#1b2a4a'
const CORAL = '#c24a5a'
const RED = '#d8453f'
const AMBER = '#e8a33f'
const GREEN = '#3f6f5f'
const CREAMS = ['#eef0f6', '#f7efe2', '#f3e7ef'] as const

/** Posición lateral fija (el lado se decide en DaySection y alterna por día). */
function sideStyle(side: 'left' | 'right'): CSSProperties {
  return side === 'left' ? { left: '3%' } : { right: '3%' }
}

/**
 * Generador pseudo-aleatorio determinista a partir de una semilla entera.
 * Mismo `seed` → misma secuencia (sin Date/Math.random: estable entre renders).
 */
function seeded(seed: number): () => number {
  // mulberry32: buena dispersión incluso para semillas pequeñas y cercanas
  // (usa Math.imul → enteros de 32 bits exactos, sin pérdida de precisión).
  let a = (Math.trunc(seed) * 1640531527 + 0x9e3779b9) | 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Rejilla de ventanas para un edificio de ancho variable. */
function gridWindows(
  bx: number,
  w: number,
  topY: number,
  groundY: number,
  lit: boolean,
): ReactElement[] {
  const cells: ReactElement[] = []
  let k = 0
  for (let yy = topY + 9; yy < groundY - 7; yy += 9) {
    for (let xx = bx + 5; xx < bx + w - 4; xx += 7) {
      const on = lit && (Math.round(xx) + Math.round(yy)) % 3 === 0
      cells.push(
        <rect
          key={k++}
          x={xx}
          y={yy}
          width={3.6}
          height={4.8}
          fill={on ? '#ffcf7a' : '#9fb0d0'}
          stroke="none"
        />,
      )
    }
  }
  return cells
}

// ── Pagoda · templo + torii + pagoda; composición orgánica variable por día ────

/** Pagoda de N pisos: cada piso es cuerpo + alero que LO CUBRE (ew>bw), de abajo
 *  arriba; el alero tapa la unión con el piso inferior. */
function pagodaTower(cx: number, groundY: number, stories: number, roof: string): ReactElement {
  const tiers: { by: number; bh: number; bw: number; ew: number; cw: number; eh: number }[] = []
  let by = groundY
  let bw = 36
  let bh = 30
  let ew = 54
  let cw = 22
  let eh = 13
  for (let i = 0; i < stories; i++) {
    tiers.push({ by, bh, bw, ew, cw, eh })
    by = by - bh - eh + 4
    bw *= 0.84
    bh *= 0.86
    ew *= 0.86
    cw *= 0.88
    eh *= 0.92
  }
  const top = tiers[tiers.length - 1]
  const crestY = top.by - top.bh - top.eh
  return (
    <g>
      {tiers.map((t, i) => (
        <g key={i}>
          <rect x={cx - t.bw / 2} y={t.by - t.bh} width={t.bw} height={t.bh} fill="#f7efe2" />
          <path
            d={`M${cx - t.ew / 2} ${t.by - t.bh} L${cx - t.cw / 2} ${t.by - t.bh - t.eh} L${cx + t.cw / 2} ${t.by - t.bh - t.eh} L${cx + t.ew / 2} ${t.by - t.bh} Z`}
            fill={roof}
          />
        </g>
      ))}
      {/* Sōrin (mástil + anillos + esfera) */}
      <path d={`M${cx} ${crestY} V${crestY - 20}`} strokeWidth={2.4} />
      <path d={`M${cx - 5} ${crestY - 6} H${cx + 5} M${cx - 4} ${crestY - 11} H${cx + 4} M${cx - 3} ${crestY - 16} H${cx + 3}`} strokeWidth={1.3} />
      <circle cx={cx} cy={crestY - 24} r={4} fill={AMBER} />
    </g>
  )
}

/** Hondo (sala del templo). Centrada en cx; suelo en y=246. */
function templeHall(cx: number, roof: string): ReactElement {
  return (
    <g transform={`translate(${cx - 156} 0)`} fill="#fbf4ea">
      <rect x="96" y="214" width="120" height="32" />
      <rect x="104" y="170" width="104" height="44" />
      <path d="M104 182 h104 M120 170 v44 M156 170 v44 M192 170 v44" strokeWidth={1.3} />
      <path d="M156 120 L92 168 Q80 176 92 176 L220 176 Q232 176 220 168 Z" fill={roof} />
      <path d="M92 176 Q86 184 78 188 L96 184 Z M220 176 Q226 184 234 188 L216 184 Z" fill={roof} />
      <path d="M156 120 L132 150 H180 Z" fill={AMBER} opacity={0.9} />
    </g>
  )
}

/** Torii. Anclado al suelo (y=246), centrado en cx, con escala s. */
function toriiGate(cx: number, s: number): ReactElement {
  return (
    <g transform={`translate(${cx - 42 * s} ${246 * (1 - s)}) scale(${s})`} fill={RED}>
      <path d="M20 246 V150 M64 246 V150" strokeWidth={6} />
      <path d="M6 150 Q42 138 78 150 L74 160 Q42 150 10 160 Z" />
      <rect x="14" y="168" width="56" height="9" />
      <rect x="38" y="150" width="8" height="22" />
    </g>
  )
}

/** Tōrō: farolillo de piedra pequeño, base en groundY. */
function stoneLantern(cx: number, groundY: number): ReactElement {
  return (
    <g fill="#c4bdad" stroke={INK} strokeWidth={1.5} strokeLinejoin="round">
      <path d={`M${cx - 11} ${groundY} L${cx - 8} ${groundY - 8} H${cx + 8} L${cx + 11} ${groundY} Z`} />
      <rect x={cx - 4} y={groundY - 30} width={8} height={22} />
      <rect x={cx - 9} y={groundY - 36} width={18} height={6} />
      <rect x={cx - 8} y={groundY - 50} width={16} height={14} />
      <rect x={cx - 3} y={groundY - 47} width={6} height={8} fill={AMBER} stroke="none" />
      <path d={`M${cx - 13} ${groundY - 50} L${cx - 7} ${groundY - 60} H${cx + 7} L${cx + 13} ${groundY - 50} Z`} fill="#b3ab9a" />
      <circle cx={cx} cy={groundY - 63} r={2.6} fill={AMBER} />
    </g>
  )
}

/** Chōchin: farolillo rojo colgante de un poste, base en groundY. */
function hangingLantern(cx: number, groundY: number): ReactElement {
  return (
    <g>
      <path d={`M${cx} ${groundY} V${groundY - 54} h16`} stroke={INK} strokeWidth={2.6} fill="none" />
      <path d={`M${cx + 16} ${groundY - 54} V${groundY - 49}`} stroke={INK} strokeWidth={1} />
      <ellipse cx={cx + 16} cy={groundY - 40} rx={7} ry={10} fill={RED} stroke={INK} strokeWidth={1.4} />
      <path d={`M${cx + 9.5} ${groundY - 43} h13 M${cx + 9} ${groundY - 40} h14 M${cx + 9.5} ${groundY - 37} h13`} stroke="#a8322d" strokeWidth={0.9} />
      <rect x={cx + 13} y={groundY - 31} width={6} height={3} fill={INK} stroke="none" />
    </g>
  )
}

function renderPagoda(base: CSSProperties, seed: number): ReactElement {
  const rnd = seeded(seed)
  const groundY = 246
  // Decisiones derivadas del día → cada día compone la escena distinto.
  const mirror = rnd() > 0.5 //                 voltea izquierda/derecha la escena
  const stories = rnd() > 0.45 ? 5 : 4 //       altura de la pagoda
  const roofs = [CORAL, '#b8505f', '#c75a48'] //tono de tejado sutilmente distinto
  const roof = roofs[Math.floor(rnd() * roofs.length)]
  const showHall = rnd() > 0.25 //              a veces se quita el hondo
  const showTorii = showHall ? rnd() > 0.2 : true // …garantizando ≥1 acompañante
  const secondTorii = showTorii && rnd() > 0.5 //   repite el torii (uno más al fondo)
  const lantern = rnd() > 0.4 //                farolillo de piedra al frente
  const chochin = rnd() > 0.5 //                farolillo rojo colgante
  const ts = 0.8 + rnd() * 0.18 //              escala del torii
  const jx = Math.round((rnd() - 0.5) * 12) //  pequeño desplazamiento orgánico

  return (
    <svg
      data-illus
      data-parallax="0.08"
      aria-hidden="true"
      viewBox="0 0 320 250"
      preserveAspectRatio="xMidYMax meet"
      style={{ ...base, width: 'min(34vw,420px)', opacity: 0.62 }}
    >
      <g
        stroke={INK}
        strokeWidth={2}
        strokeLinejoin="round"
        transform={mirror ? 'translate(320,0) scale(-1,1)' : undefined}
      >
        {/* Suelo (detrás, para que no atraviese las figuras) */}
        <path d="M0 246 H320" strokeWidth={2.4} />
        {secondTorii && toriiGate(76, ts * 0.72)}
        {pagodaTower(256 + jx, groundY, stories, roof)}
        {showHall && templeHall(156 - jx, roof)}
        {showTorii && toriiGate(42, ts)}
        {lantern && stoneLantern(showHall ? 116 : 150, groundY)}
        {chochin && hangingLantern(92, groundY)}
      </g>
    </svg>
  )
}

// ── Skyline · edificios variables + landmark por día ───────────────────────────
function renderSkyline(base: CSSProperties, seed: number): ReactElement {
  const rnd = seeded(seed)
  const landmark: 'tower' | 'skytree' | 'bridge' | 'none' =
    seed === 28 ? 'skytree'
    : seed === 27 ? 'bridge'
    : seed === 10 || seed === 12 || seed === 26 ? 'tower'
    : 'none'

  const groundY = 226
  const waterY = landmark === 'bridge' ? 196 : groundY

  // Disposición de edificios derivada del día (cambia de un día a otro).
  const builds: { x: number; w: number; topY: number; fill: string; lit: boolean }[] = []
  let x = 6
  let i = 0
  while (x < 350 && i < 14) {
    const w = 24 + Math.floor(rnd() * 22)
    const h = 56 + Math.floor(rnd() * 104)
    builds.push({ x, w, topY: waterY - h, fill: CREAMS[i % CREAMS.length], lit: rnd() > 0.45 })
    x += w + 5 + Math.floor(rnd() * 7)
    i++
  }

  return (
    <svg
      data-illus
      data-parallax="0.09"
      aria-hidden="true"
      viewBox="0 0 360 230"
      preserveAspectRatio="xMidYMax meet"
      style={{ ...base, width: 'min(38vw,460px)', opacity: 0.6 }}
    >
      <g stroke={INK} strokeWidth={2} strokeLinejoin="round">
        {/* Edificios */}
        {builds.map((b, k) => (
          <g key={k}>
            <rect x={b.x} y={b.topY} width={b.w} height={waterY - b.topY} fill={b.fill} />
            {gridWindows(b.x, b.w, b.topY, waterY, b.lit)}
          </g>
        ))}

        {/* Landmark · Tokyo Tower */}
        {landmark === 'tower' && (
          <g stroke={RED} fill="none" strokeWidth={2}>
            <path d={`M158 ${groundY} L174 ${groundY - 86} L186 ${groundY - 86} L202 ${groundY} Z`} fill="rgba(216,69,63,.06)" />
            <path d={`M165 ${groundY - 34} H195 M170 ${groundY - 60} H190`} strokeWidth={1.2} />
            <path d={`M174 ${groundY - 86} L177 ${groundY - 150} L183 ${groundY - 150} L186 ${groundY - 86}`} />
            <rect x={170} y={groundY - 92} width={20} height={8} fill="#f7efe2" />
            <path d={`M180 ${groundY - 150} V${groundY - 170}`} strokeWidth={2.4} />
            <circle cx={180} cy={groundY - 174} r={3.6} fill={AMBER} stroke={RED} />
          </g>
        )}

        {/* Landmark · Tokyo Skytree (torre alta y esbelta) */}
        {landmark === 'skytree' && (
          <g stroke={INK} strokeWidth={2}>
            <path d={`M164 ${groundY} L176 ${groundY - 170} L184 ${groundY - 170} L196 ${groundY} Z`} fill="#eef0f6" />
            <path d={`M170 ${groundY - 56} H190 M173 ${groundY - 110} H187`} strokeWidth={1.1} fill="none" />
            <ellipse cx={180} cy={groundY - 132} rx={13} ry={7} fill="#f7efe2" />
            <ellipse cx={180} cy={groundY - 158} rx={9} ry={5} fill="#f7efe2" />
            <path d={`M180 ${groundY - 170} V${groundY - 206}`} strokeWidth={2.2} fill="none" />
            <circle cx={180} cy={groundY - 210} r={3.4} fill={AMBER} />
          </g>
        )}

        {/* Landmark · puente de la bahía (Odaiba / Rainbow Bridge) */}
        {landmark === 'bridge' && (
          <g>
            {/* Agua */}
            <rect x={0} y={waterY} width={360} height={230 - waterY} fill="#d6ebf2" stroke="none" />
            <path d={`M0 ${waterY} H360`} strokeWidth={2.2} />
            {/* Torres + cables */}
            <g stroke={RED} strokeWidth={2.4} fill="none">
              <path d={`M70 ${waterY} V120 M250 ${waterY} V120`} />
              <path d={`M70 124 H250`} strokeWidth={2} />
              <path d="M70 120 Q160 178 250 120" />
              <path d="M86 152 V124 M110 164 V124 M134 171 V124 M160 173 V124 M186 171 V124 M210 164 V124 M234 152 V124" strokeWidth={1} />
            </g>
            {/* Réplica de la Estatua de la Libertad (Odaiba) */}
            <g fill="#7da3a0" stroke={INK} strokeWidth={1.4}>
              <rect x={300} y={172} width={14} height={waterY - 172} />
              <path d="M307 132 L301 168 H313 Z" />
              <circle cx={307} cy={128} r={4} />
              <path d="M310 128 L316 112" strokeWidth={2} />
              <circle cx={317} cy={110} r={2.4} fill={AMBER} stroke="none" />
            </g>
          </g>
        )}

        {/* Suelo (sin puente) */}
        {landmark !== 'bridge' && <path d={`M0 ${groundY} H360`} strokeWidth={2.4} />}
      </g>
    </svg>
  )
}

// ── Onsen · montañas + estanque termal + vapor ─────────────────────────────────
function renderOnsen(base: CSSProperties): ReactElement {
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
      <path d="M0 150 L60 70 L104 120 L150 56 L210 124 L262 80 L340 140 V240 H0 Z" fill="#dbe7e0" stroke={GREEN} strokeWidth={2} />
      <path d="M60 70 L80 98 L40 98 Z M150 56 L172 88 L128 88 Z" fill="#fbfdfb" />
      {/* Loma intermedia */}
      <path d="M0 178 L70 138 L150 170 L240 134 L340 172 V240 H0 Z" fill="#c2d8cc" stroke={GREEN} strokeWidth={1.6} />
      {/* Estanque (onsen) */}
      <ellipse cx="180" cy="208" rx="120" ry="26" fill="#bcd6e2" stroke={GREEN} strokeWidth={2} />
      <ellipse cx="180" cy="205" rx="120" ry="24" fill="#d6ebf2" />
      {/* Rocas del borde */}
      <g fill="#8aa39a" stroke={GREEN} strokeWidth={1.6}>
        <path d="M70 200 q-14 -16 6 -22 q20 -3 18 14 q-2 12 -24 8 Z" />
        <path d="M286 198 q18 -16 -2 -24 q-22 -3 -20 14 q2 14 22 10 Z" />
        <ellipse cx="120" cy="222" rx="16" ry="7" />
        <ellipse cx="240" cy="224" rx="18" ry="7" />
      </g>
      {/* Casita de baño */}
      <g fill="#9aa39c" stroke={GREEN} strokeWidth={1.6}>
        <rect x="40" y="176" width="16" height="10" />
        <path d="M36 176 h24 l-5 -10 h-14 z" fill="#7e8a82" />
        <rect x="44" y="186" width="8" height="20" />
      </g>
      {/* Abeto */}
      <g fill={GREEN}>
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

// ── Castle · torre del homenaje (tenshu) sobre foso ────────────────────────────
function renderCastle(base: CSSProperties): ReactElement {
  const cx = 176
  // Cada piso: cuerpo blanco + tejado oscuro que lo corona (alero sobresaliente).
  const tiers = [
    { by: 178, bh: 28, bw: 92, ew: 112, cw: 60, eh: 18 },
    { by: 138, bh: 26, bw: 72, ew: 90, cw: 40, eh: 16 },
    { by: 100, bh: 22, bw: 50, ew: 66, cw: 24, eh: 14 },
  ]
  return (
    <svg
      data-illus
      data-parallax="0.08"
      aria-hidden="true"
      viewBox="0 0 330 240"
      preserveAspectRatio="xMidYMax meet"
      style={{ ...base, width: 'min(36vw,440px)', opacity: 0.6 }}
    >
      {/* Foso */}
      <ellipse cx={cx} cy={228} rx={150} ry={12} fill="#d6ebf2" stroke={INK} strokeWidth={1.6} />
      <g stroke={INK} strokeWidth={2} strokeLinejoin="round">
        {/* Base de piedra (ishigaki) con muros en talud */}
        <path d="M108 224 L126 180 H226 L244 224 Z" fill="#e7ddc8" />
        <path d="M118 202 H234" strokeWidth={1.1} />
        {/* Pisos: cuerpo + tejado */}
        {tiers.map((t, i) => (
          <g key={i}>
            <rect x={cx - t.bw / 2} y={t.by - t.bh} width={t.bw} height={t.bh} fill="#fbf4ea" />
            {/* ventanas */}
            <g fill={INK} stroke="none">
              <rect x={cx - t.bw / 2 + 8} y={t.by - t.bh + 7} width={6} height={9} />
              <rect x={cx - 3} y={t.by - t.bh + 7} width={6} height={9} />
              <rect x={cx + t.bw / 2 - 14} y={t.by - t.bh + 7} width={6} height={9} />
            </g>
            <path
              d={`M${cx - t.ew / 2} ${t.by - t.bh} Q${cx - t.ew / 2 - 4} ${t.by - t.bh - 4} ${cx - t.cw / 2} ${t.by - t.bh - t.eh} L${cx + t.cw / 2} ${t.by - t.bh - t.eh} Q${cx + t.ew / 2 + 4} ${t.by - t.bh - 4} ${cx + t.ew / 2} ${t.by - t.bh} Z`}
              fill={INK}
            />
            <path d={`M${cx - t.cw / 2} ${t.by - t.bh - t.eh} H${cx + t.cw / 2}`} stroke={AMBER} strokeWidth={1.4} />
          </g>
        ))}
        {/* Gablete frontal (chidori-hafu) sobre el primer tejado */}
        <path d={`M${cx - 16} 160 L${cx} 142 L${cx + 16} 160 Z`} fill="#fbf4ea" />
        {/* Shachihoko dorados en la cumbrera */}
        <g fill={AMBER} stroke={INK} strokeWidth={1}>
          <path d={`M${cx - 12} 64 q-6 -8 1 -13 q7 -3 6 6 q-1 6 -7 7 Z`} />
          <path d={`M${cx + 12} 64 q6 -8 -1 -13 q-7 -3 -6 6 q1 6 7 7 Z`} />
        </g>
      </g>
    </svg>
  )
}

// ── Machiya · calle de casas de madera tradicionales ───────────────────────────
function renderMachiya(base: CSSProperties, seed: number): ReactElement {
  const rnd = seeded(seed)
  const groundY = 212
  const roofColors = [CORAL, '#9aa3ac', '#7e8a82'] as const
  const wallColors = ['#efe0c8', '#f2e7d2'] as const

  const houses: { x: number; w: number; eaveY: number; roof: string; wall: string; lantern: boolean }[] = []
  let x = 6
  let i = 0
  while (x < 350 && i < 6) {
    const w = 54 + Math.floor(rnd() * 22)
    const eaveY = groundY - (92 + Math.floor(rnd() * 28))
    houses.push({
      x,
      w,
      eaveY,
      roof: roofColors[Math.floor(rnd() * roofColors.length)],
      wall: wallColors[i % wallColors.length],
      lantern: rnd() > 0.5,
    })
    x += w + 2
    i++
  }

  return (
    <svg
      data-illus
      data-parallax="0.08"
      aria-hidden="true"
      viewBox="0 0 360 220"
      preserveAspectRatio="xMidYMax meet"
      style={{ ...base, width: 'min(38vw,460px)', opacity: 0.6 }}
    >
      <g stroke={INK} strokeWidth={2} strokeLinejoin="round">
        {houses.map((h, k) => {
          const roofH = 22
          const latticeLines: ReactElement[] = []
          for (let lx = h.x + 8; lx < h.x + h.w - 6; lx += 5) {
            latticeLines.push(<path key={lx} d={`M${lx} ${h.eaveY + 12} V${groundY - 18}`} strokeWidth={0.9} stroke="#9c8467" />)
          }
          const doorW = h.w * 0.42
          const doorX = h.x + (h.w - doorW) / 2
          return (
            <g key={k}>
              {/* Muro */}
              <rect x={h.x} y={h.eaveY} width={h.w} height={groundY - h.eaveY} fill={h.wall} />
              {/* Celosía (kōshi) */}
              {latticeLines}
              {/* Tejado de teja con alero sobresaliente */}
              <path
                d={`M${h.x - 4} ${h.eaveY} L${h.x + 9} ${h.eaveY - roofH} L${h.x + h.w - 9} ${h.eaveY - roofH} L${h.x + h.w + 4} ${h.eaveY} Z`}
                fill={h.roof}
              />
              <path d={`M${h.x + 9} ${h.eaveY - roofH} H${h.x + h.w - 9}`} stroke={INK} strokeWidth={1.1} />
              {/* Noren sobre la entrada */}
              <rect x={doorX} y={groundY - 22} width={doorW} height={22} fill="#3a5a8c" />
              <path d={`M${doorX + doorW / 2} ${groundY - 22} V${groundY}`} stroke="#2c4670" strokeWidth={1} />
              {/* Farol rojo colgante (algunas casas) */}
              {h.lantern && (
                <g>
                  <path d={`M${h.x + h.w - 14} ${h.eaveY} V${h.eaveY + 6}`} strokeWidth={1} />
                  <ellipse cx={h.x + h.w - 14} cy={h.eaveY + 13} rx={6} ry={8} fill={RED} />
                  <path d={`M${h.x + h.w - 20} ${h.eaveY + 11} h12 M${h.x + h.w - 20} ${h.eaveY + 15} h12`} stroke="#a8322d" strokeWidth={0.9} />
                </g>
              )}
            </g>
          )
        })}
        {/* Suelo */}
        <path d={`M0 ${groundY} H360`} strokeWidth={2.4} />
      </g>
    </svg>
  )
}

// ── Gassho · casas de tejado de paja entre montañas (Shirakawa-go) ─────────────
function renderGassho(base: CSSProperties, seed: number): ReactElement {
  const rnd = seeded(seed)
  const groundY = 200
  // 2-3 casas de tamaño/posición variables.
  const houses = [
    { cx: 88, w: 96, h: 118 },
    { cx: 210, w: 120, h: 140 },
    ...(rnd() > 0.5 ? [{ cx: 300, w: 70, h: 92 }] : []),
  ]
  return (
    <svg
      data-illus
      data-parallax="0.07"
      aria-hidden="true"
      viewBox="0 0 340 230"
      preserveAspectRatio="xMidYMax meet"
      style={{ ...base, width: 'min(38vw,460px)', opacity: 0.6 }}
    >
      {/* Montañas de fondo */}
      <path d="M0 130 L70 60 L130 110 L200 50 L280 108 L340 70 V230 H0 Z" fill="#dbe7e0" stroke={GREEN} strokeWidth={2} />
      <path d="M70 60 L92 92 L48 92 Z M200 50 L224 86 L176 86 Z" fill="#fbfdfb" />
      {/* Prado */}
      <path d={`M0 168 L120 150 L240 162 L340 150 V230 H0 Z`} fill="#cfe0cf" stroke={GREEN} strokeWidth={1.4} />

      <g stroke={INK} strokeWidth={2} strokeLinejoin="round">
        {/* Suelo (detrás de las casas, para que no las atraviese) */}
        <path d={`M0 ${groundY} H340`} strokeWidth={2.2} />
        {houses
          .slice()
          .sort((a, b) => a.h - b.h)
          .map((ho, k) => {
            const baseY = groundY
            const apexY = baseY - ho.h
            const half = ho.w / 2
            const wallH = ho.w * 0.18
            return (
              <g key={k}>
                {/* Muro bajo de madera */}
                <rect x={ho.cx - half * 0.7} y={baseY - wallH} width={half * 1.4} height={wallH} fill="#e7d6b8" />
                {/* Tejado de paja (gasshō): triángulo alto y empinado, lados algo curvos */}
                <path
                  d={`M${ho.cx - half} ${baseY - wallH} Q${ho.cx - half * 0.5} ${apexY + ho.h * 0.3} ${ho.cx} ${apexY} Q${ho.cx + half * 0.5} ${apexY + ho.h * 0.3} ${ho.cx + half} ${baseY - wallH} Z`}
                  fill="#cbb487"
                />
                {/* Líneas de paja */}
                <path
                  d={`M${ho.cx - half * 0.66} ${baseY - wallH} L${ho.cx} ${apexY + ho.h * 0.18} M${ho.cx + half * 0.66} ${baseY - wallH} L${ho.cx} ${apexY + ho.h * 0.18}`}
                  stroke="#a98f63"
                  strokeWidth={1.1}
                />
                {/* Gablete: vigas + ventanita */}
                <g stroke={INK} strokeWidth={0.9}>
                  <path d={`M${ho.cx - half * 0.42} ${baseY - wallH - ho.h * 0.18} H${ho.cx + half * 0.42}`} />
                  <rect x={ho.cx - 7} y={baseY - wallH - ho.h * 0.32} width={14} height={11} fill="#8a6f4a" stroke={INK} />
                </g>
              </g>
            )
          })}
      </g>
    </svg>
  )
}

// ── Torii · túnel de toriis bermellones + bambú (Fushimi Inari / Arashiyama) ───
function renderTorii(base: CSSProperties, seed: number): ReactElement {
  const rnd = seeded(seed)
  const n = 6
  const gates: ReactElement[] = []
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1) // 0 (fondo, pequeño) → 1 (frente, grande)
    const halfW = 24 + t * 52
    const postH = 64 + t * 124
    const baseY = 96 + t * 140
    const postW = 4 + t * 5
    const cxg = 156 + (i % 2 === 0 ? -1 : 1) * t * 6
    const topY = baseY - postH
    const nukiY = topY + postH * 0.22
    gates.push(
      <g key={i} opacity={0.5 + t * 0.5}>
        {/* Pilares */}
        <rect x={cxg - halfW} y={topY} width={postW} height={postH} fill={RED} stroke={INK} strokeWidth={1.1} />
        <rect x={cxg + halfW - postW} y={topY} width={postW} height={postH} fill={RED} stroke={INK} strokeWidth={1.1} />
        {/* Kasagi (dintel superior, vuela y curva levemente) */}
        <path
          d={`M${cxg - halfW - 6} ${topY} Q${cxg} ${topY - 5} ${cxg + halfW + 6} ${topY} L${cxg + halfW + 6} ${topY + 5} Q${cxg} ${topY} ${cxg - halfW - 6} ${topY + 5} Z`}
          fill={INK}
        />
        {/* Nuki (travesaño inferior) */}
        <rect x={cxg - halfW - 1} y={nukiY} width={halfW * 2 + 2} height={postW * 0.9} fill={RED} stroke={INK} strokeWidth={0.9} />
      </g>,
    )
  }

  // Bambú al borde derecho (Arashiyama).
  const bamboo: ReactElement[] = []
  const stalks = rnd() > 0.5 ? [292, 304, 316] : [296, 312]
  stalks.forEach((sx, k) => {
    bamboo.push(
      <g key={`b${k}`} stroke={GREEN} strokeWidth={3} strokeLinecap="round">
        <path d={`M${sx} 40 V214`} />
        <path d={`M${sx - 4} 70 h8 M${sx - 4} 108 h8 M${sx - 4} 150 h8 M${sx - 4} 190 h8`} strokeWidth={1.2} />
        <path d={`M${sx} 64 q14 -10 22 -4 M${sx} 100 q-14 -10 -22 -4`} strokeWidth={1.6} fill="none" stroke="#5a8a6f" />
      </g>,
    )
  })

  return (
    <svg
      data-illus
      data-parallax="0.08"
      aria-hidden="true"
      viewBox="0 0 320 240"
      preserveAspectRatio="xMidYMax meet"
      style={{ ...base, width: 'min(34vw,420px)', opacity: 0.62 }}
    >
      {/* Escalones del sendero */}
      <g stroke={INK} strokeWidth={1.2} opacity={0.5}>
        <path d="M120 238 H196 M126 230 H190 M132 222 H184 M138 214 H178" />
      </g>
      {/* Túnel de toriis (de fondo a frente) */}
      {gates}
      {/* Bambú */}
      {bamboo}
    </svg>
  )
}

// ── Pavilion · pabellón dorado reflejado en su estanque (Kinkaku-ji) ───────────
function renderPavilion(base: CSSProperties): ReactElement {
  const cx = 168
  const waterY = 158
  // Tres plantas: 1ª crema, 2ª y 3ª doradas; tejados de madera (marrón).
  const ROOF = '#8a6f4a'
  const GOLD = '#e8a33f'
  return (
    <svg
      data-illus
      data-parallax="0.08"
      aria-hidden="true"
      viewBox="0 0 330 230"
      preserveAspectRatio="xMidYMax meet"
      style={{ ...base, width: 'min(36vw,440px)', opacity: 0.6 }}
    >
      {/* Estanque */}
      <rect x={0} y={waterY} width={330} height={230 - waterY} fill="#d6ebf2" stroke="none" />
      {/* Reflejo tenue del pabellón */}
      <g opacity={0.22}>
        <rect x={cx - 30} y={waterY} width={60} height={36} fill={GOLD} />
        <path d={`M${cx - 24} ${waterY + 40} h48 M${cx - 18} ${waterY + 52} h36`} stroke="#bcd6e2" strokeWidth={2} fill="none" />
      </g>

      <g stroke={INK} strokeWidth={2} strokeLinejoin="round">
        <path d={`M0 ${waterY} H330`} strokeWidth={2} />
        {/* Pinos */}
        <g fill={GREEN}>
          <path d="M40 150 q-18 -6 -10 -22 q-12 -2 -2 -16 q-8 -10 8 -12 q16 2 8 12 q10 14 -2 16 q8 16 -10 22 Z" />
          <rect x={37} y={150} width={5} height={10} stroke="none" />
          <path d="M298 150 q16 -6 8 -22 q12 -2 2 -16 q8 -10 -8 -12 q-16 2 -8 12 q-10 14 2 16 q-8 16 10 22 Z" />
          <rect x={296} y={150} width={5} height={10} stroke="none" />
        </g>

        {/* Plataforma sobre el agua */}
        <path d={`M${cx - 38} 150 H${cx + 38} L${cx + 34} 158 H${cx - 34} Z`} fill="#cbb487" />
        <path d={`M${cx - 30} 158 V168 M${cx + 30} 158 V168 M${cx} 158 V168`} strokeWidth={1.2} />

        {/* Planta 1 (crema) */}
        <rect x={cx - 35} y={120} width={70} height={30} fill="#fbf4ea" />
        <path d={`M${cx - 28} 128 h12 M${cx - 6} 128 h12 M${cx + 16} 128 h10`} strokeWidth={1.1} />
        <path d={`M${cx - 47} 120 L${cx - 30} 104 H${cx + 30} L${cx + 47} 120 Z`} fill={ROOF} />

        {/* Planta 2 (dorada) */}
        <rect x={cx - 29} y={80} width={58} height={26} fill={GOLD} />
        <path d={`M${cx - 24} 88 h12 M${cx - 6} 88 h12 M${cx + 12} 88 h10`} strokeWidth={1} stroke="#b9772a" />
        <path d={`M${cx - 41} 80 L${cx - 24} 66 H${cx + 24} L${cx + 41} 80 Z`} fill={ROOF} />

        {/* Planta 3 (dorada) */}
        <rect x={cx - 22} y={46} width={44} height={22} fill={GOLD} />
        <path d={`M${cx - 16} 54 h10 M${cx + 2} 54 h10`} strokeWidth={1} stroke="#b9772a" />
        <path d={`M${cx - 33} 46 L${cx - 18} 32 H${cx + 18} L${cx + 33} 46 Z`} fill={ROOF} />

        {/* Fénix (hō-ō) dorado en la cima */}
        <g fill={GOLD} stroke={INK} strokeWidth={0.9}>
          <path d={`M${cx} 32 q-7 -10 -2 -16 q5 6 4 0 q1 -7 6 -2 q4 8 -3 10 q5 4 -5 8 Z`} />
        </g>
      </g>
    </svg>
  )
}

export function DayIllustration({ kind, side, seed = 0 }: DayIllustrationProps) {
  const base: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    zIndex: 0,
    pointerEvents: 'none',
    ...sideStyle(side),
  }

  switch (kind) {
    case 'skyline':
      return renderSkyline(base, seed)
    case 'onsen':
      return renderOnsen(base)
    case 'castle':
      return renderCastle(base)
    case 'machiya':
      return renderMachiya(base, seed)
    case 'gassho':
      return renderGassho(base, seed)
    case 'torii':
      return renderTorii(base, seed)
    case 'pavilion':
      return renderPavilion(base)
    case 'pagoda':
    default:
      return renderPagoda(base, seed)
  }
}
