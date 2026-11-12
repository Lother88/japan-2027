// Regenera todo el arte isométrico y lo lleva a src/ (o, con --check, solo compara).
//
//   node tools/art/build-all.mjs           → genera, importa y escribe en src/features/landing
//   node tools/art/build-all.mjs --check   → genera e importa en un directorio temporal y lista
//                                            los ficheros que difieren de los de src/ (exit 1 si hay)
//
// Requiere la skill anatomy-asset (ver README.md, ANATOMY_ASSET_DIR).
import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdirSync, mkdtempSync, readdirSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = join(HERE, '..', '..')
const check = process.argv.includes('--check')
const node = (script, ...args) => execFileSync(process.execPath, [join(HERE, script), ...args], { stdio: ['ignore', 'ignore', 'inherit'] })
const dirs = (parent, re) => readdirSync(join(HERE, parent)).filter((d) => re.test(d)).sort()

// 1. Generadores. El piloto del día 21 (kinkakuji) escribe en iso/out junto a los demás días.
//    hero/hero-maqueta (SVG único) solo sirve de referencia a hero-layers (ref.html).
const builds = [
  ...dirs('iso', /^day\d\d$/).map((d) => `iso/${d}/build.mjs`),
  'iso/jinya/build.mjs',
  'iso/sagano/build.mjs',
  'iso/nakano/build.mjs',
  'kinkakuji/build.mjs',
  'hero/hero-maqueta/build.mjs',
  'hero/banda-calle/build.mjs',
  ...dirs('hero-spots', /^spot-/).map((d) => `hero-spots/${d}/build.mjs`),
  'hero-layers/build.mjs',
]
for (const b of builds) {
  process.stdout.write(`build ${b}\n`)
  node(b)
}

// 2. Importación a un árbol con la forma del repo.
const target = check ? mkdtempSync(join(tmpdir(), 'japan-art-')) : REPO
node('import/import-iso.mjs', join(HERE, 'iso', 'out'), target)
const heroArt = join(target, 'src', 'features', 'landing', 'hero-art')
mkdirSync(heroArt, { recursive: true })
const heroFiles = [
  ['hero-layers/out/heroMaqueta.markup.ts', 'heroMaqueta.markup.ts'],
  ['hero/out/bandaCalle.markup.ts', 'bandaCalle.markup.ts'],
  ...readdirSync(join(HERE, 'hero-spots', 'out')).map((f) => [`hero-spots/out/${f}`, f]),
]
for (const [from, to] of heroFiles) copyFileSync(join(HERE, from), join(heroArt, to))
node('import/split-michishirube.mjs', join(heroArt, 'spotMichishirube.markup.ts'))

if (!check) {
  console.log('arte regenerado en src/features/landing (iso/ y hero-art/)')
} else {
  const differing = []
  for (const sub of ['iso', 'hero-art']) {
    const dir = join(target, 'src', 'features', 'landing', sub)
    for (const f of readdirSync(dir)) {
      const a = readFileSync(join(dir, f))
      let b
      try {
        b = readFileSync(join(REPO, 'src', 'features', 'landing', sub, f))
      } catch {
        b = null
      }
      if (!b || !a.equals(b)) differing.push(`${sub}/${f}`)
    }
  }
  if (differing.length) {
    console.log(`difieren de src/ (${differing.length}):\n  ${differing.join('\n  ')}\n(salida en ${target})`)
    process.exitCode = 1
  } else {
    console.log('todo el arte de src/ se reproduce byte a byte')
  }
}
