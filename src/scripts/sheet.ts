/**
 * sheet — hoja inferior de cada paso del plan (StepSheet.astro), una sola para todos.
 *
 * Abrir: clic en un paso [data-step-open] o en una fila de «Ahora / Después» (su
 * `data-step-ref` apunta al id del botón del paso). Se rellena con lo que ya hay en el HTML:
 * data-* del botón (hora, tipo, enlace de Maps, zona, reserva), sus marcas, la casilla «hecho»
 * del paso, las reservas y notas del día (clonadas de la sección) y la ficha de la zona
 * (clonada de su <template data-zone-tpl>, con «El lugar» plegado). Nada de fetch aquí: el
 * cuerpo de «El lugar» lo pide scripts/place.ts al desplegarlo.
 *
 * Cerrar: botón, fondo, Esc, «atrás» del navegador (la hoja apila una entrada de historial
 * mientras está abierta) o arrastrar hacia abajo desde el asa o con el contenido arriba del
 * todo: se cierra si pasa del 30 % de su alto o si el gesto es rápido; si no, vuelve.
 *
 * Modal de verdad: el resto de hijos de <body> pasan a `inert` (sin Tab ni lector fuera de la
 * hoja), el Tab cicla dentro, el scroll de la página se bloquea (sin salto de la barra:
 * scrollbar-gutter en index.css) y al cerrar el foco vuelve a quien la abrió.
 * Con reduce-motion, la hoja funde en lugar de deslizar (index.css).
 */

const root = document.querySelector<HTMLElement>('[data-sheet-root]')
const sheet = root?.querySelector<HTMLElement>('[data-sheet]')
const scroller = root?.querySelector<HTMLElement>('[data-sheet-scroll]')

if (root && sheet && scroller) initSheet(root, sheet, scroller)

