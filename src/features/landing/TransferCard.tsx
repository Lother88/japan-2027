import type { Transfer } from '@/data/types'
import type { ThemeTokens } from '@/features/landing/theme'
import { fontSerif, fontSans } from '@/features/landing/theme'

interface Props {
  transfer: Transfer
  tokens: ThemeTokens
}

function TrainIcon({ stroke }: { stroke: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="6" y="3" width="12" height="14" rx="3" />
      <path d="M6 11h12M9 21l-2 2m10-2l2 2" />
      <circle cx="9" cy="14" r="1" />
      <circle cx="15" cy="14" r="1" />
    </svg>
  )
}

function BusIcon({ stroke }: { stroke: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 13h18l-2-5a3 3 0 0 0-3-2H8a3 3 0 0 0-3 2z" />
      <path d="M3 13v4h18v-4M7 21l1-2m9 2l-1-2" />
      <circle cx="7.5" cy="17" r="1" />
      <circle cx="16.5" cy="17" r="1" />
    </svg>
  )
}

export default function TransferCard({ transfer, tokens }: Props) {
  const isBus = transfer.mode === 'bus'

  return (
    <div
      style={{
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start',
        background: tokens.transferBg,
        color: tokens.transferText,
        borderRadius: 14,
        padding: '18px 20px',
      }}
    >
      {/* Mode icon */}
      <div
        style={{
          flex: 'none',
          width: 38,
          height: 38,
          borderRadius: 9,
          background: tokens.transferIconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-hidden="true"
      >
        {isBus ? (
          <BusIcon stroke={tokens.transferIconStroke} />
        ) : (
          <TrainIcon stroke={tokens.transferIconStroke} />
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Eyebrow + duration chip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontFamily: fontSans,
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: tokens.transferEyebrow,
              fontWeight: 700,
            }}
          >
            Trayecto · {transfer.mode}
          </span>
          {transfer.duration && (
            <span
              style={{
                fontFamily: fontSans,
                fontSize: 11,
                color: tokens.transferMuted,
                background: 'rgba(255,255,255,.08)',
                padding: '2px 9px',
                borderRadius: 20,
              }}
            >
              {transfer.duration}
            </span>
          )}
        </div>

        {/* Route title */}
        <div
          style={{
            fontFamily: fontSerif,
            fontSize: 18,
            fontWeight: 600,
            marginTop: 5,
            color: tokens.transferText,
          }}
        >
          {transfer.from} → {transfer.to}
        </div>

        {/* Line subtitle */}
        {transfer.line && (
          <div
            style={{
              fontFamily: fontSans,
              fontSize: 13,
              color: tokens.transferMuted,
              marginTop: 3,
            }}
          >
            {transfer.line}
          </div>
        )}

        {/* Notes */}
        {transfer.notes && transfer.notes.length > 0 && (
          <ul
            style={{
              margin: '11px 0 0',
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
            }}
          >
            {transfer.notes.map((nota, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  gap: 8,
                  fontFamily: fontSans,
                  fontSize: 13,
                  color: tokens.transferText,
                }}
              >
                <span
                  style={{ color: tokens.transferIconStroke }}
                  aria-hidden="true"
                >
                  ·
                </span>
                {nota}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
