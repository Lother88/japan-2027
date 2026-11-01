// spot-toro-toggle — a small stone lantern (tōrō) for the theme toggle, drawn bold to read at
// 32 px: base, post, platform, fire box, a wide hipped cap and the jewel, on a moss pad.
// Light theme: unlit (dark panes). Dark theme: the panes glow amber and a soft flame pulses.
import { k, G, P, camera, at, L, ac, box, slab, cyl, solid, faceRect, frustum, polySolid, stone, halo, emit, family, count, S } from "../common.mjs";

const W = 32;
const H = 32;
const FB = { h: 2.6, z0: 10.4, z1: 15.6 };      // fire box: half width, bottom, top
const CAP = { z0: 15.6, eave: 5.2, z1: 19.6 };

camera([[-5, -5, 0], [5, -5, 0], [5, 5, 0], [-5, 5, 0], [0, 0, 23.6], [CAP.eave, CAP.eave, CAP.z0], [-CAP.eave, -CAP.eave, CAP.z0 + 1]], W, H, 1.2);

const moss = ac("moss");
const pane = ac("pane");
const st = ac("stone");
const out = [];

// moss pad and the stone base
out.push(halo({ x: -5.6, y: -5.6, w: 11.2, d: 11.2, r: 5.6 }, -0.8, 0.8));
out.push(moss(cyl(0, 0, 5, -0.8, 0.8, { tone: "mid", crease: "none" }, 16)));
out.push(st(cyl(0, 0, 4.2, 0, 1.6, { tone: "mid" }, 12, 0.3)));
out.push(st(solid(frustum(box(-3, 3, -3, 3), 1.6, box(-2.1, 2.1, -2.1, 2.1), 3.2), { tone: "mid", crease: "none" })));
// the post, with a carved band
out.push(st(cyl(0, 0, 1.3, 3.2, 5.4, { tone: "mid", inner: L(k.sideArc(0, 0, 1.3, 6, P, 10), { tone: "lo" }) }, 10)));
// platform (chūdai)
out.push(st(solid(frustum(box(-2.2, 2.2, -2.2, 2.2), 8.6, box(-3.4, 3.4, -3.4, 3.4), 9.4), { tone: "mid", crease: "none" })));
out.push(st(slab(box(-3.4, 3.4, -3.4, 3.4), 9.4, 1, { tone: "mid" })));

// fire box with a window on each visible face: dark panes by day, lit at night
const win = faceRect("y", FB.h, -1.3, 1.3, FB.z0 + 1, FB.z1 - 1.2) + faceRect("x", FB.h, -1.3, 1.3, FB.z0 + 1, FB.z1 - 1.2);
const panes = pane(`<path d="${win}" style="fill:var(--anatomy-dot);stroke:none"/>`);
out.push(st(slab(box(-FB.h, FB.h, -FB.h, FB.h), FB.z0, FB.z1 - FB.z0, { tone: "mid", inner: panes + L(win, { tone: "lo" }) })));

// night only: a soft glow around the fire box that breathes, and a brighter flame core
const [gx, gy] = at([0, 0, (FB.z0 + FB.z1) / 2]);
const sc = P.scale;
out.push(`<g class="x-night">${pane(`<g class="am-pulse" style="--am-period:2.80s;--am-delay:0s;--am-min:.45"><ellipse cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" rx="${(5.2 * sc).toFixed(1)}" ry="${(4.4 * sc).toFixed(1)}" style="fill:var(--anatomy-dot);stroke:none;opacity:.42;filter:blur(1.6px)"/></g>`)}</g>`);

// the cap: a thin eave slab under a hipped pyramid, then the lotus ring and the jewel
out.push(st(solid(frustum(box(-CAP.eave, CAP.eave, -CAP.eave, CAP.eave), CAP.z0, box(-CAP.eave - 0.2, CAP.eave + 0.2, -CAP.eave - 0.2, CAP.eave + 0.2), CAP.z0 + 0.8), { tone: "mid", crease: "none" })));
out.push(st(solid(frustum(box(-CAP.eave - 0.2, CAP.eave + 0.2, -CAP.eave - 0.2, CAP.eave + 0.2), CAP.z0 + 0.8, box(-0.9, 0.9, -0.9, 0.9), CAP.z1), { tone: "mid" })));
out.push(st(cyl(0, 0, 1.2, CAP.z1, 0.8, { tone: "mid", crease: "none" }, 10)));
out.push(st(count(S(G.sphereOf([0, 0, CAP.z1 + 2], 1.4, P, { steps: 16 }), { tone: "mid" }))));

const body = out.join("");
const label = "A small stone lantern; at night its fire box glows.";
emit({
  name: "spot-toro-toggle", W, H, render: { w: 32, h: 32 }, ground: "surface", label, body, motionTheme: "dark",
  accentsFor: (t) => { const f = family(t); return { moss: f.moss, pane: f.pane, stone: f.stone }; },
  doc: {
    title: "spot-toro-toggle: tōrō de piedra para el botón de tema",
    replaces: "Sustituye a los iconos luna/sol de ThemeToggle.tsx (32 px dentro del botón de 50 px; el botón conserva aria-label).",
    tokens: "--surface, --slate, --green, --amber, --ink, --paper",
    ground: "--anatomy-paper usa var(--surface) en vivo (el botón es --surface).",
    motion: "solo en oscuro: los vanos se encienden (ámbar) y un halo de llama pulsa (2,8 s, keyframes `spot-toro-toggle-pulse`); en claro está apagado y quieto. Se detiene con prefers-reduced-motion.",
  },
});
