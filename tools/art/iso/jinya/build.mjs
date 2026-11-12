// Takayama Jinya (Sunday 16 May): the front gate of the Edo-period government office. A roofed
// yakuimon gate in dark timber, its two heavy leaves swung open inward, between long earthen
// walls (white plaster over a boarded skirt, tiled coping); behind them the great shingled roof of
// the main hall and its entrance porch, framed by the gate. On the plaza in front, the Jinya-mae
// morning market is setting out: a row of stalls under canvas awnings and a red parasol, crates of
// produce, pickle tubs and flowers, a dango grill breathing steam, a handcart, a few early buyers.
// Calm morning: the steam and the water in the stone gutter breathe (CSS only).
//
//   node build.mjs → jinya-light/dark .svg/.html here, ../out/jinyaIso.markup.ts
//   node build.mjs --sizes → the weight of each part

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as $ from "../lib-d15-19.mjs";

const { mix, k, a, G, W, H, WEIGHT, SITE, at, S, L, D, ac, depth, byDepth, pathOf, count, counter, slab, cyl, plinth, polySolid, prismFaces, gableRoof, bar, halo, faceLine, faceRect, minify } = $;
const HERE = dirname(fileURLToPath(import.meta.url));
const NAME = "jinya";

function accentsFor(theme) {
  const b = $.baseAccents(theme);
  const s = SITE[theme];
  return {
    water: b.water,
    ripple: b.ripple,
    timber: theme === "light" ? mix(s.brown, s.ink, 0.3) : mix(s.brown, s.paper, 0.22),
    tile: theme === "light" ? mix(s.ink, s.paper, 0.42) : mix(s.ink, s.paper, 0.6),
    shingle: theme === "light" ? mix(b.roof, s.paper, 0.3) : mix(s.brown, s.paper, 0.5),
    plaster: b.plaster,
    pine: b.pine,
    wood: b.wood,
    straw: theme === "light" ? mix(s.gold, s.paper, 0.12) : s.gold,
    red: s.coral,
    tomato: s.coral2,
    leaf: b.moss,
    indigo: theme === "light" ? mix(s.ink, s.paper, 0.18) : mix(mix(s.ink, s.paper, 0.45), "#3b5b9a", 0.35),
  };
}
const water = ac("water");
const ripple = ac("ripple");
const timber = ac("timber");
const tile = ac("tile");
const shingle = ac("shingle");
const plaster = ac("plaster");
const pine = ac("pine");
const wood = ac("wood");
const straw = ac("straw");
const red = ac("red");
const tomato = ac("tomato");
const leaf = ac("leaf");
const indigo = ac("indigo");

// ---------- world ----------
// The wall runs along y at x = WX and faces the plaza (+x). The gate opens between G0 and G1.
const PLINTH = { x: -66, y: -64, w: 118, d: 136, r: 8 };
const X1 = 48; // the plaza's front edge
const Y0 = -62;
const Y1 = 68;
const BASE_Z = 1.5;
const PZ = 1.2; // the plaza's paving
const WX = 16;
const WT = 1.3; // half the wall's thickness
const WALL_Z = 11; // top of the plastered wall body
const G0 = -9;
const G1 = 9;
const GM = 0;
const XR = WX - 9.5; // the gate's rear pillars
const GROOF = { s0: G0 - 6, s1: G1 + 6, uA: WX - 14.5, uR: WX - 4.2, uB: WX + 5.8, zE: 23, zR: 30.6, t: 1.4 };
const HALL = { x: -50, y: -38, w: 30, d: 76, r: 0 }; // x -50..-20
const HROOF = { s0: -42, s1: 42, uA: -53.5, uR: -35, uB: -16, zE: 13, zR: 26.5, t: 1.6 };
const PORCH = { x: -20, y: GM - 7, w: 11, d: 14, r: 0 }; // x -20..-9
const PROOF = { s0: -22, s1: -7, uA: GM - 9.5, uR: GM, uB: GM + 9.5, zE: 12.5, zR: 21, t: 1.4 };
const PX0 = WX + 5.5; // the plaza's paving starts past the gutter
const TOP = PZ + 5.4; // stall table tops

const fitPoints = [...k.boxCorners(PLINTH, -10, 2), [HROOF.uR, HROOF.s0, HROOF.zR + 2], [HROOF.uR, HROOF.s1, HROOF.zR + 2], [GROOF.uR, GROOF.s1, GROOF.zR + 2]];
const P = a.fitInto(fitPoints, { x: 0, y: 0, w: W, h: H }, { pad: 6, azimuth: 40 });
$.setProjection(P);
const SC = G.scaleOf(P);

// ---------- small helpers ----------
const sx = (x0, x1, y0, y1) => ({ x: x0, y: y0, w: x1 - x0, d: y1 - y0, r: 0 });
const post = (x, y, z0, z1, w = 2, paint = timber) => paint(slab({ x: x - w / 2, y: y - w / 2, w, d: w, r: 0 }, z0, z1 - z0, { tone: "hi" }, 2));
const beamY = (x, y0, y1, z, h, d = 1.8, paint = timber) => paint(slab({ x: x - d / 2, y: y0, w: d, d: y1 - y0, r: 0 }, z, h, { tone: "hi" }, 2));
const beamX = (y, x0, x1, z, h, d = 1.8, paint = timber) => paint(slab({ x: x0, y: y - d / 2, w: x1 - x0, d, r: 0 }, z, h, { tone: "hi" }, 2));
function lattice(face, c, u0, u1, z0, z1, step) {
  const out = [];
  for (let u = u0 + step / 2; u < u1; u += step) out.push(faceLine(face, c, u, z0, u, z1));
  return out.join("");
}
function gableSvg(spec, axis, courses, boards, paint = tile) {
  const r = gableRoof({ axis, ...spec });
  const lines = [];
  for (const u of courses) lines.push(pathOf([at(r.pt(spec.s0, u)), at(r.pt(spec.s1, u))]));
  for (const s of boards) lines.push(pathOf([at(r.pt(s, spec.uR)), at(r.pt(s, spec.uB))]));
  return paint(count(S(r.paths, { tone: "hi" })) + L(lines.join(""), { tone: "faint" }));
}
function ridgeCap(axis, s0, s1, u, z, w = 1.4, paint = tile) {
  return paint(bar(axis, s0, s1, [[u - w, z - 0.7], [u + w, z - 0.7], [u + w * 0.75, z + 1.2], [u - w * 0.75, z + 1.2]]));
}
const zF = (F0) => G.frameOf(F0, [0, 0, 1], [1, 0, 0], [0, 1, 0]);
const r1 = (v) => Math.round(v * 10) / 10;

