// Checks on out/heroMaqueta.markup.ts, mirroring src/features/landing/__tests__/isoMarkup.test.ts
// for the layered module, plus xmllint on every layer wrapped in <svg>.
//   node check.mjs
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(HERE, "out", "heroMaqueta.markup.ts"), "utf8");
const str = (name) => { const m = src.match(new RegExp(`export const ${name} = ('([^']*)'|(".*"))\\n`)); return m[2] ?? JSON.parse(m[3]); };
const VIEWBOX = str("HERO_MAQUETA_VIEWBOX");
const VIEWBOX_MOBILE = str("HERO_MAQUETA_VIEWBOX_MOBILE");
const STYLE = str("HERO_MAQUETA_STYLE");
const LAYERS = [...src.matchAll(/\{ name: ("[^"]+"), animated: (true|false), markup: (".*") \},\n/g)].map((m) => ({ name: JSON.parse(m[1]), animated: m[2] === "true", markup: JSON.parse(m[3]) }));
const results = [];
const check = (label, ok, detail = "") => { results.push({ label, ok }); console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? `  — ${detail}` : ""}`); };

check("viewBox de escritorio 1200×640", VIEWBOX === "0 0 1200 640");
{
  const [x, y, w, h] = VIEWBOX_MOBILE.split(" ").map(Number);
  check("viewBox móvil dentro del lienzo", x >= 0 && y >= 0 && x + w <= 1200 && y + h <= 640, VIEWBOX_MOBILE);
}
check("hay capas, la primera es la base estática", LAYERS.length > 1 && LAYERS[0].name === "base" && !LAYERS[0].animated, `${LAYERS.length} capas`);
check("nombres de capa únicos", new Set(LAYERS.map((l) => l.name)).size === LAYERS.length);

// ids: unique across all layers (and the style), prefixed hero-, refs resolve within their own layer.
const all = [STYLE, ...LAYERS.map((l) => l.markup)].join("");
const ids = [...all.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
check("ningún id se repite entre capas", ids.length === new Set(ids).size, `${ids.length} ids`);
check("cada id lleva el prefijo hero-", ids.every((id) => id.startsWith("hero-")));
{
  const missing = [];
  for (const l of LAYERS) {
    const own = new Set([...l.markup.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
    for (const m of l.markup.matchAll(/url\(#([^)]+)\)|href="#([^"]+)"/g)) if (!own.has(m[1] ?? m[2])) missing.push(`${l.name}: ${m[1] ?? m[2]}`);
  }
  check("cada referencia se resuelve dentro de su capa", missing.length === 0, missing.join(", "));
}
// No <style> inside the layers: the CSS is emitted once.
check("las capas no llevan <style> (el CSS va una vez)", LAYERS.every((l) => !l.markup.includes("<style")));

// keyframes prefixed; every selector scoped to .iso-hero; the only .iso-* class is the root.
const keyframes = [...STYLE.matchAll(/@keyframes ([\w-]+)/g)].map((m) => m[1]);
check("cada @keyframes lleva el prefijo hero-", keyframes.every((k) => k.startsWith("hero-")), keyframes.join(" "));
const selectors = (() => {
  const out = [];
  const flat = STYLE.replace(/@keyframes[^{]+\{(?:[^{}]*\{[^}]*\})*[^{}]*\}/g, "");
  for (const [, sel] of flat.matchAll(/([^{}]+)\{[^{}]*\}/g)) {
    const s = sel.trim();
    if (!s || s.startsWith("@")) continue;
    out.push(...s.split(",").map((p) => p.trim()));
  }
  return out;
})();
const loose = selectors.filter((s) => !/\.iso-hero(?![\w-])/.test(s));
check("cada regla de estilo va acotada a .iso-hero", selectors.length > 0 && loose.length === 0, loose.length ? loose.join(" | ") : `${selectors.length} selectores`);
const scopes = new Set([...(STYLE + LAYERS.map((l) => l.markup).join("")).matchAll(/\.(iso-[\w-]+)/g)].map((m) => m[1]));
check("la única clase .iso-* es la raíz", scopes.size === 1 && scopes.has("iso-hero"), [...scopes].join(" "));
// Motion only on animated layers, only transform/opacity, will-change only there.
{
  const animatedNames = new Set(LAYERS.filter((l) => l.animated).map((l) => l.name));
  const bad = [];
  for (const [, sel, body] of STYLE.replace(/@keyframes[^{]+\{(?:[^{}]*\{[^}]*\})*[^{}]*\}/g, "").matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!/animation|will-change/.test(body)) continue;
    const layer = sel.match(/hero-layer-([\w-]+)/)?.[1];
    if (!layer || !animatedNames.has(layer)) bad.push(sel.trim());
  }
  check("animation/will-change solo en capas animadas", bad.length === 0, bad.join(" | "));
  const props = new Set();
  for (const [, body] of STYLE.matchAll(/@keyframes [\w-]+\{((?:[^{}]*\{[^}]*\})*)\}/g)) for (const [, p] of body.matchAll(/([\w-]+):/g)) props.add(p);
  check("los @keyframes solo animan transform/opacity", [...props].every((p) => p === "transform" || p === "opacity"), [...props].join(" "));
  check("ningún elemento dentro de las capas se anima", LAYERS.every((l) => !/class="[^"]*(hero-am-|hero-train|hero-petal|hero-glow)/.test(l.markup) && !/animation/.test(l.markup)));
}
check("prefers-reduced-motion definido", /@media \(prefers-reduced-motion:reduce\)/.test(STYLE) && /@media \(prefers-reduced-motion:no-preference\)/.test(STYLE));

// xmllint: each layer wrapped in <svg>, and the style wrapped in <svg><style>.
const dir = join(HERE, "xml");
mkdirSync(dir, { recursive: true });
const files = LAYERS.map((l) => { const f = join(dir, `layer-${l.name}.svg`); writeFileSync(f, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}">${l.markup}</svg>`); return f; });
const styleFile = join(dir, "style.svg");
writeFileSync(styleFile, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}"><style>${STYLE}</style></svg>`);
let lint = "";
try { lint = execFileSync("sh", ["-c", `xmllint --noout ${[...files, styleFile].map((f) => `'${f.replace(/\\/g, "/")}'`).join(" ")} 2>&1`], { encoding: "utf8" }); } catch (e) { lint = (e.stdout ?? "") + (e.stderr ?? "") || "xmllint failed"; }
check(`xmllint --noout en ${files.length} capas + style`, lint.trim() === "", lint.trim().slice(0, 300));

const failed = results.filter((r) => !r.ok).length;
console.log(failed ? `${failed} FAILED` : `all ${results.length} checks passed`);
process.exit(failed ? 1 : 0);
