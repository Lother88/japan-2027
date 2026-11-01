// Day 15 — Kanazawa, Kenroku-en: the Kotoji-tōrō, the two-legged stone lantern at the edge of the
// Kasumiga-ike pond, one long leg standing in the water and the short one on a shore rock, with
// a black pine behind it wrapped for winter in yukizuri ropes (a pole above the crown, straw
// ropes fanned down to every branch). Diorama on the pilot's plinth: moss garden at the back,
// the pond in front; the lantern's reflection breathes and a ripple ring pulses (CSS only).
//
//   node build.mjs → day15-light/dark .svg/.html here, ../out/day15Iso.markup.ts

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as $ from "../lib-d15-19.mjs";

const { mix, k, a, G, W, H, at, S, L, D, ac, depth, byDepth, pathOf, count, slab, cyl, stone, pad, plinth, polySolid, halo, minify, emit } = $;
const HERE = dirname(fileURLToPath(import.meta.url));

function accentsFor(theme) {
  const b = $.baseAccents(theme);
  const s = $.SITE[theme];
  return {
    water: b.water, moss: b.moss, pine: b.pine, wood: b.wood, ripple: b.ripple,
    rope: { hex: theme === "light" ? s.gold : s.amber, mode: "ink" },
    // Weathered granite for the lantern: a grey from the ink, lighter than the night page.
    granite: theme === "light" ? mix(s.ink, s.paper, 0.72) : mix(s.ink, s.paper, 0.3),
  };
}
const water = ac("water");
const moss = ac("moss");
const pine = ac("pine");
const wood = ac("wood");
const rope = ac("rope");
const ripple = ac("ripple");
const granite = ac("granite");

// ---------- world ----------
const PLINTH = { x: -68, y: -64, w: 146, d: 136, r: 8 };
const WATER_Z = 0.5;
const LAND_Z = 4;
// The lantern: its centre, the direction its legs splay (toward the pond), heights.
const LC = [10, -14];
// Legs splay across the view (screen left/right), so both read: short on the shore, long in the pond.
const LU = G.unit3([0.64, -0.77, 0]);
const LZ = { rock: 8, table: 25, box: 27.4, eave: 37, apex: 44 };
const PINE = [-46, -14];
const POLE_TOP = 60;

const fitPoints = [
  ...k.boxCorners(PLINTH, -10, 4),
  [PINE[0], PINE[1], POLE_TOP + 2],
  [LC[0], LC[1], LZ.apex + 8],
  [PINE[0] - 22, PINE[1], 30], [PINE[0], PINE[1] - 22, 30], [PINE[0] + 22, PINE[1] + 22, 30],
];
const P = a.fitInto(fitPoints, { x: 0, y: 0, w: W, h: H }, { pad: 6, azimuth: 40 });
$.setProjection(P);

// ---------- polygon rings (hexagonal lantern parts) ----------
function polyRing(cx, cy, R, m, z, { rot = 0, n = 1, lift = 0, flare = 0 } = {}) {
  const corners = Array.from({ length: m }, (_, i) => {
    const t = rot + (i / m) * Math.PI * 2;
    return [Math.cos(t), Math.sin(t)];
  });
  const pts = [];
  for (let i = 0; i < m; i++) {
    const A = corners[i];
    const B = corners[(i + 1) % m];
    for (let j = 0; j < n; j++) {
      const t = j / n;
      const w = Math.abs(2 * t - 1) ** 4;
      const ux = A[0] + (B[0] - A[0]) * t;
      const uy = A[1] + (B[1] - A[1]) * t;
      const rr = R + flare * w;
      pts.push([cx + ux * rr, cy + uy * rr, z + lift * w]);
    }
  }
  return pts;
}

