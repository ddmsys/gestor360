import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FerramentaForm } from '@/components/forms/FerramentaForm'
import { deleteFerramenta, updateFerramenta } from '@/lib/ferramentas/actions'
import { createClient } from '@/lib/supabase/server'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}

interface FerramentaEditRow {
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
}

export default async function EditarFerramentaPage({
  params,
  searchParams,
}: PageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams])
  const supabase = await createClient()
  const { data: ferramenta, error } = await supabase
    .from('ferramentas')
    .select('id, numero, nome, descricao, capitulo, arquivo_path, acesso, ativo, tipo, status, ordem, imagem_url, cor')
    .eq('id', id)
    .single<FerramentaEditRow>()

  if (error || !ferramenta) {
    notFound()
  }

  const updateAction = updateFerramenta.bind(null, ferramenta.id)
  const deleteAction = deleteFerramenta.bind(null, ferramenta.id)

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/ferramentas"
        className="mb-6 inline-block text-sm font-semibold text-brand-blue hover:underline"
      >
        ← Voltar para ferramentas
      </Link>

      {query.error && (
        <p className="mb-4 rounded-[var(--radius-md)] border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
          {decodeURIComponent(query.error)}
        </p>
      )}

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-brand-gold">
              Editar registro
            </p>
            <h1 className="font-display text-2xl font-black text-[var(--color-text-title)]">
              {ferramenta.nome}
            </h1>
            <p className="mt-2 text-sm leading-[var(--leading-relaxed)] text-[var(--color-text-muted)]">
              Atualize metadados, arquivo, imagem e status de publicação.
            </p>
          </div>

          <form action={deleteAction}>
            <button
              type="submit"
              className="rounded-[var(--radius-md)] border border-error/20 px-4 py-2 text-sm font-semibold text-error transition-colors hover:bg-error/10"
            >
              Excluir
            </button>
          </form>
        </div>

        <FerramentaForm
          action={updateAction}
          ferramenta={ferramenta}
          submitLabel="Salvar alterações"
        />
      </div>
    </div>
  )
}
