/**
 * Búsqueda de hoteles — tres listas de cinco hoteles por estancia (por precio, calidad-precio
 * y ubicación), la opción propuesta para cada una y la ficha completa de todo lo revisado.
 *
 * Fuentes: los JSON de src/data/hoteles/ (copia sin tocar de docs/hoteles-datos/, uno por
 * estancia, tal y como salieron de la búsqueda en Booking) y los textos del informe
 * docs/hoteles-top5-2027.html (docs/hoteles-datos/build-report.mjs), del que se porta la
 * lógica: precio mostrado, emparejado de cada puesto con su ficha, minutos a pie y totales.
 *
 * Es un documento de trabajo con precios de un día concreto: no hay nada reservado. Las
 * zonas elegidas por estancia siguen en hotels.ts; aquí van los hoteles candidatos.
 */

import kanazawaFile from './hoteles/kanazawa.json'
import kiotoFile from './hoteles/kioto.json'
import osakaFile from './hoteles/osaka.json'
import takayamaFile from './hoteles/takayama.json'
import tokio1File from './hoteles/tokio1-ueno.json'
import tokio2File from './hoteles/tokio2-asakusa.json'
import { hotels } from './hotels'
import { TRAVELERS } from './trip'

// ── Tipos del modelo (lo que pinta la página) ───────────────────────────────

/** Criterio de cada lista — unión literal (NO enum) */
export type RankingKey = 'precio' | 'valor' | 'ubicacion'

export interface Ranking {
  readonly key: RankingKey
  readonly label: string                 // 'Por precio'
  readonly hint: string                  // 'Lo más barato que cumple el mínimo'
}

/** Punto del itinerario hasta el que se miden los minutos a pie */
export interface StayAnchor {
  readonly name: string                  // 'Keisei Ueno (Skyliner)'
  readonly short: string                 // 'Keisei Ueno' (chips y cabeceras de tabla)
}

/** ¿Tiene lavandería de monedas? 'unknown' = la ficha no lo indica */
export type LaundryStatus = 'yes' | 'no' | 'unknown'

/** Hotel revisado en una estancia (ficha de Booking ya normalizada) */
export interface HotelOption {
  readonly name: string
  readonly url?: string                  // ficha de Booking con las fechas de la estancia
  readonly stars: number | null
  readonly score: number | null          // nota de Booking (0–10)
  readonly reviews: number | null
  readonly price: number | null          // precio mostrado: 2 × twin si existe; si no, `cheapest`
  readonly twin: boolean                 // `price` es de dos habitaciones con camas separadas
  readonly cheapest: number | null       // combinación más barata que ofrecía Booking
  readonly perRoomNight: number | null   // `price` / (2 habitaciones × noches)
  readonly laundry: LaundryStatus
  readonly laundryText: string           // texto de la ficha ('sí', 'no indicado'…)
  readonly thermalBath: boolean
  readonly walkMinutes: readonly (number | null)[]   // por orden de StayResearch.anchors
  readonly roomCombo: string
  readonly freeCancel: string
  readonly notes: string
}

/** Puesto de una lista: el hotel y por qué está ahí */
export interface RankedHotel {
  readonly position: number              // 1..5
  readonly name: string
  readonly why: string
  readonly hotel?: HotelOption           // su ficha (undefined si no se encontró)
}

export interface RankedList {
  readonly ranking: Ranking
  readonly entries: readonly RankedHotel[]
}

/** Opción propuesta de una estancia: el equilibrio de las tres listas, con su tarifa exacta */
export interface ProposedPick {
  readonly name: string
  readonly hotel?: HotelOption
  readonly price: number                 // total de la estancia para las dos habitaciones
  readonly perRoomNight: number
  readonly room: string                  // '2 × twin de 18 m², cancelación gratuita'
  readonly why: string
  readonly alternative: string
}

export interface StayResearch {
  readonly id: string                    // → Hotel.id ('tokio1', 'kanazawa'…)
  readonly citySlug: string              // → City.slug
  readonly title: string                 // 'Tokio 1 · Ueno'
  readonly navLabel: string              // 'Tokio 1'
  readonly checkIn: string               // fecha ISO
  readonly checkOut: string              // fecha ISO
  readonly nights: number
  readonly laundryRequired: boolean      // lavandería de monedas obligatoria en esta estancia
  readonly whyLocation: string           // por qué manda la ubicación en esta estancia
  readonly anchors: readonly StayAnchor[]
  readonly pick: ProposedPick
  readonly lists: readonly RankedList[]
  readonly candidates: readonly HotelOption[]   // todo lo revisado, de más barato a más caro
  readonly caveats: readonly string[]
}

