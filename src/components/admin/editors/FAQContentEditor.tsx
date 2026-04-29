'use client'

import type { FAQContent, FAQItem, SectionContent } from '@/types/cms'
import {
  FieldGroup,
  TextInput,
  SegmentControl,
  ToggleField,
  EditorSection,
  EditorDivider,
  type ContentEditorProps,
} from './SectionContentEditor'

export function FAQContentEditor({ content, onChange }: ContentEditorProps) {
  const c = content as FAQContent
  const items = c.items ?? []

  function set<K extends keyof FAQContent>(key: K, value: FAQContent[K]) {
    onChange({ ...c, [key]: value } as SectionContent)
  }

  function updateItem(idx: number, updated: Partial<FAQItem>) {
    const next = items.map((item, i) => (i === idx ? { ...item, ...updated } : item))
    set('items', next)
  }

  function addItem() {
    set('items', [...items, { question: 'Nova pergunta?', answer: 'Resposta aqui.' }])
  }

  function removeItem(idx: number) {
    set('items', items.filter((_, i) => i !== idx))
  }

  return (
    <div>
      <EditorSection>
        <FieldGroup label="Título da seção">
          <TextInput
            value={c.title ?? ''}
            onChange={(v) => set('title', v)}
            placeholder="Perguntas frequentes"
          />
        </FieldGroup>

        <FieldGroup label="Fundo">
          <SegmentControl
            options={[
              { label: 'Canvas', value: 'canvas' },
              { label: 'Branco', value: 'white' },
            ]}
            value={c.bg ?? 'canvas'}
            onChange={(v) => set('bg', v as FAQContent['bg'])}
          />
        </FieldGroup>

        <FieldGroup label="Layout">
          <SegmentControl
            options={[
              { label: '1 coluna', value: 'single' },
              { label: '2 colunas', value: 'two-columns' },
            ]}
            value={c.layout ?? 'single'}
            onChange={(v) => set('layout', v as FAQContent['layout'])}
          />
        </FieldGroup>
      </EditorSection>

      <EditorDivider />

      {/* Lista de itens */}
      <div className="px-4 pb-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            Perguntas ({items.length})
          </span>
          <button
            onClick={addItem}
            className="text-xs font-semibold text-[var(--color-brand-blue)] hover:underline"
          >
            + Adicionar
          </button>
        </div>

        {items.map((item, idx) => (
          <div
            key={idx}
            className="border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden"
          >
            <div className="flex items-center justify-between px-3 py-2 bg-[var(--color-bg-canvas)]">
              <span className="text-xs font-semibold text-[var(--color-text-body)] truncate flex-1">
                {item.question || `Pergunta ${idx + 1}`}
              </span>
              <button
                onClick={() => removeItem(idx)}
                aria-label="Remover pergunta"
                className="w-5 h-5 flex items-center justify-center text-red-400 hover:text-red-600"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-3 space-y-2">
              <TextInput
                value={item.question}
                onChange={(v) => updateItem(idx, { question: v })}
                placeholder="Pergunta"
              />
              <TextInput
                value={item.answer}
                onChange={(v) => updateItem(idx, { answer: v })}
                placeholder="Resposta"
                multiline
                rows={3}
              />
              <ToggleField
                label="Aberto por padrão"
                value={item.open_by_default ?? false}
                onChange={(v) => updateItem(idx, { open_by_default: v })}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
