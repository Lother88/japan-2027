// Sagano — Arashiyama's bamboo grove (Wednesday 19 May, 7:00), as an isometric asset for the
// japan-2027 landing, on the same plinth, camera and scale as the day scenes (pilot: day 21).
// An earth path runs in a gentle S across the front of the plinth, between low shibagaki
// (brushwood panels with a split-bamboo rail and cap, tied with cord, between round posts).
// Behind it a dense wall of tall moso bamboo rises to the top of the canvas: green culms
// ringed by their nodes, twigs and drooping leaf sprays; a loose row stands in front of the
// path, with kumazasa clumps at its feet. A rickshaw waits on the path, black lacquer with a
// red blanket on the seat. Low morning sun slants through the canopy in soft shafts and falls
// in pale patches on the path.
// Size: culms, leaf sprays and fence bars are drawn with compact renderers (same tokens and
// light bands as the kit's solids) to keep the markup near the other days' budget.
// Motion (CSS only, stopped under prefers-reduced-motion): a few culms sway gently about their
// foot, out of phase, and the sun shafts and patches breathe.
//
//   node build.mjs   → sagano-light/dark .svg/.html, ../out/saganoIso.markup.ts

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  k, G, P, a, SITE, mix, baseAccents, PLINTH, S, L, ac, count, at, depth, W, H, WEIGHT,
  prism, prismFaces, slab, solid, plinth, stone, minify, swingInPlane, pathOf, solidCount,
} from "../common-d20-25.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const NAME = "sagano";

function accentsFor(theme) {
  const s = SITE[theme];
  const b = baseAccents(theme);
  const light = theme === "light";
  return {
    moss: b.moss,
    roof: b.roof,
    culm: light ? mix(mix(s.green, s.gold, 0.32), s.paper, 0.22) : mix(s.green, s.gold, 0.25),
    leaf: light ? mix(s.green, s.gold, 0.12) : mix(s.green, s.paper, 0.08),
    earth: light ? mix(s.brown, s.paper, 0.66) : mix(s.brown, s.ink, 0.38),
    brush: light ? mix(s.brown, s.ink, 0.12) : mix(s.brown, s.paper, 0.3),
    rail: light ? mix(s.gold, s.paper, 0.38) : mix(s.gold, s.paper, 0.25),
    blanket: s.coral2,
    sun: light ? mix(s.amber, s.paper, 0.6) : mix(s.amber, s.paper, 0.42),
    glow: light ? mix(s.amber, s.paper, 0.32) : mix(s.amber, s.paper, 0.25),
  };
}
const moss = ac("moss");
const culmAc = ac("culm");
const leafAc = ac("leaf");
const earth = ac("earth");
const brush = ac("brush");
const rail = ac("rail");
const roofAc = ac("roof");
const blanket = ac("blanket");
const glow = ac("glow");
const sunAc = ac("sun");

// ---------- tiny deterministic noise ----------
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const jit = (s) => (rnd() * 2 - 1) * s;

// ---------- world ----------
const Z0 = 3; // ground top
const GROUND = k.insetPlan(PLINTH, 3.5); // x −64.5..74.5, y −60.5..68.5
const ZP = Z0 + 0.5; // path top
const HALF = 8.5; // half-width of the path
const FOFF = HALF + 1.2; // fence line offset from the path's centre line
const FH = 4.6; // fence height
const TH = 1.1; // fence thickness

// The view direction on the ground (toward the viewer) and the light.
const V = G.viewOf(P);
const VH = [V[0], V[1]];
const VHn = [VH[0] / Math.hypot(...VH), VH[1] / Math.hypot(...VH)];
const LT = G.lightOf(P);

// The path's centre line runs across the plinth square to the view, from the front-left edge
// to the back-right edge, with a gentle S that swings toward the viewer and back.
const P0 = [4, GROUND.y + GROUND.d];
const P3 = [GROUND.x + GROUND.w, -30];
const AMP = 9;
const cAt = (t) => [0, 1].map((i) => P0[i] + (P3[i] - P0[i]) * t + VHn[i] * AMP * Math.sin(2 * Math.PI * t));
const cD = (t) => [0, 1].map((i) => P3[i] - P0[i] + VHn[i] * AMP * 2 * Math.PI * Math.cos(2 * Math.PI * t));
// Sampled a little past both edges, so the path and its fences run out under the clip.
const T0 = -0.1;
const T1 = 1.1;
const N_PATH = 36;
const tAt = (i) => T0 + ((T1 - T0) * i) / N_PATH;
const iAt = (t) => Math.round(((t - T0) / (T1 - T0)) * N_PATH);
const centre = Array.from({ length: N_PATH + 1 }, (_, i) => {
  const t = tAt(i);
  const p = cAt(t);
  const d = cD(t);
  const l = Math.hypot(d[0], d[1]);
  return { p, t: [d[0] / l, d[1] / l], n: [-d[1] / l, d[0] / l] }; // n points to the curve's left
});
const offsetLine = (off) => centre.map(({ p, n }) => [p[0] + n[0] * off, p[1] + n[1] * off]);
// Distance from a plan point to the centre line, and which side of it (+1 toward the viewer).
const fine = Array.from({ length: 401 }, (_, i) => cAt(T0 + ((T1 - T0) * i) / 400));
function nearPath(x, y) {
  let best = Infinity;
  let side = 0;
  for (const [px, py] of fine) {
    const d = Math.hypot(px - x, py - y);
    if (d < best) { best = d; side = Math.sign((x - px) * VH[0] + (y - py) * VH[1]); }
  }
  return { d: best, side };
}
const distToPath = (x, y) => nearPath(x, y).d;
const insideGround = (x, y, m) => x > GROUND.x + m && x < GROUND.x + GROUND.w - m && y > GROUND.y + m && y < GROUND.y + GROUND.d - m;
// Clip a plan polygon to the ground rectangle (Sutherland–Hodgman).
function clipToGround(poly) {
  const edges = [[0, GROUND.x, 1], [0, GROUND.x + GROUND.w, -1], [1, GROUND.y, 1], [1, GROUND.y + GROUND.d, -1]];
  let out = poly;
  for (const [ax, v, sg] of edges) {
    const inside = (p) => (p[ax] - v) * sg >= 0;
    const cut = (p, q) => { const t = (v - p[ax]) / (q[ax] - p[ax]); return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]; };
    const res = [];
    out.forEach((q, i) => {
      const p = out[(i + out.length - 1) % out.length];
      if (inside(q)) { if (!inside(p)) res.push(cut(p, q)); res.push(q); } else if (inside(p)) res.push(cut(p, q));
    });
    out = res;
  }
  return out;
}

