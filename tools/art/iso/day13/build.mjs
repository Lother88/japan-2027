// Day 13 — Takaragawa Onsen: the riverside rotenburo as an isometric diorama, matching the
// day-21 pilot (Kinkaku-ji). A stone plinth; the Takaragawa river runs along its right edge
// with boulders; on the bank, a big rock-edged open-air bath steams in front of a two-storey
// wooden ryokan with shōji, an engawa railing and dark hip roofs; a small gabled changing hut,
// a stone lantern, mountain cedars and a pine. Steam breathes over the bath and the river's
// ripples shimmer (CSS only, stopped under prefers-reduced-motion).
//
//   node build.mjs  → day13-light.svg/.html, day13-dark.svg/.html, ../out/day13Iso.markup.ts

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { a, G, k, SITE, mix, toolkit, minify, emit, W, H } from "../lib-d13-29/common.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

function accentsFor(theme) {
  const s = SITE[theme];
  const shadow = theme === "light" ? s.ink : s.paper;
  return {
    plaster: theme === "light" ? s.paper : s.ink,
    roof: mix(s.brown, shadow, theme === "light" ? 0.42 : 0.45),
    wood: s.brown,
    pine: s.green,
    water: mix(s.green, s.paper, theme === "light" ? 0.62 : 0.5),
    moss: mix(s.green, s.paper, theme === "light" ? 0.4 : 0.25),
    steam: theme === "light" ? s.paper : s.ink,
    spring: theme === "light" ? mix(s.green, s.ink, 0.25) : mix(s.green, s.paper, 0.62),
    rock: mix(s.ink, s.paper, theme === "light" ? 0.8 : 0.62),
    ripple: { hex: s.green, mode: "ink" },
  };
}

// ---------- world ----------
const PLINTH = { x: -70, y: -62, w: 140, d: 132, r: 8 };
const WATER_Z = 0.5;
const LAND_Z = 4;
const RYO1 = { x: -60, y: -55, w: 70, d: 24, r: 0 }; // ryokan, ground storey
const RYO2 = { x: -58.5, y: -53.5, w: 67, d: 21, r: 0 };
const Z = { base: 5.2, w1: 18, r1in: 22, w2: 33 };
const POOL = { cx: 0, cy: 26, rx: 33, ry: 26 };
const POOL_Z = LAND_Z + 0.5;

const fitPoints = [
  ...k.boxCorners(PLINTH, -10, 4),
  [-60, -55, 52], [10, -31, 50], [40, -50, 48],
];
const P = a.fitInto(fitPoints, { x: 0, y: 0, w: W, h: H }, { pad: 6, azimuth: 40 });
const T = toolkit(P);
const { at, S, L, ac, byDepth, pathOf, count, slab, cyl, stone, faceLine, faceRect, roofOf, courses, gableRoof, loft } = T;
const wood = ac("wood");
const roofAc = ac("roof");
const pine = ac("pine");
const water = ac("water");
const moss = ac("moss");
const plaster = ac("plaster");
const ripple = ac("ripple");
const steamAc = ac("steam");
const spring = ac("spring");
const rock = ac("rock");

// ---------- base: plinth, river, land ----------
const RIVER = k.insetPlan(PLINTH, 3.5);
const river = () => water(slab(RIVER, 0, WATER_Z, { tone: "lo", crease: "none" }, 6));

// The bank: land fills the plinth except the river along the +x edge; a winding shore.
const LAND = [
  [-70, -54], [-62, -62], [32, -62], [30, -48], [36, -34], [33, -18], [40, -2], [37, 14], [42, 30], [39, 46], [44, 60], [40, 70],
  [-62, 70], [-70, 62],
];
const land = () => moss(count(S(k.extrude(LAND, 0, LAND_Z, P, { convex: false }), { tone: "mid", crease: "faint" })));

