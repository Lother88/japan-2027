// Day 10 (Shibuya, Harajuku, Shinjuku): the Shibuya scramble crossing as an isometric
// diorama on the set's plinth. An asphalt crossroads with its four zebra crossings and the
// two diagonals, kerbed corner blocks, a glass tower with the big street screen (it glows
// softly, CSS only), a round tower with a sign ring, the low station building with the
// Hachikō statue and its trees, traffic signals at every corner (the walk lamps breathe),
// and a few people crossing.
//
//   node build.mjs  → day10-light/dark.svg/.html here, ../out/day10Iso.markup.ts

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
    asphalt: theme === "light" ? mix(s.ink, s.paper, 0.72) : mix(s.paper, s.ink, 0.2),
    paint: theme === "light" ? s.paper : mix(s.ink, s.paper, 0.15),
    glass: theme === "light" ? mix(s.ink, s.paper, 0.86) : mix(s.paper, s.ink, 0.3),
    amber: s.amber,
    walk: { hex: s.green, mode: "ink" },
  };
}

const P = fitOf();
const K = kitFor(P);
const { at, S, L, ac, byDepth, pathOf, count, slab, box, cyl, halo, faceLine, faceRect, facePoly, bar } = K;
const roof = ac("roof");
const wood = ac("wood");
const asphalt = ac("asphalt");
const paintAc = ac("paint");
const glass = ac("glass");
const amber = ac("amber");
const walk = ac("walk");

// ---------- the crossroads ----------
const X0 = -16;
const X1 = 32;
const Y0 = -16;
const Y1 = 28;
const KERB = 1.6;
const ROAD_Z = 0.5;

function road() {
  const plan = k.insetPlan(PLINTH, 3.5);
  return asphalt(slab(plan, 0, ROAD_Z, { tone: "mid", crease: "none" }, 6));
}

// Flat road paint: one solid per crossing, every stripe a quad on the asphalt.
function paint(quads) {
  const d = quads.map((q) => pathOf(q.map(([x, y]) => at([x, y, ROAD_Z + 0.05])), true)).join("");
  return paintAc(count(S({ fill: d, outline: d, crease: "", top: d, shades: ["", "", "", ""] }, { tone: "faint", crease: "none" })));
}
const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

function crossings() {
  const out = [];
  const stripes = (along, c0, c1, from, to) => {
    const q = [];
    for (let u = from + 1.2; u + 2 <= to - 0.6; u += 4) q.push(along === "x" ? rect(c0, u, c1, u + 2) : rect(u, c0, u + 2, c1));
    return q;
  };
  out.push(paint(stripes("x", X0 - 13, X0 - 3, Y0, Y1)));
  out.push(paint(stripes("x", X1 + 3, X1 + 13, Y0, Y1)));
  out.push(paint(stripes("y", Y0 - 13, Y0 - 3, X0, X1)));
  out.push(paint(stripes("y", Y1 + 3, Y1 + 13, X0, X1)));
  // the two diagonals of the scramble
  const diag = (A, B, skip) => {
    const d = [B[0] - A[0], B[1] - A[1]];
    const len = Math.hypot(...d);
    const t = [d[0] / len, d[1] / len];
    const n = [-t[1], t[0]];
    const q = [];
    for (let s = 6; s <= len - 6; s += 4) {
      if (skip && Math.abs(s - len / 2) < 6) continue;
      const c = [A[0] + t[0] * s, A[1] + t[1] * s];
      const p = (a1, b1) => [c[0] + t[0] * a1 + n[0] * b1, c[1] + t[1] * a1 + n[1] * b1];
      q.push([p(-1, -4.5), p(1, -4.5), p(1, 4.5), p(-1, 4.5)]);
    }
    return q;
  };
  out.push(paint(diag([X0, Y0], [X1, Y1], false)));
  out.push(paint(diag([X1, Y0], [X0, Y1], true)));
  return out.join("");
}

// The four kerbed corner blocks; each keeps the plinth's rounded outer corner.
const BLOCKS = {
  back: { x: -64.5, y: -60.5, w: X0 - 0.5 + 64.5, d: Y0 - 0.5 + 60.5 },
  right: { x: X1 + 0.5, y: -60.5, w: 74.5 - X1 - 0.5, d: Y0 - 0.5 + 60.5 },
  left: { x: -64.5, y: Y1 + 0.5, w: X0 - 0.5 + 64.5, d: 68.5 - Y1 - 0.5 },
  front: { x: X1 + 0.5, y: Y1 + 0.5, w: 74.5 - X1 - 0.5, d: 68.5 - Y1 - 0.5 },
};
function sidewalks() {
  return Object.values(BLOCKS).map((b) => slab({ ...b, r: 2 }, ROAD_Z, KERB - ROAD_Z, { tone: "mid", inner: L(k.sideSeam({ ...b, r: 2 }, ROAD_Z + 0.5, P, 3), { tone: "faint" }) }, 3, 0.3)).join("");
}

