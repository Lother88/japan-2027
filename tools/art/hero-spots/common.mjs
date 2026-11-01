// Shared camera, palette, part helpers and export for the eight hero spots of the japan-2027
// landing (stat chips, scroll cue, theme toggle, route band, footer). Same contract as the
// approved hero draft (hero-draft/build.mjs): azimuth 40, elevation 30, the site's tokens as
// ramps, wood/stone material language, a wooden plinth with a soft halo, CSS-only motion.
//
// Every spot build calls `camera()` once with its fit points, draws with the helpers below,
// and hands its body to `emit()`, which writes:
//   <name>/<name>-light.svg|.html, <name>/<name>-dark.svg|.html   standalone, kit classes (checks)
//   out/<camelName>.markup.ts                                      site drop, everything prefixed
//   manifest/<name>.json                                           for the contact sheet

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SKILL = ((process.env.ANATOMY_ASSET_DIR ?? `${process.env.USERPROFILE ?? process.env.HOME}/.claude/skills/anatomy-asset`).replace(/[\\/]?$/, "/"));
export const k = await import(pathToFileURL(SKILL + "kit/iso-kit.mjs").href);
export const a = await import(pathToFileURL(SKILL + "kit/asset.mjs").href);
export const G = await import(pathToFileURL(SKILL + "kit/lathe.mjs").href);

export const ROOT = dirname(fileURLToPath(import.meta.url));
export const WEIGHT = 0.5;
export const AZIMUTH = 40;

// ---------- site palette: src/styles/index.css (light ~l.11-15, dark ~l.25-29) ----------
export const SITE = {
  light: { paper: "#fbf6f0", surface: "#fffdf9", ink: "#1b2a4a", slate: "#5a5e6b", gold: "#b08534", amber: "#b48a35", brown: "#8a5a3b", green: "#3f6f5f", coral: "#c24a5a", coral2: "#e0564b", footer: "#14203a" },
  dark: { paper: "#12141b", surface: "#1b1f2c", ink: "#f1ece1", slate: "#9aa0ad", gold: "#d9a948", amber: "#e2a743", brown: "#c89a6a", green: "#76b89a", coral: "#ff7a6f", coral2: "#ff6f62", footer: "#14203a" },
};
export const mix = (x, y, t) => {
  const p = a.hexToRgb(x);
  const q = a.hexToRgb(y);
  return `#${p.map((v, i) => Math.round((v * (1 - t) + q[i] * t) * 255).toString(16).padStart(2, "0")).join("")}`;
};
// The hero's material families (hero-draft accentsFor), so the spots sit in the same world.
export function family(theme) {
  const s = SITE[theme];
  const L = theme === "light";
  return {
    wood: s.brown,
    moss: mix(s.green, s.paper, L ? 0.4 : 0.25),
    pine: s.green,
    roof: mix(s.brown, L ? s.ink : s.paper, L ? 0.42 : 0.45),
    plaster: L ? s.paper : s.ink,
    ebony: L ? mix(s.ink, s.paper, 0.08) : mix(s.paper, s.ink, 0.1),
    coral: s.coral,
    coral2: s.coral2,
    amber: s.amber,
    gold: L ? mix(s.gold, s.paper, 0.12) : s.gold,
    // Granite for lanterns and footings: slate pulled toward the page.
    stone: mix(s.slate, s.paper, L ? 0.45 : 0.3),
    green: s.green,
    // Lamp glass: dark panes by day, lit amber panes (ink accent) at night.
    pane: L ? mix(s.ink, s.paper, 0.08) : { hex: s.amber, mode: "ink" },
  };
}

