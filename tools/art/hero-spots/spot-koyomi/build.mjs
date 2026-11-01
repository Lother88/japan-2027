// spot-koyomi — a tear-off day calendar (himekuri) on a wooden desk stand: a backboard on a
// plinth, a 21-sheet pad under a coral binding header, the top sheet curling forward as it is
// torn, two torn sheets and a pencil on the plinth. Stat chip "días". Static.
import { k, G, P, camera, at, L, D, ac, box, slab, cyl, solid, halo, faceLine, faceRect, prism, frameYZ, rod, woodPlinth, polySolid, byDepth, solidCount, emit, family, SITE, count, S } from "../common.mjs";

const W = 56;
const H = 56;
const PL = box(-17, 17, -12, 13, 1.5);
const BOARD = { x0: -12.5, x1: 12.5, y0: -5, y1: -3, z1: 42 };
const PAD = { x0: -10.5, x1: 10.5, y0: -3, y1: 2.6, z0: 6, z1: 31 };
const HEAD = { z0: 31, z1: 36.5 };

camera([...k.boxCorners(k.insetPlan(PL, -1.5), -5.5, 0), [0, BOARD.y0, BOARD.z1 + 1], [BOARD.x1, BOARD.y1, BOARD.z1], [BOARD.x0, BOARD.y0, BOARD.z1]], W, H, 2.5);

const wood = ac("wood");
const paper = ac("plaster");
const coral = ac("amber");
const red = ac("coral");
const ebony = (x) => x;
const gold = (x) => x;
const out = [];

// ---------- plinth on four feet ----------
out.push(halo(k.insetPlan(PL, -1), -5.5, 1.2));
for (const [x, y] of byDepth(k.corners(PL, 3.2))) out.push(ebony(cyl(x, y, 1.5, -5.5, 1.5, { tone: "hi", crease: "none" }, 6)));
out.push(wood(slab(PL, -4, 4, { tone: "mid", inner: L(k.sideSeam(PL, -2, P, 2), { tone: "faint" }) }, 2, 0.5)));
// brass label plate on the plinth's left (front) face
out.push(gold(solid(k.slabOf(box(-6, 6, PL.y + PL.d, PL.y + PL.d + 0.4), -3, 2, P, 2), { tone: "hi", crease: "none" })));
out.push(D([[-4.8, PL.y + PL.d + 0.4, -2], [4.8, PL.y + PL.d + 0.4, -2]], { size: 0.22, tone: "hi" }));

// ---------- backboard with its two rear brackets ----------
for (const x of [BOARD.x0 + 2.5, BOARD.x1 - 2.5]) {
  const tri = [[0, 0], [7, 0], [0, 16]];
  out.push(wood(solid(prism(tri.map(([u, v]) => [-u, v]), frameYZ(BOARD.y0, 0), x - 0.8, x + 0.8), { tone: "mid" })));
}
out.push(wood(slab(box(BOARD.x0, BOARD.x1, BOARD.y0, BOARD.y1), 0, BOARD.z1, { tone: "mid", inner: L(faceLine("x", BOARD.x1, BOARD.y0 + 1, 2, BOARD.y0 + 1, BOARD.z1 - 2), { tone: "faint" }) }, 2, 0.3)));
// crest rail and the hanging hook
out.push(wood(slab(box(BOARD.x0 - 0.8, BOARD.x1 + 0.8, BOARD.y0 - 0.5, BOARD.y1 + 0.5), BOARD.z1, 1.6, { tone: "mid" }, 2, 0.3)));
out.push(L(k.sideRing([0, BOARD.y1, BOARD.z1 - 3], 1.3, "y", P, 16), { tone: "mid" }));
out.push(gold(solid(rod("y", BOARD.y1, BOARD.y1 + 1.6, 0, 0.55, BOARD.z1 - 3, 6), { tone: "hi", crease: "none" })));

// ---------- the pad: card back, 21 sheets, coral binding ----------
out.push(solid(k.slabOf(box(PAD.x0 - 0.4, PAD.x1 + 0.4, PAD.y0, PAD.y0 + 0.8), PAD.z0 - 0.6, HEAD.z0 - PAD.z0 + 0.6, P, 2), { tone: "mid" }));
const sheetEdges = [];
for (let i = 1; i <= 5; i++) {
  const y = PAD.y0 + 0.8 + (i * (PAD.y1 - PAD.y0 - 0.8)) / 6;
  sheetEdges.push(faceLine("x", PAD.x1, y, PAD.z0, y, HEAD.z0));
}
out.push(paper(solid(k.slabOf(box(PAD.x0, PAD.x1, PAD.y0 + 0.8, PAD.y1), PAD.z0, HEAD.z0 - PAD.z0, P, 2), { tone: "hi", inner: L(sheetEdges.join(""), { tone: "faint" }) })));
const F = PAD.y1;
// torn stubs under the header: a jagged strip
const jag = [[PAD.x0, HEAD.z0]];
for (let i = 0; i <= 14; i++) jag.push([PAD.x0 + (i * (PAD.x1 - PAD.x0)) / 14, HEAD.z0 - (i % 2 ? 1.6 : 0.8)]);
jag.push([PAD.x1, HEAD.z0]);
out.push(paper(solid(prism(jag.map(([x, z]) => [x, z - HEAD.z0]), { o: [0, 0, HEAD.z0], u: [1, 0, 0], v: [0, 0, 1], a: [0, 1, 0] }, F, F + 0.3), { tone: "mid", crease: "none" })));

