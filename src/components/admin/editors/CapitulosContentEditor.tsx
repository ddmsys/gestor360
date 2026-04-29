'use client'

import type { CapitulosContent, SectionContent } from '@/types/cms'
import {
  FieldGroup, TextInput, SegmentControl, ToggleField,
  EditorSection, EditorDivider, type ContentEditorProps,
} from './SectionContentEditor'

const CAPITULOS_INFO = [
  { num: 1,  tema: 'Planejamento Estratégico'    },
  { num: 2,  tema: 'Comunicação'                 },
  { num: 3,  tema: 'Delegação'                   },
  { num: 4,  tema: 'Mentalidade do Líder'        },
  { num: 5,  tema: 'Gestão Financeira'           },
  { num: 6,  tema: 'Marketing e Vendas'          },
  { num: 7,  tema: 'Gestão de Pessoas'           },
  { num: 8,  tema: 'Riscos e Decisões'           },
  { num: 9,  tema: 'Autoaprendizado'             },
  { num: 10, tema: 'Indicadores e Resultados'    },
]

export function CapitulosContentEditor({ content, onChange }: ContentEditorProps) {
  const c = content as CapitulosContent

  function set<K extends keyof CapitulosContent>(key: K, value: CapitulosContent[K]) {
    onChange({ ...c, [key]: value } as SectionContent)
  }

  return (
    <div>
      <EditorSection>
        <FieldGroup label="Título da seção">
          <TextInput
            value={c.title ?? ''}
            onChange={(v) => set('title', v)}
            placeholder="Os 10 Capítulos do Método"
          />
        </FieldGroup>
        <FieldGroup label="Subtítulo">
          <TextInput
            value={c.subtitle ?? ''}
            onChange={(v) => set('subtitle', v)}
            placeholder="Subtítulo opcional"
          />
        </FieldGroup>
        <FieldGroup label="Badge">
          <TextInput
            value={c.badge ?? ''}
            onChange={(v) => set('badge', v || undefined)}
            placeholder="ex: O Método"
          />
        </FieldGroup>
      </EditorSection>

      <EditorDivider />

      <EditorSection>
        <FieldGroup label="Layout">
          <SegmentControl
            options={[
              { label: 'Grid', value: 'grid' },
              { label: 'Lista numerada', value: 'numbered-list' },
            ]}
            value={c.layout ?? 'grid'}
            onChange={(v) => set('layout', v as CapitulosContent['layout'])}
          />
        </FieldGroup>

        <FieldGroup label="Fundo">
          <SegmentControl
            options={[
              { label: 'Branco', value: 'white' },
              { label: 'Canvas', value: 'canvas' },
            ]}
            value={c.bg ?? 'canvas'}
            onChange={(v) => set('bg', v as CapitulosContent['bg'])}
          />
        </FieldGroup>

        <ToggleField
          label="Link para ferramentas"
          value={c.link_para_ferramenta ?? false}
          onChange={(v) => set('link_para_ferramenta', v)}
          description="Exibe link 'Ver ferramentas' em cada capítulo"
        />
      </EditorSection>

      <EditorDivider />

      <div className="px-4 pb-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
          Capítulos (fixos do método)
        </p>
        <div className="space-y-1">
          {CAPITULOS_INFO.map((cap) => (
            <div
              key={cap.num}
              className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--color-bg-canvas)] border border-[var(--color-border)]"
            >
              <span className="text-[10px] font-black text-[var(--color-brand-blue)] w-5 shrink-0">
                {String(cap.num).padStart(2, '0')}
              </span>
              <span className="text-xs text-[var(--color-text-body)] truncate">{cap.tema}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[var(--color-text-muted)]/70 mt-2">
          Os 10 capítulos são fixos do método. Para editar o conteúdo de cada um, acesse a seção de Capítulos no painel.
        </p>
      </div>
    </div>
  )
}