function riverDetail() {
  const out = [];
  // Ripples: short strokes along the flow (along y), fading at both ends.
  const rows = [[52, -40, -22], [60, -10, 8], [50, 20, 34], [62, 36, 54], [56, -56, -46]];
  const strokes = rows.map(([x, y0, y1]) => k.fadeLineSvg([at([x, y0, WATER_Z]), at([x, y1, WATER_Z])], { fade: [5, 5], tone: "mid" })).join("");
  const clip = pathOf(k.ringOf(RIVER, 6).map(([x, y]) => at([x, y, WATER_Z])), true);
  out.push(`<clipPath id="d13-river"><path d="${clip}"/></clipPath><g clip-path="url(#d13-river)">${a.amPulse(ripple(strokes), { period: 5200, delay: 1200, min: 0.25 })}</g>`);
  const boulders = [[56, -44, 4, 3.4], [63, -18, 3, 2.6], [52, 8, 3.6, 3], [61, 26, 2.6, 2.2], [55, 52, 4.2, 3.6], [64, 62, 2.4, 2]];
  for (const [x, y, r, h] of byDepth(boulders, (b) => [b[0], b[1], 0])) {
    out.push(ripple(L(k.ring(x, y, r * 1.9, WATER_Z, P, 28), { tone: "faint" })));
    out.push(rock(stone(x, y, r, h, 0, x + y)));
  }
  return out.join("");
}

// ---------- the ryokan ----------
function ryokan() {
  const out = [];
  const xf = RYO1.x + RYO1.w; // +x face
  const yf = RYO1.y + RYO1.d; // +y face (towards the bath)
  out.push(slab(k.insetPlan(RYO1, -1.6), LAND_Z, Z.base - LAND_Z, { tone: "mid", inner: L(k.sideSeam(k.insetPlan(RYO1, -1.6), LAND_Z + 0.6, P, 2), { tone: "faint" }) }, 2, 0.3));
  // Ground storey: wooden walls with shōji bays (a grid of paper panes) between posts.
  const postsY = [-60, -46, -32, -18, -4, 10];
  const postsX = [-55, -43, -31];
  const marks = [];
  const shoji = (face, c, u0, u1, z0, z1) => {
    marks.push(faceRect(face, c, u0, u1, z0, z1));
    const nu = Math.max(2, Math.round((u1 - u0) / 2.6));
    for (let i = 1; i < nu; i++) marks.push(faceLine(face, c, u0 + ((u1 - u0) * i) / nu, z0, u0 + ((u1 - u0) * i) / nu, z1));
    for (const t of [0.25, 0.5, 0.75]) marks.push(faceLine(face, c, u0, z0 + (z1 - z0) * t, u1, z0 + (z1 - z0) * t));
  };
  for (let i = 0; i < postsY.length - 1; i++) shoji("y", yf, postsY[i] + 2, postsY[i + 1] - 2, Z.base + 2, Z.w1 - 3.2);
  for (let i = 0; i < postsX.length - 1; i++) shoji("x", xf, postsX[i] + 2, postsX[i + 1] - 2, Z.base + 2, Z.w1 - 3.2);
  out.push(plaster(slab(RYO1, Z.base, Z.w1 - Z.base, { tone: "mid", inner: L(marks.join(""), { tone: "lo" }) }, 2)));
  const posts = [...postsY.map((x) => [x, yf]), ...postsX.slice(1).map((y) => [xf, y]), [xf, yf]];
  const uniq = [...new Map(posts.map((p) => [p.join(","), p])).values()];
  for (const [x, y] of byDepth(uniq, ([x, y]) => [x, y, 0])) {
    out.push(wood(slab({ x: x - 1, y: y - 1, w: 2, d: 2, r: 0 }, Z.base, Z.w1 - Z.base, { tone: "hi" }, 2)));
  }
  // Head beam (nageshi) across the posts on both faces.
  out.push(wood(slab({ x: xf - 0.8, y: RYO1.y - 0.4, w: 1.8, d: RYO1.d + 1.5, r: 0 }, Z.w1 - 2.2, 2, { tone: "hi" }, 2)));
  out.push(wood(slab({ x: RYO1.x - 0.4, y: yf - 0.8, w: RYO1.w + 1.5, d: 1.8, r: 0 }, Z.w1 - 2.2, 2, { tone: "hi" }, 2)));
  // Pent roof between the storeys.
  const r1 = roofOf(RYO1, 5.5, Z.w1 + 0.2, T.grow(RYO2, 0.4), Z.r1in, { lift: 1.6, flare: 1.2, fascia: 1.2, n: 8 });
  out.push(roofAc(count(S(r1.paths, { tone: "hi" })) + L(courses(r1, [0.5]), { tone: "lo" })));
  // Upper storey: dark wood with a long band of windows and an engawa railing in front.
  const xf2 = RYO2.x + RYO2.w;
  const yf2 = RYO2.y + RYO2.d;
  const win = [];
  const bays = [-56, -44, -32, -20, -8, 4];
  for (let i = 0; i < bays.length; i++) {
    const u0 = bays[i] + 1.4;
    const u1 = Math.min(bays[i] + 10.6, xf2 - 2);
    win.push(faceRect("y", yf2, u0, u1, Z.r1in + 2.4, Z.w2 - 2.6));
    win.push(faceLine("y", yf2, (u0 + u1) / 2, Z.r1in + 2.4, (u0 + u1) / 2, Z.w2 - 2.6));
  }
  for (const [u0, u1] of [[-51.5, -42], [-40, -34.5]]) {
    win.push(faceRect("x", xf2, u0, u1, Z.r1in + 2.4, Z.w2 - 2.6));
    win.push(faceLine("x", xf2, (u0 + u1) / 2, Z.r1in + 2.4, (u0 + u1) / 2, Z.w2 - 2.6));
  }
  out.push(wood(slab(RYO2, Z.r1in - 0.6, Z.w2 - Z.r1in + 0.6, { tone: "mid", inner: L(win.join(""), { tone: "lo" }) }, 2)));
  // Engawa railing: posts and a top rail along the upper front, standing on the pent roof's top.
  const rails = [];
  const ry = yf2 + 1.6;
  for (let x = RYO2.x + 1; x <= xf2 - 0.5; x += 6) rails.push({ at: [x, ry, 0], svg: wood(slab({ x: x - 0.45, y: ry - 0.45, w: 0.9, d: 0.9, r: 0 }, Z.r1in, 4.6, { tone: "hi" }, 2)) });
  out.push(...byDepth(rails, (r) => r.at).map((r) => r.svg));
  out.push(wood(slab({ x: RYO2.x + 0.3, y: ry - 0.5, w: RYO2.w - 0.6, d: 1, r: 0 }, Z.r1in + 4.6, 0.9, { tone: "hi" }, 2)));
  out.push(wood(slab({ x: RYO2.x + 0.3, y: ry - 0.35, w: RYO2.w - 0.6, d: 0.7, r: 0 }, Z.r1in + 2, 0.6, { tone: "hi" }, 2)));
  // Main hip roof.
  const r2 = roofOf(RYO2, 6.5, Z.w2 + 0.2, { x: -48, y: -44, w: 46, d: 2.4 }, Z.w2 + 7.5, { lift: 2.2, flare: 1.6, fascia: 1.6, n: 8 });
  out.push(roofAc(count(S(r2.paths, { tone: "hi" })) + L(courses(r2, [0.3, 0.6]), { tone: "lo" })));
  // Ridge cap.
  out.push(roofAc(slab({ x: -49, y: -44.2, w: 48, d: 2.8, r: 0 }, Z.w2 + 7.5, 1.4, { tone: "hi" }, 2, 0.3)));
  return out.join("");
}