// A hexagonal umbrella cap (kasa): eave ring with a thin edge, corners lifted, up to a small top.
function kasaOf(cx, cy, R, zEave, rIn, zIn, { rot = 0, lift = 1.2, flare = 0.8, edge = 1.2, n = 6 } = {}) {
  const A = polyRing(cx, cy, R, 6, zEave, { rot, n, lift, flare });
  const B = polyRing(cx, cy, R, 6, zEave + edge, { rot, n, lift, flare });
  const C = polyRing(cx, cy, rIn, 6, zIn, { rot, n });
  const Dr = polyRing(cx, cy, R * 0.55, 6, zEave, { rot, n });
  const N = A.length;
  const faces = [];
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N;
    const mid = [(A[i][0] + A[j][0]) / 2 - cx, (A[i][1] + A[j][1]) / 2 - cy, 0];
    const side = Math.floor(i / n);
    faces.push({ pts: [A[i], A[j], B[j], B[i]], hint: mid, group: `edge${side}` });
    faces.push({ pts: [B[i], B[j], C[j], C[i]], hint: [mid[0] * 0.02, mid[1] * 0.02, 1], group: `slope${side}` });
    faces.push({ pts: [A[i], A[j], Dr[j], Dr[i]], hint: [0, 0, -1] });
  }
  faces.push({ pts: C, hint: [0, 0, 1] });
  faces.push({ pts: Dr, hint: [0, 0, -1] });
  return { paths: polySolid(faces), B, C, n };
}

// ---------- base ----------
const POND = k.insetPlan(PLINTH, 3.5);
// The moss garden behind the shore: flush with the plinth at the back, a winding shoreline.
const LAND = [
  [-68, -57], [-61, -64], [71, -64], [78, -57], [78, -50], [60, -45], [40, -41], [24, -36], [15, -24],
  [10, -14], [6, -5], [-2, -1], [-11, 2], [-16, 10], [-22, 26], [-33, 40], [-41, 56], [-45, 72], [-68, 72],
];

function pond() {
  return water(slab(POND, 0, WATER_Z, { tone: "lo", crease: "none" }, 6));
}
function land() {
  return moss(count(S(k.extrude(LAND, 0, LAND_Z, P, { convex: false }), { tone: "mid", crease: "faint" })));
}

// The lantern mirrored in the pond: hulls of its parts, clipped to the water, breathing.
function reflection() {
  const mirror = (p) => [p[0], p[1], 2 * WATER_Z - p[2]];
  const hull = (pts) => pathOf(G.hullOf(pts.map((p) => at(mirror(p)))), true);
  const [cx, cy] = LC;
  const ringPts = (R, z) => polyRing(cx, cy, R, 6, z, { rot: 0.26 });
  const legTop = [cx + LU[0] * 4.4, cy + LU[1] * 4.4];
  const legBot = [cx + LU[0] * 12, cy + LU[1] * 12];
  const pieces = [
    hull([...ringPts(16.5, LZ.eave), ...ringPts(2, LZ.apex + 7)]),
    hull([...ringPts(6, LZ.box), ...ringPts(6, LZ.eave)]),
    hull([...ringPts(11, LZ.table), ...ringPts(11, LZ.table + 2.2)]),
    hull([[legTop[0] - 1.4, legTop[1], LZ.table], [legTop[0] + 1.4, legTop[1], LZ.table], [legBot[0] - 1.8, legBot[1], WATER_Z], [legBot[0] + 1.8, legBot[1], WATER_Z]]),
  ];
  const fills = pieces.map((d, i) => `<path d="${d}" style="fill:var(--anatomy-${i === 0 ? "shade-0" : "shade-2"});stroke:none"/>`).join("");
  const clip = pathOf(k.ringOf(POND, 6).map(([x, y]) => at([x, y, WATER_Z])), true);
  const strokes = [];
  for (const [x, y0, y1] of [[20, -12, 6], [28, -6, 14], [36, -14, -2]]) strokes.push(k.fadeLineSvg([at([x, y0, WATER_Z]), at([x, y1, WATER_Z])], { fade: [5, 5], tone: "mid" }));
  return `<clipPath id="d15-pond"><path d="${clip}"/></clipPath><g clip-path="url(#d15-pond)"><g opacity=".5">${water(a.amPulse(fills, { period: 7000, min: 0.7 }))}</g>${a.amPulse(ripple(strokes.join("")), { period: 5200, delay: 1700, min: 0.25 })}</g>`;
}

