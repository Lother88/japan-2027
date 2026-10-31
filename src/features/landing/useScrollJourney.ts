/**
 * useScrollJourney — estado de scroll para el "journey".
 *
 * Portado de handleScroll del diseño. En un único listener de scroll (con rAF):
 *  - calcula el día activo (sección [data-day] cuyo top cruza el 42% del viewport)
 *  - calcula el progreso 0..1 dentro del contenedor [data-journey]
 *  - aplica parallax a los elementos [data-parallax]
 *  - alterna la visibilidad del botón [data-totop] (oculto → `inert`, fuera del Tab)
 *
 * Devuelve { activeIndex, progress } para alimentar el rail. activeIndex es el
 * índice (0-based) de la sección de día en orden de DOM.
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

    const compute = () => {
      raf = 0
      const sections = Array.from(document.querySelectorAll('[data-day]'))
      const journey = document.querySelector('[data-journey]')
      const mid = window.innerHeight * 0.42

      let active = 0
      sections.forEach((s, i) => {
        const r = s.getBoundingClientRect()
        if (r.top <= mid) active = i
      })

      let progress = 0
      if (journey) {
        const r = journey.getBoundingClientRect()
        const total = Math.max(r.height - window.innerHeight, 1)
        const passed = Math.min(Math.max(-r.top, 0), total)
        progress = Math.max(0, Math.min(1, passed / total))
      }

      setState((prev) =>
        active !== prev.activeIndex || Math.abs(progress - prev.progress) > 0.004
          ? { activeIndex: active, progress }
          : prev,
      )

      // parallax
      const vh = window.innerHeight
      document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-parallax') || '0.1') || 0.1
        const r = el.getBoundingClientRect()
        const center = r.top + r.height / 2
        const d = center - vh / 2
        el.style.transform = 'translateY(' + (-d * speed).toFixed(1) + 'px)'
      })

      // botón volver arriba
      const top = document.querySelector<HTMLElement>('[data-totop]')
      if (top) {
        const vis = window.scrollY > vh * 0.6
        top.style.opacity = vis ? '1' : '0'
        top.style.transform = vis ? 'translateY(0) scale(1)' : 'translateY(14px) scale(.9)'
        top.style.pointerEvents = vis ? 'auto' : 'none'
        // Invisible ⇒ inerte: ni enfocable con Tab ni expuesto a lectores de pantalla.
        top.toggleAttribute('inert', !vis)
      }
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
