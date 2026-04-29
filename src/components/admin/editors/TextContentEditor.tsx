'use client'

import type { TextContent, SectionContent } from '@/types/cms'
import {
  FieldGroup, TextInput, SegmentControl,
  EditorSection, EditorDivider, type ContentEditorProps,
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
          <TextInput value={c.badge ?? ''} onChange={(v) => set('badge', v || undefined)} placeholder="O Método" />
        </FieldGroup>
        <FieldGroup label="Título">
          <TextInput value={c.title ?? ''} onChange={(v) => set('title', v)} placeholder="Gestão é técnica. Liderança é consciência." />
        </FieldGroup>
        <FieldGroup label="Subtítulo">
          <TextInput value={c.subtitle ?? ''} onChange={(v) => set('subtitle', v || undefined)} placeholder="Subtítulo opcional" />
        </FieldGroup>
        <FieldGroup label="Corpo (Markdown)" hint="Use **negrito**, *itálico*, - lista, ## Título">
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

      <EditorDivider />

      {/* ── Imagem lateral ── */}
      <EditorSection>
        <FieldGroup label="Imagem lateral (URL)">
          <TextInput
            value={c.image_url ?? ''}
            onChange={(v) => set('image_url', v || undefined)}
            placeholder="https://… ou /assets/imagem.jpg"
          />
        </FieldGroup>

        {c.image_url && (
          <>
            <FieldGroup label="Texto alternativo (acessibilidade)">
              <TextInput
                value={c.image_alt ?? ''}
                onChange={(v) => set('image_alt', v || undefined)}
                placeholder="Descrição da imagem"
              />
            </FieldGroup>

            <FieldGroup label="Lado da imagem">
              <SegmentControl
                options={[
                  { label: 'Direita', value: 'right' },
                  { label: 'Esquerda', value: 'left' },
                ]}
                value={c.image_side ?? 'right'}
                onChange={(v) => set('image_side', v as TextContent['image_side'])}
              />
            </FieldGroup>

            <FieldGroup label="Proporção">
              <SegmentControl
                options={[
                  { label: '1:1', value: '1:1' },
                  { label: '4:3', value: '4:3' },
                  { label: '16:9', value: '16:9' },
                ]}
                value={c.image_ratio ?? '4:3'}
                onChange={(v) => set('image_ratio', v as TextContent['image_ratio'])}
              />
            </FieldGroup>
          </>
        )}
      </EditorSection>

      <EditorDivider />

      {/* ── CTA embutido ── */}
      <EditorSection>
        <FieldGroup label="Botão (label)">
          <TextInput
            value={c.cta_label ?? ''}
            onChange={(v) => set('cta_label', v || undefined)}
            placeholder="Conheça o método"
          />
        </FieldGroup>

        {c.cta_label && (
          <>
            <FieldGroup label="Botão (URL)">
              <TextInput
                value={c.cta_url ?? ''}
                onChange={(v) => set('cta_url', v || undefined)}
                placeholder="/metodo"
              />
            </FieldGroup>

            <FieldGroup label="Estilo do botão">
              <SegmentControl
                options={[
                  { label: 'Primário', value: 'primary' },
                  { label: 'Secundário', value: 'secondary' },
                  { label: 'Ghost', value: 'ghost' },
                ]}
                value={c.cta_style ?? 'primary'}
                onChange={(v) => set('cta_style', v as TextContent['cta_style'])}
              />
            </FieldGroup>
          </>
        )}
      </EditorSection>
    </div>
  )
}
