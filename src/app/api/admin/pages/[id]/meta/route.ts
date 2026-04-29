import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const MetaSchema = z.object({
  title:       z.string().min(1).max(120).optional(),
  description: z.string().max(300).optional(),
  og_image:    z.string().url().optional().or(z.literal('')),
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
  const parsed = MetaSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const updates: Record<string, string | null> = { updated_at: new Date().toISOString() }
  if (parsed.data.title       !== undefined) updates.title       = parsed.data.title
  if (parsed.data.description !== undefined) updates.description = parsed.data.description
  if (parsed.data.og_image    !== undefined) updates.og_image    = parsed.data.og_image || null

  const { error } = await supabase.from('pages').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
