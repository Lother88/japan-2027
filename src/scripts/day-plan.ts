/**
 * day-plan — el plan de cada día mientras se viaja: pasos hechos y «Ahora / Después».
 *
 * Pasos hechos: cada casilla [data-step-done="AAAA-MM-DD#i"] (role=checkbox) se guarda en
 * localStorage['jp-done'] (un objeto { clave: 1 }). Todo acceso va en try/catch: sin storage
 * (modo privado, bloqueado) las casillas siguen funcionando en memoria. El contador «N de M
 * hechos» de cada día se actualiza con ellas. La hoja de cada paso (sheet.ts) reutiliza estas
 * casillas: su «Marcar como hecho» hace clic en la del paso.
 *
 * Hoy: la fecha y la hora salen del reloj de Japón (Intl.DateTimeFormat, zona Asia/Tokyo).
 * Vista previa con ?hoy=2027-05-20&hora=09:40 (cualquiera de los dos; el otro sale del reloj),
 * con una marca «vista previa» que enlaza a la página sin parámetros. Si hoy es un día del
 * viaje:
 *  - su sección muestra la tarjeta «Ahora / Después» (pre-renderizada y oculta en cada día):
 *    el paso en curso, el siguiente con su cuenta atrás («en 35 min») y, al tocarlas, la hoja
 *    del paso (sheet.ts sigue `data-step-ref` hasta el botón del paso);
 *  - en la línea de tiempo, `data-state` = now / next / past en cada paso, y `data-past` en
 *    las secciones y chips de los días anteriores; `data-today` en el chip de hoy;
 *  - al cargar (sin #ancla en la URL) baja a hoy: en móvil, a la cabecera del día (la
 *    ilustración es decorativa y así la tarjeta «Ahora» entra en la primera pantalla).
 * Las horas vagas cuentan como mañana 09:00, tarde 15:00 y noche 20:30; si una hora no
 * avanza respecto a la anterior, se le suma media hora (el orden de la lista manda).
 * Con reloj real, se refresca cada 30 s (cambia el minuto, o el día a medianoche).
 */

const STORE_KEY = 'jp-done'
const FUZZY: Record<string, number> = { mañana: 9 * 60, tarde: 15 * 60, noche: 20 * 60 + 30 }

type DoneMap = Record<string, 1>

function readDone(): DoneMap {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORE_KEY) ?? '{}')
    return parsed && typeof parsed === 'object' ? (parsed as DoneMap) : {}
  } catch {
    return {}
  }
}

function writeDone(map: DoneMap) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(map))
  } catch {
    // Sin storage: el estado vive en memoria hasta recargar
  }
}

const done = readDone()
const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-day]'))
const chips = Array.from(document.querySelectorAll<HTMLElement>('[data-strip-chip]'))

/* ── Pasos hechos ───────────────────────────────────────────────────────── */

function setChecked(box: HTMLElement, on: boolean) {
  box.setAttribute('aria-checked', String(on))
  box.closest('[data-step]')?.toggleAttribute('data-done', on)
}

function updateCount(section: HTMLElement) {
  const boxes = section.querySelectorAll('[data-step-done]')
  const count = section.querySelectorAll('[data-step-done][aria-checked="true"]').length
  const out = section.querySelector('[data-done-count]')
  if (out) out.textContent = `${count} de ${boxes.length} hechos`
}

sections.forEach((section) => {
  let any = false
  section.querySelectorAll<HTMLElement>('[data-step-done]').forEach((box) => {
    if (done[box.dataset.stepDone ?? '']) {
      setChecked(box, true)
      any = true
    }
  })
  if (any) updateCount(section)
})

document.querySelector('[data-journey]')?.addEventListener('click', (e) => {
  const box = (e.target as Element).closest<HTMLElement>('[data-step-done]')
  if (!box) return
  const key = box.dataset.stepDone ?? ''
  const on = box.getAttribute('aria-checked') !== 'true'
  if (on) done[key] = 1
  else delete done[key]
  writeDone(done)
  setChecked(box, on)
  const section = box.closest<HTMLElement>('[data-day]')
  if (section) updateCount(section)
})

/* ── Reloj de Japón y vista previa ──────────────────────────────────────── */

const params = new URLSearchParams(location.search)
const previewDate = /^\d{4}-\d{2}-\d{2}$/.test(params.get('hoy') ?? '') ? params.get('hoy') : null
const previewTime = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(params.get('hora') ?? '')
const previewMin = previewTime ? Number(previewTime[1]) * 60 + Number(previewTime[2]) : null
const isPreview = previewDate !== null || previewMin !== null

const pad = (n: number) => String(n).padStart(2, '0')

let tokyo: Intl.DateTimeFormat | null = null
try {
  tokyo = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })
} catch {
  // Sin datos de zonas horarias: reloj local
}

/** Fecha ISO y minuto del día en Japón (o los de la vista previa). */
function clock(): { iso: string; min: number } {
  const now = new Date()
  let iso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  let min = now.getHours() * 60 + now.getMinutes()
  if (tokyo) {
    const p: Record<string, string> = {}
    for (const part of tokyo.formatToParts(now)) p[part.type] = part.value
    iso = `${p.year}-${p.month}-${p.day}`
    min = (Number(p.hour) % 24) * 60 + Number(p.minute)
  }
  return { iso: previewDate ?? iso, min: previewMin ?? min }
}

/* ── Hoy ────────────────────────────────────────────────────────────────── */

interface StepInfo {
  li: HTMLElement
  button: HTMLButtonElement
  time: string
  exact: boolean
  min: number
  label: string
}

