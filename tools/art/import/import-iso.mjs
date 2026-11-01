// Copia los 20 marcados generados + el piloto del día 21 al repo, prefijando ids por día.
// Uso: node import-iso.mjs <outDir generado> <repo>
import fs from 'node:fs'
import path from 'node:path'

const [srcDir, repo] = process.argv.slice(2)
const dest = path.join(repo, 'src/features/landing/iso')
fs.mkdirSync(dest, { recursive: true })

// Solo los ids del kit sin prefijo: los generadores que ya prefijan (d23-iso-fade-…, d24-fade-…)
// se dejan como están.
const fadeIds = /(?<![\w-])iso-fade-(?=[a-z0-9])/g

for (const f of fs.readdirSync(srcDir).filter((n) => /^day\d\dIso\.markup\.ts$/.test(n))) {
  const dd = f.slice(3, 5)
  const src = fs.readFileSync(path.join(srcDir, f), 'utf8')
  const out = src.replace(fadeIds, `d${dd}-fade-`)
  fs.writeFileSync(path.join(dest, f), out)
  console.log(f, 'fade ids renamed:', (src.match(fadeIds) || []).length)
}

// Piloto (día 21): normaliza al mismo esquema que los demás.
const pilotPath = path.join(srcDir, 'kinkakujiIso.markup.ts')
const pilot = fs.readFileSync(pilotPath, 'utf8')
const markupMatch = pilot.match(/export const KINKAKUJI_ISO_MARKUP = ("(?:[^"\\]|\\.)*")/)
let markup = JSON.parse(markupMatch[1])
const before = markup
markup = markup
  .replace(/kk-iso-/g, 'd21-')
  .replace(/kk-iso/g, 'iso-d21')
  .replace(/(?<![-\w])am-pulse/g, 'd21-pulse')
  .replace(fadeIds, 'd21-fade-')
const header = `/**
 * Kinkaku-ji isométrico (pabellón dorado reflejado en su estanque) — día 21.
 *
 * Solo el reflejo del pabellón en el estanque "respira" (CSS); se detiene con
 * prefers-reduced-motion.
 *
 * Marcado SVG generado (no editar a mano) con el kit de la skill anatomy-asset
 * (build.mjs del piloto en tools/art). Estilos acotados a \`.iso-d21\`,
 * animaciones e ids con prefijo \`d21-\`, para que los 21 dibujos convivan en una página.
 * Los colores salen de los tokens de src/styles/index.css (--paper en vivo; las rampas de tono se
 * derivan de los hex de la paleta al generar): si cambia la paleta, hay que regenerar este fichero.
 */
export const DAY21_ISO_VIEWBOX = '0 0 440 330'

export const DAY21_ISO_SUBJECT = 'Kinkaku-ji (pabellón dorado)'

export const DAY21_ISO_MARKUP = ${JSON.stringify(markup)}
`
fs.writeFileSync(path.join(dest, 'day21Iso.markup.ts'), header)
console.log('day21 changed chars', before.length, '->', markup.length,
  'kk-iso left:', (markup.match(/kk-iso/g) || []).length,
  'am-pulse left:', (markup.match(/(?<![-\w])am-pulse/g) || []).length)
