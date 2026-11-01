// banda-calle — FINAL Asset. A full-width strip that hands the hero over to the "La ruta" map
// band: one long Japanese street, never repeating a module. Left to right: a front-gabled kura
// with a namako base, a small modern corner shop (glass front, striped awning, water tank, a
// bicycle), a two-storey machiya, a ramen shop with red chōchin and a steaming chimney, a vending
// machine, an Inari nook (vermilion torii, flagstones, a hokora under a pine), a tea shop with a red
// bench and a cat, a low machiya with a bay window, a modern house with a balcony, a sake brewery
// (sugidama and straw-wrapped barrels), a soba shop with bamboo blinds and an earthen wall with a
// tiled cap. Three utility poles carry the wires across, and a convex traffic mirror stands by the
// kerb. Same plinth edge as the maqueta, a stone-paved street with a side gutter in front.
//
// Camera: square-on (azimuth 90°, elevation 30° as the family) so the street runs level across
// the page; a 40° camera would tilt a full-width strip by ~200 px. The strip bleeds past both
// canvas edges and is clipped to the viewBox. The interesting buildings sit in the middle so the
// phone crop (xMidYMax slice, ~700 of the 1200 units) still reads.
//
// Motion (CSS only, on stacked <svg> layers — never on an inner <g>, which repaints the page):
//   steam  : the ramen chimney's steam rises and fades (both themes);
//   glow-a : at night the chōchin, the soba lantern and the tōrō glow and pulse;
//   glow-b : at night the vending machine and the shop windows glow, out of phase.
// Everything stops under prefers-reduced-motion.
//
//   node build.mjs           → banda-calle-light.svg/.html, banda-calle-dark.svg/.html, ../out/bandaCalle.markup.ts
//   node build.mjs --audit   → also runs the kit audit on the recorded shapes
//   node build.mjs --sizes   → also lists the markup weight of each part

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { k, a, G, A, SITE, mix, baseAccents, polySolid, minify, reactMarkup, prefixAll } from "../common.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "out");
mkdirSync(OUT, { recursive: true });
const W = 1200;
const H = 200;
const WEIGHT = 0.7;

function accentsFor(theme) {
  const s = SITE[theme];
  const Lt = theme === "light";
  return {
    ...baseAccents(theme),
    plaster: Lt ? mix(s.gold, s.paper, 0.93) : mix(s.ink, s.paper, 0.5),
    dkwood: Lt ? mix(s.brown, s.ink, 0.45) : mix(s.brown, s.paper, 0.38),
    roof: Lt ? mix(s.ink, s.paper, 0.3) : mix(s.slate, s.paper, 0.42),
    paving: Lt ? mix(s.slate, s.paper, 0.74) : mix(s.slate, s.paper, 0.72),
    concrete: Lt ? mix(s.slate, s.paper, 0.6) : mix(s.slate, s.paper, 0.48),
    indigo: Lt ? mix(s.ink, s.paper, 0.14) : mix(SITE.light.ink, s.ink, 0.3),
    amber: s.amber,
    vend: Lt ? mix(s.ink, s.paper, 0.86) : mix(s.slate, s.paper, 0.32),
    straw: Lt ? mix(s.gold, s.paper, 0.35) : mix(s.gold, s.paper, 0.2),
  };
}

// ---------- world (x → screen right, y → toward the viewer, z up) ----------
const VIS = 186; // half the visible run
const X0 = -VIS - 30;
const X1 = VIS + 30;
const STRIP = { x: X0, y: -24, w: X1 - X0, d: 42, r: 0 };
const POLE_Y = 4.4;
const ARM_Z = 33.4;

const P = a.fitInto([[-VIS, 18, -6], [VIS, 18, -6], [-VIS, -16, 42], [VIS, -16, 42]], { x: 0, y: 0, w: W, h: H }, { pad: 4, azimuth: 90 });
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts.map(at), style);
const ac = (name) => (svg) => `<g class="ac-${name}">${svg}</g>`;
const M = Object.fromEntries(["wood", "dkwood", "moss", "pine", "stone", "ebony", "pane", "plaster", "roof", "paving", "concrete", "indigo", "torii", "amber", "gold", "vend", "straw"].map((n) => [n, ac(n)]));
const depth = (p) => k.depthOf([p[0], p[1], p[2] ?? 0], P);
const byDepth = (items, key = (i) => i) => [...items].sort((p, q) => depth(key(p)) - depth(key(q)));
const pathOf = (pts, closed) => k.pathOf(pts, closed);
const halo = (plan, z, blur = 3) => `<path class="iso-halo" d="${k.haloOf(plan, z, 0.1, P)}" style="filter:blur(${blur}px)"/>`;
let solids = 0;
const count = (svg) => { solids++; return svg; };
const box = (x0, x1, y0, y1) => ({ x: x0, y: y0, w: x1 - x0, d: y1 - y0, r: 0 });
const slab = (plan, z, h, opts = {}, steps = 2, bevel = 0) => count(S(k.slabOf(plan, z, h, P, steps, bevel), opts));
const cyl = (x, y, r, z, h, opts = {}, steps = 12, bevel = 0) => count(S(k.cylinder(x, y, r, z, h, P, steps, bevel), opts));
const fp = (face, c, u, z) => at(face === "x" ? [c, u, z] : [u, c, z]);
const faceRect = (face, c, u0, u1, z0, z1) => pathOf([[u0, z0], [u1, z0], [u1, z1], [u0, z1]].map(([u, z]) => fp(face, c, u, z)), true);
const faceLine = (c, u0, z0, u1, z1) => pathOf([fp("y", c, u0, z0), fp("y", c, u1, z1)]);
const fillIn = (d, v = "shade-2") => `<path d="${d}" style="fill:var(--anatomy-${v});stroke:none"/>`;
const lit = (d) => M.pane(`<path d="${d}" style="fill:var(--anatomy-dot);stroke:none"/>`);

const R = A.recorder(P);
function put(name, centre, svg, shapes, bias = 0) {
  const id = R.nameFor(name);
  return R.put({ at: centre, bias, svg, name: id, shapes: shapes.map((shape) => R.solid({ ...shape, name: shape.name ?? id, owner: id })) });
}
const Abox = (x0, x1, y0, y1, z0, z1) => A.box([x0, y0, z0], [x1, y1, z1]);
const FX = { o: [0, 0, 0], a: [1, 0, 0], u: [0, 1, 0], v: [0, 0, 1] };
const FY = { o: [0, 0, 0], a: [0, 1, 0], u: [1, 0, 0], v: [0, 0, 1] };

// A prism from a 2D section, extruded along x (section in y,z) or y (section in x,z), shaded like the kit.
function prism(axis, sec, s0, s1) {
  const pt = (s, [u, v]) => (axis === "x" ? [s, u, v] : [u, s, v]);
  const r0 = sec.map((p) => pt(s0, p));
  const r1 = sec.map((p) => pt(s1, p));
  const cu = sec.reduce((s, p) => s + p[0], 0) / sec.length;
  const cv = sec.reduce((s, p) => s + p[1], 0) / sec.length;
  const faces = [];
  for (let s = 0; s < sec.length; s++) {
    const s2 = (s + 1) % sec.length;
    const du = (sec[s][0] + sec[s2][0]) / 2 - cu;
    const dv = (sec[s][1] + sec[s2][1]) / 2 - cv;
    faces.push({ pts: [r0[s], r1[s], r1[s2], r0[s2]], hint: axis === "x" ? [0, du, dv] : [du, 0, dv] });
  }
  faces.push({ pts: r0, hint: axis === "x" ? [-1, 0, 0] : [0, -1, 0] });
  faces.push({ pts: r1, hint: axis === "x" ? [1, 0, 0] : [0, 1, 0] });
  return polySolid(P, faces);
}
const Aprism = (axis, sec, s0, s1) => A.prism(axis === "x" ? FX : FY, sec, s0, s1);

// ---------- night light (layers) ----------
const glowA = [];
const glowB = [];
const steam = [];
function glow(list, p, rx, ry, color = "lamp", opacity = 0.5, blur = 5) {
  const [gx, gy] = at(p);
  list.push(`<ellipse cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" rx="${(rx * P.scale).toFixed(1)}" ry="${(ry * P.scale).toFixed(1)}" style="fill:var(--calle-${color});stroke:none;opacity:${opacity};filter:blur(${blur}px)"/>`);
}

