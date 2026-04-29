'use client'

import type { HeroContent, SectionContent } from '@/types/cms'
import {
  FieldGroup,
  TextInput,
  SegmentControl,
  ToggleField,
  EditorSection,
  EditorDivider,
  type ContentEditorProps,
} from './SectionContentEditor'

export function HeroContentEditor({ content, onChange }: ContentEditorProps) {
  const c = content as HeroContent

  function set<K extends keyof HeroContent>(key: K, value: HeroContent[K]) {
    onChange({ ...c, [key]: value } as SectionContent)
  }

  return (
    <div>
      <EditorSection>
        <FieldGroup label="Título">
          <TextInput
            value={c.title ?? ''}
            onChange={(v) => set('title', v)}
            placeholder="O método que transforma quem lidera"
          />
        </FieldGroup>

        <FieldGroup label="Subtítulo">
          <TextInput
            value={c.subtitle ?? ''}
            onChange={(v) => set('subtitle', v)}
            placeholder="Para pequenos e médios empresários…"
            multiline
            rows={2}
          />
        </FieldGroup>
      </EditorSection>

      <EditorDivider />

      <EditorSection>
        <FieldGroup label="Visual">
          <SegmentControl
            options={[
              { label: 'Dark', value: 'dark' },
              { label: 'Canvas', value: 'canvas' },
              { label: 'Azul', value: 'blue' },
            ]}
            value={c.variant ?? 'dark'}
            onChange={(v) => set('variant', v as HeroContent['variant'])}
          />
        </FieldGroup>

        <FieldGroup label="Alinhamento">
          <SegmentControl
            options={[
              { label: 'Esq.', value: 'left' },
              { label: 'Centro', value: 'center' },
              { label: 'Dir.', value: 'right' },
            ]}
            value={c.align ?? 'center'}
            onChange={(v) => set('align', v as HeroContent['align'])}
          />
        </FieldGroup>

        <ToggleField
          label="Animação 360"
          value={c.show_360_animation ?? false}
          onChange={(v) => set('show_360_animation', v)}
          description="Exibe os dígitos 3, 6, 0 animados"
        />
      </EditorSection>

      <EditorDivider />

      <EditorSection>
        <FieldGroup label="Botão principal">
          <TextInput
            value={c.cta_label ?? ''}
            onChange={(v) => set('cta_label', v)}
            placeholder="Conhecer o método"
          />
          <TextInput
            value={c.cta_url ?? ''}
            onChange={(v) => set('cta_url', v)}
            placeholder="/metodo"
          />
        </FieldGroup>

        <FieldGroup label="Botão secundário">
          <TextInput
            value={c.cta_secondary_label ?? ''}
            onChange={(v) => set('cta_secondary_label', v)}
            placeholder="Ferramentas gratuitas"
          />
          <TextInput
            value={c.cta_secondary_url ?? ''}
            onChange={(v) => set('cta_secondary_url', v)}
            placeholder="/ferramentas"
          />
        </FieldGroup>
      </EditorSection>
    </div>
  )
}
