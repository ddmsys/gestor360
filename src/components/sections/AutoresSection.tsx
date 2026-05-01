'use client'

import Image from "next/image";
import { motion } from "framer-motion";
import type { AutoresContent } from "@/types/cms";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface Props {
  content: AutoresContent;
}

export function AutoresSection({ content }: Props) {
  const {
    title = "Os autores",
    subtitle,
    autores = [],
    bg = "canvas",
    layout = "side-by-side",
  } = content;

  const bgClass = bg === "white" ? "bg-white" : "bg-[var(--color-bg-canvas)]";

  return (
    <section className={`${bgClass} py-16 sm:py-20`}>
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

        {/* Autores */}
        <motion.ul
          className={
            layout === "side-by-side"
              ? "grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto"
              : "flex flex-col gap-12 max-w-2xl mx-auto"
          }
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          role="list"
        >
          {autores.map((autor, i) => (
            <motion.li
              key={i}
              variants={fadeInUp}
              className="flex flex-col items-center text-center gap-5"
            >
              {/* Foto */}
              <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-[var(--shadow-md)] shrink-0">
                <Image
                  src={autor.foto_url}
                  alt={autor.nome}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>

              {/* Textos */}
              <div className="flex flex-col gap-2">
                <div>
                  <h3 className="font-display font-black text-title text-[var(--color-text-title)]">
                    {autor.nome}
                  </h3>
                  <p className="text-sm font-medium text-brand-blue mt-0.5">
                    {autor.cargo}
                  </p>
                </div>
                <p className="text-sm text-[var(--color-text-body)] leading-relaxed max-w-xs mx-auto">
                  {autor.bio}
                </p>
                {/* Redes sociais */}
                {(autor.linkedin_url ||
                  autor.instagram_url ||
                  autor.site_url) && (
                  <div className="flex items-center justify-center gap-3 mt-1">
                    {autor.linkedin_url && (
                      <a
                        href={autor.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`LinkedIn de ${autor.nome}`}
                        className="text-[var(--color-text-muted)] hover:text-brand-blue transition-colors"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="w-5 h-5"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    )}
                    {autor.instagram_url && (
                      <a
                        href={autor.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Instagram de ${autor.nome}`}
                        className="text-[var(--color-text-muted)] hover:text-brand-gold transition-colors"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="w-5 h-5"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                      </a>
                    )}
                    {autor.site_url && (
                      <a
                        href={autor.site_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Site de ${autor.nome}`}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-text-title)] transition-colors"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          aria-hidden="true"
                        >
                          <circle cx={12} cy={12} r={10} />
                          <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
