// Day 24 — Hiroshima: the Atomic Bomb Dome (Genbaku Dōmu) by the Motoyasu River, as an
// isometric asset for the japan-2027 landing (same set as the day-21 pilot).
// Drawn with calm restraint and a muted palette, no motion. On the pilot's plinth: a lawn, the
// river along the front with its stone revetment, riverside steps and promenade, and the ruin
// as it is preserved: the brick shell of the former exhibition hall with broken wall tops and
// rows of empty windows, rubble and two fallen beams inside, the central stair tower and, on
// its drum, the bare steel ribs of the oval dome. A few trees and benches along the river.
//
//   node build.mjs   → day24-light/dark .svg/.html, ../out/day24Iso.markup.ts

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  k, G, P, SITE, mix, baseAccents, PLINTH, at, S, L, ac, byDepth, pathOf, count,
  prism, frameXZ, frameYZ, faceLine, slab, cyl, solid, plinth, stone, minify, emit,
} from "../common-d20-25.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

function accentsFor(theme) {
  const s = SITE[theme];
  const base = baseAccents(theme);
  return {
    water: base.water,
    ripple: base.ripple,
    moss: theme === "light" ? mix(s.green, s.paper, 0.5) : mix(s.green, s.paper, 0.4),
    pine: theme === "light" ? mix(s.green, s.paper, 0.15) : mix(s.green, s.paper, 0.15),
    wood: base.wood,
    // Brick, desaturated toward the page's own neutral: quiet in both themes.
    brick: theme === "light" ? mix(mix(s.brown, mix(s.paper, s.ink, 0.5), 0.35), s.paper, 0.35) : mix(mix(s.brown, mix(s.paper, s.ink, 0.5), 0.4), s.paper, 0.2),
  };
}
const brick = ac("brick");
const water = ac("water");
const moss = ac("moss");
const pine = ac("pine");
const wood = ac("wood");

// ---------- world ----------
const WATER_Z = 0.5;
const LAND_Z = 4;
const RIVER_X = 46; // the bank line; the river runs along y in front of it
const T = 1.8; // wall thickness
const HB = 27; // main block height above the ground
const ZG = LAND_Z;
const TOWER = { x: -14, y: -30, w: 24, d: 24, r: 0 };
const ZT = ZG + 46; // tower top
const DOME = { cx: TOWER.x + TOWER.w / 2, cy: TOWER.y + TOWER.d / 2, r: 10.6, z0: ZT + 4.6, h: 14 };

// ---------- ground ----------
const BASE = k.insetPlan(PLINTH, 3.5);
function river() {
  const out = [water(slab(BASE, 0, WATER_Z, { tone: "lo", crease: "none" }, 6))];
  // A few still ripple strokes on the river, fading at both ends (no motion).
  const strokes = [[56, -40, -18], [62, -4, 22], [54, 30, 52], [66, 44, 62]].map(([x, y0, y1]) => k.fadeLineSvg([at([x, y0, WATER_Z]), at([x, y1, WATER_Z])], { fade: [5, 5], tone: "mid" }));
  out.push(ac("ripple")(strokes.join("")));
  return out.join("");
}
function land() {
  const ring = [[BASE.x, BASE.y], [RIVER_X, BASE.y], [RIVER_X, BASE.y + BASE.d], [BASE.x, BASE.y + BASE.d]];
  // Revetment courses on the bank's river face (+x), wrapping the corner, end to end.
  const lines = [1.3, 2.6].map((z) => pathOf([[RIVER_X, BASE.y, z], [RIVER_X, BASE.y + BASE.d, z], [BASE.x, BASE.y + BASE.d, z]].map(at)));
  return moss(count(S(k.extrude(ring, 0, LAND_Z, P), { tone: "mid", crease: "faint", inner: L(lines.join(""), { tone: "faint" }) })));
}
// The promenade along the bank and the steps down to the water.
function promenade() {
  const out = [];
  const pr = { x: RIVER_X - 9, y: BASE.y, w: 9, d: BASE.d, r: 0 };
  const joints = [];
  for (let y = pr.y + 6; y < pr.y + pr.d - 1; y += 6) joints.push(pathOf([at([pr.x, y, LAND_Z + 0.3]), at([pr.x + pr.w, y, LAND_Z + 0.3])]));
  out.push(slab(pr, LAND_Z, 0.3, { tone: "lo", crease: "none", inner: L(joints.join(""), { tone: "faint" }) }));
  const steps = [[RIVER_X - 0.4, 0], [RIVER_X + 6, 0], [RIVER_X + 6, 1.3], [RIVER_X + 4, 1.3], [RIVER_X + 4, 2.6], [RIVER_X + 2, 2.6], [RIVER_X + 2, 3.9], [RIVER_X - 0.4, 3.9]];
  out.push(count(S(prism(steps, frameXZ(0), -2, 30), { tone: "mid", crease: "faint" })));
  return out.join("");
}

