// Day 18 — Kyoto, Tō-ji: the five-storey pagoda, Japan's tallest wooden tower. Five storeys
// of white walls and dark timber doors on a stone platform, each under a deep grey-tiled roof
// with upturned corners and a timber bracket band, shrinking toward the top, crowned by the bronze
// sōrin finial (base, bowl, nine rings, water-flame, jewel). Around it, the temple's gravel, the
// Hyōtan-ike pond edged with stones, and cloud-pruned pines. The pond shimmers (CSS only).
//
//   node build.mjs → day18-light/dark .svg/.html here, ../out/day18Iso.markup.ts

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as $ from "../lib-d15-19.mjs";

const { mix, k, a, G, W, H, at, S, L, D, ac, depth, byDepth, pathOf, count, slab, cyl, plinth, polySolid, roofOf, courses, grow, halo, faceLine, faceRect, minify, emit } = $;
const HERE = dirname(fileURLToPath(import.meta.url));

function accentsFor(theme) {
  const b = $.baseAccents(theme);
  const s = $.SITE[theme];
  return {
    water: b.water,
    ripple: b.ripple,
    moss: b.moss,
    pine: b.pine,
    wood: b.wood,
    plaster: b.plaster,
    gold: b.gold,
    tile: theme === "light" ? mix(s.ink, s.paper, 0.42) : mix(s.ink, s.paper, 0.6),
    timber: theme === "light" ? mix(s.brown, s.ink, 0.3) : mix(s.brown, s.paper, 0.22),
  };
}
const water = ac("water");
const ripple = ac("ripple");
const moss = ac("moss");
const pine = ac("pine");
const wood = ac("wood");
const plaster = ac("plaster");
const gold = ac("gold");
const tile = ac("tile");
const timber = ac("timber");

// ---------- world ----------
const PLINTH = { x: -68, y: -64, w: 146, d: 136, r: 8 };
const CX = -6;
const CY = -10;
const KIDAN = { x: CX - 20, y: CY - 20, w: 40, d: 40, r: 0.6 };
const KZ = 3.4;
// Storeys: half-width of the wall, its height; the roof rise above each bracket band.
const STOREYS = [
  { h: 11, wall: 8.4 }, { h: 10.2, wall: 7 }, { h: 9.6, wall: 6.8 }, { h: 9, wall: 6.6 }, { h: 8.4, wall: 6.4 },
];
const plans = STOREYS.map((s) => ({ x: CX - s.h, y: CY - s.h, w: 2 * s.h, d: 2 * s.h, r: 0 }));
const levels = [];
{
  let z = KZ + 0.8;
  for (let i = 0; i < STOREYS.length; i++) {
    const base = z;
    const top = base + STOREYS[i].wall;
    const band = top + 1.8;
    const next = band + 3.6;
    levels.push({ base, top, band, next });
    z = next;
  }
}
const ROOF_TOP = levels[4].band + 7.5;
const APEX = ROOF_TOP + 30;

const fitPoints = [...k.boxCorners(PLINTH, -10, 2), [CX, CY, APEX + 2], [CX + 26, CY - 26, levels[0].band], [CX - 26, CY + 26, levels[0].band]];
const P = a.fitInto(fitPoints, { x: 0, y: 0, w: W, h: H }, { pad: 6, azimuth: 40 });
$.setProjection(P);

