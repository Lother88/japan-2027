// Day 27 — Odaiba: the Rainbow Bridge over Tokyo Bay as an isometric diorama, matching the
// day-21 pilot. A stone plinth that is mostly bay water; the double-deck suspension bridge
// crosses it on two white towers standing on round caissons, its stiffening truss between the
// decks, the main cables sagging between the tower saddles and down to the anchor piers, with
// hangers to the deck. In front, Odaiba's urban beach with pines, and a yakatabune on the bay.
// The water shimmers and the aircraft-warning lights on the tower tops blink (CSS only,
// stopped under prefers-reduced-motion).
//
//   node build.mjs  → day27-light.svg/.html, day27-dark.svg/.html, ../out/day27Iso.markup.ts

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { a, G, k, SITE, mix, toolkit, minify, emit, W, H } from "../lib-d13-29/common.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

function accentsFor(theme) {
  const s = SITE[theme];
  return {
    water: mix(s.green, s.paper, theme === "light" ? 0.62 : 0.5),
    sand: mix(s.gold, s.paper, theme === "light" ? 0.55 : 0.45),
    pine: s.green,
    wood: s.brown,
    roof: mix(s.brown, theme === "light" ? s.ink : s.paper, theme === "light" ? 0.42 : 0.45),
    lamp: s.coral2,
    steel: theme === "light" ? s.paper : s.ink,
    ripple: { hex: s.green, mode: "ink" },
  };
}

// ---------- world ----------
const PLINTH = { x: -72, y: -42, w: 144, d: 98, r: 8 };
const WATER_Z = 0.5;
const DECK = { y0: -10, y1: 2 }; // deck width
const CABLE_Y = [-9.3, 1.3]; // planes of the two main cables, over the deck edges
const LEG_Y = [-12.6, 4.6]; // tower legs, outside the deck
const TOWER_X = [-34, 34];
const Z = { low: 13, lowT: 14.2, up: 19.6, upT: 21, top: 58, sag: 30 };
const ANCHOR_X = [-64, 64];

const fitPoints = [...k.boxCorners(PLINTH, -10, 4), [-34, -14, Z.top + 4], [34, 6, Z.top + 4], [-34, 6, Z.top + 4]];
const P = a.fitInto(fitPoints, { x: 0, y: 0, w: W, h: H }, { pad: 6, azimuth: 40 });
const T = toolkit(P);
const { at, S, L, ac, byDepth, pathOf, count, slab, cyl, stone, faceLine, faceRect, roofOf, loft } = T;
const water = ac("water");
const sand = ac("sand");
const pine = ac("pine");
const wood = ac("wood");
const roofAc = ac("roof");
const lamp = ac("lamp");
const ripple = ac("ripple");
const steel = ac("steel");

// ---------- base: plinth, bay, beach ----------
const BAY = k.insetPlan(PLINTH, 3.5);
const bay = () => water(slab(BAY, 0, WATER_Z, { tone: "lo", crease: "none" }, 6));

const BEACH = [
  [-72, 30], [-58, 32], [-40, 36], [-20, 37], [0, 40], [22, 43], [40, 46], [56, 47], [72, 47], [72, 56], [-64, 56], [-72, 48],
];
function beach() {
  const ring = BEACH.map(([x, y]) => [x, y]);
  const sandLines = [];
  return sand(count(S(k.extrude(ring, 0, 2.2, P, { convex: false }), { tone: "mid", crease: "faint", inner: sandLines.join("") })));
}

function bayDetail() {
  const clip = pathOf(k.ringOf(BAY, 6).map(([x, y]) => at([x, y, WATER_Z])), true);
  const rows = [[-60, 14, -36], [-20, 24, 6], [18, 30, 44], [-48, -30, -24], [10, -32, 34], [40, 14, 60], [-10, 14, 12]];
  const strokes = rows.map(([x0, y, x1]) => k.fadeLineSvg([at([x0, y, WATER_Z]), at([x1, y, WATER_Z])], { fade: [5, 5], tone: "mid" })).join("");
  return `<clipPath id="d27-bay"><path d="${clip}"/></clipPath><g clip-path="url(#d27-bay)">${a.amPulse(ripple(strokes), { period: 5600, delay: 1500, min: 0.25 })}</g>`;
}

// ---------- the bridge ----------
const legPlan = (x, y) => ({ x: x - 1.8, y: y - 1.8, w: 3.6, d: 3.6, r: 0 });

