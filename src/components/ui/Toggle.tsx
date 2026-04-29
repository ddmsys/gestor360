"use client";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  hint?: string;
  disabled?: boolean;
  id?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  hint,
  disabled,
  id,
}: ToggleProps) {
  const toggleId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex items-start gap-3">
      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked ? "true" : "false"}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={[
          "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent",
          "transition-colors duration-200 cursor-pointer",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          checked ? "bg-brand-blue" : "bg-[var(--color-border)]",
        ].join(" ")}
      >
        <span
          aria-hidden="true"
          className={[
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition duration-200",
            checked ? "translate-x-5" : "translate-x-0",
          ].join(" ")}
        />
      </button>
      {(label || hint) && (
        <div className="flex flex-col gap-0.5">
          {label && (
            <label
              htmlFor={toggleId}
              className="text-sm font-medium text-[var(--color-text-title)] cursor-pointer"
            >
              {label}
            </label>
          )}
          {hint && (
            <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>
          )}
        </div>
      )}
    </div>
  );
}
