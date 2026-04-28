'use client'

import { type ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-blue text-white hover:bg-[var(--color-brand-blue-hover)] active:bg-[var(--color-brand-blue-active)] shadow-[var(--shadow-blue)]',
  secondary:
    'bg-transparent text-brand-blue border border-brand-blue hover:bg-[var(--color-brand-blue-subtle)]',
  ghost:
    'bg-transparent text-[var(--color-text-body)] hover:bg-[var(--color-brand-blue-subtle)]',
}

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-base',
  lg: 'h-14 px-8 text-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          'inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-semibold',
          'transition-colors duration-[var(--transition-fast)] cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-[var(--focus-ring-offset)]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'min-h-[var(--touch-target-min)]',
          variants[variant],
          sizes[size],
          className,
        ].join(' ')}
        {...props}
      >
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
