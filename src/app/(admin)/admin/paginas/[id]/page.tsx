import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/Badge'
import {
  updatePageMeta,
  togglePageStatus,
  deletePage,
  deleteSectionAction,
  toggleSectionVisibility,
  moveSectionUp,
  moveSectionDown,
} from '@/lib/paginas/actions'
import type { SectionType, SectionContent } from '@/types/cms'

const TYPE_LABELS: Record<SectionType, string> = {
  hero: 'Hero',
  text: 'Texto',
  cards: 'Cards',
  ferramentas: 'Ferramentas',
  form: 'Formulário',
  faq: 'FAQ',
  cta: 'CTA',
  depoimentos: 'Depoimentos',
  capitulos: 'Capítulos',
  autores: 'Autores',
}

function sectionPreview(type: SectionType, content: SectionContent): string {
  const c = content as Record<string, unknown>
  const title = typeof c.title === 'string' ? c.title : null
  switch (type) {
    case 'hero':
      return title ?? 'Hero sem título'
    case 'text':
      return title ?? (typeof c.body === 'string' ? c.body.slice(0, 60) + '…' : 'Texto')
    case 'cards':
      return title ?? `${Array.isArray(c.cards) ? c.cards.length : 0} cards`
    case 'ferramentas':
      return title ?? (c.capitulo_inicial ? `Capítulo ${c.capitulo_inicial}` : 'Todas as ferramentas')
    case 'form':
      return title ?? `${Array.isArray(c.fields) ? c.fields.length : 0} campos`
    case 'faq':
      return title ?? `${Array.isArray(c.items) ? c.items.length : 0} perguntas`
    case 'cta':
      return title ?? (typeof c.cta_text === 'string' ? c.cta_text : 'CTA')
    case 'depoimentos':
      return title ?? 'Depoimentos'
    case 'capitulos':
      return title ?? '10 capítulos'
    case 'autores':
      return title ?? `${Array.isArray(c.autores) ? c.autores.length : 0} autores`
    default:
      return title ?? type
  }
}

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ success?: string; error?: string }>
}

