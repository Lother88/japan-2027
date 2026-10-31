/**
 * Integridad de los 21 marcados isométricos: todos conviven en la misma página, así
 * que cada id debe ser único en el conjunto, cada referencia (url(#…) / href="#…")
 * debe resolverse dentro de su propio módulo y los estilos y keyframes deben ir
 * acotados a la clase del día.
 */
import { ISO_KINDS } from '@/features/landing/illustrationKind'
import { isoLoaders } from '@/features/landing/iso/registry'

const arts = await Promise.all(
  ISO_KINDS.map(async (kind) => ({ kind, ...(await isoLoaders[kind]()) })),
)

describe('marcados isométricos', () => {
  it('todos usan el viewBox común 440×330', () => {
    for (const art of arts) expect(art.viewBox, art.kind).toBe('0 0 440 330')
  })

  it('ningún id se repite entre los 21 módulos', () => {
    const seen = new Map<string, string>()
    const dupes: string[] = []
    for (const art of arts) {
      for (const [, id] of art.markup.matchAll(/\bid="([^"]+)"/g)) {
        if (seen.has(id)) dupes.push(`${id} (${seen.get(id)} y ${art.kind})`)
        seen.set(id, art.kind)
      }
    }
    expect(dupes).toEqual([])
  })

  it('cada id lleva el prefijo de su día', () => {
    for (const art of arts) {
      const prefix = art.kind.replace('iso-', '') + '-'
      for (const [, id] of art.markup.matchAll(/\bid="([^"]+)"/g)) {
        expect(id.startsWith(prefix), `${art.kind}: ${id}`).toBe(true)
      }
    }
  })

  it('cada referencia se resuelve dentro de su propio módulo', () => {
    for (const art of arts) {
      const ids = new Set([...art.markup.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]))
      const refs = [...art.markup.matchAll(/url\(#([^)]+)\)|href="#([^"]+)"/g)].map((m) => m[1] ?? m[2])
      const missing = refs.filter((r) => !ids.has(r))
      expect(missing, art.kind).toEqual([])
    }
  })

  it('los estilos y keyframes van acotados a la clase del día', () => {
    for (const art of arts) {
      const scopes = new Set([...art.markup.matchAll(/\.(iso-d\d\d|kk-iso)\b/g)].map((m) => m[1]))
      expect([...scopes], art.kind).toEqual([art.kind])
      const day = art.kind.replace('iso-', '')
      for (const [, name] of art.markup.matchAll(/@keyframes ([\w-]+)/g)) {
        expect(name.startsWith(`${day}-`), `${art.kind}: @keyframes ${name}`).toBe(true)
      }
    }
  })
})

/**
 * El arte de la portada (maqueta, banda y spots) convive en la misma página que los 21 días:
 * mismas reglas de integridad, comprobadas sobre el conjunto completo.
 */
