/**
 * ZoneCard — tarjeta de una zona del itinerario.
 *
 * Cabecera (badge + nombre + tags) · bloque colapsable "El lugar" con el
 * contexto cultural por POI (desde src/data/context.ts, separado del modelo
 * anti-spoiler) · logística (Acceso / Horario / Notas desde Zone.practical).
 * El bloque de contexto solo se muestra si hay fichas para la zona.
 */
import type { Zone } from '@/data/types'
import type { ThemeTokens } from '@/features/landing/theme'
import { getContext } from '@/data/context'
import { fontSerif, fontSans } from '@/features/landing/theme'

interface Props {
  zone: Zone
  tokens: ThemeTokens
}

export default function ZoneCard({ zone, tokens }: Props) {
  const entries = getContext(zone.id)
  const hasContext = !!entries && entries.length > 0
  const badge = zone.name.charAt(0)

  const { access, hours, logistics } = zone.practical

  // Filas de logística presentes (para no poner border-bottom en la última)
  const infoRows: Array<'access' | 'hours' | 'logistics'> = []
  if (access) infoRows.push('access')
  if (hours) infoRows.push('hours')
  if (logistics && logistics.length > 0) infoRows.push('logistics')

  return (
    <div style={{ background: '#fffdf9', border: '1px solid #ece2d2', borderRadius: 14, overflow: 'hidden' }}>
      {/* ── Cabecera: badge + nombre + tags ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13, padding: '18px 22px 14px' }}>
        <span
          style={{
            flex: 'none',
            width: 30,
            height: 30,
            borderRadius: 8,
            background: tokens.badgeBg,
            color: tokens.badgeText,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: fontSerif,
            fontWeight: 700,
            fontSize: 14,
          }}
          aria-hidden="true"
        >
          {badge}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: fontSerif, fontSize: 20, fontWeight: 600, color: '#1b2a4a' }}>{zone.name}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {zone.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: fontSans,
                  fontSize: 11,
                  color: tokens.tagText,
                  background: tokens.tagBg,
                  padding: '3px 9px',
                  borderRadius: 20,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── "El lugar" — contexto cultural colapsable (solo si hay fichas) ── */}
      {hasContext && (
        <div style={{ padding: '2px 22px 18px' }}>
          <details
            data-spoiler
            style={{ background: tokens.spoilerBg, border: `1px solid ${tokens.spoilerBorder}`, borderRadius: 11, overflow: 'hidden' }}
          >
            <summary
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
                padding: '13px 17px',
                cursor: 'pointer',
                userSelect: 'none',
                listStyle: 'none',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={tokens.spoilerAccent}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 7v14" />
                  <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                </svg>
                <span
                  style={{
                    fontFamily: fontSans,
                    fontSize: 11,
                    letterSpacing: '0.13em',
                    textTransform: 'uppercase',
                    color: tokens.spoilerAccent,
                    fontWeight: 700,
                  }}
                >
                  El lugar
                </span>
              </span>
              <span
                data-spoiler-hint
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: tokens.heading,
                  transition: 'opacity .2s ease',
                }}
              >
                <span data-spoiler-show>Mostrar contexto</span>
                <span data-spoiler-hide>Ocultar</span>
                <svg
                  data-spoiler-chev
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={tokens.heading}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </summary>

            <div style={{ padding: '0 17px 16px' }}>
              {entries.map((poi, i) => (
                <div
                  key={poi.nombre}
                  style={{
                    paddingTop: i === 0 ? 4 : 14,
                    marginTop: i === 0 ? 0 : 14,
                    borderTop: i === 0 ? undefined : `1px solid ${tokens.spoilerBorder}`,
                  }}
                >
                  <div style={{ fontFamily: fontSerif, fontSize: 16, fontWeight: 700, color: '#1b2a4a' }}>{poi.nombre}</div>
                  <div style={{ fontFamily: fontSans, fontSize: 12.5, fontWeight: 600, color: tokens.spoilerAccent, marginTop: 2 }}>
                    {poi.queEs}
                  </div>
                  <p style={{ margin: '8px 0 0', fontFamily: fontSans, fontSize: 13.5, lineHeight: 1.62, color: '#42475a' }}>
                    {poi.historia}
                  </p>
                  <p style={{ margin: '8px 0 0', fontFamily: fontSans, fontSize: 13.5, lineHeight: 1.62, color: '#42475a' }}>
                    {poi.significado}
                  </p>
                  {poi.datoCurioso && (
                    <div style={{ marginTop: 10, padding: '9px 12px', background: '#fffdf9', border: `1px solid ${tokens.factBorder}`, borderRadius: 8 }}>
                      <div
                        style={{
                          fontFamily: fontSans,
                          fontSize: 9.5,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: tokens.factLabel,
                          fontWeight: 700,
                          marginBottom: 3,
                        }}
                      >
                        Dato curioso
                      </div>
                      <div style={{ fontFamily: fontSans, fontSize: 13, lineHeight: 1.5, color: '#42475a' }}>{poi.datoCurioso}</div>
                    </div>
                  )}
                  {poi.fuentes.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 10px', marginTop: 9 }}>
                      <span
                        style={{
                          fontFamily: fontSans,
                          fontSize: 9.5,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: tokens.factLabel,
                          fontWeight: 700,
                        }}
                      >
                        Fuentes
                      </span>
                      {poi.fuentes.map((f) => (
                        <a
                          key={f.url}
                          href={f.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontFamily: fontSans, fontSize: 12, color: tokens.heading, textDecoration: 'underline', textUnderlineOffset: 2 }}
                        >
                          {f.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </details>
        </div>
      )}

      {/* ── Logística: Acceso / Horario / Notas (solo filas con datos) ── */}
      {infoRows.length > 0 && (
        <div style={{ borderTop: `1px solid ${tokens.divider}` }}>
          {access && (
            <div
              style={{
                display: 'flex',
                gap: 11,
                padding: '13px 22px',
                borderBottom: infoRows[infoRows.length - 1] !== 'access' ? `1px solid ${tokens.divider}` : undefined,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={tokens.spoilerAccent}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flex: 'none', marginTop: 1 }}
                aria-hidden="true"
              >
                <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <div>
                <div
                  style={{
                    fontFamily: fontSans,
                    fontSize: 11,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: tokens.spoilerAccent,
                    fontWeight: 700,
                    marginBottom: 2,
                  }}
                >
                  Acceso
                </div>
                <div style={{ fontFamily: fontSans, fontSize: 13.5, color: '#42475a', lineHeight: 1.5 }}>{access}</div>
              </div>
            </div>
          )}

          {hours && (
            <div
              style={{
                display: 'flex',
                gap: 11,
                padding: '13px 22px',
                borderBottom: infoRows[infoRows.length - 1] !== 'hours' ? `1px solid ${tokens.divider}` : undefined,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={tokens.spoilerAccent}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flex: 'none', marginTop: 1 }}
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              <div>
                <div
                  style={{
                    fontFamily: fontSans,
                    fontSize: 11,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: tokens.spoilerAccent,
                    fontWeight: 700,
                    marginBottom: 2,
                  }}
                >
                  Horario
                </div>
                <div style={{ fontFamily: fontSans, fontSize: 13.5, color: '#42475a', lineHeight: 1.5 }}>{hours}</div>
              </div>
            </div>
          )}

          {logistics && logistics.length > 0 && (
            <div style={{ padding: '13px 22px 17px' }}>
              <div
                style={{
                  fontFamily: fontSans,
                  fontSize: 11,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: tokens.spoilerAccent,
                  fontWeight: 700,
                  marginBottom: 7,
                }}
              >
                Notas
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {logistics.map((nota, i) => (
                  <li
                    key={i}
                    style={{ display: 'flex', gap: 9, fontFamily: fontSans, fontSize: 13.5, color: '#42475a', lineHeight: 1.45 }}
                  >
                    <span
                      style={{ flex: 'none', width: 5, height: 5, borderRadius: '50%', background: tokens.noteDot, marginTop: 6 }}
                      aria-hidden="true"
                    />
                    {nota}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
