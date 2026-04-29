'use client'

import type { TextContent, SectionContent } from '@/types/cms'
import {
  FieldGroup,
  TextInput,
  SegmentControl,
  EditorSection,
  EditorDivider,
  type ContentEditorProps,
} from './SectionContentEditor'

export function TextContentEditor({ content, onChange }: ContentEditorProps) {
  const c = content as TextContent

  function set<K extends keyof TextContent>(key: K, value: TextContent[K]) {
    onChange({ ...c, [key]: value } as SectionContent)
  }

  return (
    <div>
      <EditorSection>
        <FieldGroup label="Badge">
          <TextInput
            value={c.badge ?? ''}
            onChange={(v) => set('badge', v)}
            placeholder="O Método"
          />
        </FieldGroup>

        <FieldGroup label="Título">
          <TextInput
            value={c.title ?? ''}
            onChange={(v) => set('title', v)}
            placeholder="Gestão é técnica. Liderança é consciência."
          />
        </FieldGroup>

        <FieldGroup label="Corpo (Markdown)">
          <TextInput
            value={c.body ?? ''}
            onChange={(v) => set('body', v)}
            placeholder="Escreva o conteúdo da seção…"
            multiline
            rows={6}
          />
        </FieldGroup>
      </EditorSection>

      <EditorDivider />

      <EditorSection>
        <FieldGroup label="Fundo">
          <SegmentControl
            options={[
              { label: 'Branco', value: 'white' },
              { label: 'Canvas', value: 'canvas' },
              { label: 'Dark', value: 'ink' },
            ]}
            value={c.bg ?? 'white'}
            onChange={(v) => set('bg', v as TextContent['bg'])}
          />
        </FieldGroup>

        <FieldGroup label="Alinhamento">
          <SegmentControl
            options={[
              { label: 'Esq.', value: 'left' },
              { label: 'Centro', value: 'center' },
              { label: 'Dir.', value: 'right' },
            ]}
            value={c.align ?? 'left'}
            onChange={(v) => set('align', v as TextContent['align'])}
          />
        </FieldGroup>

        <FieldGroup label="Largura máxima">
          <SegmentControl
            options={[
              { label: 'SM', value: 'sm' },
              { label: 'MD', value: 'md' },
              { label: 'LG', value: 'lg' },
              { label: 'Full', value: 'full' },
            ]}
            value={c.max_width ?? 'lg'}
            onChange={(v) => set('max_width', v as TextContent['max_width'])}
          />
        </FieldGroup>
      </EditorSection>
    </div>
  )
}
