// In-page probe (loaded by probe.html, driven by probe.mjs). Rasterises every fragment of the
// drawing in both themes as an SVG image, sweeps each moving part through its whole motion, and
// assigns every static fragment to the lowest layer that keeps all measured overlaps in the
// original painter's order:
//   mover k → layer 2k+1; a static fragment goes above every earlier layer it overlaps.
window.__probe = async () => {
  const I = window.__input;
  const W = 1200;
  const H = 640;
  const N = W * H;
  const WORDS = (N + 31) >>> 5;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  const doc = (svg, theme) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><g data-theme="${theme}" style="--paper:${I.paper[theme]}"><g class="iso-hero"><style>${I.style}</style>${svg}</g></g></svg>`;
  const load = (svg, theme) => new Promise((ok, no) => {
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = () => no(new Error("image failed"));
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(doc(svg, theme));
  });
  const grab = (mask) => {
    const d = ctx.getImageData(0, 0, W, H).data;
    for (let p = 0; p < N; p++) if (d[(p << 2) + 3] >= 3) mask[p >>> 5] |= 1 << (p & 31);
  };
  const pop = (x) => { x -= (x >>> 1) & 0x55555555; x = (x & 0x33333333) + ((x >>> 2) & 0x33333333); return (((x + (x >>> 4)) & 0x0f0f0f0f) * 0x01010101) >>> 24; };
  const count = (A) => { let n = 0; for (let w = 0; w < WORDS; w++) if (A[w]) n += pop(A[w]); return n; };
  const overlap = (A, B) => { let n = 0; for (let w = 0; w < WORDS; w++) { const x = A[w] & B[w]; if (x) n += pop(x); } return n; };
  const lerp = (a, b, t) => a + (b - a) * t;
  const poses = (sw) => {
    if (!sw || sw.kind === "static") return [() => {}];
    if (sw.kind === "slide") return Array.from({ length: 41 }, (_, i) => (c) => c.translate((sw.v[0] * i) / 40, (sw.v[1] * i) / 40));
    if (sw.kind === "swing") {
      const [a, b, c0, d, e, f] = sw.M;
      const det = a * d - b * c0;
      const inv = [d / det, -b / det, -c0 / det, a / det, (c0 * f - d * e) / det, (b * e - a * f) / det];
      const out = [];
      for (let t = sw.from; t <= sw.to + 1e-9; t += 0.5) out.push((c) => { c.transform(a, b, c0, d, e, f); c.rotate((t * Math.PI) / 180); c.transform(...inv); });
      return out;
    }
    if (sw.kind === "petal") {
      const keys = sw.keys.filter((k) => k.tx !== undefined);
      const out = [];
      for (let s = 0; s < keys.length - 1; s++) {
        for (let i = 0; i <= 30; i++) {
          const t = i / 30;
          const k0 = keys[s];
          const k1 = keys[s + 1];
          const tx = lerp(k0.tx, k1.tx, t);
          const ty = lerp(k0.ty, k1.ty, t);
          const r = lerp(k0.rot, k1.rot, t);
          out.push((c) => { c.translate(sw.c[0] + tx, sw.c[1] + ty); c.rotate((r * Math.PI) / 180); c.translate(-sw.c[0], -sw.c[1]); });
        }
      }
      return out;
    }
    throw new Error("unknown sweep " + sw.kind);
  };
  const maskOf = async (f) => {
    const mask = new Uint32Array(WORDS);
    const ps = poses(f.moving ? I.sweeps[f.moving] : null);
    for (const theme of ["light", "dark"]) {
      const img = await load(f.svg, theme);
      for (const p of ps) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, W, H);
        p(ctx);
        ctx.drawImage(img, 0, 0);
        grab(mask);
      }
    }
    return mask;
  };
  const movers = I.frags.filter((f) => f.moving).map((f) => f.moving);
  const U = [];
  const result = [];
  for (const f of I.frags) {
    const m = await maskOf(f);
    let slot = 0;
    const hits = {};
    if (f.moving) slot = 2 * movers.indexOf(f.moving) + 1;
    else {
      for (let j = 1; j < U.length; j++) {
        if (!U[j]) continue;
        const n = overlap(U[j], m);
        if (n) { hits[j] = n; slot = Math.max(slot, j % 2 ? j + 1 : j); }
      }
    }
    U[slot] ??= new Uint32Array(WORDS);
    for (let w = 0; w < WORDS; w++) U[slot][w] |= m[w];
    result.push({ i: f.i, name: f.name, moving: f.moving, slot, hits, px: count(m), mask: m });
  }
  // Fewer static layers: a whole static slot j (above mover j−1) can move up to slot j+2 when
  // none of its parts overlaps mover j+1. Inside a slot parts keep the painter's order, so their
  // order against the parts already there stays right.
  const lifted = [];
  const top = 2 * movers.length;
  for (let j = 2; j < top; j += 2) {
    const here = result.filter((r) => !r.moving && r.slot === j);
    if (!here.length) continue;
    const mover = result.find((r) => r.moving && r.slot === j + 1);
    if (here.some((r) => overlap(r.mask, mover.mask))) continue;
    for (const r of here) r.slot = j + 2;
    lifted.push(`${j}→${j + 2}`);
  }
  // Check every pair once more: whenever two parts overlap, the one painted later in the original
  // order must end up in the same or a higher layer.
  const bad = [];
  for (let x = 0; x < result.length; x++) {
    for (let y = x + 1; y < result.length; y++) {
      const p = result[x];
      const q = result[y];
      if (q.slot > p.slot || (q.slot === p.slot && !q.moving)) continue;
      if (overlap(p.mask, q.mask)) bad.push(`${p.name}(${p.slot}) over ${q.name}(${q.slot})`);
    }
  }
  for (const r of result) delete r.mask;
  return JSON.stringify({ hash: I.hash, movers, lifted, bad, result });
};
