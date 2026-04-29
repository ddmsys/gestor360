'use client'

import type { FormContent, FormField, SectionContent } from '@/types/cms'
import {
  FieldGroup,
  TextInput,
  SegmentControl,
  ToggleField,
  EditorSection,
  EditorDivider,
  type ContentEditorProps,
} from './SectionContentEditor'

const FIELD_TYPES = [
  { label: 'Texto', value: 'text' },
  { label: 'E-mail', value: 'email' },
  { label: 'Tel.', value: 'tel' },
  { label: 'Área', value: 'textarea' },
]

export function FormContentEditor({ content, onChange }: ContentEditorProps) {
  const c = content as FormContent
  const fields = c.fields ?? []

  function set<K extends keyof FormContent>(key: K, value: FormContent[K]) {
    onChange({ ...c, [key]: value } as SectionContent)
  }

  function updateField(idx: number, updated: Partial<FormField>) {
    const next = fields.map((f, i) => (i === idx ? { ...f, ...updated } : f))
    set('fields', next)
  }

  function addField() {
    const key = `campo_${fields.length + 1}`
    set('fields', [
      ...fields,
      { field_key: key, label: 'Novo campo', type: 'text', required: false },
    ])
  }

  function removeField(idx: number) {
    set('fields', fields.filter((_, i) => i !== idx))
  }

  return (
    <div>
      <EditorSection>
        <FieldGroup label="Título">
          <TextInput
            value={c.title ?? ''}
            onChange={(v) => set('title', v)}
            placeholder="Acesse as ferramentas gratuitamente"
          />
        </FieldGroup>

        <FieldGroup label="Subtítulo">
          <TextInput
            value={c.subtitle ?? ''}
            onChange={(v) => set('subtitle', v)}
            placeholder="Subtítulo opcional"
          />
        </FieldGroup>

        <FieldGroup label="Texto do botão">
          <TextInput
            value={c.submit_label ?? ''}
            onChange={(v) => set('submit_label', v)}
            placeholder="Quero as ferramentas"
          />
        </FieldGroup>
      </EditorSection>

      <EditorDivider />

      <EditorSection>
        <FieldGroup label="Fundo">
          <SegmentControl
            options={[
              { label: 'Azul', value: 'blue' },
              { label: 'Branco', value: 'white' },
              { label: 'Canvas', value: 'canvas' },
            ]}
            value={c.bg ?? 'blue'}
            onChange={(v) => set('bg', v as FormContent['bg'])}
          />
        </FieldGroup>

        <FieldGroup label="Layout">
          <SegmentControl
            options={[
              { label: 'Centralizado', value: 'centered' },
              { label: '2 colunas', value: 'side-by-side' },
            ]}
            value={c.layout ?? 'centered'}
            onChange={(v) => set('layout', v as FormContent['layout'])}
          />
        </FieldGroup>

        <FieldGroup label="URL de redirecionamento">
          <TextInput
            value={c.redirect_url ?? ''}
            onChange={(v) => set('redirect_url', v)}
            placeholder="/obrigado"
          />
        </FieldGroup>
      </EditorSection>

      <EditorDivider />

      {/* Campos do formulário */}
      <div className="px-4 pb-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            Campos ({fields.length})
          </span>
          <button
            onClick={addField}
            className="text-xs font-semibold text-[var(--color-brand-blue)] hover:underline"
          >
            + Adicionar
          </button>
        </div>

        {fields.map((field, idx) => (
          <div
            key={idx}
            className="border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden"
          >
            <div className="flex items-center justify-between px-3 py-2 bg-[var(--color-bg-canvas)]">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xs font-semibold text-[var(--color-text-body)] truncate">
                  {field.label || `Campo ${idx + 1}`}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-[var(--color-border)] text-[var(--color-text-muted)] font-mono shrink-0">
                  {field.type}
                </span>
              </div>
              <button
                onClick={() => removeField(idx)}
                aria-label="Remover campo"
                className="w-5 h-5 flex items-center justify-center text-red-400 hover:text-red-600"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-3 space-y-2">
              <TextInput
                value={field.label}
                onChange={(v) => updateField(idx, { label: v })}
                placeholder="Label do campo"
              />
              <TextInput
                value={field.field_key}
                onChange={(v) => updateField(idx, { field_key: v.toLowerCase().replace(/\s+/g, '_') })}
                placeholder="field_key"
              />
              <SegmentControl
                options={FIELD_TYPES}
                value={field.type}
                onChange={(v) => updateField(idx, { type: v as FormField['type'] })}
              />
              <ToggleField
                label="Obrigatório"
                value={field.required ?? false}
                onChange={(v) => updateField(idx, { required: v })}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