// the top sheet: flat under the binding, then curling forward and up as it is torn
const T = 0.35;
const R = 4.2;
const ZC = 13.5;
const prof = [[F + 0.3, HEAD.z0], [F + 0.3, ZC]];
for (let i = 1; i <= 5; i++) {
  const f = (i / 5) * 1.75;
  prof.push([F + 0.3 + R - R * Math.cos(f), ZC - R * Math.sin(f)]);
}
const inner = prof.map(([y, z], i) => {
  const p = prof[Math.max(0, i - 1)];
  const q = prof[Math.min(prof.length - 1, i + 1)];
  const ty = q[0] - p[0];
  const tz = q[1] - p[1];
  const l = Math.hypot(ty, tz) || 1;
  return [y + (tz / l) * T, z - (ty / l) * T];
});
const sheet = [...prof, ...inner.reverse()];
out.push(paper(solid(prism(sheet, frameYZ(0, 0), PAD.x0 + 0.3, PAD.x1 - 0.3, { creaseCos: 0.8 }), { tone: "hi" })));
// today's sheet: the day marked with a red disc, and two printed lines under it
const FS = F + 0.3;
const disc = Array.from({ length: 20 }, (_, i) => [Math.cos((i / 20) * Math.PI * 2) * 5.6, 22.5 + Math.sin((i / 20) * Math.PI * 2) * 5.6]);
out.push(red(solid(prism(disc, { o: [0, 0, 0], u: [1, 0, 0], v: [0, 0, 1], a: [0, 1, 0] }, FS, FS + 0.15, { creaseCos: 0.5 }), { tone: "hi", crease: "none" })));
out.push(L(faceLine("y", FS, -6.5, 15, 6.5, 15) + faceLine("y", FS, -4, 13.4, 4, 13.4), { tone: "mid", free: true }));

// binding header in coral, two brass rivets
out.push(coral(slab(box(PAD.x0 - 0.6, PAD.x1 + 0.6, PAD.y0 + 0.2, F + 0.9), HEAD.z0, HEAD.z1 - HEAD.z0, { tone: "hi", inner: L(faceLine("y", F + 0.9, PAD.x0 - 0.6, HEAD.z0 + 1.2, PAD.x1 + 0.6, HEAD.z0 + 1.2), { tone: "lo" }) }, 2, 0.35)));
for (const x of [-6.5, 6.5]) out.push(gold(solid(rod("y", F + 0.9, F + 1.6, x, 0.9, HEAD.z0 + 3.2, 6), { tone: "hi", crease: "none" })));

// ---------- on the plinth: two torn sheets and a pencil ----------
const loose = (cx, cy, ang, z) => {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  const pts = [[-6.5, -4], [6.5, -4], [6.5, 4], [-6.5, 4]].map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c]);
  const lines = [[-4.5, -1.5, 4.5], [-4.5, 0.5, 2]].map(([x0, y, x1]) => k.lineOnTop([cx + x0 * c - y * s, cy + x0 * s + y * c], [cx + x1 * c - y * s, cy + x1 * s + y * c], z + 0.3, P)).join("");
  return paper(solid(k.extrude(pts, z, 0.3, P), { tone: "mid", inner: L(lines, { tone: "lo", free: true }) }));
};
out.push(loose(-6, 7, -0.25, 0), loose(-5, 7.8, 0.12, 0.3));
// pencil lying along x: hexagonal body, eraser, sharpened wood cone and graphite tip
const hex = Array.from({ length: 6 }, (_, i) => [Math.cos((i / 6) * Math.PI * 2 + Math.PI / 6) * 1.1, Math.sin((i / 6) * Math.PI * 2 + Math.PI / 6) * 1.1]);
const PY = 9.5;
const PZ = 1.1;
out.push(gold(solid(rod("x", 0.5, 2.6, PY, 1, PZ, 6), { tone: "hi", crease: "none" })));
out.push(red(solid(prism(hex, { o: [0, PY, PZ], u: [0, 1, 0], v: [0, 0, 1], a: [1, 0, 0] }, 2.6, 13, { creaseCos: 0.9 }), { tone: "hi" })));
const cone = (x0, x1, r0, r1) => {
  const ring = (x, r) => hex.map(([u, v]) => [x, PY + (u * r) / 1.1, PZ + (v * r) / 1.1]);
  const A = ring(x0, r0);
  const B = ring(x1, r1);
  const faces = A.map((p, i) => ({ pts: [p, A[(i + 1) % 6], B[(i + 1) % 6], B[i]], hint: [0.3, hex[i][0] + hex[(i + 1) % 6][0], hex[i][1] + hex[(i + 1) % 6][1]] }));
  faces.push({ pts: A, hint: [-1, 0, 0] }, { pts: B, hint: [1, 0, 0] });
  return polySolid(faces, { creaseCos: 0.9 });
};
out.push(wood(solid(cone(13, 15.4, 1.1, 0.4), { tone: "hi" })));
out.push(ebony(solid(cone(15.4, 16.2, 0.4, 0.08), { tone: "hi" })));

const body = out.join("");
const label = "A tear-off day calendar on a wooden stand, its top sheet curling as it is torn, with loose sheets and a pencil on the plinth.";
emit({
  name: "spot-koyomi", W, H, render: { w: 56, h: 56 }, ground: "surface", label, body,
  accentsFor: (t) => { const f = family(t); return { wood: f.wood, plaster: f.plaster, amber: f.amber, coral: f.coral }; },
  doc: {
    title: "spot-koyomi: bloc de calendario de 21 hojas (chip «días» del hero)",
    replaces: "Sustituye a la caja sin icono del chip «días» (Hero.tsx, stat chips).",
    tokens: "--surface, --brown, --amber, --coral, --ink, --paper",
    ground: "--anatomy-paper usa var(--surface) en vivo (el chip es --surface).",
    motion: "ninguno (estático; el flotado al pasar el ratón lo pone el integrador en CSS).",
  },
});
