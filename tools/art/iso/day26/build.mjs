// Day 26 (Osaka → Tokyo, Akihabara): an Akihabara "electric town" corner as an isometric
// diorama on the set's plinth. A tall corner building wrapped in sign panels: a vertical
// stack of sign boxes on each face (blank coloured panels, no text), horizontal bands between
// the floors, a shop front with an awning and a row of capsule-toy machines on the pavement,
// a rooftop billboard frame, water tank and plant; a slim pencil building and a lower
// neighbour with their own signs; the street with its lane marks, lamps and a few people.
// One sign stack breathes and the band lights pulse (CSS only).
//
//   node build.mjs  → day26-light/dark.svg/.html here, ../out/day26Iso.markup.ts

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { k, a, G, SITE, mix, baseAccents, PLINTH, fitOf, kitFor, minify, emit } from "../lib-09-26/common.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

function accentsFor(theme) {
  const s = SITE[theme];
  const b = baseAccents(theme);
  return {
    roof: b.roof,
    asphalt: theme === "light" ? mix(s.ink, s.paper, 0.72) : mix(s.paper, s.ink, 0.2),
    paint: theme === "light" ? s.paper : mix(s.ink, s.paper, 0.15),
    glass: theme === "light" ? mix(s.ink, s.paper, 0.86) : mix(s.paper, s.ink, 0.3),
    coral: s.coral,
    amber: s.amber,
  };
}

const P = fitOf();
const K = kitFor(P);
const { at, S, L, ac, byDepth, pathOf, count, slab, box, cyl, halo, faceLine, faceRect, facePoly, bar } = K;
const roof = ac("roof");
const asphalt = ac("asphalt");
const paintAc = ac("paint");
const glass = ac("glass");
const coral = ac("coral");
const amber = ac("amber");

const KERB = 1.4;
const ROAD_Z = 0.5;

// ---------- ground ----------
const ROAD = { x: 34, y: -60.5, w: 40.5, d: 129, r: 4.5 };
const WALK = { x: -64.5, y: -60.5, w: 98.5, d: 129, r: 4.5 };
function ground() {
  const out = [];
  out.push(asphalt(slab(ROAD, 0, ROAD_Z, { tone: "mid", crease: "none" }, 6)));
  // centre-line dashes and the edge line, as road paint
  const quads = [];
  for (let y = ROAD.y + 6; y + 7 <= ROAD.y + ROAD.d - 4; y += 12) if (y + 7 < 30 || y > 46) quads.push([[55.4, y], [56.6, y], [56.6, y + 7], [55.4, y + 7]]);
  quads.push([[37, ROAD.y + 2], [37.8, ROAD.y + 2], [37.8, 30], [37, 30]]);
  quads.push([[37, 46], [37.8, 46], [37.8, ROAD.y + ROAD.d - 2], [37, ROAD.y + ROAD.d - 2]]);
  // a zebra crossing
  for (let x = 38.6; x + 2 <= 72; x += 4) quads.push([[x, 32], [x + 2, 32], [x + 2, 44], [x, 44]]);
  const d = quads.map((q) => pathOf(q.map(([x, y]) => at([x, y, ROAD_Z + 0.05])), true)).join("");
  out.push(paintAc(count(S({ fill: d, outline: d, crease: "", top: d, shades: ["", "", "", ""] }, { tone: "faint", crease: "none" }))));
  const joints = [];
  for (let y = WALK.y + 10; y < WALK.y + WALK.d - 6; y += 10) joints.push(pathOf([at([WALK.x, y, KERB]), at([WALK.x + WALK.w, y, KERB])]));
  out.push(slab(WALK, 0, KERB, { tone: "mid", inner: L(joints.join(""), { tone: "faint" }) + L(k.sideSeam(WALK, 0.7, P, 6), { tone: "faint" }) }, 6, 0.3));
  return out.join("");
}