// ---------- ground and path ----------
const ground = () => moss(slab(GROUND, 0, Z0, { tone: "mid", crease: "none" }, 6));

function pathSlab() {
  const left = offsetLine(HALF);
  const right = offsetLine(-HALF);
  const ring = clipToGround([...left, ...right.reverse()]);
  // Wheel ruts and a worn centre, as faint lines that run the length of the path.
  const ruts = [-3.4, 3.4].map((o) => k.onTop(offsetLine(o).filter(([x, y]) => insideGround(x, y, 0.8)), ZP, P)).join("");
  return earth(count(S(k.extrude(ring, Z0, ZP - Z0, P, { convex: false }), { tone: "mid", crease: "none", inner: L(ruts, { tone: "faint" }) })));
}

// Gravel on the path: a scatter of fine dots, thinning toward the edges.
function gravel() {
  const pts = [];
  for (let i = 0; i < 44; i++) {
    const c = centre[1 + Math.floor(rnd() * (N_PATH - 1))];
    const o = jit(HALF - 0.8);
    const along = jit(1.2);
    const gx = c.p[0] + c.n[0] * o + c.t[0] * along;
    const gy = c.p[1] + c.n[1] * o + c.t[1] * along;
    if (insideGround(gx, gy, 0.6)) pts.push(at([gx, gy, ZP]));
  }
  return earth(k.dotsSvg(pts, { size: 0.32, tone: "lo" }));
}

// Morning sun through the canopy: soft pale patches on the path, stretched along the light.
function sunPatches() {
  const out = [];
  const spots = [[0.1, 1.5, 3.2], [0.24, -2.6, 2.6], [0.36, 2.2, 3.2], [0.62, -1.2, 2.4], [0.72, 2.8, 3], [0.86, -2, 2.2]];
  const ld = G.unit3([LT[0], LT[1], 0]);
  spots.forEach(([t, o, r], i) => {
    const c = centre[iAt(t)];
    const cx = c.p[0] + c.n[0] * o;
    const cy = c.p[1] + c.n[1] * o;
    const ring = Array.from({ length: 18 }, (_, j) => {
      const th = (j / 18) * Math.PI * 2;
      const u = Math.cos(th) * r * 1.7;
      const v = Math.sin(th) * r * 0.75;
      return [cx + ld[0] * u - ld[1] * v, cy + ld[1] * u + ld[0] * v];
    });
    const d = k.onTop(ring, ZP + 0.02, P, true);
    out.push(a.amPulse(`<path class="iso-top" d="${d}"/>`, { period: 5200 + i * 700, delay: i * 1300, min: 0.35 }));
  });
  return sunAc(`<g opacity=".8">${out.join("")}</g>`);
}

