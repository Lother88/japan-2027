// Day 16 — Takayama, Sanmachi-suji: an Edo-era sake brewery on the old town street. A two-storey
// merchant house in dark timber with a kōshi lattice front, a low upper floor, a pent roof and a
// grey-tiled gable roof; a fresh green sugidama (cedar ball) hangs at the door over the noren, and
// straw-wrapped sake casks wait by the street. In front runs Sanmachi's stone-edged water channel,
// crossed by slab bridges; a lower neighbour house continues the row. The channel shimmers (CSS).
//
//   node build.mjs → day16-light/dark .svg/.html here, ../out/day16Iso.markup.ts

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
    timber: theme === "light" ? mix(s.brown, s.ink, 0.3) : mix(s.brown, s.paper, 0.22),
    tile: theme === "light" ? mix(s.ink, s.paper, 0.42) : mix(s.ink, s.paper, 0.6),
    cedar: s.green,
    noren: s.coral,
    straw: theme === "light" ? mix(s.gold, s.paper, 0.12) : s.gold,
    plaster: b.plaster,
    pine: b.pine,
  };
}
const water = ac("water");
const ripple = ac("ripple");
const timber = ac("timber");
const tile = ac("tile");
const cedar = ac("cedar");
const noren = ac("noren");
const plaster = ac("plaster");
const pine = ac("pine");
const straw = ac("straw");

// ---------- world ----------
const PLINTH = { x: -68, y: -64, w: 146, d: 136, r: 8 };
const BASE_Z = 1.5;
const FX = 34; // the main facade, facing the street (+x)
const MAIN = { x: -6, y: -24, w: FX + 6, d: 80, r: 0 };
const NEXT = { x: -2, y: -60, w: 32 + 2, d: 36, r: 0 };
const NX = NEXT.x + NEXT.w; // the neighbour's facade
const Z = { g: 22, w2: 35, ridge: 46 };
const ROOF = { s0: -24, s1: 61, uA: -12, uR: 14, uB: 40.5, zE: 35, zR: Z.ridge, t: 1.8 };
const NROOF = { s0: -63, s1: -24, uA: -7, uR: 15, uB: 37.5, zE: 24, zR: 31, t: 1.6 };
const CH = { x0: 38.5, x1: 45.5 };
const KURA = { x: -52, y: -14, w: 30, d: 40, r: 0 };
const SUGI = [FX + 6.6, 24.6, 11.4];
const SUGI_R = 4.2;

const fitPoints = [...k.boxCorners(PLINTH, -10, 2), [ROOF.uR, ROOF.s1, Z.ridge + 2], [ROOF.uR, ROOF.s0, Z.ridge + 2], [ROOF.uB, ROOF.s1, ROOF.zE]];
const P = a.fitInto(fitPoints, { x: 0, y: 0, w: W, h: H }, { pad: 6, azimuth: 40 });
$.setProjection(P);

