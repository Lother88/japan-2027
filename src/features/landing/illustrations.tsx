/**
 * Ilustración isométrica de cada día (9–29), en su propio hueco de la cabecera del día.
 *
 * El arte es SVG generado con la skill anatomy-asset (./iso/dayNNIso.markup.ts) y se inserta
 * en línea, no como <img>, para que sus colores sigan el tema: cada marcado lleva un <style>
 * acotado a `.iso-dNN` con rampas para claro y [data-theme="dark"].
 *
 * Rendimiento:
 *  - Carga diferida: un `import()` por día (./iso/registry), lanzado cuando la sección se
 *    acerca al viewport (IntersectionObserver con 800 px de margen). Nada de este arte va
 *    en el chunk principal.
 *  - Sin saltos de maquetación: la caja se reserva desde el principio con aspect-ratio
 *    440/330 (el viewBox común) y el SVG la rellena al llegar.
 *  - content-visibility:auto en la caja (su tamaño ya es fijo): el navegador se salta el
 *    render de los ~1 500 nodos de cada dibujo mientras está fuera de pantalla. Se aplica
 *    a la caja y no a la sección entera porque, con secciones de altura estimada, el
 *    progreso del rail y scrollToDay (que miden getBoundingClientRect) saltarían.
 *  - El movimiento ambiental (CSS dentro del SVG) se pausa con `data-paused` cuando la caja
 *    no se ve, y se detiene del todo con prefers-reduced-motion.
 *
 * Es decorativa: aria-hidden y sin foco.
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { pickIllustration, type IllustrationKind } from '@/features/landing/illustrationKind'
import { isoLoaders, type IsoArt } from '@/features/landing/iso/registry'

/** Distancia al viewport a la que empieza la descarga del dibujo. */
const PRELOAD_MARGIN = '800px 0px'

/** Proporción del viewBox común de los dibujos (440×330). */
const ASPECT = '440 / 330'

interface DayIllustrationProps {
  /** Día del itinerario; si no tiene dibujo, no se renderiza nada. */
  day: number
  /** Tamaño/colocación que decide el contenedor (p. ej. el ancho en la cabecera). */
  style?: CSSProperties
}

export function DayIllustration({ day, style }: DayIllustrationProps) {
  const kind = pickIllustration(day)
  if (!kind) return null
  return <IsoIllustration kind={kind} style={style} />
}

interface IsoIllustrationProps {
  kind: IllustrationKind
  style?: CSSProperties
}

function IsoIllustration({ kind, style }: IsoIllustrationProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState<{ kind: IllustrationKind; art: IsoArt } | null>(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let cancelled = false

    const load = () => {
      isoLoaders[kind]().then(
        (art) => {
          if (!cancelled) setLoaded({ kind, art })
        },
        () => {
          // Sin red o chunk caducado: la caja reservada queda vacía (es decorativa).
        },
      )
    }

    // Sin IntersectionObserver (entornos antiguos o de test): carga directa.
    if (typeof IntersectionObserver === 'undefined') {
      load()
      return () => {
        cancelled = true
      }
    }

    const near = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          near.disconnect()
          load()
        }
      },
      { rootMargin: PRELOAD_MARGIN },
    )
    const visible = new IntersectionObserver((entries) => {
      const last = entries[entries.length - 1]
      if (last) setPaused(!last.isIntersecting)
    })
    near.observe(el)
    visible.observe(el)

    return () => {
      cancelled = true
      near.disconnect()
      visible.disconnect()
    }
  }, [kind])

  const art = loaded?.kind === kind ? loaded.art : null

  return (
    <div
      ref={ref}
      data-illus
      data-paused={paused ? '' : undefined}
      aria-hidden="true"
      style={{
        aspectRatio: ASPECT,
        width: '100%',
        contentVisibility: 'auto',
        // content-visibility implica contención de pintura: sin margen recortaría el halo
        // difuminado del zócalo (y los pocos px que algún dibujo sobresale del viewBox).
        overflowClipMargin: '24px',
        pointerEvents: 'none',
        ...style,
      }}
    >
      {art && (
        <svg
          className={kind}
          viewBox={art.viewBox}
          aria-hidden="true"
          focusable="false"
          preserveAspectRatio="xMidYMid meet"
          style={{ display: 'block', width: '100%', height: '100%', overflow: 'visible' }}
          dangerouslySetInnerHTML={{ __html: art.markup }}
        />
      )}
    </div>
  )
}
