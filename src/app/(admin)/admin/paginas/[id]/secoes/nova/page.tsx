import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createSection } from '@/lib/paginas/actions'
import {
  SECTION_TEMPLATES,
  SECTION_TYPES,
} from '@/lib/cms/section-builder'
import { SectionContentForm } from '@/components/forms/SectionContentForm'
import type { SectionType } from '@/types/cms'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ type?: string; error?: string }>
}

function isSectionType(type?: string): type is SectionType {
  return SECTION_TYPES.some((item) => item.type === type)
}

export default async function NovaSectionPage({ params, searchParams }: Props) {
  const { id: pageId } = await params
  const { type: selectedType, error } = await searchParams

  if (selectedType && !isSectionType(selectedType)) notFound()

  const validType = selectedType as SectionType | undefined
  const typeInfo = SECTION_TYPES.find((item) => item.type === validType)
  const template = validType ? SECTION_TEMPLATES[validType] : null

  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <Link href="/admin/paginas" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]">
          Voltar para paginas
        </Link>
        <span className="text-[var(--color-border)]">/</span>
        <Link href={`/admin/paginas/${pageId}`} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]">
          Editor
        </Link>
        <span className="text-[var(--color-border)]">/</span>
        <h1 className="font-display text-2xl font-black text-[var(--color-text-title)]">
          {typeInfo ? `Novo modulo - ${typeInfo.label}` : 'Escolher modulo'}
        </h1>
      </div>

      {error && (
        <div className="mb-6 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      )}

      {!selectedType && (
        <div className="space-y-5">
          <div>
            <p className="text-sm text-[var(--color-text-muted)]">
              Escolha um modulo pronto. Depois o conteudo sera preenchido por campos guiados, sem JSON.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SECTION_TYPES.map(({ type, label, desc, intent }) => (
              <Link
                key={type}
                href={`/admin/paginas/${pageId}/secoes/nova?type=${type}`}
                className="flex min-h-36 flex-col justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-xs)] transition-all hover:border-[var(--color-brand-blue)] hover:shadow-[var(--shadow-blue)]"
              >
                <span className="inline-flex w-fit rounded-[var(--radius-sm)] bg-[var(--color-bg-canvas)] px-2 py-1 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  {intent}
                </span>
                <span>
                  <span className="mt-4 block font-display text-base font-bold text-[var(--color-text-title)]">
                    {label}
                  </span>
                  <span className="mt-1 block text-sm text-[var(--color-text-muted)]">{desc}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {selectedType && template && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-[var(--color-text-muted)]">{typeInfo?.desc}</p>
            <Link
              href={`/admin/paginas/${pageId}/secoes/nova`}
              className="ml-auto text-sm font-semibold text-[var(--color-brand-blue)] hover:underline"
            >
              Trocar modulo
            </Link>
          </div>

          <SectionContentForm
            action={createSection}
            type={validType!}
            pageId={pageId}
            content={template}
            submitLabel="Adicionar modulo"
            cancelHref={`/admin/paginas/${pageId}`}
          />
        </div>
      )}
    </div>
  )
}
