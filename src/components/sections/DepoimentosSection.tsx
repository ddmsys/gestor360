'use client'

import Image from "next/image";
import { motion } from "framer-motion";
import type { DepoimentosContent, DepoimentoItem } from "@/types/cms";
import { Badge } from "@/components/ui/Badge";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface Props {
  content: DepoimentosContent;
  depoimentos?: DepoimentoItem[]; // passados pelo server component quando source='supabase'
}

const BG_STYLES: Record<string, string> = {
  white: "bg-white",
  canvas: "bg-[var(--color-bg-canvas)]",
  ink: "bg-[var(--color-bg-ink)]",
};

const TEXT_ON_BG: Record<
  string,
  { title: string; body: string; meta: string }
> = {
  white: {
    title: "text-[var(--color-text-title)]",
    body: "text-[var(--color-text-body)]",
    meta: "text-[var(--color-text-muted)]",
  },
  canvas: {
    title: "text-[var(--color-text-title)]",
    body: "text-[var(--color-text-body)]",
    meta: "text-[var(--color-text-muted)]",
  },
  ink: { title: "text-white", body: "text-white/80", meta: "text-white/50" },
};

const COLS: Record<2 | 3, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
};

function StarRating({ nota }: { nota: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${nota} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-4 h-4 ${s <= nota ? "text-brand-gold" : "text-[var(--color-border)]"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function DepoimentosSection({ content, depoimentos = [] }: Props) {
  const {
    title = "O que dizem sobre o Gestor360®",
    subtitle,
    badge,
    badge_color = "blue",
    source = "supabase",
    items = [],
    layout = "grid",
    columns = 3,
    bg = "canvas",
    limit = 6,
  } = content;

  const bgClass = BG_STYLES[bg] ?? BG_STYLES.canvas;
  const textClass = TEXT_ON_BG[bg] ?? TEXT_ON_BG.canvas;
  const colsClass = COLS[columns as 2 | 3] ?? COLS[3];

  const sourceItems = source === "manual" ? items : depoimentos;
  const displayItems = sourceItems.slice(0, limit);

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
          {badge && (
            <Badge variant={badge_color as "blue" | "gold" | "stone"}>
              {badge}
            </Badge>
          )}
          {title && (
            <h2
              className={`font-display font-black text-heading leading-tight tracking-tight ${textClass.title} max-w-2xl`}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              className={`text-body-lg ${textClass.body} max-w-xl leading-relaxed`}
            >
              {subtitle}
            </p>
          )}
        </motion.div>

        {displayItems.length === 0 ? (
          <p className={`text-center text-sm ${textClass.meta}`}>
            Nenhum depoimento disponível.
          </p>
        ) : (
          <motion.ul
            className={`grid grid-cols-1 ${colsClass} gap-6`}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            role="list"
          >
            {displayItems.map((dep, i) => (
              <motion.li
                key={i}
                variants={fadeInUp}
                className="bg-white rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)] border border-[var(--color-border)] flex flex-col gap-4"
              >
                {dep.nota && <StarRating nota={dep.nota} />}
                <blockquote className="text-sm text-[var(--color-text-body)] leading-relaxed flex-1">
                  &ldquo;{dep.texto}&rdquo;
                </blockquote>
                <footer className="flex items-center gap-3 pt-2 border-t border-[var(--color-border)]">
                  {dep.foto_url ? (
                    <Image
                      src={dep.foto_url}
                      alt={dep.nome}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0"
                      aria-hidden="true"
                    >
                      <span className="text-brand-blue font-bold text-sm">
                        {dep.nome[0]}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-text-title)] truncate">
                      {dep.nome}
                    </p>
                    {(dep.cargo || dep.empresa) && (
                      <p className="text-xs text-[var(--color-text-muted)] truncate">
                        {[dep.cargo, dep.empresa].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                </footer>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  );
}
