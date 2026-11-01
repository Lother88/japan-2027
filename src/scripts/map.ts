/**
 * map — arranque diferido del mapa de la ruta (banda «La ruta», caja [data-route-map]).
 *
 * MapLibre (~1 MB) y su CSS van en un chunk aparte (features/map/routeMap.ts) que solo se pide
 * cuando la caja del mapa entra en pantalla (o queda a 150 px). Así no compite con la carga
 * inicial de la página.
 */
const box = document.querySelector<HTMLElement>('[data-route-map]')

if (box) {
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((en) => en.isIntersecting)) return
      io.disconnect()
      import('@/features/map/routeMap')
        .then(({ mountRouteMap }) => mountRouteMap(box))
        // Con el mapa montado ya se pinta su marca de agua (index.css, [data-map-ready])
        .then(() => box.setAttribute('data-map-ready', ''))
        .catch(() => {
          // Sin red para el chunk: la caja queda con la leyenda, sin mapa ni marca de agua.
        })
    },
    { rootMargin: '150px 0px' },
  )
  io.observe(box)
}
