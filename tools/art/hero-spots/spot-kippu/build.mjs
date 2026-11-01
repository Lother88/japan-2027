// spot-kippu — a JR train ticket (kippu) as the hero of the spot: a large pale mint card with a
// dark green band, a printed route arrow, a conductor's punch hole and its right edge torn along
// the perforation, leaning back in a low slotted wooden stand; the next ticket peeks out behind
// it, and the torn stub and a 10-yen coin lie on the plinth's front lip.
// Stat chip "excursiones". Static. v2: the ticket fills the canvas so it reads at 56 px.
import { k, camera, at, L, D, ac, box, slab, cyl, solid, prism, rod, woodPlinth, byDepth, solidCount, emit, family, mix, SITE, pathOf, P } from "../common.mjs";

const W = 56;
const H = 56;
const PL = box(-13.4, 13, -5.4, 4.8, 1.6);
const TZ = 1.2;                 // slot floor = ticket foot
const TW = [-11.2, 10.6];         // ticket x extent (torn edge adds ~0.45 at the right)
const TH = 14;                // ticket height along its leaning plane
const T = 0.32;                 // card thickness

// A ticket plane leaning back by `lean` degrees about the x axis, its front face through
// (0, y0, z0): world point for plane coords (x, s) plus `off` along the front normal.
const plane = (y0, z0, lean) => {
  const r = (lean * Math.PI) / 180;
  const v = [0, -Math.sin(r), Math.cos(r)];
  const n = [0, Math.cos(r), Math.sin(r)];
  const p = (x, s, off = 0) => [x + n[0] * off, y0 + v[1] * s + n[1] * off, z0 + v[2] * s + n[2] * off];
  return { frame: { o: [0, y0, z0], u: [1, 0, 0], v, a: n }, p };
};
const FRONT = plane(-1.1, TZ, 9);
const BACK = plane(-1.95, TZ + 1.3, 13);
const BACK2 = plane(-3.45, TZ + 2.6, 17);   // stands in a groove in the back lip top

camera([...k.boxCorners(k.insetPlan(PL, -1.2), -4.2, 0), FRONT.p(TW[0], TH), FRONT.p(TW[1] + 0.5, TH), BACK.p(TW[0] + 1.6, TH), BACK.p(TW[1] + 1.6, TH), BACK2.p(TW[0] + 3.2, TH)], W, H, 1.6);

const wood = ac("wood");
const tix = ac("ticket");
const green = ac("green");
const brass = ac("bronze");
const out = [];

const inPlane = (pl, pts, off = 0.01) => pathOf(pts.map(([x, s]) => at(pl.p(x, s, off))), true);
const linePlane = (pl, pts, off = 0.01) => pathOf(pts.map(([x, s]) => at(pl.p(x, s, off))));
const ellipse = (pl, cx, cs, r, n = 14) => inPlane(pl, Array.from({ length: n }, (_, i) => [cx + Math.cos((i / n) * 2 * Math.PI) * r, cs + Math.sin((i / n) * 2 * Math.PI) * r]));

// A ticket outline: straight on three sides, the right edge torn along the perforation.
const ticketOutline = (x0, x1, h, torn) => {
  const o = [[x0, 0], [x1, 0]];
  if (torn) for (let i = 1; i <= 14; i++) o.push([x1 + (i % 2 ? 0.45 : 0), (i / 14) * h]);
  else o.push([x1, h]);
  o.push([x0, h]);
  return o;
};

// ---------- plinth on four feet ----------
for (const [x, y] of byDepth(k.corners(PL, 2.6))) out.push(wood(cyl(x, y, 1.2, -4.2, 1.2, { tone: "hi", crease: "none" }, 8)));
out.push(woodPlinth(PL, -3, 3, { blur: 1.1, steps: 2 }));

// ---------- the slotted stand: base block, rear step, back lip, end caps ----------
const SB = box(-12.4, 12, -4.8, 0.7, 0.5);
out.push(wood(slab(SB, 0, TZ, { tone: "mid", crease: "none" }, 2, 0.3)));
// far end cap first: it sits behind both tickets and the back lip butts against it
out.push(wood(slab(box(-12.4, -11.4, -4.8, 0.7), TZ, 2.2, { tone: "hi", crease: "none" }, 2, 0.2)));
out.push(wood(slab(box(-11.4, 11, -4.8, -3), TZ, 2.6, { tone: "mid", crease: "none" }, 2, 0.2)));
out.push(wood(slab(box(-11.4, 11, -3, -1.55), TZ, 1.3, { tone: "lo", crease: "none" })));

// ---------- the next two tickets, peeking out behind ----------
const B2X = [TW[0] + 3.2, TW[1] + 3.2 - 1.4];
out.push(tix(solid(prism(ticketOutline(B2X[0], B2X[1], TH - 0.6, false), BACK2.frame, -T, 0, { creaseCos: 0.5 }), {
  tone: "lo",
  inner: green(`<path class="iso-shade" data-shade="3" d="${inPlane(BACK2, [[B2X[0], TH - 1.5], [B2X[1], TH - 1.5], [B2X[1], TH - 3.6], [B2X[0], TH - 3.6]])}"/>`),
})));
const BX = [TW[0] + 1.6, TW[1] + 1.6];
out.push(tix(solid(prism(ticketOutline(BX[0], BX[1], TH, false), BACK.frame, -T, 0, { creaseCos: 0.5 }), {
  tone: "mid",
  inner: green(`<path class="iso-shade" data-shade="2" d="${inPlane(BACK, [[BX[0], TH - 0.9], [BX[1], TH - 0.9], [BX[1], TH - 3], [BX[0], TH - 3]])}"/>`),
})));

