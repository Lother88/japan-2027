// hero-maqueta — FINAL Scene. A model railway on a wooden plinth at the foot of Mount Fuji: a
// viaduct on two piers carrying ballasted track and a three-car N700-style shinkansen whose lead
// nose points left toward the headline; a stepped contour-layer Fuji with a snow cap; a vermilion
// torii beside the track (the moment, coral); a station platform with a canopy and two chōchin;
// a koinobori mast with three cloth carps; pines, a stone tōrō, a cherry tree, stepping stones.
//
// Motion (max three per theme, all CSS, all still under prefers-reduced-motion):
//   day   = train slide + koinobori swing + one falling cherry petal
//   night = train slide + koinobori swing + chōchin/tōrō glow pulse
// Reduced motion rests on: train stopped just before the torii, carps fully extended.
//
// LAYERED variant (hero-layers/): the same geometry, but every moving part is cut out into its
// own stacked <svg> layer (one shared viewBox) animated with transform/opacity on the layer
// element itself, so Chrome composites it instead of repainting the whole drawing each frame.
// Moving parts are marked in the drawing with <!--L:name-->…<!--/L--> and split out after the
// painter's order is final; static parts are assigned to the lowest layer that keeps every
// measured screen overlap in the original painter's order (masks: probe.mjs → probe.json).
//
//   node build.mjs           → out/heroMaqueta.markup.ts, fragments.json, preview.html, ref.html
//   node build.mjs --audit   → also runs the kit audit on the recorded shapes

import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { k, a, G, A, SITE, mix, baseAccents, polySolid, smoothGrid, compound, minify, prefixAll, reactMarkup } from "../hero/common.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "out");
mkdirSync(OUT, { recursive: true });
const W = 1200;
const H = 640;
const REGION = { x: 500, y: 36, w: 668, h: 568 };
const SAFE = { x: 0, y: 0, w: 470, h: 640 };
const WEIGHT = 0.8;

function accentsFor(theme) {
  const s = SITE[theme];
  const L = theme === "light";
  return {
    ...baseAccents(theme),
    water: mix(s.green, s.paper, L ? 0.62 : 0.5),
    fuji: mix(s.slate, s.paper, L ? 0.3 : 0.15),
    snow: L ? s.paper : s.ink,
    sakura: L ? mix(s.coral, s.paper, 0.55) : mix(s.coral, s.ink, 0.6),
    blossom: L ? mix(s.coral, s.paper, 0.38) : mix(s.coral, s.ink, 0.45),
    // Chōchin: red paper by day, lit amber paper at night.
    lamp: L ? s.coral : s.amber,
    concrete: L ? mix(s.slate, s.paper, 0.78) : mix(s.slate, s.paper, 0.55),
    // The white train keeps reading as white at night (dark only; by day it is the neutral ramp).
    ...(L ? {} : { shell: mix(s.ink, s.paper, 0.3) }),
  };
}

// ---------- world (x → screen right-down, y → screen left-down, z up) ----------
const PLINTH = { x: -90, y: -88, w: 152, d: 176, r: 6 };
const GROUND = k.insetPlan(PLINTH, 2.5);
const FUJI = { x: -44, y: -28, R0: 37, base: 9, ell: 1.24, N: 11, step: 6.9 };
const DECK = { x: 12, y: -85, w: 20, d: 170, r: 0 };
const CXT = 22; // track centre line
const Z = { deck0: 12, deck: 16, para: 18.6, ballast: 17.2, sleeper: 17.8, rail: 19, body: 21.2 };
const TORII = { y: 58, x0: 35, x1: 56, top: 50 };
const POLES = [-58, 4, 66];
const POLE_X = 10.4;
const ARM_Z = 39.6;
const KOI = { x: -64, y: 40, top: 86 };
const PLAT = { x0: 33, x1: 44.6, y0: -86, y1: -49, z: 20.4 };
const CANOPY = { x0: 35, x1: 46.2, y0: -84.4, y1: -50.6, zb: 33.6 };
const TRAIN = { nose: 24, len: [38, 28, 38], gap: 1.6, slide: [0, 18, 0] };

const fitPoints = [
  ...k.boxCorners(PLINTH, -12, 0),
  [FUJI.x, FUJI.y, FUJI.N * FUJI.step + 1],
  [KOI.x, KOI.y, KOI.top + 3], [KOI.x - 30, KOI.y, KOI.top - 6],
  [TORII.x0 - 10, TORII.y, TORII.top + 4], [TORII.x1 + 10, TORII.y, TORII.top + 4],
];
const P = a.fitInto(fitPoints, REGION, { pad: 6, azimuth: 40 });

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const ac = (name) => (svg) => `<g class="ac-${name}">${svg}</g>`;
const [wood, moss, pine, water, fuji, snow, torii, sakura, blossom, ebony, pane, stone, gold, lamp, concrete] =
  ["wood", "moss", "pine", "water", "fuji", "snow", "torii", "sakura", "blossom", "ebony", "pane", "stone", "gold", "lamp", "concrete"].map(ac);
const shell = ac("shell");
const depth = (p) => k.depthOf([p[0], p[1], p[2] ?? 0], P);
const byDepth = (items, key = (i) => i) => [...items].sort((p, q) => depth(key(p)) - depth(key(q)));
const pathOf = (pts, closed) => k.pathOf(pts, closed);
const halo = (plan, z, blur = 4) => `<path class="iso-halo" d="${k.haloOf(plan, z, 0.1, P)}" style="filter:blur(${blur}px)"/>`;
let solids = 0;
const count = (svg) => { solids++; return svg; };
const box = (x0, x1, y0, y1) => ({ x: x0, y: y0, w: x1 - x0, d: y1 - y0, r: 0 });
const slab = (plan, z, h, opts = {}, steps = 2, bevel = 0) => count(S(k.slabOf(plan, z, h, P, steps, bevel), opts));
const cyl = (x, y, r, z, h, opts = {}, steps = 20, bevel = 0) => count(S(k.cylinder(x, y, r, z, h, P, steps, bevel), opts));
const fp = (face, c, u, z) => at(face === "x" ? [c, u, z] : [u, c, z]);
const faceRect = (face, c, u0, u1, z0, z1) => pathOf([[u0, z0], [u1, z0], [u1, z1], [u0, z1]].map(([u, z]) => fp(face, c, u, z)), true);

// ---------- the recorder: every part is an item with its true shape ----------
const R = A.recorder(P);
function put(name, centre, svg, shapes, bias = 0) {
  const id = R.nameFor(name);
  return R.put({ at: centre, bias, svg, name: id, shapes: shapes.map((shape) => R.solid({ ...shape, name: shape.name ?? id, owner: id })) });
}
const Abox = (x0, x1, y0, y1, z0, z1) => A.box([x0, y0, z0], [x1, y1, z1]);

// ---------- base: halo, wooden plinth, moss ground, river (static, painted first) ----------
R.solid(A.slab(PLINTH, -12, 12, { name: "stand.plinth" }, 6));
function plinth() {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(PLINTH, -5), -12, 4, P)}"/>`];
  out.push(wood(slab(PLINTH, -12, 10, { tone: "mid", inner: L(k.sideSeam(PLINTH, -6, P, 6), { tone: "faint" }) }, 6, 0.8)));
  out.push(moss(slab(GROUND, -2, 2, { tone: "mid", crease: "faint" }, 6)));
  return out.join("");
}
const RIVER = (() => {
  const left = [];
  const right = [];
  for (let i = 0; i <= 10; i++) {
    const x = -2 + (i / 10) * (PLINTH.x + PLINTH.w - 2.5 + 2);
      const yc = -9 + Math.sin(i * 0.7) * 5;
    const w = 4.2 + i * 0.35;
    left.push([x, yc - w]);
    right.push([x, yc + w]);
  }
  return [...left, ...right.reverse()];
})();
function river() {
  const out = [water(count(S(k.extrude(RIVER, 0, 0.4, P, { convex: false }), { tone: "lo", crease: "none" })))];
  const strokes = [];
  for (const [x0, x1, y] of [[40, 50, -14], [4, 9, -5.5], [52, 58, -8]]) strokes.push(k.fadeLineSvg([at([x0, y, 0.4]), at([x1, y, 0.4])], { fade: [3, 3], tone: "mid" }));
  out.push(water(strokes.join("")));
  return out.join("");
}

// ---------- small parts ----------
function stoneSolid(cx, cy, r, h, z, seed, tone = "mid") {
  const ring = [];
  for (let i = 0; i < 7; i++) {
    const t = (i / 7) * Math.PI * 2;
    const rr = r * (0.78 + 0.22 * Math.abs(Math.sin(seed * 3.1 + i * 1.7)));
    ring.push([cx + Math.cos(t) * rr * 1.15, cy + Math.sin(t) * rr]);
  }
  const hull = G.hullOf(ring);
  return { svg: count(S(k.extrude(hull, z, h, P, { bevel: 0.4 }), { tone })), shape: A.extruded(hull, z, h) };
}
function stones(name, list) {
  for (const [cx, cy, r, h, seed] of list) {
    const s = stoneSolid(cx, cy, r, h, 0, seed);
    put(name, [cx, cy, h / 2], stone(s.svg), [s.shape]);
  }
}

// ---------- Mount Fuji: a contour-layer model, concave flanks, snow on the top four tiers ----------
function fujiModel() {
  const out = [halo({ x: FUJI.x - 44, y: FUJI.y - 54, w: 88, d: 108, r: 44 }, 0, 6)];
  const shapes = [];
  const { N, R0, step } = FUJI;
  for (let i = 0; i < N; i++) {
    const t = i / N;
    const r = R0 * (1 - t) ** 1.3 + FUJI.base;
    const ring = [];
    const m = 22;
    for (let j = 0; j < m; j++) {
      const ang = (j / m) * Math.PI * 2;
      const wob = 1 + 0.03 * Math.sin(ang * 3 + i * 1.3) + 0.02 * Math.sin(ang * 5 - i);
      ring.push([FUJI.x + Math.cos(ang) * r * wob, FUJI.y + Math.sin(ang) * r * wob * (1 + (FUJI.ell - 1) * (1 - t))]);
    }
    const z = i * step;
    const isSnow = i >= N - 4;
    const solid = count(S(k.extrude(ring, z, step, P, { convex: false, bevel: 0.5 }), { tone: "mid", lit: i === N - 1 }));
    out.push(isSnow ? snow(solid) : i < 2 ? pine(solid) : fuji(solid));
    shapes.push(A.extruded(ring, z, step));
  }
  const topR = R0 * (1 - (N - 1) / N) ** 1.3 + FUJI.base;
  out.push(snow(L(k.ring(FUJI.x, FUJI.y, topR * 0.45, N * step, P, 24), { tone: "lo" })));
  put("fuji", [FUJI.x, FUJI.y, 20], out.join(""), shapes);
}

