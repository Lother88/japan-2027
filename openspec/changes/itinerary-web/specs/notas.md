# Notas y Comentarios del Usuario — Specification

## Purpose

Define el comportamiento del sistema de notas libres que el usuario puede asociar a un día o a una zona, con persistencia en localStorage, sin base de datos, y con capacidad de exportar e importar como JSON.

## Requirements

### Requirement: NOTE-01 — Creación y edición de notas

El usuario MUST poder crear una nota de texto libre asociada a un día (`dayId`) o a una zona (`zonaSlug`).

El usuario MUST poder editar una nota existente.

El usuario MUST poder eliminar una nota existente.

Las notas MUST persistir en localStorage; al recargar la página las notas MUST seguir presentes.

#### Scenario: Crear nota en un día

- GIVEN el usuario está en la vista del día 5
- WHEN escribe texto en el campo de notas y lo guarda
- THEN la nota aparece asociada al día 5
- AND tras recargar la página la nota sigue visible en el día 5

#### Scenario: Eliminar nota

- GIVEN existe una nota en la zona "Nishiki Market"
- WHEN el usuario pulsa el control de eliminar y confirma
- THEN la nota desaparece de la vista
- AND no vuelve a aparecer tras recargar la página

---

### Requirement: NOTE-02 — Persistencia y versionado del esquema

Las notas MUST almacenarse en localStorage mediante el store de Zustand con middleware `persist`.

El store MUST incluir un número de versión de esquema. Si el esquema cambia en una versión futura, la migración MUST descartar o transformar datos corruptos sin lanzar excepciones al usuario.

#### Scenario: Datos de versión antigua en localStorage

- GIVEN el localStorage contiene notas de una versión de esquema anterior
- WHEN la aplicación carga con el nuevo esquema
- THEN la aplicación no lanza error no controlado
- AND las notas se migran o se descartan limpiamente (según la estrategia de migración definida en la fase de diseño)

---

### Requirement: NOTE-03 — Exportar notas a JSON

El usuario MUST poder exportar todas sus notas como un fichero JSON descargable.

El fichero JSON MUST contener todas las notas con su contexto (`dayId` o `zonaSlug`) y el texto libre.

El nombre del fichero descargado SHOULD incluir la fecha de exportación (p. ej. `notas-japon-2027-20270510.json`).

#### Scenario: Export de notas

- GIVEN el usuario tiene notas en 3 días y 2 zonas
- WHEN pulsa "Exportar notas"
- THEN el navegador descarga un fichero JSON
- AND el fichero contiene las 5 notas con su `dayId` o `zonaSlug` correspondiente

#### Scenario: Export sin notas

- GIVEN el usuario no ha escrito ninguna nota
- WHEN pulsa "Exportar notas"
- THEN se descarga un fichero JSON válido con un array vacío (o equivalente)
- AND no se produce ningún error

---

### Requirement: NOTE-04 — Importar notas desde JSON

El usuario MUST poder importar notas desde un fichero JSON previamente exportado.

Al importar, la aplicación MUST validar que el fichero tiene el formato esperado; si no lo tiene, MUST mostrar un mensaje de error sin sobrescribir las notas existentes.

La importación SHOULD fusionar las notas importadas con las existentes (no reemplazar), o bien ofrecer al usuario la opción de elegir entre fusionar y reemplazar.

#### Scenario: Import de fichero válido

- GIVEN el usuario tiene un fichero JSON exportado por la aplicación
- WHEN selecciona el fichero y confirma la importación
- THEN las notas del fichero aparecen en los días/zonas correspondientes
- AND las notas previas no se pierden (si la estrategia es fusionar)

#### Scenario: Import de fichero inválido

- GIVEN el usuario selecciona un fichero JSON con formato incorrecto (no es un export de la app)
- WHEN intenta importar
- THEN la aplicación muestra un mensaje de error descriptivo
- AND las notas existentes permanecen intactas

---

### Requirement: NOTE-05 — Visibilidad de notas en contexto

Las notas asociadas a un día MUST mostrarse en la vista de ese día.

Las notas asociadas a una zona MUST mostrarse en la página de esa zona.

Un indicador visual (p. ej. icono o badge) SHOULD aparecer en la lista de días y en la lista de zonas de un día para indicar que ese elemento tiene notas.

#### Scenario: Nota visible en su contexto

- GIVEN el usuario creó una nota en el día 8
- WHEN navega a la vista del día 8
- THEN la nota es visible en esa vista

#### Scenario: Indicador de nota existente

- GIVEN el día 3 tiene una nota guardada
- WHEN el usuario ve la lista de días
- THEN el día 3 muestra un indicador visual de que tiene nota(s)