// ---------- the ruin ----------
// A wall: profile in the wall plane (u along it, z up) with a broken top, extruded through T.
// face "x": the plane x = c (u along y), "y": the plane y = c (u along x); c is the face the
// viewer sees (the larger coordinate), the wall runs back from it by T.
function windowShapes(face, c, u0, u1, top, storeys, opts = {}) {
  const { w = 3.2, step = 7, from = 3.5 } = opts;
  const holes = [];
  const topAt = (u) => {
    for (let i = 0; i < top.length - 1; i++) {
      const [ua, za] = top[i];
      const [ub, zb] = top[i + 1];
      if ((u - ua) * (u - ub) <= 0) return za + ((zb - za) * (u - ua)) / (ub - ua || 1);
    }
    return 0;
  };
  for (let u = Math.min(u0, u1) + from; u < Math.max(u0, u1) - 2; u += step) {
    for (const [z0, z1] of storeys) {
      if (Math.min(topAt(u - w / 2), topAt(u + w / 2)) < ZG + z1 + 1) continue;
      // An arched opening: straight jambs, a round head.
      const pts = [[u - w / 2, ZG + z0], [u + w / 2, ZG + z0], [u + w / 2, ZG + z1 - w / 2]];
      for (let i = 1; i < 6; i++) {
        const a = (Math.PI * i) / 6;
        pts.push([u + (w / 2) * Math.cos(a), ZG + z1 - w / 2 + (w / 2) * Math.sin(a)]);
      }
      pts.push([u - w / 2, ZG + z1 - w / 2]);
      holes.push(pathOf(pts.map(([uu, z]) => at(face === "x" ? [c, uu, z] : [uu, c, z])), true));
    }
  }
  const d = holes.join("");
  return d ? `<path class="iso-line" data-tone="lo" style="fill:var(--anatomy-shade-0)" d="${d}"/>` : "";
}
const STOREYS = [[2.8, 8.6], [12, 17.8], [20.6, 25]];
function wall(face, c, u0, u1, top, storeys = STOREYS) {
  const poly = [[u0, ZG], [u1, ZG], ...top.map(([u, z]) => [u, ZG + z])];
  const [uA, uB] = [Math.min(u0, u1), Math.max(u0, u1)];
  const topW = top.map(([u, z]) => [u, ZG + z]);
  const win = windowShapes(face, c, uA, uB, topW, storeys);
  const sh = face === "x" ? prism(poly, frameYZ(0), c - T, c) : prism(poly, frameXZ(0), c - T, c);
  return brick(count(S(sh, { tone: "hi", crease: "faint", inner: win })));
}

const X0 = -60;
const X1 = 10;
const Y0 = -58;
const Y1 = 22;
// Back walls (their inner faces turn toward the viewer), then the interior, then the front.
function backWalls() {
  return [
    wall("x", X0 + T, Y0, Y1, [[Y1, 20], [15, 23], [8, HB], [-30, HB], [-36, 22], [-42, HB], [-47, 18], [-52, 14.5], [Y0, 12.5]]),
    wall("y", Y0 + T, X0, X1, [[X1, 15], [4, 18.5], [-3, HB], [-20, HB], [-25, 19.5], [-30, 15.5], [-37, 12.5], [-45, 14.5], [-52, 11.5], [X0, 13]]),
  ].join("");
}
function interior() {
  const out = [];
  out.push(moss(slab({ x: X0 + T, y: Y0 + T, w: X1 - X0 - 2 * T, d: Y1 - Y0 - 2 * T, r: 0 }, ZG, 0.6, { tone: "mid", crease: "none" })));
  const rubble = [[-46, -40, 3.8, 2.6], [-34, -6, 3, 2], [-50, 8, 3.4, 2.4], [-2, -48, 3, 2], [-26, 12, 2.6, 1.8], [-14, 14, 2.2, 1.6]];
  for (const [x, y, r, h] of byDepth(rubble, (s) => [s[0], s[1], 0])) out.push(stone(x, y, r, h, ZG + 0.6, x * 0.13 + y * 0.07, "mid"));
  // Two fallen beams leaning on the rubble.
  const beam = (x0, y0, z0, x1, y1, z1) => {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.hypot(dx, dy);
    const nx = (-dy / len) * 0.5;
    const ny = (dx / len) * 0.5;
    const poly = [[0, 0], [len, z1 - z0], [len, z1 - z0 + 1], [0, 1]];
    const F = { o: [x0, y0, z0], u: [dx / len, dy / len, 0], v: [0, 0, 1], a: [nx * 2, ny * 2, 0] };
    return brick(solid(prism(poly, F, -0.5, 0.5), { tone: "hi" }));
  };
  out.push(beam(-54, -22, ZG + 0.6, -40, -30, ZG + 4.6));
  out.push(beam(-22, 2, ZG + 0.6, -36, 12, ZG + 3.4));
  return out.join("");
}

