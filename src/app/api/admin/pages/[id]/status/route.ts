import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const StatusSchema = z.object({
  status: z.enum(['published', 'draft']),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = StatusSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { data: pageData, error } = await supabase
    .from('pages')
    .update({
      status: parsed.data.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('slug')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Invalida cache do Vercel imediatamente ao publicar ou despublicar
  if (pageData?.slug) {
    const path = pageData.slug === 'home' ? '/' : `/${pageData.slug}`
    revalidatePath(path)
  }

  return NextResponse.json({ ok: true, status: parsed.data.status })
}
