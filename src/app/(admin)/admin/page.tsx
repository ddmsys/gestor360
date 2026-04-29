import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/Badge'

export default async function AdminDashboard() {
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
      <h1 className="font-display font-black text-[var(--text-heading)] text-[var(--color-text-title)]">
        Dashboard
      </h1>

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
            <div className="p-8 text-center">
              <p className="text-sm text-[var(--color-text-muted)] mb-3">Nenhuma página criada ainda.</p>
              <Link href="/admin/paginas/nova" className="text-sm font-semibold text-[var(--color-brand-blue)] hover:underline">
                Criar primeira página →
              </Link>
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
