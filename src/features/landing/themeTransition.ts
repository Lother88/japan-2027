/**
 * themeTransition — transición ligera claro/oscuro.
 *
 * Un único disco "sol naciente" se expande desde el centro para cubrir la
 * pantalla, se intercambia el tema debajo y se desvanece revelando el nuevo tema.
 * Anima SOLO transform y opacity sobre UNA capa promovida a GPU → fluida y de bajo
 * consumo (sustituye al antiguo abanico de 22 hojas, que se entrecortaba en móvil).
 * El intercambio real del tema se delega en `applySwap`.
 */

const GROW = 360 // ms — expansión del disco hasta cubrir la pantalla
const HOLD = 60 //  ms — margen con la pantalla cubierta antes de revelar
const FADE = 320 // ms — desvanecido que revela el nuevo tema

export interface ThemeOverlayHandles {
  readonly root: HTMLDivElement
  readonly disc: HTMLDivElement
}

/** Prepara el overlay (disco) dentro de `root` y devuelve los handles. */
export function buildThemeOverlay(root: HTMLDivElement): ThemeOverlayHandles {
  root.setAttribute('data-theme-overlay', '')
  Object.assign(root.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '200',
    opacity: '0',
    pointerEvents: 'none',
    overflow: 'hidden',
    display: 'grid',
    placeItems: 'center',
  } satisfies Partial<CSSStyleDeclaration>)

  const disc = document.createElement('div')
  Object.assign(disc.style, {
    width: '150vmax',
    height: '150vmax',
    borderRadius: '50%',
    transformOrigin: '50% 50%',
    transform: 'scale(0)',
    background: 'radial-gradient(circle at 50% 40%, #ffe1ad 0%, #f4a24a 34%, #d8453f 100%)',
    willChange: 'transform, opacity',
  } satisfies Partial<CSSStyleDeclaration>)
  root.appendChild(disc)

  return { root, disc }
}

/**
 * Reproduce la transición: expande el disco cubriendo la pantalla, intercambia el
 * tema (`applySwap`) bajo la cobertura y desvanece el disco revelando el resultado.
 * Devuelve una promesa que resuelve al terminar (libera el guard de "ocupado").
 */
export function playThemeSwap(h: ThemeOverlayHandles, applySwap: () => void): Promise<void> {
  return new Promise(resolve => {
    const { root, disc } = h

    // Estado inicial (cubierto a escala 0) sin animar.
    root.style.transition = 'none'
    root.style.opacity = '1'
    disc.style.transition = 'none'
    disc.style.transform = 'scale(0)'
    void root.offsetHeight // fuerza reflow para encadenar la animación

    // Expande el disco hasta cubrir.
    disc.style.transition = `transform ${GROW}ms cubic-bezier(.4,0,.2,1)`
    disc.style.transform = 'scale(1)'

    // Intercambia el tema cuando ya está cubierto.
    window.setTimeout(applySwap, GROW - 20)

    // Desvanece el overlay revelando el nuevo tema.
    window.setTimeout(() => {
      root.style.transition = `opacity ${FADE}ms ease`
      root.style.opacity = '0'
    }, GROW + HOLD)

    // Limpieza al terminar.
    window.setTimeout(() => {
      root.style.transition = 'none'
      disc.style.transition = 'none'
      disc.style.transform = 'scale(0)'
      resolve()
    }, GROW + HOLD + FADE + 40)
  })
}
