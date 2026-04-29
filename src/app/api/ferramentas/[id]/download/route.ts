import { NextResponse, type NextRequest } from 'next/server'
import { isAllowedAdmin } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

const FERRAMENTAS_BUCKET = 'ferramentas-pdf'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!isAllowedAdmin(user)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  const { data: ferramenta, error } = await supabase
    .from('ferramentas')
    .select('arquivo_path')
    .eq('id', id)
    .single<{ arquivo_path: string | null }>()

  if (error || !ferramenta?.arquivo_path) {
    return NextResponse.json(
      { error: 'Arquivo não encontrado para esta ferramenta.' },
      { status: 404 }
    )
  }

  const supabaseAdmin = createAdminClient()
  const { data, error: signedUrlError } = await supabaseAdmin.storage
    .from(FERRAMENTAS_BUCKET)
    .createSignedUrl(ferramenta.arquivo_path, 60 * 10, {
      download: true,
    })

  if (signedUrlError || !data?.signedUrl) {
    return NextResponse.json(
      { error: signedUrlError?.message ?? 'Não foi possível gerar o link de download.' },
      { status: 500 }
    )
  }

  return NextResponse.redirect(data.signedUrl)
}
