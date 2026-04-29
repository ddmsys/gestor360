'use client'

import type { ComponentType } from 'react'
import type { PageSection, SectionType, SectionContent } from '@/types/cms'
import { HeroContentEditor } from './HeroContentEditor'
import { CardsContentEditor } from './CardsContentEditor'
import { FormContentEditor } from './FormContentEditor'
import { CTAContentEditor } from './CTAContentEditor'
import { TextContentEditor } from './TextContentEditor'
import { FAQContentEditor } from './FAQContentEditor'
import { GenericContentEditor } from './GenericContentEditor'

export interface ContentEditorProps {
  content: SectionContent
  onChange: (updated: SectionContent) => void
}

const EDITORS: Partial<Record<SectionType, ComponentType<ContentEditorProps>>> = {
  hero: HeroContentEditor,
  cards: CardsContentEditor,
  form: FormContentEditor,
  cta: CTAContentEditor,
  text: TextContentEditor,
  faq: FAQContentEditor,
}

interface SectionContentEditorProps {
  section: PageSection
  onChange: (content: SectionContent) => void
}

export function SectionContentEditor({ section, onChange }: SectionContentEditorProps) {
  const Editor = EDITORS[section.type] ?? GenericContentEditor
  return <Editor content={section.content} onChange={onChange} />
}

// ─── Primitivos de UI compartilhados ─────────────────────────────────────

export function FieldGroup({
  label,
  children,
  hint,
}: {
  label: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-[10px] text-[var(--color-text-muted)]/70">{hint}</p>
      )}
    </div>
  )
}

export function TextInput({
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 3,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  multiline?: boolean
  rows?: number
}) {
  const cls =
    'w-full text-sm text-[var(--color-text-title)] placeholder:text-[var(--color-text-muted)]/50 bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]/30 focus:border-[var(--color-brand-blue)] transition-colors'

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`${cls} resize-none`}
      />
    )
  }
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cls}
    />
  )
}

export function SegmentControl({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex gap-0.5 p-0.5 bg-[var(--color-bg-canvas)] rounded-[var(--radius-md)] border border-[var(--color-border)]">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-[5px] transition-all ${
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

export function ToggleField({
  label,
  value,
  onChange,
  description,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
  description?: string
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[var(--color-text-body)]">{label}</p>
        {description && (
          <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{description}</p>
        )}
      </div>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`shrink-0 w-9 h-5 rounded-full transition-colors relative ${
          value ? 'bg-[var(--color-brand-blue)]' : 'bg-[var(--color-border)]'
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            value ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}

export function EditorSection({ children }: { children: React.ReactNode }) {
  return <div className="p-4 space-y-4">{children}</div>
}

export function EditorDivider() {
  return <div className="border-t border-[var(--color-border)]" />
}
