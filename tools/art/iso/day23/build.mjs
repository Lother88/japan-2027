// Day 23 — Katsuo-ji, the daruma temple in the hills of Minoh, as an isometric asset for the
// japan-2027 landing (same set as the day-21 pilot).
// On the pilot's plinth: moss ground with stones, a terrace held by a coursed stone wall, a
// stone stair climbing to it, and on the terrace the main hall (hondō): stone footing, wooden
// veranda, white plaster between wood posts, dark hip-and-gable roof. Red daruma everywhere, as
// at the temple: lined up the stair, along the top of the wall, stacked on a shelf in the
// forecourt and sitting on the stone lantern. Maples in leaf.
// Motion (CSS only, stopped under prefers-reduced-motion), like the other water days: the
// vermilion bridge's reflection breathes in the pond and fine ripple lines shimmer across it,
// out of phase.
//
//   node build.mjs   → day23-light/dark .svg/.html, ../out/day23Iso.markup.ts

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  k, G, P, a, SITE, baseAccents, PLINTH, at, S, L, ac, byDepth, pathOf, count, grow,
  prism, frameXZ, roofOf, courses, irimoya,
  faceLine, faceRect, slab, cyl, solid, plinth, stone, lantern, minify, emit,
} from "../common-d20-25.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

const accentsFor = (theme) => ({ ...baseAccents(theme), daruma: SITE[theme].coral, torii: SITE[theme].coral2 });
const daruAc = ac("daruma");
const plaster = ac("plaster");
const roofAc = ac("roof");
const wood = ac("wood");
const moss = ac("moss");
const pine = ac("pine");

// ---------- world ----------
const Z0 = 3;
const TER = { x: -64.5, y: -60.5, w: 82.5, d: 100.5, r: 0 }; // front faces at x = 18 and y = 40
const ZT = 21; // terrace top
const XS = TER.x + TER.w; // the stair foot line
const YC = -14; // stair and hall axis
const STEPS = 9;
const RUN = 2.4;
const RISE = (ZT - Z0) / STEPS;
const WALL = { x: -52, y: YC - 20, w: 34, d: 40, r: 0 };
const DECK = grow(WALL, 3.2);
const FOOT = grow(WALL, 4.6);
const Z = { foot: ZT + 2, deck: ZT + 3.6, w: ZT + 21, rIn: ZT + 29.5, ridge: ZT + 39 };

// ---------- daruma ----------
// An egg turned on the lathe, red, with a pale face patch toward the viewer.
const VIEW_DIR = [Math.cos((40 * Math.PI) / 180), Math.sin((40 * Math.PI) / 180), 0];
function daruma(x, y, z, s = 1) {
  const F = G.frameAlong([x, y, z], [0, 0, 1]);
  const prof = [[0, 1 * s], [0.7 * s, 1.27 * s], [1.6 * s, 1.08 * s], [2.4 * s, 0.4 * s]];
  const body = daruAc(solid(G.solidOf(prof, F, P, { steps: 10 }), { tone: "hi" }));
  // The face: an oval on the egg's front, in the plane facing the viewer.
  const c = [x + VIEW_DIR[0] * 1.02 * s, y + VIEW_DIR[1] * 1.02 * s, z + 1.62 * s];
  const side = [-VIEW_DIR[1], VIEW_DIR[0], 0];
  const ring = Array.from({ length: 10 }, (_, i) => {
    const t = (i / 10) * Math.PI * 2;
    return at([c[0] + side[0] * Math.cos(t) * 0.58 * s, c[1] + side[1] * Math.cos(t) * 0.58 * s, c[2] + Math.sin(t) * 0.46 * s]);
  });
  const d = pathOf(ring, true);
  const face = plaster(`<path class="iso-line" data-tone="mid" style="fill:var(--anatomy-face)" d="${d}"/>`);
  // Two blank eyes.
  const eyes = [-1, 1].map((e) => at([c[0] + side[0] * e * 0.24 * s, c[1] + side[1] * e * 0.24 * s, c[2] + 0.06 * s]));
  return body + face + k.dotsSvg(eyes, { size: 0.32 * s, tone: "hi" });
}

