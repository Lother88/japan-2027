// Nakano Broadway (Thursday 27 May: Kiyosumi/Fukagawa in the morning, Nakano in the afternoon)
// as an isometric diorama on the set's plinth. The covered Sun Mall arcade (an arched steel
// roof on slim columns, left open so the street shows) runs along the front and ends in the
// Nakano Broadway building: a stone podium with its entrance and a "中野ブロードウェイ" sign,
// and the residential tower on top. Along the arcade, small otaku shops spill onto the street:
// figure vitrines, a row of capsule-toy (gachapon) machines, a manga shelf and a book wagon, a
// pile of toy boxes and a vending machine; lit shop fronts at the back of the entrance hall;
// banners hang from the ribs and a few shoppers walk through. The signs carry no brands or logos.
// Motion (CSS only, opacity/transform): one capsule machine's handle turns slowly, and one
// blade sign flickers.
//
//   node build.mjs  → nakano-light/dark.svg/.html here, ../out/nakanoIso.markup.ts

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { k, a, G, SITE, mix, baseAccents, fitOf, kitFor, minify, W, H, WEIGHT } from "../lib-09-26/common.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "../out");
const NAME = "nakano";
const SCOPE = `.iso-${NAME}`;
const PRE = `${NAME}-`;

function accentsFor(theme) {
  const s = SITE[theme];
  const b = baseAccents(theme);
  const navy = theme === "light" ? s.ink : mix(SITE.light.ink, s.ink, 0.3);
  return {
    roof: b.roof,
    wood: b.wood,
    stone: b.stone,
    glass: theme === "light" ? mix(s.ink, s.paper, 0.86) : mix(s.paper, s.ink, 0.3),
    navy,
    cream: theme === "light" ? s.paper : SITE.light.paper,
    coral: s.coral,
    amber: s.amber,
    green: s.green,
  };
}

const P = fitOf();
const K = kitFor(P);
const { at, S, L, ac, byDepth, pathOf, count, slab, box, cyl, halo, faceLine, faceRect, facePoly, polySolid, bar } = K;
const roof = ac("roof");
const wood = ac("wood");
const stone = ac("stone");
const glass = ac("glass");
const tile = stone;
const navy = ac("navy");
const cream = ac("cream");
const coral = ac("coral");
const amber = ac("amber");
const green = ac("green");
const plain = (s) => s;

const FLOOR = 0.8;

// A flat shape in a face plane, filled with the group's top tone and outlined.
const flat = (d, tone = "lo") => `<path class="iso-line ${PRE}f" data-tone="${tone}" d="${d}"/>`;
const circ = (face, c, u, z, r, n = 14) => facePoly(face, c, Array.from({ length: n }, (_, i) => [u + Math.cos((i / n) * Math.PI * 2) * r, z + Math.sin((i / n) * Math.PI * 2) * r]));

// A sign box standing off a face: a blank coloured panel with an inset frame (from day 26).
function signBox(plan, z0, h, acc, { lit = false, cls = "", inset = 0.7 } = {}) {
  const xf = plan.x + plan.w;
  const yf = plan.y + plan.d;
  const onX = plan.d >= plan.w;
  const frame = onX ? faceRect("x", xf, plan.y + inset, yf - inset, z0 + inset, z0 + h - inset) : faceRect("y", yf, plan.x + inset, xf - inset, z0 + inset, z0 + h - inset);
  const svg = acc(slab(plan, z0, h, { tone: "hi", inner: L(frame, { tone: "lo" }) }, 2));
  if (!lit) return svg;
  return svg + acc(`<path d="${frame}" style="fill:var(--anatomy-lit-top);stroke:none"${cls ? ` class="${cls}"` : ""}/>`);
}

// A block with floor seams and a window strip per floor on its two near faces (from day 26).
function block(plan, z0, z1, { floor = 7.5, from = z0 + 7.5, tone = "mid", xFrom = -Infinity } = {}) {
  const xf = plan.x + plan.w;
  const yf = plan.y + plan.d;
  const lines = [];
  const marks = [];
  for (let z = from; z < z1 - 2; z += floor) {
    lines.push(k.sideSeam(plan, z, P, 2));
    if (z + 2 >= xFrom) marks.push(faceRect("x", xf, plan.y + 2, yf - 2, z + 2, z + floor - 2.2));
    marks.push(faceRect("y", yf, plan.x + 2, xf - 2, z + 2, z + floor - 2.2));
  }
  return slab(plan, z0, z1 - z0, { tone, inner: L(lines.join(""), { tone: "faint" }) + L(marks.join(""), { tone: "lo" }) }, 2);
}

function person(x, y, shade, z0 = FLOOR) {
  const out = [];
  out.push(halo({ x: x - 1.4, y: y - 1.4, w: 2.8, d: 2.8, r: 1.4 }, z0, 0.1, 1));
  out.push(roof(box(x - 0.45, y - 0.7, 0.9, 1.4, z0, 2.4, { tone: "hi" })));
  out.push(ac(shade)(cyl(x, y, 1.05, z0 + 2.4, 2.9, { tone: "hi" }, 14, 0.3)));
  out.push(count(S(G.sphereOf([x, y, z0 + 6.1], 0.8, P, { steps: 10 }), { tone: "mid" })));
  return out.join("");
}

