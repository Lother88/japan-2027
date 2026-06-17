/**
 * themeFan — animación de abanico de papel (sensu) que cubre la pantalla durante
 * el cambio de tema, reproducida del diseño Claude Design.
 *
 * `buildFan` construye las hojas imperativamente dentro de un contenedor fijo
 * (más simple y robusto que renderizarlas con React para una animación puramente
 * visual). `playFanSwap` ejecuta la secuencia de timings: sube el abanico cerrado,
 * lo abre de izquierda a derecha, intercambia el tema mientras cubre la pantalla,
 * lo cierra y lo baja. El intercambio real del tema se delega en `applySwap`.
 */

const N = 22 // número de hojas
const START_ANGLE = -88 // ángulo de hoja cerrada (grados)
const OPEN_ANGLE = 176 // apertura total del abanico (grados)
const STAGGER = 13 // ms de desfase entre hojas
const RISE = 300 // ms de subida

const BLADE_GRADIENT =
  'linear-gradient(180deg,#eef3f9 0 4%,#cdd9ec 4% 7%,#2c527e 7% 80%,#b98f4f 80% 84%,#9a7233 84% 100%)'

export interface FanHandles {
  readonly root: HTMLDivElement
  readonly blades: readonly HTMLDivElement[]
}

/** Rellena `root` con las hojas del abanico y devuelve los handles. */
export function buildFan(root: HTMLDivElement): FanHandles {
  root.setAttribute('data-fan', '')
  Object.assign(root.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '200',
    opacity: '0',
    pointerEvents: 'none',
    overflow: 'hidden',
    transform: 'translateY(118%)',
    willChange: 'transform, opacity',
  } satisfies Partial<CSSStyleDeclaration>)

  const blades: HTMLDivElement[] = []
  for (let i = 0; i < N; i++) {
    const blade = document.createElement('div')
    Object.assign(blade.style, {
      position: 'absolute',
      left: '50%',
      bottom: '0',
      width: '26vh',
      height: '140vh',
      marginLeft: '-13vh',
      transformOrigin: '50% 100%',
      transform: `rotate(${START_ANGLE}deg)`,
      transition: 'transform .52s cubic-bezier(.34,0,.2,1)',
      clipPath: 'polygon(0 0,100% 0,60% 100%,40% 100%)',
      background: BLADE_GRADIENT,
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.05)',
    } satisfies Partial<CSSStyleDeclaration>)

    // Nervio claro central (varilla de papel)
    const rib = document.createElement('div')
    Object.assign(rib.style, {
      position: 'absolute',
      top: '0',
      bottom: '0',
      left: '50%',
      width: '1.5px',
      marginLeft: '-0.75px',
      background: 'rgba(244,236,210,.62)',
    } satisfies Partial<CSSStyleDeclaration>)
    blade.appendChild(rib)

    root.appendChild(blade)
    blades.push(blade)
  }

  // Remache de pivote inferior (dorado)
  const rivet = document.createElement('div')
  Object.assign(rivet.style, {
    position: 'absolute',
    left: '50%',
    bottom: '-22px',
    width: '46px',
    height: '46px',
    marginLeft: '-23px',
    borderRadius: '50%',
    background: 'radial-gradient(circle at 50% 38%, #f4d58a, #b98f4f 70%, #8a6a32)',
    boxShadow: '0 -2px 8px rgba(0,0,0,.25)',
    zIndex: '3',
  } satisfies Partial<CSSStyleDeclaration>)
  root.appendChild(rivet)

  return { root, blades }
}

/**
 * Reproduce la secuencia completa del abanico. Llama a `applySwap` (cambio de
 * tema) cuando el abanico cubre la pantalla. Devuelve una promesa que resuelve
 * al terminar (para liberar el guard de "ocupado").
 */
export function playFanSwap(fan: FanHandles, applySwap: () => void): Promise<void> {
  return new Promise(resolve => {
    const { root, blades } = fan
    const openStart = RISE + 50
    const openDur = (N - 1) * STAGGER + 340
    const swapAt = openStart + openDur + 30
    const closeAt = openStart + openDur + 260
    const dropAt = closeAt + 360
    const endAt = dropAt + 520

    // Subida (cerrado)
    root.style.pointerEvents = 'auto'
    root.style.transition = 'transform .3s cubic-bezier(.2,0,.1,1), opacity .3s ease'
    root.style.opacity = '1'
    void root.offsetHeight // fuerza reflow para que la subida anime
    root.style.transform = 'translateY(0)'

    // Apertura izquierda → derecha
    window.setTimeout(() => {
      blades.forEach((b, i) => {
        b.style.transitionDelay = `${i * STAGGER}ms`
        b.style.transform = `rotate(${START_ANGLE + i * (OPEN_ANGLE / (N - 1))}deg)`
      })
    }, openStart)

    // Intercambio del tema bajo el abanico
    window.setTimeout(applySwap, swapAt)

    // Cierre derecha → izquierda
    window.setTimeout(() => {
      blades.forEach((b, i) => {
        b.style.transitionDelay = `${(N - 1 - i) * STAGGER}ms`
        b.style.transform = `rotate(${START_ANGLE}deg)`
      })
    }, closeAt)

    // Bajada y ocultado
    window.setTimeout(() => {
      root.style.transition = 'transform .42s cubic-bezier(.4,0,.2,1), opacity .3s ease .15s'
      root.style.transform = 'translateY(118%)'
      root.style.opacity = '0'
    }, dropAt)

    window.setTimeout(() => {
      root.style.pointerEvents = 'none'
      blades.forEach(b => {
        b.style.transitionDelay = '0ms'
      })
      resolve()
    }, endAt)
  })
}
