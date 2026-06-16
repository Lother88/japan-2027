/**
 * Tag — small label chip for zone categories/types
 *
 * Uses matcha accent for a subtle Japanese feel.
 * Responds to light/dark theme via semantic tokens.
 */

interface TagProps {
  label: string
  className?: string
}

export function Tag({ label, className = '' }: TagProps) {
  return (
    <span
      className={[
        'inline-flex items-center',
        'px-2 py-0.5',
        'text-xs font-medium font-sans',
        'bg-surface text-matcha-700 border border-matcha-500',
        'dark:text-matcha-500',
        'rounded-[var(--radius-paper)]',
        className,
      ].join(' ')}
    >
      {label}
    </span>
  )
}
