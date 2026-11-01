// Day 11 (Ueno and Yanaka): a street corner of shitamachi Yanaka as an isometric diorama on
// the set's plinth. A two-storey wooden shop (machiya) on a stone lane: glazed sliding doors
// under a pent roof, indigo noren curtains (they stir, CSS only), a lattice upper floor and a
// dark tiled roof; a bench in front with a ginger cat, potted plants, a signboard and a
// vending machine; the one-storey house next door behind its bamboo fence; a concrete
// utility pole; and across the lane a temple's plaster wall with its garden, pine and lantern.
//
//   node build.mjs  → day11-light/dark.svg/.html here, ../out/day11Iso.markup.ts

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { k, a, G, SITE, mix, baseAccents, PLINTH, fitOf, kitFor, minify, emit } from "../lib-09-26/common.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

function accentsFor(theme) {
  const s = SITE[theme];
  const b = baseAccents(theme);
  return {
    roof: b.roof,
    wood: b.wood,
    pine: b.pine,
    moss: b.moss,
    noren: theme === "light" ? s.ink : mix(SITE.light.ink, s.ink, 0.3),
    cat: mix(s.brown, s.gold, 0.55),
    stone: b.stone,
  };
}

const P = fitOf();
const K = kitFor(P);
const { at, S, L, ac, byDepth, pathOf, count, slab, box, cyl, halo, roofOf, courses, faceLine, faceRect, polySolid, bar } = K;
const roof = ac("roof");
const wood = ac("wood");
const noren = ac("noren");
const catAc = ac("cat");
const stoneAc = ac("stone");
const moss = ac("moss");
const pineAc = ac("pine");

// A pent roof (hisashi) on the +x face: from the wall at zIn down to the eave at x1, zOut.
function pent(x0, x1, y0, y1, zIn, zOut, t = 0.9) {
  const A = [[x0, y0, zIn], [x1, y0, zOut], [x1, y1, zOut], [x0, y1, zIn]];
  const B = A.map(([x, y, z]) => [x, y, z + t]);
  const faces = [{ pts: B, hint: [0.3, 0, 1] }, { pts: A, hint: [-0.3, 0, -1] }];
  const hints = [[0, -1, 0], [1, 0, 0], [0, 1, 0], [-1, 0, 0]];
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    faces.push({ pts: [A[i], A[j], B[j], B[i]], hint: hints[i] });
  }
  return polySolid(faces);
}

// ---------- ground ----------
const LANE = { x: -6, y: -60.5, w: 28, d: 129, r: 0 };
function lane() {
  const j = [];
  for (let y = LANE.y + 9; y < LANE.y + LANE.d - 2; y += 9) j.push(pathOf([at([LANE.x, y, 0.6]), at([LANE.x + LANE.w, y, 0.6])]));
  j.push(pathOf([at([LANE.x + LANE.w / 2, LANE.y, 0.6]), at([LANE.x + LANE.w / 2, LANE.y + LANE.d, 0.6])]));
  return stoneAc(slab(LANE, 0, 0.6, { tone: "mid", inner: L(j.join(""), { tone: "faint" }) }, 2, 0.3));
}

const GARDEN = { x: 29, y: -60.5, w: 45.5, d: 129, r: 4.5 };
function garden() {
  return moss(slab(GARDEN, 0, 1.2, { tone: "mid", crease: "faint" }, 6, 0.4));
}

// ---------- the shop ----------
const SH = { x: -50, y: -44, w: 38, d: 50, r: 0 }; // footprint; shop front is the +x face
const XF = SH.x + SH.w; // -14
const Zs = { found: 1.4, g: 17, up: 31, ridge: 42 };

