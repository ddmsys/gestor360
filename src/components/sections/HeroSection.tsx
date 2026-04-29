'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { HeroContent } from '@/types/cms'
import { digit3, digit6, digit0, fadeInUp } from '@/lib/animations'
import { renderTitle } from '@/lib/cms/render-title'

interface Props {
  content: HeroContent
  hasBg?: boolean
}

// Mapa de variante → classes de fundo e texto
const VARIANT_STYLES = {
  dark:   { bg: 'bg-(--color-bg-ink)', text: 'text-white', muted: 'text-white/70' },
  canvas: { bg: 'bg-(--color-bg-canvas)', text: 'text-(--color-text-title)', muted: 'text-(--color-text-body)' },
  blue:   { bg: 'bg-brand-blue', text: 'text-white', muted: 'text-white/80' },
} satisfies Record<NonNullable<HeroContent['variant']>, { bg: string; text: string; muted: string }>

export function HeroSection({ content, hasBg = false }: Props) {
  const {
    title,
    subtitle,
    cta_label,
    cta_url,
    cta_secondary_label,
    cta_secondary_url,
    variant = 'dark',
    bg_image,
    bg_video,
    overlay_opacity = 50,
    show_360_animation = false,
    align = 'center',
  } = content

  const styles = VARIANT_STYLES[variant]
  const alignClass =
    align === 'left'
      ? 'text-left items-start'
      : align === 'right'
        ? 'text-right items-end'
        : 'text-center items-center'

  return (
    <section
      className={`relative overflow-hidden ${hasBg ? '' : styles.bg} ${styles.text}`}
      aria-label="Seção hero"
    >
      {/* Vídeo de fundo */}
      {bg_video && (
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <video
            src={bg_video}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlay_opacity / 100 }}
          />
        </div>
      )}

      {/* Imagem de fundo opcional via next/image */}
      {!bg_video && bg_image && (
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={bg_image}
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlay_opacity / 100 }}
          />
        </div>
      )}

      <div
        className={`relative mx-auto max-w-[var(--container-xl)] px-4 sm:px-6 py-20 sm:py-28 lg:py-36 flex flex-col ${alignClass} gap-8`}
      >
        {/* Animação 360 */}
        {show_360_animation && (
          <motion.div
            className="flex gap-1 sm:gap-2 select-none"
            initial="hidden"
            animate="visible"
            aria-label="360"
          >
            <motion.span
              variants={digit3}
              className="font-display font-black text-display leading-none text-brand-stone"
            >
              3
            </motion.span>
            <motion.span
              variants={digit6}
              className="font-display font-black text-display leading-none text-brand-blue"
            >
              6
            </motion.span>
            <motion.span
              variants={digit0}
              className="font-display font-black text-display leading-none text-brand-gold"
            >
              0
            </motion.span>
          </motion.div>
        )}

        {/* Título */}
        <motion.h1
          className="font-display font-black text-hero leading-tight tracking-tight max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: show_360_animation ? 0.8 : 0 }}
        >
          {renderTitle(title)}
        </motion.h1>

        {/* Subtítulo */}
        {subtitle && (
          <motion.p
            className={`text-body-lg ${styles.muted} max-w-2xl leading-relaxed`}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: show_360_animation ? 1.0 : 0.15 }}
          >
            {subtitle}
          </motion.p>
        )}

        {/* CTAs */}
        {(cta_label || cta_secondary_label) && (
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: show_360_animation ? 1.2 : 0.3 }}
          >
            {cta_label && cta_url && (
              <Link
                href={cta_url}
                className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-brand-gold text-(--color-bg-ink) font-semibold text-sm hover:bg-brand-gold-hover transition-colors duration-(--transition-fast) shadow-(--shadow-gold)"
              >
                {cta_label}
              </Link>
            )}
            {cta_secondary_label && cta_secondary_url && (
              <Link
                href={cta_secondary_url}
                className={`inline-flex items-center justify-center h-12 px-8 rounded-full border font-semibold text-sm transition-colors duration-(--transition-fast) ${
                  variant === 'dark' || variant === 'blue'
                    ? 'border-white/30 text-white hover:bg-white/10'
                    : 'border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white'
                }`}
              >
                {cta_secondary_label}
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}
