/**
 * Selección de la ilustración isométrica de cada día (separado del componente para
 * cumplir react-refresh/only-export-components).
 *
 * Cada día del itinerario (8–28 may) tiene su dibujo isométrico generado con la skill
 * anatomy-asset (marcados en ./iso, cargados en diferido desde ./iso/registry). El
 * identificador del asset coincide con la clase CSS a la que va acotado su <style>, de modo
 * que sirve a la vez de clave de carga y de clase del <svg>.
 *
 * Los `iso-dNN` conservan el número del día para el que se dibujaron en el itinerario
 * anterior (9–29); tras el cambio de fechas se reasignan por contenido, no por número. Las
 * escenas nuevas llevan nombre (`iso-jinya`, `iso-sagano`, `iso-nakano`). Sin uso desde la
 * revisión del 12 nov 2026: iso-d18 (Tō-ji), iso-d21 (Kinkaku-ji) e iso-d27 (Rainbow Bridge).
 */
export const ISO_KINDS = [
  'iso-d09', 'iso-d10', 'iso-d11', 'iso-d12', 'iso-d13', 'iso-d14', 'iso-d15',
  'iso-d16', 'iso-d17', 'iso-d18', 'iso-d19', 'iso-d20', 'iso-d21', 'iso-d22',
  'iso-d23', 'iso-d24', 'iso-d25', 'iso-d26', 'iso-d27', 'iso-d28', 'iso-d29',
  'iso-jinya', 'iso-sagano', 'iso-nakano',
] as const

export type IllustrationKind = (typeof ISO_KINDS)[number]

/** Dibujo asignado a cada día del itinerario (8–28 may 2027). */
const byDay: Record<number, IllustrationKind> = {
  8: 'iso-d09', // Llegada · Asakusa de noche: Kaminarimon (Sensō-ji)
  9: 'iso-d12', // Palacio Imperial y Ginza
  10: 'iso-d10', // Meiji, Harajuku, Shibuya y Shinjuku: cruce de Shibuya
  11: 'iso-d11', // Museo Nacional, Tsukiji y Yanaka: esquina shitamachi
  12: 'iso-d13', // Takaragawa (onsen junto al río)
  13: 'iso-d14', // Kanazawa: Higashi Chaya
  14: 'iso-d15', // Kenroku-en y castillo
  15: 'iso-d16', // Takayama: Sanmachi y Yatai Kaikan
  16: 'iso-jinya', // Takayama: mercado matinal y Takayama Jinya
  17: 'iso-d17', // Shirakawa-go (gasshō-zukuri)
  18: 'iso-d19', // Higashiyama: Kiyomizu-dera
  19: 'iso-sagano', // Arashiyama: bosque de bambú de Sagano
  20: 'iso-d20', // Fushimi Inari al amanecer
  21: 'iso-d22', // Tō-ji, Nara (Tōdai-ji) → Osaka
  22: 'iso-d23', // Katsuo-ji y Minami
  23: 'iso-d24', // Excursión a Hiroshima
  24: 'iso-d25', // Osaka: castillo
  25: 'iso-d26', // Vuelta a Tokio: Akihabara
  26: 'iso-d28', // Asakusa y Skytree
  27: 'iso-nakano', // Fukagawa y Nakano Broadway
  28: 'iso-d29', // Regreso: Narita
}

/** Dibujo del día, o null si el día no tiene asset (no se pinta nada). */
export function pickIllustration(dayId: number): IllustrationKind | null {
  return byDay[dayId] ?? null
}