// ---------- buildings ----------
// A block with floor seams round its near faces and a window strip per floor on each.
function block(plan, z0, z1, { floor = 7.5, from = z0 + 10, win = true, tone = "mid" } = {}) {
  const xf = plan.x + plan.w;
  const yf = plan.y + plan.d;
  const lines = [];
  const marks = [];
  for (let z = from; z < z1 - 2; z += floor) {
    lines.push(k.sideSeam(plan, z, P, 2));
    if (win) {
      marks.push(faceRect("x", xf, plan.y + 2, yf - 2, z + 2, z + floor - 2.2));
      marks.push(faceRect("y", yf, plan.x + 2, xf - 2, z + 2, z + floor - 2.2));
    }
  }
  return slab(plan, z0, z1 - z0, { tone, inner: L(lines.join(""), { tone: "faint" }) + L(marks.join(""), { tone: "lo" }) }, 2);
}

// A sign box standing off a face: a blank coloured panel with a thin inset frame.
function signBox(plan, z0, h, acc, lit = false, cls = "sign-lit") {
  const inset = [];
  const xf = plan.x + plan.w;
  const yf = plan.y + plan.d;
  if (plan.d >= plan.w) inset.push(faceRect("x", xf, plan.y + 0.7, yf - 0.7, z0 + 0.7, z0 + h - 0.7));
  else inset.push(faceRect("y", yf, plan.x + 0.7, xf - 0.7, z0 + 0.7, z0 + h - 0.7));
  const svg = acc(slab(plan, z0, h, { tone: "hi", inner: L(inset.join(""), { tone: "lo" }) }, 2));
  if (!lit) return svg;
  const face = plan.d >= plan.w
    ? facePoly("x", xf, [[plan.y + 0.7, z0 + 0.7], [yf - 0.7, z0 + 0.7], [yf - 0.7, z0 + h - 0.7], [plan.y + 0.7, z0 + h - 0.7]])
    : facePoly("y", yf, [[plan.x + 0.7, z0 + 0.7], [xf - 0.7, z0 + 0.7], [xf - 0.7, z0 + h - 0.7], [plan.x + 0.7, z0 + h - 0.7]]);
  return svg + acc(`<path d="${face}" style="fill:var(--anatomy-lit-top);stroke:none" class="${cls}"/>`);
}

const MB = { x: -28, y: -40, w: 50, d: 58, r: 0 };
const MB_TOP = 70;

function mainBuilding() {
  const out = [];
  const xf = MB.x + MB.w;
  const yf = MB.y + MB.d;
  out.push(halo(k.insetPlan(MB, -4), KERB, 0.1, 3));
  // shop floor: glazing with mullions, the upper floors above
  const shop = [];
  for (let u = MB.y + 4; u < yf - 1; u += 5) shop.push(faceLine("x", xf, u, KERB, u, 10));
  for (let u = MB.x + 4; u < xf - 1; u += 5) shop.push(faceLine("y", yf, u, KERB, u, 10));
  out.push(glass(slab(MB, KERB, 10 - KERB, { tone: "mid", inner: L(shop.join(""), { tone: "lo" }) }, 2)));
  out.push(glass(block(MB, 10, MB_TOP, { from: 17.5 })));
  out.push(slab(k.insetPlan(MB, -0.6), MB_TOP, 1.6, { tone: "mid" }, 2, 0.3));
  // awning over the shop front
  out.push(roof(slab({ x: xf, y: MB.y + 2, w: 4.5, d: MB.d - 4, r: 0 }, 9.2, 1.1, { tone: "hi" }, 2)));
  // roof: water tank, plant room
  out.push(box(MB.x + 6, MB.y + 6, 14, 12, MB_TOP + 1.6, 6, { tone: "mid", inner: L(k.sideSeam({ x: MB.x + 6, y: MB.y + 6, w: 14, d: 12, r: 0 }, MB_TOP + 4.6, P, 2), { tone: "lo" }) }));
  out.push(cyl(MB.x + 30, MB.y + 12, 3.6, MB_TOP + 1.6, 6.5, { tone: "mid", inner: L(k.sideArc(MB.x + 30, MB.y + 12, 3.6, MB_TOP + 4.6, P, 20), { tone: "faint" }) }, 20, 0.3));
  return out.join("");
}