// ---------- ground: plot, channel, street ----------
function ground() {
  const out = [];
  const plot = { x: -62, y: -62, w: 98, d: 131, r: 2 };
  out.push(slab(plot, 0, BASE_Z, { tone: "mid", inner: L(k.sideSeam(plot, 0.75, P, 2), { tone: "faint" }) }, 2, 0.4));
  // The street, paved, with joints running from the curb to its edge.
  const street = { x: 48, y: -60, w: 26, d: 128, r: 2 };
  const joints = [];
  for (let y = -50; y <= 60; y += 12) joints.push(k.lineOnTop([48, y], [74, y], 1.2, P));
  out.push(slab(street, 0, 1.2, { tone: "mid", inner: L(joints.join(""), { tone: "faint" }) }, 2, 0.4));
  // Water first, then the curbs that hold it.
  out.push(water(slab({ x: CH.x0, y: -62, w: CH.x1 - CH.x0, d: 128, r: 0 }, 0, 0.4, { tone: "lo", crease: "none" }, 2)));
  const strokes = [];
  for (const [x, y0, y1] of [[40.4, -50, -30], [43.2, -18, 4], [41, 12, 24], [43.6, 44, 62], [40.8, -60, -52]]) strokes.push(k.fadeLineSvg([at([x, y0, 0.4]), at([x, y1, 0.4])], { fade: [4, 4], tone: "mid" }));
  out.push(a.amPulse(ripple(strokes.join("")), { period: 5600, min: 0.2 }));
  out.push(slab({ x: 36, y: -62, w: CH.x0 - 36, d: 128, r: 0 }, 0, 1.9, { tone: "mid" }, 2, 0.3));
  out.push(slab({ x: CH.x1, y: -62, w: 48 - CH.x1, d: 128, r: 0 }, 0, 1.9, { tone: "mid" }, 2, 0.3));
  // Slab bridges to each door.
  for (const y of [-43.5, 31.5]) out.push(slab({ x: 35.6, y, w: 13, d: 7, r: 0 }, 1.9, 1, { tone: "mid" }, 2, 0.4));
  return out.join("");
}

// ---------- facade helpers ----------
// Vertical lattice lines on the plane x = c, from z0 to z1, between u0 and u1 every `step`.
function lattice(c, u0, u1, z0, z1, step) {
  const out = [];
  for (let u = u0 + step / 2; u < u1; u += step) out.push(faceLine("x", c, u, z0, u, z1));
  return out.join("");
}
function lattice2(c, u0, u1, z0, z1, step) {
  const out = [];
  for (let u = u0 + step / 2; u < u1; u += step) out.push(faceLine("y", c, u, z0, u, z1));
  return out.join("");
}
const post = (x, y, z0, z1, w = 2) => timber(slab({ x: x - w / 2, y: y - w / 2, w, d: w, r: 0 }, z0, z1 - z0, { tone: "hi" }, 2));
const beamY = (x, y0, y1, z, h, d = 1.8) => timber(slab({ x: x - d / 2, y: y0, w: d, d: y1 - y0, r: 0 }, z, h, { tone: "hi" }, 2));
const beamX = (y, x0, x1, z, h, d = 1.8) => timber(slab({ x: x0, y: y - d / 2, w: x1 - x0, d, r: 0 }, z, h, { tone: "hi" }, 2));

// A pent roof (hisashi): one thin sloping board along the facade, from the wall out to `out`.
function pent(x, y0, y1, zWall, reach, drop, t = 0.7) {
  const section = [[x, zWall + t], [x + reach, zWall - drop + t], [x + reach, zWall - drop], [x, zWall]];
  const lines = [];
  for (const f of [0.35, 0.7]) lines.push(pathOf([at([x + reach * f, y0, zWall - drop * f + t]), at([x + reach * f, y1, zWall - drop * f + t])]));
  return tile(count(S(polySolid(prismFaces(section, "y", y0, y1)), { tone: "hi", inner: L(lines.join(""), { tone: "lo" }) })));
}

function gableSvg(spec, axis, courses, boards) {
  const r = gableRoof({ axis, ...spec });
  const lines = [];
  for (const u of courses) lines.push(pathOf([at(r.pt(spec.s0, u)), at(r.pt(spec.s1, u))]));
  for (const s of boards) lines.push(pathOf([at(r.pt(s, spec.uR)), at(r.pt(s, spec.uB))]));
  return tile(count(S(r.paths, { tone: "hi" })) + L(lines.join(""), { tone: "faint" }));
}