// ---------- ground, terrace, stair ----------
const GROUND = k.insetPlan(PLINTH, 3.5);
const ground = () => moss(slab(GROUND, 0, Z0, { tone: "mid", crease: "none" }, 6));

function terrace() {
  const out = [];
  // Coursed stone: horizontal courses wrapping the two visible faces, with staggered joints.
  const lines = [];
  const n = 5;
  const yf = TER.y + TER.d;
  for (let i = 1; i < n; i++) {
    const z = Z0 + ((ZT - Z0) * i) / n;
    lines.push(pathOf([[XS, TER.y, z], [XS, yf, z], [TER.x, yf, z]].map(at)));
  }
  for (let i = 0; i < n; i++) {
    const z0 = Z0 + ((ZT - Z0) * i) / n;
    const z1 = Z0 + ((ZT - Z0) * (i + 1)) / n;
    for (let u = TER.y + 4 + (i % 2) * 3.5; u < yf - 1; u += 7) if (Math.abs(u - YC) > 9) lines.push(faceLine("x", XS, u, z0, u, z1));
    for (let u = TER.x + 4 + (i % 2) * 3.5; u < XS - 1; u += 7) lines.push(faceLine("y", yf, u, z0, u, z1));
  }
  out.push(slab(TER, Z0, ZT - Z0, { tone: "mid", inner: L(lines.join(""), { tone: "faint" }) }, 2, 0.4));
  // Moss beds on the terrace, either side of the paved forecourt.
  out.push(moss(slab({ x: TER.x + 1.5, y: YC + 26, w: TER.w - 3, d: yf - (YC + 26) - 1.5, r: 3 }, ZT, 0.6, { tone: "mid" }, 4)));
  out.push(moss(slab({ x: -12, y: TER.y + 1.5, w: XS - 1.5 + 12, d: YC - 12 - TER.y - 1.5, r: 3 }, ZT, 0.6, { tone: "mid" }, 4)));
  return out.join("");
}

function stair() {
  const pts = [[XS - 0.5, Z0], [XS + STEPS * RUN, Z0]];
  for (let i = 1; i <= STEPS; i++) {
    pts.push([XS + (STEPS - i + 1) * RUN, Z0 + RISE * i]);
    pts.push([XS + (STEPS - i) * RUN, Z0 + RISE * i]);
  }
  pts[pts.length - 1] = [XS - 0.5, ZT];
  return count(S(prism(pts, frameXZ(0), YC - 7, YC + 7), { tone: "mid", crease: "faint" }));
}