// The rooftop billboard: a blank panel on a steel frame, set back from the corner.
function billboard() {
  const out = [];
  const x = MB.x + MB.w - 8;
  const y0 = MB.y + 22;
  const y1 = MB.y + MB.d - 4;
  const z0 = MB_TOP + 1.6;
  for (const y of [y0 + 2, (y0 + y1) / 2, y1 - 2]) out.push(roof(box(x - 2.5, y - 0.4, 0.8, 0.8, z0, 5, { tone: "hi" })));
  out.push(roof(count(S(bar([x - 2.1, y0 + 1, z0 + 4.6], [x - 2.1, y1 - 1, z0 + 4.6], 0.35), { tone: "hi" }))));
  const panel = { x: x - 1.6, y: y0, w: 1.6, d: y1 - y0, r: 0 };
  out.push(signBox(panel, z0 + 5, 11, amber));
  return out.join("");
}

// Sign stacks on both near faces of the corner, and horizontal bands between floors.
function signs() {
  const out = [];
  const xf = MB.x + MB.w;
  const yf = MB.y + MB.d;
  // +x face: horizontal bands
  out.push(signBox({ x: xf, y: MB.y + 3, w: 1, d: 34, r: 0 }, 11.6, 4.6, coral, true));
  out.push(signBox({ x: xf, y: MB.y + 8, w: 1, d: 26, r: 0 }, 41.6, 4.6, amber, true));
  out.push(signBox({ x: xf, y: MB.y + 3, w: 1, d: 18, r: 0 }, 26.6, 4.6, coral));
  out.push(signBox({ x: xf, y: MB.y + 24, w: 1, d: 14, r: 0 }, 26.6, 4.6, amber));
  out.push(signBox({ x: xf, y: MB.y + 3, w: 1, d: 30, r: 0 }, 56.6, 4.6, coral, true));
  // an LED strip along the parapet of both near faces
  out.push(amber(slab({ x: xf, y: MB.y, w: 0.6, d: MB.d + 0.6, r: 0 }, MB_TOP - 2.6, 1.4, { tone: "hi" }, 2)));
  out.push(amber(slab({ x: MB.x, y: yf, w: MB.w, d: 0.6, r: 0 }, MB_TOP - 2.6, 1.4, { tone: "hi" }, 2)));
  // +y face: a band
  out.push(signBox({ x: MB.x + 4, y: yf, w: 30, d: 1, r: 0 }, 26.6, 4.6, amber, true));
  return out.join("");
}

// The vertical stack of sign boxes on the +x face near the corner (the one that breathes).
function stackX() {
  const xf = MB.x + MB.w;
  const plan = { x: xf, y: MB.y + MB.d - 9, w: 3, d: 6, r: 0 };
  const cols = [coral, amber, (s) => s, coral, amber, coral, (s) => s, amber];
  const parts = [];
  // a steel spine the boxes hang from
  parts.push(roof(box(xf, plan.y + 2.6, 0.8, 0.8, 12, MB_TOP - 12, { tone: "hi" })));
  for (let i = 0; i < 8; i++) parts.push(signBox(plan, 14 + i * 7, 6.2, cols[i], i % 2 === 0, "sign-lit-b"));
  return parts.join("");
}

function stackY() {
  const yf = MB.y + MB.d;
  const plan = { x: MB.x + MB.w - 12, y: yf, w: 6, d: 3, r: 0 };
  const cols = [amber, (s) => s, coral, amber, (s) => s, coral];
  const parts = [];
  for (let i = 0; i < 6; i++) parts.push(signBox(plan, 34 + i * 6, 5.4, cols[i], i % 2 === 1));
  return parts.join("");
}

// A slim pencil building behind the main one, with its own sign column and AC units.
function pencil() {
  const out = [];
  const pb = { x: -20, y: -60, w: 34, d: 17, r: 0 };
  out.push(halo(k.insetPlan(pb, -3), KERB, 0.1, 3));
  out.push(glass(slab(pb, KERB, 8.6, { tone: "mid" }, 2)));
  out.push(block(pb, 10, 54, { from: 17.5 }));
  out.push(slab(k.insetPlan(pb, -0.5), 54, 1.4, { tone: "mid" }, 2, 0.3));
  const xf = pb.x + pb.w;
  for (let i = 0; i < 5; i++) out.push(signBox({ x: xf, y: pb.y + 2, w: 2.6, d: 5, r: 0 }, 16 + i * 7.5, 6.6, i % 2 ? amber : coral));
  for (const z of [18.4, 25.9, 33.4]) out.push(box(xf, pb.y + 10, 2.6, 4.4, z, 2.8, { tone: "mid", inner: L(k.sideSeam({ x: xf, y: pb.y + 10, w: 2.6, d: 4.4, r: 0 }, z + 1.4, P, 2), { tone: "faint" }) }));
  return out.join("");
}