// ---------- ground: pond, stones, pines ----------
const POND = [
  [-62, 22], [-50, 14], [-34, 16], [-24, 26], [-12, 30], [4, 34], [16, 44], [20, 56], [12, 66], [-6, 68],
  [-26, 66], [-44, 62], [-58, 56], [-64, 44],
];
function pond() {
  const out = [];
  out.push(water(count(S(k.extrude(POND, 0, 0.5, P, { convex: false }), { tone: "lo", crease: "none" }))));
  const clip = pathOf(POND.map(([x, y]) => at([x, y, 0.5])), true);
  const strokes = [];
  for (const [y, x0, x1] of [[40, -40, -20], [48, -30, -6], [56, -48, -30], [52, -10, 8], [44, -54, -44]]) strokes.push(k.fadeLineSvg([at([x0, y, 0.5]), at([x1, y, 0.5])], { fade: [4, 4], tone: "mid" }));
  out.push(`<clipPath id="d18-pond"><path d="${clip}"/></clipPath><g clip-path="url(#d18-pond)">${a.amPulse(ripple(strokes.join("")), { period: 5800, min: 0.2 })}</g>`);
  // A mossy islet with one stone.
  const isle = G.hullOf(Array.from({ length: 9 }, (_, i) => { const t = (i / 9) * Math.PI * 2; return [-30 + Math.cos(t) * 7 * (0.85 + 0.15 * Math.sin(i * 2.1)), 46 + Math.sin(t) * 5]; }));
  out.push(ripple(L(k.ring(-30, 46, 11, 0.5, P, 40), { tone: "faint" })));
  out.push(moss(count(S(k.extrude(isle, 0, 1.8, P, { bevel: 0.4 }), { tone: "mid" }))));
  out.push($.stone(-31, 45, 2.6, 2.4, 1.8, 3));
  return out.join("");
}

function pondStones() {
  // Stones along the rim of the pond, set on its edge.
  const list = [];
  for (let i = 0; i < POND.length; i++) {
    if (i % 2) continue;
    const [x, y] = POND[i];
    list.push([x, y, 2.4 + (i % 3) * 0.5, 2 + (i % 4) * 0.4]);
  }
  return byDepth(list, (s) => [s[0], s[1], 0]).map(([x, y, r, h], i) => $.stone(x, y, r, h, 0, i + 11)).join("");
}

function pineTree(x, y, z, scale = 1) {
  const out = [];
  const u = (v) => v * scale;
  out.push(halo({ x: x - u(9), y: y - u(9), w: u(18), d: u(18), r: u(9) }, z, 0.1, 4));
  const trunk = [[0, 0, 0], [1.2, 0.4, 4], [2.4, 0.8, 8], [1.6, 0.4, 12], [0.4, 0, 16]].map(([dx, dy, dz]) => [x + u(dx), y + u(dy), z + u(dz)]);
  const pads = [
    { dx: 7, dy: 2.5, dz: 6, r: 4.2 }, { dx: -4.5, dy: 4, dz: 8.5, r: 3.8 }, { dx: -2, dy: -5, dz: 11, r: 4.4 },
    { dx: 6, dy: -3, dz: 12.5, r: 3.6 }, { dx: 0.4, dy: 0, dz: 16.5, r: 5.4 },
  ].map((p) => ({ ...p, c: [x + u(p.dx), y + u(p.dy), z + u(p.dz)] }));
  out.push(wood(L(pads.slice(0, 4).map((p) => { const f = trunk[Math.min(3, Math.round(p.dz / 4))]; return k.segment([f[0], f[1], p.c[2] - u(1.6)], [p.c[0], p.c[1], p.c[2] + u(0.6)], P); }).join(""), { tone: "hi" })));
  const td = depth(trunk[2]);
  const sorted = byDepth(pads, (p) => p.c);
  const back = (p) => depth(p.c) < td && p.dz < 16;
  for (const p of sorted) if (back(p)) out.push(pine($.pad(p.c[0], p.c[1], p.c[2], u(p.r))));
  for (let i = 0; i < trunk.length - 1; i++) out.push(wood(cyl(trunk[i][0], trunk[i][1], u(1.25 - i * 0.15), trunk[i][2], trunk[i + 1][2] - trunk[i][2] + u(0.3), { tone: "hi" }, 12)));
  for (const p of sorted) if (!back(p)) out.push(pine($.pad(p.c[0], p.c[1], p.c[2], u(p.r))));
  return out.join("");
}

// ---------- the pagoda ----------
function platform() {
  const out = [halo(grow(KIDAN, 5), 0, 0.1, 4)];
  out.push(slab(KIDAN, 0, KZ, { tone: "mid", inner: L(k.sideSeam(KIDAN, KZ / 2, P, 2), { tone: "faint" }) }, 2, 0.5));
  // Steps on the two faces we see, centred.
  for (let i = 0; i < 3; i++) {
    const d = 3 * (3 - i);
    out.push(slab({ x: KIDAN.x + KIDAN.w, y: CY - 5, w: d, d: 10, r: 0 }, (KZ * i) / 3, KZ / 3, { tone: "mid" }, 2, 0.3));
  }
  for (let i = 0; i < 3; i++) {
    const d = 3 * (3 - i);
    out.push(slab({ x: CX - 5, y: KIDAN.y + KIDAN.d, w: 10, d, r: 0 }, (KZ * i) / 3, KZ / 3, { tone: "mid" }, 2, 0.3));
  }
  return out.join("");
}