// ---------- trees ----------
function pineTree(x, y, z, scale = 1, padsN = 4, name = "pine") {
  const out = [halo({ x: x - 8 * scale, y: y - 8 * scale, w: 16 * scale, d: 16 * scale, r: 8 * scale }, z)];
  const shapes = [];
  const u = (v) => v * scale;
  const trunk = [[0, 0, 0], [1.6, 0.5, 5.5], [2.2, 0.7, 11], [0.4, 0, 16]].map(([dx, dy, dz]) => [x + u(dx), y + u(dy), z + u(dz)]);
  const all = [
    { dx: 7, dy: 2.5, dz: 6, r: 4.2 },
    { dx: -4.5, dy: 4, dz: 8.5, r: 3.8 },
    { dx: -2, dy: -5, dz: 11, r: 4.4 },
    { dx: 0.4, dy: 0, dz: 16.5, r: 5.4 },
  ];
  const pads = (padsN >= 4 ? all : [all[0], all[2], all[3]]).map((p) => ({ ...p, c: [x + u(p.dx), y + u(p.dy), z + u(p.dz)] }));
  const branches = pads.filter((p) => p.dz < 16).map((p) => {
    const zs = p.c[2] - u(1.6);
    const from = trunk[Math.max(0, trunk.findLastIndex((t, i) => i < trunk.length - 1 && t[2] <= zs))];
    const a0 = [from[0], from[1], zs];
    const a1 = [p.c[0], p.c[1], p.c[2] + u(0.6)];
    shapes.push(A.tube([a0, a1], u(0.3)));
    return k.segment(a0, a1, P);
  });
  out.push(wood(L(branches.join(""), { tone: "hi" })));
  const trunkDepth = depth(trunk[1]);
  const pad = (p) => {
    const r = u(p.r);
    const [px, py, pz] = p.c;
    shapes.push(A.cylinder(px, py, r, pz, u(1.3)), A.cylinder(px + u(0.3), py - u(0.2), r * 0.66, pz + u(1.3), u(1.1)));
    return pine(count(S(k.cylinder(px, py, r, pz, u(1.3), P, 13, 0.4), { tone: "hi", inner: L(k.sideArc(px, py, r, pz + u(0.65), P, 13), { tone: "faint" }) })) +
      count(S(k.cylinder(px + u(0.3), py - u(0.2), r * 0.66, pz + u(1.3), u(1.1), P, 10, 0), { tone: "hi" })));
  };
  const sorted = byDepth(pads, (p) => p.c);
  const behind = (p) => depth(p.c) < trunkDepth && p.dz < 16;
  for (const p of sorted) if (behind(p)) out.push(pad(p));
  for (let i = 0; i < trunk.length - 1; i++) {
    const [px, py, pz] = trunk[i];
    const h = trunk[i + 1][2] - pz + u(i === trunk.length - 2 ? 0.8 : 0.3);
    out.push(wood(cyl(px, py, u(1.25 - i * 0.2), pz, h, { tone: "hi" }, 10)));
    shapes.push(A.cylinder(px, py, u(1.25 - i * 0.2), pz, h));
  }
  for (const p of sorted) if (!behind(p)) out.push(pad(p));
  put(name, [x, y, z + u(8)], out.join(""), shapes);
}

// A cherry with a full, layered crown: a dome of overlapping blossom clumps in two pinks,
// a forked trunk, and blossom dots on the lit clumps.
function cherryTree(x, y, z, s = 1) {
  const u = (v) => v * s;
  const out = [halo({ x: x - u(11), y: y - u(11), w: u(22), d: u(22), r: u(11) }, z, 5)];
  const shapes = [];
  out.push(wood(cyl(x, y, u(1.4), z, u(7), { tone: "hi" }, 14)));
  shapes.push(A.cylinder(x, y, u(1.4), z, u(7)));
  // Two limbs fork from the trunk top into the crown.
  for (const [dx, dy] of [[-2.6, 1.8], [2.2, -2.4]]) {
    out.push(wood(cyl(x + u(dx * 0.5), y + u(dy * 0.5), u(0.85), z + u(6.6), u(4.5), { tone: "hi" }, 12)));
    shapes.push(A.cylinder(x + u(dx * 0.5), y + u(dy * 0.5), u(0.85), z + u(6.6), u(4.5)));
  }
  // The crown's hidden core: the limbs end in it and every clump grows out of it.
  shapes.push(A.ball([x, y, z + u(14)], u(4.5)));
  const clumps = [
    { c: [5.92, 1.83, 11.60], r: 3.5, t: "deep" },
    { c: [2.26, 5.77, 12.19], r: 3.5, t: "deep" },
    { c: [-3.1, 5.37, 11.45], r: 3.5, t: "deep" },
    { c: [-6.13, 0.92, 11.04], r: 3.5, t: "deep" },
    { c: [-4.54, -4.22, 11.90], r: 3.5, t: "deep" },
    { c: [0.47, -6.18, 12.08], r: 3.5, t: "deep" },
    { c: [5.13, -3.49, 11.18], r: 3.5, t: "deep" },
    { c: [2.36, 2.98, 15.20], r: 3.6, t: "light" },
    { c: [-2.1, 3.17, 15.63], r: 3.6, t: "light" },
    { c: [-3.66, -1.02, 14.76], r: 3.6, t: "light" },
    { c: [-0.16, -3.8, 15.21], r: 3.6, t: "light" },
    { c: [3.56, -1.33, 15.63], r: 3.6, t: "light" },
    { c: [0.3, -0.2, 18.20], r: 3.4, t: "light" },
  ].map((b) => ({ ...b, c: [x + u(b.c[0]), y + u(b.c[1]), z + u(b.c[2])], r: u(b.r) }));
  for (const b of byDepth(clumps, (b) => b.c)) {
    const svg = count(S(G.sphereOf(b.c, b.r, P, { steps: 20 }), { tone: "mid" }));
    // Blossom dots on the side that faces the light.
    const dots = [];
    for (let i = 0; i < 5; i++) {
      const th = 1.9 + i * 0.55;
      const ph = 0.55 + 0.3 * Math.sin(i * 2.3);
      dots.push(at([b.c[0] + Math.cos(th) * Math.cos(ph) * b.r * 0.82, b.c[1] + Math.sin(th) * Math.cos(ph) * b.r * 0.82, b.c[2] + Math.sin(ph) * b.r * 0.82]));
    }
    out.push((b.t === "deep" ? blossom : sakura)(svg + D(dots, { size: 0.55, tone: "lo" })));
    shapes.push(A.ball(b.c, b.r));
  }
  put("cherry", [x, y, z + u(8)], out.join(""), shapes);
  return clumps;
}

// ---------- stone lantern (tōrō); its fire box glows at night ----------
function toro(x, y, z, s = 1.35, glowDelay = 0, glowName = "glow-toro") {
  const out = [halo({ x: x - 4 * s, y: y - 4 * s, w: 8 * s, d: 8 * s, r: 4 * s }, z, 3)];
  const u = (v) => v * s;
  const shapes = [];
  out.push(cyl(x, y, u(3.2), z, u(1.4), { tone: "mid" }, 16, 0.3));
  out.push(cyl(x, y, u(1.1), z + u(1.4), u(5), { tone: "mid" }, 12));
  out.push(slab({ x: x - u(2.8), y: y - u(2.8), w: u(5.6), d: u(5.6), r: 0 }, z + u(6.4), u(1.1), { tone: "mid" }, 2, 0.3));
  shapes.push(A.cylinder(x, y, u(3.2), z, u(1.4)), A.cylinder(x, y, u(1.1), z + u(1.4), u(5)), Abox(x - u(2.8), x + u(2.8), y - u(2.8), y + u(2.8), z + u(6.4), z + u(7.5)));
  const fb = { x: x - u(1.9), y: y - u(1.9), w: u(3.8), d: u(3.8), r: 0 };
  const lights = [faceRect("x", x + u(1.9), y - u(0.9), y + u(0.9), z + u(8.1), z + u(9.9)), faceRect("y", y + u(1.9), x - u(0.9), x + u(0.9), z + u(8.1), z + u(9.9))].join("");
  const glow = pane(`<path d="${lights}" style="fill:var(--anatomy-dot);stroke:none"/>`);
  out.push(slab(fb, z + u(7.5), u(3), { tone: "mid", inner: glow + L(lights, { tone: "lo" }) }, 2));
  shapes.push(Abox(fb.x, fb.x + fb.w, fb.y, fb.y + fb.d, z + u(7.5), z + u(10.5)));
  const cap = roofOf(fb, u(1.6), z + u(10.5), { x: x - u(0.5), y: y - u(0.5), w: u(1), d: u(1) }, z + u(12.4), { lift: u(0.5), flare: u(0.4), fascia: u(0.5), n: 4 });
  out.push(count(S(cap, { tone: "mid" })));
  out.push(count(S(G.sphereOf([x, y, z + u(13.2)], u(0.9), P, { steps: 24 }), { tone: "mid" })));
  shapes.push(Abox(fb.x - u(1.6), fb.x + fb.w + u(1.6), fb.y - u(1.6), fb.y + fb.d + u(1.6), z + u(10.5), z + u(12.4)), A.ball([x, y, z + u(13.2)], u(0.9)));
  out.push(nightGlow([x, y, z + u(9)], u(7), u(6), glowDelay, glowName));
  put("toro", [x, y, z + u(6)], stone(out.join("")), shapes);
}

// Night only: a soft pool of lamp light (hidden by day, pulsing at night).
// Layered: the pool is cut out into its own layer (opacity-only animation on the layer element).
const MOVING = {};
function nightGlow(p, rx, ry, delay = 0, name = "glow") {
  const [gx, gy] = at(p);
  MOVING[name] = { kind: "glow", delay };
  return `<!--L:${name}--><g>${pane(`<ellipse cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" rx="${(rx * P.scale).toFixed(1)}" ry="${(ry * P.scale).toFixed(1)}" style="fill:var(--anatomy-dot);stroke:none;opacity:.42;filter:blur(6px)"/>`)}</g><!--/L-->`;
}

