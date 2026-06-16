# Identidad Visual y Responsive — Specification

## Purpose

Define los requisitos de diseño visual (identidad japonesa propia), comportamiento responsive y cobertura de ancho completo para toda la aplicación.

## Requirements

### Requirement: UX-01 — Identidad visual japonesa propia

La aplicación MUST usar una paleta de colores y tipografía con carácter japonés propio, no una plantilla genérica.

La paleta MUST definirse en el bloque `@theme` de Tailwind v4 como variables CSS (`--color-*`), sin `tailwind.config.js`.

La paleta SHOULD incluir tonos que evoquen los materiales de la estética japonesa (washi, sumi, sakura, índigo).

La aplicación SHOULD usar animaciones sutiles de entrada y scroll para enriquecer la experiencia; las animaciones MUST NOT ser intrusivas ni afectar a la usabilidad.

#### Scenario: Paleta cargada en runtime

- GIVEN la aplicación carga en el navegador
- WHEN se inspeccionan las variables CSS del documento
- THEN existen variables `--color-*` con los valores de la paleta japonesa definida en `@theme`

#### Scenario: Animaciones no bloquean la UI

- GIVEN las animaciones de entrada están activas
- WHEN el usuario navega entre vistas
- THEN el contenido es interactuable durante y después de la animación
- AND no se produce ningún retraso visible en la respuesta a interacciones del usuario

---

### Requirement: UX-02 — Layout responsive: escritorio

En viewport >= 1024 px (escritorio), el layout MUST aprovechar el ancho de pantalla para mostrar contenido de forma vistosa (p. ej. mapa lateral, tarjetas en grid, tipografía grande).

El layout MUST ocupar el 100 % del ancho del viewport (sin contenedor de ancho máximo restrictivo que deje franjas en blanco en pantallas grandes).

#### Scenario: Ancho completo en escritorio

- GIVEN un viewport de 1440 px de ancho
- WHEN el usuario ve cualquier página de la aplicación
- THEN el contenido ocupa el 100 % del ancho sin franjas laterales en blanco visibles

#### Scenario: Mapa en escritorio

- GIVEN un viewport >= 1024 px
- WHEN el usuario ve la página del mapa global
- THEN el mapa ocupa al menos el 60 % del ancho de la pantalla (o el 100 % si es vista de pantalla completa)

---

### Requirement: UX-03 — Layout responsive: móvil

En viewport < 768 px (móvil), el layout MUST ser cómodo para consulta one-handed: texto legible sin zoom manual, botones con área táctil mínima de 44 × 44 px (WCAG 2.5.5), sin contenido horizontalmente truncado.

La navegación entre días y el acceso a zonas MUST ser accesibles sin hacer scroll horizontal.

#### Scenario: Legibilidad en móvil

- GIVEN un viewport de 375 px (iPhone SE)
- WHEN el usuario ve la vista de un día
- THEN el texto es legible sin necesidad de zoom
- AND no aparece scroll horizontal en la página

#### Scenario: Áreas táctiles mínimas

- GIVEN la vista de un día en móvil
- WHEN se inspeccionan los botones de navegación entre días
- THEN cada botón tiene un área interactiva de al menos 44 × 44 px

---

### Requirement: UX-04 — Navegación global coherente

La aplicación MUST tener un componente de navegación global (header o nav) que permita ir a: inicio/mapa, listado de días y (opcionalmente) exportar notas.

La navegación global MUST ser visible en todas las rutas sin necesidad de usar el botón Atrás del navegador.

#### Scenario: Navegación disponible en ruta de zona

- GIVEN el usuario está en `/zona/tokio/shibuya`
- WHEN observa la cabecera de la aplicación
- THEN el menú de navegación global está visible con enlace al inicio y al listado de días

---

### Requirement: UX-05 — Accesibilidad mínima

Todos los elementos interactivos (botones, enlaces, marcadores de mapa) MUST tener un texto alternativo o `aria-label` descriptivo.

El contraste de color entre texto principal y fondo MUST cumplir como mínimo el ratio 4.5:1 (WCAG AA para texto normal).

#### Scenario: Contraste en paleta japonesa

- GIVEN la paleta de colores japonesa está aplicada
- WHEN se comprueba el contraste del texto principal sobre el fondo principal
- THEN el ratio es >= 4.5:1

#### Scenario: Marcadores de mapa con aria-label

- GIVEN el mapa está renderizado con marcadores de ciudades
- WHEN se inspecciona el DOM de los marcadores
- THEN cada marcador tiene un atributo `aria-label` con el nombre de la ciudad