// ---------- the storehouse (kura) behind: white plaster over a timber skirt ----------
function kura() {
  const out = [];
  const K = KURA;
  const xf = K.x + K.w;
  const yf = K.y + K.d;
  const zTop = 27;
  const marks = [faceRect("x", xf, -2, 6, 13, 21), faceLine("x", xf, 2, 13, 2, 21), faceRect("y", yf, -44, -36, 16, 22)].join("");
  out.push(halo(k.insetPlan(K, -3), BASE_Z, 0.1, 3));
  out.push(plaster(slab(K, BASE_Z, zTop - BASE_Z, { tone: "mid", inner: L(marks, { tone: "lo" }) }, 2)));
  // The timber skirt (koshi-ita), boarded.
  const boards = [];
  for (let u = K.y + 3; u < yf; u += 3) boards.push(faceLine("x", xf + 0.5, u, BASE_Z, u, 9));
  for (let u = K.x + 3; u < xf; u += 3) boards.push(faceLine("y", yf + 0.5, u, BASE_Z, u, 9));
  out.push(timber(slab(k.insetPlan(K, -0.5), BASE_Z, 9 - BASE_Z, { tone: "mid", inner: L(boards.join(""), { tone: "lo" }) }, 2)));
  // The shutter of its upper window, hinged open.
  out.push(timber(slab({ x: xf, y: 6.4, w: 0.8, d: 4.4, r: 0 }, 12.6, 8.8, { tone: "hi" }, 2)));
  const spec = { s0: K.y - 3, s1: yf + 3, uA: K.x - 3, uR: K.x + K.w / 2, uB: xf + 3, zE: zTop, zR: zTop + 9, t: 1.6 };
  const tri = [[K.x, zTop], [spec.uR, spec.zR - spec.t - 0.3], [xf, zTop]];
  out.push(plaster(count(S(polySolid(prismFaces(tri, "y", K.y, yf)), { tone: "mid" }))));
  out.push(gableSvg(spec, "y", [-43, -30, -24], []));
  out.push(tile(bar("y", spec.s0, spec.s1 + 0.6, [[spec.uR - 1.4, spec.zR - 0.6], [spec.uR + 1.4, spec.zR - 0.6], [spec.uR + 1, spec.zR + 1.2], [spec.uR - 1, spec.zR + 1.2]])));
  return out.join("");
}

// ---------- the neighbour house (behind, lower) ----------
function neighbour() {
  const out = [];
  const zTop = NROOF.zE;
  const panels = [
    lattice(NX, -58, -46, 3, 18.5, 1.6),
    faceRect("x", NX, -44, -36, BASE_Z, 17),
    lattice(NX, -34, -26, 3, 18.5, 1.6),
  ].join("");
  out.push(timber(slab(NEXT, BASE_Z, zTop - BASE_Z, { tone: "mid", inner: L(panels, { tone: "lo" }) }, 2)));
  for (const y of [-59, -46, -35, -25]) out.push(post(NX, y, BASE_Z, 19.4));
  out.push(beamY(NX, -60.5, -24, 18.4, 1.8));
  out.push(beamY(NX, -60.5, -24, BASE_Z, 1.6));
  // A short noren over its door.
  out.push(noren(slab({ x: NX, y: -43.6, w: 0.7, d: 7.2, r: 0 }, 11.5, 6.9, { tone: "hi" }, 2)));
  out.push(gableSvg(NROOF, "y", [-2, 6, 14, 21], []));
  return out.join("");
}

