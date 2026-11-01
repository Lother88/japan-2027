// spot-ruta — a short stretch of model railway on a wooden plinth, the header of the "La ruta"
// map band: ballast, sleepers and rails in front; behind them a low platform with a yellow
// edge line, a blank station name board (ekimeihyō) on two posts and a bench; a signal mast at
// the near end whose green lamp blinks slowly; a pine at the far end. Same world as the hero.
import { k, P, camera, at, L, D, ac, box, slab, cyl, solid, faceRect, pathOf, frustum, polySolid, byDepth, halo, emit, family, count, S } from "../common.mjs";

const W = 120;
const H = 72;
const PL = box(-32, 32, -13, 9, 1.6);
const TR = { y0: -1, y1: 7, cy: 3 };        // ballast bed and track centre line
const PF = box(-26, 20, -11.5, -3.5);       // platform
const PZ = 4.2;

camera([...k.boxCorners(k.insetPlan(PL, -1.5), -3.5, 0), [-14, -8, PZ + 15], [6, -8, PZ + 15], [-29, 6.5, 18], [27, -9, 14]], W, H, 3);

const wood = ac("wood");
const moss = ac("moss");
const pine = ac("pine");
const amber = ac("amber");
const ebony = ac("ebony");
const stone = ac("stone");
const plaster = ac("plaster");
const sig = ac("lamp");
const red = ac("stop");
const out = [];

// ---------- plinth with a moss top ----------
out.push(halo(k.insetPlan(PL, -1.5), -3.5, 2.4));
out.push(wood(slab(PL, -3.5, 3, { tone: "mid", inner: L(k.sideSeam(PL, -2, P, 2), { tone: "faint" }) }, 2, 0.5)));
out.push(moss(slab(k.insetPlan(PL, 1.2), -0.5, 0.5, { tone: "mid", crease: "none" }, 2)));

// ---------- a pine at the far end, behind the platform ----------
out.push(wood(cyl(26.5, -9, 0.8, 0, 7, { tone: "hi", crease: "none" }, 6)));
out.push(pine(cyl(26.5, -9, 3.6, 5.5, 1.6, { tone: "hi", crease: "none" }, 10)));
out.push(pine(cyl(26.2, -8.6, 2.6, 8.4, 1.4, { tone: "hi", crease: "none" }, 10)));

// ---------- platform: concrete block, coping, yellow tactile line, bench, name board ----------
out.push(slab(PF, 0, PZ, { tone: "mid", inner: L(k.sideSeam(PF, 1.6, P, 2), { tone: "faint" }) }));
out.push(slab(box(PF.x - 0.4, PF.x + PF.w + 0.4, PF.y + PF.d - 1.4, PF.y + PF.d + 0.4), PZ, 0.5, { tone: "hi", crease: "none" }));
const tactile = pathOf([[PF.x + 1, PF.y + PF.d - 2.6], [PF.x + PF.w - 1, PF.y + PF.d - 2.6], [PF.x + PF.w - 1, PF.y + PF.d - 1.8], [PF.x + 1, PF.y + PF.d - 1.8]].map(([x, y]) => at([x, y, PZ])), true);
out.push(amber(`<path class="iso-top" d="${tactile}"/>`));
// bench
const BX = 11;
const BY = -9.6;
for (const x of [BX - 2.6, BX + 2.6]) out.push(wood(slab(box(x - 0.4, x + 0.4, BY - 0.8, BY + 0.8), PZ, 1.8, { tone: "hi", crease: "none" })));
out.push(wood(slab(box(BX - 3.6, BX + 3.6, BY - 1.1, BY + 1.1), PZ + 1.8, 0.5, { tone: "hi" })));
out.push(wood(slab(box(BX - 3.6, BX + 3.6, BY - 1.5, BY - 1.1), PZ + 2.3, 2, { tone: "hi", crease: "none" })));
// station name board: two posts, a white panel with the line colour band (blank, no text)
const NB = { x0: -15, x1: 5, y: -8, z0: PZ + 7.5, z1: PZ + 14.5 };
for (const x of [NB.x0 + 2.5, NB.x1 - 2.5]) out.push(slab(box(x - 0.5, x + 0.5, NB.y - 0.5, NB.y + 0.5), PZ, NB.z0 - PZ + 0.5, { tone: "hi", crease: "none" }));
const panel = box(NB.x0, NB.x1, NB.y, NB.y + 0.7);
const bandD = faceRect("y", NB.y + 0.7, NB.x0, NB.x1, NB.z0, NB.z0 + 1.8);
const arrows = pathOf([[NB.x0 + 2.2, NB.z0 + 0.9], [NB.x0 + 1.2, NB.z0 + 0.9]].map(([x, z]) => at([x, NB.y + 0.7, z]))) + pathOf([[NB.x1 - 2.2, NB.z0 + 0.9], [NB.x1 - 1.2, NB.z0 + 0.9]].map(([x, z]) => at([x, NB.y + 0.7, z])));
out.push(plaster(solid(k.slabOf(panel, NB.z0, NB.z1 - NB.z0, P, 2, 0.2), { tone: "hi", inner: pine(`<path class="iso-shade" data-shade="2" d="${bandD}"/>`) + L(faceRect("y", NB.y + 0.7, NB.x0 + 0.8, NB.x1 - 0.8, NB.z0 + 2.6, NB.z1 - 0.8), { tone: "faint" }) })));
out.push(slab(box(NB.x0 - 0.4, NB.x1 + 0.4, NB.y - 0.3, NB.y + 1), NB.z1, 0.6, { tone: "hi", crease: "none" }));

