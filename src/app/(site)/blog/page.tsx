import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Blog | Gestor360®',
  description: 'Artigos sobre liderança consciente, gestão e desenvolvimento para empresários.',
}

export default async function BlogPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('id, slug, title, excerpt, cover_url, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  return (
    <main className="min-h-screen bg-[var(--color-bg-canvas)]">
      <section className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
        <div className="mb-12">
          <h1 className="font-display font-black text-4xl sm:text-5xl text-[var(--color-text-title)] mb-4">
            Blog
          </h1>
          <p className="text-lg text-[var(--color-text-body)] max-w-xl">
            Artigos sobre liderança consciente, gestão e desenvolvimento para empresários.
          </p>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[var(--color-text-muted)]">Nenhum artigo publicado ainda.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow overflow-hidden"
              >
                {post.cover_url ? (
                  <div className="aspect-[16/9] relative overflow-hidden bg-[var(--color-bg-canvas)]">
                    <Image
                      src={post.cover_url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-blue)]/70" />
                )}
                <div className="p-5">
                  {post.published_at && (
                    <p className="text-xs text-[var(--color-text-muted)] mb-2">
                      {new Date(post.published_at).toLocaleDateString('pt-BR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                  <h2 className="font-display font-bold text-lg text-[var(--color-text-title)] mb-2 group-hover:text-[var(--color-brand-blue)] transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-[var(--color-text-body)] line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="mt-4 inline-block text-sm font-semibold text-[var(--color-brand-blue)]">
                    Ler artigo →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