// ---------- the sign text: Zen Kaku Gothic New Bold (OFL, the site's own sans) as outlines ----------
// Font units scaled to 100/em (y up), rounded; drawn in the sign's face plane so it needs no web font.
const GLYPHS = {"中":[100,"M44 -8L44 25L8 25L8 64L44 64L44 84L56 84L56 64L92 64L92 25L56 25L56 -8ZM56 36L80 36L80 54L56 54ZM20 36L44 36L44 54L20 54Z"],"野":[100,"M6 -4L4 7Q6 7 12 8Q17 8 23 9L23 20L7 20L7 29L23 29L23 37L6 37L6 80L50 80L50 37L34 37L34 29L50 29L50 20L34 20L34 11Q39 12 44 13Q48 14 50 14L50 4Q46 3 40 2Q34 1 27 0Q20 -2 15 -3Q9 -4 6 -4ZM56 -7Q55 -6 55 -4Q54 -1 54 1Q54 3 53 4L61 4Q63 4 64 5Q64 6 64 8L64 38L53 38L53 48L74 48Q70 51 65 54Q60 58 56 60L62 68Q64 67 66 66Q68 65 70 64Q72 66 73 68Q75 69 76 71L54 71L54 80L89 80L94 76Q92 73 90 70Q87 67 84 64Q82 61 79 58Q82 56 85 54L80 48L93 48L99 43Q97 39 94 35Q92 30 89 26Q86 22 83 19Q82 20 80 22Q78 23 76 24L76 3Q76 -2 73 -5Q70 -7 64 -7ZM16 47L23 47L23 55L16 55ZM34 47L40 47L40 55L34 55ZM16 63L23 63L23 71L16 71ZM34 63L40 63L40 71L34 71ZM76 27Q78 30 81 33Q83 36 84 38L76 38Z"],"ブ":[100,"M26 -1Q25 1 24 3Q23 5 21 7Q20 9 18 10Q37 16 50 28Q62 38 68 56Q63 56 57 55Q51 55 45 55Q38 55 33 55Q27 54 23 54Q18 54 16 54L16 67Q18 67 23 67Q28 67 34 67Q39 67 45 67Q52 67 57 67Q63 67 67 68Q72 68 75 68L83 64Q80 48 72 35Q64 22 52 13Q41 4 26 -1ZM88 62Q86 65 83 68Q80 72 77 74L82 78Q84 77 86 75Q88 73 90 70Q92 68 93 66ZM96 69Q94 72 91 76Q88 79 86 81L91 86Q92 85 95 82Q97 80 99 78Q101 75 102 74Z"],"ロ":[100,"M20 11L20 64L80 64L80 11ZM32 22L68 22L68 53L32 53Z"],"ー":[100,"M9 32Q9 33 9 35Q9 38 9 40Q9 42 9 44Q11 44 16 44Q21 44 28 44Q34 43 42 43Q50 43 57 43Q65 43 72 43Q79 44 84 44Q89 44 91 44Q91 43 91 40Q91 38 91 35Q91 33 91 32Q88 32 84 32Q79 32 72 32Q66 32 58 32Q51 32 44 32Q36 32 30 32Q23 32 18 32Q12 32 9 32Z"],"ド":[100,"M39 -3L39 78L51 78L51 47L55 54Q58 52 62 49Q66 47 70 44Q75 42 79 39Q83 37 86 36Q85 35 83 33Q82 31 80 29Q79 26 78 25Q76 26 72 28Q69 30 65 33Q61 35 57 38Q54 40 51 42L51 -3ZM87 63Q85 66 82 70Q79 73 76 76L82 80Q83 79 85 76Q87 74 89 72Q91 69 92 67ZM77 56Q76 59 72 62Q70 66 67 68L73 73Q74 71 76 69Q78 67 80 64Q82 62 83 60Z"],"ウ":[100,"M40 -6Q38 -3 36 0Q33 2 30 4Q39 8 47 15Q55 22 61 31Q67 39 70 49L30 49Q30 46 30 42Q30 38 30 34Q30 31 30 30L17 30L17 61Q21 61 28 61Q35 60 44 60L44 81L56 81L56 60Q63 61 68 61Q74 61 76 61L85 57Q83 47 79 37Q75 28 69 20Q63 12 55 5Q48 -1 40 -6Z"],"ェ":[100,"M20 9L20 19Q22 19 29 19Q36 19 46 19L46 38Q39 38 34 38Q29 38 27 37L27 47Q30 47 36 47Q42 47 51 47Q59 47 66 47Q72 47 74 47L74 37Q72 38 67 38Q63 38 56 38L56 19Q65 19 71 19Q78 19 80 19L80 9Q77 9 70 9Q62 9 50 9Q44 9 37 9Q31 9 26 9Q22 9 20 9Z"],"イ":[100,"M48 -2L48 42Q41 36 33 32Q25 28 17 24Q16 26 15 28Q14 30 12 32Q11 34 9 35Q18 38 27 43Q36 48 45 54Q54 60 61 67Q68 73 73 80L83 73Q79 67 73 62Q67 56 61 51L61 -2Z"]};

function faceText(text, origin, u, em) {
  const m = a.planeMatrix(origin, u, [0, 0, 1], P);
  let x = 0;
  const paths = [];
  for (const ch of text) {
    const [adv, d] = GLYPHS[ch];
    paths.push(`<path transform="translate(${x} 0)" d="${d}"/>`);
    x += adv;
  }
  return { svg: `<g transform="${m} scale(${+(em / 100).toFixed(4)})" style="fill:var(--anatomy-top);stroke:none">${paths.join("")}</g>`, width: (x / 100) * em };
}

// ---------- layout ----------
// The plinth's usable top runs x −64.5..74.5, y −60.5..68.5 (as in the other days).
const BW = { x: -64.5, y: -58, w: 48.5, d: 126.5, r: 0 }; // Broadway podium; its front is x = −16
const BW_FRONT = BW.x + BW.w;
const BW_H = 50;
const DOOR = { y0: 32, y1: 64, z: 21, back: -36 }; // the entrance opening and its depth
const ROW_Y = 30; // the shop fronts along the arcade (+y faces)
const SHOPS = [
  { x0: -16, x1: 2, h: 40, sign: coral, blade: amber },
  { x0: 2, x1: 20, h: 52, sign: amber, blade: navy },
  { x0: 20, x1: 40, h: 34, sign: navy, blade: coral },
  { x0: 40, x1: 58, h: 46, sign: coral, blade: amber, flicker: true },
  { x0: 58, x1: 74.5, h: 38, sign: amber, blade: coral },
];
const ARC_X0 = -16;
const ARC_X1 = 74.5;
const POST_Y = 67;

// ---------- ground ----------
function ground() {
  const out = [];
  const floor = { x: ARC_X0, y: ROW_Y, w: ARC_X1 - ARC_X0, d: 68.5 - ROW_Y, r: 2 };
  const j = [];
  for (let x = ARC_X0 + 5; x < ARC_X1 - 1; x += 5) j.push(pathOf([at([x, ROW_Y, FLOOR]), at([x, floor.y + floor.d, FLOOR])]));
  for (const y of [36, 42.5, 54.5, 61]) j.push(pathOf([at([ARC_X0, y, FLOOR]), at([ARC_X1, y, FLOOR])]));
  // a paving band down the middle of the street
  const band = [pathOf([at([ARC_X0, 47, FLOOR]), at([ARC_X1, 47, FLOOR])]), pathOf([at([ARC_X0, 50, FLOOR]), at([ARC_X1, 50, FLOOR])])];
  out.push(tile(slab(floor, 0, FLOOR, { tone: "mid", inner: L(j.join(""), { tone: "faint" }) + L(band.join(""), { tone: "lo" }) }, 4, 0.3)));
  return out.join("");
}

