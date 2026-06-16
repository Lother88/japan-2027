/**
 * Button — base button with Japanese aesthetic variants
 *
 * Variants:
 *   primary   — urushi accent (torii red), for main CTAs
 *   secondary — sumi outline, for secondary actions
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
    'bg-transparent text-sumi-900 border border-sumi-700 hover:bg-washi-100 active:bg-washi-200',
  ghost:
    'bg-transparent text-sumi-700 border border-transparent hover:text-sumi-900 hover:bg-washi-100',
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
