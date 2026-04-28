import Link from 'next/link'

export function Footer() {
  return (
    <footer
      className="bg-[var(--color-bg-ink)] text-[var(--color-text-inverse)] mt-auto"
      role="contentinfo"
    >
      <div className="mx-auto max-w-[var(--container-xl)] px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="font-display font-black text-2xl tracking-[var(--tracking-tight)] mb-3">
            <span className="text-[var(--color-brand-stone)]">3</span>
            <span className="text-brand-blue">6</span>
            <span className="text-brand-gold">0</span>
            <span className="text-white"> Gestor</span>
          </p>
          <p className="text-sm text-white/60 leading-[var(--leading-relaxed)] max-w-xs">
            O método que une razão e alma para transformar quem lidera.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-white/40 mb-4">
            Navegação
          </p>
          <ul className="flex flex-col gap-2" role="list">
            {[
              { href: '/metodo', label: 'O Método' },
              { href: '/ferramentas', label: 'Ferramentas' },
              { href: '/livro', label: 'O Livro' },
              { href: '/sobre', label: 'Sobre' },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-white/70 hover:text-white transition-colors duration-[var(--transition-fast)]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-white/40 mb-4">
            DDM Editora
          </p>
          <p className="text-sm text-white/60 leading-[var(--leading-relaxed)]">
            Rua dos Empreendedores, Brasil
          </p>
          <a
            href="mailto:contato@ogestor360.com"
            className="text-sm text-brand-gold hover:text-[var(--color-brand-gold-hover)] transition-colors duration-[var(--transition-fast)] mt-2 inline-block"
          >
            contato@ogestor360.com
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[var(--container-xl)] px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Gestor360® — DDM Editora. Todos os direitos reservados.
          </p>
          <p className="text-xs text-white/30">
            Livro publicado em abril de 2026
          </p>
        </div>
      </div>
    </footer>
  )
}
