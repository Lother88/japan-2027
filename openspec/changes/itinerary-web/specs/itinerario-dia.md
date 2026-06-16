# Itinerario por Día — Specification

## Purpose

Define el comportamiento de la vista del itinerario completo (21 días) y de la vista detallada de un día individual con bloques mañana/tarde y las zonas a visitar.

## Requirements

### Requirement: DAY-01 — Lista de los 21 días

La aplicación MUST mostrar una lista navegable de los 21 días del viaje.

Cada entrada de la lista MUST mostrar: número de día, fecha (formato legible), ciudad principal y un resumen de no más de dos zonas del día (sin descripciones de contenido).

La lista MUST enlazar a la vista detallada de cada día (`/dia/:dayId`).

#### Scenario: Lista completa cargada

- GIVEN el usuario navega a la ruta de listado de días
- WHEN la página se renderiza
- THEN se muestran exactamente 21 entradas, una por día
- AND cada entrada tiene enlace funcional a su vista de detalle

#### Scenario: Acceso directo por URL

- GIVEN el usuario escribe directamente `/dia/7` en el navegador
- WHEN la página carga
- THEN se muestra la vista del día 7 sin necesidad de pasar por la lista

---

### Requirement: DAY-02 — Vista de día: bloques mañana / tarde

La vista de un día MUST organizar el contenido en dos bloques: **mañana** y **tarde**.

Cada bloque MUST listar las zonas a visitar en ese periodo con: nombre de la zona + texto breve de contexto sin spoilers (máximo ~50 palabras).

El texto breve de contexto MUST NOT describir qué se ve dentro del lugar; puede indicar qué tipo de zona es (barrio histórico, mercado, templo) y su relevancia logística o cultural sin revelar sorpresas.

#### Scenario: Día con zonas en ambos bloques

- GIVEN el día tiene zonas en mañana y en tarde
- WHEN el usuario ve la vista del día
- THEN se muestran dos bloques (mañana / tarde) cada uno con sus zonas
- AND cada zona muestra nombre y texto breve sin spoilers

#### Scenario: Bloque vacío (día de viaje/tránsito)

- GIVEN un día de tránsito tiene el bloque de tarde vacío
- WHEN el usuario ve la vista del día
- THEN se muestra un indicador visual de bloque vacío o etiqueta "En tránsito"
- AND no se produce error de renderizado

---

### Requirement: DAY-03 — Navegación entre días

La vista de día MUST ofrecer controles para ir al día anterior y al día siguiente.

El control "anterior" MUST estar deshabilitado en el día 1; el control "siguiente" MUST estar deshabilitado en el día 21.

#### Scenario: Navegación al siguiente día

- GIVEN el usuario está en la vista del día 5
- WHEN pulsa el control "siguiente"
- THEN la vista muestra el día 6
- AND la URL cambia a `/dia/6`

#### Scenario: Control deshabilitado en límites

- GIVEN el usuario está en la vista del día 1
- WHEN observa los controles de navegación
- THEN el botón "anterior" está deshabilitado o no visible
- AND el botón "siguiente" está activo

---

### Requirement: DAY-04 — Enlace a ficha de zona desde el día

Cada zona listada en la vista de día MUST tener un enlace a su página de detalle (`/zona/:citySlug/:zonaSlug`).

#### Scenario: Click en zona desde vista de día

- GIVEN el usuario ve el día 3 y observa la zona "Asakusa"
- WHEN pulsa el nombre de la zona
- THEN navega a `/zona/tokio/asakusa`

---

### Requirement: DAY-05 — Sin spoilers en la vista de día

El texto de cada zona en la vista de día MUST NOT contener descripciones de experiencias, atracciones o vistas del interior del lugar.

El tipo `DayZone` en el modelo de datos MUST NOT tener campo `description` de contenido turístico.

#### Scenario: Modelo de datos sin campo description

- GIVEN los tipos TypeScript en `src/data/types.ts`
- WHEN se compila el proyecto
- THEN el tipo `Zone` (o equivalente) no tiene propiedad `description`
- AND el compilador no acepta asignaciones de ese campo
