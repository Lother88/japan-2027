/**
 * Tests for ZoneMiniMap (TDD)
 * Satisfies ZONE-03
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ZoneMiniMap from '../ZoneMiniMap'

vi.mock('@vis.gl/react-maplibre', () => import('@/test/maplibre-mock'))

describe('ZoneMiniMap', () => {
  it('renders a map with one marker when coordinates are provided (ZONE-03)', () => {
    render(<ZoneMiniMap coordinates={[139.7016, 35.6585]} name="Shibuya" />)
    expect(screen.getByTestId('mock-map')).toBeInTheDocument()
    const markers = screen.getAllByTestId('mock-marker')
    expect(markers).toHaveLength(1)
  })

  it('passes correct longitude and latitude to the marker', () => {
    render(<ZoneMiniMap coordinates={[139.7016, 35.6585]} name="Shibuya" />)
    const marker = screen.getByTestId('mock-marker')
    expect(marker.getAttribute('data-longitude')).toBe('139.7016')
    expect(marker.getAttribute('data-latitude')).toBe('35.6585')
  })

  it('renders nothing when coordinates are undefined (ZONE-03)', () => {
    const { container } = render(<ZoneMiniMap coordinates={undefined} name="Sin coords" />)
    expect(container.firstChild).toBeNull()
  })
})
