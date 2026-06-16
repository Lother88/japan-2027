/**
 * Mock for @vis.gl/react-maplibre.
 *
 * Replace real WebGL-backed components with lightweight stubs that:
 * - Render a data-testid so tests can assert on what was painted
 * - Serialize key props so tests can verify coordinates / data passed to the map
 *
 * Usage in a test file:
 *   vi.mock('@vis.gl/react-maplibre', () => import('@/test/maplibre-mock'))
 *
 * Exported names confirmed against @vis.gl/react-maplibre 8.x API:
 *   Map, Marker, Source, Layer, Popup, NavigationControl, useMap
 *
 * Uses React.createElement to produce valid React elements for React 19.
 */

import { createElement } from 'react'
import { vi } from 'vitest'
import type { ReactNode } from 'react'

interface MapProps {
  mapStyle?: string
  initialViewState?: {
    longitude?: number
    latitude?: number
    zoom?: number
  }
  style?: React.CSSProperties
  children?: ReactNode
}

interface MarkerProps {
  longitude: number
  latitude: number
  children?: ReactNode
  onClick?: () => void
  'aria-label'?: string
}

interface SourceProps {
  id?: string
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
  children?: ReactNode
}

interface LayerProps {
  id?: string
  type?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paint?: Record<string, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  layout?: Record<string, any>
}

export const Map = vi.fn(({ children, style }: MapProps) =>
  createElement('div', { 'data-testid': 'mock-map', style }, children),
)

export const Marker = vi.fn(({ children, longitude, latitude, ...rest }: MarkerProps) =>
  createElement(
    'div',
    {
      'data-testid': 'mock-marker',
      'data-longitude': String(longitude),
      'data-latitude': String(latitude),
      ...rest,
    },
    children,
  ),
)

export const Source = vi.fn(({ children, ...rest }: SourceProps) =>
  createElement(
    'div',
    {
      'data-testid': 'mock-source',
      'data-source-type': rest.type,
      'data-source-data': rest.data ? JSON.stringify(rest.data) : undefined,
    },
    children,
  ),
)

export const Layer = vi.fn(({ ...rest }: LayerProps) =>
  createElement('div', { 'data-testid': 'mock-layer', ...rest }),
)

export const Popup = vi.fn(({ children, ...rest }: { children?: ReactNode }) =>
  createElement('div', { 'data-testid': 'mock-popup', ...rest }, children),
)

export const NavigationControl = vi.fn(() =>
  createElement('div', { 'data-testid': 'mock-navigation-control' }),
)

export const useMap = vi.fn(() => ({ current: null }))
