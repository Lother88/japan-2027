// Shared helpers for the day 09/10/11/12/26 isometric assets of the japan-2027 landing.
// Copied from the approved day-21 pilot (kinkakuji/build.mjs): site palette, polySolid,
// roofOf, courses, face helpers, garden parts, the lossless path minifier, and an `emit`
// that writes the standalone SVG + preview pages and the scoped TS markup module.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const SKILL = ((process.env.ANATOMY_ASSET_DIR ?? `${process.env.USERPROFILE ?? process.env.HOME}/.claude/skills/anatomy-asset`).replace(/[\\/]?$/, "/"));
export const k = await import(pathToFileURL(SKILL + "kit/iso-kit.mjs").href);
export const a = await import(pathToFileURL(SKILL + "kit/asset.mjs").href);
export const G = await import(pathToFileURL(SKILL + "kit/lathe.mjs").href);

export const W = 440;
export const H = 330;
export const WEIGHT = 0.7;

// ---------- site palette (src/styles/index.css, light ~11–15, dark ~25–29) ----------
export const SITE = {
  light: { paper: "#fbf6f0", ink: "#1b2a4a", gold: "#b08534", amber: "#b48a35", coral: "#c24a5a", coral2: "#e0564b", brown: "#8a5a3b", green: "#3f6f5f" },
  dark: { paper: "#12141b", ink: "#f1ece1", gold: "#d9a948", amber: "#e2a743", coral: "#ff7a6f", coral2: "#ff6f62", brown: "#c89a6a", green: "#76b89a" },
};
export const mix = (x, y, t) => {
  const p = a.hexToRgb(x);
  const q = a.hexToRgb(y);
  return `#${p.map((v, i) => Math.round((v * (1 - t) + q[i] * t) * 255).toString(16).padStart(2, "0")).join("")}`;
};
// The pilot's shared material ramps, so the set reads as one.
export function baseAccents(theme) {
  const s = SITE[theme];
  const shadow = theme === "light" ? s.ink : s.paper;
  return {
    roof: mix(s.brown, shadow, theme === "light" ? 0.42 : 0.45),
    wood: s.brown,
    pine: s.green,
    water: mix(s.green, s.paper, theme === "light" ? 0.62 : 0.5),
    moss: mix(s.green, s.paper, theme === "light" ? 0.4 : 0.25),
    ripple: { hex: s.green, mode: "ink" },
    plaster: theme === "light" ? s.paper : s.ink,
    // dressed stone / granite: pale warm grey in light, a mid warm grey in dark
    stone: theme === "light" ? mix(s.brown, s.paper, 0.8) : mix(mix(s.brown, s.ink, 0.35), s.paper, 0.45),
  };
}

// The same plinth and camera for every day, so the 21 dioramas sit at one scale.
export const PLINTH = { x: -68, y: -64, w: 146, d: 136, r: 8 };
export const FIT_TOP = [-28, -17, 103];

export function fitOf(extra = []) {
  return a.fitInto([...k.boxCorners(PLINTH, -10, 4), FIT_TOP, [-58, -53, 26], [2, 19, 26], ...extra], { x: 0, y: 0, w: W, h: H }, { pad: 6, azimuth: 40 });
}

