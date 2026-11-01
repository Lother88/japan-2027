// Day 14 — Kanazawa, Higashi Chaya: two-storey teahouses (chaya) as an isometric diorama,
// matching the day-21 pilot. A stone plinth; at the back two chaya share a wall, their ground
// floors screened by fine kimusuko lattice in bengara red, a tiled pent roof (hisashi) over
// it, the tall upper storey with lattice windows, and grey kawara gable roofs. In front, a
// stone-paved street and a small canal with a stone embankment and a weeping willow. A paper
// lantern (chōchin) hangs by a door and its glow breathes (CSS only, stopped under
// prefers-reduced-motion).
//
//   node build.mjs  → day14-light.svg/.html, day14-dark.svg/.html, ../out/day14Iso.markup.ts

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { a, G, k, SITE, mix, toolkit, minify, emit, clippedPlan, W, H } from "../lib-d13-29/common.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

function accentsFor(theme) {
  const s = SITE[theme];
  return {
    bengara: mix(s.coral, s.brown, 0.45),
    plaster: theme === "light" ? s.paper : s.ink,
    tile: theme === "light" ? mix(mix(s.ink, s.brown, 0.35), s.paper, 0.22) : mix(mix(s.ink, s.brown, 0.3), s.paper, 0.5),
    wood: s.brown,
    pine: s.green,
    water: mix(s.green, s.paper, theme === "light" ? 0.62 : 0.5),
    moss: mix(s.green, s.paper, theme === "light" ? 0.4 : 0.25),
    lamp: s.coral2,
    ripple: { hex: s.green, mode: "ink" },
  };
}

// ---------- world ----------
const PLINTH = { x: -70, y: -60, w: 140, d: 98, r: 8 };
const STREET_Z = 3;
const HOUSE_Y0 = -54;
const HOUSE_Y1 = -25; // front (+y) face of the houses
const CANAL = { y0: 10, y1: 26 };
const WATER_Z = 0.5;

const HOUSES = [
  { x0: -64, x1: -2, z1: 15, z2: 32, rise: 7, door: -44 },
  { x0: -2, x1: 62, z1: 16, z2: 34, rise: 7.5, door: 36 },
];

const fitPoints = [...k.boxCorners(PLINTH, -10, 4), [-64, -55, 44], [62, -25, 46], [52, 2, 36]];
const P = a.fitInto(fitPoints, { x: 0, y: 0, w: W, h: H }, { pad: 6, azimuth: 40 });
const T = toolkit(P);
const { at, S, L, ac, byDepth, pathOf, count, slab, cyl, stone, faceLine, faceRect, gableRoof, loft } = T;
const beng = ac("bengara");
const plaster = ac("plaster");
const tile = ac("tile");
const wood = ac("wood");
const pine = ac("pine");
const water = ac("water");
const moss = ac("moss");
const lamp = ac("lamp");
const ripple = ac("ripple");

// ---------- ground: plinth, street, canal ----------
function ground() {
  const out = [];
  // Canal water at the bottom, the land on both banks above it.
  out.push(water(slab({ x: PLINTH.x + 3.5, y: CANAL.y0, w: PLINTH.w - 7, d: CANAL.y1 - CANAL.y0, r: 0 }, 0, WATER_Z, { tone: "lo", crease: "none" }, 2)));
  // Back bank: the paved street level (houses stand on it).
  const pav = [];
  // Ishidatami: courses of granite setts across the street, joints staggered.
  const ys = [-20, -14, -8, -2, 4];
  for (const y of ys) pav.push(pathOf([at([PLINTH.x + 0.5, y, STREET_Z]), at([PLINTH.x + PLINTH.w - 0.5, y, STREET_Z])]));
  for (let r = 0; r < ys.length - 1; r++) {
    for (let x = PLINTH.x + 6 + (r % 2) * 5; x < PLINTH.x + PLINTH.w - 3; x += 10) pav.push(pathOf([at([x, ys[r], STREET_Z]), at([x, ys[r + 1], STREET_Z])]));
  }
  // The street is a slab with square front corners where the canal wall drops.
  out.push(count(S(k.extrude(clippedPlan(PLINTH, { yMax: CANAL.y0 }), 0, STREET_Z, P, { convex: true }), { tone: "mid", inner: L(pav.join(""), { tone: "faint" }) })));
  // Front bank: a strip of moss with a stone kerb.
  out.push(moss(count(S(k.extrude(clippedPlan(PLINTH, { yMin: CANAL.y1 }), 0, STREET_Z - 0.6, P, { convex: true }), { tone: "mid" }))));
  return out.join("");
}

