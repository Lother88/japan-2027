// Day 12 (Imperial Palace, Ginza, Tsukiji): the Imperial Palace moat as an isometric diorama
// on the set's plinth. The battered stone walls (ishigaki) rise from the moat; on top stands
// the Fushimi-yagura, a two-storey white turret with its long tamon wings; the stone double-
// arch bridge (Seimon Ishibashi) crosses the water to the gate, with its lamps; and the
// black pines of the outer garden stand on the gravel in front. The arches and their
// reflection make the "spectacles" in the water, which shimmer softly (CSS only).
//
//   node build.mjs  → day12-light/dark.svg/.html here, ../out/day12Iso.markup.ts

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
    water: b.water,
    moss: b.moss,
    ripple: b.ripple,
    plaster: b.plaster,
    stone: b.stone,
    gravel: theme === "light" ? mix(s.gold, s.paper, 0.86) : mix(s.gold, s.paper, 0.7),
  };
}

const P = fitOf();
const K = kitFor(P);
const { at, S, L, ac, byDepth, pathOf, count, slab, box, cyl, halo, roofOf, courses, faceLine, faceRect, polySolid, rectRing } = K;
const roof = ac("roof");
const water = ac("water");
const moss = ac("moss");
const ripple = ac("ripple");
const plaster = ac("plaster");
const stoneAc = ac("stone");
const gravel = ac("gravel");

const WATER_Z = 0.5;
const WALL_Z = 22; // top of the stone walls
const BATTER = 11; // how far the face leans back over its height
const WALL_X = -12.5; // foot of the wall at the water
const GAP = [14, 32]; // the gate between the two wall runs
const BR = { x0: -14, x1: 30, y0: 19, y1: 29, deck: 11 }; // the bridge

// ---------- water ----------
const POND = k.insetPlan(PLINTH, 3.5);
function moat() {
  return water(slab(POND, 0, WATER_Z, { tone: "lo", crease: "none" }, 6));
}

// ---------- the bridge geometry ----------
// The face profile (u = x, z): two elliptical arches springing at z 2 from the abutments and
// the middle pier, under a flat deck.
const ARCHES = [[-10.4, 8], [10.6, 27.2]];
const SPRING = 2.2;
const RISE = 5.8;
function archPts([u0, u1], n = 14) {
  const c = (u0 + u1) / 2;
  const hw = (u1 - u0) / 2;
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = Math.PI * (1 - i / n);
    return [c + hw * Math.cos(t), SPRING + RISE * Math.sin(t)];
  });
}
function faceProfile() {
  const pts = [[BR.x1, WATER_Z], [BR.x1, BR.deck], [BR.x0, BR.deck], [BR.x0, WATER_Z]];
  for (const arch of ARCHES) {
    pts.push([arch[0], WATER_Z]);
    pts.push(...archPts(arch));
    pts.push([arch[1], WATER_Z]);
  }
  return pts;
}

// The arch barrels: the inner surfaces seen through the openings, drawn first.
function barrels() {
  const out = [];
  for (const arch of ARCHES) {
    const pts = archPts(arch);
    const c = (arch[0] + arch[1]) / 2;
    const faces = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const [u0, z0] = pts[i];
      const [u1, z1] = pts[i + 1];
      faces.push({ pts: [[u0, BR.y0, z0], [u1, BR.y0, z1], [u1, BR.y1, z1], [u0, BR.y1, z0]], hint: [c - (u0 + u1) / 2, 0, SPRING - (z0 + z1) / 2] });
    }
    out.push(stoneAc(count(S(polySolid(faces), { tone: "mid", crease: "none" }))));
  }
  return out.join("");
}