/** Fila del resumen: la propuesta y el número 1 de cada lista */
export interface SummaryRow {
  readonly stay: StayResearch
  readonly pick: SummaryCell
  readonly tops: readonly (SummaryCell & { readonly ranking: Ranking })[]
}

export interface SummaryCell {
  readonly name: string
  readonly price: number | null
}

export interface SummaryTotal {
  readonly total: number
  readonly perPerson: number
}

export interface ResearchSummary {
  readonly rows: readonly SummaryRow[]
  readonly pick: SummaryTotal
  readonly tops: readonly (SummaryTotal & { readonly ranking: Ranking })[]
}

/** Ryokan de Takaragawa: alojamiento único, sin listas */
export interface RyokanResearch {
  readonly id: string                    // → Hotel.id ('takaragawa')
  readonly citySlug: string
  readonly title: string
  readonly navLabel: string
  readonly checkIn: string
  readonly checkOut: string
  readonly nights: number
  readonly url?: string
  readonly available: string
  readonly price: number | null
  readonly rooms: string
  readonly meals: string
  readonly score: number | null
  readonly cancel: string
  readonly notes: string
}

export interface HotelResearch {
  readonly searchedAt: string            // fecha ISO de la primera búsqueda
  readonly rankings: readonly Ranking[]
  readonly stays: readonly StayResearch[]
  readonly summary: ResearchSummary
  readonly ryokan?: RyokanResearch
}

// ── Forma de los ficheros (tolerante: los campos varían de una búsqueda a otra) ──

interface RawAnchor {
  readonly name: string
  readonly key?: string
}

interface RawCandidate {
  readonly name: string
  readonly url?: string
  readonly stars?: number | null
  readonly score?: number | null
  readonly reviews?: number | null
  readonly priceTotalEUR?: number | null
  readonly twinPriceTotalEUR?: number | null
  readonly roomCombo?: string | null
  readonly freeCancel?: string | null
  readonly coinLaundry?: string | null
  readonly onsen?: string | null
  readonly walkMin?: Readonly<Record<string, number>>
  readonly notes?: string | null
}

interface RawTop {
  readonly name: string
  readonly why: string
}

interface RawRyokan {
  readonly url?: string
  readonly available?: string | null
  readonly priceTotalEUR?: number | null
  readonly rooms?: string | null
  readonly meals?: string | null
  readonly score?: number | null
  readonly cancel?: string | null
  readonly notes?: string | null
}

interface RawStay {
  readonly checkIn: string
  readonly checkOut: string
  readonly nights: number
  readonly searchedAt?: string
  readonly anchors: readonly RawAnchor[]
  readonly candidates: readonly RawCandidate[]
  readonly tops: Readonly<Partial<Record<'dinero' | 'calidadPrecio' | 'ubicacion', readonly RawTop[]>>>
  readonly caveats?: readonly string[]
  readonly takaragawa?: RawRyokan
}

// ── Textos y criterio (del informe) ─────────────────────────────────────────

/** Habitaciones por estancia: 4 adultos en 2 habitaciones con camas separadas */
const ROOMS = 2

/** Puestos que se muestran de cada lista */
const TOP_SIZE = 5

const RANKINGS: readonly (Ranking & { readonly source: keyof RawStay['tops'] })[] = [
  { key: 'precio', source: 'dinero', label: 'Por precio', hint: 'Lo más barato que cumple el mínimo' },
  { key: 'valor', source: 'calidadPrecio', label: 'Calidad-precio', hint: 'Lo que se obtiene por lo que cuesta' },
  { key: 'ubicacion', source: 'ubicacion', label: 'Por ubicación', hint: 'Lo que mejor encaja con el itinerario' },
]

interface StayMeta {
  readonly id: string
  readonly file: RawStay
  readonly title: string
  readonly navLabel: string
  readonly laundry: boolean
  /** Por qué manda la ubicación en la estancia (escrito a partir del itinerario corregido). */
  readonly why: string
  /** Etiquetas cortas de los puntos a pie, por orden de `anchors` del fichero. */
  readonly short: readonly string[]
  /** Opción propuesta: `match` es el nombre de la ficha y `price`, la tarifa exacta elegida. */
  readonly pick: {
    readonly match: string
    readonly price: number
    readonly room: string
    readonly why: string
    readonly alt: string
  }
}

