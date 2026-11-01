// Day 22 — Nara: Tōdai-ji's Daibutsu-den (the Great Buddha Hall), as an isometric asset for
// the japan-2027 landing (same set as the day-21 pilot).
// On the pilot's plinth: a gravel courtyard with moss beds, the stone platform (kidan) with its
// front stair, and the hall: a lower storey of white plaster between dark wood posts and beams
// with tall doors in the middle bays, the pent roof (mokoshi) with the curved karahafu gable over
// the entrance, the upper storey with the great window (kangen-mado) through which the Buddha's
// face is seen on feast days, and the huge hip-and-gable roof with two gold shibi on its ridge.
// In front, the octagonal bronze lantern; two of Nara's deer graze the courtyard.
// Motion (CSS only, stopped under prefers-reduced-motion): two thin wisps of incense smoke
// rise from the lantern's crown and fade, out of phase; the front deer dips its head
// to graze and lifts it again.
//
//   node build.mjs   → day22-light/dark .svg/.html, ../out/day22Iso.markup.ts

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  k, G, P, SITE, baseAccents, PLINTH, at, S, L, ac, byDepth, pathOf, count, grow,
  prism, frameXZ, frameYZ, roofOf, courses, irimoya, shibi,
  faceLine, faceRect, slab, cyl, solid, plinth, stone, minify, emit, swingInPlane, amRise,
} from "../common-d20-25.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

const accentsFor = (theme) => ({ ...baseAccents(theme), deer: SITE[theme].brown });
const gold = ac("gold");
const plaster = ac("plaster");
const roofAc = ac("roof");
const wood = ac("wood");
const moss = ac("moss");
const pine = ac("pine");
const deerAc = ac("deer");

// ---------- world ----------
const Z0 = 3; // courtyard
const KIDAN = { x: -58, y: -52, w: 66, d: 76, r: 0.6 };
const ZK = Z0 + 5; // platform top
const CY = KIDAN.y + KIDAN.d / 2; // the hall's axis (the front faces +x)
const WALL1 = { x: -52, y: CY - 30, w: 50, d: 60, r: 0 };
const WALL2 = k.insetPlan(WALL1, 3.5);
const Z = { w1: 31, mIn: 37, w2: 53, rIn: 65, ridge: 80 };

// ---------- ground ----------
const GROUND = k.insetPlan(PLINTH, 3.5);
const ground = () => slab(GROUND, 0, Z0, { tone: "mid", crease: "none", inner: "" }, 6);
// Moss beds either side of the approach, and the paved approach itself.
function beds() {
  const out = [];
  const bed1 = [[16, -60.5], [74.5, -60.5], [74.5, -8], [20, -8], [16, -14]];
  const bed2 = [[16, 38], [20, 32], [74.5, 32], [74.5, 68.5], [16, 68.5]];
  const bed3 = [[-64.5, 30], [8, 30], [12, 34], [12, 68.5], [-64.5, 68.5]];
  for (const ring of [bed1, bed3, bed2]) out.push(moss(count(S(k.extrude(ring, Z0, 0.8, P, { convex: false }), { tone: "mid", crease: "faint" }))));
  // The approach: a strip of paving from the plinth edge to the stair, joints edge to edge.
  const ap = { x: 8, y: CY - 7, w: 66.5, d: 14, r: 0 };
  const joints = [];
  for (let x = ap.x + 5; x < ap.x + ap.w - 1; x += 5) joints.push(pathOf([at([x, ap.y, Z0 + 0.4]), at([x, ap.y + ap.d, Z0 + 0.4])]));
  joints.push(pathOf([at([ap.x, CY, Z0 + 0.4]), at([ap.x + ap.w, CY, Z0 + 0.4])]));
  out.push(slab(ap, Z0, 0.4, { tone: "lo", crease: "none", inner: L(joints.join(""), { tone: "faint" }) }));
  return out.join("");
}

// ---------- platform and stair ----------
function kidan() {
  const out = [];
  out.push(slab(KIDAN, Z0, ZK - Z0, { tone: "mid", inner: L(k.sideSeam(KIDAN, ZK - 1.4, P, 2), { tone: "faint" }) }, 2, 0.4));
  // The front stair, centred on the axis: five steps, profile in x–z.
  const xs = KIDAN.x + KIDAN.w;
  const n = 5;
  const h = (ZK - Z0) / n;
  const pts = [[xs - 0.5, Z0], [xs + n * 1.6, Z0]];
  for (let i = 1; i <= n; i++) {
    pts.push([xs + (n - i + 1) * 1.6, Z0 + h * i]);
    pts.push([xs + (n - i) * 1.6, Z0 + h * i]);
  }
  pts[pts.length - 1] = [xs - 0.5, ZK];
  out.push(count(S(prism(pts, frameXZ(0), CY - 9, CY + 9), { tone: "mid", crease: "faint" })));
  return out.join("");
}