// Ripple rings where the long leg stands in the water (drawn before the leg, which covers them).
function legRipples() {
  const x = LC[0] + LU[0] * 12;
  const y = LC[1] + LU[1] * 12;
  const inner = L(k.ring(x, y, 4.2, WATER_Z, P, 36), { tone: "faint" });
  const outer = L(k.ring(x, y, 7.4, WATER_Z, P, 48), { tone: "faint" });
  return ripple(inner + outer);
}

function shoreStones() {
  const list = [
    [70, -48, 3, 2.6], [50, -43, 2.6, 2.4], [30, -38, 3.2, 2.8], [19, -31, 2.4, 2.2], [-6, 0, 2.6, 2.4], [-14, 6, 2.2, 2],
    [-17, 19, 3, 2.8], [-28, 33, 2.6, 2.4], [-38, 48, 3.2, 2.8], [-44, 64, 2.6, 2.4],
  ];
  return byDepth(list, (s) => [s[0], s[1], 0]).map(([x, y, r, h], i) => stone(x, y, r, h, 0, i + 2)).join("");
}

// Stepping stones across the shallows, and Hōrai-jima: a mossy islet with a low pine.
function islet() {
  const out = [];
  const IX = 12;
  const IY = 46;
  out.push(ripple(L([k.ring(IX, IY, 16.5, WATER_Z, P, 48), k.ring(IX, IY, 20.5, WATER_Z, P, 56)].join(""), { tone: "faint" })));
  const ring = G.hullOf(Array.from({ length: 10 }, (_, i) => {
    const t = (i / 10) * Math.PI * 2;
    const rr = 12 * (0.85 + 0.15 * Math.sin(i * 2.3));
    return [IX + Math.cos(t) * rr * 1.25, IY + Math.sin(t) * rr];
  }));
  out.push(moss(count(S(k.extrude(ring, 0, 2.6, P, { bevel: 0.5 }), { tone: "mid", inner: L(k.ringSeam(ring, 1.3, P), { tone: "faint" }) }))));
  out.push(stone(IX - 9, IY - 2, 3, 2.6, 2.6, 7));
  // A low, spreading pine: short trunk, three pads.
  const tx = IX + 2;
  const ty = IY - 1;
  out.push(halo({ x: tx - 9, y: ty - 9, w: 18, d: 18, r: 9 }, 2.6, 0.1, 3));
  const pads = [[tx - 4, ty + 3, 7, 4.4], [tx + 5, ty - 2, 8.5, 4.6], [tx, ty, 12, 5.2]];
  out.push(wood(L(pads.slice(0, 2).map(([x, y, z]) => k.segment([tx, ty, z - 2], [x, y, z + 0.6], P)).join(""), { tone: "hi" })));
  out.push(pine(pad(pads[0][0], pads[0][1], 2.6 + pads[0][2], pads[0][3])));
  out.push(wood(cyl(tx, ty, 1.3, 2.6, 10, { tone: "hi" }, 12)));
  out.push(pine(pad(pads[1][0], pads[1][1], 2.6 + pads[1][2], pads[1][3])));
  out.push(pine(pad(pads[2][0], pads[2][1], 2.6 + pads[2][2], pads[2][3])));
  out.push(stone(IX + 8, IY + 7, 2.4, 2, 2.6, 9));
  out.push(stone(IX - 3, IY + 9, 2.2, 1.8, 2.6, 11));
  return out.join("");
}

function steppingStones() {
  const list = [[-6, 14, 3], [-3, 21, 2.6], [1, 27.5, 2.8]];
  return byDepth(list, (s) => [s[0], s[1], 0]).map(([x, y, r], i) => stone(x, y, r, 1.6, 0, i + 13)).join("");
}