// Shafts of low sun slanting through the canopy onto the path (the light comes from the same
// side the kit lights its faces from): soft quads that fade out toward the canopy.
function sunBeams() {
  const sun = G.unit3([LT[0] * 0.55, LT[1] * 0.55, 1]);
  const out = [];
  [[0.24, -2.6, 2.6, 58], [0.5, 1.5, 2.8, 64], [0.72, 2.8, 3, 50]].forEach(([t, o, r, rise], i) => {
    const c = centre[iAt(t)];
    const B = [c.p[0] + c.n[0] * o, c.p[1] + c.n[1] * o, ZP];
    const T = G.add3(B, G.mul3(sun, rise / sun[2]));
    const b = at(B);
    const tp = at(T);
    const dx = tp[0] - b[0];
    const dy = tp[1] - b[1];
    const l = Math.hypot(dx, dy);
    const px = -dy / l;
    const py = dx / l;
    const wb = r * 1.6;
    const wt = r * 0.9;
    const q = [[b[0] + px * wb, b[1] + py * wb], [b[0] - px * wb, b[1] - py * wb], [tp[0] - px * wt, tp[1] - py * wt], [tp[0] + px * wt, tp[1] + py * wt]];
    const id = `beam${i}`;
    out.push(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${tp[0].toFixed(1)}" y1="${tp[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}"><stop offset="0" style="stop-color:var(--anatomy-lit-top);stop-opacity:0"/><stop offset=".7" style="stop-color:var(--anatomy-lit-top);stop-opacity:.32"/><stop offset="1" style="stop-color:var(--anatomy-lit-top);stop-opacity:.5"/></linearGradient>`);
    out.push(a.amPulse(`<path d="${pathOf(q, true)}" fill="url(#${id})"/>`, { period: 7400 + i * 1100, delay: i * 2300, min: 0.45 }));
  });
  return glow(out.join(""));
}

// Convex bars (boxes in any frame) drawn compactly: each visible face in its light band, the
// creases between visible faces, and one silhouette per bar. Bars passed together must not
// overlap on screen (they share one solid's paths).
function bars(list, { tone = "hi", inner = "" } = {}) {
  const buckets = ["", "", "", "", ""];
  let outline = "";
  let crease = "";
  for (const faces of list) {
    const vis = [];
    for (const { pts, hint } of faces) {
      let n = [0, 0, 0];
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const q = pts[(i + 1) % pts.length];
        n = G.add3(n, [(p[1] - q[1]) * (p[2] + q[2]), (p[2] - q[2]) * (p[0] + q[0]), (p[0] - q[0]) * (p[1] + q[1])]);
      }
      n = G.unit3(n);
      if (G.dot3(n, hint) < 0) n = G.mul3(n, -1);
      if (G.dot3(n, V) > 1e-6) vis.push({ pts, n });
    }
    const key = (p) => p.map((v) => v.toFixed(3)).join(",");
    const seen = new Map();
    for (const f of vis) {
      buckets[G.bandOf(G.dot3(f.n, LT))] += pathOf(f.pts.map(at), true);
      f.pts.forEach((p, i) => {
        const q = f.pts[(i + 1) % f.pts.length];
        const id = [key(p), key(q)].sort().join("|");
        if (seen.has(id)) crease += pathOf([at(p), at(q)]);
        else seen.set(id, true);
      });
    }
    outline += pathOf(G.hullOf(vis.flatMap((f) => f.pts.map(at))), true);
  }
  count("");
  const parts = buckets.map((d, b) => (!d ? "" : b === 4 ? `<path class="iso-top" d="${d}"/>` : `<path class="iso-shade" data-shade="${b}" d="${d}"/>`)).join("");
  return `<g class="iso-solid">${parts}${crease ? L(crease, { tone: "faint" }) : ""}${inner}<path class="iso-line iso-edge" data-tone="${tone}" d="${outline}"/></g>`;
}

// ---------- the shibagaki ----------
// A frame for a vertical panel from plan point p along unit t, thickness along n.
const panelFrame = (p, t, n) => ({ o: [p[0], p[1], 0], u: [t[0], t[1], 0], v: [0, 0, 1], a: [n[0], n[1], 0] });

function fencePanel(p, q) {
  const dx = q[0] - p[0];
  const dy = q[1] - p[1];
  const l0 = Math.hypot(dx, dy);
  const t = [dx / l0, dy / l0];
  let n = [-t[1], t[0]];
  if (n[0] * VH[0] + n[1] * VH[1] < 0) n = [-n[0], -n[1]]; // the face we see
  const gap = 0.55; // room for the posts
  const s = [p[0] + t[0] * gap, p[1] + t[1] * gap];
  const l = l0 - 2 * gap;
  const F = panelFrame(s, t, n);
  const out = [];
  // Brushwood twigs on the face we see: close, slightly leaning strokes.
  const face = (u, z) => at([s[0] + t[0] * u + n[0] * (TH / 2), s[1] + t[1] * u + n[1] * (TH / 2), z]);
  const twigs = [];
  for (let u = 0.55; u < l - 0.3; u += 1.3 + rnd() * 0.45) {
    const lean = jit(0.28);
    const u1 = Math.min(l - 0.05, Math.max(0.05, u + lean));
    twigs.push(pathOf([face(u, Z0 + 0.15), face(u1, Z0 + FH - 0.1)]));
  }
  out.push(brush(bars([prismFaces([[0, Z0], [l, Z0], [l, Z0 + FH], [0, Z0 + FH]], F, -TH / 2, TH / 2)], { inner: L(twigs.join(""), { tone: "mid" }) })));
  // Two split-bamboo rails (oshibuchi) on the face we see, tied with black cord, and the
  // round-backed cap along the top: three bars that never overlap on screen, so one solid.
  const ties = [];
  const barList = [];
  for (const zr of [Z0 + 1.7]) {
    for (const u of [l * 0.25, l * 0.75]) {
      const f = (uu, z) => at([s[0] + t[0] * uu + n[0] * (TH / 2 + 0.5), s[1] + t[1] * uu + n[1] * (TH / 2 + 0.5), z]);
      ties.push(pathOf([f(u - 0.25, zr - 0.05), f(u + 0.25, zr + 0.75)]), pathOf([f(u + 0.25, zr - 0.05), f(u - 0.25, zr + 0.75)]));
    }
    barList.push(prismFaces([[0, zr], [l, zr], [l, zr + 0.7], [0, zr + 0.7]], F, TH / 2, TH / 2 + 0.5));
  }
  barList.push(prismFaces([[0, Z0 + FH], [l, Z0 + FH], [l, Z0 + FH + 0.55], [0, Z0 + FH + 0.55]], F, -TH / 2 - 0.3, TH / 2 + 0.3));
  out.push(rail(bars(barList, { inner: L(ties.join(""), { tone: "hi" }) })));
  return out.join("");
}

function post(x, y) {
  return roofAc(culmSvg(x, y, 0.62, Z0, Z0 + FH + 1.5, [Z0 + FH - 0.4], 2));
}

// Each fence line, clipped to the ground and cut into panels between posts.
function fenceItems(off) {
  // Densify before clipping, so each fence runs out to within a post of the plinth's edge.
  const raw = offsetLine(off);
  const dense = raw.flatMap((p, i) => (i === 0 ? [p] : Array.from({ length: 10 }, (_, j) => [raw[i - 1][0] + ((p[0] - raw[i - 1][0]) * (j + 1)) / 10, raw[i - 1][1] + ((p[1] - raw[i - 1][1]) * (j + 1)) / 10])));
  const line = dense.filter(([x, y]) => insideGround(x, y, 1.4));
  const pts = G.resample(line.map(([x, y]) => [x, y, 0]), 13).map(([x, y]) => [x, y]);
  const items = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p = pts[i];
    const q = pts[i + 1];
    items.push({ kind: "seg", p, q, h: FH + 1, svg: fencePanel(p, q) });
  }
  for (const [x, y] of pts) items.push({ kind: "pt", at: [x, y, 0], post: true, box: [[x, y, Z0], [x, y, Z0 + FH + 1.5]], r: 1, svg: post(x, y) });
  return items;
}

