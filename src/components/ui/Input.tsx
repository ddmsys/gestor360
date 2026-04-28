'use client'

import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-text-title)]"
          >
            {label}
            {props.required && <span className="text-brand-gold ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            'w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4',
            'text-base text-[var(--color-text-title)] placeholder:text-[var(--color-text-muted)]',
            'transition-colors duration-[var(--transition-fast)]',
            'focus:outline-none focus:border-brand-blue focus:ring-[var(--focus-ring)]',
            'disabled:opacity-50 disabled:bg-[var(--color-bg-canvas)]',
            'min-h-[var(--touch-target-min)]',
            error ? 'border-error focus:border-error' : '',
            className,
          ].join(' ')}
          {...props}
        />
        {error && (
          <p className="text-xs text-error" role="alert">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
