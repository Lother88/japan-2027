// Day 29 — Narita, the flight home: a twin-engine airliner parked at its gate, as an
// isometric diorama matching the day-21 pilot. A concrete apron plinth with painted stand
// markings and a grass strip; at the back the terminal's glass facade with a jet bridge
// (rotunda, tunnel, wheeled leg and cab) docked at the forward door; the airliner (plain, no
// livery or text) with swept wings, under-wing engines on pylons, landing gear, fin and
// tailplane; the control tower with its flared glass cab; a baggage tug with carts. The red
// beacons on the tower and on the airliner blink (CSS only, stopped under
// prefers-reduced-motion).
//
//   node build.mjs  → day29-light.svg/.html, day29-dark.svg/.html, ../out/day29Iso.markup.ts

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { a, G, k, SITE, mix, toolkit, minify, emit, clippedPlan, W, H } from "../lib-d13-29/common.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

function accentsFor(theme) {
  const s = SITE[theme];
  return {
    steel: theme === "light" ? s.paper : s.ink,
    glass: theme === "light" ? mix(s.ink, s.paper, 0.6) : mix(s.ink, s.paper, 0.62),
    paint: theme === "light" ? s.gold : s.gold,
    moss: mix(s.green, s.paper, theme === "light" ? 0.4 : 0.25),
    lamp: s.coral2,
  };
}

// ---------- world ----------
const PLINTH = { x: -62, y: -46, w: 116, d: 90, r: 8 };
const APRON_Z = 2;
const GRASS_Y = 36;
const YC = 6; // fuselage centreline
const R = 3.7; // fuselage radius
const ZC = APRON_Z + 4.2 + R; // fuselage axis height
const NOSE = -38;
const TAIL = 38;

const fitPoints = [...k.boxCorners(PLINTH, -10, APRON_Z), [44, -36, APRON_Z + 52], [-60, -42, APRON_Z + 22], [40, YC, ZC + 15]];
const P = a.fitInto(fitPoints, { x: 0, y: 0, w: W, h: H }, { pad: 6, azimuth: 40 });
const T = toolkit(P);
const { at, S, L, D, ac, byDepth, pathOf, count, slab, cyl, faceLine, faceRect, loft, polySolid } = T;
const steel = ac("steel");
const glass = ac("glass");
const paint = ac("paint");
const moss = ac("moss");
const lamp = ac("lamp");
const V = G.viewOf(P);
const sk = G.scaleOf(P);

// ---------- apron ----------
function apron() {
  const out = [];
  const plan = clippedPlan(PLINTH, { yMax: GRASS_Y });
  // Expansion joints: a grid of concrete bays, joints ending on the apron edges.
  const joints = [];
  for (let x = -42; x < 54; x += 20) joints.push(pathOf([at([x, PLINTH.y, APRON_Z]), at([x, GRASS_Y, APRON_Z])]));
  for (let y = -26; y < GRASS_Y; y += 20) joints.push(pathOf([at([PLINTH.x, y, APRON_Z]), at([PLINTH.x + PLINTH.w, y, APRON_Z])]));
  out.push(count(S(k.extrude(plan, 0, APRON_Z, P, { convex: true }), { tone: "mid", inner: L(joints.join(""), { tone: "faint" }) })));
  const grass = clippedPlan(PLINTH, { yMin: GRASS_Y });
  out.push(moss(count(S(k.extrude(grass, 0, APRON_Z, P, { convex: true }), { tone: "mid" }))));
  // Stand markings: the lead-in line, the stand's safety boundary and the nose stop bar.
  const marks = [];
  const z = APRON_Z;
  marks.push(pathOf([[PLINTH.x + PLINTH.w, YC], [NOSE - 2, YC]].map(([x, y]) => at([x, y, z]))));
  marks.push(pathOf([[PLINTH.x + PLINTH.w, -30], [-42, -30], [-42, 33], [PLINTH.x + PLINTH.w, 33]].map(([x, y]) => at([x, y, z]))));
  marks.push(pathOf([[NOSE - 2, YC - 3], [NOSE - 1.2, YC - 3], [NOSE - 1.2, YC + 3], [NOSE - 2, YC + 3]].map(([x, y]) => at([x, y, z])), true));
  // Lead-in line: the stop bar closes it, so it ends on a shape.
  out.push(paint(L(marks.join(""), { tone: "mid" })));
  return out.join("");
}