// ---------- the glass tower with the big screen ----------
function tower() {
  const out = [];
  const T = { x: -60, y: -57, w: 36, d: 34, r: 5 };
  const z0 = KERB;
  const zt = 64;
  const xf = T.x + T.w;
  const yf = T.y + T.d;
  out.push(halo(k.insetPlan(T, -3), z0, 0.1, 3));
  // podium: shop glazing at street level
  const shopLines = [];
  for (let u = T.y + T.r + 3; u < yf - T.r - 1; u += 4) shopLines.push(faceLine("x", xf, u, z0, u, 9));
  for (let u = T.x + T.r + 3; u < xf - T.r - 1; u += 4) shopLines.push(faceLine("y", yf, u, z0, u, 9));
  out.push(glass(slab(T, z0, 9 - z0, { tone: "mid", inner: L(shopLines.join(""), { tone: "lo" }) }, 6)));
  out.push(slab(k.insetPlan(T, -0.8), 9, 2, { tone: "mid" }, 6, 0.3));
  // curtain wall: floor seams round the near half, mullions between them
  const floors = [];
  for (let z = 17; z < zt - 3; z += 6) floors.push(k.sideSeam(T, z, P, 6));
  const mull = [];
  for (let u = T.y + T.r + 3; u < yf - T.r - 1; u += 5) mull.push(faceLine("x", xf, u, 11, u, zt));
  for (let u = T.x + T.r + 3; u < xf - T.r - 1; u += 5) mull.push(faceLine("y", yf, u, 11, u, zt));
  out.push(glass(slab(T, 11, zt - 11, { tone: "mid", inner: L(floors.join(""), { tone: "faint" }) + L(mull.join(""), { tone: "faint" }) }, 6)));
  // roof: parapet, plant room, water tank, mast
  const roofPlan = k.insetPlan(T, 1.2);
  out.push(slab(roofPlan, zt, 1.4, { tone: "mid" }, 6, 0.3));
  out.push(box(T.x + 6, T.y + 6, 12, 10, zt + 1.4, 5, { tone: "mid", inner: L(k.sideSeam({ x: T.x + 6, y: T.y + 6, w: 12, d: 10, r: 0 }, zt + 3.4, P, 2), { tone: "lo" }) }));
  out.push(cyl(T.x + 26, T.y + 12, 3.2, zt + 1.4, 6, { tone: "mid", inner: L(k.sideArc(T.x + 26, T.y + 12, 3.2, zt + 4.4, P, 20), { tone: "faint" }) }, 20, 0.3));
  out.push(cyl(T.x + 10, T.y + 24, 0.5, zt + 1.4, 8, { tone: "mid" }, 8));
  // the big screen on the face toward the crossing, in a dark frame; its picture breathes
  const sc = { x: xf, y: T.y + 7, w: 1.2, d: 22, r: 0 };
  out.push(roof(slab(sc, 30, 26, { tone: "hi" }, 2)));
  const pic = facePoly("x", xf + 1.2, [[sc.y + 1.4, 31.6], [sc.y + sc.d - 1.4, 31.6], [sc.y + sc.d - 1.4, 54.4], [sc.y + 1.4, 54.4]]);
  const bands = [];
  for (const z of [37.3, 43, 48.7]) bands.push(faceLine("x", xf + 1.2, sc.y + 1.4, z, sc.y + sc.d - 1.4, z));
  const screen = `<path class="iso-fill" d="${pic}"/><path class="iso-top" d="${pic}"/>` + a.amPulse(`<path d="${pic}" style="fill:var(--anatomy-lit-top);stroke:none"/>`, { period: 6400, min: 0.15 }) + L(bands.join(""), { tone: "faint" }) + L(pic, { tone: "lo" });
  out.push(amber(screen));
  return out.join("");
}

