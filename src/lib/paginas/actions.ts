'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/admin/auth'

const PAGES_SEED = [
  { slug: 'home',         title: 'Home',                   description: 'O método que une razão e alma para transformar quem lidera.' },
  { slug: 'metodo',       title: 'O Método Gestor360®',    description: 'Conheça o método completo de liderança consciente para empresários.' },
  { slug: 'sobre',        title: 'Sobre',                  description: 'Quem está por trás do Gestor360® — autores, missão e história.' },
  { slug: 'mentoria',     title: 'Mentoria',               description: 'Mentorias individuais e em grupo com os autores do Gestor360®.' },
  { slug: 'livro',        title: 'O Livro',                description: 'Manual do Gestor360® — disponível na DDM Editora.' },
  { slug: 'ferramentas',  title: 'Ferramentas do Método',  description: 'As 31 ferramentas práticas do Gestor360® organizadas por capítulo.' },
]

export async function seedPaginas() {
  await requireAdmin()
  const admin = createAdminClient()

  for (const page of PAGES_SEED) {
    await admin
      .from('pages')
      .upsert({ ...page, status: 'draft' }, { onConflict: 'slug', ignoreDuplicates: true })
  }

  // Seção hero inicial para a home
  const { data: home } = await admin.from('pages').select('id').eq('slug', 'home').single()
  if (home) {
    const { data: existing } = await admin
      .from('page_sections')
      .select('id')
      .eq('page_id', home.id)
      .eq('type', 'hero')
      .single()

    if (!existing) {
      await admin.from('page_sections').insert({
        page_id: home.id,
        type: 'hero',
        order_index: 0,
        visible: true,
        content: {
          title: 'O método que transforma quem lidera',
          subtitle: 'Gestor360® — liderança consciente para pequenos e médios empresários brasileiros.',
          cta_label: 'Conhecer o método',
          cta_href: '/metodo',
          cta_secondary_label: 'Ferramentas gratuitas',
          cta_secondary_href: '/ferramentas',
        },
      })
    }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/paginas')
  redirect('/admin/paginas?success=seed-ok')
}

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim()
}

export async function createPage(formData: FormData) {
  const supabase = await requireAdmin()

  const title = str(formData, 'title')
  const slug = str(formData, 'slug')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  const description = str(formData, 'description') || null

  if (!slug || !title) {
    redirect('/admin/paginas/nova?error=campos-obrigatorios')
  }

  const { data, error } = await supabase
    .from('pages')
    .insert({ slug, title, description, status: 'draft' })
    .select('id')
    .single()

  if (error) {
    redirect(`/admin/paginas/nova?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/paginas')
  redirect(`/admin/paginas/${data.id}?success=pagina-criada`)
}
