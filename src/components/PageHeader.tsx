/**
 * PageHeader — editorial header for pages (day, zone)
 *
 * Uses display font (Zen Old Mincho) for the editorial Japanese look.
 * Subtitle and metadata are optional.
 * Responds to light/dark theme via semantic tokens.
 */

interface PageHeaderProps {
  title: string
  subtitle?: string
  meta?: string
  className?: string
}

export function PageHeader({ title, subtitle, meta, className = '' }: PageHeaderProps) {
  return (
    <header
      className={[
        'w-full py-8 px-4 md:px-8',
        'border-b border-border',
        className,
      ].join(' ')}
    >
      {meta && (
        <p className="font-sans text-xs text-fg-subtle uppercase tracking-widest mb-2">
          {meta}
        </p>
      )}
      <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-fg leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="font-sans text-base text-fg-muted mt-2">
          {subtitle}
        </p>
      )}
    </header>
  )
}
