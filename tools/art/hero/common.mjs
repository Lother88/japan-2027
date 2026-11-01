// Shared by hero/hero-maqueta/build.mjs and hero/banda-muro/build.mjs: kit imports, the site palette,
// a shaded polyhedron, a smooth-shaded grid surface, the path minifier and the React drop.
import { pathToFileURL } from "node:url";

const SKILL = ((process.env.ANATOMY_ASSET_DIR ?? `${process.env.USERPROFILE ?? process.env.HOME}/.claude/skills/anatomy-asset`).replace(/[\\/]?$/, "/"));
export const k = await import(pathToFileURL(SKILL + "kit/iso-kit.mjs").href);
export const a = await import(pathToFileURL(SKILL + "kit/asset.mjs").href);
export const G = await import(pathToFileURL(SKILL + "kit/lathe.mjs").href);
export const A = await import(pathToFileURL(SKILL + "kit/audit.mjs").href);

// ---------- site palette (src/index.css, light ~11–15, dark ~25–29) ----------
export const SITE = {
  light: { paper: "#fbf6f0", ink: "#1b2a4a", gold: "#b08534", brown: "#8a5a3b", green: "#3f6f5f", coral: "#c24a5a", amber: "#b48a35", slate: "#5a5e6b" },
  dark: { paper: "#12141b", ink: "#f1ece1", gold: "#d9a948", brown: "#c89a6a", green: "#76b89a", coral: "#ff7a6f", amber: "#e2a743", slate: "#9aa0ad" },
};
export const mix = (x, y, t) => {
  const p = a.hexToRgb(x);
  const q = a.hexToRgb(y);
  return `#${p.map((v, i) => Math.round((v * (1 - t) + q[i] * t) * 255).toString(16).padStart(2, "0")).join("")}`;
};

// The accent families both assets share (same names, same derivation as the approved draft).
export function baseAccents(theme) {
  const s = SITE[theme];
  const L = theme === "light";
  return {
    wood: s.brown,
    moss: mix(s.green, s.paper, L ? 0.4 : 0.25),
    pine: s.green,
    stone: mix(s.slate, s.paper, L ? 0.62 : 0.45),
    ebony: L ? mix(s.ink, s.paper, 0.08) : mix(s.paper, s.ink, 0.1),
    torii: s.coral,
    gold: s.gold,
    // Lantern light: dark panes by day, lit amber panes (ink accent) at night.
    pane: L ? mix(s.ink, s.paper, 0.08) : { hex: s.amber, mode: "ink" },
  };
}

// ---------- a closed polyhedron, shaded like the kit's solids ----------
export function polySolid(P, faces, { creaseCos = 0.97 } = {}) {
  const at = (p) => k.iso(p, P);
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
  const { outline, crease } = edgesOf(P, info, creaseCos);
  const buckets = [[], [], [], [], []];
  const fill = [];
  for (const f of info) {
    if (!f.vis) continue;
    const d = polyD(f.pts.map(at));
    fill.push(d);
    buckets[G.bandOf(G.dot3(f.n, Lt))].push(d);
  }
  return { fill: fill.join(""), outline, crease, top: buckets[4].join(""), shades: buckets.slice(0, 4).map((b) => b.join("")) };
}

