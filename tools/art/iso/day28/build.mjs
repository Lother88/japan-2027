// Day 28 — Tokyo Skytree as an isometric diorama, matching the day-21 pilot. A stone plinth
// with the Sumida river along its front, crossed by the red Azuma bridge; on the far bank the
// low Solamachi blocks and street trees around the tower's foot. The tower rises from its
// triangular tripod base, morphing into a round shaft clad in a steel diagrid, carries the
// Tembo Deck drum and the Tembo Galleria ring, and ends in the antenna mast (proportions
// shortened so it fits a 440×330 card). At sunset the deck windows glow and breathe, and the
// aircraft-warning light on the mast blinks (CSS only, stopped under prefers-reduced-motion).
//
//   node build.mjs  → day28-light.svg/.html, day28-dark.svg/.html, ../out/day28Iso.markup.ts

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { a, G, k, SITE, mix, toolkit, minify, emit, clippedPlan, W, H } from "../lib-d13-29/common.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

function accentsFor(theme) {
  const s = SITE[theme];
  return {
    steel: theme === "light" ? s.paper : s.ink,
    glass: theme === "light" ? mix(s.gold, s.paper, 0.1) : s.gold,
    water: mix(s.green, s.paper, theme === "light" ? 0.62 : 0.5),
    moss: mix(s.green, s.paper, theme === "light" ? 0.4 : 0.25),
    pine: s.green,
    wood: s.brown,
    bridge: s.coral,
    lamp: s.coral2,
    ripple: { hex: s.green, mode: "ink" },
  };
}

// ---------- world ----------
const PLINTH = { x: -62, y: -54, w: 124, d: 104, r: 8 };
const LAND_Z = 3;
const WATER_Z = 0.5;
const RIVER = { y0: 22, y1: 42 };
const TX = -6;
const TY = -16;
const TZ = LAND_Z + 1.2; // tower foot on its plaza
const Z = { deck0: 66, deck1: 75, gal0: 88, gal1: 92, shaftTop: 100, top: 132 };

const fitPoints = [...k.boxCorners(PLINTH, -10, LAND_Z), [TX, TY, TZ + Z.top + 2]];
const P = a.fitInto(fitPoints, { x: 0, y: 0, w: W, h: H }, { pad: 6, azimuth: 40 });
const T = toolkit(P);
const { at, S, L, ac, byDepth, pathOf, count, slab, cyl, stone, faceLine, faceRect, loft } = T;
const steel = ac("steel");
const glass = ac("glass");
const water = ac("water");
const moss = ac("moss");
const pine = ac("pine");
const wood = ac("wood");
const bridgeAc = ac("bridge");
const lamp = ac("lamp");
const ripple = ac("ripple");
const V = G.viewOf(P);

// ---------- the tower's lower shaft: a loft from a tripod triangle to a circle ----------
const N = 48;
const TRI_PHASE = Math.PI / 2 + 0.35; // one vertex pointing roughly toward the viewer's left
const LEVELS = [[0, 15, 0], [10, 12.6, 0.12], [20, 10.6, 0.3], [32, 8.9, 0.55], [44, 7.7, 0.78], [56, 6.9, 0.94], [Z.deck0, 6.4, 1]];
function radiusAt(theta, R, round) {
  const n = 3;
  const phi = ((theta - TRI_PHASE) % ((2 * Math.PI) / n) + (2 * Math.PI) / n) % ((2 * Math.PI) / n);
  const tri = (R * Math.cos(Math.PI / n)) / Math.cos(phi - Math.PI / n);
  const triSoft = tri * 1.06; // sides bow out a little, as on the real tower
  const circ = R * 0.82;
  return triSoft * (1 - round) + circ * round;
}
// Interpolated surface point at angle theta and height z (z above the tower foot).
function shaftAt(theta, z) {
  let i = 0;
  while (i < LEVELS.length - 2 && LEVELS[i + 1][0] < z) i++;
  const [z0, R0, b0] = LEVELS[i];
  const [z1, R1, b1] = LEVELS[i + 1];
  const t = Math.max(0, Math.min(1, (z - z0) / (z1 - z0)));
  const r = radiusAt(theta, R0, b0) * (1 - t) + radiusAt(theta, R1, b1) * t;
  return [TX + Math.cos(theta) * r, TY + Math.sin(theta) * r, TZ + z];
}
function shaftNormal(theta, z) {
  const e = 0.01;
  const pa = shaftAt(theta - e, z);
  const pb = shaftAt(theta + e, z);
  const pc = shaftAt(theta, z - 0.5);
  const pd = shaftAt(theta, z + 0.5);
  let n = G.cross3(G.sub3(pb, pa), G.sub3(pd, pc));
  const out = G.sub3(shaftAt(theta, z), [TX, TY, TZ + z]);
  if (G.dot3(n, out) < 0) n = G.mul3(n, -1);
  return G.unit3(n);
}
const seen = (theta, z) => G.dot3(shaftNormal(theta, z), V) > 0.02;

