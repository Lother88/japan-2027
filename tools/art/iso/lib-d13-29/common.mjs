import { fileURLToPath as toPath__ } from "node:url";
// Shared helpers for the day 13 / 14 / 27 / 28 / 29 isometric assets of the japan-2027 landing.
// Copied from the approved day-21 pilot (kinkakuji/build.mjs): site palette, polySolid,
// rectRing/roofOf, face helpers, minifier and the TS markup emitter, with the CSS scope and
// animation names parameterised per day (`.iso-dNN`, `dNN-pulse`) so 21 inlined assets never
// collide.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const SKILL = ((process.env.ANATOMY_ASSET_DIR ?? `${process.env.USERPROFILE ?? process.env.HOME}/.claude/skills/anatomy-asset`).replace(/[\\/]?$/, "/"));
export const k = await import(pathToFileURL(SKILL + "kit/iso-kit.mjs").href);
export const a = await import(pathToFileURL(SKILL + "kit/asset.mjs").href);
export const G = await import(pathToFileURL(SKILL + "kit/lathe.mjs").href);

export const W = 440;
export const H = 330;
export const WEIGHT = 0.7;
export const SCRATCH = toPath__(new URL("../..", import.meta.url));

// ---------- site palette (src/styles/index.css, light :root and [data-theme="dark"]) ----------
export const SITE = {
  light: { paper: "#fbf6f0", ink: "#1b2a4a", gold: "#b08534", amber: "#b48a35", coral: "#c24a5a", coral2: "#e0564b", brown: "#8a5a3b", green: "#3f6f5f" },
  dark: { paper: "#12141b", ink: "#f1ece1", gold: "#d9a948", amber: "#e2a743", coral: "#ff7a6f", coral2: "#ff6f62", brown: "#c89a6a", green: "#76b89a" },
};
export const mix = (x, y, t) => {
  const p = a.hexToRgb(x);
  const q = a.hexToRgb(y);
  return `#${p.map((v, i) => Math.round((v * (1 - t) + q[i] * t) * 255).toString(16).padStart(2, "0")).join("")}`;
};

