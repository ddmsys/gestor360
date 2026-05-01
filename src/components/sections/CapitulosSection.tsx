'use client'

import { motion } from "framer-motion";
import type { CapitulosContent } from "@/types/cms";
import { Badge } from "@/components/ui/Badge";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { renderText } from "@/lib/cms/render-title";

interface Props {
  content: CapitulosContent;
}

// Dados fixos dos 10 capítulos — parte do conteúdo editorial do livro
const CAPITULOS = [
  {
    numero: 1,
    tema: "Planejamento Estratégico",
    ferramentas: ["GST", "PESTEL", "SWOT Comportamental"],
  },
  {
    numero: 2,
    tema: "Comunicação e Influência",
    ferramentas: ["4 Níveis de Fala", "Rapport", "Metamodelo", "Reframing"],
  },
  {
    numero: 3,
    tema: "Delegação Eficaz",
    ferramentas: ["Mapa de Funções 360", "Roda da Autonomia", "Mapa Circular"],
  },
  {
    numero: 4,
    tema: "Mentalidade de Líder",
    ferramentas: ["Mapa de Crenças", "Ritual da Ação Consciente"],
  },
  {
    numero: 5,
    tema: "Gestão Financeira",
    ferramentas: [
      "DRE",
      "Formação de Preço",
      "Fluxo de Caixa",
      "Diagnóstico 15min",
    ],
  },
  {
    numero: 6,
    tema: "Marketing e Vendas",
    ferramentas: ["Roteiro da História de Valor"],
  },
  {
    numero: 7,
    tema: "Gestão de Pessoas",
    ferramentas: [
      "Diagnóstico de Clima",
      "Matriz de Desempenho",
      "Feedback SCI",
      "1:1",
      "Termômetro",
      "Roda de Valores",
    ],
  },
  {
    numero: 8,
    tema: "Riscos e Decisão",
    ferramentas: [
      "Matriz de Risco",
      "Reversível × Irreversível",
      "Análise de Cenários",
    ],
  },
  {
    numero: 9,
    tema: "Autoaprendizado",
    ferramentas: ["Canvas de Autoaprendizado do Líder360"],
  },
  {
    numero: 10,
    tema: "Indicadores e Inovação",
    ferramentas: [
      "Painel de Indicadores",
      "OKRs",
      "PDCA",
      "Canvas da Inovação Ágil",
    ],
  },
] as const;

export function CapitulosSection({ content }: Props) {
  const {
    title = "Os 10 capítulos do método",
    subtitle,
    badge,
    bg = "white",
    layout = "grid",
    link_para_ferramenta = true,
  } = content;

  const bgClass = bg === "canvas" ? "bg-[var(--color-bg-canvas)]" : "bg-white";

  return (
    <section className={`${bgClass} py-16 sm:py-20`}>
      <div className="mx-auto max-w-[var(--container-xl)] px-4 sm:px-6">
        {/* Cabeçalho */}
        <motion.div
          className="text-center flex flex-col items-center gap-3 mb-12"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {badge && <Badge variant="blue">{badge}</Badge>}
          {title && (
            <h2 className="font-display font-black text-heading leading-tight tracking-tight text-[var(--color-text-title)] max-w-2xl">
              {renderText(title)}
            </h2>
          )}
          {subtitle && (
            <p className="text-body-lg text-[var(--color-text-body)] max-w-xl leading-relaxed">
              {renderText(subtitle)}
            </p>
          )}
        </motion.div>

        {/* Grid */}
        {layout === "grid" ? (
          <motion.ul
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            role="list"
          >
            {CAPITULOS.map((cap) => (
              <motion.li
                key={cap.numero}
                variants={fadeInUp}
                className="bg-white rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-sm)] border border-[var(--color-border)] flex flex-col gap-3 group"
              >
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-2xl text-brand-blue leading-none">
                    {String(cap.numero).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-display font-bold text-sm text-[var(--color-text-title)] leading-snug">
                  {cap.tema}
                </h3>
                <ul className="flex flex-col gap-1 mt-auto">
                  {cap.ferramentas.slice(0, 3).map((f) => (
                    <li
                      key={f}
                      className="text-xs text-[var(--color-text-muted)] flex items-center gap-1.5"
                    >
                      <span
                        className="w-1 h-1 rounded-full bg-brand-gold shrink-0"
                        aria-hidden="true"
                      />
                      {f}
                    </li>
                  ))}
                  {cap.ferramentas.length > 3 && (
                    <li className="text-xs text-[var(--color-text-muted)]">
                      +{cap.ferramentas.length - 3} ferramenta
                      {cap.ferramentas.length - 3 > 1 ? "s" : ""}
                    </li>
                  )}
                </ul>
                {link_para_ferramenta && (
                  <a
                    href={`/ferramentas?capitulo=${cap.numero}`}
                    className="text-xs font-semibold text-brand-blue hover:underline mt-1 self-start"
                    aria-label={`Ver ferramentas do capítulo ${cap.numero}: ${cap.tema}`}
                  >
                    Ver ferramentas →
                  </a>
                )}
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          /* Layout lista numerada */
          <motion.ol
            className="flex flex-col divide-y divide-[var(--color-border)] max-w-2xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            {CAPITULOS.map((cap) => (
              <motion.li
                key={cap.numero}
                variants={fadeInUp}
                className="flex items-start gap-4 py-4"
              >
                <span className="font-display font-black text-2xl text-brand-blue w-8 shrink-0 text-right leading-tight">
                  {String(cap.numero).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--color-text-title)]">
                    {cap.tema}
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                    {cap.ferramentas.join(" · ")}
                  </p>
                </div>
                {link_para_ferramenta && (
                  <a
                    href={`/ferramentas?capitulo=${cap.numero}`}
                    className="text-xs font-semibold text-brand-blue hover:underline shrink-0"
                    aria-label={`Ferramentas do capítulo ${cap.numero}`}
                  >
                    Ver →
                  </a>
                )}
              </motion.li>
            ))}
          </motion.ol>
        )}
      </div>
    </section>
  );
}