// Small round things (fruit, dango, blooms) as light balls: a body, a shine toward the light and
// an outline, three circles each instead of a turned solid. Painted back to front.
function balls(points, r) {
  const rr = r * SC;
  const out = [];
  for (const c of byDepth(points)) {
    const [x, y] = at(c);
    out.push(`<circle class="tb-body" cx="${r1(x)}" cy="${r1(y)}" r="${r1(rr)}"/><circle class="tb-shine" cx="${r1(x - rr * 0.28)}" cy="${r1(y - rr * 0.32)}" r="${r1(rr * 0.5)}"/><circle class="iso-line" data-tone="hi" cx="${r1(x)}" cy="${r1(y)}" r="${r1(rr)}"/>`);
  }
  return out.join("");
}

// ---------- ground ----------
function ground() {
  const out = [];
  // The jinya's gravel court behind the wall.
  const court = sx(-60, WX - WT, Y0, Y1);
  out.push(slab(court, 0, BASE_Z, { tone: "mid", inner: L(k.sideSeam(court, 0.75, P, 2), { tone: "faint" }) }, 2, 0.4));
  // A stone path from the gate to the porch.
  for (let x = -7; x < XR - 2; x += 4.2) out.push(slab(sx(x, x + 3.2, GM - 3, GM + 3), BASE_Z, 0.4, { tone: "mid" }, 2));
  // The plaza: paving with joints from the gutter to the edge.
  const plaza = sx(PX0, X1, Y0, Y1);
  const joints = [];
  for (let y = -52; y <= 62; y += 12) joints.push(k.lineOnTop([PX0, y], [X1, y], PZ, P));
  for (let x = PX0 + 11.5; x < X1; x += 11.5) joints.push(k.lineOnTop([x, Y0], [x, Y1], PZ, P));
  out.push(slab(plaza, 0, PZ, { tone: "mid", inner: L(joints.join(""), { tone: "faint" }) }, 2, 0.4));
  // The stone gutter along the wall: water first, then its curbs, then the slab bridge at the gate.
  out.push(water(slab(sx(WX + 2, WX + 4.4, Y0, Y1), 0, 0.3, { tone: "lo", crease: "none" }, 2)));
  const strokes = [];
  for (const [x, y0, y1] of [[WX + 2.8, -50, -34], [WX + 3.4, 26, 42]]) strokes.push(k.fadeLineSvg([at([x, y0, 0.3]), at([x, y1, 0.3])], { fade: [3, 3], tone: "mid", stops: 3 }));
  out.push(a.amPulse(ripple(strokes.join("")), { period: 5600, min: 0.2 }));
  out.push(slab(sx(WX - WT, WX + 2, Y0, Y1), 0, BASE_Z, { tone: "mid" }, 2, 0.2));
  out.push(slab(sx(WX + 4.4, PX0, Y0, Y1), 0, PZ + 0.3, { tone: "mid" }, 2, 0.2));
  out.push(slab(sx(WX + 0.8, WX + 6.4, G0 + 1.5, G1 - 1.5), BASE_Z, 0.8, { tone: "mid", inner: L(k.lineOnTop([WX + 0.8, GM], [WX + 6.4, GM], BASE_Z + 0.8, P), { tone: "faint" }) }, 2, 0.3));
  return out.join("");
}

// ---------- the compound behind the wall ----------
function hall() {
  const out = [];
  const xf = HALL.x + HALL.w;
  const yf = HALL.y + HALL.d;
  out.push(halo(k.insetPlan(HALL, -3), BASE_Z, 0.1, 3));
  // A raised stone footing, then walls: timber frame with plaster panels and shōji bays.
  out.push(slab(k.insetPlan(HALL, -0.6), BASE_Z, 1.4, { tone: "mid" }, 2, 0.3));
  const marks = [];
  for (let u = HALL.y + 8; u < yf - 2; u += 8) marks.push(faceLine("x", xf, u, BASE_Z + 1.4, u, HROOF.zE));
  marks.push(faceLine("x", xf, HALL.y, 10.8, yf, 10.8));
  for (let u = HALL.x + 8; u < xf; u += 8) marks.push(faceLine("y", yf, u, BASE_Z + 1.4, u, HROOF.zE));
  marks.push(faceLine("y", yf, HALL.x, 10.8, xf, 10.8));
  for (const [u0, u1] of [[-46, -38], [-32, -24]]) { marks.push(faceRect("y", yf, u0, u1, 4.4, 10)); marks.push(lattice("y", yf, u0, u1, 4.4, 10, 1.6)); }
  out.push(plaster(slab(HALL, BASE_Z + 1.4, HROOF.zE - BASE_Z - 1.4, { tone: "mid", inner: L(marks.join(""), { tone: "lo" }) }, 2)));
  const tri = [[HALL.x, HROOF.zE], [HROOF.uR, HROOF.zR - HROOF.t - 0.4], [xf, HROOF.zE]];
  const triMarks = [faceLine("y", yf + 0.01, HROOF.uR, HROOF.zE, HROOF.uR, HROOF.zR - 2.6), faceLine("y", yf + 0.01, HALL.x + 4, 17, xf - 4, 17), faceRect("y", yf + 0.01, HROOF.uR - 3.5, HROOF.uR + 3.5, 20.5, 23.5)];
  out.push(plaster(count(S(polySolid(prismFaces(tri, "y", HALL.y, yf)), { tone: "mid", inner: L(triMarks.join(""), { tone: "lo" }) }))));
  // The great shingle roof: courses along the slope, board lines down it, a ridge.
  const courses = [];
  for (let f = 0.16; f < 0.95; f += 0.14) courses.push(HROOF.uR + (HROOF.uB - HROOF.uR) * f);
  out.push(gableSvg(HROOF, "y", courses, [-30, -18, -6, 6, 18, 30], shingle));
  out.push(ridgeCap("y", HROOF.s0 - 0.6, HROOF.s1 + 0.6, HROOF.uR, HROOF.zR, 1.7, shingle));
  return out.join("");
}

