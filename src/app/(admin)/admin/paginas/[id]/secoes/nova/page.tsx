import Link from 'next/link'
import { createSection } from '@/lib/paginas/actions'
import type { SectionType } from '@/types/cms'

const SECTION_TYPES: { type: SectionType; label: string; desc: string; icon: string }[] = [
  { type: 'hero', label: 'Hero', desc: 'Banner principal com título e CTA', icon: '🦸' },
  { type: 'text', label: 'Texto', desc: 'Título + corpo em markdown', icon: '📝' },
  { type: 'cards', label: 'Cards', desc: 'Grid de cards com ícone e descrição', icon: '🃏' },
  { type: 'ferramentas', label: 'Ferramentas', desc: 'Lista de PDFs por capítulo', icon: '🧰' },
  { type: 'form', label: 'Formulário', desc: 'Captação de leads dinâmica', icon: '📋' },
  { type: 'faq', label: 'FAQ', desc: 'Accordion de perguntas e respostas', icon: '❓' },
  { type: 'cta', label: 'CTA', desc: 'Fundo colorido com chamada para ação', icon: '🎯' },
  { type: 'depoimentos', label: 'Depoimentos', desc: 'Grid ou carrossel de avaliações', icon: '💬' },
  { type: 'capitulos', label: 'Capítulos', desc: 'Os 10 capítulos do método', icon: '📖' },
  { type: 'autores', label: 'Autores', desc: 'Perfil dos autores com bio', icon: '👥' },
]

const TEMPLATES: Record<SectionType, object> = {
  hero: {
    title: 'Título principal aqui',
    subtitle: 'Subtítulo opcional — complementa o título',
    cta_label: 'Texto do botão principal',
    cta_url: '/ferramentas',
    cta_secondary_label: 'Botão secundário',
    cta_secondary_url: '/sobre',
    variant: 'dark',
    show_360_animation: true,
    align: 'center',
  },
  text: {
    title: 'Título da seção',
    body: 'Texto em **markdown**. Pode usar _itálico_, ## subtítulos, listas, etc.',
    badge: 'Label opcional',
    badge_color: 'blue',
    align: 'center',
    max_width: 'lg',
    bg: 'white',
  },
  cards: {
    title: 'Título da seção de cards',
    subtitle: 'Subtítulo opcional',
    columns: 3,
    bg: 'white',
    card_style: 'shadow',
    cards: [
      { icon: '🎯', title: 'Card 1', description: 'Descrição do primeiro card' },
      { icon: '📊', title: 'Card 2', description: 'Descrição do segundo card' },
      { icon: '🚀', title: 'Card 3', description: 'Descrição do terceiro card' },
    ],
  },
  ferramentas: {
    title: 'Ferramentas práticas',
    subtitle: 'Baixe e use no seu negócio',
    layout: 'grid',
    mostrar_todos: true,
    mostrar_cta_codigo: true,
    cta_codigo_titulo: 'Acesso completo',
    cta_codigo_descricao: 'Insira o código do livro para desbloquear todas as 31 ferramentas',
  },
  form: {
    title: 'Acesse as ferramentas',
    subtitle: 'Cadastre-se gratuitamente',
    bg: 'white',
    layout: 'centered',
    submit_label: 'Quero acesso gratuito',
    success_title: 'Cadastro confirmado!',
    success_message: 'Verifique seu e-mail para acessar as ferramentas.',
    fields: [
      { field_key: 'nome', label: 'Nome completo', type: 'text', required: true, placeholder: 'Seu nome' },
      { field_key: 'email', label: 'E-mail', type: 'email', required: true, placeholder: 'seu@email.com' },
      { field_key: 'whatsapp', label: 'WhatsApp', type: 'tel', required: false, placeholder: '(11) 99999-9999' },
    ],
  },
  faq: {
    title: 'Perguntas frequentes',
    bg: 'canvas',
    layout: 'single',
    badge: 'FAQ',
    badge_color: 'blue',
    items: [
      { question: 'Qual é a primeira pergunta?', answer: 'Esta é a resposta para a primeira pergunta.' },
      { question: 'Qual é a segunda pergunta?', answer: 'Esta é a resposta para a segunda pergunta.' },
      { question: 'Qual é a terceira pergunta?', answer: 'Esta é a resposta para a terceira pergunta.' },
    ],
  },
  cta: {
    title: 'Comece sua transformação agora',
    subtitle: 'Junte-se a centenas de gestores que já mudaram sua liderança',
    cta_text: 'Acessar ferramentas gratuitas',
    cta_href: '/ferramentas',
    cta_secondary_label: 'Saiba mais sobre o método',
    cta_secondary_url: '/metodo',
    background: 'blue',
    align: 'center',
  },
  depoimentos: {
    title: 'O que dizem os gestores',
    subtitle: 'Histórias reais de transformação',
    source: 'manual',
    layout: 'grid',
    columns: 3,
    bg: 'canvas',
    badge: 'Depoimentos',
    badge_color: 'gold',
    items: [
      {
        nome: 'Maria Silva',
        cargo: 'CEO',
        empresa: 'Empresa XYZ',
        texto: 'O método Gestor360 transformou completamente a forma como lidero minha equipe.',
        nota: 5,
      },
    ],
  },
  capitulos: {
    title: 'Os 10 capítulos do método',
    subtitle: 'Uma jornada completa de transformação da liderança',
    bg: 'white',
    layout: 'grid',
    link_para_ferramenta: true,
  },
  autores: {
    title: 'Conheça os autores',
    subtitle: 'Especialistas em liderança consciente para PMEs',
    bg: 'white',
    layout: 'side-by-side',
    autores: [
      {
        nome: 'Flávio Di Morais',
        cargo: 'CEO da DDM Editora',
        bio: 'Fundador do método Gestor360®, especialista em liderança consciente para pequenos e médios empresários.',
        foto_url: '/autores/flavio.jpg',
        instagram_url: 'https://instagram.com/oCaraDoLivro',
      },
    ],
  },
}

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ type?: string; error?: string }>
}