// A lower neighbour toward the viewer: four storeys and a rooftop sign.
function neighbour() {
  const out = [];
  const nb = { x: -28, y: 24, w: 40, d: 36, r: 0 };
  out.push(halo(k.insetPlan(nb, -3), KERB, 0.1, 3));
  const shop = [];
  for (let u = nb.y + 4; u < nb.y + nb.d - 1; u += 5) shop.push(faceLine("x", nb.x + nb.w, u, KERB, u, 10));
  out.push(glass(slab(nb, KERB, 10 - KERB, { tone: "mid", inner: L(shop.join(""), { tone: "lo" }) }, 2)));
  out.push(block(nb, 10, 40, { from: 17.5 }));
  out.push(slab(k.insetPlan(nb, -0.5), 40, 1.4, { tone: "mid" }, 2, 0.3));
  out.push(roof(slab({ x: nb.x + nb.w, y: nb.y + 2, w: 4, d: nb.d - 4, r: 0 }, 9.2, 1.1, { tone: "hi" }, 2)));
  out.push(signBox({ x: nb.x + nb.w, y: nb.y + 4, w: 1, d: 28, r: 0 }, 19.6, 4.6, coral));
  for (const y of [nb.y + 8, nb.y + 28]) out.push(roof(box(nb.x + nb.w - 6, y - 0.4, 0.8, 0.8, 41.4, 4.4, { tone: "hi" })));
  out.push(signBox({ x: nb.x + nb.w - 5.4, y: nb.y + 6, w: 1.4, d: 24, r: 0 }, 45.8, 7, amber));
  return out.join("");
}

// ---------- the street ----------
// A capsule-toy machine stack: two machines, each with a round window and a coin knob.
function gacha(x, y) {
  const out = [];
  const plan = { x: x - 1.6, y: y - 1.6, w: 3.2, d: 3.2, r: 0.3 };
  const xf = plan.x + plan.w;
  const circle = (cz) => facePoly("x", xf, Array.from({ length: 20 }, (_, i) => [y + Math.cos((i / 20) * Math.PI * 2) * 1.05, cz + Math.sin((i / 20) * Math.PI * 2) * 1.05]));
  const marks = [circle(9), circle(4.4), k.sideSeam(plan, KERB + 5.6, P, 3)];
  out.push(halo(k.insetPlan(plan, -1), KERB, 0.1, 1));
  out.push(slab(plan, KERB, 11, { tone: "mid", inner: L(marks.join(""), { tone: "lo" }) }, 3, 0.2));
  out.push(k.dotsSvg([at([xf, y, 6.9]), at([xf, y, 2.3])], { size: 0.55, tone: "hi" }));
  return out.join("");
}

function person(x, y, shade, z0 = x > ROAD.x ? ROAD_Z : KERB) {
  const out = [];
  out.push(halo({ x: x - 1.4, y: y - 1.4, w: 2.8, d: 2.8, r: 1.4 }, z0, 0.1, 1));
  out.push(roof(box(x - 0.45, y - 0.7, 0.9, 1.4, z0, 2.4, { tone: "hi" })));
  out.push(ac(shade)(cyl(x, y, 1.05, z0 + 2.4, 2.9, { tone: "hi" }, 14, 0.3)));
  out.push(count(S(G.sphereOf([x, y, z0 + 6.1], 0.8, P, { steps: 20 }), { tone: "mid" })));
  return out.join("");
}

function streetLamp(x, y) {
  const out = [];
  out.push(halo({ x: x - 1.5, y: y - 1.5, w: 3, d: 3, r: 1.5 }, KERB, 0.1, 1));
  out.push(cyl(x, y, 0.55, KERB, 20, { tone: "mid" }, 10));
  out.push(count(S(bar([x, y, 21], [x + 5, y, 21], 0.35), { tone: "mid" })));
  out.push(slab({ x: x + 3.4, y: y - 1, w: 3.2, d: 2, r: 0.4 }, 19.8, 1.2, { tone: "mid" }, 3, 0.2));
  return out.join("");
}