function shop() {
  const out = [];
  out.push(halo(k.insetPlan(SH, -4), 0, 0.1, 3));
  out.push(stoneAc(slab(k.insetPlan(SH, -0.6), 0, Zs.found, { tone: "mid" }, 2, 0.3)));
  // ground floor: glazed sliding doors on the shop front, a plastered end wall
  const g = [];
  for (let u = SH.y + 3; u < SH.y + SH.d - 3; u += 4.6) g.push(faceLine("x", XF, u, Zs.found, u, Zs.g));
  g.push(k.sideSeam(SH, 8.5, P, 2));
  const yf = SH.y + SH.d;
  out.push(wood(slab(SH, Zs.found, Zs.g - Zs.found, { tone: "mid", inner: L(g.join(""), { tone: "lo" }) }, 2)));
  // upper floor: a wooden lattice (koshi) across the front, one window on the end wall
  const u = [];
  const lat = { y0: SH.y + 4, y1: yf - 4, z0: Zs.g + 3.4, z1: Zs.up - 2.4 };
  u.push(faceRect("x", XF, lat.y0, lat.y1, lat.z0, lat.z1));
  for (let y = lat.y0 + 1.2; y < lat.y1 - 0.6; y += 1.2) u.push(faceLine("x", XF, y, lat.z0, y, lat.z1));
  u.push(faceRect("y", yf, SH.x + 12, SH.x + 26, lat.z0, lat.z1));
  u.push(faceLine("y", yf, SH.x + 19, lat.z0, SH.x + 19, lat.z1));
  out.push(wood(slab(SH, Zs.g, Zs.up - Zs.g, { tone: "mid", inner: L(u.join(""), { tone: "lo" }) }, 2)));
  return out.join("");
}

// In front of the noren: the posts, the pent roof, then the main roof over everything.
function shopTop() {
  const out = [];
  const yf = SH.y + SH.d;
  // front posts carrying the pent roof
  for (const y of [SH.y + 1, SH.y + 17, SH.y + 33, yf - 1]) out.push(wood(box(XF + 3.6, y - 0.7, 1.4, 1.4, Zs.found, Zs.g - 0.6 - Zs.found, { tone: "hi" })));
  out.push(roof(count(S(pent(XF - 0.2, XF + 7, SH.y - 2, yf + 2, Zs.g + 2.4, Zs.g - 0.6), { tone: "hi" }))));
  // the main roof
  const r = roofOf(SH, 4.5, Zs.up, { x: SH.x + SH.w / 2 - 1, y: SH.y + 8, w: 2, d: SH.d - 16 }, Zs.ridge, { lift: 1.2, flare: 0.8, fascia: 1.2, n: 6 });
  out.push(roof(count(S(r.paths, { tone: "hi" })) + L(courses(r, [0.33, 0.66]), { tone: "lo" })));
  const ridge = { x: SH.x + SH.w / 2 - 1.8, y: SH.y + 7, w: 3.6, d: SH.d - 14, r: 0 };
  out.push(roof(slab(ridge, Zs.ridge - 0.4, 2.2, { tone: "hi" }, 2)));
  return out.join("");
}

// Three indigo noren panels hanging under the pent roof at the door.
function norens() {
  const out = [];
  const x = XF + 2.2;
  for (const y0 of [SH.y + 18.6, SH.y + 22.6, SH.y + 26.6]) {
    out.push(noren(box(x, y0, 0.5, 3.7, Zs.g - 8.5, 7.6, { tone: "hi" })));
  }
  out.push(wood(count(S(bar([x + 0.25, SH.y + 18, Zs.g - 0.6], [x + 0.25, SH.y + 30.9, Zs.g - 0.6], 0.35), { tone: "hi" }))));
  return a.amSlide(out.join(""), [0, 0.35, 0], P, { period: 6200 });
}

// The shōgi bench out front, and a ginger cat sitting on it.
function bench(x, y) {
  const out = [];
  out.push(halo({ x: x - 3, y: y - 7, w: 6, d: 14, r: 2 }, 0.6, 0.1, 2));
  for (const [dx, dy] of [[-1.8, -5.5], [-1.8, 5.5], [1.8, -5.5], [1.8, 5.5]]) out.push(wood(box(x + dx - 0.4, y + dy - 0.4, 0.8, 0.8, 0.6, 4.4, { tone: "hi" })));
  out.push(wood(slab({ x: x - 2.6, y: y - 6.6, w: 5.2, d: 13.2, r: 0.3 }, 5, 0.9, { tone: "hi" }, 2, 0.3)));
  return out.join("");
}

