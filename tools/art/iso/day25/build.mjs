// Day 25 — Osaka Castle: the keep (tenshu) on its battered stone base above the moat, as an
// isometric asset for the japan-2027 landing (same set as the day-21 pilot).
// The moat fills the front of the plinth; the ishigaki rises straight out of the water in
// stone courses; on it the five-tier keep: white plastered storeys with window rows, green
// copper hip roofs with upturned corners and gold hip-end caps, triangular chidori gables with
// gold crests, and the top storey in dark lacquer with gold panels under a hip-and-gable roof
// crowned by two gold shachihoko. Pines and a corner turret (yagura) on the banks. The keep's
// reflection in the moat breathes (CSS only), as in the pilot.
//
//   node build.mjs   → day25-light/dark .svg/.html, ../out/day25Iso.markup.ts

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  k, G, P, SITE, mix, baseAccents, PLINTH, at, S, L, ac, byDepth, pathOf, count, grow,
  polySolid, prism, frameYZ, frameXZ, frustum, roofOf, courses, irimoya, shibi,
  faceLine, faceRect, slab, cyl, solid, plinth, stone, minify, emit, a,
} from "../common-d20-25.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

function accentsFor(theme) {
  const s = SITE[theme];
  const base = baseAccents(theme);
  return {
    ...base,
    copper: theme === "light" ? mix(s.green, s.paper, 0.18) : mix(s.green, s.paper, 0.12),
    lacquer: theme === "light" ? mix(s.ink, s.paper, 0.08) : mix(s.paper, s.ink, 0.1),
  };
}
const gold = ac("gold");
const plaster = ac("plaster");
const copper = ac("copper");
const lacquer = ac("lacquer");
const water = ac("water");
const moss = ac("moss");
const pine = ac("pine");
const wood = ac("wood");
const roofAc = ac("roof");
const ripple = ac("ripple");

// ---------- world ----------
const WATER_Z = 0.5;
const LAND_Z = 4;
const BASE_LO = { x: -60, y: -56, w: 72, d: 72 };
const BASE_HI = { x: -53, y: -49, w: 58, d: 58 };
const Z_BASE = 21;
const CX = -24;
const CY = -20;
const plan = (w, d) => ({ x: CX - w / 2, y: CY - d / 2, w, d, r: 0 });
// Tiers: wall plan, wall bottom, wall top (= eave), roof overhang, next wall bottom (= roof inner height).
const TIERS = [
  { wall: plan(42, 48), z0: Z_BASE + 1.4, z1: 34, ov: 6.5 },
  { wall: plan(35, 40), z0: 39, z1: 49, ov: 6 },
  { wall: plan(29, 33), z0: 53.5, z1: 62.5, ov: 5.5 },
  { wall: plan(23, 27), z0: 66.5, z1: 74.5, ov: 5 },
  { wall: plan(18, 22), z0: 78, z1: 84.5, ov: 4.6 },
];

// ---------- moat, banks ----------
const MOAT = k.insetPlan(PLINTH, 3.5);
const moat = () => water(slab(MOAT, 0, WATER_Z, { tone: "lo", crease: "none" }, 6));

// Banks: a strip along the back and one along the left, with a winding shore.
const LAND = [
  [-64.5, -60.5], [74.5, -60.5], [74.5, -44], [62, -42], [46, -45], [30, -41], [16, -44], [12, -44],
  [12, 16], [-48, 16], [-46, 30], [-50, 46], [-47, 60], [-52, 68.5], [-64.5, 68.5],
];
const land = () => moss(count(S(k.extrude(LAND, 0, LAND_Z, P, { convex: false }), { tone: "mid", crease: "faint" })));

