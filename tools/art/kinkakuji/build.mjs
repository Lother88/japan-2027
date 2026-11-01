// Kinkaku-ji (the Golden Pavilion) as an isometric asset for day 21 of the japan-2027 landing.
// A small diorama: a stone plinth whose front is the Kyōko-chi pond, the land behind it, and
// the three-storey pavilion standing at the water's edge on its stone foundation: a plain
// first storey (white plaster, dark wood posts, lattice shutters), two storeys in gold leaf,
// dark shingled hip roofs with upturned corners, and the bronze-gold phoenix on the top roof.
// Two islets with cloud-pruned pines, a stone lantern and shore stones; the gold reflects in
// the pond and the reflection shimmers (CSS only).
//
//   node build.mjs            → kinkakuji-light.svg/.html, kinkakuji-dark.svg/.html (checks)
//                             → ../../<repo>/src/features/landing/kinkakujiIso.markup.ts (React)

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SKILL = ((process.env.ANATOMY_ASSET_DIR ?? `${process.env.USERPROFILE ?? process.env.HOME}/.claude/skills/anatomy-asset`).replace(/[\\/]?$/, "/"));
const k = await import(pathToFileURL(SKILL + "kit/iso-kit.mjs").href);
const a = await import(pathToFileURL(SKILL + "kit/asset.mjs").href);
const G = await import(pathToFileURL(SKILL + "kit/lathe.mjs").href);

const HERE = dirname(fileURLToPath(import.meta.url));
const ISO_OUT = join(HERE, "..", "iso", "out");
const W = 440;
const H = 330;

