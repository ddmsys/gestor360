import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'
import { createClient } from '@/lib/supabase/server'

interface Props {
  params: Promise<{ slug: string }>
}

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    'img', 'h1', 'h2', 'h3', 'h4', 'figure', 'figcaption',
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ['src', 'alt', 'width', 'height', 'loading'],
    a: ['href', 'title', 'target', 'rel'],
    '*': ['class'],
  },
  allowedSchemes: ['https', 'http', 'mailto'],
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) return { title: 'Post não encontrado | Gestor360®' }

  return {
    title: `${post.title} | Blog Gestor360®`,
    description: post.excerpt ?? undefined,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) notFound()

  const rawHtml = await marked.parse(post.content ?? '', { breaks: true })
  const safeHtml = sanitizeHtml(rawHtml, SANITIZE_OPTIONS)

  return (
    <main className="min-h-screen bg-[var(--color-bg-canvas)]">
      {post.cover_url && (
        <div className="w-full aspect-[21/9] relative overflow-hidden max-h-[480px] bg-[var(--color-bg-canvas)]">
          <Image src={post.cover_url} alt={post.title} fill className="object-cover" priority />
        </div>
      )}

      <article className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <div className="mb-8">
          <Link
            href="/blog"
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-body)] transition-colors"
          >
            ← Blog
          </Link>
        </div>

        <header className="mb-10">
          {post.published_at && (
            <p className="text-sm text-[var(--color-text-muted)] mb-3">
              {new Date(post.published_at).toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[var(--color-text-title)] leading-tight mb-4">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-xl text-[var(--color-text-body)] leading-relaxed">{post.excerpt}</p>
          )}
        </header>

        {/* Conteúdo sanitizado convertido de Markdown */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:font-display prose-headings:font-bold prose-headings:text-[var(--color-text-title)]
            prose-p:text-[var(--color-text-body)] prose-p:leading-relaxed
            prose-a:text-[var(--color-brand-blue)] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-[var(--color-text-title)]
            prose-blockquote:border-l-[var(--color-brand-gold)] prose-blockquote:text-[var(--color-text-body)]
            prose-li:text-[var(--color-text-body)]
            prose-hr:border-[var(--color-border)]"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />

        <footer className="mt-16 pt-8 border-t border-[var(--color-border)]">
          <Link
            href="/blog"
            className="text-sm font-semibold text-[var(--color-brand-blue)] hover:underline"
          >
            ← Ver todos os artigos
          </Link>
        </footer>
      </article>
    </main>
  )
}
