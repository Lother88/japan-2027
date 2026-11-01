/**
 * Bloque de título del hero («Kanji y sello»): hojas de calendario con la salida y el regreso,
 * cuenta atrás, 日本 vertical decorativo, sello «2027», H1 «Japón», subtítulo y entradilla.
 * La fecha de «hoy» se inyecta para que la cuenta atrás sea determinista.
 */
import { render, screen, within } from '@testing-library/react'
import Hero from '@/features/landing/Hero'
import HeroDates from '@/features/landing/HeroDates'

describe('Hero — título «Kanji y sello»', () => {
  it('mantiene un único H1 cuyo nombre accesible es «Japón»', () => {
    render(<Hero today={new Date(2026, 10, 1)} />)
    const h1s = screen.getAllByRole('heading', { level: 1 })
    expect(h1s).toHaveLength(1)
    expect(h1s[0]).toHaveAccessibleName('Japón')
  })

  it('日本 es decorativo, en japonés y escrito en vertical', () => {
    const { container } = render(<Hero today={new Date(2026, 10, 1)} />)
    const kanji = container.querySelector('[data-hero-kanji]') as HTMLElement
    expect(kanji).toHaveTextContent('日本')
    expect(kanji).toHaveAttribute('aria-hidden', 'true')
    expect(kanji).toHaveAttribute('lang', 'ja')
  })

  it('el sello lleva el año de la salida y es decorativo', () => {
    const { container } = render(<Hero today={new Date(2026, 10, 1)} />)
    const seal = container.querySelector('[data-hanko]') as HTMLElement
    expect(seal).toHaveTextContent('2027')
    expect(seal).toHaveAttribute('aria-hidden', 'true')
  })

  it('el subtítulo va en dos líneas y la entradilla resalta lo moderno y lo tradicional', () => {
    const { container } = render(<Hero today={new Date(2026, 10, 1)} />)
    const sub = container.querySelector('[data-hero-sub]') as HTMLElement
    expect([...sub.querySelectorAll('span')].map((s) => s.textContent)).toEqual([
      'Tres semanas,',
      'una vuelta completa.',
    ])
    expect(screen.getByText(/Del neón de Tokio a los templos de Kioto, y vuelta: 21 días en tren por seis bases/)).toBeInTheDocument()
    expect(screen.getByText('entre lo más moderno y lo más tradicional').tagName).toBe('STRONG')
  })

  it('ya no pinta el eyebrow de fechas', () => {
    const { container } = render(<Hero today={new Date(2026, 10, 1)} />)
    expect(container.querySelector('[data-eyebrow]')).toBeNull()
  })
})

describe('HeroDates — himekuri y cuenta atrás', () => {
  it('las hojas se leen como un rango con su etiqueta y llevan <time dateTime>', () => {
    render(<HeroDates today={new Date(2026, 10, 1)} />)
    const cal = screen.getByRole('img', { name: 'Del 8 al 29 de mayo de 2027' })
    const times = [...cal.querySelectorAll('time')].map((t) => t.getAttribute('dateTime'))
    expect(times).toEqual(['2027-05-08', '2027-05-29'])
  })

  it('cada hoja muestra mes en kanji, nombre del mes, día y día de la semana', () => {
    render(<HeroDates today={new Date(2026, 10, 1)} />)
    const cal = screen.getByRole('img', { name: 'Del 8 al 29 de mayo de 2027' })
    const [salida, regreso] = [...cal.querySelectorAll('time')] as HTMLElement[]
    expect(salida).toHaveTextContent('五月')
    expect(salida).toHaveTextContent('mayo')
    expect(salida).toHaveTextContent('8')
    expect(salida).toHaveTextContent('土 · sáb')
    expect(regreso).toHaveTextContent('29')
    for (const ja of cal.querySelectorAll('[lang="ja"]')) expect(ja.textContent).toMatch(/^[一二三四五六七八九十月日火水木金土]+$/)
    expect(cal.querySelectorAll('[lang="ja"]')).toHaveLength(4)
  })

  it('entre las hojas, la duración del viaje', () => {
    render(<HeroDates today={new Date(2026, 10, 1)} />)
    const cal = screen.getByRole('img', { name: 'Del 8 al 29 de mayo de 2027' })
    expect(within(cal).getByText('21 días')).toBeInTheDocument()
  })

  it.each([
    [new Date(2026, 10, 1), '188 días para despegar'],
    [new Date(2027, 4, 7, 23, 30), '1 día para despegar'],
    [new Date(2027, 4, 8), 'Hoy despegamos'],
    [new Date(2027, 4, 13), 'Día 5 de 21'],
    [new Date(2027, 4, 30), 'Viaje completado'],
  ])('cuenta atrás con hoy = %s → «%s»', (today, text) => {
    const { container } = render(<HeroDates today={today} />)
    expect(container.querySelector('[data-countdown]')).toHaveTextContent(text)
  })

  it('sin fecha inyectada usa el reloj del sistema (hora local)', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2027, 4, 7, 12))
    try {
      const { container } = render(<HeroDates />)
      expect(container.querySelector('[data-countdown]')).toHaveTextContent('1 día para despegar')
    } finally {
      vi.useRealTimers()
    }
  })
})
