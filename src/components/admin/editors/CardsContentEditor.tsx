'use client'

import type { CardsContent, CardItem, SectionContent } from '@/types/cms'
import {
  FieldGroup,
  TextInput,
  SegmentControl,
  EditorSection,
  EditorDivider,
  type ContentEditorProps,
} from './SectionContentEditor'

export function CardsContentEditor({ content, onChange }: ContentEditorProps) {
  const c = content as CardsContent
  const cards = c.cards ?? []

  function set<K extends keyof CardsContent>(key: K, value: CardsContent[K]) {
    onChange({ ...c, [key]: value } as SectionContent)
  }

  function updateCard(idx: number, updated: Partial<CardItem>) {
    const next = cards.map((card, i) => (i === idx ? { ...card, ...updated } : card))
    set('cards', next)
  }

  function addCard() {
    set('cards', [...cards, { title: 'Novo card', description: 'Descrição do card.' }])
  }

  function removeCard(idx: number) {
    set('cards', cards.filter((_, i) => i !== idx))
  }

  return (
    <div>
      <EditorSection>
        <FieldGroup label="Título da seção">
          <TextInput
            value={c.title ?? ''}
            onChange={(v) => set('title', v)}
            placeholder="Os pilares do método"
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
        <FieldGroup label="Layout">
          <SegmentControl
            options={[
              { label: '2 col.', value: '2' },
              { label: '3 col.', value: '3' },
              { label: '4 col.', value: '4' },
            ]}
            value={String(c.columns ?? 3)}
            onChange={(v) => set('columns', Number(v) as CardsContent['columns'])}
          />
        </FieldGroup>

        <FieldGroup label="Fundo">
          <SegmentControl
            options={[
              { label: 'Branco', value: 'white' },
              { label: 'Canvas', value: 'canvas' },
              { label: 'Dark', value: 'ink' },
            ]}
            value={c.bg ?? 'canvas'}
            onChange={(v) => set('bg', v as CardsContent['bg'])}
          />
        </FieldGroup>

        <FieldGroup label="Estilo do card">
          <SegmentControl
            options={[
              { label: 'Sombra', value: 'shadow' },
              { label: 'Borda', value: 'bordered' },
              { label: 'Flat', value: 'flat' },
            ]}
            value={c.card_style ?? 'shadow'}
            onChange={(v) => set('card_style', v as CardsContent['card_style'])}
          />
        </FieldGroup>
      </EditorSection>

      <EditorDivider />

      {/* Lista de cards */}
      <div className="px-4 pb-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            Cards ({cards.length})
          </span>
          <button
            onClick={addCard}
            className="text-xs font-semibold text-[var(--color-brand-blue)] hover:underline"
          >
            + Adicionar
          </button>
        </div>

        {cards.map((card, idx) => (
          <div
            key={idx}
            className="border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden"
          >
            <div className="flex items-center justify-between px-3 py-2 bg-[var(--color-bg-canvas)]">
              <span className="text-xs font-semibold text-[var(--color-text-body)] truncate flex-1">
                {card.icon && <span className="mr-1">{card.icon}</span>}
                {card.title || `Card ${idx + 1}`}
              </span>
              <button
                onClick={() => removeCard(idx)}
                aria-label="Remover card"
                className="w-5 h-5 flex items-center justify-center text-red-400 hover:text-red-600"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-3 space-y-2">
              <TextInput
                value={card.icon ?? ''}
                onChange={(v) => updateCard(idx, { icon: v })}
                placeholder="Emoji ou URL do ícone"
              />
              <TextInput
                value={card.title}
                onChange={(v) => updateCard(idx, { title: v })}
                placeholder="Título do card"
              />
              <TextInput
                value={card.description}
                onChange={(v) => updateCard(idx, { description: v })}
                placeholder="Descrição do card"
                multiline
                rows={2}
              />
              <TextInput
                value={card.badge ?? ''}
                onChange={(v) => updateCard(idx, { badge: v || undefined })}
                placeholder="Badge (ex: Novo, em breve…)"
              />
              <TextInput
                value={card.link_label ?? ''}
                onChange={(v) => updateCard(idx, { link_label: v || undefined })}
                placeholder="Texto do link (ex: Saiba mais)"
              />
              {card.link_label && (
                <TextInput
                  value={card.link_url ?? ''}
                  onChange={(v) => updateCard(idx, { link_url: v || undefined })}
                  placeholder="URL do link (/pagina ou https://…)"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