// ---------- trees ----------
// A mountain cedar (sugi): a lofted cone of needles on a short trunk.
function sugi(x, y, z, h, r) {
  const out = [];
  out.push(`<path class="iso-halo" d="${k.haloOf({ x: x - r, y: y - r, w: 2 * r, d: 2 * r, r }, z, 0.1, P)}" style="filter:blur(4px)"/>`);
  out.push(wood(cyl(x, y, r * 0.18, z, h * 0.3, { tone: "hi" }, 10)));
  const n = 18;
  const rings = [];
  const cs = [];
  const profile = [[0.18, 0.92], [0.4, 1], [0.62, 0.7], [0.82, 0.38], [1, 0.02]];
  for (const [t, rr] of profile) {
    const zz = z + h * t;
    rings.push(Array.from({ length: n }, (_, i) => { const ang = (i / n) * Math.PI * 2; return [x + Math.cos(ang) * r * rr, y + Math.sin(ang) * r * rr, zz]; }));
    cs.push([x, y, zz]);
  }
  out.push(pine(count(S(loft(rings, cs, { creaseCos: 0.6 }), { tone: "hi" }))));
  return out.join("");
}

function pineTree(x, y, z, scale = 1) {
  const out = [];
  const u = (v) => v * scale;
  out.push(`<path class="iso-halo" d="${k.haloOf({ x: x - u(8), y: y - u(8), w: u(16), d: u(16), r: u(8) }, z, 0.1, P)}" style="filter:blur(4px)"/>`);
  const trunk = [[0, 0, 0], [1.2, 0.4, 4], [2.4, 0.8, 8], [1.6, 0.4, 12], [0.4, 0, 16]].map(([dx, dy, dz]) => [x + u(dx), y + u(dy), z + u(dz)]);
  const pads = [
    { dx: 7, dy: 2.5, dz: 6, r: 4.2 },
    { dx: -4.5, dy: 4, dz: 8.5, r: 3.8 },
    { dx: -2, dy: -5, dz: 11, r: 4.4 },
    { dx: 6, dy: -3, dz: 12.5, r: 3.6 },
    { dx: 0.4, dy: 0, dz: 16.5, r: 5.4 },
  ].map((p) => ({ ...p, c: [x + u(p.dx), y + u(p.dy), z + u(p.dz)] }));
  const branches = pads.slice(0, 4).map((p) => {
    const from = trunk[Math.min(3, Math.round(p.dz / 4))];
    return k.segment([from[0], from[1], p.c[2] - u(1.6)], [p.c[0], p.c[1], p.c[2] + u(0.6)], P);
  });
  out.push(wood(L(branches.join(""), { tone: "hi" })));
  const trunkDepth = T.depth(trunk[2]);
  const pad = (p) => {
    const r = u(p.r);
    const [px, py, pz] = p.c;
    return pine(count(S(k.cylinder(px, py, r, pz, u(1.3), P, 18, 0.4), { tone: "hi", inner: L(k.sideArc(px, py, r, pz + u(0.65), P, 18), { tone: "faint" }) })) +
      count(S(k.cylinder(px + u(0.3), py - u(0.2), r * 0.66, pz + u(1.3), u(1.1), P, 14, 0.3), { tone: "hi" })));
  };
  const sorted = byDepth(pads, (p) => p.c);
  for (const p of sorted) if (T.depth(p.c) < trunkDepth && p.dz < 16) out.push(pad(p));
  for (let i = 0; i < trunk.length - 1; i++) {
    const [px, py, pz] = trunk[i];
    out.push(wood(cyl(px, py, u(1.25 - i * 0.15), pz, trunk[i + 1][2] - pz + u(0.3), { tone: "hi" }, 12)));
  }
  for (const p of sorted) if (!(T.depth(p.c) < trunkDepth && p.dz < 16)) out.push(pad(p));
  return out.join("");
}