// ---------- the hall ----------
function hall() {
  const out = [];
  const xf = WALL.x + WALL.w;
  const yf = WALL.y + WALL.d;
  out.push(slab(FOOT, ZT, Z.foot - ZT, { tone: "mid", inner: L(k.sideSeam(FOOT, ZT + 1, P, 2), { tone: "faint" }) }, 2, 0.3));
  out.push(wood(slab(DECK, Z.foot, Z.deck - Z.foot, { tone: "hi" }, 2, 0.3)));
  // Plaster with lattice doors in the bays: posts at even spacing on both visible faces.
  const postsX = Array.from({ length: 6 }, (_, i) => WALL.y + (WALL.d * i) / 5);
  const postsY = Array.from({ length: 5 }, (_, i) => WALL.x + (WALL.w * i) / 4);
  const marks = [];
  const zA = Z.deck + 1.5;
  const zB = Z.w - 4;
  for (let i = 0; i < 5; i++) {
    const u0 = postsX[i] + 1.2;
    const u1 = postsX[i + 1] - 1.2;
    marks.push(faceRect("x", xf, u0, u1, zA, zB));
    for (let z = zA + 2.2; z < zB - 0.5; z += 2.2) marks.push(faceLine("x", xf, u0, z, u1, z));
    marks.push(faceLine("x", xf, (u0 + u1) / 2, zA, (u0 + u1) / 2, zB));
  }
  for (let i = 0; i < 4; i++) {
    const u0 = postsY[i] + 1.2;
    const u1 = postsY[i + 1] - 1.2;
    marks.push(faceRect("y", yf, u0, u1, zA, zB));
    for (let z = zA + 2.2; z < zB - 0.5; z += 2.2) marks.push(faceLine("y", yf, u0, z, u1, z));
  }
  out.push(plaster(slab(WALL, Z.deck, Z.w - Z.deck, { tone: "mid", inner: L(marks.join(""), { tone: "lo" }) }, 2)));
  const posts = [...postsX.map((y) => [xf, y]), ...postsY.slice(0, -1).map((x) => [x, yf])];
  for (const [x, y] of byDepth(posts, ([x, y]) => [x, y, 0])) out.push(wood(slab({ x: x - 0.9, y: y - 0.9, w: 1.8, d: 1.8, r: 0 }, Z.deck, Z.w - Z.deck, { tone: "hi" }, 2)));
  out.push(wood(slab({ x: WALL.x - 0.4, y: yf - 0.8, w: WALL.w + 1.6, d: 1.9, r: 0 }, Z.w - 3, 2, { tone: "hi" }, 2)));
  out.push(wood(slab({ x: xf - 0.8, y: WALL.y - 0.4, w: 1.9, d: WALL.d + 1.6, r: 0 }, Z.w - 3, 2, { tone: "hi" }, 2)));
  // Roof: hip below, gable above (ridge along y).
  const inner = { x: WALL.x + WALL.w / 2 - 8.5, y: WALL.y + 6, w: 17, d: WALL.d - 12 };
  const roof = roofOf(WALL, 9, Z.w + 0.2, inner, Z.rIn, { lift: 3, flare: 2.2, fascia: 1.8 });
  out.push(roofAc(count(S(roof.paths, { tone: "hi" })) + L(courses(roof, [0.35, 0.7]), { tone: "lo" })));
  const ir = irimoya(inner, Z.rIn, Z.ridge, { axis: "y", inset: 1.8, ov: 1.4, t: 1.3, e: 1.8, slope: (Z.rIn - Z.w - 2) / 17.5, ridgeW: 1.6, ridgeH: 1.6 });
  out.push(plaster(solid(ir.tsuma, { tone: "mid" })));
  out.push(roofAc(solid(ir.gable, { tone: "hi", inner: L(ir.courses, { tone: "lo" }) })));
  out.push(roofAc(solid(ir.ridge, { tone: "hi" })));
  // Front steps up to the veranda.
  const xd = DECK.x + DECK.w;
  const pts = [[xd - 0.3, ZT], [xd + 3.6, ZT], [xd + 3.6, ZT + 1.13], [xd + 2.4, ZT + 1.13], [xd + 2.4, ZT + 2.27], [xd + 1.2, ZT + 2.27], [xd + 1.2, Z.deck], [xd - 0.3, Z.deck]];
  out.push(wood(count(S(prism(pts, frameXZ(0), YC - 5, YC + 5), { tone: "hi", crease: "faint" }))));
  return out.join("");
}

// A shelf (a stepped stand) of daruma in the forecourt.
function shelf(x, y) {
  const out = [];
  const pts = [[x - 3, ZT], [x + 3, ZT], [x + 3, ZT + 1.6], [x + 0.2, ZT + 1.6], [x + 0.2, ZT + 3.6], [x - 3, ZT + 3.6]];
  out.push(wood(count(S(prism(pts, frameXZ(0), y - 9, y + 9), { tone: "hi", crease: "faint" }))));
  const ds = [];
  for (const yy of [-6.5, -2.2, 2.2, 6.5]) ds.push([x - 1.4, y + yy, ZT + 3.6]);
  for (const yy of [-6.5, -2.2, 2.2, 6.5]) ds.push([x + 1.6, y + yy, ZT + 1.6]);
  for (const p of byDepth(ds)) out.push(daruma(p[0], p[1], p[2], 0.95));
  return out.join("");
}

