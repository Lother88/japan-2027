/**
 * FanEditor — HERRAMIENTA TEMPORAL Y DESECHABLE para diseñar el abanico (sensu)
 * de la transición claro/oscuro.
 *
 * Se monta en una "página aparte" accesible en  /#fan-editor  (ver main.tsx).
 * Reproduce el abanico con una copia PARAMETRIZADA de la lógica de themeFan.ts,
 * de modo que este archivo se pueda borrar sin tocar el de producción. Cuando los
 * parámetros queden a gusto, se copian al bloque de constantes de themeFan.ts y se
 * elimina esta herramienta (FanEditor.tsx + la rama de main.tsx).
 *
 * Panel izquierdo: controles (forma, papel/background, pivote, animación) + salida
 * de parámetros para copiar. El abanico se previsualiza a pantalla completa, igual
 * que en producción, abierto de forma estática (slider de apertura) o animando la
 * transición completa con el botón "Probar transición".
 */
import { useEffect, useMemo, useRef, useState } from 'react'

interface FanConfig {
  N: number
  startAngle: number
  openAngle: number
  stagger: number
  rise: number
  bladeWidthVh: number
  bladeHeightVh: number
  clipPath: string
  gradient: string
  ribWidth: number
  ribColor: string
  bladeShadow: string
  rivetSize: number
  rivetBottom: number
  rivetGradient: string
}

// Defaults = valores actuales de themeFan.ts
const DEFAULTS: FanConfig = {
  N: 22,
  startAngle: -88,
  openAngle: 176,
  stagger: 13,
  rise: 300,
  bladeWidthVh: 26,
  bladeHeightVh: 140,
  clipPath: 'polygon(0 0,100% 0,60% 100%,40% 100%)',
  gradient:
    'linear-gradient(180deg,#eef3f9 0 4%,#cdd9ec 4% 7%,#2c527e 7% 80%,#b98f4f 80% 84%,#9a7233 84% 100%)',
  ribWidth: 1.5,
  ribColor: 'rgba(244,236,210,.62)',
  bladeShadow: 'inset 0 0 0 1px rgba(0,0,0,.05)',
  rivetSize: 46,
  rivetBottom: -22,
  rivetGradient: 'radial-gradient(circle at 50% 38%, #f4d58a, #b98f4f 70%, #8a6a32)',
}

/** (Re)construye el abanico dentro de `root` con la config y un grado de apertura. */
function applyFan(root: HTMLDivElement, cfg: FanConfig, openPct: number) {
  root.innerHTML = ''
  Object.assign(root.style, {
    position: 'fixed',
    inset: '0',
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: '10',
    opacity: '1',
    transform: 'translateY(0)',
  } satisfies Partial<CSSStyleDeclaration>)

  for (let i = 0; i < cfg.N; i++) {
    const angle = cfg.startAngle + openPct * i * (cfg.openAngle / (cfg.N - 1))
    const blade = document.createElement('div')
    Object.assign(blade.style, {
      position: 'absolute',
      left: '50%',
      bottom: '0',
      width: `${cfg.bladeWidthVh}vh`,
      height: `${cfg.bladeHeightVh}vh`,
      marginLeft: `-${cfg.bladeWidthVh / 2}vh`,
      transformOrigin: '50% 100%',
      transform: `rotate(${angle}deg)`,
      transition: 'transform .52s cubic-bezier(.34,0,.2,1)',
      clipPath: cfg.clipPath,
      background: cfg.gradient,
      boxShadow: cfg.bladeShadow,
    } satisfies Partial<CSSStyleDeclaration>)

    const rib = document.createElement('div')
    Object.assign(rib.style, {
      position: 'absolute',
      top: '0',
      bottom: '0',
      left: '50%',
      width: `${cfg.ribWidth}px`,
      marginLeft: `-${cfg.ribWidth / 2}px`,
      background: cfg.ribColor,
    } satisfies Partial<CSSStyleDeclaration>)
    blade.appendChild(rib)
    root.appendChild(blade)
  }

  const rivet = document.createElement('div')
  Object.assign(rivet.style, {
    position: 'absolute',
    left: '50%',
    bottom: `${cfg.rivetBottom}px`,
    width: `${cfg.rivetSize}px`,
    height: `${cfg.rivetSize}px`,
    marginLeft: `-${cfg.rivetSize / 2}px`,
    borderRadius: '50%',
    background: cfg.rivetGradient,
    boxShadow: '0 -2px 8px rgba(0,0,0,.25)',
    zIndex: '3',
  } satisfies Partial<CSSStyleDeclaration>)
  root.appendChild(rivet)
}

