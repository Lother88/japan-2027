/**
 * App — landing del itinerario "Japón 2027" (página única de scroll).
 *
 * Composición del diseño: hero isométrico (maqueta de tren al pie del Fuji) · banda «La ruta»
 * con el mapa · journey (rail sticky + secciones por día) · footer · botón para volver arriba ·
 * toggle flotante de tema claro/oscuro. Un skip-link («Saltar al itinerario») abre la
 * página y un único <main> envuelve el hero, la ruta y el journey. Todo dentro del proveedor de tema, que
 * gestiona `data-theme` y la transición de círculo (View Transitions) al cambiar de tema.
 */
import { ThemeModeProvider } from '@/features/landing/ThemeModeProvider'
import Hero from '@/features/landing/Hero'
import RouteSection from '@/features/landing/RouteSection'
import Journey from '@/features/landing/Journey'
import SiteFooter from '@/features/landing/SiteFooter'
import ToTop from '@/features/landing/ToTop'
import ThemeToggle from '@/features/landing/ThemeToggle'

export default function App() {
  return (
    <ThemeModeProvider>
      <a className="skip-link" href="#itinerario">
        Saltar al itinerario
      </a>
      <main>
        <Hero />
        <RouteSection />
        <Journey />
      </main>
      <SiteFooter />
      <ToTop />
      <ThemeToggle />
    </ThemeModeProvider>
  )
}