// ---------- shared parts ----------
function tileRows(x0, x1, yR, zR, yF, zF, step = 1.7) {
  const rows = [];
  const ends = [];
  for (let x = x0 + 0.8; x < x1; x += step) {
    rows.push(pathOf([at([x, yR + 0.25, zR - 0.17]), at([x, yF, zF])]));
    ends.push([x + step / 2, yF, zF - 0.4]);
  }
  return { rows: rows.join(""), ends };
}
// A gable roof along x (ridge parallel to the street): front eave yF, back eave yB.
function gableX(x0, x1, yF, yB, zE, zR, acc = "roof", opts = {}) {
  const yR = (yF + yB) / 2;
  const sec = [[yF, zE], [yF, zE + 0.8], [yR, zR], [yB, zE + 0.8], [yB, zE]];
  const { rows, ends } = tileRows(x0, x1, yR, zR, yF, zE + 0.8, opts.step ?? 1.7);
  const ridge = [[yR - 0.8, zR - 0.6], [yR + 0.8, zR - 0.6], [yR + 0.6, zR + 0.9], [yR - 0.6, zR + 0.9]];
  const svg = M[acc](count(S(prism("x", sec, x0, x1), { tone: "hi", crease: "faint", inner: opts.plain ? "" : L(rows, { tone: "lo" }) })) +
    (opts.plain ? "" : D(ends, { size: 0.5, tone: "mid" })) + (opts.noRidge ? "" : count(S(prism("x", ridge, x0 - 0.4, x1 + 0.4), { tone: "hi", crease: "faint" }))));
  return { svg, shapes: [Aprism("x", sec, x0, x1)] };
}
// A pent roof (hisashi) over a ground floor: from the wall (yW) out to yF.
function pent(x0, x1, yW, yF, z, acc = "roof") {
  const sec = [[yW, z + 1.6], [yF, z + 0.1], [yF, z + 0.7], [yW, z + 2.2]];
  const { rows } = tileRows(x0, x1, yW - 0.25, z + 2.37, yF, z + 0.7, 1.6);
  return { svg: M[acc](count(S(prism("x", sec, x0, x1), { tone: "hi", crease: "faint", inner: L(rows, { tone: "lo" }) }))), shapes: [Aprism("x", sec, x0, x1)] };
}
function lattice(fy, x0, x1, z0, z1, step = 1.05) {
  const l = [];
  for (let x = x0 + step / 2; x < x1; x += step) l.push(faceLine(fy, x, z0, x, z1));
  l.push(faceRect("y", fy, x0, x1, z0, z1));
  return l.join("");
}
function noren(fy, x0, x1, z0, z1, acc, panels = 3) {
  const slits = [];
  for (let i = 1; i < panels; i++) {
    const x = x0 + ((x1 - x0) * i) / panels;
    slits.push(faceLine(fy + 0.45, x, z0, x, z1 - 1.2));
  }
  return M[acc](slab(box(x0, x1, fy + 0.15, fy + 0.45), z0, z1 - z0, { tone: "hi", crease: "none", inner: L(slits.join(""), { tone: "lo" }) }));
}
function chochin(x, y, z, acc = "torii", r = 1.05, h = 2.5, layer = glowA, hook = z + h + 1.2) {
  const ribs = [0.25, 0.5, 0.75].map((t) => k.sideArc(x, y, r, z + h * t, P, 12)).join("");
  const svg = M.ebony(L(k.segment([x, y, z + h + 0.35], [x, y, hook], P), { tone: "lo" })) + M.ebony(cyl(x, y, r * 0.62, z - 0.35, 0.35, { tone: "mid", crease: "none" }, 10)) +
    M[acc](cyl(x, y, r, z, h, { tone: "hi", inner: L(ribs, { tone: "lo" }) }, 14, 0.3)) +
    M.ebony(cyl(x, y, r * 0.62, z + h, 0.35, { tone: "mid", crease: "none" }, 10));
  if (layer) glow(layer, [x, y, z + h / 2], 3.4, 3, acc === "torii" ? "lamp" : "warm", 0.55);
  return { svg, shapes: [A.cylinder(x, y, r, z - 0.35, h + 0.7), A.tube([[x, y, z + h + 0.35], [x, y, hook]], 0.08)] };
}
function potPlant(x, y, r, kind = 0) {
  const out = [halo(box(x - r, x + r, y - r, y + r), 0, 2)];
  out.push(M.stone(cyl(x, y, r * 0.75, 0, r * 0.9, { tone: "mid", crease: "none" }, 9)));
  const zt = r * 0.9;
  if (kind === 0) {
    out.push(M.pine(cyl(x, y, r, zt, r * 0.6, { tone: "hi", inner: L(k.sideArc(x, y, r, zt + r * 0.3, P, 10), { tone: "faint" }) }, 10)));
    out.push(M.pine(cyl(x + 0.2, y - 0.2, r * 0.66, zt + r * 0.6, r * 0.45, { tone: "hi" }, 8)));
  } else {
    out.push(M.moss(count(S(G.sphereOf([x, y, zt + r * 0.7], r * 0.95, P, { steps: 12 }), { tone: "hi" }))));
  }
  put("plant", [x, y, zt], out.join(""), [A.cylinder(x, y, r, 0, zt + r * 1.4)]);
}
function pineTree(x, y, z, scale = 1, name = "pine") {
  const out = [halo({ x: x - 8 * scale, y: y - 8 * scale, w: 16 * scale, d: 16 * scale, r: 8 * scale }, z)];
  const shapes = [];
  const u = (v) => v * scale;
  const trunk = [[0, 0, 0], [1.6, 0.5, 5.5], [2.2, 0.7, 11], [0.4, 0, 16]].map(([dx, dy, dz]) => [x + u(dx), y + u(dy), z + u(dz)]);
  const pads = [
    { dx: 7, dy: 2.5, dz: 6, r: 4.2 },
    { dx: -4.5, dy: 4, dz: 8.5, r: 3.8 },
    { dx: -2, dy: -5, dz: 11, r: 4.4 },
    { dx: 0.4, dy: 0, dz: 16.5, r: 5.4 },
  ].map((p) => ({ ...p, c: [x + u(p.dx), y + u(p.dy), z + u(p.dz)] }));
  const branches = pads.filter((p) => p.dz < 16).map((p) => {
    const zs = p.c[2] - u(1.6);
    const from = trunk[Math.max(0, trunk.findLastIndex((t, i) => i < trunk.length - 1 && t[2] <= zs))];
    const a0 = [from[0], from[1], zs];
    const a1 = [p.c[0], p.c[1], p.c[2] + u(0.6)];
    shapes.push(A.tube([a0, a1], u(0.3)));
    return k.segment(a0, a1, P);
  });
  out.push(M.wood(L(branches.join(""), { tone: "hi" })));
  const trunkDepth = depth(trunk[1]);
  const pad = (p) => {
    const r = u(p.r);
    const [px, py, pz] = p.c;
    shapes.push(A.cylinder(px, py, r, pz, u(1.3)), A.cylinder(px + u(0.3), py - u(0.2), r * 0.66, pz + u(1.3), u(1.1)));
    return M.pine(count(S(k.cylinder(px, py, r, pz, u(1.3), P, 11), { tone: "hi", inner: L(k.sideArc(px, py, r, pz + u(0.65), P, 11), { tone: "faint" }) })) +
      count(S(k.cylinder(px + u(0.3), py - u(0.2), r * 0.66, pz + u(1.3), u(1.1), P, 8, 0), { tone: "hi" })));
  };
  const sorted = byDepth(pads, (p) => p.c);
  const behind = (p) => depth(p.c) < trunkDepth && p.dz < 16;
  for (const p of sorted) if (behind(p)) out.push(pad(p));
  for (let i = 0; i < trunk.length - 1; i++) {
    const [px, py, pz] = trunk[i];
    const h = trunk[i + 1][2] - pz + u(i === trunk.length - 2 ? 0.8 : 0.3);
    out.push(M.wood(cyl(px, py, u(1.25 - i * 0.2), pz, h, { tone: "hi" }, 10)));
    shapes.push(A.cylinder(px, py, u(1.25 - i * 0.2), pz, h));
  }
  for (const p of sorted) if (!behind(p)) out.push(pad(p));
  put(name, [x, y, z + u(8)], out.join(""), shapes);
}
function toro(x, y, z, s = 1.1) {
  const out = [halo({ x: x - 4 * s, y: y - 4 * s, w: 8 * s, d: 8 * s, r: 4 * s }, z, 3)];
  const u = (v) => v * s;
  out.push(cyl(x, y, u(3.2), z, u(1.4), { tone: "mid" }, 16, 0.3));
  out.push(cyl(x, y, u(1.1), z + u(1.4), u(5), { tone: "mid" }, 12));
  out.push(slab({ x: x - u(2.8), y: y - u(2.8), w: u(5.6), d: u(5.6), r: 0 }, z + u(6.4), u(1.1), { tone: "mid" }, 2, 0.3));
  const fb = { x: x - u(1.9), y: y - u(1.9), w: u(3.8), d: u(3.8), r: 0 };
  const lights = faceRect("y", y + u(1.9), x - u(0.9), x + u(0.9), z + u(8.1), z + u(9.9));
  out.push(slab(fb, z + u(7.5), u(3), { tone: "mid", inner: lit(lights) + L(lights, { tone: "lo" }) }, 2));
  out.push(slab({ x: x - u(3.4), y: y - u(3.4), w: u(6.8), d: u(6.8), r: 0 }, z + u(10.5), u(1.2), { tone: "mid" }, 2, 0.4));
  out.push(count(S(G.sphereOf([x, y, z + u(12.4)], u(0.9), P, { steps: 12 }), { tone: "mid" })));
  glow(glowA, [x, y, z + u(9)], u(5), u(4.5), "warm", 0.5);
  put("toro", [x, y, z + u(6)], M.stone(out.join("")), [A.cylinder(x, y, u(3.2), z, u(13.3))]);
}

// ---------- ground: halo, wooden plinth edge, stone paving with a gutter ----------
const STRIP_SHAPE = R.solid(A.slab(STRIP, -6, 6, { name: "stand.strip", piece: "", move: [0, 0, 0] }, 2));
// The ground behind the houses (never seen: the trees and the pagoda stand on it).
R.solid(A.slab(box(X0, X1, -48, -24), -6, 6, { name: "stand.back", piece: "", move: [0, 0, 0] }, 2));
function ground() {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(STRIP, -3), -6, 2, P)}"/>`];
  out.push(M.wood(slab(STRIP, -6, 4, { tone: "mid", inner: L(k.sideSeam(STRIP, -4, P, 2), { tone: "faint" }) }, 2, 0.6)));
  // Ishidatami: courses along the street, staggered cross joints (seeded, so the build repeats).
  const joints = [];
  for (const y of [5.6, 9.4, 13.4]) joints.push(pathOf([at([X0, y, 0]), at([X1, y, 0])]));
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (const [y0, y1] of [[2.2, 5.6], [5.6, 9.4], [9.4, 13.4], [13.4, 18]]) {
    for (let x = X0 + rnd() * 6; x < X1; x += 6 + rnd() * 7) joints.push(pathOf([at([x, y0, 0]), at([x + (rnd() - 0.5) * 0.6, y1, 0])]));
  }
  // Side gutter (sokkō) along the house fronts: a dark channel with a grating.
  const gut = pathOf([at([X0, 0.6, 0]), at([X1, 0.6, 0]), at([X1, 2.2, 0]), at([X0, 2.2, 0])], true);
  const grate = [];
  for (let x = X0 + 1; x < X1; x += 2.2) grate.push(pathOf([at([x, 0.75, 0]), at([x, 2.05, 0])]));
  const inner = M.ebony(fillIn(gut, "shade-3")) + L(joints.join(""), { tone: "faint" }) + L(gut, { tone: "lo" }) + L(grate.join(""), { tone: "faint" });
  out.push(M.paving(slab(STRIP, -2, 2, { tone: "mid", crease: "faint", inner }, 2)));
  return out.join("");
}