// The ishigaki: battered stone base, courses wrapping its two visible faces.
function ishigaki() {
  const lines = [];
  const n = 7;
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const z = Z_BASE * t;
    const lerp = (lo, hi) => lo + (hi - lo) * t;
    const x0 = lerp(BASE_LO.x, BASE_HI.x);
    const x1 = lerp(BASE_LO.x + BASE_LO.w, BASE_HI.x + BASE_HI.w);
    const y0 = lerp(BASE_LO.y, BASE_HI.y);
    const y1 = lerp(BASE_LO.y + BASE_LO.d, BASE_HI.y + BASE_HI.d);
    lines.push(pathOf([[x1, y0, z], [x1, y1, z], [x0, y1, z]].map(at)));
    // Staggered joints between this course and the one below, rooted on both.
    const zb = Z_BASE * (i - 1) / n;
    const tb = (i - 1) / n;
    const lb = (lo, hi) => lo + (hi - lo) * tb;
    const xb1 = lb(BASE_LO.x + BASE_LO.w, BASE_HI.x + BASE_HI.w);
    const yb1 = lb(BASE_LO.y + BASE_LO.d, BASE_HI.y + BASE_HI.d);
    for (let j = 0; j < 7; j++) {
      const f = (j + 0.5 + (i % 2) * 0.5) / 7.5;
      if (f > 0.97) continue;
      const yy = y0 + (y1 - y0) * f;
      const yyb = lb(BASE_LO.y, BASE_HI.y) + (yb1 - lb(BASE_LO.y, BASE_HI.y)) * f;
      lines.push(pathOf([at([x1, yy, z]), at([xb1, yyb, zb])]));
      const xx = x0 + (x1 - x0) * f;
      const xxb = lb(BASE_LO.x, BASE_HI.x) + (xb1 - lb(BASE_LO.x, BASE_HI.x)) * f;
      lines.push(pathOf([at([xx, y1, z]), at([xxb, yb1, zb])]));
    }
  }
  const out = [count(S(frustum(BASE_LO, 0, BASE_HI, Z_BASE), { tone: "mid", crease: "faint", inner: L(lines.join(""), { tone: "faint" }) }))];
  // The stone cap of the platform.
  out.push(slab({ ...BASE_HI, r: 0 }, Z_BASE, 1.4, { tone: "mid" }, 2, 0.3));
  return out.join("");
}

// ---------- the keep ----------
// Window rows on the two visible faces: rectangles with two bars, rooted on their own frame.
function windows(wall, z0, z1, count, w = 3.6) {
  const xf = wall.x + wall.w;
  const yf = wall.y + wall.d;
  const marks = [];
  const panes = [];
  const zA = z0 + (z1 - z0) * 0.16;
  const zB = z0 + (z1 - z0) * 0.56;
  const row = (face, c, u0, u1, n) => {
    for (let i = 0; i < n; i++) {
      const um = u0 + ((u1 - u0) * (i + 0.5)) / n;
      marks.push(faceRect(face, c, um - w / 2, um + w / 2, zA, zB));
      panes.push(faceRect(face, c, um - w / 2, um + w / 2, zA, zB));
      for (const f of [1 / 3, 2 / 3]) marks.push(faceLine(face, c, um - w / 2 + w * f, zA, um - w / 2 + w * f, zB));
    }
  };
  row("x", xf, wall.y, wall.y + wall.d, count[0]);
  row("y", yf, wall.x, wall.x + wall.w, count[1]);
  return { lines: marks.join(""), panes: `<path d="${panes.join("")}" style="fill:var(--anatomy-lo);stroke:none;opacity:.55"/>` };
}

