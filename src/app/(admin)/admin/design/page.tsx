import { createClient } from '@/lib/supabase/server'
import { saveDesignConfig } from '@/lib/design/actions'
import type { DesignConfig } from '@/lib/design/config'

const PALETTES: {
  id: DesignConfig['palette']
  name: string
  desc: string
  bg: string
  primary: string
  accent: string
}[] = [
  {
    id: 'default',
    name: 'Canvas Original',
    desc: 'Fundo bege aconchegante — identidade padrão do livro',
    bg: '#E8E6E1',
    primary: '#1F3F7A',
    accent: '#D4A020',
  },
  {
    id: 'clean',
    name: 'Branca Limpa',
    desc: 'Fundo branco moderno — máxima clareza',
    bg: '#FFFFFF',
    primary: '#1F3F7A',
    accent: '#D4A020',
  },
  {
    id: 'warm',
    name: 'Areia Quente',
    desc: 'Tom de terra caloroso — sensação acolhedora',
    bg: '#F5EDE0',
    primary: '#5C3D2E',
    accent: '#D4821A',
  },
  {
    id: 'slate',
    name: 'Slate Azul',
    desc: 'Fundo azul acinzentado — corporativo e sóbrio',
    bg: '#F0F4FA',
    primary: '#1F3F7A',
    accent: '#D4A020',
  },
  {
    id: 'dark',
    name: 'Modo Escuro',
    desc: 'Fundo preto — impacto visual máximo',
    bg: '#111111',
    primary: '#4A7ADE',
    accent: '#E8C040',
  },
]

const FONTS_BODY: { id: DesignConfig['font_body']; name: string; sample: string }[] = [
  { id: 'dm-sans', name: 'DM Sans', sample: 'Texto limpo e moderno' },
  { id: 'inter', name: 'Inter', sample: 'Legível em qualquer tamanho' },
  { id: 'nunito', name: 'Nunito', sample: 'Arredondado e amigável' },
  { id: 'open-sans', name: 'Open Sans', sample: 'Clássico e neutro' },
]

const FONTS_DISPLAY: { id: DesignConfig['font_display']; name: string; sample: string }[] = [
  { id: 'gotham', name: 'Gotham', sample: 'MÉTODO GESTOR360' },
  { id: 'oswald', name: 'Oswald', sample: 'LIDERANÇA CONSCIENTE' },
  { id: 'montserrat', name: 'Montserrat', sample: 'GESTÃO ESTRATÉGICA' },
  { id: 'playfair', name: 'Playfair Display', sample: 'O Gestor do Futuro' },
]

const TYPE_SCALES: { id: DesignConfig['type_scale']; name: string; desc: string }[] = [
  { id: 'compact', name: 'Compacta', desc: 'Títulos menores — mais conteúdo por tela' },
  { id: 'normal', name: 'Normal', desc: 'Escala padrão — equilíbrio ideal' },
  { id: 'generous', name: 'Generosa', desc: 'Títulos maiores — impacto visual forte' },
]

interface Props {
  searchParams: Promise<{ success?: string; error?: string }>
}