// A curve on the shaft given as samples [theta, z]: keep only the visible runs.
function onShaft(samples) {
  const runs = [];
  let run = [];
  for (const [th, z] of samples) {
    if (seen(th, z)) run.push(at(shaftAt(th, z)));
    else if (run.length) { runs.push(run); run = []; }
  }
  if (run.length) runs.push(run);
  return runs.filter((r) => r.length > 1).map((r) => pathOf(r)).join("");
}

function lowerShaft() {
  const rings = [];
  const cs = [];
  for (const [z] of LEVELS) {
    rings.push(Array.from({ length: N }, (_, i) => shaftAt((i / N) * Math.PI * 2, z)));
    cs.push([TX, TY, TZ + z]);
  }
  const paths = loft(rings, cs, { creaseCos: 0.86, caps: [false, true] });
  // The diagrid: crossing helices, plus ring girders every few metres.
  const marks = [];
  const M = 18;
  const twist = 0.045;
  for (let i = 0; i < M; i++) {
    for (const dir of [1, -1]) {
      const s = [];
      for (let z = 0; z <= Z.deck0 + 1e-6; z += 0.6) s.push([(i / M) * Math.PI * 2 + dir * twist * z, z]);
      marks.push(onShaft(s));
    }
  }
  const rings2 = [];
  for (const z of [12, 26, 40, 54]) {
    const s = [];
    for (let j = 0; j <= 144; j++) s.push([(j / 144) * Math.PI * 2, z]);
    rings2.push(onShaft(s));
  }
  return steel(count(S(paths, { tone: "hi", inner: L(marks.join(""), { tone: "lo" }) + L(rings2.join(""), { tone: "mid" }) })));
}

// Front-facing band on a vertical cylinder (filled): the visible half between z0 and z1.
function bandOf(cx, cy, r, z0, z1, steps = 48) {
  const vis = [];
  for (let i = 0; i <= steps; i++) {
    const th = Math.atan2(V[1], V[0]) - Math.PI / 2 + (i / steps) * Math.PI;
    vis.push([cx + Math.cos(th) * r, cy + Math.sin(th) * r]);
  }
  const lo = vis.map(([x, y]) => at([x, y, z0]));
  const hi = vis.map(([x, y]) => at([x, y, z1])).reverse();
  return pathOf([...lo, ...hi], true);
}

// Vertical mullions on a cylinder's visible side, from z0 to z1.
function mullions(cx, cy, r, z0, z1, n) {
  const out = [];
  const base = Math.atan2(V[1], V[0]);
  for (let i = 0; i < n; i++) {
    const th = (i / n) * Math.PI * 2;
    const c = Math.cos(th - base);
    if (c < 0.12) continue;
    out.push(k.segment([cx + Math.cos(th) * r, cy + Math.sin(th) * r, z0], [cx + Math.cos(th) * r, cy + Math.sin(th) * r, z1], P));
  }
  return out.join("");
}