// ---------- the brewery ----------
function brewery() {
  const out = [];
  const yf = MAIN.y + MAIN.d; // the gable-end face (+y)
  // Walls: ground-floor lattice bays and the door; the low upper floor's slatted windows.
  const bays = [[-23, -4], [-4, 12], [12, 28], [44, 55]];
  const marks = [];
  for (const [u0, u1] of bays) marks.push(lattice(FX, u0 + 1, u1 - 1, 2.5, 20.6, 1.5));
  marks.push(faceRect("x", FX, 29.5, 42.5, 3.4, 20));
  for (const [u0, u1] of [[-19, -3], [5, 21], [27, 42], [46, 54]]) {
    marks.push(faceRect("x", FX, u0, u1, 26.5, 32));
    marks.push(lattice(FX, u0, u1, 26.5, 32, 1.4));
  }
  // The gable end: a plastered panel framed in timber, a small window up in the attic.
  marks.push(faceRect("y", yf, 0, 14, 6, 17));
  marks.push(faceLine("y", yf, 7, 6, 7, 17));
  marks.push(faceRect("y", yf, 16, 30, 26.5, 32));
  marks.push(lattice2(yf, 16, 30, 26.5, 32, 1.4));
  out.push(timber(slab(MAIN, BASE_Z, Z.w2 - BASE_Z, { tone: "mid", inner: L(marks.join(""), { tone: "lo" }) }, 2)));
  // Gable triangle above the eave line.
  const tri = [[MAIN.x, Z.w2], [ROOF.uR, Z.ridge - ROOF.t - 0.4], [FX, Z.w2]];
  const triMarks = [faceLine("y", yf + 0.01, ROOF.uR, Z.w2, ROOF.uR, Z.ridge - 2.4), faceRect("y", yf + 0.01, 10, 18, 36.5, 39.5)];
  out.push(timber(count(S(polySolid(prismFaces(tri, "y", MAIN.y, yf)), { tone: "mid", inner: L(triMarks.join(""), { tone: "lo" }) }))));
  // Posts and beams of the ground floor, the entrance bay, the floor beam.
  const posts = [[FX, -23], [FX, -4], [FX, 12], [FX, 28], [FX, 44], [FX, 55], [-5, yf], [15, yf]];
  for (const [x, y] of byDepth(posts, ([x, y]) => [x, y, 0])) out.push(post(x, y, BASE_Z, Z.g));
  out.push(beamY(FX, MAIN.y - 0.5, yf + 0.5, Z.g - 2, 2));
  out.push(beamX(yf, MAIN.x - 0.5, FX + 0.5, Z.g - 2, 2));
  out.push(beamY(FX, MAIN.y - 0.5, yf + 0.5, BASE_Z, 1.6));
  out.push(beamX(yf, MAIN.x - 0.5, FX + 0.5, BASE_Z, 1.6));
  // Upper floor: posts between the windows, a top plate.
  for (const [x, y] of byDepth([[FX, -23], [FX, 1], [FX, 24], [FX, 44], [FX, 55], [-5, yf], [15, yf]], ([x, y]) => [x, y, 0])) out.push(post(x, y, Z.g, Z.w2, 1.6));
  out.push(beamX(yf, MAIN.x - 0.5, FX + 0.5, Z.w2 - 1.6, 1.6, 1.4));
  out.push(beamY(FX, MAIN.y - 0.5, yf + 0.5, Z.w2 - 1.6, 1.6, 1.4));
  // The noren across the door: three panels hanging from the head beam.
  for (const [y0, y1] of [[30, 34.2], [34.6, 38.4], [38.8, 43]]) out.push(noren(slab({ x: FX + 0.2, y: y0, w: 0.6, d: y1 - y0, r: 0 }, 9.5, Z.g - 2 - 9.5, { tone: "hi" }, 2)));
  // The sugidama's cord goes up under the pent roof, so it is drawn first and the board covers its end.
  out.push(straw(L(pathOf([at([SUGI[0], SUGI[1], 22.2]), at([SUGI[0], SUGI[1], SUGI[2] + SUGI_R])]), { tone: "mid" })));
  out.push(pent(FX + 0.9, MAIN.y, yf + 1.5, 23.2, 5.6, 2.2));
  // The main roof with its ridge cap.
  out.push(gableSvg(ROOF, "y", [-4, 3, 21, 28, 35], [-12, 0, 12, 24, 36, 48]));
  const zr = Z.ridge;
  out.push(tile(bar("y", ROOF.s0, ROOF.s1 + 0.6, [[ROOF.uR - 1.6, zr - 0.7], [ROOF.uR + 1.6, zr - 0.7], [ROOF.uR + 1.2, zr + 1.3], [ROOF.uR - 1.2, zr + 1.3]])));
  return out.join("");
}

