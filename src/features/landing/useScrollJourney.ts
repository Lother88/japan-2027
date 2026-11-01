/**
 * useScrollJourney — estado de scroll para el "journey".
 *
 * Portado de handleScroll del diseño. En un único listener de scroll (con rAF):
 *  - calcula el día activo (sección [data-day] cuyo top cruza el 42% del viewport)
 *  - calcula el progreso 0..1 dentro del contenedor [data-journey] y lo escribe en el rail
 *  - alterna la visibilidad del botón [data-totop] (oculto → `inert`, fuera del Tab)
 *
 * El progreso se escribe directamente como transform en las barras [data-rail-progress]
 * del rail (sin estado de React por frame). Devuelve { activeIndex, progress }: activeIndex
 * es el índice (0-based) de la sección de día en orden de DOM, y solo cambia (y re-renderiza)
 * al cambiar de día; progress es el valor de ese momento, para el render del rail.
 *
 * El parallax del kanji de fondo ya no pasa por aquí: es CSS scroll-driven
 * (`animation-timeline: view()` en index.css).
 */
import { useEffect, useState } from 'react'

export interface JourneyState {
  activeIndex: number
  progress: number
}

export function useScrollJourney(): JourneyState {
  const [state, setState] = useState<JourneyState>({ activeIndex: 0, progress: 0 })

  useEffect(() => {
    // Fallback para entornos sin rAF (jsdom/SSR)
    const requestFrame: (cb: FrameRequestCallback) => number =
      typeof requestAnimationFrame !== 'undefined'
        ? requestAnimationFrame
        : (cb) => setTimeout(() => cb(0), 16) as unknown as number
    const cancelFrame: (id: number) => void =
      typeof cancelAnimationFrame !== 'undefined' ? cancelAnimationFrame : (id) => clearTimeout(id)

    let raf = 0
    // Última visibilidad aplicada a ToTop: solo se escribe cuando cambia.
    let lastVis: boolean | undefined

    const compute = () => {
      raf = 0
      // 1) Lecturas (todas antes de cualquier escritura, para no forzar reflows).
      const sections = Array.from(document.querySelectorAll('[data-day]'))
      const journey = document.querySelector('[data-journey]')
      const vh = window.innerHeight
      const mid = vh * 0.42

      let active = 0
      sections.forEach((s, i) => {
        const r = s.getBoundingClientRect()
        if (r.top <= mid) active = i
      })

      let progress = 0
      if (journey) {
        const r = journey.getBoundingClientRect()
        const total = Math.max(r.height - vh, 1)
        const passed = Math.min(Math.max(-r.top, 0), total)
        progress = Math.max(0, Math.min(1, passed / total))
      }

      const vis = window.scrollY > vh * 0.6

      // 2) Escrituras. El progreso va directo a las barras del rail (transform: composited,
      //    sin layout) en vez de pasar por React en cada frame.
      document.querySelectorAll<HTMLElement>('[data-rail-progress="v"]').forEach((b) => {
        b.style.transform = `scaleY(${progress})`
      })
      document.querySelectorAll<HTMLElement>('[data-rail-progress="h"]').forEach((b) => {
        b.style.transform = `scaleX(${progress})`
      })

      // botón volver arriba: solo al cambiar de visibilidad
      const top = document.querySelector<HTMLElement>('[data-totop]')
      if (top && vis !== lastVis) {
        lastVis = vis
        top.style.opacity = vis ? '1' : '0'
        top.style.transform = vis ? 'translateY(0) scale(1)' : 'translateY(14px) scale(.9)'
        top.style.pointerEvents = vis ? 'auto' : 'none'
        // Invisible ⇒ inerte: ni enfocable con Tab ni expuesto a lectores de pantalla.
        top.toggleAttribute('inert', !vis)
      }

      // React solo re-renderiza al cambiar el día activo. `progress` se guarda para el render
      // (el rail lo pinta con el valor de ese momento), pero por sí solo no provoca renders.
      setState((prev) => (active !== prev.activeIndex ? { activeIndex: active, progress } : prev))
    }

    const schedule = () => {
      if (!raf) raf = requestFrame(compute)
    }

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    // primer cálculo diferido (evita setState síncrono en el cuerpo del efecto)
    schedule()

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (raf) cancelFrame(raf)
    }
  }, [])

  return state
}
