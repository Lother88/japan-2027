/**
 * Reveal — aparición al entrar en viewport (IntersectionObserver compartido).
 *
 * Replica el data-reveal del diseño: oculta el contenido (opacity 0 + translateY 16 px) y lo
 * revela con una transición de 600 ms (ease-out fuerte) cuando entra en pantalla.
 * Stagger por lote: solo se escalonan los elementos que entran en el mismo callback del
 * observer (50 ms por posición en orden de documento, tope 200 ms); uno que entra solo no espera.
 * Se oculta en useLayoutEffect (antes del primer pintado): en un deep-link `#dia-NN` el
 * contenido visible no se pinta para desaparecer y volver a fundirse.
 * Si no hay IntersectionObserver (tests/SSR) o reduce-motion, el contenido se muestra directamente.
 */
import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  style?: CSSProperties
}

const STAGGER_MS = 50
const MAX_STEPS = 4
/** Revelado pendiente de cada elemento observado. */
const pending = new WeakMap<Element, () => void>()
let shared: IntersectionObserver | null = null

function observer(): IntersectionObserver {
  if (shared) return shared
  shared = new IntersectionObserver(
    (entries) => {
      const entering = entries
        .filter((en) => en.isIntersecting)
        .map((en) => en.target)
        // orden de documento: el de arriba primero
        .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
      entering.forEach((el, i) => {
        shared!.unobserve(el)
        const show = pending.get(el)
        pending.delete(el)
        if (show) window.setTimeout(show, Math.min(i, MAX_STEPS) * STAGGER_MS)
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
  )
  return shared
}

export default function Reveal({ children, style }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') return

    el.style.opacity = '0'
    el.style.transform = 'translateY(16px)'
    el.style.transition = 'opacity 600ms var(--ease-out), transform 600ms var(--ease-out)'
    pending.set(el, () => {
      el.style.opacity = '1'
      el.style.transform = 'none'
    })
    observer().observe(el)

    return () => {
      pending.delete(el)
      shared?.unobserve(el)
    }
  }, [])

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  )
}
