import Link from 'next/link'
import { FerramentaForm } from '@/components/forms/FerramentaForm'
import { createFerramenta } from '@/lib/ferramentas/actions'

export default function NovaFerramentaPage() {
  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/ferramentas"
        className="mb-6 inline-block text-sm font-semibold text-brand-blue hover:underline"
      >
        ← Voltar para ferramentas
      </Link>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
        <div className="mb-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-brand-gold">
            Novo registro
          </p>
          <h1 className="font-display text-2xl font-black text-[var(--color-text-title)]">
            Criar ferramenta
          </h1>
          <p className="mt-2 text-sm leading-[var(--leading-relaxed)] text-[var(--color-text-muted)]">
            Pode cadastrar como rascunho agora e anexar o PDF ou ZIP depois.
          </p>
        </div>

        <FerramentaForm action={createFerramenta} submitLabel="Salvar ferramenta" />
      </div>
    </div>
  )
}