// ---------- capsule-toy machines ----------
const CAPS = [coral, amber, navy, green];
// One machine (front on +y): the coin unit with its handle, chute and coin plate, the capsule
// window above it with a few capsules, and a coloured cap. `handle` draws the handle at `turn`.
function gachaMachine(x, y, z, acc, seed, { spin = false } = {}) {
  const out = [];
  const plan = { x, y, w: 3.4, d: 3, r: 0 };
  const yf = y + 3;
  const cx = x + 1.7;
  const marks = [
    k.sideSeam(plan, z + 2, P, 3),
    faceRect("y", yf, cx - 1.1, cx + 0.3, z + 0.3, z + 0.9), // capsule chute
    faceRect("y", yf, cx + 0.7, cx + 1.3, z + 0.9, z + 1.7), // coin plate
  ];
  out.push(slab(plan, z, 4.6, { tone: "mid", inner: L(marks.join(""), { tone: "lo" }) }, 2));
  // the window and the capsules behind it
  const wz = z + 3.35;
  out.push(glass(flat(circ("y", yf, cx, wz, 1.05, 12), "lo")));
  const spots = [[-0.45, -0.5], [0.4, -0.55], [0, -0.05], [-0.5, 0.35], [0.45, 0.3]];
  const caps = new Map();
  spots.forEach(([du, dz], i) => { const acc = CAPS[(seed + i) % CAPS.length]; caps.set(acc, (caps.get(acc) ?? "") + circ("y", yf + 0.01, cx + du, wz + dz, 0.32, 7)); });
  for (const [acc, d] of caps) out.push(acc(flat(d, "lo")));
  out.push(acc(slab({ ...plan, x: x - 0.1, y: y - 0.1, w: 3.6, d: 3.2 }, z + 4.6, 0.55, { tone: "hi" }, 2)));
  // the handle, in the face plane: a hub with a bar through it
  const hub = [cx - 0.35, yf + 0.02, z + 1.3];
  const m = a.planeMatrix(hub, [1, 0, 0], [0, 0, -1], P);
  const st = `class="${PRE}h"`;
  const turn = spin ? 0 : (seed * 37) % 90;
  const flatHandle = `<g transform="rotate(${turn})"><path d="M-0.95 -0.2L0.95 -0.2L0.95 0.2L-0.95 0.2Z" ${st}/></g><circle r="0.5" ${st}/>`;
  if (spin) {
    // the bar turns; the hub stays
    out.push(`<g transform="${m}"><g class="am-spin" style="--am-period:7.00s;--am-delay:0.00s;--am-dir:normal"><path d="M-0.95 -0.2L0.95 -0.2L0.95 0.2L-0.95 0.2Z" ${st}/></g><circle r="0.5" ${st}/></g>`);
  } else {
    out.push(`<g transform="${m}">${flatHandle}</g>`);
  }
  return out.join("");
}

// A stack of two machines on a low plinth.
function gachaStack(x, y, i, { spin = false } = {}) {
  const out = [];
  out.push(halo({ x: x - 0.6, y: y - 0.6, w: 4.6, d: 4.2, r: 0.5 }, FLOOR, 0.1, 1));
  out.push(gachaMachine(x, y, FLOOR, CAPS[i % CAPS.length], i * 3));
  out.push(gachaMachine(x, y, FLOOR + 5.15, CAPS[(i + 1) % CAPS.length], i * 3 + 1, { spin }));
  return out.join("");
}

// ---------- shop fixtures ----------
// A glass vitrine of figures: a cabinet base, the glass case with shelves and small figures,
// and a cap with a light strip.
function vitrine(x, y, w = 5, d = 2.8, seed = 0) {
  const out = [];
  const plan = { x, y, w, d, r: 0 };
  const xf = x + w;
  const yf = y + d;
  out.push(halo(k.insetPlan(plan, -0.8), FLOOR, 0.1, 1));
  out.push(wood(slab(plan, FLOOR, 3, { tone: "hi", inner: L(faceLine("y", yf, x + w / 2, FLOOR + 0.4, x + w / 2, FLOOR + 2.6) + faceLine("x", xf, y + 0.3, FLOOR + 2.6, yf - 0.3, FLOOR + 2.6), { tone: "lo" }) }, 2)));
  const z0 = FLOOR + 3;
  const shelves = [z0 + 3.2, z0 + 6.4];
  const lines = [];
  for (const z of shelves) {
    lines.push(faceLine("y", yf, x + 0.3, z, xf - 0.3, z));
    lines.push(faceLine("x", xf, y + 0.3, z, yf - 0.3, z));
  }
  lines.push(faceLine("y", yf, x + w / 2, z0, x + w / 2, z0 + 9.4));
  out.push(glass(slab(plan, z0, 9.6, { tone: "hi", inner: L(lines.join(""), { tone: "lo" }) }, 2)));
  // figures standing on each shelf, seen through the front glass
  const figs = new Map();
  const add = (acc, d) => figs.set(acc, (figs.get(acc) ?? "") + d);
  [z0 + 0.15, ...shelves.map((z) => z + 0.15)].forEach((zb, row) => {
    for (let i = 0; i < 3; i++) {
      const u = x + 0.9 + i * ((w - 1.8) / 2) + (((row + i + seed) % 2) * 0.2 - 0.1);
      const tall = 1.5 + ((row * 2 + i + seed) % 3) * 0.35;
      const acc = CAPS[(row + i * 2 + seed) % CAPS.length];
      add(acc, facePoly("y", yf + 0.01, [[u - 0.32, zb], [u + 0.32, zb], [u + 0.26, zb + tall - 0.6], [u - 0.26, zb + tall - 0.6]]) + circ("y", yf + 0.01, u, zb + tall - 0.3, 0.32, 8));
    }
  });
  for (const [acc, d] of figs) out.push(acc(flat(d, "lo")));
  out.push(slab(k.insetPlan(plan, -0.2), z0 + 9.6, 0.9, { tone: "mid", inner: L(faceLine("y", yf + 0.2, x + 0.4, z0 + 10.05, xf - 0.4, z0 + 10.05), { tone: "faint" }) }, 2));
  return out.join("");
}

// A manga shelf against a shop front: a wooden case of three shelves full of spines.
function mangaShelf(x, y, w = 16, d = 2.6) {
  const out = [];
  const plan = { x, y, w, d, r: 0 };
  const yf = y + d;
  const xf = x + w;
  const zt = FLOOR + 10;
  out.push(halo(k.insetPlan(plan, -0.8), FLOOR, 0.1, 1));
  const bays = [FLOOR + 0.8, FLOOR + 3.9, FLOOR + 7];
  const lines = [];
  for (const z of [...bays, zt - 0.6]) lines.push(faceLine("y", yf, x + 0.5, z, xf - 0.5, z));
  for (const u of [x + 0.5, x + w / 2, xf - 0.5]) lines.push(faceLine("y", yf, u, FLOOR + 0.8, u, zt - 0.6));
  out.push(wood(slab(plan, FLOOR, 10, { tone: "hi", inner: L(lines.join(""), { tone: "lo" }) }, 2)));
  // spines, grouped by colour into one shape each
  const groups = new Map();
  const cols = [coral, amber, navy, cream, green, navy, coral, cream];
  bays.forEach((zb, row) => {
    let u = x + 0.6;
    let i = row * 3;
    while (u < xf - 1.3) {
      if (Math.abs(u - (x + w / 2)) < 0.4) { u += 0.5; continue; }
      const sw = 0.5 + ((i * 7) % 3) * 0.12;
      const sh = 2.1 + ((i * 5) % 4) * 0.18;
      const acc = cols[(i * 3 + row) % cols.length];
      const q = facePoly("y", yf + 0.01, [[u, zb + 0.05], [u + sw, zb + 0.05], [u + sw, zb + sh], [u, zb + sh]]);
      groups.set(acc, (groups.get(acc) ?? "") + q);
      u += sw + 0.04;
      i++;
    }
  });
  for (const [acc, d] of groups) out.push(acc(flat(d, "lo")));
  // a small price board on top
  out.push(amber(slab({ x: x + 1.2, y: y + 0.6, w: 5, d: 0.6, r: 0 }, zt, 2.2, { tone: "hi", inner: L(faceRect("y", y + 1.2, x + 1.6, x + 5.8, zt + 0.4, zt + 1.8), { tone: "lo" }) }, 2)));
  return out.join("");
}