function rectRing(plan, z, n, { lift = 0, flare = 0 } = {}) {
  const cs = [[plan.x, plan.y], [plan.x + plan.w, plan.y], [plan.x + plan.w, plan.y + plan.d], [plan.x, plan.y + plan.d]];
  const outs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  const pts = [];
  for (let s = 0; s < 4; s++) {
    const A0 = cs[s];
    const B = cs[(s + 1) % 4];
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const w = Math.abs(2 * t - 1) ** 4;
      let px = A0[0] + (B[0] - A0[0]) * t;
      let py = A0[1] + (B[1] - A0[1]) * t;
      if (i === 0) {
        const prev = outs[(s + 3) % 4];
        px += (prev[0] + outs[s][0]) * flare;
        py += (prev[1] + outs[s][1]) * flare;
      } else {
        px += outs[s][0] * flare * w;
        py += outs[s][1] * flare * w;
      }
      pts.push([px, py, z + lift * w]);
    }
  }
  return pts;
}
function roofOf(wall, overhang, zEave, inner, zIn, { lift = 3, flare = 2, fascia = 1.6, n = 8 } = {}) {
  const eave = k.insetPlan(wall, -overhang);
  const A0 = rectRing(eave, zEave, n, { lift, flare });
  const B = rectRing(eave, zEave + fascia, n, { lift, flare });
  const C = rectRing(inner, zIn, n);
  const Dr = rectRing(wall, zEave, n);
  const N = A0.length;
  const faces = [];
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N;
    const mid = [(A0[i][0] + A0[j][0]) / 2 - (wall.x + wall.w / 2), (A0[i][1] + A0[j][1]) / 2 - (wall.y + wall.d / 2), 0];
    const side = Math.floor(i / n);
    faces.push({ pts: [A0[i], A0[j], B[j], B[i]], hint: mid, group: `fascia${side}` });
    faces.push({ pts: [B[i], B[j], C[j], C[i]], hint: [mid[0] * 0.02, mid[1] * 0.02, 1], group: `slope${side}` });
    faces.push({ pts: [A0[i], A0[j], Dr[j], Dr[i]], hint: [0, 0, -1] });
  }
  faces.push({ pts: C, hint: [0, 0, 1] });
  faces.push({ pts: Dr, hint: [0, 0, -1] });
  return polySolid(P, faces);
}

// A beam along x whose cross-section [dy, dz] is swept with an end lift (kasagi, shimaki).
function sweptBeam(xa, xb, y, z, sec, { lift = 0, power = 2.6, grow = 0, n = 10 } = {}) {
  const rings = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const e = Math.abs(2 * t - 1);
    const px = xa + (xb - xa) * t;
    rings.push(sec.map(([dy, dz]) => [px, y + dy, z + lift * e ** power + dz * (1 + grow * e)]));
  }
  const faces = [];
  for (let i = 0; i < n; i++) {
    for (let s = 0; s < sec.length; s++) {
      const s2 = (s + 1) % sec.length;
      const mid = [0, (sec[s][0] + sec[s2][0]) / 2, (sec[s][1] + sec[s2][1]) / 2 - 1];
      faces.push({ pts: [rings[i][s], rings[i + 1][s], rings[i + 1][s2], rings[i][s2]], hint: mid, group: `k${s}` });
    }
  }
  faces.push({ pts: rings[0], hint: [-1, 0, 0.3] });
  faces.push({ pts: rings[n], hint: [1, 0, 0.3] });
  return polySolid(P, faces, { creaseCos: 0.9 });
}

// ---------- the torii: myōjin style, wider and lower than the draft so its face reads ----------
function toriiGate() {
  const out = [halo(box(TORII.x0 - 5, TORII.x1 + 5, TORII.y - 5, TORII.y + 5), 0, 4)];
  const shapes = [];
  const { y, x0, x1, top } = TORII;
  const xm = (x0 + x1) / 2;
  const zNuki = top - 15;
  const zShim = top - 6.4;
  const postR = 2.1;
  // Bases (kamebara, black): drawn first, back to front.
  for (const px of byDepth([x0, x1], (px) => [px, y, 0])) {
    out.push(ebony(cyl(px, y, 3, 0, 1.6, { tone: "hi" }, 22, 0.3) + cyl(px, y, 2.6, 1.6, 1.4, { tone: "hi" }, 22, 0.3)));
    shapes.push(A.cylinder(px, y, 3, 0, 1.6), A.cylinder(px, y, 2.6, 1.6, 1.4));
  }
  // Nuki (tie beam) passes through both posts and sticks out past them: drawn before the posts,
  // which are nearer than it where they cross.
  const nuki = box(x0 - 6, x1 + 6, y - 1.1, y + 1.1);
  out.push(torii(slab(nuki, zNuki, 2.4, { tone: "hi" }, 2, 0.3)));
  shapes.push(Abox(nuki.x, nuki.x + nuki.w, nuki.y, nuki.y + nuki.d, zNuki, zNuki + 2.4));
  for (const px of byDepth([x0, x1], (px) => [px, y, 0])) {
    out.push(torii(cyl(px, y, postR, 3, zShim - 3, { tone: "hi", inner: L(k.sideArc(px, y, postR, zNuki - 1.4, P, 18), { tone: "faint" }) }, 22)));
    // Wedges (kusabi) on the nuki, just outside each post.
    const wx = px < xm ? px - postR - 0.7 : px + postR + 0.7;
    out.push(ebony(slab(box(wx - 0.6, wx + 0.6, y - 1.3, y + 1.3), zNuki - 0.2, 2.8, { tone: "hi" }, 2)));
    shapes.push(A.cylinder(px, y, postR, 3, zShim - 3), Abox(wx - 0.6, wx + 0.6, y - 1.3, y + 1.3, zNuki - 0.2, zNuki + 2.6));
  }
  // Gakuzuka (centre strut) with the shrine plaque (gaku) facing the headline.
  out.push(torii(slab(box(xm - 1.3, xm + 1.3, y - 0.9, y + 0.9), zNuki + 2.4, zShim - zNuki - 2.4, { tone: "hi" }, 2)));
  const plaque = box(xm - 2.8, xm + 2.8, y + 0.9, y + 1.5);
  const pz0 = zNuki + 3.2;
  const pz1 = zShim - 0.8;
  const frame = faceRect("y", y + 1.5, xm - 2.1, xm + 2.1, pz0 + 0.7, pz1 - 0.7);
  out.push(ebony(slab(plaque, pz0, pz1 - pz0, { tone: "hi", inner: gold(L(frame, { tone: "hi" })) }, 2, 0.2)));
  shapes.push(Abox(xm - 1.3, xm + 1.3, y - 0.9, y + 0.9, zNuki + 2.4, zShim), Abox(plaque.x, plaque.x + plaque.w, plaque.y, plaque.y + plaque.d, pz0, pz1));
  // Shimaki (lower lintel) and the black kasagi with its upswept ends.
  const sec = (hw, h) => [[-hw, 0], [hw, 0], [hw + 0.35, h], [-hw - 0.35, h]];
  out.push(torii(count(S(sweptBeam(x0 - 7.4, x1 + 7.4, y, zShim, sec(1.35, 2.2), { lift: 1.4, power: 2.4 }), { tone: "hi" }))));
  out.push(ebony(count(S(sweptBeam(x0 - 9.6, x1 + 9.6, y, zShim + 2.2, sec(1.7, 2.8), { lift: 3.6, power: 2.2, grow: 0.25 }), { tone: "hi", lit: true }))));
  shapes.push(Abox(x0 - 7.4, x1 + 7.4, y - 1.4, y + 1.4, zShim, zShim + 3.6), Abox(x0 - 9.6, x1 + 9.6, y - 2.1, y + 2.1, zShim + 2.2, zShim + 8.6));
  put("torii", [xm, y, top / 2], out.join(""), shapes);
}

// ---------- viaduct ----------
function viaduct() {
  for (const [y0, y1] of [[-86, -75], [75, 86]]) {
    const pl = box(11, 33, y0, y1);
    put("via.abut", [22, (y0 + y1) / 2, 6], concrete(slab(pl, 0, Z.deck0, { tone: "mid", inner: L(k.sideSeam(pl, 4, P, 2), { tone: "faint" }) }, 2, 0.5)), [A.slab(pl, 0, Z.deck0, {}, 2)]);
  }
  for (const yp of [-33, 33]) {
    const col = box(15.5, 28.5, yp - 3.5, yp + 3.5);
    const capP = box(13, 31, yp - 4.6, yp + 4.6);
    put("via.pier", [22, yp, 6], concrete(slab(col, 0, Z.deck0 - 2, { tone: "mid", inner: L(k.sideSeam(col, 1.2, P, 2), { tone: "faint" }) }, 2, 0.4) + slab(capP, Z.deck0 - 2, 2, { tone: "mid" }, 2, 0.4)), [A.slab(col, 0, Z.deck0 - 2, {}, 2), A.slab(capP, Z.deck0 - 2, 2, {}, 2)]);
  }
  // Girder with a drip groove, the back parapet, then the track bed in one item.
  const out = [];
  out.push(slab(DECK, Z.deck0, Z.deck - Z.deck0, { tone: "mid", inner: L(k.sideSeam(DECK, Z.deck0 + 1.2, P, 2), { tone: "faint" }) }, 2, 0.5));
  out.push(slab(box(DECK.x, DECK.x + 1.4, DECK.y, DECK.y + DECK.d), Z.deck, Z.para - Z.deck, { tone: "mid" }, 2, 0.3));
  put("via.deck", [22, 0, Z.deck0], concrete(out.join("")), [A.slab(DECK, Z.deck0, Z.deck - Z.deck0, {}, 2), Abox(DECK.x, DECK.x + 1.4, DECK.y, DECK.y + DECK.d, Z.deck, Z.para)]);
  const bed = box(DECK.x + 1.4, DECK.x + DECK.w - 1.4, DECK.y, DECK.y + DECK.d);
  const t = [slab(bed, Z.deck, Z.ballast - Z.deck, { tone: "lo", crease: "faint" }, 2)];
  const sl = [];
  for (let y = DECK.y + 2.5; y < DECK.y + DECK.d - 1; y += 4.2) sl.push(k.slabOf(box(CXT - 5, CXT + 5, y - 0.8, y + 0.8), Z.ballast, Z.sleeper - Z.ballast, P, 2));
  t.push(wood(count(S(compound(sl), { tone: "mid", crease: "none" }))));
  for (const xr of [CXT - 3.1, CXT + 3.1]) t.push(slab(box(xr - 0.45, xr + 0.45, DECK.y, DECK.y + DECK.d), Z.sleeper, Z.rail - Z.sleeper, { tone: "hi", crease: "none" }, 2));
  put("via.track", [22, 0, Z.ballast], t.join(""), [A.slab(bed, Z.deck, Z.rail - Z.deck, {}, 2)], 0.5);
  const fp0 = box(DECK.x + DECK.w - 1.4, DECK.x + DECK.w, DECK.y, DECK.y + DECK.d);
  put("via.para", [31.3, 0, Z.deck], concrete(slab(fp0, Z.deck, Z.para - Z.deck, { tone: "mid" }, 2, 0.3)), [A.slab(fp0, Z.deck, Z.para - Z.deck, {}, 2)]);
}