describe('marcados de la portada (hero, banda y spots)', async () => {
  const { ART_SCOPES, loadHeroChunk, deferredArtLoaders } = await import('@/features/landing/hero-art/registry')
  const chunk = await loadHeroChunk()
  const markups: Record<keyof typeof ART_SCOPES, string> = {
    // El hero va por capas: se comprueba su <style> único junto con el marcado de todas ellas.
    hero: `<style>${chunk.HERO_SCENE.style}</style>` + chunk.HERO_SCENE.layers.map((l) => l.markup).join(''),
    banda: (await deferredArtLoaders.banda()).markup,
    ruta: (await deferredArtLoaders.ruta()).markup,
    omamori: (await deferredArtLoaders.omamori()).markup,
    koyomi: chunk.HERO_SPOTS.koyomi.markup,
    machiya: chunk.HERO_SPOTS.machiya.markup,
    kippu: chunk.HERO_SPOTS.kippu.markup,
    maletas: chunk.HERO_SPOTS.maletas.markup,
    michishirube: chunk.HERO_SPOTS.michishirube.markup,
    'toro-toggle': chunk.HERO_SPOTS['toro-toggle'].markup,
  }
  const portada = (Object.keys(ART_SCOPES) as Array<keyof typeof ART_SCOPES>).map((name) => ({
    name,
    ...ART_SCOPES[name],
    markup: markups[name],
  }))
  const all = [
    ...arts.map((a) => ({ name: a.kind, markup: a.markup })),
    ...portada.map((a) => ({ name: a.name, markup: a.markup })),
  ]

  /** Reglas de estilo (selectores) fuera de @keyframes, de todos los <style> del marcado. */
  function selectors(markup: string): string[] {
    const out: string[] = []
    for (const [, css] of markup.matchAll(/<style>([\s\S]*?)<\/style>/g)) {
      const flat = css.replace(/@keyframes[^{]+\{(?:[^{}]*\{[^}]*\})*[^{}]*\}/g, '')
      for (const [, sel] of flat.matchAll(/([^{}]+)\{[^{}]*\}/g)) {
        const s = sel.trim()
        if (!s || s.startsWith('@')) continue
        out.push(...s.split(',').map((p) => p.trim()))
      }
    }
    return out
  }

  it('el viewBox de escritorio de la maqueta es 1200×640 y el de móvil cae dentro', () => {
    expect(chunk.HERO_SCENE.viewBox).toBe('0 0 1200 640')
    const [x, y, w, h] = chunk.HERO_SCENE.viewBoxMobile.split(' ').map(Number)
    expect(x).toBeGreaterThanOrEqual(0)
    expect(y).toBeGreaterThanOrEqual(0)
    expect(x + w).toBeLessThanOrEqual(1200)
    expect(y + h).toBeLessThanOrEqual(640)
  })

  it('ningún id se repite entre días, hero, banda y spots', () => {
    const seen = new Map<string, string>()
    const dupes: string[] = []
    for (const art of all) {
      for (const [, id] of art.markup.matchAll(/\bid="([^"]+)"/g)) {
        if (seen.has(id)) dupes.push(`${id} (${seen.get(id)} y ${art.name})`)
        seen.set(id, art.name)
      }
    }
    expect(dupes).toEqual([])
  })

  it('cada id y cada @keyframes llevan el prefijo de su asset', () => {
    for (const art of portada) {
      for (const [, id] of art.markup.matchAll(/\bid="([^"]+)"/g)) {
        expect(id.startsWith(art.prefix), `${art.name}: ${id}`).toBe(true)
      }
      for (const [, name] of art.markup.matchAll(/@keyframes ([\w-]+)/g)) {
        expect(name.startsWith(art.prefix), `${art.name}: @keyframes ${name}`).toBe(true)
      }
    }
  })

  it('ningún @keyframes se repite en toda la página', () => {
    // Un módulo puede repetir su propio @keyframes (p. ej. dentro de @media); entre módulos, no.
    const byName = new Map<string, Set<string>>()
    for (const art of all) {
      for (const [, n] of art.markup.matchAll(/@keyframes ([\w-]+)/g)) {
        byName.set(n, (byName.get(n) ?? new Set()).add(art.name))
      }
    }
    const shared = [...byName].filter(([, mods]) => mods.size > 1).map(([n, mods]) => `${n}: ${[...mods].join(', ')}`)
    expect(shared).toEqual([])
  })

  it('cada referencia se resuelve dentro de su propio módulo', () => {
    for (const art of portada) {
      const ids = new Set([...art.markup.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]))
      const refs = [...art.markup.matchAll(/url\(#([^)]+)\)|href="#([^"]+)"/g)].map((m) => m[1] ?? m[2])
      expect(refs.filter((r) => !ids.has(r)), art.name).toEqual([])
    }
  })

  it('cada regla de estilo va acotada a la clase raíz del asset', () => {
    for (const art of portada) {
      const sels = selectors(art.markup)
      expect(sels.length, art.name).toBeGreaterThan(0)
      const rootClass = new RegExp(String.raw`\.${art.root}(?![\w-])`)
      const loose = sels.filter((s) => !rootClass.test(s))
      expect(loose, art.name).toEqual([])
      const scopes = new Set([...art.markup.matchAll(/\.(iso-[\w-]+)/g)].map((m) => m[1]))
      expect([...scopes], art.name).toEqual([art.root])
    }
  })
})
