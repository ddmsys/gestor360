'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { CTAContent } from '@/types/cms'
import { fadeInUp } from '@/lib/animations'
import { renderTitle } from '@/lib/cms/render-title'

interface Props {
  content: CTAContent
  hasBg?: boolean
}

const BG_STYLES = {
  canvas: {
    section: 'bg-[var(--color-bg-canvas)]',
    title:   'text-[var(--color-text-title)]',
    sub:     'text-[var(--color-text-body)]',
    btn:     'bg-brand-blue text-white hover:bg-[var(--color-brand-blue-hover)] shadow-[var(--shadow-blue)]',
    btnSec:  'border border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white',
  },
  blue: {
    section: 'bg-brand-blue',
    title:   'text-white',
    sub:     'text-white/80',
    btn:     'bg-brand-gold text-(--color-bg-ink) hover:bg-brand-gold-hover shadow-(--shadow-gold)',
    btnSec:  'border border-white/40 text-white hover:bg-white/10',
  },
  gold: {
    section: 'bg-brand-gold',
    title:   'text-(--color-bg-ink)',
    sub:     'text-(--color-bg-ink)/70',
    btn:     'bg-(--color-bg-ink) text-white hover:bg-[#2d2d2d]',
    btnSec:  'border border-(--color-bg-ink)/30 text-(--color-bg-ink) hover:bg-(--color-bg-ink)/10',
  },
  ink: {
    section: 'bg-(--color-bg-ink)',
    title:   'text-white',
    sub:     'text-white/70',
    btn:     'bg-brand-gold text-(--color-bg-ink) hover:bg-brand-gold-hover shadow-(--shadow-gold)',
    btnSec:  'border border-white/30 text-white hover:bg-white/10',
  },
} satisfies Record<NonNullable<CTAContent['background']>, {
  section: string; title: string; sub: string; btn: string; btnSec: string
}>

export function CTASection({ content, hasBg = false }: Props) {
  const {
    title,
    subtitle,
    body,
    cta_text,
    cta_href,
    cta_secondary_label,
    cta_secondary_url,
    background = 'blue',
    align = 'center',
    image_url,
    image_alt,
    image_side = 'right',
  } = content

  const styles   = BG_STYLES[background]
  const hasImage = !!image_url
  const alignClass = align === 'left' ? 'text-left items-start' : 'text-center items-center'

  const textBlock = (
    <motion.div
      className={`flex flex-col gap-5 ${alignClass}`}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      <h2 className={`font-display font-black text-heading leading-tight tracking-tight ${styles.title} max-w-2xl`}>
        {renderTitle(title)}
      </h2>

      {subtitle && (
        <p className={`text-body-lg ${styles.sub} max-w-xl leading-relaxed`}>{subtitle}</p>
      )}

      {body && (
        <p className={`text-base ${styles.sub} max-w-xl leading-relaxed`}>{body}</p>
      )}

      <div className="flex flex-wrap gap-3">
        <Link
          href={cta_href}
          className={`inline-flex items-center justify-center h-12 px-10 rounded-full font-semibold text-sm transition-colors duration-(--transition-fast) ${styles.btn}`}
        >
          {cta_text}
        </Link>

        {cta_secondary_label && cta_secondary_url && (
          <Link
            href={cta_secondary_url}
            className={`inline-flex items-center justify-center h-12 px-8 rounded-full font-semibold text-sm transition-colors duration-(--transition-fast) ${styles.btnSec}`}
          >
            {cta_secondary_label}
          </Link>
        )}
      </div>
    </motion.div>
  )

  return (
    <section className={`${hasBg ? '' : styles.section} py-16 sm:py-20`}>
      <div className="mx-auto max-w-[var(--container-xl)] px-4 sm:px-6">
        {hasImage ? (
          // Layout com imagem — side by side
          <div className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-16 ${image_side === 'left' ? 'lg:flex-row-reverse' : ''}`}>
            <div className="flex-1">{textBlock}</div>
            <div className="flex-1 w-full">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-(--shadow-md)">
                <Image
                  src={image_url}
                  alt={image_alt ?? ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        ) : (
          // Layout centrado sem imagem
          <div className={`flex flex-col ${alignClass} gap-6`}>
            {textBlock}
          </div>
        )}
      </div>
    </section>
  )
}