// ---------- terminal and jet bridge ----------
function terminal() {
  const out = [];
  const plan = { x: -60, y: -42, w: 13, d: 76, r: 0 };
  const xf = plan.x + plan.w;
  const yf = plan.y + plan.d;
  const zt = APRON_Z + 18;
  // Glass curtain wall on the apron face: mullions and transoms.
  const g = [];
  for (let y = plan.y + 4; y < yf - 1; y += 4) g.push(faceLine("x", xf, y, APRON_Z, y, zt - 2));
  for (const z of [APRON_Z + 6, APRON_Z + 11, zt - 2]) g.push(faceLine("x", xf, plan.y, z, yf, z));
  for (let x = plan.x + 4; x < xf - 1; x += 4) g.push(faceLine("y", yf, x, APRON_Z, x, zt - 2));
  for (const z of [APRON_Z + 6, APRON_Z + 11, zt - 2]) g.push(faceLine("y", yf, plan.x, z, xf, z));
  out.push(glass(slab(plan, APRON_Z, zt - APRON_Z, { tone: "mid", inner: L(g.join(""), { tone: "lo" }) }, 2)));
  // Roof with a deep canopy over the apron side.
  out.push(steel(slab({ x: plan.x - 1, y: plan.y - 1, w: plan.w + 6, d: plan.d + 2.5, r: 0 }, zt, 1.4, { tone: "hi" }, 2, 0.3)));
  out.push(slab({ x: plan.x + 3, y: plan.y + 18, w: 7, d: 12, r: 0 }, zt + 1.4, 2.2, { tone: "mid" }, 2, 0.2));
  out.push(slab({ x: plan.x + 3, y: plan.y + 54, w: 7, d: 9, r: 0 }, zt + 1.4, 2.2, { tone: "mid" }, 2, 0.2));
  return out.join("");
}

function jetBridge() {
  const out = [];
  const zb = ZC - 1.6; // floor of the tunnel, at the door sill
  const yT = [-6.6, -3.4];
  // Fixed link from the terminal and the rotunda column.
  out.push(steel(slab({ x: -47, y: yT[0] - 0.4, w: 1, d: 4, r: 0 }, zb, 4, { tone: "hi" }, 2)));
  out.push(steel(cyl(-44.5, (yT[0] + yT[1]) / 2, 2.6, zb - 0.4, 4.8, { tone: "hi" }, 24, 0.2)));
  out.push(cyl(-44.5, (yT[0] + yT[1]) / 2, 1, APRON_Z, zb - 0.4 - APRON_Z, { tone: "mid" }, 14));
  // Telescopic tunnel (two sections) on a wheeled leg.
  const legX = -37;
  out.push(slab({ x: legX - 0.8, y: yT[0] + 0.4, w: 1.6, d: 2.4, r: 0 }, APRON_Z + 1.4, zb - APRON_Z - 1.4, { tone: "mid" }, 2));
  out.push(slab({ x: legX - 2.2, y: yT[0] - 0.2, w: 4.4, d: 3.6, r: 0 }, APRON_Z + 0.6, 0.8, { tone: "mid" }, 2, 0.2));
  for (const y of [yT[0] - 0.1, yT[1] + 0.1]) out.push(count(S(G.sphereOf([legX, y, APRON_Z + 0.8], 0.8, P, { steps: 20 }), { tone: "lo" })));
  const ribs = [];
  for (let x = -40; x < -33; x += 2.4) ribs.push(faceLine("y", yT[1], x, zb + 0.2, x, zb + 3.6));
  out.push(steel(slab({ x: -42, y: yT[0], w: 9, d: yT[1] - yT[0], r: 0 }, zb + 0.2, 3.6, { tone: "hi", inner: L(ribs.join(""), { tone: "faint" }) }, 2)));
  // The cab, turned to meet the door.
  out.push(steel(slab({ x: -33.6, y: -4.4, w: 4.4, d: 6.2, r: 0 }, zb, 4.2, { tone: "hi" }, 2, 0.2)));
  return out.join("");
}