function maple(x, y, z, s = 1) {
  const out = [];
  out.push(`<path class="iso-halo" d="${k.haloOf({ x: x - 6 * s, y: y - 6 * s, w: 12 * s, d: 12 * s, r: 6 * s }, z, 0.1, P)}" style="filter:blur(4px)"/>`);
  out.push(wood(cyl(x, y, 0.9 * s, z, 8 * s, { tone: "hi" }, 12)));
  const blobs = byDepth([[x - 2 * s, y + 1 * s, z + 9 * s, 4.4 * s], [x + 2.2 * s, y - 1.4 * s, z + 10 * s, 4.2 * s], [x, y, z + 13 * s, 3.8 * s]], (b) => b);
  for (const [bx, by, bz, r] of blobs) out.push(pine(solid(G.sphereOf([bx, by, bz], r, P, { steps: 16 }), { tone: "hi" })));
  return out.join("");
}

// ---------- the pond and the vermilion bridge on the axis ----------
const POND = [[44, -44], [60, -46], [67, -38], [67, 8], [60, 14], [47, 12], [43, 2], [44, -30]];
const WZ = Z0 + 0.3; // water surface
const pond = () => ac("water")(count(S(k.extrude(POND, Z0, 0.3, P, { convex: false }), { tone: "lo", crease: "none" })));
// The bridge mirrored in the water (z → 2·WZ − z): its near side band and the underside of the
// deck, clipped to the pond, breathing; ripple lines over it, fading at both ends.
function pondLife() {
  const mirror = ([x, y, z]) => at([x, y, 2 * WZ - z]);
  const yN = YC + BR.w + 0.7;
  const yF = YC - BR.w - 0.7;
  const band = pathOf(arch(0, 3.2).map(([x, z]) => mirror([x, yN, z])), true);
  const N = 14;
  const under = [];
  for (let i = 0; i <= N; i++) { const x = BR.x0 + ((BR.x1 - BR.x0) * i) / N; under.push(mirror([x, yN, archZ(x)])); }
  for (let i = N; i >= 0; i--) { const x = BR.x0 + ((BR.x1 - BR.x0) * i) / N; under.push(mirror([x, yF, archZ(x)])); }
  const fills = torii(`<path d="${pathOf(under, true)}" style="fill:var(--anatomy-shade-0);stroke:none"/><path d="${band}" style="fill:var(--anatomy-shade-1);stroke:none"/>`);
  const clip = pathOf(POND.map(([x, y]) => at([x, y, WZ])), true);
  const strokes = [];
  for (const [x, y0, y1] of [[49, -40, -24], [57, -36, -22], [63, -6, 8], [52, 0, 10], [61, -44, -34]]) strokes.push(k.fadeLineSvg([at([x, y0, WZ]), at([x, y1, WZ])], { fade: [4, 4], tone: "mid" }));
  return `<clipPath id="d23-pond"><path d="${clip}"/></clipPath><g clip-path="url(#d23-pond)"><g opacity=".35">${a.amPulse(fills, { period: 7000, min: 0.7 })}</g>${a.amPulse(ac("ripple")(strokes.join("")), { period: 5400, delay: 1800, min: 0.25 })}</g>`;
}
const BR = { x0: 41, x1: 71, rise: 4.2, w: 4.2 };
const archZ = (x) => Z0 + 0.3 + BR.rise * Math.sin((Math.PI * (x - BR.x0)) / (BR.x1 - BR.x0));
function arch(off, h) {
  const N = 14;
  const top = [];
  const bot = [];
  for (let i = 0; i <= N; i++) {
    const x = BR.x0 + ((BR.x1 - BR.x0) * i) / N;
    top.push([x, archZ(x) + off + h]);
    bot.push([x, archZ(x) + off]);
  }
  return [...bot, ...top.reverse()];
}
function bridge() {
  const out = [];
  const rail = (y0, y1) => {
    const posts = [];
    for (let i = 1; i < 6; i++) {
      const x = BR.x0 + ((BR.x1 - BR.x0) * i) / 6;
      posts.push(pathOf([at([x, y1, archZ(x) + 1]), at([x, y1, archZ(x) + 3.2])]));
    }
    return torii(count(S(prism(arch(1, 2.2), frameXZ(0), y0, y1), { tone: "hi", inner: L(posts.join(""), { tone: "mid" }) })));
  };
  out.push(rail(YC - BR.w - 0.7, YC - BR.w));
  out.push(torii(count(S(prism(arch(0, 1), frameXZ(0), YC - BR.w, YC + BR.w), { tone: "hi" }))));
  out.push(rail(YC + BR.w, YC + BR.w + 0.7));
  return out.join("");
}
const torii = ac("torii");