// ---------- drawing helpers bound to one projection ----------
export function kitFor(P) {
  const at = (p) => k.iso(p, P);
  const S = (paths, style) => k.solidSvg(paths, style);
  const L = (d, style) => k.lineSvg(d, style);
  const ac = (name) => (svg) => `<g class="ac-${name}">${svg}</g>`;
  const depth = (p) => k.depthOf([p[0], p[1], p[2] ?? 0], P);
  const byDepth = (items, key = (i) => i) => [...items].sort((p, q) => depth(key(p)) - depth(key(q)));
  const pathOf = (pts, closed) => k.pathOf(pts, closed);
  const counter = { n: 0 };
  const count = (svg) => { counter.n++; return svg; };

  function polySolid(faces, { creaseCos = 0.97 } = {}) {
    const V = G.viewOf(P);
    const Lt = G.lightOf(P);
    const info = [];
    for (const { pts, hint, group } of faces) {
      let n = [0, 0, 0];
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const q = pts[(i + 1) % pts.length];
        n[0] += (p[1] - q[1]) * (p[2] + q[2]);
        n[1] += (p[2] - q[2]) * (p[0] + q[0]);
        n[2] += (p[0] - q[0]) * (p[1] + q[1]);
      }
      if (G.len3(n) < 1e-9) continue;
      n = G.unit3(n);
      if (G.dot3(n, hint) < 0) n = G.mul3(n, -1);
      info.push({ pts, n, group, vis: G.dot3(n, V) > 1e-6 });
    }
    const groups = new Map();
    for (const f of info) if (f.group) groups.set(f.group, G.add3(groups.get(f.group) ?? [0, 0, 0], f.n));
    for (const f of info) if (f.group) f.vis = G.dot3(groups.get(f.group), V) > 1e-6;
    const key = (p) => p.map((v) => v.toFixed(3)).join(",");
    const edges = new Map();
    info.forEach((f, fi) => {
      for (let i = 0; i < f.pts.length; i++) {
        const p = f.pts[i];
        const q = f.pts[(i + 1) % f.pts.length];
        const kp = key(p);
        const kq = key(q);
        if (kp === kq) continue;
        const id = kp < kq ? `${kp}|${kq}` : `${kq}|${kp}`;
        if (!edges.has(id)) edges.set(id, { p, q, faces: [] });
        edges.get(id).faces.push(fi);
      }
    });
    const outline = [];
    const crease = [];
    for (const { p, q, faces: fs } of edges.values()) {
      const vis = fs.map((fi) => info[fi].vis);
      const seg = pathOf([at(p), at(q)]);
      if (fs.length === 1) { if (vis[0]) outline.push(seg); continue; }
      if (vis[0] !== vis[1]) outline.push(seg);
      else if (vis[0] && G.dot3(info[fs[0]].n, info[fs[1]].n) < creaseCos) crease.push(seg);
    }
    const area = (pp) => pp.reduce((s, p, i) => { const q = pp[(i + 1) % pp.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);
    const buckets = [[], [], [], [], []];
    const fill = [];
    for (const f of info) {
      if (!f.vis) continue;
      let pp = f.pts.map(at);
      if (area(pp) < 0) pp = pp.reverse();
      const d = pathOf(pp, true);
      fill.push(d);
      buckets[G.bandOf(G.dot3(f.n, Lt))].push(d);
    }
    return { fill: fill.join(""), outline: outline.join(""), crease: crease.join(""), top: buckets[4].join(""), shades: buckets.slice(0, 4).map((b) => b.join("")) };
  }

  function rectRing(plan, z, n, { lift = 0, flare = 0 } = {}) {
    const cs = [[plan.x, plan.y], [plan.x + plan.w, plan.y], [plan.x + plan.w, plan.y + plan.d], [plan.x, plan.y + plan.d]];
    const outs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    const pts = [];
    for (let s = 0; s < 4; s++) {
      const A = cs[s];
      const B = cs[(s + 1) % 4];
      for (let i = 0; i < n; i++) {
        const t = i / n;
        const w = Math.abs(2 * t - 1) ** 4;
        let x = A[0] + (B[0] - A[0]) * t;
        let y = A[1] + (B[1] - A[1]) * t;
        if (i === 0) {
          const prev = outs[(s + 3) % 4];
          x += (prev[0] + outs[s][0]) * flare;
          y += (prev[1] + outs[s][1]) * flare;
        } else {
          x += outs[s][0] * flare * w;
          y += outs[s][1] * flare * w;
        }
        pts.push([x, y, z + lift * w]);
      }
    }
    return pts;
  }

  const grow = (plan, by) => k.insetPlan(plan, -by);

  function roofOf(wall, overhang, zEave, inner, zIn, { lift = 3, flare = 2, fascia = 1.6, n = 8 } = {}) {
    const eave = grow(wall, overhang);
    const A = rectRing(eave, zEave, n, { lift, flare });
    const B = rectRing(eave, zEave + fascia, n, { lift, flare });
    const C = rectRing(inner, zIn, n);
    const Dr = rectRing(wall, zEave, n);
    const N = A.length;
    const faces = [];
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N;
      const mid = [(A[i][0] + A[j][0]) / 2 - (wall.x + wall.w / 2), (A[i][1] + A[j][1]) / 2 - (wall.y + wall.d / 2), 0];
      const side = Math.floor(i / n);
      faces.push({ pts: [A[i], A[j], B[j], B[i]], hint: mid, group: `fascia${side}` });
      faces.push({ pts: [B[i], B[j], C[j], C[i]], hint: [mid[0] * 0.02, mid[1] * 0.02, 1], group: `slope${side}` });
      faces.push({ pts: [A[i], A[j], Dr[j], Dr[i]], hint: [0, 0, -1] });
    }
    faces.push({ pts: C, hint: [0, 0, 1] });
    faces.push({ pts: Dr, hint: [0, 0, -1] });
    return { paths: polySolid(faces), A, B, C, n, eave };
  }

  function courses(roof, ts) {
    const { B, C, n } = roof;
    const V = G.viewOf(P);
    const out = [];
    for (let s = 0; s < 4; s++) {
      const idx = Array.from({ length: n + 1 }, (_, i) => (s * n + i) % B.length);
      const m = idx[n >> 1];
      const m2 = idx[(n >> 1) + 1];
      const nrm = G.cross3(G.sub3(B[m2], B[m]), G.sub3(C[m], B[m]));
      const up = nrm[2] < 0 ? G.mul3(nrm, -1) : nrm;
      if (G.dot3(up, V) <= 0) continue;
      for (const t of ts) out.push(pathOf(idx.map((i) => at(G.lerp3(B[i], C[i], t)))));
    }
    return out.join("");
  }

  // A battered box (ishigaki, a plinth with sloping sides): plan `base` at z0 up to `top` at z1.
  function frustum(base, z0, top, z1) {
    const A = rectRing(base, z0, 1);
    const B = rectRing(top, z1, 1);
    const cx = base.x + base.w / 2;
    const cy = base.y + base.d / 2;
    const faces = [];
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      faces.push({ pts: [A[i], A[j], B[j], B[i]], hint: [(A[i][0] + A[j][0]) / 2 - cx, (A[i][1] + A[j][1]) / 2 - cy, 0] });
    }
    faces.push({ pts: B, hint: [0, 0, 1] });
    faces.push({ pts: A, hint: [0, 0, -1] });
    return polySolid(faces);
  }

  // A square bar from p0 to p1 (a shaft, a strut, a pole that leans): half-width w, half-height h.
  function bar(p0, p1, w, h = w) {
    const d = G.unit3(G.sub3(p1, p0));
    let u = G.cross3(d, [0, 0, 1]);
    if (G.len3(u) < 1e-6) u = [1, 0, 0];
    u = G.unit3(u);
    const v = G.unit3(G.cross3(u, d));
    const ring = (p) => [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([a1, b1]) => G.add3(p, G.add3(G.mul3(u, a1 * w), G.mul3(v, b1 * h))));
    const A = ring(p0);
    const B = ring(p1);
    const faces = [];
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      const mid = G.mul3(G.add3(A[i], A[j]), 0.5);
      faces.push({ pts: [A[i], A[j], B[j], B[i]], hint: G.sub3(mid, p0) });
    }
    faces.push({ pts: A, hint: G.mul3(d, -1) });
    faces.push({ pts: B, hint: d });
    return polySolid(faces);
  }

  // face "x": the plane x = c (u runs along y); face "y": the plane y = c (u runs along x).
  const fp = (face, c, u, z) => at(face === "x" ? [c, u, z] : [u, c, z]);
  const faceLine = (face, c, u0, z0, u1, z1) => pathOf([fp(face, c, u0, z0), fp(face, c, u1, z1)]);
  const faceRect = (face, c, u0, u1, z0, z1) => pathOf([[u0, z0], [u1, z0], [u1, z1], [u0, z1]].map(([u, z]) => fp(face, c, u, z)), true);
  const facePoly = (face, c, pts) => pathOf(pts.map(([u, z]) => fp(face, c, u, z)), true);

  const slab = (plan, z, h, opts = {}, steps = 2, bevel = 0) => count(S(k.slabOf(plan, z, h, P, steps, bevel), opts));
  const box = (x, y, w, d, z, h, opts = {}, bevel = 0) => slab({ x, y, w, d, r: 0 }, z, h, opts, 2, bevel);
  const cyl = (x, y, r, z, h, opts = {}, steps = 20, bevel = 0) => count(S(k.cylinder(x, y, r, z, h, P, steps, bevel), opts));
  const halo = (plan, z, h = 0.1, blur = 0) => `<path class="iso-halo" d="${k.haloOf(plan, z, h, P)}"${blur ? ` style="filter:blur(${blur}px)"` : ""}/>`;

  function plinth() {
    const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(PLINTH, -4), -10, 4, P)}"/>`];
    out.push(slab(PLINTH, -10, 10, { tone: "mid", inner: L(k.sideSeam(PLINTH, -4, P, 6), { tone: "faint" }) }, 6, 0));
    return out.join("");
  }

  function stone(cx, cy, r, h, z, seed, tone = "mid") {
    const ring = [];
    const m = 7;
    for (let i = 0; i < m; i++) {
      const t = (i / m) * Math.PI * 2;
      const rr = r * (0.78 + 0.22 * Math.abs(Math.sin(seed * 3.1 + i * 1.7)));
      ring.push([cx + Math.cos(t) * rr * 1.15, cy + Math.sin(t) * rr]);
    }
    return count(S(k.extrude(G.hullOf(ring), z, h, P, { bevel: 0.4 }), { tone }));
  }

  // A cloud-pruned black pine (from the pilot): leaning trunk, branches, flat needle pads.
  function pineTree(x, y, z, scale = 1, { wood = ac("wood"), pine = ac("pine"), lite = false } = {}) {
    const [s1, s2] = lite ? [14, 10] : [18, 14];
    const out = [];
    const u = (v) => v * scale;
    out.push(`<path class="iso-halo" d="${k.haloOf({ x: x - u(8), y: y - u(8), w: u(16), d: u(16), r: u(8) }, z, 0.1, P)}" style="filter:blur(4px)"/>`);
    const trunk = [[0, 0, 0], [1.2, 0.4, 4], [2.4, 0.8, 8], [1.6, 0.4, 12], [0.4, 0, 16]].map(([dx, dy, dz]) => [x + u(dx), y + u(dy), z + u(dz)]);
    const pads = [
      { dx: 7, dy: 2.5, dz: 6, r: 4.2 },
      { dx: -4.5, dy: 4, dz: 8.5, r: 3.8 },
      { dx: -2, dy: -5, dz: 11, r: 4.4 },
      { dx: 6, dy: -3, dz: 12.5, r: 3.6 },
      { dx: 0.4, dy: 0, dz: 16.5, r: 5.4 },
    ].map((p) => ({ ...p, c: [x + u(p.dx), y + u(p.dy), z + u(p.dz)] }));
    const branches = pads.slice(0, 4).map((p) => {
      const from = trunk[Math.min(3, Math.round(p.dz / 4))];
      return k.segment([from[0], from[1], p.c[2] - u(1.6)], [p.c[0], p.c[1], p.c[2] + u(0.6)], P);
    });
    out.push(wood(L(branches.join(""), { tone: "hi" })));
    const trunkDepth = depth(trunk[2]);
    const pad = (p) => {
      const r = u(p.r);
      const [px, py, pz] = p.c;
      return pine(count(S(k.cylinder(px, py, r, pz, u(1.3), P, s1, 0.4), { tone: "hi", inner: L(k.sideArc(px, py, r, pz + u(0.65), P, s1), { tone: "faint" }) })) +
        count(S(k.cylinder(px + u(0.3), py - u(0.2), r * 0.66, pz + u(1.3), u(1.1), P, s2, 0.3), { tone: "hi" })));
    };
    const sorted = byDepth(pads, (p) => p.c);
    for (const p of sorted) if (depth(p.c) < trunkDepth && p.dz < 16) out.push(pad(p));
    for (let i = 0; i < trunk.length - 1; i++) {
      const [px, py, pz] = trunk[i];
      out.push(wood(cyl(px, py, u(1.25 - i * 0.15), pz, trunk[i + 1][2] - pz + u(0.3), { tone: "hi" }, 12)));
    }
    for (const p of sorted) if (!(depth(p.c) < trunkDepth && p.dz < 16)) out.push(pad(p));
    return out.join("");
  }

  // A rounded broadleaf tree (zelkova, cherry in leaf): trunk and two or three stacked crowns.
  function roundTree(x, y, z, scale = 1, { wood = ac("wood"), leaf = ac("pine") } = {}) {
    const u = (v) => v * scale;
    const out = [halo({ x: x - u(6), y: y - u(6), w: u(12), d: u(12), r: u(6) }, z, 0.1, 3)];
    out.push(wood(cyl(x, y, u(0.9), z, u(9), { tone: "hi" }, 12)));
    out.push(leaf(count(S(G.sphereOf([x, y, z + u(12)], u(5.2), P, { steps: 40 }), { tone: "hi" }))));
    out.push(leaf(count(S(G.sphereOf([x + u(1), y + u(1.2), z + u(16.5)], u(3.6), P, { steps: 32 }), { tone: "hi" }))));
    return out.join("");
  }

  // The pilot's stone lantern (tōrō).
  function lantern(x, y, z) {
    const out = [];
    out.push(cyl(x, y, 3.2, z, 1.4, { tone: "mid" }, 16, 0.3));
    out.push(cyl(x, y, 1.1, z + 1.4, 5, { tone: "mid" }, 12));
    out.push(slab({ x: x - 2.8, y: y - 2.8, w: 5.6, d: 5.6, r: 0 }, z + 6.4, 1.1, { tone: "mid" }, 2, 0.3));
    const bx = { x: x - 1.9, y: y - 1.9, w: 3.8, d: 3.8, r: 0 };
    const lights = [faceRect("x", x + 1.9, y - 0.9, y + 0.9, z + 8.1, z + 9.9), faceRect("y", y + 1.9, x - 0.9, x + 0.9, z + 8.1, z + 9.9)].join("");
    out.push(slab(bx, z + 7.5, 3, { tone: "mid", inner: L(lights, { tone: "lo" }) }, 2));
    const cap = roofOf(bx, 1.6, z + 10.5, { x: x - 0.5, y: y - 0.5, w: 1, d: 1 }, z + 12.4, { lift: 0.5, flare: 0.4, fascia: 0.5, n: 4 });
    out.push(count(S(cap.paths, { tone: "mid" })));
    out.push(count(S(G.sphereOf([x, y, z + 13.2], 0.9, P, { steps: 24 }), { tone: "mid" })));
    return out.join("");
  }

  return { P, at, S, L, ac, depth, byDepth, pathOf, count, counter, polySolid, bar, rectRing, grow, roofOf, courses, frustum, fp, faceLine, faceRect, facePoly, slab, box, cyl, halo, plinth, stone, pineTree, roundTree, lantern };
}