function caisson(x) {
  const out = [];
  const cy = (DECK.y0 + DECK.y1) / 2;
  out.push(ripple(L(k.ring(x, cy, 16, WATER_Z, P, 48), { tone: "faint" })));
  out.push(cyl(x, cy, 13, 0, 3, { tone: "mid", inner: L(k.sideArc(x, cy, 13, 1.5, P, 40), { tone: "faint" }) }, 40, 0.3));
  // Two plinths on the caisson, one under each leg.
  return out.join("");
}

function leg(x, y) {
  const out = [];
  const ticks = [];
  // Horizontal panel joints on the visible faces of the steel leg.
  for (const z of [10, 26, 34, 44]) {
    ticks.push(faceLine("x", x + 1.8, y - 1.8, z, y + 1.8, z));
    ticks.push(faceLine("y", y + 1.8, x - 1.8, z, x + 1.8, z));
  }
  out.push(slab({ x: x - 2.6, y: y - 2.6, w: 5.2, d: 5.2, r: 0 }, 3, 2, { tone: "mid" }, 2, 0.3));
  out.push(slab(legPlan(x, y), 5, Z.top - 5, { tone: "hi", inner: L(ticks.join(""), { tone: "faint" }) }, 2));
  return out.join("");
}

function beam(x, z, h) {
  return slab({ x: x - 1.4, y: LEG_Y[0] + 1.8, w: 2.8, d: LEG_Y[1] - LEG_Y[0] - 3.6, r: 0 }, z, h, { tone: "hi" }, 2);
}

// The top of a tower: a cap over both legs' tops plus the cable saddles.
function towerTop(x) {
  const out = [];
  out.push(slab({ x: x - 1.95, y: LEG_Y[0] - 2.4, w: 3.9, d: LEG_Y[1] - LEG_Y[0] + 4.8, r: 0 }, Z.top, 1.6, { tone: "hi" }, 2, 0.3));
  return out.join("");
}

function saddle(x, y) {
  return slab({ x: x - 1.6, y: y - 1.1, w: 3.2, d: 2.2, r: 0 }, Z.top + 1.6, 3.4, { tone: "hi" }, 2, 0.4);
}

// Main cable height along x.
function cableZ(x) {
  const zt = Z.top + 5;
  const [t0, t1] = TOWER_X;
  if (x >= t0 && x <= t1) {
    const u = x / t1;
    return Z.sag + (zt - Z.sag) * u * u;
  }
  const anchorX = x < t0 ? ANCHOR_X[0] : ANCHOR_X[1];
  const tx = x < t0 ? t0 : t1;
  const t = (x - tx) / (anchorX - tx);
  const za = Z.upT + 2.4;
  return zt + (za - zt) * t - 4 * t * (1 - t);
}

// The cable runs: `body` is everything away from the tower tops (drawn behind the near legs),
// `tops` the short pieces over each tower cap and saddle (drawn after the caps).
const CAP = 1.95;
function cable(y, part = "body") {
  const xs = [];
  for (let x = ANCHOR_X[0] + 2.4; x <= ANCHOR_X[1] - 2.4 + 1e-6; x += 2) xs.push(x);
  xs.push(ANCHOR_X[1] - 2.4);
  for (const t of TOWER_X) xs.push(t - CAP, t + CAP, t);
  xs.sort((p, q) => p - q);
  const near = (x) => TOWER_X.some((t) => Math.abs(x - t) <= CAP + 1e-6);
  const runs = [];
  let run = [];
  for (const x of xs) {
    const inTop = TOWER_X.some((t) => Math.abs(x - t) < CAP - 1e-6);
    const keep = part === "tops" ? near(x) : !inTop;
    if (keep) run.push(at([x, y, cableZ(x)]));
    else if (run.length) { runs.push(run); run = []; }
    if (part === "body" && near(x) && !inTop && run.length > 1 && TOWER_X.some((t) => Math.abs(x - (t - CAP)) < 1e-6)) { runs.push(run); run = []; }
  }
  if (run.length) runs.push(run);
  return runs.filter((r) => r.length > 1).map((r) => pathOf(r)).join("");
}

function hangers(y) {
  const deckEdge = y;
  const out = [];
  for (let x = ANCHOR_X[0] + 5; x < ANCHOR_X[1] - 3; x += 5) {
    if (TOWER_X.some((t) => Math.abs(x - t) < 3)) continue;
    out.push(pathOf([at([x, y, cableZ(x)]), at([x, deckEdge, Z.upT + 1.1])]));
  }
  return out.join("");
}

