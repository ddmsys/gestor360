'use client'

import type { DepoimentosContent, DepoimentoItem, SectionContent } from '@/types/cms'
import {
  FieldGroup, TextInput, SegmentControl, ToggleField,
  EditorSection, EditorDivider, type ContentEditorProps,
} from './SectionContentEditor'

export function DepoimentosContentEditor({ content, onChange }: ContentEditorProps) {
  const c = content as DepoimentosContent
  const items = c.items ?? []

  function set<K extends keyof DepoimentosContent>(key: K, value: DepoimentosContent[K]) {
    onChange({ ...c, [key]: value } as SectionContent)
  }

  function updateItem(idx: number, updated: Partial<DepoimentoItem>) {
    const next = items.map((item, i) => (i === idx ? { ...item, ...updated } : item))
    set('items', next)
  }

  function addItem() {
    set('items', [...items, { nome: 'Nome', texto: 'Depoimento aqui.' }])
  }

  function removeItem(idx: number) {
    set('items', items.filter((_, i) => i !== idx))
  }

  const isManual = (c.source ?? 'manual') === 'manual'

  return (
    <div>
      <EditorSection>
        <FieldGroup label="Título da seção">
          <TextInput value={c.title ?? ''} onChange={(v) => set('title', v)} placeholder="O que dizem sobre o método" />
        </FieldGroup>
        <FieldGroup label="Subtítulo">
          <TextInput value={c.subtitle ?? ''} onChange={(v) => set('subtitle', v)} placeholder="Subtítulo opcional" />
        </FieldGroup>
      </EditorSection>

      <EditorDivider />

      <EditorSection>
        <FieldGroup label="Fonte dos depoimentos">
          <SegmentControl
            options={[
              { label: 'Manual', value: 'manual' },
              { label: 'Supabase', value: 'supabase' },
            ]}
            value={c.source ?? 'manual'}
            onChange={(v) => set('source', v as DepoimentosContent['source'])}
          />
        </FieldGroup>

        <FieldGroup label="Layout">
          <SegmentControl
            options={[
              { label: 'Grid', value: 'grid' },
              { label: 'Carrossel', value: 'carousel' },
              { label: 'Mosaico', value: 'masonry' },
            ]}
            value={c.layout ?? 'grid'}
            onChange={(v) => set('layout', v as DepoimentosContent['layout'])}
          />
        </FieldGroup>

        <FieldGroup label="Colunas">
          <SegmentControl
            options={[{ label: '2 col.', value: '2' }, { label: '3 col.', value: '3' }]}
            value={String(c.columns ?? 3)}
            onChange={(v) => set('columns', Number(v) as DepoimentosContent['columns'])}
          />
        </FieldGroup>

        <FieldGroup label="Fundo">
          <SegmentControl
            options={[
              { label: 'Branco', value: 'white' },
              { label: 'Canvas', value: 'canvas' },
              { label: 'Dark', value: 'ink' },
            ]}
            value={c.bg ?? 'white'}
            onChange={(v) => set('bg', v as DepoimentosContent['bg'])}
          />
        </FieldGroup>

        {!isManual && (
          <FieldGroup label="Limite de exibição">
            <SegmentControl
              options={[
                { label: '3', value: '3' },
                { label: '6', value: '6' },
                { label: '9', value: '9' },
                { label: 'Todos', value: '0' },
              ]}
              value={String(c.limit ?? 6)}
              onChange={(v) => set('limit', Number(v) || undefined)}
            />
          </FieldGroup>
        )}
      </EditorSection>

      {isManual && (
        <>
          <EditorDivider />

          <div className="px-4 pb-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Depoimentos ({items.length})
              </span>
              <button
                type="button"
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
                    {item.nome || `Depoimento ${idx + 1}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    aria-label="Remover depoimento"
                    className="w-5 h-5 flex items-center justify-center text-red-400 hover:text-red-600"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-3 space-y-2">
                  <TextInput
                    value={item.nome}
                    onChange={(v) => updateItem(idx, { nome: v })}
                    placeholder="Nome completo"
                  />
                  <TextInput
                    value={item.cargo ?? ''}
                    onChange={(v) => updateItem(idx, { cargo: v || undefined })}
                    placeholder="Cargo (ex: CEO, Gerente)"
                  />
                  <TextInput
                    value={item.empresa ?? ''}
                    onChange={(v) => updateItem(idx, { empresa: v || undefined })}
                    placeholder="Empresa"
                  />
                  <TextInput
                    value={item.texto}
                    onChange={(v) => updateItem(idx, { texto: v })}
                    placeholder="Texto do depoimento"
                    multiline
                    rows={3}
                  />
                  <TextInput
                    value={item.foto_url ?? ''}
                    onChange={(v) => updateItem(idx, { foto_url: v || undefined })}
                    placeholder="URL da foto (opcional)"
                  />
                  <FieldGroup label="Nota (estrelas)">
                    <SegmentControl
                      options={[
                        { label: '—', value: '0' },
                        { label: '3★', value: '3' },
                        { label: '4★', value: '4' },
                        { label: '5★', value: '5' },
                      ]}
                      value={String(item.nota ?? 0)}
                      onChange={(v) => updateItem(idx, { nota: Number(v) > 0 ? (Number(v) as 3 | 4 | 5) : undefined })}
                    />
                  </FieldGroup>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <EditorDivider />

      <EditorSection>
        <ToggleField
          label="Aprovar automaticamente"
          value={false}
          onChange={() => {}}
          description="Depoimentos do Supabase são aprovados no painel /admin/depoimentos"
        />
      </EditorSection>
    </div>
  )
}
