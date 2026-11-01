// Shared helpers for the day 15–19 isometric assets (japan-2027 landing).
// Copied and generalised from the approved day-21 pilot (kinkakuji/build.mjs): same kit, same
// palette derivation, same polySolid / roofOf / minify, same scoped TS markup output.
//
// Each dayNN/build.mjs calls setProjection(P) once, then uses the helpers, then emit(...).

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SKILL = ((process.env.ANATOMY_ASSET_DIR ?? `${process.env.USERPROFILE ?? process.env.HOME}/.claude/skills/anatomy-asset`).replace(/[\\/]?$/, "/"));
export const k = await import(pathToFileURL(SKILL + "kit/iso-kit.mjs").href);
export const a = await import(pathToFileURL(SKILL + "kit/asset.mjs").href);
export const G = await import(pathToFileURL(SKILL + "kit/lathe.mjs").href);

const ISO = dirname(fileURLToPath(import.meta.url));
export const W = 440;
export const H = 330;
export const WEIGHT = 0.7;

// ---------- site palette (src/styles/index.css, light ~l.11-15, dark ~l.25-29) ----------
export const SITE = {
  light: { paper: "#fbf6f0", ink: "#1b2a4a", gold: "#b08534", amber: "#b48a35", coral: "#c24a5a", coral2: "#e0564b", brown: "#8a5a3b", green: "#3f6f5f" },
  dark: { paper: "#12141b", ink: "#f1ece1", gold: "#d9a948", amber: "#e2a743", coral: "#ff7a6f", coral2: "#ff6f62", brown: "#c89a6a", green: "#76b89a" },
};
export const mix = (x, y, t) => {
  const p = a.hexToRgb(x);
  const q = a.hexToRgb(y);
  return `#${p.map((v, i) => Math.round((v * (1 - t) + q[i] * t) * 255).toString(16).padStart(2, "0")).join("")}`;
};
// The pilot's shared families, so the 21 days read as one set. Days add or pick from these.
export function baseAccents(theme) {
  const s = SITE[theme];
  const shadow = theme === "light" ? s.ink : s.paper;
  return {
    gold: theme === "light" ? mix(s.gold, s.paper, 0.12) : s.gold,
    plaster: theme === "light" ? s.paper : s.ink,
    roof: mix(s.brown, shadow, theme === "light" ? 0.42 : 0.45),
    wood: s.brown,
    pine: s.green,
    water: mix(s.green, s.paper, theme === "light" ? 0.62 : 0.5),
    moss: mix(s.green, s.paper, theme === "light" ? 0.4 : 0.25),
    ripple: { hex: s.green, mode: "ink" },
  };
}

// ---------- projection-bound helpers ----------
export let P = null;
export function setProjection(p) { P = p; }
export const at = (p) => k.iso(p, P);
export const S = (paths, style) => k.solidSvg(paths, style);
export const L = (d, style) => k.lineSvg(d, style);
export const D = (pts, style) => k.dotsSvg(pts, style);
export const ac = (name) => (svg) => `<g class="ac-${name}">${svg}</g>`;
export const depth = (p) => k.depthOf([p[0], p[1], p[2] ?? 0], P);
export const byDepth = (items, key = (i) => i) => [...items].sort((p, q) => depth(key(p)) - depth(key(q)));
export const pathOf = (pts, closed) => k.pathOf(pts, closed);
export const grow = (plan, by) => k.insetPlan(plan, -by);

export const counter = { solids: 0 };
export const count = (svg) => { counter.solids++; return svg; };

// A closed polyhedron shaded like the kit's solids (the pilot's polySolid, unchanged).
// faces: [{ pts: Point3[], hint: Point3, group? }]
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

