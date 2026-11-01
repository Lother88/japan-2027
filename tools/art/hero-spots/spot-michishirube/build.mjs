// spot-michishirube — a wooden waymark post on a mossy stone footing: a square post with a small
// gabled cap, a bracing arm, and a board shaped as an arrow pointing DOWN (a coral chevron
// painted on it) hanging from the arm on one ring; it sways ±3° in its own plane (CSS).
// Stepping stones lead on, a low bamboo fence and a shrub behind. Replaces the "Desplázate" cue.
import { k, G, P, camera, at, L, D, ac, box, slab, cyl, solid, faceLine, pathOf, prism, frustum, gable, stone, swingInPlane, byDepth, halo, emit, family } from "../common.mjs";

const W = 48;
const H = 64;
// The arm and board turn to face the viewer: UR runs screen-right, NV points at the camera.
const AZ = (40 * Math.PI) / 180;
const UR = [Math.sin(AZ), -Math.cos(AZ), 0];
const NV = [Math.cos(AZ), Math.sin(AZ), 0];
const along = (p, d, s) => p.map((c, i) => c + d[i] * s);
const C0 = [-0.5, 0.5, 0];
const POST = { s: 1.8, z1: 30 };
const PC = along(C0, UR, -6.5);                        // post centre (plan)
const ARM = { z: 26.5, len: 13.5 };
const PIV = along([PC[0], PC[1], ARM.z - 0.6], UR, 11.2); // the ring's hook point
const BTOP = PIV[2] - 1.6;                             // top edge of the board
const BH = 14.5;                                       // to the tip of the arrow

camera([[-9, -9, 0], [9, -9, 0], [9, 10, 0], [-9, 10, 0], [PC[0], PC[1], POST.z1 + 3.5], along(along(PIV, UR, 6), [0, 0, 1], -1), along(PIV, UR, -6)], W, H, 2);

const wood = ac("wood");
const roof = ac("roof");
const moss = ac("moss");
const coral = ac("coral");
const pine = ac("pine");
const out = [];
const xc = PC[0];
const yc = PC[1];
POST.x = xc - POST.s / 2;
POST.y = yc - POST.s / 2;

// ---------- the ground: a moss mound on a stone edge ----------
const ground = k.circleRing(0, 1, 9, 16).map(([x, y], i) => [x * (1 + 0.04 * Math.sin(i * 2.3)), y * 0.92]);
out.push(halo({ x: -9.5, y: -8, w: 19, d: 18, r: 9 }, -1.6, 1.2));
out.push(solid(k.extrude(ground, -1.6, 1.2, P, { bevel: 0.3 }), { tone: "mid" }));
out.push(moss(solid(k.extrude(ground.map(([x, y]) => [x * 0.94, 1 + (y - 1) * 0.94]), -0.4, 0.6, P), { tone: "mid", crease: "none" })));

// ---------- the post: footing stone, post, a blank name plaque, gabled cap ----------
out.push(stone(-7, 4, 1.4, 1.2, 0.2, 2));
out.push(solid(frustum(box(xc - 2.6, xc + 2.6, yc - 2.6, yc + 2.6), 0.2, box(xc - 1.8, xc + 1.8, yc - 1.8, yc + 1.8), 2.8), { tone: "mid" }));
const pb = box(POST.x, POST.x + POST.s, POST.y, POST.y + POST.s);
out.push(wood(slab(pb, 2.8, POST.z1 - 2.8, { tone: "mid", inner: L(faceLine("y", POST.y + POST.s, xc, 4, xc, 11), { tone: "faint" }) })));
out.push(wood(slab(box(POST.x - 0.3, POST.x + POST.s + 0.3, POST.y + POST.s, POST.y + POST.s + 0.4), 14, 9, { tone: "hi", crease: "none" })));
out.push(roof(solid(gable(pb, POST.z1, 1.6, { axis: "y", ov: 0.9, t: 0.5 }), { tone: "hi" })));
out.push(roof(slab(box(xc - 0.3, xc + 0.3, POST.y - 1, POST.y + POST.s + 1), POST.z1 + 1.9, 0.4, { tone: "hi", crease: "none" })));

