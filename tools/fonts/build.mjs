/**
 * Fuentes autoalojadas y recortadas: Shippori Mincho (serif) y Zen Kaku Gothic New (sans).
 *
 * Reúne los caracteres que usa la web (textos de src/data/**, .astro y .ts de src/, sin el arte
 * generado *.markup.ts, que no lleva <text>) más un juego latino fijo, y escribe por cada peso
 * dos woff2 en public/fonts/: «-latin» (U+0000–2FFF) y «-cjk» (U+3000 en adelante). Las reglas
 * @font-face de src/styles/index.css los separan con unicode-range, así que el navegador solo
 * baja el trozo CJK de un peso si ese peso pinta algún kanji o kana.
 *
 * Rápido y determinista: si el juego de caracteres (tools/fonts/charset.json) no ha cambiado y
 * los woff2 existen, no hace nada. Si cambió, descarga los TTF originales (OFL, ~40 MB, no van
 * en el repo) de una commit fija de google/fonts a tools/fonts/source/, comprueba su SHA-256 y
 * regenera. Las salidas sí van en el repo, así que el build de Render normalmente no descarga.
 *
 * Además, un trozo mínimo con el kanji del hero (HERO, más abajo) para precargarlo.
 *
 * Uso: `node tools/fonts/build.mjs` (lo llama `pnpm build`) · `--check` falla si hay que regenerar.
 */
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import subsetFont from 'subset-font'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const SRC = join(ROOT, 'src')
const SOURCE_DIR = join(ROOT, 'tools', 'fonts', 'source')
const OUT_DIR = join(ROOT, 'public', 'fonts')
const CHARSET_FILE = join(ROOT, 'tools', 'fonts', 'charset.json')

/** Commit de google/fonts de la que salen los TTF (fijada para que el resultado no cambie solo). */
const GOOGLE_FONTS_COMMIT = '6c1dbe27dcf7d817d4b62cec033ba77fa8e2a5ec'

/** Pesos usados (medidos en la página: el sans 600 resuelve a 700, Zen Kaku no tiene 600). */
const FACES = [
  { slug: 'shippori-mincho', weight: 500, dir: 'shipporimincho', file: 'ShipporiMincho-Medium.ttf', sha256: '700e505afc4cded2338eba29478a041e04c1c2ea5114fbb3e0b04e76c302c5d8' },
  { slug: 'shippori-mincho', weight: 600, dir: 'shipporimincho', file: 'ShipporiMincho-SemiBold.ttf', sha256: 'bc7925544894a91466449adb73c6d943f50c3e53eb1c74d0673fe2dbafcd4d2d' },
  { slug: 'shippori-mincho', weight: 700, dir: 'shipporimincho', file: 'ShipporiMincho-Bold.ttf', sha256: '63bc4eddc74793f671c3ab827c5175e773ffbe569d0bf50ee65375ea9e3bc286' },
  { slug: 'shippori-mincho', weight: 800, dir: 'shipporimincho', file: 'ShipporiMincho-ExtraBold.ttf', sha256: 'bdb787644b4b347e9a7efdd576f0d16ee4528cc9b5c86d23e06fa1a14ae0444c' },
  { slug: 'zen-kaku-gothic-new', weight: 400, dir: 'zenkakugothicnew', file: 'ZenKakuGothicNew-Regular.ttf', sha256: 'b840cd07a67d89cacca44249ae49aa99ee7640eb5ce623be8d8983d6aabac801' },
  { slug: 'zen-kaku-gothic-new', weight: 500, dir: 'zenkakugothicnew', file: 'ZenKakuGothicNew-Medium.ttf', sha256: '651a3f7280b7f36262601ee76d8388a8dc4372dcc67aff025a608939a562b525' },
  { slug: 'zen-kaku-gothic-new', weight: 700, dir: 'zenkakugothicnew', file: 'ZenKakuGothicNew-Bold.ttf', sha256: '0081cedabc4921982fcd061f845a005664ac7fb642af2dd34b4007bc63ccd235' },
]

/** Frontera entre los dos trozos (debe coincidir con los unicode-range de index.css). */
const CJK_START = 0x3000

/**
 * Trozo mínimo con el kanji 日本 del hero en serif 800 (el elemento LCP). Base.astro lo
 * precarga e index.css lo declara como familia propia («Shippori Mincho Hero», solo para
 * [data-hero-kanji]): el kanji se pinta con su fuente desde el primer fotograma sin precargar
 * los ~40 KB del trozo CJK entero.
 */
const HERO = { slug: 'shippori-mincho', weight: 800, text: '日本' }