function readSteps(section: HTMLElement): StepInfo[] {
  let prev = -1
  return Array.from(section.querySelectorAll<HTMLElement>('[data-step]')).map((li) => {
    const button = li.querySelector<HTMLButtonElement>('[data-step-open]')!
    const time = button.dataset.time ?? ''
    const m = /^(\d{1,2}):(\d{2})$/.exec(time)
    let min = m ? Number(m[1]) * 60 + Number(m[2]) : (FUZZY[time] ?? prev + 60)
    if (!m && min <= prev) min = prev + 30
    prev = min
    return { li, button, time, exact: !!m, min, label: li.querySelector('[data-step-label]')?.textContent ?? '' }
  })
}

function inMinutes(m: number): string {
  if (m < 1) return 'ahora'
  if (m < 60) return `en ${m} min`
  const h = Math.floor(m / 60)
  const r = m % 60
  return `en ${h} h${r ? ` ${r} min` : ''}`
}

const timeWord = (t: string) => (t === 'mañana' ? 'por la mañana' : t === 'tarde' ? 'por la tarde' : t === 'noche' ? 'por la noche' : `a las ${t}`)

function text(root: Element, selector: string, value: string) {
  const el = root.querySelector(selector)
  if (el) el.textContent = value
}

/** Rellena una fila de la tarjeta (botón que abre la hoja del paso). */
function fillRow(row: HTMLElement | null, step: StepInfo | undefined, key: string | null, when: string) {
  if (!row) return
  row.hidden = !step
  if (!step) return
  row.dataset.stepRef = step.button.id
  if (key !== null) text(row, '[data-now-k]', key)
  text(row, '[data-now-l]', step.label)
  text(row, '[data-now-t]', when)
}

let todaySection: HTMLElement | undefined

function paintToday(section: HTMLElement, min: number) {
  const steps = readSteps(section)
  let now = -1
  steps.forEach((s, i) => {
    if (s.min <= min) now = i
  })
  const next = now + 1 < steps.length ? now + 1 : -1

  steps.forEach((s, i) => {
    const state = i === now ? 'now' : i === next ? 'next' : i < now ? 'past' : undefined
    if (state) s.li.dataset.state = state
    else delete s.li.dataset.state
    const flag = s.li.querySelector<HTMLElement>('[data-step-flag]')
    if (!flag) return
    flag.hidden = state !== 'now' && state !== 'next'
    flag.textContent = state === 'now' ? 'Ahora' : state === 'next' ? `Siguiente${s.exact ? ` · ${inMinutes(s.min - min)}` : ''}` : ''
  })

  const card = section.querySelector<HTMLElement>('[data-now]')
  if (!card) return
  const sNow = steps[now]
  const sNext = steps[next]
  fillRow(card.querySelector('[data-now-row="now"]'), sNow, null, sNow ? (sNow.exact ? `desde ${sNow.time}` : sNow.time) : '')
  fillRow(
    card.querySelector('[data-now-row="next"]'),
    sNext,
    sNext ? `${now >= 0 ? 'Después' : 'Lo primero'}${sNext.exact ? ` · ${sNext.time}` : ''}` : '',
    sNext ? (sNext.exact ? inMinutes(sNext.min - min) : timeWord(sNext.time)) : '',
  )
  const end = card.querySelector<HTMLElement>('[data-now-row="end"]')
  if (end) end.hidden = !(sNow && !sNext)
  text(card, '[data-now-clock]', `${pad(Math.floor(min / 60))}:${pad(min % 60)}`)
  const badge = card.querySelector<HTMLAnchorElement>('[data-now-preview]')
  if (badge && isPreview) {
    badge.hidden = false
    badge.href = location.pathname
    badge.setAttribute('aria-label', 'Vista previa: salir y volver a la hora real')
  }
  card.hidden = steps.length === 0
}

function clearToday(section: HTMLElement) {
  section.querySelectorAll<HTMLElement>('[data-step][data-state]').forEach((li) => delete li.dataset.state)
  section.querySelectorAll<HTMLElement>('[data-step-flag]').forEach((f) => (f.hidden = true))
  const card = section.querySelector<HTMLElement>('[data-now]')
  if (card) card.hidden = true
}

function refresh(): HTMLElement | undefined {
  const { iso, min } = clock()
  const section = sections.find((s) => s.dataset.date === iso)
  if (todaySection && todaySection !== section) clearToday(todaySection)
  todaySection = section

  sections.forEach((s) => s.toggleAttribute('data-past', (s.dataset.date ?? '') < iso))
  chips.forEach((c, i) => {
    const date = sections[i]?.dataset.date ?? ''
    c.toggleAttribute('data-past', date < iso)
    const isToday = date === iso
    if (isToday !== c.hasAttribute('data-today')) {
      c.toggleAttribute('data-today', isToday)
      const label = c.getAttribute('aria-label') ?? ''
      c.setAttribute('aria-label', isToday ? `${label}, hoy` : label.replace(/, hoy$/, ''))
    }
  })

  if (section) paintToday(section, min)
  return section
}

const today = refresh()

if (today && !location.hash) {
  const mobile = window.matchMedia('(max-width: 860px)').matches
  const target = (mobile && today.querySelector<HTMLElement>('[data-day-head]')) || today
  try {
    history.scrollRestoration = 'manual'
  } catch {
    // Navegadores que no lo permiten: el salto de abajo manda igualmente
  }
  target.scrollIntoView({ block: 'start' })
}

if (previewMin === null) {
  let last = ''
  window.setInterval(() => {
    const { iso, min } = clock()
    const stamp = `${iso} ${min}`
    if (stamp === last) return
    last = stamp
    refresh()
  }, 30_000)
}

// Módulo (no script global): sus constantes no chocan con las de los demás scripts
export {}
