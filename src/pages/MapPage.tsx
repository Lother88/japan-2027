/**
 * MapPage — /mapa route
 *
 * Full-screen GlobalMap of the route.
 * Satisfies MAP-04, UX-02.
 *
 * CSS for MapLibre is imported inside GlobalMap.tsx (loaded once).
 */

import GlobalMap from '@/features/map/GlobalMap'

export default function MapPage() {
  return (
    <div className="w-full" style={{ height: 'calc(100svh - 4rem)' }}>
      <GlobalMap style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
