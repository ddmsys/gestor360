'use client'

import type { AutoresContent, AutorItem, SectionContent } from '@/types/cms'
import {
  FieldGroup, TextInput, SegmentControl,
  EditorSection, EditorDivider, type ContentEditorProps,
} from './SectionContentEditor'

export function AutoresContentEditor({ content, onChange }: ContentEditorProps) {
  const c = content as AutoresContent
  const autores = c.autores ?? []

  function set<K extends keyof AutoresContent>(key: K, value: AutoresContent[K]) {
    onChange({ ...c, [key]: value } as SectionContent)
  }

  function updateAutor(idx: number, updated: Partial<AutorItem>) {
    const next = autores.map((a, i) => (i === idx ? { ...a, ...updated } : a))
    set('autores', next)
  }

  function addAutor() {
    set('autores', [...autores, { nome: 'Nome do Autor', cargo: 'Cargo', bio: 'Bio aqui.', foto_url: '' }])
  }

  function removeAutor(idx: number) {
    set('autores', autores.filter((_, i) => i !== idx))
  }

  return (
    <div>
      <EditorSection>
        <FieldGroup label="Título da seção">
          <TextInput value={c.title ?? ''} onChange={(v) => set('title', v)} placeholder="Os autores" />
        </FieldGroup>
        <FieldGroup label="Subtítulo">
          <TextInput value={c.subtitle ?? ''} onChange={(v) => set('subtitle', v)} placeholder="Subtítulo opcional" />
        </FieldGroup>
      </EditorSection>

      <EditorDivider />

      <EditorSection>
        <FieldGroup label="Layout">
          <SegmentControl
            options={[
              { label: 'Lado a lado', value: 'side-by-side' },
              { label: 'Empilhado', value: 'stacked' },
            ]}
            value={c.layout ?? 'side-by-side'}
            onChange={(v) => set('layout', v as AutoresContent['layout'])}
          />
        </FieldGroup>

        <FieldGroup label="Fundo">
          <SegmentControl
            options={[
              { label: 'Branco', value: 'white' },
              { label: 'Canvas', value: 'canvas' },
            ]}
            value={c.bg ?? 'white'}
            onChange={(v) => set('bg', v as AutoresContent['bg'])}
          />
        </FieldGroup>
      </EditorSection>

      <EditorDivider />

      <div className="px-4 pb-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            Autores ({autores.length})
          </span>
          <button
            type="button"
            onClick={addAutor}
            className="text-xs font-semibold text-[var(--color-brand-blue)] hover:underline"
          >
            + Adicionar
          </button>
        </div>

        {autores.map((autor, idx) => (
          <div
            key={idx}
            className="border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden"
          >
            <div className="flex items-center justify-between px-3 py-2 bg-[var(--color-bg-canvas)]">
              <span className="text-xs font-semibold text-[var(--color-text-body)] truncate flex-1">
                {autor.nome || `Autor ${idx + 1}`}
              </span>
              <button
                type="button"
                onClick={() => removeAutor(idx)}
                aria-label="Remover autor"
                className="w-5 h-5 flex items-center justify-center text-red-400 hover:text-red-600"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-3 space-y-2">
              <TextInput
                value={autor.nome}
                onChange={(v) => updateAutor(idx, { nome: v })}
                placeholder="Nome completo"
              />
              <TextInput
                value={autor.cargo}
                onChange={(v) => updateAutor(idx, { cargo: v })}
                placeholder="Cargo (ex: CEO & Fundador)"
              />
              <TextInput
                value={autor.bio}
                onChange={(v) => updateAutor(idx, { bio: v })}
                placeholder="Biografia curta"
                multiline
                rows={3}
              />
              <TextInput
                value={autor.foto_url}
                onChange={(v) => updateAutor(idx, { foto_url: v })}
                placeholder="URL da foto"
              />
              <TextInput
                value={autor.linkedin_url ?? ''}
                onChange={(v) => updateAutor(idx, { linkedin_url: v || undefined })}
                placeholder="LinkedIn (URL completo)"
              />
              <TextInput
                value={autor.instagram_url ?? ''}
                onChange={(v) => updateAutor(idx, { instagram_url: v || undefined })}
                placeholder="Instagram (URL completo)"
              />
              <TextInput
                value={autor.site_url ?? ''}
                onChange={(v) => updateAutor(idx, { site_url: v || undefined })}
                placeholder="Site pessoal (URL)"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
