/**
 * Etiquetas de zona: los slugs de `zones.ts` se mantienen estables y la UI muestra una
 * etiqueta legible con tildes (ortografía española).
 */
import { zones } from '@/data'
import { tagLabel, TAG_LABELS } from '@/data/tags'

describe('tagLabel — etiquetas legibles con tildes', () => {
  it('cada tag usado en zones.ts tiene etiqueta', () => {
    const missing = [...new Set(zones.flatMap((z) => z.tags))].filter((t) => !(t in TAG_LABELS))
    expect(missing).toEqual([])
  })

  it.each([
    ['historico', 'histórico'],
    ['iconico', 'icónico'],
    ['jardin', 'jardín'],
    ['gastronomia', 'gastronomía'],
    ['montana', 'montaña'],
    ['bambu', 'bambú'],
    ['rio', 'río'],
    ['bahia', 'bahía'],
    ['cafes', 'cafés'],
    ['samurai', 'samurái'],
    ['electronica', 'electrónica'],
    ['artesania', 'artesanía'],
    ['patrimonio-unesco', 'patrimonio UNESCO'],
    ['moda-alternativa', 'moda alternativa'],
  ])('%s → %s', (slug, label) => {
    expect(tagLabel(slug)).toBe(label)
  })

  it('ninguna etiqueta conserva guiones de slug', () => {
    for (const label of Object.values(TAG_LABELS)) expect(label).not.toMatch(/-/)
  })

  it('un tag desconocido se muestra sin guiones', () => {
    expect(tagLabel('nuevo-tag')).toBe('nuevo tag')
  })
})