// ---------- bamboo ----------
// A spray of leaves: a fan of pointed blades joined at the base, in a drooping plane.
function spray(b, hdir, { droop = 0.5, spread = 0.95, fingers = 5, len = 4.6, w = 0.55, roll = 0 } = {}) {
  const d = G.unit3([hdir[0] * Math.cos(droop), hdir[1] * Math.cos(droop), -Math.sin(droop)]);
  let sd = G.unit3([-hdir[1], hdir[0], 0]);
  sd = G.unit3(G.add3(sd, [0, 0, roll]));
  let nrm = G.unit3(G.cross3(d, sd));
  if (G.dot3(nrm, V) < 0) nrm = G.mul3(nrm, -1);
  const pt2 = (u, v) => at(G.add3(b, G.add3(G.mul3(d, u), G.mul3(sd, v))));
  const poly = [pt2(0, 0)];
  const angs = Array.from({ length: fingers }, (_, i) => -spread + (2 * spread * i) / (fingers - 1));
  angs.forEach((f, i) => {
    const L1 = len * (0.8 + 0.35 * Math.cos(f * 1.3)) * (0.9 + rnd() * 0.2);
    const e = [Math.cos(f), Math.sin(f)];
    const g = [-Math.sin(f), Math.cos(f)];
    poly.push(pt2(e[0] * L1 * 0.42 - g[0] * w, e[1] * L1 * 0.42 - g[1] * w));
    poly.push(pt2(e[0] * L1, e[1] * L1));
    poly.push(pt2(e[0] * L1 * 0.42 + g[0] * w, e[1] * L1 * 0.42 + g[1] * w));
    if (i < fingers - 1) poly.push(pt2(0, 0));
  });
  const band = G.bandOf(G.dot3(nrm, LT));
  const centroid = G.add3(b, G.mul3(d, len * 0.5));
  return { depth: depth(centroid), svg: `<path class="${NAME}-l${band}" d="${pathOf(poly, true)}"/>` };
}

// A culm drawn compactly: the visible half of a vertical cylinder in three facets, each in
// its own light band (the kit's shading), the top ellipse, one outline and the node rings.
const FACING = Math.atan2(VH[1], VH[0]);
function culmSvg(x, y, r, z0, z1, nodeZs, NB = 3) {
  const pt = (ang, z) => at([x + r * Math.cos(ang), y + r * Math.sin(ang), z]);
  const angs = Array.from({ length: NB + 1 }, (_, i) => FACING - Math.PI / 2 + (i * Math.PI) / NB);
  const buckets = new Map();
  for (let i = 0; i < NB; i++) {
    const am = (angs[i] + angs[i + 1]) / 2;
    const band = G.bandOf(G.dot3([Math.cos(am), Math.sin(am), 0], LT));
    const d = pathOf([pt(angs[i], z0), pt(angs[i + 1], z0), pt(angs[i + 1], z1), pt(angs[i], z1)], true);
    buckets.set(band, (buckets.get(band) ?? "") + d);
  }
  const ell = Array.from({ length: 6 }, (_, i) => pt(FACING + (i / 6) * Math.PI * 2, z1));
  const parts = [];
  for (const [band, d] of [...buckets].sort((p, q) => p[0] - q[0])) {
    parts.push(band === 4 ? `<path class="iso-top" d="${d}"/>` : `<path class="iso-shade" data-shade="${band}" d="${d}"/>`);
  }
  const nodes = nodeZs.map((z) => pathOf([-0.44, -0.15, 0.15, 0.44].map((f) => pt(FACING + f * Math.PI, z)))).join("");
  if (nodes) parts.push(L(nodes, { tone: "mid" }));
  const outline = pathOf([pt(angs[0], z1), ...angs.map((g) => pt(g, z0)), pt(angs[NB], z1)]) + pathOf(ell, true);
  parts.push(`<path class="iso-line iso-edge" data-tone="hi" d="${outline}"/>`);
  count("");
  return `<g class="iso-solid">${parts.join("")}</g>`;
}

let swayCount = 0;
function bamboo(x, y, r, h, { sway = null } = {}) {
  const top = Z0 + h;
  // Nodes: a ring every 6–8 units, closer near the foot; a faint second ring for the ridge.
  const nodes = [];
  for (let z = Z0 + 3.5 + rnd() * 2; z < top - 2; z += 7.4 + (z - Z0) * 0.06 + rnd() * 0.8) nodes.push(z);
  const culm = culmAc(culmSvg(x, y, r, Z0, top, nodes));
  // Tip: a thin whip above the crown.
  const tip = culmAc(L(pathOf([at([x, y, top]), at([x + 0.6, y + 0.4, top + 4.5])]), { tone: "hi" }));
  // Crown: twigs from the upper nodes, each ending in a leaf spray; two sprays at the tip.
  const back = [];
  const front = [];
  const axisDepth = (z) => depth([x, y, z]);
  const nTw = 3;

  for (let i = 0; i < nTw; i++) {
    const zt = top - 3 - (i / nTw) * h * 0.32 - rnd() * 2;
    const th = rnd() * Math.PI * 2;
    const hd = [Math.cos(th), Math.sin(th)];
    const tl = 3.4 + rnd() * 3;
    const b0 = [x + hd[0] * r, y + hd[1] * r, zt];
    const b1 = [x + hd[0] * (r + tl), y + hd[1] * (r + tl), zt + tl * 0.45];
    const tw = pathOf([at(b0), at(b1)]);
    const sp = spray(b1, hd, { droop: 0.35 + rnd() * 0.5, fingers: 4, len: 7.4 + rnd() * 2, w: 1.05, spread: 0.85, roll: jit(0.6) });
    const ent = { depth: sp.depth, svg: sp.svg, twig: tw };
    (sp.depth < axisDepth(zt) ? back : front).push(ent);
  }
  for (const th of [rnd() * 6.28]) {
    const hd = [Math.cos(th), Math.sin(th)];
    const sp = spray([x, y, top + 1.2], hd, { droop: 0.75, fingers: 5, len: 6.4, w: 0.9, roll: jit(0.5) });
    (sp.depth < axisDepth(top) ? back : front).push(sp);
  }
  // Twigs under the leaves, then the sprays back to front.
  const leaves = (list) => (list.length ? leafAc(L(list.map((e) => e.twig ?? "").join(""), { tone: "mid" }) + `<g class="${NAME}-leaf">${list.sort((p, q) => p.depth - q.depth).map((e) => e.svg).join("")}</g>`) : "");
  const svg = leaves(back) + culm + tip + leaves(front);
  if (!sway) return svg;
  swayCount++;
  return swingInPlane(svg, [x, y, Z0], [sway.dir[0], sway.dir[1], 0], [0, 0, 1], { from: -sway.deg, to: sway.deg, period: sway.period, delay: sway.delay });
}