function canalDetail() {
  const out = [];
  // Embankment: dressed stone courses on the street side of the canal (the face we see).
  const wall = [];
  for (const z of [1.2, 2.1]) wall.push(pathOf([at([PLINTH.x + 3.5, CANAL.y0, z]), at([PLINTH.x + PLINTH.w - 3.5, CANAL.y0, z])]));
  // Ripples along the flow (along x), fading at both ends, clipped to the water.
  const rows = [[14, -50, -30], [21, -20, 2], [15, 14, 34], [21, 40, 58]];
  const strokes = rows.map(([y, x0, x1]) => k.fadeLineSvg([at([x0, y, WATER_Z]), at([x1, y, WATER_Z])], { fade: [5, 5], tone: "mid" })).join("");
  const clip = pathOf([[PLINTH.x + 3.5, CANAL.y0], [PLINTH.x + PLINTH.w - 3.5, CANAL.y0], [PLINTH.x + PLINTH.w - 3.5, CANAL.y1], [PLINTH.x + 3.5, CANAL.y1]].map(([x, y]) => at([x, y, WATER_Z])), true);
  out.push(`<clipPath id="d14-canal"><path d="${clip}"/></clipPath><g clip-path="url(#d14-canal)">${a.amPulse(ripple(strokes), { period: 5600, delay: 900, min: 0.3 })}</g>`);
  return out.join("") + (wall.length ? "" : "");
}