// Clipped satsuki azalea mounds on the moss.
function shrubs() {
  const list = [[-14, -34, 6], [6, -50, 5], [24, -56, 6.5], [56, -55, 5], [-58, 20, 5.5], [-54, 44, 5], [-24, -54, 5]];
  return byDepth(list, (s) => [s[0], s[1], 0]).map(([x, y, r]) =>
    halo({ x: x - r, y: y - r, w: 2 * r, d: 2 * r, r }, LAND_Z, 0.1, 3) +
    pine(count(S(k.cylinder(x, y, r, LAND_Z, 2.6, P, 22, 0.5), { tone: "hi", inner: L(k.sideArc(x, y, r, LAND_Z + 1.3, P, 22), { tone: "faint" }) })) +
      count(S(k.cylinder(x + 0.3, y - 0.3, r * 0.7, LAND_Z + 2.6, 1.6, P, 18, 0.4), { tone: "hi" })))).join("");
}

// ---------- the yukizuri pine ----------
function yukizuriPine() {
  const [x, y] = PINE;
  const z = LAND_Z;
  const out = [halo({ x: x - 23, y: y - 23, w: 46, d: 46, r: 23 }, z, 0.1, 5)];
  const trunk = [[0, 0, 0], [1.6, 0.7, 7], [2.5, 1.1, 14], [1.4, 0.6, 21], [0, 0, 27]].map(([dx, dy, dz]) => [x + dx, y + dy, z + dz]);
  const tiers = [
    ...[0, 1, 2, 3, 4].map((i) => ({ ang: -0.4 + (i / 5) * Math.PI * 2, ring: 14.5, dz: 10, r: 7.2 })),
    ...[0, 1, 2].map((i) => ({ ang: 0.6 + (i / 3) * Math.PI * 2, ring: 7, dz: 19, r: 6 })),
    { ang: 0, ring: 0, dz: 28, r: 6.4 },
  ].map((p) => ({ ...p, c: [x + Math.cos(p.ang) * p.ring, y + Math.sin(p.ang) * p.ring, z + p.dz] }));
  const branches = tiers.slice(0, 8).map((p) => {
    const from = trunk[Math.min(3, Math.round(p.dz / 7))];
    return k.segment([from[0], from[1], p.c[2] - 1.4], [p.c[0], p.c[1], p.c[2] + 0.6], P);
  });
  out.push(wood(L(branches.join(""), { tone: "hi" })));
  const apex = [x, y, z + POLE_TOP - LAND_Z];
  // Ropes: from the pole's top to the outer rim of every lower and middle pad.
  const ropes = [];
  for (const p of tiers.slice(0, 8)) {
    const offs = p.ring > 10 ? [-0.5, 0, 0.5] : [0];
    for (const o of offs) {
      const t = p.ang + o;
      const end = [p.c[0] + Math.cos(t) * (p.r - 0.15), p.c[1] + Math.sin(t) * (p.r - 0.15), p.c[2] + 1.3];
      ropes.push({ end, d: pathOf([at(apex), at(end)]) });
    }
  }
  const trunkDepth = depth(trunk[2]);
  const back = (p) => depth(p.c) < trunkDepth;
  const padSvg = (p) => pine(pad(p.c[0], p.c[1], p.c[2], p.r));
  const low = byDepth(tiers.slice(0, 5), (p) => p.c);
  const mid = byDepth(tiers.slice(5, 8), (p) => p.c);
  for (const p of low) if (back(p)) out.push(padSvg(p));
  out.push(rope(L(ropes.filter((r) => depth(r.end) < trunkDepth).map((r) => r.d).join(""), { tone: "mid" })));
  for (let i = 0; i < trunk.length - 1; i++) {
    const [px, py, pz] = trunk[i];
    out.push(wood(cyl(px, py, 2.3 - i * 0.3, pz, trunk[i + 1][2] - pz + 0.4, { tone: "hi" }, 14)));
  }
  for (const p of mid) out.push(padSvg(p));
  out.push(padSvg(tiers[8]));
  // The pole (shin-bashira) rising out of the crown, with its binding at the top.
  out.push(wood(cyl(x, y, 0.75, tiers[8].c[2] + 1.6, apex[2] - tiers[8].c[2] - 1.6, { tone: "hi" }, 10)));
  for (const p of low) if (!back(p)) out.push(padSvg(p));
  out.push(rope(L(ropes.filter((r) => depth(r.end) >= trunkDepth).map((r) => r.d).join(""), { tone: "mid" })));
  out.push(rope(D([at(apex)], { size: 1.1, tone: "hi" })));
  out.push(rope(L(k.segment([x, y, apex[2]], [x, y, apex[2] + 2.2], P), { tone: "hi" })));
  out.push(rope(D([at([x, y, apex[2] + 2.2])], { size: 0.7, tone: "hi" })));
  return out.join("");
}