// ---------- the arm (turned to face the viewer) with its diagonal brace and end cap ----------
const rect = (c, l0, l1, h) => [along(along(c, UR, l0), NV, -h), along(along(c, UR, l1), NV, -h), along(along(c, UR, l1), NV, h), along(along(c, UR, l0), NV, h)].map((p) => [p[0], p[1]]);
out.push(wood(solid(k.extrude(rect(PC, POST.s / 2, ARM.len, 0.6), ARM.z, 1.3, P), { tone: "mid" })));
const brace = [[0, 0], [0.9, 0], [6.2, 5.3], [6.2, 6.2]];
out.push(wood(solid(prism(brace, { o: along([PC[0], PC[1], ARM.z - 6.2], UR, POST.s / 2), u: UR, v: [0, 0, 1], a: NV }, -0.4, 0.4), { tone: "mid", crease: "none" })));
out.push(wood(solid(k.extrude(rect(PC, ARM.len - 0.2, ARM.len + 0.5, 0.8), ARM.z - 0.3, 1.9, P), { tone: "hi", crease: "none" })));
// hook: from the arm's underside to the pivot
out.push(L(pathOf([at([PIV[0], PIV[1], ARM.z]), at(PIV)]), { tone: "hi" }));

// ---------- the board: an arrow pointing down, painted chevron, on a ring (sways) ----------
const BW = 6.3;
const shape = [[-BW, 0], [BW, 0], [BW, -8.8], [0, -BH], [-BW, -8.8]];
const T = 0.8;
const frame = { o: along([PIV[0], PIV[1], BTOP], NV, -T / 2), u: UR, v: [0, 0, 1], a: NV };
const F0 = along([PIV[0], PIV[1], BTOP], NV, T / 2);
const onFace = (pts) => pathOf(pts.map(([x, z]) => at(along(along(F0, UR, x), [0, 0, 1], z))), true);
const border = onFace([[-BW + 0.9, -0.9], [BW - 0.9, -0.9], [BW - 0.9, -8.4], [0, -BH + 1.5], [-BW + 0.9, -8.4]]);
const chevron = onFace([[-3.8, -3.2], [0, -7], [3.8, -3.2], [3.8, -5.6], [0, -9.4], [-3.8, -5.6]]);
const board = wood(solid(prism(shape, frame, 0, T), {
  tone: "hi",
  inner: L(border, { tone: "lo" }) + coral(`<path class="iso-top" d="${chevron}"/>` + L(chevron, { tone: "mid" })),
}));
const eye = along(F0, [0, 0, 1], 0.8);
const ring = L(pathOf(Array.from({ length: 12 }, (_, i) => at(along(along(eye, UR, Math.cos((i / 12) * Math.PI * 2) * 0.8), [0, 0, 1], Math.sin((i / 12) * Math.PI * 2) * 0.8))), true), { tone: "hi" });
out.push(swingInPlane(board + ring, PIV, UR, [0, 0, -1], { from: -3, to: 3, period: 4200 }));

// ---------- stepping stones leading on, toward the viewer ----------
for (const [x, y, s] of byDepth([[1.5, 5, 4], [3.5, 8.2, 5], [-2, 8, 6], [6.4, 2.6, 7]], (p) => [p[0], p[1], 0])) out.push(stone(x, y, 1.9, 0.7, 0.2, s));

const body = out.join("");
const label = "A wooden waymark post on a mossy stone footing, its arrow-shaped board pointing down and swaying gently.";
emit({
  name: "spot-michishirube", W, H, render: { w: 48, h: 64 }, ground: "paper", label, body,
  accentsFor: (t) => { const f = family(t); return { wood: f.wood, roof: f.roof, moss: f.moss, coral: f.coral, pine: f.pine }; },
  doc: {
    title: "spot-michishirube: poste indicador con tablilla hacia abajo (aviso «Desplázate»)",
    replaces: "Sustituye a la flecha con ignBounce del aviso «Desplázate» (Hero.tsx, data-scrollcue).",
    tokens: "--paper, --brown, --coral, --green, --ink",
    ground: "--anatomy-paper usa var(--paper) en vivo (el hero pasa a --paper liso).",
    motion: "la tablilla oscila ±3° en su propio plano (4,2 s, keyframes `spot-michishirube-swing`); se detiene con prefers-reduced-motion.",
  },
});