// ---------- the hall ----------
const xf1 = WALL1.x + WALL1.w;
const yf1 = WALL1.y + WALL1.d;
const POSTS_X = Array.from({ length: 8 }, (_, i) => WALL1.y + (WALL1.d * i) / 7); // along the front (+x face)
const POSTS_Y = Array.from({ length: 7 }, (_, i) => WALL1.x + (WALL1.w * i) / 6); // along the +y face

function lower() {
  const out = [];
  // Plaster with the tall doors of the three middle bays and lattice windows in the others.
  const panes = [];
  const marks = [];
  for (let i = 0; i < 7; i++) {
    const u0 = POSTS_X[i] + 1.4;
    const u1 = POSTS_X[i + 1] - 1.4;
    if (i >= 2 && i <= 4) {
      panes.push(faceRect("x", xf1, u0, u1, ZK, ZK + 15));
      marks.push(faceLine("x", xf1, (u0 + u1) / 2, ZK, (u0 + u1) / 2, ZK + 15));
    } else {
      marks.push(faceRect("x", xf1, u0 + 0.6, u1 - 0.6, ZK + 6, ZK + 14));
      for (let z = ZK + 8; z < ZK + 14; z += 2) marks.push(faceLine("x", xf1, u0 + 0.6, z, u1 - 0.6, z));
    }
  }
  for (let i = 0; i < 6; i++) {
    const u0 = POSTS_Y[i] + 1.4;
    const u1 = POSTS_Y[i + 1] - 1.4;
    marks.push(faceRect("y", yf1, u0 + 0.6, u1 - 0.6, ZK + 6, ZK + 14));
    for (let z = ZK + 8; z < ZK + 14; z += 2) marks.push(faceLine("y", yf1, u0 + 0.6, z, u1 - 0.6, z));
  }
  const doors = wood(`<path d="${panes.join("")}" style="fill:var(--anatomy-shade-1);stroke:none"/>`);
  out.push(plaster(slab(WALL1, ZK, Z.w1 - ZK, { tone: "mid", inner: doors + L(marks.join(""), { tone: "lo" }) }, 2)));
  const posts = [...POSTS_X.map((y) => [xf1, y]), ...POSTS_Y.slice(0, -1).map((x) => [x, yf1])];
  for (const [x, y] of byDepth(posts, ([x, y]) => [x, y, 0])) {
    out.push(wood(slab({ x: x - 0.85, y: y - 0.85, w: 1.7, d: 1.7, r: 0 }, ZK, Z.w1 - ZK, { tone: "hi" }, 2)));
  }
  // Head beam (nageshi) across the posts on both faces.
  out.push(wood(slab({ x: WALL1.x - 0.4, y: yf1 - 0.9, w: WALL1.w + 1.8, d: 2.1, r: 0 }, ZK + 16, 2, { tone: "hi" }, 2)));
  out.push(wood(slab({ x: xf1 - 0.9, y: WALL1.y - 0.4, w: 2.1, d: WALL1.d + 1.8, r: 0 }, ZK + 16, 2, { tone: "hi" }, 2)));
  return out.join("");
}

function upper() {
  const xf = WALL2.x + WALL2.w;
  const yf = WALL2.y + WALL2.d;
  const marks = [];
  // Framing: posts as lines from the roof line to the eave, edge to edge.
  for (let i = 1; i < 7; i++) {
    const u = WALL2.y + (WALL2.d * i) / 7;
    if (i === 3 || i === 4) continue;
    marks.push(faceLine("x", xf, u, Z.mIn, u, Z.w2));
  }
  for (let i = 1; i < 6; i++) marks.push(faceLine("y", yf, WALL2.x + (WALL2.w * i) / 6, Z.mIn, WALL2.x + (WALL2.w * i) / 6, Z.w2));
  for (const z of [Z.w2 - 3]) {
    marks.push(pathOf([[xf, WALL2.y, z], [xf, yf, z], [WALL2.x, yf, z]].map(at)));
  }
  // The kangen-mado: a wide window in the two middle bays, with its lattice.
  const u0 = WALL2.y + (WALL2.d * 3) / 7;
  const u1 = WALL2.y + (WALL2.d * 4) / 7;
  const w0 = u0 - 4;
  const w1 = u1 + 4;
  const z0 = Z.mIn + 3.5;
  const z1 = Z.w2 - 5;
  marks.push(faceRect("x", xf, w0, w1, z0, z1));
  for (let u = w0 + 2; u < w1 - 0.5; u += 2) marks.push(faceLine("x", xf, u, z0, u, z1));
  marks.push(faceLine("x", xf, w0, (z0 + z1) / 2, w1, (z0 + z1) / 2));
  const win = `<path d="${faceRect("x", xf, w0, w1, z0, z1)}" style="fill:var(--anatomy-lo);stroke:none;opacity:.6"/>`;
  return plaster(slab(WALL2, Z.mIn, Z.w2 - Z.mIn, { tone: "mid", inner: win + L(marks.join(""), { tone: "lo" }) }, 2));
}