export default async function PageEditorPage({ params, searchParams }: Props) {
  const { id } = await params
  const { success, error } = await searchParams
  const supabase = await createClient()

  const [{ data: page }, { data: sections }] = await Promise.all([
    supabase.from('pages').select('*').eq('id', id).single(),
    supabase
      .from('page_sections')
      .select('*')
      .eq('page_id', id)
      .order('order_index', { ascending: true }),
  ])

  if (!page) notFound()

  const updateMeta = updatePageMeta.bind(null, id)
  const toggleStatus = togglePageStatus.bind(null, id, page.status)
  const deleteThisPage = deletePage.bind(null, id)

  return (
    <div className="max-w-3xl">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/paginas"
          className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]"
        >
          ← Páginas
        </Link>
        <span className="text-[var(--color-border)]">/</span>
        <h1 className="font-display font-black text-2xl text-[var(--color-text-title)] truncate">
          {page.title}
        </h1>
        <Badge variant={page.status === 'published' ? 'success' : 'stone'}>
          {page.status === 'published' ? 'Publicada' : 'Rascunho'}
        </Badge>
      </div>

      {/* Feedback */}
      {success && (
        <div className="mb-6 rounded-[var(--radius-md)] bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          {success === 'pagina-publicada' && 'Página publicada com sucesso!'}
          {success === 'pagina-despublicada' && 'Página voltou para rascunho.'}
          {success === 'dados-salvos' && 'Dados atualizados!'}
          {success === 'secao-adicionada' && 'Seção adicionada com sucesso!'}
          {success === 'secao-atualizada' && 'Seção atualizada!'}
          {success === 'secao-removida' && 'Seção removida.'}
          {success === 'pagina-criada' && 'Página criada! Agora adicione as seções.'}
        </div>
      )}
      {error && (
        <div className="mb-6 rounded-[var(--radius-md)] bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      )}

      {/* Ações da página */}
      <div className="flex items-center justify-end gap-2 mb-6">
        <a
          href={`/${page.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-body)] border border-[var(--color-border)] rounded-[var(--radius-md)]"
        >
          Visualizar →
        </a>
        <form action={toggleStatus}>
          <button
            type="submit"
            className={`px-4 py-2 text-sm font-semibold rounded-[var(--radius-md)] transition-colors ${
              page.status === 'published'
                ? 'bg-[var(--color-bg-canvas)] border border-[var(--color-border)] text-[var(--color-text-body)] hover:bg-[var(--color-border)]'
                : 'bg-[var(--color-brand-blue)] text-white shadow-[var(--shadow-blue)] hover:bg-[var(--color-brand-blue-hover)]'
            }`}
          >
            {page.status === 'published' ? 'Despublicar' : 'Publicar'}
          </button>
        </form>
        <form
          action={deleteThisPage}
          onSubmit={undefined}
        >
          <button
            type="submit"
            className="px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-[var(--radius-md)] hover:bg-red-50"
            aria-label="Deletar página"
          >
            Deletar
          </button>
        </form>
      </div>

      {/* Metadados da página */}
      <details className="mb-8 bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--color-border)]">
        <summary className="px-6 py-4 cursor-pointer text-sm font-semibold text-[var(--color-text-body)] select-none hover:text-[var(--color-text-title)]">
          Dados da página (slug, SEO)
        </summary>
        <form action={updateMeta} className="px-6 pb-6 pt-2 space-y-4 border-t border-[var(--color-border)]">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Título
            </label>
            <input
              name="title"
              defaultValue={page.title}
              required
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-title)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Descrição (SEO)
            </label>
            <textarea
              name="description"
              defaultValue={page.description ?? ''}
              rows={2}
              maxLength={160}
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-title)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              OG Image (URL)
            </label>
            <input
              name="og_image"
              defaultValue={page.og_image ?? ''}
              type="url"
              placeholder="https://..."
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-title)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent"
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-[var(--color-text-muted)]">
              Slug: <code className="bg-[var(--color-bg-canvas)] px-1.5 py-0.5 rounded text-xs">/{page.slug}</code>
            </p>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold bg-[var(--color-brand-blue)] text-white rounded-[var(--radius-md)] hover:bg-[var(--color-brand-blue-hover)] transition-colors"
            >
              Salvar dados
            </button>
          </div>
        </form>
      </details>

      {/* Lista de seções */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-[var(--color-text-title)]">
            Seções{' '}
            <span className="font-body font-normal text-sm text-[var(--color-text-muted)]">
              ({sections?.length ?? 0})
            </span>
          </h2>
          <Link
            href={`/admin/paginas/${id}/secoes/nova`}
            className="inline-flex items-center rounded-[var(--radius-md)] bg-[var(--color-brand-blue)] px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow-blue)] hover:bg-[var(--color-brand-blue-hover)] transition-colors"
          >
            + Adicionar seção
          </Link>
        </div>

        {!sections || sections.length === 0 ? (
          <div className="bg-white rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-12 text-center">
            <p className="text-sm text-[var(--color-text-muted)] mb-3">
              Esta página ainda não tem seções.
            </p>
            <Link
              href={`/admin/paginas/${id}/secoes/nova`}
              className="text-sm font-semibold text-[var(--color-brand-blue)] hover:underline"
            >
              Adicionar primeira seção →
            </Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {sections.map((section, idx) => {
              const preview = sectionPreview(
                section.type as SectionType,
                section.content as SectionContent,
              )
              const deleteSection = deleteSectionAction.bind(null, section.id, id)
              const toggleVisible = toggleSectionVisibility.bind(
                null,
                section.id,
                section.visible,
                id,
              )
              const moveUp = moveSectionUp.bind(null, section.id, id)
              const moveDown = moveSectionDown.bind(null, section.id, id)

              return (
                <li
                  key={section.id}
                  className={`bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-xs)] transition-opacity ${
                    !section.visible ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 px-4 py-3">
                    {/* Tipo badge */}
                    <span className="shrink-0 inline-flex items-center rounded-[var(--radius-sm)] bg-[var(--color-bg-canvas)] border border-[var(--color-border)] px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                      {TYPE_LABELS[section.type as SectionType] ?? section.type}
                    </span>

                    {/* Preview */}
                    <span className="flex-1 text-sm text-[var(--color-text-body)] truncate">
                      {preview}
                    </span>

                    {!section.visible && (
                      <span className="text-xs text-[var(--color-text-muted)]">oculta</span>
                    )}

                    {/* Ações */}
                    <div className="shrink-0 flex items-center gap-1">
                      {/* Mover */}
                      <form action={moveUp}>
                        <button
                          type="submit"
                          disabled={idx === 0}
                          aria-label="Mover para cima"
                          className="w-7 h-7 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-body)] disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ↑
                        </button>
                      </form>
                      <form action={moveDown}>
                        <button
                          type="submit"
                          disabled={idx === (sections?.length ?? 0) - 1}
                          aria-label="Mover para baixo"
                          className="w-7 h-7 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-body)] disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ↓
                        </button>
                      </form>

                      {/* Visibilidade */}
                      <form action={toggleVisible}>
                        <button
                          type="submit"
                          aria-label={section.visible ? 'Ocultar seção' : 'Mostrar seção'}
                          className="w-7 h-7 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]"
                          title={section.visible ? 'Ocultar' : 'Mostrar'}
                        >
                          {section.visible ? '👁' : '🚫'}
                        </button>
                      </form>

                      {/* Editar */}
                      <Link
                        href={`/admin/paginas/${id}/secoes/${section.id}`}
                        className="px-3 py-1 text-xs font-semibold text-[var(--color-brand-blue)] border border-[var(--color-brand-blue)]/20 rounded hover:bg-[var(--color-brand-blue)]/5 transition-colors"
                      >
                        Editar
                      </Link>

                      {/* Deletar */}
                      <form action={deleteSection}>
                        <button
                          type="submit"
                          aria-label="Remover seção"
                          className="w-7 h-7 flex items-center justify-center text-red-400 hover:text-red-600"
                          title="Remover"
                        >
                          ✕
                        </button>
                      </form>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
