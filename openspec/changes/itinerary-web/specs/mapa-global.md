# Mapa Global del Recorrido — Specification

## Purpose

Define el comportamiento del mapa interactivo que muestra la ruta completa del viaje (Tokio → Onsen → Alpes → Kioto → Osaka → Tokio) con marcadores de ciudades y línea de ruta.

## Requirements

### Requirement: MAP-01 — Marcadores de ciudades

El mapa MUST mostrar un marcador por ciudad del itinerario (mínimo: Tokio, Nikko/Onsen, Alpes Japoneses, Kanazawa/Takayama, Kioto, Osaka, vuelta Tokio) ordenados según la secuencia del itinerario.

Cada marcador MUST mostrar al menos el nombre de la ciudad.

El orden de los marcadores en la línea de ruta MUST ser el orden cronológico de visita; si el orden de algún tramo está pendiente de cierre (p. ej. Kanazawa↔Takayama), el mapa MUST renderizar igualmente con el orden provisional sin romper.

#### Scenario: Mapa cargado

- GIVEN la aplicación está en la ruta `/` o `/mapa`
- WHEN el componente de mapa termina de inicializarse
- THEN se muestran marcadores para todas las ciudades del itinerario
- AND cada marcador muestra el nombre de la ciudad

#### Scenario: Tramo de orden pendiente

- GIVEN el tramo Kanazawa↔Takayama no tiene orden definitivo en los datos
- WHEN se renderiza el mapa
- THEN el mapa muestra ambas ciudades con el orden provisional definido en `src/data/`
- AND no se produce error de renderizado

---

### Requirement: MAP-02 — Línea de ruta

El mapa MUST trazar una línea continua que conecte los marcadores en el orden del itinerario.

La línea MUST ser visualmente distinguible de otras capas del mapa.

#### Scenario: Línea visible

- GIVEN el mapa está inicializado y los datos están cargados
- WHEN el usuario observa el mapa
- THEN existe una línea que conecta todos los marcadores en orden cronológico

---

### Requirement: MAP-03 — Interactividad: pulsar marcador

Al pulsar un marcador de ciudad, la aplicación MUST navegar a la vista del primer día de esa ciudad O mostrar un panel de información con los días en que se visita esa ciudad, con enlace a cada uno de ellos.

#### Scenario: Click en marcador de ciudad

- GIVEN el mapa muestra marcadores de ciudades
- WHEN el usuario pulsa el marcador de "Kioto"
- THEN se muestra información sobre los días en Kioto (nombres de día y enlace a `/dia/:dayId`) O se navega directamente al primer día en Kioto

#### Scenario: Click en marcador — teclado/accesibilidad

- GIVEN el mapa está en foco
- WHEN el usuario activa un marcador mediante teclado (Enter/Espacio)
- THEN se produce la misma acción que con click de ratón

---

### Requirement: MAP-04 — Zoom, pan y responsive

El mapa MUST soportar zoom y paneo en escritorio (rueda del ratón + arrastre) y en móvil (pinch-to-zoom + arrastre táctil).

El mapa MUST ocupar el ancho completo de su contenedor en todos los tamaños de pantalla.

En móvil (viewport < 768 px) el mapa MUST ser usable sin que los gestos de scroll de página queden bloqueados permanentemente (p. ej. cooperative gesture handling o control flotante).

#### Scenario: Responsive en móvil

- GIVEN un dispositivo con viewport de 375 px de ancho
- WHEN se renderiza la página del mapa
- THEN el mapa ocupa el 100 % del ancho del contenedor
- AND el usuario puede hacer scroll vertical en la página sin que el mapa lo intercepte indefinidamente

#### Scenario: Zoom escritorio

- GIVEN el mapa está visible en escritorio
- WHEN el usuario usa la rueda del ratón sobre el mapa
- THEN el nivel de zoom aumenta o disminuye de forma fluida

---

### Requirement: MAP-05 — Sin spoilers en el mapa

El mapa MUST NOT mostrar descripciones de lo que se puede ver dentro de ningún lugar.

Los tooltips o pop-overs de marcadores MUST limitarse a: nombre de ciudad, número de días de visita y enlace(s) al día o zona correspondiente.

#### Scenario: Tooltip de marcador sin spoilers

- GIVEN el mapa muestra el marcador de "Kioto"
- WHEN el usuario pulsa o hace hover sobre el marcador
- THEN el tooltip/panel muestra solo nombre, número de días y enlace(s)
- AND no aparece ninguna descripción del contenido turístico de la ciudad