// A polygon section (in the plane across `axis`) extruded along `axis` ("x" or "y") from s0 to s1.
// section: [[u, z], ...] where u is the horizontal coordinate across the axis (y for axis "x",
// x for axis "y"). Works for concave sections (a thick chevron roof). Returns polySolid faces.
export function prismFaces(section, axis, s0, s1) {
  const pt = (s, u, z) => (axis === "x" ? [s, u, z] : [u, s, z]);
  const cu = section.reduce((m, p) => m + p[0], 0) / section.length;
  const cz = section.reduce((m, p) => m + p[1], 0) / section.length;
  const area = section.reduce((m, p, i) => { const q = section[(i + 1) % section.length]; return m + p[0] * q[1] - q[0] * p[1]; }, 0);
  const ccw = area > 0;
  const faces = [];
  for (let i = 0; i < section.length; i++) {
    const p = section[i];
    const q = section[(i + 1) % section.length];
    // outward normal of edge p→q in (u, z): for a CCW ring it is (dz, -du)
    let nu = q[1] - p[1];
    let nz = -(q[0] - p[0]);
    if (!ccw) { nu = -nu; nz = -nz; }
    const hint = axis === "x" ? [0, nu, nz] : [nu, 0, nz];
    faces.push({ pts: [pt(s0, p[0], p[1]), pt(s1, p[0], p[1]), pt(s1, q[0], q[1]), pt(s0, q[0], q[1])], hint });
  }
  const capHint = (sign) => (axis === "x" ? [sign, 0, 0] : [0, sign, 0]);
  faces.push({ pts: section.map(([u, z]) => pt(s0, u, z)), hint: capHint(-1) });
  faces.push({ pts: section.map(([u, z]) => pt(s1, u, z)), hint: capHint(1) });
  void cu; void cz;
  return faces;
}

// A rectangle ring with `n` points per side; `lift` raises and `flare` pushes out the corners.
export function rectRing(plan, z, n, { lift = 0, flare = 0 } = {}) {
  const cs = [[plan.x, plan.y], [plan.x + plan.w, plan.y], [plan.x + plan.w, plan.y + plan.d], [plan.x, plan.y + plan.d]];
  const outs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  const pts = [];
  for (let s = 0; s < 4; s++) {
    const A = cs[s];
    const B = cs[(s + 1) % 4];
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const w = Math.abs(2 * t - 1) ** 4;
      let x = A[0] + (B[0] - A[0]) * t;
      let y = A[1] + (B[1] - A[1]) * t;
      if (i === 0) {
        const prev = outs[(s + 3) % 4];
        x += (prev[0] + outs[s][0]) * flare;
        y += (prev[1] + outs[s][1]) * flare;
      } else {
        x += outs[s][0] * flare * w;
        y += outs[s][1] * flare * w;
      }
      pts.push([x, y, z + lift * w]);
    }
  }
  return pts;
}

// A hip roof (the pilot's roofOf): eave ring with a fascia, sloping up to `inner` at zIn.
export function roofOf(wall, overhang, zEave, inner, zIn, { lift = 3, flare = 2, fascia = 1.6, n = 8 } = {}) {
  const eave = grow(wall, overhang);
  const A = rectRing(eave, zEave, n, { lift, flare });
  const B = rectRing(eave, zEave + fascia, n, { lift, flare });
  const C = rectRing(inner, zIn, n);
  const Dr = rectRing(wall, zEave, n);
  const N = A.length;
  const faces = [];
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N;
    const mid = [(A[i][0] + A[j][0]) / 2 - (wall.x + wall.w / 2), (A[i][1] + A[j][1]) / 2 - (wall.y + wall.d / 2), 0];
    const side = Math.floor(i / n);
    faces.push({ pts: [A[i], A[j], B[j], B[i]], hint: mid, group: `fascia${side}` });
    faces.push({ pts: [B[i], B[j], C[j], C[i]], hint: [mid[0] * 0.02, mid[1] * 0.02, 1], group: `slope${side}` });
    faces.push({ pts: [A[i], A[j], Dr[j], Dr[i]], hint: [0, 0, -1] });
  }
  faces.push({ pts: C, hint: [0, 0, 1] });
  faces.push({ pts: Dr, hint: [0, 0, -1] });
  return { paths: polySolid(faces), A, B, C, n, eave };
}

// Courses across each visible slope of a roofOf roof, hip to hip.
export function courses(roof, ts) {
  const { B, C, n } = roof;
  const V = G.viewOf(P);
  const out = [];
  for (let s = 0; s < 4; s++) {
    const idx = Array.from({ length: n + 1 }, (_, i) => (s * n + i) % B.length);
    const m = idx[n >> 1];
    const m2 = idx[(n >> 1) + 1];
    const nrm = G.cross3(G.sub3(B[m2], B[m]), G.sub3(C[m], B[m]));
    const up = nrm[2] < 0 ? G.mul3(nrm, -1) : nrm;
    if (G.dot3(up, V) <= 0) continue;
    for (const t of ts) out.push(pathOf(idx.map((i) => at(G.lerp3(B[i], C[i], t)))));
  }
  return out.join("");
}

