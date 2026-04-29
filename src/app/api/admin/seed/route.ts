import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAllowedAdmin } from '@/lib/admin/auth'

const PAGES_SEED = [
  { slug: 'home',     title: 'Home',                 description: 'O método que une razão e alma para transformar quem lidera.' },
  { slug: 'metodo',   title: 'O Método Gestor360®',  description: 'Conheça o método completo de liderança consciente para empresários.' },
  { slug: 'sobre',    title: 'Sobre',                description: 'Quem está por trás do Gestor360® — autores, missão e história.' },
  { slug: 'mentoria', title: 'Mentoria',             description: 'Mentorias individuais e em grupo com os autores do Gestor360®.' },
  { slug: 'livro',    title: 'O Livro',              description: 'Manual do Gestor360® — disponível na DDM Editora.' },
]

const HOME_HERO_SECTION = {
  type: 'hero' as const,
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
}

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAllowedAdmin(user)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const admin = createAdminClient()

  // Upsert pages (slug é unique — não sobrescreve existentes)
  const results: Record<string, string> = {}
  for (const page of PAGES_SEED) {
    const { data, error } = await admin
      .from('pages')
      .upsert({ ...page, status: 'draft' }, { onConflict: 'slug', ignoreDuplicates: true })
      .select('id, slug')
      .single()

    if (error) {
      results[page.slug] = `erro: ${error.message}`
    } else {
      results[page.slug] = data ? `criado (${data.id})` : 'já existe'
    }
  }

  // Seed seção hero na home se não existir
  const { data: homePage } = await admin
    .from('pages')
    .select('id')
    .eq('slug', 'home')
    .single()

  if (homePage) {
    const { data: existingHero } = await admin
      .from('page_sections')
      .select('id')
      .eq('page_id', homePage.id)
      .eq('type', 'hero')
      .single()

    if (!existingHero) {
      await admin.from('page_sections').insert({ ...HOME_HERO_SECTION, page_id: homePage.id })
      results['home_hero_section'] = 'criado'
    } else {
      results['home_hero_section'] = 'já existe'
    }
  }

  return NextResponse.json({ ok: true, results })
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAllowedAdmin(user)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const admin = createAdminClient()
  const { data: pages, count } = await admin
    .from('pages')
    .select('slug, title, status', { count: 'exact' })
    .order('created_at')

  return NextResponse.json({ total_pages: count, pages })
}