// A low wagon table with stacks of books on it.
function bookWagon(x, y) {
  const out = [];
  const plan = { x, y, w: 9, d: 4.6, r: 0 };
  out.push(halo(k.insetPlan(plan, -1), FLOOR, 0.1, 2));
  const yf = y + plan.d;
  out.push(wood(slab(plan, FLOOR, 3.4, { tone: "hi", inner: L(faceRect("y", yf, x + 0.6, x + 8.4, FLOOR + 0.6, FLOOR + 2.6) + faceLine("y", yf, x + 4.5, FLOOR + 0.6, x + 4.5, FLOOR + 2.6), { tone: "lo" }) }, 2)));
  const zt = FLOOR + 3.4;
  const stacks = [[0.5, 0.5, 3, 1.8, coral], [3.9, 0.4, 2.4, 2.6, navy], [6.6, 0.6, 2, 1.4, amber], [0.6, 2.6, 3, 1.2, cream], [4.2, 2.6, 2.6, 2, green]];
  for (const [dx, dy, sw, sh, acc] of stacks) {
    const p = { x: x + dx, y: y + dy, w: sw, d: 1.6, r: 0 };
    const seams = [];
    for (let z = zt + 0.6; z < zt + sh - 0.3; z += 0.6) seams.push(faceLine("y", p.y + p.d, p.x + 0.15, z, p.x + p.w - 0.15, z));
    out.push(acc(slab(p, zt, sh, { tone: "hi", inner: L(seams.join(""), { tone: "lo" }) }, 2)));
  }
  return out.join("");
}

// A pile of boxed toys in front of a shop: each box with a window on its face.
function toyBoxes(x, y) {
  const out = [];
  out.push(halo({ x: x - 0.8, y: y - 0.8, w: 10, d: 5.4, r: 0.5 }, FLOOR, 0.1, 2));
  const boxes = [
    [0, 0, 4, 3.4, 0, 4.2, amber],
    [4.2, 0, 3.6, 3.4, 0, 3.2, navy],
    [4.4, 0.2, 3.2, 3, 3.2, 2.6, coral],
    [0.3, 0.2, 3.4, 3, 4.2, 2.4, green],
    [0.8, 0.4, 2.4, 2.4, 6.6, 1.8, cream],
  ];
  for (const [dx, dy, w, d, dz, h, acc] of boxes) {
    const p = { x: x + dx, y: y + dy, w, d, r: 0 };
    const z = FLOOR + dz;
    const win = faceRect("y", p.y + d, p.x + w * 0.22, p.x + w * 0.78, z + h * 0.22, z + h * 0.8);
    out.push(acc(slab(p, z, h, { tone: "hi", inner: L(win, { tone: "lo" }) }, 2)));
  }
  return out.join("");
}

// A drinks vending machine: a coloured cabinet, the display of bottles and the take-out slot.
function vending(x, y) {
  const out = [];
  const plan = { x, y, w: 5, d: 3.4, r: 0.2 };
  const yf = y + plan.d;
  out.push(halo(k.insetPlan(plan, -0.8), FLOOR, 0.1, 1));
  const marks = [faceRect("y", yf, x + 0.5, x + 4.5, FLOOR + 6, FLOOR + 11), faceRect("y", yf, x + 0.8, x + 4.2, FLOOR + 0.8, FLOOR + 2), faceRect("y", yf, x + 3.4, x + 4.3, FLOOR + 3.2, FLOOR + 5)];
  for (const z of [FLOOR + 7.6, FLOOR + 9.3]) marks.push(faceLine("y", yf, x + 0.5, z, x + 4.5, z));
  out.push(coral(slab(plan, FLOOR, 12, { tone: "hi", inner: L(marks.join(""), { tone: "lo" }) }, 3, 0.2)));
  const bottles = [];
  for (const zb of [FLOOR + 6.3, FLOOR + 8, FLOOR + 9.7]) for (let i = 0; i < 6; i++) {
    const u = x + 0.9 + i * 0.64;
    bottles.push(facePoly("y", yf + 0.01, [[u - 0.2, zb], [u + 0.2, zb], [u + 0.2, zb + 0.9], [u, zb + 1.2], [u - 0.2, zb + 0.9]]));
  }
  out.push(cream(flat(bottles.join(""), "lo")));
  return out.join("");
}

// ---------- the shop row along the arcade ----------
function shopBuilding(s, i) {
  const next = SHOPS[i + 1];
  const out = [];
  const plan = { x: s.x0, y: -20, w: s.x1 - s.x0, d: ROW_Y + 20, r: 0 };
  const xf = s.x1;
  out.push(halo(k.insetPlan(plan, -3), 0, 0.1, 3));
  // ground floor: the shop front, glazed with mullions and a door
  const g = [];
  for (let u = s.x0 + 3; u < s.x1 - 1; u += 3.6) g.push(faceLine("y", ROW_Y, u, 0, u, 12));
  if (!next) for (let u = plan.y + 4; u < ROW_Y - 1; u += 5) g.push(faceLine("x", xf, u, 0, u, 12));
  g.push(k.sideSeam(plan, 8.6, P, 2));
  out.push(glass(slab(plan, 0, 12, { tone: "mid", inner: L(g.join(""), { tone: "lo" }) }, 2)));
  out.push(block(plan, 12, s.h, { from: 19.5, xFrom: next ? next.h : -Infinity }));
  out.push(slab(k.insetPlan(plan, -0.5), s.h, 1.3, { tone: "mid" }, 2, 0.3));
  return out.join("");
}

