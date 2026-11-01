// banda-muro — FINAL Asset. A full-width strip that hands the hero over to the "La ruta" map
// band: the same wooden plinth edge and moss ground as the maqueta, a battered ishigaki stone
// base, a whitewashed wall with a timber skirting board and a small kawara-tiled roof, pines
// rising behind the wall, a raked gravel strip in front and three stone tōrō on it.
// The camera faces the wall square-on (azimuth 90°, elevation 30° as the family) so the wall runs
// perfectly level across the page; a 40° camera would tilt a full-width strip by ~200 px.
// The strip and wall run past both canvas edges and are clipped to the viewBox, so the band bleeds.
//
// Motion: none by day. At night the three tōrō light up and pulse out of phase (CSS only, still
// under prefers-reduced-motion).
//
//   node build.mjs           → banda-muro-light.svg/.html, banda-muro-dark.svg/.html, ../out/bandaMuro.markup.ts
//   node build.mjs --audit   → also runs the kit audit on the recorded shapes

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { k, a, G, A, SITE, mix, baseAccents, polySolid, minify, reactMarkup } from "../common.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "out");
mkdirSync(OUT, { recursive: true });
const W = 1200;
const H = 180;
const WEIGHT = 0.7;

function accentsFor(theme) {
  const s = SITE[theme];
  const L = theme === "light";
  return {
    ...baseAccents(theme),
    plaster: L ? mix(s.gold, s.paper, 0.93) : mix(s.ink, s.paper, 0.5),
    gravel: L ? mix(s.slate, s.paper, 0.78) : mix(s.slate, s.paper, 0.62),
  };
}

// ---------- world (x → screen right, y → toward the viewer, z up) ----------
const VIS = 186; // half the visible run
const X0 = -VIS - 30;
const X1 = VIS + 30;
const STRIP = { x: X0, y: -34, w: X1 - X0, d: 48, r: 0 };
const GRAVEL = { x: X0, y: 5.6, w: X1 - X0, d: 8.2, r: 0 };
const Z = { stone: 7, wall: 16.6, eave: 16.2, ridge: 20.2 };
const TORO_X = [-124, 0, 124];
const PINES = [[-160, -24, 1.6, 3], [-68, -26, 1.7, 4], [54, -24, 1.55, 4], [150, -26, 1.62, 3]];

const P = a.fitInto([[-VIS, 14, -6], [VIS, 14, -6], [-VIS, -26, 35.5], [VIS, -26, 35.5]], { x: 0, y: 0, w: W, h: H }, { pad: 4, azimuth: 90 });
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const ac = (name) => (svg) => `<g class="ac-${name}">${svg}</g>`;
const [wood, moss, pine, stone, ebony, pane, plaster, gravel] = ["wood", "moss", "pine", "stone", "ebony", "pane", "plaster", "gravel"].map(ac);
const depth = (p) => k.depthOf([p[0], p[1], p[2] ?? 0], P);
const byDepth = (items, key = (i) => i) => [...items].sort((p, q) => depth(key(p)) - depth(key(q)));
const pathOf = (pts, closed) => k.pathOf(pts, closed);
const halo = (plan, z, blur = 4) => `<path class="iso-halo" d="${k.haloOf(plan, z, 0.1, P)}" style="filter:blur(${blur}px)"/>`;
let solids = 0;
const count = (svg) => { solids++; return svg; };
const box = (x0, x1, y0, y1) => ({ x: x0, y: y0, w: x1 - x0, d: y1 - y0, r: 0 });
const slab = (plan, z, h, opts = {}, steps = 2, bevel = 0) => count(S(k.slabOf(plan, z, h, P, steps, bevel), opts));
const cyl = (x, y, r, z, h, opts = {}, steps = 20, bevel = 0) => count(S(k.cylinder(x, y, r, z, h, P, steps, bevel), opts));
const fp = (face, c, u, z) => at(face === "x" ? [c, u, z] : [u, c, z]);
const faceRect = (face, c, u0, u1, z0, z1) => pathOf([[u0, z0], [u1, z0], [u1, z1], [u0, z1]].map(([u, z]) => fp(face, c, u, z)), true);