// The Tembo Deck: a three-level drum with a glass band that glows at sunset.
function temboDeck() {
  const out = [];
  const z = TZ + Z.deck0;
  out.push(steel(cyl(TX, TY, 9.4, z, 1.6, { tone: "hi" }, 48, 0.3)));
  // Level 1 glazing, with the glow behind the mullions.
  const sk = G.scaleOf(P);
  out.push(steel(cyl(TX, TY, 10.2, z + 1.6, 3.6, { tone: "mid" }, 48)));
  out.push(glass(a.amPulse(`<path d="${bandOf(TX, TY, 10.2, z + 2, z + 4.8)}" style="fill:var(--anatomy-face);stroke:none"/>`, { period: 6000, min: 0.55 })));
  out.push(steel(L(mullions(TX, TY, 10.2, z + 2, z + 4.8, 36), { tone: "lo" })));
  out.push(steel(L(k.sideArc(TX, TY, 10.2, z + 2, P, 48) + k.sideArc(TX, TY, 10.2, z + 4.8, P, 48), { tone: "lo" })));
  out.push(steel(cyl(TX, TY, 10.8, z + 5.2, 1.1, { tone: "hi" }, 48, 0.3)));
  out.push(steel(cyl(TX, TY, 9.8, z + 6.3, 2.4, { tone: "mid", inner: L(mullions(TX, TY, 9.8, z + 6.5, z + 8.5, 30), { tone: "lo" }) }, 48)));
  out.push(steel(cyl(TX, TY, 9, z + 8.7, 0.9, { tone: "hi" }, 48, 0.3)));
  return out.join("");
}

function midShaft() {
  const out = [];
  const z0 = TZ + Z.deck1;
  const z1 = TZ + Z.gal0;
  const rings = [0, 1].map((t) => Array.from({ length: 36 }, (_, i) => { const th = (i / 36) * Math.PI * 2; const r = 5.6 - 0.6 * t; return [TX + Math.cos(th) * r, TY + Math.sin(th) * r, t ? z1 : z0]; }));
  const marks = [];
  for (let i = 0; i < 12; i++) {
    for (const dir of [1, -1]) {
      const s = [];
      for (let z = 0.4; z <= z1 - z0 - 0.4; z += 0.5) {
        const th = (i / 12) * Math.PI * 2 + dir * 0.08 * z;
        const r = 5.6 - 0.6 * (z / (z1 - z0));
        s.push([th, z, r]);
      }
      // visible runs on a near-cylinder
      const runs = [];
      let run = [];
      for (const [th, z, r] of s) {
        if (Math.cos(th) * V[0] + Math.sin(th) * V[1] > 0.05) run.push(at([TX + Math.cos(th) * r, TY + Math.sin(th) * r, z0 + z]));
        else if (run.length) { runs.push(run); run = []; }
      }
      if (run.length) runs.push(run);
      marks.push(runs.filter((r) => r.length > 1).map((r) => pathOf(r)).join(""));
    }
  }
  out.push(steel(count(S(loft(rings, [[TX, TY, z0], [TX, TY, z1]], { creaseCos: 0.9 }), { tone: "hi", inner: L(marks.join(""), { tone: "faint" }) }))));
  return out.join("");
}

// The Tembo Galleria: a slim glass ring with a spiral ramp, then the upper shaft and the mast.
function galleria() {
  const out = [];
  const z = TZ + Z.gal0;
  out.push(steel(cyl(TX, TY, 6.6, z, 0.8, { tone: "hi" }, 40, 0.2)));
  out.push(steel(cyl(TX, TY, 6.9, z + 0.8, 2.6, { tone: "mid", inner: L(mullions(TX, TY, 6.9, z + 0.8, z + 3.4, 28), { tone: "lo" }) }, 40)));
  out.push(steel(cyl(TX, TY, 6.4, z + 3.4, 0.7, { tone: "hi" }, 40, 0.2)));
  // Upper shaft.
  const z0 = TZ + Z.gal1 + 0.1;
  const z1 = TZ + Z.shaftTop;
  const rings = [0, 1].map((t) => Array.from({ length: 28 }, (_, i) => { const th = (i / 28) * Math.PI * 2; const r = 4.2 - 1.2 * t; return [TX + Math.cos(th) * r, TY + Math.sin(th) * r, t ? z1 : z0]; }));
  const ticks = [];
  for (const zz of [z0 + 2.6, z0 + 5.2]) ticks.push(k.sideArc(TX, TY, 4.2 - 1.2 * ((zz - z0) / (z1 - z0)), zz, P, 28));
  out.push(steel(count(S(loft(rings, [[TX, TY, z0], [TX, TY, z1]], { creaseCos: 0.9 }), { tone: "hi", inner: L(ticks.join(""), { tone: "faint" }) }))));
  // The mast (gain tower): stepped tubes with service rings.
  let zz = z1;
  for (const [r, h] of [[2.4, 6], [1.9, 7], [1.4, 7], [0.9, 7], [0.5, 4]]) {
    out.push(steel(cyl(TX, TY, r, zz, h, { tone: "hi" }, 20)));
    zz += h;
    if (r > 1) out.push(steel(cyl(TX, TY, r + 0.7, zz - 0.6, 0.6, { tone: "hi" }, 24, 0.15)));
  }
  // Aircraft-warning light at the tip, blinking.
  const tip = at([TX, TY, zz + 0.4]);
  const sk = G.scaleOf(P);
  out.push(lamp(a.amBlink(`<circle cx="${tip[0].toFixed(1)}" cy="${tip[1].toFixed(1)}" r="${(2.4 * sk).toFixed(1)}" style="fill:var(--anatomy-face);stroke:none;filter:blur(${(1 * sk).toFixed(1)}px)"/>`, { period: 2800, min: 0.08 })));
  out.push(lamp(count(S(G.sphereOf([TX, TY, zz + 0.4], 0.55, P, { steps: 20 }), { tone: "hi" }))));
  return out.join("");
}