// Place the stand: a jittered grid, kept off the path and fences and inside the ground. The
// culms crowd the fences in a wall two or three deep and thin out toward the edges; thinner
// still in the two wedges that stand between the viewer and the path.
function stand(N, skip) {
  // Its own noise, so the stand does not move when other parts change.
  let sd = 2027;
  const r01 = () => ((sd = (sd * 48271) % 2147483647) / 2147483647);
  const cands = [];
  const STEP = 8;
  for (let gx = GROUND.x + 3; gx < GROUND.x + GROUND.w; gx += STEP) {
    for (let gy = GROUND.y + 3; gy < GROUND.y + GROUND.d; gy += STEP) {
      const x = gx + (r01() * 2 - 1) * 2.8;
      const y = gy + (r01() * 2 - 1) * 2.8;
      const r = 0.95 + r01() * 0.5;
      const keep = r01();
      if (!insideGround(x, y, 2.4 + r)) continue;
      const np = nearPath(x, y);
      const d = np.d - (FOFF + 2.4 + r);
      if (d < 0 || skip(x, y, np.side)) continue;
      // Behind the path: a dense wall, thinning toward the back. In front: one loose row.
      const p = np.side < 0 ? (d < 10 ? 0.9 : d < 24 ? 0.42 : 0.09) : d < 6 ? 0.6 : 0.1;
      cands.push({ x, y, r, rank: keep / p, front: np.side > 0 });
    }
  }
  const pick = (list, n) => list.sort((p, q) => p.rank - q.rank).slice(0, n).map(({ x, y, r }) => ({ x, y, r }));
  const nFront = Math.round(N * 0.24);
  return [...pick(cands.filter((c) => !c.front), N - nFront), ...pick(cands.filter((c) => c.front), nFront)];
}

function canopyLimit(x, y) {
  // The highest top that keeps the crown inside the canvas.
  const sy = at([x, y, Z0])[1];
  const unit = at([0, 0, 0])[1] - at([0, 0, 1])[1];
  return (sy - 7) / unit - 9;
}

// Kumazasa: a low clump of dwarf bamboo, its leaf sprays fanning up from the ground.
function sasa(x, y, s = 1) {
  const list = [];
  const n = 5;
  const a0 = rnd() * 6.28;
  for (let i = 0; i < n; i++) {
    const th = a0 + (i / n) * Math.PI * 2 + jit(0.3);
    const hd = [Math.cos(th), Math.sin(th)];
    list.push(spray([x + hd[0] * 0.4 * s, y + hd[1] * 0.4 * s, Z0 + 0.1], hd, { droop: -0.3 - rnd() * 0.3, fingers: 4, len: 3.4 * s * (0.85 + rnd() * 0.3), w: 0.65 * s, spread: 0.9, roll: 0.5 + jit(0.3) }));
  }
  return leafAc(`<g class="${NAME}-leaf">${list.sort((p, q) => p.depth - q.depth).map((e) => e.svg).join("")}</g>`);
}

