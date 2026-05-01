'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import type { TextContent } from '@/types/cms'
import { fadeInUp } from '@/lib/animations'
import { renderTitle } from '@/lib/cms/render-title'

interface Props {
  content: TextContent
  hasBg?: boolean
}

const BG_STYLES = {
  white:  'bg-(--color-bg-white)',
  canvas: 'bg-(--color-bg-canvas)',
  ink:    'bg-(--color-bg-ink)',
} satisfies Record<NonNullable<TextContent['bg']>, string>

const TEXT_STYLES = {
  white:  { title: 'text-(--color-text-title)', body: 'text-(--color-text-body)', prose: '' },
  canvas: { title: 'text-(--color-text-title)', body: 'text-(--color-text-body)', prose: '' },
  ink:    { title: 'text-white',                body: 'text-white/70',             prose: 'prose-invert' },
} satisfies Record<NonNullable<TextContent['bg']>, { title: string; body: string; prose: string }>

const MAX_WIDTH = {
  sm:   'max-w-lg',
  md:   'max-w-2xl',
  lg:   'max-w-4xl',
  full: 'max-w-none',
} satisfies Record<NonNullable<TextContent['max_width']>, string>

const BADGE_COLORS = {
  blue:  'bg-brand-blue/10 text-brand-blue',
  gold:  'bg-brand-gold/10 text-brand-gold',
  stone: 'bg-(--color-brand-stone)/10 text-(--color-brand-stone)',
} satisfies Record<NonNullable<TextContent['badge_color']>, string>

const IMAGE_ASPECT = {
  '1:1':  'aspect-square',
  '4:3':  'aspect-4/3',
  '16:9': 'aspect-video',
} satisfies Record<NonNullable<TextContent['image_ratio']>, string>

const CTA_STYLES = {
  primary:   'bg-brand-blue text-white hover:bg-[var(--color-brand-blue-hover)] shadow-(--shadow-blue)',
  secondary: 'border border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white',
  ghost:     'text-brand-blue hover:underline',
} satisfies Record<NonNullable<TextContent['cta_style']>, string>

export function TextSection({ content, hasBg = false }: Props) {
  const {
    title,
    subtitle,
    body,
    align = 'left',
    max_width = 'md',
    bg = 'white',
    badge,
    badge_color = 'blue',
    image_url,
    image_alt,
    image_side = 'right',
    image_ratio = '4:3',
    cta_label,
    cta_url,
    cta_style = 'primary',
  } = content

  const bgStyle   = BG_STYLES[bg]
  const textStyle = TEXT_STYLES[bg]
  const maxW      = MAX_WIDTH[max_width]
  const badgeStyle = BADGE_COLORS[badge_color]
  const alignClass = align === 'center' ? 'text-center mx-auto' : align === 'right' ? 'text-right ml-auto' : ''
  const hasImage   = !!image_url

  const textBlock = (
    <motion.div
      className={`${maxW} ${hasImage ? '' : alignClass}`}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {badge && (
        <span className={`inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest ${badgeStyle}`}>
          {badge}
        </span>
      )}

      {title && (
        <h2 className={`font-display font-black text-heading leading-tight tracking-tight ${textStyle.title} mb-4`}>
          {renderTitle(title)}
        </h2>
      )}

      {subtitle && (
        <p className={`text-body-lg ${textStyle.body} leading-relaxed mb-6`}>{subtitle}</p>
      )}

      {body && (
        <div className={`prose prose-lg max-w-none ${textStyle.prose} ${textStyle.body}`}>
          <ReactMarkdown>{body}</ReactMarkdown>
        </div>
      )}

      {cta_label && cta_url && (
        <div className="mt-8">
          <Link
            href={cta_url}
            className={`inline-flex items-center justify-center h-11 px-8 rounded-full font-semibold text-sm transition-colors duration-(--transition-fast) ${CTA_STYLES[cta_style]}`}
          >
            {cta_label}
          </Link>
        </div>
      )}
    </motion.div>
  )

  return (
    <section className={`${hasBg ? '' : bgStyle} py-16 sm:py-20`}>
      <div className="mx-auto max-w-[var(--container-xl)] px-4 sm:px-6">
        {hasImage ? (
          <div className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-16 ${image_side === 'left' ? 'lg:flex-row-reverse' : ''}`}>
            <div className="flex-1">{textBlock}</div>
            <motion.div
              className="flex-1 w-full"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              <div className={`relative w-full ${IMAGE_ASPECT[image_ratio]} rounded-lg overflow-hidden shadow-(--shadow-md)`}>
                <Image
                  src={image_url}
                  alt={image_alt ?? ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </motion.div>
          </div>
        ) : (
          <div className={`flex flex-col ${alignClass}`}>
            {textBlock}
          </div>
        )}
      </div>
    </section>
  )
}
