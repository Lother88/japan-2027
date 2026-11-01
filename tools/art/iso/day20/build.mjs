// Day 20 — Fushimi Inari: a stretch of the senbon-torii, the vermilion tunnel of gates that
// climbs the hillside, as an isometric asset for the japan-2027 landing (same set as day 21).
// On the pilot's plinth a moss hillside rises to a wooded crest. A stone stair climbs the slope
// and over every step stands a torii, packed so tight they read as a tunnel: vermilion pillars
// on black feet, a tie beam (nuki), a vermilion shimaki and the black kasagi with upturned
// ends. Two stone kitsune with vermilion bibs guard the entrance; Japanese cedars crown the
// hill and the lower ground, with a few stones.
// Motion (CSS only, stopped under prefers-reduced-motion): a stone lantern at the head of the
// stair glows softly, and the foxes' vermilion bibs stir in the breeze, out of phase.
//
//   node build.mjs   → day20-light/dark .svg/.html, ../out/day20Iso.markup.ts

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  k, G, P, a, SITE, mix, baseAccents, PLINTH, S, L, ac, byDepth, count, faceRect, roofOf,
  prism, frameXZ, frameYZ, slab, cyl, solid, plinth, stone, minify, emit, swingInPlane,
} from "../common-d20-25.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

function accentsFor(theme) {
  const s = SITE[theme];
  return {
    ...baseAccents(theme),
    torii: theme === "light" ? s.coral2 : mix(s.coral2, s.paper, 0.08),
    glow: theme === "light" ? mix(s.amber, s.paper, 0.2) : s.amber,
  };
}
const torii = ac("torii");
const roofAc = ac("roof");
const moss = ac("moss");
const pine = ac("pine");
const wood = ac("wood");

// ---------- world ----------
const Z0 = 3; // lower ground
const YC = -14; // the path's centre line (runs along x, climbing toward −x)
const HALF = 5.6; // pillar offset from the centre line
const X_FOOT = 64; // where the slope starts
const X_TOP = 4; // where the slope meets the crest
const SLOPE = 0.45;
const zHill = (x) => Z0 + Math.min(Math.max(X_FOOT - x, 0), X_FOOT - X_TOP) * SLOPE;
const Z_TOP = zHill(X_TOP);
const HILL_Y0 = -60.5;
const HILL_Y1 = 14;
const PITCH = 4;
const GATES = Array.from({ length: 13 }, (_, i) => 61 - i * PITCH);
const stepTop = (x) => zHill(x - PITCH / 2) + 0.3;

// ---------- ground and hill ----------
const GROUND = k.insetPlan(PLINTH, 3.5);
const ground = () => moss(slab(GROUND, 0, Z0, { tone: "mid", crease: "none" }, 6));

// The hill: a slope from X_FOOT up to the crest, then the flat crest to the back, in one prism.
function hill() {
  const poly = [[GROUND.x, Z0], [X_FOOT, Z0], [X_TOP, Z_TOP], [GROUND.x, Z_TOP]];
  // Strata on the +y face (the face toward the viewer's left), edge to edge.
  const strata = [];
  for (const z of [Z0 + 9, Z0 + 18]) {
    const x1 = X_FOOT - (z - Z0) / SLOPE;
    strata.push(k.segment([GROUND.x, HILL_Y1, z], [x1, HILL_Y1, z], P));
  }
  return moss(count(S(prism(poly, frameXZ(0), HILL_Y0, HILL_Y1), { tone: "mid", crease: "faint", inner: L(strata.join(""), { tone: "faint" }) })));
}

// The stone stair under the gates: one step per gate, from the foot to the crest.
function stair() {
  const y0 = YC - HALF - 2;
  const y1 = YC + HALF + 2;
  const pts = [[X_TOP - 2, Z0], [74.5, Z0], [74.5, Z0 + 0.3]];
  let x = GATES[0] + PITCH / 2;
  pts.push([x, Z0 + 0.3]);
  for (const g of GATES) {
    const z = stepTop(g);
    pts.push([x, z]);
    x = g - PITCH / 2;
    pts.push([x, z]);
  }
  pts.push([X_TOP - 2, pts[pts.length - 1][1]]);
  // Underside: follow the slope a little below its surface, so only the steps show above it.
  pts[0] = [X_TOP - 2, Z_TOP - 1];
  pts.splice(1, 0, [X_TOP, Z_TOP - 1], [X_FOOT, Z0 - 0.01]);
  const poly = pts.filter((p, i, arr) => i === 0 || p[0] !== arr[i - 1][0] || p[1] !== arr[i - 1][1]);
  return count(S(prism(poly, frameXZ(0), y0, y1), { tone: "lo", crease: "faint" }));
}

