'use client'

import type { CTAContent, SectionContent } from '@/types/cms'
import {
  FieldGroup,
  TextInput,
  SegmentControl,
  EditorSection,
  EditorDivider,
  type ContentEditorProps,
} from './SectionContentEditor'

export function CTAContentEditor({ content, onChange }: ContentEditorProps) {
  const c = content as CTAContent

  function set<K extends keyof CTAContent>(key: K, value: CTAContent[K]) {
    onChange({ ...c, [key]: value } as SectionContent)
  }

  return (
    <div>
      <EditorSection>
        <FieldGroup label="Título">
          <TextInput
            value={c.title ?? ''}
            onChange={(v) => set('title', v)}
            placeholder="Pronto para transformar sua liderança?"
          />
        </FieldGroup>

        <FieldGroup label="Subtítulo">
          <TextInput
            value={c.subtitle ?? ''}
            onChange={(v) => set('subtitle', v)}
            placeholder="Subtítulo opcional"
          />
        </FieldGroup>

        <FieldGroup label="Corpo">
          <TextInput
            value={c.body ?? ''}
            onChange={(v) => set('body', v)}
            placeholder="Texto adicional…"
            multiline
            rows={2}
          />
        </FieldGroup>
      </EditorSection>

      <EditorDivider />

      <EditorSection>
        <FieldGroup label="Botão principal">
          <TextInput
            value={c.cta_text ?? ''}
            onChange={(v) => set('cta_text', v)}
            placeholder="Comprar o livro"
          />
          <TextInput
            value={c.cta_href ?? ''}
            onChange={(v) => set('cta_href', v)}
            placeholder="https://…"
          />
        </FieldGroup>

        <FieldGroup label="Botão secundário">
          <TextInput
            value={c.cta_secondary_label ?? ''}
            onChange={(v) => set('cta_secondary_label', v)}
            placeholder="Saiba mais"
          />
          <TextInput
            value={c.cta_secondary_url ?? ''}
            onChange={(v) => set('cta_secondary_url', v)}
            placeholder="/pagina"
          />
        </FieldGroup>
      </EditorSection>

      <EditorDivider />

      <EditorSection>
        <FieldGroup label="Fundo">
          <SegmentControl
            options={[
              { label: 'Azul', value: 'blue' },
              { label: 'Dourado', value: 'gold' },
              { label: 'Dark', value: 'ink' },
              { label: 'Canvas', value: 'canvas' },
            ]}
            value={c.background ?? 'blue'}
            onChange={(v) => set('background', v as CTAContent['background'])}
          />
        </FieldGroup>

        <FieldGroup label="Alinhamento">
          <SegmentControl
            options={[
              { label: 'Esq.', value: 'left' },
              { label: 'Centro', value: 'center' },
            ]}
            value={c.align ?? 'center'}
            onChange={(v) => set('align', v as CTAContent['align'])}
          />
        </FieldGroup>
      </EditorSection>

      <EditorDivider />

      <EditorSection>
        <FieldGroup label="Imagem lateral (URL)">
          <TextInput
            value={c.image_url ?? ''}
            onChange={(v) => set('image_url', v || undefined)}
            placeholder="https://… ou /assets/foto.jpg"
          />
        </FieldGroup>

        {c.image_url && (
          <>
            <FieldGroup label="Texto alternativo da imagem">
              <TextInput
                value={c.image_alt ?? ''}
                onChange={(v) => set('image_alt', v || undefined)}
                placeholder="Descrição para acessibilidade"
              />
            </FieldGroup>

            <FieldGroup label="Lado da imagem">
              <SegmentControl
                options={[
                  { label: 'Direita', value: 'right' },
                  { label: 'Esquerda', value: 'left' },
                ]}
                value={c.image_side ?? 'right'}
                onChange={(v) => set('image_side', v as CTAContent['image_side'])}
              />
            </FieldGroup>
          </>
        )}
      </EditorSection>
    </div>
  )
}
