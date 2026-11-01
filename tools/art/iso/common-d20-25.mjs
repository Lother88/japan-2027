import { fileURLToPath as toPath__ } from "node:url";
// Shared helpers for the day 20, 22, 23, 24, 25 isometric assets of the japan-2027 landing.
// Copied and generalised from the approved day-21 pilot (kinkakuji/build.mjs): same canvas,
// same camera and fit (so every plinth lands at the same place and scale), same plinth,
// same polyhedron solid, roof, minifier and the same React/TS export shape, scoped per day.

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

// ---------- site palette (src/index.css, light ~l.11-15, dark ~l.25-29) ----------
export const SITE = {
  light: { paper: "#fbf6f0", ink: "#1b2a4a", gold: "#b08534", amber: "#b48a35", brown: "#8a5a3b", green: "#3f6f5f", coral: "#c24a5a", coral2: "#e0564b" },
  dark: { paper: "#12141b", ink: "#f1ece1", gold: "#d9a948", amber: "#e2a743", brown: "#c89a6a", green: "#76b89a", coral: "#ff7a6f", coral2: "#ff6f62" },
};
export const mix = (x, y, t) => {
  const p = a.hexToRgb(x);
  const q = a.hexToRgb(y);
  return `#${p.map((v, i) => Math.round((v * (1 - t) + q[i] * t) * 255).toString(16).padStart(2, "0")).join("")}`;
};
// The pilot's shared families, so every day's moss, water, roof and wood match day 21.
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

// ---------- world: the pilot's plinth and camera ----------
export const PLINTH = { x: -68, y: -64, w: 146, d: 136, r: 8 };
const fitPoints = [...k.boxCorners(PLINTH, -10, 4), [-28, -17, 103], [-58, -53, 26], [2, 19, 26]];
export const P = a.fitInto(fitPoints, { x: 0, y: 0, w: W, h: H }, { pad: 6, azimuth: 40 });

export const at = (p) => k.iso(p, P);
export const S = (paths, style) => k.solidSvg(paths, style);
export const L = (d, style) => k.lineSvg(d, style);
export const ac = (name) => (svg) => `<g class="ac-${name}">${svg}</g>`;
export const depth = (p) => k.depthOf([p[0], p[1], p[2] ?? 0], P);
export const byDepth = (items, key = (i) => i) => [...items].sort((p, q) => depth(key(p)) - depth(key(q)));
export const pathOf = (pts, closed) => k.pathOf(pts, closed);
export const grow = (plan, by) => k.insetPlan(plan, -by);

let solids = 0;
export const count = (svg) => { solids++; return svg; };
export const solidCount = () => solids;

// ---------- a closed polyhedron, shaded like the kit's solids (from the pilot) ----------
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