function cat(x, y, z) {
  const out = [];
  // sitting, facing +x: haunches, chest, head, two ears, the tail curled round the feet
  out.push(catAc(slab({ x: x - 1.8, y: y - 1.5, w: 3.2, d: 3, r: 1.4 }, z, 2.2, { tone: "hi" }, 6, 0.3)));
  out.push(catAc(count(S(G.sphereOf([x + 0.3, y, z + 3], 1.3, P, { steps: 28 }), { tone: "hi" }))));
  out.push(catAc(count(S(G.sphereOf([x + 0.6, y, z + 4.8], 1.15, P, { steps: 28 }), { tone: "hi" }))));
  // ears: small triangular plates in the y–z plane
  const Fe = G.frameOf([x + 0.55, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
  for (const side of [-1, 1]) {
    const yc = y + side * 0.62;
    out.push(catAc(count(S(G.prismOf(Fe, [[yc - 0.42, z + 5.55], [yc + 0.42, z + 5.55], [yc + side * 0.18, z + 6.35]], -0.22, 0.22, P), { tone: "hi" }))));
  }
  // the tail, lying along the bench and curling round the front paws
  out.push(catAc(count(S(bar([x - 1.6, y + 1.4, z + 0.3], [x + 1.4, y + 1.9, z + 0.3], 0.3, 0.3), { tone: "hi" }))));
  return out.join("");
}

function pot(x, y, r, h, leaf) {
  return stoneAc(cyl(x, y, r, 0.6, h, { tone: "mid", inner: L(k.sideArc(x, y, r, 0.6 + h - 0.8, P, 16), { tone: "faint" }) }, 16, 0.3)) +
    pineAc(count(S(G.sphereOf([x, y, 0.6 + h + leaf * 0.7], leaf, P, { steps: 28 }), { tone: "hi" })));
}

function signboard(x, y) {
  const out = [];
  out.push(wood(box(x - 0.7, y - 2.4, 1.4, 4.8, 0.6, 1.2, { tone: "hi" })));
  out.push(wood(box(x - 0.4, y - 1.9, 0.8, 3.8, 1.8, 10, { tone: "mid", inner: L(k.sideSeam({ x: x - 0.4, y: y - 1.9, w: 0.8, d: 3.8, r: 0 }, 10.8, P, 2), { tone: "lo" }) })));
  out.push(roof(box(x - 0.9, y - 2.5, 1.8, 5, 11.8, 0.8, { tone: "hi" })));
  return out.join("");
}

function vending(x, y) {
  const out = [];
  const b = { x, y, w: 4.6, d: 6.4, r: 0.3 };
  const xf = x + b.w;
  // a dark display window with rows of sample slots, a coin panel and the flap at the foot
  const marks = [faceRect("x", xf, y + 0.8, y + 5.6, 7, 12.6), faceRect("x", xf, y + 0.8, y + 5.6, 1.6, 2.8)];
  for (const z of [8.9, 10.8]) marks.push(faceLine("x", xf, y + 0.8, z, y + 5.6, z));
  out.push(halo(k.insetPlan(b, -1.5), 0.6, 0.1, 2));
  out.push(slab(b, 0.6, 13, { tone: "mid", inner: L(marks.join(""), { tone: "lo" }) }, 3, 0.3));
  out.push(k.dotsSvg([at([xf, y + 4.6, 5.5]), at([xf, y + 4.6, 6.4])], { size: 0.45, tone: "hi" }));
  return out.join("");
}

// ---------- next door ----------
function house() {
  const out = [];
  const Hs = { x: -50, y: 14, w: 26, d: 28, r: 0 };
  out.push(halo(k.insetPlan(Hs, -3), 0, 0.1, 3));
  out.push(stoneAc(slab(k.insetPlan(Hs, -0.5), 0, 1.2, { tone: "mid" }, 2, 0.3)));
  const w = [faceRect("x", Hs.x + Hs.w, Hs.y + 4, Hs.y + 12, 4.5, 10), faceLine("x", Hs.x + Hs.w, Hs.y + 8, 4.5, Hs.y + 8, 10), faceRect("y", Hs.y + Hs.d, Hs.x + 8, Hs.x + 18, 4.5, 10)];
  out.push(wood(slab(Hs, 1.2, 12, { tone: "mid", inner: L(w.join(""), { tone: "lo" }) }, 2)));
  const r = roofOf(Hs, 3.5, 13.2, { x: Hs.x + Hs.w / 2 - 1, y: Hs.y + 6, w: 2, d: Hs.d - 12 }, 21, { lift: 1, flare: 0.6, fascia: 1, n: 6 });
  out.push(roof(count(S(r.paths, { tone: "hi" })) + L(courses(r, [0.5]), { tone: "lo" })));
  return out.join("");
}

function fence() {
  const f = { x: -19, y: 12, w: 1, d: 32, r: 0 };
  const lines = [];
  for (let y = f.y + 1.1; y < f.y + f.d - 0.5; y += 1.1) lines.push(faceLine("x", f.x + f.w, y, 0.6, y, 7.4));
  return wood(slab(f, 0.6, 6.8, { tone: "hi", inner: L(lines.join(""), { tone: "lo" }) }, 2)) +
    wood(box(f.x - 0.3, f.y, 1.6, f.d, 7.4, 0.7, { tone: "hi" }));
}

// A concrete utility pole with its cross-arm, insulators and a pole transformer.
function pole(x, y) {
  const out = [];
  out.push(halo({ x: x - 2, y: y - 2, w: 4, d: 4, r: 2 }, 0.6, 0.1, 2));
  out.push(cyl(x, y, 1.05, 0.6, 52, { tone: "mid", inner: L([12, 24, 36].map((z) => k.sideArc(x, y, 1.05, z, P, 16)).join(""), { tone: "faint" }) }, 16));
  out.push(cyl(x - 2.2, y, 1.5, 34, 5, { tone: "mid", inner: L(k.sideArc(x - 2.2, y, 1.5, 37.5, P, 16), { tone: "faint" }) }, 16, 0.3));
  out.push(count(S(bar([x, y - 7, 47], [x, y + 7, 47], 0.5), { tone: "mid" })));
  for (const dy of [-6, -2.5, 2.5, 6]) out.push(cyl(x, y + dy, 0.45, 47.5, 1.2, { tone: "mid" }, 10));
  return out.join("");
}

// ---------- the temple across the lane ----------
// A plastered mud wall (tsuiji-bei) with the five rank lines and a tiled coping.
function wallRun(y0, y1) {
  const out = [];
  const Wp = { x: 26, y: y0, w: 3, d: y1 - y0, r: 0 };
  const lines = [];
  for (const z of [3.8, 5, 6.2, 7.4, 8.6]) lines.push(k.sideSeam(Wp, z, P, 2));
  out.push(halo(k.insetPlan(Wp, -2), 0, 0.1, 2));
  out.push(stoneAc(slab(k.insetPlan(Wp, -0.4), 0, 1.6, { tone: "mid" }, 2, 0.3)));
  out.push(slab(Wp, 1.6, 9.6, { tone: "mid", inner: L(lines.join(""), { tone: "lo" }) }, 2));
  const r = roofOf(Wp, 1.6, 11.2, { x: Wp.x + 1, y: Wp.y + 1, w: 1, d: Wp.d - 2 }, 13.4, { lift: 0.3, flare: 0.3, fascia: 0.7, n: 4 });
  out.push(roof(count(S(r.paths, { tone: "hi" }))));
  return out.join("");
}

// The temple gate in the wall: two posts, a lintel and a small tiled roof.
function templeGate(y0, y1) {
  const out = [];
  const x = 27.5;
  out.push(stoneAc(slab({ x: x - 3, y: y0, w: 6, d: y1 - y0, r: 0 }, 0, 0.8, { tone: "mid" }, 2, 0.3)));
  for (const y of [y0 + 0.9, y1 - 0.9]) out.push(wood(cyl(x, y, 0.9, 0.8, 13.2, { tone: "hi" }, 14)));
  out.push(wood(box(x - 1.1, y0, 2.2, y1 - y0, 12.4, 1.6, { tone: "hi" })));
  const plan = { x: x - 2, y: y0 - 0.5, w: 4, d: y1 - y0 + 1, r: 0 };
  const r = roofOf(plan, 2.2, 14, { x: x - 0.4, y: y0 + 1.5, w: 0.8, d: y1 - y0 - 3 }, 18, { lift: 0.8, flare: 0.6, fascia: 0.8, n: 4 });
  out.push(roof(count(S(r.paths, { tone: "hi" })) + L(courses(r, [0.5]), { tone: "lo" })));
  return out.join("");
}

function templeWall() {
  return wallRun(-56, -15) + templeGate(-15, -3) + wallRun(-3, 60);
}

function steppingStones() {
  const out = [];
  for (const [x, y, r] of [[33, -9, 1.8], [37.5, -7.6, 1.6], [42, -9.4, 1.8], [46.5, -7.8, 1.6]]) {
    out.push(stoneAc(slab({ x: x - r, y: y - r * 0.8, w: r * 2, d: r * 1.6, r: r * 0.7 }, 1.2, 0.5, { tone: "mid" }, 4, 0.2)));
  }
  return out.join("");
}

// ---------- assemble ----------
const front = [
  { at: [XF + 10, -2, 0], svg: bench(XF + 10, -2) + cat(XF + 10.4, -4.5, 5.9) },
  { at: [XF + 5, 7, 0], svg: pot(XF + 5, 6.5, 1.6, 2.6, 2) + pot(XF + 4.4, 10.2, 1.2, 2, 1.6) },
  { at: [XF + 7, -46, 0], svg: signboard(XF + 7, -47) },
  { at: [-12, 48, 0], svg: vending(-14, 46) },
  { at: [1, -52, 0], svg: pole(1, -52) },
];

const gardenItems = [
  { at: [54, -34, 0], svg: K.pineTree(54, -34, 1.2, 1.6) },
  { at: [40, 8, 0], svg: K.lantern(40, 8, 1.2) },
  { at: [56, 34, 0], svg: K.roundTree(56, 34, 1.2, 1.4, { wood, leaf: pineAc }) },
  { at: [38, 40, 0], svg: K.roundTree(38, 44, 1.2, 1.0, { wood, leaf: pineAc }) },
  { at: [36, -26, 0], svg: K.stone(36, -26, 2.6, 2.2, 1.2, 3) },
  { at: [50, 12, 0], svg: K.stone(50, 12, 2.2, 1.8, 1.2, 5) },
  { at: [64, -4, 0], svg: K.stone(64, -4, 3.2, 2.6, 1.2, 7) },
  { at: [66, 54, 0], svg: K.stone(66, 54, 2.4, 2, 1.2, 9) },
  ...[[34, 22, 2.4], [33.5, 28, 2], [35, 56, 2.6]].map(([x, y, r]) => ({ at: [x, y, 0], svg: pineAc(count(S(G.sphereOf([x, y, 1.2 + r * 0.6], r, P, { steps: 32 }), { tone: "hi" }))) })),
];

const body = minify([
  K.plinth(),
  lane(),
  garden(),
  K.roundTree(-40, -54, 0, 1.7, { wood, leaf: pineAc }),
  shop(),
  norens(),
  shopTop(),
  house(),
  fence(),
  ...byDepth(front, (i) => i.at).map((i) => i.svg),
  templeWall(),
  steppingStones(),
  ...byDepth(gardenItems, (i) => i.at).map((i) => i.svg),
].join(""));

const LABEL = "A street corner of old Yanaka in isometric view: a two-storey wooden shop with indigo noren and a lattice upper floor, a ginger cat on the bench in front, potted plants, a utility pole, and a temple wall with its garden across the stone lane.";

emit({
  nn: "11",
  here: HERE,
  out: join(HERE, "../out"),
  subject: "Esquina de Yanaka (shitamachi)",
  doc: [
    "Esquina de Yanaka isométrica (shitamachi, el Tokio de antes de la guerra) — día 11.",
    "",
    "Tienda de madera de dos plantas con noren añil y celosía, un gato pelirrojo en el banco,",
    "macetas, máquina expendedora, poste eléctrico y, al otro lado del callejón, el muro de un",
    "templo con su jardín. Los noren se mecen levemente (solo CSS; se detienen con",
    "prefers-reduced-motion).",
  ],
  label: LABEL,
  body,
  accents: accentsFor,
  solids: K.counter.n,
});