// What a shop puts on its front: the fascia sign under the arcade roof, a blade sign hanging
// into the street, a sign above the roof, and plant on the roof.
function shopDress(s, i) {
  const out = [];
  const w = s.x1 - s.x0;
  out.push(signBox({ x: s.x0 + 1.4, y: ROW_Y, w: w - 2.8, d: 0.9, r: 0 }, 12.6, 3.8, s.sign, { lit: i % 2 === 0 }));
  // the blade sign on a bracket
  const bx = s.x1 - 3.2;
  out.push(roof(box(bx - 0.3, ROW_Y, 0.6, 5.4, 23.6, 0.6, { tone: "hi" })));
  out.push(signBox({ x: bx - 0.45, y: ROW_Y + 0.8, w: 0.9, d: 4.4, r: 0 }, 15.2, 8.2, s.blade, { lit: true, cls: s.flicker ? "flicker" : "" }));
  // above the arcade roof: a sign panel on the upper floors
  if (s.h > 36) out.push(signBox({ x: s.x0 + 3, y: ROW_Y, w: w - 6, d: 0.9, r: 0 }, s.h - 9.5, 5.2, i % 2 ? coral : amber));
  // roof: an AC unit or a water tank
  const top = s.h + 1.3;
  if (i % 2 === 0) {
    const u = { x: s.x0 + 4, y: 10, w: 6, d: 4.4, r: 0 };
    out.push(box(u.x, u.y, u.w, u.d, top, 3.2, { tone: "mid", inner: L(k.sideSeam(u, top + 1.6, P, 2), { tone: "faint" }) }));
  } else {
    const cx = s.x0 + w / 2;
    out.push(cyl(cx, 8, 3, top, 5.2, { tone: "mid", inner: L(k.sideArc(cx, 8, 3, top + 2.6, P, 20), { tone: "faint" }) }, 20, 0.3));
  }
  return out.join("");
}

// The lower buildings behind the shop row, across a narrow back alley.
const BACK = [{ x0: -16, x1: 22, h: 30 }, { x0: 22, x1: 48, h: 22 }, { x0: 48, x1: 74.5, h: 28 }];
function backRow() {
  const out = [];
  BACK.forEach((b, i) => {
    const plan = { x: b.x0, y: -58, w: b.x1 - b.x0, d: 35.5, r: 0 };
    const next = BACK[i + 1];
    out.push(halo(k.insetPlan(plan, -2), 0, 0.1, 3));
    out.push(block(plan, 0, b.h, { from: 7.5, xFrom: next ? next.h : -Infinity }));
    out.push(slab(k.insetPlan(plan, -0.5), b.h, 1.2, { tone: "mid" }, 2, 0.3));
    const u = { x: b.x0 + 5, y: -50, w: 7, d: 5, r: 0 };
    if (i === 1) out.push(box(u.x, u.y, u.w, u.d, b.h + 1.2, 3, { tone: "mid", inner: L(k.sideSeam(u, b.h + 2.7, P, 2), { tone: "faint" }) }));
  });
  return out.join("");
}

// The corner shop's vertical sign stack on its +x face, at the front edge of the plinth.
function cornerStack() {
  const out = [];
  const xf = ARC_X1;
  out.push(roof(box(xf, 22.6, 0.8, 0.8, 15, 18, { tone: "hi" })));
  const cols = [coral, amber, navy, coral];
  for (let i = 0; i < 3; i++) out.push(signBox({ x: xf, y: 20.6, w: 2.4, d: 4.8, r: 0 }, 16 + i * 5.4, 4.8, cols[i], { lit: i % 2 === 1 }));
  return out.join("");
}

// ---------- Nakano Broadway ----------
function broadway() {
  const out = [];
  const front = BW_FRONT;
  out.push(halo(k.insetPlan(BW, -4), 0, 0.1, 3));
  const back = { x: BW.x, y: BW.y, w: DOOR.back - BW.x, d: BW.d, r: 0 };
  const left = { x: DOOR.back, y: BW.y, w: front - DOOR.back, d: DOOR.y0 - BW.y, r: 0 };
  const pier = { x: DOOR.back, y: DOOR.y1, w: front - DOOR.back, d: BW.y + BW.d - DOOR.y1, r: 0 };
  const yf = BW.y + BW.d;
  // the near (+y) face: shop windows on the ground floor, two floors of windows above
  const facade = (plan) => {
    const lines = [11, 21.5, 32, 42.5].map((z) => k.sideSeam(plan, z, P, 2));
    const marks = [];
    for (let u = plan.x + 2.5; u < plan.x + plan.w - 2; u += 6) {
      for (const [z0, z1] of [[2, 9], [13.4, 19.4], [23.9, 29.9], [34.4, 40.4], [44.9, 48.4]]) marks.push(faceRect("y", yf, u, Math.min(u + 4.4, plan.x + plan.w - 1.5), z0, z1));
    }
    return { inner: L(lines.join(""), { tone: "faint" }) + L(marks.join(""), { tone: "lo" }) };
  };
  // the back of the entrance hall: two lit shop fronts with their small signs
  const hall = [];
  for (const [y0, y1] of [[DOOR.y0 + 2, 46.5], [49.5, DOOR.y1 - 2]]) {
    hall.push(faceRect("x", DOOR.back, y0, y1, FLOOR, 8.4));
    for (let u = y0 + 3; u < y1 - 1; u += 3.2) hall.push(faceLine("x", DOOR.back, u, FLOOR, u, 8.4));
  }
  const backInner = facade(back).inner + L(hall.join(""), { tone: "lo" });
  out.push(stone(slab(back, 0, BW_H, { tone: "mid", inner: backInner }, 2)));
  out.push(glass(`<path d="${facePoly("x", DOOR.back + 0.01, [[DOOR.y0 + 2, FLOOR], [46.5, FLOOR], [46.5, 8.4], [DOOR.y0 + 2, 8.4]])}${facePoly("x", DOOR.back + 0.01, [[49.5, FLOOR], [DOOR.y1 - 2, FLOOR], [DOOR.y1 - 2, 8.4], [49.5, 8.4]])}" style="fill:var(--anatomy-lit-top);stroke:none;opacity:.55"/>`));
  out.push(signBox({ x: DOOR.back, y: DOOR.y0 + 3, w: 0.7, d: 10, r: 0 }, 9, 2.6, amber, { inset: 0.5 }));
  out.push(signBox({ x: DOOR.back, y: 51, w: 0.7, d: 10, r: 0 }, 9, 2.6, coral, { inset: 0.5 }));
  // the left wall of the hall (the +y face of the left block), with windows above the shops
  const leftMarks = [faceRect("y", DOOR.y0, DOOR.back + 1.5, front - 1.5, 14, 19)];
  for (const [z0, z1] of [[34.4, 40.4], [44.9, 48.4]]) for (let u = left.y + 2; u < left.y + left.d - 4; u += 7) leftMarks.push(faceRect("x", front, u, u + 5, z0, z1));
  out.push(stone(slab(left, 0, BW_H, { tone: "mid", inner: L(k.sideSeam(left, 42.5, P, 2), { tone: "faint" }) + L(leftMarks.join(""), { tone: "lo" }) }, 2)));
  // the hall floor
  out.push(tile(slab({ x: DOOR.back, y: DOOR.y0, w: front - DOOR.back, d: DOOR.y1 - DOOR.y0, r: 0 }, 0, FLOOR, { tone: "mid", inner: L([40, 48, 56].map((y) => pathOf([at([DOOR.back, y, FLOOR]), at([front, y, FLOOR])])).join(""), { tone: "faint" }) }, 2)));
  out.push(stone(slab(pier, 0, BW_H, { tone: "mid", ...facade(pier) }, 2)));
  // the lintel over the entrance
  const lintel = { x: DOOR.back, y: DOOR.y0, w: front - DOOR.back, d: DOOR.y1 - DOOR.y0, r: 0 };
  // over the entrance: the first-floor shop windows under the arcade roof, a band above them
  const over = [faceLine("x", front, DOOR.y0, DOOR.z + 0.9, DOOR.y1, DOOR.z + 0.9), faceRect("x", front, DOOR.y0 + 1.5, DOOR.y1 - 1.5, 24, 33)];
  for (let u = DOOR.y0 + 5.5; u < DOOR.y1 - 2; u += 4) over.push(faceLine("x", front, u, 24, u, 33));
  out.push(stone(slab(lintel, DOOR.z, BW_H - DOOR.z, { tone: "mid", inner: L(over.join(""), { tone: "lo" }) }, 2)));
  // the parapet cap over the whole podium
  out.push(stone(slab(k.insetPlan(BW, -0.6), BW_H, 1.4, { tone: "mid" }, 2, 0.3)));
  // pilasters on the near face, one hiding the joint between the blocks
  for (const x of [-56, -46, DOOR.back - 1, -26]) out.push(stone(box(x, yf, 2, 0.8, 0, BW_H, { tone: "mid" })));
  return out.join("");
}

