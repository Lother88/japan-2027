/**
 * Integridad de context.ts — contexto cultural por zona.
 *
 * CTX-01: toda clave de `context` es un zoneId existente en zones.
 * CTX-02: cada ficha tiene los campos requeridos y fuentes con URL válida.
 * CTX-03: el contexto está poblado (no es un placeholder vacío).
 */
import { context, getContext } from '../context'
import { zones } from '../zones'

describe('context: claves válidas (CTX-01)', () => {
  const zoneIds = new Set(zones.map(z => z.id))

  it('toda clave de context corresponde a un zoneId existente', () => {
    Object.keys(context).forEach(id => {
      expect(zoneIds.has(id)).toBe(true)
    })
  })
})

describe('context: forma de las fichas (CTX-02)', () => {
  it('cada ficha tiene nombre/queEs/historia/significado y fuentes con URL', () => {
    Object.values(context).forEach(entries => {
      expect(entries.length).toBeGreaterThan(0)
      entries.forEach(e => {
        expect(typeof e.nombre).toBe('string')
        expect(e.nombre.length).toBeGreaterThan(0)
        expect(typeof e.queEs).toBe('string')
        expect(typeof e.historia).toBe('string')
        expect(typeof e.significado).toBe('string')
        expect(Array.isArray(e.fuentes)).toBe(true)
        e.fuentes.forEach(f => {
          expect(typeof f.label).toBe('string')
          expect(f.url).toMatch(/^https?:\/\//)
        })
      })
    })
  })
})

describe('context: poblado y consultable (CTX-03)', () => {
  it('hay contexto para muchas zonas', () => {
    expect(Object.keys(context).length).toBeGreaterThan(20)
  })

  it('getContext devuelve las fichas de una zona', () => {
    const id = Object.keys(context)[0]
    expect(getContext(id)).toEqual(context[id])
  })

  it('getContext devuelve undefined para una zona sin contexto', () => {
    expect(getContext('zona-inexistente-xyz')).toBeUndefined()
  })
})