// A taxi waiting at the kerb: body, glasshouse, roof lamp and four wheels.
function taxi(x, y) {
  const out = [];
  const z = ROAD_Z;
  out.push(halo({ x: x - 4, y: y - 9, w: 8, d: 18, r: 3 }, z, 0.1, 2));
  const wheel = (wx, wy) => roof(count(S(G.disc(-0.6, 0.6, 1.5, G.frameOf([wx, wy, z + 1.5], [1, 0, 0], [0, 1, 0], [0, 0, 1]), P), { tone: "hi" })));
  out.push(wheel(x - 3.1, y - 5));
  out.push(wheel(x - 3.1, y + 5));
  const bodyPlan = { x: x - 3.2, y: y - 8, w: 6.4, d: 16, r: 1.2 };
  out.push(amber(slab(bodyPlan, z + 1, 3.2, { tone: "hi", inner: L(k.sideSeam(bodyPlan, z + 2.6, P, 4), { tone: "lo" }) }, 4, 0.3)));
  const cab = { x: x - 2.6, y: y - 4, w: 5.2, d: 8.4, r: 0.8 };
  const panes = [k.sideSeam(cab, z + 5.6, P, 3)];
  out.push(glass(slab(cab, z + 4.2, 2.6, { tone: "hi", inner: L(panes.join(""), { tone: "lo" }) }, 3, 0.3)));
  out.push(coral(slab({ x: x - 0.6, y: y - 1.2, w: 1.2, d: 2.4, r: 0.3 }, z + 6.8, 0.9, { tone: "hi" }, 3)));
  out.push(wheel(x + 3.1, y - 5));
  out.push(wheel(x + 3.1, y + 5));
  return out.join("");
}

// ---------- assemble ----------
const street = [
  ...[-6, -2, 2, 6].map((dy) => ({ at: [26.5, MB.y + 30 + dy, 0], svg: gacha(26.5, MB.y + 30 + dy) })),
  { at: [31, -50, 0], svg: streetLamp(31, -50) },
  { at: [31, 22, 0], svg: streetLamp(31, 22) },
  { at: [50, -20, 0], svg: taxi(50, -20) },
  ...[[25, -26, "coral"], [29, -12, "glass"], [24, 8, "amber"], [28, 40, "glass"], [23, 56, "roof"], [44, 38, "roof"]].map(([x, y, c]) => ({ at: [x, y, 0], svg: person(x, y, c) })),
];

const body = minify([
  K.plinth(),
  ground(),
  pencil(),
  mainBuilding(),
  billboard(),
  signs(),
  stackX(),
  stackY(),
  neighbour(),
  ...byDepth(street, (i) => i.at).map((i) => i.svg),
].join(""))
  // the lit faces of the band signs pulse together, slowly
  .replace(/<path d="([^"]+)" style="fill:var\(--anatomy-lit-top\);stroke:none" class="(sign-lit(?:-b)?)"\/>/g, (_, d, c) => a.amPulse(`<path d="${d}" style="fill:var(--anatomy-lit-top);stroke:none"/>`, { period: 4400, delay: c === "sign-lit-b" ? 2200 : 0, min: 0.2 }));

const LABEL = "An Akihabara electric-town corner in isometric view: a tall building wrapped in blank coloured sign boxes and bands, capsule-toy machines on the pavement, a rooftop billboard, a pencil building and a lower neighbour, street lamps and a few people.";

emit({
  nn: "26",
  here: HERE,
  out: join(HERE, "../out"),
  subject: "Akihabara (Electric Town)",
  doc: [
    "Akihabara isométrico (esquina de Electric Town) — día 26.",
    "",
    "Edificio alto forrado de cajas y bandas de rótulos (paneles de color en blanco, sin texto",
    "ni marcas), máquinas gachapon en la acera, valla publicitaria en la azotea, un edificio",
    "lápiz y otro más bajo, farolas y algunos peatones. Las caras iluminadas de los rótulos",
    "respiran despacio (solo CSS; se detienen con prefers-reduced-motion).",
  ],
  label: LABEL,
  body,
  accents: accentsFor,
  solids: K.counter.n,
});