// A prism of any (also concave) 2D polygon: the polygon lies in the plane spanned by world
// directions u, v through `o`, and is extruded along a from s0 to s1. Returns polySolid faces.
export function prismFaces(poly, { o, u, v, a: ax }, s0, s1, { groupSides = null } = {}) {
  const W3 = (s, [x, y]) => [o[0] + ax[0] * s + u[0] * x + v[0] * y, o[1] + ax[1] * s + u[1] * x + v[1] * y, o[2] + ax[2] * s + u[2] * x + v[2] * y];
  const area = poly.reduce((s, p, i) => { const q = poly[(i + 1) % poly.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);
  const sgn = area > 0 ? 1 : -1;
  const faces = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const n2 = [(q[1] - p[1]) * sgn, -(q[0] - p[0]) * sgn];
    const hint = [u[0] * n2[0] + v[0] * n2[1], u[1] * n2[0] + v[1] * n2[1], u[2] * n2[0] + v[2] * n2[1]];
    faces.push({ pts: [W3(s0, p), W3(s0, q), W3(s1, q), W3(s1, p)], hint, group: groupSides ? groupSides(i) : undefined });
  }
  faces.push({ pts: poly.map((p) => W3(s0, p)), hint: G.mul3(ax, -1) });
  faces.push({ pts: poly.map((p) => W3(s1, p)), hint: ax });
  return faces;
}
export const prism = (poly, frame, s0, s1, opts) => polySolid(prismFaces(poly, frame, s0, s1, opts));
// Frames: a profile in the x–z plane extruded along y, or in the y–z plane extruded along x.
export const frameXZ = (y0 = 0) => ({ o: [0, y0, 0], u: [1, 0, 0], v: [0, 0, 1], a: [0, 1, 0] });
export const frameYZ = (x0 = 0) => ({ o: [x0, 0, 0], u: [0, 1, 0], v: [0, 0, 1], a: [1, 0, 0] });

// A frustum between two axis-aligned rectangles (a battered stone base, a plinth that tapers).
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

// ---------- roofs (from the pilot) ----------
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

// Shingle courses across each visible slope, hip to hip. `sides` limits to some slopes.
export function courses(roof, ts, sides = [0, 1, 2, 3]) {
  const { B, C, n } = roof;
  const V = G.viewOf(P);
  const out = [];
  for (const s of sides) {
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

// An irimoya (hip-and-gable) top over a hip roof's flat inner rectangle, ridge along `axis`.
// Returns { tsuma, gable, ridge, ends } as solid path sets plus the gable roof line courses.
// tsuma: the vertical gable triangle (set back by `inset`); gable: the ∧ roof boards, which
// overhang the triangle by `ov`; ridge: the ridge beam; ends: the ridge's two end points.
export function irimoya(inner, zIn, zRidge, { axis = "y", inset = 2, ov = 1.2, t = 1.4, e = 2, slope = 0.5, ridgeW = 1.6, ridgeH = 1.6 } = {}) {
  const along = axis === "y";
  const a0 = along ? inner.y : inner.x;
  const a1 = along ? inner.y + inner.d : inner.x + inner.w;
  const c0 = along ? inner.x : inner.y;
  const c1 = along ? inner.x + inner.w : inner.y + inner.d;
  const cm = (c0 + c1) / 2;
  const frame = along ? frameXZ(0) : frameYZ(0);
  // In frameXZ the profile is (x, z) extruded along y; in frameYZ it is (y, z) along x.
  const drop = e * slope;
  const tri = [[c0, zIn], [c1, zIn], [cm, zRidge - t]];
  const chevron = [[c0 - e, zIn - drop], [c0 - e, zIn - drop + t], [cm, zRidge], [c1 + e, zIn - drop + t], [c1 + e, zIn - drop], [cm, zRidge - t]];
  const tsuma = prism(tri, frame, a0 + inset, a1 - inset);
  const gable = prism(chevron, frame, a0 - ov, a1 + ov);
  const ridgePlan = along ? { x: cm - ridgeW / 2, y: a0 - ov - 0.4, w: ridgeW, d: a1 - a0 + 2 * ov + 0.8, r: 0 } : { x: a0 - ov - 0.4, y: cm - ridgeW / 2, w: a1 - a0 + 2 * ov + 0.8, d: ridgeW, r: 0 };
  const ridge = k.slabOf(ridgePlan, zRidge - 0.6, ridgeH + 0.6, P, 2, 0.3);
  const ends = along ? [[cm, a0 - ov, zRidge + ridgeH], [cm, a1 + ov, zRidge + ridgeH]] : [[a0 - ov, cm, zRidge + ridgeH], [a1 + ov, cm, zRidge + ridgeH]];
  // Courses on the visible slope of the ∧ (the one facing +x or +y), eave to ridge.
  const lines = [];
  const lo = [c1 + e, zIn - drop + t];
  const hi = [cm, zRidge];
  const p3 = (c, z, s) => (along ? [c, s, z] : [s, c, z]);
  for (const f of [0.3, 0.6]) {
    const c = lo[0] + (hi[0] - lo[0]) * f;
    const z = lo[1] + (hi[1] - lo[1]) * f;
    lines.push(pathOf([at(p3(c, z, a0 - ov)), at(p3(c, z, a1 + ov))]));
  }
  return { tsuma, gable, ridge, ends, courses: lines.join(""), triFace: { c0, c1, cm, zIn, zTop: zRidge - t, at: a1 - inset } };
}

// A shibi / shachihoko-like ridge-end ornament: a fin in the ridge's vertical plane.
// `dir` +1 points its tail outward toward +axis. `size` scales it.
export function shibi(end, axis, dir, size = 1, thick = 1) {
  const pts = [[-2.6, 0], [0.4, 0], [0.9, 1.3], [1.5, 3.1], [2.3, 5.2], [1.4, 5.6], [0.2, 4.1], [-0.9, 3.1], [-2, 2.6], [-2.6, 2.1]]
    .map(([u, z]) => [u * size * dir, z * size]);
  const poly = dir > 0 ? pts : pts.reverse();
  if (axis === "y") return prism(poly.map(([u, z]) => [end[1] + u, end[2] + z]), frameYZ(0), end[0] - thick / 2, end[0] + thick / 2);
  return prism(poly.map(([u, z]) => [end[0] + u, end[2] + z]), frameXZ(0), end[1] - thick / 2, end[1] + thick / 2);
}

// ---------- vertical-face helpers (from the pilot) ----------
export const fp = (face, c, u, z) => at(face === "x" ? [c, u, z] : [u, c, z]);
export const faceLine = (face, c, u0, z0, u1, z1) => pathOf([fp(face, c, u0, z0), fp(face, c, u1, z1)]);
export const faceRect = (face, c, u0, u1, z0, z1) => pathOf([[u0, z0], [u1, z0], [u1, z1], [u0, z1]].map(([u, z]) => fp(face, c, u, z)), true);
export const facePoly = (face, c, pts) => pathOf(pts.map(([u, z]) => fp(face, c, u, z)), true);

export const slab = (plan, z, h, opts = {}, steps = 2, bevel = 0) => count(S(k.slabOf(plan, z, h, P, steps, bevel), opts));
export const cyl = (x, y, r, z, h, opts = {}, steps = 20, bevel = 0) => count(S(k.cylinder(x, y, r, z, h, P, steps, bevel), opts));
export const solid = (paths, opts = {}) => count(S(paths, opts));

// ---------- base: the pilot's plinth ----------
export function plinth() {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(PLINTH, -4), -10, 4, P)}"/>`];
  out.push(slab(PLINTH, -10, 10, { tone: "mid", inner: L(k.sideSeam(PLINTH, -4, P, 6), { tone: "faint" }) }, 6, 0));
  return out.join("");
}

// ---------- garden pieces (from the pilot) ----------
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

// A stone lantern (tōrō): base, post, firebox with two lit windows, cap with a jewel.
export function lantern(x, y, z, s = 1) {
  const u = (v) => v * s;
  const out = [];
  out.push(cyl(x, y, u(3.2), z, u(1.4), { tone: "mid" }, 16, 0.3));
  out.push(cyl(x, y, u(1.1), z + u(1.4), u(5), { tone: "mid" }, 12));
  out.push(slab({ x: x - u(2.8), y: y - u(2.8), w: u(5.6), d: u(5.6), r: 0 }, z + u(6.4), u(1.1), { tone: "mid" }, 2, 0.3));
  const box = { x: x - u(1.9), y: y - u(1.9), w: u(3.8), d: u(3.8), r: 0 };
  const lights = [faceRect("x", x + u(1.9), y - u(0.9), y + u(0.9), z + u(8.1), z + u(9.9)), faceRect("y", y + u(1.9), x - u(0.9), x + u(0.9), z + u(8.1), z + u(9.9))].join("");
  out.push(slab(box, z + u(7.5), u(3), { tone: "mid", inner: L(lights, { tone: "lo" }) }, 2));
  const cap = roofOf(box, u(1.6), z + u(10.5), { x: x - u(0.5), y: y - u(0.5), w: u(1), d: u(1) }, z + u(12.4), { lift: u(0.5), flare: u(0.4), fascia: u(0.5), n: 4 });
  out.push(count(S(cap.paths, { tone: "mid" })));
  out.push(count(S(G.sphereOf([x, y, z + u(13.2)], u(0.9), P, { steps: 24 }), { tone: "mid" })));
  return out.join("");
}

// ---------- motion: a swing in a vertical plane (from the hero spots) ----------
// M . R(theta) . M^-1 with M the plane's matrix: parts already drawn in screen space turn about
// `pivot` exactly as they would in the plane spanned by world directions u and v.
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

// A wisp that rises along a world offset and fades out, then starts again unseen (smoke,
// steam). Not in the kit: emit() ships its keyframes (am-rise) to the standalone SVGs too.
// Under reduced motion it rests where it starts, at the group's own opacity.
const RISE_KF = "{0%{transform:translate(0,0);opacity:0}25%{opacity:var(--am-max,.85)}60%{opacity:calc(var(--am-max,.85)*.6)}100%{transform:translate(var(--am-dx,0),var(--am-dy,0));opacity:0}}";
const RISE_RULE = "animation:K var(--am-period,7s) cubic-bezier(.3,.1,.6,1) var(--am-delay,0s) infinite";
export function amRise(svg, offset, { period = 7000, delay = 0, max = 0.85, rest = 0.55 } = {}) {
  const o = at([0, 0, 0]);
  const b = at(offset);
  const s = (ms) => `${(ms / 1000).toFixed(2)}s`;
  return `<g class="am-rise" style="--am-period:${s(period)};--am-delay:${s(-Math.abs(delay))};--am-max:${max};--am-dx:${(b[0] - o[0]).toFixed(2)}px;--am-dy:${(b[1] - o[1]).toFixed(2)}px;opacity:${rest}">${svg}</g>`;
}

// ---------- size: lossless path minifier (from the pilot) ----------
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

// ---------- ship: standalone SVGs + previews + the scoped TS markup ----------
const OUT = toPath__(new URL("./out", import.meta.url));

export function emit({ dir, nn, subject, label, body, accentsFor, tokensNote, motionNote }) {
  const NN = String(nn).padStart(2, "0");
  for (const theme of ["light", "dark"]) {
    const name = `day${NN}-${theme}`;
    const css = body.includes('class="am-rise"') ? `@keyframes am-rise${RISE_KF}\n#${name} .am-rise{${RISE_RULE.replace("K", "am-rise")}}\n@media (prefers-reduced-motion:reduce){#${name} .am-rise{animation:none}}` : "";
    const svg = a.assetSvg({ width: W, height: H, label, body, paper: SITE[theme].paper, theme, accents: accentsFor(theme), weight: WEIGHT, id: name, css });
    writeFileSync(join(dir, `${name}.svg`), svg);
    writeFileSync(join(dir, `${name}.html`), a.previewHtml({ title: name, svg, paper: SITE[theme].paper, width: W * 2 }));
    console.log(`wrote ${name}.svg (${(svg.length / 1024).toFixed(0)} KB)`);
  }
  console.log(`solids: ${solids}`);

  const scope = `.iso-d${NN}`;
  const pre = `d${NN}-`;
  // The kit's drawing rules, minus its dash-flow and dot-pulse rules: no day draws a
  // [data-flow] line or a [data-pulse] dot, and their @keyframes (iso-flow, iso-pulse) are not
  // shipped, so those rules were dead references.
  const drawing = k.ISO_CSS.split("\n")
    .filter((line) => /^\.(iso-svg|iso-fill|iso-solid|iso-shade|iso-top|iso-halo|iso-line|iso-dots|tb-)/.test(line))
    .filter((line) => !/data-flow|data-pulse|iso-flow|iso-pulse/.test(line));
  const scoped = drawing.map((line) => line.replace(/^([^{]+)\{/, (_, sel) => `${sel.split(",").map((s) => `${scope} ${s.trim().replace(/^\.iso-svg /, "")}`).join(",")}{`)).join("\n");
  const tokens = (theme) => {
    const g = a.groundTokens(SITE[theme].paper, { theme });
    delete g.card; delete g.page;
    g.paper = "var(--paper)";
    const extra = theme === "light" ? { lit: "#000000", "halo-opacity": ".32" } : { lit: "#ffffff", "halo-opacity": ".9" };
    return Object.entries({ ...g, ...extra, weight: `${WEIGHT}px` }).map(([n, v]) => `--anatomy-${n}:${v}`).join(";");
  };
  // Ambient motion: the kit's am-* helpers, renamed to day-prefixed classes, keyframes and
  // custom properties (--dNN-period, --dNN-delay, ...).
  const MOTION = {
    float: { kf: "{0%,100%{transform:translate(0,0)}50%{transform:translate(var(--am-dx,0),var(--am-dy,0))}}", rule: "animation:K var(--am-period,6s) cubic-bezier(.45,0,.55,1) var(--am-delay,0s) infinite" },
    pulse: { kf: "{0%,100%{opacity:var(--am-min,.35)}50%{opacity:1}}", rule: "animation:K var(--am-period,3.2s) cubic-bezier(.45,0,.55,1) var(--am-delay,0s) infinite" },
    blink: { kf: "{0%,100%{opacity:var(--am-min,.15)}8%,30%{opacity:1}}", rule: "animation:K var(--am-period,2.4s) linear var(--am-delay,0s) infinite" },
    swing: { kf: "{0%,100%{transform:rotate(var(--am-a0,-10deg))}50%{transform:rotate(var(--am-a1,10deg))}}", rule: "transform-box:view-box;transform-origin:0 0;animation:K var(--am-period,3s) cubic-bezier(.45,0,.55,1) var(--am-delay,0s) infinite" },
    rise: { kf: RISE_KF, rule: RISE_RULE },
  };
  const used = Object.keys(MOTION).filter((m) => body.includes(`class="am-${m}"`));
  const hasMotion = used.length > 0;
  const motionCss = used.flatMap((m) => {
    const K = `${pre}${m}`;
    return [`@keyframes ${K}${MOTION[m].kf}`, `${scope} .${K}{${MOTION[m].rule.replace("K", K)}}`];
  });
  const css = [
    `${scope}{${tokens("light")}}`,
    `[data-theme="dark"] ${scope}{${tokens("dark")}}`,
    a.accentCss(accentsFor("light"), { scope, theme: "light" }),
    a.accentCss(accentsFor("dark"), { scope: `[data-theme="dark"] ${scope}`, theme: "dark" }),
    scoped,
    ...motionCss,
    hasMotion ? `@media (prefers-reduced-motion:reduce){${used.map((m) => `${scope} .${pre}${m}`).join(",")}{animation:none}}` : "",
  ].filter(Boolean).join("\n").replace(/--am-/g, `--${pre}`);
  // Every id gets the day prefix (fade gradients, clip paths), and every reference follows.
  const ids = new Set([...body.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  const fix = (id) => (ids.has(id) && !id.startsWith(pre) ? pre + id : id);
  const art = body
    .replace(/class="am-(float|pulse|blink|swing|rise)"/g, (_, m) => `class="${pre}${m}"`)
    .replace(/--am-/g, `--${pre}`)
    .replace(/\bid="([^"]+)"/g, (_, id) => `id="${fix(id)}"`)
    .replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${fix(id)})`)
    .replace(/href="#([^"]+)"/g, (_, id) => `href="#${fix(id)}"`);
  const markup = `<style>${css}</style><g data-art="">${art}</g>`;
  if (/(?<![\w-])am-|iso-flow|iso-pulse/.test(markup)) throw new Error("kit motion names leaked into the TS markup");
  const ts = `/**
 * ${subject} isométrico (día ${NN}) — marcado SVG generado (no editar a mano).
 *
 * Generado con el kit de la skill anatomy-asset (iso/day${NN}/build.mjs en el scratchpad de la
 * sesión), con el mismo plinto, cámara y escala que el piloto del día 21 (Kinkaku-ji).
 * Los colores salen de los tokens de src/index.css (${tokensNote}) para tema claro y oscuro:
 * --anatomy-paper usa var(--paper) en vivo y las rampas de tono se derivan de esos hex al
 * generar. Todo el CSS está acotado a \`${scope}\`${hasMotion ? ` y la animación usa ${used.map((m) => `\`@keyframes ${pre}${m}\``).join(", ")} (parada con prefers-reduced-motion)` : ""}.
 * ${motionNote}
 * Si cambia la paleta, hay que regenerar este fichero.
 */
export const DAY${NN}_ISO_VIEWBOX = '0 0 ${W} ${H}'

export const DAY${NN}_ISO_SUBJECT = '${subject}'

export const DAY${NN}_ISO_MARKUP = ${JSON.stringify(markup)}
`;
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, `day${NN}Iso.markup.ts`), ts);
  console.log(`wrote out/day${NN}Iso.markup.ts (${(ts.length / 1024).toFixed(1)} KB)`);
}
