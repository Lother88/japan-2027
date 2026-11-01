/**
 * reveal — aparición suave de los bloques del itinerario (`[data-reveal]`) al entrar en pantalla.
 *
 * El HTML sale con todo visible (sin JS no se oculta nada). Este script solo esconde lo que
 * NO se ve al cargar: lo que ya está en pantalla (p. ej. al abrir un enlace `#dia-NN`) se
 * queda como está, sin parpadeos ni animación. Lo escondido (`data-reveal="out"`: opacity 0 +
 * 16 px abajo) se revela al entrar (`data-reveal="in"`, transición de 600 ms en index.css).
 * Escalonado por lote: solo los que entran en el mismo callback, 50 ms por posición en orden
 * de documento (tope 200 ms); uno que entra solo no espera.
 * Con reduce-motion no se hace nada (todo visible desde el principio).
 */
const STAGGER_MS = 50
const MAX_STEPS = 4

const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))

const byDocumentOrder = (a: Element, b: Element) =>
  a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1

if (items.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const reveal = new IntersectionObserver(
    (entries) => {
      entries
        .filter((en) => en.isIntersecting)
        .map((en) => en.target as HTMLElement)
        .sort(byDocumentOrder)
        .forEach((el, i) => {
          reveal.unobserve(el)
          window.setTimeout(() => (el.dataset.reveal = 'in'), Math.min(i, MAX_STEPS) * STAGGER_MS)
        })
    },
    { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
  )

  // Primera medida (sin margen): lo que asoma aunque sea un píxel se queda visible.
  const initial = new IntersectionObserver((entries) => {
    for (const en of entries) {
      initial.unobserve(en.target)
      if (en.isIntersecting) continue
      ;(en.target as HTMLElement).dataset.reveal = 'out'
      reveal.observe(en.target)
    }
  })
  items.forEach((el) => initial.observe(el))
}