// ---------- camera (set once per spot) ----------
export let P = null;
export function camera(points, W, H, pad = 4) {
  P = a.fitInto(points, { x: 0, y: 0, w: W, h: H }, { pad, azimuth: AZIMUTH });
  return P;
}
export const at = (p) => k.iso(p, P);
export const S = (paths, style) => k.solidSvg(paths, style);
export const L = (d, style) => k.lineSvg(d, style);
export const D = (pts, style) => k.dotsSvg(pts.map(at), style);
export const ac = (name) => (svg) => `<g class="ac-${name}">${svg}</g>`;
export const depth = (p) => k.depthOf([p[0], p[1], p[2] ?? 0], P);
export const byDepth = (items, key = (i) => i) => [...items].sort((p, q) => depth(key(p)) - depth(key(q)));
export const pathOf = (pts, closed) => k.pathOf(pts, closed);
export const box = (x0, x1, y0, y1, r = 0) => ({ x: x0, y: y0, w: x1 - x0, d: y1 - y0, r });

let solids = 0;
export const count = (svg) => { solids++; return svg; };
export const solidCount = () => solids;

export const slab = (plan, z, h, opts = {}, steps = 2, bevel = 0) => count(S(k.slabOf(plan, z, h, P, steps, bevel), opts));
export const cyl = (x, y, r, z, h, opts = {}, steps = 16, bevel = 0) => count(S(k.cylinder(x, y, r, z, h, P, steps, bevel), opts));
export const solid = (paths, opts = {}) => count(S(paths, opts));
// A soft shadow under a part; blur in viewBox units (spots are small canvases).
export const halo = (plan, z, blur = 2) => `<path class="iso-halo" d="${k.slabOf(plan, z, 0.1, P, 3).fill}" style="filter:blur(${blur}px);transform:translateY(.5px)"/>`;

// Things on vertical faces: face "x" is the plane x = c (u runs along y), "y" is y = c (u along x).
export const fp = (face, c, u, z) => at(face === "x" ? [c, u, z] : [u, c, z]);
export const faceLine = (face, c, u0, z0, u1, z1) => pathOf([fp(face, c, u0, z0), fp(face, c, u1, z1)]);
export const faceRect = (face, c, u0, u1, z0, z1) => pathOf([[u0, z0], [u1, z0], [u1, z1], [u0, z1]].map(([u, z]) => fp(face, c, u, z)), true);
export const facePoly = (face, c, pts) => pathOf(pts.map(([u, z]) => fp(face, c, u, z)), true);