// ---------- rickshaw ----------
// Built in its own frame: `o` is the axle's foot on the path, `h` the heading (the shafts point
// along +h), `sd` the axle direction. u runs along h, v along sd.
function rickshaw(o, h) {
  let sd = [-h[1], h[0]];
  const near = sd[0] * VH[0] + sd[1] * VH[1] > 0 ? 1 : -1; // which v the viewer sees
  const zg = ZP;
  const R = 3.3; // wheel radius
  const za = zg + R; // axle height
  const zs = za + 0.9; // seat underside
  const W3 = (u, v, z) => [o[0] + h[0] * u + sd[0] * v, o[1] + h[1] * u + sd[1] * v, z];
  const FR = { o: [o[0], o[1], 0], u: [h[0], h[1], 0], v: [0, 0, 1], a: [sd[0], sd[1], 0] };
  // An upright box in the frame: u0..u1 along h, v0..v1 along the axle, z0..z1.
  const box = (u0, u1, v0, v1, z0, z1) => prism([[u0, z0], [u1, z0], [u1, z1], [u0, z1]], FR, v0, v1);
  const out = [];
  const wheel = (v) => {
    const F = G.frameAlong(W3(0, v, za), [sd[0] * near, sd[1] * near, 0]);
    const lines = [G.circleOf(F, 0.32, R - 0.55, P, 28), G.circleOf(F, 0.32, 0.75, P, 12), G.spokesOf(F, 0.32, 0.75, R - 0.55, 12, P)].join("");
    return roofAc(solid(G.disc(-0.32, 0.32, R, F, P), { tone: "hi", inner: L(lines, { tone: "mid" }) }));
  };
  const shaft = (v) => roofAc(solid(prism([[1.6, zs - 0.2], [15, zg + 0.1], [15, zg + 0.75], [1.6, zs + 0.5]], FR, v - 0.28, v + 0.28), { tone: "hi" }));
  const sideParts = (v) => [wheel(v * 3.9), shaft(v * 3.15)];
  const [farW, farS] = sideParts(-near);
  const [nearW, nearS] = sideParts(near);
  out.push(farW, farS);
  // Body below the seat, the dashboard and the footboard; the crossbar at the shafts' ends.
  out.push(roofAc(solid(box(-1.8, 1.8, -2.9, 2.9, za - 1.3, zs), { tone: "hi" })));
  out.push(roofAc(solid(box(2.1, 5.4, -2.7, 2.7, zg + 1.8, zg + 2.25), { tone: "hi" })));
  out.push(roofAc(solid(box(1.9, 2.4, -2.8, 2.8, zg + 2.25, zs + 0.4), { tone: "hi" })));
  out.push(roofAc(solid(box(14.5, 15.2, -3.6, 3.6, zg + 0.1, zg + 0.7), { tone: "hi" })));
  // Seat cushion and backrest.
  out.push(roofAc(solid(box(-1.8, 2, -2.9, 2.9, zs, zs + 1.3), { tone: "hi" })));
  out.push(roofAc(solid(box(-2.4, -1.6, -2.9, 2.9, zs, zs + 4.6), { tone: "hi" })));
  // The red blanket, over the cushion and down the front edge.
  const bl = [[-1.4, zs + 1.3], [2.1, zs + 1.3], [2.25, zs - 2.2], [2.6, zs - 2.2], [2.45, zs + 1.7], [-1.4, zs + 1.7]];
  out.push(blanket(solid(prism(bl, FR, -2.5, 2.5), { tone: "hi" })));
  // The folding hood, raised over the seat: a shell whose ribs show as creases.
  const cu = -0.4;
  const cz = zs + 3.2;
  const outer = [];
  const inner = [];
  for (let i = 0; i <= 8; i++) {
    const th = (-12 + (i / 8) * 118) * (Math.PI / 180);
    outer.push([cu - 4.3 * Math.cos(th), cz + 4.3 * Math.sin(th)]);
    inner.push([cu - 3.85 * Math.cos(th), cz + 3.85 * Math.sin(th)]);
  }
  out.push(roofAc(solid(prism([...outer, ...inner.reverse()], FR, -3.15, 3.15), { tone: "hi", crease: "lo" })));
  out.push(nearS, nearW);
  const halo = `<path class="iso-halo" d="${k.onTop([[-5, -5], [6, -5], [16, -4], [16, 4], [6, 5], [-5, 5]].map(([u, v]) => W3(u, v, 0).slice(0, 2)), zg, P, true)}" style="filter:blur(3px)"/>`;
  return halo + out.join("");
}

// ---------- painter's order: a topological sort over overlapping items ----------
// Points (culms, posts, the rickshaw) sort by depth among themselves. A fence panel against a
// point uses the side of the panel's line the point is on, so whatever stands on the path is
// drawn between the far and the near fence.
function screenBox(pts) {
  const s = pts.map(at);
  return [Math.min(...s.map((p) => p[0])), Math.min(...s.map((p) => p[1])), Math.max(...s.map((p) => p[0])), Math.max(...s.map((p) => p[1]))];
}
function order(items) {
  for (const it of items) {
    if (it.kind === "seg") {
      it.mid = [(it.p[0] + it.q[0]) / 2, (it.p[1] + it.q[1]) / 2, 0];
      it.d = depth(it.mid);
      it.sb = screenBox([[...it.p, Z0], [...it.q, Z0], [...it.p, Z0 + it.h], [...it.q, Z0 + it.h]]);
    } else {
      it.d = depth([it.at[0], it.at[1], 0]);
      const rr = it.r ?? 1;
      it.sb = screenBox(it.box.flatMap(([x, y, z]) => [[x - rr, y - rr, z], [x + rr, y + rr, z], [x - rr, y + rr, z], [x + rr, y - rr, z]]));
    }
  }
  const overlap = (A, B) => A.sb[0] < B.sb[2] && B.sb[0] < A.sb[2] && A.sb[1] < B.sb[3] && B.sb[1] < A.sb[3];
  const before = (A, B) => {
    if (A.kind === "seg" && B.kind === "pt") return !ptInFrontOf(B, A) ? false : true;
    if (A.kind === "pt" && B.kind === "seg") return !ptInFrontOf(A, B);
    return A.d < B.d;
  };
  function ptInFrontOf(pt, seg) {
    const dx = seg.q[0] - seg.p[0];
    const dy = seg.q[1] - seg.p[1];
    const l = Math.hypot(dx, dy);
    const t = [dx / l, dy / l];
    let n = [-t[1], t[0]];
    if (n[0] * VH[0] + n[1] * VH[1] < 0) n = [-n[0], -n[1]];
    const rx = pt.at[0] - seg.p[0];
    const ry = pt.at[1] - seg.p[1];
    const along = rx * t[0] + ry * t[1];
    const side = rx * n[0] + ry * n[1];
    if (pt.post || Math.abs(side) < 0.8 || along < -3 || along > l + 3) return pt.d > seg.d;
    return side > 0;
  }
  const n = items.length;
  const succ = items.map(() => []);
  const indeg = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (!overlap(items[i], items[j])) continue;
      if (before(items[i], items[j])) { succ[i].push(j); indeg[j]++; } else { succ[j].push(i); indeg[i]++; }
    }
  }
  const done = new Array(n).fill(false);
  const out = [];
  let cycles = 0;
  for (let c = 0; c < n; c++) {
    let pick = -1;
    for (let i = 0; i < n; i++) if (!done[i] && indeg[i] === 0 && (pick < 0 || items[i].d < items[pick].d)) pick = i;
    if (pick < 0) {
      cycles++;
      for (let i = 0; i < n; i++) if (!done[i] && (pick < 0 || items[i].d < items[pick].d)) pick = i;
    }
    done[pick] = true;
    out.push(items[pick]);
    for (const j of succ[pick]) indeg[j]--;
  }
  if (cycles) console.log(`order: ${cycles} cycle(s) broken by depth`);
  return out;
}

// ---------- assemble ----------
const items = [];
items.push(...fenceItems(FOFF), ...fenceItems(-FOFF));