// ---------- site palette (src/index.css) ----------
const SITE = {
  light: { paper: "#fbf6f0", ink: "#1b2a4a", gold: "#b08534", brown: "#8a5a3b", green: "#3f6f5f" },
  dark: { paper: "#12141b", ink: "#f1ece1", gold: "#d9a948", brown: "#c89a6a", green: "#76b89a" },
};
const mix = (x, y, t) => {
  const p = a.hexToRgb(x);
  const q = a.hexToRgb(y);
  return `#${p.map((v, i) => Math.round((v * (1 - t) + q[i] * t) * 255).toString(16).padStart(2, "0")).join("")}`;
};
function accentsFor(theme) {
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

// ---------- world ----------
const PLINTH = { x: -68, y: -64, w: 146, d: 136, r: 8 };
const WATER_Z = 0.5;
const LAND_Z = 4;
const FOUND = { x: -54, y: -49, w: 52, d: 64, r: 1 };
const DECK = { x: -51.5, y: -46.5, w: 47, d: 59, r: 0.6 };
const WALL1 = { x: -48, y: -43, w: 40, d: 52, r: 0 };
const WALL2 = { x: -47, y: -42, w: 38, d: 50, r: 0 };
const WALL3 = { x: -40, y: -29, w: 24, d: 24, r: 0 };
const BALC = { x: -44, y: -33, w: 32, d: 32, r: 0.4 };
const CX = -28;
const CY = -17;
const Z = { found: 4, deck: 6, w1: 24, r1in: 31, w2: 46, r2in: 52, balc: 53.2, w3: 66, apex: 90 };

const fitPoints = [
  ...k.boxCorners(PLINTH, -10, 4),
  [CX, CY, Z.apex + 13],
  [-58, -53, 26], [2, 19, 26],
];
const P = a.fitInto(fitPoints, { x: 0, y: 0, w: W, h: H }, { pad: 6, azimuth: 40 });

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const ac = (name) => (svg) => `<g class="ac-${name}">${svg}</g>`;
const gold = ac("gold");
const roofAc = ac("roof");
const wood = ac("wood");
const pine = ac("pine");
const water = ac("water");
const moss = ac("moss");
const plaster = ac("plaster");
const ripple = ac("ripple");
const depth = (p) => k.depthOf([p[0], p[1], p[2] ?? 0], P);
const byDepth = (items, key = (i) => i) => [...items].sort((p, q) => depth(key(p)) - depth(key(q)));
const pathOf = (pts, closed) => k.pathOf(pts, closed);
let solids = 0;
const count = (svg) => { solids++; return svg; };

// ---------- a closed polyhedron, shaded like the kit's solids ----------
// faces: [{ pts: Point3[], hint: Point3 }] — hint is a rough outward direction used to orient
// each face's normal. Returns SolidPaths: fill = union of visible faces, outline = silhouette
// edges (visible face next to a hidden one), crease = edges between visible faces that turn.
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
  // Faces of one curved surface (a roof slope with its upturned corner) are seen or hidden
  // together, by their mean normal, so a twisted quad never draws a silhouette mid-surface.
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

// A rectangle ring with `n` points per side; `lift` raises and `flare` pushes out the corners
// (the upturned eaves of a Japanese roof), concentrated near the corners.
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

// A hip roof: eave ring (fascia `fascia` thick, corners lifted), sloping up to `inner` at zIn.
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

// Shingle courses across each visible slope, hip to hip.
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

// ---------- vertical-face helpers ----------
// face "x": the plane x = c (u runs along y); face "y": the plane y = c (u runs along x).
const fp = (face, c, u, z) => at(face === "x" ? [c, u, z] : [u, c, z]);
const faceLine = (face, c, u0, z0, u1, z1) => pathOf([fp(face, c, u0, z0), fp(face, c, u1, z1)]);
const faceRect = (face, c, u0, u1, z0, z1) => pathOf([[u0, z0], [u1, z0], [u1, z1], [u0, z1]].map(([u, z]) => fp(face, c, u, z)), true);
function faceBell(face, c, u0, u1, z0, z1) {
  // A kato-mado: straight jambs, a bell-shaped head with a small point at the top.
  const w = u1 - u0;
  const pts = [[u0, z0], [u1, z0], [u1, z1 - w * 0.55]];
  for (let i = 1; i <= 8; i++) {
    const t = i / 8;
    const ang = Math.PI * t;
    pts.push([u1 - (w / 2) * (1 - Math.cos(ang)), z1 - w * 0.55 + Math.sin(ang) * w * 0.45 + (t > 0.4 && t < 0.6 ? w * 0.1 : 0)]);
  }
  pts.push([u0, z1 - w * 0.55]);
  return pathOf(pts.map(([u, z]) => fp(face, c, u, z)), true);
}

const slab = (plan, z, h, opts = {}, steps = 2, bevel = 0) => count(S(k.slabOf(plan, z, h, P, steps, bevel), opts));
const cyl = (x, y, r, z, h, opts = {}, steps = 20, bevel = 0) => count(S(k.cylinder(x, y, r, z, h, P, steps, bevel), opts));

// ---------- base: plinth, pond, land ----------
function plinth() {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(PLINTH, -4), -10, 4, P)}"/>`];
  out.push(slab(PLINTH, -10, 10, { tone: "mid", inner: L(k.sideSeam(PLINTH, -4, P, 6), { tone: "faint" }) }, 6, 0));
  return out.join("");
}

const POND = k.insetPlan(PLINTH, 3.5);
function pond() {
  return water(slab(POND, 0, WATER_Z, { tone: "lo", crease: "none" }, 6));
}

// The land behind the pond: flush with the plinth at the back and left, a winding shore.
// Moss-covered ground (the temple garden), so the base isn't a white slab.
const LAND = [
  [-68, -57], [-61, -64], [71, -64], [78, -57], [78, -50], [64, -52], [48, -47], [30, -50], [14, -46],
  [-2, -51], [-30, -52], [-58, -46], [-59, -20], [-62, 4], [-60, 24], [-64, 44], [-62, 60], [-63, 72], [-68, 72],
];
function land() {
  const ring = LAND.map(([x, y]) => [x, y]);
  return moss(count(S(k.extrude(ring, 0, LAND_Z, P, { convex: false }), { tone: "mid", crease: "faint" })));
}

