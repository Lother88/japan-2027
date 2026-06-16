# Página de Zona — Specification

## Purpose

Define el comportamiento de la página de detalle de una zona (barrio, templo, mercado u otro punto del itinerario), que muestra información práctica sin revelar el contenido de la visita.

## Requirements

### Requirement: ZONE-01 — Datos mínimos obligatorios de una zona

Cada zona MUST exponer: nombre del lugar, ciudad a la que pertenece, tipo de zona (p. ej. barrio, templo, mercado, parque) y al menos un dato de info práctica (horario orientativo, acceso/transporte o nota logística).

El tipo `Zone` en `src/data/` MUST NOT incluir campo `description` ni ningún otro campo que describa el contenido turístico o experiencial del lugar.

#### Scenario: Página de zona cargada

- GIVEN el usuario navega a `/zona/kioto/gion`
- WHEN la página se renderiza
- THEN se muestra: nombre ("Gion"), ciudad ("Kioto"), tipo de zona y al menos una línea de info práctica
- AND no aparece ninguna descripción de lo que se ve dentro

#### Scenario: Zona inexistente

- GIVEN el usuario navega a `/zona/tokio/zona-inexistente`
- WHEN la página intenta cargar los datos
- THEN se muestra una página de error 404 o componente "zona no encontrada"
- AND la aplicación no lanza una excepción no controlada

---

### Requirement: ZONE-02 — Info práctica

La página de zona MUST mostrar la información práctica disponible para esa zona.

Los campos de info práctica SHOULD incluir (cuando existan en los datos): horario de apertura/cierre, cómo llegar (línea de metro/tren + parada), coste de entrada aproximado (gratuito / de pago), y notas logísticas relevantes.

Los campos que no tengan datos disponibles MUST NOT renderizarse (no mostrar etiquetas vacías).

#### Scenario: Info práctica completa

- GIVEN la zona "Tsukiji Outer Market" tiene horario y acceso definidos en los datos
- WHEN el usuario ve la página de la zona
- THEN se muestran horario y acceso
- AND no aparece el campo "descripción"

#### Scenario: Campo de acceso ausente

- GIVEN una zona no tiene datos de acceso en `src/data/`
- WHEN el usuario ve la página de la zona
- THEN no se renderiza la etiqueta "Cómo llegar" ni ningún campo vacío
- AND el resto de info práctica se muestra correctamente

---

### Requirement: ZONE-03 — Mini-mapa de la zona

La página de zona SHOULD mostrar un mini-mapa con la ubicación geográfica de la zona.

El mini-mapa MUST usar las coordenadas `[lng, lat]` definidas en el dato de la zona; si una zona no tiene coordenadas, el mini-mapa MUST NOT renderizarse (no mostrar un mapa en blanco).

#### Scenario: Mini-mapa con coordenadas

- GIVEN la zona "Fushimi Inari" tiene coordenadas `[135.7727, 34.9671]`
- WHEN el usuario ve la página de la zona
- THEN se muestra un mini-mapa centrado en esas coordenadas con un marcador

#### Scenario: Zona sin coordenadas

- GIVEN una zona no tiene coordenadas en los datos
- WHEN el usuario ve la página de la zona
- THEN no se renderiza ningún componente de mapa
- AND el resto de la página se muestra sin errores

---

### Requirement: ZONE-04 — Enlace de retorno y navegación contextual

La página de zona MUST ofrecer un enlace o botón para volver al día desde el que se llegó, o al listado de días si no hay contexto de navegación previo.

La página SHOULD mostrar el número de día(s) en los que aparece esta zona, con enlace(s) a esos días.

#### Scenario: Vuelta al día de origen

- GIVEN el usuario llegó a la zona desde la vista del día 4
- WHEN pulsa "Volver al día 4"
- THEN navega de vuelta a `/dia/4`

#### Scenario: Acceso directo sin contexto de día

- GIVEN el usuario accede directamente a `/zona/osaka/dotonbori` desde un bookmark
- WHEN pulsa el enlace de vuelta
- THEN navega al listado de días o a la pantalla de inicio
