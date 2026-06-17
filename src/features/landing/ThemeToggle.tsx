/**
 * ThemeToggle — botón flotante (abajo-izquierda) para alternar claro/oscuro.
 *
 * Muestra luna (acción: ir a oscuro) en tema claro y sol en tema oscuro; el
 * intercambio de icono lo controla index.css vía `[data-theme]`. Al pulsar,
 * dispara la animación de abanico de useThemeMode.
 */
import { useThemeMode } from '@/features/landing/useThemeMode'

export default function ThemeToggle() {
  const { toggle } = useThemeMode()

  return (
    <button
      type="button"
      data-ttoggle
      onClick={toggle}
      aria-label="Cambiar tema"
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
        transition: 'background .3s, color .3s, border-color .3s',
      }}
    >
      {/* Luna — visible en tema claro */}
      <svg
        data-ic-moon
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      {/* Sol — visible en tema oscuro */}
      <svg
        data-ic-sun
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    </button>
  )
}