// ---------- a closed polyhedron, shaded like the kit's solids (hero draft / Kinkaku-ji) ----------
export function polySolid(faces, { creaseCos = 0.97 } = {}) {
  const V = G.viewOf(P);
  const Lt = G.lightOf(P);
  const info = [];
  for (const { pts, hint, group } of faces) {
    let n = [0, 0, 0];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const q = pts[(i + 1) % pts.length];
      n[0] += (p[1] - q[1]) * (p[2] + q[2]);
      n[1] += (p[2] - q[2]) * (p[0] + q[0]);
      n[2] += (p[0] - q[0]) * (p[1] + q[1]);
    }
    if (G.len3(n) < 1e-9) continue;
    n = G.unit3(n);
    if (G.dot3(n, hint) < 0) n = G.mul3(n, -1);
    info.push({ pts, n, group, vis: G.dot3(n, V) > 1e-6 });
  }
  const groups = new Map();
  for (const f of info) if (f.group) groups.set(f.group, G.add3(groups.get(f.group) ?? [0, 0, 0], f.n));
  for (const f of info) if (f.group) f.vis = G.dot3(groups.get(f.group), V) > 1e-6;
  const key = (p) => p.map((v) => v.toFixed(3)).join(",");
  const edges = new Map();
  info.forEach((f, fi) => {
    for (let i = 0; i < f.pts.length; i++) {
      const p = f.pts[i];
      const q = f.pts[(i + 1) % f.pts.length];
      const kp = key(p);
      const kq = key(q);
      if (kp === kq) continue;
      const id = kp < kq ? `${kp}|${kq}` : `${kq}|${kp}`;
      if (!edges.has(id)) edges.set(id, { p, q, faces: [] });
      edges.get(id).faces.push(fi);
    }
  });
  const outline = [];
  const crease = [];
  for (const { p, q, faces: fs } of edges.values()) {
    const vis = fs.map((fi) => info[fi].vis);
    const seg = pathOf([at(p), at(q)]);
    if (fs.length === 1) { if (vis[0]) outline.push(seg); continue; }
    if (vis[0] !== vis[1]) outline.push(seg);
    else if (vis[0] && G.dot3(info[fs[0]].n, info[fs[1]].n) < creaseCos) crease.push(seg);
  }
  const area = (pp) => pp.reduce((s, p, i) => { const q = pp[(i + 1) % pp.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);
  const buckets = [[], [], [], [], []];
  const fill = [];
  for (const f of info) {
    if (!f.vis) continue;
    let pp = f.pts.map(at);
    if (area(pp) < 0) pp = pp.reverse();
    const d = pathOf(pp, true);
    fill.push(d);
    buckets[G.bandOf(G.dot3(f.n, Lt))].push(d);
  }
  return { fill: fill.join(""), outline: outline.join(""), crease: crease.join(""), top: buckets[4].join(""), shades: buckets.slice(0, 4).map((b) => b.join("")) };
}

// A prism of any (also concave) 2D polygon in the plane (u, v) through o, extruded along a.
export function prismFaces(poly, { o, u, v, a: ax }, s0, s1) {
  const W3 = (s, [x, y]) => [o[0] + ax[0] * s + u[0] * x + v[0] * y, o[1] + ax[1] * s + u[1] * x + v[1] * y, o[2] + ax[2] * s + u[2] * x + v[2] * y];
  const area = poly.reduce((s, p, i) => { const q = poly[(i + 1) % poly.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);
  const sgn = area > 0 ? 1 : -1;
  const faces = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const n2 = [(q[1] - p[1]) * sgn, -(q[0] - p[0]) * sgn];
    const hint = [u[0] * n2[0] + v[0] * n2[1], u[1] * n2[0] + v[1] * n2[1], u[2] * n2[0] + v[2] * n2[1]];
    faces.push({ pts: [W3(s0, p), W3(s0, q), W3(s1, q), W3(s1, p)], hint });
  }
  faces.push({ pts: poly.map((p) => W3(s0, p)), hint: G.mul3(ax, -1) });
  faces.push({ pts: poly.map((p) => W3(s1, p)), hint: ax });
  return faces;
}
export const prism = (poly, frame, s0, s1, opts) => polySolid(prismFaces(poly, frame, s0, s1), opts);
// A profile in the x–z plane extruded along y, or in the y–z plane extruded along x.
export const frameXZ = (x0 = 0, z0 = 0) => ({ o: [x0, 0, z0], u: [1, 0, 0], v: [0, 0, 1], a: [0, 1, 0] });
export const frameYZ = (y0 = 0, z0 = 0) => ({ o: [0, y0, z0], u: [0, 1, 0], v: [0, 0, 1], a: [1, 0, 0] });

// A round rod lying along world axis "x" or "y" (pins, rivets, a pencil's eraser, rails).
export function rod(axis, s0, s1, c, r, z, steps = 12) {
  const circ = Array.from({ length: steps }, (_, i) => [Math.cos((i / steps) * Math.PI * 2) * r, Math.sin((i / steps) * Math.PI * 2) * r]);
  const frame = axis === "y" ? { o: [c, 0, z], u: [1, 0, 0], v: [0, 0, 1], a: [0, 1, 0] } : { o: [0, c, z], u: [0, 1, 0], v: [0, 0, 1], a: [1, 0, 0] };
  return prism(circ, frame, s0, s1, { creaseCos: 0.5 });
}

// A frustum between two axis-aligned rectangles (a battered stone, a tapering post).
export function frustum(lo, z0, hi, z1) {
  const ring = (p, z) => [[p.x, p.y, z], [p.x + p.w, p.y, z], [p.x + p.w, p.y + p.d, z], [p.x, p.y + p.d, z]];
  const A = ring(lo, z0);
  const B = ring(hi, z1);
  const outs = [[0, -1, 0], [1, 0, 0], [0, 1, 0], [-1, 0, 0]];
  const faces = [];
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    faces.push({ pts: [A[i], A[j], B[j], B[i]], hint: G.add3(outs[i], [0, 0, 0.3]) });
  }
  faces.push({ pts: B, hint: [0, 0, 1] });
  faces.push({ pts: A, hint: [0, 0, -1] });
  return polySolid(faces);
}

// A gable roof over a rectangle: ridge along `axis` ("x" or "y"), eaves overhang `ov`, rise `h`,
// slab thickness `t`. The two slopes and the gable ends are one solid.
export function gable(plan, z, h, { axis = "y", ov = 1.5, t = 0.8 } = {}) {
  const x0 = plan.x - ov;
  const x1 = plan.x + plan.w + ov;
  const y0 = plan.y - ov;
  const y1 = plan.y + plan.d + ov;
  if (axis === "y") {
    const xm = (x0 + x1) / 2;
    const half = (x1 - x0) / 2;
    const prof = [[-half, 0], [-half, t], [0, h + t], [half, t], [half, 0], [0, h]];
    return prism(prof, { o: [xm, 0, z], u: [1, 0, 0], v: [0, 0, 1], a: [0, 1, 0] }, y0, y1, { creaseCos: 0.9 });
  }
  const ym = (y0 + y1) / 2;
  const half = (y1 - y0) / 2;
  const prof = [[-half, 0], [-half, t], [0, h + t], [half, t], [half, 0], [0, h]];
  return prism(prof, { o: [0, ym, z], u: [0, 1, 0], v: [0, 0, 1], a: [1, 0, 0] }, x0, x1, { creaseCos: 0.9 });
}

// A small rough stone (garden stones, a footing).
export function stone(cx, cy, r, h, z, seed, tone = "mid") {
  const ring = [];
  for (let i = 0; i < 7; i++) {
    const t = (i / 7) * Math.PI * 2;
    const rr = r * (0.78 + 0.22 * Math.abs(Math.sin(seed * 3.1 + i * 1.7)));
    ring.push([cx + Math.cos(t) * rr * 1.15, cy + Math.sin(t) * rr]);
  }
  return count(S(k.extrude(G.hullOf(ring), z, h, P), { tone }));
}

// The family's base: a wooden plinth with a bevel, a side seam and a soft halo.
export function woodPlinth(plan, z0, h, { blur = 2.4, steps = 5 } = {}) {
  return halo(k.insetPlan(plan, -1.5), z0, blur) +
    ac("wood")(slab(plan, z0, h, { tone: "mid", inner: L(k.sideSeam(plan, z0 + h * 0.45, P, steps), { tone: "faint" }) }, steps, 0.5));
}

// A swing in a vertical plane about `pivot`, applied to parts already drawn in screen space:
// M · R(θ) · M⁻¹ with M the plane's matrix, so points in that plane turn exactly as the real
// part would (the kit's amSwing turns plane-coordinate drawings; this wraps projected ones).
export function swingInPlane(svg, pivot, u, v, opts) {
  const o = at(pivot);
  const pu = at(pivot.map((c, i) => c + u[i]));
  const pv = at(pivot.map((c, i) => c + v[i]));
  const m = [pu[0] - o[0], pu[1] - o[1], pv[0] - o[0], pv[1] - o[1]];
  const det = m[0] * m[3] - m[1] * m[2];
  const inv = [m[3] / det, -m[1] / det, -m[2] / det, m[0] / det];
  const e = -(inv[0] * o[0] + inv[2] * o[1]);
  const f = -(inv[1] * o[0] + inv[3] * o[1]);
  const n = (x) => +x.toFixed(5);
  const back = `matrix(${inv.map(n).join(" ")} ${n(e)} ${n(f)})`;
  return a.amSwing(`<g transform="${back}">${svg}</g>`, a.planeMatrix(pivot, u, v, P), opts);
}

// ---------- size: lossless path minifier (hero draft) ----------
const num = (t) => (t / 10).toString().replace(/^(-?)0\./, "$1.");
function minifyD(d) {
  if (!/^[MLZ0-9 .\-]+$/.test(d)) return d;
  const tokens = d.match(/[MLZ]|-?\d*\.?\d+/g);
  let out = "";
  let cx = 0, cy = 0, sx = 0, sy = 0, first = true, prev = "";
  for (let i = 0; i < tokens.length; ) {
    const c = tokens[i++];
    if (c === "Z") { out += "z"; cx = sx; cy = sy; prev = "z"; continue; }
    const x = Math.round(parseFloat(tokens[i++]) * 10);
    const y = Math.round(parseFloat(tokens[i++]) * 10);
    const dx = first ? x : x - cx;
    const dy = first ? y : y - cy;
    const cmd = c === "M" ? (first ? "M" : "m") : "l";
    const pair = num(dx) + (dy < 0 ? "" : " ") + num(dy);
    out += (cmd === prev && cmd === "l" ? (dx < 0 ? "" : " ") : cmd) + pair;
    prev = cmd;
    first = false;
    cx = x; cy = y;
    if (c === "M") { sx = x; sy = y; }
  }
  return out;
}
export const minify = (svg) => svg.replace(/ d="([^"]*)"/g, (_, d) => ` d="${minifyD(d)}"`);