// ---------- changing hut (datsuijo): a small gabled wooden shed ----------
function hut() {
  const out = [];
  const plan = { x: -64, y: 26, w: 16, d: 22, r: 0 };
  const zt = LAND_Z + 11;
  out.push(slab(k.insetPlan(plan, -1), LAND_Z, 0.8, { tone: "mid" }, 2, 0.3));
  const xf = plan.x + plan.w;
  const yf = plan.y + plan.d;
  const boards = [];
  for (let u = plan.y + 2; u < yf - 0.5; u += 2) boards.push(faceLine("x", xf, u, LAND_Z + 0.8, u, zt - 0.6));
  // A slatted window on the +y face.
  boards.push(faceRect("y", yf, plan.x + 4, plan.x + 12, LAND_Z + 5.5, LAND_Z + 8.5));
  for (let u = plan.x + 5.6; u < plan.x + 12; u += 1.6) boards.push(faceLine("y", yf, u, LAND_Z + 5.5, u, LAND_Z + 8.5));
  out.push(wood(slab(plan, LAND_Z + 0.8, zt - LAND_Z - 0.8, { tone: "mid", inner: L(boards.join(""), { tone: "lo" }) }, 2)));
  // Gable walls: a triangular prism of boards under the roof.
  const cxh = plan.x + plan.w / 2;
  const tri = (y) => [[plan.x, y, zt], [plan.x + plan.w, y, zt], [cxh, y, zt + 5]];
  out.push(wood(count(S(loft([tri(plan.y), tri(yf)], [[cxh, plan.y, zt + 2], [cxh, yf, zt + 2]], { creaseCos: 0.9 }), { tone: "mid" }))));
  const roof = gableRoof(plan, zt, 5, { axis: "y", over: 2.6, gable: 2.2, thick: 0.9 });
  const tiles = [];
  const V = G.viewOf(P);
  for (const s of [-1, 1]) {
    const nrm = [s * 5, 0, (plan.w / 2)];
    if (G.dot3(nrm, V) <= 0) continue;
    for (let u = roof.u0 + 1.8; u < roof.u1 - 1; u += 1.8) tiles.push(pathOf([at(roof.surf(s, 0, u)), at(roof.surf(s, 1, u))]));
  }
  out.push(roofAc(count(S(roof.paths, { tone: "hi", inner: L(tiles.join(""), { tone: "lo" }) }))));
  return out.join("");
}