/**
 * Juego latino fijo (red de seguridad; lo usado de verdad ya sale de los textos): ASCII
 * imprimible, letras españolas con tilde, ¿¡«»·ºª°, espacio duro y puntuación tipográfica.
 */
const LATIN_FIXED = [
  ...range(0x20, 0x7e),
  ...' áéíóúüñÁÉÍÓÚÜÑ¿¡«»·ºª°×‐‑–—‘’“”…•→←↔€'.split('').map((c) => c.codePointAt(0)),
]

/**
 * Nombres que se conservan además de los básicos: 0 copyright, 13 licencia y 14 URL de la
 * licencia (la OFL pide que la licencia acompañe a la fuente; así va dentro de cada woff2).
 */
const PRESERVE_NAME_IDS = [0, 13, 14]

function range(from, to) {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i)
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(path)
    else yield path
  }
}

/** Caracteres de los textos fuente: .astro y .ts de src/ (sin el arte generado). */
async function collectCodePoints() {
  const points = new Set(LATIN_FIXED)
  for await (const path of walk(SRC)) {
    const ext = extname(path)
    if (ext !== '.astro' && ext !== '.ts') continue
    if (path.endsWith('.markup.ts')) continue
    for (const ch of await readFile(path, 'utf8')) {
      const cp = ch.codePointAt(0)
      if (cp >= 0x20 && cp !== 0x7f) points.add(cp)
    }
  }
  return [...points].sort((a, b) => a - b)
}

const toText = (points) => String.fromCodePoint(...points)
const outName = (face, part) => `${face.slug}-${face.weight}-${part}.woff2`
const sha256 = (buf) => createHash('sha256').update(buf).digest('hex')

async function ensureSource(face) {
  const path = join(SOURCE_DIR, face.file)
  if (!existsSync(path)) {
    const url = `https://raw.githubusercontent.com/google/fonts/${GOOGLE_FONTS_COMMIT}/ofl/${face.dir}/${face.file}`
    console.log(`descargando ${face.file}`)
    const res = await fetch(url)
    if (!res.ok) throw new Error(`No se pudo descargar ${url}: ${res.status}`)
    await mkdir(SOURCE_DIR, { recursive: true })
    await writeFile(path, Buffer.from(await res.arrayBuffer()))
  }
  const buf = await readFile(path)
  if (sha256(buf) !== face.sha256) throw new Error(`${face.file}: SHA-256 inesperado (¿fichero corrupto?)`)
  return buf
}

async function main() {
  const check = process.argv.includes('--check')
  const points = await collectCodePoints()
  const charset = {
    commit: GOOGLE_FONTS_COMMIT,
    hero: HERO.text,
    latin: toText(points.filter((cp) => cp < CJK_START)),
    cjk: toText(points.filter((cp) => cp >= CJK_START)),
  }
  const previous = existsSync(CHARSET_FILE) ? await readFile(CHARSET_FILE, 'utf8') : ''
  const next = `${JSON.stringify(charset, null, 2)}\n`
  const heroFace = FACES.find((f) => f.slug === HERO.slug && f.weight === HERO.weight)
  const outputs = [
    ...FACES.flatMap((face) => ['latin', 'cjk'].map((part) => join(OUT_DIR, outName(face, part)))),
    join(OUT_DIR, outName(heroFace, 'hero')),
  ]
  const upToDate = previous === next && outputs.every((p) => existsSync(p))

  if (upToDate) {
    console.log(`fuentes al día (${[...charset.latin].length} latinos + ${[...charset.cjk].length} CJK)`)
    return
  }
  if (check) {
    console.error('Las fuentes recortadas no están al día: ejecuta `node tools/fonts/build.mjs`.')
    process.exit(1)
  }

  await mkdir(OUT_DIR, { recursive: true })
  for (const face of FACES) {
    const source = await ensureSource(face)
    for (const part of ['latin', 'cjk']) {
      const woff2 = await subsetFont(source, charset[part], {
        targetFormat: 'woff2',
        preserveNameIds: PRESERVE_NAME_IDS,
      })
      const out = join(OUT_DIR, outName(face, part))
      await writeFile(out, woff2)
      console.log(`${relative(ROOT, out)}  ${(woff2.length / 1024).toFixed(1)} KB`)
    }
  }
  const hero = await subsetFont(await ensureSource(heroFace), HERO.text, {
    targetFormat: 'woff2',
    preserveNameIds: PRESERVE_NAME_IDS,
  })
  const heroOut = join(OUT_DIR, outName(heroFace, 'hero'))
  await writeFile(heroOut, hero)
  console.log(`${relative(ROOT, heroOut)}  ${(hero.length / 1024).toFixed(1)} KB`)
  await writeFile(CHARSET_FILE, next)
}

await main()
