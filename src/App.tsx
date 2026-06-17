/**
 * App — landing del itinerario "Japón 2027" (página única de scroll).
 *
 * Composición del diseño: pétalos de sakura de fondo · hero con mapa de la ruta ·
 * journey (rail sticky + secciones por día) · footer · botón para volver arriba ·
 * toggle flotante de tema claro/oscuro. Todo dentro del proveedor de tema, que
 * gestiona `data-theme` y la animación de abanico al cambiar de tema.
 */
import { ThemeModeProvider } from '@/features/landing/ThemeModeProvider'
import SakuraPetals from '@/features/landing/SakuraPetals'
import Hero from '@/features/landing/Hero'
import Journey from '@/features/landing/Journey'
import SiteFooter from '@/features/landing/SiteFooter'
import ToTop from '@/features/landing/ToTop'
import ThemeToggle from '@/features/landing/ThemeToggle'

export default function App() {
  return (
    <ThemeModeProvider>
      <SakuraPetals />
      <Hero />
      <Journey />
      <SiteFooter />
      <ToTop />
      <ThemeToggle />
    </ThemeModeProvider>
  )
}
