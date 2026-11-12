/**
 * Estancias de hotel — zona elegida por estancia (el hotel concreto se reserva aparte).
 *
 * Fuentes: docs/propuestas-diseno/itinerario-data.js (`hotels`) y docs/zonas-hoteles-2027.md.
 * El hotel es solo para dormir: manda la ubicación respecto al itinerario y a los días con
 * maletas. Lavandería de monedas obligatoria en Kanazawa, Kioto y Osaka (coladas del vie 14,
 * jue 20 y lun 24). Fechas ISO de entrada y salida; `nights` = noches de la estancia.
 */

import type { Hotel } from './types'

export const hotels: readonly Hotel[] = [
  {
    id: 'tokio1',
    citySlug: 'tokio',
    area: 'Ueno',
    checkIn: '2027-05-08',
    checkOut: '2027-05-12',
    nights: 4,
    maps: 'Ueno Station Tokyo',
    laundry: false,
    reasons: [
      'Skyliner directo desde Narita',
      'El Jōetsu Shinkansen (a Takaragawa) sale de la misma estación',
      'Línea Ginza directa a Ginza y Shibuya; línea Hibiya a Tsukiji',
      'Yanaka y Kanda Myōjin quedan a pie',
    ],
  },
  {
    id: 'takaragawa',
    citySlug: 'takaragawa',
    area: 'Ryokan Ōsenkaku',
    checkIn: '2027-05-12',
    checkOut: '2027-05-13',
    nights: 1,
    maps: 'Takaragawa Onsen Osenkaku',
    laundry: false,
    reasons: [
      'Ryokan único del manantial: se reserva aparte, con la lanzadera (reserva por teléfono)',
    ],
  },
  {
    id: 'kanazawa',
    citySlug: 'kanazawa',
    area: 'Estación (salida este) / Ōmichō',
    checkIn: '2027-05-13',
    checkOut: '2027-05-15',
    nights: 2,
    maps: 'Kanazawa Station',
    laundry: true,
    reasons: [
      'Se llega en Shinkansen y el bus Nōhi a Takayama sale de la estación',
      'Ōmichō a 10 min a pie; Higashi Chaya a unos 20',
    ],
  },
  {
    id: 'takayama',
    citySlug: 'takayama',
    area: 'Junto a la estación JR',
    checkIn: '2027-05-15',
    checkOut: '2027-05-17',
    nights: 2,
    maps: 'Takayama Station',
    laundry: false,
    reasons: [
      'El centro de autobuses Nōhi (bus de las 7:20 a Shirakawa-go) está junto a la estación',
      'El tren a Kioto del lunes sale de la misma estación',
      'Sanmachi a 10 min a pie',
      'Poca oferta y la parada más cara por noche: reservar pronto',
    ],
  },
  {
    id: 'kioto',
    citySlug: 'kioto',
    area: 'Shichijō (línea Keihan)',
    checkIn: '2027-05-17',
    checkOut: '2027-05-21',
    nights: 4,
    maps: 'Shichijo Station Keihan Kyoto',
    laundry: true,
    reasons: [
      'Línea Keihan: Fushimi Inari a 3 paradas con el primer tren',
      'Sanjūsangen-dō a 5 min a pie; Kiyomizu a unos 20',
      'Cerca de la estación de Kioto para los dos días con maletas (17 y 21)',
    ],
  },
  {
    id: 'osaka',
    citySlug: 'osaka',
    area: 'Namba / Shinsaibashi',
    checkIn: '2027-05-21',
    checkOut: '2027-05-25',
    nights: 4,
    maps: 'Namba Station Osaka',
    laundry: true,
    reasons: [
      'El Kintetsu de Nara termina en Namba',
      'Línea Midōsuji directa a Shin-Osaka, a Umeda y hacia Katsuo-ji',
      'Kuromon, Dōtonbori y Den Den Town a pie',
    ],
  },
  {
    id: 'tokio2',
    citySlug: 'tokio',
    area: 'Asakusa',
    checkIn: '2027-05-25',
    checkOut: '2027-05-28',
    nights: 3,
    maps: 'Asakusa Station Tokyo',
    laundry: false,
    reasons: [
      'Sensō-ji a las 7:30 a pie; Skytree a unos 20 min andando',
      'Akihabara a 5 min en tren',
      'Día 28: taxi a Ueno (~10 min) para el Skyliner, o tren directo a Narita desde Asakusa',
    ],
  },
] as const
