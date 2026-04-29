'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin/auth'

const postSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hifens.'),
  title: z.string().trim().min(2).max(200),
  excerpt: z.string().trim().max(400).optional(),
  content: z.string().trim().min(1, 'Conteúdo é obrigatório.'),
  cover_url: z.string().trim().max(500).optional(),
  status: z.enum(['draft', 'published']),
})

function normalizeOptional(v: string | undefined) {
  return v && v.length > 0 ? v : null
}

export async function createPost(formData: FormData) {
  const supabase = await requireAdmin()

  const parsed = postSchema.safeParse({
    slug: formData.get('slug'),
    title: formData.get('title'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    cover_url: formData.get('cover_url'),
    status: formData.get('status'),
  })

  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? 'Dados inválidos.'
    redirect(`/admin/blog/novo?error=${encodeURIComponent(msg)}`)
  }

  const { slug, title, excerpt, content, cover_url, status } = parsed.data

  const { error } = await supabase.from('posts').insert({
    slug,
    title,
    excerpt: normalizeOptional(excerpt),
    content,
    cover_url: normalizeOptional(cover_url),
    status,
    published_at: status === 'published' ? new Date().toISOString() : null,
  })

  if (error) {
    const msg = error.code === '23505' ? 'Slug já em uso. Escolha outro.' : error.message
    redirect(`/admin/blog/novo?error=${encodeURIComponent(msg)}`)
  }

  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  redirect('/admin/blog?success=post-criado')
}

export async function updatePost(id: string, formData: FormData) {
  const supabase = await requireAdmin()

  const parsed = postSchema.safeParse({
    slug: formData.get('slug'),
    title: formData.get('title'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    cover_url: formData.get('cover_url'),
    status: formData.get('status'),
  })

  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? 'Dados inválidos.'
    redirect(`/admin/blog/${id}?error=${encodeURIComponent(msg)}`)
  }

  const { slug, title, excerpt, content, cover_url, status } = parsed.data

  const { data: existing } = await supabase
    .from('posts')
    .select('status, published_at')
    .eq('id', id)
    .single()

  const published_at =
    status === 'published' && existing?.status !== 'published'
      ? new Date().toISOString()
      : (existing?.published_at ?? null)

  const { error } = await supabase
    .from('posts')
    .update({
      slug,
      title,
      excerpt: normalizeOptional(excerpt),
      content,
      cover_url: normalizeOptional(cover_url),
      status,
      published_at,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    redirect(`/admin/blog/${id}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/blog')
  revalidatePath(`/admin/blog/${id}`)
  revalidatePath('/blog')
  redirect('/admin/blog?success=post-atualizado')
}

export async function deletePost(id: string) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) redirect(`/admin/blog?error=${encodeURIComponent(error.message)}`)
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
  redirect('/admin/blog?success=post-removido')
}
