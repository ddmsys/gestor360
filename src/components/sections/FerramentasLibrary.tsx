import { getCapituloLabel } from '@/lib/ferramentas/constants'

interface Ferramenta {
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
  ferramentas: Ferramenta[]
}

export function FerramentasLibrary({ ferramentas }: FerramentasLibraryProps) {
  const kit = ferramentas.find((f) => f.tipo === 'kit_completo')
  const individuais = ferramentas.filter((f) => f.tipo !== 'kit_completo')
  const capitulos = Array.from(new Set(individuais.map((f) => f.capitulo))).sort((a, b) => a - b)

  if (ferramentas.length === 0) {
    return (
      <section className="rounded-lg border border-border bg-white p-8 text-center">
        <p className="text-sm font-semibold text-(--color-text-muted)">Em preparação</p>
        <h2 className="mt-3 font-display text-2xl font-black text-(--color-text-title)">
          As ferramentas estão sendo publicadas.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-text-body">
          Seu cadastro foi recebido. Assim que os arquivos forem liberados, você poderá baixá-los por aqui.
        </p>
      </section>
    )
  }

  return (
    <section aria-label="Biblioteca de ferramentas">
      {/* Cabeçalho com badge e download do kit */}
      <div className="mb-6 flex flex-col gap-4 rounded-lg bg-(--color-bg-ink) p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
            Acesso liberado
          </span>
          <h2 className="mt-2 font-display text-2xl font-black text-white sm:text-3xl">
            Biblioteca de ferramentas
          </h2>
          <p className="mt-2 text-sm text-white/60">
            {individuais.length} ferramentas em {capitulos.length} capítulos — baixe individualmente ou o kit completo.
          </p>
        </div>
        {kit && (
          <a
            href={`/api/ferramentas/public/${kit.id}/download`}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-brand-gold px-6 py-3 text-sm font-bold text-(--color-bg-ink) transition-colors hover:bg-brand-gold-hover"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            Baixar kit completo (ZIP)
          </a>
        )}
      </div>

      {/* Acordeão por capítulo */}
      <div className="flex flex-col gap-3">
        {capitulos.map((cap) => {
          const tools = individuais.filter((f) => f.capitulo === cap)
          return (
            <details
              key={cap}
              className="group rounded-lg border border-border bg-white"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 select-none transition-colors hover:bg-bg-canvas rounded-lg [&::-webkit-details-marker]:hidden">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 font-display text-sm font-black text-brand-blue">
                    {cap}
                  </span>
                  <span className="font-display font-bold text-(--color-text-title)">
                    {getCapituloLabel(cap).replace(`Capítulo ${cap} - `, '')}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden text-xs text-(--color-text-muted) sm:block">
                    {tools.length} {tools.length === 1 ? 'ferramenta' : 'ferramentas'}
                  </span>
                  <svg
                    width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2"
                    className="text-(--color-text-muted) transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
              </summary>

              <div className="border-t border-border px-5 pb-5 pt-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {tools.map((f) => (
                    <article
                      key={f.id}
                      className="flex flex-col gap-3 rounded-md border border-border p-4"
                    >
                      <div className="flex items-start gap-3">
                        {/* Cor dinâmica do banco — inline style é necessário aqui */}
                        <div
                          className="mt-0.5 h-9 w-9 shrink-0 rounded-sm"
                          style={{ backgroundColor: f.cor ?? '#E8E6E1' }}
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-(--color-text-muted)">
                            F{String(f.numero).padStart(2, '0')}
                          </p>
                          <h3 className="mt-0.5 text-sm font-bold leading-snug text-(--color-text-title)">
                            {f.nome}
                          </h3>
                        </div>
                      </div>
                      {f.descricao && (
                        <p className="line-clamp-3 text-xs leading-relaxed text-text-body">
                          {f.descricao}
                        </p>
                      )}
                      <a
                        href={`/api/ferramentas/public/${f.id}/download`}
                        className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-sm border border-brand-blue px-3 py-2 text-xs font-semibold text-brand-blue transition-colors hover:bg-brand-blue hover:text-white"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                        </svg>
                        Baixar PDF
                      </a>
                    </article>
                  ))}
                </div>
              </div>
            </details>
          )
        })}
      </div>
    </section>
  )
}