// A chidori-hafu: a triangular gable on a hip roof slope, its faces meeting the slope along
// the two valley lines. side "x" sits on the +x slope, "y" on the +y slope.
function chidori(tier, side, centre, hw, rise) {
  const { wall, z1, ov } = tier;
  const inner = grow(TIERS[TIERS.indexOf(tier) + 1].wall, 0.6);
  const zB = z1 + 0.2 + 1.8;
  const zC = TIERS[TIERS.indexOf(tier) + 1].z0;
  const isX = side === "x";
  const eave = isX ? wall.x + wall.w + ov : wall.y + wall.d + ov;
  const innerEdge = isX ? inner.x + inner.w : inner.y + inner.d;
  const slope = (zC - zB) / (eave - innerEdge);
  const front = eave - 0.5;
  const z0 = zB + slope * 0.5;
  const za = z0 + hw * rise;
  const back = front - (za - z0) / slope;
  const p = (c, u, z) => (isX ? [c, u, z] : [u, c, z]);
  const A = p(front, centre - hw, z0);
  const B = p(front, centre + hw, z0);
  const C = p(front, centre, za);
  const D = p(back, centre, za);
  const out = isX ? [1, 0, 0] : [0, 1, 0];
  const faces = [
    { pts: [A, B, C], hint: out },
    { pts: [A, C, D], hint: isX ? [0.3, -1, 1] : [-1, 0.3, 1] },
    { pts: [B, D, C], hint: isX ? [0.3, 1, 1] : [1, 0.3, 1] },
    { pts: [A, D, B], hint: [0, 0, -1] },
  ];
  const res = [];
  const tri = polySolid(faces);
  // The barge boards (hafu): a chevron along the front edge, a little proud of the face.
  const t = 1.5;
  const e = 0.8;
  const chev = [[centre - hw - e, z0 - e * rise], [centre - hw - e, z0 - e * rise + t], [centre, za + t], [centre + hw + e, z0 - e * rise + t], [centre + hw + e, z0 - e * rise], [centre, za]];
  const fr = isX ? frameYZ(0) : frameXZ(0);
  const boards = prism(chev, fr, front - 0.6, front + 1.1);
  // The gable's roof (copper), its plastered face just proud of it, then the boards.
  const faceTri = [[centre - hw + 0.6, z0 + 0.2], [centre + hw - 0.6, z0 + 0.2], [centre, za - 0.5]];
  res.push(copper(solid(tri, { tone: "hi" })));
  res.push(plaster(solid(prism(faceTri, fr, front - 0.3, front + 0.15), { tone: "mid" })));
  res.push(copper(solid(boards, { tone: "hi" })));
  // A gold crest on the face: a small disc, its axis normal to the face.
  const cz = z0 + (za - z0) * 0.38;
  const F = G.frameAlong(p(front + 0.15, centre, cz), out);
  res.push(gold(solid(G.disc(0, 0.5, 1.3, F, P), { tone: "hi", lit: true })));
  return res.join("");
}

function tierSvg(i) {
  const tier = TIERS[i];
  const { wall, z0, z1, ov } = tier;
  const top = i === TIERS.length - 1;
  const out = [];
  const xf = wall.x + wall.w;
  const yf = wall.y + wall.d;
  if (!top) {
    const n = [[5, 4], [4, 4], [3, 3], [3, 2]][i];
    const win = windows(wall, z0, z1, n);
    // A sill band (nageshi) line wrapping both faces, corner to corner.
    const band = pathOf([[xf, wall.y, z0 + 1.2], [xf, yf, z0 + 1.2], [wall.x, yf, z0 + 1.2]].map(at));
    out.push(plaster(slab(wall, z0, z1 - z0, { tone: "mid", inner: win.panes + L(win.lines + band, { tone: "lo" }) }, 2)));
  } else {
    // The top storey: dark lacquer with gold panels (the tigers and cranes, as framed panels).
    const panels = [];
    const zA = z0 + 1.6;
    const zB = z1 - 1.6;
    for (let j = 0; j < 4; j++) {
      const u0 = wall.y + 1 + (j * (wall.d - 2)) / 4 + 0.6;
      const u1 = wall.y + 1 + ((j + 1) * (wall.d - 2)) / 4 - 0.6;
      panels.push(faceRect("x", xf, u0, u1, zA, zB));
      panels.push(faceLine("x", xf, u0, (zA + zB) / 2, u1, (zA + zB) / 2));
    }
    for (let j = 0; j < 3; j++) {
      const u0 = wall.x + 1 + (j * (wall.w - 2)) / 3 + 0.6;
      const u1 = wall.x + 1 + ((j + 1) * (wall.w - 2)) / 3 - 0.6;
      panels.push(faceRect("y", yf, u0, u1, zA, zB));
      panels.push(faceLine("y", yf, u0, (zA + zB) / 2, u1, (zA + zB) / 2));
    }
    out.push(lacquer(slab(wall, z0, z1 - z0, { tone: "hi", inner: gold(L(panels.join(""), { tone: "mid" })) }, 2)));
  }
  // The roof.
  if (!top) {
    const next = TIERS[i + 1];
    const roof = roofOf(wall, ov, z1 + 0.2, grow(next.wall, 0.6), next.z0, { lift: 2.6, flare: 1.8, fascia: 1.8 });
    out.push(copper(count(S(roof.paths, { tone: "hi" })) + L(courses(roof, [0.4, 0.75]), { tone: "lo" })));
    out.push(hipCaps(roof));
    // Chidori gables on some tiers.
    if (i === 0) {
      out.push(chidori(tier, "y", CX, 9, 0.62));
      out.push(chidori(tier, "x", CY, 8, 0.62));
    }
    if (i === 2) {
      out.push(chidori(tier, "y", CX, 6, 0.62));
      out.push(chidori(tier, "x", CY, 5.5, 0.62));
    }
  } else {
    const inner = { x: CX - 6.5, y: CY - 8.5, w: 13, d: 17 };
    const zIn = z1 + 4.2;
    const roof = roofOf(wall, ov, z1 + 0.2, inner, zIn, { lift: 2.4, flare: 1.6, fascia: 1.6 });
    out.push(copper(count(S(roof.paths, { tone: "hi" })) + L(courses(roof, [0.45, 0.8], [1, 2]), { tone: "lo" })));
    out.push(hipCaps(roof));
    const ir = irimoya(inner, zIn, zIn + 6.6, { axis: "y", inset: 1.6, ov: 1.2, t: 1.2, e: 1.6, slope: 0.45, ridgeW: 1.5, ridgeH: 1.3 });
    out.push(lacquer(solid(ir.tsuma, { tone: "hi" })));
    out.push(copper(solid(ir.gable, { tone: "hi", inner: L(ir.courses, { tone: "lo" }) })));
    out.push(copper(solid(ir.ridge, { tone: "hi" })));
    const [e0, e1] = ir.ends;
    out.push(gold(solid(shibi([e0[0], e0[1] + 1.3, e0[2]], "y", -1, 1.15, 1.1), { tone: "hi", lit: true })));
    out.push(gold(solid(shibi([e1[0], e1[1] - 1.3, e1[2]], "y", 1, 1.15, 1.1), { tone: "hi", lit: true })));
  }
  return out.join("");
}

