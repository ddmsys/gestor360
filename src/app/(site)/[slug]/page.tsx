import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SectionRenderer } from '@/components/sections/SectionRenderer'
import type { PageSection } from '@/types/cms'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: page } = await supabase
    .from('pages')
    .select('title, description, og_image')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!page) return {}
  return {
    title: page.title,
    description: page.description ?? undefined,
    openGraph: { images: page.og_image ? [page.og_image] : undefined },
  }
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: page } = await supabase
    .from('pages')
    .select('id')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!page) notFound()

  const { data: sections } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_id', page.id)
    .eq('visible', true)
    .order('order_index')

  return (
    <>
      {(sections as PageSection[] ?? []).map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </>
  )
}