/** Estancias en el orden del itinerario. */
const STAYS: readonly StayMeta[] = [
  {
    id: 'tokio1',
    file: tokio1File,
    title: 'Tokio 1 · Ueno',
    navLabel: 'Tokio 1',
    laundry: false,
    why: 'Llegada desde Narita en Skyliner a Keisei Ueno con las maletas (sáb 8) y salida en Shinkansen desde JR Ueno (mié 12). A diario, líneas Ginza e Hibiya.',
    short: ['Keisei Ueno', 'JR Ueno', 'Ueno-Hirokōji'],
    pick: {
      match: 'Tabist HOTEL UENO 39',
      price: 1054,
      room: '2 × twin de 18 m², cancelación gratuita',
      why: 'A 4 min de Keisei Ueno y 7 de JR Ueno: resuelve a pie los dos días con maletas, con habitaciones de 18 m². La nota (8,0) es correcta sin más y tiene pocas opiniones.',
      alt: 'Si pesa más la nota que la distancia: Hotel Paul House (996 €, 9,2), con twin de 15 m² y a 12–14 min de las estaciones.',
    },
  },
  {
    id: 'kanazawa',
    file: kanazawaFile,
    title: 'Kanazawa',
    navLabel: 'Kanazawa',
    laundry: true,
    why: 'Llegada en Shinkansen (jue 13) y bus a Takayama a las 8:10 desde la salida oeste de la estación (sáb 15). A pie: Ōmichō, Higashi Chaya y Kenroku-en a las 7:00.',
    short: ['Bus salida oeste', 'Salida este', 'Ōmichō', 'Kenroku-en'],
    pick: {
      match: 'Smile Hotel Premium Kanazawa Higashiguchiekimae',
      price: 282,
      room: '2 × twin de 21 m², cancelación gratuita',
      why: 'El único que sale en las tres listas: a 3 min de la estación y 6 del bus de las 8:10, lavandería de monedas en varias plantas y nota 8,8.',
      alt: 'Si se prefiere estar a medio camino del mercado: HOTEL TORIFITO KANAZAWA (446 €, 8,8), a 12 min de Ōmichō.',
    },
  },
  {
    id: 'takayama',
    file: takayamaFile,
    title: 'Takayama',
    navLabel: 'Takayama',
    laundry: false,
    why: 'Llegada en bus (sáb 15), bus de las 7:20 a Shirakawa-go con las maletas guardadas en el hotel y tren a Kioto a las 13:35 (lun 17). Todo sale de la estación.',
    short: ['Estación y buses', 'Sanmachi', 'Mercado Miyagawa'],
    pick: {
      match: 'Hida Takayama Washington Hotel Plaza',
      price: 412,
      room: '2 × twin superior de 24 m², cancelación gratuita',
      why: 'A 1 min de la estación y del centro de autobuses: ideal para dejar las maletas y coger el bus de las 7:20. La twin superior de 24 m² cuesta 64 € más que la económica de 15 m².',
      alt: 'Si se quiere mejor hotel y baño termal: hotel around TAKAYAMA (666 €, 9,0), a 5 min.',
    },
  },
  {
    id: 'kioto',
    file: kiotoFile,
    title: 'Kioto · Shichijō',
    navLabel: 'Kioto',
    laundry: true,
    why: 'Tren Keihan de las 5:29 a Fushimi Inari desde Shichijō (jue 20), Kiyomizu a pie a las 6:00 (mar 18) y estación de Kioto para los dos días con maletas (17 y 21).',
    short: ['Keihan Shichijō', 'Est. Kioto', 'Sanjūsangen-dō', 'Kiyomizu'],
    pick: {
      match: 'MR T Kyoto Station East 29',
      price: 696,
      room: '2 × twin de 22 m² con lavadora en la habitación, tarifa flexible',
      why: 'A 3 min de Keihan Shichijō para el tren de las 5:29, 22 m² y nota 9,1. Cada habitación tiene su lavadora: sin colas, pero sin secadora, así que conviene lavar el 18 o el 19 para que seque.',
      alt: 'Si se prefiere hotel convencional con recepción 24 h: Wander Kyoto Nanajo (812 €, 9,0), a 3 min de Keihan y 12 de la estación.',
    },
  },
  {
    id: 'osaka',
    file: osakaFile,
    title: 'Osaka · Namba',
    navLabel: 'Osaka',
    laundry: true,
    why: 'Línea Midōsuji en Namba todos los días (Minoh-Kayano, Shin-Osaka a las 6:30, Umeda) y Kintetsu a Nara (vie 21). A pie: Dōtonbori y Kuromon.',
    short: ['Namba Midōsuji', 'Kintetsu Namba', 'Dōtonbori', 'Kuromon', 'Shinsaibashi'],
    pick: {
      match: 'Dotonbori Hotel',
      price: 968,
      room: '2 × twin de 18 m², cancelación gratuita',
      why: 'A 5 min de la línea Midōsuji y 3 de Kintetsu Namba, con lavandería de monedas confirmada en la propia ficha y opiniones que lo describen como tranquilo. Solo quedaban 2 twin de ese tipo.',
      alt: 'Si se busca gastar menos: Welina Hotel Premier Osaka Namba (674 €, 8,0), a 3 min de Kuromon; la lavandería solo consta por una opinión.',
    },
  },
  {
    id: 'tokio2',
    file: tokio2File,
    title: 'Tokio 2 · Asakusa',
    navLabel: 'Tokio 2',
    laundry: false,
    why: 'Sensō-ji a las 7:30 a pie (mié 26), Tsukuba Express a Akihabara, Skytree andando y taxi a Keisei Ueno a las 7:15 el día del vuelo (vie 28).',
    short: ['Sensō-ji', 'TX Asakusa', 'Est. Asakusa', 'Tawaramachi'],
    pick: {
      match: 'Henn na Hotel Premier Tokyo Asakusa Tawaramachi',
      price: 552,
      room: '2 × twin de 16 m², cancelación gratuita',
      why: 'El mejor precio con nota 8,7 y casi 5.000 opiniones, en el lado oeste de Asakusa: mejor para el taxi a Ueno de las 7:15 del día del vuelo. Sensō-ji a 9 min.',
      alt: 'Si se quiere estar más cerca del templo: B:CONTE Asakusa (818 € con cancelación, 9,3), a 5 min.',
    },
  },
]

