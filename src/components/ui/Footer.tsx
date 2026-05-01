import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { createClient } from "@/lib/supabase/server";

interface FooterLink {
  href: string;
  label: string;
}

interface FooterConfig {
  tagline: string;
  endereco: string;
  email: string;
  copyright: string;
  nota_livro: string;
  links: FooterLink[];
}

const defaultFooter: FooterConfig = {
  tagline: "Liderar é servir. Servir é amar com estratégia.",
  endereco: "Alameda Rio Negro 585, Alphaville — SP",
  email: "contato@ogestor360.com",
  copyright: "© {year} oGestor360® — DDM Editora. Todos os direitos reservados.",
  nota_livro: "Livro publicado em abril de 2026",
  links: [
    { href: "/metodo", label: "O Método" },
    { href: "/ferramentas", label: "Ferramentas" },
    { href: "/livro", label: "O Livro" },
    { href: "/mentoria", label: "Mentoria" },
    { href: "/sobre", label: "Sobre" },
  ],
};

export async function Footer() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", "footer")
    .single();

  const footer: FooterConfig = (data?.value as FooterConfig) ?? defaultFooter;
  const year = new Date().getFullYear();
  const copyright = footer.copyright.replace("{year}", String(year));

  return (
    <footer
      className="bg-(--color-bg-ink) text-(--color-text-inverse) mt-auto"
      role="contentinfo"
    >
      <div className="mx-auto max-w-[var(--container-xl)] px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <Link
            href="/"
            aria-label="oGestor360® — Página inicial"
            className="inline-block mb-3"
          >
            <Logo variant="full" theme="dark" height={44} />
          </Link>
          <p className="text-sm text-white/60 leading-relaxed max-w-xs">
            {footer.tagline}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
            Navegação
          </p>
          <ul className="flex flex-col gap-2" role="list">
            {footer.links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-white/70 hover:text-white transition-colors duration-(--transition-fast)"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
            DDM Editora
          </p>
          <p className="text-sm text-white/60 leading-relaxed">
            {footer.endereco}
          </p>
          <a
            href={`mailto:${footer.email}`}
            className="text-sm text-brand-gold hover:text-brand-gold-hover transition-colors duration-(--transition-fast) mt-2 inline-block"
          >
            {footer.email}
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[var(--container-xl)] px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/40">{copyright}</p>
          <p className="text-xs text-white/30">{footer.nota_livro}</p>
        </div>
      </div>
    </footer>
  );
}