// ---------- building kit ----------
// A street house: stone footing, a ground floor (lattice / shop / plain), an optional upper floor
// (set back, plaster or wood) under a tiled gable roof, an optional pent roof between them.
function house(o) {
  const { x0, x1, fy = 0, d = 13, zg = 11.5, zu = null, ridge, gWall = "dkwood", uWall = "plaster", gable = true } = o;
  const out = [];
  const shapes = [];
  const body = box(x0, x1, fy - d, fy);
  out.push(M.stone(slab(k.insetPlan(body, -0.4), 0, 0.8, { tone: "mid", crease: "none" })));
  shapes.push(Abox(x0 - 0.4, x1 + 0.4, fy - d - 0.4, fy + 0.4, 0, 0.8));
  out.push(M[gWall](slab(body, 0.8, zg - 0.8, { tone: "mid", inner: o.ground ? o.ground(fy) : "" }, 2)));
  shapes.push(Abox(x0, x1, fy - d, fy, 0.8, zg));
  if (o.behindRoof) out.push(o.behindRoof);
  let zTop = zg;
  let wallF = fy;
  if (zu) {
    const ub = box(x0 + 0.3, x1 - 0.3, fy - d + 0.6, fy - 0.8);
    out.push(M[uWall](slab(ub, zg, zu - zg, { tone: "mid", inner: o.upper ? o.upper(fy - 0.8) : "" }, 2)));
    shapes.push(Abox(ub.x, ub.x + ub.w, ub.y, ub.y + ub.d, zg, zu));
    zTop = zu;
    wallF = fy - 0.8;
  }
  if (gable) {
    const r = gableX(x0 - 0.6, x1 + 0.6, wallF + (o.eave ?? 1.8), fy - d - 1.2, zTop - 0.4, ridge, o.roofAcc ?? "roof", o.roofOpts);
    out.push(r.svg);
    shapes.push(...r.shapes);
  }
  if (o.pent) {
    const r = pent(x0 - 0.5, x1 + 0.5, fy - 0.8, fy + 2.5, zg - 0.6, o.roofAcc ?? "roof");
    out.push(r.svg);
    shapes.push(...r.shapes);
  }
  if (o.front) for (const f of o.front) { out.push(f.svg); shapes.push(...f.shapes); }
  put(o.name, [(x0 + x1) / 2, fy - d / 2, zg / 2], out.join(""), shapes);
}

// 1. Kura: a front-gabled storehouse, thick plaster over a namako (diagonal tile) base.
function kura(x0, x1) {
  const d = 15;
  const ze = 21;
  const zr = 28.5;
  const xc = (x0 + x1) / 2;
  const out = [];
  out.push(M.stone(slab(box(x0 - 0.5, x1 + 0.5, -d - 0.5, 0.5), 0, 1, { tone: "mid", crease: "none" })));
  // namako band: dark field, white diagonal grid
  const z0 = 1;
  const z1 = 7.5;
  const grid = [];
  const clipSeg = (u0, v0, du) => {
    // a 45° segment from (u0, z0) clipped to the band
    const pts = [];
    for (const t of [0, z1 - z0]) pts.push([u0 + du * t, v0 + t]);
    let [[ua, za], [ub, zb]] = pts;
    const lo = Math.min(x0 + 0.6, x1 - 0.6);
    const hi = Math.max(x0 + 0.6, x1 - 0.6);
    const clampT = (u) => (u - ua) / (ub - ua);
    let t0 = 0;
    let t1 = 1;
    for (const bound of [lo, hi]) {
      const t = clampT(bound);
      if (t > 0 && t < 1) { if ((ub - ua) * (bound === lo ? 1 : -1) > 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t); }
    }
    if (t1 <= t0) return;
    const p0 = [ua + (ub - ua) * t0, za + (zb - za) * t0];
    const p1 = [ua + (ub - ua) * t1, za + (zb - za) * t1];
    if (Math.max(p0[0], p1[0]) < lo || Math.min(p0[0], p1[0]) > hi) return;
    grid.push(faceLine(0, p0[0], p0[1], p1[0], p1[1]));
  };
  for (let u = x0 - 8; u < x1 + 8; u += 2.6) { clipSeg(u, z0, 1); clipSeg(u, z0, -1); }
  const band = faceRect("y", 0, x0 + 0.6, x1 - 0.6, z0, z1);
  // two heavy shuttered windows and a door with its thick plaster frame
  const win = [faceRect("y", 0, x0 + 4, x0 + 9, 12.5, 16.5), faceRect("y", 0, x1 - 9, x1 - 4, 12.5, 16.5)].join("");
  const door = faceRect("y", 0, xc - 3, xc + 3, 7.5, 11.5);
  const inner = M.ebony(fillIn(band, "shade-3") + fillIn(win, "shade-2") + fillIn(door, "shade-2")) +
    L(grid.join(""), { tone: "faint" }) + L(band + win + door, { tone: "lo" }) +
    L(faceLine(0, x0, ze - 1.4, x1, ze - 1.4), { tone: "faint" });
  out.push(M.plaster(slab(box(x0, x1, -d, 0), 1, ze - 1, { tone: "mid", inner }, 2)));
  // gable wall
  out.push(M.plaster(count(S(prism("y", [[x0, ze], [x1, ze], [xc, zr - 0.6]], -d, 0), { tone: "mid", inner: L(pathOf([fp("y", 0, xc - 1.2, zr - 3.6), fp("y", 0, xc + 1.2, zr - 3.6)]), { tone: "lo" }) }))));
  // the roof: a chevron extruded along y, tile rows down both slopes
  const ov = 1.6;
  const sec = [[x0 - ov, ze - 0.7], [x0 - ov, ze + 0.2], [xc, zr + 0.9], [x1 + ov, ze + 0.2], [x1 + ov, ze - 0.7], [xc, zr - 0.2]];
  const rows = [];
  for (let y = 1.6 - 0.85; y > -d - 1.6; y -= 1.7) {
    rows.push(pathOf([at([xc, y, zr + 0.9]), at([x0 - ov, y, ze + 0.2])]), pathOf([at([xc, y, zr + 0.9]), at([x1 + ov, y, ze + 0.2])]));
  }
  out.push(M.roof(count(S(prism("y", sec, -d - 1.6, 1.6), { tone: "hi", crease: "faint", inner: L(rows.join(""), { tone: "lo" }) }))));
  put("kura", [xc, -d / 2, ze / 2], out.join(""), [Abox(x0 - 0.5, x1 + 0.5, -d - 0.5, 0.5, 0, ze), Aprism("y", sec, -d - 1.6, 1.6)]);
}

// 2. Corner shop: a modern two-storey box, glass front, striped awning, AC unit, water tank.
function cornerShop(x0, x1) {
  const fy = -0.6;
  const d = 13;
  const zg = 11;
  const zt = 21;
  const out = [];
  const glass = faceRect("y", fy, x0 + 1.4, x1 - 1.4, 1.2, zg - 2.2);
  const mull = [];
  for (let x = x0 + 1.4 + (x1 - x0 - 2.8) / 4; x < x1 - 1.5; x += (x1 - x0 - 2.8) / 4) mull.push(faceLine(fy, x, 1.2, x, zg - 2.2));
  const upWin = [faceRect("y", fy, x0 + 3, x0 + 13, zg + 2.4, zt - 3), faceRect("y", fy, x0 + 17, x1 - 3, zg + 2.4, zt - 3)].join("");
  const inner = lit(glass + upWin) + L(glass + upWin + mull.join(""), { tone: "lo" }) +
    L(faceLine(fy, x0, zg, x1, zg) + faceLine(fy, x0, zg + 0.4, x1, zg + 0.4), { tone: "faint" });
  out.push(M.stone(slab(box(x0 - 0.3, x1 + 0.3, fy - d, fy + 0.3), 0, 0.6, { tone: "mid", crease: "none" })));
  out.push(M.concrete(slab(box(x0, x1, fy - d, fy), 0.6, zt - 0.6, { tone: "mid", inner }, 2)));
  // parapet and a rooftop water tank on legs
  out.push(M.concrete(slab(box(x0 - 0.3, x1 + 0.3, fy - d - 0.3, fy + 0.3), zt, 1.1, { tone: "hi", crease: "faint" }, 2, 0.2)));
  const tx = x1 - 8;
  const ty = fy - 7;
  for (const [lx, ly] of [[-1.6, -1.2], [1.6, -1.2], [-1.6, 1.2], [1.6, 1.2]]) out.push(M.ebony(slab(box(tx + lx - 0.25, tx + lx + 0.25, ty + ly - 0.25, ty + ly + 0.25), zt + 1.1, 2.2, { tone: "mid", crease: "none" })));
  out.push(M.vend(cyl(tx, ty, 2.4, zt + 3.3, 3.8, { tone: "hi", inner: L(k.sideArc(tx, ty, 2.4, zt + 5.2, P, 18), { tone: "faint" }) }, 20, 0.3)));
  // awning: a sloped striped canvas over the shop front
  const aw = [[fy, zg - 0.6], [fy + 3.2, zg - 2.4], [fy + 3.2, zg - 1.9], [fy, zg - 0.1]];
  const stripes = [];
  for (let x = x0 + 0.4; x < x1; x += 2.4) stripes.push(pathOf([at([x, fy + 0.1, zg - 0.15]), at([x + 1.2, fy + 0.1, zg - 0.15]), at([x + 1.2, fy + 3.2, zg - 1.95]), at([x, fy + 3.2, zg - 1.95])], true));
  out.push(M.pine(count(S(prism("x", aw, x0 + 0.4, x1 - 0.4), { tone: "hi", crease: "faint", inner: M.plaster(fillIn(stripes.join(""), "top")) + L(stripes.join(""), { tone: "faint" }) }))));
  // AC unit on a bracket under the upper window
  const ax = x0 + 8;
  out.push(M.vend(slab(box(ax - 2.6, ax + 2.6, fy, fy + 1.8), zg + 0.8, 2.6, { tone: "hi", inner: L(k.sideArc(ax - 0.8, fy + 1.8, 0.01, zg + 2.1, P, 4) + faceRect("y", fy + 1.8, ax - 2, ax + 0.4, zg + 1.1, zg + 3.1), { tone: "lo" }) })));
  glow(glowB, [(x0 + x1) / 2, fy + 0.5, 5], 9, 4.2, "warm", 0.42, 6);
  put("corner", [(x0 + x1) / 2, fy - d / 2, zt / 2], out.join(""), [Abox(x0 - 0.3, x1 + 0.3, fy - d - 0.3, fy + 3.2, 0, zt + 7.1)]);
}