// Reflection of the pavilion in the pond: mirrored hulls, clipped to the water, shimmering.
function reflection() {
  const mirror = (p) => [p[0], p[1], 2 * WATER_Z - p[2]];
  const hull = (pts) => pathOf(G.hullOf(pts.map((p) => at(mirror(p)))), true);
  const box = (plan, z0, z1) => k.boxCorners(plan, z0, z1);
  const pieces = [
    ["gold", hull([...box({ x: CX - 1.5, y: CY - 1.5, w: 3, d: 3 }, Z.apex, Z.apex + 9)])],
    ["roof", hull([...box(grow(WALL3, 8.5), Z.w3, Z.w3 + 3), ...box({ x: CX - 1.5, y: CY - 1.5, w: 3, d: 3 }, Z.apex, Z.apex)])],
    ["gold", hull(box(WALL3, Z.balc, Z.w3))],
    ["roof", hull([...box(grow(WALL2, 9), Z.w2, Z.w2 + 3), ...box(BALC, Z.r2in, Z.r2in)])],
    ["gold", hull(box(WALL2, Z.r1in, Z.w2))],
    ["roof", hull([...box(grow(WALL1, 9), Z.w1, Z.w1 + 3), ...box(WALL2, Z.r1in, Z.r1in)])],
    ["plain", hull(box(WALL1, Z.deck, Z.w1))],
    ["plain", hull(box(FOUND, 0, Z.found))],
  ];
  const fills = pieces.map(([kind, d]) => {
    // Gold reflects as gold; roofs and plaster only darken or lighten the water a little.
    const fill = kind === "gold" ? "var(--anatomy-face)" : kind === "roof" ? "var(--anatomy-shade-0)" : "var(--anatomy-top)";
    const path = `<path d="${d}" style="fill:${fill};stroke:none"/>`;
    return kind === "gold" ? gold(path) : water(path);
  }).join("");
  const clip = pathOf(k.ringOf(POND, 6).map(([x, y]) => at([x, y, WATER_Z])), true);
  // Ripple strokes across the reflection: short lines on the water that fade at both ends.
  const strokes = [];
  const rows = [[24, -8, 14], [32, 4, 26], [40, -14, 6]];
  for (const [y, x0, x1] of rows) strokes.push(k.fadeLineSvg([at([x0, y, WATER_Z]), at([x1, y, WATER_Z])], { fade: [5, 5], tone: "mid" }));
  return `<clipPath id="kk-iso-pond"><path d="${clip}"/></clipPath><g clip-path="url(#kk-iso-pond)"><g opacity=".55">${a.amPulse(fills, { period: 7000, min: 0.72 })}</g>${a.amPulse(ripple(strokes.join("")), { period: 5200, delay: 1700, min: 0.25 })}</g>`;
}

// ---------- garden: stones, islets, pines, lantern ----------
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

function pineTree(x, y, z, scale = 1) {
  const out = [];
  const u = (v) => v * scale;
  out.push(`<path class="iso-halo" d="${k.haloOf({ x: x - u(8), y: y - u(8), w: u(16), d: u(16), r: u(8) }, z, 0.1, P)}" style="filter:blur(4px)"/>`);
  // A cloud-pruned black pine: a leaning trunk, branches out to flat pads of needles.
  const trunk = [[0, 0, 0], [1.2, 0.4, 4], [2.4, 0.8, 8], [1.6, 0.4, 12], [0.4, 0, 16]].map(([dx, dy, dz]) => [x + u(dx), y + u(dy), z + u(dz)]);
  const pads = [
    { dx: 7, dy: 2.5, dz: 6, r: 4.2 },
    { dx: -4.5, dy: 4, dz: 8.5, r: 3.8 },
    { dx: -2, dy: -5, dz: 11, r: 4.4 },
    { dx: 6, dy: -3, dz: 12.5, r: 3.6 },
    { dx: 0.4, dy: 0, dz: 16.5, r: 5.4 },
  ].map((p) => ({ ...p, c: [x + u(p.dx), y + u(p.dy), z + u(p.dz)] }));
  // Branches first, so the trunk and the pads cover both their ends.
  const branches = pads.slice(0, 4).map((p) => {
    const from = trunk[Math.min(3, Math.round(p.dz / 4))];
    return k.segment([from[0], from[1], p.c[2] - u(1.6)], [p.c[0], p.c[1], p.c[2] + u(0.6)], P);
  });
  out.push(wood(L(branches.join(""), { tone: "hi" })));
  const trunkDepth = depth(trunk[2]);
  const pad = (p) => {
    const r = u(p.r);
    const [px, py, pz] = p.c;
    return pine(count(S(k.cylinder(px, py, r, pz, u(1.3), P, 18, 0.4), { tone: "hi", inner: L(k.sideArc(px, py, r, pz + u(0.65), P, 18), { tone: "faint" }) })) +
      count(S(k.cylinder(px + u(0.3), py - u(0.2), r * 0.66, pz + u(1.3), u(1.1), P, 14, 0.3), { tone: "hi" })));
  };
  const sorted = byDepth(pads, (p) => p.c);
  for (const p of sorted) if (depth(p.c) < trunkDepth && p.dz < 16) out.push(pad(p));
  for (let i = 0; i < trunk.length - 1; i++) {
    const [px, py, pz] = trunk[i];
    out.push(wood(cyl(px, py, u(1.25 - i * 0.15), pz, trunk[i + 1][2] - pz + u(0.3), { tone: "hi" }, 12)));
  }
  for (const p of sorted) if (!(depth(p.c) < trunkDepth && p.dz < 16)) out.push(pad(p));
  return out.join("");
}

