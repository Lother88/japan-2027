/**
 * ThemeToggle — accessible sun/moon button to toggle light/dark mode
 *
 * - aria-label describes the ACTION (what will happen on click)
 * - focus-visible ring for keyboard navigation
 * - Touch target ≥ 44×44px (UX-03)
 * - React Compiler active — no manual memo/callback
 */

import { useThemeStore } from './themeStore'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      className={[
        'min-h-[44px] min-w-[44px] flex items-center justify-center',
        'rounded-[var(--radius-card)] transition-colors',
        'text-fg-muted hover:text-fg hover:bg-surface',
        'focus-visible:outline-2 focus-visible:outline-urushi-600 focus-visible:outline-offset-2',
      ].join(' ')}
    >
      {isDark ? (
        // Sun icon — switch to light
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        // Moon icon — switch to dark
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}