export default async function DesignStudioPage({ searchParams }: Props) {
  const { success, error } = await searchParams
  const supabase = await createClient()

  const { data: configRow } = await supabase
    .from('site_config')
    .select('value')
    .eq('key', 'design')
    .single()

  const current = (configRow?.value ?? {
    palette: 'default',
    font_body: 'dm-sans',
    font_display: 'gotham',
    type_scale: 'normal',
  }) as DesignConfig

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display font-black text-2xl text-[var(--color-text-title)]">
          Design Studio
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
          Personalize a aparência do site — as alterações aplicam ao site público instantaneamente.
        </p>
      </div>

      {success === 'design-salvo' && (
        <div className="mb-6 rounded-[var(--radius-md)] bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          Design salvo e aplicado ao site com sucesso!
        </div>
      )}
      {error && (
        <div className="mb-6 rounded-[var(--radius-md)] bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      )}

      <form action={saveDesignConfig} className="space-y-8">
        {/* Paleta de cores */}
        <section className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-6">
          <div className="mb-5">
            <h2 className="font-display font-bold text-lg text-[var(--color-text-title)]">
              Paleta de cores
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
              Cada paleta foi desenhada para manter harmonia com a identidade Gestor360.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PALETTES.map((palette) => {
              const isSelected = current.palette === palette.id
              return (
                <label
                  key={palette.id}
                  className={`relative cursor-pointer rounded-[var(--radius-lg)] border-2 p-4 transition-all ${
                    isSelected
                      ? 'border-[var(--color-brand-blue)] shadow-[var(--shadow-blue)]'
                      : 'border-[var(--color-border)] hover:border-[var(--color-brand-blue)]/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="palette"
                    value={palette.id}
                    defaultChecked={isSelected}
                    className="sr-only"
                  />

                  {/* Prévia de cores */}
                  <div
                    className="h-12 rounded-[var(--radius-md)] mb-3 flex items-center justify-center gap-2 border border-black/10"
                    style={{ backgroundColor: palette.bg }}
                  >
                    <span
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: palette.primary }}
                    />
                    <span
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: palette.accent }}
                    />
                  </div>

                  <p className="font-semibold text-sm text-[var(--color-text-title)]">
                    {palette.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{palette.desc}</p>

                  {isSelected && (
                    <span className="absolute top-2 right-2 text-[var(--color-brand-blue)] text-base">
                      ✓
                    </span>
                  )}
                </label>
              )
            })}
          </div>
        </section>

        {/* Tipografia — fonte do corpo */}
        <section className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-6">
          <div className="mb-5">
            <h2 className="font-display font-bold text-lg text-[var(--color-text-title)]">
              Fonte do texto
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
              Usada em parágrafos, labels e UI em geral.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {FONTS_BODY.map((font) => {
              const isSelected = current.font_body === font.id
              return (
                <label
                  key={font.id}
                  className={`cursor-pointer rounded-[var(--radius-lg)] border-2 p-4 transition-all ${
                    isSelected
                      ? 'border-[var(--color-brand-blue)] shadow-[var(--shadow-blue)] bg-blue-50/30'
                      : 'border-[var(--color-border)] hover:border-[var(--color-brand-blue)]/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="font_body"
                    value={font.id}
                    defaultChecked={isSelected}
                    className="sr-only"
                  />
                  <p className="font-semibold text-sm text-[var(--color-text-title)]">
                    {font.name}
                    {isSelected && <span className="ml-2 text-[var(--color-brand-blue)]">✓</span>}
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">{font.sample}</p>
                </label>
              )
            })}
          </div>
        </section>

        {/* Tipografia — fonte de título */}
        <section className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-6">
          <div className="mb-5">
            <h2 className="font-display font-bold text-lg text-[var(--color-text-title)]">
              Fonte dos títulos
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
              Usada em H1, H2 e elementos de destaque.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {FONTS_DISPLAY.map((font) => {
              const isSelected = current.font_display === font.id
              return (
                <label
                  key={font.id}
                  className={`cursor-pointer rounded-[var(--radius-lg)] border-2 p-4 transition-all ${
                    isSelected
                      ? 'border-[var(--color-brand-blue)] shadow-[var(--shadow-blue)] bg-blue-50/30'
                      : 'border-[var(--color-border)] hover:border-[var(--color-brand-blue)]/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="font_display"
                    value={font.id}
                    defaultChecked={isSelected}
                    className="sr-only"
                  />
                  <p className="font-semibold text-sm text-[var(--color-text-title)]">
                    {font.name}
                    {isSelected && <span className="ml-2 text-[var(--color-brand-blue)]">✓</span>}
                  </p>
                  <p className="text-lg font-bold text-[var(--color-text-muted)] mt-1 truncate">
                    {font.sample}
                  </p>
                </label>
              )
            })}
          </div>
        </section>

        {/* Escala tipográfica */}
        <section className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-6">
          <div className="mb-5">
            <h2 className="font-display font-bold text-lg text-[var(--color-text-title)]">
              Escala tipográfica
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
              Afeta o tamanho de todos os títulos e parágrafos proporcionalmente.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {TYPE_SCALES.map((scale) => {
              const isSelected = current.type_scale === scale.id
              const sizeClass =
                scale.id === 'compact' ? 'text-sm' : scale.id === 'generous' ? 'text-xl' : 'text-base'
              return (
                <label
                  key={scale.id}
                  className={`cursor-pointer rounded-[var(--radius-lg)] border-2 p-4 text-center transition-all ${
                    isSelected
                      ? 'border-[var(--color-brand-blue)] shadow-[var(--shadow-blue)] bg-blue-50/30'
                      : 'border-[var(--color-border)] hover:border-[var(--color-brand-blue)]/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="type_scale"
                    value={scale.id}
                    defaultChecked={isSelected}
                    className="sr-only"
                  />
                  <p className={`font-bold text-[var(--color-text-title)] mb-1 ${sizeClass}`}>
                    Aa
                  </p>
                  <p className="font-semibold text-sm text-[var(--color-text-title)]">
                    {scale.name}
                    {isSelected && <span className="ml-1 text-[var(--color-brand-blue)]">✓</span>}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{scale.desc}</p>
                </label>
              )
            })}
          </div>
        </section>

        {/* Aviso sobre fontes externas */}
        <div className="rounded-[var(--radius-md)] bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <strong>Atenção:</strong> as fontes Inter, Nunito, Open Sans, Oswald, Montserrat e
          Playfair precisam ser importadas no projeto para funcionar corretamente. Gotham e DM Sans
          já estão configuradas.
        </div>

        {/* Botão salvar */}
        <div className="flex items-center justify-end gap-4 py-4 border-t border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-text-muted)]">
            As mudanças são aplicadas imediatamente ao site público.
          </p>
          <button
            type="submit"
            className="inline-flex items-center rounded-[var(--radius-md)] bg-[var(--color-brand-blue)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-blue)] hover:bg-[var(--color-brand-blue-hover)] transition-colors"
          >
            Salvar e aplicar →
          </button>
        </div>
      </form>
    </div>
  )
}
