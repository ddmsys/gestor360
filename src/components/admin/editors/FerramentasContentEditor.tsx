'use client'

import type { FerramentasContent, SectionContent } from '@/types/cms'
import {
  FieldGroup, TextInput, SegmentControl, ToggleField,
  EditorSection, EditorDivider, type ContentEditorProps,
} from './SectionContentEditor'

const CAPITULO_OPTIONS = [
  { label: 'Todos', value: '0'  },
  { label: 'Cap. 1', value: '1' },
  { label: 'Cap. 2', value: '2' },
  { label: 'Cap. 3', value: '3' },
  { label: 'Cap. 4', value: '4' },
  { label: 'Cap. 5', value: '5' },
  { label: 'Cap. 6', value: '6' },
  { label: 'Cap. 7', value: '7' },
  { label: 'Cap. 8', value: '8' },
  { label: 'Cap. 9', value: '9' },
  { label: 'Cap. 10', value: '10'},
]

export function FerramentasContentEditor({ content, onChange }: ContentEditorProps) {
  const c = content as FerramentasContent

  function set<K extends keyof FerramentasContent>(key: K, value: FerramentasContent[K]) {
    onChange({ ...c, [key]: value } as SectionContent)
  }

  return (
    <div>
      <EditorSection>
        <FieldGroup label="Título da seção">
          <TextInput
            value={c.title ?? ''}
            onChange={(v) => set('title', v)}
            placeholder="Ferramentas do Método"
          />
        </FieldGroup>
        <FieldGroup label="Subtítulo">
          <TextInput
            value={c.subtitle ?? ''}
            onChange={(v) => set('subtitle', v)}
            placeholder="Subtítulo opcional"
          />
        </FieldGroup>
      </EditorSection>

      <EditorDivider />

      <EditorSection>
        <FieldGroup label="Filtro de capítulo">
          <div className="grid grid-cols-4 gap-0.5 p-0.5 bg-[var(--color-bg-canvas)] rounded-[var(--radius-md)] border border-[var(--color-border)]">
            {CAPITULO_OPTIONS.map((opt) => {
              const selected = String(c.capitulo_inicial ?? 0) === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('capitulo_inicial', Number(opt.value) || undefined)}
                  className={`py-1.5 text-[10px] font-semibold rounded-[4px] transition-all ${
                    selected
                      ? 'bg-white text-[var(--color-text-title)] shadow-[var(--shadow-sm)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]'
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </FieldGroup>

        <FieldGroup label="Layout">
          <SegmentControl
            options={[
              { label: 'Grid', value: 'grid' },
              { label: 'Lista', value: 'list' },
            ]}
            value={c.layout ?? 'grid'}
            onChange={(v) => set('layout', v as FerramentasContent['layout'])}
          />
        </FieldGroup>

        <ToggleField
          label="Mostrar todas as ferramentas"
          value={c.mostrar_todos ?? false}
          onChange={(v) => set('mostrar_todos', v)}
          description="Exibe as 31 ferramentas (inclui as exclusivas para leitores)"
        />
      </EditorSection>

      <EditorDivider />

      <EditorSection>
        <ToggleField
          label="CTA código do livro"
          value={c.mostrar_cta_codigo ?? false}
          onChange={(v) => set('mostrar_cta_codigo', v)}
          description="Exibe chamada para inserir o código do livro"
        />

        {c.mostrar_cta_codigo && (
          <>
            <FieldGroup label="Título do CTA">
              <TextInput
                value={c.cta_codigo_titulo ?? ''}
                onChange={(v) => set('cta_codigo_titulo', v)}
                placeholder="Desbloqueie todas as ferramentas"
              />
            </FieldGroup>
            <FieldGroup label="Descrição do CTA">
              <TextInput
                value={c.cta_codigo_descricao ?? ''}
                onChange={(v) => set('cta_codigo_descricao', v)}
                placeholder="Insira o código do seu livro e acesse as 31 ferramentas"
                multiline
                rows={2}
              />
            </FieldGroup>
          </>
        )}
      </EditorSection>

      <EditorDivider />

      <div className="px-4 py-3">
        <p className="text-[10px] text-[var(--color-text-muted)]/70">
          As ferramentas são gerenciadas em{' '}
          <a href="/admin/ferramentas" className="text-[var(--color-brand-blue)] hover:underline">
            /admin/ferramentas
          </a>
          . Ferramentas de acesso <strong>gratuito</strong> aparecem para todos; as de <strong>código do livro</strong> exigem autenticação do leitor.
        </p>
      </div>
    </div>
  )
}