// ---------- the torii ----------
// A lintel in y–z: flat in the middle, the ends lifting (cube law) toward the tips.
function lintel(xc, zk, half, lift, h, thick) {
  const N = 6;
  const top = [];
  const bot = [];
  for (let i = 0; i <= N; i++) {
    const t = -1 + (2 * i) / N;
    const zb = zk + lift * Math.abs(t) ** 3;
    bot.push([YC + t * half, zb]);
    top.push([YC + t * half, zb + h]);
  }
  return prism([...bot, ...top.reverse()], frameYZ(0), xc - thick / 2, xc + thick / 2);
}

function gate(xc) {
  const zb = stepTop(xc);
  const out = [];
  const zk = zb + 19; // kasagi underside at the middle
  const pillar = (y) => {
    out.push(roofAc(cyl(xc, y, 1.5, zb, 2, { tone: "hi" }, 12, 0.2)));
    out.push(torii(cyl(xc, y, 1.25, zb + 2, zk - 1.3 + 0.35 - zb - 2, { tone: "hi" }, 12)));
  };
  pillar(YC - HALF);
  out.push(torii(slab({ x: xc - 0.65, y: YC - HALF, w: 1.3, d: HALF * 2, r: 0 }, zk - 5.4, 1.3, { tone: "hi" }, 2)));
  pillar(YC + HALF);
  out.push(torii(solid(lintel(xc, zk - 1.3, 7.8, 0.65, 1.3, 2.1), { tone: "hi" })));
  out.push(roofAc(solid(lintel(xc, zk, 9.4, 1.15, 1.5, 2.9), { tone: "hi" })));
  return out.join("");
}

// ---------- kitsune ----------
// A seated fox in profile (x–z, facing +x), extruded across y; a vermilion bib on the chest.
const FOX = [[-2.2, 0], [2.2, 0], [2.2, 0.8], [1.7, 2.6], [1.6, 4], [2.4, 4.9], [3.4, 5.2], [2.6, 5.7], [1.9, 6.1], [1.8, 6.3], [1.6, 7.8], [1.1, 6.6], [0.7, 7.6], [0.4, 6.3], [0.2, 5.4], [-0.8, 3.8], [-1.6, 3.2], [-2.6, 5.2], [-2.2, 7], [-3.2, 6.6], [-3.4, 4.6], [-2.8, 2], [-2.4, 0.8]];
const BIB = [[1.55, 3.2], [1.75, 2.9], [2.25, 4.75], [1.6, 4.3]];
function fox(x, y, z, s = 1.3) {
  const out = [];
  const ped = { x: x - 3.6, y: y - 2.8, w: 7.2, d: 5.6, r: 0 };
  out.push(slab(ped, z, 5, { tone: "mid", inner: L(k.sideSeam(ped, z + 3.6, P, 2), { tone: "faint" }) }, 2, 0.3));
  const zf = z + 5;
  out.push(solid(prism(FOX.map(([u, v]) => [x + u * s, zf + v * s]), frameXZ(0), y - 1.1 * s, y + 1.1 * s), { tone: "mid" }));
  // The bib hangs from its top edge and stirs outward (rotation in the x–z plane about it).
  const bib = torii(solid(prism(BIB.map(([u, v]) => [x + u * s, zf + v * s]), frameXZ(0), y - 1.3 * s, y + 1.3 * s), { tone: "hi" }));
  const pivot = [x + 1.92 * s, y, zf + 4.52 * s];
  out.push(swingInPlane(bib, pivot, [1, 0, 0], [0, 0, 1], { from: 0, to: bibTo, period: 3400, delay: bibDelay }));
  bibDelay += 1300;
  return out.join("");
}
let bibDelay = 0;
const bibTo = 10; // degrees, + lifts the hem outward (toward +x, the way the fox faces)

