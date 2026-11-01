// spot-omamori — a shrine amulet (omamori) standing on a small wooden offering stand: a coral
// brocade pouch with chamfered shoulders, a gold border and a blank centre panel (no text), the
// gold cord tied into a knot at the top with its loop, two tails and its two tails. Footer. Static.
import { k, G, P, camera, at, L, D, ac, box, slab, cyl, solid, pathOf, prism, woodPlinth, emit, family, count, S } from "../common.mjs";

const W = 40;
const H = 48;
const PW = 6.4;                 // half width of the pouch
const PZ0 = 3.2;                // pouch bottom (stands on the tray)
const PH = 17;                  // pouch height
const CH = 2.6;                 // shoulder chamfer
const PT = 2.4;                 // pouch thickness (y)
const Y0 = -PT / 2;
const FY = PT / 2;              // front face
const KZ = PZ0 + PH + 1.2;      // knot centre

camera([[-9, -6, 0], [9, -6, 0], [9, 6, 0], [-9, 6, 0], [0, 0, KZ + 5.5], [-PW, FY, PZ0 + PH], [PW, FY, PZ0 + PH]], W, H, 1.8);

const brocade = ac("coral");
const gold = ac("gold");
const out = [];

// ---------- the stand: a wooden block and a shallow tray ----------
out.push(woodPlinth(box(-9, 9, -5.5, 5.5, 1.2), 0, 2, { blur: 1, steps: 2 }));
out.push(ac("wood")(slab(box(-8, 8, -4.5, 4.5, 0.6), 2, 1.2, { tone: "mid", inner: L(k.planOutline(box(-7, 7, -3.5, 3.5, 0.4), 3.2, P, 2), { tone: "lo" }) }, 2)));

// ---------- the pouch ----------
const outline = [[-PW, 0], [PW, 0], [PW, PH - CH], [PW - CH, PH], [-PW + CH, PH], [-PW, PH - CH]];
const onFront = (pts) => pathOf(pts.map(([x, z]) => at([x, FY, PZ0 + z])), true);
const border = onFront([[-PW + 1, 1], [PW - 1, 1], [PW - 1, PH - CH - 0.4], [PW - CH - 0.4, PH - 1], [-PW + CH + 0.4, PH - 1], [-PW + 1, PH - CH - 0.4]]);
const panel = onFront([[-2.4, 3], [2.4, 3], [2.4, PH - 3.4], [-2.4, PH - 3.4]]);
// brocade: small gold lozenges on the two side fields
const loz = [];
for (const x of [-4.4, 4.4]) for (const z of [4, 7.5, 11]) loz.push(onFront([[x, z - 1.1], [x + 0.9, z], [x, z + 1.1], [x - 0.9, z]]));
out.push(brocade(solid(prism(outline, { o: [0, Y0, PZ0], u: [1, 0, 0], v: [0, 0, 1], a: [0, 1, 0] }, 0, PT), {
  tone: "hi",
  inner: gold(`<path class="iso-top" d="${panel}"/>` + L(panel + border, { tone: "mid" }) + L(loz.join(""), { tone: "hi" })),
})));
// ---------- the cord: knot, loop, two tails, and a bell ----------
// loop above the knot: a C-shaped band in the x–z plane, open at the bottom where it enters the knot
const arc = (r) => Array.from({ length: 13 }, (_, i) => { const t = -Math.PI / 2 + 0.55 + (i / 12) * (2 * Math.PI - 1.1); return [Math.cos(t) * r, KZ + 3 + Math.sin(t) * r * 1.15]; });
const loop = [...arc(2.6), ...arc(1.9).reverse()];
out.push(gold(solid(prism(loop, { o: [0, -0.4, 0], u: [1, 0, 0], v: [0, 0, 1], a: [0, 1, 0] }, 0, 0.8, { creaseCos: 0.6 }), { tone: "hi" })));
// cord running from the shoulders up to the knot
for (const s of [-1, 1]) {
  const band = [[s * 1.4, PZ0 + PH - 1.2], [s * 1.9, PZ0 + PH - 0.8], [s * 0.9, KZ], [s * 0.4, KZ - 0.3]];
  out.push(gold(solid(prism(band, { o: [0, FY - 0.2, 0], u: [1, 0, 0], v: [0, 0, 1], a: [0, 1, 0] }, 0, 0.6), { tone: "hi", crease: "none" })));
}
// tails hanging over the shoulders, then the knot: two side lobes and a centre bead
for (const sgn of [-1, 1]) {
  const tail = [[sgn * 0.5, KZ - 0.6], [sgn * 1.1, KZ - 0.6], [sgn * 2.2, KZ - 4.4], [sgn * 1.6, KZ - 4.6]];
  out.push(gold(solid(prism(tail, { o: [0, FY + 0.3, 0], u: [1, 0, 0], v: [0, 0, 1], a: [0, 1, 0] }, 0, 0.5), { tone: "hi", crease: "none" })));
}
for (const sgn of [-1, 1]) out.push(gold(count(S(G.sphereOf([sgn * 1.5, FY + 0.2, KZ + 0.2], 1.1, P, { steps: 12 }), { tone: "hi" }))));
out.push(gold(count(S(G.sphereOf([0, FY + 0.5, KZ], 1.3, P, { steps: 14 }), { tone: "hi", lit: true }))));

const body = out.join("");
const label = "An omamori shrine amulet on a small wooden stand: a coral brocade pouch with a gold cord knotted at the top and its two tails.";
emit({
  name: "spot-omamori", W, H, render: { w: 40, h: 48 }, ground: "footer", label, body,
  accentsFor: (t) => { const f = family(t); return { coral: f.coral, gold: f.gold, wood: f.wood }; },
  doc: {
    title: "spot-omamori: amuleto omamori con cordón y nudo (pie de página)",
    replaces: "Sustituye al círculo 桜 del pie (SiteFooter.tsx, bloque de identidad, 34 px).",
    tokens: "--coral, --gold y --brown del tema oscuro",
    ground: "el pie es azul marino en los dos temas (#14203a, = --primary-press del tema claro), así que el asset usa siempre la rampa oscura y no cambia con el tema; --anatomy-paper es #14203a fijo.",
    motion: "ninguno (estático).",
  },
});