function porch() {
  const out = [];
  const xf = PORCH.x + PORCH.w;
  out.push(slab(k.insetPlan(PORCH, -0.8), BASE_Z, 1.6, { tone: "mid" }, 2, 0.3));
  const marks = [faceRect("x", xf, GM - 4.5, GM + 4.5, BASE_Z + 1.6, 10), lattice("x", xf, GM - 4.5, GM + 4.5, BASE_Z + 1.6, 10, 1.5), faceLine("x", xf, GM - 4.5, 7.8, GM + 4.5, 7.8)];
  out.push(plaster(slab(PORCH, BASE_Z + 1.6, PROOF.zE - BASE_Z - 1.6, { tone: "mid", inner: L(marks.join(""), { tone: "lo" }) }, 2)));
  for (const y of [PORCH.y + 0.6, PORCH.y + PORCH.d - 0.6]) out.push(post(xf, y, BASE_Z + 1.6, PROOF.zE, 1.3));
  out.push(beamY(xf, PORCH.y - 0.4, PORCH.y + PORCH.d + 0.4, PROOF.zE - 1.6, 1.6, 1.4));
  // A white curtain (maku) with a dark band hangs across the porch head.
  out.push(plaster(slab(sx(xf + 0.2, xf + 0.7, PORCH.y + 1.2, PORCH.y + PORCH.d - 1.2), PROOF.zE - 4.2, 2.6, { tone: "hi", inner: L(faceLine("x", xf + 0.7, PORCH.y + 1.2, PROOF.zE - 2.6, PORCH.y + PORCH.d - 1.2, PROOF.zE - 2.6), { tone: "hi" }) }, 2)));
  // Its gable faces the gate: plaster triangle with a timber king post and tie.
  const tri = [[PORCH.y, PROOF.zE], [GM, PROOF.zR - PROOF.t - 0.3], [PORCH.y + PORCH.d, PROOF.zE]];
  const tm = [faceLine("x", xf + 0.01, GM, PROOF.zE, GM, PROOF.zR - 2.2), faceLine("x", xf + 0.01, PORCH.y + 2.4, PROOF.zE + 2.4, PORCH.y + PORCH.d - 2.4, PROOF.zE + 2.4)];
  out.push(plaster(count(S(polySolid(prismFaces(tri, "x", PORCH.x, xf)), { tone: "mid", inner: L(tm.join(""), { tone: "lo" }) }))));
  out.push(gableSvg(PROOF, "x", [GM + 3.2, GM + 6.4], [], shingle));
  out.push(ridgeCap("x", PROOF.s0, PROOF.s1 + 0.6, GM, PROOF.zR, 1.2, shingle));
  return out.join("");
}

