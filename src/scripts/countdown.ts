/**
 * countdown — recalcula la cuenta atrás del hero con la fecha local del visitante.
 *
 * El HTML sale con el valor del día del build; sin este paso, la cuenta se quedaría congelada
 * en esa fecha. Las fechas del viaje van en `data-departure`/`data-return` de [data-countdown]
 * (así el script no arrastra los datos del itinerario) y el texto sale de las mismas ayudas de
 * src/data/trip.ts que usa el build.
 */
import { countdownText, localIsoDate, tripCountdown } from '@/data/trip'

const box = document.querySelector<HTMLElement>('[data-countdown]')
const valueEl = box?.querySelector('[data-countdown-value]')
const labelEl = box?.querySelector('[data-countdown-label]')
const { departure, return: returnDate } = box?.dataset ?? {}

if (box && valueEl && labelEl && departure && returnDate) {
  const { value, label } = countdownText(tripCountdown(departure, returnDate, localIsoDate(new Date())))
  valueEl.textContent = value
  // Una línea por <span> (index.css las apila), separadas por un espacio para la lectura.
  labelEl.replaceChildren(
    ...label.flatMap((line, i) => {
      const span = document.createElement('span')
      span.textContent = line
      return i > 0 ? [' ', span] : [span]
    }),
  )
}
