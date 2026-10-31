/**
 * Transición claro/oscuro — comportamiento del proveedor de tema y de la
 * transición de círculo desde el botón (View Transitions).
 *
 * jsdom no implementa `document.startViewTransition` ni `Element.animate`, así
 * que se stubbean para observar QUÉ se anima (pseudo-elemento, keyframes, curva,
 * duración) y CUÁNDO se aplica el tema.
 */
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeModeProvider } from '@/features/landing/ThemeModeProvider'
import ThemeToggle from '@/features/landing/ThemeToggle'
import { THEME_STORAGE_KEY, useThemeMode } from '@/features/landing/useThemeMode'

// ── Utilidades de test ──────────────────────────────────────────────────────

function Probe() {
  const { mode } = useThemeMode()
  return <span data-testid="mode">{mode}</span>
}

function renderTheme() {
  render(
    <ThemeModeProvider>
      <Probe />
      <ThemeToggle />
    </ThemeModeProvider>,
  )
  // El nombre describe la acción y cambia con el tema («Activar tema oscuro/claro»).
  return screen.getByRole('button', { name: /^Activar tema (oscuro|claro)$/ })
}

const html = () => document.documentElement

/** Botón 50×50 en (26, 700) → centro (51, 725), radio 25. */
function mockToggleRect() {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    left: 26, top: 700, width: 50, height: 50, right: 76, bottom: 750, x: 26, y: 700,
    toJSON: () => ({}),
  } as DOMRect)
}

const FAR = Math.hypot(Math.max(51, window.innerWidth - 51), Math.max(725, window.innerHeight - 725))

interface VtStub {
  start: ReturnType<typeof vi.fn>
  /** Ejecuta el callback de actualización pendiente (captura del estado nuevo). */
  runUpdate: () => void
  /** Termina la transición (resuelve `finished`). */
  finish: () => void
}

/**
 * Stub de View Transitions. `manual: true` deja el callback y `finished`
 * pendientes para inspeccionar los estados intermedios.
 */
function installViewTransition({ manual = false } = {}): VtStub {
  let update: () => void = () => {}
  let finish: () => void = () => {}
  const start = vi.fn((cb: () => void) => {
    let resolveUpdate: () => void = () => {}
    const updateCallbackDone = new Promise<void>(r => (resolveUpdate = r))
    const finished = new Promise<void>(r => (finish = r))
    update = () => {
      cb()
      resolveUpdate()
    }
    if (!manual) {
      queueMicrotask(() => {
        update()
        finish()
      })
    }
    return {
      updateCallbackDone,
      ready: updateCallbackDone,
      finished,
      skipTransition: vi.fn(),
    }
  })
  Object.defineProperty(document, 'startViewTransition', { configurable: true, writable: true, value: start })
  return { start, runUpdate: () => update(), finish: () => finish() }
}

function installAnimate() {
  const animate = vi.fn(() => ({ finished: Promise.resolve(), cancel: () => {} }))
  Object.defineProperty(Element.prototype, 'animate', { configurable: true, writable: true, value: animate })
  return animate
}

type AnimateCall = [Record<string, string[]>, KeyframeAnimationOptions]
const callOf = (animate: ReturnType<typeof installAnimate>, i = 0) =>
  animate.mock.calls[i] as unknown as AnimateCall

/**
 * Node ≥ 25 trae un `localStorage` nativo que tapa el de jsdom y vale undefined
 * sin `--localstorage-file`; se instala uno en memoria para estos tests.
 */
function installMemoryStorage() {
  const data = new Map<string, string>()
  const storage: Storage = {
    get length() {
      return data.size
    },
    clear: () => data.clear(),
    getItem: k => data.get(k) ?? null,
    key: i => [...data.keys()][i] ?? null,
    removeItem: k => void data.delete(k),
    setItem: (k, v) => void data.set(k, String(v)),
  }
  Object.defineProperty(window, 'localStorage', { configurable: true, writable: true, value: storage })
}

const originalMatchMedia = window.matchMedia

function preferReducedMotion() {
  window.matchMedia = ((query: string) => ({
    ...originalMatchMedia(query),
    matches: query.includes('prefers-reduced-motion: reduce'),
  })) as typeof window.matchMedia
}

beforeEach(() => {
  installMemoryStorage()
  html().setAttribute('data-theme', 'light')
  html().removeAttribute('data-theme-swapping')
  window.history.replaceState({}, '', '/')
  mockToggleRect()
})