// Anchorage: a massive concrete block under each end of the deck, and on the deck a cable
// anchor housing where each main cable ends.
function anchorage(x) {
  const out = [];
  const x0 = x < 0 ? PLINTH.x + 3.5 : x - 6;
  const x1 = x < 0 ? x + 6 : PLINTH.x + PLINTH.w - 3.5;
  const plan = { x: x0, y: LEG_Y[0] - 1, w: x1 - x0, d: LEG_Y[1] - LEG_Y[0] + 2, r: 0 };
  out.push(slab(plan, 0, Z.low, { tone: "mid", inner: L(k.sideSeam(plan, 6, P, 2), { tone: "faint" }) }, 2, 0.3));
  return out.join("");
}

function anchorHousing(x, y) {
  const h = cableZ(x < 0 ? x + 2.4 : x - 2.4) - Z.upT;
  return slab({ x: x - 2.4, y: y - 1.1, w: 4.8, d: 2.2, r: 0 }, Z.upT, h, { tone: "hi" }, 2);
}

// The double deck: lower deck, the stiffening truss (its near side drawn as a panel of Warren
// diagonals), the upper deck and its parapets.
function deck() {
  const out = [];
  const x0 = PLINTH.x;
  const x1 = PLINTH.x + PLINTH.w;
  const plan = { x: x0, y: DECK.y0, w: x1 - x0, d: DECK.y1 - DECK.y0, r: 0 };
  out.push(slab(plan, Z.low, Z.lowT - Z.low, { tone: "mid" }, 2));
  // Truss: an open girder; the near face carries the diagonals and verticals.
  const tr = [];
  const yF = DECK.y1;
  const pitch = 5;
  for (let x = x0; x < x1 - 1e-6; x += pitch) {
    const xa = x;
    const xb = Math.min(x + pitch, x1);
    tr.push(faceLine("y", yF, xa, Z.lowT, (xa + xb) / 2, Z.up));
    tr.push(faceLine("y", yF, (xa + xb) / 2, Z.up, xb, Z.lowT));
  }
  // The end faces (+x) show the two decks' sections.
  out.push(slab({ ...plan, y: DECK.y0 + 0.5, d: plan.d - 1 }, Z.lowT, Z.up - Z.lowT, { tone: "lo", inner: L(tr.join(""), { tone: "mid" }) }, 2));
  out.push(slab({ ...plan, x: x0, w: x1 - x0 }, Z.up, Z.upT - Z.up, { tone: "hi", inner: L(pathOf([at([x0, (DECK.y0 + DECK.y1) / 2, Z.upT]), at([x1, (DECK.y0 + DECK.y1) / 2, Z.upT])]), { tone: "faint" }) }, 2));
  return out.join("");
}

function parapet(y) {
  return slab({ x: PLINTH.x, y: y - 0.35, w: PLINTH.w, d: 0.7, r: 0 }, Z.upT, 1.1, { tone: "hi" }, 2);
}

// Aircraft-warning lights on the tower tops, blinking out of phase.
function lights() {
  const out = [];
  const sk = G.scaleOf(P);
  TOWER_X.forEach((x, i) => {
    for (const y of LEG_Y) {
      const p = at([x, y, Z.top + 1.6]);
      out.push(a.amBlink(`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${(2.6 * sk).toFixed(1)}" style="fill:var(--anatomy-face);stroke:none;filter:blur(${(1.1 * sk).toFixed(1)}px)"/>`, { period: 3000, delay: i * 1500, min: 0.1 }));
    }
  });
  return lamp(out.join(""));
}

// ---------- the beach, pines and a yakatabune ----------
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