function lantern(x, y, z) {
  const out = [];
  out.push(cyl(x, y, 3, z, 1.3, { tone: "mid" }, 16, 0.3));
  out.push(cyl(x, y, 1.05, z + 1.3, 4.6, { tone: "mid" }, 12));
  out.push(slab({ x: x - 2.6, y: y - 2.6, w: 5.2, d: 5.2, r: 0 }, z + 5.9, 1, { tone: "mid" }, 2, 0.3));
  const box = { x: x - 1.8, y: y - 1.8, w: 3.6, d: 3.6, r: 0 };
  const lights = [faceRect("x", x + 1.8, y - 0.85, y + 0.85, z + 7.5, z + 9.2), faceRect("y", y + 1.8, x - 0.85, x + 0.85, z + 7.5, z + 9.2)].join("");
  out.push(slab(box, z + 6.9, 2.9, { tone: "mid", inner: L(lights, { tone: "lo" }) }, 2));
  const cap = roofOf(box, 1.5, z + 9.8, { x: x - 0.5, y: y - 0.5, w: 1, d: 1 }, z + 11.6, { lift: 0.5, flare: 0.4, fascia: 0.5, n: 4 });
  out.push(count(S(cap.paths, { tone: "mid" })));
  out.push(count(S(G.sphereOf([x, y, z + 12.4], 0.85, P, { steps: 24 }), { tone: "mid" })));
  return out.join("");
}

// ---------- the rotenburo ----------
const poolRing = (sx = 1, sy = 1, m = 40) => Array.from({ length: m }, (_, i) => {
  const t = (i / m) * Math.PI * 2;
  const wob = 1 + 0.06 * Math.sin(t * 3 + 0.7) + 0.04 * Math.cos(t * 5);
  return [POOL.cx + Math.cos(t) * POOL.rx * sx * wob, POOL.cy + Math.sin(t) * POOL.ry * sy * wob];
});

function poolWater() {
  return spring(count(S(k.extrude(poolRing(), LAND_Z, POOL_Z - LAND_Z, P, { convex: false }), { tone: "lo", crease: "none" })));
}

function poolDetail() {
  // Rings on the hot water, clipped to the bath.
  const clip = pathOf(poolRing().map(([x, y]) => at([x, y, POOL_Z])), true);
  const rings = [k.ring(-10, 22, 7, POOL_Z, P, 36), k.ring(-10, 22, 12, POOL_Z, P, 44), k.ring(12, 38, 6, POOL_Z, P, 32)].join("");
  return `<clipPath id="d13-pool"><path d="${clip}"/></clipPath><g clip-path="url(#d13-pool)">${ripple(L(rings, { tone: "faint" }))}</g>`;
}

// Rim boulders around the bath, plus two stepping stones into it.
function rimStones() {
  const list = [];
  const m = 26;
  for (let i = 0; i < m; i++) {
    const t = (i / m) * Math.PI * 2 + 0.12;
    const wob = 1 + 0.06 * Math.sin(t * 3 + 0.7) + 0.04 * Math.cos(t * 5);
    const r = 2.2 + 2.6 * Math.abs(Math.sin(i * 2.7 + Math.cos(i * 1.3)));
    const h = 1.4 + 2.6 * Math.abs(Math.cos(i * 1.9 + 0.4));
    list.push([POOL.cx + Math.cos(t) * POOL.rx * wob * 1.02, POOL.cy + Math.sin(t) * POOL.ry * wob * 1.02, r, h, LAND_Z, i + 3]);
  }
  list.push([-20, 14, 2.6, 1.6, POOL_Z - 0.2, 41], [-26, 22, 2.2, 1.3, POOL_Z - 0.2, 43]);
  return byDepth(list, (s) => [s[0], s[1], 0]);
}

