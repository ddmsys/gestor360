import Link from 'next/link'
import { createPost } from '@/lib/posts/actions'

export default async function NovoBlogPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/blog"
          className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]"
        >
          ← Blog
        </Link>
        <h1 className="font-display font-black text-2xl text-[var(--color-text-title)]">
          Novo post
        </h1>
      </div>

      {params.error && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3 rounded-[var(--radius-md)]">
          {decodeURIComponent(params.error)}
        </div>
      )}

      <div className="bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--color-border)] p-6">
        <PostForm action={createPost} submitLabel="Criar post" />
      </div>
    </div>
  )
}

function PostForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>
  defaultValues?: {
    slug?: string
    title?: string
    excerpt?: string
    content?: string
    cover_url?: string
    status?: string
  }
  submitLabel: string
}) {
  return (
    <form action={action} className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_160px]">
        <div>
          <label className="block text-sm font-semibold text-[var(--color-text-title)] mb-1.5">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            required
            defaultValue={defaultValues?.title ?? ''}
            placeholder="Como liderar com consciência"
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm bg-white text-[var(--color-text-body)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]/30 focus:border-[var(--color-brand-blue)]"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[var(--color-text-title)] mb-1.5">
            Status
          </label>
          <select
            name="status"
            defaultValue={defaultValues?.status ?? 'draft'}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm bg-white text-[var(--color-text-body)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]/30 focus:border-[var(--color-brand-blue)]"
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[var(--color-text-title)] mb-1.5">
          Slug <span className="text-red-500">*</span>
        </label>
        <input
          name="slug"
          required
          defaultValue={defaultValues?.slug ?? ''}
          placeholder="como-liderar-com-consciencia"
          pattern="[a-z0-9-]+"
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm bg-white text-[var(--color-text-body)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]/30 focus:border-[var(--color-brand-blue)]"
        />
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          Somente letras minúsculas, números e hifens. Aparece em /blog/slug.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[var(--color-text-title)] mb-1.5">
          Resumo
        </label>
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={defaultValues?.excerpt ?? ''}
          placeholder="Uma frase que resume o post para os cards e SEO."
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm bg-white text-[var(--color-text-body)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]/30 focus:border-[var(--color-brand-blue)] resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[var(--color-text-title)] mb-1.5">
          Imagem de capa (URL)
        </label>
        <input
          name="cover_url"
          defaultValue={defaultValues?.cover_url ?? ''}
          placeholder="/blog/capa-post.jpg"
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm bg-white text-[var(--color-text-body)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]/30 focus:border-[var(--color-brand-blue)]"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[var(--color-text-title)] mb-1.5">
          Conteúdo (Markdown) <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-[var(--color-text-muted)] mb-2">
          Use # para título, ## para subtítulo, **negrito**, *itálico*, - para listas, [link](url).
        </p>
        <textarea
          name="content"
          required
          rows={20}
          defaultValue={defaultValues?.content ?? ''}
          placeholder="## Introdução&#10;&#10;Escreva seu conteúdo aqui em Markdown..."
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm bg-white text-[var(--color-text-body)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]/30 focus:border-[var(--color-brand-blue)] font-mono"
        />
      </div>

      <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-5">
        <Link
          href="/admin/blog"
          className="px-4 py-2 text-sm font-semibold text-[var(--color-text-body)] border border-[var(--color-border)] rounded-[var(--radius-md)] hover:bg-[var(--color-bg-canvas)] transition-colors"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-semibold bg-[var(--color-brand-blue)] text-white rounded-[var(--radius-md)] hover:opacity-90 transition-opacity"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