// ---------- ship ----------
const GROUNDS = {
  surface: { var: "var(--surface)", hex: (t) => SITE[t].surface, theme: (t) => t },
  paper: { var: "var(--paper)", hex: (t) => SITE[t].paper, theme: (t) => t },
  // The site footer is navy in both themes (SiteFooter.astro, #14203a = light --primary-press).
  footer: { var: null, hex: () => SITE.light.footer, theme: () => "dark" },
};
const MOTION = {
  float: { kf: "{0%,100%{transform:translate(0,0)}50%{transform:translate(var(--am-dx,0),var(--am-dy,0))}}", rule: "animation:K var(--am-period,6s) cubic-bezier(.45,0,.55,1) var(--am-delay,0s) infinite" },
  pulse: { kf: "{0%,100%{opacity:var(--am-min,.35)}50%{opacity:1}}", rule: "animation:K var(--am-period,3.2s) cubic-bezier(.45,0,.55,1) var(--am-delay,0s) infinite" },
  blink: { kf: "{0%,100%{opacity:var(--am-min,.15)}8%,30%{opacity:1}}", rule: "animation:K var(--am-period,2.4s) linear var(--am-delay,0s) infinite" },
  swing: { kf: "{0%,100%{transform:rotate(var(--am-a0,-10deg))}50%{transform:rotate(var(--am-a1,10deg))}}", rule: "transform-box:view-box;transform-origin:0 0;animation:K var(--am-period,3s) cubic-bezier(.45,0,.55,1) var(--am-delay,0s) infinite" },
};
const camel = (name) => name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const SNAKE = (name) => name.replace(/-/g, "_").toUpperCase();

