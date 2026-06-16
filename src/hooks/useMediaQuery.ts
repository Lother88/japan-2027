/**
 * useMediaQuery — responsive media query hook without external libraries
 *
 * React Compiler note: no useMemo/useCallback needed here.
 * The hook uses useState + useEffect which are compiler-safe.
 *
 * Lint constraint (react-hooks/set-state-in-effect): setState must NOT be
 * called synchronously in the effect body. The initial value is obtained via
 * the lazy initializer in useState, and updates happen only in the listener.
 */

import { useState, useEffect } from 'react'

/**
 * Returns true when the given media query matches.
 * Handles SSR gracefully by defaulting to false.
 *
 * @example
 * const isDesktop = useMediaQuery('(min-width: 768px)')
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}
