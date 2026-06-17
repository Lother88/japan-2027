/**
 * SakuraPetals — pétalos cayendo sobre toda la página (canvas + rAF).
 *
 * Portado fielmente del diseño (initPetals): densidad según viewport, deriva
 * sinusoidal, recolocación al salir, y desvanecido con el scroll. Respeta
 * prefers-reduced-motion (no anima) y se limpia al desmontar.
 */
import { useEffect, useRef } from 'react'

interface Petal {
  x: number
  y: number
  s: number
  vy: number
  vx: number
  vr: number
  rot: number
  phase: number
  alpha: number
  color: string
}

export default function SakuraPetals() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = ref.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      c.width = window.innerWidth * dpr
      c.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const mob = window.matchMedia('(max-width:860px)').matches
    const N = mob ? 15 : 32
    const colors = ['#f4b9cb', '#f7cdd9', '#e89cb6', '#ffffff', '#f6c2d2']
    const W = () => window.innerWidth
    const H = () => window.innerHeight

    const make = (): Petal => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      s: 4 + Math.random() * 5,
      vy: 0.5 + Math.random() * 1.1,
      vx: -0.5 + Math.random() * 0.35,
      vr: -0.02 + Math.random() * 0.04,
      rot: Math.random() * Math.PI * 2,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.45 + Math.random() * 0.45,
      color: colors[Math.floor(Math.random() * colors.length)],
    })
    const petals: Petal[] = Array.from({ length: N }, make)

    let raf = 0
    const draw = () => {
      // En modo oscuro no se pintan pétalos (fiel al diseño). Se lee el atributo
      // directamente para no reiniciar el efecto al cambiar de tema: al pasar a
      // oscuro deja de pintar y al volver a claro reanuda en el siguiente frame.
      if (document.documentElement.getAttribute('data-theme') === 'dark') {
        ctx.clearRect(0, 0, c.width, c.height)
        raf = requestAnimationFrame(draw)
        return
      }
      const w = W()
      const h = H()
      ctx.clearRect(0, 0, w, h)
      const hf = Math.max(0.2, 1 - window.scrollY / (h * 1.7))
      for (const p of petals) {
        p.y += p.vy
        p.x += p.vx + Math.sin(p.y * 0.012 + p.phase) * 0.5
        p.rot += p.vr
        if (p.y > h + 20) {
          p.y = -20
          p.x = Math.random() * w
        }
        if (p.x < -20) p.x = w + 20
        if (p.x > w + 20) p.x = -20
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.globalAlpha = p.alpha * hf
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.ellipse(0, 0, p.s, p.s * 0.6, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      data-petals
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 60 }}
    />
  )
}
