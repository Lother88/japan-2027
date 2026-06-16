/**
 * themeStore tests — TDD first
 *
 * Tests:
 *   - Default: uses prefers-color-scheme when no persisted value
 *   - toggleTheme switches light ↔ dark
 *   - setTheme sets specific value
 *   - applyTheme adds/removes .dark class on document.documentElement
 *   - persist key is 'japan2027-theme'
 */

import { beforeEach, describe, it, expect, vi } from 'vitest'
import { act } from '@testing-library/react'

// We need to control matchMedia behavior per test
function setPrefersDark(prefersDark: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: query === '(prefers-color-scheme: dark)' ? prefersDark : false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}

describe('useThemeStore', () => {
  beforeEach(() => {
    // Reset localStorage before each test
    localStorage.clear()
    // Reset html class
    document.documentElement.classList.remove('dark')
    // Reset matchMedia to light preference
    setPrefersDark(false)
    // Clear module cache so store is re-created fresh
    vi.resetModules()
  })

  it('defaults to light when prefers-color-scheme is light and no persisted value', async () => {
    setPrefersDark(false)
    const { useThemeStore } = await import('../themeStore')
    const theme = useThemeStore.getState().theme
    expect(theme).toBe('light')
  })

  it('defaults to dark when prefers-color-scheme is dark and no persisted value', async () => {
    setPrefersDark(true)
    // Need fresh store — but zustand persist initializes synchronously from localStorage
    // So we test without persisted value: store reads matchMedia in its initializer
    // Since vi.resetModules() was called, the import will re-evaluate the module
    const { useThemeStore } = await import('../themeStore')
    const theme = useThemeStore.getState().theme
    expect(theme).toBe('dark')
  })

  it('toggleTheme switches from light to dark', async () => {
    setPrefersDark(false)
    const { useThemeStore } = await import('../themeStore')
    act(() => {
      useThemeStore.getState().toggleTheme()
    })
    expect(useThemeStore.getState().theme).toBe('dark')
  })

  it('toggleTheme switches from dark to light', async () => {
    setPrefersDark(true)
    const { useThemeStore } = await import('../themeStore')
    act(() => {
      useThemeStore.getState().toggleTheme()
    })
    expect(useThemeStore.getState().theme).toBe('light')
  })

  it('setTheme sets a specific value', async () => {
    setPrefersDark(false)
    const { useThemeStore } = await import('../themeStore')
    act(() => {
      useThemeStore.getState().setTheme('dark')
    })
    expect(useThemeStore.getState().theme).toBe('dark')
    act(() => {
      useThemeStore.getState().setTheme('light')
    })
    expect(useThemeStore.getState().theme).toBe('light')
  })

  it('applyTheme adds .dark class to documentElement when theme is dark', async () => {
    setPrefersDark(false)
    const { useThemeStore } = await import('../themeStore')
    act(() => {
      useThemeStore.getState().applyTheme('dark')
    })
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('applyTheme removes .dark class from documentElement when theme is light', async () => {
    setPrefersDark(false)
    document.documentElement.classList.add('dark')
    const { useThemeStore } = await import('../themeStore')
    act(() => {
      useThemeStore.getState().applyTheme('light')
    })
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('persists with key japan2027-theme', async () => {
    setPrefersDark(false)
    const { useThemeStore } = await import('../themeStore')
    act(() => {
      useThemeStore.getState().setTheme('dark')
    })
    // Zustand persist stores under the name key
    const stored = localStorage.getItem('japan2027-theme')
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!)
    expect(parsed.state.theme).toBe('dark')
  })
})
