/**
 * Selección de la ilustración isométrica de cada día (separado del componente para
 * cumplir react-refresh/only-export-components).
 *
 * Cada día del itinerario (9–29) tiene su propio dibujo isométrico generado con la skill
 * anatomy-asset (marcados en ./iso, cargados en diferido desde ./iso/registry). El
 * identificador del asset coincide con la clase CSS a la que va acotado su <style>
 * (`iso-dNN`), de modo que sirve a la vez de clave de carga y de clase del <svg>.
 */
export const ISO_KINDS = [
  'iso-d09', 'iso-d10', 'iso-d11', 'iso-d12', 'iso-d13', 'iso-d14', 'iso-d15',
  'iso-d16', 'iso-d17', 'iso-d18', 'iso-d19', 'iso-d20', 'iso-d21', 'iso-d22',
  'iso-d23', 'iso-d24', 'iso-d25', 'iso-d26', 'iso-d27', 'iso-d28', 'iso-d29',
] as const

export type IllustrationKind = (typeof ISO_KINDS)[number]

/** Dibujo asignado a cada día del itinerario (9–29). */
const byDay: Record<number, IllustrationKind> = {
  9: 'iso-d09', //  Asakusa: Kaminarimon (Sensō-ji)
  10: 'iso-d10', // Shibuya / Harajuku / Shinjuku
  11: 'iso-d11', // Ueno / Yanaka (shitamachi)
  12: 'iso-d12', // Palacio Imperial / Ginza / Tsukiji
  13: 'iso-d13', // Takaragawa (onsen junto al río)
  14: 'iso-d14', // Kanazawa, barrio de chaya
  15: 'iso-d15', // Kanazawa, Kenroku-en + castillo
  16: 'iso-d16', // Takayama, Sanmachi
  17: 'iso-d17', // Shirakawa-go (gasshō-zukuri)
  18: 'iso-d18', // Kioto, Tō-ji
  19: 'iso-d19', // Kioto, Higashiyama / Gion
  20: 'iso-d20', // Kioto, Fushimi Inari + Arashiyama
  21: 'iso-d21', // Kioto, Kinkaku-ji
  22: 'iso-d22', // Nara, Tōdai-ji → Osaka
  23: 'iso-d23', // Osaka, Katsuo-ji + Dōtonbori
  24: 'iso-d24', // Excursión a Hiroshima
  25: 'iso-d25', // Osaka, castillo
  26: 'iso-d26', // Tokio, Akihabara
  27: 'iso-d27', // Tokio, Odaiba
  28: 'iso-d28', // Tokio, Asakusa + Skytree
  29: 'iso-d29', // Tokio, mañana libre y regreso
}

/** Dibujo del día, o null si el día no tiene asset (no se pinta nada). */
export function pickIllustration(dayId: number): IllustrationKind | null {
  return byDay[dayId] ?? null
}
