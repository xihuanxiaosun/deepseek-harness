import type { SidebarBrandMarkOwnerProps } from '@deepseek-ai/dsh-client-ui-sidebar/client'

/**
 * DayDayUp mark: a clay rounded tile carrying a white rising-sun glyph —
 * warm, quiet, and legible at both the expanded brand row and the 16px
 * collapsed rail. Pure inline SVG; no font or binary asset.
 * @param props - Host-supplied mark presentation.
 * @returns the DayDayUp mark.
 */
export function DayDayUpBrandMark({ size }: SidebarBrandMarkOwnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label="DayDayUp"
      style={{ display: 'block', borderRadius: Math.max(6, size * 0.28) }}
    >
      <rect width="32" height="32" rx="9" fill="var(--dsw-alias-brand-primary, #d97757)" />
      {/* Rising sun: half disc on the horizon with rays. */}
      <g fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
        <path d="M9 20a7 7 0 0 1 14 0" />
        <path d="M16 8.5v3" />
        <path d="M8.5 13.5l2 2" />
        <path d="M23.5 13.5l-2 2" />
      </g>
      <path d="M8 24h16" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
    </svg>
  )
}

/**
 * DayDayUp name wordmark: set in the system stack, medium weight, with the
 * DSH suffix stepped down to tertiary — no binary font asset.
 * @returns the DayDayUp DSH wordmark.
 */
export function DayDayUpBrandName() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 5,
        whiteSpace: 'nowrap',
        userSelect: 'none',
        fontFamily: 'inherit',
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--dsw-alias-label-primary)' }}>
        DayDayUp
      </span>
      <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', color: 'var(--dsw-alias-label-tertiary)' }}>
        DSH
      </span>
    </span>
  )
}