export default async function NovaSectionPage({ params, searchParams }: Props) {
  const { id: pageId } = await params
  const { type: selectedType, error } = await searchParams

  const typeInfo = SECTION_TYPES.find((t) => t.type === selectedType)
  const template = selectedType ? TEMPLATES[selectedType as SectionType] : null

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <Link href="/admin/paginas" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]">
          ← Páginas
        </Link>
        <span className="text-[var(--color-border)]">/</span>
        <Link href={`/admin/paginas/${pageId}`} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]">
          Editor
        </Link>
        <span className="text-[var(--color-border)]">/</span>
        <h1 className="font-display font-black text-2xl text-[var(--color-text-title)]">
          {typeInfo ? `Nova seção — ${typeInfo.label}` : 'Escolher tipo de seção'}
        </h1>
      </div>

      {error && (
        <div className="mb-6 rounded-[var(--radius-md)] bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      )}

      {/* Step 1: seleção do tipo */}
      {!selectedType && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SECTION_TYPES.map(({ type, label, desc, icon }) => (
            <Link
              key={type}
              href={`/admin/paginas/${pageId}/secoes/nova?type=${type}`}
              className="flex flex-col gap-2 rounded-[var(--radius-lg)] bg-white border border-[var(--color-border)] shadow-[var(--shadow-xs)] p-4 hover:border-[var(--color-brand-blue)] hover:shadow-[var(--shadow-blue)] transition-all group"
            >
              <span className="text-2xl" aria-hidden="true">{icon}</span>
              <span className="font-display font-bold text-sm text-[var(--color-text-title)] group-hover:text-[var(--color-brand-blue)]">
                {label}
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">{desc}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Step 2: formulário JSON */}
      {selectedType && template && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">
              {typeInfo?.icon}
            </span>
            <p className="text-sm text-[var(--color-text-muted)]">{typeInfo?.desc}</p>
            <Link
              href={`/admin/paginas/${pageId}/secoes/nova`}
              className="ml-auto text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]"
            >
              Trocar tipo →
            </Link>
          </div>

          <form action={createSection} className="space-y-4">
            <input type="hidden" name="page_id" value={pageId} />
            <input type="hidden" name="type" value={selectedType} />

            <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg-canvas)] flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Conteúdo JSON
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Edite os valores — mantenha a estrutura
                </p>
              </div>
              <textarea
                name="content_json"
                rows={20}
                required
                defaultValue={JSON.stringify(template, null, 2)}
                spellCheck={false}
                className="w-full px-4 py-3 font-mono text-sm text-[var(--color-text-body)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-brand-blue)] resize-y"
                aria-label="Conteúdo da seção em JSON"
              />
            </div>

            {/* Referência de campos */}
            <details className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-canvas)] text-sm">
              <summary className="px-4 py-3 cursor-pointer font-semibold text-[var(--color-text-body)] select-none">
                Referência de campos disponíveis
              </summary>
              <div className="px-4 pb-4 pt-2 text-[var(--color-text-muted)] space-y-1 text-xs font-mono">
                <FieldReference type={selectedType as SectionType} />
              </div>
            </details>

            <div className="flex items-center justify-end gap-3">
              <Link
                href={`/admin/paginas/${pageId}`}
                className="px-4 py-2.5 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="inline-flex items-center rounded-[var(--radius-md)] bg-[var(--color-brand-blue)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-blue)] hover:bg-[var(--color-brand-blue-hover)] transition-colors"
              >
                Adicionar seção →
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function FieldReference({ type }: { type: SectionType }) {
  const refs: Record<SectionType, string[]> = {
    hero: [
      'title — texto principal (obrigatório)',
      'subtitle — texto complementar',
      'variant — "dark" | "canvas" | "blue"',
      'cta_label / cta_url — botão principal',
      'cta_secondary_label / cta_secondary_url — botão secundário',
      'show_360_animation — true | false',
      'align — "left" | "center" | "right"',
      'bg_image — URL da imagem de fundo',
    ],
    text: [
      'title — título (opcional)',
      'body — texto em markdown (obrigatório)',
      'align — "left" | "center" | "right"',
      'max_width — "sm" | "md" | "lg" | "full"',
      'bg — "white" | "canvas" | "ink"',
      'badge / badge_color — "blue" | "gold" | "stone"',
    ],
    cards: [
      'title / subtitle — cabeçalho da seção',
      'columns — 2 | 3 | 4',
      'bg — "white" | "canvas" | "ink"',
      'card_style — "shadow" | "bordered" | "flat"',
      'cards — array de {icon, title, description, link_url?, link_label?, badge?}',
    ],
    ferramentas: [
      'capitulo_inicial — 1-10 (filtra por capítulo)',
      'mostrar_todos — true | false',
      'layout — "grid" | "list"',
      'mostrar_cta_codigo — true | false',
      'cta_codigo_titulo / cta_codigo_descricao — texto do CTA de código',
    ],
    form: [
      'title / subtitle — cabeçalho',
      'bg — "white" | "canvas" | "blue"',
      'layout — "centered" | "side-by-side"',
      'submit_label — texto do botão',
      'success_title / success_message — mensagem de sucesso',
      'redirect_url — redirecionar após envio (opcional)',
      'fields — array de {field_key, label, type, required, placeholder, options?}',
      '  type: "text" | "email" | "tel" | "textarea" | "select" | "checkbox"',
    ],
    faq: [
      'title / subtitle — cabeçalho',
      'bg — "white" | "canvas"',
      'layout — "single" | "two-columns"',
      'badge / badge_color — "blue" | "gold" | "stone"',
      'items — array de {question, answer, open_by_default?}',
    ],
    cta: [
      'title — texto principal (obrigatório)',
      'subtitle / body — textos complementares',
      'cta_text / cta_href — botão principal (obrigatório)',
      'cta_secondary_label / cta_secondary_url — botão secundário',
      'background — "blue" | "gold" | "ink" | "canvas"',
      'align — "left" | "center"',
      'image_url / image_alt / image_side — imagem lateral',
    ],
    depoimentos: [
      'title / subtitle — cabeçalho',
      'source — "manual" (use items) | "supabase" (busca do banco)',
      'layout — "grid" | "carousel" | "masonry"',
      'columns — 2 | 3',
      'bg — "white" | "canvas" | "ink"',
      'limit — número máximo (quando source = supabase)',
      'items — array de {nome, cargo?, empresa?, texto, foto_url?, nota?}',
    ],
    capitulos: [
      'title / subtitle — cabeçalho',
      'bg — "white" | "canvas"',
      'layout — "grid" | "numbered-list"',
      'link_para_ferramenta — true | false',
    ],
    autores: [
      'title / subtitle — cabeçalho',
      'bg — "white" | "canvas"',
      'layout — "side-by-side" | "stacked"',
      'autores — array de {nome, cargo, bio, foto_url, linkedin_url?, instagram_url?, site_url?}',
    ],
  }

  return (
    <>
      {refs[type]?.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </>
  )
}