// ---------- the chaya ----------
function house(h) {
  const out = [];
  const plan = { x: h.x0, y: HOUSE_Y0, w: h.x1 - h.x0, d: HOUSE_Y1 - HOUSE_Y0, r: 0 };
  const yf = HOUSE_Y1;
  const xf = h.x1;
  const z0 = STREET_Z;
  // Stone footing.
  out.push(slab({ ...plan, y: plan.y, d: plan.d + 0.8 }, z0, 0.9, { tone: "mid" }, 2, 0.2));
  const zb = z0 + 0.9;
  // Ground storey: kimusuko lattice (very fine slats) across the facade, framed by posts.
  const posts = [h.x0 + 1, h.door - 4, h.door + 4, h.x1 - 1];
  const lat = [];
  const zTop = h.z1 - 1.6;
  const bays = [[posts[0] + 1, posts[1] - 1], [posts[2] + 1, posts[3] - 1]];
  for (const [u0, u1] of bays) {
    lat.push(faceRect("y", yf, u0, u1, zb + 0.8, zTop));
    for (let u = u0 + 0.75; u < u1 - 0.3; u += 0.75) lat.push(faceLine("y", yf, u, zb + 0.8, u, zTop));
  }
  // The doorway: a sliding door of four panes between the middle posts.
  const d0 = posts[1] + 1;
  const d1 = posts[2] - 1;
  const door = [faceRect("y", yf, d0, d1, zb, zTop), faceLine("y", yf, (d0 + d1) / 2, zb, (d0 + d1) / 2, zTop)];
  for (const t of [0.33, 0.66]) door.push(faceLine("y", yf, d0, zb + (zTop - zb) * t, d1, zb + (zTop - zb) * t));
  // Side wall (+x): plaster with a timber frame.
  const side = [faceLine("x", xf, plan.y, h.z1 + 4, HOUSE_Y1, h.z1 + 4), faceLine("x", xf, (plan.y + HOUSE_Y1) / 2, h.z1, (plan.y + HOUSE_Y1) / 2, h.z2)];
  out.push(beng(slab(plan, zb, h.z1 - zb, { tone: "mid", inner: L([...lat, ...door].join(""), { tone: "lo" }) }, 2)));
  // Posts, back to front.
  const ps = [...posts.map((x) => [x, yf])];
  for (const [x, y] of byDepth(ps, ([x, y]) => [x, y, 0])) out.push(beng(slab({ x: x - 0.9, y: y - 0.9, w: 1.8, d: 1.8, r: 0 }, zb, h.z1 - zb, { tone: "hi" }, 2)));
  // Sill (dashi) and lintel across the posts.
  out.push(beng(slab({ x: plan.x + 0.2, y: yf - 0.6, w: plan.w - 0.4, d: 1.4, r: 0 }, zTop, 1.6, { tone: "hi" }, 2)));
  // Upper storey: plaster with two lattice-windowed bays (the zashiki facing the street).
  const zu = h.z1;
  const up = [];
  const win = (u0, u1) => {
    up.push(faceRect("y", yf, u0, u1, zu + 4, h.z2 - 3));
    for (let u = u0 + 0.9; u < u1 - 0.3; u += 0.9) up.push(faceLine("y", yf, u, zu + 4, u, h.z2 - 3));
  };
  const mid = (h.x0 + h.x1) / 2;
  win(h.x0 + 4, mid - 3);
  win(mid + 3, h.x1 - 4);
  out.push(plaster(slab(plan, zu, h.z2 - zu, { tone: "mid", inner: L([...up, ...side].join(""), { tone: "lo" }) }, 2)));
  // Upper corner posts and the head beam (in bengara).
  for (const x of [h.x0 + 0.9, mid, h.x1 - 0.9]) out.push(beng(slab({ x: x - 0.8, y: yf - 0.8, w: 1.6, d: 1.6, r: 0 }, zu, h.z2 - zu, { tone: "hi" }, 2)));
  out.push(beng(slab({ x: plan.x + 0.2, y: yf - 0.6, w: plan.w - 0.4, d: 1.4, r: 0 }, h.z2 - 1.6, 1.6, { tone: "hi" }, 2)));
  // Pent roof (hisashi) over the ground floor: a tiled slope from the wall out over the street.
  const out1 = 5.2;
  const sec = [[yf, zu + 1.6], [yf + out1, zu - 0.6], [yf + out1, zu - 1.4], [yf, zu + 0.8]];
  const ring = (x) => sec.map(([y, z]) => [x, y, z]);
  const hx0 = h.x0 + (h === HOUSES[0] ? 0 : 0.2);
  const hx1 = h.x1 - 0.2;
  const hisashi = loft([ring(hx0), ring(hx1)], [[hx0, yf + 2.6, zu], [hx1, yf + 2.6, zu]], { creaseCos: 0.995 });
  const htiles = [];
  for (let x = hx0 + 1.4; x < hx1 - 0.8; x += 1.4) htiles.push(pathOf([at([x, yf + 0.05, zu + 1.6]), at([x, yf + out1, zu - 0.6])]));
  out.push(tile(count(S(hisashi, { tone: "hi", inner: L(htiles.join(""), { tone: "lo" }) }))));
  // Main gable roof, ridge along x, grey kawara with rows from eave to ridge.
  const first = h === HOUSES[0];
  const roof = gableRoof(plan, h.z2, h.rise, { axis: "x", over: 4.2, gable: first ? [2.4, 0] : [0, 2.4], thick: 1.1 });
  const tiles = [];
  const V = G.viewOf(P);
  for (const s of [-1, 1]) {
    const nrm = [0, s * h.rise, plan.d / 2];
    if (G.dot3(nrm, V) <= 0) continue;
    for (let u = roof.u0 + 1.5; u < roof.u1 - 0.7; u += 1.5) tiles.push(pathOf([at(roof.surf(s, 0, u)), at(roof.surf(s, 1, u))]));
  }
  out.push(tile(count(S(roof.paths, { tone: "hi", inner: L(tiles.join(""), { tone: "lo" }) }))));
  // Ridge cap with onigawara blocks at the gable ends.
  const zr = roof.zR + roof.thick;
  out.push(tile(slab({ x: roof.u0 - 0.2, y: roof.c - 1, w: roof.u1 - roof.u0 + 0.4, d: 2, r: 0 }, zr - 0.3, 1.4, { tone: "hi" }, 2, 0.2)));
  // Gable wall under the roof on the exposed end.
  const gx = first ? h.x0 : h.x1;
  if (!first) {
    const tri = (x) => [[x, HOUSE_Y0, h.z2], [x, HOUSE_Y1, h.z2], [x, (HOUSE_Y0 + HOUSE_Y1) / 2, h.z2 + h.rise]];
    out.splice(out.length - 3, 0, plaster(count(S(loft([tri(gx - 4), tri(gx)], [[gx - 4, -37, h.z2 + 2], [gx, -37, h.z2 + 2]]), { tone: "mid" }))));
  }
  return { svg: out.join(""), door: [(d0 + d1) / 2, yf], zTop, zu };
}