const R = A.recorder(P);
function put(name, centre, svg, shapes, bias = 0) {
  const id = R.nameFor(name);
  return R.put({ at: centre, bias, svg, name: id, shapes: shapes.map((shape) => R.solid({ ...shape, name: shape.name ?? id, owner: id })) });
}
const Abox = (x0, x1, y0, y1, z0, z1) => A.box([x0, y0, z0], [x1, y1, z1]);
// A prism along x from a (y, z) section, shaded like the kit.
function prismX(sec, xa, xb, inner = "") {
  const ring = (x) => sec.map(([y, z]) => [x, y, z]);
  const r0 = ring(xa);
  const r1 = ring(xb);
  const cy = sec.reduce((s, p) => s + p[0], 0) / sec.length;
  const cz = sec.reduce((s, p) => s + p[1], 0) / sec.length;
  const faces = [];
  for (let s = 0; s < sec.length; s++) {
    const s2 = (s + 1) % sec.length;
    faces.push({ pts: [r0[s], r1[s], r1[s2], r0[s2]], hint: [0, (sec[s][0] + sec[s2][0]) / 2 - cy, (sec[s][1] + sec[s2][1]) / 2 - cz] });
  }
  faces.push({ pts: r0, hint: [-1, 0, 0] });
  faces.push({ pts: r1, hint: [1, 0, 0] });
  return polySolid(P, faces);
}

// ---------- parts shared with the maqueta (same pine and tōrō) ----------
function pineTree(x, y, z, scale = 1, padsN = 4, name = "pine") {
  const out = [halo({ x: x - 8 * scale, y: y - 8 * scale, w: 16 * scale, d: 16 * scale, r: 8 * scale }, z)];
  const shapes = [];
  const u = (v) => v * scale;
  const trunk = [[0, 0, 0], [1.6, 0.5, 5.5], [2.2, 0.7, 11], [0.4, 0, 16]].map(([dx, dy, dz]) => [x + u(dx), y + u(dy), z + u(dz)]);
  const all = [
    { dx: 7, dy: 2.5, dz: 6, r: 4.2 },
    { dx: -4.5, dy: 4, dz: 8.5, r: 3.8 },
    { dx: -2, dy: -5, dz: 11, r: 4.4 },
    { dx: 0.4, dy: 0, dz: 16.5, r: 5.4 },
  ];
  const pads = (padsN >= 4 ? all : [all[0], all[2], all[3]]).map((p) => ({ ...p, c: [x + u(p.dx), y + u(p.dy), z + u(p.dz)] }));
  const branches = pads.filter((p) => p.dz < 16).map((p) => {
    const zs = p.c[2] - u(1.6);
    const from = trunk[Math.max(0, trunk.findLastIndex((t, i) => i < trunk.length - 1 && t[2] <= zs))];
    const a0 = [from[0], from[1], zs];
    const a1 = [p.c[0], p.c[1], p.c[2] + u(0.6)];
    shapes.push(A.tube([a0, a1], u(0.3)));
    return k.segment(a0, a1, P);
  });
  out.push(wood(L(branches.join(""), { tone: "hi" })));
  const trunkDepth = depth(trunk[1]);
  const pad = (p) => {
    const r = u(p.r);
    const [px, py, pz] = p.c;
    shapes.push(A.cylinder(px, py, r, pz, u(1.3)), A.cylinder(px + u(0.3), py - u(0.2), r * 0.66, pz + u(1.3), u(1.1)));
    return pine(count(S(k.cylinder(px, py, r, pz, u(1.3), P, 13, 0.4), { tone: "hi", inner: L(k.sideArc(px, py, r, pz + u(0.65), P, 13), { tone: "faint" }) })) +
      count(S(k.cylinder(px + u(0.3), py - u(0.2), r * 0.66, pz + u(1.3), u(1.1), P, 10, 0), { tone: "hi" })));
  };
  const sorted = byDepth(pads, (p) => p.c);
  const behind = (p) => depth(p.c) < trunkDepth && p.dz < 16;
  for (const p of sorted) if (behind(p)) out.push(pad(p));
  for (let i = 0; i < trunk.length - 1; i++) {
    const [px, py, pz] = trunk[i];
    const h = trunk[i + 1][2] - pz + u(i === trunk.length - 2 ? 0.8 : 0.3);
    out.push(wood(cyl(px, py, u(1.25 - i * 0.2), pz, h, { tone: "hi" }, 10)));
    shapes.push(A.cylinder(px, py, u(1.25 - i * 0.2), pz, h));
  }
  for (const p of sorted) if (!behind(p)) out.push(pad(p));
  put(name, [x, y, z + u(8)], out.join(""), shapes);
}
function toro(x, y, z, s = 1.35, glowDelay = 0) {
  const out = [halo({ x: x - 4 * s, y: y - 4 * s, w: 8 * s, d: 8 * s, r: 4 * s }, z, 3)];
  const u = (v) => v * s;
  const shapes = [];
  out.push(cyl(x, y, u(3.2), z, u(1.4), { tone: "mid" }, 16, 0.3));
  out.push(cyl(x, y, u(1.1), z + u(1.4), u(5), { tone: "mid" }, 12));
  out.push(slab({ x: x - u(2.8), y: y - u(2.8), w: u(5.6), d: u(5.6), r: 0 }, z + u(6.4), u(1.1), { tone: "mid" }, 2, 0.3));
  shapes.push(A.cylinder(x, y, u(3.2), z, u(1.4)), A.cylinder(x, y, u(1.1), z + u(1.4), u(5)), Abox(x - u(2.8), x + u(2.8), y - u(2.8), y + u(2.8), z + u(6.4), z + u(7.5)));
  const fb = { x: x - u(1.9), y: y - u(1.9), w: u(3.8), d: u(3.8), r: 0 };
  const lights = [faceRect("x", x + u(1.9), y - u(0.9), y + u(0.9), z + u(8.1), z + u(9.9)), faceRect("y", y + u(1.9), x - u(0.9), x + u(0.9), z + u(8.1), z + u(9.9))].join("");
  const glow = pane(`<path d="${lights}" style="fill:var(--anatomy-dot);stroke:none"/>`);
  out.push(slab(fb, z + u(7.5), u(3), { tone: "mid", inner: glow + L(lights, { tone: "lo" }) }, 2));
  shapes.push(Abox(fb.x, fb.x + fb.w, fb.y, fb.y + fb.d, z + u(7.5), z + u(10.5)));
  const cap = roofOf(fb, u(1.6), z + u(10.5), { x: x - u(0.5), y: y - u(0.5), w: u(1), d: u(1) }, z + u(12.4), { lift: u(0.5), flare: u(0.4), fascia: u(0.5), n: 4 });
  out.push(count(S(cap, { tone: "mid" })));
  out.push(count(S(G.sphereOf([x, y, z + u(13.2)], u(0.9), P, { steps: 24 }), { tone: "mid" })));
  shapes.push(Abox(fb.x - u(1.6), fb.x + fb.w + u(1.6), fb.y - u(1.6), fb.y + fb.d + u(1.6), z + u(10.5), z + u(12.4)), A.ball([x, y, z + u(13.2)], u(0.9)));
  out.push(nightGlow([x, y, z + u(9)], u(7), u(6), glowDelay));
  put("toro", [x, y, z + u(6)], stone(out.join("")), shapes);
}
function nightGlow(p, rx, ry, delay = 0) {
  const [gx, gy] = at(p);
  return `<g class="banda-night banda-glow" style="animation-delay:-${delay.toFixed(1)}s">${pane(`<ellipse cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" rx="${(rx * P.scale).toFixed(1)}" ry="${(ry * P.scale).toFixed(1)}" style="fill:var(--anatomy-dot);stroke:none;opacity:.42;filter:blur(6px)"/>`)}</g>`;
}
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