function bridge() {
  const out = [];
  const prof = faceProfile();
  const front = prof.map(([u, z]) => [u, BR.y1, z]);
  const back = prof.map(([u, z]) => [u, BR.y0, z]);
  const faces = [
    { pts: front, hint: [0, 1, 0] },
    { pts: back, hint: [0, -1, 0] },
    { pts: [[BR.x1, BR.y0, BR.deck], [BR.x0, BR.y0, BR.deck], [BR.x0, BR.y1, BR.deck], [BR.x1, BR.y1, BR.deck]], hint: [0, 0, 1] },
    { pts: [[BR.x1, BR.y0, WATER_Z], [BR.x1, BR.y0, BR.deck], [BR.x1, BR.y1, BR.deck], [BR.x1, BR.y1, WATER_Z]], hint: [1, 0, 0] },
  ];
  // voussoir joints round each arch and a string course under the parapet, on the front face
  const marks = [];
  for (const arch of ARCHES) {
    const c = (arch[0] + arch[1]) / 2;
    const hw = (arch[1] - arch[0]) / 2;
    for (let i = 1; i < 9; i++) {
      const t = Math.PI * (1 - i / 9);
      const p0 = [c + hw * Math.cos(t), SPRING + RISE * Math.sin(t)];
      const p1 = [c + (hw + 2.2) * Math.cos(t), SPRING + (RISE + 2.2) * Math.sin(t)];
      marks.push(faceLine("y", BR.y1, p0[0], p0[1], p1[0], p1[1]));
    }
    marks.push(pathOf(archPts([arch[0] - 2.2, arch[1] + 2.2]).map(([u, z]) => at([u, BR.y1, z + (z === SPRING ? 0 : 0)]))));
  }
  marks.push(faceLine("y", BR.y1, BR.x0, BR.deck - 1.2, BR.x1, BR.deck - 1.2));
  out.push(stoneAc(count(S(polySolid(faces), { tone: "mid", inner: L(marks.join(""), { tone: "faint" }) }))));
  return out.join("");
}

function parapet(y, lampsOn) {
  const out = [];
  const p = { x: BR.x0 + 0.5, y: y - 0.6, w: BR.x1 - BR.x0 - 1, d: 1.2, r: 0 };
  out.push(stoneAc(slab(p, BR.deck, 2.4, { tone: "mid" }, 2, 0.2)));
  out.push(stoneAc(slab(k.insetPlan(p, -0.3), BR.deck + 2.4, 0.6, { tone: "mid" }, 2, 0.2)));
  for (const x of lampsOn) out.push(lamp(x, y, BR.deck + 3));
  return out.join("");
}

// An iron bridge lamp: a fluted post, a four-sided lantern and a cap with a finial.
function lamp(x, y, z) {
  const out = [];
  out.push(stoneAc(slab({ x: x - 1.3, y: y - 1.3, w: 2.6, d: 2.6, r: 0 }, z, 1.2, { tone: "mid" }, 2, 0.2)));
  out.push(roof(cyl(x, y, 0.5, z + 1.2, 7.5, { tone: "hi" }, 10)));
  const head = { x: x - 1.1, y: y - 1.1, w: 2.2, d: 2.2, r: 0 };
  const panes = [faceRect("x", x + 1.1, y - 0.6, y + 0.6, z + 9.1, z + 11), faceRect("y", y + 1.1, x - 0.6, x + 0.6, z + 9.1, z + 11)].join("");
  out.push(roof(slab(head, z + 8.7, 2.7, { tone: "hi", inner: L(panes, { tone: "mid" }) }, 2)));
  out.push(roof(slab(k.insetPlan(head, -0.6), z + 11.4, 0.7, { tone: "hi" }, 2, 0.2)));
  out.push(roof(slab(k.insetPlan(head, 0.4), z + 12.1, 0.6, { tone: "hi" }, 2)));
  out.push(roof(count(S(G.sphereOf([x, y, z + 13.2], 0.5, P, { steps: 16 }), { tone: "hi" }))));
  return out.join("");
}

