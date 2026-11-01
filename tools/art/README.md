# Generadores del arte isométrico

Scripts que producen los `*.markup.ts` de `src/features/landing/iso/` (21 días) y
`src/features/landing/hero-art/` (maqueta del hero, banda «Muro» y 8 spots). Esos ficheros son
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
revisa la salida que indica antes de escribir. Tras regenerar, `pnpm test:run` valida prefijos,
ids y estilos acotados (`src/features/landing/__tests__/isoMarkup.test.ts`).

## Qué hace cada parte

| Carpeta | Genera | Notas |
|---|---|---|
| `iso/dayNN/build.mjs` | `iso/out/dayNNIso.markup.ts` | Una escena por día. Comparten librerías por tandas (`lib-09-26`, `lib-d13-29`, `lib-d15-19.mjs`, `common-d20-25.mjs`). |
| `kinkakuji/build.mjs` | `iso/out/kinkakujiIso.markup.ts` | Piloto del día 21; `import-iso.mjs` lo normaliza al esquema `d21-`. |
| `hero/banda-muro` | `hero/out/bandaMuro.markup.ts` | Banda «Muro» de la sección «La ruta». |
| `hero/hero-maqueta` | `hero/out/heroMaqueta.markup.ts` | Maqueta en un único SVG. **No va a src/**: solo es la referencia de `hero-layers`. |
| `hero-layers/build.mjs` | `hero-layers/out/heroMaqueta.markup.ts` | La maqueta partida en 12 capas `<svg>` apiladas (las partes que se mueven se componen en GPU sin repintar). El orden de capas sale de `probe.json` (máscaras de píxeles). Si cambia la geometría, el hash no coincide y hay que volver a sondear con `probe.mjs` (usa el navegador de la skill). |
| `hero-spots/spot-*/build.mjs` | `hero-spots/out/spot*.markup.ts` | Spots de la tira de billete, del aviso de scroll, del botón de tema, de la ruta y del pie. |
| `import/import-iso.mjs` | `src/features/landing/iso/` | Copia los días y prefija los ids de degradado `iso-fade-` que el kit deja sin prefijo. |
| `import/split-michishirube.mjs` | — | Saca la tablilla del poste a su propia capa (`SPOT_MICHISHIRUBE_BOARD_MARKUP`) para que oscile como elemento compuesto. Se aplica sobre el spot ya copiado. |

Cada build deja también vistas previas (`*-light.html`, `*-dark.html`, `*.svg`) junto a su
script; están ignoradas en git.

## Paleta

Las rampas de tono se calculan a partir de los hex de `--paper`, `--surface`, `--gold`, `--brown`,
`--green`, `--ink`, `--coral`, `--coral2` y `--amber` de `src/index.css` (están copiados en las
librerías como `SITE`). Si cambia alguno, hay que actualizar `SITE` y regenerarlo todo.

## Procedencia

Los scripts se escribieron en sesiones de trabajo con la skill anatomy-asset y se trajeron aquí
sin cambios de geometría: solo se sustituyeron las rutas absolutas por rutas relativas. Por eso las
cabeceras de los `*.markup.ts` aún dicen «build.mjs en el scratchpad de la sesión»; se
actualizarán la próxima vez que se regenere el arte.
