import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/Badge'
import { seedPaginas } from '@/lib/paginas/actions'

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const [
    { count: totalLeads },
    { count: paginasPublicadas },
    { data: pages },
  ] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('pages').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase
      .from('pages')
      .select('id, slug, title, status, updated_at')
      .order('updated_at', { ascending: false }),
  ])

  const stats = [
    { label: 'Total de leads', value: totalLeads ?? 0, color: 'text-brand-blue', href: '/admin/leads' },
    { label: 'Páginas publicadas', value: paginasPublicadas ?? 0, color: 'text-brand-gold', href: '/admin/paginas' },
  ]

  return (
    <div className="space-y-8">
      <h1 className="font-display font-black text-2xl text-[var(--color-text-title)]">
        Dashboard
      </h1>

      {params.success === 'seed-ok' && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-[var(--radius-md)]">
          Páginas iniciais criadas com sucesso. Edite cada uma para adicionar conteúdo.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(({ label, value, color, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)] border border-[var(--color-border)] hover:shadow-[var(--shadow-md)] transition-shadow"
          >
            <p className="text-sm text-[var(--color-text-muted)] mb-1">{label}</p>
            <p className={`font-display font-black text-4xl ${color}`}>{value}</p>
          </Link>
        ))}
      </div>

      {/* Páginas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-[var(--color-text-title)]">
            Páginas
          </h2>
          <Link
            href="/admin/paginas/nova"
            className="text-sm font-semibold text-[var(--color-brand-blue)] hover:underline"
          >
            + Nova página
          </Link>
        </div>

        <div className="bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--color-border)] overflow-hidden">
          {!pages || pages.length === 0 ? (
            <div className="p-8 text-center space-y-4">
              <p className="text-sm text-[var(--color-text-muted)]">Nenhuma página criada ainda.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <form action={seedPaginas}>
                  <button
                    type="submit"
                    className="text-sm font-semibold bg-[var(--color-brand-blue)] text-white px-4 py-2 rounded-[var(--radius-md)] hover:opacity-90 transition-opacity"
                  >
                    Criar páginas iniciais do site
                  </button>
                </form>
                <Link
                  href="/admin/paginas/nova"
                  className="text-sm font-semibold text-[var(--color-brand-blue)] hover:underline"
                >
                  Ou criar página manualmente →
                </Link>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                Cria: Home, Método, Sobre, Mentoria e Livro (todas como rascunho)
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-canvas)]">
                  <th className="text-left px-6 py-3 font-semibold text-[var(--color-text-muted)] uppercase text-xs tracking-wider">Título</th>
                  <th className="text-left px-6 py-3 font-semibold text-[var(--color-text-muted)] uppercase text-xs tracking-wider">Slug</th>
                  <th className="text-left px-6 py-3 font-semibold text-[var(--color-text-muted)] uppercase text-xs tracking-wider">Status</th>
                  <th className="text-right px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-[var(--color-bg-canvas)] transition-colors">
                    <td className="px-6 py-3">
                      <span className="font-semibold text-[var(--color-text-title)]">{page.title}</span>
                    </td>
                    <td className="px-6 py-3">
                      <code className="text-xs bg-[var(--color-bg-canvas)] px-2 py-1 rounded text-[var(--color-text-body)]">
                        /{page.slug}
                      </code>
                    </td>
                    <td className="px-6 py-3">
                      <Badge variant={page.status === 'published' ? 'success' : 'stone'}>
                        {page.status === 'published' ? 'Publicada' : 'Rascunho'}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Link
                        href={`/admin/paginas/${page.id}`}
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
    </div>
  )
}
