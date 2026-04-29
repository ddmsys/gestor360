'use client'

import { useState } from 'react'
import type { SectionContent } from '@/types/cms'
import type { ContentEditorProps } from './SectionContentEditor'

export function GenericContentEditor({ content, onChange }: ContentEditorProps) {
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [raw, setRaw] = useState(() => JSON.stringify(content, null, 2))

  function handleChange(value: string) {
    setRaw(value)
    try {
      const parsed = JSON.parse(value)
      onChange(parsed as SectionContent)
      setJsonError(null)
    } catch {
      setJsonError('JSON inválido')
    }
  }

  return (
    <div className="p-4 space-y-3">
      <p className="text-xs text-[var(--color-text-muted)]">
        Editor genérico — edite o JSON do conteúdo diretamente.
      </p>
      <textarea
        value={raw}
        onChange={(e) => handleChange(e.target.value)}
        rows={16}
        className="w-full text-xs font-mono text-[var(--color-text-title)] bg-[var(--color-bg-canvas)] border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]/30 focus:border-[var(--color-brand-blue)] resize-none"
        spellCheck={false}
        aria-label="Conteúdo JSON da seção"
      />
      {jsonError && (
        <p className="text-xs text-red-500">{jsonError}</p>
      )}
    </div>
  )
}
