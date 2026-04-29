import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updateSection } from '@/lib/paginas/actions'
import { SECTION_TYPE_LABELS } from '@/lib/cms/section-builder'
import { SectionContentForm } from '@/components/forms/SectionContentForm'
import type { SectionContent, SectionType } from '@/types/cms'

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

  const sectionType = section.type as SectionType
  const typeLabel = SECTION_TYPE_LABELS[sectionType] ?? section.type

  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <Link
          href="/admin/paginas"
          className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]"
        >
          Voltar para paginas
        </Link>
        <span className="text-[var(--color-border)]">/</span>
        <Link
          href={`/admin/paginas/${pageId}`}
          className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]"
        >
          Editor
        </Link>
        <span className="text-[var(--color-border)]">/</span>
        <h1 className="font-display text-2xl font-black text-[var(--color-text-title)]">
          Editar modulo - {typeLabel}
        </h1>
      </div>

      {error && (
        <div className="mb-6 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      )}

      <SectionContentForm
        action={updateSection}
        type={sectionType}
        pageId={pageId}
        sectionId={sectionId}
        content={section.content as SectionContent}
        submitLabel="Salvar modulo"
        cancelHref={`/admin/paginas/${pageId}`}
      />
    </div>
  )
}
