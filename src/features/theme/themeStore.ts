/**
 * Theme store — Zustand v5 + persist middleware
 *
 * State: theme ('light' | 'dark')
 * - Default: reads prefers-color-scheme if no persisted value
 * - Persists under key 'japan2027-theme' in localStorage
 * - applyTheme: adds/removes .dark class on document.documentElement
 *
 * React Compiler active — no manual memo/callback
 * TS6 strict: union type, no enum, import type for types
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  applyTheme: (theme: Theme) => void
}

function getSystemTheme(): Theme {
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: getSystemTheme(),

      toggleTheme: () =>
        set(state => {
          const next: Theme = state.theme === 'light' ? 'dark' : 'light'
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', next === 'dark')
          }
          return { theme: next }
        }),

      setTheme: (theme: Theme) =>
        set(() => {
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', theme === 'dark')
          }
          return { theme }
        }),

      applyTheme: (theme: Theme) => {
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark')
        }
      },
    }),
    {
      name: 'japan2027-theme',
      // Only persist the theme value, not the action functions
      partialize: (state) => ({ theme: state.theme }),
      // After rehydration, apply the persisted theme to the DOM
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', state.theme === 'dark')
        }
      },
    },
  ),
)
