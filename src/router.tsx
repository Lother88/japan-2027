/**
 * Application router — React Router v7 Data Mode
 *
 * Package: `react-router` (unified in v7, NOT react-router-dom)
 * Pattern: createBrowserRouter with root Layout + Outlet
 *
 * Routes:
 *   /               → Home (hero + itinerary preview)
 *   /itinerario     → ItineraryView (list of all days)
 *   /dia/:dayId     → DayView (single day with morning/afternoon blocks)
 *   /zona/:citySlug/:slug → ZonePage (zone detail with practical info)
 *   /mapa           → MapPageLazy (placeholder — full map in Phase 3)
 */

import { createBrowserRouter } from 'react-router'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import ItineraryView from '@/features/itinerary/ItineraryView'
import DayView from '@/features/itinerary/DayView'
import ZonePage from '@/features/zone/ZonePage'
import MapPageLazy from '@/pages/MapPageLazy'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'itinerario',
        element: <ItineraryView />,
      },
      {
        path: 'dia/:dayId',
        element: <DayView />,
      },
      {
        path: 'zona/:citySlug/:slug',
        element: <ZonePage />,
      },
      {
        path: 'mapa',
        element: <MapPageLazy />,
      },
    ],
  },
])
