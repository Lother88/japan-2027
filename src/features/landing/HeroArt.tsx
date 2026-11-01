/**
 * HeroArt — la maqueta isométrica del hero («Maqueta de tren al pie del Fuji»).
 *
 * - El marcado (~250 KB sin comprimir) viaja en su propio chunk (hero-art/heroChunk), que Hero
 *   pide al evaluarse; el H1 sigue siendo el LCP.
 * - La caja reserva la proporción del viewBox desde el primer render: la llegada del SVG no
 *   provoca saltos de maquetación.
 * - Escritorio: lienzo 1200×640 con el arte a la derecha y la zona segura (x 0–470) libre para
 *   el titular, que Hero superpone. Móvil (≤ 760 px): viewBox recortado al arte, encima del título.
 * - Va por capas: un div.iso-hero con el <style> común una sola vez y un <svg class="hero-layer
 *   hero-layer-{name}"> por capa, de atrás adelante y con el mismo viewBox. Solo las capas que se
 *   mueven animan (transform/opacity sobre su propio <svg>), así que el navegador las compone sin
 *   repintar el dibujo entero. Sus desplazamientos y pivotes van en % de la caja y dependen del
 *   recorte: con el viewBox móvil, el contenedor lleva data-crop="mobile".
 * - Las animaciones las pausa Hero (data-art-paused) cuando la portada sale de pantalla.
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
  const viewBox = art ? (mobile ? art.viewBoxMobile : art.viewBox) : undefined

  return (
    <div ref={ref} data-hero-art aria-hidden="true" style={{ aspectRatio: mobile ? RATIO_MOBILE : RATIO_DESKTOP }}>
      {art && (
        <div className="iso-hero" data-crop={mobile ? 'mobile' : undefined} style={{ width: '100%', height: '100%' }}>
          <style dangerouslySetInnerHTML={{ __html: art.style }} />
          {art.layers.map((layer) => (
            <svg
              key={layer.name}
              className={`hero-layer hero-layer-${layer.name}`}
              viewBox={viewBox}
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
              focusable="false"
              dangerouslySetInnerHTML={{ __html: layer.markup }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
