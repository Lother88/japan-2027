/**
 * Card — base content card with Japanese paper aesthetic
 *
 * Tokens: semantic bg/border/text — responds to light/dark theme
 * React Compiler active — no manual memo/callback
 */

import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className = '', onClick }: CardProps) {
  const base =
    'bg-bg border border-border rounded-[var(--radius-card)] shadow-sm transition-shadow'
  const interactive = onClick
    ? 'cursor-pointer hover:shadow-md hover:border-fg-muted'
    : ''

  return (
    <div
      className={`${base} ${interactive} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick() } : undefined}
    >
      {children}
    </div>
  )
}