// The sugidama: a ball of cedar sprigs hanging from the pent roof's edge by the door.
function sugidama() {
  const c = SUGI;
  const r = SUGI_R;
  const out = [];
  out.push(cedar(count(S(G.sphereOf(c, r, P, { steps: 40 }), { tone: "hi" }))));
  // A few sprig tips on its face, rooted on the ball.
  const V = G.viewOf(P);
  const tips = [];
  for (let i = 0; i < 60; i++) {
    // Fibonacci sphere: an even speckle of sprig tips over the facing side.
    const zz = 1 - (2 * (i + 0.5)) / 60;
    const rr = Math.sqrt(1 - zz * zz);
    const th = i * 2.39996;
    const n = [Math.cos(th) * rr, Math.sin(th) * rr, zz];
    if (G.dot3(n, V) < 0.3) continue;
    tips.push(G.add3(c, G.mul3(n, r * 0.97)));
  }
  out.push(cedar(D(tips.map(at), { size: 0.22, tone: "mid" })));
  return out.join("");
}

// Straw-wrapped sake casks (komodaru) and a street bench.
function cask(x, y, z) {
  const r = 3.3;
  const h = 5.6;
  const bands = [k.sideArc(x, y, r, z + 1.2, P, 20), k.sideArc(x, y, r, z + h - 1.2, P, 20)].join("");
  return straw(count(S(k.cylinder(x, y, r, z, h, P, 20, 0.4), { tone: "hi", inner: L(bands, { tone: "mid" }) })) + L(k.ring(x, y, r * 0.62, z + h, P, 20), { tone: "mid" }));
}
function streetThings() {
  const out = [];
  const casks = [[54, 44], [54, 51.2], [61, 47.6]];
  out.push(halo({ x: 49, y: 39, w: 18, d: 18, r: 6 }, 1.2, 0.1, 2));
  for (const [x, y] of byDepth(casks, ([x, y]) => [x, y, 0])) out.push(cask(x, y, 1.2));
  out.push(cask(54, 47.6, 6.8));
  // A shōgi bench: a slatted top on four legs.
  const bx = 60;
  const by = -14;
  out.push(halo({ x: bx - 3, y: by - 9, w: 9, d: 22, r: 2 }, 1.2, 0.1, 2));
  for (const [x, y] of byDepth([[bx - 1.5, by - 6.5], [bx + 1.5, by - 6.5], [bx - 1.5, by + 6.5], [bx + 1.5, by + 6.5]], ([x, y]) => [x, y, 0])) out.push(timber(slab({ x: x - 0.5, y: y - 0.5, w: 1, d: 1, r: 0 }, 1.2, 4.2, { tone: "hi" }, 2)));
  const slats = [k.lineOnTop([bx - 0.8, by - 8], [bx - 0.8, by + 8], 6.4, P), k.lineOnTop([bx + 0.8, by - 8], [bx + 0.8, by + 8], 6.4, P)].join("");
  out.push(timber(slab({ x: bx - 2.4, y: by - 8, w: 4.8, d: 16, r: 0 }, 5.4, 1, { tone: "hi", inner: L(slats, { tone: "lo" }) }, 2, 0.3)));
  return out.join("");
}

