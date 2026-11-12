/**
 * journey — estado del itinerario al hacer scroll: día activo del rail (escritorio) y de la
 * tira de fechas (móvil), barra de progreso y visibilidad del botón «volver arriba».
 *
 * Día activo (misma regla que el diseño original): la última sección `[data-day]` cuyo borde
 * superior ya ha cruzado el 42 % del alto del viewport (antes del primer día, el primero).
 * Un IntersectionObserver con una línea a ese 42 % avisa SOLO cuando un borde la cruza; en ese
 * momento se miden las secciones una vez (nada de leer geometría en cada evento de scroll).
 * El estado inicial también sale de ese observer: su primera notificación llega tras el primer
 * layout, así que medir ahí no fuerza un reflow (medir al cargar el script sí lo hacía: ~130 ms
 * de layout síncrono en móvil). Hasta entonces se ve el día 1, que es el pre-renderizado.
 * Al cambiar de día se alternan atributos ya pre-renderizados (DayRail.astro y DateStrip.astro):
 *  - `hidden` en los 21 bloques [data-rail-block],
 *  - `aria-current="location"` y `data-passed` en los enlaces del rail (estilos en index.css),
 *  - `aria-current="location"` en el chip del día de la tira, que además se desplaza en
 *    horizontal para dejar ese chip a la vista (solo si la tira se ve: en escritorio no mide).
 *
 * Barra de progreso [data-rail-progress]: con soporte de `animation-timeline` es CSS
 * scroll-driven (index.css, «view-timeline» de [data-journey]) y aquí no se hace nada; sin él,
 * un listener de scroll con rAF escribe `transform` (composited, sin layout).
 *
 * Botón «volver arriba» [data-totop]: visible tras bajar el 60 % del viewport; mientras está
 * oculto es `inert` (fuera del Tab y de los lectores de pantalla). Solo se escribe al cambiar.
 *
 * Botones flotantes en móvil (≤ 860 px): con el itinerario bajo ellos (un IntersectionObserver
 * vigila la franja inferior del viewport, donde están), al bajar leyendo se apartan para no
 * tapar la hora ni las casillas de los pasos, y vuelven al subir o al llegar al final de la
 * página: `data-fab-hide` en <html>, que index.css traduce en translate + opacidad. Hace falta
 * recorrer FAB_TRAVEL px en un sentido para cambiar (el temblor del dedo no los hace parpadear).
 * En escritorio, en el hero o en «La ruta», siempre visibles.
 */
const ACTIVE_LINE = 0.42
/** Recorrido (px) en un mismo sentido para ocultar o mostrar los botones flotantes en móvil. */
const FAB_TRAVEL = 24

const journey = document.querySelector<HTMLElement>('[data-journey]')
const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-day]'))
const dayIds = sections.map((s) => Number(s.dataset.day))
const blocks = Array.from(document.querySelectorAll<HTMLElement>('[data-rail-block]'))
const ticks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-rail-tick]'))
const strip = document.querySelector<HTMLElement>('[data-strip-list]')
const chips = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-strip-chip]'))
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

/** Centra el chip activo en la tira (lectura de geometría solo al cambiar de día). */
function revealChip(chip: HTMLElement | undefined) {
  if (!strip || !chip || !strip.clientWidth) return
  const item = chip.parentElement ?? chip
  const left = item.offsetLeft - (strip.clientWidth - item.offsetWidth) / 2
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  strip.scrollTo({ left: Math.max(0, left), behavior: smooth ? 'smooth' : 'auto' })
}

function render(index: number) {
  activeIndex = index
  const id = String(dayIds[index])
  blocks.forEach((b) => (b.hidden = b.dataset.railDay !== id))
  ticks.forEach((t, i) => {
    if (i === index) t.setAttribute('aria-current', 'location')
    else t.removeAttribute('aria-current')
    t.toggleAttribute('data-passed', i <= index)
  })
  chips.forEach((c) => {
    if (c.dataset.stripDay === id) c.setAttribute('aria-current', 'location')
    else c.removeAttribute('aria-current')
  })
  revealChip(chips.find((c) => c.dataset.stripDay === id))
}

function update() {
  const next = measureActive()
  if (next !== activeIndex) render(next)
}

if (sections.length) {
  // Línea de alto cero al 42 % del viewport: el callback llega cuando un borde la cruza, y una
  // vez al empezar a observar (con el layout ya hecho), que es la que fija el día inicial.
  const io = new IntersectionObserver(update, {
    rootMargin: `-${ACTIVE_LINE * 100}% 0px -${(1 - ACTIVE_LINE) * 100}% 0px`,
  })
  sections.forEach((s) => io.observe(s))
}

/* ── Progreso (sin scroll-driven animations) y botón «volver arriba» ────── */

const cssProgress = CSS.supports('animation-timeline: view()')
const bars = Array.from(document.querySelectorAll<HTMLElement>('[data-rail-progress]'))

let raf = 0
let topVisible: boolean | undefined

// Botones flotantes (móvil): ¿hay itinerario en la franja inferior del viewport (15 %)?
const mobile = window.matchMedia('(max-width: 860px)')
let journeyBelow = false
let lastY = window.scrollY
let travel = 0
let fabHidden = false
if (journey) {
  new IntersectionObserver(
    ([entry]) => {
      journeyBelow = entry.isIntersecting
      schedule()
    },
    { rootMargin: '-85% 0px 0px 0px' },
  ).observe(journey)
}
mobile.addEventListener('change', () => schedule())

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
  const y = window.scrollY
  const visible = y > vh * 0.6

  const dy = y - lastY
  lastY = y
  // Un salto de más de una pantalla (ancla al cargar, «volver arriba») no es leer: no cuenta
  const jump = Math.abs(dy) > vh
  if (jump || (dy && Math.sign(dy) !== Math.sign(travel))) travel = 0
  if (!jump) travel += dy
  let hideFab = fabHidden
  if (!mobile.matches || !journeyBelow) hideFab = false
  else if (travel < -FAB_TRAVEL || y + vh >= document.documentElement.scrollHeight - 4) hideFab = false
  else if (travel > FAB_TRAVEL) hideFab = true

  if (progress >= 0) {
    bars.forEach((b) => (b.style.transform = `scaleY(${progress})`))
  }
  if (toTop && visible !== topVisible) {
    topVisible = visible
    toTop.style.opacity = visible ? '1' : '0'
    toTop.style.transform = visible ? 'translateY(0) scale(1)' : 'translateY(14px) scale(.9)'
    toTop.style.pointerEvents = visible ? 'auto' : 'none'
    toTop.toggleAttribute('inert', !visible)
  }
  if (hideFab !== fabHidden) {
    fabHidden = hideFab
    document.documentElement.toggleAttribute('data-fab-hide', hideFab)
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

// Módulo (no script global): sus constantes no chocan con las de los demás scripts
export {}
