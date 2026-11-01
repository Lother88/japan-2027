/**
 * Hooks del arte isométrico de la portada (sin JSX, para `react-refresh/only-export-components`).
 */
import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react'

/** Distancia al viewport a la que empieza la descarga del arte diferido. */
export const DEFER_MARGIN = '600px 0px'

/** Por debajo de este ancho el arte del hero va encima del título, con el viewBox recortado. */
export const HERO_MOBILE_QUERY = '(max-width: 760px)'

/**
 * true cuando el elemento está a menos de DEFER_MARGIN del viewport (y desde entonces, siempre).
 * Con `enabled = false`, o sin IntersectionObserver (entornos antiguos o de test), es true ya.
 */
export function useNearViewport(ref: RefObject<Element | null>, enabled = true): boolean {
  const [near, setNear] = useState(() => !enabled || typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const el = ref.current
    if (near || !el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect()
          setNear(true)
        }
      },
      { rootMargin: DEFER_MARGIN },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, near])

  return near
}

/**
 * Carga un arte con `load` (un `import()` envuelto). Con `defer`, espera a que la caja se
 * acerque al viewport (useNearViewport); sin él, carga al montar.
 * Si falla la red, devuelve null: la caja reservada queda vacía (es decorativa).
 */
export function useLazyArt<T>(ref: RefObject<Element | null>, load: () => Promise<T>, defer = false): T | null {
  const [loaded, setLoaded] = useState<{ load: () => Promise<T>; art: T } | null>(null)
  const near = useNearViewport(ref, defer)

  useEffect(() => {
    if (!near) return
    let cancelled = false
    load().then(
      (art) => {
        if (!cancelled) setLoaded({ load, art })
      },
      () => {
        // Sin red o chunk caducado: la caja reservada queda vacía.
      },
    )
    return () => {
      cancelled = true
    }
  }, [near, load])

  return loaded?.load === load ? loaded.art : null
}

/**
 * true mientras el elemento está fuera de pantalla. Quien lo usa pone `data-art-paused` y
 * index.css congela las animaciones de dentro (`animation-play-state: paused`).
 */
export function usePausedOffscreen(ref: RefObject<Element | null>, enabled = true): boolean {
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!enabled || !el || typeof IntersectionObserver === 'undefined') return
    const visible = new IntersectionObserver((entries) => {
      const last = entries[entries.length - 1]
      if (last) setPaused(!last.isIntersecting)
    })
    visible.observe(el)
    return () => visible.disconnect()
  }, [ref, enabled])

  return enabled && paused
}

function subscribeHeroMobile(onChange: () => void): () => void {
  const mql = window.matchMedia(HERO_MOBILE_QUERY)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

const readHeroMobile = () => window.matchMedia(HERO_MOBILE_QUERY).matches

/**
 * Si el hero está en su composición móvil. Se lee de forma síncrona en el primer render
 * (useSyncExternalStore), así que el viewBox y la proporción reservada salen bien a la
 * primera: sin parpadeo ni salto al montar.
 */
export function useHeroMobile(): boolean {
  return useSyncExternalStore(subscribeHeroMobile, readHeroMobile, () => false)
}