// Catenary: masts on brackets bolted to the girder's back face, arms over the track, the wire.
function catenary() {
  for (const y of POLES) {
    const br = box(POLE_X - 1.6, DECK.x, y - 1.2, y + 1.2);
    const mast = box(POLE_X - 0.8, POLE_X + 0.8, y - 0.8, y + 0.8);
    put("cat.mast", [POLE_X, y, 28], concrete(slab(br, 12.4, 2, { tone: "mid" }, 2, 0.2) + slab(mast, 14.4, ARM_Z + 2 - 14.4, { tone: "mid" }, 2, 0.3)),
      [Abox(br.x, br.x + br.w, br.y, br.y + br.d, 12.4, 14.4), Abox(mast.x, mast.x + mast.w, mast.y, mast.y + mast.d, 14.4, ARM_Z + 2)]);
    const arm = box(POLE_X + 0.8, CXT + 2.4, y - 0.5, y + 0.5);
    put("cat.arm", [CXT - 4, y, ARM_Z], concrete(slab(arm, ARM_Z, 1, { tone: "mid" }, 2)), [Abox(arm.x, arm.x + arm.w, arm.y, arm.y + arm.d, ARM_Z, ARM_Z + 1)]);
  }
  // Contact wire, arm to arm, sagging slightly between them.
  const pts = [];
  for (let i = 0; i < POLES.length - 1; i++) {
    const ya = POLES[i];
    const yb = POLES[i + 1];
    for (let j = i === 0 ? 0 : 1; j <= 12; j++) {
      const tt = j / 12;
      pts.push([CXT, ya + (yb - ya) * tt, ARM_Z - 1.3 * Math.sin(Math.PI * tt)]);
    }
  }
  put("cat.wire", [CXT, 0, ARM_Z], L(pathOf(pts.map(at)), { tone: "lo" }), [Abox(CXT - 0.15, CXT + 0.15, POLES[0], POLES[POLES.length - 1], ARM_Z - 1.4, ARM_Z)]);
}

// ---------- station platform with a canopy and two chōchin ----------
function platform() {
  const { x0, x1, y0, y1, z } = PLAT;
  const base = box(x0, x1, y0 + 0.6, y1 - 0.6);
  // Masonry base with coursed joints, then the slab that overhangs to the train.
  const courses = [5, 10, 15].map((zz) => k.sideSeam(base, zz, P, 2)).join("");
  put("plat.base", [x0 + 5, (y0 + y1) / 2, 9], stone(slab(base, 0, Z.para, { tone: "mid", inner: L(courses, { tone: "faint" }) }, 2, 0.4)), [A.slab(base, 0, Z.para, {}, 2)]);
  const top = box(29, x1, y0, y1);
  const strip = box(30.6, 31.6, y0 + 0.6, y1 - 0.6);
  const svg = concrete(slab(top, Z.para, z - Z.para, { tone: "mid", inner: L(k.sideSeam(top, Z.para + 0.6, P, 2), { tone: "faint" }) }, 2, 0.3)) +
    gold(slab(strip, z, 0.25, { tone: "mid", crease: "none" }, 2));
  put("plat.top", [36, (y0 + y1) / 2, z], svg, [A.slab(top, Z.para, z - Z.para, {}, 2), A.slab(strip, z, 0.25, {}, 2)]);
  // A bench: a seat on two legs.
  const bx = 41.2;
  const by0 = -73;
  const bench = [];
  for (const ly of [by0 + 0.6, by0 + 6.4]) bench.push(slab(box(bx - 0.9, bx + 0.9, ly - 0.35, ly + 0.35), z, 2, { tone: "mid" }, 2));
  bench.push(slab(box(bx - 1.3, bx + 1.3, by0, by0 + 7), z + 2, 0.5, { tone: "mid" }, 2, 0.15));
  put("plat.bench", [bx, by0 + 3.5, z + 1.2], wood(bench.join("")), [Abox(bx - 0.9, bx + 0.9, by0 + 0.25, by0 + 6.75, z, z + 2), Abox(bx - 1.3, bx + 1.3, by0, by0 + 7, z + 2, z + 2.5)]);
  // Canopy: two round posts, a beam along their heads, a single-pitch roof falling to the front.
  const { x0: cx0, x1: cx1, y0: cy0, y1: cy1, zb } = CANOPY;
  const px = 43;
  const bt = zb + 1.6 * ((cx1 - px - 0.7) / (cx1 - cx0)); // roof underside over the beam's front edge
  for (const py of [-79, -56]) {
    put("canopy.post", [px, py, (z + zb) / 2], ebony(cyl(px, py, 0.6, z, bt - 1 - z, { tone: "hi" }, 14) + cyl(px, py, 1, z, 0.6, { tone: "hi" }, 14)),
      [A.cylinder(px, py, 0.6, z, bt - 1 - z), A.cylinder(px, py, 1, z, 0.6)]);
  }
  const beam = box(px - 0.7, px + 0.7, cy0 + 1.5, cy1 - 1.5);
  put("canopy.beam", [px, (cy0 + cy1) / 2, bt - 0.5], ebony(slab(beam, bt - 1, 1, { tone: "hi" }, 2)), [Abox(beam.x, beam.x + beam.w, beam.y, beam.y + beam.d, bt - 1, bt)]);
  const zf = zb;
  const zk = zb + 1.6; // back edge higher
  const th = 0.9;
  const sec = [[cx0, zk], [cx1, zf], [cx1, zf + th], [cx0, zk + th]];
  const faces = [];
  const ring = (yy) => sec.map(([xx, zz]) => [xx, yy, zz]);
  const r0 = ring(cy0);
  const r1 = ring(cy1);
  for (let s = 0; s < 4; s++) {
    const s2 = (s + 1) % 4;
    const mid = [(sec[s][0] + sec[s2][0]) / 2 - (cx0 + cx1) / 2, 0, (sec[s][1] + sec[s2][1]) / 2 - (zf + zk + th) / 2];
    faces.push({ pts: [r0[s], r1[s], r1[s2], r0[s2]], hint: mid });
  }
  faces.push({ pts: r0, hint: [0, -1, 0] });
  faces.push({ pts: r1, hint: [0, 1, 0] });
  // Corrugation ribs on the roof: lines down the slope from back edge to front edge.
  const ribs = [];
  for (let yy = cy0 + 2; yy < cy1 - 1; yy += 2.6) ribs.push(pathOf([at([cx0, yy, zk + th]), at([cx1, yy, zf + th])]));
  put("canopy.roof", [(cx0 + cx1) / 2, (cy0 + cy1) / 2, zb + 1], ebony(count(S(polySolid(P, faces), { tone: "hi", inner: L(ribs.join(""), { tone: "faint" }) }))),
    [Abox(cx0, cx1, cy0, cy1, zf, zk + th)]);
}

