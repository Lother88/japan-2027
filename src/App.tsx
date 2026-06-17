/**
 * App — landing del itinerario "Japón 2027" (página única de scroll).
 *
 * Composición del diseño: pétalos de sakura de fondo · nav superior · hero con
 * mapa de la ruta · journey (rail sticky + secciones por día) · footer · botón
 * para volver arriba.
 */
import SakuraPetals from '@/features/landing/SakuraPetals'
import SiteNav from '@/features/landing/SiteNav'
import Hero from '@/features/landing/Hero'
import Journey from '@/features/landing/Journey'
import SiteFooter from '@/features/landing/SiteFooter'
import ToTop from '@/features/landing/ToTop'

export default function App() {
  return (
    <>
      <SakuraPetals />
      <SiteNav />
      <Hero />
      <Journey />
      <SiteFooter />
      <ToTop />
    </>
  )
}