// ---------- stone lanterns with a lit firebox (the pilot's tōrō, its windows glowing) ----------
const glow = ac("glow");
function litLantern(x, y, z, s, delay) {
  const u = (v) => v * s;
  const out = [];
  out.push(`<path class="iso-halo" d="${k.haloOf({ x: x - u(3.4), y: y - u(3.4), w: u(6.8), d: u(6.8), r: u(3.4) }, z, 0.1, P)}" style="filter:blur(2px)"/>`);
  out.push(cyl(x, y, u(3.2), z, u(1.4), { tone: "mid" }, 12, 0.3));
  out.push(cyl(x, y, u(1.1), z + u(1.4), u(5), { tone: "mid" }, 8));
  out.push(slab({ x: x - u(2.8), y: y - u(2.8), w: u(5.6), d: u(5.6), r: 0 }, z + u(6.4), u(1.1), { tone: "mid" }, 2, 0.3));
  const box = { x: x - u(1.9), y: y - u(1.9), w: u(3.8), d: u(3.8), r: 0 };
  const win = [faceRect("x", x + u(1.9), y - u(0.9), y + u(0.9), z + u(8.1), z + u(9.9)), faceRect("y", y + u(1.9), x - u(0.9), x + u(0.9), z + u(8.1), z + u(9.9))].join("");
  // The window panes: the dark inside of the stone firebox, and a warm light over it that
  // breathes from a faint ember to full glow.
  const panes = `<path class="iso-shade" data-shade="0" d="${win}"/>` + glow(a.amPulse(`<path class="iso-top" d="${win}"/>`, { period: 4200, delay, min: 0.2 }));
  out.push(slab(box, z + u(7.5), u(3), { tone: "mid", inner: panes + L(win, { tone: "lo" }) }, 2));
  const cap = roofOf(box, u(1.6), z + u(10.5), { x: x - u(0.5), y: y - u(0.5), w: u(1), d: u(1) }, z + u(12.4), { lift: u(0.5), flare: u(0.4), fascia: u(0.5), n: 4 });
  out.push(count(S(cap.paths, { tone: "mid" })));
  out.push(count(S(G.sphereOf([x, y, z + u(13.2)], u(0.9), P, { steps: 10 }), { tone: "mid" })));
  return out.join("");
}

// ---------- cedars ----------
function cedar(x, y, z, h = 22, r = 5) {
  const out = [];
  out.push(`<path class="iso-halo" d="${k.haloOf({ x: x - r, y: y - r, w: 2 * r, d: 2 * r, r }, z, 0.1, P)}" style="filter:blur(4px)"/>`);
  out.push(wood(cyl(x, y, 0.8, z, h * 0.3, { tone: "hi" }, 12)));
  const F = G.frameAlong([x, y, z + h * 0.22], [0, 0, 1]);
  const prof = [[0, r * 0.75], [h * 0.12, r], [h * 0.45, r * 0.72], [h * 0.78, r * 0.32]];
  out.push(pine(solid(G.solidOf(prof, F, P, { steps: 14 }), { tone: "hi" })));
  return out.join("");
}

// ---------- assemble ----------
const items = [];
for (const xc of GATES) items.push({ at: [xc, YC, 0], svg: gate(xc) });
items.push({ at: [69, YC - HALF - 6, Z0], svg: fox(69, YC - HALF - 6, Z0) });
items.push({ at: [69, YC + HALF + 6, Z0], svg: fox(69, YC + HALF + 6, Z0) });
const crest = [[-12, -44, 26, 5.4], [-34, -26, 30, 6], [-54, -48, 24, 5], [-50, 0, 25, 5.2], [-16, -4, 21, 4.6]];
// One lantern at the head of the stair, on the open side (a far twin would hide behind the
// tunnel). Sorted like the gates, with its key at z 0.
for (const [x, y, d] of [[1, YC + HALF + 6.5, 0]]) items.push({ at: [x, y, 0], svg: litLantern(x, y, Z_TOP, 1.25, d) });
for (const [x, y, h, r] of crest) items.push({ at: [x, y, Z_TOP], svg: cedar(x, y, Z_TOP, h, r) });
for (const [x, y, h, r] of [[28, -48, 19, 4.6]]) items.push({ at: [x, y, zHill(x)], svg: cedar(x, y, zHill(x + r), h, r) });
for (const [x, y, h, r] of [[-34, 38, 21, 5], [10, 40, 17, 4.4]]) items.push({ at: [x, y, Z0], svg: cedar(x, y, Z0, h, r) });

const stones = byDepth([[50, 40, 3.2, 2.6], [-12, 58, 2.6, 2.2], [62, 52, 2.2, 1.8]], (s) => [s[0], s[1], 0])
  .map(([x, y, r, h], i) => stone(x, y, r, h, Z0, i + 2)).join("");

const body = minify([
  plinth(),
  ground(),
  hill(),
  stair(),
  stones,
  ...byDepth(items, (i) => i.at).map((i) => i.svg),
].join(""));

emit({
  dir: HERE,
  nn: 20,
  subject: "Senbon torii de Fushimi Inari",
  label: "Fushimi Inari in isometric view: a tunnel of vermilion torii gates climbing a wooded hillside on a stone stair, guarded by two stone foxes.",
  body,
  accentsFor,
  tokensNote: "--paper, --coral2, --brown, --green, --ink",
  motionNote: "Movimiento ambiental solo CSS: la ventana del tōrō de lo alto de la escalera late despacio y los baberos de los kitsune se mecen (desfasados); todo se detiene con prefers-reduced-motion.",
});
