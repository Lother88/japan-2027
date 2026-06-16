/**
 * ZoneMiniMap — mini map for a single zone (1 marker).
 * Renders nothing if coordinates are undefined.
 * Satisfies ZONE-03.
 *
 * CSS is imported in GlobalMap.tsx (once per bundle).
 * If ZoneMiniMap is loaded without GlobalMap, import once from mapStyle.
 */

import { Map, Marker } from '@vis.gl/react-maplibre'
import type { LngLat } from '@/data/types'
import { MAP_STYLE_URL } from './mapStyle'

interface ZoneMiniMapProps {
  coordinates: LngLat | undefined
  name: string
}

export default function ZoneMiniMap({ coordinates, name }: ZoneMiniMapProps) {
  if (!coordinates) return null

  const [lng, lat] = coordinates

  return (
    <div className="w-full h-48 rounded-[var(--radius-card)] overflow-hidden border border-washi-200">
      <Map
        mapStyle={MAP_STYLE_URL}
        initialViewState={{ longitude: lng, latitude: lat, zoom: 14 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Marker longitude={lng} latitude={lat} aria-label={name}>
          <div
            className="w-4 h-4 rounded-full bg-urushi-600 border-2 border-washi-50 shadow"
            aria-hidden="true"
          />
        </Marker>
      </Map>
    </div>
  )
}