// ---------- vertical-face helpers ----------
export const fp = (face, c, u, z) => at(face === "x" ? [c, u, z] : [u, c, z]);
export const faceLine = (face, c, u0, z0, u1, z1) => pathOf([fp(face, c, u0, z0), fp(face, c, u1, z1)]);
export const faceRect = (face, c, u0, u1, z0, z1) => pathOf([[u0, z0], [u1, z0], [u1, z1], [u0, z1]].map(([u, z]) => fp(face, c, u, z)), true);
export const facePoly = (face, c, pts, closed = true) => pathOf(pts.map(([u, z]) => fp(face, c, u, z)), closed);

export const slab = (plan, z, h, opts = {}, steps = 2, bevel = 0) => count(S(k.slabOf(plan, z, h, P, steps, bevel), opts));
export const cyl = (x, y, r, z, h, opts = {}, steps = 20, bevel = 0) => count(S(k.cylinder(x, y, r, z, h, P, steps, bevel), opts));
export const box = (x0, y0, x1, y1) => ({ x: Math.min(x0, x1), y: Math.min(y0, y1), w: Math.abs(x1 - x0), d: Math.abs(y1 - y0), r: 0 });

export function halo(plan, z, h = 0.1, blur = 0) {
  return `<path class="iso-halo" d="${k.haloOf(plan, z, h, P)}"${blur ? ` style="filter:blur(${blur}px)"` : ""}/>`;
}

// An irregular garden stone (the pilot's stone).
export function stone(cx, cy, r, h, z, seed, tone = "mid") {
  const ring = [];
  const m = 7;
  for (let i = 0; i < m; i++) {
    const t = (i / m) * Math.PI * 2;
    const rr = r * (0.78 + 0.22 * Math.abs(Math.sin(seed * 3.1 + i * 1.7)));
    ring.push([cx + Math.cos(t) * rr * 1.15, cy + Math.sin(t) * rr]);
  }
  return count(S(k.extrude(G.hullOf(ring), z, h, P, { bevel: 0.4 }), { tone }));
}

// A rounded tree pad (two stacked discs, like the pilot's pine pads).
export function pad(x, y, z, r, opts = {}) {
  const h = opts.h ?? 1.3;
  const top = opts.top ?? 0.66;
  return count(S(k.cylinder(x, y, r, z, h, P, 18, 0.4), { tone: "hi", inner: L(k.sideArc(x, y, r, z + h / 2, P, 18), { tone: "faint" }) })) +
    (top ? count(S(k.cylinder(x + 0.3 * (r / 4), y - 0.2 * (r / 4), r * top, z + h, h * 0.85, P, 14, 0.3), { tone: "hi" })) : "");
}

// The base plinth (the pilot's), on any plan.
export function plinth(plan) {
  const out = [halo(k.insetPlan(plan, -4), -10, 4)];
  out.push(slab(plan, -10, 10, { tone: "mid", inner: L(k.sideSeam(plan, -4, P, 6), { tone: "faint" }) }, 6, 0));
  return out.join("");
}

// ---------- size: lossless path minifier (the pilot's) ----------
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

