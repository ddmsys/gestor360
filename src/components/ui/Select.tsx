"use client";

import { type SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, hint, options, placeholder, className = "", id, ...props },
    ref,
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-text-title)]"
          >
            {label}
            {props.required && (
              <span className="text-brand-gold ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            className={[
              "w-full appearance-none rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 pr-10",
              "text-base text-[var(--color-text-title)]",
              "transition-colors duration-[var(--transition-fast)]",
              "focus:outline-none focus:border-brand-blue focus:ring-[var(--focus-ring)]",
              "disabled:opacity-50 disabled:bg-[var(--color-bg-canvas)]",
              "min-h-[var(--touch-target-min)]",
              error ? "border-error" : "",
              className,
            ].join(" ")}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* Chevron */}
          <div
            className="pointer-events-none absolute inset-y-0 right-3 flex items-center"
            aria-hidden="true"
          >
            <svg
              className="w-4 h-4 text-[var(--color-text-muted)]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {error && (
          <p className="text-xs text-error" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