// ---------- the airliner ----------
function fuselageRadius(x) {
  const nl = 12;
  if (x < NOSE + nl) { const t = (NOSE + nl - x) / nl; return R * Math.sqrt(Math.max(0, 1 - t * t)); }
  const tl = 18;
  if (x > TAIL - tl) { const t = (x - (TAIL - tl)) / tl; return R * (1 - 0.78 * t ** 1.5); }
  return R;
}
const fuselageZ = (x) => (x > TAIL - 18 ? ZC + 2.2 * ((x - (TAIL - 18)) / 18) ** 1.6 : ZC);
const skin = (x, phi) => { const r = fuselageRadius(x); return [x, YC + Math.cos(phi) * r, fuselageZ(x) + Math.sin(phi) * r]; };

function fuselage() {
  const stations = [NOSE, NOSE + 0.3, NOSE + 1, NOSE + 2.2, NOSE + 4, NOSE + 6.5, NOSE + 9, NOSE + 12, TAIL - 18, TAIL - 13, TAIL - 8, TAIL - 4, TAIL];
  const n = 30;
  const rings = stations.map((x) => Array.from({ length: n }, (_, i) => skin(x, (i / n) * Math.PI * 2)));
  const cs = stations.map((x) => [x, YC, fuselageZ(x)]);
  const paths = loft(rings, cs, { creaseCos: 0.6, caps: [false, true] });
  const marks = [];
  // Cabin windows: a row on the near side.
  const phiW = Math.asin(1.1 / R);
  const wins = [];
  for (let x = NOSE + 15; x < TAIL - 16; x += 1.5) {
    if (Math.abs(x - (NOSE + 13.2)) < 2 || Math.abs(x + 1) < 2.2 || Math.abs(x - (TAIL - 17.5)) < 2) continue;
    wins.push(at(skin(x, phiW)));
  }
  // Doors (closed outlines on the skin): forward, over-wing, aft.
  const door = (x0, w, z0, z1) => {
    const ph = (z) => Math.asin((z - ZC) / R);
    const pts = [];
    for (const [x, z] of [[x0, z0], [x0 + w, z0], [x0 + w, z1], [x0, z1]]) pts.push(at(skin(x, ph(z))));
    return pathOf(pts, true);
  };
  marks.push(door(NOSE + 12.4, 1.6, ZC - 1.6, ZC + 2.1), door(-2, 1.1, ZC - 0.6, ZC + 1.6), door(TAIL - 18.4, 1.6, ZC - 1.6, ZC + 2.1));
  // Cockpit windscreen: four panes wrapping the nose.
  const cock = [];
  const zW0 = ZC + 0.9;
  const zW1 = ZC + 1.9;
  for (const [x0, x1] of [[NOSE + 3.2, NOSE + 4.6], [NOSE + 4.9, NOSE + 6.1]]) {
    const pts = [];
    for (const [x, z] of [[x0, zW0], [x1, zW0], [x1 + 0.3, zW1], [x0 + 0.5, zW1]]) {
      const r = fuselageRadius(x);
      const ph = Math.asin(Math.min(0.99, (z - ZC) / r));
      pts.push(at(skin(x, ph)));
    }
    cock.push(pathOf(pts, true));
  }
  // Belly seam along the wing box.
  return steel(count(S(paths, { tone: "hi", inner: L(marks.join(""), { tone: "lo" }) + L(cock.join(""), { tone: "hi" }) + D(wins, { size: 0.55 * sk / 2, tone: "hi" }) })));
}