function tower() {
  const out = [];
  const xf = TOWER.x + TOWER.w;
  const yf = TOWER.y + TOWER.d;
  // Tall arched windows on the two visible faces, below and above the main block's cornice.
  const block = (z0, z1, st) => {
    const top = (u0, u1) => [[u1, z1], [u0, z1]];
    const opts = { w: 2.8, step: 5.2, from: 3.4 };
    const win = windowShapes("x", xf, TOWER.y, yf, top(TOWER.y, yf), st, opts) + windowShapes("y", yf, TOWER.x, xf, top(TOWER.x, xf), st, opts);
    return brick(slab(TOWER, z0, z1 - z0, { tone: "hi", inner: win }, 2));
  };
  const ring = (z) => brick(slab(k.insetPlan(TOWER, -0.7), z, 1.1, { tone: "hi" }, 2, 0.2));
  out.push(block(ZG, ZG + HB, [[3, 9.5], [12.5, 19], [21, 25.5]]));
  out.push(ring(ZG + HB));
  out.push(block(ZG + HB + 1.1, ZT, [[HB + 3.5, HB + 9.5], [HB + 12, HB + 16]]));
  out.push(ring(ZT - 0.2));
  // The drum, with its window marks, and the base ring of the dome.
  const marks = [];
  const V = [Math.cos((40 * Math.PI) / 180), Math.sin((40 * Math.PI) / 180)];
  const R = DOME.r + 0.2;
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    if (Math.cos(a) * V[0] + Math.sin(a) * V[1] < 0.15) continue;
    const x = DOME.cx + Math.cos(a) * R;
    const y = DOME.cy + Math.sin(a) * R;
    marks.push(pathOf([at([x, y, ZT + 1.6]), at([x, y, ZT + 3.6])]));
  }
  // The drum is a hollow ring: through it, the dark void of the stair hall.
  const voidRing = Array.from({ length: 36 }, (_, i) => {
    const a = (i / 36) * Math.PI * 2;
    return at([DOME.cx + Math.cos(a) * (R - 1), DOME.cy + Math.sin(a) * (R - 1), ZT + 0.9]);
  });
  out.push(brick(`<path d="${pathOf(voidRing, true)}" style="fill:var(--anatomy-lo);stroke:none;opacity:.7"/>`));
  const F = G.frameAlong([DOME.cx, DOME.cy, ZT + 0.9], [0, 0, 1]);
  out.push(brick(solid(G.ringBand(0, 3.6, R - 1, R, F, P), { tone: "hi", inner: L(marks.join(""), { tone: "lo" }) })));
  out.push(brick(solid(G.ringBand(3.6, 4.2, R - 1.2, R + 0.6, F, P), { tone: "hi" })));
  return out.join("");
}

// The steel skeleton of the dome: ribs on quarter-ellipses from the ring to the lantern ring,
// with two hoops. The far half first, faint; then the lantern ring; then the near half.
function dome() {
  const { cx, cy, r, z0, h } = DOME;
  const V = [Math.cos((40 * Math.PI) / 180), Math.sin((40 * Math.PI) / 180)];
  const tTop = Math.acos(1.8 / r);
  const ribPts = (a) => Array.from({ length: 13 }, (_, i) => {
    const t = (tTop * i) / 12;
    return at([cx + Math.cos(a) * r * Math.cos(t), cy + Math.sin(a) * r * Math.sin(Math.PI / 2) * Math.cos(t), z0 + h * Math.sin(t)]);
  });
  const near = (a) => Math.cos(a) * V[0] + Math.sin(a) * V[1] >= 0;
  const back = [];
  const front = [];
  const N = 20;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2 + Math.PI / N;
    (near(a) ? front : back).push(pathOf(ribPts(a)));
  }
  // Hoops at two heights, split at the silhouette into far and near halves.
  const split = Math.atan2(V[1], V[0]);
  for (const t of [0.4, 0.82]) {
    const rr = r * Math.cos(t);
    const zz = z0 + h * Math.sin(t);
    const arc = (from) => pathOf(Array.from({ length: 25 }, (_, i) => {
      const a = from + (Math.PI * i) / 24;
      return at([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, zz]);
    }));
    back.push(arc(split + Math.PI / 2));
    front.push(arc(split - Math.PI / 2));
  }
  const zTop = z0 + h * Math.sin(tTop);
  const ring = brick(cyl(cx, cy, 2, zTop - 0.45, 1, { tone: "hi" }, 16));
  return L(back.join(""), { tone: "mid" }) + ring + L(front.join(""), { tone: "hi" });
}