// A bicycle parked at the kerb, wheels in the street plane (rings along y).
function bicycle(x, y) {
  const out = [];
  const shapes = [];
  const r = 2.1;
  const wheel = (cx) => {
    const F = G.frameAlong([cx, y, r + 0.05], [0, 1, 0]);
    shapes.push(A.cylinder(cx, y - 0.2, r, 0, 2 * r));
    return M.ebony(count(S(G.ringBand(-0.2, 0.2, r - 0.45, r, F, P), { tone: "mid", crease: "none" })));
  };
  const xa = x - 3.2;
  const xb = x + 3.2;
  const zc = r + 0.05;
  const frame = [
    [[xa, y, zc], [x - 0.6, y, zc + 2.8]], [[x - 0.6, y, zc + 2.8], [x + 2.2, y, zc + 2.8]], [[x + 2.2, y, zc + 2.8], [xb, y, zc]],
    [[xa, y, zc], [x + 0.4, y, zc]], [[x + 0.4, y, zc], [x - 0.6, y, zc + 2.8]], [[x + 0.4, y, zc], [x + 2.2, y, zc + 2.8]],
    [[x - 0.6, y, zc + 2.8], [x - 0.9, y, zc + 3.6]], [[x + 2.2, y, zc + 2.8], [x + 2.5, y, zc + 3.8]],
  ];
  out.push(wheel(xa));
  out.push(M.torii(L(frame.map(([p, q]) => k.segment(p, q, P)).join(""), { tone: "hi" })));
  for (const [p, q] of frame) shapes.push(A.tube([p, q], 0.2));
  out.push(M.ebony(slab(box(x - 1.6, x - 0.2, y - 0.4, y + 0.4), zc + 3.6, 0.45, { tone: "mid", crease: "none" })));
  out.push(M.ebony(slab(box(x + 1.9, x + 3.1, y - 0.6, y + 0.6), zc + 3.8, 0.3, { tone: "mid", crease: "none" })));
  out.push(D([[x + 0.4, y, zc]], { size: 0.6, tone: "mid" }));
  out.push(wheel(xb));
  put("bicycle", [x, y, zc], out.join(""), shapes);
}

// 5. Vending machine against a wooden fence, with a recycling bin.
function vending(x0, x1) {
  const out = [];
  const y0 = -1.2;
  const y1 = 1.8;
  const zt = 6.6;
  const disp = faceRect("y", y1, x0 + 0.4, x1 - 0.4, 3.4, 5.8);
  const cans = [];
  const colors = ["torii", "pine", "amber", "indigo", "torii", "amber"];
  const row = (z, off) => {
    for (let i = 0; i < 6; i++) {
      const cx = x0 + 0.75 + i * ((x1 - x0 - 1.5) / 5.4);
      cans.push(M[colors[(i + off) % 6]](fillIn(faceRect("y", y1, cx - 0.22, cx + 0.22, z, z + 0.75), "top")));
    }
  };
  row(4.6, 0);
  row(3.6, 3);
  const slot = faceRect("y", y1, x0 + 0.6, x1 - 0.6, 0.6, 1.6);
  const btn = [];
  for (let i = 0; i < 6; i++) btn.push([x0 + 0.75 + i * ((x1 - x0 - 1.5) / 5.4), y1, 3.2]);
  const inner = lit(disp) + cans.join("") + M.ebony(fillIn(slot, "shade-3")) + L(disp + slot + faceRect("y", y1, x1 - 1.3, x1 - 0.5, 2, 2.8), { tone: "lo" });
  out.push(halo(box(x0, x1, y0, y1), 0, 2));
  out.push(M.vend(slab(box(x0, x1, y0, y1), 0.15, zt - 0.15, { tone: "hi", inner }, 2, 0.25)));
  out.push(D(btn, { size: 0.32, tone: "mid" }));
  out.push(M.vend(slab(box(x0 - 0.2, x1 + 0.2, y0 - 0.2, y1 + 0.2), zt, 0.4, { tone: "mid", crease: "none" })));
  // recycling bin beside it
  const bx = x1 + 1.5;
  out.push(M.pine(cyl(bx, 0.8, 0.95, 0.15, 2.6, { tone: "hi", inner: L(k.sideArc(bx, 0.8, 0.95, 2.1, P, 12), { tone: "lo" }) }, 12, 0.2)));
  out.push(M.ebony(cyl(bx, 0.8, 0.55, 2.75, 0.2, { tone: "mid", crease: "none" }, 10)));
  glow(glowB, [(x0 + x1) / 2, y1 + 0.6, 4.4], 4.2, 3.6, "cool", 0.55, 4);
  put("vending", [(x0 + x1) / 2, (y0 + y1) / 2, 3], out.join(""), [Abox(x0 - 0.2, x1 + 0.2, y0 - 0.2, y1 + 0.2, 0, zt + 0.4), A.cylinder(bx, 0.8, 0.95, 0, 2.95)]);
}
function fence(x0, x1, y0, y1, h) {
  const boards = [];
  for (let x = x0 + 0.7; x < x1; x += 0.7) boards.push(faceLine(y1, x, 0, x, h));
  put("fence", [(x0 + x1) / 2, (y0 + y1) / 2, h / 2], M.dkwood(slab(box(x0, x1, y0, y1), 0, h, { tone: "mid", inner: L(boards.join(""), { tone: "lo" }) }) + slab(box(x0 - 0.2, x1 + 0.2, y0 - 0.2, y1 + 0.2), h, 0.4, { tone: "hi", crease: "none" })), [Abox(x0 - 0.2, x1 + 0.2, y0 - 0.2, y1 + 0.2, 0, h + 0.4)]);
}

// 6. Inari nook: gravel, flagstones, a vermilion torii and a small hokora under a pine.
function shrine(x0, x1) {
  const xc = (x0 + x1) / 2;
  // gravel court and the back wall (an earthen wall with a little tiled cap)
  const court = box(x0, x1, -17, 0.4);
  const rake = [];
  for (const y of [-14, -11, -8, -5, -2]) rake.push(pathOf([at([x0, y, 0.3]), at([x1, y, 0.3])]));
  put("court", [xc, -8, 0.15], M.stone(slab(court, 0, 0.3, { tone: "lo", crease: "none", inner: L(rake.join(""), { tone: "faint" }) })), [Abox(x0, x1, -17, 0.4, 0, 0.3)], -2);
  const wallSec = [[-19, 0], [-17.2, 0], [-17.2, 6.4], [-19, 6.4]];
  const cap = [[-17.2 + 0.9, 6.4], [-18.1, 7.9], [-19.9, 6.4], [-19.9, 6.9], [-18.1, 8.5], [-16.3, 6.9]];
  put("nook.wall", [xc, -18, 3], M.plaster(count(S(prism("x", wallSec, x0 - 1, x1 + 1), { tone: "mid" }))) + M.roof(count(S(prism("x", cap, x0 - 1.4, x1 + 1.4), { tone: "hi", crease: "faint" }))), [Aprism("x", wallSec, x0 - 1, x1 + 1), Aprism("x", cap, x0 - 1.4, x1 + 1.4)]);
  // flagstones from the street to the hokora
  for (const [y, w] of [[-6.6, 3], [-3.4, 3.4], [-0.2, 3]]) put("flag", [xc, y, 0.4], M.stone(slab(box(xc - w / 2, xc + w / 2, y - 1.2, y + 1.2), 0.3, 0.35, { tone: "mid", crease: "none" }, 2, 0.15)), [Abox(xc - w / 2, xc + w / 2, y - 1.2, y + 1.2, 0.3, 0.65)]);
  // hokora: stone base, vermilion body, a little gable roof
  const hy0 = -14.5;
  const hy1 = -9.4;
  const out = [];
  out.push(M.stone(slab(box(xc - 4.2, xc + 4.2, hy0 - 0.6, hy1 + 0.6), 0.3, 1.6, { tone: "mid", crease: "faint" }, 2, 0.2)));
  out.push(M.stone(slab(box(xc - 3, xc + 3, hy1 + 0.6, hy1 + 1.8), 0.3, 0.8, { tone: "mid", crease: "none" })));
  const doors = faceRect("y", hy1, xc - 1.6, xc + 1.6, 2.6, 6.2);
  out.push(M.torii(slab(box(xc - 3, xc + 3, hy0, hy1), 1.9, 5.4, { tone: "mid", inner: M.ebony(fillIn(doors, "shade-2")) + L(doors + faceLine(hy1, xc, 2.6, xc, 6.2), { tone: "lo" }) })));
  const g = gableX(xc - 4, xc + 4, hy1 + 1.6, hy0 - 1.4, 7, 10.4, "roof", { step: 1.3 });
  out.push(g.svg);
  out.push(M.gold(D([[xc - 0.8, hy1, 4.4], [xc + 0.8, hy1, 4.4]], { size: 0.32, tone: "mid" })));
  put("hokora", [xc, (hy0 + hy1) / 2, 4], out.join(""), [Abox(xc - 4.2, xc + 4.2, hy0 - 0.6, hy1 + 1.8, 0.3, 7.3), ...g.shapes]);
  // the torii at the street
  const ty = 1.6;
  const tx = [xc - 4.4, xc + 4.4];
  const tor = [];
  const tshapes = [];
  for (const x of tx) {
    tor.push(M.stone(cyl(x, ty, 1, 0.2, 0.9, { tone: "mid", crease: "none" }, 12, 0.2)));
    tor.push(M.torii(cyl(x, ty, 0.62, 1.1, 11.4, { tone: "hi" }, 12)));
    tshapes.push(A.cylinder(x, ty, 1, 0.2, 12.3));
  }
  tor.push(M.torii(slab(box(xc - 6, xc + 6, ty - 0.35, ty + 0.35), 9.4, 0.9, { tone: "hi", crease: "none" })));
  tor.push(M.torii(slab(box(xc - 0.4, xc + 0.4, ty - 0.3, ty + 0.3), 10.3, 1.3, { tone: "hi", crease: "none" })));
  tor.push(M.torii(slab(box(xc - 6.4, xc + 6.4, ty - 0.45, ty + 0.45), 11.6, 0.8, { tone: "hi", crease: "none" })));
  const kasagi = [[xc - 7.6, 13.4], [xc - 6.6, 12.4], [xc + 6.6, 12.4], [xc + 7.6, 13.4], [xc + 7.6, 13.9], [xc, 13.2], [xc - 7.6, 13.9]];
  tor.push(M.ebony(count(S(prism("y", kasagi, ty - 0.6, ty + 0.6), { tone: "hi", crease: "faint" }))));
  tshapes.push(Abox(xc - 7.6, xc + 7.6, ty - 0.6, ty + 0.6, 9.4, 13.9));
  put("torii", [xc, ty, 7], tor.join(""), tshapes);
}