// The karahafu over the entrance: a cusped arch band in y–z, run back along x into the roof.
function karahafu() {
  const hw = 12;
  const zE = Z.w1 + 1.8; // eave top (fascia)
  const peak = 8.5;
  const t = 2.2;
  const N = 18;
  const outer = [];
  for (let i = 0; i <= N; i++) {
    const s = -1 + (2 * i) / N; // −1..1 across
    // A bell: rounded over the middle, sweeping out concave toward the ends.
    const z = zE + (peak * (1 + Math.cos(Math.PI * s))) / 2;
    outer.push([CY + s * hw, z]);
  }
  const inner = outer.map(([y, z]) => [y, z - t]).slice(1, -1).reverse();
  const poly = [...outer, [CY + hw, zE - t], ...inner, [CY - hw, zE - t]];
  const front = xf1 + 6.4;
  const back = xf1 + 0.5;
  const out = [];
  // The tympanum under the arch: a board set back from the front, filling the arch.
  const tym = [[CY - hw + 3.2, zE - 0.6], [CY + hw - 3.2, zE - 0.6], ...inner.filter(([y]) => Math.abs(y - CY) < hw - 3.2)];
  out.push(wood(solid(prism(tym, frameYZ(0), back + 1, front - 1.2), { tone: "hi" })));
  out.push(roofAc(solid(prism(poly, frameYZ(0), back, front), { tone: "hi" })));
  // Courses on the curved roof, parallel to its front edge.
  const lines = [];
  // Only over the segments that face the viewer (the far side of the bell turns away).
  const V = G.viewOf(P);
  const seen = outer.slice(0, -1).map(([y0, z0], i) => {
    const [y1, z1] = outer[i + 1];
    return V[1] * -(z1 - z0) + V[2] * (y1 - y0) > 0;
  });
  for (const x of [front - 2, front - 4]) {
    let run = [];
    const flush = () => { if (run.length > 1) lines.push(pathOf(run.map(([y, z]) => at([x, y, z + 0.02])))); run = []; };
    outer.slice(0, -1).forEach((p, i) => {
      if (seen[i]) { if (!run.length) run.push(p); run.push(outer[i + 1]); } else flush();
    });
    flush();
  }
  out.push(roofAc(L(lines.join(""), { tone: "lo" })));
  // A gold ornament (gegyo) on the board under the peak.
  const F = G.frameAlong([front - 1.2, CY, zE + peak - t - 2.4], [1, 0, 0]);
  out.push(gold(solid(G.disc(0, 0.5, 1.5, F, P), { tone: "hi", lit: true })));
  return out.join("");
}