// The residential tower above the podium, with its balconies and roof plant.
const TW = { x: -60, y: -24, w: 28, d: 62, r: 0 };
const TW_Z = BW_H + 1.4;
const TW_TOP = 80;
function tower() {
  const out = [];
  const xf = TW.x + TW.w;
  const yf = TW.y + TW.d;
  const lines = [];
  const marks = [];
  for (let z = TW_Z + 5; z < TW_TOP - 2; z += 6.2) {
    lines.push(k.sideSeam(TW, z, P, 2));
    // a balcony band per floor on each near face, split into flats
    marks.push(faceRect("x", xf, TW.y + 2, yf - 2, z + 1.4, z + 4.8), faceRect("y", yf, TW.x + 2, xf - 2, z + 1.4, z + 4.8));
    for (let u = TW.y + 2 + 12; u < yf - 4; u += 12) marks.push(faceLine("x", xf, u, z + 1.4, u, z + 4.8));
    for (let u = TW.x + 2 + 8; u < xf - 4; u += 8) marks.push(faceLine("y", yf, u, z + 1.4, u, z + 4.8));
  }
  out.push(slab(TW, TW_Z, TW_TOP - TW_Z, { tone: "mid", inner: L(lines.join(""), { tone: "faint" }) + L(marks.join(""), { tone: "lo" }) }, 2));
  out.push(slab(k.insetPlan(TW, -0.5), TW_TOP, 1.4, { tone: "mid" }, 2, 0.3));
  const top = TW_TOP + 1.4;
  const room = { x: TW.x + 5, y: TW.y + 26, w: 11, d: 14, r: 0 };
  out.push(box(room.x, room.y, room.w, room.d, top, 5, { tone: "mid", inner: L(k.sideSeam(room, top + 2.5, P, 2), { tone: "faint" }) }));
  out.push(cyl(TW.x + 22, TW.y + 14, 3.4, top, 5.6, { tone: "mid", inner: L(k.sideArc(TW.x + 22, TW.y + 14, 3.4, top + 2.8, P, 20), { tone: "faint" }) }, 20, 0.3));
  return out.join("");
}

// The big sign over the entrance: a navy box on the lintel with the name in cream.
function broadwaySign() {
  const out = [];
  const plan = { x: BW_FRONT, y: 30.8, w: 1.4, d: 37, r: 0 };
  const z0 = 40;
  const h = 7.6;
  out.push(navy(slab(plan, z0, h, { tone: "hi", inner: L(faceRect("x", plan.x + plan.w, plan.y + 0.6, plan.y + plan.d - 0.6, z0 + 0.6, z0 + h - 0.6), { tone: "lo" }) }, 2)));
  const em = 3.7;
  const text = "中野ブロードウェイ";
  const width = (text.length * em);
  const yc = plan.y + plan.d / 2;
  const t = faceText(text, [plan.x + plan.w + 0.02, yc + width / 2, z0 + h / 2 - 0.4 * em], [0, -1, 0], em);
  out.push(cream(t.svg));
  // brackets holding the box off the wall
  for (const y of [plan.y + 3, plan.y + plan.d - 3]) out.push(roof(box(BW_FRONT, y - 0.3, 0.6, 0.6, z0 + h, 1.2, { tone: "hi" })));
  return out.join("");
}

// ---------- the arcade roof ----------
const SPRING = 27.8; // where the ribs meet the plates
const RISE = 10;
const SPAN = POST_Y - ROW_Y;
const R = ((SPAN * SPAN) / 4 + RISE * RISE) / (2 * RISE);
const YC = (ROW_Y + POST_Y) / 2;
const ZC = SPRING + RISE - R;
const ALPHA = Math.asin(SPAN / 2 / R);
const arcPt = (phi, r) => [YC + r * Math.sin(phi), ZC + r * Math.cos(phi)];

// A curved rib of rectangular section between radii rIn and rOut, x0..x1.
function archRib(x0, x1, rIn, rOut, n = 8) {
  const phis = Array.from({ length: n + 1 }, (_, i) => -ALPHA + (2 * ALPHA * i) / n);
  const O = phis.map((p) => arcPt(p, rOut));
  const I = phis.map((p) => arcPt(p, rIn));
  const v = (x, [y, z]) => [x, y, z];
  const faces = [];
  faces.push({ pts: [...O.map((q) => v(x0, q)), ...[...I].reverse().map((q) => v(x0, q))], hint: [-1, 0, 0] });
  faces.push({ pts: [...O.map((q) => v(x1, q)), ...[...I].reverse().map((q) => v(x1, q))], hint: [1, 0, 0] });
  for (let i = 0; i < n; i++) {
    const pm = (phis[i] + phis[i + 1]) / 2;
    const out = [0, Math.sin(pm), Math.cos(pm)];
    faces.push({ pts: [v(x0, O[i]), v(x1, O[i]), v(x1, O[i + 1]), v(x0, O[i + 1])], hint: out });
    faces.push({ pts: [v(x0, I[i]), v(x1, I[i]), v(x1, I[i + 1]), v(x0, I[i + 1])], hint: G.mul3(out, -1) });
  }
  const e0 = phis[0];
  const e1 = phis[n];
  faces.push({ pts: [v(x0, O[0]), v(x1, O[0]), v(x1, I[0]), v(x0, I[0])], hint: [0, -Math.cos(e0), Math.sin(e0)] });
  faces.push({ pts: [v(x0, O[n]), v(x1, O[n]), v(x1, I[n]), v(x0, I[n])], hint: [0, Math.cos(e1), -Math.sin(e1)] });
  return polySolid(faces);
}