// ---------- ground: halo, wooden plinth edge, moss (static, painted first) ----------
const STRIP_SHAPE = R.solid(A.slab(STRIP, -6, 6, { name: "stand.strip", piece: "", move: [0, 0, 0] }, 2));
function ground() {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(STRIP, -3), -6, 2, P)}"/>`];
  out.push(wood(slab(STRIP, -6, 4, { tone: "mid", inner: L(k.sideSeam(STRIP, -4, P, 2), { tone: "faint" }) }, 2, 0.6)));
  out.push(moss(slab(STRIP, -2, 2, { tone: "mid", crease: "faint" }, 2)));
  return out.join("");
}

// Raked gravel strip in front of the wall, with two raked lines along it.
function gravelStrip() {
  const rake = [7.6, 9.7, 11.8].map((y) => pathOf([at([X0, y, 0.3]), at([X1, y, 0.3])])).join("");
  put("gravel", [0, 9.7, 0.15], gravel(slab(GRAVEL, 0, 0.3, { tone: "lo", crease: "none", inner: L(rake, { tone: "faint" }) }, 2)), [A.slab(GRAVEL, 0, 0.3, {}, 2)]);
}

// Ishigaki: a battered stone base, coursed, with staggered joints between the course lines.
function ishigaki() {
  const yf = (z) => -1.4 - 1.6 * (z / Z.stone); // the battered front face
  const sec = [[-7.4, 0], [yf(0), 0], [yf(Z.stone), Z.stone], [-7.4, Z.stone]];
  const courses = [0, 2.4, 4.7, 7];
  const lines = [];
  for (const z of [2.4, 4.7]) lines.push(pathOf([at([X0, yf(z), z]), at([X1, yf(z), z])]));
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let c = 0; c < 3; c++) {
    const z0 = courses[c];
    const z1 = courses[c + 1];
    for (let x = X0 + 2 + rnd() * 4; x < X1 - 2; x += 4.5 + rnd() * 4.5) {
      const lean = (rnd() - 0.5) * 0.8;
      lines.push(pathOf([at([x, yf(z0), z0]), at([x + lean, yf(z1), z1])]));
    }
  }
  const svg = stone(count(S(prismX(sec, X0, X1), { tone: "mid", crease: "faint", inner: L(lines.join(""), { tone: "lo" }) })));
  put("wall.stone", [0, -4, 3], svg, [A.prism({ o: [0, 0, 0], a: [1, 0, 0], u: [0, 1, 0], v: [0, 0, 1] }, sec, X0, X1)]);
}