// ---------- ground ----------
function ground() {
  const out = [];
  out.push(water(slab(k.insetPlan(PLINTH, 3.5), 0, WATER_Z, { tone: "lo", crease: "none" }, 6)));
  // Far bank (the tower's side): behind the river.
  const far = clippedPlan(PLINTH, { yMax: RIVER.y0 });
  out.push(moss(count(S(k.extrude(far, 0, LAND_Z, P, { convex: true }), { tone: "mid" }))));
  // Near bank strip.
  const near = clippedPlan(PLINTH, { yMin: RIVER.y1 });
  out.push(moss(count(S(k.extrude(near, 0, LAND_Z, P, { convex: true }), { tone: "mid" }))));
  // River ripples.
  const rows = [[-50, 30, -30], [-14, 36, 8], [20, 28, 36], [42, 38, 56]];
  const strokes = rows.map(([x0, y, x1]) => k.fadeLineSvg([at([x0, y, WATER_Z]), at([x1, y, WATER_Z])], { fade: [5, 5], tone: "mid" })).join("");
  const clip = pathOf([[PLINTH.x + 3.5, RIVER.y0], [PLINTH.x + PLINTH.w - 3.5, RIVER.y0], [PLINTH.x + PLINTH.w - 3.5, RIVER.y1], [PLINTH.x + 3.5, RIVER.y1]].map(([x, y]) => at([x, y, WATER_Z])), true);
  out.push(`<clipPath id="d28-river"><path d="${clip}"/></clipPath><g clip-path="url(#d28-river)">${ripple(strokes)}</g>`);
  return out.join("");
}

// The plaza ring around the tower's foot.
function plaza() {
  return slab({ x: TX - 20, y: TY - 20, w: 40, d: 40, r: 6 }, LAND_Z, 1.2, { tone: "mid", inner: L(k.planOutline({ x: TX - 17, y: TY - 17, w: 34, d: 34, r: 4 }, LAND_Z + 1.2, P, 6), { tone: "faint" }) }, 6, 0.3);
}

// Low buildings: boxes with window rows on their visible faces and a roof parapet.
function block(plan, h, rows = 2) {
  const xf = plan.x + plan.w;
  const yf = plan.y + plan.d;
  const marks = [];
  for (let r = 0; r < rows; r++) {
    const z = LAND_Z + 2 + ((h - 3) * (r + 0.5)) / rows;
    marks.push(faceLine("x", xf, plan.y, z, yf, z));
    marks.push(faceLine("y", yf, plan.x, z, xf, z));
  }
  const box = count(S(k.slabOf(plan, LAND_Z, h, P, 2, 0.3), { tone: "mid", inner: L(marks.join(""), { tone: "faint" }) }));
  // Rooftop plant: a low housing and a parapet line.
  const roof = slab({ x: plan.x + plan.w * 0.55, y: plan.y + plan.d * 0.2, w: plan.w * 0.3, d: plan.d * 0.45, r: 0 }, LAND_Z + h, 1.6, { tone: "mid" }, 2, 0.2);
  return box + roof;
}

// A street tree: a short trunk and a round crown.
function tree(x, y, r = 2.6) {
  return wood(cyl(x, y, 0.5, LAND_Z, 3, { tone: "hi" }, 10)) + pine(count(S(G.sphereOf([x, y, LAND_Z + 3 + r * 0.8], r, P, { steps: 28 }), { tone: "hi" })));
}

