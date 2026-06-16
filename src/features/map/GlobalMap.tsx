/**
 * GlobalMap — full route map with city markers and route LineString.
 *
 * Uses @vis.gl/react-maplibre v8 declarative API + OpenFreeMap tiles.
 * Props verified: Map(mapStyle, initialViewState), Marker(longitude, latitude),
 *   Source(id, type, data), Layer(id, type, paint).
 * CSS imported once here (MapLibre GL).
 *
 * Satisfies MAP-01 (cities as markers), MAP-02 (LineString route),
 *   MAP-03 (Source/Layer), MAP-04 (free tiles), MAP-05 (aria-labels).
 * ADR-001: MapLibre confined to features/map.
 */

import 'maplibre-gl/dist/maplibre-gl.css'
import { useNavigate } from 'react-router'
import { Map, Marker, Source, Layer } from '@vis.gl/react-maplibre'
import { cities, buildRouteLineString, routeOrder } from '@/data'
import { MAP_STYLE_URL, JAPAN_VIEW_STATE } from './mapStyle'

/** Unique cities in route order (dedup: tokio appears twice in closed route) */
function getUniqueCitiesInOrder() {
  const seen = new Set<string>()
  const result = []
  for (const slug of routeOrder) {
    if (!seen.has(slug)) {
      seen.add(slug)
      const city = cities.find(c => c.slug === slug)
      if (city) result.push(city)
    }
  }
  return result
}

const routeFeature = buildRouteLineString()
const mappedCities = getUniqueCitiesInOrder()

interface GlobalMapProps {
  style?: React.CSSProperties
}

export default function GlobalMap({ style }: GlobalMapProps) {
  const navigate = useNavigate()

  return (
    <Map
      mapStyle={MAP_STYLE_URL}
      initialViewState={JAPAN_VIEW_STATE}
      style={{ width: '100%', height: '100%', ...style }}
    >
      {/* City markers */}
      {mappedCities.map(city => (
        <Marker
          key={city.slug}
          longitude={city.center[0]}
          latitude={city.center[1]}
          aria-label={city.name}
          onClick={() => navigate(`/itinerario`)}
        >
          <button
            type="button"
            aria-label={city.name}
            title={city.name}
            className={[
              'w-5 h-5 rounded-full',
              'bg-urushi-600 border-2 border-washi-50',
              'shadow-md cursor-pointer',
              'hover:scale-125 transition-transform',
              'focus-visible:outline-2 focus-visible:outline-washi-50',
            ].join(' ')}
          />
        </Marker>
      ))}

      {/* Route LineString */}
      <Source
        id="route"
        type="geojson"
        data={routeFeature}
      >
        <Layer
          id="route-line"
          type="line"
          paint={{
            'line-color': '#b34539',  // urushi red (oklch approx)
            'line-width': 3,
            'line-opacity': 0.85,
          }}
        />
      </Source>
    </Map>
  )
}
