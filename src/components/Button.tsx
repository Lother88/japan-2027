/**
 * Button — base button with Japanese aesthetic variants
 *
 * Variants:
 *   primary   — urushi accent (torii red), for main CTAs
 *   secondary — border + fg text, for secondary actions
 *   ghost     — no background, subtle hover
 *
 * Satisfies UX-03: touch targets ≥ 44×44px via min-h / min-w / padding
 * Satisfies UX-05: aria-label passed through for icon-only buttons
 */

import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-urushi-600 text-washi-50 hover:bg-urushi-400 active:bg-urushi-600 border border-transparent',
  secondary:
    'bg-transparent text-fg border border-fg-muted hover:bg-surface active:bg-border',
  ghost:
    'bg-transparent text-fg-muted border border-transparent hover:text-fg hover:bg-surface',
}

export function Button({
  variant = 'secondary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={[
        'inline-flex items-center justify-center gap-2',
        'font-sans text-sm font-medium',
        'min-h-[44px] min-w-[44px] px-4 py-2',
        'rounded-[var(--radius-card)]',
        'transition-colors cursor-pointer',
        'focus-visible:outline-2 focus-visible:outline-urushi-600 focus-visible:outline-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        className,
      ].join(' ')}
    >
      {children}
    </button>
  )
}