// ---------- the Kotoji-tōrō ----------
// A leg with horizontal ends: an oblique truncated cone from a ring on the ground (or the
// water surface) to a ring under the table, so it meets both planes on a true waterline.
function leg(from, to, r0, r1, steps = 16) {
  const ring = (c, r) => Array.from({ length: steps }, (_, i) => {
    const t = (i / steps) * Math.PI * 2;
    return [c[0] + Math.cos(t) * r, c[1] + Math.sin(t) * r, c[2]];
  });
  const A = ring(from, r0);
  const B = ring(to, r1);
  const faces = [];
  for (let i = 0; i < steps; i++) {
    const j = (i + 1) % steps;
    const t = ((i + 0.5) / steps) * Math.PI * 2;
    faces.push({ pts: [A[i], A[j], B[j], B[i]], hint: [Math.cos(t), Math.sin(t), 0] });
  }
  faces.push({ pts: A, hint: [0, 0, -1] });
  faces.push({ pts: B, hint: [0, 0, 1] });
  return count(S(polySolid(faces, { creaseCos: 0.5 }), { tone: "mid" }));
}

// A faceted boulder: an irregular ring, a shoulder and a smaller top.
function boulder(cx, cy, r, h, z, seed) {
  const m = 9;
  const jag = (i, o) => 0.82 + 0.18 * Math.abs(Math.sin(seed * 2.7 + i * 1.9 + o));
  const ringAt = (k2, zz, o) => Array.from({ length: m }, (_, i) => {
    const t = (i / m) * Math.PI * 2 + o * 0.2;
    const rr = r * k2 * jag(i, o);
    return [cx + Math.cos(t) * rr * 1.1, cy + Math.sin(t) * rr, zz];
  });
  const rings = [ringAt(1, z, 0), ringAt(0.94, z + h * 0.5, 1), ringAt(0.62, z + h, 2)];
  const faces = [];
  for (let k2 = 0; k2 < 2; k2++) {
    const A = rings[k2];
    const B = rings[k2 + 1];
    for (let i = 0; i < m; i++) {
      const j = (i + 1) % m;
      const t = ((i + 0.5) / m) * Math.PI * 2;
      faces.push({ pts: [A[i], A[j], B[j], B[i]], hint: [Math.cos(t), Math.sin(t), k2 * 0.6] });
    }
  }
  faces.push({ pts: rings[0], hint: [0, 0, -1] });
  faces.push({ pts: rings[2], hint: [0, 0, 1] });
  return count(S(polySolid(faces, { creaseCos: 0.9 }), { tone: "mid" }));
}