// A chōchin hanging from the canopy's front edge: cord, black caps, a ribbed paper body.
function chochin(x, y, zTop, delay, glowName) {
  const rho = 2.2;
  const cz = zTop - 0.9 - 0.4 - rho * 0.92;
  const zt = cz + rho * 0.92;
  const zb = cz - rho * 0.92;
  const F = G.frameOf([x, y, cz], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
  const ribs = [];
  for (const h of [-1.1, -0.55, 0, 0.55, 1.1]) { const r = Math.sqrt(rho * rho - h * h); ribs.push(G.arcOf(F, h, r, P, { slope: -h / r })); }
  const body = lamp(count(S(G.sphereOf([x, y, cz], rho, P, { steps: 28 }), { tone: "hi", inner: L(ribs.join(""), { tone: "lo" }) })));
  const rc = Math.sqrt(rho * rho - (rho * 0.92) ** 2) + 0.35;
  const capB = ebony(cyl(x, y, rc, zb - 0.4, 0.5, { tone: "hi" }, 14));
  const capT = ebony(cyl(x, y, rc, zt - 0.1, 0.5, { tone: "hi" }, 14));
  const cord = L(k.segment([x, y, zt + 0.4], [x, y, zTop], P), { tone: "hi" });
  const out = cord + capB + body + capT + nightGlow([x, y, cz], 6, 5, delay, glowName);
  put("chochin", [x, y, cz], out, [A.ball([x, y, cz], rho), A.cylinder(x, y, rc, zb - 0.4, 0.5), A.cylinder(x, y, rc, zt - 0.1, 0.5), Abox(x - 0.1, x + 0.1, y - 0.1, y + 0.1, zt + 0.4, zTop)]);
}

// ---------- koinobori: a mast with a gilt ball, an arrow wheel and three cloth carps ----------
function koinobori() {
  const { x, y, top } = KOI;
  const out = [halo({ x: x - 5, y: y - 5, w: 10, d: 10, r: 5 }, 0, 3)];
  const shapes = [];
  // Carps first (they stream away from the viewer, behind the mast).
  const carps = [
    { z: top - 10, len: 32, h: 8, cls: ebony, delay: 0, from: -4, to: 6 },
    { z: top - 21, len: 26, h: 6.6, cls: torii, delay: 1.7, from: -5, to: 7 },
    { z: top - 31, len: 20, h: 5.2, cls: gold, delay: 3.1, from: -6, to: 8 },
  ];
  // Plane through the mast axis: u = wind (−x, away and up-left on screen), v = down (−z).
  for (const c of carps) {
    const M = a.planeMatrix([x, y, c.z], [-1, 0, 0], [0, 0, -1], P);
    // Layered: the carp in its plane, cut out into its own layer; the swing (a rotation inside
    // the plane, i.e. M·R(θ)·M⁻¹ on screen) is applied to the layer element in CSS.
    const name = `carp-${carps.indexOf(c) + 1}`;
    MOVING[name] = { kind: "swing", M: M.match(/-?[\d.]+/g).map(Number), from: c.from, to: c.to, period: 7200 + c.len * 40, delay: c.delay * 1000 };
    out.push(`<!--L:${name}--><g transform="${M}">${c.cls(carpFlat(c.len, c.h))}</g><!--/L-->`);
    shapes.push(Abox(x - 1 - c.len, x, y - 0.3, y + 0.3, c.z - c.h / 2 - 1.2, c.z + c.h / 2 - 1.2));
  }
  // Base: a stone footing and two timber clamps bolted round the mast.
  out.push(stone(slab(box(x - 3.4, x + 3.4, y - 3.4, y + 3.4), 0, 1.6, { tone: "mid" }, 2, 0.3)));
  shapes.push(Abox(x - 3.4, x + 3.4, y - 3.4, y + 3.4, 0, 1.6));
  for (const dy of [-1.7, 1.7]) {
    const cl = box(x - 1.2, x + 1.2, y + dy - 0.55, y + dy + 0.55);
    out.push(wood(slab(cl, 1.6, 9, { tone: "mid" }, 2, 0.2)));
    shapes.push(Abox(cl.x, cl.x + cl.w, cl.y, cl.y + cl.d, 1.6, 10.6));
  }
  const bolts = [3.4, 8.4].map((zz) => at([x + 1.2, y + 1.7, 1.6 + zz]));
  out.push(D(bolts, { size: 0.55, tone: "hi" }));
  out.push(wood(cyl(x, y, 0.95, 1.6, top - 1.6, { tone: "hi", inner: L(k.sideArc(x, y, 0.95, 12, P, 12), { tone: "faint" }) }, 12)));
  shapes.push(A.cylinder(x, y, 0.95, 1.6, top - 1.6));
  // Arrow wheel (yaguruma) in the plane facing the headline, then the gilt ball.
  const wz = top + 0.6;
  const MW = a.planeMatrix([x, y + 0.5, wz], [1, 0, 0], [0, 0, -1], P);
  const spokes = [];
  const heads = [];
  for (let i = 0; i < 8; i++) {
    const t = (i / 8) * Math.PI * 2;
    const c = Math.cos(t);
    const s = Math.sin(t);
    spokes.push(`M${(c * 0.9).toFixed(2)} ${(s * 0.9).toFixed(2)}L${(c * 3.2).toFixed(2)} ${(s * 3.2).toFixed(2)}`);
    const tip = [c * 4.2, s * 4.2];
    const l = [c * 3.1 - s * 0.7, s * 3.1 + c * 0.7];
    const r = [c * 3.1 + s * 0.7, s * 3.1 - c * 0.7];
    heads.push(`M${tip.map((v) => v.toFixed(2)).join(" ")}L${l.map((v) => v.toFixed(2)).join(" ")}L${r.map((v) => v.toFixed(2)).join(" ")}Z`);
  }
  out.push(`<g transform="${MW}">${L(spokes.join(""), { tone: "hi" })}${gold(`<path class="iso-fill" d="${heads.join("")}"/>${L(heads.join(""), { tone: "hi" })}`)}<circle class="iso-fill" r="0.9"/>${L("M-0.9 0A0.9 0.9 0 1 0 0.9 0A0.9 0.9 0 1 0 -0.9 0Z", { tone: "hi" })}</g>`);
  out.push(gold(count(S(G.sphereOf([x, y, top + 5.6], 1.2, P, { steps: 24 }), { tone: "hi" }))));
  shapes.push(A.ball([x, y, top + 5.6], 1.2), Abox(x - 4.2, x + 4.2, y, y + 0.6, wz - 4.2, wz + 4.2));
  // A short pole stub between the wheel and the ball.
  out.push(wood(cyl(x, y, 0.5, top, 4.5, { tone: "hi" }, 10)));
  shapes.push(A.cylinder(x, y, 0.5, top, 4.5));
  put("koi", [x, y, top / 2], out.join(""), shapes);
}

// One carp in its plane (u along the wind, v down), mouth ring at the origin (on the mast).
function carpFlat(len, h) {
  const n = 18;
  const top = [];
  const bot = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 + t * (len * 0.78);
    const body = 0.5 * h * (0.82 + 0.28 * Math.sin(Math.PI * Math.min(1, t * 1.15)) - 0.52 * t ** 2.2);
    const sag = 0.9 * t ** 1.6;
    top.push([u, -body + sag]);
    bot.push([u, body + sag]);
  }
  const ut = 1 + len * 0.78;
  const tb = top[n];
  const bb = bot[n];
  const tail = [[ut + len * 0.22, tb[1] - h * 0.32], [ut + len * 0.12, (tb[1] + bb[1]) / 2], [ut + len * 0.22, bb[1] + h * 0.32]];
  const outlinePts = [[1, -h * 0.42], ...top, ...tail, ...[...bot].reverse(), [1, h * 0.42]];
  const f = (p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`;
  const outline = `M${outlinePts.map(f).join("L")}Z`;
  // Lower half of the cloth in shadow: belly band from mouth to tail root.
  const mid = top.map((p, i) => [p[0], (p[1] + bot[i][1]) / 2 + h * 0.08]);
  const belly = `M${[...mid, ...[...bot].reverse()].map(f).join("L")}Z`;
  // Lines: gill arc, three rows of scales as scalloped bands, tail root and fin rays — each from
  // the top outline to the bottom outline, so every end lands on the outline.
  const lines = [];
  const vert = (i, bulge) => {
    const p0 = top[i];
    const p1 = bot[i];
    const seg = 6;
    const pts = [];
    for (let j = 0; j <= seg; j++) {
      const s = j / seg;
      const yy = p0[1] + (p1[1] - p0[1]) * s;
      pts.push([p0[0] + bulge * Math.sin(Math.PI * s) + (j % 2 ? 0.35 : 0), yy]);
    }
    return `M${pts.map(f).join("L")}`;
  };
  lines.push(vert(4, 1.3));
  for (const i of [7, 10, 13]) lines.push(vert(i, 0.9));
  lines.push(`M${f(tb)}L${f(bb)}`);
  lines.push(`M${f([ut, tb[1] + h * 0.15])}L${f(tail[0])}M${f([ut, bb[1] - h * 0.15])}L${f(tail[2])}`);
  const eye = [2.6, -h * 0.12];
  const er = h * 0.1;
  const mouth = `M1 ${(-h * 0.42).toFixed(2)}L1 ${(h * 0.42).toFixed(2)}`;
  return [
    `<path class="iso-fill" d="${outline}"/>`,
    `<path class="iso-shade" data-shade="3" d="${outline}"/>`,
    `<path class="iso-shade" data-shade="1" d="${belly}"/>`,
    L(lines.join(""), { tone: "lo" }),
    `<circle class="iso-fill" cx="${eye[0]}" cy="${eye[1].toFixed(2)}" r="${er.toFixed(2)}" style="fill:var(--anatomy-top)"/>`,
    D([eye], { size: (er * 0.5).toFixed(2), tone: "hi" }),
    L(mouth, { tone: "hi" }),
    L(outline, { tone: "hi" }),
  ].join("");
}

// ---------- the shinkansen ----------
// Section [dx, dz, group]: a flat floor, rounded skirts, flat sides, a smooth superelliptic roof.
const SEC = (() => {
  const pts = [];
  const side = [];
  for (let i = 0; i <= 3; i++) { const t = (i / 3) * (Math.PI / 2); side.push([5.0 + 0.6 * Math.sin(t), 1.4 * (1 - Math.cos(t))]); }
  const roof = [];
  const n = 7;
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * (Math.PI / 2);
    const c = Math.cos(t) ** (2 / 2.6);
    const s = Math.sin(t) ** (2 / 2.6);
    roof.push([5.6 * c, 7.2 + 4.1 * s]);
  }
  // Right half bottom→top, then the left half mirrored top→bottom.
  const right = [[5.0, 0], ...side.slice(1), [5.6, 7.2], ...roof.slice(1)];
  const left = right.slice(0, -1).reverse().map(([x, z]) => [-x, z]);
  pts.push(...right, ...left);
  return pts;
})();
// Groups per segment: floor, skirt, side, roof (roof is one smooth group across the crown).
const SEC_GROUP = SEC.map((p, i) => {
  const q = SEC[(i + 1) % SEC.length];
  if (p[1] === 0 && q[1] === 0) return "floor";
  if (Math.abs(Math.abs(p[0]) - 5.6) < 1e-6 && Math.abs(Math.abs(q[0]) - 5.6) < 1e-6) return p[0] > 0 ? "sideR" : "sideL";
  if (Math.max(p[1], q[1]) <= 1.4 + 1e-6) return p[0] > 0 ? "skirtR" : "skirtL";
  return "roof";
});
const NOSE = 22;
const ease = (t, p) => t ** p;
function ringAt(y, t) {
  const zs = 1 - 0.78 * ease(t, 1.45);
  const xs = 1 - 0.55 * ease(t, 2.3);
  return SEC.map(([dx, dz]) => [CXT + dx * xs, y, Z.body + dz * zs + (dz === 0 ? 1.1 * ease(t, 3) : 0)]);
}
function carBody(y0, y1, nose) {
  const ts = Array.from({ length: 10 }, (_, i) => 1 - (1 - i / 9) ** 1.35);
  const rings = [];
  if (nose === "back") for (let i = ts.length - 1; i >= 1; i--) rings.push(ringAt(y0 + NOSE * (1 - ts[i]), ts[i]));
  rings.push(ringAt(nose === "back" ? y0 + NOSE : y0, 0));
  rings.push(ringAt(nose === "front" ? y1 - NOSE : y1, 0));
  if (nose === "front") for (let i = 1; i < ts.length; i++) rings.push(ringAt(y1 - NOSE * (1 - ts[i]), ts[i]));
  const hint = (s) => {
    const p = SEC[s];
    const q = SEC[(s + 1) % SEC.length];
    return [(p[0] + q[0]) / 2, 0, (p[1] + q[1]) / 2 - 5.6];
  };
  return smoothGrid(P, rings, { group: SEC_GROUP, hint, caps: [{ pts: rings[0], hint: [0, -1, 0] }, { pts: rings[rings.length - 1], hint: [0, 1, 0] }] });
}

function car(name, y0, y1, nose) {
  const xf = CXT + 5.6;
  const out = [];
  const shapes = [];
  for (const yb of [y0 + 8, y1 - 8]) {
    out.push(ebony(slab(box(CXT - 4.2, CXT + 4.2, yb - 3.4, yb + 3.4), Z.rail - 0.4, Z.body - Z.rail + 0.6, { tone: "hi" }, 2)));
    shapes.push(Abox(CXT - 4.2, CXT + 4.2, yb - 3.4, yb + 3.4, Z.rail - 0.4, Z.body + 0.2));
  }
  const paths = carBody(y0, y1, nose);
  const s0 = nose === "back" ? y0 + NOSE : y0;
  const s1 = nose === "front" ? y1 - NOSE : y1;
  const panes = [];
  for (let y = s0 + 5.4; y + 1.9 < s1 - 4.6; y += 2.9) panes.push(faceRect("x", xf, y, y + 1.9, Z.body + 4.3, Z.body + 6.6));
  const doors = [];
  if (nose !== "back") doors.push(faceRect("x", xf, y0 + 1.6, y0 + 4.2, Z.body + 1.6, Z.body + 7));
  if (nose !== "front") doors.push(faceRect("x", xf, y1 - 4.2, y1 - 1.6, Z.body + 1.6, Z.body + 7));
  // A thin livery band under the windows, on the straight side only.
  const band = faceRect("x", xf, s0 + 0.01, s1 - 0.01, Z.body + 3.2, Z.body + 3.75);
  // Cab windscreen across the nose crown, between two nose rings.
  let ws = "";
  if (nose) {
    const ta = 0.16;
    const tb = 0.42;
    const ya = nose === "front" ? y1 - NOSE * (1 - ta) : y0 + NOSE * (1 - ta);
    const yb = nose === "front" ? y1 - NOSE * (1 - tb) : y0 + NOSE * (1 - tb);
    const rA = ringAt(ya, ta);
    const rB = ringAt(yb, tb);
    const top = SEC.length / 2 | 0;
    const idx = [];
    for (let i = top - 3; i <= top + 3; i++) idx.push(i);
    ws = pathOf([...idx.map((i) => at(rA[i])), ...[...idx].reverse().map((i) => at(rB[i]))], true);
  }
  const inner = [
    ebony(`<path d="${band}" style="fill:var(--anatomy-shade-2);stroke:none"/>`),
    pane(`<path d="${panes.join("")}" style="fill:var(--anatomy-dot);stroke:none"/>`),
    L(panes.join(""), { tone: "lo" }),
    L(doors.join(""), { tone: "faint" }),
    ws ? ebony(`<path d="${ws}" style="fill:var(--anatomy-shade-1);stroke:none"/>`) + L(ws, { tone: "lo" }) : "",
  ].join("");
  out.push(shell(count(S(paths, { tone: "hi", crease: "faint", inner }))));
  const F = { o: [CXT, 0, 0], a: [0, 1, 0], u: [1, 0, 0], v: [0, 0, 1] };
  const poly = SEC.map(([dx, dz]) => [dx, Z.body + dz]);
  shapes.push(A.prism(F, poly, s0, s1));
  if (nose) {
    // Nose recorded as a few tapering prisms (each as big as its start ring).
    const tsr = [0, 0.3, 0.6, 0.85];
    for (let i = 0; i < tsr.length; i++) {
      const t0 = tsr[i];
      const t1 = tsr[i + 1] ?? 1;
      const ring = ringAt(0, t0).map(([xx, , zz]) => [xx - CXT, zz]);
      const ya = nose === "front" ? y1 - NOSE * (1 - t0) : y0 + NOSE * (1 - t1);
      const yb = nose === "front" ? y1 - NOSE * (1 - t1) : y0 + NOSE * (1 - t0);
      shapes.push(A.prism(F, ring, ya, yb));
    }
  }
  put(name, [CXT, (y0 + y1) / 2, Z.body + 5], out.join(""), shapes);
}

function train() {
  const { nose, len, gap } = TRAIN;
  const c1 = [nose - len[0], nose];
  const c2 = [c1[0] - gap - len[1], c1[0] - gap];
  const c3 = [c2[0] - gap - len[2], c2[0] - gap];
  car("train.car3", c3[0], c3[1], "back");
  for (const yg of [c2[1] + gap / 2, c3[1] + gap / 2]) {
    const g = box(CXT - 4, CXT + 4, yg - gap / 2 - 0.3, yg + gap / 2 + 0.3);
    put("train.gang", [CXT, yg, Z.body + 5], ebony(slab(g, Z.body + 1, 8.6, { tone: "hi" }, 2)), [Abox(g.x, g.x + g.w, g.y, g.y + g.d, Z.body + 1, Z.body + 9.6)]);
  }
  car("train.car2", c2[0], c2[1], null);
  car("train.car1", c1[0], c1[1], "front");
}

// Stepping stones (tobi-ishi) from the plinth edge up to the torii.
function steppingStones() {
  const list = [[47, 66, 2.4, 1], [44.5, 71.5, 2.2, 2], [47.5, 77, 2.5, 3], [45, 82.5, 2.2, 4]];
  for (const [cx, cy, r, seed] of list) {
    const s = stoneSolid(cx, cy, r, 0.7, 0, seed + 10);
    put("path.stone", [cx, cy, 0.35], stone(s.svg), [s.shape]);
  }
}

// ---------- assemble ----------
fujiModel();
pineTree(-6, -72, 0, 1.25);
pineTree(-78, 66, 0, 1.45);
pineTree(-30, 74, 0, 1.2, 3);
pineTree(56, -46, 0, 1.3, 4, "fpine");
stones("stone", [[-12, 34, 3.2, 2.8, 1], [-2, 26, 2.4, 2, 2]]);
stones("fstone", [[40, -30, 3, 2.6, 3], [46.5, -26.5, 2.2, 2, 4]]);
koinobori();
viaduct();
catenary();
platform();
chochin(45.2, -74, CANOPY.zb, 0, "glow-chochin-1");
chochin(45.2, -62, CANOPY.zb, 1.3, "glow-chochin-2");
train();
toriiGate();
toro(55, 8, 0, 1.45, 2.1);
const blooms = cherryTree(49, 31, 0, 1.4);
steppingStones();

A.settle(R, P);
R.items.sort((p, q) => p.key - q.key);

// The train slides along the track as one group in one slot of the painter's order. Everything
// its swept box overlaps must be drawn wholly before the slot (behind) or after it (in front).
function trainSlot(items) {
  const tr = items.filter((it) => it.name.startsWith("train."));
  const rest = items.filter((it) => !it.name.startsWith("train."));
  const front = (it) => /^(via\.para|plat\.|canopy\.|chochin|torii|cherry|toro|cat\.wire|cat\.arm|fpine|fstone|path\.)/.test(it.name);
  MOVING.train = { kind: "slide" };
  const group = { name: "train", svg: `<!--L:train--><g>${tr.map((it) => it.svg).join("")}</g><!--/L-->` };
  return [...rest.filter((it) => !front(it)), group, ...rest.filter(front)];
}
const drawn = trainSlot(R.items);
{
  // Check the final drawing order against every measured overlap at rest.
  const slot = new Map();
  drawn.forEach((it, i) => slot.set(it, i));
  const ti = drawn.findIndex((it) => it.name === "train");
  const { items: settled, overlaps } = R.settled;
  const idx = (it) => (it.name.startsWith("train.") ? ti + settled.indexOf(it) * 1e-6 : slot.get(it));
  const bad = [];
  for (const pair of overlaps.pairs) {
    const aFront = pair.front[0].area >= overlaps.least;
    const bFront = pair.front[1].area >= overlaps.least;
    if (aFront === bFront) continue;
    const [f, bk] = aFront ? [settled[pair.a], settled[pair.b]] : [settled[pair.b], settled[pair.a]];
    if (f.name.startsWith("train.") && bk.name.startsWith("train.")) continue;
    if (!(idx(f) > idx(bk))) bad.push(`${bk.name} drawn after ${f.name}`);
  }
  if (bad.length) throw new Error(`drawing order: ${bad.join("; ")}`);
}

// One falling petal (day only), drawn last, starting beside the cherry crown.
function petal() {
  const c = blooms.find((b) => b.r > 5.5) ?? blooms[0];
  const [px, py] = at([c.c[0] + 9, c.c[1] - 6, c.c[2] - 6]);
  const s = 3.4;
  const d = `M${px.toFixed(1)} ${(py - s).toFixed(1)}C${(px + s * 1.1).toFixed(1)} ${(py - s * 0.6).toFixed(1)} ${(px + s * 0.8).toFixed(1)} ${(py + s * 0.8).toFixed(1)} ${px.toFixed(1)} ${(py + s).toFixed(1)}C${(px - s * 0.8).toFixed(1)} ${(py + s * 0.8).toFixed(1)} ${(px - s * 1.1).toFixed(1)} ${(py - s * 0.6).toFixed(1)} ${(px - 0.6).toFixed(1)} ${(py - s * 0.7).toFixed(1)}Z`;
  MOVING.petal = { kind: "petal", d };
  return `<!--L:petal--><g>${sakura(`<path class="iso-fill" d="${d}" style="fill:var(--anatomy-shade-3)"/>${L(d, { tone: "mid" })}`)}</g><!--/L-->`;
}

// ======================================================================================
// LAYERS — split the moving parts out, assign every static part to a layer, emit the module.
// ======================================================================================

// ---------- pieces in painter order; moving parts cut out of their items ----------
const pieces = [{ name: "plinth", svg: plinth() }, { name: "river", svg: river() }, ...drawn.map((it) => ({ name: it.name, svg: it.svg })), { name: "petal", svg: petal() }];

const DRAWABLE = /<(path|circle|ellipse|rect|line|polyline|polygon|use)\b/g;
const drawables = (s) => (s.match(DRAWABLE) ?? []).length;
// Split one item at its <!--L:name-->…<!--/L--> markers. Each fragment is well formed: the
// ancestor groups open at a marker (accent classes, solids) are closed before it and reopened
// after it, so the cut-out keeps exactly the tokens and selectors it had in place.
function splitMarked(name, svg) {
  const out = [];
  const stack = [];
  let cur = "";
  let moving = null;
  const reopen = () => stack.map((t) => t.open).join("");
  const flush = () => {
    const frag = cur + [...stack].reverse().map((t) => `</${t.tag}>`).join("");
    if (drawables(frag)) out.push({ name: moving ?? name, moving, svg: frag });
  };
  let seen = 0;
  for (const m of svg.matchAll(/<!--L:([\w-]+)-->|<!--\/L-->|<(\/?)([a-zA-Z]+)\b([^>]*?)(\/?)>|[^<]+/g)) {
    seen += m[0].length;
    if (m[1]) { if (moving) throw new Error(`nested layer marker in ${name}`); flush(); moving = m[1]; cur = reopen(); continue; }
    if (m[0] === "<!--/L-->") { flush(); moving = null; cur = reopen(); continue; }
    if (m[3] !== undefined) {
      if (m[2]) { const t = stack.pop(); if (!t || t.tag !== m[3]) throw new Error(`bad nesting in ${name}`); }
      else if (!m[5]) stack.push({ tag: m[3], open: m[0] });
    }
    cur += m[0];
  }
  if (seen !== svg.length) throw new Error(`unparsed markup in ${name}`);
  if (stack.length || moving) throw new Error(`unclosed tags or marker in ${name}`);
  flush();
  return out;
}
const frags = pieces.flatMap((p) => splitMarked(p.name, p.svg)).map((f, i) => ({ ...f, i, svg: minify(prefixAll(f.svg, "hero")) }));
{
  const before = drawables(pieces.map((p) => p.svg).join(""));
  const after = frags.reduce((s, f) => s + drawables(f.svg), 0);
  if (before !== after) throw new Error(`split lost elements: ${before} → ${after}`);
  for (const name of Object.keys(MOVING)) if (frags.filter((f) => f.moving === name).length !== 1) throw new Error(`moving part ${name} not cut out exactly once`);
  if (frags.filter((f) => f.moving).length !== Object.keys(MOVING).length) throw new Error("unregistered moving part");
}

// ---------- art bbox (for the mobile viewBox; unchanged from the single-SVG build) ----------
const artBox = (() => {
  let bb = [1e9, 1e9, -1e9, -1e9];
  for (const it of drawn) {
    const b = A.markupBox(it.svg);
    if (b) bb = [Math.min(bb[0], b[0]), Math.min(bb[1], b[1]), Math.max(bb[2], b[2]), Math.max(bb[3], b[3])];
  }
  const pl = k.boxCorners(PLINTH, -12, 0).map(at);
  for (const p of pl) bb = [Math.min(bb[0], p[0]), Math.min(bb[1], p[1]), Math.max(bb[2], p[0]), Math.max(bb[3], p[1])];
  return bb;
})();
const padM = 10;
const mob = [Math.floor(artBox[0] - padM), Math.floor(artBox[1] - padM), Math.ceil(artBox[2] - artBox[0] + 2 * padM), Math.ceil(artBox[3] - artBox[1] + 2 * padM + 8)];
if (mob.join(" ") !== "496 79 676 478") console.warn(`! mobile viewBox changed: ${mob.join(" ")} (was 496 79 676 478)`);

// ---------- motion parameters (identical to the single-SVG build) ----------
const slideVec = (() => { const p = at([0, 0, 0]); const q = at(TRAIN.slide); return [+(q[0] - p[0]).toFixed(2), +(q[1] - p[1]).toFixed(2)]; })();
const PETAL_KEYS = [
  { at: 0, tx: 14, ty: -46, rot: -30, op: 0 },
  { at: 12, op: 1 },
  { at: 55, tx: -4, ty: 0, rot: 40, op: 1 },
  { at: 88, op: 0.9 },
  { at: 100, tx: -30, ty: 52, rot: 130, op: 0 },
];
// The petal turned about its fill-box centre: the tight bounds of its two cubic curves.
const petalCentre = (() => {
  const n = MOVING.petal.d.match(/-?\d*\.?\d+/g).map(Number);
  let p0 = [n[0], n[1]];
  const xs = [p0[0]];
  const ys = [p0[1]];
  for (let i = 2; i + 5 < n.length; i += 6) {
    const c = [p0, [n[i], n[i + 1]], [n[i + 2], n[i + 3]], [n[i + 4], n[i + 5]]];
    for (let s = 0; s <= 400; s++) {
      const t = s / 400;
      const u = 1 - t;
      const w = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
      xs.push(w.reduce((acc, wi, j) => acc + wi * c[j][0], 0));
      ys.push(w.reduce((acc, wi, j) => acc + wi * c[j][1], 0));
    }
    p0 = c[3];
  }
  return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
})();
const inv2 = ([a0, b0, c0, d0]) => { const det = a0 * d0 - b0 * c0; return [d0 / det, -b0 / det, -c0 / det, a0 / det]; };

// ---------- probe: pixel masks decide which static fragments must sit above which mover ----------
const LIGHT_DARK_PAPER = { light: SITE.light.paper, dark: SITE.dark.paper };
const styleOf = (layerCss) => {
  const full = reactMarkup({ scope: "iso-hero", prefix: "hero", body: "", accentsFor, weight: WEIGHT, css: layerCss });
  return full.match(/<style>([\s\S]*)<\/style>/)[1]
    // Kit noise: rules for [data-flow]/[data-pulse] point at keyframes that don't exist and match nothing.
    .split("\n").filter((line) => !/hero-iso-(flow|pulse)/.test(line)).join("\n");
};
const sweeps = {};
for (const [name, m] of Object.entries(MOVING)) {
  if (m.kind === "swing") sweeps[name] = { kind: "swing", M: m.M, from: m.from, to: m.to };
  else if (m.kind === "glow") sweeps[name] = { kind: "static" };
  else if (m.kind === "petal") sweeps[name] = { kind: "petal", c: petalCentre, keys: PETAL_KEYS };
}
sweeps.train = { kind: "slide", v: slideVec };
const probeInput = { frags: frags.map((f) => ({ i: f.i, name: f.name, moving: f.moving, svg: f.svg })), sweeps, style: styleOf(""), paper: LIGHT_DARK_PAPER };
const hash = createHash("sha1").update(JSON.stringify(probeInput)).digest("hex").slice(0, 12);
writeFileSync(join(HERE, "probe.html"), `<!doctype html><meta charset="utf-8"><title>probe</title><body><script>window.__input=${JSON.stringify({ ...probeInput, hash }).replace(/</g, "\\u003c")};</script><script src="probe.js"></script></body>`);
const probePath = join(HERE, "probe.json");
const probe = existsSync(probePath) ? JSON.parse(readFileSync(probePath, "utf8")) : null;
if (!probe || probe.hash !== hash) {
  console.log(`fragments: ${frags.length} (${frags.filter((f) => f.moving).length} moving) · probe hash ${hash}`);
  console.log("probe.json missing or stale → run: node probe.mjs && node build.mjs");
  process.exit(0);
}

// ---------- layers: base, then for each mover its layer and the static parts above it ----------
const movers = frags.filter((f) => f.moving).map((f) => f.moving);
// Static occluder layers: the first is "front" (torii, platform, cherry, koinobori mast…), the
// others are named after their first part ("front-canopy-beam", …).
let fronts = 0;
const slotName = (s, list) => (s === 0 ? "base" : s % 2 ? movers[(s - 1) / 2] : fronts++ === 0 ? "front" : `front-${list[0].name.split("#")[0].replace(/\./g, "-")}`);
const bySlot = new Map();
for (const r of probe.result) {
  const f = frags[r.i];
  if (f.name !== r.name) throw new Error("probe/fragments mismatch");
  if (!bySlot.has(r.slot)) bySlot.set(r.slot, []);
  bySlot.get(r.slot).push(f);
}
const LAYERS = [...bySlot.keys()].sort((x, y) => x - y).map((s) => {
  const list = bySlot.get(s);
  const name = slotName(s, list);
  const markup = `<g data-art="">${list.map((f) => f.svg).join("")}</g>`;
  return { name, markup, animated: s % 2 === 1, slot: s, parts: [...new Set(list.map((f) => f.name.split("#")[0]))] };
});

// ---------- layer CSS: transform/opacity on the layer element only ----------
const VB = { desktop: [0, 0, W, H], mobile: mob };
const pct = (v) => `${+v.toFixed(4)}%`;
const originAt = (vb, x, y) => `${pct(((x - vb[0]) / vb[2]) * 100)} ${pct(((y - vb[1]) / vb[3]) * 100)}`;
const shift = (vb, dx, dy) => `translate(${pct((dx / vb[2]) * 100)},${pct((dy / vb[3]) * 100)})`;
const EASE = "cubic-bezier(.45,0,.55,1)";
const L_ = (name) => `.iso-hero .hero-layer-${name}`;
const LM = (name) => `.iso-hero[data-crop="mobile"] .hero-layer-${name}`;
const LD = (name) => `[data-theme="dark"] .iso-hero .hero-layer-${name}`;
function layerCss() {
  const top = [
    `.iso-hero{position:relative}`,
    `.iso-hero .hero-layer{position:absolute;top:0;left:0;width:100%;height:100%;display:block;overflow:visible;pointer-events:none}`,
  ];
  const keys = [];
  const run = [];
  const still = [];
  for (const name of movers) {
    const m = MOVING[name] ?? { kind: "slide" };
    if (name === "train") {
      for (const [suffix, vb] of [["", VB.desktop], ["-m", VB.mobile]]) {
        keys.push(`@keyframes hero-train${suffix}{0%,14%{transform:translate(0,0)}46%,64%{transform:${shift(vb, ...slideVec)}}94%,100%{transform:translate(0,0)}}`);
      }
      run.push(`${L_(name)}{will-change:transform;animation:hero-train 14s ${EASE} infinite}`, `${LM(name)}{animation-name:hero-train-m}`);
      still.push(`${L_(name)}{transform:${shift(VB.desktop, ...slideVec)}}`, `${LM(name)}{transform:${shift(VB.mobile, ...slideVec)}}`);
    } else if (m.kind === "swing") {
      const lin = m.M.slice(0, 4);
      const iv = inv2(lin);
      const f = (v) => +v.toFixed(6);
      const pose = (deg) => `matrix(${lin.map(f).join(",")},0,0) rotate(${deg}deg) matrix(${iv.map(f).join(",")},0,0)`;
      top.push(`${L_(name)}{transform-origin:${originAt(VB.desktop, m.M[4], m.M[5])}}`, `${LM(name)}{transform-origin:${originAt(VB.mobile, m.M[4], m.M[5])}}`);
      keys.push(`@keyframes hero-${name}{0%,100%{transform:${pose(m.from)}}50%{transform:${pose(m.to)}}}`);
      run.push(`${L_(name)}{will-change:transform;animation:hero-${name} ${(m.period / 1000).toFixed(2)}s ${EASE} ${(-Math.abs(m.delay) / 1000).toFixed(2)}s infinite}`);
    } else if (m.kind === "petal") {
      top.push(`${L_(name)}{transform-origin:${originAt(VB.desktop, ...petalCentre)}}`, `${LM(name)}{transform-origin:${originAt(VB.mobile, ...petalCentre)}}`, `${LD(name)}{display:none}`);
      for (const [suffix, vb] of [["", VB.desktop], ["-m", VB.mobile]]) {
        const frames = PETAL_KEYS.map((key) => `${key.at}%{${key.tx === undefined ? "" : `transform:${shift(vb, key.tx, key.ty)} rotate(${key.rot}deg);`}opacity:${key.op}}`);
        keys.push(`@keyframes hero-petal${suffix}{${frames.join("")}}`);
      }
      run.push(`${L_(name)}{will-change:transform,opacity;animation:hero-petal 9s cubic-bezier(.4,0,.6,1) infinite}`, `${LM(name)}{animation-name:hero-petal-m}`);
    } else if (m.kind === "glow") {
      top.push(`${L_(name)}{display:none}`, `${LD(name)}{display:block}`);
      run.push(`${LD(name)}{will-change:opacity;animation:hero-glow 3.6s ${EASE} ${(-m.delay).toFixed(1)}s infinite}`);
    }
  }
  keys.push(`@keyframes hero-glow{0%,100%{opacity:.5}50%{opacity:1}}`);
  return [
    ...top,
    ...keys,
    `@media (prefers-reduced-motion:no-preference){${run.join("")}}`,
    `@media (prefers-reduced-motion:reduce){${still.join("")}}`,
  ].join("\n");
}
const STYLE = styleOf(layerCss());

// ---------- the module ----------
const kb = (s) => +(s.length / 1024).toFixed(1);
const layerList = LAYERS.map((l) => `  { name: ${JSON.stringify(l.name)}, animated: ${l.animated}, markup: ${JSON.stringify(l.markup)} },`).join("\n");
const ts = `/**
 * Hero «Maqueta de tren al pie del Fuji» — marcado SVG generado POR CAPAS (no editar a mano).
 *
 * Generado con el kit de la skill anatomy-asset (hero-layers/build.mjs en tools/art). Misma geometría, colores y movimiento que el SVG único anterior; lo que cambia es que
 * cada parte que se mueve vive en su propia capa, para que Chrome la componga en la GPU en vez de
 * repintar el dibujo entero (~1 280 paths) en cada frame.
 *
 * Contrato de capas:
 * - HERO_MAQUETA_LAYERS va de atrás adelante. Cada capa se pinta como un <svg> propio, todos con el
 *   MISMO viewBox (HERO_MAQUETA_VIEWBOX, o HERO_MAQUETA_VIEWBOX_MOBILE en móvil) y apilados en
 *   absoluto en la misma caja: <svg class="hero-layer hero-layer-{name}" viewBox=…
 *   preserveAspectRatio="xMidYMid meet">{markup}</svg>, hijos directos de un contenedor
 *   con la clase raíz \`iso-hero\` cuya caja tiene exactamente la proporción del viewBox activo.
 * - El contenedor lleva data-crop="mobile" cuando usa el viewBox móvil: los desplazamientos
 *   y pivotes de las capas animadas están en % de la caja y dependen del recorte.
 * - HERO_MAQUETA_STYLE es el CSS (sin la etiqueta <style>), que se emite UNA vez dentro del
 *   contenedor. Todo va acotado a \`.iso-hero\`; la variante oscura vive bajo
 *   [data-theme="dark"] .iso-hero. Clases, ids y @keyframes llevan el prefijo \`hero-\`.
 * - Las capas con animated: true animan solo transform/opacity sobre el propio <svg> de la capa
 *   (will-change solo en ellas). Las estáticas «over-…» tapan a la capa móvil de debajo (p. ej. el
 *   torii, el andén y el parapeto delante del tren): el orden del pintor es el mismo que antes.
 * - Movimiento: de día tren + koinobori + pétalo; de noche tren + koinobori + luz de chōchin/tōrō.
 *   Con prefers-reduced-motion no se anima nada: tren parado ante el torii, carpas extendidas.
 *   La pausa fuera de pantalla sigue funcionando con [data-art-paused] en un ancestro.
 *
 * Colores: tokens de src/styles/index.css (--paper, --ink, --gold, --brown, --green, --coral, --amber,
 * --slate); --anatomy-paper usa var(--paper) en vivo y las rampas se derivan de esos hex al
 * generar. Si cambia la paleta, hay que regenerar este fichero.
 */
export const HERO_MAQUETA_VIEWBOX = '0 0 ${W} ${H}'

export const HERO_MAQUETA_VIEWBOX_MOBILE = '${mob.join(" ")}'

export const HERO_MAQUETA_STYLE = ${JSON.stringify(STYLE)}

export interface HeroMaquetaLayer {
  /** Nombre de la capa; su <svg> lleva las clases \`hero-layer hero-layer-{name}\`. */
  name: string
  /** Contenido del <svg> de la capa (mismo viewBox para todas). */
  markup: string
  /** true si la capa se anima (transform/opacity sobre su propio <svg>). */
  animated: boolean
}

/** Capas de atrás adelante. */
export const HERO_MAQUETA_LAYERS: readonly HeroMaquetaLayer[] = [
${layerList}
]
`;
writeFileSync(join(OUT, "heroMaqueta.markup.ts"), ts);
console.log(`wrote out/heroMaqueta.markup.ts (${kb(ts)} KB; style ${kb(STYLE)} KB)`);
for (const l of LAYERS) console.log(`  ${String(l.slot).padStart(2)} ${l.name.padEnd(24)} ${l.animated ? "anim" : "    "} ${String(drawables(l.markup)).padStart(5)} el  ${String(kb(l.markup)).padStart(6)} KB  ${l.parts.join(", ")}`);
writeFileSync(join(HERE, "meta.json"), JSON.stringify({ mobile: mob, solids, slideVec, petalCentre, layers: LAYERS.map((l) => ({ name: l.name, animated: l.animated, elements: drawables(l.markup), paths: (l.markup.match(/<path\b/g) ?? []).length, kb: kb(l.markup), parts: l.parts })), styleKB: kb(STYLE), moduleKB: kb(ts) }, null, 1));

// ---------- preview.html (the layered stack, as the site should build it) and ref.html ----------
const orig = (() => {
  const src = readFileSync(join(HERE, "..", "hero", "out", "heroMaqueta.markup.ts"), "utf8");
  return JSON.parse(src.match(/HERO_MAQUETA_MARKUP = (".*")\n/)[1]);
})();
const stackHtml = `<div class="iso-hero hero-stack" data-stack>${`<style>${STYLE}</style>`}${LAYERS.map((l) => `<svg class="hero-layer hero-layer-${l.name}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">${l.markup}</svg>`).join("")}</div>`;
const refHtml = `<svg class="iso-hero" data-stack aria-hidden="true" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">${orig}</svg>`;
writeFileSync(join(HERE, "preview.html"), pageShell("Hero maqueta — capas", stackHtml, true));
writeFileSync(join(HERE, "ref.html"), pageShell("Hero maqueta — SVG único (referencia)", refHtml, false));
// lines-check pages: the same stacks with the kit's class names added back (iso-line, iso-edge…)
// so the skill's line-end check (scripts/lines.mjs) recognises them; the stack is the .iso-plate.
const REV = { f: "fill", s: "shade", t: "top", l: "line", o: "solid", h: "halo", e: "edge", c: "crease", b: "bevel", d: "dots", fd: "fade", sl: "seamless", w: "wire" };
const unprefix = (html) => html.replace(/ class="([^"]*)"/g, (m, cls) => ` class="${cls.split(/\s+/).flatMap((c) => { const r = c.match(/^hero-([a-z]+)$/); return r && REV[r[1]] ? [c, `iso-${REV[r[1]]}`] : [c]; }).join(" ")}"`);
writeFileSync(join(HERE, "lines-layers.html"), unprefix(pageShell("lines — capas", stackHtml.replace('class="iso-hero hero-stack"', 'class="iso-hero hero-stack iso-plate"'), true)));
writeFileSync(join(HERE, "lines-ref.html"), unprefix(pageShell("lines — SVG único", `<div class="iso-plate" style="position:absolute;inset:0">${refHtml}</div>`, false)));
console.log("wrote preview.html, ref.html, lines-layers.html, lines-ref.html");

function pageShell(title, art, layered) {
  return `<!doctype html>
<html lang="es" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
:root{--paper:#fbf6f0;--ink:#1b2a4a;--body:#42475a;--muted:#7a6a4e;--coral:#c24a5a;--primary-fill:#1b2a4a;--border:#ece2d2;color-scheme:light}
[data-theme="dark"]{--paper:#12141b;--ink:#f1ece1;--body:#c3bdaf;--muted:#9d9588;--coral:#ff7a6f;--primary-fill:#b23a36;--border:#2e3340;color-scheme:dark}
*{box-sizing:border-box}
html,body{margin:0;background:var(--paper);color:var(--ink)}
body{font-family:system-ui,sans-serif;min-height:100vh;overflow-x:hidden}
.nav{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:20px 48px;font-weight:700;letter-spacing:.04em}
.nav span{flex:1}
.toggle{font:500 14px/1 system-ui,sans-serif;color:var(--ink);background:transparent;border:1px solid var(--border);border-radius:999px;padding:10px 16px;cursor:pointer}
.hero{position:relative;max-width:1440px;margin:0 auto;padding:0 32px}
.stage{position:relative;width:100%;aspect-ratio:1200/640}
.stage [data-stack]{position:absolute;inset:0;width:100%;height:100%;display:block}
.copy{position:absolute;left:0;top:0;width:39.2%;height:100%;display:flex;flex-direction:column;justify-content:center;padding-left:clamp(16px,4vw,64px)}
h1{font-family:Georgia,serif;font-weight:800;font-size:clamp(36px,4.2vw,60px);line-height:1.08;margin:18px 0}
.sub{font-size:clamp(15px,1.25vw,18px);line-height:1.6;color:var(--body);margin:0;max-width:30ch}
[data-hide-copy] .copy{display:none}
[data-crop-force="mobile"] .stage{aspect-ratio:auto}
[data-crop-force="mobile"] .stage [data-stack]{position:${layered ? "relative" : "static"};height:auto;${layered ? "aspect-ratio:676/478" : ""}}
[data-crop-force="mobile"] .copy{position:static;width:auto;height:auto;padding:8px 4px 24px}
@media (max-width:760px){
  .nav{padding:16px 20px}
  .hero{padding:0 16px}
  .stage{aspect-ratio:auto}
  .stage [data-stack]{position:${layered ? "relative" : "static"};height:auto;${layered ? "aspect-ratio:676/478" : ""}}
  .copy{position:static;width:auto;height:auto;padding:8px 4px 24px}
}
</style>
</head>
<body>
<nav class="nav"><span>${layered ? "Capas" : "SVG único"} · Japón 2027</span><button class="toggle" type="button" id="crop">Recorte: auto</button><button class="toggle" type="button" id="toggle">Cambiar a oscuro</button></nav>
<section class="hero">
  <div class="stage">
    ${art}
    <div class="copy"><h1>Japón, de punta a punta</h1><p class="sub">De Tokio a Kioto y más allá, en tren bala y a nuestro ritmo.</p></div>
  </div>
</section>
<script>
const VB={desktop:"0 0 ${W} ${H}",mobile:"${mob.join(" ")}"};
const root=document.documentElement,btn=document.getElementById("toggle"),cropBtn=document.getElementById("crop");
const q=new URLSearchParams(location.search);
const set=t=>{root.dataset.theme=t;btn.textContent=t==="dark"?"Cambiar a claro":"Cambiar a oscuro"};
if(q.get("theme"))set(q.get("theme"));
if(q.has("nocopy"))document.body.dataset.hideCopy="";
if(q.has("css")){const st=document.createElement("style");st.textContent=q.get("css");document.head.append(st);}
btn.addEventListener("click",()=>set(root.dataset.theme==="dark"?"light":"dark"));
// Crop: auto follows (max-width:760px) like the site; the button forces desktop/mobile.
const stack=document.querySelector("[data-stack]"),mq=matchMedia("(max-width:760px)");
let force=q.get("crop");
const fit=()=>{
  const mobile=force?force==="mobile":mq.matches;
  const vb=mobile?VB.mobile:VB.desktop;
  ${layered ? `for(const svg of stack.querySelectorAll(".hero-layer"))svg.setAttribute("viewBox",vb);
  if(mobile)stack.dataset.crop="mobile";else delete stack.dataset.crop;
` : `stack.setAttribute("viewBox",vb);`}
  if(force==="mobile")document.body.dataset.cropForce="mobile";else delete document.body.dataset.cropForce;
  cropBtn.textContent="Recorte: "+(force??"auto")+(mobile?" (móvil)":" (escritorio)");
};
cropBtn.addEventListener("click",()=>{force=force==null?"mobile":force==="mobile"?"desktop":null;fit()});
fit();mq.addEventListener("change",fit);
// ?t=ms freezes every animation at that time (for side-by-side captures): the pose at t is read
// back from the computed style and pinned inline, so screenshots don't depend on how a paused
// compositor animation is flushed.
if(q.has("t")){const t=+q.get("t");const pins=document.getAnimations().map(a=>{a.pause();a.currentTime=t;const el=a.effect.target,cs=getComputedStyle(el);return [el,cs.transform,cs.opacity]});
  for(const [el,tr,op] of pins){el.style.animation="none";el.style.transform=tr;el.style.opacity=op;}}
</script>
</body>
</html>`;
}

// The chōchin glow is lamp light, not body: its blurred pool reaches past the lantern by design.
A.auditOrExit(R, P, { cover: ["chochin*"] });
