/**
 * Selección del motivo de ilustración por día (separado del componente para
 * cumplir react-refresh/only-export-components).
 *
 * El mapeo es por día concreto del itinerario, de modo que las figuras se
 * relacionan con lo que se ve y cambian de un día a otro. Para los días urbanos
 * el motivo `skyline` se auto-varía con la semilla (ver illustrations.tsx).
 */
export type IllustrationKind =
  | 'pagoda'
  | 'skyline'
  | 'onsen'
  | 'castle'
  | 'machiya'
  | 'gassho'
  | 'torii'
  | 'pavilion'

/** Motivo asignado a cada día del itinerario (9–29). */
const byDay: Record<number, IllustrationKind> = {
  9: 'pagoda', //   Asakusa, Sensō-ji (templo de Edo, pagoda)
  10: 'skyline', // Shibuya / Harajuku / Shinjuku (rascacielos)
  11: 'machiya', // Ueno / Yanaka (shitamachi histórico)
  12: 'skyline', // Palacio Imperial / Ginza / Tsukiji
  13: 'onsen', //   Takaragawa (ryokan junto al río)
  14: 'machiya', // Kanazawa, barrio de chaya (casas de té de madera)
  15: 'castle', //  Kanazawa, Kenroku-en + castillo
  16: 'machiya', // Takayama, Sanmachi (casco antiguo de madera)
  17: 'gassho', //  Shirakawa-go (tejados de paja gasshō-zukuri)
  18: 'pagoda', //  Kioto, Tō-ji (templo de pagoda)
  19: 'machiya', // Kioto, Higashiyama / Gion (casas de té)
  20: 'torii', //   Kioto, Fushimi Inari (toriis) + Arashiyama (bambú)
  21: 'pavilion', //Kioto, Kinkaku-ji (pabellón dorado)
  22: 'pagoda', //  Nara, Tōdai-ji (gran templo) → Osaka
  23: 'skyline', // Osaka, Katsuo-ji + Dōtonbori
  24: 'skyline', // Excursión a Hiroshima
  25: 'castle', //  Osaka, castillo
  26: 'skyline', // Tokio, Akihabara
  27: 'skyline', // Tokio, Odaiba (bahía / puente)
  28: 'skyline', // Tokio, Asakusa + Skytree
  29: 'skyline', // Tokio, mañana libre y regreso
}

/** Fallback por ciudad si un día no estuviera mapeado. */
function cityFallback(citySlug: string): IllustrationKind {
  switch (citySlug) {
    case 'takaragawa':
      return 'onsen'
    case 'osaka':
      return 'skyline'
    case 'kioto':
    case 'kanazawa':
    case 'takayama':
      return 'machiya'
    case 'tokio':
      return 'skyline'
    default:
      return 'pagoda'
  }
}

/** Elige el motivo según el día (con fallback por ciudad). */
export function pickIllustration(citySlug: string, dayId: number): IllustrationKind {
  return byDay[dayId] ?? cityFallback(citySlug)
}
