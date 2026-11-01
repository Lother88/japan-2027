/**
 * theme-transition — intercambio claro/oscuro con View Transitions (lo usa scripts/theme.ts).
 *
 * Secuencia (sin cadenas de setTimeout; todo cuelga de promesas de animación):
 *   1. Marca <html data-theme-swapping> → index.css anula TODAS las transiciones
 *      de color, así nunca se ve un estado a medio mezclar.
 *   2. `document.startViewTransition(commit)`: el navegador congela una captura
 *      del tema viejo, `commit` aplica el nuevo de forma síncrona (data-theme y
 *      persistencia) y el nuevo se pinta YA resuelto.
 *   3. En `vt.ready` se anima con WAAPI el pseudo-elemento que toque (clip-path
 *      u opacity: propiedades de composición).
 *   4. En `vt.finished` se retira la marca; como los valores ya son los finales,
 *      quitarla no dispara ninguna transición.
 *
 * Sin `startViewTransition` (navegadores antiguos): cambio instantáneo con las
 * transiciones suprimidas hasta que el estado nuevo se ha pintado.
 */
/** Centro y radio (px, coordenadas de viewport) del botón que dispara el cambio. */
export interface SwapOrigin {
  readonly x: number
  readonly y: number
  readonly r: number
}

export interface ThemeSwapOptions {
  readonly origin: SwapOrigin
  readonly reducedMotion: boolean
  /** Aplica el tema nuevo de forma síncrona (DOM + persistencia). */
  readonly commit: () => void
}

/** Atributo en <html> mientras dura el intercambio (ver index.css). */
export const SWAP_ATTR = 'data-theme-swapping'

const NEW = '::view-transition-new(root)'

/** in → el tema nuevo crece encima · fade → fundido · instant → sin animación. */
type SwapKind = 'in' | 'fade' | 'instant'

interface Plan {
  readonly kind: Exclude<SwapKind, 'instant'>
  readonly pseudoElement: string
  readonly keyframes: PropertyIndexedKeyframes
  readonly duration: number
  readonly easing: string
}

/** Origen a partir del elemento pulsado; sin elemento, el centro del viewport. */
export function originOf(el: Element | null | undefined): SwapOrigin {
  if (!el) return { x: window.innerWidth / 2, y: window.innerHeight / 2, r: 0 }
  const b = el.getBoundingClientRect()
  return { x: b.left + b.width / 2, y: b.top + b.height / 2, r: Math.min(b.width, b.height) / 2 }
}

/** Radio que cubre la esquina del viewport más lejana al origen. */
function farRadius({ x, y }: SwapOrigin): number {
  return Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
}

const circle = (r: number, { x, y }: SwapOrigin) => `circle(${r}px at ${x}px ${y}px)`

/**
 * Movimiento reducido: fundido de opacidad de 200ms `ease`.
 * Skill animate §7 / review-animations STANDARDS «Accessibility»: «reduced
 * motion means fewer and gentler animations, not zero — keep opacity/color,
 * remove movement»; su ejemplo es justo `fade 0.2s ease`. Un fundido de
 * capturas es uniforme (no el barro de transiciones CSS a distinto ritmo).
 */
function reducedPlan(): Plan {
  return {
    kind: 'fade',
    pseudoElement: NEW,
    keyframes: { opacity: ['0', '1'] },
    duration: 200,
    easing: 'ease',
  }
}

/**
 * Patrón MDN: el tema nuevo crece en círculo desde el borde del botón (ambas direcciones):
 * arranca con el radio del botón, que cambia de tema al instante, no desde un punto bajo él.
 * Ease-out fuerte: el área crece con r², así que el grueso del barrido llega pronto y la esquina
 * opuesta se asienta suave. WAAPI no acepta var(): es el valor literal de --ease-out.
 */
function circlePlan(o: SwapOrigin): Plan {
  return {
    kind: 'in',
    pseudoElement: NEW,
    keyframes: { clipPath: [circle(o.r, o), circle(farRadius(o), o)] },
    duration: 500,
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
  }
}

function planFor(o: ThemeSwapOptions): Plan {
  if (o.reducedMotion) return reducedPlan()
  return circlePlan(o.origin)
}

/** Resuelve cuando el estado actual ya se ha pintado (doble rAF). */
function afterNextPaint(): Promise<void> {
  return new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })
}

/**
 * Intercambia el tema con la transición de círculo. Resuelve al terminar la
 * transición (libera el guard de «ocupado» de scripts/theme.ts).
 */
export async function swapTheme(o: ThemeSwapOptions): Promise<void> {
  const root = document.documentElement

  if (typeof document.startViewTransition !== 'function') {
    root.setAttribute(SWAP_ATTR, 'instant' satisfies SwapKind)
    try {
      o.commit()
      await afterNextPaint()
    } finally {
      root.removeAttribute(SWAP_ATTR)
    }
    return
  }

  const plan = planFor(o)
  root.setAttribute(SWAP_ATTR, plan.kind)
  let animation: Animation | undefined
  try {
    const vt = document.startViewTransition(o.commit)
    try {
      await vt.ready
      animation = root.animate(plan.keyframes, {
        duration: plan.duration,
        easing: plan.easing,
        pseudoElement: plan.pseudoElement,
        // Mantiene el último fotograma hasta que el navegador desmonta los
        // pseudo-elementos (evita un parpadeo del estado sin recortar).
        fill: 'forwards',
      })
    } catch {
      // Transición omitida (p. ej. pestaña oculta): el callback se ejecuta igual.
    }
    await vt.finished
  } finally {
    // Su pseudo-elemento ya no existe: suelta la animación (con fill retenida)
    animation?.cancel()
    root.removeAttribute(SWAP_ATTR)
  }
}