// Soft puffs of steam over the bath (fill only, blurred), breathing out of phase.
function steam() {
  const puff = (x, y, z, rx, ry) => {
    const c = at([x, y, z]);
    const pts = Array.from({ length: 20 }, (_, i) => { const t = (i / 20) * Math.PI * 2; return [c[0] + Math.cos(t) * rx, c[1] + Math.sin(t) * ry]; });
    return `<path d="${pathOf(pts, true)}" style="fill:var(--anatomy-face);stroke:none"/>`;
  };
  const sk = G.scaleOf(P);
  const a1 = [puff(-10, 24, POOL_Z + 4, 10 * sk, 3.8 * sk), puff(-2, 28, POOL_Z + 11, 7.5 * sk, 3 * sk), puff(-8, 24, POOL_Z + 18, 5.5 * sk, 2.4 * sk)].join("");
  const a2 = [puff(10, 38, POOL_Z + 3, 9 * sk, 3.4 * sk), puff(16, 34, POOL_Z + 10, 6.5 * sk, 2.6 * sk), puff(12, 36, POOL_Z + 16, 4.6 * sk, 2 * sk)].join("");
  const blur = (svg) => `<g style="filter:blur(${(2.4 * sk).toFixed(1)}px)" opacity=".85">${svg}</g>`;
  return steamAc(a.amPulse(blur(a1), { period: 6400, delay: 0, min: 0.2 }) + a.amPulse(blur(a2), { period: 7600, delay: 3100, min: 0.2 }));
}

// A wooden bucket (oke) left on a rim stone.
function bucket(x, y, z) {
  const out = [];
  const staves = [];
  const n = 12;
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2;
    const p = [x + Math.cos(ang) * 1.6, y + Math.sin(ang) * 1.6];
    const v = G.viewOf(P);
    if (Math.cos(ang) * v[0] + Math.sin(ang) * v[1] > 0.15) staves.push(k.segment([p[0], p[1], z + 0.15], [p[0], p[1], z + 1.65], P));
  }
  out.push(wood(cyl(x, y, 1.6, z, 1.8, { tone: "hi", inner: L(staves.join(""), { tone: "lo" }) }, 20, 0.2)));
  return out.join("");
}

// ---------- assemble ----------
const stones = rimStones();
const back = stones.filter((s) => T.depth([s[0], s[1], 0]) < T.depth([POOL.cx, POOL.cy, 0]));
const front = stones.filter((s) => !back.includes(s));
const rim = (list) => rock(list.map(([x, y, r, h, z, seed]) => stone(x, y, r, h, z, seed)).join(""));

// Flat stepping stones from the ryokan's engawa down to the bath.
const path = () => rock([[4, -24], [0, -17], [5, -10], [1, -4]].map(([x, y], i) => stone(x, y, 2.6, 0.7, LAND_Z, 30 + i)).join(""));

const body = minify([
  T.plinth(PLINTH),
  river(),
  land(),
  riverDetail(),
  sugi(-54, -60, LAND_Z, 34, 8),
  sugi(22, -56, LAND_Z, 40, 9),
  sugi(30, -42, LAND_Z, 30, 7),
  ryokan(),
  lantern(18, -18, LAND_Z),
  hut(),
  path(),
  poolWater(),
  poolDetail(),
  rim(back),
  rim(front),
  bucket(-44, 50, LAND_Z),
  pineTree(-30, 64, LAND_Z, 0.95),
  steam(),
].join(""));

emit({
  nn: "13",
  here: HERE,
  body,
  label: "Takaragawa Onsen in isometric view: a big rock-edged open-air bath steaming beside the river, in front of a two-storey wooden ryokan.",
  subject: "Rotenburo de Takaragawa",
  accentsFor,
  jsdoc: ["Takaragawa Onsen isométrico (día 13): el gran rotenburo de rocas junto al río, con el ryokan", "de madera detrás. El vapor del baño y las ondas del río respiran (CSS)."],
  solids: T.stats.solids,
});