const RIBS = [-14, 0.5, 15, 29.5, 44, 58.5, 72.8];
const RIB_T = 1;
const RIB_D = 1.3;

// A banner hanging from the side of a rib.
function banner(xr, y, acc) {
  const zTop = arcPt(Math.asin((y - YC) / (R - RIB_D)), R - RIB_D)[1] - 0.6;
  const plan = { x: xr + RIB_T, y: y - 2.2, w: 0.4, d: 4.4, r: 0 };
  const out = [];
  out.push(acc(slab(plan, zTop - 7.4, 7.4, { tone: "hi", inner: L(faceRect("x", plan.x + plan.w, plan.y + 0.6, plan.y + plan.d - 0.6, zTop - 6.6, zTop - 0.8) + faceLine("x", plan.x + plan.w, y, zTop - 7.4, y, zTop - 8.4), { tone: "lo" }) }, 2)));
  return out.join("");
}

function arcadeRoof() {
  const out = [];
  // the plates the ribs sit on: one along the shop fronts, the eaves beam on the columns
  out.push(box(ARC_X0, ROW_Y, ARC_X1 - ARC_X0, 1.4, SPRING - 2, 1.3, { tone: "hi" }));
  out.push(box(ARC_X0, POST_Y - 0.8, ARC_X1 - ARC_X0, 1.6, SPRING - 2, 1.3, { tone: "hi" }));
  // ribs, with banners hanging from some of them, painted far to near
  const items = RIBS.map((x) => ({ x, svg: count(S(archRib(x, x + RIB_T, R - RIB_D, R), { tone: "hi" })) }));
  for (const [x, y, acc] of [[15, 41, coral], [29.5, 56, amber], [44, 41, navy], [58.5, 56, coral]]) items.push({ x: x + 0.5, svg: banner(x, y, acc) });
  out.push(...[...items].sort((p, q) => p.x - q.x).map((i) => i.svg));
  // the ridge with its skylight
  const ridge = { x: ARC_X0, y: YC - 2, w: ARC_X1 - ARC_X0, d: 4, r: 0 };
  const panes = [];
  for (let x = ARC_X0 + 4; x < ARC_X1 - 1; x += 4.5) panes.push(pathOf([at([x, YC - 2, SPRING + RISE + 1.2]), at([x, YC + 2, SPRING + RISE + 1.2])]));
  out.push(glass(slab(ridge, SPRING + RISE - 0.1, 1.3, { tone: "hi", inner: L(panes.join(""), { tone: "lo" }) }, 2)));
  // the arcade's name arch at the street end: an amber band with small lamps
  const xg = RIBS[RIBS.length - 1] + RIB_T;
  out.push(amber(count(S(archRib(xg, xg + 0.7, R - RIB_D, R + 3.2, 12), { tone: "hi" }))));
  const lamps = [];
  for (let i = 1; i < 12; i++) {
    const [y, z] = arcPt(-ALPHA * 0.92 + (2 * ALPHA * 0.92 * i) / 12, R + 1);
    lamps.push(at([xg + 0.72, y, z]));
  }
  out.push(k.dotsSvg(lamps, { size: 0.55, tone: "hi" }));
  return out.join("");
}

// ---------- assemble ----------
const posts = RIBS.map((x) => {
  const cx = x + RIB_T / 2;
  return { at: [cx, POST_Y, 0], svg: box(cx - 0.6, POST_Y - 0.6, 1.2, 1.2, FLOOR, SPRING - 2 - FLOOR, { tone: "hi", inner: L(k.sideSeam({ x: cx - 0.6, y: POST_Y - 0.6, w: 1.2, d: 1.2, r: 0 }, FLOOR + 1.2, P, 2), { tone: "lo" }) }) };
});

const street = [
  { at: [-6.5, 31, 0], svg: vitrine(-9, 31.2, 5, 2.8, 1) },
  { at: [8.5, 31.5, 0], svg: toyBoxes(5, 31.2) },
  { at: [16.5, 31, 0], svg: vending(14, 31) },
  { at: [30, 31, 0], svg: mangaShelf(22, 30.6) },
  { at: [30, 38, 0], svg: bookWagon(25.5, 36.4) },
  { at: [44.5, 31, 0], svg: vitrine(42, 31.2, 5, 2.8, 2) },
  { at: [50.5, 31, 0], svg: vitrine(48, 31.2, 5, 2.8, 0) },
  // the row of capsule machines in front of the corner shop, where the street opens up
  ...[0, 1, 2].map((i) => ({ at: [59.8 + i * 3.9 + 1.7, 31, 0], svg: gachaStack(59.8 + i * 3.9, 31, i, { spin: i === 1 }) })),
  ...[[4, 50, "coral"], [36, 57, "amber"], [52, 44, "roof"], [66, 55, "navy"]].map(([x, y, c]) => ({ at: [x, y, 0], svg: person(x, y, c) })),
  ...posts,
];

if (process.argv.includes("--sizes")) {
  const kb = (s) => `${(minify(s).length / 1024).toFixed(1)} KB`;
  console.log("broadway", kb(broadway()), "tower", kb(tower()), "sign", kb(broadwaySign()), "shops", kb(SHOPS.map((s, i) => shopBuilding(s, i)).join("")), "dress", kb(SHOPS.map((s, i) => shopDress(s, i)).join("")), "roof", kb(arcadeRoof()), "ground", kb(ground()));
  for (const it of street) console.log(" ", it.at.join(","), kb(it.svg));
}

const body = minify([
  K.plinth(),
  ground(),
  broadway(),
  tower(),
  broadwaySign(),
  backRow(),
  ...SHOPS.map((s, i) => shopBuilding(s, i)),
  ...SHOPS.map((s, i) => shopDress(s, i)),
  cornerStack(),
  ...byDepth(street, (i) => i.at).map((i) => i.svg),
  arcadeRoof(),
].join(""))
  // the flickering blade sign
  .replace(/<path d="([^"]+)" style="fill:var\(--anatomy-lit-top\);stroke:none" class="flicker"\/>/g, (_, d) => a.amBlink(`<path d="${d}" style="fill:var(--anatomy-lit-top);stroke:none"/>`, { period: 3600, delay: 900, min: 0.3 }));