// The rickshaw, parked on the path, its shafts toward the right; no culm stands in front of it.
const RK = (() => {
  // Parked where the S turns over (the straightest stretch), a little toward the far fence,
  // heading along the chord from its axle to the shafts' ends.
  const ta = 0.45;
  const pa = cAt(ta);
  let tb = ta;
  while (Math.hypot(cAt(tb)[0] - pa[0], cAt(tb)[1] - pa[1]) < 15) tb += 0.001;
  const pb = cAt(tb);
  const l = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]);
  const h = [(pb[0] - pa[0]) / l, (pb[1] - pa[1]) / l];
  let n = [-h[1], h[0]];
  if (n[0] * VH[0] + n[1] * VH[1] > 0) n = [-n[0], -n[1]];
  const o = [pa[0] + n[0] * 1.8, pa[1] + n[1] * 1.8];
  const W3 = (u, z) => [o[0] + h[0] * u, o[1] + h[1] * u, z];
  const sx = [W3(-5, ZP), W3(15.5, ZP)].map((p) => at(p)[0]);
  return { o, h, W3, sx: [Math.min(...sx) - 6, Math.max(...sx) + 6] };
})();
items.push({ kind: "pt", at: [...RK.W3(5, 0).slice(0, 2), 0], r: 4, box: [RK.W3(-4.8, ZP), RK.W3(15.5, ZP), RK.W3(-1, ZP + 12)], svg: rickshaw(RK.o, RK.h) });

const culms = stand(40, (x, y, side) => side > 0 && at([x, y, Z0])[0] > RK.sx[0] && at([x, y, Z0])[0] < RK.sx[1]);
const halos = [];
// Sway: a handful of culms spread across the stand, out of phase.
const swaySet = new Set();
{
  const pick = [...culms.keys()].filter((i) => i % 7 === 3);
  pick.forEach((i) => swaySet.add(i));
}
culms.forEach(({ x, y, r }, i) => {
  const lim = canopyLimit(x, y);
  const h = Math.max(30, Math.min(64 + rnd() * 34, lim - rnd() * 10));
  halos.push(k.onTop(k.circleRing(x, y, r * 2.2, 8), Z0, P, true));
  const sway = swaySet.has(i) ? { dir: [Math.cos(i), Math.sin(i)], deg: 1.1 + (i % 3) * 0.25, period: 6200 + (i % 5) * 900, delay: i * 730 } : null;
  items.push({ kind: "pt", at: [x, y, 0], r: 8, box: [[x, y, Z0], [x, y, Z0 + h + 6]], svg: bamboo(x, y, r, h, { sway }) });
});


// Sasa along the outer foot of both fences and a few out in the open, clear of the culms.
{
  let placed = 0;
  for (let tries = 0; tries < 400 && placed < 8; tries++) {
    const c = centre[2 + Math.floor(rnd() * (N_PATH - 3))];
    const front = rnd() < 0.6;
    const sg = Math.sign(c.n[0] * VH[0] + c.n[1] * VH[1]) * (front ? 1 : -1);
    const off = FOFF + 2.4 + rnd() * (front ? 14 : 4);
    const x = c.p[0] + c.n[0] * off * sg;
    const y = c.p[1] + c.n[1] * off * sg;
    if (!insideGround(x, y, 3) || distToPath(x, y) < FOFF + 2) continue;
    if (culms.some((q) => Math.hypot(q.x - x, q.y - y) < 3.2)) continue;
    if (front && at([x, y, Z0])[0] > RK.sx[0] && at([x, y, Z0])[0] < RK.sx[1] && off < FOFF + 7) continue;
    const sc = 0.9 + rnd() * 0.5;
    items.push({ kind: "pt", at: [x, y, 0], r: 3.5 * sc, box: [[x, y, Z0], [x, y, Z0 + 3 * sc]], svg: sasa(x, y, sc) });
    placed++;
  }
}

const stones = [[60, 40, 1.8, 1.4], [-30, 34, 2.2, 1.6], [30, -12, 1.6, 1.2], [-50, -10, 2, 1.5]]
  .filter(([x, y]) => distToPath(x, y) > FOFF + 2)
  .map(([x, y, r, h], i) => stone(x, y, r, h, Z0, i + 3)).join("");

const body = minify([
  plinth(),
  ground(),
  pathSlab(),
  gravel(),
  sunPatches(),
  `<path class="iso-halo" d="${halos.join("")}" style="filter:blur(2.5px)"/>`,
  stones,
  ...order(items).map((i) => i.svg),
  sunBeams(),
].join(""));

// ---------- ship: standalone SVGs + previews + the scoped TS markup ----------
// The same shape as common-d20-25's emit(), scoped to `.iso-sagano` and prefixed `sagano-`.
const SUBJECT = "Sendero del bosque de bambú de Sagano, en Arashiyama";
const LABEL = "The Sagano bamboo grove in Arashiyama in isometric view: an earth path curving between low brushwood fences through a dense stand of tall bamboo, morning sun falling in patches on the path, a rickshaw waiting.";
const TOKENS_NOTE = "--paper, --green, --gold, --brown, --amber, --coral2, --ink";
const MOTION_NOTE = "Movimiento ambiental solo CSS: unas cañas se mecen despacio desde el pie (desfasadas) y los haces y las manchas de sol del sendero respiran; todo se detiene con prefers-reduced-motion.";

// Leaf sprays: one closed path each, filled in its light band and outlined in the leaf ramp.
const leafCss = (scope) => [
  `${scope} .${NAME}-leaf path{stroke:var(--anatomy-mid);stroke-width:var(--anatomy-weight);stroke-linejoin:round;vector-effect:non-scaling-stroke;fill:var(--anatomy-shade-0)}`,
  `${scope} .${NAME}-leaf .${NAME}-l1{fill:var(--anatomy-shade-1)}`,
  `${scope} .${NAME}-leaf .${NAME}-l2{fill:var(--anatomy-shade-2)}`,
  `${scope} .${NAME}-leaf .${NAME}-l3{fill:var(--anatomy-shade-3)}`,
  `${scope} .${NAME}-leaf .${NAME}-l4{fill:var(--anatomy-top)}`,
].join("\n");