// Reflection of the bridge and its lamps: the arches close into the "spectacles".
function reflection() {
  const mirror = ([u, z]) => at([u, BR.y1, 2 * WATER_Z - z]);
  const prof = faceProfile();
  const d = pathOf(prof.map(mirror), true);
  const clip = pathOf(rectRing({ x: WALL_X + 0.3, y: POND.y + 2, w: 30 - WALL_X - 0.6, d: POND.d - 4 }, WATER_Z, 1).map((p) => at(p)), true);
  const strokes = [];
  for (const [x0, x1, y] of [[-6, 6, 34], [14, 26, 36], [-2, 18, 42], [0, 12, -20], [8, 22, 0]]) {
    strokes.push(k.fadeLineSvg([at([x0, y, WATER_Z]), at([x1, y, WATER_Z])], { fade: [5, 5], tone: "mid" }));
  }
  const fill = water(`<path d="${d}" style="fill:var(--anatomy-shade-0);stroke:none;fill-rule:evenodd"/>`);
  return `<clipPath id="d12-iso-moat"><path d="${clip}"/></clipPath><g clip-path="url(#d12-iso-moat)"><g opacity=".6">${a.amPulse(fill, { period: 7000, min: 0.7 })}</g>${a.amPulse(ripple(strokes.join("")), { period: 5200, delay: 1700, min: 0.25 })}</g>`;
}

// ---------- the walls ----------
const xAt = (z) => WALL_X - (BATTER * (z - WATER_Z)) / (WALL_Z - WATER_Z);
const BACK = POND.x;

function wallRun(y0, y1, endBatter) {
  const out = [];
  const base = { x: BACK, y: y0, w: WALL_X - BACK, d: y1 - y0 };
  const top = { x: BACK, y: y0 + endBatter[0], w: xAt(WALL_Z) - BACK, d: y1 - y0 - endBatter[0] - endBatter[1] };
  const paths = K.frustum(base, WATER_Z, top, WALL_Z);
  // courses round the visible faces, joints staggered between them on the moat face
  const lines = [];
  const yEnd = (z, side) => (side === 0 ? y0 + (endBatter[0] * (z - WATER_Z)) / (WALL_Z - WATER_Z) : y1 - (endBatter[1] * (z - WATER_Z)) / (WALL_Z - WATER_Z));
  const zs = [];
  for (let z = 3.6; z < WALL_Z - 1; z += 3.4) zs.push(z);
  for (const z of zs) {
    const pts = [[xAt(z), yEnd(z, 0), z], [xAt(z), yEnd(z, 1), z]];
    if (endBatter.showEnd) pts.push([BACK, yEnd(z, 1), z]);
    lines.push(pathOf(pts.map(at)));
  }
  const bands = [WATER_Z, ...zs, WALL_Z];
  bands.slice(0, -1).forEach((z0, i) => {
    const z1 = bands[i + 1];
    const zm = (z0 + z1) / 2;
    const off = i % 2 ? 3.6 : 0;
    for (let y = yEnd(zm, 0) + 3 + off; y < yEnd(zm, 1) - 2; y += 7.2) {
      lines.push(pathOf([at([xAt(z0), y, z0]), at([xAt(z1), y, z1])]));
    }
  });
  out.push(stoneAc(count(S(paths, { tone: "mid", inner: L(lines.join(""), { tone: "faint" }) }))));
  // the grassed top of the wall
  const lawn = { x: BACK + 1, y: top.y + 1, w: top.w - 2.5, d: top.d - 2, r: 1 };
  out.push(moss(slab(lawn, WALL_Z, 0.6, { tone: "mid" }, 3, 0.2)));
  return out.join("");
}

// The gate between the wall runs (the Seimon), reached by the bridge.
function gate() {
  const out = [];
  const g = { x: -28, y: GAP[0], w: BR.x0 + 28, d: GAP[1] - GAP[0], r: 0 };
  const xf = g.x + g.w;
  const marks = [k.sideSeam(g, 6, P, 2)];
  out.push(plaster(slab(g, WATER_Z, WALL_Z - 3 - WATER_Z, { tone: "mid", inner: L(marks.join(""), { tone: "lo" }) }, 2)));
  // the gateway: dark doors in a timber frame at deck level
  const door = { x: xf, y: BR.y0 + 1, w: 0.6, d: BR.y1 - BR.y0 - 2, r: 0 };
  const leaves = [faceLine("x", xf + 0.6, (door.y * 2 + door.d) / 2, BR.deck, (door.y * 2 + door.d) / 2, BR.deck + 7.4)];
  out.push(roof(slab(door, BR.deck, 7.4, { tone: "hi", inner: L(leaves.join(""), { tone: "mid" }) }, 2)));
  const r = roofOf(g, 2.6, WALL_Z - 3, { x: g.x + g.w / 2 - 0.6, y: g.y + 4, w: 1.2, d: g.d - 8 }, WALL_Z + 3.6, { lift: 1, flare: 0.8, fascia: 1, n: 6 });
  out.push(roof(count(S(r.paths, { tone: "hi" })) + L(courses(r, [0.5]), { tone: "lo" })));
  return out.join("");
}

