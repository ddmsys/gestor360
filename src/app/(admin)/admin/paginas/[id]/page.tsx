import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageEditorClient } from '@/components/admin/PageEditorClient'
import type { PageSection } from '@/types/cms'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PageEditorPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: page, error: pageError }, { data: sections }] = await Promise.all([
    supabase.from('pages').select('*').eq('id', id).single(),
    supabase
      .from('page_sections')
      .select('*')
      .eq('page_id', id)
      .order('order_index', { ascending: true }),
  ])

  if (pageError || !page) notFound()

  return (
    <PageEditorClient
      page={{
        id:          page.id,
        title:       page.title,
        slug:        page.slug,
        status:      page.status,
        description: page.description ?? undefined,
        og_image:    page.og_image    ?? undefined,
      }}
      initialSections={(sections ?? []) as PageSection[]}
    />
  )
}