// ---------- the round tower with its sign ring ----------
function roundTower() {
  const out = [];
  const base = { x: 44, y: -56, w: 26, d: 30, r: 1 };
  out.push(halo(k.insetPlan(base, -3), KERB, 0.1, 3));
  const fl = [k.sideSeam(base, 10, P, 2), k.sideSeam(base, 18, P, 2), k.sideSeam(base, 26, P, 2)].join("");
  const win = [];
  const xf = base.x + base.w;
  const yf = base.y + base.d;
  for (const z of [11.5, 19.5, 27.5]) {
    for (let u = base.y + 2; u + 3 <= yf - 1; u += 4.6) win.push(faceRect("x", xf, u, u + 3, z, z + 4.5));
    for (let u = base.x + 12; u + 3 <= xf - 1; u += 4.6) win.push(faceRect("y", yf, u, u + 3, z, z + 4.5));
  }
  out.push(slab(base, KERB, 34 - KERB, { tone: "mid", inner: L(fl, { tone: "faint" }) + L(win.join(""), { tone: "lo" }) }, 2));
  out.push(slab(k.insetPlan(base, 1), 34, 1.2, { tone: "mid" }, 2, 0.3));
  out.push(box(base.x + 14, base.y + 4, 8, 6, 35.2, 3.4, { tone: "mid", inner: L(k.sideSeam({ x: base.x + 14, y: base.y + 4, w: 8, d: 6, r: 0 }, 37, P, 2), { tone: "lo" }) }));
  const cx = 44;
  const cy = -27;
  const R = 10;
  const bands = [8, 16, 24, 32, 40].map((z) => k.sideArc(cx, cy, R, z, P, 40)).join("");
  out.push(glass(cyl(cx, cy, R, KERB, 46 - KERB, { tone: "mid", inner: L(bands, { tone: "faint" }) }, 40)));
  out.push(amber(cyl(cx, cy, R + 0.8, 46, 6, { tone: "hi", inner: L(k.sideArc(cx, cy, R + 0.8, 49, P, 40), { tone: "lo" }) }, 40)));
  out.push(cyl(cx, cy, R - 0.6, 52, 1.6, { tone: "mid" }, 40, 0.3));
  out.push(cyl(cx, cy, 0.5, 53.6, 7, { tone: "mid" }, 8));
  return out.join("");
}

// ---------- the station side: low building, Hachikō and trees ----------
function station() {
  const out = [];
  const b = { x: -60, y: 44, w: 34, d: 22, r: 0 };
  out.push(halo(k.insetPlan(b, -3), KERB, 0.1, 3));
  const win = [];
  const xf = b.x + b.w;
  for (let u = b.y + 2; u + 3 <= b.y + b.d - 1; u += 4.5) win.push(faceRect("x", xf, u, u + 3, 9, 14));
  for (let u = b.x + 2; u + 3 <= b.x + b.w - 1; u += 4.5) win.push(faceRect("y", b.y + b.d, u, u + 3, 9, 14));
  win.push(k.sideSeam(b, 7, P, 2));
  out.push(slab(b, KERB, 18 - KERB, { tone: "mid", inner: L(win.join(""), { tone: "lo" }) }, 2));
  out.push(slab(k.insetPlan(b, -1), 18, 1.4, { tone: "mid" }, 2, 0.3));
  // the entrance canopy toward the crossing
  out.push(roof(box(xf, b.y + 4, 6, 14, 6.5, 1, { tone: "hi" })));
  for (const y of [b.y + 5, b.y + 17]) out.push(cyl(xf + 5, y, 0.45, KERB, 6.5 - KERB, { tone: "mid" }, 8));
  return out.join("");
}

function hachiko(x, y) {
  const out = [];
  out.push(halo({ x: x - 4, y: y - 5, w: 8, d: 10, r: 2 }, KERB, 0.1, 2));
  out.push(slab({ x: x - 2.6, y: y - 3.6, w: 5.2, d: 7.2, r: 0.3 }, KERB, 5, { tone: "mid", inner: L(k.sideSeam({ x: x - 2.6, y: y - 3.6, w: 5.2, d: 7.2, r: 0.3 }, KERB + 1.2, P, 2), { tone: "faint" }) }, 2, 0.3));
  // the dog sits facing the crossing (+x): haunch, chest, head, ears
  const z = KERB + 5;
  out.push(wood(slab({ x: x - 1.6, y: y - 1.1, w: 3, d: 2.2, r: 1 }, z, 2.4, { tone: "hi" }, 4, 0.3)));
  out.push(wood(count(S(bar([x + 0.4, y, z], [x + 1.1, y, z + 4.2], 0.9, 1.0), { tone: "hi" }))));
  out.push(wood(count(S(G.sphereOf([x + 1.4, y, z + 4.9], 1.1, P, { steps: 24 }), { tone: "hi" }))));
  out.push(wood(count(S(bar([x + 2.2, y, z + 4.6], [x + 3.1, y, z + 4.4], 0.45, 0.4), { tone: "hi" }))));
  return out.join("");
}