// ---------- per-asset drawing toolkit, bound to one projection ----------
export function toolkit(P) {
  const at = (p) => k.iso(p, P);
  const S = (paths, style) => k.solidSvg(paths, style);
  const L = (d, style) => k.lineSvg(d, style);
  const D = (pts, style) => k.dotsSvg(pts, style);
  const ac = (name) => (svg) => `<g class="ac-${name}">${svg}</g>`;
  const depth = (p) => k.depthOf([p[0], p[1], p[2] ?? 0], P);
  const byDepth = (items, key = (i) => i) => [...items].sort((p, q) => depth(key(p)) - depth(key(q)));
  const pathOf = (pts, closed) => k.pathOf(pts, closed);
  const stats = { solids: 0 };
  const count = (svg) => { stats.solids++; return svg; };

  // A closed polyhedron, shaded like the kit's solids (from the pilot).
  function polySolid(faces, { creaseCos = 0.97 } = {}) {
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

  // A loft through rings of equal point count (each ring a closed loop of 3D points), capped
  // at both ends: towers that taper, a fuselage, a nacelle. `centres[i]` is the axis point of
  // ring i, used to orient each side face outward.
  function loft(rings, centres, { caps = [true, true], creaseCos = 0.9, groupSides = false } = {}) {
    const faces = [];
    const n = rings[0].length;
    for (let r = 0; r < rings.length - 1; r++) {
      const A = rings[r];
      const B = rings[r + 1];
      const c = G.lerp3(centres[r], centres[r + 1], 0.5);
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const mid = G.mul3(G.add3(G.add3(A[i], A[j]), G.add3(B[i], B[j])), 0.25);
        faces.push({ pts: [A[i], A[j], B[j], B[i]], hint: G.sub3(mid, c), group: groupSides ? `s${i}` : undefined });
      }
    }
    const axis = G.sub3(centres[centres.length - 1], centres[0]);
    if (caps[0]) faces.push({ pts: rings[0], hint: G.mul3(axis, -1) });
    if (caps[1]) faces.push({ pts: rings[rings.length - 1], hint: axis });
    return polySolid(faces, { creaseCos });
  }

  // A rectangle ring with `n` points per side; `lift` raises and `flare` pushes out the corners.
  function rectRing(plan, z, n, { lift = 0, flare = 0 } = {}) {
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

  const grow = (plan, by) => k.insetPlan(plan, -by);

  // A hip roof (from the pilot): eave ring with lifted corners sloping up to `inner` at zIn.
  function roofOf(wall, overhang, zEave, inner, zIn, { lift = 3, flare = 2, fascia = 1.6, n = 8 } = {}) {
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

  // Shingle/tile courses across each visible slope of a roofOf roof, hip to hip.
  function courses(roof, ts) {
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

  // A gabled (kirizuma) roof over a wall plan, ridge along `axis` ("x" or "y"), with real
  // thickness: two slabs meeting at the ridge, eaves overhanging by `over`, gables by `gable`.
  // Returns the solid plus the slope frames, for tile rows.
  function gableRoof(wall, zEave, rise, { axis = "x", over = 3, gable = 2, thick = 1.2, droop = 0 } = {}) {
    const alongX = axis === "x";
    const [g0, g1] = Array.isArray(gable) ? gable : [gable, gable];
    const u0 = (alongX ? wall.x : wall.y) - g0;
    const u1 = (alongX ? wall.x + wall.w : wall.y + wall.d) + g1;
    const c = alongX ? wall.y + wall.d / 2 : wall.x + wall.w / 2;
    const half = (alongX ? wall.d : wall.w) / 2 + over;
    const run = half;
    const slope = rise / ((alongX ? wall.d : wall.w) / 2);
    const zE = zEave - over * slope; // eave edge lower than the wall top by the overhang
    const pt = (u, v, z) => (alongX ? [u, v, z] : [v, u, z]);
    const zR = zEave + rise;
    // cross-section (v, z), outward ring: eave-low A, eave-top B, ridge-top R, other side.
    const sec = [
      [c - run, zE - droop], [c - run, zE - droop + thick], [c, zR + thick], [c + run, zE - droop + thick], [c + run, zE - droop], [c, zR],
    ];
    const ring0 = sec.map(([v, z]) => pt(u0, v, z));
    const ring1 = sec.map(([v, z]) => pt(u1, v, z));
    const cen0 = pt(u0, c, (zE + zR) / 2);
    const cen1 = pt(u1, c, (zE + zR) / 2);
    const faces = [];
    const n = sec.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const mid = G.mul3(G.add3(G.add3(ring0[i], ring0[j]), G.add3(ring1[i], ring1[j])), 0.25);
      const cen = G.lerp3(cen0, cen1, 0.5);
      let hint = G.sub3(mid, cen);
      if (i === 1 || i === 2) hint = alongX ? [0, i === 1 ? -0.4 : 0.4, 1] : [i === 1 ? -0.4 : 0.4, 0, 1];
      if (i === 4 || i === 5) hint = [0, 0, -1];
      faces.push({ pts: [ring0[i], ring0[j], ring1[j], ring1[i]], hint });
    }
    const axisV = alongX ? [1, 0, 0] : [0, 1, 0];
    faces.push({ pts: ring0, hint: G.mul3(axisV, -1) });
    faces.push({ pts: ring1, hint: axisV });
    const paths = polySolid(faces, { creaseCos: 0.995 });
    // slope surface points: side s (-1 near v<c, +1 v>c), t across from eave (0) to ridge (1), u along
    const surf = (s, t, u) => {
      const v = c + s * run * (1 - t);
      const z = (zE - droop + thick) + (zR + thick - (zE - droop + thick)) * t;
      return pt(u, v, z);
    };
    return { paths, surf, u0, u1, zE, zR, c, run, alongX, thick, droop };
  }

  // ---------- vertical-face helpers (from the pilot) ----------
  const fp = (face, c, u, z) => at(face === "x" ? [c, u, z] : [u, c, z]);
  const faceLine = (face, c, u0, z0, u1, z1) => pathOf([fp(face, c, u0, z0), fp(face, c, u1, z1)]);
  const faceRect = (face, c, u0, u1, z0, z1) => pathOf([[u0, z0], [u1, z0], [u1, z1], [u0, z1]].map(([u, z]) => fp(face, c, u, z)), true);

  const slab = (plan, z, h, opts = {}, steps = 2, bevel = 0) => count(S(k.slabOf(plan, z, h, P, steps, bevel), opts));
  const cyl = (x, y, r, z, h, opts = {}, steps = 20, bevel = 0) => count(S(k.cylinder(x, y, r, z, h, P, steps, bevel), opts));

  function stone(cx, cy, r, h, z, seed, tone = "mid") {
    const ring = [];
    const m = 7;
    for (let i = 0; i < m; i++) {
      const t = (i / m) * Math.PI * 2;
      const rr = r * (0.78 + 0.22 * Math.abs(Math.sin(seed * 3.1 + i * 1.7)));
      ring.push([cx + Math.cos(t) * rr * 1.15, cy + Math.sin(t) * rr]);
    }
    return count(S(k.extrude(G.hullOf(ring), z, h, P, { bevel: 0.4 }), { tone }));
  }

  // A rounded plinth slab with its halo and side seam, as in the pilot.
  function plinth(PL, z0 = -10, h = 10) {
    const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(PL, -4), z0, 4, P)}"/>`];
    out.push(slab(PL, z0, h, { tone: "mid", inner: L(k.sideSeam(PL, z0 + 6, P, 6), { tone: "faint" }) }, 6, 0));
    return out.join("");
  }

  return { P, at, S, L, D, ac, depth, byDepth, pathOf, stats, count, polySolid, loft, rectRing, grow, roofOf, courses, gableRoof, fp, faceLine, faceRect, slab, cyl, stone, plinth };
}