const LABEL = "Nakano Broadway in isometric view: the covered Sun Mall arcade with its arched roof leads into the Nakano Broadway building and its sign; figure vitrines, a row of capsule-toy machines, a manga shelf, a book wagon, toy boxes and a vending machine line the shop fronts, and a few shoppers walk through.";
const SUBJECT = "Entrada de Nakano Broadway con tiendas de figuras y máquinas de gachapon";
const DOC = [
  "Nakano Broadway isométrico — jueves 27 de mayo (Kiyosumi/Fukagawa → Nakano).",
  "",
  "La galería cubierta Sun Mall (bóveda de costillas de acero sobre columnas finas, abierta por",
  "delante para que se vea la calle) desemboca en el edificio Nakano Broadway: zócalo de piedra con",
  "la entrada y el rótulo «中野ブロードウェイ» (contornos de Zen Kaku Gothic New, sin <text>) y la",
  "torre de viviendas encima. Delante de las tiendas: vitrinas de figuras, una fila de máquinas",
  "gachapon, una estantería de manga, un carrito de libros, cajas de juguetes y una máquina de",
  "bebidas; al fondo de la entrada, escaparates iluminados. Rótulos sin marcas ni logos. Se mueven (solo CSS,",
  "transform/opacity) la manivela de una máquina gachapon, que gira despacio, y un rótulo de",
  "banderola que parpadea; ambas se detienen con prefers-reduced-motion.",
];

// The scene's own two rules: flat shapes on faces (`f`) and the capsule-machine handles (`h`).
const OWN_CSS = (scope) => [`${scope} .${PRE}f{fill:var(--anatomy-top)}`, `${scope} .${PRE}h{fill:var(--anatomy-top);stroke:var(--anatomy-hi);stroke-width:var(--anatomy-weight)}`].map((r) => r.trim()).join("\n");

// ---------- output (as lib-09-26's emit, named for the scene instead of a day) ----------
mkdirSync(OUT, { recursive: true });
for (const theme of ["light", "dark"]) {
  const name = `${NAME}-${theme}`;
  const svg = a.assetSvg({ width: W, height: H, label: LABEL, body, paper: SITE[theme].paper, theme, accents: accentsFor(theme), weight: WEIGHT, id: name, css: OWN_CSS("") });
  writeFileSync(join(HERE, `${name}.svg`), svg);
  writeFileSync(join(HERE, `${name}.html`), a.previewHtml({ title: name, svg, paper: SITE[theme].paper, width: W * 2 }));
  console.log(`wrote ${name}.svg (${(svg.length / 1024).toFixed(0)} KB)`);
}
console.log(`solids: ${K.counter.n}`);

const drawing = k.ISO_CSS.split("\n").filter((line) => /^\.(iso-svg|iso-fill|iso-solid|iso-shade|iso-top|iso-halo|iso-line|iso-dots|tb-)/.test(line));
const scoped = drawing.map((line) => line.replace(/^([^{]+)\{/, (_, sel) => `${sel.split(",").map((s) => `${SCOPE} ${s.trim().replace(/^\.iso-svg /, "")}`).join(",")}{`)).join("\n");
const tokens = (theme) => {
  const g = a.groundTokens(SITE[theme].paper, { theme });
  delete g.card; delete g.page;
  g.paper = "var(--paper)";
  const extra = theme === "light" ? { lit: "#000000", "halo-opacity": ".32" } : { lit: "#ffffff", "halo-opacity": ".9" };
  return Object.entries({ ...g, ...extra, weight: `${WEIGHT}px` }).map(([n, v]) => `--anatomy-${n}:${v}`).join(";");
};
const MOTION = {
  blink: { kf: "{0%,100%{opacity:var(--am-min,.15)}8%,30%{opacity:1}}", rule: "animation:K var(--am-period,2.4s) linear var(--am-delay,0s) infinite" },
  spin: { kf: "{to{transform:rotate(360deg)}}", rule: "transform-box:view-box;transform-origin:0 0;animation:K var(--am-period,1.6s) linear var(--am-delay,0s) infinite var(--am-dir,normal)" },
};
const used = Object.keys(MOTION).filter((m) => body.includes(`class="am-${m}"`));
const css = [
  `${SCOPE}{${tokens("light")}}`,
  `[data-theme="dark"] ${SCOPE}{${tokens("dark")}}`,
  a.accentCss(accentsFor("light"), { scope: SCOPE, theme: "light" }),
  a.accentCss(accentsFor("dark"), { scope: `[data-theme="dark"] ${SCOPE}`, theme: "dark" }),
  scoped,
  OWN_CSS(SCOPE),
  ...used.flatMap((m) => [`@keyframes ${PRE}${m}${MOTION[m].kf}`, `${SCOPE} .${PRE}${m}{${MOTION[m].rule.replace("K", PRE + m)}}`]),
  used.length ? `@media (prefers-reduced-motion:reduce){${used.map((m) => `${SCOPE} .${PRE}${m}`).join(",")}{animation:none}}` : "",
].filter(Boolean).join("\n").replace(/--am-/g, `--${PRE}`);
// Every id gets the scene prefix, and every reference follows.
const ids = new Set([...body.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
const fix = (id) => (ids.has(id) && !id.startsWith(PRE) ? PRE + id : id);
const art = body
  .replace(/class="am-(blink|spin)"/g, (_, m) => `class="${PRE}${m}"`)
  .replace(/--am-/g, `--${PRE}`)
  .replace(/\bid="([^"]+)"/g, (_, id) => `id="${fix(id)}"`)
  .replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${fix(id)})`)
  .replace(/href="#([^"]+)"/g, (_, id) => `href="#${fix(id)}"`);
const markup = `<style>${css}</style><g data-art="">${art}</g>`;
if (/(?<![\w-])am-/.test(markup)) throw new Error("kit motion names leaked into the TS markup");
const ts = `/**
${DOC.map((l) => ` *${l ? ` ${l}` : ""}`).join("\n")}
 *
 * Marcado SVG generado (no editar a mano) con el kit de la skill anatomy-asset
 * (iso/${NAME}/build.mjs en tools/art). Estilos acotados a \`${SCOPE}\`, animaciones e ids con
 * prefijo \`${PRE}\`, para que todos los dibujos convivan en una página.
 * Los colores salen de los tokens de src/styles/index.css (--paper en vivo; las rampas de tono se
 * derivan de los hex de la paleta al generar): si cambia la paleta, hay que regenerar este fichero.
 */
export const NAKANO_ISO_VIEWBOX = '0 0 ${W} ${H}'

export const NAKANO_ISO_SUBJECT = '${SUBJECT}'

export const NAKANO_ISO_MARKUP = ${JSON.stringify(markup)}
`;
writeFileSync(join(OUT, `${NAME}Iso.markup.ts`), ts);
console.log(`wrote ${NAME}Iso.markup.ts (${(ts.length / 1024).toFixed(0)} KB)`);
