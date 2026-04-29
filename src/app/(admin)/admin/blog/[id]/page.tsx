import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updatePost, deletePost } from '@/lib/posts/actions'
import { Badge } from '@/components/ui/Badge'

export default async function EditBlogPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const { id } = await params
  const qp = await searchParams
  const supabase = await createClient()

  const { data: post } = await supabase.from('posts').select('*').eq('id', id).single()
  if (!post) notFound()

  const action = updatePost.bind(null, id)
  const deleteAction = deletePost.bind(null, id)

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/blog"
          className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]"
        >
          ← Blog
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="font-display font-black text-2xl text-[var(--color-text-title)]">
            {post.title}
          </h1>
          <Badge variant={post.status === 'published' ? 'success' : 'stone'}>
            {post.status === 'published' ? 'Publicado' : 'Rascunho'}
          </Badge>
        </div>
      </div>

      {qp.success && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-[var(--radius-md)]">
          Post atualizado com sucesso.
        </div>
      )}

      {qp.error && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3 rounded-[var(--radius-md)]">
          {decodeURIComponent(qp.error)}
        </div>
      )}

      <div className="bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--color-border)] p-6">
        <form action={action} className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_160px]">
            <div>
              <label className="block text-sm font-semibold text-[var(--color-text-title)] mb-1.5">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                required
                defaultValue={post.title}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm bg-white text-[var(--color-text-body)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]/30 focus:border-[var(--color-brand-blue)]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--color-text-title)] mb-1.5">
                Status
              </label>
              <select
                name="status"
                defaultValue={post.status}
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
              defaultValue={post.slug}
              pattern="[a-z0-9-]+"
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm bg-white text-[var(--color-text-body)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]/30 focus:border-[var(--color-brand-blue)]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--color-text-title)] mb-1.5">
              Resumo
            </label>
            <textarea
              name="excerpt"
              rows={2}
              defaultValue={post.excerpt ?? ''}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm bg-white text-[var(--color-text-body)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]/30 focus:border-[var(--color-brand-blue)] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--color-text-title)] mb-1.5">
              Imagem de capa (URL)
            </label>
            <input
              name="cover_url"
              defaultValue={post.cover_url ?? ''}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm bg-white text-[var(--color-text-body)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]/30 focus:border-[var(--color-brand-blue)]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--color-text-title)] mb-1.5">
              Conteúdo (Markdown) <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              required
              rows={24}
              defaultValue={post.content}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm bg-white text-[var(--color-text-body)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]/30 focus:border-[var(--color-brand-blue)] font-mono"
            />
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-5">
            <form action={deleteAction}>
              <button
                type="submit"
                className="text-sm font-semibold text-red-600 hover:underline"
                onClick={(e) => {
                  if (!confirm('Remover este post definitivamente?')) e.preventDefault()
                }}
              >
                Remover post
              </button>
            </form>

            <div className="flex gap-3">
              {post.status === 'published' && (
                <Link
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  className="px-4 py-2 text-sm font-semibold text-[var(--color-text-body)] border border-[var(--color-border)] rounded-[var(--radius-md)] hover:bg-[var(--color-bg-canvas)] transition-colors"
                >
                  Ver post →
                </Link>
              )}
              <button
                type="submit"
                className="px-4 py-2 text-sm font-semibold bg-[var(--color-brand-blue)] text-white rounded-[var(--radius-md)] hover:opacity-90 transition-opacity"
              >
                Salvar alterações
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
