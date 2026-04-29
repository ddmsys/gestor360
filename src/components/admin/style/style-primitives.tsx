'use client'

// ─── Primitivos reutilizáveis nos tabs do StyleEditor ─────────────────────

import type { ReactNode } from 'react'

// ─── Layout ───────────────────────────────────────────────────────────────

export function StyleSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="px-4 py-3 border-b border-[var(--color-border)] last:border-b-0">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2.5">
        {title}
      </p>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}

export function StyleRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 min-h-[28px]">
      <span className="text-xs text-[var(--color-text-body)] shrink-0">{label}</span>
      <div className="flex items-center gap-1.5">{children}</div>
    </div>
  )
}

// ─── Toggle ───────────────────────────────────────────────────────────────

export function StyleToggle({
  value,
  onChange,
}: {
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none ${
        value ? 'bg-[var(--color-brand-blue)]' : 'bg-[var(--color-border)]'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-transform ${
          value ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

// ─── Segment control ──────────────────────────────────────────────────────

export function StyleSegment<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T | undefined
  onChange: (v: T) => void
}) {
  return (
    <div className="flex items-center gap-0.5 p-0.5 rounded-[var(--radius-sm)] bg-[var(--color-bg-canvas)] border border-[var(--color-border)]">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-2 py-0.5 rounded-[3px] text-[10px] font-semibold transition-all ${
            value === opt.value
              ? 'bg-white text-[var(--color-text-title)] shadow-[var(--shadow-sm)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ─── Slider ───────────────────────────────────────────────────────────────

export function StyleSlider({
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
}: {
  value: number | undefined
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (v: number) => void
}) {
  const current = value ?? min
  return (
    <div className="flex items-center gap-2 w-full">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1.5 appearance-none bg-[var(--color-border)] rounded-full accent-[var(--color-brand-blue)] cursor-pointer"
      />
      <span className="text-[10px] font-mono text-[var(--color-text-muted)] w-8 text-right shrink-0">
        {current}{unit}
      </span>
    </div>
  )
}

// ─── Color swatch ─────────────────────────────────────────────────────────

export function ColorSwatch({
  color,
  selected,
  title,
  onClick,
}: {
  color: string
  selected: boolean
  title: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`w-6 h-6 rounded-full border-2 transition-all ${
        selected
          ? 'border-[var(--color-brand-blue)] scale-110 shadow-[var(--shadow-sm)]'
          : 'border-transparent hover:scale-105 hover:border-[var(--color-border)]'
      }`}
      style={{ background: color }}
    />
  )
}

// ─── Hex input ────────────────────────────────────────────────────────────

export function HexInput({
  value,
  placeholder,
  onChange,
}: {
  value: string | undefined
  placeholder?: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      {/* Preview da cor */}
      <div
        className="w-5 h-5 rounded border border-[var(--color-border)] shrink-0"
        style={{ background: value && /^#[0-9a-fA-F]{3,6}$/.test(value) ? value : 'transparent' }}
      />
      <input
        type="text"
        value={value ?? ''}
        placeholder={placeholder ?? '#RRGGBB'}
        maxLength={7}
        onChange={(e) => onChange(e.target.value)}
        className="w-24 px-2 py-1 text-[11px] font-mono rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white focus:outline-none focus:border-[var(--color-brand-blue)]"
      />
    </div>
  )
}

// ─── Clear button ─────────────────────────────────────────────────────────

export function ClearButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[10px] text-[var(--color-text-muted)] hover:text-red-500 transition-colors font-medium"
    >
      Limpar
    </button>
  )
}

// ─── WCAG contrast badge ──────────────────────────────────────────────────

function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const toLinear = (c: number) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

export function contrastRatio(fg: string, bg: string): number {
  try {
    const l1 = relativeLuminance(fg)
    const l2 = relativeLuminance(bg)
    const lighter = Math.max(l1, l2)
    const darker  = Math.min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)
  } catch {
    return 1
  }
}

export function WCAGBadge({ fg, bg }: { fg: string; bg: string }) {
  if (!fg || !bg) return null
  if (!/^#[0-9a-fA-F]{6}$/.test(fg) || !/^#[0-9a-fA-F]{6}$/.test(bg)) return null

  const ratio = contrastRatio(fg, bg)
  const aa    = ratio >= 4.5
  const aaa   = ratio >= 7

  return (
    <div className="flex items-center gap-1 mt-1">
      <span className="text-[9px] font-mono text-[var(--color-text-muted)]">
        {ratio.toFixed(1)}:1
      </span>
      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${aaa ? 'bg-green-100 text-green-700' : aa ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'}`}>
        {aaa ? 'AAA' : aa ? 'AA' : 'Falha'}
      </span>
    </div>
  )
}
