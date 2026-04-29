import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const navLinks = [
  { href: "/metodo", label: "O Método" },
  { href: "/ferramentas", label: "Ferramentas" },
  { href: "/livro", label: "O Livro" },
  { href: "/sobre", label: "Sobre" },
];

export function Header() {
  return (
    <header
      className="sticky top-0 z-(--z-header) bg-white/95 backdrop-blur-sm border-b border-border"
      role="banner"
    >
      <div className="mx-auto max-w-[var(--container-xl)] px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center focus-visible:outline-none focus-visible:ring-(--focus-ring)"
          aria-label="oGestor360® — Página inicial"
        >
          <Logo height={36} />
        </Link>

        <nav aria-label="Navegação principal">
          <ul className="hidden md:flex items-center gap-6" role="list">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm font-medium text-text-body hover:text-brand-blue transition-colors duration-(--transition-fast)"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/ferramentas"
          className="inline-flex items-center justify-center h-10 px-5 rounded-md bg-brand-blue text-white text-sm font-semibold hover:bg-brand-blue-hover transition-colors duration-(--transition-fast)"
        >
          Acessar ferramentas
        </Link>
      </div>
    </header>
  );
}
