import Link from 'next/link'

const navLinks = [
  { href: '/metodo', label: 'O Método' },
  { href: '/ferramentas', label: 'Ferramentas' },
  { href: '/livro', label: 'O Livro' },
  { href: '/sobre', label: 'Sobre' },
]

export function Header() {
  return (
    <header
      className="sticky top-0 z-[var(--z-header)] bg-white/95 backdrop-blur-sm border-b border-[var(--color-border)]"
      role="banner"
    >
      <div className="mx-auto max-w-[var(--container-xl)] px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-[var(--focus-ring)]"
          aria-label="Gestor360® — Página inicial"
        >
          <span
            className="font-display font-black text-xl tracking-[var(--tracking-tight)] select-none"
            aria-hidden="true"
          >
            <span className="text-[var(--color-stone-accessible)]">3</span>
            <span className="text-brand-blue">6</span>
            <span className="text-brand-gold">0</span>
          </span>
          <span className="font-display font-black text-xl text-[var(--color-text-title)] tracking-[var(--tracking-tight)]">
            Gestor
          </span>
        </Link>

        <nav aria-label="Navegação principal">
          <ul className="hidden md:flex items-center gap-6" role="list">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm font-medium text-[var(--color-text-body)] hover:text-brand-blue transition-colors duration-[var(--transition-fast)]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/ferramentas"
          className="inline-flex items-center justify-center h-10 px-5 rounded-[var(--radius-md)] bg-brand-blue text-white text-sm font-semibold hover:bg-[var(--color-brand-blue-hover)] transition-colors duration-[var(--transition-fast)]"
        >
          Acessar ferramentas
        </Link>
      </div>
    </header>
  )
}