// ---------- on the wall: the Fushimi-yagura and its tamon wings ----------
const YG = { x: -41.5, y: -42, w: 17, d: 24, r: 0 };
function tamon(y0, y1) {
  const out = [];
  const t = { x: -37.5, y: y0, w: 10, d: y1 - y0, r: 0 };
  const win = [];
  for (let y = y0 + 3; y + 2 <= y1 - 1; y += 5) win.push(faceRect("x", t.x + t.w, y, y + 2, WALL_Z + 3.4, WALL_Z + 5.6));
  out.push(halo(k.insetPlan(t, -2), WALL_Z + 0.6, 0.1, 2));
  out.push(plaster(slab(t, WALL_Z + 0.6, 7.4, { tone: "mid", inner: L(win.join(""), { tone: "lo" }) }, 2)));
  const r = roofOf(t, 2, WALL_Z + 8, { x: t.x + 4.4, y: t.y + 3, w: 1.2, d: t.d - 6 }, WALL_Z + 12.4, { lift: 0.5, flare: 0.4, fascia: 0.8, n: 6 });
  out.push(roof(count(S(r.paths, { tone: "hi" })) + L(courses(r, [0.5]), { tone: "lo" })));
  return out.join("");
}

function yagura() {
  const out = [];
  const z0 = WALL_Z + 0.6;
  const z1 = z0 + 13;
  const xf = YG.x + YG.w;
  const yf = YG.y + YG.d;
  out.push(halo(k.insetPlan(YG, -3), z0, 0.1, 3));
  const w1 = [];
  for (const y of [YG.y + 4, YG.y + 10.5, YG.y + 17]) w1.push(faceRect("x", xf, y, y + 3, z0 + 6.5, z0 + 9.5));
  for (const x of [YG.x + 3.5, YG.x + 10.5]) w1.push(faceRect("y", yf, x, x + 3, z0 + 6.5, z0 + 9.5));
  w1.push(k.sideSeam(YG, z0 + 3.2, P, 2));
  out.push(plaster(slab(YG, z0, z1 - z0, { tone: "mid", inner: L(w1.join(""), { tone: "lo" }) }, 2)));
  const UP = { x: YG.x + 3, y: YG.y + 5, w: YG.w - 6, d: YG.d - 10, r: 0 };
  const r1 = roofOf(YG, 3.4, z1, k.insetPlan(UP, -0.4), z1 + 4.6, { lift: 1.6, flare: 1.2, fascia: 1.2, n: 8 });
  out.push(roof(count(S(r1.paths, { tone: "hi" })) + L(courses(r1, [0.5]), { tone: "lo" })));
  const z2 = z1 + 4.6;
  const z3 = z2 + 7.4;
  const w2 = [faceRect("x", UP.x + UP.w, UP.y + 2.5, UP.y + 5.5, z2 + 2.4, z2 + 5), faceRect("x", UP.x + UP.w, UP.y + UP.d - 5.5, UP.y + UP.d - 2.5, z2 + 2.4, z2 + 5), faceRect("y", UP.y + UP.d, UP.x + 3.5, UP.x + 7.5, z2 + 2.4, z2 + 5)];
  out.push(plaster(slab(UP, z2, z3 - z2, { tone: "mid", inner: L(w2.join(""), { tone: "lo" }) }, 2)));
  const r2 = roofOf(UP, 3.2, z3, { x: UP.x + UP.w / 2 - 0.6, y: UP.y + 4, w: 1.2, d: UP.d - 8 }, z3 + 6.8, { lift: 1.6, flare: 1.2, fascia: 1.1, n: 8 });
  out.push(roof(count(S(r2.paths, { tone: "hi" })) + L(courses(r2, [0.35, 0.7]), { tone: "lo" })));
  const ridge = { x: UP.x + UP.w / 2 - 1.2, y: UP.y + 3.4, w: 2.4, d: UP.d - 6.8, r: 0 };
  out.push(roof(slab(ridge, z3 + 6.4, 1.4, { tone: "hi" }, 2)));
  for (const y of [ridge.y - 0.4, ridge.y + ridge.d - 1.2]) out.push(roof(slab({ x: ridge.x - 0.3, y, w: 3, d: 1.6, r: 0.3 }, z3 + 6.4, 3, { tone: "hi" }, 3, 0.2)));
  return out.join("");
}

