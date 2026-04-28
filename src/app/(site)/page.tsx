import { createClient } from '@/lib/supabase/server'
import { SectionRenderer } from '@/components/sections/SectionRenderer'
import type { PageSection } from '@/types/cms'

export const revalidate = 3600

export default async function HomePage() {
  const supabase = await createClient()

  const { data: page } = await supabase
    .from('pages')
    .select('id')
    .eq('slug', 'home')
    .eq('status', 'published')
    .single()

  if (!page) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h1 className="font-display font-black text-[var(--text-display)] leading-[var(--leading-tight)] tracking-[var(--tracking-tight)]">
          <span className="text-[var(--color-stone-accessible)]">3</span>
          <span className="text-brand-blue">6</span>
          <span className="text-brand-gold">0</span>
        </h1>
        <p className="mt-4 text-lg text-[var(--color-text-body)]">
          Em breve — o método que transforma quem lidera.
        </p>
      </div>
    )
  }

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
