import Link from 'next/link'
import { createPage } from '@/lib/paginas/actions'

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function NovaPaginaPage({ searchParams }: Props) {
  const { error } = await searchParams

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/paginas"
          className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]"
        >
          ← Páginas
        </Link>
        <span className="text-[var(--color-border)]">/</span>
        <h1 className="font-display font-black text-2xl text-[var(--color-text-title)]">
          Nova página
        </h1>
      </div>

      {error && (
        <div className="mb-6 rounded-[var(--radius-md)] bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      )}

      <form action={createPage} className="space-y-5 bg-white rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)] border border-[var(--color-border)]">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-[var(--color-text-body)] mb-1.5">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="ex: Home, Sobre o Método, Mentoria"
            className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2.5 text-sm text-[var(--color-text-title)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-semibold text-[var(--color-text-body)] mb-1.5">
            Slug (URL) <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--color-text-muted)]">gestor360.com/</span>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              placeholder="ex: sobre, metodo, mentoria"
              className="flex-1 rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2.5 text-sm text-[var(--color-text-title)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent"
            />
          </div>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            Use apenas letras minúsculas, números e hífens. Ex: sobre-o-metodo
          </p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-[var(--color-text-body)] mb-1.5">
            Descrição (SEO)
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Descrição para mecanismos de busca (160 caracteres)"
            maxLength={160}
            className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2.5 text-sm text-[var(--color-text-title)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-transparent resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--color-border)]">
          <Link
            href="/admin/paginas"
            className="px-4 py-2.5 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="inline-flex items-center rounded-[var(--radius-md)] bg-[var(--color-brand-blue)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-blue)] hover:bg-[var(--color-brand-blue-hover)] transition-colors duration-[var(--transition-fast)]"
          >
            Criar página →
          </button>
        </div>
      </form>
    </div>
  )
}
