/**
 * Smoke test — Phase 1 infrastructure validation
 *
 * Verifies that:
 * 1. Vitest + @testing-library/react + jsdom is correctly wired
 * 2. jest-dom matchers are available (toBeInTheDocument)
 * 3. A basic React component renders without crashing
 * 4. Tailwind @theme tokens compile without error (CSS is not loaded in Vitest/jsdom,
 *    but the import chain must not throw at module resolution level)
 */

import { render, screen } from '@testing-library/react'
import App from '@/App'

describe('Phase 1 — Infrastructure smoke test', () => {
  it('renders App without crashing', () => {
    render(<App />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('renders the page heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Japón 2027')
  })
})