/** El criterio tal y como lo ve la página (sin la clave del fichero). */
const toRanking = ({ key, label, hint }: Ranking): Ranking => ({ key, label, hint })

/** Id de la estancia del ryokan (→ Hotel.id): fechas y noches salen de hotels.ts. */
const RYOKAN_ID = 'takaragawa'
const RYOKAN_TITLE = 'Takaragawa Onsen · Ōsenkaku'

// ── Lógica portada del informe ──────────────────────────────────────────────

const finite = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n)
const yes = (s: unknown): boolean => /^s[ií]/i.test(String(s ?? '').trim())

/** Nombre sin mayúsculas, tildes ni signos, para emparejar un puesto con su ficha. */
function normalize(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/**
 * Ficha de un hotel por su nombre: exacto primero; si no, por nombre normalizado y, por
 * último, por inclusión. Un nombre sin letras latinas (浅草雷門 竹乃宿) se queda vacío al
 * normalizar, así que solo puede emparejar por nombre exacto.
 */
function findCandidate<T extends { readonly name: string }>(candidates: readonly T[], name: string): T | undefined {
  const exact = candidates.find((c) => c.name === name)
  if (exact) return exact
  const target = normalize(name)
  if (!target) return undefined
  return (
    candidates.find((c) => normalize(c.name) === target) ??
    candidates.find((c) => {
      const own = normalize(c.name)
      return own !== '' && (own.includes(target) || target.includes(own))
    })
  )
}

/** Minutos a pie hasta un punto; los ficheros los indexan por el nombre del punto o por su clave. */
function walkTo(candidate: RawCandidate, anchor: RawAnchor): number | null {
  const minutes = candidate.walkMin?.[anchor.name] ?? (anchor.key ? candidate.walkMin?.[anchor.key] : undefined)
  return finite(minutes) ? minutes : null
}

function laundryStatus(text: string): LaundryStatus {
  if (yes(text)) return 'yes'
  return /^no$/i.test(text.trim()) ? 'no' : 'unknown'
}

function toOption(raw: RawCandidate, stay: RawStay): HotelOption {
  // Precio mostrado: el total real de 2 × twin si existe; si no, la combinación más barata
  const twin = finite(raw.twinPriceTotalEUR)
  const cheapest = finite(raw.priceTotalEUR) ? raw.priceTotalEUR : null
  const price = twin ? (raw.twinPriceTotalEUR as number) : cheapest
  const laundryText = raw.coinLaundry ?? ''
  return {
    name: raw.name,
    url: raw.url,
    stars: finite(raw.stars) ? raw.stars : null,
    score: finite(raw.score) ? raw.score : null,
    reviews: finite(raw.reviews) ? raw.reviews : null,
    price,
    twin,
    cheapest,
    perRoomNight: price ? price / (ROOMS * stay.nights) : null,
    laundry: laundryStatus(laundryText),
    laundryText,
    thermalBath: yes(raw.onsen),
    walkMinutes: stay.anchors.map((anchor) => walkTo(raw, anchor)),
    roomCombo: raw.roomCombo ?? '',
    freeCancel: raw.freeCancel ?? '',
    notes: raw.notes ?? '',
  }
}

/** De más barato a más caro por el precio mostrado; sin precio, al final. */
const byPrice = (a: HotelOption, b: HotelOption): number => (a.price ?? 1e9) - (b.price ?? 1e9)

function toStay(meta: StayMeta): StayResearch {
  const file = meta.file
  // Las fichas en el orden del fichero: el emparejado por nombre depende de él
  const options = file.candidates.map((raw) => toOption(raw, file))
  const pickHotel = findCandidate(options, meta.pick.match)
  return {
    id: meta.id,
    citySlug: hotels.find((h) => h.id === meta.id)?.citySlug ?? meta.id,
    title: meta.title,
    navLabel: meta.navLabel,
    checkIn: file.checkIn,
    checkOut: file.checkOut,
    nights: file.nights,
    laundryRequired: meta.laundry,
    whyLocation: meta.why,
    anchors: file.anchors.map((anchor, i) => ({
      name: anchor.name,
      short: meta.short[i] ?? anchor.name.replace(/\s*\(.*\)\s*$/, ''),
    })),
    pick: {
      name: pickHotel?.name ?? meta.pick.match,
      hotel: pickHotel,
      price: meta.pick.price,
      perRoomNight: meta.pick.price / (ROOMS * file.nights),
      room: meta.pick.room,
      why: meta.pick.why,
      alternative: meta.pick.alt,
    },
    lists: RANKINGS.map((ranking) => ({
      ranking: toRanking(ranking),
      entries: (file.tops[ranking.source] ?? []).slice(0, TOP_SIZE).map((top, i) => ({
        position: i + 1,
        name: top.name,
        why: top.why,
        hotel: findCandidate(options, top.name),
      })),
    })),
    candidates: [...options].sort(byPrice),
    caveats: file.caveats ?? [],
  }
}

/** La propuesta y el número 1 de cada lista por estancia, con el total del viaje de cada estrategia. */
function toSummary(stays: readonly StayResearch[]): ResearchSummary {
  const rows = stays.map((stay) => ({
    stay,
    pick: { name: stay.pick.name, price: stay.pick.price },
    tops: stay.lists.map(({ ranking, entries }) => {
      const first = entries[0]
      return { ranking, name: first?.hotel?.name ?? first?.name ?? '—', price: first?.hotel?.price ?? null }
    }),
  }))
  const total = (prices: readonly (number | null)[]): SummaryTotal => {
    const sum = prices.reduce<number>((acc, price) => acc + (price ?? 0), 0)
    return { total: sum, perPerson: sum / TRAVELERS }
  }
  return {
    rows,
    pick: total(rows.map((row) => row.pick.price)),
    tops: RANKINGS.map((ranking, i) => ({ ranking: toRanking(ranking), ...total(rows.map((row) => row.tops[i].price)) })),
  }
}

function toRyokan(raw: RawRyokan | undefined): RyokanResearch | undefined {
  const stay = hotels.find((h) => h.id === RYOKAN_ID)
  if (!raw || !stay) return undefined
  return {
    id: stay.id,
    citySlug: stay.citySlug,
    title: RYOKAN_TITLE,
    navLabel: 'Takaragawa',
    checkIn: stay.checkIn,
    checkOut: stay.checkOut,
    nights: stay.nights,
    url: raw.url,
    available: raw.available || '—',
    price: finite(raw.priceTotalEUR) ? raw.priceTotalEUR : null,
    rooms: raw.rooms || '—',
    meals: raw.meals || '—',
    score: finite(raw.score) ? raw.score : null,
    cancel: raw.cancel || '—',
    notes: raw.notes ?? '',
  }
}

const stays = STAYS.map(toStay)

export const hotelResearch: HotelResearch = {
  // Las fechas ISO en UTC ordenan igual como texto: la primera es la búsqueda más antigua
  searchedAt: STAYS.flatMap((meta) => (meta.file.searchedAt ? [meta.file.searchedAt] : [])).sort()[0] ?? '',
  rankings: RANKINGS.map(toRanking),
  stays,
  summary: toSummary(stays),
  ryokan: toRyokan(STAYS.map((meta) => meta.file.takaragawa).find(Boolean)),
}
