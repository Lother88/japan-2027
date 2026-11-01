// Splits the generated spot-michishirube markup into a static base and a "board" layer.
// The board's swing moves from an inner <g> (repaints the SVG every frame) to the layer's
// own <svg> element (composited transform). Usage: node split-michishirube.mjs <markup.ts>
import { readFileSync, writeFileSync } from 'node:fs'

const file = process.argv[2]
const src = readFileSync(file, 'utf8')
const markupMatch = src.match(/export const SPOT_MICHISHIRUBE_MARKUP = (".*")\s*$/m)
if (!markupMatch) throw new Error('markup export not found')
const markup = JSON.parse(markupMatch[1])

const OUTER = '<g transform="matrix(1.6805 0 0 1.4553 31.3582 13.0607)">'
const start = markup.indexOf(OUTER)
if (start < 0 || markup.indexOf(OUTER, start + 1) >= 0) throw new Error('board group not found exactly once')
const re = /<g[\s>]|<\/g>/g
re.lastIndex = start
let depth = 0
let end = -1
for (let m; (m = re.exec(markup)); ) {
  if (m[0] === '</g>') {
    if (--depth === 0) {
      end = m.index + 4
      break
    }
  } else depth++
}
if (end < 0) throw new Error('unbalanced board group')

const SWING_OPEN = '<g class="spot-michishirube-swing" style="--am-period:4.20s;--am-delay:0.00s;--am-a0:-3deg;--am-a1:3deg">'
let board = markup.slice(start, end)
if (!board.includes(SWING_OPEN)) throw new Error('swing group not found')
board = board.replace(SWING_OPEN, '<g>')

// Pivot: the swing group's local origin (0,0) under the outer matrix -> viewBox (31.3582, 13.0607)
// in a 48x64 viewBox rendered in a 48x64 box.
const px = ((31.3582 / 48) * 100).toFixed(2)
const py = ((13.0607 / 64) * 100).toFixed(2)
const OLD_RULE =
  '.iso-spot-michishirube .spot-michishirube-swing{transform-box:view-box;transform-origin:0 0;animation:spot-michishirube-swing var(--am-period,3s) cubic-bezier(.45,0,.55,1) var(--am-delay,0s) infinite}'
const OLD_REDUCED = '@media (prefers-reduced-motion:reduce){.iso-spot-michishirube .spot-michishirube-swing{animation:none!important}}'
const NEW_RULE = `.iso-spot-michishirube[data-art-layer="board"]{--am-a0:-3deg;--am-a1:3deg;transform-origin:${px}% ${py}%;animation:spot-michishirube-swing 4.2s cubic-bezier(.45,0,.55,1) infinite}`
const NEW_REDUCED = '@media (prefers-reduced-motion:reduce){.iso-spot-michishirube[data-art-layer="board"]{animation:none!important}}'
let base = markup.slice(0, start) + markup.slice(end)
for (const [from, to] of [
  [OLD_RULE, NEW_RULE],
  [OLD_REDUCED, NEW_REDUCED],
]) {
  if (!base.includes(from)) throw new Error(`rule not found: ${from.slice(0, 60)}`)
  base = base.replace(from, to)
}

const header = src.slice(0, src.indexOf('export const SPOT_MICHISHIRUBE_VIEWBOX'))
const note = ` * Capas: la tablilla va en SPOT_MICHISHIRUBE_BOARD_MARKUP, un <svg> apilado encima (data-art-layer="board")
 * que oscila con transform en el propio elemento (compuesto en GPU, sin repintar). Partido del marcado
 * original con split-michishirube.mjs; si se regenera el spot, hay que volver a partirlo.
 */
`
const newHeader = header.replace(/ \*\/\s*$/, note + '\n')
const out =
  newHeader +
  `export const SPOT_MICHISHIRUBE_VIEWBOX = '0 0 48 64'\n\n` +
  `export const SPOT_MICHISHIRUBE_MARKUP = ${JSON.stringify(base)}\n\n` +
  `/** Tablilla del poste (sin <style>: usa el del marcado base, acotado a .iso-spot-michishirube). */\n` +
  `export const SPOT_MICHISHIRUBE_BOARD_MARKUP = ${JSON.stringify(board)}\n`
writeFileSync(file, out)
console.log('base', base.length, 'board', board.length, 'pivot', px, py)
