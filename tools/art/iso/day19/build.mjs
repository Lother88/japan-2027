// Day 19 — Kyoto, Higashiyama: Kiyomizu-dera's wooden stage. The main hall (hondō) sits on the
// hillside under its great hipped roof of cypress bark; in front of it the stage (butai) runs out
// over the slope on a lattice of tall zelkova pillars tied by horizontal nuki beams, without a
// single nail. A railing runs round the deck; the slope below is wooded with rounded maples (green
// in May). Static: no motion, the stage is the moment.
//
//   node build.mjs → day19-light/dark .svg/.html here, ../out/day19Iso.markup.ts

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as $ from "../lib-d15-19.mjs";

const { mix, k, a, G, W, H, at, S, L, D, ac, depth, byDepth, pathOf, count, slab, cyl, plinth, polySolid, prismFaces, roofOf, courses, grow, halo, box, faceLine, faceRect, minify, emit } = $;
const HERE = dirname(fileURLToPath(import.meta.url));

function accentsFor(theme) {
  const b = $.baseAccents(theme);
  const s = $.SITE[theme];
  return {
    moss: b.moss,
    pine: b.pine,
    wood: b.wood,
    roof: b.roof,
    plaster: b.plaster,
    deck: theme === "light" ? mix(s.brown, s.paper, 0.3) : mix(s.brown, s.paper, 0.1),
  };
}
const moss = ac("moss");
const pine = ac("pine");
const wood = ac("wood");
const roofAc = ac("roof");
const plaster = ac("plaster");
const deck = ac("deck");

// ---------- world ----------
const PLINTH = { x: -68, y: -64, w: 146, d: 136, r: 8 };
const TOP = 30; // the hillside terrace the hall stands on, and the stage's floor beams
const EDGE = -8; // where the terrace ends and the slope falls away (+x)
const SLOPE = [[EDGE, TOP], [2, 21], [14, 10], [26, 4], [40, 0]];
const slopeZ = (x) => {
  if (x <= EDGE) return TOP;
  for (let i = 0; i < SLOPE.length - 1; i++) {
    const [x0, z0] = SLOPE[i];
    const [x1, z1] = SLOPE[i + 1];
    if (x <= x1) return z0 + ((x - x0) / (x1 - x0)) * (z1 - z0);
  }
  return 0;
};
const HALL = { x: -52, y: -38, w: 42, d: 70, r: 0 }; // x -52..-10, y -38..32
const HALL_TOP = TOP + 16;
const STAGE = { x: EDGE, y: -30, w: 37, d: 58, r: 0 }; // x -8..29, y -30..28
const DECK_Z = TOP;
const COLS = [2, 14, 26];
const ROWS = [-27, -14, -1, 12, 25];

const fitPoints = [...k.boxCorners(PLINTH, -10, 2), ...k.boxCorners({ x: PLINTH.x, y: PLINTH.y, w: EDGE - PLINTH.x, d: PLINTH.d }, 0, TOP + 1), [-31, -25, 81], [-31, 18, 81], ...k.boxCorners(grow(HALL, 11), HALL_TOP, HALL_TOP + 6)];
const P = a.fitInto(fitPoints, { x: 0, y: 0, w: W, h: H }, { pad: 6, azimuth: 40 });
$.setProjection(P);

// ---------- terrain: the terrace (stone-faced) and the wooded slope ----------
function arc(cx, cy, r, a0, a1, n = 6) {
  return Array.from({ length: n + 1 }, (_, i) => { const t = a0 + ((a1 - a0) * i) / n; return [cx + Math.cos(t) * r, cy + Math.sin(t) * r]; });
}
function terrain() {
  const out = [];
  const r = PLINTH.r;
  const ring = [
    [EDGE, PLINTH.y], ...arc(PLINTH.x + r, PLINTH.y + r, r, -Math.PI / 2, -Math.PI),
    ...arc(PLINTH.x + r, PLINTH.y + PLINTH.d - r, r, Math.PI, Math.PI / 2), [EDGE, PLINTH.y + PLINTH.d],
  ];
  // Retaining-wall courses on the face we see (+y), and on the terrace's front edge (+x).
  const yf = PLINTH.y + PLINTH.d;
  const lines = [];
  for (const z of [6, 12, 18, 24]) lines.push(k.ringSeam(ring, z, P));
  out.push(count(S(k.extrude(ring, 0, TOP, P, { convex: false }), { tone: "mid", inner: L(lines.join(""), { tone: "faint" }) })));
  // A moss lawn on the terrace.
  const lawn = [[EDGE, PLINTH.y + 2], ...arc(PLINTH.x + r, PLINTH.y + r, r - 2, -Math.PI / 2, -Math.PI), ...arc(PLINTH.x + r, yf - r, r - 2, Math.PI, Math.PI / 2), [EDGE, yf - 2]];
  out.push(moss(count(S(k.extrude(lawn, TOP, 0.6, P, { convex: false }), { tone: "mid" }))));
  // The slope, a wedge across the whole depth.
  const sec = [[EDGE, 0], [40, 0], ...SLOPE.slice(0, -1).reverse()];
  out.push(moss(count(S(polySolid(prismFaces(sec, "y", PLINTH.y + 2, yf - 2)), { tone: "mid" }))));
  return out.join("");
}

