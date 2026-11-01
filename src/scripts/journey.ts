/**
 * journey — estado del itinerario al hacer scroll: día activo del rail, barra de progreso y
 * visibilidad del botón «volver arriba».
 *
 * Día activo (misma regla que el diseño original): la última sección `[data-day]` cuyo borde
 * superior ya ha cruzado el 42 % del alto del viewport (antes del primer día, el primero).
 * Un IntersectionObserver con una línea a ese 42 % avisa SOLO cuando un borde la cruza; en ese
 * momento se miden las secciones una vez (nada de leer geometría en cada evento de scroll).
 * Al cambiar de día se alternan atributos ya pre-renderizados en DayRail.astro:
 *  - `hidden` en los 21 bloques [data-rail-block] y las 21 líneas compactas [data-rail-line],
 *  - `aria-current="location"` y `data-passed` en los enlaces del rail (estilos en index.css),
 *  - href/aria-label de anterior/siguiente [data-rail-nav] y su versión deshabilitada.
 *
 * Barra de progreso [data-rail-progress]: con soporte de `animation-timeline` es CSS
 * scroll-driven (index.css, «view-timeline» de [data-journey]) y aquí no se hace nada; sin él,
 * un listener de scroll con rAF escribe `transform` (composited, sin layout).
 *
 * Botón «volver arriba» [data-totop]: visible tras bajar el 60 % del viewport; mientras está
 * oculto es `inert` (fuera del Tab y de los lectores de pantalla). Solo se escribe al cambiar.
 */
import { dayAnchor } from '@/features/landing/scroll'

const ACTIVE_LINE = 0.42

const journey = document.querySelector<HTMLElement>('[data-journey]')
const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-day]'))
const dayIds = sections.map((s) => Number(s.dataset.day))
const blocks = Array.from(document.querySelectorAll<HTMLElement>('[data-rail-block]'))
const lines = Array.from(document.querySelectorAll<HTMLElement>('[data-rail-line]'))
const ticks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-rail-tick]'))
const nav = (which: string) => document.querySelector<HTMLElement>(`[data-rail-nav="${which}"]`)
const prevLink = nav('prev')
const prevOff = nav('prev-off')
const nextLink = nav('next')
const nextOff = nav('next-off')
const toTop = document.querySelector<HTMLElement>('[data-totop]')

/* ── Día activo ─────────────────────────────────────────────────────────── */

let activeIndex = 0

/** Índice del día activo según la posición actual (lecturas agrupadas, sin escrituras). */
function measureActive(): number {
  const line = window.innerHeight * ACTIVE_LINE
  let active = 0
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].getBoundingClientRect().top <= line) active = i
    else break
  }
  return active
}

function setNav(link: HTMLElement | null, off: HTMLElement | null, dayId: number | undefined, label: string) {
  if (!link || !off) return
  const exists = dayId !== undefined
  link.hidden = !exists
  off.hidden = exists
  if (exists) {
    link.setAttribute('href', `#${dayAnchor(dayId)}`)
    link.setAttribute('aria-label', `${label}: día ${dayId}`)
  }
}

function render(index: number) {
  activeIndex = index
  const id = String(dayIds[index])
  blocks.forEach((b) => (b.hidden = b.dataset.railDay !== id))
  lines.forEach((l) => (l.hidden = l.dataset.railDay !== id))
  ticks.forEach((t, i) => {
    if (i === index) t.setAttribute('aria-current', 'location')
    else t.removeAttribute('aria-current')
    t.toggleAttribute('data-passed', i <= index)
  })
  setNav(prevLink, prevOff, dayIds[index - 1], 'Día anterior')
  setNav(nextLink, nextOff, dayIds[index + 1], 'Día siguiente')
}

function update() {
  const next = measureActive()
  if (next !== activeIndex) render(next)
}

if (sections.length) {
  // Línea de alto cero al 42 % del viewport: el callback llega cuando un borde la cruza.
  const io = new IntersectionObserver(update, {
    rootMargin: `-${ACTIVE_LINE * 100}% 0px -${(1 - ACTIVE_LINE) * 100}% 0px`,
  })
  sections.forEach((s) => io.observe(s))
  update()
}

/* ── Progreso (sin scroll-driven animations) y botón «volver arriba» ────── */

const cssProgress = CSS.supports('animation-timeline: view()')
const bars = {
  v: Array.from(document.querySelectorAll<HTMLElement>('[data-rail-progress="v"]')),
  h: Array.from(document.querySelectorAll<HTMLElement>('[data-rail-progress="h"]')),
}

let raf = 0
let topVisible: boolean | undefined

function onFrame() {
  raf = 0
  const vh = window.innerHeight

  // Lecturas primero, escrituras después (sin reflows forzados).
  let progress = -1
  if (!cssProgress && journey) {
    const r = journey.getBoundingClientRect()
    const total = Math.max(r.height - vh, 1)
    progress = Math.max(0, Math.min(1, Math.max(-r.top, 0) / total))
  }
  const visible = window.scrollY > vh * 0.6

  if (progress >= 0) {
    bars.v.forEach((b) => (b.style.transform = `scaleY(${progress})`))
    bars.h.forEach((b) => (b.style.transform = `scaleX(${progress})`))
  }
  if (toTop && visible !== topVisible) {
    topVisible = visible
    toTop.style.opacity = visible ? '1' : '0'
    toTop.style.transform = visible ? 'translateY(0) scale(1)' : 'translateY(14px) scale(.9)'
    toTop.style.pointerEvents = visible ? 'auto' : 'none'
    toTop.toggleAttribute('inert', !visible)
  }
}

function schedule() {
  if (!raf) raf = requestAnimationFrame(onFrame)
}

window.addEventListener('scroll', schedule, { passive: true })
window.addEventListener('resize', () => {
  schedule()
  update()
}, { passive: true })
schedule()