// ---------- the outer garden ----------
const PLAZA = { x: 30, y: POND.y, w: POND.x + POND.w - 30, d: POND.d, r: 4.5 };
function plaza() {
  const out = [];
  out.push(gravel(slab(PLAZA, 0, 3.2, { tone: "mid", inner: L(k.sideSeam(PLAZA, 1.6, P, 6), { tone: "faint" }) }, 6, 0.4)));
  for (const lawn of [{ x: 40, y: -56, w: 30, d: 28, r: 3 }, { x: 44, y: 38, w: 26, d: 26, r: 3 }]) {
    out.push(moss(slab(lawn, 3.2, 0.6, { tone: "mid" }, 4, 0.2)));
  }
  return out.join("");
}

// Low granite posts along the moat edge of the garden.
function posts() {
  const out = [];
  const ys = [-54, -40, -26, -12, 2, 40, 54];
  for (const y of ys) out.push(gravel(cyl(32.5, y, 0.9, 3.2, 3, { tone: "mid" }, 12, 0.2)));
  return out.join("");
}

// ---------- assemble ----------
const runA = wallRun(POND.y, GAP[0], Object.assign([0, 0], { showEnd: true }));
const runB = wallRun(GAP[1], POND.y + POND.d, Object.assign([0, 3], { showEnd: true }));

const plazaItems = [
  { at: [55, -42, 0], svg: K.pineTree(55, -42, 3.8, 1.55, { lite: true }) },
  { at: [57, 50, 0], svg: K.pineTree(57, 50, 3.8, 1.35, { lite: true }) },
];

const PARTS = [
  K.plinth(),
  moat(),
  reflection(),
  runA,
  tamon(POND.y + 2, YG.y),
  yagura(),
  tamon(YG.y + YG.d, GAP[0] - 3),
  K.roundTree(-54, -8, WALL_Z + 0.6, 1.3, { wood: ac("wood"), leaf: ac("pine") }),
  barrels(),
  gate(),
  bridge(),
  parapet(BR.y0 + 0.6, [-9, 26]),
  parapet(BR.y1 - 0.6, [-9, 26]),
  plaza(),
  posts(),
  runB,
  K.roundTree(-52, 44, WALL_Z + 0.6, 1.2, { wood: ac("wood"), leaf: ac("pine") }),
  K.roundTree(-38, 58, WALL_Z + 0.6, 0.95, { wood: ac("wood"), leaf: ac("pine") }),
  ...byDepth(plazaItems, (i) => i.at).map((i) => i.svg),
];
if (process.env.SIZES) PARTS.forEach((p, n) => console.log(n, minify(p).length));
const body = minify(PARTS.join(""));

const LABEL = "The Imperial Palace moat in Tokyo in isometric view: battered stone walls with the white two-storey Fushimi-yagura on top, the stone double-arch bridge with its lamps crossing to the gate, its arches reflected in the water, and black pines on the gravel in front.";

emit({
  nn: "12",
  here: HERE,
  out: join(HERE, "../out"),
  subject: "Nijūbashi y Fushimi-yagura (Palacio Imperial)",
  doc: [
    "Palacio Imperial isométrico (foso, Nijūbashi y Fushimi-yagura) — día 12.",
    "",
    "Muros de piedra en talud sobre el foso, la torre blanca Fushimi-yagura con sus alas tamon,",
    "el puente de piedra de dos arcos con sus faroles hasta la puerta y los pinos negros del",
    "jardín exterior. El reflejo de los arcos (los \"anteojos\") titila en el agua (solo CSS;",
    "se detiene con prefers-reduced-motion).",
  ],
  label: LABEL,
  body,
  accents: accentsFor,
  solids: K.counter.n,
});