afterEach(() => {
  Reflect.deleteProperty(document, 'startViewTransition')
  Reflect.deleteProperty(Element.prototype, 'animate')
  window.matchMedia = originalMatchMedia
  vi.restoreAllMocks()
})

// ── Base compartida ─────────────────────────────────────────────────────────

describe('ThemeModeProvider — base compartida', () => {
  it('sin startViewTransition: cambia data-theme, el estado y persiste jp-theme al instante', async () => {
    const button = renderTheme()
    await userEvent.click(button)

    expect(html().getAttribute('data-theme')).toBe('dark')
    expect(screen.getByTestId('mode')).toHaveTextContent('dark')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
    // La supresión de transiciones de color se retira tras pintar el estado nuevo
    await waitFor(() => expect(html().hasAttribute('data-theme-swapping')).toBe(false))
  })

  it('aplica el tema de forma síncrona dentro del callback de la View Transition (flushSync)', async () => {
    const vt = installViewTransition({ manual: true })
    installAnimate()
    const button = renderTheme()
    await userEvent.click(button)

    // Aún no ha corrido el callback: el estado viejo sigue intacto para la captura
    expect(html().getAttribute('data-theme')).toBe('light')
    // Las transiciones de color quedan suprimidas durante todo el intercambio
    expect(html().hasAttribute('data-theme-swapping')).toBe(true)

    let seen = ''
    act(() => {
      vt.runUpdate()
      // Dentro de act las actualizaciones normales se difieren; con flushSync no.
      seen = screen.getByTestId('mode').textContent ?? ''
    })
    expect(seen).toBe('dark')
    expect(html().getAttribute('data-theme')).toBe('dark')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')

    // Sigue suprimido hasta que la transición termina
    expect(html().hasAttribute('data-theme-swapping')).toBe(true)
    await act(async () => vt.finish())
    await waitFor(() => expect(html().hasAttribute('data-theme-swapping')).toBe(false))
  })

  it('ignora clics mientras hay una transición en curso', async () => {
    const vt = installViewTransition({ manual: true })
    installAnimate()
    const button = renderTheme()

    await userEvent.click(button)
    await userEvent.click(button)
    expect(vt.start).toHaveBeenCalledTimes(1)

    act(() => vt.runUpdate())
    await act(async () => vt.finish())
    await waitFor(() => expect(html().hasAttribute('data-theme-swapping')).toBe(false))
    expect(html().getAttribute('data-theme')).toBe('dark')

    // Terminada, el siguiente clic vuelve a funcionar
    await userEvent.click(button)
    expect(vt.start).toHaveBeenCalledTimes(2)
    act(() => vt.runUpdate())
    await act(async () => vt.finish())
    expect(html().getAttribute('data-theme')).toBe('light')
  })

  it('reduce-motion: fundido breve de opacidad (200ms), sin clip-path ni movimiento', async () => {
    preferReducedMotion()
    installViewTransition()
    const animate = installAnimate()
    const button = renderTheme()
    await userEvent.click(button)

    await waitFor(() => expect(animate).toHaveBeenCalledTimes(1))
    const [keyframes, options] = callOf(animate)
    expect(keyframes).toEqual({ opacity: ['0', '1'] })
    expect(keyframes).not.toHaveProperty('clipPath')
    expect(options).toMatchObject({ duration: 200, pseudoElement: '::view-transition-new(root)' })
    await waitFor(() => expect(html().getAttribute('data-theme')).toBe('dark'))
  })
})

// ── Círculo desde el botón ──────────────────────────────────────────────────────────────

describe('círculo desde el botón (patrón MDN)', () => {
  it.each([
    ['light', 'dark'],
    ['dark', 'light'],
  ])('%s → %s: el estado nuevo crece en círculo desde el centro del botón', async (from, to) => {
    html().setAttribute('data-theme', from)
    installViewTransition()
    const animate = installAnimate()
    const button = renderTheme()
    await userEvent.click(button)

    await waitFor(() => expect(animate).toHaveBeenCalledTimes(1))
    const [keyframes, options] = callOf(animate)
    expect(keyframes.clipPath[0]).toBe('circle(0px at 51px 725px)')
    expect(keyframes.clipPath[1]).toBe(`circle(${FAR}px at 51px 725px)`)
    expect(options).toMatchObject({
      duration: 550,
      easing: 'ease-out',
      pseudoElement: '::view-transition-new(root)',
    })
    await waitFor(() => expect(html().getAttribute('data-theme')).toBe(to))
  })
})