function hall() {
  const out = [lower()];
  const mokoshi = roofOf(WALL1, 6.4, Z.w1 + 0.2, grow(WALL2, 0.5), Z.mIn, { lift: 2.2, flare: 1.6, fascia: 1.6 });
  out.push(roofAc(count(S(mokoshi.paths, { tone: "hi" })) + L(courses(mokoshi, [0.45]), { tone: "lo" })));
  out.push(upper());
  out.push(karahafu());
  const inner = { x: WALL2.x + WALL2.w / 2 - 11, y: WALL2.y + 7, w: 22, d: WALL2.d - 14 };
  const main = roofOf(WALL2, 10, Z.w2 + 0.2, inner, Z.rIn, { lift: 3.6, flare: 2.6, fascia: 2 });
  out.push(roofAc(count(S(main.paths, { tone: "hi" })) + L(courses(main, [0.3, 0.6, 0.85]), { tone: "lo" })));
  const ir = irimoya(inner, Z.rIn, Z.ridge, { axis: "y", inset: 2.4, ov: 1.6, t: 1.6, e: 2.2, slope: (Z.rIn - Z.w2 - 2) / 21, ridgeW: 2, ridgeH: 2.2 });
  // The gable face: plaster with dark framing, rooted edge to edge.
  const { c0, c1, cm, zIn, zTop, at: ya } = ir.triFace;
  const tri = [];
  for (const f of [0.25, 0.5, 0.75]) {
    const c = c0 + (c1 - c0) * f;
    const zt = zIn + (zTop - zIn) * (1 - Math.abs(c - cm) / (cm - c0));
    tri.push(pathOf([at([c, ya, zIn]), at([c, ya, zt])]));
  }
  out.push(plaster(solid(ir.tsuma, { tone: "mid", inner: L(tri.join(""), { tone: "lo" }) })));
  out.push(roofAc(solid(ir.gable, { tone: "hi", inner: L(ir.courses, { tone: "lo" }) })));
  out.push(roofAc(solid(ir.ridge, { tone: "hi" })));
  const [e0, e1] = ir.ends;
  out.push(gold(solid(shibi([e0[0], e0[1] + 2.4, e0[2]], "y", -1, 1.55, 1.6), { tone: "hi", lit: true })));
  out.push(gold(solid(shibi([e1[0], e1[1] - 2.4, e1[2]], "y", 1, 1.55, 1.6), { tone: "hi", lit: true })));
  return out.join("");
}

// ---------- the octagonal bronze lantern ----------
function bronzeLantern(x, y, z, s = 1.25) {
  const out = [];
  const u = (v) => v * s;
  out.push(cyl(x, y, u(4.2), z, u(1.6), { tone: "mid" }, 8, 0.3));
  out.push(cyl(x, y, u(2.8), z + u(1.6), u(2.2), { tone: "mid" }, 8, 0.2));
  out.push(wood(cyl(x, y, u(0.9), z + u(3.8), u(5.6), { tone: "hi" }, 8)));
  out.push(wood(cyl(x, y, u(3), z + u(9.4), u(0.9), { tone: "hi" }, 8, 0.2)));
  const lattice = [];
  for (let i = 0; i < 8; i++) {
    const a0 = (i / 8) * Math.PI * 2;
    const a1 = ((i + 1) / 8) * Math.PI * 2;
    const p0 = [x + u(2.2) * Math.cos(a0), y + u(2.2) * Math.sin(a0)];
    const p1 = [x + u(2.2) * Math.cos(a1), y + u(2.2) * Math.sin(a1)];
    const mid = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
    const nrm = [Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2)];
    if (nrm[0] * Math.cos((40 * Math.PI) / 180) + nrm[1] * Math.sin((40 * Math.PI) / 180) < 0.2) continue;
    lattice.push(pathOf([at([mid[0], mid[1], z + u(10.3)]), at([mid[0], mid[1], z + u(14.3)])]));
  }
  out.push(wood(cyl(x, y, u(2.2), z + u(10.3), u(4), { tone: "hi", inner: gold(L(lattice.join(""), { tone: "mid" })) }, 8)));
  const F = G.frameAlong([x, y, z + u(14.3)], [0, 0, 1]);
  out.push(wood(solid(G.solidOf([[0, u(3.6)], [u(0.7), u(3.6)], [u(2.8), u(0.7)]], F, P, { steps: 8 }), { tone: "hi" })));
  out.push(gold(solid(G.sphereOf([x, y, z + u(18)], u(0.9), P, { steps: 20 }), { tone: "hi", lit: true })));
  // Incense smoke: two thin wisps from the crown, each rising and fading, half a cycle apart.
  const z0 = z + u(19);
  const wisp = (ph, sway) => {
    const pts = [];
    for (let i = 0; i <= 14; i++) {
      const t = i / 14;
      const w = Math.sin(ph + t * 7.5) * sway * t;
      pts.push(at([x + w * 0.6, y - w, z0 + t * 11]));
    }
    return L(pathOf(pts), { tone: "mid", free: true });
  };
  out.push(amRise(wisp(0, 1.4), [0, 0, 4], { period: 7400, delay: 0 }));
  out.push(amRise(wisp(2.2, 1.1), [0, 0, 4], { period: 7400, delay: 3700 }));
  return out.join("");
}

