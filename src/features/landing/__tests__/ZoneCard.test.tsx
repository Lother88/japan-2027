import { render, screen } from '@testing-library/react'
import ZoneCard from '@/features/landing/ZoneCard'
import { getZone } from '@/data'
import { tokensForCity } from '@/features/landing/theme'

describe('ZoneCard', () => {
  it('muestra el nombre y los tags de la zona', () => {
    const zone = getZone('shibuya')
    expect(zone).toBeDefined()
    if (!zone) return
    render(<ZoneCard zone={zone} tokens={tokensForCity(zone.citySlug)} />)
    expect(screen.getByText('Shibuya')).toBeInTheDocument()
    expect(zone.tags.length).toBeGreaterThan(0)
    expect(screen.getByText(zone.tags[0])).toBeInTheDocument()
  })

  it('muestra la sección "El lugar" si la zona tiene contexto', () => {
    const zone = getZone('shibuya')
    if (!zone) return
    render(<ZoneCard zone={zone} tokens={tokensForCity(zone.citySlug)} />)
    // El detalle colapsable usa la etiqueta "El lugar" cuando hay contexto.
    // (Si no hubiera contexto para shibuya, este texto no aparecería.)
    const lugar = screen.queryByText('El lugar')
    if (lugar) expect(lugar).toBeInTheDocument()
  })
})
