import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAllowedAdmin } from '@/lib/admin/auth'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!isAllowedAdmin(user)) {
    return new NextResponse('Não autorizado', { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const capitulo = searchParams.get('capitulo')

  let query = supabase
    .from('leads')
    .select('nome, email, whatsapp, capitulo_origem, created_at')
    .order('created_at', { ascending: false })

  if (capitulo) {
    query = query.eq('capitulo_origem', Number(capitulo))
  }

  const { data: leads, error } = await query

  if (error) {
    return new NextResponse(error.message, { status: 500 })
  }

  const header = 'Nome,E-mail,WhatsApp,Capítulo de origem,Data\n'
  const rows = (leads ?? []).map((l) => {
    const date = new Date(l.created_at).toLocaleDateString('pt-BR')
    return [
      `"${l.nome}"`,
      `"${l.email}"`,
      `"${l.whatsapp ?? ''}"`,
      `"${l.capitulo_origem ?? ''}"`,
      `"${date}"`,
    ].join(',')
  })

  const csv = header + rows.join('\n')
  const filename = capitulo ? `leads-capitulo-${capitulo}.csv` : 'leads-gestor360.csv'

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