// ---------- size: lossless path minifier (from the pilot) ----------
const num = (t) => {
  const v = (t / 10).toString();
  return v.replace(/^(-?)0\./, "$1.");
};
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

// ---------- emit: standalone SVGs + previews + the TS markup module ----------
// `nn` is the two-digit day. The standalone files keep the kit's `am-*` motion classes; the
// markup module renames them to `dNN-*` and scopes every rule to `.iso-dNN`.
export function emit({ nn, here, body, label, subject, accentsFor, jsdoc, solids }) {
  const files = [];
  for (const theme of ["light", "dark"]) {
    const name = `day${nn}-${theme}`;
    const svg = a.assetSvg({ width: W, height: H, label, body, paper: SITE[theme].paper, theme, accents: accentsFor(theme), weight: WEIGHT, id: `iso-d${nn}-${theme}` });
    writeFileSync(join(here, `${name}.svg`), svg);
    writeFileSync(join(here, `${name}.html`), a.previewHtml({ title: name, svg, paper: SITE[theme].paper, width: W * 2 }));
    files.push(`${name}.svg (${(svg.length / 1024).toFixed(0)} KB)`);
  }
  const scope = `.iso-d${nn}`;
  const drawing = k.ISO_CSS.split("\n").filter((line) => /^\.(iso-svg|iso-fill|iso-solid|iso-shade|iso-top|iso-halo|iso-line|iso-dots|tb-)/.test(line));
  const scoped = drawing.map((line) => line.replace(/^([^{]+)\{/, (_, sel) => `${sel.split(",").map((s) => `${scope} ${s.trim().replace(/^\.iso-svg /, "")}`).join(",")}{`)).join("\n");
  const tokens = (theme) => {
    const g = a.groundTokens(SITE[theme].paper, { theme });
    delete g.card; delete g.page;
    g.paper = "var(--paper)";
    const extra = theme === "light" ? { lit: "#000000", "halo-opacity": ".32" } : { lit: "#ffffff", "halo-opacity": ".9" };
    return Object.entries({ ...g, ...extra, weight: `${WEIGHT}px` }).map(([n, v]) => `--anatomy-${n}:${v}`).join(";");
  };
  const p = `d${nn}-`;
  const motion = [];
  const used = new Set([...body.matchAll(/class="am-(pulse|blink)"/g)].map((m) => m[1]));
  if (used.has("pulse")) {
    motion.push(`@keyframes ${p}pulse{0%,100%{opacity:var(--am-min,.35)}50%{opacity:1}}`);
    motion.push(`${scope} .${p}pulse{animation:${p}pulse var(--am-period,3.2s) cubic-bezier(.45,0,.55,1) var(--am-delay,0s) infinite}`);
  }
  if (used.has("blink")) {
    motion.push(`@keyframes ${p}blink{0%,100%{opacity:var(--am-min,.15)}8%,30%{opacity:1}}`);
    motion.push(`${scope} .${p}blink{animation:${p}blink var(--am-period,2.4s) linear var(--am-delay,0s) infinite}`);
  }
  if (used.size) motion.push(`@media (prefers-reduced-motion:reduce){${[...used].map((u) => `${scope} .${p}${u}`).join(",")}{animation:none}}`);
  if (/class="am-(?!pulse"|blink")/.test(body)) throw new Error("unsupported motion class in body");
  const css = [
    `${scope}{${tokens("light")}}`,
    `[data-theme="dark"] ${scope}{${tokens("dark")}}`,
    a.accentCss(accentsFor("light"), { scope, theme: "light" }),
    a.accentCss(accentsFor("dark"), { scope: `[data-theme="dark"] ${scope}`, theme: "dark" }),
    scoped,
    ...motion,
  ].join("\n");
  // Gradient ids from fadeLineSvg are content hashes; prefix them per day so no two inlined
  // assets ever share an id.
  const art = body.replace(/class="am-(pulse|blink)"/g, `class="${p}$1"`).replace(/iso-fade-/g, `${p}fade-`);
  const markup = `<style>${css}</style><g data-art="">${art}</g>`;
  const ts = `/**
${jsdoc.map((l) => ` * ${l}`.trimEnd()).join("\n")}
 *
 * Marcado SVG generado con el kit de la skill anatomy-asset (build.mjs en tools/art, iso/day${nn}/) — no editar a mano. Los colores salen de los tokens de src/styles/index.css
 * para tema claro y oscuro: --anatomy-paper usa var(--paper) en vivo y las rampas de tono se
 * derivan de esos hex al generar. Si cambia la paleta, hay que regenerar este fichero.
 * Todo el CSS va acotado a \`.iso-d${nn}\` y la animación usa nombres \`d${nn}-*\`, que se detienen
 * con prefers-reduced-motion.
 */
export const DAY${nn}_ISO_VIEWBOX = '0 0 ${W} ${H}'

export const DAY${nn}_ISO_SUBJECT = ${JSON.stringify(subject).replace(/^"|"$/g, "'")}

export const DAY${nn}_ISO_MARKUP = ${JSON.stringify(markup)}
`;
  const outDir = join(SCRATCH, "iso", "out");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, `day${nn}Iso.markup.ts`), ts);
  console.log(`wrote ${files.join(", ")}`);
  console.log(`wrote out/day${nn}Iso.markup.ts (${(ts.length / 1024).toFixed(1)} KB)`);
  console.log(`solids: ${solids}`);
}

// A rounded plan clipped to a band of y (for banks and strips cut by a river or a grass edge),
// with the duplicate points the clamp creates removed, so no zero-length side face is drawn.
export function clippedPlan(plan, { yMin = -Infinity, yMax = Infinity } = {}, steps = 6) {
  const pts = k.roundedPlan(plan, steps).map(([x, y]) => [x, Math.min(yMax, Math.max(yMin, y))]);
  const out = [];
  for (const p of pts) {
    const q = out[out.length - 1];
    if (!q || Math.hypot(p[0] - q[0], p[1] - q[1]) > 1e-6) out.push(p);
  }
  while (out.length > 1 && Math.hypot(out[0][0] - out[out.length - 1][0], out[0][1] - out[out.length - 1][1]) < 1e-6) out.pop();
  // Drop collinear middle points along the clamped edge.
  return out.filter((p, i) => {
    const a0 = out[(i + out.length - 1) % out.length];
    const b0 = out[(i + 1) % out.length];
    return Math.abs((p[0] - a0[0]) * (b0[1] - a0[1]) - (p[1] - a0[1]) * (b0[0] - a0[0])) > 1e-6;
  });
}