// ---------- output: standalone SVGs + previews + scoped TS markup ----------
export function emit({ day, here, subject, label, body, accentsFor, title }) {
  const NN = String(day).padStart(2, "0");
  for (const theme of ["light", "dark"]) {
    const name = `day${NN}-${theme}`;
    const svg = a.assetSvg({ width: W, height: H, label, body, paper: SITE[theme].paper, theme, accents: accentsFor(theme), weight: WEIGHT, id: name });
    writeFileSync(join(here, `${name}.svg`), svg);
    writeFileSync(join(here, `${name}.html`), a.previewHtml({ title: name, svg, paper: SITE[theme].paper, width: W * 2 }));
    console.log(`wrote ${name}.svg (${(svg.length / 1024).toFixed(0)} KB)`);
  }
  console.log(`solids: ${counter.solids}`);

  const scope = `.iso-d${NN}`;
  const drawing = k.ISO_CSS.split("\n").filter((line) => /^\.(iso-svg|iso-fill|iso-solid|iso-shade|iso-top|iso-halo|iso-line|iso-dots|tb-)/.test(line));
  const scoped = drawing.map((line) => line.replace(/^([^{]+)\{/, (_, sel) => `${sel.split(",").map((s) => `${scope} ${s.trim().replace(/^\.iso-svg /, "")}`).join(",")}{`)).join("\n");
  const tokens = (theme) => {
    const g = a.groundTokens(SITE[theme].paper, { theme });
    delete g.card; delete g.page;
    g.paper = "var(--paper)";
    const extra = theme === "light" ? { lit: "#000000", "halo-opacity": ".32" } : { lit: "#ffffff", "halo-opacity": ".9" };
    return Object.entries({ ...g, ...extra, weight: `${WEIGHT}px` }).map(([n, v]) => `--anatomy-${n}:${v}`).join(";");
  };
  const pulse = `d${NN}-pulse`;
  const css = [
    `${scope}{${tokens("light")}}`,
    `[data-theme="dark"] ${scope}{${tokens("dark")}}`,
    a.accentCss(accentsFor("light"), { scope, theme: "light" }),
    a.accentCss(accentsFor("dark"), { scope: `[data-theme="dark"] ${scope}`, theme: "dark" }),
    scoped,
    `@keyframes ${pulse}{0%,100%{opacity:var(--am-min,.35)}50%{opacity:1}}`,
    `${scope} .${pulse}{animation:${pulse} var(--am-period,3.2s) cubic-bezier(.45,0,.55,1) var(--am-delay,0s) infinite}`,
    `@media (prefers-reduced-motion:reduce){${scope} .${pulse}{animation:none}}`,
  ].join("\n");
  if (/class="am-(?!pulse)/.test(body)) throw new Error("only am-pulse motion is supported in the scoped markup");
  const scopedBody = body.replace(/class="am-pulse"/g, `class="${pulse}"`);
  const markup = `<style>${css}</style><g data-art="">${scopedBody}</g>`;
  const ts = `/**
 * ${title} isométrico (día ${day}) — marcado SVG generado (no editar a mano).
 *
 * Generado con el kit de la skill anatomy-asset (dayNN/build.mjs en tools/art).
 * Los colores salen de los tokens de src/styles/index.css (--paper, --ink, --gold, --brown, --green…)
 * para tema claro y oscuro: --anatomy-paper usa var(--paper) en vivo y las rampas de tono se
 * derivan de esos hex al generar. Todo el CSS va acotado a \`${scope}\` (y
 * \`[data-theme="dark"] ${scope}\`); la animación es \`${pulse}\` y se detiene con
 * prefers-reduced-motion. Si cambia la paleta, hay que regenerar este fichero.
 */
export const DAY${NN}_ISO_VIEWBOX = '0 0 ${W} ${H}'

export const DAY${NN}_ISO_SUBJECT = '${subject}'

export const DAY${NN}_ISO_MARKUP = ${JSON.stringify(markup)}
`;
  const outDir = join(ISO, "out");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, `day${NN}Iso.markup.ts`), ts);
  console.log(`wrote out/day${NN}Iso.markup.ts (${(Buffer.byteLength(ts) / 1024).toFixed(1)} KB)`);
}

// ---------- gable roofs (kirizuma) ----------
// A gable roof whose ridge runs along `axis` ("x" or "y") from s0 to s1. Across the axis the
// roof runs from eave uA up to the ridge uR and down to eave uB; `t` is the board thickness.
// Returns { paths, pt(s, u, top) } — pt gives a point on the top surface, for lines on a slope.
export function gableRoof({ axis, s0, s1, uA, uR, uB, zE, zR, t = 1.6, zEB }) {
  const zb = zEB ?? zE;
  const section = [[uA, zE], [uR, zR], [uB, zb], [uB, zb - t], [uR, zR - t], [uA, zE - t]];
  const paths = polySolid(prismFaces(section, axis, s0, s1), { creaseCos: 0.99 });
  const zOn = (u) => (u <= uR ? zE + ((u - uA) / (uR - uA)) * (zR - zE) : zR + ((u - uR) / (uB - uR)) * (zb - zR));
  const pt = (s, u) => (axis === "x" ? [s, u, zOn(u)] : [u, s, zOn(u)]);
  return { paths, pt, zOn };
}

// A ridge-aligned prism of any convex section, along `axis` (ridge caps, beams, sills).
export function bar(axis, s0, s1, section, opts = {}) {
  return count(S(polySolid(prismFaces(section, axis, s0, s1)), { tone: "hi", ...opts }));
}
