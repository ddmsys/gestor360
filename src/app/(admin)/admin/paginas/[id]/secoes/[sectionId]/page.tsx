import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updateSection } from '@/lib/paginas/actions'
import type { SectionType } from '@/types/cms'

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

interface Props {
  params: Promise<{ id: string; sectionId: string }>
  searchParams: Promise<{ error?: string }>
}

export default async function EditSectionPage({ params, searchParams }: Props) {
  const { id: pageId, sectionId } = await params
  const { error } = await searchParams
  const supabase = await createClient()

  const { data: section } = await supabase
    .from('page_sections')
    .select('*')
    .eq('id', sectionId)
    .eq('page_id', pageId)
    .single()

  if (!section) notFound()

  const typeLabel = TYPE_LABELS[section.type as SectionType] ?? section.type
  const contentJson = JSON.stringify(section.content, null, 2)

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <Link
          href="/admin/paginas"
          className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]"
        >
          ← Páginas
        </Link>
        <span className="text-[var(--color-border)]">/</span>
        <Link
          href={`/admin/paginas/${pageId}`}
          className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]"
        >
          Editor
        </Link>
        <span className="text-[var(--color-border)]">/</span>
        <h1 className="font-display font-black text-2xl text-[var(--color-text-title)]">
          Editar — {typeLabel}
        </h1>
      </div>

      {error && (
        <div className="mb-6 rounded-[var(--radius-md)] bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      )}

      <form action={updateSection} className="space-y-4">
        <input type="hidden" name="section_id" value={sectionId} />
        <input type="hidden" name="page_id" value={pageId} />

        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg-canvas)] flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Conteúdo JSON — {typeLabel}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Edite os valores — mantenha a estrutura
            </p>
          </div>
          <textarea
            name="content_json"
            rows={24}
            required
            defaultValue={contentJson}
            spellCheck={false}
            className="w-full px-4 py-3 font-mono text-sm text-[var(--color-text-body)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-brand-blue)] resize-y"
            aria-label="Conteúdo da seção em JSON"
          />
        </div>

        <div className="flex items-center justify-between">
          <Link
            href={`/admin/paginas/${pageId}`}
            className="text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]"
          >
            ← Voltar ao editor
          </Link>
          <div className="flex items-center gap-3">
            <a
              href={`/admin/paginas/${pageId}/secoes/nova?type=${section.type}`}
              className="px-4 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]"
            >
              Ver template
            </a>
            <button
              type="submit"
              className="inline-flex items-center rounded-[var(--radius-md)] bg-[var(--color-brand-blue)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-blue)] hover:bg-[var(--color-brand-blue-hover)] transition-colors"
            >
              Salvar alterações →
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