// Gold caps on the three visible hip ends of a roof (the corners at +x−y, +x+y and −x+y).
function hipCaps(roof) {
  const { A, n } = roof;
  const corners = [n, 2 * n, 3 * n].map((i) => A[i % A.length]);
  return byDepth(corners).map(([x, y, z]) => gold(slab({ x: x - 0.65, y: y - 0.65, w: 1.3, d: 1.3, r: 0 }, z + 0.4, 1.6, { tone: "hi" }, 2, 0.2))).join("");
}

function keep() {
  return TIERS.map((_, i) => tierSvg(i)).join("");
}

// ---------- reflection ----------
function reflection() {
  const mirror = (p) => [p[0], p[1], 2 * WATER_Z - p[2]];
  const hull = (pts) => pathOf(G.hullOf(pts.map((p) => at(mirror(p)))), true);
  const box = (pl, z0, z1) => k.boxCorners(pl, z0, z1);
  const pieces = [["plain", hull([...box(BASE_LO, 0, 0), ...box(BASE_HI, Z_BASE, Z_BASE)])]];
  TIERS.forEach((t, i) => {
    pieces.push(["plaster", hull(box(t.wall, t.z0, t.z1))]);
    const nx = TIERS[i + 1];
    pieces.push(["roof", hull([...box(grow(t.wall, t.ov), t.z1, t.z1 + 2), ...box(nx ? nx.wall : plan(10, 14), nx ? nx.z0 : t.z1 + 11, nx ? nx.z0 : t.z1 + 11)])]);
  });
  const fills = pieces.map(([kind, d]) => {
    const fill = kind === "roof" ? "var(--anatomy-shade-0)" : kind === "plaster" ? "var(--anatomy-top)" : "var(--anatomy-shade-1)";
    const path = `<path d="${d}" style="fill:${fill};stroke:none"/>`;
    return kind === "roof" ? copper(path) : water(path);
  }).join("");
  const clip = pathOf(k.ringOf(MOAT, 6).map(([x, y]) => at([x, y, WATER_Z])), true);
  const strokes = [];
  for (const [y, x0, x1] of [[30, 2, 22], [38, -18, 6], [46, -30, -14], [26, 26, 40]]) strokes.push(k.fadeLineSvg([at([x0, y, WATER_Z]), at([x1, y, WATER_Z])], { fade: [5, 5], tone: "mid" }));
  return `<clipPath id="d25-moat"><path d="${clip}"/></clipPath><g clip-path="url(#d25-moat)"><g opacity=".3">${a.amPulse(fills, { period: 7000, min: 0.72 })}</g>${a.amPulse(ripple(strokes.join("")), { period: 5200, delay: 1700, min: 0.25 })}</g>`;
}

