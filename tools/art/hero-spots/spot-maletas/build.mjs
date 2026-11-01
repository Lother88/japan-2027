// spot-maletas — four suitcases for four travellers, grouped on a wooden plinth: a large coral
// hard-shell spinner with its handle up and a luggage tag, a navy cabin case, an old wooden
// trunk with brass straps lying in front, and a small cream vanity case on the trunk.
// Stat chip "viajeros". Static.
import { k, P, camera, at, L, D, ac, box, slab, cyl, solid, faceLine, pathOf, woodPlinth, byDepth, emit, family } from "../common.mjs";

const W = 56;
const H = 56;
const PL = box(-15, 14, -9, 13, 2);
const A = box(-12.5, -2.5, -7, -1, 1.2);     // big spinner
const B = box(0, 8.5, -6.5, -1.5, 1);        // cabin case
const C = box(-12, 7, 1.5, 10, 0.6);         // trunk
const Dv = box(-9, -2.5, 3, 8.5, 1);         // vanity case on the trunk
const ZA = [1.4, 21];
const ZB = [1.4, 15];
const ZC = 5.5;

camera([...k.boxCorners(k.insetPlan(PL, -1.5), -3, 0), [A.x, A.y, ZA[1] + 6], [A.x + A.w, A.y + A.d, ZA[1] + 6], [B.x + B.w, B.y, ZB[1] + 2]], W, H, 2.5);

const coral = ac("coral2");
const navy = ac("ebony");
const wood = ac("wood");
const brass = ac("gold");
const out = [];

out.push(woodPlinth(PL, -3, 3, { blur: 1.2, steps: 2 }));

// wheels under the two upright cases (only the front ones show)
const wheels = (b, z) => byDepth([[b.x + 1.2, b.y + b.d - 0.8], [b.x + b.w - 1.2, b.y + b.d - 0.8], [b.x + b.w - 1.2, b.y + 0.8]]).map(([x, y]) => navy(cyl(x, y, 0.75, 0, z, { tone: "hi", crease: "none" }, 6))).join("");

// ---------- the big coral spinner: ribs on its face, telescopic handle, a tag ----------
out.push(wheels(A, ZA[0]));
const ribsA = [-10.5, -7.5, -4.5].map((x) => faceLine("y", A.y + A.d, x, ZA[0], x, ZA[1])).join("");
const seamA = faceLine("x", A.x + A.w, A.y + 0.4, (ZA[0] + ZA[1]) / 2, A.y + A.d - 0.4, (ZA[0] + ZA[1]) / 2);
out.push(coral(slab(A, ZA[0], ZA[1] - ZA[0], { tone: "hi", inner: L(ribsA, { tone: "lo" }) + L(seamA, { tone: "mid" }) }, 2, 0.4)));
const HX = [A.x + 2.6, A.x + A.w - 2.6];
const HY = A.y + 1.6;
out.push(navy(slab(box(HX[0] - 1.2, HX[1] + 1.2, HY - 1.1, HY + 1.1), ZA[1], 0.4, { tone: "hi", crease: "none" })));
for (const x of HX) out.push(navy(slab(box(x - 0.45, x + 0.45, HY - 0.45, HY + 0.45), ZA[1], 5, { tone: "hi", crease: "none" })));
out.push(navy(slab(box(HX[0] - 0.6, HX[1] + 0.6, HY - 0.8, HY + 0.8, 0.4), ZA[1] + 5, 1.1, { tone: "hi", crease: "none" }, 2)));
// side carry handle on the near face, and the luggage tag hanging from it
out.push(navy(slab(box(A.x + A.w, A.x + A.w + 0.7, -5.4, -2.6), 13, 1.2, { tone: "hi", crease: "none" })));
out.push(brass(slab(box(A.x + A.w + 0.7, A.x + A.w + 1, -5, -2), 7.6, 3.8, { tone: "hi", crease: "none", inner: L(faceLine("x", A.x + A.w + 1, -4.4, 10, -2.6, 10), { tone: "lo", free: true }) })));
out.push(L(pathOf([at([A.x + A.w + 0.85, -3.5, 11.4]), at([A.x + A.w + 0.7, -4, 13])]), { tone: "mid" }));

// ---------- the navy cabin case: carry handle on top ----------
out.push(wheels(B, ZB[0]));
const ribsB = [2.5, 6].map((x) => faceLine("y", B.y + B.d, x, ZB[0], x, ZB[1])).join("");
out.push(navy(slab(B, ZB[0], ZB[1] - ZB[0], { tone: "hi", inner: L(ribsB, { tone: "mid" }) }, 2, 0.4)));
for (const x of [B.x + 2.6, B.x + B.w - 2.6]) out.push(navy(slab(box(x - 0.4, x + 0.4, -4.4, -3.6), ZB[1], 1.2, { tone: "hi", crease: "none" })));
out.push(navy(slab(box(B.x + 2, B.x + B.w - 2, -4.6, -3.4, 0.4), ZB[1] + 1.2, 0.7, { tone: "hi", crease: "none" }, 2)));

