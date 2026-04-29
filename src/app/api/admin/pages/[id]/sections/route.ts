'use server'

import { createClient } from '@/lib/supabase/server'
import { SaveSectionsRequestSchema } from '@/lib/cms/style-schemas'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient()
  const { id: pageId } = await params

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: 'Não autorizado' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Body inválido' }, { status: 400 })
  }

  const parsed = SaveSectionsRequestSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { sections } = parsed.data

  // Deletar seções removidas (as que não vieram no payload)
  if (sections.length > 0) {
    const incomingIds = sections.map((s) => s.id)
    const { error: deleteError } = await supabase
      .from('page_sections')
      .delete()
      .eq('page_id', pageId)
      .not('id', 'in', `(${incomingIds.join(',')})`)

    if (deleteError) {
      return Response.json({ error: deleteError.message }, { status: 500 })
    }
  } else {
    // Sem seções: deletar todas da página
    await supabase.from('page_sections').delete().eq('page_id', pageId)
  }

  // Upsert com order_index = posição no array
  if (sections.length > 0) {
    const upsertData = sections.map((s, i) => ({
      id: s.id,
      page_id: pageId,
      type: s.type,
      order_index: i,
      content: s.content,
      style: s.style ?? {},
      visible: s.visible,
    }))

    const { error: upsertError } = await supabase
      .from('page_sections')
      .upsert(upsertData, { onConflict: 'id' })

    if (upsertError) {
      return Response.json({ error: upsertError.message }, { status: 500 })
    }
  }

  // Atualizar updated_at da página
  await supabase
    .from('pages')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', pageId)

  return Response.json({ ok: true, count: sections.length })
}
