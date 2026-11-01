// Day 09 (arrival → Asakusa): Kaminarimon, the Thunder Gate of Sensō-ji, as an isometric
// diorama on the set's plinth. Vermilion pillars on stone bases, the two side bays that
// house Fūjin and Raijin behind dark grilles, a beam band and bracket course, a long hip roof
// with its ridge and end tiles, and the giant red chōchin hanging in the central passage
// (it sways a little, CSS only). In front, the stone approach, bollards, a waiting rickshaw
// and a ginkgo; a tree of the temple grounds behind.
//
//   node build.mjs  → day09-light/dark.svg/.html here, ../out/day09Iso.markup.ts

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { k, a, G, SITE, mix, baseAccents, PLINTH, fitOf, kitFor, minify, emit } from "../lib-09-26/common.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

function accentsFor(theme) {
  const s = SITE[theme];
  const b = baseAccents(theme);
  return {
    roof: b.roof,
    wood: b.wood,
    pine: b.pine,
    vermilion: s.coral2,
    lantern: mix(s.coral2, s.brown, theme === "light" ? 0.28 : 0.18),
    stone: b.stone,
  };
}

const P = fitOf();
const K = kitFor(P);
const { at, S, L, ac, byDepth, pathOf, count, slab, box, cyl, halo, roofOf, courses, faceLine, faceRect, bar } = K;
const roof = ac("roof");
const verm = ac("vermilion");
const lant = ac("lantern");
const wood = ac("wood");
const stoneAc = ac("stone");

// ---------- the gate ----------
const GX0 = -23; // back row of pillars
const GX1 = 1; // front row
const YS = [-46, -20, 16, 42]; // pillar lines along the gate
const LC = [-6, -2]; // lantern centre (the middle of the central passage)
const Z = { plat: 3.6, beam: 44, band: 48.5, eave: 52.5, ridge: 76 };

function approach() {
  const out = [];
  // The stone approach from the street to the gate, laid in big slabs.
  const PATH = { x: 8, y: -16, w: 66, d: 28, r: 1 };
  const joints = [];
  for (let x = PATH.x + 7.3; x < PATH.x + PATH.w - 2; x += 7.3) joints.push(pathOf([at([x, PATH.y, 0.8]), at([x, PATH.y + PATH.d, 0.8])]));
  joints.push(pathOf([at([PATH.x, PATH.y + PATH.d / 2, 0.8]), at([PATH.x + PATH.w, PATH.y + PATH.d / 2, 0.8])]));
  out.push(stoneAc(slab(PATH, 0, 0.8, { tone: "mid", inner: L(joints.join(""), { tone: "faint" }) }, 2, 0.3)));
  return out.join("");
}

function platform() {
  const out = [];
  const base = { x: -31, y: -52, w: 41, d: 100, r: 1 };
  const step = { x: -28, y: -49, w: 35, d: 94, r: 0.6 };
  out.push(halo(k.insetPlan(base, -3), 0, 2));
  out.push(stoneAc(slab(base, 0, 2, { tone: "mid", inner: L(k.sideSeam(base, 1, P, 2), { tone: "faint" }) }, 2, 0.4)));
  out.push(stoneAc(slab(step, 2, Z.plat - 2, { tone: "mid" }, 2, 0.3)));
  return out.join("");
}

function pillar(x, y) {
  return stoneAc(cyl(x, y, 2.7, Z.plat, 1.6, { tone: "mid" }, 20, 0.3)) +
    verm(cyl(x, y, 1.8, Z.plat + 1.6, Z.beam - Z.plat - 1.6, { tone: "hi", inner: L(k.sideArc(x, y, 1.8, Z.beam - 3, P, 20), { tone: "lo" }) }, 20));
}

