/**
 * MapPageLazy — lazy-loaded wrapper for MapPage
 *
 * Separated into its own file to satisfy react-refresh/only-export-components.
 * MapLibre is heavy — lazy loading keeps initial bundle small.
 */

import { lazy, Suspense } from 'react'

const MapPage = lazy(() => import('./MapPage'))

export default function MapPageLazy() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-sans text-sumi-700">Cargando mapa…</div>}>
      <MapPage />
    </Suspense>
  )
}
