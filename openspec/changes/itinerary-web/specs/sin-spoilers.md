# Regla Transversal Sin Spoilers — Specification

## Purpose

Define la restricción de producto innegociable que impide que la aplicación revele, en ninguna superficie de la UI ni en el modelo de datos, el contenido o experiencia del interior de los lugares visitados. Esta regla se aplica a TODAS las capabilities.

## Requirements

### Requirement: NOSPOIL-01 — Prohibición de campo `description` en el tipo Zone

El tipo TypeScript `Zone` (o el tipo equivalente que representa una zona del itinerario) MUST NOT incluir ninguna propiedad cuyo propósito sea describir el contenido turístico, la experiencia o lo que se ve dentro del lugar.

En concreto, los nombres prohibidos para propiedades de ese tipo incluyen (sin limitarse a): `description`, `content`, `experience`, `interior`, `highlights`, `attractions`.

El compilador TypeScript MUST rechazar cualquier asignación de esos campos al tipo `Zone`.

#### Scenario: Tipo Zone sin description en compilación

- GIVEN el archivo `src/data/types.ts` define el tipo `Zone`
- WHEN se ejecuta `tsc -b` (verificación de tipos)
- THEN la compilación termina sin errores relacionados con el campo `description`
- AND el tipo `Zone` no expone ningún campo de descripción de contenido turístico

#### Scenario: Intento de añadir description al tipo

- GIVEN un desarrollador intenta añadir `description: string` al tipo `Zone`
- WHEN ejecuta `tsc -b`
- THEN el compilador produce un error de tipo (o el equipo detecta la violación en code review usando este spec como criterio)

---

### Requirement: NOSPOIL-02 — Sin texto descriptivo de contenido en la UI

Ninguna pantalla de la aplicación (vista de día, página de zona, tooltip de mapa, listado de días) MUST renderizar texto que describa qué se ve, experimenta o disfruta dentro de un lugar.

El texto permitido incluye: nombre del lugar, tipo de zona, ciudad, info práctica (horarios, acceso, coste), texto breve de contexto logístico o cultural (~50 palabras máximo por zona en la vista de día).

El texto prohibido incluye: descripciones de monumentos interiores, experiencias sensoriales, revelación de eventos o espectáculos, listas de atracciones dentro del lugar.

#### Scenario: Vista de día sin spoilers

- GIVEN la vista del día 10 muestra zonas de Kioto
- WHEN el usuario lee el texto de cada zona
- THEN el texto solo contiene nombre, tipo y/o contexto logístico/cultural
- AND no aparece ninguna descripción de lo que se puede ver o experimentar dentro

#### Scenario: Página de zona sin spoilers

- GIVEN el usuario navega a la página de la zona "Arashiyama"
- WHEN lee todo el contenido visible de la página
- THEN no encuentra ningún texto que revele el contenido o la experiencia de la visita
- AND la información se limita a nombre, ciudad, tipo de zona e info práctica

---

### Requirement: NOSPOIL-03 — Verificabilidad en testing

Cada test de componente que renderice nombre de zona MUST incluir una aserción que compruebe que el campo `description` (u otro campo prohibido) no está presente en el dato utilizado.

Los datos de test (fixtures o mocks) MUST seguir el mismo modelo tipado que los datos de producción — no se pueden añadir campos de descripción solo en tests.

#### Scenario: Test de componente de zona

- GIVEN un test de componente `ZoneCard` que usa un fixture de tipo `Zone`
- WHEN el test compila y se ejecuta
- THEN el fixture no tiene campo `description` (garantizado por el tipo TypeScript)
- AND el test verifica que el componente no renderiza contenido turístico descriptivo

---

### Requirement: NOSPOIL-04 — Regla aplicable a contenido hand-authored

Al transcribir el contenido de `docs/` a `src/data/`, el autor MUST omitir cualquier texto descriptivo del interior de los lugares.

Si el archivo fuente en `docs/` contiene descripciones de atracciones interiores, ese contenido MUST NOT copiarse a `src/data/`; solo se transcriben nombre, tipo, ciudad e info práctica.

#### Scenario: Transcripción de ficha de zona

- GIVEN la ficha `docs/zonas/tokio/senso-ji.md` contiene descripción del interior del templo
- WHEN el desarrollador transcribe la ficha a `src/data/zones/tokio.ts`
- THEN solo incluye nombre, tipo, ciudad, horarios, acceso y notas logísticas
- AND omite cualquier texto que describa el interior o la experiencia de visita