// A paper chōchin hanging from the pent roof by the door, glowing.
function chochin(x, y, z) {
  const out = [];
  const r = 1.3;
  const top = z;
  const zc = top - 3.6;
  out.push(L(k.segment([x, y, top], [x, y, zc + 2.1], P), { tone: "lo" }));
  const glow = at([x, y, zc]);
  const sk = G.scaleOf(P);
  out.push(lamp(a.amPulse(`<circle cx="${glow[0].toFixed(1)}" cy="${glow[1].toFixed(1)}" r="${(4.5 * sk).toFixed(1)}" style="fill:var(--anatomy-face);stroke:none;filter:blur(${(1.8 * sk).toFixed(1)}px)" opacity=".75"/>`, { period: 4200, min: 0.35 })));
  out.push(cyl(x, y, r * 0.55, zc + 1.6, 0.5, { tone: "lo" }, 12));
  out.push(lamp(count(S(G.sphereOf([x, y, zc], r * 1.2, P, { steps: 28 }), { tone: "hi", inner: L([k.sideArc(x, y, r * 1.12, zc + 0.6, P, 18), k.sideArc(x, y, r * 1.12, zc - 0.6, P, 18)].join(""), { tone: "lo" }) }))));
  out.push(cyl(x, y, r * 0.55, zc - 1.6, 0.4, { tone: "lo" }, 12));
  return out.join("");
}

// Weeping willow (yanagi) by the canal: a leaning trunk, a crown of rounded clumps, and long
// strands that fall from each clump's lower face and fade out above the street.
function willow(x, y, z) {
  const out = [];
  out.push(`<path class="iso-halo" d="${k.haloOf({ x: x - 9, y: y - 9, w: 18, d: 18, r: 9 }, z, 0.1, P)}" style="filter:blur(4px)"/>`);
  const trunk = [[0, 0, 0], [0.8, 0.6, 7], [1.6, 1, 14], [1.2, 0.6, 20]].map(([dx, dy, dz]) => [x + dx, y + dy, z + dz]);
  for (let i = 0; i < trunk.length - 1; i++) out.push(wood(cyl(trunk[i][0], trunk[i][1], 1.3 - i * 0.22, trunk[i][2], trunk[i][2] === trunk[i + 1][2] ? 1 : trunk[i + 1][2] - trunk[i][2] + 0.3, { tone: "hi" }, 12)));
  const clumps = [{ dx: -4.5, dy: 1.5, dz: 18.5, r: 4.2 }, { dx: 4, dy: -2, dz: 19.5, r: 4 }, { dx: 1, dy: 4, dz: 18, r: 3.8 }, { dx: 0.5, dy: -0.5, dz: 23, r: 5 }];
  const V = G.viewOf(P);
  for (const c of byDepth(clumps, (c) => [x + c.dx, y + c.dy, z + c.dz])) {
    const cx = x + c.dx;
    const cy = y + c.dy;
    const cz = z + c.dz;
    out.push(pine(count(S(G.sphereOf([cx, cy, cz], c.r, P, { steps: 36 }), { tone: "hi" }))));
    // Strands start on the clump's visible lower face and hang straight down, fading.
    const strands = [];
    for (let i = 0; i < 9; i++) {
      const ang = -0.9 + (i / 8) * 2.6 + Math.atan2(V[1], V[0]) - 0.35;
      const dx = Math.cos(ang);
      const dy = Math.sin(ang);
      const el = -0.35 - 0.2 * Math.abs(Math.sin(i * 1.7));
      const p0 = [cx + dx * c.r * Math.cos(el) * 0.9, cy + dy * c.r * Math.cos(el) * 0.9, cz + c.r * Math.sin(el)];
      const len = 6 + 5 * Math.abs(Math.sin(i * 2.3 + c.dx));
      strands.push(k.fadeLineSvg([at(p0), at([p0[0] + dx * 0.5, p0[1] + dy * 0.5, p0[2] - len * 0.55]), at([p0[0] + dx * 0.7, p0[1] + dy * 0.7, p0[2] - len])], { fade: [1.2, 3.5], tone: "lo", stops: 3 }));
    }
    out.push(pine(strands.join("")));
  }
  return out.join("");
}