// ---------- the ticket ----------
const F = FRONT;
const band = inPlane(F, [[TW[0], TH - 0.9], [TW[1], TH - 0.9], [TW[1], TH - 3.1], [TW[0], TH - 3.1]]);
const foot = inPlane(F, [[TW[0], 0.9], [TW[1], 0.9], [TW[1], 1.5], [TW[0], 1.5]]);
// printed fields: two short rules on the left, the route arrow from an origin dot to its head
const rules = [linePlane(F, [[-9.4, 6.6], [-4.6, 6.6]]), linePlane(F, [[-9.4, 5.1], [-6.2, 5.1]]), linePlane(F, [[-3, 3.1], [6.4, 3.1]])].join("");
const arrow = linePlane(F, [[-2.6, 6.2], [6.2, 6.2]]) + linePlane(F, [[4.4, 7.4], [6.2, 6.2], [4.4, 5]]);
const origin = [F.p(-2.6, 6.2, 0.01)];
// perforation holes just inside the torn edge, and the conductor's punch (a clean round hole)
const holes = [];
for (let s = 1.2; s < TH - 0.6; s += 1.1) holes.push(F.p(TW[1] - 1.1, s, 0.01));
const punch = ellipse(F, -8.2, 2.8, 0.85);
out.push(tix(solid(prism(ticketOutline(TW[0], TW[1], TH, true), F.frame, -T, 0, { creaseCos: 0.5 }), {
  tone: "hi",
  inner:
    green(`<path class="iso-shade" data-shade="2" d="${band}"/><path class="iso-shade" data-shade="1" d="${foot}"/>`) +
    L(rules, { tone: "mid", free: true }) +
    green(L(arrow, { tone: "hi", free: true }) + D(origin, { size: 0.42, tone: "hi" })) +
    D(holes, { size: 0.26, tone: "hi" }) +
    `<path class="iso-shade" data-shade="0" d="${punch}"/>` + L(punch, { tone: "lo" }),
})));

// ---------- front lip and near end cap ----------
out.push(wood(slab(box(-11.4, 11, -0.85, 0.7), TZ, 1.5, { tone: "mid", crease: "none" }, 2, 0.2)));
out.push(wood(slab(box(11, 12, -4.8, 0.7), TZ, 2.2, { tone: "hi", crease: "none" }, 2, 0.2)));
// brass screws on the front lip
for (const x of [-9.6, 9.2]) out.push(brass(solid(rod("y", 0.7, 1.0, x, 0.36, TZ + 0.75, 8), { tone: "hi", crease: "none" })));

// two screws in the near cap's end
for (const y of [-3.6, -0.6]) out.push(brass(solid(rod("x", 12, 12.3, y, 0.34, TZ + 1.4, 8), { tone: "hi", crease: "none" })));

// ---------- on the plinth's front lip: the torn stub and a 10-yen coin ----------
{
  const cx = -6.2, cy = 2.75, ang = -0.12, z = 0, w = 5.6, d = 2.7;
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  const R = ([x, y]) => [cx + x * c - y * s, cy + x * s + y * c];
  // three straight sides; the left edge is the torn perforation, zigzagging down
  const pts = [[w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]];
  for (let i = 1; i <= 6; i++) pts.push([-w / 2 - (i % 2 ? 0.4 : 0), d / 2 - (i / 6) * d]);
  const bandPts = [[-w / 2 + 0.1, -d / 2], [w / 2, -d / 2], [w / 2, -d / 2 + 1.1], [-w / 2 + 0.1, -d / 2 + 1.1]].map(R);
  const bandD = pathOf(bandPts.map(([x, y]) => at([x, y, z + 0.25])), true);
  out.push(tix(solid(k.extrude(pts.map(R), z, 0.25, P, { convex: false }), { tone: "hi", crease: "none", inner: green(`<path class="iso-shade" data-shade="2" d="${bandD}"/>`) })));
}
out.push(brass(cyl(6.4, 2.8, 1.45, 0, 0.5, { tone: "hi", inner: L(k.ring(6.4, 2.8, 0.95, 0.5, P, 16), { tone: "lo" }) }, 16)));

const body = out.join("");
const label = "A JR train ticket with a green band, a punched hole and its right edge torn along the perforation, leaning in a small wooden ticket stand.";
console.log("solids:", solidCount());
emit({
  name: "spot-kippu", W, H, render: { w: 56, h: 56 }, ground: "surface", label, body,
  accentsFor: (t) => {
    const f = family(t);
    const s = SITE[t];
    return { wood: f.wood, ticket: t === "light" ? mix(s.green, s.paper, 0.74) : mix(s.green, s.ink, 0.58), green: f.green, bronze: f.gold };
  },
  doc: {
    title: "spot-kippu: billete JR con banda verde, perforado y picado (chip «excursiones» del hero)",
    replaces: "Sustituye a la caja sin icono del chip «excursiones» (Hero.astro, stat chips). v2: el billete ocupa el lienzo.",
    tokens: "--surface, --brown, --green, --gold, --paper, --ink",
    ground: "--anatomy-paper usa var(--surface) en vivo (el chip es --surface).",
    motion: "ninguno (estático; el flotado al pasar el ratón lo pone el integrador en CSS).",
  },
});
