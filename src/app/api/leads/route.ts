import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const leadSchema = z.object({
  nome: z.string().min(2).max(120).trim(),
  email: z.string().email().toLowerCase().trim(),
  whatsapp: z.string().regex(/^\+?[\d\s\-()]{10,15}$/, 'Número de WhatsApp inválido'),
  capitulo_origem: z.number().int().min(1).max(10).optional(),
  consent_source: z.string().min(1).max(100),
  metadata: z.record(z.string(), z.string()).optional().default({}),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const parsed = leadSchema.safeParse(body)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return NextResponse.json(
      { error: first?.message ?? 'Dados inválidos' },
      { status: 422 }
    )
  }

  const { nome, email, whatsapp, capitulo_origem, consent_source, metadata } = parsed.data

  const supabase = createAdminClient()

  const { error: dbError } = await supabase.from('leads').insert({
    nome,
    email,
    whatsapp,
    capitulo_origem: capitulo_origem ?? null,
    consent_source,
    consent_at: new Date().toISOString(),
    metadata: {
      ...metadata,
      user_agent: request.headers.get('user-agent') ?? '',
    },
  })

  if (dbError) {
    if (dbError.code === '23505') {
      return NextResponse.json(
        { mensagem: 'E-mail já cadastrado! Verifique sua caixa de entrada.' },
        { status: 200 }
      )
    }
    console.error('[api/leads] DB error:', dbError)
    return NextResponse.json(
      { error: 'Erro ao salvar. Tente novamente.' },
      { status: 500 }
    )
  }

  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import('resend')
      const { render } = await import('@react-email/render')
      const { default: BoasVindas } = await import('@/emails/BoasVindas')

      const resend = new Resend(process.env.RESEND_API_KEY)
      const html = await render(BoasVindas({ nome }))

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'noreply@ogestor360.com',
        to: email,
        subject: 'Suas ferramentas do Gestor360® chegaram 🎉',
        html,
      })
    } catch (emailError) {
      console.error('[api/leads] Email error (non-fatal):', emailError)
    }
  }

  return NextResponse.json(
    { mensagem: `Perfeito, ${nome}! Enviamos o link das ferramentas para o seu e-mail.` },
    { status: 201 }
  )
}