// name: "spot-koyomi"; ground: surface|paper|footer; render: {w,h} CSS px the integrator uses.
// motionTheme: "both" | "dark" (animations only under [data-theme="dark"]).
// Custom classes in the body: "x-night" shows only in dark, "x-day" only in light.
export function emit({ name, W, H, render, ground, label, body, accentsFor, motionTheme = "both", doc }) {
  const dir = join(ROOT, name);
  mkdirSync(dir, { recursive: true });
  const g = GROUNDS[ground];
  const art = minify(body);
  const used = Object.keys(MOTION).filter((m) => art.includes(`class="am-${m}"`));
  if (/class="am-(spin|press|loop|draw|flip|shadow)"/.test(art)) throw new Error("unsupported motion class");

  // Standalone SVGs (kit classes, kit ambient CSS): the files the checks run on.
  for (const theme of ["light", "dark"]) {
    const id = `${name}-${theme}`;
    const s = `#${id}`;
    const css = [
      theme === "dark" ? `${s} .x-day{display:none}` : `${s} .x-night{display:none}`,
      motionTheme === "dark" && theme === "light" ? `${s} .am-pulse,${s} .am-blink,${s} .am-swing,${s} .am-float{animation:none}` : "",
    ].join("\n");
    const svg = a.assetSvg({ width: W, height: H, label, body: art, paper: g.hex(theme), theme: g.theme(theme), accents: accentsFor(theme), weight: WEIGHT, id, css });
    writeFileSync(join(dir, `${id}.svg`), svg);
    writeFileSync(join(dir, `${id}.html`), a.previewHtml({ title: id, svg, paper: g.hex(theme), width: W * 4 }));
  }

  // site drop: one geometry, both themes, every class, keyframe and id prefixed with `name-`.
  const scope = `.iso-${name}`;
  const dark = `[data-theme="dark"] ${scope}`;
  const pre = `${name}-`;
  // Compact, prefixed classes: one class per kit path (fill, shade N, top, line + tone).
  const TONE = { hi: "h", mid: "m", lo: "o", faint: "f", lit: "x" };
  const renameClass = (c) => {
    if (c.startsWith("ac-")) return pre + c;
    if (c.startsWith("am-")) return pre + c.slice(3);
    if (c.startsWith("x-")) return pre + c.slice(2);
    return c;
  };
  const rewrite = (tag, attrs) => {
    const cls = (attrs.match(/class="([^"]*)"/) || [])[1] ?? "";
    const tone = (attrs.match(/ data-tone="([a-z]+)"/) || [])[1];
    const list = cls.split(/\s+/).filter(Boolean);
    let rest = attrs.replace(/ class="[^"]*"/, "").replace(/ data-tone="[^"]*"/, "").replace(/ data-free="[^"]*"/, "");
    let c;
    if (list.includes("iso-solid")) c = "s";
    else if (list.includes("iso-fill")) c = "f";
    else if (list.includes("iso-shade")) { c = (rest.match(/ data-shade="(\d)"/) || [])[1]; rest = rest.replace(/ data-shade="\d"/, ""); }
    else if (list.includes("iso-top")) c = "t";
    else if (list.includes("iso-halo")) c = "h";
    else if (list.includes("iso-line")) c = (list.includes("iso-edge") && art.includes("data-lit") ? "e" : "l") + TONE[tone ?? "lo"];
    else if (list.includes("iso-dots")) c = "d" + TONE[tone ?? "mid"];
    else if (list.includes("iso-fade")) c = null;
    else if (list.length) return `<${tag} class="${list.map(renameClass).join(" ")}"${rest}`;
    else return `<${tag}${rest}`;
    return c == null ? `<${tag}${rest}` : `<${tag} class="${pre}${c}"${rest}`;
  };
  const tsArt = art
    .replace(/<(path|g|circle)((?:\s[^>]*?)?)(?=\/?>)/g, (_, tag, attrs) => rewrite(tag, attrs))
    .replace(/ id="([^"]+)"/g, ` id="${pre}$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${pre}$1)`);
  const has = (c) => tsArt.includes(`class="${pre}${c}"`);
  const S0 = scope;
  const c = (x) => `${S0} .${pre}${x}`;
  const lineCls = ["e", "l"].flatMap((p) => Object.values(TONE).map((t) => p + t)).filter(has);
  const toneVar = { h: "hi", m: "mid", o: "lo", f: "faint", x: "lit" };
  const lit = tsArt.includes("data-lit");
  const scopedRules = [
    `${S0} path,${S0} circle{vector-effect:non-scaling-stroke}`,
    `${c("f")}{fill:var(--anatomy-paper)}`,
    ...["0", "1", "2", "3"].filter(has).map((n) => `${c(n)}{fill:var(--anatomy-shade-${n})}`),
    has("t") ? `${c("t")}{fill:var(--anatomy-top)}` : "",
    lit ? `${c("s")}[data-lit]>.${pre}f{fill:var(--anatomy-face)}${c("s")}[data-lit]>.${pre}t{fill:var(--anatomy-lit-top)}${["0", "1", "2", "3"].map((n) => `${c("s")}[data-lit]>.${pre}${n}`).join(",")}{fill:var(--anatomy-lit-shade)}${Object.values(TONE).map((t) => `${c("s")}[data-lit]>.${pre}e${t}`).join(",")}{stroke:var(--anatomy-lit)}` : "",
    has("h") ? `${c("h")}{fill:var(--anatomy-halo);stroke:none;opacity:var(--anatomy-halo-opacity)}` : "",
    lineCls.length ? `${lineCls.map(c).join(",")}{fill:none;stroke-width:var(--anatomy-weight);stroke-linecap:round;stroke-linejoin:round}` : "",
    ...lineCls.map((x) => `${c(x)}{stroke:var(--anatomy-${toneVar[x[1]]})}`),
    ...Object.entries({ h: ".85", m: ".45", o: ".22", f: ".12" }).filter(([t]) => has("d" + t)).map(([t, o]) => `${c("d" + t)} circle{fill:var(--anatomy-dot);stroke:none;opacity:${o}}`),
  ];
  const scoped = scopedRules.filter(Boolean).join("\n");
  const sel = (css) => css.replace(/\.(?!iso-spot-)(ac|am|x)-([a-z0-9-]+)/g, (m) => "." + renameClass(m.slice(1)));
  // Per accent, the tokens its parts actually read: an accent block declares only those.
  const subtrees = (open) => {
    const found = [];
    let i = tsArt.indexOf(open);
    while (i >= 0) {
      let depth = 0;
      const re = /<g[\s>]|<\/g>/g;
      re.lastIndex = i;
      let m;
      while ((m = re.exec(tsArt))) {
        depth += m[0] === "</g>" ? -1 : 1;
        if (depth === 0) { found.push(tsArt.slice(i, re.lastIndex)); break; }
      }
      i = tsArt.indexOf(open, i + 1);
    }
    return found.join("");
  };
  const tokensRead = (sub) => {
    const t = new Set();
    const isLit = sub.includes("data-lit");
    if (sub.includes(`class="${pre}f"`)) { t.add("paper"); if (isLit) t.add("face"); }
    for (const n of ["0", "1", "2", "3"]) if (sub.includes(`class="${pre}${n}"`)) { t.add(`shade-${n}`); if (isLit) t.add("lit-shade"); }
    if (sub.includes(`class="${pre}t"`)) { t.add("top"); if (isLit) t.add("lit-top"); }
    for (const [ch, v] of Object.entries({ h: "hi", m: "mid", o: "lo", f: "faint", x: "lit" })) {
      if (sub.includes(`class="${pre}l${ch}"`) || sub.includes(`class="${pre}e${ch}"`)) t.add(v);
    }
    if (isLit) t.add("lit");
    if (/class="[a-z-]+-d[hmof]"/.test(sub) || sub.includes("var(--anatomy-dot)")) t.add("dot");
    return t;
  };
  const prune = (css) => css.replace(new RegExp(`\\.${pre}ac-([\\w-]+)\\{([^}]*)\\}`, "g"), (whole, n, decls) => {
    const need = tokensRead(subtrees(`<g class="${pre}ac-${n}">`));
    const kept = decls.split(";").filter((d) => need.has(d.split(":")[0].replace("--anatomy-", "")));
    return `.${pre}ac-${n}{${kept.join(";")}}`;
  });
  const usedAccents = (theme) => Object.fromEntries(Object.entries(accentsFor(theme)).filter(([n]) => art.includes(`ac-${n}"`)));
  const tokens = (theme) => {
    const t = g.theme(theme);
    const gt = a.groundTokens(g.hex(theme), { theme: t });
    delete gt.card; delete gt.page;
    gt.paper = g.var ?? g.hex(theme);
    const extra = t === "light" ? { lit: "#000000", "halo-opacity": ".32" } : { lit: "#ffffff", "halo-opacity": ".9" };
    return Object.entries({ ...gt, ...extra, weight: `${WEIGHT}px` }).map(([n, v]) => `--anatomy-${n}:${v}`).join(";");
  };
  const themed = ground !== "footer";
  const motionCss = used.flatMap((m) => {
    const K = `${pre}${m}`;
    const rule = MOTION[m].rule.replace("K", K);
    return [`@keyframes ${K}${MOTION[m].kf}`, motionTheme === "dark" ? `${dark} .${K}{${rule}}` : `${scope} .${K}{${rule}}`];
  });
  const css = [
    `${scope}{${tokens("light")}}`,
    themed ? `${dark}{${tokens("dark")}}` : "",
    prune(sel(a.accentCss(usedAccents(themed ? "light" : "dark"), { scope, theme: themed ? "light" : "dark" }))),
    themed ? prune(sel(a.accentCss(usedAccents("dark"), { scope: dark, theme: "dark" }))) : "",
    scoped,
    art.includes('"x-night') || art.includes(" x-night") ? `${scope} .${pre}night{display:none}${dark} .${pre}night{display:inline}` : "",
    art.includes('"x-day') || art.includes(" x-day") ? `${dark} .${pre}day{display:none}` : "",
    ...motionCss,
    used.length ? `@media (prefers-reduced-motion:reduce){${used.map((m) => `${scope} .${pre}${m}`).join(",")}{animation:none!important}}` : "",
  ].filter(Boolean).join("\n");
  // Drop token declarations nothing in this art reads (lit faces, dots, seamless strokes).
  const unread = [];
  if (!art.includes("data-lit")) unread.push("lit-top", "lit-shade", "face");
  if (!art.includes("data-lit") && !art.includes(`data-tone="lit"`)) unread.push("lit");
  if (!art.includes("iso-dots") && !art.includes("var(--anatomy-dot)")) unread.push("dot");
  const slim = css.replace(new RegExp(`;?--anatomy-(${unread.join("|") || "none-"}):[^;}]+`, "g"), "").replace(/\{;/g, "{");
  // Custom properties are local to the drop: the short `--a-` saves ~1.3 KB per spot.
  const markup = `<style>${slim.replace(/--anatomy-/g, "--a-")}</style><g data-art="">${tsArt.replace(/--anatomy-/g, "--a-")}</g>`;
  const leak = markup.replace(new RegExp(`\\.iso-${name}\\b`, "g"), "").replace(/--a-[a-z0-9-]+|--am-[a-z0-9]+/g, "").match(/(?<![\w-])(am|iso|ac)-[\w-]*|data-(tone|shade|free)/g);
  if (leak) throw new Error(`${name}: unprefixed names survived: ${[...new Set(leak)].join(", ")}`);
  const N = SNAKE(name);
  const ts = `/**
 * ${doc.title} — marcado SVG generado (no editar a mano).
 *
 * Generado con el kit de la skill anatomy-asset (hero-spots/${name}/build.mjs en tools/art), con la misma cámara que el hero (azimut 40°, elevación 30°), grosor de línea
 * ${WEIGHT} y la familia de materiales de la maqueta (madera, piedra, tokens del sitio).
 * ${doc.replaces}
 * Tamaño de render previsto: ${render.w}×${render.h} px (viewBox ${W}×${H}).
 * Colores: tokens de src/styles/index.css (${doc.tokens}); ${doc.ground.replace(/--anatomy-/g, "--a-")}
 * Las variables del kit van abreviadas como \`--a-*\` (locales al asset).
 * Las rampas se derivan de esos hex al generar: si cambia la paleta, hay que regenerar este fichero.
 * Todo el CSS está acotado a \`${scope}\` (claro) y \`${dark}\` (oscuro); clases, keyframes e ids
 * llevan el prefijo \`${pre}\`.
 * Movimiento: ${doc.motion}
 */
export const ${N}_VIEWBOX = '0 0 ${W} ${H}'

export const ${N}_MARKUP = ${JSON.stringify(markup)}
`;
  mkdirSync(join(ROOT, "out"), { recursive: true });
  mkdirSync(join(ROOT, "manifest"), { recursive: true });
  writeFileSync(join(ROOT, "out", `${camel(name)}.markup.ts`), ts);
  writeFileSync(join(ROOT, "manifest", `${name}.json`), JSON.stringify({ name, viewBox: `0 0 ${W} ${H}`, W, H, render, ground, markup }));
  console.log(`${name}: solids ${solids}, markup ${(markup.length / 1024).toFixed(1)} KB, ts ${(ts.length / 1024).toFixed(1)} KB`);
}
