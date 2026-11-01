// spot-machiya — a small Kyoto townhouse (machiya) on a wooden plinth: stone footing, a dark
// wooden ground floor with its kōshi lattice, a coral noren at the door, a pent roof, the low
// plastered upper floor with a slatted mushiko window, a tiled gable roof with ridge ends, the
// curved bamboo inuyarai, a folding bench and a lantern. Stat chip "bases". Static.
import { k, P, camera, L, D, ac, box, slab, cyl, solid, halo, faceLine, faceRect, prism, frameYZ, woodPlinth, gable, stone, byDepth, emit, family } from "../common.mjs";

const W = 56;
const H = 56;
const PL = box(-17, 17, -14, 16, 2);
const HO = { x0: -11, x1: 11, y0: -11, y1: 7 };
const Z = { base: 1.2, g: 12.5, u: 19.5, ridge: 26 };
const FY = HO.y1;

camera([...k.boxCorners(k.insetPlan(PL, -1.5), -3, 0), [HO.x0 - 1.5, (HO.y0 + HO.y1) / 2, Z.ridge + 1.6], [HO.x1 + 1.5, (HO.y0 + HO.y1) / 2, Z.ridge + 1.6]], W, H, 2.5);

const wood = ac("wood");
const roof = ac("roof");
const plaster = ac("plaster");
const coral = ac("coral");
const moss = ac("moss");
const out = [];
const hb = box(HO.x0, HO.x1, HO.y0, HO.y1);

// ---------- plinth, gravel strip and stepping stones ----------
out.push(woodPlinth(PL, -3, 3, { blur: 1.2, steps: 2 }));
out.push(moss(slab(box(PL.x + 1.5, PL.x + PL.w - 1.5, HO.y0 - 1.5, PL.y + PL.d - 1.5), 0, 0.4, { tone: "mid", crease: "none" })));
for (const [x, y, s] of byDepth([[-4.5, 11.2, 1], [-1, 13.2, 2], [6, 12.6, 3]], (p) => [p[0], p[1], 0])) out.push(stone(x, y, 1.6, 0.8, 0.4, s));

// ---------- stone footing and the ground floor ----------
out.push(slab(k.insetPlan(hb, -0.6), 0.4, Z.base - 0.4, { tone: "mid", crease: "none" }));
const lattice = [];
for (let x = HO.x0 + 1.4; x < 1.5; x += 1.15) lattice.push(faceLine("y", FY, x, Z.base + 0.8, x, Z.g - 1.2));
const ground = [
  L(lattice.join("") + faceLine("y", FY, HO.x0 + 0.8, Z.base + 0.8, 1.8, Z.base + 0.8) + faceLine("y", FY, HO.x0 + 0.8, Z.g - 1.2, 1.8, Z.g - 1.2), { tone: "lo" }),
  L(faceRect("y", FY, 2.6, 9.6, Z.base, Z.g - 1.6), { tone: "lo" }),
  L(faceLine("x", HO.x1, HO.y0 + 6, Z.base, HO.y0 + 6, Z.g) + faceLine("x", HO.x1, HO.y0 + 12, Z.base, HO.y0 + 12, Z.g), { tone: "faint" }),
].join("");
out.push(wood(slab(hb, Z.base, Z.g - Z.base, { tone: "mid", inner: ground }, 2)));
// corner posts standing proud of the wall
for (const x of [HO.x0, HO.x1 - 0.9]) out.push(wood(slab(box(x, x + 0.9, FY, FY + 0.5), Z.base, Z.g - Z.base, { tone: "hi", crease: "none" })));
// inuyarai: the curved bamboo screen at the foot of the lattice
const arcOf = (ry, rz) => Array.from({ length: 7 }, (_, i) => { const t = (i / 6) * (Math.PI / 2); return [FY + ry * Math.sin(t), Z.base + rz * Math.cos(t)]; });
const ia = [...arcOf(2, 3.4), ...arcOf(1.65, 3.05).reverse()];
out.push(wood(solid(prism(ia, frameYZ(0, 0), HO.x0 + 0.9, 1.2, { creaseCos: 0.8 }), { tone: "hi" })));
// noren at the door: two coral panels with a slit
out.push(coral(slab(box(2.8, 9.4, FY + 0.15, FY + 0.45), Z.g - 6.6, 4.6, { tone: "hi", crease: "none", inner: L(faceLine("y", FY + 0.45, 6.1, Z.g - 6.6, 6.1, Z.g - 3.6), { tone: "lo" }) })));
// lantern on a bracket by the door
out.push(coral(cyl(1.2, FY + 1.3, 0.9, Z.g - 5.6, 2.2, { tone: "hi", crease: "none" }, 10)));
out.push(cyl(1.2, FY + 1.3, 0.6, Z.g - 3.4, 0.5, { tone: "hi", crease: "none" }, 8));
out.push(wood(slab(box(0.9, 1.5, FY, FY + 1.5), Z.g - 2.9, 0.4, { tone: "hi", crease: "none" })));