// A rounded maple (or any broadleaf): a short trunk and two or three stacked pads.
function tree(x, y, s = 1) {
  const z = slopeZ(x);
  const out = [halo({ x: x - 8 * s, y: y - 8 * s, w: 16 * s, d: 16 * s, r: 8 * s }, z, 0.1, 3)];
  out.push(wood(cyl(x, y, 0.9 * s, z, 6 * s, { tone: "hi" }, 10)));
  out.push(pine($.pad(x, y, z + 5 * s, 6.4 * s, { h: 2.2 * s, top: 0.72 })));
  out.push(pine($.pad(x + 0.6 * s, y - 0.4 * s, z + 9.2 * s, 4 * s, { h: 1.8 * s, top: 0 })));
  return out.join("");
}

// ---------- the main hall ----------
function hall() {
  const out = [];
  const xf = HALL.x + HALL.w;
  const yf = HALL.y + HALL.d;
  const marks = [];
  // Lattice shutters (shitomido) between posts on both faces we see, a plaster band above.
  for (let u = HALL.y + 7; u < yf; u += 7) marks.push(faceLine("x", xf, u, TOP, u, HALL_TOP));
  for (let u = HALL.x + 7; u < xf; u += 7) marks.push(faceLine("y", yf, u, TOP, u, HALL_TOP));
  for (const z of [TOP + 3.5, TOP + 6, TOP + 8.5, TOP + 11]) {
    marks.push(faceLine("x", xf, HALL.y, z, yf, z));
    marks.push(faceLine("y", yf, HALL.x, z, xf, z));
  }
  out.push(halo(grow(HALL, 6), TOP + 0.6, 0.1, 5));
  out.push(wood(slab(HALL, TOP, HALL_TOP - TOP, { tone: "mid", inner: L(marks.join(""), { tone: "lo" }) }, 2)));
  // A white plaster frieze (kabe) under the eaves, and the head beam.
  out.push(plaster(slab(grow(HALL, 0.2), HALL_TOP - 3, 2.2, { tone: "mid" }, 2)));
  out.push(wood(slab(grow(HALL, 0.6), HALL_TOP - 0.8, 1.4, { tone: "hi" }, 2)));
  // The great hipped roof of cypress bark, its corners barely lifted.
  const r = roofOf(HALL, 9, HALL_TOP + 0.6, { x: -33, y: -22, w: 4, d: 38, r: 0 }, 76, { lift: 2.4, flare: 1.6, fascia: 2.2, n: 8 });
  out.push(roofAc(count(S(r.paths, { tone: "hi" })) + L(courses(r, [0.22, 0.45, 0.68]), { tone: "lo" })));
  // Ridge with its end tiles.
  out.push(roofAc(slab({ x: -33.6, y: -23, w: 5.2, d: 40, r: 0 }, 75.6, 2.4, { tone: "hi" }, 2, 0.3)));
  for (const y of [-24.2, 16.6]) out.push(roofAc(slab({ x: -34.4, y, w: 6.8, d: 1.6, r: 0 }, 75.6, 4.4, { tone: "hi" }, 2)));
  return out.join("");
}

