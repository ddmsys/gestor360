import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { createClient } from '@/lib/supabase/server'
import {
  getCapituloLabel,
  getStatusLabel,
  getTipoLabel,
} from '@/lib/ferramentas/constants'

interface PageProps {
  searchParams: Promise<{ success?: string; error?: string }>
}

interface FerramentaRow {
  id: string
  numero: number
  nome: string
  descricao: string | null
  capitulo: number
  arquivo_path: string | null
  acesso: string | null
  ativo: boolean | null
  tipo: string | null
  status: string | null
  ordem: number | null
  imagem_url: string | null
  cor: string | null
  updated_at: string | null
}

const successMessages: Record<string, string> = {
  'ferramenta-criada': 'Ferramenta criada como rascunho.',
  'ferramenta-atualizada': 'Ferramenta atualizada.',
  'ferramenta-removida': 'Ferramenta removida.',
}

export default async function FerramentasPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: ferramentas, error } = await supabase
    .from('ferramentas')
    .select('id, numero, nome, descricao, capitulo, arquivo_path, acesso, ativo, tipo, status, ordem, imagem_url, cor, updated_at')
    .order('capitulo', { ascending: true })
    .order('ordem', { ascending: true })
    .order('numero', { ascending: true })
    .returns<FerramentaRow[]>()

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-[var(--color-text-title)]">
            Ferramentas
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Cadastre o kit completo e as ferramentas individuais do livro.
          </p>
        </div>
        <Link
          href="/admin/ferramentas/nova"
          className="inline-flex min-h-[var(--touch-target-min)] items-center justify-center rounded-[var(--radius-md)] bg-brand-blue px-6 text-base font-semibold text-white shadow-[var(--shadow-blue)] transition-colors duration-[var(--transition-fast)] hover:bg-[var(--color-brand-blue-hover)]"
        >
          + Nova ferramenta
        </Link>
      </div>

      {params.success && successMessages[params.success] && (
        <p className="mb-4 rounded-[var(--radius-md)] border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">
          {successMessages[params.success]}
        </p>
      )}

      {params.error && (
        <p className="mb-4 rounded-[var(--radius-md)] border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
          {decodeURIComponent(params.error)}
        </p>
      )}

      {error && (
        <div className="rounded-[var(--radius-lg)] border border-error/20 bg-white p-6 shadow-[var(--shadow-sm)]">
          <p className="font-semibold text-error">Não foi possível carregar as ferramentas.</p>
          <p className="mt-2 text-sm leading-[var(--leading-relaxed)] text-[var(--color-text-body)]">
            {error.message}
          </p>
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">
            Verifique se o SQL em <code>docs/database/ferramentas-admin.sql</code> já foi aplicado no Supabase.
          </p>
        </div>
      )}

      {!error && (!ferramentas || ferramentas.length === 0) && (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-12 text-center shadow-[var(--shadow-sm)]">
          <p className="font-display text-2xl font-black text-[var(--color-text-title)]">
            Nenhuma ferramenta cadastrada ainda.
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-[var(--leading-relaxed)] text-[var(--color-text-muted)]">
            Crie os registros agora como rascunho. Os arquivos podem ser vinculados depois, quando os PDFs e o ZIP final estiverem prontos.
          </p>
          <Link
            href="/admin/ferramentas/nova"
            className="mt-6 inline-flex min-h-[var(--touch-target-min)] items-center justify-center rounded-[var(--radius-md)] bg-brand-blue px-6 text-base font-semibold text-white shadow-[var(--shadow-blue)] transition-colors duration-[var(--transition-fast)] hover:bg-[var(--color-brand-blue-hover)]"
          >
            Criar primeira ferramenta
          </Link>
        </div>
      )}

      {!error && ferramentas && ferramentas.length > 0 && (
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-canvas)]">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Ferramenta
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Capítulo
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Arquivo
                </th>
                <th className="px-6 py-3 text-right" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {ferramentas.map((ferramenta) => (
                <tr key={ferramenta.id} className="transition-colors hover:bg-[var(--color-bg-canvas)]">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="mt-0.5 h-10 w-10 shrink-0 rounded-[var(--radius-md)] border border-[var(--color-border)]"
                        style={{ backgroundColor: ferramenta.cor || '#E8E6E1' }}
                        aria-hidden="true"
                      />
                      <div>
                        <p className="font-semibold text-[var(--color-text-title)]">
                          F{String(ferramenta.numero).padStart(2, '0')} - {ferramenta.nome}
                        </p>
                        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                          {getTipoLabel(ferramenta.tipo)} · {ferramenta.acesso === 'codigo_livro' ? 'Código do livro' : 'Gratuito'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-body)]">
                    {getCapituloLabel(ferramenta.capitulo)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusLabel(ferramenta.status, ferramenta.ativo) === 'Publicado' ? 'success' : 'stone'}>
                      {getStatusLabel(ferramenta.status, ferramenta.ativo)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {ferramenta.arquivo_path ? (
                      <code className="rounded-[var(--radius-sm)] bg-[var(--color-bg-canvas)] px-2 py-1 text-xs text-[var(--color-text-body)]">
                        {ferramenta.arquivo_path}
                      </code>
                    ) : (
                      <span className="text-xs text-[var(--color-text-muted)]">Pendente</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {ferramenta.arquivo_path && (
                        <a
                          href={`/api/ferramentas/${ferramenta.id}/download`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-[var(--color-text-muted)] hover:text-brand-blue"
                        >
                          Baixar
                        </a>
                      )}
                      <Link
                        href={`/admin/ferramentas/${ferramenta.id}`}
                        className="text-xs font-semibold text-brand-blue hover:underline"
                      >
                        Editar
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
