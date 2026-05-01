import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { FerramentasContent } from '@/types/cms'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { renderText } from '@/lib/cms/render-title'

interface Props {
  content: FerramentasContent
}

interface Ferramenta {
  id: string
  numero: number
  nome: string
  descricao?: string
  capitulo: number
  arquivo_path: string
  acesso: 'gratuito' | 'codigo_livro'
}

const CAPITULO_TEMA: Record<number, string> = {
  1: 'Planejamento',
  2: 'Comunicação',
  3: 'Delegação',
  4: 'Mentalidade',
  5: 'Finanças',
  6: 'Marketing e Vendas',
  7: 'Pessoas',
  8: 'Riscos',
  9: 'Autoaprendizado',
  10: 'Indicadores',
}

export async function FerramentasSection({ content }: Props) {
  const {
    title = 'As 31 ferramentas do método',
    subtitle,
    capitulo_inicial,
    mostrar_todos = false,
    layout = 'grid',
    mostrar_cta_codigo = true,
    cta_codigo_titulo = 'Desbloqueie todas as 31 ferramentas',
    cta_codigo_descricao = 'Com o código que está no seu livro, você tem acesso completo a todas as ferramentas.',
  } = content

  const supabase = await createClient()

  let query = supabase.from('ferramentas').select('*').order('numero')
  if (capitulo_inicial && !mostrar_todos) {
    query = query.eq('capitulo', capitulo_inicial)
  }

  const { data: ferramentas } = await query
  const lista: Ferramenta[] = ferramentas ?? []

  const gratuitas = lista.filter((f) => f.acesso === 'gratuito')
  const pagas = lista.filter((f) => f.acesso === 'codigo_livro')

  const gridClass = layout === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : ''

  return (
    <section className="bg-[var(--color-bg-canvas)] py-16 sm:py-20">
      <div className="mx-auto max-w-[var(--container-xl)] px-4 sm:px-6">
        {(title || subtitle) && (
          <div className="mb-12 flex flex-col items-center gap-3 text-center">
            {title && (
              <h2 className="max-w-2xl font-display font-black leading-tight tracking-tight text-[var(--color-text-title)] text-heading">
                {renderText(title)}
              </h2>
            )}
            {subtitle && (
              <p className="max-w-xl leading-relaxed text-[var(--color-text-body)] text-body-lg">
                {renderText(subtitle)}
              </p>
            )}
          </div>
        )}

        {/* Ferramentas gratuitas */}
        <ul className={`mb-6 grid grid-cols-1 ${gridClass} gap-4`} role="list">
          {gratuitas.map((ferr) => (
            <li
              key={ferr.id}
              className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]"
            >
              <div className="flex items-center justify-between gap-2">
                <Badge variant="blue">
                  Cap. {ferr.capitulo} — {CAPITULO_TEMA[ferr.capitulo] ?? ''}
                </Badge>
                <span className="font-mono text-xs font-bold text-[var(--color-text-muted)]">
                  F{String(ferr.numero).padStart(2, '0')}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-[var(--color-text-title)]">
                  {ferr.nome}
                </h3>
                {ferr.descricao && (
                  <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">
                    {ferr.descricao}
                  </p>
                )}
              </div>
              <Link
                href={`/api/ferramentas/public/${ferr.id}/download`}
                className="mt-auto inline-flex items-center gap-1.5 self-start text-xs font-semibold text-[var(--color-brand-blue)] hover:underline"
                aria-label={`Baixar ${ferr.nome}`}
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Baixar PDF gratuito
              </Link>
            </li>
          ))}
        </ul>

        {/* Ferramentas bloqueadas */}
        {pagas.length > 0 && (
          <ul className={`mb-10 grid grid-cols-1 ${gridClass} gap-4`} role="list">
            {pagas.map((ferr) => (
              <li
                key={ferr.id}
                className="relative flex flex-col gap-3 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 opacity-60"
              >
                <div className="absolute right-3 top-3">
                  <svg className="h-4 w-4 text-[var(--color-text-muted)]" viewBox="0 0 20 20" fill="currentColor" aria-label="Conteúdo bloqueado">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <Badge variant="gold">
                  Cap. {ferr.capitulo} — {CAPITULO_TEMA[ferr.capitulo] ?? ''}
                </Badge>
                <h3 className="pr-6 text-sm font-semibold text-[var(--color-text-title)]">
                  {ferr.nome}
                </h3>
              </li>
            ))}
          </ul>
        )}

        {/* CTA código do livro */}
        {mostrar_cta_codigo && pagas.length > 0 && (
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-[var(--radius-xl)] bg-[var(--color-brand-blue)] p-8 text-center">
            <span className="text-4xl" aria-hidden="true">🔓</span>
            <h3 className="font-display font-black text-white text-title">
              {cta_codigo_titulo}
            </h3>
            <p className="text-sm leading-relaxed text-white/80">
              {cta_codigo_descricao}
            </p>
            <Button
              variant="primary"
              className="bg-[var(--color-brand-gold)] text-[var(--color-bg-ink)] hover:opacity-90"
            >
              Inserir código do livro
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
