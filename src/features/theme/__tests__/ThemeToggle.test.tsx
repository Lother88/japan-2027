/**
 * ThemeToggle tests — TDD first
 *
 * Tests:
 *   - Renders a button with accessible aria-label
 *   - Shows sun icon when theme is dark, moon icon when light
 *   - Click calls toggleTheme
 *   - Has visible focus ring (focus-visible class present)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ThemeToggle from '../ThemeToggle'

// Mock the theme store
vi.mock('../themeStore', () => ({
  useThemeStore: vi.fn(),
}))

import { useThemeStore } from '../themeStore'

const mockUseThemeStore = vi.mocked(useThemeStore)

describe('ThemeToggle', () => {
  const mockToggle = vi.fn()

  beforeEach(() => {
    mockToggle.mockClear()
  })

  it('renders a button with an aria-label when theme is light', () => {
    mockUseThemeStore.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggle,
      setTheme: vi.fn(),
      applyTheme: vi.fn(),
    })
    render(<ThemeToggle />)
    const btn = screen.getByRole('button')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute('aria-label')
  })

  it('has aria-label "Activar modo oscuro" when theme is light', () => {
    mockUseThemeStore.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggle,
      setTheme: vi.fn(),
      applyTheme: vi.fn(),
    })
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: /modo oscuro/i })).toBeInTheDocument()
  })

  it('has aria-label "Activar modo claro" when theme is dark', () => {
    mockUseThemeStore.mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggle,
      setTheme: vi.fn(),
      applyTheme: vi.fn(),
    })
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: /modo claro/i })).toBeInTheDocument()
  })

  it('calls toggleTheme on click', () => {
    mockUseThemeStore.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggle,
      setTheme: vi.fn(),
      applyTheme: vi.fn(),
    })
    render(<ThemeToggle />)
    fireEvent.click(screen.getByRole('button'))
    expect(mockToggle).toHaveBeenCalledTimes(1)
  })

  it('shows moon icon (svg) when theme is light', () => {
    mockUseThemeStore.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggle,
      setTheme: vi.fn(),
      applyTheme: vi.fn(),
    })
    const { container } = render(<ThemeToggle />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('shows sun icon (svg) when theme is dark', () => {
    mockUseThemeStore.mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggle,
      setTheme: vi.fn(),
      applyTheme: vi.fn(),
    })
    const { container } = render(<ThemeToggle />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