// ---------- pent roof over the street front ----------
const pent = [[FY - 0.2, Z.g + 0.6], [FY + 2.2, Z.g - 0.5], [FY + 2.2, Z.g + 0.1], [FY - 0.2, Z.g + 1.2]];
out.push(roof(solid(prism(pent, frameYZ(0, 0), HO.x0 - 0.8, HO.x1 + 0.8), { tone: "hi" })));

// ---------- upper floor: plaster with a mushiko window ----------
const UY = FY - 0.4;
const ub = box(HO.x0 + 0.3, HO.x1 - 0.3, HO.y0 + 0.3, UY);
const slats = [];
for (let x = -5.6; x <= 5.7; x += 1.4) slats.push(faceLine("y", UY, x, Z.g + 2.4, x, Z.u - 1.8));
out.push(plaster(slab(ub, Z.g, Z.u - Z.g, { tone: "mid", inner: L(faceRect("y", UY, -6.4, 6.4, Z.g + 2.4, Z.u - 1.8), { tone: "mid" }) + L(slats.join(""), { tone: "lo" }) })));
// gable walls under the roof (plaster) and the tiled roof, ridge along x
const yc = (ub.y + ub.y + ub.d) / 2;
const half = ub.d / 2;
out.push(plaster(solid(prism([[-half, 0], [half, 0], [0, Z.ridge - Z.u - 0.4]], { o: [0, yc, Z.u], u: [0, 1, 0], v: [0, 0, 1], a: [1, 0, 0] }, ub.x, ub.x + ub.w), { tone: "mid" })));
out.push(roof(solid(gable(ub, Z.u - 0.6, Z.ridge - Z.u, { axis: "x", ov: 1.2, t: 0.9 }), { tone: "hi", inner: "" })));
// ridge cap and its two end tiles
out.push(roof(slab(box(ub.x - 1.2, ub.x + ub.w + 1.2, yc - 0.7, yc + 0.7), Z.ridge + 0.1, 0.9, { tone: "hi", crease: "none" })));
for (const x of [ub.x - 1.6, ub.x + ub.w + 0.4]) out.push(roof(slab(box(x, x + 1.2, yc - 1, yc + 1), Z.ridge, 1.8, { tone: "hi", crease: "none" })));
// ---------- in front: a rain barrel and a potted pine ----------
// a rain barrel with a hoop and its lid by the gable wall
out.push(wood(cyl(HO.x1 + 2.6, -4, 1.9, 0.4, 3.6, { tone: "hi", inner: L(k.sideArc(HO.x1 + 2.6, -4, 1.9, 2.6, P, 12), { tone: "lo" }) }, 10)));
out.push(wood(cyl(HO.x1 + 2.6, -4, 2.1, 4, 0.5, { tone: "hi", crease: "none" }, 10)));
out.push(cyl(8.5, 12, 1.4, 0.4, 1.6, { tone: "mid", crease: "none" }, 10));
out.push(ac("pine")(cyl(8.5, 12, 1.9, 2.4, 1.6, { tone: "hi", crease: "none" }, 10)));

const body = out.join("");
const label = "A small Kyoto townhouse (machiya) on a wooden plinth: a wooden lattice front with a red noren at the door, a plastered upper floor and a tiled gable roof.";
emit({
  name: "spot-machiya", W, H, render: { w: 56, h: 56 }, ground: "surface", label, body,
  accentsFor: (t) => { const f = family(t); return { wood: f.wood, roof: f.roof, plaster: f.plaster, coral: f.coral, moss: f.moss, pine: f.pine }; },
  doc: {
    title: "spot-machiya: casa machiya (chip «bases» del hero)",
    replaces: "Sustituye a la caja sin icono del chip «bases» (Hero.astro, stat chips).",
    tokens: "--surface, --brown, --coral, --green, --ink, --paper",
    ground: "--anatomy-paper usa var(--surface) en vivo (el chip es --surface).",
    motion: "ninguno (estático; el flotado al pasar el ratón lo pone el integrador en CSS).",
  },
});