// ---------- size: lossless path minifier (from the pilot) ----------
const num = (t) => (t / 10).toString().replace(/^(-?)0\./, "$1.");
function minifyD(d) {
  if (!/^[MLZ0-9 .\-]+$/.test(d)) return d;
  const tokens = d.match(/[MLZ]|-?\d*\.?\d+/g);
  let out = "";
  let cx = 0, cy = 0, sx = 0, sy = 0, first = true, prev = "";
  for (let i = 0; i < tokens.length; ) {
    const c = tokens[i++];
    if (c === "Z") { out += "z"; cx = sx; cy = sy; prev = "z"; continue; }
    const x = Math.round(parseFloat(tokens[i++]) * 10);
    const y = Math.round(parseFloat(tokens[i++]) * 10);
    const dx = first ? x : x - cx;
    const dy = first ? y : y - cy;
    const cmd = c === "M" ? (first ? "M" : "m") : "l";
    const pair = num(dx) + (dy < 0 ? "" : " ") + num(dy);
    out += (cmd === prev && cmd === "l" ? (dx < 0 ? "" : " ") : cmd) + pair;
    prev = cmd;
    first = false;
    cx = x; cy = y;
    if (c === "M") { sx = x; sy = y; }
  }
  return out;
}
export const minify = (svg) => svg.replace(/ d="([^"]*)"/g, (_, d) => ` d="${minifyD(d)}"`);

