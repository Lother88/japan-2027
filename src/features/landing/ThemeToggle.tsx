/**
 * ThemeToggle — botón flotante (abajo-izquierda) para alternar claro/oscuro.
 *
 * Dentro lleva el spot isométrico de un tōrō (32 px): apagado en claro y encendido en oscuro.
 * El aspecto según el tema lo pone el CSS del propio SVG (`[data-theme="dark"] .iso-spot-toro-toggle`),
 * sin intercambiar iconos. Al pulsar, dispara la transición de tema con el propio botón como origen.
 */
import LazyIso from '@/features/landing/hero-art/LazyIso'
import { heroSpotLoaders } from '@/features/landing/hero-art/registry'
import { useThemeMode } from '@/features/landing/useThemeMode'

export default function ThemeToggle() {
  const { mode, toggle } = useThemeMode()
  // El nombre accesible describe la acción (no el estado): «Activar tema oscuro/claro».
  const label = mode === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro'

  return (
    <button
      type="button"
      data-ttoggle
      onClick={e => toggle(e.currentTarget)}
      aria-label={label}
      title={label}
      style={{
        position: 'fixed',
        bottom: '26px',
        left: '26px',
        zIndex: 85,
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--surface)',
        color: 'var(--ink)',
        border: '1px solid var(--border)',
        boxShadow: '0 8px 22px -10px rgba(0,0,0,.4)',
        cursor: 'pointer',
      }}
    >
      <LazyIso
        load={heroSpotLoaders['toro-toggle']}
        artClass="iso-spot-toro-toggle"
        slot="toggle"
        style={{ width: '32px', height: '32px' }}
      />
    </button>
  )
}
