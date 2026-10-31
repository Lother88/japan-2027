/**
 * LazyIso — un spot isométrico en línea dentro de una caja de tamaño fijo.
 *
 * La caja (span, válida dentro de botones y casillas) reserva el tamaño desde el primer render,
 * así que la llegada del SVG no mueve nada. El marcado se inserta con su <style> acotado a
 * `artClass`, de modo que sigue el tema sin JS. Es decorativo: aria-hidden y sin foco.
 */
import { useRef, type CSSProperties } from 'react'
import type { SpotArt } from './registry'
import { useLazyArt, usePausedOffscreen } from './useLazyArt'

interface LazyIsoProps {
  /** Cargador estable (definido fuera del componente). */
  load: () => Promise<SpotArt>
  /** Clase raíz del asset (`iso-spot-…`, `iso-banda`): acota su <style>. */
  artClass: string
  /** Nombre del hueco; va en `data-art` (lo usan index.css y los tests). */
  slot: string
  /** Espera a que la caja se acerque al viewport antes de descargar el arte. */
  defer?: boolean
  /** Congela sus animaciones mientras la caja no se ve. */
  pauseOffscreen?: boolean
  preserveAspectRatio?: string
  /** Tamaño y colocación de la caja. */
  style?: CSSProperties
}

export default function LazyIso({
  load,
  artClass,
  slot,
  defer = false,
  pauseOffscreen = false,
  preserveAspectRatio = 'xMidYMid meet',
  style,
}: LazyIsoProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const art = useLazyArt(ref, load, defer)
  const paused = usePausedOffscreen(ref, pauseOffscreen)

  return (
    <span
      ref={ref}
      data-art={slot}
      data-art-paused={paused ? '' : undefined}
      aria-hidden="true"
      style={{ display: 'block', flex: 'none', pointerEvents: 'none', ...style }}
    >
      {art && (
        <svg
          className={artClass}
          viewBox={art.viewBox}
          aria-hidden="true"
          focusable="false"
          preserveAspectRatio={preserveAspectRatio}
          // `slice` recorta a propósito (la banda sangra por los lados); el resto deja ver el
          // halo del zócalo, que sobresale unos px del viewBox.
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            overflow: preserveAspectRatio.includes('slice') ? 'hidden' : 'visible',
          }}
          dangerouslySetInnerHTML={{ __html: art.markup }}
        />
      )}
    </span>
  )
}