// 7. Red bench (shōgi) with its felt cloth, and a cat curled on it.
function bench(x0, x1, y) {
  const out = [halo(box(x0, x1, y - 1, y + 1), 0, 2)];
  const shapes = [];
  for (const x of [x0 + 0.5, x1 - 0.9]) for (const dy of [-0.8, 0.5]) {
    out.push(M.wood(slab(box(x, x + 0.4, y + dy, y + dy + 0.4), 0, 2.4, { tone: "mid", crease: "none" })));
  }
  out.push(M.wood(slab(box(x0, x1, y - 1.1, y + 1.1), 2.4, 0.4, { tone: "mid", crease: "none" })));
  out.push(M.torii(slab(box(x0 + 0.2, x1 - 0.2, y - 1.15, y + 1.15), 2.8, 0.18, { tone: "hi", crease: "none" })));
  shapes.push(Abox(x0, x1, y - 1.15, y + 1.15, 0, 2.98));
  // cat: a loaf body, a head with two ears, a tail curled along the seat
  const cx = x1 - 2.4;
  const cz = 2.98;
  out.push(M.amber(count(S(G.sphereOf([cx, y, cz + 0.55], 0.95, P, { steps: 12 }), { tone: "hi" }))));
  out.push(M.amber(count(S(G.sphereOf([cx + 1.05, y + 0.2, cz + 1.2], 0.6, P, { steps: 10 }), { tone: "hi" }))));
  const ear = (dx) => pathOf([at([cx + 1.05 + dx - 0.22, y + 0.2, cz + 1.6]), at([cx + 1.05 + dx, y + 0.2, cz + 2.05]), at([cx + 1.05 + dx + 0.22, y + 0.2, cz + 1.6])], true);
  out.push(M.amber(`<path d="${ear(-0.3)}${ear(0.3)}" style="fill:var(--anatomy-shade-1)"/>` + L(ear(-0.3) + ear(0.3), { tone: "lo" })));
  out.push(M.amber(L(pathOf([at([cx - 0.8, y + 0.3, cz + 0.2]), at([cx - 1.6, y + 0.8, cz + 0.12]), at([cx - 1.3, y + 1.0, cz + 0.12])]), { tone: "lo" })));
  shapes.push(A.ball([cx, y, cz + 0.55], 0.95), A.ball([cx + 1.05, y + 0.2, cz + 1.2], 0.6));
  put("bench", [(x0 + x1) / 2, y, 1.5], out.join(""), shapes);
}

// Sake barrels (komodaru): straw-wrapped, roped, lids up.
function barrels(list) {
  for (const [x, y, z] of byDepth(list, (p) => p)) {
    const r = 1.45;
    const h = 2.7;
    const ropes = [0.5, h - 0.5].map((t) => k.sideArc(x, y, r, z + t, P, 11)).join("");
    put("barrel", [x, y, z + h / 2], (z === 0 ? halo(box(x - r, x + r, y - r, y + r), 0, 2) : "") +
      M.straw(cyl(x, y, r, z, h, { tone: "hi", inner: L(ropes, { tone: "lo" }) + M.torii(L(k.sideArc(x, y, r, z + h / 2, P, 11), { tone: "hi" })) }, 11)) +
      M.wood(cyl(x, y, r * 0.86, z + h, 0.12, { tone: "mid", crease: "none" }, 11)), [A.cylinder(x, y, r, z, h + 0.12)]);
  }
}

// Utility pole: concrete shaft, crossarm, insulators; optional transformer drum.
const POLES = [-176, 56.5, 177];
const ARM2_Z = ARM_Z - 3.4;
const armEnds = (x) => [[x - 3.4, POLE_Y, ARM_Z + 0.9], [x + 3.4, POLE_Y, ARM_Z + 0.9], [x - 2.4, POLE_Y, ARM2_Z + 0.9], [x + 2.4, POLE_Y, ARM2_Z + 0.9]];
function pole(x, transformer = false) {
  const out = [halo(box(x - 1, x + 1, POLE_Y - 1, POLE_Y + 1), 0, 2)];
  const bands = [8, 16, 24].map((z) => k.sideArc(x, POLE_Y, 0.66, z, P, 10)).join("");
  out.push(M.concrete(cyl(x, POLE_Y, 0.7, 0, ARM_Z + 3, { tone: "hi", inner: L(bands, { tone: "faint" }) }, 10)));
  if (transformer) {
    out.push(M.concrete(slab(box(x + 0.6, x + 1.4, POLE_Y - 0.3, POLE_Y + 0.3), 27.5, 0.5, { tone: "mid", crease: "none" })));
    out.push(M.vend(cyl(x + 2.1, POLE_Y, 1.25, 24.2, 3.4, { tone: "hi", inner: L(k.sideArc(x + 2.1, POLE_Y, 1.25, 25.6, P, 12), { tone: "faint" }) }, 14, 0.25)));
  }
  out.push(M.ebony(slab(box(x - 4.2, x + 4.2, POLE_Y - 0.3, POLE_Y + 0.3), ARM_Z - 0.6, 0.6, { tone: "mid", crease: "none" })));
  out.push(M.ebony(slab(box(x - 3, x + 3, POLE_Y - 0.3, POLE_Y + 0.3), ARM2_Z - 0.6, 0.6, { tone: "mid", crease: "none" })));
  out.push(M.vend(D(armEnds(x).map((p) => [p[0], p[1], p[2] - 0.5]), { size: 0.55, tone: "mid" })));
  // a street sign plate on the shaft (blank: no text in the drawing)
  out.push(M.indigo(slab(box(x - 0.9, x + 0.9, POLE_Y + 0.7, POLE_Y + 0.85), 10, 3.2, { tone: "hi", crease: "none" })));
  put("pole", [x, POLE_Y, 14], out.join(""), [A.cylinder(x, POLE_Y, 0.7, 0, ARM_Z + 3), Abox(x - 4.2, x + 4.2, POLE_Y - 0.3, POLE_Y + 0.3, ARM_Z - 0.6, ARM_Z), ...(transformer ? [A.cylinder(x + 2.1, POLE_Y, 1.25, 24.2, 3.4)] : [])]);
}
function wires() {
  const ds = [];
  const xs = [X0 - 4, ...POLES, X1 + 4];
  for (let i = 0; i < xs.length - 1; i++) {
    for (let w = 0; w < 4; w++) {
      const edge = (x) => [x, POLE_Y, (w < 2 ? ARM_Z : ARM2_Z) + 0.9 - 1.4];
      const p = i === 0 ? edge(xs[0]) : armEnds(xs[i])[w];
      const q = i === xs.length - 2 ? edge(xs[i + 1]) : armEnds(xs[i + 1])[w];
      const sag = 1.5 + (w % 2) * 0.35;
      const pts = [];
      for (let t = 0; t <= 1.0001; t += 0.125) pts.push(at([p[0] + (q[0] - p[0]) * t, POLE_Y, p[2] + (q[2] - p[2]) * t - sag * 4 * t * (1 - t)]));
      ds.push(pathOf(pts));
    }
  }
  return M.ebony(L(ds.join(""), { tone: "lo" }));
}
// Convex traffic mirror on an orange post.
function mirror(x, y) {
  const out = [halo(box(x - 0.8, x + 0.8, y - 0.8, y + 0.8), 0, 2)];
  out.push(M.amber(cyl(x, y, 0.32, 0, 13, { tone: "hi" }, 10)));
  const F = G.frameAlong([x, y + 0.4, 14.6], [0, 1, 0]);
  out.push(M.amber(count(S(G.disc(-0.25, 0.15, 2.1, F, P), { tone: "hi", crease: "none" }))));
  out.push(M.vend(count(S(G.disc(0.15, 0.3, 1.7, F, P), { tone: "hi", crease: "none" }))));
  put("mirror", [x, y, 8], out.join(""), [A.cylinder(x, y, 0.32, 0, 13), Abox(x - 2.1, x + 2.1, y + 0.1, y + 0.75, 12.5, 16.7)]);
}


