/**
 * Fechas del viaje para el hero: hojas de calendario (himekuri), rango legible y cuenta atrás.
 * Todo se deriva del itinerario; nada de fechas escritas a mano en la UI.
 */
import { itinerary } from '../itinerary'
import {
  calendarDay,
  countdownText,
  formatDateSpan,
  localIsoDate,
  numberWord,
  tripCountdown,
  tripSummary,
} from '../trip'

describe('tripSummary — salida y regreso', () => {
  const trip = tripSummary()

  it('la salida es la víspera del primer día del itinerario', () => {
    expect(itinerary[0].date).toBe('2027-05-09')
    expect(trip.departure).toBe('2027-05-08')
  })

  it('el regreso es el último día del itinerario', () => {
    expect(trip.returnDate).toBe(itinerary[itinerary.length - 1].date)
    expect(trip.returnDate).toBe('2027-05-29')
  })

  it('conserva el rango corto del pie', () => {
    expect(trip.dateRange).toBe('8 → 29 mayo 2027')
  })
})

describe('calendarDay — hoja de calendario', () => {
  it('8 de mayo de 2027: 五月, sábado (土 · sáb)', () => {
    expect(calendarDay('2027-05-08')).toEqual({
      iso: '2027-05-08',
      year: 2027,
      day: 8,
      monthKanji: '五月',
      monthName: 'mayo',
      weekdayKanji: '土',
      weekdayShort: 'sáb',
    })
  })

  it.each([
    ['2027-01-03', '一月', 'enero', '日', 'dom'],
    ['2027-02-01', '二月', 'febrero', '月', 'lun'],
    ['2027-03-02', '三月', 'marzo', '火', 'mar'],
    ['2027-04-07', '四月', 'abril', '水', 'mié'],
    ['2027-06-03', '六月', 'junio', '木', 'jue'],
    ['2027-07-02', '七月', 'julio', '金', 'vie'],
    ['2027-08-01', '八月', 'agosto', '日', 'dom'],
    ['2027-09-01', '九月', 'septiembre', '水', 'mié'],
    ['2027-10-01', '十月', 'octubre', '金', 'vie'],
    ['2027-11-01', '十一月', 'noviembre', '月', 'lun'],
    ['2027-12-31', '十二月', 'diciembre', '金', 'vie'],
  ])('%s → %s (%s), %s · %s', (iso, monthKanji, monthName, weekdayKanji, weekdayShort) => {
    expect(calendarDay(iso)).toMatchObject({ monthKanji, monthName, weekdayKanji, weekdayShort })
  })
})

describe('formatDateSpan — rango para lectores de pantalla', () => {
  it('mismo mes', () => {
    expect(formatDateSpan('2027-05-08', '2027-05-29')).toBe('Del 8 al 29 de mayo de 2027')
  })

  it('meses distintos del mismo año', () => {
    expect(formatDateSpan('2027-04-30', '2027-05-02')).toBe('Del 30 de abril al 2 de mayo de 2027')
  })

  it('años distintos', () => {
    expect(formatDateSpan('2026-12-30', '2027-01-02')).toBe('Del 30 de diciembre de 2026 al 2 de enero de 2027')
  })
})

describe('localIsoDate — fecha del calendario local, no la de UTC', () => {
  it('usa los campos locales del Date', () => {
    expect(localIsoDate(new Date(2027, 4, 8, 0, 5))).toBe('2027-05-08')
    expect(localIsoDate(new Date(2027, 4, 8, 23, 55))).toBe('2027-05-08')
    expect(localIsoDate(new Date(2026, 0, 1))).toBe('2026-01-01')
  })
})

describe('tripCountdown — estado de la cuenta atrás', () => {
  const dep = '2027-05-08'
  const ret = '2027-05-29'

  it('antes de la salida: días que faltan', () => {
    expect(tripCountdown(dep, ret, '2026-11-01')).toEqual({ kind: 'before', days: 188 })
    expect(tripCountdown(dep, ret, '2027-05-07')).toEqual({ kind: 'before', days: 1 })
  })

  it('el día de la salida', () => {
    expect(tripCountdown(dep, ret, '2027-05-08')).toEqual({ kind: 'departure' })
  })

  it('durante el viaje: día X de N (N = días del itinerario)', () => {
    const total = tripSummary().days
    expect(tripCountdown(dep, ret, '2027-05-09')).toEqual({ kind: 'during', day: 1, total })
    expect(tripCountdown(dep, ret, '2027-05-29')).toEqual({ kind: 'during', day: total, total })
  })

  it('después del regreso', () => {
    expect(tripCountdown(dep, ret, '2027-05-30')).toEqual({ kind: 'after' })
    expect(tripCountdown(dep, ret, '2028-01-01')).toEqual({ kind: 'after' })
  })

  it('cruza el cambio de hora sin perder ni ganar un día', () => {
    // España adelanta la hora el último domingo de marzo (28-03-2027)
    expect(tripCountdown(dep, ret, '2027-03-27')).toEqual({ kind: 'before', days: 42 })
    expect(tripCountdown(dep, ret, '2027-03-29')).toEqual({ kind: 'before', days: 40 })
  })
})

describe('countdownText — texto de la cuenta atrás', () => {
  it('plural y singular antes de la salida', () => {
    expect(countdownText({ kind: 'before', days: 188 })).toEqual({ value: '188', label: ['días para', 'despegar'] })
    expect(countdownText({ kind: 'before', days: 1 })).toEqual({ value: '1', label: ['día para', 'despegar'] })
  })

  it('el día de la salida', () => {
    expect(countdownText({ kind: 'departure' })).toEqual({ value: 'Hoy', label: ['despegamos'] })
  })

  it('durante el viaje', () => {
    expect(countdownText({ kind: 'during', day: 5, total: 21 })).toEqual({ value: 'Día 5', label: ['de 21'] })
  })

  it('al terminar', () => {
    expect(countdownText({ kind: 'after' })).toEqual({ value: 'Viaje', label: ['completado'] })
  })
})

describe('numberWord — cifras pequeñas en letra', () => {
  it('escribe en letra hasta diez y en cifras a partir de ahí', () => {
    expect(numberWord(6)).toBe('seis')
    expect(numberWord(10)).toBe('diez')
    expect(numberWord(21)).toBe('21')
  })
})
