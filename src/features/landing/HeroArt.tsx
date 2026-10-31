/**
 * HeroArt — la maqueta isométrica del hero («Maqueta de tren al pie del Fuji»).
 *
 * - El marcado (~250 KB sin comprimir) viaja en su propio chunk (hero-art/heroChunk), que Hero
 *   pide al evaluarse; el H1 sigue siendo el LCP.
 * - La caja reserva la proporción del viewBox desde el primer render: la llegada del SVG no
 *   provoca saltos de maquetación.
 * - Escritorio: lienzo 1200×640 con el arte a la derecha y la zona segura (x 0–470) libre para
 *   el titular, que Hero superpone. Móvil (≤ 760 px): viewBox recortado al arte, encima del título.
 * - Las animaciones (CSS dentro del SVG) las pausa Hero cuando la portada sale de pantalla.
 *
 * Es decorativa: aria-hidden y sin foco.
 */
import { useRef } from 'react'
import { loadHeroScene } from '@/features/landing/hero-art/registry'
import { useHeroMobile, useLazyArt } from '@/features/landing/hero-art/useLazyArt'

/** Proporción reservada para cada viewBox (debe coincidir con heroMaqueta.markup.ts). */
const RATIO_DESKTOP = '1200 / 640'
const RATIO_MOBILE = '676 / 478'

export default function HeroArt() {
  const ref = useRef<HTMLDivElement>(null)
  const art = useLazyArt(ref, loadHeroScene)
  const mobile = useHeroMobile()

  return (
    <div ref={ref} data-hero-art aria-hidden="true" style={{ aspectRatio: mobile ? RATIO_MOBILE : RATIO_DESKTOP }}>
      {art && (
        <svg
          className="iso-hero"
          viewBox={mobile ? art.viewBoxMobile : art.viewBox}
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