// Flared hip roof (as the maqueta's and the old band's tōrō caps): eave ring lifted at the corners.
function rectRing(plan, z, n, { lift = 0, flare = 0 } = {}) {
  const cs = [[plan.x, plan.y], [plan.x + plan.w, plan.y], [plan.x + plan.w, plan.y + plan.d], [plan.x, plan.y + plan.d]];
  const outs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  const pts = [];
  for (let s = 0; s < 4; s++) {
    const A0 = cs[s];
    const B = cs[(s + 1) % 4];
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const w = Math.abs(2 * t - 1) ** 4;
      let px = A0[0] + (B[0] - A0[0]) * t;
      let py = A0[1] + (B[1] - A0[1]) * t;
      if (i === 0) {
        const prev = outs[(s + 3) % 4];
        px += (prev[0] + outs[s][0]) * flare;
        py += (prev[1] + outs[s][1]) * flare;
      } else {
        px += outs[s][0] * flare * w;
        py += outs[s][1] * flare * w;
      }
      pts.push([px, py, z + lift * w]);
    }
  }
  return pts;
}
function roofOf(wall, overhang, zEave, inner, zIn, { lift = 3, flare = 2, fascia = 1.6, n = 8 } = {}) {
  const eave = k.insetPlan(wall, -overhang);
  const A0 = rectRing(eave, zEave, n, { lift, flare });
  const B = rectRing(eave, zEave + fascia, n, { lift, flare });
  const C = rectRing(inner, zIn, n);
  const Dr = rectRing(wall, zEave, n);
  const N = A0.length;
  const faces = [];
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N;
    const mid = [(A0[i][0] + A0[j][0]) / 2 - (wall.x + wall.w / 2), (A0[i][1] + A0[j][1]) / 2 - (wall.y + wall.d / 2), 0];
    const side = Math.floor(i / n);
    faces.push({ pts: [A0[i], A0[j], B[j], B[i]], hint: mid, group: `fascia${side}` });
    faces.push({ pts: [B[i], B[j], C[j], C[i]], hint: [mid[0] * 0.02, mid[1] * 0.02, 1], group: `slope${side}` });
    faces.push({ pts: [A0[i], A0[j], Dr[j], Dr[i]], hint: [0, 0, -1] });
  }
  faces.push({ pts: C, hint: [0, 0, 1] });
  faces.push({ pts: Dr, hint: [0, 0, -1] });
  return polySolid(P, faces);
}
// A five-storey pagoda far behind the street (Yasaka-style): dark timber tiers with white
// bands, flared roofs, and the bronze sōrin spire. Only its upper tiers clear the roofline.
function pagoda(x, y, s = 1) {
  const u = (v) => v * s;
  const out = [];
  const th = u(4.1);
  let z = u(1.2);
  out.push(M.stone(slab(box(x - u(6.4), x + u(6.4), y - u(6.4), y + u(6.4)), 0, z, { tone: "mid", crease: "none" })));
  for (let i = 0; i < 5; i++) {
    const half = u(4.4 - i * 0.42);
    const plan = box(x - half, x + half, y - half, y + half);
    const hb = th * 0.5;
    const band = faceRect("y", y + half, x - half + u(0.4), x + half - u(0.4), z + hb * 0.55, z + hb * 0.85);
    const doors = faceRect("y", y + half, x - u(1), x + u(1), z + u(0.2), z + hb * 0.5);
    out.push(M.dkwood(slab(plan, z, hb, { tone: "mid", inner: M.plaster(fillIn(band, "top")) + M.ebony(fillIn(doors, "shade-3")) + L(band + doors, { tone: "lo" }) })));
    const inner = k.insetPlan(plan, u(1.4));
    out.push(M.roof(count(S(roofOf(plan, u(2.6 - i * 0.12), z + hb, inner, z + th - u(0.15), { lift: u(1.1), flare: u(0.9), fascia: u(0.55), n: 3 }), { tone: "hi", crease: "faint" }))));
    z += th;
  }
  const rings = [];
  for (let i = 0; i < 9; i++) rings.push(k.sideArc(x, y, u(0.55), z + u(1.2 + i * 0.55), P, 10));
  out.push(M.gold(cyl(x, y, u(1.1), z - u(0.2), u(1), { tone: "mid", crease: "none" }, 12)));
  out.push(M.gold(cyl(x, y, u(0.32), z + u(0.8), u(6.2), { tone: "hi", inner: L(rings.join(""), { tone: "lo" }) }, 10)));
  out.push(M.gold(count(S(G.sphereOf([x, y, z + u(7.4)], u(0.55), P, { steps: 10 }), { tone: "hi" }))));
  put("pagoda", [x, y, z / 2], out.join(""), [Abox(x - u(7), x + u(7), y - u(7), y + u(7), 0, z + u(8))], -40);
}
// A broadleaf tree (a maple in summer leaf): a short trunk and a crown of overlapping spheres.
function broadleaf(x, y, z, s = 1) {
  const u = (v) => v * s;
  const out = [halo({ x: x - u(6), y: y - u(6), w: u(12), d: u(12), r: u(6) }, z)];
  out.push(M.wood(cyl(x, y, u(0.9), z, u(9), { tone: "hi" }, 10)));
  const blobs = [[-3.4, 0.6, 10.5, 3.6], [3.2, -0.6, 10.8, 3.8], [0, -2, 13.6, 4.3], [-1.6, 2.2, 15.2, 3.3], [2, 1.4, 15.8, 3.1]].map(([dx, dy, dz, r]) => ({ c: [x + u(dx), y + u(dy), z + u(dz)], r: u(r) }));
  for (const b of byDepth(blobs, (b) => b.c)) out.push(M.moss(count(S(G.sphereOf(b.c, b.r, P, { steps: 13 }), { tone: "hi" }))));
  put("broadleaf", [x, y, z + u(10)], out.join(""), [A.cylinder(x, y, u(0.9), z, u(9)), ...blobs.map((b) => A.ball(b.c, b.r))]);
}

// ---------- the street, left to right ----------
kura(-200, -178);
pole(POLES[0]);
cornerShop(-172, -137);
bicycle(-148, 6.2);
potPlant(-134.2, 1.6, 1.3);

// 3. Two-storey machiya: lattice front, indigo noren, mushiko upper floor, inuyarai.
house({
  name: "machiya", x0: -128, x1: -101, zg: 11.5, zu: 19.5, ridge: 26, pent: true,
  ground: (fy) => {
    const door = faceRect("y", fy, -110.5, -104.5, 0.8, 9.6);
    return M.ebony(fillIn(door, "shade-3")) + L(lattice(fy, -127, -112, 1.6, 9.6) + door, { tone: "lo" }) + L(faceLine(fy, -127.5, 10.4, -101.5, 10.4), { tone: "faint" });
  },
  upper: (fy) => {
    const slats = [];
    for (let x = -123; x <= -106; x += 1.3) slats.push(faceLine(fy, x, 13.6, x, 17.6));
    return L(faceRect("y", fy, -124, -105, 13.6, 17.6), { tone: "mid" }) + L(slats.join(""), { tone: "lo" });
  },
  front: [
    { svg: noren(0, -110.8, -104.2, 5.6, 10.4, "indigo", 3), shapes: [Abox(-110.8, -104.2, 0.15, 0.45, 5.6, 10.4)] },
    (() => {
      // inuyarai: the curved bamboo screen at the foot of the lattice
      const arc = (ry, rz) => Array.from({ length: 7 }, (_, i) => { const t = (i / 6) * (Math.PI / 2); return [ry * Math.sin(t), 0.8 + rz * Math.cos(t)]; });
      const sec = [...arc(2.2, 3.6), ...arc(1.85, 3.25).reverse()];
      return { svg: M.wood(count(S(prism("x", sec, -127.4, -112.6), { tone: "hi" }))), shapes: [Aprism("x", sec, -127.4, -112.6)] };
    })(),
  ],
});

// 4. Ramen shop: wide sliding doors (lit at night), red noren, two chōchin, a sign plank,
//    and a stove-pipe chimney behind the ridge (its steam is the "steam" layer).
{
  const x0 = -97;
  const x1 = -64;
  const chimX = -70;
  const chimY = -8.5;
  const chimTop = 25.5;
  const chim = M.concrete(cyl(chimX, chimY, 0.75, 14, chimTop - 14, { tone: "hi", inner: L(k.sideArc(chimX, chimY, 0.75, 20, P, 10), { tone: "faint" }) }, 12)) +
    M.ebony(cyl(chimX, chimY, 1.15, chimTop, 0.45, { tone: "mid", crease: "none" }, 12));
  // steam wisps above the chimney cap
  for (const [dx, dz, r] of [[0, 2.2, 1.3], [0.9, 4.4, 1.6], [-0.4, 6.8, 1.9]]) {
    const [sx, sy] = at([chimX + dx, chimY, chimTop + dz]);
    steam.push(`<ellipse cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" rx="${(r * P.scale).toFixed(1)}" ry="${(r * 0.7 * P.scale).toFixed(1)}" style="fill:var(--calle-steam);stroke:none;opacity:.55;filter:blur(2.5px)"/>`);
  }
  const lanternL = chochin(x0 + 3.2, 1.7, 7.3, "torii", 1.05, 2.5, glowA, 14.2);
  const lanternR = chochin(x1 - 3.2, 1.7, 7.3, "torii", 1.05, 2.5, glowA, 14.2);
  house({
    name: "ramen", x0, x1, zg: 14, ridge: 21.5, gWall: "wood", eave: 2.6,
    behindRoof: chim,
    ground: (fy) => {
      const doors = [];
      for (let i = 0; i < 4; i++) doors.push(faceRect("y", fy, x0 + 6 + i * 5.3, x0 + 6 + (i + 1) * 5.3 - 0.3, 0.8, 9.2));
      const kumiko = [];
      for (let i = 0; i < 4; i++) for (const z of [3.2, 5.6, 7.6]) kumiko.push(faceLine(fy, x0 + 6 + i * 5.3, z, x0 + 6 + (i + 1) * 5.3 - 0.3, z));
      const sign = faceRect("y", fy, x0 + 9, x1 - 9, 10.6, 13.2);
      return lit(doors.join("")) + L(doors.join("") + kumiko.join(""), { tone: "lo" }) + M.dkwood(fillIn(sign, "shade-1")) + L(sign, { tone: "lo" }) +
        M.gold(D([[x0 + 9.6, fy, 11.9], [x1 - 9.6, fy, 11.9]], { size: 0.32, tone: "mid" }));
    },
    front: [
      { svg: noren(0, x0 + 6, x1 - 6, 6.4, 9.9, "torii", 4), shapes: [Abox(x0 + 6, x1 - 6, 0.15, 0.45, 6.4, 9.9)] },
      lanternL, lanternR,
    ],
  });
  glow(glowB, [(x0 + x1) / 2, 0.6, 4.6], 10, 3.8, "warm", 0.38, 6);
}
fence(-61, -52.6, -6, -5.2, 7.5);
vending(-60, -55.6);
shrine(-50, -24);
toro(-17.4, 3.4, 0, 0.92);
pineTree(-29, -30, 0, 1.55, "pine.shrine");