// A tall Hida cedar in the court, its tiers showing over the wall (day 17's recipe).
function courtCedar(x, y, h) {
  const out = [halo({ x: x - 7, y: y - 7, w: 14, d: 14, r: 7 }, BASE_Z, 0.1, 3)];
  out.push(timber(cyl(x, y, 1.1, BASE_Z, h * 0.32, { tone: "hi" }, 10)));
  const F = G.frameOf([x, y, BASE_Z], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
  const tiers = [[0.24, 0.54, 6.4], [0.44, 0.72, 5.1], [0.62, 0.88, 3.8], [0.78, 1, 2.6]];
  for (const [s0, s1, r] of tiers) out.push(pine(count(S(G.solidOf([[h * s0, r], [h * s0 + 1, r * 0.92], [h * s1, 0.05]], F, P), { tone: "hi" }))));
  return out.join("");
}

// ---------- the earthen wall (dobei) ----------
function wallSegment(y0, y1) {
  const out = [];
  const plan = sx(WX - WT, WX + WT, y0, y1);
  const xf = WX + WT;
  // Plaster body with a timber band; the boarded skirt in front of it.
  const marks = [faceLine("x", xf, y0, 9, y1, 9), faceLine("y", y1, WX - WT, 9, xf, 9)];
  for (let u = Math.ceil(y0 / 12) * 12; u < y1 - 2; u += 12) marks.push(faceLine("x", xf, u, 5, u, 9));
  out.push(plaster(slab(plan, BASE_Z, WALL_Z - BASE_Z, { tone: "mid", inner: L(marks.join(""), { tone: "lo" }) }, 2)));
  const boards = [];
  for (let u = y0 + 3; u < y1 - 0.5; u += 3) boards.push(faceLine("x", xf + 0.4, u, BASE_Z, u, 4.4));
  boards.push(faceLine("y", y1 + 0.4, WX, BASE_Z, WX, 4.4));
  out.push(timber(slab(k.insetPlan(plan, -0.4), BASE_Z, 4.4 - BASE_Z, { tone: "mid", inner: L(boards.join(""), { tone: "lo" }) }, 2)));
  out.push(timber(slab(k.insetPlan(plan, -0.5), 4.4, 0.6, { tone: "hi" }, 2)));
  // Tiled coping: a small gable with its ridge.
  const spec = { s0: y0 - 0.6, s1: y1 + 0.6, uA: WX - WT - 2.2, uR: WX, uB: WX + WT + 2.2, zE: WALL_Z + 0.4, zR: WALL_Z + 2.6, t: 0.9 };
  const tc = [];
  for (let s = Math.ceil(spec.s0 / 3) * 3; s < spec.s1; s += 3) tc.push(s);
  out.push(gableSvg(spec, "y", [], tc));
  out.push(ridgeCap("y", spec.s0, spec.s1 + 0.4, WX, WALL_Z + 2.6, 0.9));
  return out.join("");
}

// ---------- the gate (omotemon, a yakuimon) ----------
// Main pillars stand in the wall line; rear pillars carry the back of the roof. The leaves are
// swung open inward against the sides of the gate.
// Only the far leaf shows its face (planks and iron studs); the near one's face is against its pillar.
function doorLeaf(y, face = true) {
  const plan = sx(XR - 0.4, WX - 1.4, y, y + 1);
  if (!face) return timber(slab(plan, BASE_Z + 0.4, 15 - BASE_Z - 0.4, { tone: "mid" }, 2));
  const planks = [];
  for (let u = XR + 1.2; u < WX - 2; u += 1.6) planks.push(faceLine("y", y + 1, u, BASE_Z + 0.4, u, 15));
  planks.push(faceLine("y", y + 1, XR - 0.4, 4.4, WX - 1.4, 4.4), faceLine("y", y + 1, XR - 0.4, 11.4, WX - 1.4, 11.4));
  const studs = [];
  for (let u = XR + 1.2; u < WX - 2; u += 1.6) for (const z of [4.4, 11.4]) studs.push(at([u, y + 1, z]));
  return timber(slab(plan, BASE_Z + 0.4, 15 - BASE_Z - 0.4, { tone: "mid", inner: L(planks.join(""), { tone: "lo" }) }, 2)) + D(studs, { size: 0.3, tone: "hi" });
}
function gateBack() {
  const out = [];
  out.push(halo(sx(XR - 4, WX + 3, G0 - 3, G1 + 3), BASE_Z, 0.1, 2));
  for (const y of [G0, G1]) out.push(slab(sx(XR - 1.4, XR + 1.4, y - 1.4, y + 1.4), BASE_Z, 0.8, { tone: "mid" }, 2, 0.2));
  out.push(post(XR, G0, BASE_Z + 0.8, 21.4, 1.8));
  out.push(doorLeaf(G0 + 1.6));
  out.push(post(XR, G1, BASE_Z + 0.8, 21.4, 1.8));
  out.push(doorLeaf(G1 - 2.6, false));
  return out.join("");
}
function gateFront() {
  const out = [];
  // Base stones and the two main pillars, a threshold between them.
  for (const y of [G0, G1]) out.push(slab(sx(WX - 2, WX + 2, y - 2, y + 2), BASE_Z, 0.8, { tone: "mid" }, 2, 0.2));
  out.push(timber(slab(sx(WX - 0.8, WX + 0.8, G0 + 1.4, G1 - 1.4), BASE_Z, 1, { tone: "hi" }, 2)));
  out.push(post(WX, G0, BASE_Z + 0.8, 21.4, 2.8));
  // Tie beams from the main to the rear pillars, the head beam across the opening, a top plate.
  for (const y of [G0, G1]) out.push(beamX(y, XR - 1, WX + 1.4, 19.4, 1.6, 1.4));
  out.push(post(WX, G1, BASE_Z + 0.8, 21.4, 2.8));
  out.push(beamY(WX, G0 - 3, G1 + 3, 16.2, 2.6, 2.2));
  out.push(beamY(WX, G0 - 2, G1 + 2, 21.4, 0.8, 2.6));
  // Bracket blocks on the top plate, carrying the roof.
  for (const y of [G0, GM, G1]) out.push(timber(slab(sx(WX - 1, WX + 1, y - 1, y + 1), 22.2, 0.9, { tone: "hi" }, 2)));
  return out.join("");
}
function gateRoof() {
  const out = [];
  const r = GROOF;
  const rr = gableRoof({ axis: "y", ...r });
  // Round-tile rows down the slope, a course line near the eave.
  const rows = [];
  for (let s = r.s0 + 1.6; s < r.s1; s += 1.6) rows.push(pathOf([at(rr.pt(s, r.uR + 0.8)), at(rr.pt(s, r.uB))]));
  rows.push(pathOf([at(rr.pt(r.s0, r.uB - 1.2)), at(rr.pt(r.s1, r.uB - 1.2))]));
  out.push(tile(count(S(rr.paths, { tone: "hi", inner: L(rows.join(""), { tone: "lo" }) }))));
  out.push(ridgeCap("y", r.s0 - 0.6, r.s1 + 0.6, r.uR, r.zR, 1.6));
  // Onigawara at both ends of the ridge.
  for (const s of [r.s0 - 1.2, r.s1 + 0.6]) out.push(tile(slab(sx(r.uR - 1.8, r.uR + 1.8, s, s + 0.6), r.zR - 0.6, 3.4, { tone: "hi" }, 2)));
  return out.join("");
}

// A signboard on its post by the gate (no lettering, just the board and its cap).
function signboard(x, y) {
  const out = [];
  out.push(halo(sx(x - 1.6, x + 1.6, y - 1.6, y + 1.6), PZ, 0.1, 1));
  out.push(timber(slab(sx(x - 0.5, x + 0.5, y - 0.5, y + 0.5), PZ, 5, { tone: "hi" }, 2)));
  out.push(wood(slab(sx(x - 0.4, x + 0.4, y - 1.8, y + 1.8), PZ + 5, 9.4, { tone: "hi", inner: L(faceLine("x", x + 0.4, y, PZ + 6, y, PZ + 13.6), { tone: "faint" }) }, 2)));
  out.push(timber(slab(sx(x - 0.9, x + 0.9, y - 2.3, y + 2.3), PZ + 14.4, 0.7, { tone: "hi" }, 2)));
  return out.join("");
}

// ---------- the morning market ----------
function fruitCrate(x0, y0, w, d, z, paint, r = 0.75, cols, rows) {
  const plan = sx(x0, x0 + w, y0, y0 + d);
  const out = [wood(slab(plan, z, 1, { tone: "hi", inner: L(k.sideSeam(plan, z + 0.5, P, 2), { tone: "lo" }) }, 2))];
  const pts = [];
  const nc = cols ?? Math.max(1, Math.floor(w / (r * 2.1)));
  const nr = rows ?? Math.max(1, Math.floor(d / (r * 2.1)));
  for (let i = 0; i < nc; i++) for (let j = 0; j < nr; j++) pts.push([x0 + (i + 0.5) * (w / nc), y0 + (j + 0.5) * (d / nr), z + 1 + r * 0.55]);
  out.push(paint(balls(pts, r)));
  return out.join("");
}
// Daikon lying in a bundle along y, leafy tops toward the back: hexagonal prisms, cheap and crisp.
function bundle(x0, y0, len, z, n, paint, r = 0.55) {
  const out = [];
  const items = [];
  for (let i = 0; i < n; i++) items.push(x0 + i * r * 2);
  const hex = (cx, cz, rr) => Array.from({ length: 6 }, (_, i) => [cx + Math.cos((i / 6) * Math.PI * 2) * rr, cz + Math.sin((i / 6) * Math.PI * 2) * rr]);
  for (const x of byDepth(items, (x) => [x, y0, z])) {
    out.push(leaf(bar("y", y0 - 2, y0, hex(x, z + r, r * 0.6))));
    out.push(paint(bar("y", y0, y0 + len, hex(x, z + r, r))));
  }
  return out.join("");
}
// A pickle tub (tsukemono-oke): staves, two hoops, the pickles under a lid of leaves.
function tub(x, y, z, r, h, top = leaf) {
  const hoops = [k.sideArc(x, y, r, z + h * 0.25, P, 12), k.sideArc(x, y, r, z + h * 0.75, P, 12)].join("");
  return wood(cyl(x, y, r, z, h, { tone: "hi", inner: L(hoops, { tone: "lo" }) }, 12)) + top(cyl(x, y, r - 0.35, z + h - 0.3, 0.5, { tone: "hi" }, 10));
}
// A bucket of cut flowers: a tin pail, a mass of stems and leaves, a crown of blooms.
function flowers(x, y, z, paint) {
  const out = [tile(cyl(x, y, 1.1, z, 2.2, { tone: "hi", inner: L(k.sideArc(x, y, 1.1, z + 1.6, P, 10), { tone: "lo" }) }, 10))];
  out.push(leaf(cyl(x, y, 0.95, z + 2.2, 1.2, { tone: "hi" }, 10)));
  const blooms = [];
  for (let i = 0; i < 6; i++) { const t = i * 2.4; const m = i % 2 ? 0.75 : 0.35; blooms.push([x + Math.cos(t) * m, y + Math.sin(t) * m, z + 3.8 + (i % 3) * 0.3]); }
  out.push(paint(balls(blooms, 0.5)));
  return out.join("");
}

// A stall table: trestle top on legs, a cloth hanging over its front.
function table(x0, x1, y0, y1, cloth) {
  const out = [halo(sx(x0 - 1, x1 + 1, y0 - 1, y1 + 1), PZ, 0.1, 2)];
  for (const [x, y] of byDepth([[x0 + 0.6, y1 - 0.6], [x1 - 0.8, y1 - 0.6]], ([x, y]) => [x, y, 0])) out.push(wood(slab(sx(x - 0.4, x + 0.4, y - 0.4, y + 0.4), PZ, 4.6, { tone: "hi" }, 2)));
  out.push(cloth(slab(sx(x1 - 0.3, x1 + 0.2, y0 - 0.2, y1 + 0.2), PZ + 1.4, 4, { tone: "hi", inner: L(faceLine("x", x1 + 0.2, y0, PZ + 2.4, y1, PZ + 2.4), { tone: "mid" }) }, 2)));
  out.push(wood(slab(sx(x0, x1 + 0.2, y0 - 0.2, y1 + 0.2), PZ + 4.6, 0.8, { tone: "hi" }, 2)));
  return out.join("");
}

// A canvas awning on four poles, sloping toward the plaza, with a scalloped valance.
const AW_B = 14.4;
const AW_F = 13;
function awning(x0, x1, y0, y1, paint, { stripes = false } = {}) {
  const t = 0.4;
  const section = [[x0 - 1, AW_B + t], [x1 + 1.4, AW_F + t], [x1 + 1.4, AW_F], [x0 - 1, AW_B]];
  const lines = [];
  if (stripes) for (let y = y0 + 1.6; y < y1 - 0.4; y += 3.2) lines.push(pathOf([at([x0 - 1, y, AW_B + t]), at([x1 + 1.4, y, AW_F + t])]));
  const canvas = paint(count(S(polySolid(prismFaces(section, "y", y0 - 1, y1 + 1)), { tone: "hi", inner: L(lines.join(""), { tone: "lo" }) })));
  // The valance: a strip hanging from the front edge, its hem cut in scallops.
  const xv = x1 + 1.4;
  const n = Math.round((y1 - y0 + 2) / 2.6);
  const st = (y1 - y0 + 2) / n;
  const hem = [];
  for (let i = 0; i <= n * 4; i++) { const u = y0 - 1 + (i / 4) * st; hem.push([u, AW_F - 1.3 - 0.5 * Math.sin(((i % 4) / 4) * Math.PI)]); }
  const face = [[y0 - 1, AW_F + t], [y1 + 1, AW_F + t], ...hem.reverse()];
  const valance = paint(count(S(polySolid(prismFaces(face, "x", xv, xv + 0.25)), { tone: "hi" })));
  return canvas + valance;
}
function poles(x0, x1, y0, y1, which) {
  const out = [];
  const pts = which === "back" ? [[x0 - 0.6, y0 - 0.6], [x0 - 0.6, y1 + 0.6]] : [[x1 + 1, y0 - 0.6], [x1 + 1, y1 + 0.6]];
  const ztop = which === "back" ? AW_B : AW_F;
  for (const [x, y] of byDepth(pts, ([x, y]) => [x, y, 0])) {
    out.push(timber(slab(sx(x - 0.3, x + 0.3, y - 0.3, y + 0.3), PZ, ztop - PZ, { tone: "hi" }, 2)));
  }
  return out.join("");
}

// A large red parasol (nodate-gasa): pole, a ribbed shallow cone, a small cap.
function parasolPole(x, y, z0, h) {
  return halo(sx(x - 0.8, x + 0.8, y - 0.8, y + 0.8), z0, 0.1, 1) + timber(slab(sx(x - 0.3, x + 0.3, y - 0.3, y + 0.3), z0, h - z0 + 0.4, { tone: "hi" }, 2));
}
function parasol(x, y, R, h) {
  const out = [];
  const F = zF([x, y, h]);
  const cone = G.lathe([[0, 0], [0, R], [0.3, R], [3.4, 0.6], [3.4, 0]], F, P, { steps: 24, smooth: false });
  const ribs = [];
  const V = G.viewOf(P);
  for (let i = 0; i < 16; i++) {
    const t = (i / 16) * Math.PI * 2;
    const dir = [Math.cos(t), Math.sin(t), 0];
    // only the ribs on the near half of the cone face the viewer
    if (G.dot3(dir, V) < 0.02) continue;
    ribs.push(pathOf([at([x + dir[0] * R, y + dir[1] * R, h + 0.3]), at([x + dir[0] * 0.6, y + dir[1] * 0.6, h + 3.4])]));
  }
  out.push(red(count(S(cone, { tone: "hi", inner: L(ribs.join(""), { tone: "lo" }) }))));
  out.push(red(count(S(G.lathe([[3.3, 0], [3.3, 0.8], [4.1, 0.2], [4.1, 0]], F, P, { steps: 12, smooth: false }), { tone: "hi" }))));
  return out.join("");
}

// A dango grill: a small charcoal brazier, skewers of rice dumplings across it.
function grill(x, y, z) {
  const out = [];
  const box = sx(x - 2, x + 2, y - 3, y + 3);
  out.push(timber(slab(box, z, 2.2, { tone: "hi", inner: L(k.sideSeam(box, z + 1.1, P, 2), { tone: "lo" }) }, 2, 0.2)));
  out.push(tile(slab(sx(x - 1.5, x + 1.5, y - 2.5, y + 2.5), z + 2.2, 0.3, { tone: "lo", crease: "none" }, 2)));
  const coals = [];
  for (let i = 0; i < 9; i++) coals.push(at([x - 1 + (i % 3), y - 2 + Math.floor(i / 3) * 2, z + 2.5]));
  out.push(tomato(D(coals, { size: 0.35, tone: "mid" })));
  for (let i = 0; i < 3; i++) {
    const yy = y - 1.5 + i * 1.5;
    out.push(wood(L(k.segment([x - 2.8, yy, z + 2.9], [x + 2.6, yy, z + 2.9], P), { tone: "hi" })));
    const bs = [];
    for (let j = 0; j < 3; j++) bs.push([x - 0.9 + j * 0.9, yy, z + 2.9]);
    out.push(straw(balls(bs, 0.42)));
  }
  return out.join("");
}
function steamWisps(x, y, z) {
  const strokes = [];
  for (const [dx, dy, ph] of [[-0.6, -1, 0], [0.3, 1.2, 1.8]]) {
    const pts = [];
    for (let i = 0; i <= 6; i++) { const t = i / 6; pts.push(at([x + dx + Math.sin(t * 5 + ph) * 0.7, y + dy + Math.cos(t * 4 + ph) * 0.4, z + 1 + t * 9])); }
    strokes.push(k.fadeLineSvg(pts, { fade: [2, 6], tone: "mid", stops: 3 }));
  }
  return a.amPulse(strokes.join(""), { period: 4800, min: 0.15 });
}

// A person: legs, a coat with its sash, a head, optional hat, headscarf or basket on the arm.
function person(x, y, z0, { coat = indigo, legs = tile, hat = null, scarf = null, basket = 0 } = {}) {
  const out = [halo(sx(x - 1.4, x + 1.4, y - 1.4, y + 1.4), z0, 0.1, 1)];
  out.push(legs(slab(sx(x - 0.4, x + 0.4, y - 0.8, y + 0.8), z0, 2.6, { tone: "hi", inner: L(faceLine("x", x + 0.4, y, z0 + 0.2, y, z0 + 2.6), { tone: "lo" }) }, 2)));
  out.push(coat(cyl(x, y, 1.15, z0 + 2.4, 3.6, { tone: "hi", inner: L(k.sideArc(x, y, 1.15, z0 + 3.6, P, 8), { tone: "lo" }) }, 8)));
  out.push(plaster(count(S(G.sphereOf([x, y, z0 + 6.75], 0.85, P, { steps: 10 }), { tone: "hi" }))));
  if (scarf) out.push(scarf(cyl(x, y, 0.92, z0 + 6.85, 0.75, { tone: "hi" }, 8)));
  if (hat) out.push(hat(count(S(G.lathe([[0, 0], [0, 2], [0.2, 2], [1.2, 0.3], [1.2, 0]], zF([x, y, z0 + 7.2]), P, { steps: 14, smooth: false }), { tone: "hi" }))));
  if (basket) {
    const [bx, by] = [x + 0.3, y + basket * 1.7];
    out.push(straw(cyl(bx, by, 0.95, z0 + 2.6, 1.5, { tone: "hi", inner: L(k.sideArc(bx, by, 0.95, z0 + 3.3, P, 10), { tone: "lo" }) }, 10, 0.2)));
    out.push(leaf(balls([[bx - 0.3, by, z0 + 4.3], [bx + 0.3, by + 0.3, z0 + 4.4]], 0.45)));
    out.push(straw(L(pathOf([at([bx, by - 0.8, z0 + 4.1]), at([bx, by, z0 + 5.4]), at([bx, by + 0.8, z0 + 4.1])]), { tone: "hi" })));
  }
  return out.join("");
}

// A two-wheeled handcart (daihachi-guruma): wheels either side of an axle along x, a slatted bed
// with crates and a sack, two shafts running forward (+y) to a crossbar propped on a stand.
function handcart(x, y) {
  const out = [];
  const z = PZ;
  const R = 2.6;
  out.push(halo(sx(x - 5, x + 5, y - 4, y + 10), z, 0.1, 2));
  const spokes = (wx) => L([0, 1, 2, 3].map((i) => { const t = (i * Math.PI) / 4; return k.segment([wx + 0.36, y + Math.cos(t) * 2.2, z + R + Math.sin(t) * 2.2], [wx + 0.36, y - Math.cos(t) * 2.2, z + R - Math.sin(t) * 2.2], P); }).join(""), { tone: "lo" });
  const wheel = (wx) => timber(count(S(G.disc(-0.35, 0.35, R, G.frameOf([wx, y, z + R], [1, 0, 0], [0, 1, 0], [0, 0, 1]), P, { steps: 16 }), { tone: "hi", inner: spokes(wx) })));
  out.push(wheel(x - 4.2));
  out.push(timber(slab(sx(x - 3.9, x + 3.9, y - 0.5, y + 0.5), z + R - 0.5, 1, { tone: "hi" }, 2)));
  // Shafts, their crossbar and the stand it rests on.
  out.push(wood(slab(sx(x - 0.4, x + 0.4, y + 7.6, y + 8.4), z, 3.4, { tone: "hi" }, 2)));
  for (const dx of [-2.8, 2.2]) out.push(wood(slab(sx(x + dx, x + dx + 0.6, y - 3.4, y + 9.4), z + 3.4, 0.6, { tone: "hi" }, 2)));
  out.push(wood(slab(sx(x - 3, x + 3, y + 8.6, y + 9.2), z + 4, 0.5, { tone: "hi" }, 2)));
  const bedLines = [k.lineOnTop([x - 1.1, y - 3.4], [x - 1.1, y + 3.4], z + 5.1, P), k.lineOnTop([x + 1.1, y - 3.4], [x + 1.1, y + 3.4], z + 5.1, P)].join("");
  out.push(wood(slab(sx(x - 3.4, x + 3.4, y - 3.4, y + 3.4), z + 4, 1.1, { tone: "hi", inner: L(bedLines, { tone: "lo" }) }, 2)));
  out.push(fruitCrate(x - 3, y - 3, 3, 4, z + 5.1, straw, 0.7, 2, 3));
  out.push(straw(count(S(G.sphereOf([x - 1.4, y + 2.2, z + 6.4], 1.3, P, { steps: 10 }), { tone: "hi" }))));
  out.push(fruitCrate(x + 0.4, y - 3, 3, 4, z + 5.1, leaf, 0.75, 2, 2));
  out.push(wheel(x + 4.2));
  return out.join("");
}

// ---------- stalls (the row along the wall; vendors stand between the gutter and the tables) ----------
const SX0 = WX + 11;
const VX = WX + 8.2;
// The awnings cover only the back half of the tables, so the produce in front shows.
function stallVeg(y0, y1) {
  // Under a white awning: red turnips, cabbages, white turnips, yuzu.
  const x0 = SX0;
  const x1 = SX0 + 10;
  const xa = x0 + 4.6;
  const out = [poles(x0, xa, y0, y1, "back")];
  out.push(table(x0, x1, y0, y1, indigo));
  out.push(fruitCrate(x0 + 0.6, y0 + 0.8, 4.2, 5.4, TOP, plaster, 0.8, 2, 3)); // white turnips
  out.push(fruitCrate(x0 + 0.6, y0 + 8.6, 4.2, 4.2, TOP, straw, 0.7));
  out.push(fruitCrate(x0 + 5.4, y0 + 0.8, 4.2, 5.4, TOP, leaf, 1.0, 2, 2));
  out.push(fruitCrate(x0 + 5.4, y0 + 6.8, 4.2, 5.4, TOP, tomato, 0.7));
  out.push(fruitCrate(x0 + 5.4, y1 - 4.8, 4.2, 4.2, TOP, straw, 0.7));
  out.push(poles(x0, xa, y0, y1, "front"));
  out.push(awning(x0, xa, y0, y1, plaster));
  return out.join("");
}
function stallPickles(y0, y1) {
  // Pickles and flowers under a striped straw-coloured awning.
  const x0 = SX0;
  const x1 = SX0 + 10;
  const xa = x0 + 4.6;
  const out = [poles(x0, xa, y0, y1, "back")];
  out.push(table(x0, x1, y0, y1, red));
  out.push(flowers(x0 + 2.4, y1 - 3, TOP, red));
  const tubs = [[x0 + 7.2, y0 + 3, 2, 2.4, leaf], [x0 + 7.2, y0 + 8, 1.8, 2.2, tomato], [x0 + 7.4, y1 - 3, 1.7, 2, straw]];
  for (const [x, y, r, h, top] of byDepth(tubs, ([x, y]) => [x, y, 0])) out.push(tub(x, y, TOP, r, h, top));
  out.push(poles(x0, xa, y0, y1, "front"));
  out.push(awning(x0, xa, y0, y1, straw, { stripes: true }));
  return out.join("");
}
function stallParasol(y0, y1) {
  // Sarubobo charms and fruit under a red parasol.
  const x0 = SX0;
  const x1 = SX0 + 9;
  const out = [];
  out.push(person(VX, y0 + 2.4, PZ, { coat: indigo, hat: straw }));
  const [px, py] = [x0 - 1, (y0 + y1) / 2 + 2.4];
  out.push(parasolPole(px, py, PZ, 14.4));
  out.push(table(x0, x1, y0, y1, plaster));
  out.push(fruitCrate(x0 + 0.6, y0 + 0.8, 4, 4.6, TOP, straw, 0.7));
  out.push(fruitCrate(x0 + 0.6, y0 + 6.2, 4, 4.6, TOP, tomato, 0.7));
  // A row of sarubobo: little red figures with dark hoods, on a board.
  out.push(wood(slab(sx(x0 + 5.4, x0 + 7.8, y0 + 0.4, y0 + 11.6), TOP, 0.6, { tone: "hi" }, 2)));
  const dolls = [];
  for (let i = 0; i < 3; i++) dolls.push([x0 + 6.6, y0 + 2.4 + i * 3.4]);
  for (const [x, y] of byDepth(dolls, ([x, y]) => [x, y, 0])) {
    out.push(red(cyl(x, y, 0.85, TOP + 0.6, 1.9, { tone: "hi" }, 8)));
    out.push(red(balls([[x, y, TOP + 3.1]], 0.75)));
    out.push(tile(balls([[x - 0.15, y - 0.1, TOP + 3.55]], 0.5)));
  }
  out.push(parasol(px, py, 9, 14.4));
  return out.join("");
}
function stallGrill(y0, y1) {
  const x0 = SX0;
  const x1 = SX0 + 7;
  const out = [];
  out.push(person(VX, (y0 + y1) / 2, PZ, { coat: plaster, scarf: indigo }));
  out.push(table(x0, x1, y0, y1, indigo));
  out.push(grill(x0 + 3.4, (y0 + y1) / 2, TOP));
  // A banner (nobori) on a pole at the stall's end, facing along the row.
  const fx = x1 - 0.4;
  const fy = y0 - 1.6;
  out.push(halo(sx(fx - 0.8, fx + 0.8, fy - 0.8, fy + 0.8), PZ, 0.1, 1));
  out.push(red(slab(sx(fx - 4.2, fx - 0.4, fy - 0.15, fy + 0.15), PZ + 7, 9, { tone: "hi", inner: L(faceLine("y", fy + 0.15, fx - 2.3, PZ + 8.5, fx - 2.3, PZ + 14.5), { tone: "faint" }) }, 2)));
  out.push(timber(slab(sx(fx - 0.25, fx + 0.25, fy - 0.25, fy + 0.25), PZ, 17, { tone: "hi" }, 2)));
  return { body: out.join(""), steamAt: [x0 + 3.4, (y0 + y1) / 2, TOP + 3] };
}
// ---------- assemble ----------
const grillStall = stallGrill(50, 60);
const plaza = [
  { at: [SX0 + 4, -47, 0], svg: stallVeg(-56, -38) },
  { at: [SX0 + 4, -24, 0], svg: stallPickles(-32, -16) },
  { at: [WX + 8, 17, 0], svg: signboard(WX + 8, 17) },
  { at: [SX0 + 4, 30, 0], svg: stallParasol(22, 34) },
  { at: [SX0 + 4, 55, 0], svg: grillStall.body },
  { at: [41.5, -26, 0], svg: person(41.5, -26, PZ, { coat: tomato, basket: 1 }) },
  { at: [41, -10, 0], svg: person(41, -10, PZ, { coat: tile, legs: timber, hat: straw }) },
  { at: [36, 3, 0], svg: person(36, 3, PZ, { coat: indigo, legs: timber }) },
  { at: [43, 28, 0], svg: person(43, 28, PZ, { coat: straw, basket: -1 }) },
  { at: [42, 47, 0], svg: handcart(42, 47) },
];
for (const it of plaza) it.d = depth(it.at);
plaza.sort((p, q) => p.d - q.d);

const parts = {
  plinth: plinth(PLINTH),
  ground: ground(),
  hall: hall(),
  pine: courtCedar(2, 48, 32),
  porch: porch(),
  gateBack: gateBack(),
  wallA: wallSegment(Y0, G0 - 1.4),
  gateFront: gateFront(),
  wallB: wallSegment(G1 + 1.4, Y1),
  gateRoof: gateRoof(),
};
plaza.forEach((p, i) => { parts[`plaza${i}@${p.at.slice(0, 2)}`] = p.svg; });
parts.steam = steamWisps(...grillStall.steamAt);
if (process.argv.includes("--sizes")) for (const [n, s] of Object.entries(parts)) console.log(n.padEnd(24), (minify(s).length / 1024).toFixed(1), "KB");
// Small parts drop their crease and bevel lines: under ~7 px they are noise and cost bytes.
function lean(svg, px = 12) {
  return svg.replace(/<g class="iso-solid"([^>]*)>(.*?)<\/g>/g, (m, attrs, inner) => {
    const f = inner.match(/class="iso-fill" d="([^"]*)"/);
    if (!f) return m;
    const n = (f[1].match(/-?\d*\.?\d+/g) ?? []).map(Number);
    const xs = n.filter((_, i) => i % 2 === 0);
    const ys = n.filter((_, i) => i % 2 === 1);
    const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
    if (span >= px) return m;
    return `<g class="iso-solid"${attrs}>${inner.replace(/<path class="iso-line iso-(?:crease|bevel)"[^>]*\/>/g, "")}</g>`;
  });
}
const body = minify(lean(Object.values(parts).join("")));

