/**
 * hotels — comportamiento de la página /hoteles/ (todo es mejora progresiva: sin este módulo
 * la página se lee entera, con las tres listas de cada estancia una tras otra).
 *
 * 1. Listas de cada estancia ([data-ranks]): control segmentado con el patrón de pestañas.
 *    Qué lista se ve lo decide `data-active` en el panel (hotels.css solo lo aplica en
 *    pantallas estrechas); aquí se mueve esa marca y se mantiene la accesibilidad: selección
 *    con clic o con las flechas, Inicio y Fin (activación automática), foco itinerante y, solo
 *    mientras el control existe (pantalla estrecha), el panel como `tabpanel` de su pestaña.
 *    En ancho las tres listas vuelven a ser secciones normales con su título.
 * 2. Barra de estancias ([data-stay-nav]): marca con `aria-current` la sección que se está
 *    leyendo y la deja a la vista dentro de la barra.
 * 3. Botón de tema en móvil: se aparta al bajar leyendo y vuelve al subir o al llegar al
 *    final, como en el itinerario (`data-fab-hide` en <html>; el CSS está en index.css).
 */

// ── 1. Listas: control segmentado ───────────────────────────────────────────

/** Mismo corte que hotels.css: por debajo, una lista cada vez. */
const oneListAtATime = window.matchMedia('(max-width: 899px)')

function setupRanks(group: HTMLElement) {
  const tablist = group.querySelector<HTMLElement>('[role="tablist"]')
  const tabs = Array.from(group.querySelectorAll<HTMLButtonElement>('[role="tab"]'))
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls') ?? ''))
  if (!tablist || tabs.length === 0 || panels.some((panel) => !panel)) return
  // Título propio de cada panel (su nombre accesible cuando no hay pestañas)
  const titles = panels.map((panel) => panel?.getAttribute('aria-labelledby') ?? '')

  function select(index: number) {
    tabs.forEach((tab, i) => {
      const selected = i === index
      tab.setAttribute('aria-selected', String(selected))
      tab.tabIndex = selected ? 0 : -1
      panels[i]?.toggleAttribute('data-active', selected)
    })
  }

  function syncRoles() {
    const asTabs = oneListAtATime.matches
    panels.forEach((panel, i) => {
      if (!panel) return
      if (asTabs) panel.setAttribute('role', 'tabpanel')
      else panel.removeAttribute('role')
      panel.setAttribute('aria-labelledby', asTabs ? tabs[i].id : titles[i])
    })
  }

  tabs.forEach((tab, i) => tab.addEventListener('click', () => select(i)))
  tablist.addEventListener('keydown', (event) => {
    const current = tabs.indexOf(event.target as HTMLButtonElement)
    if (current < 0) return
    const last = tabs.length - 1
    let next: number
    if (event.key === 'ArrowRight') next = current === last ? 0 : current + 1
    else if (event.key === 'ArrowLeft') next = current === 0 ? last : current - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    else return
    event.preventDefault()
    select(next)
    tabs[next].focus()
  })
  oneListAtATime.addEventListener('change', syncRoles)
  syncRoles()
}

document.querySelectorAll<HTMLElement>('[data-ranks]').forEach(setupRanks)

// ── 2. Barra de estancias: sección que se está leyendo ──────────────────────

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

function setupStayNav(nav: HTMLElement) {
  const links = new Map<string, HTMLAnchorElement>()
  for (const link of nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')) {
    links.set(decodeURIComponent(link.hash.slice(1)), link)
  }
  const sections = [...links.keys()].flatMap((id) => document.getElementById(id) ?? [])
  let currentId = ''

  function setCurrent(id: string) {
    if (id === currentId) return
    currentId = id
    for (const [linkId, link] of links) {
      if (linkId === id) link.setAttribute('aria-current', 'true')
      else link.removeAttribute('aria-current')
    }
    const link = links.get(id)
    if (!link) return
    // Centra el enlace dentro de la barra (scroll horizontal propio; no mueve la página)
    const left = link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2
    nav.scrollTo({ left, behavior: reducedMotion.matches ? 'auto' : 'smooth' })
  }

  // Franja de lectura: entre el 20 % y el 30 % del alto del viewport. La sección que la
  // cruza es la actual; por encima de la primera (título y reglas) no hay ninguna marcada.
  const inBand = new Set<string>()
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) inBand.add(entry.target.id)
        else inBand.delete(entry.target.id)
      }
      const visible = sections.filter((section) => inBand.has(section.id))
      const reading = visible[visible.length - 1]
      // Entre dos secciones se conserva la última; antes de la primera, ninguna
      if (reading) setCurrent(reading.id)
      else if (sections[0] && sections[0].getBoundingClientRect().top > 0) setCurrent('')
    },
    { rootMargin: '-20% 0px -70% 0px' },
  )
  for (const section of sections) observer.observe(section)
}

const stayNav = document.querySelector<HTMLElement>('[data-stay-nav]')
if (stayNav) setupStayNav(stayNav)

// ── 3. Botón de tema en móvil: se aparta al bajar leyendo ───────────────────

/** Recorrido seguido en un sentido (px) antes de esconder o devolver el botón. */
const FAB_TRAVEL = 24
const mobile = window.matchMedia('(max-width: 860px)')
let lastY = window.scrollY
let travel = 0
let fabHidden = false
let frame = 0

function onFrame() {
  frame = 0
  const y = window.scrollY
  const viewport = window.innerHeight
  const dy = y - lastY
  lastY = y
  // Un salto de más de una pantalla (ancla, recarga) no es leer: no cuenta
  const jump = Math.abs(dy) > viewport
  if (jump || (dy && Math.sign(dy) !== Math.sign(travel))) travel = 0
  if (!jump) travel += dy

  let hide = fabHidden
  const atEnd = y + viewport >= document.documentElement.scrollHeight - 4
  if (!mobile.matches || y < viewport * 0.5 || atEnd || travel < -FAB_TRAVEL) hide = false
  else if (travel > FAB_TRAVEL) hide = true
  if (hide !== fabHidden) {
    fabHidden = hide
    document.documentElement.toggleAttribute('data-fab-hide', hide)
  }
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(onFrame)
}

window.addEventListener('scroll', schedule, { passive: true })
mobile.addEventListener('change', schedule)