// ---------- banks: pines, a corner turret, stones ----------
function roundPine(x, y, z, s = 1) {
  const out = [];
  out.push(`<path class="iso-halo" d="${k.haloOf({ x: x - 6 * s, y: y - 6 * s, w: 12 * s, d: 12 * s, r: 6 * s }, z, 0.1, P)}" style="filter:blur(4px)"/>`);
  out.push(wood(cyl(x, y, 0.9 * s, z, 8 * s, { tone: "hi" }, 12)));
  const pads = byDepth([[x + 2.2 * s, y + 1 * s, z + 7 * s, 4.4 * s], [x - 1.4 * s, y - 1.4 * s, z + 9.6 * s, 4.8 * s], [x + 0.4 * s, y + 0.4 * s, z + 12.6 * s, 3.8 * s]], (b) => b);
  for (const [px, py, pz, r] of pads) {
    out.push(pine(count(S(k.cylinder(px, py, r, pz, 1.4 * s, P, 18, 0.4), { tone: "hi", inner: L(k.sideArc(px, py, r, pz + 0.7 * s, P, 18), { tone: "faint" }) }))));
  }
  return out.join("");
}

// A small two-storey corner turret (sumi-yagura) on the back bank.
function yagura(x, y, z) {
  const out = [];
  const base = { x: x - 8, y: y - 6, w: 16, d: 12 };
  out.push(count(S(frustum(base, z, k.insetPlan({ ...base, r: 0 }, 1.6), z + 5), { tone: "mid", crease: "faint" })));
  const w1 = { x: x - 6, y: y - 4.2, w: 12, d: 8.4, r: 0 };
  out.push(plaster(slab(w1, z + 5, 6, { tone: "mid", inner: (({ panes, lines }) => panes + L(lines, { tone: "lo" }))(windows(w1, z + 5, z + 11, [2, 3], 1.8)) }, 2)));
  const w2 = { x: x - 4.4, y: y - 3, w: 8.8, d: 6, r: 0 };
  const r1 = roofOf(w1, 3, z + 11.2, grow(w2, 0.4), z + 14, { lift: 1.4, flare: 1, fascia: 1.2, n: 6 });
  out.push(copper(count(S(r1.paths, { tone: "hi" }))));
  out.push(plaster(slab(w2, z + 14, 4.6, { tone: "mid", inner: (({ panes, lines }) => panes + L(lines, { tone: "lo" }))(windows(w2, z + 14, z + 18.6, [2, 2], 1.6)) }, 2)));
  const r2 = roofOf(w2, 2.8, z + 18.8, { x: x - 1, y: y - 0.6, w: 2, d: 1.2 }, z + 22.5, { lift: 1.3, flare: 1, fascia: 1.1, n: 6 });
  out.push(copper(count(S(r2.paths, { tone: "hi" })) + L(courses(r2, [0.5]), { tone: "lo" })));
  return out.join("");
}

// ---------- assemble ----------
const bank = [];
bank.push({ at: [46, -54, LAND_Z], svg: yagura(46, -54, LAND_Z) });
for (const [x, y, s] of [[24, -52, 1], [68, -52, 0.9], [-58, 30, 1.05], [-56, 56, 0.9]]) bank.push({ at: [x, y, LAND_Z], svg: roundPine(x, y, LAND_Z, s) });
const stones = byDepth([[30, -42, 2.4, 2], [-46, 40, 2.6, 2.2], [56, -42, 2, 1.8]], (s) => [s[0], s[1], 0])
  .map(([x, y, r, h], i) => stone(x, y, r, h, 0, i + 3)).join("");

const body = minify([
  plinth(),
  moat(),
  reflection(),
  land(),
  ...byDepth(bank.filter((b) => b.at[1] < -40), (i) => i.at).map((i) => i.svg),
  ishigaki(),
  keep(),
  ...byDepth(bank.filter((b) => b.at[1] >= -40), (i) => i.at).map((i) => i.svg),
  stones,
].join(""));

emit({
  dir: HERE,
  nn: 25,
  subject: "Castillo de Osaka",
  label: "Osaka Castle in isometric view: the five-tier keep with white walls, green roofs and gold ornaments on its stone base above the moat.",
  body,
  accentsFor,
  tokensNote: "--paper, --green, --gold, --brown, --ink",
  motionNote: "Movimiento: solo el reflejo del castillo en el foso \"respira\" (CSS); se detiene con prefers-reduced-motion.",
});