// 7. Tea shop: wide two-storey, open front with shelves of tea tins behind a green noren,
//    lattice upper windows, a long kanban board, the red bench and the cat in front.
house({
  name: "teashop", x0: -12, x1: 24, zg: 12, zu: 20.5, ridge: 27, pent: true, gWall: "wood", uWall: "dkwood",
  ground: (fy) => {
    const open = faceRect("y", fy, -9, 21, 0.8, 9.8);
    const shelves = [];
    for (const z of [3, 5.6]) shelves.push(faceLine(fy, -9, z, 21, z));
    const tins = [];
    for (const z of [3, 5.6]) for (let x = -7.6; x < 20; x += 2.1) tins.push(fillIn(faceRect("y", fy, x, x + 1.1, z, z + 1.7), "top"));
    return M.ebony(fillIn(open, "shade-3")) + M.gold(tins.join("")) + L(open + shelves.join(""), { tone: "lo" });
  },
  upper: (fy) => {
    const out = [];
    for (const [a0, a1] of [[-9, 0], [3, 12], [15, 21]]) out.push(lattice(fy, a0, a1, 13.6, 18.4, 0.9));
    const board = faceRect("y", fy, -3, 15, 18.9, 20.1);
    return M.plaster(fillIn([[-9, 0], [3, 12], [15, 21]].map(([u0, u1]) => faceRect("y", fy, u0, u1, 13.6, 18.4)).join(""), "top")) + L(out.join(""), { tone: "lo" }) + M.wood(fillIn(board, "shade-1")) + L(board, { tone: "lo" });
  },
  front: [{ svg: noren(0, -9, 21, 6.8, 10.3, "pine", 6), shapes: [Abox(-9, 21, 0.15, 0.45, 6.8, 10.3)] }],
});
bench(-6, 4, 4.4);
potPlant(10.5, 2.4, 1.4);
// a manhole cover in the middle of the street
put("manhole", [8, 11, 0], M.stone(cyl(8, 11.2, 2, 0, 0.12, { tone: "mid", crease: "none", inner: L(pathOf(Array.from({ length: 24 }, (_, i) => at([8 + 1.2 * Math.cos((i / 24) * 2 * Math.PI), 11.2 + 1.2 * Math.sin((i / 24) * 2 * Math.PI), 0.12])), true), { tone: "faint" }) }, 24)), [A.cylinder(8, 11.2, 2, 0, 0.12)], -1);

// 8. Low machiya (zushi-nikai) with a lattice bay window (demado) and potted plants.
house({
  name: "machiya.low", x0: 27, x1: 53, zg: 11, zu: 16, ridge: 21.5, pent: true, uWall: "plaster", roofOpts: { step: 1.9 },
  ground: (fy) => {
    const door = faceRect("y", fy, 29, 35, 0.8, 9.2);
    return M.ebony(fillIn(door, "shade-2")) + L(door + faceLine(fy, 32, 0.8, 32, 9.2), { tone: "lo" });
  },
  upper: (fy) => {
    const slats = [];
    for (let x = 31; x <= 49; x += 1.5) slats.push(faceLine(fy, x, 12.6, x, 15));
    return L(faceRect("y", fy, 30, 50, 12.6, 15) + slats.join(""), { tone: "lo" });
  },
  front: [(() => {
    // the bay window: a lattice box standing proud of the wall, on a little roof of its own
    const b = box(37.5, 51, 0, 1.6);
    const svg = M.dkwood(slab(b, 2.6, 6.2, { tone: "mid", inner: lit(faceRect("y", 1.6, 38.2, 50.3, 3.4, 8.2)) + L(lattice(1.6, 38.2, 50.3, 3.4, 8.2, 0.85), { tone: "lo" }) }));
    return { svg, shapes: [Abox(37.5, 51, 0, 1.6, 2.6, 8.8)] };
  })()],
});
potPlant(30.5, 1.6, 1.0, 1);
potPlant(33.4, 2.2, 1.25);
pole(POLES[1], true);

// 9. Modern house: two storeys, shallow metal roof, a balcony with a railing and an AC unit.
{
  const x0 = 60;
  const x1 = 93;
  const fy = -2.2;
  const out = [];
  out.push(M.stone(slab(box(x0 - 0.3, x1 + 0.3, fy - 12, fy + 0.3), 0, 0.6, { tone: "mid", crease: "none" })));
  const door = faceRect("y", fy, x0 + 3, x0 + 7.5, 0.6, 8.6);
  const win = faceRect("y", fy, x0 + 11, x1 - 3, 3.2, 8.2);
  const slide = faceRect("y", fy, x0 + 3, x1 - 3, 12.4, 17.8);
  const inner = M.wood(fillIn(door, "shade-1")) + lit(win + slide) + L(door + win + slide + faceLine(fy, (x0 + x1) / 2, 12.4, (x0 + x1) / 2, 17.8) + faceLine(fy, x0 + 20, 3.2, x0 + 20, 8.2), { tone: "lo" });
  out.push(M.plaster(slab(box(x0, x1, fy - 12, fy), 0.6, 19.6, { tone: "mid", inner }, 2)));
  // shallow standing-seam roof
  const g = gableX(x0 - 0.8, x1 + 0.8, fy + 1.4, fy - 13.2, 20, 22.6, "roof", { step: 2.2 });
  out.push(g.svg);
  // balcony slab, railing with balusters, AC unit on it
  out.push(M.concrete(slab(box(x0 + 1.5, x1 - 1.5, fy, fy + 2.2), 10.6, 0.7, { tone: "hi", crease: "none" })));
  const ax = x1 - 7;
  out.push(M.vend(slab(box(ax - 2.4, ax + 2.4, fy + 0.2, fy + 1.6), 11.3, 2.5, { tone: "hi", inner: L(faceRect("y", fy + 1.6, ax - 1.9, ax + 0.3, 11.7, 13.4), { tone: "lo" }) })));
  const bars = [];
  for (let x = x0 + 2; x < x1 - 1.6; x += 0.9) bars.push(faceLine(fy + 2.2, x, 11.3, x, 13.9));
  out.push(M.ebony(slab(box(x0 + 1.5, x1 - 1.5, fy + 2, fy + 2.2), 11.3, 2.6, { tone: "mid", crease: "none", inner: L(bars.join(""), { tone: "lo" }) })));
  out.push(M.ebony(slab(box(x0 + 1.4, x1 - 1.4, fy + 1.9, fy + 2.3), 13.9, 0.3, { tone: "hi", crease: "none" })));
  glow(glowB, [(x0 + x1) / 2 + 4, fy + 0.4, 15], 8, 3.4, "warm", 0.4, 6);
  put("house", [(x0 + x1) / 2, fy - 6, 10], out.join(""), [Abox(x0 - 0.3, x1 + 0.3, fy - 12, fy, 0, 20.2), Abox(x0 + 1.4, x1 - 1.4, fy, fy + 2.3, 10.6, 14.2), ...g.shapes]);
  // a postbox and a small garden strip in the setback
  potPlant(x0 + 12.5, fy + 1.2, 1.1, 1);
  potPlant(x0 + 16, fy + 1.1, 0.9, 1);
  put("postbox", [x0 + 9.2, fy + 0.6, 4], M.torii(slab(box(x0 + 8.4, x0 + 10, fy + 0.1, fy + 1.3), 3.4, 2.2, { tone: "hi", crease: "none", inner: L(faceLine(fy + 1.2, x0 + 8.8, 4.8, x0 + 9.6, 4.8), { tone: "lo" }) })) + M.ebony(slab(box(x0 + 9, x0 + 9.4, fy + 0.5, fy + 0.9), 0, 3.4, { tone: "mid", crease: "none" })), [Abox(x0 + 8.4, x0 + 10, fy + 0.1, fy + 1.3, 0, 5.6)]);
}
mirror(96.4, 5.2);

// 10. Sake brewery: dark lattice, a sugidama (cedar ball) under the eave, barrels stacked out front.
house({
  name: "sake", x0: 99, x1: 133, zg: 12, zu: 20, ridge: 26.5, pent: true, gWall: "dkwood", uWall: "plaster",
  ground: (fy) => {
    const door = faceRect("y", fy, 101.5, 107.5, 0.8, 9.6);
    return M.ebony(fillIn(door, "shade-3")) + L(lattice(fy, 108.5, 132, 1.6, 9.6, 0.9) + door, { tone: "lo" });
  },
  upper: (fy) => {
    const slats = [];
    for (let x = 106; x <= 126; x += 1.2) slats.push(faceLine(fy, x, 13.8, x, 17.4));
    return L(faceRect("y", fy, 105, 127, 13.8, 17.4) + slats.join(""), { tone: "lo" });
  },
  front: [
    { svg: noren(0, 101.8, 107.2, 5.8, 10, "indigo", 2), shapes: [Abox(101.8, 107.2, 0.15, 0.45, 5.8, 10)] },
    (() => {
      const sx = 111;
      const sy = 2;
      const svg = M.ebony(L(k.segment([sx, sy, 11.8], [sx, sy, 10.4], P), { tone: "lo" })) + M.pine(count(S(G.sphereOf([sx, sy, 9.2], 1.35, P, { steps: 14 }), { tone: "hi" })));
      return { svg, shapes: [A.ball([sx, sy, 9.2], 1.35), A.tube([[sx, sy, 10.4], [sx, sy, 11.8]], 0.1)] };
    })(),
  ],
});
barrels([[121, 3.4, 0], [124.1, 3.4, 0], [127.2, 3.4, 0], [122.55, 3.4, 2.82], [125.65, 3.4, 2.82]]);