function lantern() {
  const [cx, cy] = LC;
  const out = [];
  const g = (svg) => granite(svg);
  const rot = 0.26;
  // The shore rock carrying the short leg.
  const sb = [cx - LU[0] * 9, cy - LU[1] * 9];
  out.push(halo({ x: sb[0] - 8, y: sb[1] - 8, w: 16, d: 16, r: 8 }, LAND_Z, 0.1, 2));
  out.push(boulder(sb[0], sb[1], 7.6, LZ.rock - 0.4, 0.4, 5));
  // Legs: the short one on the rock, the long one in the water, both splayed.
  const topShort = [cx - LU[0] * 4.2, cy - LU[1] * 4.2, LZ.table + 0.4];
  const topLong = [cx + LU[0] * 4.4, cy + LU[1] * 4.4, LZ.table + 0.4];
  const botLong = [cx + LU[0] * 12, cy + LU[1] * 12, WATER_Z];
  out.push(leg([sb[0] + 0.3, sb[1] - 0.2, LZ.rock - 0.6], topShort, 2.2, 1.6));
  out.push(legRipples());
  out.push(leg(botLong, topLong, 2.4, 1.6));
  // The table (naka-dai), the light box (hibukuro) with its windows, the cap and the jewel.
  const table = polyRing(cx, cy, 11, 6, 0, { rot }).map(([x, y]) => [x, y]);
  out.push(count(S(k.extrude(table, LZ.table, 2.2, P, { bevel: 0.4 }), { tone: "mid", inner: L(k.ringSeam(table, LZ.table + 1.1, P), { tone: "faint" }) })));
  const base = polyRing(cx, cy, 7.4, 6, 0, { rot }).map(([x, y]) => [x, y]);
  out.push(count(S(k.extrude(base, LZ.table + 2.2, LZ.box - LZ.table - 2.2, P, { bevel: 0.3 }), { tone: "mid" })));
  const boxRing = polyRing(cx, cy, 6, 6, 0, { rot }).map(([x, y]) => [x, y]);
  const V = G.viewOf(P);
  const windows = [];
  for (let i = 0; i < 6; i++) {
    const p = boxRing[i];
    const q = boxRing[(i + 1) % 6];
    const n = [(p[0] + q[0]) / 2 - cx, (p[1] + q[1]) / 2 - cy, 0];
    if (G.dot3(n, V) <= 0.05) continue;
    const pt = (t, z) => at([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, z]);
    // A tall window on alternate faces, a round-topped lattice on the others.
    if (i % 2 === 0) windows.push(pathOf([pt(0.28, LZ.box + 1.2), pt(0.72, LZ.box + 1.2), pt(0.72, LZ.eave - 1.4), pt(0.28, LZ.eave - 1.4)], true));
    else {
      const ring = [];
      for (let j = 0; j <= 12; j++) {
        const th = (j / 12) * Math.PI * 2;
        ring.push(pt(0.5 + Math.cos(th) * 0.18, (LZ.box + LZ.eave) / 2 + Math.sin(th) * 1.6));
      }
      windows.push(pathOf(ring, true));
    }
  }
  out.push(count(S(k.extrude(boxRing, LZ.box, LZ.eave - LZ.box, P), { tone: "mid", inner: L(windows.join(""), { tone: "hi" }) })));
  const kasa = kasaOf(cx, cy, 16.5, LZ.eave, 2.6, LZ.apex, { rot, lift: 2, flare: 1.6, edge: 1.5 });
  // Ridges from each corner to the top, on the cap's slope.
  const ridges = [];
  for (let s = 0; s < 6; s++) {
    const i = s * kasa.n;
    const mid = G.lerp3(kasa.B[i], kasa.C[i], 0.5);
    if (depth(mid) < depth([cx, cy, LZ.apex]) - 4) continue;
    ridges.push(pathOf([at(kasa.B[i]), at(kasa.C[i])]));
  }
  out.push(count(S(kasa.paths, { tone: "mid", inner: L(ridges.join(""), { tone: "faint" }) })));
  // The jewel (hōju) on its lotus seat.
  const up = G.frameOf([cx, cy, LZ.apex], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
  out.push(count(S(G.solidOf([[0, 2.9], [1.4, 2.9]], up, P), { tone: "mid" })));
  out.push(count(S(G.solidOf([[1.4, 1.9], [2.1, 3, 1], [3.8, 3.2, 1], [5.4, 2.3, 1], [6.6, 1, 1], [7.5, 0.05]], up, P), { tone: "mid" })));
  return g(out.join(""));
}

// ---------- assemble ----------
const body = minify([
  plinth(PLINTH),
  pond(),
  reflection(),
  land(),
  shoreStones(),
  shrubs(),
  yukizuriPine(),
  steppingStones(),
  lantern(),
  islet(),
].join(""));

emit({
  day: 15,
  here: HERE,
  title: "Kotoji-tōrō de Kenroku-en",
  subject: "Linterna Kotoji-tōrō de Kenroku-en",
  label: "Kenroku-en in Kanazawa, in isometric view: the two-legged Kotoji stone lantern at the edge of the pond, with a pine wrapped in yukizuri ropes behind it.",
  body,
  accentsFor,
});
