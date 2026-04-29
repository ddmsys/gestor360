import { Badge } from '@/components/ui/Badge'
import { getCapituloLabel, getTipoLabel } from '@/lib/ferramentas/constants'

interface FerramentaPublica {
  id: string
  numero: number
  nome: string
  descricao: string | null
  capitulo: number
  arquivo_path: string | null
  tipo: string | null
  cor: string | null
}

interface FerramentasLibraryProps {
  ferramentas: FerramentaPublica[]
}

export function FerramentasLibrary({ ferramentas }: FerramentasLibraryProps) {
  const kit = ferramentas.find((ferramenta) => ferramenta.tipo === 'kit_completo')
  const individuais = ferramentas.filter((ferramenta) => ferramenta.tipo !== 'kit_completo')
  const capitulos = Array.from(new Set(individuais.map((ferramenta) => ferramenta.capitulo))).sort((a, b) => a - b)

  if (ferramentas.length === 0) {
    return (
      <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-sm)]">
        <Badge variant="stone">Em preparação</Badge>
        <h2 className="mt-4 font-display text-2xl font-black text-[var(--color-text-title)]">
          As ferramentas estão sendo publicadas.
        </h2>
        <p className="mt-3 text-sm leading-[var(--leading-relaxed)] text-[var(--color-text-body)]">
          Seu cadastro foi recebido. Assim que os arquivos forem liberados, você poderá baixá-los por aqui.
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-md)] sm:p-8">
      <div className="mb-8">
        <Badge variant="success">Acesso liberado</Badge>
        <h2 className="mt-4 font-display text-[var(--text-heading)] font-black leading-[var(--leading-tight)] text-[var(--color-text-title)]">
          Biblioteca de ferramentas
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-[var(--leading-relaxed)] text-[var(--color-text-body)]">
          Baixe o kit completo ou escolha as ferramentas individualmente. Os links são temporários e protegidos.
        </p>
      </div>

      {kit && (
        <div className="mb-8 rounded-[var(--radius-lg)] bg-[var(--color-bg-ink)] p-6 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-gold">
            Kit completo
          </p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="font-display text-2xl font-black text-white">{kit.nome}</h3>
              <p className="mt-2 text-sm leading-[var(--leading-relaxed)] text-white/64">
                {kit.descricao || 'Todas as ferramentas do livro em um único arquivo.'}
              </p>
            </div>
            <a
              href={`/api/ferramentas/public/${kit.id}/download`}
              className="inline-flex min-h-[var(--touch-target-min)] shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-brand-gold px-5 text-sm font-bold text-[var(--color-bg-ink)] transition-colors hover:bg-[var(--color-brand-gold-hover)]"
            >
              Baixar kit
            </a>
          </div>
        </div>
      )}

      <div className="grid gap-8">
        {capitulos.map((capitulo) => (
          <div key={capitulo}>
            <h3 className="mb-4 font-display text-xl font-black text-[var(--color-text-title)]">
              {getCapituloLabel(capitulo)}
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {individuais
                .filter((ferramenta) => ferramenta.capitulo === capitulo)
                .map((ferramenta) => (
                  <article
                    key={ferramenta.id}
                    className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="mt-1 h-10 w-10 shrink-0 rounded-[var(--radius-md)]"
                        style={{ backgroundColor: ferramenta.cor || '#E8E6E1' }}
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                          F{String(ferramenta.numero).padStart(2, '0')} · {getTipoLabel(ferramenta.tipo)}
                        </p>
                        <h4 className="mt-1 font-bold text-[var(--color-text-title)]">{ferramenta.nome}</h4>
                        {ferramenta.descricao && (
                          <p className="mt-2 text-sm leading-[var(--leading-relaxed)] text-[var(--color-text-body)]">
                            {ferramenta.descricao}
                          </p>
                        )}
                        <a
                          href={`/api/ferramentas/public/${ferramenta.id}/download`}
                          className="mt-4 inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] border border-brand-blue px-4 text-sm font-semibold text-brand-blue transition-colors hover:bg-[var(--color-brand-blue-subtle)]"
                        >
                          Baixar PDF
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