// ---------- the wooden trunk: brass straps, corner caps and lock as inlays on its faces ----------
const lidZ = ZC - 1.6;
const FYc = C.y + C.d;
const RXc = C.x + C.w;
const top = (pts) => pathOf(pts.map(([x, y]) => at([x, y, ZC])), true);
const front = (x0, x1, z0, z1) => pathOf([[x0, z0], [x1, z0], [x1, z1], [x0, z1]].map(([x, z]) => at([x, FYc, z])), true);
const side = (y0, y1, z0, z1) => pathOf([[y0, z0], [y1, z0], [y1, z1], [y0, z1]].map(([y, z]) => at([RXc, y, z])), true);
const straps = [C.x + 3.5, RXc - 3.5];
const inlay = [
  ...straps.map((x) => `<path class="iso-top" d="${top([[x - 0.9, C.y], [x + 0.9, C.y], [x + 0.9, FYc], [x - 0.9, FYc]])}"/>`),
  ...straps.map((x) => `<path class="iso-shade" data-shade="2" d="${front(x - 0.9, x + 0.9, 0, ZC)}"/>`),
  `<path class="iso-shade" data-shade="2" d="${front(-3.4, -1.4, lidZ - 1.2, lidZ + 1)}"/>`,
  `<path class="iso-shade" data-shade="2" d="${front(C.x, C.x + 1.6, 0, 1.6) + front(RXc - 1.6, RXc, 0, 1.6) + front(C.x, C.x + 1.6, ZC - 1.6, ZC) + front(RXc - 1.6, RXc, ZC - 1.6, ZC)}"/>`,
  `<path class="iso-shade" data-shade="0" d="${side(FYc - 1.6, FYc, 0, 1.6) + side(FYc - 1.6, FYc, ZC - 1.6, ZC)}"/>`,
].join("");
out.push(wood(slab(C, 0, ZC, { tone: "mid", inner: brass(inlay) + L(k.sideSeam(C, lidZ, P, 2), { tone: "lo" }) + brass(D([[-2.4, FYc, lidZ - 0.3]], { size: 0.3, tone: "hi" })) }, 2, 0.4)));
// leather end handle on the near side
out.push(wood(slab(box(RXc, RXc + 0.6, 3.6, 7.6, 0.2), 2.6, 0.9, { tone: "hi", crease: "none" })));

// ---------- the cream vanity case on the trunk ----------
out.push(slab(Dv, ZC + 0.2, 4.6, { tone: "mid", inner: L(k.sideSeam(Dv, ZC + 3.2, P, 2), { tone: "lo" }) }, 2, 0.4));
for (const x of [Dv.x + 2, Dv.x + Dv.w - 2]) out.push(brass(slab(box(x - 0.35, x + 0.35, 5.4, 6.1), ZC + 4.8, 0.9, { tone: "hi", crease: "none" })));
out.push(brass(slab(box(Dv.x + 1.4, Dv.x + Dv.w - 1.4, 5.3, 6.2, 0.3), ZC + 5.7, 0.5, { tone: "hi", crease: "none" }, 2)));
out.push(D([[Dv.x + 1.6, Dv.y + Dv.d, ZC + 3.2], [Dv.x + Dv.w - 1.6, Dv.y + Dv.d, ZC + 3.2]], { size: 0.25, tone: "hi" }));

const body = out.join("");
const label = "Four suitcases on a wooden plinth: a coral spinner with its handle up, a navy cabin case, an old wooden trunk with brass straps and a small vanity case.";
emit({
  name: "spot-maletas", W, H, render: { w: 56, h: 56 }, ground: "surface", label, body,
  accentsFor: (t) => { const f = family(t); return { wood: f.wood, coral2: f.coral2, ebony: f.ebony, gold: f.gold }; },
  doc: {
    title: "spot-maletas: cuatro maletas (chip «viajeros» del hero)",
    replaces: "Sustituye a la caja sin icono del chip «viajeros» (Hero.tsx, stat chips).",
    tokens: "--surface, --brown, --coral2, --gold, --ink, --paper",
    ground: "--anatomy-paper usa var(--surface) en vivo (el chip es --surface).",
    motion: "ninguno (estático; el flotado al pasar el ratón lo pone el integrador en CSS).",
  },
});