function initSheet(root: HTMLElement, sheet: HTMLElement, scroller: HTMLElement) {
  const backdrop = root.querySelector<HTMLElement>('[data-sheet-backdrop]')!
  const grab = root.querySelector<HTMLElement>('[data-sheet-grab]')!
  const q = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel)!
  const meta = q('[data-sheet-meta]')
  const title = q('[data-sheet-title]')
  const tags = q('[data-sheet-tags]')
  const maps = q<HTMLAnchorElement>('[data-sheet-maps]')
  const doneBtn = q('[data-sheet-done]')
  const doneLabel = q('[data-sheet-done-label]')
  const resBox = q('[data-sheet-res]')
  const zoneBox = q('[data-sheet-zone]')
  const notesBox = q('[data-sheet-notes]')
  const notesList = notesBox.querySelector('ul')!
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let open = false
  let stepBox: HTMLElement | null = null
  let trigger: HTMLElement | null = null
  let inerted: Element[] = []
  let hideTimer = 0
  // Entrada de historial de la hoja abierta: un id por apertura, para que «atrás» solo deshaga
  // la nuestra (tras recargar con la hoja abierta, la entrada heredada ya no es de nadie).
  let entry = ''
  const stateOf = () => (history.state as { sheet?: string } | null)?.sheet
  if (stateOf()) history.replaceState(null, '')

  function syncDone() {
    const on = stepBox?.getAttribute('aria-checked') === 'true'
    doneBtn.setAttribute('aria-checked', String(on))
    doneLabel.textContent = on ? 'Hecho' : 'Marcar como hecho'
  }

  function fill(step: HTMLButtonElement) {
    const li = step.closest<HTMLElement>('[data-step]')
    const section = step.closest<HTMLElement>('[data-day]')
    sheet.style.setProperty('--c', section?.style.getPropertyValue('--c') ?? '')
    meta.textContent = `${step.dataset.time ?? ''} · ${step.dataset.typeLabel ?? ''}`
    title.textContent = li?.querySelector('[data-step-label]')?.textContent ?? ''
    tags.replaceChildren(...Array.from(li?.querySelector('[data-step-tags]')?.childNodes ?? [], (n) => n.cloneNode(true)))
    tags.hidden = !tags.childNodes.length
    maps.href = step.dataset.maps ?? 'https://www.google.com/maps'
    stepBox = li?.querySelector<HTMLElement>('[data-step-done]') ?? null
    syncDone()

    const res = 'reserve' in step.dataset ? section?.querySelector('[data-day-res]') : null
    resBox.replaceChildren(...(res ? [res.cloneNode(true)] : []))

    const tpl = step.dataset.zoneId ? document.querySelector<HTMLTemplateElement>(`template[data-zone-tpl="${step.dataset.zoneId}"]`) : null
    zoneBox.replaceChildren(...(tpl ? [tpl.content.cloneNode(true)] : []))

    const notes = section?.querySelectorAll('[data-day-notes] li') ?? []
    notesList.replaceChildren(...Array.from(notes, (n) => n.cloneNode(true)))
    notesBox.hidden = !notes.length
  }

  function setInert(on: boolean) {
    if (on) {
      inerted = Array.from(document.body.children).filter((el) => el !== root && !(el as HTMLElement).inert)
      inerted.forEach((el) => el.setAttribute('inert', ''))
    } else {
      inerted.forEach((el) => el.removeAttribute('inert'))
      inerted = []
    }
  }

  function show(step: HTMLButtonElement, from: HTMLElement) {
    fill(step)
    trigger = from
    window.clearTimeout(hideTimer)
    scroller.scrollTop = 0
    root.hidden = false
    document.documentElement.setAttribute('data-sheet-open', '')
    setInert(true)
    void sheet.offsetHeight // fija la posición cerrada antes de la transición
    root.setAttribute('data-open', '')
    open = true
    sheet.focus({ preventScroll: true })
    try {
      entry = String(Date.now())
      history.pushState({ sheet: entry }, '')
    } catch {
      // Sin historial: se cierra igual con el resto de gestos
    }
  }

  function hide() {
    if (!open) return
    open = false
    sheet.removeAttribute('data-dragging')
    sheet.style.transform = ''
    backdrop.style.opacity = ''
    root.removeAttribute('data-open')
    document.documentElement.removeAttribute('data-sheet-open')
    setInert(false)
    hideTimer = window.setTimeout(() => (root.hidden = true), reduceMotion() ? 200 : 300)
    if (trigger?.isConnected) trigger.focus({ preventScroll: true })
    if (entry && stateOf() === entry) history.back()
    entry = ''
  }

  window.addEventListener('popstate', () => {
    if (open) hide()
  })

  document.addEventListener('click', (e) => {
    const target = e.target as Element
    const step = target.closest<HTMLButtonElement>('[data-step-open]')
    if (step) return show(step, step)
    const row = target.closest<HTMLElement>('[data-now-row][data-step-ref]')
    const ref = row ? document.getElementById(row.dataset.stepRef ?? '') : null
    if (row && ref instanceof HTMLButtonElement) show(ref, row)
  })

  backdrop.addEventListener('click', hide)
  q('[data-sheet-close]').addEventListener('click', hide)
  doneBtn.addEventListener('click', () => {
    stepBox?.click()
    syncDone()
  })

  document.addEventListener('keydown', (e) => {
    if (!open) return
    if (e.key === 'Escape') {
      e.preventDefault()
      hide()
      return
    }
    if (e.key !== 'Tab') return
    const focusable = Array.from(sheet.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), summary')).filter(
      (el) => el.offsetParent !== null,
    )
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && (document.activeElement === first || document.activeElement === sheet)) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  })

  // «El lugar» al abrirse: si su cabecera queda en la mitad de abajo, sube hasta arriba de la
  // hoja para que se lea lo que se acaba de desplegar. Espera a que acabe la apertura (300 ms
  // en index.css): antes, el contenido aún no tiene su alto y el scroll se quedaría corto.
  scroller.addEventListener(
    'toggle',
    (e) => {
      const details = e.target as HTMLDetailsElement
      if (!details.matches('[data-place]') || !details.open) return
      const reduce = reduceMotion()
      window.setTimeout(() => {
        if (!open || !details.open) return
        const box = details.getBoundingClientRect()
        const view = scroller.getBoundingClientRect()
        const delta = box.top - view.top - 12
        if (delta > view.height * 0.4) scroller.scrollBy({ top: delta, behavior: reduce ? 'auto' : 'smooth' })
      }, reduce ? 0 : 300)
    },
    true,
  )

  /* ── Arrastrar para cerrar ─────────────────────────────────────────── */

  interface Drag {
    y0: number
    x0: number
    t0: number
    dy: number
    active: boolean
    fromGrab: boolean
    canDown: boolean
    ly: number
    lt: number
    v: number
  }
  let drag: Drag | null = null

  function start(y: number, x: number, fromGrab: boolean) {
    const t = performance.now()
    drag = { y0: y, x0: x, t0: t, dy: 0, active: false, fromGrab, canDown: fromGrab || scroller.scrollTop <= 0, ly: y, lt: t, v: 0 }
  }

  function move(y: number, x: number, ev: Event) {
    if (!drag) return
    const dy = y - drag.y0
    const dx = x - drag.x0
    if (!drag.active) {
      if (Math.abs(dy) < 6 && Math.abs(dx) < 6) return
      if ((dy > 0 && drag.canDown && Math.abs(dy) > Math.abs(dx)) || (drag.fromGrab && dy < 0)) {
        drag.active = true
        sheet.setAttribute('data-dragging', '')
      } else {
        drag = null
        return
      }
    }
    if (ev.cancelable) ev.preventDefault()
    const now = performance.now()
    drag.v = (y - drag.ly) / Math.max(1, now - drag.lt)
    drag.ly = y
    drag.lt = now
    // Hacia arriba, con resistencia; hacia abajo, 1:1 con el dedo
    drag.dy = dy > 0 ? dy : -Math.pow(-dy, 0.7)
    sheet.style.transform = `translate3d(0,${drag.dy}px,0)`
    backdrop.style.opacity = String(Math.max(0, 1 - Math.max(0, drag.dy) / (sheet.offsetHeight * 1.1)))
  }

  function end() {
    if (!drag) return
    const d = drag
    drag = null
    if (!d.active) return
    sheet.removeAttribute('data-dragging')
    const avg = d.dy / Math.max(1, performance.now() - d.t0)
    const fast = d.v > 0.5 || avg > 0.6
    if (d.dy > 0 && (d.dy > sheet.offsetHeight * 0.3 || (fast && d.dy > 24))) hide()
    else {
      sheet.style.transform = ''
      backdrop.style.opacity = ''
    }
  }

  sheet.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length > 1) {
        if (drag?.active) end()
        drag = null
        return
      }
      const t = e.touches[0]
      start(t.clientY, t.clientX, grab.contains(e.target as Node))
    },
    { passive: true },
  )
  sheet.addEventListener(
    'touchmove',
    (e) => {
      if (!drag || e.touches.length > 1) return
      move(e.touches[0].clientY, e.touches[0].clientX, e)
    },
    { passive: false },
  )
  sheet.addEventListener('touchend', end)
  sheet.addEventListener('touchcancel', end)

  // Ratón: se arrastra desde el asa
  grab.addEventListener('mousedown', (e) => {
    start(e.clientY, e.clientX, true)
    const mm = (ev: MouseEvent) => move(ev.clientY, ev.clientX, ev)
    const mu = () => {
      window.removeEventListener('mousemove', mm)
      window.removeEventListener('mouseup', mu)
      end()
    }
    window.addEventListener('mousemove', mm)
    window.addEventListener('mouseup', mu)
  })
}

// Módulo (no script global): sus constantes no chocan con las de los demás scripts
export {}
