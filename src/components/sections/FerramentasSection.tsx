import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { motion } from "framer-motion";
import type { FerramentasContent } from "@/types/cms";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface Props {
  content: FerramentasContent;
}

interface Ferramenta {
  id: string;
  numero: number;
  nome: string;
  descricao?: string;
  capitulo: number;
  arquivo_path: string;
  acesso: "gratuito" | "codigo_livro";
}

const CAPITULO_TEMA: Record<number, string> = {
  1: "Planejamento",
  2: "Comunicação",
  3: "Delegação",
  4: "Mentalidade",
  5: "Finanças",
  6: "Marketing e Vendas",
  7: "Pessoas",
  8: "Riscos",
  9: "Autoaprendizado",
  10: "Indicadores",
};

export async function FerramentasSection({ content }: Props) {
  const {
    title = "As 31 ferramentas do método",
    subtitle,
    capitulo_inicial,
    mostrar_todos = false,
    layout = "grid",
    mostrar_cta_codigo = true,
    cta_codigo_titulo = "Desbloqueie todas as 31 ferramentas",
    cta_codigo_descricao = "Com o código que está no seu livro, você tem acesso completo a todas as ferramentas.",
  } = content;

  const supabase = await createClient();

  // Busca ferramentas gratuitas (anon só vê gratuito via RLS)
  let query = supabase.from("ferramentas").select("*").order("numero");
  if (capitulo_inicial && !mostrar_todos) {
    query = query.eq("capitulo", capitulo_inicial);
  }

  const { data: ferramentas } = await query;
  const lista: Ferramenta[] = ferramentas ?? [];

  const gratuitas = lista.filter((f) => f.acesso === "gratuito");
  const pagas = lista.filter((f) => f.acesso === "codigo_livro");

  return (
    <section className="bg-[var(--color-bg-canvas)] py-16 sm:py-20">
      <div className="mx-auto max-w-[var(--container-xl)] px-4 sm:px-6">
        {/* Cabeçalho */}
        {(title || subtitle) && (
          <motion.div
            className="text-center flex flex-col items-center gap-3 mb-12"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {title && (
              <h2 className="font-display font-black text-heading leading-tight tracking-tight text-[var(--color-text-title)] max-w-2xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-body-lg text-[var(--color-text-body)] max-w-xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        {/* Grid de ferramentas gratuitas */}
        <motion.ul
          className={`grid grid-cols-1 ${layout === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : ""} gap-4 mb-6`}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          role="list"
        >
          {gratuitas.map((ferr) => (
            <motion.li
              key={ferr.id}
              variants={fadeInUp}
              className="bg-white rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-sm)] border border-[var(--color-border)] flex flex-col gap-3"
            >
              <div className="flex items-center justify-between gap-2">
                <Badge variant="blue">
                  Cap. {ferr.capitulo} — {CAPITULO_TEMA[ferr.capitulo] ?? ""}
                </Badge>
                <span className="text-xs text-[var(--color-text-muted)] font-mono font-bold">
                  F{String(ferr.numero).padStart(2, "0")}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-[var(--color-text-title)]">
                  {ferr.nome}
                </h3>
                {ferr.descricao && (
                  <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">
                    {ferr.descricao}
                  </p>
                )}
              </div>
              <Link
                href={`/api/ferramentas/${ferr.id}/download`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:underline self-start mt-auto"
                aria-label={`Baixar ${ferr.nome}`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Baixar PDF gratuito
              </Link>
            </motion.li>
          ))}
        </motion.ul>

        {/* Bloqueadas (sem código) */}
        {pagas.length > 0 && (
          <motion.ul
            className={`grid grid-cols-1 ${layout === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : ""} gap-4 mb-10`}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            role="list"
          >
            {pagas.map((ferr) => (
              <motion.li
                key={ferr.id}
                variants={fadeInUp}
                className="bg-white rounded-[var(--radius-lg)] p-5 border border-[var(--color-border)] flex flex-col gap-3 opacity-60 relative overflow-hidden"
              >
                {/* Cadeado */}
                <div className="absolute top-3 right-3">
                  <svg
                    className="w-4 h-4 text-[var(--color-text-muted)]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-label="Conteúdo bloqueado"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <Badge variant="gold">
                  Cap. {ferr.capitulo} — {CAPITULO_TEMA[ferr.capitulo] ?? ""}
                </Badge>
                <h3 className="font-semibold text-sm text-[var(--color-text-title)] pr-6">
                  {ferr.nome}
                </h3>
              </motion.li>
            ))}
          </motion.ul>
        )}

        {/* CTA código do livro */}
        {mostrar_cta_codigo && pagas.length > 0 && (
          <motion.div
            className="bg-brand-blue rounded-[var(--radius-xl)] p-8 text-center flex flex-col items-center gap-4 max-w-2xl mx-auto"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            <span className="text-4xl" aria-hidden="true">
              🔓
            </span>
            <h3 className="font-display font-black text-title text-white">
              {cta_codigo_titulo}
            </h3>
            <p className="text-sm text-white/80 leading-relaxed">
              {cta_codigo_descricao}
            </p>
            <Button
              variant="primary"
              className="bg-brand-gold text-[var(--color-bg-ink)] hover:opacity-90"
            >
              Inserir código do livro
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
