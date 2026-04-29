import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/Badge'

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('id, slug, title, status, published_at, updated_at')
    .order('updated_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl text-[var(--color-text-title)]">Blog</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {posts?.length ?? 0} post{posts?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/blog/novo"
          className="bg-[var(--color-brand-blue)] text-white text-sm font-semibold px-4 py-2 rounded-[var(--radius-md)] hover:opacity-90 transition-opacity"
        >
          + Novo post
        </Link>
      </div>

      {params.success && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-[var(--radius-md)]">
          {params.success === 'post-criado' && 'Post criado com sucesso.'}
          {params.success === 'post-atualizado' && 'Post atualizado com sucesso.'}
          {params.success === 'post-removido' && 'Post removido com sucesso.'}
        </div>
      )}

      {params.error && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3 rounded-[var(--radius-md)]">
          {decodeURIComponent(params.error)}
        </div>
      )}

      <div className="bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--color-border)] overflow-hidden">
        {!posts || posts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-[var(--color-text-muted)] mb-3">Nenhum post ainda.</p>
            <Link
              href="/admin/blog/novo"
              className="text-sm font-semibold text-[var(--color-brand-blue)] hover:underline"
            >
              Criar primeiro post →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-canvas)]">
                <th className="text-left px-6 py-3 font-semibold text-[var(--color-text-muted)] uppercase text-xs tracking-wider">
                  Título
                </th>
                <th className="text-left px-6 py-3 font-semibold text-[var(--color-text-muted)] uppercase text-xs tracking-wider">
                  Slug
                </th>
                <th className="text-left px-6 py-3 font-semibold text-[var(--color-text-muted)] uppercase text-xs tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 font-semibold text-[var(--color-text-muted)] uppercase text-xs tracking-wider">
                  Atualizado
                </th>
                <th className="text-right px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-[var(--color-bg-canvas)] transition-colors">
                  <td className="px-6 py-3 font-semibold text-[var(--color-text-title)]">
                    {post.title}
                  </td>
                  <td className="px-6 py-3">
                    <code className="text-xs bg-[var(--color-bg-canvas)] px-2 py-1 rounded text-[var(--color-text-body)]">
                      /blog/{post.slug}
                    </code>
                  </td>
                  <td className="px-6 py-3">
                    <Badge variant={post.status === 'published' ? 'success' : 'stone'}>
                      {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </Badge>
                  </td>
                  <td className="px-6 py-3 text-[var(--color-text-muted)]">
                    {new Date(post.updated_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-3 text-right flex items-center justify-end gap-3">
                    {post.status === 'published' && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-brand-blue)]"
                      >
                        Ver →
                      </Link>
                    )}
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="text-xs font-semibold text-[var(--color-brand-blue)] hover:underline"
                    >
                      Editar →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