// 11. Soba shop: one storey and a low attic, bamboo blinds, a white lantern.
house({
  name: "soba", x0: 137, x1: 170, zg: 11, zu: 15.5, ridge: 22, pent: true, gWall: "wood", uWall: "plaster", roofOpts: { step: 1.5 },
  ground: (fy) => {
    const door = faceRect("y", fy, 139.5, 145.5, 0.8, 9.2);
    const blind = faceRect("y", fy, 148, 167.5, 2.4, 9);
    const slats = [];
    for (let z = 2.8; z < 9; z += 0.45) slats.push(faceLine(fy, 148.2, z, 167.3, z));
    return lit(door) + M.straw(fillIn(blind, "top")) + L(door + faceLine(fy, 142.5, 0.8, 142.5, 9.2) + blind, { tone: "lo" }) + M.straw(L(slats.join(""), { tone: "lo" }));
  },
  upper: (fy) => L(faceRect("y", fy, 145, 162, 12.4, 14.6), { tone: "lo" }) + lit(faceRect("y", fy, 145.4, 161.6, 12.8, 14.2)),
  front: [
    { svg: noren(0, 139.8, 145.2, 6.2, 9.8, "plaster", 3), shapes: [Abox(139.8, 145.2, 0.15, 0.45, 6.2, 9.8)] },
    chochin(147, 1.8, 5.8, "plaster", 0.95, 2.3, glowA, 10.8),
  ],
});
potPlant(172.5, 1.8, 1.2);
pole(POLES[2]);

// 12. An earthen wall with a tiled cap and a pine behind it, running off the right edge.
{
  const x0 = 181;
  const x1 = X1 + 2;
  const sec = [[-6, 0], [-3.4, 0], [-3.4, 10], [-6, 10]];
  const cap = [[-2.2, 10], [-4.7, 12.4], [-7.2, 10], [-7.2, 10.6], [-4.7, 13.2], [-2.2, 10.6]];
  const lines = [];
  for (const z of [3.3, 6.6]) lines.push(pathOf([at([x0, -3.4, z]), at([x1, -3.4, z])]));
  put("wall.end", [x0 + 15, -4.7, 5], M.plaster(count(S(prism("x", sec, x0, x1), { tone: "mid", inner: L(lines.join(""), { tone: "faint" }) }))) + M.roof(count(S(prism("x", cap, x0 - 0.4, x1), { tone: "hi", crease: "faint" }))), [Aprism("x", sec, x0, x1), Aprism("x", cap, x0 - 0.4, x1)]);
  pineTree(200, -24, 0, 1.7, "pine.end");
}
pineTree(-160, -28, 0, 1.25, "pine.back");
pagoda(41, -36, 1);
broadleaf(116, -22, 0, 1.15);

// ---------- assemble ----------
if (process.argv.includes("--sizes")) {
  const t = {};
  for (const it of R.items) { const n = it.name.replace(/#\d+$/, ""); t[n] = (t[n] ?? 0) + minify(it.svg).length; }
  for (const [n, v] of Object.entries(t).sort((x, y) => y[1] - x[1])) console.log(n, (v / 1024).toFixed(1));
  console.log("ground", (minify(ground()).length / 1024).toFixed(1), "wires", (minify(wires()).length / 1024).toFixed(1));
}
A.settle(R, P);
R.items.sort((p, q) => p.key - q.key);
const body = minify([
  `<clipPath id="calle-clip"><rect width="${W}" height="${H}"/></clipPath>`,
  `<g clip-path="url(#calle-clip)">`,
  ground(),
  R.items.map((it) => it.svg).join(""),
  wires(),
  `</g>`,
].join(""));
const LAYERS = [
  { name: "steam", body: steam.join("") },
  { name: "glow-a", body: glowA.join("") },
  { name: "glow-b", body: glowB.join("") },
];

const glowVars = (t) => {
  const s = SITE[t];
  const Lt = t === "light";
  return [
    `--calle-steam:${Lt ? mix(s.slate, s.paper, 0.45) : mix(s.slate, s.paper, 0.25)}`,
    `--calle-lamp:${mix(s.coral, s.amber, 0.45)}`,
    `--calle-warm:${s.amber}`,
    `--calle-cool:${mix(s.ink, s.slate, 0.25)}`,
  ].join(";");
};
// Layer motion lives on the stacked <svg data-art-layer> elements (composited, no repaint).
function motionCss(s, layerSel) {
  return [
    `${s}{${glowVars("light")}}`,
    `[data-theme="dark"] ${s}{${glowVars("dark")}}`,
    `@keyframes calle-steam{0%{opacity:0;transform:translateY(4px)}30%{opacity:.85}100%{opacity:0;transform:translateY(-10px)}}`,
    `@keyframes calle-glow{0%,100%{opacity:.45}50%{opacity:1}}`,
    `${layerSel("steam")}{animation:calle-steam 6s cubic-bezier(.4,0,.6,1) infinite}`,
    `${layerSel("glow-a")},${layerSel("glow-b")}{visibility:hidden}`,
    `[data-theme="dark"] ${layerSel("glow-a")},[data-theme="dark"] ${layerSel("glow-b")}{visibility:visible}`,
    `[data-theme="dark"] ${layerSel("glow-a")}{animation:calle-glow 4.4s cubic-bezier(.45,0,.55,1) infinite}`,
    `[data-theme="dark"] ${layerSel("glow-b")}{animation:calle-glow 7s cubic-bezier(.45,0,.55,1) -3s infinite}`,
    // Same specificity as the dark-theme rules above, so the stop also wins at night.
    `@media (prefers-reduced-motion:reduce){${["steam", "glow-a", "glow-b"].flatMap((n) => [layerSel(n), `[data-theme="dark"] ${layerSel(n)}`]).join(",")}{animation:none;opacity:.7}}`,
  ].join("\n");
}

// Standalone previews: the layers as groups on top (the checks run on these pages).
const LABEL = "A Japanese street: a storehouse, a corner shop, wooden townhouses, a ramen shop with red lanterns, a vending machine, a small shrine gate, a tea shop with a cat on a red bench, a modern house, a sake brewery and a soba shop, with utility poles and wires.";
for (const theme of ["light", "dark"]) {
  const id = `banda-calle-${theme}`;
  const layered = body + LAYERS.map((l) => `<g class="calle-layer" data-art-layer="${l.name}">${l.body}</g>`).join("");
  const b = layered.replace(/ id="([^"]+)"/g, ` id="$1-${theme[0]}"`).replace(/url\(#([^)]+)\)/g, `url(#$1-${theme[0]})`);
  const css = motionCss(`#${id}`, (n) => `#${id} [data-art-layer="${n}"]`).replace(/\[data-theme="dark"\] /g, theme === "dark" ? "" : "[data-never] ");
  const svg = a.assetSvg({ width: W, height: H, label: LABEL, body: b, paper: SITE[theme].paper, theme, accents: accentsFor(theme), weight: WEIGHT, id, css });
  writeFileSync(join(HERE, `${id}.svg`), svg);
  writeFileSync(join(HERE, `${id}.html`), a.previewHtml({ title: id, svg, paper: SITE[theme].paper, width: W }));
  console.log(`wrote ${id}.svg (${(svg.length / 1024).toFixed(0)} KB)`);
}
console.log(`solids: ${solids} · items: ${R.items.length} · scale ${P.scale.toFixed(3)}`);

const markup = reactMarkup({ scope: "iso-calle", prefix: "calle", body, accentsFor, weight: WEIGHT, css: [`.iso-calle{overflow:hidden}`, motionCss(".iso-calle", (n) => `.iso-calle[data-art-layer="${n}"]`)].join("\n") });
const layerMarkup = LAYERS.map((l) => ({ name: l.name, markup: prefixAll(minify(l.body), "calle") }));
const ts = `/**
 * Banda «Calle» (transición hero → «La ruta») — marcado SVG generado (no editar a mano).
 *
 * Generado con el kit de la skill anatomy-asset (hero/banda-calle/build.mjs en tools/art). Una
 * calle japonesa continua, sin módulos repetidos: kura, tienda de esquina, machiya, ramen con
 * chōchin, máquina expendedora, rincón de Inari con torii, tienda de té con banco rojo y gato,
 * machiya baja, casa moderna con balcón, bodega de sake, soba y tapia; postes con cables y un
 * espejo de tráfico.
 *
 * Una sola geometría para los dos temas: el <style> va acotado a \`.iso-calle\` y la variante
 * oscura vive bajo [data-theme="dark"] .iso-calle. Los colores salen de los tokens de
 * src/styles/index.css (--paper, --ink, --gold, --brown, --green, --coral, --amber, --slate):
 * --anatomy-paper usa var(--paper) en vivo y las rampas se derivan de esos hex al generar. Si
 * cambia la paleta, hay que regenerar este fichero. Clases, keyframes e ids van prefijados con
 * \`calle-\`. La calle se sale del lienzo por los dos lados y va recortada al viewBox.
 *
 * Movimiento (solo CSS, en capas <svg data-art-layer> apiladas sobre la base: el navegador las
 * compone sin repintar el dibujo; parado con prefers-reduced-motion):
 *  - steam: el vapor de la chimenea del ramen sube y se desvanece (los dos temas);
 *  - glow-a / glow-b: de noche, farolillos y tōrō / máquina y escaparates laten desfasados.
 */
export const BANDA_CALLE_VIEWBOX = '0 0 ${W} ${H}'

export const BANDA_CALLE_MARKUP = ${JSON.stringify(markup)}

/** Capas que se mueven, de atrás adelante (sin <style>: lo lleva el marcado base). */
export const BANDA_CALLE_LAYERS: readonly { name: string; markup: string }[] = [
${layerMarkup.map((l) => `  { name: ${JSON.stringify(l.name)}, markup: ${JSON.stringify(l.markup)} },`).join("\n")}
]
`;
writeFileSync(join(OUT, "bandaCalle.markup.ts"), ts);
const kb = (s) => +(s.length / 1024).toFixed(1);
console.log(`wrote out/bandaCalle.markup.ts (markup ${kb(markup)} KB, layers ${layerMarkup.map((l) => `${l.name} ${kb(l.markup)} KB`).join(", ")})`);
writeFileSync(join(HERE, "meta.json"), JSON.stringify({ solids, markupKB: kb(markup), layers: layerMarkup.map((l) => ({ name: l.name, kb: kb(l.markup) })) }));

A.auditOrExit(R, P);
