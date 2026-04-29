import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/Badge'

const CAPITULOS = [
  { value: '', label: 'Todos os capítulos' },
  { value: '1', label: 'Cap. 1 — Planejamento' },
  { value: '2', label: 'Cap. 2 — Comunicação' },
  { value: '3', label: 'Cap. 3 — Delegação' },
  { value: '4', label: 'Cap. 4 — Mentalidade' },
  { value: '5', label: 'Cap. 5 — Finanças' },
  { value: '6', label: 'Cap. 6 — Marketing/Vendas' },
  { value: '7', label: 'Cap. 7 — Gestão de Pessoas' },
  { value: '8', label: 'Cap. 8 — Riscos/Decisão' },
  { value: '9', label: 'Cap. 9 — Autoaprendizado' },
  { value: '10', label: 'Cap. 10 — Indicadores' },
]

interface Props {
  searchParams: Promise<{ capitulo?: string; page?: string }>
}

const PAGE_SIZE = 50

export default async function LeadsPage({ searchParams }: Props) {
  const { capitulo, page: pageParam } = await searchParams
  const currentPage = Math.max(1, Number(pageParam ?? 1))
  const offset = (currentPage - 1) * PAGE_SIZE

  const supabase = await createClient()

  let query = supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  if (capitulo) {
    query = query.eq('capitulo_origem', Number(capitulo))
  }

  const { data: leads, count } = await query

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)
  const capLabel = CAPITULOS.find((c) => c.value === (capitulo ?? ''))?.label ?? 'Todos os capítulos'

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-2xl text-[var(--color-text-title)]">
            Leads
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            {count ?? 0} {(count ?? 0) === 1 ? 'lead capturado' : 'leads capturados'} · {capLabel}
          </p>
        </div>

        <a
          href={`/api/admin/leads/export${capitulo ? `?capitulo=${capitulo}` : ''}`}
          className="inline-flex items-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-text-body)] shadow-[var(--shadow-xs)] hover:bg-[var(--color-bg-canvas)] transition-colors"
        >
          Exportar CSV ↓
        </a>
      </div>

      {/* Filtros por capítulo */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CAPITULOS.map(({ value, label }) => {
          const isActive = (capitulo ?? '') === value
          const href = value ? `/admin/leads?capitulo=${value}` : '/admin/leads'
          return (
            <a
              key={value}
              href={href}
              className={`px-3 py-1.5 text-xs font-semibold rounded-[var(--radius-full)] transition-colors ${
                isActive
                  ? 'bg-[var(--color-brand-blue)] text-white'
                  : 'bg-white border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-body)] hover:border-[var(--color-brand-blue)]/40'
              }`}
            >
              {label}
            </a>
          )
        })}
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--color-border)] overflow-x-auto">
        {!leads || leads.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-[var(--color-text-muted)]">
              {capitulo ? 'Nenhum lead deste capítulo ainda.' : 'Nenhum lead capturado ainda.'}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-canvas)]">
                <th className="text-left px-4 py-3 font-semibold text-[var(--color-text-muted)] uppercase text-xs tracking-wider">
                  Nome
                </th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--color-text-muted)] uppercase text-xs tracking-wider">
                  E-mail
                </th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--color-text-muted)] uppercase text-xs tracking-wider">
                  WhatsApp
                </th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--color-text-muted)] uppercase text-xs tracking-wider">
                  Capítulo
                </th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--color-text-muted)] uppercase text-xs tracking-wider">
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-[var(--color-bg-canvas)] transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-[var(--color-text-title)]">
                      {lead.nome}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-body)]">
                    <a
                      href={`mailto:${lead.email}`}
                      className="hover:text-[var(--color-brand-blue)] hover:underline"
                    >
                      {lead.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)]">
                    {lead.whatsapp ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    {lead.capitulo_origem ? (
                      <Badge variant="blue">Cap. {lead.capitulo_origem}</Badge>
                    ) : (
                      <span className="text-[var(--color-text-muted)]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)]">
                    {new Date(lead.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {currentPage > 1 && (
            <a
              href={`/admin/leads?page=${currentPage - 1}${capitulo ? `&capitulo=${capitulo}` : ''}`}
              className="px-3 py-1.5 text-sm font-medium text-[var(--color-text-muted)] border border-[var(--color-border)] rounded-[var(--radius-md)] hover:bg-[var(--color-bg-canvas)]"
            >
              ← Anterior
            </a>
          )}
          <span className="text-sm text-[var(--color-text-muted)]">
            Página {currentPage} de {totalPages}
          </span>
          {currentPage < totalPages && (
            <a
              href={`/admin/leads?page=${currentPage + 1}${capitulo ? `&capitulo=${capitulo}` : ''}`}
              className="px-3 py-1.5 text-sm font-medium text-[var(--color-text-muted)] border border-[var(--color-border)] rounded-[var(--radius-md)] hover:bg-[var(--color-bg-canvas)]"
            >
              Próxima →
            </a>
          )}
        </div>
      )}
    </div>
  )
}