function storey(i) {
  const out = [];
  const W0 = plans[i];
  const { base, top, band } = levels[i];
  const xf = W0.x + W0.w;
  const yf = W0.y + W0.d;
  const h = STOREYS[i].h;
  // Plaster wall: three bays a face, posts drawn as lines, the central door in timber.
  const marks = [];
  for (const f of [1 / 3, 2 / 3]) {
    marks.push(faceLine("x", xf, W0.y + W0.w * f, base, W0.y + W0.w * f, top));
    marks.push(faceLine("y", yf, W0.x + W0.w * f, base, W0.x + W0.w * f, top));
  }
  marks.push(faceLine("x", xf, W0.y, top - 1.6, yf, top - 1.6));
  marks.push(faceLine("y", yf, W0.x, top - 1.6, xf, top - 1.6));
  if (i > 0) {
    // A balcony round the upper storeys, on the roof below.
    const B = grow(W0, 1.8);
    out.push(timber(slab(B, base - 0.9, 0.9, { tone: "hi" }, 2, 0.3)));
  }
  out.push(plaster(slab(W0, base, top - base, { tone: "mid", inner: L(marks.join(""), { tone: "lo" }) }, 2)));
  const dw = W0.w / 3 - 1.2;
  const lines = (face, c, u0) => [faceLine(face, c + 0.4, u0 + dw / 2, base, u0 + dw / 2, top - 1.6)].join("");
  const dz = top - 1.6 - base;
  out.push(timber(slab({ x: xf, y: CY - dw / 2, w: 0.4, d: dw, r: 0 }, base, dz, { tone: "hi", inner: L(lines("x", xf, CY - dw / 2), { tone: "lo" }) }, 2)));
  out.push(timber(slab({ x: CX - dw / 2, y: yf, w: dw, d: 0.4, r: 0 }, base, dz, { tone: "hi", inner: L(lines("y", yf, CX - dw / 2), { tone: "lo" }) }, 2)));
  // The bracket band (tokyō) under the eaves.
  const brackets = [];
  const bp = grow(W0, 1.2);
  const n = 6;
  for (let j = 1; j < n; j++) {
    brackets.push(faceLine("x", bp.x + bp.w, bp.y + (bp.d * j) / n, top, bp.y + (bp.d * j) / n, band));
    brackets.push(faceLine("y", bp.y + bp.d, bp.x + (bp.w * j) / n, top, bp.x + (bp.w * j) / n, band));
  }
  out.push(timber(slab(bp, top, band - top, { tone: "hi", inner: L(brackets.join(""), { tone: "lo" }) }, 2)));
  // The roof.
  const over = 10 - i * 0.7;
  if (i < 4) {
    const r = roofOf(W0, over, band, grow(plans[i + 1], 1.6), levels[i + 1].base - 0.9, { lift: 3.4, flare: 2.4, fascia: 1.6, n: 6 });
    out.push(tile(count(S(r.paths, { tone: "hi" })) + L(courses(r, [0.3, 0.6]), { tone: "lo" })));
  } else {
    const r = roofOf(W0, over, band, { x: CX - 2.6, y: CY - 2.6, w: 5.2, d: 5.2, r: 0 }, ROOF_TOP, { lift: 3.4, flare: 2.4, fascia: 1.6, n: 6 });
    out.push(tile(count(S(r.paths, { tone: "hi" })) + L(courses(r, [0.25, 0.5, 0.72]), { tone: "lo" })));
  }
  void h;
  return out.join("");
}