// ---------- assemble ----------
const items = [];
// Daruma up both sides of the stair, one on each step.
for (let i = 1; i <= STEPS - 1; i++) {
  const x = XS + (STEPS - i) * RUN - RUN / 2;
  const z = Z0 + RISE * i;
  for (const y of [YC - 5.4, YC + 5.4]) items.push({ at: [x, y, z], svg: daruma(x, y, z, 1.05) });
}
// Along the top of the wall: the +y edge and the +x edge (leaving the stair head clear).
for (let x = TER.x + 6; x < XS - 3; x += 7.2) items.push({ at: [x, TER.y + TER.d - 2.2, ZT], svg: daruma(x, TER.y + TER.d - 2.2, ZT + 0.6, 1.2) });
for (let y = TER.y + 6; y < TER.y + TER.d - 6; y += 7.2) if (Math.abs(y - YC) > 10) items.push({ at: [XS - 2.2, y, ZT], svg: daruma(XS - 2.2, y, y > YC + 26 || y < YC - 12 ? ZT + 0.6 : ZT, 1.2) });
items.push({ at: [4, YC + 17, ZT], svg: shelf(4, YC + 17) });
items.push({ at: [4, YC - 16, ZT], svg: lantern(4, YC - 16, ZT, 1.1) + daruma(4, YC - 16, ZT + 13.9 * 1.1 - 0.3, 0.85) });
items.push({ at: [-56, 30, ZT], svg: maple(-56, 30, ZT + 0.6, 1.15) });
items.push({ at: [-6, -54, ZT], svg: maple(-6, -54, ZT + 0.6, 1) });
items.push({ at: [-30, 56, Z0], svg: maple(-30, 56, Z0, 1.1) });
items.push({ at: [36, 40, Z0], svg: maple(36, 40, Z0, 0.95) });
items.push({ at: [56, YC, Z0], svg: bridge() });

const stones = byDepth([[66, -50, 2.4, 2], [8, 58, 3, 2.4]], (s) => [s[0], s[1], 0])
  .map(([x, y, r, h], i) => stone(x, y, r, h, Z0, i + 5)).join("");

const body = minify([
  plinth(),
  ground(),
  terrace(),
  hall(),
  stair(),
  pond(),
  pondLife(),
  stones,
  ...byDepth(items, (i) => i.at).map((i) => i.svg),
].join(""));

emit({
  dir: HERE,
  nn: 23,
  subject: "Katsuo-ji, el templo de los daruma",
  label: "Katsuo-ji in isometric view: a temple hall on a stone terrace, with red daruma dolls lined up the stair, along the wall and stacked in the forecourt.",
  body,
  accentsFor,
  tokensNote: "--paper, --coral, --brown, --green, --ink",
  motionNote: "Movimiento ambiental solo CSS (como los otros días con agua): el reflejo del puente bermellón respira en el estanque y unas ondas finas titilan sobre él, desfasadas; todo se detiene con prefers-reduced-motion.",
});
