/**
 * Reveal — aparición al entrar en viewport (IntersectionObserver + delay).
 *
 * Replica el data-reveal del diseño: oculta el contenido (opacity 0 + translateY)
 * y lo revela con una transición de .9s tras `delay` ms cuando entra en pantalla.
 * Si no hay IntersectionObserver (tests/SSR) o reduce-motion, el contenido se
 * muestra directamente.
 */
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

interface RevealProps {
  delay?: number
  children: ReactNode
  style?: CSSProperties
}

export default function Reveal({ delay = 0, children, style }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') return

    el.style.opacity = '0'
    el.style.transform = 'translateY(30px)'
    el.style.transition = 'opacity .9s cubic-bezier(.2,0,0,1), transform .9s cubic-bezier(.2,0,0,1)'

    let timer: ReturnType<typeof setTimeout> | undefined
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            timer = setTimeout(() => {
              el.style.opacity = '1'
              el.style.transform = 'none'
            }, delay)
            io.unobserve(el)
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)

    return () => {
      io.disconnect()
      if (timer) clearTimeout(timer)
    }
  }, [delay])

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  )
}