function frontWalls() {
  return {
    right: wall("x", X1, Y0, TOWER.y, [[TOWER.y, HB], [-36, 21.5], [-40, 23.5], [-46, 16], [-51, 13.5], [Y0, 15]]),
    left: wall("x", X1, TOWER.y + TOWER.d, Y1, [[Y1, 22.5], [17, HB], [TOWER.y + TOWER.d, HB]]),
    side: wall("y", Y1, X0, X1, [[X1, HB], [-18, HB], [-23, 20.5], [-30, 22.5], [-37, 16.5], [-44, 19.5], [X0, 21.5]]),
  };
}

// ---------- trees and benches ----------
function roundTree(x, y, z, s = 1) {
  const out = [];
  out.push(`<path class="iso-halo" d="${k.haloOf({ x: x - 6 * s, y: y - 6 * s, w: 12 * s, d: 12 * s, r: 6 * s }, z, 0.1, P)}" style="filter:blur(4px)"/>`);
  out.push(wood(cyl(x, y, 0.9 * s, z, 8 * s, { tone: "hi" }, 12)));
  const blobs = byDepth([[x - 1.8 * s, y + 1 * s, z + 9.5 * s, 4.4 * s], [x + 1.6 * s, y - 1.2 * s, z + 12 * s, 3.8 * s]], (b) => b);
  for (const [bx, by, bz, r] of blobs) out.push(pine(solid(G.sphereOf([bx, by, bz], r, P, { steps: 20 }), { tone: "hi" })));
  return out.join("");
}
function bench(x, y) {
  return [
    slab({ x: x - 1, y: y - 3.4, w: 2, d: 0.8, r: 0 }, LAND_Z + 0.3, 1.6, { tone: "mid" }, 2),
    slab({ x: x - 1, y: y + 2.6, w: 2, d: 0.8, r: 0 }, LAND_Z + 0.3, 1.6, { tone: "mid" }, 2),
    slab({ x: x - 1.3, y: y - 4, w: 2.6, d: 8, r: 0 }, LAND_Z + 1.9, 0.6, { tone: "hi" }, 2, 0.15),
  ].join("");
}

// ---------- assemble ----------
const fw = frontWalls();
const front = [];
front.push({ at: [28, 44, 0], svg: roundTree(28, 44, LAND_Z, 1.05) });
front.push({ at: [-30, 50, 0], svg: roundTree(-30, 50, LAND_Z, 1) });
front.push({ at: [26, -50, 0], svg: roundTree(26, -50, LAND_Z, 0.95) });
front.push({ at: [-58, 60, 0], svg: roundTree(-58, 60, LAND_Z, 0.9) });
front.push({ at: [41, 22, 0], svg: bench(41, 22) });
front.push({ at: [41, 56, 0], svg: bench(41, 56) });

const body = minify([
  plinth(),
  river(),
  land(),
  promenade(),
  ...byDepth(front.filter((f) => f.at[1] < -40), (i) => i.at).map((i) => i.svg),
  backWalls(),
  interior(),
  fw.right,
  tower(),
  dome(),
  fw.left,
  fw.side,
  ...byDepth(front.filter((f) => f.at[1] >= -40), (i) => i.at).map((i) => i.svg),
].join(""));

emit({
  dir: HERE,
  nn: 24,
  subject: "Cúpula de la Bomba Atómica de Hiroshima",
  label: "The Atomic Bomb Dome in Hiroshima in isometric view: the preserved brick ruin with the bare steel ribs of its dome, beside the Motoyasu River, drawn quietly in muted colours.",
  body,
  accentsFor,
  tokensNote: "--paper, --brown, --green, --ink",
  motionNote: "Sin movimiento (tratamiento sobrio, sin animación).",
});
