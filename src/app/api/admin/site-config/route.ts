import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const NavLinkSchema = z.object({
  href: z.string().min(1),
  label: z.string().min(1),
})

const NavSchema = z.object({
  links: z.array(NavLinkSchema),
  cta_label: z.string().min(1),
  cta_href: z.string().min(1),
})

const FooterSchema = z.object({
  tagline: z.string(),
  endereco: z.string(),
  email: z.string().email(),
  copyright: z.string(),
  nota_livro: z.string(),
})

const BodySchema = z.object({
  key: z.enum(['nav', 'footer']),
  value: z.unknown(),
})

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { key, value } = parsed.data

  const schema = key === 'nav' ? NavSchema : FooterSchema
  const valueParsed = schema.safeParse(value)
  if (!valueParsed.success) {
    return NextResponse.json({ error: valueParsed.error.flatten() }, { status: 422 })
  }

  const { error } = await supabase
    .from('site_config')
    .upsert({ key, value: valueParsed.data }, { onConflict: 'key' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  revalidatePath('/', 'layout')

  return NextResponse.json({ ok: true })
}
