/**
 * HeroDates — fechas del viaje en la cabecera del título: dos hojas de calendario arrancables
 * (himekuri) con la salida y el regreso, unidas por la duración, y la cuenta atrás.
 *
 * Todo sale de los datos (tripSummary + ayudas de fechas de trip.ts): mes en kanji, día de la
 * semana y cifras. Las hojas se leen como una imagen con el rango en palabras («Del 8 al 29 de
 * mayo de 2027») y conservan sus <time dateTime>. «Hoy» es el día del calendario local.
 * Estilos y entrada en index.css (`[data-hero-dates]`…).
 */
import { Fragment } from 'react'
import {
  calendarDay,
  countdownText,
  formatDateSpan,
  localIsoDate,
  tripCountdown,
  tripSummary,
  type CalendarDay,
} from '@/data/trip'

const trip = tripSummary()
const salida = calendarDay(trip.departure)
const regreso = calendarDay(trip.returnDate)
const rango = formatDateSpan(trip.departure, trip.returnDate)

function CalendarPage({ date, which }: { date: CalendarDay; which: 'salida' | 'regreso' }) {
  return (
    <time dateTime={date.iso} data-cal-page={which}>
      <span data-cal-ring />
      <span data-cal-ring />
      <span data-cal-month>
        <span lang="ja">{date.monthKanji}</span>
        <small>{date.monthName}</small>
      </span>
      <span data-cal-num>{date.day}</span>
      <span data-cal-weekday>
        <span lang="ja">{date.weekdayKanji}</span> · {date.weekdayShort}
      </span>
    </time>
  )
}

export default function HeroDates() {
  const { value, label } = countdownText(
    tripCountdown(trip.departure, trip.returnDate, localIsoDate(new Date())),
  )

  return (
    <div data-hero-dates>
      <div data-himekuri role="img" aria-label={rango}>
        <CalendarPage date={salida} which="salida" />
        <span data-cal-span>
          <span data-cal-len>{trip.days} días</span>
          <span data-cal-line />
        </span>
        <CalendarPage date={regreso} which="regreso" />
      </div>

      <p data-countdown>
        <strong>{value}</strong>{' '}
        <span data-countdown-label>
          {label.map((line, i) => (
            <Fragment key={line}>
              {i > 0 && ' '}
              <span>{line}</span>
            </Fragment>
          ))}
        </span>
      </p>
    </div>
  )
}