// ---------- the stage and its pillar lattice ----------
function lattice() {
  const out = [];
  const R = 1.25;
  const levels = [8, 16, 24];
  const items = [];
  // Pillars, from the slope up to the deck.
  for (const x of COLS) for (const y of ROWS) {
    const z0 = slopeZ(x) - 0.4;
    items.push({ key: [x, y, 0], svg: wood(cyl(x, y, R, z0, DECK_Z - z0, { tone: "hi", inner: L(levels.filter((h) => h > z0 + 2).map((h) => k.sideArc(x, y, R, h + 1.6, P, 12)).join(""), { tone: "lo" }) }, 12)) });
  }
  // Nuki: beams through the pillars, split between neighbours so they sort with them.
  for (const h of levels) {
    for (const x of COLS) {
      if (slopeZ(x) > h - 1) continue;
      for (let i = 0; i < ROWS.length - 1; i++) items.push({ key: [x, (ROWS[i] + ROWS[i + 1]) / 2, 0], svg: wood(slab({ x: x - 0.5, y: ROWS[i], w: 1, d: ROWS[i + 1] - ROWS[i], r: 0 }, h, 1.6, { tone: "hi" }, 2)) });
    }
    for (const y of ROWS) for (let i = 0; i < COLS.length - 1; i++) {
      const x0 = COLS[i];
      const x1 = COLS[i + 1];
      if (slopeZ(x0) > h - 1) continue;
      items.push({ key: [(x0 + x1) / 2, y, 0], svg: wood(slab({ x: x0, y: y - 0.5, w: x1 - x0, d: 1, r: 0 }, h, 1.6, { tone: "hi" }, 2)) });
    }
  }
  for (const it of byDepth(items, (i) => i.key)) out.push(it.svg);
  return out.join("");
}

function stage() {
  const out = [];
  // Floor beams, then the boards (hinoki) with their joints running out to the edge.
  out.push(wood(slab(grow(STAGE, -0.6), DECK_Z - 1.6, 1.6, { tone: "hi" }, 2)));
  const boards = [];
  for (let y = STAGE.y + 4; y < STAGE.y + STAGE.d; y += 4) boards.push(k.lineOnTop([STAGE.x, y], [STAGE.x + STAGE.w, y], DECK_Z + 1, P));
  out.push(deck(slab(STAGE, DECK_Z, 1, { tone: "mid", inner: L(boards.join(""), { tone: "faint" }) }, 2, 0.3)));
  // The railing on the two open sides: posts and a top rail, the near corner last.
  const xf = STAGE.x + STAGE.w;
  const yf = STAGE.y + STAGE.d;
  const rz = DECK_Z + 1;
  const posts = [];
  for (let y = STAGE.y + 0.5; y <= yf - 0.4; y += 6.5) posts.push([xf - 0.5, y]);
  for (let x = STAGE.x + 1; x < xf - 0.6; x += 6.5) posts.push([x, yf - 0.5]);
  posts.push([xf - 0.5, yf - 0.5]);
  for (const [x, y] of byDepth(posts, ([x, y]) => [x, y, 0])) out.push(wood(slab({ x: x - 0.5, y: y - 0.5, w: 1, d: 1, r: 0 }, rz, 4.2, { tone: "hi" }, 2)));
  out.push(wood(slab({ x: xf - 1, y: STAGE.y, w: 1, d: STAGE.d, r: 0 }, rz + 4.2, 0.8, { tone: "hi" }, 2)));
  out.push(wood(slab({ x: STAGE.x, y: yf - 1, w: STAGE.w, d: 1, r: 0 }, rz + 4.2, 0.8, { tone: "hi" }, 2)));
  out.push(wood(slab({ x: xf - 1, y: STAGE.y, w: 1, d: STAGE.d, r: 0 }, rz + 1.6, 0.5, { tone: "hi" }, 2)));
  out.push(wood(slab({ x: STAGE.x, y: yf - 1, w: STAGE.w, d: 1, r: 0 }, rz + 1.6, 0.5, { tone: "hi" }, 2)));
  return out.join("");
}

// ---------- assemble ----------
const backTrees = [[-62, -54, 1.1], [-60, 52, 1]];
const slopeBack = [[8, -48, 1.2], [36, -46, 1.2]];
const slopeFront = [[30, 44, 1.3], [54, 20, 1.2], [6, 48, 1.1], [60, -16, 1.1]];
const body = minify([
  plinth(PLINTH),
  terrain(),
  ...byDepth(backTrees, (t) => [t[0], t[1], TOP]).map(([x, y, s]) => tree(x, y, s)),
  hall(),
  ...byDepth(slopeBack, (t) => [t[0], t[1], 0]).map(([x, y, s]) => tree(x, y, s)),
  lattice(),
  stage(),
  ...byDepth(slopeFront, (t) => [t[0], t[1], 0]).map(([x, y, s]) => tree(x, y, s)),
].join(""));

emit({
  day: 19,
  here: HERE,
  title: "Escenario de Kiyomizu-dera",
  subject: "Escenario de madera de Kiyomizu-dera",
  label: "Kiyomizu-dera in Kyoto in isometric view: the main hall under its hipped cypress-bark roof and the wooden stage held out over the wooded slope on a lattice of tall pillars.",
  body,
  accentsFor,
});