// ---------- signals and people ----------
function signal(x, y, toward) {
  const out = [];
  out.push(halo({ x: x - 1.5, y: y - 1.5, w: 3, d: 3, r: 1.5 }, KERB, 0.1, 1));
  out.push(cyl(x, y, 0.55, KERB, 22, { tone: "mid" }, 10));
  // the pedestrian head with its walk lamp, on the side facing the crossing
  const ped = { x: x - 0.9, y: y - 0.9, w: 1.8, d: 1.8, r: 0 };
  out.push(roof(slab(ped, 9.5, 3.6, { tone: "hi" }, 2)));
  const lamp = [at([x + 0.9, y, 11.3]), at([x, y + 0.9, 11.3])];
  out.push(walk(a.amPulse(k.dotsSvg(lamp, { size: 0.75, tone: "hi" }), { period: 4200, min: 0.25 })));
  // the arm out over the road and the car signal head
  const tip = [x + toward[0] * 9, y + toward[1] * 9, 21];
  out.push(count(S(bar([x, y, 21], tip, 0.35), { tone: "mid" })));
  const along = toward[0] !== 0 ? "x" : "y";
  const head = along === "x" ? { x: tip[0] - 3.2, y: tip[1] - 0.8, w: 6.4, d: 1.6, r: 0.3 } : { x: tip[0] - 0.8, y: tip[1] - 3.2, w: 1.6, d: 6.4, r: 0.3 };
  out.push(roof(slab(head, 18.6, 2, { tone: "hi" }, 2)));
  return out.join("");
}

function person(x, y, shade = "roof") {
  const out = [];
  out.push(halo({ x: x - 1.4, y: y - 1.4, w: 2.8, d: 2.8, r: 1.4 }, ROAD_Z, 0.1, 1));
  out.push(roof(box(x - 0.45, y - 0.7, 0.9, 1.4, ROAD_Z, 2.4, { tone: "hi" })));
  out.push(ac(shade)(cyl(x, y, 1.05, ROAD_Z + 2.4, 2.9, { tone: "hi" }, 14, 0.3)));
  out.push(count(S(G.sphereOf([x, y, ROAD_Z + 6.1], 0.8, P, { steps: 20 }), { tone: "mid" })));
  return out.join("");
}

function streetTree(x, y) {
  return slab({ x: x - 2.4, y: y - 2.4, w: 4.8, d: 4.8, r: 0 }, KERB, 0.6, { tone: "mid" }, 2) + K.roundTree(x, y, KERB + 0.6, 0.95, { wood, leaf: ac("pine") });
}

// ---------- assemble ----------
const items = [
  { at: [-26, 40, 0], svg: station() },
  { at: [-20, 36, 0], svg: hachiko(-20, 36) },
  { at: [-40, 36, 0], svg: streetTree(-42, 36) },
  { at: [-56, 34, 0], svg: streetTree(-56, 34) },
  { at: [-19, -19, 0], svg: signal(-19, -19, [1, 0]) },
  { at: [35, -19, 0], svg: signal(35, -19, [0, 1]) },
  { at: [-19, 31, 0], svg: signal(-19, 31, [0, -1]) },
  { at: [35, 31, 0], svg: signal(35, 31, [-1, 0]) },
  { at: [50, 40, 0], svg: streetTree(50, 40) },
  { at: [66, 40, 0], svg: streetTree(66, 40) },
  { at: [42, 58, 0], svg: streetTree(42, 58) },
  ...[[-22, 4, "glass"], [-25, 18, "amber"], [10, -22, "roof"], [20, 36, "glass"], [0, 0, "roof"], [14, 12, "wood"], [39, -4, "roof"], [-6, 20, "glass"]]
    .map(([x, y, c]) => ({ at: [x, y, 0], svg: person(x, y, c) })),
];

const body = minify([
  K.plinth(),
  road(),
  crossings(),
  sidewalks(),
  tower(),
  roundTower(),
  ...byDepth(items, (i) => i.at).map((i) => i.svg),
].join(""));

const LABEL = "The Shibuya scramble crossing in isometric view: zebra crossings and the two diagonals, a glass tower with a big street screen, a round tower, the station with the Hachikō statue, traffic signals and people crossing.";

emit({
  nn: "10",
  here: HERE,
  out: join(HERE, "../out"),
  subject: "Cruce de Shibuya",
  doc: [
    "Cruce de Shibuya isométrico (scramble crossing) — día 10.",
    "",
    "Cebras en los cuatro brazos y las dos diagonales, torre de cristal con la gran pantalla,",
    "torre redonda con su anillo de rótulo, la estación con la estatua de Hachikō, semáforos y",
    "algunos peatones. La pantalla y las luces de paso respiran (solo CSS; se detienen con",
    "prefers-reduced-motion).",
  ],
  label: LABEL,
  body,
  accents: accentsFor,
  solids: K.counter.n,
});
