# Skill Registry — japan-2027 (web del itinerario)

> Generado por sdd-init (16 jun 2026). Infraestructura para resolución de skills del orquestador SDD.

## Compact Rules (inyectar en sub-agentes de apply/review/design)

### Stack y versiones
- **Vite 8 + React 19 (React Compiler ACTIVO) + TypeScript 6 (estricto), pnpm, ESLint 10, Tailwind CSS última versión.**
- ⚠️ **Vite 8, TS 6, ESLint 10, Tailwind v4+ son posteriores al conocimiento base del modelo** → CONTRASTAR SIEMPRE con documentación oficial antes de usar APIs/config. No fiarse de memoria.

### React / código
- React Compiler activo → **NO** `useMemo`/`useCallback`/`memo` manuales salvo necesidad medida.
- Componentes funcionales pequeños, **modularizados por feature** (carpetas), tipados con TS.
- Clean code: nombres claros, sin lógica duplicada, responsabilidad única.
- Imports absolutos vía alias si se configura (`@/...`).

### Estilos
- **Tailwind CSS** (última versión) como sistema de estilos. Verificar el método de instalación/config vigente (Tailwind v4 usa `@import "tailwindcss"` y config en CSS, distinto a v3 — confirmar en docs).
- **Identidad visual propia japonesa**, NO plantilla genérica de IA. Tokens de diseño (color/tipografía) centralizados.
- **Responsive obligatorio** (escritorio vistoso + móvil para uso en viaje). Ancho completo (sin max-width restrictivo).

### Producto
- **SIN SPOILERS**: la UI nombra el lugar (barrio/templo) pero NO describe qué se ve dentro.
- Contenido fuente en `docs/` (markdown + PDF) → modelar a JSON estructurado.
- Persistencia de notas/comentarios **sin BD** (localStorage + export/import JSON, a confirmar en diseño).

### Testing (Strict TDD activo)
- Runner objetivo: **Vitest + @testing-library/react + jsdom** (instalar como primera tarea).
- TDD: test primero en cada feature una vez el runner exista.
- Calidad: `pnpm lint` (ESLint) y `tsc -b` (type-check) deben pasar.

## User Skills (tabla de triggers)

| Skill | Trigger | Uso en este proyecto |
|---|---|---|
| **branch-pr** | crear PR, abrir pull request | Al preparar cambios para revisión |
| **issue-creation** | crear issue de GitHub | Reportar bug / feature |
| **judgment-day** | "judgment day", review adversarial, doble review | Revisión adversarial del código antes de merge |
| **code-review** | revisar diff por bugs/cleanups | Revisión de cambios |
| **simplify** | limpiar código (reuse/simplify/efficiency) | Pulido de calidad |
| **verify** / **run** | verificar/arrancar la app | Comprobar que la web funciona de verdad |
| **deep-research** | investigación multi-fuente verificada | Investigar librerías/APIs (mapas, Tailwind) |
| **spec-author** | crear/auditar spec files | Specs vivas si se necesitan fuera de SDD |

## Project Conventions
- `CLAUDE.md` global del usuario (protocolo Engram + Agent Teams Lite + Strict TDD). No hay CLAUDE.md/AGENTS.md a nivel de repo (candidato a crear con `/init`).