// A yakatabune: a long low hull, a cabin with paper windows and a dark roof, lanterns along the eave.
function yakatabune(x, y) {
  const out = [];
  const hull = [];
  const L0 = 24;
  const B = 6;
  const n = 14;
  // Hull plan: pointed bow (+x end), square stern.
  const plan = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const xx = x - L0 / 2 + t * L0;
    const w = t < 0.75 ? B / 2 : (B / 2) * Math.sqrt(Math.max(0, 1 - ((t - 0.75) / 0.25) ** 2));
    plan.push([xx, y - w]);
  }
  for (let i = n; i >= 0; i--) {
    const t = i / n;
    const xx = x - L0 / 2 + t * L0;
    const w = t < 0.75 ? B / 2 : (B / 2) * Math.sqrt(Math.max(0, 1 - ((t - 0.75) / 0.25) ** 2));
    plan.push([xx, y + w]);
  }
  const uniq = plan.filter((p, i) => i === 0 || Math.hypot(p[0] - plan[i - 1][0], p[1] - plan[i - 1][1]) > 1e-6);
  out.push(ripple(L(k.ring(x + 2, y, 15, WATER_Z, P, 48), { tone: "faint" })));
  out.push(wood(count(S(k.extrude(uniq.slice(0, -1), WATER_Z, 2.4, P, { convex: true }), { tone: "hi", inner: L(k.ringSeam(uniq.slice(0, -1), WATER_Z + 1.6, P), { tone: "lo" }) }))));
  const cab = { x: x - 10, y: y - 2.3, w: 15, d: 4.6, r: 0 };
  const wins = [];
  for (let u = cab.x + 1; u < cab.x + cab.w - 1; u += 2.2) wins.push(faceRect("y", cab.y + cab.d, u, u + 1.6, WATER_Z + 3.4, WATER_Z + 5.4));
  out.push(count(S(k.slabOf(cab, WATER_Z + 2.4, 3.8, P, 2), { tone: "mid", inner: L(wins.join(""), { tone: "lo" }) })));
  const r = roofOf(cab, 1.4, WATER_Z + 6.2, { x: cab.x + 1.5, y: y - 0.4, w: cab.w - 3, d: 0.8 }, WATER_Z + 8, { lift: 0.4, flare: 0.3, fascia: 0.5, n: 4 });
  out.push(roofAc(count(S(r.paths, { tone: "hi" }))));
  // Red lanterns under the near eave.
  const sk = G.scaleOf(P);
  const lan = [];
  for (let u = cab.x + 2; u < cab.x + cab.w - 1; u += 4) {
    const p = at([u, cab.y + cab.d + 1, WATER_Z + 5.6]);
    lan.push(`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${(0.7 * sk).toFixed(1)}" style="fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:var(--anatomy-weight)"/>`);
  }
  out.push(lamp(lan.join("")));
  return out.join("");
}

// ---------- assemble ----------
const farY = CABLE_Y[0];
const nearY = CABLE_Y[1];
const body = minify([
  T.plinth(PLINTH),
  bay(),
  bayDetail(),
  yakatabune(-30, 20),
  caisson(TOWER_X[0]),
  caisson(TOWER_X[1]),
  anchorage(ANCHOR_X[0]),
  anchorage(ANCHOR_X[1]),
  steel(leg(TOWER_X[0], LEG_Y[0])),
  steel(leg(TOWER_X[1], LEG_Y[0])),
  steel(beam(TOWER_X[0], Z.low - 3, 3)),
  steel(beam(TOWER_X[1], Z.low - 3, 3)),
  steel(deck()),
  steel(parapet(DECK.y0 + 0.35)),
  steel(anchorHousing(ANCHOR_X[0], farY)),
  steel(anchorHousing(ANCHOR_X[1], farY)),
  steel(beam(TOWER_X[0], 38, 3.4)),
  steel(beam(TOWER_X[1], 38, 3.4)),
  steel(beam(TOWER_X[0], Z.top - 4, 4)),
  steel(beam(TOWER_X[1], Z.top - 4, 4)),
  steel(L(cable(farY) + hangers(farY), { tone: "hi" })),
  steel(parapet(DECK.y1 - 0.35)),
  steel(anchorHousing(ANCHOR_X[0], nearY)),
  steel(anchorHousing(ANCHOR_X[1], nearY)),
  steel(L(cable(nearY) + hangers(nearY), { tone: "hi" })),
  steel(leg(TOWER_X[0], LEG_Y[1])),
  steel(leg(TOWER_X[1], LEG_Y[1])),
  steel(towerTop(TOWER_X[0])),
  steel(towerTop(TOWER_X[1])),
  steel(L(cable(farY, "tops") + cable(nearY, "tops"), { tone: "hi" })),
  steel(saddle(TOWER_X[0], farY) + saddle(TOWER_X[1], farY)),
  steel(saddle(TOWER_X[0], nearY) + saddle(TOWER_X[1], nearY)),
  lights(),
  beach(),
  pineTree(-52, 46, 2.2, 0.9),
  pineTree(30, 51, 2.2, 0.8),
  sand(stone(-20, 44, 2.4, 1.8, 2.2, 3)),
].join(""));

emit({
  nn: "27",
  here: HERE,
  body,
  label: "The Rainbow Bridge over Tokyo Bay in isometric view: a double-deck suspension bridge on two white towers, with the Odaiba beach and a pleasure boat in front.",
  subject: "Rainbow Bridge",
  accentsFor,
  jsdoc: ["Rainbow Bridge isométrico (día 27): el puente colgante de doble tablero sobre la bahía de", "Tokio, con la playa de Odaiba y un yakatabune. El agua respira y las balizas de las torres", "parpadean (CSS)."],
  solids: T.stats.solids,
});
