import { motion } from 'framer-motion'
import type { TextContent } from '@/types/cms'
import { fadeInUp } from '@/lib/animations'

interface Props {
  content: TextContent
}

const BG_STYLES = {
  white:  'bg-(--color-bg-white)',
  canvas: 'bg-(--color-bg-canvas)',
  ink:    'bg-(--color-bg-ink)',
} satisfies Record<NonNullable<TextContent['bg']>, string>

const TEXT_STYLES = {
  white:  { title: 'text-(--color-text-title)', body: 'text-(--color-text-body)', badge: '' },
  canvas: { title: 'text-(--color-text-title)', body: 'text-(--color-text-body)', badge: '' },
  ink:    { title: 'text-white', body: 'text-white/70', badge: 'dark' },
} satisfies Record<NonNullable<TextContent['bg']>, { title: string; body: string; badge: string }>

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

export function TextSection({ content }: Props) {
  const {
    title,
    subtitle,
    body,
    align = 'left',
    max_width = 'md',
    bg = 'white',
    badge,
    badge_color = 'blue',
  } = content

  const bgStyle = BG_STYLES[bg]
  const textStyle = TEXT_STYLES[bg]
  const maxW = MAX_WIDTH[max_width]
  const badgeStyle = BADGE_COLORS[badge_color]

  const alignClass =
    align === 'center' ? 'text-center mx-auto' : align === 'right' ? 'text-right ml-auto' : ''

  return (
    <section className={`${bgStyle} py-16 sm:py-20`}>
      <motion.div
        className={`mx-auto max-w-[var(--container-xl)] px-4 sm:px-6`}
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className={`${maxW} ${alignClass}`}>
          {/* Badge / eyebrow */}
          {badge && (
            <span
              className={`inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest ${badgeStyle}`}
            >
              {badge}
            </span>
          )}

          {/* Título */}
          {title && (
            <h2
              className={`font-display font-black text-heading leading-tight tracking-tight ${textStyle.title} mb-4`}
            >
              {title}
            </h2>
          )}

          {/* Subtítulo */}
          {subtitle && (
            <p className={`text-body-lg ${textStyle.body} leading-relaxed mb-6`}>{subtitle}</p>
          )}

          {/* Corpo — suporte a markdown simples via whitespace */}
          {body && (
            <div
              className={`prose prose-lg max-w-none ${bg === 'ink' ? 'prose-invert' : ''} ${textStyle.body}`}
            >
              {body.split('\n\n').map((paragraph, i) => (
                <p key={i} className="leading-relaxed mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  )
}
