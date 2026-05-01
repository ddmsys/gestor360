"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FAQContent } from "@/types/cms";
import { Badge } from "@/components/ui/Badge";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { renderText } from "@/lib/cms/render-title";

interface Props {
  content: FAQContent;
}

function FAQItem({
  question,
  answer,
  defaultOpen = false,
}: {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div
      variants={fadeInUp}
      className="border-b border-[var(--color-border)] last:border-0"
    >
      <button
        type="button"
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open ? "true" : "false"}
      >
        <span className="font-semibold text-[var(--color-text-title)] text-base leading-snug">
          {question}
        </span>
        <span
          aria-hidden="true"
          className={`shrink-0 w-6 h-6 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[var(--color-text-body)] leading-relaxed text-sm">
              {renderText(answer)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQSection({ content }: Props) {
  const {
    title = "Perguntas frequentes",
    subtitle,
    badge,
    badge_color = "blue",
    items,
    bg = "white",
    layout = "single",
  } = content;

  const bgClass = bg === "canvas" ? "bg-[var(--color-bg-canvas)]" : "bg-white";

  const cols = layout === "two-columns" ? "lg:grid-cols-2" : "";

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

        {/* Lista de FAQs */}
        <motion.div
          className={`mx-auto ${layout === "single" ? "max-w-2xl" : ""} grid ${cols} gap-x-12`}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {items.map((item, i) => (
            <FAQItem
              key={i}
              question={item.question}
              answer={item.answer}
              defaultOpen={item.open_by_default}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