function lantern(x, y, z) {
  const out = [];
  out.push(cyl(x, y, 3.2, z, 1.4, { tone: "mid" }, 16, 0.3));
  out.push(cyl(x, y, 1.1, z + 1.4, 5, { tone: "mid" }, 12));
  out.push(slab({ x: x - 2.8, y: y - 2.8, w: 5.6, d: 5.6, r: 0 }, z + 6.4, 1.1, { tone: "mid" }, 2, 0.3));
  const box = { x: x - 1.9, y: y - 1.9, w: 3.8, d: 3.8, r: 0 };
  const lights = [faceRect("x", x + 1.9, y - 0.9, y + 0.9, z + 8.1, z + 9.9), faceRect("y", y + 1.9, x - 0.9, x + 0.9, z + 8.1, z + 9.9)].join("");
  out.push(slab(box, z + 7.5, 3, { tone: "mid", inner: L(lights, { tone: "lo" }) }, 2));
  const cap = roofOf(box, 1.6, z + 10.5, { x: x - 0.5, y: y - 0.5, w: 1, d: 1 }, z + 12.4, { lift: 0.5, flare: 0.4, fascia: 0.5, n: 4 });
  out.push(count(S(cap.paths, { tone: "mid" })));
  out.push(count(S(G.sphereOf([x, y, z + 13.2], 0.9, P, { steps: 24 }), { tone: "mid" })));
  return out.join("");
}

function shoreStones() {
  const list = [
    [72, -51, 3, 2.6], [56, -50, 2.6, 2.4], [38, -48, 3.4, 3], [22, -48, 2.4, 2.2], [6, -49, 2.6, 2.4],
    [-58, 26, 2.6, 2.4], [-61, 44, 3.4, 3], [-60, 60, 2.6, 2.4],
  ];
  return byDepth(list, (s) => [s[0], s[1], 0]).map(([x, y, r, h], i) => stone(x, y, r, h, 0, i + 1)).join("");
}

function islets() {
  const out = [];
  const IX = 34;
  const IY = 34;
  out.push(ripple(L([k.ring(IX, IY, 20, WATER_Z, P, 48), k.ring(IX, IY, 26, WATER_Z, P, 56)].join(""), { tone: "faint" })));
  out.push(ripple(L(k.ring(8, 56, 8, WATER_Z, P, 36), { tone: "faint" })));
  const bigIslet = G.hullOf(Array.from({ length: 10 }, (_, i) => {
    const t = (i / 10) * Math.PI * 2;
    const rr = 12 * (0.85 + 0.15 * Math.sin(i * 2.3));
    return [IX + Math.cos(t) * rr * 1.2, IY + Math.sin(t) * rr];
  }));
  out.push(moss(count(S(k.extrude(bigIslet, 0, 2.6, P, { bevel: 0.5 }), { tone: "mid" }))));
  out.push(stone(IX - 9, IY - 3, 3, 2.8, 2.6, 7));
  out.push(pineTree(IX + 1, IY - 1, 2.6, 1));
  out.push(stone(IX + 9, IY + 6, 2.4, 2, 2.6, 9));
  out.push(stone(IX - 4, IY + 8, 2.2, 1.8, 2.6, 11));
  out.push(stone(8, 56, 3.8, 3.2, 0, 5));
  out.push(stone(13, 60, 2, 1.8, 0, 6));
  return out.join("");
}