for (const theme of ["light", "dark"]) {
  const name = `${NAME}-${theme}`;
  const svg = a.assetSvg({ width: W, height: H, label: LABEL, body, paper: SITE[theme].paper, theme, accents: accentsFor(theme), weight: WEIGHT, id: name, css: leafCss(`#${name}`) });
  writeFileSync(join(HERE, `${name}.svg`), svg);
  writeFileSync(join(HERE, `${name}.html`), a.previewHtml({ title: name, svg, paper: SITE[theme].paper, width: W * 2 }));
  console.log(`wrote ${name}.svg (${(svg.length / 1024).toFixed(0)} KB)`);
}
console.log(`solids: ${solidCount()}, culms: ${culms.length}, swaying: ${swayCount}`);

const scope = `.iso-${NAME}`;
const pre = `${NAME}-`;
const drawing = k.ISO_CSS.split("\n")
  .filter((line) => /^\.(iso-svg|iso-fill|iso-solid|iso-shade|iso-top|iso-halo|iso-line|iso-dots|tb-)/.test(line))
  .filter((line) => !/data-flow|data-pulse|iso-flow|iso-pulse/.test(line));
const scoped = drawing.map((line) => line.replace(/^([^{]+)\{/, (_, sel) => `${sel.split(",").map((s) => `${scope} ${s.trim().replace(/^\.iso-svg /, "")}`).join(",")}{`)).join("\n");
const tokens = (theme) => {
  const g = a.groundTokens(SITE[theme].paper, { theme });
  delete g.card; delete g.page;
  g.paper = "var(--paper)";
  const extra = theme === "light" ? { lit: "#000000", "halo-opacity": ".32" } : { lit: "#ffffff", "halo-opacity": ".9" };
  return Object.entries({ ...g, ...extra, weight: `${WEIGHT}px` }).map(([n, v]) => `--anatomy-${n}:${v}`).join(";");
};
const MOTION = {
  pulse: { kf: "{0%,100%{opacity:var(--am-min,.35)}50%{opacity:1}}", rule: "animation:K var(--am-period,3.2s) cubic-bezier(.45,0,.55,1) var(--am-delay,0s) infinite" },
  swing: { kf: "{0%,100%{transform:rotate(var(--am-a0,-10deg))}50%{transform:rotate(var(--am-a1,10deg))}}", rule: "transform-box:view-box;transform-origin:0 0;animation:K var(--am-period,3s) cubic-bezier(.45,0,.55,1) var(--am-delay,0s) infinite" },
};
const used = Object.keys(MOTION).filter((m) => body.includes(`class="am-${m}"`));
const motionCss = used.flatMap((m) => {
  const K = `${pre}${m}`;
  return [`@keyframes ${K}${MOTION[m].kf}`, `${scope} .${K}{${MOTION[m].rule.replace("K", K)}}`];
});
const css = [
  `${scope}{${tokens("light")}}`,
  `[data-theme="dark"] ${scope}{${tokens("dark")}}`,
  a.accentCss(accentsFor("light"), { scope, theme: "light" }),
  a.accentCss(accentsFor("dark"), { scope: `[data-theme="dark"] ${scope}`, theme: "dark" }),
  scoped,
  leafCss(scope),
  ...motionCss,
  used.length ? `@media (prefers-reduced-motion:reduce){${used.map((m) => `${scope} .${pre}${m}`).join(",")}{animation:none}}` : "",
].filter(Boolean).join("\n").replace(/--am-/g, `--${pre}`);
const ids = new Set([...body.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
const fix = (id) => (ids.has(id) && !id.startsWith(pre) ? pre + id : id);
const art = body
  .replace(/class="am-(pulse|swing)"/g, (_, m) => `class="${pre}${m}"`)
  .replace(/--am-/g, `--${pre}`)
  .replace(/\bid="([^"]+)"/g, (_, id) => `id="${fix(id)}"`)
  .replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${fix(id)})`)
  .replace(/href="#([^"]+)"/g, (_, id) => `href="#${fix(id)}"`);
const markup = `<style>${css}</style><g data-art="">${art}</g>`;
if (/(?<![\w-])am-|iso-flow|iso-pulse/.test(markup)) throw new Error("kit motion names leaked into the TS markup");
const ts = `/**
 * ${SUBJECT} isométrico (miércoles 19 de mayo) — marcado SVG generado (no editar a mano).
 *
 * Generado con el kit de la skill anatomy-asset (iso/${NAME}/build.mjs en tools/art), con el mismo plinto, cámara y escala que el piloto del día 21 (Kinkaku-ji).
 * Los colores salen de los tokens de src/styles/index.css (${TOKENS_NOTE}) para tema claro y oscuro:
 * --anatomy-paper usa var(--paper) en vivo y las rampas de tono se derivan de esos hex al
 * generar. Todo el CSS está acotado a \`${scope}\`${used.length ? ` y la animación usa ${used.map((m) => `\`@keyframes ${pre}${m}\``).join(", ")} (parada con prefers-reduced-motion)` : ""}.
 * ${MOTION_NOTE}
 * Si cambia la paleta, hay que regenerar este fichero.
 */
export const SAGANO_ISO_VIEWBOX = '0 0 ${W} ${H}'

export const SAGANO_ISO_SUBJECT = '${SUBJECT}'

export const SAGANO_ISO_MARKUP = ${JSON.stringify(markup)}
`;
const OUT = join(HERE, "..", "out");
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, `${NAME}Iso.markup.ts`), ts);
console.log(`wrote out/${NAME}Iso.markup.ts (${(ts.length / 1024).toFixed(1)} KB)`);
