/**
 * Tests for TransferBlock (TDD — red → green)
 * Covers: from→to display, mode labels, duration, notes, roundTrip badge, multi-leg
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TransferBlock from '../TransferBlock'
import type { Transfer } from '@/data/types'

describe('TransferBlock', () => {
  it('renders the section heading', () => {
    const transfers: readonly Transfer[] = [
      { from: 'Tokio', to: 'Takaragawa Onsen', mode: 'shinkansen', duration: '~1h15' },
    ]
    render(<TransferBlock transfers={transfers} />)
    expect(screen.getByText(/trayecto/i)).toBeInTheDocument()
  })

  it('renders from → to for a single leg', () => {
    const transfers: readonly Transfer[] = [
      { from: 'Osaka', to: 'Hiroshima', mode: 'shinkansen' },
    ]
    render(<TransferBlock transfers={transfers} />)
    expect(screen.getByText(/osaka/i)).toBeInTheDocument()
    expect(screen.getByText(/hiroshima/i)).toBeInTheDocument()
  })

  it('shows a readable mode label in Spanish', () => {
    const transfers: readonly Transfer[] = [
      { from: 'Osaka', to: 'Hiroshima', mode: 'shinkansen' },
    ]
    render(<TransferBlock transfers={transfers} />)
    expect(screen.getByText(/shinkansen/i)).toBeInTheDocument()
  })

  it('renders duration when provided', () => {
    const transfers: readonly Transfer[] = [
      { from: 'Osaka', to: 'Hiroshima', mode: 'shinkansen', duration: '~1h25' },
    ]
    render(<TransferBlock transfers={transfers} />)
    expect(screen.getByText(/1h25/i)).toBeInTheDocument()
  })

  it('renders line when provided', () => {
    const transfers: readonly Transfer[] = [
      { from: 'Osaka', to: 'Hiroshima', mode: 'shinkansen', line: 'Sanyō Shinkansen' },
    ]
    render(<TransferBlock transfers={transfers} />)
    expect(screen.getByText(/Sanyō Shinkansen/)).toBeInTheDocument()
  })

  it('shows "ida y vuelta" badge when roundTrip is true', () => {
    const transfers: readonly Transfer[] = [
      { from: 'Osaka', to: 'Hiroshima', mode: 'shinkansen', roundTrip: true },
    ]
    render(<TransferBlock transfers={transfers} />)
    expect(screen.getByText(/ida y vuelta/i)).toBeInTheDocument()
  })

  it('does NOT show roundTrip badge when roundTrip is false/absent', () => {
    const transfers: readonly Transfer[] = [
      { from: 'Osaka', to: 'Tokio', mode: 'shinkansen' },
    ]
    render(<TransferBlock transfers={transfers} />)
    expect(screen.queryByText(/ida y vuelta/i)).not.toBeInTheDocument()
  })

  it('renders notes as a list when provided', () => {
    const transfers: readonly Transfer[] = [
      {
        from: 'Osaka',
        to: 'Hiroshima',
        mode: 'shinkansen',
        notes: ['Salir temprano', 'Llevar reserva del tren'],
      },
    ]
    render(<TransferBlock transfers={transfers} />)
    expect(screen.getByText(/salir temprano/i)).toBeInTheDocument()
    expect(screen.getByText(/llevar reserva del tren/i)).toBeInTheDocument()
  })

  it('renders all legs for a multi-leg transfer (Kioto → Nara → Osaka)', () => {
    const transfers: readonly Transfer[] = [
      { from: 'Kioto', to: 'Nara', mode: 'tren', duration: '~45 min' },
      { from: 'Nara', to: 'Osaka', mode: 'tren', duration: '~40 min' },
    ]
    render(<TransferBlock transfers={transfers} />)
    // Two articles, one per leg
    const articles = screen.getAllByRole('article')
    expect(articles).toHaveLength(2)
    expect(screen.getByRole('article', { name: /tramo 1.*kioto.*nara/i })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: /tramo 2.*nara.*osaka/i })).toBeInTheDocument()
    expect(screen.getByText(/45 min/i)).toBeInTheDocument()
    expect(screen.getByText(/40 min/i)).toBeInTheDocument()
  })

  it('has accessible aria-label on each transfer leg', () => {
    const transfers: readonly Transfer[] = [
      { from: 'Tokio', to: 'Hiroshima', mode: 'shinkansen' },
    ]
    render(<TransferBlock transfers={transfers} />)
    // aria-label is "Tramo 1: Tokio a Hiroshima en Shinkansen"
    const article = screen.getByRole('article', { name: /tramo 1.*tokio.*hiroshima/i })
    expect(article).toBeInTheDocument()
  })

  it('renders the bus mode emoji/icon', () => {
    const transfers: readonly Transfer[] = [
      { from: 'Takayama', to: 'Shirakawa-go', mode: 'bus' },
    ]
    render(<TransferBlock transfers={transfers} />)
    // The emoji for bus is 🚌
    expect(screen.getByText(/🚌/)).toBeInTheDocument()
  })
})