// ---------- the pavilion ----------
function foundation() {
  const out = [];
  out.push(slab(FOUND, 0, Z.found, { tone: "mid", inner: L(k.sideSeam(FOUND, 2, P, 2), { tone: "faint" }) }, 2, 0.4));
  out.push(wood(slab(DECK, Z.found, Z.deck - Z.found, { tone: "hi" }, 2, 0.4)));
  // Short posts carrying the deck over the water along the two front edges.
  return out.join("");
}

// The first storey (Hōsui-in): white plaster, dark wood posts, lattice shutters (shitomido).
function storey1() {
  const out = [];
  const xf = WALL1.x + WALL1.w; // +x face
  const yf = WALL1.y + WALL1.d; // +y face
  const postsX = [-43, -30, -17, -4, 9];
  const postsY = [-48, -34.7, -21.3, -8];
  const lattice = [];
  const zs = [12.8, 14.8, 16.8, 18.8, 20.8];
  for (let i = 0; i < postsX.length - 1; i++) {
    const u0 = postsX[i] + 1.1;
    const u1 = postsX[i + 1] - 1.1;
    for (const z of zs) lattice.push(faceLine("x", xf, u0, z, u1, z));
    for (let u = u0 + 2.4; u < u1 - 1; u += 2.4) lattice.push(faceLine("x", xf, u, 11.5, u, 22));
  }
  for (let i = 0; i < postsY.length - 1; i++) {
    const u0 = postsY[i] + 1.1;
    const u1 = postsY[i + 1] - 1.1;
    for (const z of zs) lattice.push(faceLine("y", yf, u0, z, u1, z));
    for (let u = u0 + 2.4; u < u1 - 1; u += 2.4) lattice.push(faceLine("y", yf, u, 11.5, u, 22));
  }
  out.push(plaster(slab(WALL1, Z.deck, Z.w1 - Z.deck, { tone: "mid", inner: L(lattice.join(""), { tone: "faint" }) }, 2)));
  // Posts, sorted back to front.
  const posts = [
    ...postsX.map((y) => [xf, y]),
    ...postsY.slice(0, -1).map((x) => [x, yf]),
  ];
  for (const [x, y] of byDepth(posts, ([x, y]) => [x, y, 0])) {
    out.push(wood(slab({ x: x - 1.1, y: y - 1.1, w: 2.2, d: 2.2, r: 0 }, Z.deck, Z.w1 - Z.deck, { tone: "hi" }, 2)));
  }
  // Sill and head beams (nageshi) across the posts.
  for (const [z, h] of [[10, 1.5], [22, 2]]) {
    out.push(wood(slab({ x: WALL1.x - 0.4, y: yf - 0.8, w: WALL1.w + 1.6, d: 1.9, r: 0 }, z, h, { tone: "hi" }, 2)));
    out.push(wood(slab({ x: xf - 0.8, y: WALL1.y - 0.4, w: 1.9, d: WALL1.d + 1.6, r: 0 }, z, h, { tone: "hi" }, 2)));
  }
  return out.join("");
}

function storey2() {
  const out = [];
  const xf = WALL2.x + WALL2.w;
  const yf = WALL2.y + WALL2.d;
  const postsX = [-42, -29.5, -17, -4.5, 8];
  const postsY = [-47, -34.3, -21.7, -9];
  const panels = [];
  for (let i = 0; i < postsX.length - 1; i++) {
    const u0 = postsX[i] + 2.2;
    const u1 = postsX[i + 1] - 2.2;
    panels.push(faceRect("x", xf, u0, u1, Z.r1in + 3.6, Z.w2 - 3.4));
    panels.push(faceLine("x", xf, (u0 + u1) / 2, Z.r1in + 3.6, (u0 + u1) / 2, Z.w2 - 3.4));
  }
  for (let i = 0; i < postsY.length - 1; i++) {
    const u0 = postsY[i] + 2.2;
    const u1 = postsY[i + 1] - 2.2;
    panels.push(faceRect("y", yf, u0, u1, Z.r1in + 3.6, Z.w2 - 3.4));
    panels.push(faceLine("y", yf, (u0 + u1) / 2, Z.r1in + 3.6, (u0 + u1) / 2, Z.w2 - 3.4));
  }
  out.push(gold(slab(WALL2, Z.r1in, Z.w2 - Z.r1in, { tone: "mid", inner: L(panels.join(""), { tone: "lo" }) }, 2)));
  const posts = [...postsX.map((y) => [xf, y]), ...postsY.map((x) => [x, yf])];
  for (const [x, y] of byDepth(posts, ([x, y]) => [x, y, 0])) {
    out.push(gold(slab({ x: x - 1, y: y - 1, w: 2, d: 2, r: 0 }, Z.r1in, Z.w2 - Z.r1in, { tone: "hi" }, 2)));
  }
  out.push(gold(slab({ x: WALL2.x - 0.4, y: yf - 0.7, w: WALL2.w + 1.5, d: 1.7, r: 0 }, Z.w2 - 2, 2, { tone: "hi" }, 2)));
  out.push(gold(slab({ x: xf - 0.7, y: WALL2.y - 0.4, w: 1.7, d: WALL2.d + 1.5, r: 0 }, Z.w2 - 2, 2, { tone: "hi" }, 2)));
  return out.join("");
}

