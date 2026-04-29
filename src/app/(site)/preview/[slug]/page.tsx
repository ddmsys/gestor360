import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SectionRenderer } from '@/components/sections/SectionRenderer'
import type { PageSection } from '@/types/cms'

// Rota de preview autenticada — mostra páginas draft ou published
// Acessível apenas por admins logados

interface Props {
  params: Promise<{ slug: string }>
}

export default async function PreviewPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  // Exige autenticação
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/preview/${slug}`)

  // Busca a página SEM filtro de status (draft + published)
  const { data: page } = await supabase
    .from('pages')
    .select('id, title, status')
    .eq('slug', slug)
    .single()

  if (!page) notFound()

  const { data: sections } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_id', page.id)
    .order('order_index')

  const allSections = (sections ?? []) as PageSection[]

  return (
    <>
      {/* Barra de preview */}
      <div className="fixed top-0 inset-x-0 z-50 flex items-center justify-between gap-3 px-4 py-2 bg-[#1A1A1A] text-white text-xs font-semibold border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span>Modo prévia — <span className="font-mono">{slug}</span></span>
          {page.status === 'draft' && (
            <span className="px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 text-[10px]">
              Rascunho
            </span>
          )}
        </div>
        <a
          href={`/admin/paginas/${page.id}`}
          className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
        >
          ← Voltar ao editor
        </a>
      </div>

      {/* Espaçador para a barra de preview */}
      <div className="h-9" />

      {/* Seções renderizadas normalmente */}
      {allSections
        .filter((s) => s.visible)
        .map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}

      {allSections.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-gray-400">
          <div className="text-4xl">📄</div>
          <p className="font-semibold">Nenhuma seção visível</p>
          <p className="text-sm">Adicione seções no editor e salve para visualizar aqui.</p>
        </div>
      )}
    </>
  )
}