const NUM_FIELDS: { key: keyof FanConfig; label: string; min: number; max: number; step: number }[] = [
  { key: 'N', label: 'Nº de hojas', min: 6, max: 48, step: 1 },
  { key: 'startAngle', label: 'Ángulo cerrado (°)', min: -180, max: 0, step: 1 },
  { key: 'openAngle', label: 'Apertura total (°)', min: 60, max: 340, step: 1 },
  { key: 'bladeWidthVh', label: 'Ancho hoja (vh)', min: 6, max: 60, step: 0.5 },
  { key: 'bladeHeightVh', label: 'Alto hoja (vh)', min: 60, max: 220, step: 1 },
  { key: 'ribWidth', label: 'Grosor nervio (px)', min: 0, max: 6, step: 0.5 },
  { key: 'rivetSize', label: 'Tamaño remache (px)', min: 0, max: 90, step: 1 },
  { key: 'rivetBottom', label: 'Offset remache (px)', min: -60, max: 24, step: 1 },
  { key: 'stagger', label: 'Desfase entre hojas (ms)', min: 0, max: 40, step: 1 },
  { key: 'rise', label: 'Subida (ms)', min: 0, max: 800, step: 10 },
]

const TEXT_FIELDS: { key: keyof FanConfig; label: string; rows: number }[] = [
  { key: 'gradient', label: 'background — gradiente del papel', rows: 4 },
  { key: 'clipPath', label: 'clip-path de la hoja', rows: 2 },
  { key: 'ribColor', label: 'color del nervio central', rows: 1 },
  { key: 'bladeShadow', label: 'box-shadow de la hoja', rows: 1 },
  { key: 'rivetGradient', label: 'background del remache (pivote)', rows: 2 },
]

