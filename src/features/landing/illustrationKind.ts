/**
 * Selección del motivo de ilustración por ciudad (separado del componente para
 * cumplir react-refresh/only-export-components).
 */
export type IllustrationKind = 'pagoda' | 'skyline' | 'onsen'

/** Elige el motivo según la ciudad base del día (con variedad para Tokio). */
export function pickIllustration(citySlug: string, dayId: number): IllustrationKind {
  switch (citySlug) {
    case 'takaragawa':
      return 'onsen'
    case 'osaka':
      return 'skyline'
    case 'kioto':
    case 'kanazawa':
    case 'takayama':
      return 'pagoda'
    case 'tokio':
      return dayId % 2 === 0 ? 'skyline' : 'pagoda'
    default:
      return 'pagoda'
  }
}