// Whitewashed wall with a timber skirting board, a top beam, and the tiled roof.
function wall() {
  const body = box(X0, X1, -6.6, -3.2);
  // Timber posts set into the plaster at a steady rhythm, drawn on the wall face.
  const posts = [];
  for (let x = X0 + 14; x < X1; x += 31) posts.push(faceRect("y", -3.2, x - 0.8, x + 0.8, Z.stone + 2.6, Z.wall - 0.4));
  const beamD = faceRect("y", -3.2, X0, X1, Z.wall - 1.6, Z.wall - 0.4);
  const face = wood(`<path d="${posts.join("")}${beamD}" style="fill:var(--anatomy-shade-2);stroke:none"/>`) + L(posts.join("") + beamD, { tone: "lo" });
  put("wall.plaster", [0, -4.9, 10.5], plaster(slab(body, Z.stone, Z.wall - Z.stone, { tone: "mid", inner: face }, 2)), [A.slab(body, Z.stone, Z.wall - Z.stone, {}, 2)]);
  const board = box(X0, X1, -3.2, -2.85);
  const boards = [];
  for (let x = X0 + 3; x < X1; x += 3.2) boards.push(pathOf([at([x, -2.85, Z.stone]), at([x, -2.85, Z.stone + 2.6])]));
  put("wall.board", [0, -3, Z.stone + 1.3], wood(slab(board, Z.stone, 2.6, { tone: "mid", inner: L(boards.join(""), { tone: "lo" }) }, 2)), [A.slab(board, Z.stone, 2.6, {}, 2)], 0.2);
  // Roof: a gable along x; eaves overhang both faces; tile rows run ridge to eave.
  const yF = -0.4;
  const yB = -9.4;
  const yR = -4.9;
  const zE = Z.eave;
  const zR = Z.ridge;
  const sec = [[yF, zE], [yF, zE + 0.8], [yR, zR], [yB, zE + 0.8], [yB, zE]];
  const rows = [];
  const ends = [];
  for (let x = X0 + 0.8; x < X1; x += 1.7) {
    rows.push(pathOf([at([x, yR + 0.25, zR - 0.17]), at([x, yF, zE + 0.8])]));
    ends.push(at([x + 0.85, yF, zE + 0.4]));
  }
  const ridge = [[yR - 0.8, zR - 0.6], [yR + 0.8, zR - 0.6], [yR + 0.6, zR + 0.9], [yR - 0.6, zR + 0.9]];
  const FX = { o: [0, 0, 0], a: [1, 0, 0], u: [0, 1, 0], v: [0, 0, 1] };
  put("wall.roof", [0, yR, zE + 2], ebony(count(S(prismX(sec, X0, X1), { tone: "hi", crease: "faint", inner: L(rows.join(""), { tone: "lo" }) })) + D(ends, { size: 0.55, tone: "mid" }) + count(S(prismX(ridge, X0, X1), { tone: "hi", crease: "faint" }))),
    [A.prism(FX, sec, X0, X1), A.prism(FX, ridge, X0, X1)], 0.3);
}

// Clipped hedges (karikomi) at the foot of the wall: two-tier pads like the pines' clouds.
function shrubs() {
  for (const [x, r] of [[-178, 3.3], [-60, 3.5], [-50.6, 2.6], [66, 3.3], [176, 3.1]]) {
    const y = -1.5 + r;
    const svg = halo({ x: x - r, y: y - r, w: 2 * r, d: 2 * r, r }, 0, 3) +
      pine(count(S(k.cylinder(x, y, r, 0, r * 0.62, P, 14, 0.3), { tone: "hi", inner: L(k.sideArc(x, y, r, r * 0.31, P, 14), { tone: "faint" }) })) +
        count(S(k.cylinder(x + 0.3, y - 0.2, r * 0.68, r * 0.62, r * 0.4, P, 12, 0.2), { tone: "hi" })));
    put("shrub", [x, y, r * 0.5], svg, [A.cylinder(x, y, r, 0, r * 0.62), A.cylinder(x + 0.3, y - 0.2, r * 0.68, r * 0.62, r * 0.4)]);
  }
}

