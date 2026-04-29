'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAllowedAdmin } from '@/lib/admin/auth'
import type { SectionType, SectionContent } from '@/types/cms'

const PAGES_SEED = [
  { slug: 'home',     title: 'Home',                description: 'O método que une razão e alma para transformar quem lidera.' },
  { slug: 'metodo',   title: 'O Método Gestor360®', description: 'Conheça o método completo de liderança consciente para empresários.' },
  { slug: 'sobre',    title: 'Sobre',               description: 'Quem está por trás do Gestor360® — autores, missão e história.' },
  { slug: 'mentoria', title: 'Mentoria',            description: 'Mentorias individuais e em grupo com os autores do Gestor360®.' },
  { slug: 'livro',    title: 'O Livro',             description: 'Manual do Gestor360® — disponível na DDM Editora.' },
]

export async function seedPaginas() {
  const supabase = await requireAdmin()
  const admin = createAdminClient()
  void supabase

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

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAllowedAdmin(user)) redirect('/login?error=unauthorized')
  return supabase
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

export async function updatePageMeta(id: string, formData: FormData) {
  const supabase = await requireAdmin()

  const title = str(formData, 'title')
  const description = str(formData, 'description') || null
  const og_image = str(formData, 'og_image') || null

  const { error } = await supabase
    .from('pages')
    .update({ title, description, og_image, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    redirect(`/admin/paginas/${id}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/paginas')
  revalidatePath(`/admin/paginas/${id}`)
  redirect(`/admin/paginas/${id}?success=dados-salvos`)
}

export async function togglePageStatus(id: string, currentStatus: string) {
  const supabase = await requireAdmin()
  const nextStatus = currentStatus === 'published' ? 'draft' : 'published'

  const { error } = await supabase
    .from('pages')
    .update({ status: nextStatus, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    redirect(`/admin/paginas/${id}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/paginas')
  revalidatePath(`/admin/paginas/${id}`)
  redirect(
    `/admin/paginas/${id}?success=${nextStatus === 'published' ? 'pagina-publicada' : 'pagina-despublicada'}`,
  )
}

export async function deletePage(id: string) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('pages').delete().eq('id', id)
  if (error) {
    redirect(`/admin/paginas?error=${encodeURIComponent(error.message)}`)
  }
  revalidatePath('/admin/paginas')
  redirect('/admin/paginas?success=pagina-removida')
}

export async function createSection(formData: FormData) {
  const supabase = await requireAdmin()

  const page_id = str(formData, 'page_id')
  const type = str(formData, 'type') as SectionType
  const contentRaw = str(formData, 'content_json')

  let content: SectionContent
  try {
    content = JSON.parse(contentRaw)
  } catch {
    redirect(
      `/admin/paginas/${page_id}/secoes/nova?type=${type}&error=${encodeURIComponent('JSON inválido — verifique a sintaxe.')}`,
    )
  }

  const { data: existing } = await supabase
    .from('page_sections')
    .select('order_index')
    .eq('page_id', page_id)
    .order('order_index', { ascending: false })
    .limit(1)

  const order_index = (existing?.[0]?.order_index ?? -1) + 1

  const { error } = await supabase
    .from('page_sections')
    .insert({ page_id, type, content, order_index, visible: true })

  if (error) {
    redirect(
      `/admin/paginas/${page_id}/secoes/nova?type=${type}&error=${encodeURIComponent(error.message)}`,
    )
  }

  revalidatePath(`/admin/paginas/${page_id}`)
  redirect(`/admin/paginas/${page_id}?success=secao-adicionada`)
}

export async function updateSection(formData: FormData) {
  const supabase = await requireAdmin()

  const section_id = str(formData, 'section_id')
  const page_id = str(formData, 'page_id')
  const contentRaw = str(formData, 'content_json')

  let content: SectionContent
  try {
    content = JSON.parse(contentRaw)
  } catch {
    redirect(
      `/admin/paginas/${page_id}/secoes/${section_id}?error=${encodeURIComponent('JSON inválido — verifique a sintaxe.')}`,
    )
  }

  const { error } = await supabase
    .from('page_sections')
    .update({ content })
    .eq('id', section_id)

  if (error) {
    redirect(
      `/admin/paginas/${page_id}/secoes/${section_id}?error=${encodeURIComponent(error.message)}`,
    )
  }

  revalidatePath(`/admin/paginas/${page_id}`)
  redirect(`/admin/paginas/${page_id}?success=secao-atualizada`)
}

export async function deleteSectionAction(sectionId: string, pageId: string) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('page_sections').delete().eq('id', sectionId)
  if (error) {
    redirect(`/admin/paginas/${pageId}?error=${encodeURIComponent(error.message)}`)
  }
  revalidatePath(`/admin/paginas/${pageId}`)
  redirect(`/admin/paginas/${pageId}?success=secao-removida`)
}

export async function toggleSectionVisibility(
  sectionId: string,
  visible: boolean,
  pageId: string,
) {
  const supabase = await requireAdmin()
  const { error } = await supabase
    .from('page_sections')
    .update({ visible: !visible })
    .eq('id', sectionId)
  if (error) {
    redirect(`/admin/paginas/${pageId}?error=${encodeURIComponent(error.message)}`)
  }
  revalidatePath(`/admin/paginas/${pageId}`)
  redirect(`/admin/paginas/${pageId}`)
}

export async function moveSectionUp(sectionId: string, pageId: string) {
  const supabase = await requireAdmin()

  const { data: section } = await supabase
    .from('page_sections')
    .select('order_index')
    .eq('id', sectionId)
    .single()

  if (!section) return redirect(`/admin/paginas/${pageId}`)

  const { data: prev } = await supabase
    .from('page_sections')
    .select('id, order_index')
    .eq('page_id', pageId)
    .lt('order_index', section.order_index)
    .order('order_index', { ascending: false })
    .limit(1)
    .single()

  if (!prev) return redirect(`/admin/paginas/${pageId}`)

  await Promise.all([
    supabase
      .from('page_sections')
      .update({ order_index: prev.order_index })
      .eq('id', sectionId),
    supabase
      .from('page_sections')
      .update({ order_index: section.order_index })
      .eq('id', prev.id),
  ])

  revalidatePath(`/admin/paginas/${pageId}`)
  redirect(`/admin/paginas/${pageId}`)
}

export async function moveSectionDown(sectionId: string, pageId: string) {
  const supabase = await requireAdmin()

  const { data: section } = await supabase
    .from('page_sections')
    .select('order_index')
    .eq('id', sectionId)
    .single()

  if (!section) return redirect(`/admin/paginas/${pageId}`)

  const { data: next } = await supabase
    .from('page_sections')
    .select('id, order_index')
    .eq('page_id', pageId)
    .gt('order_index', section.order_index)
    .order('order_index', { ascending: true })
    .limit(1)
    .single()

  if (!next) return redirect(`/admin/paginas/${pageId}`)

  await Promise.all([
    supabase
      .from('page_sections')
      .update({ order_index: next.order_index })
      .eq('id', sectionId),
    supabase
      .from('page_sections')
      .update({ order_index: section.order_index })
      .eq('id', next.id),
  ])

  revalidatePath(`/admin/paginas/${pageId}`)
  redirect(`/admin/paginas/${pageId}`)
}