// ---------- output: standalone SVGs + previews + scoped TS markup ----------
const SUBJECT = "Puerta del Takayama Jinya con puestos del mercado matinal";
const LABEL = "Takayama Jinya in isometric view: the roofed gate of the Edo-period government office between white plastered walls, with the stalls of the Jinya-mae morning market set out in front.";

for (const theme of ["light", "dark"]) {
  const name = `${NAME}-${theme}`;
  const svg = a.assetSvg({ width: W, height: H, label: LABEL, body, paper: SITE[theme].paper, theme, accents: accentsFor(theme), weight: WEIGHT, id: name });
  writeFileSync(join(HERE, `${name}.svg`), svg);
  writeFileSync(join(HERE, `${name}.html`), a.previewHtml({ title: name, svg, paper: SITE[theme].paper, width: W * 2 }));
  console.log(`wrote ${name}.svg (${(svg.length / 1024).toFixed(0)} KB)`);
}
console.log(`solids: ${counter.solids}`);

const scope = `.iso-${NAME}`;
const pre = `${NAME}-`;
const drawing = k.ISO_CSS.split("\n").filter((line) => /^\.(iso-svg|iso-fill|iso-solid|iso-shade|iso-top|iso-halo|iso-line|iso-dots|tb-)/.test(line));
const scoped = drawing.map((line) => line.replace(/^([^{]+)\{/, (_, sel) => `${sel.split(",").map((s) => `${scope} ${s.trim().replace(/^\.iso-svg /, "")}`).join(",")}{`)).join("\n");
const tokens = (theme) => {
  const g = a.groundTokens(SITE[theme].paper, { theme });
  delete g.card; delete g.page;
  g.paper = "var(--paper)";
  const extra = theme === "light" ? { lit: "#000000", "halo-opacity": ".32" } : { lit: "#ffffff", "halo-opacity": ".9" };
  return Object.entries({ ...g, ...extra, weight: `${WEIGHT}px` }).map(([n, v]) => `--anatomy-${n}:${v}`).join(";");
};
const pulse = `${pre}pulse`;
const css = [
  `${scope}{${tokens("light")}}`,
  `[data-theme="dark"] ${scope}{${tokens("dark")}}`,
  a.accentCss(accentsFor("light"), { scope, theme: "light" }),
  a.accentCss(accentsFor("dark"), { scope: `[data-theme="dark"] ${scope}`, theme: "dark" }),
  scoped,
  `@keyframes ${pulse}{0%,100%{opacity:var(--${pre}min,.35)}50%{opacity:1}}`,
  `${scope} .${pulse}{animation:${pulse} var(--${pre}period,3.2s) cubic-bezier(.45,0,.55,1) var(--${pre}delay,0s) infinite}`,
  `@media (prefers-reduced-motion:reduce){${scope} .${pulse}{animation:none}}`,
].join("\n");
if (/class="am-(?!pulse")/.test(body)) throw new Error("only am-pulse motion is supported in the scoped markup");
const scopedBody = body.replace(/class="am-pulse"/g, `class="${pulse}"`).replace(/--am-/g, `--${pre}`);
const markup = `<style>${css}</style><g data-art="">${scopedBody}</g>`;
if (/(?<![\w-])am-/.test(markup)) throw new Error("kit motion names leaked into the TS markup");
const ts = `/**
 * Takayama Jinya isométrico (domingo 16 de mayo) — marcado SVG generado (no editar a mano).
 *
 * Generado con el kit de la skill anatomy-asset (tools/art/iso/jinya/build.mjs).
 * Los colores salen de los tokens de src/styles/index.css (--paper, --ink, --gold, --brown, --green…)
 * para tema claro y oscuro: --anatomy-paper usa var(--paper) en vivo y las rampas de tono se
 * derivan de esos hex al generar. Todo el CSS va acotado a \`${scope}\` (y
 * \`[data-theme="dark"] ${scope}\`); la animación es \`${pulse}\` y se detiene con
 * prefers-reduced-motion. Si cambia la paleta, hay que regenerar este fichero.
 */
export const JINYA_ISO_VIEWBOX = '0 0 ${W} ${H}'

export const JINYA_ISO_SUBJECT = '${SUBJECT}'

export const JINYA_ISO_MARKUP = ${JSON.stringify(markup)}
`;
const outDir = join(HERE, "..", "out");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, `${NAME}Iso.markup.ts`), ts);
console.log(`wrote out/${NAME}Iso.markup.ts (${(Buffer.byteLength(ts) / 1024).toFixed(1)} KB)`);
