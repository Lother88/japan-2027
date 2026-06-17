import type { TimeSlot } from '@/data/types'
import type { ThemeTokens } from '@/features/landing/theme'
import { getZone } from '@/data'
import { fontSans } from '@/features/landing/theme'
import ZoneCard from '@/features/landing/ZoneCard'

interface Props {
  slot: TimeSlot
  tokens: ThemeTokens
}

const SLOT_LABELS: Record<string, string> = {
  morning: 'Mañana',
  afternoon: 'Tarde',
}

export default function SlotBlock({ slot, tokens }: Props) {
  const label = SLOT_LABELS[slot.key] ?? slot.label
  const dot =
    slot.key === 'morning' ? tokens.morningDot : tokens.afternoonDot

  const resolvedZones = slot.zones
    .map(ref => getZone(ref.zoneId))
    .filter((z): z is NonNullable<typeof z> => z !== undefined)

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {/* Vertical label rail */}
      <div
        style={{
          flex: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 9,
          paddingTop: 3,
        }}
        aria-hidden="true"
      >
        <span
          style={{
            flex: 'none',
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: dot,
          }}
        />
        <span
          style={{
            fontFamily: fontSans,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: dot,
            writingMode: 'vertical-rl',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
        <span
          style={{
            flex: 1,
            width: 2,
            borderRadius: 2,
            background: dot,
            opacity: 0.24,
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {/* Summary card */}
        <div
          style={{
            background: '#fffdf9',
            border: '1px solid #ece2d2',
            borderRadius: 14,
            padding: '20px 22px',
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: fontSans,
              fontSize: 15,
              lineHeight: 1.65,
              color: '#42475a',
            }}
          >
            {slot.summary}
          </p>
        </div>

        {/* Zone cards */}
        {resolvedZones.map(zone => (
          <ZoneCard key={zone.id} zone={zone} tokens={tokens} />
        ))}
      </div>
    </div>
  )
}
