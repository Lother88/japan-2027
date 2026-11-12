/**
 * place — «El lugar» bajo demanda: el contexto cultural de cada zona no va en el HTML.
 *
 * ZoneCard pinta el <details data-place data-place-src="/contexto/<zona>.json"> plegado y con
 * el cuerpo vacío (anti-spoiler: nunca se abre solo). Al tocar su <summary> para desplegarlo,
 * se pide ese JSON (pages/contexto/[zone].json.ts) y se pintan las fichas (qué es, historia,
 * significado, curiosidades y fuentes). Se escucha el `click` (llega antes de que el <details>
 * se abra), así que si el JSON ya está en memoria el contenido entra antes de la animación de
 * apertura y esta crece hasta su alto real; si no, se ve «Cargando…» mientras llega.
 *
 * Caché en memoria por URL (promesa compartida: dos toques no piden dos veces). Un fallo no se
 * guarda: el cuerpo muestra un aviso corto y «Reintentar», que vuelve a pedirlo. Lo práctico
 * de la zona (acceso, horario, notas) y el enlace de Maps siguen en línea: sin conexión, lo
 * esencial funciona igual.
 *
 * Precarga: en un momento ocioso (requestIdleCallback; sin él, un setTimeout tras la carga),
 * si hoy es un día del viaje (day-plan.ts marca su chip con `data-today`) y la conexión lo
 * permite (sin `saveData` ni 2G), se piden los JSON de las zonas de hoy con prioridad baja.
 */
import type { ContextEntry } from '@/data/context'

type Entries = readonly ContextEntry[]

const pending = new Map<string, Promise<Entries>>()
const ready = new Map<string, Entries>()

function load(src: string, priority: RequestPriority = 'auto'): Promise<Entries> {
  let p = pending.get(src)
  if (!p) {
    p = fetch(src, { priority }).then(async (res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as Entries
      ready.set(src, data)
      return data
    })
    pending.set(src, p)
    // Un fallo no se queda en caché: el siguiente intento vuelve a pedirlo
    const mine = p
    mine.catch(() => {
      if (pending.get(src) === mine) pending.delete(src)
    })
  }
  return p
}

/* ── Pintado ────────────────────────────────────────────────────────────── */

function el<K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, attr?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag)
  if (text !== undefined) node.textContent = text
  if (attr) node.setAttribute(attr, '')
  return node
}

function list(items: readonly string[]) {
  const ul = el('ul')
  ul.append(...items.map((t) => el('li', t)))
  return ul
}

function renderEntries(body: HTMLElement, entries: Entries) {
  body.replaceChildren(
    ...entries.map((poi) => {
      const art = el('article', undefined, 'data-poi')
      art.append(el('h4', poi.nombre), el('h5', 'Qué es'), el('p', poi.queEs), el('h5', 'Historia'), el('p', poi.historia))
      if (poi.significado) art.append(el('h5', 'Significado'), el('p', poi.significado))
      if (poi.curiosidades.length) art.append(el('h5', 'Curiosidades'), list(poi.curiosidades))
      if (poi.fuentes.length) {
        const ul = el('ul', undefined, 'data-poi-sources')
        ul.append(
          ...poi.fuentes.map((f) => {
            const a = el('a', f.label)
            a.href = f.url
            a.target = '_blank'
            a.rel = 'noopener'
            const li = el('li')
            li.append(a)
            return li
          }),
        )
        art.append(el('h5', 'Fuentes'), ul)
      }
      return art
    }),
  )
  body.dataset.state = 'ready'
}

function renderLoading(body: HTMLElement) {
  body.replaceChildren(el('p', 'Cargando…', 'data-place-status'))
  body.dataset.state = 'loading'
}

function renderError(body: HTMLElement) {
  const box = el('div', undefined, 'data-place-error')
  const retry = el('button', 'Reintentar', 'data-place-retry')
  retry.type = 'button'
  box.append(el('p', 'No se ha podido cargar. Revisa la conexión e inténtalo de nuevo.'), retry)
  body.replaceChildren(box)
  body.dataset.state = 'error'
}

/** Rellena el cuerpo de un «El lugar»: al momento si ya está en memoria, si no lo pide. */
function fill(details: HTMLElement, focusAfter = false) {
  const src = details.dataset.placeSrc
  const body = details.querySelector<HTMLElement>('[data-place-body]')
  if (!src || !body || body.dataset.state === 'ready' || body.dataset.state === 'loading') return
  const cached = ready.get(src)
  if (cached) return renderEntries(body, cached)
  renderLoading(body)
  load(src).then(
    (entries) => {
      if (body.isConnected) renderEntries(body, entries)
    },
    () => {
      if (!body.isConnected) return
      renderError(body)
      // Tras «Reintentar» fallido, el foco vuelve al nuevo botón (el anterior ya no existe)
      if (focusAfter) body.querySelector<HTMLElement>('[data-place-retry]')?.focus({ preventScroll: true })
    },
  )
}

document.addEventListener('click', (e) => {
  const target = e.target as Element
  const summary = target.closest('[data-place] > summary')
  if (summary) {
    const details = summary.parentElement as HTMLDetailsElement
    if (!details.open) fill(details)
    return
  }
  const retry = target.closest('[data-place-retry]')
  const details = retry?.closest<HTMLElement>('[data-place]')
  if (details) fill(details, true)
})

// Red de seguridad: si el <details> se abre sin pasar por el clic (p. ej. desde JS)
document.addEventListener(
  'toggle',
  (e) => {
    const details = e.target as HTMLDetailsElement
    if (details.open && details.matches('[data-place]')) fill(details)
  },
  true,
)

/* ── Precarga de las zonas de hoy ───────────────────────────────────────── */

function connectionAllows() {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  return !conn?.saveData && !/2g/.test(conn?.effectiveType ?? '')
}

function prefetchToday() {
  if (!connectionAllows()) return
  const day = document.querySelector<HTMLElement>('[data-strip-chip][data-today]')?.dataset.stripDay
  if (!day) return
  const zones = new Set(
    Array.from(document.querySelectorAll<HTMLElement>(`[data-day="${day}"] [data-step-open][data-zone-id]`), (b) => b.dataset.zoneId ?? ''),
  )
  zones.forEach((id) => {
    const tpl = document.querySelector<HTMLTemplateElement>(`template[data-zone-tpl="${id}"]`)
    const src = tpl?.content.querySelector<HTMLElement>('[data-place]')?.dataset.placeSrc
    if (src) load(src, 'low').catch(() => {})
  })
}

function whenIdle(fn: () => void) {
  if ('requestIdleCallback' in window) requestIdleCallback(fn, { timeout: 4000 })
  else setTimeout(fn, 2000)
}

if (document.readyState === 'complete') whenIdle(prefetchToday)
else window.addEventListener('load', () => whenIdle(prefetchToday), { once: true })