export default function FanEditor() {
  const [cfg, setCfg] = useState<FanConfig>(DEFAULTS)
  const [openPct, setOpenPct] = useState(1)
  const [playing, setPlaying] = useState(false)
  const [bg, setBg] = useState<'light' | 'dark'>(
    () => (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') ?? 'light',
  )
  const rootRef = useRef<HTMLDivElement | null>(null)

  // Aplica el fondo de tema al documento para ver el abanico sobre claro/oscuro.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', bg)
  }, [bg])

  // Previsualización estática (no se redibuja mientras anima la transición).
  useEffect(() => {
    if (playing || !rootRef.current) return
    applyFan(rootRef.current, cfg, openPct)
  }, [cfg, openPct, playing])

  const set = <K extends keyof FanConfig>(key: K, value: FanConfig[K]) =>
    setCfg(prev => ({ ...prev, [key]: value }))

  const code = useMemo(
    () => `// Parámetros del abanico → themeFan.ts
const N = ${cfg.N}
const START_ANGLE = ${cfg.startAngle}
const OPEN_ANGLE = ${cfg.openAngle}
const STAGGER = ${cfg.stagger}
const RISE = ${cfg.rise}

const BLADE_GRADIENT =
  '${cfg.gradient}'

// blade.style → width:'${cfg.bladeWidthVh}vh' height:'${cfg.bladeHeightVh}vh' marginLeft:'-${cfg.bladeWidthVh / 2}vh'
//   clipPath:'${cfg.clipPath}'
//   boxShadow:'${cfg.bladeShadow}'
// rib.style  → width:'${cfg.ribWidth}px' marginLeft:'-${cfg.ribWidth / 2}px' background:'${cfg.ribColor}'
// rivet.style→ width/height:'${cfg.rivetSize}px' bottom:'${cfg.rivetBottom}px' marginLeft:'-${cfg.rivetSize / 2}px'
//   background:'${cfg.rivetGradient}'`,
    [cfg],
  )

  // Reproduce la transición completa (subir, abrir, swap de tema, cerrar, bajar).
  const play = () => {
    const root = rootRef.current
    if (!root || playing) return
    setPlaying(true)
    applyFan(root, cfg, 0) // cerrado
    const blades = Array.from(root.children).slice(0, cfg.N) as HTMLDivElement[]

    const openStart = cfg.rise + 50
    const openDur = (cfg.N - 1) * cfg.stagger + 340
    const swapAt = openStart + openDur + 30
    const closeAt = openStart + openDur + 260
    const dropAt = closeAt + 360
    const endAt = dropAt + 520

    root.style.transition = 'transform .3s cubic-bezier(.2,0,.1,1)'
    root.style.transform = 'translateY(118%)'
    void root.offsetHeight
    root.style.transform = 'translateY(0)'

    window.setTimeout(() => {
      blades.forEach((b, i) => {
        b.style.transitionDelay = `${i * cfg.stagger}ms`
        b.style.transform = `rotate(${cfg.startAngle + i * (cfg.openAngle / (cfg.N - 1))}deg)`
      })
    }, openStart)

    window.setTimeout(() => setBg(p => (p === 'dark' ? 'light' : 'dark')), swapAt)

    window.setTimeout(() => {
      blades.forEach((b, i) => {
        b.style.transitionDelay = `${(cfg.N - 1 - i) * cfg.stagger}ms`
        b.style.transform = `rotate(${cfg.startAngle}deg)`
      })
    }, closeAt)

    window.setTimeout(() => {
      root.style.transition = 'transform .42s cubic-bezier(.4,0,.2,1)'
      root.style.transform = 'translateY(118%)'
    }, dropAt)

    window.setTimeout(() => setPlaying(false), endAt)
  }

  // ── Estilos del panel (todo inline; herramienta desechable) ──
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '.04em',
    color: 'var(--muted2)',
    margin: '12px 0 4px',
  }
  const inputStyle: React.CSSProperties = {
    width: '100%',
    fontFamily: 'monospace',
    fontSize: '12px',
    padding: '6px 8px',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    background: 'var(--surface)',
    color: 'var(--ink)',
    resize: 'vertical',
  }
  const btn: React.CSSProperties = {
    padding: '9px 14px',
    borderRadius: '9px',
    border: '1px solid var(--border)',
    background: 'var(--surface-warm)',
    color: 'var(--ink)',
    fontWeight: 700,
    fontSize: '13px',
    cursor: 'pointer',
  }

  return (
    <>
      {/* Lienzo de previsualización a pantalla completa */}
      <div ref={rootRef} aria-hidden="true" />

      {/* Panel de controles */}
      <aside
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          bottom: '0',
          width: '370px',
          maxWidth: '92vw',
          zIndex: 20,
          overflowY: 'auto',
          padding: '18px 18px 60px',
          background: 'color-mix(in srgb, var(--surface) 92%, transparent)',
          backdropFilter: 'blur(8px)',
          borderRight: '1px solid var(--border)',
          fontFamily: "'Zen Kaku Gothic New', sans-serif",
          color: 'var(--ink)',
        }}
      >
        <h1 style={{ fontSize: '17px', margin: '0 0 2px' }}>Editor del abanico 扇</h1>
        <p style={{ fontSize: '12px', color: 'var(--slate)', margin: '0 0 14px', lineHeight: 1.5 }}>
          Herramienta temporal. Ajusta los parámetros, prueba la transición y copia el
          bloque de salida a <code>themeFan.ts</code> cuando te guste.
        </p>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <button style={btn} onClick={play} disabled={playing}>
            ▶ Probar transición
          </button>
          <button style={btn} onClick={() => setBg(p => (p === 'dark' ? 'light' : 'dark'))}>
            Fondo: {bg === 'dark' ? '🌙 oscuro' : '☀️ claro'}
          </button>
          <button style={btn} onClick={() => setCfg(DEFAULTS)}>
            Reset
          </button>
        </div>

        <label style={labelStyle}>Apertura previa: {Math.round(openPct * 100)}%</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={openPct}
          onChange={e => setOpenPct(Number(e.target.value))}
          style={{ width: '100%' }}
        />

        {/* Campos de texto (background, clip-path, colores) primero: lo más editado */}
        {TEXT_FIELDS.map(f => (
          <div key={f.key}>
            <label style={labelStyle}>{f.label}</label>
            <textarea
              rows={f.rows}
              value={cfg[f.key] as string}
              onChange={e => set(f.key, e.target.value as never)}
              style={inputStyle}
              spellCheck={false}
            />
          </div>
        ))}

        {/* Campos numéricos con slider + número */}
        {NUM_FIELDS.map(f => (
          <div key={f.key}>
            <label style={labelStyle}>
              {f.label}: {cfg[f.key] as number}
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="range"
                min={f.min}
                max={f.max}
                step={f.step}
                value={cfg[f.key] as number}
                onChange={e => set(f.key, Number(e.target.value) as never)}
                style={{ flex: 1 }}
              />
              <input
                type="number"
                min={f.min}
                max={f.max}
                step={f.step}
                value={cfg[f.key] as number}
                onChange={e => set(f.key, Number(e.target.value) as never)}
                style={{ ...inputStyle, width: '72px' }}
              />
            </div>
          </div>
        ))}

        {/* Salida */}
        <label style={labelStyle}>Parámetros (para themeFan.ts)</label>
        <textarea readOnly rows={12} value={code} style={{ ...inputStyle, fontSize: '11px' }} />
        <button
          style={{ ...btn, marginTop: '8px' }}
          onClick={() => navigator.clipboard?.writeText(code)}
        >
          📋 Copiar parámetros
        </button>
      </aside>
    </>
  )
}
