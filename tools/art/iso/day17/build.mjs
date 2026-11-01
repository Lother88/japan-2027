// Day 17 — Shirakawa-go (Ogimachi): a gasshō-zukuri farmhouse, its steep thatch "praying hands"
// roof a metre thick, the gable end in dark timber with three rows of white shōji windows for the
// attic floors where silkworms were raised. It stands on its yard among tall cedars, with freshly
// planted rice paddies in front (May): water between earth bunds, rows of seedlings, and a small
// thatched fire-hydrant hut at the paddy edge. The paddy water shimmers (CSS only).
//
//   node build.mjs → day17-light/dark .svg/.html here, ../out/day17Iso.markup.ts

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as $ from "../lib-d15-19.mjs";

const { mix, k, a, G, W, H, at, S, L, D, ac, depth, byDepth, pathOf, count, slab, cyl, plinth, polySolid, prismFaces, gableRoof, bar, halo, box, faceLine, faceRect, minify, emit } = $;
const HERE = dirname(fileURLToPath(import.meta.url));

function accentsFor(theme) {
  const b = $.baseAccents(theme);
  const s = $.SITE[theme];
  return {
    water: b.water,
    ripple: b.ripple,
    moss: b.moss,
    pine: b.pine,
    thatch: theme === "light" ? mix(s.gold, s.brown, 0.35) : mix(mix(s.gold, s.brown, 0.45), s.paper, 0.18),
    timber: theme === "light" ? mix(s.brown, s.ink, 0.3) : mix(s.brown, s.paper, 0.22),
    plaster: b.plaster,
    sprout: { hex: s.green, mode: "ink" },
  };
}
const water = ac("water");
const ripple = ac("ripple");
const moss = ac("moss");
const pine = ac("pine");
const thatch = ac("thatch");
const timber = ac("timber");
const plaster = ac("plaster");
const sprout = ac("sprout");

// ---------- world ----------
const PLINTH = { x: -68, y: -64, w: 146, d: 136, r: 8 };
const YARD = { x: -66, y: -62, w: 96, d: 82, r: 4 }; // x -66..30, y -62..20
const YZ = 2;
const HOUSE = { x: -40, y: -46, w: 54, d: 40, r: 0 }; // x -40..14, y -46..-6
const HOUSE2 = { x: 44, y: -56, w: 28, d: 24, r: 0 }; // a smaller neighbour on its own plot
const YARD2 = { x: 34, y: -62, w: 42, d: 38, r: 4 };

const ROOF = roofOfHouse(HOUSE, 45);
const ROOF2 = roofOfHouse(HOUSE2, 30);
const fitPoints = [...k.boxCorners(PLINTH, -10, 2), [ROOF.s0, ROOF.uR, ROOF.zR + 3], [ROOF.s1, ROOF.uR, ROOF.zR + 3], [-58, -54, 62]];
const P = a.fitInto(fitPoints, { x: 0, y: 0, w: W, h: H }, { pad: 6, azimuth: 40 });
$.setProjection(P);

// ---------- paddies ----------
// Paddies (water, a little below the bunds) in an L round the yard; bunds drawn after the water.
const PADDIES = [
  box(-64, 24, -18, 68), box(-14, 24, 30, 68), box(34, 24, 74, 68),
  box(34, -18, 74, 20),
];
const BUNDS = [
  box(-66, 20, 76, 24), box(30, -62, 34, 24), box(34, -24, 76, -18),
  box(-18, 24, -14, 70), box(30, 24, 34, 70), 
  box(-66, 68, 76, 70), box(74, -24, 76, 70), box(-66, 24, -64, 70),
];
function paddies() {
  const out = [];
  for (const p of PADDIES) out.push(water(slab(p, 0, 0.6, { tone: "lo", crease: "none" }, 2)));
  // Rows of seedlings: dotted lines running bund to bund (their ends go under the bunds).
  const rows = [];
  for (const p of PADDIES) {
    const alongX = p.w > p.d;
    if (alongX) for (let y = p.y + 2.5; y < p.y + p.d - 1; y += 3.4) rows.push(k.lineOnTop([p.x - 1, y], [p.x + p.w + 1, y], 0.6, P));
    else for (let x = p.x + 2.5; x < p.x + p.w - 1; x += 3.4) rows.push(k.lineOnTop([x, p.y - 1], [x, p.y + p.d + 1], 0.6, P));
  }
  out.push(sprout(L(rows.join(""), { tone: "mid", dotted: true })));
  const strokes = [];
  for (const [x0, x1, y] of [[-56, -36, 44], [-6, 14, 36], [40, 62, 54], [-50, -30, 62], [8, 24, 60], [44, 60, 2]]) strokes.push(k.fadeLineSvg([at([x0, y, 0.6]), at([x1, y, 0.6])], { fade: [4, 4], tone: "mid" }));
  out.push(a.amPulse(ripple(strokes.join("")), { period: 6000, min: 0.15 }));
  for (const b of byDepth(BUNDS, (b) => [b.x + b.w / 2, b.y + b.d / 2, 0])) out.push(moss(slab(b, 0, 1.6, { tone: "mid" }, 2, 0.3)));
  return out.join("");
}

