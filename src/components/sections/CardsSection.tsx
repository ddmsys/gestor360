import { motion } from "framer-motion";
import type { CardsContent } from "@/types/cms";
import { Badge } from "@/components/ui/Badge";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface Props {
  content: CardsContent;
}

const BG_STYLES: Record<string, string> = {
  white: "bg-white",
  canvas: "bg-[var(--color-bg-canvas)]",
  ink: "bg-[var(--color-bg-ink)]",
};

const TEXT_ON_BG: Record<string, { title: string; body: string }> = {
  white: {
    title: "text-[var(--color-text-title)]",
    body: "text-[var(--color-text-body)]",
  },
  canvas: {
    title: "text-[var(--color-text-title)]",
    body: "text-[var(--color-text-body)]",
  },
  ink: { title: "text-white", body: "text-white/70" },
};

const COLS: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

const CARD_STYLE: Record<string, string> = {
  shadow:
    "bg-white shadow-[var(--shadow-sm)] border border-[var(--color-border)]",
  bordered: "bg-white border border-[var(--color-border)]",
  flat: "bg-[var(--color-bg-canvas)]",
};

export function CardsSection({ content }: Props) {
  const {
    title,
    subtitle,
    badge,
    badge_color = "blue",
    cards: items,
    columns = 3,
    bg = "white",
    card_style = "shadow",
  } = content;

  const bgClass = BG_STYLES[bg] ?? BG_STYLES.white;
  const textClass = TEXT_ON_BG[bg] ?? TEXT_ON_BG.white;
  const colsClass = COLS[columns as 2 | 3 | 4] ?? COLS[3];
  const cardClass = CARD_STYLE[card_style] ?? CARD_STYLE.shadow;

  return (
    <section className={`${bgClass} py-16 sm:py-20`}>
      <div className="mx-auto max-w-[var(--container-xl)] px-4 sm:px-6">
        {/* Cabeçalho */}
        {(badge || title || subtitle) && (
          <motion.div
            className="text-center mb-12 flex flex-col items-center gap-3"
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
        )}

        {/* Grid de cards */}
        <motion.ul
          className={`grid grid-cols-1 ${colsClass} gap-6`}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          role="list"
        >
          {items.map((item, i) => (
            <motion.li
              key={i}
              variants={fadeInUp}
              className={`rounded-[var(--radius-lg)] p-6 flex flex-col gap-3 ${cardClass}`}
            >
              {item.icon && (
                <span className="text-3xl leading-none" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              {item.badge && (
                <Badge variant="gold" className="self-start">
                  {item.badge}
                </Badge>
              )}
              <h3 className="font-display font-bold text-title text-[var(--color-text-title)] leading-snug">
                {item.title}
              </h3>
              <p className="text-sm text-[var(--color-text-body)] leading-relaxed flex-1">
                {item.description}
              </p>
              {item.link_url && item.link_label && (
                <a
                  href={item.link_url}
                  className="text-sm font-semibold text-brand-blue hover:underline mt-auto self-start"
                >
                  {item.link_label} →
                </a>
              )}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
