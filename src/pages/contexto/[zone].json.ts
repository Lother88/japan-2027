/**
 * /contexto/<zona>.json — «El lugar» de cada zona (context.ts) como JSON estático.
 *
 * Endpoint estático: en el build sale un fichero por zona con fichas (dist/contexto/*.json).
 * Así el contexto cultural (~300 KB) no viaja en el HTML inicial: scripts/place.ts lo pide al
 * desplegar «El lugar» en la hoja de un paso (y, con buena conexión, precarga el día de hoy).
 * Lo práctico de la zona (acceso, horario, notas) sigue en línea en ZoneCard.
 */
import type { APIRoute, GetStaticPaths } from 'astro'
import { context, type ContextEntry } from '@/data/context'

export const getStaticPaths = (() =>
  Object.entries(context)
    .filter(([, entries]) => entries.length > 0)
    .map(([zone, entries]) => ({ params: { zone }, props: { entries } }))) satisfies GetStaticPaths

export const GET: APIRoute<{ entries: readonly ContextEntry[] }> = ({ props }) =>
  new Response(JSON.stringify(props.entries), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