// A side bay: the red-walled enclosure of a guardian statue, with a dark grille in front.
function bay(y0, y1) {
  const out = [];
  const zTop = Z.beam;
  const plan = { x: GX0 + 1, y: y0, w: GX1 - GX0 - 2, d: y1 - y0, r: 0 };
  const wallMarks = [];
  // the +y end wall (only the +y bay shows it): two plaster panels framed by a rail
  if (y1 > 0) {
    const yf = y1;
    wallMarks.push(faceLine("y", yf, plan.x, 14, plan.x + plan.w, 14));
    wallMarks.push(faceLine("y", yf, plan.x, 34, plan.x + plan.w, 34));
    wallMarks.push(faceLine("y", yf, plan.x + plan.w / 2, 14, plan.x + plan.w / 2, 34));
  }
  out.push(verm(slab(plan, Z.plat, zTop - Z.plat, { tone: "mid", inner: L(wallMarks.join(""), { tone: "lo" }) }, 2)));
  // the grille: a dark lattice panel set into the front face
  const g = { x: GX1 - 1.2, y: y0 + 2.5, w: 1.4, d: y1 - y0 - 5, r: 0 };
  const z0 = Z.plat + 5;
  const z1 = Z.beam - 5;
  const bars = [];
  const xf = g.x + g.w;
  for (let u = g.y + 2.2; u < g.y + g.d - 1; u += 2.2) bars.push(faceLine("x", xf, u, z0, u, z1));
  for (const z of [z0 + (z1 - z0) / 3, z0 + (2 * (z1 - z0)) / 3]) bars.push(faceLine("x", xf, g.y, z, g.y + g.d, z));
  out.push(roof(slab(g, z0, z1 - z0, { tone: "mid", inner: L(bars.join(""), { tone: "lo" }) }, 2)));
  // sill rail under the grille
  out.push(verm(box(GX1 - 1.6, y0 + 1, 2.2, y1 - y0 - 2, z0 - 1.6, 1.6, { tone: "hi" })));
  return out.join("");
}