// The third storey (Kukkyō-chō) with its walkway railing, bell windows and doors.
function rails(front) {
  const out = [];
  const x0 = BALC.x + 0.8;
  const x1 = BALC.x + BALC.w - 0.8;
  const y0 = BALC.y + 0.8;
  const y1 = BALC.y + BALC.d - 0.8;
  const zt = Z.balc + 4;
  const sides = front
    ? [{ axis: "y", c: x1, from: y0, to: y1 }, { axis: "x", c: y1, from: x0, to: x1 }]
    : [{ axis: "x", c: y0, from: x0, to: x1 }, { axis: "y", c: x0, from: y0, to: y1 }];
  const posts = [];
  for (const s of sides) {
    for (let i = 0; i <= 5; i++) {
      const u = s.from + ((s.to - s.from) * i) / 5;
      posts.push(s.axis === "y" ? [s.c, u] : [u, s.c]);
    }
  }
  const uniq = [...new Map(posts.map((p) => [p.map((v) => v.toFixed(2)).join(","), p])).values()];
  const items = uniq.map((p) => ({ at: [p[0], p[1], 0], svg: gold(slab({ x: p[0] - 0.5, y: p[1] - 0.5, w: 1, d: 1, r: 0 }, Z.balc, 4, { tone: "hi" }, 2)) }));
  for (const s of sides) {
    const plan = s.axis === "y" ? { x: s.c - 0.45, y: s.from - 0.45, w: 0.9, d: s.to - s.from + 0.9, r: 0 } : { x: s.from - 0.45, y: s.c - 0.45, w: s.to - s.from + 0.9, d: 0.9, r: 0 };
    const mid = s.axis === "y" ? [s.c, (s.from + s.to) / 2, 99] : [(s.from + s.to) / 2, s.c, 99];
    items.push({ at: mid, svg: gold(slab(plan, zt, 0.9, { tone: "hi" }, 2)) });
  }
  for (const it of byDepth(items, (i) => i.at)) out.push(it.svg);
  return out.join("");
}

function storey3() {
  const out = [];
  out.push(gold(slab(BALC, Z.r2in, Z.balc - Z.r2in, { tone: "hi" }, 2, 0.3)));
  out.push(rails(false));
  const xf = WALL3.x + WALL3.w;
  const yf = WALL3.y + WALL3.d;
  const marks = [
    faceBell("x", xf, -26.5, -21.5, Z.balc + 3, Z.w3 - 3.4),
    faceBell("x", xf, -12.5, -7.5, Z.balc + 3, Z.w3 - 3.4),
    faceRect("x", xf, -19.8, -14.2, Z.balc, Z.w3 - 3),
    faceLine("x", xf, -17, Z.balc, -17, Z.w3 - 3),
    faceBell("y", yf, -38.5, -33.5, Z.balc + 3, Z.w3 - 3.4),
    faceBell("y", yf, -22.5, -17.5, Z.balc + 3, Z.w3 - 3.4),
    faceRect("y", yf, -30.8, -25.2, Z.balc, Z.w3 - 3),
    faceLine("y", yf, -28, Z.balc, -28, Z.w3 - 3),
  ];
  out.push(gold(slab(WALL3, Z.balc, Z.w3 - Z.balc, { tone: "mid", inner: L(marks.join(""), { tone: "lo" }) }, 2)));
  out.push(gold(slab({ x: WALL3.x - 0.4, y: yf - 0.7, w: WALL3.w + 1.5, d: 1.7, r: 0 }, Z.w3 - 2, 2, { tone: "hi" }, 2)));
  out.push(gold(slab({ x: xf - 0.7, y: WALL3.y - 0.4, w: 1.7, d: WALL3.d + 1.5, r: 0 }, Z.w3 - 2, 2, { tone: "hi" }, 2)));
  out.push(rails(true));
  return out.join("");
}