// ---------- track: ballast bed, sleepers (one solid, they never overlap), two rails ----------
out.push(stone(solid(frustum(box(PL.x + 1.5, PL.x + PL.w - 1.5, TR.y0, TR.y1), 0, box(PL.x + 1.5, PL.x + PL.w - 1.5, TR.y0 + 1.2, TR.y1 - 1.2), 1.4), { tone: "mid", crease: "none" })));
const sleepers = [];
for (let x = PL.x + 4; x < PL.x + PL.w - 4; x += 5.6) sleepers.push(k.slabOf(box(x - 0.7, x + 0.7, TR.cy - 3.2, TR.cy + 3.2), 1.4, 0.6, P, 2));
out.push(wood(count(S({ fill: sleepers.map((s) => s.fill).join(""), outline: sleepers.map((s) => s.outline).join(""), crease: "", top: sleepers.map((s) => s.top).join(""), shades: [0, 1, 2, 3].map((i) => sleepers.map((s) => s.shades[i]).join("")) }, { tone: "mid", crease: "none" }))));
for (const y of [TR.cy - 1.9, TR.cy + 1.9]) out.push(slab(box(PL.x + 1.5, PL.x + PL.w - 1.5, y - 0.35, y + 0.35), 2, 0.8, { tone: "hi", crease: "none" }));
// buffer stop at the far end
out.push(wood(slab(box(PL.x + PL.w - 4, PL.x + PL.w - 2.5, TR.cy - 3, TR.cy + 3), 2, 2.4, { tone: "hi" })));

// ---------- the signal at the near end: base, mast, head with hood and two lamps ----------
const SX = -27;
const SY = 7.6;
out.push(slab(box(SX - 1.4, SX + 1.4, SY - 1.4, SY + 1.4), 0, 1.2, { tone: "mid" }));
out.push(cyl(SX, SY, 0.5, 1.2, 13, { tone: "hi", crease: "none" }, 8));
const HD = box(SX - 1.1, SX + 1.1, SY - 1.3, SY + 1.3, 0.6);
out.push(ebony(slab(HD, 12.5, 6, { tone: "hi" }, 2)));
const lampAt = (z) => k.sideRing([SX + 1.1, SY, z], 0.8, "x", P, 12);
const fillLamp = (z) => `<path d="${lampAt(z)}" style="fill:var(--anatomy-dot);stroke:none"/>`;
out.push(red(fillLamp(16.9) + L(lampAt(16.9), { tone: "lo" })));
out.push(a_blink(sig(fillLamp(14.2) + L(lampAt(14.2), { tone: "mid" }))));
for (const z of [17.9, 15.2]) out.push(ebony(slab(box(SX + 1.1, SX + 2.1, SY - 1, SY + 1), z, 0.35, { tone: "hi", crease: "none" })));

function a_blink(svg) {
  return `<g class="am-blink" style="--am-period:4.80s;--am-delay:0s;--am-min:.25">${svg}</g>`;
}

const body = out.join("");
const label = "A stretch of model railway on a wooden plinth: a platform with a blank station name board and a bench, rails on sleepers, and a signal whose green lamp blinks.";
emit({
  name: "spot-ruta", W, H, render: { w: 120, h: 72 }, ground: "paper", label, body,
  accentsFor: (t) => {
    const f = family(t);
    return { wood: f.wood, moss: f.moss, pine: f.pine, amber: f.amber, ebony: f.ebony, stone: f.stone, plaster: f.plaster, lamp: { hex: f.green, mode: "ink" }, stop: { hex: f.coral, mode: "ink" } };
  },
  doc: {
    title: "spot-ruta: tramo de vía con cartel de estación (cabecera de la banda «La ruta»)",
    replaces: "Va en la cabecera de la banda «La ruta» (el mapa sale del hero a su propia banda).",
    tokens: "--paper, --brown, --green, --amber, --coral, --ink",
    ground: "--anatomy-paper usa var(--paper) en vivo.",
    motion: "la luz verde de la señal parpadea despacio (4,8 s, keyframes `spot-ruta-blink`); se detiene con prefers-reduced-motion.",
  },
});