// The chōchin: a bulging red paper body with bamboo ribs, black lacquered rims top and
// bottom, hung from the beam by a short iron hanger.
function chochin() {
  const out = [];
  const z0 = 16;
  const F = G.frameOf([LC[0], LC[1], z0], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
  const s0 = 2.4;
  const s1 = 24.6;
  const R0 = 8.4;
  const B = 1.5;
  const rOf = (s) => R0 + B * Math.sin((Math.PI * (s - s0)) / (s1 - s0));
  const dOf = (s) => ((B * Math.PI) / (s1 - s0)) * Math.cos((Math.PI * (s - s0)) / (s1 - s0));
  const profile = Array.from({ length: 25 }, (_, i) => {
    const s = s0 + ((s1 - s0) * i) / 24;
    return [s, rOf(s), 1];
  });
  // bottom rim (a thick carved base) and top rim
  out.push(halo({ x: LC[0] - 10, y: LC[1] - 10, w: 20, d: 20, r: 10 }, Z.plat, 0.1, 4));
  out.push(roof(count(S(G.disc(0, s0, 8.7, F, P), { tone: "hi", inner: L(G.arcOf(F, s0 / 2, 8.7, P), { tone: "lo" }) }))));
  const ribs = [];
  for (let i = 1; i < 12; i++) {
    const s = s0 + ((s1 - s0) * i) / 12;
    ribs.push(G.arcOf(F, s, rOf(s), P, { slope: dOf(s) }));
  }
  out.push(lant(count(S(G.bandOfProfile(profile, F, P, { smooth: { slope: dOf, radius: rOf, rows: 4 } }), { tone: "hi", inner: L(ribs.join(""), { tone: "lo" }) }))));
  out.push(roof(count(S(G.disc(s1, s1 + 1.8, 8.4, F, P), { tone: "hi" }))));
  out.push(roof(count(S(G.disc(s1 + 1.8, s1 + 2.6, 5.2, F, P), { tone: "hi" }))));
  out.push(roof(cyl(LC[0], LC[1], 0.9, z0 + s1 + 2.6, Z.beam - (z0 + s1 + 2.6), { tone: "hi" }, 12)));
  return a.amSlide(out.join(""), [0, 0.5, 0], P, { period: 5600 });
}

function beams() {
  const out = [];
  const band = { x: GX0 - 2, y: YS[0] - 2, w: GX1 - GX0 + 4, d: YS[3] - YS[0] + 4, r: 0 };
  const seam = [faceLine("x", band.x + band.w, band.y, Z.beam + 2.2, band.y + band.d, Z.beam + 2.2), faceLine("y", band.y + band.d, band.x, Z.beam + 2.2, band.x + band.w, Z.beam + 2.2)];
  out.push(verm(slab(band, Z.beam, Z.band - Z.beam, { tone: "mid", inner: L(seam.join(""), { tone: "lo" }) }, 2)));
  // the bracket course (kumimono): a band that steps out, with its blocks marked
  const br = k.insetPlan(band, -1.4);
  const ticks = [];
  const xf = br.x + br.w;
  const yf = br.y + br.d;
  for (let u = br.y + 3; u < br.y + br.d - 1; u += 3) ticks.push(faceLine("x", xf, u, Z.band, u, Z.eave));
  for (let u = br.x + 3; u < br.x + br.w - 1; u += 3) ticks.push(faceLine("y", yf, u, Z.band, u, Z.eave));
  out.push(wood(slab(br, Z.band, Z.eave - Z.band, { tone: "hi", inner: L(ticks.join(""), { tone: "lo" }) }, 2)));
  return { svg: out.join(""), br };
}

function gateRoof(br) {
  const out = [];
  const inner = { x: -12.6, y: YS[0] + 8, w: 3.2, d: YS[3] - YS[0] - 16 };
  const r = roofOf(br, 9, Z.eave, inner, Z.ridge, { lift: 3.2, flare: 2.4, fascia: 1.9 });
  out.push(roof(count(S(r.paths, { tone: "hi" })) + L(courses(r, [0.3, 0.55, 0.78]), { tone: "lo" })));
  // ridge (munagi) with its end tiles (onigawara)
  const ridge = { x: -13.2, y: inner.y - 1, w: 4.4, d: inner.d + 2, r: 0 };
  out.push(roof(slab(ridge, Z.ridge - 0.6, 3.4, { tone: "hi", inner: L(k.sideSeam(ridge, Z.ridge + 1.2, P, 2), { tone: "lo" }) }, 2)));
  for (const y of [ridge.y - 1.6, ridge.y + ridge.d - 1.6]) {
    out.push(roof(slab({ x: -13.8, y, w: 5.6, d: 3.2, r: 0.4 }, Z.ridge - 0.6, 6, { tone: "hi" }, 3, 0.3)));
  }
  return out.join("");
}

function gate() {
  const out = [platform()];
  for (const y of YS) out.push(pillar(GX0, y));
  out.push(bay(YS[0], YS[1]));
  out.push(chochin());
  out.push(bay(YS[2], YS[3]));
  for (const y of YS) out.push(pillar(GX1, y));
  const b = beams();
  out.push(b.svg);
  out.push(gateRoof(b.br));
  return out.join("");
}

// ---------- the street in front ----------
function bollard(x, y) {
  return stoneAc(cyl(x, y, 1.5, 0, 4.2, { tone: "mid" }, 16, 0.3) + count(S(G.sphereOf([x, y, 4.6], 1.3, P, { steps: 24 }), { tone: "mid" })));
}

// A jinrikisha waiting for a fare: two spoked wheels, the seat and its red cushion, the
// folded hood behind, a footboard and the two long shafts resting on the ground.
function rickshaw(x, y) {
  const out = [];
  const zA = 7.2;
  const R = 7;
  out.push(halo({ x: x - 8, y: y - 9, w: 36, d: 18, r: 6 }, 0, 0.1, 3));
  const wheel = (wy) => {
    const F = G.frameOf([x, wy, zA], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
    const parts = [];
    parts.push(count(S(G.ringBand(-0.55, 0.55, R - 1, R, F, P), { tone: "hi" })));
    parts.push(L(G.circleOf(F, 0.55, R - 1, P) + G.spokesOf(F, 0.55, 1.1, R - 1, 12, P), { tone: "mid" }));
    parts.push(count(S(G.disc(-0.9, 0.9, 1.2, F, P), { tone: "hi" })));
    return roof(parts.join(""));
  };
  out.push(wheel(y - 7.5));
  // folded hood: a quarter-round bundle behind the seat back
  const Fh = G.frameOf([x - 1.5, 0, 0], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
  const hood = [[0, 10], [0, 17]];
  for (let i = 1; i <= 8; i++) {
    const t = (Math.PI / 2) * (i / 8);
    hood.push([-Math.sin(t) * 6.5, 10 + Math.cos(t) * 7]);
  }
  out.push(roof(count(S(G.prismOf(Fh, hood, y - 5.5, y + 5.5, P), { tone: "hi" }))));
  out.push(roof(box(x - 1.5, y - 5, 2, 10, 10, 8, { tone: "hi" })));
  out.push(roof(box(x, y - 5, 8, 10, 6.5, 3.5, { tone: "hi" })));
  out.push(lant(slab({ x: x + 0.4, y: y - 4.6, w: 7, d: 9.2, r: 1 }, 10, 1.6, { tone: "hi" }, 3, 0.4)));
  out.push(roof(box(x + 8, y - 4.5, 1.4, 9, 3, 7, { tone: "hi" })));
  out.push(roof(box(x + 9.4, y - 4.5, 4.5, 9, 3, 1, { tone: "hi" })));
  // shafts, resting on the street, joined by a crossbar at the tips
  for (const dy of [-4, 4]) out.push(roof(count(S(bar([x + 9, y + dy, 8.5], [x + 27, y + dy, 1.2], 0.55), { tone: "hi" }))));
  out.push(roof(count(S(bar([x + 27, y - 4.6, 1.2], [x + 27, y + 4.6, 1.2], 0.6), { tone: "hi" }))));
  out.push(wheel(y + 7.5));
  return out.join("");
}

function ginkgo(x, y) {
  const out = [];
  out.push(stoneAc(slab({ x: x - 5, y: y - 5, w: 10, d: 10, r: 1 }, 0, 2.2, { tone: "mid" }, 3, 0.3)));
  out.push(K.roundTree(x, y, 2.2, 1.25, { wood, leaf: ac("pine") }));
  return out.join("");
}

// The plaza: big granite flags laid on the plinth top, joints running edge to edge.
function plaza() {
  const j = [];
  const r = PLINTH.r;
  for (let y = PLINTH.y + 16; y < PLINTH.y + PLINTH.d - r; y += 16) j.push(pathOf([at([PLINTH.x, y, 0]), at([PLINTH.x + PLINTH.w, y, 0])]));
  for (let x = PLINTH.x + 18; x < PLINTH.x + PLINTH.w - r; x += 18) j.push(pathOf([at([x, PLINTH.y, 0]), at([x, PLINTH.y + PLINTH.d, 0])]));
  return L(j.join(""), { tone: "faint" });
}

// A two-storey shop of the old street (Nakamise / Kaminarimon-dōri): plaster upper floor,
// a shop front with its shutters, an awning, and a dark tiled hip roof.
function shop(x, y, w, d) {
  const out = [];
  const plan = { x, y, w, d, r: 0 };
  out.push(halo(k.insetPlan(plan, -3), 0, 0.1, 3));
  const xf = x + w;
  const yf = y + d;
  const shut = [];
  for (let u = y + 2.5; u < yf - 1; u += 2.5) shut.push(faceLine("x", xf, u, 0, u, 9));
  for (let u = x + 2.5; u < xf - 1; u += 2.5) shut.push(faceLine("y", yf, u, 0, u, 9));
  out.push(wood(slab(plan, 0, 10, { tone: "mid", inner: L(shut.join(""), { tone: "lo" }) }, 2)));
  // awning over the shop front
  out.push(roof(slab({ x: x - 0.8, y: y - 0.8, w: w + 3.4, d: d + 3.4, r: 0 }, 10, 1.4, { tone: "hi" }, 2)));
  const win = [faceRect("x", xf, y + 3, y + d / 2 - 1.5, 13.5, 17.5), faceRect("x", xf, y + d / 2 + 1.5, yf - 3, 13.5, 17.5), faceRect("y", yf, x + 3, xf - 3, 13.5, 17.5)];
  out.push(slab(k.insetPlan(plan, 0.6), 11.4, 8.6, { tone: "mid", inner: L(win.join(""), { tone: "lo" }) }, 2));
  const r = K.roofOf(k.insetPlan(plan, 0.6), 2.6, 20, { x: x + w / 2 - 1, y: y + 3, w: 2, d: d - 6 }, 26, { lift: 0.8, flare: 0.6, fascia: 0.9, n: 4 });
  out.push(roof(count(S(r.paths, { tone: "hi" })) + L(courses(r, [0.5]), { tone: "lo" })));
  return out.join("");
}

// ---------- assemble ----------
const front = [
  { at: [22, -20, 0], svg: bollard(22, -20) },
  { at: [22, 16, 0], svg: bollard(22, 16) },
  { at: [46, -20, 0], svg: bollard(46, -20) },
  { at: [46, 16, 0], svg: bollard(46, 16) },
  { at: [58, -24, 0], svg: ginkgo(60, -27) },
  { at: [46, -50, 0], svg: shop(38, -58, 22, 16) },
  { at: [36, 36, 0], svg: rickshaw(30, 36) },
  { at: [8, 60, 0], svg: K.roundTree(8, 60, 0, 1.1, { wood, leaf: ac("pine") }) },
];

const body = minify([
  K.plinth(),
  plaza(),
  approach(),
  shop(-60, 50, 18, 18),
  gate(),
  ...byDepth(front, (i) => i.at).map((i) => i.svg),
].join(""));

const LABEL = "Kaminarimon, the Thunder Gate of Sensō-ji in Asakusa, in isometric view: vermilion pillars, a long dark roof and the giant red paper lantern hanging in the passage, with a rickshaw waiting in front.";

emit({
  nn: "09",
  here: HERE,
  out: join(HERE, "../out"),
  subject: "Kaminarimon (Asakusa)",
  doc: [
    "Kaminarimon isométrico (puerta del Trueno de Sensō-ji, Asakusa) — día 9.",
    "",
    "Pilares bermellón, recintos de Fūjin y Raijin tras celosías, tejado largo y el gran",
    "chōchin rojo colgando en el paso (se mece levemente, solo CSS; se detiene con",
    "prefers-reduced-motion). Delante, el enlosado, bolardos, un rickshaw y un ginkgo.",
  ],
  label: LABEL,
  body,
  accents: accentsFor,
  solids: K.counter.n,
});