// ---------- output ----------
const MOTION = {
  float: "@keyframes {p}float{0%,100%{transform:translate(0,0)}50%{transform:translate(var(--am-dx,0),var(--am-dy,0))}}\n{s} .{p}float{animation:{p}float var(--am-period,6s) cubic-bezier(.45,0,.55,1) var(--am-delay,0s) infinite}",
  pulse: "@keyframes {p}pulse{0%,100%{opacity:var(--am-min,.35)}50%{opacity:1}}\n{s} .{p}pulse{animation:{p}pulse var(--am-period,3.2s) cubic-bezier(.45,0,.55,1) var(--am-delay,0s) infinite}",
  blink: "@keyframes {p}blink{0%,100%{opacity:var(--am-min,.15)}8%,30%{opacity:1}}\n{s} .{p}blink{animation:{p}blink var(--am-period,2.4s) linear var(--am-delay,0s) infinite}",
  shadow: "@keyframes {p}shadow{0%,100%{opacity:1}50%{opacity:var(--am-min,.6)}}\n{s} .{p}shadow{animation:{p}shadow var(--am-period,6s) cubic-bezier(.45,0,.55,1) var(--am-delay,0s) infinite}",
};

// nn: "09"; subject: short Spanish subject; doc: Spanish JSDoc lines (array); accents(theme).
export function emit({ nn, here, out, subject, doc, label, body, accents, solids }) {
  mkdirSync(out, { recursive: true });
  for (const theme of ["light", "dark"]) {
    const name = `day${nn}-${theme}`;
    const svg = a.assetSvg({ width: W, height: H, label, body, paper: SITE[theme].paper, theme, accents: accents(theme), weight: WEIGHT, id: name });
    writeFileSync(join(here, `${name}.svg`), svg);
    writeFileSync(join(here, `${name}.html`), a.previewHtml({ title: name, svg, paper: SITE[theme].paper, width: W * 2 }));
    console.log(`wrote ${name}.svg (${(svg.length / 1024).toFixed(0)} KB)`);
  }
  console.log(`solids: ${solids}`);

  // site drop: kit drawing rules scoped to `.iso-dNN`, tokens per theme, motion prefixed dNN-.
  const scope = `.iso-d${nn}`;
  const pre = `d${nn}-`;
  const drawing = k.ISO_CSS.split("\n").filter((line) => /^\.(iso-svg|iso-fill|iso-solid|iso-shade|iso-top|iso-halo|iso-line|iso-dots|tb-)/.test(line));
  const scoped = drawing.map((line) => line.replace(/^([^{]+)\{/, (_, sel) => `${sel.split(",").map((s) => `${scope} ${s.trim().replace(/^\.iso-svg /, "")}`).join(",")}{`)).join("\n");
  const tokens = (theme) => {
    const g = a.groundTokens(SITE[theme].paper, { theme });
    delete g.card; delete g.page;
    g.paper = "var(--paper)";
    const extra = theme === "light" ? { lit: "#000000", "halo-opacity": ".32" } : { lit: "#ffffff", "halo-opacity": ".9" };
    return Object.entries({ ...g, ...extra, weight: `${WEIGHT}px` }).map(([n, v]) => `--anatomy-${n}:${v}`).join(";");
  };
  const used = [...new Set([...body.matchAll(/class="am-(float|pulse|blink|shadow)"/g)].map((m) => m[1]))];
  const tsBody = body.replace(/class="am-(float|pulse|blink|shadow)"/g, `class="${pre}$1"`);
  const css = [
    `${scope}{${tokens("light")}}`,
    `[data-theme="dark"] ${scope}{${tokens("dark")}}`,
    a.accentCss(accents("light"), { scope, theme: "light" }),
    a.accentCss(accents("dark"), { scope: `[data-theme="dark"] ${scope}`, theme: "dark" }),
    scoped,
    ...used.map((m) => MOTION[m].replaceAll("{p}", pre).replaceAll("{s}", scope)),
    used.length ? `@media (prefers-reduced-motion:reduce){${used.map((m) => `${scope} .${pre}${m}`).join(",")}{animation:none}}` : "",
  ].filter(Boolean).join("\n");
  const markup = `<style>${css}</style><g data-art="">${tsBody}</g>`;
  const ts = `/**
${doc.map((l) => ` *${l ? ` ${l}` : ""}`).join("\n")}
 *
 * Marcado SVG generado (no editar a mano) con el kit de la skill anatomy-asset
 * (iso/day${nn}/build.mjs en tools/art). Estilos acotados a \`.iso-d${nn}\` y
 * animaciones con prefijo \`d${nn}-\`, para que los 21 dibujos convivan en una página.
 * Los colores salen de los tokens de src/styles/index.css (--paper en vivo; las rampas de tono se
 * derivan de los hex de la paleta al generar): si cambia la paleta, hay que regenerar este fichero.
 */
export const DAY${nn}_ISO_VIEWBOX = '0 0 ${W} ${H}'

export const DAY${nn}_ISO_SUBJECT = '${subject}'

export const DAY${nn}_ISO_MARKUP = ${JSON.stringify(markup)}
`;
  writeFileSync(join(out, `day${nn}Iso.markup.ts`), ts);
  console.log(`wrote day${nn}Iso.markup.ts (${(ts.length / 1024).toFixed(0)} KB)`);
}