// A swept, tapered flying surface (wing or tailplane) on one side: root on the skin, given by
// [x leading, x trailing, y, z] at root and tip, with a thickness.
function surface(root, tip, th, side) {
  const [rl, rt, ry, rz] = root;
  const [tl, tt, ty, tz] = tip;
  const top = [[rl, ry, rz + th], [rt, ry, rz + th * 0.6], [tt, ty, tz + th * 0.3], [tl, ty, tz + th * 0.5]];
  const bot = [[rl, ry, rz], [rt, ry, rz + th * 0.2], [tt, ty, tz], [tl, ty, tz]];
  const s = side;
  const faces = [
    { pts: top, hint: [0, 0, 1] },
    { pts: bot, hint: [0, 0, -1] },
    { pts: [bot[0], bot[3], top[3], top[0]], hint: [-1, 0, 0] },
    { pts: [bot[1], bot[2], top[2], top[1]], hint: [1, 0, 0] },
    { pts: [bot[2], bot[3], top[3], top[2]], hint: [0, s, 0] },
    { pts: [bot[0], bot[1], top[1], top[0]], hint: [0, -s, 0] },
  ];
  return polySolid(faces, { creaseCos: 0.995 });
}

const WING_ROOT_Z = APRON_Z + 5.1;
function wing(side) {
  const ry = YC + side * Math.sqrt(R * R - (ZC - WING_ROOT_Z - 0.4) ** 2);
  const tipY = YC + side * 35;
  const root = [-12, 6, ry, WING_ROOT_Z];
  const tip = [13, 18, tipY, WING_ROOT_Z + 2.4];
  const out = [];
  // Flap track fairings and the flap line on the near (visible) upper surface.
  const marks = [];
  const lerp = (t, a0, b0) => a0 + (b0 - a0) * t;
  const flap = [];
  for (const t of [0.05, 0.95]) {
    const y = lerp(t, ry, tipY);
    const xt = lerp(t, root[1], tip[1]);
    const xl = lerp(t, root[0], tip[0]);
    const z = lerp(t, root[3], tip[3]) + 0.35 + 0.15 * (1 - t);
    flap.push([xt - (xt - xl) * 0.28, y, z]);
  }
  marks.push(pathOf(flap.map(at)));
  out.push(steel(count(S(surface(root, tip, 0.9, side), { tone: "hi", inner: side > 0 ? L(marks.join(""), { tone: "faint" }) : "" }))));
  // Winglet.
  const wl = [[tip[0] + 1.6, tipY, tip[3] + 0.4], [tip[1] - 0.2, tipY, tip[3] + 0.4], [tip[1] + 1.2, tipY, tip[3] + 4], [tip[1] - 0.6, tipY, tip[3] + 4]];
  const F = G.frameOf([0, tipY, 0], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
  out.push(steel(count(S(G.prismOf(F, wl.map(([x, , z]) => [x, z]), -0.25, 0.25, P), { tone: "hi" }))));
  return out.join("");
}

function engine(side) {
  const y = YC + side * 12;
  const zc = APRON_Z + 3.2;
  const xs = [-12.5, -12.1, -11.1, -7.5, -4.5, -2.9];
  const rs = [1.85, 2.05, 2.1, 2.05, 1.7, 1.25];
  const n = 26;
  const rings = xs.map((x, i) => Array.from({ length: n }, (_, j) => { const ph = (j / n) * Math.PI * 2; return [x, y + Math.cos(ph) * rs[i], zc + Math.sin(ph) * rs[i]]; }));
  const cs = xs.map((x) => [x, y, zc]);
  const out = [];
  // Pylon: a thin blade from the nacelle top up to the wing's underside.
  const wingZ = WING_ROOT_Z + 2.4 * ((Math.abs(y - YC) - 2.7) / 32.3);
  const pyl = [[-10, zc + 1.7], [-3.5, zc + 1.3], [1, wingZ + 0.1], [-5.5, wingZ + 0.1]];
  const F = G.frameOf([0, y, 0], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
  out.push(steel(count(S(G.prismOf(F, pyl, -0.4, 0.4, P), { tone: "hi" }))));
  // Nacelle with its intake lip and the fan face (a dark disc seen into the intake).
  out.push(steel(count(S(loft(rings, cs, { creaseCos: 0.7 }), { tone: "hi" }))));
  return out.join("");
}

function tailplane(side) {
  const zt = fuselageZ(30) + 0.4;
  const ry = YC + side * fuselageRadius(30) * 0.85;
  return steel(count(S(surface([26.5, 33.5, ry, zt], [34.5, 37.5, YC + side * 13, zt + 1.4], 0.6, side), { tone: "hi" })));
}

function fin() {
  const z0 = fuselageZ(30) + fuselageRadius(30) * 0.8;
  const prof = [[24, z0], [35.6, z0 + 0.6], [39.6, z0 + 13], [35.4, z0 + 13]];
  const F = G.frameOf([0, YC, 0], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
  const rud = [];
  // Rudder hinge line on the visible (+y) face.
  rud.push(pathOf([at([34.4, YC + 0.3, z0 + 0.45]), at([38.2, YC + 0.3, z0 + 13])]));
  return steel(count(S(G.prismOf(F, prof, -0.3, 0.3, P), { tone: "hi", inner: L(rud.join(""), { tone: "faint" }) })));
}

// Landing gear: nose leg and two main bogies (wheels as short drums along y).
function wheelPair(x, y, z) {
  const out = [];
  const F = G.frameOf([x, y, z], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
  const disc = (s0, s1) => G.prismOf(F, Array.from({ length: 18 }, (_, i) => { const t = (i / 18) * Math.PI * 2; return [Math.cos(t) * 1.05, Math.sin(t) * 1.05]; }), s0, s1, P);
  out.push(count(S(disc(-1.4, -0.4), { tone: "lo" })));
  out.push(count(S(disc(0.4, 1.4), { tone: "lo" })));
  return out;
}
function gear(x, y, belly) {
  const out = [];
  out.push(...wheelPair(x, y, APRON_Z + 1.05).slice(0, 1));
  out.push(slab({ x: x - 0.35, y: y - 0.35, w: 0.7, d: 0.7, r: 0 }, APRON_Z + 1, belly - APRON_Z - 1 + 0.6, { tone: "mid" }, 2));
  out.push(...wheelPair(x, y, APRON_Z + 1.05).slice(1));
  return out.join("");
}

// ---------- control tower ----------
function controlTower() {
  const out = [];
  const x = 42;
  const y = -34;
  out.push(slab({ x: x - 7, y: y - 7, w: 14, d: 14, r: 1 }, APRON_Z, 5, { tone: "mid", inner: L(k.sideSeam({ x: x - 7, y: y - 7, w: 14, d: 14, r: 1 }, APRON_Z + 2.5, P, 4), { tone: "faint" }) }, 4, 0.3));
  const zs = APRON_Z + 5;
  const zc = APRON_Z + 40;
  const ribs = [];
  for (let i = 0; i < 4; i++) {
    const th = Math.atan2(V[1], V[0]) - 1 + i * 0.66;
    ribs.push(k.segment([x + Math.cos(th) * 2.8, y + Math.sin(th) * 2.8, zs], [x + Math.cos(th) * 2.8, y + Math.sin(th) * 2.8, zc - 2], P));
  }
  out.push(steel(cyl(x, y, 2.8, zs, zc - 2 - zs, { tone: "hi", inner: L(ribs.join(""), { tone: "faint" }) }, 28)));
  // Equipment floor under the cab.
  out.push(steel(cyl(x, y, 3.8, zc - 2, 2, { tone: "hi" }, 32, 0.2)));
  // The cab: a flared glass frustum with mullions.
  const n = 32;
  const ring = (r, z) => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return [x + Math.cos(t) * r, y + Math.sin(t) * r, z]; });
  const mul = [];
  for (let i = 0; i < 16; i++) {
    const th = (i / 16) * Math.PI * 2;
    if (Math.cos(th) * V[0] + Math.sin(th) * V[1] < 0.1) continue;
    mul.push(k.segment([x + Math.cos(th) * 4, y + Math.sin(th) * 4, zc], [x + Math.cos(th) * 5, y + Math.sin(th) * 5, zc + 4.2], P));
  }
  out.push(glass(count(S(loft([ring(4, zc), ring(5, zc + 4.2)], [[x, y, zc], [x, y, zc + 4.2]], { creaseCos: 0.9 }), { tone: "mid", inner: L(mul.join(""), { tone: "lo" }) }))));
  out.push(steel(cyl(x, y, 5.6, zc + 4.2, 1.1, { tone: "hi" }, 36, 0.3)));
  out.push(steel(cyl(x, y, 3, zc + 5.3, 1.4, { tone: "hi" }, 24, 0.2)));
  out.push(steel(cyl(x, y, 0.35, zc + 6.7, 5, { tone: "hi" }, 10)));
  const tip = at([x, y, zc + 12]);
  out.push(lamp(a.amBlink(`<circle cx="${tip[0].toFixed(1)}" cy="${tip[1].toFixed(1)}" r="${(2.2 * sk).toFixed(1)}" style="fill:var(--anatomy-face);stroke:none;filter:blur(${(0.9 * sk).toFixed(1)}px)"/>`, { period: 2600, min: 0.08 })));
  out.push(lamp(count(S(G.sphereOf([x, y, zc + 12], 0.5, P, { steps: 18 }), { tone: "hi" }))));
  return out.join("");
}

// ---------- ground equipment: a baggage tug and two carts ----------
function tug(x, y) {
  const out = [];
  out.push(slab({ x, y, w: 6, d: 3.4, r: 0.4 }, APRON_Z + 0.6, 1.6, { tone: "mid" }, 4, 0.2));
  out.push(glass(slab({ x: x + 0.6, y: y + 0.3, w: 2.6, d: 2.8, r: 0 }, APRON_Z + 2.2, 2, { tone: "mid" }, 2)));
  out.push(slab({ x: x + 0.4, y: y + 0.1, w: 3, d: 3.2, r: 0 }, APRON_Z + 4.2, 0.4, { tone: "hi" }, 2));
  return out.join("");
}
function cart(x, y) {
  const out = [];
  out.push(slab({ x, y, w: 5.4, d: 3.4, r: 0 }, APRON_Z + 0.7, 0.6, { tone: "mid" }, 2));
  const bags = [faceRect("y", y + 3.1, x + 0.6, x + 2.4, APRON_Z + 1.3, APRON_Z + 2.6), faceRect("y", y + 3.1, x + 2.8, x + 4.8, APRON_Z + 1.3, APRON_Z + 3)];
  out.push(slab({ x: x + 0.3, y: y + 0.3, w: 4.8, d: 2.8, r: 0 }, APRON_Z + 1.3, 2.2, { tone: "hi", inner: L(bags.join(""), { tone: "faint" }) }, 2, 0.2));
  out.push(slab({ x: x + 0.1, y: y + 0.1, w: 5.2, d: 3.2, r: 0 }, APRON_Z + 3.5, 0.3, { tone: "mid" }, 2));
  return out.join("");
}

// ---------- assemble ----------
const belly = (x) => fuselageZ(x) - fuselageRadius(x);
const beacon = () => {
  const p = at([-4, YC, ZC + R + 0.4]);
  return lamp(a.amBlink(`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${(1.8 * sk).toFixed(1)}" style="fill:var(--anatomy-face);stroke:none;filter:blur(${(0.8 * sk).toFixed(1)}px)"/>`, { period: 2200, delay: 900, min: 0.08 })) +
    lamp(count(S(G.sphereOf([-4, YC, ZC + R + 0.25], 0.42, P, { steps: 16 }), { tone: "hi" })));
};

const body = minify([
  T.plinth(PLINTH),
  apron(),
  terminal(),
  controlTower(),
  jetBridge(),
  tailplane(-1),
  engine(-1),
  wing(-1),
  gear(-1, YC - 3, belly(-1)),
  gear(NOSE + 6, YC, belly(NOSE + 6)),
  fuselage(),
  fin(),
  beacon(),
  tailplane(1),
  gear(-1, YC + 3, belly(-1)),
  engine(1),
  wing(1),
  tug(24, 26),
  cart(32, 26.2),
  cart(39, 26.2),
].join(""));

emit({
  nn: "29",
  here: HERE,
  body,
  label: "Narita airport in isometric view: a plain white twin-engine airliner parked at its gate with a jet bridge, the terminal and the control tower behind.",
  subject: "Avión en la puerta de Narita",
  accentsFor,
  jsdoc: ["Narita isométrico (día 29, vuelo de regreso): un bimotor sin librea aparcado en su puerta", "con la pasarela, la terminal y la torre de control. Las balizas rojas de la torre y del", "avión parpadean (CSS)."],
  solids: T.stats.solids,
});