// Potted plants and a bench along the facade.
function pot(x, y, z) {
  return wood(cyl(x, y, 1.4, z, 1.8, { tone: "hi" }, 14, 0.2)) + pine(count(S(G.sphereOf([x, y, z + 2.9], 1.6, P, { steps: 24 }), { tone: "hi" })));
}

function bench(x, y, z) {
  const out = [];
  for (const dx of [1, 9]) for (const dy of [0.6, 3.4]) out.push(wood(slab({ x: x + dx - 0.4, y: y + dy - 0.4, w: 0.8, d: 0.8, r: 0 }, z, 3, { tone: "hi" }, 2)));
  out.push(beng(slab({ x, y, w: 10, d: 4, r: 0 }, z + 3, 0.7, { tone: "hi" }, 2, 0.2)));
  return out.join("");
}

// Canal-side stone kerb along the front bank.
function kerb() {
  const out = [];
  for (let x = PLINTH.x + 6; x < PLINTH.x + PLINTH.w - 6; x += 12) out.push(slab({ x, y: CANAL.y1, w: 11.4, d: 2.2, r: 0 }, 0, STREET_Z - 0.2, { tone: "mid" }, 2, 0.2));
  return out.join("");
}

// ---------- assemble ----------
const hs = HOUSES.map(house);
const body = minify([
  T.plinth(PLINTH),
  ground(),
  canalDetail(),
  hs[0].svg,
  hs[1].svg,
  chochin(hs[0].door[0] - 5, HOUSE_Y1 + 3.8, hs[0].zu - 0.9),
  chochin(hs[1].door[0] + 5, HOUSE_Y1 + 3.8, HOUSES[1].z1 - 0.9),
  pot(-58, -21.5, STREET_Z),
  pot(56, -21.5, STREET_Z),
  bench(-14, -22, STREET_Z),
  kerb(),
  willow(52, 1, STREET_Z),
  rocks(),
].join(""));

function rocks() {
  return [[-40, 31, 2.2, 1.6], [20, 32, 1.8, 1.4]].map(([x, y, r, h], i) => stone(x, y, r, h, STREET_Z - 0.6, i + 2)).join("");
}

emit({
  nn: "14",
  here: HERE,
  body,
  label: "Higashi Chaya in Kanazawa in isometric view: two wooden two-storey teahouses with fine red lattice, a paved street, a canal and a willow.",
  subject: "Casas de té de Higashi Chaya",
  accentsFor,
  jsdoc: ["Higashi Chaya isométrico (día 14): dos chaya de dos plantas con celosía kimusuko en rojo", "bengara, calle empedrada, canal y sauce. El farolillo junto a la puerta respira (CSS)."],
  solids: T.stats.solids,
});
