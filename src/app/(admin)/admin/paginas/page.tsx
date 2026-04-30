import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";

export default async function PaginasPage() {
  const supabase = await createClient();
  const { data: pages } = await supabase
    .from("pages")
    .select("id, slug, title, status, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-2xl text-[var(--color-text-title)]">
            Páginas
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            Gerencie as páginas do site
          </p>
        </div>
        <Link
          href="/admin/paginas/nova"
          className="inline-flex min-h-[var(--touch-target-min)] items-center justify-center rounded-[var(--radius-md)] bg-brand-blue px-6 text-base font-semibold text-white shadow-[var(--shadow-blue)] transition-colors duration-[var(--transition-fast)] hover:bg-[var(--color-brand-blue-hover)]"
        >
          + Nova página
        </Link>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--color-border)] overflow-hidden">
        {!pages || pages.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-[var(--color-text-muted)]">
              Nenhuma página criada ainda.
            </p>
            <Link
              href="/admin/paginas/nova"
              className="mt-3 inline-block text-sm font-semibold text-brand-blue hover:underline"
            >
              Criar primeira página →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-canvas)]">
                <th className="text-left px-6 py-3 font-semibold text-[var(--color-text-muted)] uppercase text-xs tracking-wider">
                  Título
                </th>
                <th className="text-left px-6 py-3 font-semibold text-[var(--color-text-muted)] uppercase text-xs tracking-wider">
                  Slug
                </th>
                <th className="text-left px-6 py-3 font-semibold text-[var(--color-text-muted)] uppercase text-xs tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 font-semibold text-[var(--color-text-muted)] uppercase text-xs tracking-wider">
                  Atualizado
                </th>
                <th className="text-right px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {pages.map((page) => (
                <tr
                  key={page.id}
                  className="hover:bg-[var(--color-bg-canvas)] transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-semibold text-[var(--color-text-title)]">
                      {page.title}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-[var(--color-bg-canvas)] px-2 py-1 rounded-[var(--radius-sm)] text-[var(--color-text-body)]">
                      /{page.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        page.status === "published" ? "success" : "stone"
                      }
                    >
                      {page.status === "published" ? "Publicada" : "Rascunho"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-muted)]">
                    {new Date(page.updated_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/preview/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--color-text-muted)] hover:text-brand-blue"
                        aria-label={`Ver página ${page.title}`}
                      >
                        Visualizar
                      </a>
                      <Link
                        href={`/admin/paginas/${page.id}`}
                        className="text-xs font-semibold text-brand-blue hover:underline"
                      >
                        Editar
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