// The sōrin: roban base, fukubachi bowl, ukebana, nine rings on the shaft, water-flame, jewel.
function sorin() {
  const out = [];
  const z0 = ROOF_TOP;
  out.push(gold(slab({ x: CX - 2.8, y: CY - 2.8, w: 5.6, d: 5.6, r: 0 }, z0 - 0.4, 2, { tone: "hi" }, 2, 0.3)));
    // The bowl (fukubachi) as a ball half sunk in its base, the flower seat (ukebana) a short drum.
  out.push(gold(count(S(G.sphereOf([CX, CY, z0 + 2.4], 2.6, P, { steps: 28 }), { tone: "hi" }))));
  out.push(gold(cyl(CX, CY, 2.3, z0 + 4.2, 1, { tone: "hi" }, 16, 0.2)));
  const shaftTop = 26;
  out.push(gold(cyl(CX, CY, 0.55, z0 + 1.6 + 4, shaftTop - 4, { tone: "hi" }, 12)));
  // The nine rings (kurin): one ringed drum, the gaps between rings cut as grooves.
  const rz0 = z0 + 1.6 + 5.2;
  const rz1 = rz0 + 8 * 1.75 + 0.7;
  const grooves = [];
  for (let j = 1; j < 9; j++) grooves.push(k.sideArc(CX, CY, 2.1, rz0 + j * 1.75 - 0.5, P, 18));
  out.push(gold(cyl(CX, CY, 2.1, rz0, rz1 - rz0, { tone: "hi", inner: L(grooves.join(""), { tone: "lo" }) }, 18, 0.2)));
  // The water-flame (suien): four flat openwork plates round the shaft, drawn as two crossed ones.
  const zf = z0 + 1.6 + 5.2 + 9 * 1.75 + 0.6;
  const flame = [[0.5, 0], [1.5, 0.5], [2.1, 1.8], [1.9, 3.4], [1.2, 4.8], [0.5, 5.4]];
  const Fx = G.frameOf([0, CY, 0], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
  const Fy = G.frameOf([CX, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
  const plate = (F, sign, ax) => G.prismOf(F, flame.map(([u, v]) => (ax === "x" ? [CX + sign * u, zf + v] : [CY + sign * u, zf + v])), -0.2, 0.2, P);
  out.push(gold(count(S(plate(Fx, -1, "x"), { tone: "hi" }))));
  out.push(gold(count(S(plate(Fy, -1, "y"), { tone: "hi" }))));
  out.push(gold(count(S(plate(Fx, 1, "x"), { tone: "hi", lit: true }))));
  out.push(gold(count(S(plate(Fy, 1, "y"), { tone: "hi", lit: true }))));
  out.push(gold(count(S(G.sphereOf([CX, CY, zf + 6.4], 1, P, { steps: 24 }), { tone: "hi" }))));
  out.push(gold(count(S(G.sphereOf([CX, CY, zf + 8.2], 1.2, P, { steps: 24 }), { tone: "hi", lit: true }))));
  if (process.env.SIZES) out.forEach((p, i) => console.log("sorin", i, minify(p).length));
  return out.join("");
}

function pagoda() {
  const out = [platform()];
  for (let i = 0; i < STOREYS.length; i++) out.push(storey(i));
  out.push(sorin());
  if (process.env.SIZES) out.forEach((p, i) => console.log("pagoda part", i, minify(p).length));
  return out.join("");
}

// A stone path from the steps to the front corner.
function path() {
  const list = [];
  for (let i = 0; i < 6; i++) list.push([CX + 34 + i * 6.4, CY + 1 + (i % 2) * 1.6]);
  return byDepth(list, (s) => [s[0], s[1], 0]).map(([x, y]) => slab({ x: x - 2.4, y: y - 3.6, w: 4.8, d: 7.2, r: 1 }, 0, 0.8, { tone: "mid" }, 3, 0.3)).join("");
}

// ---------- assemble ----------
const body = minify([
  plinth(PLINTH),
  pond(),
  pondStones(),
  pineTree(-58, -6, 0, 1.15),
  pineTree(44, -46, 0, 1),
  path(),
  pagoda(),
  pineTree(52, 34, 0, 1.2),
].join(""));

emit({
  day: 18,
  here: HERE,
  title: "Pagoda de cinco pisos de Tō-ji",
  subject: "Pagoda de Tō-ji",
  label: "Tō-ji in Kyoto in isometric view: the five-storey wooden pagoda on its stone platform, with a bronze finial, beside a pond and pines.",
  body,
  accentsFor,
});