function roofSvg(roof, ts) {
  return roofAc(count(S(roof.paths, { tone: "hi" })) + L(courses(roof, ts), { tone: "lo" }));
}

// The phoenix (hō-ō) on its pedestal: the one lit part.
function phoenix() {
  const out = [];
  const z0 = Z.apex;
  out.push(gold(slab({ x: CX - 2, y: CY - 2, w: 4, d: 4, r: 0 }, z0, 1.4, { tone: "hi" }, 2, 0.3)));
  out.push(gold(cyl(CX, CY, 1.1, z0 + 1.4, 2, { tone: "hi" }, 14)));
  out.push(gold(cyl(CX, CY, 1.8, z0 + 3.4, 0.8, { tone: "hi" }, 16)));
  const zb = z0 + 4.2;
  // Facing +x (toward the pond). Tail plate in the x–z plane, wings either side.
  const F = (y) => G.frameOf([0, y, 0], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
  const tail = [[CX - 0.6, zb + 0.6], [CX - 4.4, zb + 2.4], [CX - 5.6, zb + 5.2], [CX - 3.2, zb + 4.4], [CX - 0.4, zb + 1.8]];
  // Wings spread up and out in the y–z plane, swept back a little (thin along x).
  const Fw = G.frameOf([CX - 0.6, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
  const wing = (side) => [[CY + side * 0.5, zb + 1.2], [CY + side * 1.8, zb + 1.8], [CY + side * 4.6, zb + 4.2], [CY + side * 4.4, zb + 5.8], [CY + side * 1.8, zb + 4.6], [CY + side * 0.6, zb + 3]];
  const lit = { tone: "hi", lit: true };
  out.push(gold(count(S(G.prismOf(Fw, wing(-1), -0.3, 0.3, P), lit))));
  out.push(gold(count(S(G.prismOf(F(CY), tail, -0.3, 0.3, P), lit))));
  out.push(gold(count(S(G.sphereOf([CX, CY, zb + 1.6], 1.5, P, { steps: 32 }), lit))));
  out.push(gold(count(S(G.sphereOf([CX + 1.6, CY, zb + 3.6], 0.75, P, { steps: 24 }), lit))));
  out.push(gold(count(S(G.prismOf(Fw, wing(1), -0.3, 0.3, P), lit))));
  return out.join("");
}

function pavilion() {
  const out = [foundation(), storey1()];
  const r1 = roofOf(WALL1, 9, Z.w1 + 0.4, grow(WALL2, 0.6), Z.r1in, { lift: 3, flare: 2.2, fascia: 1.8 });
  out.push(roofSvg(r1, [0.35, 0.7]));
  out.push(storey2());
  const r2 = roofOf(WALL2, 9, Z.w2 + 0.2, grow(BALC, 0.5), Z.r2in, { lift: 3.2, flare: 2.4, fascia: 1.8 });
  out.push(roofSvg(r2, [0.4, 0.75]));
  out.push(storey3());
  const r3 = roofOf(WALL3, 8.5, Z.w3 + 0.2, { x: CX - 2.2, y: CY - 2.2, w: 4.4, d: 4.4 }, Z.apex, { lift: 3, flare: 2.4, fascia: 1.8 });
  out.push(roofSvg(r3, [0.3, 0.55, 0.78]));
  out.push(phoenix());
  return out.join("");
}

// ---------- assemble ----------
// Lossless path minifier, from the skill's feature-spots example.
// ---------- size: lossless path minifier ----------
// The kit writes absolute M/L/Z commands in tenths. Rewrite each path as relative commands,
// computed in integer tenths so nothing drifts, and drop leading zeros: about a third smaller.
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
const minify = (svg) => svg.replace(/ d="([^"]*)"/g, (_, d) => ` d="${minifyD(d)}"`);

const body = minify([
  plinth(),
  pond(),
  reflection(),
  land(),
  pineTree(64, -57, LAND_Z, 1),
  lantern(42, -56, LAND_Z),
  shoreStones(),
  pavilion(),
  islets(),
].join(""));

const LABEL = "Kinkaku-ji, the Golden Pavilion of Kyoto, in isometric view: three storeys at the edge of its pond, the upper two in gold leaf, with a phoenix on the roof.";
const WEIGHT = 0.7;

for (const theme of ["light", "dark"]) {
  const name = `kinkakuji-${theme}`;
  const svg = a.assetSvg({ width: W, height: H, label: LABEL, body, paper: SITE[theme].paper, theme, accents: accentsFor(theme), weight: WEIGHT, id: name });
  writeFileSync(join(HERE, `${name}.svg`), svg);
  writeFileSync(join(HERE, `${name}.html`), a.previewHtml({ title: name, svg, paper: SITE[theme].paper, width: W * 2 }));
  console.log(`wrote ${name}.svg (${(svg.length / 1024).toFixed(0)} KB)`);
}
console.log(`solids: ${solids}`);

// ---------- React drop: the same art, coloured from the site's tokens ----------
// Kit drawing rules (no plate, legend or default token blocks), scoped to `.kk-iso`.
const drawing = k.ISO_CSS.split("\n").filter((line) => /^\.(iso-svg|iso-fill|iso-solid|iso-shade|iso-top|iso-halo|iso-line|iso-dots|tb-)/.test(line));
const scoped = drawing.map((line) => line.replace(/^([^{]+)\{/, (_, sel) => `${sel.split(",").map((s) => `.kk-iso ${s.trim().replace(/^\.iso-svg /, "")}`).join(",")}{`)).join("\n");
const tokens = (theme) => {
  const g = a.groundTokens(SITE[theme].paper, { theme });
  delete g.card; delete g.page;
  g.paper = "var(--paper)";
  const extra = theme === "light" ? { lit: "#000000", "halo-opacity": ".32" } : { lit: "#ffffff", "halo-opacity": ".9" };
  return Object.entries({ ...g, ...extra, weight: `${WEIGHT}px` }).map(([n, v]) => `--anatomy-${n}:${v}`).join(";");
};
const css = [
  `.kk-iso{${tokens("light")}}`,
  `[data-theme="dark"] .kk-iso{${tokens("dark")}}`,
  a.accentCss(accentsFor("light"), { scope: ".kk-iso", theme: "light" }),
  a.accentCss(accentsFor("dark"), { scope: '[data-theme="dark"] .kk-iso', theme: "dark" }),
  scoped,
  "@keyframes am-pulse{0%,100%{opacity:var(--am-min,.35)}50%{opacity:1}}",
  ".kk-iso .am-pulse{animation:am-pulse var(--am-period,3.2s) cubic-bezier(.45,0,.55,1) var(--am-delay,0s) infinite}",
  "@media (prefers-reduced-motion:reduce){.kk-iso .am-pulse{animation:none}}",
].join("\n");
const markup = `<style>${css}</style><g data-art="">${body}</g>`;
const ts = `/**
 * Kinkaku-ji isométrico — marcado SVG generado (no editar a mano).
 *
 * Generado con el kit de la skill anatomy-asset (build.mjs en el scratchpad de la sesión).
 * Los colores salen de los tokens de src/index.css (--paper, --gold, --brown, --green, --ink)
 * para tema claro y oscuro: --anatomy-paper usa var(--paper) en vivo y las rampas de tono se
 * derivan de esos hex al generar. Si cambia la paleta, hay que regenerar este fichero.
 */
export const KINKAKUJI_ISO_VIEWBOX = '0 0 ${W} ${H}'

export const KINKAKUJI_ISO_MARKUP = ${JSON.stringify(markup)}
`;
mkdirSync(ISO_OUT, { recursive: true });
writeFileSync(join(ISO_OUT, "kinkakujiIso.markup.ts"), ts);
console.log(`wrote kinkakujiIso.markup.ts (${(ts.length / 1024).toFixed(0)} KB)`);