// The Azuma bridge: three shallow red arch ribs over the river on stone piers, a deck and
// parapets. Each rib is a plate whose underside follows the three arches.
function azuma() {
  const out = [];
  const x0 = 30;
  const x1 = 42;
  const yA = RIVER.y0 - 3;
  const yB = RIVER.y1 + 3;
  const zd = LAND_Z + 2.6;
  const zs = 2.1;
  const piers = [RIVER.y0 + 7.4, RIVER.y1 - 7.4];
  for (const y of piers) out.push(slab({ x: x0 + 0.6, y: y - 1.3, w: x1 - x0 - 1.2, d: 2.6, r: 0.6 }, 0, zs + 0.4, { tone: "mid" }, 4, 0.2));
  const spans = [[RIVER.y0 - 0.5, piers[0] - 1.3], [piers[0] + 1.3, piers[1] - 1.3], [piers[1] + 1.3, RIVER.y1 + 0.5]];
  const profile = [[yA, zd], [yB, zd], [yB, LAND_Z]];
  for (const [u0, u1] of [...spans].reverse()) {
    const rise = zd - 1 - zs;
    for (let i = 16; i >= 0; i--) {
      const t = i / 16;
      profile.push([u0 + (u1 - u0) * t, zs + rise * Math.sin(Math.PI * t)]);
    }
  }
  profile.push([yA, LAND_Z]);
  const rib = (xa, xb) => {
    const ring = (x) => profile.map(([y, z]) => [x, y, z]);
    return loft([ring(xa), ring(xb)], [[xa, (yA + yB) / 2, zd - 2], [xb, (yA + yB) / 2, zd - 2]], { creaseCos: 0.95 });
  };
  out.push(bridgeAc(count(S(rib(x0, x0 + 1), { tone: "hi" }))));
  out.push(slab({ x: x0 + 0.6, y: yA, w: x1 - x0 - 1.2, d: yB - yA, r: 0 }, zd - 0.6, 0.6, { tone: "mid" }, 2));
  out.push(bridgeAc(count(S(rib(x1 - 1, x1), { tone: "hi" }))));
  for (const x of [x0, x1 - 0.9]) out.push(bridgeAc(slab({ x, y: yA, w: 0.9, d: yB - yA, r: 0 }, zd, 1.3, { tone: "hi" }, 2)));
  return out.join("");
}

// ---------- assemble ----------
const behind = [
  block({ x: -56, y: -50, w: 34, d: 14, r: 0 }, 9),
  block({ x: 16, y: -50, w: 38, d: 16, r: 0 }, 12, 3),
  block({ x: 30, y: -26, w: 24, d: 18, r: 0 }, 7),
];
const front = [
  block({ x: -56, y: 2, w: 20, d: 14, r: 0 }, 6),
];
const trees = byDepth([[-30, 12], [-20, 14], [-10, 14], [0, 14], [10, 12], [24, 14], [-52, 48], [-36, 47], [12, 48], [54, 48]], (p) => [p[0], p[1], 0]);

const body = minify([
  T.plinth(PLINTH),
  ground(),
  ...behind,
  plaza(),
  lowerShaft(),
  temboDeck(),
  midShaft(),
  galleria(),
  ...front,
  ...trees.filter(([, y]) => y < RIVER.y0).map(([x, y]) => tree(x, y)),
  azuma(),
  ...trees.filter(([, y]) => y > RIVER.y1).map(([x, y]) => tree(x, y, 2.2)),
].join(""));

emit({
  nn: "28",
  here: HERE,
  body,
  label: "Tokyo Skytree in isometric view: the lattice tower rising from its triangular base, with its two observation decks, over the Sumida river and the red Azuma bridge.",
  subject: "Tokyo Skytree",
  accentsFor,
  jsdoc: ["Tokyo Skytree isométrico (día 28): la torre de celosía sobre su base triangular, con el Tembo", "Deck y la Tembo Galleria, junto al río Sumida y el puente rojo Azuma (proporciones acortadas", "para el formato 440×330). Las ventanas del mirador respiran y la baliza del mástil parpadea (CSS)."],
  solids: T.stats.solids,
});