// ---------- assemble ----------
for (const [x, y, s, n] of PINES) pineTree(x, y, 0, s, n);
shrubs();
ishigaki();
wall();
gravelStrip();
TORO_X.forEach((x, i) => toro(x, 9.7, 0.3, 1.25, i * 1.2));

A.settle(R, P);
R.items.sort((p, q) => p.key - q.key);
const body = minify([
  `<clipPath id="banda-clip"><rect width="${W}" height="${H}"/></clipPath>`,
  `<g clip-path="url(#banda-clip)">`,
  ground(),
  R.items.map((it) => it.svg).join(""),
  `</g>`,
].join(""));

function motionCss(s, theme) {
  const rules = [`@keyframes banda-glow{0%,100%{opacity:.45}50%{opacity:1}}`];
  const pulse = `.banda-glow{animation:banda-glow 3.6s cubic-bezier(.45,0,.55,1) infinite}`;
  if (theme === "light") rules.push(`${s} .banda-night{display:none}`);
  if (theme === "dark") rules.push(`${s} ${pulse}`);
  if (theme === "both") rules.push(`${s} .banda-night{display:none}`, `[data-theme="dark"] ${s} .banda-night{display:inline}`, `[data-theme="dark"] ${s} ${pulse}`);
  rules.push(`@media (prefers-reduced-motion:reduce){${s} .banda-glow{animation:none}}`);
  return rules.join("\n");
}

const LABEL = "A long garden wall: a battered stone base, a whitewashed wall with a small tiled roof, pines behind it and three stone lanterns on raked gravel in front.";
for (const theme of ["light", "dark"]) {
  const id = `banda-muro-${theme}`;
  const b = body.replace(/ id="([^"]+)"/g, ` id="$1-${theme[0]}"`).replace(/url\(#([^)]+)\)/g, `url(#$1-${theme[0]})`);
  const svg = a.assetSvg({ width: W, height: H, label: LABEL, body: b, paper: SITE[theme].paper, theme, accents: accentsFor(theme), weight: WEIGHT, id, css: motionCss(`#${id}`, theme) });
  writeFileSync(join(HERE, `${id}.svg`), svg);
  writeFileSync(join(HERE, `${id}.html`), a.previewHtml({ title: id, svg, paper: SITE[theme].paper, width: W }));
  console.log(`wrote ${id}.svg (${(svg.length / 1024).toFixed(0)} KB)`);
}
console.log(`solids: ${solids} · items: ${R.items.length} · scale ${P.scale.toFixed(3)}`);

const markup = reactMarkup({ scope: "iso-banda", prefix: "banda", body, accentsFor, weight: WEIGHT, css: [`.iso-banda{overflow:hidden}`, motionCss(".iso-banda", "both")].join("\n") });
const ts = `/**
 * Banda «Muro» (transición hero → «La ruta») — marcado SVG generado (no editar a mano).
 *
 * Generado con el kit de la skill anatomy-asset (hero/banda-muro/build.mjs en tools/art). Una sola geometría para los dos temas: el <style> va acotado a \`.iso-banda\` y la
 * variante oscura vive bajo [data-theme="dark"] .iso-banda. Los colores salen de los tokens de
 * src/styles/index.css (--paper, --ink, --gold, --brown, --green, --amber, --slate): --anatomy-paper usa
 * var(--paper) en vivo y las rampas de tono se derivan de esos hex al generar. Si cambia la
 * paleta, hay que regenerar este fichero.
 *
 * Clases, keyframes e ids van prefijados con \`banda-\`. La tira y el muro se salen del lienzo por
 * los dos lados y van recortados al viewBox, así que la banda sangra a todo el ancho.
 * Movimiento (solo CSS, parado con prefers-reduced-motion): de día ninguno; de noche los tres
 * tōrō se encienden y laten desfasados.
 */
export const BANDA_MURO_VIEWBOX = '0 0 ${W} ${H}'

export const BANDA_MURO_MARKUP = ${JSON.stringify(markup)}
`;
writeFileSync(join(OUT, "bandaMuro.markup.ts"), ts);
console.log(`wrote out/bandaMuro.markup.ts (markup ${(markup.length / 1024).toFixed(0)} KB)`);
writeFileSync(join(HERE, "meta.json"), JSON.stringify({ solids, markupKB: +(markup.length / 1024).toFixed(1) }));

A.auditOrExit(R, P);
