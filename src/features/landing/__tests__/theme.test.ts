import {
  formatLongDate,
  formatShortDate,
  pad2,
  getCityMeta,
  themeForCity,
  tokensForCity,
} from '@/features/landing/theme'

describe('theme — helpers de fecha', () => {
  it('formatLongDate formatea día largo en español', () => {
    expect(formatLongDate('2027-05-09')).toBe('Domingo 9 mayo')
    expect(formatLongDate('2027-05-10')).toBe('Lunes 10 mayo')
  })

  it('formatShortDate formatea día corto', () => {
    expect(formatShortDate('2027-05-09')).toBe('dom · 9 may')
  })

  it('pad2 rellena a dos dígitos', () => {
    expect(pad2(9)).toBe('09')
    expect(pad2(29)).toBe('29')
  })
})

describe('theme — identidad por ciudad', () => {
  it('getCityMeta devuelve kanji y color por ciudad', () => {
    expect(getCityMeta('tokio').kanji).toBe('東京')
    // El color de acento es una variable CSS para adaptarse al tema claro/oscuro
    expect(getCityMeta('kioto').dot).toBe('var(--coral)')
  })

  it('getCityMeta usa fallback para ciudad desconocida', () => {
    expect(getCityMeta('desconocida').kanji).toBe('日本')
  })

  it('themeForCity: takaragawa es onsen, el resto warm', () => {
    expect(themeForCity('takaragawa')).toBe('onsen')
    expect(themeForCity('tokio')).toBe('warm')
  })

  it('tokensForCity onsen usa la familia verde', () => {
    expect(tokensForCity('takaragawa').heading).toBe('var(--green)')
    expect(tokensForCity('tokio').heading).toBe('var(--coral)')
  })
})