// ---------- deer ----------
const DEER = [[-2.5, 0], [-1.9, 0], [-1.8, 3], [1.9, 3], [2.1, 0], [2.7, 0], [2.8, 3.4], [3, 5.4], [3.5, 7.4], [4.6, 7.5], [4.6, 8], [3.9, 8.6], [3.8, 9.4], [3.4, 8.8], [2.9, 8.6], [2.5, 6.6], [2, 6.1], [-2.4, 6], [-2.9, 5.7], [-2.8, 5], [-2.6, 3.6]];
// For the grazing deer: the body without the neck, and the neck and head as their own piece,
// joined along the body's withers edge, so the head can dip about that joint.
const DEER_BODY = [[-2.5, 0], [-1.9, 0], [-1.8, 3], [1.9, 3], [2.1, 0], [2.7, 0], [2.8, 3.4], [3, 5.4], [2.3, 6.1], [-2.4, 6], [-2.9, 5.7], [-2.8, 5], [-2.6, 3.6]];
const DEER_NECK = [[2.3, 6.1], [3, 5.4], [3.5, 7.4], [4.6, 7.5], [4.6, 8], [3.9, 8.6], [3.8, 9.4], [3.4, 8.8], [2.9, 8.6], [2.5, 6.6]];
function grazingDeer(x, y, z, sc = 1.45) {
  const out = [`<path class="iso-halo" d="${k.haloOf({ x: x - 5, y: y - 5, w: 10, d: 10, r: 5 }, z, 0.1, P)}" style="filter:blur(3px)"/>`];
  const part = (poly) => deerAc(solid(prism(poly.map(([u, v]) => [x + u * sc, z + v * sc]), frameXZ(0), y - 1.3, y + 1.3), { tone: "hi" }));
  // The neck is drawn over the body; negative angles turn it forward and down (it faces +x).
  out.push(part(DEER_BODY));
  out.push(swingInPlane(part(DEER_NECK), [x + 2.65 * sc, y, z + 5.75 * sc], [1, 0, 0], [0, 0, 1], { from: 0, to: -14, period: 5600, delay: 900 }));
  return out.join("");
}
function deer(x, y, z, facing = "x", dir = 1, sc = 1.45) {
  const poly = DEER.map(([u, v]) => [u * dir * sc, v * sc]);
  const p = dir > 0 ? poly : poly.reverse();
  const out = [`<path class="iso-halo" d="${k.haloOf({ x: x - 5, y: y - 5, w: 10, d: 10, r: 5 }, z, 0.1, P)}" style="filter:blur(3px)"/>`];
  const sh = facing === "x"
    ? prism(p.map(([u, v]) => [x + u, z + v]), frameXZ(0), y - 1.3, y + 1.3)
    : prism(p.map(([u, v]) => [y + u, z + v]), frameYZ(0), x - 1.3, x + 1.3);
  out.push(deerAc(solid(sh, { tone: "hi" })));
  return out.join("");
}

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

// ---------- assemble ----------
const front = [];
front.push({ at: [40, CY, Z0], svg: bronzeLantern(40, CY, Z0 + 0.4) });
front.push({ at: [52, 46, Z0], svg: grazingDeer(52, 46, Z0 + 0.8) });
front.push({ at: [30, 12, Z0], svg: deer(30, 12, Z0, "y", -1) });
front.push({ at: [54, -40, Z0], svg: roundPine(54, -40, Z0 + 0.8, 1.05) });
front.push({ at: [-40, 50, Z0], svg: roundPine(-40, 50, Z0 + 0.8, 1) });
const back = [];
back.push({ at: [26, -52, Z0], svg: roundPine(26, -52, Z0 + 0.8, 0.9) });
const stones = byDepth([[64, -20, 2.4, 2], [-14, 56, 2.8, 2.2], [66, 58, 2.2, 1.8]], (s) => [s[0], s[1], 0])
  .map(([x, y, r, h], i) => stone(x, y, r, h, Z0 + 0.8, i + 4)).join("");

const body = minify([
  plinth(),
  ground(),
  beds(),
  ...back.map((b) => b.svg),
  kidan(),
  hall(),
  stones,
  ...byDepth(front, (i) => i.at).map((i) => i.svg),
].join(""));

emit({
  dir: HERE,
  nn: 22,
  subject: "Daibutsu-den de Tōdai-ji",
  label: "Tōdai-ji's Great Buddha Hall in Nara in isometric view: the vast two-roofed wooden hall with gold ridge ornaments, the bronze lantern in front and two deer in the courtyard.",
  body,
  accentsFor,
  tokensNote: "--paper, --gold, --brown, --green, --ink",
  motionNote: "Movimiento ambiental solo CSS: dos hilos de humo de incienso suben del remate de la linterna de bronce y se desvanecen (desfasados) y el ciervo de delante baja y sube la cabeza para pastar; todo se detiene con prefers-reduced-motion.",
});
