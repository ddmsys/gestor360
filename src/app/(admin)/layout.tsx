export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[var(--color-bg-canvas)]">
      <aside className="w-64 bg-[var(--color-bg-ink)] text-white shrink-0">
        <div className="p-6 border-b border-white/10">
          <p className="font-display font-black text-lg">
            <span className="text-[var(--color-brand-stone)]">3</span>
            <span className="text-brand-blue">6</span>
            <span className="text-brand-gold">0</span>
            <span className="text-white"> Admin</span>
          </p>
        </div>
        <nav className="p-4" aria-label="Navegação admin">
          <ul className="flex flex-col gap-1" role="list">
            {[
              { href: '/admin', label: 'Dashboard' },
              { href: '/admin/paginas', label: 'Páginas' },
              { href: '/admin/leads', label: 'Leads' },
              { href: '/admin/ferramentas', label: 'Ferramentas' },
              { href: '/admin/depoimentos', label: 'Depoimentos' },
            ].map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="block px-3 py-2 rounded-[var(--radius-md)] text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-[var(--transition-fast)]"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="flex-1 overflow-auto">
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
