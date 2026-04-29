import Link from 'next/link'
import { motion } from 'framer-motion'
import type { CTAContent } from '@/types/cms'
import { fadeInUp } from '@/lib/animations'

interface Props {
  content: CTAContent
}

const BG_STYLES = {
  canvas: {
    section: 'bg-[var(--color-bg-canvas)]',
    title:   'text-[var(--color-text-title)]',
    sub:     'text-[var(--color-text-body)]',
    btn:     'bg-brand-blue text-white hover:bg-[var(--color-brand-blue-hover)] shadow-[var(--shadow-blue)]',
  },
  blue: {
    section: 'bg-brand-blue',
    title:   'text-white',
    sub:     'text-white/80',
    btn:     'bg-brand-gold text-(--color-bg-ink) hover:bg-brand-gold-hover shadow-(--shadow-gold)',
  },
  gold: {
    section: 'bg-brand-gold',
    title:   'text-(--color-bg-ink)',
    sub:     'text-(--color-bg-ink)/70',
    btn:     'bg-(--color-bg-ink) text-white hover:bg-white/10',
  },
  ink: {
    section: 'bg-(--color-bg-ink)',
    title:   'text-white',
    sub:     'text-white/70',
    btn:     'bg-brand-gold text-(--color-bg-ink) hover:bg-brand-gold-hover shadow-(--shadow-gold)',
  },
} satisfies Record<NonNullable<CTAContent['background']>, {
  section: string; title: string; sub: string; btn: string
}>

export function CTASection({ content }: Props) {
  const { title, subtitle, cta_text, cta_href, background = 'blue' } = content
  const styles = BG_STYLES[background]

  return (
    <section className={`${styles.section} py-16 sm:py-20`}>
      <motion.div
        className="mx-auto max-w-[var(--container-xl)] px-4 sm:px-6 flex flex-col items-center text-center gap-6"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <h2 className={`font-display font-black text-heading leading-tight tracking-tight ${styles.title} max-w-3xl`}>
          {title}
        </h2>

        {subtitle && (
          <p className={`text-body-lg ${styles.sub} max-w-xl leading-relaxed`}>{subtitle}</p>
        )}

        <Link
          href={cta_href}
          className={`inline-flex items-center justify-center h-12 px-10 rounded-full font-semibold text-sm transition-colors duration-(--transition-fast) ${styles.btn}`}
        >
          {cta_text}
        </Link>
      </motion.div>
    </section>
  )
}
