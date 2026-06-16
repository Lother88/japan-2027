import '@testing-library/jest-dom'

// Stub HTMLCanvasElement.getContext for jsdom (MapLibre needs canvas/WebGL)
// jsdom does not implement WebGL; this prevents crashes when maplibre-gl is
// imported directly or indirectly in test files.
HTMLCanvasElement.prototype.getContext = function (): null {
  return null
} as typeof HTMLCanvasElement.prototype.getContext

// Stub window.matchMedia for jsdom (not implemented in jsdom)
// Required by useMediaQuery hook used in Nav/Layout components.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},      // deprecated
    removeListener: () => {},   // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})
