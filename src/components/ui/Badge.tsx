type BadgeVariant = 'blue' | 'gold' | 'stone' | 'success' | 'error'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  blue:    'bg-[var(--color-brand-blue-subtle)] text-brand-blue',
  gold:    'bg-[var(--color-brand-gold-subtle)] text-[var(--color-brand-gold-hover)]',
  stone:   'bg-[var(--color-bg-canvas)] text-[var(--color-stone-accessible)]',
  success: 'bg-success/10 text-success',
  error:   'bg-error/10 text-error',
}

export function Badge({ variant = 'blue', children, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-[var(--radius-full)] px-3 py-1',
        'text-xs font-semibold tracking-[var(--tracking-wide)] uppercase',
        variants[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