function yard() {
  return [YARD, YARD2].map((Y) => moss(slab(Y, 0, YZ, { tone: "mid", inner: L(k.sideSeam(Y, YZ / 2, P, 4), { tone: "faint" }) }, 4, 0.4))).join("");
}

// ---------- cedars ----------
// A tall Japanese cedar: a trunk and four tiers of cones, turned on the lathe for smooth shade.
function cedar(x, y, h) {
  const out = [halo({ x: x - 7, y: y - 7, w: 14, d: 14, r: 7 }, YZ, 0.1, 3)];
  out.push(timber(cyl(x, y, 1.2, YZ, h * 0.3, { tone: "hi" }, 12)));
  const F = G.frameOf([x, y, YZ], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
  const tiers = [[0.22, 0.52, 7], [0.42, 0.7, 5.6], [0.6, 0.86, 4.2], [0.76, 1, 2.8]];
  for (const [s0, s1, r] of tiers) out.push(pine(count(S(G.solidOf([[h * s0, r], [h * s0 + 1, r * 0.92], [h * s1, 0.05]], F, P), { tone: "hi" }))));
  return out.join("");
}

// ---------- the gasshō-zukuri house ----------
function roofOfHouse(Hp, rise) {
  return { s0: Hp.x - 5, s1: Hp.x + Hp.w + 5, uA: Hp.y - 4, uR: Hp.y + Hp.d / 2, uB: Hp.y + Hp.d + 4, zE: YZ + 9, zR: YZ + 9 + rise, t: 4 };
}

function gassho(Hp, ROOF) {
  const out = [];
  const HX = Hp.x + Hp.w;
  const yf = Hp.y + Hp.d;
  const WALL_TOP = YZ + 12;
  out.push(halo(k.insetPlan(Hp, -6), YZ, 0.1, 5));
  // Stone footing and the ground-floor walls: a door, windows, posts along the long side.
  out.push(slab(k.insetPlan(Hp, -1), YZ, 1.2, { tone: "mid" }, 2, 0.3));
  const c = Hp.y + Hp.d / 2;
  const marks = [
    faceRect("x", HX, c - 4, c + 4, YZ + 1.2, YZ + 9.5), faceLine("x", HX, c, YZ + 1.2, c, YZ + 9.5),
    faceRect("x", HX, Hp.y + 4, Hp.y + 10, YZ + 4, YZ + 9), faceRect("x", HX, yf - 9, yf - 4, YZ + 4, YZ + 9),
  ];
  for (let u = Hp.x + 4; u < HX; u += 4) marks.push(faceLine("y", yf, u, YZ + 1.2, u, WALL_TOP));
  out.push(timber(slab(Hp, YZ + 1.2, WALL_TOP - YZ - 1.2, { tone: "mid", inner: L(marks.join(""), { tone: "lo" }) }, 2)));
  // The thatch: two boards a metre thick. The far one first (its underside shows through the
  // open gable), then the gable wall that closes it, then the far board's cut end again, the
  // near board last.
  const { t, uA, uR, uB, zE, zR, s0, s1 } = ROOF;
  const zOn = (u) => (u <= uR ? zE + ((u - uA) / (uR - uA)) * (zR - zE) : zR + ((u - uR) / (uB - uR)) * (zE - zR));
  const pt = (s, u) => [s, u, zOn(u)];
  const far = [[uA, zE], [uR, zR], [uR, zR - t], [uA, zE - t]];
  const near = [[uR, zR], [uB, zE], [uB, zE - t], [uR, zR - t]];
  const lines = [];
  for (let f = 0.18; f < 0.95; f += 0.19) { const u = uR + (uB - uR) * f; lines.push(pathOf([at(pt(s0, u)), at(pt(s1, u))])); }
  const layer = (sec) => [0.33, 0.66].map((f) => pathOf([at([s1, sec[0][0], sec[0][1] - t * f]), at([s1, sec[1][0], sec[1][1] - t * f])])).join("");
  out.push(thatch(count(S(polySolid(prismFaces(far, "x", s0, s1)), { tone: "hi" }))));
  const zTop = zR - t - 0.6;
  const tri = [[Hp.y, WALL_TOP], [uR, zTop], [yf, WALL_TOP]];
  const half = (z) => (Hp.d / 2) * (zTop - z) / (zTop - WALL_TOP);
  const span = zTop - WALL_TOP;
  const rows = [[0.06, 0.22], [0.32, 0.46], [0.56, 0.68]].map(([f0, f1]) => {
    const z0 = WALL_TOP + span * f0;
    const z1 = WALL_TOP + span * f1;
    const h = half(z1) - 1.2;
    return [z0, z1, uR - h, uR + h];
  });
  const gl = [];
  for (const [, z1] of rows) { const zz = z1 + 1.4; gl.push(faceLine("x", HX, uR - half(zz), zz, uR + half(zz), zz)); }
  gl.push(faceLine("x", HX, uR, WALL_TOP, uR, rows[0][0]));
  out.push(timber(count(S(polySolid(prismFaces(tri, "x", Hp.x, HX)), { tone: "mid", inner: L(gl.join(""), { tone: "lo" }) }))));
  // Shōji panels, set a hair proud of the gable, each with its muntins.
  for (const [z0, z1, u0, u1] of rows) {
    const n = Math.max(2, Math.round((u1 - u0) / 3));
    const ls = [];
    for (let i = 1; i < n; i++) { const u = u0 + ((u1 - u0) * i) / n; ls.push(faceLine("x", HX + 0.5, u, z0, u, z1)); }
    ls.push(faceLine("x", HX + 0.5, u0, (z0 + z1) / 2, u1, (z0 + z1) / 2));
    out.push(plaster(slab({ x: HX, y: u0, w: 0.5, d: u1 - u0, r: 0 }, z0, z1 - z0, { tone: "mid", inner: L(ls.join(""), { tone: "lo" }) }, 2)));
  }
  // A ground-floor eave board across the gable end.
  out.push(timber(count(S(polySolid(prismFaces([[HX, WALL_TOP + 0.6], [HX + 3.4, WALL_TOP - 0.8], [HX + 3.4, WALL_TOP - 1.4], [HX, WALL_TOP]], "y", Hp.y - 1, yf + 1)), { tone: "hi" }))));
  out.push(thatch(S(polySolid([{ pts: far.map(([u, z]) => [s1, u, z]), hint: [1, 0, 0] }]), { tone: "hi", inner: L(layer(far), { tone: "lo" }) })));
  out.push(thatch(count(S(polySolid(prismFaces(near, "x", s0, s1)), { tone: "hi", inner: L(layer(near), { tone: "lo" }) })) + L(lines.join(""), { tone: "lo" })));
  const cap = [[uR - 2.6, zR - 1.8], [uR + 2.6, zR - 1.8], [uR + 1.6, zR + 1.4], [uR - 1.6, zR + 1.4]];
  const binds = [];
  for (let sx = s0 + 4; sx < s1 - 2; sx += 6) binds.push(pathOf([at([sx, uR + 2.6, zR - 1.8]), at([sx, uR + 1.6, zR + 1.4]), at([sx, uR - 1.6, zR + 1.4])]));
  out.push(thatch(bar("x", s0 - 0.5, s1 + 0.5, cap, { inner: L(binds.join(""), { tone: "lo" }) })));
  return out.join("");
}

// A small thatched fire-hydrant hut (hōsui-gōya) at the yard's edge, with a hip of thatch.
function hut(x, y) {
  const out = [];
  const B = { x: x - 4, y: y - 3.5, w: 8, d: 7, r: 0 };
  out.push(halo(k.insetPlan(B, -3), YZ, 0.1, 2));
  const marks = [faceRect("x", B.x + B.w, y - 2.4, y + 2.4, YZ + 0.6, YZ + 6.4), faceLine("x", B.x + B.w, y, YZ + 0.6, y, YZ + 6.4)];
  out.push(timber(slab(B, YZ, 7, { tone: "mid", inner: L(marks.join(""), { tone: "lo" }) }, 2)));
  const spec = { s0: B.x - 1.6, s1: B.x + B.w + 1.6, uA: B.y - 2, uR: y, uB: B.y + B.d + 2, zE: YZ + 6.2, zR: YZ + 13, t: 1.6 };
  // A solid wedge of thatch (the hut's gable is boarded flush), with its ridge line.
  const sec = [[spec.uA, spec.zE], [spec.uR, spec.zR], [spec.uB, spec.zE], [spec.uB, spec.zE - spec.t], [spec.uA, spec.zE - spec.t]];
  out.push(thatch(bar("x", spec.s0, spec.s1, sec, { inner: L(pathOf([at([spec.s1, spec.uR, spec.zR]), at([spec.s1, spec.uR, spec.zE - spec.t])]), { tone: "lo" }) })));
  return out.join("");
}

// Stones edging the yard and a few by the house.
function stones() {
  const list = [[24, -44, 2.4, 2], [22, 8, 2.2, 1.8], [-42, 12, 2.6, 2.2], [4, 12, 2, 1.6]];
  return byDepth(list, (s) => [s[0], s[1], 0]).map(([x, y, r, h], i) => $.stone(x, y, r, h, YZ, i + 4)).join("");
}

// ---------- assemble ----------
const trees = byDepth([[-58, -56, 54], [-58, -24, 42], [22, -56, 40]], (t) => [t[0], t[1], 0]);
const body = minify([
  plinth(PLINTH),
  paddies(),
  yard(),
  cedar(...trees[0]),
  cedar(...trees[1]),
  cedar(...trees[2]),
  stones(),
  gassho(HOUSE2, ROOF2),
  gassho(HOUSE, ROOF),
  hut(-54, 8),
].join(""));

emit({
  day: 17,
  here: HERE,
  title: "Casa gasshō-zukuri de Shirakawa-go",
  subject: "Casa gasshō-zukuri de Shirakawa-go",
  label: "Shirakawa-go in isometric view: a gasshō-zukuri farmhouse with a steep thick thatch roof among cedars, with freshly planted rice paddies in front.",
  body,
  accentsFor,
});
