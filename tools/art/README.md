# Generadores del arte isométrico

Scripts que producen los `*.markup.ts` de `src/features/landing/iso/` (21 días) y
`src/features/landing/hero-art/` (maqueta del hero, banda «Calle» y 8 spots). Esos ficheros son
**generados**: no se editan a mano, se regeneran desde aquí.

## Requisitos

- Node 20 o superior.
- La skill **anatomy-asset** instalada (su `kit/` de geometría isométrica). Por defecto se busca
  en `~/.claude/skills/anatomy-asset/`; si está en otro sitio, define `ANATOMY_ASSET_DIR`.

## Uso

```sh
node tools/art/build-all.mjs --check   # regenera en un directorio temporal y compara con src/
node tools/art/build-all.mjs           # regenera y escribe en src/features/landing
```

`--check` debe terminar con «todo el arte de src/ se reproduce byte a byte». Si algo difiere,
revisa la salida que indica antes de escribir.

## Quién lo consume

- En línea en el HTML, en el build: la maqueta del hero y los 6 spots sobre el pliegue
  (`src/features/landing/hero-art/heroInline.ts`, usado por `HeroArt.astro` y `ArtBox.astro`).
- Diferidos: los 21 días, la banda «Calle» (con sus capas animadas), spot-ruta y spot-omamori, que `src/scripts/lazy-art.ts`
  importa con `import()` (registros `iso/registry.ts` y `hero-art/registry.ts`) cuando su caja se
  acerca al viewport.

Todo se inserta como SVG en línea (no `<img>`): sus `<style>` dependen de `[data-theme]` en `<html>`
y de las reglas de pausa `[data-art-paused] *` / `[data-illus][data-paused] *`.

## Qué hace cada parte

| Carpeta | Genera | Notas |
|---|---|---|
| `iso/dayNN/build.mjs` | `iso/out/dayNNIso.markup.ts` | Una escena por día. Comparten librerías por tandas (`lib-09-26`, `lib-d13-29`, `lib-d15-19.mjs`, `common-d20-25.mjs`). |
| `kinkakuji/build.mjs` | `iso/out/kinkakujiIso.markup.ts` | Piloto del día 21; `import-iso.mjs` lo normaliza al esquema `d21-`. |
| `hero/banda-calle` | `hero/out/bandaCalle.markup.ts` | Banda «Calle» de la sección «La ruta»: una calle japonesa continua (sin módulos repetidos). La base es estática; el vapor y los brillos nocturnos van en capas `<svg data-art-layer>` aparte (`BANDA_CALLE_LAYERS`), animadas solo con opacity/transform para no repintar. `node build.mjs --audit`: orden de profundidad, holguras y cables limpios; solo quedan 5 avisos de «apoyo» (tapia del fondo, tapia final y vigas del torii) que el kit no reconoce aunque descansan en el suelo y en los pilares. `--sizes` lista el peso de cada pieza. |
| `hero/hero-maqueta` | `hero/out/heroMaqueta.markup.ts` | Maqueta en un único SVG. **No va a src/**: solo es la referencia de `hero-layers`. |
| `hero-layers/build.mjs` | `hero-layers/out/heroMaqueta.markup.ts` | La maqueta partida en 12 capas `<svg>` apiladas (las partes que se mueven se componen en GPU sin repintar). El orden de capas sale de `probe.json` (máscaras de píxeles). Si cambia la geometría, el hash no coincide y hay que volver a sondear con `probe.mjs` (usa el navegador de la skill). |
| `hero-spots/spot-*/build.mjs` | `hero-spots/out/spot*.markup.ts` | Spots de la tira de billete, del aviso de scroll, del botón de tema, de la ruta y del pie. |
| `import/import-iso.mjs` | `src/features/landing/iso/` | Copia los días y prefija los ids de degradado `iso-fade-` que el kit deja sin prefijo. |
| `import/split-michishirube.mjs` | — | Saca la tablilla del poste a su propia capa (`SPOT_MICHISHIRUBE_BOARD_MARKUP`) para que oscile como elemento compuesto. Se aplica sobre el spot ya copiado. |

Cada build deja también vistas previas (`*-light.html`, `*-dark.html`, `*.svg`) junto a su
script; están ignoradas en git.

## Paleta

Las rampas de tono se calculan a partir de los hex de `--paper`, `--surface`, `--gold`, `--brown`,
`--green`, `--ink`, `--coral`, `--coral2` y `--amber` de `src/styles/index.css` (están copiados en las
librerías como `SITE`). Si cambia alguno, hay que actualizar `SITE` y regenerarlo todo.

## Procedencia

Los scripts se escribieron en sesiones de trabajo con la skill anatomy-asset y se trajeron aquí
sin cambios de geometría: solo se sustituyeron las rutas absolutas por rutas relativas.