const area2 = (pp) => pp.reduce((s, p, i) => { const q = pp[(i + 1) % pp.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);
const polyD = (pp) => k.pathOf(area2(pp) < 0 ? [...pp].reverse() : pp, true);

function edgesOf(P, info, creaseCos, creaseOk = () => true) {
  const at = (p) => k.iso(p, P);
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
    const seg = k.pathOf([at(p), at(q)]);
    if (fs.length === 1) { if (vis[0]) outline.push(seg); continue; }
    if (vis[0] !== vis[1]) outline.push(seg);
    else if (vis[0] && G.dot3(info[fs[0]].n, info[fs[1]].n) < creaseCos && creaseOk(info[fs[0]], info[fs[1]])) crease.push(seg);
  }
  return { outline: joinSegs(outline), crease: joinSegs(crease) };
}

// Chain "M a L b" segments that share ends into polylines (smaller and no cap dots at joints).
function joinSegs(segs) {
  const parsed = segs.map((s) => s.match(/-?\d*\.?\d+/g).map(Number)).map((n) => [[n[0], n[1]], [n[2], n[3]]]);
  const key = (p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
  const byEnd = new Map();
  parsed.forEach((s, i) => { for (const p of s) { const kk = key(p); if (!byEnd.has(kk)) byEnd.set(kk, []); byEnd.get(kk).push(i); } });
  const used = new Uint8Array(parsed.length);
  const out = [];
  for (let i = 0; i < parsed.length; i++) {
    if (used[i]) continue;
    used[i] = 1;
    const chain = [...parsed[i]];
    for (const dir of [1, 0]) {
      for (;;) {
        const end = dir ? chain[chain.length - 1] : chain[0];
        const next = (byEnd.get(key(end)) ?? []).find((j) => !used[j]);
        if (next === undefined) break;
        used[next] = 1;
        const s = parsed[next];
        const other = key(s[0]) === key(end) ? s[1] : s[0];
        if (dir) chain.push(other); else chain.unshift(other);
      }
    }
    out.push(k.pathOf(chain));
  }
  return out.join("");
}

// ---------- a smooth-shaded grid surface (car bodies, noses) ----------
// rings: list of point loops (same length M, in order along the body). group[s] names the
// smoothing group of section segment s→s+1: vertex normals average only within one group, so
// a flat side stays flat and a curved roof shades in clean iso-light curves (like the kit's
// smooth lathe). caps: extra flat faces [{ pts, hint }]. hint(s): outward direction of segment s.
const BANDS = [-Infinity, 0, 0.2, 0.42, 0.62, Infinity];
export function smoothGrid(P, rings, { group, hint, caps = [], creaseCos = 0.9 }) {
  const at = (p) => k.iso(p, P);
  const V = G.viewOf(P);
  const Lt = G.lightOf(P);
  const N = rings.length;
  const M = rings[0].length;
  const fn = [];
  for (let i = 0; i < N - 1; i++) {
    fn.push([]);
    for (let s = 0; s < M; s++) {
      const s2 = (s + 1) % M;
      const q = [rings[i][s], rings[i + 1][s], rings[i + 1][s2], rings[i][s2]];
      const n1 = G.cross3(G.sub3(q[1], q[0]), G.sub3(q[3], q[0]));
      const n2 = G.cross3(G.sub3(q[3], q[2]), G.sub3(q[1], q[2]));
      let n = G.add3(n1, n2);
      if (G.len3(n) < 1e-12) n = hint(s);
      n = G.unit3(n);
      if (G.dot3(n, hint(s)) < 0) n = G.mul3(n, -1);
      fn[i].push(n);
    }
  }
  // Vertex normal for corner (i, s) of a face in group g.
  const vn = (i, s, g) => {
    let sum = [0, 0, 0];
    for (const fi of [i - 1, i]) {
      if (fi < 0 || fi >= N - 1) continue;
      for (const fs of [(s - 1 + M) % M, s]) if (group[fs] === g) sum = G.add3(sum, fn[fi][fs]);
    }
    return G.unit3(sum);
  };
  const buckets = [[], [], [], [], []];
  const fill = [];
  const info = [];
  for (let i = 0; i < N - 1; i++) {
    for (let s = 0; s < M; s++) {
      const s2 = (s + 1) % M;
      const pts = [rings[i][s], rings[i + 1][s], rings[i + 1][s2], rings[i][s2]];
      const vis = G.dot3(fn[i][s], V) > 1e-6;
      info.push({ pts, n: fn[i][s], vis, g: group[s] });
      if (!vis) continue;
      const g = group[s];
      const corner = [[i, s], [i + 1, s], [i + 1, s2], [i, s2]];
      const score = corner.map(([ci, cs]) => G.dot3(vn(ci, cs, g), Lt));
      const scr = pts.map(at);
      fill.push(polyD(scr));
      // Whole quad in one band → one quad; otherwise clip two triangles band by band.
      const b0 = G.bandOf(score[0]);
      if (score.every((v) => G.bandOf(v) === b0)) { buckets[b0].push(polyD(scr)); continue; }
      for (const tri of [[0, 1, 2], [0, 2, 3]]) {
        const tp = tri.map((j) => ({ p: scr[j], f: score[j] }));
        for (let b = 0; b < 5; b++) {
          let poly = clipBy(tp, BANDS[b], 1);
          poly = clipBy(poly, BANDS[b + 1], -1);
          if (poly.length >= 3) {
            const pp = poly.map((v) => v.p);
            if (Math.abs(area2(pp)) > 0.02) buckets[b].push(polyD(pp));
          }
        }
      }
    }
  }
  for (const c of caps) {
    let n = [0, 0, 0];
    for (let j = 0; j < c.pts.length; j++) {
      const p = c.pts[j];
      const q = c.pts[(j + 1) % c.pts.length];
      n[0] += (p[1] - q[1]) * (p[2] + q[2]);
      n[1] += (p[2] - q[2]) * (p[0] + q[0]);
      n[2] += (p[0] - q[0]) * (p[1] + q[1]);
    }
    n = G.unit3(n);
    if (G.dot3(n, c.hint) < 0) n = G.mul3(n, -1);
    const vis = G.dot3(n, V) > 1e-6;
    info.push({ pts: c.pts, n, vis, g: "cap" });
    if (!vis) continue;
    const d = polyD(c.pts.map(at));
    fill.push(d);
    buckets[G.bandOf(G.dot3(n, Lt))].push(d);
  }
  const { outline, crease } = edgesOf(P, info, creaseCos, (f1, f2) => f1.g !== f2.g);
  return { fill: fill.join(""), outline, crease, top: buckets[4].join(""), shades: buckets.slice(0, 4).map((b) => b.join("")), seamless: true };
}

// Keep the part of a polygon (vertices {p, f}) where sign·(f − t) ≥ 0, interpolating linearly.
function clipBy(poly, t, sign) {
  if (!isFinite(t)) return poly;
  const inside = (v) => sign * (v.f - t) >= 0;
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const A0 = poly[i];
    const B0 = poly[(i + 1) % poly.length];
    const ia = inside(A0);
    const ib = inside(B0);
    if (ia) out.push(A0);
    if (ia !== ib) {
      const u = (t - A0.f) / (B0.f - A0.f);
      out.push({ p: [A0.p[0] + (B0.p[0] - A0.p[0]) * u, A0.p[1] + (B0.p[1] - A0.p[1]) * u], f: t });
    }
  }
  return out;
}

// Several same-tone parts that never overlap on screen, painted as one solid.
export function compound(list) {
  return {
    fill: list.map((p) => p.fill).join(""),
    outline: list.map((p) => p.outline).join(""),
    crease: list.map((p) => p.crease).join(""),
    top: list.map((p) => p.top).join(""),
    shades: [0, 1, 2, 3].map((i) => list.map((p) => p.shades[i]).join("")),
    bevel: list.map((p) => p.bevel ?? "").join(""),
  };
}

// ---------- size: lossless-at-0.1 path minifier (as in feature-spots) ----------
const num = (t) => (t / 10).toString().replace(/^(-?)0\./, "$1.");
export function minifyD(d) {
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

// ---------- the React drop: one geometry, light + dark tokens, everything prefixed ----------
// Kit drawing classes (iso-*), accent classes (ac-*), ambient motion classes and keyframes
// (am-*) and every id get the asset prefix, so nothing collides with the day illustrations.
const SHORT = { fill: "f", shade: "s", top: "t", line: "l", solid: "o", halo: "h", edge: "e", crease: "c", bevel: "b", dots: "d", fade: "fd", svg: "svg", wire: "w", seamless: "sl" };
export function prefixAll(text, p) {
  return text
    .replace(/(?<![-\w])iso-([a-z]+)/g, (m, w) => (w === "hero" || w === "banda" ? m : `${p}-${SHORT[w] ?? `iso-${w}`}`))
    .replace(/(?<![-\w])ac-/g, `${p}-a-`)
    .replace(/(?<![-\w])am-/g, `${p}-am-`);
}

export function reactMarkup({ scope, prefix, body, accentsFor, weight, css, k: kit = k }) {
  const drawing = kit.ISO_CSS.split("\n").filter((line) => /^\.(iso-svg|iso-fill|iso-solid|iso-shade|iso-top|iso-halo|iso-line|iso-dots)/.test(line));
  const scoped = drawing.map((line) => line.replace(/^([^{]+)\{/, (_, sel) => `${sel.split(",").map((s) => `.${scope} ${s.trim().replace(/^\.iso-svg /, "")}`).join(",")}{`)).join("\n");
  const tokens = (theme) => {
    const g = a.groundTokens(SITE[theme].paper, { theme });
    delete g.card; delete g.page;
    g.paper = "var(--paper)";
    const extra = theme === "light" ? { lit: "#000000", "halo-opacity": ".32" } : { lit: "#ffffff", "halo-opacity": ".9" };
    return Object.entries({ ...g, ...extra, weight: `${weight}px` }).map(([n, v]) => `--anatomy-${n}:${v}`).join(";");
  };
  const style = [
    `.${scope}{${tokens("light")}}`,
    `[data-theme="dark"] .${scope}{${tokens("dark")}}`,
    a.accentCss(accentsFor("light"), { scope: `.${scope}`, theme: "light" }),
    a.accentCss(accentsFor("dark"), { scope: `[data-theme="dark"] .${scope}`, theme: "dark" }),
    scoped,
    css,
  ].join("\n");
  return prefixAll(`<style>${style}</style><g data-art="">${body}</g>`, prefix);
}