// ---------- the yard: a pruned pine on its stones and a covered well ----------
function yard() {
  const out = [];
  const z = BASE_Z;
  // Well: a stone curb, two posts, a cross beam with its pulley, a small gabled cap.
  const [wx, wy] = [-40, 40];
  out.push(halo({ x: wx - 6, y: wy - 6, w: 12, d: 12, r: 6 }, z, 0.1, 2));
  out.push(cyl(wx, wy, 4.4, z, 4.4, { tone: "mid", inner: L(k.sideArc(wx, wy, 4.4, z + 2.2, P, 28), { tone: "faint" }) }, 28, 0.4));
  out.push(water(L(k.ring(wx, wy, 3.2, z + 4.4, P, 24), { tone: "mid" })));
  out.push(timber(slab({ x: wx - 0.6, y: wy - 5.4, w: 1.2, d: 1.2, r: 0 }, z, 13, { tone: "hi" }, 2)));
  out.push(timber(slab({ x: wx - 0.9, y: wy - 5.6, w: 1.8, d: 11.2, r: 0 }, z + 13, 1.2, { tone: "hi" }, 2)));
  out.push(timber(L(pathOf([at([wx, wy, z + 13]), at([wx, wy, z + 4.4])]), { tone: "hi" })));
  out.push(timber(cyl(wx, wy, 0.9, z + 11.6, 1.4, { tone: "hi" }, 12)));
  out.push(timber(slab({ x: wx - 0.6, y: wy + 4.2, w: 1.2, d: 1.2, r: 0 }, z, 13, { tone: "hi" }, 2)));
  const cap = { s0: wy - 7, s1: wy + 7, uA: wx - 4, uR: wx, uB: wx + 4, zE: z + 14.6, zR: z + 17, t: 0.8 };
  out.push(gableSvg(cap, "y", [], []));
  // Pine.
  const [x, y] = [-16, 62];
  out.push(halo({ x: x - 12, y: y - 12, w: 24, d: 24, r: 12 }, z, 0.1, 4));
  out.push($.stone(x - 9, y + 2, 3, 2.4, z, 3));
  const pads = [
    { c: [x + 7, y + 2, z + 8], r: 4.6 }, { c: [x - 5, y + 4, z + 11], r: 4.2 }, { c: [x - 2, y - 6, z + 14], r: 4.6 },
    { c: [x + 5, y - 3, z + 16.5], r: 3.8 }, { c: [x + 0.4, y, z + 20], r: 5.4 },
  ];
  const trunk = [[0, 0, 0], [1.2, 0.4, 5], [2.2, 0.8, 10], [1.4, 0.4, 15], [0.4, 0, 20]].map(([dx, dy, dz]) => [x + dx, y + dy, z + dz]);
  out.push(timber(L(pads.slice(0, 4).map((p) => { const f = trunk[Math.min(3, Math.round((p.c[2] - z) / 5))]; return k.segment([f[0], f[1], p.c[2] - 1.5], [p.c[0], p.c[1], p.c[2] + 0.6], P); }).join(""), { tone: "hi" })));
  const td = depth(trunk[2]);
  const sorted = byDepth(pads, (p) => p.c);
  for (const p of sorted) if (depth(p.c) < td && p !== pads[4]) out.push(pine($.pad(p.c[0], p.c[1], p.c[2], p.r)));
  for (let i = 0; i < trunk.length - 1; i++) out.push(timber(cyl(trunk[i][0], trunk[i][1], 1.3 - i * 0.15, trunk[i][2], trunk[i + 1][2] - trunk[i][2] + 0.3, { tone: "hi" }, 12)));
  for (const p of sorted) if (!(depth(p.c) < td && p !== pads[4])) out.push(pine($.pad(p.c[0], p.c[1], p.c[2], p.r)));
  out.push($.stone(x + 8, y + 3, 3, 2.6, z, 5));
  return out.join("");
}

// ---------- assemble ----------
const body = minify([
  plinth(PLINTH),
  ground(),
  kura(),
  yard(),
  neighbour(),
  brewery(),
  sugidama(),
  streetThings(),
].join(""));

emit({
  day: 16,
  here: HERE,
  title: "Destilería de sake de Sanmachi",
  subject: "Casa de sake de Sanmachi (Takayama)",
  label: "Takayama's Sanmachi old town in isometric view: a dark-timber sake brewery with a lattice front and a green cedar ball hanging at its door, beside a stone-edged water channel.",
  body,
  accentsFor,
});
