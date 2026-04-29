"use client";

import { type TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-(--color-text-title)"
          >
            {label}
            {props.required && (
              <span className="text-brand-gold ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={4}
          className={[
            "w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3",
            "text-base text-[var(--color-text-title)] placeholder:text-[var(--color-text-muted)]",
            "transition-colors duration-[var(--transition-fast)] resize-y",
            "focus:outline-none focus:border-brand-blue focus:ring-[var(--focus-ring)]",
            "disabled:opacity-50 disabled:bg-[var(--color-bg-canvas)]",
            error ? "border-error focus:border-error" : "",
            className,
          ].join(" ")}
          {...props}
        />
        {error && (
          <p className="text-xs text-error" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-(--color-text-muted)">{hint}</p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
